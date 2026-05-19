---
id: 2026-05-19_calendar_tenant_id_silent_outage
title: "BeWith iCal 401 silent outage: dead env path + wrong-tenant routing (16-day silent partner-facing failure)"
date: 2026-05-19
status: active
applies_to: smartcity-os
related: [00_current_state, _sessions/2026-05-19_calendar_tenant_id_outage_claude_code, _decisions/2026-05-19_calendar_tenant_id_hardcode_path_b, 91_postmortems/2026-05-18_ical_dtstart_nan_silent_drop, _sessions/2026-05-18_bewith_ical_nan_outage_claude_code, 91_postmortems/2026-05-11_cutover_env_var_silent_drops]
last_updated: 2026-05-19
---

# Postmortem: BeWith iCal 401 silent outage (calendar tenant-ID hardcode)

## Summary

External partner BeWith.io received persistent HTTP 401 from `/api/calendar/events.ics` for 16 days following the 2026-05-03 Replit-to-Cloud-Run cutover. Two layered failures composed into one outage. The `?api_key=` env-bound auth path went dead at cutover when `CALENDAR_API_KEY` was unbound on Cloud Run. The per-tenant `?key=` path that should have replaced it was hardcoded to `BASTROP_TENANT_ID = 1` in `server/routes/calendar.ts:9`, where `tenants.id=1` is the "Your City" demo placeholder and Bastrop production is `tenants.id=2` per the codified rule at `AGENT_RULES.md:244-269` and `30_smartcity_os.md:50-52, 142-146`. Neither failure surfaced internally because there is no synthetic probe of the iCal feed; the partner emailed after the integration had been silently 401-ing for over two weeks.

The fix shipped end-to-end 2026-05-19. PR #20 (commit `62dbf28`) flipped the constant `1 → 2`. An in-transaction LKG migration moved the 25-event Municode meeting cache from `tenants[1]` to `tenants[2]`. A fresh `calendarFeedKey` was generated on `tenants[2]`. Canary-then-shift deploy landed at revision `smartcity-api-00104-taw`. A six-probe verification matrix on production confirmed the corrected tenant routing, the dead env path still appropriately 401-ing, and PR #18's iCal date-formatting fix preserved on top of the constant change. Key delivered to the partner via out-of-band partner-credentials channel; reply drafted for the email thread.

## Impact

Confirmed: BeWith.io received zero successful authenticated fetches from at least 2026-05-03 (Replit-to-Cloud-Run cutover; `CALENDAR_API_KEY` env unbound) through 2026-05-19 (PR #20 deploy and key reissue). Discovery 2026-05-19 7:20 AM via direct email from Bar Levy quoting the 401 response body verbatim.

Probable: any other external subscriber consuming `/api/calendar/events.ics` via the `?api_key=` query parameter form was identically affected since cutover, regardless of which key value they used. The published partner-integration guide (`BEWITH_CALENDAR_INTEGRATION_GUIDE.md` in the smartcity-os repo) documents the `?api_key=` form at every example, so any partner following that doc literally would have hit the same wall. Cataloged as follow-on #6.

Latent additional impact. The LKG hydration introduced in PR #17 (2026-05-15) had been writing the persistent calendar cache to `tenants[1].settings.calendarLKG` for four days, against the "Your City" demo placeholder rather than Bastrop. Five PermitFlow client components share the same hardcoded-`tenantId: 1` pattern in client-side writes (`PermitFlowGIS.tsx`, `PermitFlowFire.tsx`, `PermitFlowContractor.tsx`, `PermitFlowCodeEnforcement.tsx`, `PermitFlowAdmin.tsx`), and `replit.md:254` documents a `permitFlowTenant` middleware defaulting to `tenantId=1`. Whether those writes hit the wrong tenant in production depends on whether the server endpoint reads `body.tenantId` directly or overrides with `session.tenantId`; investigation gated under follow-on #1 in the catalog below.

## Timeline

- 2026-05-03. Replit-to-Cloud-Run cutover. `CALENDAR_API_KEY` env var enters the silent-drops bucket. The `?api_key=` auth path goes dead on production. The per-tenant `?key=` path remains the only working production auth, but it is hardcoded to `tenants.id=1` at `calendar.ts:9`.
- April 5-6 (date approximate from the broader cutover-recovery work). Tenant-ID enforcement sweep runs across the smartcity-os codebase, keyed on the canonical constant name `DEFAULT_TENANT_ID`. The sweep misses `BASTROP_TENANT_ID = 1` in `calendar.ts` because the audit pattern is name-tied. Other server files (`cache-refresh-cron.ts`, `compass-thread-monitor.ts`, `property-intelligence.ts`, `job-queue.ts`, `mygov.ts`) get the rename to `DEFAULT_TENANT_ID = 2`; `calendar.ts` does not.
- 2026-05-15. PR #17 deploys to revision `smartcity-api-00099-vip`. Persistent LKG hydration introduced. The LKG payload begins writing to `tenants[1].settings.calendarLKG` for the next four days because of the hardcoded constant.
- 2026-05-18. PR #18 deploys to revision `smartcity-api-00101-nir`. Fixes the iCal DTSTART/DTEND NaN silent-drop. Side-finding from that session: `CALENDAR_API_KEY` env unbound on the current revision; per-tenant `?key=` confirmed as the working production auth path. The wrong-tenant routing layer was latent there; a more thorough auth-side review would have surfaced it. See `91_postmortems/2026-05-18_ical_dtstart_nan_silent_drop.md`.
- 2026-05-19 7:20 AM. Bar Levy emails Nick, Jaime, and Shayna reporting persistent 401 with the verbatim error body.
- 2026-05-19 mid-day. Investigation surfaces the two-layer failure. Path B (code fix + LKG migration + key regen + deploy) selected over Path A (hand the demo-tenant key) and Path C (mirror data without code fix).
- 2026-05-19 afternoon. Smartcity-os PR #20 (`fix/calendar-tenant-id`, commit `62dbf28`) squash-merged to main with admin override on two known-stale CI checks (Gitleaks workflow permission, Semgrep mygov.ts FP). Both pre-existing on the cross-cutting watch list, verified out of scope for the PR diff.
- 2026-05-19 evening. Canary-then-shift deploy to revision `smartcity-api-00104-taw`. Six-probe verification matrix on production passes. Fresh feed key delivered to Nick for out-of-band partner-credentials channel.

## Root cause

Two distinct failures composed into one outage.

Layer 1: dead env path. The `?api_key=` query parameter auth shape uses `CALENDAR_API_KEY` from process env. The variable has been unbound on Cloud Run since the 2026-05-03 cutover. Three independent startup-log emissions on every cold boot of every recent revision confirm the dead state: `[calendar] CALENDAR_API_KEY not set — calendar endpoints accept tenant feed key only`. The original error body Bar quoted (`Valid API key required. Provide via ?api_key= or ?key= query parameter, or Authorization: Bearer header.`) is emitted from this dead branch at `calendar.ts:38`. The error string advertises the dead path as if it were working, which made the failure mode hard to diagnose from the response alone. The historic env value is also leaked in public git history at commits `08fd932` and `d4b5655` per `.replit:80-82`, though the value is functionally useless given the unbound env. Cataloged as follow-on #7 for the BFG-vs-accept decision.

Layer 2: wrong-tenant routing. The per-tenant `?key=` auth shape resolves the expected key from `tenants.settings.calendarFeedKey` for a single hardcoded tenant ID at `server/routes/calendar.ts:9`. The constant was named `BASTROP_TENANT_ID` and set to `1` (the dev value) since at least the cutover. In production, `tenants.id=1` is the "Your City" demo placeholder, never written to externally; Bastrop is `tenants.id=2` per the codified rule at `AGENT_RULES.md:244-269` and `30_smartcity_os.md:50-52, 142-146`. The auth check at `calendar.ts:41` compared the partner's submitted key against `tenants[1].settings.calendarFeedKey` (the lazily-generated `pinMco...` demo placeholder), not against any value `tenants[2]` held. `tenants[2].settings.calendarFeedKey` was empty entirely; no production value existed to match.

The two layers compose. Any partner using the documented `?api_key=` form hits the dead env path (Layer 1, 401). Any partner who switched to `?key=` would hit the wrong-tenant comparison (Layer 2, 403 "Invalid API key"), unless they had somehow acquired the `pinMco...` value from the demo placeholder.

The April 5-6 enforcement sweep missed `calendar.ts` because the audit pattern was tied to the canonical constant name `DEFAULT_TENANT_ID`. `calendar.ts` used the aliased name `BASTROP_TENANT_ID`. Same value-side bug, different identifier-side name. A value-pattern grep (`tenant_id\s*=\s*1\b` or `tenantId\s*[:=]\s*1\b`) would have caught it.

## Resolution

Path B selected over Paths A and C after structural review. Path A (hand BeWith the `tenants[1]` demo key, no rotation, no deploy) would have left a real partner authed against a row labeled "Your City" in the audit log, with rotation forced on the next code fix anyway. Path C (mirror `tenants[1]` state into `tenants[2]` without changing the code) would have entrenched the mislabel and burdened every future tenant-ID change with the same migration tax.

PR #20 ships as a one-line constant change at `server/routes/calendar.ts:9` (`BASTROP_TENANT_ID = 1 → 2`). All eight internal references in the file pick up the new value automatically. The aliased name was preserved in this PR to minimize blast radius; rename to `DEFAULT_TENANT_ID` is queued as follow-on #2, bundled with the broader server-side hardcoded-tenant-ID sweep.

LKG data migration: the 25-event Municode meeting cache (`freshAt = 1779200145915 = 2026-05-19T14:15:45.915Z UTC`) was transactionally moved from `tenants[1].settings.calendarLKG` to `tenants[2].settings.calendarLKG` via in-transaction verify-then-commit. Migration mishap noted: the same UPDATE was accidentally re-run after canary boot, which replaced `tenants[2].settings.calendarLKG` with literal JSON null because `jsonb_build_object('calendarLKG', NULL)` does not strip nulls (unlike `jsonb_strip_nulls`). Recovered cleanly via `settings - 'calendarLKG'` in the same UPDATE that wrote the new feed key. Gotcha worth surfacing for future jsonb migrations.

Fresh `calendarFeedKey` generation: pgcrypto's `gen_random_bytes` is not available on Neon (and not enablable from the standard role), so the regen used the OpenSSL workaround in Cloud Shell: `openssl rand -base64 24 | tr -d '=' | tr '+/' '-_'`. The output is a 32-character base64url string identical in shape to the JS code's `crypto.randomBytes(24).toString("base64url")` at `server/routes/calendar.ts:629`. A future route-driven regeneration produces an indistinguishable value.

Canary-then-shift deploy via the canonical runbook at `90_runbooks/cloud_run_canary_deploy.md`. Cloud Build to image; deploy with `--no-traffic --tag=bastrop-tenant-fix`; anonymous smoke on `/api/calendar/status`; differential probe with the new key on the canary URL (200 expected) and on the main URL (401 expected, validating the traffic split AND the code change in one shot); then `update-traffic --to-latest`. New production revision: `smartcity-api-00104-taw`. Prior production revision `smartcity-api-00101-nir` drops to 0% traffic, available for one-command rollback.

Six-probe verification matrix passed on production:

- (a) new key on `?key=` returned HTTP 200 with valid VCALENDAR.
- (b) old leaked value on `?key=` returned 403 `{"error":"Invalid API key."}`.
- (c) old leaked value on `?api_key=` returned 401 with Bar's exact original error body. Env path still appropriately dead by design.
- (d) startup logs on the new revision showed `id=2` tenant lookups only, no `id=1`.
- (e) zero ERROR-severity log entries in the post-deploy window.
- (f) DTSTART/DTEND values are real `YYYYMMDDTHHMM00` strings with no NaN. PR #18's iCal date-formatting fix preserved on top of PR #20.

Smoking-gun startup log line confirming the new code reads from `id=2`: `[calendar] Boot hydration from DB LKG — 25 events, freshAt 2026-05-19T14:15:45.915Z`. The freshAt timestamp matches the LKG payload's freshAt before migration. The boot hydration would have read empty from `id=2` if the migration had failed or the constant change had not deployed.

Decision record: `_decisions/2026-05-19_calendar_tenant_id_hardcode_path_b.md`.

## Why it took 16 days to surface

Silent failure at the partner edge. BeWith's integration polls `/api/calendar/events.ics` every 6 hours via Microsoft Exchange / Office 365 Internet Calendar Subscription. The 401 response shape is a single-field JSON body; Exchange does not surface that as a user-visible alert; it surfaces as empty events in Outlook. The partner side reads "no new events this week" rather than "the feed is broken," and the gap between that read and "the feed is actually broken" depends on whether the partner expected new events in the polling window. Bar emailed because the gap finally exceeded her tolerance, not because any internal SmartCity signal told her something was wrong.

Aliased-constant misses defeat name-keyed sweeps. The April 5-6 enforcement sweep was the right idea (tenant-ID rule codified at `AGENT_RULES.md:244-269`; sweep across the codebase to enforce). The miss came from keying the audit on the constant name `DEFAULT_TENANT_ID`, which would not match the aliased `BASTROP_TENANT_ID` in `calendar.ts`. A value-pattern grep would have caught it. AGENT_RULES.md update queued as follow-on #10.

Verification gap on the 2026-05-18 iCal NaN session. That session correctly diagnosed and shipped the date-formatting fix (PR #18) and noted as side-finding that `CALENDAR_API_KEY` was env-unbound. It did not investigate whether the per-tenant `?key=` auth path was correctly wired up against the right tenant; the investigation stopped at "env path dead, per-tenant path is the working production auth." The wrong-tenant routing was latent there; a more thorough auth-side review would have surfaced it. Folds into the action items of `91_postmortems/2026-05-18_ical_dtstart_nan_silent_drop.md` as a scope-under-extension note in the cross-postmortem reconciliation.

No synthetic monitor. The single most consequential gap. A scheduled probe hitting `/api/calendar/events.ics?key=<value-from-Secret-Manager>` every N hours, asserting HTTP 200 plus non-empty VEVENT count plus no NaN plus recent freshAt, would have surfaced this outage within hours of the cutover, not 16 days later. The same failure class threatens every integration in `30_smartcity_os.md:148-160` (MyGov, Samsara, Spireon, Verkada, GoTo Connect, FirstDue/VFD, plus PBI, Resend, Pipedrive). Cataloged at P0 as follow-on #9.

## Action items / Follow-on catalog

Twelve findings surfaced during the investigation. Priority hint, filing destination, implementation plan, dependencies, and complexity for each. Items recommended to bundle into a single PR or dispatch are noted in the bundling summary at the end.

### P0

**#9. Synthetic monitor for the iCal feed (and meta-question on systemic monitoring scope).**

Destination: new dispatch at `_dispatches/2026-05-19_cc-agent_ical_synthetic_monitor.md`; ships as a smartcity-os PR plus Cloud Scheduler job plus Secret Manager binding.

Plan: Cloud Scheduler job hitting `/api/calendar/events.ics?key=<from-Secret-Manager>` every 6 hours (matches BeWith's poll cadence so any failure surfaces at the same rate the partner would see it). Probe asserts HTTP 200, content-type `text/calendar`, VEVENT count > 0, no NaN in DTSTART/DTEND, and freshAt within 24h. Alerting via Cloud Monitoring to the current alert spine. Use the existing scheduler pattern at `server/services/cache-refresh-cron.ts` as the closest analog. Key delivery to the scheduler via a new Secret Manager binding `smartcity-CALENDAR_MONITOR_KEY` provisioned from the post-fix value on `tenants[2]`.

One-line callout in the dispatch: the systemic question of whether every integration at `30_smartcity_os.md:148-160` deserves the same probe treatment is its own session conversation. This dispatch ships the iCal probe only; the broader scope is flagged for a follow-on session.

Deps: standalone for iCal. The broader-sweep systemic probe is a separate session decision.

Complexity: S for the iCal probe; M to L for the systemic sweep (deferred).

### P1

**#1. Systemic dev/prod tenant-ID broader sweep.**

Destination: new dispatch at `_dispatches/2026-05-19_cc-agent_tenant_id_audit.md` (smartcity-os repo).

Plan, three phases:

- Phase A (server-side, S, ship next session): grep `(tenant_id|tenantId)\s*[:=]\s*1\b` in `server/` excluding test files. Inspect each hit. Land fixes in one PR with regression tests. Includes the rename of `BASTROP_TENANT_ID` to `DEFAULT_TENANT_ID` in `calendar.ts` (folds in #2).
- Phase B (client-side investigation, S, gates Phase C): for each of the 5 PermitFlow files (`PermitFlowGIS.tsx`, `PermitFlowFire.tsx`, `PermitFlowContractor.tsx`, `PermitFlowCodeEnforcement.tsx`, `PermitFlowAdmin.tsx`) and the `permitFlowTenant` middleware default at `replit.md:254`, read the corresponding API endpoint handler. Confirm whether each endpoint reads `body.tenantId` (broken in prod for any non-session caller) or overrides with `session.tenantId` (safe; client values are cosmetic). Document findings in a `_research/` artifact.
- Phase C (client-side fix, S to M, gated on Phase B): if any endpoint trusts the body's `tenantId`, fix the 5 PermitFlow components plus the middleware default. If all endpoints override, the client-side `tenantId: 1` literals are unused noise and can be removed for hygiene at lower priority. `client/src/portal/pages/Onboarding.tsx:52-67` carries 16 hardcoded entries but is mock/seed data; treat as lowest priority within this phase.

Deps: bundle with #2 (rename) and #10 (AGENT_RULES.md addendum) in Phase A. Phase B gates Phase C.

Complexity: M overall (S server-side fix, S client-side investigation, S to M client-side fix conditional on Phase B).

**#2. Rename `BASTROP_TENANT_ID` to `DEFAULT_TENANT_ID` in calendar.ts.**

Destination: bundle into #1 Phase A PR.

Plan: one-line constant rename. All 8 internal references in `calendar.ts` update via codemod or manual edit. No behavior change. AGENT_RULES.md naming consistency restored.

Deps: #1 Phase A.

Complexity: XS.

**#3. Stranded Cloud Run revision `smartcity-api-00103-tur` (PR #19 PBI DAX fix, never traffic-shifted).**

Destination: standalone investigation; needs PR #19 author or runbook history to clarify intent before action.

Plan:

- Step 1: read PR #19 / commit `d42edcb` description and any session summary for runbook context. Determine whether the traffic shift was forgotten, blocked, or deliberately deferred.
- Step 2a (forgotten): traffic-shift to `00103-tur`, OR roll PR #19's content into a fresh revision built on top of `00104-taw`. The latter is cleaner if PR #20 and PR #19 share files; the former is one command if they do not.
- Step 2b (deliberately deferred): document the deferral rationale; delete the stranded revision via `gcloud run services update-traffic --remove-tags=pbi-dax-workspace-fix-20260518`.
- Step 3: update `00_current_state.md` Stranded revisions list accordingly.

Verification claim: PR #19's PowerBI DAX cross-workspace fix is reported as NOT live in production despite being merged. This claim should be verified before plan execution by reading PR #19's full diff and the current Power BI behavior in production. If the fix is actually live via a different mechanism (e.g., merged-then-cherry-picked into a later revision), the dispatch is no-op for the prod state and only the revision-list cleanup remains.

Deps: standalone. PR #19 author or runbook lookup is the gating step.

Complexity: S (single shift command plus verification, or single removal plus doc bump, contingent on Step 1).

**#5. CI infrastructure failures (Gitleaks permission + Semgrep mygov.ts FP).**

Destination: smartcity-os PR; no doc_repo change beyond removing the watch-list entry once shipped.

Plan: one PR with two changes.

- `.github/workflows/gitleaks.yml`: add `permissions: { pull-requests: read }` at job or workflow level. The 403 response header from the failing run named the permission verbatim (`x-accepted-github-permissions: pull_requests=read`).
- `server/routes/mygov.ts:268`: prepend a `// nosemgrep: typescript.react.security.react-insecure-request -- GCE metadata server documented unauthenticated link-local endpoint, HTTP-only by design, Node.js server code (not React)` comment.

Verify by checking that the PR's own CI runs go green.

Deps: standalone. Two months overdue on the watch list; should land in the next smartcity-os dispatch.

Complexity: XS.

**#6. `BEWITH_CALENDAR_INTEGRATION_GUIDE.md` out of date.**

Destination: smartcity-os PR.

Plan: rewrite every `?api_key=` example to `?key=` at lines 25-27, 71, 129, 143, 153, 167-173, 194-200, 207. Bump the "Last Updated: March 2026" stamp. Verify by re-reading top-to-bottom for any other `api_key` references. Coordinate with BeWith before merging to confirm no in-flight integration relies on the old form (the new key plus new URL form has already been delivered to them out-of-band as part of today's resolution).

Deps: confirm partner migration complete before merging (low coordination cost; one email).

Complexity: XS.

**#10. AGENT_RULES.md "How this bug was discovered" addendum.**

Destination: smartcity-os repo, `AGENT_RULES.md:271-283`.

Plan: update the existing "How this bug was discovered" subsection with the 2026-05-19 second-discovery date (BeWith outage) and the BASTROP_TENANT_ID aliased-constant root cause. Add a new rule: "Tenant-ID enforcement sweep must grep for `tenant_id\s*=\s*1\b|tenantId\s*[:=]\s*1\b` patterns, not just named constants like `DEFAULT_TENANT_ID`. Aliased constants caused a 16-day silent partner-facing outage on 2026-05-19, six weeks after the April 5-6 sweep keyed on `DEFAULT_TENANT_ID` alone missed the same value-side bug under a different identifier."

Deps: bundle with #1 Phase A. The sweep PR adopts the new pattern; the rules doc requires it.

Complexity: XS.

**#11. Duplicated 401 emission in calendar auth middleware.**

Destination: bundle with #2 and #6 in the calendar.ts hygiene PR.

Plan: differentiate the two emission sites in `calendar.ts`.

- `:38` is the no-key-provided case. Rewrite the body to: `Calendar feed key required. Provide via ?key= query parameter or Authorization: Bearer header.` Drop the `?api_key=` reference; that path is dead.
- `:41` is the key-provided-but-invalid case. Rewrite the body to: `Invalid calendar feed key. Confirm the value matches the tenant's configured feed key.`

Update `BEWITH_CALENDAR_INTEGRATION_GUIDE.md` correspondingly; overlap with #6. The error-body differentiation is diagnostic-aiding for the next incident. Today's investigation lost time disambiguating "wrong key value" from "wrong URL form" because the response body did not distinguish them.

Deps: bundle with #2 and #6.

Complexity: XS.

### P2

**#4. `tenants.updated_at` does not auto-update on `db.update()`.**

Destination: fold into the Neon migration window per `12_migration_sprint.md` Sub-phase 2B. The migration is the natural time to add cross-table triggers.

Plan:

- Step 1: audit all tables with `updated_at` columns in `shared/schema.ts`. Identify any query logic that reads `updated_at` (grep for `updatedAt` and `updated_at` in `server/`). Verify whether any logic depends on `updated_at` meaning "data-change time" specifically. A BEFORE UPDATE trigger flips semantics to "row-touch time"; any row-touch from a no-op UPDATE will also flip the timestamp.
- Step 2a: if no logic depends on the field, add a single Drizzle migration that creates BEFORE UPDATE triggers across all affected tables. SQL pattern: `CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql; CREATE TRIGGER tg_updated_at BEFORE UPDATE ON <table> FOR EACH ROW EXECUTE FUNCTION set_updated_at();`.
- Step 2b: if logic depends on the field, decide per-table whether trigger semantics are compatible OR add explicit `set({ updatedAt: new Date() })` to every write site in code.

Empirical evidence: today's regen UPDATE on `tenants[2]` returned `updated_at: 2026-03-20 18:01:31.440197` (row creation time, not today). Confirms the field is not auto-updating on writes.

Deps: gates on Step 1 audit findings. Bundle into Neon migration window per `12_migration_sprint.md` Sub-phase 2B.

Complexity: M (audit S, fix S, but multi-table coordination drags it).

**#7. Leaked `CALENDAR_API_KEY` value in public git history.**

Destination: new decision record at `_decisions/2026-05-19_calendar_api_key_leaked_history_acceptance.md` per the `decision-log` skill format.

Plan: file the decision record documenting the three options considered.

- (a) BFG repo-clean. High effort; rewrites history; affects all forks and checkouts.
- (b) Accept the leak and document the rationale.
- (c) Revoke as part of a broader secret-rotation sweep.

Recommended choice (b): the value is functionally useless. The env var is unbound on Cloud Run. The per-tenant auth path does not accept it. The value would not authenticate even with a hypothetical re-binding because PR #20 changes the comparison target. Body documents the commits (`08fd932`, `d4b5655`) and the `.replit:80-82` trail.

Reversal criteria: revisit (c) batch BFG cleanup if any other leaked secret in the same history is discovered to be load-bearing.

Deps: standalone.

Complexity: XS (decision record only; no code change).

**#8. `tenants[1]` "Your City" placeholder retains live state (orphan `calendarFeedKey`).**

Destination: smartcity-os PR or one-off cleanup script.

Plan: clear orphan fields from `tenants[1].settings`. `AGENT_RULES.md:246` says "tenant_id 1 = Your City, demo, never write here"; enforce by clearing stale lazy-creates. Single statement: `UPDATE tenants SET settings = settings - 'calendarFeedKey' WHERE id = 1`. Audit `tenants[1].settings` for any other live fields that should not be there; clear individually.

Deps: bundle with #1 Phase A or #5 (lightweight cleanup that can ride along with any other tenants-table touch).

Complexity: XS.

**#12. Single-tenant assumption in calendar route `validateFeedKeyMiddleware`.**

Destination: 30a WS-4 multi-tenancy backlog; ADR-005 follow-on.

Plan: when (if) a second iCal-consuming tenant onboards, the middleware needs a tenant-resolution pattern. Options: URL path prefix (`/api/calendar/<tenant-slug>/events.ics`), key prefix lookup (parse the key, identify the owning tenant), or session-resolved tenant for authenticated callers. Until then, document the single-tenant assumption in a header comment in `calendar.ts` and add a callout in the ADR-005 multitenancy spec that this route is one of the explicit single-tenant exceptions to the tenant-scoped-everything rule.

Deps: triggered by second iCal tenant onboarding (no commitment today). Folds into ADR-005 work when it lands.

Complexity: M when the time comes; XS until then for just the doc note.

## Bundling summary

- **Bundle 1 (calendar.ts hygiene + AGENT_RULES enforcement):** #1 Phase A + #2 + #10 + #11. One smartcity-os PR for the server-side sweep, the rename, the middleware error-body differentiation, plus AGENT_RULES.md update.
- **Bundle 2 (CI unblock):** #5 alone. One small smartcity-os PR. Two-month-overdue work that unblocks every future PR.
- **Bundle 3 (partner doc):** #6, optionally fold #11's error-body changes. Coordinate with partner migration; merge after Bundle 1.
- **Bundle 4 (synthetic monitor):** #9 alone. New dispatch plus smartcity-os PR plus Cloud Scheduler plus Secret Manager.
- **Bundle 5 (decision record):** #7 alone. doc_repo file only.
- **Bundle 6 (orphan cleanup):** #8 alone, or bundle with #1 Phase A. XS.
- **Bundle 7 (stranded revision):** #3 alone. Single Cloud Run action contingent on intent lookup.
- **Bundle 8 (Neon migration):** #4 plus any other multi-tenancy schema work. Folded into `12_migration_sprint.md` Sub-phase 2B.
- **Bundle 9 (multitenancy ADR):** #12. Deferred to ADR-005 work.

Suggested execution order: Bundle 4 (#9) first because of the P0 monitoring gap; Bundle 2 (#5) in parallel because it is XS and unblocks every future PR; Bundle 1 next because it closes out the tenant-ID class and Bundle 3 (partner doc) depends on it; Bundle 5 (#7) and Bundle 6 (#8) at convenience; Bundle 7 (#3) when Nick has time to look at PR #19; Bundles 8 and 9 stay backlog for the relevant cutover and ADR-005 windows.

## References

- Smartcity-os PR #20, commit `62dbf28` (`fix/calendar-tenant-id`).
- Smartcity-os PR #19, commit `d42edcb` (PBI DAX cross-workspace fix; stranded at revision `smartcity-api-00103-tur`).
- Smartcity-os PR #18, commit `7a6e9ce` (prior iCal NaN fix; preserved on top of PR #20).
- Smartcity-os PR #17, commit `7db0e5a` (prior persistent-LKG fix; introduced the wrong-tenant LKG writes).
- `_decisions/2026-05-19_calendar_tenant_id_hardcode_path_b.md`.
- `_sessions/2026-05-19_calendar_tenant_id_outage_claude_code.md`.
- `91_postmortems/2026-05-18_ical_dtstart_nan_silent_drop.md` (prior layer of the same partner-facing issue).
- `_sessions/2026-05-18_bewith_ical_nan_outage_claude_code.md`.
- `91_postmortems/2026-05-11_cutover_env_var_silent_drops.md` (prior Fire 2 audit; missed `CALENDAR_API_KEY`).
- `30_smartcity_os.md:50-52, 142-146` (codified tenant-ID rule).
- `12_migration_sprint.md` Sub-phase 2B (tenant integrity verification; natural home for the broader audit).
- AGENT_RULES.md:244-294 (Tenant Identity section in the smartcity-os repo).
- `90_runbooks/cloud_run_canary_deploy.md`.
- `90_runbooks/cutover_env_var_bind_procedure.md`.
