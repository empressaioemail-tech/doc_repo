---
id: 23_dev_setup_assessment
title: Dev setup assessment — AI-first
status: active
last_updated: 2026-05-05
applies_to: portfolio
related: [10_ground_truth, 15_replit_neon_ownership_advisory, 20_agent_operating_rules, 21_ai_first_dev_flow, 2026-05-05_track_b_deploy_saga]
---

# AI-First Dev Setup — Honest Assessment + Path Forward

> **Living strategic doc.** Revisit cadence: quarterly, or on major
> triggers (new product, hire, tool adoption decision, infrastructure
> migration completion). The body below is the 2026-05-05 baseline
> assessment written immediately after the Track B saga. Updates land
> as new sections (e.g., "2026-Q3 update: …") rather than overwriting
> earlier reasoning — preserving why decisions looked right at the
> time matters when re-evaluating them later.

**Date originated:** 2026-05-05
**Trigger:** 12-hour Track B deploy saga revealed structural issues that rules alone won't fix.
**Audience:** Nick. Strategic doc; periodic re-read during build-out.

---

## The honest read on today

The 6-agent setup did not cause today's saga. The saga's three failure categories were:

1. **Tool abstraction failures** (Replit local-main drift, Replit-managed Neon, post-merge.sh hidden behavior, schema sync split between TS and SQL) — would have happened regardless of agent count
2. **Agent coordination failures** (contradictory recon, lost-commit Replit Agent behavior, velocity-without-verification) — partially solved by rules, partially by tooling change
3. **Verification gaps** (no immediate post-deploy probes) — entirely a process problem, fixable today

Of these, only Category 2 has a meaningful agent-setup component. Category 1 is the dominant cost, and it doesn't matter if you run 6 agents, 1 agent, or zero — the tools fight the work in the same ways.

**Conclusion:** the marginal value of "better agent setup" is real but limited. The marginal value of "decouple from Replit + own your infrastructure" is large. Both need to happen; one is foundational.

---

## Will the Cloud Run + Empressa Neon migration help?

Yes, substantially. Naming what it actually solves:

**Solved by Cloud Run migration:**
- Replit local-main vs origin-main drift (deploys read directly from GitHub SHA — no local-tree concept)
- Bundle staleness ("dist/index.mjs from prior deploy" served because of cache invalidation issues — Cloud Run revisions are immutable)
- Build scope ambiguity (Dockerfile or buildpacks declare exactly what builds and runs, no inference)
- Runtime entry inference (Cloud Run requires explicit run command; no `[deployment.run]` mystery)
- Build/deploy pipelines opaque (Cloud Build logs are first-class; can be programmatically scraped by agents)

**Solved by Empressa Neon migration:**
- DB ownership / console access
- DDL audit visibility (Neon's branch operation log is yours)
- Team auth (you can grant per-person roles)
- Backup discipline (Neon point-in-time recovery is yours to manage)
- Post-merge.sh / drizzle-kit push catastrophes against production (you own the credentials, you control which environments get touched)

**Solved by GitHub Actions CI:**
- Build pipelines tested before merge (PR fails if anything's broken — today's PORT and wasm bugs would have been caught at PR time)
- Schema migrations applied via journaled drizzle migrate, not push
- Deploy-time route-reachability smoke tests (CI hits the new endpoint and fails the deploy if it doesn't return JSON)

**NOT solved by the migration:**
- Schema management discipline (you still have to choose: push vs migrate; that's a process decision, not a tool one)
- Multi-agent coordination patterns
- Verification gaps in the planner's reasoning (that's me; rules document covers it)
- Recon contradictions (still need GitHub-as-tiebreaker pattern)

So the migration sprint is genuinely high-leverage. ~2.5 dev-days for legacy-design-tools + a half-day to apply the same pattern to SmartCity OS = roughly 3 days that buy back probably 50-80% of the deploy-related friction we hit today, ongoing.

Migration plan detail lives in [`15_replit_neon_ownership_advisory.md`](15_replit_neon_ownership_advisory.md).

---

## Optimal AI agent setup — what I think is right

The 6-agent setup is fine; the issue is role clarity, not headcount. The
operational structure now lives in [`21_ai_first_dev_flow.md`](21_ai_first_dev_flow.md);
the analysis below is the *why* behind that structure.

### What works in the current setup

- **4 Cursor Claude Code agents in parallel.** This IS the right shape. Cursor agents push reliably to origin, work against local clones, see ground truth. The parallel work pattern (recon while another agent executes) is correct.
- **Cursor manual.** Human-in-loop has its place; this is the right exit valve.
- **Claude.ai planner (this conversation).** The cross-agent coordination layer is genuinely valuable. Today's saga had multiple moments where I (the planner) had to reconcile contradictory agent reports — that's the planner's job. Without it, the contradictions would have been resolved ad-hoc by Nick eyeballing it.

### What needs to change

- **Replit Agent's role.** Currently used for too much. The agent is fine for in-IDE exploration and Repl-local operations (runtime logs, DB queries via secrets, file viewing inside the Repl). It is NOT reliable for code changes that need to ship. Today: the vite.config.ts fixes were applied by Replit Agent and never reached origin; the fix had to be redone by a Cursor agent.

  **Codified as:** HR-2 (committed ≠ pushed) and SR-1 (default to Cursor for shipping code) in [`20_agent_operating_rules.md`](20_agent_operating_rules.md).

- **The implicit assumption that "agent says done" = "shipped".** Today, multiple times, an agent reported completion and we proceeded as if the change was live. Production state was different. The planner needs to gate "moving to next step" on verification, not on agent reports.

  **Codified as:** HR-3 (deploy success ≠ feature live), HR-9 (don't sequence dependent sprints on agent completion reports) in [`20_agent_operating_rules.md`](20_agent_operating_rules.md).

- **Recon prompt template hygiene.** Today's contradictory recon ("Track B exists" / "Track B doesn't exist") happened because the recon prompts didn't require verification artifacts. A recon report saying "I confirmed X" is unfalsifiable; "I confirmed X via this verbatim git log output" is checkable.

  **Codified as:** HR-8 (recon needs verification artifacts in same response) in [`20_agent_operating_rules.md`](20_agent_operating_rules.md).

### What headcount/setup looks like in 6 months

After the infrastructure migration:

- **Cursor Claude Code (4 agents)** — same as now, primary code execution. Some of these can specialize: one frontend-focused, one backend, one tests/CI, one infra. Soft specialization, not enforced.
- **GitHub Actions** — replaces the "deploy by clicking Redeploy" workflow. Reduces planner attention to deploy mechanics; planner can focus on architecture.
- **Cursor manual** — human-in-loop for ambiguous fixes. Less needed once CI catches more bugs at PR time.
- **Replit Agent (or whatever replaces it)** — IDE/repl exploration only. May go away entirely if you adopt Codespaces or a local-only dev flow.
- **Claude.ai planner** — strategic planning, cross-agent coordination, contradiction resolution, doc generation. Same role.

Total: still ~6 agents nominally engaged, but with cleaner role boundaries. The planner spends less time on tactical "did the deploy work" and more on architectural questions.

### What headcount probably should NOT be

You don't need more agents. The marginal value of a 7th or 8th agent is low; coordination overhead grows superlinearly. If you find yourself wanting more, the right move is usually "specialize one of the existing agents harder," not "add another."

This is also baked into [`21_ai_first_dev_flow.md`](21_ai_first_dev_flow.md) as the explicit fleet-sizing rationale.

---

## Container-based dev environment — defer, but consider

Devcontainers / GitHub Codespaces / nix-shell would solve the "cente box vs Nick box" gcloud-path divergence in [`22_workstation_inventory.md`](22_workstation_inventory.md). Every agent and workstation gets the same environment, including identical paths, identical SDK versions, identical secret bindings.

About a day to set up properly. Pays back in:
- Fewer "works on my box, fails on yours" debugging cycles
- Cleaner agent prompts (paths are universal)
- Easier onboarding when Valerie/Kendra need to run anything locally

I'd defer this until after the Cloud Run migration. Doing it concurrently is too much change at once. But put it on the next-quarter list.

---

## What rules can and cannot do

The new [`20_agent_operating_rules.md`](20_agent_operating_rules.md) covers Categories 2 and 3 (coordination, verification). Specifically it codifies:

- HR-1 through HR-10: hard rules on git/deploy/schema/agent-trust
- SR-1 through SR-4: soft defaults
- Multi-agent coordination: role taxonomy, verification chains, contradiction resolution
- Process changes for the planner specifically (PC-1 through PC-5)

What rules WON'T do:
- Make Replit's deploy abstraction work correctly
- Give you Neon console access
- Fix the tool's behavior

But they will reduce the agent-coordination friction and the verification gaps. Roughly, I'd expect a future deploy saga to consume 1/3 to 1/2 the time today's did, even on Replit, IF the rules are followed. The rules are not a substitute for the migration.

---

## The recommendation

Three layers, in order. As of 2026-05-05, Layer 1 substantially completed during the docs-repo bootstrap; Layers 2 and 3 still pending.

### Layer 1 — Today: rules + immediate fires (~complete as of 2026-05-05)

1. ~~Save `AGENT_OPERATING_RULES_v2.md` to project knowledge~~ — done as [`20_agent_operating_rules.md`](20_agent_operating_rules.md)
2. ~~Save the postmortem + runbook + advisory~~ — done as [`91_postmortems/2026-05-05_track_b_deploy_saga.md`](91_postmortems/2026-05-05_track_b_deploy_saga.md), [`90_runbooks/replit_deploy.md`](90_runbooks/replit_deploy.md), [`15_replit_neon_ownership_advisory.md`](15_replit_neon_ownership_advisory.md)
3. **Pending:** Land the post-merge.sh Neon guard via Replit project_task (Fire 3 from [`10_ground_truth.md`](10_ground_truth.md)). Verification needed via GitHub web UI before deciding whether to ship a one-file PR.
4. **Pending:** Ship Track B end-to-end via Revit smoke + Track C rebase
5. **Pending:** Ship the W1.C.4a auth-fix dispatch on SmartCity OS (Fire 1)

### Layer 2 — This week: infrastructure migration sprint (~3 days of work, not yet started)

1. Provision Empressa-owned Neon project for legacy-design-tools (and SmartCity OS — region `us-central1` to close the cross-region hop)
2. Containerize api-server build via Dockerfile
3. Set up GitHub Actions: PR CI + main → Cloud Run deploy
4. Migrate data from Replit-managed Neon to Empressa Neon
5. Cut over: legacy-design-tools first, then SmartCity OS
6. Decommission Replit deploys; Repl becomes IDE/agent sandbox only
7. Adopt Drizzle migrate (journaled) instead of push

This eliminates ~60% of the deploy friction class. Detail in
[`15_replit_neon_ownership_advisory.md`](15_replit_neon_ownership_advisory.md).

### Layer 3 — Next quarter: dev environment standardization (~1 day of work)

1. Devcontainer / Codespaces setup
2. Workstation parity (cente box / Nick box / future team members)
3. Local-first dev flow with deploy-on-merge

Quality-of-life improvement; not urgent but pays back over time.

---

## What I'm not recommending

- **Switching off Replit entirely.** Replit's IDE + agent loop is genuinely productive for in-browser work. The problem is using Replit AS the deploy target, not using Replit at all. Keep the Repl as a development sandbox, just stop pointing prod traffic at it.
- **Adding more agents.** 6 is enough. The marginal complexity of more agents exceeds the marginal throughput.
- **Migrating SmartCity OS first.** Legacy-design-tools is pre-launch and lower-risk; do it first to develop the migration playbook, then apply learnings to SmartCity OS which has live Bastrop users. (Note 2026-05-05: SmartCity OS is now on Cloud Run already; the remaining migration work for SmartCity OS is just the Empressa Neon swap, which is smaller scope than the original assumption.)
- **Adopting microservices.** You don't have a service-boundary problem; you have a deployment-target problem. The api-server stays as one service.

---

## Specific commitments from me (the Claude.ai planner)

I'm naming these so they're auditable on me:

1. I will inline pre-deploy sync commands in every "click Redeploy" instruction. Not "see runbook" — actual commands.
2. I will include curl-probe verification in every deploy turn. Not "Nick will smoke test."
3. When agent recon contradicts, I will ask for screenshot of GitHub web UI immediately. Not "let me re-prompt the agent."
4. After three distinct deploy failures in 4 hours, I will pause for assessment. Not patch the next layer.
5. I will write same-day postmortems on issues consuming > 4 hours. Not defer.
6. I will route code changes that need to ship to Cursor agents, not Replit Agent. Replit Agent for Repl-local ops only.

These are also in [`20_agent_operating_rules.md`](20_agent_operating_rules.md) as PC-1 through PC-5, but worth saying explicitly here as the original commitment record.

---

## When to revisit this doc

- After the Cloud Run + Empressa Neon migration completes (revisit assumptions about deploy friction)
- After 3 months of Layer 1 + Layer 2 changes (audit which rules got followed, which got ignored, why)
- Before starting any new product (apply lessons learned from day 0, don't auto-provision Replit-managed databases)
- When considering hiring/growing the team (rules need adjustment when more humans are involved)

When revisiting, append a new dated section (e.g., "## 2026-Q3 update")
rather than overwriting the analysis above. The original reasoning stays
visible so quarterly course-corrections are auditable.
