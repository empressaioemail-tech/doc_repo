---
id: tooling_register
title: Control census register (R-04 first half)
status: active
last_updated: 2026-08-21
plan_row: R-04
---

# Tooling register — control census

**Snapshot:** `P:/doc_repo` @ `4b174d1` in worktree `P:/tmp/r04-controls`. **2026-08-21.** Machine-readable source: `_catalog/tooling_register.json`.

This register answers: **what controls exist, and what does each actually enforce?** It starts from controls, not blueprint rules. R-04 second half maps blueprint rules onto these rows when R-01 lands.

## Summary counts

| Status | Count |
|--------|------:|
| ENFORCED | 38 |
| UNENFORCED | 8 |
| DORMANT | 9 |
| STARVED | 0 |
| OVER-SCOPED | 1 |
| FALSE-GREEN | 1 |

| derivationClass | Count |
|-----------------|------:|
| two-independent-sources | 4 |
| source-vs-our-derivation | 8 |
| internal-consistency | 9 |
| presence-shaped | 26 |

**doc_repo controls enumerated:** 57 (full rows in JSON). **Product repo annex:** 43 CI/runtime/type controls summarized below.

**Controls with non-empty bypass:** 55 of 57 doc_repo rows (only CANON-OVERRIDE and DUPLICATE-ID-GAP bypass fields are N/A by nature).

**violationVerified non-null:** 18 controls observed failing on injected defect.

## Nine pre-filed items — verdicts

| # | Claim | Verdict |
|---|-------|---------|
| 1 | No duplicate-id check; 20 ids × 2+ files | CONFIRMED gap; **8** duplicate pairs at 4b174d1 (not 20) |
| 2 | cited-untracked pinned exit 2, needs graduation | CONFIRMED — **1176** hits live |
| 3 | doc-staleness pinned exit 1, needs graduation | CONFIRMED — 1223 vocab + 155 stale |
| 4 | C-00 two vehicles; third invisible until 2026-08-20 | CONFIRMED — OPS/enforcement.mdc not compared |
| 5 | canon-divergence writes file; needs check-only | CONFIRMED — always exit 0 |
| 6 | seat-register passes unverified | CONFIRMED worse — **FALSE-GREEN** vacuous subprocess |
| 7 | memory gate counts files not lessons | CONFIRMED |
| 8 | M4 internal-consistency | CONFIRMED |
| 9 | canon gate hand-carry bypass | CONFIRMED — Write _dispatches/ skips M3/M4/M5 |

## Critical findings

### Hand-carried dispatch bypass (item 9)

`canon-gate.ps1` line 361 gates M3/M4/M5 on `$toolName -eq 'Agent'`. A dispatch pasted into a Write tool targeting `_dispatches/` runs M1 posture checks only. Identical dispatch-shaped text blocked on Agent (M5 exit 2) passes on Write (exit 0). Verified 2026-08-21.

Most historical dispatches travelled this path. That is the honest scope of the hook, not a bug — but it belongs in the register.

### M4 internal-consistency (item 8)

`scripts/dispatch.mjs` hashes `AGENT_CONTRACT.md` body and writes the marker into that same file. `canon-gate.ps1` reads the marker back from that same file. One party satisfies both sides.

### SEAT-01 DORMANT in hooks

`.cursor/hooks/seat-gate.mjs` imports `../scripts/enforcement/` which resolves to `.cursor/scripts/` (absent). Both Claude PreToolUse seat registrations are DORMANT. The underlying logic in `scripts/enforcement/seat-worktree-gate.mjs` works via CLI (verified exit 2 on unregistered worktree).

### FALSE-GREEN seat-register

`enforcement-baseline.json` lists `seat-register.mjs` as a control. The file is a library with no `main()`. `node seat-register.mjs` exits 0 silently. Ratchet reports PASS 0/0.

### CI advisory on doc_repo

Branch protection Stage 1: no force-push, no required status checks. `enforcement.yml` runs and passes but does not block merge (TW-74 class).

## Controls with non-empty bypass (doc_repo)

Every control below has at least one path to the same state without passing through it.

- **REG-PRE-BASH-BRANCH** — non-Bash tools; harness without PreToolUse
- **REG-PRE-BASH-DIRTY** — CLOSE_OVERRIDE=1; push non-doc_repo
- **REG-PRE-BASH-SEAT** — import crash; SEAT_GATE_OVERRIDE=1
- **REG-PRE-AGENTWRITE-CANON** — CANON_OVERRIDE; Write outside _dispatches/; hand-carried Write bypass
- **REG-PRE-AGENTWRITE-TEMPLATE** — DISPATCH_OVERRIDE; under 400 chars
- **REG-PRE-AGENTWRITE-SEAT** — broken import; non-harness editors
- **REG-PRE-READ-DIVERGENCE** — Read other than _STATE.md; fresh report
- **CANON-M1-POSTURE** — CANON_OVERRIDE; unresolved repo
- **CANON-M1-STALE** — CANON_OVERRIDE; within 30 days
- **CANON-M4-CONTRACT** — CANON_OVERRIDE; Write hand-carry; hand-edit marker
- **CANON-M5-PLANROW** — CANON_OVERRIDE; Write hand-carry; prose-only PLAN-ROW
- **CANON-M3-PREAMBLE** — CANON_OVERRIDE; Write hand-carry
- **CANON-SCOPE-WRITE** — Write outside _dispatches/
- **TPL-001, TPL-003, TPL-HEURISTIC-BYPASS** — overrides and heuristics
- **BRANCH-MAIN** — seat worktrees; other repos
- **BRANCH-MATCHER** — on main branch
- **DIRTY-STATE-PUSH** — CLOSE_OVERRIDE=1
- **M2-DIVERGENCE-REFRESH** — never blocks by design
- **SEAT-01** — hook crash; SEAT_GATE_OVERRIDE; git GUI
- **C-00** — skip CI; Claude @ENFORCEMENT.md path; OPS mdc not compared
- **REGEN-MDC** — skip regeneration
- **CTRL-1** — hand dispatch; skip CI
- **MEMORY-PROMOTION-GATE** — remove pin; LESSON on triaged file
- **CI-ENFORCEMENT-RATCHET** — unlisted controls; raise baseline
- **cited-untracked** — allowlisted prefixes; skip CI
- **doc-staleness** — STALENESS_SKIP; --lane-set
- **canon-divergence** — fail-open entire control
- **seat-register** — vacuous baseline subprocess
- **ROW-DECLARATION** — shell regex; skip CI
- **dispatch-plan-row-gate** — hand-assembled dispatch
- **dispatch-contract-hash-stamp** — hand-edit marker
- **BP-DOC-REPO-STAGE1** — no required checks
- **MDC-ENF, MDC-STATE** — non-Cursor harnesses
- **state-generated-check** — not in CI
- **hy-*, gate-grade, product-surface-smoke, stall-watchdog** — manual-only / not wired
- **DUPLICATE-ID-GAP** — control absent entirely

## Controls found beyond mission brief

These were not named in the dispatch but exist in the operation:

1. **TPL-002-NONEST, TPL-004-CLOSE** — additional dispatch-template-gate checks
2. **_override-log-target.ps1, _git-repo-target.ps1** — hook infrastructure
3. **HY-03, HY-04, untracked-estate** — hygiene measurement scripts
4. **ldt-runtime-gate-context** — legacy-design-tools HMAC gate middleware (enforce mode)
5. **smart-markets structural grep gates** — union-layer architecture CI
6. **@empressaio/atom-contract type-level Zod unions** — compile/parse enforcement
7. **enforcement.yml false-green history** (ee4ea4a) — fixed at 2b3dc71
8. **seat-gate.mjs import path bug** — `.cursor/scripts` resolution

## Product repo annex (summary)

Read-only scan at census time. No pre-commit hooks in any repo.

| Repo | Branch protection | CI merge gate |
|------|-------------------|---------------|
| hauska-engine | typecheck + test required | active |
| legacy-design-tools | SS-W18, Typecheck, Test, SS-W16 | active |
| hauska-map | encoding + test required | active |
| smart-markets | protected, **no required checks** | dormant |
| smartcity-dashboards | **none** | dormant |
| smart-files | **none**; no workflows | dormant |

Notable product controls: LDT SS-W16 tier2-flood-not-served, SS-W18 boot graph, L17 ci-vintage-predicate, HE geometry LLM grep, HM source-encoding self-test, SM structural grep gates (no DB, no upstream, no computed stub).

Type-level controls in `@empressaio/atom-contract`: AccessPolicy five-value union, literal entityType, owner-fact public-paid superRefine, reasoning chain discriminatedUnion, parcel node id pattern.

## Gaps filed (build items, not built this lane)

1. Duplicate frontmatter id check
2. seat-register validation script separate from library
3. Fix seat-gate.mjs import to `../../scripts/enforcement/`
4. Wire SEAT-01 into CI ratchet
5. canon-divergence --check-only mode
6. doc_repo branch protection Stage 2 (required enforcement checks)
7. C-00 third-vehicle or retire OPS/enforcement.mdc
8. C-00b runtime doctrine-reach probe (designed, not built)
9. Graduate cited-untracked and doc-staleness to BLOCKING
10. Per-lesson memory promotion triage ids
11. M4 upgrade to source-vs-our-derivation or accept internal-consistency
12. Protect smart-files and smartcity-dashboards merges

## Pre-registered wrong checks

1. **grep-only enumeration** — mitigated by reading settings.json and script entry points
2. **instruction vehicles as ENFORCED** — four source .mdc files marked UNENFORCED
