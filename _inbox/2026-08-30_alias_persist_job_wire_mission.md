# alias-persist --apply calls applyAliasLandingRows (F-08)

The helper on `seat/property-ctx-p1-factory` now issues a real INSERT. The persist job on `origin/seat/property-ctx-walk-alias-schema` still prefers `insertLanding`. Wire `--apply` so the job calls `applyAliasLandingRows` (or the same `client.query` INSERT). A mock write that reports a count without SQL is the defect.

Read by path, do not write:
- `P:/seat-worktrees/property/hauska-factory-p1-controls` after the INSERT commit (`applyAliasLandingRows`, `ALIAS_LANDING_INSERT_SQL`)
- `P:/seat-worktrees/property/hauska-factory-ctx-publish` (`src/jobs/alias-persist.mjs`, `src/lib/cad-txgio-alias-persist.mjs` `writePersistedAlias`)

Work only in the tree named in the dispatch. Both arms: missing `landing_cad_txgio_alias` refuses; `--apply` dry or test client issues the INSERT SQL and does not call `insertLanding`. Do not apply 0005 / 0005a / 0005b. Do not start a job. Do not persist to Neon.
