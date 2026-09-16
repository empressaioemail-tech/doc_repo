#!/usr/bin/env node
/**
 * P-258 wave generator — builds the authoritative worklist skeleton from the
 * P-255 census and assigns every (city, district) unit and every no-table city
 * row to exactly one lane.
 *
 * WHY THIS EXISTS. The dispatch's falsifier 1 is "every one of the 209 units and
 * 54 cities appears in the worklist with a state; none is silently missing". A
 * hand-written worklist cannot prove that. This generator enumerates from the
 * census itself, so the skeleton is complete by construction and a lane can only
 * ADD a state to an entry that already exists.
 *
 * Usage:
 *   node _inbox/2026-09-16_p258_wavegen.mjs [--census <path>] [--out <path>]
 */

import fs from "node:fs";
import path from "node:path";

const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const args = process.argv.slice(2);
const argOf = (name, dflt) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : dflt;
};
const CENSUS = argOf("--census", "P:/doc_repo/_inbox/2026-09-16_setback_parcel_census.json");
const OUT = argOf("--out", path.join(HERE, "2026-09-16_p258_worklist.json"));

const census = JSON.parse(fs.readFileSync(CENSUS, "utf8"));

/** Lane assignment. The dispatch's six suggested lanes, adjusted to what the
 *  census actually shows (recorded in the CP1 artifact, with the reasons). */
function laneForUnit(county, city) {
  if (city === "austin-tx") return "lane-a";
  if (city === "waco-tx") return "lane-b";
  return "lane-c";
}

/** No-table city rows are assigned by county, except that a city spanning more
 *  than one county is researched ONCE by the lane owning its heaviest row; the
 *  other rows carry ownerLane to the same lane so the city is classified once. */
function laneForCityCounty(county) {
  if (county === "McLennan") return "lane-d";
  if (county === "Travis") return "lane-e";
  return "lane-f";
}

const cities = []; // {city, county, parcels, withDistrictOnRecord, zoningRefused, ownerLane}
const units = []; // {unitId, county, city, districtCode, parcels, lane}

for (const co of census.counties) {
  const county = co.county;
  for (const d of co.districtMissCodes ?? []) {
    if (d.plannedDevelopment) continue; // out of scope: A-164 PUD message (P-256/P-257)
    const code = d.districtCode ?? d.code;
    units.push({
      unitId: `unit:${county}:${d.city}:${code}`,
      kind: "district-miss",
      county,
      countyFips: co.countyFips,
      city: d.city,
      districtCode: code,
      parcels: d.parcels,
      lane: laneForUnit(county, d.city),
      state: "pending",
    });
  }
  for (const n of co.noTableCities ?? []) {
    cities.push({
      cityRowId: `city:${county}:${n.city}`,
      kind: "no-table-city",
      county,
      countyFips: co.countyFips,
      city: n.city,
      parcels: n.parcels,
      withDistrictOnRecord: n.withDistrictOnRecord,
      zoningRefused: n.zoningRefused,
      lane: laneForCityCounty(county),
      state: "pending",
    });
  }
}

// One classification per distinct city: the heaviest row's lane owns the research.
const byCity = new Map();
for (const c of cities) {
  const cur = byCity.get(c.city);
  if (!cur || c.parcels > cur.parcels) byCity.set(c.city, c);
}
for (const c of cities) {
  const owner = byCity.get(c.city);
  c.ownerLane = owner.lane;
  c.researchedIn = `city:${owner.county}:${owner.city}`;
  c.lane = owner.lane; // every row for a city routes to one lane
}

const byLane = {};
for (const row of [...units, ...cities]) {
  byLane[row.lane] = byLane[row.lane] ?? { units: 0, cities: 0, parcels: 0 };
  if (row.kind === "district-miss") byLane[row.lane].units++;
  else byLane[row.lane].cities++;
  byLane[row.lane].parcels += row.parcels;
}

const distinctCities = new Set(cities.map((c) => c.city));
const unitParcels = units.reduce((a, u) => a + u.parcels, 0);
const cityParcels = cities.reduce((a, c) => a + c.parcels, 0);

const worklist = {
  lane: "p258-setback-campaign",
  planRows: ["P-258"],
  generatedAt: new Date().toISOString(),
  census: {
    path: CENSUS,
    ranAt: census.ranAt,
    instrument: census.instrument,
  },
  /** Counting rules inline, per DEV_PROCESS 1.2. */
  counts: {
    units: {
      value: units.length,
      rule: "distinct (city, districtCode) units, plannedDevelopment===false, summed over the six counties in the P-255 census districtMissCodes arrays",
    },
    unitParcels: { value: unitParcels, rule: "sum of parcels over those units, as counted by the census" },
    cityRows: {
      value: cities.length,
      rule: "rows in the six counties' noTableCities arrays (a city spanning two counties has one row per county)",
    },
    distinctCities: {
      value: distinctCities.size,
      rule: "distinct city slugs over those rows",
    },
    cityParcels: { value: cityParcels, rule: "sum of parcels over the no-table city rows" },
  },
  laneAssignment: byLane,
  /** Every entry below starts state=pending; a lane may only set the state of an
   *  entry that already exists here. `state` vocabulary is fixed. */
  states: ["pending", "acquired", "declared-unacquirable", "blocked", "out-of-scope-pud"],
  units,
  cities,
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(worklist, null, 2) + "\n", "utf8");

console.log(`wrote ${OUT}`);
console.log(`units=${units.length} unitParcels=${unitParcels}`);
console.log(`cityRows=${cities.length} distinctCities=${distinctCities.size} cityParcels=${cityParcels}`);
for (const [lane, v] of Object.entries(byLane).sort()) {
  console.log(`  ${lane}: units=${v.units} cities=${v.cities} parcels=${v.parcels}`);
}
