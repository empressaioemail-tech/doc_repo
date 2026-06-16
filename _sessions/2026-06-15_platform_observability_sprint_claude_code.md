---
id: 2026-06-15_platform_observability_sprint
title: Session — platform observability sprint (parallel lane) + stale-clone caveat
date: 2026-06-15
kind: session
agent: claude_code (parallel planner, observability lane)
related: [76e_platform_observability_sprint, 76a_operator_autonomous_loops, 76b_gtm_engine_polish_sprint, 90_runbooks/steward_daily_digest, 30a_smartcity_stabilization_sprint, 31a_bastrop_maintenance_sprint, 00_current_state, 00c_portfolio_master_map]
---

# Session — platform observability sprint (parallel lane)

Ran as a second parallel planner lane while the primary session owned the `_inbox` sweep, `00_current_state`, and the spine/extraction/migration work. Task: scope the dev/operator monitoring plus self-healing automation sprint (the maintenance half of the 76a loop, flagged in 00c sections 5 and 10 as designed-not-built), produce a sprint doc plus QUEUED cc-agent dispatches, and commit only my own new docs.

> **Read this caveat first.** The entire session ran against a git clone the shared workspace had rewound to a 2026-06-07 state, and my first gcloud calls returned stale ~2026-06-07 infra data, while the real calendar date is 2026-06-15. So the sprint was planned against an 8-day-stale snapshot and a stale infra view. The work was committed before this was discovered and is left in place per operator decision (not superseded, not re-dated). The "What is actually stale or already done" section below is the load-bearing part of this record.

## What was produced (committed to origin/main)

- [`76e_platform_observability_sprint.md`](../76e_platform_observability_sprint.md) — the maintenance-loop build sprint (sibling to 76b, the GTM-loop build sprint). Verified-surface section, monitoring domains, a Tier-0-auto vs alert-only boundary, three build targets (health endpoints, native Cloud Monitoring uptime/alerts, a central health-watch aggregator), a pinned signal-emit contract, a pre-fire plus Wave A / Wave B fire order. Premortem cleared GREEN (load-bearing commitments clean on two conditions written as hard rules: city-operational-data deletion stays human-gated; native Cloud Monitoring over any paid vendor).
- Four cc-agent dispatches, fire-ready: cc-agent-C observability hub plus cortex/api-server health (`legacy-design-tools`), cc-agent-M MCP-gate probe plus hauska-prod uptime (`hauska-mcp-server`), cc-agent-E retrieval-api healthz (`hauska-engine`), cc-agent-M smartcity W1.A.9 health-watch plus scraper-result monitoring (`empressaio_tech_smartcity_os`).
- Operator decisions baked in: Tier-0 auto-remediation ships in alert-then-suggest mode (operator call); native Cloud Monitoring email is the working channel default.
- [`90_runbooks/steward_daily_digest.md`](../90_runbooks/steward_daily_digest.md) maintenance section automated by the health-watch aggregator (marked deploy-pending).

Commits: `65d1801` (initial), `23dce94` (fire-ready), `9542d14` (Wave A landed). All on origin/main (`9542d14` is an ancestor of the current tip).

## Wave A landed and was triaged

Both Wave A dispatches came back code-complete, held for merge: cc-agent-M PR #27 (hauska-mcp-server: `/healthz`, `/gate-probe`, uptime checks and alert policies LIVE, 245 tests) and cc-agent-C branch `cortex/observability-hub` (normalized `/api/healthz`, daily aggregator, 8 tests). Both agents enabled the Cloud Scheduler API on their projects. Two live findings surfaced: cortex-api revision drift, and a degraded mcp `/health` reporting its dependencies down. (Both need re-checking against the current revisions; see below.)

## Incidents handled in-session

- **Commit-hazard recurrence.** The first commit swept in a concurrent GTM agent's five files staged in the window between my explicit `git add` and `git commit`. Caught it local (not pushed), `git reset --mixed HEAD~1`, re-committed with an explicit `git commit -- <paths>` pathspec that bounds the commit regardless of index races. Memory updated ([[doc-repo-concurrent-commit-hazard]]).
- **Doc-slot collision.** A parallel GTM session also grabbed `76d`. I yielded 76d to 76e touching only my own files; the GTM session then cooperatively moved its doc to 76d to fill the gap. No collision remains.

## What is actually stale or already done (the reconciliation)

Verified live against gcloud at session end (2026-06-15). The live world is 8 days ahead of what I planned against:

- **Deploy is not deferred.** The build-out plus Miami arc has been merged and deployed to prod since 2026-06-09. The sprint's central "land monitoring before the deferred deploy" rationale is stale.
- **engine-api exists and was never enumerated.** Live `hauska-prod-497015` has three Cloud Run services, not two: `hauska-engine-api` (the reasoning service, all four engines on the spine) alongside `hauska-mcp-server` and `hauska-retrieval-api`. Any real monitoring spec must cover seven services, not six.
- **Revisions moved.** Live now: cortex-api `00169-jep` @ 100% with a `00171-wek` canary; mcp-server `00007-njc`; retrieval-api `00006-2lq`. My in-session gcloud had returned the stale `00004`/`00090` set, which is what the cortex-api "revision drift" finding was actually reading.
- **Tool count is 57, not 46** (already a tracked correction in the canonical state).
- **The work largely already exists.** retrieval-api `/healthz` was already built as hauska-engine #68 (merged 2026-06-10) so the cc-agent-E dispatch duplicates it; cc-agent-M PR #27 and the test alert policy `8570526367601301438` are real and live now; the 2026-06-15 `00_current_state` already references PR #27 and policy 8570 as "stale deploy residues."

Net: 76e and its dispatches describe a sprint that, in the true timeline, is substantially already done or in-flight, scoped against a snapshot that has since changed materially (deploy done, engine extraction done, M-Stabilize hold released, Cotality solved).

## Open items for the next session / primary lane

- **Reconcile 76e against 2026-06-15 reality** if any of it is taken forward: add `hauska-engine-api` as a monitored service, drop the deferred-deploy framing, and dedupe against hauska-engine #68 (retrieval healthz) and mcp #27 (gate probe / uptime). Left in place, not superseded, per operator.
- **Delete the orphaned test alert policy `8570526367601301438`** (`hauska-prod-497015`, still enabled, flagged as a residue in `00_current_state`). It is a live-infra mutation, held for an explicit operator go.
- The two Wave A findings (cortex revision drift, degraded mcp `/health`) should be re-evaluated against the current `00169`/`00007` revisions and the imminent convergent deploy (#178 to #182), not the stale revisions they were read against.

## Process note

This session is the case for reading `00_current_state` freshly from the live tree before planning, not from a clone that may have been rewound by a concurrent agent, and for sanity-checking gcloud output against the canonical snapshot when the two disagree. The git history on the shared `main` is being moved by multiple writers; verify `origin/main` tip and `merge-base --is-ancestor` before trusting local HEAD.

## Note on scope

Did not touch `00_current_state.md` or sweep `_inbox` (primary session owns both). Did not regenerate the snapshot. This record is the parallel lane's own session close.
