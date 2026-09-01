/**
 * Wave 2 L2 parcel acquisition orchestrator.
 * Parallel batches of ≤8 child workers; halt-on-mismatch for entire wave.
 * Operator-authorized 2026-08-08. Sub-planner owned.
 */
import { spawn, spawnSync, execFileSync } from "node:child_process";
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const INBOX = "P:/doc_repo/_inbox";
const REPO = "P:/legacy-design-tools-wave0";
const PSQL = "C:/Program Files/PostgreSQL/18/bin/psql.exe";
const BATCH_SIZE = 8;
const WAVE_TAG = "WAVE2";
const WORKER = join(INBOX, "2026-08-08_L2_WAVE2_worker.mjs");

const WAVE2 = [
  { fips: "48357", name: "Ochiltree" },
  { fips: "48495", name: "Winkler" },
  { fips: "48069", name: "Castro" },
  { fips: "48111", name: "Dallam" },
  { fips: "48295", name: "Lipscomb" },
  { fips: "48437", name: "Swisher" },
  { fips: "48501", name: "Yoakum" },
  { fips: "48079", name: "Cochran" },
  { fips: "48047", name: "Brooks" },
  { fips: "48169", name: "Garza" },
  { fips: "48023", name: "Baylor" },
  { fips: "48435", name: "Sutton" },
  { fips: "48369", name: "Parmer" },
  { fips: "48335", name: "Mitchell" },
  { fips: "48445", name: "Terry" },
  { fips: "48081", name: "Coke" },
  { fips: "48275", name: "Knox" },
  { fips: "48095", name: "Concho" },
  { fips: "48153", name: "Floyd" },
  { fips: "48371", name: "Pecos" },
  { fips: "48443", name: "Terrell" },
  { fips: "48003", name: "Andrews" },
  { fips: "48319", name: "Mason" },
  { fips: "48385", name: "Real" },
  { fips: "48333", name: "Mills" },
  { fips: "48117", name: "Deaf Smith" },
  { fips: "48507", name: "Zavala" },
  { fips: "48341", name: "Moore" },
  { fips: "48487", name: "Wilbarger" },
  { fips: "48379", name: "Rains" },
  { fips: "48271", name: "Kinney" },
  { fips: "48059", name: "Callahan" },
  { fips: "48429", name: "Stephens" },
  { fips: "48417", name: "Shackelford" },
  { fips: "48283", name: "La Salle" },
  { fips: "48425", name: "Somervell" },
  { fips: "48313", name: "Madison" },
  { fips: "48505", name: "Zapata" },
  { fips: "48279", name: "Lamb" },
  { fips: "48399", name: "Runnels" },
  { fips: "48175", name: "Goliad" },
  { fips: "48009", name: "Archer" },
  { fips: "48127", name: "Dimmit" },
  { fips: "48415", name: "Scurry" },
  { fips: "48179", name: "Gray" },
  { fips: "48083", name: "Coleman" },
  { fips: "48389", name: "Reeves" },
  { fips: "48131", name: "Duval" },
  { fips: "48031", name: "Blanco" },
  { fips: "48063", name: "Camp" },
];

const FORBIDDEN = new Set([
  "48261", "48173", "48033", "48359", "48393", "48345", "48311", "48413", "48205", "48017",
  "48035", "48129",
]);

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
  if (r.status !== 0) throw new Error(`psql failed: ${r.stderr || r.stdout}`);
  return (r.stdout || "").trim();
}

function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

function writeCountyArtifact(result) {
  writeFileSync(
    join(INBOX, `2026-08-08_L2_${WAVE_TAG}_${result.fips}.json`),
    JSON.stringify(result, null, 2),
    "utf8"
  );
}

function writeProgress(state) {
  writeFileSync(
    join(INBOX, `2026-08-08_L2_${WAVE_TAG}_progress.json`),
    JSON.stringify(state, null, 2),
    "utf8"
  );
}

function sqlVerifyBatch(fipsList) {
  const list = fipsList.map((f) => `'${f}'`).join(",");
  const lines = sql(
    `SELECT county_fips, count(*) FROM txgio_parcel WHERE county_fips IN (${list}) GROUP BY 1 ORDER BY 1`
  );
  const map = {};
  for (const line of lines.split(/\r?\n/).filter(Boolean)) {
    const [f, c] = line.split(",");
    map[f] = Number(c);
  }
  return map;
}

function runCountyWorker(c, matrixRow) {
  return new Promise((resolve) => {
    const args = [
      WORKER,
      c.fips,
      c.name,
      matrixRow.url,
      String(matrixRow.http_status ?? ""),
      String(matrixRow.vintage_yyyymm ?? ""),
    ];
    const child = spawn("node", args, {
      windowsHide: true,
      env: process.env,
      shell: false,
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => {
      const s = d.toString();
      stdout += s;
      process.stdout.write(s);
    });
    child.stderr.on("data", (d) => {
      const s = d.toString();
      stderr += s;
      process.stderr.write(s);
    });
    child.on("close", (code) => {
      const art = join(INBOX, `2026-08-08_L2_${WAVE_TAG}_${c.fips}.json`);
      if (existsSync(art)) {
        try {
          resolve(JSON.parse(readFileSync(art, "utf8")));
          return;
        } catch (e) {
          resolve({
            fips: c.fips,
            name: c.name,
            pass: false,
            halted: true,
            halt_reason: `artifact parse failed: ${String(e)}`,
            worker_exit: code,
          });
          return;
        }
      }
      resolve({
        fips: c.fips,
        name: c.name,
        pass: false,
        halted: true,
        halt_reason: `worker exit ${code} without artifact; stderr=${stderr.slice(-500)}`,
        worker_exit: code,
        stdout_tail: stdout.slice(-500),
      });
    });
  });
}

async function main() {
  requireEnv("DATABASE_URL");
  if (!process.env.NODE_OPTIONS?.includes("--use-system-ca")) {
    console.warn("WARN: NODE_OPTIONS should include --use-system-ca");
  }
  if (!existsSync(WORKER)) throw new Error(`missing worker ${WORKER}`);

  for (const c of WAVE2) {
    if (FORBIDDEN.has(c.fips)) {
      throw new Error(`Wave2 membership contains FORBIDDEN fips ${c.fips}`);
    }
  }
  if (WAVE2.length !== 50) {
    throw new Error(`Wave2 must be exactly 50 counties, got ${WAVE2.length}`);
  }

  const matrix = JSON.parse(
    readFileSync(join(INBOX, "2026-08-08_SWEEP_county_source_matrix.json"), "utf8")
  );
  const byFips = Object.fromEntries(matrix.counties.map((c) => [c.fips, c]));

  const baselineDistinct = Number(
    sql(`SELECT count(DISTINCT county_fips) FROM txgio_parcel`)
  );
  console.log(`Baseline distinct county_fips: ${baselineDistinct}`);

  const waveStarted = Date.now();
  const results = [];
  let halted = false;
  let haltReason = null;
  const batches = chunk(WAVE2, BATCH_SIZE);
  let batchIndex = 0;

  for (const batch of batches) {
    batchIndex += 1;
    if (halted) {
      for (const c of batch) {
        const r = {
          fips: c.fips,
          name: c.name,
          pass: false,
          halted: true,
          halt_reason: "wave_halted_upstream",
          skipped: true,
          not_started: true,
        };
        results.push(r);
      }
      continue;
    }

    console.log(
      `\n======== BATCH ${batchIndex}/${batches.length}: ${batch.map((c) => c.fips).join(",")} ========`
    );

    const ready = [];
    let preflightHalt = false;
    for (let i = 0; i < batch.length; i++) {
      const c = batch[i];
      const matrixRow = byFips[c.fips];
      if (!matrixRow) {
        halted = true;
        preflightHalt = true;
        haltReason = `named_absence: missing from source matrix (${c.fips})`;
        const r = {
          fips: c.fips,
          name: c.name,
          pass: false,
          halted: true,
          halt_reason: haltReason,
          absence: "missing_from_source_matrix",
        };
        writeCountyArtifact(r);
        results.push(r);
        for (const rest of batch.slice(i + 1)) {
          results.push({
            fips: rest.fips,
            name: rest.name,
            pass: false,
            halted: true,
            halt_reason: "wave_halted_upstream",
            skipped: true,
            not_started: true,
          });
        }
        break;
      }
      const st = matrixRow.http_status;
      const liveOk = st === 200 || st === 206;
      if (!liveOk) {
        halted = true;
        preflightHalt = true;
        haltReason = `named_absence: source http ${st} (${c.fips}${matrixRow.error ? ` ${matrixRow.error}` : ""})`;
        const r = {
          fips: c.fips,
          name: c.name,
          pass: false,
          halted: true,
          halt_reason: haltReason,
          absence: `http_${st}`,
        };
        writeCountyArtifact(r);
        results.push(r);
        for (const rest of batch.slice(i + 1)) {
          results.push({
            fips: rest.fips,
            name: rest.name,
            pass: false,
            halted: true,
            halt_reason: "wave_halted_upstream",
            skipped: true,
            not_started: true,
          });
        }
        break;
      }
      if (String(matrixRow.vintage_yyyymm) === "202505") {
        halted = true;
        preflightHalt = true;
        haltReason = `FORBIDDEN vintage 202505 for ${c.fips}`;
        const r = {
          fips: c.fips,
          name: c.name,
          pass: false,
          halted: true,
          halt_reason: haltReason,
        };
        writeCountyArtifact(r);
        results.push(r);
        for (const rest of batch.slice(i + 1)) {
          results.push({
            fips: rest.fips,
            name: rest.name,
            pass: false,
            halted: true,
            halt_reason: "wave_halted_upstream",
            skipped: true,
            not_started: true,
          });
        }
        break;
      }
      ready.push({ c, matrixRow });
    }
    if (preflightHalt) {
      writeProgress({
        batchIndex,
        halted,
        haltReason,
        landed_so_far: results.filter((r) => r.pass).length,
      });
      continue;
    }

    const batchResults = await Promise.all(
      ready.map(({ c, matrixRow }) => runCountyWorker(c, matrixRow))
    );

    for (const r of batchResults) {
      results.push(r);
      if (r.halted || !r.pass) {
        halted = true;
        haltReason = r.halt_reason || `county ${r.fips} failed`;
        console.error(`\n*** WAVE HALTED at ${r.fips}: ${haltReason} ***\n`);
      }
    }

    const batchFips = batch.map((c) => c.fips);
    const sqlMap = sqlVerifyBatch(batchFips);
    const batchVerify = {};
    for (const r of batchResults) {
      const sqlRows = sqlMap[r.fips] || 0;
      batchVerify[r.fips] = {
        sql_rows: sqlRows,
        claimed_rows: r.rows_written ?? null,
        pass_claim: !!r.pass,
        sql_matches_claim: r.pass ? sqlRows === r.rows_written : null,
      };
      if (r.pass && sqlRows !== r.rows_written) {
        halted = true;
        haltReason = `post-batch SQL verify mismatch ${r.fips}: sql=${sqlRows} claim=${r.rows_written}`;
        r.pass = false;
        r.halted = true;
        r.halt_reason = haltReason;
        writeCountyArtifact(r);
        console.error(`\n*** WAVE HALTED post-batch SQL at ${r.fips} ***\n`);
      }
      if (r.pass && sqlRows === 0) {
        halted = true;
        haltReason = `post-batch SQL verify empty for claimed pass ${r.fips}`;
        r.pass = false;
        r.halted = true;
        r.halt_reason = haltReason;
        writeCountyArtifact(r);
      }
    }
    console.log(`BATCH ${batchIndex} SQL verify:`, JSON.stringify(batchVerify));
    writeProgress({
      batchIndex,
      halted,
      haltReason,
      batchVerify,
      landed_so_far: results.filter((x) => x.pass).length,
      wall_s: Math.round((Date.now() - waveStarted) / 1000),
    });
  }

  const landed = results.filter((r) => r.pass);
  const attempted = results.filter((r) => !r.skipped && !r.not_started);
  const failed = results.filter((r) => !r.pass && !r.not_started && !r.skipped);
  const notStarted = results.filter((r) => r.not_started || r.skipped);
  const totalRows = landed.reduce((a, r) => a + (r.rows_written || 0), 0);
  const seams = landed.map((r) => r.seam_factor).filter((x) => x != null);

  const finalDistinct = Number(
    sql(`SELECT count(DISTINCT county_fips) FROM txgio_parcel`)
  );
  const wave2RowTotal = Number(
    sql(
      `SELECT count(*) FROM txgio_parcel WHERE county_fips = ANY(ARRAY[${WAVE2.map((c) => `'${c.fips}'`).join(",")}])`
    )
  );

  const ruralSeam = {
    kenedy_reference: 4.46,
    metro_reference: 1.07,
    wave2_values: landed.map((r) => ({
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
    elevated_rural_count_ge_2: seams.filter((s) => s >= 2).length,
    near_metro_count_lt_2: seams.filter((s) => s < 2).length,
  };

  const out = {
    wave: 2,
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
    batch_size: BATCH_SIZE,
    baseline_distinct_county_fips: baselineDistinct,
    final_distinct_county_fips: finalDistinct,
    wave2_sql_row_total: wave2RowTotal,
    expected_distinct_if_all_land: baselineDistinct + 50,
    cost_finding:
      "cost not obtainable — no Neon/GCP per-county billing meter queried without inventing a billing API",
    wave_halted: halted,
    halt_reason: haltReason,
    counties_attempted: attempted.length,
    counties_landed: landed.length,
    counties_failed: failed.length,
    counties_not_started: notStarted.length,
    total_rows_landed: totalRows,
    wall_clock_ms: Date.now() - waveStarted,
    rural_seam: ruralSeam,
    attempted_fips: attempted.map((r) => r.fips),
    landed_fips: landed.map((r) => r.fips),
    failed_fips: failed.map((r) => ({ fips: r.fips, reason: r.halt_reason })),
    not_started_fips: notStarted.map((r) => r.fips),
    results,
  };

  writeFileSync(
    join(INBOX, `2026-08-08_L2_${WAVE_TAG}_results.json`),
    JSON.stringify(out, null, 2),
    "utf8"
  );

  const lines = [];
  lines.push("---");
  lines.push("id: 2026-08-08_L2_WAVE2_report");
  lines.push("title: L2 Wave 2 Texas parcel acquisition results");
  lines.push("date: 2026-08-08");
  lines.push("status: " + (halted ? "halted" : "complete"));
  lines.push("owner: wave2-sub-planner");
  lines.push("---");
  lines.push("");
  lines.push("# L2 Wave 2 results");
  lines.push("");
  lines.push(
    `Wave 2 ${halted ? "HALTED" : "COMPLETE"}. Attempted ${attempted.length}, landed ${landed.length}, failed ${failed.length}, not started ${notStarted.length}. Total rows among landed counties: ${totalRows}. Wall clock: ${Math.round(out.wall_clock_ms / 1000)}s.`
  );
  if (haltReason) lines.push(`Halt reason: ${haltReason}`);
  lines.push("");
  lines.push(
    `Baseline distinct county_fips: ${baselineDistinct}. Final distinct: ${finalDistinct}. Wave2 SQL row total: ${wave2RowTotal}. Expected distinct if all 50 land: ${baselineDistinct + 50}.`
  );
  lines.push("");
  lines.push("## Repo / environment");
  lines.push("");
  lines.push(`- Worktree: \`${REPO}\``);
  lines.push(`- HEAD: \`${out.git_head}\``);
  lines.push(`- TLS: \`${out.tls}\``);
  lines.push(`- Concurrency: batches of ${BATCH_SIZE} (PK-disjoint on txgio_parcel)`);
  lines.push(
    "- Database: deployment Neon via `DEPLOYMENT_DATABASE_URL` (SELECT + authorized ingest only; no test runner)."
  );
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
    if (r.skipped || r.not_started) {
      lines.push(`Not started after upstream halt: ${r.halt_reason}`);
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
    if (r.sql_independent_verify) {
      lines.push(
        `- SQL independent verify: rows=${r.sql_independent_verify.rows}; matches_apply_insert=${r.sql_independent_verify.matches_apply_insert}`
      );
    }
    lines.push(`- Artifact: \`_inbox/2026-08-08_L2_${WAVE_TAG}_${r.fips}.json\``);
    lines.push("");
  }
  lines.push("## Seam summary");
  lines.push("");
  lines.push(
    `Kenedy reference seam 4.46 (metro blend 1.07). Wave2 landed seams mean=${ruralSeam.mean}, min=${ruralSeam.min}, max=${ruralSeam.max}. Elevated rural (>=2): ${ruralSeam.elevated_rural_count_ge_2}; near-metro (<2): ${ruralSeam.near_metro_count_lt_2}.`
  );
  lines.push("");
  lines.push("## Cost");
  lines.push("");
  lines.push(out.cost_finding);
  lines.push("");
  lines.push("## Findings / defects");
  lines.push("");
  const findings = [];
  if (halted) findings.push(`FINDING W2-HALT: wave stopped — ${haltReason}`);
  for (const r of landed) {
    if (r.bbox_compare && r.bbox_compare.matched === false) {
      findings.push(
        `FINDING W2-BBOX-${r.fips}: store bbox != SHP header (${JSON.stringify(r.bbox_compare.store_bbox)} vs ${JSON.stringify(r.bbox_compare.shp_bbox)})`
      );
    }
  }
  if (seams.length) {
    findings.push(
      `FINDING W2-SEAM: Wave2 landed seam mean ${ruralSeam.mean} (range ${ruralSeam.min}-${ruralSeam.max}); elevated_rural_ge_2=${ruralSeam.elevated_rural_count_ge_2}/${seams.length}.`
    );
  }
  findings.push(`FINDING W2-COST: ${out.cost_finding}`);
  if (finalDistinct !== baselineDistinct + landed.length) {
    findings.push(
      `FINDING W2-DISTINCT: final distinct ${finalDistinct} != baseline ${baselineDistinct} + landed ${landed.length} (delta ${finalDistinct - baselineDistinct})`
    );
  }
  for (const f of findings) lines.push(`- ${f}`);
  lines.push("");

  writeFileSync(
    join(INBOX, `2026-08-08_L2_${WAVE_TAG}_report.md`),
    lines.join("\n"),
    "utf8"
  );

  console.log("\n==== WAVE 2 DONE ====");
  console.log(
    JSON.stringify(
      {
        halted,
        haltReason,
        landed: landed.length,
        failed: failed.length,
        notStarted: notStarted.length,
        totalRows,
        finalDistinct,
        results: join(INBOX, `2026-08-08_L2_${WAVE_TAG}_results.json`),
        report: join(INBOX, `2026-08-08_L2_${WAVE_TAG}_report.md`),
      },
      null,
      2
    )
  );

  process.exit(halted ? 2 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
