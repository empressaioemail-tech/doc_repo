---
id: OPS-18c_parallel_execution
title: OPS-18c — Parallel execution of remaining SmartSite and Texas-flush work
status: active
last_updated: 2026-08-22
applies_to: portfolio
owner: nick
related:
  - 90_operations/OPS-18a_path_to_smartsite_market
  - 90_operations/OPS-18b_data_remediation_plan
  - 90_operations/OPS-18_canon_reconciliation_plan_of_record
  - 90_operations/OPS-16_texas_market_plan_of_record
  - _inbox/2026-08-21_ops18_all_board_WDLL.md
  - _decisions/2026-08-21_all_board_parallel_execution.md
  - _decisions/2026-08-21_sellable_is_cc_heartbeat_and_atoms_on_parcels.md
  - _decisions/2026-08-22_serve_ident_then_background_cover.md
  - _inbox/2026-08-22_p17_roads_park_pickup.md
  - _inbox/2026-08-22_serve_ident_qa_WDLL.md
  - 90_runbooks/AGENT_CONTRACT.md
---

# OPS-18c — Parallel execution

This is the standing fan plan for everything still open after the land-use pair. Refer here, not to chat. Sequence stays in OPS-18a. Defect classes stay in OPS-18b. Governance rows stay in OPS-18. Texas apply rows stay in OPS-16.

Operator 2026-08-21 evening: all remaining work is on the board. That includes HOLD families live on SmartSite, OPS-18 OPEN rows, and OPS-18b Waves A, B, and C. Sellable WDLL items 1 through 6 remaining met does not close the program.

## Why four teams

The work is four different write-paths. Cortex `*FactRead.ts` PRs can run in parallel. PE `layer-registry.js` / InspectCard cannot. Atoms `--apply` is one slot. Identity writers must not occupy that slot until COVER yields it. Governance is systems-owned and does not touch the store.

Four lane planners under integration. Fan one level. Sub-agents do not spawn, commit, or deploy. Isolated worktrees. Cortex canary and PE `vercel --prod` are planner-owned queues. One atoms `--apply` slot.

| Team | Seat | Slot | Scope | First compile row |
| --- | --- | --- | --- | --- |
| SERVE | property | free | HOLD families onto SmartSite inspect and layers | P-48 (then P-49 through P-54) |
| COVER | property | holds the atoms slot | OPS-18b Wave A; Wave B in gaps | P-56 (geometry `48135` named denom then score) |
| IDENT | property (`hauska-engine`) | free until backfill | Wave C writers and recurrence | P-55 |
| GOV | systems | free | OPS-18 R-02 remainder, R-03, R-04, R-06 | R-06 |

## SERVE (P-48 through P-54)

Turn HOLD families into live SmartSite consumers. Pattern is flood (hauska-map 174/175) plus land-use (176): cortex fact-read first, then PE copy onto inspect, then live gold probe.

| Row | Family | Surface key | Notes |
| --- | --- | --- | --- |
| P-48 | special-district-fact | `mud-pid` | S1. District type in body. A-002 still binds: mud is a type, not a second build. |
| P-49 | rrc-pipeline-fact | `texas-rrc` | S2. Layer exists, `live:false`. |
| P-50 | well-fact | wells layer | S3. P-10 writer swap remains the apply gate; SERVE reads what the store already holds. |
| P-51 | building-footprint | footprints | S4. |
| P-52 | rail-corridor-fact | rail | S5. |
| P-53 | property-boundary-edge | boundary | S6. |
| P-54 | owner-fact | identified inspect only | S7. Never on anonymous browse. See operator stamp in the WDLL. |

Stay bake: `cad-parcel-roll`. Stay Codex: `code-section`, `code-cross-reference`.

Parallelize cortex `*FactRead.ts` PRs. Serialize PE (`layer-registry.js`, InspectCard). One PE `vercel --prod` at a time. Project must remain `property-explorer` / `prj_vcZGXbqdffk5C20WzaplEpzFynK3`. Cortex canary never `image_tag=latest`.

SERVE does not take the atoms `--apply` slot.

## COVER (P-56, then existing P-rows)

COVER holds the one atoms `--apply` slot when a fill is running. Operator 2026-08-22: COVER `--apply` is PARKED. Foreground is SERVE, IDENT, and the DC-3 instrument, then deploy for visual QA. P-17 roads remainder resumes from `_inbox/2026-08-22_p17_roads_park_pickup.md` only after that QA. Decision `_decisions/2026-08-22_serve_ident_then_background_cover.md`.

Queue:

1. P-56 geometry `48135` named denom. DONE. GET 2026-08-21T23:50:19.722Z `honestCoveragePct` 99.96.
2. P-17 remaining roads. PARKED after 48371. Do not start 48373. Harris PBF stays out. Resume sheet `_inbox/2026-08-22_p17_roads_park_pickup.md`.
3. Background after operator QA: remaining P-17, then footprint P-09, wells P-11 (gated on P-10), pipelines P-12, rail P-06, flood remainder P-08, MUD/SD P-04/P-05 (not until engine 356 is on main).
4. Wave B depth in slot gaps only (envelope, easement, zoning, CAD in the 28-county footprint).
5. A2 honest-absent stays HELD until the operator rules L7 facet-only versus the verified pair. Do not mint typed absence. Do not copy L7 `--honest-absent` onto wells.

Two COVER runners at once is forbidden. Harris statewide PBF remains out (A-017). Do not run a second atoms `COUNT(*)`. Do not invent a roads coverage row (P-47).

## IDENT (P-55)

Wave C from OPS-18b. New writes first. No 100 million row rewrite until COVER yields the slot.

| Id | Work |
| --- | --- |
| C1 | Integer grammar at write. Padded StratMap form in `externalKeys`. |
| C2 | Sentinels (`:outside`, `:primary`) out of `entity_id`. |
| C3 | `externalKeys` fed on the same write as C1. |
| C4 | `applies-to` from fact to parcel-node at write. `body.parcelNodeId` is not the edge. |
| C5 | Verified-absence pair. Do not close A2 by widening typed `absence`. |

Do not raise the Q8 pins (flood 16/100, special-district 20/100). Recurrence is a storage-port reject plus the Q8 sample as a second derivation.

## GOV (R-06 first)

R-06 until it is armed: executor, trigger, failure, proven by violation, running in production CI or a scheduled job. Three scripts that self-test and never raise `baselineExit` are not done.

Then R-02 remainder (quarantine against the bounded canon set), R-03, R-04 armed consumers.

Do not retire or fold OPS-18 until R-06 per `_decisions/2026-08-21_ops18_keep_through_r08.md`.

## First four compiles (compiled 2026-08-21)

1. SERVE: `_dispatches/2026-08-21_serve_dispatch.md` (P-48)
2. COVER-geom: `_dispatches/2026-08-21_cover-geom_dispatch.md` (P-56)
3. IDENT: `_dispatches/2026-08-21_ident_dispatch.md` (P-55)
4. GOV-R06: `_dispatches/2026-08-21_gov-r06_dispatch.md` (R-06)

COVER `--apply` is parked. `48135` denom is already named. Do not compile a roads resume until the pickup says the operator released the park.

## Do not fan

Harris PBF. A second atoms `COUNT(*)`. `image_tag=latest`. Dashboards G-103 / G-104 (parked). Two COVER runners. Two PE production deploys. Minted absence without the verified pair. A SERVE lane that writes atoms.

## Slot and deploy law

One atoms bulk-writer slot. COVER holds it. Acquisition, staging, dry-runs, SERVE PRs, GOV, and IDENT new-write PRs (no backfill) are slot-free.

Cortex Cloud Run canary and PE `vercel --prod` are planner-owned queues. Lanes open PRs. Integration deploys after adversarial review of the cited WDLL items.

## Reversal

Park COVER `--apply` if a named SERVE family cannot bind without a bounded apply that COVER is not yet ready to run. Reverse the four-team split if one seat is idle for a full day while another is blocked on it. Do not reverse A-017 (Harris PBF). Do not reverse the verified-absence pair.
