---
id: 2026-09-03_acquire_gis_dispatch_and_pe_refusal_finding
title: "Session: ACQUIRE-GIS wave 1 dispatched, gas ruling closed, PE refusal-contract finding"
status: complete
last_updated: 2026-09-03
applies_to: portfolio
owner: nick
related:
  [
    _inbox/2026-09-02_parcel-scout-gis_close.json,
    _dispatches/2026-09-03_parcel-acquire-gis_dispatch.md,
    _decisions/2026-09-03_gas_utility_service_rail_closed_unacquirable.md,
    _inbox/2026-09-03_pe_refusal_contract_split.md,
    _inbox/2026-09-03_worktree_and_followon_handoff.md,
    _catalog/seat_register.json,
  ]
---

# Session: ACQUIRE-GIS wave 1 dispatched, gas ruling closed, PE refusal-contract finding

Closed early on operator request to hand off to a fresh agent window for worktree
cleanup; the work below is real and committed-or-ready, not abandoned mid-thought.

## What happened

Recovered a mistakenly-closed agent window's topic (the "4 acquisition targets and a
ruling on gas") by tracing it to the PARCEL-SCOUT-GIS close artifact and inventory.
Compiled and committed an ACQUIRE-GIS wave 1 dispatch for the four rails the scout
found genuinely acquirable now: `schoolDistrict` (TEA/TLC statewide), `utilityService`
water/sewer only (PUCT CCN, statewide), `overlayDistricts` (12 of 18 in-scope cities),
`agValuation` (Williamson County only). Bundled as one lane per operator choice rather
than splitting `overlayDistricts`' heavier per-city build out. Drafted and committed
the operator ruling closing the gas `utilityService` sub-row as permanently
unaccounted (Texas gas distribution is franchise-based, not certificated-territory,
confirmed structural absence per the scout's live checks).

Named the seat and repo needed to execute: `property` seat, `hauska-factory` repo,
both already owned. Found that none of property's roughly thirty existing
`hauska-factory` worktrees are free for this work (the obvious one,
`hauska-factory-parcel-fill`, is claimed by the six PARCEL-FILL-* cards and
PARCEL-GAP-LEDGER). Drafted a new worktree entry but did **not** apply it to
`_catalog/seat_register.json` before the operator redirected to a live investigation.

Separately, investigated a Property Explorer brief screenshot (5833 Taylor Draper Cv,
Travis County, parcel `48453:367134`) showing `atom-miss` refusals on Footprint and
Boundary. Traced the mechanism against `origin/main` for both `hauska-map` and
`legacy-design-tools` (both local checkouts were stale and not used for any
conclusion) to the per-family Fact-Read modules in cortex-api
(`boundaryEdgeFactRead.ts`, `buildingFootprintFactRead.ts`). Verified live against the
atoms store (`hauska_mcp`) that `property-boundary-edge` atoms exist only in Bastrop
County: 26,846 rows, zero everywhere else statewide including all of Travis. The
equivalent statewide breakdown for `building-footprint` could not be completed live —
the aggregate query timed out twice (25s, then 85s) under current write load against
the ~111M-row atoms table — though the exact-parcel and exact-Travis-County counts
both came back clean at zero. Filed a finding on a real legibility gap: the Doc-19
layer-absence provenance chip contract (authority / scope / asOf / basis, used for
CAD-structural absences like Living Area) is structurally unavailable to the seven
atom-family refusal types (well, flood, special district, pipeline, footprint,
boundary, owner), whose refusal types carry only a bare `reason` string. Both
contracts are honest and fail-closed; one is materially more legible than the other.

Confirmed by code trace (not yet exercised live in the running app) that setback
rendering is correctly independent of boundary atoms: setback values come from a
zoning-district setback table (`fact-sheet-resolver.ts:1083`, `source:
"setback-table"`), never from `boundaryEdgeFactRead`. Only the derived Buildable
envelope needs boundary geometry, and correctly declines ("not stamped") when it is
absent rather than fabricating one.

## Decisions

1. **ACQUIRE-GIS wave 1 bundles all four rails into one lane** rather than splitting
   `overlayDistricts` out. Owner: Nick. Reversal: if `overlayDistricts`' 12-city
   per-adapter build materially blocks the three uniform rails once work starts,
   split it out then rather than up front.
2. **Gas `utilityService` sub-row ruled permanently unaccounted** (Texas-scoped).
   Owner: operator. Full reasoning and reversal criteria in
   `_decisions/2026-09-03_gas_utility_service_rail_closed_unacquirable.md`.

## Artifacts produced

- `_catalog/dispatch_missions/mission_parcel_acquire_gis_wave1.md` — mission input.
  Committed (`e813007`).
- `_dispatches/2026-09-03_parcel-acquire-gis_dispatch.md` — compiled dispatch,
  PLAN-ROW F-01, repo `hauska-factory`. Committed (`e813007`). NOT yet hand-carried
  to the property lane planner — blocked on the worktree registration below.
- `_decisions/2026-09-03_gas_utility_service_rail_closed_unacquirable.md` — committed
  (`ed35457`).
- `_inbox/2026-09-03_pe_refusal_contract_split.md` — finding, filed this close.
- `_inbox/2026-09-03_worktree_and_followon_handoff.md` — structured handoff for the
  next agent window (this session's requested deliverable).
- Local commits `e813007` and `ed35457` on `main`. **Update, later same day**: both
  now pushed to `origin/main`, and the worktree registration below was also applied
  and committed (`cb22b43`) by the doc_repo planner (integration seat).

## Open and next

- **RESOLVED, later same day** (`cb22b43`, doc_repo planner/integration seat):
  `hauska-factory-acquire-gis` (worktree `P:/tmp/hauska-factory-acquire-gis`, branch
  `feat/parcel-acquire-gis-wave1`) is registered in `_catalog/seat_register.json`
  under the `property` seat. Still owed: the actual `git worktree add`/clone on disk,
  and the hand-carry itself. **Discovered mid-close**: a sibling session filed
  `_inbox/2026-09-03_PLANNER_HANDOFF_next_session.md` diagnosing the same class of
  problem — a new Claude Code tab inherits its VSCode window's root rather than
  getting its own worktree, so a genuinely new OS window (`code -n "<path>"`) is
  required after the worktree/clone actually exists on disk, not just after it is
  registered in `_catalog/seat_register.json`. Folded into this session's handoff.
- **Hand-carry `_dispatches/2026-09-03_parcel-acquire-gis_dispatch.md`** to the
  property lane planner once the worktree exists.
- **Diagnose setback rendering live** across a sample of parcels lacking boundary
  atoms — this session only traced the code path (`fact-sheet-resolver.ts`,
  `boundaryEdgeFactRead.ts`); it did not exercise the running app.
- **Re-attempt the statewide `building-footprint` county breakdown** outside
  writer-load hours; it timed out twice this session against the live atoms table.
- **Decide the refusal-contract legibility gap**: give the seven atom-miss-shaped
  families (well, flood, special district, pipeline, footprint, boundary, owner) a
  path to populate `layerAbsence`, or rule the gap acceptable as a lower-richness
  tier. No plan-row named yet — this is a finding, not a scoped card.

## Suggested canonical doc updates

- `00_current_state.md`: dated pointer paragraph added as part of this close.
- No numbered canonical doc changed state; no other patches needed.
