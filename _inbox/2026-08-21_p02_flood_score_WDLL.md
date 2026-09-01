---
id: 2026-08-21_p02_flood_score_WDLL
title: P-02 Ector re-key apply + flood missing-row score
status: approved
date: 2026-08-21
plan_row: P-02,P-08
operator_approval: 2026-08-21 verbal go on p-02, live lease, and the rest
related:
  - _inbox/2026-08-21_a5-ector_close.json
  - _inbox/2026-08-21_a4-flood-exists_close.json
---

# WDLL: P-02 apply and flood score

Done looks like: Ector parcel-nodes are geo_id-keyed under a live P02 lease that covered the plan phase, and flood `county_facet_coverage` has a row for Anderson 48001 (pilot) then the other 75 GO FIPS. Geometry rescore of 48135 is not this wave. Ledger recompute is planner-owned after the scores land.

## Acceptance

1. Isolated engine worktree `P:/hauska-engine-worktrees/p02-ector-rekey` at origin/main (has `packages/storage/scripts/atoms-writer-lease.mjs`). Do not apply from seat/property `8d8e880`. Check: `git rev-parse HEAD` in that worktree; `ls` the lease CLI.
2. Lease take `--holder=P02 --ttl-sec=14400`. Live means `expires > now()` and holder=P02. Heartbeat detached, started BEFORE dry-run/apply load, log `P:/tmp/p02_ector_20260821/lease_heartbeat.log`, watch `_catalog/watch_registry/p02-ector-lease.json`. Check: `status` JSON after take.
3. Dry-run `write-parcel-node-county --county=48135 --key-kind=geo_id_crosswalk` (no `--apply`). Quote wouldWrite / extras vs 71673. If the flag is omitted, STOP. Check: dry-run JSON in the close.
4. `--apply` with `ATOMS_WRITER_LEASE_HOLDER=P02`. Heartbeat covers plan phase. Verify with a prefix-range count of `parcel-node` for 48135, not heap COUNT(*). Check: apply event JSON; bounded store query.
5. Release `--holder=P02` after verify, unless apply is still running. Geometry score 48135 remains NO-GO.
6. Flood: `--dry-run --county=48001` then write `--county=48001` (no `--all`). Coverage row appears for facet=flood county_fips=48001. Then the other 75 GO FIPS from A4. Progress every county to `P:/tmp/a6_flood_score_20260821/progress.log`. Check: Neon GROUP BY still 114+63 plus new rows; 48001 not in the missing-77 list.
7. No Harris PBF. No geometry `--county=48135` write. No `--all` flood. Subagents do not commit.

## Amendments

- 2026-08-21: operator go on P-02, lease, and flood score.

## Finish card

1. met. Isolated worktree `p02-ector-rekey` HEAD `d3f3794`. Apply did not run from `8d8e880`.
2. met. Lease take holder=P02 ttl 14400. Heartbeat before dry-run. Table empty after release.
3. met. Dry-run keyKind=geo_id_crosswalk. extras 72068 vs 71673 relAbs 0.005511.
4. met. Planner prefix-range: active 75859 retired 3791. Sample `48135:00050-00401-00100` active geo_id_crosswalk. Collapse `48135:1004.00000000` retired prop_id.
5. met. `atoms_bulk_writer_lease` returns no row. Geometry 48135 still 2026-08-12 B2 scorer.
6. met. Neon 48001 72.16 not-yet; 76 rows verified_today; missing=48129 Donley; GET after recompute flood 162 satisfied-present / 92 not-yet (91 coverage not-yet + Donley).
7. met. Geometry 48135 untouched. No --all. No Harris PBF.
