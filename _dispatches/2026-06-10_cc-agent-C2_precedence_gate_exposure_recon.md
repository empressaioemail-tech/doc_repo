---
id: 2026-06-10_cc-agent-C2_precedence_gate_exposure_recon
title: Dispatch — precedence/reconciliation gate-exposure + full-matrix recon
date: 2026-06-10
agent: cc-agent-C2
repo: legacy-design-tools
kind: dispatch
status: FIRE-READY — recon only, read-only, parallel-safe (own no PR collision with cc-agent-C build work)
related: [58_gtm_readiness_sprint, 59_spine_moat_and_high_value_features, 80_adrs/adr_021_constraint_resolution_and_precedence, 03a_positioning_framework, 20_agent_operating_rules]
---

# Precedence / reconciliation — gate-exposure + full-matrix recon

> Sprint 58 moat #4: recon FIRST, not a settled design. `reconcileStandardPrecedence` (ADR-021) is the literal positioning line — *the code tells you the rule; Hauska tells you what it means, reconciled with every other code that applies* ([`03a`](../03a_positioning_framework.md)). The taxonomy canary is already fixed (ADA-vs-FHA most-stringent-governs, #149), so this recon is the two REMAINING questions: is precedence exposed as a first-class gate tool, and does the model handle the full matrix cleanly. Read-only; produces a scoping report the operator turns into a build dispatch (or not). Parallel-safe with the cc-agent-C build front because it touches no code.

You are **cc-agent-C2**, recon owner for this run. Read-only — no branch, no PR, no schema.

## Model (HR-12)

Default: **Grok Build 0.1**. Escalate to Claude only on failure after retry; log it. Cursor base URL `https://api.x.ai/v1`.

## Read first

1. [`59_spine_moat_and_high_value_features.md`](../59_spine_moat_and_high_value_features.md) item 4 — the three sub-questions
2. [`80_adrs/adr_021_constraint_resolution_and_precedence.md`](../80_adrs/adr_021_constraint_resolution_and_precedence.md) — the precedence model + ADR-019 rules
3. The live `reconcileStandardPrecedence` primitive (landed via PR #147) + the taxonomy fix (#149) in legacy-design-tools
4. The gate tool registry in `hauska-mcp-server/src/tools.ts` (cross-repo read) — what is exposed today
5. [`03a_positioning_framework.md`](../03a_positioning_framework.md) — the positioning line this would make callable
6. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-8

## Scope (recon — answer three questions with file+symbol evidence)

1. **Gate exposure.** Is `reconcileStandardPrecedence` reachable only internally (inside the finding engine) or is it exposed as a first-class gate tool? If not exposed: what would a `resolve_precedence` / `reconcile_codes` MCP tool look like — inputs (the set of applicable code refs + project facts + jurisdiction), output (the governing value + the reconciliation chain + every cited standard + confidence), and the envelope it would emit (it must carry the uniform provenance envelope). Recommend exposed-as-tool vs internal-only with reasoning. Note: an exposed reconcile tool is high moat value — it is the slogan made a callable product an external agent can buy.
2. **Full-matrix completeness.** Does the model handle the full precedence matrix cleanly, or only the cases exercised so far? Enumerate the cases: most-stringent-governs (the fixed ADA-vs-FHA case), federal-preempts-where-genuinely-preemptive, local-overlay (amendment overrides base), co-applicable (two standards both apply, neither preempts), and the cross-layer cases (model code vs state amendment vs local amendment vs zoning). For each: is it handled, partially handled, or unhandled, with the file+symbol of record. Flag any case where the taxonomy label is conceptually off (the kind of error the ADA-vs-FHA canary was).
3. **Reconciliation across the stack.** Does precedence reconcile across model code + amendments + zoning, or only within a single layer? The launch positioning needs at least model-base + state/local amendment reconciliation to be honest. Report what works today.

## Acceptance criteria

- Each of the three questions answered with file+symbol evidence, not assertion.
- A concrete `resolve_precedence` / `reconcile_codes` tool sketch (inputs/output/envelope) OR a reasoned internal-only recommendation.
- The full-matrix case table with handled/partial/unhandled per case and any conceptually-off taxonomy label flagged.
- A scoping recommendation: what a precedence-tighten build would contain, sized, sequenced against the launch (is any of it launch-gating for the positioning line, or all fast-follow?).
- Read-only: no code, no schema, no PR.

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-10_legacy-design-tools_cc-agent-C2_precedence_gate_exposure_recon.md`: the three answers with evidence, the tool sketch, the case table, and the scoping recommendation with the launch-gating call.
