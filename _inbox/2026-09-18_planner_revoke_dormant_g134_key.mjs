/**
 * Planner: revoke the DORMANT G-134 lane bastrop_tx key, at the operator's instruction.
 *   Operator, 2026-09-18: "if we dont need these delete them dormant G-134 lane key".
 *
 * Safety properties:
 *  - Reads the admin bootstrap key from Secret Manager at point of use. NEVER printed.
 *  - Refuses if the target key is not the exact expected key_id.
 *  - Refuses to touch the operator's pilot key or the G-154 lane key.
 *  - Refuses if the target was used recently (it must be DORMANT, as the operator said).
 *  - Prints only the public projection (ids, labels, timestamps). No value, ever.
 *  - Before AND after census, so the effect is read back rather than assumed.
 *
 * Run: node --use-system-ca _inbox/2026-09-18_planner_revoke_dormant_g134_key.mjs [--apply]
 */

import { execSync } from "node:child_process";
import fs from "node:fs";

const MCP = "https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app";
const PROJECT = "hauska-prod-497015";
const TARGET = "acf2cf9f-72ad-4008-9bf4-684a35470e99"; // G-134 lane verification (bastrop_tx)
const MUST_NOT_TOUCH = new Set([
  "2a26c318-271d-414c-967d-caba619a6f73", // operator's own staff-pilot key
  "2510a3ff-0d3c-47f4-8026-eadd6172b000", // G-154 lane key (see the separate decision)
  "96e40316-0907-49f3-8c6e-d47d9013f02e", // the minted verification key this program now uses
]);
const APPLY = process.argv.includes("--apply");
const DORMANT_MS = 60 * 60 * 1000; // used within the last hour => NOT dormant => refuse

function readSecret(name) {
  return execSync(
    `gcloud secrets versions access latest --secret=${name} --project=${PROJECT}`,
    { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
  ).trim();
}

const adminKey = readSecret("HAUSKA_ADMIN_BOOTSTRAP_KEY");
if (!adminKey) {
  console.error("FAIL CLOSED: admin bootstrap key read empty.");
  process.exit(2);
}
console.log(`admin key read: ${adminKey.length} bytes (value never printed)\n`);

async function census() {
  const r = await fetch(`${MCP}/admin/keys`, { headers: { "x-hauska-admin-key": adminKey } });
  if (r.status !== 200) {
    console.error(`FAIL CLOSED: GET /admin/keys -> ${r.status}`);
    process.exit(2);
  }
  const j = await r.json();
  const rows = (j.keys || j.data || j || []).filter((k) => k.jurisdiction_tenant === "bastrop_tx");
  return rows;
}

function show(rows, heading) {
  console.log(`=== ${heading} ===`);
  for (const k of rows) {
    console.log(
      `  ${k.key_id || k.id}  ${String(k.status)}  owner=${String(k.owner_name || k.label || "")}` +
        `  created=${k.created_at || ""}  last_used=${k.last_used_at || "(never)"}`
    );
  }
  console.log();
}

const before = await census();
show(before, "BEFORE — bastrop_tx keys (ACTIVE and REVOKED; this endpoint is not status-filtered)");

const target = before.find((k) => (k.key_id || k.id) === TARGET);
if (!target) {
  console.error(`FAIL CLOSED: target ${TARGET} is not returned by the census at all. Nothing revoked.`);
  process.exit(2);
}
if (MUST_NOT_TOUCH.has(TARGET)) {
  console.error("FAIL CLOSED: target is on the must-not-touch list.");
  process.exit(2);
}

/**
 * The verdict predicate is the STATUS FIELD, not presence in this list.
 * Learned the hard way on the first run of this instrument: the census returns
 * revoked rows too (2510a3ff sits in it, status "revoked"), so a presence test
 * reported "NOT REVOKED" while the status field already said revoked. Presence is
 * one input; status is the authoritative field. Do not regress this to `.some()`.
 */
const alreadyRevoked = String(target.status) === "revoked";
if (alreadyRevoked) {
  console.log(
    `target ${TARGET} is ALREADY REVOKED (last_used ${target.last_used_at || "(never)"}). ` +
      `No action taken; nothing to undo.`
  );
}

const lastUsed = target.last_used_at ? Date.parse(target.last_used_at) : NaN;
const age = Date.now() - lastUsed;
if (!alreadyRevoked && Number.isFinite(lastUsed) && age < DORMANT_MS) {
  console.error(
    `FAIL CLOSED: ${TARGET} was used ${Math.round(age / 60000)} min ago. The operator said DORMANT; ` +
      `this is not. Refusing to revoke a key something may be holding.`
  );
  process.exit(2);
}
console.log(`target confirmed: ${TARGET}  status=${target.status}`);
console.log(`  owner:     ${target.owner_name || target.label}`);
console.log(`  created:   ${target.created_at}`);
console.log(`  last_used: ${target.last_used_at || "(never)"}  -> DORMANT\n`);

if (!APPLY && !alreadyRevoked) {
  console.log("dry run: no revocation. Re-run with --apply to revoke.");
  process.exit(0);
}

let delStatus = null;
let delBody = "(no DELETE issued: already revoked)";
if (!alreadyRevoked) {
  const del = await fetch(`${MCP}/admin/keys/${TARGET}`, {
    method: "DELETE",
    headers: { "x-hauska-admin-key": adminKey },
  });
  delStatus = del.status;
  delBody = (await del.text()).slice(0, 300);
  console.log(`DELETE /admin/keys/${TARGET} -> ${del.status}`);
  console.log(`  body: ${delBody.slice(0, 200)}\n`);
}

const after = await census();
show(after, "AFTER — bastrop_tx keys");

const afterTarget = after.find((k) => (k.key_id || k.id) === TARGET);
const finalStatus = afterTarget ? String(afterTarget.status) : "(absent)";
const revoked = finalStatus === "revoked";
const out = {
  instrument: "_inbox/2026-09-18_planner_revoke_dormant_g134_key.mjs",
  at: new Date().toISOString(),
  instruction: 'operator 2026-09-18: "if we dont need these delete them dormant G-134 lane key"',
  target: TARGET,
  targetOwner: target.owner_name || target.label,
  targetCreated: target.created_at,
  targetLastUsed: target.last_used_at || null,
  alreadyRevokedBeforeThisRun: alreadyRevoked,
  deleteStatus: delStatus,
  deleteBody: delBody,
  before: before.map((k) => ({ id: k.key_id || k.id, status: k.status, owner: k.owner_name || k.label, lastUsed: k.last_used_at || null })),
  after: after.map((k) => ({ id: k.key_id || k.id, status: k.status, owner: k.owner_name || k.label, lastUsed: k.last_used_at || null })),
  verdictBasis: "the target row's status field read back from /admin/keys after the call, NOT its presence in the list",
  finalStatus,
  verdict: revoked ? "REVOKED — status field reads 'revoked'" : `NOT REVOKED — status field reads '${finalStatus}'`,
  keyPrinted: false,
};
fs.writeFileSync("_inbox/2026-09-18_planner_revoke_dormant_g134_key.json", JSON.stringify(out, null, 2));
console.log(`verdict: ${out.verdict}`);
console.log("wrote _inbox/2026-09-18_planner_revoke_dormant_g134_key.json");
process.exit(revoked ? 0 : 1);
