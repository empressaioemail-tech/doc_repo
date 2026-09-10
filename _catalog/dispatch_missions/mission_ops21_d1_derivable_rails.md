# MISSION - OPS-21 D1: six derivable rails from data on hand (P-137)

## What you are building
Fill six `parcel_record` rails from data already staged. No acquisition, no new source.

    situsState   acreageSqft   landUseDescription   landUseVintage
    exemptionCodes   citationUrl

## STANDING FACTS
- **`situsState` is already solved once.** CTX-SITUS derived it from `countyFips` after the
  bake read it off the TxGIO join with `?? null` and `cad_property` turned out to have no
  `situs_state` column at all. 312,169 parcels carried a bare null. Reuse that derivation.
- `acreageSqft` derives from `acreageAcres`. Record the derivation in the cell's provenance -
  a derived value is a value, but it must say it is derived.
- `landUseDescription`, `landUseVintage` and `exemptionCodes` are columns `cad_property`
  carries. The engine's `owner-fact-writer.ts` already reads `exemption_codes`; confirm the
  column against the live table before writing rather than inferring it from that reader.
- **Do not write a value you cannot source.** Any of these six not actually present in
  `cad_property` for a county becomes `absent-verified` with a scope naming the column that
  was searched. Never a fabricated default.
- Context while you are in this code: statewide, `situs_address IS NOT NULL` gives 99.45
  percent and carries-a-street-segment gives 89.90 percent. Bastrop serves the literal
  `", ,"`; Travis serves `", TX 78756"`. Presence is not population.

## Completion predicate
`unaccounted` count for those six rails across the six CTX counties equals 0.

## Out of scope
`situsAddress` itself - CTX-B6 owns it. Hays - P-145 lands first.
