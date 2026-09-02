# Mission — FILL-OWNERSHIP: the fill job stops clobbering rails it does not own

The flood-fragments lane's CP2 (read it FIRST — it is the spec input:
_inbox/2026-09-02_parcel-flood-fragments_cp2.json and its close) found that
parcel-record-fill's batch upsert resets specialized rails (flood confirmed on 4 of 5
counties; wells/districts/valueHistory/zoning structurally exposed) back to unaccounted
on every county run — 8+ recurrences in one day. The record regresses by construction
every time the fill runs.

1. THE INVARIANT, enforced structurally in the fill upsert: the fill may write cells on
   rails it OWNS (instantiate + the CAD ingest set + crosswalk dollars), may move
   unaccounted to an owned value/absent-verified, and may NEVER move any
   non-unaccounted cell of any rail back to unaccounted. Rail ownership is an explicit
   list in code, not a comment. Violation tests: (a) a flood value cell survives a
   county fill run byte-identical; (b) an owned CAD cell still updates; (c) the
   falsifier — remove the guard, test (a) must fail.
2. HEAL PASS, after the fix merges and deploys: consume the flood-fragments damage
   census; re-run the OWNING jobs (flood-ingest with PR #71's fragment fix now
   included, and any other wiped rails' owners) for every wiped county-rail;
   verify against each owning card's original close counts.
3. Verify the S6 lane's Williamson run window against the census — its remediation ran
   through the unfixed upsert and its own rails' final state must be re-checked after
   the heal.
4. Cloud Run only; digest-match; at most one other parcel_record writer concurrent.

This card BLOCKS txgio-refresh (which re-fills all six counties) and the slate-1 flood
cutover. Close: _inbox/2026-09-02_parcel-fill-ownership_close.json.
