---
id: 2026-07-27_QA5_bearing_parity_restore
title: QA5 dispatch — restore shared bearing-formula import (kill the pr-151-c1 fork)
date: 2026-07-27
status: GO
owner: nick
planner: qa
repo: hauska-engine
related: [2026-07-27_bastrop_qa_defect_register]
---

# QA5 — Restore the single shared bearing formula (kill the fork)

**GO 2026-07-27.** Worktree: `P:\hauska-engine-worktrees\qa5-bearing` / branch `qa/bearing-parity-restore`. Builder does not self-grade MET.

You are a build agent. Small, surgical fix. The bearing / property-line-tag formula must live in EXACTLY ONE place, shared by the site-plan PDF and the boundary-edge atoms. A branch (`pr-151-c1`) re-inlined a COPY of the formula into the PDF's `annotation-placement.ts`, deleting the shared-module import — creating a second bearing path (the exact drift the shared module exists to prevent).

## The correct state (origin/main)
`packages/engine-core/src/site-plan/pdf/annotation-placement.ts` IMPORTS from `../../geometry/gis-property-line-tags.js`:
```
import {
  formatGisBearing as formatGisBearingShared,
  formatPropertyLineTag as formatPropertyLineTagShared,
  PROPERTY_LINE_TAGS_HONESTY as PROPERTY_LINE_TAGS_HONESTY_SHARED,
} from "../../geometry/gis-property-line-tags.js";
```
and re-exports those (thin re-export, no re-implementation). The boundary atoms import the SAME module (`boundary-primitive/compute.ts`). One formula, two consumers.

## The fork (branch pr-151-c1)
On `pr-151-c1`, `annotation-placement.ts` DELETES that import and re-implements `formatGisBearing` / `formatPropertyLineTag` / `PROPERTY_LINE_TAGS_HONESTY` inline (~35 lines of copied azimuth/quadrant math). If that branch merges, the PDF and the atoms compute bearings from two independent copies.

## Task
1. First confirm current state: does origin/main still import the shared module (correct), and is `pr-151-c1` unmerged or already merged? Run:
   - `git -C <engine> show origin/main:packages/engine-core/src/site-plan/pdf/annotation-placement.ts | head -12` (expect the shared import present)
   - `git -C <engine> log --oneline origin/main | grep -i c1` / check if pr-151-c1 is in main.
2. If pr-151-c1 is NOT merged: the fix is to prevent the fork from landing — either update that branch to keep the shared import (delete the inlined copy, restore the thin re-export), or coordinate to close/supersede it. Whichever, the merged result must import the shared module, not re-inline.
3. If pr-151-c1 IS somehow already merged (D1 reported C1 merged): re-apply the shared import on main — delete the inlined `formatGisBearing`/`formatPropertyLineTag`/`PROPERTY_LINE_TAGS_HONESTY` bodies in `annotation-placement.ts`, restore the import-and-re-export from `../../geometry/gis-property-line-tags.js`. The bearing text output must be byte-identical (the shared formula IS the canonical one).
4. Promote a mechanical guard: a test that fails if `annotation-placement.ts` re-implements the bearing math instead of importing it (e.g. assert the shared module is the single source — a parity test that computes a known segment's tag via BOTH the PDF path and the atom path and asserts equality).

## Verify (you do NOT grade MET)
1. `pnpm -C packages/engine-core build` + vitest clean.
2. The parity guard passes; the fork cannot silently reappear.
3. Report: current-state finding (merged or not), branch, PR, SHA, the guard. Planner verifies one formula on main + the guard before MET.
