#!/usr/bin/env node
/**
 * dolphin-app ship preflight (OPS-17 A-149, OPS-25 D-12/D-13). READ-ONLY.
 *
 * Answers the three questions the ship cannot be performed without, from source rather than memory:
 *   1. how far apart production and the UAT twin are, in the app spec and in the running commit;
 *   2. exactly which environment variable the ship has to add (DERIVED by set difference, never typed);
 *   3. whether the credential the dashboards present to the v1 platform is one it will accept.
 *
 * It does not deploy, does not write an app spec, and never prints a secret value. Exit 0 means every
 * check passed and the ship is safe to perform; exit 2 means do not ship on this output.
 *
 * Run: node --use-system-ca scripts/govtech/dolphin-ship-preflight.mjs
 *
 * WHY THE KEY CHECK IS BEHAVIOURAL. DigitalOcean returns `type: SECRET` env values encrypted (an
 * `EV[1:...]` string), and the same plaintext encrypts differently on every app, so comparing
 * ciphertexts proves nothing in either direction. The gate in `smartcity-os` `server/routes/mygov.ts`
 * is an exact string compare plus a 503 when unset, so parity is provable by presentation: the
 * canonical value is accepted by both hosts and a one-character mutation is rejected by both. The
 * mutation is the control that makes a 200 mean something.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const APP = {
  prod: "95691c40-27ca-4afb-b9b4-a37e079c5e69", // dolphin-app, app.smartcityos.io
  uat: "7cd6f652-9e7e-4abc-abb4-e2a94623866c",  // d12-main-uat, the twin the change was proved on
  v1: "2a2a3a1a-b441-4296-8628-a82b20ded1b2",   // walrus-app, smartcityos.io, the v1 platform
};
const SHIP_VAR = "SMARTCITY_V1_PLATFORM_BASE";
const PLATFORM_ROUTE = "/api/platform/mygov/permits";
const GCP_V1 = "https://smartcity-api-7dyaiy7wha-uc.a.run.app";

const failures = [];
const check = (ok, what) => { console.error(`selftest ${ok ? "PASS" : "FAIL"}: ${what}`); if (!ok) failures.push(what); };
const sh = (cmd, args) => execFileSync("cmd.exe", ["/d", "/c", cmd, ...args], { encoding: "utf8" }).replace(/\r/g, "");

const cfg = JSON.parse(fs.readFileSync(path.join(os.homedir(), ".cursor", "mcp.json"), "utf8"));
const auth = cfg.mcpServers["do-apps"]?.headers?.Authorization;
if (!/^Bearer dop_v1_/.test(auth || "")) { console.error("no do-apps token in the Cursor MCP config; refusing"); process.exit(2); }
const doGet = async (ep) => { const r = await fetch(`https://api.digitalocean.com/v2/${ep}`, { headers: { Authorization: auth } }); return { status: r.status, body: await r.json().catch(() => ({})) }; };
const get = async (url, headers = {}) => { try { const r = await fetch(url, { headers }); return r.status; } catch (e) { return `ERR ${e.message}`; } };

console.log(`# dolphin ship preflight | read ${new Date().toISOString()}`);
console.log(`# doc_repo ${sh("git", ["-C", path.resolve(path.dirname(new URL(import.meta.url).pathname.slice(1)), "..", ".."), "rev-parse", "--short", "HEAD"]).trim()}`);

/* ---------- 1. remote heads: what the ship would actually build ---------- */
const heads = {};
for (const repo of ["smartcity-dashboards", "smartcity-os"]) {
  const out = sh("git", ["ls-remote", `https://github.com/empressaioemail-tech/${repo}.git`, "refs/heads/main"]).trim();
  heads[repo] = out.split(/\s+/)[0];
  console.log(`\n## ${repo} origin/main = ${heads[repo]}`);
}

/* ---------- 2. the apps ---------- */
const spec = {};
for (const [label, id] of Object.entries(APP)) {
  const r = await doGet(`apps/${id}`);
  const a = r.body.app;
  if (!a) { console.log(`\n## ${label}: NOT READABLE (${r.status})`); continue; }
  spec[a.spec.name] = a;
  console.log(`\n## ${label} (${a.spec.name})`);
  console.log(`   deploy_on_push=${JSON.stringify(a.spec.deploy_on_push ?? null)}  (null/undefined = DISABLED, so a merge deploys nothing)`);
  console.log(`   domains=${(a.spec.domains || []).map((d) => `${d.domain}:${d.type}`).join(", ") || "-"}`);
  console.log(`   active_deployment=${a.active_deployment?.id} cause=${JSON.stringify(a.active_deployment?.cause)} created=${a.active_deployment?.created_at}`);
  for (const kind of ["services", "workers", "jobs", "static_sites"]) for (const c of a.spec[kind] || []) {
    const run = (a.active_deployment?.[kind] || []).find((x) => x.name === c.name);
    console.log(`   ${kind} ${c.name}: ${c.github?.repo}@${c.github?.branch} count=${c.instance_count} health=${c.health_check?.http_path ?? "NONE"} running=${run?.source_commit_hash?.slice(0, 8) ?? "-"}`);
  }
}

/* ---------- 3. the ship's env delta, as a set difference ---------- */
const prodApp = spec["dolphin-app"], uatApp = spec["d12-main-uat"];
const keysOf = (app) => new Set((app.spec.services[0].envs || []).map((e) => e.key));
if (prodApp && uatApp) {
  const missing = [...keysOf(uatApp)].filter((k) => !keysOf(prodApp).has(k));
  const extra = [...keysOf(prodApp)].filter((k) => !keysOf(uatApp).has(k));
  console.log(`\n## env delta, d12-main-uat -> dolphin-app`);
  console.log(`   on UAT, MISSING on production: ${missing.join(", ") || "(none)"}`);
  console.log(`   on production, not on UAT:     ${extra.join(", ") || "(none)"}`);
  check(missing.length === 1 && missing[0] === SHIP_VAR, `the ship's env delta is exactly ${SHIP_VAR}`);
  const uatValue = (uatApp.spec.services[0].envs || []).find((e) => e.key === SHIP_VAR)?.value;
  console.log(`   the value to mirror (GENERAL, no type field): ${uatValue}`);
  check(typeof uatValue === "string" && uatValue.startsWith("https://"), "the mirrored base is an https URL");
} else check(false, "both dashboards apps were readable");

/* ---------- 4. key parity, by presentation and by violation ---------- */
let key = "";
try { key = sh("gcloud", ["secrets", "versions", "access", "latest", "--secret=platform-internal-api-key", "--project=smartcity-os-prod"]).trim(); } catch { /* reported below */ }
if (!key) check(false, "the canonical platform-internal key was readable (needed for the parity proof)");
else {
  const mutate = (s) => { const a = [...s]; const i = Math.floor(a.length / 2); a[i] = a[i] === "A" ? "B" : "A"; return a.join(""); };
  const bad = mutate(key);
  const v1 = await get("https://smartcityos.io" + PLATFORM_ROUTE, { Authorization: `Bearer ${key}` });
  const v1Bad = await get("https://smartcityos.io" + PLATFORM_ROUTE, { Authorization: `Bearer ${bad}` });
  const v1None = await get("https://smartcityos.io" + PLATFORM_ROUTE);
  const gcp = await get(GCP_V1 + PLATFORM_ROUTE, { Authorization: `Bearer ${key}` });
  const gcpBad = await get(GCP_V1 + PLATFORM_ROUTE, { Authorization: `Bearer ${bad}` });
  console.log(`\n## platform-internal-api-key parity (len=${key.length}; the value is never printed)`);
  console.log(`   walrus-app         ${PLATFORM_ROUTE}  canonical=${v1}  mutated=${v1Bad}  keyless=${v1None}`);
  console.log(`   gcp smartcity-api  ${PLATFORM_ROUTE}  canonical=${gcp}  mutated=${gcpBad}`);
  check(v1 === 200 && gcp === 200, "the canonical key is accepted by BOTH walrus-app and the GCP host production reads today");
  check(v1Bad === 401 && gcpBad === 401, "a one-character mutation is rejected by both, so a 200 is not just any request");
}

/* ---------- 5. what production serves today ---------- */
const prodCommit = prodApp?.active_deployment?.services?.[0]?.source_commit_hash;
const live = await get("https://app.smartcityos.io/");
console.log(`\n## production serves ${prodCommit?.slice(0, 8) ?? "-"} and answers ${live} at https://app.smartcityos.io/`);
check(typeof live === "number" && live < 500, "the production dashboards surface answers a request");
check(prodCommit !== heads["smartcity-dashboards"], "production is NOT already on dashboards main (if it is, the ship has happened and this reading is stale)");

/* ---------- 6. the instrument can fail ---------- */
const bogus = await doGet("apps/00000000-0000-4000-8000-000000000000");
check(bogus.status !== 200, "a nonexistent app id does not return 200, so a 200 means the app exists");

if (failures.length) { console.error(`\n${failures.length} check(s) failed; do not ship on this output.`); process.exitCode = 2; }
else console.log("\nPASS every preflight check agrees. The ship is one environment variable and one deploy.");
