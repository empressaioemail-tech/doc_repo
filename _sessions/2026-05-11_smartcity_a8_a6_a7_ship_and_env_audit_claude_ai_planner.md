---
id: 2026-05-11_smartcity_a8_a6_a7_ship_and_env_audit
title: SmartCity OS — W1.A.8 + W1.A.6 + W1.A.7 scoping ship, deploy, and cutover env-var gap discovery
date: 2026-05-11
last_updated: 2026-05-11
agent: claude_ai_planner
repo: smartcity-os, doc_repo
session_type: dispatch
rolled_up: true
rolled_up_into: [00_current_state.md, 30a_smartcity_stabilization_sprint.md, 11_roadmap.md, 91_postmortems/2026-05-11_cutover_env_var_silent_drops.md]
---

# 2026-05-11 — SmartCity OS: A.8 + A.6 + A.7 scoping ship + cutover env-var gap discovery

Second smartcity-thread planner session of 2026-05-11. Prior session (`_sessions/2026-05-11_smartcity_deploy_recovery_claude_ai_planner.md`) recovered from the compound deploy failure, established the canonical deploy procedure, and queued A.6/A.7/A.8 implementation. This session executed against that queue and surfaced a substantial pre-existing cutover gap during post-deploy verification.

> **Revision-suffix reconciliation note (added 2026-05-11 by session 3 planner):** Cloud Run generation numbers can be reused across revisions with different suffixes. Both `smartcity-api-00084-vhr` (created 2026-05-11T18:24Z during this session) and `smartcity-api-00084-weg` (created 2026-05-10T02:22Z, the May-10 W1.C.4a auth-fix) coexist. Reconcile revision references by `creationTimestamp`, not by suffix. See `90_runbooks/cutover_env_var_bind_procedure.md` (reconciliation notes) for the canonical guidance.

## Inputs

- Handoff from prior session (post deploy-recovery, doc_repo at `46bf38e`)
- `00_current_state.md` regenerated at end of prior session (`last_updated: 2026-05-11`)
- Group 1 queue per handoff: A.8 Spireon batch, A.6 Calendar batch, A.7 PBI Option B scoping
- Smartcity-os main at `5b9815e` at session start; advanced to `86a90ff` after A.6 merge; advanced again to `04b296e` after A.7 scoping merge

## Outputs

Three PRs merged to smartcity-os main, one production deploy, one mid-session gap audit:

- **PR #11 — W1.A.8 Spireon batch** (squash `5b9815e`). F-2 mapDepartment reorder, F-3 active flag + inactive UI label, F-4 retry + LKG fallback, F-8 disappearance log. 562/-37 LoC, 5 commits squashed (fifth was a TS compile-fix for downlevelIteration that surfaced during execution — narrow, in scope). Three new test files: `tests/server/spireon-mapDepartment.test.ts`, `tests/server/spireon-detectDisappearances.test.ts`, `tests/api/spireon.test.ts`. F-1 (DB-backed override mechanism) stays deferred to P2 per handoff.
- **PR #12 — W1.A.6 Calendar batch** (squash `86a90ff`). F-1 public read-only `/api/calendar/events/public`, F-3 parseDate timezone fix (local midnight, not UTC), F-4 VTIMEZONE block for America/Chicago in iCal, F-5 Municode await with 1.5s timeout on cold cache, F-6 active boot probe + `/api/calendar/status` scrape-state extension. 584/-31 LoC. Four new test files: `tests/api/calendar-public.test.ts`, `tests/client/calendar-parseDate.test.ts`, `tests/server/calendar-ical-vtimezone.test.ts`, `tests/api/calendar-municode-timeout.test.ts`. F-2 (board schedule reconciliation) blocked on Bastrop city clerk authoritative schedule — Monday message ask.
- **PR #13 — W1.A.7 PBI Option B scoping** (squash `04b296e`). One markdown file: `_research/w1_a_7_pbi_option_b_scoping.md` (198 lines). Frames Option B as "delete, don't correct" — retires OS recompute behind Dashboard tab, eliminates the 11 Option A divergence bugs as a class rather than fixing each. Recommends `type: "visual"` for Dashboard tab + `type: "report"` unchanged for Reports tab. Critical finding: `/projects` Reports tab already proves the PBI embed plumbing works via service-principal embed tokens — Option B is "expand and shift," not "build from scratch." Server-side embed-token plumbing requires zero changes. Phasing: Phase 1 ships Dashboard tab visual embed; Phase 2 is product decision about executive-overview / AI-assistant consumer of `getCIPProjectData()`; Phase 3 retires the server recompute chain only after Phase 2 resolves.
- **Production deploy** — Cloud Run revision `smartcity-api-00084-vhr`, image digest `sha256:a53cd0363fcaaae627990f55328dd9d49bab0729779d4d473581fb3a98853b59`, 100% traffic on LATEST. First normal deploy post-2026-05-11 recovery. Canonical sequence followed: `cloudbuild-api.yaml` build (not buildpacks), `build:cloud-run` esbuild target (not stale `npm run build` Replit target), explicit `gcloud run services update-traffic --to-latest`, traffic verification via `gcloud run services describe`. Three pinned tags (`p0-3-canary`, `p0-followup-prophecy`, `w1-c-4a-auth-fix`) remain at 0% — same three the handoff flagged for P3 cleanup, unstranded but undisposed.
- **Mid-session cutover env-var gap audit** — triggered by post-deploy verification finding `/api/spireon/health` returning `{"connected":false,"status":"not_configured"}` despite the freshly-shipped A.8 code being deployed. Initially diagnosed as "Solera Tier-2 token rotation pending"; deeper investigation revealed Spireon credentials are not bound in Cloud Run env at all (distinct from "token rejected"). Subsequent `gcloud run services describe smartcity-api` dump cross-referenced against smartcity-os code's `process.env.*` references: 21 env vars bound in Cloud Run; ~50+ referenced in code. Full inventory committed as `91_postmortems/2026-05-11_cutover_env_var_silent_drops.md`. Key buckets: 13 rotation-pending vars (Spireon×3, Verkada×2, ESRI/ArcGIS×3, Calendar×1, VFD×6 — vendor coordination required), 11 silent-drop vars (MyGov×2, Resend, Pipedrive, Google OAuth×2, OpenGov Transparency, admin/bootstrap×4 — re-bind existing values), 12 soft-default fallbacks (work without binding but worth setting), 3 oddities (Anthropic/OpenAI code-vs-config name mismatch, Samsara secret-name mismatch, non-secrets stored in Secret Manager).

## Decisions

- **A.8 batch scope** — F-2/F-3/F-4/F-8 in one PR. F-1 (DB-backed override mechanism) stays deferred to P2 per handoff.
- **A.6 batch scope** — F-1/F-3/F-4/F-5/F-6 in one PR. F-2 (board schedule reconciliation) blocked on Bastrop city clerk.
- **A.7 dispatch type** — scoping pass producing a markdown doc, not implementation. Forensics doc only sketched Option A's 9 fixes; Option B was not implementation-ready.
- **A.7 chosen direction** — Option B. Option A retired. Option A's fix table doesn't translate to Option B because most rows simply don't exist in the new architecture.
- **F-6 doc-vs-dispatch discrepancy resolution** — forensics doc wins. Dispatch had framed F-6 as a passive wiring log; forensics doc framed it as active silent-failure detection probe targeting RC-6. cc-agent paused and reported per the dispatch's own conflict-resolution rule. Resolved: implement doc variant.
- **Parallel → sequential pivot** — initial attempt to run A.6 (cc-agent-2) in parallel with A.8 (cc-agent-1) failed: both agents shared a working tree (workspace hygiene incident #4). Sequential dispatch chosen for remainder of session. Worktree (`git worktree add`) identified as canonical fix for future parallel work; not implemented this session.
- **Deploy posture** — batched A.6+A.8 at session end rather than deploying A.8 first. Clean batched deploy validated the canonical sequence with no incidents.
- **Bastrop Monday message scope expanded** — from Spireon-only vendor ask to bundled vendor coordination (Spireon + Verkada + ESRI/ArcGIS + Calendar + VFD codes). Same coordination shape across all five vendors; single message clears the unblock path for all of them. Silent-drop bucket of the env-var gap stays internal (we restore those from existing values without vendor coordination).
- **Cutover env-var gap discovery handling** — audit performed mid-session via smartcity-os repo agent; postmortem authored this commit; remediation queued as two-track work for next session (silent-drop re-bind first since values exist; rotation-pending re-bind as vendor responses arrive).

## Lessons / patterns

- **Forensics doc beats dispatch on F-item specs.** When drafting dispatches against forensics docs, read the F-item spec verbatim from the source doc rather than narrating it from memory. The F-6 incident demonstrates the failure mode: dispatch narration drifted from doc intent (wiring log vs. silent-failure probe). The dispatch's own "if doc disagrees, stop" rule caught it, but better to avoid the discrepancy class entirely by copying F-spec text directly into the dispatch.
- **Worktree pattern for parallel dispatches.** Two agents cannot share a working tree without colliding. Canonical fix: `git worktree add ../<repo>-<branch-short> main`. Four incidents to date promotes the runbook from "known good practice" to "documented runbook overdue."
- **Hybrid-today discovery in A.7 recon.** `/projects` already embeds the full PBI report in its Reports tab. Option B is "expand and shift," not "build from scratch." This kind of insight only surfaces during recon, never during planning — argument for keeping recon → plan → execute → report shape even when work seems straightforward.
- **Sequential dispatch is fine for 2-3 PRs/session.** Throughput cost vs. parallelism is modest when individual dispatches are well-scoped and recon plans hold. Worktree-based parallelism is worth the setup only when sprints have >2 truly independent tracks running.
- **Cutover env-var completeness is not free.** The 2026-05-03 Replit→Cloud Run cutover dropped at least 30 env vars beyond the Fire 2 redaction set. Many are latent (broken when invoked, not actively erroring) — most were broken since 2026-05-03 and only surfaced today via the Spireon Police-dashboard investigation. The pattern to lock in for future infra cutovers: enumerate `process.env.*` references in code, snapshot source environment's bindings, produce a binding-mapped checklist, verify post-cutover. "No error logs about FOO" is insufficient evidence that FOO is bound — confirmed silence is the failure mode.
- **Audit code references AND config bindings, not just config bindings.** Many Replit-era env var names persist in code with Replit-era prefixes (`AI_INTEGRATIONS_*`) that don't match Cloud Run config. Anthropic SDK's `process.env.ANTHROPIC_API_KEY` fallback saved us by accident; OpenAI image/audio integrations have no equivalent fallback and are dead-on-invocation. Audit dispatches must traverse both directions: code-references-not-bound AND bound-but-not-referenced.

## Outstanding from this session

- **A.7 implementation prompt** — gated on Nick resolving Section 8 open questions: (1) Bastrop PBI workspace visual inventory (requires workspace inspection — going into Monday ask), (2) ProjectDetailCard treatment under Option B, (3) RLS posture for multi-tenant growth, (4) executive-overview / AI-assistant consumer disposition (Phase 2 gate), (5) filter-chip → bookmark wiring.
- **Bastrop Monday message** — Nick drafting. Bundled vendor coordination asks: Spireon (Solera Tier-2 — full credential set: TOKEN + USERNAME + PASSWORD, rotation OK as coincident process), Verkada (vendor — API_KEY + WEBHOOK_SECRET), ESRI/ArcGIS (vendor — CLIENT_ID + CLIENT_SECRET + ESRI_API_KEY), Calendar API key (BeWith — coordinate with W1.A.6 F-7/F-8 dual-key middleware deferred work), VFD codes (Bastrop VFD admin — six codes). Plus A.7 PBI visual inventory ask. Plus Prophecy allowlist nudge. Plus city-clerk authoritative board schedule (A.6 F-2 prereq).
- **Env-var re-bind dispatches needed (P1, next session, two-track):**
  - **Track A — immediate silent-drop restore.** 11 vars not pending vendor rotation: `MYGOV_USERNAME`, `MYGOV_PASSWORD`, `RESEND_API_KEY`, `PIPEDRIVE_API_TOKEN`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `OPENGOV_TRANSPARENCY_KEY`, `ADMIN_RESET_PASSWORD`, `BASTROP_BOOTSTRAP_PASSWORD`, `USER_RESET_EMAIL`, `USER_RESET_PASSWORD`. Existing values to be sourced from old Replit env / vendor portals (whichever applies per var). Bind in GCP Secret Manager → reference from Cloud Run service spec → new revision.
  - **Track B — rotation-pending restore.** 13 vars awaiting vendor coordination: Spireon×3, Verkada×2, ESRI/ArcGIS×3, Calendar API key, VFD codes×6. Bind as fresh values arrive from Monday vendor coordination responses. Verify integration health endpoints (where present) post-bind.
- **Code fix dispatch needed (small, P1 next session):** `server/lib/anthropic.ts:5-6` (and `server/replit_integrations/{image,audio}/client.ts`) read `AI_INTEGRATIONS_ANTHROPIC_API_KEY` / `AI_INTEGRATIONS_OPENAI_API_KEY` / etc. — Replit-era prefixed names that don't match Cloud Run bindings. Anthropic SDK's `process.env.ANTHROPIC_API_KEY` fallback masks the mismatch; OpenAI has no fallback. Update code to read the bound names (`ANTHROPIC_API_KEY`, etc.) and drop the Replit-era prefix. Net: ~10 LoC across 3 files.
- **`90_runbooks/agent_workspace_hygiene.md`** — promoted from P3 hygiene backlog to next-up. Not authored this session; needs its own focused dispatch. Specifies `git worktree add` canonical pattern + recon-time refusal as safety net + branch-naming conventions for parallel dispatches.
- **`90_runbooks/cutover_env_var_audit.md`** — new runbook needed (P2, after Track A re-bind ships). Forward-looking checklist for future infra cutovers covering: enumerate `process.env.*` references, snapshot source env bindings, produce mapped checklist, verify post-cutover. Postmortem from this session has the lessons; runbook formalizes them.
- **WS-1 migration spine** — Phase 2A prereqs still gated on Nick-box gcloud SSL or Cloud Shell commitment. No movement.
- **WS-3 security sweep remainder** — `x-internal-ai` header at `server/routes/ai-assistant.ts:4212`, auth middleware vitest coverage gap, Fire 2 internal remainder (`Admin123!` literals ×3, `POWERBI_REPORT_ID` audit, `USER_RESET_EMAIL` PII move — note: USER_RESET_EMAIL also on Track A re-bind list, sequence the PII move after re-bind). No movement.
- **WS-4 schema/multi-tenancy** — ADR-005 migration, raw-records audit, `mygov_work_orders` schema dedup, multi-tenancy invariant verification, typecheck baseline → zero (~1133 lines of pre-existing TS errors observed by both A.6 and A.8 recons), lockfile drift root cause, ADR-006 authorship. No movement.
- **`30_smartcity_os.md` deploy-architecture section** — substantive write-up still pending. Source material in 2026-05-11 postmortem (deploy) + canary runbook addendum.
- **Cloud Run traffic-tag cleanup** — three pinned tags at 0% confirmed not stranding traffic via today's deploy verification; keep-vs-remove decision still open.
- **Hygiene: Secret Manager naming consistency** — `smartcity-SAMSARA_API_KEY` secret bound to `SAMSARA_API_TOKEN` env var (functional but lexically confusing); `smartcity-NODE_ENV` and `smartcity-MYGOV_BASE_URL` stored as Secret Manager secrets despite not being secrets (inflates IAM scope). Worth a normalization pass as part of the Track A re-bind dispatch.
- **`deploy:check` and `npm run build` Replit-target disposition** — both still stale post-cutover. Still pending.
- **Build hygiene inventory** (pre-existing, non-regressions, surfaced during today's deploy): jspdf / jspdf-autotable / pdf-utils dynamic+static import warnings can't be code-split, 5.5MB minified JS main bundle, 12 post-prune npm vulnerabilities (1 low / 4 moderate / 7 high).

## References

- Prior session: `_sessions/2026-05-11_smartcity_deploy_recovery_claude_ai_planner.md`
- Deploy postmortem: `91_postmortems/2026-05-11_canonical_deploy_drift_and_traffic_pin.md`
- Cutover env-var postmortem (this session): `91_postmortems/2026-05-11_cutover_env_var_silent_drops.md`
- Canonical deploy runbook: `90_runbooks/cloud_run_canary_deploy.md` (2026-05-11 addendum)
- Sprint plan: `30a_smartcity_stabilization_sprint.md`
- Current state: `00_current_state.md`
- Roadmap: `11_roadmap.md`
- Session-close template: `90_runbooks/session_close_template.md`
- A.8 forensics: `smartcity-os _research/w1_a_8_police_units_spireon.md`
- A.6 forensics: `smartcity-os _research/w1_a_6_calendar_event_visibility.md`
- A.7 Option A forensics: `smartcity-os _research/w1_a_7_power_bi_accuracy.md`
- A.7 Option B scoping (this session): `smartcity-os _research/w1_a_7_pbi_option_b_scoping.md`
- A.8 PR: https://github.com/empressaioemail-tech/smartcity-os/pull/11 (squash `5b9815e`)
- A.6 PR: https://github.com/empressaioemail-tech/smartcity-os/pull/12 (squash `86a90ff`)
- A.7 scoping PR: https://github.com/empressaioemail-tech/smartcity-os/pull/13 (squash `04b296e`)
- Production revision: `smartcity-api-00084-vhr` (image digest `sha256:a53cd0363fcaaae627990f55328dd9d49bab0729779d4d473581fb3a98853b59`)
