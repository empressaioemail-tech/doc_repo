---
id: 2026-07-26_temporal_boundary_primitive_and_living_layer
title: Decision — the temporal, adjacency-aware boundary primitive (the property line as a first-class node) and the living-layer sensing engines
date: 2026-07-26
type: decision_record
status: active
owner: nick
decided_by: nick (operator), captured by claude_code (planner)
related: [27_MASTER_WDLL_spine_completion_and_depth_engine, 27c_road_node_engine_and_warm_digital_twin_spec, 27e_multitrack_program_structure_and_wave_plan, 2026-07-26_base_layer_connecting_tissue_thesis_and_tracks, 2026-07-26_geom_empty_832_ceiling_verdict, 80_adrs/adr_011_amendment_chain, 09_post_saas_substrate_thesis]
reversal_criteria: reverse if the 28286-class geometry failure turns out to be a narrow guard bug fully fixed without the boundary primitive AND no vision item (zoning-change, annexation, easement, twin, title) needs the property line as an addressable node — i.e. reverse only if both the immediate driver and the strategic driver evaporate, which is not expected.
---

# The temporal, adjacency-aware boundary primitive + the living layer

Captured 2026-07-26 while diagnosing the 28286 geometry failure. The operator reframed the recurring geometry-bug class from "fix the offset formula" to "the system lacks a grounded model of the boundary — what each property line IS, what it FACES, and when that changed." This decision names the primitive that resolves it and folds the living-layer sensing (zoning change, annexation, easement) onto the same primitive.

## The reframe (operator, verbatim intent)

The geometry failures are not formula bugs — they are symptoms of reasoning per-edge-by-proxy without a grounded boundary model. The operator's mental model: "I am standing inside the parcel, I see the property lines, I know based on conditions (zoning) that the setback pushes each line inward — draw the new inner boundary." That is robust to orientation/edge-count/shape because it is grounded in a spatial FACT (inside vs outside + what each line faces), not a procedure (offset each edge by its normal and re-intersect). The system today re-derives insideness and role per edge from road-proximity — a fragile proxy — which is why the same bug class recurs (714 Spring miter, 1009 Chestnut asymmetric collapse, 28286 edge-index degeneracy, FIX 2.1 wrong-front). One missing primitive, many symptoms.

## What we have today vs what is missing (verified in code)

Have: the parcel ring (coords); a per-edge ROLE label (front/side/rear/side_corner) but INFERRED from road-proximity, transient, not stored; roadClass when a road is near. (`depth-warm/edgeLabeling.ts` EdgeLabelDraft; WarmEdgeRole.)

Missing: the ADJACENCY — what is on the OTHER SIDE of each line (public ROW -> frontage; a specific neighbor parcel -> interior lot line; an alley; unmapped) as a first-class fact; a grounded, stored "parcel interior / inward direction" the offset reasons against instead of re-guessing; the boundary as an addressable, durable object.

Key enabler already present: the atom contract ALREADY carries temporal/bitemporal machinery — `effectiveDate`, `retiredAt`, `supersedesEntityId`, `asOf`, `status: active|retired`, and the `supersedes` link type (ADR-011 chain semantics). Retire-not-overwrite with effective-date + authority is exactly what zoning-change and annexation need. The variables exist; what is missing is the sensing (knowing a change happened) and applying the machinery to the boundary primitive.

We also already have the DATA to compute adjacency: every parcel in the county (breadth layer) -> parcel-to-parcel adjacency (does this line border another parcel -> interior lot line); the road nodes -> parcel-to-road adjacency (frontage + which road class); the parcel geometry -> authoritative inside/outside. We are substituting a road-distance proxy for a computable adjacency fact.

## The decision: build the boundary primitive TEMPORAL-and-ADJACENCY-aware NOW (operator-decided 2026-07-26)

The property line becomes a FIRST-CLASS NODE (same move as the road node in 27c), carrying:
- identity (addressable, e.g. parcel:edge:N) — durable, not re-derived each compute.
- role (front/side/rear/corner).
- ADJACENCY (what it faces: ROW / named neighbor parcel / alley / unmapped) — computed from live parcel+road data, not proxied from road distance.
- the facing road (node + classification) when frontage -> which setback rule.
- the resolved setback (distance + provenance/citation).
- the interior/inward fact (which side is inside) — established once, stored, so the offset is orientation-invariant by construction.
- confidence + provenance (like every atom).
- TEMPORAL fields wired in from day one (effectiveDate / supersedes / authority / status) EVEN THOUGH v1 populates one version per line.

Why temporal NOW (the load-bearing reason): if we build the boundary primitive static now, we rebuild it temporal later. If we wire the temporal fields in now (the atom already supports them), then zoning-change, annexation, and easement all become "author a sensing engine + supersede the atom" — NOT a rearchitecture. Same discipline as building the road node twin-ready: build the attach-points now, populate later. (Operator chose: temporal-aware primitive now, sensing later.)

The offset CONSUMES this primitive instead of re-deriving — which dissolves the 28286 class (no per-edge orientation to get wrong; shrink the stored interior inward from each line by that line's stored distance). This is the geometry fix AND the base-layer boundary primitive the twin/title/permit/easement vision needs.

## The living layer: zoning change, annexation, easement — one primitive, three expressions

All three are the SAME temporal boundary primitive:
- ZONING CHANGE = the boundary's RULE atom superseded on an effective date by an authority, cited to the ordinance. Representation is FREE (supersede machinery exists); what is needed is a change-detection engine watching ordinance/GIS feeds. "Aware of zoning changes all over the country" = this engine, scaled per-county via the descriptor. v2 intelligence.
- ANNEXATION = a JURISDICTION boundary moving. Model the jurisdiction boundary as another temporal boundary node; a parcel's "which rules apply" is a function of which jurisdiction boundary contains it as of a date. Annex -> supersede the boundary node -> re-resolve affected parcels. Same machinery. Correlates directly with property lines (both are temporal boundaries). v2 intelligence.
- PUBLIC EASEMENT = another boundary overlaid on the parcel that CONSTRAINS the buildable area ("inside your lines, but you cannot build here"). It is the NEXT layer of the same envelope computation: buildable = interior - setbacks - EASEMENTS. Sourced from recorded plats/county records — the SAME recorded-document corpus the fidelity track's document-parsing sources. v2 with the topography + property-line-metadata enhancement (operator scoped it v2).

## The full living-layer event surface (v2 scope — operator, 2026-07-26)

Zoning change, annexation, and easement are the FIRST three, but the living layer must eventually be aware on many levels — every event that changes what is true about a property over time, each a temporal atom superseding a prior via the same ADR-011 machinery, each with an effective date + authority + provenance:
- OWNERSHIP CHANGE (parcel changes hands) — supersede the owner atom; enables chain-of-title depth (connecting-tissue: title vertical).
- PERMIT HISTORY (where available) — permits as dated event atoms on the parcel/boundary node; feeds the permit vertical AND the confidence-calibration loop (predicted vs realized buildout).
- LOT-LINE MOVE / boundary adjustment — a property line atom superseded with new geometry + authority; the boundary primitive's temporal fields carry this natively.
- SUBDIVISION / replat — one parcel node retired, N new parcel nodes minted, boundary lines superseded, the reference graph re-wired; the hardest event because it changes node identity, not just an atom.
All are v2 living-layer engines in the fidelity track (freshness axis). Noted now so the boundary + parcel primitives are built with the temporal + supersede + node-identity-change attach-points ready — do NOT build the sensing now, but do not foreclose it in the primitive's shape. Subdivision in particular argues for the parcel node id + boundary node id to be supersede-capable from day one.

## Track home: the sensing engines FOLD INTO THE FIDELITY TRACK (operator-decided 2026-07-26)

Change-detection (zoning/annexation) and easement-sourcing are FRESHNESS/FIDELITY engines — same family as the v2/v3 precision engines, same recorded-document sourcing. They belong in the fidelity track (Track D design now, build later), NOT a new track. The fidelity track's mission broadens: not just "more precise" (survey-grade) but "more CURRENT" (living layer) — precision AND freshness are the two axes of fidelity. Both keep the base layer trustworthy over time (commitment #2: confidence earned; temporal depth is part of earning).

## Sequencing impact (reshapes Wave 1)

- WAVE 0 / FIX-A is no longer necessarily a formula patch. First, ONE diagnostic decides the shape: is 28286 a narrow GUARD bug (guard rejects a valid inset -> small patch possible, build primitive next) or an INTERIOR/ORIENTATION bug (the code gets inside/inward wrong per edge -> the boundary primitive IS the fix)? The diagnostic also confirms adjacency is computable from live parcel+road data. Its output decides patch-then-build vs build-as-fix.
- The boundary primitive is the real WAVE 1 architecture (with M0-reach + recipe proof). Build it temporal-and-adjacency-aware; the offset consumes it; the geometry gate fixtures assert the near-rect-front-on-each-edge class (closing the 832 hole).
- Zoning-change / annexation / easement sensing engines are FIDELITY-TRACK design now (Track D), build after the depth engine + boundary primitive prove out. Easement is v2 (with topography enhancement).

## Why this is on-thesis, not scope creep

The boundary-as-node is the road-node move (27c) applied to the property line — the same first-class-node discipline. The temporal machinery already exists in the contract. The adjacency data already exists (all parcels + all roads). And the primitive is EXACTLY what the connecting-tissue vision needs: an easement is a fact on a property line; a title dispute is two lines' adjacency disagreeing; a zoning change is a line's rule superseded; a twin anchors to lines. Building the boundary primitive is both the immediate geometry fix and a foundational piece of the base layer every vertical references. Same work, two payoffs.
