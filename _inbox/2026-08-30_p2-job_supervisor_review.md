---
id: 2026-08-30_p2-job_supervisor_review
title: Supervisor grade — P2 job template
date: 2026-08-30
last_updated: 2026-08-30
status: active
lane: P2-JOB
plan_row: F-01
agent: 3c0e381b-7895-4443-a91b-b0fbd3fbca59
snapshot: integration P:/doc_repo; Factory tree P:/seat-worktrees/property/hauska-factory-p2-job seat/property-ctx-p2-job HEAD 7f41f52; supervisor re-ran test/p2-job.test.mjs 12/12 and both CLI refuse arms
---

# Supervisor grade — P2 job template

Seat: integration on `P:/doc_repo`. Reviewed the write path in `hauska-factory-p2-job`, not the handback. Did not start a Cloud Run job. Did not persist.

## Verdict

Stub accepted. Persist is still not this card.

| Item | Grade | Evidence |
|---|---|---|
| Missing county refuses | MET | `parseP2JurisFlags` uses `requireCountyFips`. No 48021 default. Supervisor: `node src/cli.mjs p2-juris` prints `COUNTY_REQUIRED` exit 1. `99999` is `COUNTY_UNKNOWN`. Both `--county=` and spaced forms. |
| Run row before write | MET | Dry path without a run row is `RUN_ROW_REQUIRED`. Named county plus a run row plans only. |
| Laptop `--apply` | MET | `FACTORY_CLOUD !== "1"` refuses `LAPTOP_WRITE_FROZEN` before `connectFn`. Supervisor: CLI `--apply` on a laptop prints `LAPTOP_WRITE_FROZEN` exit 1. |
| Writer allowlist | MET | CAD-only map is `WRITER_ALLOWLIST_CAD_ONLY`. Named: `containment-persist`, `f11-setback`, `easement-no-live-rest`. Easement `liveRest !== false` refuses. |
| PERSIST_SPEC consumed | MET | Shape is `place_fips`, `name`, `parent_county_fips`, `all_county_fips`. Coupland 17312 is 48491 only. `executeContainmentPersist` is `PERSIST_NOT_THIS_CARD`. `persistExecuted` stays false. |

## Holes

1. **`requireCollectComplete` is copied and not called from `runP2Juris`.** Honest. This stub is not CAD. Cloud `--apply` with no `--run-id` can `startRun` without a ledger two-count. Do not silently wire the CAD rail onto a jurisdiction job.

2. **PERSIST_SPEC is a file-side fixture.** Not a live `03` query. The persist job must read the session result, not this fixture, or Coupland/Austin counts will be invented.

3. **`--apply` with `FACTORY_CLOUD=1` still does not persist.** Correct for this card. A later execute path must replace `executeContainmentPersist` refuse, not delete the laptop freeze.

## What I did not do

Start a job. Apply 0005. Persist. Treat 278 as verified (re-ran the twelve P2 tests and the two CLI refuse arms only).

## Next

Pathspec commit this tree. P2-JURIS persist waits on a runnable RO session, then a Cloud Run job that consumes live `03` rows. Do not apply from a laptop.
