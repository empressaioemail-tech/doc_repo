---
id: 59_spine_moat_and_high_value_features
title: Spine moat + high-value features roadmap
status: active
last_updated: 2026-06-09
applies_to: portfolio
owner: nick
related: [55_spine_data_intelligence_stack, 56_engine_extraction_sprint, 57_national_code_warming_sprint, 58_gtm_readiness_sprint, 27_engine_evolution_plan, 04a_arrow_two_calibration_capture, 03a_positioning_framework, 14_pricing_framework, 08_tiered_access_model, 73_partnerships, 00d_portfolio_roadmap_reference, 80_adrs/adr_010_atom_graph_traversal, 80_adrs/adr_011_atom_identity_across_versions, 80_adrs/adr_013_procedure_execution_atoms, 80_adrs/adr_021_constraint_resolution_and_precedence]
---

# Spine moat + high-value features roadmap

> **What this is.** The captured set of high-value features that deepen the moat on the (sound) extracted-engine + MCP structure, from the 2026-06-09 strategic discussion at session close. The spine bones are right (gate as single control plane, reasoning/calibration as substrate not product, calibration on a mutable overlay over the immutable corpus, tenant sovereignty at the gate). These are the additions that make the moat real and hard to copy. Each routes to the roadmap ([`00d`](00d_portfolio_roadmap_reference.md)) and, where near-term, to the GTM-readiness sprint ([`58`](58_gtm_readiness_sprint.md)).
>
> **The throughline.** A competitor can scrape codes. What they cannot copy is: a calibration loop that is real and sellable, reasoning that is verifiable and uniform, and coverage that fills itself where demand is. These features build those three.

## 1. User-warm with quality-gated coverage escalation (operator-refined 2026-06-09)

The demand-driven answer to "the architects are everywhere and we cannot know which jurisdictions they need": make warming a user action, but **never ingest user-supplied content into the shared, reusable corpus** (one wrong upload poisons the library for everyone in that jurisdiction; the entire pitch is trustworthy answers). The ladder:

1. **Warm what we can verify.** On address/jurisdiction resolution, auto-discover and warm the model base (shared) + local amendments (Layer 2) + zoning/UDC (Layer 3), web-first, from verified sources (Municode / eCode360 / American Legal cover most US municipalities; ICC/UpCodes for model code).
2. **Coverage assessment.** Produce a per-jurisdiction coverage state: what we have, with confidence and verification status per layer/section.
3. **Honest user notification.** If coverage is incomplete or has issues, tell the user plainly what we *do* have and what is pending (the 55 Section 7 coverage-honesty pill pattern). Never present `unverified-web-source` as authoritative.
4. **Internal escalation, human-in-the-loop.** The AI raises an internal task/alert to Nick/the team with the gap and how to fill it (which source, what is missing). The team curates and verifies the jurisdiction up to par. Only verified content enters the shared corpus.
5. **Team reaches back out to the user.** Closing the loop is a white-glove touchpoint and a demand signal (this architect is in jurisdiction X, which we now know to prioritize).

Spine functionality required: a coverage-assessment service, a gap-escalation mechanism (internal task/alert with the missing-source detail), the user coverage report, and the team curation workflow that gates corpus admission on verification. This protects the library, holds the quality bar, and turns every gap into a relationship and a prioritization signal. It is also the distributed gap-analysis engine (every warm-my-area event tells us what to fill next, by real demand).

## 2. Payment / metering rail activation, via the ICC cutover

The metering substrate (Circle/USDC rail + SDK metering, `@hauska-sdk/*`) is built but dormant. ICC reached out with contract next steps (2026-06-09), and the ICC licensed-display tier IS the Layer-2 paid use case (per [`08`](08_tiered_access_model.md): Layer 1 free, Layer 2 paid). So the ICC ingest/cutover ([`_dispatches/2026-06-08_cc-agent-E_florida_icc_layer1_and_corpus_ingest_GATED.md`], [`73`](73_partnerships.md)) is the right place to flesh out and run **per-call metering through the gate** on the licensed tier — the first real paid surface. The gate already meters per the topology; this activates billing/settlement end to end on a concrete content tier. Rail stays quiet at the buyer-facing layer (I7).

## 3. Uniform provenance contract

Every tool output emits the same provenance envelope: lineage (cited atom-id[s]), sources (authoritative deeplink[s] per atom with edition + retrieved-at + verification state), reasoning chain (rule applied, precedence/reconciliation, project facts), confidence + (Layer-2) calibration grade, timestamp + edition. Today it is uneven — the lineage audit ([`_inbox/2026-06-09_legacy-design-tools_cc-agent-C_lineage_completeness_audit.md`]) found some tools emit real per-citation atom DIDs and others emit a single synthetic `legacy:{rowId}` entry and drop citations. Standardize it at the gate. This is a double moat: it makes answers auditable (the trust/sell-reasoning product) AND it is the lineage rail the arrow-two flywheel rides on (no provenance, no deposit). Near-term; pairs with the GTM-readiness app-by-app cut.

## 4. Precedence / reconciliation — tighten (needs exploration)

`reconcileStandardPrecedence` (ADR-021) is the literal positioning line: the code tells you the rule; Hauska tells you what it means reconciled with every other code that applies. It needs a real exploration pass, not a settled design: (a) is it exposed as a first-class gate tool (`resolve_precedence` / `reconcile_codes`) or only internal? (b) is the taxonomy right — the `federal-preempts-where-applicable` label was flagged conceptually off for ADA-vs-FHA (both federal, co-applicable; the right frame is most-stringent-governs), which is the canary that the precedence model is not fully correct; (c) does it handle the full matrix (most-stringent-governs, federal-preempts, local-overlay, co-applicable) cleanly across model code + amendments + zoning? Scope a recon/exploration dispatch before committing the design. High moat value once tight: it is the slogan made a callable product.

## 5. Moat builders (operator endorsed all, 2026-06-09)

- **Calibration grade as a deliberate, sellable Layer-2 signal.** The compounding, defensible moat: outcome-calibrated code reasoning no competitor has. Rail-quiet today (correct for the basic pitch); surfacing "calibrated at grade X over N observed outcomes" as a paid feature needs a deliberate positioning decision + premortem ([`03a`](03a_positioning_framework.md) already tiers contribution by calibration grade).
- **Real-world outcome capture (permit-office ground truth).** Arrow-two Phase 2 captures reviewer dispositions; the deepest signal (permit issued, variance granted, in the authority of record) is still net-new. Wire it via SmartCity OS permit data and public permit records. This makes calibration *true* rather than reviewer-proxied — the single biggest moat-deepener.
- **Participation flywheel** (the user-warm of #1 + per-jurisdiction calibration accrual). Network effect: more users -> broader and sharper coverage, landing on the next user in that jurisdiction. Plan as architecture, not a feature.
- **As-of-time / version-in-force querying** (ADR-011 models edition identity). "What did the code require as of the permit date." Temporal correctness is a real differentiator for compliance/legal; most tools give current code, not the version in force at permit time.
- **Atom-graph cross-reference traversal** (ADR-010; 55 Section 7 wants it spine-wide). Follow code cross-references and related-atom links. Connected reasoning across the graph is high-utility and hard to replicate.
- **Execution atoms (north star, ADR-013 queued).** The jump from reasoning *about* the code to *acting* — generating the submission, drafting the variance, filing. The deliverable-letter tools already hint at it. The largest moat expansion available, from intelligence to action. v2 territory; hold as the direction.

## 6. Cortex connector candidates (from the 2026-06-10 connector dig)

The connector dig (parallel planning thread, 2026-06-10) mapped the planned connector set against the residential-designer audience and surfaced unplanned candidates. Captured here so they are not lost; only the permit/AHJ one has a decision.

**Planned / in motion** (condensed): parcel/zoning (Regrid live, Cotality 3-increment), hazard (FEMA live, Cotality climate), topo/soil/subsurface (USGS 3DEP live, SSURGO + USGS geology merged), codes (ICC creds-pending, ADA/FHA/A117.1 live, precedence engine merged), hydrology (NOAA Atlas 14), CAD hosts (Revit GA; ArchiCAD/SketchUp/SoftPlan planned). **Deferred from the planned set:** Shovels permits, MLS, FAA/airspace.

**Unplanned candidates** (for the SoftPlan/ArchiCAD residential + light-commercial audience — strong on site/physical/code data, weak on what actually kills projects):

| Candidate | Why it matters | Status |
|---|---|---|
| **Permit-portal / AHJ-precedent** | The designer's #1 question (has this AHJ approved a project like mine, what got red-lined, submittal checklist + turnaround); proprietary operational data; **doubles as arrow-two's deepest ground-truth signal** (permit approved/denied) | **CHOSEN — BUILD, family-first, post-C4** ([`_decisions/2026-06-10_permit_ahj_precedent_connector_recon_seed.md`](_decisions/2026-06-10_permit_ahj_precedent_connector_recon_seed.md), recon cleared) |
| **HOA / CC&R / deed restrictions** | For residential, HOA architectural review + CC&R setback/height/material rules kill more designs than the building code | Candidate — **honesty-gated** (58 says the CC&R cross-layer is unbuilt and must not be marketed); pairs with precedence S4/S5 |
| **Utility / service-territory** | Septic-vs-sewer, well-vs-municipal, tap fees — change the whole site plan; SSURGO gives septic soil suitability but nothing connects service territory | Candidate (mostly data lookup, less reasoning) |
| **Energy / climate-zone** | NREL PVWatts, ASHRAE/IECC climate zone, SECO — energy code (IECC/SECO) is a live compliance surface; Austin@2024 enforces it | Candidate (feeds the code-reasoning layer) |
| **WUI / wildfire trigger** | TX hill-country + western designers hit WUI ignition-resistant construction requirements; Cotality has peril but not the code trigger | Candidate |

## Roadmap routing

| Item | Lane / when | Owner repo(s) |
|---|---|---|
| 1. User-warm coverage escalation | GTM-readiness sprint (58), code-library lane | legacy-design-tools + hauska-engine (coverage svc) |
| 2. Payment/metering activation | ICC cutover / first paid surface | hauska-mcp-server (gate) + hauska-sdk + hauska-engine |
| 3. Uniform provenance contract | GTM-readiness sprint (58), alongside app-by-app cut | hauska-mcp-server (gate) |
| 4. Precedence/recon tighten | Exploration dispatch (recon first) | legacy-design-tools / hauska-engine |
| 5a. Calibration grade sellable | Deliberate positioning decision + premortem | positioning + gate |
| 5b. Real-outcome capture | Deepening (post-launch arc); SmartCity source | legacy-design-tools + smartcity-os |
| 5c. Participation flywheel | Architecture of #1 | spine |
| 5d. As-of-time querying | Deepening | hauska-engine |
| 5e. Atom-graph traversal | Deepening | hauska-engine |
| 5f. Execution atoms | v2 / north star (ADR-013/014 timing) | spine |

## Revision history

- **2026-06-09 (origin):** Captured at session close from the moat/architecture discussion. The extracted-engine + MCP structure is sound; these are the high-value additions. Item 1 (user-warm) refined by the operator to a quality-gated coverage-escalation loop (no user-supplied content into the shared corpus; team curation gates admission). Item 2 (payment) routed to the ICC cutover as the first paid surface. Items 3-5 captured for the roadmap; precedence/recon flagged as needing exploration.
