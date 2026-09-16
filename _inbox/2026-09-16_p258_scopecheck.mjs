#!/usr/bin/env node
/**
 * Constraint check: no lane may change adapter BEHAVIOUR. Two shapes to separate —
 *  (a) new/changed setback tables and their registrations, which is the wave's job;
 *  (b) everything else, which may only be comments/docs/tests, or it is a scope breach.
 * A comment-only edit to a .ts file is legitimate; a logic line is not. So for non-table .ts
 * files this counts changed NON-COMMENT lines rather than trusting "it was just comments".
 */
import { execFileSync } from "node:child_process";

const REPO = "P:/seat-worktrees/p258-setback-campaign/ldt-base";
const git = (a) => execFileSync("git", ["-C", REPO, ...a], { encoding: "utf8", maxBuffer: 1 << 28 });

for (const lane of ["lane-a", "lane-b", "lane-c", "lane-d", "lane-e", "lane-f"]) {
  const ref = `origin/seat/p258-${lane}`;
  const files = git(["diff", "--name-only", `origin/main...${ref}`]).split("\n").filter(Boolean);
  console.log(`\n=== ${lane}: ${files.length} changed file(s) ===`);
  for (const f of files) {
    const tableFile = f.startsWith("lib/adapters/src/local/setbacks/") && f.endsWith(".json");
    if (tableFile) { console.log(`  [table]  ${f}`); continue; }
    const d = git(["diff", `origin/main...${ref}`, "--", f]);
    const changed = d.split("\n").filter((l) => /^[+-]/.test(l) && !/^(\+\+\+|---)/.test(l));
    const nonComment = changed.filter((l) => !/^\+\s*(\/\/|\*|\/\*)/.test(l) && !/^-\s*(\/\/|\*|\/\*)/.test(l));
    const isTest = /__tests__|\.test\.ts$/.test(f);
    const isDoc = /\.md$/.test(f);
    const tag = isDoc ? "[doc]   " : isTest ? "[test]  " : nonComment.length ? "[CODE]  " : "[comment]";
    console.log(`  ${tag} ${f}  (+/- lines ${changed.length}, non-comment ${nonComment.length})`);
    if (!isDoc && !isTest && nonComment.length) {
      for (const l of nonComment.slice(0, 6)) console.log(`        ${l.trim().slice(0, 160)}`);
    }
  }
}
