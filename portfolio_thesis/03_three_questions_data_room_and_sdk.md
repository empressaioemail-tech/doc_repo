---
id: portfolio_thesis_three_questions
title: The three questions — data room and SDK
status: active
last_updated: 2026-08-15
applies_to: portfolio
owner: nick
related: [_thought_leadership/04_positioning_narrative, portfolio_thesis/01_the_layer_and_the_three_doors, 09_post_saas_substrate_thesis, 14_pricing_framework, 28_mcp_first_product_design, 29_mcp_surface_tier_model, 80_adrs/adr_018_atom_contract_substrate_layer, _smartcity_masters/34_smartcity_smart_files_and_foundation, 90_operations/OPS-17_govtech_stack_plan_of_record]
purpose: Maps the Empressa mountain (three questions every agent transaction asks) onto the stack. This is the document that explains how the Hauska SDK relates to a data room. Ratified in session 2026-08-15 from the 2026-08-14 positioning narrative.
---

# The three questions: data room and SDK

The mountain is `_thought_leadership/04_positioning_narrative.md`. This file is the stack mapping. Where a product plan and the mountain disagree about what the SDK is for, this file wins.

Every agent transaction asks three questions:

1. Who am I dealing with?
2. What is this thing, really?
3. How do I pay?

Rails have answered question 3 a hundred times. We build the answers to 1 and 2. Question 3 is in the stack so that when a verified record is consumed, money can move. It is not the product.

## The mapping

| Question | What it is | Where it lives | What a human sees |
|---|---|---|---|
| 1. Who am I dealing with? | Actor identity, tenant, accessPolicy | ADR-015 actor atoms, ADR-017 accessPolicy, G-11 tenancy | Who can open this folder; who is refused |
| 2. What is this thing, really? | A twin: a node full of atom facts, each carrying evidence | Spine atoms, Smart Files documents/versions/placements | The data room |
| 3. How do I pay? | Metered consumption, settlement, source-actor routing | Hauska SDK (`@hauska-sdk/payment`), MCP paid-tier tools | Not the data room. A machine-facing charge at the gate |

**The data room is questions 1 and 2 made browsable.** Folders are nodes (the thing). Files are file-shaped atoms (documents with attachments), not every atom. Other atom types stay typed; they show on the node through edges, in the record pane, not dressed as files. An atom appears in a folder via an edge (ADR-010), not because its entityId is the folder (ADR-001 identity is what the atom is). One file-atom in many folders is multiple `placed-on` edges, same identity. A PDF travels with the atom it belongs to because the evidence is part of the record, not a sibling object in a bucket. The sidebar is the evidence: source, time, accessPolicy, confidence, versions, edges. When we do not know something, the room says so and says where we looked. Decision `_decisions/2026-08-15_file_set_edges_not_identity.md`.

**The SDK is question 3.** It wraps a verified atom for paid consumption and routes the payment. ADR-018: the atom contract and the SDK are peer substrates. The contract makes something an atom. The SDK monetizes atoms once they exist. The Hauska MCP Server consumes the contract always, and the SDK only when serving paid-tier surfaces that require VDA wrapping or revenue routing. Command Center is non-commercial (`29_mcp_surface_tier_model.md`): no metering, no take rate. An operator browsing the data room is not a payment event.

This is the graveyard rule in engineering form. You cannot safely tokenize, or transact, what you cannot verify. The SDK must not charge for a record the data room cannot open with its evidence attached. Tokens need twins. The data room is where the twin is visible. The SDK is how an agent pays for a twin it can check.

## What this forbids

- Putting Circle, VDA wrapping, or take-rate routing on the Command Center data-room path. That path is proof of questions 1 and 2, not a storefront.
- Treating the $25,000 Vertosoft Smart Files SKU as an SDK event. That is a deploy price for a human product door (portfolio thesis 01, Smart City). It is not per-atom settlement.
- Turning on SDK payment against unverified or untyped-absent records. Question 3 without question 2 is the rails race with a hole in it.
- Inventing a second file-share product beside the twin. Doc 34 already is this mechanic: files are atoms with attachments; folders are nodes; one record, many relationships.

## Sequence that follows

1. **CC-done (proposed G-56).** Make question 2 visible in Command Center. AccessPolicy and product-key on every read (thin question 1). MCP tools as the machine face of the same room. No SDK payment.
2. **G-11 tenancy.** Finish question 1 on customer surfaces before any tenant-private Bastrop corpus enters the room.
3. **First real SDK customer: ICC (Lane D, G-50).** A licensed source, a known actor, content that upgrades `platform-internal` to `public-paid`, two citing surfaces, one ledger. That is the first time question 3 has something true to charge for. Decision `_decisions/2026-08-15_icc_first_sdk_customer.md`.
4. **Customer-done Smart Files (G-53 / Lane B).** A city uses the room. Still not an SDK micropayment unless an agent is consuming paid atoms.

Sports (ATX Bulls) and capital markets are independent proofs of the same architecture. They do not jump ICC as the first paying SDK counterparty.

## Two-altitude rule

Internally: twin, node, atom, ground truth, data room, SDK, token, VDA.
Externally to a city: the record, the asset, current state, search, revise once. Never say token, onchain, atom, node, graph, or SDK in SmartCity copy.

## Reversal

Reverse the ICC-first rule only if a signed paying counterparty needs per-atom settlement before the ICC agreement, and that counterparty's atoms already carry evidence the data room can open. Reverse the "SDK is not the data room" mapping only if Command Center itself becomes a paid agent surface, which it is ruled not to be.
