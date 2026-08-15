---
id: 2026-07-30_BDC_CLOSE12_BUCKET3_geometry_gate_scrub
title: BDC downtown drill — Bucket 3 geometry gate + F3 scrub finish
date: 2026-07-30
owner: cc-agent-E
repo: hauska-engine
wdll: 2026-07-30_BASTROP_DOWNTOWN_DRILL_WDLL
items: [7, R5]
status: dispatched
---

# Bucket 3 — geometry gate + F3 scrub (R5)

## Standing decisions

- Cotality extinguished / no Regrid / public-record only
- NO privileged data — uniform public endpoints only
- SmartCity READ-ONLY reference (never a data path)
- Deploys planner-owned
- Code-done ≠ customer-done — verify on traffic-shifted revision + full 36-parcel sweep + operator live block-QA (R6)
- CTX/national HELD until swept area passes + operator re-QA

## Scope

36-parcel downtown manifest ONLY (`_catalog/bastrop_downtown_drill_test_area.json`).

## Work

1. **Tighten verify gate (R5):** `nearRectEnvelopeCheck` — convex inset + vertex cap = parcel edge count; wired in `verify-mechanical.ts`.
2. **Finish F3 scrub:** micro-jog collapse (<5°) with cohort shared-vertex protection; pre-snap cohort before scrub.
3. **Promote fix:** per-parcel layer 23 scalars preserved on promote (fixes GC rear=0 on 34769).
4. Persist scrub for manifest; re-warm declined cohort (34785, 39282) after scrub.

## Acceptance

- 48021:34073 insets to convex ≤5-vertex envelope on traffic-shifted revision
- 34785, 39282 verify-pass after scrub + re-warm
- Mechanical gate fails non-convex notch (regression test on 34073 BCAD fixture)
