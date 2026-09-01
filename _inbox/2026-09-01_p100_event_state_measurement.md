---
id: 2026-09-01_p100_event_state_measurement
title: P-100 item 1 — the three-state event measurement
date: 2026-09-01
last_updated: 2026-09-01
status: measured
applies_to: legacy-design-tools (gtm_events, pe_activation_events, pe_share_grants), hauska-map (property-explorer emitters)
plan_row: P-100
card: _inbox/2026-08-31_p100_share_and_funnel_instrumentation_WDLL.md
owner: property seat (P-100 lane)
---

# P-100 item 1 — measure before building

Absent, zero, and unmeasured are three different findings. This artifact keeps them apart, and adds two states the card did not anticipate because the store and the source both turned out to hold things the three-state frame cannot express.

## Snapshot

Instrument: `scripts/gtm-event-state.mjs` in legacy-design-tools, on branch `feat/p100-share-funnel-instr` off `origin/main` `d332d799e1ddbd64e106685fe37828ce24862959`.

Source roots scanned: `artifacts/api-server/src` (legacy-design-tools) and `apps/property-explorer/src` plus `apps/property-explorer/api` from hauska-map `origin/main` `440109531f0a4ab60176cfa6c5f3e9deb05acf99`.

Store: Neon `neondb` via `DEPLOYMENT_DATABASE_URL_DIRECT` (project `legacy-design-tools-prod`), read only, at `2026-09-01T02:42:50.688Z`.

Exclusion set, which is part of the instrument's contract: `__tests__/`, `*.test.ts`, `*.test.tsx`, `node_modules/`, `dist/`. A type emitted from a repo not passed as a root reads as having no writer, and the output names its roots so that is visible rather than silent.

The instrument self-tests in both directions before it is trusted (`node scripts/gtm-event-state.mjs --self-test`), with five classifier fixtures and four not-vacuous cases. It has been observed failing on two deliberate violations; the verbatim failures are in the close artifact.

## The query

```sql
SELECT event_type, source_surface, count(*)::bigint AS rows,
       min(created_at) AS first_seen, max(created_at) AS last_seen,
       count(*) FILTER (WHERE consent_version IS NULL)::bigint AS consent_null
  FROM gtm_events GROUP BY 1,2 ORDER BY 1,2
```

## The five states, and why there are five and not three

The card named three. The measurement found two more, and merging either into the card's three would have been a false report.

`NO_WRITER` — a type the locked handoff names and no source site produces. ABSENT.

`WRITER_NEVER_WROTE` — an emit site or a closed-union membership exists and the store has never held a row of that type. UNMEASURED.

`WRITER_HAS_ROWS` — both. MEASURED.

`ROWS_NO_WRITER` — the store holds rows of a type no current source site produces. An orphan from a retired writer. Reporting these as MEASURED would credit code that no longer exists; reporting them as ABSENT would deny rows that are sitting in the table.

`MENTION_ONLY` — the string appears in an `eventType:` position but not inside a `recordGtmEvent` call and not in a closed union. Every one of these is a case where the type is produced conditionally by code the instrument cannot follow, and each needs a code read rather than a guess. This state exists because the first pass of the instrument scored `brokerageExtensionPublic.ts:103` as a writer of `brief_completed` when that file only counts those rows for a rate limit. A reader scored as a writer is the same defect class as a check that cannot fail.

## The table

38 event types. 21 `WRITER_HAS_ROWS`, 6 `WRITER_NEVER_WROTE`, 5 `MENTION_ONLY`, 4 `ROWS_NO_WRITER`, 2 `NO_WRITER`.

| event_type | state | rows all time | surfaces | writer site |
|---|---|---|---|---|
| share_created | WRITER_HAS_ROWS | 7 | api (7) | `brokerageWorkspace.ts:480` |
| share_viewed | WRITER_NEVER_WROTE | 0 | none | `brokerageWorkspace.ts:129` |
| pe_browse_started | WRITER_HAS_ROWS | 10286 | property-explorer | `gtmPropertyExplorerFunnel.ts:10`, `gtmClient.ts:17` |
| pe_cold_open_dismissed | WRITER_HAS_ROWS | 34 | property-explorer | `gtmPropertyExplorerFunnel.ts:11` |
| pe_signup_intent | WRITER_HAS_ROWS | 28 | property-explorer | `gtmPropertyExplorerFunnel.ts:12` |
| pe_save_property | WRITER_HAS_ROWS | 26 | property-explorer | `gtmPropertyExplorerFunnel.ts:13` |
| pe_research_clicked | WRITER_HAS_ROWS | 52 | property-explorer | `gtmPropertyExplorerFunnel.ts:14` |
| pe_paywall_hit | WRITER_HAS_ROWS | 20 | property-explorer | `gtmPropertyExplorerFunnel.ts:15` |
| pe_upgrade_started | WRITER_HAS_ROWS | 42 | property-explorer | `gtmPropertyExplorerFunnel.ts:16`, `propertyExplorerBilling.ts:55` |
| pe_parcel_inspected | NO_WRITER | 0 | none | none |
| pe_signup_completed | NO_WRITER | 0 | none | none |
| pe_property_unlock | MENTION_ONLY | 0 | none | `brokerageStripe.ts:431` (handler result) |
| pe_subscription_active | MENTION_ONLY | 0 | none | `brokerageStripe.ts:486` (handler result) |
| pe_churned | MENTION_ONLY | 0 | none | `brokerageStripe.ts:596` (handler result) |
| mcp_tool_call | WRITER_NEVER_WROTE | 0 | none | `gtmMcpEvents.ts:4` |
| mcp_connect | WRITER_NEVER_WROTE | 0 | none | `gtmMcpEvents.ts:5` |
| mcp_error | WRITER_NEVER_WROTE | 0 | none | `gtmMcpEvents.ts:6` |
| mcp_docs_clicked | WRITER_NEVER_WROTE | 0 | none | `gtmMcpEvents.ts:7` |
| triage_signal | WRITER_NEVER_WROTE | 0 | none | `brokerageGtm.ts:261` |
| brief_started | WRITER_HAS_ROWS | 365 | api (240), extension (125) | `brokerageBrief.ts:645` |
| brief_completed | WRITER_HAS_ROWS | 246 | api (159), extension (87) | `brokerageBrief.ts:991` |
| session_geo | WRITER_HAS_ROWS | 159 | api | `brokerageBrief.ts:979` |
| research_chat_turn | WRITER_HAS_ROWS | 49 | api | `brokerageBrief.ts:1487` |
| starter_prompt_selected | WRITER_HAS_ROWS | 48 | api (26), extension (22) | `brokerageBrief.ts:468` |
| upgrade_started | WRITER_HAS_ROWS | 72 | api (52), extension (20) | `brokerageBilling.ts:69` |
| subscription_active | WRITER_HAS_ROWS | 35 | api (5), extension (1), stripe_webhook (29) | `brokerageBilling.ts:156` |
| paywall_hit | WRITER_HAS_ROWS | 5 | api (4), extension (1) | `brokerageBrief.ts:566` |
| deal_kept | WRITER_HAS_ROWS | 11 | extension | `gtmInvestorFunnel.ts:11` |
| deal_passed | WRITER_HAS_ROWS | 2 | extension | `gtmInvestorFunnel.ts:12` |
| radar_autorun | WRITER_HAS_ROWS | 1 | extension | `gtmInvestorFunnel.ts:10` |
| session_return | WRITER_HAS_ROWS | 1 | extension | `gtmInvestorFunnel.ts:13` |
| churned | WRITER_HAS_ROWS | 1 | extension | `gtmInvestorFunnel.ts:17` |
| brief_failed | ROWS_NO_WRITER | 13 | extension | none |
| upgrade_completed | ROWS_NO_WRITER | 10 | extension | none |
| extension_install | ROWS_NO_WRITER | 3 | extension | none |
| workspace_shared | ROWS_NO_WRITER | 2 | extension | none |
| shown | MENTION_ONLY | 0 | not a gtm_events type | `NextActionCard.tsx:68` (writes `pe_activation_events`) |
| acted | MENTION_ONLY | 0 | not a gtm_events type | `NextActionCard.tsx:107` (writes `pe_activation_events`) |

## Which surface does share fire on

The card's open suspicion, settled: **the Smart Site share plane emits nothing.**

The only `share_created` writer is `brokerageWorkspace.ts:480`, the brokerage workspace surface. Its 7 rows all carry `source_surface = 'api'` and stopped on 2026-07-19. `brokerage_workspace_shares` holds exactly 7 rows, which is an independent derivation agreeing with the event count.

`share_viewed` has a writer at `brokerageWorkspace.ts:129` and **has never written a row**. Writer exists, zero rows, and that is a different fact from absent.

On the Smart Site plane, read against hauska-map `origin/main`:

- The sharer's action is `POST /api/pe-share`, which writes a `pe_share_grants` row and returns `/s/{grantId}`. It emits no GTM event.
- The recipient's load is `GET /s/{grantId}` (`api/pe-share-grant.ts`), which resolves the grant row and either serves the instrument or 302s a browser to `/share?g={grantId}`. It emits no GTM event.
- The SPA landing (`ShareFunnelApp.tsx:55`) emits `pe_browse_started` with `payload.shareLanding = true`. That is a browse event wearing a payload flag, not a share event, and it carries no grant id. 12 such rows exist against 10,286 `pe_browse_started` total.
- Neither `share_created` nor `share_viewed` is a member of `PeFunnelEventType` (client) or `PROPERTY_EXPLORER_FUNNEL_EVENT_TYPES` (server allowlist). If the client sent one today the server would refuse it with `invalid_event_type`.

`GTM_SOURCE_SURFACES` declares a `share_page` surface. Zero rows carry it. Declared and never used.

## Sharer attribution — a correction to the card's premise

The card states that sharer attribution does not exist, on the basis that `sharerUserId`, `referredBy`, `attributedTo` and `referrerUserId` return zero hits. Those greps are accurate and the conclusion drawn from them is half right.

What exists: **`pe_share_grants` is a durable grant registry with 12 live rows** (2026-08-27 to 2026-08-29, none revoked), carrying `id`, `grantor_user_id`, `grantor_tenant_id`, `parcel_node_id`, `created_at`, `expires_at`, `revoked_at`. It is written by `POST /api/pe-share` through the cortex service-key route `POST /property-explorer/v1/internal/share-grants` and read by `GET /s/{id}`. The grant row id the card asks attribution to be keyed on **already exists and is already server-owned**.

What is missing is only the second half: nothing joins a recipient's account creation back to a grant. There is no attribution table, no route, and no column on `users` (its eight columns are `id`, `display_name`, `email`, `avatar_url`, `created_at`, `updated_at`, `architect_pdf_header`, `disciplines`).

The recipient-side carrier also already exists: `share-landing.ts` stashes the grant id in `sessionStorage` under `pe_share_funnel_grant` and restores it on the `?signed_in=1` return leg, which is exactly the anonymous-to-account hop the card names as the recorded trap. The hop is instrumented for restore; it just does not write anything.

## Activation events

`pe_activation_events` exists (migration 0091), has a single writer (`recordActivationEvent`, reached only from `POST /property-explorer/v1/activation-events`), a client caller (`NextActionCard.tsx`), and **zero rows**. Writer exists, never wrote.

It is also a different subject from the card's item 4. Its grammar is `shown` / `acted` against a next-action ladder rung (`connect_claude`, `unlock_expiring`, `property_unlock`, `annual_upgrade`, `team_invite`). That is P-98's ladder telemetry. Nothing in it expresses "first parcel inspected", "first property saved" or "first report opened", and nothing in it is once-per-account. Item 4's subject has `NO_WRITER`.

## Consent

741 of 11,518 rows carry `consent_version IS NULL`. Every one of them was written by `recordGtmEvent`, whose line 27 is `consentVersion: input.consentVersion ?? null` and whose fourteen call sites pass no consent at all. The two consent-enforcing routes (`POST /gtm/events`, `POST /gtm/property-explorer/events`) refuse with 403 when no consent row exists and stamp the version from the store, so their rows are all non-null.

A pre-registered prediction, scored honestly: I expected most null-consent rows to belong to installs with no consent record. **Wrong.** 459 of the 741 (62%) belong to installs that DO have a `gtm_consent` row; only 282 (38%, 94 distinct installs) do not. The consent was recorded and the writer simply did not read it. That changes the fix from "these events are unrecoverable" to "the writer must resolve consent from the store, and refuse only the 38% case".

## Two numbers that should agree

`brokerage_workspace_shares` = 7 rows; `share_created` events = 7 rows. They agree, which is the only pair in this measurement that does.

`pe_share_grants` = 12 rows; Smart Site share events = 0. They cannot agree because one of them is not measured.

`pe_upgrade_started` = 42; PE subscription-created events = 0; `pe_property_unlocks` = 0; `pe_user_entitlements` = 14. The conversion end of the Smart Site funnel is unmeasured, and the reason is in `brokerageBilling.ts:191`: `if (result.installId)` gates the only recording of a webhook result, while every PE branch of `handleStripeWebhook` returns `peUserId` and frequently no `installId`. A Smart Site purchaser who never carried an extension install id produces no event.
