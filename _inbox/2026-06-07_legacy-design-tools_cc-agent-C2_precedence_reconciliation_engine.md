---
id: 2026-06-07_legacy-design-tools_cc-agent-C2_precedence_reconciliation_engine
title: cc-agent-C2 — precedence reconciliation engine (WS2)
date: 2026-06-07
agent: cc-agent-C2
repo: legacy-design-tools
dispatch: 2026-06-07_cc-agent-C2_precedence_reconciliation_engine
status: complete — PR held for operator merge
model: Grok Build 0.1 (default; no escalation)
---

# Precedence reconciliation engine — cc-agent-C2 report

## Workspace hygiene (verbatim)

**Clone:** `P:\legacy-design-tools-c2`

**Entry `git status` (verbatim):**

```
On branch 2d/plan-set-decomposition-rebase
Your branch is up to date with 'origin/2d/plan-set-decomposition-rebase'.

nothing to commit, working tree clean
```

**Entry `git log -3` (verbatim):**

```
bf805fa feat(finding-engine): plan-set decomposition + per-discipline orchestration (WS1)
ed103ef feat(adapters): subsurface federal layer — SSURGO + USGS geology/groundwater/seismic (#145)
6182dbd Merge pull request #144 from empressaioemail-tech/cortex/brief-service-endpoint-exposure
```

Tree clean — proceeded. Checked out `main`, pulled `origin/main` (includes #146 decomposition + #145 subsurface), branched `cortex/precedence-reconciliation-engine`.

**Post-pull `main` HEAD:**

```
d487068 feat(finding-engine): plan-set decomposition + per-discipline orchestration (WS1) (#146)
```

## Prereqs verified

| Prereq | Status |
|--------|--------|
| Plan-set decomposition merged (#146) | Yes — `d487068` on main |
| ADA + FHA in corpus (PR #66) | Yes — cc-agent-E report; atom tenant `federal-accessibility-standards` |
| A117.1 credential-pending | Stubbed in demo fixtures per dispatch |

## Deliverables

| Item | Status |
|------|--------|
| Reusable precedence primitive (`reconcileStandardPrecedence`, `reconcileRequirementsByTopic`) | Done — exported from `@workspace/finding-engine` |
| ADR-019/021 rules encoded | Done — federal-preempt, local-overlay, most-stringent, conflict-unresolved |
| Reasoning chain + citations to every standard compared | Done — never silent pick |
| Citation/confidence/atomId lineage preserved | Done — `FindingCitation[]` + `min(compared.confidence)` |
| ADA+FHA+A117.1 demo case | Done — FHA 24" latch-side governs |
| finding-engine tests green | Done — 80/80 |
| Workspace typecheck green | Done |
| PR held for operator merge | **https://github.com/empressaioemail-tech/legacy-design-tools/pull/147** |

## PR + branch SHA

- **PR:** https://github.com/empressaioemail-tech/legacy-design-tools/pull/147
- **Branch:** `cortex/precedence-reconciliation-engine`
- **SHA:** `0b889c4ded06e2dc58d0e2711d2aa9b61d99fc8d`

## Verification artifacts (verbatim)

### finding-engine test suite

```
Test Files  10 passed (10)
     Tests  80 passed (80)
```

New file: `lib/finding-engine/src/__tests__/precedenceReconcile.test.ts` — 9 tests covering most-stringent, federal-preempt, local-overlay, conflict-surface, by-topic grouping, standard detection.

### Workspace typecheck

```
pnpm run typecheck — exit 0
```

### ADA+FHA+A117.1 demo outcome

Topic: `door-maneuvering-clearance` / dimension: `latch-side clearance`

| Standard | Authority | Value | atomId |
|----------|-----------|-------|--------|
| ADA 2010 | federal | 18 in min | `federal-accessibility-standards/2010-ada-standards-for-accessible-design/404.2.3-clear-width` |
| FHA Design Manual | federal | 24 in min | `federal-accessibility-standards/fair-housing-act-design-manual-april-1998/ch4-door-clear-width` |
| A117.1-2021 (stub) | model-code | 18 in min | `icc-model-code/a117.1-2021/404.2.3.2-clear-width-stub` |

**Result:** `ruleApplied: federal-preempts-where-applicable`; governing FHA 24 in; all three atomIds in `compared` + `citations`; confidence `0.91` (min of compared).

## Atoms / refs touched

- `sprint:55` — workstream 2 (precedence engine)
- `product:cortex` — `@workspace/finding-engine`
- ADR-019 layered code substrate
- ADR-021 constraint resolution and precedence

## New module surface

```
lib/finding-engine/src/precedence/
  types.ts           — ApplicableRequirement, PrecedenceReconciliationResult, …
  comparability.ts   — stringency comparison helpers
  standardRegistry.ts — ADA/FHA/A117.1 detection from atomId/label
  reconcile.ts       — reconcileStandardPrecedence (core primitive)
  accessibilityDemo.ts — ADA+FHA live + A117.1 stub fixtures
  index.ts
```

Public exports from `@workspace/finding-engine`: `reconcileStandardPrecedence`, `reconcileRequirementsByTopic`, `formatPrecedenceFindingText`, plus types and demo fixtures.

## Blockers

None.

## Out of scope (per dispatch)

- Corpus ingest / new adapters
- Confidence calibration (arrow-two)
- Decomposition layer changes (consumes its output; primitive is callable by any engine)
