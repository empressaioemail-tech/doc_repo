#!/usr/bin/env node
/**
 * PreToolUse(Bash) hook: refuse a `git commit` to doc_repo whose staged set contains a
 * plan of record that DEFINES the same row id twice. Rules, self-tests, the three-question
 * gate and the explicit statement of what this does NOT catch live in
 * scripts/enforcement/plan-row-allocation-gate.mjs.
 *
 * Operator ruling 2026-09-14: row allocation is a claim against the plan file, and a
 * duplicate claim is refused. This replaces "two sessions should be careful", which is not
 * a control. It covers concurrent allocation of a NEW id; it does NOT cover an
 * already-allocated id reused in a PR title for unrelated work. That limit is printed in
 * the refusal itself so the gate is never mistaken for the broader guarantee.
 *
 * Fails OPEN only when git or the registry cannot be read, and prints that it could not,
 * so a dead control is visible. A staged plan file that cannot be read BLOCKS; that is the
 * loud half.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { evaluate, isGitCommit, targetsDocRepo, stagedFiles, readStaged, DOC_REPO } from "../../scripts/enforcement/plan-row-allocation-gate.mjs";

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  try {
    const payload = raw.trim() ? JSON.parse(raw) : {};
    const command = payload?.tool_input?.command ?? payload?.toolInput?.command ?? payload?.command ?? "";
    const cwd = payload?.cwd ?? payload?.tool_input?.working_directory ?? process.cwd();
    if (!isGitCommit(command) || !targetsDocRepo(command, cwd)) process.exit(0);

    const staged = stagedFiles(DOC_REPO);
    if (staged === null) {
      process.stderr.write("PLAN-ROW-ALLOCATION-GATE could not run git; not blocking. This line exists so a dead control is visible.\n");
      process.exit(0);
    }
    let registry;
    try {
      registry = JSON.parse(readFileSync(join(DOC_REPO, "_catalog", "plan_registry.json"), "utf8"));
    } catch (e) {
      process.stderr.write(`PLAN-ROW-ALLOCATION-GATE could not read plan_registry.json (${e?.message ?? e}); not blocking. This line exists so a dead control is visible.\n`);
      process.exit(0);
    }
    // P-277: read what is being COMMITTED (the index), not the working tree.
    const read = (rel) => readStaged(DOC_REPO, rel);
    const verdict = evaluate(staged, read, registry);
    if (verdict.block) {
      const msg = verdict.message.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r/g, "").replace(/\n/g, "\\n");
      process.stderr.write(`{"block": true, "message": "${msg}"}`);
      process.exit(2);
    }
    process.exit(0);
  } catch (err) {
    process.stderr.write(`PLAN-ROW-ALLOCATION-GATE hook could not run: ${err?.message ?? err}. Not blocking. This line exists so a dead control is visible.\n`);
    process.exit(0);
  }
});
