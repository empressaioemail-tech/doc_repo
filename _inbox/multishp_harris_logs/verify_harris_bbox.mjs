import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL missing");
  process.exit(1);
}
if (url.includes("-pooler")) {
  console.error("REFUSING pooler URL");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: url });
const client = await pool.connect();
try {
  // Discover geometry column name.
  const cols = await client.query(`
    SELECT column_name, udt_name
    FROM information_schema.columns
    WHERE table_name = 'txgio_parcel'
      AND (udt_name = 'geometry' OR column_name ILIKE '%geom%' OR column_name ILIKE '%wkt%'
           OR column_name IN ('geometry','geom','west_lng','bbox'))
    ORDER BY ordinal_position
  `);
  console.log("GEOM_COLS", JSON.stringify(cols.rows));

  const sample = await client.query(`
    SELECT * FROM txgio_parcel WHERE county_fips = '48201' LIMIT 1
  `);
  console.log("SAMPLE_KEYS", Object.keys(sample.rows[0] || {}));

  // Prefer PostGIS geometry if present; else west_lng-style columns used by prior probes.
  const keys = Object.keys(sample.rows[0] || {});
  let sql;
  if (keys.includes("geom")) {
    sql = `
      SELECT count(*)::bigint AS cnt,
             min(ST_XMin(geom)) AS westmost,
             max(ST_XMax(geom)) AS eastmost,
             min(ST_YMin(geom)) AS southmost,
             max(ST_YMax(geom)) AS northmost,
             count(*) FILTER (WHERE ST_XMin(geom) < -95.44)::bigint AS west_of_wall,
             count(*) FILTER (WHERE ST_XMin(geom) < -95.80)::bigint AS west_of_neg95_80
      FROM txgio_parcel WHERE county_fips = '48201'`;
  } else if (keys.includes("geometry")) {
    sql = `
      SELECT count(*)::bigint AS cnt,
             min(ST_XMin(geometry)) AS westmost,
             max(ST_XMax(geometry)) AS eastmost,
             min(ST_YMin(geometry)) AS southmost,
             max(ST_YMax(geometry)) AS northmost,
             count(*) FILTER (WHERE ST_XMin(geometry) < -95.44)::bigint AS west_of_wall,
             count(*) FILTER (WHERE ST_XMin(geometry) < -95.80)::bigint AS west_of_neg95_80
      FROM txgio_parcel WHERE county_fips = '48201'`;
  } else if (keys.includes("west_lng")) {
    sql = `
      SELECT count(*)::bigint AS cnt,
             min(west_lng) AS westmost,
             max(east_lng) AS eastmost,
             min(south_lat) AS southmost,
             max(north_lat) AS northmost,
             count(*) FILTER (WHERE west_lng < -95.44)::bigint AS west_of_wall,
             count(*) FILTER (WHERE west_lng < -95.80)::bigint AS west_of_neg95_80
      FROM txgio_parcel WHERE county_fips = '48201'`;
  } else {
    throw new Error("no recognizable geometry columns: " + keys.join(","));
  }

  const r = await client.query(sql);
  console.log("HARRIS_POST_APPLY", JSON.stringify(r.rows[0]));

  const v = await client.query(`
    SELECT count(DISTINCT source_vintage) AS vintages,
           min(source_vintage) AS v_min,
           max(source_vintage) AS v_max
    FROM txgio_parcel WHERE county_fips = '48201'
  `);
  console.log("VINTAGE", JSON.stringify(v.rows[0]));
} finally {
  client.release();
  await pool.end();
}
