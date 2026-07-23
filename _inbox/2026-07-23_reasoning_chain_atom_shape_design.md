---
id: 2026-07-23_reasoning_chain_atom_shape_design
title: Reasoning-chain atom shape — design (envelope as model) + layered spine-fit analysis
status: proposed
date: 2026-07-23
applies_to: legacy-design-tools (node-facet bake, buildableEnvelope), @empressaio/atom-contract, the map-first product line, reporting (Cortex), MCP
related: [75j_property_explorer_destination_ledger, 2026-07-21_architecture_gaps_node_facets_atomization_and_gated_functions, 25_atom_architecture_reference, 01a_atom_conventions, 08_tiered_access_model, 09_post_saas_substrate_thesis, _architecture_homes/02_atoms_lifecycle_ownership]
owner: nick
---

# Reasoning-chain atom shape — design

Operator insight (2026-07-23): the buildable-envelope process is flawed and inconsistent, and the same flawed logic exists elsewhere in the map model. The fix is to atomize the zoning->setback->envelope REASONING CHAIN first (it IS the wedge) and impose ONE atom shape across the map, rather than "atomize everything later." This doc designs that shape against the real `@empressaio/atom-contract`, using the envelope as the model (the richest case), and analyzes which spine layers fit the shape vs which are referenced fields.

## The flaw, named precisely (ground-truth-verified 2026-07-23)

The map model conflates FACT, RULE, and DERIVATION into one bespoke code path PER facet, and computes confidence + honest-absence a different way each time:

- Envelope is the ONLY facet with a composed reasoning chain: `confidence = labeling.confidence x district.confidence` (derive.ts) — two ad-hoc, differently-scaled numbers (front-edge road/point/shape tier 0.35-0.90, x district exact/prefix/fallback 0.35-0.9) multiplied.
- Zoning = GIS stamp passthrough, no confidence.
- Land-use = county-join gate + owner-match recovery — a boolean coverage flag + decline reasons, NOT the product formula.
- Setbacks = a flat table, no link to the code section it came from.
- Flood + topo = not even in the node-facet payload — separate spine/adapter surfaces (ENGINE_SPINE_* on cortex).
- No `@empressaio/atom-contract` import anywhere in the node-facet bake (grep-clean on tip).

So: five facets, five different answers to "what is the value, how sure are we, and what do we say when we don't know" — plus two facets on a different substrate entirely. That is the inconsistency. It is not a bug in the envelope; it is the absence of a shared reasoning-and-trust framework.

## The real atom contract to design against (grounded in 25_atom_architecture_reference + 01a, contract 1.5.0+)

Every conformant atom carries: (a) the READ-CONTRACT three-axis confidence — `calibrated` / `asserted` / `consequence`, each with n / width / provenance; (b) the five-value `accessPolicy` (public-free / public-paid / platform-internal / tenant-private / tenant-shared); (c) provenance (source + vintage + verification state); (d) a signed-history layer for data-level atoms; (e) a context interface (AI-callable); (f) a downloadable-atom export shape.

The killer fit: the calibrated-vs-asserted axis IS the honest-vs-earned distinction the envelope needs. A shape-tier front edge is ASSERTED (a lot-geometry guess, no calibration data); a road-anchored front edge that has been validated against outcomes is CALIBRATED. The contract already has the field for exactly the thing the envelope's ad-hoc confidence is trying (and failing) to express. We are not inventing a confidence model — we are stopping inventing five of them and adopting the one the contract already defines.

## The atom shape, designed against the envelope (the model = the richest case)

Three atom KINDS in the chain, mapped onto the contract:

1. FACT atom — the observed value. Zoning district "RS" from a PIP stamp. accessPolicy public-free. Provenance = the city GIS layer + fetch date. Confidence: `asserted` (a stamp, high asserted confidence, exact/prefix/none as the width); `calibrated` sparse until we validate districts against outcomes. Honest-absence = "no zoning polygon here" is a real value (unincorporated), not a null.

2. RULE atom — the derivation rule the fact dictates. "RS -> front 25 / side 6 / rear 10." This is the key one — today it is a flat table row; as an atom it carries the CITATION to the code section + edition (e.g. City of X UDC S4.2), provenance = the transcription + verification state (this maps directly onto the setback-table gate: asserted vs human-verified), accessPolicy public-free (the rule) or public-paid (the derived answer). THIS is where the moat lives: the rule becomes cited, versioned, calibratable, and — critically — it can CITE a building-code atom (see fit analysis), unifying setbacks and codes.

3. DERIVED atom — the buildable envelope. Its INPUTS are references to other atoms: the zoning fact atom, the setback rule atom, the parcel geometry (a referenced field, see below), and the front-edge anchor (road atom or the provisional shape guess). The derivation (inset polygon) is the atom's value; its confidence is COMPOSED from its input atoms' confidences THROUGH the contract's three-axis model (not an ad-hoc multiply) — and honest-absence is first-class: "no buildable area after setbacks" is a real derived answer, "front-edge provisional pending road anchor" is honest-partial. The chain of input-atom refs IS the reasoning chain — persisted, not assembled-and-discarded.

The unlock this buys, impossible today: EXPLAINABILITY FOR FREE. The map (and an agent via MCP) can render "this envelope, because RS zoning [cited], applies setbacks 25/6/10 [cited to UDC S4.2], from this front edge [road-anchored per OSM way Y / OR provisional lot-shape, road anchor pending], at calibrated-0.6 / asserted-0.9 confidence." Same chain, human-drawn and agent-consumable. This is commitment #1 (reasoning + citation + confidence) made literal, and it is the thing competitors cannot copy — not the setback numbers (public), but the persisted, cited, calibrated derivation.

## Layered spine-fit analysis — what fits the atom shape, what is a referenced field

Operator asked to analyze every layer we tie into the spine. The clarifying line that fell out of the ground truth: the atom shape fits DISCRETE, RULE-DERIVED, CITED values; it does NOT fit CONTINUOUS fields (those are inputs the reasoning references, not reasoning atoms).

| Spine layer | Fit | Why |
|---|---|---|
| Zoning | FACT atom — clean fit | Discrete value + provenance + match-confidence. Trivial. |
| Setbacks | RULE atom — clean fit, the key one | Becomes cited-to-code, verification-state as confidence. The moat. |
| Buildable envelope | DERIVED atom — the model; design against this | Inputs ARE atoms; composed confidence; persisted chain. |
| Building codes (ICC) | FACT/RULE atoms — clean fit + BIG unlock | Code answers are inherently "the code requires X, cited to IBC S Y." The setback RULE atom CITES a code atom — codes and setbacks are the same substrate. This is how row 3 (code/permit depth) and the setback rule unify. ICC content is already citation-shaped. |
| Flood (FEMA) | FACT atom — fits, but it is a MIGRATION not a wrap | The value (in-SFHA + FEMA vintage) atomizes cleanly. BUT it lives on a separate spine surface today (ENGINE_SPINE_*), not the node payload — atomizing it means UNIFYING it onto the node, which is a migration. Worth it (one substrate), but flag the lift. |
| Reporting (Cortex) | RENDERS the chain — the atom contract doing its designed job | A report IS the reasoning chain, formatted. If every value is a cited atom with its chain, the report reads the atoms instead of re-assembling. Per ADR-008 Cortex is the reporting function package that composes atoms — so atomization makes reporting nearly free. Row 6 advances as a side effect. |
| Topo / contours | DOES NOT cleanly fit — a REFERENCED FIELD | Topo is CONTINUOUS (a raster/contour surface), not a discrete rule-derived value. It does not become a "value + rule + citation" atom. It fits as an input the reasoning REFERENCES ("the buildable area avoids the >15% slope per the 3DEP contour [cited]") — the derivation cites the field; the field itself is not an atom. Naming this honestly is important: not everything atomizes, and forcing topo into an atom shape would be the same conflation flaw in reverse. |
| Parcel geometry | REFERENCED FIELD, not an atom | The ring is a continuous input to the envelope derivation, carrying its own provenance (TxGIO vintage) but it is not a reasoning atom — it is the substrate the rules apply TO. |
| Land-use | FACT atom — clean fit | Already gate-validated (owner-match); the gate verdict IS the confidence provenance. Maps cleanly. |
| MCP / agent consumption | The whole point | Atomized facets are served via the atom/MCP catalog with accessPolicy gating (free district vs paid envelope). Row 10 advances; the paywall becomes accessPolicy, not a route check (ties arch gap 2). |

The pattern: FACTS and RULES and their DERIVATIONS are atoms; CONTINUOUS FIELDS (topo, geometry) are referenced inputs the derived atoms cite. This is the answer to "some will fit and some will not" — and it is a feature, not a shortfall: the reasoning chain references honest continuous inputs rather than pretending they are discrete rules.

## Why this is the entry point (supersedes "atomize later")

Doing the zoning->setback->envelope chain FIRST, against this shape:
- Fixes the envelope's own inconsistency (one composed confidence via the contract's three axes, not the ad-hoc multiply) — arguably fix-into-the-shape rather than fix-then-wrap.
- Imposes ONE trust/absence framework where there are currently five — the map stops being "works but inconsistent."
- Advances the moat rows (2 answer, 7 trustworthiness), architecture-reconciled (16), agent/MCP (10), and — via the setback->code citation and reporting-reads-atoms — code/permit (3) and reports (6), all on ONE architectural move.
- Makes the paywall = accessPolicy (arch gap 2), because a paid facet is gated by the atom's policy at the catalog, not a bespoke route check.

## Dependency + honest sequencing

The road-anchor input is currently PROVISIONAL (Overpass regressed off the serving tip, verified 2026-07-23 — see the STATUS correction note). So the FULL chain (authoritative road-anchored front edge) cannot complete until Overpass is re-mounted. BUT the zoning->setback half atomizes now, independent of Overpass, and the envelope DERIVED atom carries the front edge as an input whose confidence is honestly asserted-provisional (shape-tier) and UPGRADES to calibrated-road when Overpass lands. The reasoning-chain shape makes this honest by construction: the provisional front edge is a lower-calibration input atom, not a hidden guess. Chain ships now; precision upgrades cleanly when the road anchor is real.

## Proposed next deliverable (for operator greenlight, not built here)

1. Define the three atom kinds (fact / rule / derived) as a concrete schema against `@empressaio/atom-contract` 1.5.0+ (accessPolicy, three-axis confidence, provenance, the input-atom-ref chain for derived atoms) — starting with zoning-fact / setback-rule / envelope-derived.
2. Refactor the envelope derivation to PRODUCE these atoms (replace the ad-hoc `labeling x district` multiply with the contract's composed confidence) — fix-into-the-shape.
3. Serve them through the atom/MCP path with accessPolicy gating; the inspect card + report READ the atoms (explainability for free).
4. Migrate flood onto the node as a fact atom; leave topo + geometry as referenced fields.
This is the atomization entry point; the rest of the map model follows the same shape.
