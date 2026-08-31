---
id: 2026-08-30_p2-juris_supervisor_review
title: Supervisor grade — P2-JURIS read half
date: 2026-08-30
last_updated: 2026-08-30
status: active
lane: P2-JURIS
plan_row: F-01
agent: 182064ff-d0f6-46da-b67b-a04b4f930671
snapshot: integration P:/doc_repo; Factory tree P:/seat-worktrees/property/hauska-factory-p2-juris seat/property-ctx-p2-juris HEAD 7f41f52; SQL uncommitted; no store connect
---

# Supervisor grade — P2-JURIS read half

Seat: integration on `P:/doc_repo`. Reviewed the write path in the Factory worktree, not the handback. Live totals remain UNMEASURED. No Neon URI minted. No persist. No commit.

## Verdict

Read-half SQL is accepted as a specification. It is not accepted as an executable planner session. Persist stays leave_behind.

| Claim | Grade | Evidence |
|---|---|---|
| Zone-major city-outer join, no parcel LATERAL | MET | `01_containment.sql` `FROM cities_bbox c JOIN parcels_six p` on btree bbox then `ST_Intersects`. `05_explain.sql` is the same join. Executable SQL has no `LATERAL`. |
| Floor is a constant, not a comment | MET | `overlap_deg2 >= 1e-8` on ring hits. Coupland probe asserts `7.6e-10 < 1e-8` and that bare `ST_Intersects` would pass. |
| unincorporated is a disposition; no CDP `place_fips` | MET | `CDP_ASSERT` + `CITY_TABLE_CDP` on the nine names. Disposition else-branch is `unincorporated`, not a fabricated FIPS. |
| Straddles write spatial `all_county_fips` | MET as spec | `03` re-derives after the same floor. Roster Coupland Travis is the named drop. Nothing written. |
| Reconcile to 357,269 / 624,141 / 981,410 | UNMEASURED | Expected columns sit next to live counts. Planner has not run `01`. |
| Session is planner-runnable on a short-lived RO URI | NOT MET | See hole 1. |
| Persist | NOT THIS CARD | `03 PERSIST_SPEC` only. `adoptRoster` still drops the key. |

## Holes

1. **RO URI and `01` cannot both be true.** `00_session.sql` and the README set `default_transaction_read_only = on`. `01` then `DROP`/`CREATE TEMP TABLE` for cities, parcels, hits, jurisdiction, and slivers. Postgres refuses `CREATE TABLE` in a read-only transaction. Neon read replicas refuse temp tables the same way. The chew sheet said prove the URI is RO by `CREATE TEMP TABLE` refusing. That proof, if it works, makes `01` unrunnable. Live TOTALS stay unmeasured until the session is rewritten as one CTE query on RO, or the RO proof uses a non-temp write (`CREATE TABLE` / `INSERT` into a durable relation) and temps are allowed on a different connection that is still not persist.

2. **Empty city table is caught only if TOTALS run.** `00` comments that zero city rows must not emit statewide unincorporated. `01` does not refuse on `city_rows = 0`. The 624,141 expected in-city would fail if the planner actually runs TOTALS. Until then an empty snapshot is silent.

3. **`DISTINCT ON (county_fips, prop_id) ORDER BY feature_index` is unstable when `feature_index` is null or tied.** Tile collapse is required. The winner among equal keys is not named.

4. **`05 EXPLAIN … LIMIT 1` proves join shape, not the full 981k plan.** Acceptable as a LATERAL falsifier. Not a runtime proof.

## What I did not do

Mint a Neon URI. Run `01`. Adopt a new split. Commit the worktree. Touch another Factory tree. Treat the file-side 72/24/3 as live store counts.

## Next

Do not persist. Do not adopt a new total. Fix the session so a short-lived planner read can actually execute, then reconcile TOTALS to 357,269 / 624,141 / 981,410. A material miss means the join is wrong. Persist waits on the P2 job template after P1-FACTORY refuse.

P1-FACTORY close is also on disk (`_inbox/2026-08-30_p1-factory_close.json`). That diff is not graded here.
