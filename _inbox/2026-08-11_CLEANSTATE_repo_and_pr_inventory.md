---
title: Clean-state repo and PR inventory
date: 2026-08-11
status: active
type: inventory
last_updated: 2026-08-11
scope: all program repos and worktrees under P:\
companion: 2026-08-11_CLEANSTATE_repo_and_pr_inventory.json
---

# Clean-state repo and PR inventory

Run at 2026-08-11T14:51:26Z. Read-only audit across every git repo under `P:\` plus worktrees under `P:\tmp\` and `P:\worktrees\`. Nothing was fixed, committed, merged, or pushed. Every finding below traces to raw command output captured during the run.

## The answer

**Is the tree safe to build on right now? No.**

One thing makes it unsafe, and it is not a merge conflict or a red CI run. It is a fix committed this morning that exists on exactly one disk and nowhere else.

`hauska-engine` commit `81344ec`, "fix(parcel-node): look rows up by PRIMARY KEY, not by a jsonb expression", is the 575x sweep performance fix. It is unpushed. It lives only in `P:\hauska-engine` on a branch called `sweep/fast-write` that is itself four commits behind main. A fresh clone does not have it. A clean redeploy silently reverts it. This is the K5 defect class, live, today.

Three independent proofs it is absent from origin:

    git cherry origin/main sweep/fast-write
    + 81344ecf72c45f8c52f684080830889abfb6f0d5

    git show origin/main:packages/engine-core/scripts/write-parcel-node-county.mjs | grep -n atom_did
    47: * IDEMPOTENT. `atom_did` is derived from `parcelNodeId`, `writePropertyAtomsBatch`

    git log origin/main --oneline --grep="PRIMARY KEY" -5
    (no output)

The only `atom_did` on main is a comment. Neither the verify SELECT nor the orphan-reconcile SELECT was changed there.

What makes this worse rather than better: the sibling writers already got the identical fix on main through PRs #303 and #304 (`46e5287`, `4ebae93`). So main looks fixed. Anyone reading main would reasonably conclude the parcel-node writer was repaired along with its siblings. It was not.

## What must happen before parallel lanes start

Three things, in this order. Nothing else gates the build.

**One. Land `81344ec` on main.** Cut a branch from current `origin/main`, cherry-pick the single commit, open a PR, gate the merge on the literal conclusion string `success`.

Do not push `sweep/fast-write` as it stands. Its diff against main shows nine files including a 151-line deletion of `packages/atoms/src/__tests__/cp2-refute.test.ts`. That deletion is not part of the commit. `git show --stat 81344ec` touches exactly one file, `write-parcel-node-county.mjs`, at +24/-5. The deletion is an artifact of the branch's stale base, and fast-forwarding would silently remove a refutation test. Cherry-pick the one commit.

**Two. Put the engine clone back on main.** `P:\hauska-engine` is the primary engine working directory and it is not on main. Every lane that starts there currently starts from a divergent base. After step one lands, checkout main and pull.

**Three. Pull `legacy-design-tools`.** It is nineteen commits behind, and that staleness is generating a convincing illusion of lost work. See below.

Everything else in this inventory can run alongside build lanes.

## The legacy-design-tools illusion

The tree there shows `gdal.ts` at +276/-65, a +91 test file, and two staged migration SQL files. That reads as critical uncommitted work. It is entirely false.

    git diff --stat origin/main -- lib/cad-ingest/src/nfhl/gdal.ts
    (empty)

    git ls-tree origin/main lib/db/drizzle/ --name-only | grep 007
    lib/db/drizzle/0070_tx_city_and_county_boundary.sql
    lib/db/drizzle/0071_tx_fema_nfhl_flood_zone.sql
    lib/db/drizzle/0072_rail_state_history_and_verification.sql
    lib/db/drizzle/0073_manifest_run_state_slot_and_cost.sql

Every one of those files is already on origin/main. The working tree content is byte-identical to origin/main. The local `main` pointer is nineteen commits stale, so git is diffing against a fossil.

This matters because the intuitive action is harmful. An agent that "rescued" this work by committing it would create duplicate migrations 0072 and 0073 and a numbering collision, which is precisely what upstream commit `45cf0e8b` ("renumber observability migrations to 0072/0073 to avoid 0071 NFHL collision") was written to prevent. The correct action is `git pull`. Do it before anyone else looks at that tree.

## Repository state

| Repo | Branch | vs origin/main | Real dirt | Stashes | Risk |
|---|---|---|---|---|---|
| doc_repo | main | in sync | 10 tracked (real) + 1382 untracked | 0 | low |
| hauska-engine | sweep/fast-write | ahead 1, behind 4 | 0 tracked (11 untracked scratch) | 23 | **high** |
| hauska-map | feat/statewide-parcel-tiles | identical to main | 0 (1 untracked .gitignore) | 6 | low |
| legacy-design-tools | main | behind 19 | 0 real | 30 | med |
| hauska-mcp-server | main | in sync | 0 | 2 | low |
| legacy-design-tools-wave0 | feat/manifest-observability-tables | merged | 0 (4 untracked temp) | 30 (shared) | low |
| hauska-atom-contract | main | in sync | 0 | 1 | low |
| hauska-brief-extension | feat/c7a-inline-atom-chip-ux | ahead 2, behind 1 | 3 sourcemaps only | 5 | low |
| smartcity-os | ci/dast-issues-write-permission | stale June branch | 0 real (2 phantom) | 0 | low, NO-TOUCH |
| AEC-cortex | main | in sync | 0 real (12 phantom) | 0 | low |

`hauska-mcp-server` is the reference standard: on main, in sync, zero dirty files, zero unpushed branches, zero open PRs.

`hauska-map` deserves a note because it reads wrong. It sits on a branch named `feat/statewide-parcel-tiles`, which looks unmerged, but HEAD and origin/main rev-parse to the same SHA `5041236` and the diff between them is empty. PR #157 merged 2026-08-10T11:12:48Z. The K5 statewide-tiles change is in source control. The branch name is a stale pointer. Do not "rescue" it.

`cortex-api` has no clone under `P:\` and no directory carries its remote. Its source is authored inside `legacy-design-tools` and it deploys by workflow_dispatch canary. Nothing is lost, but the mental model of inspecting it at `P:\cortex-api` is wrong.

## CRLF phantoms, recorded so they are not re-litigated

Files that show as modified with a completely empty `git diff --stat`. Do not commit these to clean them up.

AEC-cortex shows twelve modified files and has zero real changes. That is the trap in its purest form: a repo that looks substantially dirty and is byte-identical to HEAD. smartcity-os shows two. hauska-brief-extension shows four source files (`atom-retrieval-api.js`, `chat-atom-card.js`, `chat-citations.js`, `hauska-shadow.css`) as phantoms; its only real diffs are three generated `.js.map` sourcemaps at four lines each, which are build output.

doc_repo is the counter-case. All ten of its tracked modifications are real content diffs totalling 54 insertions and 12 deletions. Its 1382 untracked files break down as 1090 `_inbox/`, 199 `_scratch/`, 64 `_dispatches/`, and about 29 others. That is doc_repo's normal working character, and being docs-only it cannot break a build lane.

## Open pull requests

Five across the whole fleet, which is healthier than the repo count suggests.

**hauska-engine #293** — F5 roads unblock. CI conclusion string is `failure`. Body opens with a literal `## DO NOT MERGE`. Head is 33 commits behind main. Both reported facts confirmed. Correctly parked; keep it open, keep it red, and make sure no automated PR sweep touches it. Not a blocker.

**hauska-engine #295** — utility-easement writer, ADR-029 D2. CI conclusion string is `success`, but `mergeable=CONFLICTING`, `mergeStateStatus=DIRTY`, and the head is 28 commits behind main. The green attests to a tree that no longer exists. Merge main in, resolve, then re-read the conclusion string; do not carry the old green forward. This is the cheapest genuine win available and it can run alongside other lanes.

**hauska-brief-extension #34 and #19** — both return an *empty* check-runs set. Not pending, not failing: absent. There is no CI on that repo. #34 shows `mergeStateStatus=CLEAN`, which renders green in the UI and means only "no text conflicts". Merging on that is the green-looking-UI trap. #34 needs a human verdict on whether the Shape-1 renderer unify is still the direction; #19 is conflicted, 25 days stale, and should be closed and re-cut if still wanted.

**smartcity-os #24** — security scans green, no functional tests, conflicted, 62 days old. smartcity-os is an absolute no-touch repo per the 2026-07-04 repo-intent ruling. Listed for completeness. Do not touch.

## The OZ crossfilter decision

All four reported claims verified at source, and one of them changes the recommendation.

The branch `feat/oz-crossfilter-derivation` still exists on origin at `839d81bb`, dated 2026-07-17T00:27:12Z. It is exactly six commits ahead of main and 174 behind. PR #276 is `CLOSED` with `mergedAt: null` — closed, never merged. `deriveOzDealCrossfilter` is absent from main (zero grep hits) and present on the branch at `brokerageGisCompositeLayers.ts:291` with call sites at 2233 and 2259. The fixture is still on main, exactly:

    origin/main:artifacts/api-server/src/lib/brokerageGisCompositeLayers.ts:177:            motivatedSellerHeat: 0.74,

But reading around that line rather than grepping for it changes the severity. It sits inside `buildCompositeLayerFixture()` in a return block explicitly tagged `fixture: true`, alongside `propensity: 0.81`, `absenteeOwner: 1`, `equityPosition: 0.62`, `taxDelinquency: 0.55`, and `queryCompositeLayer` wraps it with `defaultHonesty(..., true)`. It is a labelled fixture, not a fabricated number passed off as derived. That is a missing-capability gap, not a truth violation.

Against a 174-commit rebase on a file that has been heavily rewritten since, the evidence favours **close deliberately** over rebase-and-merge, and re-deriving against current main when OZ crossfilter is actually on a sprint. Nothing can be lost either way since the branch lives on origin. This is not a build blocker and can be decided at leisure.

## Unpushed work worth preserving

None of these block the build. All of them are one disk failure from gone. Pushing a branch to origin costs nothing and requires no merge decision.

The T3 site-layers cluster is the notable one: `feat/t3-footprint-easement-overlays` exists local-only with **no upstream at all** in both hauska-engine (4 commits) and hauska-map (2 commits), with `feat/t3-bff-site-layer-facets` local-only in legacy-design-tools (1 commit). All dated 2026-08-05. Three legs of one cross-repo feature, no remote copy anywhere. Decide as a unit: push all three, or abandon deliberately.

Also unpushed: `feat/terrain-dem-acquire` in legacy-design-tools at 34 commits, the largest body outside the engine. In hauska-map, `feat/cc-a-u3-map-and-degraded` (14), `fix/pe-coldopen-after-signin` (4), `fix/pe-report-panels-b-citations-c-flood` (4), `feat/pe-terrain-export-inspect` (3), `feat/pe-paywall-checkout-claim` (2). In hauska-engine, `chore/engine-scratch-hygiene` (3, no upstream).

### The ahead-count trap

Three engine branches advertise large unpushed counts that are fiction. `feat/phase-d-layer23-cohort` claims ahead 77, `feat/depth-warm-unified-runner` ahead 4, `fix/warden-situs-address-column` ahead 3 — and all three are **zero** commits ahead of origin/main. Their tips are merge commits already on main; the counts are stale tracking-ref artifacts.

Meanwhile the branch advertising the smallest count, `sweep/fast-write` at ahead 1, holds the only irreplaceable work in the fleet.

Ahead-count magnitude is anti-correlated with actual risk here. Any triage that sorts by commit count chases the 77 and misses the 1.

## Accumulated debt, not blockers

195 registered worktrees across four repos: hauska-engine 64, legacy-design-tools 76, hauska-map 47, hauska-mcp-server 7, scattered across `P:\`, `P:\tmp\`, `P:\worktrees\`, and `.claude/worktrees`. Note that `P:\legacy-design-tools-wave0` is a worktree sharing legacy-design-tools' `.git`, which is why both report exactly 30 stashes; counting them separately double-counts.

91 stashes fleet-wide, oldest from 2026-05. Do not drop blind — several are explicitly labelled as other agents' preserved WIP (`foreign-c1-wip-leave-alone`, `other-agent-b1-wip`, `planner-audit-preserve-2026-07-15`).

Pruning is cosmetic, but the discipline it enables is not. The reason a same-day 575x fix ended up stranded on a non-main branch in the primary clone is that with 64 engine worktrees it is genuinely hard to know which directory you are standing in. Push first, prune second.

## Prioritised blocker list

Must resolve before parallel lanes start:

1. Land `81344ec` on origin/main by cherry-pick. High.
2. Return `P:\hauska-engine` to main. High.
3. `git pull` in `P:\legacy-design-tools`. Medium, but do it before anyone misreads that tree.

Can run alongside build lanes:

4. PR #295 merge-from-main, then re-read the CI conclusion string.
5. Push the T3 three-repo cluster, or abandon it deliberately.
6. Push unpushed hauska-map and legacy-design-tools branches purely to create remote copies.
7. OZ crossfilter verdict — recommend close.
8. Worktree prune and stash triage.
9. doc_repo session-close commit.

No action, recorded so they are not re-opened:

10. PR #293 stays parked and red.
11. Phantom-dirty files in AEC-cortex, smartcity-os, hauska-brief-extension stay uncommitted.
12. smartcity-os stays untouched.
13. `feat/phase-d-layer23-cohort` and the other false ahead-counts need nothing.

Once items 1 through 3 are done the tree is safe to build on. They are small, mechanical, and independent of every other decision in this document.
