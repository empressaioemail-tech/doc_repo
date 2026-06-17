---
id: 75h_investor_deal_radar_launch_readiness
title: Investor Deal Radar — public launch readiness checklist
status: active
last_updated: 2026-06-16
applies_to: portfolio
owner: nick
related: [75g_investor_deal_radar, 76f_investor_deal_radar_gtm, 08_tiered_access_model, 14_pricing_framework, _decisions/2026-06-16_investor_radar_name_and_pricing, _decisions/2026-06-16_cotality_consumer_display_license_gate]
---

# Investor Deal Radar — launch readiness

> The path from built to public, organized as packaged, gated, tiered, public. Product: [`75g`](75g_investor_deal_radar.md). GTM motion: [`76f`](76f_investor_deal_radar_gtm.md).
>
> **Settled (2026-06-16):** name is **Hauska** (consumer surface keeps the Hauska brand, a conscious ADR-008 override); paid tier is **flat monthly**, provisional. Decision: [`_decisions/2026-06-16_investor_radar_name_and_pricing.md`](_decisions/2026-06-16_investor_radar_name_and_pricing.md).

## The sequencing insight that shapes everything

The paid tier is what the Cotality consumer-display license (G2) gates, not the free tier. The free radar runs on public-record plus already-licensed layers plus our own reasoning. So the **free radar reaches the public on G1 + G3 + G4; the paid depth follows on G2 + billing.** Do not block the public launch on the Cotality license. Two launches, not one.

## Precondition

Nothing packages until the reframe is built. Waves 1 to 3 are dispatched, not done ([`75g`](75g_investor_deal_radar.md)). Packaging hardens what exists.

## Packaged (Web Store submission)

| Item | Owner | Note |
|---|---|---|
| Merge the unified-signin baseline; fix version drift (manifest 0.6.7 vs package 0.5.0 vs README 0.6.0) | extension-agent | one source of truth |
| Narrow `host_permissions` from `https://*/*` to listing + API hosts | extension-agent | #1 Web Store rejection risk |
| Strip/gate dev artifacts (MCP-direct mode, internal-build messaging, dev key path) | extension-agent | |
| Clean release build (`build-release.ps1`, public key baked, bundle-vs-source hygiene) | extension-agent | |
| Store listing assets (Hauska name, icons, screenshots/video, description, category, support contact) | operator + extension-agent | |
| Hosted privacy policy + Chrome data-use disclosure | operator | mandatory; the extension observes research behavior |

G4 packaging kit (narrowed manifest, privacy policy, store copy, build hygiene) authored and dispatched: [`_dispatches/2026-06-16_extension-agent_g4_webstore_packaging.md`](_dispatches/2026-06-16_extension-agent_g4_webstore_packaging.md). Apply now; hold submission until the build + commercialization land.

## Gated (access + abuse control)

| Item | Owner | Note |
|---|---|---|
| Anonymous public wedge: baked public key + server-side per-install-id rate limits | cc-agent-C | only abuse control; key is extractable by design |
| Per-user sign-in unlocks profile, isolation, paid tier | extension-agent + cc-agent-C | signin built, needs merge |
| Paywall enforcement: zero entitlement blocks new compute, preserves read access | cc-agent-C | the no-lockout rule; avoids the auth-orphan trap |

## Tiered

| Tier | Contents | Gate |
|---|---|---|
| Free (Layer 1) | cheap radar pass on every listing (public-record + licensed layers), capped full briefs | G1 + G3 + G4 |
| Paid (Layer 2, flat monthly) | unlimited briefs, full Cotality underwriting depth (rent, comps, permits, liens, insurance, propensity), profile depth, lead feed | G2 + billing |

Billing: flat monthly recurring subscription (provisional). Confirm the rail when wiring the paid tier (Circle is the decided fiat rail but consumer recurring-card subscriptions may need a subscription processor; the wallet schema can back entitlement). Price point: open.

## Commercialization (paywall + CRM + GTM engine)

Dispatched 2026-06-16: [`_dispatches/2026-06-16_cc-agent-C_commercialization_pipedrive_paywall_gtm.md`](_dispatches/2026-06-16_cc-agent-C_commercialization_pipedrive_paywall_gtm.md).

| Item | What | Note |
|---|---|---|
| Paywall wired | Free (radar + capped briefs) vs Pro (depth + leads), flat monthly | entitlement on the per-user session; no-lockout on expiry; billing-rail interface stubbed |
| Pipedrive CRM sync | Funnel into the operator's Pipedrive: person on signup, deal on upgrade-intent, lead on qualified prospect | sovereignty boundary: only the GTM/CRM layer syncs; tenant-private research/profile never does |
| GTM engine over the top | The observation layer instrumented end to end into an investor-funnel readout; qualified signal auto-pushed to the CRM | new event types + `/gtm/digest` + `/gtm/triage` to Pipedrive |

## Public (the staged motion)

1. Build (Waves 1 to 3) + harden packaging.
2. S0 operator pilot, S1 closed investor cohort (dev tier, no gates) per [`76f`](76f_investor_deal_radar_gtm.md).
3. **Free radar to the Web Store** once G3 (TX disclaimers) and G4 (packaging) clear. G2 does not block this.
4. **Turn on the paid tier** when G2 (Cotality license) clears and billing is wired. Existing free users upgrade in place.

## Gates (binding)

| Gate | Blocks | Owner | State |
|---|---|---|---|
| G1 prod brokerage key | everything | cc-agent-C (durable) / operator (hotfix) | open; deploy storm settled, hotfix ready |
| G2 Cotality consumer-display license | paid Cotality depth (public) | bizops | open; dev-tier pilot proceeds |
| G3 TX legal framing + disclaimers | public valuation display | operator + TX attorney | open; cheap |
| G4 Web Store readiness | public listing | extension-agent + operator | open |

## Open decisions remaining

- Paid-tier **price point** (the monthly number; the `get.html` mock shows $49/mo as a placeholder).
- The **billing rail** for consumer recurring subscriptions (Circle vs a subscription processor).
- Operator inputs needed: the **Pipedrive API token** (for the CRM sync) and the **Pipedrive pipeline/stage mapping** for the upgrade funnel.
