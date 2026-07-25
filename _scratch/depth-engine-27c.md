# scratch: depth-engine-27c

Working memory for the road-node depth engine build (R0-R4 under `27_MASTER_WDLL_spine_completion_and_depth_engine.md`). Tier 2 — cheap, lossy, planner-gated promotion. First dogfood of M0.

## LESSON

- LESSON: the buildable-envelope inset (ldt `artifacts/api-server/src/lib/buildableEnvelope/geometry.ts` insetProjected ~197-236) is a naive per-edge mitered parallel offset — correct only for convex/rectangular rings, self-intersects/spikes at reflex vertices on real parcel geometry. This is the 714 Spring St jagged polygon. Fix = a real polygon-offset. PROMOTE-TARGET: a failing test on a concave fixture (M0.3 / 27c WDLL 2), not a note.
- LESSON: the degeneracy guards (insetIsDegenerate ~244-279) only REJECT to empty, never repair; ringSelfIntersects requires a STRICT proper crossing so partial tangles/near-collinear slivers slip past and get drawn verbatim. The honesty gate exists but its predicate is too weak — a wrong answer renders as if right (F1c gap in miniature). PROMOTE-TARGET: tighten the gate + test it goes red on a known-bad ring.
- LESSON: edge labeling (edgeLabeling.ts frontFromShape ~211-221) falls back to "globally shortest edge is front," which on a jagged boundary can be a tiny survey-artifact edge → wrong front → wrong per-edge setback array. A CLEAN polygon on the WRONG edge passes a geometry-only gate. Geometry-correct and answer-correct are two different bars (27c WDLL 5).
- LESSON: descriptors carry a FLAT setbackTable today (verified: `hauska-engine/packages/engine-core/src/property-reasoning/fixtures/descriptors/bexar_tx_fixture.json` — `"setbackTable": { "rows": [] }`). A flat table has no axis for road class → road-type-aware setbacks require indexing by (road-class, edge-role) in the descriptor (27c WDLL 4).

## DEAD-END

- (none yet for this build — R0 not started)
- CARRIED FORWARD from MEMORY.md (do not retry): broadening ldt api-server esbuild conditions beyond ["workspace"] boot-crashes the container ("Class extends value"). Relevant because R0 adds a polygon-offset dependency to ldt — watch the esbuild conditions when adding it.

## GROUND-TRUTH

- GROUND-TRUTH (2026-07-25 live): export-gate false-refusal CLOSED — engine #121 (wired Postgres to parcel-terrain routes; not_specified is a sheet label not a refuse reason) + #122 (listPropertyAtomsByParcelNodeId now includes parcel-terrain-model). Site-plan export on 48021:47595 returns real PDF/DXF/IFC with honest F 15' + S/R not-specified disclosure; true-missing (48021:999999001) still honestly 422s. Serving hauska-engine-api-00086-hoz @ 100%, health=engine-api.
- GROUND-TRUTH (2026-07-24 live-Neon audit, per coverage milestone): breadth DONE-wide — 10 Central-TX counties, ~2.15M zoning-facts, ~$5.12 metro compute. Depth ~0.1% (Bexar 703,258 zoning-facts / 814 setbacks / 814 envelopes). Bastrop = 62,257 parcels with zoning-fact.
- GROUND-TRUTH (2026-07-25): buildableEnvelope has NO polygon-offset library (no turf/jsts/martinez/polygon-clipping in ldt package.json); all geometry is hand-rolled. Unit/projection is NOT the bug (feet → metres, offset in local equirectangular frame). not_specified never reaches geometry (handled upstream in provenance/gate layer).

## OPEN

- OPEN: polygon-offset library choice (jsts bufferOp / martinez / polygon-clipping) deferred to R0 build start — decide against the ldt dependency tree + the esbuild-conditions constraint. Do NOT pick blind in the spec.
- OPEN: ROW / road-width data availability across Central TX unknown. v1 = OSM centerline + assumed-per-class ROW width from descriptor, provenance-marked approximate; true-CAD/survey ROW precision pass deferred (27c decision).
- OPEN: Bastrop DEPTH-cost per parcel is the real unknown (breadth cost known-cheap). Measured in R4; decides whether eager-Central-TX depth is greenlit vs re-scoped (commitment #3).
- OPEN: export-gate agent's session-close commit (engine #121+#122 docs) was proposed but "say go" pending at handoff — that agent owns committing it; not the planner's to sweep.
