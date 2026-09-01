---
title: livingAreaSqft exists at source for four of six CTX counties; Travis and McLennan have zero
last_updated: 2026-09-01
status: active
---

# Does the bake have living area to serve?

Measured 2026-09-01 against `cad_property` on cortex-prod (`PRODUCTION_NEONDB_URL`), one
read-only query, credential from GCP Secret Manager and never displayed.

## Two separate questions

**Is the plumbing there?** Yes. LDT `#575` (`1d19eb90`) touched
`artifacts/api-server/src/lib/nodeFacetBakeTier1Conformant.ts`, the bake reader, along with
`cadRollValue.ts`, `nodeFacetTier1Assemble.ts`, `parcelDrawFromReads.ts` and
`twinOnRecordSerialize.ts`. The capability inventory records `livingAreaSqft` as sourced
from `cad:property`, previously served on the brief path only, with `#575` adding the bake
reader and the draw attribute.

**Is the data there?** Only for four of six, and not evenly.

## Per-parcel coverage at source

`count(distinct prop_id) filter (where living_area_sqft > 0)` over `cad_property`:

| county | parcels | with living area | pct |
|---|---|---|---|
| 48021 Bastrop | 77,799 | 8,712 | **11.2%** |
| 48055 Caldwell | 48,649 | 13,487 | **27.7%** |
| 48209 Hays | 173,050 | 93,973 | **54.3%** |
| 48309 McLennan | 114,255 | **0** | **0.0%** |
| 48453 Travis | 500,307 | **0** | **0.0%** |
| 48491 Williamson | 602,050 | 245,591 | **40.8%** |

`living_area_sqft` is `integer`. **Stored zeros are zero everywhere** — every value is
either null or positive — so this field has none of the zero-versus-absent ambiguity that
bit the CAD value fields. Judge it as present or null and nothing else.

## What this means for the bake

Where the data exists, the bake will serve it. Where it does not, the correct output is
**`absent-verified` with a basis**, not the blank-no-state the gold probe found today.

**That distinction is the whole point and the bake fixes it either way.** Blank-no-state is
indistinguishable from "we never looked". After the bake, a Travis parcel should say living
area is not published by this CAD source — which is true, checkable, and honest — rather
than showing nothing.

**So "will it land with the bake" is yes for the defect and partly for the value.** The
defect is the missing state; the value is missing at source for two counties and most
parcels in two more.

## Travis and McLennan are a source gap, not a pipeline gap

Zero of 500,307 and zero of 114,255. That is not a writer bug, a scoping error, or a bake
omission — the column is empty for those counties. Acquiring it is CAD acquisition work and
belongs on a different card than anything in the current bake chain.

Travis being the largest county in the program makes this worth naming before Wave R rather
than discovering it in a walk.

## Caveats on this measurement

**One ad-hoc instrument, run once.** The column was confirmed to exist in
`information_schema` before counting, and `current_database()` resolves through the
production secret, but this has not been run against a known violation. Treat the shape as
established and any single number as re-measurable.

**`cad_property` parcel counts do not match the containment parcel counts** and are not
expected to: Bastrop is 77,799 here against 62,256 in `landing_parcel_jurisdiction`, and
Williamson 602,050 against 282,570. Different sources, different populations. Do not divide
one by the other or treat either as the county's parcel count without saying which source
it came from.
