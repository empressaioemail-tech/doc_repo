# scratch: depth-engine-27c

Working memory for the road-node depth engine build (R0-R4 under `27_MASTER_WDLL_spine_completion_and_depth_engine.md`). Tier 2 — cheap, lossy, planner-gated promotion. First dogfood of M0.

## LESSON

- LESSON: the buildable-envelope inset (ldt `artifacts/api-server/src/lib/buildableEnvelope/geometry.ts` insetProjected ~197-236) is a naive per-edge mitered parallel offset — correct only for convex/rectangular rings, self-intersects/spikes at reflex vertices on real parcel geometry. This is the 714 Spring St jagged polygon. Fix = a real polygon-offset. PROMOTE-TARGET: a failing test on a concave fixture (M0.3 / 27c WDLL 2), not a note.
- LESSON: the degeneracy guards (insetIsDegenerate ~244-279) only REJECT to empty, never repair; ringSelfIntersects requires a STRICT proper crossing so partial tangles/near-collinear slivers slip past and get drawn verbatim. The honesty gate exists but its predicate is too weak — a wrong answer renders as if right (F1c gap in miniature). PROMOTE-TARGET: tighten the gate + test it goes red on a known-bad ring.
- LESSON: edge labeling (edgeLabeling.ts frontFromShape ~211-221) falls back to "globally shortest edge is front," which on a jagged boundary can be a tiny survey-artifact edge → wrong front → wrong per-edge setback array. A CLEAN polygon on the WRONG edge passes a geometry-only gate. Geometry-correct and answer-correct are two different bars (27c WDLL 5).
- LESSON: descriptors carry a FLAT setbackTable today (verified: `hauska-engine/packages/engine-core/src/property-reasoning/fixtures/descriptors/bexar_tx_fixture.json` — `"setbackTable": { "rows": [] }`). A flat table has no axis for road class → road-type-aware setbacks require indexing by (road-class, edge-role) in the descriptor (27c WDLL 4).
- LESSON (R0 gate 2026-07-25 planner): variable-distance setbacks cannot use uniform BufferOp / @turf/buffer. Correct architecture under `polygon-clipping` = per-edge inward setback STRIPS → union → difference from parcel.
- LESSON (R0 verify 2026-07-25 planner): `insetFeetForLabeling` keys are `front_ft`/`side_ft`/`rear_ft` (not `front`/`side`/`rear`). Wrong keys → undefined → polygon-clipping throws uncaught. Geometry must sanitize non-finite inset metres and decline honestly.
- LESSON (R0 verify 2026-07-25 planner): on live 714 Spring fixture under PR #356 shape fallback, front is STILL globally shortest edge (7.83m). SURVEY_NOISE_THRESHOLD_M=1.5 only kills sub-1.5m slivers; WDLL 5 not met for this irregular lot. PROMOTE-TARGET: test asserting front ≠ shortest on PARCEL_714_SPRING_33512 (or honest decline of shape-front).
- LESSON (executor, planner-qualified): uniform-all-edges 15′ naive miter ≈ strip-union area on 714 Spring — do NOT take that as exonerating the miter. Production path is labeled (often front-only); that is the path to verify.

## DEAD-END

- CARRIED FORWARD from MEMORY.md (do not retry): broadening ldt api-server esbuild conditions beyond ["workspace"] boot-crashes the container ("Class extends value").
- DEAD-END (R0 library pick 2026-07-25): jsts BufferOp / @turf/buffer as the primary fix — uniform inset is wrong for F/S/R.
- DEAD-END (R0 library pick 2026-07-25): martinez-polygon-clipping as primary — redundant with polygon-clipping.
- DEAD-END (executor): NAIVE_MITER_BAD ring as gate RED target for 714 Spring uniform 15′ — passes tightened gate (geometry equivalent to strip-union for that case). Use bowtie + parcel-as-inset instead.

## GROUND-TRUTH

- GROUND-TRUTH (2026-07-25 live): export-gate false-refusal CLOSED — engine #121+#122. Serving hauska-engine-api-00086-hoz @ 100% (prior session).
- GROUND-TRUTH (2026-07-24 live-Neon audit): breadth DONE-wide; depth ~0.1%; Bastrop 62,257 zoning-facts.
- GROUND-TRUTH (2026-07-25 planner library gate): R0 adds `polygon-clipping@^0.15.7`; esbuild `conditions` stays `["workspace"]`.
- GROUND-TRUTH (2026-07-25T21:03Z): PR #356 CI green — Typecheck+Test run 30174564169. https://github.com/empressaioemail-tech/legacy-design-tools/pull/356
- GROUND-TRUTH (2026-07-25 planner verify): serving `cortex-api-00434-nej` @ 100%. POST buildable-envelope for 714 Spring → `declined`/`no-zoning-stamp` while facets show `zoning.district=P-5` and `envelope=null`. Live WDLL 1 blocked until merge+canary AND this stamp seam.
- GROUND-TRUTH (2026-07-25 planner verify): PR #356 local — 714 Spring shape-front = edge 3 @ 7.83m (shortest); F15/S5/R10 gatePass true; NaN inset THROWS.

## OPEN

- OPEN: R0 HOLD merge — R0.1 owed: (1) catch polygon-clipping/non-finite → honest empty + test; (2) WDLL 5 fix/assert on PARCEL_714_SPRING_33512; (3) then merge + canary + live probe.
- OPEN: live no-zoning-stamp vs facets P-5 seam on cortex derive path (blocks live envelope geometry verify).
- OPEN: ROW / road-width data availability across Central TX unknown (R1/R2).
- OPEN: Bastrop DEPTH-cost per parcel unknown until R4.
- OPEN: export-gate session-close commit (engine #121+#122 docs) "say go" may still be pending — not planner's to sweep.
- OPEN: master + 27c frontmatter still `awaiting operator approval` — formal flip owed.
