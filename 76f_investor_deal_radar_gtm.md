---
id: 76f_investor_deal_radar_gtm
title: Investor Deal Radar — go-to-market engine (partially staged)
status: active
last_updated: 2026-06-16
applies_to: portfolio
owner: nick
related: [75g_investor_deal_radar, 76b_gtm_engine_polish_sprint, 76d_gtm_data_package_go_to_market, 18_stakeholder_graph, _decisions/2026-06-16_investor_first_actor]
---

# Investor Deal Radar — GTM engine

> Partially staged by design. Stand up the measurement spine and the early human stages now; defer the automated distribution engine until the funnel converts. Distribution of an unproven product is not automated. Product: [`75g_investor_deal_radar.md`](75g_investor_deal_radar.md).

## The wedge audience and channels

The first actor is the Austin real estate investor (wholesaler, fix-and-flip, buy-and-hold). The channels are the investor communities themselves, which are dense, loud, and reputation-driven, so a tool that delivers spreads itself:

- Austin Real Estate Networking Club (RENC), the largest Central Texas REIA, ~15.7k on Facebook, wholesale deal-flow oriented.
- Texas REIAs network, 20k+ members.
- The Austin investor meetup layer (fix-and-flip, out-of-state investors, lenders, wholesalers).

Note: this is a different community from the ~7,000-member SoftPlan/ArchiCAD designer Facebook group logged in [`18_stakeholder_graph.md`](18_stakeholder_graph.md), which is Cortex's architect audience. The deal radar's community is the investor REIA world. Valerie Thompson (eXp Realty) and the Turf Me Up franchise are a captured distribution-partner channel (tech-reseller / referral), kept warm, not built yet.

## The measurement spine (build now)

The GTM observation layer already exists (`gtm_events`, `gtm_consent`, `recordGtmEvent`, `/api/brokerage/v1/gtm/digest`, `/gtm/triage`). Instrument the investor funnel as event types and extend the digest into a weekly funnel readout (the agents-watching-agents seed):

| Funnel step | Event | What it proves |
|---|---|---|
| Install | `extension_install` (exists) | reach |
| First auto-radar | `radar_autorun` (new) | the proactive surface fires and is seen |
| Decision | `deal_kept` / `deal_passed` (new) | engagement + profile/calibration signal |
| Return | `session_return` (new) | the running dialogue has pull |
| Lead engagement | `lead_feed_open` / `lead_clicked` (new) | the inversion works |
| Share | `share_viewed` (exists) | organic spread |

Instrumentation routes to cc-agent-C as a profile-adjacent backend task (the new event types + the digest extension), paired with the Wave 2 profile work.

## The staged motion

**S0 Operator and insider pilot.** Dev-tier key (dodges the Cotality consumer-display license gate G2). Operator plus a few trusted Austin investors dogfood the radar on real deals. Gate to proceed: the verdicts are right and the profile feels true.

**S1 Closed investor design-partner cohort.** A hand-picked group from the RENC / REIA / meetup network. Private build. The demo motion is the expo/portal idea from the Valerie and Erick conversation: an interactive, gamified, captured-feedback session (industry-tabbed portal, recorded sessions, end-of-session comprehension capture), not a slide pitch. Harvest calibration signal and testimonials. Gate: retention plus an "it found me a deal" outcome.

**S2 Community launch (gated on G2/G3/G4).** Get loud in the investor communities: teaser drops, a booth or networking-sponsor event, referral via the share mechanism. Controlled public key.

**S3 Web Store public (gated on G2/G3/G4 and Wave 4).** Full public listing, narrowed permissions, privacy policy, license cleared, disclaimers blessed. The full flywheel and lead engine live.

## Gates that bind the stages

- S0 and S1 run on dev tier and are not blocked by the Cotality consumer-display license (G2).
- S2 and S3 are blocked by G2 (Cotality consumer redisplay), G3 (Texas legal framing and disclaimers), and G4 (Web Store readiness). See [`75g`](75g_investor_deal_radar.md) for the gate definitions.

## Deferred (do not build yet)

The automated content and distribution engine (teaser generation, community drip, referral incentives, the multi-product agents-watching-agents go-to-market loop Nick described). It comes after the funnel converts in S1. Automating distribution of an unproven product wastes the channel's trust, which in tight investor communities does not come back.
