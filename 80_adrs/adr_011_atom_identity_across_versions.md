---
id: adr_011_atom_identity_across_versions
title: "ADR-011 — Atom identity across versions (DID + IPNS, anchoring deferred)"
status: active-amended
amended_by: 19_the_instrument_contract
last_updated: 2026-08-22
applies_to: portfolio
related: [adr_001_atom_architecture, adr_007_cross_stakeholder_atom_access, adr_010_atom_graph_traversal, 05_living_lineage_thesis, 25_atom_architecture_reference]
owner: nick
---

# ADR-011 — Atom identity across versions

> **AMENDED 2026-08-22 by [`19_the_instrument_contract.md`](../19_the_instrument_contract.md).** Identity is now **minted, type-prefixed, opaque and immutable**, and is never content-derived, because a content-derived identifier changes when the record is corrected, which fails the identity property. Content addressing survives for hashes and evidence, not for identity. Atoms do not version: they are immutable and superseded, and supersession is an edge carrying its own authority and clock. Natural keys are **aliases**, and an alias is an atom (`identity.alias`) with an authority, a provenance class, valid time and knowledge time, not a field on a record. Lineage is an edge, with `mergedInto`, `dividedInto` and `unmerged` as distinct events, and resolution takes a clock: `canonical(id, knowledgeAt)`. Where this ADR and 19 disagree, 19 wins.

> **Status posture.** Accepted as a high-level architectural commitment;
> refinement deferred. The decision below settles the *shape* of identity
> resolution. The specific DID method, IPNS rotation policy, anchoring
> cadence, and key management mechanics are flagged as
> [Open for refinement](#open-for-refinement) and will be settled in
> follow-on work.

## Status

**Accepted (high-level).** Originated 2026-05-12 during the velocity-through-2026 brainstorm session, in response to a question Nick raised reviewing [ADR-010](adr_010_atom_graph_traversal.md): if CIDs are version identities (content-addressed, change on every edit), what is *the* identity of an atom across time? This ADR settles that question at the architectural level. Concrete mechanism choices await implementation kickoff.

## Context

The atom contract per [ADR-001](adr_001_atom_architecture.md) separates two identity layers:

- `entityId` — the atom's identity-across-time. Stays the same across edits.
- `cid` — the atom's content identifier, per version. Changes on every edit.

[ADR-010](adr_010_atom_graph_traversal.md) committed atoms to IPFS storage with content-addressing, which makes the `cid` layer operationally explicit but also surfaces that `entityId` is currently undefined in vendor-independent terms. Today `entityId` is implicitly a platform-assigned UUID stored in Postgres index rows. If the platform disappears, the UUID is a string with no resolver — even though the IPFS-hosted chain of CIDs is intact.

The living lineage thesis ([`05_living_lineage_thesis.md`](../05_living_lineage_thesis.md)) requires that lineage be "verifiable, portable, vendor-independent." Vendor-independence at the storage layer (IPFS pinning per ADR-010) is necessary but not sufficient if the *identity* of the entity whose lineage we're reading still depends on the platform's UUID assignment.

Three failure modes without this ADR:

1. **Platform UUID-only.** If Hauska disappears, "parcel 1042" cannot be resolved to its chain of CIDs without rebuilding the index from somewhere.
2. **Genesis-CID-as-identity.** Uses the first CID in the chain as identity. Works without third parties but is operationally awkward — CIDs aren't human-readable, and "find latest version" requires walking the chain.
3. **Blockchain-per-edit registry.** Every atom edit becomes an on-chain transaction. Maximally durable, prohibitively expensive at adjudication-edit frequency (a Sylvia / Jaime accept-reject triggers gas).

This ADR settles the architectural shape that avoids all three.

## Decision

**Atom identity is a DID (Decentralized Identifier). The DID resolves to the current CID via a DID Document held on IPFS and addressed via IPNS. The DID Document holder controls updates. Chain-level tamper-evidence is delivered separately via periodic anchoring to a substrate to be settled in ADR-006.**

Four sub-commitments:

### 1. Identity is a DID

Each atom's identity-across-time is a DID of the form `did:hauska:<entityType>:<localId>` (exact method specification deferred — see [Open for refinement](#open-for-refinement)). The DID is the durable identifier referenced in `entityId` going forward.

The DID is human-recognizable enough for operations (`did:hauska:parcel:bastrop-1042-pine`) and machine-resolvable through standard DID methods.

### 2. DID Document lives on IPFS, addressed via IPNS

The DID Document for each atom maps the DID to its current CID (and possibly other metadata: signatures, anchoring proofs, access controls). The Document itself is stored in IPFS. It is addressed via IPNS — InterPlanetary Name System — which provides a public-key-based mutable pointer that the network resolves to the latest CID of the Document.

The IPNS name is the durable resolver. Anyone with the IPNS name can ask the IPFS network "what is the current state of this identity?" and get back the current CID of the DID Document, which in turn points at the current CID of the atom body.

### 3. Holder of the private key controls updates

The IPNS name is bound to a key pair. The private-key holder can publish updates that change the IPNS → CID mapping. For property-scoped atoms, the key holder is determined by ADR-007 (the property's tenant of record). For other atom categories, the key holder follows the atom's tenancy rules.

Key rotation, multi-sig, custody recovery, and "what if the city loses the key" are deferred for refinement. The architectural commitment is only that *some* cryptographic key controls updates; specific custody and recovery models settle later.

### 4. Chain-level tamper-evidence via periodic anchoring (ADR-006)

The chain of (identity → CID) transitions captured in each DID Document is anchored *periodically*, not per-edit, to whatever substrate ADR-006 settles. Anchoring writes a Merkle root of relevant chain heads to the substrate at configurable cadence (per-event-batch / hourly / daily depending on policy).

This delivers "this state existed at this time, provable against the substrate" without paying for every edit. Cities can configure anchoring policy per their data-sovereignty preference: public chain for maximum durability, TSA for low cost, Hauska cluster for self-hosted, none for ephemeral.

## Alternatives considered

**Alternative 1 — Platform UUID + Postgres index only.** Simplest. Rejected: vendor-independence claim of the living lineage thesis fails outright.

**Alternative 2 — Genesis CID as identity.** No third party required. Rejected as primary identity because CIDs aren't human-friendly, and "find latest version" requires chain walks. Could survive as a *fallback* resolver if IPNS infrastructure fails — captured as an open question for refinement.

**Alternative 3 — On-chain registry (per-edit blockchain transactions).** Maximally verifiable. Rejected for per-edit use because adjudication-heavy atoms (a Bastrop reviewer's daily clicks) would incur unacceptable cost and latency. Survives at the *periodic anchoring* layer rather than as the primary identity mechanism.

**Alternative 4 — Pure W3C DID with no IPNS layer.** Many DID methods exist (did:key, did:web, did:ion, did:peer, etc.). Rejected as the *only* layer because most DID methods either depend on a centralized resolver (did:web → DNS) or have their own substrate commitment (did:ion → Bitcoin). IPNS is platform-neutral and IPFS-native, which matches ADR-010's storage commitment. The specific DID method we settle on may still resolve through IPNS by convention.

## Consequences

**Positive:**

- **Vendor-independent identity.** A property's identity (its DID + IPNS name) resolves through the IPFS network regardless of whether Hauska is operating. The living lineage thesis becomes operational at the identity layer.
- **Fast common-case updates.** IPNS update is cheap relative to a blockchain transaction. Adjudication-edit frequency stays manageable.
- **Configurable durability.** Cities choose their anchoring substrate per ADR-006. "Bastrop pioneering" can mean Bastrop opts into public-chain anchoring for maximum verifiability; another city can pick TSA; the architecture supports both.
- **Separation of concerns clean.** Identity (this ADR) is separate from storage (ADR-010) is separate from anchoring (ADR-006). Each can evolve independently.
- **Atom downloadability strengthens.** A `.atom` file (per [ADR-012](adr_012_atom_export_format.md)) can include the DID + IPNS name; opening the file and resolving the DID gives current state without depending on Hauska.

**Negative / costs:**

- **IPNS performance and reliability.** IPNS resolution is historically slower than HTTP DNS; mitigation patterns (pinning IPNS records, caching, gossip) are required for production. Real engineering cost.
- **Key management is now load-bearing.** Whoever holds the DID's private key controls updates. Custody, rotation, recovery, multi-sig — all real ops surface. Tying this to ADR-007's tenant-of-record model is non-trivial.
- **DID method commitment is sticky.** Picking the wrong DID method or rolling our own makes future interoperability harder. Want to use an existing W3C method if possible; specifics deferred.
- **Refinement debt explicit.** This ADR commits to the shape; the mechanics (DID method, IPNS rotation policy, key custody, anchoring cadence) are deferred. Until refined, implementations will have to pick provisional answers that may need to change.

**Neutral:**

- The shape composes cleanly with ADR-010 (IPFS storage), ADR-007 (cross-stakeholder access), and the open ADR-006 (anchoring substrate). No re-architecture required to incorporate refinements later.

## Open for refinement

These items are explicitly deferred. Resolving them is what "refinement" means for this ADR.

- **DID method specification.** `did:hauska:*` custom method, `did:ion`, `did:peer`, `did:key`, or another existing W3C method. Trade-off: ecosystem interop vs. self-sovereignty vs. operational complexity.
- **IPNS rotation policy.** How often the DID Document is republished. Per-edit, daily, on demand, hybrid.
- **Key custody model.** Per-tenant key, multi-sig (city + platform), threshold (M of N), platform-held with escrow. Interacts with ADR-007 tenant-of-record model.
- **Key rotation + recovery.** What happens when a city loses the key. Recovery procedure, backup-key model, social-recovery patterns.
- **Anchoring cadence and substrate.** Resolves with ADR-006. Per-event-batch / hourly / daily / per-event. Substrate choice (Polygon CDK / TSA / public chain / Hauska cluster).
- **Cross-platform DID Document resolvers.** If/when atoms move across platforms or vendors, how does DID resolution handle that. Possibly a no-op (IPNS is platform-neutral); needs verification.
- **Fallback resolver for IPNS unavailability.** If IPFS network can't resolve an IPNS name (network partition, infra failure), the genesis-CID-walk pattern from Alternative 2 may serve as a fallback. Spec needed.
- **Privacy implications.** Public IPNS lookups expose access patterns. For property atoms, lookup metadata may itself be sensitive. Mitigation patterns (private IPNS variants, ZK proofs, etc.) need study.

## References

- [`adr_001_atom_architecture.md`](adr_001_atom_architecture.md) — atom contract; defines `entityId` and `cid` as separate identity layers
- [`adr_010_atom_graph_traversal.md`](adr_010_atom_graph_traversal.md) — IPFS storage substrate; this ADR resolves ADR-010's "CID volatility on atom edits" note
- [`adr_007_cross_stakeholder_atom_access.md`](adr_007_cross_stakeholder_atom_access.md) — tenant-of-record model that determines DID private-key holder for property-scoped atoms
- [`05_living_lineage_thesis.md`](../05_living_lineage_thesis.md) — vendor-independent lineage claim this ADR makes operational at the identity layer
- [`25_atom_architecture_reference.md`](../25_atom_architecture_reference.md) — atom architecture reference; identity layer details to be updated as this ADR refines
- ADR-006 anchoring substrate (queued / open) — chain-level tamper-evidence cadence and substrate choice
- W3C DID Core specification — external reference for DID method semantics
- IPFS InterPlanetary Name System specification — external reference for IPNS mechanics

## Revision history

- **2026-05-12 (origin):** Drafted in the same brainstorm session as ADR-010 in response to Nick's question about CID-as-version-not-identity. Captured as high-level architectural commitment with explicit refinement deferral. Resolves the identity question raised by ADR-010 without pre-committing to specific DID method, IPNS policy, or key custody mechanics.
