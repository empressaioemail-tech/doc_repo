---
decision_id: 2026-06-08_mygov_raw_retention
date: 2026-06-08
owner: Nick
status: active
related_canonical: [80_adrs/adr_005_multitenancy, 30a_smartcity_stabilization_sprint, 31a_bastrop_maintenance_sprint, 76e_platform_observability_sprint, _research/2026-06-08_smartcity_neon_no_tenant_id_and_raw_retention, 90_runbooks/replit_neon_migration, 91_postmortems/2026-05-07_replit_dev_db_wedged]
---

## Decision

MyGov raw scrape tables on Empressa Neon get a tenant-tagged, archive-then-drop retention policy: `mygov_raw_records` is kept 90 days after a row is confirmed normalized into `mygov_work_orders`, then archived to GCS (JSONL, lifecycle to nearline/coldline) and dropped from Neon; `mygov_raw_sync_pages` (large HTML blobs) runs the same archive-then-drop on a shorter 14-day window; raw rows are tenant-tagged at ingest; enforcement is a gated job with the MyGov growth alert as the trip, never an autonomous delete.

## Context

The migration off Replit-managed Neon (2026-06-07/08) intentionally left the two raw tables empty (lean/raw split); the scraper is now repopulating them (`mygov_raw_records` 4059 -> 8089 in ~1h on 2026-06-08). These tables grew to ~20 GB and drove the prior Neon wedge (`91_postmortems/2026-05-07_replit_dev_db_wedged.md`), so an unbounded raw table on the new Empressa Neon would recreate the failure the migration just escaped. Alternatives considered: partition-in-place without deletion (rejected, retains the wedge risk on the hot DB) and drop-without-archive (rejected by the operator in favor of keeping an auditable raw trail off the hot DB).

## Structural commitment check

- **Partnership-first (load-bearing):** GREEN, conditional on the hard rule honored here - city operational data is human-gated and alert-only; enforcement is a gated job, never an autonomous delete.
- **Cost per jurisdiction (load-bearing):** GREEN - archive-then-drop keeps the hot DB lean, bounding per-jurisdiction storage cost; GCS cold storage is cheap.
- **Sell reasoning, not data:** GREEN - raw rows are inputs; the reasoning-bearing normalized atoms in `mygov_work_orders` are untouched and stay tenant-scoped.

## Reasoning

Raw rows are regenerable scraper captures, and the platform-serving truth lives in the normalized, tenant-scoped `mygov_work_orders` table, so a normalized raw row carries no unique platform value beyond an audit trail. The 90-day window gives a generous re-processing and debugging buffer before archive, longer than a 30-day aggressive lean, chosen because re-scraping a throttled source is expensive and a wider buffer reduces the chance of needing a re-fetch. `mygov_raw_sync_pages` holds large HTML page blobs (14 MB across 18 rows, the worst size-per-row offender) with the lowest re-use value, so a shorter 14-day window controls footprint without losing the short-term re-parse capability. Tenant-tagging at ingest closes the ADR-005 Layer B isolation gap for these CANDIDATE tables and ties the retention story to the tenant boundary. Enforcement as a gated job (not an autonomous actor) honors the partnership-first hard rule that city operational data is never auto-deleted; the existing MyGov growth alert (76e smartcity monitoring) is the trip that surfaces when the job should run or when growth is anomalous.

## Reversal criteria

Revisit if normalization proves lossy - a raw field is needed downstream that `mygov_work_orders` drops - in which case widen the retained raw schema rather than the retention window. Also revisit the 90-day window if the hot-DB footprint of in-window raw rows still trends toward the wedge range under live scraper volume (tighten toward 30 days), or if audit/compliance requires a longer raw trail (lengthen, but keep it in GCS not Neon).

## Dependencies

Depends on: the WS-4 storage work (tenant-tag at ingest + the archive/drop job) dispatched at `_dispatches/2026-06-08_cc-agent-M_ws4_tenant_scope_and_raw_retention.md`; ADR-005 Layer B (ratification pending). Depended on by: 30a WS-4 done-criteria (raw-table retention resolved); the cost-per-jurisdiction envelope (keeps SmartCity hot-DB cost bounded as jurisdictions onboard).

## Counterparties

Internal. Affects SmartCity OS operations (Bastrop tenant_id 2 today; future city tenants), the cost-per-jurisdiction commitment, and the partnership-first data-handling posture toward city operational data.
