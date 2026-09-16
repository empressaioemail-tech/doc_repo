#!/usr/bin/env node
/**
 * P-258 adversarial check: did any lane CHANGE an existing table row rather than add one?
 *
 * A line grep for removed numeric lines is unreliable (a reformatted JSON array can drop a
 * line without changing a value, and a quoting slip can make the grep silently match
 * nothing — which reads exactly like a pass). So this parses both revisions of every table
 * and compares them per district_name, which cannot fail quietly in the same way.
 *
 * Reports, per lane: rows added, rows removed, and every field whose value changed on a
 * pre-existing row. Any changed or removed value is a finding.
 */
import { execFileSync } from "node:child_process";

const REPO = "P:/seat-worktrees/p258-setback-campaign/ldt-base";
const DIR = "lib/adapters/src/local/setbacks";
const FIELDS = ["front_ft", "rear_ft", "side_ft", "side_corner_ft", "max_height_ft", "max_lot_coverage_pct", "max_impervious_pct", "min_lot_sqft", "min_lot_width_ft"];
const git = (a) => execFileSync("git", ["-C", REPO, ...a], { encoding: "utf8", maxBuffer: 1 << 28 });
const read = (ref, file) => {
  try { return JSON.parse(git(["show", `${ref}:${DIR}/${file}`])); } catch { return null; }
};
const tables = (ref) => git(["ls-tree", "--name-only", `${ref}:${DIR}`]).split("\n").filter((f) => f.endsWith(".json"));

let totalChanged = 0, totalRemoved = 0, totalAdded = 0;
for (const lane of ["lane-a", "lane-b", "lane-c", "lane-d", "lane-e", "lane-f"]) {
  const ref = `origin/seat/p258-${lane}`;
  console.log(`\n=== ${lane} (${ref}) ===`);
  for (const file of tables(ref)) {
    const after = read(ref, file), before = read("origin/main", file);
    if (!after) continue;
    const bMap = new Map((before?.districts ?? []).map((d) => [d.district_name, d]));
    const aMap = new Map((after.districts ?? []).map((d) => [d.district_name, d]));
    const added = [...aMap.keys()].filter((n) => !bMap.has(n));
    const removed = [...bMap.keys()].filter((n) => !aMap.has(n));
    const changed = [];
    for (const [name, b] of bMap) {
      const a = aMap.get(name);
      if (!a) continue;
      for (const f of FIELDS) {
        if (JSON.stringify(b[f]) !== JSON.stringify(a[f])) changed.push(`${name}.${f}: ${JSON.stringify(b[f])} -> ${JSON.stringify(a[f])}`);
      }
      // provenance/quote/citation edits on pre-existing rows are reported too: they change
      // what the corpus claims about a value even when the number is untouched.
      const prov = JSON.stringify(b.provenance ?? null) !== JSON.stringify(a.provenance ?? null);
      const cite = (b.citation_url ?? null) !== (a.citation_url ?? null);
      if (prov) changed.push(`${name}.provenance: MODIFIED`);
      if (cite) changed.push(`${name}.citation_url: MODIFIED`);
    }
    if (!added.length && !removed.length && !changed.length) continue;
    console.log(`  ${file}: added=${added.length} removed=${removed.length} touched-preexisting=${changed.length}`);
    for (const r of removed) { totalRemoved++; console.log(`     REMOVED ROW: ${r}`); }
    for (const c of changed) { totalChanged++; console.log(`     CHANGED: ${c}`); }
    totalAdded += added.length;
  }
}
console.log(`\nTOTAL: added rows=${totalAdded}, removed rows=${totalRemoved}, touched pre-existing fields/rows=${totalChanged}`);
console.log(totalRemoved || totalChanged ? "FINDINGS PRESENT — inspect the list above." : "No pre-existing row was removed or altered; the wave is purely additive.");
