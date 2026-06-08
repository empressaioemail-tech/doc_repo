---
id: 2026-06-08_cc-agent-M_ws4_tenant_scope_and_raw_retention
title: Dispatch — WS-4 tenant-scope the empty CANDIDATEs + MyGov raw retention (ADR-005 Layer B)
date: 2026-06-08
agent: cc-agent-M
repo: empressaio_tech_smartcity_os
kind: dispatch
status: ready
related: [00_current_state, 80_adrs/adr_005_multitenancy, 30a_smartcity_stabilization_sprint, 31a_bastrop_maintenance_sprint, 76e_platform_observability_sprint, _decisions/2026-06-08_mygov_raw_retention, _research/2026-06-08_smartcity_neon_no_tenant_id_and_raw_retention, 20_agent_operating_rules]
---

# WS-4 tenant-scope the empty CANDIDATEs + MyGov raw retention

> **Fire-ready, deploy-independent.** Storage-layer work on Empressa Neon; does not touch the build-out deploy, the gate, or the WS-1 migration data path (that cutover is complete). Implements ADR-005 Layer B (storage invariants) for the CANDIDATE tables and the operator-decided MyGov raw retention (`_decisions/2026-06-08_mygov_raw_retention.md`). One cc-agent-M clone per run; not concurrent with another cc-agent-M smartcity-os run.

You are **cc-agent-M**, single owner of `empressaio_tech_smartcity_os` for this run. Production is `smartcity-api-00106-riz` on Empressa Neon (tenant_id rule: default 1, Bastrop = 2). A 2026-06-08 live introspection (in the research doc) classified the no-tenant_id tables; this dispatch acts on the five CANDIDATEs.

## Model (HR-12)

Default: **Grok Build 0.1** (multi-file / agentic). Use **grok-code-fast-1** for narrow, speed-only tasks. Escalate to Claude only if Grok fails after retry; log the escalation.

Cursor: base URL `https://api.x.ai/v1`.

## Atoms to resolve

- `service:smartcity-api` — city platform health contract
- `service:smartcity-scraper` — MyGov scraper job-result contract (the raw-write path)
- `jurisdiction:bastrop` — tenant_id 2

## Read first (after atoms)

1. [`_decisions/2026-06-08_mygov_raw_retention.md`](../_decisions/2026-06-08_mygov_raw_retention.md) — the retention policy you implement (90d raw_records, 14d sync_pages, archive-then-drop, gated never autonomous)
2. [`80_adrs/adr_005_multitenancy.md`](../80_adrs/adr_005_multitenancy.md) — Layer B storage invariants + the verified table classification
3. [`_research/2026-06-08_smartcity_neon_no_tenant_id_and_raw_retention.md`](../_research/2026-06-08_smartcity_neon_no_tenant_id_and_raw_retention.md) — the live introspection (15 no-tenant_id tables; row counts)
4. [`76e_platform_observability_sprint.md`](../76e_platform_observability_sprint.md) — the MyGov growth alert (the retention trip) + the alert-then-suggest Tier-0 posture
5. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-8, HR-11

## Workspace ownership

- Clone: `P:\empressaio_tech_smartcity_os`
- Branch: `feat/ws4-tenant-scope-and-raw-retention`
- One agent per clone. Refuse alien HEAD or uncommitted state; report verbatim `git status` plus `git log -3`. Use Drizzle migrations (per 31a P3-3 direction) if adopted, else the repo's existing migration mechanism — match the codebase.

## Scope

**Part 1 - tenant-scope the three empty CANDIDATEs.**

`activity_logs` (3 rows), `chat_messages` (0), `live_chats` (0) are empty/trivial - the cheapest possible moment to scope them. For each: add `tenant_id` NOT NULL, a foreign key to the tenants table, and an index leading with `tenant_id` (ADR-005 Layer B invariant). Backfill the 3 `activity_logs` rows to their correct tenant (Bastrop = 2 if they are Bastrop-origin; confirm origin before assigning, do not blind-default). Update the app write paths so new rows in all three carry `tenant_id`.

**Part 2 - tenant-tag the MyGov raw tables.**

Add `tenant_id` to `mygov_raw_records` and `mygov_raw_sync_pages`. Populate at ingest: the scraper writes `tenant_id` at scrape time (the raw row knows which jurisdiction it was scraped for). Backfill existing rows to the owning tenant - prefer deriving tenant from the normalization linkage to `mygov_work_orders` where a raw row has been normalized; for un-normalized rows assign by scrape source. These are the tables that wedged the old Neon, so tenancy + retention are handled together.

**Part 3 - MyGov raw retention job (per the decision record).**

Build a retention job implementing `_decisions/2026-06-08_mygov_raw_retention.md`:
- `mygov_raw_records`: a row becomes eligible 90 days after it is confirmed normalized into `mygov_work_orders`. `mygov_raw_sync_pages`: eligible after 14 days (shorter window).
- On eligibility: archive to GCS as JSONL (a `smartcity-os-prod` bucket; lifecycle to nearline/coldline), then drop from Neon.
- **Gated, never autonomous.** Build it in detect-and-propose / manual-trigger mode (the 76e alert-then-suggest Tier-0 posture). It must NOT autonomously delete city operational data. The MyGov growth alert is the trip that surfaces when the job should run. A human authorizes the run.
- Idempotent and re-runnable; archive write must be confirmed before any Neon delete (archive-then-drop, never drop-then-archive).

**Part 4 - leakage smoke test (ADR-005 Layer B done-criterion 5).**

A two-tenant load smoke test demonstrating zero cross-tenant leakage on production-shape queries across the newly-scoped tables. Seed a second tenant's rows; assert no query returns another tenant's rows without explicit join logic.

**Out of scope:**

- The build-out deploy, the gate, or anything on the WS-1 cutover data path.
- The OK-global / OK-by-FK tables (users, sessions, tenants, products, platform_admins, admin_password_reset_tokens, page_views, visitor_sessions, work_order_managers, ticket_messages) - do not add tenant_id to these (verified non-isolation-critical in ADR-005).
- Any autonomous deletion of city operational data (hard rule).
- Layer A gate enforcement (that is the tenant-leg, separate and QUEUED).

## Acceptance criteria

- `activity_logs`, `chat_messages`, `live_chats` each carry `tenant_id NOT NULL` + FK + tenant-leading index; existing rows backfilled correctly (verbatim row-origin evidence for the 3 activity_logs rows); app write paths updated.
- `mygov_raw_records` and `mygov_raw_sync_pages` carry `tenant_id`; scraper writes it at ingest; existing rows backfilled (verbatim count of backfilled vs un-normalized).
- Retention job built per the decision (90d / 14d, archive-then-drop to GCS, gated/manual-trigger, idempotent, archive-confirmed-before-delete); a dry-run on current data shows zero rows eligible yet (window not elapsed) - paste the dry-run output.
- Two-tenant leakage smoke test green (verbatim).
- Migrations apply cleanly forward; tenant_id parity does not regress (the 91 with tenant_id grows by 5; the no-tenant_id set drops to 10).
- All outputs carry source, value, and timestamp (quality-gate rule). vitest + typecheck green.
- PR held for operator merge; branch + SHA reported.
- Verbatim verification artifacts (HR-8): the migration SQL, the leakage-test output, the retention dry-run, the backfill counts.

## Reporting

At break-point, write to `P:\doc_repo\_inbox\` as `2026-06-08_smartcity-os_cc-agent-M_ws4_tenant_scope_and_raw_retention.md`. Include atom refs touched, model used (if not default Grok), PR URL plus branch SHA, the migration SQL, the leakage-test + retention-dry-run output, backfill counts, and blockers verbatim.
