# MISSION - OPS-21 S2: envelope cell writer (P-133)

## What you are building
A hauska-factory rail job that fills the eight buildable-envelope cells in `parcel_record`,
per county per city, for in-city parcels:

    parcelAreaSqFt   buildableAreaSqFt   buildableAreaPct   envelopeStatus
    envelopeDisclosure   maxHeightFt   maxLotCoveragePct   maxFootprintSqFt

S1 (P-132) is MERGED and RUN. Setback cells exist. You consume them.

## WHAT S1 LEARNED - read this, it corrects the dispatch you would otherwise have got

S1 corrected its own dispatch premise twice. Both corrections apply to you.

**1. `@hauska-engine/adapters` is NOT what the live route uses, and neither is importable.**
The live production route (`legacy-design-tools` `brokeragePlaceBuildableEnvelope.ts` ->
`authoritativeSetbackSource.ts`) calls `@workspace/adapters`, legacy-design-tools' OWN local
package - a separate, already-diverged fork (3-arg signature vs 2) in a different repo. Both
are private workspace packages and neither can be imported from hauska-factory.

**Use `@empressaio/setback-corpus`** - the actual published single source of truth, which
NEITHER repo has repointed onto yet and which is MORE complete than either local copy (29
jurisdictions). S1 vendored its routing logic as a faithful port with file/line citations.
Do the same rather than inventing a second approach, and cite S1's port.

**2. Fifteen cities, not seven.** The dispatch that went to S1 named 7 CTX cities with ruled
tables. The corpus carries 29 jurisdictions, 15 with real in-city populations across the five
in-scope counties. S1 processed 64 cities, 15 with a ruled table.

## STANDING FACTS

- **IN-CITY ONLY.** `UNINCORPORATED_NOT_APPLICABLE_RAIL_KEYS` already writes `not-applicable`
  on these rails at row creation for unincorporated parcels. Do not touch those cells.
- **HAYS (48209) IS EXCLUDED.** P-145 has not landed. Filling Hays cells on a broken key
  writes wrong values faster. S1 excluded it; you exclude it. Five counties: 48021, 48055,
  48309, 48453, 48491.
- **Your hard dependency is `zoningDistrict`, and it is not yours.** S1's residual is exactly
  3,376 parcels x 5 rails, every one blocked because its `zoningDistrict` cell is not yet
  `value` or `refused`. That rail is owned by `parcel-r5-zoning.mjs`, a different job the S1
  dispatch never named. You will hit the same wall on the same parcels. Do not fix that rail;
  defer those parcels and report the count.
- **Dry-run gotcha S1 paid for:** a ruled city's dry-run preview must READ `zoningDistrict`
  from the FACTORY store (unlike `parcel-r5-zoning.mjs`, whose inputs are cortex-only), so the
  factory connection has to be open even when `apply=false`. S1 caught this locally before
  deploy. Open it unconditionally.
- **Geometry Law.** `txgio_parcel` is THE truth frame the envelope is constructed from,
  verified against, and served on. BCAD is a divergence-reporting instrument only; it never
  silently substitutes as the working ring
  (`_decisions/2026-08-07_envelope_saga_close_and_geometry_law.md`).
- **`computeTier1Envelope` is the vacuous function this whole program was opened over.** It
  returns `declined` on BOTH branches and cannot produce a value. Do NOT try to make it work
  and do not route through it. You write cells.
- **`place_key` is RAW** `{county_fips}:{prop_id}`. Do not normalize.
- Cells live in `parcel_record_cell` in `neondb`. Atoms are a different database; no join.

## A LIVE DEFECT S1 FOUND THAT YOU MUST NOT PROPAGATE

`legacy-design-tools`' local `round-rock-tx.json` - what its live production route serves
today - **disagrees with the published `@empressaio/setback-corpus`** on `side_corner_ft` for
EVERY district, and on SF-3's `side_ft`/`rear_ft`. SF-1 side_corner: LDT 5 ft vs corpus 30 ft.
SF-3: LDT side 5 / rear 10 vs corpus side 12 / rear 15.

S1 served the corpus numbers for Round Rock's 27,330 value-state parcels. **Your envelope
areas for those parcels will be computed from the corpus setbacks, which may differ from what
the live map shows today.** That is a known, recorded, cross-repo inconsistency (OPS-21
register). Do not "reconcile" it by switching sources. Use the corpus, and report every city
where your inputs differ from LDT's local table so the divergence set is countable.

## Completion predicate
`unaccounted` count for the eight envelope rails on in-city parcels in the five in-scope
counties equals 0, with deferred parcels (those blocked on `zoningDistrict`) reported
separately and arithmetically reconciled against the denominator - S1's close is the format
to copy: value + absent-verified + refused + deferred == denominator, exact, no remainder.

`node scripts/plan-progress.mjs --sql` in doc_repo for the exact query. Note the S2 predicate
covers all six counties; Hays will stay 100 percent unaccounted and that is correct.

## Out of scope
Setback cells (S1, done). The gate and the slate (S4/P-135 - your cells do not serve until
that lands, and that is expected). Hays. `parcel-r5-zoning`. Fixing `computeTier1Envelope`.
Reconciling the Round Rock table divergence.
