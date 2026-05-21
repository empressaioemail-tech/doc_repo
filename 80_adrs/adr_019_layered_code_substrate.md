---
id: adr_019_layered_code_substrate
title: "ADR-019 — Layered code substrate (model-code base, jurisdiction amendment overlay, local code)"
status: accepted
last_updated: 2026-05-21
applies_to: portfolio
related: [49_code_ingestion_pipeline, 08_tiered_access_model, 09_post_saas_substrate_thesis, 28_mcp_first_product_design, 73_partnerships, adr_001_atom_architecture, adr_010_atom_graph_traversal, adr_011_atom_identity_across_versions, adr_012_atom_export_format, adr_017_atom_access_control, adr_018_atom_contract_substrate_layer]
owner: nick
---

# ADR-019 — Layered code substrate

## Status

**Accepted 2026-05-21.** Originated in the 2026-05-21 Claude Code strategic session convened to act on two connected moves surfaced during the Hutto TX UDC ingest (cc-agent-E, hauska-engine PR #15; session summary [`_sessions/2026-05-20_hutto_tx_udc_ingest_cc-agent-E.md`](../_sessions/2026-05-20_hutto_tx_udc_ingest_cc-agent-E.md)). Pre-mortem cleared green: all three load-bearing commitments clear, with commitment 3 (cost per jurisdiction) materially improved by the move; one operational yellow on the focus queue, resolved on idle-capacity acknowledgment. The companion move, the ICC and NFPA commercial-layer pitch, is scaffolded in [`73_partnerships.md`](../73_partnerships.md) and is a separate Nick and bizops decision; this ADR proceeds independently of it.

## Material update — 2026-05-21

cc-agent-E's E1 Layer 1 probes established that a load-bearing premise of this ADR is false. The ADR assumed model-code structure (hierarchy, section numbers, titles, anchors) is freely ingestable and only the verbatim normative text is gated. On contact it is not: ICC serves no model-code structure freely. The free Digital Codes viewer (codes.iccsafe.org) is a single-page app that exposes no structure in its HTML, and the only structured feed is the Code Connect API, a paid commercial product with no free tier and no self-provisionable credentials.

Consequence: **Layer 1 ingest is gated on ICC structured-data access (a Code Connect API subscription or a partnership), and on NFPA for the NEC.** The interim deep-link footing still needs no copyright clearance, but it is not independent of the ICC and NFPA relationship as the Status, Decision, and Open-decisions sections below originally state. Those sentences are superseded by this note.

This does not block the layered architecture, which is built and merged (engine PRs #17, #18, #19) and will receive Layer 1 atoms the moment access lands. It does not affect Layer 3 (bespoke local code: zoning, UDC), which ingests freely and continues. Layer 2 amendment overlays attach to Layer 1 and follow it. The ICC and NFPA contact is correspondingly elevated from a parallel bizops prospect to a critical-path dependency for the model-code base; the track lives in `73_partnerships.md`.

## Context

The code ingestion pipeline today ([`49_code_ingestion_pipeline.md`](../49_code_ingestion_pipeline.md)) ingests each jurisdiction's municipal code as a monolith. One adapter run produces one jurisdiction's full corpus from scratch, every time.

A municipal code is not, in structural fact, a monolith. Every Texas jurisdiction's code decomposes into three layers.

The first layer is a shared base of adopted model codes: the ICC family of model codes (the I-Codes), namely the International Residential Code, International Building Code, International Fire Code, International Mechanical Code, International Plumbing Code, International Fuel Gas Code, and International Energy Conservation Code, plus the National Electrical Code (NFPA 70) published by the NFPA. Once multiplied across the editions that Texas jurisdictions actually adopt, this is roughly 30 to 40 distinct documents (the figure is cc-agent-E's, from the Hutto session) covering essentially every Texas city. This base is not jurisdiction-specific. It is the same text everywhere it is adopted.

The second layer is the per-jurisdiction amendment overlay: the local modifications a city adopts by ordinance on top of a model code. A city's building code is in practice "the IRC of edition X with these local amendments." The amendments are jurisdiction-authored and small relative to the base.

The third layer is the bespoke local code: zoning, the Unified Development Code, subdivision regulations, and local-only ordinance chapters that have no model-code parent. This is wholly jurisdiction-authored.

The monolith pipeline re-ingests the shared first layer for every jurisdiction. That re-does roughly 30 to 40 large documents of work per city, which breaks the cost-per-jurisdiction commitment (under 200 dollars compute plus one hour human review, per CLAUDE.md commitment 3) as the catalog scales past a handful of jurisdictions. It also leaves two open-design items in doc 49 unresolved: cross-jurisdictional code reuse (cities adopting shared or other cities' code) and custom-amendment handling (a base code plus local mods).

The Hutto ingest proved the shape of the fix. The Hutto Unified Development Code, the third layer, was a cheap clean ingest at near-zero compute. The Hutto general Code of Ordinances, which carries the first and second layers, is exactly the part that was blocked on eCode360 and routed to the General Code partnership track. The expensive, access-constrained, and copyright-implicating part of any city's code is precisely the shared model-code base that should be ingested once rather than per city.

There is a legal dimension to the first layer. The model-code text is copyrighted by ICC and NFPA. The legal landscape, as noted in the cc-agent-E Hutto session summary, is that Veeck v. SBCCI is favorable in the Fifth Circuit for codes once adopted into law, while ICC v. UpCodes is contested. Hosting verbatim model-code text is the copyright-exposed act. An interim footing that does not host that text sidesteps the exposure entirely and needs no legal clearance to begin.

## Decision

Decompose the code substrate into three layers.

**Layer 1, the model-code base.** The ICC I-Codes (IRC, IBC, IFC, IMC, IPC, IFGC, IECC) and the NEC, by edition. Ingested once into shared `code-edition` and `code-section` atoms, referenced by every jurisdiction that adopts that edition. The base is ingested as a one-time capability-and-corpus investment, amortized across the whole catalog, not as a per-jurisdiction marginal cost.

**Layer 2, the jurisdiction amendment overlay.** Jurisdiction-scoped `code-amendment` atoms, each linked to the model-code `code-section` it modifies, expressing the local modifications a city adopts by ordinance. This text is jurisdiction-authored and is hosted in full.

**Layer 3, the bespoke local code.** `code-section` atoms for zoning, the UDC, subdivision regulations, and local-only chapters with no model-code parent. Jurisdiction-authored, hosted in full. This is what the Hutto UDC ingest already produced.

A jurisdiction's `jurisdiction-corpus` atom references the shared Layer 1 editions it adopts plus its own Layer 2 overlay atoms and Layer 3 sections. The effective rule for a jurisdiction is the model-code base section composed with that jurisdiction's overlay. A query of the form "what does the IRC require for X in this city" resolves to the base section plus the city's amendment on that section, if any.

This closes doc 49's two open-design items. Cross-jurisdictional code reuse becomes the ordinary case rather than a special one: many jurisdictions referencing the same shared `code-edition` atoms is the design, not an exception to detect. Custom-amendment handling has an explicit pattern: base section plus a jurisdiction-scoped amendment-overlay link.

The substrate proceeds now on an interim footing. The Layer 1 model-code base `code-section` atoms host structure, hierarchy, cross-references, and the reasoning layer, and deep-link the verbatim normative text to the publishers' free public viewers (ICC's free read-only code viewer and NFPA's free online standards access) rather than hosting that text. Layer 2 and Layer 3, which are jurisdiction-authored ordinance text, are hosted in full. This footing is on-thesis for "sell reasoning, not data": the reasoning layer is what Hauska hosts and sells, and the raw model-code text is cited, not resold. The interim footing needs no legal clearance to start.

Full licensed hosting of the Layer 1 base text is an upgrade, gated independently on either the IP attorney memo clearing it or an ICC and NFPA licensing partnership landing. Neither gates the interim substrate. The IP attorney memo is parallel bizops and is not a gate on this substrate or on any ingest.

## Alternatives considered

**Status quo: ingest each jurisdiction's code as a monolith.** Rejected. Re-ingests the shared model-code base for every city, which breaks the cost-per-jurisdiction commitment as the catalog scales and leaves doc 49's two open-design items unresolved. The monolith is the problem this ADR exists to fix.

**Layered substrate, but host the Layer 1 base text in full from day one.** Rejected for now, retained as the upgrade path. Hosting verbatim model-code text is the copyright-exposed act. Doing it before the IP attorney memo clears it or an ICC and NFPA partnership lands takes on legal exposure with no need: the interim deep-link footing delivers the identical three-layer architecture and the identical cost win without the exposure. This alternative is not rejected permanently; it is the posture the substrate upgrades to when either gate opens.

**Wait for the IP attorney memo before building the layered substrate at all.** Rejected. The interim footing needs no legal clearance, and the memo is parallel bizops, not a critical-path gate. Waiting forfeits the cost-per-jurisdiction win for no reason.

**Fork amended sections into full jurisdiction-local copies instead of an overlay chain.** Rejected. Baking each city's amendments into a full local copy of every amended section re-creates the monolith problem for any city that amends heavily, and loses the deduplication that makes Layer 1 shared. The overlay chain (base section plus a jurisdiction-scoped amendment link) is load-bearing for the cost win.

## Consequences

**Positive.** Closes the two open-design items in doc 49. Sharply improves the cost-per-jurisdiction commitment: the model-code base is ingested once and amortized, and each new city becomes a cheap amendment-plus-zoning ingest. Raises the value of the publisher partnerships (General Code, Municode) and the standards-body partnerships (ICC, NFPA), because one partnership referral now yields cheap overlay-plus-zoning ingests rather than full monolith ingests. Makes the model-code base a shared free-tier substrate, Layer 1 per [`08_tiered_access_model.md`](../08_tiered_access_model.md), usable across the whole catalog. The interim deep-link footing is a direct expression of "sell reasoning, not data."

**Negative.** The one-time ingest of the roughly 30 to 40 model-code editions is real engineering and corpus work. It is amortized across the catalog rather than a per-jurisdiction marginal cost, the same logic cc-agent-E applied to the decimal-numbered B.2 convention, but it is front-loaded effort. On the interim footing the Layer 1 base `code-section` atoms are structurally thinner than fully-hosted local atoms, carrying structure and reasoning with the verbatim text by reference; a consumer wanting verbatim base text must follow the deep-link. Deep-links can rot when a publisher viewer changes its URL scheme, which needs a link-health check adjacent to B.5 drift detection. Effective-rule resolution adds a query-time composition step (base section plus overlay).

**Neutral.** The Layer 1 base atoms are Layer 1 free-tier substrate and carry `public-free` accessPolicy for the structure and reasoning they host; the verbatim text deep-linked out remains the publisher's. The Layer 2 overlay and Layer 3 bespoke code follow the existing Path A partnership-pending tagging, `platform-internal` until partnership close, as Hutto, Elgin, and Bastrop County are tagged today. The existing `code-amendment` atom type, framed in doc 49 B.5 for temporal amendments, extends naturally to carry jurisdictional amendments; whether it carries them directly or a distinct type is cleaner is an Open decision below.

## Open decisions

These are implementation-mechanism choices left for cc-agent-E, who executes the layered-substrate pipeline work. They distinguish the architectural commitment, settled here, from the mechanism.

Whether the existing `code-amendment` atom type carries jurisdictional amendments directly, or whether a distinct jurisdictional-amendment type or link is cleaner than overloading the temporal-amendment type. Engine call for cc-agent-E.

Which model-code editions to ingest first, and in what order. Likely the editions Texas jurisdictions most commonly adopt, recent IRC, IBC, and IECC editions first.

Deep-link target granularity: section-level deep-links versus chapter-level, depending on what the ICC and NFPA viewers expose as addressable anchors.

Effective-rule composition: query-time merge of base plus overlay, or a materialized per-jurisdiction effective-section atom. Engine and retrieval call.

Link-health and drift detection for deep-links, folded into B.5.

The full-text-hosting upgrade trigger: gated on the IP attorney memo clearing or on an ICC and NFPA partnership landing. Neither gates the interim substrate.

## Reversal criteria

Revisit if the one-time model-code base ingest plus per-edition maintenance does not, in practice, drop the per-city onboarding cost as projected, meaning the amortization assumption fails.

Revisit toward earlier full-text hosting if deep-link rot proves unmanageable at catalog scale. That upgrade then hard-depends on the IP attorney memo or an ICC and NFPA partnership.

Revisit toward materialized effective-section atoms if a downstream consumer finds the base-plus-overlay composition unworkable for retrieval.

An ICC or NFPA licensing partnership landing is an upgrade, not a reversal: it changes the substrate's posture from interim deep-link to licensed full-text hosting and moots the model-code copyright question. This ADR gains a revision-history entry when it does.

## References

- [`49_code_ingestion_pipeline.md`](../49_code_ingestion_pipeline.md) — the pipeline this ADR layers; its two open-design items (cross-jurisdictional code reuse, custom-amendment handling) are closed here.
- [`08_tiered_access_model.md`](../08_tiered_access_model.md) — Layer 1 free-tier substrate; the model-code base is Layer 1.
- [`09_post_saas_substrate_thesis.md`](../09_post_saas_substrate_thesis.md) — "sell reasoning, not data"; the interim deep-link footing is its direct expression.
- [`28_mcp_first_product_design.md`](../28_mcp_first_product_design.md) — the substrate is consumed through the Hauska MCP Server.
- [`73_partnerships.md`](../73_partnerships.md) — the ICC and NFPA standards-body licensor pitch, the partnership move that would moot the model-code copyright question and unlock full-text hosting.
- [`80_adrs/adr_001_atom_architecture.md`](adr_001_atom_architecture.md) — atom contract the layered atoms register against.
- [`80_adrs/adr_010_atom_graph_traversal.md`](adr_010_atom_graph_traversal.md) — typed links; the base-to-overlay link and corpus-to-edition reference traverse this graph.
- [`80_adrs/adr_011_atom_identity_across_versions.md`](adr_011_atom_identity_across_versions.md) — edition identity across versions.
- [`80_adrs/adr_012_atom_export_format.md`](adr_012_atom_export_format.md) — `.atompack` export; a shared model-code base pack is a clean consequence of this ADR.
- [`80_adrs/adr_017_atom_access_control.md`](adr_017_atom_access_control.md) — accessPolicy; Layer 1 `public-free`, Layers 2 and 3 Path A partnership-pending.
- [`80_adrs/adr_018_atom_contract_substrate_layer.md`](adr_018_atom_contract_substrate_layer.md) — atom contract as Hauska substrate.
- [`_decisions/2026-05-20_hutto_tx_prioritized_ingest.md`](../_decisions/2026-05-20_hutto_tx_prioritized_ingest.md) — the Hutto ingest that surfaced this architecture.
- [`_sessions/2026-05-20_hutto_tx_udc_ingest_cc-agent-E.md`](../_sessions/2026-05-20_hutto_tx_udc_ingest_cc-agent-E.md) — cc-agent-E's Hutto session; source of the layered-substrate proposal and the legal-landscape note.
- [`_sessions/2026-05-21_layered_code_substrate_and_icc_pitch_claude_code.md`](../_sessions/2026-05-21_layered_code_substrate_and_icc_pitch_claude_code.md) — session origin.

## Revision history

- **2026-05-21 (Layer 1 access finding):** cc-agent-E's E1 probes established that ICC serves no model-code structure freely; Layer 1 ingest is gated on ICC structured-data access (Code Connect API or partnership) and on NFPA for the NEC. The ADR's premise that the interim deep-link footing is independent of the ICC and NFPA relationship is corrected. See the Material update section near the top. The layered architecture (engine PRs #17/#18/#19) is built and merged; Layer 3 ingest is unaffected and continues.
- **2026-05-21 (origin):** drafted during the Claude Code strategic session acting on the two moves surfaced by the Hutto TX UDC ingest. Ratifies the three-layer decomposition (shared model-code base, jurisdiction amendment overlay, bespoke local code), the interim deep-link footing for the Layer 1 base text, and the decoupling of the substrate from both the IP attorney memo and the ICC and NFPA pitch. Closes the cross-jurisdictional-code-reuse and custom-amendment-handling open-design items in doc 49.
