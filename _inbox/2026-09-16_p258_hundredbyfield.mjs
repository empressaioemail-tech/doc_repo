#!/usr/bin/env node
/**
 * The sharp version of the 100-as-sentinel finding: which NEW cells, by field, carry a
 * plausible-looking 100 while flagged not_specified. A front/side/rear yard of 100 ft is a
 * physically ordinary value, so a consumer reading only numbers cannot tell it from a real
 * standard — that is this program's named defect class, and the measurement belongs in the close.
 */
import fs from "node:fs";

const added = JSON.parse(fs.readFileSync("P:/seat-worktrees/p258-setback-campaign/doc_repo/_inbox/2026-09-16_p258_added_rows.json", "utf8"));
const FIELDS = ["front_ft", "rear_ft", "side_ft", "side_corner_ft", "max_height_ft", "max_lot_coverage_pct", "max_impervious_pct"];
const byField = {};
const byLaneField = {};
let total = 0;
for (const [lane, files] of Object.entries(added)) {
  for (const [file, list] of Object.entries(files)) {
    for (const d of list) {
      for (const f of FIELDS) {
        if (d[f] === undefined) continue;
        const p = d.provenance?.[f];
        if (p?.not_specified !== true || d[f] !== 100) continue;
        total++;
        byField[f] = (byField[f] ?? 0) + 1;
        byLaneField[`${lane}/${f}`] = (byLaneField[`${lane}/${f}`] ?? 0) + 1;
      }
    }
  }
}
console.log(`NEW cells carrying value 100 with not_specified:true — total ${total}`);
console.log("by field (front/rear/side/side_corner read as ordinary yard distances):");
for (const f of FIELDS) if (byField[f]) console.log(`   ${f}: ${byField[f]}`);
console.log("\nby lane and field:");
for (const [k, v] of Object.entries(byLaneField).sort()) console.log(`   ${k}: ${v}`);
