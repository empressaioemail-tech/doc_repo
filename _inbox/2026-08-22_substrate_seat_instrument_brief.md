---
id: 2026-08-22_substrate_seat_instrument_brief
title: Substrate seat brief — the contract and gate work the instrument contract creates
date: 2026-08-22
from: doc_repo integration planner (business / thesis session)
to: substrate seat (hauska-atom-contract, hauska-mcp-server)
status: brief — new items need plan rows before dispatch
related:
  - 19_the_instrument_contract
  - 24_instrument_conformance_program
  - 80_adrs/adr_030_declared_is_not_armed_contract_surface_governance
  - _inbox/2026-08-22_contract_surface_store_truth_investigation
---

# Substrate seat brief

Read this instead of `19` and `24`. Only what the substrate seat owns. Items marked NEW have no plan row and need an OPS amendment and an operator go before dispatch.

Your two verification passes on 2026-08-22 produced most of the evidence this rests on, and several findings below are yours restated as work.

## Already yours, carried forward

**Version reconciliation.** The gate resolves `@empressaio/atom-contract@1.9.0` while npm publishes 1.22.0 and the source tree says 1.20.0, and `hauska-map` runs the frozen `@hauska` name at 1.5.0. ADR-030 decision 6 makes this a gate condition. Reasoning about the gate from the published types is unsound until it closes, which nearly produced a wrong answer during the verification itself.

**The rate on the ICC actor record.** The cheapest item on the entire board. Attribution is armed and writes a ledger row per reference on every tier; the fixture carries no `perReferenceRateMinor`, so rows land `amount_minor: null` with `graceTerms: "pending-rate"`. One number converts a counting ledger into a revenue ledger.

**Outbound payout.** `RevenueRouter` is constructed in `buildGate()`, `handleSettledOveragePayment` has zero call sites, there is no webhook route, and the only exported ledger adapter is in memory.

## Type items — atom contract

Each of these deletes a rule from the ruleset by making the violation not compile. They land opportunistically and need no program between them.

| # | Item |
|---|---|
| 2.1 | Branded `NodeId`, constructible only by `mint()` or a validating `parse()`. This is the headline rule of `19` and the most type-killable clause in it: a fixture cannot test a write path, a type does not need to |
| 2.2 | Provenance class as a discriminated union with per-class required fields |
| 2.3 | `derivesFrom` required on the Derivation variant, absent on Record, so a Derivation has no Record shape to occupy |
| 2.4 | `absent-verified` requires a source that responded; `lookup-failed` requires the failure reference |
| 2.5 | `contested` layer variant with `precedenceBasis`, and no single-value accessor, so a lens cannot collapse it |
| 2.6 | `basis` and offer-manifest category bounded to closed vocabularies; free text is the leak |
| 2.7 | Required at mint with no defaults: `custodyOnLapse`, `chainAnchoring`, grant-or-delivery, offer manifest |
| 2.8 | Supersession as an edge; no `supersededBy` column exists to write |
| 2.9 | `canonical(id, knowledgeAt)`; the one-argument form does not exist |
| 2.10 | Alias as an atom (`identity.alias`); lineage as edges with `mergedInto`, `dividedInto`, `unmerged` as distinct events |
| 2.11 | Selector predicate as a closed discriminated union: spatial containment, set membership, equality, range, composition |
| 2.12 | Access as two orthogonal fields, discoverability and entitlement, replacing the ADR-017 single enum |

## Type items — MCP gate

| # | Item |
|---|---|
| 2.13 | Entitlement result as `resolved \| unresolvable \| anonymous`, where only a missing header yields anonymous. A malformed key must not resolve to public |
| 2.14 | Access resolver signature takes only the record and the caller entitlement; the module cannot import the request. Markets already does this and says so |
| 2.15 | Entitlement resolver has no `asOf` parameter. Entitlement resolves at now; `asOf` selects content. A revoked grant is revoked for every `asOf`, and without this the ceiling holds while the system leaks |
| 2.16 | Grant atom shape, with the entitlement graph resolved under a declared system entitlement. That recursion has no base case unless one is written, and every implementer who hits it invents a different privileged path |

## The six probes

These cannot be typed and constitute the behavioural suite. A conformance package is the natural home; each surface runs it against its own store and publishes the result stamped with the fixture-set hash and the commit.

| # | Probe | Asserts |
|---|---|---|
| 3.1 | Write refusal | a malformed id is refused at the store boundary, not stored |
| 3.2 | Selector re-evaluation | two runs plus a mutation against a versioned store state give the stated set |
| 3.3 | Derivation id stability | a rebuild reproduces the same id, so a delivered evidence chain does not dangle |
| 3.4 | Ceiling property test | for every caller, the result is a subset of the platform result |
| 3.5 | Unauthenticated verify | verification answers with no credential against the deployed service |
| 3.6 | Export round trip | export, verify offline, resolve nothing |

Two riders: class signed at origin so a middle-hop re-class is detectable, and `verifiedLevel` issued only where a corroborating atom or an outcome exists.

**Each probe is run against a known violation and observed failing before any passing run is reported.** A probe observed only passing has not been observed working.

**A suite that runs in no workflow is dormant.** The workflow is the deliverable, not the tests.

## Two corrections in the contract package

`DownloadableAtom` in `./export` carries `signedEventChain` and **no signature, no countersignature and no key**, while `verifyEventChain` recomputes an unkeyed SHA-256 chain using a formula published inside the package. That is tamper-evident against corruption and forgeable by anyone who can run the function. The countersignature is the field the whole minting model leans on and it does not exist. Rename the misleading field as part of the same change.

And x402 is dormant, not armed: the implementation exists only in the SDK package and no serving repo emits a 402. `19` describes purchase over x402, so either a surface serves one or the document keeps it in the not-armed table, and it currently does.

## Not yours

The 21-type classification, the demotion of enumerated families, Smart Files membership semantics, lineage backfill, and the two measurements are property seat. There is a separate brief for them.
