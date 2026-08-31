# Mission — land the two CTX handbacks

Two artifacts were produced and reviewed at source by the planner and never
merged. Both are property-seat repos. The planner (integration seat, `P:/doc_repo`)
cannot land them: SEAT-01 refuses writes outside a registered seat worktree, and
integration owns no product repo.

Gate 8 is the gate holding **all four P4 rails**. It is the highest-value item on
the CTX board.

## Handback 1 — Gate 8 dayOne fix (hauska-factory) — UNBLOCKS P4

Location `P:\tmp\gate8-dayone-w1`, branch `main`, base `a7a8042` (= `origin/main`
as of 2026-08-31). Five files, 703 insertions, 36 deletions:
`scripts/gate8/floor.mjs` (new), `scripts/gate8/fixtures/refused-server.mjs` (new),
`scripts/gate8/run.mjs`, `scripts/gate8/wire.mjs`, `test/gate8.test.mjs`.

**Defect in the handback tree itself, found 2026-08-31, do not trip on it.** The
five paths are in the index in **intent-to-add** state: `git status` prints
`new file:` under "Changes not staged for commit", `git ls-files -v` reports `H`,
and `git diff --cached` is **empty**. The content exists only in the worktree. A
plain `git commit` from that tree commits **two empty files** and a green-looking
PR that does nothing. Stage all five by explicit pathspec and confirm
`git diff --cached --stat` reports 703 insertions **before** committing.

`P:\tmp\gate8-dayone-w1` is an unregistered tmp clone. Move the change into the
registered worktree `P:/seat-worktrees/property/hauska-factory-gate8` (already in
`_catalog/seat_register.json`) rather than working in `P:\tmp`.

What the fix does, per the planner's review at source: the floor sits **in front
of** dayOne and consults `fetchVerdict`; `retryOnce` now defaults false; an empty
body returns `refused`; the inhabited arm stays C3/C4/C7 **fail**. Verified by
violation: mutating it back reproduces `pass/pass/pass` on an empty body.

**The inhabited C3/C4/C7 fail is the correct output, not a regression to fix.**
The 03:38Z run printed pass on an empty body; the last inhabited run at 02:56Z
failed all three. Do not make the inhabited arm pass.

Completion: merged on a CI conclusion **string** `success` against the current
base, then dayOne re-run against an **inhabited** body producing a non-vacuous
grade. A merged PR is not the gate. P4 apply starts on the inhabited re-read, not
on the merge.

## Handback 2 — landUse bake projection (legacy-design-tools) — rides Wave R

Patch `P:/tmp/landuse_bake.diff`, 27,465 bytes, 5 files plus a 286-line test,
targeting `artifacts/api-server/` (first hunk `src/lib/joinIntegrityGate.ts`).

Written test-first: 17/17 watched failing, then passing; 150/150 across suites.

**It moves no live row until the conformant publish bake re-runs per county**, so
it rides Wave R and does not gate P4. Land it; do not trigger a bake to prove it.

Apply into a registered LDT worktree, not `P:/tmp`.

## Two operator rulings to execute alongside

**Seed does not apply to a CAD to CAD join.** The landUse `prop_id` roll join is
clear on 48209 and 48491. The seed's risk was cross-namespace TxGIO to CAD; this is
one namespace, both sides CAD.

**McLennan easements: wipe the coverage claim, keep the provenance.** Replace the
two `gis-layer` rows with `county-absence` carrying `probed_at` and a basis naming:
source withdrawn, AGOL org live and publishing zero services, prior T3 counts
44,197 / 16,578, county purged for reload, prior corpus unreliable. **Check
consumers before the wipe.** `landing_easement_gis` was created recently so
consumers are almost certainly zero, but retirement order is consumers first, and
an empty consumer set must be *measured*, not assumed.

## Do not

- Do not work in `P:\tmp`. SEAT-01 refuses it and it is the shared-checkout failure
  the control exists to prevent.
- Do not commit before confirming staged content, per the intent-to-add defect above.
- Do not merge on a stale green. Re-green against the base as it is at merge time
  (`gh api ... update-branch`; `git rebase` is blocked).
- Do not make the Gate 8 inhabited arm pass.
- Do not trigger a bake or a publish from this card.
- Do not treat a merged PR as customer-done.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare
snapshot (repo, branch, commit) in the first output. State the falsifier for each
check before running it. `leave_behind` named, `none` is valid. Subagents do not
commit. Verification does not delegate below the lane planner.
