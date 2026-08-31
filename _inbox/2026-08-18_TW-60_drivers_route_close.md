---
doc_id: 2026-08-18_TW-60_drivers_route_close
date: 2026-08-18
status: active
lane: Smart Markets (unregistered R&D)
plan_row: TW-60 (CANON_OVERRIDE — no PLAN-ROW by design, operator-ruled 2026-08-18)
type: lane close artifact
owner: lane planner
repo: empressa-trading
related_canonical:
  [
    _catalog/repo_intents.md,
  ]
---

# TW-60 close: the futures driver mapping is served

## What shipped

Branch `tw60/drivers-route`, PR **#343**, commit `78e8e753`. Base `main` at `e4122fef`. Three files, 955 insertions, zero deletions. **Not merged, not deployed.**

https://github.com/empressaioemail-tech/empressa-trading/pull/343

| file | change |
| --- | --- |
| `apps/cockpit/backend/app/routers/futures_drivers.py` | new, 483 lines |
| `apps/cockpit/backend/tests/test_futures_drivers_route.py` | new, 470 lines |
| `apps/cockpit/backend/app/main.py` | +2 lines: the import and the mount, nothing else |

## The finding, confirmed at source before building

Every figure in the dispatch was re-read from the files rather than trusted.

`app/data/futures_catalog.json` v2 holds **8 authorities** (`cme_fprf`, `cme_refdata_api`, `cme_website`, `cftc_cot`, `fred`, `eia`, `treasury_fiscaldata`, `treasurydirect_ta_ws`), **11 instruments** (GC SI CL NG RB ZB ZN ZT M6E M6B M6A) and **33 driver rows**. Confirmed, and the planner's earlier "67 authority rows" figure was indeed wrong.

`providers/futures_reference.drivers()` returns the typed-verdict shape. The only caller anywhere in the repo was `tests/test_futures_reference.py:216`. `app/routers/fundamentals.py:229` mentions the module in a comment and does not import it. Nothing mounted it.

The checkout's OpenAPI served **284 paths** at `origin/main` and **285** with this row — matching the survey's deployed figure exactly, and confirming the route is genuinely served rather than merely defined.

## The route

```
GET /futures/drivers/{symbol}
```

Gate: `SERVED = Depends(get_user_or_service_caller)` — the precedent from `app/securities/router.py` and `app/routers/econ.py`. A user JWT reaches it, a service credential reaches it, an unauthenticated caller does not. **No existing route's auth gate was touched.**

`{symbol}` carries the `:path` converter so both `CL` and the catalog's own `/CL` form resolve. Without it a consumer echoing back the identifier the catalog gave it gets a 404, which is a "no such route" answer to a well-formed question. `/futures/curve/{symbol:path}` in `market.py` is the adjacent path; the second segment differs, so there is no shadowing in either direction.

### Response signature

Top level:

```
layer, symbol, root, covered, verdict, scope, catalog_version,
value_resolution { mode, resolves_observations, reason, fred_point_in_time },
count, series[], transform_vocabulary { defined_in, values_in_response,
                                        catalog_vocabulary, mapped_to_consumer_enum, note }
```

On a miss, additionally `reason` and `catalog_roots` (the 11 roots that were searched).

Per series:

```
id, instrument_root, label, role,
series_id, series_id_field, transform, transform_vocabulary, units, decimals,
frequency  { verdict, value|reason, source|scope },
release    { verdict, cadence, as_of, published | reason, scope },
authority  { id, name, label, class, endpoint, access, transport },
catalog_provenance, blurb,
route, facet_field, authority_description, direction_semantics   (EIA rows)
shared_with                                                       (where held)
match { dataset, dataset_label, endpoint, filter, match,
        row_identifier, program_fields, resolution, negative_control }   (Treasury rows)
identifier_verification { http_status, verdict, identifier_echoed_back,
                          authority_description, authority_units, observations,
                          auctions_matched, discriminators_held, key_field, route,
                          frequency, dataset, match, query, verified_at, receipt,
                          observed_values_withheld }
                        | { verdict: absent-verified, reason, scope }
last_observation { verdict, reason, scope, value, observed_values_withheld,
                   withheld_note, blocked_by?, served_elsewhere }
```

`frequency`, `release`, `series_id_field`, `identifier_verification` and `match` are all typed absences when the catalog does not hold them. **The payload contains zero bare nulls**; the only `null` is `last_observation.value`, which is null by contract and arrives wrapped in a verdict explaining why. That is asserted by test.

## Value resolution: mapping only, and it says so

The dispatch allowed either resolving `lastObservation` against the real authority or serving the mapping and saying so. **I served the mapping only.**

Three reasons, in order of weight. First, TW-59: `providers/fred.py` `latest()` builds its query as `{"series_id", "api_key", "file_type", "sort_order", "limit"}` with no `realtime_start`/`realtime_end`, so it returns the current revised value rather than the value knowable on a date. Confirmed by reading the client. Eighteen of the 33 driver rows are FRED. Resolving through that client would embed the exact defect TW-59 exists to remove, and racing the fix would collide with it. Second, the alternative — leaving the value path behind whatever interface TW-59 lands — is what serving the mapping already is. Third, it kept the change inside the allowed file scope with no touch to any provider fetch path.

Every row therefore carries:

```json
"last_observation": {
  "verdict": "not-served",
  "reason": "this route serves the driver MAPPING only and resolves no observations; the catalog row is a series pointer, not a value",
  "value": null,
  "observed_values_withheld": true,
  "blocked_by": { "row": "TW-59", "detail": "providers/fred.py sends no realtime_start/realtime_end…" },
  "served_elsewhere": { … }
}
```

`not-served` is a **fourth verdict, deliberately local to this route** and not added to `futures_reference`'s vocabulary. `absent-verified` would claim the authority publishes nothing, which is false — FRED and EIA publish these weekly. `lookup-failed` would claim an attempt was made and failed, also false. The honest statement is that this route does not resolve observations, and that is a third fact.

## Which rows resolve and which cannot

All 33 resolve as **mappings**. None resolve as **values** through this route. The material distinction is where a value could be obtained today and whether the identifier carries a live-verification receipt.

| root | driver id | authority | series id | transform | value path today | receipt |
| --- | --- | --- | --- | --- | --- | --- |
| GC | gc_real_yield_10y | fred | DFII10 | level | on `/market/rates` | none |
| GC | gc_broad_dollar | fred | DTWEXBGS | level | no served source | none |
| SI | si_real_yield_10y | fred | DFII10 | level | on `/market/rates` | none |
| SI | si_broad_dollar | fred | DTWEXBGS | level | no served source | none |
| CL | cl_crude_stocks | eia | WCESTUS1 | wow_diff | no served source | yes |
| CL | cl_refinery_util | eia | WPULEUS3 | level | no served source | yes |
| CL | cl_production | eia | WCRFPUS2 | level | no served source | yes |
| CL | cl_broad_dollar | fred | DTWEXBGS | level | no served source | none |
| CL | cl_crude_imports | eia | WCEIMUS2 | level | no served source | yes |
| CL | cl_cushing_stocks | eia | W_EPC0_SAX_YCUOK_MBBL | wow_diff | no served source | yes |
| CL | cl_spr_stocks | eia | WCSSTUS1 | wow_diff | no served source | yes |
| NG | ng_storage | eia | NW2_EPG0_SWO_R48_BCF | wow_diff | no served source | yes |
| NG | ng_henry_hub_spot | fred | DHHNGSP | level | no served source | none |
| RB | rb_gasoline_stocks | eia | WGTSTUS1 | wow_diff | no served source | yes |
| RB | rb_refinery_util | eia | WPULEUS3 | level | no served source | yes |
| RB | rb_retail_gasoline | fred | GASREGW | level | no served source | none |
| ZB | zb_yield_30y | fred | DGS30 | level | on `/market/rates` | none |
| ZB | zb_breakeven_10y | fred | T10YIE | level | on `/market/rates` | none |
| ZB | zb_issuance_30y | treasury_fiscaldata | Bond\|30-Year\|nominal | auction_record | no served source | yes |
| ZB | zb_bonds_outstanding | treasury_fiscaldata | Marketable\|Bonds | level | no served source | yes |
| ZN | zn_yield_10y | fred | DGS10 | level | on `/market/rates` | none |
| ZN | zn_breakeven_10y | fred | T10YIE | level | on `/market/rates` | none |
| ZN | zn_issuance_10y | treasury_fiscaldata | Note\|10-Year\|nominal | auction_record | no served source | yes |
| ZN | zn_notes_outstanding | treasury_fiscaldata | Marketable\|Notes | level | no served source | yes |
| ZT | zt_yield_2y | fred | DGS2 | level | on `/market/rates` | none |
| ZT | zt_issuance_2y | treasury_fiscaldata | Note\|2-Year\|nominal | auction_record | no served source | yes |
| ZT | zt_notes_outstanding | treasury_fiscaldata | Marketable\|Notes | level | no served source | yes |
| M6E | m6e_spot | fred | DEXUSEU | level | no served source | none |
| M6E | m6e_rate_diff_proxy | fred | DGS10 | level | on `/market/rates` | none |
| M6B | m6b_spot | fred | DEXUSUK | level | no served source | none |
| M6B | m6b_rate_diff_proxy | fred | DGS10 | level | on `/market/rates` | none |
| M6A | m6a_spot | fred | DEXUSAL | level | no served source | none |
| M6A | m6a_rate_diff_proxy | fred | DGS10 | level | on `/market/rates` | none |

**10 on `/market/rates`, 23 with no served source** — the survey's split, reproduced from the code rather than copied from the brief. **15 carry a live-verification receipt** (9 EIA, 6 Treasury), **18 do not** (all FRED, because `series_verification.json` covers EIA and Treasury only). Those 18 say so in a typed absence naming the receipt file as the scope searched.

The 10-row set is **derived from `app/routers/market.py` `_RATES_GROUPS` and `_RATES_CURVE` at call time**, not hand-copied. A hand-declared list that quietly stops matching the board is a known failure mode in this portfolio; if those structures are renamed the route degrades to a typed absence and `test_the_rates_board_set_really_is_derived_from_market_py` fails. Rows in that group also carry a caveat stating that the board reads the same FRED client and inherits the same point-in-time defect, so the pointer is not an endorsement.

## The transform mismatch — reported, not resolved

The catalog vocabulary is `level` (25 rows), `wow_diff` (5) and `auction_record` (3). The consumer's `SeriesTransformSchema` lives in the Smart Markets repo and is **not readable from `empressa-trading`** — I did not fabricate a claim about its contents.

What the route does instead: serves the catalog transform **verbatim**, names the vocabulary it came from (`transform_vocabulary.defined_in`), enumerates both the values present in the response and the full catalog vocabulary, and sets `mapped_to_consumer_enum: false`. That lets the consumer detect the mismatch against its own enum rather than trusting an assertion made here. **The contract change is the consumer's decision and is not made in this row.** `test_transforms_are_served_verbatim_and_not_mapped` asserts every one of the three values survives transit unmangled.

## The trap I had to design around, beyond the three flagged

Both source files hold **snapshotted observations**: `series_verification.json` rows carry `latest_value`, `latest_period`, `latest_high_yield`, `latest_bid_to_cover`, `latest_offering_amt`, `latest_cusip`, and the catalog's Treasury blocks carry `latest_verified` dicts. Copying a verification receipt or a match predicate wholesale would have served stale numbers — a "never a stale cached number" violation arriving through the provenance field rather than the value field, which is the version of the mistake that looks correct.

Fixed structurally rather than by care: everything copied out of those files passes an explicit **key whitelist** (`_VERIFICATION_KEYS`, `_MATCH_KEYS`), so a field added to either file later cannot leak by default. Two tests hold it — one asserts no `latest_*` key anywhere in any response for any root, and a second asserts the source files **still hold** those numbers so the first cannot pass vacuously.

Negative-control verification rows are also skipped when indexing: they record what the query returns *without* the discriminators, which for ZB is CUSIP 912810US5, a 30-Year TIPS rather than the nominal bond. Attaching one to a series would describe the wrong instrument under the right identifier.

## Tests

37 tests in `tests/test_futures_drivers_route.py`, all offline. Coverage against the dispatch's minimum, plus what the build turned up:

- service credential calls it; user JWT calls it; unauthenticated is 401; four malformed-credential forms are 401 with no demotion to the dev identity even with the dev bypass active
- the gate is asserted to be the **same function object** as `get_user_or_service_caller`, so a locally re-implemented check fails
- route is mounted and present in the OpenAPI schema
- every one of the 11 roots resolves over HTTP; the 33-row total is pinned
- authority, name, units, transform, role present on every series
- unknown instrument (4 forms) is 200 with `covered: false`, reason, scope and the searched roots — never 404
- every series carries the typed absence; FRED rows name TW-59 and the `realtime_start` defect; the 10/23 split is asserted; the derivation from `market.py` is asserted directly
- no `latest_*` key in any response, with an anti-vacuity guard
- no bare nulls in any series
- no DB session in the route's dependency graph; no writable name in the module namespace; POST/PUT/PATCH/DELETE all 405; repeated reads identical; the memoized catalog unmutated after a full sweep

### Guards proven by REMOVAL

**1. Auth dependency stripped** from the route decorator:

```
GUARD REMOVED: auth dependency stripped from the route decorator
===== RAW OUTPUT: auth guard REMOVED =====
E       AssertionError: set()
E       assert <function get_user_or_service_caller at 0x0000023FB0D9AAE0> in set()

tests\test_futures_drivers_route.py:136: AssertionError
=========================== short test summary info ===========================
FAILED tests/test_futures_drivers_route.py::test_unauthenticated_is_401 - Ass...
FAILED tests/test_futures_drivers_route.py::test_bad_service_credential_is_401_not_a_demotion[]
FAILED tests/test_futures_drivers_route.py::test_bad_service_credential_is_401_not_a_demotion[   ]
FAILED tests/test_futures_drivers_route.py::test_bad_service_credential_is_401_not_a_demotion[Bearer tw60-test-service-secret]
FAILED tests/test_futures_drivers_route.py::test_bad_service_credential_is_401_not_a_demotion[{}]
FAILED tests/test_futures_drivers_route.py::test_gate_is_the_shared_served_dependency_not_a_local_one
6 failed, 30 passed in 10.14s
```

**2. Stale-number whitelist bypassed** (`_pick(...)` replaced with a wholesale copy in both places):

```
GUARD REMOVED: _VERIFICATION_KEYS and _MATCH_KEYS whitelists bypassed
===== RAW OUTPUT: stale-number whitelist REMOVED =====
E               AssertionError: ZB: stale field served at .series[2].match.latest_verified
E               assert not True
E                +  where True = <built-in method startswith of str object at 0x000002076CA896B0>('latest')
E                +    where <built-in method startswith of str object at 0x000002076CA896B0> = 'latest_verified'.startswith
E                +      where 'latest_verified' = str('latest_verified')
=========================== short test summary info ===========================
1 failed, 35 passed in 6.97s
```

Both guards restored and verified clean (`grep -c "GUARD REMOVED"` → `0`).

### Full suite, CI command, raw

Baseline first, on a clean worktree at `origin/main` before any edit:

```
===== BASELINE (clean origin/main, before TW-60) =====
4731 passed, 2 skipped, 21 deselected, 38999 warnings in 676.74s (0:11:16)
```

Branch, same command (`cd apps/cockpit/backend && python -m pytest -q`):

```
===== RAW: full backend suite, CI command, TW-60 branch =====
EXIT=0
4768 passed, 2 skipped, 21 deselected, 38999 warnings in 477.72s (0:07:57)
```

**4768 − 4731 = 37**, exactly the new tests. Zero failures, zero regressions, CI baseline of zero failures preserved.

GitHub CI, run `32200081580`, **all green**:

```
=== RAW: gh run view 32200081580 ===
status=completed conclusion=success
Frontend build (cockpit web): completed success
Frontend tests (cockpit vitest): completed success
Python tests (cockpit backend): completed success
Gitleaks security scan: completed success
Windows .exe (release tags only): completed skipped

=== RAW: gh pr checks 343 ===
Frontend build (cockpit web)      pass  52s
Frontend tests (cockpit vitest)   pass  25s
Gitleaks security scan            pass  10s
Python tests (cockpit backend)    pass  7m3s
Windows .exe (release tags only)  skipping  0
```

The backend job's conclusion string reads `success`, judged on the string and not on a `gh` exit code. `Windows .exe` is tag-gated and skips by design on a branch push.

## Two defects the tests caught during the build

Worth recording because both were mine and both were caught by a test rather than by reading.

`futures_reference._uncovered()` returns `symbol` but **no `root` key**, so the uncovered path raised `KeyError: 'root'` on every unknown instrument — the exact case the honest-miss requirement is about. Fixed in the router (`base.get("root") or fr.normalize_root(symbol)`) rather than by changing the provider's shape, which other consumers read.

The encoded-slash form `%2FCL` was decoded to a real `/` before routing and 404'd against a plain `{symbol}`. Fixed with the `:path` converter, matching `market.py`'s own precedent.

## Hard rules observed

**Not deployed.** No docker, gcloud, ssh, scp or deploy script was run. Live paper-trading soak with an A/B experiment in flight; any restart kills running jobs and both arms.

**Not merged, not pushed to main.** PR #343 is open against `main` and left for review.

**No existing route's auth gate changed.** The only edit outside the two new files is two lines in `main.py`: the import and the mount.

**No non-exiting commands.** No uvicorn, no `--reload`. Every verification step was exit-bounded.

**Scope held.** `app/routers/futures_drivers.py`, `tests/test_futures_drivers_route.py`, the `main.py` mount, and this artifact. Nothing in `app/providers/` or `app/data/` needed changing and nothing was changed there.

**Worktree isolation held.** Work done in `P:/empressa-trading-worktrees/tw60-drivers` off `origin/main`. No `git checkout` in `P:/Empressa Trading`.

## What I could not do, and what is left

**The transform enum reconciliation.** `SeriesTransformSchema` is in the consumer's repo and unreadable from here. The mismatch is reported in the response and in this artifact; deciding it is the consumer's call. Someone with access to `packages/contract/src/twin.ts` needs to rule on whether `wow_diff` and `auction_record` join the enum or whether the union layer carries an escape hatch.

**Value resolution.** Deliberately not built, pending TW-59. When that lands, the value path attaches at `_last_observation` — the shape already reserves `value` and carries `blocked_by` naming the row, so switching a series from `not-served` to a real observation is additive and no consumer written against this shape breaks.

**No docs update.** There is no `apps/cockpit/docs/` companion for the futures authority layer the way `ECON_DATA_LAYER.md` covers the econ board, so nothing there went stale. `apps/cockpit/docs/` was outside the dispatch's file scope in any case.

**Merge.** Deliberately not done. CI is green on every job and the PR is `MERGEABLE` with no conflicts, so nothing blocks it mechanically — but the dispatch says DO NOT MERGE and the merge call sits with the planner.
