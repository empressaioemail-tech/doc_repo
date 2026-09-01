import { readFileSync, writeFileSync } from "fs";
import { spawnSync } from "child_process";

const m = JSON.parse(
  readFileSync("P:/doc_repo/_inbox/2026-08-08_L2_WAVE3_membership.json", "utf8")
);
const all = [
  ...m.partition.batch,
  m.partition.bosque_solo,
  ...m.partition.solo_last,
].filter(Boolean);
const db = process.env.DATABASE_URL;
if (!db) throw new Error("DATABASE_URL required");
const list = all.map((c) => `'${c.fips}'`).join(",");
const r = spawnSync(
  "C:/Program Files/PostgreSQL/18/bin/psql.exe",
  [
    db,
    "-v",
    "ON_ERROR_STOP=1",
    "-At",
    "-c",
    `SELECT county_fips, count(*) FROM txgio_parcel WHERE county_fips = ANY(ARRAY[${list}]) GROUP BY 1 ORDER BY 1`,
  ],
  { encoding: "utf8" }
);
if (r.status !== 0) {
  console.error(r.stderr || r.stdout);
  process.exit(1);
}
const landed = Object.fromEntries(
  r.stdout
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((l) => {
      const [f, c] = l.split("|");
      return [f, Number(c)];
    })
);
console.log("already_landed_wave3", landed);
const filter = (arr) => arr.filter((c) => !landed[c.fips]);
const resume = {
  ...m,
  resume: true,
  resume_of: "WAVE3",
  already_landed: landed,
  generated_iso: new Date().toISOString(),
  partition: {
    batch: filter(m.partition.batch),
    solo_last: filter(m.partition.solo_last),
    bosque_solo: landed[m.partition.bosque_solo.fips]
      ? null
      : m.partition.bosque_solo,
  },
};
resume.counts = {
  batch: resume.partition.batch.length,
  solo_last: resume.partition.solo_last.length,
  bosque_included: !!resume.partition.bosque_solo,
  skipped_already_landed: Object.keys(landed).length,
};
resume.wave3_count =
  resume.counts.batch +
  resume.counts.solo_last +
  (resume.counts.bosque_included ? 1 : 0);
writeFileSync(
  "P:/doc_repo/_inbox/2026-08-08_L2_WAVE3_membership_resume.json",
  JSON.stringify(resume, null, 2)
);
console.log("resume counts", resume.counts, "wave3_count", resume.wave3_count);
console.log("solo_last last", resume.partition.solo_last.at(-1)?.fips);
