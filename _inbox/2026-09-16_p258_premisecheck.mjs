#!/usr/bin/env node
/**
 * Both batch-2 lanes independently argued that the dispatch's framing of the no-table half is
 * wrong: they say these cities are mostly "no staged layer and no district stamp" rather than
 * "stamped but no table". A lane's claim about the PLANNER'S OWN INPUT is exactly the kind of
 * thing I should measure rather than accept or dismiss, so this reads the census directly.
 *
 * The dispatch's words: the no-table cities "have parcels carrying a zoning/district stamp but
 * no setback table". Test: how many of the 61 rows actually carry district stamps?
 */
import fs from "node:fs";

const CENSUS = "P:/doc_repo/_inbox/2026-09-16_setback_parcel_census.json";
const census = JSON.parse(fs.readFileSync(CENSUS, "utf8"));

const rows = [];
for (const co of census.counties) {
  for (const n of co.noTableCities ?? []) {
    rows.push({
      county: co.county,
      city: n.city,
      parcels: n.parcels,
      withDistrictOnRecord: n.withDistrictOnRecord ?? 0,
      zoningRefused: n.zoningRefused ?? 0,
    });
  }
}

const withStamps = rows.filter((r) => r.withDistrictOnRecord > 0);
console.log(`no-table city rows: ${rows.length}`);
console.log(`rows carrying ANY district stamp (withDistrictOnRecord > 0): ${withStamps.length}`);
console.log(`rows with withDistrictOnRecord === 0: ${rows.length - withStamps.length}`);
console.log(`\nparcels on rows carrying a stamp: ${withStamps.reduce((a, r) => a + r.parcels, 0)} of ${rows.reduce((a, r) => a + r.parcels, 0)}`);
console.log("\nthe rows that DO carry a stamp:");
for (const r of withStamps.sort((a, b) => b.withDistrictOnRecord - a.withDistrictOnRecord)) {
  console.log(`  ${r.county}/${r.city}: ${r.withDistrictOnRecord} of ${r.parcels} stamped, zoningRefused=${r.zoningRefused}`);
}

// The lanes' stronger claim: not just "no stamp", but "zoning refused for every parcel".
const refusedAll = rows.filter((r) => r.withDistrictOnRecord === 0 && r.zoningRefused >= r.parcels && r.parcels > 0);
console.log(`\nrows where zoning was refused for EVERY parcel AND no stamp: ${refusedAll.length}`);
