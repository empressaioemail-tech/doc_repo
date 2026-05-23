---
title: Phase 2D.1 PR 1 of N — USGS 3DEP DEM raster client (cc-agent-C2)
date: 2026-05-23
agent: cc-agent-C2
repo: legacy-design-tools (legacy-design-tools-c2 clone)
kind: session-summary
dispatch: 2026-05-23_cc-agent-C2_phase_2d1
related: [40d_cortex_site_context_sprint, 43_cortex_qa_backlog]
---

# Phase 2D.1 PR 1 of N — USGS 3DEP DEM raster client

cc-agent-C2 first PR on the 2D-site-context sprint Phase 2D.1.
Operator-pasted status report (no inbox file from C2 this turn).

| Item | PR | Location |
|---|---|---|
| USGS 3DEP DEM raster client | [#98](https://github.com/empressaioemail-tech/legacy-design-tools/pull/98) | `lib/site-context/src/server/usgs3dep.ts` |

22 unit tests pass; full workspace typecheck clean; branch teed for
operator merge per dispatch's "do NOT self-merge."

## Audit findings (diverge from dispatch mental model)

1. **`usgs:ned-elevation` exists** at `lib/adapters/src/federal/usgs-ned.ts`
   as a single-point EPQS query (returns one elevation number). The
   3DEP raster client is a distinct surface, net-new at
   `lib/site-context/src/server/`. Not a duplicate.
2. **`lookupParcel` is a stub** (`lib/site-context/src/server/parcel.ts`
   returns null). No parcel-boundary fetcher today. But existing
   briefing-source payloads already carry `payload.parcel.geometry`
   (per `overlays.ts:203-210`) — Redd via `grand-county-ut:parcels`,
   others via their local adapters. Pragmatic source for parcel
   boundary input.
3. **Atoms are event-sourced** via `@hauska/atom-contract` with
   `getAtomRegistry()` in `artifacts/api-server/src/atoms/registry.ts`.
   `site-topography` will be a `makeSiteTopographyAtom({db, history})`
   factory + registration entry — same shape as the 20 existing atoms.
4. **No "layer panel" UI exists** — `SiteMap.tsx` takes a flat overlays
   array. PR 4 will add a minimal per-tier toggle (checkbox), not a
   full panel.
5. **GCS pattern is uuid-keyed**, not engagement-pathed. Ingest worker
   will use `ObjectStorageService.uploadObjectEntityFromBuffer()` and
   store the returned `objectPath` on the atom event payload — same
   pattern as `ifcIngest.ts`.
6. **Migrations dir at `lib/db/drizzle/`**, current head is **0015**.
   Dispatch's preference ("write to `materializable_elements` with a
   new source_kind — fewer operator gates") is concretely workable:
   that table already has engagement-scoped supersession (per QA-35
   fix) + a `propertySet` JSON column that can carry the DEM ref +
   contour GeoJSON. **No migration 0016 needed.**

## Defaults proposed for PR 2 (DEM ingest worker + site-topography atom)

Operator greenlit 2026-05-23, no redirects:

1. **Parcel boundary source**: read `payload.parcel.geometry` from the
   engagement's most-recent active briefing-source. If absent (e.g.
   Musgrave outside Grand County's coverage), fall back to a
   geocode-anchored bbox (lat/lng + 500m square). Both engagements
   get contours either way. **Future note**: when the Regrid
   integration lands per the 2026-05-23 Partnership-first scoping
   decision, parcel geometry will come from Regrid for national
   coverage; the briefing-source-derived path continues for partner
   cities. PR 2's contract is source-agnostic — `payload.parcel.geometry`
   is the abstraction.
2. **Catchment proxy**: Phase 2D.1 ships a fixed-buffer bbox (parcel
   + 500m on all sides). True upstream-catchment is Phase 2D.2's job
   (requires hydrology). Idempotent supersede means 2D.2 can re-trigger
   DEM ingest with a real catchment later.
3. **Contour derivation lib (PR 3)**: `d3-contour` + `geotiff` npm libs
   — Node-native, no system deps, no Cloud Run Dockerfile changes.
   `gdal_contour` would be more "industry standard" but requires
   shipping GDAL as a Cloud Run sidecar; operator-gate cost outweighs
   the precision benefit at parcel scale.
4. **Persistence**: `materializable_elements` with
   `source_kind = 'site-topography'` per dispatch's stated preference.
   No migration. Atom factory + registry registration only.

## Phase 2D.1 PR plan

- PR 1 (#98, this) — USGS 3DEP DEM raster client + 22 unit tests
- PR 2 — `site-topography` atom factory + registry registration +
  ingest worker + trigger; persistence via `materializable_elements`
  source_kind
- PR 3 — contour-line derivation (d3-contour + geotiff)
- PR 4 — `SiteMap` overlay rendering + per-tier toggle (minimal)
- PR 5 (optional, deferable) — hillshade tile overlay

## Operator handoff

PR #98 merge → CI builds `:latest` → operator decision on whether to
deploy now (low-risk: client lib only, no runtime path consumes it
yet) or batch with PR 2 deploy.

cc-agent-C2 proceeds to PR 2 with the four defaults above.

## Out of scope

- QA-22 (cc-agent-C territory; mitigation set still open: PR #96
  logging deployed; FCC + EPA + Grand County operator decisions
  pending)
- QA-33 / QA-35 (closed)
- Phase 3 features (deferred behind 2D-site-context)
- Hauska-engine `@hauska-engine/atoms` registry bump for
  `site-topography` (deferred per dispatch — local atom shape only
  for v1)
