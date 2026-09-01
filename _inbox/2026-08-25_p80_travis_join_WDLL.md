---
id: 2026-08-25_p80_travis_join_WDLL
title: P-80 Travis join fix (prop_id bind or cannot-bind proof)
status: draft
date: 2026-08-25
plan_row: P-80
operator_go: named 2026-08-25 (Travis join P-80; this pack cards the join fix, not another honest-miss)
parent_wdll: _inbox/2026-08-24_parcel_facts_write_path_WDLL.md
supersedes: _inbox/2026-08-24_lane3_travis_identity_join_WDLL.md
depends_on:
  - _inbox/2026-08-24_travis_block_completeness_diagnosis.md
  - _inbox/2026-08-24_parcel_facts_write_path_game_plan.md
  - _inbox/2026-08-25_p77_honest_miss_close.json
  - scripts/p77-travis-join-measure.mjs
snapshot: P:/doc_repo main 9753b830a8e929ba1b59e625a2c60e50712ebcc0
---

# WDLL: P-80 Travis join fix

This is the JOIN FIX card. It is not a second honest-miss card. P-77 already measured the named miss and shipped `lookup-failed` + vintage `2026/cad-export` on serving cortex `00584-gaf` SHA `46e1a5a1`.

Join is `(county_fips, normalizeCadPropId(prop_id))` at declared vintage. Do not invent `geo_id`. Do not load Travis CAMA. Do not invent sqft. Registry `join_key: geo_id_or_address_crosswalk` is not implemented and is not this card.

## Done looks like

`48453:280238` is proven cannot-bind on `prop_id` without CAMA or a `geo_id` invent, or it binds from a public CAD source that actually carries `PROP_ID=280238`. The ~51% Travis cohort is split the same way: REST-present / store-miss nodes may gap-fill on `prop_id`; REST-absent nodes stay `lookup-failed`. Neighbors stay joined. A facet rebake follows only a real `cad_property` write. `prop_id_bad_rate` 0.51 is not the grade.

## Mechanism (280238)

Believed: 280238 is a StratMap / PMTiles `parcel_node_id` whose `PROP_ID` is absent from the loaded `2026/cad-export` `cad_property` roll and from the live TCAD REST layer. It is a fabric-only identity. That is why facets are `lookup-failed` and why a CAMA load will not create the bind.

Second mechanism that looks the same: a key-shape miss (leading zeros) or an upsert miss of a REST-present `PROP_ID`. Either also yields map node plus no `cad_property` row. Rejected because P-77 graded 280238 `miss` with `leading_zero_orphan=false` and `vintage-gap=0`, neighbors `280239` / `280210` / `280211` HIT on the same key, and live TCAD REST `PROP_ID=280238` returned `features=[]` while the `280239` control returned one feature. An ingest miss of a roll-present parcel is not this node.

Game plan Wave 6 P-80 named "crosswalk and/or TCAD gap-fill + facet rebake." Crosswalk here would be a `geo_id` invent. Gap-fill cannot add 280238 because REST has no `PROP_ID=280238`. Rebake does not create a row. The remaining fix is the cohort split plus gap-fill only where REST has the `PROP_ID`.

## Bindability without CAMA

**280238: no.** Not on `cad_property` at `2026/cad-export` (P-77). Not on live TCAD REST `PROP_ID` (this pack). CAMA keys CAD account and does not bind StratMap-only nodes (P-73 T48453 CAMA row; game plan constraint 6). A `geo_id` invent is forbidden.

A later P-80 write may bind other Travis nodes that are REST-present and store-miss. That path is still `prop_id`. It is not 280238.

## Acceptance items

P-77-met (already met; not re-opened):

1. **280238 classified honest miss.** Facets for `48453:280238` emit `lookup-failed` naming `cad_property` declared vintage `2026/cad-export`. | check: live facets | grade: [met 2026-08-25T14:14:55Z] cortex `00584-gaf` SHA `46e1a5a1`; close `_inbox/2026-08-25_p77_honest_miss_close.json`

2. **Joined neighbors stay joined (P-77 baseline).** `48453:280239` and Dashwood `280210` have `cad_property` / land-use coverage. | check: same live gold | grade: [met 2026-08-25T14:14:55Z] 280239 landUse A1; 280210 situs `17006 DASHWOOD CREEK DR`; same close

3. **Miss rate measured on the named block.** Instrument reports hit / miss / vintage-gap / unmeasured. `prop_id_bad_rate` 0.51 is not the grade. | check: `scripts/p77-travis-join-measure.mjs --live` | grade: [met 2026-08-25T02:08:37Z] 10/1/0/0; miss `48453:280238`; report `_inbox/2026-08-24_p77_travis_join_measure.json`

4. **No silent empty card.** A map node without a CAD row does not render as a successful identity-only sheet that omits the miss. | check: inspect / facets copy on 280238 | grade: [met 2026-08-25T14:14:55Z] `structuralFact.verdict=lookup-failed` + vintage; same P-77 close

Remaining join work (this card):

5. **280238 bind-or-cannot-bind on `prop_id`.** A file-based instrument queries a public CAD source by `PROP_ID=280238` (named-id only) and the `280239` control. Both directions must be shown: miss empty, control present. If the source has the id, the bind path is `cad_property` upsert at `2026/cad-export` on `prop_id`. If it does not, file cannot-bind and do not write a row. | check: instrument self-test both directions + live named-id JSON | grade: [partial 2026-08-25] directional REST probe `_inbox/2026-08-25_p80_280238_tcad_rest_named_id.json` (280238 `features=[]`, 280239 one feature). Promote to a file-based instrument that fails on a known violation before close.

6. **Cohort split, not a guessed 51%.** A stated Travis sample of store-miss nodes is graded REST-present / REST-absent / unmeasured. Named IDs only. No 48453 table scan. `prop_id_bad_rate` 0.51 is the size of the job, not the grade. | check: file-based instrument + snapshot | grade: [ ]

7. **Gap-fill only REST-present store-miss, and only on `prop_id`.** If item 6 finds that class, upsert `cad_property` at declared vintage via the existing cad-export / REST-by-`PROP_ID` path. Re-grade those named IDs with `scripts/p77-travis-join-measure.mjs`. Do not upsert 280238. | check: before/after named-id EXISTS; instrument HIT only where REST had the id | grade: [ ]

8. **Neighbors stay joined after any write.** `48453:280239` and at least one of `280210` / `280211` remain HIT at `2026/cad-export`. Gold `48021:34137` does not regress. | check: same P-77 instrument plus gold facets | grade: [ ]

9. **Facet rebake follows a real write, not a hope.** If item 7 writes rows, live facets for a newly bound node show a CAD hit, not `lookup-failed`. 280238 stays `lookup-failed` + vintage unless item 5 is reversed by a source feature. HTTP 200 is not a bind. | check: live facets on one new HIT and on 280238 | grade: [ ]

10. **Out of this card.** Do not invent sqft. Do not invent `geo_id` as the join. Do not load Travis CAMA. Do not run leftover apply, atoms `--apply`, rematerialize, or L17 flip. Do not start P-79 as a join key. Do not copy Find onto CAD situs (P-74). | check: pathspec + close `notStarted` | grade: [ ]

## Do not

- Treat P-77 honest-miss as the P-80 fix
- Implement registry `geo_id_or_address_crosswalk`
- Start Travis CAMA to "catch" 280238
- Collapse this with situs bind or footprint
- County-wide `cad_property` or REST scan

## Amendments

- 2026-08-25: filed as P-80 join-fix card. Draft `_inbox/2026-08-24_lane3_travis_identity_join_WDLL.md` (plan_row P-60) superseded. Items 1-4 graded met from P-77. Reason: operator named Travis join (P-80); remaining work is bind-or-cannot-bind, not another honesty ship.

## Finish card (graded at close)

Not graded. This pack cards the work. Implementation is property / LDT.
