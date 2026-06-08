---
id: 2026-06-08_smartcity_neon_no_tenant_id_and_raw_retention
title: SmartCity Empressa Neon - no-tenant_id verification + raw-table retention tee-up
date: 2026-06-08
kind: research
agent: claude_code (primary planner)
related: [80_adrs/adr_005_multitenancy, 30a_smartcity_stabilization_sprint, 31a_bastrop_maintenance_sprint, 76e_platform_observability_sprint, 90_runbooks/replit_neon_migration, 91_postmortems/2026-05-07_replit_dev_db_wedged, 00_current_state]
---

# SmartCity Empressa Neon - no-tenant_id verification + raw-table retention tee-up

> **What this is.** Backlog-grind output (2026-06-08), produced autonomously while the Bastrop PBI and precedence cc-agents run. Two WS-4 follow-throughs: (1) re-verify the ADR-005 Layer B no-tenant_id classification against the live migrated Empressa Neon, and (2) tee up the raw-table retention decision for the operator. The retention decision is the operator's (city operational data, human-gated hard rule); this doc recommends, it does not decide.

## Source

Live introspection of `smartcity-EMPRESSA_DATABASE_URL` (project `smartcity-os-prod`), 2026-06-08, via `information_schema` and `pg_stat_user_tables`. Verbatim queries run from the planning host. Current production serves `smartcity-api-00106-riz` (empressa-neon) at 100 percent.

## Finding 1 - the no-tenant_id set is 15, not 10

ADR-005's Layer B verification-prep table (from the 2026-06-07 Phase 2A schema sync) listed 10 no-tenant_id tables. Live introspection of the migrated DB returns **15**. tenant_id parity holds (91 tables carry tenant_id). The 2A review captured only the isolation-review subset; the five additional tables are all non-isolation-critical and are now folded into the ADR-005 table:

| Table | Rows | Verdict |
|---|---|---|
| `tenants` | 2 | OK-global - the tenant registry itself |
| `products` | 4 | OK-global - platform product catalog |
| `platform_admins` | 1 | OK-global - `assigned_states`, cross-tenant by design |
| `admin_password_reset_tokens` | 0 | OK-global - FK `admin_id` to `platform_admins` |
| `ticket_messages` | 0 | OK-by-FK - `ticket_id` to `support_tickets`, which carries tenant_id (confirmed live) |

None are CANDIDATEs, so the isolation-critical CANDIDATE set is unchanged at five (`activity_logs`, `chat_messages`, `live_chats`, `mygov_raw_records`, `mygov_raw_sync_pages`). The correction matters for the WS-4 checklist (the two-tenant leakage smoke test must account for 15 global/FK tables, not 10) but adds no new isolation risk.

## Finding 2 - three CANDIDATEs are empty; scope them now

`activity_logs` (3 rows), `chat_messages` (0), and `live_chats` (0) are empty or trivial today. Adding `tenant_id NOT NULL` plus a tenant-leading index now is near-zero cost; deferring means a backfill against live data later. Recommendation: scope these three in the WS-4 dispatch rather than accepting them as global. This is a cheap, reversible storage-layer move with no decision dependency, so it can ride the same cc-agent-M WS-4 PR.

## Finding 3 - the raw tables (the decision)

`mygov_raw_records` (8089 rows / 23 MB) and `mygov_raw_sync_pages` (18 rows / 14 MB; large per-row HTML blobs) are repopulating post-migration. `mygov_raw_records` went 4059 -> 8089 in roughly one hour on 2026-06-08, so it is actively climbing as the scraper backfills. These are the tables that grew to roughly 20 GB on the old Replit-managed Neon and drove the wedge ([`91_postmortems/2026-05-07_replit_dev_db_wedged.md`](../91_postmortems/2026-05-07_replit_dev_db_wedged.md)); they were intentionally migrated empty (lean/raw split, [`90_runbooks/replit_neon_migration.md`](../90_runbooks/replit_neon_migration.md)).

Properties that shape the decision:

- **Regenerable.** The raw rows are scraper captures; the normalized, tenant-scoped truth lives in `mygov_work_orders` (which carries tenant_id). Losing a raw row that has been normalized loses nothing the platform serves.
- **Growth is unbounded without a policy.** Left alone, these climb back toward the multi-GB wedge range on the new Empressa Neon, which the migration just got off.
- **Hard rule.** City operational data retention or deletion is alert-only and human-gated, never auto-remediated (76e finding, partnership-first commitment). So a retention policy is an operator decision, and any enforcement is gated, not autonomous.

### Options

1. **TTL/archive after normalization (recommended).** Tenant-tag raw rows at ingest; once a raw row is confirmed normalized into `mygov_work_orders`, archive it to GCS (cold, cheap) and drop it from Neon after a retention window. Keeps Neon lean, preserves an auditable raw trail off the hot DB, and the growth alert (already in the 76e smartcity monitoring dispatch) is the guardrail.
2. **Partition by month, keep in Neon.** Simpler operationally; retains the full wedge risk on the hot DB; only helps query/vacuum cost, not size.
3. **Keep raw indefinitely in Neon.** Rejected - this is exactly the wedge the migration just escaped.

### The operator decision - DECIDED 2026-06-08

Resolved by the operator 2026-06-08, logged at [`_decisions/2026-06-08_mygov_raw_retention.md`](../_decisions/2026-06-08_mygov_raw_retention.md) (status active). Option 1 (TTL/archive-after-normalization), with:

- `mygov_raw_records`: kept 90 days after a row is confirmed normalized into `mygov_work_orders`, then archived to GCS (JSONL, lifecycle nearline/coldline) and dropped from Neon.
- `mygov_raw_sync_pages` (big HTML blobs): same archive-then-drop on a shorter 14-day window.
- Raw rows tenant-tagged at ingest.
- Enforcement is a gated job with the MyGov growth alert as the trip, never an autonomous delete.

Reversal criteria (in the decision record): revisit if normalization proves lossy (widen the retained raw schema, not the window), if the in-window footprint still trends toward the wedge range (tighten toward 30 days), or if audit/compliance needs a longer trail (lengthen, in GCS not Neon).

## Recommended WS-4 / next-step actions

1. Fold the corrected 15-table classification into the WS-4 leakage smoke test (done in ADR-005 2026-06-08).
2. Scope the three empty CANDIDATEs (`activity_logs`, `chat_messages`, `live_chats`) for `tenant_id NOT NULL` + index in the WS-4 cc-agent-M dispatch (cheap now).
3. Operator: make the raw-retention call above; log via `decision-log`; then the raw tables get tenant-tagged at ingest plus the chosen TTL/archive, gated.
