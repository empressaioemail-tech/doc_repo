---
title: F-11 setback writer scoping — this is not a small writer job
date: 2026-09-05
status: needs operator/Engine-lane ruling before any build starts
lane: ctx-wrapup-factory
related:
  - 90_operations/OPS-19b_ctx_pipeline_wrapup_sprint
  - _inbox/2026-09-05_ledger_serving_audit
---

# F-11 setback writer — scoping finding, not a build

## The ask, as relayed

"Confirmed by your own PR #94 investigation: the `writer-allowlist.mjs` 'f11-setback'
entry is scaffolding for a job that was never built on this branch. Scope and build an
F-11 setback writer for incorporated parcels, matching the pattern of the other
zoning-envelope writers (`parcel-r5-zoning.mjs` is probably the closest analog — same
jurisdiction/geometry join shape, different output rail)."

## What I found before writing any code

`parcel-r5-zoning.mjs`'s pattern works because a **statewide staged table**
(`tx_zoning_district_staging`) already exists: acquire it once, spatial-join every
county against it, done. I checked hauska-engine (`P:/tmp/ctx-wrapup-engine`,
`git log --all | grep -i setback`) for the equivalent statewide setback source before
assuming one exists or building a naive join. **No statewide setback table exists.**

Instead, hauska-engine has a large, mature, **city-by-city hand-onboarded** setback
subsystem — decades of commits (`feat(setbacks): Bastrop per-parcel layer 23...`,
`feat(setbacks): BDC downtown STEP1...`, `feat(registry): Elgin onboarding
foundation...`, `fix(setbacks): Block-13 R22/R25/R26/R27 — fire-code side, split-zone
dominant...`) building setback resolution for **exactly two cities so far**:

- `packages/adapters/src/local/setbacks/bastrop-per-parcel-record.ts` +
  `bastrop-development-code.json` — Bastrop's numbers come from a **live ArcGIS
  FeatureServer query** (`Parcels_One_Click/FeatureServer/23`, a Bastrop-specific
  public endpoint), cross-verified against a hand-transcribed ordinance chart, with
  real business rules on top: split-zone dominant-area resolution (largest-area row
  governs, sliver zones disclosed but don't govern), a `ZoneTypeClass` numeric→district
  code map, fire-code side rules.
- `elgin-development-code.json` — a second city, same shape, own hand-transcribed
  ordinance table.

That's it. **2 of the ~72 cities relevant to the 6-county program** (23 with a real
staged zoning layer + 49 without, per Wave 3 item 3's own finding) have any setback
source built at all, and each one required real, city-specific onboarding work — not
a config entry.

## Why this changes the shape of the task

`setbackFrontFt`/`setbackSideFt`/`setbackRearFt`/`setbackCornerFt` are **scalar**
fields (distinct from the `setbackRules` **companion** rail, which already has a
working atom-ingestion path via `ingestCadOntoRecords`'s sibling function
`ingestAtomsOntoRecords`'s `ENTITY_TYPE_TO_RAIL` map: `"setback-rule": "setbackRules"`
already exists and would populate `setbackRules` automatically if `setback-rule`
atoms exist for a parcel — I did not verify whether they currently do). The scalar
fields have **no path anywhere**, and per-city onboarding is the only mechanism this
codebase has ever built for producing a real setback number.

"Scope and build a writer matching `parcel-r5-zoning.mjs`'s pattern" assumes a
join-against-a-staged-source shape that setbacks structurally don't have yet. The
real options, as I see them, are:

1. **Acquire a real statewide (or program-wide) setback source first** — analogous
   to what `tx_zoning_district_staging` required for zoning — before any writer can
   exist. Not investigated here whether such a source exists to acquire (state DOT,
   a commercial GIS vendor, etc.) — a genuine acquisition-program question, out of a
   single session's scope.
2. **Reuse hauska-engine's existing per-city adapters** (Bastrop, Elgin only) for
   just those two cities' parcels, leaving every other city's setback cells
   `unaccounted` (or `refused`/"no onboarded source yet", mirroring zoningDistrict's
   own 49-city fix) — a much smaller, real, shippable slice, but Engine-lane owns
   that adapter code and it's built for a different consumer (legacy-design-tools'
   site-plan/envelope export), not parcel_record; whether/how to expose it to
   hauska-factory is an integration design question, not a copy-paste.
3. **Defer entirely** — name it a known, honestly-tracked gap (same "declared
   statewide, filled nowhere" pattern `RAILS_V2_DECLARED_AHEAD` already documents for
   other rails) rather than force a partial writer that only ever covers 2 of 72
   cities and calls itself done.

## What I did not do

I did not write any code for this. Building even the "2-city" slice (option 2) would
mean either duplicating Bastrop/Elgin's live-ArcGIS-query + ordinance-cross-check
logic inside hauska-factory (a second copy of real business logic to keep in sync),
or figuring out a genuine cross-repo integration path (an atom? a new staged table
Engine-lane populates?) — a real design decision, not a mechanical "mirror
parcel-r5-zoning.mjs" task. Per this sprint's own discipline, this needed reporting
before building, not a good-faith guess.

## Recommendation

Bring this back to the operator/Engine lane for a scoping decision among the three
options above before any hauska-factory code gets written. If the answer is "option 2,
Bastrop/Elgin only," I can build that once the exposure mechanism is decided. If it's
"option 1," this becomes its own acquisition-program card, sized more like the
zoningDistrict staged-layer effort than a single writer job.
