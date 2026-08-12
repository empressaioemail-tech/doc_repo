---
title: E1 easement writer merge close
date: 2026-08-12
status: complete
---

# E1 — easement writer merge and rail binding

## Outcome

The `easement` rail was the last rail in the county ledger reading `no-writer`, and it was the one place where that reading was honest: the `utility-easement` atom type was registered in the engine but no county writer script existed on main. Engine PR #295 built that writer and had been sitting open and conflicting, 41 commits behind. It is now rebased, fixed, merged, and bound.

Easement moved from `no-writer x254` to `not-yet x254`. It did not move to satisfied, which is the correct and intended result: no easement atoms have been written, and no apply was authorised in this dispatch. Across all fourteen rails there are now zero `no-writer` cells.

Headline numbers did not move on easement's account. At the moment of the refresh, satisfied cells stayed at 309 and Texas completeness stayed at 7.4235 percent, because a rail gaining a writer is not a rail gaining coverage. By the close of this dispatch the figures read 322 and 7.4918 percent, and that entire delta is attributable to B2's geometry sweep landing concurrently: geometry moved from 194 satisfied cells to 207, a gain of thirteen, while easement's satisfied count stayed at zero throughout.

## What was done

PR #295 was rebased onto engine main `11e3fb0` in an isolated worktree. Three files conflicted, and all three were the documented merge-defect traps. The `package.json` conflict would have dropped six `write-*` script entries under a naive keep-both resolution; after resolution the file carries 17 dependencies, 47 scripts, and all 11 write scripts. The `fact-writer-ids.ts` conflict cut mid-function, where keeping both sides would have spliced the body of `wellFactAtomDid` into the closing of `utilityEasementAtomDid`. Each was resolved deliberately rather than mechanically.

The writer carried the broken verify-by-jsonb readback, `body->>'atomDid' IN`, which no index serves and which has been measured at 229,382 ms against 373 ms per 5,000-id batch at 16.2 million rows. This was fixed before merge. The replacement looks the row up by the atoms primary key, building the id from easement's own `entityId` shape, `parcelNodeId:easement:easementId`, which is uniform across all three of its builders and distinct from every sibling writer. The shape was derived from easement's own contract, not copied from a sibling. On engine main there are now zero occurrences of the broken form and one `atom_did IN`.

Verification used typecheck plus a test-file count rather than a green pass total. Typecheck exited 0 across the workspace. All three easement test files transformed and contributed nine tests, with three files on disk and three files run, so nothing was silently dropped behind a green total. CI was re-read after the rebase and returned the literal conclusion string `success` on the new head `a7f80e1`; the earlier green against the stale base was correctly not treated as evidence. Merged as `09e5ea8`.

On the legacy-design-tools side the easement binding gained `engineWriterScript` and `writerRefLabel` so the derivation can see the writer. No `hasWriter` boolean was hand-edited anywhere; D3 made that value derived from engine truth, and hand-flipping it would have reinstated the exact defect D3 removed. The refresh CLI was then run against the deployment database, producing exactly one diff: easement `hasWriter false -> true`. The change merged as PR #414, commit `d589086`.

A concurrent lane complicated the landing. PR #413, the S1 instrument hardening, merged mid-dispatch and touched the same easement binding block, adding a `noWriterReason` reading "honest no-writer until easement ingest ships" along with a tri-state derivation and several new easement assertions. Rather than fight it, the binding branch was rebased onto it. That `noWriterReason` was dropped rather than kept alongside, because the writer had shipped and the reason had become false; keeping both sides would have left the codebase asserting two contradictory things about the same rail. Three of #413's point-in-time easement assertions were flipped to merged truth, and a replacement assertion was added so that `rrc-pipelines`, now the only genuinely writer-less rail, still has its `noWriterReason` enforced. After merge the refresh was re-run against LDT main `d589086`: zero diffs, and #413's new fail-closed reconciliation gate reports PASS.

## The honesty check

The result was pre-registered before merging and reconciled item by item afterwards. Easement landing on `not-yet x254` rather than satisfied, with satisfied cells and completeness both unchanged, is the reconciliation that matters. A rail that jumps straight to satisfied with no atoms written is the defect class this program has found seven times in three days, and easement did not become the eighth.

One reconciliation item needs recording. An initial ledger fetch at the start of this dispatch read 195 satisfied, 6.5144 percent, and `no-writer` on both `roads` and `easement`, which contradicted the dispatch's stated baseline of 309, 7.4235 percent, and easement alone. A later re-fetch converged to the dispatch's numbers with roads at `hasWriter=true` and `not-yet`. The first read caught the API mid-deploy of the D3 and F5-roads work. The dispatch baseline was correct and the divergence was transient, not a defect. It is worth noting only because a single ledger read during a deploy window is not a trustworthy measurement.

## The finding that outlives this task

`hasWriter` is derived rather than asserted, which was D3's fix, but it is derived from a filesystem probe against a working-tree path rather than from merged git state. The probe calls `existsSync` on a module-anchored sibling `../hauska-engine` directory.

This was not hypothetical here. The merged easement writer is on engine `origin/main` at `09e5ea8` but was absent from the `P:/hauska-engine` working tree, because that checkout sits on another lane's branch. A refresh run in the obvious place would have derived `hasWriter=false` for a writer that is merged, and nothing would have flagged it. This dispatch worked around it by pointing `HAUSKA_ENGINE_ROOT` at a worktree synced to merged main.

D3 removed a `process.cwd()` dependency from this same code path. The residual dependency on which revision a local working tree happens to have checked out is the same defect class one level up, and it is silent in both directions: it can hide a writer that exists, and it can confirm one that has been reverted. The durable fix is to derive from the engine's merged git state, via a writer manifest the engine publishes or a `git ls-tree origin/main` probe, rather than from whatever the local disk holds.

This is no longer only a refresh-time concern. The binding coverage test that arrived with #413 asserts that every declared engine writer exists on disk, so the moment easement gained a writer binding, that test began failing against the stale `P:/hauska-engine` working tree while passing against a worktree synced to merged main. #413's own `10069854` commit, which makes the read-path probe skip the engine tree on the deployed surface, independently addresses part of this, and the test does skip cleanly when no engine checkout is present. But when a checkout is present and stale, the probe still answers confidently and wrongly.

Two related asserted values sit behind the same surface. `atomFamilyState` comes from a hand-maintained type snapshot pinned to `engineMainSha 6ccfe8c`, many commits behind engine main, with nothing verifying the pin. And the derivation test's `fileExists` mock is a hardcoded writer allowlist, so a newly merged writer stays invisible to the test until a human adds it. That mock was asserting "keeps easement present without writer" at the moment the writer merged. Both were updated here, and both will recur on the next writer merge unless the derivation is re-rooted.

## Recommended pickups

Re-root the writer probe on merged engine state rather than a local working tree. Add a CI grep banning `body->>'atomDid' IN` under `packages/engine-core/scripts/`, since the broken readback passed CI green because no test exercises it against a real table. Add a branch-freshness gate so a CI green measured against a stale base cannot be read as a merge signal.
