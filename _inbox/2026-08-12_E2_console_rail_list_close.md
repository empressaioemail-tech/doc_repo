---
title: E2 close — Command Center County Manifest renders the API rail set
date: 2026-08-12
status: complete
repo: hauska-map (apps/command-center)
pr: 158
merge_commit: 848b6e2
deployed: https://cmdcenter-blush.vercel.app
---

# E2 close: console rail list derived, not declared

## What was wrong

The County Manifest panel built its columns from a hardcoded array, `MANIFEST_RAILS` at `countyManifestTypes.ts:78-92`, holding 13 entries. The API has served 14 rails since the 2026-08-09 R1 ruling split `rrc` into `rrc-wells` plus `rrc-pipelines` and added `rail-corridor`. The frontend never followed.

The visible symptom was a header that contradicted itself: it printed the grid as `254x13` next to a cell count of 3,556, when 254 times 13 is 3,302. The cell count was right because it came from the API; the dimension label was wrong because it came from the local array.

The substantive defect was the collapsed RRC column. The two rails are in materially different states, and merging them into one `RRC 0/254` made a rail that is built and ready to apply look identical to one that does not exist. Verified live against `GET /api/county-ledger`:

| rail | displayState | atomFamilyState | hasWriter | reading |
|---|---|---|---|---|
| rrc-wells | not-yet x254 | present | true | built, ready to apply |
| rrc-pipelines | no-atom x254 | missing | false | not built |

Two further defects rode along. A `JOIN` column persisted from before the 2026-08-08 ruling that removed `join` from the rail declaration when join quality became a derived metric, and `rail-corridor` was missing entirely.

## What was done

The fix is derivation rather than a list refresh, because a refreshed list drifts again on the next rail split. `deriveRails(railCapabilities, manifestCells)` builds the ordered column set from the API response. It prefers the authoritative ordered `railCapabilities` array and falls back to first-appearance order in `manifestCells`, and it returns an empty list when neither is present so the panel degrades honestly instead of substituting a local guess.

`MANIFEST_RAILS` and `RAIL_COUNT` are gone. What remains is `RAIL_LABELS`, a presentation-only lookup for short headers and long names. A rail absent from it still renders, taking a short header from `fallbackShort()`. The worst outcome for an unknown future rail is an ugly four-character label, never a missing or extra column.

Every grid dimension label now derives from the API, so the header cannot contradict its own cell count. A second hardcoded assertion turned up in the same panel that the dispatch had not named: line 594 printed a literal `/254` denominator in every rail header. That now derives from `summary.totalCounties`.

The frontend types were a version behind the API, as previously reported. `ManifestSummary` was missing `satisfiedPresentCells`, `satisfiedPresentPartialCells` and `satisfiedAbsentCells`, and `ManifestLedgerResponse` did not declare `railCapabilities` at all. All four are added, along with a `RailCapability` interface.

## The control that makes this self-detecting

The old test suite could never have caught the drift, because it asserted the console against the same hardcoded constant the console rendered from. That is the same instrument-not-data shape as the defect itself.

Tests now use an explicit `FIXTURE_RAILS` fixture mirroring the live API, and one new test feeds a payload whose rail set the frontend does not declare, including an invented `a-brand-new-rail`, then asserts the grid follows the API anyway. A second new test asserts both RRC rails render as separate columns with `rail-corridor` present and no `rrc` or `join` column. A third asserts the dimension label always agrees with the served cell count.

## Verification on the deployed surface

The served bundle at `https://cmdcenter-blush.vercel.app` is `assets/index-1KzuchSX.js`, matching the local build hash of the fixed code. Grepping the served bundle finds `rrc-wells`, `rrc-pipelines`, `rail-corridor`, `RRC wells`, `RRC pipelines` and `Rail corridors` each present, and zero occurrences of every stale assertion: `Join quality`, `RRC wells / pipe`, `254 counties x 13 rails`, `254 counties`, `13 rails`.

Fetching the API through the console's own proxy at `/api/spine/cortex/api/county-ledger` returns HTTP 200 with `totalRails` 14, `totalCells` 3,556, and 14 `railCapabilities` keys. 254 times 14 is 3,556, which equals `totalCells`, so the arithmetic contradiction is closed at the source rather than papered over.

CI conclusion string was `success` on head SHA `31b4534`. Merged as `848b6e2`.

## Findings worth acting on separately

The deploy path for this app is a trap that has bitten repeatedly. The repo root `.vercel` is linked to `property-explorer` while `apps/command-center/.vercel` is linked to `cmdcenter`, so a root deploy lands on the wrong project by default. The reverse also fails: deploying from inside `apps/command-center` breaks the build with `ERR_PNPM_NO_MATCHING_VERSION_INSIDE_WORKSPACE` on `@hauska/map-renderer`, because only that subtree uploads and the workspace sibling under `packages/` is absent. The working method is to deploy from the repo root using the root `vercel.json`, after re-linking root to `cmdcenter` and restoring the link afterwards. The production deployment list shows the signature of others hitting this: errors lasting two to three seconds interleaved with successes lasting twenty-six to twenty-eight. A per-app deploy script or a Root Directory setting on the `cmdcenter` project would end it.

`ActiveContextBar.tsx` carries real type errors that look like genuine breakage rather than the repo's pre-existing jest-dom matcher noise: `activeParcel`, `setActiveParcel`, `jurisdictionId`, `latitude` and `longitude` do not exist on the types they are used against. Untouched here per the concurrent-lane clause, but it deserves its own dispatch.

CI caught something local green did not. My new full-grid test exceeded vitest's five-second default on the CI runner while passing locally; the pre-existing full-grid test already carried an explicit thirty-second timeout for exactly that reason. Fixed by matching the existing pattern. The CI conclusion string, not the local run, was the authority.
