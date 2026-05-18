---
id: 2026-05-18_ical_dtstart_nan_silent_drop
title: "BeWith iCal silent-drop: DTSTART/DTEND NaN in eventsToICal"
date: 2026-05-18
status: active
applies_to: smartcity-os
related: [00_current_state, _sessions/2026-05-18_bewith_ical_nan_outage_claude_code, _sessions/2026-05-15_smartcity_lkg_deploy_claude_ai_planner]
last_updated: 2026-05-18
---

# Postmortem: BeWith iCal silent-drop (DTSTART/DTEND NaN)

## Summary

`/api/calendar/events.ics` returned HTTP 200 with a structurally-valid VCALENDAR envelope but every VEVENT rendered DTSTART with `NaN` in the day-of-month position and DTEND entirely as NaN. iCal-consuming clients (Outlook, Exchange, anything strict on RFC 5545 DATE-TIME parsing) silently dropped every event during parse, presenting empty calendars to subscribers. The failure was invisible to HTTP-level probes because every transport-layer signal was healthy: 200 OK, correct content-type, non-empty body, correct VEVENT count.

## Impact

Confirmed: BeWith.io (via Microsoft Exchange / Office 365 Internet Calendar Subscription, polling every ~6 hours from IPv6 `2603:1036:305:490d::5`) received zero usable events from at least 2026-05-15T21:29Z until PR #18 ships. Discovery 2026-05-18 09:49am via email from Jaime Saldivar (Bastrop) reporting events had stopped coming through.

Probable: any other subscriber consuming `/api/calendar/events.ics` was affected identically. The current production tenant feed-key is addressable from the SmartCity OS UI ("Subscribe to Calendar" widget, `?key=pinMco68TxM3FMroBHG4X1vQxZssptlQ` for Bastrop) so blast radius covers any unauthenticated end-user who added the URL to their personal calendar app.

Pre-2026-05-15: latent. The synthetic-fallback path (`generateSchedule()`, triggered on cold-start Municode scrape timeouts above 1500ms) used a different date code path that happened to produce valid output. Warm-cache Municode polls hit the broken path but were the minority of traffic. Subscribers saw a mix of synthetic test-shaped events and nothing, which read as "the SmartCity feed is unreliable / contains test data" rather than a code bug. Jaime's deletion of "all the synced events that were coming in" reflects this read.

## Timeline

- 2026-05-03. Replit to Cloud Run cutover. `CALENDAR_API_KEY` env var enters the silent-drops bucket; the `?api_key=` auth path goes dead on production. Subscribers using the `?key=` per-tenant path are unaffected.
- pre-2026-05-15. `eventsToICal` produces malformed DTSTART/DTEND on Municode-shape warm-cache events. Synthetic-fallback path masks the bug on cold-start polls. No subscriber complaint surfaces.
- 2026-05-15T18:48Z. PR #17 deploys to revision `smartcity-api-00099-vip`. Synthetic-fallback path deleted. Cold-cache timeout bumped 1500ms to 5000ms. From this point forward, 100% of polls hit the broken Municode path. Smoke probes verified envelope shape and HTTP status but did not inspect VEVENT field values.
- 2026-05-15T21:29Z onward. Microsoft Exchange (BeWith) polls every ~6h, receives HTTP 200, silently drops all 25 VEVENTs during parse.
- 2026-05-18T09:49 local. Jaime emails Bar / Nick / Shayna reporting events stopped coming through.
- 2026-05-18T15:00Z range. Cloud Shell diagnostics + live `.ics` fetch surface the DTSTART/DTEND NaN pattern.
- 2026-05-18T evening. Smartcity-os PR #18 (`fix/ical-dtstart-dtend-nan`, commit `7a6e9ce`) merges to main. Deploy via canonical canary runbook pending.

## Root cause

Two distinct sub-bugs sharing the same parse pattern.

DTSTART. `formatICalDate` called `isoDate.split("-").map(Number)` on input shapes like `"2026-06-09T18:30:00-05:00"`, producing `["2026","06","09T18:30:00","05:00"]`. The day-of-month component landed on the substring `"09T18:30:00"`; `Number("09T18:30:00")` is `NaN`. Year and month rendered correctly because they did not have time/timezone suffixes attached. Time fields rendered correctly because they came from a different extraction path. Result: `202606NaNT183000`.

DTEND. `computeEndTime` had the same parse bug. Once `d = NaN` reached `new Date(y, m-1, d, ...)` the Date became Invalid. Every subsequent `getFullYear / getMonth / getDate / getHours / getMinutes` call returned NaN. Result: `NaNNaNNaNTNaNNaN00`. The dispatch's initial hypothesis that DTEND was reading from a missing field was wrong; same parse bug, deeper NaN propagation through the Date constructor.

Two additional sites had the same pattern and were latently broken: the `else` branch of `eventsToICal` (VALUE=DATE all-day path) and `eventsToRSS` pubDate. Fixed all four in PR #18.

## Resolution

PR #18 (`fix/ical-dtstart-dtend-nan`, commit `7a6e9ce`, `server/routes/calendar.ts` +57/-32 plus 118-line regression test). Fix mirrors the May 11 client-side parseDate fix: split on `"T"` first to strip time and timezone, then split the date portion on `"-"`. New helper `parseIsoDateParts` factored locally in calendar.ts; cross-file extraction deferred. Events with unparseable isoDate are now skipped at the top of the eventsToICal loop rather than emitting malformed VEVENTs. DTEND fallback unchanged: DTSTART + 2 hours, matching the prior `generateSchedule()` convention.

Regression test at `tests/server/calendar-ical-format.test.ts` asserts: DTSTART matches `/^\d{8}T\d{6}$/`, DTEND matches the same shape, day-of-month renders as `09` for the canonical input, DTEND is exactly DTSTART + 2 hours, output never contains the literal string `"NaN"` anywhere, bare YYYY-MM-DD isoDate still works, unparseable events are skipped, and a batch of 3 production-shaped events all render cleanly. 92/92 tests passing (8 new in calendar-ical-format, 84 baseline unchanged).

## Why it took three days to surface

Silent failure. HTTP 200 with a valid envelope is indistinguishable from success at every layer above the subscriber's iCal parser. Cloud Run logs showed only the transport, not what the consumer did with the payload. Subscribers do not typically alert on "VEVENTs silently dropped during parse"; they show empty calendars and humans notice eventually. Jaime's email took 3 days because his read of the prior state was "those events were test data," not "this feed is broken."

Verification gap on the PR #17 ship. The May 15 deploy verification ran two HTTP probes (`/api/calendar/status`, `/api/calendar/events/public`) plus a browser check on the dashboard widget. None of these consume the `.ics` output; the dashboard reads JSON, not iCal. `/events.ics` was listed as the BeWith integration endpoint but was never fetched or parsed during PR #17 verification. The smoke-probe set should have included an authenticated iCal fetch with a structural-field assertion.

Recon dispatched from local Windows could not access the auth key, so its body inspection was limited to error responses (401 / 403). The cc-agent's code-path read of `eventsToICal` was correct on the function's existence and line range but did not simulate execution against Municode-shape input, which would have surfaced the parse bug. Cloud Shell access with the live tenant feed key resolved the diagnosis in four commands.

## Action items

Smartcity-os repo (assigned to cc-agent / Nick):

1. Deploy PR #18 via canonical canary runbook with post-shift verification that DTSTART renders real day-of-month for at least the next 3 future events.
2. Add an end-to-end iCal smoke test to the deploy verification checklist in the canary runbook: authenticated fetch of `/api/calendar/events.ics` followed by per-field structural assertions (no NaN, DTSTART parses, DTEND parses, VEVENT count matches the JSON endpoint).
3. Audit Cloud Run env bindings against code references. `CALENDAR_API_KEY` is read by `requireCalendarApiKey` but unbound in production; any other env vars in the same shape should surface and either be bound or removed from code.
4. Schedule a single-pass review of every `Date`-formatting site in the server codebase for the same split-on-dash-without-stripping-time pattern.

Doc_repo (this session):

1. `00_current_state.md` Fire 2 reframe (`CALENDAR_API_KEY` rotation has no operational target; F-7 / F-8 dual-key middleware urgency on env path moot).
2. `00_current_state.md` line 38 (BeWith iCal entry) reframe from "PR #17 closes" to "PR #17 closed synthetic-fallback bug; PR #18 closes silent-drop regression PR #17 exposed."
3. `11_roadmap.md` Track B list: remove Calendar API key entry.
4. `90_runbooks/cloud_run_canary_deploy.md` addendum: iCal feed structural-field check added to post-shift verification (deferred to a follow-on session, not part of this commit).

## References

- Smartcity-os PR #18, commit `7a6e9ce`
- Smartcity-os PR #17, commit `7db0e5a`
- `_sessions/2026-05-18_bewith_ical_nan_outage_claude_code.md`
- `_sessions/2026-05-15_smartcity_lkg_deploy_claude_ai_planner.md`
- `91_postmortems/2026-05-11_cutover_env_var_silent_drops.md` (for prior Fire 2 audit context)
