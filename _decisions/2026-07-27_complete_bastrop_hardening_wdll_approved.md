---
decision_id: 2026-07-27_complete_bastrop_hardening_wdll_approved
date: 2026-07-27
owner: nick
status: active
related_canonical:
  - _inbox/2026-07-27_COMPLETE_BASTROP_hardening_WDLL.md
  - _inbox/2026-07-27_COMPLETE_BASTROP_hardening_audit.md
  - _inbox/2026-07-27_bastrop_composition_inventory.md
  - 27f_bastrop_through_v2_program.md
---

## Decision

COMPLETE-BASTROP hardening WDLL is operator-approved. Fan A1/B1/C1 now. No S0/S1 skeleton is knowingly accepted — all must be fixed. Four S3 items are knowingly accepted in writing with labels/guards. Bastrop remains NOT APPROVABLE as the national mold until S0/S1 are clean and planner live-verifies.

## Context

Adversarial audit found zoning origin is real (City of Bastrop AGOL Zoning_Place_Type / PlaceTypeClass) but the live chain strips it (62257/62257 zoning-facts cite the internal bake URL). That is commitment #1 red at mold scale. Operator approved the hardening WDLL and the fan order A1 → B1 → C1 (parallel), then C2 → D re-grade → customer QA / mold stamp.

## Structural commitment check

1. Sell reasoning / source citation — RED until A1 lands (fix is the path; approval of mold still blocked).
2. Confidence earned — YELLOW until provenance cites origin (asserted 0.9 with opaque origin).
3. Cost per jurisdiction — green (backfill + monitors are bounded).
4–7 — green on focus (this IS the mold gate); quality gate requires live SELECT verification.

Premortem on mold stamp remains RED until A1/B1/C1 (+C2) clear S0/S1.

## Reasoning

An approved mold that ships unprovenanced base atoms stamps the hole into every county. Fixing provenance, adding liveness alerts, and locking dual setback tables are the minimum before any 254-county claim. S3 acceptances are labeled debt with existing or owed guards — not silent greens.

## Knowingly-accepted S3 (in writing — NOT S0/S1)

| ID | Acceptance | Label / guard |
|---|---|---|
| S-09 | OSM city road approx remains best-available where city GIS surface is sparse | `row.provenance.kind=approximate-assumed-per-class` already on atoms; do not rebrand as authoritative |
| S-10 | PDD / overlay resolution is a separate wave | Customer UX must name PDD decline (Flagged Risk A); no invented setback feet |
| S-13 | `property-atom-proof.ts` districtCode RS is fixture-only | Mark fixture-only in code (C1/C2 hygiene); never treat as production source |
| S-14 | Bake lag 6213 txgio stamps vs 5769 tier1/atom districts | Delta monitor under B1 health pack; do not claim stamp==bake parity |

## Reversal criteria

Reverse an S3 acceptance if: (S-09) city authoritative surface becomes dense enough to retire OSM; (S-10) PDD resolution ships and UX still hides the decline; (S-13) fixture leaks to production path; (S-14) delta grows without alert. Reverse the WDLL approval only if operator rescinds mold-hardening as the gate (would reopen 254 fan-out risk).

## Dependencies

A1/B1/C1 fan now. C2 after C1 (adapter honesty). D1 planner re-grade after A1/B1/C1/C2. Customer QA / mold stamp only after D1 S0/S1 clean.

## Counterparties

Internal: Nick (operator), adversarial-audit planner (CTX HELD), A1/B1/C1 executors.
