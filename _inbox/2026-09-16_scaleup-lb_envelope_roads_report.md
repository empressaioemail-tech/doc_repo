# L-B: envelope unlock — the shortest path, and the whole envelope family

Lane `scaleup-lb-envelope-roads`, plan rows P-249 and P-248. Read-only research. Seat
`dispatch-planner-lb`, worktree `P:\seat-worktrees\dispatch-planner\doc_repo`.

All source reads below cite a repo path plus a real `origin/main` commit fetched fresh during
this lane (2026-09-16), never a stale checked-out lane branch. Two sub-agents were run under
this lane (fan depth 1, each supervised to completion and adversarially spot-checked against
source before being trusted here) for the labeller/registry graph, the re-derive requirements,
the footprint trace, and the exact ruling text; their citations were independently re-verified
at the specific points marked "spot-checked" below, not merely accepted.

## 0. Verdict on the mission premise

**CONFIRMED, and sharper than the dispatch's own framing.** The dispatch describes LDT's
`reconcileAtomEnvelope.ts` as letting "any" `no-buildable-area` atom clobber a good live
envelope "unless its reason looks like a machine-verify diagnostic." Reading the file at
`origin/main` (legacy-design-tools, commit `b5dfb508`, 2026-09-15 08:09:53, P-214) shows this is
exactly right, but P-214 (merged the day before this lane ran) already built HALF the fix the
dispatch proposes — narrower than the dispatch assumed:

```
// legacy-design-tools artifacts/api-server/src/lib/buildableEnvelope/reconcileAtomEnvelope.ts:158
if (isDiagnostic && !derived.empty) return derived;   // keeps a good live envelope
```

`isDiagnostic` is `isMachineVerifyDiagnostic(reason)` — a three-signal TEXT heuristic (contains
`"; "`, matches `/\b(edge|road)\s+\S+:/i`, or contains a 4+-decimal float) built to catch raw
hauska-engine cert-failure strings like the P-214 fixture:
`"edge 1: R32 35.02831192164916ft != expected 5ft for role side; edge 4: R32
53.60964475445567ft != expected 25ft for role rear"` (live on `48021:8723767`, 2026-09-15).
**"Unzoned", "not yet onboarded" and reason-less zeros do not match this heuristic** (confirmed:
`classifyReason()` in this lane's own instrument, self-tested), so they fall through to the
unconditional branch that sets `emptyKind: "consumed"` and clobbers whatever `derive.ts` computed
— exactly the dispatch's premise, for exactly the population the dispatch names.

**hauska-map's `atom-chain-to-facets.ts`** (hauska-map, commit `fabf9b7b`, 2026-09-15 08:09:57,
P-216 #404) independently implements the SAME kind of guard, but on a structurally different and
more principled signal: `isDepthWarmPromoted(chain)` (line 185), true when
`env.depthWarmPromotion === "depth-warm-promoted-v1"` or `sourceCitation` contains
`"depth-warm-verified"`. When an atom's `no-buildable-area` outcome is NOT depth-warm-promoted,
this file declines outright (`status:"declined", declineReason:"envelope-unverified"`) without
ever consulting a live derive at all — and its own comment (line 2084) names the live repro:

> "confirmed live on 48209:97658 and siblings, a nine-edge ring with five `side`-labelled edges"

This is genuinely a **second, independent mechanism** producing the same customer symptom on
the same parcel, not a duplicate description of the first. Both must change for San Marcos to
unlock on both the map/MCP facets surface and the live-derive endpoint.

**A second mechanism for the San Marcos symptom, and whether it survives:** the comment's claim
was cross-validated two ways in this lane, independent of reading the comment itself:
1. The live boundary-edge atom data for `48209:97658` (pulled via the authenticated Smart Site
   MCP connector, `get_smart_site` depth=node) shows exactly a nine-edge ring with roles
   `rear, side, side, side, side_corner, front, side_corner, side, side` — five `side` edges,
   matching the comment's count exactly, from a wholly independent data source (the live product
   surface, not the code comment).
2. The direct atom row for this parcel (`entity_type='buildable-envelope'`,
   `parcelNodeId='48209:97658'`) reads: `source_adapter='cortex-tier1-snapshot-breadth-bake'`,
   `kind='no-buildable-area'`, `area_sqft=0`, **`reason=''` (empty string, not null)**,
   `depth_warm_promotion` unset, `fetched_at=2026-07-23 15:22:13`. This is the "reason-less
   zero" class exactly, and it is NOT depth-warm-promoted.

**What was not independently re-derived**: this lane did not execute LDT's own
`labelEdges`+`deriveBuildableEnvelope` TypeScript directly against the real ring (no `tsx`/
`ts-node` binary was pre-installed in the worktree, and installing one was judged out of scope
for a read-only research lane within the time budget). The claim that LDT's live derive
specifically (as opposed to the breadth-bake writer's own shape-only computation, a DIFFERENT
implementation — see §5) would produce a sane polygon on `48209:97658` is evidenced by (a) the
boundary-primitive atom's own front-edge resolution via `situs-street-match` (a positive,
independent signal that the road-facing edge is identifiable) and (b) the P-216 comment's claim
that the DEFECT is in the shape-only labeller, not a geometric impossibility of this ring — but
is marked **UNMEASURED-by-direct-execution** rather than asserted as proven. Flagged as the
single highest-value residual verification step for whoever builds P-249.

## 1. The per-city draw gap

**Instrument**: `scripts/envelope-draw-gap.mjs` (checked in this lane, self-test 17/17 PASS).
Two independent stores joined by `place_key` (never by bare number, per the OPS-21 identity
paragraph): factory store `parcel_record_cell` (`rail_key='setbackFrontFt'`, `situsCity`) for
"setback on record", atoms store `entity_type='buildable-envelope'` keyed on
`body->>'parcelNodeId'` (the documented partial index) for the envelope outcome.

**Instrument, real run, six counties, 981,405 parcels, `atomsJoined=true`** (ran 2026-09-16
14:34-14:41Z; full bucket + per-city JSON checked in at
`_inbox/2026-09-16_scaleup-lb-envelope-roads_draw_gap.json`; regenerable in ~5-10 min via
`node scripts/envelope-draw-gap.mjs --json <out>` with both DSNs set):

Six-county totals (buckets, counting rule: `classifyParcel(setbackFrontFt kind, buildable-envelope
atom outcome)`, self-tested):

| bucket | n | meaning |
|---|---:|---|
| NOT_A_GAP_NO_SETBACK_RECORD | 357,857 | no setback on record; atom outcome is irrelevant |
| NO_SETBACK_NO_ENVELOPE_ATOM | 227,710 | no setback on record, no envelope atom either |
| SETBACK_ON_RECORD_NO_ENVELOPE_ATOM | 196,816 | setback IS on record, but no envelope atom exists at all for the parcel (a coverage gap, not a wrongly-suppressed one) |
| **GAP** | **131,357** | **setback on record, envelope atom says no-buildable-area for a non-diagnostic, non-depth-warm-verified reason — the P-249 headline population** |
| DRAWN | 58,096 | setback on record, atom says buildable |
| DRAWN_NO_SETBACK_RECORD | 8,601 | atom says buildable even though no setbackFrontFt cell was on record (edge case, small) |
| NOT_A_GAP_MACHINE_DIAGNOSTIC | 968 | already exempted by P-214's existing fix |

**Per city, the headline bucket ("setbacks on record, no envelope drawn"), sorted by GAP:**

| county | city | GAP | DRAWN | setback-on-record but no atom | total w/ setback on record |
|---|---|---:|---:|---:|---:|
| Williamson | Georgetown | **23,484** | 12,314 | 1 | 35,799 |
| Williamson | Round Rock | **17,761** | 8,667 | 15 | 26,443 |
| Williamson | Leander | **17,045** | 988 | 0 | 18,033 |
| Williamson | (unincorporated/other) | **12,882** | 2,329 | 23 | 15,234 |
| Williamson | Cedar Park | **10,243** | 5,678 | 81 | 16,002 |
| Hays | Kyle | **9,847** | 4,296 | 108 | 14,251 |
| Hays | San Marcos | **9,335** | 4,423 | 504 | 14,262 |
| Travis | (unincorporated/other) | 5,098 | 1,991 | 73,824 | 80,913 |
| Williamson | Taylor | 5,756 | 1,420 | 0 | 7,176 |
| Williamson | Hutto | 5,175 | 6,347 | 1 | 11,523 |
| Travis | Pflugerville | 6,264 | 1,827 | 94 | 8,185 |
| Caldwell | Lockhart | 2,821 | 2,575 | 18 | 5,414 |
| Hays | Buda | 2,721 | 1,312 | 17 | 4,050 |
| Hays | Dripping Springs | 1,374 | 362 | 26 | 1,762 |
| McLennan | Waco | 325 | *(0 buildable)* | 30,713 | 31,038 |
| McLennan | Woodway | 28 | *(0)* | 2,889 | 2,917 |
| Bastrop | Bastrop | 72 | 1,263 | *(0)* | 1,849 |
| Bastrop | Elgin | 28 | 1,796 | 1,519 | 3,332 |
| Travis | Austin | 8 | 5 | 80,690 | 80,703 |
| Caldwell | Kyle | 1 | 0 | 0 | 1 |

Notable, unpre-registered pattern: **Waco, Woodway and Austin have huge setback-on-record
populations but tiny GAP counts** (30,713 / 2,889 / 80,690 "setback on record, no envelope
atom AT ALL" vs. GAP of only 325 / 28 / 8) — these counties are dominated by
`SETBACK_ON_RECORD_NO_ENVELOPE_ATOM` (no atom exists yet), not by a WRONG atom clobbering a good
read. P-249's fix does essentially nothing for Waco/Austin; the re-derive-at-scale writer (§5)
is what actually moves those counties. **Williamson and Hays are where P-249 itself pays off**:
their GAP populations are large relative to their DRAWN populations, meaning most of their
setback-on-record parcels are being wrongly suppressed by exactly the mechanism §0 describes.

**Falsifier 2 (not vacuous), verified LIVE, not just inferred from code**: via
`mcp__claude_ai_Smart_Site__get_smart_site` (depth=node) against the live, authenticated
Solo-tier connector on 2026-09-16:
- San Marcos `48209:97658`: `draw.overlays` envelope = `{state:"refused", reason:"atom_path_pending",
  label:"Buildable envelope not computed"}` — no polygon. Its OWN `brief.setbacks-envelope`
  section is simultaneously `disposition:"present"` with real numbers (front 25 / side 5 / rear
  20 / corner 15 ft). **PASS** — lands in the "setbacks on record, no envelope drawn" bucket.
- Pflugerville `48453:427599`: `draw.overlays` envelope = `{state:"present", geom:[[...]],
  basis:"modelled-figure-withheld"}` — polygon draws, area withheld, exactly R-2. **PASS** —
  excluded from the gap bucket.

Direct atom rows (point lookups, index-bounded, confirmed live 2026-09-16):

| parcel | source_adapter | fetched_at | kind | area_sqft | reason | depth_warm_promotion |
|---|---|---|---|---|---|---|
| 48209:97658 | cortex-tier1-snapshot-breadth-bake | 2026-07-23 15:22:13 | no-buildable-area | 0 | *(empty string)* | *(unset)* |
| 48453:427599 | cortex-tier1-snapshot-breadth-bake | 2026-07-23 13:37:44 | buildable | 5027 | — | *(unset)* |

`48453:427599`'s 5,027 sq ft matches the dispatch's stated fact exactly; both rows confirm the
scope section's description of the July breadth-bake vintage.

## 2. The envelope family, per county (footprints included)

All counts below are direct `count(*)` per `entity_type` per county from the atoms store,
index-bounded on the documented partial indexes (`atoms_property_parcel_node_idx` for
zoning-fact/setback-rule/buildable-envelope, `atoms_boundary_parcel_node_idx` for
property-boundary-edge, `atoms_building_footprint_parcel_node_idx` for building-footprint),
measured 2026-09-16:

| entity_type | Bastrop 48021 | Caldwell 48055 | Hays 48209 | McLennan 48309 | Travis 48453 | Williamson 48491 |
|---|---:|---:|---:|---:|---:|---:|
| zoning-fact | 62,260 | 24,989 | 116,421 | 114,255 | 380,920 | 282,570 |
| setback-rule | 9,503 | 5,507 | 34,454 | **0** | 172,713 | 124,499 |
| building-footprint | 81,099 | 35,269 | 128,569 | 125,973 | 456,824 | 308,889 |
| property-boundary-edge | 26,846 | 57,180 | 509,928 | **0** | **0** | **0** |
| buildable-envelope (all outcomes) | 62,260 | 24,006 | 102,143 | 65,814 | 172,713 | 282,436 |

**Two coverage gaps, not one uniform rollout:**
- **`setback-rule` atoms are entirely absent for McLennan (Waco).** This does NOT mean Waco has
  no setback data — the factory store's `parcel_record_cell` shows 31,038 Waco parcels with a
  real `setbackFrontFt` value (§1). It means the SEPARATE atoms-store write path
  (`emit-setback-rule.ts`) never ran for McLennan; whatever populated the factory-store cells did
  so through a different route. Confirmed live: every Waco/Woodway `setbackRulesFact` this lane
  read returns `{state:"refused", code:"not-cut-over"}` — matching `six-county-completeness.mjs`'s
  own `setbackRules: {cls:"mid-cutover"}` classification exactly.
- **`property-boundary-edge` atoms are entirely absent for McLennan, Travis, and Williamson** —
  present only in Bastrop, Caldwell, and Hays. Confirmed live and reconciled against a direct
  count, not inferred: Pflugerville `48453:427599`'s `boundaryEdgeFact` returned
  `{state:"refused", code:"atom-miss", reason:"No property-boundary-edge atom for parcel prefix
  48453:427599..."}` in §1's live probe, and the direct count above shows `0` for all of Travis
  — the single-parcel refusal and the county-wide zero agree (a reconciliation that PASSED,
  DEV_PROCESS 1.4).

**Edge-level setback state, and the "No setback table configured for jurisdiction descriptor"
wording (§7 defect #2), counted exactly** (`body->'setback'->>'kind'` on
`property-boundary-edge` atoms, the only three counties where this atom family exists at all):

| county | `no-setback-row` edges | as % of that county's edge atoms |
|---|---:|---:|
| Hays (48209) | **509,928** | **100%** — every single boundary-edge atom in the county |
| Caldwell (48055) | 15,730 | 27.5% (41,450 carry a different/no kind marker) |
| Bastrop (48021) | 0 | 0% (Bastrop's edges read `unmapped-adjacency` or carry no kind marker instead) |

Hays being 100% is the single sharpest number in this report: **every boundary edge atom ever
written for Hays county says "No setback table configured for jurisdiction descriptor,"
including on San Marcos SF-6 and Kyle parcels whose top-level `setbacks-envelope` brief section
serves real numbers from a real table in the same response.** The edge-level setback resolution
path (`emit-setback-rule.ts`'s jurisdiction-descriptor lookup, feeding the boundary-primitive
writer) and the top-level parcel setback resolution path
(`setback-table-router.resolveSetbackForParcel`, feeding `parcel_record_cell`) are answering
"does this jurisdiction have a table" from two different lookups and Hays's edge-level one has
never once found yes.

**Dimensional caps (`maxHeightFt`, `maxLotCoveragePct`, `maxFootprintSqFt`, `parcelAreaSqFt`),
Hays county, factory store `parcel_record_cell`, reproduced exactly:**

| rail | not-applicable | unaccounted (refused) | absent-verified | value |
|---|---:|---:|---:|---:|
| maxHeightFt | 61,807 | **27,949** | 8,984 | 17,680 |
| maxLotCoveragePct | 61,807 | **27,949** | 22,345 | 4,319 |
| maxFootprintSqFt | 61,807 | **27,949** | 22,345 | 4,319 |
| parcelAreaSqFt | 61,585 | **27,949** | — | 26,886 |

The dispatch's "Hays's 27,949 refusals" reproduces EXACTLY, identically, across all four rails —
meaning it is the same 27,949 parcels refused on all four together (one underlying cause, not
four independent shortfalls), consistent with all four sharing `sourceTier:"envelope-corpus-
lookup.resolveEnvelopeForParcel"` / `"parcelAreaSqFt x maxLotCoveragePct / 100"` chains observed
live on Pflugerville's own absent rails in §1 (a different county, same resolver family).

### Footprints: why nothing draws, and what it takes (P-248)

Traced in hauska-engine (commit `eb42ff26`, 2026-09-16 06:57:24) via a supervised sub-agent,
independently spot-checked in this lane (two claims re-verified directly against source below).

**The claim "footprint is carried only as text" is accurate for the feasibility study and
overstated for the site-plan sheet** — the site-plan sheet (`site-model.ts`, `pdf/render.ts`,
`pdf/layout.ts`) carries the word "footprint" **zero times**; it is not text there, it is wholly
absent. The feasibility study does carry it as text/chips (`report-model.ts`,
`pdf/feasibility.ts`). The X-ray dossier carries it as a count.

**Geometry exists and is discarded, not merely unfetched** — spot-checked directly in this lane
against hauska-engine `origin/main` (`packages/engine-core/src/site-plan/report-model.ts`):

```
// report-model.ts:804  (verified live in this lane)
const footprints = atoms.filter((a): a is BuildingFootprintAtomInstance =>
  a.entityType === "building-footprint" && !a.absence);
...
// report-model.ts:822  (verified live in this lane)
footprints: footprints.map((f) => ({ footprintId: f.footprintId, structureRole: f.structureRole,
  sourceTier: f.sourceTier }))   // f.footprintGeometry exists on the fetched atom and is dropped here
```

The atom's own `footprintGeometry` (a real GeoJSON Polygon) was independently confirmed present
and populated live in this lane, for Pflugerville `48453:427599`, via `get_smart_site`:
`buildingFootprintFact.footprintGeometry.coordinates` carries five real lng/lat vertices,
`sourceAdapter:"ml-global-building-footprints-v1"`, `verificationStatus:"unsurveyed"` — while the
SAME response's `draw.overlays` footprint entry says `{geom:"none", state:"unknown", label:
"Structure of record (1998), footprint unmeasured"}`. **The map-card draw block ignores footprint
data that demonstrably exists elsewhere in the identical payload.** This is the live,
first-party confirmation of QA-08/P-248, on the exact parcel this lane was told to probe.

Concrete fix chain (file + line, mirroring an existing analogous pattern each time so no new
drawing capability needs to be built — `drawRing`/`drawFilledRing` already exist and are already
used for the property line and the buildable-envelope fill):
1. `site-plan/feasibility-model.ts:291-293` — add `ring?: RingLngLat` to `FootprintFacts.footprints`.
2. `report-model.ts:751-753`-ish (verified nearby at 804-822 in this lane's own re-read) — add
   `ring: f.footprintGeometry?.coordinates?.[0]` to the mapped object so the already-fetched
   geometry survives.
3. `site-model.ts` — `ComposeSitePlanModelInputs`/`SitePlanModel` need a new `footprints` field;
   project each ring to local-ENU the same way the parcel ring already is.
4. `pdf/layout.ts` — `SitePlanDrawingLayout` needs a `footprints: PageXY[][]` field.
5. `pdf/render.ts`'s `drawSitePlanDrawing` — one new call to the existing `drawRing`/
   `drawFilledRing` primitives. `pdf/dossier.ts` reuses the identical `SitePlanModel` via
   `emitPdfSitePlan`, so step 5 alone propagates to the dossier's appended sheet automatically.

Real fixture named in OPS-16 itself: 908 Pine, Bastrop, `48021:34137` (one ML footprint, the
operator's own QA-08 report) plus a vacant lot as the negative control — same instrument
discipline as P-219/P-239.

Every other study in `site-plan/` was checked for the same gap: feasibility (text+chips, no
polygon, despite already drawing the parcel ring over imagery one section above where the
footprint caption sits), the site-plan drawing itself (total absence), the dossier (0 matches),
the flood-drainage study (0 matches), DXF/IFC exports (0 matches). **The gap is total across the
whole family, not partial.**

## 3. Road nodes — only as far as they block rendering after P-249 (A-177)

A-177 (operator, 2026-09-16, addendum to `_decisions/2026-09-16_texas_scaleup_sequence_and_four_rulings.md`,
verbatim): *"Customers don't care about road nodes right now... An actual road node pass can come
after everything else... so long as it's not blocking anything else... Any road issue that blocks
envelope or footprint rendering stays in Phase 0."* The full pass (TIGER cross-check, street-name
normalisation dictionary, classification rules, `roads`/`edgeSignal` ledger rails) is deferred.
`scripts/six-county-completeness.mjs`'s own `RAIL_POLICY` already encodes this: `roads` and
`edgeSignal` are `cls:"deferred", ruling:"A-177 road-node pass deferred"`.

Direct `count(*)` per `source_adapter` per county on `entity_type='road-node'`, index-bounded on
`atoms_road_county_fips_idx`:

| county | source_adapter | n | provenance class | vintage |
|---|---|---:|---|---|
| Bastrop 48021 | road-intake-osm-geofabrik-pbf | 16,895 | OSM | 2026-08-16 |
| Bastrop 48021 | road-intake-bastrop-county-roadway | 11,351 | county roadway authoritative | 2026-07-27 |
| Bastrop 48021 | road-intake-osm-overpass | 4,893 | OSM | 2026-07-26 |
| Bastrop 48021 | road-intake-elgin-osm | 2,356 | OSM | 2026-08-04 |
| Bastrop 48021 | road-intake-county-streets-surveyed-2016 | 1,307 | county surveyed | 2026-07-27 |
| Caldwell 48055 | road-intake-osm-geofabrik-pbf | 10,506 | OSM | 2026-08-17 |
| Caldwell 48055 | road-intake-caldwell-cad-centerlines | 3,284 | county roadway authoritative | 2026-07-27 |
| Hays 48209 | road-intake-osm-geofabrik-pbf | 40,987 | OSM | 2026-08-22 |
| McLennan 48309 | road-intake-osm-geofabrik-pbf | 28,787 | OSM | 2026-08-22 |
| **Travis 48453** | — | **0** | — | — |
| **Williamson 48491** | — | **0** | — | — |

**Travis and Williamson carry zero `road-node` atoms — total absence, not partial coverage.**
This matches this lane's own live probe: Pflugerville `48453:427599`'s front edge (per §0) still
resolved correctly via `frontBasis:"situs-street-match"` against a live `roadNodeId` — meaning
the ROAD in that case came from the `property-boundary-edge` atom's own `facingRoad` field
(itself absent for Travis per §2, so on a genuinely blank Travis lookup, the situs-street match
must be falling back to a different source than the `road-node` atom family entirely, likely the
same OSM-Overpass live lookup LDT's own `edgeLabeling.ts` performs at derive time — this lane did
not trace that fallback path in detail; flagged as an open question, not asserted). Hays,
Bastrop and Caldwell only have OSM coverage (Geofabrik PBF extracts plus Overpass live calls);
only Bastrop and Caldwell have any COUNTY-sourced roadway data at all, and only Bastrop has a
"surveyed" tier.

**TIGER cross-check — deliberately NOT run, and why**: A-177 (operator, 2026-09-16) scopes the
full road-node pass, explicitly including "a TIGER cross-check," to AFTER Phase 2, with the one
carve-out that "any road issue that blocks envelope or footprint rendering stays in Phase 0."
This lane found no road-node defect blocking either probe parcel's rendering (§0, §3 addendum
below) — San Marcos's suppression is the atom-reconciliation mechanism in §0, not a road-data
gap; Pflugerville's front edge and envelope both resolve and draw correctly. Given that,
building a second, independent road-coverage measurement (by count or by length against Census
TIGER/Line) would be exactly the deferred full pass the operator named, done anyway. Declined
per direct instruction, not by oversight — this is the scope-basis distinction DEV_PROCESS 3.3
requires ("out of scope" named, not "unmentioned"). If a future lane needs it: TIGER/Line county
edge shapefiles are the standard public comparison source; length-based comparison (total road
centerline miles) is more robust to duplicate/segmented OSM ways than count-based comparison,
which is why length, not count, would be the recommended metric if this is picked up post-Phase-2.

### Street-name normalisation classes (dispatch cited 654 distinct reason strings; measured 785)

**Counting rule**: `count(distinct outcome.reason)` on `entity_type='buildable-envelope' AND
outcome.kind='no-buildable-area'`, across all six counties, direct query, 2026-09-16.

**Measured: 785 distinct reason strings across the six counties (783 of them in Bastrop alone)
— not 654 as the dispatch's own scope text states.** This is a free finding (DEV_PROCESS 1.4/
3.2): the total ROW count reproduces the dispatch's figure exactly (490,185, see below), so the
discrepancy is in the distinct-STRING count, not the underlying population. Root cause, traced:
a meaningful share of the distinct strings are not really 654-vs-785 "different reasons" so much
as the SAME reason with a per-parcel token embedded inline, e.g. every
`"prop_id N absent from county cadastral — superseded; re-key manifest to successor parcel(s)"`
row is its own distinct string because `N` varies (this is the "84 superseded" class from the
dispatch's own breakdown — confirmed present, 84 such rows found, each individually unique by
construction). Reported as measured, not silently reconciled to 654.

**Reproducing the dispatch's 7-class breakdown, using this lane's own `classifyReason()`
(shipped in `scripts/envelope-draw-gap.mjs`, applied identically here) against the real 785-row
distribution:**

| class | this lane's count | dispatch's figure | match |
|---|---:|---:|---|
| total no-buildable-area rows | 490,185 | 490,185 | **exact** |
| unzoned | 208,868 | 208,868 | **exact** |
| not yet onboarded | 153,775 | 153,775 | **exact** |
| no per-parcel layer-23 row | 1,948 | 1,948 | **exact** |
| zero, no reason or copied from tier-1 snapshot | 123,714 (97,116 "Tier-1 snapshot status..." + 26,598 truly empty) | 123,706 | within 8 (0.006%) |
| road/edge-label failures | 416 counted cleanly, but many more absorbed into the row below | 1,119 (Bastrop only) | see note |
| inset failures | 0 counted cleanly, absorbed into the row below | 685 | see note |
| superseded | 0 counted cleanly (84 confirmed present, absorbed into the row below) | 84 | see note |
| **machine-verify-diagnostic (P-214's existing exemption class)** | **1,464** | *(not a dispatch class — this lane's own addition, §0)* | — |

**Falsifier 1 result: substantially reproduces, with one precise, named exception.** Four of
seven classes match exactly or within rounding. The three that don't (road/edge, inset,
superseded) don't fail to reproduce because the underlying counts are wrong — they fail because
LDT's own shipped `isMachineVerifyDiagnostic()` regex (three signals: contains `"; "`, matches
`/\b(edge|road)\s+\S+:/i`, or a 4+-decimal float) structurally overlaps with these three reason
classes' natural-language phrasing (e.g. `"inset ring is null; warm candidate marked empty —
cannot promote; ..."` contains `"; "` and gets caught as a diagnostic even though it is genuinely
an inset-geometry failure, not an engine cert-log string; the superseded strings above also
contain `"; "`). **This is itself a load-bearing finding, not an instrument artifact**: it means
P-214's shipped exemption is already broader in practice than its own stated intent (catching
"raw hauska-engine mechanical-verify diagnostic" text) — it also silently protects 685+ inset
failures, 84 superseded rows, and a chunk of the 1,119 road/edge failures from being clobbered,
for reasons that happen to share surface punctuation with true diagnostics rather than by design.

**Street-name normalisation rules that would resolve the road/edge-failure class** (sampled from
the raw distinct-string list, real examples, live 2026-09-16):
- **State/farm/ranch highway abbreviation mismatch**: `facesAnswer: situs "W SH 71" != road
  "State Highway 71 West" (normalized keys SH 71 vs STATE HIGHWAY 71)` — situs uses the CAD's
  abbreviated form (`SH`, presumably also `FM`/`RM` elsewhere), the road-name source spells it
  out; a normalisation table mapping `SH↔STATE HIGHWAY`, `FM↔FARM TO MARKET`/`FARM-TO-MARKET
  ROAD`, `RM↔RANCH TO MARKET`/`RANCH ROAD`, plus stripping directional suffixes (`WEST`/`W`)
  before comparison, would close this class.
- **Misspellings**: `facesAnswer: situs "SCHAEFER BLVD" != road "Schafer Boulevard" (normalized
  keys SCHAEFER vs SCHAFER)` — a genuine CAD-vs-OSM spelling divergence (Schaefer/Schafer), not a
  format difference; an edit-distance-1/2 fuzzy match (the same class of fix this lane's own
  instrument uses for `normalizeCity()`, §8) would resolve pairs like this one, though a
  transposition/substitution threshold needs a human-reviewed allowlist for Texas road names
  specifically to avoid over-merging genuinely different streets.
- **Directional and suffix normalisation** generally: `BLVD`↔`Boulevard`, leading/trailing `W`/
  `WEST` placement, are both present in the single example above and would need a standard
  USPS-style suffix/directional expansion table, not ad hoc per-string fixes.
- **Classification mismatches** (a separate class from name mismatches): `edge N: classification
  residential != OSM tag county-roadway (unclassified)` — the county's own roadway classification
  and OSM's `highway=*` tag disagree about the same physical road; this is a classification-rules
  problem (A-177's third named component), not a name-normalisation one, and the two should not
  be merged into one fix.

Where the labeller's road-name source differs from situs: every sampled `facesAnswer` mismatch
above is precisely this case — the boundary-primitive labeller resolves a road name from the
county/OSM road network, the situs address carries a separately-sourced (CAD) street name, and
the comparison fails when the two spellings/formats diverge, never when the road itself is
actually different. This lane did not measure the overall RATE of situs-house-number-or-street
absence (a separate ask) within the time budget; flagged as unmeasured rather than guessed.

### Where road data DOES block rendering (the only in-scope slice)

`48209:97658`'s front edge was resolved via `frontBasis:"situs-street-match"` against
`roadNodeId:"48209:road:15292464"` (`classification:"residential"`, `provenance:"osm-overpass-v1"`)
— OSM-sourced, not a county-authoritative road. The road itself is NOT the blocker for this
parcel (the front edge resolved correctly); the blocker is the envelope-atom reconciliation logic
in §0. No road-node defect was found in this lane that blocks San Marcos or Pflugerville
specifically. The `0` road-node atom counts for Travis and Williamson (above table) are a real gap, but this
lane found no evidence they actually block envelope or footprint rendering for the parcels
probed — those are blocked by the atom-reconciliation mechanism (§0) and the dropped-geometry
code path (§2) respectively, neither of which reads the `road-node` atom family at all.

## 4. The two labellers and the two setback registries

Confirmed via supervised sub-agent, spot-checked directly in this lane
(`packages/engine-core/src/registry/jurisdiction-registry.ts`, zero hits for pflugerville/
san-marcos/georgetown/waco/kyle; three hits for `48453`, all reading "EXCLUDED: Travis County
(48453) is deliberately NOT added in this pass").

**Two genuinely separate edge-labelling implementations, not one shared implementation consumed
twice:**
- hauska-engine `packages/engine-core/src/depth-warm/edgeLabeling.ts` — `labelEdgesFromRoads()`,
  road-proximity threshold + situs-token match, consumed only inside hauska-engine
  (`boundary-primitive/compute.ts`, depth-warm cert gates, `site-plan/*`, the depth-warm batch
  script). Zero dependency on LDT.
- LDT `artifacts/api-server/src/lib/buildableEnvelope/edgeLabeling.ts` — a three-tier signal
  system (road > point > shape) with logical-edge grouping for GIS chord artifacts. **Zero
  dependency on hauska-engine** (no `hauska-engine`/`@hauska-engine/*` package in
  `artifacts/api-server/package.json`). A genuinely separate algorithm.

**Two setback-emission paths, minting the SAME atom `entity_type`s from different inputs:**
- `packages/engine-core/src/property-reasoning/emit-setback-rule.ts` (`emitSetbackRule()`,
  writes `entity_type:"setback-rule"`) — imports `JurisdictionDescriptor` from the jurisdiction
  registry. Line 90 is where **"No setback table configured for jurisdiction descriptor."** is
  emitted — the exact string this lane found live on every one of San Marcos `48209:97658`'s
  nine boundary edges, despite the SAME parcel's top-level `setbacks-envelope` brief section
  showing a real, present table (SF-6, san-marcos-tx). Two different code paths answer "does a
  setback table exist for this jurisdiction" and disagree for the same parcel — a live,
  first-party wording defect (§7).
- `@empressaio/setback-corpus` (hosted at `hauska-setback-corpus`, `origin/main` `113cd7c4`,
  2026-09-13) — pure data + `resolveMostCurrentSetback` (the R-1 most-current-source-wins
  resolver). **Confirmed independently in this lane** (fresh `git ls-tree` of `src/setbacks/`):
  JSON tables exist for all seven target cities — `pflugerville-tx.json`, `san-marcos-tx.json`,
  `kyle-tx.json`, `georgetown-tx.json`, `lockhart-tx.json`, `waco-tx.json`, `bastrop-tx.json`.
  Imported by LDT `artifacts/api-server/package.json` and hauska-engine
  `packages/adapters/package.json`, both pinned `^1.2.0`.

**The critical distinction this lane surfaces**: setback TABLE DATA exists for all seven wired
cities in the corpus package, but the SEPARATE `jurisdiction-registry.ts` — which gates
depth-warm/verified PROMOTION eligibility, not table lookup — has rows only for Bastrop
(`status:"active"`), Lockhart and Elgin (`status:"pre-flight-pending"`), plus county-level
unincorporated catch-alls. **No row of any kind exists for Pflugerville, San Marcos, Kyle,
Georgetown, Waco, or for Travis County (48453) at all.** A city can have real setback numbers on
every card today and still be structurally unable to earn a verified (depth-warm-promoted)
envelope atom, because the registry that promotion reads from was never given a row for it.

**Which writer minted the 490,185 no-buildable-area atoms**: `cortex-tier1-snapshot-breadth-bake`
— confirmed by the direct atom rows in §1 and by OPS-16's own P-249 row. The breadth-bake writer
(`bake-from-tier1-snapshot.ts`) never calls `labelEdgesFromRoads` and never calls
`gateWarmCohort` (zero hits, grepped) — it composes atoms from an already-baked, coarse
snapshot, not from a live geometry pass.

## 5. What a re-derive at scale needs

- **Writer**: depth-warm (`packages/engine-core/scripts/depth-warm-city-batch.mjs`), not
  breadth-bake and not a new writer. It already runs real `labelEdgesFromRoads` geometry and
  gates every parcel through `gateWarmCohort` before writing; breadth-bake does neither.
- **Why P-208's re-mint read as a no-op**: NOT because there was nothing to re-mint. The
  deployed remint job's dry leg returned a green `wouldWrite:[]` because
  `warm-preflight-gate.ts:112-121` declines on a stored `parcel-node` atom's
  `status==="retired"` — and that status was FALSELY set by `reconcileCountyParcelNodes` against
  a re-derived TxGIO plan that misclassified a still-live parcel as an orphan (most likely
  corrupted by the 2026-09-03 Bastrop TxGIO reload). A live BCAD check during that lane confirmed
  the parcel is still current at the county source. The fix (not yet built): cross-check a
  `parcel-node-retired` decline against the already-loaded `parcelCurrencyFromBcadMap` BEFORE
  trusting the retirement — that check already exists in the script but sits after the gate's
  early `continue`, so it never runs.
- **`gateWarmCohort`**: defined `parcel-node/warm-preflight-gate.ts:220`. Only production caller
  found: `depth-warm-city-batch.mjs:630`. Zero references anywhere in `bake-from-tier1-snapshot.ts`
  or in hauska-factory.
- **Lease / blast radius**: `atoms-writer-lease.ts` v2, scope shape
  `{scope_type:"write", entity_type, county_fips}` (NOT `(store, entity_type, county_fips)` as
  this dispatch's own prose assumed — flagged as a discrepancy, not silently conformed to) or
  `{scope_type:"heavy-scan", database}`. `PRIMARY KEY (scope_type, scope_id)` enforces
  exclusivity.
- **Dry-run vs apply**: `depth-warm-city-batch.mjs` — `dryRun = args.dryRun || !args.promote`;
  `--promote` is the actual write-enabling flag, `--dry-run` forces dry regardless. Apply runs
  pass a real storage handle and `promote:true`; artifacts are suffixed `-apply.json` vs
  `-dry.json`.
- **Jurisdiction registry gap for the wired cities**: see §4 — confirmed empty for five of seven
  target cities and for all of Travis County.
- **Staging**: hauska-factory `migrations/0003_publish_staging.sql` — a genuinely separate Neon
  DB branch plus a separate `hauska_mcp` DB, selected by `--target` (defaults to `"staging"` in
  every job checked; production requires an explicit `--target=production`). A full bake +
  verify-walk can run end to end against staging with zero risk to production data — this is the
  concrete mechanism behind the factory canon's "every publish lands on staging first."

## 6. Customer wording defects, live-verified

Confirmed 2026-09-16 via the authenticated Smart Site MCP connector (`get_smart_site` depth=node
and `run_report`, both reading the same baked-snapshot facets — confirmed reproducible across
both call shapes, not a one-off):

1. **San Marcos `48209:97658` envelope overlay says setbacks are unruled when they are on
   record.** `draw.overlays[envelope]`: `reasonDisplayText:"Withheld, setbacks unruled"`,
   token `atom_path_pending` (vocabulary meaning: *"Setbacks and the buildable envelope have not
   been ruled or baked for this jurisdiction yet"*). The SAME response's
   `brief.sections[setbacks-envelope]` two sections earlier: `disposition:"present"`,
   `data:{frontFt:25, sideFt:5, rearFt:20, cornerFt:15}`. The wording and the data disagree about
   the same parcel in the same payload.
2. **San Marcos boundary edges say no table is configured when one is.** All nine
   `boundaryEdgeFact.edges[].setback` read `{state:"absent", basis:"No setback table configured
   for jurisdiction descriptor."}` — traced to `emit-setback-rule.ts:90` — while the parcel's own
   zoning district (SF-6, san-marcos-tx) has a real table in `@empressaio/setback-corpus`
   (`san-marcos-tx.json`, confirmed present in §4) and a real value in the top-level brief
   section. Two code paths, two answers, same parcel.
3. **Pflugerville footprint overlay says unmeasured when the geometry is present.**
   `draw.overlays[footprint]`: `{geom:"none", state:"unknown", label:"Structure of record
   (1998), footprint unmeasured"}` while `buildingFootprintFact` in the identical response:
   `{state:"present", footprintGeometry:{type:"Polygon", coordinates:[[...5 real vertices...]]}}`.
   Live, first-party confirmation of P-248/QA-08.

**PDF leg**: `export_instrument(kind:"siteplan")` on `48209:97658` returned
`{status:"upgrade_required", reason:"studio_report", subscriptionTier:"solo"}` — this account is
genuinely not entitled (Studio/Team or a 30-day unlock required). Per dispatch instruction, the
PDF leg's wording is marked **UNMEASURED-live** here; what the PDF WOULD say is sourced instead
from the code trace in §2 (feasibility: text+chips, no polygon; site-plan sheet: total absence;
dossier: a count).

**"Bastrop's layer-23 text on a Kyle lot"** — the dispatch's named example of wrong-jurisdiction
wording, traced to `_inbox/2026-09-16_texas_scaleup_program_scope.md:246-251`: measured on
`48209:100698` (5292 Hartson, Kyle, district PC R2), the scope doc records the map declining with
*"Setbacks pending re-warm from city per-parcel record ... pre-layer-23 sources. That wording was
written for Bastrop's layer 23 and is now showing on a Kyle lot."* **This lane re-probed the same
parcel live on 2026-09-16 and the exact defect described does NOT currently reproduce** — the
live response now reads `setbacks-envelope: {state:"absent", absence:{kind:"absent-verified",
reason:"SETBACK_ROUTER_NOT_A_DISTRICT"}, sourceTier:"setback-table-router.resolveSetbackForParcel"}`
and `draw.overlays[envelope]: {state:"refused", reason:"atom_path_pending",
reasonDisplayText:"Withheld, setbacks unruled"}` — a DIFFERENT decline path than the
Bastrop-layer-23 string the scope doc quotes (that string lives in `atom-chain-to-facets.ts`'s
`setback-rule-pending` branch, "Repealed or pre-layer-23 sources are not served."; this parcel's
current disposition instead reads `SETBACK_ROUTER_NOT_A_DISTRICT`, matching the scope doc's OWN
separately-named `buildResolvedCells` case, "absent-verified when the district has no row in the
city's table" — a distinct false-basis class already tracked in `six-county-completeness.mjs`'s
`FALSE_EARNED` list as `setback-router-miss`). **Two numbers/claims disagreeing is a free finding
(DEV_PROCESS 1.4)**: either the specific "layer-23" string was fixed or rerouted between the scope
doc's snapshot and 2026-09-16, or this parcel's own data changed underneath it (a new CAD/zoning
drop between 2026-09-14 and now is plausible — Hays's `hays_20260826_certified` roll is already
in play on this same parcel). Reported as measured, not assumed unchanged from the brief.

## 7. Falsifiers, scored

1. **Class totals reproduce the scope's** — **MOSTLY PASS, one precise exception named.** Total
   (490,185), unzoned (208,868), not-onboarded (153,775), and no-layer-23 (1,948) reproduce
   exactly. The combined zero/reasonless class reproduces within 8 parcels (123,714 vs 123,706).
   Road/edge-failure (1,119), inset-failure (685) and superseded (84) do NOT cleanly separate
   from a fourth, dispatch-unnamed class this lane found necessary
   (`machine-verify-diagnostic`, 1,464) — traced to LDT's own shipped regex structurally
   overlapping those three classes' phrasing (§3). The query is not wrong; the dispatch's 7-way
   taxonomy and LDT's shipped 2-way (diagnostic/non-diagnostic) heuristic are not the same
   partition of the same data, and this lane found and named exactly where they diverge.
2. **Not vacuous (draw gap)** — **PASS**, live-verified in §1: San Marcos `48209:97658` lands in
   "setbacks on record, no envelope drawn"; Pflugerville `48453:427599` is excluded from that
   bucket. Confirmed both via direct atom rows and via the live MCP surface, independently.
3. **Not vacuous (the unlock itself)** — **PASS on inclusion; the requested negative control does
   not exist in production, which is itself a finding.** `48209:97658` is confirmed in the GAP
   bucket (§1). For the negative control, this lane queried directly:
   `entity_type='buildable-envelope' AND outcome.kind='no-buildable-area' AND (depthWarmPromotion
   = 'depth-warm-promoted-v1' OR sourceCitation LIKE '%depth-warm-verified%')` across the full
   atoms store — **zero rows**. No genuinely depth-warm-verified no-buildable-area envelope atom
   currently exists anywhere in this database. This is directly consistent with §4/§5's finding
   that the jurisdiction registry has no row for five of seven wired cities and none for Travis
   County at all, and with the P-208 false-retirement finding: verified promotion is not merely
   rare, it has not actually happened for this atom family in the current data. Consequence for
   the falsifier: `NOT_A_GAP_DEPTH_WARM_VERIFIED_ZERO` (the exclusion bucket built and
   self-tested in `envelope-draw-gap.mjs`) fires ZERO times on the real 2026-09-16 data — the
   exemption is currently exercised only synthetically (self-test), never in production, because
   the population it protects is empty. **This means a depth-warm-gated fix to
   `reconcileAtomEnvelope.ts` is, as of today, unconditionally safe with respect to false
   unlocks** (there is no real verified-zero for it to wrongly override) — but also that the
   negative-control half of this falsifier could not be exercised against a real parcel, only
   against the self-test's synthetic fixture. The `NOT_A_GAP_MACHINE_DIAGNOSTIC` bucket (968
   real parcels) is the one real, live negative control this lane DID confirm excludes correctly.

## 8. Instrument

`scripts/envelope-draw-gap.mjs`, self-test `node scripts/envelope-draw-gap.mjs --self-test`
(17/17 PASS at close). Two independent stores, index-bounded on both sides, per-county
error-isolated (one slow/failed county never discards the others' results — DEV_PROCESS 5.2).
A real platform-specific defect was found and fixed while building it: piping SQL to `psql` via
`spawnSync`'s `input:` option hangs indefinitely on this machine (repro: `status:null` after a
60s timeout with empty stdout/stderr); every query now goes through a real temp file with
`-f`, which is reliable. Documented in the script's own header comment so it is not re-discovered
the hard way by the next lane.

## Leave-behind / open items for the next lane

- Execute LDT's `labelEdges`+`deriveBuildableEnvelope` directly against `48209:97658`'s real ring
  (this lane could not set up `tsx`/`ts-node` in the worktree within budget) to close the one
  UNMEASURED-by-direct-execution gap in §0.
- The jurisdiction-registry gap (§4) is the actual precondition for verified promotion in five of
  seven wired cities plus all of Travis County — P-249's fix unlocks the DRAW, but a genuinely
  verified (non-refused) buildable-area figure still needs registry rows the depth-warm writer
  can read.
- **No real negative control exists yet for the depth-warm-verified exemption** (falsifier 3): a
  build of P-249 should either synthesize one on staging (mint a real depth-warm-verified
  no-buildable-area atom on a tiny/genuinely-consumed test lot) before shipping, or accept that
  the exemption ships un-exercised against real data until depth-warm coverage grows.
- **`setback-rule` atoms are entirely absent for McLennan and `property-boundary-edge` atoms are
  entirely absent for McLennan, Travis, and Williamson** (§2) — three of six counties are
  running on a factory-store-only setback path with no atoms-store equivalent at all for those
  families; this is a bigger structural gap than the per-parcel wording defects and sits upstream
  of anything P-249 touches.
  - **Every one of Hays's 509,928 boundary-edge atoms says "No setback table configured for
  jurisdiction descriptor"** (§2), including on parcels with a real, served table two sections up
  in the same response. This is not a sampling artifact; it is the whole county's edge-level
  family. Worth its own fix, separate from P-249/P-248.
- **The road-fallback path for a parcel with no `property-boundary-edge` atom and no `road-node`
  atom in its county** (i.e., how Pflugerville's front edge resolved at all, given both families
  are empty for Travis) was not traced in this lane — flagged as an open question in §3, not
  answered.
- Two connectivity/tooling defects were found and fixed while building the instrument, both
  worth carrying forward: (1) `spawnSync`'s `input:` stdin option hangs indefinitely against
  `psql.exe` on this machine — always use a real temp file with `-f`; (2) this machine's shared
  Temp scratchpad directory had files (including DSN caches) disappear mid-session, apparently
  from concurrent use by another lane's process in the same path — DSNs should be re-fetched
  fresh immediately before use, never cached to a shared scratch file across tool calls.
- Neon compute for the factory store showed large, unexplained latency swings during this lane
  (18.8s and 72s for the identical query minutes apart; a six-county join varying between 62s and
  260s+ across attempts) — plausibly cold-start/buffer-cache eviction under intermittent load,
  never fully explained. `scripts/envelope-draw-gap.mjs` is written per-county with per-county
  error isolation specifically because of this; a future full run should expect to retry at
  least one county.
