---
decision_id: 2026-09-05_f11_setback_bastrop_elgin_atom_reuse
date: 2026-09-05
owner: operator
status: active
related_canonical:
  - 90_operations/OPS-19b_ctx_pipeline_wrapup_sprint
  - _inbox/2026-09-05_ctx-wrapup-factory_f11-setback-writer_scoping
---

## Decision

F-11 (`setbackFrontFt`/`setbackSideFt`/`setbackRearFt`/`setbackCornerFt` on
incorporated parcels) ships as: real coverage for Bastrop and Elgin via
hauska-engine's existing per-city adapters, exposed to hauska-factory as
atoms consumed through the existing `ingestAtomsOntoRecords` /
`ENTITY_TYPE_TO_RAIL` path; every other city's setback cells get an honest
`refused`/"no onboarded source" state, never `unaccounted` forever. A
statewide (or program-wide) setback source is queued as its own separate
acquisition-program card, not a gate on this ship.

## Context

Factory's scoping report (`_inbox/2026-09-05_ctx-wrapup-factory_f11-setback-
writer_scoping.md`) found no statewide setback source exists to join
against — unlike `zoningDistrict`'s `tx_zoning_district_staging` pattern —
and that hauska-engine has real, hand-onboarded setback logic for exactly
two cities (Bastrop: live ArcGIS FeatureServer query cross-checked against a
hand-transcribed ordinance chart with real split-zone/fire-code business
rules; Elgin: a second hand-built table), built for a different consumer
(legacy-design-tools' site-plan/envelope export). Three options were framed:
acquire a statewide source, reuse the two existing adapters, or defer
entirely. The operator confirmed Bastrop and Elgin are the near-term launch
cities for the CTX product, which changes the value case: this is not "2 of
72 cities," it's the launch geography.

## Structural commitment check

Cost per jurisdiction rule / focus queue rule: a full statewide acquisition
effort is unscoped and unsized (Factory's own report: "not investigated
whether such a source exists to acquire... a genuine acquisition-program
question, out of a single session's scope"). Queuing it rather than starting
it blind respects the rule against opening new workstreams without naming
what's queued. ENFORCEMENT.md's "every record starts with its full shape":
every incorporated parcel's setback cells already exist as columns; this
decision changes which cells get filled and which get an honest `refused`,
never which cells exist.

## Reasoning

Duplicating Bastrop/Elgin's live-ArcGIS-query-plus-ordinance-cross-check
logic inside hauska-factory would create a second copy of real business
logic to keep in sync with Engine's — a maintenance liability the atom-first
architecture exists to avoid. The atom-ingestion path Factory already has
(`ingestAtomsOntoRecords`'s `ENTITY_TYPE_TO_RAIL` map, currently mapping
`"setback-rule"` to the `setbackRules` companion rail) is the natural
extension point: Engine emits the resolved scalar values as atoms per
parcel for the two cities it already correctly computes them for, Factory
adds an entity-type mapping for the four scalar rails, no new join code or
duplicated business logic on either side. Factory explicitly flagged it had
not verified whether `setback-rule` atoms currently exist for these
parcels — that verification is the first step of implementation, not an
assumption this decision makes.

## Reversal criteria

If Bastrop/Elgin are not in fact part of the near-term launch geography by
the time this is implemented (launch plan changes), the value case weakens
substantially and this should be re-scored against a straight defer
(option 3) rather than built as scoped here. If Engine-lane implementation
finds no atom-emission path is practical for this data shape (e.g. the
live-ArcGIS-dependent Bastrop values can't be atomized without duplicating
the query logic anyway), stop and re-scope rather than forcing a worse
version of option 2 through.

## Dependencies

Cross-repo: hauska-engine (emits setback atoms for Bastrop/Elgin parcels,
reusing its existing per-city resolution logic) and hauska-factory (extends
the atom-ingestion entity-type mapping to cover the four scalar setback
fields, and gives every non-Bastrop/Elgin city's setback cells an honest
`refused` state, matching the `zoningDistrict` 49-city fix pattern from
Wave 3). Depends on nothing else in this sprint. Statewide acquisition
(option 1) is explicitly out of scope here — a separate future card.

## Counterparties

Internal: Engine lane (emits atoms), Factory lane (consumes, extends
mapping, sweeps non-covered cities to `refused`), operator (ruling, confirmed
launch geography).
