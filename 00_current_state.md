---
id: 00_current_state
title: Current state snapshot — 2026-05-11
status: active
last_updated: 2026-05-11
applies_to: portfolio
related: [11_roadmap, 30a_smartcity_stabilization_sprint, 27_engine_evolution_plan, 42_design_accelerator_program_plan, 48_codex_program_plan]
---

# Current state snapshot

> **Read me first.** Per [`90_runbooks/current_state_protocol.md`](90_runbooks/current_state_protocol.md). Regenerated at every session close. Pointer doc — for full context, follow links into canonical docs.

## 1. Active fires

- **Fire 2** — plaintext secrets in `.replit`. WS-2 internals (`CALENDAR_API_KEY`, `SPIREON_USERNAME`/`SPIREON_TOKEN`/`SPIREON_PASSWORD`, plus `SPIREON_API_TROUBLESHOOTING.md` token UUID + password-length hint) redacted at HEAD 2026-05-11 via A.6/A.8 commits to smartcity-os main. **Spireon credentials (TOKEN, USERNAME, PASSWORD + ACCOUNT_NAME, NSPIRE_ID, SYSDEVX_ID) re-bound to Cloud Run 2026-05-11 session 2 via revision `smartcity-api-00085-pvd`; Spireon integration verified live (21 vehicles, NSpire authenticated). Track A silent-drop bucket (MyGov×2, Resend, Pipedrive, Google OAuth×2, admin/bootstrap×4 = 10 of 11) bound in same revision; `OPENGOV_TRANSPARENCY_KEY` deferred (Nick couldn't locate in Replit vault — vendor-portal lookup pending).** Remaining: `CALENDAR_API_KEY` rotation (gated on F-7/F-8 dual-key middleware via BeWith), Track B Verkada×2 / ESRI/ArcGIS×3 / VFD×6 (vendor coordination via Bastrop Monday message). See [`91_postmortems/2026-05-11_cutover_env_var_silent_drops.md`](91_postmortems/2026-05-11_cutover_env_var_silent_drops.md). WS-3 internals (`Admin123!` literals ×3, `POWERBI_REPORT_ID` audit, `USER_RESET_EMAIL` PII — USER_RESET_EMAIL now bound in `00085-pvd`; sequence the PII move next) still pending. Portfolio-level git-history scrub (BFG / git-filter-repo) carries forward separately. Owner: Nick + agent.
- **Fire 3** — legacy-design-tools `post-merge.sh` Neon-guard verification. Open. Owner: Nick (browser). Likely moot after [`42`](42_design_accelerator_program_plan.md) Phase 1 clears.

(Fire 1 closed 2026-05-10. Fire 4 closed pending workspace rename. Fire 5 closes at M-Stabilize Phase 2C cutover.)

## 2. In-flight sprints

- **[`30a_smartcity_stabilization_sprint.md`](30a_smartcity_stabilization_sprint.md)** — SmartCity OS — phase 1 of 4 — last update 2026-05-11
  - Owner agent: TBD (3 workstreams remaining: WS-1 migration spine, WS-3 security sweep remainder, WS-4 schema/multi-tenancy)
  - Status: **WS-2 verified 2026-05-11**; W1 implementation follow-ons (A.8 Spireon batch PR #11, A.6 Calendar batch PR #12, A.7 PBI Option B scoping PR #13) shipped + deployed to Cloud Run revision `smartcity-api-00084-vhr` (session 1). **Session 2 (2026-05-11) shipped cutover env-var bind via revision `smartcity-api-00085-pvd`** — Spireon now live (21 vehicles; A.8 user-visible value restored); MyGov/OpenGov BNP/admin-reset/Google OAuth/Resend/Pipedrive bound; OPENGOV_TRANSPARENCY_KEY and Calendar partner-feed auth still pending. A.6.b residual (CALENDAR_API_KEY via BeWith post-F-7/F-8) and Track B remainder (Verkada, ESRI/ArcGIS, VFD codes) continue as next-session work. WS-1, WS-3 (remaining items beyond x-internal-ai CORS removal already bundled into C.2's PR #9), and WS-4 still pending. Cross-cutting prereqs (gcloud SSL, clone refresh, ADR-005 migration, Neon quota) still need clearing for Phase 2A.
  - Path to: M-Stabilize

- **[`27_engine_evolution_plan.md`](27_engine_evolution_plan.md) + [`42_*`](42_design_accelerator_program_plan.md) + [`48_*`](48_codex_program_plan.md)** — Codex/Cortex track — Phase 1 across both program plans — last update 2026-05-11
  - Owner agent: TBD (multi-stream: 27-A through 27-G plus DA-1..DA-Test-Iso plus CDX-Phase1-*)
  - Status: pending — Phase 1 streams ready to dispatch (27-G brand migration gated on PR #17)
  - Path to: M-CortexQA, M-CodexQA

## 3. Open ADRs to be aware of

- **ADR-005** multitenancy — queued migration; gates M-Stabilize done criterion #5; [`30a`](30a_smartcity_stabilization_sprint.md) WS-4 cross-cutting prereq
- **ADR-006** schema migration framework — drafted under [`30a`](30a_smartcity_stabilization_sprint.md) WS-1 Phase 3 (Drizzle migrate adoption)
- **ADR-007** cross-stakeholder atom access — active; property-as-tenant; informs M-PropIntel and 1b cross-tenant
- **ADR-008** Hauska Engine factor-out — active; gated on M-Stabilize Phase 2C closure
- **ADR-009** firm tenancy — deferred until [`48`](48_codex_program_plan.md) Phase 5 (1a return)

## 4. Agent fleet assignments

- **claude.ai planner (orchestrator)** — portfolio-wide planning, cross-track audit, roadmap maintenance, session-close orchestration
- **claude.ai planner (smartcity thread)** — [`30a`](30a_smartcity_stabilization_sprint.md) execution dispatches
- **claude.ai planner (codex/cortex thread)** — [`27`](27_engine_evolution_plan.md) / [`42`](42_design_accelerator_program_plan.md) / [`48`](48_codex_program_plan.md) execution dispatches
- **cc-agent-1..4** (Cursor Claude Code) — workstream execution; soft specialization per repo
- **cursor-manual** — Nick's keyboard for ambiguous fixes
- **replit-agent** — Replit-local ops; not for shipping code (per HR-2)
- **Nick** — merge button, deploy button, decisions

## 5. Recent session summaries (last 5)

- **2026-05-11 — Smartcity-thread: cutover env-var bind shipped (session 2 of 2)** — 18 vars bound to Cloud Run via revision `smartcity-api-00085-pvd` (10 of 11 Track A silent-drops; 6 Spireon Track B; OPENGOV_EMAIL + OPENGOV_BNP_API_KEY); MYGOV pre-existing Secret Manager debris (v1/v2 from 2026-04-04, no IAM, no Cloud Run wire) discovered + remediated via v3 version-add; Spireon/MyGov/OpenGov BNP verified live; new bind-procedure runbook landed; OPENGOV_TRANSPARENCY_KEY + Track B remainder (Verkada/ESRI/VFD/Calendar) carry forward; revision-suffix contradiction surfaced and queued for investigation.
- **2026-05-11 — Smartcity-thread: A.8 + A.6 + A.7 scoping ship + cutover env-var gap discovery** — PRs #11 (A.8 Spireon), #12 (A.6 Calendar), #13 (A.7 PBI Option B scoping) merged + deployed to `smartcity-api-00084-vhr`; mid-session audit surfaced 30+ env vars referenced in code but not bound in Cloud Run since 2026-05-03 cutover; postmortem + raw audit landed; two-track rebind queued as P1 next-session work.
- **2026-05-11 — Smartcity-thread: deploy recovery + canonical Dockerfile path** — WS-2 PRs #8/#9/#10 actually serving Bastrop production via revision `smartcity-api-00083-dss`; canary-runbook addendum, deploy postmortem landed; A.6/A.7/A.8 implementation queued for next session.
- **2026-05-11 — Smartcity-thread: WS-2 W1 sprint exit** — seven W1 items shipped (PRs #8/#9/#10 + four forensics docs); A.6/A.8 rotation work continues as A.6.b/A.8.b post-sprint.
- **2026-05-11 — Orchestrator: roadmap revision + orientation runbooks** — milestone framing landed; snapshot pattern adopted; session-close template updated.

## 6. Cross-cutting watch list

- **Brand migration** (Plan Review → Codex; Design Accelerator → Cortex) — [`27`](27_engine_evolution_plan.md) Stream G; gated on legacy-design-tools PR #17 landing
- **M4-B → Codex 1b interface** — stub at [`33_smartcity_codex_1b_integration.md`](33_smartcity_codex_1b_integration.md); full spec deferred to post-M-Stabilize coordination
- **Test isolation patterns** — [`42`](42_design_accelerator_program_plan.md) DA-Test-Iso (legacy-design-tools) and [`30a`](30a_smartcity_stabilization_sprint.md) WS-4 (smartcity-os MyGov audit) are the same footgun shape across two repos; coordinate findings
- **Migration sprint Phase 2** absorbed into [`30a`](30a_smartcity_stabilization_sprint.md) WS-1; [`12_migration_sprint.md`](12_migration_sprint.md) retains canonical phase definitions
- **ADR-005 + ADR-006** authoring pending in active sprints
- **A.6.b / A.8.b post-sprint follow-ons** — **A.8.b Spireon credentials (TOKEN, USERNAME, PASSWORD) re-bound to Cloud Run 2026-05-11 session 2 (revision `smartcity-api-00085-pvd`)** using known-good pre-cutover values from Replit vault; verified live (21 vehicles, NSpire authenticated). Vendor rotation via Solera Tier-2 still available as future swap if needed. **A.6.b residual:** `CALENDAR_API_KEY` via BeWith still pending — gated on F-8 dual-key middleware (~14-day `.ics` re-key window). Plus portfolio-level Fire 2 git-history scrub (BFG / git-filter-repo) coordinated across A.6.b/A.8.b.
- **Cutover env-var rebind cluster** (discovered 2026-05-11 session 1; remediation shipped 2026-05-11 session 2) — 2026-05-03 Replit→Cloud Run cutover dropped 30+ env vars referenced in code. **18 vars bound via revision `smartcity-api-00085-pvd` (2026-05-11 session 2):** 10 of 11 Track A silent-drops (MyGov×2, Resend, Pipedrive, Google OAuth×2, admin/bootstrap×4 — `OPENGOV_TRANSPARENCY_KEY` deferred); 6 Spireon Track B (`SPIREON_TOKEN`, `SPIREON_USERNAME`, `SPIREON_PASSWORD`, plus `SPIREON_ACCOUNT_NAME`, `SPIREON_NSPIRE_ID`, `SPIREON_SYSDEVX_ID` — last three not previously in audit); 2 OpenGov family (`OPENGOV_EMAIL`, `OPENGOV_BNP_API_KEY`). **Verified live via Cloud Run logs:** Spireon (21 vehicles, authenticated NSpire Platform), MyGov (12,240 permits), OpenGov BNP (healthy, cache warm). **MYGOV pre-existing Secret Manager debris** discovered during bind: `smartcity-MYGOV_USERNAME` and `smartcity-MYGOV_PASSWORD` already existed in Secret Manager (created 2026-04-04 with v1/v2, never wired to Cloud Run, no IAM grant). Resolved this session via v3 version-add + IAM grant. Audit-doc gap (code-references checked but not Secret Manager state) flagged as lesson — future audits must also enumerate existing secrets via `gcloud secrets list`. **Still pending:** `OPENGOV_TRANSPARENCY_KEY` (Nick couldn't locate in Replit vault — vendor-portal lookup deferred; `/opengov` transparency tables remain dark); Track B remainder (Verkada×2, ESRI/ArcGIS×3, Calendar×1 post F-7/F-8, VFD codes×6 — vendor coordination via Bastrop Monday message); AI_INTEGRATIONS_* code rename (~10 LoC). Postmortem (Remediation status appended 2026-05-11 session 2): [`91_postmortems/2026-05-11_cutover_env_var_silent_drops.md`](91_postmortems/2026-05-11_cutover_env_var_silent_drops.md). Bind procedure runbook (new this session): [`90_runbooks/cutover_env_var_bind_procedure.md`](90_runbooks/cutover_env_var_bind_procedure.md). Raw inventory (binding status updated): [`90_runbooks/smartcity_cloud_run_env_audit_2026-05-11.md`](90_runbooks/smartcity_cloud_run_env_audit_2026-05-11.md).
- **Workspace hygiene investigation** — four wrong-branch / detached-HEAD / shared-working-tree incidents observed across cc-agent-1/2/3 (latest: A.6/A.8 parallel-attempt collision 2026-05-11; every agent recovered cleanly). Runbook now promoted to next-up: `90_runbooks/agent_workspace_hygiene.md` to specify `git worktree add` canonical pattern + recon-time refusal as safety net + branch-naming conventions for parallel dispatches.
- **CI workflow fixes** — Semgrep false positive on `server/routes/mygov.ts:268-270` (`react-insecure-request` rule on GCE metadata server fetch) needs `// nosemgrep:` annotation; Gitleaks workflow 403s on PRs because `GITHUB_TOKEN` lacks `pull_requests: read`.
- **Dead-code cleanup PR** — `client/src/components/layout/{Sidebar,Header,DashboardLayout}.tsx` have zero consumers post-W1.C.1; delete in a follow-on PR.
- **Cloud Run deploy procedure** — Canonical path established 2026-05-11: `gcloud builds submit --config cloudbuild-api.yaml` → `gcloud run deploy --image <registry>:latest --region us-central1` → `gcloud run services update-traffic smartcity-api --to-latest --region us-central1`. **Never `gcloud run deploy --source .`** — see [`90_runbooks/cloud_run_canary_deploy.md`](90_runbooks/cloud_run_canary_deploy.md) 2026-05-11 addendum and [`91_postmortems/2026-05-11_canonical_deploy_drift_and_traffic_pin.md`](91_postmortems/2026-05-11_canonical_deploy_drift_and_traffic_pin.md). gcloud SSL on Nick box still broken; Cloud Shell remains the deploy environment. WS-2 PRs (C.1/C.2/C.3) live via revision `smartcity-api-00083-dss`; W1 follow-on implementations (A.6 PR #12, A.8 PR #11) plus A.7 scoping (PR #13) deployed in revision `smartcity-api-00084-vhr` (2026-05-11, image digest `sha256:a53cd036...`). **Current revision: `smartcity-api-00085-pvd`** (2026-05-11 session 2 — cutover env-var bind spawned via `gcloud run services update --update-secrets`; 100% traffic on LATEST). New bind-procedure runbook: [`90_runbooks/cutover_env_var_bind_procedure.md`](90_runbooks/cutover_env_var_bind_procedure.md).
- **Cloud Run traffic-tag audit** — three tags exist on smartcity-api with 0% traffic: `p0-3-canary` → `smartcity-api-00080-men`, `p0-followup-prophecy` → `smartcity-api-00082-pog`, `w1-c-4a-auth-fix` → `smartcity-api-00084-weg`. The last one silently stranded two 2026-05-11 deploys before discovery; today's 00084-vhr deploy confirmed not stranding. Decision: keep for record or remove. P3 hygiene; see postmortem for context.
- **Unresolved: revision-suffix contradiction across docs** (surfaced 2026-05-11 session 2) — session 1's handoff at end of 2026-05-11 named yesterday's deploy `smartcity-api-00084-vhr`. Session 2's `gcloud run services describe` showed `smartcity-api-00084-weg` as the prior live revision (tagged with `w1-c-4a-auth-fix`, 0% traffic post-cutover-bind). The 2026-05-11 deploy drift postmortem labels `00084-weg` as the May-10 W1.C.4a auth-fix revision that was stranded at 100% via the `w1-c-4a-auth-fix` tag, then unpinned via `--to-latest`. Cloud Run revision suffixes are unique per revision number — at least one of these references is wrong. **No historical doc rewriting performed this session** (deploy drift postmortem labeling, session 1 handoff, current_state prior-revision references all left intact). Investigation queued for next session: full `gcloud run revisions list --service=smartcity-api --region=us-central1 --limit=30 --format="table(name,active,creationTimestamp)"` and reconciliation against deploy-event narratives in session 1 summary + deploy drift postmortem. See session 2 summary Lessons section: [`_sessions/2026-05-11_cutover_env_var_bind_shipped_claude_ai_planner.md`](_sessions/2026-05-11_cutover_env_var_bind_shipped_claude_ai_planner.md).

## References

- [`11_roadmap.md`](11_roadmap.md) — full backlog + milestone roadmap (end-state definition lives here)
- [`30a_smartcity_stabilization_sprint.md`](30a_smartcity_stabilization_sprint.md), [`27_engine_evolution_plan.md`](27_engine_evolution_plan.md), [`42_design_accelerator_program_plan.md`](42_design_accelerator_program_plan.md), [`48_codex_program_plan.md`](48_codex_program_plan.md) — active sprint/program docs
- [`90_runbooks/current_state_protocol.md`](90_runbooks/current_state_protocol.md) — protocol for this snapshot
- [`_sessions/`](_sessions/) — full session history
