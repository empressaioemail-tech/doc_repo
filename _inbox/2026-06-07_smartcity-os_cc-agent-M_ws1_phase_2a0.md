---
id: 2026-06-07_smartcity-os_cc-agent-M_ws1_phase_2a0
title: WS-1 Phase 2A.0 — journal reconcile + post-merge findings (cc-agent-M)
date: 2026-06-07
agent: cc-agent-M
repo: smartcity-os
kind: inbox-session
related: [30a_smartcity_stabilization_sprint, 2026-06-07_smartcity-os_cc-agent-M_m_stabilize_reorient, 12_migration_sprint]
---

# WS-1 Phase 2A.0 shipped — journal reconcile

**Branch:** `chore/ws1-phase-2a0-migration-journal-reconcile`  
**Commit:** `19c446b`  
**PR:** https://github.com/empressaioemail-tech/smartcity-os/pull/21  
**Posture:** Open for review; no production deploy.

---

## What landed

### 1. `post-merge.sh` findings (read-only)

`_research/ws1_post_merge_sh_findings.md` — all three retired Neon blocks
(mygov_fees index, AI tables bootstrap, mygov_schema_sync runner) are **(a)
idempotent and safe to skip** for Phase 2A `pg_dump --schema-only`. Phase 3
should import journal history, not replay post-merge against Empressa target.

### 2. Migration prefix collision resolution

Renamed SQL files to unique sequential prefixes; expanded `_journal.json` from
6 → 9 entries (slots 0–8). Hand-authored migrations journaled:

| Slot | Tag |
|---|---|
| 3 | `0003_mygov_schema_sync` |
| 6 | `0006_enrichment_expanded_columns` |
| 8 | `0008_fleet_samsara_expansion` |

Drizzle migrations shifted: `0003_curious` → `0004_curious`,
`0004_premium` → `0005_premium`, `0005_inspection` → `0007_inspection`.

Detail: `_research/ws1_migration_journal_reconcile.md`

### 3. Path reference updates

- `scripts/deploy-staging.sh` — fleet migration path → `0008_fleet_*`
- `STAGING.md` — same
- `scripts/post-merge.sh` — unchanged (`0003_mygov_schema_sync.sql`)

---

## Phase 2A.0 gate status

| Prereq | Status |
|---|---|
| post-merge.sh findings doc | ✅ |
| Migration prefix collisions | ✅ (PR #21 pending merge) |
| gcloud SSL on Nick box | ⏳ Nick-only; Cloud Shell workaround valid |

**Phase 2A schema sync:** unblocked after PR #21 merge + operator review.

---

## Next steps (Phase 2A)

1. Operator merge PR #21
2. Cloud Shell schema-only sync per `90_runbooks/neon_schema_migration_via_cloud_shell.md`
   - Source: `smartcity-DATABASE_URL` (Replit Neon, `us-west-2`)
   - Target: `smartcity-EMPRESSA_DATABASE_URL` (`us-east-2`, PG 18)
3. Parity verification (table/col/idx/tenant_id counts)
4. Schedule Phase 2B low-traffic window with Nick

---

## Verbatim `git log --oneline -3` (branch HEAD)

```
19c446b chore(migrations): WS-1 Phase 2A.0 journal reconcile + prefix collision fix
62dbf28 fix(calendar): BASTROP_TENANT_ID 1 -> 2 to match prod tenant identity rule (#20)
d42edcb fix(powerbi): drop workspace qualifier from DAX executeQueries URL for cross-workspace dataset access (#19)
```
