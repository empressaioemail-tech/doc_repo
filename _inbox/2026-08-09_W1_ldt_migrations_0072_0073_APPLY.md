---
id: 2026-08-09_W1_ldt_migrations_0072_0073_APPLY
title: ldt migrations 0072/0073 applied to deployment Neon
date: 2026-08-09
status: applied-verified
owner: planner
related: [legacy-design-tools PR #393 @ a7d8da8a]
---

# Migrations 0072/0073 — deployment Neon apply

**Verdict:** ABSENT before this session; **APPLIED** 2026-08-09T20:22Z via `lib/db/scripts/migrate-prod.mjs`.

## Before (information_schema)

```json
{
  "expected_tables": [],
  "rail_state_history_columns": [],
  "manifest_run_columns": []
}
```

All six expected tables missing: `rail_state_history`, `rail_verification`, `manifest_run`, `manifest_slot_reservation`, `manifest_slot_queue`, `manifest_jurisdiction_cost`.

## Apply command

```powershell
cd P:\legacy-design-tools\lib\db
$env:DATABASE_URL = <TXGIO_DATABASE_URL from sweep .env — neondb direct host>
node scripts/migrate-prod.mjs
```

Tracker inserted:

- `0072_rail_state_history_and_verification.sql` @ 2026-08-09T20:22:14.280Z
- `0073_manifest_run_state_slot_and_cost.sql` @ 2026-08-09T20:22:14.593Z

## After (information_schema — verbatim)

**Tables present:**

```json
[
  { "table_name": "manifest_jurisdiction_cost" },
  { "table_name": "manifest_run" },
  { "table_name": "manifest_slot_queue" },
  { "table_name": "manifest_slot_reservation" },
  { "table_name": "rail_state_history" },
  { "table_name": "rail_verification" }
]
```

**rail_state_history + rail_verification columns:**

```json
[
  { "table_name": "rail_state_history", "column_name": "id", "data_type": "uuid" },
  { "table_name": "rail_state_history", "column_name": "county_fips", "data_type": "text" },
  { "table_name": "rail_state_history", "column_name": "rail_key", "data_type": "text" },
  { "table_name": "rail_state_history", "column_name": "rail_state", "data_type": "text" },
  { "table_name": "rail_state_history", "column_name": "honest_coverage_pct", "data_type": "numeric" },
  { "table_name": "rail_state_history", "column_name": "threshold_pct", "data_type": "numeric" },
  { "table_name": "rail_state_history", "column_name": "verified_at", "data_type": "timestamp with time zone" },
  { "table_name": "rail_state_history", "column_name": "run_id", "data_type": "uuid" },
  { "table_name": "rail_state_history", "column_name": "snapshot_reason", "data_type": "text" },
  { "table_name": "rail_state_history", "column_name": "recorded_at", "data_type": "timestamp with time zone" },
  { "table_name": "rail_verification", "column_name": "id", "data_type": "uuid" },
  { "table_name": "rail_verification", "column_name": "county_fips", "data_type": "text" },
  { "table_name": "rail_verification", "column_name": "rail_key", "data_type": "text" },
  { "table_name": "rail_verification", "column_name": "verified_at", "data_type": "timestamp with time zone" },
  { "table_name": "rail_verification", "column_name": "verified_by_instrument", "data_type": "text" },
  { "table_name": "rail_verification", "column_name": "verification_method", "data_type": "text" },
  { "table_name": "rail_verification", "column_name": "verification_outcome", "data_type": "text" },
  { "table_name": "rail_verification", "column_name": "artifact_path", "data_type": "text" },
  { "table_name": "rail_verification", "column_name": "run_id", "data_type": "uuid" },
  { "table_name": "rail_verification", "column_name": "notes", "data_type": "text" },
  { "table_name": "rail_verification", "column_name": "recorded_at", "data_type": "timestamp with time zone" }
]
```

**manifest_run / slot / cost:** 43 column rows across `manifest_run` (22 cols), `manifest_slot_reservation` (5), `manifest_slot_queue` (5), `manifest_jurisdiction_cost` (6) — full dump in `P:/tmp/w1_migration_check_output.txt`.

Connection fingerprint: `neondb` @ direct host (pooler stripped).
