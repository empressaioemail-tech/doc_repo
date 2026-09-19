#!/usr/bin/env node
// LANE d14-d13-v1-reach — DigitalOcean App Platform driver.
//
// WHY THIS EXISTS. The lane has to (a) read back the commit an app is ACTUALLY running, (b) change
// exactly one field of an app's spec without disturbing the encrypted env round-trip, and (c) create
// and later remove one non-production proof app. Doing that by hand through a console is the exact act
// OPS-25 rule 17 says is not a change. This script makes every mutation a printed diff.
//
// TOKEN. Read from DIGITALOCEAN_TOKEN, else from the fleet's Cursor MCP config
// (~/.cursor/mcp.json -> mcpServers.do-apps.headers.Authorization), the same source do-read.mjs uses.
// The token is never printed and never written to a file.
//
// WHAT IT REFUSES. `get` redacts every env value by default (`--full` prints ciphertext, never
// plaintext). `update` refuses unless the outgoing spec differs from the freshly read spec in the
// exact path set the caller names with --expect, so a repoint cannot silently move something else.
//
// Usage:
//   node _inbox/2026-09-18_d14-d13-v1-reach_do-api.mjs list
//   node _inbox/2026-09-18_d14-d13-v1-reach_do-api.mjs get  <appId> [--full] [--out <file>]
//   node _inbox/2026-09-18_d14-d13-v1-reach_do-api.mjs update <appId> <specFile> [--expect a,b,c] [--dry]
//   node _inbox/2026-09-18_d14-d13-v1-reach_do-api.mjs deploy <appId> [--force-build]
//   node _inbox/2026-09-18_d14-d13-v1-reach_do-api.mjs create <specFile> [--dry]
//   node _inbox/2026-09-18_d14-d13-v1-reach_do-api.mjs delete <appId> [--dry]
//   node _inbox/2026-09-18_d14-d13-v1-reach_do-api.mjs running <appId>   (every component's commit)
//   node _inbox/2026-09-18_d14-d13-v1-reach_do-api.mjs watch <appId> [--deployment <id>] [--interval 10] [--timeout 1500] [--out <file>]
//   node _inbox/2026-09-18_d14-d13-v1-reach_do-api.mjs logs <appId> <deploymentId> <component> [--type BUILD|RUN]
//   node _inbox/2026-09-18_d14-d13-v1-reach_do-api.mjs selftest
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const API = "https://api.digitalocean.com/v2";

function token() {
  if (process.env.DIGITALOCEAN_TOKEN) return process.env.DIGITALOCEAN_TOKEN.trim();
  const cfgPath = path.join(os.homedir(), ".cursor", "mcp.json");
  const cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
  const h = cfg.mcpServers?.["do-apps"]?.headers?.Authorization || "";
  const t = String(h).replace(/^Bearer\s+/i, "").trim();
  if (!/^dop_v1_/.test(t)) throw new Error("no DigitalOcean token in DIGITALOCEAN_TOKEN or the do-apps MCP config");
  return t;
}

async function req(method, ep, body) {
  const r = await fetch(`${API}/${ep}`, {
    method,
    headers: { Authorization: `Bearer ${token()}`, "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await r.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch { /* non-JSON error body */ }
  if (!r.ok) throw new Error(`${method} ${ep} -> ${r.status} ${JSON.stringify(json ?? text).slice(0, 600)}`);
  return json;
}

const args = process.argv.slice(2);
const cmd = args[0];
const flag = (n) => { const i = args.indexOf(n); return i === -1 ? null : (args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : true); };
const has = (n) => args.includes(n);

const redact = (spec, full) => {
  const out = JSON.parse(JSON.stringify(spec));
  for (const kind of ["services", "workers", "jobs", "static_sites", "functions"]) {
    for (const c of out[kind] || []) {
      for (const e of c.envs || []) {
        if (!full) e.value = `[${e.type || "GENERAL"}:len=${String(e.value || "").length}]`;
      }
    }
  }
  return out;
};

function flatDiff(a, b, p = "", out = []) {
  if (a === b) return out;
  const ta = a === null ? "null" : Array.isArray(a) ? "array" : typeof a;
  const tb = b === null ? "null" : Array.isArray(b) ? "array" : typeof b;
  if (ta !== tb) { out.push(`${p}: ${ta} -> ${tb}`); return out; }
  if (ta === "array") {
    if (a.length !== b.length) out.push(`${p}.length: ${a.length} -> ${b.length}`);
    for (let i = 0; i < Math.max(a.length, b.length); i++) flatDiff(a[i], b[i], `${p}[${i}]`, out);
    return out;
  }
  if (ta === "object") {
    for (const k of [...new Set([...Object.keys(a || {}), ...Object.keys(b || {})])]) flatDiff(a?.[k], b?.[k], `${p}.${k}`, out);
    return out;
  }
  out.push(`${p}: ${JSON.stringify(a)} -> ${JSON.stringify(b)}`);
  return out;
}

function runningOf(app) {
  const rows = [];
  for (const kind of ["services", "workers", "jobs", "static_sites"]) {
    for (const c of app.spec?.[kind] || []) {
      const dep = (app.active_deployment?.[kind] || []).find((x) => x.name === c.name);
      rows.push({
        kind,
        name: c.name,
        srcRepo: c.github?.repo ?? null,
        srcBranch: c.github?.branch ?? null,
        deployOnPush: c.github?.deploy_on_push ?? null,
        runningCommit: dep?.source_commit_hash ?? null,
      });
    }
  }
  return rows;
}

(async () => {
  if (cmd === "list") {
    const j = await req("GET", "apps?per_page=200");
    for (const a of j.apps || []) {
      console.log(`\n## ${a.spec?.name}  id=${a.id}  region=${a.region?.slug}  live=${a.live_url ?? "-"}  default_ingress=${a.default_ingress ?? "-"}`);
      console.log(`   domains=${(a.spec?.domains || []).map((d) => d.domain).join(",") || "-"}`);
      for (const r of runningOf(a)) console.log(`   ${r.kind} ${r.name}: ${r.srcRepo}@${r.srcBranch} deploy_on_push=${r.deployOnPush} running=${r.runningCommit?.slice(0, 12) ?? "-"} envs=${(a.spec?.[r.kind]?.find((c) => c.name === r.name)?.envs || []).length}`);
    }
    return;
  }

  if (cmd === "get") {
    const id = args[1];
    const j = await req("GET", `apps/${id}`);
    const app = j.app;
    const out = { id: app.id, name: app.spec?.name, default_ingress: app.default_ingress, live_url: app.live_url, activeDeploymentId: app.active_deployment?.id, activePhase: app.active_deployment?.phase, spec: redact(app.spec, has("--full")) };
    const dst = flag("--out");
    if (typeof dst === "string") { fs.writeFileSync(dst, JSON.stringify(app.spec, null, 2)); console.log(`wrote spec (unredacted ciphertext in env values) to ${dst}`); }
    console.log(JSON.stringify(out, null, 2));
    return;
  }

  if (cmd === "running") {
    const j = await req("GET", `apps/${args[1]}`);
    console.log(JSON.stringify({ activeDeploymentId: j.app.active_deployment?.id, phase: j.app.active_deployment?.phase, running: runningOf(j.app) }, null, 2));
    return;
  }

  if (cmd === "update") {
    const id = args[1];
    const specFile = args[2];
    const next = JSON.parse(fs.readFileSync(specFile, "utf8"));
    const cur = (await req("GET", `apps/${id}`)).app.spec;
    /**
     * Both sides are redacted before diffing. `get` already withholds env values
     * by default; `update` printing them raw made this the one command that put
     * plaintext secrets on a terminal, which is a worse leak than the one get
     * avoids, and it happens on the command a human runs most often. The diff
     * still reports every env value that MOVED, by key and by length, which is
     * the whole question -- "did this update change a credential" -- without
     * printing the credential.
     */
    const d = flatDiff(redact(cur, false), redact(next, false), "spec");
    console.log(`changed paths (${d.length}):`);
    for (const line of d) console.log(`   ${line}`);
    const expect = flag("--expect");
    if (typeof expect === "string") {
      /**
       * Both sides are normalized to `[]` before comparing. Normalizing only the
       * observed side (as this first did) made the guard refuse a caller who
       * wrote `envs[0]` while accepting the identical intent written `envs[]` --
       * a guard whose spelling rule is invisible refuses work that is correct,
       * which is how a guard gets bypassed instead of read.
       */
      const normalize = (s) => s.replace(/\[\d+\]/g, "[]");
      const want = expect.split(",").map((s) => normalize(s.trim())).filter(Boolean).sort();
      const got = [...new Set(d.map((s) => normalize(s.split(":")[0])))].sort();
      const unexpected = got.filter((g) => !want.some((w) => g === w || g.startsWith(w)));
      if (!want.length) { console.error("--expect named no paths; refusing"); process.exitCode = 2; return; }
      if (unexpected.length) { console.error(`REFUSED: paths moved that --expect did not name: ${unexpected.join(", ")}`); process.exitCode = 2; return; }
      console.log(`--expect satisfied: every changed path is inside ${want.join(", ")}`);
    }
    if (has("--dry")) { console.log("--dry: no request sent"); return; }
    /**
     * The PUT body is built by INTERSECTION with the documented AppSpec fields
     * rather than by deleting known-bad keys, because `GET apps/{id}` returns a
     * spec carrying extra fields that `AppSpec` does not define at all:
     *
     *   - `alerts`, `features` are response-only. They appear on every read-back
     *     and are rejected by PUT as unknown. A blacklist has to learn each one
     *     from a live 400 (which is how `features` and `alert` were found, one
     *     PUT each); an allowlist excludes them by construction and cannot be
     *     surprised by the next one.
     *   - `region` IS a documented AppSpec field, yet UpdateAppRequest rejects it
     *     (`unknown field "region"`). Documented-but-create-only is the one case
     *     an allowlist cannot infer, so it is named here explicitly, with the
     *     server response as the authority rather than the published schema.
     *
     * Anything dropped is printed. This lane refuses silent mutations.
     */
    const APP_SPEC_FIELDS = [
      "name", "region", "disable_edge_cache", "disable_email_obfuscation",
      "enhanced_threat_control_enabled", "domains", "services", "static_sites",
      "jobs", "workers", "functions", "databases", "ingress", "egress",
      "maintenance", "vpc",
    ];
    const CREATE_ONLY_SPEC_FIELDS = [
      /**
       * Empty, and worth saying why: this list briefly held `region` and `name`,
       * added after PUT rejected each with `unknown field "X"`. Those rejections
       * were an artifact of sending the spec BARE (see the comment on the PUT
       * below) -- the API was naming my request-level keys, and whitelisting spec
       * fields in response to request-level errors made the two levels look like
       * one. Both are documented AppSpec fields and go in the body.
       *
       * Kept as a named list because create-only fields are real; it just has no
       * members yet, and the next entry must cite a rejection from INSIDE spec.
       */
    ];
    /**
     * Fields the API RETURNS but the documented AppSpec does not define are
     * carried through UNCHANGED from the live app rather than dropped.
     *
     * This was learned the expensive way. Dropping them looked harmless -- they
     * are not settable AppSpec fields, so "dropping" reads like "not sending an
     * opinion" -- but on a real app it is a DELETION: the proof app's
     * `alerts: [{rule: DEPLOYMENT_FAILED}]` disappeared after one update that
     * never mentioned alerts. `walrus-app` and `dolphin-app` each carry
     * `[DEPLOYMENT_FAILED, DOMAIN_FAILED]`, so the same update applied to either
     * would have silently removed production deploy and domain failure alerting.
     *
     * The allowlist below still decides what this lane may CHANGE. This list only
     * decides what it may not DELETE.
     */
    const READBACK_PASSTHROUGH_FIELDS = ["alerts", "features"];
    const body = {};
    for (const [k, v] of Object.entries(next)) {
      if (APP_SPEC_FIELDS.includes(k) && !CREATE_ONLY_SPEC_FIELDS.includes(k)) { body[k] = v; continue; }
      /**
       * A passthrough field the outgoing spec explicitly carries is SENT, not
       * dropped. Otherwise the only way to repair one of these fields would be
       * to leave it deleted, and "you cannot put back what a bug removed" is not
       * a property an instrument should have.
       */
      if (READBACK_PASSTHROUGH_FIELDS.includes(k)) {
        body[k] = v;
        console.log(`note: sending ${k}=${JSON.stringify(v)} from the outgoing spec (read-back field, carried explicitly)`);
        continue;
      }
      console.log(`note: dropping ${k}=${JSON.stringify(v)} from the PUT body (not an AppSpec field; response-only on read-back)`);
    }
    for (const k of READBACK_PASSTHROUGH_FIELDS) {
      if (body[k] === undefined && cur[k] !== undefined) {
        body[k] = cur[k];
        console.log(`note: carrying ${k}=${JSON.stringify(cur[k])} through from the live app (absent from the outgoing spec; dropping it would delete it)`);
      }
    }
    const j = await req("PUT", `apps/${id}`, { spec: body });
    console.log(JSON.stringify({ id: j.app.id, activeDeploymentId: j.app.active_deployment?.id, phase: j.app.active_deployment?.phase, running: runningOf(j.app) }, null, 2));
    return;
  }

  if (cmd === "deploy") {
    const id = args[1];
    const body = has("--force-build") ? { force_build: true } : {};
    if (has("--dry")) { console.log(`--dry: would POST apps/${id}/deployments ${JSON.stringify(body)}`); return; }
    const j = await req("POST", `apps/${id}/deployments`, body);
    console.log(JSON.stringify({ deploymentId: j.deployment?.id, phase: j.deployment?.phase, cause: j.deployment?.cause }, null, 2));
    return;
  }

  if (cmd === "create") {
    const spec = JSON.parse(fs.readFileSync(args[1], "utf8"));
    if (has("--dry")) { console.log(JSON.stringify(redact(spec, false), null, 2)); console.log("--dry: no request sent"); return; }
    // CreateAppRequest wraps the spec: {"spec": {...}}. So does UpdateAppRequest --
    // `spec` is a REQUIRED property of it (OpenAPI apps_update_app_request). An
    // earlier version of this comment asserted the opposite ("PUT takes the spec
    // bare") and that one wrong sentence cost four live PUTs: the API kept
    // replying `unknown field "name"/"region"/"services"`, which reads like a
    // create-only field but was in fact naming my request-level keys, because a
    // bare spec IS the request body and its keys ARE the request's keys.
    const j = await req("POST", "apps", { spec });
    console.log(JSON.stringify({ id: j.app.id, name: j.app.spec?.name, live_url: j.app.live_url, default_ingress: j.app.default_ingress, activeDeploymentId: j.app.active_deployment?.id, phase: j.app.active_deployment?.phase }, null, 2));
    return;
  }

  if (cmd === "delete") {
    const id = args[1];
    if (has("--dry")) { console.log(`--dry: would DELETE apps/${id}`); return; }
    await req("DELETE", `apps/${id}?force=true`);
    console.log(`deleted ${id}`);
    return;
  }

  if (cmd === "watch") {
    /**
     * D-14.2/14.3 evidence: wait for a deployment to reach a terminal phase and
     * then print, for each component, the commit the app is ACTUALLY running.
     * That hash is the whole point -- "the app points at main" is a claim about a
     * spec field, while the running commit is a claim about what is serving, and
     * only the second one is what D-14 asks to read back byte-for-byte.
     *
     * Every phase TRANSITION is printed and repeats are suppressed, so the output
     * is a timeline rather than a poll log. The final deployment body can be
     * dumped with --out, and the exit code is the verdict (0 only for ACTIVE) so
     * a caller can gate on it instead of parsing text.
     */
    const id = args[1];
    const timeoutS = Number(flag("--timeout") ?? 1500);
    const intervalS = Number(flag("--interval") ?? 10);
    let depId = flag("--deployment");
    if (typeof depId !== "string") {
      const l = await req("GET", `apps/${id}/deployments?per_page=1`);
      depId = l.deployments?.[0]?.id;
      if (!depId) { console.error("no deployments found"); process.exitCode = 1; return; }
      console.log(`watching latest deployment ${depId}`);
    }
    const TERMINAL = new Set(["ACTIVE", "ERROR", "CANCELED", "SUPERSEDED"]);
    const start = Date.now();
    let lastPhase = null;
    let lastComponents = "";
    let dep = null;
    for (;;) {
      dep = (await req("GET", `apps/${id}/deployments/${depId}`)).deployment;
      const elapsed = Math.round((Date.now() - start) / 1000);
      if (dep.phase !== lastPhase) {
        console.log(`t+${elapsed}s  phase=${dep.phase}${lastPhase ? ` (was ${lastPhase})` : ""}`);
        lastPhase = dep.phase;
      }
      const state = (dep.services || []).map((s) => `${s.name}:${s.phase ?? s.status ?? "-"}`).join(" ");
      if (state && state !== lastComponents) { console.log(`t+${elapsed}s  components ${state}`); lastComponents = state; }
      if (TERMINAL.has(dep.phase)) break;
      if (elapsed > timeoutS) { console.error(`TIMEOUT after ${elapsed}s in phase ${dep.phase}`); process.exitCode = 3; return; }
      await new Promise((r) => setTimeout(r, intervalS * 1000));
    }
    const dst = flag("--out");
    if (typeof dst === "string") fs.writeFileSync(dst, JSON.stringify(dep, null, 2));
    console.log(JSON.stringify({
      deploymentId: dep.id,
      phase: dep.phase,
      cause: dep.cause,
      components: (dep.services || []).map((s) => ({ name: s.name, phase: s.phase ?? s.status ?? null, source_commit_hash: s.source_commit_hash ?? null })),
    }, null, 2));
    if (dep.phase !== "ACTIVE") {
      console.error(`deployment did not reach ACTIVE (phase=${dep.phase}); read logs with: logs ${id} ${depId} <component> --type BUILD|RUN`);
      process.exitCode = 1;
    }
    return;
  }

  if (cmd === "logs") {
    const [, id, depId, component] = args;
    const type = flag("--type") === "RUN" ? "RUN" : "BUILD";
    const j = await req("GET", `apps/${id}/deployments/${depId}/components/${component}/logs?type=${type}&follow=false`);
    console.log(j.historical_logs ?? JSON.stringify(j, null, 2));
    return;
  }

  if (cmd === "selftest") {
    let failed = 0;
    const t = (name, got, want) => { const ok = got === want; if (!ok) failed++; console.log(`  ${ok ? "pass" : "FAIL"}  ${name}${ok ? "" : ` got=${JSON.stringify(got)} want=${JSON.stringify(want)}`}`); };
    // The differ must SEE a change, and must NOT invent one where there is none.
    t("a changed leaf is reported", flatDiff({ a: { b: 1 } }, { a: { b: 2 } }, "spec").length, 1);
    t("an identical tree reports nothing", flatDiff({ a: { b: 1 } }, { a: { b: 1 } }, "spec").length, 0);
    t("a nested array length change is reported", flatDiff({ s: [1] }, { s: [1, 2] }, "spec").length, 2);
    // Redaction must strip a value and state its length, and must not touch the spec itself.
    const s = { services: [{ name: "x", envs: [{ key: "K", value: "supersecret", type: "SECRET" }] }] };
    const r = redact(s, false);
    t("redaction replaces the value", r.services[0].envs[0].value, "[SECRET:len=11]");
    t("redaction leaves the source object alone", s.services[0].envs[0].value, "supersecret");
    t("redaction keeps the key name", r.services[0].envs[0].key, "K");
    // The token must be present, not empty and not the placeholder.
    t("a token is loadable", /^dop_v1_/.test(token()), true);
    console.log(failed ? `\n${failed} self-test(s) FAILED` : "\nall self-tests pass");
    process.exitCode = failed ? 2 : 0;
    return;
  }

  console.error("usage: list | get | running | update | deploy | create | delete | watch | logs | selftest");
  process.exitCode = 64;
})().catch((e) => { console.error(`ERROR ${e.message}`); process.exitCode = 1; });
