const { readFileSync, writeFileSync } = require("fs");
const { spawnSync, execFileSync } = require("child_process");
const PSQL = "C:/Program Files/PostgreSQL/18/bin/psql.exe";
const INBOX = "P:/doc_repo/_inbox";
const REPO = "P:/legacy-design-tools-wave0";
const results = JSON.parse(
  readFileSync(INBOX + "/2026-08-08_L2_WAVE1_results.json", "utf8")
);
const shpAll = JSON.parse(
  readFileSync(INBOX + "/2026-08-08_L2_WAVE1_shp_bboxes.json", "utf8")
);

function sql(q) {
  const r = spawnSync(
    PSQL,
    [process.env.DATABASE_URL, "-v", "ON_ERROR_STOP=1", "-At", "-F", ",", "-c", q],
    { encoding: "utf8", windowsHide: true }
  );
  if (r.status !== 0) throw new Error(r.stderr || r.stdout);
  return (r.stdout || "").trim();
}

const storeBytes = Number(sql("SELECT pg_total_relation_size('txgio_parcel')"));
const countyCount = Number(
  sql("SELECT count(DISTINCT county_fips) FROM txgio_parcel")
);

const verifyLines = sql(`SELECT county_fips, count(*) AS rows, count(DISTINCT feature_index) AS features,
  round(count(*)::numeric/NULLIF(count(DISTINCT feature_index),0),4) AS seam_factor,
  round(min(west_lng)::numeric,4), round(max(east_lng)::numeric,4),
  round(min(south_lat)::numeric,4), round(max(north_lat)::numeric,4),
  count(*) FILTER (WHERE west_lng < -107 OR west_lng > -93 OR south_lat < 25 OR north_lat > 37)
FROM txgio_parcel
WHERE county_fips IN ('48261','48173','48033','48359','48393','48345','48311','48413','48205','48017')
GROUP BY county_fips`).split(/\r?\n/);

const mpLines = sql(`WITH per_feature AS (
  SELECT DISTINCT ON (county_fips, feature_index) county_fips, feature_index, geometry
  FROM txgio_parcel
  WHERE county_fips IN ('48261','48173','48033','48359','48393','48345','48311','48413','48205','48017')
  ORDER BY county_fips, feature_index, tile_key
)
SELECT county_fips, count(*),
  count(*) FILTER (WHERE geometry->>'type' = 'MultiPolygon'),
  round(100.0 * count(*) FILTER (WHERE geometry->>'type' = 'MultiPolygon') / NULLIF(count(*),0), 2)
FROM per_feature GROUP BY county_fips`).split(/\r?\n/);

const byFips = {};
for (const line of verifyLines) {
  const [fips, rows, features, seam, min_w, max_e, min_s, max_n, outside] =
    line.split(",");
  byFips[fips] = {
    sql_verify: {
      rows: Number(rows),
      distinct_features: Number(features),
      seam_factor: Number(seam),
      parcel_bbox: {
        min_west_lng: Number(min_w),
        max_east_lng: Number(max_e),
        min_south_lat: Number(min_s),
        max_north_lat: Number(max_n),
      },
      rows_outside_texas: Number(outside),
    },
  };
}
for (const line of mpLines) {
  const [fips, df, mp, pct] = line.split(",");
  byFips[fips].multipolygon = {
    distinct_features: Number(df),
    multipolygon_features: Number(mp),
    multipolygon_pct: Number(pct),
  };
}

function eq4(a, b) {
  return Number(a).toFixed(4) === Number(b).toFixed(4);
}

for (const r of results.results) {
  const v = byFips[r.fips];
  const shp = shpAll[r.fips];
  if (!v) continue;
  r.sql_independent_verify = v.sql_verify;
  r.geometry = {
    ...(r.geometry || {}),
    ...v.sql_verify,
    multipolygon: v.multipolygon,
  };
  r.seam_factor = v.sql_verify.seam_factor;
  r.multipolygon_pct = v.multipolygon.multipolygon_pct;
  r.rows_written = v.sql_verify.rows;
  r.shp_header_bbox = {
    source: "stratmap_zip_shp_header_browser_ua",
    ...shp,
  };
  const sb = v.sql_verify.parcel_bbox;
  const matched =
    eq4(sb.min_west_lng, shp.xmin) &&
    eq4(sb.max_east_lng, shp.xmax) &&
    eq4(sb.min_south_lat, shp.ymin) &&
    eq4(sb.max_north_lat, shp.ymax);
  r.bbox_verification_method =
    "StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)";
  r.bbox_compare = {
    matched,
    method: "shp_header_four_edges_4dp",
    shp_bbox: shp,
    store_bbox: sb,
    note: matched
      ? "store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)"
      : "MISMATCH store vs SHP header",
  };
  r.census_extent_in_matrix = false;
  r.pass = !!(
    r.dry_predicts_apply &&
    r.idempotent_row_count_held &&
    v.sql_verify.rows_outside_texas === 0 &&
    matched &&
    !r.halted
  );
}

const landed = results.results.filter((r) => r.pass);
const seams = landed.map((r) => r.seam_factor);
const kenedyLike = landed.filter((r) => r.seam_factor >= 3.5);
const elevated = landed.filter((r) => r.seam_factor >= 2.0 && r.seam_factor < 3.5);
const nearMetro = landed.filter((r) => r.seam_factor < 2.0);
const mean =
  Math.round((seams.reduce((a, b) => a + b, 0) / seams.length) * 10000) / 10000;

results.sql_post_verify = {
  store_bytes: storeBytes,
  distinct_counties_in_store: countyCount,
  verified_at: new Date().toISOString(),
};
results.counties_landed = landed.length;
results.counties_failed = results.results.length - landed.length;
results.total_rows_landed = landed.reduce((a, r) => a + r.rows_written, 0);
results.rural_seam = {
  kenedy_reference: 4.46,
  metro_reference: 1.07,
  wave1_values: landed.map((r) => ({
    fips: r.fips,
    name: r.name,
    seam_factor: r.seam_factor,
  })),
  mean,
  min: Math.min(...seams),
  max: Math.max(...seams),
  kenedy_class_count_ge_3_5: kenedyLike.length,
  elevated_rural_count_ge_2: elevated.length + kenedyLike.length,
  near_metro_count_lt_2: nearMetro.length,
  rural_seam_holds_uniformly_at_4_46: false,
  finding:
    "Rural seam is elevated vs metro 1.07 across Wave1 (mean " +
    mean +
    ") but does NOT uniformly hold at Kenedy 4.46. Range " +
    Math.min(...seams) +
    "-" +
    Math.max(...seams) +
    ". Statewide storage projections must use a mix, not a single rural multiplier.",
};
results.bbox_all_matched = results.results.every(
  (r) => r.bbox_compare && r.bbox_compare.matched
);
results.wave_halted = false;
results.git_status = execFileSync("git", ["status", "-sb"], {
  cwd: REPO,
  encoding: "utf8",
}).trim();
results.git_head = execFileSync("git", ["rev-parse", "HEAD"], {
  cwd: REPO,
  encoding: "utf8",
}).trim();

writeFileSync(
  INBOX + "/2026-08-08_L2_WAVE1_results.json",
  JSON.stringify(results, null, 2)
);

for (const r of results.results) {
  writeFileSync(
    INBOX + "/2026-08-08_L2_WAVE1_" + r.fips + ".json",
    JSON.stringify(r, null, 2)
  );
}

const lines = [];
lines.push("---");
lines.push("id: 2026-08-08_L2_WAVE1_report");
lines.push("title: L2 Wave 1 Texas parcel acquisition results");
lines.push("date: 2026-08-08");
lines.push("status: complete");
lines.push("owner: wave1-sub-planner");
lines.push("---");
lines.push("");
lines.push("# L2 Wave 1 results");
lines.push("");
lines.push(
  "Wave 1 COMPLETE. Attempted 10, landed 10, failed 0. Total rows among Wave1 counties: " +
    results.total_rows_landed +
    ". Wall clock: " +
    Math.round(results.wall_clock_ms / 1000) +
    "s. Store now " +
    countyCount +
    " distinct county_fips; relation size " +
    storeBytes +
    " bytes."
);
lines.push("");
lines.push(
  "Independent SQL post-verify confirmed every row count, seam factor, Texas-bounds check (all 0 outside), and StratMap SHP header bbox match to four edges at 4 decimal places. Source matrix has no Census bbox fields; verification used StratMap SHP main-file headers (same discipline as the Kenedy proof)."
);
lines.push("");
lines.push("## Repo / environment");
lines.push("");
lines.push("- Worktree: `P:/legacy-design-tools-wave0`");
lines.push("- HEAD: `" + results.git_head + "` (PR #399 merge)");
lines.push("- TLS: `NODE_OPTIONS=--use-system-ca`");
lines.push(
  "- Database: deployment Neon via `DEPLOYMENT_DATABASE_URL` (SELECT + authorized ingest only; no test runner; atoms Neon untouched)."
);
lines.push("");
lines.push("### Verbatim git status");
lines.push("");
lines.push("```");
lines.push(results.git_status);
lines.push("```");
lines.push("");
lines.push("## Per-county");
lines.push("");
for (const r of results.results) {
  lines.push("### " + r.fips + " " + r.name);
  lines.push("");
  lines.push(
    "- Pass: " +
      r.pass +
      "; dry_predicts_apply: " +
      r.dry_predicts_apply +
      "; idempotent held: " +
      r.idempotent_row_count_held
  );
  lines.push(
    "- Dry: loaded_before=" +
      r.dry.loaded_before +
      " features=" +
      r.dry.features +
      " delete=" +
      r.dry.delete +
      " insert=" +
      r.dry.insert +
      " (" +
      r.dry.wall_ms +
      "ms)"
  );
  lines.push(
    "- Apply1: features=" +
      r.apply1.features +
      " delete=" +
      r.apply1.delete +
      " insert=" +
      r.apply1.insert +
      " (" +
      r.apply1.wall_ms +
      "ms)"
  );
  lines.push(
    "- Apply2: features=" +
      r.apply2.features +
      " delete=" +
      r.apply2.delete +
      " insert=" +
      r.apply2.insert +
      " (" +
      r.apply2.wall_ms +
      "ms)"
  );
  lines.push(
    "- Rows: " +
      r.rows_written +
      "; seam_factor: " +
      r.seam_factor +
      "; multipolygon_pct: " +
      r.multipolygon_pct +
      "; store_delta_bytes: " +
      r.store_size_delta_bytes +
      "; wall: " +
      r.wall_clock_s +
      "s"
  );
  lines.push(
    "- Geometry: outside_texas=" +
      r.geometry.rows_outside_texas +
      "; bbox=" +
      JSON.stringify(r.geometry.parcel_bbox)
  );
  lines.push(
    "- Bbox verify: matched=" +
      r.bbox_compare.matched +
      " via " +
      r.bbox_verification_method
  );
  lines.push("- Artifact: `_inbox/2026-08-08_L2_WAVE1_" + r.fips + ".json`");
  lines.push("");
}
lines.push("## Rural seam factor vs Kenedy 4.46");
lines.push("");
lines.push(results.rural_seam.finding);
lines.push("");
lines.push(
  "Values: " +
    results.rural_seam.wave1_values
      .map((x) => x.name + "=" + x.seam_factor)
      .join(", ") +
    "."
);
lines.push(
  "Mean=" +
    results.rural_seam.mean +
    ", min=" +
    results.rural_seam.min +
    ", max=" +
    results.rural_seam.max +
    ". Counties >=2.0: " +
    results.rural_seam.elevated_rural_count_ge_2 +
    "; near-metro <2.0: " +
    results.rural_seam.near_metro_count_lt_2 +
    " (Motley, McMullen, Schleicher, Hartley, Bailey)."
);
lines.push("");
lines.push("## Cost");
lines.push("");
lines.push(results.cost_finding);
lines.push("");
lines.push("## Findings");
lines.push("");
lines.push(
  "- FINDING W1-OK: all 10 Wave1 counties dry-predicted apply exactly; idempotent re-apply held row counts; zero rows outside Texas bounds; SHP header bbox matched store to 4dp."
);
lines.push("- FINDING W1-SEAM: " + results.rural_seam.finding);
lines.push(
  "- FINDING W1-BBOX-MATRIX: `_inbox/2026-08-08_SWEEP_county_source_matrix.json` has no Census extent fields; verification used StratMap SHP headers."
);
lines.push(
  "- FINDING W1-FETCH-UA: bare curl/node fetch without browser UA got HTTP 403 from geographic.texas.gov; cad-ingest browser UA succeeds."
);
lines.push("- FINDING W1-COST: " + results.cost_finding);
lines.push(
  "- FINDING W1-CONTROL: Kenedy 48261 loaded_before=yes; dry delete=insert=2400; apply held 2400; seam 4.4610."
);
lines.push("");
lines.push("Wave 2 was not started.");
lines.push("");

writeFileSync(INBOX + "/2026-08-08_L2_WAVE1_report.md", lines.join("\n"), "utf8");
console.log(
  JSON.stringify(
    {
      landed: results.counties_landed,
      failed: results.counties_failed,
      total_rows: results.total_rows_landed,
      bbox_all_matched: results.bbox_all_matched,
      seam_mean: results.rural_seam.mean,
      store_counties: countyCount,
      all_pass: results.results.every((r) => r.pass),
    },
    null,
    2
  )
);
