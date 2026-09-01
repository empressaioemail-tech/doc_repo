---
title: TW-66 close — served market data names its producing vendor
date: 2026-08-19
row: TW-66
program: Smart Markets (unregistered R&D, CANON_OVERRIDE, no PLAN-ROW by design)
repo: P:/Empressa Trading
status: PR open, NOT merged
last_updated: 2026-08-19
---

# TW-66 close — the quote source marker

## What shipped

Branch `tw66/quote-source`, commit `1317f796`, cut from `origin/main` at
`2bffb805`. **PR #349** — https://github.com/empressaioemail-tech/empressa-trading/pull/349
— OPEN, NOT MERGED.

Note on the base: the dispatch named `origin/main` as `23538119` (the TW-63
merge). By the time the worktree was cut, `origin/main` had advanced one commit
to `2bffb805`, a docs-only commit on top of it. `2bffb805` is a descendant of
`23538119` and contains all of TW-63, so the branch was cut from current
`origin/main` rather than from the older SHA.

## The exposure, restated from source

`app/marketdata/fallback_client.py` wraps the configured primary vendor and falls
through to `app/marketdata/yahoo_options.py` for three things: the underlying
price, the expiry list, and the chain. Yahoo is not a licensed feed in this repo.
There is no account, no credential and no agreement; the module fetches
`query2.finance.yahoo.com/v7/finance/options` with a spoofed browser User-Agent
and a scraped `crumb` token.

The fallback is not an edge case. Established FROM CODE, not from a live call
(the dispatch forbade touching the vendor, and nothing here did):
`MarketDataAppClient.get_expirations` and `get_chain` return `[]` on HTTP 429
while logging "rate-limited", on a body of `{"s": "no_data"}`, and on any
transport error (`_get` swallows `httpx.HTTPError` and returns `None`). Empty
from the primary is the trigger condition for the Yahoo path. `yahoo_options.py`
states the same thing in its own module docstring: "MarketData.app enforces a
daily credit cap; when it returns empty (429/no_data), this module supplies
expirations and per-strike quotes."

TW-63 moved `GET /options/expirations/{symbol}` and `POST /options/chain` onto
the service gate. The Smart Markets human door is anonymous. Nothing is exposed
today only because the union has no chain adapter yet. This row closed the window
before one was wired.

## The design, and the call that was made

Every affected response now carries a `provenance` block naming the vendor that
actually produced the content on THAT call.

The marker is four fields, not one:

    source           the vendor that produced the value
    redistribution   whether a redistribution right is HELD for that vendor
    redistributable  the same fact as one boolean
    basis            what the posture rests on, so the claim can be checked

**Why both a source name and a posture field, rather than a documented mapping
from the source name alone.** A consumer that had only the name would have to
carry our licensing table and keep it in sync across a repo boundary. The whole
reason this row exists is that a consumer could not decide redistribution from
the payload; handing it a name and telling it to look the name up in our docs
reproduces the defect one layer out. `redistributable` is the decision reduced to
a single boolean so no vocabulary table is needed at all, and `basis` carries the
substantiation so the claim is checkable rather than trusted.

**Why the posture is a statement about US, not about the vendor.** "We hold no
redistribution right for Yahoo" is substantiable from this repo's own code. "Yahoo
prohibits redistribution" is a reading of a contract nobody here holds, and
asserting it would be inventing a licence claim in the opposite direction from
the one the dispatch warned about. Hence three values, never two:

    permitted         a right is held, or the content is ours and no vendor
                      is involved at all
    not-permitted     no right is held; do not relay onward
    not-established   whether a right is held has NOT been established here

`not-established` is the honest answer for the paid vendors. A subscription is not
a redistribution licence, and nothing in this repo records the terms either way.
Guessing permissive because a bill is paid is precisely the error the dispatch
named. `redistributable` is `True` for `permitted` alone, so both flavours of "no"
fail safe, and a source with no registry row degrades to `not-established` naming
itself rather than reading as permissive or silently vanishing.

**Why provenance is per FIELD on the chain, not per response.** `underlying` and
`strikes` are independent upstream calls that routinely resolve to DIFFERENT
vendors on the same request: the spot can come from the primary, from the Yahoo
fallback, or from FMP's quote inside the route, while the chain independently
comes from the primary or from Yahoo. One marker on the response would be wrong
about one of the two fields whenever they disagree. There is a test that drives
exactly that split.

**Where the knowledge lives.** `FallbackMarketDataClient` already knew which path
answered, so it now reports it: each fallback method has a `*_sourced` twin
returning the value together with the producing client's id. Each concrete client
declares a `SOURCE_ID` class attribute. `FallbackMarketDataClient` deliberately
declares `SOURCE_ID = None` — its producer is a per-call fact and a fixed id there
would be a lie half the time. Nothing anywhere reads a source off the data.

## Response shapes touched

**`GET /options/expirations/{symbol:path}` — BREAKING SHAPE CHANGE.**

Was a bare `list[str]`. A list cannot carry its own producer, so it is now:

    {
      "symbol": "AAPL",
      "expirations": ["20261218", "20270116"],
      "provenance": {"expirations": {source, redistribution, redistributable, basis}}
    }

Changed now rather than later on purpose: the union has no adapter yet, so today
there is no external consumer to break, and every day it waits is a day the wrong
shape is harder to move. Two in-repo frontend call sites were updated
(`ExpectedMoveTile.tsx`, `OptionsEdgeTile.tsx`), plus a shared type module
`apps/cockpit/frontend/src/marketProvenance.ts`.

**`POST /options/chain` — ADDITIVE.**

Gains a `provenance` object keyed by the payload field it describes:

    "provenance": {
      "underlying": {source, redistribution, redistributable, basis},
      "strikes":    {source, redistribution, redistributable, basis}
    }

Existing keys are untouched, so nothing that reads `strikes` breaks.

**Typed absence.** A payload no vendor produced carries an all-`None` marker with
the KEYS STILL PRESENT — "nothing produced this" stays distinguishable from "this
build does not report a producer". Same discipline `_with_as_of` applies to
observation time and `contract_symbol` to the contract identifier.

## Files

New:

    apps/cockpit/backend/app/marketdata/provenance.py
    apps/cockpit/backend/tests/test_tw66_quote_source_marker.py
    apps/cockpit/frontend/src/marketProvenance.ts

Modified:

    apps/cockpit/backend/app/marketdata/fallback_client.py      (*_sourced twins)
    apps/cockpit/backend/app/marketdata/marketdataapp_client.py (SOURCE_ID)
    apps/cockpit/backend/app/marketdata/polygon_client.py       (SOURCE_ID)
    apps/cockpit/backend/app/marketdata/fake_client.py          (SOURCE_ID)
    apps/cockpit/backend/app/routers/market.py                  (both routes)
    apps/cockpit/backend/tests/test_market.py                   (new expirations shape)
    apps/cockpit/backend/tests/test_tw63_options_regate.py      (new expirations shape)
    apps/cockpit/frontend/src/focus/tiles/ExpectedMoveTile.tsx
    apps/cockpit/frontend/src/focus/tiles/OptionsEdgeTile.tsx

No route's auth gate moved. TW-63's app-wide served-path tripwire
(`test_the_served_gate_reaches_exactly_the_declared_paths`) and its full market
router gate map both pass unchanged.

## THE INVENTORY — every market-data path a service caller can reach

The set is authoritative: it is the twelve paths TW-63's own hand-declared
tripwire pins as carrying `get_user_or_service_caller`.

| Path | Producer(s) | Fallback | Names its producer? |
|---|---|---|---|
| `GET /options/expirations/{symbol:path}` | marketdata.app or polygon.io per config; databento GLBX for FOP roots (`/ES`, `/CL`) | YES, silent, to scraped Yahoo | YES — TW-66 |
| `POST /options/chain` | `underlying`: primary, then Yahoo, then FMP in-route. `strikes`: primary, then Yahoo. FOP: databento GLBX for both | YES, TWO independent ones | YES — TW-66, per field |
| `GET /econ/board` | FRED (`api.stlouisfed.org`) | none; fails closed with `available=false` + reason | Partially — each card carries `"source": "FRED · <series_id>"`. No redistribution posture. |
| `GET /econ/indicator/{indicator_id}/history` | FRED, plus NBER recession spans | none | Same as above |
| `GET /fundamentals/{symbol:path}` | FMP | none; futures return a typed absence | NO |
| `GET /fundamentals/{symbol:path}/panel` | FMP, falling back to Finnhub when FMP is unavailable (quota 429 / paywall 402 / unknown ticker) | YES, silent, to Finnhub | Partially — `sources` swaps from `["Financial Modeling Prep"]` to `["Finnhub"]` per call. No redistribution posture. |
| `GET /futures/drivers/{symbol:path}` | committed JSON only (`futures_catalog.json`, `series_verification.json`) | n/a | n/a — MAPPING ONLY. Serves no observations; `last_observation` is a typed absence on every row, and each row already names its authority, class, endpoint and access. |
| `GET /securities/lookup` | own DB (resolver) | n/a | n/a — identity/reference, no vendor quote values |
| `GET /securities/canonical/{node_id}` | own DB | n/a | n/a |
| `GET /securities/current-symbol/{node_id}` | own DB | n/a | n/a |
| `GET /securities/node/{node_id}` | own DB | n/a | n/a |
| `GET /spine/atom/{atom_id}` | atom store | n/a | YES, and best-in-repo — every serve passes `gate_atom_for_serving_async`, and `_license_note` emits `source=<x>; no redistribute` off the atom's own `License`. |

### What is known about each producer's redistribution terms

| Producer | Posture | Substantiation |
|---|---|---|
| Yahoo Finance | **not-permitted** | No account, credential or agreement exists. `yahoo_options.py` scrapes `query2.finance.yahoo.com` with a browser User-Agent and a crumb token. No right is held. |
| marketdata.app | **not-established** | Paid token (`COCKPIT_MARKETDATA_APP_TOKEN`). No terms recorded anywhere in the repo. |
| polygon.io | **not-established** | Paid key (`COCKPIT_POLYGON_API_KEY`). No terms recorded. |
| Databento GLBX (CME) | **not-permitted** | No CME redistribution licence is held. `docs/GTM_POSITIONING_AUDIT_ANSWERS_2026-07-19.md` records it as unpurchased (~$3,050/mo per exchange plus per-user fees, 21-30 day approval), and `opra_client.py` carries the same standing warning for the options tape. |
| FMP | **not-established** | Paid key. No terms recorded. |
| Finnhub | **not-established** | Key-based. No terms recorded. NOT marked — see open exposures. |
| FRED / NBER | **not-established** | US federal publishers, but FRED relicenses some third-party series and this repo records no terms. Deliberately not called public domain. |

## OPEN EXPOSURES — named, not closed

These are outside the row's scope but must not be left implicit.

1. **`GET /options/flow/{symbol}` is a STRICTLY LARGER exposure and is
   unmarked.** Its gate is `get_optional_user_id`, which returns `None` rather
   than 401ing, and there is no global auth middleware (verified in
   `app/main.py`) — so it is reachable with NO credential at all, by anyone.
   `app/providers/options_flow.py` calls `get_expirations`,
   `get_underlying_price` and `get_chain`, i.e. the exact Yahoo-fallback triple.
   Stated fairly: the route serves only GEX AGGREGATES (net gex, zero-gamma flip,
   call/put gamma totals, top strikes, profile) — no raw bid/ask leaves it — so
   this is derived rather than raw. It is still values derived from a possibly
   unlicensed source, served with no credential, and the repo's own licensing
   engine has a `derived_ok` flag precisely because derivation is not a laundering
   step.

   The sharper edge on the same route: it also serves `prints`, the OPRA
   options-TRADE tape from `opra_client.fetch_option_prints`, which is raw
   exchange data (price, size, aggressor side, timestamp). It is `[]` by default
   because `opra_enabled` is False, and the delayed-historical path is the only
   one wired. But the day that flag is flipped, raw OPRA prints go out an
   ANONYMOUS route, and `config.py` and `opra_client.py` both already carry a
   standing fee/licensing warning about exactly that. Flipping `opra_enabled`
   should be gated on marking and on a gate review, not treated as a config
   toggle. This deserves its own row and probably outranks the one just closed.

2. **`POST /vol/surface`** (`get_current_user_id`) uses all three fallback
   methods. Unmarked.

3. **`GET /intelligence/expected-move`** (`get_current_user_id`) —
   `app/providers/expected_move.py` uses `get_underlying_price` and `get_chain`.
   Unmarked.

4. **`app/routers/compat.py`** — `/positions`, `/portfolio/greeks`, `/risk/var`,
   `/risk/payoff`, `/account` (all `get_current_user`) call
   `market_data.get_underlying_price`. Unmarked.

5. **PERSISTENCE, not just serving.** `app/jobs/iv_snapshot.py` calls
   `get_expirations`, so stored `iv_snapshots` rows can derive from Yahoo, and
   `GET /market/iv-history` serves them later with no record of which vendor the
   IV came from. `app/paper/engine.py` prices fills off `md.get_chain`. Storing
   unlicensed-derived values is a separate question from serving them and is
   currently unaddressed.

6. **`/fundamentals/*/panel` FMP→Finnhub swap** already names the producer in
   `sources` but carries no redistribution posture, so a consumer can see WHO but
   not WHETHER. The cheapest follow-on: reuse `marker_for` there.

7. **`/econ/*`** names FRED per card, same gap: source without posture.

8. The wider question this row does not settle: `app/governance/licensing.py`
   already has a full `License` / `enforce_license` intersection engine, and the
   spine serve path uses it. The market-data path now has a parallel, lighter
   vocabulary. They should probably converge, with `provenance.py` becoming the
   vendor-posture registry that feeds `License` objects. Left as a design note,
   not attempted here.

## Tests

New module `tests/test_tw66_quote_source_marker.py`, 15 tests:

- primary-sourced vs fallback-sourced CHAIN distinguishable by payload alone
- primary-sourced vs fallback-sourced EXPIRATIONS distinguishable by payload alone
- the marker names the path TAKEN, not the configured preference
- a consumer can decide redistribution from the payload alone
- a paid vendor is `not-established`, never guessed permissive
- `redistributable` is true for `permitted` alone
- an unregistered source degrades to `not-established` naming itself
- the marker cannot state an incoherent posture (validator)
- a payload nobody produced carries an absent marker with the keys present
- no vendor configured still reports the absence
- the chain marks `underlying` and `strikes` separately
- the route-level FMP spot fallback is marked as FMP
- the fallback wrapper declares no fixed source
- every concrete client declares a registered source
- a client without `*_sourced` methods is still marked

The headline test is deliberately built so **the two vendors return byte-identical
data**. Nothing about the values can separate them; only the marker does. That is
the difference between plumbing the source and inferring it, made structural.

### Removal proof

The guard was proved by REMOVAL. `FallbackMarketDataClient` was edited so the
Yahoo branches reported `self.primary_source_id` instead of
`SOURCE_YAHOO_FINANCE` — i.e. exactly the defect this row closes, a marker
derived from configuration rather than from the path taken. Raw result:

    FAILED tests/test_tw66_quote_source_marker.py::test_primary_and_fallback_chains_are_distinguishable_by_payload_alone
    FAILED tests/test_tw66_quote_source_marker.py::test_primary_and_fallback_expirations_are_distinguishable_by_payload_alone
    FAILED tests/test_tw66_quote_source_marker.py::test_the_marker_names_the_path_taken_not_the_configured_preference
    FAILED tests/test_tw66_quote_source_marker.py::test_a_consumer_can_decide_redistribution_from_the_payload_alone
    4 failed, 11 passed in 1.85s

with the load-bearing assertion being the real-world harm:

    >       assert marker["redistribution"] == prov.REDIST_NOT_PERMITTED
    E       AssertionError: assert 'not-established' == 'not-permitted'
    E         - not-permitted
    E         + not-established

Scraped Yahoo content wearing the paid vendor's posture. The marker was restored
and the module returned to 15 passed.

## Raw test output

### Backend, PRE-CHANGE baseline (pristine `origin/main` @ `2bffb805`, separate worktree)

    cd apps/cockpit/backend && python -m pytest -q

    4841 passed, 2 skipped, 21 deselected, 39005 warnings in 716.52s (0:11:56)

    [exited with code 0]

### Backend, POST-CHANGE (`tw66/quote-source`)

    cd apps/cockpit/backend && python -m pytest -q

    4856 passed, 2 skipped, 21 deselected, 38946 warnings in 676.44s (0:11:16)

    [exited with code 0]

**Delta: +15 passed, 0 failed. Exactly the 15 tests in
`tests/test_tw66_quote_source_marker.py`.** The three edits to existing test
files changed assertions inside tests that already existed, so they move no
counts.

### Frontend build (CI: `npm run build`)

    ✓ built in 18.88s

### Frontend tests (CI: `npm test`)

     Test Files  39 passed (39)
          Tests  448 passed (448)
       Duration  1.55s

### GitHub Actions on PR #349 (`1317f796`) — conclusion strings, not exit codes

    Frontend build (cockpit web)         SUCCESS   pass    1m1s
    Python tests (cockpit backend)       SUCCESS   pass    6m5s
    Frontend tests (cockpit vitest)      SUCCESS   pass    29s
    Gitleaks security scan               SUCCESS   pass    8s
    Windows .exe (release tags only)     SKIPPED   skipping

CI is green on every gating check. `mergeable: MERGEABLE`, `state: OPEN`.
**NOT MERGED** — the dispatch withheld merge authority.

## Hard rules — compliance

- **NOT DEPLOYED.** No docker, gcloud, ssh, scp, or deploy script was run. The
  paper-trading soak and its A/B arms were not touched.
- **marketdata.app was NOT called.** Its credit-cap behaviour was established
  from `app/marketdata/marketdataapp_client.py` (429 → log + `[]`,
  `{"s":"no_data"}` → `[]`, transport error → `None` → `[]`) and from
  `yahoo_options.py`'s own module docstring. No live request was made, so the
  daily cap is untouched.
- **No auth gate moved.** TW-63's gate settlement stands; its two tripwires pass
  unchanged.
- **Not pushed to main, not merged.** Branch + PR only.
- **No non-exiting commands.**
- All work was done in an isolated worktree at
  `P:/empressa-trading-worktrees/tw66-source`. `P:/Empressa Trading` was never
  `git checkout`-ed. A second read-only worktree
  (`P:/empressa-trading-worktrees/tw66-baseline`) was created for the baseline
  run and has been removed. The working worktree remains at
  `P:/empressa-trading-worktrees/tw66-source`.

## What I could not do

- **Establish the actual contractual terms of any vendor.** Nothing in this repo
  records them, and the dispatch forbade guessing. Every paid vendor is therefore
  `not-established`, which is a true statement about our knowledge and a
  deliberately unsatisfying one. Someone has to read the marketdata.app, Polygon,
  FMP and Finnhub agreements and promote those rows. Until then a consumer
  correctly refuses to relay ANY market-data content this backend serves, which
  is the safe answer but also a business constraint worth naming out loud.
- **Close the anonymous `/options/flow` exposure**, which is larger than the one
  this row closed. Named above as open exposure 1.
- **Reconcile `provenance.py` with `app/governance/licensing.py`.** Two
  vocabularies for one concept now exist. Named above as open exposure 8.

## PR

**#349** — https://github.com/empressaioemail-tech/empressa-trading/pull/349

Branch `tw66/quote-source` @ `1317f796`, base `main`. **Open, not merged.**
Merge standard is zero CI failures. CI is green on every gating check
(conclusion string `SUCCESS` on all four; the Windows .exe job is `SKIPPED` by
its release-tag condition). `mergeable: MERGEABLE`. Merge authority was withheld
by the dispatch, so it sits open awaiting the planner.
