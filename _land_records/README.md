---
id: land_records_README
title: Texas Land Records Acquisition, Planning Agent Handoff Index
status: draft
last_updated: 2026-07-15
applies_to: portfolio
related: [_land_records/strategy, _land_records/source_rail_registry, _land_records/ingest_architecture, 80_adrs/adr_027_first_party_land_records_acquisition, 90_runbooks/pia_bulk_request_runbook, _land_records/risk_register]
owner: planner
---

# Handoff index

Slot note (2026-07-15): this set was originally drafted at root numeric slots 10/52/53/54/90 and adr_020, all of which collided with existing canonical docs. Reconciled into `_land_records/` (this dir), with the runbook at `90_runbooks/pia_bulk_request_runbook.md` and the ADR at `adr_027`. Cross-references below use the reconciled paths.

## What this doc set is

Research and architecture input for building a first-party Texas land records data substrate, replacing dependence on TexasFile and comparable aggregators. Produced 2026-07-15 from primary source research. The planning agent should treat this as spec input, not as a spec.

## Why this exists

TexasFile has no public API. Its Terms of Service prohibit automated retrieval, prohibit redistribution without written permission, and prohibit use of its data to build a title abstract plant. Its pricing is per-click and per-page, which does not scale to substrate ingest. There is no consumption path that is both technically viable and license-clean. See `adr_027` for the decision record.

## The finding that changes the build

Texas Local Government Code 118.011(e), as amended by SB 1547 (89th Legislature, effective 2025-06-20), requires that when a county clerk provides a copy of a record in a format other than paper, including real property records, the clerk must charge under the Public Information Act cost rules rather than the per-page clerk fee schedule.

Per-page: roughly $1.00 per page.
PIA cost rules: $15/hr labor, $28.50/hr programming, 20% overhead on labor, plus actual media cost.

For a mid-size county holding several million images, this is a difference of three to four orders of magnitude. The entire acquisition strategy hangs on this single subsection. Verify it with counsel before committing capital. See `strategy` section 2.

## Read order

1. `strategy.md` - legal foundation, cost model, sequencing. Read this first. Everything else depends on it.
2. `source_rail_registry.md` - the four source rails, what each yields, per-county registry schema.
3. `adr_027` (in 80_adrs/) - the acquisition posture decision and what it forecloses.
4. `ingest_architecture.md` - pipeline stages, normalization targets, atom mapping.
5. `90_runbooks/pia_bulk_request_runbook.md` - the operational request workflow and letter templates.
6. `risk_register.md` - what kills this, ranked.

## What the planning agent should produce from this

- A phased sprint plan keyed to the sequencing in `strategy` section 6.
- A source registry population task covering 254 counties, schema in `source_rail_registry` section 5.
- An ingest pipeline spec against the stages in `ingest_architecture` section 2.
- A legal review scope covering the four open questions in `strategy` section 7.

## What this doc set deliberately does not decide

- Whether Hauska registers as or leases an abstract plant under TDI Procedural Rule P-12. Flagged in `risk_register` as an open strategic question, not resolved here.
- Commercial packaging or pricing of the resulting data.
- Build versus buy on OCR and document classification.
- Coverage beyond Texas.

## Provenance note

Every factual and legal claim in this doc set carries an inline citation to a primary source or is explicitly marked as inference. Claims marked `[INFERENCE]` have not been verified and must not be relied upon without verification. Claims marked `[VERIFY]` are load-bearing and require counsel review before capital commitment.

## Revision history

- 2026-07-15, research session, initial draft.
- 2026-07-15, reconciled into _land_records/ + adr_027 + 90_runbooks/ from the colliding root-slot draft; cross-references updated.
