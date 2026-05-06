---
id: adr_001_atom_architecture
title: "ADR-001 — Atom contract as foundational data-model pattern"
status: active
last_updated: 2026-05-05
applies_to: portfolio
related: [25_atom_architecture_reference, 26_atom_upgrade_guide, 30_smartcity_os, 40_design_accelerator, 41_revit_connector]
---

# ADR-001 — Atom contract as foundational data-model pattern

## Status

**Accepted.** Originated 2026-04 as the v1 consolidation of six prior
source documents. The v1.3 structural correction (2026-04-18) clarified
that the atom belongs to **Empressa**, not Hauska — package
`@empressaio/atom`, with `@hauska-sdk/core` as a peer dependency rather
than a parent.

This ADR captures the architectural decision that the more detailed
[`25_atom_architecture_reference.md`](../25_atom_architecture_reference.md)
specifies in full. The reference is the spec; this is the *why*.

## Context

The portfolio spans multiple products with overlapping concerns:

- **SmartCity OS** holds permits, work orders, vehicles, parcels —
  entities that exist in the real world independently of the system.
  These entities outlast any specific application that touches them.
- **Design Accelerator** holds engagements, snapshots, parcels,
  briefings, findings — a mix of architect-workflow containers and
  real-world referents (the parcel itself).
- **Empressa Land** (post-M5) will hold agreements, obligations,
  payments, tracts, well-sites — entities with multi-decade lifespans
  whose ownership and decision history must outlive any current
  software vendor.

A traditional approach treats each product's data model as
product-specific: a permits table in SmartCity OS, an engagements
table in Design Accelerator, an agreements table in Empressa Land.
Each application then decides what its entities mean, how to render
them, what actions are available on them, what AI surfaces can
reason about them. Strip the data from the application and you have
inert rows.

This produces three problems the portfolio cannot accept:

1. **AI surfaces are bespoke per product.** Each product builds its
   own prompt-assembly pipeline, its own context-curation logic, its
   own rendering rules for AI-mentioned entities. The AI experience
   in SmartCity OS does not transfer to Design Accelerator. Engineering
   cost compounds linearly per product.

2. **Entity history is application-bound.** A permit's review history
   lives inside MyGov. If the city replaces MyGov, the history is
   lost — or at best is exported to spreadsheets that no longer
   carry the chain of decisions that produced the current state.
   Real-world entities deserve histories that outlive the systems
   that touch them.

3. **Cross-product entity references break.** A parcel in
   SmartCity OS and the same parcel in Design Accelerator are
   separate database records with no shared identity. Two products
   that need to reason about the same real-world thing cannot do so
   without bespoke integration code per pair.

The portfolio is committed to AI-first product surfaces. That
commitment forces a uniform contract for what the AI sees when it
asks about an entity. The portfolio is also committed to entities
that carry their own histories — institutional knowledge as a
first-class data property. That commitment forces a portable,
verifiable history layer per entity.

## Decision

**Adopt the atom contract as the foundational unit of data modeling
across all Empressa products.**

Every addressable entity — real-world or workflow-internal — registers
against `@empressaio/atom` as an `AtomRegistration` providing four
mandatory layers:

1. **Identity** — `entityType`, `entityId`, `cid` (content
   identifier), and (for data-level atoms) `vdaRef` rooting the
   atom's ownership chain.
2. **Context interface** — a `contextSummary(scope)` method returning
   a structured self-description: prose, typed classification, key
   metrics, related atoms, and provenance tier.
3. **Composition** — declarative slots specifying which other atom
   types this atom contains (owned children) or references
   (independent peers), with arity (`1`, `0..1`, `many`).
4. **History** — two linked layers. **Semantic entity memory**
   (curated prose, AI-consumable) and a **cryptographic event chain**
   (append-only, hash-chained, signed via
   `@hauska-sdk/core.EventAnchoringService`).

The contract is enforced at compile time by TypeScript. An atom
registration missing any required field — or declaring `piiFields`
without scope-handling, or `isDataLevel: true` without `cidBuilder` —
fails to compile. Convention is not the enforcement mechanism; the
type system is.

### Subsidiary commitments

Seven commitments follow from the core decision and are settled at
the same time:

- **Two atom categories share one shape.** Data-level atoms (real
  parcels, permits, vehicles) get VDA backing and anchored history.
  App-level atoms (sprint boards, briefings, workflow containers)
  do not. Both implement the same four-layer contract so AI surfaces
  read them uniformly.
- **AI uniformity is Commitment 1.** Every atom is AI-accessible by
  default through `contextSummary`. The AI never reads atom internals;
  it reads context summaries. Compile-time enforced.
- **Living lineage is Commitment 2.** Data-level atoms carry
  cryptographically-signed, append-only histories that travel with
  the entity. The chain is per-atom (not global) and verifiable
  without trusting the hosting system.
- **Five rendering modes per atom.** `inline` / `compact` / `card` /
  `expanded` / `focus`. Every atom implements all five. Windows
  (application surfaces) pick modes; atoms don't pick. The atom is
  reusable across windows; windows are not reusable.
- **AI is the gateway.** Users never address atoms directly. They
  speak; the AI resolves intent, curates atom context, responds with
  atoms inline using `{{atom:type:id:label}}` markup. Drill-down is
  through tap-to-expand.
- **Empressa owns the atom contract, not Hauska.** Package is
  `@empressaio/atom`. Hauska SDK is a peer dependency
  (`@hauska-sdk/core` for event anchoring, `@hauska-sdk/vda` for
  ownership wrappers). The dependency arrow runs Empressa → Hauska,
  never the reverse. This is the v1.3 structural correction; mixing
  scopes in the other direction would collapse the
  brand-and-architecture separation the portfolio depends on.
- **Migration is an event.** Schema changes to a registered atom type
  are modeled as events in the chain rather than out-of-band DDL.
  The chain of contract changes itself becomes verifiable.

## Alternatives considered

**Alternative 1 — Per-product data models with shared AI library.**
Each product keeps its own database schemas; a shared AI library
provides standardized prompt-assembly. Rejected because the AI
library would need product-specific adapters per entity type, and the
adapters drift — the AI experience diverges across products as each
product's entity model evolves. Also fails on history portability:
schemas don't carry signed lineage.

**Alternative 2 — GraphQL federation.** A federated schema across
products gives unified entity queries. Rejected because GraphQL
solves the read API but not the AI uniformity, the rendering model,
the compositional grammar, or the verifiable-history requirement.
Useful as a possible read transport on top of the atom contract;
inadequate as a replacement.

**Alternative 3 — Event-sourced entities without the four-layer
contract.** Adopt event sourcing for entity history, but leave
identity / context / rendering / composition as per-product concerns.
Rejected because event sourcing alone doesn't deliver AI uniformity
or the composable rendering model. The portfolio needs the full
contract, not just the history layer.

**Alternative 4 — Defer the decision; let products diverge.**
Continue per-product data models. Plan to unify later. Rejected
because the cost of unification grows with every product launch.
Bastrop already has live data; Design Accelerator's customer-zero
pilot creates more. Locking in the contract before two more products
ship saves significant migration debt.

## Consequences

**Positive:**

- AI surface engineering is product-agnostic. New atom types plug
  into existing AI surfaces without bespoke integration. Compass V4
  in SmartCity OS, the architect/reviewer engines in Design
  Accelerator, future Empressa Land surfaces all consume the same
  contract.
- Entity history is portable. A parcel atom carries its decision
  chain across application boundaries. If Bastrop's MyGov contract
  ends, the parcel history doesn't reset.
- Cross-product entity references work. The same parcel atom can be
  referenced from SmartCity OS, Design Accelerator, and a future
  product without integration code. Composition resolves consistently
  across windows.
- Compile-time guarantees. Atoms missing required contract elements
  don't ship. PII fields without scope handling don't ship.
  Unregistered atom types can't be rendered.
- Strategic moat. Federated knowledge across Compass models per city
  becomes implementable because the underlying graph is uniform — see
  [`30_smartcity_os.md`](../30_smartcity_os.md).

**Negative / costs:**

- **Migration cost.** SmartCity OS Operations Dashboard runs
  Compass V3 (prompt-assembly from ~15 data sources). Migration to
  Compass V4 (atom-backed) is a structural refactor on live customer
  traffic. Detailed in [`26_atom_upgrade_guide.md`](../26_atom_upgrade_guide.md)
  §3. Plan: feature-flagged shadow run, progressive rollout,
  retirement of legacy path.
- **Performance discipline required.** `contextSummary` calls must
  be sub-100ms on the common path. AI queries can touch 10+ atoms;
  uncached implementations multiply DB load. Caching strategy is
  per-atom-type and is non-optional for atoms with model-generated
  prose.
- **Backfill provenance honesty.** Atoms reconstructed from source
  systems at atomization (a permit issued in 2019, atomized in 2026)
  cannot claim cryptographic proof of pre-atomization events. The
  contract surfaces this via `historyProvenance: "backfill"` and
  external messaging discipline. Engineering does not close this gap;
  honest claims do.
- **Coordinated version bumps.** Major versions of `@empressaio/atom`
  require every consuming product to co-bump. This is a real
  coordination cost, paid in the upgrade-guide protocol rather than
  avoided.
- **Single source of truth = single point of failure.** The atom
  contract becomes the most-load-bearing piece of code in the
  portfolio. A bug in `@empressaio/atom` v1.0.0 affects every
  product. Mitigated by extensive contract tests in `/testing` plus
  the registration-contract tests every consumer runs.

**Neutral:**

- Two-category split (data-level vs. app-level) adds one decision
  per atom registration. Treated as architecturally clean rather than
  burdensome — the categorization tracks a real property (does this
  thing exist outside the application?) rather than a synthetic one.

## References

- [`25_atom_architecture_reference.md`](../25_atom_architecture_reference.md)
  — full architecture spec (eleven sections covering identity,
  context interface, composition, history, registration contract,
  AI gateway, anti-patterns, glossary, package surface)
- [`26_atom_upgrade_guide.md`](../26_atom_upgrade_guide.md) — adoption
  paths (first-time, SmartCity OS migration, version upgrade
  protocol, breaking-change patterns)
- [`30_smartcity_os.md`](../30_smartcity_os.md) — atom-graph thesis
  applied to municipal intelligence (5-product suite as lenses over
  one graph)
- [`40_design_accelerator.md`](../40_design_accelerator.md) — atom
  graph applied to architect-side workflows (19 domain atoms,
  same-engine principle)
- [`41_revit_connector.md`](../41_revit_connector.md) — connector
  remains thin; intelligence lives in the api-server which extends
  the graph
- Predecessor source documents (now retired or migrated): six prior
  drafts including `hauska-atom-master-architecture.md`,
  `hauska-atom-executive-summary.md`,
  `intelligence-interface-vision-v4.md`, and three others —
  consolidated into the reference doc, replaced by this ADR + the
  reference + the upgrade guide

## Revision history

- **2026-04 (origin):** initial v1 consolidation across six prior
  drafts.
- **2026-04-18 (v1.3 correction):** ownership clarified (Empressa
  owns atom; Hauska SDK is peer dependency). Anchoring attribution
  consistently `@hauska-sdk/core.EventAnchoringService` throughout.
- **2026-05-05 (this ADR):** captured as ADR-001 in the docs repo.
  Architecture spec migrates to `25_atom_architecture_reference.md`;
  upgrade guide migrates to `26_atom_upgrade_guide.md`. Predecessor
  pre-docs-repo files
  (`20_empressaio_atom_architecture.md`,
  `21_empressaio_atom_upgrade_guide.md`) retire on migration.
