---
id: 2026-08-08_STATEWIDE_ROADS_program_report
title: Statewide roads (L3) program report — Geofabrik verified, county-crossing ruling, one-county proof, adversarial review
date: 2026-08-08
status: active
owner: statewide-roads-program-planner
related:
  - _decisions/2026-08-08_layer_first_statewide_fabric_sequence.md
  - _inbox/2026-08-08_STATEWIDE_ROADS_bastrop_compare.json
---

# Statewide roads program report (L3)

Operator-authorized planner lane 2026-08-08. Design + one-county proof only. No statewide ingest. No merge. No deploy.

Engine PR (resolver scaffolding): https://github.com/empressaioemail-tech/hauska-engine/pull/288 @ `2ed0ce7`

Companion compare artifact: `_inbox/2026-08-08_STATEWIDE_ROADS_bastrop_compare.json`

---

## 1. Verified Geofabrik source

Live HEAD + MD5 check 2026-08-09 against `https://download.geofabrik.de/north-america/us/texas-latest.osm.pbf`:

| Field | Verbatim |
|---|---|
| HTTP status | 200 |
| Content-Length | **713163541** bytes (~680 MiB; matches the ~713 MB figure in `_STATE.md`) |
| Last-Modified | **Thu, 06 Aug 2026 23:17:19 GMT** |
| ETag | `"2a820315-6586916e429d6"` |
| Published MD5 file | `4dd27afd6bc1c654f9b9635b709cf424  texas-latest.osm.pbf` |
| Downloaded MD5 | `4dd27afd6bc1c654f9b9635b709cf424` — **MATCH** |
| Local cache | `P:\tmp\statewide-roads\texas-latest.osm.pbf` |

PBF tooling in hauska-engine before this lane: **absent**. Grep found no `osm.pbf` / `geofabrik` / `osmium` / `node-osmium` dependency in package trees. Existing intake is HTTP Overpass only (`fetch-overpass-bbox.ts` → `https://overpass-api.de/api/interpreter`).

Proof tooling used (outside the product dep tree): Python `osmium` (`locations=True`, `idx=flex_mem`) streaming the downloaded PBF. Product path still needs an explicit PBF reader decision (pin osmium/pyosmium worker vs add a JS/native parser) before statewide run.

County polygon input for the proof: TIGER State_County MapServer/1 (same source LDT #392 / migration 0070 uses), `GEOID=48021`, 1 Polygon, 1243 ring vertices, written to `P:\tmp\statewide-roads\bastrop_48021_county.geojson`. Note: TxGIO has no county layer (LDT `service.ts` documents this); city boundaries are TxGIO, counties are TIGER. Containment helper lives in LDT (`lib/cad-ingest/src/boundary/containment.ts`); **hauska-engine had zero imports of it** — the engine-side resolver in PR #288 re-implements even-odd math with the same half-open edge rule.

---

## 2. County-crossing ruling (with reasoning)

**Ruling: preserve `{countyFips}:road:{osmWayId}`. When a way intersects N counties, emit N road-nodes (same `osmWayId`, different FIPS prefix), each carrying the FULL centerline. Do not re-key to a county-agnostic id. Do not clip the centerline at the boundary.**

Reasoning:

1. **Id shape is locked.** Canonical pattern is `/^\d{5}:road:\d+$/` (`packages/atoms/src/road-instances.ts`). Retrieval-api validates it. `relabelBoundaryEdgesFromRoadLabels` rebuilds ids via `roadNodeIdFromParts(countyFips, osmWayId)`. SQL tallies use `split_part(roadNodeId, ':', 1)`. Re-keying (option C: county-agnostic nodes) would be a 2269-style blast radius.
2. **Current Overpass semantics already are "intersects → full geometry stamped to that jurisdiction."** City/county bbox ingest does not clip ways at the bbox. Emitting full centerline per intersecting county preserves that contract at statewide scale.
3. **Clipping is the dangerous option for the product.** Frontage labeling needs nearby centerline geometry. Cutting at the county polygon under even-odd (which classifies on-edge points as **outside**) would drop roads that run along the county line for both adjacent counties — exactly the nasty case that gates setbacks.
4. **Three-county span works under this ruling without schema change:** one physical OSM way becomes three atoms `48021:road:W`, `48055:road:W`, `48453:road:W`. Warm paths already filter `body->>'countyFips' = $COUNTY`, so a Bastrop parcel cannot accidentally match a Caldwell-stamped copy (adversarial review confirmed this sub-claim survives).

Rejected alternatives:
- Assign whole way to one county (majority length): starves the non-majority county's parcels of frontage near the line.
- County-agnostic node + per-county edges: requires id redesign.

Known costs accepted by the ruling:
- Storage duplication for crossing ways (centerline + assumed ROW edges × N).
- Statewide tallies that `COUNT(*)` road-nodes over-count distinct physical roads by crossing multiplicity (must report both per-county and de-duplicated `osmWayId` counts — see remains).

---

## 3. Way-to-county resolver design

Implementation: `packages/engine-core/src/road-intake/way-to-county.ts` (PR #288).

Algorithm against the L1 county boundary index (254 TIGER polygons, GeoJSON WGS84):

1. Bbox prefilter: way envelope vs county bbox.
2. Vertex-inside (even-odd, half-open — same rule as LDT `pointInGeometry`).
3. Else midpoint-of-each-segment inside.
4. Else **test every outer-ring edge** for segment intersection with every way segment (no decimation). Basis: `segment-crosses-boundary`.
5. Emit one target per hit: `{ countyFips, roadNodeId: "${fips}:road:${osmWayId}", basis }`. Caller stamps **full** centerline into each `emitRoadNode` with a registry-derived descriptor for that FIPS.

Boundary data path into the engine (not built this lane): export/load the 254 county GeoJSON rows from LDT `tx_county_boundary` (or re-fetch TIGER once into an engine fixture). Do not call Overpass for resolution.

**Adversarial fix applied mid-lane:** an earlier draft of the Python extractor and TS resolver used `j += step` while still testing `ring[j] → ring[j+1]`, which **skips** intervening edges. Reviewer measured ~23% miss rate on Bastrop's on-line segments. Both paths now test every ring edge. Collinear touch via `abs(orient) < 1e-18` remains weak on real TIGER/OSM float geometry; a metric buffer for near-boundary roads is still owed (see remains).

---

## 4. Descriptor decision — what is lost

**Decision: generalize OSM intake descriptors from the county registry; keep hand-authored descriptors for non-OSM overlays.**

Six hand-authored factories today (two counties, one city):

| Descriptor | FIPS | Source |
|---|---|---|
| `bastropRoadIntakeDescriptor` | 48021 | Overpass |
| `elginOsmRoadIntakeDescriptor` | 48021 | Overpass (city-scoped adapter id) |
| `bastropCountySurveyedRoadDescriptor` | 48021 | ArcGIS StreetsSurveyed2016 |
| `bastropCountyRoadwayDescriptor` | 48021 | County Roadway MapServer |
| `caldwellOsmRoadIntakeDescriptor` | 48055 | Overpass |
| `caldwellCadRoadIntakeDescriptor` | 48055 | Caldwell CAD centerlines |

`roadIntakeDescriptorFromCountyRegistry` (`descriptor-from-registry.ts`) derives tenant `breadth_{fips}_{slug}`, key, displayName, DEFAULT ROW table, adapter `road-intake-osm-geofabrik-pbf`.

**What is lost by generalizing OSM:**
- Per-city `sourceAdapter` identities (`road-intake-elgin-osm`, `road-intake-caldwell-osm`) and display names. Atom-level FIPS/tenant for Elgin already were `48021` / `breadth_48021_bastrop` — city-scoped identity had no separate atom-key consequence.
- Any future per-jurisdiction ROW width table that diverges from DEFAULT. Today Bastrop and Elgin tables are byte-identical to `DEFAULT_ASSUMED_ROW_WIDTH_FT` (adversarial review confirmed; this attack did not land for the flagship county).
- Fine-grained Overpass provenance on already-served atoms if a re-ingest upserts under the new adapter/URL without a retirement contract.

**What is NOT lost (must keep hand-authored):** county surveyed, county roadway, Caldwell CAD — these carry synthetic way-id offsets (900M / 800M / 700M), different geometry parsers, and higher `countyProvenanceRank` in labeling. They remain per-source descriptors.

---

## 5. What breaks among existing consumers

| Consumer | Disturbance under statewide model |
|---|---|
| `labelEdgesFromRoads` | **Hard scale problem.** O(edges × roads × polyline verts), 25 m threshold, no spatial index. Projection sits **inside** the per-edge loop. At Bastrop county extract size (23,954 highway ways) ≈ 1.55M distance ops per 6-edge parcel. Warm batch and site-plan export both call it with the full county roster. Statewide road counts make this a different problem; needs bbox/grid prefilter + hoist projection. |
| Depth-warm road load | Full county `SELECT ... countyFips=` into memory — survives identity-wise, fails on size/CPU without prefilter. |
| `relabelBoundaryEdgesFromRoadLabels` | Rebuilds `roadNodeId` from local FIPS + osmWayId — compatible with the ruling. Latent: classification fallback when osmWayId misses. |
| `central-tx-tally` | `split_part` on id still works; counts inflate for multi-county ways. |
| Retrieval `/road-nodes/:id/atom-chain` | Regex still holds. Same osmWayId under N FIPS prefixes are N distinct ids. |
| Synthetic way-id offsets 700M/800M/900M | **Pre-existing landmine, worsened by scale.** Real Bastrop OSM ids already reach ~1.55e9; reviewer measured 65.3% of county OSM ways fall inside those bands. `isCountySyntheticWayId` is true for ~35% of real OSM ways. Mint collision = silent atom overwrite. Must re-namespace before overlay re-ingest coexists with full OSM. |
| PE / site-plan `facingRoad` | Survives if warm roster stays county-filtered. |
| Jurisdiction tenant slug | `Bastrop County` → `breadth_48021_bastrop` matches hand-authored. Residual: unvalidated registry name variants mint new tenants. |

---

## 6. One-county proof vs known-good (verbatim)

Method (not tuned to agree after first compare):

1. Stream Geofabrik `texas-latest.osm.pbf` (MD5-matched) with pyosmium.
2. Keep `highway=*` ways intersecting TIGER Bastrop 48021 polygon (vertex / midpoint / every-edge segment-cross).
3. Compare the PBF extract restricted to `BASTROP_CITY_BBOX` against committed Overpass fixture `bastrop-overpass-city-bbox.json` (4,893 highway ways).

Extract stats (verbatim):

```json
{
  "waysSeen": 11649356,
  "highwayWays": 4028297,
  "keptIntersectingCounty": 23954,
  "skippedNoLocation": 0,
  "elapsedSec": 217.95
}
```

Compare counts (verbatim from `_inbox/2026-08-08_STATEWIDE_ROADS_bastrop_compare.json`):

```json
{
  "pbfCountyHighwayWays": 23954,
  "pbfIntersectingCityBbox": 4896,
  "cityFixtureHighwayWays": 4893,
  "intersection": 4893,
  "onlyInCityFixture": 0,
  "onlyInPbfCityBbox": 3,
  "highwayTagMismatchesOnIntersection": 0
}
```

Recall vs city fixture: **1.0**. Precision: **0.99939**. Three PBF-only extras (newer OSM, all `highway=service`, unnamed): `1545324609`, `1545324610`, `1545324611`. Zero highway-tag mismatches on the intersection.

### Honest limits of this proof (do not oversell)

- City bbox lies **entirely interior** to Bastrop County (adversarial measurement: **0** county-ring vertices inside the city bbox). The proof therefore does **not** exercise the boundary-running / three-county ruling geometry. It proves PBF+county-filter reproduces city Overpass interior coverage; it does not prove the hard case.
- Known-good is the **city** Overpass fixture, not a county-tiled Overpass roster (~14k comment figure was never compared live).
- Bare `highway=*` keep includes service/pedestrian/proposed/construction. Reviewer composition of the 23,954: ~65.8% `service`, ~11.1% pedestrian-class, 64 proposed/construction; ~5,143 plausible public street ROW. Intake taxonomy filter is still owed.
- No live `atoms` table comparison under this lane (no production write; SELECT-only was not scheduled).

---

## 7. Adversarial reviewer verdict (verbatim)

Reviewer agent: [Adversarial roads review](71b80415-5c83-4205-b62b-2823c06441c9). Reviewed against the mid-lane draft (including the since-fixed ring decimation). After the review, planner landed PR #288 with every-edge crossing and strengthened both-sides / middle-leap tests; several must-fix items remain open (listed §8).

### VERDICT

**REFUTED.**

(Reviewer's own framing targeted the draft before commit; several file-absent findings were true at review time because the branch was unclean mid-session. PR #288 subsequently landed the TS modules. Geometric and consumer attacks remain valid.)

### Per claim

| Claim | Grade | Strongest attack that landed |
|---|---|---|
| A County-crossing ruling | WEAK | Three-county synthetic test was vertex-inside only; tally double-counts physical roads; unresolved basis unused |
| B Boundary-running roads | **BROKEN** (draft) | Stepped ring sampling skipped edges (~23% miss on Bastrop); both-sides invariant was tautological `>=1`. **Draft fix applied in PR #288 (every edge + assert both FIPS).** Near-boundary metric buffer still open. |
| C One-county proof | **BROKEN** as proof of the ruling | City bbox contains zero county-ring vertices; recall 1.0 measured where the algorithm cannot fail the hard case |
| D Consumer overlook | **BROKEN** on two | Synthetic id band collision (65.3% of OSM ids); `labelEdgesFromRoads` cost at county scale |
| E Descriptor generalization | WEAK | ROW table unchanged on flagship; re-ingest/retirement contract unspecified; mutable `texas-latest` URL |

### Closing paragraph (verbatim, for quotation)

> The county-crossing ruling is not ready for a statewide run, and the review could not even be conducted as framed: three of the eight artifacts, including both TypeScript modules and the entire test file, are absent from disk, the engine repo is clean with nothing staged, and vitest collects eight test files in `src/road-intake/__tests__/` of which `way-to-county.test.ts` is not one, so no test in this program has ever executed. The ruling's central mechanism, segment-cross detection catching roads that even-odd ray casting places outside, is broken by a sampling loop that skips ring edges rather than approximating them, and on the real Bastrop polygon this drops 66.7% of the boundary and misses 23% of exactly-on-line road segments and 58% of bulge-clipping cases, which is roughly 46 km of Bastrop's own county line where a boundary-running road is invisible. The one-county proof cannot detect any of this because the comparison window contains zero county-ring vertices and is derived from the county-kept set itself, so recall 1.0 was measured precisely on the interior subset where the algorithm cannot fail. The headline figure is also not what it appears: of the 23,954 kept ways, 65.8% are `highway=service`, 11.1% are pedestrian classes, and 64 are `proposed` or `construction` roads that do not exist, leaving about 5,143 plausible public street rights of way. Two consumer defects are quantified rather than hypothesised: 65.3% of real Bastrop OSM way ids fall inside the 700M/800M/900M synthetic bands so `isCountySyntheticWayId` is true for 35% of genuine ways, and `labelEdgesFromRoads` re-projects every road polyline inside its per-edge loop against an unfiltered county roster, costing about 1.55 million distance operations per parcel at county scale and threatening the sub-$200-per-jurisdiction commitment directly. Two attacks did not land and should not be relitigated: the depth-warm roster is filtered by `countyFips` so full-centerline duplication cannot contaminate a neighbouring county's parcels, and the Bastrop and Elgin hand-authored ROW tables are byte-identical to `DEFAULT_ASSUMED_ROW_WIDTH_FT`, so registry generalisation changes no served geometry on the flagship county. What generalisation does leave unspecified is the re-ingest contract, which currently risks either overwriting the served Bastrop atoms' provenance and orphaning Overpass-era ways or wiping the county-surveyed and county-roadway overlays that outrank OSM in labeling. Hold the statewide run until items 1 through 7 are closed and the one-county proof is re-run on a window that actually straddles a county line.

Planner note on that paragraph: items 1 (land code) and the every-edge part of item 2 are addressed by PR #288; the rest of the must-fix list stands.

---

## 8. What remains before a statewide run

1. **Boundary-window proof.** Re-compare PBF extract against known-good on a bbox that straddles Bastrop/Caldwell and Bastrop/Travis (and ideally Lee). Interior city recall is not sufficient.
2. **Metric near-boundary buffer.** Exact collinearity does not occur between TIGER and OSM; roads a few metres off the line must resolve deterministically to both adjacent counties when appropriate.
3. **Spatial index for `labelEdgesFromRoads`.** Hoist polyline projection out of the per-edge loop; prefilter by bbox/grid before distance. Non-negotiable at 24k+ roads/county.
4. **Re-namespace synthetic way ids** out of the real OSM id space (700M/800M/900M collide today).
5. **Intake taxonomy.** Decide fate of `highway=service`, pedestrian classes, `track`, `proposed`, `construction` before fabricating ROW edges statewide.
6. **Re-ingest contract.** Upsert vs replace-by-countyFips; retirement of Overpass-era absences; protection of county-overlay atoms (rank 2/3).
7. **Pin Geofabrik dated snapshot + MD5** on every atom citation (not mutable `texas-latest`).
8. **MultiPolygon counties + hole parity** in the extract path (coastal counties); load 254 county polygons into engine from LDT/TIGER.
9. **Dual coverage accounting** in tallies (per-county road-nodes AND distinct `osmWayId`).
10. **Product PBF reader** chosen and wired (Python worker vs native) — proof used out-of-tree pyosmium.
11. **No statewide production ingest** until 1–6 clear; then dry-run predicts apply under slot discipline.

---

## Artifacts

| Path | Role |
|---|---|
| `_inbox/2026-08-08_STATEWIDE_ROADS_program_report.md` | This report |
| `_inbox/2026-08-08_STATEWIDE_ROADS_bastrop_compare.json` | Verbatim compare counts |
| `P:\tmp\statewide-roads\texas-latest.osm.pbf` | MD5-verified Geofabrik cache |
| `P:\tmp\statewide-roads\bastrop_48021_county.geojson` | TIGER 48021 polygon |
| `P:\tmp\statewide-roads\bastrop_48021_pbf_highways.json` | County extract (23,954 ways) |
| `P:\tmp\statewide-roads\extract_bastrop_highways.py` | Proof extractor (every-edge) |
| hauska-engine PR #288 | Resolver + registry descriptor |
