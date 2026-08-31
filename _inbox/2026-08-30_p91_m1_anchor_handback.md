---
id: 2026-08-30_p91_m1_anchor_handback
title: P-91 v3 M-1 parcel anchor on the MCP wire, handback
date: 2026-08-30
status: returned
plan_row: P-91 v3 M-1
---

# P-91 v3 M-1 handback: a real parcel anchor on the MCP wire

## Snapshot

Repository `legacy-design-tools`, worktree `P:/tmp/legacy-design-tools-p91-stone`, branch `feat/p91-v3-map`, commit `28969a36cc55b32247aeb3d362ae4f2d3054bf49`. No git write was run. All edits are in the working tree under `artifacts/smartsite-mcp/` and are unstaged and uncommitted for the planner.

Suite: 238 passing before, 267 passing after, 15 files, green.

## What the upstream actually serves, read before building

The brief's coordinate was verified at the source rather than assumed. Three anonymous GETs against deployed cortex `https://cortex-api-tds7av26va-uc.a.run.app` on 2026-08-30, no Authorization header, all HTTP 200:

    48021:31254 -> cityLimitsFact.queryPoint = {"longitude":-97.32528,"latitude":30.10592}
    48021:49295 -> cityLimitsFact.queryPoint = {"longitude":-97.33348,"latitude":30.11473}
    48021:82112 -> cityLimitsFact.queryPoint = {"longitude":-97.31907,"latitude":30.12288}

Two things the brief did not state and the code depends on. `cityLimitsFact` is a TOP LEVEL key on the facets body, a sibling of `facets`, not nested inside it. The body's top level keys are parcelNodeId, adapterKey, source, snapshotAt, facets, tier2, floodHazardFact, landUseFact, specialDistrictFact, pipelineFact, wellFact, buildingFootprintFact, boundaryEdgeFact, ownerFact, structuralFact, cityLimitsFact. The reader looks at the top level only, and a fixture pins that a copy buried under `facets` is NOT read, so a shape change upstream surfaces as an honest absence rather than a silently relocated success.

## What was built, file by file

`artifacts/smartsite-mcp/src/parcel-anchor.ts` (new, 213 lines). The whole anchor path. Exports `PARCEL_FACETS_PATH_TEMPLATE` and `parcelFacetsPath(id)` so the next lane asserts against the constant instead of copying the string, `ANCHOR_TIMEOUT_MS`, `ANCHOR_READ_CAP`, `ANCHOR_PRECISION`, `ANCHOR_SOURCE`, the `ParcelAnchor` / `AnchorRead` / `AnchorOutcome` types, the pure parser `anchorFromFacetsBody`, the fetch wrapper `readParcelAnchor`, the two skip constructors, and `attachAnchorToResponseText`. `readParcelAnchor` never throws: every upstream failure becomes a declared outcome, because a failed anchor read must not fail the panel.

`artifacts/smartsite-mcp/src/cortex-client.ts` (modified, 12 lines changed). One additive option, `timeoutMs`, on the existing `cortexFetch` init. The existing 30 second default is unchanged for every existing caller. No second HTTP client was written and no host is hardcoded anywhere.

`artifacts/smartsite-mcp/src/tools.ts` (modified, 30 lines changed). Inside `get_smart_site` only. The brief request is now started, not awaited, then the anchor promise is created, then the brief is awaited. The anchor outcome is joined after the brief body is read and attached to the normalized 200 body. Nothing else in the file moved.

`artifacts/smartsite-mcp/tests/parcel-anchor.test.ts` (new, 26 tests) and `artifacts/smartsite-mcp/tests/cortex-client-timeout.test.ts` (new, 3 tests).

`artifacts/smartsite-mcp/tests/tools.test.ts` (modified, 18 lines changed). One pre-existing assertion had to move; see "Pre-existing test that changed" below.

`src/mcp-app.ts` was NOT touched. `src/constants.ts` was NOT touched, so the catalog stays at 13 tools and the `get_smart_site` description is unchanged. Nothing outside `artifacts/smartsite-mcp/` was edited.

## The wire shape

On a single id at node depth, a 200 result gains two top level siblings of `draw`:

    "anchor": { "lat": 30.10592, "lon": -97.32528, "precision": "1e-5-deg", "source": "bake-latlng-index" },
    "anchorRead": { "status": "ok" }

`anchor` is present if and only if `anchorRead.status` is `ok`. Every other status carries a `reason` and no `anchor` key at all.

    status ok       reason none
    status absent   city_limits_fact_absent | query_point_absent | query_point_not_numeric | query_point_zero_sentinel
    status error    anchor_body_not_json | anchor_upstream_non_ok (plus upstreamStatus) | anchor_body_unreadable | anchor_read_timeout | anchor_fetch_failed
    status skipped  anchor_read_batch_cap (plus cap 1 and received N) | anchor_read_stub_depth

## Deviation from the brief that the next lane must know

The brief says `anchorRead` "is one of ok, absent, error, skipped, each with a reason string when it is not ok". A bare string cannot carry a reason, and the Rules line in the same card requires the package's existing error declaration shape, `status` and `reason`. So `anchorRead` is an OBJECT whose `status` field is one of the four values, matching `HauskaDepHealth` in `hauska-client.ts` (`{state, latency_ms, detail}`) and the declared error bodies in `tool-honesty.ts` (`{status, reason, ...}`). A next-lane check written as `result.anchorRead === "ok"` will read `undefined` and fail closed rather than silently passing, which is the safe direction, but it is a change from the literal wording and the map lane should be told before it writes that predicate.

Two smaller calls, both flagged rather than buried. The facets read does NOT send `X-PE-User-Id`. The route is anonymous, the live probe that established the shape sent no user header, and sending one could route the request through an entitlement path that the probe never exercised. `cortexFetch` still attaches the service bearer, as it does for every call in this package. Second, the anchor is attached on the 200 path only. A declared miss (404 `parcel_not_found`, 402 `upgrade_required`) returns exactly the body it returns today with no `anchor` and no `anchorRead`, because there is no parcel to anchor and because attaching there breaks five existing wire-contract tests that assert those bodies exactly. That choice is pinned by a fixture so it cannot drift silently.

## Timeout, and which one it matches

`ANCHOR_TIMEOUT_MS` is 2,000 ms, matching `PROBE_TIMEOUT_MS` in `src/hauska-client.ts`, the package's existing bound for an optional side call whose latency must not roll into the primary path. The other value available was the client's 30,000 ms default, which is wrong here for a concrete reason: the anchor is joined after the brief, so the panel waits max(brief, anchor), and a 30 second bound would let a hung facets call add up to 27 seconds to a 3 second brief. Concurrency alone does not bound the panel; the join does, so the bound has to be tight. Cost of the tight bound: a cold cortex could return the anchor as `error` / `anchor_read_timeout` while the brief still succeeds. That is a declared degradation, never a fabricated coordinate.

The timeout claim rests on two independent halves, deliberately. `tests/parcel-anchor.test.ts` asserts the caller passes `ANCHOR_TIMEOUT_MS`. `tests/cortex-client-timeout.test.ts` runs the real, unmocked `cortexFetch` against a stubbed global fetch and proves the client aborts at the value supplied, and that a call without `timeoutMs` does not abort at the anchor bound.

## Fixtures

26 in `tests/parcel-anchor.test.ts`:

Three live parcels, one test each, asserting the real served coordinate on the wire beside an untouched `draw`. The exported path is used verbatim and percent-encoded (`/api/brokerage/v1/place/node/48021%3A31254/facets`) and carries `timeoutMs`. The anchor request is issued while the brief is still pending (the brief is held open by a deferred mock and released only after the observation).

No coordinate that was not read: `cityLimitsFact` absent, `queryPoint` null, `queryPoint` 0,0, longitude 0 with a real latitude, latitude 0 with a real longitude, a stringified numeric pair, a non-JSON upstream body, a facets 404, an AbortError timeout, a non-abort transport failure, an `anchor` key smuggled in by the brief body, and a shared upstream Response that the anchor read must not consume. Every one of these asserts `isError` false, `draw` byte-identical, and no `anchor` key. Plus the declared-miss case carrying neither key.

Scope: an array at node depth is skipped with cap 1 and received 3 and reads no facets; a one-element array is still a batch; a single id at stub depth is skipped; an explicit `depth: node` on one id does read; and the 25-id node batch cap is unchanged and still refuses 26 before cortex.

Three unit fixtures on the pure parser, including the "cityLimitsFact is top level only" nesting check and an exact-keys assertion on the four anchor fields.

3 in `tests/cortex-client-timeout.test.ts`: aborts at the supplied bound, does not abort when the call answers inside it, and a default-timeout call is not aborted at the anchor bound.

## Mutation table

Fifteen mutations applied to the source one at a time by a file-based runner that restores the originals in a `finally`. Each ran the whole suite. Every mutation was caught. None was vacuous.

    M0  feature disabled (failing-first control)          21 failed  all 20 anchor fixtures plus the call-count loop
    M1  sentinel check deleted                             4 failed  0,0; lon 0; lat 0; parser unit fixtures
    M2  sentinel weakened to lon===0 && lat===0            2 failed  lon 0 with real lat; lat 0 with real lon
    M3  concurrency removed (anchor after the brief)       1 failed  issues the anchor request before the brief has resolved
    M4  skipped-on-batch removed (arrays fan out)          3 failed  array at node depth; one-element array; plus the pre-existing 25-id node cap test
    M5  absent emits a 0,0 anchor                          9 failed  every absent fixture plus both parser unit fixtures
    M6  anchor timeout not passed                          1 failed  exported path and anchor timeout
    M7  attach keeps an upstream anchor key                1 failed  an anchor the brief body carried is dropped
    M8  stub depth reads an anchor                         1 failed  single id at stub depth is skipped
    M9  numeric guard weakened to non-undefined            2 failed  stringified pair; parser unit fixtures
    M10 facets non-OK body parsed anyway                   1 failed  facets non-OK carries the HTTP status it saw
    M11 non-JSON body reported absent instead of error     2 failed  non-JSON body is an error; parser unit fixtures
    M12 transport failure swallowed into ok                2 failed  timeout is a declared error; non-abort failure is declared
    M13 res.clone() removed                                2 failed  shared-body fixture plus the pre-existing A3 gold-draw test
    M14 anchorRead attached to the declared-miss body      6 failed  declared-miss fixture plus five pre-existing wire-contract tests

Verdict on all fifteen: the predicate is load-bearing and the fixture that covers it is not vacuous. M0 is the failing-first control: with the feature disabled, 20 of the 26 new fixtures fail, so the new suite is measuring the new behaviour and not passing on absence.

Two mutations were caught by tests written by an earlier lane rather than by mine (M4 by the 25-id node cap test, M13 by A3), which is a second, independent derivation on those two properties.

## Things found that the brief did not anticipate

The suite mocks cortex with `mockResolvedValue(new Response(...))`, one Response instance served to every call. A second concurrent reader on the same call therefore competes for one body, and the anchor read resumes first, so a naive implementation consumes the brief's body and breaks the pre-existing A3 gold-draw test. `readParcelAnchor` reads `res.clone()` instead. That is not a workaround for the mock: an optional side read must never disturb a body another reader owns, and M13 shows the property is real and load-bearing in both the new fixture and the old one.

`npx tsc -p tsconfig.json --noEmit` cannot run clean in this worktree. It reports five TS6305 errors in `src/auth.ts`, `src/entitlement.ts`, `src/identity.ts` and `src/request-context.ts`, all saying `lib/db/dist/...` has not been built from source. All five are in files this task did not touch and all five predate this work; `tsc -b lib/db` first is the known remedy. Vitest transpiles without typechecking, so the suite is green regardless. The new module was written to typecheck, but that has NOT been proven by a clean `tsc` run in this tree and should not be claimed.

## Pre-existing test that changed

`tests/tools.test.ts`, the `CORTEX_CALLS` loop assertion at the former line 1582, asserted `toHaveBeenCalledTimes(1)` for every cortex-backed tool. A single-id node `get_smart_site` now issues a second, concurrent cortex call by design, so that count is 2 for exactly that one entry. Rather than loosen the assertion, a small `expectedCortexCalls(name, args)` helper returns 2 only for a `get_smart_site` call whose `parcelNodeId` is a string, and 1 for everything else, so the original guarantee (no other tool retries or fans out) still fails if it is violated. That is the only pre-existing assertion touched. The sibling loop test needed no change.

## Verification, raw

    $ cd P:/tmp/legacy-design-tools-p91-stone/artifacts/smartsite-mcp && npx vitest run

     RUN  v3.2.4 P:/tmp/legacy-design-tools-p91-stone/artifacts/smartsite-mcp

     ✓ tests/oauth-metadata.test.ts (1 test) 3ms
     ✓ tests/entitlement.test.ts (9 tests) 3ms
     ✓ tests/mcp-app-probe.test.ts (12 tests) 16ms
     ✓ tests/tool-honesty.test.ts (34 tests) 13ms
     ✓ tests/export-degraded.fixture.test.ts (4 tests) 7ms
     ✓ tests/pe-screen-query-resolve.test.ts (4 tests) 8ms
     ✓ tests/cortex-client-timeout.test.ts (3 tests) 59ms
     ✓ tests/parcel-anchor.test.ts (26 tests) 71ms
     ✓ tests/mcp-app.test.ts (40 tests) 133ms
     ✓ tests/mcp-app-served.test.ts (43 tests) 426ms
     ✓ tests/tools.test.ts (69 tests) 184ms
     ✓ tests/constants.test.ts (5 tests) 3ms
     ✓ tests/health-split.test.ts (6 tests) 78ms
     ✓ tests/server.test.ts (7 tests) 103ms
     ✓ tests/auth-entitlement.test.ts (4 tests) 353ms

     Test Files  15 passed (15)
          Tests  267 passed (267)
       Start at  18:09:33
       Duration  2.37s (transform 1.74s, setup 0ms, collect 9.18s, tests 1.46s, environment 2ms, prepare 2.76s)

    $ cd P:/tmp/legacy-design-tools-p91-stone && git status --short -- artifacts/smartsite-mcp
     M artifacts/smartsite-mcp/src/cortex-client.ts
     M artifacts/smartsite-mcp/src/tools.ts
     M artifacts/smartsite-mcp/tests/tools.test.ts
    ?? artifacts/smartsite-mcp/cloudbuild.p547.yaml
    ?? artifacts/smartsite-mcp/cloudbuild.p548.yaml
    ?? artifacts/smartsite-mcp/cloudbuild.p549.yaml
    ?? artifacts/smartsite-mcp/cloudbuild.p550.yaml
    ?? artifacts/smartsite-mcp/cloudbuild.p551.yaml
    ?? artifacts/smartsite-mcp/cloudbuild.p552.yaml
    ?? artifacts/smartsite-mcp/cloudbuild.p553.yaml
    ?? artifacts/smartsite-mcp/cloudbuild.p554.yaml
    ?? artifacts/smartsite-mcp/src/parcel-anchor.ts
    ?? artifacts/smartsite-mcp/tests/cortex-client-timeout.test.ts
    ?? artifacts/smartsite-mcp/tests/parcel-anchor.test.ts

    $ cd P:/tmp/legacy-design-tools-p91-stone && git diff --stat -- artifacts/smartsite-mcp
     artifacts/smartsite-mcp/src/cortex-client.ts | 12 +++++++++--
     artifacts/smartsite-mcp/src/tools.ts         | 30 ++++++++++++++++++++++++++--
     artifacts/smartsite-mcp/tests/tools.test.ts  | 18 ++++++++++++++++-
     3 files changed, 55 insertions(+), 5 deletions(-)

The eight `cloudbuild.p54*.yaml` files were already untracked in this worktree before this task began (they appear in the `git status` taken at session start) and were not created here. `git status --short` over the whole tree shows no modified or untracked file outside `artifacts/smartsite-mcp`.

## Left undone

No `tsc` clean run, for the pre-existing TS6305 reason above. Not deployed, not committed, not pushed. The panel does not yet consume `anchor`; `mcp-app.ts` was deliberately left alone for the later lane that owns it, and nothing in it reads the new keys today, so this is on the wire and not yet on the screen. No end-to-end check against live cortex through the MCP server was run, because that needs a deploy; the shape the parser expects was verified directly against the live route instead.

    leave_behind:
      - item: branch feat/p91-v3-map, six changed or added files under artifacts/smartsite-mcp, uncommitted
        owner: planner
        plan_row: P-91 v3 M-1
