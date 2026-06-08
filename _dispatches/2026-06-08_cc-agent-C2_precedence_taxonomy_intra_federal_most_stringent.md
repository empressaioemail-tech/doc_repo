---
id: 2026-06-08_cc-agent-C2_precedence_taxonomy_intra_federal_most_stringent
title: Dispatch — precedence taxonomy fix, intra-federal selection is most-stringent-governs not federal-preempts
date: 2026-06-08
agent: cc-agent-C2
repo: legacy-design-tools
kind: dispatch
status: ready
related: [00_current_state, 55_spine_data_intelligence_stack, 56_engine_extraction_sprint, 80_adrs/adr_021_constraint_resolution_and_precedence, 80_adrs/adr_019_layered_code_substrate, 20_agent_operating_rules]
---

# Precedence taxonomy fix — intra-federal selection is most-stringent-governs

> **Fire-ready, small, self-contained.** Follow-up refinement flagged in the 2026-06-08 session close on PR #147 (precedence/reconciliation engine). Outcome (the governing value) is already correct; this corrects the reported rule label only. Pre-mortem cleared GREEN (strengthens the sell-reasoning commitment). One cc-agent-C2 clone per run.

You are **cc-agent-C2**, owner of your `legacy-design-tools` clone for this run. PR #147 shipped `reconcileStandardPrecedence` and the combine-A117.1-ADA-FHA capability. The reasoning is sound but one rule label is conceptually wrong for the two-co-applicable-federal-standards case, which is exactly the EntreArchitect demo path (ADA vs FHA on latch-side clearance).

## Model (HR-12)

Default: **Grok Build 0.1** (multi-file / agentic). Use **grok-code-fast-1** for narrow, speed-only tasks. Escalate to Claude only if Grok fails after retry; log the escalation.

Cursor: base URL `https://api.x.ai/v1`.

## Workspace ownership

- Clone: `P:\legacy-design-tools-c2`
- Branch: `cortex/precedence-taxonomy-intra-federal`
- One agent per clone. Refuse alien HEAD or uncommitted state; report verbatim `git status` plus `git log -3`. Rebase on current `main` before opening the PR.

## The defect (verified against source)

In `lib/finding-engine/src/precedence/reconcile.ts`:

- Line ~236: `if (federal.length > 0 && federalPreempts && effectiveModel.length > 0)` sets `ruleApplied = "federal-preempts-where-applicable"` and reduces `decisionPool` to `[...federal]`. This is CORRECT as a cross-tier statement: federal displaces model-code.
- Lines ~251-260: for `accessibility | life-safety | dimensional`, the most-stringent pick runs over the decision pool, but the guard `if (ruleApplied !== "federal-preempts-where-applicable")` keeps the federal-preempts label sticky. So when the pool is two co-applicable FEDERAL standards (ADA + FHA) and the governing standard is chosen by stringency, the reported `ruleApplied` is still `federal-preempts-where-applicable`.

That is wrong. ADA and FHA are both federal and co-applicable; neither preempts the other. The rule that selected the governing value among them is most-stringent-governs. `federal-preempts-where-applicable` describes why model-code was dropped from the pool, not how the governing federal standard was picked.

## Target taxonomy (planner decision — implement this)

1. `federal-preempts-where-applicable` describes CROSS-TIER preemption only: federal displacing model-code / state / local. It explains pool reduction.
2. The governing `ruleApplied` reports HOW the governing standard was selected from the final decision pool. When the governing pick is made among two or more co-applicable standards of the same tier (including two federal standards) by stringency, `ruleApplied = "most-stringent-governs"`.
3. The federal-preempts cross-tier step is NOT lost: it stays in `reasoningChain` as the step that dropped model-code. So an ADA-vs-FHA result reads: federal preempts model-code (chain step) AND most-stringent-governs selected FHA's 24in (ruleApplied + chain step).

Concretely: relax the line ~256 guard so that when `decisionPool.length >= 2` and the governing pick is by stringency, `ruleApplied` resolves to `most-stringent-governs` even if federal-preempts dropped model-code earlier. Reserve `federal-preempts-where-applicable` as the reported `ruleApplied` for the case where federal displacement leaves a single governing federal standard (no intra-tier stringency contest). Keep the federal-preempts reasoning step in the chain in both cases. Do not change `pickMostStringent` or the governing value.

## Scope

**In scope:**

- The `reconcile.ts` label logic per the target taxonomy above.
- Update `lib/finding-engine/src/precedence/types.ts` only if a doc-comment on the `PrecedenceRuleApplied` union needs to reflect the cross-tier-vs-intra-tier distinction. Do not remove existing union members; downstream reads them.
- Update `lib/finding-engine/src/__tests__/precedenceReconcile.test.ts`: the ADA-vs-FHA accessibility case must now assert `ruleApplied === "most-stringent-governs"` AND that the reasoning chain still contains the federal-preempts step. Keep the genuine cross-tier federal-vs-model-code single-federal case asserting `federal-preempts-where-applicable`. Add a regression case for two-federal-standards-plus-model-code (federal-preempts drops model-code in the chain; most-stringent-governs is the reported rule).

**Out of scope:**

- The governing value / `pickMostStringent` selection (must stay byte-identical; this is label-only).
- Encumbrance precedence beyond the shared label semantics (only touch if the same sticky-guard pattern exists there; flag, do not expand scope).
- Any engine-extraction move (that is a separate 56 dispatch).

## Acceptance criteria

- ADA-vs-FHA accessibility reconciliation reports `ruleApplied: "most-stringent-governs"`; reasoning chain still cites federal preemption of model-code where model-code was present; governing value unchanged (FHA 24in governs latch-side clearance, all three standards cited, confidence unchanged).
- Genuine cross-tier single-federal case still reports `federal-preempts-where-applicable`.
- New regression test for two-federal-plus-model-code passes.
- Full finding-engine suite green (the precedence suite was 80/80; do not regress), typecheck clean.
- Reasoning chain on every reconciliation still carries source citations, confidence, timestamp (quality-gate rule).
- PR held for operator merge; branch + SHA reported.
- Verbatim verification artifacts (HR-8): the before/after `ruleApplied` for the ADA-vs-FHA fixture and the full test run output.

## Doc-side companion (planner handles, do not edit doc_repo)

The ADR-019 / ADR-021 rule-label section in doc_repo gets the cross-tier-vs-intra-tier clarification in the same wave; the planner owns that edit. Reference it in your PR description so the code and the ADR semantics land together.

## Reporting

At break-point, write to `P:\doc_repo\_inbox\` as `2026-06-08_legacy-design-tools_cc-agent-C2_precedence_taxonomy_fix.md`. Include the before/after `ruleApplied` for the ADA-vs-FHA fixture, the test run output, PR URL + branch SHA, and blockers verbatim.
