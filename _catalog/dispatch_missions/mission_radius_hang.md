# Mission — root-cause and fix the radius-search hang

`place/radius-search` is SHIPPED AND NON-FUNCTIONAL. Valid params hang until Cloud
Run kills the request at 300s. The MCP planner isolated it rigorously and did not
root-cause it, which was the right place to stop.

**This card carries a candidate root cause the isolation did not name. Verify it
against the live catalog before acting on it. It is a hypothesis from reading the
write path, not a measurement.**

## What is already established, do not re-derive

Route is reachable: `?lat=notanumber` returns HTTP 400 in 0.174s, so the router
resolves and the zod parse runs. Not auth: `street-search` returns hits with the
same Bearer token in the same session. Not a cold start: the 400 on the same route
is instant. Cloud Run's own log, read from the authoritative record:
`status=504 latency=300.000291573s`.

Two mechanisms were offered and neither was separable from outside: an unindexed
candidate scan, or a lock/connection wait. Both services currently run **UNPOOLED**
under the Neon mitigation, so connection behaviour is not in its normal
configuration and the lock/wait arm is confounded until that is cured.

## The candidate root cause

`artifacts/api-server/src/lib/txgioRadiusSearch.ts:222` builds one query:

```
SELECT county_fips, prop_id, situs_address, geometry, west_lng, south_lat, east_lng, north_lat
FROM txgio_parcel
WHERE county_fips IN (<list>) AND west_lng <= ? AND east_lng >= ?
                              AND south_lat <= ? AND north_lat >= ?
LIMIT <candidate ceiling + 1>
```

Three things about it, each verifiable:

**1. The county filter constrains nothing.** `texasCountyFipsList()`
(`txgioAddressNormalize.ts:682`) is `for (let n = 1; n <= 507; n += 2)`, which is
**all 254 Texas counties**. The only index on the table is
`txgio_parcel_prop_idx (county_fips, prop_id)`, and an IN list containing every
value of the leading column has zero selectivity. The one index that exists cannot
help this query.

**2. `txgio_parcel` has no bbox index, and four sibling tables do.** The schema
carries `tx_city_boundary_bbox_idx`, `tx_county_boundary_bbox_idx`,
`tx_fema_nfhl_flood_zone_bbox_idx` and `tx_utility_territory_staging_bbox_idx`, all
`btree (west_lng, south_lat, east_lng, north_lat)`. The exact index this query
needs exists on four smaller tables and is **absent from the largest one**.

**3. It selects `geometry`.** Every candidate row detoasts its ring.

**The size-independence CONFIRMS this rather than ruling it out, and that is the
part worth reading twice.** The defect card treats "50 ft hangs exactly as 500 ft"
as evidence against a volume explanation. Under a full scan it is the *predicted*
result: neither radius comes near the candidate ceiling, so `LIMIT` never
short-circuits, and both scan the entire table for the same cost. A geometry-volume
explanation about the *result set* is correctly rejected. The cost is in the
**scan**, not the result.

## Verify before you fix

**The above was read from `lib/db/src/__tests__/__fixtures__/schema.sql.template`,
which is a TEST FIXTURE and is known to drift from the live catalog in this repo.**
It is a proxy, not the authoritative record.

1. Query the **live catalog** (`pg_indexes` on the serving database) for every
   index on `txgio_parcel`. The template's claim of exactly one index is not
   evidence about production.
2. Run `EXPLAIN (ANALYZE, BUFFERS)` on the candidate query with the real
   parameters from the hung request (lat 30.10592, lng -97.32528, radiusFt 500).
   **Pre-registered falsifier: this should show a Seq Scan on `txgio_parcel` over
   millions of rows. If it shows an Index Scan, this hypothesis is WRONG and the
   lock/wait arm is back. Report that outcome as plainly as a confirmation.**
3. Sample `pg_stat_activity` while a request is hung, which the defect card names
   and nobody has run. It separates a scan (active, high buffer reads) from a wait
   (`wait_event_type` populated) and costs one probe.

Do all three before changing anything. If 2 and 3 disagree, 2 wins for a scan and 3
wins for a wait; if both are ambiguous, say so rather than picking.

## The fix, once confirmed

Two candidates. **Recommend one with reasoning; they are not exclusive.**

**A. Add the bbox index**, matching the four siblings exactly:
`btree (west_lng, south_lat, east_lng, north_lat)`. Smallest change, consistent
with existing convention, and the absence looks like an omission rather than a
decision. Note that four independent range predicates on separate columns use a
btree composite only on its leading column, so measure the improvement, do not
assume it.

**B. Narrow the county first.** A radius search at a lat/lng knows its county.
Resolve it against `tx_county_boundary` (which HAS its bbox index), then constrain
`county_fips` to the one or two counties that matter, which makes the existing
`(county_fips, prop_id)` index selective. Architecturally right: a 50-foot radius
in Bastrop should never consider Amarillo.

B is the better answer if A alone does not produce an index scan, and B is correct
regardless of A.

**Do not raise the Cloud Run timeout. Do not widen the candidate ceiling.** Both
convert a broken query into a slow one that still fails.

## Definition of done

`GET /place/radius-search?lat=30.10592&lng=-97.32528&radiusFt=500` returns a
correct body in a time you state, against the live service, with the plan attached.
A shipped-and-non-functional function becoming shipped-and-slow is not done.

Re-check `radiusFt=50` too: under the current mechanism both hang, and under a
correct fix both must return.

## Do not

- Do not raise the request timeout or the candidate ceiling.
- Do not read the schema template as the live catalog.
- Do not act on the index hypothesis before EXPLAIN confirms it.
- Do not add an index to a production table without a run record naming it.
- Do not touch the Neon pooling posture; that is a separate live incident.
- Do not touch any repo other than the registered LDT worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare
snapshot (repo, branch, commit) in the first output. State the falsifier for each
check before running it. `leave_behind` named. Subagents do not commit.
