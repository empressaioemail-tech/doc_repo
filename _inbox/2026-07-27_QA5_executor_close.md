---
id: 2026-07-27_QA5_executor_close
title: QA5 executor close — bearing parity restore (shared formula guard)
status: checkin
date: 2026-07-27
applies_to: hauska-engine
dispatch: 2026-07-27_QA5_bearing_parity_restore
owner: qa5-bearing-builder
related: [2026-07-27_bastrop_qa_defect_register]
---

# QA5 executor close — bearing parity restore

**Builder does not grade MET.** Planner verifies one formula on main + the
guard before MET.

## Current-state finding

| Check | Result |
|---|---|
| `origin/main` `annotation-placement.ts` | **CORRECT** — imports + thin re-exports from `../../geometry/gis-property-line-tags.js` |
| PR #151 (`feat/c1-bastrop-hardening-cleanup`) | **MERGED** 2026-07-27T15:45:46Z — merge SHA `ed378b7` |
| Did #151 land the bearing fork? | **NO** — merge touched setbacks / atom-contract pin only; tip of `origin/feat/c1-bastrop-hardening-cleanup` and C1 worktree `ec1a70f` keep the shared import |
| Local stale `pr-151-c1` (`ea79d58`) | **HAS THE FORK** (inlined `formatGisBearing` / `formatPropertyLineTag` / honesty string) — no remote; never merged. Do not revive. |

Fork did not reach main. Restore of shared import was **not required**. Work
was promote the mechanical guard so the fork cannot silently reappear
(including via craft edits on the same file — QA2 coordinates on a separate
branch).

## PR / SHA

| Repo | Branch | PR | SHA |
|---|---|---|---|
| hauska-engine | `qa/bearing-parity-restore` | [#156](https://github.com/empressaioemail-tech/hauska-engine/pull/156) | `fb65613db76a8a42f6af0689fca4573ed84308f8` |

Worktree: `P:\hauska-engine-worktrees\qa5-bearing` (did not touch main clone).

## What landed

Single new test:
`packages/engine-core/src/site-plan/pdf/__tests__/bearing-parity-m0.test.ts`

1. **Source-text guard** — `annotation-placement.ts` must import
   `gis-property-line-tags` and re-export Shared aliases; must NOT contain
   `Math.atan2(dxMeters…)`, `export function formatGisBearing(`, or the
   inlined honesty string (pr-151-c1 telltales).
2. **Runtime parity** — PDF path
   (`annotation-placement.formatPropertyLineTag` /
   `formatGisBearing`) equals atom path
   (`gis-property-line-tags` + `computePropertyLineTagsFromLocalEnuEndpoints`)
   on known segment `(0,0)→(10,30)` lengthFeet `104.3`; honesty strings equal.

No redesign of site-plan craft; `annotation-placement.ts` untouched on this
branch.

## Verify evidence

```
pnpm -C packages/engine-core build   # tsc -b clean
pnpm -C packages/engine-core exec vitest run
  Test Files  65 passed (65)
  Tests       379 passed | 2 skipped (381)
bearing-parity-m0.test.ts — 2/2 green
```

## Planner next

1. Confirm main still shows shared import after any concurrent QA2 craft PR.
2. Confirm M0 guard is on the merge path.
3. Grade WDLL / defect register only after that — builder does not claim MET.
