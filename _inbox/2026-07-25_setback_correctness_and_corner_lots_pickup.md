---
id: 2026-07-25_setback_correctness_and_corner_lots_pickup
title: Setback correctness + corner-lot geometry — scoped pickup (post-F1, reasoning-engine quality)
status: pickup
date: 2026-07-25
applies_to: hauska-engine (Rule + Reasoning engines, setback-rule + buildable-envelope atoms), the supply-engine program
owner: nick
related: [27a_jurisdiction_factory_engine_spec, 27b_f1_command_center_completion_program, 2026-07-23_reasoning_chain_atom_shape_design]
---

# Setback correctness + corner lots — scoped pickup

Operator-identified during F1 Gate-C QA (2026-07-25). This is REASONING-CORRECTNESS, not availability — F1 made the data available and true-to-source; this is about the setback VALUES and GEOMETRY being right. It belongs to the Rule/Reasoning supply-engine work that comes AFTER F1 (operator ruled: close F1 first, then this as its own piece). Captured here so it's ready to scope as its own program.

## DIAGNOSIS (planner, live-verified 2026-07-25) — it's a DISPLAY bug, not a data bug

Pulled the actual setback-rule atom for the S0'/R0' parcels + read the Bastrop setback table. The finding FLIPS the assumption: the S0'/R0' is CORRECT, human-verified, cited data being DISPLAYED misleadingly — same shape as the QA-3 "not verified" vocabulary bug.

- The affected parcels are PUBLIC districts (P-1/P-3/P-CS). The Bastrop B3 code GENUINELY does not specify scalar setbacks for these — they're build-to-line governed. The table row for P-1 Nature: `front_ft:0, side_ft:0, rear_ft:0` BUT each carries `"not_specified": true` with a human-verified provenance quote: "Section 6.5.003(A) P1 column is blank... no scalar front setback is stated" / "it states no scalar side or rear setback." confidence 0.8-0.9, verification_state human-verified.
- So `0` here means "code is SILENT on scalar setback" — NOT "the setback is zero feet." The atom correctly flags `not_specified: true`.
- THE BUG: the app renders `0 + not_specified:true` identically to a real `0` → "S 0' · R 0'" → "setbacks consume the lot — no buildable area remains." That turns "the code doesn't specify a setback" into "the setback is 0, therefore unbuildable" — which is BACKWARDS (no scalar setback under a build-to-line regime often means MORE buildable area, not zero).
- FIX (display/interpretation, NOT data): when `not_specified: true`, do NOT treat as 0-and-unbuildable and do NOT compute "consumes the lot." Say "no scalar setback specified for this district (build-to-line governs)" or route to the build-to-line rule. The value bug is the app conflating code-silent with zero.
- COVERAGE NOTE: this is why the "setbacks consume lot" appears on so many Bastrop parcels — they're public/civic districts where the code is legitimately silent on scalar setbacks. It is NOT a fallback or a district-mismatch (that was my earlier hypothesis, now disproven). Real residential parcels (SF-*) DO have real scalar setbacks (verified earlier: SA R-6 = 10/5/20, cited).
- CORNER LOTS: the setback table ALREADY has a `side_corner_ft` column (data partially modeled). Open question for the fix agent (search hung): does the envelope/derive logic (a) honor `not_specified` [the display bug above], and (b) consume `side_corner_ft` + detect which lots are corners (2+ street frontages, drivable from the Overpass road-anchor)? Verify both against derive.ts / the envelope core.

## The two problems (from live prod screenshots)

1. SETBACK VALUES LOOK WRONG. Across many Bastrop parcels the setback reads `F 25' · S 0' · R 0'`, producing "setbacks consume the lot — no buildable area remains / 0% buildable" as the NORM. Side 0' / rear 0' should not be the common case. Symptoms point to one or more of: a bad setback-table row, a fallback value masquerading as real data, or a district-match putting wrong values on the parcel (the mapDistrict fallback-confidence issue from earlier). "Setbacks consume the lot" appearing repeatedly is the tell of bad INPUTS, not a real buildability finding. Diagnose: for a sample of these parcels, is the S0'/R0' from a real transcribed table row, a fallback, or a mismatched district?

2. CORNER LOTS ARE UNHANDLED (the operator's specific catch). A corner lot faces TWO streets, so it has TWO front (street-side) setbacks, not one front + one side + one rear. A standard F/S/R model applied to a corner lot mislabels a street frontage as a "side," computing a wrong (too-small or too-large) envelope. Our envelope logic almost certainly does not DETECT corner lots at all today. This is a known-hard setback-geometry problem: need (a) corner-lot detection (parcel touches 2+ named road frontages — the Overpass road-anchor data can drive this), and (b) a setback rule that applies the street-side setback to BOTH frontages. Ties to the road-anchor/front-edge work from the envelope program.

## What is CORRECT and should stay (do not "fix")

The anti-fabrication guardrail is working and must stay: the site-plan export on `48021:34737` returned `422 — setback-rule missing, engine refuses to fabricate F/S/R` ("No setback-rule atom; refuses to fabricate front/side/rear values"). That is the honest-where-absent thesis enforced at the paid deliverable — the engine refused to ship a fake site plan rather than invent setbacks. KEEP the behavior; only soften the customer-facing MESSAGE (raw 422 → "setbacks not available for this parcel yet"). Honest-absence at the export is a feature, not a bug.

## Scope note (when this becomes its own program)

This is Rule-engine (are the setback VALUES right, cited, non-fallback?) + Reasoning-engine (does the envelope geometry handle corner lots + multiple frontages?) quality. It should reuse: the cited setback-rule atom shape (values must trace to a real code section, not a fallback), the road-anchor/front-edge data (for corner detection), and the honest-absence discipline (a corner lot we can't resolve declines honestly, never fabricates a second frontage). Start with a read-only diagnosis (why S0'/R0' so common + does any corner detection exist) before building — the finding sizes it (quick data/table fix vs. real geometry build). Do NOT fold into F1.
