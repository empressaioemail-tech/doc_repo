---
id: 2026-05-19_calendar_tenant_id_outage
title: "BeWith iCal 401 outage: dead env path + wrong-tenant routing; PR #20 shipped; 12-finding catalog filed"
date: 2026-05-19
agent: claude_code
repo: doc_repo
session_type: investigation
rolled_up: false
---

# 2026-05-19 BeWith iCal 401 outage diagnosis and Path B fix

## Inputs

Bar Levy email 2026-05-19 7:20 AM to Nick / Jaime / Shayna reporting persistent 401 on `/api/calendar/events.ics` after the prior PR #18 deploy. Verbatim error body: `{"error":"Valid API key required. Provide via ?api_key= or ?key= query parameter, or Authorization: Bearer header."}`.

Doc-set carry from the 2026-05-18 iCal NaN session: `CALENDAR_API_KEY` env path verified unbound on revision `smartcity-api-00101-nir`; per-tenant `?key=` path identified as the working production auth. The leaked env value at commit `08fd932` was noted as defense-in-depth follow-on under Fire 2 git-history scrub, not load-bearing for current production auth.

## Outputs

Smartcity-os PR #20 (`fix/calendar-tenant-id`, commit `62dbf28`, +1/-1 in `server/routes/calendar.ts`) squash-merged to main with admin override on two known-stale CI checks (Gitleaks workflow permission, Semgrep mygov.ts FP; both pre-existing on the watch list and verified out of scope for the PR's diff). Deployed via the canonical canary runbook to revision `smartcity-api-00104-taw`. Fresh `calendarFeedKey` generated on `tenants[2]`; key delivered to Nick for BeWith via the partner-credentials channel.

Investigation chain: drafted smartcity-os dispatch; cc-agent ran code-path inspection plus grep audit; operator ran Cloud Shell SQL (LKG state read, transactional migration, key regen) plus gcloud deploy commands plus the 6-probe verification matrix. Two layered bugs surfaced.

The historic `CALENDAR_API_KEY` env path is dead. Three independent startup-log emissions on every cold boot of every recent revision confirm the unbound state: `[calendar] CALENDAR_API_KEY not set — calendar endpoints accept tenant feed key only`. The 401 body Bar quoted is emitted from that dead branch at `calendar.ts:38`. BeWith was using the `?api_key=` URL form per `BEWITH_CALENDAR_INTEGRATION_GUIDE.md`, which documents the dead form at every example.

The per-tenant `?key=` path was wired to the wrong tenant. `server/routes/calendar.ts:9` declared `BASTROP_TENANT_ID = 1` since at least the cutover. In prod, `tenants.id=1` is the "Your City" demo placeholder; Bastrop is `tenants.id=2` per the codified rule at `AGENT_RULES.md:244-269` and `30_smartcity_os.md:50-52, 142-146`. The April 5-6 dev/prod tenant-ID enforcement sweep keyed on the canonical name `DEFAULT_TENANT_ID` and missed `BASTROP_TENANT_ID` because the audit pattern was tied to the identifier name, not the value pattern.

## Decisions and findings

Path B selected and executed: one-line code change `BASTROP_TENANT_ID = 1 → 2`; transactional LKG migration of the 25-event Municode meeting cache (`freshAt = 2026-05-19T14:15:45.915Z UTC`) from `tenants[1]` to `tenants[2]`; fresh `calendarFeedKey` generated on `tenants[2]`; canary-then-shift deploy. Decision record at `_decisions/2026-05-19_calendar_tenant_id_hardcode_path_b.md`. Paths A (hand BeWith the id=1 demo-tenant key, no rotation, no deploy) and C (mirror data without code fix) were rejected: A authenticates a real partner against a row labeled "Your City" with rotation forced on the next code fix; C entrenches the mislabel and burdens every future tenant-ID change with the same migration tax.

Migration mishap and recovery: the LKG migration was accidentally re-run after canary boot. The second run replaced `tenants[2].settings.calendarLKG` with literal JSON null because `jsonb_build_object('calendarLKG', NULL)` does not strip nulls. Recovered cleanly via `settings - 'calendarLKG'` in the same UPDATE that wrote the new feed key. Worth surfacing as a gotcha for future jsonb migrations: prefer `jsonb_strip_nulls` or explicit field deletion via `settings - 'key'` over `||` with NULL values.

Tooling gotcha: pgcrypto's `gen_random_bytes` is not available on Neon and not enablable from the standard role. Worked around with `openssl rand -base64 24 | tr -d '=' | tr '+/' '-_'` in Cloud Shell. Output is a 32-character base64url string identical in shape to the JS code's `crypto.randomBytes(24).toString("base64url")` at `server/routes/calendar.ts:629`. A future route-driven regeneration produces an indistinguishable value.

Six-probe verification matrix on the new production revision: (a) new key on `?key=` returned HTTP 200 with valid VCALENDAR; (b) old leaked value on `?key=` returned 403 `{"error":"Invalid API key."}`; (c) old leaked value on `?api_key=` returned 401 with Bar's exact original error body (env path appropriately still dead by design); (d) startup logs showed id=2 tenant lookups only, no id=1; (e) zero ERROR-severity log entries in the post-deploy window; (f) DTSTART/DTEND values are real `YYYYMMDDTHHMM00` strings with no NaN, confirming PR #18's iCal date-formatting fix preserved on top of PR #20. Smoking-gun startup log line: `[calendar] Boot hydration from DB LKG — 25 events, freshAt 2026-05-19T14:15:45.915Z`. The freshAt timestamp matches the LKG payload's pre-migration freshAt; the boot hydration would have read empty from id=2 if the migration had failed or the constant change had not deployed.

Twelve follow-on findings surfaced during the investigation. Cataloged in the postmortem's Action items section with priority, filing destination, implementation plan, dependencies, and complexity for each. Highlights: a P0 monitoring gap (16-day silent outage with no synthetic probe; same failure class threatens every integration in `30_smartcity_os.md:148-160`); a P1 systemic dev/prod tenant-ID broader sweep covering 5 PermitFlow client components, the `permitFlowTenant` middleware default, and the AGENT_RULES.md naming pattern; a stranded Cloud Run revision (`smartcity-api-00103-tur`, PR #19 PBI DAX fix, never traffic-shifted, deployed `--no-traffic` 2026-05-18 and never promoted); and overdue CI infrastructure fixes (Gitleaks workflow permission + Semgrep mygov.ts FP) that have been on the watch list since the May 11 cluster and were overridden again for PR #20.

## Lessons and patterns

Aliased-constant misses defeat name-keyed sweeps. The April 5-6 enforcement sweep keyed on `DEFAULT_TENANT_ID` missed `BASTROP_TENANT_ID = 1` in calendar.ts. Same value-side bug, different identifier-side name. Future tenant-ID enforcement must grep for the value pattern (`tenant_id\s*=\s*1\b`, `tenantId\s*[:=]\s*1\b`) across server-side code, not just named constants. AGENT_RULES.md `:271-283` addendum queued as catalog follow-on #10 alongside the broader sweep.

Silent partner-facing outages with no internal signal compound across integrations. The BeWith outage ran 16 days because no internal probe exercises the iCal feed periodically. Synthetic monitoring is the highest-leverage follow-on of the 12 cataloged. Addressing it for iCal is immediate; the systemic question of whether every integration deserves the same treatment is its own session conversation, flagged in the catalog dispatch for follow-on #9.

Migration verify-before-commit is non-negotiable. The accidental LKG re-run that null-bombed `tenants[2].settings.calendarLKG` was caught only because the same UPDATE that wrote the new feed key also stripped the null'd field. A different ordering (key first, then migration verify) would have shipped a broken hydration path to production. Pattern for future jsonb migrations: never use `||` with a value that can be NULL; prefer `jsonb_strip_nulls` or explicit field deletion.

The CI infrastructure failures overridden today were already on the cross-cutting watch list in `00_current_state.md` from the May 11 cluster. Two months is too long for known-XS unblock work. Cataloged at P1 in the postmortem; should land in the next smartcity-os dispatch alongside the broader tenant-ID sweep.

## Outstanding from this session

- Send the new feed key to Bar via partner-credentials channel (Nick action, value in Cloud Shell scrollback).
- Send the Path B reply on the Jaime / Shayna email thread, telling Bar the key is coming separately and giving the new URL form (Nick action; draft is in the dispatch flow).
- 12-finding catalog filed in the postmortem; dispatches and PRs spawn from there in priority order. Bundling summary at the end of the postmortem identifies which catalog items pair into single PRs.
- Canonical doc updates pending this session-close commit batch: `00_current_state.md` Fire 2 reframe and section updates (Cloud Run revision chain extended through `00104-taw`; stranded `00103-tur` and prior-prod `00101-nir` added to the Stranded revisions list; CI cross-cutting callout added); `12_migration_sprint.md` Sub-phase 2B adds application-code hardcoded-tenant-ID audit as a pre-cutover check; `30a_smartcity_stabilization_sprint.md` WS-2 follow-ons updated with PR #20 ship.

## References

- Smartcity-os PR #20 commit `62dbf28` (`fix/calendar-tenant-id`)
- Smartcity-os PR #19 commit `d42edcb` (PBI DAX cross-workspace fix; stranded at revision `smartcity-api-00103-tur`)
- Smartcity-os PR #18 commit `7a6e9ce` (prior iCal NaN fix; preserved on top of PR #20)
- Smartcity-os PR #17 commit `7db0e5a` (prior persistent-LKG fix; the four-day window of LKG writes to wrong tenant)
- `91_postmortems/2026-05-19_calendar_tenant_id_silent_outage.md`
- `_decisions/2026-05-19_calendar_tenant_id_hardcode_path_b.md`
- `91_postmortems/2026-05-18_ical_dtstart_nan_silent_drop.md`
- `_sessions/2026-05-18_bewith_ical_nan_outage_claude_code.md`
- `91_postmortems/2026-05-11_cutover_env_var_silent_drops.md` (prior Fire 2 audit; missed `CALENDAR_API_KEY`)
- `90_runbooks/cloud_run_canary_deploy.md`
- `90_runbooks/cutover_env_var_bind_procedure.md`
- `30_smartcity_os.md:50-52, 142-146` (codified tenant-ID rule)
- AGENT_RULES.md:244-294 in the smartcity-os repo (Tenant Identity section)
