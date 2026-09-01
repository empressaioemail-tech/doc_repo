---
decision_id: 2026-09-01_parcel_record_rails_v2_template
date: 2026-09-01
owner: Nick
status: active
related_canonical:
  - _decisions/2026-09-01_parcel_record_is_the_gate_to_everything.md
  - _decisions/2026-09-01_every_parcel_starts_with_a_full_record.md
  - _catalog/dispatch_missions/mission_parcel_rails_v2.md
  - _inbox/2026-09-01_parcel-schema-apply_close.json
---

## Decision

The parcel record rail set extends from 52 to 65 rails as a growth template: every data
point we hold or aspire to bring to a user gets a named rail now, carried as honest
absence until sourced, and three safety conditions make declared-ahead rails unable to
masquerade as live.

## Context

The 52-rail set was derived from the current serve surface. The operator ruled the record
is a template of what we are growing into, not an inventory of what exists: a rail that
exists and is unaccounted is countable; a rail that does not exist cannot declare
anything, and "we do not carry this" becomes indistinguishable from "this parcel does not
have it." The GTM review initially argued against unsourced rails and reversed itself on
exactly that ground. The alternative considered and rejected was adding rails only when a
source ships, which re-creates the missing-column defect the whole program exists to kill.
Timing matters: the 981k-parcel instantiation has not run, so rails added now get their
cells created in the same pass for free.

## Structural commitment check

Sell reasoning, not data: unchanged; every cell still carries provenance and state.
Confidence earned, not asserted: strengthened; declared-ahead rails cannot enter any
coverage number as live. Tenant sovereignty: the public-record reference cell forks on
acquirer; user-acquired rows are tenant-private and never pool. MCP-first: unaffected.

## Reasoning

**The 13 new rails**, organized by who asks. Land buyer (Solo): `ossf` (septic
feasibility, often the binding constraint outside city limits), `utilityService` (one
companion, rows typed water/wastewater/electric/gas), `agValuation` (ag status plus
rollback exposure), `mineralRights` (severance instruments). Agent: `schoolDistrict`
(scalar, ISD), `salesHistory`, `hoaDeedRestrictions`. Architect (Studio):
`maxImperviousCoverPct` (scalar, zoning-envelope group; impervious cover is regulated
separately from lot coverage in Central Texas), `overlayDistricts` (historic and other
overlays), `treeProtection` (scalar, ordinance applicability with citation).
Cross-cutting: `owner` (paid tier), `valueHistory`, `publicRecordRefs`.

**Shape rulings, decided now while shape is free.** (1) History rails are companions,
one row per event or tax year; the scalar dollar rails carry CURRENT values only; the
bake selects from a history companion by explicit vintage, never implicitly.
`valueHistory` and `salesHistory` answer this identically by rule. Texas is a
non-disclosure state, so a sales row's price field must itself be able to carry
absent-verified. (2) `owner` is a companion (multiple parties) and its rail metadata
carries its access pair explicitly (paid tier) rather than inheriting a default; the
August re-stamp of 6.3M atoms is the receipt for why inheritance is not trusted here.
(3) `publicRecordRefs` is a companion whose rows POINT into the existing P-85 records
store (records_request_jobs, clerk_portal_terms, the records-request artifacts store,
verified live in _state/property/STATE.md: migrations 0084+0086 applied, worker
deployed); a second record store would be the duplicate-subject defect. Rows carry
acquiredBy (public-ingest vs user-request) and their access pair follows the acquirer:
public-record facts are catalog-listed/anyone-free subject to the county's
clerk_portal_terms; user-acquired rows are tenant-private (Smart Files posture). The
cell needs no new states: pointer = value, searched-and-none = absent-verified with
basis, never-looked = unaccounted. (4) The `flood` companion row shape is committed to
carry zone, floodway-vs-floodplain flag, base flood elevation, FEMA panel id and
effective date; a bare zone letter is not the wedge the GTM strategy sells.

**Three safety conditions that make the template safe** (each traced to a documented
defect): (1) rail liveness is DERIVED, never hand-declared: a rail is live when at least
one earned cell (value, absent-verified, or refused) exists program-wide; hand-declared
has_writer/atomFamilyState drifted both ways against the engine and is the named defect.
Known limit: derivation cannot distinguish never-sourced from sourced-but-failed-
everywhere; the run ledger is the backstop and the limit is stated here rather than
discovered later. (2) Declared-ahead rails never enter a coverage denominator or the
publish gate as live: the publish gate and every coverage figure score against the
derived live set and PRINT the exclusion set in their output — an instrument's exclusion
set is part of its contract. Without this, adding 13 unaccounted columns would brick
publish for every county by construction. (3) The UI hides or shows a rail from the
rail's own derived state, never from a hand-maintained hide list.

**No new not-applicable rules ship in v2.** The unincorporated list stays exactly as
ruled; every new rail starts unaccounted everywhere.

## Reversal criteria

If a declared-ahead rail has attracted no acquisition plan by the time the second-state
template is instantiated, narrow the rail set per the parent ruling ("a smaller full
record beats a larger partial one") rather than letting dead columns accumulate. If the
derived-liveness rule proves gameable in practice (a junk ingest flipping a rail live),
replace it with a stronger derivation, never with a hand flag. If P-85's store shape
cannot carry the pointer rows the implementing card needs, the card stops and reports
rather than growing a second store.

## Dependencies

Depends on: parcel-schema-apply (closed; tables live — no migration needed, the schema
is rail-agnostic by design). Feeds: the six PARCEL-FILL cards (now additionally gated on
the v2 rail set so no county instantiates on the 52), PARCEL-GAP-LEDGER (its census and
exclusion-set reporting), the eventual serve/UI work, and the second-state template.

## Counterparties

Internal: property seat (implements), GTM lane (its review supplied the segment
organization and the three conditions), Studio/Solo product surfaces (consume the rails).
