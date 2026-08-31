---
id: 2026-08-30_alias-persist-wire_supervisor_review
title: Supervisor grade — alias-persist real INSERT
date: 2026-08-30
last_updated: 2026-08-30
status: active
lane: ALIAS-PERSIST
plan_row: F-08
agent: b8480aec-a7f2-4632-a6ca-74fad5c3c10a
snapshot: integration P:/doc_repo; Factory tree P:/seat-worktrees/property/hauska-factory-p1-controls seat/property-ctx-p1-factory HEAD 53f8b36; supervisor re-ran test/p1-controls.test.mjs 10/10
---

# Supervisor grade — alias-persist real INSERT

Seat: integration on `P:/doc_repo`. Reviewed `src/lib/alias-landing-table.mjs`, not the handback. Did not apply 0005b. Did not start a job.

## Verdict

The write path is accepted. `wroteLanding` now tracks a real `client.query` INSERT.

| Item | Grade | Evidence |
|---|---|---|
| Missing table refuses | MET | Empty `information_schema` → `ALIAS_TABLE_MISSING`. Issued SQL is the exists SELECT only. No INSERT. A client with only `insertLanding` is `ALIAS_LANDING_WRITE_REFUSED`. |
| Real INSERT counted | MET | After the exists check, `ALIAS_LANDING_INSERT_SQL` runs. Test records `insertLandingCalls === 0` and `wroteLanding === INSERT count === 1`. Params match the row. Incomplete row refuses. |
| SQL matches 0005b | MET | Columns are `county_fips, cad_prop_id, txgio_id, situs_key, owners_agree, as_of, method, run_id, valid_to`. `owners_agree` is literal `true`. `method` must be `cad-roll-address-join`. Matches the CHECK on `migrations/bake/0005b`. |

## Holes

1. **The persist job still prefers `insertLanding`.** `writePersistedAlias` on `origin/seat/property-ctx-walk-alias-schema` (`hauska-factory-ctx-publish`) still calls `insertLanding` when present. This tree's helper is unused by that job. `--apply` on that branch can still report a write it did not perform.

2. **0005b is still unapplied.** Live INSERT waits on planner apply to bake `neondb` only. Do not apply drafted 0005. Do not apply 0005b to Factory.

## What I did not do

Commit until this grade. Apply 0005b. Port the persist job. Treat 276 as verified (re-ran the ten control tests only).

## Next

Pathspec commit this tree. Next card: persist `--apply` must call `applyAliasLandingRows`. Live INSERT after 0005b on bake `neondb`.
