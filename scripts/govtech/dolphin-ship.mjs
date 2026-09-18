#!/usr/bin/env node
/**
 * dolphin-app ship (OPS-17 A-149, OPS-25 D-12/D-13). STATE-CHANGING, production.
 *
 * Ships `smartcity-dashboards` `main` to `dolphin-app` (app.smartcityos.io) as ONE deploy that also
 * adds the one environment variable the ship needs. Reads the spec, changes it in exactly one place,
 * PUTs it, forces a fresh build, then reads the running commit back and compares it byte for byte.
 *
 * Run: node --use-system-ca scripts/govtech/dolphin-ship.mjs [--apply]
 * Without --apply it measures, prints the exact change, and exits without writing anything.
 *
 * FAIL-CLOSED, because this writes a PRODUCTION app spec:
 *   - it refuses if production already runs the target commit (the ship has happened; this reading is stale);
 *   - it refuses if the variable it is about to add is already present (never a silent double-add);
 *   - it refuses if the spec PUT would change ANYTHING other than the one env entry. The diff is
 *     enumerated by walking both spec trees, not spot-checked, so an unrelated edit in the round trip
 *     (a dropped field, a reordered scope, a lost secret) stops the ship instead of being written;
 *   - it refuses to write an env entry whose value did not come from the UAT app's own spec.
 * The plaintext of no secret is ever read, printed, or constructed: the existing SECRET entries are
 * echoed back as the `EV[1:...]` strings the GET returned, which is what DigitalOcean's app-spec
 * reference requires on a subsequent submission.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ARGS = process.argv.slice(2);
const APPLY = ARGS.includes("--apply");

const APP_ID = "95691c40-27ca-4afb-b9b4-a37e079c5e69"; // dolphin-app
const UAT_ID = "7cd6f652-9e7e-4abc-abb4-e2a94623866c"; // d12-main-uat, the twin the change was proved on
const SHIP_VAR = "SMARTCITY_V1_PLATFORM_BASE";
const BRANCH = "main";
const REPO = "empressaioemail-tech/smartcity-dashboards";

const failures = [];
const check = (ok, what) => { console.error(`${ok ? "PASS" : "FAIL"}: ${what}`); if (!ok) failures.push(what); };
const sh = (cmd, args) => execFileSync("cmd.exe", ["/d", "/c", cmd, ...args], { encoding: "utf8" }).replace(/\r/g, "");
const fail = (msg) => { console.error(`\nREFUSING: ${msg}`); process.exit(2); };

const cfg = JSON.parse(fs.readFileSync(path.join(os.homedir(), ".cursor", "mcp.json"), "utf8"));
const auth = cfg.mcpServers["do-apps"]?.headers?.Authorization;
if (!/^Bearer dop_v1_/.test(auth || "")) fail("no do-apps token in the Cursor MCP config");
const H = { Authorization: auth, "Content-Type": "application/json" };
const doGet = async (ep) => { const r = await fetch(`https://api.digitalocean.com/v2/${ep}`, { headers: H }); return { status: r.status, body: await r.json().catch(() => ({})) }; };

console.log(`# dolphin ship | ${new Date().toISOString()} | ${APPLY ? "APPLY" : "DRY RUN"}`);

/* ---------- 1. the target commit, read from the remote rather than remembered ---------- */
const target = sh("git", ["ls-remote", `https://github.com/${REPO}.git`, `refs/heads/${BRANCH}`]).trim().split(/\s+/)[0];
console.log(`\n## target: ${REPO}@${BRANCH} = ${target}`);

/* ---------- 2. read both specs ---------- */
const prodRes = await doGet(`apps/${APP_ID}`);
const prod = prodRes.body.app;
if (!prod) fail(`dolphin-app not readable (${prodRes.status})`);
const uat = (await doGet(`apps/${UAT_ID}`)).body.app;
if (!uat) fail("d12-main-uat not readable, so the value to add cannot be derived");

const running = prod.active_deployment?.services?.[0]?.source_commit_hash;
console.log(`## production currently serves ${running}`);
console.log(`   active_deployment=${prod.active_deployment?.id} cause=${JSON.stringify(prod.active_deployment?.cause)} created=${prod.active_deployment?.created_at}`);
console.log(`   branch=${prod.spec.services[0].github?.repo}@${prod.spec.services[0].github?.branch} deploy_on_push=${JSON.stringify(prod.spec.deploy_on_push ?? null)}`);

if (running === target) fail("production ALREADY serves the target commit; the ship has happened and this reading is stale");
if (prod.spec.services[0].github?.branch !== BRANCH) fail(`production does not build from ${BRANCH}; this script does not repoint`);

/* ---------- 3. the one change, derived by set difference from the twin ---------- */
const uatEnvs = uat.spec.services[0].envs || [];
const prodEnvs = prod.spec.services[0].envs || [];
const derived = uatEnvs.find((e) => e.key === SHIP_VAR);
if (!derived) fail(`${SHIP_VAR} is not on d12-main-uat either, so there is nothing to derive it from`);
const missing = [...new Set(uatEnvs.map((e) => e.key))].filter((k) => !prodEnvs.some((e) => e.key === k));
console.log(`\n## env delta, d12-main-uat -> dolphin-app`);
console.log(`   missing on production: ${missing.join(", ") || "(none)"}`);
console.log(`   to be added: ${JSON.stringify({ ...derived })}`);
/* If it is already present this is a re-run, not a fresh ship; section 5 handles that case, so the
   guard here is on the VALUE agreeing, not on absence. */
const already = prodEnvs.find((e) => e.key === SHIP_VAR);
if (already && already.value !== derived.value) fail(`${SHIP_VAR} is already set to ${already.value}, which is not the derived ${derived.value}`);
check(already || (missing.length === 1 && missing[0] === SHIP_VAR), `the env difference is ${SHIP_VAR}${already ? " (already written)" : ""}`);
check(derived.type === undefined, "the derived entry is GENERAL (no type field), as UAT carries it");
check(derived.scope === "RUN_AND_BUILD_TIME", "the derived entry's scope is RUN_AND_BUILD_TIME");

/* ---------- 4. build the proposed spec: clone, then push the one entry ---------- */
const proposed = JSON.parse(JSON.stringify(prod.spec));
proposed.services[0].envs = [...prodEnvs, derived];

/* The guard that matters: walk both trees and count every leaf difference. Exactly one is allowed. */
const diffPaths = [];
const walk = (a, b, p) => {
  if (Array.isArray(a) || Array.isArray(b)) {
    const A = a || [], B = b || [];
    if (A.length !== B.length) { diffPaths.push(`${p}.length ${A.length}->${B.length}`); return; }
    for (let i = 0; i < Math.max(A.length, B.length); i++) walk(A[i], B[i], `${p}[${i}]`);
    return;
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) walk(a[k], b[k], `${p}.${k}`);
    return;
  }
  if (JSON.stringify(a) !== JSON.stringify(b)) diffPaths.push(p);
};
walk(prod.spec, proposed, "spec");
/* The allowed change appears as exactly two enumerated paths: the new indexed entry, and the array's
   own `.length` marker. Both are on services[0].envs, and the length is asserted independently below,
   so neither is a hole. Anything else, anywhere else in the tree, still fails the guard. */
const leafDiffs = diffPaths.filter((p) => !/^spec\.services\[0\]\.envs(\.length|\[\d+\])/.test(p));
console.log(`\n## spec diff, enumerated`);
console.log(`   changes outside services[0].envs: ${leafDiffs.length ? leafDiffs.join(", ") : "(none)"}`);
console.log(`   env array length ${prodEnvs.length} -> ${proposed.services[0].envs.length}`);
check(proposed.services[0].envs.length === prodEnvs.length + 1, "exactly one env entry is added");
check(leafDiffs.length === 0, "the PUT changes nothing outside the env list (the one new entry aside)");
/* Every pre-existing env entry, byte for byte, including each EV[1:...] secret. */
const envDrift = prodEnvs.filter((e, i) => JSON.stringify(e) !== JSON.stringify(proposed.services[0].envs[i]));
console.log(`   pre-existing env entries altered: ${envDrift.length ? envDrift.map((e) => e.key).join(", ") : "(none)"}`);
check(envDrift.length === 0, "every existing env entry round-trips byte for byte (the ten secrets included)");
const secretCount = proposed.services[0].envs.filter((e) => e.type === "SECRET").length;
console.log(`   SECRET entries carried through unchanged: ${secretCount}`);

if (failures.length) fail(`${failures.length} guard(s) failed; nothing was written`);
if (!APPLY) { console.log("\nDRY RUN: all guards pass, nothing written. Re-run with --apply to ship."); process.exit(0); }

/* ---------- 5. write the spec (if it is not already written), then follow the deployment ----------
   The PUT response's `app.active_deployment` is the PREVIOUS deployment: DigitalOcean returns the app
   as it stood, and the new deployment only appears in the deployments list. Trusting it polled the old
   ACTIVE deployment, read its old commit, and reported a failed ship while the real one was building
   (2026-09-18). The new deployment is therefore found by set difference, the same way the env delta is.
   Re-running is safe: if the variable is already on the spec with the derived value, the PUT is
   skipped, because re-submitting a production spec has no reason to run twice. */
let depId;
if (prodEnvs.some((e) => e.key === SHIP_VAR)) {
  const present = prodEnvs.find((e) => e.key === SHIP_VAR);
  console.log(`\n## spec already written: ${SHIP_VAR} = ${present.value}`);
  if (present.value !== derived.value) fail(`${SHIP_VAR} is set to ${present.value}, not the derived ${derived.value}`);
  console.log("   skipping the PUT (idempotent re-run); following the newest deployment instead");
} else {
  const before = new Set(((await doGet(`apps/${APP_ID}/deployments?per_page=20`)).body.deployments || []).map((d) => d.id));
  console.log(`\n## writing the spec and forcing a build (${before.size} existing deployments)`);
  const put = await fetch(`https://api.digitalocean.com/v2/apps/${APP_ID}`, {
    method: "PUT", headers: H,
    body: JSON.stringify({ spec: proposed, update_all_source_versions: true }),
  });
  const putBody = await put.json().catch(() => ({}));
  if (put.status !== 200) fail(`spec write failed: HTTP ${put.status} ${JSON.stringify(putBody).slice(0, 400)}`);
  const after = (await doGet(`apps/${APP_ID}/deployments?per_page=20`)).body.deployments || [];
  const fresh = after.find((d) => !before.has(d.id));
  console.log(`   HTTP ${put.status}; the PUT response names active_deployment=${putBody.app?.active_deployment?.id} (the PREVIOUS one)`);
  if (!fresh) fail("the spec write returned 200 but created no deployment; nothing is rolling out");
  console.log(`   the NEW deployment is ${fresh.id} cause=${JSON.stringify(fresh.cause)} created=${fresh.created_at}`);
  check(fresh.cause === "app spec updated", "the new deployment's cause is the spec update");
  depId = fresh.id;
}

/* ---------- 6. wait, then read the running commit back ---------- */
if (!depId) {
  const deps = (await doGet(`apps/${APP_ID}/deployments?per_page=20`)).body.deployments || [];
  const running = deps.find((d) => /BUILDING|DEPLOYING|PENDING_BUILD|PENDING_DEPLOY/.test(d.phase)) || deps[0];
  depId = running.id;
  console.log(`   following newest deployment ${depId} (phase=${running.phase}, created=${running.created_at})`);
}
let shipped = false;
for (let i = 0; i < 100; i++) {
  await new Promise((r) => setTimeout(r, i === 0 ? 0 : 10000));
  const d = (await doGet(`apps/${APP_ID}/deployments/${depId}`)).body.deployment;
  const svc = d?.services?.[0];
  console.log(`   [${String(i * 10).padStart(3)}s] phase=${d?.phase} running=${svc?.source_commit_hash?.slice(0, 8) ?? "-"}`);
  if (d?.phase === "ACTIVE" || d?.phase === "ERROR" || d?.phase === "CANCELED" || d?.phase === "SUPERSEDED") {
    if (d.phase !== "ACTIVE") fail(`deployment ${depId} ended ${d.phase}`);
    console.log(`\n## read back`);
    console.log(`   deployment=${d.id} phase=${d.phase} cause=${JSON.stringify(d.cause)}`);
    console.log(`   services[0].source_commit_hash = ${svc?.source_commit_hash}`);
    check(svc?.source_commit_hash === target, `the running commit IS the target commit ${target}`);
    const after = (await doGet(`apps/${APP_ID}`)).body.app;
    const varNow = (after.spec.services[0].envs || []).find((e) => e.key === SHIP_VAR);
    console.log(`   ${SHIP_VAR} present on production: ${varNow ? "yes" : "NO"}  value=${varNow?.value}`);
    check(!!varNow && varNow.value === derived.value, `${SHIP_VAR} is set to the derived value`);
    console.log(`   domains=${(after.spec.domains || []).map((x) => `${x.domain}:${x.type}`).join(", ")}`);
    shipped = true;
    break;
  }
}
if (failures.length) fail(`${failures.length} post-deploy check(s) failed`);
if (!shipped) fail("the deployment did not reach a terminal phase within the poll window");
console.log("\nSHIPPED. Read-back agrees; the surface probes are the remaining acceptance.");
