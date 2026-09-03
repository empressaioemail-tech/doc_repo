---
title: PE refusal-contract split — layer-absence chips vs bare atom-miss
date: 2026-09-03
status: finding
---

# PE refusal-contract split: two honest-absence shapes, one richer than the other

Triggered by inspecting a live Property Explorer brief for 5833 Taylor Draper Cv
(Travis, APN 367134, parcel node `48453:367134`), which showed a chip-carrying
absent-verified row for Living Area next to bare-text `atom-miss` rows for Footprint
and Boundary on the same card. Traced against `origin/main` (local checkouts of
`hauska-map` and `legacy-design-tools` were both stale/behind and not used for any
conclusion below).

## The two contracts

**1. Doc-19 layer-absence provenance (`chipsForLayerAbsence`, `apps/property-explorer/src/browse/InspectCard.tsx:602-613`).**
Renders four chips — authority / scope / asOf / basis — from an optional
`layerAbsence: LayerAbsenceProvenance` field carried on every `CardFacet`
presentation state (`InspectCard.tsx:286-318`). This is what Living Area shows:
"CAD row present but structural fields (living_area_sqft, year_built) are null,"
with authority/scope/asOf/basis all populated. Living Area is served off the CAD
structural-fact path, which is typed to populate this object.

**2. Bare atom-miss refusal (per-family Fact-Read modules, `legacy-design-tools/artifacts/api-server/src/lib/`).**
`boundaryEdgeFactRead.ts`, `buildingFootprintFactRead.ts`, `wellFactRead.ts`,
`floodHazardFactRead.ts`, `specialDistrictFactRead.ts`, `pipelineFactRead.ts`, and
`ownerFactRead.ts` each define their own refusal union, e.g.
`BoundaryEdgeFactRefusal = { state: "refused", code: "atom-miss" | "bind-conflict" |
"atoms-store-not-configured" | "malformed-atom", source, tried, reason }`
(`boundaryEdgeFactRead.ts:160-170`). None of these refusal types has an
authority/scope/asOf/basis field. It is not that the chips are omitted for these
rows — the type they're built from structurally cannot carry them. `reason` is a
free-text string; `chipsForLayerAbsence(undefined)` returns `[]` and the row falls
back to its plain `wouldBeFilledBy` sentence (`InspectCard.tsx:543-550`).

## Why this is a finding, not a defect

Both contracts are honest and fail-closed — neither fabricates a value on a miss,
and `atom-miss` is a deliberately named, typed refusal (see `boundaryEdgeFactRead.ts`
header: "Miss on both is a typed refusal that names the prefixes, never a silent
null and never a copied GIS outline"). The gap is legibility, not correctness: one
absence names who looked, where, when, and why; the other names only that a lookup
against one specific store came back empty. Against structural commitment 1 ("every
output carries reasoning chain, source citation, confidence score, timestamp"), the
atom-miss shape is the weaker of the two, and it currently covers seven fact
families (well, flood, special district, pipeline, footprint, boundary, owner) —
most of the atoms-store-backed rows on the card.

## Coverage ground-truth pulled while investigating (verified live 2026-09-03)

Query surface: `ATOMS_DATABASE_URL` / `hauska_mcp`, via `psql`.

```
select count(*) from atoms where entity_type='property-boundary-edge' and entity_id like '48453:367134%';  -> 0
select count(*) from atoms where entity_type='building-footprint'    and entity_id like '48453:367134%';  -> 0
select count(*) from atoms where entity_type='property-boundary-edge' and entity_id like '48453:%';        -> 0   (all of Travis County)
select count(*) from atoms where entity_type='building-footprint'    and entity_id like '48453:%';        -> 0   (all of Travis County)
select left(entity_id,5), count(*) from atoms where entity_type='property-boundary-edge' group by 1 order by 2 desc limit 20;
  -> 48021 | 26846   (single row returned — Bastrop, and nothing else, statewide)
```

`property-boundary-edge` atoms exist only in Bastrop County (48021), 26,846 rows,
confirmed zero everywhere else in the store. The equivalent statewide breakdown for
`building-footprint` could not be completed live (the aggregate query timed out
twice at 25s and 85s under current write load — a read-under-writer-load condition,
not a conclusion in itself); the exact-parcel and exact-Travis-County counts came
back clean at zero. Writer script names (`boundary-primitive-bastrop-downtown-scrub.mjs`,
`bastrop-batch-bulk-prefetch.mjs`) are consistent with building-footprint also being
Bastrop-pilot-scoped, but that is inference from naming, not a verified count, and
is stated here as exactly that.

## Related, and correctly unaffected

Setback values (front/side/rear/corner feet) on the same card are sourced entirely
separately, from a zoning-district setback table (`fact-sheet-resolver.ts:1083-1112`,
`source: "setback-table"`), never from `boundaryEdgeFactRead`. They render correctly
on parcels with zero boundary-edge atoms. Only the derived Buildable envelope
(`envelopeValue`, same file, `method: "setback-inset"`) needs boundary/geometry and
correctly declines ("not stamped") when it is absent, rather than fabricating one.

## Leave-behind

- item: give the seven atom-miss-shaped refusal types (well, flood, special
  district, pipeline, footprint, boundary, owner) a path to populate
  `layerAbsence` (authority/scope/asOf/basis) so their honest absences read as
  legibly as Living Area's, or make an explicit, documented ruling that atom-family
  misses are allowed to stay a lower-richness tier than CAD-structural absences.
  owner: property. plan_row: none named yet — this is a finding, not a scoped card.
- item: re-attempt the statewide `building-footprint` county breakdown outside
  writer-load hours to confirm or correct the Bastrop-only inference.
  owner: property.
