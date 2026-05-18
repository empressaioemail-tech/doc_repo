---
id: 2026-05-18_bewith_ical_nan_outage
title: "BeWith iCal outage diagnosis: eventsToICal DTSTART/DTEND NaN; PR #18 shipped"
date: 2026-05-18
agent: claude_code
repo: doc_repo
session_type: investigation
rolled_up: true
rolled_up_into:
  - 00_current_state.md
  - 91_postmortems/2026-05-18_ical_dtstart_nan_silent_drop.md
---

# 2026-05-18 BeWith iCal outage diagnosis

## Inputs

Jaime Saldivar email 2026-05-18 09:49am to Bar / Nick / Shayna reporting that council/board meeting API calendar events were no longer coming through to BeWith.io. He had deleted all the synced events that were coming in because they read as test data and suspected BeWith-side credential update needed.

Doc-set carry from 2026-05-15 session: PR #17 (persistent LKG calendar fix, synthetic-fallback path deleted) flagged "verified live on revision smartcity-api-00099-vip 2026-05-15; BeWith.io confirmation pending (action on Nick)."

## Outputs

Smartcity-os PR #18 (`fix/ical-dtstart-dtend-nan`, commit `7a6e9ce`, +57/-32 in `server/routes/calendar.ts` plus 118-line regression test at `tests/server/calendar-ical-format.test.ts`) merged to main. Deploy via canonical canary runbook pending Nick's go.

Investigation chain: drafted smartcity-os recon prompt; cc-agent ran read-only repo inspection (auth middleware, eventsToICal range, BeWith integration guide); operator ran Cloud Shell diagnostics (Run revision + env binding + Secret Manager + Cloud Run logs + live iCal fetch with real tenant feed key). The body inspection revealed every DTSTART rendering as `202606NaNT183000` and every DTEND as `NaNNaNNaNTNaNNaN00` for all 25 VEVENTs.

## Decisions and findings

The previous recon's primary hypothesis (CALENDAR_API_KEY rotation / auth-mismatch) was wrong with high confidence. Microsoft Exchange (the actual subscriber, almost certainly BeWith via Office 365 Internet Calendar Subscription) was returning HTTP 200 every ~6h since 2026-05-15T21:29Z, fetching the structurally valid VCALENDAR successfully. The break was downstream: every VEVENT had `NaN` in DTSTART day-of-month and entirely-NaN DTEND, causing Outlook/Exchange to silently drop every event during parse. The 200 response masked the failure from any HTTP-level probe.

Two distinct sub-bugs, same root pattern. `formatICalDate` split `"2026-06-09T18:30:00-05:00"` on `-` directly, producing `["2026","06","09T18:30:00","05:00"]` and `Number("09T18:30:00") = NaN`. Year and month rendered correctly because they did not have time/timezone suffixes attached. Time fields rendered correctly because they came from a different extraction path. Result: `202606NaNT183000`. `computeEndTime` had the same parse bug; once `d = NaN` reached `new Date(y, m-1, d, ...)` the Date became Invalid; every subsequent `getFullYear / getMonth / getDate / getHours / getMinutes` call returned NaN. Result: `NaNNaNNaNTNaNNaN00`. The cc-agent also found and fixed the same pattern at two latently-broken sites (the `else` branch of `eventsToICal` for VALUE=DATE all-day events, and `eventsToRSS` pubDate). Fix mirrors the May 11 client-side parseDate fix: split on `"T"` first to strip time and timezone, then split the date portion on `"-"`. New helper `parseIsoDateParts` factored locally in calendar.ts; cross-file extraction deferred. Events with unparseable isoDate are now skipped at the top of the eventsToICal loop rather than emitting malformed VEVENTs.

PR #17 closure was premature. The synthetic-fallback path it deleted had been masking the formatter bug on cold starts (synthetic events used a different date code path that happened to be correct). Warm-cache Municode polls had always been broken; nobody noticed because warm-cache hits were the minority pre-PR-#17, the failure is silent on the subscriber side, and PR #17 smoke probes verified envelope shape and HTTP status without inspecting individual VEVENT field values.

Side-finding: `CALENDAR_API_KEY` env var is **unbound** on the current Cloud Run revision (verified via `gcloud run services describe`), and no Secret Manager secret with `CALENDAR` in its name exists. The `?api_key=` auth path has been dead since at least the 2026-05-03 Replit-to-Cloud-Run cutover. All current subscribers (including the Microsoft Exchange / BeWith poller) use the per-tenant `?key=<tenants.settings.calendarFeedKey>` auth path. The F-7 rotation has no operational target on the env path; F-8 dual-key middleware urgency on that path is moot. The leaked value in git history at commit `08fd932` remains a defense-in-depth follow-on but is not load-bearing for current production auth.

## Lessons and patterns

Silent-drop failure modes defeat envelope-level verification. PR #17's smoke probes inspected HTTP status, `cachedSource`, and event count via `/api/calendar/events/public`. That was not sufficient to catch a bug that produced HTTP 200, valid VCALENDAR envelope, correct event count, and unparseable per-field date values. Verification for any output that crosses a wire to an external parser must inspect parsed-side semantics, not just transport-side success codes.

Recon dispatches that cannot inspect the actual artifact will miss this class of bug. The earlier recon dispatched from local Windows could not fetch the iCal body without the auth key. The cc-agent gave a confident auth-mismatch read based on code-path inspection and HTTP probes alone. Cloud Shell with the live key resolved the diagnosis in four commands. Future iCal / calendar-feed recons should include "fetch the artifact and inspect field values" as a required step before drawing root-cause conclusions.

The cutover env-var silent-drops bucket (Fire 2) missed `CALENDAR_API_KEY`. Today's `gcloud run services describe` shows it is not bound. The 2026-05-11 audit catalogued code references and silent-drops but did not catch this binding. Worth a single-pass sweep of any other env vars that the code expects but Cloud Run does not have bound, before declaring the silent-drops bucket closed.

## Outstanding from this session

Deploy PR #18 (`fix/ical-dtstart-dtend-nan`, commit `7a6e9ce`) via canonical canary runbook at `90_runbooks/cloud_run_canary_deploy.md`. Verify post-deploy with the same `curl + grep DTSTART` check that surfaced the bug; confirm `DTSTART;TZID=America/Chicago:20260609T183000` shape (real day-of-month, no NaN anywhere). Cleanup the orphan tag this canary adds.

Email Jaime, Bar, and Shayna confirming root cause was a server-side iCal date-formatting bug (not credentials), fix deployed, subscription should populate on next poll. Send only after deploy is verified.

Audit Cloud Run env bindings against code references to find any other silent unbound env vars in the calendar.ts neighborhood and elsewhere.

`00_current_state.md` Fire 2 entry, A.6.b / A.8.b residual entry, and `11_roadmap.md` Track B entry all updated this session to reflect the env-var-unbound finding.

## References

- Smartcity-os PR #18 commit `7a6e9ce` (`fix/ical-dtstart-dtend-nan`)
- Smartcity-os PR #17 commit `7db0e5a` (prior LKG fix, closure now revised)
- `91_postmortems/2026-05-18_ical_dtstart_nan_silent_drop.md`
- `_sessions/2026-05-15_smartcity_lkg_deploy_claude_ai_planner.md`
- `90_runbooks/cloud_run_canary_deploy.md`
