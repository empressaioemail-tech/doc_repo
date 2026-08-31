---
id: 2026-07-21_property_explorer_gtm
title: Property Explorer — GTM system (free-browse → paid-deep)
status: active
date: 2026-07-21
applies_to: hauska-map (property-explorer), legacy-design-tools (cortex-api GTM/CRM/billing)
related: [75j_property_explorer_destination_ledger, 2026-07-21_property_explorer_v1_sprint_WDLL, 76f_investor_deal_radar_gtm, 08_tiered_access_model, 2026-07-18_property_brief_gtm_critical_path]
owner: nick
---

# Property Explorer — GTM system

Captured GTM for the map-first consumer surface. **Reference model:** the investor/trading GTM observation layer (Pipedrive sync, funnel events, Stripe checkout seam) — **not a trading clone**. No trading code, no shared runtime, no AVM/valuation wedge on this surface.

Linked from: `75j_property_explorer_destination_ledger` rows 14–15; WDLL items 24–27.

## North star motion

**Free anonymous browse → account → paid deep research.**

| Stage | User sees | System does | Honest boundary |
|---|---|---|---|
| Cold open | Live map + sign-up card | `pe_browse_started`, optional `pe_signup_intent` | Google OAuth stub until Wave 2 secrets |
| Browse | Parcel inspect, envelope where verified | Baked facets + live GIS; gaps explicit | No fabrication; Comal countywide gap |
| Intent | Save property / Research this | `pe_save_property`, `pe_research_clicked` → CRM deal | No tenant-private research in CRM |
| Paywall | Upgrade CTA | `pe_paywall_hit`, checkout seam (`pe_upgrade_started`) | Stripe live only when cortex secrets mounted |
| Paid deep | R1–R10 reports + manifest (Wave 3) | Entitlement + spine `report_run` | ICC citations when ingest live (WDLL 31) |

## Personas (one engine, three registers)

Same parcel facts; register flex on inspect + report paths (WDLL 28):

| Persona | Register emphasis | Out of scope on browse |
|---|---|---|
| Homeowner | Verdict — "what can I build here?" | Valuation / worth |
| Investor | Constraints envelope — zoning + buildable % | AVM / rent heat (layer excluded) |
| Architect | Citation-first — setbacks + district | Design Accelerator / plan review |

## Funnel events (measurement spine)

Recorded in `gtm_events` with `sourceSurface: property-explorer`. Digest: `GET /api/brokerage/v1/gtm/digest` → `propertyExplorerFunnel`.

| Step | Event | CRM (Pipedrive) |
|---|---|---|
| Session browse | `pe_browse_started` | — |
| Cold open dismiss | `pe_cold_open_dismissed` | — |
| Sign-up intent (Google click) | `pe_signup_intent` | Person (synthetic email until OAuth) |
| Save property | `pe_save_property` | Deal |
| Research click | `pe_research_clicked` | Deal |
| Paywall | `pe_paywall_hit` | Deal |
| Checkout start | `pe_upgrade_started` | Deal |

**Sovereignty:** identity + funnel signal only. Saved research, adjudications, and tenant-private payloads never sync to operator Pipedrive.

## CRM wiring

- **Connector:** existing `brokeragePipedrive.ts` (`PIPEDRIVE_API_TOKEN` on cortex).
- **Ingress:** `POST /api/brokerage/v1/gtm/property-explorer/events` (service-token + BFF).
- **Mode:** live when token mounted; `mode: simulated` logged when absent (honest, not fake live).

## Billing / checkout seam

- **Route:** `POST /api/brokerage/v1/property-explorer/billing/checkout` (install id header).
- **Rail:** Stripe subscription (`pro` tier first); simulated checkout when `STRIPE_SECRET_KEY` absent on cortex.
- **BFF:** property-explorer Vercel `api/pe-billing.ts` → cortex (server holds `CORTEX_SERVICE_API_KEY`).
- **Anonymous browse:** never gated by checkout.

## Marketing honesty (WDLL 27)

Landing copy must not claim:

- "Any lot" universal coverage (Comal + conditional cities are honest gaps).
- Valuation / AVM / rent heat (layer excluded from consumer toggle set).
- Live ICC I-Code citations (ingest/creds pending — hold on card).

Deploy adversarial check: cold-open headline + meta description + layer panel vs `75j` + coverage ledger.

## Surfaces polish (Wave 5 cross-ref)

| Item | Delivery |
|---|---|
| 28 Personas | Inspect card register flex |
| 29 PWA | `manifest.webmanifest`, theme-color, mobile viewport, GPS via MapTools |
| 30 Extension | Smoke script → honest BLOCKED until auth + extension handoff |
| 31 ICC | Hold note on inspect; live citation when spine serves I-Code atoms |

## Operator hold list (Nick)

| Secret / config | Blocks |
|---|---|
| Wave 2 OIDC client IDs | Live Google/Microsoft sign-in |
| `PIPEDRIVE_API_TOKEN` on cortex deploy | Live CRM (simulated path OK) |
| Stripe secrets on cortex deploy | Live 4242 checkout (simulated OK) |
| `PIPEDRIVE_PE_UPGRADE_STAGE_ID` | Optional deal stage mapping |
| ICC Code Connect credentials | I-Code citations on map (WDLL 31) |

## What is explicitly not this GTM

- Trading app tiles, options, or cockpit runtime.
- Investor deal radar lead feed (scope cut 2026-06-17).
- Feasibility / valuation / AVM-as-worth (ledger row 4 deferred).
