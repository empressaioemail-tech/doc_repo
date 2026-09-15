# P-205 / P-210 — coverage-source CONTRACT for the follow-on hauska-engine lane

Written by the `p205-coverage-refusal` lane per operator direction (2026-09-14): "produce, as
part of your close, the CONTRACT you need from that endpoint: exactly what it must return, at
what freshness, and what your code does when it is unavailable." This is that document. It is a
CONTRACT for the endpoint the follow-on lane builds, not a description of anything that exists
today — nothing at the URL below responds yet.

## Why a per-query CHECK endpoint, not a roster endpoint

CP2 (`_inbox/2026-09-14_p205-coverage-refusal_cp2.json`) recommended a roster endpoint (`GET
/counties`, `SELECT DISTINCT county_fips FROM parcel_gate_verdict`). Building the LDT-side client
against that recommendation surfaced a second, independent gap CP2 did not hit: **this repo has no
way to resolve an arbitrary address's county FIPS at all.** `grep` across
`artifacts/api-server/src/lib/` for a ZIP-to-county or city-to-county crosswalk (ZCTA, TIGER,
Census Place) returns nothing. `find_parcel`'s zero-hit path (Killeen, Bell County 76541 included)
never determines a county — it only ever ATTEMPTS a match against `txgio_parcel`/`txgio_address`
and, on failure, has no county to report. A roster-only endpoint would still leave this lane unable
to ask "is Killeen's county in the roster" without ALSO building a ZIP/city-to-FIPS table — which
would itself decay exactly like the hand-maintained county lists P-205's dispatch already names as
the anti-pattern to avoid (a static crosswalk table nobody re-derives when TIGER/Census data
updates).

So this CONTRACT asks the endpoint to accept the LOCALITY SIGNAL and resolve county AND coverage
together, server-side. `hauska-engine`/`retrieval-api` already has direct Postgres access to
Factory data (per CP2's own recommended query) and is a more defensible place to own geo-resolution
than a second, LDT-vendored copy of the same crosswalk problem.

## Endpoint

    GET /parcel-record-gate-verdict/coverage/check?city=<CITY>&state=<ST>&zip=<ZIP>

Same base-URL/auth convention already established by `fetchGateVerdict`/`fetchParcelRecord`
(`parcelRecordReaderClient.ts`): `HAUSKA_RETRIEVAL_API_URL` / `RETRIEVAL_API_URL` /
`BRIEF_RETRIEVAL_API_URL` for the base, `Authorization: Bearer <HAUSKA_RETRIEVAL_API_KEY /
RETRIEVAL_API_KEY / BRIEF_RETRIEVAL_API_KEY>`. At least one of `city`/`state`/`zip` is always
present when LDT calls (the client short-circuits locally otherwise — see "What LDT does" below).

### Response body — exactly one of three shapes

```jsonc
// A real, positive answer: this locality resolves to a county in the canonical coverage set.
{ "status": "covered" }
```

```jsonc
// A real, positive answer: this locality resolves to ONE specific Texas county, and that
// county is confirmed absent from the canonical coverage set.
{ "status": "not-covered", "countyFips": "48027", "countyName": "Bell", "state": "TX" }
```

```jsonc
// The endpoint could not produce either of the above — e.g. the locality is ambiguous (a ZIP
// spanning two counties), out of Texas, unparseable, or the canonical coverage set itself
// (P-210) is not yet decided.
{ "status": "indeterminate", "reason": "human-readable, logged verbatim by the caller" }
```

`not-covered` MUST carry all three of `countyFips`/`countyName`/`state`. LDT's client
(`placeCoverageSource.ts`) treats a `not-covered` body missing any of the three as
`indeterminate` rather than guessing — see "What LDT does" below.

### Freshness

Cacheable. `parcel_gate_verdict`/`parcel_record` membership changes only on a Factory publish
(county onboarding is not a high-frequency event), so a short-TTL cache (CP2 suggested a few
minutes) is correct and expected. LDT does not depend on sub-minute freshness; it depends on the
endpoint never claiming `covered`/`not-covered` from a STALE or WRONG source (see next section).

### The open dependency this endpoint's correctness rests on: P-210

P-210 (carded 2026-09-14, operator ruling pending) found THREE disagreeing candidate definitions
of "covered": the `txgio_parcel`/`txgio_address` index (proven broader — a real hit in Bexar
48029, not a serving-ledger county), the SERVING path (`get_smart_site` on that same Bexar parcel
returns a full card — situs, zoning, flood all present — while Bexar is in neither `parcel_record`
nor `parcel_gate_verdict`), and the Factory ledger (`parcel_record`/`parcel_gate_verdict`, six
counties as of 2026-09-14). This endpoint's `covered`/`not-covered` answer is only as correct as
whichever set the operator rules canonical. Until that ruling lands, this endpoint should not be
built against a guessed answer — build the shape, wire it to `indeterminate` for everything, and
switch the backing query once P-210 is decided. LDT's client does not care WHICH set backs the
endpoint; it only cares that the endpoint's `covered`/`not-covered` claims are true.

## What LDT does with each answer (already built, already tested)

`artifacts/api-server/src/lib/placeCoverageSource.ts` + the `resolveCoverageMiss` branch in
`txgioAddressResolve.ts`'s `searchPlaceByPrefix`:

| Verdict | `find_parcel` response |
|---|---|
| `covered` | `{ hits: [], missClass: "no-hit" }` — unchanged from today. |
| `not-covered` | `{ hits: [], missClass: "county_out_of_coverage", outOfCoverageCounty: {countyFips, countyName, state} }` — the actual P-205 fix. |
| `indeterminate` (any reason, including "no source configured" / network failure / malformed body / the source throwing) | `{ hits: [], missClass: "coverage_check_unavailable", coverageCheckUnavailableReason }` |
| no locality signal parsed at all | `indeterminate` returned locally, WITHOUT a network call |
| no API key configured | `indeterminate` returned locally, WITHOUT a network call |

This is unconditional: there is no code path in `resolveCoverageMiss` that reaches `no-hit` or
`county_out_of_coverage` without an explicit, well-formed verdict saying so. A component that
throws, times out, 404s, or answers with a malformed body all collapse to the SAME
`coverage_check_unavailable` decline — never a silent `no-hit`, never an assumed `covered`. This
was the operator's explicit, unconditional constraint (2026-09-14) and is proven by seven
violation tests in `placeCoverageSource.test.ts` and `txgioAddressResolveCoverage.test.ts`
(network error, non-200, malformed body, incomplete not-covered body, a throwing source, no
locality signal, no API key — each independently proven to decline, never claim).

## Known consequence of shipping this today, stated plainly for the deploy decision

Until this endpoint exists and is configured, EVERY zero-hit `find_parcel` query anywhere in
Texas — including inside the six already-onboarded counties — returns `coverage_check_unavailable`
instead of today's plain `no-hit`. This is the direct, literal consequence of the operator's
fail-closed ruling ("a stub that defaults open is worse than today's bug, because today's bug is
at least visible") and is a deliberate, honest trade: a genuine miss in Bastrop today reads as "I
could not confirm this county is covered" rather than a clean miss, until the endpoint above is
live. It is NOT a claim that the address is missing, and it is NOT the customer-facing name for
what is happening today (that still needs a `hauska-atom-contract` vocabulary entry — see below).
**This is why deploy for this change is called out separately from merge in this lane's close: the
code is ready to merge; whether to deploy it before the endpoint exists is the operator's call, not
this lane's.**

## Second, smaller follow-on this contract also names: the vocabulary

`missClassDisplayText()` (`artifacts/smartsite-mcp/src/tool-honesty.ts`) throws if a `missClass`
has no row in `@empressaio/atom-contract/display`'s `VOCABULARY` — deliberately, "a closed
missClass with no display row is a defect in this package, not a value to paper over." Both new
tokens ship WITHOUT calling that function (matching `no-hit`/`located-unbound`'s existing
"unenriched" precedent) specifically to avoid that crash, since neither token exists in the shared
package yet and this lane does not own it. Recommended entries for whoever picks up that package:

- `coverage_check_unavailable` — displayText e.g. "Coverage could not be checked"; meaning e.g.
  "find_parcel missClass: no coverage source could confirm or deny that this county is in Smart
  Site's serving ledger for this query. Not a claim that the address is missing or that the county
  is uncovered — only that the check itself could not run."
- `county_out_of_coverage` — displayText e.g. "Outside Smart Site's county coverage"; meaning e.g.
  "find_parcel missClass: a real coverage answer confirmed this county is not yet in Smart Site's
  serving ledger, though the query resolved to a covered state. The honest county-level analogue of
  `out_of_coverage` (which is state-level). See `outOfCoverageCounty` for the named county."

A bespoke `agentGuidance` function for each (mirroring `outOfCoverageAgentGuidance` in
`tool-honesty.ts`) should be written alongside those entries; not written here since the tokens
are not enriched yet and there is nothing to guide an agent about until the vocabulary exists.
