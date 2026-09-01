/**
 * Wave 2 single-county worker. Invoked as:
 *   node worker.mjs <fips> <name> <url> <http_status> <vintage_yyyymm>
 * Writes P:/doc_repo/_inbox/2026-08-08_L2_WAVE2_<fips>.json
 * Exit 0 on pass, 2 on halt/fail.
 */
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import zlib from "node:zlib";

const INBOX = "P:/doc_repo/_inbox";
const REPO = "P:/legacy-design-tools-wave0";
const PSQL = "C:/Program Files/PostgreSQL/18/bin/psql.exe";
const WAVE_TAG = "WAVE2";

const [fips, name, url, httpStatus, vintage] = process.argv.slice(2);
if (!fips || !name || !url) {
  console.error("usage: worker.mjs <fips> <name> <url> <http_status> <vintage>");
  process.exit(1);
}

function requireEnv(n) {
  const v = process.env[n];
  if (!v) throw new Error(`missing env ${n}`);
  return v;
}

function sql(query) {
  const db = requireEnv("DATABASE_URL");
  const r = spawnSync(
    PSQL,
    [db, "-v", "ON_ERROR_STOP=1", "-At", "-F", ",", "-c", query],
    { encoding: "utf8", windowsHide: true }
  );
  if (r.status !== 0) throw new Error(`psql failed: ${r.stderr || r.stdout}`);
  return (r.stdout || "").trim();
}

function parseSummary(text) {
  const get = (re) => {
    const m = text.match(re);
    return m ? m[1].trim() : null;
  };
  const num = (re) => {
    const s = get(re);
    return s == null ? null : Number(s.replace(/,/g, ""));
  };
  const dry = /DRY RUN/i.test(text);
  return {
    dry,
    loaded_before: get(/loaded before:\s+(\S+)/i),
    features_read: num(/features read:\s+(\d+)/i),
    features_parsed: num(/features parsed:\s+(\d+)/i),
    features: dry
      ? num(/features would load:\s+(\d+)/i)
      : num(/features load:\s+(\d+)/i),
    delete: dry
      ? num(/rows would delete:\s+(\d+)/i)
      : num(/rows delete:\s+(\d+)/i),
    insert: dry
      ? num(/rows would insert:\s+(\d+)/i)
      : num(/rows insert:\s+(\d+)/i),
    skipped: num(/features skipped:\s+(\d+)/i),
    duration_s: (() => {
      const m = text.match(/duration:\s+([\d.]+)s/i);
      return m ? Number(m[1]) : null;
    })(),
    source_vintage: get(/source vintage:\s+(\S+)/i),
    source_crs: get(/source CRS:\s+(\S+)/i),
  };
}

function runIngest(dryRun) {
  const args = [
    "--filter",
    "@workspace/cad-ingest",
    "txgio-ingest",
    "--",
    `--county=${fips}`,
  ];
  if (dryRun) args.push("--dry-run");
  // Harris 48201 ships east+west shapefiles; fail-closed without --multi-shp=concat
  // (PR #404, merged 2026-08-09). Only county with N>1 .shp in StratMap sweep.
  if (fips === "48201") args.push("--multi-shp=concat");
  const started = Date.now();
  const r = spawnSync("pnpm", args, {
    cwd: REPO,
    encoding: "utf8",
    windowsHide: true,
    env: process.env,
    shell: true,
    maxBuffer: 32 * 1024 * 1024,
  });
  return {
    exit_code: r.status,
    wall_ms: Date.now() - started,
    text: `${r.stdout || ""}\n${r.stderr || ""}`,
    summary: parseSummary(`${r.stdout || ""}\n${r.stderr || ""}`),
  };
}

function round4(n) {
  return Math.round(n * 10000) / 10000;
}

function listZipEntries(buf) {
  const entries = [];
  let i = 0;
  while (i + 30 < buf.length) {
    if (buf.readUInt32LE(i) !== 0x04034b50) break;
    const method = buf.readUInt16LE(i + 8);
    const compSize = buf.readUInt32LE(i + 18);
    const uncompSize = buf.readUInt32LE(i + 22);
    const nameLen = buf.readUInt16LE(i + 26);
    const extraLen = buf.readUInt16LE(i + 28);
    const name = buf.slice(i + 30, i + 30 + nameLen).toString("utf8");
    const dataStart = i + 30 + nameLen + extraLen;
    entries.push({ name, method, compSize, uncompSize, dataStart });
    i = dataStart + compSize;
  }
  return entries;
}

function extractZipEntry(buf, entry) {
  const slice = buf.slice(entry.dataStart, entry.dataStart + entry.compSize);
  if (entry.method === 0) return slice;
  if (entry.method === 8) return zlib.inflateRawSync(slice);
  throw new Error(`unsupported zip method ${entry.method}`);
}

async function fetchShpHeaderBbox(u) {
  const res = await fetch(u, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
      Accept: "*/*",
    },
  });
  if (!res.ok) return { error: `http ${res.status}`, url: u };
  const buf = Buffer.from(await res.arrayBuffer());
  const entries = listZipEntries(buf);
  const shp = entries.find((e) => e.name.toLowerCase().endsWith(".shp"));
  if (!shp) return { error: "no .shp in zip", url: u };
  const data = extractZipEntry(buf, shp);
  if (!data || data.length < 100) return { error: "shp too small", url: u };
  return {
    source: "stratmap_zip_shp_header_browser_ua",
    url: u,
    xmin: round4(data.readDoubleLE(36)),
    ymin: round4(data.readDoubleLE(44)),
    xmax: round4(data.readDoubleLE(52)),
    ymax: round4(data.readDoubleLE(60)),
    bytes: buf.length,
  };
}

function storeMetrics() {
  return {
    store_bytes: Number(sql(`SELECT pg_total_relation_size('txgio_parcel')`)),
    rows: Number(sql(`SELECT count(*) FROM txgio_parcel WHERE county_fips='${fips}'`)),
  };
}

function geometrySanity() {
  const outside = Number(
    sql(`SELECT count(*) FROM txgio_parcel WHERE county_fips='${fips}'
      AND (west_lng < -107 OR west_lng > -93 OR south_lat < 25 OR north_lat > 37)`)
  );
  const bboxLine = sql(`SELECT round(min(west_lng)::numeric,4), round(max(east_lng)::numeric,4),
       round(min(south_lat)::numeric,4), round(max(north_lat)::numeric,4)
       FROM txgio_parcel WHERE county_fips='${fips}'`);
  const [min_w, max_e, min_s, max_n] = bboxLine.split(",");
  const seamLine = sql(`SELECT count(*), count(DISTINCT feature_index),
       round(count(*)::numeric/NULLIF(count(DISTINCT feature_index),0),4)
       FROM txgio_parcel WHERE county_fips='${fips}'`);
  const [rows, features, seam_factor] = seamLine.split(",");
  const mpLine = sql(`WITH per_feature AS (
  SELECT DISTINCT ON (feature_index) feature_index, geometry
  FROM txgio_parcel WHERE county_fips='${fips}'
  ORDER BY feature_index, tile_key
)
SELECT count(*),
       count(*) FILTER (WHERE geometry->>'type' = 'MultiPolygon'),
       round(100.0 * count(*) FILTER (WHERE geometry->>'type' = 'MultiPolygon') / NULLIF(count(*),0), 2)
FROM per_feature`);
  const [distinct_features, multipolygon_features, multipolygon_pct] =
    mpLine.split(",");
  return {
    rows_outside_texas: outside,
    parcel_bbox: {
      min_west_lng: Number(min_w),
      max_east_lng: Number(max_e),
      min_south_lat: Number(min_s),
      max_north_lat: Number(max_n),
    },
    rows: Number(rows),
    distinct_features: Number(features),
    seam_factor: Number(seam_factor),
    multipolygon: {
      distinct_features: Number(distinct_features),
      multipolygon_features: Number(multipolygon_features),
      multipolygon_pct: Number(multipolygon_pct),
    },
  };
}

function summariesMatch(dry, apply) {
  return (
    dry.features === apply.features &&
    dry.delete === apply.delete &&
    dry.insert === apply.insert &&
    dry.features != null &&
    apply.features != null
  );
}

function writeArtifact(result) {
  writeFileSync(
    join(INBOX, `2026-08-08_L2_${WAVE_TAG}_${fips}.json`),
    JSON.stringify(result, null, 2),
    "utf8"
  );
}

async function main() {
  requireEnv("DATABASE_URL");
  const started = Date.now();
  const result = {
    fips,
    name,
    role: "wave2",
    halted: false,
    halt_reason: null,
    pass: false,
  };

  console.log(`[${fips}] START ${name}`);

  if (String(vintage) === "202505") {
    result.halted = true;
    result.halt_reason = "FORBIDDEN vintage 202505";
    result.wall_clock_ms = Date.now() - started;
    writeArtifact(result);
    process.exit(2);
  }

  const before = storeMetrics();
  result.before = before;

  let shpBbox = { error: "not_fetched" };
  try {
    shpBbox = await fetchShpHeaderBbox(url);
  } catch (e) {
    shpBbox = { error: String(e), url };
  }
  result.shp_header_bbox = shpBbox;
  result.census_extent_in_matrix = false;
  result.bbox_verification_method =
    "StratMap SHP main-file header four edges to 4dp (Census bbox fields absent from source matrix)";

  console.log(`[${fips}] DRY`);
  const dry = runIngest(true);
  writeFileSync(join(INBOX, `2026-08-08_L2_${WAVE_TAG}_${fips}_dry.log`), dry.text, "utf8");
  result.dry = { exit_code: dry.exit_code, wall_ms: dry.wall_ms, ...dry.summary };
  if (dry.exit_code !== 0) {
    result.halted = true;
    result.halt_reason = `dry-run exit ${dry.exit_code}`;
    result.wall_clock_ms = Date.now() - started;
    writeArtifact(result);
    process.exit(2);
  }
  if (
    dry.summary.features == null ||
    dry.summary.delete == null ||
    dry.summary.insert == null
  ) {
    result.halted = true;
    result.halt_reason = "dry-run summary incomplete / not a predictive dry-run";
    result.wall_clock_ms = Date.now() - started;
    writeArtifact(result);
    process.exit(2);
  }
  if (dry.summary.insert === 0 && dry.summary.features === 0) {
    result.halted = true;
    result.halt_reason =
      "dry-run reported zero features/insert — not a predictive dry-run / source absence";
    const st = Number(httpStatus);
    result.absence =
      st && st !== 200 && st !== 206
        ? `named_absence: http ${st}`
        : "named_absence_or_empty_source: dry predicted zero";
    result.wall_clock_ms = Date.now() - started;
    writeArtifact(result);
    process.exit(2);
  }

  console.log(
    `[${fips}] dry f=${dry.summary.features} d=${dry.summary.delete} i=${dry.summary.insert}`
  );

  console.log(`[${fips}] APPLY1`);
  const apply1 = runIngest(false);
  writeFileSync(
    join(INBOX, `2026-08-08_L2_${WAVE_TAG}_${fips}_apply1.log`),
    apply1.text,
    "utf8"
  );
  result.apply1 = {
    exit_code: apply1.exit_code,
    wall_ms: apply1.wall_ms,
    ...apply1.summary,
  };
  if (apply1.exit_code !== 0) {
    result.halted = true;
    result.halt_reason = `apply1 exit ${apply1.exit_code}`;
    result.wall_clock_ms = Date.now() - started;
    writeArtifact(result);
    process.exit(2);
  }

  const match = summariesMatch(dry.summary, apply1.summary);
  result.dry_predicts_apply = match;
  if (!match) {
    result.halted = true;
    result.halt_reason = `HALT-ON-MISMATCH dry(f=${dry.summary.features},d=${dry.summary.delete},i=${dry.summary.insert}) != apply(f=${apply1.summary.features},d=${apply1.summary.delete},i=${apply1.summary.insert})`;
    result.wall_clock_ms = Date.now() - started;
    writeArtifact(result);
    process.exit(2);
  }

  console.log(`[${fips}] APPLY2`);
  const apply2 = runIngest(false);
  writeFileSync(
    join(INBOX, `2026-08-08_L2_${WAVE_TAG}_${fips}_apply2.log`),
    apply2.text,
    "utf8"
  );
  result.apply2 = {
    exit_code: apply2.exit_code,
    wall_ms: apply2.wall_ms,
    ...apply2.summary,
  };
  if (apply2.exit_code !== 0) {
    result.halted = true;
    result.halt_reason = `apply2 exit ${apply2.exit_code}`;
    result.wall_clock_ms = Date.now() - started;
    writeArtifact(result);
    process.exit(2);
  }

  const after = storeMetrics();
  result.after = after;
  const geom = geometrySanity();
  result.geometry = geom;
  result.rows_unchanged_after_idempotent = after.rows === apply1.summary.insert;
  result.idempotent_row_count_held =
    after.rows === Number(apply2.summary.insert) &&
    after.rows === Number(apply1.summary.insert);

  let bm;
  if (shpBbox.error) {
    bm = {
      matched: null,
      method: "shp_header_unavailable",
      note: shpBbox.error,
    };
  } else {
    const ok =
      geom.parcel_bbox.min_west_lng === shpBbox.xmin &&
      geom.parcel_bbox.max_east_lng === shpBbox.xmax &&
      geom.parcel_bbox.min_south_lat === shpBbox.ymin &&
      geom.parcel_bbox.max_north_lat === shpBbox.ymax;
    bm = {
      matched: ok,
      method: "shp_header_four_edges_4dp",
      shp_bbox: {
        xmin: shpBbox.xmin,
        ymin: shpBbox.ymin,
        xmax: shpBbox.xmax,
        ymax: shpBbox.ymax,
        bytes: shpBbox.bytes,
      },
      store_bbox: geom.parcel_bbox,
      note: ok
        ? "store parcel bbox matches StratMap SHP header to 4 decimal places (Kenedy proof discipline)"
        : "store bbox differs from SHP header; recorded as mismatch for review — wave continues only if geometry sanity outside_texas=0",
    };
  }
  result.bbox_compare = bm;

  if (geom.rows_outside_texas !== 0) {
    result.halted = true;
    result.halt_reason = `geometry sanity: ${geom.rows_outside_texas} rows outside Texas bounds`;
    result.wall_clock_ms = Date.now() - started;
    writeArtifact(result);
    process.exit(2);
  }

  const sqlVerifyRows = Number(
    sql(`SELECT count(*) FROM txgio_parcel WHERE county_fips='${fips}'`)
  );
  const sqlVerifySeam = sql(`SELECT count(*), count(DISTINCT feature_index),
    round(count(*)::numeric/NULLIF(count(DISTINCT feature_index),0),4)
    FROM txgio_parcel WHERE county_fips='${fips}'`);
  const [, svf, svs] = sqlVerifySeam.split(",");
  result.sql_independent_verify = {
    rows: sqlVerifyRows,
    distinct_features: Number(svf),
    seam_factor: Number(svs),
    parcel_bbox: geom.parcel_bbox,
    rows_outside_texas: geom.rows_outside_texas,
    matches_after_rows: sqlVerifyRows === after.rows,
    matches_apply_insert: sqlVerifyRows === Number(apply1.summary.insert),
  };

  if (
    !result.sql_independent_verify.matches_after_rows ||
    !result.sql_independent_verify.matches_apply_insert
  ) {
    result.halted = true;
    result.halt_reason = `SQL verify mismatch: sql_rows=${sqlVerifyRows} after.rows=${after.rows} apply1.insert=${apply1.summary.insert}`;
    result.wall_clock_ms = Date.now() - started;
    writeArtifact(result);
    process.exit(2);
  }

  result.store_size_delta_bytes = after.store_bytes - before.store_bytes;
  result.wall_clock_ms = Date.now() - started;
  result.wall_clock_s = Math.round(result.wall_clock_ms / 100) / 10;
  result.rows_written = after.rows;
  result.seam_factor = geom.seam_factor;
  result.multipolygon_pct = geom.multipolygon.multipolygon_pct;
  result.pass =
    match &&
    result.idempotent_row_count_held &&
    geom.rows_outside_texas === 0 &&
    result.sql_independent_verify.matches_apply_insert &&
    !result.halted;

  if (!result.pass && !result.halted) {
    result.halted = true;
    result.halt_reason = "pass criteria failed (idempotent hold or match)";
  }

  writeArtifact(result);
  console.log(
    `[${fips}] PASS=${result.pass} rows=${result.rows_written} seam=${result.seam_factor} mp%=${result.multipolygon_pct} wall=${result.wall_clock_s}s`
  );
  process.exit(result.pass ? 0 : 2);
}

main().catch((e) => {
  const result = {
    fips,
    name,
    role: "wave2",
    pass: false,
    halted: true,
    halt_reason: `worker exception: ${String(e)}`,
  };
  try {
    writeArtifact(result);
  } catch {
    /* ignore */
  }
  console.error(e);
  process.exit(1);
});
