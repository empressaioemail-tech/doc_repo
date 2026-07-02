---
id: research/2026-07-02_ai_native_and_twin_review
title: Deep review synthesis — AI-native, architecture-at-scale, and the digital twin
status: active
date: 2026-07-02
related: [09_post_saas_substrate_thesis, 08_tiered_access_model, 25_atom_architecture_reference, 77_place_graph_strategy, 54_tenant_leg_sprint, 56_engine_extraction_sprint, 80_adrs/adr_005_multitenancy, 80_adrs/adr_013_procedure_execution_atoms, 80_adrs/adr_017_atom_access_control, 80_adrs/adr_022_deal_twin_and_cross_application_capture, _inbox/2026-07-02_deepreview_ai_native_DR1, _inbox/2026-07-02_deepreview_architecture_DR2, _inbox/2026-07-02_deepreview_twin_DR3]
---

# Deep review synthesis — AI-native, architecture, and the twin

Three read-only analyst passes (DR-1 AI-native, DR-2 architecture-at-scale, DR-3 twin/node/customer), run 2026-07-02 as part of Phase 2 to shape Phase 3. Raw findings are the three `_inbox/2026-07-02_deepreview_*` files. This is the synthesis and the recommendation.

## Verdict

The "make data AI-native" claim is substantially earned on the read path and the earning loop, and the architecture is more built than the docs say. The gaps are real but they are builds, not redesigns, and they cluster into three actionable fronts: an unstructured-to-atom ingestion pipeline (unblocks datarooms and the marketplace), a single tenant-enforcement control plane for the reasoning surface (the twin's spine), and the closing of three atom-native affordances that already have their interfaces (vector retrieval, agent write-back, confidence-at-the-wire). None of this is green-field. The twin itself is roughly 90 percent composition of machinery that already exists.

## 1. Data AI-native — solid on read and earning loop, three build-not-redesign gaps

Genuinely solid, verified in code: the atom contract is a compile-time-enforced package; minted atoms carry real provenance (sourceAdapter, sourceUrl, contentHash, fetchedAt); accessPolicy is a live five-value gate; MCP is a real 59-tool multi-product surface; and the earned-confidence calibration loop is live in `engine-core/calibration/` (Bayesian-blends observed outcomes against an asserted prior, invalidates on edition change, never pools tenant-private signal into public). This last is stronger than our own docs claim.

The three gaps:

1. Unstructured-to-atom ingestion exists only for code text. The engine atomizes code PDFs and HTML into `code-*` atoms and nothing else. There is no adapter that mints a provenanced atom from an arbitrary dataroom file (survey, title, geotech, plat, spreadsheet, DWG). The pieces are present but unconnected (encumbrance atoms already carry `sourceDocumentCid`, workspace attachments accept pdf and image, product uploads already POST blobs), so this is wiring plus per-type adapters, not new infrastructure.

2. Semantic retrieval is schema-only. The `atom_embeddings` table is a declared placeholder; no embedding is ever computed; all retrieval is keyword and SQL filter plus score. Agents cannot retrieve by meaning. The `search()` signature is already designed to accept vectors, so this is a build behind a stable interface.

3. Agent write-back into the durable spine is absent. ADR-013 procedure-execution atoms are unimplemented in the engine (grep returns zero); the 24 MCP write tools write legacy pseudo-DIDs to the legacy backend and the round-trip into the spine graph is not wired. Related: the three-axis widthed confidence in `ReadContract` is computed internally but stripped at the MCP wire (a pending Wave 2 co-bump), and VDA signing is a no-op (so trust currently requires the platform).

## 2. The unstructured-to-atom design (unblocks Dataroom and the marketplace)

This is the actionable output and it matches the operator's own intuition. The rule:

Ingest every real-world document as point-to: one content-addressed blob, and atoms that hold `sourceDocumentCid` plus extraction provenance. Use embed-with only for small born-digital text fragments that are themselves the unit of meaning. The decision rule is: embed-with when the atom's content is small text that IS the meaning; point-to when the atom is a claim extracted FROM a document that remains the source of truth.

Mechanism: add a `document-ingest` stream to the engine that pins the blob, classifies it, runs a per-type document adapter to extract typed domain atoms (reusing the RawPdfAdapter OCR/LLM path and the existing encumbrance and workspace schemas), stamps each atom with provenance plus an asserted-baseline widthed confidence, and lets the already-live calibration overlay earn the calibrated axis over time.

Why this is the right shape: the Dataroom tile becomes a workspace view composing uploads with their extracted, cited, confidence-graded atoms, and the marketplace falls out for free. Point-to keeps the licensed blob gated as `tenant-private` while the extracted reasoning atoms become the `public-paid` SKU. The point-to versus embed-with split is therefore also the commercial firewall that preserves sell-reasoning-not-raw-data (doc 08 and structural commitment 1). This is the design the Phase 2 Dataroom builds to.

## 3. Architecture at scale — tenancy on the wrong half is the one blocker

The tenant primitive is real and clean (five-value accessPolicy, the `jurisdiction_tenant` key column, isolation wired into the 8 corpus-read tools). The blocker is that the roughly 40 reasoning and workspace tools that route through cortex-api do not enforce at the gate; they forward tenant headers and trust cortex-api to self-enforce, and cortex-api reaches the engine directly, bypassing the gate. So enforcement lives on two surfaces that can drift, there is no tenant-private write or owned-collection primitive, and isolation has never been proven against two live tenants (prod runs anonymous-default).

The multi-investor digital twin is exactly N private tenants depositing private intelligence onto a shared spine with the private layer never pooling. That is the `tenant-private` partition, and every downstream promise (private deal books, per-investor collections, Mox's private flywheel, learns-your-city) consumes that one unbuilt primitive. The critical path, in order:

1. Make the gate the single enforcing chokepoint for the reasoning surface (not just corpus reads).
2. Build the tenant-private write and owned-collection semantics (the queued `54` step 2).
3. Onboard one real second tenant (SmartCity or Bastrop) and run the ADR-005 Layer B zero-cross-leak load test.

Supporting, non-blocking: product BFF ops ceilings (max-instances 10, min-instances 0, ~20 secrets pinned to `:latest`, single Neon with per-request calibration reads) cap 100-tenant load; the calibration loop is closed and sovereignty-safe but unfueled (fix is the M1 backtest fuel, not machinery).

Good news that removes two feared items: the Cotality map-mesh cache is live (a three-tier spatial-tile, attribute, and geocode cache), and the engine reasoning extraction is far more complete than `56` claims.

## 4. The digital twin — roughly 90 percent composition

Shape: the property node (anchored via the place graph in `77`: address to parcel id to legal description to jurisdiction) becomes a first-class aggregator, with everything hanging off it by reference (not containment, per `25` Section 6) so each overlay keeps its own lifecycle and accessPolicy. Three strata coexist on one shared node: public base (hazard, setbacks, zoning, comps, code), tenant-private engagement and review (ADR-013 procedure-execution, already modeled by ADR-022's deal object), and the new tenant-private operational overlay (utility, BIM, sensor, accounting). Multiple investors or operators on one property are multiple tenant-private overlays on one shared node, filtered at the gate.

Lifecycle: resolve node, assemble the public base (place dossier), open an engagement, layer private operational data (extending ADR-022 past closing into owned and operating), version bitemporally on the existing observedAt / atomizedAt / provenanceTier model.

Operational-data ingestion: utility bills and BIM ride the section-2 document-ingest pipeline as typed atoms. Live IoT sensor streams are the one genuinely new contract affordance and take a distinct three-tier shape (a sensor-identity atom, a referenced external time-series, and derived-event atoms); they warrant their own small ADR when built, and they are out of scope for the document pipeline.

Twin-creator customer persona: shape, do not spin up a new workstream. Split it. A firm consuming our jurisdictional and market intelligence into their own twin via MCP is the already-named PropTech-embedder persona (doc 08), already priced at Layer 2, expressing the spine rule strongly; pursue opportunistically through the existing embedder motion. A firm wanting us to host or co-own their operational twin is the same capability as Mox, which ADR-022 already names as the deal-twin proof-of-concept; park it and let Mox prove the private operational overlay first, then it is a repeatable second instance (exactly how ADR-005 frames the second tenant). Opening a parallel twin-creator build now would build the enterprise-operating-twin twice and trip the focus-queue rule.

## 5. Recommendations, ranked

Phase 2 (now):
- Build the Dataroom tile plus the engine `document-ingest` stream to the section-2 point-to / embed-with design. This is the highest-value net-new capability and it is the marketplace foundation.

Phase 3 (the twin spine, needs an operator go):
- Tenancy: make the gate the single reasoning chokepoint, build the tenant-private write/collection primitive (`54` step 2), prove a second tenant under load. This is the critical path for the entire multi-investor twin.
- Node aggregator and twin lifecycle: compose `77` node plus ADR-022 lifecycle plus 005/017 partition; write the digital-twin lifecycle ADR.

Adjacent builds (schedule against value):
- Vector retrieval: compute embeddings behind the existing `search()` signature.
- Agent write-back: implement ADR-013 procedure-execution into the spine; stop writing legacy pseudo-DIDs.
- Confidence-at-the-wire: the Wave 2 co-bump to expose the three-axis widthed confidence through MCP.
- IoT stream atom shape: a small ADR when the first operational-twin sensor use case is real.
- AI-native eval: golden agent tasks over the real MCP scored on task success, citation correctness, grounding, and tool-call efficiency, turning the retrieval and write-back gaps into tracked numbers.

## 6. Doc-hygiene corrections surfaced by the review

- CLAUDE.md and current-state say 46 MCP tools; live main is 59.
- `56_engine_extraction_sprint` is marked QUEUED but the C3 BFF cut is unconditional and engine-core is real; status is stale.
- The Cotality map-mesh cache is live; docs and prior memory that call it uncached are stale.
- The calibration loop is live-but-unfueled; docs that imply it is either fully earned or absent are both wrong.
