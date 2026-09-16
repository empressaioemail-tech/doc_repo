#!/usr/bin/env node
/**
 * The 100-as-sentinel question, measured across every row the wave added.
 *
 * The corpus convention for "ordinance states nothing" on max_height_ft is 999
 * (NOT_SPECIFIED_MAX_HEIGHT_FT, corpus rule G7), and for other fields the string
 * "not_specified". A stored 100 with not_specified:true is the older convention. This counts
 * how many NEW cells carry a sentinel flag while holding a value the canonical rules do not
 * expect, since those are the cells a consumer could read as data.
 */
import fs from "node:fs";

const added = JSON.parse(fs.readFileSync("P:/seat-worktrees/p258-setback-campaign/doc_repo/_inbox/2026-09-16_p258_added_rows.json", "utf8"));
const FIELDS = ["front_ft", "rear_ft", "side_ft", "side_corner_ft", "max_height_ft", "max_lot_coverage_pct", "max_impervious_pct"];

const rows = [];
let cells = 0, flagged100 = 0, flagged999 = 0, flaggedStr = 0, flaggedOther = 0;
for (const [lane, files] of Object.entries(added)) {
  for (const [file, list] of Object.entries(files)) {
    for (const d of list) {
      for (const f of FIELDS) {
        const v = d[f];
        if (v === undefined) continue;
        cells++;
        const p = d.provenance?.[f];
        const ns = p?.not_specified === true;
        if (!ns) continue;
        if (v === 100) { flagged100++; rows.push(`${lane} ${file} :: ${d.district_name} :: ${f}=100 not_specified`); }
        else if (v === 999) flagged999++;
        else if (v === "not_specified") flaggedStr++;
        else { flaggedOther++; rows.push(`${lane} ${file} :: ${d.district_name} :: ${f}=${JSON.stringify(v)} not_specified (UNEXPECTED)`); }
      }
    }
  }
}
console.log(`new cells examined: ${cells}`);
console.log(`  not_specified + 100  : ${flagged100}   <-- older convention; for max_height_ft this is what corpus G7 BLOCKS`);
console.log(`  not_specified + 999  : ${flagged999}   <-- canonical for max_height_ft`);
console.log(`  not_specified + "not_specified" : ${flaggedStr}`);
console.log(`  not_specified + other: ${flaggedOther}`);
if (rows.length) console.log("\n" + rows.join("\n"));

// Specifically: does any NEW row set not_specified on max_height_ft with a value other than 999?
console.log("\n=== new max_height_ft cells that corpus G7 would block ===");
let blocked = 0;
for (const [lane, files] of Object.entries(added)) {
  for (const [file, list] of Object.entries(files)) {
    for (const d of list) {
      const p = d.provenance?.max_height_ft;
      if (p?.not_specified === true && d.max_height_ft !== 999) {
        blocked++;
        console.log(`  ${lane} ${file} :: ${d.district_name} -> ${JSON.stringify(d.max_height_ft)}`);
      }
    }
  }
}
console.log(blocked === 0 ? "  none — every new not_specified height carries 999" : `  ${blocked} row(s)`);
