#!/usr/bin/env node
/**
 * Staff identity, verified at BOTH ends: the claims in a real WorkOS token, and whether the DEPLOYED
 * app actually accepts that token. G-135 / the 2026-09-14 staff-identity decision.
 *
 * WHY THIS EXISTS AS A FILE. The staff sign-in path has been configured in WorkOS Staging and never
 * once exercised with a real token. The two things in doubt (does `role` arrive as a string, does
 * `city_key` resolve to `bastrop_tx`) cannot be settled by reading the WorkOS dashboard, because the
 * dashboard shows what was CONFIGURED and the question is what the TOKEN CARRIES. Decoding one token
 * settles both, and probing the deployed app with it settles the third thing, which is whether any of
 * it is wired through. A shell one-liner answers the first two and cannot answer the third.
 *
 * Run: node --use-system-ca scripts/govtech/staff-identity-verify.mjs <token | token-file>
 *        [--base https://app.smartcityos.io] [--issuer <url>] [--tenant-claim city_key]
 *        [--role-claim role] [--domain fleet-vehicles] [--self-test]
 *
 * Read the self-test first if you doubt the instrument: it drives inspectClaims in BOTH directions on
 * synthetic tokens, including the two shapes that would silently pass a presence-shaped check (a role
 * delivered as an ARRAY, which a string check can be written to tolerate, and an `iss` that differs
 * only by a trailing slash).
 *
 * READ-ONLY. It sends GETs and writes nothing. The token is read from a file or argv and never
 * printed in full; the raw value appears nowhere in the output.
 */
import fs from "node:fs";

const ARGS = process.argv.slice(2);
const flag = (name, def = null) => {
  const i = ARGS.indexOf(name);
  return i === -1 ? def : (ARGS[i + 1] && !ARGS[i + 1].startsWith("--") ? ARGS[i + 1] : true);
};
const SELF_TEST = ARGS.includes("--self-test");
const BASE = String(flag("--base", "https://app.smartcityos.io")).replace(/\/$/, "");
const TENANT_CLAIM = String(flag("--tenant-claim", "city_key"));
const ROLE_CLAIM = String(flag("--role-claim", "role"));
const DOMAIN = String(flag("--domain", "fleet-vehicles"));
const ISSUER = flag("--issuer", process.env.SHELL_IDENTITY_PROVIDER || null);
const TOKEN_ARG = ARGS.find((a) => !a.startsWith("--") && a !== BASE && a !== ISSUER && a !== TENANT_CLAIM && a !== ROLE_CLAIM && a !== DOMAIN);

const NINE_ROLES = ["development-services", "finance", "public-works", "parks", "police", "fire-ems", "fleet", "city-manager", "admin"];
/* The same two fields the deployed code reads, so the two derivations are independent: this file
   decodes what WorkOS SIGNED, and the app has its own verifier. Agreement between them is the check. */
const KNOWN_ISSUER_SHAPE = /^https:\/\/api\.workos\.com\/user_management\/client_[A-Za-z0-9]+$/;

const failures = [];
const check = (ok, what) => { console.error(`${ok ? "PASS" : "FAIL"}: ${what}`); if (!ok) failures.push(what); };
const fail = (msg) => { console.error(`\nREFUSING: ${msg}`); process.exit(2); };

function decodeSegment(seg) {
  const pad = seg.length % 4 === 0 ? "" : "=".repeat(4 - (seg.length % 4));
  return JSON.parse(Buffer.from(seg.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64").toString("utf8"));
}

/**
 * Pure claim inspection, so the self-test can drive it without a network or a real token.
 * Returns { ok, problems[], facts{} }. Refuses rather than defaulting: an absent claim is a problem,
 * never an empty string.
 */
export function inspectClaims(payload, { issuer, tenantClaim, roleClaim, now = Date.now() }) {
  const problems = [];
  const facts = {};

  const iss = typeof payload?.iss === "string" ? payload.iss.trim() : "";
  facts.iss = iss;
  if (!iss) problems.push("the token carries no `iss`");
  else if (!issuer) problems.push("no issuer to compare against (set SHELL_IDENTITY_PROVIDER or --issuer)");
  else if (iss.replace(/\/$/, "") !== String(issuer).trim().replace(/\/$/, "")) problems.push(`iss "${iss}" is not the configured issuer "${issuer}"`);

  const role = payload?.[roleClaim];
  facts.role = role;
  if (role === undefined || role === null || role === "") problems.push(`the token carries no \`${roleClaim}\` claim`);
  else if (Array.isArray(role)) problems.push(`\`${roleClaim}\` is an ARRAY (${JSON.stringify(role)}); the deployed verifier requires a single string, so this token will be refused`);
  else if (typeof role !== "string") problems.push(`\`${roleClaim}\` is a ${typeof role}, not a string`);
  else if (!NINE_ROLES.includes(role)) problems.push(`\`${roleClaim}\` is "${role}", which is one of the nine roles WorkOS can issue, and a role this product does not know is a refusal rather than a downgrade`);

  const tenant = payload?.[tenantClaim];
  facts.tenant = tenant;
  if (tenant === undefined || tenant === null || tenant === "") problems.push(`the token carries no \`${tenantClaim}\` claim, so no pack can be resolved from it`);

  const exp = payload?.exp;
  facts.exp = exp;
  if (typeof exp !== "number") problems.push("the token carries no numeric `exp`");
  else if (exp * 1000 <= now) problems.push(`the token EXPIRED at ${new Date(exp * 1000).toISOString()}`);

  return { ok: problems.length === 0, problems, facts };
}

if (SELF_TEST) {
  const ISS = "https://api.workos.com/user_management/client_01M2X7GNPZ297887ZMZ8TVAFRX";
  const future = Math.floor(Date.now() / 1000) + 3600;
  const good = { iss: ISS, role: "parks", city_key: "bastrop_tx", exp: future };
  const cases = [
    ["a well-formed token passes", { ...good }, ISS, true],
    ["role as an ARRAY is refused", { ...good, role: ["parks"] }, ISS, false],
    ["role of the wrong TYPE is refused", { ...good, role: 7 }, ISS, false],
    ["a role outside the nine is refused", { ...good, role: "member" }, ISS, false],
    ["an absent role is refused", { ...good, role: undefined }, ISS, false],
    ["an empty-string role is refused", { ...good, role: "" }, ISS, false],
    ["a wrong issuer is refused", { ...good, iss: "https://api.workos.com/user_management/client_OTHER" }, ISS, false],
    ["an issuer differing by a trailing slash is ACCEPTED (the deployed code normalises it)", { ...good, iss: ISS + "/" }, ISS, true],
    ["a missing tenant claim is refused", { ...good, city_key: undefined }, ISS, false],
    ["an EMPTY tenant claim is refused (absence is not a tenant)", { ...good, city_key: "" }, ISS, false],
    ["an expired token is refused", { ...good, exp: Math.floor(Date.now() / 1000) - 60 }, ISS, false],
    ["a missing exp is refused", { ...good, exp: undefined }, ISS, false],
    ["no configured issuer is refused rather than skipped", { ...good }, null, false],
  ];
  let bad = 0;
  for (const [label, payload, iss, expect] of cases) {
    const got = inspectClaims(payload, { issuer: iss, tenantClaim: "city_key", roleClaim: "role" }).ok;
    const ok = got === expect;
    if (!ok) bad++;
    console.error(`${ok ? "PASS" : "FAIL"}: self-test ${label} (ok=${got}, expected ${expect})`);
  }
  if (bad) { console.error(`\n${bad} self-test case(s) FAILED; the instrument is not trustworthy.`); process.exit(2); }
  console.error(`\nSELF-TEST OK: ${cases.length}/${cases.length}. Both directions, and the two shapes that a presence-shaped check would wave through are caught.`);
  process.exit(0);
}

if (!TOKEN_ARG) fail("no token given. Pass the JWT itself, or a path to a file holding it.");
let token = TOKEN_ARG;
try { if (fs.existsSync(TOKEN_ARG)) token = fs.readFileSync(TOKEN_ARG, "utf8").trim(); } catch { /* it was the token itself */ }
token = String(token).trim().replace(/^["']|["']$/g, "");
if (token.split(".").length !== 3) fail(`that is not a JWT: it has ${token.split(".").length} segment(s), not 3. A masked or truncated paste reads as a shape error rather than as a login failure.`);

console.log(`# staff-identity-verify | ${new Date().toISOString()}`);
console.log(`# token: ${token.length} chars, sha256_12=${(await import("node:crypto")).createHash("sha256").update(token).digest("hex").slice(0, 12)} (the raw value is not printed)`);

/* ---------- leg A: what the token CARRIES ---------- */
const header = decodeSegment(token.split(".")[0]);
const payload = decodeSegment(token.split(".")[1]);
console.log(`\n## A. the claims WorkOS signed`);
console.log(`   alg=${header.alg} kid=${header.kid}`);
const inspection = inspectClaims(payload, { issuer: ISSUER, tenantClaim: TENANT_CLAIM, roleClaim: ROLE_CLAIM });
console.log(`   iss      = ${inspection.facts.iss}`);
console.log(`   ${ROLE_CLAIM.padEnd(8)} = ${JSON.stringify(inspection.facts.role)}  (${Array.isArray(inspection.facts.role) ? "ARRAY" : typeof inspection.facts.role})`);
console.log(`   ${TENANT_CLAIM.padEnd(8)} = ${JSON.stringify(inspection.facts.tenant)}`);
console.log(`   exp      = ${inspection.facts.exp ? new Date(inspection.facts.exp * 1000).toISOString() : "(absent)"}`);
for (const p of inspection.problems) console.error(`   PROBLEM: ${p}`);

/* ---------- leg B: does the DEPLOYED app accept it ---------- */
const get = async (path, headers = {}) => {
  const r = await fetch(`${BASE}${path}`, { headers: { "user-agent": "staff-identity-verify", ...headers }, redirect: "manual" });
  const text = await r.text();
  let json = null; try { json = JSON.parse(text); } catch { /* html refusals are expected */ }
  return { status: r.status, json, text };
};

console.log(`\n## B. the deployed surface at ${BASE}`);
const withToken = await get(`/api/domains/${DOMAIN}`, { Authorization: `Bearer ${token}` });
console.log(`   with the bearer, NO cityKey   -> HTTP ${withToken.status}${withToken.json ? `  cityKey=${withToken.json.cityKey}  status=${withToken.json.status}  records=${withToken.json.recordCount}` : ""}`);
const noToken = await get(`/api/domains/${DOMAIN}`);
console.log(`   without any bearer            -> HTTP ${noToken.status}`);
const tampered = token.slice(0, -2) + (token.slice(-2) === "aa" ? "bb" : "aa");
const withTampered = await get(`/api/domains/${DOMAIN}`, { Authorization: `Bearer ${tampered}` });
console.log(`   with a TAMPERED bearer        -> HTTP ${withTampered.status}`);

console.log(`\n## verdict`);
check(inspection.ok, "the token's claims are all present, well-typed and current");
check(withToken.status === 200, `the DEPLOYED app accepts the token and resolves a tenant from its \`${TENANT_CLAIM}\` claim alone, with no cityKey in the query`);
if (withToken.status === 200) {
  check(withToken.json?.cityKey === inspection.facts.tenant, `the tenant the app resolved (${withToken.json?.cityKey}) IS the one in the token (${inspection.facts.tenant})`);
}
check(noToken.status !== 200, "the same route WITHOUT the bearer is refused, so the 200 above is the token working and not the route being open");
check(withTampered.status !== 200, "a TAMPERED bearer is refused, so the signature is actually verified and the 200 is not a decode-only path");

if (failures.length) fail(`${failures.length} check(s) failed`);
console.log(`\nVERIFIED: the claims are right AND the deployed app enforces them. Sign-in is wired end to end.`);
