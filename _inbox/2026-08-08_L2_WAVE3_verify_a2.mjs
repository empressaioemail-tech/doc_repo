/**
 * Wave 3 resume independent verification.
 * SELECT-only. Rebuilds the per-county proof table from live SQL + artifacts,
 * so the report never quotes a number that only the orchestrator asserted.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const INBOX = "P:/doc_repo/_inbox";
const PSQL = "C:/Program Files/PostgreSQL/18/bin/psql.exe";

function sql(q) {
  const db = process.env.DATABASE_URL;
  if (!db) throw new Error("missing DATABASE_URL");
  if (db.includes("pooler")) throw new Error("REFUSING: pooler URL is read-only");
  const r = spawnSync(PSQL, [db, "-v", "ON_ERROR_STOP=1", "-At", "-F", "|", "-c", q], {
    encoding: "utf8",
    windowsHide: true,
  });
  if (r.status !== 0) throw new Error(`psql failed: ${r.stderr || r.stdout}`);
  return (r.stdout || "").trim();
}

const membership = JSON.parse(
  readFileSync(join(INBOX, "2026-08-08_L2_WAVE3_membership_resume2.json"), "utf8")
);
const resumeSet = [
  ...membership.partition.batch,
  ...(membership.partition.bosque_solo ? [membership.partition.bosque_solo] : []),
  ...membership.partition.solo_last,
];

const rows = [];
for (const c of resumeSet) {
  const art = join(INBOX, `2026-08-08_L2_WAVE3_${c.fips}.json`);
  const a = existsSync(art) ? JSON.parse(readFileSync(art, "utf8")) : null;
  const sqlRows = Number(
    sql(`SELECT count(*) FROM txgio_parcel WHERE county_fips='${c.fips}'`) || 0
  );
  const outside = sqlRows
    ? Number(
        sql(`SELECT count(*) FROM txgio_parcel WHERE county_fips='${c.fips}'
          AND (west_lng < -107 OR west_lng > -93 OR south_lat < 25 OR north_lat > 37)`)
      )
    : 0;
  rows.push({
    fips: c.fips,
    name: c.name,
    phase: a?.phase ?? null,
    pass: a?.pass ?? false,
    dry_predicts_apply: a?.dry_predicts_apply ?? null,
    idempotent_row_count_held: a?.idempotent_row_count_held ?? null,
    claimed_rows: a?.rows_written ?? null,
    sql_rows: sqlRows,
    sql_matches_claim: a?.rows_written != null ? sqlRows === a.rows_written : null,
    rows_outside_texas: outside,
    seam_factor: a?.seam_factor ?? null,
    bbox_matched: a?.bbox_compare?.matched ?? null,
    wall_s: a?.wall_clock_s ?? null,
    halt_reason: a?.halt_reason ?? null,
  });
}

const landed = rows.filter((r) => r.pass && r.sql_rows > 0);
const totals = sql(`SELECT count(DISTINCT county_fips), count(*) FROM txgio_parcel`).split("|");

const out = {
  generated: new Date().toISOString(),
  resume_set: resumeSet.length,
  landed: landed.length,
  failed: rows.filter((r) => !r.pass && r.sql_rows === 0 && r.halt_reason).length,
  not_started: rows.filter((r) => !r.pass && !r.halt_reason).length,
  parked: membership.parked,
  rows_added_by_resume: landed.reduce((a, r) => a + r.sql_rows, 0),
  store_distinct_now: Number(totals[0]),
  store_rows_now: Number(totals[1]),
  all_dry_predicted_apply: landed.every((r) => r.dry_predicts_apply === true),
  all_idempotent_held: landed.every((r) => r.idempotent_row_count_held === true),
  all_sql_matches_claim: landed.every((r) => r.sql_matches_claim === true),
  total_rows_outside_texas: rows.reduce((a, r) => a + r.rows_outside_texas, 0),
  per_county: rows,
};

writeFileSync(
  join(INBOX, "2026-08-08_L2_WAVE3_verify_a2.json"),
  JSON.stringify(out, null, 2),
  "utf8"
);
console.log(
  JSON.stringify(
    {
      resume_set: out.resume_set,
      landed: out.landed,
      failed: out.failed,
      not_started: out.not_started,
      rows_added: out.rows_added_by_resume,
      store: `${out.store_distinct_now} distinct / ${out.store_rows_now} rows`,
      all_dry_predicted_apply: out.all_dry_predicted_apply,
      all_idempotent_held: out.all_idempotent_held,
      all_sql_matches_claim: out.all_sql_matches_claim,
      total_rows_outside_texas: out.total_rows_outside_texas,
    },
    null,
    2
  )
);
