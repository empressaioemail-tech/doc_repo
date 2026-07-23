---
id: 2026-07-23_atom_family_WDLL
title: WDLL — the property reasoning-chain atom family (zoning-fact / setback-rule / envelope-derived)
status: draft
date: 2026-07-23
applies_to: hauska-engine (spine), hauska-atom-contract, legacy-design-tools (cortex-api reads atoms), hauska-mcp-server, property-explorer
related: [2026-07-23_reasoning_chain_atom_shape_design, 2026-07-23_property_node_atom_fabric_and_engine_diagram, 2026-07-23_engine_family_WDLL, 75j_property_explorer_destination_ledger, 25_atom_architecture_reference, 01a_atom_conventions, 80_adrs/adr_008_engine_factor_out, 56_engine_extraction_sprint]
owner: nick
---

# WDLL — property reasoning-chain atom family

NOTE (2026-07-23): this is now the Phase-1 ANNEX of `2026-07-23_MASTER_WDLL_property_reasoning_substrate.md`. The master owns the done-line, the negative done-line, and the cross-cutting invariants (I-A..I-J) — do not restate them here; each item below is graded against them. The 8-agent review fan corrected several items; the corrections live in the master's Phase-1 section (StoragePort-first, contract-extension as Phase 0.5, consume the setback JSON's existing atom_did/confidence, retire the multiply across all THREE orchestrators, dual-serve cutover not same-PR delete, calibration-overlay read-through, catalog-tool serving path, SDK-restore, executed non-TX descriptor). Where this annex and the master differ, THE MASTER WINS. Retained here for the item-level detail.

Operator approval: PENDING. Frozen at approval; scope changes recorded as amendments below.

## Corrections applied by the review fan (read the master's Phase 1 for the authoritative form)
- Contract has NO generic fact/rule/derived KIND and no reasoning-chain primitive at 1.7.0 — adopt the shipped `production-timeseries` derived idiom (`derivesFromDid`+`derivationMethod`+widthed-confidence) via a Phase-0.5 contract extension. Package is `@empressaio/atom-contract ^1.7.0`.
- `consequence` axis is life-safety-shaped — make it optional/honest for envelope atoms; stuffing it is fabrication.
- No provenance triple — decompose to `sourceCitation`+`extractedAt`/`asOf`+`WidthedConfidence.provenance`+`modelAttribution`; choose `AtomTier` (data|app).
- Item 7 (delete bespoke) must touch route + Tier-1 bake + Tier-2 bake TOGETHER (3 orchestrators) and permit a transitional dual-serve (property-explorer serves users live off this path).
- Item 8 (jurisdiction-agnostic) must be EXECUTED against a committed non-TX descriptor, not a reviewer thought-experiment.
- Item 13 (SDK): the invariant is VIOLATED in live code (gate meters via Stripe) — restoring it = swap `read-attribution.ts` to `McpMeteringGate.authorizeCall` + retire Stripe + CI dep-conformance test.
- MISSING items added in the master: retire-not-overwrite (I-G), quality-gate timestamp on served output (I-C), calibration-overlay read-through (I-E), absence-vocabulary unification.

## Done looks like

The property node's buildable-answer is produced by a real atom chain — zoning FACT atom -> setback RULE atom (cited to code) -> buildable-envelope DERIVED atom — conformant to `@empressaio/atom-contract`, AUTHORED IN THE SPINE (hauska-engine / hauska-atom-contract), not cortex-api. Confidence is the contract's three-axis read-contract (calibrated / asserted / consequence), replacing the ad-hoc `labeling.confidence x district.confidence` multiply. The bespoke `Tier1FacetPayload` envelope path is DELETED, not left beside the atom path (single path, no zombie). The atom-producing code is JURISDICTION-AGNOSTIC (Central-TX values only; no Texas baked into the reasoning) so it is the seed of the Reasoning Engine, not a prototype to rewrite. Central-TX parcels are re-baked to emit these atoms, served through the gate/MCP with accessPolicy, and read identically by the map inspect card, our reporting, and an external agent. Honest-absence and the calibration-vs-asserted distinction are first-class, so the Kyle-R1-T / Bexar-I2-fallback matcher problems become confidence-grading, not fabrication.

Central-TX finished-to-atoms is the completed first production run; the requirements it surfaces feed the Engine WDLL.

## Acceptance items

1. **hauska-engine readiness confirmed (phase 0).** | check: an audit doc states hauska-engine's live atom/corpus infra, whether it can host the envelope atom family today, and the concrete home path; if not ready, the gap + the minimal lift is named. NO atom build starts before this. | grade: [ ]
2. **Atom kinds defined against the real contract.** | check: fact / rule / derived atom schemas exist in hauska-atom-contract (or its spine home), each carrying the five-value accessPolicy + the three-axis read-contract confidence + provenance + (for derived) an input-atom-ref chain; `/conformance` validates a sample of each. | grade: [ ]
3. **Zoning FACT atom.** | check: a live probe on a Central-TX parcel returns a zoning fact atom with district value, provenance (city layer + date), and confidence where a match exists; honest-absence atom (not a null, not an invented district) where no zoning polygon covers the parcel. Bexar null-zoning returns honest-absence, NOT a stamped I-2. | grade: [ ]
4. **Setback RULE atom, cited to code.** | check: the setback atom carries the scalar rule AND a citation to the code section + edition; verification-state (asserted-transcribed vs human-verified) maps onto the confidence axes; a prefix-matched district returns asserted-medium with the prefix as the cited match-basis (dissolves the mapDistrict binary-tightening problem). | grade: [ ]
5. **Setback rule CITES a code atom (codes+setbacks unified).** | check: the setback rule atom references an ICC/code atom as its source-of-rule, not a bare string — proving codes and setbacks are one substrate (at least the reference shape exists; full ICC ingest can be a later fill). | grade: [ ]
6. **Buildable-envelope DERIVED atom.** | check: the envelope atom's inputs are references to the zoning fact + setback rule atoms (+ geometry + front-edge referenced fields); its confidence is COMPOSED via the contract's three axes (NOT `labeling x district`); honest-absence states ("no buildable area after setbacks", "front-edge provisional, road-anchor pending") are first-class atom states. | grade: [ ]
7. **Bespoke path DELETED (single path, no zombie).** | check: `deriveBuildableEnvelope`'s `labeling x district` multiply and the flat setback-table lookup are removed from the live path; the inspect card + read endpoint read ATOMS; grep confirms no second envelope-confidence path survives. | grade: [ ]
8. **Jurisdiction-agnostic by construction.** | check: the atom-producing code + schemas contain zero Central-TX / Texas-specific logic in the REASONING (jurisdiction lives only in descriptor/source/provenance); a reviewer confirms the same code would produce a Cook-County-IL atom given a Cook-County descriptor. This is the anti-zombie gate that makes it the Reasoning Engine seed. | grade: [ ]
9. **Referenced fields stay referenced.** | check: geometry, topo/hydrology, and the road anchor are cited-by-reference inputs on the derived atom, NOT atomized; the front-edge road input is honestly asserted-provisional (shape-tier) until Overpass remounts, then upgrades to calibrated-road without a schema change. | grade: [ ]
10. **Flood migrated onto the node as a fact atom.** | check: FEMA flood (currently a separate spine surface) is a fact atom on the node with FEMA vintage provenance; honest-absence on outage. (May be sequenced late; graded partial if deferred with a reason.) | grade: [ ]
11. **Central-TX re-baked to atoms + gate-verified.** | check: the coverage ledger shows Central-TX parcels emitting the atom family; every promoted value passed its gate (owner-match / citation-resolves / conformance); honest-absence where source is absent; NO fabrication (re-run the owner-match + a spot audit). | grade: [ ]
12. **Served via the gate / MCP with accessPolicy, read by all three consumers.** | check: an external-shaped call (through hauska-mcp-server) pulls a parcel's atom chain with accessPolicy gating (free district vs paid envelope); the map inspect card reads the SAME atoms; a report composes from them. One fabric, three consumers, proven live. | grade: [ ]
13. **Paid-atom monetization routes through hauska-sdk (not a side-channel).** | check: when a `public-paid` or tenant-billed atom is read through the gate, metering + revenue routing go through hauska-sdk (Circle/USDC rail + blockchain settlement + VDA wrapping per ADR-018), NOT a bespoke charge in cortex-api or the map; the gate declares the paywall via accessPolicy, the SDK enforces the money. Free-tier (`public-free`) reads do NOT load the SDK (SDK is on the path only for paid/VDA-wrapped surfaces). A reviewer confirms no paid-atom read bypasses the SDK. | grade: [ ]

## Amendments

(none yet)

## Notes for the executing planner

- This is authored TOWARD THE SPINE per the homes topology (atoms + reasoning -> hauska-engine; hauska-atom-contract holds the contract; cortex-api READS atoms to report, does not own the reasoning). Doing the atom refactor IS the sprint-56 reasoning-lift for the envelope chain — do it once, in the right home, not build-in-cortex-then-migrate.
- Item 1 (hauska-engine readiness) is a HARD phase-0 gate: the planner audits live before committing the home; do not assert readiness from the doc canon.
- The atom shape is designed against the envelope (richest case) so it generalizes to the simpler facts (land-use, zoning) trivially and to compliance findings (same derived shape) later.
- Single-path discipline (item 7) is the anti-zombie core: the atom path REPLACES the bespoke path in the same change; a fallback-beside-it fork is a fail, not a partial.
- SDK boundary (item 13, operator-flagged 2026-07-23): the spine consumes hauska-sdk for the money layer — payment rails + Circle/USDC + blockchain settlement + VDA wrapping + revenue routing. The atom-CONTRACT is consumed directly (atoms exist without the SDK); the SDK is on the read-path only when an atom is MONETIZED (paid-tier / tenant-billed / VDA-wrapped, per ADR-018). Do not let a build agent wire a paid-atom charge anywhere but the SDK. accessPolicy = the paywall declaration; hauska-sdk = the paywall enforcement + settlement.
