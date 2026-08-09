---
id: 2026-08-08_DATA_MODEL_proposal_nodes_atoms_edges
title: Data model proposal — nodes, atoms, edges, and stable parcel identity
date: 2026-08-08
status: PROPOSAL — pending adversarial review and operator approval
owner: nick
related: [_inbox/2026-08-08_CONTRACT_coherence_audit, _decisions/2026-08-08_county_shape_thirteen_rails_and_geometry_first, _decisions/2026-08-07_envelope_saga_close_and_geometry_law, 80_adrs/adr_007_atom_types, 80_adrs/adr_017_atom_access_control, 80_adrs/adr_029_building_footprint_and_utility_easement_rails, 01a_atom_conventions]
---

# Nodes, atoms, edges — the data model question

Written in response to the operator's question: should the shapefile be the node or an atom, and what establishes road nodes. The contract coherence audit (2026-08-08) exposed that the thirteen-rail county shape and the atom layer were authored independently and have never been reconciled; six rails have no atom family and Rail 1 (parcel geometry) is one of them. This proposal is the reconciliation attempt. It is a PROPOSAL, deliberately sent to adversarial review before anything is built against it.

## The distinction the current model blurs

`parcelNodeId` is `{fips}:{prop_id}` — an identity string. It carries no geometry, no attributes, no provenance. It is a key.

An atom is a claim with provenance: a fact plus source, vintage, confidence and citation. That is structural commitment 1 (sell reasoning, not data) expressed in the data layer.

The question "is the shapefile the node or an atom" therefore resolves by asking what provenance the geometry needs. The answer is: a great deal. Which source (TxGIO StratMap versus county ArcGIS override), which vintage (`vintage_yyyymm` per the roster; 18 counties flagged `stratmap-vintage-drift`), whether it diverges from the county CAD ring (201 PARCEL-RING-SOURCE-DIVERGENCE observations on Bastrop alone), and at what confidence.

None of that can attach to a key.

**Proposal 1: the parcel ring is an ATOM. The node is the identity it hangs off.**

This also makes the Geometry Law representable. Rule 1 says one ring per parcel — the txgio serving ring is what envelopes are constructed from, verified against, and served on, while alternative sources flag divergence and never silently substitute. That is exactly two atoms about one node: a txgio ring atom (authoritative, serving) and a BCAD ring observation (report-only). If the ring were the node, the disagreement would be unrepresentable — which is precisely why "why are we looking at BCAD when we already have the geometry" was a hard question to answer from inside the system.

## The identity problem underneath

`prop_id` is a CAD appraisal-roll identifier. It is not stable. Parcels split, merge, and get re-keyed between roll years — which is what the `superseded-prop-id` decline bucket detects (84 on the Bastrop cohort). Eight counties cannot use it at all: Travis and Robertson carry a 1.00 prop_id bad rate and join on `geo_id_or_address_crosswalk` instead.

Two defects follow:

- The contract's `parcelNodeId` regex accepts the crosswalk substitution silently, with no field recording which key kind is in use. A node id therefore does not tell you what it is keyed on.
- `PARCEL_NODE_ID_PATTERN` is never referenced anywhere in hauska-engine (verified 2026-08-08: zero hits). The engine imports types only, never the Zod schemas, so every property-family contract invariant is unenforced in production. `48021:0` reached the decline bucket through that hole. The O&G lane does validate (`WELL_SCHEMA` imported as a value), so the machinery exists and is simply not applied on the property side.

**Proposal 2: a parcel node carries a STABLE INTERNAL IDENTITY; external keys become provenanced attributes.**

`prop_id`, `geo_id`, the crosswalk key — each an attribute with its own source and validity window, not the identity itself. A split or merge then becomes a recorded relationship between an old node and its successor nodes, rather than a decline bucket entry. R15 parcel-currency becomes a tractable graph question instead of a per-parcel live BCAD veto inside the warm loop.

Cost, stated honestly: this is a migration touching every keyed store and every join. The cheaper alternative is to keep `prop_id` keying and merely enforce the pattern plus add a `keyKind` field. The review should attack whether the stable-identity migration earns its cost.

## What establishes road nodes

Roads are established completely differently from parcels and nothing documents the asymmetry.

Parcels derive from a cadastral source with an official external identifier. Roads derive from OSM Overpass plus county roadway layers, and `roadNodeId` is a separate key system with its own construction. There is no authoritative stable external road identifier: OSM way ids are not stable across edits, and county layers use their own schemes. `ROAD_NODE_ID_PATTERN` is re-declared locally in the engine rather than imported from the contract.

This matters because roads are load-bearing for the product's headline answer. Front-edge determination runs `labelEdgesFromRoads` against 13,987 road records with a 25 m threshold and a street-name token match. Setbacks depend on which edge is the front; the front depends on road adjacency and situs-street matching. The corner-frontage defect the operator caught by eye on 48021:31317 was a road-labeling defect, not a geometry defect.

**Proposal 3: parcel-to-road frontage is a first-class provenanced EDGE, not a recomputed side effect.**

"This parcel fronts this street" is a claim that can be wrong, that has a source, and that the operator has already personally overruled once. Today it is recomputed inside the warm loop from an O(edges x 13,987 roads) linear scan, and its result is stored only implicitly as edge roles on the boundary primitive — the same stale roles that caused the block13 5/7 residual and the `48021:103281` transposition.

## The missing concept: edges

The contract audit found no edge linking a well to a parcel. Rail 12 (RRC) uses API-14 identifiers, sits in the county shape, and has no join path to the other twelve rails.

That is the same gap as frontage. The model has node types and no explicit relationship layer:

- parcel to road (frontage, adjacency, governing street)
- parcel to well (on-parcel, within-N-feet)
- parcel to district (zoning district, MUD, special district)
- parcel to successor parcel (split, merge, re-key)
- parcel to footprint, parcel to easement

**Proposal 4: relationships are first-class provenanced edges.**

## Absence

Typed absence is already first-class for zoning-fact, setback-rule, footprint and easement (`verifiedAbsence` with mandatory `provenanceScope`, fail-closed when `sourceTier: absent`). That is good and it directly supports the operator's `satisfied-absent` ruling.

Two gaps:

- `buildable-envelope` has NO absence field. R27 bolts `warmVerifyDecline` / `warmVerifyDeclineCode` onto the instance as engine-only fields that will not survive export or MCP serve. The workaround sits on the headline rail.
- `not-yet` has no atom representation at all. Completeness therefore cannot be verified from the atom store; it can only be asserted by the manifest. That is acceptable if the manifest is authoritative for acquisition state and the atom store is authoritative for claims — but it must be stated, not assumed.

**Proposal 5: absence is first-class on every rail, including buildable-envelope, and the manifest is declared authoritative for `not-yet`.**

## Rail-to-atom reconciliation

Six of thirteen rails have no atom family: parcel geometry, CAD attributes, join quality, land use, owner facet, MUD. Two are half-covered: flood/terrain (terrain has `parcel-terrain-model`; FEMA/SSURGO/3DEP produce no atom) and RRC (12 well types; pipelines none). Two exist but are invisible to the engine because contract v1.12.0 is unpublished (npm latest 1.11.0, working tree 1.12.0) — `building-footprint` and `utility-easement` are one publish away.

`parcel-record` does not exist anywhere in the engine (verified: zero hits) yet ADR-029 lines 31 and 94 build the footprint graph on it as though it does.

**Proposal 6: every rail in the county shape has a declared atom family, or is explicitly declared manifest-only.** Not every rail necessarily needs an atom — join quality may be a derived metric rather than a claim — but that must be a decision, not an omission.

## Open questions for the review

1. Does the stable-internal-identity migration (Proposal 2) earn its cost against the cheaper fix of enforcing the existing pattern plus a `keyKind` field?
2. Are edges-as-atoms genuinely better than computing relationships at warm time, or does it trade a compute cost for a staleness cost? Note the current stored-edge-role staleness is already causing defects.
3. Should join quality (Rail 3) be an atom at all, or a derived manifest metric?
4. Does making the ring an atom conflict with anything in the serving path, which currently reads geometry from `txgio_parcel` directly rather than from the atom store?
5. Is there a migration order that does not require a flag day?
