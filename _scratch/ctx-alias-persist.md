# ctx-alias-persist (property seat)

## GROUND-TRUTH 2026-08-30T16:10Z
Worktree `P:/seat-worktrees/property/hauska-factory-ctx-publish` on `seat/property-ctx-walk-alias-schema` HEAD `701b9d5e`. Persist items 4/6/7/8 plus item 3 parser are uncommitted. Tests: `node --test test/alias-landing-schema.test.mjs test/alias-persist.test.mjs` 13 pass. No live store, no migration apply, no laptop `--apply`.

## LESSON
W1 emit (`CadTxgioBindEmit`) has no `publish_run_id`. The persist job stamps `--run-id` before `parseCadTxgioAliasLanding`. Classify refuse kinds before parse so owner-false never reaches INSERT; `assertOwnersAgree` stays on the write path as a second gate.

## LESSON
Card H `provenance.parcelJoin` on the bake record does not carry a named `txgio_id` (basis is the situs match). The parser fail-closes rather than inventing a TxGIO key. Live item 3 needs a dump that already has the key, or an amended extract.

## OPEN
Planner: commit this diff; apply 0005; run item 3 with GO + run row; two-count on live stores; Wave R stays pinned until those pass.

## GROUND-TRUTH 2026-08-30T23:04Z
P1-FACTORY item-4 hole closed on `P:/seat-worktrees/property/hauska-factory-p1-controls` HEAD `53f8b36` + uncommitted `alias-landing-table.mjs` / `p1-controls.test.mjs`. `applyAliasLandingRows` issues `INSERT INTO landing_cad_txgio_alias` via `client.query`. `node --test test/*.test.mjs`: 276 pass, 0 fail, 2 skipped. No live store, no 0005b apply.

## LESSON
A pg Client has `query` and no `insertLanding`. Counting `wroteLanding` after the exists SELECT is the defect. `insertLanding` as a test hook with `query` as fallback is the persist-job shape and still lets a mock report a write without SQL.

## OPEN
Planner: commit the p1-controls pathspec; port ctx-publish `writePersistedAlias` onto `applyAliasLandingRows`; apply 0005b to bake neondb only; do not apply drafted 0005.
