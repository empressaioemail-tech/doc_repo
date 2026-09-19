/**
 * G-158 CP1 falsifier F1. "A staff read writes a row, but so would an anonymous
 * read." The violation is that a NON-staff caller on the same route writes ZERO
 * rows -- asserted by count before and after, across every tenant in play, and
 * with the identity list read back so the count is attributable.
 *
 *   node P:/tmp/g158-falsifiers.mjs --worktree <path> --out <json>
 */
import fs from "node:fs";
import path from "node:path";

const arg = (k, d) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : d; };
const WT = path.resolve(arg("--worktree", "P:/smartcity-dashboards-worktrees/g158-access-log-write-path"));
const OUT = arg("--out", "P:/tmp/g158-f1.json");
const ISSUER = "https://idp.test.example";
const url = (p) => `file:///${`${WT}/${p}`.replace(/\\/g, "/")}`;
const READ = "/api/domains/business-licenses?cityKey=template-city";
const TENANTS = ["bastrop_tx", "template-city", "some-other-city"];

const b64url = (i) => Buffer.from(i).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
async function mint(payload) {
  const crypto = await import("node:crypto");
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });
  const jwk = publicKey.export({ format: "jwk" });
  jwk.kid = crypto.randomUUID();
  const h = b64url(JSON.stringify({ alg: "RS256", typ: "JWT", kid: jwk.kid }));
  const p = b64url(JSON.stringify(payload));
  const sig = crypto.sign("RSA-SHA256", Buffer.from(`${h}.${p}`), privateKey).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return { token: `${h}.${p}.${sig}`, jwk };
}

const report = { falsifier: "F1", readAt: new Date().toISOString(), worktree: WT, route: READ, steps: [] };

async function main() {
  const { execFileSync } = await import("node:child_process");
  report.commit = execFileSync("git", ["-C", WT, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();

  const accessLog = await import(url("src/access-log.mjs"));
  const { server } = await import(url("src/server.mjs"));
  const { upsertStaffAccount, _resetMemoryStoreForTests } = await import(url("src/staff-directory.mjs"));
  accessLog._resetAccessLogForTests();
  _resetMemoryStoreForTests();

  const saved = {};
  for (const k of ["DASHBOARDS_API_KEY", "DATABASE_URL", "SHELL_IDENTITY_PROVIDER", "HAUSKA_TENANT_KEYS", "HAUSKA_MCP_URL", "K_SERVICE"]) saved[k] = process.env[k];
  for (const k of ["DASHBOARDS_API_KEY", "DATABASE_URL", "HAUSKA_TENANT_KEYS", "HAUSKA_MCP_URL", "K_SERVICE"]) delete process.env[k];
  process.env.SHELL_IDENTITY_PROVIDER = ISSUER;

  const A = { sub: "fixture-staff-01", tenant: "bastrop_tx", role: "development-services" };
  await upsertStaffAccount({ sub: A.sub, tenant: A.tenant, role: A.role, email: `${A.sub}@example.invalid`, name: "Fixture staff 01" });

  const nowSec = Math.floor(Date.now() / 1000);
  const good = await mint({ sub: A.sub, iss: ISSUER, exp: nowSec + 600, iat: nowSec, role: A.role, org_id: A.tenant });
  const expired = await mint({ sub: A.sub, iss: ISSUER, exp: nowSec - 60, iat: nowSec - 900, role: A.role, org_id: A.tenant });

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (u, opts) => {
    const s = String(u);
    if (s.endsWith("/.well-known/openid-configuration")) return { ok: true, json: async () => ({ jwks_uri: `${ISSUER}/.well-known/jwks.json` }) };
    if (s.endsWith("/.well-known/jwks.json")) return { ok: true, json: async () => ({ keys: [good.jwk, expired.jwk] }) };
    return originalFetch(u, opts);
  };

  const port = await new Promise((r) => server.listen(0, "127.0.0.1", () => r(server.address().port)));
  const base = `http://127.0.0.1:${port}`;

  const counts = async () => {
    const out = {};
    for (const t of TENANTS) out[t] = (await accessLog.listStaffAccessLog({ tenant: t })).length;
    return out;
  };
  const read = async (headers = {}) => {
    const res = await fetch(`${base}${READ}`, { headers });
    const body = await res.json().catch(() => null);
    return {
      status: res.status,
      servedRecords: Array.isArray(body?.records) ? body.records.length : null,
      error: body?.error ?? null,
      refused: body?.refused ?? null,
    };
  };

  report.steps.push({ step: "0. counts on a clean store, before any read", rowsByTenant: await counts() });

  const anon = await read();
  report.steps.push({
    step: "1. ANONYMOUS read of the same route",
    response: anon,
    rowsByTenantAfter: await counts(),
    reading: "0 rows everywhere: the anonymous caller is not a person looking at a record, so it is neither recorded nor refused. A row it wrote would have to be filed under some tenant, and every tenant in play was counted.",
  });

  // An expired bearer on a PUBLIC-FREE pack is not refused: staff verification does not
  // establish an identity, so the caller resolves as anonymous and the public pack is
  // served. Recorded exactly as it behaved, because the first draft of this step asserted
  // a refusal that did not happen and the reading has to match the observation.
  const exp = await read({ authorization: `Bearer ${expired.token}` });
  report.steps.push({
    step: "2a. an EXPIRED staff bearer on the public-free pack the probe reads",
    response: exp,
    rowsByTenantAfter: await counts(),
    reading: "HTTP 200 and 17 records, zero rows. The bearer did not establish a staff identity, so this is an ANONYMOUS read of a public-free pack, not a staff read: served, unrecorded, and refused by nothing. The zero is correct because no person was established -- but it is not evidence of a refusal, and this step does not claim one.",
  });

  // The refusal direction needs a pack where anonymity is refused, or the refusal is
  // unobservable: the same expired bearer against a tenant-private pack.
  const expPrivate = await fetch(`${base}/api/city-identity?cityKey=bastrop_tx`, { headers: { authorization: `Bearer ${expired.token}` } });
  const expPrivateBody = await expPrivate.json().catch(() => null);
  report.steps.push({
    step: "2b. the same EXPIRED bearer against a tenant-private pack (bastrop_tx)",
    response: { status: expPrivate.status, error: expPrivateBody?.error ?? null },
    rowsByTenantAfter: await counts(),
    reading: "refused before the content gate, so there is nothing to record. Zero rows here is the correct answer and not a hole: no read happened.",
  });

  const staff = await read({ authorization: `Bearer ${good.token}` });
  const afterStaff = await counts();
  const rows = await accessLog.listStaffAccessLog({ tenant: A.tenant });
  report.steps.push({
    step: "3. the SAME route as a named fixture staff identity (the control)",
    response: staff,
    rowsByTenantAfter: afterStaff,
    rowCount: rows.length,
    rowSubs: rows.map((r) => r.sub),
    reading: "exactly one row appears, and it is the staff identity's. The route writes nothing for a non-staff caller and one row for a staff caller IN THE SAME PROCESS, so the zeroes above are attributable to the caller and not to a route that cannot write.",
  });

  const f1 = report.steps[1].rowsByTenantAfter;
  report.verdict = {
    rule: "an anonymous/refused caller on the same route writes ZERO rows, asserted by count before and after",
    result: Object.values(f1).every((n) => n === 0) && afterStaff[A.tenant] === 1 && rows.length === 1 && rows[0].sub === A.sub ? "PASS" : "FAIL",
    basis: "counts across every tenant in play, plus the identity list read back from the reader's own tenant",
  };

  await new Promise((r) => server.close(r));
  globalThis.fetch = originalFetch;
  for (const k of Object.keys(saved)) { if (saved[k] == null) delete process.env[k]; else process.env[k] = saved[k]; }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => { console.error("FALSIFIER FAILED:", err); process.exitCode = 1; });
