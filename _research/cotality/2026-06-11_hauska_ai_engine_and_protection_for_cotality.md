---
id: 2026-06-11_hauska_ai_engine_and_protection_for_cotality
title: Hauska AI engine — what it is and how it is protected (outbound to Cotality)
date: 2026-06-11
kind: deliverable-draft
status: draft-pending-operator-verification
related: [2026-06-11_cotality_mcp_integration_call_log, 2026-06-06_cotality_puc_data_protection_one_pager, 80_meetings/transcripts/2026-06-11_cotality_mcp_integration_hannah_call_otter, 77b_cotality_integration_strategy, 14_pricing_framework]
---

# Hauska AI engine — what it is and how it is protected

> **What this is.** The writeup Nick promised Michelle off the 2026-06 MCP integration call: a plain-language description of the Hauska AI engine and how licensed source data is protected by design. It feeds Cotality's permissible-use submission to the Permissible Use Guidance Committee (PUC). Michelle answers two questions for general counsel: what the engine is, and how it is protected. This is structured around exactly those two, and answers head-on the two concerns Cotality named: the data is not used to train models, and it is not scraped.
>
> **The send-ready text is the section below the line.** Everything under "Operator verification" is internal and must be removed before sending. Three claims must be locked first (see that checklist).

---

## Hauska — what our AI engine is, and how your data is protected

*Prepared for Cotality's Permissible Use Guidance Committee review*

### What it is

Hauska is an AI-native intelligence engine for jurisdictional and property questions. Instead of a traditional web platform, we run an AI workflow: an application calls an agent orchestrator, the orchestrator calls a controlled LLM reasoning layer, and that layer calls tools that read from our data sources and our own business systems. Cotality sits in that tool layer as one licensed source among several, alongside building-code intelligence and other property layers.

What the engine produces is reasoning, not a copy of your data. For a given property it determines why a specific data point matters for that property, reconciles it against the other layers that apply, and compresses the result into a small, cited unit of intelligence we call an atom. The atom carries the reasoning, the citation back to the source, a confidence signal, and a timestamp. On a repeat query for the same property the engine answers from the atom rather than re-pulling and re-dumping the underlying data. We do not warehouse your raw data as a competing copy; we hold the compounded intelligence built over it, and we link back to the source by deep link.

The engine is consumed two ways: directly by our own products (plan review, city and enterprise surfaces, real-estate and investor interfaces) and over our own MCP server stack for agent callers. In both cases the same gated, cited, metered path applies.

### How it is protected

Source protection is the architecture, not a setting. Five points cover the concerns general counsel raised.

**Not used to train models.** Cotality data is never used to train, fine-tune, or improve any model. Reasoning runs through commercial LLM provider APIs under enterprise terms that prohibit training on inputs and support retention controls, not a consumer product with a do-not-train checkbox someone can click past. The engine retrieves a specific, cited slice for each query and reasons over that scoped slice; it does not pour your dataset into a prompt or a model. The grains never leave the bucket.

**Not scraped, and never in a public AI environment.** Cotality data is processed server-side on enterprise cloud infrastructure (Google Cloud Run, us-central1) behind a private, key-gated API. It is never uploaded into a consumer chatbot or a general AI tool where a click-through user agreement could turn it into public domain. There is no path by which a user loads your data into a public model. Access is by API and MCP key, behind our firewall, against named provider environments and versions we control and can disclose to your committee.

**Gated and tiered.** Every call is authenticated by key and bound to an access policy. Cotality-sourced content is classed as gated inventory (platform-internal or tenant-private) and routes to our professional and paid tiers, never to a free public surface. Raw licensed data is never exposed on a public-domain surface. A tenant's private data and adjudications stay isolated to that tenant and are never pooled into any shared or public asset.

**Cited and audited.** Every displayed answer carries a citation that links back to the source rather than detaching the content from it. Access and downstream use are registered on an immutable usage ledger, who used what and when, which gives Cotality a verifiable record of use. Attribution and recognition to the source provider are built into the model.

**License-respecting display.** All displayed content is source-cited; insurability and climate content is informational only and never presented as a regulated insurance quote; usage is Texas-scoped for the initial phase; any sub-licensing flows through our metered MCP gate with attribution; caching follows the agreed license terms.

### Precedent and next step

The same protection model is in active discussion with the International Code Council, which carries the identical IP-protection concern. We can provide architecture diagrams and a live walkthrough to support the permissible-use writeup. Tell us the format your committee prefers and we will turn it around quickly.

---

## Operator verification (remove before sending)

Three claims must be locked before this goes to Michelle. They are the ones the PUC presses hardest and the ones a checkbox does not satisfy.

1. **LLM no-training / retention terms, per provider.** The current stack reasons through Anthropic and xAI/Grok (per portfolio ground truth: Anthropic serves chat, findings, intake, and sheet extraction; the property-brief generator is Grok-first). Confirm and be able to name the exact enterprise terms for each provider that will touch Cotality data: no-training-on-inputs and the retention posture. This must be airtight per provider, not generic. If either provider's terms cannot be stated cleanly, narrow which models touch Cotality data before sending.

2. **Ledger tense.** The arrow-two adjudication-to-atom evidence ledger and calibration overlay are now live in production and close end to end through the gate (per the 2026-06-09 recon, superseding the 2026-06-06 one-pager's "built but not yet wired" caveat). But Cotality-specific event registration only begins once the Cotality integration is live, which is still credential-gated and pre-go-live. The text above is written in the present for the ledger primitive and is accurate; confirm you are comfortable presenting it that way to a compliance audience, given Cotality data is not yet flowing.

3. **License-specific terms.** Align the display, caching, sub-licensing, and Texas-scope lines with the actual Cotality license terms under negotiation. These are written to the intended posture, not a signed agreement.

Companion: this pairs with the credential-activation thread (Property app active, token host `api1.cotality.com`; Spatial Tile and RiskMeter hosts to confirm). Supersedes [`2026-06-06_cotality_puc_data_protection_one_pager.md`](2026-06-06_cotality_puc_data_protection_one_pager.md) as the send-ready version scoped to Michelle's ask; that one-pager remains the fuller PUC attestation if the committee wants the long form.
