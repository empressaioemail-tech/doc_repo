---
id: 2026-08-29_ctx_quality_WDLL
title: WDLL — Central Texas quality: PE labels, situs recovery on the conformant bake, one publish wave
date: 2026-08-29
last_updated: 2026-08-29
status: approved
applies_to: hauska-map (apps/property-explorer layer-absence), legacy-design-tools (conformant tier 1 bake), hauska-factory (register note only)
plan_row: F-05, F-06, F-08
depends_on: OPS-19 A-021 (standing production word), A-025 (full facet set), card F (containment verdicts), _decisions/2026-08-29_ctx_open_situs_join_not_prop_id.md
operator_go: 2026-08-29 ("open the join"; "spawn sub agents and take care of the six")
model_law: 19_the_instrument_contract.md (absent, zero, and unmeasured are three states), ENFORCEMENT.md (never default a field whose correct value is unknown; a meaning-shaped check has two independently derived inputs)
snapshot: integration seat P:/doc_repo main 2847a20; six CTX counties idle on the card F bake (publish image 1b10d7e7); Hays and Williamson entirely gate-blocked on prop_id; 534,700 unstamped rows on the 0,0 sentinel (card F CP1)
owner: planner-run subagents; planner commits, merges, canaries, rebuilds the publish image, and executes the six under A-021
---

# Central Texas quality

Date: 2026-08-29  Status: approved

The six are Factory-done. They are not customer-done. Two counties have no stamp because the conformant bake refuses the fabricating `prop_id` join and never runs the situs recovery the old bake already has. The brief cannot name `stamp-missing` or `unmeasured`. One more bake of the six, after the recovery lands, is the write. PE labels ship on their own path and do not wait for that bake.

## Done looks like

A user on smartsite.cloud who opens 275 Cibolo Creek Dr, Kyle and 1804 Davis St, Taylor sees a land-use and a zoning verdict that came from an owner-gated situs join, not a declined `prop_id` collision. A user who opens 6102 Laird Dr still sees `stamp-missing` for Austin. A user who opens a parcel the bake still cannot point sees `unmeasured`, and the brief says that word. Hays and Williamson still refuse a `prop_id` join. The six have one new walked production publish after the bake change. Nothing else in Texas starts.

## Waves (what is parallel, what is one write)

Wave 0, now, no store write: card G (PE labels) and the Travis written-versus-rows recon. These do not share a path with the bake.

Wave 1, one LDT PR, one publish image, one bake of the six: card H. Situs recovery for land use, a situs-keyed `txgio_parcel` fetch for ring and query point on the two blocked counties, `parcelJoin.state` that names the recovery, tests that still fail a `prop_id` join on 48209 and 48491. Point source for the remaining no-row sentinels (Travis 119k, Bastrop and Caldwell leftovers) is in scope only when the same situs or named geometry source can ride this bake. P-80 Travis cannot-bind stays out.

Wave 2, planner-run after H merges: staging sibling then production for each of the six under A-021. Concurrent staging is allowed. Production follows each passed walk. Do not bake twice.

Out of this card: F-09, F-10 254, F-11, P-85, PE setbacks, F-08 R1 envelope routing.

## Acceptance items

1. **Ruling recorded.** `_decisions/2026-08-29_ctx_open_situs_join_not_prop_id.md` is active. OPS-19 A-026 cites it. | check: both files exist and say situs recovery, not seed lift | grade: [ ]

2. **Card G (PE labels).** See `_inbox/2026-08-29_ctx_g_pe_labels_WDLL.md`. Independent. | check: that card's items | grade: [met 2026-08-29 planner: hauska-map #310 merged 1a00b27; CI SUCCESS on test, Typecheck, No double-encoded source]

3. **Card H (situs recovery on the conformant bake).** See `_inbox/2026-08-29_ctx_h_situs_recovery_WDLL.md`. The one write path. | check: that card's items | grade: [partial 2026-08-29 planner: LDT #548 merged 889b1556; seed unlifted; item 1 live SELECT not run; bake after publish pin]

4. **Travis recon filed.** Written 873,766 versus 500,307 rows: one snapshot per parcel node, or a named defect. Read-only. No write. | check: `_inbox/2026-08-29_ctx_travis_recon.json` with snapshot and the two counts | grade: [met 2026-08-29 planner review: different units; store healthy; session's many-nodes mechanism rejected]

5. **One publish wave of the six.** After H merges and the publish image pins the LDT SHA: staging sibling then production per county under A-021, gold plus area sweep, content walk. Golds: 48021:34137 or 48021:34729 stays stamped; 48309:176914 `stamp-missing` or stamped; 48209:135570 and 48491:76149 recovered or honest-unmeasured with `parcelJoin` naming why; 48453:493738 still no-row unless a named source bound it; 48453 Laird still `stamp-missing` for Austin. | check: six production `publish_runs` rows, six passed walks, live gold probes | grade: [partial 2026-08-29 planner: image live sha256:7bef3ce7; six staging executions running 9zhz6/plnvw/hrv8w/zp2kw/8d5td/9kspw; production not started]

## Amendments

1. 2026-08-29: Wave 2 follows `_inbox/2026-08-29_ctx_h_land_process.md`. The live board is the Land view on the Factory and Texas complete canvas. Score from the execution close line and the live site. Promote one county at a time. Hays and Williamson last. Do not lift the seed.

## Finish card (graded at close)

(ungraded)

## Do not

- Lift `LANDUSE_JOIN_DISABLED_FIPS_SEED` or join 48209 / 48491 on `prop_id`.
- Restart `scllr`, F-09, wave 1 remainder, or a 254 loop.
- Bake from a laptop. Bake from an unmerged branch.
- Write to a store from a subagent. Subagents do not commit, push, deploy, or execute jobs.
- Invent a Travis `geo_id` join (P-80).
- Touch smartcity-os.
- Import the SmartCity kit onto PE.
