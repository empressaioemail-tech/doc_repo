---
id: neon_schema_migration_via_cloud_shell
title: Neon schema migration via Cloud Shell — runbook
status: active
last_updated: 2026-05-10
applies_to: portfolio
related: [10_ground_truth, 12_migration_sprint, adr_002_replit_neon_migration]
---

# Neon schema migration via Cloud Shell — runbook

> **Purpose.** Migrate a schema-only Postgres dump from one Neon database to another using Google Cloud Shell as the work environment. Used for Phase 1B Stage 1 (legacy-design-tools, 2026-05-10) and reusable for Phase 2A (smartcity-os) with documented adaptations.

## When to use

- Source and target both on Neon
- Migration is schema-only (data sync is a separate operation)
- Target is empty or near-empty (no destructive cleanup needed)
- Cloud Shell is preferable to Nick-box-local tooling because:
  - gcloud auth is automatic, no SSL cert chain issues
  - Secret Manager access is one command, not "fetch + copy + paste"
  - Connection strings stay in env vars, never touch local FS
  - psql + pg_dump preinstalled

## Prerequisites

- Source connection string in GCP Secret Manager
- Target connection string in GCP Secret Manager
- Cloud Shell session
- Both Neon endpoints reachable (verify via psql before dump)

## Pattern

### Stage 1 — Recon (read-only)

Always self-contained: explicit project switch at the top of every Cloud Shell block. Cloud Shell sessions don't persist project state across sessions.

```bash
gcloud config set project <target-project>
SOURCE_URL=$(gcloud secrets versions access latest --secret=<SOURCE_SECRET_NAME>)
TARGET_URL=$(gcloud secrets versions access latest --secret=<TARGET_SECRET_NAME>)

echo "SOURCE_URL length: ${#SOURCE_URL}"
echo "TARGET_URL length: ${#TARGET_URL}"
echo "source host: $(echo "$SOURCE_URL" | sed -E 's|^postgres(ql)?://[^@]+@([^/?]+).*|\2|')"
echo "target host: $(echo "$TARGET_URL" | sed -E 's|^postgres(ql)?://[^@]+@([^/?]+).*|\2|')"
```

Verify hostnames match expectation before any DB-touching commands.

### Stage 1b — Both sides recon

```bash
export PSQL_PAGER=cat   # avoid pager truncation on multi-row results

# Source summary
psql "$SOURCE_URL" -P pager=off -t -c "SELECT version();"
psql "$SOURCE_URL" -P pager=off -c "SELECT schemaname, COUNT(*) FROM pg_tables WHERE schemaname NOT IN ('pg_catalog','information_schema') GROUP BY schemaname ORDER BY schemaname;"
psql "$SOURCE_URL" -P pager=off -c "SELECT extname, extversion FROM pg_extension ORDER BY extname;"
psql "$SOURCE_URL" -P pager=off -t -c "SELECT pg_size_pretty(pg_database_size(current_database()));"

# Target empty-check (must show zero non-system schemas with tables)
psql "$TARGET_URL" -P pager=off -c "SELECT schemaname, COUNT(*) FROM pg_tables WHERE schemaname NOT IN ('pg_catalog','information_schema') GROUP BY schemaname;"
```

Look for: source schema list (flag any unexpected schemas — test artifacts, platform-managed, etc.), extensions (allowlisted on Neon target?), DB size, target empty.

### Stage 2 — Schema dump

```bash
pg_dump --schema-only --no-owner --no-acl \
  -N 'test_*' -N '_system' \
  "$SOURCE_URL" > ~/schema.sql 2> ~/pg_dump.stderr
echo "exit code: $?"
echo "schema.sql: $(wc -l < ~/schema.sql) lines, $(stat -c %s ~/schema.sql) bytes"
cat ~/pg_dump.stderr || echo "(empty)"
```

**Always exclude:**
- `test_*` schemas — integration test isolation artifacts (per Phase 1B Stage 1 finding)
- `_system` schema — Replit-managed migration tracking on Replit-Neon source DBs (contains `replit_database_migrations_v1`)

**Always use:**
- `--schema-only` — data is a separate phase
- `--no-owner` — target's owner role differs from source's
- `--no-acl` — same reason; ACLs are project-scoped

Sanity-check the dump:

```bash
grep -E '^CREATE SCHEMA' ~/schema.sql
grep -E '^CREATE EXTENSION' ~/schema.sql
grep -cE '^CREATE TABLE' ~/schema.sql
grep -cE '^ALTER TABLE' ~/schema.sql
grep -c '_system' ~/schema.sql       # must be 0
grep -cE 'test_177' ~/schema.sql     # must be 0
```

### Stage 3 — Restore + verify

```bash
psql "$TARGET_URL" -v ON_ERROR_STOP=1 -P pager=off -f ~/schema.sql > ~/restore.stdout 2> ~/restore.stderr
echo "restore exit: $?"
cat ~/restore.stderr || echo "(empty)"
```

Parity verification — run on each side, compare outputs:

```bash
for label_url in "source $SOURCE_URL" "target $TARGET_URL"; do
  read label url <<< "$label_url"
  echo "--- $label ---"
  psql "$url" -P pager=off -t -c "SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public';"
  psql "$url" -P pager=off -t -c "SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'public';"
  psql "$url" -P pager=off -t -c "SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public';"
  psql "$url" -P pager=off -c "SELECT contype, COUNT(*) FROM pg_constraint c JOIN pg_namespace n ON c.connamespace = n.oid WHERE n.nspname = 'public' GROUP BY contype ORDER BY contype;"
  psql "$url" -P pager=off -c "SELECT extname, extversion FROM pg_extension ORDER BY extname;"
done
```

Plus targeted `\d <table>` on architecturally critical tables (atom_events, users, primary domain entity).

## Phase 2A adaptations (smartcity-os)

When applying this runbook to smartcity-os:

- **tenant_id integrity** — smartcity-os enforces multitenancy via tenant_id on every atomic table (per ADR-005). After restore, verify every table that has tenant_id on source also has it on target (column count parity may not catch a single-column drop). Sample query: `SELECT table_name FROM information_schema.columns WHERE table_schema = 'public' AND column_name = 'tenant_id'` on both sides; counts must match.
- **Region** — smartcity-os Phase 2A target is us-central1 (not us-east-1) to colocate with Cloud Run and close Fire 5. Verify the target endpoint URL contains `us-central1`.
- **Larger schema** — smartcity-os has 106 public tables (per `10_ground_truth.md`); dump and restore times will scale accordingly. Cloud Shell timeouts (1h idle) are not a risk for schema-only.
- **Migration prefix collisions** — smartcity-os has two `0003_*` and two `0004_*` migrations in `migrations/` (Phase 2 added prereq in `12_migration_sprint.md`). Resolve before Phase 2A so the dumped schema reflects deterministic migration ordering.
- **Existing post-merge.sh** — smartcity-os scripts/post-merge.sh was neutralized in PR #7 (Fire 4). Do not re-run its migration logic during Phase 2A.

## Worked example

Phase 1B Stage 1 — legacy-design-tools (2026-05-10 PM):

- Source: `ep-little-base-amyyxjca.c-5.us-east-1.aws.neon.tech` (Replit-managed, PG 16.12, 192 MB)
- Target: `ep-dry-queen-aq0yxp05-pooler.c-8.us-east-1.aws.neon.tech` (Empressa-owned, PG 17.8, was empty)
- Excluded: 4 `test_*` schemas + `_system` (Replit migration tracking)
- Result: 36 tables / 419 cols / 98 idx / 104 constraints (36 PK + 37 FK + 5 u + 26 c) / plpgsql + vector 0.8.0 — full parity
- Tooling: pg_dump/psql 16.13 (Cloud Shell preinstalled)
- Captured in `_sessions/2026-05-10_phase_1b_stage_1_verified_and_fire_4_pr_claude_ai_planner.md`

## Common issues

- **Pager truncation on multi-row psql results.** Cloud Shell's `less` traps stdout. Set `export PSQL_PAGER=cat` for the session, or pass `-P pager=off` to every psql invocation.
- **Project context lost between Cloud Shell sessions.** Each new session defaults to whatever GCP project the IAM was last associated with. Always run `gcloud config set project <target-project>` at the top of every block.
- **`_system` schema on Replit-managed sources.** Replit-managed Neon DBs include a `_system.replit_database_migrations_v1` table. Exclude with `-N _system`; do not carry into Empressa-owned target.
- **Cross-version dump (16 → 17).** pg_dump 16.x reading source 16.x and writing SQL restorable to target 17.x is supported and standard. No special flags needed.
- **Empty SOURCE_URL/TARGET_URL after Cloud Shell restart.** If `gcloud secrets versions access` returned empty (silent failure on wrong project), psql falls back to its default of trying `/var/run/postgresql/.s.PGSQL.5432` Unix socket and produces "connection failed" errors that look like network issues. Check the project context first.
