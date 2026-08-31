---
id: 2026-08-31_neon_pooler_readonly_incident
title: Production write outage. The Neon pooler injected read-only on one database; both services routed to the direct endpoint
date: 2026-08-31
status: mitigated (not cured; Neon owes an explanation and the pooler should be restored)
severity: total loss of writes across the customer app and the MCP app; reads unaffected
detected: operator, 2026-08-31 ~02:11Z, OAuth reconnect failed with auth_callback_failed / session-exchange 500
services: cortex-api, smartsite-mcp
root_cause_owner: Neon (platform), not our code, schema, migration, or billing
---

# What broke

Every write against the `neondb` database failed with `cannot execute UPDATE in a read-only transaction`. Reads were unaffected throughout, which is why `/healthz` stayed green and `get_smart_site` answered normally while the product was functionally dead.

Observed failures, all one cause: `POST /api/auth/session-exchange` 500 (the operator could not reconnect the connector), `GET /api/property-explorer/v1/saved-properties` 500, `POST /api/property-explorer/v1/research/brief` 500 (the operator had seen this as "Research request returned 500." in the Property Brief panel roughly twenty minutes before the auth failure and it was the same fault), `GET /api/property-explorer/v1/records-request/inbox` 500, and `POST /api/county-ledger/recompute` 500 from Cloud Scheduler. On the MCP side every write tool was down: `create_screen`, `add_to_screen`, `save_property`, `set_property_status`.

# Diagnosis, and what each step ruled out

The instrument for each claim is named because the conclusion turns on the difference between two connections, not on any single reading.

`pg_is_in_recovery()` returned `f`, so this was the primary and not a replica. `pg_db_role_setting` returned zero rows, so no `ALTER DATABASE` or `ALTER ROLE` had set it. `pg_event_trigger` returned zero rows, so nothing in our schema set it on login, which PostgreSQL 17 would allow. `pg_settings` reported `default_transaction_read_only = on` with `source = session`, meaning something issued a `SET` on connect.

Then the discriminating pair. The `hauska_mcp` database, on the same host and the same `neondb_owner` role through the same pooler, was writable with `source = default`. And `neondb` connected DIRECTLY, bypassing the pooler, was writable with `source = default`, and an actual insert succeeded. The pooler read-only reproduced three times in a row.

So: the Neon pooler was injecting `SET default_transaction_read_only = on` on the `neondb` pool specifically. That rules out billing and quota, which would have hit the direct connection and the other database equally; it rules out our schema and our migrations; and it rules out a replica misroute. The account is on the `scale` plan and its projects show a quota reset of 2026-09-01, which was the tempting explanation and was wrong.

# Mitigation applied

A new secret `DEPLOYMENT_DATABASE_URL_DIRECT` holds the same connection string with `-pooler` removed from the hostname. The existing `DEPLOYMENT_DATABASE_URL` was left untouched so the revert is a traffic shift rather than a secret edit. `api-server-runtime` was granted accessor on the new secret.

Both consumers were redeployed on their existing image digests with `DATABASE_URL` bound to the new secret, canaried at 0 percent, health-checked, then shifted: `cortex-api-00670-bay` tag `dbfix` (image `sha256:679683fd`, unchanged from p543) and `smartsite-mcp-00076-fes` tag `dbfix` (image unchanged from p562). No application code changed.

Headroom checked before committing: the compute reports `max_connections` 901 with 23 in use, so running unpooled is safe at current load. This is the real cost of the mitigation and the reason it is temporary: many Cloud Run instances without a pooler will eventually exhaust connections in a way the pooler existed to prevent.

# Verification

The fixed revision `cortex-api-00670-bay` produced 0 read-only errors and 0 error-level entries across 40 log lines while successfully serving `/api/property-explorer/v1/entitlement` and `/api/brokerage/v1/map-data/gis-layer`.

One reading that looked like a failure and was not, recorded because it would mislead the next reader: for several minutes after the shift, read-only errors continued at roughly the previous rate. Attributed by revision, they came from EIGHT old revisions (00581, 00649, 00654, 00656, 00660, 00664, 00666, 00668) running in-process interval sweepers against the pooler, and none from 00670-bay. Old revisions with lingering instances keep executing their own timers regardless of traffic. Counting errors service-wide would have said the fix failed; counting them per revision said it worked. The aggregate was the wrong instrument.

End-to-end proof through the product was NOT performed by the planner: the planner's own connector token expired mid-incident. The operator's reconnect was the outstanding confirmation. **PARTIALLY CLOSED 2026-08-31, and the original wording here was an OVERCLAIM the planner is correcting.** The operator reconnected and a `create_screen` plus `save_property` write succeeded on the unpooled direct endpoint. That proves the **smartsite-mcp** write path, which writes to its own database on its own service. It was written up as "the product write path is proven end to end", which generalised one write path to the whole product and was wrong. A cortex-api write was never tested, and at the moment that claim was made cortex-api had already been reverted to the pooler for ninety minutes. **REGRESSION, same day, found by a customer-visible outage.** At 02:52Z the F-11 deploy (LDT #560) created `cortex-api-00672-ceq` and rebound `DATABASE_URL` from `DEPLOYMENT_DATABASE_URL_DIRECT` back to `DEPLOYMENT_DATABASE_URL`, the pooler. Authoritative-replace: that workflow carries the old secret in its own spec and had no reason to know the fix was applied by hand during the incident. cortex-api ran on the read-only-injecting pooler from 02:52Z until 13:0xZ. Reads stayed green the whole time, which is why nothing alerted; writes 500d. It surfaced as `session_exchange_failed` on Google login at smartsite.cloud, because a session exchange is a write. Fixed by redeploying the identical digest `sha256:37f77bfe` with `--update-secrets DATABASE_URL=DEPLOYMENT_DATABASE_URL_DIRECT:latest` as `cortex-api-00674-rap`, gated on binding, digest and health before the traffic shift. F-11 code unchanged.

The lesson is not that the seat erred. **The mitigation was never made structural.** A secret rebound by hand survives exactly until the next workflow deploy of that service, and the planner applied a pre-shift binding gate to its own smartsite-mcp deploy while never checking whether the sibling service had already been reverted. The gate has to live in the deploy workflow file, not in a runbook step and not in a planner's attention. Repo base rate: hook-shaped controls 1-for-1, protocol-step-shaped 0-for-3.

What that does NOT close is the incident itself: both services still run unpooled, which is safe at 23 of 901 connections and is not a resting state, and Neon still owes an explanation for why one pool on one database went read-only while another pool on the same compute and role did not. Proving the mitigation works is not the same as curing the cause, and the revert remains a traffic shift because the original secret was never modified.

# Open

Neon owes an explanation for why one pool on one database went read-only while another pool on the same compute and role did not. Until then this is mitigated, not cured. When the pooler is restored, revert by binding `DATABASE_URL` back to `DEPLOYMENT_DATABASE_URL` on both services and shifting; the original secret was deliberately never modified.

Not attempted, and why: restarting the compute might have cleared the pooler state and preserved pooling, but it drops every connection on the `cortex-prod` project including any other seat's running work, and it might not have worked. A scoped, reversible reroute of two services was the smaller action.
