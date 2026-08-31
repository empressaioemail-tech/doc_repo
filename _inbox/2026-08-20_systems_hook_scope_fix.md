---
artifact: systems_hook_scope_fix
date: 2026-08-20
seat: systems agent
status: CLOSED
hold: items 3-7 unchanged. Literal-word matcher not replaced.
---

# Hook scope fix

## Snapshot

doc_repo at start of this pass was `33ffb15` on `main`. `_STATE.md` was worktree-clean. C-00 ran ok after the vehicle edit.

## What changed

`.claude/hooks/_git-repo-target.ps1` is the shared resolver. `branch-guard.ps1` and `dirty-tree-close-gate.ps1` both use it. Target repo is `git -C`, then `cd`, then tool `working_directory` / payload `cwd`, then hook-process `Get-Location`. Dirty-tree now treats `git -C <path> push` as a push of that path. Override log writes `target=` and `cwd=` instead of the constant reason string.

## Proof by violation

`_STATE.md` was dirtied with a sentinel and restored with `git checkout -- _STATE.md`.

- `git -C P:/doc_repo push origin main` while dirty: exit 2 (hole closed; before the fix this command missed `\bgit\s+push\b` and exited 0)
- `git push origin main` with `working_directory` `P:/smart-markets` while `_STATE.md` dirty: exit 0
- `git -C P:/legacy-design-tools push` while `_STATE.md` dirty: exit 0
- `CLOSE_OVERRIDE=1 git -C P:/doc_repo push origin main` while dirty: exit 0, log line `target=P:/doc_repo cwd=P:/doc_repo`

That last line is a seventeenth CLOSE_OVERRIDE, written by the proof. The prior sixteen remain the identical-reason cluster. Do not fold the proof row into the eleven-today figure. A control verified by violation generates events indistinguishable from the ones being counted; this is that case, named and excluded.

The distinction the operator told this seat lived in the override log did not live there. From the proof row onward it does, prospectively: `target=` and `cwd=`. The historical eleven stay a rate without reasons. Everything after them will carry both.

## Resolver residual

The chain is git -C, then cd, then tool working_directory or payload cwd, then process cwd. Process cwd is the fallback, and process cwd is what produced the defect. That is an accepted residual, considered, not a row. The first three cover the cases where process cwd is wrong. When none of those match, git itself runs in the tool's shell cwd, and the assumption is that hook-process cwd equals that shell cwd. Unknown target is collapsed into that default rather than represented as its own state. Fail-closed on unknown would block ordinary commits in any harness that omits cwd and train the bypass. Fail-open on unknown would recreate the silent miss. Process cwd is the least-wrong of three bad options, named as a default, not as a determination. Stated in `_git-repo-target.ps1` at the fallback and in doctrine revision 6.

## Silent half

Over-broad and under-narrow had the same root. The over-reach was visible because it blocked work. The miss (`git -C P:/doc_repo push` while the process cwd was elsewhere) produced no complaint from anyone. Where a scope defect surfaces through friction, go looking for the silent half. Filed as doctrine revision 6.

## Not done

Literal-word matcher unchanged. The guard still cannot distinguish a command that commits from a command that mentions committing. Hygiene row restated.

Items 3 durability commit, 4 already done, 5 leave-behind close field, 6 control registry, 7 DEV_PROCESS xref: held.

## leave_behind

none. Shared helper is the mechanism, not an orphan.
