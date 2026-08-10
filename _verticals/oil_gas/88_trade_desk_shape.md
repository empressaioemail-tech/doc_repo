---
id: verticals_oil_gas_88_trade_desk_shape
title: Trade desk — what a desk is, and the shape of ours (middle-and-back-office-as-software)
status: exploration
last_updated: 2026-08-10
applies_to: [hauska, empressa]
owner: nick
related: [87_og_lifecycle_framework, _prospects/red_sands/2026-07-08_garrett_red_sands_digest, 80_adrs/adr_025_og_atom_ontology, 85c_og_app_review_meeting_digest]
---

# Trade desk shape

> **Status: exploration, not canon.** Shaped in the 2026-08-10 ideation close from the 2026-07-08 Garrett (Red Sands Global) meeting material. Gated on Garrett's artifacts and the TradeX verification pass; see Gates below. All Garrett-sourced facts are his statements unless marked verified.

## What a trade desk is, in general

Two animals share the name. A **financial desk** trades paper; anatomy is front office (originate and price), middle office (risk, credit, counterparty limits, compliance/KYC), back office (confirmations, documents, settlement). Margin is spread and flow; risk is mostly price. A **physical commodities desk** moves molecules; same three layers, weight inverted: price risk is hedged or back-to-backed away and the real work and risk live in middle and back office (is the counterparty real, the product real and on-spec, the storage real, the document chain intact, title clean, money safe). Margin comes from logistics, basis, and executed paperwork. An intermediary desk (Garrett's) is the purest case: buy from supplier, sell to vetted buyer back-to-back, take title momentarily, edge = deals that actually close in a market where most are fake or die in process.

**The load-bearing observation:** Garrett already has a front office (TradeX supply relationship, vetted-buyer list, deal instinct). He personally performs the entire middle office (drove 58 tank farms, 12 passed; calls SGS to verify report numbers; sends packages to the Rotterdam/TCC enhanced-due-diligence group; background-checks paymaster attorneys and their IOLTA accounts) and the entire back office (hand-writes procedures per methodology; assembles LOIs/ICPOs/TSAs; drafts the commission split per deal). His velocity gap (historically one close a quarter vs the 2-2.5 a week TradeX can feed him, per him) is not supply, buyers, or capital. It is one man manually being a middle and back office.

## The shape of ours

We are not a desk. We do not take title, match principals, touch funds, or guarantee deals. We sell the desk's infrastructure, five layers:

1. **Registry (the credit/KYC function).** Verified buyers, sellers, tank farms, shippers, paymasters. Tiered: tier-1 terminals (Kinder Morgan class) are not the problem; tier-2 farms renting tanks from tier-1 operators are the fraud zone, so the registry models the tank rental relationship (an encumbrance-shaped fact). Verification stack systematizes Garrett's own method: TCEQ environmental certificate (his kill test: no certificate, not real), RRC, SoS, D&B, Rotterdam list with its known flaws handled (blacklisted-but-court-cleared entries; fake "BP" farms), physical-visit attestations, later telemetry. The registry stores evidence and adjudication, not list membership. **This is the wedge and he priced it himself: "build this list and make it a pay service, I pay for it every month."** Neutrality constraint: we verify, we never trade.
2. **Procedure (the state machine).** Methodology templates: TradeX, refinery-direct (Exxon), reseller (his three categories). His 80-item checklist as executable steps, each gated on an artifact. Flow grammar: ICPO → commercial invoice → ATV → SGS Q&Q (specs + GPS; "like having the title to the product") → deposit → MT103/LC → title transfer → authorization to sell and collect.
3. **Documents (the paper chain).** Generate LOI/ICPO/commercial-invoice/TSA drafts (he asked for this directly); verify (SGS call-back, authenticity checks); per-deal data room.
4. **Decks (who gets paid what).** His commission split ($1.50/bbl connectors, $1 TradeX contact, $4.50 himself, drafted per deal, handed to a paymaster attorney) is an override interest: a fuel deal's commission deck and an oil well's division order are the same object. One allocation-unit implementation (ADR-025) co-funded with the stage-3 land-admin product; certified per deal, delivered to the paymaster the way a DOTO delivers a deck.
5. **Settlement (last, counsel-gated).** Deposit tracking, then escrow-on-artifacts, then the USDC option (crypto is already offered inside his deals today). The desk is complete and valuable without touching funds: the paymaster keeps custody; we make the paymaster's instructions computable. Escrow-on-SGS is roadmap, not MVP.

**Not, at least at first:** a marketplace matching buyers and sellers (drifts toward broker/exchange territory and dilutes registry neutrality). The desk serves desks: Garrett's first, then the "10-15 people who do business right," each running their own book on our rails.

**Economics, shaped to stay tools-not-broker:** registry subscription (volunteered demand) plus flat per-seat / per-deal-workflow desk fee. Never a success fee (a cut of closed deals resembles broker compensation and poisons neutrality). Value math: his throughput gap is roughly 10x on deals where he pays $160k for a three-day tank reservation and eats $7k wire costs; a flat fee is noise against that. Telemetry and warehouse-receipt layers add revenue later without changing regulatory posture.

**Act two:** both Garrett (buying his own tanks at ITC, ~$500k/month intent, his statement) and TradeX (buying five refineries and five tank farms, his statement) are vertically integrating. The desk's second act is asset operations: the terminal-integrity twin (a tank farm as a revenue asset with mandated inspection obligations), which is og-twin with the nouns swapped. Same customer, adjacent product.

## Gates (entry criteria before anything hardens)

1. Garrett's artifacts arrive: deal-flow straw man, 80-item checklist, acronym list, methodology outlines. His skin in the game; his artifacts are the gate.
2. Independent TradeX verification pass ("publicly traded," "every deal SEC-registered" are his claims; checkable; nothing anchors on them until checked).
3. Compliance counsel scopes layer 5 before any settlement feature is designed. Hard line regardless: any build in this world stops at the workflow/verification/documents layer; never touch, route, or take custody of transaction funds. Sanctions adjacency is explicit in the source material (his own aside that Kazakh/Turkmen fuel is rebadged Russian).
4. Standing rule: ignore any stock-tip adjacency; product conversations never mix with it.
