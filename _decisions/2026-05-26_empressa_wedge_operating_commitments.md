---
id: 2026-05-26_empressa_wedge_operating_commitments
title: Empressa wedge operating commitments — $500M base, loops, legal up front
date: 2026-05-26
status: active
owner: nick
related: [76_empressa_wedge_90d_operating_plan, 76a_operator_autonomous_loops, 75_hauska_brokerage_workflow_plan, 72_hauska_inc_operations, 13_risk_register]
---

# Decision: Empressa wedge operating commitments

## Context

Strategic planning session reconciled (1) Hauska Property Brief Phase 0 engineering state, (2) Empressa browser extension / AI GTM business plan, and (3) two operator loop patterns (maintenance + GTM). Need a single base plan to $500M ARR in five years with a 90-day executable scaffold.

## Decisions

### D1 — $500M ARR year 5 is the base plan

Reverse-engineered yearly targets: Y1 ~$1M, Y2 ~$10M, Y3 ~$55M, Y4 ~$175M, Y5 ~$500M. Capital assumption $80–100M through end of Y2. Geographic: TX depth Y1; FL/AZ by month 9 Y1; CA Y3.

### D2 — One wedge product line

Property Brief (extension + `cortex-api` brokerage API) evolves into the Empressa browser wedge. No permanent fork of "Brief" vs "viral extension." Empressa brand on wedge; Hauska on substrate, MCP, enterprise API.

### D3 — Legal and protections before paid revenue

No paid brokerage pilot without: signed pilot agreement, bound E&O (data provider + AI), published ToS/Privacy, consistent disclaimers. No public share cards or graph contribution without consent UI and share-page terms. IP/data-licensing memo in flight by day 90.

### D4 — GTM observation layer before GTM workers

Consent flags first-class on all GTM events. Build `gtm_events` + graph edges in days 1–14. Workers phased per [`76a_operator_autonomous_loops.md`](../76a_operator_autonomous_loops.md); deal-flow worker is log-only in first 90 days.

### D5 — Dual operator loops in 90-day scaffold

Maintenance loop scoped to cortex-api, extension, MCP deploy health. GTM loop scoped to extension/brief events. Steward = planner digests until automated steward ships. Both loops run parallel to wedge deploy, not after.

### D6 — Brokerage pilots map to Team tier

Pilot fee ($2.5–5K / 30 days) is Team annual prepay narrative, not a separate commercial SKU.

### D7 — Persona seed (90 days)

Agents (Valerie / eXp design partner) and investors (50 hand-placed Austin) in parallel. Buyers/remodelers deferred past day 90.

## Reversal criteria

- Revisit D1 if Y1 exits below $500K ARR run-rate and pipeline below $100K without corpus or legal blocker named.
- Revisit D3 if E&O market unavailable: pause paid pilots, free tier only, until coverage bound.
- Revisit D4 if counsel flags graph product as blocked: institutional track pauses; wedge subs continue without share graph.

## Owners

| Item | Owner |
|------|-------|
| 90-day wedge deploy | Nick + cc-agent-C |
| Legal stack | Nick + counsel |
| Loop observation schemas | cc-agent-C + planner |
| Corpus depth | cc-agent-E |
| Steward digests | planner |

## Related artifacts

- [`76_empressa_wedge_90d_operating_plan.md`](../76_empressa_wedge_90d_operating_plan.md)
- [`76a_operator_autonomous_loops.md`](../76a_operator_autonomous_loops.md)
