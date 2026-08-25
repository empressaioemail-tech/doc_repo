#!/usr/bin/env node
/**
 * P-78 WDLL item 9 — one-county stratmap-landuse leftover dry-run (parse only).
 * Does not write cad_property. Caldwell 48055 (not bulk_primary blocked FIPS).
 *
 * Usage: node scripts/p78-leftover-dryrun-caldwell.mjs [--out path.json]
 */

import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseYearBuilt, landAcresFromGis } from "./p78-merge-fixtures-selftest.mjs";

const require = createRequire(import.meta.url);
const shapefile = require(
  "P:/legacy-design-tools/lib/cad-ingest/node_modules/shapefile",
);

const DBF =
  "P:/tmp/stratmap-year-built-sample/extract/stratmap25-landparcels_48055_caldwell_202503.dbf";
const OUT_DEFAULT = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "_inbox",
  "2026-08-25_p78_leftover_dryrun_caldwell_48055.json",
);

function blankStatLand(v) {
  if (v == null) return true;
  if (typeof v === "string" && v.trim() === "") return true;
  return false;
}

async function main() {
  const outArg = process.argv.indexOf("--out");
  const outPath =
    outArg >= 0 ? process.argv[outArg + 1] : OUT_DEFAULT;

  let rowsRead = 0;
  let yearBuiltNonNull = 0;
  let landAcresNonNull = 0;
  let landAcresRefused = 0;
  let propertyUseNonNull = 0;
  let yearBuiltWouldHaveBeenNullUnderHardNull = 0;
  let landAcresWouldHaveBeenNullUnderHardNull = 0;

  const samples = {
    yearBuiltParsed: [],
    landAcresParsed: [],
    landAcresRefused: [],
  };

  const source = await shapefile.openDbf(DBF);
  for (;;) {
    const rec = await source.read();
    if (rec.done) break;
    const p = rec.value;
    rowsRead += 1;
    const yb = parseYearBuilt(p.YEAR_BUILT);
    if (yb != null) {
      yearBuiltNonNull += 1;
      yearBuiltWouldHaveBeenNullUnderHardNull += 1;
      if (samples.yearBuiltParsed.length < 5) {
        samples.yearBuiltParsed.push({
          propId: p.Prop_ID,
          yearBuiltRaw: p.YEAR_BUILT,
          yearBuiltParsed: yb,
        });
      }
    }

    const gate = landAcresFromGis(p.GIS_AREA, p.GIS_AREA_U);
    if ("refuse" in gate) {
      landAcresRefused += 1;
      if (samples.landAcresRefused.length < 3) {
        samples.landAcresRefused.push({
          propId: p.Prop_ID,
          gisArea: p.GIS_AREA,
          gisAreaU: p.GIS_AREA_U,
          reason: gate.reason,
        });
      }
    } else if (gate.landAcres != null) {
      landAcresNonNull += 1;
      landAcresWouldHaveBeenNullUnderHardNull += 1;
      if (samples.landAcresParsed.length < 5) {
        samples.landAcresParsed.push({
          propId: p.Prop_ID,
          gisArea: p.GIS_AREA,
          gisAreaU: p.GIS_AREA_U,
          landAcres: gate.landAcres,
        });
      }
    }

    if (!blankStatLand(p.STAT_LAND_)) propertyUseNonNull += 1;
  }

  const payload = {
    artifact: "p78-leftover-dryrun-caldwell-48055",
    planRow: "P-78",
    wdllItem: 9,
    measuredAt: new Date().toISOString(),
    mode: "parse-only-dry-run",
    neonWrites: false,
    cadPropertyWrites: false,
    county: {
      fips: "48055",
      name: "Caldwell",
      reason:
        "Leftover county: not bulk_primary (48113/48439 blocked without --allow-stratmap-fallback)",
    },
    source: {
      dbf: DBF,
      vintageInName: "202503",
      zip: "stratmap25-landparcels_48055_lp.zip",
      priorRawMeasure:
        "_inbox/2026-08-24_stratmap_year_built_gis_area_sample.json",
    },
    parser: {
      reference: "scripts/p78-merge-fixtures-selftest.mjs (matches LDT p78Merge.ts on 46e1a5a1)",
      ldtShipped: "72cffc8 on origin/main",
    },
    counts: {
      rowsRead,
      propertyUseNonNull,
      yearBuiltNonNull,
      yearBuiltNull: rowsRead - yearBuiltNonNull,
      yearBuiltNonNullPct: Number(
        ((100 * yearBuiltNonNull) / rowsRead).toFixed(2),
      ),
      landAcresNonNull,
      landAcresRefused,
      landAcresNullNoRefuse: rowsRead - landAcresNonNull - landAcresRefused,
      landAcresNonNullPct: Number(
        ((100 * landAcresNonNull) / rowsRead).toFixed(2),
      ),
      leftoverVsHardNull: {
        yearBuiltRecovered: yearBuiltWouldHaveBeenNullUnderHardNull,
        landAcresRecovered: landAcresWouldHaveBeenNullUnderHardNull,
        note: "Pre-P-78 landuse.ts forced yearBuilt and landAcres null always",
      },
    },
    samples,
    verdict: {
      wdllItem9DryRunFiled: true,
      stratmapLanduseApplyAllowed: false,
      blockReason:
        "Dry-run filed. Do not run stratmap-landuse upsert while Tarrant DELETE identification is open.",
    },
  };

  writeFileSync(outPath, JSON.stringify(payload, null, 2) + "\n");
  console.log(`Wrote ${outPath}`);
  console.log(
    JSON.stringify(
      {
        rowsRead,
        yearBuiltNonNull,
        landAcresNonNull,
        landAcresRefused,
        propertyUseNonNull,
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
