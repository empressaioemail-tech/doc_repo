---
id: 2026-05-11_smartcity_deploy_recovery_claude_ai_planner
title: SmartCity deploy recovery — canonical Dockerfile build path established, traffic pin found
date: 2026-05-11
agent: claude-ai-planner
repo: doc_repo
session_type: deploy_recovery + institutional_knowledge
status: active
rolled_up: true
rolled_up_into: [30a_smartcity_stabilization_sprint, 00_current_state, 11_roadmap, 90_runbooks/cloud_run_canary_deploy, 91_postmortems/2026-05-11_canonical_deploy_drift_and_traffic_pin]
---

# SmartCity deploy recovery — canonical Dockerfile build path established, traffic pin found

## Inputs

- Upstream planner handoff (smartcity-thread, post-WS-2 exit) — full forward queue, sprint state, fleet posture
- `00_current_state.md` snapshot (last_updated 2026-05-11, snapshot SHA `eceb0e2` baseline)
- Mid-session doc_repo recon courier — surfaced canonical deploy procedure (`90_runbooks/cloud_run_canary_deploy.md`) and explicit doc gaps (two-target reality, Buildpacks vs cloudbuild-api distinction, traffic-routing failure mode all undocumented)
- Three forensics docs from smartcity-os main: `_research/w1_a_6_calendar_event_visibility.md`, `_research/w1_a_7_power_bi_accuracy.md`, `_research/w1_a_8_police_units_spireon.md`
- Cloud Shell session as execution surface (Nick on keyboard)

## Outputs

- **WS-2 PRs #8/#9/#10 now actually serving Bastrop production.** Cloud Run revision `smartcity-api-00083-dss` (image digest `sha256:a5eed159a70dcb4cd8569978a6647826b9eb5f88e0a370f9ac372a9e9743d6c1`) built from `9768c23` via canonical `Dockerfile.api` path. 100% traffic on LATEST as of ~2026-05-11 03:55 UTC.
- **Canonical deploy procedure validated end-to-end:** `gcloud builds submit --config cloudbuild-api.yaml` → `gcloud run deploy --image <registry>:latest --region <region>` → `gcloud run services update-traffic --to-latest --region <region>`.
- **Institutional knowledge landed:** canary-runbook addendum, deploy-architecture postmortem, snapshot updates, roadmap held-items.

## Decisions

1. **PBI A.7 implementation direction = Option B** (OS reads PBI's published visuals directly, replacing OS recompute). Nick's call. Implementation deferred to next session — Option B is not sketched in W1.A.7 findings doc; scoping pass required first (enumerate OS tile → PBI visual mapping, propose embed/replace layout, estimate effort).

2. **Scope expansion for A.6/A.7/A.8 fixes confirmed** ("expand scope and lets get it done") but **no code dispatched this session.** Deploy recovery consumed timebox. Dispatches handed forward to next planner.

3. **Tomorrow's Bastrop message framing — Nick drafts.** Two halves: (a) what we pushed over the weekend (now safe to claim C.1/C.2/C.3 are visible after the traffic-pin fix), (b) what we need from you this week. Disposition for external Fire 2 rotations (Esri/Verkada/VFD) in tomorrow's message still pending Nick's offline call. New ask added: city clerk authoritative board schedule (Calendar F-2 prerequisite).

4. **`npm run build` Replit target — disposition deferred.** Stale post-2026-05-03 cutover but not removed this session. Either delete in a follow-on hygiene PR or comment as Replit-legacy. Pointer in postmortem + roadmap held-items.

5. **`gcloud run deploy --source .` is banned for smartcity-api.** Documented in canary runbook addendum. Canonical path is `cloudbuild-api.yaml` + `Dockerfile.api`.

## Lessons / patterns

1. **Cloud Run deploy verification must check `status.traffic`, not just `status.latestReadyRevisionName`.** When traffic tags pin a specific revision, `latestReadyRevisionName` reports the tagged revision regardless of newer ready revisions. Three tags exist on smartcity-api: `p0-3-canary` → `smartcity-api-00080-men` (May 3), `p0-followup-prophecy` → `smartcity-api-00082-pog` (May 3), `w1-c-4a-auth-fix` → `smartcity-api-00084-weg` (May 10). The `w1-c-4a-auth-fix` pin was the silent trap tonight.

2. **`gcloud run deploy --source .` bypasses `Dockerfile.api`** because Cloud Native Buildpacks don't auto-detect named Dockerfiles. For Node.js, the buildpack runs `npm run build`, which in smartcity-os bundles `server/index-prod.ts` (Replit target) — wrong server entry point for Cloud Run. The canonical `gcloud builds submit --config cloudbuild-api.yaml` uses Docker explicitly with `-f Dockerfile.api`, which runs `npm run build:cloud-run` → `server/index-cloud.ts`.

3. **The doc_repo courier pattern is the right move when the planner is improvising.** Mid-session courier recon (Stage 4 gap report) was load-bearing for finding the canonical procedure. The planner repeatedly theorized and was repeatedly wrong before the courier surfaced ground truth. Operator's explicit redirect ("give me a prompt for the doc repo agent... that's what that is for, to build institutional knowledge") was correct planner discipline.

4. **`--image :latest` redeploys are fragile.** Cloud Run's diff logic may treat unchanged image-reference strings as no-op even if the underlying digest changed. Forced redeploys should pin by digest, or follow up with `update-traffic --to-latest` to surface the new ready revision.

5. **The deploy:check package.json script is stale.** Warns "Did you change client/ files? Deploy Replit too" — post-2026-05-03 cutover, this is misinformation. Either remove or comment as Replit-legacy.

## Outstanding from this session (handed to next planner)

**Dispatch material (P1 next session, all gated on session capacity):**

- **A.6 Calendar implementation** — F-1 (public read-only endpoint), F-3 (parseDate TZ fix, 3 LoC), F-4 (VTIMEZONE block for BeWith iCal), F-5 (cold-cache await Municode), F-6 (boot canary log). All per `_research/w1_a_6_calendar_event_visibility.md` in smartcity-os. F-2 (board schedule reconciliation) blocked on city clerk authoritative schedule — that's a Bastrop ask for Monday's message.

- **A.8 Spireon implementation** — F-2 (mapDepartment 5-LoC reorder — biggest bang per LoC), F-3 (active flag toggle + inactive UI label), F-4 (retry + last-known-good fallback), F-8 (diagnostic disappearance log). Per `_research/w1_a_8_police_units_spireon.md`. RC-1 (mapDepartment mis-binning) is the root cause of "missing police cars" per forensics.

- **A.7 PBI Option B scoping** — Option B (OS reads PBI's published visuals directly) is Nick's chosen direction. Forensics doc proposes 9 Option-A fixes but doesn't sketch Option B implementation. Need scoping pass first: which OS tiles → which PBI visuals, embed token flow, layout changes, effort estimate. Implementation in follow-on after scoping review.

**Deferred to later sprint:**

- **A.8 F-1 — DB-backed Spireon department override mechanism.** Schema migration + admin UI required. Not bite-sized.

**Vendor coordination (held per Nick — engages Bastrop IT + vendors in a few days):**

- **A.6.b** — Calendar key rotation via BeWith (dual-key middleware ready)
- **A.8.b** — Spireon token (UUID urgent) + username/password rotation via Solera Tier-2

**Outstanding decisions:**

- **External Fire 2 rotations (Esri, Verkada, VFD codes)** disposition for Monday's Bastrop message — in-message ask or held for later. Nick to call offline.
- **`30_smartcity_os.md` deploy-architecture section** — substantive write-up worth its own dispatch (next session topic). Should cover: two-target reality (build vs build:cloud-run, index-prod vs index-cloud), canonical Cloud Run build path (Dockerfile.api + cloudbuild-api.yaml), Cloud Run traffic-tag awareness, `deploy:check` script disposition, the post-cutover Replit-is-dead state.
- **Cleanup of stale Cloud Run traffic tags** — `p0-3-canary`, `p0-followup-prophecy`, `w1-c-4a-auth-fix` all at 0% traffic. Keep for record or remove. P3 hygiene.

**Bastrop message tomorrow morning (Nick drafting):**

- "What we pushed over the weekend" — Prophecy UI refresh (C.1), CSP/CORS cleanup (C.2), OpenGov integration hardening (C.3). Plus secret-hygiene at HEAD, forensics on Calendar/Power BI/Spireon, daily ops health-watch email design.
- "What we need from you this week" — Spireon rotation (Solera Tier-2), Calendar rotation (BeWith), Prophecy allowlist nudge, city clerk authoritative board schedule. External Fire 2 rotations TBD per Nick's offline call.

## References

- `_sessions/2026-05-11_w1_sprint_ws2_exit_claude_ai_planner.md` — prior smartcity-thread session this picked up from
- `00_current_state.md` — snapshot regen scope (this session-close updates §5 and §6)
- `30a_smartcity_stabilization_sprint.md` — sprint plan; WS-2 verified, WS-1/3/4 + A-side implementation queue still pending
- `90_runbooks/cloud_run_canary_deploy.md` — canonical deploy procedure (addendum landed this session)
- `91_postmortems/2026-05-11_canonical_deploy_drift_and_traffic_pin.md` — postmortem from this session
- smartcity-os PRs #8 (`281126a`), #9 (`8402e66`), #10 (`985dee4`) — now serving Bastrop production via revision `smartcity-api-00083-dss`
- smartcity-os `_research/w1_a_6_*.md`, `_research/w1_a_7_*.md`, `_research/w1_a_8_*.md` — next-session dispatch source material
