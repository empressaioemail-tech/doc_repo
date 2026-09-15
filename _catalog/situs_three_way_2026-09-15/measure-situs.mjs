import fs from "node:fs";
import pg from "pg";

const url = fs.readFileSync(new URL("./.cortexdb", import.meta.url), "utf8").trim();
const pool = new pg.Pool({ connectionString: url, ssl: { rejectUnauthorized: false }, statement_timeout: 280_000 });

// PER-PARCEL (not per-row). txgio_parcel carries multiple rows for a share of
// prop_ids (30% of rows, statewide -- confirmed by direct query: Bastrop alone
// has 9,342 duplicate prop_id groups, one of which is the placeholder id "0"
// appearing 168 times). Collapsing to one representative row per
// (county_fips, prop_id) is safe: a direct check confirms situs_address never
// disagrees within a duplicate group (0 disagreeing groups, both statewide and
// in Bastrop specifically). Counting raw rows instead of distinct parcels was
// tried first and rejected -- it inflated the Bastrop denominator from the
// already-verified 74,729-row/62,257-parcel split (P-212) into a same-shaped
// but wrong per-row percentage. This is exactly DEV_PROCESS 1.3's rule: measure
// the class you are reporting (parcels), never a proxy for it (rows).
const disagreeCheck = await pool.query(`
  select count(*) as disagreeing_groups from (
    select county_fips, prop_id
    from txgio_parcel
    group by county_fips, prop_id
    having count(distinct coalesce(situs_address,'<null>')) > 1
  ) x
`);
console.error("statewide disagreeing dupe groups:", disagreeCheck.rows[0].disagreeing_groups);

const sql = `
  with one_per_parcel as (
    select distinct on (county_fips, prop_id)
      county_fips, situs_address
    from txgio_parcel
    order by county_fips, prop_id, feature_index
  )
  select
    county_fips,
    count(*) as props,
    count(*) filter (
      where situs_address is null or btrim(situs_address) = ''
    ) as none,
    count(*) filter (
      where situs_address is not null
        and btrim(situs_address) <> ''
        and btrim(split_part(situs_address, ',', 1)) ~ '^[0-9]'
    ) as real,
    count(*) filter (
      where situs_address is not null
        and btrim(situs_address) <> ''
        and btrim(split_part(situs_address, ',', 1)) !~ '^[0-9]'
    ) as sentinel
  from one_per_parcel
  group by county_fips
  order by props desc
`;

const t0 = Date.now();
const res = await pool.query(sql);
console.error(`query took ${Date.now() - t0} ms, ${res.rows.length} counties`);
console.log(JSON.stringify(res.rows.map(r => ({
  fips: r.county_fips,
  props: Number(r.props),
  real: Number(r.real),
  sentinel: Number(r.sentinel),
  none: Number(r.none),
})), null, 2));

await pool.end();
