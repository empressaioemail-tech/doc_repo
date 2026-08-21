---
id: OPS-18c_parallel_execution
title: OPS-18c — Parallel execution of remaining SmartSite and Texas-flush work
status: active
last_updated: 2026-08-21
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
| IDENT | engine | free until backfill | Wave C writers and recurrence | P-55 |
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

COVER holds the one atoms `--apply` slot. Do not start `--apply` until geometry `48135` has a named denominator.

Queue:

1. Name denom for `48135`. Exclude the 3791 retired `prop_id` rows. Active geo_id count at P-02 close was 75859. Score, then recompute. This is P-56. DC-2 cannot move while the instrument still scores the retired set.
2. Then apply one-at-a-time, score and recompute after each: roads P-17 (no Harris PBF; A-017 stands), footprint P-09, wells P-11 (gated on P-10), pipelines P-12, rail P-06, flood remainder P-08, MUD/SD P-04/P-05.
3. Wave B depth in slot gaps only (envelope, easement, zoning, CAD in the 28-county footprint).
4. A2 honest-absent stays HELD until the operator rules L7 facet-only versus the verified pair. Do not mint typed absence. Do not copy L7 `--honest-absent` onto wells.

Two COVER runners at once is forbidden. Harris statewide PBF remains out (A-017). Do not run a second atoms `COUNT(*)`.

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

## First four compiles (not yet run)

Do not compile until the program WDLL is operator-approved and the OPS-16 amendment that ADDS P-48 through P-56 exists. Then:

1. SERVE: `--plan OPS-16 --plan-row P-48`
2. COVER-geom: `--plan OPS-16 --plan-row P-56`
3. IDENT: `--plan OPS-16 --plan-row P-55`
4. GOV-R06: `--plan OPS-18 --plan-row R-06`

COVER does not take `--apply` until the `48135` denom is named in its close.

## Do not fan

Harris PBF. A second atoms `COUNT(*)`. `image_tag=latest`. Dashboards G-103 / G-104 (parked). Two COVER runners. Two PE production deploys. Minted absence without the verified pair. A SERVE lane that writes atoms.

## Slot and deploy law

One atoms bulk-writer slot. COVER holds it. Acquisition, staging, dry-runs, SERVE PRs, GOV, and IDENT new-write PRs (no backfill) are slot-free.

Cortex Cloud Run canary and PE `vercel --prod` are planner-owned queues. Lanes open PRs. Integration deploys after adversarial review of the cited WDLL items.

## Reversal

Park COVER `--apply` if a named SERVE family cannot bind without a bounded apply that COVER is not yet ready to run. Reverse the four-team split if one seat is idle for a full day while another is blocked on it. Do not reverse A-017 (Harris PBF). Do not reverse the verified-absence pair.
