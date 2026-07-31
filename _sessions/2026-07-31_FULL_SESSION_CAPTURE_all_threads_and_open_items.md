---
id: 2026-07-31_FULL_SESSION_CAPTURE_all_threads
title: Full session capture — every thread covered, what shipped, and the half-finished threads to finish
date: 2026-07-31
type: session_capture (comprehensive; spans 2026-07-29 → 07-31)
agent: claude_code (planner)
owner: nick
status: capture
related: [30_block_cert_harness_spec, 40_hauska_map_3d_implementation_brief, 29_scale_warm_architecture, 2026-07-29_setback_authoritative_source_and_road_decouple, 2026-07-29_MIDSESSION_pe_workbench_mcp_icc_positioning_and_fanout]
---

# Full session capture — all threads

This session was very long and covered many threads. Several got real work then were PARKED mid-discussion when the setback crisis + deploys took priority. This doc brings every thread forward with status, and explicitly surfaces the HALF-FINISHED threads to pick up. Organized: (A) what SHIPPED, (B) the big arcs, (C) the half-thought-through threads to finish, (D) open decisions owed, (E) doc index.

## A. WHAT SHIPPED / IS LIVE (done, verified)

- PE WORKBENCH — bubble-cluster + shared-persistent-dock + atom-cited AI chat. All four waves merged/deployed/live-checked. (specs: pe_workbench_concept_spec, pe_ai_chat_atom_citations_spec)
- PE PAYWALL — R1 live: property-scoped gates + free-message counter; per-property $15 / Pro $99-sale-$149. (pe_paywall_model_and_pricing)
- HYDROGRAPHY LAYER — real county streams (retired derived D8 squiggle). Live.
- FLOOD & DRAINAGE REPORT — first paid report bubble; FD1→FD6 iterations (gradient engine, FEMA-style restyle, dissolved-drainage geometry, ponding rewrite, HAND calibration). Engine 00157-piy + PE main-tip #121 DEPLOYED 2026-07-31. NOTE: flood-study re-refresh is USER-TRIGGERED (paid-report auth); dissolved geometry replaces old squares per-parcel on next authed flood-report open.
- SHARE-FUNNEL + SHEET-OVERFLOW pagination wave — shipped+live.
- DOSSIER expansion (polish/dossier/compare/pins+status) — live.
- SETBACK CORRECTION — the whole BDC/Block-13 arc (see B1). Engine R22-R29 all merged + deployed live (00157-piy); Block-13 data layer 7/7 correct.

## B. THE BIG ARCS

### B1. THE SETBACK / BLOCK-CERT ARC (the session's dominant thread — 15 amendments)
Started: operator caught PE setbacks wrong vs Bastrop's real code (P-3 F15 vs SmartCity 25/5/15/25). Unwound into a chain of root causes, EACH a mold gate now. The one-line: it was never the model (finish+extend CONFIRMED); every failure was coverage/drift/currency/a-specific-bug.
- Bastrop REPEALED B3 → adopted BDC (Ord 2026-06, eff 2026-04-14); we served the dead code (edition-currency gate).
- Source = per-parcel authoritative record (layer-23 OnClick), NOT ordinance chart, NOT road-class. Road twin STAYS but decoupled from setback value.
- Repealed-fallback (descriptor-fixture) = loaded gun → REMOVE/fail-closed (R13); generalize to edition-currency serving gate (R16, OWED before fan-out).
- Cert scope = RENDERED SET not curated list (R11/R14); AREA-SWEEP not parcel-sample (R3); operator live-QA is a named cert step (R6).
- Split-zone = dominant-area district (R26). Parcel-currency: re-plats (R9, e.g. 34065→8741972/3/4). Persisted==recompute (R10). Winding-mismatch null-inset (R28, two-agent-converged). R5 convexity gated behind lot-near-rect (R29). Conflicting jurisdiction sources → disclose-and-pick-one (R25).
- BUILT: the BLOCK-CERT HARNESS (doc 30) — three-way convergence (PE/SmartCity/city-GIS) + measured-geometry-in-feet. THIS is the automated visual/geometry QA instrument the fan-out needs (answers "deploy without eyeballing every county").
- STATE: Block-13 DATA layer 7/7 correct + live. DRAWN-ENVELOPE grade DISPUTED (re-grade #1 6/6 vs #2 3/7 on irregular lots) — RESOLVE via two blind measurers. Then replicate the METHOD to a 2nd block with different characteristics.

### B2. THE FAN-OUT ENGINE (the biggest roadmap program — gated, not behind)
CTX → TX → national onboarding. Scale-warm architecture SKETCHED (doc 29): isolated-regenerate-then-swap, FIPS-partitioned serving DB, county-parallel, shard giants, orchestrated from Command Center, re-warm-safe. Gated on: Bastrop certified-clean (in progress) + build phantom recipe gates 7 (tally+cost) & 8 (smoke) as MECHANICAL (the block-cert harness IS gate 8's seed) + M0-reach hardened + R16 edition-currency serving gate. The block-cert method + the 4 currency gates (edition/source/parcel/persistence) discovered this session ARE the fan-out's safety spine.

### B3. TX SOURCE-OF-RECORD REGISTRY + SCRAPERS (Batch 1 done)
CAPCOG Batch 1: 55 jurisdictions, 54 complete, 5 gaps (registry JSON + coverage summary + shards committed). HEADLINE: found 9 Bastrop-class currency traps in ONE COG (San Marcos/Taylor/Bee Cave/Hays/Williamson/Travis/Caldwell/The Hills + Bastrop) — the edition-currency gate is LOAD-BEARING, not optional. Scrapers: Smithville eCode360 header-first scraper PASS; Pflugerville muni-site STOPPED-honest on robots Disallow (ethics ceiling held). Scraper branch UNMERGED (WIP, own branch owed). We do NOT partner with eCode360 — we scrape.

## C. THE HALF-THOUGHT-THROUGH THREADS TO FINISH (the point of this capture)

These got real discussion then were parked. Each needs a decision or a build to close.

### C1. MCP AS THE AGENT-CONSUMPTION SURFACE (audited, rulings made, NOT built)
Frame: "PE made the property stack HUMAN-consumable; MCP makes the SAME stack AGENT-consumable + discoverable + metered." Audit (mcp_audit_pe_stack_gap): 69 tools / 4 gates, metering REAL (SDK gate-then-serve, Stripe retired), ICC inbound meter LIVE. 5 GAPS: (1) no anonymous geocode front-door, (2) no consolidated facets, (3) flood+bbox, (4) discovery-is-a-cliff (llms.txt/.well-known/agents.txt BUILT-AND-SHELVED on unmerged branch), (5) NO server-side visual renderer (image answers are a real build). OPERATOR RULINGS: MCP v1 = ONLY the PE-PROVEN functions agent-callable (NOT the ~50 unproven cortex tools); MCP visual = rendered-image-now / interactive-embedded-later; ICC = on/off switch (demo ON w/ CC usage screen; default OFF so PE launches).
UNFINISHED: (a) MCP SELF-METERING PRICING — how WE get paid for MCP calls (not just pay ICC); must cohere with PE pricing ($/property vs $/call) + provision Circle. OWED DECISION. (b) MCP front-door build + visual renderer. (c) discoverability merge. (d) R16 edition-currency gate applies here too.

### C2. ICC (first licensed source + demo of the metering model) — ACTION FLAG UNADDRESSED
icc_verification_state: REAL IBC ingest (8,731 atoms), verbatim-compliant, inbound meter LIVE. THE RISK (unfixed): accessPolicy is a LATENT LICENSE EXPOSURE — ICC content carries no platform-internal stamp; ingest hardcodes public-free; not leaking today ONLY by an incidental gate default. FIX regardless of sequence — small contained compliance dispatch. Demo gaps: content→actor reference + per-reference rate + IPMC (2nd book = 0 sections). ICC on/off switch HALF-BUILT (PE ICC citations flag-gated off). The SEQUENCE (ratified): PE→ICC demo→ICC login/metering→plan-review app→wire plan-review for ICC (the BIG use case: does-this-comply)→full ICC agreement.

### C3. POSITIONING / MARKET FRAMING (summary written, agent NOT run)
next_gen_property_layer_positioning_summary: the technical truth for a market-positioning agent — what we joined (CAD/GIS+records+roads+codes+terrain into one graph) + amplified (buildable-answer reasoning, property-line-as-node, cited provenance, report suite, mechanical honesty) + why it's a NEW CATEGORY (verifiable property-intelligence substrate, two doors: humans via PE + agents via MCP) + the Plaid+Stripe-for-property analog. A positioning-agent PROMPT was drafted in chat. UNFINISHED: operator to RUN the positioning agent → category name, per-ICP one-liners, honest differentiator, lead ICP, brand architecture, narrative hooks. Also GTM pivot 2026-07-04 (market footprint per vertical + own the MCP market) frames this.

### C4. TOKENIZATION / PROPERTY-OWNERSHIP FUNDRAISE (discussed, positioned, parked)
Operator asked about tokenizing property ownership / raising money. RULING: securities-heavy (SEC-regulated); the TECH is trivial, the HARD part is legal/corporate (routes to operator, out of scope for strategic sessions). OUR clean role: the verifiable asset-intelligence + CID-attestation layer UNDER someone else's tokenized property — we're the truth substrate, not the issuer. Ties to the fund/ETF ambition (listed-fund research = comp analysis; extract formation lessons). UNFINISHED: nothing to build; a positioning note if/when it becomes real. Capture so it's not lost.

### C5. SCALE-WARM ARCHITECTURE (sketched, needs the refine pass + prereq build)
Doc 29 is a SKETCH ("sketch it and we will refine"). Open design decisions unresolved: isolated store = temp Neon vs schemas vs object-staging; swap = FIPS-partition vs bulk-upsert vs blue-green; concurrency/shard knobs (need real per-county cost+time baseline — Bastrop/Caldwell give it); orchestrator = Cloud Run Jobs vs queue+triggers; does giant-county shard need cross-shard adjacency reconciliation. PREREQS: phantom gates 7+8 MECHANICAL (block-cert harness = gate 8 seed), M0-reach hardened, Bastrop certified. UNFINISHED: the refine pass + build, AFTER Block-13 hits 100%.

### C6. THE 3D / MAP-VIZ BRIEF (doc 40, filed — Phase 0A is next actionable)
Regulatory-volume-viewer. Phase 0A (visual hierarchy — layer taxonomy, kill choropleth wash-out, reserve amber for subject, progressive-disclosure cold-open) = NEAR-TERM, independent, fixes a LIVE problem. Phase 0B (architecture blockers — dual-parcel dedup, pitch-aware fetch, LOCATE the tile pipeline). Phase 1 (envelope volume extrusion) = flagship, GATED on block-cert-clean. Phases 2-4 (terrain / flood-depth-grid / buildings) = roadmap. UNFINISHED: everything — Phase 0A is the next actionable workstream. OPEN QS in the brief: where's the PMTiles build pipeline; does MapLibre 5.24 anchor fill-extrusion-base to terrain; PMTiles schema; FAR/lot-coverage facet gap.

### C7. RE-APPS INLINE ATOM-CHIP UX (queued behind the wedge) + RADAR user-aware entitlement
From memory, pre-session but still open: finish chip→brief→full-detail cited-citation UX across RE apps; Radar entitlement must be user-aware not install-keyed (Max + workspace history strand on install_id); standalone deep-dive portal direction. Not touched this session; flag so they don't drop.

## D. OPEN DECISIONS OWED (operator calls)
1. Block-13 envelope-grade conflict → resolve via two blind measurers (bounded).
2. MCP self-metering PRICING model (C1a) — how WE get paid; cohere with PE pricing; provision Circle.
3. ICC accessPolicy fix (C2) — do regardless of sequence; small compliance dispatch.
4. Run the positioning agent (C3).
5. PE #118 — hydro seat owns (rebase-onto-main-taking-flood-version, or close); flagged, SAVED for them.
6. Scraper WIP branch — commit to own branch (currently uncommitted in hauska-engine).
7. Vercel Pro plan (11/12 fn cap), engine min-instances=1, live-payments-wave timing (parked operator calls).

## E. DOC INDEX (this session's generated docs)
Specs/canonical: 29_scale_warm_architecture, 30_block_cert_harness_spec, 40_hauska_map_3d_implementation_brief.
Decision record (15 amendments): 2026-07-29_setback_authoritative_source_and_road_decouple.
Catalog: tx_jurisdiction_source_registry(.json + coverage_summary + 6 shards), tx_capcog_batch1_seed, bastrop_downtown_drill_test_area.
Inbox specs: pe_workbench_concept, pe_paywall_model, pe_ai_chat_atom_citations, pe_hydrography_and_flood_drainage, mcp_audit_pe_stack_gap, icc_verification_state, next_gen_property_layer_positioning_summary, tx_registry_and_scraper_WDLL, B1/B2 scraper STATUS, BASTROP_CERTIFIED_CLEAN_audit, BASTROP_DOWNTOWN_DRILL_WDLL + area_sweep_audit, block13_cert_first_run_matrix, hydro_vs_fema_rendering_handoff.
Dispatches: TX_REGISTRY_shared_preamble, BDC_DOWNTOWN_STEP0-4+7.
Sessions: 2026-07-29_MIDSESSION_pe_workbench_mcp_icc_positioning_and_fanout, this doc.
