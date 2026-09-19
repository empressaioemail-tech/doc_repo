#!/usr/bin/env node
/**
 * Force a DigitalOcean App Platform app to redeploy its branch HEAD, and prove it did.
 * OPS-25 D-12 posture + program.md rule 12 + OPS-17 A-170/A-149. STATE-CHANGING, production.
 *
 * Why this exists. All three SmartCity apps carry `deploy_on_push` UNSET, deliberately: a merge
 * deploys nothing and shipping is a deliberate act. The remedy rule 12 names for "the app is not
 * running what you merged" is `POST /v2/apps/{id}/deployments` with `force_build`, which re-resolves
 * the branch. `dolphin-ship.mjs` does that as a side effect of writing an app spec; it cannot be used
 * to ship a plain code change, because its one allowed diff is the env entry it derives from the UAT
 * twin and that entry is already written. This is the generic form.
 *
 * Run: node --use-system-ca scripts/govtech/do-deploy.mjs --app <name|id> [--apply] [--self-test]
 * Without --apply it reads, names the target, and exits without writing anything.
 *
 * WHY THE READ-BACK IS THE WHOLE POINT. A DigitalOcean deployment has already once reported
 * build=SUCCESS deploy=SUCCESS, gone ACTIVE on branch main, and run a commit from BEFORE the change
 * (f776b4bf against a then-current main of 3d3ec62a; only a byte comparison caught it). And a spec PUT
 * returns the app as it stood, so `active_deployment` in the write's own response is the PREVIOUS
 * deployment, not the new one; trusting it polls the old deployment and reports a failure while the
 * real one builds (2026-09-18). Both traps are handled below rather than remembered.
 *
 * FAIL-CLOSED:
 *   - refuses if the app is not readable, or if its branch/repo cannot be resolved from its own spec;
 *   - refuses if it already serves the target commit (the deploy has happened and this reading is stale);
 *   - refuses to treat a 2xx write as evidence: the new deployment is found by SET DIFFERENCE against
 *     the pre-write deployment list, and the run fails if the write created none;
 *   - refuses to close on the deployment's own record alone: `services[0].source_commit_hash` is read
 *     back and compared BYTE FOR BYTE against the commit GitHub says the branch is at. Two derivations,
 *     one from DigitalOcean and one from GitHub, so no single party can satisfy both.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ARGS = process.argv.slice(2);
const flag = (name, def = null) => {
  const i = ARGS.indexOf(name);
  return i === -1 ? def : (ARGS[i + 1] && !ARGS[i + 1].startsWith("--") ? ARGS[i + 1] : true);
};
const APPLY = ARGS.includes("--apply");
const SELF_TEST = ARGS.includes("--self-test");
const WANT = flag("--app");
/* "KEY=VALUE": change exactly ONE existing env entry and PUT the spec. The PUT replaces the whole app
   spec, so it is guarded the same way dolphin-ship.mjs guards its one write: walk both trees, enumerate
   every leaf difference, and refuse anything but the single entry named here. */
const SET_ENV = flag("--set-env");
const POLL_MS = Number(flag("--poll-ms", 10000));
const POLL_MAX = Number(flag("--poll-max", 120));

const failures = [];
const check = (ok, what) => { console.error(`${ok ? "PASS" : "FAIL"}: ${what}`); if (!ok) failures.push(what); };
const fail = (msg) => { console.error(`\nREFUSING: ${msg}`); process.exit(2); };
const sh = (cmd, args) => execFileSync("cmd.exe", ["/d", "/c", cmd, ...args], { encoding: "utf8" }).replace(/\r/g, "");

/* ---------- self-test: the comparison must be able to SAY NO ----------
   Runs before any network or credential access, so it is exercisable anywhere. The guard this stands
   behind is `readbackAgrees`, and a guard only ever observed passing has not been observed working. */
if (SELF_TEST) {
  const target = "e99e5646aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
  const cases = [
    ["identical", target, target, true],
    ["stale by one commit", "ea27024fbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", target, false],
    ["same prefix, different commit", "e99e5646cccccccccccccccccccccccccccccccc", target, false],
    ["null read-back", null, target, false],
    ["undefined read-back", undefined, target, false],
    ["empty read-back", "", target, false],
    ["target empty (an unread branch)", target, "", false],
  ];
  let bad = 0;
  for (const [label, served, want, expect] of cases) {
    const got = readbackAgrees(served, want);
    const ok = got === expect;
    if (!ok) bad++;
    console.error(`${ok ? "PASS" : "FAIL"}: self-test ${label} (readbackAgrees -> ${got}, expected ${expect})`);
  }
  if (bad) { console.error(`\n${bad} self-test case(s) FAILED; the guard is not trustworthy.`); process.exit(2); }
  console.error(`\nSELF-TEST OK: ${cases.length}/${cases.length}. The read-back guard fires in both directions.`);
  process.exit(0);
}

function readbackAgrees(served, target) {
  if (typeof served !== "string" || typeof target !== "string") return false;
  if (served.length === 0 || target.length === 0) return false;
  return served.trim().toLowerCase() === target.trim().toLowerCase();
}

if (!WANT) fail("--app <name|id> is required");

const cfg = JSON.parse(fs.readFileSync(path.join(os.homedir(), ".cursor", "mcp.json"), "utf8"));
const auth = cfg.mcpServers["do-apps"]?.headers?.Authorization;
if (!/^Bearer dop_v1_/.test(auth || "")) fail("no do-apps token in the Cursor MCP config");
const H = { Authorization: auth, "Content-Type": "application/json" };
const doGet = async (ep) => {
  const r = await fetch(`https://api.digitalocean.com/v2/${ep}`, { headers: H });
  return { status: r.status, body: await r.json().catch(() => ({})) };
};

console.log(`# do-deploy | ${new Date().toISOString()} | ${APPLY ? "APPLY" : "DRY RUN"}`);

/* ---------- 1. resolve the app, from the account's own list rather than a hardcoded id ---------- */
const list = (await doGet("apps?per_page=200")).body.apps || [];
/* The list endpoint returns a SUMMARY: the name lives under `spec.name`, not at the top level. */
const appName = (a) => a.name ?? a.spec?.name ?? "(unnamed)";
const app0 = list.find((a) => a.id === WANT || appName(a) === WANT);
if (!app0) fail(`no app matching "${WANT}" in this account (${list.map(appName).join(", ")})`);

const appRes = await doGet(`apps/${app0.id}`);
const app = appRes.body.app;
if (!app) fail(`${appName(app0)} spec not readable (HTTP ${appRes.status})`);

const svc = (app.spec.services || [])[0];
if (!svc) fail(`${appName(app0)} has no services[0]`);
const gh = svc.github;
if (!gh?.repo || !gh?.branch) fail(`${appName(app0)} services[0] does not build from a GitHub repo+branch; this script does not repoint`);

const act = app.active_deployment || {};
const running = act.services?.[0]?.source_commit_hash;
console.log(`\n## app`);
console.log(`   ${appName(app0)} (${app0.id})  domains=${(app.spec.domains || []).map((d) => `${d.domain}:${d.type}`).join(", ") || "(none)"}`);
console.log(`   builds ${gh.repo}@${gh.branch}  deploy_on_push=${JSON.stringify(gh.deploy_on_push ?? app.spec.deploy_on_push ?? null)}`);
console.log(`   currently serves deployment=${act.id} phase=${act.phase} cause=${JSON.stringify(act.cause)}`);
console.log(`   services[0].source_commit_hash = ${running}`);

/* ---------- 2. the target commit, from GitHub, not from memory ---------- */
const remote = sh("git", ["ls-remote", `https://github.com/${gh.repo}.git`, `refs/heads/${gh.branch}`]).trim().split(/\s+/)[0];
if (!/^[0-9a-f]{40}$/.test(remote || "")) fail(`could not resolve ${gh.repo}@${gh.branch} from GitHub (got "${remote}")`);
console.log(`\n## target: ${gh.repo}@${gh.branch} = ${remote}`);

if (!SET_ENV) {
  if (readbackAgrees(running, remote)) fail(`${appName(app0)} ALREADY serves ${remote}; the deploy has happened and this reading is stale`);
  check(true, `the target (${remote.slice(0, 8)}) differs from what is served (${String(running).slice(0, 8)})`);
} else {
  console.log(`   (--set-env: a commit change is not the point here; the commit is expected to stay ${String(running).slice(0, 8)})`);
}

/* ---------- 3. what is about to be written, and the guard on HOW MUCH ---------- */
let proposed = null;
let envTarget = null;
if (SET_ENV) {
  const m = /^([A-Za-z_][A-Za-z0-9_]*)=([\s\S]*)$/.exec(String(SET_ENV));
  if (!m) fail(`--set-env must be KEY=VALUE (got "${SET_ENV}")`);
  const key = m[1], value = m[2];
  const envs = svc.envs || [];
  const present = envs.find((e) => e.key === key);
  if (!present) fail(`${key} is not on ${appName(app0)}'s spec; this script changes an existing entry and never adds one`);
  if (present.value === value) fail(`${key} is ALREADY "${value}" on ${appName(app0)}; nothing to change`);
  if (present.type === "SECRET") fail(`${key} is a SECRET entry; this script will not rewrite a secret value`);
  console.log(`\n## env change, exactly one entry`);
  console.log(`   ${key}`);
  console.log(`     now : ${present.value}`);
  console.log(`     next: ${value}`);
  envTarget = { key, value };

  proposed = JSON.parse(JSON.stringify(app.spec));
  proposed.services[0].envs = envs.map((e) => (e.key === key ? { ...e, value } : e));

  /* The guard that matters: walk BOTH trees and enumerate every leaf difference. An unrelated field lost
     or reordered in the round trip would otherwise be written silently, secrets included. */
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
  walk(app.spec, proposed, "spec");
  const idx = envs.findIndex((e) => e.key === key);
  const allowed = new RegExp(`^spec\\.services\\[0\\]\\.envs\\[${idx}\\]\\.value$`);
  const outside = diffPaths.filter((p) => !allowed.test(p));
  console.log(`   enumerated leaf differences: ${diffPaths.length ? diffPaths.join(", ") : "(none)"}`);
  check(diffPaths.length === 1 && allowed.test(diffPaths[0]), `exactly one leaf differs, and it is services[0].envs[${idx}].value`);
  check(outside.length === 0, "the PUT changes nothing else anywhere in the spec tree");
  const envDrift = envs.filter((e, i) => i !== idx && JSON.stringify(e) !== JSON.stringify(proposed.services[0].envs[i]));
  check(envDrift.length === 0, `every OTHER env entry round-trips byte for byte, the ${envs.filter((e) => e.type === "SECRET").length} SECRET entries included`);
}

if (!APPLY) {
  console.log(`\nDRY RUN: nothing written. On --apply this would ${SET_ENV ? "PUT the spec (one env value changed)" : "POST /deployments {force_build:true}"}`);
  console.log(`   and then require services[0].source_commit_hash === ${remote} before reporting success.`);
  process.exit(0);
}
if (failures.length) fail(`${failures.length} guard(s) failed; nothing was written`);

/* ---------- 4. write, and find the deployment it made ----------
   Found by SET DIFFERENCE against the pre-write list. A 2xx with no new deployment is a failure, not a
   success: that is the shape that let a merge look like a ship. */
const before = new Set(((await doGet(`apps/${app0.id}/deployments?per_page=50`)).body.deployments || []).map((d) => d.id));
let writeStatus;
if (SET_ENV) {
  console.log(`\n## writing the spec (${before.size} existing deployments)`);
  const put = await fetch(`https://api.digitalocean.com/v2/apps/${app0.id}`, {
    method: "PUT", headers: H, body: JSON.stringify({ spec: proposed, update_all_source_versions: true }),
  });
  const putBody = await put.json().catch(() => ({}));
  if (put.status !== 200) fail(`spec write failed: HTTP ${put.status} ${JSON.stringify(putBody).slice(0, 400)}`);
  writeStatus = put.status;
} else {
  console.log(`\n## forcing a build (${before.size} existing deployments)`);
  const post = await fetch(`https://api.digitalocean.com/v2/apps/${app0.id}/deployments`, {
    method: "POST", headers: H, body: JSON.stringify({ force_build: true }),
  });
  const postBody = await post.json().catch(() => ({}));
  if (post.status !== 200 && post.status !== 201) fail(`POST deployments failed: HTTP ${post.status} ${JSON.stringify(postBody).slice(0, 400)}`);
  writeStatus = post.status;
}

const after = (await doGet(`apps/${app0.id}/deployments?per_page=50`)).body.deployments || [];
const fresh = after.filter((d) => !before.has(d.id));
if (fresh.length === 0) fail("the write returned 2xx but created no deployment; nothing is rolling out");
if (fresh.length > 1) fail(`the write created ${fresh.length} deployments (${fresh.map((d) => d.id).join(", ")}); refusing to guess which one ships`);
const depId = fresh[0].id;
console.log(`   HTTP ${writeStatus}; the NEW deployment is ${depId} cause=${JSON.stringify(fresh[0].cause)} created=${fresh[0].created_at}`);
check(["manual", "app spec updated", "redeploy"].includes(fresh[0].cause), `the new deployment's cause is a deliberate act (${JSON.stringify(fresh[0].cause)})`);

/* ---------- 4. poll, then read the running commit back from BOTH sides ---------- */
let served = null, phase = null;
for (let i = 0; i < POLL_MAX; i++) {
  await new Promise((r) => setTimeout(r, i === 0 ? 0 : POLL_MS));
  const d = (await doGet(`apps/${app0.id}/deployments/${depId}`)).body.deployment;
  phase = d?.phase;
  const runningNow = d?.services?.[0]?.source_commit_hash;
  console.log(`   [${String(i * (POLL_MS / 1000)).padStart(4)}s] phase=${phase} running=${String(runningNow).slice(0, 8)}`);
  if (phase === "ACTIVE" || phase === "ERROR" || phase === "CANCELED" || phase === "SUPERSEDED") {
    if (phase !== "ACTIVE") fail(`deployment ${depId} ended ${phase} after ${i * (POLL_MS / 1000)}s`);
    served = runningNow;
    break;
  }
}
if (phase !== "ACTIVE") fail(`deployment ${depId} did not reach ACTIVE within ${POLL_MAX * (POLL_MS / 1000)}s (last phase ${phase})`);

/* The authoritative record is the app's own active_deployment, read fresh, not the deployment object
   we polled and not the write's response. */
const finalApp = (await doGet(`apps/${app0.id}`)).body.app;
const liveServed = finalApp?.active_deployment?.services?.[0]?.source_commit_hash;
console.log(`\n## read back`);
console.log(`   deployment=${finalApp?.active_deployment?.id} phase=${finalApp?.active_deployment?.phase}`);
console.log(`   polled deployment said    ${served}`);
console.log(`   active_deployment says    ${liveServed}`);
console.log(`   GitHub says ${gh.branch} is ${remote}`);

check(liveServed === served, "the app's active deployment IS the deployment this run created and followed");
check(readbackAgrees(liveServed, remote), `the running commit IS ${gh.repo}@${gh.branch} (${remote})`);
if (envTarget) {
  const now = (finalApp.spec.services[0].envs || []).find((e) => e.key === envTarget.key);
  console.log(`   ${envTarget.key} on the app now = ${now?.value}`);
  check(now?.value === envTarget.value, `${envTarget.key} reads back as the new value on the app's own spec`);
}

if (failures.length) fail(`${failures.length} check(s) failed`);
console.log(`\nDEPLOYED. ${appName(app0)} serves ${remote}. The surface probes are the remaining acceptance.`);
