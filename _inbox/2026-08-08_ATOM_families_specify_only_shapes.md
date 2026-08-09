---
id: 2026-08-08_ATOM_families_specify_only_shapes
title: Specify-only atom family shapes — owner, mud, rrc, soils (NOT for contract merge this pass)
date: 2026-08-08
status: design (specify-only — do not publish into @empressaio/atom-contract until data arrives)
owner: nick
related:
  [
    _inbox/2026-08-08_ATOM_families_ten_rail_spec,
    _inbox/2026-08-08_DATA_MODEL_adversarial_review,
    _decisions/2026-08-08_county_shape_thirteen_rails_and_geometry_first,
  ]
---

# Specify-only shapes (coherent with 1.14.0 BUILD families; not merged)

Same pass as `flood-hazard-fact` / `cad-parcel-roll` / `land-use-fact` so field names and absence dialects stay aligned. **Do not publish these into the contract until a live store or adapter feeds them.** An unvalidated shape is a liability (ADR-029 `parcel-record` phantom).

Typed-absence law for all of them: match `building-footprint` / `utility-easement` — `verifiedAbsence` with mandatory nonempty `provenanceScope`, fail-closed when `sourceTier: "absent"`. Never bolt engine-only decline fields.

Forever rejected (restated): parcel RING as atom; new relationship table (`atom_links` already ships); re-keying `parcelNodeId`.

accessPolicy union remains the live five-value set.

---

## `parcel-owner-facet` (Rail owner — public-paid)

| Field | Required | Notes |
|---|---|---|
| `entityType` | yes | `"parcel-owner-facet"` |
| `atomDid` | yes | `ownfacet_<16-hex>` |
| `parcelNodeId`, `taxYear` | yes | |
| `ownerName`, `ownerMailingAddress` | optional | **Never when join-hold** |
| `ownerOccupancyFlag` | optional | `"owner-occupied" \| "absentee" \| "unknown"` |
| `deedDate` / `lastSaleDate` | optional | When CAD carries |
| `sourceTier` | yes | `"cad-authoritative" \| "absent"` |
| `accessPolicy` | yes | **`public-paid`** — gate MCP + BFF, not UI-only |
| `absence` | optional | kinds: `owner-join-hold`, `no-owner-on-roll` |
| `verifiedAbsence` | when sourceTier absent | mandatory provenanceScope |
| quality gates | yes | sourceCitation, extractedAt, asOf |

**Why not merged:** 8 crosswalk-HOLD counties; Travis and peers with high `prop_id_bad_rate` make a wrong owner worse than a missing one. Ship only with an enforced join-hold path and paywall gate. Live `cad_property.owner_name` exists (4.6M rows) but must not promote without the gate.

---

## `special-district-membership` (Rail mud)

| Field | Required | Notes |
|---|---|---|
| `entityType` | yes | `"special-district-membership"` |
| `atomDid` | yes | `sdmem_<16-hex>` |
| `parcelNodeId` | yes | |
| `districtId`, `districtName`, `districtType` | yes | MUD / WCID / PID / … |
| `membershipBasis` | yes | `"point-in-polygon" \| "cad-exemption" \| "recorded-plat"` |
| `sourceTier` | yes | `"comptroller-registry" \| "cad-exemption" \| "absent"` |
| `absence` | optional | `no-special-district` = **satisfied-present** outside all districts |
| `verifiedAbsence` | county/probe absent | not “parcel outside MUDs” |
| `accessPolicy` | yes | `public-free` |

**Why not merged:** No table, no adapter (W4 HELD). Cotality path dead. Source acquisition not live.

Parcel association for multi-district: one atom per membership (0..N), not a packed array that loses provenance.

---

## RRC — reuse existing O&G types + edges (no thirteenth well atom)

### Wells (existing)

Keep `well`, `wellbore`, `completion`, … keyed on API-14. **Do not add a parcel-scoped well duplicate.**

Manifest satisfaction via `atom_links`:

| Piece | Action when un-HELD |
|---|---|
| LinkType | Prefer extending with `"parcel-intersects-well"` **or** reuse `"applies-to"` / `"subject-to"` with documented convention — do not invent a second table |
| Writer | Spatial join RRC wells → parcels; write links; property adapters currently write **zero** `atom_links` rows |
| County absence | `{fips}:_county_coverage` verifiedAbsence after documented probe of `rrc-public-gis-wells` |

### `pipeline-segment` (new family — specify only)

| Field | Required | Notes |
|---|---|---|
| `entityType` | yes | `"pipeline-segment"` |
| `atomDid` | yes | `pipe_<16-hex>` |
| `segmentId` | yes | RRC GIS feature id |
| `pipelineOperator`, `pipelineStatus`, `commodity` | optional | |
| `segmentGeometry` | optional | GeoJSON LineString — store once, link parcels |
| `sourceTier` | yes | `"rrc-public-gis" \| "absent"` |
| `verifiedAbsence` / `absence` | typed | county empty layer vs segment-level |
| `accessPolicy` | yes | `public-free` |
| Parcel join | via `atom_links` | same pattern as wells |

**Why not merged:** No adapter, no table, W3 HELD. Volume/licensing risk mirrors ADR-029 footprint caution.

---

## `soil-survey-fact` (flood/terrain remainder — SSURGO)

3DEP stays `reference-field` on `parcel-terrain-model` — **not** a separate atom.

| Field | Required | Notes |
|---|---|---|
| `entityType` | yes | `"soil-survey-fact"` |
| `atomDid` | yes | `soilfact_<16-hex>` |
| `parcelNodeId` | yes | |
| `mapunitSymbol`, `mapunitName` | optional | |
| `drainageClass`, `hydricRating`, `depthToRestrictiveLayer` | optional | |
| `sourceTier` | yes | `"usda-ssurgo-sda" \| "absent"` |
| `absence` | optional | `no-soil-mapping` |
| `verifiedAbsence` | when absent tier | |
| `accessPolicy` | yes | `public-free` |

**Why not merged:** Adapter payload only (`usdaSsurgoSoilsAdapter`); no bulk SSURGO layer; inventory called SSURGO the weakest L4 link. Shape waits on bulk acquisition, not speculative publish.

---

## Coherence rules shared with 1.14.0 BUILD families

1. `parcelNodeId` format unchanged — `{county_fips}:{token}`; MCP `parcel_node_id` untouched.
2. Absence dialect: per-parcel `absence.kind` + county `verifiedAbsence` pair.
3. Zone X / outside-MUD / non-SFHA are **present findings**, not gaps.
4. Owner-bearing fields only after `joinPassedOwnerMatchGate` (already on `cad-parcel-roll`).
5. Join quality remains a **derived manifest metric**, never an atom (rail retired from denominator).
