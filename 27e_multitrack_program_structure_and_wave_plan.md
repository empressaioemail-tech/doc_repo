---
id: 27e_multitrack_program_structure_and_wave_plan
title: Multi-track program structure — planners, agents, memory, adversarial review, and the wave plan
last_updated: 2026-07-26
status: spec (draft, awaiting operator approval)
owner: nick
sub_wdll_of: 27_MASTER_WDLL_spine_completion_and_depth_engine
related: [27_MASTER_WDLL_spine_completion_and_depth_engine, 27a_jurisdiction_factory_engine_spec, 27c_road_node_engine_and_warm_digital_twin_spec, 27d_county_onboarding_recipe_and_fleet_reliability, 90_runbooks/fleet_memory_practice, 2026-07-26_base_layer_connecting_tissue_thesis_and_tracks, 2026-07-26_geom_empty_832_ceiling_verdict]
---

# Multi-track program structure + wave plan

How the whole program is organized to run as parallel as it safely can, as autonomous as it can, with QA saved for end-states. This is the operating structure under the master WDLL: which tracks run, who owns each, how the agents and memory are wired, where adversarial review sits, and the wave sequence.

The governing principle (from the architecture rulings): ONE OWNER PER SHARED SUBSTRATE. Parallelize on the axes that do not collide (executors on the county axis; genuinely-independent streams). Do NOT stand up multiple planners that write the same shared state. Autonomy comes from GATES that fail closed, not from trust; QA at end-states works ONLY because every seam in between is a mechanical gate. Verification is never delegated to executors.

## The blocking fix first (FIX-A — unblocks the depth track)

The 832-residual verdict (2026-07-26) is FIX-FIRST: 74.16% is NOT the honest ceiling. Of the 832 geometry-empty place-type parcels, 100% classified: 371 honest-irregular (44.6%), **461 SHOULD-DRAW near-rects (55.4%)**. Specimen 48021:28286 (rect 0.999, 60'x137') proves the class: front-only 15' works on edges 0/1, EMPTIES on edges 2/3, uniform 15' works — a mechanically impossible result for a correct offset. Class = asymmetric/edge-index-sensitive degeneracy false-failure in `insetPerEdge` / `insetRingMeters` / `isInsetDegenerate` + `perEdgeOffsetPlausible` (polygon-clipping path). Est. recovery ~461 -> depth ~86.8% place-type.

Memory finding (M0): the R0 geometry gate PROMOTED the lesson but its FIXTURE SET had a hole — it covers concave/corner/714-Spring but NOT "front-on-a-specific-edge-index of a near-rect." 28286 is a case the gate should have caught and did not. A promoted guard is only as good as its fixture coverage. FIX-A closes the bug AND widens the fixture set so the class is actually fenced.

FIX-A is single-owner (current depth planner), no fan-out. It gates the entire depth track. See the WDLL below.

## The tracks (owners, axes, collision map)

Four tracks. One writes the shared depth substrate (single owner, executor-fan on the county axis). Three are genuinely independent (their own owners, no shared-write-path collision).

| Track | Owner | Parallel axis | Touches shared depth write-path? | Runs when |
|-------|-------|---------------|----------------------------------|-----------|
| DEPTH (A) — engine + county fan-out | ONE depth planner | executors per county | YES (single owner) | after FIX-A + recipe proven on #2-3 |
| CUSTOMER-UI (B) — site plan, road render, PE surface | UI planner | independent features | no (LDT/PE front-end) | now (independent) |
| COMMAND-CENTER (C) — thin launch+watch + wire stubs + map swap | CC planner | independent panels | no (console reads ledger) | AFTER recipe proven (thin, last) |
| STRATEGIC (D) — write-back contract + fidelity engine design | strategy planner (planning altitude) | design, not build | no (design docs) | in parallel, low-rate |

Rationale: B is fully independent front-end (LDT/PE) and can start now. C is console front-end reading the ledger; it is deliberately LAST and THIN (27d — the button is a cap over a proven machine, not a cockpit). D is planning-altitude design of the net-new pieces (the write-back contract linchpin, the fidelity ladder) — no code, no shared state, safe to run in parallel at low rate. Only A owns the shared depth substrate, so only A has the one-owner constraint; its parallelism is executors-per-county under that one owner.

## How the agents + memory + review are wired (the reliability spine, per track)

Every track runs the same reliability spine, because the whole point is autonomy-via-gates with QA at end-states:

- PLANNER per track: plans, writes the track WDLL, dispatches executors, VERIFIES against live state (never delegated), gates promotion. One planner owns one track's shared state.
- EXECUTORS: fan out on the track's safe axis (county for A; independent features for B/C). Warm from M0. Cannot violate a baked gate.
- M0 MEMORY: each track gets a durable scratch (`_scratch/<track>.md`), micro-schema, planner-gated promotion. The county-onboarding recipe (27d) embeds the M0 block + scratch context by default so lane agents start warm without hand-assembly. Class-guards (geometry gate, front-labeling gate, verify gate) are the DURABLE form — inherited as gates the agent cannot violate, not notes it must remember.
- ADVERSARIAL REVIEW: the doc_repo planner (this seat) reviews every track's reports against LIVE state and mines every report for memory improvements. This is continuous, not an end-state QA — it is the drift firewall on the planners themselves. (The 832 verdict is an example: caught that "geometry-empty" hid a bug, and that the R0 gate's fixture set had a hole.)
- QA AT END-STATES: customer-facing QA is saved for end-states BECAUSE every intermediate seam is a mechanical gate (geometry-correctness, front-labeling, verify, smoke, cost). A track reaches "ready for QA" only when its gates are green; QA then validates the end-state, not every step. This is what makes autonomy safe — the gates do the per-step verification the human used to do.

## Cross-track coordination (so parallel tracks do not drift apart)

- ONE master WDLL (this program) with per-track sub-WDLLs. Per-track scratch; one shared understanding via the doc_repo planner's continuous review.
- The doc_repo planner is the single reconciling mind across tracks (NOT a second same-substrate planner — a coordinator that reviews, not one that writes shared state). This is the one-owner ruling applied at the program level: many track-planners, one reviewer/reconciler.
- A weekly-equivalent (event-driven, not time-boxed) cross-track sync: each track's latest live tally + open gates, reconciled into 00_current_state, so no two tracks disagree about a committed count (G4 one level up).

## THE WAVE PLAN (dependency-ordered, no time estimates)

WAVE 0 — FIX-A (geometry near-rect degeneracy) + gate-fixture widening. Single owner. Unblocks depth. (WDLL below.)
WAVE 1 — M0-reach hardening (27d) + author counties #2-3 descriptors + PROVE the recipe on #2-3 via the golden-descriptor path. This is the test of whether "start county X" is honest. Runs after FIX-A (the recipe must include the fixed geometry).
WAVE 2 — CTX county fan-out (Track A). Executors per county under the one depth owner, only after the recipe is proven and every gate (geometry, front-labeling, verify, smoke, cost) is green. Front-labeling gate + geometry gate are FAN-OUT PRECONDITIONS.
WAVE 3 — thin CC launch+watch surface (Track C). Built AFTER the recipe is proven (a button over a proven machine). Wire Engines stubs, fix DEGRADED panels, swap the map.
NATIONAL — same fan-out, more descriptors, gated on the non-TX golden-descriptor test passing on the real baseline.

Track B (customer-UI) runs IN PARALLEL from Wave 0 onward (independent). Track D (strategic design) runs in parallel at low rate throughout.

## PER-TRACK WDLLs

### WAVE 0 / FIX-A — geometry near-rect degeneracy (blocking; single owner)

Done-line: every near-rectangular place-type lot capable of a valid inset DRAWS its envelope; the depth-warm `insetPerEdge` path is edge-index/orientation INVARIANT; the geometry gate's fixture set covers the near-rect-front-on-each-edge class so it cannot regress.

Acceptance:
1. ROOT FIX. `insetPerEdge`/`insetRingMeters`/`isInsetDegenerate`+`perEdgeOffsetPlausible` no longer false-fail a 15' front inset on a near-rect based on edge index/orientation. Verify LIVE on 48021:28286: front@edge2 yields ~7316-class buildable (not empty), while uniform 15' STILL correctly yields ~3206 and honest-irregular lots STILL correctly decline. Paste before/after. | grade: [ ]
2. GATE FIXTURE WIDENING (M0 — the durable form). Add 28286 and its SHOULD-DRAW peers (across P-1..P-5, across which-edge-is-front) to the geometry-correctness gate, asserting front-on-each-edge-index of a near-rect draws correctly. Demonstrate the gate going RED on the pre-fix code. This closes the hole the 832 verdict exposed. | grade: [ ]
3. RE-PROMOTE + TRUE CEILING. Re-run the place-type promote after the fix; paste before/after (baseline 2712/3657 = 74.16%). Reclassify the residual ONCE under one road path. State the new honest ceiling (est ~86.8%) and the remaining honest-irregular + no-road tail. | grade: [ ]
4. NO REGRESSION. The front-labeling gate + all prior geometry fixtures stay green; concave/corner/714-Spring still correct. | grade: [ ]
5. HTTP SITE-PLAN SMOKE (the owed one). When ENGINE_API_GATE_TOKEN is available, run the live HTTP site-plan refresh on 34785; confirm the PDF draws the envelope (FIX 1.1 customer-verified, not just code-deployed). | grade: [ ]

Negative done-line: a near-rect that should draw still empties; the gate does not go red on pre-fix code (fixture hole not closed); honest-irregular lots start drawing fabricated envelopes (over-correction); the ceiling is quoted without a live re-classify.

### WAVE 1 — M0-reach + recipe proof on counties #2-3

Done-line: a fresh county-lane agent, given only the recipe dispatch + a county descriptor, onboards a NON-Bastrop county to market-ready with zero operator re-teaching and zero re-derivation of a baked decision; the golden-descriptor test passes on a real non-Bastrop baseline.

Acceptance (summary — full card at dispatch): M0 recipe dispatch embeds the memory + scratch by default; per-county isolated scratch; #2 and #3 descriptors authored; each onboards through all 8 recipe gates green; the anti-zombie golden-descriptor test passes; if a county re-opens figuring-out, that is a FINDING (the recipe is not yet fixed) not a silent patch. | grade: [ ]

### WAVE 2 — CTX county fan-out (Track A)

Done-line: the remaining CTX place-type counties are warmed to their honest ceiling via executors-per-county under one owner; every county's gates green; the ledger tallies each honestly (depth ratio, cost, honest gaps); no county warmed before the geometry + front-labeling gates are green. | grade: [ ]

### WAVE 3 — thin CC launch+watch (Track C)

Done-line (per 27d): "start county X / these counties" fires the recipe; per-county warm-state + depth ratio + cost + in-flight visible; batch greenlight is the operator's only in-loop decision; Engines stubs wired to show run-state/health; DEGRADED panels fixed; CC map swapped to the shared layered map; NO per-county knobs / no cockpit. | grade: [ ]

### TRACK B — customer-UI quality (parallel from Wave 0)

Done-line: road centerline+edges RENDER on the site plan + map (the road exists in the ledger; stop drawing an empty STREET box) — high, not polish; the site-plan is a deliverable worth paying for (design pass); the map card and PDF speak ONE truth about setbacks (vocabulary reconciliation). Customer QA at the end-state of each feature. | grade: [ ]

### TRACK D — strategic design (parallel, low-rate, planning altitude)

Done-line: the WRITE-BACK CONTRACT is designed (how anchored twins contribute fidelity atoms back on existing nodes under sovereignty, incentivized by the payment substrate) — the net-new linchpin; the fidelity ladder (v1->v2->v3 per domain) has a minimal engine sketch; both as design docs, NO build, gated behind the depth engine proving out. | grade: [ ]

## Build discipline (inherited, do not rebuild the drift one level up)

Fewer agents, tighter contracts, harder gates. Every dispatch cites the WDLL item + the gate it satisfies. Verify against LIVE state; paste evidence; never a report. One owner per shared substrate; many track-planners, one reconciler (the doc_repo planner). QA at end-states works only because every seam is a fail-closed gate. The 832 verdict is the model: a residual is never "accepted as ceiling" until it is classified 100% against live state and the SHOULD-DRAW class is ruled out.

## Next step

On approval: land FIX-A (Wave 0), then Wave 1 (M0-reach + recipe proof), then the fan-out. Track B launches now in parallel. Track D runs low-rate. The doc_repo planner continuously reviews every track adversarially and mines every report for memory improvements. No metro fan-out until FIX-A closes the geometry hole and the recipe proves on counties #2-3.
