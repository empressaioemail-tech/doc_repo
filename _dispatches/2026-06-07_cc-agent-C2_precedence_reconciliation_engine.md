---
id: 2026-06-07_cc-agent-C2_precedence_reconciliation_engine
title: Dispatch - multi-standard precedence / reconciliation engine
date: 2026-06-07
agent: cc-agent-C2
repo: legacy-design-tools
kind: dispatch
status: QUEUED (Wave 2 - fire after plan-set decomposition lands and WS3 accessibility standards are in the corpus)
related: [00_current_state, 01a_atom_conventions, 20_agent_operating_rules, 55_spine_data_intelligence_stack, 80_adrs/adr_019_layered_code_substrate, 80_adrs/adr_021_constraint_resolution_and_precedence]
---

# Multi-standard precedence / reconciliation engine

> **QUEUED - Wave 2.** Fire after (a) the plan-set decomposition dispatch lands (per-discipline findings exist to reconcile) and (b) the accessibility corpus dispatch lands (A117.1/ADA/FHA atoms exist to reconcile against). Same c2 clone as decomposition, sequential to avoid finding-engine collisions. This builds the capability behind the EntreArchitect "combine A117.1 + ADA + FHA" ask. Verify identifiers against live source before firing.

You are **cc-agent-C2**, the single owner of the `P:\legacy-design-tools-c2` clone for this run.

## Model (HR-12)

Default: **Grok Build 0.1** (multi-file / agentic). Escalate to Claude only if Grok fails after retry; log the escalation. Cursor base URL `https://api.x.ai/v1`.

## Atoms to resolve

- `current-state:portfolio` - fleet status, blockers
- `sprint:55` - spine robustness roadmap (this is workstream 2)
- `product:cortex` - finding-engine lives in cortex-api

## Read first (after atoms)

1. [`55_spine_data_intelligence_stack.md`](../55_spine_data_intelligence_stack.md) - Section 7 (spine-wide rules: precedence), Section 8 workstream 2
2. [`80_adrs/adr_019_layered_code_substrate.md`](../80_adrs/adr_019_layered_code_substrate.md) and [`80_adrs/adr_021_constraint_resolution_and_precedence.md`](../80_adrs/adr_021_constraint_resolution_and_precedence.md) - the precedence model this implements
3. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) - HR-1, HR-2, HR-3, HR-8, HR-11

## Workspace ownership

- Clone: `P:\legacy-design-tools-c2`
- Branch prefix: `cortex/`
- One agent per clone; sequential after the decomposition dispatch on the same clone
- Refuse alien HEAD or uncommitted state; report verbatim `git status` + `git log -3`

## Scope

**In scope:**

- Recon first. Confirm the per-discipline findings from the decomposition layer and the accessibility standard atoms (A117.1/ADA/FHA) and code-section atoms are available. Report verbatim.
- Build a precedence/reconciliation pass in the finding-engine, implementing ADR-019/021: when multiple standards or code sections apply to the same requirement, resolve which governs.
  - Encode the precedence rules: most-stringent-governs (default for accessibility/life-safety), federal-preempts-where-applicable, local-amendment-overlays-the-model-code.
  - When standards conflict (e.g. A117.1 vs ADA vs FHA on the same dimension), surface the governing requirement with the reasoning chain and citations to each standard considered, not a silent pick.
  - Output a reconciled finding that carries: the governing value, the standards compared, the precedence rule applied, citations, and confidence.
- Make the precedence pass a callable primitive (so other engines can reuse it spine-wide per Section 7), not a plan-review-only hardcode.
- Preserve citation + confidence + `atomId` lineage (arrow-two ledger).

**Out of scope:**

- New data adapters or corpus ingest.
- Calibrating the confidence number (arrow-two).
- The decomposition/classification layer (its own dispatch; this consumes its output).

## Acceptance criteria

- Given two-plus applicable standards on the same requirement, the engine returns the governing requirement, the precedence rule applied, and citations to every standard compared.
- Conflicts are surfaced with reasoning, never silently resolved.
- The precedence pass is a reusable primitive, not plan-review-only.
- Demonstrated on the combine-A117.1-ADA-FHA case once those atoms are in the corpus.
- Tests: finding-engine suite green plus precedence tests (most-stringent, federal-preempt, local-overlay, conflict-surface).
- PR held for operator merge (do not merge).
- Verbatim verification artifacts in report (HR-8).

## Reporting

At break-point write to `P:\doc_repo\_inbox\` as `2026-06-07_legacy-design-tools_cc-agent-C2_precedence_reconciliation_engine.md`. Include atom refs touched, model used (if not default), PR URL + branch SHA, blockers verbatim.
