---
id: 2026-08-30_ctx_facts_complete_WDLL
title: WDLL — Central Texas complete (last facet bake of the six)
date: 2026-08-30
last_updated: 2026-08-30
status: amended
applies_to: legacy-design-tools (conformant tier 1 bake), hauska-factory (walk grades, alias persist), hauska-map (PE wiring)
plan_row: F-05, F-06, F-08, F-10, F-16
depends_on: _inbox/2026-08-29_ctx_quality_WDLL.md, _decisions/2026-08-29_ctx_open_situs_join_not_prop_id.md, _decisions/2026-08-30_ctx_one_more_bake.md, _decisions/2026-08-30_ctx_complete_or_absent.md, _decisions/2026-08-30_ctx_cad_txgio_alias.md, _inbox/2026-08-30_ctx_parallel_waves.md, OPS-19 A-021, A-025, A-026, A-027, A-028, A-029
operator_go: 2026-08-30 ("one more pass, Central Texas complete, one bake, do not rebake")
model_law: 19_the_instrument_contract.md (absent, zero, and unmeasured are three states), ENFORCEMENT.md (never default a field whose correct value is unknown)
snapshot: integration seat P:/doc_repo main 62aefa4; six CTX counties idle on card H production publishes (sha256:7bef3ce7, LDT 889b1556); parallel waves filed; no bake
owner: integration cuts cards; property seat produces diffs; planner commits, pins, and executes Wave R
canvas: C:\Users\cente\.cursor\projects\p-doc-repo\canvases\factory-and-texas-complete.canvas.tsx
---

# Central Texas complete (last facet bake)

Date: 2026-08-30  Status: amended

A-020 shape measure is met. This umbrella is the last production publish of the six. Complete is a finished dataset or a named honest absence (A-028). Waves and lane split: `_inbox/2026-08-30_ctx_parallel_waves.md`.

## Done looks like

A user on smartsite.cloud who opens a parcel on the six sees a named join state, an honest point, land use or absent-verified, a named tax year, and PE words that match the wire. Successful CAD to TxGIO binds persist as aliases; Wave R reads that map first. Rails that have a source are on the brief (well-fact, footprint, flood, setbacks where a table exists, easement GIS where a layer exists). Rails that do not have a source name the absence. Gate-blocked rows do not keep a lying point. PDD has no invented feet. Pine has no invented well. One production publish after prep verifies. No second snapshot write.

## Waves

See `_inbox/2026-08-30_ctx_execute_waves_WDLL.md`. Short form: P0 truth, P1 controls, P2 substrate + alias long pole (P2b PE parallel), P3 absence (826,569), P4 rails, P5 scrub, P6 pin, P7 Wave R, P8 prove. W2 / P-80 stays parked. This file's title still says "facts complete"; the program is the last production publish, not county-complete.

## Acceptance items

1. **Ruling recorded.** `_decisions/2026-08-30_ctx_one_more_bake.md` is active. One bake after bake-input cards. Seed stays. P-80 parked. | check: the decision exists and says one bake, expand under the umbrella, no second bake | grade: [met 2026-08-30 on the waves decision; re-grade: met 2026-08-30 on the one-more-bake decision]

2. **W0 recount.** File-based instrument with self-tests in both directions. Live read of production `place_layer_snapshots` for the six card H `publishRunId`s. Per-county table: conformant rows, join states (`joined` / `joined-situs` / `gate-blocked` / `no-row`), 0,0 sentinel, stamped. Snapshot (commit, host, time) in the output. Pre-H 534,700 is not quoted as the live remainder. | check: `_inbox/2026-08-30_ctx_w0_residue_recount.json` plus the instrument's self-test exit 0 | grade: [met 2026-08-30: live 13:48:33Z; unstamped_sentinel 232770; Travis no-row still 119389; Hays 130663 joined-situs; Williamson 511029 joined-situs; seed leak 0. Remainder review: numbers reconcile; instrument does not establish them. Repair before item 10.]

3. **W0 PE probe.** Live Property Explorer on smartsite.cloud. 48453:231086 brief names `stamp-missing`. 48453:493738 brief names `unmeasured`. Facets-only is not this item. | check: probe notes in `_inbox/2026-08-30_ctx_w0_pe_probe.json` | grade: [partial 2026-08-30: wire stamp-missing / unmeasured; PE still says not-stamped. Remainder review: missing change, not deploy lag. Owned by the PE card.]

4. **W0 point-source candidate named.** One ordered source list. First source that can ride the existing owner-gated situs path. P-80 only for a cannot-bind remainder the recount names. | check: `_inbox/2026-08-30_ctx_w0_point_source.md` | grade: [met 2026-08-30. Remainder review: list omitted txgio_address and the 58,461 inherited centroids. Centroids now W1 item 6.]

5. **W0 tax-year rule drafted.** Named selection. Silent last-wins is the defect. A parcel with two years that disagree on a load-bearing field refuses rather than overwriting. | check: `_inbox/2026-08-30_ctx_w0_tax_year.md` | grade: [met 2026-08-30. Remainder review: the live defect is arbitrary-wins, not last-wins. W0 rule still correct.]

6. **W1 LDT bake.** See `_inbox/2026-08-30_ctx_w1_bake_WDLL.md`. Situs recovery (if W0b go), tax year, landUse from the named source, upsert fail-closed. Tests still fail a `prop_id` join on 48209 and 48491. Seed unlifted. | check: LDT PR citing this item and the W1 card items | grade: [ ]

7. **W1-walk Factory grades.** See `_inbox/2026-08-30_ctx_walk_scrub_WDLL.md`. Not a missing sibling. | check: Factory PR citing this item | grade: [ ]

8. **W2 or drop.** Parked. W0b / W1 situs-extend is the leftover-no-row attempt. P-80 is F-10, not this card. | check: dropped with W0b evidence or a later F-10 card | grade: [ ]

9. **Wave R.** One publish image carrying the W1 pin, the walk grades, and alias persist items 3 and 7 green. Determinism gate (same county twice, empty body diff) before staging. Six staging `walkVerdict pass` including S4 and S5. Six production under A-021. Refusal fixtures green. Per-county GRADE LOG row (revision, run id, freshness stamp). Golds: 48021:34137 stamped with landUse not null-as-absent; 48021:8720522 PDD with setbacks refused honestly; 48209:135570 `joined-situs` or honest `gate-blocked`; 48491:76149 never `parcelJoin.state: joined`; 48453:493738 honest `no-row` unless a named source bound it; 48453:231086 `stamp-missing` for Austin. | check: six production close lines, GRADE LOG rows, live gold probes | grade: [ ]

10. **Post-R grade.** Recount instrument repaired (write guard, run-time commit, host, publishRunId assert, ownersAgree column) then re-run on the Wave R `publishRunId`s. PE live grade of Laird, Shoalwood, Rainmaker, Pine. | check: post-R JSON plus `_inbox/2026-08-30_ctx_pe_live.json` | grade: [ ]

11. **W0b pre-bake review.** See `_inbox/2026-08-30_ctx_w0b_prebake_review_WDLL.md`. Blocks item 6 (W1 LDT) only. Does not block items 7 or 12. | check: that card's items | grade: [ ]

12. **PE wiring.** See `_inbox/2026-08-30_ctx_pe_wiring_WDLL.md`. Band 0 after operator review. Does not block item 9. Blocks this card's close. | check: that card's items | grade: [ ]

13. **CAD to TxGIO alias persist.** See `_inbox/2026-08-30_ctx_w1_alias_WDLL.md`. Backfill card H `joined-situs`, persist W1 new binds, bake reads alias first. Gates Wave R. | check: that card's items 3 and 7 | grade: [ ]

## Amendments

1. 2026-08-30: W2 stays parked until W1 extends owner-gated situs to 48453 / 48021 / 48055 leftover no-row. The recount names Travis 119,389 as still `no-row` (unchanged from pre-H). That class has not had a situs attempt. Do not code P-80 inside W1.

2. 2026-08-30: Operator one-more-bake lock. Rename from facts-complete. Add W0b, landUse, upsert fail-closed, PE card, walk card. Wave R is the last bake of the six. Rails stay out of the denominator. Reason: remainder review plus operator "one more pass, Central Texas complete, do not rebake."

3. 2026-08-30: Rails-out reversed (A-028). Complete is a finished dataset or named honest absence. RRC surfaces this pass. W3 gates Wave R. Reason: operator "not complete without these fields; prep then verify then bake."

4. 2026-08-30: Parallel wave plan filed. W0b blocks W1 LDT only. Walk, PE, and W3 schema start together after review. Reason: operator "as much happening in parallel as possible."

5. 2026-08-30: Durable CAD to TxGIO alias (A-029). Item 13. Wave R reads the map. Reason: operator yes to persist successful situs binds.

6. 2026-08-30: Execute waves P0–P8 replace Band C / Band 1 as the schedule. Measured owe. Do not apply 0005. Reason: collect review refuse + operator tee-up.

## Finish card (graded at close)

(ungraded)

leave_behind:
- item: leftover no-row after W1 situs-extend (cannot-bind remainder)
  owner: property seat
  plan_row: F-10 / P-80
- item: municipal zoning stamp tables beyond sourced setbacks
  owner: property seat
  plan_row: F-11
- item: F-09 217 / F-10 254 / Harris PBF / scllr
  owner: planner
  plan_row: F-09 / F-10

## Do not

- Lift `LANDUSE_JOIN_DISABLED_FIPS_SEED` or join 48209 / 48491 on `prop_id`.
- Bake the six twice inside this card.
- Start W1 LDT before W0b items 1 and 2 grade. Walk, PE, and W3 schema start after the operator review of the parallel wave plan.
- Invent a Travis `geo_id` join inside W1.
- Write an alias from address match without `ownersAgree`, or treat snapshot `joined-situs` as the map after A-029.
- Restart `scllr`, F-09, or F-10 254.
- Start Wave R before execute-waves P5 and P6 pass.
- Apply 0005 as drafted or re-run landing-import.
- Call a zero atom count complete.
- Bake from a laptop or an unmerged branch.
- Write to a store from a subagent.
- Touch smartcity-os.
- Import the SmartCity kit onto PE.
- Run the W0 recount `--self-test` against the live JSON until the write guard exists.
---
