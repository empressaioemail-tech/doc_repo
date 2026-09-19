/**
 * G-158 access-log probe. ONE script, run against two refs, so the pre-fix and
 * post-fix states are measured by the SAME instrument rather than by two that
 * could quietly disagree.
 *
 *   node P:/tmp/g158-probe.mjs --worktree <path> --label <name> --out <json>
 *
 * It does four things, in this order:
 *   1. searches the worktree's src/ for an access-log write path, using the
 *      design's own pattern and reporting its denominator (files read);
 *   2. drives a REAL staff read over HTTP through the product's own server,
 *      with a fixture staff identity minted the way src/server.test.mjs mints one;
 *   3. counts the rows the access log holds for that reader's tenant afterwards;
 *   4. counts the rows it holds for a DIFFERENT tenant, which is the scoping
 *      direction, and writes one JSON artifact.
 *
 * The distinction it refuses to collapse: at a ref with no access-log store the
 * row count is UNMEASURABLE (there is no store to read), not zero. A zero and an
 * absent instrument must not look the same.
 */
import fs from "node:fs";
import path from "node:path";

const arg = (k, d) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : d; };
const WT = path.resolve(arg("--worktree", "P:/smartcity-dashboards-worktrees/g158-access-log-write-path"));
const LABEL = arg("--label", "unlabelled");
const OUT = arg("--out", `P:/tmp/g158-probe-${LABEL}.json`);
const ISSUER = "https://idp.test.example";
const files = (p) => `${WT}/${p}`.replace(/\\/g, "/");
const url = (p) => `file:///${files(p)}`;

const report = {
  label: LABEL,
  worktree: WT,
  readAt: new Date().toISOString(),
  commit: null,
  accessLogSourceSearch: null,
  staffRead: null,
  rowsForReaderTenant: null,
  rowsForOtherTenant: null,
  unmeasurable: [],
};

function b64url(input) {
  return Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

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

async function main() {
  const { execFileSync } = await import("node:child_process");
  report.commit = execFileSync("git", ["-C", WT, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  report.branch = execFileSync("git", ["-C", WT, "rev-parse", "--abbrev-ref", "HEAD"], { encoding: "utf8" }).trim();

  // ---- 1. the source search, with its own denominator --------------------
  const ACCESS_LOG_PATTERN = /(access_log|accessLog|audit_log|auditLog|recordRead|logRead|read_log|who_viewed)/;
  const srcDir = path.join(WT, "src");
  const scanned = [];
  const walk = (dir, rel) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const r = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) walk(path.join(dir, e.name), r);
      else if (e.name.endsWith(".mjs") && !e.name.includes(".test.")) scanned.push(r);
    }
  };
  walk(srcDir, "src");
  const hits = [];
  for (const f of scanned) {
    if (ACCESS_LOG_PATTERN.test(fs.readFileSync(path.join(WT, f), "utf8"))) hits.push(f);
  }
  report.accessLogSourceSearch = {
    pattern: String(ACCESS_LOG_PATTERN),
    countingRule: "every .mjs under src/ recursively, excluding any file whose name contains '.test.' -- the same denominator dump-source-state.mjs uses (git ls-tree -r REF src/)",
    filesScanned: scanned.length,
    matchedFiles: hits,
    accessLogWritePath: hits.length > 0,
  };

  // ---- 2. a real staff read over the product's own server ----------------
  let accessLog = null;
  try {
    accessLog = await import(url("src/access-log.mjs"));
  } catch (err) {
    report.unmeasurable.push(
      `no access-log module at this ref (${err.code || err.message}) -- the row counts below are UNMEASURABLE, not zero, because there is no store to read`,
    );
  }

  const { server } = await import(url("src/server.mjs"));
  const { upsertStaffAccount, _resetMemoryStoreForTests } = await import(url("src/staff-directory.mjs"));
  if (accessLog?._resetAccessLogForTests) accessLog._resetAccessLogForTests();
  _resetMemoryStoreForTests();

  const saved = {};
  for (const k of ["DASHBOARDS_API_KEY", "DATABASE_URL", "SHELL_IDENTITY_PROVIDER", "HAUSKA_TENANT_KEYS", "HAUSKA_MCP_URL"]) saved[k] = process.env[k];
  delete process.env.DASHBOARDS_API_KEY;
  delete process.env.HAUSKA_TENANT_KEYS;
  delete process.env.HAUSKA_MCP_URL;
  delete process.env.DATABASE_URL;
  process.env.SHELL_IDENTITY_PROVIDER = ISSUER;

  // Two fixture identities, both on the reserved example.invalid domain, in two
  // different cities. Two, because a scoping claim tested with one identity is
  // not tested.
  const A = { sub: "fixture-staff-01", tenant: "bastrop_tx", role: "development-services" };
  const B = { sub: "fixture-staff-02", tenant: "some-other-city", role: "police" };
  await upsertStaffAccount({ sub: A.sub, tenant: A.tenant, role: A.role, email: `${A.sub}@example.invalid`, name: "Fixture staff 01" });
  await upsertStaffAccount({ sub: B.sub, tenant: B.tenant, role: B.role, email: `${B.sub}@example.invalid`, name: "Fixture staff 02" });

  const nowSec = Math.floor(Date.now() / 1000);
  const ta = await mint({ sub: A.sub, iss: ISSUER, exp: nowSec + 600, iat: nowSec, role: A.role, org_id: A.tenant });
  const tb = await mint({ sub: B.sub, iss: ISSUER, exp: nowSec + 600, iat: nowSec, role: B.role, org_id: B.tenant });

  const jwksByKid = {};
  for (const t of [ta, tb]) jwksByKid[t.jwk.kid] = t.jwk;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (u, opts) => {
    const s = String(u);
    if (s.endsWith("/.well-known/openid-configuration")) return { ok: true, json: async () => ({ jwks_uri: `${ISSUER}/.well-known/jwks.json` }) };
    if (s.endsWith("/.well-known/jwks.json")) return { ok: true, json: async () => ({ keys: Object.values(jwksByKid) }) };
    return originalFetch(u, opts);
  };

  const port = await new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server.address().port)));
  const base = `http://127.0.0.1:${port}`;
  const READ = "/api/domains/business-licenses?cityKey=template-city";

  async function drive(token, sub, tenant) {
    const res = await fetch(`${base}${READ}`, { headers: { authorization: `Bearer ${token}` } });
    const body = await res.json().catch(() => null);
    return {
      who: sub,
      tenant,
      route: READ,
      status: res.status,
      servedRecords: Array.isArray(body?.records) ? body.records.length : null,
      payloadKeys: body && typeof body === "object" ? Object.keys(body).sort() : null,
      error: body?.error ?? null,
      message: body?.message ?? null,
      recordCount: body?.recordCount ?? null,
    };
  }

  report.staffRead = { reader: await drive(ta.token, A.sub, A.tenant) };

  if (accessLog?.listStaffAccessLog) {
    const forA = await accessLog.listStaffAccessLog({ tenant: A.tenant });
    report.rowsForReaderTenant = { tenant: A.tenant, count: forA.length, rows: forA };

    // ---- 2b. a SECOND identity, because a scoping claim tested with one is not tested
    report.secondIdentityRead = await drive(tb.token, B.sub, B.tenant);
    const forB = await accessLog.listStaffAccessLog({ tenant: B.tenant });
    report.rowsForOtherTenant = { tenant: B.tenant, count: forB.length, rows: forB };
    report.crossTenantViolation = {
      question: `does ${A.sub}'s read appear in ${B.tenant}'s list, or the reverse?`,
      aSubRowsVisibleToB: forB.filter((r) => r.sub === A.sub).length,
      bSubRowsVisibleToA: forA.filter((r) => r.sub === B.sub).length,
      verdict: forB.some((r) => r.sub === A.sub) || forA.some((r) => r.sub === B.sub) ? "LEAKED" : "scoped",
    };

    // ---- 2c. THE PLANT: a deployment with no durable store must REFUSE the read
    const before = (await accessLog.listStaffAccessLog({ tenant: A.tenant })).length;
    process.env.K_SERVICE = "smartcity-dashboards";
    let planted;
    try {
      const res = await fetch(`${base}${READ}`, { headers: { authorization: `Bearer ${ta.token}` } });
      const body = await res.json().catch(() => null);
      planted = {
        status: res.status,
        error: body?.error ?? null,
        reason: body?.reason ?? null,
        refused: body?.refused ?? null,
        servedRecords: Array.isArray(body?.records) ? body.records.length : null,
        anyRecordContent: /business-license|recordType|recordCount/i.test(JSON.stringify(body ?? {})),
      };
    } finally {
      delete process.env.K_SERVICE;
    }
    const after = (await accessLog.listStaffAccessLog({ tenant: A.tenant })).length;
    report.forcedLogFailure = {
      how: "K_SERVICE set with DATABASE_URL unset: the deployment has no durable store, so the write cannot happen. Forced through the environment, not through a mock, and it is the only failure this product can raise in the log without also breaking pack resolution.",
      response: planted,
      verdict:
        planted.status >= 500 && planted.servedRecords === null && planted.anyRecordContent === false && after === before
          ? "REFUSED, and no records served"
          : "SERVED ANYWAY -- the defect wearing the new code",
      rowsBefore: before,
      rowsAfter: after,
    };

    // ---- 2d. and back on a deployment that can record it, the same read is served again
    report.recoveredRead = await drive(ta.token, A.sub, A.tenant);
    report.rowsForReaderTenantAfter = (await accessLog.listStaffAccessLog({ tenant: A.tenant })).length;
  } else {
    report.unmeasurable.push("listStaffAccessLog absent at this ref: the row counts were NOT taken and are not reported as 0");
  }

  await new Promise((resolve) => server.close(resolve));
  globalThis.fetch = originalFetch;
  for (const k of Object.keys(saved)) {
    if (saved[k] == null) delete process.env[k];
    else process.env[k] = saved[k];
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report, null, 2));
}

// No process.exit(): on Windows, exiting while libuv is tearing down the server
// and fetch handles aborts the process (UV_HANDLE_CLOSING), which would report a
// crash for a probe that succeeded. Setting exitCode lets the loop drain.
main().catch((err) => {
  console.error("PROBE FAILED:", err);
  process.exitCode = 1;
});
