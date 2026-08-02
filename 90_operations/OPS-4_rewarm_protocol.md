---
id: OPS-4_rewarm_protocol
title: OPS-4 — Rewarm Protocol (how a recipe improvement re-warms the country deterministically)
date: 2026-08-02
status: operations doc (gap-closure: R-FND-5 recipe-version; the mechanism of "rewarm the country")
owner: nick
related: [OPS-3_engine_contract_determinism_register, OPS-6_command_center_engine_console, 2026-08-02_foundation_ground_truth_ACCEPTED]
layer: L-ENGINE + L-LEDGER
closes_gaps: [3 recipeVersion, 7 performance-ledger]
---

# OPS-4 — Rewarm Protocol

## WHAT THIS IS
The mechanism behind the operator's central principle: "the engines are mechanical because we rewarm the country every time we improve the program." This defines HOW an improvement triggers a rewarm, what gets invalidated, and how you KNOW what needs rewarming.

## THE CORE MECHANISM — RECIPE VERSION (R-FND-5; closes gap #3)
Every promoted atom carries the RECIPE VERSION it was warmed under. Today (verified gap): atoms carry only `depth-warm-promoted-v1` marker — NOT a recipe version. CLOSE:
- Add `recipe_version` (semver) to the promote path + atom schema + served facets.
- The recipe version bumps when any recipe ruling changes (a new R-rule, a fixed edge case, a source-adapter change).
- WITHOUT this field, "which counties need rewarming after an improvement" is UNCOMPUTABLE — recipe-version IS the rewarm trigger.

## HOW A REWARM WORKS (deterministic, per OPS-3)
1. IMPROVEMENT lands: a recipe ruling changes → recipe version bumps to vN.
2. TRIGGER: the ledger (OPS-6) shows every jurisdiction's atoms' recipe-version. Any jurisdiction below vN is "rewarm-needed."
3. REWARM = re-run the mechanical line (OPS-2 stages 3-6) over the FROZEN STAGED SNAPSHOT (same source vintage, per OPS-3 I3) with the new recipe. Deterministic: same sources + new recipe → new atoms, reproducibly.
4. INVALIDATE: the old-recipe-version atoms are superseded (append-only; R27 invalidate-on-repeal pattern generalizes — a superseded atom is not served).
5. RE-CERT: the mechanical cert re-runs (OPS-5); operator R6 on a sample if the change is geometry-affecting.

## WHAT A REWARM DOES NOT DO
- It makes ZERO novel judgments (OPS-3 I5) — it replays frozen artifacts (registry rows, staged snapshots, currency rows) through the new recipe. If a jurisdiction has an UNFROZEN sticky-part decision (still in scratch), it is flagged rewarm-unsafe (OPS-3 I7) and SKIPPED until frozen.
- It does NOT re-fetch live sources (that is a separate ACQUISITION refresh, OPS-2 stage 1, with its own vintage). Rewarm-on-recipe and refresh-on-source-staleness are DISTINCT triggers.

## THE TWO TRIGGERS (do not conflate)
| Trigger | Cause | Action | Determinism |
|---|---|---|---|
| REWARM | recipe version bump (program improvement) | re-run engine over the SAME staged snapshot with new recipe | fully deterministic replay |
| REFRESH | source staleness (a county publishes a newer parcel/CAD/code vintage) | re-ACQUIRE (stage 1) → new staged snapshot → then warm | new inputs, then deterministic |
The performance ledger (OPS-6) tracks BOTH: recipe-version drift (rewarm-needed) AND source-staleness (refresh-needed).

## THE PERFORMANCE LEDGER FIELDS (R-FND-6; closes gap #7)
county_facet_coverage exists with: county_fips, facet, honest_coverage_pct, integrity_verdict, owner_match_rate, source, source_vintage, checked_at. OWED (this doc mandates):
- recipe_version (per jurisdiction, per facet) — the rewarm trigger.
- cert_state (uncerted / mechanical-pass / R6-pass / certified) per unit.
- last_rewarm_at + last_refresh_at.
- staleness (source_vintage age vs refresh cadence → refresh-needed flag).
- rewarm_unsafe flag (derived: an unfrozen sticky-part decision exists for this jurisdiction — from memory-promotion state, OPS-3).
- cost_per_jurisdiction (compute + human-review, vs commitment #3).
- done/not-done at jurisdiction level (has this county been through the line at all).
This is the PERFORMANCE PUBLIC DATA LAYER (R-FND-6): treated with product rigor, surfaced in CC (OPS-6), the operator's factory dashboard.

## COST AT COUNTRY SCALE
Rewarm cost = per-jurisdiction warm cost × jurisdictions-below-vN. At R4's ~$0.34/6,972-parcel-county compute, a full-state rewarm (254 counties) is compute-cheap; the constraint is wall-time (parallelize per-county, the county is the parallel unit) + any operator R6 the change requires. A NON-geometry recipe change may need no R6 (mechanical cert suffices); a geometry change needs R6 on a sample per changed region.

## THE INVARIANT
A rewarm is a DETERMINISTIC REPLAY: {frozen registry rows + staged vintaged snapshots + frozen currency/conflict rows} × {new recipe version} → new atoms, reproducibly, with zero novel judgments. If it can't be replayed deterministically, the improvement isn't frozen yet (OPS-3). This is what makes "rewarm the country" a script you run, not an agent army you re-dispatch.
