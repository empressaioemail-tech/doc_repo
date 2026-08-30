---
id: 2026-08-30_ctx_facts_complete_WDLL
title: WDLL — Central Texas facts complete (point, named join, named tax year, PE words)
date: 2026-08-30
last_updated: 2026-08-30
status: approved
applies_to: legacy-design-tools (conformant tier 1 bake), hauska-factory (walk point index), hauska-map (PE labels already merged)
plan_row: F-05, F-06, F-08
depends_on: _inbox/2026-08-29_ctx_quality_WDLL.md, _decisions/2026-08-29_ctx_open_situs_join_not_prop_id.md, OPS-19 A-021, A-025, A-026
operator_go: 2026-08-30 ("go" on facts-complete waves)
model_law: 19_the_instrument_contract.md (absent, zero, and unmeasured are three states), ENFORCEMENT.md (never default a field whose correct value is unknown)
snapshot: integration seat P:/doc_repo main; six CTX counties idle on card H production publishes (sha256:7bef3ce7, LDT 889b1556); 534,700 0,0 is a pre-H measure
owner: integration cuts cards; property seat produces diffs; planner commits, pins, and executes Wave R
canvas: C:\Users\cente\.cursor\projects\p-doc-repo\canvases\factory-and-texas-complete.canvas.tsx
---

# Central Texas facts complete

Date: 2026-08-30  Status: approved

A-020 shape measure is met. This card is facts, not rails. Rails (F-11 stamps, F-18 flood on the five, roads, footprint, P-85) are W3 and a later publish. They do not block Wave R.

## Done looks like

A user on smartsite.cloud who opens a parcel on the six sees a join state that names why (`joined`, `joined-situs`, `gate-blocked`, or `no-row`), a usable query point or honest `unmeasured`, and a named tax year or an honest refuse. The brief says `stamp-missing` and `unmeasured` for those wires. Kyle stays recovered or honest. Taylor `gate-blocked` and Laird `stamp-missing` stay passes. Hays and Williamson still refuse a `prop_id` join. The six have one new walked production publish after the bake-input cards merge. Nothing else in Texas starts.

## Waves

W0, now, no store write: post-H recount, PE probe, point-source candidate, tax-year rule. Parallel.

W1, one LDT PR plus one Factory PR: point source in the conformant bake; tax-year selection at bake; Factory indexed parcel point for BP-VALUE-01. Seed stays. Do not invent P-80 here.

W2, only if W0 item 1 splits a Travis cannot-bind class: designed `geo_id` join, merged into the W1 pin if ready.

Wave R, one write: pin `_LDT_SHA`, six staging then six production under A-021, then PE re-probe and a post-R recount.

W3 (out of this card): CTX rails landing. Own later publish.

## Acceptance items

1. **Ruling recorded.** `_decisions/2026-08-30_ctx_facts_complete_waves.md` is active. One rebake after bake-input cards. Rails do not block Wave R. | check: the decision exists and says one rebake, seed stays, P-80 only after the recount split | grade: [met 2026-08-30]

2. **W0 recount.** File-based instrument with self-tests in both directions. Live read of production `place_layer_snapshots` for the six card H `publishRunId`s. Per-county table: conformant rows, join states (`joined` / `joined-situs` / `gate-blocked` / `no-row`), 0,0 sentinel, stamped. Snapshot (commit, host, time) in the output. Pre-H 534,700 is not quoted as the live remainder. | check: `_inbox/2026-08-30_ctx_w0_residue_recount.json` plus the instrument's self-test exit 0 | grade: [met 2026-08-30: live 13:48:33Z; unstamped_sentinel 232770; Travis no-row still 119389; Hays 130663 joined-situs; Williamson 511029 joined-situs; seed leak 0]

3. **W0 PE probe.** Live Property Explorer on smartsite.cloud after hauska-map #310 is on Vercel. 48453:231086 (6102 Laird) brief names `stamp-missing`. 48453:493738 (4707 Shoalwood) brief names `unmeasured`. Facets-only is not this item. If Vercel has not picked up main, file that as partial with the serving commit. | check: probe notes in `_inbox/2026-08-30_ctx_w0_pe_probe.json` | grade: [partial 2026-08-30: wire stamp-missing / unmeasured; PE still says not-stamped]

4. **W0 point-source candidate named.** One ordered source list. First source that can ride the existing owner-gated situs path. P-80 only for a cannot-bind remainder the recount names. | check: `_inbox/2026-08-30_ctx_w0_point_source.md` | grade: [met 2026-08-30]

5. **W0 tax-year rule drafted.** Named selection. Silent last-wins is the defect. A parcel with two years that disagree on a load-bearing field refuses rather than overwriting. | check: `_inbox/2026-08-30_ctx_w0_tax_year.md` | grade: [met 2026-08-30]

6. **W1 LDT bake.** Point source and tax-year selection land in the conformant bake. Tests still fail a `prop_id` join on 48209 and 48491. Seed unlifted. | check: LDT PR citing items 6; fail-then-pass fixtures | grade: [ ]

7. **W1 Factory walk point.** An indexed Factory-side parcel point so BP-VALUE-01 is not shared-input. | check: Factory PR citing item 7 | grade: [ ]

8. **W2 or drop.** If item 2 names a Travis cannot-bind class, P-80 is designed then coded and merged into the W1 pin if ready. If the recount shows situs-recoverable leftover only, this item is dropped with that evidence. | check: amendment or P-80 PR | grade: [ ]

9. **Wave R.** One publish image. Six staging `walkVerdict pass`, then six production under A-021. Golds: 48021:34137 stamped; 48209:135570 `joined-situs` or honest `gate-blocked`; 48491:76149 never `parcelJoin.state: joined`; 48453:493738 honest `no-row` unless a named source bound it; 48453:231086 `stamp-missing` for Austin. | check: six production close lines and live gold probes | grade: [ ]

10. **Post-R grade.** Recount instrument re-run on the Wave R `publishRunId`s. PE re-probe of Laird and Shoalwood. | check: post-R JSON plus PE notes | grade: [ ]

## Amendments

1. 2026-08-30: W2 stays parked until W1 extends owner-gated situs to 48453 / 48021 / 48055 leftover no-row. The recount names Travis 119,389 as still `no-row` (unchanged from pre-H). That class has not had a situs attempt. Do not code P-80 inside W1.

## Finish card (graded at close)

(ungraded)

## Do not

- Lift `LANDUSE_JOIN_DISABLED_FIPS_SEED` or join 48209 / 48491 on `prop_id`.
- Bake the six twice inside this card.
- Start W1 before items 2 to 5 exist.
- Invent a Travis `geo_id` join inside W1.
- Restart `scllr`, F-09, or F-10 254.
- Hold Wave R for W3 rails.
- Bake from a laptop or an unmerged branch.
- Write to a store from a subagent.
- Touch smartcity-os.
- Import the SmartCity kit onto PE.
