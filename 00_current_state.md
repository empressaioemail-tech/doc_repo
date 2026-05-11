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

- **Fire 2** — plaintext secrets in `.replit`. WS-2 internals (`CALENDAR_API_KEY`, `SPIREON_USERNAME`/`SPIREON_TOKEN`/`SPIREON_PASSWORD`, plus `SPIREON_API_TROUBLESHOOTING.md` token UUID + password-length hint) redacted at HEAD 2026-05-11 via A.6/A.8 commits to smartcity-os main. Operational rotation for those secrets carries forward as **A.6.b / A.8.b** post-sprint follow-ons (Bastrop IT + Solera Tier-2 + BeWith coordination required). WS-3 internals (`Admin123!` literals ×3, `POWERBI_REPORT_ID` audit, `USER_RESET_EMAIL` PII) still pending. External rotations (Esri, Verkada, VFD codes) held for Bastrop IT engagement. Portfolio-level git-history scrub (BFG / git-filter-repo) carries forward separately. Owner: Nick + agent.
- **Fire 3** — legacy-design-tools `post-merge.sh` Neon-guard verification. Open. Owner: Nick (browser). Likely moot after [`42`](42_design_accelerator_program_plan.md) Phase 1 clears.

(Fire 1 closed 2026-05-10. Fire 4 closed pending workspace rename. Fire 5 closes at M-Stabilize Phase 2C cutover.)

## 2. In-flight sprints

- **[`30a_smartcity_stabilization_sprint.md`](30a_smartcity_stabilization_sprint.md)** — SmartCity OS — phase 1 of 4 — last update 2026-05-11
  - Owner agent: TBD (3 workstreams remaining: WS-1 migration spine, WS-3 security sweep remainder, WS-4 schema/multi-tenancy)
  - Status: **WS-2 verified 2026-05-11** (seven W1 items shipped via smartcity-os PRs #8/#9/#10 + four forensics findings docs; A.6/A.8 rotation work continues as A.6.b/A.8.b post-sprint). WS-1, WS-3 (remaining items beyond x-internal-ai CORS removal already bundled into C.2's PR #9), and WS-4 still pending. Cross-cutting prereqs (gcloud SSL, clone refresh, ADR-005 migration, Neon quota) still need clearing for Phase 2A.
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

- **2026-05-11 — Smartcity-thread: deploy recovery + canonical Dockerfile path** — WS-2 PRs #8/#9/#10 actually serving Bastrop production via revision `smartcity-api-00083-dss`; canary-runbook addendum, deploy postmortem landed; A.6/A.7/A.8 implementation queued for next session.
- **2026-05-11 — Smartcity-thread: WS-2 W1 sprint exit** — seven W1 items shipped (PRs #8/#9/#10 + four forensics docs); A.6/A.8 rotation work continues as A.6.b/A.8.b post-sprint.
- **2026-05-11 — Orchestrator: roadmap revision + orientation runbooks** — milestone framing landed; snapshot pattern adopted; session-close template updated.
- **2026-05-11 — Codex/Cortex program plans** — 27 + 42 + 48 drafted with audit pass; Stream G brand migration added; DA-Test-Iso added.
- **2026-05-11 — SmartCity Stabilization Sprint finalized** — 30a + 33 stub landed; cross-track interfaces sectioned.

## 6. Cross-cutting watch list

- **Brand migration** (Plan Review → Codex; Design Accelerator → Cortex) — [`27`](27_engine_evolution_plan.md) Stream G; gated on legacy-design-tools PR #17 landing
- **M4-B → Codex 1b interface** — stub at [`33_smartcity_codex_1b_integration.md`](33_smartcity_codex_1b_integration.md); full spec deferred to post-M-Stabilize coordination
- **Test isolation patterns** — [`42`](42_design_accelerator_program_plan.md) DA-Test-Iso (legacy-design-tools) and [`30a`](30a_smartcity_stabilization_sprint.md) WS-4 (smartcity-os MyGov audit) are the same footgun shape across two repos; coordinate findings
- **Migration sprint Phase 2** absorbed into [`30a`](30a_smartcity_stabilization_sprint.md) WS-1; [`12_migration_sprint.md`](12_migration_sprint.md) retains canonical phase definitions
- **ADR-005 + ADR-006** authoring pending in active sprints
- **A.6.b / A.8.b post-sprint follow-ons** — operational secret rotation for Calendar (`CALENDAR_API_KEY` via BeWith, F-8 dual-key middleware, ~14-day `.ics` re-key window) and Spireon (`SPIREON_TOKEN` via Solera Tier-2 most urgent, plus `SPIREON_USERNAME`/`SPIREON_PASSWORD`); requires Bastrop IT + vendor coordination. Plus portfolio-level Fire 2 git-history scrub (BFG / git-filter-repo) coordinated across A.6.b/A.8.b.
- **Workspace hygiene investigation** — three wrong-branch / detached-HEAD incidents observed across cc-agent-1/2/3 during WS-2 dispatches (every agent recovered cleanly). Underlying coordination gap (shared working directory, IDE auto-checkout, hook, or similar) worth scoping `90_runbooks/agent_workspace_hygiene.md`.
- **CI workflow fixes** — Semgrep false positive on `server/routes/mygov.ts:268-270` (`react-insecure-request` rule on GCE metadata server fetch) needs `// nosemgrep:` annotation; Gitleaks workflow 403s on PRs because `GITHUB_TOKEN` lacks `pull_requests: read`.
- **Dead-code cleanup PR** — `client/src/components/layout/{Sidebar,Header,DashboardLayout}.tsx` have zero consumers post-W1.C.1; delete in a follow-on PR.
- **Cloud Run deploy procedure** — Canonical path established 2026-05-11: `gcloud builds submit --config cloudbuild-api.yaml` → `gcloud run deploy --image <registry>:latest --region us-central1` → `gcloud run services update-traffic smartcity-api --to-latest --region us-central1`. **Never `gcloud run deploy --source .`** — see [`90_runbooks/cloud_run_canary_deploy.md`](90_runbooks/cloud_run_canary_deploy.md) 2026-05-11 addendum and [`91_postmortems/2026-05-11_canonical_deploy_drift_and_traffic_pin.md`](91_postmortems/2026-05-11_canonical_deploy_drift_and_traffic_pin.md). gcloud SSL on Nick box still broken; Cloud Shell remains the deploy environment. WS-2 PRs (C.1/C.2/C.3) live in Bastrop via revision `smartcity-api-00083-dss` as of 2026-05-11.
- **Cloud Run traffic-tag audit** — three tags exist on smartcity-api with 0% traffic post-2026-05-11: `p0-3-canary` → `smartcity-api-00080-men`, `p0-followup-prophecy` → `smartcity-api-00082-pog`, `w1-c-4a-auth-fix` → `smartcity-api-00084-weg`. The last one silently stranded two May 11 deploys before discovery. Decision: keep for record or remove. P3 hygiene; see postmortem for context.

## References

- [`11_roadmap.md`](11_roadmap.md) — full backlog + milestone roadmap (end-state definition lives here)
- [`30a_smartcity_stabilization_sprint.md`](30a_smartcity_stabilization_sprint.md), [`27_engine_evolution_plan.md`](27_engine_evolution_plan.md), [`42_design_accelerator_program_plan.md`](42_design_accelerator_program_plan.md), [`48_codex_program_plan.md`](48_codex_program_plan.md) — active sprint/program docs
- [`90_runbooks/current_state_protocol.md`](90_runbooks/current_state_protocol.md) — protocol for this snapshot
- [`_sessions/`](_sessions/) — full session history
