---
id: 2026-09-18_r06_cursor_harness_parity_WDLL
title: WDLL — R-06 Cursor harness parity and the state-file budget
status: complete
last_updated: 2026-09-18
closed: 2026-09-18 — 8 items met, 2 partial (3 and 4), 0 dropped. Grading and evidence in the Finish card below and in _inbox/2026-09-18_r06_cursor_harness_parity_close.md.
operator_approval: 2026-09-18 (approved as written; items 7 and 8 armed as Variant A, the ratchet)
plan_row: R-06 (OPS-18 canon reconciliation and governance plan of record, rowPrefix R)
related:
  - 90_operations/OPS-18_canon_reconciliation_plan_of_record.md
  - _catalog/tooling_register.json
  - _catalog/tooling_register.md
  - .github/workflows/enforcement.yml
  - _state/systems/STATE.md
source: operator request 2026-09-18 ("look at what we have set up in terms of agent rules and how this cursor platform is set up and tell me if you need anything added so you run optimally"), answered on the three AskQuestion cards in that session
---

# WDLL: R-06 Cursor harness parity and the state-file budget

Date: 2026-09-18  Status: approved
Operator approval: 2026-09-18. Variant A selected for items 7 and 8.
Plan row: R-06 (OPS-18). The row's own exit criterion is "each new control proven by violating it, never by watching it pass", which is the discipline this card is written to.
Seat: integration (`P:/doc_repo` on `main`). Read and write scope is doc_repo only.

## Where this came from

A single question from the operator, asked because a Cursor session spends its first action reading rules rather than working. The audit found two enforcement vehicles at very different strengths. Claude Code registers eleven distinct gates across four matchers. Cursor registers exactly one script, `seat-gate.mjs`, on three events. Everything else is Claude-only: no canon gate, no dispatch-template gate, no branch guard, no dirty-tree close gate, no plan-row allocation gate, no fan-depth gate on subagents, no probe or traffic-lease gate, and no read-side divergent-canon check.

That gap is not merely an absence, because `AGENTS.md` tells every agent, including Cursor agents, that "the canon-gate hook blocks anything missing the compiled markers, and that block is the system working". On Cursor that sentence is false today. `_catalog/tooling_register.md` already marks the four instruction `.mdc` vehicles `UNENFORCED`, and R-04's own summary counts zero armed register consumers. This card arms consumers on the harness that actually runs the fleet's execution agents.

Two further findings came out of the same audit and are folded in because they are the same defect class: a control that reports success while deciding nothing.

## Two corrections to the audit that produced this card

Recorded here rather than quietly dropped, because both went to the operator in the audit answer and one of them was wrong.

1. **The DigitalOcean token is ruled, and my read of it was wrong.** I reported it as a full-account token exposed to every project. The standing decision of 2026-09-17 says the `do-apps` and `do-droplets` servers are deliberately configured fleet-wide in the global Cursor config with an agent token scoped to Droplets and Apps only, with no account, database, or networking access, and it says explicitly not to ask the operator to reconfigure the servers or the token. The tools I enumerated (`droplet-delete`, `rebuild-droplet`, `image-delete`) are inside that scope, not evidence against it. Withdrawn. The `hk_pro_*` plaintext keys and the local `127.0.0.1:3000` Hauska endpoint remain reported facts, not asks.

2. **A per-seat byte cap cannot be both meaningful and non-blocking without a trim that is not mine to make.** The operator selected the cap. A cap the tree already fails blocks every session close until it is cleared, and a cap the tree already passes is a dormant control, which `ENFORCEMENT.md` ranks as worse than absent. `_state/property/STATE.md` is 213,766 bytes against a combined `_STATE.md` of 230,044, and the read-state-first rule forbids me from writing another seat's state file. So the cap needs a shape decision, carried as items 7 and 8 below.

## Done looks like

A Cursor session in doc_repo reaches the same enforcement decisions as a Claude Code session, through one shared payload normalizer rather than duplicated payload parsing. Every gate registered on Claude Code is either registered on Cursor or carries a written exclusion naming the state that is genuinely unreachable on Cursor. Every newly registered Cursor gate was observed blocking an injected defect and observed allowing a byte-identical restore. The Cursor hook file is audited for loadability by CI, `_STATE.md` drift is checked in CI, and `generate-combined.mjs` refuses to emit a combined file that exceeds a declared per-seat budget, with that refusal shown able to fire.

## Acceptance items

1. One normalizer, both payload shapes. `.cursor/hooks/normalize-payload.mjs` maps a Claude PreToolUse payload (both the top-level array form and the `{tool_name, tool_input}` form) and a Cursor payload onto one internal shape carrying toolName, command, cwd, filePath and agent prompt. | check: `node .cursor/hooks/normalize-payload.test.mjs` asserts both shapes resolve to the same values, and carries an explicit not-vacuous fixture asserting that the pre-fix behavior (a Cursor-shaped payload yielding an empty command) is what the normalizer exists to prevent. | grade: [ ]
2. Gate parity is enumerated, not asserted. A control enumerates the registrations in `.claude/settings.json` and `.cursor/hooks.json` and reports the difference; every gap is either filled or carries a written exclusion naming the unreachable state. Example exclusion to be justified or dropped: the `Read`-matcher canon-divergence check has no Cursor event that intercepts file reads. | check: `node scripts/enforcement/harness-parity.mjs` exits 0 with zero unexcused gaps, and was observed exiting 1 with one gate's registration removed. | grade: [ ]
3. Every ported gate is proven by violation, per gate. For each newly registered Cursor gate: inject the defect it exists to catch, observe the block, restore byte-identical, observe the allow. Evidence is a per-gate row naming the injected defect, the command, and both observed results. | check: the close artifact's violation table. | grade: [ ]
4. No ported gate blocks ordinary work. With the new gates registered, a live Cursor session allows an ordinary `git status`, a Write into `_inbox/`, and a staged `git commit`. A gate that fires on ordinary work is removed from registration in the same commit that registered it. | check: observed in this session after registration, recorded in the close. | grade: [ ]
5. `hooks-loadable.test.mjs` audits the Cursor hook file. The control reads `.cursor/hooks.json` alongside the Claude settings and fails when a registered Cursor hook cannot load or its script path cannot be parsed. The control exists because a registered Cursor hook was dead for weeks, so leaving that file unaudited is the same defect one level up. | check: restore the historical `../scripts` import, observe exit 1 naming `.cursor/hooks.json`; restore the fix, observe exit 0. | grade: [ ]
6. `check-generated.mjs` runs in CI and is ratcheted. A named step in `.github/workflows/enforcement.yml` plus a pinned row in `.github/enforcement-baseline.json`, so `_STATE.md` divergence from its seat files is caught where the fleet cannot forget it. | check: inject a one-byte drift into `_STATE.md`, observe non-zero, restore, observe 0; then the same through `ci-baseline.mjs`. | grade: [ ]
7. The state generator enforces a declared per-seat budget, and the refusal is proven able to fire. The budget lives in a tracked file, not in code, so lowering it is a visible commit. The refusal path is exercised on a fixture root, which proves the control can fire without editing another seat's file. | check: fixture-based self-test in both directions, refusal and pass. | grade: [ ]
8. The armed budget is one the tree can meet, and the blocking seat is named. Either the largest seat fits the budget at arm time, or the refusal output names the offending seat and its byte count so the owning seat can clear it. Generation must never be left in a state no seat is able to clear. | check: one `node scripts/state/generate-combined.mjs` run at arm time, its output pasted into the close. | grade: [ ]
9. One register row per new control. Each new or newly registered control gets a row in `_catalog/tooling_register.json` with executor, trigger, failure, bypass, `violationVerified` and `derivationClass`, passing `tooling-register-schema.mjs`. A new control that cannot state a bypass has not been thought about. | check: `node scripts/enforcement/tooling-register-schema.mjs` exit 0, and observed exit 1 on a row with a field removed. | grade: [ ]
10. The claim in canon matches the harnesses that carry it. No canon doc, `AGENTS.md` included, asserts a gate is armed on a harness where it is not registered. | check: read the sentence in `AGENTS.md` and the corresponding line in `_catalog/tooling_register.json`; both agree with `.cursor/hooks.json` at this commit. | grade: [ ]

## Open decision carried in this card

Items 7 and 8 need an operator choice on shape, because the two shapes have different failure modes.

**Variant A, ratchet (recommended).** A tracked `_state/state_budget.json` pins a per-seat byte ceiling at today's sizes, and the generator refuses when a seat GROWS past its pin. It fires immediately on growth, it never deadlocks a close, and each pin is lowered as a seat trims. This is the same shape as `.github/enforcement-baseline.json`, which the fleet already understands, and it is the only shape that stays armed while the property trim is outstanding.

**Variant B, flat budget with refuse.** A single ceiling the whole tree must meet (for example 32 KB per seat), refusing until property trims. It solves the 230 KB read in one step, and until the property seat trims it blocks `_STATE.md` regeneration for every seat in the fleet. Sequencing would have to be trim-first, arm-second, and the trim is a property seat action, not an integration one.

Recommendation: Variant A now, because it is armed and able to fire today, and because arming it produces the exact evidence needed to hand the property trim to its owner as a named ask with a number attached. Variant B is the destination; A is the vehicle that gets there without a fleet-wide close outage.

## What this card does not do

Does not add a gate on Cursor's `beforeMCPExecution`, because no such gate exists on the Claude side and parity is the target, not expansion. Does not change enforcement behavior for Claude Code sessions, beyond whatever the shared payload normalizer touches, and any such touch is re-proven by violation on the Claude side too. Does not trim or edit another seat's `STATE.md`. Does not touch product repos. Does not raise any `baselineExit`, per `.github/enforcement-baseline.json` `_howToChange`. Does not add a bypass flag; a new bypass is the defect this card exists to reduce.

## Amendments

None yet.

## Finish card (graded at close)

Graded 2026-09-18 against the tree at HEAD `e9a9064a` plus this lane's uncommitted edits. Full evidence and the per-gate violation table: `_inbox/2026-09-18_r06_cursor_harness_parity_close.md`.

Start-vs-Finish diff, item by item:

| # | Item | Grade | One line of evidence |
|---|------|-------|----------------------|
| 1 | One normalizer, both payload shapes | met | normalizer suite exit 0, incl. the not-vacuous pre-fix fixture |
| 2 | Gate parity enumerated | met | harness-parity exit 0, no unexcused gaps; removal observed as exit 1 |
| 3 | Every ported gate proven by violation, per gate | **partial** | 6 observed blocking, 4 inferred-block with allow observed, 3 cannot block by design; fixture-repo suite is the named leave-behind |
| 4 | No ported gate blocks ordinary work | **partial** | ordinary shell and `_inbox/` Writes allowed; a staged commit was not observed, since no commit was made |
| 5 | hooks-loadable audits the Cursor hook file | met | historical import restored -> exit 1 naming `.cursor/hooks.json`; restored byte-identical -> exit 0 |
| 6 | check-generated in CI and ratcheted | met (caveat) | step + BLOCKING pin 0; one-byte drift -> exit 1, restore -> 0. CI build is red for unrelated pre-existing reasons |
| 7 | Budget refusal proven able to fire | met | 13-check self-test, both directions, on fixture roots |
| 8 | Armed budget is one the tree can meet | met | generator exit 0 emitting 228,833 bytes; no seat blocked |
| 9 | One register row per new control | met | 52 rows, schema exit 0; row with a field removed -> exit 1 |
| 10 | Canon claim matches the harnesses | met (one word filed) | canon-gate registered on Cursor through the adapter; "anything" is over-broad, see CANON-MATCHER-EDIT-GAP |

Two items dropped nothing and two are honest partials. No item was silently absorbed and there were no amendments.

Three defects were found by reviewing this lane's own work and are FILED, not fixed, each with the reason: `CANON-MATCHER-EDIT-GAP` (the file-EDIT tool reaches no posture check on either harness), `PROBE-CLOSE-RANGE-DRIFT` (a stale gated row range plus the dormant detector that already reports it), and a pre-existing red CI build on `main` that this lane did not cause and verified against a pristine worktree at HEAD.
