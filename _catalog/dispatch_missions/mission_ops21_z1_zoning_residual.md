# MISSION - OPS-21 Z1: resolve the zoningDistrict residual that gates eight rails (P-147)

## Why this lane exists

**One dependency gates eight of nine written rails across all five counties.** Two lanes
established it independently:

- S1 (P-132) from the write side: its residual is exactly 3,376 parcels x 5 rails, and every
  one of those parcels has a `zoningDistrict` cell not yet `value` or `refused`.
- S4 (P-135) from the verdict side: the eight failing rails share identical per-county
  unaccounted counts — **44 / 26 / 1,014 / 1,021 / 1,271** — summing to exactly 3,376.

Two derivations, one number, to the parcel. Clear it and eight rails become gate-eligible in
one move. **Do not clear it by relabelling.**

## STEP 1 IS CHARACTERISATION, NOT A RUN. Report before you apply anything.

The 3,376 are not one population. `parcel-r5-zoning.mjs`'s own header names at least four ways
a parcel stays unresolved, and they need completely different answers. Break the 3,376 down and
report the counts:

1. **In a city the completeness declaration does NOT cover.** A polygon miss stays
   `unaccounted` exactly as before. The header names **Elgin** as the holder — "which is what
   holds Elgin, and through Elgin holds Bastrop and Travis."
2. **In one of the five `STAMP_GAP_EXCLUDED_CITY_KEYS` cities** — staged layer exists but the
   legacy stamp tool shows zero citywide. Excluded by a hardcoded list, deliberately, not by
   omission.
3. **Already `not-applicable`** — S1 described part of the residual as "a pre-existing
   cross-system `not-applicable` drift." **Characterise this, do not assume it is a defect.**
   If a parcel's `zoningDistrict` is legitimately `not-applicable` (declared-complete city,
   genuine unzoned land), then its setbacks are arguably `not-applicable` too rather than
   deferred — which would be a finding about S1's deferral rule, not about this job. Report it
   either way; do not fix S1's writer from here.
4. **Genuinely stampable** — unaccounted, in a covered city, with a staged polygon that should
   match. These are the ones this job can actually move.

Only bucket 4 is yours to apply. Report 1, 2 and 3 with counts and a named reason each.

## HARD PROHIBITION

**Do not add a city to `src/config/zoning-layer-completeness.mjs` to clear this gap.** A
completeness declaration is a falsifiable claim about a specific layer version, backed by two
independently derived measurements (`cellPct` from `parcel_record_cell`, `arealPct` from
PostGIS against `tx_city_boundary`) taken from different upstreams. Declaring a city to make a
number go down is the relabelling failure the tripwire exists to catch, and it would convert
`unaccounted` into a fabricated `not-applicable` on real parcels.

If a city genuinely warrants declaring, say so with both measurements and route it as a
separate card. It is not this lane's to write.

## STANDING FACTS

- **The job only UPDATEs a cell currently `kind='unaccounted'`.** It never INSERTs — every
  parcel already carries its full 65-rail shape — and never writes `absent-verified`.
- **Spatial join is keyed strictly by CITY polygon, never by county.** That is deliberate: the
  legacy LDT stamp tool scopes its UPDATE by county only and produced the confirmed
  Waco/Austin/Pflugerville bleed defect (`zoning-stamp-db.ts stampCountyZoning()`). Do not
  loosen it.
- **Two stores, no SQL join.** `PRODUCTION_NEONDB_URL` (cortex) holds
  `landing_parcel_jurisdiction`, `txgio_parcel`, `tx_zoning_district_staging`;
  `FACTORY_DATABASE_URL` holds the `parcel_record_cell` rows you write. The spatial match runs
  on cortex, results batch in application code, only the write is a Factory UPDATE. S4 resolved
  that `parcel_gate_verdict` is on the FACTORY host too.
- **Hays (48209) is excluded.** P-145 has not landed.
- Factory main is green at `711cc06` with `_LDT_SHA` at `cebd041d`.

## What "done" looks like

Not "3,376 becomes zero." It very likely cannot, because buckets 1 and 2 are structural.

**Done is: every one of the 3,376 carries a named disposition, and bucket 4 has been applied.**
Then re-running `factory parcel-setback-cells --apply` and `factory parcel-envelope-cells
--apply` — no code changes in either, both writers ask nothing more of the world — continues
closing the eight rails automatically.

Report the post-apply count per county so S4's successor can re-read the verdict grid against a
real number rather than an estimate.

## Completion predicate

`unaccounted` count for `zoningDistrict` on in-city parcels in the five in-scope counties,
before and after, with the delta attributed by bucket. Every parcel not moved carries a reason
from bucket 1, 2 or 3. Zero parcels unaccounted-for in the accounting sense, which is different
from zero parcels `unaccounted` in the cell sense — say which you mean in every number you
report.

## Out of scope
Declaring any city complete. Fixing S1's deferral rule. Re-running the setback or envelope
writers (that is the follow-on, and it needs no code). Hays. The five stamp-gap cities'
underlying layer problem. `parcelRecordAllowlist.ts` or anything in legacy-design-tools.
