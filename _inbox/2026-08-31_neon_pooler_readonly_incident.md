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

**STRUCTURAL FIX MERGED 2026-08-31, LDT #564, merge `df6ae2b77353cf3ebdccfe298823f97573948520`.** THREE sites were pointing at the pooler, not one, and only the first had been found by the outage:

    cloud-run-deploy.yml           cortex-api --set-secrets       (caused the outage)
    cloud-run-deploy-smartsite-mcp.yml  --set-secrets             (ARMED; the next MCP workflow deploy would have repeated it)
    cloud-run-deploy.yml           migrate: gcloud secrets access (migrations are WRITES and would have failed read-only)

All three now bind `DEPLOYMENT_DATABASE_URL_DIRECT`. Verified on merged main by reading the files back from the GitHub API: zero remaining pooler references across both workflows.

A comment block at each site records why the binding is `_DIRECT`, that this very workflow reverted a hand-applied fix because `--set-secrets` is authoritative-replace, and the revert condition. The revert condition is **Neon explaining the injection and restoring the pooler**, not the passage of time. That comment is the half that makes this structural: a correct binding whose reason is invisible is how a control gets "fixed" back to the broken value, and how a temporary mitigation quietly becomes permanent because nobody knows what would end it.

**What the merge does NOT prove.** The binding is now correct in the FILE. It is not yet proven correct in PRODUCTION: both services carry the right binding today only because the planner applied it by hand with `gcloud`. The proof is the next real workflow deploy of either service, which is when `--set-secrets` actually runs. Until then this is a fix that has passed review and has not been observed working, which this repo already knows is a different state. Check on the next deploy by reading the new revision's `DATABASE_URL` secretKeyRef by field name and confirming it names `DEPLOYMENT_DATABASE_URL_DIRECT`.

One planner error worth keeping, because it is the documented class. The planner's own `sed` for the third site used `--secret=DEPLOYMENT_DATABASE_URL$`, and the line ends in a backslash continuation, so the anchor could never match. The fail-closed count returned 0 and the executing seat diagnosed the pattern rather than assuming the file had moved. A shell one-liner whose anchor quietly means something other than intended is exactly the instrument failure this doctrine already records; the check caught it because it was written to fail loudly.

# Diagnostic 2026-08-31T16:39Z. NOT CURRENTLY OCCURRING, and still UNDETERMINED whether the pooler is safe to return to

Run because the operator reported seeing no errors and no messages on the Neon console. That observation turns out to carry no information, and establishing why is the most useful thing this diagnostic produced.

**The injection is not happening right now.** A 2x2 of `SHOW default_transaction_read_only` across `neondb` and `hauska_mcp`, each through the pooled and the direct hostname, returned `off` in all four cells. The discriminator that defined the incident, `hauska_mcp` writable through the pooler while `neondb` was not, is GONE rather than inverted; the two are now symmetric.

The sharper half of that measurement is the `source` column, not the value. Every cell reads `pg_settings.source = default`, which is the healthy signature. The incident's signature was `source = session`, meaning something injected it per-connection. Reading the value alone would not have distinguished a healthy default from a session-level `off`; reading where the value came from does. Repeated five times on the historically affected cell across fresh connections, `off` every time, so no intermittency at this instant.

Everything ruled out at incident time is still ruled out: `pg_is_in_recovery()` false, `pg_db_role_setting` zero rows, `pg_event_trigger` zero rows, and the `neondb_owner` role last modified 2026-05-20, months before any of this.

**Why the console shows nothing, and why that is not reassurance.** The Neon operations log contains ZERO entries touching the production endpoint `ep-lucky-truth-apodo8hr` across a window spanning 2026-08-28 to now. Verified independently by the planner rather than accepted from the lane: 100 operations returned, every one against `ep-wispy-fire-apd2q819` or `ep-blue-unit-apy6w1vh`, which are staging. That window CONTAINS the live incident and the eleven-hour regression.

So the operations log was silent for production while writes were actively broken, and it is silent now. The two states are indistinguishable through that instrument. The operations API tracks compute lifecycle, start, suspend and branch, not proxy-level session injection, so it was never going to see this. **An absent alert here is not evidence the condition cleared; it is evidence that nothing reports the condition.** That is the whole reason the incident ran undetected in the first place, twice.

Endpoint settings were also read live: the `pg_settings` override is empty, the endpoint is not disabled, its type is `read_write`, no maintenance window is active, and no HIPAA or block flags are set. The consumption and quota endpoint refused the available key because it is org-scoped, so quota is UNMEASURED rather than clear.

**Connection headroom, live:** `max_connections` 901 with 19 in use, 2.1 percent, against 23 at incident time. Unpooled remains comfortably safe at this load.

# The posture, ruled

**Stay on `DEPLOYMENT_DATABASE_URL_DIRECT`. Do not revert to the pooler.**

Not because the pooler is proven bad today, but because nothing can currently detect it going bad. The fault's defining property is that it produces no signal anywhere visible until an application write fails downstream, and that property has now been demonstrated three times: the original outage, the cortex-api regression, and the smartsite-mcp regression that ran two and a half hours before a pre-shift gate caught it.

Reverting would trade a measured cost, running unpooled at 2 percent of connection capacity, for an unmeasured risk with no detector. That is the wrong trade while the detector does not exist.

**The instrument that would settle it, and it does not exist yet:** a scheduled canary reading `SHOW default_transaction_read_only` against the POOLED endpoint every few minutes for 24 to 48 hours, with alerting, spanning the two recurrence times seen today around 02:11Z and 02:52Z. Until that runs clean, "safe to revert" is undetermined and should be stated as undetermined rather than inferred from quiet.

Building that canary is the correct next control and is not yet scheduled. Note what it would be for: not detecting the pooler, but detecting SILENCE that means something. This operation's own doctrine already says a control that cannot fail is not a control, and the current situation is the inverse, a fault that cannot announce.

What that does NOT close is the incident itself: both services still run unpooled, which is safe at 23 of 901 connections and is not a resting state, and Neon still owes an explanation for why one pool on one database went read-only while another pool on the same compute and role did not. Proving the mitigation works is not the same as curing the cause, and the revert remains a traffic shift because the original secret was never modified.

# Open

Neon owes an explanation for why one pool on one database went read-only while another pool on the same compute and role did not. Until then this is mitigated, not cured. When the pooler is restored, revert by binding `DATABASE_URL` back to `DEPLOYMENT_DATABASE_URL` on both services and shifting; the original secret was deliberately never modified.

Not attempted, and why: restarting the compute might have cleared the pooler state and preserved pooling, but it drops every connection on the `cortex-prod` project including any other seat's running work, and it might not have worked. A scoped, reversible reroute of two services was the smaller action.
