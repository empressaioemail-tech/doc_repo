import pg from "pg";
import { writeFileSync } from "node:fs";

const url = process.env.DATABASE_URL;
if (!url || url.includes("-pooler")) {
  console.error("bad DATABASE_URL");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: url });
const c = await pool.connect();
try {
  const r = await c.query(`
    SELECT count(*)::bigint AS cnt,
           min(west_lng) AS westmost,
           max(east_lng) AS eastmost,
           min(south_lat) AS southmost,
           max(north_lat) AS northmost,
           count(*) FILTER (WHERE west_lng < -95.44)::bigint AS west_of_wall,
           count(*) FILTER (WHERE west_lng < -95.80)::bigint AS west_of_neg95_80,
           count(*) FILTER (WHERE west_lng < -95.90)::bigint AS west_of_neg95_90,
           count(*) FILTER (WHERE abs(west_lng - (-95.4364)) < 0.005)::bigint AS near_old_wall
    FROM txgio_parcel WHERE county_fips = '48201'
  `);
  const v = await c.query(`
    SELECT min(source_vintage) AS vintage, count(DISTINCT source_vintage)::int AS n_vintages
    FROM txgio_parcel WHERE county_fips = '48201'
  `);
  // Census Harris extent from TIGERweb for post-apply comparison.
  const tiger = await fetch(
    "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/1/query?" +
      new URLSearchParams({
        where: "GEOID='48201'",
        outFields: "GEOID,NAME",
        returnExtentOnly: "true",
        outSR: "4326",
        f: "json",
      }),
  );
  const tigerJson = await tiger.json();
  const extent = tigerJson.extent;
  const out = {
    observed_at_utc: new Date().toISOString(),
    method: "post-apply west_lng envelope vs TIGERweb State_County/1 GEOID=48201",
    store: r.rows[0],
    vintage: v.rows[0],
    census_extent_4326: extent,
    west_inset_vs_census:
      extent && r.rows[0].westmost != null
        ? Number(r.rows[0].westmost) - Number(extent.xmin)
        : null,
    note:
      "Geographic proof independent of feature counts. Pre-apply westmost was -95.4364 with 0 parcels west of -95.44.",
  };
  const path =
    "P:/doc_repo/_inbox/multishp_harris_logs/48201_post_apply_geo.json";
  writeFileSync(path, JSON.stringify(out, null, 2), "utf8");
  console.log(JSON.stringify(out, null, 2));
  console.log("WROTE", path);
} finally {
  c.release();
  await pool.end();
}
