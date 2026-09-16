#!/usr/bin/env node
/** Does lane-c's fragment declare the four pre-existing San Marcos rows it changed, and
 *  did the same edit land in the corpus repo? */
import { execFileSync } from "node:child_process";
import fs from "node:fs";

const f = JSON.parse(fs.readFileSync("P:/seat-worktrees/p258-setback-campaign/doc_repo/_inbox/2026-09-16_p258_lane-c.json", "utf8"));
const t = JSON.stringify(f, null, 1);
console.log("=== fragment keys ===", Object.keys(f).join(", "));
for (const k of ["selfReport", "summary", "notes", "note", "leaveBehind"]) {
  if (f[k]) console.log(`--- ${k} ---\n${JSON.stringify(f[k]).slice(0, 2000)}`);
}
console.log("=== lines mentioning the edit / pre-existing work ===");
for (const line of t.split("\n")) {
  if (/pre-?existing|additive|unchanged|no numeric|sentinel|100\b.*999|RULING 4/i.test(line)) {
    console.log("  " + line.trim().slice(0, 400));
  }
}

const g = (a) => execFileSync("git", ["-C", "P:/seat-worktrees/p258-setback-campaign/corpus-base", ...a], { encoding: "utf8", maxBuffer: 1 << 28 });
console.log("\n=== corpus repo san-marcos: pre-existing height changes ===");
try {
  const b = JSON.parse(g(["show", "origin/main:src/setbacks/san-marcos-tx.json"]));
  const a = JSON.parse(g(["show", "origin/seat/p258-lane-c:src/setbacks/san-marcos-tx.json"]));
  const bm = new Map(b.districts.map((d) => [d.district_name, d]));
  const am = new Map(a.districts.map((d) => [d.district_name, d]));
  let n = 0;
  for (const [name, d] of bm) {
    const x = am.get(name);
    if (!x) { console.log(`  ROW REMOVED: ${name}`); n++; continue; }
    if (JSON.stringify(d.max_height_ft) !== JSON.stringify(x.max_height_ft)) { console.log(`  ${name}: max_height_ft ${d.max_height_ft} -> ${x.max_height_ft}`); n++; }
  }
  console.log(n ? `  ${n} pre-existing corpus row(s) changed` : "  none — corpus edit is additive");
} catch (e) { console.log("  check failed: " + e.message); }
