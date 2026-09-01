import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", max: 1, prepare: false });
const [r] = await sql`
  SELECT count(*)::int AS n
  FROM atoms
  WHERE entity_type = 'buildable-envelope'
    AND body->>'parcelNodeId' LIKE '48021:%'
    AND coalesce(body->>'status', 'active') = 'active'
`;
console.log(JSON.stringify({ buildableEnvelopeActive: r.n }));
await sql.end({ timeout: 5 });
