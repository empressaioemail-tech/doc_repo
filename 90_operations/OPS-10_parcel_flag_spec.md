---
id: OPS-10_parcel_flag_spec
title: OPS-10 — Flag-this-parcel from the UI (operator/tester feedback into the focused-fix ledger)
date: 2026-08-04
status: spec (operator-requested 2026-08-04; v1 scope ratified verbally, build queued behind the OPS-9 wave)
owner: nick
related: [OPS-9_scale_ops_specs_pack, onboarding_defect_class_backlog, 76i_smartsite_contribution_economy_roadmap]
---

# OPS-10 — Flag this parcel

## The ask (operator, verbatim intent)

As people test and find things that need addressing in the smart site map, they should be able to just click "flag this" on a parcel (or on a specific fact like a setback), add a quick note on what is wrong, and have the Warden/ledger capture it into the list of things needing isolated fixes. Over time, patterns in the discrepancies enhance the feedback loop.

## The seed case (real, from stakeholder testing 2026-08-03)

Valerie Thompson reported via the property-explorer-qna-issues channel: "Setback issues 3 lots 3 various backing" with screenshots. Two identified parcels: 605 Mesquite St (APN 80578) and 607 Mesquite St (APN 80577), Bastrop. The system reads the flag-lot's rear yard as a SIDE setback; in reality the lot's backing orientation makes it the REAR setback. This is edge-role misjudgment on flag/irregular lots requiring judgment the geometry pass gets wrong — and it is the SAME class as the Elgin cert residuals (edge-role/inset mismatches), a cross-jurisdiction pattern exactly proving the operator's feedback-loop point. Filed in the defect backlog as EDGE-ROLE-MISJUDGED with these parcels as first members.

## V1 scope (internal testers: operator + named stakeholders)

1. PE inspect card gains a small "Flag an issue" affordance: tap → select what is wrong (chips: setback wrong, zoning wrong, boundary wrong, other) → optional one-line note → submit. Signed-in sessions only (attribution matters — see the roadmap doc).
2. Wire: POST to the existing onboarding-ledger ingest with a new sourceKind "user-flag" (schema: parcelNodeId required, defectClass "USER-FLAGGED" at intake, evidence carries the selected facet + note + reporter + app context (which fact/values were displayed)). The route triages nothing — intake is intake.
3. Triage: flagged events land status "open" in the same ledger; the CC County Ledger's focused-fix view shows them under USER-FLAGGED; the planner (or later the Warden) reclassifies to a real defect class during triage (e.g. the Mesquite pair → EDGE-ROLE-MISJUDGED). A Warden check can later corroborate flags automatically (e.g. re-run the edge-role logic on flagged parcels and attach its verdict as evidence).
4. Closing the loop: when the fix ships and the parcel re-serves correctly, the event resolves; v2 can notify the reporter (ties into the contribution roadmap).

## Explicitly deferred to the roadmap doc

Public flagging, identity/claim ("claim your smartsite"), compensation/token mechanics. V1 is the internal capture rail those build on.
