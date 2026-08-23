---
id: adr_030_declared_is_not_armed_contract_surface_governance
title: ADR-030 — Declared is not armed. Contract surface governance and the atom layering target state
status: proposed
last_updated: 2026-08-22
applies_to: portfolio
owner: nick
related: [adr_018_atom_contract_substrate_layer, adr_017_atom_access_control, adr_025_og_atom_ontology, adr_011_atom_identity_across_versions, adr_022_deal_twin_and_cross_application_capture, adr_029_building_footprint_and_utility_easement_rails, _decisions/2026-08-22_atom_layering_target_state, 61_enforcement_doctrine, _inbox/2026-08-22_contract_surface_store_truth_investigation]
---

# ADR-030 — Declared is not armed

## Status

Proposed 2026-08-22, on the substrate seat verification returned the same day.

## Snapshot

hauska-mcp-server branch `docs/p35-retrieval-key-durability-note` @ `4428f61`, deployed main `b5f26de`. hauska-atom-contract `main` @ `292a22b`. Contract inspected from the published npm tarball `@empressaio/atom-contract@1.22.0`. Store queried against Neon `hauska_mcp` on 2026-08-22. doc_repo `main` @ `1470560`.

## Context

The atom contract publishes eleven subpaths and a root module. A verification pass classified six surfaces into four states: absent, dormant (shipped, nothing imports it), starved (imported but non-gating or input never populated), and armed (gating or serving, with populated input). The results do not agree with what the contract's shape implies, and they do not agree with canon.

The metering gate is armed. `POST /mcp` authorizes before it serves, through `McpMeteringGate.authorizeCall` with `SDK_METERING=1` in the production build config, writing `sdk_metering_usage` on allow. Stripe is out of the money path. Inbound attribution to licensed sources is armed and writes `source_obligation_ledger` rows on every tier including anonymous.

Outbound payout is not. `RevenueRouter` is constructed in `buildGate()` and `handleSettledOveragePayment` has zero call sites and no webhook route. The ICC actor fixture carries no `perReferenceRateMinor`, so accrual rows land with `amount_minor: null` and `grace_terms: "pending-rate"`. `ActorLicensingTerms` is never read at authorize or price time.

The `./temporal` module is dormant in all three of its types, and `would-affect-edge` does not express what its name suggests. It is a 1:1 immutable edge from one `evt_` node to one subject node, not a queryable relation from one change to many affected subjects. There is no producer, no store, and no query API.

`./obligation` is dormant. Zero obligation rows exist in the store.

The store holds 104,132,919 rows across 21 entity types, not the 17 types and roughly 100 million rows canon carries. Access policy distributes as 99,878,457 `public-free`, 4,250,468 `public-paid`, 3,994 `platform-internal`, and **zero rows at `tenant-private` and zero at `tenant-shared`**. Twenty of the twenty-one populated types are property or code-corpus types. No og type, no encumbrance type, no workspace type, no actor-record and no obligation has a single row. `utility-easement` ships as a type under ADR-029 and holds zero rows.

Smart Files is structurally unreachable from the MCP gate. There is no second pool, no `SMART_FILES_*` environment variable, and no import path.

Version state does not reconcile. The published package is 1.22.0, the source tree's `package.json` says 1.20.0, and hauska-mcp-server resolves `@empressaio/atom-contract@1.9.0` alongside the frozen `@hauska/atom-contract@1.6.1`. The gate is running a contract thirteen minor versions behind what is published.

## Decision

**1. Four-state classification is the reporting standard.** Any statement that a contract surface, control, or capability exists must classify it as absent, dormant, starved, or armed, and name the evidence for the classification. "The type ships" is not an answer to whether a capability exists. This extends `61_enforcement_doctrine` from controls to contract surfaces.

**2. A capability may be claimed in present tense externally only at armed.** Dormant and starved surfaces are roadmap. This binds marketing copy, positioning documents, counterparty conversations, and podcast statements, and it is the mechanism by which the claims ledger gates a document before it ships.

**3. No new atom type publishes without a named producer, or it publishes marked unimplemented.** The contract may not continue to accumulate types with no writer. Where a type is published ahead of its producer deliberately, the contract itself declares it, so a consumer reading the exports learns the same thing a store query would.

**4. The layering and identity target state in `_decisions/2026-08-22_atom_layering_target_state.md` is adopted.** One contract, one identifier discipline under ADR-011, two axes (place-keyed and matter-keyed) as peers, authority split into its own type rather than inferred from access policy, enumerations imported and never copied, and typed place-to-matter joins that refuse unresolvable writes.

**5. The access-policy dial is two stores until it is one.** With zero tenant rows in the atoms store and the tenant surface living in a separate database, there is no single dial today. No document describes file, publish and collect as a present-tense capability until Smart Files documents are addressable through the gate. The commercial model stands; its tense does not.

**6. Version reconciliation is a gate condition.** Published, source, and installed versions must be reconcilable, and the divergence above is a defect owned by the substrate seat. A gate serving on a contract thirteen minors stale cannot be reasoned about from the published types, which is how this verification nearly produced a wrong answer about what the gate can do.

## Consequences

Positive. The two strongest differentiators are now known rather than assumed, which is worth more than either would have been if assumed correct. Attribution being armed while payout is dormant is a two-item gap rather than an architecture problem: a rate on the ICC actor record and a settlement webhook. The store enumeration replaces two stale canon numbers with derived ones.

Negative. Forward consequence is not a shippable claim and was about to become the lead differentiator in a public document. The obligation and temporal families, which carry the most distinctive product ideas in the contract, have no data behind them. A material fraction of the published contract is types with no producer, which is the accumulation this ADR exists to stop.

## What this changes downstream

The positioning document's second and third claims fall back. Forward consequence becomes composition: walk the chain, every hop cited, which is armed. Rights-holder payment becomes attribution: every call is counted and attributed to the owner of the record, which is armed and is a real and unusual claim, while payment stays future tense until the rate and the webhook land.

`utility-easement` shipping empty is also an opening rather than only a gap. A counterparty holding a large easement image archive may have stated on the 2026-08-19 First American Data Analytics call that easement extraction from images remains unsolved — **that line is paraphrase only until the Otter transcript is filed in tracked canon** (Thread C close 2026-08-22: SOURCE NOT FOUND). A declared and empty type on our side and an unextracted archive on theirs describe the same missing capability from two directions when the paraphrase is verified.

## Reversal criteria

Reverse item 3 if a published-ahead-of-producer type turns out to be load-bearing for a consumer's compile-time contract in a way that the unimplemented marker breaks. Reverse item 5 the moment a gate path to Smart Files documents exists and is demonstrated by a served row, not by a merged PR. Item 2 does not reverse; a present-tense claim on a dormant surface is the defect this operation was built to stop making.

## Owed

An amendment to ADR-018 recording that the metering seam is armed, since the earlier state that ADR implied has been fixed. A superseding note on ADR-022, which describes Cotality as a live source. And a rate on the ICC actor record, which is the single cheapest item standing between attribution and revenue.
