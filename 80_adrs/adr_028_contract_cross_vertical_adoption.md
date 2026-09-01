---
id: adr_028_contract_cross_vertical_adoption
title: ADR-028 — Contract 1.8.0 cross-vertical adoption (license, verified absence, bitemporality, outcomes, lineage, PII)
status: accepted-partial
last_updated: 2026-08-27
applies_to: portfolio
related: [adr_018_atom_contract_substrate_layer, adr_017_atom_access_control, adr_001_atom_architecture, adr_011_atom_identity_across_versions, 25_atom_architecture_reference, _catalog/thesis_parity_ledger, _decisions/2026-07-20_cross_vertical_parity_program, _dispatches/2026-07-20_trading_cockpit_parity_adoption]
owner: nick
---

# ADR-028 — Contract 1.8.0 cross-vertical adoption

## Status

Accepted-partial 2026-08-21. Operator ruling `_decisions/2026-08-21_adr028_accept_partial.md`.

Group 2 (verified absence) is accepted as shipped: `@empressaio/atom-contract@1.22.0` carries `evaluated` and `provenanceScope`. Groups 1, 3, 4, 5, and 6 remain type-only intent until each has store evidence or an explicit unfed label. A follow-on ADR is owed for contract 1.9.0 through 1.22.0 (`./property`, `./reasoning`, `./testing`), which this ADR does not document.

Section 3's claim that `knowledge_atoms` proves bitemporality in production is struck. Store audit Q10 (`_inbox/2026-08-20_store_audit_atom_graph.md`, 2026-08-20T23:03Z): the table exists with `valid_from`, `valid_to`, `knowledge_at`, and holds zero rows. An empty table is not production proof. That is blueprint V15 / BP-BITEMP-01.

## Context

The trading vertical (Empressa Cockpit, empressa-trading) independently implemented the atom and calibration thesis in Python and made several contract-level decisions the real estate contract lacks. A 2026-07-20 source-level cross-audit (both directions; results in `_catalog/thesis_parity_ledger.md`) verified six concepts as present and load-bearing in the Cockpit and absent or fragmentary in `@empressaio/atom-contract@1.7.0`:

1. **License terms are not representable.** No type exists for data-source redistribution and display rights. The portfolio enforces license constraints today as doc-level rulings (the Cotality closed-secure-system clause, the PMTiles no-owner-names guardrail) and one-off code exclusions; nothing mechanical prevents the next surface from violating them. The Cockpit carries a per-feed license block and enforces the intersection of access policy and license at its gate, most restrictive wins.
2. **Absence claims are unverifiable.** "No liens found" and "no code violations" are core title, encumbrance, and compliance outputs, and the contract cannot distinguish "we checked these sources and found none" from "we did not look". The Cockpit's store rejects an absence claim (`evaluated: true`) that does not carry a non-empty scope of search. The engine already has this pattern untyped (the DEM adapter's coverage-honesty pair).
3. **Bitemporality is incomplete.** The contract carries `valid_from` only; `valid_to` does not exist in the repo, and there is no knowledge-time on atoms (the event ledger's occurredAt/recordedAt split exists only at the mutation-event level). Point-in-time reconstruction (edition-at-date, K2 retrodiction, "what did we know when the finding was issued") cannot be expressed at the atom grain. ldt's `knowledge_atoms` table carries `valid_from`/`valid_to`/`knowledge_at` as a schema. It is not production proof: store audit Q10 (2026-08-20T23:03Z) counted zero rows. Do not cite this table as evidence the shape is live.
4. **Outcomes have no typed family.** The adjudication and outcome ledger exists in ldt (hash-chained), but the contract has no outcome atom type, and the ldt vocabulary has no negative outcome kind: all three kinds in production count as positive, so realized outcome scores are degenerate at 1. The Cockpit's ledger carries `right|wrong|edited|partial|dismissed` plus a realized score at the (claim_type, worker) grain, which is what makes its calibration honest.
5. **Instance-level lineage does not exist.** The contract has type-level composition and export-side citation references, but an atom instance cannot declare which atom instances it was derived from. This is the measured M1 gap: deposit-to-atom attribution dies at a bare source-key string. The Cockpit makes input lineage mandatory for calibration atoms and fail-closed at serving.
6. **PII is not representable.** No flags exist; owner names flow unredacted through CAD and brief adapters, and the public-tile protection is a single deliberate SELECT omission in one bake script. The Cockpit rejects PII-bearing atoms at the store and holds PII in a separate encrypted per-subject store with crypto-shred erasure.

The confidence basis vocabulary is explicitly NOT in scope: the audit found the contract already ahead of the Cockpit there (`asserted|backtest|seed|live` plus the three-axis split, bare scalars unrepresentable). The gap on confidence is wiring (surfaces beyond findings still serve asserted values), which is engine and ldt work, not contract work.

## Decision

`@empressaio/atom-contract` takes a single additive minor release (1.8.0) carrying six optional field groups. Additive means: every field is optional at the type level, every existing atom and registration remains conformant unchanged, and no serialized shape changes meaning. Strictness arrives through conformance rules that activate only when a field group is present, plus two narrow always-on rules marked below.

**1. `license` block (per atom, optional).** `{ redistribute: boolean, display: "realtime" | "delayed" | "none", delayMinutes?, attributionRequired: boolean, derivedOk: boolean, termsRef? }`. Conformance rule when present: `delayMinutes` required iff `display: "delayed"`. Semantics: the effective right for any read is the intersection of accessPolicy and license, most restrictive wins; enforcement lives at the gate (consequence, not this ADR).

**2. Verified absence (per claim, optional pair).** `evaluated: boolean` plus `provenanceScope: string[]` (the enumerated sources searched). Always-on conformance rule: an atom asserting absence with `evaluated: true` MUST carry a non-empty `provenanceScope`; `evaluated: true` with an empty scope fails conformance. Absence claims without the pair remain representable but are second-class: surfaces should render them as "not checked", never as "none".

**3. Bitemporal completion (per atom, optional).** `validTo` joining the existing `valid_from` (interval semantics: `[validFrom, validTo)`, open-ended when absent), and `knowledgeTime` (when the system learned the fact, distinct from when it became true). `Scope.asOf` and `filterAtomsForAsOf` extend to interval evaluation when `validTo` is present. Existing single-timestamp atoms are unchanged.

**4. Typed outcome family.** A new registration family for outcome atoms pairing a prior atom (or finding) with a graded result: `{ subjectRef, label: "right" | "wrong" | "edited" | "partial" | "dismissed", score?: number, gradedBy, gradedAt, basisRef? }` at the (claimType, worker) grain. The vocabulary REQUIRES a negative kind to be representable; a ledger whose kinds are all positive cannot claim calibration from it. Outcome atoms are append-only (data-tier, signed history required, same as other data-tier atoms).

**5. Instance-level input lineage (per atom, optional).** `inputAtoms: AtomRef[]` declaring the instances this atom was derived from. Conformance rule when the atom's family is derived AND the atom feeds calibration: `inputAtoms` required, fail-closed at the consuming side (a calibration computation encountering a lineage-less derived input excludes it and reports the exclusion, never silently includes it). General derived atoms without lineage remain conformant in 1.8.0; tightening to lineage-required-for-all-derived is a candidate for a later major, mirroring the Cockpit's rule.

**6. PII flags (per atom, optional).** `containsPii: boolean` and `erasable: boolean`. Always-on conformance rule: `containsPii: true` on a `public-free` or `public-paid` atom fails conformance (PII never rides a public access policy). Store-side rejection and a split PII store are engine policy work, out of contract scope.

## Non-goals

No vocabulary import from the Cockpit (field names here follow this contract's existing conventions). No breaking change; 1.7.0 consumers upgrade on `^1.7.0` semantics untouched. No engine persistence, gate enforcement, or migration ships from this ADR. No consent field group (deferred until person-adjacent atoms arrive; tracked in the parity ledger as tier 3). No anchoring changes (the Cockpit anchoring harvest is an infrastructure workstream against the existing event-ledger TODO(M2-C), not a contract shape).

## Consequences

The doc-level guardrails become mechanically enforceable: the gate can refuse to serve a `display: "none"` atom to a public surface, the PMTiles bake rule generalizes to "no `containsPii` atom in a public artifact", and title/encumbrance outputs gain the verified-absence primitive their product claims require. The M1 calibration gap gets its contract-side half (engine persistence of `inputAtoms` is the other half). The ldt outcome ledger gains the vocabulary to record failure, un-degenerating realized scores. Downstream workstreams named in the parity ledger and owed their own plans: gate license enforcement, engine durable store fields, ldt outcome-kind migration, calibration projection worker.

## Reversal criteria

If any field group proves wrong in shape during implementation, amend this ADR before npm publish; nothing ships until accepted. If the license block cannot express a real vendor's terms encountered before acceptance, the block gains a `termsRef`-only escape (opaque reference plus most-restrictive default) rather than growing vendor-specific fields. If interval bitemporality breaks any existing `asOf` consumer, `validTo` ships type-only (no filter semantics) and interval evaluation moves to a later minor.

## Revision history

- **2026-07-20 (origin):** Proposed six field groups for 1.8.0.
- **2026-08-21 (accept-partial):** Group 2 accepted as shipped. Section 3 empty-table proof struck. Groups 1/3/4/5/6 remain type-only. Follow-on ADR owed for 1.9.0 through 1.22.0.
- **2026-08-27 (F-15 1.23.0):** Additive branded `NodeId` (`mint`/`parse` only). A raw string does not type-check as a node id. `parse("48021:34137")` refuses as a node id. Producer: Factory (ADR-030 rule 3). Does not close groups 1/3/4/5/6.
- **2026-08-27 (F-15 1.24.0):** `AliasAtom` (`identity.alias` with validity era) and lineage edges (`mergedInto`, `dividedInto`, `unmerged`). A node type with `mergedInto` does not compile.
- **2026-08-27 (F-15 1.25.0):** `ProvenanceClass` discriminated union. Factory four plus Observation and Synthesis from 19.
- **2026-08-27 (F-15 1.26.0):** `Derivation` export. `derivesFrom` required on Derivation, refused on Record.
- **2026-08-27 (F-15 1.27.0):** `AbsenceVerdict` closed union. `absent-verified` requires sourceId plus responseRef.
- **2026-08-27 (F-15 1.28.0):** `SupersessionEdge` with `closedAt`. No `supersededBy` column.
- **2026-08-27 (F-15 1.29.0):** `SelectorPredicate` closed union and exhaustive `match`. Flood A/AE/AO/X type-check.
- **2026-08-27 (F-15 1.30.0):** `AccessPair` (`discoverability`, `entitlement`). Existing `accessPolicy` stays exported and mapped.
