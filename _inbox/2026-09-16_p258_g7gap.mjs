#!/usr/bin/env node
/**
 * P-258: measure the real G7 gap myself, rather than carry a lane's count into the close.
 *
 * Corpus gate.ts implements G7: a max_height_ft cell flagged not_specified:true must carry
 * the canonical sentinel 999 (NOT_SPECIFIED_MAX_HEIGHT_FT), and anything else BLOCKS. The
 * question is whether G7 is ever run over the SHIPPED tables, and how many shipped rows
 * would block if it were.
 */
import fs from "node:fs";
import path from "node:path";

const DIR = "P:/seat-worktrees/p258-setback-campaign/corpus-base/src/setbacks";
const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".json") && f !== "schema.json");

let total = 0, nonCanonical = 0;
const perFile = [];
const offenders = [];
for (const f of files) {
  let j;
  try { j = JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")); } catch { continue; }
  const districts = j.districts ?? j.setbacks ?? [];
  if (!Array.isArray(districts) || !districts.length) continue;
  let ns = 0, bad = 0;
  for (const d of districts) {
    const p = d.provenance?.max_height_ft;
    if (!p?.not_specified) continue;
    ns++;
    if (d.max_height_ft !== 999) {
      bad++;
      offenders.push(`${f}: ${d.district_name} -> ${JSON.stringify(d.max_height_ft)}`);
    }
  }
  total += ns; nonCanonical += bad;
  if (ns) perFile.push(`${f}: not_specified heights=${ns}, non-canonical=${bad}`);
}
console.log("tables scanned:", files.length);
console.log(perFile.join("\n"));
console.log(`\nTOTAL rows flagged not_specified on max_height_ft: ${total}`);
console.log(`TOTAL that G7 would BLOCK (value !== 999): ${nonCanonical}`);
console.log(`\nWould-block rows (first 40):\n${offenders.slice(0, 40).join("\n")}`);

// Is G7 ever run over the shipped tables, or only over in-test fixtures?
const testsDir = "P:/seat-worktrees/p258-setback-campaign/corpus-base/src/setbacks/__tests__";
const files2 = fs.existsSync(testsDir) ? fs.readdirSync(testsDir) : [];
console.log(`\ntest files in the corpus package: ${files2.join(", ") || "(none)"}`);
for (const f of files2) {
  const src = fs.readFileSync(path.join(testsDir, f), "utf8");
  const importsShipped = /from\s+["'][^"']*(setbacks|index)["']/.test(src);
  const callsGate = /runSetbackGate|runGate/.test(src);
  console.log(`  ${f}: callsGate=${callsGate} importsShippedTables=${importsShipped}`);
}
