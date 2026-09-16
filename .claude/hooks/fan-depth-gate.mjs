#!/usr/bin/env node
/**
 * PreToolUse hook for the FAN-DEPTH gate (A-181). Rules and self-tests live in
 * scripts/enforcement/fan-depth-gate.mjs.
 *
 *   node fan-depth-gate.mjs commit   (Bash matcher) grade every staged close before a doc_repo commit
 *   node fan-depth-gate.mjs agent    (Agent matcher) refuse a sub-agent launch that the session's
 *                                    claimed lane does not allow
 *
 * Fails OPEN only when it cannot run, and says so on stderr, so a dead control is visible.
 * Sub-agent detection uses the hook payload's `agent_id`/`agent_type` when the harness sends
 * them; when it does not, the depth-2 case is caught only at close time.
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { evaluateStaged, evaluateAgentLaunch, findDispatch } from "../../scripts/enforcement/fan-depth-gate.mjs";
import { isGitCommit, targetsDocRepo, stagedFiles, DOC_REPO } from "../../scripts/enforcement/probe-close-gate.mjs";

const STALE_HOURS = 8; // mirrors scripts/lane-claim.mjs; a stale claim does not gate

const mode = process.argv[2];
let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  try {
    const payload = raw.trim() ? JSON.parse(raw) : {};
    const block = (message) => {
      const msg = message.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r/g, "").replace(/\n/g, "\\n");
      process.stderr.write(`{"block": true, "message": "${msg}"}`);
      process.exit(2);
    };
    const readText = (p) => (p && existsSync(p) ? readFileSync(p, "utf8") : null);

    if (mode === "commit") {
      const command = payload?.tool_input?.command ?? payload?.command ?? "";
      const cwd = payload?.cwd ?? process.cwd();
      if (!isGitCommit(command) || !targetsDocRepo(command, cwd)) process.exit(0);
      const staged = stagedFiles(DOC_REPO);
      if (staged === null) {
        process.stderr.write("FAN-DEPTH-GATE could not run git; not blocking. This line exists so a dead control is visible.\n");
        process.exit(0);
      }
      const verdict = evaluateStaged(
        staged,
        (rel) => readText(join(DOC_REPO, rel)),
        (lane) => readText(findDispatch(lane, DOC_REPO)),
      );
      if (verdict.block) block(verdict.message);
      process.exit(0);
    }

    if (mode === "agent") {
      // Find the worktree root this session runs in, then its lane claims.
      let dir = resolve(payload?.cwd ?? process.cwd());
      let root = null;
      for (let i = 0; i < 8; i++) {
        if (existsSync(join(dir, "_catalog", "lane_claims.json"))) { root = dir; break; }
        const up = dirname(dir);
        if (up === dir) break;
        dir = up;
      }
      if (!root) process.exit(0);
      const reg = JSON.parse(readFileSync(join(root, "_catalog", "lane_claims.json"), "utf8"));
      const now = Date.now();
      const fresh = Object.fromEntries(Object.entries(reg.claims ?? {}).filter(([, c]) => {
        const t = Date.parse(c.startedAt);
        return Number.isFinite(t) && now - t < STALE_HOURS * 3600 * 1000;
      }));
      const dispatchFor = (lane) => {
        const c = fresh[lane];
        const p = c?.dispatch ? join(root, c.dispatch) : findDispatch(lane, root);
        return readText(p);
      };
      const inSubAgent = Boolean(payload?.agent_id || payload?.agent_type);
      const verdict = evaluateAgentLaunch({ claims: fresh }, dispatchFor, { inSubAgent });
      if (!verdict.ok) block(`FAN-DEPTH GATE (A-181) refused this sub-agent launch: ${verdict.reason}. The dispatch's FAN-DEPTH line is the topology; do the work yourself or stop and report.`);
      process.exit(0);
    }

    process.stderr.write(`FAN-DEPTH-GATE: unknown mode "${mode}"; not blocking.\n`);
    process.exit(0);
  } catch (err) {
    process.stderr.write(`FAN-DEPTH-GATE hook could not run: ${err?.message ?? err}. Not blocking. This line exists so a dead control is visible.\n`);
    process.exit(0);
  }
});
