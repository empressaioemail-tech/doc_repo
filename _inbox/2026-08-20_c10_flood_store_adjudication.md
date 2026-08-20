# C10 return: flood store reconciliation (ZONE-VERSUS-X)

Worker C10. READ-ONLY. No production writes. No commit. No nested agents.

## Snapshot (declare in every output)

| store | identity |
| --- | --- |
| hauska-engine | `d3f37949003fae5a99a82b62956352b7dcaa1022` (read from `P:/tmp/mp-b-flood-chain`; current `P:/hauska-engine` HEAD is `8d8e880`, not this snapshot) |
| hauska-map | `204789f81e46fb4fe4754e98bc11d52e703abc09` (read from `P:/tmp/ss-verify`) |
| legacy-design-tools | `origin/main` `1a55566b057f8db4b888d007009c7fcaf84031d7` (read from `P:/tmp/mp-a3-s22-card`) |
| DB | cortex-prod project `fancy-fire-06136146`, host `ep-lucky-truth-apodo8hr`, user `neondb_owner`, UTC **2026-08-20T19:49:04.787Z** (and earlier queries from 19:43:37Z). `place_layer_snapshots` / `txgio_parcel` / `tx_fema_nfhl_flood_zone` on database **neondb**. `atoms` on database **hauska_mcp**. |

Seat: C10 is a read-only worker under the parent planner. Checkout is `P:/doc_repo` (integration worktree on `main`). Product files were read from the snapshot worktrees named above, not from seat/property HEADs.

Class convention used below: **bake / atom**. Confirmed by case `48021:36521` (bake AO, atom AE) matching Q5's `AO/AE` label, and by the 87279xx cluster (bake AE, atom X) matching Q5's mass class `AE/X`. Q5 sizes are RELAYED and were not re-derived: 533,867 both-stores, 496,536 agree, 37,331 disagree; of disagreements 36,723 are zone-versus-X (AE/X 16,022, A/X 9,145, X/AE 6,732, X/A 4,824); AO/AE is 129. Source: `_inbox/2026-08-20_db_probe_five_answers.md` Q5.

`fema:nfhl-flood-zone` is **176** rows keyed `coord:{lat}:{lng}` (sample `coord:29.27073:-97.63288`). Not joinable to a parcel. Not a third parcel store. VERIFIED count on neondb.

## Pre-registered ways this output could be wrong (checked before reporting)

1. **Wrong point.** Adjudicating a tile centre, a bake-stored vertex-mean, or an atom-derived W-3/W-4 centroid, then calling that the parcel. Check: primary NFHL point is `ST_PointOnSurface(txgio_parcel.geom)` (SRID 4326), which is on the polygon. `ST_Centroid` reported alongside. Tile centre and bake `lat_rounded/lng_rounded` queried as mechanism tests, never as the parcel.
2. **Wrong database.** Querying `atoms` on neondb or bake on hauska_mcp returns zero rows and reads as a stronger absence than the truth. Check: `SELECT COUNT(*) FROM atoms ...` on **neondb** raised `relation "atoms" does not exist`. `SELECT COUNT(*) FROM place_layer_snapshots ...` on **hauska_mcp** raised `relation "place_layer_snapshots" does not exist`. A nonexistent `place_key` / `entity_id` on the **correct** database returns `n=0` (genuine absence). Those three states were not collapsed.

A third way, observed in-run and not pre-registered: a FEMA HTTP connection reset that returns empty `features`. Treating that as "outside any zone" would fabricate absence. Those retries are labelled **UNMEASURED**, not zero.

## Verdict (per disagreement class)

**The atom store is right about the parcel. The bake store is right about a different point (the 0.005-degree FEMA tile centre), and wrong about the parcel.**

This holds for the mass (AE/X and A/X), for the inverse (X/AE), and for the old headline (AO/AE). AO/AE is the same tile-versus-parcel mechanism with an AO polygon under the tile centre and AE under the parcel. It is not a subtype disagreement about one location.

n = 9 Bastrop parcels. n is small and honest. Every location below is the parcel polygon, not a tile.

SS-W11's "atom won 5,714/5,714" is **not** the evidence here. This lane re-queried FEMA NFHL MapServer layer 28 and the bulk table `tx_fema_nfhl_flood_zone` at `ST_PointOnSurface`. The SS-W11 result is consistent with this sample and is not a premise of it.

---

## Write paths (code reading; READ at the declared snapshots)

### Bake = `neondb.place_layer_snapshots` `adapter_key='node-facets:tier2'`

Writer: LDT `artifacts/api-server/src/nodeFacetBakeTier2Cli.ts` at `1a55566b`. hauska-map at `204789f` does **not** write this store. `apps/property-explorer/src/lib/baked-facets.ts` is a read client (and the `/property-atoms` substring test SS-W16 named). Flood overlay remaining after envelope retirement is documented in `nodeFacetBakeTier2.ts`.

Mechanism:

1. Parcel ring from `txgio_parcel.geometry`. Centroid is `ringCentroid`: mean of distinct vertices, rounded to 5 decimals (`nodeFacetBakeTier1.ts:40-52`). Same W-3 shape as the atom writer. Stored as `lat_rounded`/`lng_rounded`. Comment on that helper says it is "ONLY for the snapshot's coord index, not a load-bearing survey point." The FEMA query ignores that distinction.
2. That centroid is quantised: `FEMA_TILE_DEG = 0.005`; `tileKey` = `Math.round(v/deg)*deg`; `fetchFemaTiles` calls `arcgisPointQuery` at **`tileCenter(key)`**, not at the parcel (`nodeFacetBakeTier2Cli.ts:125-126, 286-295, 501-524, 664-667`).
3. One answer is reused for every parcel whose centroid rounds into that tile. Displacement in this sample: 137 m to 319 m.
4. `buildFloodFacet` takes `features[0].attributes.FLD_ZONE`. Empty features become `outside-sfha` with `floodZone=null` (a real answer). Null result (throw) becomes `unavailable`. `normalizeSfha` treats only `"T"` or `true` as SFHA, then `isSfhaZone` also prefixes A/V.
5. Write key `node-facets:tier2`, `place_key = node:{parcelNodeId}`.

**Input type / cheapest satisfier.** Input to `buildFloodFacet` is `FemaQueryLike | null` (`features: { attributes: Record<string, unknown> }[]`). The schema does not mention a parcel. The cheapest satisfier of "this facet has a floodZone string" is the first ArcGIS feature at the **tile centre**. A correct parcel determination is not in the type. The 0.005-degree quantiser fires **before** `buildFloodFacet`; it is a default-before-validation in the sense of the standing exception: the schema of the facet is irrelevant to the displacement.

### Atoms = `hauska_mcp.atoms` `entity_type='flood-hazard-fact'`

Writer: `packages/engine-core/scripts/write-flood-hazard-fact-county.mjs` + `src/flood-hazard-fact/geo.ts` + `plan-county-flood-hazard.ts` at `d3f3794`.

Mechanism:

1. Parcels from `txgio_parcel` `DISTINCT ON (feature_index)`. Point is `geometryCentroid(p.geometry)` (vertex-mean of the outer ring; MultiPolygon reads `coordinates[0]` only) else bbox midpoint (`write-flood-hazard-fact-county.mjs:503-510`). **W-3** (`geo.ts:126-143` ring vertex mean). **W-4** (`geo.ts:157-163` first polygon only).
2. `findZoneAtPoint` (`geo.ts:175-201`): bbox filter, `pointInGeoJson`, then `candidates.find(isSfhaFlag) ?? candidates[0]`. **W-5** (`geo.ts:167-168`): `sfhaTf === "T" \|\| "t" \|\| "true"`. Anything else (`"TRUE"`, `"Y"`, `"1"`, `null`, `"F"`) is not SFHA. When no candidate matches, zone selection fails open to array order (`geo.ts:198-200`). Documented in `65_t25_admissibility_enumeration.md` W-5 / row 42. Assembly copies that boolean onto `inSpecialFloodHazardArea` (`plan-county-flood-hazard.ts:175`).
3. A miss (point outside every **loaded** polygon) is typed absence `no-flood-coverage`, not manufactured Zone X (`plan-county-flood-hazard.ts:163-172`). That half is fail-closed. The file header on the writer still says "Outside mapped zones = PRESENT inSFHA=false"; the planner it actually calls does not do that. The live atoms in this sample are `floodZone='X'` with `absence` null, i.e. an explicit FLD_ZONE hit, not the miss path.
4. PostGIS plan path (`postgis-flood-plan.ts`) uses the same `isSfhaFlag` predicate in SQL (`sfha_tf IN ('T','t','true')`) and `ST_Contains` (false on boundary). Hybrid backend exists specifically because Contains and the JS ray cast disagree on the boundary.
5. Atom key `entity_id` = `{countyFips}:{prop_id}` = `parcelNodeId`. Joinable to bake `place_key` `node:{parcelNodeId}`.

**Input type / cheapest satisfier.** `isSfhaFlag` input is `string | null | undefined`. Cheapest non-SFHA satisfier is any value other than the three literals, including FEMA's own `"F"` (correct) and `"TRUE"` (wrong). `findZoneAtPoint` returns `FloodZoneFeature | null`; the `?? candidates[0]` branch's cheapest satisfier is any non-empty candidate list. For this sample, live and bulk NFHL returned `SFHA_TF` in `{T,F}` and a **single** polygon at the parcel point, so W-5 did not fire.

The writer comment at the top of the `.mjs` ("Outside mapped zones = PRESENT inSFHA=false") is stale relative to `assembleCountyFloodHazardPlan` at this snapshot. That comment is not the live write path.

---

## How the checks were made to fail

| check | violation | result |
| --- | --- | --- |
| atoms live on hauska_mcp | same SQL on neondb | `relation "atoms" does not exist` (not zero rows) |
| bake live on neondb | same SQL on hauska_mcp | `relation "place_layer_snapshots" does not exist` |
| bake row exists for `node:48021:36521` | `place_key='node:48021:DOES-NOT-EXIST'` | `n=0` (absence, correct DB) |
| atom row exists for `48021:36521` | `entity_id='48021:DOES-NOT-EXIST'` | `n=0` |
| NFHL layer 28 is Flood Hazard Zones | GET layer 28 metadata | `name="Flood Hazard Zones"`, fields include `FLD_ZONE,ZONE_SUBTY,SFHA_TF` (READ of the JSON, http=200, 70584 bytes) |
| layer 28 vs layer 0 | GET layer 0 metadata | `name="NFHL Availability"`, no FLD_ZONE fields. Querying layer 0 with FLD_ZONE outFields returned `Failed to execute query` (first batch) / connection-reset (retry). Layer 0 cannot answer this question. |
| ST_Contains is the whole bulk truth | ST_Intersects at the same two tile points | same single row at both (AO at 36521 tile; X 0.2-pct at 8727948 tile). Boundary-miss rejected as the explanation of live-vs-bulk at 8727948 tile. |
| curl empty features means outside | connection reset (curl 35) on several live queries | labelled UNMEASURED, not Zone X / not outside. 36521 live tile later succeeded as AO. |

A clean pass on a lookup that cannot return zero would have been worthless. The nonexistent-key lookups return zero on the correct database; the wrong-database lookups raise.

---

## Sample (adjudicated at the parcel)

NFHL client in this repo (`lib/cad-ingest/src/nfhl/service.ts:49-50` at `1a55566b`): `https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/28`. Layer 28 metadata confirms "Flood Hazard Zones". Live queries: `geometry={lng},{lat}&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=FLD_ZONE,ZONE_SUBTY,SFHA_TF,...`. Bulk table `tx_fema_nfhl_flood_zone` is the atom writer's source (`NFHL_48_20260101`), queried by GiST `&&` + `ST_Contains` on indexed points (not a 533k join, not a county scan).

Primary point: `ST_PointOnSurface(geom)` of `txgio_parcel` via `(county_fips, prop_id)` btree `txgio_parcel_prop_idx`. Tile centre computed with the bake's own `Math.round(v/0.005)*0.005`.

`36560` has two `txgio_parcel` rows (same `feature_index` 26383, two `tile_key` values, identical geom). That is the known multi-row-per-feature fabric, not two parcels.

### AE/X (bake AE, atom X) — the mass

| parcel | bake | atom | NFHL at POS (live / bulk) | NFHL at TILE (live / bulk) | POS lat,lng | tile lat,lng | disp | right about the parcel |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 48021:8727948 | AE in-sfha | X not-sfha | X / X (0.2 PCT ANNUAL CHANCE) | AE / X (0.2 PCT) | 30.17745977, -97.46911164 | 30.18000, -97.47000 | 284 m | **atom** |
| 48021:8727992 | AE in-sfha | X not-sfha | X / X (AREA OF MINIMAL FLOOD HAZARD) | AE / (not separately bulk-probed; same tile as 8727948) | 30.17832613, -97.47223755 | 30.18000, -97.47000 | 308 m | **atom** |
| 48021:8727994 | AE in-sfha | X not-sfha | X / X (MINIMAL) | AE live (retry) / bulk same tile X | 30.17793579, -97.47180829 | 30.18000, -97.47000 | 279 m | **atom** |
| 48021:36505 | AE in-sfha | X not-sfha | X / X (MINIMAL) | AE FLOODWAY / AE FLOODWAY | 30.11034372, -97.30863197 | 30.11000, -97.31000 | 137 m | **atom** |
| 48021:36555 | AE in-sfha | X not-sfha | X / X (MINIMAL) | AE / AE | 30.11744499, -97.32583797 | 30.11500, -97.32500 | 283 m | **atom** |

8727948/8727992/8727994 share one FEMA tile. Five consecutive-ish prop ids sitting in one bad tile is the SS-W11 leftover; this lane confirmed the tile is AE on **live** NFHL and the parcels are X.

Live-vs-bulk at **8727948 tile**: live AE, bulk X (0.2-pct). ST_Contains and ST_Intersects agree on bulk X, so this is not a boundary miss in our SQL. It is an edition/geometry difference **at the tile**, not at the parcel. At the parcel both editions say X. Bake (vintage field = bake timestamp 2026-07-21, live ArcGIS) matches **today's live tile**. Atom (sourceVintage `NFHL_48_20260101`) matches **both editions at the parcel**.

### A/X (bake A, atom X) — the mass, second slice

| parcel | bake | atom | NFHL at POS (live / bulk) | NFHL at TILE (live / bulk) | POS lat,lng | tile lat,lng | disp | right about the parcel |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 48021:36544 | A in-sfha | X not-sfha | X / X (MINIMAL) | A / A | 30.10157396, -97.35362519 | 30.10000, -97.35500 | 208 m | **atom** |
| 48021:36560 | A in-sfha | X not-sfha | X / X (MINIMAL) | A / A | 30.15037647, -97.22225320 | 30.15000, -97.22000 | 231 m | **atom** |

36560 extra: bake stored centroid `30.14959, -97.22126` is ~95 m from `ST_Centroid` (vertex-mean vs area centroid, W-3). NFHL at that stored point is still X (live and bulk). Bake value is A, which is the **tile**, not the stored centroid. This one row kills the hypothesis that bake is answering `lat_rounded/lng_rounded`.

### X/AE (bake X, atom AE)

| parcel | bake | atom | NFHL at POS (live / bulk) | NFHL at TILE (live / bulk) | POS lat,lng | tile lat,lng | disp | right about the parcel |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 48021:36767 | X flood-zone | AE in-sfha | AE / AE | X / X (MINIMAL) | 30.13795892, -97.47780346 | 30.14000, -97.48000 | 319 m | **atom** |

Same mechanism, inverted: tile centre landed in X, parcel is in AE. A disagreement class of atom=AE bake=X is **not** W-5 (W-5 would push the atom toward X, not toward AE).

### AO/AE (bake AO, atom AE) — the old headline, n=129

| parcel | bake | atom | NFHL at POS (live / bulk) | NFHL at TILE (live / bulk) | POS lat,lng | tile lat,lng | disp | right about the parcel |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 48021:36521 | AO in-sfha | AE in-sfha | AE / AE | AO / AO | 30.11267729, -97.30866991 | 30.11500, -97.31000 | 287 m | **atom** |

Live POS AE was the first successful MapServer hit this lane made. Live TILE AO succeeded on a later retry (http 200, one feature `FLD_ZONE=AO, SFHA_TF=T`). Bulk agrees on both points. Bake `lat_rounded=30.11268, lng_rounded=-97.30867` matches `ST_Centroid` to the stored 5-decimal grid. The AO is the tile, 287 m away. This is zone-versus-X's sibling (AO vs AE) produced by the **same quantiser**, not a 129-row subtype merge problem.

First live TILE query for 36521 connection-reset; that attempt is UNMEASURED and was not used.

---

## Mechanisms, second mechanisms, rejections

### Finding 1. Zone-versus-X is tile sampling, not W-5 and not W-3/W-4 at the parcel.

**Mechanism.** The bake queries FEMA once per 0.005-degree tile at the tile centre and stamps that zone on every parcel in the tile. On a flood-zone boundary, parcels in X get AE/A/AO from a tile centre inside the SFHA, and parcels in AE get X from a tile centre outside it. Observed: every sample's bake value equals NFHL at the tile, and every sample's atom value equals NFHL at `ST_PointOnSurface`.

**Second mechanism (prompted): W-5 fail-open on the atom writer**, producing atom=X when bake=AE because `isSfhaFlag` misses and `candidates[0]` is an overlapping X. **Rejected.** Live and bulk NFHL at the parcel point returned **one** feature, zone X, `SFHA_TF=F`. There was no overlapping AE at the point for W-5 to drop. Atom=X because the parcel is in X. W-5 remains a real write-path defect (type: string flag, cheapest satisfier anything-but-T/t/true) and would matter on overlapping polygons with a non-T SFHA encoding. It is not what produced this sample's AE/X mass.

**Second mechanism: W-3/W-4**, vertex-mean / first-part centroid falling off the parcel into X while the parcel is in AE. **Rejected for these nine.** `ST_PointOnSurface` (on the polygon) and `ST_Centroid` agree on zone with the atom in every case. 36560's vertex-mean is ~95 m from the area centroid and still X; the bake's A is another 230 m away at the tile. W-3/W-4 remain real defects (concave / multi-part) and are unmeasured as a *cause of this 37k* because this sample has no multi-part parcels (`ST_NumGeometries=1` on all nine).

**Second mechanism: edition drift** (July live ArcGIS vs `NFHL_48_20260101`). **Rejected at the parcel.** POS matches across live and bulk for all nine. **Not rejected at one tile:** 8727948 tile is AE live and X (0.2-pct) in bulk. That explains why a July bake of that *tile* says AE while a January bulk lookup of the same *tile* would say X. It does not explain bake AE vs atom X **on the parcel**, because the parcel is X in both editions. Bake is still answering the tile.

**Second mechanism: Q5 class order reversed** (first=atom, second=bake). **Rejected.** `48021:36521` is bake AO / atom AE, and Q5 names that class AO/AE. The 87279xx cluster is bake AE / atom X.

### Finding 2. AO/AE (129) is not a different defect.

**Mechanism.** Same tile quantiser. 36521 tile = AO, parcel = AE, both SFHA. A merge that "reconciled AO vs AE" would leave the 36,723 zone-versus-X cases untouched and would still be reconciling two points 287 m apart.

**Second mechanism: FEMA dual-zone / overlapping AO and AE at one point, stores picking different features.** **Rejected.** POS returned a single AE. TILE returned a single AO. No dual feature list.

### Finding 3. The 176 `fema:nfhl-flood-zone` rows are not a third parcel store.

**Mechanism.** They are coord-keyed (`coord:{lat}:{lng}`), the same adapterKey string the tier2 facet stamps into its own provenance. SS-W16 retired them as a pair with the tile-quantised facet on the **read** path. They cannot join on `parcelNodeId`.

**Second mechanism: they are a 176-row parcel sample that could adjudicate the 37k.** **Rejected.** Keys are coordinates, not `node:{fips}:{prop_id}`. Count 176 VERIFIED. Do not join them.

### Finding 4. W-5 / W-3 / W-4 still live on the atom writer, and they are the wrong explanation for atom=X bake=AE in this sample.

The prompt's consistency claim is logically true (that class *could* be produced by W-5 or a bad centroid) and empirically false on these parcels. The atom writer failed closed on misses (absence, not X) and, for these hits, reported the zone that is actually under the parcel. The bake is the store that did not sample the parcel.

---

## What was not measured

- The 533,867 join was not re-run. Q5 sizes stay RELAYED.
- n=9, all Bastrop (`48021`). A/X and AE/X in other of the 10 bake counties are unmeasured here. The write path is county-agnostic (same tile constant, same writer), so the mechanism claim is about the writers, not about Bastrop as a special geography. Extrapolation of the *rate* to the other nine counties is unmeasured.
- Multi-part parcels (W-4) : unmeasured. All nine are `ST_Polygon` with `nparts=1`. Q4's statewide multi-part population is a different probe.
- Concave parcels where vertex-mean falls outside the ring (W-3 firing): unmeasured as a disagreement cause. 36560 shows vertex-mean displacement without a zone change.
- Overlapping NFHL polygons at a parcel point (W-5's actual blast radius): unmeasured. Every live POS hit in this sample had `n=1`.
- Live MapServer at 36521 tile was UNMEASURED on the first attempt (curl 35); later attempt VERIFIED AO. Several other curl-35 attempts (ocean point, layer 0 retry) stay UNMEASURED.
- Bake covers 10 counties, not statewide (Q5 / SS-W11 F5). Atom coverage is statewide relative to that. One-sided rows are not disagreements and were not sampled.
- hauska-map has no flood **write** path at `204789f`. Stating "hauska-map is wrong" would be a category error; the bake writer is LDT.

## Leave behind

`leave_behind: none`

No repo edits. No DB writes. Report path: `P:/tmp/mp-c10-return.md`.
