---
id: 2026-06-18_radar_billing_pipedrive_map_cotality
title: Session — radar billing (Pro/Max), Pipedrive, area chat, the Max map + Cotality national pivot
date: 2026-06-18
type: session
applies_to: portfolio
related: [75i_investor_radar_prelaunch_sprint, 61a_central_tx_coverage_program, 80_adrs/adr_022_deal_twin_and_cross_application_capture, _decisions/2026-06-18_map_engine_maplibre_cotality_national, _decisions/2026-06-16_investor_radar_name_and_pricing, _decisions/2026-06-17_brief_national_baseline_websearch_coverage]
---

# Session — radar billing, Pipedrive, area chat, the Max map + Cotality pivot

Continuation of the radar build. This chat ran as coordinating planner across a tight build-deploy-QA loop (extension v0.6.16 -> v0.6.22, several cortex-api + one engine-api deploy), verifying every agent close against live prod before relying on it. The arc: take the radar from "free brief works" to a Free/Pro/Max product with live billing, CRM, an area-aware chat, and a real national spatial map. Pre-mortem cleared ADR-022 green.

## Shipped and verified live

- **Billing — Free / Pro ($29) / Max ($65), live (test mode).** Tier-aware `/billing/checkout` (pro|max), Stripe webhook flips `proActive`/`maxActive`, Customer Portal, free-brief cap (3) before an `upgrade_required` (402, not the legacy wallet top-up). Verified: both Pro and Max checkout return `mode:"live"` with real `cs_test_` sessions. Map gated on `subscriptionTier=max`. Decision: [`2026-06-16_investor_radar_name_and_pricing`](../_decisions/2026-06-16_investor_radar_name_and_pricing.md). Prices: PRO `price_1Tjg4SFjAepSMTX7pJ5GLYBf`, MAX `price_1TjidZFjAepSMTX7yQ8FoIQq` (test).
- **Pipedrive CRM sync — live.** Root cause: sync only ran when `X-Hauska-Install-Id` was on the request; the extension web-auth signup often had no install id, so signup succeeded but CRM never fired. Fixed (resolve install id from header->body->query; always sync). Verified: real extension-style signup -> Pipedrive person. Sovereignty held (GTM identity only; research/profile never sync).
- **Research chat — fixed + area-aware.** Root cause: `completeGrok()` ignored `BRIEFING_LLM_MODE=anthropic` + an address/listing-key mismatch ("no brief run"). Fixed. Added `areaContext` so chat answers area/map-level questions (active filters, visible parcels, jurisdiction) without a brief run. Verified live (`areaContextApplied:true`, method anthropic).
- **Extension QA hardening (v0.6.17-v0.6.22):** logout/session scope (`user-scope.js`, history keyed `user:<sub>` / `install:<id>`), deep-dive tab focus+update (no new tab), address autocomplete, padding (shadow-DOM), restyled profile card, rail reorder, dual-tier upgrade UI everywhere, the MV3 dynamic-`import()` service-worker fix, and a clean release build (no `_`-prefixed / `node_modules` / `.git`).
- **The Max spatial map — built real (MapLibre), data pivoted to Cotality national.** Dropped the design-agent mockup approach (operator rejected the output) and built the real map in the extension. Engine decision + Cotality pivot: [`2026-06-18_map_engine_maplibre_cotality_national`](../_decisions/2026-06-18_map_engine_maplibre_cotality_national.md). National parcel mesh PROVEN (Cotality Spatial Tile bbox returned 500 features for Bastrop AND Austin), FEMA federal flood, land-use choropleth, small Map pull-tab, collapsible/resizable dock, full-screen + popout chat, confidence-ring pins.

## Deploys

cortex-api progressed through several revisions to `00235-sux` (pagination caps: bbox 4x50=200, zoning enrich 25/req); hauska-engine-api to `00017-cuy` (the six `COTALITY_*` secrets mounted — the real fix for the CLIP/"not configured" assemble error). Extension at `d8786b2` (v0.6.22). Note: a recurring **PowerShell-pipe secret-write truncation** wrote 2-char garbage twice (the phantom "empty STRIPE_SECRET_KEY" and an engine secret) — fixed by writing secrets via temp files, not pipes.

## SmartCity map recon (mirrored)

cc-agent-M confirmed SmartCity's map is Leaflet + Esri + per-county ArcGIS, NOT cleanly extractable (the "island"). Liftable: the styling palettes + layer catalog. This drove the decision to build a fresh MapLibre renderer and source geometry from Cotality (national) rather than per-county GIS. Mirror: [`_inbox/2026-06-18_smartcity-os_cc-agent-M_map_scoping_probe.md`](../_inbox/2026-06-18_smartcity-os_cc-agent-M_map_scoping_probe.md).

## ADR-022 — the deal twin

The cross-application capture model (the radar's property workspace -> a persistent tenant-private deal object; events as procedure-execution atoms; generic pin-to-deal capture riding the user's authed browser session; Cotality owns public records; MCP-exposed). Premortem green. Build phased and gated; not in this sprint. [`adr_022`](../80_adrs/adr_022_deal_twin_and_cross_application_capture.md).

## Site-adapter roadmap (operator-requested)

Current scrapers: Zillow, Redfin, MLS Matrix, plus a generic title-parse + the manual address box (the brief is address-driven, so any address works; scrapers only improve auto-detect). Target stack, prioritized for the investor wedge: Tier 1 Realtor.com, Trulia, Homes.com; Tier 2 HAR.com (TX MLS), brokerage IDX (Compass/RE-MAX/eXp), other MLS vendors; Tier 3 Auction.com, Hubzu, Xome, Roofstock, Crexi/LoopNet; Tier 4 Google Search/Maps (universal entry), Facebook Marketplace, Craigslist, FSBO. Recommended next: Realtor.com + HAR.com + Google. Not yet dispatched.

## Open data holes (the named remainder, per the operator's session-close bar)

- **Cotality production quota/keys** — demo tier is quota-limited (429s on Spatial Tile after smoke) and expires ~July 6. A test cohort will exhaust it; production Property + Spatial Tile (+ RiskMeter) keys needed, synced to both `legacy-design-tools-prod` and `hauska-prod-497015`. Scoped: `_inbox/2026-06-18_legacy-design-tools_cc-agent-C_cotality_production_quota_scope.md`.
- **Zoning-color geocode bridge** — Spatial Tile rows carry parcelId/stdAddr, not the Property CLIP; coloring parcels by zoning needs stdAddr -> Property geocode -> CLIP -> site-location. Mesh renders; zoning color is a follow-up.
- **Map full-bleed visual confirm** — blocked only by the Cotality demo-quota cooldown; auto-enables in v0.6.22 when the bbox is healthy.

## Operator-owned (carried)

ICC `ICC_CODE_CONNECT_*` secrets (awaiting ICC), General Code partnership (eCode360 cities), G2 Cotality consumer-display license (gates the Cotality map + comps public display), the Vercel landing (copy in 76g) + Web Store listing (G4), Cotality production keys.

## Memories saved

`always-copy-paste-ready-handoff-blocks`, `brief-coverage-websearch-fallback` (2026-06-17).
