---
id: 2026-09-18_p342_migration_018_RECORD
title: P-342 migration 018 applied to the atoms store and verified by violation
date: 2026-09-18
last_updated: 2026-09-18 (18:15Z)
status: done. Migration 018 is live. P-263's apply has not run; its path is in section 3.
kind: seat record
owner: nick
maintained_by: integration seat
programs: [OPS-24, OPS-16]
plan_rows: [P-342, P-263]
snapshot: atoms store (ATOMS_DATABASE_URL, database hauska_mcp), read and written 2026-09-18 18:11:55Z to 18:13Z; migration file packages/storage/migrations/018_envelope_outcome_movement_journal.sql taken from hauska-engine c41a1482 (sha256 087f61593f2d8537dcf6c792d4a5fcc74635a27f4411a221fa0ae9c29467e1be); doc_repo main 5690995f
related:
  - _inbox/2026-09-18_p342-p263-apply-writer_close.json (the lane's close, with its per-county dry runs)
  - _decisions/2026-09-18_phase0_closeout_rulings.md (ruling 11: county by county, each capped at its measured share)
---

# P-342: migration 018

## 1. Applied

| Check | Before (18:11:55Z) | After |
|---|---|---|
| Database | `hauska_mcp` | `hauska_mcp` |
| `envelope_outcome_movement_journal` | absent | present |
| `schema_migrations` latest | `017_site_plan_export_jobs.sql` (2026-09-16 00:33Z) | `018_envelope_outcome_movement_journal.sql` at **2026-09-18 18:12:08Z** |
| Triggers | none | `..._no_delete`, `..._no_truncate`, `..._guarded_update` |
| Rows | none | 0 |

The file was taken from engine `c41a1482` (the #475 merge) and run as one transaction (`psql -1 -v
ON_ERROR_STOP=1`). psql exited 0. The only notices were the migration's own idempotent
`IF NOT EXISTS` and `DROP TRIGGER IF EXISTS` skips.

## 2. Verified by violation, in transactions that rolled back

- Inserted a probe row, then deleted it. The trigger refused: `append-only: DELETE refused (id=1)`,
  code `PT342`.
- Inserted a probe row, then changed `after_content_hash`. The trigger refused: `only
  reversed_at/reversed_by_run_id may be set`.
- The table holds 0 rows after both rollbacks.

The rolled-back probes used sequence values 1 and 2. The first real journal row will be id 3 or
higher. That's expected, not a missing record.

## 3. What P-263's apply still needs

The apply script (`packages/engine-core/scripts/p263-envelope-outcome-apply.mts`) refuses to write
unless it runs as a Cloud Run Job holding an `atoms_writer_lease_v2` WRITE scope. No such job exists.
The only engine jobs are `hauska-engine-atoms-writer`, `-depth-warm-remint` and `-footprint-retag`,
and the first of those runs a different script from an older image. The path, in order:

1. Build an engine image at `c41a1482` with `cloudbuild.atoms-writer.yaml`, or its equivalent that
   carries `engine-core/scripts`. Create a job `hauska-engine-p263-apply` on that digest: the command
   runs the apply script, and the job mounts only the atoms-store secret the script reads. The
   script's variable has to be read at source first (`atoms-store-client.mjs`). Nothing else gets
   mounted.
2. Take a fresh dry run per county inside one heavy-scan lease on the atoms store's host. Record each
   `censusDigest`, `measuredShare` and bucket counts beside the lane's 13:12Z dry runs. Those were:
   Bastrop 52,704 of 62,260 (0.8465), Caldwell 18,499 of 24,006 (0.7706), Hays 67,689 of 102,143
   (0.6627), McLennan 65,814 of 65,814 (1.0), and Travis 15,554 of 172,713. Williamson is in the
   lane's close.
3. Ruling 11 authorises each county at its measured share. `--blast-radius-max-share` equals that
   county's fresh measured share, `--expect-digest` its fresh digest, and the authorisation value is
   the exact token the dry run prints. McLennan's share is 1.0, which the flag's range (0 < share < 1)
   cannot express, so McLennan needs the printed `BLAST_RADIUS_OVERRIDE` token. That is still inside
   ruling 11 because the token binds the measured pair. Say so when it runs.
4. Apply one county at a time. Each run is checked by `--guard` and by a journal count that equals
   the dry run's movement. The reversal path (`--reverse --journal-run-id`) is named in each county's
   record before the next county starts.
