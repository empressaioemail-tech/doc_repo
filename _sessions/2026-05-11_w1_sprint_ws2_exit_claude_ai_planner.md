---
id: 2026-05-11_w1_sprint_ws2_exit_claude_ai_planner
title: WS-2 W1 sprint exit — seven items shipped
date: 2026-05-11
agent: claude-ai-planner
repo: doc_repo
session_type: sprint_execution
status: active
rolled_up: true
rolled_up_into: [30a_smartcity_stabilization_sprint, 00_current_state, 11_roadmap]
---

# WS-2 W1 sprint exit — seven items shipped

## Inputs

- Upstream planner brief: "Planner brief — ship WS-2 (W1 sprint)" — seven W1 items, four decisions, three gating prereqs, two cross-workstream coordination points
- Doc-repo orientation: `00_current_state.md` (2026-05-11), `30a` §WS-2 in full, HR-5/HR-8/SR-1 verbatim from `20_agent_operating_rules.md`, recent session summaries
- Fleet: cc-agent-1, cc-agent-2, cc-agent-3, cc-agent-4 (Cursor Claude Code); Replit Agent (design spec parallel artifact)

## Outputs

### Code shipped to smartcity-os origin/main

| Item | Commit / PR | Type | Verified |
|---|---|---|---|
| W1.A.6 | f3c06f1 (findings) + 01fa14e (.replit) | Forensics + secret removal | Yes (rotation partial; A.6.b post-sprint) |
| W1.A.7 | 6d020d4 | Forensics | Yes |
| W1.A.8 | ad0cbf7 (findings) + 93e4da5 (.replit + troubleshooting doc) | Forensics + secret removal | Yes (rotation partial; A.8.b post-sprint) |
| W1.A.9 | 5d126d0 | Forensics + design | Yes (implementation post-sprint per 30a scope) |
| W1.C.1 | PR #10 squash-merged | Implementation (UI design-system alignment) | Yes |
| W1.C.2 | PR #9 squash-merged (8402e66) | Implementation (security: CSP + CORS) | Yes |
| W1.C.3 | PR #8 squash-merged (281126a) | Implementation (resilience: OpenGov BNP hardening) | Yes |

### Decisions captured

1. **W1.C.2 ↔ WS-3 x-internal-ai CORS removal bundling: YES** — same file (`server/app.ts`), small focused edits, single PR. Upstream brief mis-cited SR-1 as the "default bundling" rule; corrected — SR-1 is the Cursor-vs-Replit routing rule; bundling guidance was local to 30a, not lifted from rule-authority.

2. **W1.A.6 / W1.A.8 rotation ownership: WS-2** — pre-decided in 30a §WS-2 ("handle rotation as part of this dispatch"); brief's framing as open question was a re-asking.

3. **W1.A.9 implementation: out of sprint scope** per 30a explicit. Bandwidth didn't override scope discipline.

4. **Sequencing: 4 forensics parallel + 3 implementations interleaved**, A.6 + A.8 to the same agent (cc-agent-1) to serialize `.replit` edits naturally.

5. **W1.C.1 reframed mid-stream** from viewport/layout fix (30a's original hint) to design-system alignment (Nick's actual symptom: "doesn't follow look and feel"). Dispatch revised before fire.

6. **W1.C.2 PR-body framing rewritten** mid-stream after Prophecy iframe blockage identified as third-party-side (their frame-ancestors policy), not our-side. Our CSP fix is a precondition, not a complete solution. Allowlist coordination with Prophecy in progress.

7. **Breadcrumb-in-.replit pattern accepted** (A.6 grep-count-of-1, A.8 grep-count-of-2). Consistent with Fire 4's `scripts/post-merge.sh` "loud-fail header + original-preserved-below" precedent. Defense-in-depth at HEAD; doesn't unleak from git history.

8. **A.8 scope expanded** (vs. strict reading of 30a) to include redaction of SPIREON_TOKEN UUID and password-length hint from `SPIREON_API_TROUBLESHOOTING.md` at HEAD. Matches A.6 precedent: HEAD-strip in-scope, full operational rotation in follow-on. A.8 agent also caught a second token UUID reference on a follow-up pass (line 202) that the first pass missed.

9. **A.6.b and A.8.b post-sprint follow-on tickets scoped** for operational rotation work requiring Bastrop IT + vendor coordination (Solera Tier-2 for Spireon; BeWith for Calendar) plus dual-key middleware (F-8) and ~14-day re-key window for calendar `.ics` subscribers.

10. **Replit Agent design.md** authored as parallel artifact to cc-agent-2's W1.C.1 implementation. Off the shippable-code-push path per SR-1; content authored, awaiting commit from clean tree to smartcity-os.

## Patterns / lessons established

- **Forensics doc design: "recommended fixes as separate table" pattern** (W1.A.7) — vs. fix-column-inside-divergence-table. Cleaner because fixes can legitimately cover multiple divergences (1+11, 4+9). Carry forward for future forensics specs.

- **Design-system architecture observation:** shadcn (`@/components/ui/*`) is the foundation layer; SmartCity tokens (`@/components/smartcity/*` + `lightTheme`/`darkTheme`) is the cohesion layer. Pages compose through the cohesion layer; primitives inside cards can be shadcn. Prophecy bypassed cohesion entirely — that's what "doesn't look like the rest of the platform" meant.

- **Calibration: 30a §WS-2 underspecified leak surfaces.** W1.A.6 spec mentioned CALENDAR_API_KEY rotation without flagging the `.ics` subscriber URL re-key constraint. W1.A.8 spec mentioned SPIREON_USERNAME rotation without flagging that SPIREON_TOKEN UUID (in a committed `.md` file) is the real API auth credential. Future forensics dispatch specs should explicitly invite agents to surface "if more is leaked than spec named, expand scope to redact-at-HEAD per A.6/A.8 precedent and document follow-on in the findings doc."

- **Breadcrumb-at-HEAD pattern for secret removal:** 3-line comment block where the plaintext was, referencing the findings doc. Established by Fire 4's loud-fail pattern; applied in A.6 (`.replit`) and A.8 (`.replit` + troubleshooting doc). Worth a runbook entry.

- **Workspace hygiene incident pattern — three occurrences this sprint:**
  1. cc-agent-3 (A.9) started on `fix/w1-c-3-opengov-bnp-hardening` (orphan branch from prior unsynced state)
  2. cc-agent-1 (A.8) mid-flight HEAD switched to `fix/w1-c-2-csp-and-cors`
  3. cc-agent-2 (C.1) mid-flight HEAD detached to main
  
  Every agent recovered cleanly via cherry-pick or fast-forward. Pattern points to underlying coordination gap (shared working directory between agents, Cursor IDE auto-checkout, hook, or similar). Worth post-sprint investigation.

- **CI workflow issues surfaced (not introduced this sprint, pre-existing on main):**
  - Semgrep persistent false positive on `server/routes/mygov.ts:268-270` (GCE metadata server HTTP fetch flagged by `react-insecure-request` rule)
  - Gitleaks 403 on all PR runs (workflow `GITHUB_TOKEN` lacks `pull_requests: read` permission)

## Outstanding — forwarded to next session

### Post-sprint follow-on tickets to scope/file

- **W1.A.6.b** — Calendar rotation completion: F-8 dual-key middleware, Cloud Shell rotation, 14-day `.ics` re-key window, old-key disable, git-history scrub coordination with A.8.b
- **W1.A.8.b** — Spireon rotation completion: SPIREON_TOKEN via Solera Tier-2 (most urgent), SPIREON_USERNAME + SPIREON_PASSWORD rotation, Cloud Shell + Cloud Run cutover, git-history scrub coordination with A.6.b, identity-field review for troubleshooting doc lines 13–16, F-2 mapDepartment 5-LoC reorder
- **W1.A.6 implementation follow-on** — actually fix calendar visibility per findings
- **W1.A.7 implementation follow-on** — fix 11 Power BI divergences; requires strategic call first (align OS recompute to PBI logic vs. have OS read PBI visuals directly)
- **W1.A.8 structural fixes** — F-1 (DB-driven department override), F-3 (active-flag visibility toggle), F-4 (retry + last-known-good fallback), F-5 (shared cache vs per-instance), F-7 (SPIREON username/password rotation), F-8 (diagnostic logs for disappearing assets), F-9 (`requireTenant` audit on loopback)
- **W1.A.8 catalog deliverable** — data-blocked pending Bastrop IT + Spireon vendor pulls
- **W1.A.9 implementation** — build the daily health-watch email (~7.5h V1)
- **Portfolio-level Fire 2 git-history scrub** — BFG / git-filter-repo on smartcity-os; distinct from internals (HEAD removal, done) and externals (vendor rotation, A.6.b + A.8.b)
- **Dead-code cleanup PR** — delete `client/src/components/layout/{Sidebar,Header,DashboardLayout}.tsx`; zero consumers post-C.1
- **Cloud Run deploy gate** — confirm auto-CD on main merges, OR trigger Cloud Shell deploy to land C.1+C.2+C.3 in Bastrop
- **Replit Agent design.md commit** — `_research/w1_c_1_prophecy_design_spec.md` authored; awaits clean-tree commit to smartcity-os

### Operational items on Nick

- **gcloud SSL fix on Nick box** — still broken; Cloud Shell workaround used all sprint. Carry-forward.
- **Prophecy allowlist coordination** with the third party — message out per Nick; awaiting response.

### Workspace + CI hygiene

- Investigate three wrong-branch incidents; scope `90_runbooks/agent_workspace_hygiene.md`
- Clean up defunct local branches on Nick's smartcity-os clone: `fix/w1-c-1-prophecy-look-and-feel`, `fix/w1-c-2-csp-and-cors`, `fix/w1-c-3-opengov-bnp-hardening` (all squash-merged)
- Semgrep: silence `react-insecure-request` finding on `mygov.ts:268-270` (metadata server exempt)
- Gitleaks: grant `pull_requests: read` to workflow `GITHUB_TOKEN`

### Remaining 30a workstreams

- **WS-1 migration spine** — Phase 2A (smartcity-os → Empressa Neon), Phase 2B (Cloud Run cutover), Phase 2C (closure / engine factor-out unblock)
- **WS-3 security sweep** — remaining items beyond x-internal-ai CORS removal already bundled into C.2
- **WS-4 schema / multi-tenancy** — ADR-005 migration, MyGov raw-records audit; coordinate test isolation footgun pattern with Codex/Cortex track

## References

- `30a_smartcity_stabilization_sprint.md` — sprint plan (status updated this commit)
- `00_current_state.md` — snapshot (regenerated this commit)
- `11_roadmap.md` — milestone tracking (W1 sprint criterion flipped this commit)
- `20_agent_operating_rules.md` — HR-5, HR-8, SR-1 verbatim referenced during dispatch authoring
- `_research/w1_a_6_calendar_event_visibility.md`, `w1_a_7_power_bi_accuracy.md`, `w1_a_8_police_units_spireon.md`, `w1_a_9_health_watch_email.md`, `w1_c_1_prophecy_design_spec.md` (pending commit) — all in smartcity-os
- smartcity-os PRs: #8 (C.3), #9 (C.2), #10 (C.1) — all squash-merged
