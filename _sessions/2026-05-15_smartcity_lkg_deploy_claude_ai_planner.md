---
id: 2026-05-15_smartcity_lkg_deploy
title: PR #17 LKG calendar deploy via canary runbook
date: 2026-05-15
agent: claude_ai_planner
repo: doc_repo
session_type: deploy
rolled_up: true
rolled_up_into:
  - 00_current_state.md
  - 90_runbooks/cloud_run_canary_deploy.md
---

# 2026-05-15 smartcity-api PR #17 LKG deploy

## Inputs

- Claude Code handoff summary from a prior execution session, citing SD-S26 (locked 2026-05-03) as the deploy reference. Two user-reported bugs documented:
  - Bug 1: Bastrop dashboard calendar "Open Full Calendar" link landing on CivicPlus instead of Bastrop Municode microsite. Root cause in `client/src/components/CommunityCalendar.tsx:9` (`MUNICODE_URL` constant) from rebrand commit `7cc3911`.
  - Bug 2: External iCal subscribers (BeWith.io) receiving synthetic recurring meetings instead of real Municode data on Cloud Run cold starts. Root cause: 1500ms cold-cache timeout in `server/routes/calendar.ts` falling back to `generateSchedule()` synthetic data.
- Nick's question: are the Claude Code deploy instructions correct.
- Doc repo recon: canonical simplified deploy sequence (from `90_runbooks/cloud_run_canary_deploy.md` post-2026-05-11 addendum), full canary runbook, git status confirming PR #17 squash-merged on `origin/main` at SHA `7db0e5a`.

## Outputs

PR #17 (`fix/municode-url-bastrop-microsite`) shipped to production via canonical canary runbook.

- Build: SUCCESS in 3m4s, image digest `sha256:59fc5d1e615c615a28f2c274d91618147438da7e015187de0aad5f830a9e6417`
- Canary deploy: revision `smartcity-api-00099-vip` at tag `lkg-20260515-1848`, 0% traffic
- Canary smoke probes passed:
  - `/api/calendar/status`: `lastScrapeStatus: "ok"`, `lkgFreshAt` present, `cachedSource: "municode"` (PR #17 fields confirmed present in deployed revision)
  - `/api/calendar/events/public`: `source: "municode"`, count 25, first event "Regular City Council Meeting" with videoUrl on `bastrop-tx.municodemeetings.com`
- Traffic shifted via `--to-tags=lkg-20260515-1848=100`
- Production smoke probes matched canary exactly post-shift
- Browser check: Bastrop dashboard "Open Full Calendar" lands on `bastrop-tx.municodemeetings.com/`, Bug 1 verified live
- Observation window: 1 hour, `source` remained `"municode"`, no regressions
- Git backup tags pushed:
  - `backup/pre-lkg-pr17-20260515` at SHA `7db0e5a`
  - `backup/post-lkg-pr17-smartcity-api-00099-vip` at SHA `7db0e5a`

## Decisions

1. Path B (canary runbook) over path A (simplified deploy). PR #17 blast radius (new JSONB column `tenants.settings.calendarLKG`, boot hydration logic, fallback chain replacement, cache TTL bump from 1500ms to 5000ms, 110 lines of synthetic-fallback deletion) warranted the 0%-traffic canary safety window over the simplified sequence.

2. Canonical canary runbook used verbatim. Did not modify the procedure to address the pre-existing pinned-tag hazard mid-deploy. Cleanup deferred to a follow-up rather than coupled to this ship.

3. Claude Code handoff not run as-is. Substantive divergence from canonical canary runbook in four areas: missing pre-deploy backup tag (runbook step 0), missing post-deploy backup tag (runbook step 8), manual URL construction instead of `describe` (runbook step 4), no production-vs-canary equivalence check post-shift (runbook step 7). Reconciled to canonical before execution.

4. Claude Code's SD-S26 reference treated as stale anchor. The post-2026-05-11 runbook addendum supersedes whatever SD-S26 originally locked. Deploy executed from current canonical, not the handoff's citation.

## Lessons and patterns

- Claude Code in execution mode can produce plausibly-correct deploy instructions that have drifted from canonical. Pattern-matching against commands that look reasonable is the failure mode. Verify against doc_repo before running, every time.
- The `gcloud run services describe --format="value(status.traffic[?tag=='X'].url)"` JMESPath filter inside `value()` returns empty silently in this gcloud version. Use the URL printed by `gcloud run deploy` directly, or extract via `--format=json | jq`. Non-blocking but worth knowing.
- The May 11 runbook addendum's "three pinned tags" claim was already stale at write-time (`pbi-ai-cal-20260511` was pinned by PR #16's May 11 deploy). Specific tag counts in canonical docs decay with every canary deploy. Either refresh the count on every canary close, or rephrase the runbook to point at `describe` as the source of truth rather than naming counts inline.

## Outstanding from this session

- Confirm with BeWith.io that their iCal feed `/api/calendar/events.ics` now serves real Municode meeting data and no longer the synthetic fallback. Action on Nick.
- Document the `source: "empty"` case in `BEWITH_CALENDAR_INTEGRATION_GUIDE.md` (in smartcity-os repo, not doc_repo) error-response section. Currently only mentioned inline near the JSON Feed section.
- Orphan-tag cleanup on smartcity-api. Five pinned tags as of session close (`p0-3-canary`, `p0-followup-prophecy`, `w1-c-4a-auth-fix`, `pbi-ai-cal-20260511`, `lkg-20260515-1848`). The May 11 postmortem's hazard compounds with every canary deploy. Cleanup via `gcloud run services update-traffic --remove-tags=<tag>` once each prior revision is confirmed unused.

## References

- `90_runbooks/cloud_run_canary_deploy.md` for canonical canary procedure
- `91_postmortems/2026-05-11_canonical_deploy_drift_and_traffic_pin.md` referenced by runbook addendum
- PR #17 on smartcity-os: `fix(calendar): point widget links to Bastrop microsite + persistent LKG for iCal feed`, squash-merged at SHA `7db0e5a`
- Previous prod revision (rollback target): `smartcity-api-00096-jig` from PR #16 (May 11)
