/**
 * Planner's own source probe for G-135's minted bastrop_tx credential.
 *
 * Written by the SmartCity planner seat (integration, P:/doc_repo), NOT by the
 * g135-mint lane. Purpose: the 2026-09-18 handoff says a `g135-mint` close is
 * verified "at source: ... a probe script reading the key from Secret Manager
 * gets 200 on `bastrop_tx` and 401 without the key. Never print the value."
 * This is that independent instrument.
 *
 * Rules honoured:
 *  - The key is read at point of use and NEVER printed, written or hashed out.
 *    Only its byte length is reported, which is not the secret.
 *  - Every cell declares its EXPECTED value before the run. A cell that returns
 *    its expected value is not evidence on its own; see the controls.
 *  - Controls that must FAIL for the claim to hold: D (401 keyless) and E (401
 *    garbage). A gate that lets an empty string through would make C meaningless.
 *  - F is the tenant-scoping discriminator: the SAME key against fixture-city,
 *    the other tenant-private pack, must be 403. If it were 200 the credential
 *    would be a master key and C would prove nothing about tenancy.
 *  - G and H are surface-liveness controls: 200 keyless on the public pack, 404
 *    on an unknown city. If G failed, a 4xx anywhere would be unreadable.
 *
 * Run: node --use-system-ca _inbox/2026-09-18_planner_g135_credential_probe.mjs
 */

import { execSync } from "node:child_process";
import fs from "node:fs";

const SECRET = "hauska-tenant-key-bastrop-tx-lane-verification";
const PROJECT = "hauska-prod-497015";
const MCP = "https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app";
const UAT = "https://d12-main-uat-gqnjx.ondigitalocean.app";
const GARBAGE = "not-a-real-key-0000000000000000000000000000";

// ---- read the credential at point of use. Never printed. ----
let key = "";
try {
  key = execSync(
    `gcloud secrets versions access 1 --secret=${SECRET} --project=${PROJECT}`,
    { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
  ).trim();
} catch (e) {
  console.error("FAIL CLOSED: could not read the credential from Secret Manager.");
  console.error(`  ${SECRET} @ ${PROJECT}, version 1`);
  process.exit(2);
}
if (!key) {
  console.error("FAIL CLOSED: the secret exists but returned an empty value. An empty");
  console.error("value would make every 'with key' cell below a keyless request.");
  process.exit(2);
}
console.log(`credential read: ${key.length} bytes (value never printed)\n`);

const cells = [
  // label, url, headers, expectedStatus, expectedNote
  ["A  whoami WITH key (MCP)", `${MCP}/auth/whoami`, { "x-hauska-key": key }, 200, "anonymous:false, bastrop_tx"],
  ["B  whoami no key (MCP control)", `${MCP}/auth/whoami`, {}, 200, "anonymous:true"],
  ["C  bastrop_tx WITH key", `${UAT}/api/city-domains?cityKey=bastrop_tx`, { "x-hauska-key": key }, 200, "the claim under test"],
  ["D  bastrop_tx NO key (must fail)", `${UAT}/api/city-domains?cityKey=bastrop_tx`, {}, 401, "gate is live"],
  ["E  bastrop_tx GARBAGE key (must fail)", `${UAT}/api/city-domains?cityKey=bastrop_tx`, { "x-hauska-key": GARBAGE }, 401, "gate is not lenient"],
  ["F  fixture-city SAME key (other tenant)", `${UAT}/api/city-domains?cityKey=fixture-city`, { "x-hauska-key": key }, 403, "tenant-scoped, not a master key"],
  ["G  template-city no key (liveness)", `${UAT}/api/city-domains?cityKey=template-city`, {}, 200, "public pack answers"],
  ["H  no-such-city WITH key (liveness)", `${UAT}/api/city-domains?cityKey=no-such-city`, { "x-hauska-key": key }, 404, "unknown city is 404, not 401"],
];

const results = [];
let pass = 0;

for (const [label, url, headers, expected, note] of cells) {
  const row = { label, url, expected, expectedNote: note, status: null, body: null, verdict: "FAIL", err: null };
  try {
    const r = await fetch(url, { headers, redirect: "follow" });
    const text = await r.text();
    row.status = r.status;
    let j = null;
    try { j = JSON.parse(text); } catch {}
    row.body = j ? JSON.stringify(j).slice(0, 120) : text.slice(0, 120);
    row.verdict = r.status === expected ? "PASS" : "FAIL";
    if (row.verdict === "PASS") pass++;
  } catch (e) {
    row.err = `${e?.name}: ${e?.message}`;
  }
  results.push(row);
  const mark = row.verdict === "PASS" ? "PASS" : "FAIL";
  console.log(`  ${mark}  ${label.padEnd(40)} got=${row.status ?? "ERR"} want=${expected}   ${row.err ?? row.body ?? ""}`);
}

console.log(`\n${pass}/${cells.length} cells returned their declared expectation.`);

const out = {
  instrument: "_inbox/2026-09-18_planner_g135_credential_probe.mjs",
  writtenBy: "SmartCity planner seat (integration), not the g135-mint lane",
  readAt: new Date().toISOString(),
  secretRef: `projects/${PROJECT}/secrets/${SECRET}/versions/1`,
  keyBytes: key.length,
  keyPrinted: false,
  cells: results,
  pass,
  total: cells.length,
  verdict: pass === cells.length ? "PASS" : "FAIL",
};
fs.writeFileSync("_inbox/2026-09-18_planner_g135_credential_probe.json", JSON.stringify(out, null, 2));
console.log("wrote _inbox/2026-09-18_planner_g135_credential_probe.json");
process.exit(pass === cells.length ? 0 : 1);
