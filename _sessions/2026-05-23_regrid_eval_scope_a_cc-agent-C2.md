---
session_id: 2026-05-23_cortex_prop_intel_regrid_eval
author: cc-agent-C2
date: 2026-05-23
dispatch: cortex-prop-intel-regrid-eval (SCOPE A, vendor evaluation)
doctrine: P:\doc_repo\_decisions\2026-05-23_partnership_first_scoping.md
related_canonical: [40d_cortex_site_context_sprint, 43_cortex_qa_backlog, 46_smartcity_parcel_intelligence]
status: recommendation-pending-operator-approval
note: recovered from Read context after inbox file vanished mid-sweep
---

# Cortex prop-intel — Regrid + ATTOM vendor evaluation (SCOPE A)

> **TL;DR — Recommend Regrid as the Cortex national parcel + zoning
> baseline source.** Strong schema fit, full UT + TX coverage, monthly
> rolling updates, developer-friendly token-auth + GeoJSON response,
> self-serve plans in the $500–$2,000/mo range. ATTOM is the credible
> fallback but its strengths (sales / mortgages / 9,000 attributes per
> property) sit outside Cortex's architect-facing briefing surface.
> CoreLogic skipped per dispatch gate — both Regrid and ATTOM are
> viable, so the enterprise-pricing tier never opens.

## Recommendation: Regrid

Wins on 7 of 13 criteria; tied on 4; ATTOM only ahead on entry pricing
($95 vs $500/mo) and free-trial length (30 vs 7 days). Key Regrid edges:

- All 29 UT counties covered (full state); 159M parcels / 3,229 counties / 99% US pop
- 2,500+ counties with standardized `zoning_type` + `zoning_subtype` fields
- Rolling monthly refresh (vs ATTOM's quarterly)
- Strong provenance: `ll_last_refresh` (county-specific date) + `sourceurl` (source county portal)
- Rural-county strength (Moab + similar markets — exactly where Cortex needs it)
- GeoJSON-native, ~1 day adapter integration
- Standardized zoning maps directly to briefing engine inputs

ATTOM's edge sits in real-estate-investor schema (9,000 attributes:
sales, mortgages, foreclosures, comps, schools, crime, demographics)
— mostly noise for Cortex's architect-facing briefing surface.

## Pricing posture for pilot phase

1. **7-day free trial** to verify Musgrave_Residence_B + Redd parcels return clean polygon + zoning_type + ll_last_refresh
2. **Standard schema, lowest paid tier** (~$500/mo estimated) for production deploy behind feature flag
3. **Premium schema** ($1,500-2,000/mo) when standardized-zoning_type fields are referenced by the briefing engine

If pilot volume blows the $2k/mo self-serve ceiling, revisit ATTOM at $0.10/report tier as volume-pricing fallback (>50k engagements/mo, which would itself be excellent operational news).

## Consumer-side contract audit (key finding for SCOPE B)

Audited `legacy-design-tools-c2` main @79b5208:

- **`lib/site-context/src/client/overlays.ts`** is the ONE structured consumer. Reads `payload.parcel.geometry` and `payload.zoning.geometry` as ArcGIS-rings polygon shapes. Current adapters emit this because they hit ArcGIS REST upstreams.
- **`lib/briefing-engine/src/prompt.ts`** treats payload as opaque JSON, serializes (capped 4000 chars), hands to Claude Sonnet 4.5. NO structured-field requirement — LLM does semantic interpretation. Regrid GeoJSON passes through unchanged.
- **`artifacts/api-server/src/atoms/briefing-source.atom.ts`** is shape-only, no payload schema enforcement.
- **Site-topography ingest** (Phase 2D.1.2 — paused for this eval) needs parcel boundary geometry. Format-agnostic.

**Implication**: Vendor-format question reduces to "does `overlays.ts` need a GeoJSON branch?" If yes (Regrid), one function added to overlays.ts handles GeoJSON Polygon/MultiPolygon alongside existing ArcGIS rings path. ~half day of work.

## Schema-fit notes for SCOPE B integration (after operator approval)

8 concrete contract points:

1. **Adapter placement**: `lib/adapters/src/national/regrid.ts`. Add `"national"` to `AdapterTier` or treat as federal-tier.
2. **Two adapters recommended**: `regrid:parcels` + `regrid:zoning` (mirrors existing per-layer split; UI tier-toggles stay per-layer; shared HTTP cache means one upstream call regardless).
3. **Payload shape (preferred path b)**: Extend `overlays.ts.extractBriefingSourceOverlays(sources)` to recognize GeoJSON Polygon/MultiPolygon under `payload.parcel.geometry.type === "Polygon"`. Cleaner long-term — future federal/national adapters will mostly emit GeoJSON. +3-5 test cases on existing overlays test suite. (Alternative: convert GeoJSON → ArcGIS rings inside adapter, 30-line helper.)
4. **Provenance mapping**:
   - `briefing_sources.snapshot_date` ← Regrid `ll_last_refresh`
   - `briefing_sources.provider` ← `"Regrid"` or `"Regrid (via <source-county>)"`
   - `briefing_sources.layer_kind` ← `"regrid-parcel"` / `"regrid-zoning"`
   - `briefing_sources.source_kind` ← new value `"national-aggregator"` (cleaner than reusing `"federal-adapter"`)
5. **Cache**: existing 24h Postgres `adapter_response_cache` + 15-min in-memory cache from PR #94 apply unchanged.
6. **Runner wiring**: Regrid fires for ALL geocoded engagements as baseline; per-county adapters gate behind `partner_city = true` flag on engagement jurisdiction. Bastrop TX `partner_city = true`; Grand County UT currently does not — so under SCOPE B Grand County adapters DEPRECATE as baseline (kept in tree, gated off). Doc-comment header marks "deprecated as baseline".
7. **Tests** (per dispatch min 6): happy path, no-coverage, upstream-error (timeout/5xx/malformed), cache hit, partner-city enrichment (per-county + Regrid both fire), non-partner skip.
8. **Env vars**: `REGRID_API_KEY` as Cloud Run secret. Operator provisions before deploy.

## SCOPE C re-evaluation (out of this session)

After SCOPE B lands:

- **EPA EJScreen** (QA-22 SCOPE A): unchanged decision — different domain, Regrid doesn't cover environmental justice
- **FCC broadbandmap** (QA-22 SCOPE B): unchanged — different domain. PR #94 (90s timeout) + PR #96 (structured logging) stand
- **Grand County GIS** (QA-22 SCOPE C): VPC + Cloud NAT + whitelist outreach drops from REQUIRED to OPTIONAL. Only worth pursuing if Grand County publishes overlay districts Regrid doesn't surface AND a customer-zero case needs them. **Default disposition: defer indefinitely.**

## Reversal criteria

Trigger reconsideration if:

1. **Regrid pricing for actual call volume exceeds Cortex's cost envelope after trial** — revisit ATTOM at $0.10/report tier. Mechanism: 1-month trial billing log against engagement volume.
2. **Regrid's overlay-district gap blocks a P0 use case** — e.g. historic-district overlay affecting setbacks where zoning_type doesn't surface it. Mitigation: per-county GIS (now opportunistic) handles enrichment for that jurisdiction.
3. **A partner-city's local GIS materially outperforms Regrid** for that city's zoning. Bastrop UDC continues as separate substrate-side pipeline; local GIS for partner cities continues as opportunistic enrichment.
4. **Regrid coverage gap in target Sync 5 corridor city in TX** — per-county GIS for that city only; don't abandon Regrid baseline.
5. **Regrid `ll_last_refresh` cadence drifts below 6 months on target jurisdiction** — refresh-staleness windows in existing adapter code become the gate; surface amber stale badge on Site Context tab.

## Hand-off

- **Decision pending operator approval**: Regrid pick
- **Operator next step**: sign up for 7-day Regrid trial; verify Musgrave (1144 N Kayenta Dr, Moab UT) + Redd parcels return clean polygon + zoning_type + ll_last_refresh
- **cc-agent next step (on operator approval)**: fire SCOPE B — build adapter, extend overlays.ts for GeoJSON Polygon, wire to runner, deprecate grand-county-ut as baseline behind partner_city flag, ship with 6 test cases
- **Parallel track**: 2D-site-context Phase 2D.1 PR 2 (site-topography atom + DEM ingest worker, off PR #98) resumes after Regrid decision. PR 2 reads `payload.parcel.geometry` — sequencing Regrid first means PR 2 reads from national baseline without per-jurisdiction fallback path (simpler)

## Sources

- Regrid Parcel API overview: https://regrid.com/api
- Regrid Parcel API endpoints (v2): https://support.regrid.com/api/parcel-api-endpoints
- Regrid Parcel Schema: https://support.regrid.com/parcel-data/schema
- Regrid Standardized Zoning: https://support.regrid.com/parcel-data/zoning
- Regrid Self-Serve API Plans: https://app.regrid.com/api/plans
- Regrid Utah parcel data store: https://regrid.com/utah-parcel-data
- ATTOM Developer Platform: https://api.developer.attomdata.com/home
- ATTOM Parcel Boundary Data: https://www.attomdata.com/data/boundaries-data/parcel-boundaries/
- Codebase audit: legacy-design-tools-c2 @ main 79b5208 (overlays.ts, prompt.ts, types.ts, briefing-source.atom.ts, grand-county-ut.ts)
