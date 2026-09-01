---
id: 2026-08-31_p91_radius_search_hang_defect
title: place/radius-search hangs until Cloud Run kills it at 300s. Routing and validation are fine; the query is the fault
date: 2026-08-31
status: OPEN. Blocks the `near` half of Q1, which is shipped and non-functional.
severity: high. A shipped feature does not work, and the failure presents as a timeout, which reads as transient when it is not.
owner: property seat (owns artifacts/api-server)
plan_row: P-91
found_by: planner, through an authenticated probe while verifying p565 before shifting traffic
serving_when_measured: cortex-api-00680-vog, digest sha256:5130d91b, from LDT main d0b702ad
---

# The measurement

Authenticated with a Bearer service token against the live route, 2026-08-31:

    GET /place/radius-search?lat=notanumber
      -> HTTP 400, 0.174s
         {"error":"invalid_request","errorClass":"validation_error",
          "message":"lat, lng, and radiusFt are required; cap is optional (1-50); radiusFt max 5280"}

    GET /place/radius-search?lat=30.10592&lng=-97.32528&radiusFt=500
      -> no response; curl gave up at 120s

    GET /place/radius-search?lat=30.10592&lng=-97.32528&radiusFt=50
      -> no response; curl gave up at 60s

    GET /place/street-search?q=Pine St, Bastrop&countyFips=48021   (same token)
      -> HTTP 200 with hits, fast

Cloud Run's own log for the hung request, read from the authoritative record rather than inferred:

    status=504  latency=300.000291573s
    status=400  latency=0.002689710s
    status=401  latency=0.002809680s

# What that isolates, and what it rules out

The route is REACHABLE: the 400 validation path answers in under two tenths of a second, so the router resolves the path and the zod parse runs.

It is NOT auth: `street-search` returns hits with the same Bearer token in the same session.

It is NOT radius size: 50 ft hangs exactly as 500 ft does. A geometry-volume explanation would predict a size gradient and there is none.

It is NOT a cold start: the 400 on the same route is instant, so the container is warm and the process is serving.

What remains is the query path itself, inside `searchParcelsByRadius`, after validation and before any response. It runs for the full 300 seconds and Cloud Run's request timeout kills it.

# Mechanism, and the second mechanism I considered

Most likely: the candidate query does an unindexed or unbounded scan. `RADIUS_SEARCH_CANDIDATE_CEILING = 2000` implies the design expects to bound a candidate set, and if the bounding predicate is not index-backed the ceiling never gets a chance to apply because the scan itself never finishes. That fits size-independence exactly, because a sequential scan costs the same whether the radius is 50 feet or 500.

The second mechanism, and why I did not reject it outright: a lock or a connection wait. Both services currently run UNPOOLED on the direct Neon endpoint under the read-only incident mitigation, so connection behaviour is not in its normal configuration. A query waiting on a connection or a lock would also hang size-independently. I could not distinguish these two from outside the service, and the instrument that would settle it is a `pg_stat_activity` read during a hung request, or an `EXPLAIN` of the candidate query. **Neither was run, and this is therefore an isolation rather than a root cause.** Do not treat "unindexed scan" as established.

# Consequence, live

`near` shipped in p565 and does not function. The MCP bounds its cortex call at 30,000 ms, so a user waits thirty seconds and receives an honestly declared upstream error rather than a hung panel. The feature is dead until this is fixed.

Worth naming because it is a regression in one narrow sense: before p565 the assistant refused a radius ask immediately and correctly, since no read path existed. Now it waits thirty seconds and reports an upstream failure, which reads as a transient fault when the truth is a broken query. Slower, and no more useful, for that one function.

# What would close this

An `EXPLAIN` on the candidate query, and `pg_stat_activity` sampled while a request is hung, which together separate the scan explanation from the wait explanation. Then whichever it is.

When it is fixed, verify by the same instrument that found it: an authenticated call with valid params returning 200 inside a sane latency. Do NOT verify with an anonymous probe. A 401 comes back for a garbage path because auth runs before routing, and an OPTIONS returns 204 for a garbage path because CORS preflight is global. Both were tried here and neither discriminates anything.
