---
id: replit_neon_migration
title: Runbook - migrating a city off Replit-managed Neon
status: active
last_updated: 2026-06-07
applies_to: smartcity-os
related: [30a_smartcity_stabilization_sprint, 12_migration_sprint, neon_schema_migration_via_cloud_shell, cloud_run_canary_deploy, 91_postmortems/2026-05-07_replit_dev_db_wedged]
owner: nick
---

# Runbook: migrating a city off Replit-managed Neon

> **Why this exists.** The Bastrop/SmartCity production migration off Replit-managed Neon (2026-06-07) took a full painful night because the obvious path (Cloud Shell `pg_dump`) fights a throttled, un-scalable source. This runbook records what actually worked so the next city is a fraction of the pain. The headline lesson: do the export from inside the Replit workspace as a managed workflow, split lean/raw, and only migrate the operational data.

## The traps (each cost hours)

1. **The source is throttled and you cannot scale it.** Replit-managed Neon is an external connection string in the workspace (secret `PROD_DATABASE_URL`); there is no Neon API key or console access from Replit, and Replit exposes no compute controls. So you cannot raise the CU. Single-threaded `pg_dump` from Cloud Shell ran ~2-6 MB/min. This un-scalability is the whole reason to migrate; do not burn time trying to speed the source.
2. **`idle_in_transaction_session_timeout = 5min` on the source kills long dumps.** `pg_dump` holds one snapshot transaction; against the slow source it goes idle-in-transaction during read stalls and the source guillotines the connection at the 5-minute mark - producing a truncated dump that dies at a *consistent* byte offset (we saw ~42 MB three times). Defeat it with `PGOPTIONS='-c idle_in_transaction_session_timeout=0 -c statement_timeout=0'`, or avoid long single-transaction dumps entirely (per-table / managed workflow).
3. **96% of the DB is regenerable raw scrape data.** `mygov_raw_records` (~5.7 GB) + `mygov_raw_sync_pages` (~3.3 GB) were 96% of a 9.5 GB DB; operational data was ~500 MB. Migrating the raw tables is the slow part and they re-scrape from MyGov. Split lean/raw and defer raw.
4. **Cloud Shell disconnects kill foreground jobs.** The session dropped repeatedly; any foreground loop or pipe died. Use `tmux` or `nohup`. Better: do the heavy export off Cloud Shell entirely (the managed-workflow approach below).
5. **`pg_restore -l` validates the TOC, not the data.** A truncated `-Fc` dump can pass `pg_restore -l` and still fail the actual restore with `could not read from input file: end of file`. Trust the restore, not the listing.
6. **Don't run two restores at once.** Re-pasting the launch block while one was running produced a second concurrent `pg_restore` and a storm of `relation already exists` errors. One reset, one restore.

## The path that worked

### 1. Export from inside Replit as a managed workflow (not Cloud Shell)

The Replit workspace has better/closer access to the source and a managed-workflow runner with no command-time limit. Run there:

```
# lean: all tables, schema + data, EXCLUDING the raw tables' data (structure still created)
pg_dump -Fd -j 6 --exclude-table-data=public.mygov_raw_records \
  --exclude-table-data=public.mygov_raw_sync_pages \
  "$PROD_DATABASE_URL" -f lean_dir
# raw (optional, deferrable): data-only for the two raw tables
pg_dump -Fd -j 2 --data-only -t public.mygov_raw_records -t public.mygov_raw_sync_pages \
  "$PROD_DATABASE_URL" -f raw_dir
```

Directory format (`-Fd`) + parallel (`-j`) + a managed workflow (no timeout) is what gets past the throttle. Verify each `pg_dump` exits 0. Result for Bastrop: lean 42.7 MB, raw 1.01 GB.

### 2. Move the lean archive to the restore host

The lean archive is small (~43 MB). Simplest reliable transfer: download it from the Replit Files pane, then Cloud Shell three-dot menu -> Upload. (Committing to git can stall on Replit's merge pipeline never reaching the GitHub remote - don't depend on it. The raw 1 GB exceeds GitHub's 100 MB limit anyway.)

### 3. Restore the lean archive to the new Neon (Cloud Shell)

```
export TARGET_URL=$(gcloud secrets versions access latest --secret=<city>-EMPRESSA_DATABASE_URL)
# clean slate: drop BOTH public and Replit's internal _system schema
psql "$TARGET_URL" -c "DROP SCHEMA IF EXISTS public CASCADE; DROP SCHEMA IF EXISTS _system CASCADE; CREATE SCHEMA public;"
tar -xzf smartcity_prod_lean.tar.gz   # -> lean_dir
nohup pg_restore -d "$TARGET_URL" -j 2 --no-owner --no-privileges lean_dir > ~/lean-restore.log 2>&1 &
```

Monitor read-only: `ps aux | grep '[p]g_restore'`, `SELECT pg_size_pretty(pg_database_size(current_database()))` (climbs), `grep -ci error ~/lean-restore.log` (stays 0). ~500 MB to a healthy target finishes in a few minutes. Run it ONCE.

If a transient `Temporary failure in name resolution` kills a parallel worker, just reset and retry (drop to `-j 1` if it recurs - single connection never reconnects, immune to mid-run DNS blips).

### 4. Verify

```
psql "$TARGET_URL" -c "SELECT id, slug FROM tenants ORDER BY id;"    # the city present
psql "$TARGET_URL" -c "SELECT count(*) FROM mygov_work_orders;"      # real count
psql "$TARGET_URL" -c "SELECT count(*) FROM mygov_raw_records;"      # 0 (deferred)
```
The lean archive is a verified `pg_dump`, so target == production as of the export; no need to diff the throttled live source.

### 5. Cutover (Cloud Run canary)

Read the service config first (region, which secret `DATABASE_URL` reads from), then:

```
# canary: re-point DATABASE_URL to the new secret, ZERO traffic, tagged
gcloud run services update <city>-api --region us-central1 \
  --update-secrets=DATABASE_URL=<city>-EMPRESSA_DATABASE_URL:latest --no-traffic --tag empressa-neon
# smoke the tagged URL (https://empressa-neon---<service-host>) - load the real dashboard
# shift:
gcloud run services update-traffic <city>-api --region us-central1 --to-tags empressa-neon=100
```
The prior revision stays at 0% for instant rollback: `update-traffic --to-revisions=<prior>=100`. If the new revision can't access the new secret, grant the runtime SA `roles/secretmanager.secretAccessor` on it (the canary holds prod safe meanwhile). Note: `/healthz` may 404 (no such path) - smoke via the actual dashboard load, not a guessed health route.

### 6. Post-cutover

- Hold the prior revision + the old Neon ~24h before teardown.
- Rotate the old Neon password (it tends to surface in transcripts via `ps`/process listings).
- Confirm the scraper runs against the new DB and repopulates the deferred raw tables.
- Decide raw retention (WS-4): re-scrape vs restore `raw_dir` vs a retention window. Usually do NOT drag the full raw history onto the clean instance - those tables are what wedge the DB.

## Revision history

- **2026-06-07 (origin):** Written from the Bastrop/SmartCity production migration. Captures the throttle / idle-timeout / lean-raw-split / Replit-managed-workflow-export / canary-cutover path and the traps that cost the night.
