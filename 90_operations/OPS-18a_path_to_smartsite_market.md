---
id: OPS-18a_path_to_smartsite_market
title: Path to Smart Site market — structural then data
status: active
last_updated: 2026-08-22
applies_to: portfolio
owner: nick
related:
  - 90_operations/OPS-18_canon_reconciliation_plan_of_record
  - 90_operations/OPS-16_texas_market_plan_of_record
  - _decisions/2026-08-21_smartsite_gtm_via_structural_then_data
  - _decisions/2026-08-17_qa_launch_current_map
  - _decisions/2026-08-17_smartsite_gtm_pipedrive_popup_hobby
  - _decisions/2026-08-09_texas_flush_launch_gate
  - _blueprint/00_WDLL
  - 90_operations/OPS-18b_data_remediation_plan
  - 90_operations/OPS-18c_parallel_execution
  - _decisions/2026-08-21_all_board_parallel_execution
  - _inbox/2026-08-21_ops18_all_board_WDLL.md
---

# Path to Smart Site market

This is the standing sequence from the 2026-08-21 regroup. Refer here, not to chat.

Desired end: Smart Site **sellable** in Texas, then Texas-flush remaining DCs honest. Sellable is not GTM chrome and is not Texas-flush 254/254. Operator 2026-08-21: (1) a live heartbeat on the Command Center County Manifest, (2) every property-spine atom we already store serving its parcel on SmartSite. Decision `_decisions/2026-08-21_sellable_is_cc_heartbeat_and_atoms_on_parcels.md`. WDLL `_inbox/2026-08-21_sellable_WDLL.md`.

Operator 2026-08-21 evening: sellable met is not program complete. All remaining work is on the board. Fan plan `90_operations/OPS-18c_parallel_execution.md`. Program WDLL `_inbox/2026-08-21_ops18_all_board_WDLL.md`. Decision `_decisions/2026-08-21_all_board_parallel_execution.md`.

Texas flush measured-everywhere remains the later launch claim. Filled-everywhere remains program completion. Dashboards is parked. G-103 and G-104 are not this wave.

## Why this order

Chasing GTM fires hid operational and data defects. The defects were ungradable: launch criteria that cannot go red, a blueprint that failed its own WDLL, edges and keys that exist and are unfed. OPS-18 is the structural pass that makes those defects addressable. It is not a substitute for fixing them.

## Sequence

| Step | What | Plan row | Status 2026-08-21 |
| --- | --- | --- | --- |
| 1 | Standard binds. Blueprint passes its own WDLL. | R-01 | CLOSED. Listing 238 = mesh 238. |
| 2 | Thin wiring. Three R-06 controls, proven by violation. | R-06 | PARTIAL. Three scripts landed, self-tests ok, no baselineExit raised. CI still cannot see a live canon-divergence alarm (no sibling clones). |
| 3 | Launch instrument live. Traffic, then recompute, then binding wire. | R-09 | CLOSED live. Serving `cortex-api-00527-yic` @100% digest `sha256:83fd0dc6` (merge `f67c11f9`, PR 448). Latest GET `computedAt` 2026-08-21T18:05:57.209Z after the flood-score recompute. `derivation-indeterminate` 0. |
| 4 | Grade the store you already audited. No second census. | R-07 | CLOSED as the grade. `_inbox/2026-08-21_r07_store_grade.md`: 31 Qs, 9 launch-critical. No second census. |
| 5 | Remediation plan ordered by what the now-honest launch DCs fail on. | R-08 | PLAN CLOSED. Execution in flight. Flood 76 missing-row FIPS scored (P-08). Ector parcel-nodes re-keyed geo_id (P-02 apply 75859 active / 3791 retired). DC-2 still FAIL: geometry `48135` not rescored. DC-3 still FAIL on roads/footprint/wells/pipelines/rail 254, flood 92, mud 45, geometry 1. |
| 6 | Sellable as redefined. CC heartbeat plus existing atoms on SmartSite parcels. | OPS-18a / P-08 serve | MET as the slice. Heartbeat live. Flood inspect live. Land-use inspect live (LDT [450](https://github.com/empressaioemail-tech/legacy-design-tools/pull/450) serving `cortex-api-00531-fus`, hauska-map [176](https://github.com/empressaioemail-tech/hauska-map/pull/176) PE `dpl_JHohCzrJs4JRnbTjy7HFg9eqNBuc`). Gold Land use cites `land-use-fact`. Empty Manifest cells are coverage. Checkout polish is not this gate. Not program complete. |
| 7 | Remaining board. HOLD families, Wave A/B/C, R-06 armed. Four teams. | P-48..P-56, R-06, P-47 | THIS WAVE, reordered 2026-08-22. Foreground: SERVE P-49..P-54, IDENT P-55, DC-3 instrument P-47, then deploy for visual QA. COVER `--apply` parked (P-17 halt after 48371). Pickup `_inbox/2026-08-22_p17_roads_park_pickup.md`. Decision `_decisions/2026-08-22_serve_ident_then_background_cover.md`. |

R-02b (quarantine against the bounded canon set) rides with this regroup because it was gated on R-01. It is not a new program.

## Operator rulings that bind this path (approved 2026-08-21)

1. Traffic then recompute. 100% to `cortex-api-00525-bev` first. Confirm GET still shows the pre-R-09 `computedAt`. Then non-dry recompute from that revision with `probe=skip`. Do not recompute while `00522-row` is serving. Decision `_decisions/2026-08-21_r09_traffic_then_recompute.md`.
2. Unmeasured stays distinct. Do not fold `derivation-indeterminate` into DC-4 `no-atom` or DC-5 `no-writer`. Decision `_decisions/2026-08-21_dc4_dc5_unmeasured_stays_distinct.md`.
3. ADR-028 accepted-partial. Verified-absence pair is real. `knowledge_atoms` is not production bitemporal proof. Follow-on ADR owed for 1.9.0 through 1.22.0. Decision `_decisions/2026-08-21_adr028_accept_partial.md`.
4. Sellable is CC heartbeat plus existing atoms on parcels. Decision `_decisions/2026-08-21_sellable_is_cc_heartbeat_and_atoms_on_parcels.md`.
5. All remaining work on the board as four teams. Wave A `--apply` PARKED 2026-08-22 (was in). Harris PBF out. S7 owner identified inspect only. A2 honest-absent held until L7 vs pair. Foreground SERVE + IDENT + DC-3 instrument. Decisions `_decisions/2026-08-21_all_board_parallel_execution.md` and `_decisions/2026-08-22_serve_ident_then_background_cover.md`.

## What this wave is not

Not Dashboards. Not a hasWriter planner chase (the binding table already ships; CI already proves the scripts exist; that wire is property after traffic). Not minting absence atoms (A2 held). Not a new store audit that re-runs COUNT(*) on 100M atoms. Not folding R-06 into OPS-16. Not retiring OPS-18 before R-08. Not Harris PBF. Not treating Pipedrive or Stripe amounts as sellable. Not treating sellable WDLL 1-6 as OPS-18 done.

## Launch-critical defect classes waiting for step 5

Named so R-08 does not start from a blank page. Evidence is the 2026-08-20 store audit and the blueprint V-set.

- Dual parcel key grammars. Roughly one fact atom in six cannot reach its parcel. BP-PARCEL-KEY-01.
- Sentinels inside primary identity keys (`sd:outside`, `footprint:primary`). BP-KEY-SENTINEL-01.
- `situsAddress` `", ,"` counted as populated. BP-ADDRESS-01.
- Flood consumer never repointed after tier2 retirement. BP-SERVE-01.
- `atom_links` holds no property edges. BP-EDGE-01.
- Verified-absence pair shipped and unfed. BP-ABSENCE-01.
- Canonical keys borrowed, `externalKeys` empty. BP-KEY-01.
- Writers / unmeasured cells on the ledger once R-09 is live. BP-LEDGER-01.

## Reversal

Reverse the Dashboards park if a named municipal demo is the next paid motion. Reverse current-map launch if a named QA session finds a missing layer that makes the inspect card un-demoable. Do not reverse OPS-18 into a permanent third program; retire it at R-08 close.

## Regroup 1-4 WDLL (operator go 2026-08-21)

Done looks like: the path above is a tracked file, steps 1-4 have artifacts a stranger can grade, and step 5 has an ordered defect list rather than a fire queue.

### Acceptance

1. This file exists and OPS-18 points at it. Check: `_decisions/2026-08-21_smartsite_gtm_via_structural_then_data.md` related_canonical includes this path.
2. Operator rulings 1-3 are stamped approved on their decision records.
3. R-06 three controls exist as files, each shown to fail, none of them implemented by raising `baselineExit`. Check: `--check-only` on canon-divergence does not write `_catalog/canon_divergence.md`; tooling_register schema refuses a row missing executor/trigger/failure/bypass; factory detector refuses a `kind=factory` row with `terminationCondition` NONE or empty.
4. R-09 live GET on the serving revision shows named cells where `hasWriter`, `atomFamilyState`, or `isPartial` take a second value. Traffic read as JSON by field name. Image digest on the serving revision equals `sha256:fb022229b5b2d59a7d56d549e1e01f8cb6d51ce40299fdda7806b4d1694a2141` (or a later pin named in the close). A 504 on recompute is not a failure; `computedAt` on the subsequent GET is.
5. R-07 grades the existing store audit against the mesh. Every Q in `_inbox/2026-08-20_store_audit_atom_graph.md` maps to a BP-* id. No new full-table COUNT(*).
6. R-02b: `_quarantine/README.md` no longer says the mesh is 60 against an unbounded set. Remaining safe duplicate-id two-bodies are moved or named why held. ADR-028 is amended, not quarantined.

### Amendments

- 2026-08-21: opened with operator go on the path and on rulings 1-3.
- 2026-08-21 afternoon: flood 76 scored, P-02 applied, ledger recomputed to 18:05Z.
- 2026-08-21 afternoon: sellable redefined as CC heartbeat plus existing atoms on parcels. Step 6 is that gate, not GTM chrome.
- 2026-08-21 evening: land-use pair live. Cortex `00531-fus`, PE deploy `dpl_JHohCzrJs4JRnbTjy7HFg9eqNBuc`. Manifest cells unchanged, as expected.
- 2026-08-21 evening: remaining board opened. Step 7. OPS-18c plus program WDLL plus OPS-16 A-021 (P-48 through P-56). Compiles not yet run.
