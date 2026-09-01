# alias-persist real INSERT (F-08)

Wire `alias-persist` to `requireAliasLandingTable` and a real `INSERT`, not a mock `insertLanding`. This is the P1-FACTORY item-4 hole.

Read by path, do not write the other Factory trees:
- `P:/seat-worktrees/property/hauska-factory-p1-controls` — `applyAliasLandingRows`, `requireAliasLandingTable`, 0005b under `migrations/bake/`
- `origin/seat/property-ctx-walk-alias-schema` if the job still lives only there

Both arms: missing landing table refuses; a real INSERT into a test client is counted. A mock write that reports `wroteLanding` without SQL is the defect.

Do not apply 0005 as drafted. Do not apply 0005a/0005b to a live store. Do not start a job.
