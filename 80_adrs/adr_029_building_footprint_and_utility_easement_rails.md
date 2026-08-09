---
id: adr_029_building_footprint_and_utility_easement_rails
title: ADR-029 — Building footprint and utility easement site-layer rails
status: accepted
last_updated: 2026-08-05
applies_to: portfolio
related: [adr_008_engine_factor_out, adr_018_atom_contract_substrate_layer, adr_020_recorded_instruments_and_restriction_clauses, adr_021_constraint_resolution_and_precedence, adr_028_contract_cross_vertical_adoption, 27_engine_evolution_plan, 40_hauska_map_3d_implementation_brief, 46_smartcity_parcel_intelligence, 56_engine_extraction_sprint, 90_operations/T3_rails_track]
owner: nick
---

# ADR-029 — Building footprint and utility easement site-layer rails

## Status

ACCEPTED 2026-08-05 with master-planner rulings on all five open decisions — see _decisions/2026-08-05_adr029_rails_rulings.md (absence shape hybrid, 1.9.0 after ADR-028, ML public-free ODC-By, ADR-021 deferred, renderer post-pilot).

## Context

Site-plan coherence requires two rails the corpus lacks today:

1. **Building footprints.** The map inventory (`40_hauska_map_3d_implementation_brief.md`) found no building footprints in product repos. Parcel boundaries exist (`property-boundary-edge`, parcel geometry on the place node), and buildable envelopes exist as derived atoms, but existing improvement geometry is not modeled. Operator re-prioritization (T3, 2026-08-05) folds footprints into the standard county recipe before Texas-wide scale.

2. **Public-utility easements.** ADR-020 covers **private recorded encumbrances** with mandatory wet-PDF `sourceDocumentCid` and default `tenant-private` access. Public-utility easements in practice arrive from county plat/GIS vector layers (public record, no relationship required), often without a title-commitment PDF per feature. They affect site planning like setbacks but are property-rights geometry, not regulatory environmental overlays (`constraint-overlay`: FEMA, habitat, zoning districts per `27_engine_evolution_plan.md` and `46_smartcity_parcel_intelligence.md`).

Both rails need a contract shape keyed to `parcelNodeId`, honest source tiering (CAD-authoritative vs ML-derived vs absent), provenance, confidence, and verification state. They must land on the Hauska substrate per ADR-018, produced by engine adapters per ADR-008/056 topology (not product-local blobs in cortex-api or hauska-map).

### Existing types reviewed (coverage gap)

| Existing type | Covers footprint/easement? | Why not reuse |
|---|---|---|
| `parcel-node` | Parcel identity and ring provenance; geometry by REFERENCE to `txgio_parcel`, not carried on the atom | Legal lot boundary is not improvement geometry; multiple structures per parcel; independent source vintage |
| `property-boundary-edge` | Lot-line topology for setbacks | Edge atoms, not closed improvement polygons |
| `constraint-overlay` | Regulatory overlays (FEMA, habitat, zoning overlay districts) | ADR-020 rejected encumbrances-as-overlay; easements are property rights, not adopted regulatory law |
| `recorded-instrument` + `restriction-clause` (ADR-020) | Easement as `instrumentType: easement` with optional spatial `constrains` | Requires `sourceDocumentCid` (wet PDF); default tenant-private; title/OCR ingest path, not bulk county GIS |
| `site-topography` / `site-drainage` | Engagement-scoped DEM/hydrology | Parcel-scoped public-record rails, not engagement-private site context |
| `buildable-envelope` | Derived regulatory volume | Output of setback resolution, not observed improvement footprint |

Neither rail is covered by an existing registered atom type without semantic overload.

## Decision

Introduce **two new data-level atom types** on `@empressaio/atom-contract`, sibling **public-record site-layer** atoms anchored on `parcelNodeId`. Register in `hauska-engine/packages/atoms/` after master sign-off. Contract bump: additive minor (target 1.9.0, after ADR-028 fields land).

### Substrate placement (ADR-008 / 56 check)

| Layer | Placement |
|---|---|
| **Contract shape** | `@empressaio/atom-contract` (Hauska substrate, ADR-018) |
| **Producer** | `hauska-engine/packages/adapters` (county GIS / CAD / national ML fallback ingest) |
| **Registry** | `hauska-engine/packages/atoms/` |
| **Persistence** | Engine atom store (Neon), same rail as `zoning-fact` / `property-boundary-edge` |
| **Consumers** | Gate-fronted: MCP map/reporting tools, PE facets, site-plan export BFF, `constraint-resolution` (ADR-021, easement basis only) |
| **NOT** | cortex-api product logic, hauska-map local geometry cache, engagement-scoped site atoms |

This follows the decoupled spine topology: adapters produce atoms, gate serves them, product surfaces render with provenance chips.

---

### 1. `building-footprint`

One atom per observed structure footprint on a parcel (0..N per parcel). Absence is explicit (see below).

**Required fields:**

- `parcelNodeId` — stable place-node anchor (e.g. `48021:27303`)
- `footprintId` — stable id within parcel (`primary`, `accessory-1`, or `{sourceHash}`); uniqueness scope `(parcelNodeId, footprintId)`
- `footprintGeometry` — GeoJSON `Polygon` or `MultiPolygon` (canonical); ingest adapters MAY accept WKT and normalize at write time
- `sourceTier` — `cad-authoritative` | `ml-derived` | `absent`
- `sourceVintage` — layer edition date or dataset vintage (ISO 8601 date or opaque edition string from source registry)
- `sourceCitation` — `{ adapterId, sourceUrl?, layerName?, featureId?, fetchedAt }` per structural commitment 1
- `confidence` — contract read-contract confidence (three-axis where applicable; ML tier MUST NOT present as survey-grade)
- `verificationStatus` — `machine` | `human` | `unsurveyed`
- `accessPolicy` — `public-free` for county CAD/GIS authoritative layers; `public-paid` for national ML fallback (Microsoft/Overture/USA Structures) per tier model
- `evaluatedAt`, `sourceAdapter`

**Optional fields:**

- `structureRole` — `primary` | `accessory` | `unknown`
- `derivedHeightM` — LOD1 height from DSM minus DTM (Phase 4 brief); only when lidar derivation ran; carries its own sub-citation
- `inputAtoms` — ADR-028 lineage when height is derived from `site-topography` or DEM reference
- `license` — ADR-028 block when ML vendor terms restrict redistribution

**Honest absence (no source for county):**

When the source registry records no published footprint layer for a jurisdiction, emit one sentinel atom per parcel (or one county-level coverage atom referenced by parcels, resolved at serve time; implementation choice deferred):

- `sourceTier: absent`
- `footprintGeometry` omitted
- `evaluated: true` + `provenanceScope: string[]` listing sources checked (ADR-028 verified absence)
- Surfaces render named absence, never a fabricated polygon

**Graph:**

- `parcel-node` / place node ← `improvement-on` — `building-footprint`
- `buildable-envelope` MAY reference footprint atoms via `inputAtoms` when computing developable gap (future site-plan coherence; not required for v1 registration)

**Identity:**

- `entityId` pattern: `{parcelNodeId}:footprint:{footprintId}`

---

### 2. `utility-easement`

One atom per GIS-resolved utility easement feature intersecting a parcel (0..N per parcel). Public-record site-layer geometry; distinct from ADR-020 title-track instruments.

**Required fields:**

- `parcelNodeId`
- `easementId` — stable id from source (`{sourceLayer}:{featureId}` or content hash)
- `easementGeometry` — GeoJSON `Polygon`, `MultiPolygon`, or `LineString` (corridor centerline with width metadata when polygon unavailable)
- `easementClass` — `utility` | `drainage` | `ingress-egress` | `combined` | `unknown`
- `sourceTier` — `plat-gis-authoritative` | `county-gis` | `record-extracted` | `absent`
- `sourceVintage`, `sourceCitation`, `confidence`, `verificationStatus`, `evaluatedAt`, `sourceAdapter` — same discipline as footprint
- `accessPolicy` — `public-free` (uniform public-record rail; no tenant-private default)

**Optional fields:**

- `holderLabel` — utility district / grantee string when source carries it (not PII; org name only)
- `holderActorDid` — when resolvable to `actor-record`
- `recordingRef` — `{ county, book?, page?, instrumentNumber? }` when plat/GIS attributes carry recording pointer (nullable)
- `linkedInstrumentDid` — cross-link to ADR-020 `recorded-instrument` when title-channel ingest also produced an instrument atom for the same easement
- `corridorWidthFt` — when geometry is centerline-only
- `evaluated` + `provenanceScope` — verified absence when county publishes no easement layer

**Graph:**

- Place node ← `subject-to` — `utility-easement` (property-rights attachment, parallel to ADR-020 `subject-to` on instruments)
- `utility-easement` — `references` → `recorded-instrument` when `linkedInstrumentDid` set (dual representation: map geometry + legal text)

**ADR-021 resolver hook (consequence, not blocking v1):**

Add `utility-easement` to `constraint-resolution.rules[].basis` enum as a **spatial constraint basis** (non-regulatory, recorded-rights tier). Precedence: recorded instrument clause text (ADR-020) wins on legal interpretation; GIS atom supplies map geometry and query. Unresolved dual-record conflicts emit `conflicts[]`.

---

### Relationship to ADR-020 (easement path ruling)

**Recommended path: (c) new public-record site-layer atom (`utility-easement`), NOT (a) or (b).**

| Option | Verdict |
|---|---|
| **(a)** `recorded-instrument` + geometry on `restriction-clause` | **Reject for GIS-primary ingest.** Mandatory `sourceDocumentCid`, tenant-private default, and title/OCR pipeline are wrong fit for bulk county plat/GIS layers. Use only when title-channel ingest produces the instrument; link via `linkedInstrumentDid`. |
| **(b)** `constraint-overlay` subtype | **Reject.** ADR-020 already rejected encumbrances-as-overlay. Utility easements are property rights, not FEMA/habitat/zoning regulatory overlays. |
| **(c)** New site-layer data atom | **Accept.** Matches T3 intent, public-record accessPolicy, bulk GIS ingest, and honest absence. Composes with ADR-020 when both exist. |

ADR-020 remains authoritative for **private title-track encumbrances** (CC&Rs, deed restrictions, easements with wet PDF). ADR-029 adds the **public GIS rail** without amending ADR-020's core decision.

---

## Alternatives considered

**Extend the parcel anchor (`parcel-node`) with a footprint polygon.** Rejected. Collapses improvement geometry into the anchor atom; loses per-structure provenance, multi-footprint cardinality, and independent refresh cadence. The rejection is now doubly correct: as shipped in contract 1.13.0, `parcel-node` carries NO geometry at all — its `geometryStoreRef` is a `.strict()` pointer to `txgio_parcel`, so an inlined ring is a parse error (Geometry Law rule 1, one ring per parcel).

**CORRECTION 2026-08-08.** This ADR originally named a type called `parcel-record` at three points (the reuse table, the graph, and this alternative). No such type ever existed in any contract or engine version — it was a phantom, and it was described as carrying `geometry` = lot polygon, which the real anchor deliberately does not. The entity it reached for is `parcel-node`, published in `@empressaio/atom-contract@1.13.0` and registered in the engine 2026-08-08. All three references are corrected above. See `_inbox/2026-08-08_ATOM_families_ten_rail_spec.md` and `_inbox/2026-08-08_CONTRACT_coherence_audit.md`.

**Store footprints as `constraint-overlay` with `overlayType: building-footprint`.** Rejected. Overloads regulatory overlay semantics; footprints are observed improvements, not adopted constraints.

**Single combined `site-layer` atom with discriminated kind.** Deferred. Footprint and easement share citation/tier fields but differ in geometry semantics, cardinality, and ADR-021 participation. Two explicit types keep registry and MCP tool surfaces clear; a shared `SiteLayerProvenance` interface in the contract is acceptable as a DRY helper, not a merged entity type.

**Engagement-scoped atoms (like `site-topography`).** Rejected for these rails. Footprints and utility easements are jurisdiction public record, not tenant engagement artifacts.

## Consequences

**Positive:**

- Site-plan and map surfaces can render footprint + envelope on one sheet with independent provenance chips (T3 acceptance).
- County recipe gains two standard rails with honest absence and tiered quality (CAD vs ML).
- ADR-020 title track and GIS bulk track coexist with explicit linking, not semantic collision.
- Substrate placement stays clean: engine adapters produce, gate serves, products render.

**Negative:**

- Contract minor bump + cc-agent-AC registration work blocked on master sign-off.
- ADR-021 resolver and MCP map tools need follow-on dispatches to consume `utility-easement` basis.
- Multi-footprint and partial-intersection geometry require cert rules in the factory runbook (T3 Workstream 4).

**Neutral:**

- LOD1 height (`derivedHeightM`) is optional v1 field; Phase 4 brief work can populate later without shape change.

## Open decisions (master planner)

1. **Sentinel vs county-coverage absence atom** for footprint/easement honest absence (per-parcel sentinel vs one county row referenced at serve time).
2. **Contract bump version** (1.9.0 assumed additive; coordinate with ADR-028 publish state).
3. **ML fallback accessPolicy** — confirm `public-paid` vs `public-free` for Microsoft/Overture national footprints under license block (ADR-028 `license.derivedOk`).
4. **ADR-021 basis enum change** — ship in same bump or defer resolver to post-registration ingest pilot.
5. **Renderer obligation** — ADR-012 `focus` mode for both types before external `.atompack` export (likely post-pilot).

## Reversal criteria

Revisit if (a) master planner merges footprint into a generic `site-improvement-geometry` discriminant that subsumes both types with no loss of provenance semantics; or (b) legal counsel requires all easements, including GIS-discovered, to flow only through ADR-020 instruments, in which case relax `sourceDocumentCid` requirement via ADR-020 amendment instead of maintaining dual types; or (c) atom volume from per-structure footprints blocks index at county scale, in which case tighten to one primary footprint per parcel with accessory footprints as embedded array (instrument-level collapse pattern from ADR-020 reversal criteria).

## References

- `90_operations/T3_rails_track.md` — Workstream 3 mission and acceptance
- `80_adrs/adr_020_recorded_instruments_and_restriction_clauses.md` — title-track encumbrances
- `80_adrs/adr_021_constraint_resolution_and_precedence.md` — resolver lattice
- `40_hauska_map_3d_implementation_brief.md` — Phase 4 footprint acquisition (paused; shape banks here)
- `27_engine_evolution_plan.md` — `constraint-overlay` vs encumbrance separation
- `56_engine_extraction_sprint.md` — adapter/engine-api substrate topology
- `_architecture_homes/02_atoms_lifecycle_ownership.md` — site atom family precedent

## Revision history

- **2026-08-05 (T3 Workstream 3):** Initial proposed spec. Building footprint = new `building-footprint` type. Utility easement GIS rail = new `utility-easement` type (path c). ADR-020 extension not required; optional `linkedInstrumentDid` bridge only.
