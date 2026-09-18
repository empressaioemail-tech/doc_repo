---
id: 2026-09-18_r06_cursor_harness_parity_close
title: CLOSE — R-06 Cursor harness parity and the state-file budget
status: complete
last_updated: 2026-09-18
plan_row: R-06 (OPS-18)
seat: integration
wdll: _inbox/2026-09-18_r06_cursor_harness_parity_WDLL.md
---

# R-06 close — Cursor harness parity and the state-file budget

**Snapshot.** `P:/doc_repo`, branch `main`, HEAD `e9a9064a`, worktree `P:/doc_repo` (seat `integration`, kind `integration`). All results below are from that tree with this lane's edits uncommitted. Declared because a probe run against a stale tree returns confident wrong answers.

## What changed

Two enforcement vehicles existed at very different strengths: Claude Code registered thirteen gate registrations across four matchers, Cursor registered one script. `AGENTS.md` told every agent, Cursor agents included, that the canon-gate hook blocks anything missing the compiled markers. On Cursor that sentence was false.

The fix is a translator, not a second copy of the gates. `.cursor/hooks/normalize-payload.mjs` maps a Cursor payload onto the shape the unmodified gates already parse; `.cursor/hooks/run-gate.mjs` wraps any gate in it and translates the verdict back. All eleven gate identities are now registered on Cursor through that one adapter. `scripts/enforcement/harness-parity.mjs` enumerates both configs and refuses an unexcused gap, a `.claude/hooks` registration on Cursor that skips the adapter, and a Cursor matcher narrower than its Claude one.

The state-file budget is armed as a ratchet (Variant A). `_state/state_budget.json` pins each seat's normalized byte contribution; `generate-combined.mjs` refuses to write a combined file that exceeds a pin, and `check-generated.mjs` checks the same thing in CI.

## Acceptance items — graded

| # | Item | Grade | Evidence |
|---|------|-------|----------|
| 1 | One normalizer, both payload shapes | MET | `node .cursor/hooks/normalize-payload.test.mjs` exit 0. Carries the not-vacuous fixture asserting the pre-fix behaviour (a Cursor-shaped payload yielding an empty command) is what the normalizer prevents. |
| 2 | Gate parity enumerated, not asserted | MET | `node scripts/enforcement/harness-parity.mjs` exit 0, no unexcused gaps. Refusal demonstrated by removing a registration and observing exit 1, then restoring. Matcher-scope parity added after review found identity parity alone was insufficient. |
| 3 | Every ported gate proven by violation, per gate | **PARTIAL** | Table below. Six observed blocking; four inferred-block with allowance observed; three cannot block on any path by design. Not every gate was individually injected, and that is stated in the table and in the register row rather than averaged away. |
| 4 | No ported gate blocks ordinary work | **PARTIAL** | `git status` and ordinary `node` calls allowed all session; Writes into `_inbox/` allowed. **A staged `git commit` was NOT observed**: no commit was made this session, because commits are presented for review first. The one gate that did block my own work was `dispatch-template-gate`, correctly, twice, on two non-compliant sub-agent briefs; the third compliant brief passed. That is the gate reaching real work, not a false positive. |
| 5 | `hooks-loadable.test.mjs` audits the Cursor hook file | MET | Proved by violation: restored the historical `../scripts/enforcement/` import in `.cursor/hooks/seat-gate.mjs` and observed exit 1 **naming `.cursor/hooks.json`**; restored byte-identical (sha256 compared), observed exit 0. `scripts/enforcement/r06-acceptance-checks.mjs`. |
| 6 | `check-generated.mjs` runs in CI and is ratcheted | MET, with a red-build caveat | Named step in `.github/workflows/enforcement.yml` plus a BLOCKING row at pin 0 in `.github/enforcement-baseline.json`. Proved by violation: one-byte drift appended to `_STATE.md` gave exit 1 naming `drift` and `_STATE.md`; restored byte-identical, exit 0. **Caveat: the CI build is already red on `main` for unrelated reasons, so "green in CI" is not observable today.** See the red-build finding below. |
| 7 | The generator enforces a declared per-seat budget, refusal proven able to fire | MET | Budget in tracked `_state/state_budget.json`, not in code. `node scripts/state/state-budget.mjs --self-test` covers both directions on fixture roots (13 checks): exact-pin pass, one-byte-over refusal naming seat and both numbers, missing budget file refused rather than read as unlimited, non-integer pin refused, pin for an unregistered seat refused, and a non-vacuity check that 101 bytes does not measure as 100. |
| 8 | The armed budget is one the tree can meet, blocking seat named | MET | `node scripts/state/generate-combined.mjs` at arm time: exit 0, output `{"generated":"_STATE.md","bytes":228833,"seats":["property","markets","trading","systems","substrate","govtech","dispatch-planner"]}`. The tree meets the budget, so no seat is blocked. `property` is pinned at its measured 213,766 bytes because read-state-first forbids this seat writing another seat's state file; the pin is the named ask with a number attached. |
| 9 | One register row per new control | MET | Four rows added, two more added on the second pass for defects found. `node scripts/enforcement/tooling-register-schema.mjs` exit 0 at 52 rows. Refusal observed: the R-06 violation fixture exits 1 on a row with a required field removed. |
| 10 | The claim in canon matches the harnesses that carry it | MET, one over-broad word filed | canon-gate **is** registered on Cursor at this commit, through the adapter, on `Write|StrReplace|Task`. The `AGENTS.md` sentence is now true for dispatch launches and Writes on both harnesses. It is still over-broad in the word "anything": the file-EDIT tool reaches no posture check on either harness (`CANON-MATCHER-EDIT-GAP`, filed). |

## Item 3 — per-gate violation table

`OBSERVED` means the exit code and refusal text were seen in this session. `INFERRED` means read from source and not exercised. "Allow observed" means the benign payload was run and passed.

| Gate | Injected defect | Result | Allow |
|------|-----------------|--------|-------|
| `canon-gate.ps1` | Agent dispatch lacking the current `AGENT-CONTRACT` marker | OBSERVED exit 2, `CANON GATE (M4): dispatch missing or stale AGENT-CONTRACT marker` | observed on a non-dispatch prompt |
| `dispatch-template-gate.ps1` | Agent brief missing the four preconditions | OBSERVED exit 2, **on the live Cursor harness, twice**, on this session's own sub-agent spawns. Third case, no-nesting clause present but not first line, also refused | observed: the compliant brief launched the sub-agent |
| `dirty-tree-close-gate.ps1` | `git push origin main` with stranded untracked work | OBSERVED exit 2, message listing `_state/state_budget.json` | observed on `git status` |
| `seat-gate.mjs write` | Write to `_state/property/STATE.md` from the integration checkout | OBSERVED exit 2, naming the seat boundary | observed on a Write into `_inbox/` |
| `probe-close-gate.mjs` | `git commit -am x` (stages and commits in one string) | OBSERVED exit 2 | observed on `git commit -m x` |
| `traffic-lease-gate.mjs` | `gcloud run services update-traffic ... --to-latest` with no lease | OBSERVED exit 2. Also fired unprompted on a real shell command during recon: the harness reaching real work | observed on `git status` |
| `branch-guard.ps1` | commit while off `main` | INFERRED exit 2 (`branch-guard.ps1:55`) | observed exit 0 on `main` |
| `plan-row-allocation-gate.mjs` | staged plan defining one row id twice | INFERRED exit 2 (`plan-row-allocation-gate.mjs:158`) | observed exit 0 |
| `fan-depth-gate.mjs commit` | staged close declaring `FAN-DEPTH: 0` with sub-agents spawned | INFERRED exit 2 (`fan-depth-gate.mjs:65`) | observed exit 0 |
| `fan-depth-gate.mjs agent` | a lane claim younger than 8h whose dispatch says `FAN-DEPTH: 0` | INFERRED exit 2 (`fan-depth-gate.mjs:109`) | observed exit 0 |
| `seat-gate.mjs session` | none available | **CANNOT BLOCK.** `process.exit(0)` at `:156` on every path; the block branch only sets advisory text | n/a |
| `authoritative-read.mjs` | none available | **CANNOT BLOCK.** `process.exit(0)` at `:34` is unconditional; it warns | n/a |
| `canon-divergence-run.ps1` | none available | **CANNOT BLOCK.** every path ends `Exit-Open` | n/a |

The four INFERRED rows need a staged index, a non-main branch, or a fresh lane claim to inject, and this seat may not create those (they are writes to the shared repo, a checkout, and a registry write). The correct instrument is a fixture repo; that is left as the named follow-up below rather than claimed.

**The three CANNOT-BLOCK rows are the important honest half.** They are advisory by design. Registering them on Cursor changes nothing about enforcement, and calling them "ported gates" would inflate the parity claim. The register row for the port set says so.

## Findings, filed not fixed

Two defects were found by reviewing this lane's own work, and one pre-existing red build. None is fixed here, each with the reason.

**1. `CANON-MATCHER-EDIT-GAP` — the file-EDIT tool reaches no posture check on either harness.** Two independent readings: `.claude/settings.json` lists `Edit` and `Write` as separate permissions, so the matcher `Agent|Write` never matches an Edit; and `canon-gate.ps1:197` is a second exclusion, `if ($toolName -notin @('Agent','Write')) { Exit-Open }`, so even a payload arriving under another name exits open. On Cursor, `StrReplace` reaches the hook and the hook exits open, so the `StrReplace` and `Delete` tokens in the matcher are inert and imply coverage that does not exist. `harness-parity.mjs` cannot see this and could not: parity holds between the harnesses while the hole is inside the gate on both. Filed with a falsifier. Not fixed because closing it changes Claude-side enforcement behaviour, which this card excludes.

**2. `PROBE-CLOSE-RANGE-DRIFT` — a stale range and a dormant detector.** `probe-close-gate.mjs` enforces a hardcoded gated row set that stops at P-320; the plan registry declares OPS-24 through 327-351, so closes for P-327..P-351 are never evaluated. The hook contains a drift detector for exactly this and it **is firing right now**: `node scripts/enforcement/probe-close-gate.mjs --self-test` reports 32 checks, 1 FAIL, on `GATED_RANGES equals EVERY registry range for OPS-23 and OPS-24`. It is dormant, not broken: no `.github/enforcement-baseline.json` row and no workflow step runs it. This is the silent second half of a scope defect, and it is why the first half went unnoticed. Not fixed because the two halves are coupled: extending the range leaves the detector dormant, and ratcheting a currently-red self-test turns the build red until the range moves. One card, and a human decides which of the two sources is stale.

**3. The CI build is already red on `main`, before this lane.** Five consecutive runs on `main` failed at `2026-09-18T10:49Z` through `11:25Z` (e.g. run `35339532280`), every one failing at the first step, `C-00 vehicle sync`, because `ENFORCEMENT.md` and the generated `.cursor/rules/enforcement.mdc` body differ: 250 lines against 207, first divergence at line 33. Both files are unmodified in this working tree, so the drift is committed. I checked this against a pristine worktree at HEAD `e9a9064a` with zero dirty files and reproduced the same four REGRESSED controls, so none of it is this lane's doing:

```
c-00-vehicle-sync              BLOCKING   0         1       REGRESSED
canon-divergence               REPORTING  0         1       REGRESSED
memory-promotion-gate          BLOCKING   0         1       REGRESSED
row-declaration                BLOCKING   0         1       REGRESSED
regressed=4  improved=0  unmeasured/missing=0  starved-by-environment=0
```

Consequence for this card: item 6's control is wired and violation-proved, but a green CI build cannot be observed while the build is red for these four. The `.mdc` drift is the one-line fix (`node scripts/enforcement/regenerate-mdc.mjs`) and it is the first thing worth doing, because it means half the fleet's Cursor agents are reading a rules file 43 lines behind the canon it is generated from.

## Adjacent facts worth carrying

- **Registration count is 14, not 13.** Nine single-registration gates, `fan-depth-gate.mjs` twice, `seat-gate.mjs` three times. The `session` registration exists only in `.cursor/hooks.json` (`sessionStart`), so `.claude/settings.json` alone shows 13. Any parity count quoted without the split is ambiguous.
- **`fan-depth-gate.mjs:65` is a redundant guard, not a defect.** `if (depth === 0 && sa.spawned > 0)` is unreachable while `:64` stands: for `depth === 0` and `spawned > 0`, either `maxDepth === 0` (caught at `:63`) or `maxDepth > depth` (caught at `:64`). It becomes live only if `:64` is removed. The self-test case named "depth 0, two spawned: refused" therefore passes via `:64`, not via the line its name suggests.
- **A mutation that does not land proves nothing, and the proof script said so.** The first sensitivity attempt mutated `:65` and the suite stayed green; the script correctly reported `PROOF FAILED` rather than counting a no-op as evidence. Retargeted at `:64`, the suite went red (exit 1) and green again after a byte-identical restore. That script is `scripts/enforcement/gate-selftest-sensitivity.mjs`.
- **`cited-untracked` answers differently depending on the checkout.** It reports 113 tracked citations of untracked paths in the main checkout and 0 from a fresh worktree at the same commit, because a worktree does not carry untracked files. Exactly one of those 113 names a file created this session: `_catalog/tooling_register.md` cites `scripts/enforcement/harness-parity.mjs`, which is untracked until this lane's commit. The other R-06-adjacent hit is a May 2026 file citing `.claude/worktrees/`, an untracked agent-harness directory, and is not this lane's. Worth noting that a control whose answer depends on which checkout it runs in is measuring the environment as well as the repo.
- **The one count the register still cannot check** is `productRepoControlsAnnex`, a claim about artifacts the register does not enumerate. It is printed as stated-not-checked rather than silently trusted. `gapsFiled` was moved out of that category this session: it is the length of the register's own array, and it had been declared 12 while the array held 13.

## leave_behind

- item: fixture-repo violation suite for the four gates whose block paths need staged index state, a non-main branch, or a fresh lane claim (`branch-guard`, `plan-row-allocation-gate`, both `fan-depth-gate` modes). Item 3 is PARTIAL until it exists.
  owner: next R-06 lane, or the integration seat
  plan_row: R-06
- item: red CI on `main` (4 REGRESSED rows, first failure `C-00 vehicle sync` / stale `.cursor/rules/enforcement.mdc`)
  owner: dispatch-planner
  plan_row: not this card's; surfaced here
- item: `CANON-MATCHER-EDIT-GAP` and `PROBE-CLOSE-RANGE-DRIFT`
  owner: planner triage
  plan_row: R-06 follow-up

## What this close does not claim

It does not claim every gate was individually injected; item 3 says PARTIAL and the table says which rows are inferred. It does not claim a green CI build. It does not claim the four INFERRED block paths work, only that their allow paths do. It does not claim the three CANNOT-BLOCK gates enforce anything, because they do not. It does not claim `cited-untracked` is clean at 113 hits; only that this lane added one of them and the commit clears it.

Nothing is committed. Doc_repo commits are planner-owned; the tree is left clean of staged work for review.
