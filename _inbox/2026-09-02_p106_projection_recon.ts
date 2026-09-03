/**
 * P-106 item 2 reconciliation, READ-ONLY.
 *
 * Runs the REAL projection derivation (`projectConstraintCells`) over live
 * Bastrop rows and prints, per parcel, what the projection would hold. The
 * comparison against `get_smart_site` is done by the lane against the live
 * serve path, so the two sides are produced by two different code paths from
 * two different processes.
 *
 * Nothing is written. The session is read-only at the store.
 *
 * HOW TO RUN (it lives in doc_repo _inbox as the durable record of how the
 * reconciliation was produced, and runs from the api-server package because it
 * imports the real derivation):
 *
 *   cp _inbox/2026-09-02_p106_projection_recon.ts
 *      <ldt-worktree>/artifacts/api-server/src/p106Recon.ts
 *   cd <ldt-worktree>/artifacts/api-server
 *   P106_DEPLOYMENT_URL=... P106_ATOMS_URL=... P106_COUNTY=48021
 *   P106_PROP_IDS=103255,103281,... P106_RECON_OUT=...
 *     pnpm exec tsx src/p106Recon.ts
 *   rm src/p106Recon.ts
 *
 * (each env assignment on the same command line as the pnpm invocation; they
 * are split across lines here only so this comment stays readable.)
 */
import pg from "pg";
import { writeFileSync } from "node:fs";
import { projectConstraintCells } from "./lib/parcelConstraintProjection";

const DEPLOYMENT = process.env.P106_DEPLOYMENT_URL!;
const ATOMS = process.env.P106_ATOMS_URL!;
const COUNTY = process.env.P106_COUNTY ?? "48021";
const OUT = process.env.P106_RECON_OUT!;
const IDS = (process.env.P106_PROP_IDS ?? "").split(",").filter(Boolean);

async function main() {
  const dep = new pg.Client({ connectionString: DEPLOYMENT, ssl: { rejectUnauthorized: true } });
  await dep.connect();
  await dep.query("SET default_transaction_read_only = on");
  const at = new pg.Client({ connectionString: ATOMS, ssl: { rejectUnauthorized: true } });
  await at.connect();
  await at.query("SET default_transaction_read_only = on");

  const keys = IDS.map((p) => `node:${COUNTY}:${p}`);
  const bake = await dep.query(
    `select place_key, payload_json, snapshot_at
       from place_layer_snapshots
      where adapter_key = 'node-facets:tier1' and place_key = any($1::text[])`,
    [keys],
  );
  const juris = await dep.query(
    `select prop_id, disposition from landing_parcel_jurisdiction
      where county_fips = $1 and prop_id = any($2::text[])`,
    [COUNTY, IDS],
  );
  const jurisBy = new Map<string, string>(
    juris.rows.map((r: { prop_id: string; disposition: string }) => [r.prop_id, r.disposition]),
  );

  const floodKeys = IDS.flatMap((p) => [`${COUNTY}:${p}`, `${COUNTY}:${p}.00000000`]);
  const flood = await at.query(
    `select entity_id, body from atoms
      where entity_type = 'flood-hazard-fact' and entity_id = any($1::text[])`,
    [floodKeys],
  );
  const floodBy = new Map<string, Record<string, unknown>>(
    flood.rows.map((r: { entity_id: string; body: Record<string, unknown> }) => [
      r.entity_id.replace(/\.00000000$/, ""),
      r.body,
    ]),
  );

  const sd = await at.query(
    `select entity_id, body from atoms
      where entity_type = 'special-district-fact'
        and (${IDS.map((_, i) => `entity_id like $${i + 1}`).join(" or ")})`,
    IDS.map((p) => `${COUNTY}:${p}:sd%`),
  );
  const sdBy = new Map<string, { state: "present" | "absent"; districtId: string; suffix: string; districtType: string | null }>();
  for (const r of sd.rows as Array<{ entity_id: string; body: Record<string, unknown> }>) {
    const parcel = r.entity_id.replace(/:sd(:.*)?$/, "").replace(/\.00000000$/, "");
    const suffix = r.entity_id.includes(":sd:") ? r.entity_id.split(":sd:")[1] : "";
    const absent = suffix === "" || suffix === "none" || suffix === "outside";
    if (!absent) {
      sdBy.set(parcel, {
        state: "present",
        districtId: suffix,
        suffix,
        districtType: (r.body?.districtType as string) ?? null,
      });
    } else if (!sdBy.has(parcel)) {
      sdBy.set(parcel, { state: "absent", districtId: "", suffix, districtType: null });
    }
  }

  const rows = [];
  for (const r of bake.rows as Array<{ place_key: string; payload_json: unknown; snapshot_at: Date }>) {
    const propId = r.place_key.split(":")[2];
    const nodeId = `${COUNTY}:${propId}`;
    const fb = floodBy.get(nodeId);
    let floodRead: Parameters<typeof projectConstraintCells>[0]["flood"] = null;
    if (fb) {
      const hasAbsence = fb.absence != null || fb.sourceTier === "absent" || fb.verifiedAbsence != null;
      if (hasAbsence) {
        floodRead = { state: "absent", absence: (fb.absence as { kind: string; reason: string }) ?? null };
      } else if (typeof fb.inSpecialFloodHazardArea === "boolean") {
        floodRead = {
          state: "present",
          inSpecialFloodHazardArea: fb.inSpecialFloodHazardArea,
          floodZone: typeof fb.floodZone === "string" ? fb.floodZone : null,
        };
      } else {
        floodRead = { state: "refused", code: "malformed-atom" };
      }
    } else {
      floodRead = { state: "refused", code: "atom-miss" };
    }
    const sdr = sdBy.get(nodeId);
    const projected = projectConstraintCells({
      parcelNodeId: nodeId,
      countyFips: COUNTY,
      propId,
      tier1: r.payload_json,
      bakeSnapshotAt: r.snapshot_at?.toISOString() ?? null,
      jurisdictionDisposition:
        (jurisBy.get(propId) as "in-city" | "unincorporated" | "unresolved" | undefined) ?? null,
      flood: floodRead,
      specialDistrict: sdr
        ? sdr.state === "present"
          ? { state: "present", districtId: sdr.districtId, districtType: sdr.districtType }
          : { state: "absent", suffix: sdr.suffix }
        : null,
    });
    rows.push({
      parcelNodeId: nodeId,
      bakeSnapshotAt: projected.bakeSnapshotAt,
      cells: Object.fromEntries(
        Object.entries(projected.cells).map(([rail, cell]) => [
          rail,
          { state: cell.state, value: cell.number ?? cell.text ?? cell.flag ?? null, basis: cell.basis },
        ]),
      ),
    });
  }
  await dep.end();
  await at.end();
  writeFileSync(OUT, JSON.stringify({ countyFips: COUNTY, measuredAt: new Date().toISOString(), rows }, null, 2) + "\n", "utf8");
  process.stdout.write(`wrote ${rows.length} projected rows\n`);
}

main().catch((err) => {
  process.stderr.write(String(err?.message ?? err) + "\n");
  process.exitCode = 1;
});
