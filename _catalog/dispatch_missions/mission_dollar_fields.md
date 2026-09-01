# Mission — the CAD dollar fields exist everywhere and serve nowhere

## The finding

`CAD-SERVE-RECONCILE` scanned **100 percent of `place_layer_snapshots` across all six
counties**, Travis and Williamson included. Every CAD dollar, living-area, year-built,
legal and `cadRoll` key is **0 of N**. `cad_property` holds them on 89 to 99 percent of
parcels.

| field | 48021 | 48055 | 48209 | 48309 | 48453 | 48491 | bake |
|---|---|---|---|---|---|---|---|
| marketValue | 77,164 | 48,588 | 154,313 | 113,360 | 494,364 | 590,644 | **0** |
| landValue | 77,135 | 48,587 | 172,564 | 113,322 | 492,848 | 319,480 | **0** |
| improvementValue | 56,357 | 48,451 | 159,129 | 91,048 | 492,848 | 319,480 | **0** |
| assessedValue | 15,542 | 48,382 | 265,852 | *0 at source* | 492,848 | 319,480 | **0** |
| legalDescription | 77,166 | 48,588 | 172,804 | 113,326 | 494,364 | 602,034 | **0** |
| exemptionCodes | 3,091 | 13,746 | 171,019 | *0 at source* | 257,146 | 236,149 | **0** |

**This is plumbing, not acquisition.** LDT `#575` (`1d19eb90`) merged the bake reader; the
bake has never run with it. This is the largest single win on the board — roughly two and a
half million cells that already exist and reach no user.

## Read `cad_property`. Never the roll atoms.

**This is the constraint the card lives or dies on.**

The `cad-parcel-roll` atoms are **hollow** in three counties — Hays 265,881, Travis 492,851
and Williamson 319,487 bodies carry almost no claim keys, with 29 / 3 / 7 leftovers. A bake
that reads atoms starves those three counties.

**And in Bastrop the atoms invent coverage `cad_property` does not have:**

| | atoms | `cad_property` |
|---|---|---|
| livingAreaSqft | 40,602 | **8,712** |
| assessedValue | 77,053 | **15,542** |
| improvement `$0` | 26,553 | **6,158** |

Eight sampled Bastrop parcels with atom living area 884 to 2,184 have
`cad_property.living_area_sqft` **null**. Reading atoms would ship numbers with no source.

`cad_property` is dense and the bake already copies situs from it — Bastrop 74,820 = 74,820,
McLennan 114,255 = 114,255. Use that path.

## Stored zeros are real values and they differ per county

**Caldwell carries 24,552 real `$0` improvement values in `cad_property`; Bastrop 6,158.**
Those are vacant land, not missing data. The `CadRollZeroWire` shape already has a `zero`
state distinct from absent — use it.

The 26,553 figure the planner has quoted for Bastrop `$0` improvements is **the atom count,
not the CAD count**. Do not carry it forward.

`living_area_sqft` has **zero stored zeros in every county**, so it is null-or-positive and
needs no zero handling.

## What is NOT a pipeline gap, and must not be "fixed"

**McLennan `assessedValue` is 0 of 114,255 at source**, and McLennan already serves
`absent-verified` with a CAD-null basis. That is correct output. Same for McLennan
`exemptionCodes`, `land_acres`, `yearBuilt`, and Travis and McLennan `livingAreaSqft`
(0 of 500,307 and 0 of 114,255).

**Those are source gaps and belong to acquisition, not to this card.** Filling them here
would mean inventing values.

## A provenance defect to fix while you are in here

Hays gold `48209:135570` serves year 2018 and living area 2,444 that **match
`cad_property`**, while `structuralFact` claims the source is `cad-parcel-roll` — and those
atoms are hollow.

**That is wrong provenance on a correct number**, which is more dangerous than a wrong
number, because it survives every value check and points an auditor at the wrong store. Fix
the claimed source to what actually supplied the value.

Note also that `livingAreaSqft` already reaches some live golds through the HTTP overlay
(Caldwell 972, Hays 2,444, Williamson 842) while the bake row carries nothing. **Two paths
disagree.** Say which one Wave R publishes and whether the overlay should survive.

## Verify

**Per county, per field: bake key count goes from 0 to the `cad_property` population**, and
the difference is explained. Not "more than zero" — the expected number, or a stated reason
it differs.

**Then the live wire**, because a bake row and a rendered card are not the same thing:
`buildableAreaPct` 56.1 sits on the wire today while the card prints `Buildable Not stamped
here`. Report what `48021:34137` shows after the bake.

**And re-check the three hollow-atom counties explicitly.** They are the ones a
wrong-source implementation would starve while reporting success.

## Do not

- Do not read `cad-parcel-roll` atoms for these fields.
- Do not collapse a stored `$0` into absent, and do not fabricate a `$0` for a null.
- Do not fill McLennan `assessedValue` or Travis/McLennan `livingAreaSqft`. Those are source
  gaps and the honest output is `absent-verified` with a basis.
- Do not quote 26,553 as a `cad_property` figure; it is the atom count.
- Do not touch any repository other than the registered worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare snapshot
and `current_database()` in the first output. Report per-county per-field bake counts before
and after, the three hollow-atom counties explicitly, the provenance fix, which path Wave R
publishes where bake and overlay disagree, and the live wire for `48021:34137`. Name what
contradicted this card, or say plainly that nothing did. `leave_behind` named. Subagents do
not commit.
