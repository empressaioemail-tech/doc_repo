/**
 * Wave 3 L2 parcel acquisition orchestrator.
 * - Concurrent batch of remaining degree-vintage (ex metros + Bosque), ≤8
 * - Then Bosque 48035 solo
 * - Then five metros solo LAST (bytes-asc among them → Harris last)
 * Halt-on-mismatch. Operator-authorized 2026-08-08; hold lifted after retirement proof.
 */
import { spawn, spawnSync, execFileSync } from "node:child_process";
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const INBOX = "P:/doc_repo/_inbox";
const REPO = "P:/legacy-design-tools-wave0";
const PSQL = "C:/Program Files/PostgreSQL/18/bin/psql.exe";
const BATCH_SIZE = 8;
const WAVE_TAG = "WAVE3";
const WORKER = join(INBOX, "2026-08-08_L2_WAVE3_worker.mjs");
const MEMBERSHIP = process.env.WAVE3_MEMBERSHIP
  ? process.env.WAVE3_MEMBERSHIP
  : join(INBOX, "2026-08-08_L2_WAVE3_membership.json");

const FORBIDDEN = new Set(["48129"]); // Donley — never a wave member
const METRO_SOLO = new Set(["48201", "48157", "48339", "48141", "48039"]);

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

async function runPhase(label, counties, byFips, state) {
  const batches = chunk(counties, label.startsWith("solo") ? 1 : BATCH_SIZE);
  for (let bi = 0; bi < batches.length; bi++) {
    if (state.halted) {
      for (const c of batches[bi]) {
        state.results.push({
          fips: c.fips,
          name: c.name,
          pass: false,
          halted: true,
          halt_reason: "wave_halted_upstream",
          skipped: true,
          not_started: true,
          phase: label,
        });
      }
      continue;
    }

    const batch = batches[bi];
    console.log(
      `\n======== ${label} ${bi + 1}/${batches.length}: ${batch.map((c) => c.fips).join(",")} ========`
    );

    const ready = [];
    let preflightHalt = false;
    for (let i = 0; i < batch.length; i++) {
      const c = batch[i];
      if (FORBIDDEN.has(c.fips)) {
        state.halted = true;
        preflightHalt = true;
        state.haltReason = `FORBIDDEN fips ${c.fips} in membership`;
        break;
      }
      const matrixRow = byFips[c.fips] || {
        url: c.url,
        http_status: c.http_status,
        vintage_yyyymm: c.vintage_yyyymm,
      };
      if (!matrixRow?.url) {
        state.halted = true;
        preflightHalt = true;
        state.haltReason = `named_absence: missing url (${c.fips})`;
        const r = {
          fips: c.fips,
          name: c.name,
          pass: false,
          halted: true,
          halt_reason: state.haltReason,
          phase: label,
        };
        writeCountyArtifact(r);
        state.results.push(r);
        break;
      }
      const st = matrixRow.http_status;
      const liveOk = st === 200 || st === 206;
      if (!liveOk) {
        state.halted = true;
        preflightHalt = true;
        state.haltReason = `named_absence: source http ${st} (${c.fips})`;
        const r = {
          fips: c.fips,
          name: c.name,
          pass: false,
          halted: true,
          halt_reason: state.haltReason,
          phase: label,
        };
        writeCountyArtifact(r);
        state.results.push(r);
        break;
      }
      if (String(matrixRow.vintage_yyyymm) === "202505") {
        state.halted = true;
        preflightHalt = true;
        state.haltReason = `FORBIDDEN vintage 202505 for ${c.fips}`;
        const r = {
          fips: c.fips,
          name: c.name,
          pass: false,
          halted: true,
          halt_reason: state.haltReason,
          phase: label,
        };
        writeCountyArtifact(r);
        state.results.push(r);
        break;
      }
      ready.push({ c, matrixRow });
    }

    if (preflightHalt) {
      writeProgress({
        phase: label,
        batchIndex: bi + 1,
        halted: state.halted,
        haltReason: state.haltReason,
        landed_so_far: state.results.filter((r) => r.pass).length,
      });
      // mark rest of this batch + remaining as not started later via phase loop
      for (const rest of batch.slice(ready.length + (state.results.some((r) => r.fips === batch[ready.length]?.fips) ? 1 : 0))) {
        if (!state.results.some((r) => r.fips === rest.fips)) {
          state.results.push({
            fips: rest.fips,
            name: rest.name,
            pass: false,
            halted: true,
            halt_reason: "wave_halted_upstream",
            skipped: true,
            not_started: true,
            phase: label,
          });
        }
      }
      continue;
    }

    const batchResults = await Promise.all(
      ready.map(({ c, matrixRow }) => runCountyWorker(c, matrixRow))
    );

    for (const r of batchResults) {
      r.phase = label;
      state.results.push(r);
      if (r.halted || !r.pass) {
        state.halted = true;
        state.haltReason = r.halt_reason || `county ${r.fips} failed`;
        console.error(`\n*** WAVE HALTED at ${r.fips}: ${state.haltReason} ***\n`);
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
        state.halted = true;
        state.haltReason = `post-batch SQL verify mismatch ${r.fips}: sql=${sqlRows} claim=${r.rows_written}`;
        r.pass = false;
        r.halted = true;
        r.halt_reason = state.haltReason;
        writeCountyArtifact(r);
        console.error(`\n*** WAVE HALTED post-batch SQL at ${r.fips} ***\n`);
      }
      if (r.pass && sqlRows === 0) {
        state.halted = true;
        state.haltReason = `post-batch SQL verify empty for claimed pass ${r.fips}`;
        r.pass = false;
        r.halted = true;
        r.halt_reason = state.haltReason;
        writeCountyArtifact(r);
      }
    }
    console.log(`${label} ${bi + 1} SQL verify:`, JSON.stringify(batchVerify));
    writeProgress({
      phase: label,
      batchIndex: bi + 1,
      halted: state.halted,
      haltReason: state.haltReason,
      batchVerify,
      landed_so_far: state.results.filter((x) => x.pass).length,
      wall_s: Math.round((Date.now() - state.waveStarted) / 1000),
    });
  }
}

async function main() {
  requireEnv("DATABASE_URL");
  if (!process.env.NODE_OPTIONS?.includes("--use-system-ca")) {
    console.warn("WARN: NODE_OPTIONS should include --use-system-ca");
  }
  if (!existsSync(WORKER)) throw new Error(`missing worker ${WORKER}`);
  if (!existsSync(MEMBERSHIP)) throw new Error(`missing membership ${MEMBERSHIP}`);

  const membership = JSON.parse(readFileSync(MEMBERSHIP, "utf8"));
  const batchCounties = membership.partition.batch;
  const soloLast = membership.partition.solo_last;
  const bosque = membership.partition.bosque_solo
    ? [membership.partition.bosque_solo]
    : [];

  const isResume = !!membership.resume;
  if (!isResume && batchCounties.length !== 111) {
    throw new Error(`batch must be 111, got ${batchCounties.length}`);
  }
  if (!isResume && soloLast.length !== 5) {
    throw new Error(`solo_last must be 5, got ${soloLast.length}`);
  }
  if (
    bosque.length > 0 &&
    (bosque.length !== 1 || bosque[0].fips !== "48035")
  ) {
    throw new Error(`bosque_solo must be 48035, got ${JSON.stringify(bosque)}`);
  }
  console.log(
    `Membership: ${MEMBERSHIP} resume=${isResume} batch=${batchCounties.length} bosque=${bosque.length} solo=${soloLast.length}`
  );
  for (const c of [...batchCounties, ...soloLast, ...bosque]) {
    if (FORBIDDEN.has(c.fips)) throw new Error(`FORBIDDEN in membership: ${c.fips}`);
    if (batchCounties.includes(c) && METRO_SOLO.has(c.fips)) {
      throw new Error(`metro ${c.fips} must not be in concurrent batch`);
    }
  }
  // Harris must be last among solos when present
  if (
    soloLast.length > 0 &&
    soloLast[soloLast.length - 1].fips !== "48201"
  ) {
    throw new Error(
      `Harris 48201 must be last in solo_last; got ${soloLast.map((c) => c.fips)}`
    );
  }

  const matrix = JSON.parse(
    readFileSync(join(INBOX, "2026-08-08_SWEEP_county_source_matrix.json"), "utf8")
  );
  const byFips = Object.fromEntries(matrix.counties.map((c) => [c.fips, c]));

  const baselineDistinct = Number(
    sql(`SELECT count(DISTINCT county_fips) FROM txgio_parcel`)
  );
  const baselineRows = Number(sql(`SELECT count(*) FROM txgio_parcel`));
  console.log(
    `Baseline distinct county_fips: ${baselineDistinct}; rows: ${baselineRows}`
  );

  const state = {
    halted: false,
    haltReason: null,
    results: [],
    waveStarted: Date.now(),
  };

  await runPhase("batch", batchCounties, byFips, state);
  await runPhase("solo_bosque", bosque, byFips, state);
  await runPhase("solo_metro", soloLast, byFips, state);

  const landed = state.results.filter((r) => r.pass);
  const attempted = state.results.filter((r) => !r.skipped && !r.not_started);
  const failed = state.results.filter(
    (r) => !r.pass && !r.not_started && !r.skipped
  );
  const notStarted = state.results.filter((r) => r.not_started || r.skipped);
  const totalRows = landed.reduce((a, r) => a + (r.rows_written || 0), 0);
  const seams = landed.map((r) => r.seam_factor).filter((x) => x != null);

  const finalDistinct = Number(
    sql(`SELECT count(DISTINCT county_fips) FROM txgio_parcel`)
  );
  const allWave3Fips = [...batchCounties, ...bosque, ...soloLast].map(
    (c) => c.fips
  );
  const wave3RowTotal = Number(
    sql(
      `SELECT count(*) FROM txgio_parcel WHERE county_fips = ANY(ARRAY[${allWave3Fips
        .map((f) => `'${f}'`)
        .join(",")}])`
    )
  );
  const bosqueRows = Number(
    sql(`SELECT count(*) FROM txgio_parcel WHERE county_fips='48035'`)
  );
  const donleyRows = Number(
    sql(`SELECT count(*) FROM txgio_parcel WHERE county_fips='48129'`)
  );

  const out = {
    wave: 3,
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
    tls: "NODE_OPTIONS=--use-system-ca + library browser UA",
    batch_size: BATCH_SIZE,
    baseline_distinct_county_fips: baselineDistinct,
    baseline_rows: baselineRows,
    final_distinct_county_fips: finalDistinct,
    wave3_sql_row_total: wave3RowTotal,
    bosque_rows: bosqueRows,
    donley_rows: donleyRows,
    expected_distinct_if_all_land: baselineDistinct + 117,
    cost_finding:
      "cost not obtainable — no Neon/GCP per-county billing meter queried without inventing a billing API",
    wave_halted: state.halted,
    halt_reason: state.haltReason,
    counties_attempted: attempted.length,
    counties_landed: landed.length,
    counties_failed: failed.length,
    counties_not_started: notStarted.length,
    total_rows_landed: totalRows,
    wall_clock_ms: Date.now() - state.waveStarted,
    seam: {
      mean:
        seams.length > 0
          ? Math.round(
              (seams.reduce((a, b) => a + b, 0) / seams.length) * 10000
            ) / 10000
          : null,
      min: seams.length ? Math.min(...seams) : null,
      max: seams.length ? Math.max(...seams) : null,
      values: landed.map((r) => ({
        fips: r.fips,
        name: r.name,
        seam_factor: r.seam_factor,
        phase: r.phase,
      })),
    },
    attempted_fips: attempted.map((r) => r.fips),
    landed_fips: landed.map((r) => r.fips),
    failed_fips: failed.map((r) => ({ fips: r.fips, reason: r.halt_reason })),
    not_started_fips: notStarted.map((r) => r.fips),
    results: state.results,
  };

  writeFileSync(
    join(INBOX, `2026-08-08_L2_${WAVE_TAG}_results.json`),
    JSON.stringify(out, null, 2),
    "utf8"
  );

  const lines = [];
  lines.push("---");
  lines.push("id: 2026-08-08_L2_WAVE3_report");
  lines.push("title: L2 Wave 3 Texas parcel acquisition results");
  lines.push("date: 2026-08-08");
  lines.push("status: " + (state.halted ? "halted" : "complete"));
  lines.push("owner: wave3-execution-planner");
  lines.push("---");
  lines.push("");
  lines.push("# L2 Wave 3 results");
  lines.push("");
  lines.push(
    `Wave 3 ${state.halted ? "HALTED" : "COMPLETE"}. Attempted ${attempted.length}, landed ${landed.length}, failed ${failed.length}, not started ${notStarted.length}. Total rows among landed counties: ${totalRows}. Wall clock: ${Math.round(out.wall_clock_ms / 1000)}s.`
  );
  if (state.haltReason) lines.push(`Halt reason: ${state.haltReason}`);
  lines.push("");
  lines.push(
    `Baseline distinct: ${baselineDistinct}. Final distinct: ${finalDistinct}. Wave3 SQL row total: ${wave3RowTotal}. Bosque rows: ${bosqueRows}. Donley rows: ${donleyRows}.`
  );
  lines.push("");
  lines.push("## Repo / environment");
  lines.push("");
  lines.push(`- Worktree: \`${REPO}\``);
  lines.push(`- HEAD: \`${out.git_head}\``);
  lines.push(`- TLS: \`${out.tls}\``);
  lines.push(
    `- Concurrency: batches of ${BATCH_SIZE}; Bosque + five metros individual`
  );
  lines.push(
    "- Database: deployment Neon via `DEPLOYMENT_DATABASE_URL` (authorized Wave 3 ingest; no test runner; atoms Neon untouched during this wave)."
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
  for (const r of state.results) {
    lines.push(`### ${r.fips} ${r.name} (${r.phase || "?"})`);
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
        `- Geometry: outside_texas=${r.geometry.rows_outside_texas}; seam_factor=${r.geometry.seam_factor}; multipolygon_pct=${r.geometry.multipolygon?.multipolygon_pct}; bbox=${JSON.stringify(r.geometry.parcel_bbox)}`
      );
    }
    if (r.bbox_compare) {
      lines.push(
        `- Bbox verify: matched=${r.bbox_compare.matched}; ${r.bbox_compare.note}`
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
    `Wave3 landed seams mean=${out.seam.mean}, min=${out.seam.min}, max=${out.seam.max}.`
  );
  lines.push("");
  lines.push("## Cost");
  lines.push("");
  lines.push(out.cost_finding);
  lines.push("");
  lines.push("## Findings / defects");
  lines.push("");
  const findings = [];
  if (state.halted) findings.push(`FINDING W3-HALT: wave stopped — ${state.haltReason}`);
  if (donleyRows !== 0) findings.push(`FINDING W3-DONLEY: Donley has ${donleyRows} rows (must be 0)`);
  for (const r of landed) {
    if (r.bbox_compare && r.bbox_compare.matched === false) {
      findings.push(
        `FINDING W3-BBOX-${r.fips}: store bbox != SHP header`
      );
    }
  }
  findings.push(`FINDING W3-COST: ${out.cost_finding}`);
  if (finalDistinct !== baselineDistinct + landed.length) {
    findings.push(
      `FINDING W3-DISTINCT: final distinct ${finalDistinct} != baseline ${baselineDistinct} + landed ${landed.length}`
    );
  }
  for (const f of findings) lines.push(`- ${f}`);
  lines.push("");

  writeFileSync(
    join(INBOX, `2026-08-08_L2_${WAVE_TAG}_report.md`),
    lines.join("\n"),
    "utf8"
  );

  console.log("\n==== WAVE 3 DONE ====");
  console.log(
    JSON.stringify(
      {
        halted: state.halted,
        haltReason: state.haltReason,
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

  process.exit(state.halted ? 2 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
