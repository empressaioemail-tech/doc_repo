#!/usr/bin/env node
/**
 * PreToolUse(Bash) hook: refuse a Cloud Run traffic shift (`gcloud run services update-traffic`,
 * or `gcloud run deploy` without --no-traffic) unless the doc_repo worktree this session is
 * rooted in holds a live lease for that service at _catalog/leases/<service>.json. Rules,
 * self-tests and the three-question gate live in scripts/enforcement/traffic-lease-gate.mjs.
 *
 * Fails OPEN only when the payload cannot be read, and prints that it could not, so a dead
 * control is visible. A session not rooted in a doc_repo worktree is the named bypass: the
 * hook is not loaded there at all.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { evaluate, shiftedService, looksLikeDeployWorkflow, docRepoWorktreeFor, DOC_REPO } from "../../scripts/enforcement/traffic-lease-gate.mjs";

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  try {
    const payload = raw.trim() ? JSON.parse(raw) : {};
    const command = payload?.tool_input?.command ?? payload?.toolInput?.command ?? payload?.command ?? "";
    if (!shiftedService(command) && !looksLikeDeployWorkflow(command)) process.exit(0);
    const cwd = payload?.cwd ?? payload?.tool_input?.working_directory ?? process.cwd();
    const worktree = docRepoWorktreeFor(cwd) ?? DOC_REPO;
    const read = (rel) => { const p = join(worktree, rel); return existsSync(p) ? readFileSync(p, "utf8") : null; };
    const verdict = evaluate(command, { read });
    if (verdict.block) {
      const msg = (verdict.message + ` [lease worktree: ${worktree}]`).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r/g, "").replace(/\n/g, "\\n");
      process.stderr.write(`{"block": true, "message": "${msg}"}`);
      process.exit(2);
    }
    if (verdict.warn) process.stderr.write(verdict.message + "\n");
    process.exit(0);
  } catch (err) {
    process.stderr.write(`TRAFFIC-LEASE-GATE hook could not run: ${err?.message ?? err}. Not blocking. This line exists so a dead control is visible.\n`);
    process.exit(0);
  }
});
