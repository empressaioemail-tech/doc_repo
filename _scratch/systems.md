# Systems seat scratch — 2026-08-19 / 2026-08-20

## GROUND-TRUTH — hook scope fix (2026-08-20T14:10Z, residual named later same day)

Both hooks now resolve the repo the command mutates: git -C, then cd, then tool working_directory / payload cwd, then Get-Location. Shared `_git-repo-target.ps1`. Matcher word-row NOT replaced.

Proof: `_STATE.md` sentinel dirtied then restored. `git -C P:/doc_repo push` exit 2. `git push` with working_directory P:/smart-markets exit 0 on the same dirty tree. `git -C P:/legacy-design-tools push` exit 0. Override logs `target=` and `cwd=` (proof row written). C-00 ok.

Literal-word row restated: the guard cannot distinguish a command that commits from a command that mentions committing. leftover vs leftover-commit.

Process-cwd fallback is an accepted residual (61 rev 6), not a row. Unknown target collapsed into that default. Silent-half rule: where a scope defect surfaces through friction, go looking for the miss. Proof CLOSE_OVERRIDE excluded from the eleven. Historical eleven remain a rate without reasons; everything after carries target and cwd.

Log corollary in 61 rev 5 and ENFORCEMENT.md. Decision `_decisions/2026-08-20_read_the_log_you_cite.md`. Items 3-7 still held.

## GROUND-TRUTH — branch-guard contradiction adjudicated (2026-08-20T14:01Z)

Snapshot: doc_repo `ffa12b07` on `main`. Artifact `_inbox/2026-08-20_systems_branch_guard_adjudication.md`.

Markets and systems reconcile. Fail-open is real (branch-guard.ps1:15,58,63,67). Two-hook split is also real (branch-guard commit|push vs dirty-tree git push only). The closed commit-then-push finding stays closed; fail-open was ranked, not denied.

HY-01 deletion rejection stands. Markets' fail-open is a PreToolUse `exit 0` in branch-guard. The examined refuse path is branch-prune-report.mjs:244-270, which never calls deleteEligibleBranch (only call site :295). Recovered HY-01 argv does not match branch-guard line 70. Positive: 01:02Z confirm-count 0 refuse listed 135, totalDeleted 0.

Literal-word matcher is its own row (line 70). Counted CLOSE_OVERRIDE before scope: 16 total, 11 on 2026-08-20, reason field identical on all 16. Scope fix held.

## GROUND-TRUTH — branch protection Stage 1 (2026-08-20T12:55Z)

Six repos under `empressaioemail-tech`. Before: GET protection HTTP 404 `Branch not protected`, rulesets 0, admin true on all six. After: Config A on `doc_repo` (`enforce_admins` false, no PR, no checks, force-push and deletion blocked). Config B Stage 1 on hauska-map, hauska-engine, legacy-design-tools, empressa-trading, smart-markets (`enforce_admins` true, PR required with 0 approving reviews, no checks).

Proof by violation, authenticated as admin: `doc_repo` `git push --force` of parent SHA to `main` refused `GH006 Cannot force-push to this branch`. Five code repos `git push origin HEAD:main` refused `GH006 Changes must be made through a pull request`. Planner direct push on `doc_repo` succeeded (`036f6de` on `origin/main`).

Stage 2 not applied. CI checks remain advisory. Do not narrate TW-70 going quiet as "CI is required."

Close `_inbox/2026-08-20_branch_protection_close.json`. Raw `P:/tmp/branch_protection_20260820`.

## GROUND-TRUTH — hook commit vs push (2026-08-20, systems investigation closed)

**Finding:** The observed pattern (commit succeeds, push refused seconds later) is **not** explained by branch-guard fail-open swallowing on commit. Two distinct hooks fire on different operations:

| Hook | Trigger | Scope |
|------|---------|-------|
| `branch-guard.ps1` | `git commit` OR `git push` | doc_repo must be on `main` |
| `dirty-tree-close-gate.ps1` | `git push` only | doc_repo `_STATE.md` / `MEMORY.md` worktree-dirty |

**Most likely mechanism for markets session:** Commit targeted a **foreign repo** (empressa-trading or smart-markets). branch-guard exits open when the resolved repo path is not doc_repo (2026-08-19 scope fix). Later push targeted **doc_repo** at session close and was blocked by either (a) branch-guard because doc_repo was on `systems/hygiene-controls-disarmed`, or (b) dirty-tree-close-gate because `_STATE.md` had uncommitted worktree edits.

**Fail-open paths (branch-guard):** empty stdin, JSON parse error, missing command, non-commit/push command, non-doc_repo target. These exit 0 without logging — a parse failure on commit-only payload while push payload parses would produce commit-ok/push-blocked, but that is **less likely** than the foreign-repo commit + doc_repo push split above.

**Recommendation:** Do not narrow fail-open without an acknowledgment append (doc 61 tooling-fails-loud). Priority fix already landed: branch-guard scoped to doc_repo targets only. dirty-tree-close-gate behavior is **correct** for its stated purpose.

**Owner:** closed systems investigation. No bypass hunting required on property/markets seats.

## LESSON

C-00 is internal consistency only — operator ruled 2026-08-19. C-00b is the meaning shaped doctrine-reach probe. Do not claim fleet reach from config file presence. C-00 must be proof-by-violation (deliberate drift) before reported working.

## LESSON

Gate reporting its own undeployed state (red on self) is correct. Use acknowledgment path with reason + expiry if property flood retirement runs long; do not normalize red to scenery.

## LESSON (2026-08-20)

branch_declarations.json: unknown is first-class protect; undeclared protects; prune-safe is explicit release. Schema v3: named rows win; bulkRules[] are operator assertions, not scanner inferences. Missing tip date does not match a tipBefore rule.

## LESSON (2026-08-20)

HY-01 "armed" meant measurement. That word is reserved for a delete verb that can execute. Measurement is the default and needs no adjective. A close that says HY-01 armed will be read as deletions can occur.

## LESSON (2026-08-20)

HY-01 reports a count, not a record. The 135 LDT remainder refs disappeared 01:02:42Z–01:09:42Z with packed-refs mtime 01:06:22Z and zero HY-01 totalDeleted. Attribution by elimination inside the control missed the class outside it. Verdict: unattributed. Do not credit HY-01. State-change log is the fix.

## GROUND-TRUTH — BP-01 LDT prune (2026-08-20T01:12Z)

135 remainder refs gone (named check 135/135). 16 August unknown still present. replit-incoming still present. Checkout feat/s1-instrument-hardening untouched. Post HY-01: `REACH: 0 deleted of 0 eligible / 81 merged - undeclared=64, unknown=17, live=0, worktree=64`. Bundle restore of chore/cloud-run-canary-object-storage-env: unique SHA absent in main-only clone, present after fetch, full log equal. Deletion attribution: `_inbox/2026-08-20_hy01_deletion_attribution.json` — HY-01 not observed deleting.

## OPEN — BP-02 held

Operator hold. Do not start. Locality of the 00:48 snapshot: 319/319 this-host, 0 missing, 0 UNC (`_inbox/2026-08-20_systems_worktree_locality.json`). The 57 stale are this-host stale. Off-host worktrees are not in the 319; they are unmeasured and protect. Second signal remains: confirm with the owning seat; unreachable seat protects.

## LESSON (2026-08-20)

The estate has actors whose actions are invisible to any audit run from this machine (other hosts, Cursor cloud agents). That is a standing inventory unknown, not a leftover in the attribution file. Every local audit's coverage claim, including HY-04's 319, is this host.

## LESSON (2026-08-20)

Structural questions get structural instruments. A text search over reachability, ownership, or identity is a presence-shaped predicate over a meaning-shaped question. Same class as inferring a seat from a branch-name prefix. Decision: `_decisions/2026-08-20_structural_questions_get_structural_instruments.md`. HY-04 now classifies hostClass via existsSync + UNC; unmeasured is not stale.

## LESSON (2026-08-20)

The 135-set is a declaration-reader partition. Other seats were active in the window and several had `scripts/hygiene` reachable via doc_repo cwd. None of their recovered commands is the delete. Verdict stays unattributed; residual is seats off this host.

## DEAD-END

Systems agent probing branch-guard by attempting foreign-repo commits to see when it blocks — indistinguishable from bypass hunting. Routed to control-owner investigation instead.
