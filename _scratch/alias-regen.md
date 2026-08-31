# alias-regen scratch (F-01, F-11)

## GROUND-TRUTH 2026-08-31T19:15Z
- planner: P:/doc_repo on main b2800f6
- factory: P:/tmp/hauska-factory-alias-regen feat/alias-regen HEAD 5f9acc3
- start seed sha256 measured: 7f384d0dcbeb1eeb8c47b7e51732871fb5a07ae26e5360dd09fc42dacd685394 MATCH

## GROUND-TRUTH 2026-08-31T19:25Z
- Reproduction against unmodified master_raw.tsv + adjacency.txt: sha256 7f384d0dcbeb1eeb8c47b7e51732871fb5a07ae26e5360dd09fc42dacd685394 REPRO_MATCH
- 225 / 33 certain / 93 likely / 99 needs-human

## GROUND-TRUTH 2026-08-31T19:35Z
- Falsifier 1 on current seed: FAIL violations=2 (eddy, bruceville). Self-test both directions passed first.
- Falsifiers stated in CP1 before any regen.

## GROUND-TRUTH 2026-08-31T19:45Z
- After component index: seed sha256 d3f6d340c2a713a2987aa93992b29135864d0f3aa7b7bd1578859ac7cf02fa97
- 225 / 33 certain / 97 likely / 95 needs-human (563935 parcels)
- Falsifier 1: violations=0
- Falsifier 2: delta_rows=4; west and lacy_lakeview unchanged
- Factory node sql/p2-juris/_generate_values.mjs: cities 72, seed 225

## LESSON
The bug is a half-name. nk() already strips hyphens. Lacy-Lakeview is the proof. Do not build a hyphen fix. Component matches must also enter the roster-anchor pool or the misspellings of the half-name stay unincorporated.

## LESSON
Generator home: keep scripts/alias-seed/ in doc_repo. Reject factory sql/p2-juris/ as the producer home. SCR replaced with Path(__file__).

## LESSON
CDP_SEED_HAS_FIPS / UNKNOWN_SEED would not have caught Bruceville-Eddy. New falsifier sits beside the hand list, does not replace it. Different defect class.

## OPEN
- 36-row residue: nothing changes downstream if unresolved. Left unresolved. Do not reopen county-level-key, Harwood, Waelder.
- Planner commits. Factory 03/_roster/_file_side_counts restored (CRLF-only dirty, zero content).

PLANNER REVIEW 2026-08-31T19:32Z — Accept. Re-read component_lookup (miss-only, county-scoped, single-hit, likely / roster-component). Re-ran check_component_index.py: selftest ok, current seed violations=0. Diffed working seed against git HEAD blob (sha256 89a616f4, not the dispatch's 7f384d0d): exactly four rows changed, west and lacy_lakeview unchanged, certain stays 33, needs-human 99->95. No CDP received a place_fips. Seed was CRLF after regen; converted to LF. Dispatch hash 7f384d0d is not the HEAD blob; the meaning-shaped four-row check against HEAD still holds. Generator home in doc_repo accepted.

## DEAD-END
Treating this as a hyphen-stripping bug. nk() already handles hyphens. That path is a no-op.
