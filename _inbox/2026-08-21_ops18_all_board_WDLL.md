---
id: 2026-08-21_ops18_all_board_WDLL
title: All remaining SmartSite and Texas-flush work — parallel board
status: approved
date: 2026-08-21
plan_row: OPS-18c / P-48 through P-56 / R-06
operator_approval: 2026-08-21 evening verbal. All remaining work on the board. Capture the fan plan, then WDLL, then OPS-16 amendment rows, then stop before compile.
related:
  - 90_operations/OPS-18c_parallel_execution.md
  - 90_operations/OPS-18a_path_to_smartsite_market.md
  - 90_operations/OPS-18b_data_remediation_plan.md
  - _decisions/2026-08-21_all_board_parallel_execution.md
  - _inbox/2026-08-21_sellable_WDLL.md
---

# WDLL: all remaining work on the board

Date: 2026-08-21  Status: approved
Operator approval: 2026-08-21 evening

## Done looks like

SmartSite gold inspect serves every in-scope HOLD family that already has atoms (S1 through S6 live on anonymous inspect; S7 owner on identified inspect only). Command Center heartbeat stays live. Geometry `48135` is scored against a named denominator that excludes the 3791 retired `prop_id` rows, and DC-2 is re-graded from that GET. DC-3 is an honest County Manifest (P-47 so rails we already hold can be scored; unspecified rails stay `not-yet`, never invented). Wave A `--apply` is parked. Roads remainder and other COVER fills resume as background after operator visual QA. Wave C pins do not rise. R-06 is armed in production (executor, trigger, failure, proven by violation). Harris PBF stays out. Typed absence is not minted until the A2 ruling below.

This card is the program. The sellable card (`_inbox/2026-08-21_sellable_WDLL.md`) remains the step-6 heartbeat-plus-atoms slice and is not reopened.

## Operator stamps (this card)

S7 owner: `owner-fact` serves identified-session inspect only. Anonymous browse and anonymous inspect never render owner. Fabricated owner is never acceptable.

A2 absence: HELD. Do not mint typed `absence` and do not copy L7 `--honest-absent` onto wells, pipelines, rail, or mud. Operator still owes L7 facet-only versus the verified pair (`evaluated: true` and non-empty `provenanceScope`). Cells stay `not-yet` until that ruling. This is a stamp that the item exists and is blocked, not a stamp to execute it.

Wave A `--apply`: PARKED 2026-08-22. Foreground is SERVE P-49 through P-54, IDENT P-55, P-47 instrument, then deploy. A-017 Harris PBF stays NO. Resume from `_inbox/2026-08-22_p17_roads_park_pickup.md`.

## Acceptance items

1. S1 special-district (`mud-pid`) on gold inspect reads `special-district-fact`, not a bake table. Check: live gold parcel in a county with those atoms; `data-state` present or honest miss that names the atom. | grade: [ ]
2. S2 pipelines (`texas-rrc`) live on gold inspect or map. Check: layer `live:true` and inspect cites `rrc-pipeline-fact`. | grade: [x]
3. S3 wells live on gold. Check: inspect or map cites `well-fact`. | grade: [x]
4. S4 building footprints live on gold. Check: inspect or map cites `building-footprint`. | grade: [x]
5. S5 rail live on gold. Check: inspect or map cites `rail-corridor-fact`. | grade: [ ]
6. S6 property-boundary-edge live on gold. Check: inspect or map cites that family. | grade: [x]
7. S7 owner on identified inspect only. Check: anonymous inspect has no owner body; identified session shows `owner-fact` or an honest miss that names the atom. Fail if anonymous sees owner. Fail if identified is a CAD-roll bake presented as the atom. | grade: [ ]
8. DC-2 geometry `48135`: denom named in the COVER close (active geo_id count and retired exclusion). Score then ledger recompute. Check: live GET `geometry` cell for `48135` is not the 2026-08-12 5 percent `B2_cp2` row. | grade: [ ]
9. DC-3 instrument: County Manifest is live and honest. Rails with a checked-in spec are scored. Rails without a spec (`kind=unspecified`) stay `not-yet` on a dated GET by field name, never a fabricated coverage row. Harris PBF 0. Roads remainder is not this item. Check: GET field names; P-47 close or an explicit named refuse. | grade: [x]
10. DC-6 Wave B in slot gaps: footprint-28 depth rails named on GET. Not a SERVE substitute. | grade: [ ]
11. Wave C pins: Q8 flood unresolved+mismatch does not exceed 16/100; special-district does not exceed 20/100. New writes use integer grammar; padded form in `externalKeys`; no `:outside` or `:primary` in new `entity_id`; `applies-to` written with the fact; verified-absence pair unfed stays unfed (not widened). Check: writer tests plus a bounded Q8 re-sample. | grade: [ ]
12. R-06 armed. Check: a known violation fails a running job (CI or schedule). `--check-only` does not write `_catalog/canon_divergence.md`. A control that only self-tests has not met this item. | grade: [ ]
13. Slot law held. Check: at most one atoms `--apply` in flight; SERVE close artifacts show zero `--apply`; IDENT backfill did not start while COVER held the slot. | grade: [ ]

## Amendments

- 2026-08-21 evening: opened with operator go on all remaining work, four teams, S7 identified-only, A2 held, Wave A apply in, Harris PBF out.
- 2026-08-22 morning: Wave A `--apply` parked. Foreground SERVE + IDENT + DC-3 instrument, then deploy for visual QA. P-17 halt after 48371. Item 9 re-aimed at the instrument, not roads 254/254. Decision `_decisions/2026-08-22_serve_ident_then_background_cover.md`.
- 2026-08-22 morning: near-term grade card filed `_inbox/2026-08-22_serve_ident_qa_WDLL.md`. Items 2 through 7 on this program card are graded from that card's live probes.
- 2026-08-22: S2 graded from near-term item 3. Inspect is the surface. GIS `texas-rrc` stays `live:false` because overlay fetch is not the atom. Same split as S1 / `mud-pid`.

## Finish card (graded at close)

1. met: live PE GET 2026-08-22T00:47Z gold `48021:34137` `specialDistrictFact.state=absent` `entityId=48021:34137:sd:outside` no MUD; `48021:102817` present MUD The Colony MUD 1C `source=special-district-fact`. Cortex `00533-yop` @100% image `f3f0cd6a` digest `sha256:1ca02303`. PE `dpl_83spQdfHGyhJhq9BvrxmWNCTkdmr`. `mud-pid` GIS stays `live:false`. Evidence `_inbox/2026-08-21_p48_serve_pe_execute.json`.
2. met: inspect cites `rrc-pipeline-fact` on live smartsite.cloud (near-term item 3). Gold present-outside; nearby `48021:10048` `t4permit=05781`. GIS `texas-rrc` stays `live:false` (overlay fetch is not the atom). Same surface split as item 1 / `mud-pid`. Evidence `_inbox/2026-08-22_p49_pe_execute.json`.
3. met: live PE GET gold `48021:34137` cites `well-fact` as `atom-miss` (Bastrop has zero well-fact rows; not a fabricated `:none`). Crane present is a bake hole. `texas-rrc` GIS stays `live:false`. Evidence `_inbox/2026-08-22_p50_pe_execute.json`.
4. met: live PE GET gold `48021:34137` cites `building-footprint` as `atom-miss` (Bastrop has zero building-footprint rows; not a fabricated `:primary`). Anderson present is a bake hole. `texas-rrc` GIS stays `live:false`. Evidence `_inbox/2026-08-22_p51_pe_execute.json`.
5. pending (P-52 parked)
6. met on inspect: live PE GET gold `48021:34137` cites `property-boundary-edge` as present `entityId=48021:34137:boundary:2` `role=front` four edges. GIS outline is not the atom. `texas-rrc` GIS stays `live:false`. Evidence `_inbox/2026-08-22_p53_pe_execute.json`.
7. partial: anonymous live PE GET gold `ownerFact` is `identified-session-required` from `owner-fact` with no owner body. Identified present `48021:34137:2025` not probed (no `pe_session`). GIS `texas-rrc` stays `live:false`. Evidence `_inbox/2026-08-22_p54_pe_execute.json`.
8. met: live GET 2026-08-21T23:50:19.722Z `48135` geometry `honestCoveragePct` 99.96 `displayState=satisfied-present` `artifactPath` `numerator=active-geo_id`. Not B2 5.00. Not 104.95. Evidence `_inbox/2026-08-21_p56_ledger_recompute.json`.
9. met: planner live GET 2026-08-22T19:01:57Z. roads 254/254 not-yet null pct. Harris 48201 not-yet. Unspecified rails zero satisfied-present. Instrument `scripts/p47-manifest-instrument.mjs`. Evidence `_inbox/2026-08-22_p47-manifest_close.json`.
10. pending
11. partial: engine PR 356 merged `29ab77c` 2026-08-22T19:01:58Z. New-write identity on main. Q8 pins not re-sampled. C5 unfed. Backfill not started. Evidence `_inbox/2026-08-22_p55_ident_execute.json`.
12. partial: act-less `ci-baseline.mjs` argv fail-then-restore for the three controls. GitHub Actions has not observed ALARM. canon-divergence stays REPORTING.
13. met: SERVE/IDENT/COVER closes all quote zero atoms `--apply`. No backfill.
