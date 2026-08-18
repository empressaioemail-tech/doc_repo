---
title: TW-21 close — Smart Markets human surface built to its design system
date: 2026-08-17
status: complete
lane: TW-21
repo: smart-markets
branch: tw21/human-surface
pr: 5
plan_row: TW-21 (_rd_disclosure_twin/08_build_scope.md; Smart Markets is unregistered R&D, no OPS-16 PLAN-ROW by design, per operator canon override)
last_updated: 2026-08-17
---

# TW-21 close: the Smart Markets human surface

## Result

Complete. The structure-only skeleton in `apps/web` is replaced by the designed surface, built to `docs/design-system.md` and its rendered reference `docs/design-system.html`. Two views, instrument and search. CI is green on the PR.

## Branch, PR, and where the work lives

Branch `tw21/human-surface`, PR **#5**, open against `main`, NOT merged. The planner merges after review.

The work was done in a git worktree at `P:/smart-markets-worktrees/tw21-human-surface`, not in `P:/smart-markets`. That was forced: the shared clone at `P:/smart-markets` was checked out to another lane's branch (`tw40/web-ci`) while this work was in flight, and the branch pointer for `tw21/human-surface` was moved back to `origin/main` under me. The worktree removed the collision. Its `node_modules` is a directory junction to `P:/smart-markets/node_modules`.

TW-40 merged to `main` mid-session, so `origin/main` moved from `eb8d172` to `6a6236f`. `git rebase` is blocked by the permission system in this environment, so the branch carries a merge commit of `origin/main` instead of a rebase. PR #5 reports `MERGEABLE`.

Commits on the branch:

```
5c2cc6e feat(web): TW-21, the human surface built to its design system
94cde8f merge: origin/main (TW-40 web CI harness) into tw21/human-surface
2bf434d docs: commit the Smart Markets design system alongside the surface it governs
```

The design system files were untracked at dispatch and are committed unchanged in the first commit, so the spec is tracked alongside the implementation that obeys it.

## Files changed

Committed in `5c2cc6e`, 16 files, 3,331 insertions / 417 deletions:

```
 apps/web/index.html                                |    7 +-
 apps/web/src/App.tsx                               |  170 ++-
 apps/web/src/__tests__/absence-blocks.test.tsx     |  175 +++
 apps/web/src/__tests__/fixtures.ts                 |   49 +
 apps/web/src/__tests__/instrument-surface.test.tsx |  278 +++++
 apps/web/src/components/AbsenceBlock.tsx           |  176 ++-
 apps/web/src/components/LayerRail.tsx              |  121 ++
 apps/web/src/components/LayerSection.tsx           |   85 +-
 apps/web/src/components/ProvenanceStamp.tsx        |   37 +
 apps/web/src/components/ProxyBlock.tsx             |   78 ++
 apps/web/src/components/QuoteBlocks.tsx            |  478 ++++++++
 apps/web/src/components/UpstreamStatus.tsx         |   44 +
 apps/web/src/layers.ts                             |   79 ++
 apps/web/src/styles.css                            | 1161 +++++++++++++++++---
 apps/web/src/views/InstrumentView.tsx              |  635 ++++++++---
 apps/web/src/views/SearchView.tsx                  |  175 ++-
 16 files changed, 3331 insertions(+), 417 deletions(-)
```

Plus `docs/design-system.md` and `docs/design-system.html` in `2bf434d`, unedited.

`apps/web/src/client.ts`, `main.tsx`, `vite-env.d.ts`, and TW-40's `__tests__/smoke.test.tsx` show as modified in `git status` with a zero-byte content diff. That is Windows autocrlf phantom-dirt from prettier rewriting line endings. They were deliberately NOT staged and their content is unchanged.

## What was built

The token layer in `styles.css` is the reference's token layer, extracted from `docs/design-system.html` by `sed` and concatenated, never retyped. All three blocks are present in order: `:root`/`.sm-light`, the `prefers-color-scheme: dark` query guarded with `:root:not([data-theme="light"])`, and `:root[data-theme="dark"]`/`.sm-dark`. The product-layer CSS is likewise extracted from the reference rather than re-authored. No colour on the surface is anything but a `--sm-` token.

The four kinds of nothing were built first, because they are the product. Absent-verified is neutral and solid, since it is a successful determination and colouring it would file a result next to a fault. Lookup-failed is amber with a dashed edge, states outright that it is not a finding of absence, and labels its footer field **Scope attempted** rather than Scope searched, because the scope was never searched. Not-applicable is violet with a struck rule under the headline. All three render authority, scope, determined-at, and basis.

`OmittedBlock` is a separate component that takes no `Absence` at all. It cannot render an authority row because it is never given one. That is structural, not a styling choice: nothing was searched and no authority was consulted, so an authority row would be a determination nobody made. Its footer carries only `contractVersion` and the served-layer list.

Headline and body copy are our narration and are set in the prose face; every payload string is in mono. That split is the design system's type rule doing real work: a reader can see which sentences we wrote and which came out of the response.

Partial renders as the populated layer plus the absence covering exactly the missing slice, under the label "What this layer does not hold". No section header carries a status badge of any kind, for any status.

A proxy renders in its own block with the striped edge, the amber header, demoted `--sm-ink-2` value, the full "stands in for" sentence, and the rationale as a first-class field. A test asserts the proxy's title, series id, and `proxyFor` string appear nowhere inside the drivers table and that the block is not a descendant of it.

The provenance class is declared exactly once per block. The section header carries the layer's stamp; absences nested under it do not repeat it. Volume profile carries its own Derivation stamp inside the Observation layer and states formula and inputs rather than a measurement.

Dark is the product: `index.html` opens with `data-theme="dark"` and the app bar carries a Dark/Light toggle so the printable sibling is reachable.

## Which fixture verified which state

Every designed state was developed against a committed fixture. No fixture was authored and no payload was hand-built.

| State | Fixture that produced it |
| --- | --- |
| `absent-verified` | `cvrb.adjacent-absences.operating-company.json` roster layer, and `market.quotes.chain` |
| `lookup-failed` | `cvrb.adjacent-absences.operating-company.json` drivers layer, and `market.quotes.depth` |
| `not-applicable` | `gc.contract.json` roster layer, and the room's `authorityDeterminations` entry for SEC |
| omitted | `spy.fund.json`, which carries no `layers.roster` key at all |
| `partial` | `khrb.partial.operating-company.json` room, roster, and `market.quotes.history` |
| fully populated, empty proxies | `aapl.operating-company.json` |
| degraded upstream banner | `cvrb.adjacent-absences.operating-company.json` provenance, cockpit degraded |

Fixtures are loaded in tests through the contract's own `parseFixture`, so a fixture that drifts from the schema fails at load rather than rendering something the contract would have refused.

## How /GC reads

It reads as deliberate rather than broken, which was the test.

The identity header states `GC`, `Gold futures (COMEX)`, the `contract` and `futures` badges, the node id, both identifiers, and **No issuer node** on the second line, so a reader knows why there is no issuer material before scrolling.

The room holds three CME documents in a full table, and beneath it, under "Determinations inside this room", the SEC not-applicable determination for issuer disclosure at full weight with all four footer fields. A reader can tell a category error from a gap without opening the JSON.

Roster is a full-height section carrying the not-applicable block with authority SEC, the scope, the timestamp, and the basis "a futures contract has no issuer, so it has no board, no officers, and no insiders to report". It is as visually present as Room. Nothing is shrunk.

Drivers shows two series in the table, then, separated, "Declared proxies · not this instrument's fundamentals" and the GLD block with the striped edge, the full stands-in-for sentence, the 902.44 tonnes value in demoted ink, and the whole rationale paragraph.

Market shows the price tiles, then history, chain, depth, tape, and volume profile as their own blocks, each with its measurement or its formula and inputs stated underneath. Synthesis sits last with the quoted rule and its citations split into scheme and identifier.

The rail lists all five layers with an em dash for size, "Response bound —" with the reason, and "Layers requested 5 / 5".

## How SPY's omitted roster renders

The funnel walks `SERVED_LAYERS_V0_1`, so the slot is held open whether or not the payload filled it. The rendered section order is exactly `Room, Roster, Drivers, Market · quotes, Synthesis`. The Roster section carries `data-layer-status="omitted"` and the dotted ghost, headed "Not served at 0.1.0", with the body explaining that the fund-shape roster is not served because a fund's people are trustees and officers of the trust rather than a company board, and that nothing was searched and no authority was consulted. Its footer carries only `Known from: contractVersion 0.1.0` and `Served layers: room, roster, drivers, market, synthesis`. There is no authority row.

The rail lists it separately under "Not served for this node" as `Roster · fund shape`, disabled, with an em dash for size.

## Designed but NOT rendered, and not faked

Section 8 of the spec lists four. None was invented client-side.

1. **Calibration on Judgment.** No field exists. Not rendered. The stamp ladder supports the Judgment form, but no calibration meter is drawn and no Judgment content is served at v0.1.
2. **Cohort size on Attention.** No field exists. Not rendered.
3. **Served-layer manifest from the endpoint.** The package constant `SERVED_LAYERS_V0_1` is used, which the spec explicitly blesses while the client imports the contract. The API's `GET /v0.1/contract` does report a manifest including `notServedAtThisVersion`, but the web client has no method for it and adding one was out of scope; the "not served" rail group is therefore derived from the response plus the constant, and lists only layers missing for THIS node. `market.computed` is consequently not listed anywhere, because naming it would mean hardcoding knowledge the client does not hold.
4. **Per-layer byte cost.** Not served. Every size slot in the rail is an em dash, and the budget states "Per-layer size is not served at contract 0.1.0, so there is no byte bound to state." The meter measures the one quantity that is knowable, requested layers over served layers, and says so. Estimating bytes client-side and printing a number would have been fabrication on the one instrument whose entire claim is that it bounds the response.

**A fifth, found during the build and not in section 8.** The reference app bar carries a "Synthetic fixture" badge. Nothing in the twin envelope distinguishes a synthetic payload from an observed one: `$fixture` is the fixture file's wrapper and is outside `TwinSchema`, and the API never serves it. A badge that is always on would be false on real data; one that is always off would be false on a fixture. It is therefore **not rendered**, and closing it needs a contract field. Flagging rather than faking.

**Search view field gaps.** The design's search row carries authorities beneath the name, a provenance stamp, and a last price, and a "Not indexed" state for a known instrument with no twin. `SearchHit` carries only `nodeId`, `displayName`, `shape`, and `symbol` — and it is defined in `apps/api/src/upstreams/types.ts` and mirrored in the web client, not in the contract package at all. So the row renders symbol, display name, node id, and the shape badge, and nothing else. "Not indexed" is not renderable per row because no field distinguishes an indexed hit from an un-twinned one. Zero results renders as a plain statement about the index that explicitly carries no authority, scope, or basis, because nobody determined anything.

## Verification, raw

```
$ npm run lint

> smart-markets@0.1.0 lint
> eslint .

EXIT=0
```

```
$ npm run build --workspace @smart-markets/web

> @smart-markets/web@0.1.0 build
> tsc --noEmit -p tsconfig.json && vite build

vite v5.4.21 building for production...
transforming...
✓ 66 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.67 kB │ gzip:  0.42 kB
dist/assets/index-DGeyXx3g.css   17.42 kB │ gzip:  3.84 kB
dist/assets/index-DssCQaLC.js   242.05 kB │ gzip: 68.64 kB │ map: 742.61 kB
✓ built in 595ms
EXIT=0
```

```
$ npm run test --workspace @smart-markets/web

> @smart-markets/web@0.1.0 test
> vitest run

 RUN  v2.1.9 P:/smart-markets-worktrees/tw21-human-surface/apps/web

 ✓ src/__tests__/smoke.test.tsx (2 tests) 25ms
 ✓ src/__tests__/absence-blocks.test.tsx (6 tests) 33ms
 ✓ src/__tests__/instrument-surface.test.tsx (19 tests) 265ms

 Test Files  3 passed (3)
      Tests  27 passed (27)
   Start at  22:43:00
   Duration  1.44s

EXIT=0
```

```
$ npm run format:check
...
[warn] packages/contract/src/primitives.ts
[warn] packages/contract/src/provenance.ts
[warn] packages/contract/src/twin.ts
[warn] packages/contract/src/version.ts
[warn] packages/contract/tests/contract.test.ts
[warn] packages/contract/tests/fixtures.test.ts
[warn] packages/contract/tests/fixtures.ts
[warn] packages/contract/tsconfig.check.json
[warn] packages/contract/tsconfig.json
[warn] README.md
[warn] tsconfig.base.json
[warn] Code style issues found in 57 files. Run Prettier with --write to fix.

$ npx prettier --check . --end-of-line auto
Checking formatting...
All matched files use Prettier code style!
EXIT=0
```

`format:check` is red LOCALLY ONLY, on 57 files, **none of which are mine**. Intersecting the failing list against `git status` returned empty. The cause is the known Windows CRLF trap: `core.autocrlf=true` yields CRLF working-tree files and prettier defaults to `endOfLine: "lf"`. A pristine `git archive origin/main` export reproduces it at 66 files with zero of my code present, which proves it pre-dates this branch. `--end-of-line auto` reports the whole repo clean. I did NOT run `prettier --write` at the repo root, because that would have rewritten 57 unrelated files and buried the surface diff.

CI settles it. On the PR head `5c2cc6ef157f99a88b8e997b892777a6d0c17af6`:

```
$ gh run view 32096571913 --json conclusion,status,headSha
{"conclusion":"success","headSha":"5c2cc6ef157f99a88b8e997b892777a6d0c17af6","status":"completed"}

$ gh pr checks 5
build-test         pass  1m6s
structural-gates   pass  6s
```

`build-test` runs `npm run format:check` on Linux and passes.

## Tests written

`apps/web/src/__tests__/absence-blocks.test.tsx`, six tests. Each of the three served verdicts renders its own class, its own key label, and all four footer fields with the payload's own values; lookup-failed's scope field says "attempted". The omitted block renders footer labels exactly `["Known from", "Served layers"]` and its footer names no authority. A final test proves all four verdicts differ pairwise in verdict attribute, class, and key label.

`apps/web/src/__tests__/instrument-surface.test.tsx`, nineteen tests. SPY's omitted ghost in document order and its missing authority row and its rail entry. KHRB partial rendering content and absence together at layer and sub-block altitude, and never as a header badge. GC's proxy absent from the series table and present in its own block with its full rationale, its not-applicable roster at full weight, its no-issuer header, its room determination, and its Derivation-inside-Observation stamp. CVRB's two verdicts adjacent at both altitudes plus the degraded banner. AAPL fully populated with no absence block anywhere and its empty proxies array stated rather than hidden. The rail's toggle removing a section entirely, and the em-dash size slots. Plus a guard that the surface renders no `canvas`, no `svg`, and no sparkline.

`apps/web/src/__tests__/fixtures.ts` is a helper, not a test file, and is outside the vitest include glob.

The dispatch anticipated tests would not run green until the harness landed. TW-40 merged mid-session, so they DO run green: 27 passed, including TW-40's two smoke tests, which were not modified.

## Boundaries

Runtime dependencies unchanged: `@smart-markets/contract`, `react`, `react-dom`. No charting library. No new dependency of any kind.

`apps/web/package.json`, `apps/web/vitest.config.ts`, `.github/**`, `packages/contract/**`, `apps/api/**`, and every root config are untouched. TW-40's `smoke.test.tsx` is untouched.

No upstream is called from `apps/web/src`; the structural-gates CI job that greps for `COCKPIT_BASE_URL`, `SMART_FILES_BASE_URL`, `sec.gov`, `edgar`, and `cmegroup.com` passed.

**Nothing was deployed.** No `vercel`, no `vercel link`, no `gcloud`, no docker, no build-and-push. The Vercel project `smart-markets-app` still has nothing deployed.

**`main` was not pushed to.** Only `tw21/human-surface` was pushed.

**PR #3 was not touched.** Confirmed still `OPEN` on `tw19/union-layer-deploy`.

No sub-agents were spawned. No non-exiting command was run: the surface was inspected by rendering `InstrumentView` to static HTML inside a throwaway vitest run, which was deleted afterwards, rather than by starting a dev server.

## Things a reviewer should look at

The merge commit rather than a rebase, because `git rebase` was permission-blocked. If the planner wants a linear history, the branch needs re-basing by hand before merge.

The decision to derive the rail's "not served" group from the response plus `SERVED_LAYERS_V0_1` instead of calling `GET /v0.1/contract`. It means `market.computed` never appears in the rail. Calling the endpoint would be the fuller answer and would close item 3 above; it was left out to avoid a second network dependency and a second failure mode for a rail group.

The synthetic-fixture badge, which the reference draws and this surface does not. If Smart Markets ever demos on fixture data through this surface, the absence of that badge is the gap that matters most, and it needs a contract field rather than a client-side guess.

## Nothing is incomplete

Every designed state in the spec is either implemented or explicitly named above as unrenderable at contract 0.1.0 with the reason. Nothing was approximated and nothing was silently dropped.
