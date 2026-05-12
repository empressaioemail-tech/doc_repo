---
id: adr_010_atom_graph_traversal
title: "ADR-010 — Atom-graph traversal as retrieval primitive over IPFS"
status: active
last_updated: 2026-05-12
applies_to: portfolio
related: [adr_001_atom_architecture, adr_007_cross_stakeholder_atom_access, 05_living_lineage_thesis, 25_atom_architecture_reference, 11a_bastrop_live_roadmap, 27_engine_evolution_plan, 46_smartcity_parcel_intelligence, 47_codex_plan_review]
owner: nick
---

# ADR-010 — Atom-graph traversal as retrieval primitive over IPFS

## Status

**Accepted.** Originated 2026-05-12 during the velocity-through-2026 brainstorm session, formalizing an architecture that has been implicit in the atom contract (ADR-001), the living lineage thesis (`05_living_lineage_thesis.md`), the cross-stakeholder access model (ADR-007), and the IPFS substrate referenced by `47_codex_plan_review.md` CDX-15. This ADR makes the substrate explicit and locks the retrieval pattern before engine work in [`11a_bastrop_live_roadmap.md`](../11a_bastrop_live_roadmap.md) Sprint A.1 begins.

This is a **foundational** ADR. It commits to the architectural pattern. Specific link taxonomy, traversal algorithm, performance contract, and storage configuration are noted as initial design seeds for follow-up implementation docs; this ADR does not specify them in full.

## Context

The atom contract per [ADR-001](adr_001_atom_architecture.md) gives every atom four mandatory layers — identity (including a content-addressed `cid`), context interface, composition, and history. ADR-001 also establishes that atoms reference other atoms compositionally (owned children, peer references) and that data-level atoms carry cryptographically-anchored event chains. The contract is graph-shaped in fact, but ADR-001 did not commit to how that graph is *traversed* at retrieval time.

The cross-stakeholder access model per [ADR-007](adr_007_cross_stakeholder_atom_access.md) extended this: atoms cross tenant boundaries, references resolve via the contract, access depends on the requester's scope. Again, the graph nature was implicit; the traversal pattern was not specified.

Several recent decisions raise the question explicitly:

- **Adjudication context compounds per atom** (velocity-through-2026 brainstorm 2026-05-11). Every Sylvia / Jaime accept-edit-reject becomes context attached to the `code-section` and `finding` atoms it touched. Over time atoms accumulate not just identity but a graph of decisions made against them. Retrieval that ignores the graph leaves most of the value buried.
- **Cross-jurisdictional precedent is a near-term feature.** "See it in practice" surfacing of comparable adjudications from other jurisdictions (separate UX decision, deferred) requires the engine to traverse from a current finding to comparable findings in other jurisdictions. This is graph traversal, not vector similarity.
- **Code Ingestion Pipeline** ([`11a_bastrop_live_roadmap.md`](../11a_bastrop_live_roadmap.md) Track B) produces atomized municipal codes with internal cross-references (`code-section` → `code-definition`, `cross-reference` → `code-section`). Without graph-aware retrieval, the structural value of those cross-references is lost.
- **Parcel Intelligence** ([`46_smartcity_parcel_intelligence.md`](../46_smartcity_parcel_intelligence.md)) composes briefings from atoms spanning FEMA / USFWS / USGS / USDA / TCEQ / city zoning / city permit history. Composition is a graph walk, not a flat fetch.
- **Data sovereignty is non-negotiable per the living lineage thesis.** ([`05_living_lineage_thesis.md`](../05_living_lineage_thesis.md): "the lineage is not held hostage by any specific platform; it is a substrate that platforms consume.") The storage layer that holds the graph must be host-swappable by the property's tenant of record.

Without a settled retrieval pattern, three failure modes emerge:

1. **Each consumer reinvents traversal.** Cortex, Codex, SmartCity OS each build their own ad-hoc "follow these references and fetch them" pipelines. Bugs and drift compound per surface.
2. **Vector similarity is treated as the retrieval primitive.** Atoms are embedded; retrieval is nearest-neighbor. Structural relationships (this atom *cites* that one; this adjudication *applies-to* that parcel) are invisible to retrieval. The lineage thesis fails at the retrieval layer.
3. **Storage and retrieval get coupled.** "Use Postgres FKs" or "use Neo4j" decisions propagate into every consumer. Cities cannot choose their own storage host without rewriting consumers.

This ADR settles all three.

## Decision

**Atoms form a content-addressed graph stored over IPFS. Retrieval is graph traversal. The engine performs hybrid expansion: pre-expanding the immediate neighborhood for the LLM's prompt, and exposing deeper traversal via tool calls that the LLM invokes when relevant.**

Four sub-commitments follow.

### 1. Atoms are content-addressed; the graph is IPLD-shaped

The `cid` field already mandatory under ADR-001 is the IPFS Content Identifier (CID). Two atoms with identical content have identical CIDs by construction. Atoms reference other atoms by CID, not by database key. The graph is therefore content-addressed end to end, in the shape of IPLD (InterPlanetary Linked Data).

This is not a new invariant — ADR-001 already requires `cid`. ADR-010 makes explicit that the field serves both identity *and* graph addressing, and that the graph layer is IPLD-aligned rather than relational.

### 2. Storage substrate is IPFS; Google Cloud is the default pinning host; cities may bring their own

Atom bodies (and any binary attachments — PDFs, plan images, sketches) live in IPFS. The default pinning service is hosted on Google Cloud; the platform pins atoms there as the operating default.

Cities, as tenants of record for property-scoped atoms (per ADR-007), may **pin their atoms to their own IPFS infrastructure**. Because identity is content-addressed, the same atom pinned to a city's IPFS host and to Google Cloud is the same atom — fetching by CID resolves to whichever host serves it.

This is the operational realization of the living lineage thesis's vendor-independence claim. Data sovereignty is structural: a city that wants its property lineage held only on its own infrastructure can configure pinning accordingly without breaking any consumer of the atom graph.

Specific pinning provider (Pinata, Filebase, Google Cloud-hosted IPFS node, Hauska-operated cluster) for the default is an open decision; tracked below.

### 3. Postgres serves as the index and discovery layer

A Postgres table indexes `(atom_id, cid, atom_type, access_scope, jurisdiction_tenant, owner_tenant, link_type, target_cid, …)`. This is the discovery layer: consumers query Postgres to know *which atoms exist*, *where they're pinned*, *who can access them*, *what they link to*. They do not store atom bodies; bodies live in IPFS.

Postgres remains the consistency primitive for access control (per ADR-007 scopes), tenancy, and traversal-budget enforcement. IPFS is the content store. The two layers don't conflict — they have different jobs.

This decision keeps the operational surface manageable. Today's Neon / Postgres stack continues to serve as the index even as the storage moves to IPFS. A future graph-store (Neo4j, Dgraph) sidecar is not precluded but is not required.

### 4. Retrieval is hybrid: pre-expansion + tool calls

When a consumer (Codex, Cortex, SmartCity OS) submits a query that requires LLM reasoning over atoms, the engine performs **hybrid retrieval**:

- **Pre-expansion.** The engine identifies the anchor atom(s), traverses the immediate neighborhood (depth N, configurable, default 1-3 hops), fetches CIDs from IPFS (with caching), and includes the resulting atom bodies in the LLM's context window. This is what the LLM sees by default.
- **Tool-call traversal.** The LLM is given tools — `get_atom(cid)`, `traverse(from_cid, link_type)`, `find_precedent(atom_cid)` — that it may invoke when it determines the pre-expanded neighborhood is insufficient. Tool calls follow the same access-control path as pre-expansion (Postgres scope check, then IPFS fetch).

Pre-expansion keeps common-case latency low and predictable. Tool calls preserve LLM agency for unusual queries — including the cross-jurisdictional precedent traversal that "see it in practice" UX (separate ADR) will surface.

Both paths honor [ADR-007](adr_007_cross_stakeholder_atom_access.md) access scopes. The Postgres index is the access-control gate; atoms that fail the scope check are not fetched from IPFS at all.

## Alternatives considered

**Alternative 1 — Vector-similarity retrieval only.** Embed atom bodies; retrieve nearest neighbors; ignore graph structure. Rejected because it loses the structural relationships that are the substrate's distinctive value. A `finding` near another `finding` in embedding space may have no actual relationship; a `finding` that `cites` a `code-section` that `interprets` an `adjudication-record` is structurally precedent — invisible to pure vector retrieval. Vector similarity remains a useful complement (for fuzzy candidate selection feeding the graph layer) but cannot be the primitive.

**Alternative 2 — Pure graph store (Neo4j / Dgraph / similar) as substrate.** Reject as substrate for now; reconsider as sidecar later. Operational surface is higher than warranted at Bastrop scale; query patterns are not yet stable enough to justify the operational commitment. Postgres + IPFS handles 5-10 jurisdictions comfortably. Re-open if/when traversal patterns surface need (likely 50+ jurisdictions or cross-jurisdictional precedent at scale).

**Alternative 3 — Pre-expansion only; no LLM tool calls.** Engine pre-traverses the entire query graph and inlines everything; LLM operates on a fixed context. Rejected because it forces the engine to over-fetch (pre-expanding for cases that don't need it) or under-fetch (missing relevant atoms the LLM would have asked for). Hybrid preserves both efficiency and agency.

**Alternative 4 — LLM tool calls only; no pre-expansion.** LLM starts cold and must request everything via tool calls. Rejected because common-case latency becomes unacceptable — every finding query becomes N tool-call round trips before the LLM has enough context to answer. Pre-expansion of the immediate neighborhood is the latency win.

**Alternative 5 — Postgres-only storage (no IPFS).** Atoms stored as Postgres rows; references as foreign keys. Rejected because it makes vendor-independence claim (per ADR-005 thesis) operationally impossible — a city cannot pin its data to its own infrastructure if the data is in a Postgres instance the platform operates. Postgres remains the *index* layer; IPFS is the storage layer because storage is what cities need sovereignty over.

**Alternative 6 — Defer the decision.** Continue ad-hoc traversal per consumer; revisit when patterns surface. Rejected because A.1 engine work in [`11a_bastrop_live_roadmap.md`](../11a_bastrop_live_roadmap.md) is about to start. Designing engine retrieval against an unspecified substrate would either pre-commit implicitly (and inconsistently) or require rework once the substrate is named. Both are more expensive than a 30-minute ADR now.

## Consequences

**Positive:**

- **Lineage thesis becomes operational.** Vendor-independence is structural, not aspirational. A city can pin its atoms to its own IPFS infrastructure and migrate platforms without losing or moving its lineage.
- **Cross-stakeholder access scales.** ADR-007 scopes apply uniformly because the access-control gate is in one place (Postgres index), not duplicated across consumers' retrieval pipelines.
- **Compounding atoms are reachable.** Adjudication-context atoms generated as Sylvia / Jaime use Codex 1b are reachable via graph traversal from the `code-section` or `finding` atoms they attach to — without any consumer rebuilding retrieval logic.
- **Cross-jurisdictional precedent becomes tractable.** "Show comparable adjudications from other jurisdictions" is a traversal pattern (`find_precedent` tool call), not a feature each surface re-implements.
- **Atom packs as portable substrate (future):** atoms exported for use in any LLM (per the atoms-as-portable-substrate strategic line) carry their CIDs intact. External consumers can verify atom content and follow links without depending on the platform.
- **Engine consumers (Cortex, Codex, SmartCity OS) share one retrieval primitive.** Surface code converges on a small set of engine APIs instead of bespoke per-product retrieval.

**Negative / costs:**

- **IPFS latency requires caching discipline.** Cold IPFS fetches can be slow. The engine needs a hot cache (likely Redis or in-process) plus a pinning policy that ensures recently-traversed atoms are pinned locally. Without this, common-case latency violates UX expectations. This is real engineering cost that landed on the team.
- **Index / storage consistency.** Postgres index and IPFS storage must stay in sync. Orphaned index rows (atom recorded but body never pinned) or orphaned IPFS content (pinned but never indexed) are real failure modes. Mitigation: atomic write protocol (pin first, index second, with verification) and periodic reconciliation.
- **Operational surface expands.** Today the team operates Postgres on Neon. Adding IPFS pinning operations is net-new — pinning service relationship, redundancy across pins, monitoring pin health. Real but bounded.
- **CID volatility on atom edits.** Editing an atom's content changes its CID. Updates therefore behave as "supersede via event in chain" (already the ADR-001 pattern) rather than in-place mutation. This is consistent with the event-chain model but means consumers must understand that CIDs are versions, not identities-across-time. Identity-across-time is settled in [ADR-011](adr_011_atom_identity_across_versions.md) (DID + IPNS layer). Latest-version lookup goes through the DID resolver (current state) or the Postgres index (operational view), not the CID directly.
- **Cross-tenant pinning policy.** When a city brings its own IPFS host, what does the platform pin for redundancy? Open question (see Open decisions). Affects disaster recovery story.

**Neutral:**

- Initial implementation can pin everything to Google Cloud's default service and defer city-controlled pinning until the second customer raises sovereignty as a requirement. The architecture supports it from day one; the operational mechanics can wait.
- IPLD's existing tooling (ipfs-js, js-multiformats, libp2p) is mature; not picking the substrate from scratch.

## Initial design seeds (not normative)

The following are starting points for the implementation work in [`11a_bastrop_live_roadmap.md`](../11a_bastrop_live_roadmap.md) Sprint A.1 and the Code Ingestion Pipeline Track B. They are seeded here for continuity but are **not** part of the architectural commitment and will be refined empirically against Bastrop usage.

**Link taxonomy (initial):**

| Link type | Meaning |
|---|---|
| `cites` | finding cites code-section |
| `adjudicates` | adjudication-record adjudicates finding |
| `applies-to` | finding applies-to parcel |
| `derives-from` | comment-letter derives-from findings |
| `precedent-of` | adjudication-record is precedent-of similar finding (cross-jurisdictional possible) |
| `interprets` | adjudication-record interprets code-section in context |
| `contains` | owned-child relationship (composition) |
| `instance-of` | parcel-record instance-of zoning-classification |

**Traversal defaults:** depth 3 hops; per-link-type budgets configurable; max total node-visits per query bounded; cross-tenant traversal honors ADR-007 scopes.

**Performance contract (cached-path):** single-hop traversal sub-50ms; 3-hop sub-200ms; cold IPFS fetches budgeted separately and bounded by a pinning policy.

**Tool-call surface:** `get_atom(cid)`, `traverse(from_cid, link_type, depth=1)`, `find_precedent(atom_cid, jurisdictions=…)`. Shape compatible with MCP if/when the engine exposes via MCP.

## Open decisions

- **Default pinning provider.** Pinata vs. Filebase vs. Google Cloud-hosted IPFS node vs. Hauska-operated cluster. Cost / latency / SLA profile differs. Resolution: at A.1 implementation kickoff.
- **Cache layer choice.** Redis vs. in-process vs. CDN-edge cache. Resolution: when latency profile under Bastrop load is measurable.
- **Cross-tenant pinning policy.** When a city brings its own IPFS host, does the platform also pin those atoms for redundancy, or rely entirely on the city's host? Default policy needed.
- **Edit / supersede semantics in retrieval.** Latest-version traversal vs. as-of-time traversal. The chain supports both; the engine's default behavior needs deciding. Identity layer settled in [ADR-011](adr_011_atom_identity_across_versions.md); traversal-default policy still open here.
- **Vector-similarity layer.** Pure complement to graph traversal (fuzzy candidate seed for traversal) or full retrieval alternative for cases where graph structure is sparse? Probably the former; specifics deferred.
- **Anchoring substrate (ADR-006).** Still open. The event chain anchored via `@hauska-sdk/core.EventAnchoringService` is orthogonal to IPFS storage — ADR-006 settles *what timestamps the chain*, not *where atom bodies live*. Resolution deferred to its own ADR.

## References

- [`adr_001_atom_architecture.md`](adr_001_atom_architecture.md) — atom contract (identity / context / composition / history). The `cid` field this ADR consumes as IPFS CID is mandated there.
- [`adr_007_cross_stakeholder_atom_access.md`](adr_007_cross_stakeholder_atom_access.md) — access scopes that gate Postgres-indexed traversal.
- [`05_living_lineage_thesis.md`](../05_living_lineage_thesis.md) — strategic foundation; data-sovereignty claim made operational by this ADR.
- [`25_atom_architecture_reference.md`](../25_atom_architecture_reference.md) — atom architecture spec; section on composition specifies the link contract this ADR builds on.
- [`11a_bastrop_live_roadmap.md`](../11a_bastrop_live_roadmap.md) — Sprint A.1 engine work designs against this ADR; Track B Code Ingestion Pipeline produces atoms into this substrate.
- [`27_engine_evolution_plan.md`](../27_engine_evolution_plan.md) — engine work plan; Streams A (module boundary) and B (atom registry) consume this ADR's commitments.
- [`46_smartcity_parcel_intelligence.md`](../46_smartcity_parcel_intelligence.md) — Parcel Intelligence composes briefings via graph traversal over the substrate this ADR commits.
- [`47_codex_plan_review.md`](../47_codex_plan_review.md) — CDX-15 cryptographic audit trail references "Hauska SDK IPFS cluster"; this ADR formalizes the substrate that reference assumed.
- `33_hauska_sdk_roadmap.md` (queued migration) — Hauska SDK IPFS cluster operational details to be migrated.
- ADR-006 anchoring substrate (queued / open) — separate decision on timestamp anchoring for the event chain.

## Revision history

- **2026-05-12 (origin):** Drafted during velocity-through-2026 brainstorm session. Formalizes the IPFS substrate already implicit in the atom contract (`cid` field) and explicit in `47_codex_plan_review.md` CDX-15 ("Hauska SDK IPFS cluster"). Commits to hybrid pre-expansion + tool-call retrieval shape. Scoped foundational only per scoping decision; specific link taxonomy, traversal defaults, performance contract noted as initial design seeds for empirical refinement during Bastrop adjudication context capture in Sprint A.1.
