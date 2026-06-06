---
id: 79_competitive_execution_system
title: Competitive execution system — moat acceleration operating model
status: active
last_updated: 2026-05-27
applies_to: portfolio
related: [00_current_state, 01a_atom_conventions, 20_agent_operating_rules, 21_ai_first_dev_flow, 43_cortex_qa_backlog, 51_substrate_v1_sprint, 77_place_graph_strategy]
owner: nick
---

# Competitive execution system

Purpose: run a repeatable process that compounds strategic advantage faster than peers by shipping verified capability and converting each cycle into durable institutional knowledge.

This is an operating model for R and D and development. It is not a new product line and not a replacement for the Hauska substrate.

## Strategic constraint

Primary moat expression remains the place graph and cited reasoning layer in [`77_place_graph_strategy.md`](77_place_graph_strategy.md). Any process work here must improve that shipping velocity and reliability.

## Operating system (single loop)

1. Decide the target outcome and explicit kill list.
2. Resolve required atoms and risk assumptions.
3. Run recon and collect verbatim evidence.
4. Execute in small PR slices with hard acceptance criteria.
5. Verify in runtime with probes, not just tests.
6. Capture reusable knowledge as atoms and templates.

No stage can be skipped without an explicit operator call.

## Two-lane allocation

| Lane | Allocation | Mission | Exit signal |
|---|---|---|---|
| Lane A | 80% | Customer-facing moat shipping (place, code, dossier, retrieval quality) | Verified prod improvement |
| Lane B | 20% | R and D process leverage (dispatch quality, benchmark corpus, red-team, automation) | Improved first-pass success and lower rework |

Lane B can only run if Lane A weekly outcomes are still on track.

## Weekly cadence

| Day | Cadence item | Output |
|---|---|---|
| Monday | Pick 3 outcomes, define kill list | Weekly slate and priority cut |
| Tue-Thu | Two ship blocks + one verify block daily | PRs, probes, evidence artifacts |
| Friday | Scoreboard review and rule updates | One promoted playbook atom, one killed item |

## Hard quality gates

- Every output that informs decisions carries source, confidence, and as-of timestamp.
- Every deploy decision has a probe checklist and pass/fail record.
- Every agent execution dispatch defines measurable acceptance criteria before coding starts.
- Every closed item yields either a reusable atom, a template patch, or a postmortem note.

## Missing-layer controls (required)

1. Single scoreboard with 5 metrics:
   - lead_time_to_verified_result_hours
   - first_pass_success_rate
   - citation_compliance_rate
   - reusable_atom_yield_per_week
   - jurisdiction_cost_envelope_hit_rate
2. Red-team lane: adversarial checks on citation gaps, stale source paths, contradictory jurisdiction logic, and no-coverage handling.
3. Hard-case benchmark corpus: 25 to 50 known-answer cases for drift checks.
4. Decision latency SLA: unresolved binary calls older than 72 hours escalate to operator review.
5. WIP cap: max 3 active initiatives at once across the portfolio.

## Owner map

| Function | Owner | Backup |
|---|---|---|
| Weekly slate and kill list | Nick | planner |
| Dispatch quality and atom wiring | planner | cc-agent-R |
| Red-team and benchmark upkeep | cc-agent-C2 | cc-agent-C |
| Shipping reliability metrics | cc-agent-C | planner |
| Place-graph throughput and quality | cc-agent-E | planner |

## 30-day implementation plan

### Week 1

- Activate scoreboard artifact and baseline all five metrics.
- Add red-team checklist to execution dispatches for Lane A work.
- Build initial hard-case corpus with 10 cases.

### Week 2

- Expand hard-case corpus to 25 cases.
- Enforce decision latency SLA and WIP cap in weekly review.
- Patch one recurring failure mode into `_dispatches/_template.md`.

### Week 3

- Run first drift check (benchmark before and after merges).
- Promote at least two reusable playbooks from recent incidents.
- Drop one low-leverage stream from active queue.

### Week 4

- Score performance delta from week-1 baseline.
- Keep or kill each process add-on by measured gain.
- File a decision record if process changes require durable policy changes.

## Success criteria (30 days)

- lead_time_to_verified_result_hours improved by 25% or more.
- first_pass_success_rate at or above 70%.
- citation_compliance_rate at or above 95%.
- at least 1 reusable atom or template promoted per week.
- no active initiative count above 3 for more than 48 hours.

## Failure criteria

- Lane B consumes more than 20% while Lane A misses weekly outcomes.
- Benchmark corpus not used in at least one weekly review.
- Repeated false-done incidents without template or rule updates.

## Atom refs

- `strategy-module:competitive-execution-system`
- `ops-scoreboard:weekly`

## Revision history

- **2026-05-27:** Initial filing from "what are we missing" and "next level" operating discussion.
