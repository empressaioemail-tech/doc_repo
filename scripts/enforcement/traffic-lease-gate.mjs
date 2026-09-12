#!/usr/bin/env node
/**
 * traffic-lease-gate — ONE traffic shift at a time per Cloud Run service (AGENT_CONTRACT §3,
 * deploy-traffic lease; operator ruling 2026-09-12, OPS-16 P-170).
 *
 * RULE. A command that shifts traffic on a Cloud Run service (`gcloud run services
 * update-traffic <service> ...`, or `gcloud run deploy <service> ...` without `--no-traffic`)
 * runs only while a live lease file for that service exists in the doc_repo worktree the
 * session is rooted in: `_catalog/leases/<service>.json` with `lane`, `revision`, `takenAt`,
 * `expiresAt` (ISO), and `expiresAt` in the future. No lease, an expired lease, or a lease
 * naming a different service: refused, with the path to write. Two lanes cannot both hold a
 * service because one file holds one lane.
 *
 * THE THREE-QUESTION GATE (ENFORCEMENT.md):
 *   1. What executes this?  .claude/hooks/traffic-lease-gate.mjs, registered on the Bash
 *                           matcher in .claude/settings.json, importing this module.
 *   2. What triggers it?    PreToolUse on Bash in any session rooted in a doc_repo worktree
 *                           (P:/doc_repo, a seat's doc worktree, the dispatch planner's).
 *   3. What fails?          The tool call is refused (exit 2, JSON block) before the command
 *                           runs. Verified by violation by direct invocation on 2026-09-12;
 *                           LIVE FIRING THROUGH THE HARNESS IS OWED to the next session,
 *                           because a hook registered mid-session does not arm.
 *   4. What bypasses it?    A shift run outside a doc_repo-rooted session (a Cursor lane in a
 *                           product worktree, a laptop shell, the Cloud Console, a GitHub
 *                           workflow that shifts traffic). Named; that is why the dispatch
 *                           planner sequences shifts explicitly and the contract calls a shift
 *                           without a lease rogue. `gh workflow run` on a workflow whose name
 *                           contains "deploy" is WARNED (stderr, exit 0), never blocked, because
 *                           the service it shifts is not readable from the command.
 *
 * STATE YOUR SNAPSHOT. The block message names the lease path and the command it refused.
 *
 *   node scripts/enforcement/traffic-lease-gate.mjs --self-test
 */
import { readFileSync, existsSync, mkdirSync, writeFileSync, mkdtempSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

export const DOC_REPO = join(dirname(fileURLToPath(import.meta.url)), "..", "..").replace(/\\/g, "/");

/** The service a command shifts, or null when the command shifts nothing. */
export function shiftedService(command) {
  const c = String(command ?? "");
  // gcloud run services update-traffic <service> ...
  let m = /gcloud\s+(?:[a-z]+\s+)?run\s+services\s+update-traffic\s+("[^"]+"|'[^']+'|[^\s"']+)/.exec(c);
  if (m) return m[1].replace(/^["']|["']$/g, "");
  // gcloud run deploy <service> ... (shifts 100% to the new revision unless --no-traffic)
  m = /gcloud\s+(?:[a-z]+\s+)?run\s+deploy\s+("[^"]+"|'[^']+'|[^\s"'-][^\s"']*)/.exec(c);
  if (m && !/--no-traffic\b/.test(c)) return m[1].replace(/^["']|["']$/g, "");
  return null;
}

/** A workflow dispatch that probably deploys; warned, never blocked (service unreadable). */
export function looksLikeDeployWorkflow(command) {
  return /gh\s+workflow\s+run\s+\S*deploy/i.test(String(command ?? ""));
}

/** The doc_repo worktree a session is rooted in, if any (the lease lives there). */
export function docRepoWorktreeFor(cwd) {
  try {
    const top = execFileSync("git", ["rev-parse", "--show-toplevel"], { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim().replace(/\\/g, "/");
    const common = execFileSync("git", ["rev-parse", "--git-common-dir"], { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim().replace(/\\/g, "/");
    const isDocRepo = common.toLowerCase().startsWith(DOC_REPO.toLowerCase()) || top.toLowerCase() === DOC_REPO.toLowerCase();
    return isDocRepo ? top : null;
  } catch {
    return null;
  }
}

/**
 * Pure evaluation. `read(rel)` returns the lease file text for a worktree-relative path or null.
 * Returns { block, warn, message }.
 */
export function evaluate(command, { read, now = new Date() }) {
  const service = shiftedService(command);
  if (!service) {
    if (looksLikeDeployWorkflow(command)) {
      return { block: false, warn: true, message: `TRAFFIC LEASE (P-170): this looks like a deploy workflow dispatch; the service it shifts is not readable from the command, so this gate cannot check the lease. The dispatch planner must hold _catalog/leases/<service>.json for it. Not blocked; said so.` };
    }
    return { block: false, warn: false, message: "" };
  }
  const rel = `_catalog/leases/${service}.json`;
  const text = read(rel);
  if (text == null) return { block: true, warn: false, message: `TRAFFIC LEASE (P-170) refused a traffic shift on ${service}: no lease at ${rel}. One shift at a time per service (AGENT_CONTRACT section 3). The dispatch planner writes { "service": "${service}", "lane": "<lane id>", "revision": "<revision>", "takenAt": "<ISO>", "expiresAt": "<ISO>" } there before the shift and deletes it after the serving revision is read by field and the probe has run.` };
  let lease;
  try { lease = JSON.parse(text); } catch { return { block: true, warn: false, message: `TRAFFIC LEASE (P-170) refused a traffic shift on ${service}: ${rel} is not valid JSON.` }; }
  const problems = [];
  if (lease.service !== service) problems.push(`service field "${lease.service}" does not name ${service}`);
  if (typeof lease.lane !== "string" || !lease.lane.trim()) problems.push("lane is missing");
  if (typeof lease.revision !== "string" || !lease.revision.trim()) problems.push("revision is missing");
  const exp = Date.parse(lease.expiresAt ?? "");
  if (Number.isNaN(exp)) problems.push("expiresAt is missing or not ISO");
  else if (exp <= now.getTime()) problems.push(`lease expired at ${lease.expiresAt}`);
  if (problems.length) return { block: true, warn: false, message: `TRAFFIC LEASE (P-170) refused a traffic shift on ${service}: ${rel} is not a live lease (${problems.join("; ")}).` };
  return { block: false, warn: false, message: "" };
}

// ---------------------------------------------------------------------------- self-test
export function selfTest() {
  let failures = 0;
  const check = (name, ok, detail = "") => { console.log(`  ${ok ? "ok  " : "FAIL"} ${name}${detail ? "  " + detail : ""}`); if (!ok) failures++; };
  console.log("traffic-lease-gate self-test");
  const files = {};
  const read = (rel) => (rel in files ? files[rel] : null);
  const now = new Date("2026-09-12T03:00:00Z");
  const live = { service: "hauska-engine-api", lane: "p167-vocab", revision: "hauska-engine-api-00206-abc", takenAt: "2026-09-12T02:50:00Z", expiresAt: "2026-09-12T04:00:00Z" };

  check("shiftedService: update-traffic", shiftedService("gcloud run services update-traffic hauska-engine-api --to-revisions x=100 --region us-central1") === "hauska-engine-api");
  check("shiftedService: deploy without --no-traffic", shiftedService("gcloud run deploy cortex-api --image x --region us-central1") === "cortex-api");
  check("shiftedService: deploy with --no-traffic shifts nothing", shiftedService("gcloud run deploy cortex-api --image x --no-traffic") === null);
  check("shiftedService: describe / jobs / unrelated shift nothing", shiftedService("gcloud run services describe hauska-engine-api --format json") === null && shiftedService("gcloud run jobs execute factory-x") === null && shiftedService("git commit -m x") === null);
  check("shiftedService: beta/alpha prefix handled", shiftedService("gcloud beta run services update-traffic smartsite-mcp --to-latest") === "smartsite-mcp");

  check("no lease -> BLOCK", evaluate("gcloud run services update-traffic hauska-engine-api --to-latest", { read, now }).block === true);
  files["_catalog/leases/hauska-engine-api.json"] = JSON.stringify(live);
  check("live lease -> allow", evaluate("gcloud run services update-traffic hauska-engine-api --to-latest", { read, now }).block === false);
  check("live lease for another service does not cover this one -> BLOCK", evaluate("gcloud run services update-traffic cortex-api --to-latest", { read, now }).block === true);
  files["_catalog/leases/cortex-api.json"] = JSON.stringify({ ...live, service: "hauska-engine-api" });
  check("lease whose service field names a different service -> BLOCK", evaluate("gcloud run services update-traffic cortex-api --to-latest", { read, now }).block === true);
  files["_catalog/leases/smartsite-mcp.json"] = JSON.stringify({ ...live, service: "smartsite-mcp", expiresAt: "2026-09-12T02:00:00Z" });
  check("expired lease -> BLOCK", evaluate("gcloud run services update-traffic smartsite-mcp --to-latest", { read, now }).block === true);
  files["_catalog/leases/hauska-retrieval-api.json"] = "{ not json";
  check("unparseable lease -> BLOCK (loud)", evaluate("gcloud run deploy hauska-retrieval-api --image x", { read, now }).block === true);
  files["_catalog/leases/bad.json"] = JSON.stringify({ service: "bad", revision: "r", takenAt: "x", expiresAt: "2026-09-12T04:00:00Z" });
  check("lease with no lane -> BLOCK", evaluate("gcloud run services update-traffic bad --to-latest", { read, now }).block === true);
  check("deploy with --no-traffic needs no lease -> allow", evaluate("gcloud run deploy cortex-api --image x --no-traffic", { read, now }).block === false);
  const w = evaluate("gh workflow run cloud-run-deploy.yml -f mode=canary", { read, now });
  check("deploy workflow dispatch -> WARN, not block (service unreadable; declared)", w.block === false && w.warn === true);
  check("unrelated command -> silent allow", evaluate("git status", { read, now }).block === false && evaluate("git status", { read, now }).warn === false);

  // The wrapper's worktree resolution on this repo.
  const here = docRepoWorktreeFor(DOC_REPO);
  check("docRepoWorktreeFor resolves P:/doc_repo to itself", !!here && here.toLowerCase() === DOC_REPO.toLowerCase(), String(here));
  const tmp = mkdtempSync(join(tmpdir(), "tlg-"));
  check("docRepoWorktreeFor returns null outside any git repo", docRepoWorktreeFor(tmp) === null);

  console.log(failures === 0 ? "\nself-test: all checks passed" : `\nself-test: ${failures} check(s) FAILED`);
  return failures;
}

if (process.argv.includes("--self-test")) {
  process.exit(selfTest() === 0 ? 0 : 1);
}
