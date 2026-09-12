#!/usr/bin/env node
/**
 * PreToolUse(Bash) hook: refuse a `git commit` to doc_repo whose staged set contains an
 * OPS-23 lane close (_inbox/*_close.json, planRows P-151..P-167) that does not cite a passing
 * surface-probe artifact. Rules, self-tests and the three-question gate live in
 * scripts/enforcement/probe-close-gate.mjs.
 *
 * Fails OPEN only when git cannot run, and prints that it could not, so a dead control is
 * visible. An unreadable close blocks; that is the loud half.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { evaluate, isGitCommit, targetsDocRepo, stagedFiles, stagesInSameCommand, DOC_REPO } from "../../scripts/enforcement/probe-close-gate.mjs";

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  try {
    const payload = raw.trim() ? JSON.parse(raw) : {};
    const command = payload?.tool_input?.command ?? payload?.toolInput?.command ?? payload?.command ?? "";
    const cwd = payload?.cwd ?? payload?.tool_input?.working_directory ?? process.cwd();
    if (!isGitCommit(command) || !targetsDocRepo(command, cwd)) process.exit(0);
    if (stagesInSameCommand(command)) {
      process.stderr.write(`{"block": true, "message": "PROBE CLOSE GATE (OPS-23 R-4) refused the commit: this command stages and commits in one string (git add ... && git commit, or commit -a/--all), so the gate cannot read the index it is about to commit. Stage in one call, commit in the next. Found live 2026-09-12 (213f5369, reverted)."}`);
      process.exit(2);
    }
    const staged = stagedFiles(DOC_REPO);
    if (staged === null) {
      process.stderr.write("PROBE-CLOSE-GATE could not run git; not blocking. This line exists so a dead control is visible.\n");
      process.exit(0);
    }
    const read = (rel) => { const p = join(DOC_REPO, rel); return existsSync(p) ? readFileSync(p, "utf8") : null; };
    const verdict = evaluate(staged, read);
    if (verdict.block) {
      const msg = verdict.message.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r/g, "").replace(/\n/g, "\\n");
      process.stderr.write(`{"block": true, "message": "${msg}"}`);
      process.exit(2);
    }
    process.exit(0);
  } catch (err) {
    process.stderr.write(`PROBE-CLOSE-GATE hook could not run: ${err?.message ?? err}. Not blocking. This line exists so a dead control is visible.\n`);
    process.exit(0);
  }
});
