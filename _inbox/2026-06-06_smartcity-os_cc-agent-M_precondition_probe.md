---
id: 2026-06-06_smartcity-os_cc-agent-M_precondition_probe
title: Precondition probe — M-Stabilize WS-1 release gate (cc-agent-M)
date: 2026-06-06
agent: cc-agent-M
repo: smartcity-os
kind: inbox-probe
related: [30a_smartcity_stabilization_sprint, 12_migration_sprint, 10_ground_truth, 91_postmortems/2026-05-07_replit_dev_db_wedged, 2026-05-21_cc-agent-M_m_stabilize_restart]
---

# cc-agent-M precondition probe — smartcity-os (read-only)

**Probe type:** Read-only reconnaissance. No migrate, deploy, DB writes, or PRs opened.

**Default stance:** NOT CLEAR to proceed. Evidence below must overturn that.

---

## Opening state — git / PRs (verbatim)

### `git log --oneline -10`

```
3bc4eb8 docs(research): Bastrop platform health check (read-only recon)
d42edcb fix(powerbi): drop workspace qualifier from DAX executeQueries URL for cross-workspace dataset access (#19)
b077804 fix(calendar): iCal DTSTART/DTEND NaN in eventsToICal (#18)
7db0e5a fix(calendar): point widget links to Bastrop microsite + persistent LKG for iCal feed (#17)
ad4fad1 fix(calendar): parseDate/parseLocalDate tolerate Municode T-component isoDate (#16)
fd26487 fix(calendar): predicate B — apply F-3 parse pattern to ai-assistant context snapshot (#15)
0d033bd chore: rename AI_INTEGRATIONS_* env reads to canonical SDK names (#14)
04b296e docs(research): W1.A.7 PBI Option B scoping (#13)
86a90ff fix(calendar): W1.A.6 batch — F-1 public endpoint, F-3 TZ, F-4 VTIMEZONE, F-5 Municode await, F-6 boot canary (#12)
5b9815e fix(spireon): W1.A.8 batch — F-2 mapDepartment, F-3 active flag, F-4 retry+LKG, F-8 disappearance log (#11)
```

### `git status`

```
On branch recon/bastrop-platform-health-check
Your branch is ahead of 'origin/main' by 1 commit.
  (use "git push" to publish your local commits)

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

### `gh pr list --limit 20`

```
1	ci(dast): grant issues:write for ZAP findings	ci/dast-issues-write-permission	OPEN	2026-04-20T13:39:10Z
```

### `git fetch origin` + HEAD vs `origin/main`

```
From https://github.com/empressaioemail-tech/smartcity-os
   d42edcb..62dbf28  main       -> origin/main
 * [new tag]         backup/pre-pbi-dax-workspace-fix-20260518 -> backup/pre-pbi-dax-workspace-fix-20260518
3bc4eb8cb5fa82c0ff90314c8aea07d851ea6281
62dbf286be690103fa1f9c60a3b21aa7016c8675
62dbf28 fix(calendar): BASTROP_TENANT_ID 1 -> 2 to match prod tenant identity rule (#20)
3bc4eb8 docs(research): Bastrop platform health check (read-only recon)
```

Local HEAD `3bc4eb8` is **behind** `origin/main` `62dbf28` by one commit. No `origin/main` commits after 2026-05-21 (operator hold date):

```
git log --oneline --since="2026-05-21" origin/main
(empty)
```

Latest `origin/main` commit date:

```
62dbf28 2026-05-19 11:00:53 -0500 fix(calendar): BASTROP_TENANT_ID 1 -> 2 to match prod tenant identity rule (#20)
```

---

## Q1 — Production source-of-truth DB (highest rigor)

### Finding summary

**WS-1 premise still holds.** Production `DATABASE_URL` on `smartcity-os-prod` points to **Replit-managed Neon in `us-west-2`**, not Empressa-owned Neon in `us-central1`. The secret has **not moved** during the operator hold: only two versions exist, both created **2026-04-04**. No Empressa Neon target secret exists in this GCP project.

**Operator direct DB work is evidenced** on the same Replit Neon instance (hand-applied schema beyond Drizzle journal), but this is **incremental schema evolution**, not a migration/cutover. WS-1 scope is **not obsolete** — it is **still required** — but operator manual changes would **collide** with blind WS-1 execution unless documented first.

### Live `smartcity-DATABASE_URL` secret (GCP Secret Manager)

Secret name on Cloud Run is `smartcity-DATABASE_URL` (not bare `DATABASE_URL`):

```
ERROR: (gcloud.secrets.versions.access) NOT_FOUND: Secret [projects/494195107606/secrets/DATABASE_URL] not found
```

Successful access:

```
gcloud secrets versions access latest --secret=smartcity-DATABASE_URL --project=smartcity-os-prod
```

```
postgresql://neondb_owner:<REDACTED>@ep-floral-sound-afocvkct.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require
```

**Parsed identity (non-secret fields):**

| Field | Value |
|---|---|
| Host | `ep-floral-sound-afocvkct.c-2.us-west-2.aws.neon.tech` |
| Region | `us-west-2` (Neon endpoint suffix) |
| Database | `neondb` |
| Neon project | Replit-managed endpoint `ep-floral-sound-afocvkct` (per `10_ground_truth.md`; Nick has no Neon Console access) |
| Ownership | Replit-managed, **not** Empressa-owned `us-central1` target from `12_migration_sprint.md` Phase 2A |

### Secret version history — did it move during hold?

```
gcloud secrets versions list smartcity-DATABASE_URL --project=smartcity-os-prod --format="json"
```

```json
[
  {
    "createTime": "2026-04-04T20:36:00.268411Z",
    "name": "projects/494195107606/secrets/smartcity-DATABASE_URL/versions/2",
    "state": "ENABLED"
  },
  {
    "createTime": "2026-04-04T18:15:36.946440Z",
    "name": "projects/494195107606/secrets/smartcity-DATABASE_URL/versions/1",
    "state": "ENABLED"
  }
]
```

Version 2 host (redacted credential):

```
VERSION_2_HOST: ep-floral-sound-afocvkct.c-2.us-west-2.aws.neon.tech
```

**Unexpected state (HR-9):** Version 1 direct access crashed gcloud with `UnicodeEncodeError` on this box. Version 2 and `latest` both resolve to the same `ep-floral-sound` host. **No secret version created on or after 2026-05-21.**

### Staging secret — same source DB

```
STAGING_HOST: ep-floral-sound-afocvkct.c-2.us-west-2.aws.neon.tech
```

### Empressa Neon target — not provisioned in GCP

```
gcloud secrets list --project=smartcity-os-prod --format="table(name,createTime)" | findstr /i "EMPRESSA neon DATABASE"
```

```
NAME: smartcity-DATABASE_URL
NAME: smartcity-staging-DATABASE_URL
```

No `EMPRESSA_DATABASE_URL`, `smartcity-EMPRESSA_DATABASE_URL`, or second Neon endpoint secret. Phase 2A checklist item "Empressa Neon project created in us-central1" (`12_migration_sprint.md`) remains **unchecked**.

### Cloud Run + scraper both reference same secret

`smartcity-api` live revision `smartcity-api-00104-taw`:

```
spec:
  containers:
  - env:
    - name: DATABASE_URL
      valueFrom:
        secretKeyRef:
          key: latest
          name: smartcity-DATABASE_URL
```

`smartcity-scraper` also binds `smartcity-DATABASE_URL` at `key: latest`.

### Production DB connectivity proof (read-only SQL)

Connected with `latest` secret; `NODE_TLS_REJECT_UNAUTHORIZED=0` required on this box for Node→Neon TLS (separate SSL issue, see Q5).

```
=== connection ===
[
  {
    "db": "neondb",
    "pg_version": "PostgreSQL 16.14 (896e976) on aarch64-unknown-linux-gnu, compiled by gcc (Debian 10.2.1-6) 10.2.1 20210110, 64-bit"
  }
]
```

### Evidence of operator manual schema work (same DB, not a migration)

Production contains objects from **unjournaled** repo migrations — applied outside Drizzle/`_journal.json` tracking:

```
=== enrichment_cols ===
[
  { "column_name": "approved_date" },
  { "column_name": "submitted_date" }
]
```
(from `migrations/0004_enrichment_expanded_columns.sql`, **not** in `_journal.json`)

```
=== fleet_tables ===
[
  {
    "fleet_vehicles": "fleet_vehicles",
    "fleet_safety_events": "fleet_safety_events",
    "fleet_dvirs": "fleet_dvirs"
  }
]
```
(from `migrations/0006_fleet_samsara_expansion.sql`, **not** in `_journal.json`)

```
=== drizzle_regclass ===
[
  {
    "public_drizzle": null,
    "drizzle_schema_drizzle": null
  }
]
```

**Interpretation:** Operator (or prior manual runs) applied schema directly to production Replit Neon during/after hold window. Scope of that work is **not documented in git commits since 2026-05-21**. This is collision risk for WS-1 Phase 2A schema sync unless operator provides a change log.

### WS-1 premise verdict

| Claim | Status |
|---|---|
| Production still on Replit-managed Neon | **CONFIRMED** |
| Production moved to Empressa Neon during hold | **NOT OBSERVED** |
| Operator restructured data path | **NOT OBSERVED** (same endpoint since April) |
| Operator applied manual schema on live DB | **CONFIRMED** (enrichment cols + fleet tables) |
| WS-1 scope obsolete | **NO** — migration still needed |
| WS-1 safe to fire without operator sync | **NO** — manual schema drift undocumented |

**Route to planner:** WS-1 scope has **not** drifted into irrelevance. Operator work appears to be **same-DB manual DDL**, not a substitute migration. Planner should obtain operator release + manual-change inventory before re-firing M-Stabilize restart dispatch.

---

## Q2 — Live Cloud Run revision and traffic

### Doc claim

30a / ground truth: `smartcity-api-00104-taw` at 100%.

### Verdict: **CONFIRMED**, with annotation

```
gcloud run services describe smartcity-api --region=us-central1 --project=smartcity-os-prod --format="yaml(status.traffic,status.latestReadyRevisionName)"
```

```
status:
  latestReadyRevisionName: smartcity-api-00104-taw
  traffic:
  - revisionName: smartcity-api-00080-men
    tag: p0-3-canary
  - revisionName: smartcity-api-00082-pog
    tag: p0-followup-prophecy
  - revisionName: smartcity-api-00084-weg
    tag: w1-c-4a-auth-fix
  - revisionName: smartcity-api-00096-jig
    tag: pbi-ai-cal-20260511
  - revisionName: smartcity-api-00099-vip
    tag: lkg-20260515-1848
  - revisionName: smartcity-api-00101-nir
    tag: ical-nan-fix-20260518
  - revisionName: smartcity-api-00103-tur
    tag: pbi-dax-workspace-fix-20260518
  - latestRevision: true
    percent: 100
    revisionName: smartcity-api-00104-taw
    tag: bastrop-tenant-fix
```

Revision metadata:

```
metadata:
  creationTimestamp: '2026-05-19T16:16:48.316446Z'
```

Deployed **2026-05-19** (two days **before** operator hold 2026-05-21). No newer revision since hold.

### Secret versions referenced by live revision

All env secrets use `key: latest` (not pinned numeric versions). For `DATABASE_URL`:

```
secretKeyRef:
  key: latest
  name: smartcity-DATABASE_URL
```

With only versions 1 and 2 (both April 4), `latest` = version 2 = `ep-floral-sound` Replit Neon.

---

## Q3 — In-flight / uncommitted operator state (collision risk)

### Repo working tree vs `origin/main`

- Branch: `recon/bastrop-platform-health-check` (not `main`)
- Behind `origin/main` by `62dbf28` (tenant-id fix #20)
- Ahead by `3bc4eb8` (local docs-only recon commit)
- Untracked audit markdown files in repo root (not staged)
- `git diff origin/main -- migrations/` → **empty** (no local migration edits)

### `origin/main` migration files on disk

```
git ls-tree --name-only origin/main migrations/
```

```
migrations/0003_curious_hammerhead.sql
migrations/0003_mygov_schema_sync.sql
migrations/0004_enrichment_expanded_columns.sql
migrations/0004_premium_gambit.sql
migrations/0005_inspection_geocoding.sql
migrations/0006_fleet_samsara_expansion.sql
migrations/meta
```

### `migrations/meta/_journal.json` (local = origin/main)

```json
{
  "version": "7",
  "dialect": "postgresql",
  "entries": [
    { "idx": 0, "tag": "0000_early_dracula" },
    { "idx": 1, "tag": "0001_plain_snowbird" },
    { "idx": 2, "tag": "0002_wealthy_menace" },
    { "idx": 3, "tag": "0003_curious_hammerhead" },
    { "idx": 4, "tag": "0004_premium_gambit" },
    { "idx": 5, "tag": "0005_inspection_geocoding" }
  ]
}
```

### 30a Phase 2A prereqs — collision status

| Prereq | 30a expectation | Current state |
|---|---|---|
| `0003` prefix collision | `0003_curious_hammerhead.sql` vs `0003_mygov_schema_sync.sql` | **STILL OPEN** — both files on `origin/main`; journal lists only `0003_curious_hammerhead` |
| `0004` prefix collision | `0004_premium_gambit.sql` vs `0004_enrichment_expanded_columns.sql` | **STILL OPEN** — both files on `origin/main`; journal lists only `0004_premium_gambit`; enrichment cols **are** on production (hand-applied) |
| `0006_fleet_samsara_expansion.sql` | (post-30a) | On disk, **not** in journal; fleet tables **are** on production |
| `mygov_work_orders` dedup | Resolve duplicate definition artifacts | **Data level: clean** (`dup_groups: 0`). **Repo level: still ambiguous** — table defined across multiple snapshots/migrations |
| Drizzle tracking on prod | Phase 3 concern | **No** `__drizzle_migrations` table in `public` or `drizzle` schema |

```
=== mygov_work_orders_dup_check ===
[
  { "dup_groups": 0 }
]
```

### Backup tags (rollback posture)

```
git tag -l "backup/*"
```

```
backup/p0-6-cutover-pre-20260503-201715
backup/p0-followup-prophecy-pre-20260503-235103
backup/post-fire-1-5e9fca3
backup/post-ical-nan-fix-smartcity-api-00101-nir
backup/post-lkg-pr17-smartcity-api-00099-vip
backup/post-pbi-ai-cal-smartcity-api-00093-yit
backup/post-pbi-ai-cal-smartcity-api-00096-jig
backup/pre-ical-nan-fix-20260518
backup/pre-lkg-pr17-20260515
backup/pre-pbi-ai-cal-20260511
backup/pre-pbi-dax-workspace-fix-20260518
```

No `backup/post-2B-*` or `backup/post-2C-*` tags (consistent with WS-1 not executed).

### Git activity since hold

No commits on `origin/main` after 2026-05-21. Operator DB work, if ongoing, is **outside git/secret/deploy audit trail**.

---

## Q4 — Schema reality vs WS-1 assumptions

### Public table count

30a expects ~106.

```
=== public_table_count ===
[
  { "public_table_count": 106 }
]
```

**MATCHES** WS-1 assumption.

### Tenant identity

```
=== tenants ===
[
  { "id": 1, "slug": "your-city" },
  { "id": 2, "slug": "bastrop" }
]
```

Bastrop production tenant is `id=2` (consistent with #20 tenant-id fix intent).

### `tenant_id` integrity posture

Nullable `tenant_id` tables (only two):

```
=== nullable_tenant_id_tables ===
[
  { "table_name": "demo_signups" },
  { "table_name": "feedback_requests" }
]
```

All other `tenant_id`-bearing tables (including all `mygov_*` except none) are `NOT NULL`. This is **better than ADR-005 full audit** but not a substitute for WS-4 verification.

### MyGov raw-records growth trajectory

Postmortem wedge sizes (Replit **dev** DB, 2026-05-07):

| Table | Dev size (postmortem) |
|---|---|
| `mygov_raw_records` | ~20 GB |
| `mygov_raw_sync_pages` | ~9.3 GB |
| `mygov_work_orders` | ~1.2 GB |

**Production today** (same table names on live Replit Neon):

```
=== mygov_growth_tables ===
[
  {
    "table_name": "mygov_raw_records",
    "est_rows": "1984126",
    "total_size": "5672 MB"
  },
  {
    "table_name": "mygov_raw_sync_pages",
    "est_rows": "4007",
    "total_size": "3266 MB"
  },
  {
    "table_name": "mygov_work_orders",
    "est_rows": "37546",
    "total_size": "200 MB"
  }
]

=== db_size ===
[
  { "db_size": "9346 MB" }
]
```

**Assessment:** Production total ~9.3 GB with raw-records + sync-pages ≈ 8.9 GB. Growth pattern that wedged the 20 GiB Replit **dev** DB is **still present on production** at substantial scale (~2M raw rows). Not yet at dev-wedge levels but on the same unbounded-ingestion trajectory. WS-4 retention/TTL audit remains mandatory before/after migration.

### Empressa Neon target-tier headroom

**NOT OBSERVABLE** from this probe:

- No Empressa Neon instance provisioned for smartcity-os in GCP secrets
- No Neon Console API access from agent context
- `12_migration_sprint.md` Phase 2A "Empressa Neon project created in us-central1" unchecked

Planner/operator must confirm target tier sizing against ~9.3 GB current + projected MyGov growth before Phase 2B data sync.

---

## Q5 — Nick-only prereqs

### Local clone freshness (`P:\empressaio_tech_smartcity_os`)

| Check | State |
|---|---|
| Branch | `recon/bastrop-platform-health-check` (**not** `main`) |
| vs `origin/main` | Behind by `62dbf28`; ahead by `3bc4eb8` |
| 30a prereq | **NOT MET** — doc expects `git fetch && checkout main && pull --ff-only` |

### gcloud SSL health on this box

```
gcloud config list
```

```
[auth]
disable_ssl_validation = true
[core]
account = empressaioemail@gmail.com
custom_ca_certs_file = P:\tmp\win-ca-bundle.pem
project = legacy-design-tools-prod
```

```
gcloud info --run-diagnostics
```

```
Reachability Check passed.
Network diagnostic passed (1/1 checks passed).
ERROR: Hidden Property Check failed.
The following hidden properties have been set:
    [auth/disable_ssl_validation]
ERROR: Property diagnostic failed (0/1 checks passed).
ERROR: (gcloud.info) Some of the checks in diagnostics failed.
```

Every gcloud call emits:

```
InsecureRequestWarning: Unverified HTTPS request is being made to host '...'
```

**Functional but not clean:** Secret Manager and Cloud Run reads **succeed** on this box with the SSL workaround. This is **not** the "clean SSL" state 30a Phase 0/2A.0 requires. WS-1 Phase 2A historically mirrors Cloud Shell runbook pattern — Nick should confirm whether local gcloud is acceptable or Cloud Shell remains mandatory.

Node→Neon from this box additionally required `NODE_TLS_REJECT_UNAUTHORIZED=0` (certificate verification failure without workaround).

### `scripts/post-merge.sh` neutralization (Fire 4)

First 12 lines (file unchanged from Fire 4 retirement):

```bash
#!/bin/bash
# RETIREMENT NOTICE — 2026-05-10
# This script is neutralized. The Replit workspace SmartCityOSMain is retired.
...
echo "scripts/post-merge.sh: This script is retired. Production is on Cloud Run (smartcity-api). See doc_repo/10_ground_truth.md and doc_repo/91_postmortems/2026-05-07_replit_dev_db_wedged.md." >&2
exit 1
```

**CONFIRMED neutralized.** Bash not available on this Windows box to execute; early `exit 1` is present before any `DATABASE_URL` blocks.

---

## Verdict

# NOT CLEAR to release the hold and fire WS-1

Evidence does **not** overturn the default. WS-1 premise (Replit Neon → Empressa Neon) **still holds** and migration is **still needed**, but operator-hold collision conditions remain.

### Blocking items (dependency order)

1. **Operator hold release + manual DB change inventory.** No explicit release signal. Production shows hand-applied schema (enrichment columns, fleet tables) without journal/git trail since 2026-05-21. WS-1 Phase 2A schema sync would collide with undocumented operator DDL unless reconciled first.

2. **Operator confirmation that direct DB work is complete** (or a written scope boundary for what remains in-flight).

3. **Local clone refresh (Nick).** Checkout `main`, `git pull --ff-only` to `62dbf28`; reconcile or drop local `3bc4eb8` recon branch per operator preference.

4. **gcloud SSL posture (Nick).** Property diagnostic fails; `disable_ssl_validation=true` workaround active. Confirm WS-1 execution path (local gcloud vs Cloud Shell runbook) before Phase 2A.

5. **Migration prefix collision resolution (WS-1 Phase 2A.0).** `0003_*` and `0004_*` duplicate prefixes still on `origin/main`; `0006_*` applied to prod but absent from `_journal.json`. Production application order must be reconstructed and renamed consistently before Drizzle adoption.

6. **Empressa Neon target provisioning + headroom (WS-1 Phase 2A).** No `us-central1` Empressa Neon secret/instance observable in `smartcity-os-prod`. ~9.3 GB production DB + MyGov growth requires tier sizing before data sync.

7. **Only then:** Re-fire [`2026-05-21_cc-agent-M_m_stabilize_restart.md`](../_dispatches/2026-05-21_cc-agent-M_m_stabilize_restart.md) per operator word.

### Scope drift flag for planner

**No WS-1 rescoping required** based on this probe. Operator did **not** complete the Empressa Neon migration during hold. The sprint plan remains directionally correct; the gap is **execution safety** (undocumented manual schema on live Replit Neon), not obsolete premises.

---

*Probe completed 2026-06-06 by cc-agent-M. Read-only. Single write: this file.*
