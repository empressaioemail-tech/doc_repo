---
title: Cortex prop-intel SCOPE A — Regrid vs ATTOM vendor evaluation
date: 2026-05-23
agent: cc-agent-C
repo: legacy-design-tools
kind: session-summary
status: HR-11 inbox drop. Durable copy at
  legacy-design-tools/_research/2026-05-23_cortex_regrid_evaluation_cc-agent-C.md.
dispatch: 2026-05-23_cortex_regrid_evaluation
related: [43_cortex_qa_backlog, 46_smartcity_parcel_intelligence, 73_partnerships, 2026-05-23_partnership_first_scoping]
---

# Cortex prop-intel — Regrid vs ATTOM evaluation (SCOPE A)

Per dispatch: evaluate, recommend, operator picks. **No code change
this session.** SCOPE B (adapter implementation) fires after pick.

## Recommendation: **Regrid**

ATTOM is structurally wrong for Cortex's site-context use case:

- ATTOM's `/property/detail?latitude=X&longitude=Y&radius=N` is a
  **radius-based** lookup (default 5 mi, max 20 mi), not point-
  in-polygon. Returns properties within a radius, not THE parcel
  containing a point.
- ATTOM doesn't document **zoning code, zoning description, OR
  parcel geometry** as response fields. Property-characteristics-
  centric (beds/baths/sqft/sales) — wrong domain for site-context.
- Sales-gated pricing (no self-serve, contact form + phone) —
  doesn't fit Cortex's operational tempo around ICC API landing
  this week.

Regrid wins on every Cortex-specific criterion:

- **Point-in-polygon native** — same query shape the existing
  per-county GIS adapters use.
- **Parcel geometry + zoning code + zoning description** in
  Standard tier (`parcelnumb`, `gisacre`, `zoning`,
  `zoning_description`).
- **Provenance fields exactly as dispatch asked**: `sourceurl`
  (county URL), `county`, `geoid` (FIPS), `ll_last_refresh`
  (county refresh date), `ll_updated_at` (Regrid mod timestamp).
- **Self-serve pricing** at
  [`app.regrid.com/api/plans`](https://app.regrid.com/api/plans).
- **Premium tier** adds `fema_flood_zone`, `padus_public_access`,
  `lbcs_*` land-use codes, plus standardized
  `zoning_type`/`zoning_subtype` for cross-county normalization.

**CoreLogic recon skipped** per dispatch step A.3 (only evaluate
if Regrid + ATTOM both fail).

## Cortex consumer-side contract (read from main HEAD `4aa3d2a`)

What downstream code expects from `payload.parcel.*` /
`payload.zoning.*`:

- `payload.kind === "parcel"` or `"zoning"`
- `payload.parcel.geometry` → ArcGIS `{ rings: [...],
  spatialReference: { wkid: 4326 | 102100 | 3857 } }`
  (`lib/site-context/src/client/overlays.ts:189-219`)
- `payload.parcel.attributes` → `Record<string, unknown>` with
  one of `PARCEL_ID_KEYS` + one of `PARCEL_ACRES_KEYS`
  (`lib/adapters/src/_payloadSummaryHelpers.ts:88-107`)
- `payload.zoning.attributes` → with one of `ZONING_CODE_KEYS` +
  one of `ZONING_DESC_KEYS`

Regrid GeoJSON → ArcGIS `rings` is a small shim
(`{ coordinates: [[ring]] }` → `{ rings: [[[x,y], …]] }`). Field
names: either map Regrid's `parcelnumb`/`gisacre`/`zoning`/
`zoning_description` to existing pilot-county aliases (`PARCEL_ID`,
`ACRES`, `ZONING`, `ZONING_DESC`) or extend the key-alias arrays
to include Regrid's native names. SCOPE B picks one — both work.

## Known unknowns operator should verify before SCOPE B

1. **Exact Regrid point-in-polygon endpoint URL + request shape**
   — fetch from `developer.regrid.com/llms.txt` (OpenAPI spec) or
   the sandbox. Marketing/sandbox pages I reached didn't expose
   the URL.
2. **Per-query cost** — sign into `app.regrid.com/api/plans` and
   confirm $0.01–0.05/lookup envelope holds. Cortex baseline
   volume: ~5–50 calls/day = 150–1500/month, well under Regrid
   trial allocation of 2,000/30d.
3. **Standard vs Premium tier pick** — Standard covers MVP;
   Premium adds FEMA flood + LBCS land-use + standardized zoning
   taxonomy. Premium reduces FEMA NFHL adapter load.
4. **Coverage gap probe** — trial query for Musgrave (Moab,
   Grand County UT), Redd (Moab area), Bastrop TX. Confirm
   non-empty parcel + zoning envelope. **Trial counties listed
   on Regrid sandbox page don't include UT** — Utah coverage is
   plausible but unverified.

## SCOPE B implementation outline (preview)

- `lib/adapters/src/national/regrid.ts` following federal-adapter
  pattern. `regridLogEvent` mirroring `fccLogEvent` from PR #96.
- Site-context runner: Regrid is **baseline** for all
  engagements. Per-county adapters become **opportunistic
  enrichment** gated on `partner_city` jurisdiction flag.
- Emit two `briefing_sources` rows per call (parcel + zoning) to
  match existing per-county convention; zero downstream change
  required.
- Cache: leverage existing 24h Postgres + PR #94's 15-min
  in-mem pattern. May need a `nationalAdapterCachePredicate` to
  extend the federal-tier default.
- `REGRID_API_KEY` Cloud Run secret; operator provisions.
- 6 minimum tests per dispatch (happy / no-coverage /
  upstream-error / cache-hit / partner-city enrichment /
  non-partner skip).

## SCOPE C preview (after SCOPE B)

- Grand County GIS QA-22 operator-infra (VPC + Cloud NAT +
  whitelist) → **optional**, only if Grand County adds
  enrichment Regrid doesn't (flood districts, county overlays).
  Premium tier Regrid FEMA flood may make this fully optional.
- FCC + EPA decisions **stand independently** — different data
  domains Regrid doesn't cover. QA-22 FCC recon (PR #96/#97) and
  QA-22 EPA recommendation unaffected.

## Workspace hygiene

- Branch off `origin/main` HEAD `4aa3d2a` (includes PR #98 USGS
  3DEP DEM raster client) in isolated worktree per the
  workspace-hygiene memory.
- No code change in SCOPE A.
- File-only inbox drop, durable copy committed to
  `_research/` in the docs PR (per HR-11).
