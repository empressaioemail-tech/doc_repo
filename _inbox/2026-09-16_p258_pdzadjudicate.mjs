#!/usr/bin/env node
/**
 * Adjudicate the single F3 scan hit, and check whether any table that got a new row ALSO
 * carries a genuine planned-development district that was left alone (which would be correct)
 * or rowed (which would be the violation).
 */
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const REPO = "P:/seat-worktrees/p258-setback-campaign/ldt-base";
const DIR = "lib/adapters/src/local/setbacks";
const git = (a) => execFileSync("git", ["-C", REPO, ...a], { encoding: "utf8", maxBuffer: 1 << 28 });

const added = JSON.parse(fs.readFileSync("P:/seat-worktrees/p258-setback-campaign/doc_repo/_inbox/2026-09-16_p258_added_rows.json", "utf8"));
const row = added["lane-f"]["smithville-tx.json"].find((d) => /^PD-Z/.test(d.district_name));
console.log("=== the flagged row ===");
console.log(JSON.stringify({ name: row.district_name, front_ft: row.front_ft, rear_ft: row.rear_ft, side_ft: row.side_ft, max_height_ft: row.max_height_ft, citation_url: row.citation_url }, null, 1));
console.log("front_ft provenance:", JSON.stringify(row.provenance?.front_ft, null, 1).slice(0, 600));

// Every district name in the smithville table, to see if a real PD/planned-development row exists.
const tbl = JSON.parse(git(["show", "origin/seat/p258-lane-f:" + DIR + "/smithville-tx.json"]));
console.log("\n=== all smithville districts in the table ===");
for (const d of tbl.districts) {
  const flag = /(^|[^A-Z])(PUD|PDD|PD|PC|PDA)([^A-Z]|$)/.test(d.district_name.toUpperCase().replace(/[^A-Z0-9/ ]/g, " ")) ? "  <-- scan-family" : "";
  console.log(`  ${d.district_name}${flag}`);
}

// Across every table the wave touched, is there a district whose name is EXACTLY the planned
// development family (i.e. a real PD district, not a PD-prefixed Euclidean name)?
console.log("\n=== exact-family names across all six lanes' added rows ===");
const family = /^(PD|PUD|PDD|PDA|PC|PD-?\d*|PUD-?\d*)$/i;
let hits = 0;
for (const [lane, files] of Object.entries(added)) {
  for (const [file, rows] of Object.entries(files)) {
    for (const d of rows) {
      const base = d.district_name.split(/[\s(]/)[0];
      if (family.test(base)) { hits++; console.log(`  ${lane} ${file}: ${d.district_name}`); }
    }
  }
}
console.log(hits ? `${hits} exact-family hit(s) — adjudicate` : "no district whose leading token IS the planned-development family; the only scan hit is a PD-Z-prefixed Euclidean garden-home district");
