# Planner acts, OPS-17, integration seat, 2026-09-18

Snapshot: `P:/doc_repo`, branch `main`, base commit `a86f2f39`, integration seat. This session's commits:
`54e46861` (A-159 batch), `02c57512` (scratch correction), `a16a6111` (g153's two `check.mjs` plus the
regenerated tracker).

## 1. g152 is RECOMPILED and READY TO HAND-CARRY

`g152`'s precondition under `A-154` was "a filed `g153` close". That close is now on disk
(`_inbox/2026-09-18_g153-fleet-police-lens_close.json`, `closedAt 2026-09-18T20:38:32Z`, seat
`cente-vsc-g153`, `planRows ["G-153"]`, status `closed`), so the precondition is met.

The compiled dispatch was **stale on contact** and was recompiled rather than handed as written:

| | before | after |
|---|---|---|
| `_dispatches/2026-09-18_g152-public-works-fire-ems_dispatch.md` | 25,337 bytes, 15:21 | **26,848 bytes, 16:19** |
| `g153-fleet-police-lens is RUNNING in this repo right now` | present | **0 matches** |
| `g148-design-instruments ... is editing four OTHER design folders while you run` | present | replaced (g148 has CLOSED, per A-158) |

Markers after recompile, read back from the file: `CANON-PREAMBLE v49001500`,
`AGENT-CONTRACT v378cd643`, `DEV-PROCESS vbb19bd34`, `FLEET-MEMORY v2a98086b`, `PLAN-ROW: G-152`,
`FAN-DEPTH: 0`. The preamble hash is unchanged, so the `_STATE.md` regeneration did not invalidate it.

The mission (`_catalog/dispatch_missions/mission_g152_public_works_fire_ems.md`) was corrected, not the
dispatch: the dispatch is compiled, so hand-editing it would be the defect. Two changes:

- The stale liveness was replaced with the close's path, timestamp and seat, plus an instruction to
  re-run `lane-claim.mjs status` rather than wait. Registry state at 16:15: **7 claims, every one STALE,
  none of them a SmartCity lane.**
- `g153`'s outcome was carried forward, because it bears directly on g152: g153 closed `CLOSED-PARTIAL`
  and not `CLOSED` for exactly the clause g152's own acceptance also ends with (`and both are reached on
  the DO app per D-12`), and g153's largest `leave_behind` (the vendor mapping below) is unowned and not
  g152's.

**Expected shape of the g152 close, stated so it is not misread as a lane failure:** the same
`CLOSED-PARTIAL` at the `D-12` clause. `M4` reads 4/6 and the operator owns the deploy.

## 2. `design-instrument-exits.mjs --violate` is BLOCKED, and I did not force it

The guard refuses before running anything:

```
REFUSED: _design is not clean (1 path(s)), so this run could not tell its own
damage from yours. Commit or restore first, then re-run. Nothing was run.
  - _design/exports/send/
```

`_design/exports/send/` holds **12 untracked PNGs** (flood study, plan review, finance tax filings
exports). They were untracked at session start, so they are not this session's, and they are not
gitignored: `git check-ignore` on an individual file exits 1.

I did **not** commit them, and I did **not** widen the guard. Both are deliberate:

- Committing them would add binary exports to a repo that is **PUBLIC on GitHub**, and the export set
  includes finance and tax-filings boards. Those designs were drawn against a real capture; the dev
  services design had to remove "three residents named beside their addresses". Whether these renders
  are safe to publish is not a call this seat can make from the file names, so it is routed, not assumed.
- Widening the precheck so a run can pass is the exact move `DEV_PROCESS` and `ENFORCEMENT.md` forbid.

**Consequence, stated plainly: DESIGN-vs-UNPROVEN ownership across the 18 instruments is still
unestablished from this seat.** The per-instrument `check.mjs` exit codes are known (18 run, 4 failing,
the four A-158 designs); the ownership half needs `--violate`, which needs the tree clean.

**The one action that unblocks it:** decide whether `_design/exports/send/` is tracked canon (commit
it), or is outbound staging (add it to `.gitignore`). Either resolves the guard. The third option,
changing the guard to ignore untracked paths, is a control change and needs its own decision.

## 3. A CONCURRENT WRITER IS EDITING OPS-17 IN THIS WORKTREE

Recorded because it changed what this seat could do, and because it is a writer-slot violation.

- The tracker PASSED at session start reading 361 closes, then REFUSED at exit 1 reading 364, with
  `DISAGREE row=open close=closed` on `G-153`, `G-160` and `G-162`.
- At 16:12 this seat read those three rows as `OPEN` and drafted their regrade. At **16:13:35** the
  OPS-17 file was rewritten by another writer to `CLOSED-PARTIAL` for all three, with
  planner-at-source verification text, and the tracker PASSED. That writer also added its own `A-160`,
  which is about `smartcity-os`'s repo-intent posture and **not** about the regrade.
- This seat's `StrReplace` anchors then failed to match, which is the only reason the concurrent write
  was detected. `git log` shows HEAD is still this session's commit, so **the other writer's OPS-17 edit
  (`5 insertions, 3 deletions`) and the three closes are UNCOMMITTED and untracked.**

**A-154 governs and this seat complied: an uncommitted tree that is not yours is not yours to clean,
stash or commit.** Nothing of theirs was touched.

**Independent convergence, which is evidence the regrade is right rather than merely present:** this
seat's own reading before the collision was that G-153 must be `CLOSED-PARTIAL`, because the row's
done-when ends `and both surfaces are reached on the DO app per D-12` while the close's own
`openThreads` say the deployed app still serves the pre-fix build. Two derivations, one answer.

## 4. OWED, and by whom

- **`A-161`, owed to the plan of record (planner):** record the three regrades, the g152 recompile and
  the liveness correction. **Not written, because OPS-17 is the other writer's live uncommitted file.**
  It should be added as soon as that writer commits or stops.
- **OPS-17 frontmatter `last_updated` is `2026-09-18T15:30:00Z`**, which predates both `A-159` and the
  regrade. A bump is owed with the same batch.
- **`_state/govtech/STATE.md` is OWED to the govtech seat** (`P:/seat-worktrees/govtech/doc_repo`,
  `seat/govtech`). The seat gate refuses any `_state/<ns>/` write from integration and this seat did not
  route around it. Draft content is filed at
  `_inbox/2026-09-18_planner_govtech_state_update_for_seat.md`.
- **`G-164` is the only row between the design gate and exit 0.** `design-completion-gate.mjs` now exits
  1 with four R3 findings, which is the intended consequence of A-159.

## 5. VERIFICATION RUN THIS SESSION

- `smartcity-tracker.mjs`: **PASS**, exit 0, 26/26 self-tests, reading 118 OPS-17 rows and 364 closes.
- `design-completion-gate.mjs`: **exit 1**, `UNFINISHED - 4 findings`, naming `plan-review-departments`,
  `smartcity-flood-study`, `smartcity-map-dock`, `smartcity-overview-lens`.
- `design-completion-gate.test.mjs`: **27/27 self-tests passed, both directions.**
- `design-instrument-exits.mjs` (plain): 18 run, 4 failing; **no `instrument-report.json` churn** after a
  full gate run, which is the enabling half of A-159 holding.
- `design-instrument-exits.mjs --violate`: **REFUSED, nothing run** (section 2).
