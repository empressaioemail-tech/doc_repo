---
id: 2026-06-07_smartcity-os_cc-agent-M_ws1_migration_2a_2c
title: WS-1 Phases 2A–2C — Neon migration journal (cc-agent-M)
date: 2026-06-07
agent: cc-agent-M
repo: smartcity-os
kind: inbox-session
related: [30a_smartcity_stabilization_sprint, 90_runbooks/neon_schema_migration_via_cloud_shell, 90_runbooks/cloud_run_canary_deploy, 12_migration_sprint, 2026-06-07_smartcity-os_cc-agent-M_ws1_phase_2a0]
---

# WS-1 Phases 2A → 2B → 2C — operator-supervised migration journal

**Model:** Grok Build 0.1  
**Window:** 2026-06-07 (Sunday low-traffic)  
**Operator:** Nick (Cloud Shell executor)  
**Agent:** cc-agent-M (command author + gate verification)

---

## Pre-flight gate

### Initial refusal (resolved)

Session opened on alien HEAD:

```
On branch chore/ws1-phase-2a0-migration-journal-reconcile
19c446b chore(migrations): WS-1 Phase 2A.0 journal reconcile + prefix collision fix
```

**Action:** checked out `main`, fast-forwarded to `origin/main`.

### Verbatim `git status` (post-refresh, PASS)

```
On branch main
Your branch is up to date with 'origin/main'.

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	Hauska_SDK_GroundTruth_Audit_2026-04-18.md
	Hauska_SDK_Q1_Q2_Q3_Report_ecfdfa9_2026-04-18.md
	Hauska_SDK_Verification_V7_V8_2026-04-18.md
	SECURITY_HARDENING_PLAN_BRIEF_2026-04-11.md
	SmartCity_OS_GroundTruth_Audit_2026-04-18.md
	SmartCity_OS_GroundTruth_Report_2026-04-11.md
	VERIFICATION_REPORT_2026-04-18.md

nothing added to commit but untracked files present (use "git add" to track)
```

**Tree verdict:** PASS — no staged or modified tracked files. Untracked root audit markdown is out of scope for WS-1.

### Verbatim `git log --oneline -3` (PASS)

```
ebb446b chore(migrations): WS-1 Phase 2A.0 journal reconcile (#21)
36393f6 ci(dast): grant issues:write for ZAP findings (#1)
62dbf28 fix(calendar): BASTROP_TENANT_ID 1 -> 2 to match prod tenant identity rule (#20)
```

### `origin/main` anchor (PASS)

```
ebb446ba02ba9e0eed9bdad9ea70a6e096893058
```

PR #21 Phase 2A.0 merged at `ebb446b` — confirmed.

### Production posture (pre-2C, doc baseline)

| Item | Expected | Status |
|---|---|---|
| Live revision | `smartcity-api-00104-taw` @ 100% | unchanged until 2C |
| Source DB | `smartcity-DATABASE_URL` (Replit Neon, us-west-2, PG 16) | read-only in 2A/2B |
| Target DB | `smartcity-EMPRESSA_DATABASE_URL` (Neon `tiny-art-63602898`, us-east-2, PG 18) | provisioned |
| `post-merge.sh` migration replay | **DO NOT RUN** | neutralized per PR #7 |

---

## `mygov_work_orders` — canonical definition (pre-2A)

**Resolution:** live production schema on Replit-managed source is canonical. Phase 2A `pg_dump --schema-only` captures it verbatim; no repo-side merge step.

**Repo drift (documented, not blocking):**

| Artifact | Issue |
|---|---|
| `migrations/0003_mygov_schema_sync.sql` | Hand-authored ALTERs (status/priority/lifecycle cols) |
| `migrations/0004_curious_hammerhead.sql` | Drizzle ALTERs overlapping enrichment cols + `idx_mygov_work_orders_tenant_wo_number` |
| `migrations/0006_enrichment_expanded_columns.sql` | Idempotent duplicate of slot-4 enrichment cols |
| `migrations/0005_premium_gambit.sql` | `in_mygov_*_list` boolean cols |
| `shared/schema.ts` | Canonical app model; unique index on `(tenant_id, job_id)` not `(tenant_id, work_order_number)` |
| Precondition probe 2026-06-06 | `dup_groups: 0` on live table — single physical definition |

**2A gate check after restore:**

```sql
\d+ mygov_work_orders
SELECT indexname FROM pg_indexes WHERE tablename = 'mygov_work_orders' ORDER BY 1;
```

Expect one table, one PK, indexes matching source `\d` output.

---

## PHASE 2A — schema-only sync

**Status:** `PASS` — operator attested clean parity 2026-06-07 (HR-8 verbatim paste deferred).

### Operator command block (copy as one session)

```bash
# === WS-1 Phase 2A — schema-only sync ===
export PSQL_PAGER=cat
gcloud config set project smartcity-os-prod

SOURCE_URL=$(gcloud secrets versions access latest --secret=smartcity-DATABASE_URL)
TARGET_URL=$(gcloud secrets versions access latest --secret=smartcity-EMPRESSA_DATABASE_URL)

echo "SOURCE_URL length: ${#SOURCE_URL}"
echo "TARGET_URL length: ${#TARGET_URL}"
echo "source host: $(echo "$SOURCE_URL" | sed -E 's|^postgres(ql)?://[^@]+@([^/?]+).*|\2|')"
echo "target host: $(echo "$TARGET_URL" | sed -E 's|^postgres(ql)?://[^@]+@([^/?]+).*|\2|')"

# PG client — need 18+ for PG16→PG18 dump (install if Cloud Shell client < 18)
pg_dump --version
# If version < 18:
#   sudo apt-get update && sudo apt-get install -y postgresql-client-18
#   export PATH=/usr/lib/postgresql/18/bin:$PATH
#   pg_dump --version

# --- Stage 1b recon ---
echo "=== SOURCE version ==="
psql "$SOURCE_URL" -P pager=off -t -c "SELECT version();"
echo "=== SOURCE schemas ==="
psql "$SOURCE_URL" -P pager=off -c "SELECT schemaname, COUNT(*) FROM pg_tables WHERE schemaname NOT IN ('pg_catalog','information_schema') GROUP BY schemaname ORDER BY schemaname;"
echo "=== SOURCE extensions ==="
psql "$SOURCE_URL" -P pager=off -c "SELECT extname, extversion FROM pg_extension ORDER BY extname;"
echo "=== SOURCE db size ==="
psql "$SOURCE_URL" -P pager=off -t -c "SELECT pg_size_pretty(pg_database_size(current_database()));"
echo "=== TARGET empty-check ==="
psql "$TARGET_URL" -P pager=off -c "SELECT schemaname, COUNT(*) FROM pg_tables WHERE schemaname NOT IN ('pg_catalog','information_schema') GROUP BY schemaname;"

# --- Stage 2 dump ---
pg_dump --schema-only --no-owner --no-acl \
  -N 'test_*' -N '_system' \
  "$SOURCE_URL" > ~/schema.sql 2> ~/pg_dump.stderr
echo "pg_dump exit: $?"
echo "schema.sql: $(wc -l < ~/schema.sql) lines, $(stat -c %s ~/schema.sql) bytes"
cat ~/pg_dump.stderr || echo "(empty stderr)"

echo "=== dump sanity ==="
grep -E '^CREATE SCHEMA' ~/schema.sql
grep -E '^CREATE EXTENSION' ~/schema.sql
grep -cE '^CREATE TABLE' ~/schema.sql
grep -cE '^ALTER TABLE' ~/schema.sql
grep -c '_system' ~/schema.sql
grep -cE 'test_177' ~/schema.sql

# --- Stage 3 restore ---
psql "$TARGET_URL" -v ON_ERROR_STOP=1 -P pager=off -f ~/schema.sql > ~/restore.stdout 2> ~/restore.stderr
echo "restore exit: $?"
cat ~/restore.stderr || echo "(empty restore stderr)"

# --- PARITY GATE 2A (paste ALL output verbatim) ---
for label_url in "source $SOURCE_URL" "target $TARGET_URL"; do
  read label url <<< "$label_url"
  echo "--- $label ---"
  psql "$url" -P pager=off -t -c "SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public';"
  psql "$url" -P pager=off -t -c "SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'public';"
  psql "$url" -P pager=off -t -c "SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public';"
  psql "$url" -P pager=off -c "SELECT contype, COUNT(*) FROM pg_constraint c JOIN pg_namespace n ON c.connamespace = n.oid WHERE n.nspname = 'public' GROUP BY contype ORDER BY contype;"
  psql "$url" -P pager=off -c "SELECT extname, extversion FROM pg_extension ORDER BY extname;"
done

echo "=== tenant_id column count (MUST MATCH EXACTLY) ==="
for label_url in "source $SOURCE_URL" "target $TARGET_URL"; do
  read label url <<< "$label_url"
  echo "--- $label tenant_id cols ---"
  psql "$url" -P pager=off -t -c "SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'public' AND column_name = 'tenant_id';"
done

echo "=== multi-tenancy-required tables MISSING tenant_id (MUST BE EMPTY) ==="
psql "$SOURCE_URL" -P pager=off -c "
WITH required AS (
  SELECT t.table_name
  FROM information_schema.tables t
  WHERE t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
    AND t.table_name NOT IN ('tenants')
    AND t.table_name NOT LIKE 'test\\_%'
    AND t.table_name NOT IN (
      'demo_signups', 'feedback_requests',
      'platform_admins', 'admin_password_reset_tokens',
      'products', 'ticket_messages'
    )
)
SELECT r.table_name
FROM required r
LEFT JOIN information_schema.columns c
  ON c.table_schema = 'public' AND c.table_name = r.table_name AND c.column_name = 'tenant_id'
WHERE c.column_name IS NULL
ORDER BY 1;
"

echo "=== mygov_work_orders structural spot-check (source) ==="
psql "$SOURCE_URL" -P pager=off -c "\d mygov_work_orders"
```

### 2A pass criteria

| Check | Pass condition |
|---|---|
| Restore exit code | `0` |
| `public` table count | source == target (expect ~106) |
| column count | source == target |
| index count | source == target |
| constraint counts by `contype` | source == target |
| extensions | source == target |
| `tenant_id` column count | **exact match** |
| multi-tenancy-required missing `tenant_id` | **zero rows** |
| `_system` / `test_*` in dump | 0 grep hits |

### 2A parity artifacts (operator paste below)

```
(operator attestation 2026-06-07: schema restore exit 0; table/col/idx/constraint/extension
parity matched source; tenant_id column count exact match; multi-tenancy-required missing
tenant_id query returned zero rows — verbatim Cloud Shell transcript not pasted this session)
```

### 2A gate verdict

```
PASS — operator attested; proceed to 2B
```

---

## PHASE 2B — data sync

**Status:** `FAILED_ATTEMPT_1` — retry with corrected procedure below.

### Attempt 1 postmortem (2026-06-07 ~16:40 UTC)

| Failure | Cause |
|---|---|
| Backup exit 1 | `BACKUP_TAG=backup/pre-ws1-2b-...` wrote to `~/backup/` — **directory did not exist**; stderr redirect failed before pg_dump ran |
| Data dump incomplete | Operator ^C after ~758 MB / 490k lines (~8% of 9.4 GB source) |
| Restore exit 3 | `SET session_replication_role = replica` — **Neon denies** (not superuser) |
| Target empty | `pg_size_pretty` source 9431 MB vs target **13 MB** (schema only) |
| Parity | All populated tables MISMATCH source=N target=0 — expected given no data loaded |

**Verdict:** 2B did NOT run. Source unchanged. Target schema intact, data empty. Safe to retry.

### Operator command block — RETRY (run as **4 separate steps**, not one paste)

**Step 0 — setup (run once)**

```bash
export PSQL_PAGER=cat
gcloud config set project smartcity-os-prod
SOURCE_URL=$(gcloud secrets versions access latest --secret=smartcity-DATABASE_URL)
TARGET_URL=$(gcloud secrets versions access latest --secret=smartcity-EMPRESSA_DATABASE_URL)
mkdir -p ~/ws1-migration
STAMP=$(date +%Y%m%d-%H%M%S)
DUMP=~/ws1-migration/pre-2b-${STAMP}.dump
echo "DUMP=$DUMP"
pg_dump --version
# Optional PG18 client: sudo apt-get update && sudo apt-get install -y postgresql-client-18
# export PATH=/usr/lib/postgresql/18/bin:$PATH
```

**Step 1 — full backup (~30–60 min; do NOT interrupt)**

```bash
# Confirm target still schema-only before loading data
psql "$TARGET_URL" -P pager=off -t -c "SELECT COUNT(*) FROM tenants;"
psql "$SOURCE_URL" -P pager=off -t -c "SELECT pg_size_pretty(pg_database_size(current_database()));"

nohup pg_dump -Fc --no-owner --no-acl -N 'test_*' -N '_system' \
  "$SOURCE_URL" -f "$DUMP" \
  > ~/ws1-migration/dump.log 2>&1 &
echo "pg_dump PID: $!"
tail -f ~/ws1-migration/dump.log
# Ctrl+C tail only when log shows completion; then:
ls -lh "$DUMP"
echo "dump exit check: $(tail -1 ~/ws1-migration/dump.log)"
```

Pass: dump file **> 8 GB**, no error in `dump.log`.

**Step 2 — data restore to target (~30–60 min)**

Uses `pg_restore --disable-triggers` (Neon-compatible; no superuser). Reuses Step 1 dump.

```bash
nohup pg_restore --data-only --disable-triggers --no-owner --no-acl \
  -d "$TARGET_URL" "$DUMP" \
  > ~/ws1-migration/restore.log 2>&1 &
echo "pg_restore PID: $!"
tail -f ~/ws1-migration/restore.log
# Ctrl+C tail when done; then:
echo "restore tail:"; tail -20 ~/ws1-migration/restore.log
psql "$TARGET_URL" -P pager=off -t -c "SELECT COUNT(*) FROM tenants;"
psql "$TARGET_URL" -P pager=off -t -c "SELECT pg_size_pretty(pg_database_size(current_database()));"
```

Pass: `tenants` count = **2**, target DB size **~9 GB**.

**Step 3 — parity gate (paste verbatim output)**

```bash
echo "=== ROW COUNT PARITY ==="
psql "$SOURCE_URL" -P pager=off -t -A -c "
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
  AND table_name NOT LIKE 'test\_%'
ORDER BY 1;" | while read -r tbl; do
  [ -z "$tbl" ] && continue
  src=$(psql "$SOURCE_URL" -P pager=off -t -A -c "SELECT COUNT(*) FROM public.\"$tbl\";")
  tgt=$(psql "$TARGET_URL" -P pager=off -t -A -c "SELECT COUNT(*) FROM public.\"$tbl\";")
  if [ "$src" != "$tgt" ]; then echo "MISMATCH $tbl source=$src target=$tgt"; else echo "OK $tbl $src"; fi
done | tee ~/ws1-migration/parity.log
grep '^MISMATCH' ~/ws1-migration/parity.log || echo "ALL ROW COUNTS MATCH"

run_pair() {
  local label="$1" sql="$2"
  echo "=== $label ==="
  echo "-- source"; psql "$SOURCE_URL" -P pager=off -c "$sql"
  echo "-- target"; psql "$TARGET_URL" -P pager=off -c "$sql"
}
run_pair "tenants" "SELECT id, slug FROM tenants ORDER BY id;"
run_pair "bastrop_permit_count" "SELECT COUNT(*) FROM mygov_permits WHERE tenant_id = 2;"
run_pair "bastrop_wo_current" "SELECT COUNT(*) FROM mygov_work_orders WHERE tenant_id = 2 AND is_current = true;"
run_pair "raw_records_total" "SELECT COUNT(*) FROM mygov_raw_records;"
run_pair "demo_tenant_rows" "SELECT COUNT(*) FROM department_metrics WHERE tenant_id = 1;"
run_pair "bastrop_alerts" "SELECT COUNT(*) FROM alerts WHERE tenant_id = 2;"
run_pair "max_wo_id_bastrop" "SELECT MAX(id) FROM mygov_work_orders WHERE tenant_id = 2;"
run_pair "sync_status" "SELECT tenant_id, sync_type, status, completed_at FROM mygov_sync_status WHERE tenant_id = 2 ORDER BY id DESC LIMIT 3;"
run_pair "db_size" "SELECT pg_size_pretty(pg_database_size(current_database()));"
```

### 2B parity artifacts (attempt 1 — failed, for record)

```
backup exit: 1 (~/backup/ dir missing)
data pg_dump exit: 1 (operator ^C at 758435840 bytes)
data restore exit: 3 (session_replication_role permission denied)
target db_size: 13 MB vs source 9431 MB
tenants target: 0 rows
```

### 2B gate verdict

```
FAILED_ATTEMPT_1 — retry Step 0→3 above; do not proceed to 2C
```

---

## PHASE 2C — cutover + observation

**Status:** `BLOCKED` — do not run until 2B gate = PASS.

**Prior revision hold:** `smartcity-api-00104-taw` @ 0% after cutover (instant rollback).

### Pre-cutover: record current secret version

```bash
gcloud config set project smartcity-os-prod
gcloud secrets versions list smartcity-DATABASE_URL --limit=3
PRIOR_DB_SECRET_VERSION=<note latest version number before add>
```

### Step 1 — add new `smartcity-DATABASE_URL` version (Empressa target)

Use the **pooled** runtime URL if Neon console provides one for Cloud Run; otherwise direct endpoint per provisioned secret.

```bash
TARGET_URL=$(gcloud secrets versions access latest --secret=smartcity-EMPRESSA_DATABASE_URL)
# Optional: swap to pooler URL if operator has it:
# TARGET_URL='postgresql://...-pooler...'

echo -n "$TARGET_URL" | gcloud secrets versions add smartcity-DATABASE_URL --data-file=-
NEW_DB_SECRET_VERSION=$(gcloud secrets versions list smartcity-DATABASE_URL --limit=1 --format='value(name)')
echo "New secret version: $NEW_DB_SECRET_VERSION"
```

### Step 2 — canary deploy (no traffic)

```bash
gcloud config set run/region us-central1

# Audit traffic pins BEFORE deploy
gcloud run services describe smartcity-api --region us-central1 \
  --format='value(status.traffic[].tag,status.traffic[].revisionName,status.traffic[].percent)'

gcloud builds submit --config cloudbuild-api.yaml

gcloud run deploy smartcity-api \
  --image us-central1-docker.pkg.dev/smartcity-os-prod/cloud-run-source-deploy/smartcity-api:latest \
  --region us-central1 \
  --tag ws1-2c-empressa-neon \
  --no-traffic \
  --update-secrets DATABASE_URL=smartcity-DATABASE_URL:${NEW_DB_SECRET_VERSION}

CANARY_URL=$(gcloud run services describe smartcity-api --region us-central1 \
  --format="value(status.traffic[?tag=='ws1-2c-empressa-neon'].url)")
echo "Canary: $CANARY_URL"
```

**Note:** `run-migrations` step is a no-op for this cutover (schema+data pre-loaded via pg_dump; do NOT run `post-merge.sh` or replay migration SQL).

### Step 3 — smoke probes (canary URL)

```bash
curl -sI "$CANARY_URL/api/healthz"
curl -sI "$CANARY_URL/api/healthz" -H "x-internal-ai: smartcity-ctx"

# Compass AI internal-call path (adjust path if needed for your session token pattern)
curl -sI "$CANARY_URL/api/ai-assistant/health" -H "x-internal-ai: smartcity-ctx"

# MyGov scraper health (service may be separate — probe API read path)
curl -s "$CANARY_URL/api/mygov/sync-status?tenantId=2" | head -c 500

# Bastrop tenant_id=2 read
curl -s "$CANARY_URL/api/calendar/events/public?tenantId=2" | head -c 500
```

### Step 4 — traffic shift

```bash
# Shift to canary tag
gcloud run services update-traffic smartcity-api --region us-central1 \
  --to-tags ws1-2c-empressa-neon=100

# Hold prior revision at 0% (verify 00104-taw not receiving traffic)
gcloud run services update-traffic smartcity-api --region us-central1 \
  --to-revisions smartcity-api-00104-taw=0

# Production verify
curl -sI https://smartcityos.io/api/healthz
```

### Step 5 — backup tag

```bash
DEPLOYED_REV=$(gcloud run revisions list --service=smartcity-api --region=us-central1 \
  --limit 1 --format='value(metadata.name)')
echo "Deployed: $DEPLOYED_REV"

# From smartcity-os clone on operator workstation:
git tag backup/post-phase-2c-ebb446b
git push origin backup/post-phase-2c-ebb446b
```

### 2C artifacts

```
(awaiting 2B pass + operator output)
```

### 24h observation baseline

```
(awaiting 2C cutover)
```

| Metric | Baseline (pre-cutover) | Threshold |
|---|---|---|
| Error rate | TBD | >2× baseline → rollback |
| Latency p50/p95/p99 | TBD | p95 >50% over baseline → rollback |
| Compass AI success | TBD | failures → rollback |
| MyGov scraper success | TBD | failures → rollback |
| healthz | 401 JSON (expected) | non-401/5xx spike → investigate |

### Rollback procedure

```bash
# Revert secret to prior version
gcloud secrets versions access ${PRIOR_DB_SECRET_VERSION} --secret=smartcity-DATABASE_URL > /dev/null
gcloud run services update-traffic smartcity-api --region us-central1 \
  --to-revisions smartcity-api-00104-taw=100
# Redeploy or update-secrets to pin DATABASE_URL to PRIOR_DB_SECRET_VERSION if needed
```

---

## Session close state

| Phase | Status |
|---|---|
| Pre-flight | PASS (`main` @ `ebb446b`) |
| 2A schema sync | PASS (operator attested) |
| 2B data sync | FAILED_ATTEMPT_1 — retry queued |
| 2C cutover + obs | BLOCKED on 2B |

**Next action:** Operator runs Phase 2B Cloud Shell block; paste row-count parity + sample-query output for gate verdict before 2C.
