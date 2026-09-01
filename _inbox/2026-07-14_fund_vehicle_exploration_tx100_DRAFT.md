---
id: 2026-07-14_fund_vehicle_exploration_tx100
title: Fund vehicle exploration - TX100 capture, BOT anatomy, PIPE playbook, structure fork, concepts
status: draft-exploration
last_updated: 2026-07-14
applies_to: portfolio
owner: nick
related: [09_post_saas_substrate_thesis, _verticals/oil_gas/70_market_thesis, 53a_noncustodial_settlement_rail, _sessions/2026-06-29_trading_app_temporal_context_substrate_claude_code]
---

# Fund vehicle exploration (2026-07-14)

Exploration only. Nothing here is a commitment. Purpose: durably capture the TX100 idea (operator: "should be stored somewhere"), the RoboStrategy (BOT) case study, the PIPE / treasury-company playbook, the structural fork that governs vehicle choice, and the first round of concepts for a fund Nick may eventually launch. Operator framing: "combination of various tech surfaces, maybe energy producing assets such as oil wells... we have a good edge on the emerging tech trends that would shape the next 20-30 years... making data AI native and positioning to be part of the robotics trend." Not married to anything.

## TX100 capture

TX100 had zero prior hits in this repo; the idea lived only in conversation. Working interpretation (UNCONFIRMED with operator): a basket of roughly one hundred Texas energy-producing assets (producing wells, mineral and royalty interests) assembled into one investable vehicle. Confirm or correct this reading before it propagates.

Related gap: the fuel-trading conversations from the week of 2026-07-06 are not filed anywhere in the repo (no session record, no inbox note). If they ran in claude.ai/Fable sessions, drop transcripts or a recap into _inbox so they can be folded in.

## Case study: RoboStrategy, Inc. (Nasdaq: BOT)

Non-diversified closed-end fund (1940 Act), Maryland corp organized 2025-05-23, operations from 2025-09-05, direct-listed Nasdaq 2026-05-11. Adviser FP Strategies LLC (Puerto Rico; Andrew Kang and Marc Weinstein of Mechanism Capital, a crypto-native fund), 2.5 percent fee on gross assets. Seeded by the managers contributing their own Apptronik and Figure AI positions in-kind for 7,449,998 shares at $10.00.

Portfolio (SEC 424B3 supplement, as of 2026-06-30, $248.9M net assets, NAV $10.51): Standard Bots 35.0 percent (direct Series C, the fund supplied ~$87M of a $200M round it co-led), Figure AI 15.0 (double-layer SPV at Series B pricing vs a $39B Sept 2025 mark), Dyna 15.0 (direct Series A, round led by the fund at >$600M post), Apptronik 14.9 (Capital Factory SPV + direct seed, vs a ~$5B Feb 2026 mark), Dexmate 10.2, Path Robotics 2.4, then a tail of seed/SAFE positions (Eccentric Machines, REK robot combat league, GMI GPU cloud, Coco Robotics, Nox Metals, Endiatx PillBot, Allonic, Purple Rhombus defense UAS). Top four issuers ~80 percent. All Level 3, carried at cost, zero unrealized appreciation booked: NAV states what was paid, not what anything is worth.

The engine is capital-markets arbitrage, not stock-picking: the trophy names (Figure, Apptronik) are the hook; the premium is the product. Stock ~$36.73 vs $10.51 NAV (~3.5x), serial private placements at ~$25/share, a $2B Roth committed equity facility, proceeds recycled into fund-led venture rounds that refresh the story. This is the crypto treasury-company flywheel transplanted onto robotics by crypto-native managers, inside a registered fund because startup equity forces that wrapper (see fork below).

Formation timeline: entity May 2025, N-2 Nov 2025, N-2/A Mar 2026, listed May 2026. Roughly 12 months, no underwriter, Roth as advisor.

## PIPE, unpacked

A PIPE (Private Investment in Public Equity) is a private placement of an already-public company's stock to accredited investors (Section 4(a)(2)/Reg D), priced at a discount, with a contractual resale registration (S-1/S-3). It is a financing tool, not a vehicle.

"Start a PIPE" in 2025-26 vernacular means the treasury-company playbook: take control of a small listed company, raise a large PIPE at roughly asset value, relaunch the company as a public wrapper for a target asset, and issue stock into the premium (MicroStrategy pattern). Verified 2025 examples: Twenty One Capital ($685M, SPAC+PIPE, BTC), Trump Media ($2.5B PIPE, BTC), SharpLink ($425M PIPE, ETH, Consensys anchor), BitMine ($250M PIPE, ETH, Tom Lee), Upexi ($100M, SOL). Sponsor economics: buy at ~1x NAV pre-announcement, board control to the anchor, agent fees ~2.5-8 percent plus warrants.

Sector reality check: the premium era largely collapsed late 2025 into 2026. BitMine and SharpLink traded below 1x NAV, ETHZilla sold ETH to buy back stock, Sequans sold its BTC stack to retire debt, Strive absorbed Semler, and Nasdaq began requiring shareholder votes on many issuances used to buy crypto. Below 1x the flywheel runs in reverse. A premium requires a named anchor and a scarce story.

## The structural fork (this governs everything)

Whether the target asset is a "security" under the 1940 Act decides the wrapper:

| Asset | Security? | Consequence |
|---|---|---|
| Private startup equity (minority stakes) | Yes, 100 percent investment securities | PIPE/listco route legally dead over the 40 percent test (Section 3(a)(1)(C)) and holding-out prong; inadvertent investment company; Section 7 bars business, 47(b) voids contracts. Requires a registered CEF (BOT/DXYZ model) or BDC. |
| Oil and gas royalties / mineral leases | '33 Act securities, but 1940 Act Section 3(c)(9) expressly exempts a company substantially all of whose business is owning oil, gas, or mineral royalties or leases | PIPE/listco route works cleanly. Operating-company treatment: no fund board, no leverage limits, unbounded premium, ATM flywheel. |
| Producing wells / operated working interests | Generally real-property/operating interests when you operate (practitioner framing, verify with counsel) | Plain operating oil company. Works. |
| Crypto | No (current posture) | Works; the DAT wave proved it and then crowded it. |

Legacy royalty trusts (Permian Basin Royalty Trust, Sabine) are passive grantor trusts: distribution-only, cannot acquire. A modern accumulating royalty company is structurally differentiated from them. Comps for the accumulating form: Kimbell Royalty Partners, Viper Energy, Sitio, Texas Pacific Land, LandBridge (verify current state of each before external use).

Mixed vehicle implication: "tech surfaces plus oil wells" in one operating company only works if startup equity stays safely under 40 percent of total assets and the company neither markets itself as a startup portfolio nor flunks the Tonopah primarily-engaged factors. Energy assets must dominate the balance sheet and the narrative. Alternatively a registered CEF can hold both, at the cost of the full 1940 Act stack.

## TXSE ground truth (2026-07-14)

SEC-approved 2025-09-30; trading went live 2026-07-06 (phased, five real symbols from 07-10); no listings exist yet. First ETP listings targeted Sept 2026 (Westwood PWRX is the first committed listing, an energy-infrastructure ETF). Closed-end fund listing rules are pending at the SEC (SR-TXSE-2026-005, decision due 2026-08-06). Corporate standards are deliberately NYSE-tier: $200M market cap or $10-12M three-year earnings, $4.00 bid, $40M public float, mandatory confidential pre-application review. A small new issuer cannot list there directly; the realistic doors are the ETP door (Sept 2026) or the CEF door (post 08-06 if approved). Kelcy Warren (Energy Transfer) is majority owner; backers include BlackRock, Citadel Securities, Schwab, JPM, Goldman, BofA. Do not conflate TXSE with NYSE Texas (separate Dallas venue). An energy-plus-frontier-tech Texas vehicle fits TXSE's identity unusually well.

## Concepts (first pass, none committed)

Shared spine across all of them: the vehicle is a downstream CUSTOMER of Hauska Inc. (arms-length license), never Hauska itself. Entity separation preserved; the fund dogfoods the substrate, proves "sell reasoning," and its realized outcomes feed arrow-two calibration as ground truth. The edge claim: jurisdictional intelligence at parcel grain (permits, title, obligations, water, siting, RRC data) plus the Temporal-Context Engine (anticipatory events with calibrated effect-linkage) equals underwriting signal others do not have, aimed at exactly the market segment the O&G thesis shows is tiered out (sub-$30M A&D, no mineral MLS, valuation opacity).

**A. TX100 royalty accumulation company (the cleanest expression).** Publicly traded Texas mineral/royalty accumulator under 3(c)(9). Buys the long-tail packages the consolidators ignore, underwritten by the spine; every acquisition carries a cited reasoning chain and a calibrated confidence figure (quality-gate rule applied to a balance sheet). Premium narrative: "the AI-native TPL." PIPE-into-listco is the eventual go-public leg; ATM flywheel after.

**B. Physical-substrate-of-AI company (TPL/LandBridge-shaped).** Own the ground truth the AI/robotics buildout needs in Texas: royalties, surface land near power and water, interconnect-adjacent acreage, data-center-sitable parcels, water rights. Siting intelligence (already a surfaced opportunity in the convergence program) is the sourcing engine. Same operating-company treatment; bigger story than royalties alone. "Own the energy and land that power the machines."

**C. A + a sub-40 percent frontier-tech sleeve.** The operating company above, plus minority stakes in robotics/energy-tech companies held under the 40 percent line. One ticker holding "the world the machines run on, and a slice of the machines." Marketing must lead with energy operations; the tech sleeve is strategic, not the identity. Needs counsel sign-off on Tonopah factors.

**D. Registered CEF, BOT-style, on TXSE.** If the desired book is majority tech equity, the wrapper is a direct-listed CEF; TXSE's CEF door (post 08-06) or ETP door makes "first fund listed on TXSE" itself a narrative asset. Competes with BOT/DXYZ; weakest differentiation today because deal access is unproven.

**E. Separate lane, different regime: systematic energy/fuel trading.** The Temporal-Context Engine plus the empressa-trading cockpit points at a trading strategy (anticipatory jurisdiction/infrastructure events mapped to energy price effects). That is a private fund / CTA lane (CFTC/NFA, not 1940 Act), not the public vehicle. Keep it distinct; it can be the calibration proving ground. Depends on recovering the missing fuel-trading conversations.

Preliminary recommendation (planner opinion, reversible): C as the destination, A as the entry expression, E as a parallel private lane. Sequencing in execution order, no timeframes per operator preference: (1) confirm TX100 meaning and the fuel-trading context; (2) legal read on 3(c)(9) plus the mixed-book 40 percent line (routes to Nick, legal is out of planner scope); (3) underwriting engine continues to get built anyway as the O&G vertical product (no new cycles consumed; focus-queue rule respected); (4) prove the edge privately: small Reg D royalty acquisitions or SPV syndications, settlement per 53a verify-only rail, outcomes logged as calibration ground truth; (5) only then choose the public leg (PIPE-into-listco vs CEF vs TXSE ETP) with an anchor investor identified; the DAT era shows no-name sponsors get no premium.

## Open questions

1. What does TX100 actually denote to Nick (100 wells? 100 royalty positions? an index?).
2. Where are the fuel-trading conversations; what strategy shape did they converge on.
3. Counsel: 3(c)(9) fit for an accumulating royalty company holding a minority tech sleeve; Tonopah exposure; TX securities (blue sky) posture.
4. Who is the credible anchor (the BOT lesson: Kang/Weinstein had Mechanism and the in-kind seed; who is ours).
5. Does the fund-as-customer relationship to Hauska create ADR-level questions (tenant sovereignty, calibration pooling from the fund's own outcomes)?

Not dispositioned. No workstream opened; no sprint cycles allocated. This document is the parking slot.
