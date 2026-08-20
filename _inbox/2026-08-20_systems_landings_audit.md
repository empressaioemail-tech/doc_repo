---
date: 2026-08-20
seat: systems
artifact: landings audit after seat topology
status: filed, not committed
snapshot: doc_repo HEAD 56f06800533f7bfa465aaca7feb71d08e06e7329 on main at P:/doc_repo
method: reflog and commit history over working-tree inspection; negatives verified against a known-tracked path
---

# Landings audit, 2026-08-20

Snapshot declared at start of this pass: `56f0680` on `main`, integration checkout `P:/doc_repo`. Origin was one commit behind (`ahead 1`, topology unpushed). All git authors today are `empressaioemail-tech`. Seat is inferred from subject prefix and body, not from author.

Every finding names concurrent-work-today, the topology restructure (`56f0680` at 10:00:57), or cannot tell.

## Known incidents

### 1. Markets artifact pre-staged, nearly swept

Path: `_sessions/2026-08-20_t25_enumeration_handover.md`. Property handover `1b72b7e` recorded it pre-staged, picked up by an explicit `git add` of an unrelated path, and left untouched because that seat committed by pathspec.

It is committed. First add is `c9978c8` (08:24:22), markets/T-25. Later commits `ffa12b0` and `c559b3c` edited it. HEAD blob `f38914ae` equals the working tree. Index is clean for that path. Integration staged count is 0.

The restructure did not move it. `56f0680` does not touch the path.

Cause of the near-sweep: concurrent work today. Survival: concurrent work today (pathspec). Later commit: concurrent work today (owner). Not the restructure.

Second mechanism rejected: that topology moved it into `_state/markets/`. Rejected because `git log --follow` stays on `_sessions/` and `git diff e6de1eb 56f0680 --name-only` does not list it.

### 2. File clobbered between write and add

**Today, on `_STATE.md`.** `cf27348` (08:56:58) spliced Lane B wave 3 into a working tree that already held another seat's uncommitted branch-protection lines. The commit body says so: those lines were committed unchanged so the close gate would not discard them. The splice left a stray `**` (`refuses.** The eleven domains`). `444b9e3` eight seconds later removed that marker. Wave 3 facts and both protection paragraphs survived in `cf27348`; they were not deleted. Cause: concurrent work today. Not the restructure (`56f0680` is 64 minutes later).

A larger silent overwrite of a Lane B-only blob cannot be proven from the object store: git has no pre-add Lane B-only copy. Second mechanism rejected: that topology clobbered the file. Inverse of destruction is what `cf27348` did: it *included* foreign uncommitted work.

Two other events, not today's doc_repo clobber:

**2026-08-17 Smart Markets block.** `_STATE.md` RMW lost the block. Recovered into `_inbox/2026-08-17_smart_markets_pickup.md`. Restructure copied the dated summary into `_state/markets/STATE.md`. Pickup file was not moved.

**TW-74 add-all in empressa-trading.** `f65ffc1c` at 08:21:04, +10779/-3. Intended two files plus ten `t25*` scratch files. Reset 34 seconds later. Intended two files in `9a73ca6a` are byte-identical to `f65ffc1c`. Scratch recoverable from the dangling object, absent from the trading working tree. Concurrent work, not the restructure. This is the known 10700-line mismatch. It is not on doc_repo `main`.

### 3. `_STATE.md` duplicate branch-protection paragraphs

Pre-split source: `e6de1eb:_STATE.md`. Two paragraphs, line 5 and line 413, plus Config A/B facts in the last-updated header.

Topology split into `_state/systems/STATE.md` and claimed a reconcile. It was a choose, not a reconcile. Unique facts present in paragraph 5 and absent from the landed systems paragraph:

- the name `GH006`
- the wording `Cannot force-push to this branch`
- the runbook path `90_runbooks/91_branch_protection_runbook.md`
- `Do not apply Stage 2 without the reliability report` (systems kept only "gated on")
- `pull request required` as the five-repo refuse (systems kept "PR required")

Those facts were not silently deleted from the repo. They survived in `90_runbooks/91_branch_protection_runbook.md`, committed in the same topology commit. They were dropped from living state.

This pass read both paragraphs and wrote one systems paragraph carrying every unique fact both contained. Generated `_STATE.md` regenerated. Stage 2 status was not substituted from the later property final report; both duplicate paragraphs said Stage 2 was OPEN. The contradiction with `6a073dd` is flagged below, not chosen through.

Cause of the duplication: concurrent work today (two writes survived). Cause of the incomplete reconcile: restructure.

Second mechanism rejected: that generate-combined duplicated the paragraph. Rejected because `e6de1eb:_STATE.md` already had both copies before `56f0680`.

### 4. Base moved under a seat

Topology draft snapshot was `b3fa27f` (09:42:51). `e6de1eb` landed at 09:46:12 (T-25, one file: `65_t25_admissibility_enumeration.md`, +40, W-30). Topology commit `56f0680` parent is `e6de1eb`. Intersection of `e6de1eb` paths with `git diff --name-only e6de1eb 56f0680` is empty. W-30 is still in `65_t25` at HEAD.

Nothing from `e6de1eb` was superseded.

Cause: concurrent work today (T-25 commit while systems had a dirty topology tree). Pathspec commit on top: restructure. No silent supersede.

Earlier the same morning, `f15b902` merged `origin/main` (empty protection-verification commits) into the T-25 rows filing. Merge tree equal to parents for files; no silent supersede there either.

## Every doc_repo commit today

Author for all: `empressaioemail-tech <empressaioemail@gmail.com>`.

| SHA | time | subject | diff | message vs diff |
|---|---|---|---|---|
| `6595e5e` | 07:49 | `protection verification, delete after` | empty tree (same as parent `cc96276`) | Mismatch. Message describes GitHub API work. No files. Close JSON never added. |
| `036f6de` | 07:55 | Config A verified by violation | empty tree (same as `6595e5e`) | Same class. Second empty commit with the real subject. |
| `918e1b8` | 08:07 | t25 property rows 3-30 | 1 file +182 | Match |
| `f15b902` | 08:08 | merge origin/main into t25 rows | merge, no file delta | Match as a merge |
| `f847d73` | 08:15 | t25 consolidate into canon 65 | 1 file +424 | Match |
| `4f326ed` | 08:19 | t25 S-22/S-23/S-24 | 1 file +40/-8 | Match |
| `1b72b7e` | 08:21 | property seat handover | 1 file +162 | Match |
| `c9978c8` | 08:24 | T-25 enumeration handover | 2 files +303 | Match. Body also records the 2026-08-17 `_STATE.md` RMW. |
| `d5c82b4` | 08:27 | t25 third check | 1 file +28/-1 | Match |
| `3cf7e74` | 08:33 | t25 split rows by input type | 1 file +57 | Match |
| `f9e1ed2` | 08:39 | t25 W-13 | 1 file +56/-14 | Match |
| `9337826` | 08:43 | t25 W-29 | 1 file +57/-6 | Match. Later retracted by `b3fa27f`. |
| `f72fa4a` | 08:54 | ops-17 wave 3 lens/VPAT/PDF | 37 files +7015 | Partial match. Subject names the wave. Diff is almost entirely `_inbox/` close JSON for g94-g96, r1-r3, k1-k3, l1-l2. Not a scratch sweep. |
| `cf27348` | 08:56 | `_STATE.md` Lane B wave 3 | 1 file +6/-2 | Subject matches Lane B. Body admits it also committed another seat's uncommitted branch-protection lines. Splice, not a one-writer change. |
| `444b9e3` | 08:57 | `_STATE.md` unmatched bold marker | 1 file +1/-1 | Match |
| `ffa12b0` | 08:58 | T-25 handover addendum | 1 file +107 | Match |
| `c559b3c` | 09:04 | 513 is a candidate count | 1 file +31/-1 | Match |
| `33ffb15` | 09:06 | t25 hypothesis falsified | 1 file +84/-29 | Match |
| `42424cf` | 09:15 | stage2 reliability report | 1 file +170 | Match |
| `6a073dd` | 09:36 | property final report, Stage 2 applied | 1 file +170 | Match. Living `_STATE.md` was not updated. |
| `b3fa27f` | 09:42 | RETRACT W-29 | 1 file +40/-2 | Match |
| `e6de1eb` | 09:46 | retrieval 158 CANDIDATE; W-30 | 1 file +40 | Match |
| `56f0680` | 10:00 | land seat topology | 44 files +5000/-108 | Partial mismatch. Subject is topology. Diff also first-tracks the whole `scripts/hygiene/` tree, dual-writes `62` / `90_enforcement_build_order` / `91_branch_protection_runbook` into both the numbered-or-runbook path and `OPS/`, and commits `ENFORCEMENT.md` that cites an untracked `61_enforcement_doctrine.md`. |

`6595e5e` and `036f6de` are on HEAD ancestry via merge `f15b902`, not on first-parent from `918e1b8`.

The known 10700-line mismatch is not on doc_repo. It is `f65ffc1c` in `P:/Empressa Trading`, reset, unreachable from any branch, object still present.

## Staged and orphaned

No staged paths in:

- `P:/doc_repo` (0)
- seat worktrees under `P:/seat-worktrees/` (all 0)
- `P:/legacy-design-tools`, `P:/hauska-engine`, `P:/hauska-map`, `P:/smart-markets`, `P:/Empressa Trading`, `P:/smartcity-dashboards`, `P:/smart-files`, `P:/hauska-mcp-server`

Nothing is currently staged that a later explicit add could sweep. The markets handover is committed, not still staged.

## Dirty paths, by owner, and whether 1600 moved

Two instruments, not one number. Comparing them to each other is the defect.

`git status --porcelain` (default, collapses untracked directories): **1598** at the independent recount immediately after topology, **1603** after this audit's own untracked files. 0 staged, 42 modified, rest untracked. Against a prior "over 1600" claim this is **flat to slightly down**, by at most a few dozen. No dated hygiene artifact records a 1600 porcelain number; `_inbox/2026-08-20_systems_worktree_audit.json` counted 319 worktrees, not paths.

`git status --porcelain -uall` (expands every untracked file): **2140** at first audit measure, **2145** after this file. That is the expanded untracked set, not the same series as "over 1600".

2026-08-14 cartography used `git ls-files --others` per directory (`_inbox/` untracked 1324, `_scratch/` 475). Those two are the expanded series. Inbox untracked 1324 to 1466; scratch 475 to 519. **That series is up.**

Did the restructure move either number? It first-tracked 44 paths, which pulls both counts down. Concurrent untracked added more on the expanded series. Default porcelain sits on the 1600 line because collapsed `_inbox/` is one row until `-uall`.

`git status --porcelain -uall` at first measure:

| checkout | branch | porcelain | staged | modified | untracked | scratch untracked |
|---|---|---|---|---|---|---|
| P:/doc_repo | main | **2140** | 0 | 42 | 2098 | 519 |
| seat/*/doc_repo | seat/* | 0 | 0 | 0 | 0 | 0 |
| P:/legacy-design-tools | feat/s1-instrument-hardening | 63 | 0 | | | 0 |
| seat/property/legacy-design-tools | seat/property | 0 | | | | |
| P:/hauska-engine | detached HEAD | 5 | 0 | 4 | 1 | 0 |
| seat/property/hauska-engine | seat/property | 0 | | | | |
| P:/hauska-map | fix/p35-vercel-token-preflight | 1 | 0 | 1 | 0 | 0 |
| P:/smart-markets | tw40/web-ci | 2 | 0 | 0 | 2 | 0 |
| P:/Empressa Trading | main | 0 | | | | |
| P:/smartcity-dashboards | main | 0 | | | | |
| P:/smart-files | main | 3 | 0 | 3 | 0 | 0 |
| P:/hauska-mcp-server | docs/p35-retrieval-key-durability-note | 0 | | | | |

doc_repo untracked by top directory: `_inbox` 1466, `_scratch` 520, `_dispatches` 30, `_decisions` 26, `_catalog` 20, `90_runbooks` 9, `OPS` 5, plus root `61_enforcement_doctrine.md`.

Prior cartography `_catalog/repo_map.md` (measured 2026-08-14): `_inbox/` untracked **1324**, `_scratch/` untracked **475**. Those two alone were 1799, which is the "over 1600" class. Highest-severity single-copy items in that audit: `_smartsite_masters/` entirely untracked (item 2), 216 machine-only files (item 3), `_scratch/` not gitignored (item 4).

The restructure also **stranded** the dirty tree. Seat worktrees are clean at the same HEAD because `git worktree add` materialises the commit, not the integration untracked set. The expanded untracked set, including the single-copy masters and 61, exists only under `P:/doc_repo`. A seat working from `P:/seat-worktrees/systems/doc_repo` will not see them.

Owner of the dirt: mixed-age, not all today's. The 42 modified tracked files include long-dirty shards, OPS-13/14, AGENT_CONTRACT, watch_registry. Do not attribute that set to one seat. Today's new untracked that this pass named: `61_enforcement_doctrine.md`, `OPS/61_enforcement_doctrine.md`, `_inbox/2026-08-20_branch_protection_close.json`, `_decisions/2026-08-20_branch_protection_stage1.md`, this audit file.

Two extra doc_repo worktrees are not in the seat register: `C:/Users/cente/.cursor/worktrees/parcel-terrain-model-4c7a9e2f` (detached `a6a3877`) and `P:/worktrees/doc-repo-l23-gate-grade` (detached `71d4834`). Flagged, not removed.

## Broken references

Negative proof: `git ls-files -- '*enforcement*'` returns `90_runbooks/90_enforcement_build_order.md`, `OPS/90_enforcement_build_order.md`, `scripts/enforcement/*`, `.cursor/rules/enforcement.mdc`. It does **not** return `61_enforcement_doctrine.md`. If 61 were tracked, that search would have listed it. `Test-Path` on disk is true for both copies.

| citation | target | on disk | in git | cause |
|---|---|---|---|---|
| `ENFORCEMENT.md` (tracked, `56f0680`) "Derived from `61_enforcement_doctrine.md`" | `61_enforcement_doctrine.md` | yes, two copies | no | **Restructure.** Created a tracked vehicle that cites an untracked source. |
| `62_seat_topology.md` frontmatter `related: [61_enforcement_doctrine, ...]` | same | yes | no | **Restructure.** |
| systems STATE / generated `_STATE.md` close path | `_inbox/2026-08-20_branch_protection_close.json` | yes | no | **Concurrent**, then **carried by restructure.** Citation existed in `e6de1eb:_STATE.md`. File was never added. Topology copied the citation. |
| `90_runbooks/91_branch_protection_runbook.md` (tracked) | `_decisions/2026-08-20_branch_protection_stage1.md` and the close JSON | yes | no | **Restructure** created the tracked citation to concurrent untracked files. |
| old `_STATE.md` runbook path | `90_runbooks/91_branch_protection_runbook.md` | yes | yes (as of `56f0680`) | Resolves now. Did not resolve this morning before topology. Morning-broken, now fixed, **by restructure**. |

`65_t25` and the T-25 handover path still resolve. W-30 still in the file.

## Duplicates, not resolved by preference

**`61_enforcement_doctrine.md` (root, 173 lines, last_updated 2026-08-20) and `OPS/61_enforcement_doctrine.md` (363 lines, last_updated 2026-08-19).** Both untracked. Never in git (`git log --all --` empty on both). OPS has sections root does not: advisory/sixth state, reopening condition, two values, state-change records, build step invalidating a premise, parallel implementation, wrong-field verification, default path lossier, isolation foreclosing the second party, documented workarounds, commit record subject to the same rule, what this doctrine actually buys. Root is newer-dated and shorter. Parallel implementation, or a later abridgement. Cannot tell which from history because there is no history. Left both. Placement is genuinely ambiguous: numbered-band canon and OPS governing both claim 61. Propose: numbered-band `61_enforcement_doctrine.md` is canon; `OPS/61` is a pointer, after a human reads both and produces one text that carries every section. Not done on this pass.

**`62_seat_topology.md` and `OPS/62_seat_topology.md`.** Both tracked in `56f0680`. Hashes differ by two lines: OPS has a pointer to root. That is the intended dual-home. Leave.

**`90_runbooks/90_enforcement_build_order.md` vs `OPS/90_...` and `90_runbooks/91_...` vs `OPS/91_...`.** Both pairs tracked in the same topology commit, already diverged (91: 90_runbooks is `status: active` 2026-08-20 with a "Landed state" section naming GH006; OPS is `status: draft` 2026-08-19 without that section). Not copies. Not reconciled. Flagged. Propose: `90_runbooks/` is the runbook home; `OPS/` is a pointer, same as 62. Not moved on this pass because a wrong move of a tracked pair is harder to undo than a flag.

**`ENFORCEMENT.md` vs root 61.** Vehicle vs doctrine. C-00 is internal consistency between `ENFORCEMENT.md` and `.cursor/rules/enforcement.mdc`. It does not bind 61. That is why 61 can be untracked while C-00 passes.

## Moves this pass

None of another seat's files. Topology's own moves were copies, not moves (root and OPS both exist). This pass:

- Reconciled unique branch-protection facts into `_state/systems/STATE.md` (in place, not a path move).
- Regenerated `_STATE.md`.
- Corrected `_catalog/seat_register.json` `_snapshot.docRepoHead` from the draft SHA `b3fa27f` to landed `56f0680`, keeping the draft SHA in `docRepoHeadAtRegisterDraft`.
- Filed this report at `_inbox/2026-08-20_systems_landings_audit.md`.

## Flagged, not touched

- 61 both copies. Duplicate, untracked, cited by tracked canon. Do not delete. Do not choose.
- `OPS/90_*` and `OPS/91_*` vs `90_runbooks/`. Diverged tracked pair.
- `_inbox/2026-08-20_branch_protection_close.json` and `_decisions/2026-08-20_branch_protection_stage1.md`. Untracked, cited. Do not commit under this seat's message; they are the branch-protection seat's close.
- 2098 untracked paths. Do not add. Next explicit add in `P:/doc_repo` can still sweep them. Seat worktrees do not currently have this hazard; the integration checkout does.
- 42 modified tracked files. Mixed-age. Leave.
- `00_current_state.md` still many-writer, still dirty. Topology did not split it.
- `_catalog/watch_registry.json` still shared mutable, still dirty.
- Property final report says Stage 2 applied; systems living state, after reconcile, still records that the duplicate paragraphs said Stage 2 was OPEN. Contradiction flagged, not silently rewritten.
- `f65ffc1c` dangling in empressa-trading. Do not delete the object. Branch `tw74/protection-vs-required` still exists at the clean tip `7d402bdb`; PR 355 asked that the swept branch be deleted unmerged. The sweep commit is already off that branch.
- hauska-engine primary checkout is detached HEAD with 5 dirty paths. Seat worktree is clean. Flagged to property.
- This audit worked from integration `P:/doc_repo` on `main`, not from `P:/seat-worktrees/systems/doc_repo`. Same leave-behind the topology close named.
- Unregistered worktrees `parcel-terrain-model-4c7a9e2f` and `doc-repo-l23-gate-grade`. Leave.
- Remaining many-writer files topology did not split: `00_current_state.md`, `_catalog/watch_registry.json`, `_catalog/dispatch_overrides.log`, `_catalog/canon_overrides.log`, OPS-16/OPS-17 amendment tables, `_catalog/thesis_parity_ledger.md`. Flagged, not split on this pass.
- `OPS/91` still states present-tense "no repository has branch protection" while Stage 1 is live. Same divergence already named for the 90 vs OPS pair. Not converted here.

## What the restructure got wrong

1. **Reconcile was a choose.** Duplicate branch-protection paragraphs lost GH006, Cannot force-push, and the runbook path from living state. Corrected on this pass.
2. **Cited and untracked.** `ENFORCEMENT.md`, `62_seat_topology.md`, and `90_runbooks/91_...` were committed citing `61_enforcement_doctrine.md`, the branch-protection close JSON, and the Stage 1 decision, none of which are in git. A clone does not have the doctrine the vehicle claims to be derived from.
3. **Dual-wrote runbooks already diverged.** 62 got a pointer. 90 and 91 got two full texts, different status and date, in one commit.
4. **`scripts/hygiene/` first-tracked under a topology subject.** Message does not describe that tree. If those files were the 2026-08-19 untracked hygiene work, they are now history under the wrong sentence.
5. **Register snapshot SHA was the draft, not the parent.** `b3fa27f`, not `e6de1eb` / `56f0680`. Corrected on this pass in the working tree.
6. **Dirty tree stranded.** Seat worktrees are clean. Single-copy untracked intelligence stayed in `P:/doc_repo` only. Topology made the shared index impossible and made the uncommitted estate invisible from the seats that are supposed to be the writers.
7. **Stale Stage 2 sentence copied forward.** Property had already committed "Stage 2 applied" (`6a073dd`) into the ancestry the split read, and had not updated `_STATE.md`. Topology copied the old OPEN sentence into systems state.
8. **This seat worked from integration**, which the register says planner seats do not.

leave_behind:
- item: untracked 61 (root and OPS), untracked BP close JSON and Stage 1 decision, diverged OPS vs 90_runbooks copies of 90 and 91, untracked estate stranded on integration, two unregistered worktrees
  owner: systems (61, dual runbooks, register/state) and operator (commit of another seat's close JSON)
  plan_row: backlog; not an OPS-16/OPS-17 row

## Addendum (late returns, same snapshot HEAD)

Independent porcelain recount used default `git status --porcelain` and got 1598, not the expanded `-uall` 2140. Both are true. The "did 1600 move" question is only answerable on the default series, where it is flat to slightly down. The `_STATE.md` clobber today is the `cf27348`/`444b9e3` splice, not an unproven larger loss. GH006 was restored to systems state on this pass after the incidents recount still saw the topology choose.
