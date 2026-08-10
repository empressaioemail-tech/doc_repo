---
id: verticals_oil_gas_87_og_lifecycle_framework
title: OG/NG lifecycle framework — 4 stages, 5 connectors, two chains, and the settlement thesis
status: exploration
last_updated: 2026-08-10
applies_to: [hauska, empressa]
owner: nick
related: [85c_og_app_review_meeting_digest, 88_trade_desk_shape, 50_complete_product_plan, 80_adrs/adr_025_og_atom_ontology, 09_post_saas_substrate_thesis, _prospects/red_sands/2026-07-08_garrett_red_sands_digest, _research/2026-08-10_substrate_recon_audit_inputs]
---

# OG/NG lifecycle framework

> **Status: exploration, not canon.** Product of the vision ideation session closed 2026-08-10 (conversation began 2026-07-09). Nothing here is a build commitment. Any commitment drawn from this doc routes through the standing QA gates and names what gets queued or killed per the focus-queue rule.

## The one-sentence vision

True cradle to grave on one record: every verification artifact in the oil and gas lifecycle becomes a cited, callable fact, and every stage handoff becomes a programmable transaction. The record is the product at every step; the chain is only how the record becomes trustless.

## The four stages and the three grain changes

The record's subject changes grain three times, and that is why nobody has built the one record. Stage 1 anchors on land (tract, legal description, mineral estate). Stages 2 and 3 anchor on the well and unit (API14, pooled unit). Stage 4 anchors on the molecule (cargo, lot, tank, batch). Every incumbent system owns one grain and dies at the boundary: Enverus owns courthouse and land, Quorum owns the land system and decks, terminal inventory systems own the molecules. The grain changes are bridged by documents (pooling declaration bridges land to well; run ticket and division order bridge well to molecule). The five connectors below are the machinery for carrying verified identity, claims, and history across grain changes.

| | 1 · Minerals & leasing | 2 · Drilling & title | 3 · Production & pay decks | 4 · Distribution & trade |
|---|---|---|---|---|
| Grain | Land | Well/unit (via pooling) | Well/unit, held for decades | Molecule (via run ticket) |
| Core objects | Tracts, deeds, memorandums, leases, run sheets | W-1 permits, units, wellbores, curative | Decks, division orders, suspense, mutations | Cargoes, tanks, terminals, deals, commission decks |
| Actors | Mineral owners, landmen, brokers, lessees | Operators, title attorneys, RRC, WI partners | DO analysts, royalty/WI owners, purchasers, paymasters | Traders, buyers, mandates, tank farms, inspectors, paymasters, banks |
| Claims | Mineral fractions, NPRI, lease royalty | WI/NRI, farmouts, carried interests | The deck: decimals to the eighth, summing to one | Cargo title, commission decks |
| Boundary artifact (cost) | Run sheet (crew-days) | Drilling title opinion (~$100-150k) | DOTO (~$200-250k, shifts deck liability to firm E&O) | SGS Q&Q report (per cargo; "like having the title to the product") |
| Boundary payment | Bonus, delay rentals | AFEs / JIBs | First disbursement | Deposit, MT103/LC, settlement |
| Gray area = the product | Unrecorded lease terms (memorandum ceiling), heirship | Un-cured defects, unit geometry (3D: Pugh, depth severance) | Suspense, stale decks, escheat clocks | Unverifiable counterparties and terminals (fraud as operating condition) |
| Forward-looking facts emitted | Lease expirations, drilling obligations | Permits predict production (would_affect across the boundary) | Decline curves; plugging obligations (the MRV hook) | Verified ullage/inventory (deal flow signal) |

Boundary artifacts get more expensive downstream because the money at risk grows. The thesis in stage terms: a record accumulated cheaply and continuously from stage 1 replaces ever-larger chunks of what each expensive point-in-time artifact re-derives by archaeology. A DOTO is largely archaeology on stages 1 and 2; if the record never broke, the archaeology collapses.

## The two chains

The **rights chain** is a chain of claims: mineral deed, lease royalty, WI/NRI, deck decimal, cargo title and commission splits. It mutates through legal documents. Its failure mode is drift: reality changes faster than paper (a deck pays a dead man for eight months).

The **molecule chain** is a chain of custody: wellbore, run ticket, gathering, tank, vessel, refinery. It mutates through physical events and measurements. Its failure mode is opacity: fungible, invisible product invites substitution and fraud (rebadged cargoes, ghost inventory, fake terminals).

Different professions maintain the two chains in different systems, and they reference each other at exactly one moment.

## Settlement: the join, the oracle, the enforcement point

Every settlement is an implicit joint assertion about both chains. The formula is: **payment = decimal × measured volume × price**. The decimal comes from the rights chain, the volume and quality from the molecule chain, the price from the market. Three roles:

1. **Join point.** The only event both chains cite. Today the join is performed manually, monthly, forever. The industry's reconciliation-failure queue has a name: suspense (mineral proceeds are among the largest escheat categories in Texas). Stage 4's version is deal mortality: most deals die because the join cannot be established before money moves.
2. **Truth oracle.** A settlement is a costly signal, adversarially audited by the party paid less than expected (royalty owners audit checks; Texas statute puts interest on late or wrong payment). Every uncontested settlement validates every atom cited into it; every dispute decomposes cleanly along the formula (wrong decimal = rights defect, wrong volume/quality = molecule defect, wrong price = market-data defect). This is arrow-two calibration capture running on an industry's money flow: confidence earned against the least ambiguous outcome that exists.
3. **Enforcement point.** The maturity ladder is **observe → compute → execute → condition**. The industry observes settlements (records after the fact). Pay-deck software computes them. Payment rails execute them. The end state conditions them: a settlement that structurally cannot fire until both chains' proofs attach (the SGS artifact and the certified deck as inputs to release, not paperwork about it). At maturity the inversion holds: today the record documents settlement; eventually settlement is a function of the record. Each rung up the ladder increases value capture and responsibility (compute approaches deck-error liability; execute is money movement; condition is custody). The ladder is climbed deliberately with the liability question answered at each rung.

**Portfolio convergence:** the settlement formula's three inputs map to the three spines. Decimal = the RE/OG spine (title, decks, courthouse record). Volume = physical telemetry (the SmartCity sensor DNA pointed at tanks and meters). Price = the trading spine (Empressa Cockpit market facts). Settlement is where the three businesses converge and where information becomes money.

## The five connectors

| Connector | What it is | State (per the 2026-08-10 substrate recon; re-verify at audit) | First paying expression |
|---|---|---|---|
| One graph | All stages' entities on one atom graph (derives-from, cites, adjudicates edges) | Contract link taxonomy + engine atom_links exist; O&G edge vocabulary (lease→unit→well→deck) missing | Every product |
| One actor registry | Verified actors across all stages (owner, operator, tank farm, buyer, paymaster) | ADR-015 accepted 2026-05-16; actor atom type not in the published contract (opaque id strings only); SDK wallets give actors cryptographic identity, unbound | **Tank farm registry** (stage 4) |
| One claims model | Decimals summing to one: royalty decks = division orders = commission decks = fuel-deal splits | ADR-025 revenue-allocation-unit not in the published contract; SDK RevenueRouter is two-way only, ledger-entry not disbursement | **Pay decks** (stage 3, Herbert) and trade desk decks |
| One handoff pattern | Stage closes only when verification artifact attaches AND payment event anchors | SDK purchaseAndMintVDA is the pattern in embryo; procedure-execution atoms not in the contract | **Trade desk** deal state machine (stage 4, Garrett) |
| Cross-stage forward-looking facts | Stage N events are anticipatory facts for stage N+1 | SHIPPED: anticipatory atoms + would_affect edges in contract 1.6.0 | **MRV**: a capped well is an anticipatory fact for a minted credit |

The three named products are not three ventures; they are three connectors each finding a first paying customer, and each hardens the graph the others run on. Plan-of-attack shape (not a build order): each stage's wedge has a named human who brought the domain artifacts (Herbert stage 3 plus grading exemplars for 1-2; Garrett stage 4; the Reeves/Winkler corpus for 1-2). Land one paying wedge per stage with the person who seeded it; the record assembles as a byproduct.

## Four products, one graph

| Stage | Product shape | Wedge | Bigger vision |
|---|---|---|---|
| 1 | Mineral/lease intelligence: run sheets, gray-area maps, expiring-lease radar | Wildcatter + landman ("mineral leasing made easy"; cut most landman cost from a $10M budget; Winkler method is the muscle) | The title graph of Texas |
| 2 | The operational twin: permits, units, wells, curative (og-twin + Reeves corpus) | Small operator watching the patch (permit radar) | DTO archaeology collapses; 3D lease geometry |
| 3 | Land admin off spreadsheets: the maintained deck, mutation workflow, then disbursement | Herbert's spreadsheet operator | Smart-contract disbursement; retention thesis ("keep them as long as they have production") |
| 4 | Registry + trade desk (see [`88_trade_desk_shape.md`](88_trade_desk_shape.md)) | Garrett's monthly registry subscription | Conditioned-settlement marketplace; cargo provenance to the mineral deed |

MRV is not a fifth product; it rides the stage 3→4 boundary and activates on the Rice introduction (via Garrett). Stages 1 and 2 share the twin surface; wedge targeting between them remains the OPEN question from the 2026-07-08 review call.

## Rails, chain, and token posture (grounded in the substrate recon)

The recon corrected an earlier drift: most of the "transaction kernel" exists in the Hauska SDK (CNSSDK composing wallet + payment + VDA + IPFS retrieval + event anchoring; createDataRoom; USDC x402 rail on Base/ETH/Polygon; Circle fiat rail; two-way RevenueRouter). The canon layering is settled: data-level atoms are VDA-backed with cryptographically anchored history (25_atom_architecture_reference), while the contract npm package stays a dependency peer of the SDK (ADR-018). The gap is wiring, not architecture: no spine atom is VDA-wrapped today. Detail and gaps in [`_research/2026-08-10_substrate_recon_audit_inputs.md`](../../_research/2026-08-10_substrate_recon_audit_inputs.md).

The anchoring ladder: (rung 1, live) hash-chained event history per atom, running in prod for adjudications (atom_events with prev_hash/chain_hash); (rung 2, the M2-C seam already written into the schema docstring) Merkle-batch anchor to a public chain (Base), no consortium, no token, makes "independently verifiable" literally true; (rung 3, earned) own app-chain plus token evaluation only when external parties transact regularly on the rails. The private-chain consortium graveyard (VAKT, TradeLens, we.trade, B3i) died from chain-first, committee-governed, no-anchor-user builds; our sequencing (products first, single operator, chain underneath working products) avoids all three failure modes by construction.

Token split: no stablecoin issuance (licensed activity post-GENIUS-Act; USDC is already the shipped answer). Metering/credit unit exists in embryo three ways (SDK metering tiers, MCP demo views, ldt Stripe cents wallet); unify before any tokenization thought. One genuinely interesting utility candidate, parked at rung 3: a verification bond (registry participants stake to be attested, slashed on proven fraud); real utility in a fraud-dense market, securities-adjacent, not now.

**XRP verdict (2026-08-10):** no real utility today. Nothing in the stack references XRP; the wallet/payment layer is EVM-only; USDC on Base already does what XRP is pitched for. The one interesting XRPL feature (native escrow with conditional release) maps to pay-on-SGS but would be built as a contract on Base rather than by adopting a second ledger. Revisit only if a specific counterparty corridor demands Ripple rails; then accept-and-convert at the edge, never build on it.

**Fractionalized fuel for amateurs verdict (2026-08-10):** direct fractional physical fuel for retail is not feasible without becoming a regulated issuer (Howey investment contract and/or commodity pool; CEA retail-commodity delivery rules), and fuel is the worst candidate for the fractional-gold model (flow, not store; degrades; storage cost). Three legitimate expressions: (1) micro futures in the Cockpit, which is fractionalized fuel exposure and already exists as our product surface; (2) accredited-only deal participation (Reg D 506(c)) as a later trade-desk feature, behind the compliance-counsel gate; (3) the sleeper: verified warehouse receipts, institutional trade finance against telemetry-verified tank inventory (the perennial failure of receipt finance is phantom inventory; a telemetry-fed registry produces instrument-verified receipts). Park retail fractional fuel as a non-goal.

## Branches into real estate and trading

**Real estate is stage 1 wearing different clothes.** The mineral estate is real property; the RE courthouse machinery (title chains, encumbrances, briefs) and stage 1 run-sheet machinery share a substrate. Concrete expressions: a minerals layer on the Property Brief (severed, leased, to whom, expiring when); the commercial band's industrial/flex segment covers tank farms and terminals, which are parcels with CAD records and TCEQ permits, so the registry's physical-verification layer is substantially commercial-RE due diligence we already do.

**Trading branches in three ways.** (1) The TXE lane: the TX100 spec (Empressa Trading repo, `TX100_INDEX_SPEC.md`) found generic Texas beta taken twice and the sector cuts open; TXE with an **auditable operational nexus** (membership requires verified Texas operations per RRC filed record: operator number, permits, production) solves the exact fuzziness the spec rejected in economic-nexus tests, catches out-of-state-HQ Permian pure-plays, and is point-in-time reconstructable from filing dates. Three grades: the benchmark (TX100 backbone + operational-nexus screen), an operational-factor research variant (never the flagship), and the signals layer (permit velocity, basin activity) sold as desk content regardless of licensing. Costs the O&G build nothing extra; needs the RRC-operator-to-ticker resolution (handle→thing→claims). Governance wrinkle to handle: index owner is also the operational-data provider (IOSCO conflicts policy must address it). LSP can inherit the trick later via ERCOT interconnection queues. (2) The spine is alt-data for the Cockpit (permit velocity as a leading indicator, cited). (3) Stage 4 physical traders are Cockpit hedging customers; the physical desk and paper desk are two halves of one customer.

**Telemetry as lead gen (operator insight, 2026-08-10):** tank telemetry feeding the trade desk solves the registry's cold start (farms join because verified ullage brings them deal flow, not because it audits them) and the molecule chain's opacity at once. One sensor, three revenue surfaces: anti-fraud registry, desk supply feed, settlement oracle.
