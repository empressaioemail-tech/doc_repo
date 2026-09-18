---
id: tooling_register
title: Control census register (R-04 first half)
status: active
last_updated: 2026-09-18
plan_row: R-04
---

# Tooling register — control census

**Snapshot:** `P:/doc_repo` @ `4b174d1` in worktree `P:/tmp/r04-controls`. **2026-08-21.** Machine-readable source: `_catalog/tooling_register.json`.

This register answers: **what controls exist, and what does each actually enforce?** It starts from controls, not blueprint rules. R-04 second half maps blueprint rules onto these rows when R-01 lands.

**Amended 2026-09-18 (R-06 cursor harness parity).** Four rows added (REG-CURSOR-RELAY, REG-CURSOR-PARITY, REG-CURSOR-PORT-SET, STATE-BUDGET) and `state-generated-check` flipped DORMANT to ENFORCED now that it runs in CI and refuses on both drift and over-budget. **The counts tables below were wrong before this amendment and are corrected here.** They had been hand-maintained with nothing recomputing them: `violationVerifiedNonNull` was declared 18 against an actual 34, and "doc_repo controls enumerated: 57" was declared against 46 rows. `scripts/enforcement/tooling-register-schema.mjs` now recomputes every derivable count from `controls[]` and refuses on disagreement, so these numbers cannot drift again without a red build. The one count it CANNOT recompute (`productRepoControlsAnnex`, a claim about artifacts this file does not enumerate) is stated, not verified, and the control prints that.

**Amended again 2026-09-18 (second pass, same day).** Two rows added, both defects FOUND rather than built: `CANON-MATCHER-EDIT-GAP` and `PROBE-CLOSE-RANGE-DRIFT` (see the gaps list). Counts updated to 52 rows. `gapsFiled` turned out to be derivable all along: it is the length of this file's own top-level `gapsFiled` array, and it had been declared 12 while the array held 13. It was sitting in the `_notDerivable` list, which is where the hole was. The schema control now derives it and refuses on disagreement, so an entry added to the array without the count moving is a red build. One count remains stated-not-checked: `productRepoControlsAnnex`.

**Read the numbers in the JSON, not here.** The tables below are human-readable and are NOT machine-checked; only `_catalog/tooling_register.json` is. If the two disagree, the JSON is authoritative and this file is the defect.

## Summary counts

| Status | Count |
|--------|------:|
| ENFORCED | 30 |
| UNENFORCED | 9 |
| DORMANT | 11 |
| STARVED | 0 |
| OVER-SCOPED | 1 |
| FALSE-GREEN | 1 |

| derivationClass | Count |
|-----------------|------:|
| two-independent-sources | 9 |
| source-vs-our-derivation | 11 |
| internal-consistency | 9 |
| presence-shaped | 22 |
| external | 1 |

**doc_repo rows in the register:** 52. **Product repo annex:** 43 CI/runtime/type controls summarized below.

**Rows with non-empty bypass:** 52 of 52 (the two rows the earlier note called N/A by nature do carry bypass text at this snapshot).

**violationVerified non-null:** 35 rows carry injection evidence. That is a row count, not a strength claim: several of those strings describe partial or indirect verification, and REG-CURSOR-PORT-SET and PROBE-CLOSE-RANGE-DRIFT each say so in their own text.

**Gaps filed:** 14 entries in the `gapsFiled` array. That count is now derived from the array's own length by the schema control, so it cannot drift from the list.

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

### SEAT-01 was DORMANT in hooks — import path fixed, coverage extended

`.cursor/hooks/seat-gate.mjs` imported `../scripts/enforcement/`, which resolves to `.cursor/scripts/` (absent), so both Claude PreToolUse seat registrations were DORMANT from the R-04 census. **The import is fixed** (it now reads `../../scripts/enforcement/`), and `scripts/enforcement/hooks-loadable.test.mjs` load-checks every registration on BOTH harnesses, so the same defect cannot return silently. The underlying logic in `scripts/enforcement/seat-worktree-gate.mjs` works via CLI (verified exit 2 on unregistered worktree).

Historical record, kept because it is how the defect was found: a registered hook crashed on every invocation with ERR_MODULE_NOT_FOUND and exited 0. Nothing checked loadability.

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
- **state-generated-check** — hand-editable _STATE.md; a pin raised in the same commit as the growth
- **hy-*, gate-grade, product-surface-smoke, stall-watchdog** — manual-only / not wired
- **DUPLICATE-ID-GAP** — control absent entirely
- **REG-CURSOR-RELAY** — a Cursor event with no registration; a registration naming `.claude/hooks` without run-gate.mjs (refused by REG-CURSOR-PARITY); a payload shape outside the captured set
- **REG-CURSOR-PARITY** — a harness that does not run CI; a command string that parses to no script path at all
- **REG-CURSOR-PORT-SET** — any Cursor event with no registration; nine of the eleven gates have not been individually injected (partial, stated in the row)
- **STATE-BUDGET** — raise a pin in the same commit as the growth; delete the budget file (refused, not read as unlimited)
- **CANON-MATCHER-EDIT-GAP** — the file-EDIT tool on both harnesses. The Claude matcher is `Agent|Write` and `canon-gate.ps1:197` separately exits open on any other tool name, so an Edit reaches no posture check. The `StrReplace` and `Delete` tokens in the Cursor matcher are inert for the same reason: they fire the hook, and the hook exits open.
- **PROBE-CLOSE-RANGE-DRIFT** — any close for a plan row above P-320. The hook's gated range stops there while the registry declares OPS-24 through 334, and the in-code drift detector that observes exactly this is in no CI baseline row.

## Two gaps found on 2026-09-18, filed not fixed

Both were found by reviewing the R-06 parity work rather than by building it, and both are the ENFORCEMENT.md shape where a control's scope is narrower than its claim and nothing complains.

### `CANON-MATCHER-EDIT-GAP` — the edit tool is unchecked on both harnesses

`canon-gate.ps1` gates M1 posture checks on tool names `Agent` and `Write`. Two independent facts put the edit tool outside it. `.claude/settings.json` lists `Edit` and `Write` as separate permission entries, so the matcher `Agent|Write` does not match an Edit. And `canon-gate.ps1:197` is a second, redundant exclusion, `if ($toolName -notin @('Agent','Write')) { Exit-Open }`, so even a payload that reaches the gate under another name exits open. Net effect: on Claude an Edit never reaches the hook; on Cursor `StrReplace` reaches it and it exits open.

`harness-parity.mjs` does not catch this and could not: it compares matcher coverage BETWEEN harnesses, Claude's `Agent|Write` is covered by Cursor's `Write|StrReplace|Task`, so parity holds while the hole sits inside the gate on both sides. Closing it is a change to Claude-side enforcement behaviour, which the R-06 card excludes, so it is filed with a falsifier (see the row) rather than fixed.

### `PROBE-CLOSE-RANGE-DRIFT` — a stale range, and the detector for it runs nowhere

`probe-close-gate.mjs` enforces a hardcoded set of gated plan rows. The plan registry declares OPS-24 through `327-351`; the hook's list stops at `320`, so closes for P-327..P-351 are never evaluated.

The hook contains a drift detector built for exactly this, comparing its own ranges against the registry's, and it **is firing right now**: `node scripts/enforcement/probe-close-gate.mjs --self-test` reports 32 checks and 1 FAIL on `GATED_RANGES equals EVERY registry range for OPS-23 and OPS-24` (observed 2026-09-18). It is DORMANT, not broken: no baseline row and no workflow step invokes it, so CI is green while the coverage gap is live. This is the second half of the same defect class the register exists to record, and it is the reason nobody noticed the first half.

Neither half is fixed here because they are coupled: extending the range alone leaves the detector dormant, and adding a currently-red self-test to `.github/enforcement-baseline.json` turns the build red until the range is corrected. Both belong in one card, together with the decision of which source is stale, since the check cannot say.

## Harness parity gap — found 2026-09-18 (R-06)

The register had no row for harness coverage, and nothing compared the two harnesses. At the R-04 census the fleet ran **eleven gate identities on Claude Code and one on Cursor** (`seat-gate.mjs`), while `AGENTS.md` told every agent, Cursor agents included, that "the canon-gate hook blocks anything missing the compiled markers". On Cursor that sentence was false. `scripts/enforcement/harness-parity.mjs` now enumerates both configs, refuses an unexcused gap, refuses a `.claude/hooks` registration on Cursor that skips the translator, and refuses a gate whose Cursor matcher is narrower than its Claude one (identity parity is not scope parity). `scripts/enforcement/hooks-loadable.test.mjs` now audits `.cursor/hooks.json` as well as `.claude/settings.json` and resolves a relay registration to the gate it names.

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
13. **canon-gate M1 posture check does not cover the file-EDIT tool on either harness** (`CANON-MATCHER-EDIT-GAP`). The Claude matcher names `Agent|Write`, and `canon-gate.ps1:197` independently exits open on any tool name but `Agent`/`Write`, so the edit tool is unchecked on both harnesses. Found 2026-09-18 by review of the R-06 parity work; `harness-parity.mjs` cannot see it because parity holds BETWEEN harnesses while the hole is INSIDE the gate.
14. **probe-close-gate's gated range stops at P-320 while the plan registry declares 327-351, and the detector that catches this runs nowhere** (`PROBE-CLOSE-RANGE-DRIFT`). `probe-close-gate.mjs --self-test` FAILS today on `GATED_RANGES equals EVERY registry range for OPS-23 and OPS-24` (32 checks, 1 FAIL, observed 2026-09-18), and no `.github/enforcement-baseline.json` row runs it, so CI is green while closes above P-320 go ungated. Both halves must move together: extending the range alone leaves the detector dormant, and adding the detector alone turns the build red.

## Pre-registered wrong checks

1. **grep-only enumeration** — mitigated by reading settings.json and script entry points
2. **instruction vehicles as ENFORCED** — four source .mdc files marked UNENFORCED
