import { spawnSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { execFileSync } from "child_process";

const PSQL = "C:/Program Files/PostgreSQL/18/bin/psql.exe";
const db = process.env.DATABASE_URL;
if (!db) throw new Error("DATABASE_URL required");

function sql(q) {
  const r = spawnSync(PSQL, [db, "-v", "ON_ERROR_STOP=1", "-At", "-c", q], {
    encoding: "utf8",
  });
  if (r.status !== 0) throw new Error(r.stderr || r.stdout);
  return r.stdout.trim();
}

const m = JSON.parse(
  readFileSync("P:/doc_repo/_inbox/2026-08-08_L2_WAVE3_membership.json", "utf8")
);
const results = JSON.parse(
  readFileSync("P:/doc_repo/_inbox/2026-08-08_L2_WAVE3_results.json", "utf8")
);
const all = [
  ...m.partition.batch,
  m.partition.bosque_solo,
  ...m.partition.solo_last,
].map((c) => c.fips);

const store = sql(
  "SELECT count(DISTINCT county_fips), count(*), pg_total_relation_size('txgio_parcel') FROM txgio_parcel"
);
const [distinct, totalRows, relSize] = store.split("|");

const list = all.map((f) => `'${f}'`).join(",");
const wave3Lines = sql(
  `SELECT county_fips, count(*) FROM txgio_parcel WHERE county_fips = ANY(ARRAY[${list}]) GROUP BY 1 ORDER BY 1`
);
const wave3Rows = wave3Lines
  ? wave3Lines.split(/\r?\n/).filter(Boolean).map((l) => {
      const [f, c] = l.split("|");
      return { fips: f, rows: Number(c) };
    })
  : [];
const wave3Total = wave3Rows.reduce((a, x) => a + x.rows, 0);
const missing = all.filter((f) => !wave3Rows.find((x) => x.fips === f));

const special = sql(
  "SELECT county_fips, count(*) FROM txgio_parcel WHERE county_fips IN ('48035','48129','48499','48377','48201','48157','48339','48141','48039') GROUP BY 1 ORDER BY 1"
);

const out = {
  captured_iso: new Date().toISOString(),
  store: {
    distinct_counties: Number(distinct),
    total_rows: Number(totalRows),
    relation_size_bytes: Number(relSize),
  },
  wave3_membership: {
    count: all.length,
    with_rows: wave3Rows.length,
    total_rows: wave3Total,
    landed_fips: wave3Rows.map((x) => x.fips),
    per_county: wave3Rows,
    missing_fips: missing,
  },
  special_counts_raw: special,
  resume_results_summary: {
    wave_halted: results.wave_halted,
    halt_reason: results.halt_reason,
    counties_landed: results.counties_landed,
    counties_failed: results.counties_failed,
    counties_not_started: results.counties_not_started,
    total_rows_landed: results.total_rows_landed,
    wall_clock_ms: results.wall_clock_ms,
    baseline_distinct: results.baseline_distinct_county_fips,
    final_distinct: results.final_distinct_county_fips,
    failed_fips: results.failed_fips,
    seam: results.seam
      ? { mean: results.seam.mean, min: results.seam.min, max: results.seam.max }
      : null,
    git_head: results.git_head,
    git_status: results.git_status,
  },
};

writeFileSync(
  "P:/doc_repo/_inbox/2026-08-08_L2_WAVE3_finalize_snapshot.json",
  JSON.stringify(out, null, 2)
);
console.log(JSON.stringify(out, null, 2));
