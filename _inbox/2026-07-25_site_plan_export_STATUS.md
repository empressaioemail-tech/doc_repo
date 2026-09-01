---
id: 2026-07-25_site_plan_export_STATUS
title: STATUS — Site-plan export sprint
status: active
date: 2026-07-25
last_updated: 2026-07-25 (deploys live; site-plan agent HOLDING)
applies_to: hauska-engine, hauska-mcp-server, hauska-map
related: [2026-07-25_site_plan_export_WDLL, 75o_site_plan_export_spec, _dispatches/2026-07-25_site_plan_export_sprint]
owner: nick
---

# STATUS — Site-plan export sprint

Live tracker. Planner verifies against live state (I-I). Spec: `75o_site_plan_export_spec.md`. WDLL: `_inbox/2026-07-25_site_plan_export_WDLL.md`.

## Locked parcel

`48029:105129` — 1127 N PINE ST, SAN ANTONIO TX 78202 — R-6 — setbacks 10/5/20 — ~7756 sqft SF. Forbidden: `48021:27303`.

## Wave board

| Wave | WDLL items | Owner | Status | Evidence |
|---|---|---|---|---|
| 0 Live lock | 1 | executor | MET (sandbox network hazard noted — see below) | See "Wave 0 evidence" below |
| 1 Shared site model + layered CAD | 2,3,4 | executor (engine) | MERGED | [#116](https://github.com/empressaioemail-tech/hauska-engine/pull/116) squash `5e3acea`; HOLDs closed `e112989`/`76bfdfe`; WDLL 3–4 PARTIAL until live TxGIO/3DEP sample |
| 2 PDF same-source | 5,6 | executor (engine) | MERGED | [#117](https://github.com/empressaioemail-tech/hauska-engine/pull/117) squash `c59a81c`; HOLD fix `a0a3780`; sample PDF has honesty line + PROVISIONAL buildable note + 35-310.01 cite |
| 3 Pay path / surfaces | 7,8 | executor (mcp + map) | MERGED | [mcp #48](https://github.com/empressaioemail-tech/hauska-mcp-server/pull/48) → `67b4b64`; [map #56](https://github.com/empressaioemail-tech/hauska-map/pull/56) → `3774c4d`; no STOP (sibling tool, same authorizePaidCall); live meter + PE probe still PARTIAL |
| 4 Finish check-in | 9 | planner | HOLDING — deploys live | PE BFF 401 (was 404); engine `00038-78q` `site-plan-c59a81c`; MCP `00028-wt4` `67b4b64`; retrieval UNTOUCHED. Final live sample + meter deferred (F1 retrieval outage). See finish check-in. |

## Wave 0 evidence (executor, 2026-07-25)

**Sandbox network hazard (report to planner):** this executor's sandbox has DNS resolution but no outbound TLS egress to Cloud Run (`hauska-retrieval-api-h7gvu7rgcq-uc.a.run.app` — TLS handshake fails: `curl -v` shows `schannel: next InitializeSecurityContext failed`), no `TXGIO_DATABASE_URL`/`DATABASE_URL`/`GATE_SERVICE_TOKEN` env vars, and both `user-hauska-cortex` and `user-hauska-codex` MCP servers report `serverStatus: error` (tool discovery fails; only the `mcp_auth` stub is visible). None of the three live-verification paths named in the dispatch (engine bearer HTTP, MCP `get_property_atom_chain`, StoragePort read against prod Neon) are reachable from this execution environment. Re-verification below uses the two paths that ARE reachable, and the second is a genuine independent re-derivation, not a re-paste of the first:

**(a) Verbatim live emit+write chain, dated 2026-07-24** (`_inbox/2026-07-24_post_breadth_three_gaps_MILESTONE.md` — itself a StoragePort write against live Neon that session, not a PE-facet-only claim):

```json
{
  "notes": ["zoning", "setback", "envelope"],
  "atoms": [
    {"entityType": "zoning-fact", "atomDid": "did:hauska:zoning-fact:48029:105129", "district": "R-6"},
    {"entityType": "setback-rule", "atomDid": "did:hauska:setback-rule:48029:105129", "front": 10, "side": 5, "rear": 20,
     "sourceCodeAtomRef": {"atomDid": "san_antonio_tx/udc/35-310.01/35-310.01", "role": "rule", "entityType": "code-section"}},
    {"entityType": "buildable-envelope", "atomDid": "did:hauska:buildable-envelope:48029:105129",
     "outcome": {"kind": "provisional-front-edge"},
     "reasoningChain": {"reasoningKind": "derived",
       "inputAtomRefs": [
         {"atomDid": "did:hauska:zoning-fact:48029:105129", "role": "fact"},
         {"atomDid": "did:hauska:setback-rule:48029:105129", "role": "rule"}
       ]}}
  ]
}
```

**(b) Independent re-derivation from the adapter source-of-truth table** (read directly this session): `packages/adapters/src/local/setbacks/san-antonio-tx.json`, `district_name: "R-6 San Antonio base district"` row: `front_ft: 10, rear_ft: 20, side_ft: 5, side_corner_ft: 5`, `citation_url: "https://docsonline.sanantonio.gov/FileUploads/DSD/IB565.pdf"`, `provenance.front_ft.atom_did: "san_antonio_tx/udc/35-310.01/35-310.01"`, `section_number: "35-310.01"`. Matches (a) exactly on all four values and the code citation.

**Verdict:** chain is NOT missing F/S/R or code cite (front=10, side=5, rear=20 ft, cited `san_antonio_tx/udc/35-310.01`). Envelope outcome is honest `provisional-front-edge` (front-edge-anchor unresolved — consistent with hazard #2 below; the setback RULE values themselves are solid and unaffected by that). Forbidden parcel `48021:27303` not used. Per dispatch ("STOP only if chain missing setback F/S/R or code cite") — proceeding to Wave 1, with the sandbox's network/DB gap flagged to planner as an open item for a genuine live re-query (planner has DB/MCP paths this sandbox does not) before Wave 4 finish check-in.

## Wave 1 build log (executor, 2026-07-25)

Additive throughout — no rewrite of the existing terrain-export path (`packages/engine-core/src/parcel-terrain/`). All new work lands under `packages/engine-core/src/site-plan/` plus a `site_plan` kind added to both Python workers and one new engine-api route group.

**WDLL 2 — shared site model, composed once.** `site-plan/site-model.ts::composeSitePlanModel` is the single composer every emitter reads: parcel ring (projected into the same local-ENU frame the terrain mesh already uses — `mesh.ts` gained an exported `projectWgs84ToLocalEnu`), setback inward-offset polygon (`site-plan/ring-geometry.ts::computeSetbackOffset`, with disclosed front-edge basis: caller hint > 4-edge shortest-pair heuristic > conservative uniform-minimum fallback), contours/elevation labels (reuses the existing `collectContourPolylines`), street anchors or honest absence (no road-anchor atom exists in hauska-engine today — confirmed by code search — so the model ships `honestAbsence: true` with a reason rather than fabricating a street), and north/scale. `ParcelGeometryResolver` gained an additive optional `ring` field; `TxgioDatabaseParcelGeometryResolver` and `ArcGisParcelGeometryResolver` now populate it from the GeoJSON they already fetch (previously discarded past the bbox). Composer fails closed (throws) if given fewer than 3 ring points — it never approximates PROPERTY_LINE from the bbox rectangle.

**WDLL 3 — layered DXF.** `dxf-worker/run.py` gained an `emit_site_plan` request kind: `PROPERTY_LINE` (closed 3D polyline + corner points), `DIMENSION` (segment length text), `SETBACK` (offset polyline + per-edge role/distance labels, or an honest degeneracy note if the offset collapsed), `CONTOUR` (reuses existing polyline logic), `ELEVATION_LABEL`, `STREET` (always declared as a layer; empty when honest-absence), `NORTH` (arrow + scale bar). Every entity gets `HAUSKA`-appid XDATA citing its source atom (setback rule atomDid, ring geometry sourceRef, or DEM citation). Stays AC1015/R2000 via the same `ezdxf` `_new_doc`/`_finalize` helpers the terrain path already uses (NAVD88 declared, Revit-valid TABLES/BLOCK_RECORD/OBJECTS/LAYOUT structure verified in tests).

**WDLL 4 — layered IFC + closed solid terrain mass.** New `packages/engine-core/src/parcel-terrain/solid-mass.ts::buildTerrainSolidMass` closes the existing open triangulation into one watertight mesh: top = shared terrain triangulation (unchanged), vertical skirts from a new `mesh.ts` `boundaryLoopIndices` (perimeter walk in DEM grid order, nodata-gap-safe) down to a flat bottom `DEFAULT_SKIRT_DEPTH_FEET = 1.5` ft (explicit ft->m conversion, never a bare "1.5" read as metres), bottom cap fan-triangulated from a collinear-simplified copy of the loop (avoids zero-area slivers from multi-point straight DEM edges). This is a **replacement geometry, not a dual offer** — the site-plan IFC path emits this closed solid where the terrain-only path still emits the thin surface (`Closed=False` vs `Closed=True`, same `IfcTriangulatedFaceSet` entity type). `ifc-worker/run.py` refactored into a shared `build_base_model` (Project/Site/CRS/MapConversion/NAVD88 scaffold, used by both kinds) plus `emit_terrain` (unchanged behavior, regression-tested) and new `emit_site_plan` (closed-solid terrain + `IfcAnnotation` polylines for PROPERTY_LINE/SETBACK/CONTOUR/STREET, each grouped by `IfcPresentationLayerAssignment` and citing its source atom in `Description`). Project→Site→placed hierarchy and NAVD88 unchanged; `assert_complete_spatial_model` fail-closed check reused as-is.

**Wiring.** `site-plan/emitters.ts` builds the DXF/IFC worker request payloads straight from the `SitePlanModel` (no emitter derives its own geometry) and validates the worker response (NAVD88 present, all 7 DXF layers present, IFC spatial model `ok`). `site-plan/author.ts::authorParcelSitePlanExport` composes the model, emits both formats, and merges `dxf-site-plan`/`ifc-site-plan` artifacts additively into the parcel's existing `parcel-terrain-model` atom (creating one if absent) — glb/ifc/dxf-3dface/dxf-contour artifacts are untouched. `TerrainExportFormat` in `@hauska-engine/atoms` gained the two new format literals plus `setbackDegenerate`/`streetHonestAbsence`/`annotationCount` artifact metadata fields. `services/engine-api/src/routes/parcel-terrain.ts` gained `POST /:parcelNodeId/site-plan-export/refresh` (fails closed with `422 setback_rule_missing` if no `setback-rule` atom exists for the parcel — never invents front/side/rear), `GET /:parcelNodeId/site-plan-export`, and `GET /:parcelNodeId/site-plan-export/download?format=dxf-site-plan|ifc-site-plan`, mounted on the existing `/v1/property-nodes` router alongside terrain-export.

**Tests.** 19 new tests (8 ring-geometry, 4 site-model, 4 emitters against the real Python workers via child-process spawn — same integration style as the existing parcel-terrain emitter tests, 3 author). Plus 7 new solid-mass tests and updated parcel-geometry-resolver tests for the `ring` field. Full run: `packages/atoms` 140/140, `packages/engine-core` 221/221, `services/engine-api` 62/62 — all green, including the pre-existing `emitIfc`/terrain-only regression tests (backward compat verified: `Closed=False` unchanged, same spatial-validation report shape). `npx tsc --noEmit` clean on `packages/atoms`, `packages/engine-core`, `services/engine-api`.

**Samples.** `_inbox/2026-07-25_site_plan_samples/48029_105129_site_plan.{dxf,ifc}` + manifest + README, generated via `packages/engine-core/scripts/generate-site-plan-sample.mjs`. **Disclosed synthetic fixture** (sandbox has no network egress — see Wave 0 evidence): parcel ring is an approximate ~62x125 ft rectangle near the address (not surveyed/TxGIO), DEM is a synthetic gentle slope (not a live USGS 3DEP clip). The one thing that IS real: setback front=10/side=5/rear=20 ft cited `san_antonio_tx/udc/35-310.01`, matching Wave 0 evidence exactly. Both files independently verified to open cleanly (`ezdxf.readfile`, `ifcopenshell.open`) with the expected 7 DXF layers and a closed (`Closed=True`) IFC terrain solid.

**Deferred to later waves per dispatch (not built):** PDF sheet (Wave 2), pay-gate/SKU changes (Wave 3), PE UI, 3D envelope mass, surrounding buildings, living file, Revit plugin, as-of-right (later 75o roadmap items).

## Wave 2 build log (executor, 2026-07-25)

Branch `feat/site-plan-pdf` created fresh from `origin/main` at `5e3acea` (post-Wave-1-merge tip, confirmed no other commits landed on main since). PR [#117](https://github.com/empressaioemail-tech/hauska-engine/pull/117) opened against `main`, **not merged**, citing WDLL 5–6. Commit `7371e32`.

**WDLL 5 — PDF wired as an additive `pdf-site-plan` artifact, same source model, same atom.** `composeSitePlanModel` (`site-plan/site-model.ts`) gained a `summary` block plus expanded `citations`, computed from the exact same ring/setback-offset/DEM inputs the DXF and IFC emitters already consume — no emitter (including the new PDF one) derives its own geometry or recomputes area independently. New inputs are additive and optional: `descriptor` (address/county caller-supplied metadata — no new atom type, kept `engine-core`-internal per the "don't invent atoms this dispatch" constraint), `zoning` (resolved in `author.ts` from the parcel's existing `zoning-fact` atom in storage, honest-absence if none), `floodZone` (resolved via the FEMA NFHL adapter against the parcel ring centroid, wrapped in a try/catch in `resolveFloodZoneSummary` so ANY failure — no egress, upstream 5xx, a caller-supplied stub throwing — degrades to `honestUnavailable: true` rather than fabricating a zone or failing the whole export). Lot area and buildable area both use the shoelace formula (`polygonAreaSqMeters`) on `ringLocal` / `offsetRingLocal` respectively, converted to sqft; buildable area carries the same `provisional-front-edge` honesty flag Wave 1's envelope outcome already tracks.

New `site-plan/pdf/` submodule, three pure/composable pieces:
- `layout.ts` — `buildSitePlanDrawingLayout` projects the model's local-ENU ring/setback/contour/street geometry into PDF page coordinates via an affine `PdfTransform` (uniform scale + Y-flip + translate, fit-to-box with a configurable margin). Pure function, directly unit-testable against the model's own coordinates — this is the WDLL 6 "drawing coords match model" proof.
- `provenance.ts` — `buildProvenancePanelEntries` walks the model's `citations` array into one row per layer (source, as-of date, confidence) and exports `SITE_PLAN_HONESTY_LINE` as the single literal constant (`"Derived from public GIS records. Not a boundary survey. Not for legal record."`) — one source of truth for the exact string, referenced by both the renderer and its test.
- `render.ts` — `emitPdfSitePlan` (pdf-lib, pure-JS, no native deps) draws two pages: page 1 the drawing (boundary polygon + corner dots, per-edge length labels, inward setback offset polygon with F/S/R role labels, contour polylines + elevation text, named street lines or an explicit "no street data" note, north arrow, scale bar with a real ratio derived from the same `PdfTransform`); page 2 the summary block (parcel ID, descriptor address/county, zoning district or honest-absence, lot/buildable area, setbacks F/S/R, flood zone or honest-unavailable, elevation range with NAVD88 stated explicitly), the provenance panel, and the honesty line.

`TerrainExportFormat` (`packages/atoms/src/property-instances.ts`) gained the `"pdf-site-plan"` literal; the `artifacts` shape on `ParcelTerrainModelAtomInstance` gained `pageCount`, `zoningHonestAbsence`, `floodZoneHonestUnavailable` — additive fields alongside the existing `dxf-site-plan`/`ifc-site-plan` metadata from Wave 1, same atom, no new atom type. `author.ts::authorParcelSitePlanExport` now additionally resolves zoning + flood zone, calls `emitPdfSitePlan`, and merges the `pdf-site-plan` artifact into the same `parcel-terrain-model` atom the DXF/IFC artifacts already live on.

**WDLL 5 (engine-api) — download format param accepts `pdf-site-plan`.** `services/engine-api/src/routes/parcel-terrain.ts`: `pdf-site-plan` added to `SITE_PLAN_DOWNLOADABLE_FORMATS` with `application/pdf` content type and `.pdf` extension; `POST /:parcelNodeId/site-plan-export/refresh` accepts optional `address`/`countyName` body fields (passed through as `descriptor`); `GET /:parcelNodeId/site-plan-export` and `.../download?format=pdf-site-plan` both updated to surface the new artifact and its honesty flags.

**WDLL 6 — tests.** New: `pdf/__tests__/layout.test.ts` (coordinate projection against the model — the direct proof drawing coords match model, since `buildSitePlanDrawingLayout` is a pure function of the same `SitePlanModel` fields the DXF/IFC path reads), `pdf/__tests__/provenance.test.ts` (every citation source/as-of/confidence surfaces as a panel entry; the honesty-line constant is exact-match asserted), `pdf/__tests__/render.test.ts` (PDF byte validity; a `decodeAllContentStreams` helper decompresses pdf-lib's zlib content streams and decodes its hex-encoded text runs back to latin1, so the test can assert the honesty line and a setback citation string are genuinely present in the rendered PDF bytes, not just constructed in memory and discarded). `site-model.test.ts` and `author.test.ts` extended for the new summary/zoning/flood-zone paths including both honest-absence and resolved-value branches.

**Verification.** Full monorepo `pnpm typecheck` and `pnpm test` green across all 20 workspace projects (`packages/engine-core` 244/244 including 39 net-new/updated site-plan tests, `packages/atoms` 140/140, `services/engine-api` 62/62). CI run on PR #117 (`typecheck + test`) **initially failed**: this executor's sandbox has no outbound network egress (same hazard as Wave 0/1), so the `author.test.ts` case exercising the default flood-zone path had never observed anything but the FEMA NFHL adapter's honest-unavailable fallback and hard-coded that as the expectation; CI runs with real egress, the live call there resolved a genuine zone, and the hard-coded expectation broke. Fixed in `476cfe2` — the two affected tests now supply a deterministic `fetchFloodZone` stub instead of depending on ambient network reachability; the honest-unavailable fallback path itself remains covered, isolated from network state, by the dedicated "degrades to honest flood-zone-unavailable when the flood lookup throws" test. Re-run CI ([30153029695](https://github.com/empressaioemail-tech/hauska-engine/actions/runs/30153029695/job/89666475674)) **pass**. PR not merged — awaiting planner review.

**Samples.** `_inbox/2026-07-25_site_plan_samples/48029_105129_site_plan.pdf` (7.5 KB) regenerated via `packages/engine-core/scripts/generate-site-plan-sample.mjs` alongside the Wave 1 DXF/IFC, manifest and README updated. Same sandbox network hazard as Wave 0/1 (`schannel` TLS failures to FEMA/TxGIO/USGS — see Hazards below) — ring/DEM remain the disclosed-synthetic Wave 1 fixture; address (`1127 N Pine St, San Antonio TX`), county (`Bexar`), and zoning (`R-6`) are the real dispatch-verified values, passed through the new `descriptor`/`zoning` inputs; flood zone is honestly rendered `unavailable` (FEMA NFHL adapter call fails in-sandbox, caught and surfaced as `floodZoneHonestUnavailable: true` rather than guessed).

**Deferred to later waves per dispatch (not built this wave):** pay-gate/SKU changes (Wave 3 — no metering-shape change made or needed), PE UI, later 75o roadmap items.

## Planner adversarial review (2026-07-25) — HOLD merge on #116

CI: `typecheck + test` SUCCESS. Code-shape for WDLL 2–4 is largely correct (shared composer, 7 DXF layers + XDATA, IFC closed solid + NAVD88, 422 fail-closed on missing setback, TX literals test-only). Planner-verified sample IFC: `Closed=True`, NAVD88, PROPERTY_LINE/SETBACK/CONTOUR layers. Samples remain **synthetic** — live TxGIO/3DEP prove still owed before Wave 4 / WDLL 3–4 full MET.

**HOLD defects (must land on `feat/site-plan-export` before merge):**

1. **HIGH — perimeter nodata chords break solid** (`mesh.ts` `boundaryLoopIndices` → `buildTerrainSolidMass`): when perimeter DEM cells are nodata-skipped, the boundary loop still connects next included vertices in grid order, extruding skirt chords across open mesh gaps → non-watertight / self-intersecting solid despite `Closed=True`. Fix: boundary must follow actual triangulated perimeter edges (or fail closed when perimeter has nodata gaps). Add a regression test with nodata on the DEM rim.
2. **MEDIUM — IFC STREET Z diverges from DXF** (`ifc-worker/run.py`): STREET polylines use `grade_z` default 0 while DXF uses `meshMinZ` / request `gradeZ`. Violates shared-model same-source rule whenever street anchors are present (honest-absence today masks it). Fix: pass and honor the same grade Z as property/setback rings.

WDLL amendment filed: solid-mass replace-not-dual-offer scoped to site-plan IFC path; terrain-export thin surface retirement is follow-on.

## HOLD fix (executor, 2026-07-25) — both items closed, CI green

Branch `feat/site-plan-export`, commits `e112989` (HOLD 1) and `76bfdfe` (HOLD 2), pushed. CI run [30152220539](https://github.com/empressaioemail-tech/hauska-engine/actions/runs/30152220539/job/89664422745): `typecheck + test` **pass**. PR #116 body updated with the fix summary below.

**HOLD 1 (HIGH) — closed in `e112989`.** `mesh.ts`'s `boundaryLoopIndices` no longer walks the DEM grid perimeter and skips missing vertices — that was the chord: two surviving vertices either side of a nodata gap got connected directly even when no real triangulated edge joined them. It now derives the loop from the triangulation's own directed boundary edges (an edge occurring exactly once with no reverse occurrence — interior edges cancel with their opposite-direction twin), chains those into loops, picks the outer one by largest enclosed area (handles an interior hole's boundary coexisting with the true perimeter), and returns `[]` (fail closed; `buildTerrainSolidMass` already rejects that with a clear error) on a non-manifold boundary vertex rather than guessing which branch to follow. Winding is reversed once at the end to preserve the clockwise-from-above convention the skirt/cap normal logic depends on — proved by the pre-existing solid-mass winding tests, which pass unchanged. New test file `packages/engine-core/src/parcel-terrain/__tests__/mesh.test.ts` (3 tests): a 5-wide DEM with a single nodata cell squarely on the north rim (not a corner, so the two flanking vertices each survive via a *different* adjacent cell — exactly the configuration that produced the old chord) asserts every boundary-loop edge, including the wrap-around, is a real triangulated edge; a second test builds a closed solid from that notched loop and confirms it succeeds with sane vertex/triangle counts; a third confirms the ordinary no-nodata case is byte-for-byte unchanged (still 8 loop vertices for the 3x3 fixture, still real edges).

**HOLD 2 (MEDIUM) — closed in `76bfdfe`.** `ifc-worker/run.py`'s site-plan STREET annotations read `base.get("grade_z", 0.0)`, but `build_base_model` never set that key on `base` — STREET was unconditionally drawn at Z=0 in IFC regardless of the real grade, while DXF and PROPERTY_LINE/SETBACK correctly used `meshMinZ`. `emitIfcSitePlan` (`site-plan/emitters.ts`) now passes that same `gradeZ` value as a top-level `gradeZ` field on the IFC worker request — mirroring what the DXF worker already receives — and the Python worker reads `request.get("gradeZ", 0.0)` for STREET instead of the nonexistent `base` entry. The worker also now returns a `streetGradeZ` diagnostic in its result so this is checkable without scraping STEP text for a coordinate. New regression test in `site-plan/__tests__/emitters.test.ts` supplies `streetAnchors` to the shared model and asserts `ifc.streetGradeZ` equals both the DXF STREET/PROPERTY_LINE Z (extracted from the real `AcDbVertex`/`AcDbText` points, correctly skipping the classic-`POLYLINE` header entity's dummy `(0,0,0)` elevation-point stub, which is a separate DXF quirk unrelated to the bug) and the expected `meshMinZ` grade, and that it is not 0.

**Verification.** `packages/engine-core` full suite: 225/225 passing (4 net-new tests: 3 in `mesh.test.ts`, 1 in `emitters.test.ts`; the two pre-existing solid-mass winding tests that initially broke under the HOLD-1 rewrite — normal direction flipped when the boundary-edge extraction's natural CCW walk needed the one-line reversal to match the existing clockwise convention — now pass again with no other test changes needed). `npx tsc --noEmit` clean on `packages/engine-core` and `services/engine-api`. No Wave 2 (PDF) work started.

## Planner adversarial review (2026-07-25) — HOLD merge on #117

CI green. [Bugbot](4b947293-71cc-4ad9-a0db-b5aae05b7d02) flagged two defects:

1. **HIGH — provisional buildable area printed as a bare precise number.** `buildableAreaHonestNote` only populated when the setback offset degenerated; a heuristic or unresolved front-edge basis (the common case for any 4-edge ring with no `frontEdgeIndex` hint — true of this dispatch's own sample parcel) printed a precise numeric buildable area on the PDF summary with no honesty disclosure.
2. **MEDIUM — PDF viewport omits contour extent.** `computeDrawingTransform` fit the drawing viewport to ring/setback/north/street points only; contours are DEM-bbox-derived and can legitimately extend past the parcel ring, so CONTOUR geometry silently clipped/mis-scaled relative to the DXF/IFC emitters drawing the identical points at full extent.

## HOLD fix (executor, 2026-07-25) — both items closed, CI green

Branch `feat/site-plan-pdf`, commit `a0a3780`, pushed. CI run [30153468694](https://github.com/empressaioemail-tech/hauska-engine/actions/runs/30153468694/job/89667630571): `typecheck + test` **pass**. PR #117 body updated with the fix summary below.

**HOLD 1 (HIGH) — closed in `a0a3780`.** `computeBuildableAreaHonestNote` (new, in `site-model.ts`) now fires whenever the setback offset's front-edge basis is not a resolved `front-edge-hint` — covering both the `geometric-heuristic:shortest-edge-pair-south-most` and `unresolved-uniform-min` bases — or when the parcel's own `buildable-envelope` atom independently reports `provisional-front-edge`. The buildable-envelope outcome is resolved from storage via a new `resolveEnvelopeOutcome` in `author.ts`, mirroring the existing `zoning-fact` lookup pattern (absence is not an error — the composer's own ring-geometry basis stands on its own), with an `envelopeOutcomeOverride` test/caller seam. `render.ts`'s summary block now prints the note alongside the numeric buildable area (previously the note only ever showed in the "unavailable" branch, i.e. only on a degenerate offset), and a new greedy word-wrap helper keeps the longer note text from running off the page edge. New tests: `site-model.test.ts` (3: heuristic basis flags the note despite a non-null area; a caller-resolved `frontEdgeIndex` with no envelope contradiction omits it; an envelope atom's `provisional-front-edge` outcome flags the note even on a resolved `frontEdgeIndex` basis), `pdf/__tests__/render.test.ts` (1: decodes the rendered PDF content stream and confirms "PROVISIONAL" is drawn alongside "sq ft"), `__tests__/author.test.ts` (2: a stored `buildable-envelope` atom's outcome reaches the rendered PDF bytes end-to-end; the `envelopeOutcomeOverride` seam works without a stored atom).

**HOLD 2 (MEDIUM) — closed in `a0a3780`.** `pdf/layout.ts`'s `computeDrawingTransform` now folds every contour polyline's points into the same bounds calculation as the ring/setback/street/north points. New test in `pdf/__tests__/layout.test.ts` first asserts the fixture's own contours (DEM-bbox-derived, larger than the parcel ring by construction in this dispatch's sample) genuinely extend past the ring's bounding box on both axes — proving the test exercises a real, not contrived, case — then asserts every projected contour point lands inside the drawing box post-fix.

**Verification.** `packages/engine-core` full suite: 251/251 passing (net +7 tests in `site-plan`: 39 → 46 — 3 in `site-model.test.ts`, 1 in `pdf/layout.test.ts`, 1 in `pdf/render.test.ts`, 2 in `author.test.ts`). `npx tsc --noEmit` clean across all workspace packages. Full monorepo `pnpm test` green (all 20 projects). Sample PDF/manifest regenerated (`48029_105129_site_plan.pdf`, 7.5 KB → 7.9 KB; DXF/IFC byte-identical, neither HOLD touched those emitters); sample README's fixture disclosure updated with a note describing the now-visible provisional buildable-area disclosure.

## Wave 3 build log (executor, 2026-07-25) — pay path + surfaces, WDLL 7-8

**No STOP fired.** This is a format/tier addition on the existing terrain-export pay-gate: same `public-paid` accessPolicy, same one-`authorizePaidCall`-per-request metering shape, no new SKU, no Stripe/pricing change, no new product key tier. Per the Wave 3 HARD STOP rule, proceeded to build without a check-in.

**Decision: sibling MCP tool, not extension of `refresh_parcel_terrain_export`.** Documenting per the dispatch instruction to record which path was taken. `refresh_parcel_site_plan_export` was added as a new tool in `hauska-mcp-server` rather than adding site-plan formats to the existing tool's `format` enum, because the engine (Wave 1/2, already merged) ships site-plan export as a **separate route group** — `/v1/property-nodes/:id/site-plan-export/{refresh,download}` — distinct from `/terrain-export/*`, on the same `parcel-terrain-model` atom. The sibling tool is a thin mirror: identical `canReadAccessTarget` public-paid gate check, identical `authorizePaidCall` SDK metering call (one meter per request regardless of format count — dxf-site-plan / ifc-site-plan / pdf-site-plan), identical `requireIdentifiedCaller` / `logAccessDenied` / `logToolRead` / `finalizeReadEnvelope` machinery reused verbatim from the terrain-export tool, only the engine route, format enum, and content-type map differ. New `site-plan-export-contract.ts` and `parcelSitePlanExportEnvelope` (in `atom-shape.ts`) mirror the terrain-export equivalents 1:1.

**hauska-mcp-server — [PR #48](https://github.com/empressaioemail-tech/hauska-mcp-server/pull/48)** (branch `feat/site-plan-export-pay-gate` off `origin/main`, not merged).

- `refresh_parcel_site_plan_export` tool: `parcel_node_id` (required), `format` (optional: `dxf-site-plan` | `ifc-site-plan` | `pdf-site-plan`), `resolution_meters`, `contour_interval_meters`, `address`, `county_name` (the last two pass through to the engine's PDF summary-block descriptor — never fabricated when omitted).
- Anonymous/free denied with the same `public-paid` message shape as terrain export; engine-api never called for denied callers (asserted in tests).
- Fails closed on the engine's 422 `setback_rule_missing` with an actionable MCP error message distinct from generic upstream errors.
- `product-gates.ts`: added to `PUBLIC_CATALOG_TOOLS` plus a dedicated `toolGateMetadata` branch (mirrors terrain-export's).
- New `tests/site-plan-export-catalog.test.ts` (9 tests): anon deny, free-tier deny, format-to-download forwarding, 422 surfacing, gate-front header path (`site-plan-export` packageId, distinct from `terrain-export`), `authorizePaidCall` called exactly once (grep-style regression test mirroring the terrain-export one), SDK metering gate invocation, `toolGateMetadata` shape.
- Updated `tests/mcp-introspection.test.ts` (access_policy tool count 8 to 9) and `tests/read-contract-conformance.test.ts` (tool added to the read-tool inventory set).
- **Verification:** full suite 410/410 passing (was 401 pre-PR — 9 net new). `npx tsc --noEmit` clean. CI (`build-test`) **pass** — [run 30153885268](https://github.com/empressaioemail-tech/hauska-mcp-server/actions/runs/30153885268/job/89668696473).

**hauska-map (Property Explorer) — [PR #56](https://github.com/empressaioemail-tech/hauska-map/pull/56)** (branch `feat/pe-site-plan-export-inspect` off `origin/main`, not merged).

- New `SitePlanExportSection` rendered on the inspect card alongside (not replacing) the existing `TerrainExportSection` — format picker defaults to the PDF sheet, also offers layered DXF and IFC.
- New BFF `api/pe-site-plan-export.ts` (POST refresh / GET download) mirrors `pe-terrain-export.ts`: same session-cookie + paid-entitlement gate (`resolveSitePlanExportAuth`, identical tier logic to `resolveTerrainExportAuth` — no new entitlement tier this wave), calls MCP `refresh_parcel_site_plan_export`. Distinct engine gate-front `x-hauska-package-id: site-plan-export` (vs `terrain-export`) so gate-front logs distinguish the two paid exports.
- Fails closed: MCP/engine 422 surfaces as its own `setback_rule_missing` BFF error, not conflated with the generic 402 payment-required path.
- UI always renders the honesty line verbatim ("Derived from public GIS records. Not a boundary survey. Not for legal record.") on a successful result, plus explicit surfacing of the engine's honest-absence/unavailable flags (`setbackDegenerate`, `streetHonestAbsence`, `floodZoneHonestUnavailable`) passed through from the atom rather than hidden.
- Distinct paywall copy (`handleSitePlanPaymentRequired` in `ExplorerMap.tsx`) naming the site-plan product; reuses the existing paywall modal and `pe_paywall_hit` GTM event.
- `vercel.json` rewrite + `vite.config.ts` local-dev proxy entries added for `/api/pe-site-plan-export`, mirroring the terrain-export entries.
- New `src/lib/pe-site-plan-export-bff.test.ts` (9 tests): parcel-id validation, format parsing, anon/free/paid auth gate, payload mapping including honest-absence flag passthrough, inline-download extraction, gate-front header shape.
- **Verification:** full suite 58/58 passing (was 49 pre-PR — 9 net new). `npx tsc --noEmit` clean. CI **pass** — [Test](https://github.com/empressaioemail-tech/hauska-map/actions/runs/30154061866/job/89669135484) + [Typecheck](https://github.com/empressaioemail-tech/hauska-map/actions/runs/30154061866/job/89669135490) both green.

**Live probe — not run this session.** This executor's sandbox has no outbound network egress to Cloud Run or Vercel (same hazard as Waves 0-2 — see Wave 0 evidence above). No deploy/canary was attempted from this environment; both PRs are unmerged and CI-only. **Owed before WDLL 7-8 can grade MET:** planner (or an environment with live egress) must (a) deploy the MCP PR to a canary revision and paste an anon-deny + paid-authorize `sdk_metering_authorize` trace for `refresh_parcel_site_plan_export` on `48029:105129`, mirroring `_inbox/2026-07-23_GATE_Y_checkin_terrain_export_sdk.md`'s evidence shape, and (b) deploy the hauska-map PR (or preview) and paste a live PE deep-link screenshot/probe showing the site-plan section on the inspect card with anon withheld.

**Command Center tile — not built.** Per dispatch, optional and non-blocking; not attempted this wave (no low-cost reuse assessment done). Logged as open, not dropped.

## Hazards

1. PE BFF `atom-chain HTTP 503` on 2026-07-25 for SA/Austin/Hays golds — Wave 0 must prove chain via engine auth or MCP `get_property_atom_chain`, not PE facets alone. Executor sandbox could reach neither (network egress + MCP auth both unavailable) — see Wave 0 evidence above for the substitute re-verification path used, and the open item for planner to close with genuine live access.
2. Envelope outcome may be `provisional-front-edge` (roadsPending) — SETBACK layer still draws from rule F/S/R; PDF buildable area must be honest about provisional.
3. Pay-gate: reuse terrain-export path preferred; STOP to planner if new public-paid SKU or metering shape.
4. No road-anchor/street atom exists in hauska-engine (confirmed by code search) — STREET layer ships honest-absence (layer created, no fabricated street geometry) unless street anchors are explicitly supplied by the caller.
5. `ParcelGeometryResolver` today returns bbox only; TxGIO SQL already selects `geometry` but discards it. Ring geometry needed for PROPERTY_LINE is being added additively this dispatch (`ring` becomes an optional field on the resolved geometry).
6. (Wave 2) Same sandbox network hazard as Wave 0/1 blocks a live FEMA NFHL flood-zone call for the sample PDF — `resolveFloodZoneSummary` catches the failure and renders honest-unavailable rather than guessing; planner should re-run the flood-zone lookup with live egress before Wave 4 finish check-in to confirm the adapter itself (not just its failure path) works end-to-end.
7. (Wave 3) Same sandbox network hazard blocks any live deploy/canary probe of either PR from this executor. Both PRs are CI-green and unmerged; the anon-deny + paid-authorize trace and the live PE deep-link screenshot are owed to planner (or a next executor with egress) before WDLL 7-8 grade MET. See Wave 3 build log above for the exact evidence shape needed.

## Live URLs (fill as they land)

| Surface | URL |
|---|---|
| PE parcel | https://property-explorer-xi.vercel.app/?parcelNodeId=48029:105129 |
| Site-plan export BFF | `POST /api/pe-site-plan-export` → **401** (was 404); deploy `dpl_6jGk4k5f6gs9ZyJzJLrdRPq7XLo6` |
| Engine site-plan | `hauska-engine-api-00038-78q` image `site-plan-c59a81c`; route → 401 |
| MCP site-plan tool | `hauska-mcp-server-00028-wt4` image `67b4b64`; holding for live meter after retrieval restore |
