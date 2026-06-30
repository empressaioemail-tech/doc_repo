---
id: adr_022_deal_twin_and_cross_application_capture
title: ADR-022 — The deal twin and the cross-application capture model
status: accepted
last_updated: 2026-06-18
applies_to: portfolio
related: [80_adrs/adr_013_procedure_execution_atoms, 80_adrs/adr_005_multitenancy, 80_adrs/adr_017_atom_access_control, 75g_investor_deal_radar, 09_post_saas_substrate_thesis, 28_mcp_first_product_design, _decisions/2026-06-17_brief_national_baseline_websearch_coverage]
---

# ADR-022 — The deal twin and the cross-application capture model

Status accepted as a direction. Build is phased and gated; it is not folded into the active investor-radar QA/Stripe/coverage sprint. Pre-mortem cleared green 2026-06-18 with one load-bearing implementation gate (tenant-private enforcement on every deal-event atom; anonymized-only calibration).

## Context

The investor deal radar answers a question about a listing. But the moment an investor decides to pursue a property, the deal keeps progressing across many web applications the investor already uses (title, lender, e-sign, escrow, inspection, county portals, email). The brief is the entry event, not the product. The product is the deal as it actually unfolds.

This is the transaction-scale instance of the same inverted-digital-twin pattern we are selling Mox at portfolio scale: capture the workflow as it happens, assist, build a living twin, eventually write back. Proving cross-application capture on a single investor deal is the cheapest possible proof-of-concept for the Mox operating twin, on real Austin deals, this quarter, before we owe Mox the portfolio version.

## Decision

Promote the radar's property workspace into a persistent, tenant-private **deal object** with an explicit lifecycle (sourcing, analyzing, offer, under contract, due diligence, closing, owned/operating). Every captured event becomes a **procedure-execution atom** (ADR-013, with the intent/purpose field) on that deal, source-attributed, timestamped, confidence-scored. The deal twin is a timeline of those atoms plus the documents plus the reasoning.

### Capture model (three tiers; the browser session is the unlock)

The extension runs inside the investor's own authenticated browser session, so it can capture from sites we could never reach server-side, with no credentials of ours and no API integration, because it is the user's own data in the user's own session.

1. **We own the surface** (brief, chat, keep/pass, attachments). Already captured. Strongest signal.
2. **Cross-application capture, generic by default.** The user pins a page to the deal; the extension captures URL plus extracted text plus timestamp, and an LLM reads it for deal events. **Dedicated per-site adapters are built only for a few high-frequency structured surfaces** (e.g. e-sign envelope status, a title-portal milestone), never one-adapter-per-site. The generic path is the default; adapters are the exception where precision or automation pays.
3. **Systems of record and write-back** (e.g. a lender API, Yardi for Mox). OAuth, read then licensed write-back. Roadmap; the deepest tier; where Mox specifically lives.

**Public-records data is NOT re-scraped.** Cotality already serves the tax, liens, mortgage, permits, and owner snapshot through the backend. The browser captures live workflow events, not a re-pull of records Cotality already provides. (Supersedes the earlier "public-records adapters" tier, dropped as redundant.)

### Sovereignty (the load-bearing gate)

Deal data is the most sensitive data in the portfolio: actual deals, money, counterparties. Every deal-event atom carries the `tenant-private` accessPolicy (ADR-005/017) and never pools into any shared or public asset. Only anonymized, aggregate calibration signal ("deals shaped like X closed at rate Y") feeds the public-code calibration loop, the same boundary already drawn for the buy-box profile. A capture path that pools raw deal data is a breach of the enterprise customer-trust floor that Mox itself depends on, so this is a hard implementation gate, not an intention.

### Trust UX (the real adoption gate)

An extension that observes authed workflow sites is a different trust and Chrome Web Store animal than one that reads public listings. Capture is opt-in and per-deal (the "pin this to my deal" gesture), never ambient per-site surveillance. The user sees a capture log of exactly what was captured from where, and can delete any of it. The provenance requirement doubles as the trust mechanism. This interacts with the G4 Web Store gate and must be designed, not bolted on.

### Substrate, not just a feature

The deal twin is exposed over MCP, not only in the extension (commitment 4, dual interface). The twin and its calibration outcome loop are Hauska substrate (the canonical agent data catalog for transaction intelligence), which is what makes this a portfolio asset and the Mox proof-of-concept rather than an Empressa feature.

## Consequences

Positive: closes the calibration loop with real outcomes (strengthens commitment 2); produces the Mox capture proof on a shippable surface; deepens the per-user moat from "what you research" to "what you actually do"; bounded engineering because generic capture is the default and Cotality covers records.

Negative / risks: the Web Store permission and privacy posture is a significant trust expansion and could jeopardize review or community trust if the consent UX is wrong; LLM event extraction from arbitrary pages is inherently lower-confidence and must be labeled as such; write-back (Tier 3) carries licensing dependencies (Yardi pattern). 

## Phasing (gated behind this ADR; not in the active sprint)

1. Promote the workspace to a stateful deal object with a lifecycle and a deal-timeline view.
2. Generic "pin to deal" capture plus LLM event extraction, with the full opt-in/consent UX and capture log.
3. The first one or two dedicated structured adapters (e-sign status, title milestone) where they earn it.
4. Tier-3 API/write-back, starting where Mox needs it.

## Alternatives considered

One-adapter-per-site (rejected, unbounded engineering and the cost-commitment yellow). Server-side scraping of authed workflow sites (impossible without the user's credentials; the browser-session model is what makes capture feasible and tenant-private by construction). Re-scraping public records in the browser (rejected, redundant with Cotality).

## Reversal criteria

Reverse or narrow if the Web Store / privacy posture proves unworkable for a public listing (fall back to in-extension capture only, no cross-application observation), or if LLM event extraction is too noisy to be useful at honest confidence. The tenant-private sovereignty gate is non-negotiable and not a reversal lever.
