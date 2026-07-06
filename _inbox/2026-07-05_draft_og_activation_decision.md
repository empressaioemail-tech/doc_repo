---
decision_id: 2026-07-05_og_vertical_activation
date: 2026-07-05
owner: Nick
status: draft
related_canonical: [_verticals/oil_gas/00_oil_gas_index.md, _verticals/oil_gas/50_complete_product_plan.md, _verticals/oil_gas/40_chris_app_overlay.md, _verticals/oil_gas/85_landman_data_model_review.md, _verticals/oil_gas/60_data_package_and_providers.md, _decisions/2026-07-04_master_map_and_console_unification.md, _decisions/2026-07-04_convergence_program_execution_model.md, 80_adrs/adr_025_og_atom_ontology.md]
---

<!-- DRAFT for operator ratification. Target path: _decisions/2026-07-05_og_vertical_activation.md. Status flips to active on Nick's go. -->

> **Operator ruling 2026-07-05 (full skeleton scope, no narrowing).** An earlier revision of this draft activated only the twin-plumbing path and deferred the title slice, omitted the adjudication admin panel, and left H-10 injection unnamed. Nick ruled the skeleton carries the full scope resolved in the 2026-07-03 session: the visualization cannot exist accurately without the rest. The execution path below reflects that ruling: H-10 in the adapter set, the admin panel as a first-class parallel lane from first atoms, and the bounded Reeves title slice in scope. County-clerk direct ingestion at scale remains gated on the cost checkpoint; the slice runs aggregator-sourced.

## Decision

Activate the Reeves/O&G vertical as a build commitment. The oil and gas folder graduates from exploration posture to an active workstream for the Reeves slice, under the operator's framing: Chris's mockup is the visualization layer of the Permian twin, the operations lens flows into the land lens, and everything reads one atom graph through three lenses (operations, land, capital). The build follows a dependency-ordered path: the atom-contract 1.7.0 O&G ontology ADR (ADR-025) lands first, then the RRC adapters Reeves-first (production including H-10 injection and disposal, permits, P-4, P-5, completions), with the adjudication admin panel starting as soon as the first atoms emit, then the Reeves corpus mint with a non-vacuous eval gate, the bounded Reeves title slice (two to three tracts, aggregator-sourced) in parallel, then O&G layer keys registered into the map-renderer LAYER_REGISTRY, then the thin BFF integration contract with Chris alongside the O&G MCP tools, then the 3D lateral lens as the one genuinely new map extension. County-clerk direct title ingestion at scale is not activated by this decision; the buy-or-aggregate question from `60_data_package_and_providers.md` stays open and routes through the Reeves cost checkpoint, with the slice's per-tract aggregator cost as its first real input.

## Context

The convergence program's build lanes drained on 2026-07-05 (tracker: `_inbox/2026-07-04_convergence-program_STATUS.md`). The deploy chain is complete and verified live: the MCP four-gate rework is deployed to prod (63 tools, gate matrix probed), and cortex-api, engine-api, and retrieval-api are all redeployed on current main with rollback handles. Tenancy T1 is built and staged across all three repos, awaiting only the operator-approved coordinated flip. The ICC backend is live end-to-end (adapter merged, live e2e run against IBC2018P6 produced 4,966 code-section atoms), with only the deliberate corpus ingest run queued. The console unification is merged and live on Vercel. The Reeves skeleton was the program's named parallel lane, gated behind the contract publish; `@hauska/atom-contract@1.6.1` is live on npm (verified 2026-07-05), so that gate is open. The operator ratified activation with the direction that Reeves O&G needs to ship soon and must jive with what is in flight.

The vertical's groundwork is already filed: the complete product plan (`50_complete_product_plan.md`), the Chris slice (`40_chris_app_overlay.md`, the `slb_prototype` backend built and shipped), the landman review packet with the full entity and relationship model (`85_landman_data_model_review.md`, currently in front of Herbert), the data package and provider landscape (`60`), and the 2026-07-04 master map decision that already sequences 3D subsurface rendering and the O&G layer families with the Reeves skeleton.

## The framing this decision ratifies

One product, one graph, three lenses. Chris's Permian Field Health mockup is the visualization layer of the Permian twin, not a separate app with its own backend: the well, wellbore, completion, zone, and production atoms his surface renders are the same atoms the land lens reads when it asks what production is holding which lease, and the same atoms the capital lens reads when it asks who owns the revenue stream. Operations flows into land because the revenue that the operations lens surveils is the revenue that lease obligations protect; the lease-to-well seam is a first-class link in the ontology (ADR-025), not an integration between two products. This is the four-layer, three-lens model from `50_complete_product_plan.md` moved from vision to build.

## Focus-queue accounting

What makes room: the convergence program's build lanes just drained. Deploy chain, T1, ICC, and the console all landed, as itemized above. The remaining convergence queue is either operator-gated (T1 flip, npm automation token, extension key rotation, Upstash replacement, Cotality production keys) or a bounded run (ICC corpus ingest), none of which occupies the build lanes Reeves needs.

What stays queued, named per the focus-queue rule: the ECI atomization sprint stays queued. The Mox demo iteration stays parked on its rescued branch. The eval-scores publication stays gated; its curated-query discipline folds into the Reeves mint gate rather than running as a separate lane. SmartCity OS remains absolute no-touch. The RE apps' inline atom chip UX catch-up stays queued behind the wedge. Nothing is killed.

## Structural commitment check

Premortem-check run 2026-07-05; overall green with two named resolutions.

Commitment 1 (sell reasoning): supports. RRC public records ingest as public-free atoms carrying reasoning chain, source citation, confidence, and timestamp; commercial providers remain pass-through paid tiers priced at floor per `60`; the margin is the reasoning (obligation status derivation, title chain assembly with explicit gaps, HBP determination), never data resale.

Commitment 2 (confidence earned, not asserted): supports with a resolution baked in. The domain starts with zero calibration, so every O&G confidence ships as `provenance: "asserted"` with citation and verification state; the contract makes bare scalars unrepresentable. The Reeves corpus mint gate requires real curated eval queries, never a vacuous pass; the eval-scores branch incident (32 jurisdictions "passing" with zero queries evaluated) is the precedent this gate exists to prevent.

Commitment 3 (cost per jurisdiction): the O&G analog is an open calibration, named here rather than papered over. Cost per county onboarded splits into two very different shapes: state-level RRC work (one EBCDIC/PDQ adapter amortizes across every TX county) and per-county title ingest (the structurally hardest layer, which is why the commercial aggregators exist). This decision activates the state-level RRC leg, the Reeves mint, and a bounded aggregator-sourced title slice whose per-tract cost is deliberately measured as the checkpoint's first title-cost datapoint. The admin panel is the human-review half of the cost instrument. The Reeves checkpoint measures actual compute plus human-review cost and sets the O&G per-county envelope before any expansion decision; county-clerk direct ingestion at scale does not start until that calibration exists.

Commitment 4 (MCP-first): supports with a sequencing rule. This is a net-new product, so the O&G MCP tools (query a lease, check obligations, pull production, trace a wellbore) land with or before the thin BFF. The BFF fronts the MCP and engine surface for Chris's frontend; it does not replace the agent surface.

Spine rule: this is a vertical expression of the existing substrate, per the decision-rule posture recorded in `00_oil_gas_index.md` at the folder's creation. The atoms are contract atoms, the corpus is engine corpus, the gate is the MCP gate, the map is the shared LAYER_REGISTRY.

Tenant sovereignty: operator telemetry, private books, interests, and obligations are tenant-private and never pool; the RRC public record is public-free. The split is carried on every atom type in ADR-025. Live tenant enforcement strengthens when the T1 flip lands; the ontology ships the accessPolicy shapes now.

## Dependency-ordered execution path

Stacked in execution order with dependencies named; no timeframe estimates.

1. **ADR-025, O&G atom ontology, atom-contract 1.7.0.** Additive minor on top of 1.6.1 (live). New `./og` subpath, the atom types and links serving all three lenses, reconciliation with the ADR-020/021 encumbrance family. Herbert's corrections from the `85` review packet fold in before the version freezes. Everything downstream consumes these shapes.
2. **RRC adapters, Reeves-first.** Production (PDQ plus EBCDIC bulk, honoring the oil-at-lease versus gas-at-well reporting split), H-10 injection and disposal volumes (water/injection is an upfront build and its own tier per the 2026-07-03 ruling, and it is the headline attention layer of the free twin), and permits/regulatory events (W-1, P-4, P-5, completions). State-level work that amortizes across counties; the adapter-and-peel competence from the code corpus applied to a new domain. Depends on 1.
3. **Adjudication admin panel.** Starts as soon as the first atoms emit and runs in parallel with 2 through 5. The graph QA and adjudication instrument over atoms, nodes, and edges: it IS the commitment-3 human-review cost gate and the calibration-evidence capture point (corrections persist as adjudication events per the evidence-ledger pattern), and nothing in the corpus is presented as verified except through it. Built as a spine-console panel family per the 2026-07-04 console unification, not a fork. The skeleton cannot exit without it.
4. **Reeves corpus mint plus eval.** Mint the Reeves County corpus (wells, wellbores, completions, RRC leases, operators, production and injection streams, fields) through the engine. Gate: curated per-domain eval queries with real assertions, cost capture for the commitment-3 checkpoint. Depends on 2.
5. **Reeves title slice.** Two to three tracts Herbert names, aggregator-sourced (TexasFile-class, not county-clerk scraping for v1), minting `tract`, `recorded-instrument`, and `ownership-interest` atoms with run-sheet chains and gaps rendered as gaps. The highest-risk, highest-value layer of the wedge (title plus obligations are the first-check co-headline); its per-tract cost is the first real input to the buy-or-aggregate question. Runs in parallel with 4 once 1 lands; adjudicated through 3.
6. **O&G LAYER_REGISTRY keys.** Register the O&G layer families (leases, wells, laterals, production-over-time, injection/water, facilities, title-fabric) into map-renderer's LAYER_REGISTRY with allocation policy, per the 2026-07-04 master map decision; no forked map. Depends on 4 and 5 for real data, can scaffold against 1.
7. **Thin BFF contract with Chris.** The stable product API in front of the MCP and engine surface that his frontend calls, per the `40` integration recommendation. O&G product key on the gate; MCP tools land with or before this surface. Depends on 1 through 4.
8. **3D lateral lens.** Wellbore directional paths and perforated intervals at depth, the one genuinely new rendering extension, landing with the Reeves skeleton exactly as the master map decision sequenced it. Reads `wellbore` directional survey references from the ontology. Depends on 6.

## Honesty guardrails (carried from 40, binding on this workstream)

First, the SLB track and the operator track are never conflated. Chris's Permian Field Health engagement has SLB as the customer; the Reeves twin is our own operator-product track for the underserved SMB segment. Chris's mockup being the visualization layer of the Permian twin is an architectural statement about shared components and one atom graph, not a commercial merger of the tracks. Nothing anti-SLB or cross-vendor-neutral is pitched in the SLB channel; nothing SLB-proprietary (their data, Chris's SLB frontend work) enters the operator product.

Second, anomaly scoring is net-new and is never shown as running. The certainty layer's reasoning, provenance, and confidence invariants are live substrate; the anomaly-scoring analytics that would produce a field health index is not built. Every capability shown to Chris, Herbert, or any counterparty carries its LIVE, BUILT, or PLANNED label.

## Open flags carried, not resolved here

"Empressa Land" (used in `86_executive_summary.md`) remains a working name pending catalog-thesis-check, per open flag 1 in the folder index; this decision does not canonize it. Herbert's landman review is in flight; his corrections are an input to ADR-025, and material contradictions rev the ADR before the corpus mints at scale. Data licensing and redistribution for any paid tier remains a counsel item routed to Nick, never critical path per the standing rule.

## Reversal criteria

Revisit if the Reeves cost checkpoint shows the RRC leg blowing any reasonable per-county envelope with no engineering path down (the commitment-3 hard-kill instinct applies to the analog once calibrated); if the 3D subsurface extension fails to compose with the 2D LAYER_REGISTRY (the master map decision's own reversal signal, which would force a fork this decision assumes away); if Herbert's review invalidates the entity model structurally rather than at the field level; or if the SLB engagement collapses in a way that removes the funded operations-lens counterparty and changes the sequencing calculus.

## Dependencies

Depends on: `@hauska/atom-contract@1.6.1` live (verified), the 2026-07-04 master map and console unification decision (LAYER_REGISTRY, 3D sequencing), ADR-020/021 (encumbrance family the land leg reconciles with), ADR-013/015/017 (procedure-execution, actor, accessPolicy primitives the ontology reuses). Strengthened by, not blocked on: the T1 tenancy flip (tenant-private legs ship shapes now, enforcement hardens at the flip). Depended on by: the Chris BFF contract, the O&G MCP toolset, the capital-lens work in `50` Domain 7, the eventual Permian expansion.

## Counterparties

Chris (BFF integration contract, layer consumer for the visualization layer). Herbert (landman data-model review feeding ADR-025). SLB (unaffected by this decision; their engagement runs on its own track under the conflation guardrail).
