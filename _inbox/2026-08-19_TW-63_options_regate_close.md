# TW-63 close: options re-gate, and the contract identifier

Date: 2026-08-19  Status: PR OPEN, NOT MERGED, NOT DEPLOYED
Repo: empressa-trading  Branch: `tw63/options-regate`  PR: #347
Base: `origin/main` at `569adaca`  Commits: `e4f4d254`, `6e185a24`
Worktree: `P:/empressa-trading-worktrees/tw63-options` (own worktree; nothing checked out in `P:/Empressa Trading`)
Canon: TW-63 operator override, Smart Markets unregistered R&D, bounded PRs, no PLAN-ROW by design.

Both blockers were real. Both are closed. The planner owns review and deploy. Nothing was deployed,
nothing was merged, nothing was pushed to main.

## Blocker one: the gate

`GET /options/expirations/{symbol:path}` and `POST /options/chain` in
`apps/cockpit/backend/app/routers/market.py` depended on `get_current_user_id`, which is a Clerk user
session, so a service caller was 401'd. Both now depend on `get_user_or_service_caller`, which is the
same dependency `/securities/lookup` already carries. No third auth style was invented, no auth
helper was modified, and no other route's gate was touched.

The precedent was followed to the object, not to the description. `app/securities/router.py` names
the gate once as `SERVED = Depends(get_user_or_service_caller)` and `app/routers/futures_drivers.py`
does the same while stating in its own docstring that it follows `/securities/lookup`. The market
router now names it once as `SERVED_REFERENCE`, with the comment stating explicitly that it applies
to the two options routes and nowhere else in that module, so the constant cannot read as a router
default that a future route attaches to casually.

The reasoning is recorded in the module docstring rather than only in this artifact, because the next
person to read that file is the one who needs it: an option chain and its expiry list are exchange
reference data, the answer is identical for every caller, the payload carries no caller entitlement,
and that is the same class as a security lookup. The mechanism is a re-gate and deliberately not a
master credential. A service caller resolves to the synthetic `service:cockpit` principal, owns no
rows, and `require_operator` refuses it outright, so widening these two routes widens no authority.
That property is asserted by test, not by prose: the test observes the principal the gate actually
resolves for a real request and pins it to `service:cockpit`.

**Nothing else widened, and that is structural.** Two tests hand-declare the shape of the world and
fail if it changes. The first declares every path in the app whose dependency graph reaches
`get_user_or_service_caller`: ten routes that predate this row, plus exactly these two. The second
declares the entire market router's gate map, all twenty one routes, so a re-gate anywhere in that
module is loud rather than silent. A status-code assertion would not have caught a newly widened
route that happened to return a non-200; the dependency graph does.

## Blocker two: the contract identifier

It was obtainable, and it was being dropped in mapping. This is the TW-56 earnings `timestamp`
pattern exactly, and it is present in all three live chain sources.

**marketdata.app**, the configured primary (`market_data_vendor` defaults to `marketdata`), returns
`optionSymbol` on `/v1/options/chain/`. The vendor documents it verbatim as "the option symbol
according to OCC symbology". It arrives in the same parallel-array order as `strike` and `side`,
both of which `marketdataapp_client.get_chain` already read, so the column was sitting alongside the
ones being consumed. Established from the vendor's own documentation at
`https://www.marketdata.app/docs/api/options/chain/`, not from live probing, and the reason for that
choice is stated under Not done below.

**Yahoo**, the fallback that carries the chain whenever the primary returns empty or is credit-capped,
supplies `contractSymbol` on every calls and puts row. Established by live probe on 2026-08-19
through the repository's own fetch path (`yahoo_options._options_payload('AAPL')`), not from
documentation and not from memory. Both sides returned the identical key set:

    CALL ROW KEYS: ['ask', 'bid', 'change', 'contractSize', 'contractSymbol', 'currency',
                    'expiration', 'impliedVolatility', 'inTheMoney', 'lastPrice', 'lastTradeDate',
                    'openInterest', 'percentChange', 'strike', 'volume']
    SAMPLE contractSymbol: 'AAPL260819C00250000'
    PUT  SAMPLE contractSymbol: 'AAPL260819P00205000'

`_side_from_row` read six of those fifteen keys and dropped the identifier.

**Databento GLBX**, the options-on-futures path, supplies `raw_symbol` on the definition record. That
one was not merely available, it was already in hand: `databento_fop.get_chain` uses `d.raw_symbol`
as the key it fetches quotes with, then discarded it when constructing the row three lines later.

Polygon's `get_chain` is an unimplemented stub returning `[]`, so it has nothing to drop and nothing
to surface.

### The decision

Each side of each strike now carries two fields. `contract_symbol` is the vendor's own value copied
verbatim. `contract_symbol_scheme` names the symbology, `occ` or `cme-globex`.

The identifier lives per side rather than per row because a chain is keyed by strike while a contract
is a strike and a right together. The call and the put at one strike are two different contracts with
two different identifiers, and a row-level field could carry only one of them.

The scheme is load-bearing rather than decorative. `AAPL260819C00250000` and `ESZ5 C5000` are
different namespaces, `/securities/resolve-option` accepts only the former, and a consumer keying a
CME instrument symbol as an OCC symbol would address the wrong contract or nothing at all. Serving
the scheme means the consumer checks rather than infers it from the symbol's shape. The vocabulary is
two named constants in `marketdata/client.py`, so it cannot drift into a third spelling.

Snake case (`contract_symbol`) matches the rest of that payload, which already serves `open_interest`,
`implied_vol` and `iv_available`. The consuming contract's `contractSymbol` is the consumer's
vocabulary and the consumer maps it, exactly as `/futures/drivers` refuses to bend a transform value
to fit a consumer enum.

**Absence is typed and nothing is minted.** A source that supplies no identifier yields `None` with a
`None` scheme, and both keys stay present, so a consumer distinguishes "this vendor named no
contract" from "this build does not report one". That is the discipline `_with_as_of` already applies
to observation time in the same file. Nothing derives an OCC symbol from strike, expiry and right,
even though `_enrich_side` holds all three and the composition is trivial. Minting one would assert a
contract exists that we never saw quoted. A test pins that directly: a source with no identifier
produces `None`, and the string that a mint would have produced appears nowhere in the response.

## Licensing

**Nothing in this payload is a licensed identifier.** OCC and OSI symbology is an open standard
composed of publicly known contract terms, and CME Globex `raw_symbol` is exchange symbology. Neither
is a CUSIP, and neither embeds one, so the operator ruling that withholds CUSIP and US or CA ISINs
from anonymous callers has no field to withhold in this response. That is asserted structurally
rather than believed: a test walks the entire chain response and fails on any key containing `cusip`,
`isin`, `sedol` or `figi`. It is worth noting that listed options do have CUSIPs assigned by OCC, so
this is a statement about what this payload contains, not about options in general, and the test is
the tripwire if that ever changes.

The consumer's ability to apply the policy is what this row makes possible, and the mechanism is the
scheme field. A consumer that receives an identifier and its named symbology can classify it against
the withheld set; a consumer that receives a bare string has to guess from its shape.

**Named gap, and it is the one worth the planner's attention.** The quote values themselves are
vendor-supplied under per-vendor terms, and the response does not name which vendor produced them. A
consumer cannot currently distinguish a marketdata.app quote from a Yahoo quote from a Databento GLBX
quote, and those three carry materially different terms. Yahoo in particular is scraped through
`query2.finance.yahoo.com` with no redistribution license at all, and it is not an edge case: it is
the standing fallback whenever the primary is credit-capped, which is the documented reason the
module exists. Relaying a Yahoo-sourced chain outward through an anonymous human door is a licensing
exposure that the re-gate makes reachable and that this row does not close. Closing it means plumbing
a quote-source marker through `FallbackMarketDataClient`, which knows exactly which path produced the
rows. I did not build it, because the operator scoped this row to the gate and the identifier and
placed the policy in the consumer, and a half-built provenance field would be worse than a named
absence. Recommend it as its own row.

A second, smaller observation. `app/config.py` already treats OPRA real-time redistribution as a
fee-bearing licensing decision rather than a code toggle, and `opra_client.py` carries the same
warning at length. That discipline exists for the options tape and has no counterpart on the chain
path. The chain is delayed vendor data rather than an OPRA redistribution stream, so this is not the
same exposure, but the asymmetry is worth a look when the quote-source marker is built.

## Tests

Twenty eight new tests in `apps/cockpit/backend/tests/test_tw63_options_regate.py`.

The gate, positively: a service credential reaches both routes with the dev bypass off, and the
principal it resolves to is `service:cockpit` rather than any user id.

The gate, negatively, which is the half that matters more: absent credential, empty string,
whitespace only, a `Bearer`-prefixed value, a JSON blob, and a one-character truncation of the real
secret all still 401 on both routes, with the 401 body carrying nothing but `detail`. A malformed
credential presented alongside `X-Dev-User` still 401s with the dev bypass active, which is the
fall-through the combined gate exists to prevent. An unconfigured secret closes the service path
rather than opening the routes.

Existing callers: user JWT and dev bypass both still reach both routes.

Nothing else widened: operator-only routes refuse a service caller in production auth and in dev
mode, plus the two structural declarations described above.

The identifier: present and surfaced at the route; present and surfaced at each of the three vendor
mappers individually; absent and not minted; scheme present exactly when the symbol is; scheme drawn
only from the named vocabulary; and call and put at one strike never sharing an identifier.

Licensing: no licensed-identifier key anywhere in the response, and the scheme travels with every
identifier.

One defect in my own work, found by adversarial review of the tests rather than of the change, and
fixed in the second commit. The helper resolving a path's auth dependencies used
`next(r for r in app.routes if r.path == path)`. Twenty two paths in this app are registered more
than once, a GET and a PUT on the same URL for instance, and each registration carries its own
dependency graph, so a first-match lookup reports one method's gate as if it were the path's. None of
the declared paths is duplicated today, so every assertion was correct, but the two tests whose only
job is to fail when a route is re-gated must not carry a hole that reads as coverage. Auth names are
now computed per route object and unioned across a path's methods, and the served-set sweep iterates
route objects directly so a served route cannot hide behind an unserved sibling at the same path. The
removal proof was re-run against the hardened form and produced the same five failures.

### Proof by removal

`/options/chain` was reverted to `Depends(get_current_user_id)`, the module was run, and five tests
failed. Restored, all twenty eight pass. Raw output, trimmed to the two behavioural failures:

    REMOVAL PROOF: /options/chain reverted to get_current_user_id

    _____________ test_service_credential_reaches_both_options_routes _____________
            for method, path, body in _REGATED:
                r = _call(client, method, path, body, _svc(GOOD_SECRET))
    >           assert r.status_code == 200, f"{method} {path} -> {r.status_code} ({r.text[:200]})"
    E           AssertionError: POST /options/chain -> 401 ({"detail":"Missing bearer token"})
    E           assert 401 == 200

    ________ test_bad_credential_does_not_fall_through_to_the_dev_identity ________
            headers = {**_svc("   "), **as_user("someone")}
            for method, path, body in _REGATED:
                r = _call(client, method, path, body, headers)
    >           assert r.status_code == 401, f"{method} {path} -> {r.status_code}"
    E           AssertionError: POST /options/chain -> 200
    E           assert 200 == 401

    =========================== short test summary info ===========================
    FAILED tests/test_tw63_options_regate.py::test_service_credential_reaches_both_options_routes
    FAILED tests/test_tw63_options_regate.py::test_bad_credential_does_not_fall_through_to_the_dev_identity
    FAILED tests/test_tw63_options_regate.py::test_the_served_gate_reaches_exactly_the_declared_paths
    FAILED tests/test_tw63_options_regate.py::test_every_other_market_route_keeps_its_original_gate
    FAILED tests/test_tw63_options_regate.py::test_the_two_routes_use_the_existing_gate_not_a_new_auth_style
    5 failed, 23 passed in 6.92s

    RESTORED: /options/chain back on SERVED_REFERENCE
    ............................                                             [100%]
    28 passed in 13.77s

The second failure is the more interesting one. Under the user-only dependency, a request presenting
a malformed service credential together with a dev-user header returns 200, because
`get_current_user_id` never reads the service header and quietly resolves the dev identity. The
combined gate commits the request to the service path the moment the header is present, so the same
request is a 401. The re-gate is therefore not only wider, it is stricter against credential
confusion on these two routes than what it replaced.

## CI

Full backend suite, the CI command, run in `apps/cockpit/backend`. Raw tails:

Baseline at `569adaca`, before any edit:

    4813 passed, 2 skipped, 21 deselected, 38926 warnings in 584.66s (0:09:44)

After the change, at `e4f4d254`:

    4841 passed, 2 skipped, 21 deselected, 38951 warnings in 686.28s (0:11:26)

Zero failures on both sides. The delta is 28 passing tests, exactly the new module, so nothing
existing changed behaviour.

GitHub CI is the authoritative signal and the merge gate, and it is green on the correct head. Gated
on the conclusion string, not on a `gh` exit code:

    HEAD: 6e185a2460b86c518a6b491d635f15f49bb66ad8
    Python tests (cockpit backend): COMPLETED SUCCESS
    Frontend build (cockpit web): COMPLETED SUCCESS
    Frontend tests (cockpit vitest): COMPLETED SUCCESS
    Gitleaks security scan: COMPLETED SUCCESS
    Windows .exe (release tags only): COMPLETED SKIPPED

The CI backend job's own pytest tail, which matches the local run exactly:

    4841 passed, 2 skipped, 21 deselected, 38903 warnings in 233.08s (0:03:53)

## Not done, and why

**Not deployed.** Live paper-trading soak with an A or B experiment is running. No docker, no gcloud,
no ssh, no scp, no deploy script was invoked.

**Not merged, not pushed to main.**

**No live probe of the marketdata.app chain.** The Yahoo path was probed live because it is free and
unauthenticated. The marketdata.app chain was established from the vendor's own documentation
instead, because that vendor bills chain requests against a daily credit cap, the cap is the
documented reason the Yahoo fallback exists, and burning credits during a live soak could flip the
running system onto the fallback path mid-experiment. The consequence is honest to state: the Yahoo
and Databento identifiers are verified against real data, and the marketdata.app one is verified
against the vendor's documentation and the shape the existing mapper already relies on. The mapper
handles a missing or empty `optionSymbol` as a typed absence, so a documentation error degrades to
`None` rather than to a wrong identifier, and that path has its own test.

**The quote-source and quote-license marker was not built.** Named as a gap above with a
recommendation.

**Per-principal rate limiting was not touched.** `RateLimitMiddleware` is per IP at 1200 per minute
and does not distinguish a service caller from a user. The two re-gated routes reach billed vendors
(marketdata.app credits, Databento queries), so a service consumer now shares that per-IP budget with
users behind the same egress. This is pre-existing and applies identically to the ten routes already
on the served gate, so it is not a regression this row introduces, but the planner should know that
the re-gate puts a billed vendor path behind a shared credential with no per-principal accounting.
