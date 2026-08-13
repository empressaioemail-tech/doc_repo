---
decision_id: 2026-08-12_zoning_absence_taxonomy
date: 2026-08-12
owner: operator
status: active
related_canonical:
  - _catalog/texas_roster_v1.json
  - _inbox/2026-08-12_ZCHAL_zoning_absence_challenge.json
  - _inbox/2026-08-12_PLANNER_HANDOFF_five_layer_reset.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md
  - 90_runbooks/factory_1_5_acquisition_staging.md
---

## Decision

Zoning discovery and the Texas city roster adopt a seven-status absence taxonomy; `SEARCHED-AND-ABSENT` is retired as a product and registry status.

Pinned status strings (shared with Factory 1.5 / L2):

1. `NO-ZONING-AUTHORITY`
2. `NO-EUCLIDEAN-REGIME`
3. `ORDINANCE-NO-GIS`
4. `AUTH-WALLED`
5. `HOST-BROKEN`
6. `NOT-FOUND-UNKNOWN-WHY`
7. `LAYER-FOUND`

Governing rule (verbatim): only a POSITIVE determination writes an absence; an empty result is NOT-FOUND-UNKNOWN-WHY and re-enters the queue.

## Context

Z1 collapsed at least seven distinct states into `SEARCHED-AND-ABSENT`, including Houston (hardcoded doctrine before any network call), Deer Park (folder recursion miss on a live host), Webster (advertised host returning Application Error), and eighty-four Houston MSA rows whose only probes were AGOL `hits:0` plus synthetic municipal hostnames. ZCHAL (`_inbox/2026-08-12_ZCHAL_zoning_absence_challenge.json`) indicted the method and proposed the split; the 2026-08-12 planner handoff and OPS-16 P-20 dispatched adoption plus the four owed roster corrections. L2 implements the same enum in the Factory 1.5 front half.

## Structural commitment check

Sell reasoning, not data: each status implies different product copy (serve constraints, cite ordinance, retry host, re-queue). Yellow avoided by forbidding empty-probe absences.

Confidence is earned, not asserted: an absence status requires a named positive observation; otherwise the row stays `NOT-FOUND-UNKNOWN-WHY`.

Cost per jurisdiction: discovery failures re-enter the queue instead of permanently poisoning the roster.

No privileged data: every path remains uniform public-record / public GIS.

## Reasoning

A boolean found/absent cannot drive Factory 1.5 or customer-facing honesty. Unincorporated territory (`NO-ZONING-AUTHORITY`) is a positive fact safe to serve. Houston (`NO-EUCLIDEAN-REGIME`) regulates via Chapter 42 constraint layers without Euclidean districts and must never be staged as zoning. Ordinance-on-paper (`ORDINANCE-NO-GIS`), auth walls (`AUTH-WALLED`), and dead endpoints (`HOST-BROKEN`) are different acquisition motions. `LAYER-FOUND` records a recoverable layer pointer for staging. Everything else stays `NOT-FOUND-UNKNOWN-WHY` until a later probe makes a positive determination. Retiring `SEARCHED-AND-ABSENT` kills the Houston class of doctrine laundered as a search finding.

## Reversal criteria

Revisit if (a) Factory 1.5 operations show the seven statuses are still overloaded and need a further split, (b) a jurisdiction class appears that cannot be expressed without a new positive-determination status, or (c) operator rules that a verified empty search against a catalogue-driven host list (not synthetic hostnames) may write a stronger absence than `NOT-FOUND-UNKNOWN-WHY`. Do not reverse solely to restore agent throughput.

## Dependencies

Consumers (in order): (1) `_catalog/texas_roster_v1.json` as first consumer of the enum on city `zoning_layer.status`; (2) Factory 1.5 front half (L2) as second consumer, writing the same pinned strings from the deterministic runner. Depends on ZCHAL evidence and the P-20 lane corrections for initial roster migration. Unblocks P-21 (re-probe of unknowns) and P-22 (zoning depth across footprint counties).

## Counterparties

Internal: operator (Nick); doc_repo planner; L2 Factory 1.5 lane; zoning discovery runners.
