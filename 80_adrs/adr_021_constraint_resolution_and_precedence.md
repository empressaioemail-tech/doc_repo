---
id: adr_021_constraint_resolution_and_precedence
title: ADR-021 — Constraint resolution and precedence (public + private lattice)
status: accepted
last_updated: 2026-06-08
applies_to: portfolio
related: [adr_010_atom_graph_traversal, adr_013_procedure_execution_atoms, adr_020_recorded_instruments_and_restriction_clauses, 27_engine_evolution_plan, 46_smartcity_parcel_intelligence, 47_codex_plan_review, 49b_encumbrance_ingestion_pipeline, _decisions/2026-05-26_recorded_restrictions_phase_0_scope]
owner: nick
---

# ADR-021 — Constraint resolution and precedence

## Status

**Accepted** 2026-05-26. Defines how the engine composes public code, regulatory overlays, and private restriction clauses into an **effective constraint set** for a parcel. Engine implementation is Phase 6; briefing may ship a simplified resolver in Phase 1.

## Context

Parcel briefing and plan review need a single answer to "what constrains this parcel?" Sources include:

- Layered municipal code (`code-section` + amendments per ADR-019)
- `constraint-overlay` (FEMA, habitat, zoning overlay districts)
- `restriction-clause` from `recorded-instrument` (ADR-020)
- `administrative-rule` (advisory HOA guidelines)

Without explicit precedence rules, LLMs improvise conflicts (e.g. zoning vs CC&R height limit). Procedure-execution and approval workflows need deterministic gating when unresolved conflicts exist (dossier thread: `constrains` relationship).

## Decision

### Output atom: `constraint-resolution`

One atom per resolution run (or embedded section in `parcel-briefing` until atom registration lands).

**Required fields:**

- `parcelDid` (anchor)
- `resolvedAt` (timestamp)
- `rules[]`: array of `{ basis, basisCid, ruleSummary, precedenceRank, confidence, legalWeight }`
  - `basis`: `code-section` | `code-amendment` | `constraint-overlay` | `restriction-clause` | `administrative-rule`
  - `basisCid`: target atom CID
  - `precedenceReason`: one sentence (machine-generated, human-auditable)
- `conflicts[]`: array of `{ topic, competingBasisCids[], status: unresolved | resolved, resolutionNote? }`
- `procedureExecutionCid?` (ADR-013 link when resolution was agent-produced)

Every rule entry carries **confidence** and **evaluatedAt** (quality gate). Reasoning chain is in `ruleSummary` + `precedenceReason`, not raw data dump.

### Precedence rules (v1)

Apply in order when domains overlap:

1. **Life-safety and adopted building code.** Municipal / model code (`code-section` + amendments) wins over private covenant on egress, fire, structural minimums, and any topic where code explicitly states it is minimum standard.
2. **More restrictive wins** on dimensional and use limits when both public zoning/code and private restriction address the same topic and code does not declare a maximum-only floor. Private restriction may be stricter than zoning; it may not legalize a use code forbids.
3. **Recorded instrument over advisory.** `restriction-clause` (`legalWeight: recorded`) wins over `administrative-rule` (`advisory`) on the same topic.
4. **Temporal.** Later recording or recorded amendment supersedes earlier `restriction-clause` on the same topic when `supersedes` / `amendedBy` links exist.
5. **Unresolved conflict.** If rules 1–4 cannot resolve (contradictory recorded clauses, or code silent and two recorded clauses conflict), emit `conflicts[]` with `status: unresolved`. Downstream workflow must not auto-approve.

Rules are implemented in engine code (deterministic), not left to LLM-only judgment. LLM may *propose* resolutions; engine validates against rules 1–5 before writing `constraint-resolution`.

#### Cross-tier preemption vs intra-tier selection (implementation clarification, 2026-06-08)

The finding-engine `reconcileStandardPrecedence` primitive (legacy-design-tools `lib/finding-engine`, shipped in PR #147) carries a finer-grained `ruleApplied` label than the v1 rules above. Two of those labels describe different operations and must not be conflated:

- `federal-preempts-where-applicable` is a **cross-tier** statement: a federal standard displaces model-code / state / local on a topic where federal is the controlling floor. It explains why the lower tier was dropped from the decision pool.
- `most-stringent-governs` is an **intra-tier selection**: among co-applicable standards of the same tier, the more stringent value governs (rule 2 above).

The case that exposed the distinction is two co-applicable **federal** standards (ADA vs FHA) on accessibility. Neither preempts the other; both are federal and co-applicable, so the governing value is selected by `most-stringent-governs` (FHA's 24in latch-side clearance governs), while the cross-tier `federal-preempts-where-applicable` step belongs in the reasoning chain only where a lower tier was actually displaced. Reporting `federal-preempts-where-applicable` as the governing rule for an intra-federal stringency pick is a label error (outcome correct, attribution wrong). The implementation refinement landed as legacy-design-tools PR #149 (`cortex/precedence-taxonomy-intra-federal`): `ruleApplied` is deferred until the decision pool is known, a `federalPreemptApplied` flag keeps the preempt step in the reasoning chain without the sticky label; finding-engine 81/81 green. Held for merge.

### Procedure-execution gating (v1 stopgap)

When `conflicts[].status === unresolved` for a topic material to the submitted plan:

- Plan review may emit finding severity `conflict-unresolved`.
- Certificate / approval-style `procedure-execution` atoms should not record `outcome: approved` on the parcel submittal without a linked `variance-record` or adjudication atom (shape TBD; may extend `decision-event`). Full ADR for approval gating deferred; this ADR records the intent.

`constrains` edges from `restriction-clause` to geometry (when present) feed spatial checks in Cortex site context; gating ties to the same unresolved-conflict rule.

### Engine API shape (normative intent)

- `resolveConstraints({ parcelDid, engagementId?, proposedUse? }) → ConstraintResolution`
- Pre-expansion per ADR-010: anchor `parcel-record`, 1-hop `subject-to` instruments, applicable `constraint-overlay`, adopted code edition refs from `jurisdiction-corpus`, then run resolver.

MCP tool `resolve_constraints` (Phase 2) wraps the same call.

### Finding severity extension (Codex / Cortex)

Extend finding taxonomy (product repos) to include:

| Severity | Meaning |
|---|---|
| `code-violation` | Municipal / model code enforcement risk |
| `covenant-violation` | Private recorded restriction risk |
| `conflict-unresolved` | Lattice could not resolve; human required |
| `advisory` | Unrecorded HOA guideline only |

Citations: `[[CODE:cid]]` vs `[[RESTRICTION:cid]]` (product convention; not atom contract fields).

## Alternatives considered

**LLM-only merge in briefing prompt.** Rejected for production path. Fails auditability and procedure gating; acceptable only as Phase 1 interim behind `verificationStatus: machine`.

**Single "effective zoning" atom.** Rejected. Loses provenance and revenue attribution per source layer.

## Consequences

**Positive:** One composable primitive for briefing, MCP, and plan review. Aligns with sell-reasoning commitment.

**Negative:** Resolver maintenance as law and extract quality evolve; needs test fixtures per precedence case.

## Open decisions

- `variance-record` atom type vs reuse `decision-event` with discriminator.
- Whether `constraint-resolution` is persisted always or computed on read for MVP.

## Reversal criteria

Revisit if legal review requires jurisdiction-specific precedence statutes (e.g. non-TX states) that break the five-rule v1 model; add `jurisdictionPrecedenceProfile` rather than abandoning the atom.

## References

- [ADR-020](adr_020_recorded_instruments_and_restriction_clauses.md)
- [ADR-013](adr_013_procedure_execution_atoms.md)
- [ADR-010](adr_010_atom_graph_traversal.md)
