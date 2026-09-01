/**
 * Wave 1 L2 parcel acquisition orchestrator.
 * Serial, attended, halt-on-mismatch. Operator-authorized 2026-08-08.
 */
import { spawnSync, execFileSync } from "node:child_process";
import { writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import zlib from "node:zlib";

const INBOX = "P:/doc_repo/_inbox";
const REPO = "P:/legacy-design-tools-wave0";
const PSQL = "C:/Program Files/PostgreSQL/18/bin/psql.exe";

const WAVE1 = [
  { fips: "48261", name: "Kenedy", role: "already-loaded-control" },
  { fips: "48173", name: "Glasscock" },
  { fips: "48033", name: "Borden" },
  { fips: "48359", name: "Oldham" },
  { fips: "48393", name: "Roberts" },
  { fips: "48345", name: "Motley" },
  { fips: "48311", name: "McMullen" },
  { fips: "48413", name: "Schleicher" },
  { fips: "48205", name: "Hartley" },
  { fips: "48017", name: "Bailey" },
];

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`missing env ${name}`);
  return v;
}

function sql(query) {
  const db = requireEnv("DATABASE_URL");
  const r = spawnSync(
    PSQL,
    [db, "-v", "ON_ERROR_STOP=1", "-At", "-F", ",", "-c", query],
    { encoding: "utf8", windowsHide: true }
  );
  if (r.status !== 0) {
    throw new Error(`psql failed: ${r.stderr || r.stdout}`);
  }
  return (r.stdout || "").trim();
}

function sqlRows(query) {
  const out = sql(query);
  if (!out) return [];
  return out.split(/\r?\n/).filter(Boolean);
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

function runIngest(fips, dryRun) {
  const args = [
    "--filter",
    "@workspace/cad-ingest",
    "txgio-ingest",
    "--",
    `--county=${fips}`,
  ];
  if (dryRun) args.push("--dry-run");
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
  const wall_ms = Date.now() - started;
  const text = `${r.stdout || ""}\n${r.stderr || ""}`;
  return {
    exit_code: r.status,
    wall_ms,
    text,
    summary: parseSummary(text),
  };
}

async function fetchShpHeaderBbox(url) {
  // Full download is fine for Wave1 sizes (<3MB). Parse SHP main-file header bbox.
  const res = await fetch(url);
  if (!res.ok) return { error: `http ${res.status}`, url };
  const buf = Buffer.from(await res.arrayBuffer());
  // Find .shp local header in zip (PK\x03\x04) and extract uncompressed shp if stored/deflated.
  // Simpler approach: use JS unzip via node's zlib only for STORE/DEFLATE entries named *.shp
  const entries = listZipEntries(buf);
  const shp = entries.find((e) => e.name.toLowerCase().endsWith(".shp"));
  if (!shp) return { error: "no .shp in zip", url };
  const data = extractZipEntry(buf, shp);
  if (!data || data.length < 100) return { error: "shp too small", url };
  // SHP header: bytes 36-67 little-endian doubles xmin,ymin,xmax,ymax
  const xmin = data.readDoubleLE(36);
  const ymin = data.readDoubleLE(44);
  const xmax = data.readDoubleLE(52);
  const ymax = data.readDoubleLE(60);
  return {
    source: "shp_header_from_stratmap_zip",
    url,
    xmin: round4(xmin),
    ymin: round4(ymin),
    xmax: round4(xmax),
    ymax: round4(ymax),
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
    entries.push({
      name,
      method,
      compSize,
      uncompSize,
      dataStart,
    });
    i = dataStart + compSize;
  }
  return entries;
}

function extractZipEntry(buf, entry) {
  const slice = buf.slice(entry.dataStart, entry.dataStart + entry.compSize);
  if (entry.method === 0) return slice;
  if (entry.method === 8) {
    return zlib.inflateRawSync(slice);
  }
  throw new Error(`unsupported zip method ${entry.method} for ${entry.name}`);
}

function storeMetrics(fips) {
  const store_bytes = Number(sql(`SELECT pg_total_relation_size('txgio_parcel')`));
  const rows = Number(
    sql(`SELECT count(*) FROM txgio_parcel WHERE county_fips='${fips}'`)
  );
  return { store_bytes, rows };
}

function geometrySanity(fips) {
  const outside = Number(
    sql(`SELECT count(*) FROM txgio_parcel WHERE county_fips='${fips}'
      AND (west_lng < -107 OR west_lng > -93 OR south_lat < 25 OR north_lat > 37)`)
  );
  const bboxLine = sql(`SELECT round(min(west_lng)::numeric,4), round(max(east_lng)::numeric,4),
       round(min(south_lat)::numeric,4), round(max(north_lat)::numeric,4)
       FROM txgio_parcel WHERE county_fips='${fips}'`);
  const [min_w, max_e, min_s, max_n] = bboxLine.split(",");
  const seamLine = sql(`SELECT count(*) AS rows, count(DISTINCT feature_index) AS features,
       round(count(*)::numeric/NULLIF(count(DISTINCT feature_index),0),4) AS seam_factor
       FROM txgio_parcel WHERE county_fips='${fips}'`);
  const [rows, features, seam_factor] = seamLine.split(",");
  const mpLine = sql(`WITH per_feature AS (
  SELECT DISTINCT ON (feature_index) feature_index, geometry
  FROM txgio_parcel WHERE county_fips='${fips}'
  ORDER BY feature_index, tile_key
)
SELECT count(*) AS distinct_features,
       count(*) FILTER (WHERE geometry->>'type' = 'MultiPolygon') AS multipolygon_features,
       round(100.0 * count(*) FILTER (WHERE geometry->>'type' = 'MultiPolygon') / NULLIF(count(*),0), 2) AS multipolygon_pct
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

function bboxMatch(storeBbox, shpBbox) {
  if (!shpBbox || shpBbox.error) {
    return {
      matched: null,
      method: "shp_header_unavailable",
      note: shpBbox?.error || "no shp bbox",
    };
  }
  // Kenedy discipline: four edges to 4 decimal places when available.
  // Parcel coverage may be strictly inside county polygon; match means
  // store extents equal SHP feature extents (source of truth for parcels),
  // not Census county polygon. SHP header IS the parcel file extent.
  const ok =
    storeBbox.min_west_lng === shpBbox.xmin &&
    storeBbox.max_east_lng === shpBbox.xmax &&
    storeBbox.min_south_lat === shpBbox.ymin &&
    storeBbox.max_north_lat === shpBbox.ymax;
  return {
    matched: ok,
    method: "shp_header_four_edges_4dp",
    shp_bbox: shpBbox,
    store_bbox: storeBbox,
    note: ok
      ? "store parcel bbox matches StratMap SHP header to 4 decimal places"
      : "store bbox differs from SHP header (may be expected if clip/filter); recorded as mismatch for review — wave continues only if geometry sanity outside_texas=0",
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

async function processCounty(c, matrixRow) {
  const started = Date.now();
  const result = {
    fips: c.fips,
    name: c.name,
    role: c.role || "wave1",
    halted: false,
    halt_reason: null,
    pass: false,
  };

  console.log(`\n======== ${c.fips} ${c.name} ========`);

  const before = storeMetrics(c.fips);
  result.before = before;
  console.log(`before rows=${before.rows} store_bytes=${before.store_bytes}`);

  // SHP header bbox (Census extent fields absent from source matrix)
  let shpBbox = { error: "not_fetched" };
  try {
    console.log("fetching SHP header bbox...");
    shpBbox = await fetchShpHeaderBbox(matrixRow.url);
    console.log("shp bbox", JSON.stringify(shpBbox));
  } catch (e) {
    shpBbox = { error: String(e), url: matrixRow.url };
  }
  result.shp_header_bbox = shpBbox;
  result.census_extent_in_matrix = false;
  result.bbox_verification_method =
    "StratMap SHP main-file header (matrix has no Census bbox fields)";

  console.log("DRY RUN...");
  const dry = runIngest(c.fips, true);
  writeFileSync(
    join(INBOX, `2026-08-08_L2_WAVE1_${c.fips}_dry.log`),
    dry.text,
    "utf8"
  );
  result.dry = {
    exit_code: dry.exit_code,
    wall_ms: dry.wall_ms,
    ...dry.summary,
  };
  if (dry.exit_code !== 0) {
    result.halted = true;
    result.halt_reason = `dry-run exit ${dry.exit_code}`;
    result.wall_clock_ms = Date.now() - started;
    return result;
  }
  if (
    dry.summary.features == null ||
    dry.summary.delete == null ||
    dry.summary.insert == null
  ) {
    result.halted = true;
    result.halt_reason = "dry-run summary incomplete / not a predictive dry-run";
    result.wall_clock_ms = Date.now() - started;
    return result;
  }
  if (dry.summary.insert === 0 && dry.summary.features === 0) {
    result.halted = true;
    result.halt_reason =
      "dry-run reported zero features/insert — not a predictive dry-run / source absence";
    result.absence =
      matrixRow.http_status && matrixRow.http_status !== 200
        ? `named_absence: http ${matrixRow.http_status}`
        : "named_absence_or_empty_source: dry predicted zero";
    result.wall_clock_ms = Date.now() - started;
    return result;
  }

  console.log(
    `dry: features=${dry.summary.features} delete=${dry.summary.delete} insert=${dry.summary.insert} loaded_before=${dry.summary.loaded_before}`
  );

  console.log("APPLY...");
  const apply1 = runIngest(c.fips, false);
  writeFileSync(
    join(INBOX, `2026-08-08_L2_WAVE1_${c.fips}_apply1.log`),
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
    return result;
  }

  const match = summariesMatch(dry.summary, apply1.summary);
  result.dry_predicts_apply = match;
  if (!match) {
    result.halted = true;
    result.halt_reason = `HALT-ON-MISMATCH dry(f=${dry.summary.features},d=${dry.summary.delete},i=${dry.summary.insert}) != apply(f=${apply1.summary.features},d=${apply1.summary.delete},i=${apply1.summary.insert})`;
    result.wall_clock_ms = Date.now() - started;
    return result;
  }

  console.log("IDEMPOTENT APPLY2...");
  const apply2 = runIngest(c.fips, false);
  writeFileSync(
    join(INBOX, `2026-08-08_L2_WAVE1_${c.fips}_apply2.log`),
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
    return result;
  }

  const after = storeMetrics(c.fips);
  result.after = after;
  const geom = geometrySanity(c.fips);
  result.geometry = geom;
  result.rows_unchanged_after_idempotent = after.rows === apply1.summary.insert;
  // For reload control, after.rows should equal insert; for fresh load same.
  result.idempotent_row_count_held =
    after.rows === Number(apply2.summary.insert) &&
    after.rows === Number(apply1.summary.insert);

  const bm = bboxMatch(geom.parcel_bbox, shpBbox);
  result.bbox_compare = bm;
  // Geometry sanity gate (hard): outside texas must be 0
  if (geom.rows_outside_texas !== 0) {
    result.halted = true;
    result.halt_reason = `geometry sanity: ${geom.rows_outside_texas} rows outside Texas bounds`;
    result.wall_clock_ms = Date.now() - started;
    return result;
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
    !result.halted;

  // Per-county JSON artifact
  writeFileSync(
    join(INBOX, `2026-08-08_L2_WAVE1_${c.fips}.json`),
    JSON.stringify(result, null, 2),
    "utf8"
  );
  console.log(
    `PASS=${result.pass} rows=${result.rows_written} seam=${result.seam_factor} mp%=${result.multipolygon_pct} wall=${result.wall_clock_s}s`
  );
  return result;
}

async function main() {
  requireEnv("DATABASE_URL");
  if (!process.env.NODE_OPTIONS?.includes("--use-system-ca")) {
    console.warn("WARN: NODE_OPTIONS should include --use-system-ca");
  }

  const matrix = JSON.parse(
    readFileSync(join(INBOX, "2026-08-08_SWEEP_county_source_matrix.json"), "utf8")
  );
  const byFips = Object.fromEntries(matrix.counties.map((c) => [c.fips, c]));

  const waveStarted = Date.now();
  const results = [];
  let halted = false;

  for (const c of WAVE1) {
    if (halted) {
      results.push({
        fips: c.fips,
        name: c.name,
        pass: false,
        halted: true,
        halt_reason: "wave_halted_upstream",
        skipped: true,
      });
      continue;
    }
    const matrixRow = byFips[c.fips];
    if (!matrixRow) {
      results.push({
        fips: c.fips,
        name: c.name,
        pass: false,
        halted: true,
        halt_reason: "named_absence: missing from source matrix",
        absence: "missing_from_source_matrix",
      });
      halted = true;
      continue;
    }
    // Sweep matrix records 200 (full) or 206 (range) for live StratMap URLs.
    // Only hard failures (404/5xx/0/null with error) are named absences.
    const st = matrixRow.http_status;
    const liveOk = st === 200 || st === 206;
    if (!liveOk) {
      results.push({
        fips: c.fips,
        name: c.name,
        pass: false,
        halted: true,
        halt_reason: `named_absence: source http ${st}${matrixRow.error ? ` (${matrixRow.error})` : ""}`,
        absence: `http_${st}`,
      });
      halted = true;
      continue;
    }

    const r = await processCounty(c, matrixRow);
    results.push(r);
    if (r.halted || !r.pass) {
      halted = true;
      console.error(`\n*** WAVE HALTED at ${c.fips}: ${r.halt_reason} ***\n`);
    }
  }

  const landed = results.filter((r) => r.pass);
  const attempted = results.filter((r) => !r.skipped);
  const failed = results.filter((r) => !r.pass);
  const totalRows = landed.reduce((a, r) => a + (r.rows_written || 0), 0);
  const seams = landed.map((r) => r.seam_factor).filter((x) => x != null);
  const ruralSeam = {
    kenedy_reference: 4.46,
    metro_reference: 1.07,
    wave1_values: landed.map((r) => ({
      fips: r.fips,
      name: r.name,
      seam_factor: r.seam_factor,
    })),
    mean:
      seams.length > 0
        ? Math.round((seams.reduce((a, b) => a + b, 0) / seams.length) * 10000) /
          10000
        : null,
    min: seams.length ? Math.min(...seams) : null,
    max: seams.length ? Math.max(...seams) : null,
    rural_seam_holds:
      seams.length > 0 && seams.every((s) => s >= 2.0) ? true : seams.length ? false : null,
  };

  const out = {
    wave: 1,
    date: "2026-08-08",
    repo: REPO,
    git_head: execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: REPO,
      encoding: "utf8",
    }).trim(),
    git_status: execFileSync("git", ["status", "-sb"], {
      cwd: REPO,
      encoding: "utf8",
    }).trim(),
    tls: "NODE_OPTIONS=--use-system-ca",
    cost_finding: "cost not obtainable — no Neon/GCP per-county billing meter queried without inventing a billing API",
    wave_halted: halted,
    counties_attempted: attempted.length,
    counties_landed: landed.length,
    counties_failed: failed.length,
    total_rows_landed: totalRows,
    wall_clock_ms: Date.now() - waveStarted,
    rural_seam: ruralSeam,
    results,
  };

  writeFileSync(
    join(INBOX, "2026-08-08_L2_WAVE1_results.json"),
    JSON.stringify(out, null, 2),
    "utf8"
  );

  // Report markdown
  const lines = [];
  lines.push("---");
  lines.push("id: 2026-08-08_L2_WAVE1_report");
  lines.push("title: L2 Wave 1 Texas parcel acquisition results");
  lines.push("date: 2026-08-08");
  lines.push("status: " + (halted ? "halted" : "complete"));
  lines.push("owner: wave1-sub-planner");
  lines.push("---");
  lines.push("");
  lines.push("# L2 Wave 1 results");
  lines.push("");
  lines.push(
    `Wave 1 ${halted ? "HALTED" : "COMPLETE"}. Attempted ${attempted.length}, landed ${landed.length}, failed ${failed.length}. Total rows among landed counties: ${totalRows}. Wall clock: ${Math.round(out.wall_clock_ms / 1000)}s.`
  );
  lines.push("");
  lines.push("## Repo / environment");
  lines.push("");
  lines.push(`- Worktree: \`${REPO}\``);
  lines.push(`- HEAD: \`${out.git_head}\``);
  lines.push(`- TLS: \`${out.tls}\``);
  lines.push("- Database: deployment Neon via `DEPLOYMENT_DATABASE_URL` (SELECT + authorized ingest only; no test runner).");
  lines.push("");
  lines.push("### Verbatim git status");
  lines.push("");
  lines.push("```");
  lines.push(out.git_status);
  lines.push("```");
  lines.push("");
  lines.push("## Per-county");
  lines.push("");
  for (const r of results) {
    lines.push(`### ${r.fips} ${r.name}`);
    lines.push("");
    if (r.skipped) {
      lines.push(`Skipped after upstream halt: ${r.halt_reason}`);
      lines.push("");
      continue;
    }
    lines.push(
      `- Pass: ${r.pass}; Halted: ${r.halted}${r.halt_reason ? ` (${r.halt_reason})` : ""}`
    );
    if (r.dry) {
      lines.push(
        `- Dry: loaded_before=${r.dry.loaded_before} features=${r.dry.features} delete=${r.dry.delete} insert=${r.dry.insert} (${r.dry.wall_ms}ms)`
      );
    }
    if (r.apply1) {
      lines.push(
        `- Apply1: features=${r.apply1.features} delete=${r.apply1.delete} insert=${r.apply1.insert} (${r.apply1.wall_ms}ms)`
      );
    }
    if (r.apply2) {
      lines.push(
        `- Apply2 (idempotent): features=${r.apply2.features} delete=${r.apply2.delete} insert=${r.apply2.insert} (${r.apply2.wall_ms}ms)`
      );
    }
    if (r.after) {
      lines.push(
        `- Rows after: ${r.after.rows}; store delta bytes: ${r.store_size_delta_bytes}; wall: ${r.wall_clock_s}s`
      );
    }
    if (r.geometry) {
      lines.push(
        `- Geometry: outside_texas=${r.geometry.rows_outside_texas}; seam_factor=${r.geometry.seam_factor}; multipolygon_pct=${r.geometry.multipolygon.multipolygon_pct}; bbox=${JSON.stringify(r.geometry.parcel_bbox)}`
      );
    }
    if (r.bbox_compare) {
      lines.push(
        `- Bbox verify (${r.bbox_verification_method}): matched=${r.bbox_compare.matched}; ${r.bbox_compare.note}`
      );
    }
    lines.push(`- Artifact: \`_inbox/2026-08-08_L2_WAVE1_${r.fips}.json\``);
    lines.push("");
  }
  lines.push("## Rural seam factor vs Kenedy 4.46");
  lines.push("");
  lines.push(
    `Kenedy reference seam 4.46 (metro blend 1.07). Wave1 landed seams: ${JSON.stringify(ruralSeam.wave1_values)}.`
  );
  lines.push(
    `Mean=${ruralSeam.mean}, min=${ruralSeam.min}, max=${ruralSeam.max}. Rural seam holds (all >= 2.0): ${ruralSeam.rural_seam_holds}.`
  );
  lines.push("");
  lines.push("## Cost");
  lines.push("");
  lines.push(out.cost_finding);
  lines.push("");
  lines.push("## Findings / defects");
  lines.push("");
  const findings = [];
  if (halted) {
    const h = results.find((r) => r.halted && !r.skipped);
    findings.push(
      `FINDING W1-HALT: wave stopped at ${h?.fips || "?"} — ${h?.halt_reason || "unknown"}`
    );
  }
  for (const r of landed) {
    if (r.bbox_compare && r.bbox_compare.matched === false) {
      findings.push(
        `FINDING W1-BBOX-${r.fips}: store bbox != SHP header (${JSON.stringify(r.bbox_compare.store_bbox)} vs ${JSON.stringify(r.bbox_compare.shp_bbox)})`
      );
    }
  }
  if (seams.length && ruralSeam.rural_seam_holds) {
    findings.push(
      `FINDING W1-SEAM: rural seam factor holds across Wave1 landed counties (mean ${ruralSeam.mean} vs Kenedy 4.46); statewide storage projections using metro 1.07 remain light for the ranch-county tail.`
    );
  } else if (seams.length && ruralSeam.rural_seam_holds === false) {
    findings.push(
      `FINDING W1-SEAM-MIXED: not all Wave1 counties show rural-class seam (>=2.0); values ${JSON.stringify(seams)}.`
    );
  }
  findings.push(`FINDING W1-COST: ${out.cost_finding}`);
  if (findings.length === 0) findings.push("No defects recorded.");
  for (const f of findings) lines.push(`- ${f}`);
  lines.push("");

  writeFileSync(
    join(INBOX, "2026-08-08_L2_WAVE1_report.md"),
    lines.join("\n"),
    "utf8"
  );

  console.log("\n==== WAVE 1 DONE ====");
  console.log(JSON.stringify({
    halted,
    landed: landed.length,
    failed: failed.length,
    totalRows,
    results: join(INBOX, "2026-08-08_L2_WAVE1_results.json"),
    report: join(INBOX, "2026-08-08_L2_WAVE1_report.md"),
  }, null, 2));

  process.exit(halted ? 2 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
