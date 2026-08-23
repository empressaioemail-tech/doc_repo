---
id: architecture_homes_atoms
title: Atom vision, lifecycle, and ownership
status: active
last_updated: 2026-06-21
applies_to: portfolio
owner: nick
related: [architecture_homes_overview, 25_atom_architecture_reference, 80_adrs/adr_017_atom_access_control, 80_adrs/adr_005_multitenancy, calibration_architecture_addendum]
---

# Atom vision, lifecycle, and ownership

## The contract (what every atom is)

Four things in one registration: identity (entityType, entityId, content id, and for real-world entities a VDA reference); a context interface (prose, typed fields, key metrics, related atoms, provenance tier, scope filtering); composition (which atoms it contains or references); and history (a semantic memory layer plus an append-only, hash-chained, signed event log). Data-level atoms refer to real-world things and get the full cryptographic provenance; app-level atoms are workflow containers and skip it. Every atom implements five render modes. This is the living-lineage unit.

## The type architecture (the tiers, the vision)

- Data atoms (shipped) — the facts.
- Skill / behavior atoms (queued, ADR-014 v2) — invokable capabilities.
- Execution atoms / procedure-execution (ADR-013, accepted) — recorded runs.
- Actor atoms (ADR-015, accepted) — who acted.
- Intent atoms (ADR-016 deferred; purpose field on procedure-execution as v1 stopgap) — why.
- Access control (ADR-017) — the five-value accessPolicy on every atom.

Today only data atoms are richly instantiated; the rest are accepted-but-thin or stopgapped.

## Domain families instantiated today

- Corpus: code-section, code-cross-reference, code-edition, code-amendment, jurisdiction-corpus.
- Encumbrances (ADR-020/021): recorded-instrument, restriction-clause, restriction-corpus, administrative-rule, constraint-resolution.
- Workspace: property-workspace, brief-run, workspace-attachment, workspace-share-edge. **Correction 2026-08-22: declared in the contract, not instantiated.** Zero workspace rows exist in the `hauska_mcp` atoms store, and the family's only importer is a shape-only registration in legacy-design-tools on the frozen `@hauska` package name whose composition edges are forward references resolving to nothing. See ADR-030. The vocabulary in this doc is superseded by [`19_the_instrument_contract.md`](../19_the_instrument_contract.md), which distinguishes node, atom, edge, layer, instrument and lens; read that first.
- Reasoning atoms: the web-first warmed, mutable, confidence-bearing layer.
- Arrow-two capture: finding, decision-event, submission-classification.
- Site: site-topography, site-drainage.
- L-surface: the L1 to L6 deliverable chain.

## The conformance target (what every atom must carry)

Every atom, regardless of family, must carry: the read-contract confidence object (three axes calibrated/asserted/consequence, each with n, interval width, and calibration provenance asserted/backtest/seed/live); an accessPolicy (the five-value union); and, for data-level atoms, the signed-history layer with a verify-chain. Consequence inputs (ASCE 7 risk category, IBC occupancy/importance) where applicable, with a conservative asserted default until the ICC I-Code ingest thickens coverage.

## The downloaded atom

When an atom downloads, you get the portable unit: identity, context summary, the three-axis read-contract, the composition references, the citations, and the signed event chain with a verify-chain check. That is the audit object the operator console renders. It is self-contained and verifiable without trusting the hosting system.

This download is an actual function, not just a console view. The atom contract defines the downloadable-atom shape (cc-agent-AC); the gate exposes an atom-export tool (cc-agent-M) so a tenant or an authorized third-party agent can take the portable atom, which is the data-portability and VDA-ownership story (a tenant can take the atom it owns); and the console renders and downloads it. Export respects accessPolicy: a tenant exports its own tenant-private atoms and the public atoms it composes by reference, never another tenant's private data.

## Dependency: the tenant leg

The entire user-owned story above (tenant-private storage, per-user ownership, the VDA, isolation, the operator key, exporting your own atom) is gated on the tenant leg (sprint 54). Production runs an anonymous default tenant today, so these atoms exist but are not owner-isolated. The conformance audit must mark every tenant-family conformance item that is blocked on the tenant leg, and the standard is honest that user-owned atoms are the target, not the present-tense guarantee, until that build lands.

## User-generated parcel/project atoms (lifecycle and ownership)

When a user runs a brief or opens a project on a parcel, they do not get one atom; they get a cluster, and the split is the point.

The public-record facts about the parcel (geometry, zoning, the governing code sections, flood, encumbrances of record) are public-tier atoms that already exist on the spine. The user's parcel/project atom composes them by reference; it does not copy them. The public atoms stay canonical and shared.

What is new and user-owned is the workspace: a property-workspace atom (app-level container), a brief-run atom (the report run), and any adjudications or corrections the user makes. These are tenant-private.

| Property | Public-record facts | User project / workspace / adjudications |
|---|---|---|
| accessPolicy | public-free / public-paid | tenant-private |
| Storage | public spine corpus | spine, tenant partition (target; cortex-api anonymous tenant today, gated on the tenant leg 54) |
| Ownership | shared substrate | the tenant (VDA roots ownership for data-level) |
| Composition | independent | composes the public facts by reference |
| Calibration | pools into public calibration | stays tenant-private; sharpens only the tenant's own calibration; never pooled |
| Download | the canonical public atom | the portable tenant atom: identity + context + read-contract + reference-pointers to the public atoms it cites + signed history + verify-chain |

So a user's "parcel atom" is really a tenant-private workspace composing public-tier facts plus tenant-private research. Downloading it yields verifiable pointers into the public corpus, not a fork of it, and the tenant's corrections never touch the public number. That is the sovereignty guarantee made concrete at the level of one parcel. It is gated on the tenant leg; today, under the anonymous default tenant, these atoms exist but are not yet owner-isolated.

## Audit implication

The conformance audit covers all families, with two remediation paths: re-mint the immutable code corpus (born-correct through the rebuilt snapshot); conformance-migrate and backfill the mutable and tenant families (encumbrances, workspace, reasoning, finding, site, user-generated), because a tenant's owned data cannot be re-minted. Detail in [`04_audit_and_sequence.md`](04_audit_and_sequence.md).
