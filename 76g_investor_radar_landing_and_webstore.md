---
id: 76g_investor_radar_landing_and_webstore
title: Investor Deal Radar — landing page + Web Store listing copy (draft)
status: active
last_updated: 2026-06-17
applies_to: portfolio
owner: nick
related: [75g_investor_deal_radar, 76f_investor_deal_radar_gtm, 75h_investor_deal_radar_launch_readiness, _decisions/2026-06-16_investor_radar_name_and_pricing, _decisions/2026-06-17_brief_national_baseline_websearch_coverage, 08_tiered_access_model]
---

# Investor Deal Radar — landing + Web Store copy

Draft launch collateral to hand to the Vercel landing build and the Chrome Web Store submission. Grounds on the decided positioning (compounding judgment, not speed), the Hauska brand ([`_decisions/2026-06-16_investor_radar_name_and_pricing`](_decisions/2026-06-16_investor_radar_name_and_pricing.md)), the Free/Pro/Max tiers, and the legal framing (informational estimate, never a value or appraisal; verify with municipal staff). The lead feed is cut; do not reference it.

Brand and visual system run on the separate claude design agent (`hauska.css`, editorial palette, radar mark). This doc is copy and structure; the design agent owns final visual treatment.

## Part 1 — Landing page (Vercel)

The single job of the page: a real estate investor clicks a link from an REIA community, understands the value in one screen, and installs the extension. One primary CTA (install), one secondary (see it work). No signup wall before install.

### Hero

Headline: **Know the deal before you call the agent.**

Subhead: Hauska reads any listing you open and gives you an investor verdict in seconds, with the code, flood, zoning, and underwriting signals that decide whether it pencils. Every answer carries its source, a confidence score, and a timestamp.

Primary CTA: **Add to Chrome, free.**
Secondary CTA: **Watch a 30-second brief** (anchor to the demo section).

Trust line under the CTAs: Free to start. No account needed to run your first briefs. Built for Central Texas, works anywhere.

### How it works (three steps)

1. **Open any listing.** Zillow, Redfin, an MLS portal, wherever you hunt. The radar fires automatically with a deal / conditions / dead verdict tuned to how you actually buy.
2. **Run the full brief.** One click pulls the underwriting stack: rent and comps signals, building permits, liens and mortgage, tax, HOA, flood and floodway, soils, zoning, and the local code that governs what you can build, all cited.
3. **Keep researching.** Ask follow-ups in the panel ("Can I add an ADU?", "What kills this deal?"), attach the CC&R or HOA docs, and let the tool learn your buy box as you keep and pass on deals.

### Why it is different (the moat, said plainly)

Section header: **It is not faster Google. It is judgment that compounds.**

Body: Most tools give you data and leave the thinking to you. Hauska gives you reasoning, every signal carries the chain that produced it, the source it came from, and an honest confidence score, so you can trust it or check it. Inside Central Texas we read the adopted local code directly. Anywhere else, we fall back to a live web search and label it plainly as web-sourced and unverified, so you always know what is grounded and what is a starting point. The more you use it, the better it learns the deals you actually want.

### Coverage

Short statement: Deep, cited coverage across Central Texas (Austin metro, the I-35 corridor, the Bastrop and Hill Country footprint), expanding city by city. Outside the footprint you still get the national layers (flood, soils, opportunity zones, parcel and ownership) plus a labeled web-sourced read on local rules.

### Tiers

| Tier | Price | What you get |
|---|---|---|
| Free | $0 | The on-listing radar verdict on every property, plus a set number of full briefs to start. |
| Pro | Flat monthly | Unlimited briefs, the full Cotality underwriting depth, the learned buy-box profile, and unlimited follow-up research. |
| Max | Flat monthly (higher) | Everything in Pro plus the spatial map: your cited reasoning rendered on an interactive parcel map, flood, zoning, and constraint layers in one view. |

CTA repeat: **Add to Chrome, free.**

### Social proof / community (S1 onward, placeholder until testimonials exist)

A quiet strip: "Built with Austin investors, for Austin investors." Drop real REIA testimonials here once S1 produces them. Do not fabricate proof pre-launch.

### Footer / legal

Hauska briefs are informational research to speed your own due diligence. They are not an appraisal, a valuation, or legal advice. Verify critical rules with municipal staff before you act. Powered by Hauska Engine. Links: Privacy Policy, Terms, Contact.

## Part 2 — Chrome Web Store listing

### Name
Hauska Deal Radar — Investor Property Briefs

### Short description (132 char max)
Open any listing and get an investor verdict in seconds, with cited code, flood, zoning, and underwriting signals. Free to start.

### Detailed description
Hauska Deal Radar turns any property listing into an investor-grade brief while you browse. Open a listing on Zillow, Redfin, or your MLS portal and the radar fires automatically with a clear verdict, deal, conditions, or dead, tuned to the way you actually buy.

Run the full brief and you get the signals that decide whether a property pencils: rent and comp signals, building permits, liens, mortgage and tax, HOA, flood and floodway, soils, opportunity zones, and the local zoning and building code that governs what you can build. Every signal carries its source, a confidence score, and a timestamp, so you can trust it or check it. This is reasoning you can stand behind, not a wall of raw data.

Inside Central Texas, Hauska reads the adopted local code directly. Anywhere else, it falls back to a live web search and labels it clearly as web-sourced and unverified, so you always know what is authoritative and what is a starting point.

Keep researching without leaving the page: ask follow-up questions in the panel, attach CC&R or HOA documents, and let Hauska learn your buy box as you keep and pass on deals. Your research and profile are private to you and never pooled.

Free to start, no account required for your first briefs. Upgrade to Pro for unlimited briefs and the full underwriting depth, or Max for the interactive parcel map.

Hauska briefs are informational research to support your own due diligence. They are not an appraisal, a valuation, or legal advice. Always verify critical rules with municipal staff.

### Permissions justification (for review + the privacy tab)
- activeTab / scripting on listing sites: to read the address and listing details of the page you are viewing so the brief is about the right property. We read only listing pages you open.
- storage: to keep your install, your free-brief count, and your private buy-box profile on your device.
- host access to the Hauska API: to fetch the brief, the cited layers, and your research. Property research and profile data are tenant-private and never pooled or sold.
- No browsing history collection, no selling of data, no ads.

### Single purpose (store requirement)
Provide on-listing, cited property research briefs to help real estate investors evaluate deals.

### Category / audience
Productivity. Audience: real estate investors and professionals.

## Launch gates carried (do not list publicly until cleared)
G2 Cotality consumer-display license (binds public redisplay of Cotality-derived signals), G3 Texas legal framing and disclaimer blessing, G4 Web Store readiness (privacy policy URL, narrowed permissions). S0 and S1 run on dev tier and are not gated by G2. Public listing is S3, gated on G2/G3/G4 per [`76f`](76f_investor_deal_radar_gtm.md).
