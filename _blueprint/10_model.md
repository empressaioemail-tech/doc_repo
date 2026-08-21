---
id: blueprint_10_model
title: Master blueprint — model
status: draft
last_updated: 2026-08-21
compiled_at_commit: 4b174d1b129fa9eee54464967fe7da2b03828a72
applies_to: portfolio
related: [_blueprint/00_README, 77_place_graph_strategy, 80_adrs/adr_001_atom_architecture, 80_adrs/adr_010_atom_graph_traversal, 80_adrs/adr_020_recorded_instruments_and_restriction_clauses, 51_ingestion_pipeline_reference]
---

# Master blueprint — model

One reconciled statement of nodes, atoms, edges, identity, lineage, time, absence, precedence, and access. Production figures cite `_inbox/2026-08-20_store_audit_atom_graph.md` (2026-08-20T23:03Z, Neon `hauska_mcp`).

## Unified model (one paragraph)

A **canonical place node** (`parcel-node` in property; other node types in other domains) is minted with a system key `{countyFips}:{propId}` (normalized form: integer prop_id, no decimal padding — see BP-PARCEL-KEY-01). **Fact atoms** are typed rows in `hauska_mcp.atoms` (`entity_type` + `entity_id` + JSON `body`) carrying claims, provenance, confidence, and access. **Edges** belong in `hauska_mcp.atom_links` (`from_atom_did`, `to_atom_did`, `link_type`) as the traversal index ADR-010 describes; production also carries **`parcelNodeId` (and encumbrance `appliesTo`) in atom bodies** as a denormalized binding. Bodies live content-addressed (`cid`); Postgres holds index, access, and links. Serving reads Layer 4 views only (`20_pipeline.md`).

## Four-way conflict — rulings

The disagreement decides **where the volatile half of a relation lives** (membership in a district, flood zone attachment, instrument scope). Wrong placement produced 20,844,039 `special-district-fact` rows keyed with `:sd:{districtId}` on the atom identity instead of edges from parcel to district (`store audit Q3`).

### `77_place_graph_strategy`

**Status: ADOPTED IN PART.**

**Adopted:** Place as product primitive; parcel identity as join key; facts as typed layers on a place (six planes A–F); agent queries compose layers with provenance.

**Superseded for storage:** "Facts are typed edges on the place node" without distinguishing **edge table** vs **fact atom row** vs **body field**. Production stores facts as separate `entity_type` rows with optional `atom_links`, not as edge-only payloads on a single node record.

**Why:** Strategy doc is north-star language; operational truth is typed atoms + link index per ADR-010 and `51_ingestion_pipeline_reference`.

### ADR-001 + ADR-010

**Status: ADOPTED IN PART.**

**Adopted:** Atoms as foundational unit; four registration layers (identity, context, composition, history); Postgres as discovery/index; graph traversal as retrieval primitive; `atom_links` for typed relationships.

**Superseded in detail:** ADR-010 design seed column `target_cid` — production links use **`atom_did`** pairs (`store audit Q2`). IPFS as sole body store is architectural target; production bodies are JSONB in Postgres with `cid` fields populated.

**Why:** Accepted ADRs govern intent; store audit governs deployed shape.

### ADR-020 (`appliesTo` in atom body)

**Status: ADOPTED IN PART — scope: private encumbrance layer only.**

**Adopted:** `recorded-instrument`, `restriction-clause`, and related types carry **`appliesTo`** anchors in the body for parcel/plat/legal-description scope.

**Superseded for bulk property facts:** Flood, zoning, districts, land use attach via **`parcelNodeId` in body** plus intended **`applies-to` links** (currently starved — V11). Putting district membership only in `entity_id` suffix (`:sd:outside`) is a defect (V13), not the model.

**Why:** Encumbrance atoms are document-anchored; property overlay facts are parcel-scoped measurements. Collapsing both into body-only `appliesTo` without edges broke join cardinality.

### `51_ingestion_pipeline_reference`

**Status: ADOPTED.**

**Adopted in full for:** Four-layer spine; adapter emits candidates only; canonical node binding required at write boundary; resolution tiers; minted canonical keys with alias layer; typed edges at canonicalisation; meaning-shaped checks; fail-closed defaults.

**Why:** Only doc that states operational write-path law and matches the reconciliation program's defect diagnosis (presence ≠ validity).

## Nodes

| Node type (property v1) | Canonical key | Store | Est. rows (2026-08-20) |
| --- | --- | --- | ---: |
| `parcel-node` | `{fips}:{propId}` normalized | `atoms` | ~14.2M |
| `road-node` | `{fips}:road:{osmWayId}` | `atoms` | ~27k |

Node type assignment is part of resolution (51 §3). Defaulted type is prohibited (BP-RESOLVE-01).

## Atoms

| Layer | Location | Identity |
| --- | --- | --- |
| Index row | `hauska_mcp.atoms` | Column `atom_did` = `did:hauska:{entity_type}:{entity_id}` (200/200 match in audit Q6) |
| Body | `body` JSONB | Must not use a different namespace in `body.atomDid` (V14) |
| Content | `cid` / IPFS target | ADR-010 |

**17** production `entity_type` values (~100M rows). Fact families (`flood-hazard-fact`, `special-district-fact`, etc.) hang off parcel via `body.parcelNodeId` string equality (binding test Q8).

## Edges

| Store | Shape | Production |
| --- | --- | --- |
| `atom_links` | `(from_atom_did, to_atom_did, link_type)` | 33,066 rows; types: `contains`, `cites`, `subject-to`, `see-also`, `as-defined-in`, `amends`, `supersedes` — **all code corpus** |
| Property `applies-to` | Intended parcel → fact | **0 rows** (V11) |
| Body denorm | `parcelNodeId`, ADR-020 `appliesTo` | Partial — facts use `parcelNodeId`; instruments use `appliesTo` when written |

Volatile relation half **should** live on edges (`applies-to`, `subject-to`, `instance-of`). Production often encodes it in **`entity_id` suffix** (`:sd:{districtId}`, `:footprint:primary`) — violates BP-KEY-SENTINEL-01 and BP-EDGE-01.

## Identity and aliases

**Rule BP-KEY-01:** Canonical parcel key is **minted** at resolution; source keys live in **`externalKeys`** on the node (contract 1.22.0). Production: `externalKeys` **0 / 1,025** sampled; writers borrow county prop_id into `entity_id` directly (V1).

Contract ships **`keyKind`** (`prop_id` | `geo_id_crosswalk`) on parcel-node only (~partial). **`derive*NodeId`** in `@empressaio/atom-contract@1.22.0` covers OG/mineral nodes only — **no** `deriveParcelNodeId` (V1).

## Lineage

- **Type-level composition:** ADR-001 slots (code `contains` edges — populated).
- **Instance lineage:** `inputAtoms` in contract — **0** in production (V8 adjacent).
- **Resolution audit atoms:** Required by 51 §3 — partial in engine.
- **Parcel split/merge:** `SPLIT_FROM` / `MERGED_INTO` edges required by 51 — not observed on property subgraph in audit.

## Time

- **Point time:** `fetched_at`, `evaluatedAt`, `extractedAt` — populated.
- **Interval validity:** `validTo`, `knowledgeTime` in contract — **0** in atoms (Q10).
- **`neondb.knowledge_atoms`:** table exists with `valid_from`, `valid_to`, `knowledge_at`; **0 rows** (V15). ADR-028 cites this as production proof — **evidence does not exist**.

## Absence

Two mechanisms coexist:

1. **Typed per-family `absence` object** — written on `zoning-fact`, `building-footprint` (partial feed).
2. **`verifiedAbsence` pair** (`evaluated` + `provenanceScope`) — contract + ADR-028 — **never written** (V8).

Rule BP-ABSENCE-01: Absence claims that must read as "checked and none" require the verified pair; typed `absence` alone is second-class.

## Precedence

ADR-021 governs stacking public regulatory vs private recorded constraints. Engine composition for parcel briefings must not overlay **`land-use-fact`** (19 counties, `{fips}:{prop}:{taxYear}`) with **`landuse`** rail (254 counties, near-identical keys) — different measurements (V4).

## Access

`accessPolicy` / column `access_policy`: five-value union (ADR-017). Column default `'public-free'::text` on `atoms` table (DDL Q1). Retrieval must not default omitted payload to public-free (V3 — BP-ACCESS-01).

License block (ADR-028 / contract) — **0** sampled; doc-level guards only.

## Operator-filed conflicts (not settled in R-01)

| Conflict | Parties | Filed for operator |
| --- | --- | --- |
| Bitemporal proof | ADR-028 §3 vs empty `knowledge_atoms` | Accept ADR amendment or retire citation |
| IPFS-only bodies vs Postgres JSONB | ADR-010 vs production | Migration posture |
| ADR-028 status `proposed` vs npm 1.9.0–1.22.0 shipped | ADR-028 vs release process | Accept ADR or freeze contract |
