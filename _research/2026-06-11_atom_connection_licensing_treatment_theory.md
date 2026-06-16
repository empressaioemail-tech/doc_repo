---
id: 2026-06-11_atom_connection_licensing_treatment_theory
title: Connection-licensing and the atom treatment — vision capture
date: 2026-06-11
kind: vision-scratch
status: table-talk-uncommitted-to-canon
related: [09_post_saas_substrate_thesis, 80_adrs/adr_018_atom_contract_substrate_layer, 08_tiered_access_model, 2026-06-11_hauska_ai_engine_and_protection_for_cotality, 77b_cotality_integration_strategy, 14_pricing_framework]
---

# Connection-licensing and the atom treatment

> **What this is.** Scratch capture of a 2026-06-11 vision conversation with Nick. Nothing here is canonical, decided, or premortem-cleared. It is caught so it survives the session. We pick up tomorrow. When any thread here becomes a move rather than a musing, it runs through premortem-check formally and likely touches `09_post_saas_substrate_thesis.md` plus a possible new doc on the treatment-as-product.

## The one sentence everything hangs on

We do not sell a copy of the atom. We license a connection to it, and the download is just the part of the connection that works offline.

That sentence dissolves the snapshot weakness, makes resale a non-threat, and moves the payment event from download to resolve.

## How we got here

Started from "download an atom and load it into a generic LLM." The weak point was that a downloaded atom is a frozen photograph: confidence goes stale, freshness has no backstop, calibration (arrow two) can't reach it. Nick's move was to hook an umbilical cord to the atom: a live link back into our system so that a downloaded atom loaded into some other LLM weeks later can still call home to its chain and lineage.

That reframes the atom from a file into a thin client. The blob you hold is the cached representation. The truth lives at the other end of the cord. Mental models: a git commit with a remote, a cached object with an ETag validation endpoint, a DID with a resolver. The cord is almost certainly an MCP tool reference, which is why MCP-first matters at the atom level and not just the product level. We are not inventing a transport, we are shipping the address.

Three things fall out of the cord, all on-thesis hard:
- It closes arrow two for exported atoms. Every pull of the umbilical is an outcome signal that tightens calibration. The atom re-attaches to the earning loop every time it is used.
- It makes the moat physical. Someone can copy the JSON. They cannot copy the live lineage at the other end of the cord. The snapshot is deliberately insufficient to steal.
- It moves sovereignty enforcement from download to resolve. A tenant-private atom in a random LLM does not leak, because the cord refuses to resolve outside the tenant. You can revoke after the fact: kill the cord, the atom degrades to its last snapshot or goes dark.

## The apartment metaphor (the access architecture in costume)

123 Main is an apartment complex. The owner runs an app that grants tenants scoped, keyed, metered, revocable access to units. Rename four nouns and it is the whole system:
- The building is the canonical record in our system. Never sold.
- A unit is a scoped connection. Not all of 123 Main, only the part you are entitled to.
- The keys are auth. The cord resolves only for whoever holds the key. No keys, no umbilical. This is why the whole thing is gated on the per-user auth build (task #29 plus the tenant leg).
- The utilities are what flows through the live connection: freshness, re-ground, lineage, calibration. The landlord turns the water on and off.

Move out, the keys stop working, and all you keep is a photo of the apartment (the offline snapshot). It proves you lived there; it does not let you back in. Revocation, metering, and sovereignty stop being three features and become one mechanism: the landlord controls the keys and the utilities.

The fifth accessPolicy value (`tenant-shared`, added in contract 1.2.0) is the common areas: shared among a defined group, not public. The metaphor predicts the value we already shipped, which is the tell that it is real structure and not just a nice picture.

## The scale ladder (different sizes of unit)

- **Code atom** = a studio. One jurisdictional fact (Bastrop rear setback). Universal, not parcel-bound. The cord's job is narrow: when the ordinance amends, your studio's floorplan changed. Cheap to keep live, high value because staleness on a code rule is how people file the wrong permit.
- **Property atom (123 Main)** = the apartment. A bundle scoped to a parcel: zoning, setbacks, utility hookups, permit history, encumbrances (ADR-020/021), flood. A property genuinely changes over time, which is where "the atom is alive" stops being a slogan.
- **Data room** = a floor or the whole building leased to one counterparty. A curated bundle assembled for a transaction or relationship (due diligence, a deal room). The licensable thing is the relationship. Grant keyed access unit by unit, utilities running, shut it the day the deal dies.

### Naming flag (do not let this harden wrong)
Nick reached for "atom contract" to name the data-room bundle. That name is already load-bearing: `@hauska/atom-contract` (ADR-018) is the schema substrate, peer to the SDK. Recommendation: use the chemistry ladder. Atom, then **molecule** for the structural concept of bound atoms, with **data room** as the product-facing name for a transaction-scoped molecule. Lock "atom contract" to the schema. Cheap to fix now, expensive in three docs.

## The product cube

Three axes give the whole offering:
- **Scale**: code atom, property molecule, data-room molecule.
- **Connection richness**: freshness-only, re-ground, live lineage walk, subscribe. Build freshness-only first (nearly free, kills staleness). Lineage walk is the premium tier.
- **Access tier**: the five-value accessPolicy union we already ship.

## The eight bindings (the mechanics of "the treatment")

The macro question: what does our treatment do to a datum such that all the good stuff becomes possible? Atomization is binding eight things to an inert fact. Each binding unlocks exactly one capability; strip it and the capability dies.

1. **Dual identity.** Stable logical id (the fact) plus content hash (this snapshot). Lets you ask "is my copy current" versus "give me current." The anchor the cord resolves against. No identity, no cord.
2. **Provenance edges.** Source is a link to another node (raw doc, adjudication, or another atom), not a citation string. Makes it provable and makes it a network instead of a pile.
3. **Reasoning chain.** Derivation from source to claim, carried in the atom. Commitment #1 made physical. What a generic LLM gets that it could never generate: not the answer, the work.
4. **Calibratable confidence.** A number plus its state (asserted-baseline-with-provenance vs earned-through-outcome) plus verification state. Where the calibration loop attaches.
5. **Freshness contract.** As-of timestamp plus the policy for how it knows it is stale. Lets a downloaded atom degrade honestly offline; what the cheapest cord call validates.
6. **Access policy.** The five-value tier carried on the atom. The keys-and-utilities tier the resolver enforces.
7. **Resolver binding.** The literal cord: a resolvable reference (almost certainly an MCP tool handle) that re-grounds or walks lineage, checked against access policy. Gated on the auth build; a resolver with no key check is a leak.
8. **Settlement hook.** Metering and routing identity: when the cord is pulled, who gets paid, at what rate. The VDA-wrapping / payment-substrate binding. Makes micropayment-at-resolve possible instead of seat licensing.

Precise macro claim: a datum is "atomized" when it carries identity, provenance, reasoning, calibratable confidence, a freshness contract, an access policy, a live resolver, and a settlement hook. Everything above is downstream of an object with those eight.

## The macro reframe: we are the treatment, not the data

Cotality is the test case because it exposes what every web-data owner bleeds from: their data is a dumb pipe. Query it, get a number, the number escapes, and now they cannot revoke it, prove it came from them, bill the long tail of small uses, or stop it pooling into someone's training run. Their crown jewels have no umbilical.

The offer is not "buy our property data." Cotality has property data. The offer is: run your data through our treatment and every datum you expose becomes an atom you still control after it leaves you. Provable (charge more for trustworthy data). Protected (download stops being the leak; the cord is the control; revocable). Sovereign (tenant-private is built for exactly the customer who will never let their data pool). Monetizable at the margin (micropayment per resolve, capturing the long tail they cannot invoice today).

That flips us from a company competing with Cotality to the protocol Cotality runs on. This is `09_post_saas_substrate_thesis.md` at its full extension. Note: there is already an outbound Cotality writeup (`2026-06-11_hauska_ai_engine_and_protection_for_cotality.md`) that describes the engine and source protection. This vision is the generalized substrate frame underneath that specific deliverable.

## "A neural network for data that's provable" — sharpened

Atoms are nodes. Provenance edges are the connections. Calibration weights are the strengths, tightening with use the way a network's weights do. So it is a network that learns. The inversion is the pitch: a normal neural net is a black box, every weight unauditable. This is the opposite. Every node carries its derivation, every edge is a real citation, every weight has an inspectable calibration state. It is a neural network you can subpoena. The trust-bearing version of a learning graph, which is the entire wedge for physical-world, consequence-bearing data where a hallucinated setback gets a building denied.

## Open tensions to carry (not resolved)

- **Wedge versus ocean.** "All data needs atomization" is true and boils the ocean. Spine rule applies. Keep the macro theory as the horizon and point the offer at physical-world / jurisdictional / consequence-bearing data first, where provenance actually matters. Cotality is on-spine (property is physical-world). The drift risk is the generalization past that.
- **Build-gating.** Bindings 7 and 8 (resolver, settlement hook) do not ship today. The umbilical is gated on per-user auth (#29 + tenant leg). The Cotality conversation is a vision sell against a roadmap, not a now-sell. Frame honestly.
- **Whose confidence is it.** Our calibration loop earns confidence on our reasoning. Wrapping a third party's data, we may never see the outcomes that would calibrate it. Clean answer: wrapped third-party data ships at asserted-baseline-with-provenance and earns only against outcomes we actually observe. Nail before promising a customer a number we cannot back.
- **Identity fork.** Data company or protocol company. The macro theory says protocol: bigger, better, harder, and it changes who we are to the market and investors. Name it, sit with it, do not decide it casually.
- **Composition (the hard engineering).** A molecule is a bundle of cords, so freshness and revocation must compose. Revoke one underlying code atom and what happens to the data room that quoted it: partial-dark, last-snapshot-with-stale-flag, or refuse-as-a-whole? When one atom re-grounds, does the molecule's confidence recompute live? A single atom's umbilical is simple; a molecule's is a dependency graph.

## Pick-up for tomorrow

Three candidate directions, not yet chosen: (a) write the treatment-as-product doc and the eight bindings as a real spec; (b) amend/extend `09` with the connection-licensing frame and the protocol-vs-data-company fork; (c) turn the Cotality angle into a substrate offer that sits underneath the existing outbound writeup. Any of these is a move and runs premortem-check first.
