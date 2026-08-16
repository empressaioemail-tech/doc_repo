---
id: atx_bulls_15_financial_umbrella
title: The financial umbrella — piping the whole program, wallets for every participant, the supply chain
status: draft
last_updated: 2026-08-14
applies_to: portfolio
owner: nick
related: [atx_bulls_14_cashflow_map, atx_bulls_09_af1_purchase_agreement_analysis, _rd_digital_economies/03_architecture, atx_bulls_16_cashflow_adversarial_review]
purpose: Captures Nick's 2026-08-14 reframe - the real product is financial infrastructure for an ad hoc minor-league operation, not new revenue streams. Maps the full piping (money in AND out), wallets for every participant class, the supply-chain layer including league group purchasing, and why this is the strongest AF1 value proposition. Doc 14 remains the member-economy inflow map; this doc is the umbrella it sits under.
---

# The financial umbrella

## The reframe

AF1 succeeds today on vision and inspiration. Underneath, the network of what it takes to make a team go - the finance and the coordination - is wild and ad hoc: spreadsheets, personal cards, manual invoices, handshake vendor terms, money arriving and leaving with no shared ledger. The league's own Purchase Agreement reads as an anxiety document about exactly this: good-standing regimes, letters of credit, capital calls, centralized player payroll, revenue share withheld until a team proves it can finish a season. The league already knows its teams die of financial chaos; its instruments for preventing that are blunt (LOCs and forfeiture).

**The product, restated: we give the program an umbrella and install all the piping for monetization and money movement, end to end.** Doc 14's member-economy map is one wing of it. The umbrella is: every dollar that touches the program - in from fans, sponsors, and data buyers; out to players, vendors, the league, and the tax man - moving through one rail set with ledgers, splits, reserves, and visibility. When the token comes later, it pressurizes pipes that already hold: more cash from the same customers, through plumbing that already works.

## Wallets for every participant (the earlier thread, landed)

The wallets-for-people question from the custody-gradient work lands here concretely: a wallet is just the account every economic participant in the program already needs, with custody honestly typed. Five participant classes:

| Participant | Their wallet is | Custody posture | What flows through it |
|---|---|---|---|
| Fan | the member account | hosted; card-in; no crypto surface | purchases, deposit credits, owned items |
| Player | accrual ledger + payout account + consent key | earnings hosted-then-paid-out; consent key self-custodied always | pool and individual shares, external-pull royalties, monthly settlement |
| Team | the operating view | the team's own accounts, made legible | collections in, splits visible, payables out (vendors, league, tax), reserve obligations (LOC) tracked |
| Vendor | payee account | conventional | invoices, reliable settlement, terms |
| League | assessment and distribution rails | the league's own accounts, made legible | assessments in from every team, revenue-share distributions out (contractually due within 30 days of the championship - a hard deadline currently met by hand), LOC status, capital calls |

The practical v1 topology, which also answers the money-transmission hazard: a Stripe-Connect-class marketplace structure - platform account plus connected accounts for team, players, and vendors - so the regulated processor holds balances and executes splits, and we never custody funds in the banking sense. 1099s and tax handled on the same rails. Circle-backed rails join later where they earn their place. This is the custody gradient applied to money: hosted by a regulated processor, honestly labeled, graduating only when there is a reason.

## The supply chain (two chains, one rail)

**Chain 1 - the fan economy's physical chain.** The one-cart promise has a physical backend: merch drops need make-or-buy decisions (print-on-demand = zero inventory risk, lower margin; stocked = higher margin, real working capital), fulfillment, returns that claw back across splits, and player-linked SKUs whose licensing splits execute at the SKU level. This chain is part of the piping, not an afterthought; doc 16's review is tasked on its failure modes.

**Chain 2 - the team's operational chain.** What it takes to make a team go: equipment (helmets, pads, turf), travel (flights, buses, hotels for road games), medical and training supplies, facility services, film and analytics tools, game-day operations. Today: every team at this tier procures alone, ad hoc, at retail, on personal relationships and personal cards. On the rail: vendors become payees, purchase orders become ledger entries, and the team's cost side becomes as legible as its revenue side.

**The league-scale unlock - group purchasing.** Twelve teams buying the same helmets, the same travel, the same insurance, separately, is money burned. The league already centralizes payroll and workers compensation (per the Purchase Agreement) - proof the league wants centralized operations where it can get them. The umbrella extends that instinct to procurement: an AF1 group-purchasing layer on the same rails - league-negotiated vendor terms, teams ordering through the platform, rebates flowing to the league layer, vendors getting reliable consolidated payment. This is a classic GPO play that no minor league has the infrastructure to run, and we would already be operating the rails it needs.

## Why this is the strongest AF1 pitch we have

The token pitch asks the league to believe in a new category. The piping pitch solves the problem the league demonstrably already has: **teams in good standing.** On the umbrella, good standing stops being an audit and becomes a dashboard - the league sees assessments paid, reserves held, payables current, per team, in real time; distributions go out on time by rail rather than by hand; and a struggling team is visible before it fails rather than after. The fan economy (doc 14) funds the teams; the piping makes the whole program financially legible; the token, when it comes, is issued on top of an economy whose flows are already proven and metered. That ordering also answers the adversarial review's hardest finding from the R&D pass: the capital lane stops being self-referential when it points at piped, metered, real cash flows.

## The system, named by its actors (Nick, 2026-08-14)

Working name: the **team revenue generation and capture system** - our atom/node setup with several node actors, each getting a floor of value even before any token exists:

| Actor | Minimum value delivered |
|---|---|
| Fans | a better experience: account, status, verified content, one cart |
| Players | recognition and credit for their stats - verified, attributed, and mechanically earnable from the fan base |
| Teams | capture of cash flow that today escapes entirely, plus easier league reporting |
| League | transparency it can bolt more revenue engines onto later |
| Advertisers/sponsors | a consented, segmented, verified audience they cannot buy anywhere else at this tier |

**Dormant-stub engineering posture (ruled by Nick):** mechanisms are built even where activation is gated. The athlete-earning rails ship complete - accrual ledgers, splits, payout plumbing - with payout activation as a config gate pending the league conversation. Whether the league runs payroll is another conversation; at minimum the mechanism is there. Engineering for league-scale futures via dormant stubs is explicitly acceptable. Note the activation nuance from doc 16 F1: external-buyer payments (a scout paying for a profile pull) flow third-party-to-athlete, platform-facilitated - arguably not a team side payment at all - so the external lane may activate ahead of team-side streams while the league question resolves.

**The immediate goal:** fix Cody's pain - strong fan traction with no capture or monetization mechanism - and hand him the player-twin recruiting value prop, with the league-scale picture engineered into the stubs. **Cody's investors** are an audience for this work: a clean, documented path to monetization (docs 14/15/17 plus the one-pager) is exactly what a team investor wants to see; an investor-facing cut of the cash-flow model is a named pickup.

**Parked (not for now, recorded so it is not lost):** the verified-stats substrate underneath this system is literally the data layer fantasy and sports-betting products run on - fantasy formats where players get a cut, or licensing verified performance data to operators. Parked deliberately: gambling law is its own heavy regulated surface (the Sorare criminal trial is on the register as the warning), and the cleaner first move if ever pursued is licensing verified data to licensed operators rather than operating anything. Requires its own session and counsel before a single step.

## Sequencing (order only)

1. Bulls member economy on marketplace-topology rails (doc 14, revised per doc 16's findings) - money in, splits, player ledgers.
2. Bulls money-out: vendor payees, league-assessment visibility, reserve tracking - the team financial OS, proven on one team.
3. The AF1 umbrella conversation: league rails (assessments, distributions, good-standing dashboard) + group purchasing - pitched on the piping, with the token as the later chapter.
4. Token design (tokenomics team) against piped, metered flows.

## Open

1. Doc 16 (adversarial review of doc 14 as plumbing) - in flight; its findings revise doc 14 and this doc.
2. Ticketing: the largest single team stream is currently outside the piping (venue/vendor unknown until the venue answer); the umbrella is incomplete until it is at least ledger-visible.
3. Stripe Connect vs alternatives as the v1 marketplace topology (engineering-track evaluation).
4. How much of the team-OS layer the Bulls actually adopt this season vs next (Cody's operational appetite).
5. Whether group purchasing is pitched to AF1 with the umbrella or held as the second conversation.
