---
title: TW-55 drivers layer close
date: 2026-08-18
status: active
type: close-artifact
program: smart-markets (unregistered R&D, TW row TW-55)
repo: empressaioemail-tech/smart-markets
last_updated: 2026-08-18
---

# TW-55 drivers layer close

Branch `tw55/drivers-layer`, commit `b0fcfef`, PR
https://github.com/empressaioemail-tech/smart-markets/pull/18 (OPEN, not merged).
Worktree `P:/smart-markets-worktrees/tw55-drivers` off `origin/main` at `a9276fd`.

## Verdict

NOT BUILDABLE. The drivers layer ships as a typed absence with verdict
`lookup-failed`, and the basis names the missing upstream. No series were
populated, no proxies were populated, and none were synthesised.

## The upstream survey

Step one was the survey and it was run before any adapter code was written.

The cockpit's routes were enumerated two ways rather than assumed. The deployed
service at `https://api.empressa.pro/openapi.json`, fetched 2026-08-18, serves
284 paths. The checkout at `P:/Empressa Trading/apps/cockpit/backend` carries
306 route decorators across `app/routers/`, `app/securities/router.py`,
`app/billing/resolver.py` and `app/main.py`. Neither list contains a route that
resolves an instrument to its driver series.

The mapping does exist. The cockpit curates it at
`app/data/futures_catalog.json`, version 2, with 33 driver rows over 11 futures
roots, each row carrying instrument, role, source, series identifier, transform,
units, decimals, provenance and a blurb. It is resolved by
`app/providers/futures_reference.py`, whose `drivers(symbol)` returns a typed
verdict of exactly the shape this layer would relay. That function has one
caller in the entire repository, `resolve()` in the same file, whose only caller
is `tests/test_futures_reference.py`. No router imports the module. The mapping
is therefore reachable inside that process and nowhere else.

The dispatch carried a figure of 67 authority rows from TW-9. The file as it
stands today holds 8 authorities, 11 instruments, 33 drivers, 21 COT-only
markets, 9 EIA series, 2 treasury datasets, 2 datasets, 7 asset classes and 3
recorded absences, which is 96 rows across all sections. The 67 was not
reproduced and no claim is made about what it counted.

### The three routes that came closest, and why each was refused

`GET /econ/board` and `GET /econ/indicator/{id}/history` serve real FRED series
with the catalog metadata this layer wants, and they are reachable with the one
credential this process holds. Presenting `X-Empressa-Service-Key: not-a-real-key`
returns `{"detail":"Invalid service credential"}`, which proves a service path
exists on those routes. They are still not this layer's upstream because they
are one fixed macro board, identical for every node, with no instrument key.
What is missing there is the link, not the reach.

`GET /intelligence/adaptive-panel/{symbol}/metrics` is instrument-keyed and does
compute macro-driver sections, and it is refused twice over. It gates on
`get_current_user_id`, a user JWT only. The identical service-key header returns
`{"detail":"Missing bearer token"}`, so the header is not consulted at all and
the union cannot reach the route with what it holds. Separately, even reachable,
the route serves display metrics shaped `{label, value, delta, flag}` with a
bare source string such as `"FRED"`. There is no series identifier, no units,
no frequency, no transform, no release match and no observation date, so six of
the ten fields `DriverSeries` requires would have been authored here rather than
relayed.

`GET /market/rates` is anonymous, answers 200, and was the strongest temptation
in the survey. It serves `DFII10` at 2.44 as of 2026-08-17, which is the exact
FRED series the curated catalog names as gold's discount-rate driver. Ten of the
33 catalog driver rows have their series identifier somewhere in that body. It
was refused for three reasons that each stand alone. It is a fixed rates board
with no instrument key, so pairing a row to a node would be the union asserting
the mapping on its own authority. Its rows carry `{id, label, value, prior,
delta, date}` and nothing else, so units, frequency, transform, release match,
retrieval stamp and upstream reference would all have been invented. And it is
rates-only, carrying none of the 9 EIA inventory rows and none of the 6 Treasury
issuance rows, with 6 of the 18 FRED rows also absent from it, so 23 of the 33
catalog rows have no served source at all.

### Why the union does not simply read the catalog

The 33 rows sit in the cockpit's repository, not on a wire. The union fans out
over HTTP and holds nothing; `apps/api/src/config.ts` says so in a comment that
forbids a database URL in this process. Copying the rows here would fork a
curated dataset away from the authority that maintains it and would make the
union, rather than the cockpit, the thing asserting which series drives which
instrument. The fix is a published route on the cockpit.

## What was populated and what was left as a typed absence

Populated: nothing. Left as a typed absence: the whole layer, for all three node
shapes, with `status: "absent"` and verdict `lookup-failed`.

The verdict is deliberately not `absent-verified`. Nothing was looked up, and an
instrument with a full set of published drivers would produce this identical
response today. It is deliberately not `not-applicable` either, and there is no
shape branch at all: `TwinLayersSchema` requires `layers.drivers` on every shape
and `TwinSchema` carries no applicability refinement for it, so macro drivers do
not stop existing for an issuer the way a board stops existing for a futures
contract. The roster's contract-shape `not-applicable` is a habit that must not
travel here, and a test pins that.

The basis, verbatim as it ships on the wire:

> no upstream serves this layer: the trading cockpit exposes no route mapping an
> instrument to its driver series at this version, and the union layer never
> reads FRED, EIA, CFTC or Treasury directly, so nothing was looked up. What is
> missing is a published route on the cockpit and not an adapter in this
> process, which would have nothing to call. This is the absence of a lookup and
> not a finding about the instrument: an instrument with a full set of published
> drivers would produce this same response today

The third sentence is the one this row adds beyond TW-54. The roster's finding
was a source that does not exist; this one is a source that exists and is not
published. Those point at different work, and a reader who cannot tell them
apart either builds a dataset that already exists or waits on this repository
for an adapter with nothing to connect to.

The `authority` field is `"FRED, EIA, CFTC, and the US Treasury"` rather than a
single body. Which one answers for a given node is itself a fact the missing
mapping would supply, so naming one would assert a search against a body that
was never chosen.

## Files

Authored:

- `apps/api/src/upstreams/drivers.ts` — the survey, the basis, and
  `driversLayerFor(node)`.
- `apps/api/tests/cockpit-drivers-captures.ts` — verbatim captures.
- `apps/api/tests/drivers.test.ts` — nine tests.

Edited:

- `apps/api/src/upstreams/cockpit.ts` — the delegating call, plus two edits
  beyond it, both flagged below.

`packages/contract/**` was not touched and did not need to be. The
`DriversLayer` schema already carries everything this row needed, including the
strict `DriverSeriesSchema` that structurally refuses a proxy in the series
array.

## Fixtures

`apps/api/tests/cockpit-drivers-captures.ts` holds three verbatim response
bodies pulled from `https://api.empressa.pro` on 2026-08-18 with the exact
requests named in the file: the full 2408-byte `/market/rates` body, and the two
401 bodies obtained by presenting the same bogus service key to `/econ/board`
and to `/intelligence/adaptive-panel/GC/metrics`. Nothing was reformatted or
trimmed. The differing wording of those two 401s is load-bearing and is asserted
on directly, because it is the only thing that distinguishes "the credential was
rejected" from "this route has no service path", and a later reader who assumes
the panel is service-reachable would go hunting a payload problem that is not
the blocker.

The substitution guard takes the `DFII10` row out of the real `/market/rates`
capture and runs it through the real `DriverSeriesSchema`, which rejects it, and
then names each of the five required fields the served row does not carry. The
second half of that test is deliberately the uncomfortable one: it dresses the
row in seven authored fields and shows that it then validates. The schema is not
what stops the substitution. The refusal is. The schema only makes the
dishonesty explicit, and the test says so.

## Two edits beyond the delegating call, and why

The dispatch said to keep any `cockpit.ts` edit to the delegating call. Two
edits went past that line and both are reported rather than buried.

The first is the class doc comment, which said drivers "stays a typed absence
saying the adapter is not implemented, which is true of it". That is the exact
claim this row retracts, sitting three lines above the delegating call.

The second matters more because it goes out on the wire. `health()` returned
`detail: "security-master resolution and market quotes are wired; the driver
series is not implemented"`, and that detail rides out on
`twin.provenance.upstreams`. Left alone, every twin would have carried the
drivers absence saying the missing thing is a route and, four fields away, an
upstream report saying the adapter is unimplemented. A reader would have had no
way to tell which to believe. The clause now reads "the cockpit serves no
driver-series route for this layer to call", and a test asserts the cockpit
upstream report does not contain "not implemented".

## Verification, raw

```
$ npm run typecheck

> smart-markets@0.1.0 typecheck
> npm run typecheck --workspaces --if-present


> @smart-markets/contract@0.1.0 typecheck
> tsc --noEmit -p tsconfig.check.json


> @smart-markets/ui@0.1.0 typecheck
> tsc --noEmit -p tsconfig.check.json


> @smart-markets/api@0.1.0 typecheck
> tsc --noEmit -p tsconfig.check.json


> @smart-markets/web@0.1.0 typecheck
> tsc --noEmit -p tsconfig.json
```

```
$ npm run lint

> smart-markets@0.1.0 lint
> eslint .

(exit 0, no output)
```

```
$ npx prettier --check apps/api/src/upstreams/drivers.ts apps/api/src/upstreams/cockpit.ts apps/api/tests/drivers.test.ts apps/api/tests/cockpit-drivers-captures.ts
Checking formatting...
All matched files use Prettier code style!
```

Repo-wide `format:check` was not run: it reports roughly a hundred false
failures on this Windows checkout from CRLF, per the dispatch.

```
$ npm run test --workspace @smart-markets/api
...
✔ every node shape gets a lookup-failed drivers layer keyed to the node (3.9403ms)
✔ a drivers layer is NEVER absent-verified and NEVER not-applicable (0.3223ms)
✔ the drivers basis names the missing upstream and claims nothing about the instrument (0.2174ms)
✔ a served /market/rates row cannot be validated as a driver series (1.2974ms)
✔ the captured gate responses distinguish a rejected service key from no service path (0.1857ms)
✔ a proxy cannot be validated into the series array (0.7733ms)
✔ every shape's twin still parses, with drivers absent and the same basis (3.3427ms)
✔ the cockpit upstream report says unserved, not unimplemented (0.6322ms)
✔ the configured and unconfigured cockpit adapters give the identical drivers verdict (0.2773ms)
...
ℹ tests 154
ℹ suites 0
ℹ pass 154
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 822.3955
```

```
$ npm run build
> @smart-markets/ui@0.1.0 build
> tsc -p tsconfig.json && node scripts/copy-styles.mjs

> @smart-markets/api@0.1.0 build
> tsc -p tsconfig.json

> @smart-markets/web@0.1.0 build
> tsc --noEmit -p tsconfig.json && vite build

vite v5.4.21 building for production...
transforming...
✓ 67 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                    0.69 kB │ gzip:  0.43 kB
dist/assets/jetbrains-mono-latin-var-6fWv1k7M.woff2   31.43 kB
dist/assets/inter-tight-latin-var-DX-nOvPD.woff2      44.87 kB
dist/assets/index-UFJxlK1h.css                     18.08 kB │ gzip:  4.05 kB
dist/assets/index-yeWUL75E.js                     242.05 kB │ gzip: 68.65 kB │ map: 742.19 kB
✓ built in 624ms
```

### Guards proved by removal

Two, both restored and verified byte-identical afterwards.

Reverting `noServedSource()` to return `"upstream adapter not implemented"`:

```
✖ the drivers basis names the missing upstream and claims nothing about the instrument (1.848ms)
ℹ pass 153
ℹ fail 1
✖ failing tests:
✖ the drivers basis names the missing upstream and claims nothing about the instrument (1.848ms)
  AssertionError [ERR_ASSERTION]: basis must name the missing upstream
```

Flipping the verdict from `lookupFailed` to `absentVerified`:

```
✖ every node shape gets a lookup-failed drivers layer keyed to the node (5.8352ms)
✖ a drivers layer is NEVER absent-verified and NEVER not-applicable (0.4059ms)
✖ every shape's twin still parses, with drivers absent and the same basis (2.5568ms)
ℹ pass 151
ℹ fail 3
✖ failing tests:
✖ every node shape gets a lookup-failed drivers layer keyed to the node (5.8352ms)
  AssertionError [ERR_ASSERTION]: operating-company verdict
✖ a drivers layer is NEVER absent-verified and NEVER not-applicable (0.4059ms)
  AssertionError [ERR_ASSERTION]: operating-company drivers must not claim a verified absence
✖ every shape's twin still parses, with drivers absent and the same basis (2.5568ms)
  AssertionError [ERR_ASSERTION]: operating-company verdict
```

Restoration verified: `diff /tmp/drivers.ts.bak apps/api/src/upstreams/drivers.ts`
returned no differences, and the full suite returned to 154 pass / 0 fail.

## Not done, and what it blocks

No deploy. No push to main. No merge. PR #18 is open against main. CI on
`tw55/drivers-layer` completed with conclusion string `success`
(`gh run list --branch tw55/drivers-layer` returned
`completed success TW-55: the drivers layer says an unpublished route, not a
missing adapter`). The merge itself is the planner's call and was not taken.

The layer cannot be populated from this repository at all. The unblocking work
is entirely on the cockpit side and it is small: mount a router over
`app/providers/futures_reference.py`, whose `drivers(symbol)` already returns
the typed-verdict shape with source, series identifier, transform, units and
provenance per row. The one gap that would remain after publishing it is
`lastObservation` — the catalog rows carry the series pointer, not the value, so
the route would need to resolve each row against FRED, EIA or Treasury the way
`providers/eia.py` and `providers/treasury.py` already do. That is a scoping
note for whoever picks up the cockpit-side row, not a finding about this one.

One smaller thing surfaced and was left alone: the catalog's `transform` values
are `level`, `wow_diff` and `auction_record`, none of which are in the contract's
`SeriesTransformSchema` enum (`none | yoy | mom | qoq | pct-change | index |
log`). A mapping or a contract amendment will be needed when the route exists.
It was not resolved here because `packages/contract/**` is off limits to this
row and because the mapping should be settled against a real served payload
rather than against a JSON file read out of another repository.
