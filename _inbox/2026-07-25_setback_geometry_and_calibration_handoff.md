---
id: 2026-07-25_setback_geometry_and_calibration_handoff
title: HANDOFF — setback envelope-geometry correctness + a calibration program
status: handoff
date: 2026-07-25
applies_to: hauska-engine (buildableEnvelope derive), legacy-design-tools (cortex-api envelope), property-explorer (the drawn envelope), the buildable-answer wedge
owner: nick
related: [2026-07-25_setback_correctness_and_corner_lots_pickup, 27a_jurisdiction_factory_engine_spec, 2026-07-23_reasoning_chain_atom_shape_design, 2026-07-25_f1_command_center_completion_and_setback_correctness]
---

# HANDOFF — setback envelope-geometry correctness + a calibration program

For the next agent. F1 (Complete the Command Center) is DONE and verified. This handoff is the buildable-answer QUALITY work the operator flagged: "the setbacks are wrong, calibration is not done." Do NOT re-open F1. Do NOT re-transcribe setback table VALUES (they are human-verified and correct). This is about the GEOMETRY that draws the envelope, and a calibration program to make that geometry provably right at scale.

## FIRST: check what is already in flight (do not collide)

An EXPORT-GATE agent was dispatched at the end of the prior session and its completion was NOT confirmed. Before touching `services/engine-api/src/routes/parcel-terrain.ts` or any setback/export gate, CHECK LIVE whether that fix landed:
- The bug it addresses: the site-plan export refuses "Setbacks not available for this parcel yet" on parcels where setbacks ARE on file (e.g. 48021:47595 P-5: front:15 + build-to-line + S/R not_specified). It has its own `not_specified`-vs-missing check that treats not_specified as missing → refuses the whole export.
- The fix dispatched: refuse ONLY when genuinely no setback data; ALLOW export when a real setback exists with some axes not_specified (draw the real setback, annotate not-specified axes as "build-to-line governs", don't refuse).
- VERIFY: signed-in site-plan export on 48021:47595 — does it return a real PDF now, or still the false 422? If it landed, great; if not, it's still open and is problem #2 below.

## THE THREE DISTINCT SETBACK PROBLEMS (do not conflate — the prior session conflated them once)

1. DISPLAY of not_specified — FIXED + verified (PE #67 / engine #120 / LDT #355). The card correctly shows "F 15' · S not specified · R not specified — build-to-line governs" instead of "consumes the lot." Do not re-touch.
2. EXPORT-GATE false-refusal — IN FLIGHT (see above). May already be fixed. Verify first.
3. ENVELOPE GEOMETRY IS WRONG — THE PRIMARY HANDOFF, NOT FIXED. This is what the operator means by "the setbacks are wrong / calibration is not done."

## PROBLEM 3 — the envelope geometry (the real quality work)

EVIDENCE (live, 2026-07-25): parcel 714 Spring St (48021:33512, P-5, setback F 15'). The DRAWN buildable-envelope (the dashed inset polygon on the map) is a MANGLED, JAGGED, NON-PARALLEL shape that does not follow the parcel boundary at a consistent 15' inset. A correct front-15' envelope would be a clean line offset 15 feet from the street frontage; this is garbage geometry. So even where the setback VALUE is correct (F 15'), the code that computes the inset polygon produces a wrong shape.

WHERE TO LOOK: the envelope derive is `artifacts/api-server/src/lib/buildableEnvelope/derive.ts` (deriveBuildableEnvelope) + `edgeLabeling.ts` (which edge is front/side/rear) + `geometry.ts` (the actual inset/offset math). The bug is likely in one of:
- The inset/offset algorithm mis-insetting a concave or irregular parcel ring (a naive per-edge offset without proper polygon-offset produces self-intersecting/jagged results on non-rectangular lots).
- Wrong edge labeling → insetting the wrong edges by the wrong amounts (front applied to a side, etc.).
- not_specified axes: when side/rear are not_specified, what inset does the geometry apply? If it insets by 0 (consume-lot) OR by a garbage default, that's a bug — a not_specified axis under build-to-line should probably NOT inset that edge at all (or inset to the build-to-line, which we may not have). Decide the honest geometry for not_specified edges.
DIAGNOSE FIRST (read-only): pull several parcels of different shapes (rectangular, corner, irregular/concave) and inspect the derived envelope geometry vs the parcel ring. Characterize WHEN it goes wrong (all lots? only irregular? only not_specified axes?). The finding sizes the fix.

## THE CALIBRATION PROGRAM the operator wants

"Calibration is not done" = there is no systematic way to know the envelope geometry is RIGHT across many parcels — today it's spot-checked by eye on a screenshot. The operator wants a calibration program of sorts. Two senses of "calibration" both apply and should be scoped:

A. GEOMETRY calibration (the immediate quality gate): a mechanical way to verify the drawn envelope is a correct inset of the real parcel ring — e.g. assert the envelope is inside the ring, is offset by the setback distance from the correct (labeled) edges, does not self-intersect, and matches on a set of known-good hand-checked parcels. This is the "is the geometry right" test, analogous to the F1c smoke test but for envelope correctness. Build it so bad geometry FAILS LOUDLY, not renders as a jagged polygon nobody flagged.

B. CONFIDENCE calibration (the earning loop — bigger, later): the atoms' calibratedConfidence is still `asserted`/`seed`, not `backtest`/`live`, because the permit-outcome earning loop (structural commitment #2) is not feeding it. Real calibration = the confidence tightens against outcomes (Texas public-record permit issuances vs our envelope predictions — see the calibration overlay migration 0037 and 04a_arrow_two_calibration_capture). This belongs with the supply-engines program and is the honest long-game "calibration." Scope it, but the GEOMETRY correctness (A) is the immediate blocker on the wedge.

## Discipline for whoever picks this up
- Verify against LIVE state (a real parcel's drawn envelope vs its ring), never a report. This is the discipline that carried the whole prior program.
- The F1c mechanical guards (smoke test, probe badge) now catch data-side regressions — dogfood them; add the geometry-correctness gate (A) to that family so envelope geometry can't silently rot.
- Anti-fabrication holds: an envelope we can't compute correctly declines honestly (approximate/pending), never draws a confident wrong shape presented as certain.
- Watch the Cloud Run traffic-trap on any cortex/engine redeploy (check the serving revision — hit ~5x last session; memory `cloud-run-traffic-trap`).
- Do NOT re-transcribe setback values (correct). Do NOT re-open F1 (done). Focus: envelope GEOMETRY correctness (problem 3) + the geometry calibration gate (A), after confirming the export-gate agent's status (problem 2).

## Suggested sequence
1. Confirm the in-flight export-gate fix (problem 2) landed or not — close it if not.
2. Read-only DIAGNOSIS of problem 3: characterize when/why the envelope geometry is wrong (offset algorithm? edge labeling? not_specified handling?). Produce a finding.
3. Fix the geometry, verify live on the named bad parcel (48021:33512) + a rectangular + a corner + an irregular lot.
4. Build the geometry-correctness calibration gate (A) so it can't regress.
5. Scope confidence-calibration (B) into the supply-engines program (later).
