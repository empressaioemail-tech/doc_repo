---
id: 2026-06-06_cotality_puc_data_protection_one_pager
title: Cotality PUC data-protection one-pager (outbound draft for Gene)
date: 2026-06-06
kind: deliverable-draft
status: draft-pending-operator-verification
related: [77b_cotality_integration_strategy, 90_runbooks/cotality_mcp_setup, 72_hauska_inc_operations, 14_pricing_framework, 80_meetings/transcripts/2026-06-cotality_corelogic_gene_sales_engineer_call_otter]
---

# Cotality PUC data-protection one-pager

> **What this is.** An outbound attestation for Cotality's Permissible Use Guidance Committee (PUC), the board that vets anything touching AI, requested by Gene on the 2026-06 eval call. Gene's stated fear: that Cotality data gets uploaded somewhere it becomes public domain through the AI components in use. The call established that a training-opt-out checkbox is explicitly insufficient for the PUC; they want architectural protection. Since the Cotality integration is pre-go-live (credential-blocked), this attests how their data is protected by design when integrated.
>
> **Status: draft, pending operator verification before send.** Three claims must be locked first (see the checklist at the bottom). Do not send until those clear.

---

## Hauska — Data Protection and Permissible Use
*Prepared for Cotality's Permissible Use Guidance Committee review · 2026-06-06*

**What Hauska is.** An AI-native substrate for jurisdictional and property intelligence. Source protection is the architecture, not a setting. Licensed data such as Cotality's is processed inside our controlled infrastructure and surfaced only as cited, gated, metered units, never dumped wholesale into a model or a public surface.

**Where the data runs.** Cotality data is processed server-side on enterprise-grade cloud infrastructure (Google Cloud Run, us-central1), behind a private, key-gated API. It is never uploaded into a consumer AI application or a general chatbot. There is no path by which a user uploads all of your data into a public tool.

**How the AI components handle it (the core concern).** Cotality data is never used to train any model. Reasoning runs through commercial LLM provider APIs under enterprise terms that prohibit training on inputs and support no-retention, not a consumer product with a do-not-train checkbox. The substrate retrieves a specific, cited slice for each query and reasons over that scoped slice with its provenance attached; it does not pour the dataset into a prompt. The grains never leave the bucket.

**Access control and tiering.** Every call is gated by key and bound to an access policy. Cotality-sourced content is classed as gated inventory (platform-internal or tenant-private), and the premium Cotality SKUs gate to professional and paid tiers (Cortex, SmartCity, Builder and Pro), never the free consumer brief. Raw licensed data is never exposed on a public-domain surface.

**Provenance and audit.** Source protection and attribution are built into the substrate via event registration on an immutable ledger: each access and downstream use is recorded, who used it, what, and when, giving Cotality a verifiable usage record. Every displayed answer carries a citation that links back to the source rather than detaching the content from it.

**Display and licensing posture.** All displayed content is source-cited; insurability and climate content is informational only and never a regulated insurance quote; usage is Texas-scoped for v1; sub-licensing flows through the metered Hauska MCP gate with attribution; caching follows the agreed license terms.

**Precedent.** The same protection model is in active partnership discussion with the International Code Council, who carry the identical IP-protection concern.

**Next step.** We can provide architecture diagrams and a live walkthrough to support the permissible-use write-up. Tell us the format your committee prefers.

---

## Operator verification checklist (clear before sending)

1. **LLM no-training / zero-retention terms.** The single claim the PUC will press hardest, and the one a checkbox will not satisfy. Confirm and be able to name the exact provider terms for each model that will touch Cotality data (Anthropic and xAI/Grok per the current stack). This must be airtight per provider, not generic.
2. **Provenance / ledger tense.** Confirm how much of the event-registration / ledger wiring is live in production today versus designed, so the attestation's tense is accurate for a compliance audience (the SDK ledger primitives are built but not yet wired into the live data path per the 2026-06-06 recon).
3. **License-specific terms.** Align the display, caching, sub-licensing, and Texas-scope lines with the actual Cotality license terms under negotiation.

Pairs with the credential-activation escalation: sending both together (data-protection architecture for the PUC, plus the three demo apps returning `oauth.v2.InvalidClientIdentifier` across all gateways) advances the relationship and the unblock in one message.
