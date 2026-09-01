---
title: TW-56 close — cockpit upstream honesty (etf-holdings fallback, quote observation time)
status: active
last_updated: 2026-08-18
owner: planner
plan_row: TW-56
repo: empressa-trading
---

# TW-56 close — cockpit upstream honesty

Two honesty defects in the cockpit backend, both found by Smart Markets executors probing live routes on 2026-08-18. Authorized by operator ruling TW-56 (Smart Markets is unregistered R&D, bounded PRs, no PLAN-ROW by design; row recorded in `_rd_disclosure_twin/08_build_scope.md`).

## Delivery

Repo `empressa-trading`. Branch `tw56/upstream-honesty`, cut from `origin/main` at `d0adc0cc` in its own worktree at `P:/empressa-trading-worktrees/tw56-honesty`. Nothing was checked out in `P:/Empressa Trading`.

Commit `b0cf6e24`. PR **#342** — https://github.com/empressaioemail-tech/empressa-trading/pull/342. NOT merged. NOT deployed.

Five files, 496 insertions, 30 deletions:

    apps/cockpit/backend/app/providers/fmp.py          | 116 +++++++++++--
    apps/cockpit/backend/app/routers/market.py         |  78 +++++++--
    apps/cockpit/backend/tests/test_etf_holdings.py    | 187 ++++++++++++++++++++-
    apps/cockpit/backend/tests/test_fmp_quote_cache.py |   4 +
    apps/cockpit/backend/tests/test_quote_as_of.py     | 141 ++++++++++++++++

## Defect 1 — `/market/etf-holdings` could not fail

An FMP 5xx, a network timeout, an above-tier 403, and a genuinely empty result all landed on the same hand-curated static top-ten returned as `available: true, source: "static"`. A consumer could not tell a live answer from a curated stand-in served because the vendor was down. Same family as the `/CL` defect TW-9 found: a silent substitution presented as the real thing.

The finding that changed the fix: the distinction was already destroyed one layer BELOW the handler. `fmp._fetch` collapses `http_error`, `network_error`, and `bad_json` into a single `None`, so `fetch_etf_holdings` returned `[]` for four different facts before the router's bare `except Exception` ever ran. Narrowing the router's except alone would have fixed nothing observable. The dispatch's diagnosis was right about the symptom and one layer short on the cause.

What shipped:

`_fetch_status(path, params) -> (payload, status)` in the provider carries the reason. `_fetch` is now a one-line wrapper over it, so its contract is unchanged for every other call site. `fetch_etf_holdings_result(symbol) -> (rows, status)` reports `ok`, `empty`, `no_api_key`, `bad_symbol`, `http_error`, `network_error`, `bad_json`, or `bad_shape`. `fetch_etf_holdings` remains a rows-only wrapper, so the three non-router callers (`jobs/phase2_backfill.py`, `marketdata/equity_universe.py` x2) are untouched.

The route carries `live_status` and `fallback_reason`. The static list is kept — it is useful. `symbol`, `available`, `source`, and `holdings` keep their existing meanings.

| case | `source` | `live_status` | `fallback_reason` |
|---|---|---|---|
| live answer | `fmp` | `ok` | `null` |
| vendor answered, genuinely empty | `static` | `empty` | `live_empty` |
| vendor answered, every row junk | `static` | `ok` | `live_empty` |
| vendor never answered | `static` | failure code | `live_unavailable` |
| not a fund | `null` | `empty` | `null` |
| not a fund, vendor down | `null` | failure code | `null` |

The bare `except Exception` is narrowed to `(OSError, ValueError, RuntimeError)`. A `TypeError` or `AttributeError` in our own code was being laundered into a curated top-ten that looked exactly like a served answer; it now surfaces as a 500. `TimeoutError` subclasses `OSError`, so transport timeouts stay in the fallback branch.

## Defect 2 — `/market/quote` served a price with no observation time

`_row_to_quote` dropped the `timestamp` the FMP payload carries, so every quote the cockpit served was a bare number with no observation instant. The twin could not serve a populated price at all and marked the block `partial`.

`as_of` (ISO-8601 UTC) now carries the vendor's own instant. It is `null` when the source supplies none — never stamped with `now()`. The fetch instant is when we asked, not when the market printed; a fabricated observation time is worse than a missing one. Numeric strings and millisecond epochs are handled; NaN, inf, zero, negatives, and anything outside 1990..2100 yield `null` rather than a nonsense instant.

The key is always present, so a consumer can tell "this price has no known observation time" from "this build does not report one". The macro/futures path (`resolve_quote`) and the MarketData path report `as_of: null` honestly rather than inventing one — wiring a real instant into those sources is a source-side change and was deliberately not faked here.

## Consumer impact

Additive only. No key renamed or removed.

`/market/etf-holdings` gains two keys. `BasicFundHoldings.tsx` reads `available` and `holdings` only, so the Basic shell is unaffected and still shows the curated list.

`/market/quote`, `/market/quotes`, and every `fmp.fetch_quote`/`fetch_quotes` consumer gain `as_of`, `null` unless the vendor stamped the row. Redis-cached quote payloads carry it too. No consumer does `Quote(**d)`, and pydantic v2 ignores extra fields regardless.

## Naming flag

This emits snake_case `as_of`, matching `change_pct`, `iv_rank`, and `hv_30` in the same dict. The Smart Markets twin read contract (`_rd_disclosure_twin/09_twin_read_contract.md` line 68) spells it `asOf`. Recommendation: the twin adds a one-line `as_of` -> `asOf` map in its cockpit reader rather than the cockpit emitting a camelCase key into a snake_case payload. Flagging rather than silently diverging.

## Scope deviation (declared)

The dispatch scoped edits to `app/routers/` and `tests/`, and named `_row_to_quote` as living in `market.py`. It is in `app/providers/fmp.py`, and both defects are rooted there: the router cannot recover a timestamp the provider has discarded, nor a failure reason `_fetch` has already flattened. Provider edits are minimal and additive, and existing contracts (`_fetch`, `fetch_etf_holdings`) are preserved verbatim. No other file outside the declared scope was touched.

## Verification

CI command, run from `apps/cockpit/backend`, full suite:

    $ python -m pytest -q
    4728 passed, 2 skipped, 21 deselected, 38924 warnings in 856.73s (0:14:16)

Zero failures — the merge standard. New tests by name:

    tests/test_etf_holdings.py::test_holdings_live_rows_sorted_and_curated PASSED [  2%]
    tests/test_etf_holdings.py::test_holdings_static_fallback_when_vendor_blocked PASSED [  5%]
    tests/test_etf_holdings.py::test_holdings_honest_empty_for_non_fund PASSED [  8%]
    tests/test_etf_holdings.py::test_static_after_failed_live_call_is_marked_unavailable[http_error] PASSED [ 11%]
    tests/test_etf_holdings.py::test_static_after_failed_live_call_is_marked_unavailable[network_error] PASSED [ 14%]
    tests/test_etf_holdings.py::test_static_after_failed_live_call_is_marked_unavailable[bad_json] PASSED [ 17%]
    tests/test_etf_holdings.py::test_static_after_failed_live_call_is_marked_unavailable[bad_shape] PASSED [ 20%]
    tests/test_etf_holdings.py::test_static_after_failed_live_call_is_marked_unavailable[no_api_key] PASSED [ 22%]
    tests/test_etf_holdings.py::test_failed_live_is_distinguishable_from_genuine_empty_and_from_live PASSED [ 25%]
    tests/test_etf_holdings.py::test_vendor_answered_but_every_row_unusable_is_not_reported_as_a_failure PASSED [ 28%]
    tests/test_etf_holdings.py::test_transport_error_escaping_the_provider_is_caught_and_labelled PASSED [ 31%]
    tests/test_etf_holdings.py::test_programming_error_is_not_laundered_into_a_curated_answer PASSED [ 34%]
    tests/test_etf_holdings.py::test_provider_reports_http_error_separately_from_empty PASSED [ 37%]
    tests/test_etf_holdings.py::test_provider_reports_missing_key_and_bad_symbol PASSED [ 40%]
    tests/test_etf_holdings.py::test_rows_only_wrapper_still_returns_a_bare_list PASSED [ 42%]
    tests/test_etf_holdings.py::test_fetch_status_classifies_transport_and_body_failures PASSED [ 45%]
    tests/test_quote_as_of.py::test_vendor_timestamp_is_surfaced_as_iso_utc PASSED [ 48%]
    tests/test_quote_as_of.py::test_vendor_timestamp_accepts_numeric_string PASSED [ 51%]
    tests/test_quote_as_of.py::test_millisecond_epoch_is_scaled_not_rejected PASSED [ 54%]
    tests/test_quote_as_of.py::test_missing_or_implausible_timestamp_yields_none_never_now[None] PASSED [ 57%]
    tests/test_quote_as_of.py::test_missing_or_implausible_timestamp_yields_none_never_now[] PASSED [ 60%]
    tests/test_quote_as_of.py::test_missing_or_implausible_timestamp_yields_none_never_now[not-a-number] PASSED [ 62%]
    tests/test_quote_as_of.py::test_missing_or_implausible_timestamp_yields_none_never_now[0] PASSED [ 65%]
    tests/test_quote_as_of.py::test_missing_or_implausible_timestamp_yields_none_never_now[-1] PASSED [ 68%]
    tests/test_quote_as_of.py::test_missing_or_implausible_timestamp_yields_none_never_now[nan] PASSED [ 71%]
    tests/test_quote_as_of.py::test_missing_or_implausible_timestamp_yields_none_never_now[inf] PASSED [ 74%]
    tests/test_quote_as_of.py::test_missing_or_implausible_timestamp_yields_none_never_now[1000] PASSED [ 77%]
    tests/test_quote_as_of.py::test_missing_or_implausible_timestamp_yields_none_never_now[99999999999999999] PASSED [ 80%]
    tests/test_quote_as_of.py::test_row_without_a_timestamp_field_at_all_yields_none PASSED [ 82%]
    tests/test_quote_as_of.py::test_no_timestamp_is_not_backfilled_with_the_fetch_instant PASSED [ 85%]
    tests/test_quote_as_of.py::test_quote_route_carries_the_vendor_timestamp PASSED [ 88%]
    tests/test_quote_as_of.py::test_quote_route_reports_absent_observation_time_honestly PASSED [ 91%]
    tests/test_quote_as_of.py::test_quote_route_carries_as_of_on_the_no_data_path PASSED [ 94%]
    tests/test_quote_as_of.py::test_batch_quotes_route_carries_as_of_per_symbol PASSED [ 97%]
    tests/test_quote_as_of.py::test_with_as_of_never_overwrites_a_source_supplied_value PASSED [100%]
    ============================= 35 passed in 5.23s ==============================

CI on PR #342 (authoritative over the local run), all checks terminal:

    $ gh pr checks 342 --json name,state --jq '.[]|"\(.name)	\(.state)"'
    Frontend build (cockpit web)            SUCCESS
    Frontend tests (cockpit vitest)         SUCCESS
    Python tests (cockpit backend)          SUCCESS
    Gitleaks security scan                  SUCCESS
    Windows .exe (release tags only)        SKIPPED

### Guard proofs by removal

Two guards, each broken, run, and restored. Both files verified byte-identical afterwards by md5 (`fmp.py` `7b4e3a98...`, `market.py` `09ebd432...`, matching the pre-removal hashes) before the commit was made.

**Guard A — no-fabrication on `as_of`.** Made `_vendor_epoch_to_iso` fall back to `datetime.now(timezone.utc).isoformat()` when the vendor supplies nothing:

    $ python -m pytest tests/test_quote_as_of.py -q
    ...FFF......FF.F.F.                                                      [100%]
    _________ test_no_timestamp_is_not_backfilled_with_the_fetch_instant __________
        def test_no_timestamp_is_not_backfilled_with_the_fetch_instant():
            """The guard that matters: prove the fetch instant never leaks in."""
            before = datetime.now(timezone.utc)
            q = fmp_mod._row_to_quote("AAPL", _row())
            after = datetime.now(timezone.utc)
    >       assert q["as_of"] is None, (
                f"as_of was fabricated between {before.isoformat()} and {after.isoformat()}"
            )
    E       AssertionError: as_of was fabricated between 2026-08-18T20:48:15.150023+00:00 and 2026-08-18T20:48:15.150036+00:00
    E       assert '2026-08-18T20:48:15.150030+00:00' is None
    tests\test_quote_as_of.py:77: AssertionError

Seven failures. The fabricated instant is caught strictly between the test's own before/after marks, which is the proof that it came from `now()` and not from the vendor.

**Guard B — a failed live call is not a genuine empty.** Forced `live_answered = True` in the route, re-flattening failure into empty:

    $ python -m pytest tests/test_etf_holdings.py -q
    ...FFFFFF.F.....                                                         [100%]
    ____ test_static_after_failed_live_call_is_marked_unavailable[http_error] _____
            _stub_result(monkeypatch, [], status)
            out = client.get("/market/etf-holdings/XLE").json()
            assert out["source"] == "static"
            assert out["live_status"] == status
    >       assert out["fallback_reason"] == "live_unavailable"
    E       AssertionError: assert 'live_empty' == 'live_unavailable'
    E         - live_unavailable
    E         + live_empty
    tests\test_etf_holdings.py:85: AssertionError

    =========================== short test summary info ===========================
    FAILED tests/test_etf_holdings.py::test_static_after_failed_live_call_is_marked_unavailable[http_error]
    FAILED tests/test_etf_holdings.py::test_static_after_failed_live_call_is_marked_unavailable[network_error]
    FAILED tests/test_etf_holdings.py::test_static_after_failed_live_call_is_marked_unavailable[bad_json]
    FAILED tests/test_etf_holdings.py::test_static_after_failed_live_call_is_marked_unavailable[bad_shape]
    FAILED tests/test_etf_holdings.py::test_static_after_failed_live_call_is_marked_unavailable[no_api_key]
    FAILED tests/test_etf_holdings.py::test_failed_live_is_distinguishable_from_genuine_empty_and_from_live
    FAILED tests/test_etf_holdings.py::test_transport_error_escaping_the_provider_is_caught_and_labelled
    7 failed, 9 passed, 8 warnings in 3.65s

After restoring both guards:

    $ python -m pytest tests/test_etf_holdings.py tests/test_quote_as_of.py tests/test_fmp_quote_cache.py -q
    44 passed, 8 warnings in 5.21s

### Pre-existing test corrected

`tests/test_etf_holdings.py::test_holdings_static_fallback_when_vendor_blocked` monkeypatched `fetch_etf_holdings`, which the route no longer calls. It was passing, but because conftest sets a dummy `COCKPIT_FMP_API_KEY`, an unpatched provider call would have attempted a real outbound HTTP request from the test suite. All three pre-existing tests now patch `fetch_etf_holdings_result`, which is what keeps the suite offline. Worth noting as a latent leak found in passing, not caused by this change.

`tests/test_fmp_quote_cache.py::test_fetch_quote_sets_redis_on_miss` asserted an exact quote dict; it now expects `"as_of": None`, which doubles as a check that the Redis cache path is exactly where a fabricated `now()` would have gone unnoticed.

## Not done / deliberately out of scope

Not deployed. Production is the `empressa-bot` GCE VM running a live paper-trading soak with an A/B experiment; any restart kills running jobs and both arms. Deploying is a windowed operator action. No docker, gcloud, ssh, scp, or deploy script was run.

Not merged, not pushed to main. PR #342 awaits operator review.

No route's auth gate was changed. The securities router was not touched.

`resolve_quote` (macro/futures) and `MarketDataClient.get_quote` still have no observation time of their own, so `/market/quote` returns `as_of: null` for futures and macro symbols. Giving those sources a real instant means changing `app/marketdata/macro_sources.py` and the `Quote` model in `app/marketdata/client.py`, which is a separate piece of work; it was not faked here. If Smart Markets needs a populated `as_of` on futures, that is the follow-on.

`fetch_etf_holdings` returning `[]` on failure is still lossy for its three non-router callers (`phase2_backfill`, `equity_universe` x2). They were left unchanged on purpose to keep the blast radius small; `fetch_etf_holdings_result` is available if any of them later needs to distinguish.

The rest of the FMP provider surface still routes through `_fetch` and still flattens failure into `None`. This change only exposes the seam and wires it for holdings; other endpoints with the same fallback shape were not audited.

## Diffs

### `apps/cockpit/backend/app/routers/market.py`

```diff
diff --git a/apps/cockpit/backend/app/routers/market.py b/apps/cockpit/backend/app/routers/market.py
index e8af6ceb..73469e2b 100644
--- a/apps/cockpit/backend/app/routers/market.py
+++ b/apps/cockpit/backend/app/routers/market.py
@@ -218,6 +218,20 @@ async def options_chain(
     return {"symbol": req.symbol, "expiry": req.expiry, "underlying": spot, "strikes": strikes}
 
 
+def _with_as_of(payload: dict) -> dict:
+    """Guarantee an ``as_of`` key on a quote payload.
+
+    ``as_of`` is the SOURCE's own observation instant (ISO-8601 UTC), never
+    ours. A source that supplies no timestamp yields ``None`` — the field is
+    always present so a consumer can tell "this price has no known observation
+    time" from "this build doesn't report one", and is never back-filled with
+    ``now()``, which would assert an observation the vendor never made.
+    """
+    if "as_of" not in payload:
+        return {**payload, "as_of": None}
+    return payload
+
+
 # ``{symbol:path}`` so a futures underlying (``/ES``) survives the URL — see the
 # options-expirations note above; without it the encoded ``%2FES`` 404s and the
 # options tab can't seed the underlying price.
@@ -233,24 +247,29 @@ async def market_quote(
         res = await resolve_quote(symbol, settings=settings)
         if res:
             cp = res.get("change_pct")
-            return {
+            return _with_as_of({
                 "symbol": symbol.upper(),
                 "last": res["last"],
                 "bid": None,
                 "ask": None,
                 "change_pct": (cp / 100.0 if cp is not None else None),
                 "source": res.get("source"),
-            }
+                # Macro/futures sources do not hand back an observation instant
+                # today, so this resolves to None rather than a stamped fetch
+                # time. Wiring a real one is a source-side change, not a
+                # licence to invent one here.
+                "as_of": res.get("as_of"),
+            })
     # FMP Premium primary for equities (MarketData.app has a daily request cap
     # that the watchlist's continuous polling can exhaust); vendor fallback.
     fq = await asyncio.to_thread(fmp.fetch_quote, symbol)
     if fq is not None:
-        return fq
+        return _with_as_of(fq)
     if md is not None:
         q = await md.get_quote(symbol)
         if q is not None:
-            return q.model_dump()
-    return {"symbol": symbol.upper(), "last": None, "bid": None, "ask": None}
+            return _with_as_of(q.model_dump())
+    return _with_as_of({"symbol": symbol.upper(), "last": None, "bid": None, "ask": None})
 
 
 # Vendor credits per request; also keeps the comma-joined FMP URL well under
@@ -643,15 +662,39 @@ async def market_etf_holdings(
     Live FMP ``/stable/etf/holdings`` when the tier allows; curated static
     top-lists for the major index/sector funds otherwise. Honest-empty for
     anything that isn't a fund.
+
+    Every response says what the LIVE call actually did, because the curated
+    list is served both when the vendor legitimately reports nothing and when
+    the vendor never answered — and a consumer must be able to tell those
+    apart from a live answer:
+
+    - ``live_status``: ``ok`` (vendor returned rows), ``empty`` (vendor
+      answered, had none), or a failure reason (``http_error``,
+      ``network_error``, ``bad_json``, ``bad_shape``, ``no_api_key``,
+      ``handler_error``) meaning we never observed the vendor at all.
+    - ``fallback_reason``: only set when ``source == "static"`` —
+      ``live_empty`` if the curated list stands in for a real empty answer,
+      ``live_unavailable`` if it stands in for a call that failed.
+
+    ``symbol`` / ``available`` / ``source`` / ``holdings`` keep their existing
+    meanings for current consumers.
     """
     sym = symbol.strip().upper()
     if not sym:
-        return {"symbol": sym, "available": False, "source": None, "holdings": []}
+        return {
+            "symbol": sym, "available": False, "source": None, "holdings": [],
+            "live_status": "bad_symbol", "fallback_reason": None,
+        }
 
     try:
-        rows = await asyncio.to_thread(fmp.fetch_etf_holdings, sym)
-    except Exception:  # noqa: BLE001 — fall through to the static list
-        rows = []
+        rows, live_status = await asyncio.to_thread(fmp.fetch_etf_holdings_result, sym)
+    except (OSError, ValueError, RuntimeError) as exc:
+        # Narrowed from a bare `except Exception`: vendor/transport trouble is
+        # a fallback case, but a TypeError/AttributeError is OUR bug and must
+        # surface as a 500 rather than be laundered into a curated top-ten
+        # presented as an answer.
+        logger.warning("etf-holdings %s: live lookup failed: %s", sym, exc)
+        rows, live_status = [], "handler_error"
 
     out: list[dict] = []
     seen: set[str] = set()
@@ -678,7 +721,15 @@ async def market_etf_holdings(
 
     if out:
         out.sort(key=lambda r: (r["weight_pct"] is None, -(r["weight_pct"] or 0.0)))
-        return {"symbol": sym, "available": True, "source": "fmp", "holdings": out[:limit]}
+        return {
+            "symbol": sym, "available": True, "source": "fmp", "holdings": out[:limit],
+            "live_status": live_status, "fallback_reason": None,
+        }
+
+    # Past this point nothing usable came back live. Whether that was the
+    # vendor saying "none" or the vendor never answering decides what the
+    # curated list is standing in FOR — it is not the same claim either way.
+    live_answered = live_status in ("ok", "empty")
 
     static = _STATIC_FUND_HOLDINGS.get(sym)
     if static:
@@ -689,8 +740,13 @@ async def market_etf_holdings(
             "holdings": [
                 {"symbol": s, "name": n, "weight_pct": None} for s, n in static[:limit]
             ],
+            "live_status": live_status,
+            "fallback_reason": "live_empty" if live_answered else "live_unavailable",
         }
-    return {"symbol": sym, "available": False, "source": None, "holdings": []}
+    return {
+        "symbol": sym, "available": False, "source": None, "holdings": [],
+        "live_status": live_status, "fallback_reason": None,
+    }
 
 
 # The rates board — FRED series behind both the pro Rates Desk (Research →
```

### `apps/cockpit/backend/app/providers/fmp.py`

```diff
diff --git a/apps/cockpit/backend/app/providers/fmp.py b/apps/cockpit/backend/app/providers/fmp.py
index cfccc36f..4a6ba73c 100644
--- a/apps/cockpit/backend/app/providers/fmp.py
+++ b/apps/cockpit/backend/app/providers/fmp.py
@@ -39,6 +39,7 @@ import logging
 import os
 import threading
 import time
+from datetime import datetime, timezone
 from typing import Any, Literal, Optional
 
 import httpx
@@ -99,11 +100,20 @@ def _http() -> httpx.Client:
     return _client
 
 
-def _fetch(path: str, params: dict[str, str]) -> Optional[Any]:
-    """GET an FMP endpoint and JSON-parse it. ``None`` on any failure.
+# Why a fetch produced no usable payload. ``ok`` means the vendor answered and
+# the body parsed — it says nothing about whether the payload had rows in it.
+# Everything else is a FAILURE to observe, which a caller must be able to tell
+# apart from an observation that legitimately came back empty.
+FetchStatus = Literal["ok", "http_error", "network_error", "bad_json"]
 
-    FMP returns either a list (most endpoints) or a dict (a few).
-    Caller is responsible for shape validation.
+
+def _fetch_status(path: str, params: dict[str, str]) -> tuple[Optional[Any], FetchStatus]:
+    """GET an FMP endpoint and JSON-parse it, reporting WHY it failed.
+
+    ``_fetch`` collapses every failure mode into ``None``, which makes a vendor
+    outage indistinguishable from a legitimately empty answer at every call
+    site. Callers that must not present a fallback as if it were live read the
+    status here instead.
     """
     try:
         response = _http().get(f"{_FMP_BASE}{path}", params=params)
@@ -114,19 +124,28 @@ def _fetch(path: str, params: dict[str, str]) -> Optional[Any]:
         if not ok:
             # 401 (bad key), 403 (above tier), 429 (rate limit), 5xx — fail closed.
             logger.warning("fmp %s returned HTTP %s", path, response.status_code)
-            return None
+            return None, "http_error"
         text = response.text
     except (httpx.HTTPError, OSError, ValueError) as exc:
         from ..vendor_usage import record_vendor_call
 
         record_vendor_call("fmp", ok=False)
         logger.warning("fmp %s fetch failed: %s", path, exc)
-        return None
+        return None, "network_error"
     try:
-        return json.loads(text)
+        return json.loads(text), "ok"
     except json.JSONDecodeError as exc:
         logger.warning("fmp %s response was not valid JSON: %s", path, exc)
-        return None
+        return None, "bad_json"
+
+
+def _fetch(path: str, params: dict[str, str]) -> Optional[Any]:
+    """GET an FMP endpoint and JSON-parse it. ``None`` on any failure.
+
+    FMP returns either a list (most endpoints) or a dict (a few).
+    Caller is responsible for shape validation.
+    """
+    return _fetch_status(path, params)[0]
 
 
 def _as_int(raw: object) -> Optional[int]:
@@ -676,6 +695,42 @@ def fetch_quote(symbol: str) -> dict | None:
     return fetch_quotes([sym]).get(sym)
 
 
+# Sanity window for a vendor-supplied epoch. Anything outside it is a bad field,
+# not an observation — we drop it rather than publish a nonsense instant.
+_MIN_PLAUSIBLE_EPOCH_S = 631_152_000.0  # 1990-01-01Z
+_MAX_PLAUSIBLE_EPOCH_S = 4_102_444_800.0  # 2100-01-01Z
+
+
+def _vendor_epoch_to_iso(raw: object) -> Optional[str]:
+    """Vendor observation epoch -> ISO-8601 UTC instant, or ``None``.
+
+    FMP quote rows carry ``timestamp`` (epoch seconds) — that is the vendor's
+    own claim about WHEN the price was observed, and it is the only honest
+    value for an ``as_of``. ``None`` is returned for a missing, unparseable, or
+    implausible field. We never substitute ``now()``: the fetch instant is when
+    WE asked, not when the market printed, and a fabricated observation time is
+    worse than a missing one.
+    """
+    if raw is None or raw == "":
+        return None
+    try:
+        val = float(raw)  # type: ignore[arg-type]
+    except (TypeError, ValueError):
+        return None
+    if val != val or val in (float("inf"), float("-inf")):  # NaN / inf
+        return None
+    # Some vendor rows carry milliseconds. Only a value far past the plausible
+    # SECONDS ceiling can be ms, so this never mis-scales a real seconds epoch.
+    if val > _MAX_PLAUSIBLE_EPOCH_S:
+        val = val / 1000.0
+    if not (_MIN_PLAUSIBLE_EPOCH_S <= val <= _MAX_PLAUSIBLE_EPOCH_S):
+        return None
+    try:
+        return datetime.fromtimestamp(val, timezone.utc).isoformat()
+    except (OverflowError, OSError, ValueError):
+        return None
+
+
 def _row_to_quote(symbol: str, q: dict) -> dict | None:
     last = _as_float(q.get("price"))
     if last is None:
@@ -686,6 +741,10 @@ def _row_to_quote(symbol: str, q: dict) -> dict | None:
         "close": _as_float(q.get("previousClose")), "change": _as_float(q.get("change")),
         "change_pct": (cp / 100.0) if cp is not None else None,
         "volume": _as_float(q.get("volume")), "iv_rank": None, "hv_30": None,
+        # The vendor's observation instant, ISO-8601 UTC — ``None`` when this
+        # row carried none. A price without a time it was true is not a fact a
+        # consumer can act on, so it travels WITH the price or not at all.
+        "as_of": _vendor_epoch_to_iso(q.get("timestamp")),
     }
 
 
@@ -958,16 +1017,45 @@ def fetch_us_listings(include_etfs: bool = True) -> list[dict]:
     return list(merged.values())
 
 
-def fetch_etf_holdings(symbol: str) -> list[dict]:
-    """Holdings for one ETF/fund (``/stable/etf/holdings``). [] on failure."""
+# Outcome of a holdings lookup. ``ok`` = the vendor answered with rows;
+# ``empty`` = the vendor answered and legitimately had none. Every other value
+# means we never got an answer at all.
+HoldingsStatus = Literal[
+    "ok", "empty", "no_api_key", "bad_symbol", "http_error", "network_error",
+    "bad_json", "bad_shape",
+]
+
+
+def fetch_etf_holdings_result(symbol: str) -> tuple[list[dict], HoldingsStatus]:
+    """Holdings for one ETF/fund, WITH the reason an empty list is empty.
+
+    ``fetch_etf_holdings`` returns ``[]`` for a 5xx, a timeout, an above-tier
+    403, and a fund the vendor genuinely reports nothing for — four different
+    facts flattened into one. Callers that fall back to curated data must be
+    able to say which happened, so they never present a stand-in as if the
+    live source had spoken.
+    """
     key = _api_key()
     if not key:
-        return []
+        return [], "no_api_key"
     sym = symbol.strip().upper()
     if not sym:
-        return []
-    payload = _fetch("/etf/holdings", {"symbol": sym, "apikey": key})
-    return payload if isinstance(payload, list) else []
+        return [], "bad_symbol"
+    payload, status = _fetch_status("/etf/holdings", {"symbol": sym, "apikey": key})
+    if status != "ok":
+        return [], status
+    if not isinstance(payload, list):
+        return [], "bad_shape"
+    return payload, ("ok" if payload else "empty")
+
+
+def fetch_etf_holdings(symbol: str) -> list[dict]:
+    """Holdings for one ETF/fund (``/stable/etf/holdings``). [] on failure.
+
+    Rows only. Callers that must distinguish a vendor failure from a genuinely
+    empty answer use ``fetch_etf_holdings_result`` instead.
+    """
+    return fetch_etf_holdings_result(symbol)[0]
 
 
 def probe_etf_holdings_access(symbol: str = "SPY") -> dict[str, Any]:
```
