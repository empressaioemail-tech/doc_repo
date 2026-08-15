---
id: 2026-07-25_R0_geometry_truth
title: Dispatch — R0 geometry truth (real polygon-offset + geometry-correctness gate)
status: active
date: 2026-07-25
last_updated: 2026-07-25
applies_to: [legacy-design-tools]
owner: nick
planner: depth-engine planning agent (doc_repo)
governs_wdll: [27c_road_node_engine_and_warm_digital_twin_spec]
cites:
  - 27c WDLL 1 (GEOMETRY CORRECTNESS)
  - 27c WDLL 2 (GEOMETRY-CORRECTNESS GATE)
  - 27c WDLL 5 (EDGE-LABELING ROBUSTNESS)
  - M0.2 (fleet uses scratch — dogfood)
  - M0.3 (promotion produces a mechanical guard)
related: [27_MASTER_WDLL_spine_completion_and_depth_engine, 27c_road_node_engine_and_warm_digital_twin_spec, 90_runbooks/fleet_memory_practice, _scratch/depth-engine-27c]
---

# R0 — Geometry truth (dispatchable contract)

You are the EXECUTOR for sprint R0 of the depth-engine program. The planner verifies; you do not self-grade as done. Build in `P:\legacy-design-tools`. Open a PR on green CI. Return a close with evidence + a scratch block (M0). Do NOT promote lessons to MEMORY.md or durable docs yourself.

## FLEET MEMORY (M0) — paste-enforced

As you work, capture build knowledge in a scratch block you return in your close, using four entry kinds — LESSON (a hard-won fact worth a test/note), DEAD-END (a tried-and-failed path + reason, so it is not retried), GROUND-TRUTH (a live-verified state WITH its timestamp), OPEN (a live thread the next context must pick up). Read any scratch context passed to you FIRST before re-deriving. Do NOT promote anything to durable memory yourself — return lessons in your close; the planner gates promotion. Nearing your limit, flush open threads + live ground-truths into your close so the next instance starts warm.

## Scratch context (start warm — do not re-derive)

```
LESSON: insetProjected (geometry.ts ~197-236) is a naive per-edge miter — wrong on concave/irregular rings (714 Spring jagged polygon). Fix = real polygon-offset, not another hand-roll.
LESSON: insetIsDegenerate only REJECTS; ringSelfIntersects needs STRICT proper crossing so partial tangles slip past and render as if right. Tighten the gate; demonstrate it going RED on a known-bad ring.
LESSON: frontFromShape (~211-221) picks globally shortest edge as front — survey-artifact edge on jagged rings → wrong setback array. Geometry-correct ≠ answer-correct (WDLL 5).
DEAD-END: broadening ldt api-server esbuild conditions beyond ["workspace"] boot-crashes the container ("Class extends value"). conditions MUST stay ["workspace"].
GROUND-TRUTH (2026-07-25): no turf/jsts/martinez/polygon-clipping in api-server package.json today; unit/projection is NOT the bug; not_specified never reaches geometry.
PLANNER PICK (R0 first gate, 2026-07-25): add dependency `polygon-clipping@^0.15.7`. Architecture = per-edge setback STRIPS → union → difference from parcel (variable-distance inset). Reject uniform BufferOp / @turf/buffer (wrong for F/S/R). Reject jsts-as-primary (heavier; BufferOp tempts the uniform trap). Reject martinez-polygon-clipping (overlapping capability; polygon-clipping more maintained, no exports.import dual-package flip surface). Do NOT change build.mjs conditions.
```

## Library pick (LOCKED by planner — do not reopen)

| Candidate | Verdict | Why |
|---|---|---|
| `polygon-clipping@^0.15.7` | **USE** | Boolean engine for strip-union-difference. Pure JS. `main`/`module` only (no `exports.import` promotion hazard under esbuild). Bundles under `conditions:["workspace"]` unchanged. |
| jsts BufferOp | REJECT as primary | Uniform buffer is explicitly wrong for per-edge setbacks (module header + 27c). Temptation path that already failed once. |
| martinez-polygon-clipping | REJECT | Same job as polygon-clipping; less preferred. |
| @turf/buffer | REJECT | Uniform + pulls @turf/jsts; wrong API shape. |
| Broaden esbuild conditions | FORBIDDEN | Known DEAD-END — container boot crash. |

Architecture the executor MUST implement (not "call buffer(-d)"):

1. Keep the existing local equirectangular projection (feet → metres in local frame). Projection is not the bug.
2. For each labeled edge with inset distance `d_i > 0`, construct an inward setback strip polygon of width `d_i` (handle vertex joins at reflex corners without naive infinite miters — bevel or bounded miter is fine; spikes are not).
3. Union all strips via `polygon-clipping.union`.
4. Difference: `parcel \ union(strips)` via `polygon-clipping.difference`.
5. Take the primary remaining ring as the buildable envelope; if empty / multi-fragment below threshold / self-intersecting / not contained → honest empty (`empty: true` + reason), never a confident jagged ring.
6. Preserve the public API of `insetPerEdge(ring, insetFeetPerEdge): InsetResult`.

Hard constraints:
- `artifacts/api-server/build.mjs` `conditions` stays exactly `["workspace"]`.
- After adding the dep: `pnpm` install in api-server scope, `node ./build.mjs` EXIT 0, and prove the bundle still resolves `pg` to its CJS entry (no "Class extends value" class of flip). Paste evidence in the close.
- Do not add turf/jsts unless a later amendment reopens the pick.

## Acceptance items this sprint owns

Cite these in the PR body and the close.

**27c WDLL 1 — GEOMETRY CORRECTNESS.** `insetPerEdge` produces a valid inset (contained in the parcel ring, non-self-intersecting, correct per-edge offset distance) on rectangular, corner, and irregular/concave lots. Verified LIVE on 714 Spring St (`48021:33512`) plus a rectangular, a corner, and an irregular Bastrop lot. Honesty guard declines (approximate/pending / empty) rather than drawing a confident wrong shape.

**27c WDLL 2 — GEOMETRY-CORRECTNESS GATE.** Mechanical tests assert contained + non-self-intersecting + correct offset distance on concave / L-shape / corner / 714-Spring fixtures that do not exist today. Gate FAILS LOUDLY on a known-bad ring (demonstrate going red — keep a checked-in fixture of the OLD naive miter output or an injected bad ring and assert the gate rejects it). Wire the gate into the existing api-server vitest suite so CI fails on regression (F1c family dogfood: fail-closed, not a manual eyeball).

**27c WDLL 5 — EDGE-LABELING ROBUSTNESS.** On irregular rings, front is not the globally-shortest survey-artifact edge. A clean polygon on the WRONG edge is caught (test). Verified on a corner and an irregular Bastrop lot. Minimum bar: filter/ignore edges below a survey-noise length threshold before `frontFromShape`, and prefer road-proximity when `roads` signal exists; do not leave the pure "shortest edge wins" fallback as the only path on jagged rings.

**M0.2 / M0.3.** Return scratch entries. The geometry LESSON promotes (planner-side) to the mechanical gate tests you land — that IS the promotion target; do not write MEMORY.md yourself.

## Out of scope (do not touch)

- Road-as-node (R1), descriptor road-class setback table (R2), warm-verify loop (R3), Bastrop warm/cost (R4).
- Re-transcribing setback VALUES.
- Re-opening F1 / Command Center.
- Engine-api / cortex Cloud Run redeploy unless the live probe for 714 Spring requires a cortex-api canary that already serves this derive path — if you deploy, use the service's own cloudbuild yaml + canary + shift; never `gcloud run deploy --source=.` from repo root.
- Bastrop special/relationship-privileged data paths.

## Repo prep

1. Work in `P:\legacy-design-tools`. Local main is behind origin — `git fetch origin` and rebase/checkout a fresh branch from `origin/main` before editing. Do not build on the stale local tip.
2. Branch: `r0/geometry-truth-polygon-offset` (or equivalent).
3. Primary files: `artifacts/api-server/src/lib/buildableEnvelope/geometry.ts`, `edgeLabeling.ts`, `geometry.test.ts` (+ new fixtures), possibly `edgeLabeling.test.ts`, `package.json` for the dep. Touch `build.mjs` ONLY if something must be externalized (prefer bundling polygon-clipping; it is pure JS).

## Deliverables

1. Implementation + tests on a PR against `origin/main`.
2. PR body cites WDLL 1, 2, 5 and M0.2/M0.3.
3. Close report returned to planner with:
   - PR URL
   - `pnpm` / vitest / `node ./build.mjs` raw exit evidence (verbatim)
   - Proof esbuild `conditions` unchanged (`["workspace"]`)
   - How to reproduce the gate going RED on the known-bad fixture
   - Live or fixture evidence for the four lot shapes (714 Spring ring fixture is mandatory even if live Overpass/roads flake; prefer both)
   - Scratch block (LESSON / DEAD-END / GROUND-TRUTH / OPEN)

## Planner verify gate (NOT yours — do not claim PASS)

The planner will independently:
- Re-run the geometry gate tests and the known-bad RED demonstration.
- Probe live envelope for `48021:33512` (and the three companion lots) against serving cortex-api / the derive path — paste raw GeoJSON/ring, assert non-self-intersecting + containment.
- Confirm `build.mjs` conditions still `["workspace"]` on the merged tree.
- Grade WDLL 1/2/5 and promote the mechanical guard (M0.3).

Stop when the PR is up and CI is green (or you are blocked with a pasted error). Do not merge yourself unless the planner says go.
