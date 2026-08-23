---
id: 05_living_lineage_thesis
title: Living lineage thesis — the property as first-class durable entity
status: superseded
superseded_by: 19_the_instrument_contract
last_updated: 2026-08-22
applies_to: portfolio
related: [06_cities_value_narrative, 25_atom_architecture_reference, 30_smartcity_os, 40_design_accelerator, 47_codex_plan_review, adr_001_atom_architecture, adr_007_cross_stakeholder_atom_access]
owner: nick
---

# Living lineage thesis

> **Strategic foundation for the portfolio.** Establishes the
> governing thesis that motivates every product surface and every
> architectural commitment. Other docs reference this; it does not
> reference them. Updates here propagate downstream.

## Premise

A real property — a parcel, a building, a piece of land — is the durable thing. It outlasts every architect, reviewer, inspector, contractor, permitting clerk, city manager, owner, and software vendor that has ever touched it. Its ownership, regulatory standing, structural condition, environmental relationship, and decision history span decades, then change hands, then span more decades.

The software industry has historically inverted this relationship. Applications own data; properties are records inside applications. When the application is replaced, the data is exported (poorly), migrated (partially), or lost. The institutional knowledge captured in those decisions — *why* the variance was approved, *which* amendment was relevant, *what* the reviewer was actually concerned about — leaves with the application that held it.

This is not a quality-of-software problem. It is a structural mismatch between what the data is (a long-lived record of a long-lived entity) and how the data is held (inside short-lived applications).

## Thesis

**A property's complete decision lineage is a first-class data asset in its own right, distinct from any application that touches it.**

Every interaction across the construction lifecycle — design decisions, code interpretations, reviewer adjudications, inspector verifications, ownership transfers, code-edition changes, climate events — is captured as an event in the property's lineage. The lineage builds in real time as stakeholders interact, not reconstructed retroactively from email and PDFs. The chain is cryptographically anchored per [ADR-001](80_adrs/adr_001_atom_architecture.md) so it is verifiable, portable, and longer-lived than any specific software vendor.

Three load-bearing properties follow.

### Property as first-class entity

The property itself is the durable atom around which everything else organizes. Software vendors are consumers; the property is sovereign. When ownership changes, the lineage transfers; when software changes, the lineage stays. The property's tenant of record (currently its owner) holds full read access to the lineage; other stakeholders have access scoped to their relationship with the property.

### Living, not retrospective

Every interaction during the property's life is captured as a structured event in real time. A finding generated during plan review is an atom; a permit decision is an atom; an inspection event is an atom; an ownership change is an atom. The chain is contemporary with the work that creates it. Reconstruction from artifacts ("what did we decide about that drainage variance in 2019?") becomes unnecessary because the contemporary record is queryable.

### Verifiable, portable, vendor-independent

Cryptographic anchoring (per ADR-001 Commitment 2) means the chain is tamper-evident. The atom contract makes the chain portable — any consumer that implements the contract can read it. The lineage is not held hostage by any specific platform; it is a substrate that platforms consume.

## Strategic implications

This thesis is the why beneath every architectural commitment in the portfolio.

- **Every product decision tests against lineage.** Does this enrich the property's lineage or hollow it out? Features that hide decisions inside the application (PDF markups, email-only comment threads, undocumented variance approvals) hollow it out. Features that surface decisions as structured atoms enrich it.
- **The fabric framing is the thesis made architectural.** The multi-stakeholder fabric (Hauska Engine + corpus + Hauska SDK + atom contract) exists to make lineage real across stakeholders. Each surface is a lens; each interaction adds to the same chain.
- **The atom contract is load-bearing.** Without it, lineage cannot cross application boundaries. ADR-001 is therefore not just an architectural decision — it is the technical prerequisite for the thesis.
- **Cross-stakeholder access is fundamental, not an extension.** Every stakeholder reads and writes against atoms scoped to a property they relate to. Tenant-as-property (per [ADR-007](80_adrs/adr_007_cross_stakeholder_atom_access.md)) is the access model that lets the thesis hold.
- **Network effects compound.** An architect's atomized submittal is more valuable to the reviewer because it carries context. The reviewer's findings are more valuable to the city manager because they flow into operational dashboards. Each surface that joins the fabric makes every other surface more useful. The compounding is structural, not marketing.
- **Long-term moat is institutional-knowledge lock-in, not feature lock-in.** Once a property has decades of lineage in the fabric, moving it costs decades of decision history. Switching is impossibly expensive at the property level even when it is cheap at the surface level. This is durable in a way that feature differentiation is not.

## What this is not

- **Not blockchain-as-marketing.** The chain is an implementation detail in service of verifiability and portability. The thesis stands whether the underlying anchoring substrate is Polygon CDK, public TSA, Hauska cluster, or customer-controlled — the choice is settled in a separate ADR.
- **Not a closed system.** The atom contract is open enough that data can leave. The lock-in is in the value of having data structured this way, not in the platform's ability to hold data hostage.
- **Not retroactive.** Atoms reconstructed from source systems at atomization (a permit issued in 2019, atomized in 2026) carry a `historyProvenance: backfill` flag and cannot claim cryptographic proof of pre-atomization events. The thesis applies forward; backfill is a separate honesty discipline.

## Cross-stakeholder reach

The thesis governs the design of every stakeholder surface in the portfolio.

- **Architect (Design Accelerator):** their design context becomes part of the property's lineage at submittal time. Decisions persist across owner changes, reviewer turnover, and vendor migrations.
- **Reviewer (Codex):** every finding, adjudication, and decision they author is anchored to the property's chain. The reviewer's interpretation of code becomes durable institutional knowledge for the firm AND for the property.
- **City manager (SmartCity OS):** operational dashboards reason over atoms tied to properties in their jurisdiction. Cross-property analytics (Sylvia's "if we get four inches of rain, what happens?" question) become queryable because every property's relevant findings are atoms in the same graph.
- **Inspector (future):** field verifications anchor to the same chain the reviewer wrote against. No reinventing context; the chain *is* the context.
- **Owner / developer (future):** their property's lineage is visible to them as the durable record. Transfer of ownership transfers access to the chain; the chain itself does not move.
- **AHJ regulator (future / partial):** code adoption events affect every property in the jurisdiction; the chain captures which code edition was in force when each decision was made.

## References

- [`adr_001_atom_architecture.md`](80_adrs/adr_001_atom_architecture.md) — atom contract as the technical prerequisite
- [`25_atom_architecture_reference.md`](25_atom_architecture_reference.md) — atom architecture reference, Commitment 2 details the cryptographic event chain
- [`06_cities_value_narrative.md`](06_cities_value_narrative.md) — cities-facing application of this thesis
- [`adr_007_cross_stakeholder_atom_access.md`](80_adrs/adr_007_cross_stakeholder_atom_access.md) — access model that makes the thesis operational
- [`30_smartcity_os.md`](30_smartcity_os.md), [`40_design_accelerator.md`](40_design_accelerator.md), [`47_codex_plan_review.md`](47_codex_plan_review.md) — surfaces through which the thesis is delivered

## Revision history

- **2026-05-10 (origin):** drafted as the strategic foundation doc during the plan review framing session. Establishes living lineage as the governing thesis for the portfolio. Subsequent docs reference this rather than re-arguing it.
