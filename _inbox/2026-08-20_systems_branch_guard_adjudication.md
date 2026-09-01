---
artifact: systems_branch_guard_adjudication
date: 2026-08-20
seat: systems agent
status: CLOSED_REJECTION_HOLDS
hold: hook scope fix not taken this pass. Counted first.
related: [.claude/hooks/branch-guard.ps1, .claude/hooks/dirty-tree-close-gate.ps1, _inbox/2026-08-20_hy01_deletion_attribution.json, _inbox/2026-08-20_systems_hook_resolution_for_markets.md, _scratch/systems.md]
---

# Branch-guard contradiction adjudication

## Snapshot

Declared 2026-08-20T14:01:03Z.

- `P:/doc_repo` HEAD `ffa12b072c07cd5d601519b10a660e7ba1f69918` branch `main` (equals `origin/main`)
- Hook file read: `.claude/hooks/branch-guard.ps1` on that tree
- HY-01 file read: `scripts/hygiene/branch-prune-report.mjs` on that tree
- Attribution file: `_inbox/2026-08-20_hy01_deletion_attribution.json` closedAt `2026-08-20T02:14:32.522Z`
- Positive-control raw: `P:/tmp/branch_guard_adjudication_20260820/`

## The two readings, quoted

**Systems (closed investigation).** `_scratch/systems.md` GROUND-TRUTH 2026-08-20 and `_inbox/2026-08-20_systems_hook_resolution_for_markets.md`:

> The observed pattern (commit succeeds, push refused seconds later) is **not** explained by branch-guard fail-open swallowing on commit. Two distinct hooks fire on different operations.

`branch-guard.ps1` lines 69-70 match `commit` or `push`. `dirty-tree-close-gate.ps1` lines 72-73 match `git push` only.

**Markets (handover).** `_sessions/2026-08-20_t25_enumeration_handover.md`:

> This seat observed an explicit fail-open (`catch { exit 0 }`, header: "Fails open on any parse error") and a commit succeeding while a push refused seconds later.

Fail-open in the file now:

- Header line 11: `Fails open on parse errors so a hook bug never breaks routine Bash use.`
- Lines 15, 58, 63, 67: `Exit-Open` / empty stdin / `catch { Exit-Open }` on `ConvertFrom-Json` / missing command. `Exit-Open` is `exit 0` (line 15).
- Markets' `catch { exit 0 }` is this catch, via the function, not a different copy.

Literal-word match, same file, line 70:

```
if ($command -notmatch '\bgit\b[^&|;]*?\b(commit|push)\b') { Exit-Open }
```

That is a word in the command string, not the git subcommand. Independent regex check on this snapshot:

| command string | line 70 matches |
|---|---|
| `git branch -D leftover` | no |
| `git branch -D leftover-commit` | yes |
| `git log --grep=commit` | yes |
| `git -C P:/legacy-design-tools push` | yes |
| `echo commit` | no |
| `node scripts/hygiene/branch-prune-report.mjs --arm-delete ...` | no |

## Do they reconcile

Yes. They are not two explanations of one path. They are two facts about one file, plus a second file.

1. Fail-open exists (markets). Systems already listed it as a known class in the same scratch entry and called it less likely than the two-hook split, not absent.
2. Two hooks, different triggers (systems). `branch-guard` line 70 fires on commit or push. `dirty-tree-close-gate` line 73 fires on `git push` only. A foreign-repo commit can pass branch-guard after the 2026-08-19 `Test-IsDocRepo` check (lines 72-73) while a later `git push` of doc_repo hits one or both hooks.
3. The literal-word predicate (markets, this pass) sits on the matcher that decides whether branch-guard applies. It is a third fact. It does not undo (1) or (2).

The closed commit-then-push finding does not need to be reopened. Fail-open was not denied. It was ranked below the two-hook split.

## The deletion rejection: does markets' fail-open touch it

No. Different file, and the recovered HY-01 commands cannot enter branch-guard's refuse branch.

The rejection under review is `_inbox/2026-08-20_hy01_deletion_attribution.json` `mechanism.rejected`:

> HY-01 deleted and reported zero. Rejected because the 01:02 run listed the 135 still present with totalDeleted 0; the refuse path has no git branch -D before the confirm-count check; the 01:09 JSON is a refuse with eligible 0; the parallel session's HY-01 at that time still had --arm-delete unimplemented.

That refuse path is `scripts/hygiene/branch-prune-report.mjs` lines 244-270. Confirm-count mismatch sets `exitCode = 2` and does not enter the `else` at line 271. The only call site of `deleteEligibleBranch` is line 295, inside `if (pending)` after a matching confirm-count. `refuseAndExit` (lines 80-97) logs `result: 'refused'` and `process.exit`. No `-D`.

Markets' fail-open is `.claude/hooks/branch-guard.ps1` lines 15/58/63/67. That file has no `branch -D`, no `update-ref`, no prune. Grep on this snapshot: zero hits. Fail-open is `exit 0` in a PreToolUse hook. It cannot delete refs. It can only decline to block the agent's next command.

The recovered HY-01 argv from the deletion window (`branch-prune-report.mjs --arm-delete --repo P:/legacy-design-tools ...`) does not match line 70. Regex: no. The hook Exit-Opens at the matcher the same way it does for `git show`. It never reaches the off-main refuse (lines 78-81). A fail-open on parse and a non-match on the matcher are the same exit for a delete-shaped HY-01 invocation: the hook is not in that path.

**Verdict: the closed finding stands. The rejection does not reopen.**

## Positive controls (not an argument from absence)

Hook process, this snapshot, stdin piped to `branch-guard.ps1`. doc_repo was on `main`, so a matched in-scope commit/push also exits 0. Exit code alone cannot tell fail-open from allow-on-main. The split is which line is reachable.

Fail-open (never reaches `git -C $DocRepo branch --show-current` at line 75):

- empty stdin: exit 0
- `not-json{`: exit 0
- `{"tool_input":{}}`: exit 0

Matcher-open, no refuse branch, hook still does not delete:

- `git branch -D leftover`: line 70 does not match. Same class as HY-01 argv. Exit 0. No delete verb in the hook.

Literal-word match (operation is delete or read, predicate sees `commit`):

- `git branch -D leftover-commit`: line 70 matches. Then `Test-IsDocRepo` on resolved path. On this snapshot, no `-C` so the hook's Get-Location decides. Exit 0 because `main`. The hook still did not run `-D`. The agent's command would have, if the tool had run.
- `git log --grep=commit`: line 70 matches. A read is treated as commit/push.

HY-01 refuse did not delete, observed not inferred: attribution `hy01InvocationsThisWindow` at `2026-08-20T01:02:42Z`, `--confirm-count 0`, exit 2, `totalDeleted` 0, 135 still listed. That is a positive run of the refuse path against a live eligible set.

Second mechanism for "fail-open allowed the 135 deletes" and why rejected: an agent `git branch -D` loop that branch-guard failed-open on. Rejected because (a) the hook never executes `-D`, (b) a plain `-D` does not match line 70, (c) an LDT `-C` path fails `Test-IsDocRepo` even when the word `commit` is present, (d) the recovered window commands are HY-01 argv, which also fail line 70.

## Literal-word match, own row

Presence-shaped predicate in a guard. Fires on the token `commit` or `push` anywhere after `git` in the same shell segment. Would never be flagged by an audit that only asks whether the guard exists. Cost is real (hours). Held as a hygiene-controls row; not fixed this pass.

## Override log, counted before any scope fix

File `_catalog/dispatch_overrides.log` at this snapshot.

- Total lines: 53
- `CLOSE_OVERRIDE`: 16
- `DISPATCH_OVERRIDE`: 37
- Other: 0

`CLOSE_OVERRIDE` by date: 2026-08-09 = 1, 2026-08-14 = 3, 2026-08-16 = 1, 2026-08-20 = 11.

All 16 `CLOSE_OVERRIDE` rows carry the same reason string: `CLOSE_OVERRIDE=1 on git push`. The log does not name the seat, the target repo, or whether the stranded `_STATE.md` edit was the pusher's. Own-unfinished versus someone-else's is not in the log. It is only recoverable by correlating timestamps with session records. Property seat named two uses today (`_inbox/2026-08-20_property_seat_handover_s21_rederivation.md`). Escalations that refused the override leave no row.

Scoping the gate will stop this population growing. The 16 and the 11-today cluster are the measurement. Do not scope until this count has been read.

## Scope fix, held

Both hooks still judge from command string plus hook-process cwd. Neither reads a tool `working_directory` field. `dirty-tree-close-gate.ps1` line 73 requires `git` then `push` with only whitespace between, so `git -C <repo> push` does not match; `git push` from a cwd matching `doc_repo` does, and then lines 101-106 always `git status` `P:/doc_repo`. Predicted decay: two seats, third seat's in-flight `_STATE.md`, one seat logged override, the other escalated. Counted. Not fixed this pass.

## Leave behind

none. No hook edit. No attribution reopen.
