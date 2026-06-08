# Precedence taxonomy fix — cc-agent-C2 report

**Date:** 2026-06-08  
**Agent:** cc-agent-C2  
**Repo:** legacy-design-tools  
**Clone:** `P:\legacy-design-tools-c2`  
**Branch:** `cortex/precedence-taxonomy-intra-federal`  
**SHA:** `62e0970`  
**PR:** https://github.com/empressaioemail-tech/legacy-design-tools/pull/149  

## Workspace hygiene

Initial clone state was **alien HEAD** (`cortex/precedence-reconciliation-engine`) with uncommitted planSet WIP. Stashed planSet changes (`stash@{0}`), restored precedence files, branched clean from `origin/main` (`3aa33a9`, PR #147 merged).

## Before / after — ADA vs FHA (+ A117.1) fixture

Fixture: `buildAdaFhaA117DoorClearanceRequirements()`, domain `accessibility`.

| Field | Before | After |
|---|---|---|
| `ruleApplied` | `federal-preempts-where-applicable` | `most-stringent-governs` |
| `governing.atomId` | FHA (24in) | FHA (24in) — unchanged |
| `governing.numericValue` | 24 | 24 — unchanged |
| `confidence` | 0.75 | 0.75 — unchanged |
| Federal preempt in chain | yes (`preempt model-code`) | yes (`preempt model-code`) — preserved |
| `most-stringent-governs` in chain | no | yes |

Two-federal-only pair (`buildFederalPreemptPair()`): `most-stringent-governs` before and after — unchanged.

Single federal + model-code (FHA + A117.1 only): `federal-preempts-where-applicable` — correct cross-tier case.

## Test run output (after fix)

```
 RUN  v3.2.4 P:/legacy-design-tools-c2/lib/finding-engine

 ✓ src/__tests__/mockGenerator.test.ts (10 tests)
 ✓ src/__tests__/prompt.test.ts (13 tests)
 ✓ src/__tests__/planSetDedupe.test.ts (3 tests)
 ✓ src/__tests__/anthropicGenerator.test.ts (15 tests)
 ✓ src/__tests__/grokGenerator.test.ts (2 tests)
 ✓ src/__tests__/precedenceReconcile.test.ts (10 tests)
 ✓ src/__tests__/citationAdapter.test.ts (5 tests)
 ✓ src/__tests__/planSetClassifier.test.ts (6 tests)
 ✓ src/__tests__/planSetOrchestrator.test.ts (2 tests)
 ✓ src/__tests__/engine.test.ts (15 tests)

 Test Files  10 passed (10)
      Tests  81 passed (81)
```

Precedence file only:

```
 ✓ src/__tests__/precedenceReconcile.test.ts (10 tests) 6ms
 Test Files  1 passed (1)
      Tests  10 passed (10)
```

Typecheck: `pnpm run typecheck` — exit 0.

## Changes

1. `lib/finding-engine/src/precedence/reconcile.ts` — defer `ruleApplied` until decision pool is known; `federalPreemptApplied` flag keeps preempt step in chain without sticky label.
2. `lib/finding-engine/src/precedence/types.ts` — doc comment on cross-tier vs intra-tier semantics.
3. `lib/finding-engine/src/__tests__/precedenceReconcile.test.ts` — ADA+FHA+A117 regression, single-federal cross-tier case, updated formatted-text assertion.

## Encumbrance scope check

No encumbrance precedence module with the same sticky-guard pattern found in finding-engine.

## Blockers

None.

## Doc companion

ADR-019 / ADR-021 rule-label cross-tier vs intra-tier clarification referenced in PR #149 body for planner doc_repo wave.
