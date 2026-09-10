# MISSION - OPS-21 S1: setback cell writer (P-132)

## What you are building
A new hauska-factory rail job that fills the 4 setback scalar cells plus the
`setbackRules` companion in `parcel_record`, per county per city.

## STANDING FACTS - read these, do not re-derive them
- **The root cause you are fixing.** `computeTier1Envelope` (LDT `nodeFacetBakeTier1.ts:92`)
  has TWO return branches and BOTH are `status:"declined"`. It cannot return a value for any
  parcel, ever. `write-setback-city.mjs:95` throws `SETBACK_APPLY_HELD` on `--apply` and has
  no live parcel loader. Setbacks have had no write path to a value since anti-zombie.
- **Do NOT try to lift `SETBACK_APPLY_HELD` or use the atom writer.** Out of scope for this
  lane by operator decision. Cells are written direct from the ruled table.
- **The computation already exists and is correct.** `brokeragePlaceBuildableEnvelope.ts`
  (LDT) resolves district -> ruled table -> setbacks, live in production today for ~20
  jurisdictions. Use `getSetbackTableForZoning` from `@hauska-engine/adapters`. Do not write
  a second resolver.
- **Ruled tables that exist:** austin-tx, bastrop-tx, bastrop-city-tx,
  bastrop-development-code, elgin-development-code, kyle-tx, pflugerville-tx, round-rock-tx,
  san-antonio-tx, waco-tx (plus Utah/Idaho). Inside the six CTX counties that is Austin,
  Bastrop, Bastrop City, Elgin, Kyle, Pflugerville, Round Rock.
- **IN-CITY ONLY.** `UNINCORPORATED_NOT_APPLICABLE_RAIL_KEYS`
  (`src/lib/parcel-record-engine/rail-keys.js`) already writes `not-applicable` on every
  setback rail at row-creation for unincorporated parcels. Do not touch those cells.
- **In-city with no ruled table = `absent-verified` AFTER a probe, NEVER `not-applicable`.**
  `not-applicable` on an in-city parcel is a false claim that the land is unzoned.
  `plan-city-setback.ts`'s own header states this rule; honour it.
- **Identity.** `place_key` is `{county_fips}:{prop_id}` RAW. The engine's `parcelNodeId` is
  the same shape but normalized (`normalizeForJoin` strips leading zeros on all-digit
  tokens). Write cells on the RAW `place_key`; do not normalize.
- Store: `parcel_record_cell` in `neondb`. Atoms live in a different database
  (`hauska_mcp`); a SQL join across the two cannot be written at all.

## Completion predicate - this is what done means, not a close file
`unaccounted` count for `setbackFrontFt|setbackSideFt|setbackRearFt|setbackCornerFt|setbackRules`
on in-city parcels in the six CTX counties, in cities carrying a ruled table, equals 0.
Run `node scripts/plan-progress.mjs --sql` in doc_repo for the exact query.

## Out of scope
Envelope rails (S2 / P-133). Gate and slate (S4 / P-135). Hays - P-145 must land first, so
do not fill Hays cells.
