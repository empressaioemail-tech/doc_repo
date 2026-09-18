---
id: 2026-09-18d_HANDOFF_smartcity_planner
title: Handoff - OPS-17 SmartCity planner (next wave compiled, three lanes in flight, gate green while all four instruments it counted fail)
date: 2026-09-18
last_updated: 2026-09-18
status: open
kind: handoff
owner: nick
seat: integration
programs: [OPS-17, OPS-25]
snapshot: doc_repo main ed457a78 at open; smartcity-dashboards origin/main 7487d7c0; smartcity-os origin/main 1f0262f1; design gate read 2026-09-18T20:32:13Z, exit 0, and all four instruments it counted fail
covers: _sessions/2026-09-18c_smartcity_next_wave_and_design_gate_claude_code.md
---

# Handoff: the SmartCity planner seat, 2026-09-18 evening

## Who you are, and the one constraint to get right first

You are picking up the planning agent for SmartCity, working OPS-17 (govtech) and OPS-25 (cloud) rows.
You own **no product repository**: your writes are docs, dispatches, decisions and instruments in
`doc_repo`.

**The harness puts this session in the `integration` seat, and the register is explicit that it is "Not a
planner seat" and "does not write seat namespaces"** (`_catalog/seat_register.json`), enforced by
`scripts/enforcement/seat-worktree-gate.mjs:156-162`, which refuses any `_state/<ns>/` path from here with
code `namespace_from_integration`. So: **do not write `_state/govtech/STATE.md` or any other `_state/`
file.** The OPS-17 work still runs from this worktree, which is how the previous SmartCity sessions ran it.
If you need the govtech state file updated, that is a change for `P:/seat-worktrees/govtech/doc_repo` on
`seat/govtech`, and it is owed.

Regenerating `_STATE.md` at the repo root is allowed, because that file is not a seat namespace.

## Read in this order, before doing anything

1. `_STATE.md` then `_catalog/seat_register.json` (the two above).
2. `90_operations/OPS-17_govtech_stack_plan_of_record.md`. Read the last six amendments, **A-150 through
   **A-155**, in that block near the end of the file, then the rows for G-146, G-148, G-149, G-152, G-153,
   G-155, G-157, G-160, G-162, G-163. Rows are 7 cells; the read helper pattern is in `P:/tmp/rows.mjs`.
3. `_inbox/2026-09-15_roadmap_reconciliation.md`. It is the narrative: milestones, order, blockers, and
   what has been promised to Bastrop.
4. `90_operations/OPS-25_cloud_infrastructure_and_cost_program.md`, amendment **A-10** (the ship) and rows
   D-12 through D-14, D-20.
5. `_scratch/ops17_smartcity_planner.md`. Read it BEFORE re-deriving anything; it carries the ground-truths
   and the lessons, including several traps that cost time today.
6. Run the three instruments rather than quoting them: `node scripts/govtech/smartcity-tracker.mjs`,
   `node scripts/govtech/design-completion-gate.mjs`, and `node scripts/govtech/design-instrument-exits.mjs`.
   All three refuse rather than guess. **The third is new and is the one to run after the gate**: the gate
   reports that every design past DRAFT *carries* an instrument, and this one reports each instrument's
   **exit code** beside the gate's verdict, because the gate does not read exit codes. Add `--violate` to
   derive whether a failure belongs to the design or the instrument. `--self-test` is 6 of 6.

## Where things are, as of this handoff

**In flight, four lanes.**

| Lane | Row | State |
|---|---|---|
| `g153-fleet-police-lens` | G-153 | RUNNING, claimed by `cente-vsc-g153`. First lens build. Also carries **G-135's parcel 2**, the full-shell `bastrop_tx` probe that mounts the map iframe. Artifacts current: fleet and police check and violate runs, a live record refusal, a full-shell probe. |
| `g148-design-instruments` | G-148 | RUNNING, claimed by `cente-vsc-g148`. **All four instruments delivered**, which took the gate from four R3 lines to none and `exit 0`. **All four FAIL**, which is the finding, not a lane failure. Files UNCOMMITTED in `_design/`, which is correct. |
| `g162-v1-finance-honesty` | G-162 | RUNNING, **UNCLAIMED**. Three production finance defects. |
| `g160-served-commit-parity` | G-160 | PARCEL 2 handed off. The check is built and proven on two unmerged branches: **nothing triggers it**, **no deploy sets `SERVED_COMMIT`**, and a live run REFUSES at exit 2. |

**Compiled and deliberately NOT handed over.** Send each only after the lane it names closes:

- `_dispatches/2026-09-18_g152-public-works-fire-ems_dispatch.md` (G-152) — wait for **`g153`**. The next
  dashboards lane.
- `_dispatches/2026-09-18_g163-opaque-platform-routes_dispatch.md` (G-163) — wait for **`g162`**. Two
  platform routes that answer an opaque Cloudflare `504` where the GCP copy named the vendor permission.

**Startable after those:** G-151 (Parks) behind G-152, then G-149 (flood study) behind both G-153 and
G-148.

**Everything else in M1 and M2 is operator-blocked** rather than planner-blocked: G-134 on WorkOS
credentials, G-143 on ratification, G-127/G-144/G-158 behind those, G-157 on a v1 capture, G-137 on the
Azavar reply. G-138 is planner-owned design work.

## The three things most likely to bite you

**One. The design gate is now GREEN, and all four instruments it counted FAIL. Do not read `exit 0` as "clean".**
The gate reached `exit 0` / `verdict: FINISHED` at **2026-09-18T20:32:13Z**, reading `20 design folders, with an
instrument: 18` and zero findings under every rule. Its R3 rule tests that an instrument EXISTS, never that it
passes (`design-completion-gate.mjs:157-163` runs `hasCheck`, reads no exit code), and its own wording is honest
about that ("carries an instrument"). But the state at that same moment is four designs wrong by their own
instruments, and they are the four `g148` delivered: `smartcity-overview-lens` exit 1, `smartcity-flood-study`
exit 1, `smartcity-map-dock` exit 1, `plan-review-departments` exit 1. **These are design defects, not
instrument defects**, and that is proven rather than assumed: each folder's `violate.mjs` exits 0, catching its
planted violations on a real artboard (`plan-review-departments` 17 of 17) and confirming a repaired copy
passes. `node scripts/govtech/design-instrument-exits.mjs` reports all of this in one run and derives the
ownership for you; run it rather than re-deriving it by hand. **No row owns these four repairs**, so they are
exactly the kind of work that falls between lanes.
An operator ruling is owed on whether the gate should run what it counts and whether to card the repairs
(OPS-17 `A-155`, `A-156`, `A-157`). Do not close G-146 on a green gate; A-152 already ruled that it does not close even
with all four instruments landed.

**Trap, from this session, and it is in the tools rather than in the designs.**
`design-instrument-exits.mjs --violate` runs instruments that plant defects into TRACKED design boards and
restore them, so it writes to canon. Running 18 of them in a loop with nothing verifying restoration left
`_design/smartcity-records-search/Main.dc.html` (tracked, RATIFIED, G-147 CLOSED) with its
`data-coverage-rule` element stripped, and only `git status` found it. The instrument now refuses a dirty
`_design`, verifies restoration after each `violate` run, and names every file it restored. **If you run any
design instrument, run `git status -- _design` afterwards and do not trust a sweep to clean up after itself.**

**Two. The flood-study finding is entangled with a broken parser, and neither half can be fixed alone.**
The design says the local rainfall atlas is uncited; the engine cites NOAA Atlas 14 seven times; and
G-125's leave-behind is that `parsePfdsDepthTable` never matches so every county falls back to Bastrop's
9.5in. A design-only correction would make the page agree with a value the parser invents. G-149's mission
must carry both.

**Three. The claim guard fires only when a lane runs it.** `g153` and `g148` claimed; `g162` is running
unclaimed; `g160` stopped without one; and the earlier wave (`d14-d13-v1-reach`,
`g161-never-default-a-city`) never appeared in the registry at all while both ran to a landing. **Before
believing a lane is running, read `node scripts/lane-claim.mjs status` and read the lane's artifacts on
disk.** Lanes can also file no close at all: `d14-d13-v1-reach` holds no claim, filed no close, no CP1 and
no CP2, and both its rows moved on planner acts.

## Traps that cost time today, so they do not cost it again

- **`_state/` writes from this worktree are refused.** See above. Do not fight it.
- **A markdown table row has two index bases.** `split(/(?<!\\)\|/)` keeps the leading empty element so
  status is `parts[7]`; `slice(1,-1)` makes it `c[6]`. A script written against one and reading the other
  silently overwrote the BLOCKED cell on two rows, and the tracker did not catch it because the status was
  untouched. Assert the current value of any cell you are about to write.
- **The tracker refuses a status whose LEADING word is out of vocabulary** and exits 2. `DISPATCHED` must
  follow the class word (`OPEN, DISPATCHED 2026-09-18 (A-154), ...`). Do not widen the vocabulary.
- **Two runs of one instrument are ONE derivation.** Independence is a property of the source, not of the
  run count. Several checks in this program fold on this.
- **Do not commit PowerShell `*.log.txt` artifacts.** They are UTF-16LE and git stores them as binaries
  no `rg` can read. The `.json` is the artifact of record.
- **`smartcity-os`'s local checkout sits on the side branch `d9-api-8bea7fa`, not `main`.** Read
  `origin/main` before concluding anything about that repo.
- **`g148` left debug debris** (`.dbg.mjs`, `.check.log`, `.violate.log` in `smartcity-flood-study`). It
  must not reach a commit.
- **Raw `*.ondigitalocean.app` hostnames for `walrus-app` and `dolphin-app` reset the connection from this
  network** (ECONNRESET). Read them through the apex instead.

## Owed by the operator

- Tell Bastrop staff to use `app.smartcityos.io`, which starts the D-12 bake. Highest leverage on the board.
- WorkOS org, client id, API key, MFA. Then ratify **G-143**, one signature that unblocks G-127, G-144 and
  G-158.
- Whether the design gate should RUN the instruments it counts, and whether to card the four design repairs
  that no row owns (`smartcity-overview-lens`, `smartcity-flood-study`, `smartcity-map-dock`,
  `plan-review-departments`).
- The flood-study rainfall claim, or leave it to G-149.
- Hand-carry: `g160` parcel 2 now; `g152` and `g163` when their lanes close.
- The standing queue: the Azavar reply and Khalid's answers (M2 is HELD by the operator), Bastrop's finance
  owner on the MyGov fee window, an offboarding owner and turnaround, the `*_MCP_URL` secret renaming (do
  not rotate), the 2026-09-14 ruling amendment, the stale design links, and the blending ruling.

## How this program's rules will catch you

**A merged PR is not a done row.** `deploy_on_push` is unset on all three DigitalOcean apps, so a merge
deploys nothing; every ship is a deliberate act with `source_commit_hash` read back byte for byte. **A
status is never graded from a lane's report**; it is read at source, and the tracker refuses when a row
and its close disagree.

**Dispatches are compiled, never written by hand:** `node scripts/dispatch.mjs --plan OPS-17 --lane <id>
--plan-row <G-nnn> --mission-file <path> --repo <repo> --fan-depth 0`, then verify the markers against
source before hand-carrying. The canon gate blocks anything without them.

**Close the session the way this one did:** update the OPS-17/OPS-25 amendments and the roadmap, write the
Tier 2 scratch block, write `_sessions/<date>_<topic>_claude_code.md`, regenerate `_STATE.md`, then commit
**by explicit pathspec** and present the commit. Doc_repo commits are planner-owned; subagents do not
commit.
