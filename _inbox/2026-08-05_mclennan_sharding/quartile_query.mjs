import postgres from "postgres";

const url = process.env.DATABASE_URL?.trim();
if (!url) {
  console.error("DATABASE_URL required");
  process.exit(1);
}

const sql = postgres(url, { max: 1, ssl: "require", prepare: false });

const rows = await sql`
  WITH ids AS (
    SELECT DISTINCT body->>'parcelNodeId' AS pid
    FROM atoms
    WHERE entity_type = 'zoning-fact'
      AND jurisdiction_tenant LIKE 'breadth_48309_%'
      AND body->>'parcelNodeId' IS NOT NULL
  ),
  ranked AS (
    SELECT pid,
      ntile(4) OVER (ORDER BY pid) AS quartile
    FROM ids
  )
  SELECT quartile,
    min(pid) AS parcel_min,
    max(pid) AS parcel_max,
    count(*)::int AS n
  FROM ranked
  GROUP BY quartile
  ORDER BY quartile
`;

const total = await sql`
  SELECT count(DISTINCT body->>'parcelNodeId')::int AS n
  FROM atoms
  WHERE entity_type = 'zoning-fact'
    AND jurisdiction_tenant LIKE 'breadth_48309_%'
`;

console.log(JSON.stringify({ total: total[0].n, shards: rows }, null, 2));
await sql.end();
