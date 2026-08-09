---
title: "DEFECT — MultiPolygon / interior-ring truncation in parcel-geometry-resolver"
date: 2026-08-08
status: diagnostic-report
repo: hauska-engine
sha: dba7a8291a4545daa3a14e8aa5779827b9778533
author: diagnostic-executor (read-only)
---

# DEFECT: MultiPolygon truncation and interior-ring drop in parcel-geometry-resolver

Repo: `P:\hauska-engine` at SHA `dba7a8291a4545daa3a14e8aa5779827b9778533` (origin/main). All diagnostics below are read-only. No database writes. No branch changes. No commits.

## Headline

- Blast radius (statewide, txgio_parcel, 5,535,897 rows): **18,548 MultiPolygon rows (0.34%)** and **18,637 Polygon rows with 2+ rings, i.e. interior rings/holes (0.34%)** — combined roughly **37,000 rows / ~0.67%** of the corpus have geometry that this resolver silently truncates. Bastrop County (48021) specifically: only **5 of 74,729 rows (0.007%)** are MultiPolygon; Polygon-with-holes count for 48021 was not separately queried (see "WHAT I COULD NOT DETERMINE").
- **None of the 12 operator-twelve parcels and none of the 7 block13 parcels are affected.** All 19 are `Polygon` type with exactly 1 ring (single exterior ring, no holes, no multi-part). The 12/12 and 7/7 certified results are NOT measuring truncated geometry.
- The defect is confirmed silent: no log, warn, or recorded signal anywhere in the resolver or its callers when truncation occurs.
- A second, independently-implemented copy of the identical bug exists at `packages/engine-core/src/boundary-primitive/adjacency-grid.ts:110-126`.

---

## 1. Exact current behavior

Full function, `packages/engine-core/src/parcel-terrain/parcel-geometry-resolver.ts` lines 66-91 (verbatim):

```ts
/**
 * Exterior ring only (first ring of the first polygon) for Polygon /
 * MultiPolygon GeoJSON. Returns null rather than guessing for other geometry
 * types (e.g. Point) — a site-plan PROPERTY_LINE layer must not draw a
 * fabricated ring.
 */
function exteriorRingFromGeoJson(geometry: unknown): Array<[number, number]> | null {
  const geom = geometry as { type?: string; coordinates?: unknown } | null;
  if (!geom || typeof geom !== "object") return null;
  if (geom.type === "Polygon") {
    const rings = geom.coordinates as unknown;
    const exterior = Array.isArray(rings) ? rings[0] : null;
    return Array.isArray(exterior) && exterior.length >= 3
      ? (exterior as Array<[number, number]>)
      : null;
  }
  if (geom.type === "MultiPolygon") {
    const polygons = geom.coordinates as unknown;
    const firstPolygon = Array.isArray(polygons) ? polygons[0] : null;
    const exterior = Array.isArray(firstPolygon) ? firstPolygon[0] : null;
    return Array.isArray(exterior) && exterior.length >= 3
      ? (exterior as Array<[number, number]>)
      : null;
  }
  return null;
}
```

Called from `TxgioDatabaseParcelGeometryResolver.resolve()` (lines 109-125):

```ts
async resolve(parcelNodeId: string): Promise<ResolvedParcelGeometry | null> {
  const parsed = parseParcelNodeId(parcelNodeId);
  if (!parsed) return null;
  const row = await this.query(parsed.countyFips, parsed.propId);
  if (!row || !validBbox(row)) return null;
  const ring = exteriorRingFromGeoJson(row.geometry) ?? undefined;
  return {
    bbox: { westLng: row.westLng, southLat: row.southLat, eastLng: row.eastLng, northLat: row.northLat },
    sourceRef: `txgio-parcel:${parsed.countyFips}:${parsed.propId}:${row.sourceVintage}`,
    ring,
  };
}
```

And from `ArcGisParcelGeometryResolver.resolve()` (lines 159-176), same `exteriorRingFromGeoJson` call on the first feature's geometry.

Confirmed behavior by geometry shape:

- **(a) Polygon, one ring.** Correct. `rings[0]` is the (only) exterior ring. No data loss.
- **(b) Polygon, interior rings/holes.** `geom.coordinates` for a Polygon-with-holes GeoJSON is `[exteriorRing, hole1, hole2, ...]`. The function returns `rings[0]` only — the exterior ring is preserved, but every hole is silently dropped. Downstream code treats the parcel as if it had no interior voids (no easements-as-holes, no donut parcels, no water-body cutouts represented as holes). This is a hole-loss defect, not a boundary-loss defect: the exterior footprint is intact but interior void geometry vanishes.
- **(c) MultiPolygon, N parts.** `polygons[0][0]` — only the exterior ring of the FIRST polygon part is returned. Every other part (2nd, 3rd, ... Nth polygon in the MultiPolygon) is discarded entirely, including its own exterior ring and any holes it has. For a legitimately multi-part parcel (e.g., two non-contiguous tracts under one prop_id, or a parcel split by a right-of-way), the served/warmed/certified geometry represents only one physical piece of the parcel.
- **(d) Other geometry types** (Point, LineString, GeometryCollection, null, malformed). Falls through to `return null`. The caller then sets `ring: undefined` (not an error) — `ResolvedParcelGeometry.ring` is documented as optional, and per its own docstring in `author.ts` (lines 22-28), "any site-plan PROPERTY_LINE consumer must fail closed rather than approximate a ring from the bbox rectangle." So other-type geometry fails closed correctly. Polygon and MultiPolygon do NOT fail closed when they have extra rings/parts — they silently succeed with partial data.

**Does it log, warn, or record any signal that truncation occurred?** Confirmed: **no.** Grepped the full file and its call sites (`Grep` for `console\.|logger\.|warn\(` in `parcel-geometry-resolver.ts` and in `author.ts`'s `authorParcelTerrainExport`) — zero matches tied to ring/geometry truncation. The function has no branch that checks `rings.length > 1` or `polygons.length > 1` and reports it; it simply indexes `[0]` and returns. `ResolvedParcelGeometry.sourceRef` and the atom's checksum carry no truncation flag either.

Existing test coverage (`packages/engine-core/src/parcel-terrain/__tests__/parcel-geometry-resolver.test.ts`, all 4 tests) uses only single-ring rectangle fixtures for both Polygon and the ArcGIS Polygon path. There is no test for MultiPolygon at all, and no test for Polygon-with-holes. The truncation path is completely unexercised by the suite.

---

## 2. Who calls it

**Direct constructors of `TxgioDatabaseParcelGeometryResolver`:**

| File | Line | Context |
|---|---|---|
| `packages/engine-core/scripts/depth-warm-bastrop-batch.mjs` | 282 | Bastrop depth-warm batch pipeline |
| `packages/engine-core/scripts/depth-warm-elgin-batch.mjs` | 200 | Elgin depth-warm batch pipeline |
| `packages/engine-core/scripts/depth-warm-caldwell-batch.mjs` | 139 | Caldwell depth-warm batch pipeline |
| `packages/engine-core/scripts/diagnose-class-b-recompute.mjs` | 30 | Diagnostic script |
| `packages/engine-core/scripts/probe-s2f-labels.mjs` | 18 | Diagnostic script |

**Via `createParcelGeometryResolverFromEnv()`:**

| File | Line | Context |
|---|---|---|
| `services/engine-api/src/routes/parcel-terrain.ts` | 245 | `buildParcelTerrainRoutes()` default resolver arg — the live engine-api serve path for terrain-export refresh/export (POST/GET `/:parcelNodeId/terrain-export*`) |

`services/engine-api/src/routes/parcel-terrain.ts` also imports `authorParcelPropertyDossierExport` and `authorParcelSitePlanExport` from `@hauska-engine/engine-core/site-plan` (lines 19-20) — the site-plan author (`packages/engine-core/src/site-plan/author.ts` line 267) calls `options.resolver.resolve(options.parcelNodeId)` and at line 273 does `const ringWgs84 = options.ringOverride ?? resolved.ring;`. When no `ringOverride` is supplied by the caller, the resolved (possibly truncated) ring flows directly into the site plan / property-line export.

**Pipelines that depend on it, traced by usage of `geomResolver.resolve()` output:**

- **Depth-warm (the ground-truth/cert pipeline).** `packages/engine-core/scripts/depth-warm-bastrop-batch.mjs` line 613: `const geom = await geomResolver.resolve(parcelNodeId);`. Lines 614-637 carry a 2026-08-07 comment block ("SERVE-CONSISTENCY PRINCIPLE... master planner ruling — amends the Ground-Truth Frame Law") that explicitly pins `rawParcelRing = geom.ring` as **the truth frame the ground-truth predicate and write-then-verify measure against**, and states this "MUST NOT be reassigned" by any later BCAD re-fetch. `rawParcelRing` is then threaded through `verify-mechanical.ts`'s `verifyWarmCandidateMechanically` (via `WarmCandidate.rawParcelRing`, `depth-warm-bastrop-batch.mjs` lines 763-812) as the mechanical-verification reference ring. **This is the direct confirmation of the severity claim: the same truncated ring is both the warmed geometry and the ground-truth reference used to verify it — there is no independent re-derivation that could catch the truncation.**
- **Cert grade (block13 / registry).** `packages/engine-core/src/registry/cert-grade-core.ts` does NOT call the txgio resolver — it fetches BCAD ArcGIS rings independently via `fetchBcadParcelRings` (line 329) and uses `scrubLotLineRing`. Cert grading is a parallel BCAD-sourced instrument, not a consumer of `TxgioDatabaseParcelGeometryResolver`. It is not directly exposed to this defect, but per the "SERVE-CONSISTENCY PRINCIPLE" ruling above, BCAD is explicitly demoted to a currency cross-check only — txgio (via this resolver) is the truth frame the product serves and the ground-truth predicate ultimately measures against in the depth-warm pipeline.
- **Terrain export.** `packages/engine-core/src/parcel-terrain/author.ts` `authorParcelTerrainExport` — resolver injected, `resolved.bbox` used for DEM fetch; ring is not currently consumed by terrain export (bbox-only), so terrain export itself is at lower risk, but it shares the same resolver/truncation.
- **Site plan / property-line export.** `packages/engine-core/src/site-plan/author.ts` line 267/273 — `resolved.ring` becomes `ringWgs84`, the PROPERTY_LINE layer geometry for DXF/IFC/PDF site-plan exports, unless a caller supplies an explicit `ringOverride`.
- **Serve path (engine-api).** `services/engine-api/src/routes/parcel-terrain.ts` — the only live HTTP route wiring for this resolver; both terrain-export and site-plan/dossier routes in this file are reachable via this resolver when no override is passed.

---

## 3. Blast radius — the key number

Source: **direct read-only SQL query against the live txgio_parcel table** (credential per `90_runbooks/factory_onboarding_runbook.md` — `DEPLOYMENT_DATABASE_URL` secret, `legacy-design-tools-prod` project, Neon `neondb`). This is a real census, not a sample.

```
TOTAL ROWS: 5,535,897

BY GEOM TYPE (ALL COUNTIES, statewide):
  Polygon:      5,517,349
  MultiPolygon:    18,548   (0.335%)

BASTROP 48021 BY GEOM TYPE:
  Polygon:  74,724
  MultiPolygon:  5   (0.0067%)

MULTIPOLYGON PART-COUNT DISTRIBUTION (statewide, top of the tail):
  2 parts: 14,744   3 parts: 1,734   4 parts: 559   5 parts: 314
  6 parts: 410      7 parts: 28      ...            51 parts: 396
  (full distribution up to 54 parts in the raw query log)

POLYGON RING-COUNT DISTRIBUTION (statewide — ring count 1 = no holes):
  1 ring (no holes): 5,494,731
  2 rings (1 hole):     18,637
  3+ rings:              4,981  (sum of all num_rings >= 3 buckets)
```

So: **18,548 MultiPolygon rows + 18,637 Polygon-with-≥1-hole rows ≈ 37,185 rows, roughly 0.67% of the 5.53M-row statewide corpus**, are geometries this resolver truncates. That is a real but not enormous fraction — it is a long-tail systemic defect (every jurisdiction has some rate of it), not a universal one. For MultiPolygon rows specifically, 14,744 of 18,548 (79%) are only 2 parts, meaning the loss is typically "half the parcel," not a large N-way fragmentation, though the tail (up to 54 parts, hundreds of rows at 51 parts) is severe when it hits.

Counties present in the store (top 19 by row count) were also enumerated; Bastrop (48021, 74,729 rows) is a small slice of the statewide corpus. County-level MultiPolygon/hole breakdowns beyond 48021 were not run (see "WHAT I COULD NOT DETERMINE").

---

## 4. Are any of the proven parcels affected?

**No.** Checked all 19 proven parcels by direct SQL lookup against the live txgio_parcel table (same query pattern the resolver itself uses: county_fips + digit-normalized prop_id, most recent `ingested_at`).

**Operator twelve** (`_inbox/2026-08-07_T1_operator_twelve_roster.json`, the file actually present — no `2026-08-08_...` dated roster file exists in `_inbox`; the `2026-08-07` file is the operator twelve roster and is the one this check used):

All 12 parcels (48021: 31299, 31308, 31317, 31326, 31335, 31344, 31353, 31362, 31371, 31380, 31389, 31398) are `geom_type: "Polygon"` with `top_level_count: 1` (single ring, no holes, not MultiPolygon).

**Block13 seven** (`BLOCK13_ROSTER` constant, `packages/engine-core/src/registry/cert-grade-core.ts` lines 67-75: 48021: 34145, 34121, 34153, 34137, 34169, 34177, 34161):

All 7 parcels are also `geom_type: "Polygon"` with `top_level_count: 1`.

**Conclusion: the 12/12 and 7/7 certified results are not measuring truncated geometry.** Both proven rosters happen to sit entirely within the ~99.3% of the corpus this resolver handles correctly. This is not evidence the resolver is safe generally — it is evidence the specific 19 parcels the portfolio has certified so far were not exposed to the bug by chance of their own shape, not by any gate that would have caught the shape if they had been multi-part.

---

## 5. Fix shape (characterization only — not implemented)

Downstream code assumes a single ring throughout the geometry stack: `openRing`, `projectRing`/`projectRingInFrame` (single shared parcel projection frame per the OPS-1 runbook's own description), the polygon-inset offset core (`geometry/polygon-inset.ts`), per-edge inset (`depth-warm/measure-inset.ts`), and edge labeling (`depth-warm/edgeLabeling.ts`) all operate on `Ring = Array<[number, number]>`, one array, not `Ring[]` or a polygon-with-holes structure. Every one of these would need a data-model change — from "one ring per parcel node" to "one or more rings (with hole nesting) per parcel node, possibly across disjoint parts" — to correctly support (b) and (c). That is a nontrivial structural change: setback computation, front/rear/side edge labeling, and the offset core are all written against the "a parcel is one closed loop" assumption, and holes in particular change the topology of inset offsetting (an interior ring needs an outward, not inward, offset direction, and setback-from-hole-edge is a different planning question than setback-from-lot-line).

**Recommendation: fail closed, do not implement multi-ring support as the near-term fix.**

Reasoning:

1. **The blast radius does not justify the structural cost right now.** At ~0.67% statewide and effectively 0% observed in the two counties actually certified so far (Bastrop MultiPolygon rate is 0.007%, 5 rows out of 74,729), a full multi-ring/multi-part data model change is disproportionate engineering spend against the cost-per-jurisdiction discipline, for a shape that has not yet been shown to appear in any onboarded/warmed jurisdiction's promoted set.
2. **The honest-absence doctrine is a direct match.** The portfolio's own standing rule (memory: `factory-product-serve-disconnect` and the broader honest-absence posture used throughout OPS-1/OPS-9) is that an honest decline is acceptable and a silent partial answer is not. A parcel with MultiPolygon geometry or interior rings should be recognized at resolve time and produce an explicit decline (e.g., a new decline reason like `multi-part-geometry-unsupported` or `interior-ring-unsupported`), not a `ring` value that looks like a complete, valid single-ring parcel to every downstream gate.
3. **Today's gates cannot see the difference, which is the actual defect.** Because `ResolvedParcelGeometry.ring` is typed identically whether it came from a clean single ring or a truncated multi-part/holed geometry, write-then-verify, the ground-truth predicate, block13, and the area-sweep cert all measure against the resolver's own (already-truncated) output — as the depth-warm batch script's own "SERVE-CONSISTENCY PRINCIPLE" comment confirms is deliberate (txgio is pinned as the truth frame). A fail-closed decline converts an invisible defect into a visible, countable one (a decline bucket), which is exactly the shape every other honest-absence path in this pipeline already takes.
4. **Minimum viable fix, concretely:** in `exteriorRingFromGeoJson` (or one level up, in `resolve()`), detect `MultiPolygon` with `coordinates.length > 1` and `Polygon` with `coordinates.length > 1`, and return a typed signal (not `null` silently folded into "no ring") that the caller turns into an explicit decline rather than a `ring` value. This is a small, local, low-risk change — it does not require touching the offset core, edge labeling, or any of the single-ring-assuming downstream modules, because those modules simply never receive a ring for these parcels going forward. It also does not retroactively invalidate the operator twelve or block13 sevens, since none of them are affected.
5. **Multi-ring support, if ever wanted, should be a deliberate follow-on** scoped as its own workstream once there is a real jurisdiction where the observed rate is high enough to matter (e.g., a coastal or heavily-platted county where donut/multi-tract parcels are common), not built speculatively against a 0.67% statewide tail.

---

## 6. Related truncation

Grepped `packages/engine-core/src` for `[0]` indexing on geometry/coordinate/feature/ring/polygon-shaped values (excluding tests). Findings beyond the reported defect:

- **`packages/engine-core/src/boundary-primitive/adjacency-grid.ts:110-126`** — `exteriorRingFromGeoJson` in this file is an **independent, near-identical reimplementation of the exact same bug**:
  ```ts
  export function exteriorRingFromGeoJson(geometry: unknown): Ring | null {
    ...
    if (g.type === "Polygon" && Array.isArray(g.coordinates?.[0])) {
      return g.coordinates[0].map((c) => [c[0]!, c[1]!] as [number, number]);
    }
    if (g.type === "MultiPolygon") {
      const mp = g.coordinates as number[][][][] | undefined;
      const ring = mp?.[0]?.[0];
      if (!Array.isArray(ring)) return null;
      return ring.map((c) => [c[0]!, c[1]!] as [number, number]);
    }
    return null;
  }
  ```
  Same-named function, same shape of truncation (Polygon `[0]` = exterior only, MultiPolygon `mp[0][0]` = first part's exterior only), living in the boundary-primitive/adjacency module rather than parcel-terrain. This means the fix needs to land in (at minimum) two places, or be consolidated into one shared utility, or both call sites will independently need the same fail-closed treatment.

- **`packages/engine-core/src/boundary-primitive/lot-line-scrub.ts:576`** — `const coords = feature.geometry?.coordinates?.[0];` inside the BCAD ArcGIS-fetch parser. This is parsing a single BCAD feature's own geometry (Polygon assumed), same exterior-ring-only assumption as the primary defect, on the currency cross-check data path (see section 2 — BCAD ring, not the txgio truth frame, per the SERVE-CONSISTENCY ruling). Lower severity given BCAD's demoted role, but the same shape of bug.

- **`packages/engine-core/src/warden/envelope-sanity.ts:100-105`** — `extractEnvelopeRingFromGeojson` reads `features?.[0]?.geometry?.coordinates`, then `coordinates[0]`. This reads the engine's OWN previously-authored envelope geojson output (not source parcel geometry), so it is truncating the engine's own single-feature/single-ring output rather than an upstream multi-part source — lower direct relevance to this defect, but worth noting as the same "always take index 0" pattern recurring a third time.

- **`packages/engine-core/src/registry/cert-grade-core.ts:551,558`** — `envRow?.body?.geojson?.features?.[0]?.geometry?.coordinates?.[0]` — same pattern as envelope-sanity.ts, reading the engine's own previously-persisted envelope atom, first feature/first ring.

- **`packages/engine-core/src/site-plan/flood-drainage-study.ts:402,474`** and **`packages/engine-core/src/site-plan/pdf/flood-drainage.ts:315`** — each does `coordinates[0]` / `feature.geometry.coordinates[0]` when parsing FEMA flood polygon features. These are FEMA flood-layer features, a different upstream source than txgio parcels; not verified against real FEMA MultiPolygon rates in this pass (FEMA flood zones are commonly MultiPolygon in practice, e.g. detached ponding areas), flagged here as a plausible sibling defect but not quantified.

None of the sibling occurrences beyond `adjacency-grid.ts` were traced further (call sites, blast radius, or whether they sit upstream of a gate) — that would be a separate diagnostic pass.

---

## WHAT I COULD NOT DETERMINE

- **Bastrop-specific interior-ring (hole) count.** The statewide Polygon ring-count distribution (18,637 rows with 2 rings, i.e. 1 hole, plus a smaller tail at 3+ rings) was not broken out by county. I do not have a Bastrop-specific hole count, only the Bastrop MultiPolygon count (5 of 74,729). If Nick needs the Bastrop-specific hole rate, that is one more read-only query away.
- **County-by-county MultiPolygon/hole rates beyond the top-19 county list enumerated.** I pulled the top 19 counties by row count and the two headline stats (statewide and Bastrop-only); I did not run the full per-county breakdown for every county in the store, so I cannot say which specific counties carry the highest concentration of affected parcels.
- **Whether any parcel outside the operator twelve / block13 seven that has already been warmed/promoted in a live depth-warm run (Bastrop, Elgin, Caldwell batches) is MultiPolygon or holed.** I checked only the two named proven rosters, per the task. I did not cross-reference the full promoted set from `depth-warm-bastrop-batch.mjs`, `depth-warm-elgin-batch.mjs`, or `depth-warm-caldwell-batch.mjs` runs against the MultiPolygon/hole row list. That cross-reference (which of the ~37,000 affected statewide rows, if any, have already been warmed and promoted anywhere) is the next question if this needs to become an active incident rather than a characterized defect.
- **FEMA flood-layer MultiPolygon rate**, referenced in section 6 as a plausible sibling defect at `flood-drainage-study.ts` / `pdf/flood-drainage.ts` — not quantified; would need its own source inspection (FEMA NFHL data), separate from the txgio_parcel query used here.
- **Whether `services/engine-api/src/routes/parcel-terrain.ts`'s dossier/site-plan routes are hit in production with real parcel-node traffic today**, versus being reachable-but-unused code paths. I confirmed the wiring (resolver flows into `authorParcelSitePlanExport`), not live traffic/usage volume.
