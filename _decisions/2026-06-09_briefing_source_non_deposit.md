---
decision_id: 2026-06-09_briefing_source_non_deposit
date: 2026-06-09
owner: Nick
status: active
related_canonical: [57_national_code_warming_sprint, 04a_arrow_two_calibration_capture, 55_spine_data_intelligence_stack]
related_decision: [2026-06-09_codewarm_arrow_two_combined]
related_inbox: [2026-06-09_legacy-design-tools_cc-agent-C_lineage_completeness_audit]
---

## Decision

Briefing-source citations (`{{atom|briefing-source|<id>|<label>}}`, the site-context and narrative provenance kind) are intentionally **non-deposit for code calibration at launch**. They remain attributable to a briefing-source row for site-context lineage, but they are not routed into the arrow-two adjudication ledger or the calibration overlay, which key on `code-section` atom ids only (`extractCodeCitationAtomIds`, decision commitment 3/8). Code-section calibration is the launch priority; expanding arrow-two to a separate briefing-source overlay class so site-context assertions also earn calibration is a deliberate later move, not a launch gap.

## Context

The lineage audit ([`_inbox/2026-06-09_legacy-design-tools_cc-agent-C_lineage_completeness_audit.md`](../_inbox/2026-06-09_legacy-design-tools_cc-agent-C_lineage_completeness_audit.md), Section 5) found briefing-source citations are a first-class citation kind for plan review (per `55` Section 4) but sit outside the code-section adjudication ledger: a finding citing only briefing-sources produces an adjudication with zero cited code atoms, arrow-one-only for code calibration even when accepted. The question was whether to expand the ledger to a briefing-source overlay class now or document the boundary.

## Reasoning

The earning loop's launch value is code-answer calibration (the I3 trust claim on plan-review findings). Site-context calibration (does a hydrology/parcel/flood assertion hold up) is real but second-order for the architect-launch wedge, and a separate overlay class is net schema plus a second ledger partition. Documenting the boundary now keeps the launch base honest (a briefing-source citation is provenance, not a calibration deposit) without building a second calibration surface before the first is proven. This is a scope boundary, not a defect.

## Reversal criteria

Expand to a briefing-source overlay class when site-context calibration becomes a priority, for instance when a tenant's value depends on calibrated site-context (Mox underwriting against actuals, or a city relying on calibrated hydrology). At that point it is a deliberate build (separate overlay partition keyed on briefing-source row ids), sequenced like the code-section overlay, not a retrofit. Until then the non-deposit boundary stands and is documented, not silent.

## Counterparties

Internal. No external impact. Affects the arrow-two scope in `57` and the Phase 3 dispatch (briefing-source remains out of the overlay key-space).
