Filed: 2026-09-03
From: Claude Code (P:\doc_repo strategic session, doc-repo-88)
To: next Claude Code agent window in P:\doc_repo
Re: Register the ACQUIRE-GIS wave 1 worktree, hand-carry the dispatch, diagnose setback rendering live, follow up the PE refusal-contract finding

## 1. Conversation summary

The prior session started by recovering a mistakenly-closed agent window's topic —
"the 4 acquisition targets and a ruling on gas" — which traced to
`_inbox/2026-09-02_parcel-scout-gis_close.json` and its inventory: a read-only scout
of six declared-ahead `parcel_record` rails, four of which came back genuinely
acquirable now. That session compiled and committed a dispatch
(`_dispatches/2026-09-03_parcel-acquire-gis_dispatch.md`, PLAN-ROW F-01, repo
`hauska-factory`) covering those four rails, and drafted and committed the operator
ruling closing the fifth item (gas) as permanently unaccounted
(`_decisions/2026-09-03_gas_utility_service_rail_closed_unacquirable.md`). Neither
commit has been pushed to `origin/main` yet.

While naming what was needed to execute the dispatch, it became clear that the
`property` seat's roughly thirty existing `hauska-factory` worktrees are all claimed
by other in-flight cards, so a new worktree is needed and does not yet exist in
`_catalog/seat_register.json`. That registration is this handoff's primary ask.

Separately, the operator shared a live Property Explorer screenshot (5833 Taylor
Draper Cv, Travis County, parcel `48453:367134`) showing `atom-miss` refusals on the
Footprint and Boundary rows. Investigation (code trace against `origin/main` for both
`hauska-map` and `legacy-design-tools`, plus a live query against the `hauska_mcp`
atoms store) confirmed this is honest, correct, and — for `property-boundary-edge` —
essentially universal outside Bastrop: that atom family exists only in Bastrop County
(26,846 rows), zero everywhere else statewide, including all of Travis. A finding on
a related legibility gap (two different honest-absence display contracts on the same
card, one richer than the other) is filed at
`_inbox/2026-09-03_pe_refusal_contract_split.md`. The operator then asked whether
setback rendering depends on boundary atoms; code tracing confirmed it correctly does
not (setbacks come from a zoning-district table; only the derived Buildable envelope
needs boundary geometry), but this was never exercised live in the running app.

The operator then asked for an early session close specifically to open a fresh
agent window to straighten out worktrees, and for this handoff document alongside it.

## 2. Decisions reached

1. **ACQUIRE-GIS wave 1 bundles all four scouted rails into one lane** rather than
   splitting `overlayDistricts` (which needs a per-city adapter across 12 cities,
   materially more build than the other three uniform-source rails) into its own
   lane. Owner: Nick. Reasoning: mirrors how PARCEL-SCOUT-GIS itself ran four
   parallel sub-agents under one close. Reversal criteria: if `overlayDistricts`
   materially blocks the three faster rails once work is underway, split it out
   then rather than pre-emptively.
2. **The gas sub-row of `utilityService` (Texas scope) is ruled permanently
   unaccounted.** Owner: operator. Reasoning: Texas gas distribution has no
   certificated-territory GIS layer anywhere (franchise-based, not polygon-based);
   PARCEL-SCOUT-GIS confirmed this live against PUCT's and the Railroad Commission's
   own GIS publications as a structural absence, not a read-path failure. Full
   record, including reversal criteria, at
   `_decisions/2026-09-03_gas_utility_service_rail_closed_unacquirable.md`.

## 3. Open questions

1. **RESOLVED 2026-09-03, later same day, by the doc_repo planner (integration
   seat).** `hauska-factory-acquire-gis` is now registered in
   `_catalog/seat_register.json` under the `property` seat's `repos` array,
   verbatim per the recommendation below (commit `cb22b43`). The clone itself
   still does not exist on disk at `P:/tmp/hauska-factory-acquire-gis` — that part
   of "hand-carry" is still owed. Both commits named in this handoff as unpushed
   (`e813007`, `ed35457`) are also now on `origin/main`. Original reasoning below
   preserved for the record.

   **Where does the ACQUIRE-GIS wave 1 lane get its worktree?**
   Why open: none of property's existing `hauska-factory` worktrees are free —
   `hauska-factory-parcel-fill` is explicitly claimed by the six PARCEL-FILL-*
   cards and PARCEL-GAP-LEDGER; conform/writer/publish trees belong to the F-16
   through F-20 work. Recommended routing: register a new entry directly (this is a
   "filling a form" action per `62_seat_topology.md`, not a design exercise).
   Recommended next action: add to `_catalog/seat_register.json` under the
   `property` seat's `repos` array:
   ```json
   {
     "name": "hauska-factory-acquire-gis",
     "path": "P:/hauska-factory",
     "worktree": "P:/tmp/hauska-factory-acquire-gis",
     "branch": "feat/parcel-acquire-gis-wave1",
     "note": "Added 2026-09-03 for ACQUIRE-GIS wave 1 (F-01): schoolDistrict, utilityService water/sewer, overlayDistricts (12 cities), agValuation (Williamson). Standalone CLONE of hauska-factory, path equals worktree. Never hauska-factory-parcel-fill (claimed by PARCEL-FILL-*/PARCEL-GAP-LEDGER), -conform, -writer, or -publish trees. Dispatch _dispatches/2026-09-03_parcel-acquire-gis_dispatch.md."
   }
   ```
   Then hand-carry `_dispatches/2026-09-03_parcel-acquire-gis_dispatch.md` to the
   property lane planner once the worktree exists.

   **Read this before opening anything**: a sibling session closed today for exactly
   this class of problem and filed
   `_inbox/2026-09-03_PLANNER_HANDOFF_next_session.md`, which diagnosed "the rooting
   problem" — a new Claude Code chat TAB inside an already-open VSCode window
   inherits that window's workspace root; it does NOT get its own worktree even when
   a different path is named in the pasted dispatch. Two P-113 hand-carry attempts
   failed exactly this way and correctly self-refused (`seat: integration, worktree:
   doc_repo, branch: main`) rather than building in the wrong repo, which read as
   "idle" from the outside but was the contract working as designed. The fix: a
   genuinely new OS-level window, `code -n "P:/tmp/hauska-factory-acquire-gis"`
   (after the worktree/clone actually exists on disk — registering it in
   `_catalog/seat_register.json` is a paper declaration, not the `git worktree add`
   or clone itself), then confirm that window's own file explorer shows the folder
   as root before pasting the dispatch. This is very likely the exact problem the
   operator means by "get my worktrees straightened out."

2. **Does setback rendering actually behave correctly without boundary atoms in the
   live app, not just in the code path?**
   Why open: the prior session traced `fact-sheet-resolver.ts:1083`
   (`setbacksFact`, sourced from a zoning-district setback table) and
   `boundaryEdgeFactRead.ts` (the `atom-miss` refusal for geometry) and concluded by
   reading, not by exercising the running app, that setbacks render independent of
   boundary atoms while only the derived Buildable envelope correctly declines.
   Recommended routing: property seat / live QA pass. Recommended next action: open
   Property Explorer on a small sample of parcels outside Bastrop known to have zero
   `property-boundary-edge` atoms (any Travis parcel qualifies — verified zero
   statewide outside Bastrop) and confirm Setbacks renders real numbers while
   Buildable correctly shows "not stamped," across at least one parcel per zoning
   district shape (SF-2 and at least one commercial/mixed district) to rule out a
   district-specific edge case the code trace wouldn't surface.

3. **Is the statewide `building-footprint` county distribution really Bastrop-only,
   like `property-boundary-edge` is?**
   Why open: the aggregate query (`select left(entity_id,5), count(*) ... group by
   1`) timed out twice (25s, then 85s) against the live ~111M-row atoms table under
   write load; only the exact-parcel and exact-Travis-County zero counts were
   confirmed. Writer script names (`boundary-primitive-bastrop-downtown-scrub.mjs`,
   `bastrop-batch-bulk-prefetch.mjs`) suggest Bastrop-only but that is inference, not
   a verified count. Recommended routing: re-run outside a writer-load window.
   Recommended next action: re-attempt the same query, ideally with a `set
   statement_timeout` well above 85s or during a quiet window, and confirm or
   correct the inference in `_inbox/2026-09-03_pe_refusal_contract_split.md`.

4. **Should the seven atom-miss-shaped refusal types gain a `layerAbsence` path?**
   Why open: this is a legibility question, not a correctness one — both refusal
   contracts are honest and fail-closed today. Recommended routing: operator call,
   informed by whether Doc 19 / the parcel_record rails-v2 migration is expected to
   eventually absorb these seven atom families anyway (in which case building a
   bridge for the interim may not be worth it). Recommended next action: read
   `_inbox/2026-09-03_pe_refusal_contract_split.md` in full, then rule either way;
   no plan-row exists yet because this hasn't been scoped as a card.

## 4. Artifacts produced

- `_catalog/dispatch_missions/mission_parcel_acquire_gis_wave1.md` — mission input
  for the ACQUIRE-GIS wave 1 dispatch. Filed and committed.
- `_dispatches/2026-09-03_parcel-acquire-gis_dispatch.md` — the compiled dispatch
  itself. Filed and committed. Not yet hand-carried.
- `_decisions/2026-09-03_gas_utility_service_rail_closed_unacquirable.md` — the gas
  ruling decision record. Filed and committed.
- `_inbox/2026-09-03_pe_refusal_contract_split.md` — the refusal-contract finding,
  with live coverage evidence. Filed this close.
- `_sessions/2026-09-03_acquire_gis_dispatch_and_pe_refusal_finding_claude_code.md`
  — the full session summary this handoff is a companion to.
- This document.

## 5. Stakeholder updates needed

None beyond Nick, who is both operator and sole recipient of all of the above — this
was an internal planning and diagnostic session with no counterparty-facing content.

## 6. Context for the next session

Read, in this order: this handoff; the session summary named above; the dispatch
(`_dispatches/2026-09-03_parcel-acquire-gis_dispatch.md`) to know exactly what the
worktree will be used for; `62_seat_topology.md` for the rules governing worktree
registration (one worktree/branch per seat, product repos are exclusive, "adding a
seat is filling a form, not a design exercise" — registering a new worktree under an
existing seat is the same weight of action); the `property` seat's `hauska-factory`
entries in `_catalog/seat_register.json` to see exactly which worktrees are claimed
and why the obvious one (`hauska-factory-parcel-fill`) is off limits.

For the PE investigation thread: `_inbox/2026-09-03_pe_refusal_contract_split.md`
carries full file:line citations against `origin/main` for both `hauska-map` and
`legacy-design-tools` — start there rather than re-deriving. Both `hauska-map` and
`legacy-design-tools` local checkouts at `P:/hauska-map` and `P:/legacy-design-tools`
were stale/behind `origin/main` during the prior session; fetch and diff before
trusting either local tree again.

Update 2026-09-03: both commits (`e813007`, `ed35457`) are now on `origin/main`, and
the worktree registration from open question 1 above is also committed (`cb22b43`).
A fresh clone will see all of this. What is still owed is the actual
`git worktree add` / clone at `P:/tmp/hauska-factory-acquire-gis` and the hand-carry
itself.
