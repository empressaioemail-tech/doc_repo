---
id: 2026-08-18_TW-53_market_layer_close
title: TW-53 close — Smart Markets market layer wired, six branches with six verdicts
status: closed
date: 2026-08-18
agent: claude-code-lane-worker
repo: smart-markets
kind: close
plan_row: TW-53
applies_to: smart-markets
owner: nick
related: [_rd_disclosure_twin/08_build_scope, _rd_disclosure_twin/09_twin_read_contract]
---

# TW-53 close: the market layer

## Identity

Branch `tw53/market-layer`, from `origin/main` at `695a30a`, worked in the
isolated worktree `P:/smart-markets-worktrees/tw53-market`.

Commit `06c5725`, PR **#17**, https://github.com/empressaioemail-tech/smart-markets/pull/17.

NOT MERGED and NOT DEPLOYED, per the dispatch. CI run 32180520759 completed
with `conclusion=success` on both jobs.

## Files changed

```
 README.md                                     |    2 +-
 apps/api/src/upstreams/cockpit-market.ts      | 1086 +++++++++++++++++++++++++
 apps/api/src/upstreams/cockpit.ts             |   53 +-
 apps/api/tests/cockpit-market-captures.ts     |  173 ++++
 apps/api/tests/display-name-and-basis.test.ts |    9 +-
 apps/api/tests/fakes.ts                       |    7 +
 apps/api/tests/market-layer.test.ts           |  554 +++++++++++++
 apps/api/tests/security-master.test.ts        |   10 +-
 8 files changed, 1874 insertions(+), 20 deletions(-)
```

`packages/contract/**` was NOT touched. The implementation lives entirely in
the new module `apps/api/src/upstreams/cockpit-market.ts`.

The edit to `cockpit.ts` is four things and no more: the delegating call in
`market()`, an optional third constructor parameter carrying the market client,
and two strings the change made false (the class doc that said market was not
wired, and the health detail that said market quotes were not implemented).
Leaving a knowingly false health string on a service was judged worse than the
merge risk with the parallel agent. The three test files changed are
construction sites that now pass an explicitly unconfigured market client, so a
machine with `COCKPIT_BASE_URL` exported cannot turn a unit test into a live
call. That mirrors what `unconfiguredCockpit` already did for the security
master.

## What the cockpit actually serves, verified live before any code was written

Every row was called against `https://api.empressa.pro` on 2026-08-18. Three of
these findings changed the design, and one contradicts the dispatch.

| Route | Auth dependency | Observed |
| --- | --- | --- |
| `GET /market/quote/{symbol}` | optional user | 200, a last, and NO observation timestamp on any symbol kind |
| `GET /market/history/{symbol}` | optional user | 200, unix second OHLCV bars; `[]` for an unknown symbol, never a 404 |
| `GET /market/search?q=` | optional user | 200, and the only cockpit route that serves a currency |
| `GET /market/depth/{symbol}` | optional user | 200, `available:false`, empty ladders |
| `GET /market/tape/{symbol}` | optional user | 200, `available:false`, no prints |
| `GET /market/volume-profile/{symbol}` | optional user | 200, `available:false`, no levels |
| `GET /options/expirations/{symbol}` | required user session | 401 `{"detail":"Missing bearer token"}` |
| `POST /options/chain` | required user session | 401 `{"detail":"Missing bearer token"}` |
| `GET /market/iv-history/{symbol}` | required user session | 401 (not used by this layer) |

**The dispatch was wrong about tape and volume profile.** It said they "almost
certainly have no route". They do: `app/routers/microstructure.py` serves
`/market/depth`, `/market/tape` and `/market/volume-profile`, all three are
mounted at `app/main.py:129`, all three are anonymous reachable, and all three
answer. That is the whole difference between `absent-verified` and
`lookup-failed`, so the assumption was worth checking rather than adopting.

**The service credential does not help on the options routes.** The union holds
`x-empressa-service-key`. The cockpit's `get_current_user_id` never reads that
header (`app/auth.py`); only `get_service_caller` / `get_user_or_service_caller`
do, and the options routes use neither. Verified by live probe, not only by
source read.

## Branch by branch: what is populated, what is a typed absence, on what basis

Run against the live cockpit at close, through the real module:

```
MarketLayerSchema.safeParse -> true
layer.status -> partial

[price] status=partial verdict=absent-verified
  basis: the cockpit quote route served a last of 310.03 for "AAPL" and no observation timestamp with it; a price is not stated as of a time the upstream did not give, so the value above is the 1d bar close, which carries its own session timestamp

[history] status=populated

[chain] status=absent verdict=lookup-failed
  basis: the cockpit refused GET /options/expirations/AAPL with HTTP 401; nothing was established about this instrument either way. The cockpit options routes resolve their caller through a required user session and this process holds none, so the expiry list could not be read and no chain was requested

[depth] status=absent verdict=absent-verified
  basis: the cockpit depth route answered HTTP 200 for "AAPL" with available: false and no bid or ask levels; that is the route's own empty shape, so no book was served and none was withheld

[tape] status=absent verdict=absent-verified
  basis: the cockpit tape route answered HTTP 200 for "AAPL" with available: false and no prints; that is the route's own empty shape, so no prints were served and none were withheld

[volumeProfile] status=absent verdict=absent-verified
  basis: the cockpit volume-profile route answered HTTP 200 for "AAPL" with available: false and no profile levels; that is the route's own empty shape, so no profile was served and none was withheld

price -> last=305.59 USD asOf=2026-08-17T00:00:00.000Z venue=NASDAQ retrievedAt=2026-08-18T20:06:17.096Z
history -> 250 bars, last close 305.59
```

### price is PARTIAL, and that is the hardest call in the change

`PriceBlockSchema` requires `asOf`. The quote route serves a last with no time
attached, on every symbol kind, verified three ways. Writing the fetch instant
into `asOf` would state that a cached, delayed quote was current at a moment
nobody upstream claimed it was, which is the TW-48 defect class committed by the
one surface whose entire claim is not doing that.

So the value is the most recent 1d bar close, which carries its own session
timestamp; `measurement` says exactly what the number is; and the block is
`partial` carrying a determination that relays what the quote route served and
what it did not. A consumer therefore learns that a live last exists upstream,
what it was, and why it is not the number above. It never says the cockpit has
no live price, because it plainly has one.

Consequence worth stating plainly: at this version `price` is never `populated`.
It is `partial` every time, and the block says why every time.

### currency, and why a futures contract gets no price

`/market/search` is the only cockpit route serving a currency. For `AAPL` it
returns ten rows in four currencies, `AAPL.L` in GBp, `AAPL.DE` in EUR and
`AAPL.MX` in MXN, so the match is exact symbol and nothing else. For `GC` it
returns ten rows, none of them `GC`, all of them USD. So a gold future gets
`price` absent with an `absent-verified` basis naming the missing row, rather
than being labelled in dollars borrowed from GCP Applied Technologies' listing
currency. `history` for the same node is still populated, so the layer is still
`partial` rather than absent.

### chain: no mapper was built, deliberately

Two blockers, read in order so the basis names the one actually in the way.

First, the 401. Second, and behind it, `POST /options/chain` returns per strike
quotes keyed by strike with a `call` and a `put` object per strike and NO
contract identifier on either side, while `OptionContractSchema` requires
`contractSymbol`. Composing an OCC symbol from symbol, expiry, right and strike
would mint an identifier the cockpit never served, which is the same defect class
as filing an ISIN under `cusip` because the names looked close.

So the branch calls `/options/expirations` only, and there is no `chain()` method
on the client interface at all, because a seam for a call whose response cannot
be expressed is an invitation to fill it in. When the 401 clears, the basis
changes on its own to name the `contractSymbol` gap instead of going quiet. A
test covers that second branch.

### depth, tape and volume profile

All three call their real route and relay the `available` flag verbatim. The
bases deliberately do NOT name the cause, even though the cause is known from
source (the live Databento MBP and trades feeds are not purchased): the response
did not say that, so neither does the layer. A test asserts the strings
"Databento", "subscription", "not purchased" and "feed is off" do not appear.

Populated mappers exist for all three and are exercised. `volumeProfile` carries
`Derivation` provenance with `{source, formula, inputs[], retrievedAt}` and no
`measurement`; a test asserts the absence of `measurement`, so the two provenance
classes cannot be mixed silently. Its `session` is stated as the request
parameter it is and named again in `inputs`, because the response carries no
session of its own. `poc` is served but has no contract field, so it is dropped
rather than smuggled.

Tape `side` is mapped from the cockpit's `agg` field only (`at_bid` to `bid`,
`at_ask` to `ask`). The cockpit also carries `side` as buy/sell, and reading a
buy as a print at the ask is an inference about aggression rather than a relay,
so a mid print omits the optional key instead of being flattened to "unknown".

### the layer header

Computed from the blocks rather than asserted beside them, so the producing half
and the contract's `superRefine` cannot disagree. It takes the weaker verdict:
one branch that could not be looked at makes a layer level `absent-verified`
false. When all six are unpopulated the contract's `absent` branch is strict and
carries no `quotes` key, which would silently discard six typed absences, so they
are folded into the layer basis verdict by verdict. A test asserts all six names
appear there.

## Fixtures

`apps/api/tests/cockpit-market-captures.ts` holds response bodies **verbatim**
from `https://api.empressa.pro`, byte for byte, nulls and all. Nothing was
reshaped to agree with the parser.

Where a populated shape could not be captured, the file says so. The depth, tape
and volume profile feeds are not purchased, so `available:false` is the only
thing those routes can serve and there is no populated body in existence to
capture. Those three constants are named `MODEL_SHAPED_`, are built from the
cockpit's own pydantic response models (`BookLevel`, `TimeSale`, `VolumeLevel` in
`app/marketdata/microstructure.py`), and carry a comment stating they have less
authority than a capture. They still run through the real route schemas and the
real transport.

Every test case is expressed as an HTTP status plus a body through an injected
`fetch`, so the real `HttpCockpitMarketClient`, the real zod schemas and the real
verdict mapping all execute. Nothing stubs the client.

## Raw verification output

### typecheck

```
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

### lint

```
> smart-markets@0.1.0 lint
> eslint .

LINT EXIT=0
```

### test

```
> @smart-markets/api@0.1.0 test
> node --import tsx --test tests/*.test.ts

ℹ tests 137
ℹ suites 0
ℹ pass 137
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
```

Root `npm test` (contract plus api):

```
ℹ tests 78
ℹ pass 78
ℹ fail 0
ℹ tests 137
ℹ pass 137
ℹ fail 0
```

UI and web, the two CI steps named separately from the root run:

```
 Test Files  1 passed (1)
      Tests  9 passed (9)

 Test Files  2 passed (2)
      Tests  21 passed (21)
```

The 25 new market layer tests, by name:

```
✔ the live AAPL captures produce six branches with three different verdicts
✔ every quote block is present as a key, populated or not
✔ the price is stated as of the bar's own session timestamp, never the moment of retrieval
✔ the live quote's last is relayed in the basis and is never served as the price
✔ the currency is the exact symbol's row, not the nearest one
✔ a futures contract with no search row gets no currency and no price
✔ a quote route that answers 200 with a null last says so, and the price still stands
✔ a quote route that fails is lookup-failed inside the price block, not absent-verified
✔ history relays the served bars, in the served order, with unix seconds converted
✔ an empty bar array is absent-verified; a 502 on the same route is lookup-failed
✔ a history body the schema cannot read is lookup-failed naming the field
✔ a 401 on the options route is lookup-failed naming the status, never absent-verified
✔ even a served expiry list leaves the chain lookup-failed, and says which blocker
✔ available:false relays the flag and invents no cause for it
✔ a 500 on a microstructure route is lookup-failed, never the same answer as empty
✔ a populated book maps both ladders and is stated as of the served ts
✔ a book with levels but no ts is lookup-failed, never stated as of a repaired time
✔ a print's side comes from agg alone; a buy at the mid is not read as a lift
✔ the volume profile is a Derivation, and states a formula and its inputs
✔ an absent volume profile still declares Derivation, not the layer's class
✔ a layer with nothing behind it is absent, and carries all six bases
✔ the layer claims populated only when all six branches hold something
✔ a node carrying no ticker or contract code calls nothing at all
✔ an unconfigured base URL names the variable and reaches for no network
✔ no market call carries a caller credential, and the header set is exactly one header
✔ every route the layer calls is a read the cockpit serves anonymously
```

### build

```
> @smart-markets/api@0.1.0 build
> tsc -p tsconfig.json

> @smart-markets/web@0.1.0 build
> tsc --noEmit -p tsconfig.json && vite build

vite v5.4.21 building for production...
✓ 67 modules transformed.
dist/assets/index-yeWUL75E.js   242.05 kB │ gzip: 68.65 kB
✓ built in 630ms
```

### the six structural CI gates, run locally

```
web-no-upstream-calls OK
api-no-database OK
no-v0.2-stubs OK
api-mints-no-caller-credential OK
cockpit-credential-confined OK
api-calls-no-minting-route OK
```

### CI on the PR

```
status=completed conclusion=success
```

### guard proven by removal, twice

Guard 1, the price timestamp. Changed `asOf` to take `retrievedAt`:

```
✖ the price is stated as of the bar's own session timestamp, never the moment of retrieval
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
    actual: '2026-08-18T20:03:04.830Z',
    expected: '2026-08-17T00:00:00.000Z'
ℹ tests 137
ℹ pass 136
ℹ fail 1
```

Restored, `pass 137 fail 0`.

Guard 2, the verdict mapping for a refused call. Deleted the `401/403 -> refused`
branch in the transport so a 401 falls through to `unexpected-status`:

```
✖ a 401 on the options route is lookup-failed naming the status, never absent-verified
  AssertionError: the cockpit answered an unexpected HTTP 401 for GET /options/expirations/AAPL; the expiry list could not be read, so no chain was requested
ℹ tests 137
ℹ pass 136
ℹ fail 1
```

The basis loses the sentence naming the user session gate, which is the whole
informational content of that verdict. Restored, `pass 137 fail 0`.

## What I could not do, and what I chose not to do

1. **`price` can never be `populated` at this version.** The cockpit serves no
   observation timestamp on any quote route. The honest fix is upstream: expose
   the FMP `timestamp` field that `_row_to_quote` in `app/providers/fmp.py`
   currently drops, or add one to the futures branch of `resolve_quote`. One line
   upstream turns `price` from permanently `partial` into `populated` with the
   live last. **This is the single highest value follow up in this thread.**

2. **`chain` cannot be populated even with a credential.** Two upstream changes
   are needed and neither is in this lane: a service caller path on
   `/options/expirations` and `/options/chain` (they currently use
   `get_current_user_id`, not `get_user_or_service_caller`), AND a contract
   identifier on each chain row. Without the second, the branch stays
   `lookup-failed` no matter what credential arrives.

3. **The populated paths for depth, tape and volume profile are not fixture
   verified**, because no populated response exists to capture until the
   Databento MBP and trades subscriptions are bought. They are model shaped and
   labelled as such. When the feed lights up, the first thing to do is capture a
   real body and replace those three constants.

4. **I did not build a `crypto` depth path.** `/market/crypto/depth/{symbol}`
   exists and is anonymous, but `TWIN_SHAPE_BY_ASSET_CLASS` in `cockpit.ts` maps
   only equity, etf and future, so no crypto node can be produced at v0.1 and the
   path would be unreachable dead code. Noted rather than built.

5. **`/market/iv-history` is unused.** It is user gated (401), and the contract
   has no branch for an IV series at v0.1. Named here so nobody re-derives it.

6. **One UI string is now slightly off and I left it alone.**
   `packages/ui/src/QuoteBlocks.tsx` captions the price `asOf` field with "stated
   by the venue". The timestamp now comes from the cockpit's bar store rather
   than a venue quote. It is defensible but it is not exact, and the file is
   outside my lane with a parallel agent possibly in it. Flagging rather than
   editing.

7. **`format:check` cannot be trusted locally in this worktree.** `core.autocrlf`
   is true, so prettier flags 103 files on their line endings alone, including
   files untouched by this change such as `vercel.json`. Verified two ways that
   this is environmental: none of the eight files in this PR appears in that
   list, every staged blob has zero carriage returns, and CI's `format:check` on
   its LF checkout passed.

8. **No deploy, no merge, no push to main.** No `gcloud`, `vercel` or `docker`
   was run. The only network calls made were anonymous GET reads against the
   cockpit's public market routes to capture fixtures and to run the end to end
   probe above.

## One operational note for the planner

The chain branch fires one `GET /options/expirations` per twin read, and that
call will 401 every time until the upstream changes. That produces a steady
stream of 401s in the cockpit's logs from the union. It is one call per read at
v0.1 volume and the observed basis is worth it, but if the cockpit alerts on auth
failures, this is where they will come from.
