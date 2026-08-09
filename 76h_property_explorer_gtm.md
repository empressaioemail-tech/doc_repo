---
id: 76h_property_explorer_gtm
title: Property Explorer — go-to-market system (free-browse → paid-deep)
status: active
last_updated: 2026-08-09
applies_to: hauska-map (property-explorer), legacy-design-tools (cortex-api brokerage GTM)
related: [75j_property_explorer_destination_ledger, 2026-07-21_property_explorer_v1_sprint_WDLL, 76f_investor_deal_radar_gtm, 08_tiered_access_model, _dispatches/2026-06-16_cc-agent-C_commercialization_pipedrive_paywall_gtm]
owner: nick
---

# Property Explorer — GTM system

**NAMING (2026-08-09):** Property Explorer is the pre-rebrand name of **Smart Site** (rebrand live on PE prod 2026-08-03; deferred rebrand surfaces tracked in `76j_smartsite_launch_readiness_program.md`). This doc keeps its slot and id so existing references resolve; read "Property Explorer" as Smart Site throughout. The funnel, persona registers, CRM sovereignty boundary, and billing seams below survive the rename unchanged. Launch gating now per `_decisions/2026-08-09_texas_flush_launch_gate.md`.

Reference model: the investor deal radar GTM engine (`76f_investor_deal_radar_gtm.md`, Pipedrive + `gtm_events` observation layer). This is **not** a trading-app clone — no shared runtime, no trading code. The trading app's funnel architecture (instrument → digest → CRM) is the pattern; Property Explorer is a separate vertical with its own event types, personas, and paywall surface.

## Product motion

**Free browse → paid deep.** Anonymous users explore the Central Texas map: parcel click, baked facets, drawn envelope where gate-verified. No account required. Deep work (Research this, spine-backed R1–R10 reports, save property, export) sits behind auth + entitlement. Marketing and landing copy must match the coverage ledger — honest absence where data is not verified (Comal, unset setback tables, unverified flood).

## Persona entry (three registers, one truth)

Same underlying facets; register flexes language on inspect + report paths:

| Persona | Register | Example framing |
|---|---|---|
| Homeowner | Plain verdict | "You can likely add an ADU in the shaded area — setbacks F 25′, S 5′, R 10′." |
| Investor | Envelope + constraints | "Buildable envelope ~62% of lot; SF-R allows duplex by special use — verify with city." |
| Architect | Citation-forward | "SF-R (Bastrop UDC §4.2): front 25′, side 5′, rear 10′ — envelope Tier-1 approximate." |

Persona is inferred client-side (`homeowner` default) and sent on GTM events as `personaInferred`. It does not change facts — only presentation.

## Funnel (measurement spine)

Built on existing `gtm_events` + `gtm_consent` (`sourceSurface: property-explorer`). Consent version: `2026-07-21-property-explorer-v1`.

| Step | Event | What it proves |
|---|---|---|
| Cold open | `pe_browse_started` | Map boot + anonymous reach |
| Dismiss card | `pe_cold_open_dismissed` | Intent to browse (Google stub or "Just browse") |
| Sign-up intent | `pe_signup_intent` | OAuth button click (pre-auth) |
| Save property | `pe_save_property` | Retention signal (authed path) |
| Research click | `pe_research_clicked` | Deep-intent on a parcel |
| Paywall | `pe_paywall_hit` | Blocked deep route without entitlement |
| Upgrade | `pe_upgrade_started` | Checkout initiated |

Digest extension: `GET /api/brokerage/v1/gtm/digest` includes `propertyExplorerFunnel` weekly readout.

## CRM (Pipedrive — sovereignty boundary)

Operator CRM sync on CRM-worthy events only (`pe_signup_intent`, `pe_save_property`, `pe_research_clicked`, `pe_paywall_hit`, `pe_upgrade_started`):

- **Person** on signup intent (synthetic email `{installId}@pe.empressa.local` until real OAuth email lands).
- **Deal** on save, research, paywall, upgrade.

**Hard boundary:** identity + funnel stage + qualified signal only. Tenant-private research, saved adjudications, and report payloads never sync to operator Pipedrive (same rule as investor radar dispatch 2026-06-16).

Routes: `POST /api/brokerage/v1/gtm/property-explorer/consent`, `POST /api/brokerage/v1/gtm/property-explorer/events`.

When `PIPEDRIVE_API_TOKEN` is absent on cortex-api, responses carry `pipedriveMode: simulated` — events still land in `gtm_events`; no fake live CRM.

## Billing (paid deep)

Flat subscription aligned with Layer 2 (`08_tiered_access_model.md`):

- **Browse:** free, anonymous, Layer-1 public facets.
- **Deep:** Pro (R1–R10 reports, save, export) via Stripe test-mode checkout seam.

Route: `POST /api/brokerage/v1/property-explorer/billing/checkout` (install-id + service-token BFF path until Wave 2 OIDC ships). When `STRIPE_SECRET_KEY` absent, returns simulated checkout URL with honest note — never claims live billing.

## Surfaces in this GTM story

| Surface | Role in funnel |
|---|---|
| property-explorer web (Vercel) | Front door — browse + paywall + persona picker |
| Chrome extension (hauska-brief-extension) | Listing capture → hand off `?parcelNodeId=` to web (smoke / blocked until account path) |
| PWA | On-site install — manifest + GPS on map |
| Command-center | Operator control tower — not the consumer signup path (Fork B) |

## ICC / building code (deferred citation)

ICC I-Code ingest infra exists; `ICC_CODE_CONNECT_CLIENT_ID` / `SECRET` in Secret Manager. Consumer deep path cites ICC only when spine serves I-Code atoms — no fabricated code citations. Until ingest is wired to this surface, hold list item (WDLL 31).

## What is explicitly not this GTM

- Trading app code or empressa-trading runtime
- Valuation / feasibility (ledger row 4)
- Comal fabricated coverage
- Full MCP/agent catalog placement (Wave 6 on WDLL card)

## Operator secrets (mount on cortex-api + Vercel BFF)

| Secret | Gates |
|---|---|
| `PIPEDRIVE_API_TOKEN` | Live CRM sync |
| `STRIPE_SECRET_KEY`, `STRIPE_PRO_PRICE_ID` | Live checkout |
| OAuth client IDs (Wave 2) | Real sign-in |
| `ICC_CODE_CONNECT_*` | Authoritative building-code citations on map |
