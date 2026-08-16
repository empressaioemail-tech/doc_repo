---
id: atx_bulls_16_cashflow_adversarial_review
title: Adversarial review — doc 14 cash-flow map attacked as plumbing
status: active
last_updated: 2026-08-14
applies_to: portfolio
owner: nick
purpose: Adversarial review of the doc 14 cash-flow architecture as real-world money plumbing - completeness, legality, timing, and game theory - before any term conversation with Cody or any promise to a player.
related: [atx_bulls_14_cashflow_map, atx_bulls_10_fan_platform_vision, atx_bulls_11_portal_spec, atx_bulls_09_af1_purchase_agreement_analysis]
---

# Adversarial review: does the money actually move?

## Verdict

Doc 14 is a well-designed revenue split engine wearing the title of a cash-flow map, and the difference is the whole problem. It maps money in and how money in divides; it does not map money out, money held, money owed, or money timed. For an operation whose finance is "wild and incredibly ad hoc," the ad hoc-ness lives at least as much on the payables side (league assessments from November 2026, a $200,000 letter of credit, the second $100,000 franchise payment, capital-call exposure, insurance, travel, equipment) as on the receivables side, and the map's entire treatment of that half of the business is one box labeled "team operations." Worse, the map's most celebrated feature, the player-earning loop, rests on an unverified assumption: that the league, which runs central player payroll precisely so teams do not pay players, permits team-side supplemental payments to athletes at all. The splits engine itself is sound as a design pattern (splits as code at settlement is the right instinct, and the visible player ledger is a genuinely good trust move), but as drawn the funds-flow topology is undefined in exactly the place regulators care about, the deposit "escrow-style accounting" is an accounting entry pretending to be an account, loss allocation is unassigned everywhere losses actually occur, and the largest single revenue stream of a sports team, tickets, is outside the system entirely. The verdict: the piping is not closed. It is half a diagram, the half that was fun to draw. What exists of it is fixable and worth fixing, and most fixes are cheap because nothing is built yet.

## Findings, ranked by severity

### F1 (CRITICAL): The player-earning loop assumes a league permission nobody has verified

**The attack.** The Purchase Agreement (doc 09, section 3.1(b)) establishes that AF1 runs centralized player and coach payroll funded by member assessments. Leagues centralize payroll for two reasons: cost control and competitive balance. Every league that centralizes or caps player compensation also polices side payments, because a team paying "its" players extra through any channel is the canonical cap-circumvention move. Doc 14 builds the team-side player payment rail (follows, pool shares, collectible cuts, appearance fees, external-pull royalties) and gates it only on "accountant + counsel" for tax mechanics. That is the wrong gate, or at least not the first gate. The first gate is: do the unseen Company Agreement, Membership Agreement, and Operating Agreement permit a member team to route compensation to league-paid athletes at all, and if so under what characterization (NIL-style licensing income is the defensible frame; "the team pays players for content" is the indefensible one). If the answer is no, the headline differentiator of the entire platform (doc 10's recruiting pitch: "come here and your performance becomes verified, visible, and monetizable") dies, and it dies after promises were made in a locker room.

A second blade on the same axe: doc 10 names "other teams' analysts" as buyers of metered external profile access. That is the team selling scouting intelligence on its own roster to league competitors, through a rail the team operates and profits from. Even if technically unprohibited, it is exactly the kind of thing a league board notices, and 3.1(h) plus the unseen agreements may give the league claims over player data commercialization outright (doc 10 open question 4 already flags this; doc 14 built the rail anyway).

**The evidence.** Doc 09: assessments include "salary and benefits of coaches and players"; workers compensation in assessments implies an employment-shaped relationship on the league side; the four underlying agreements are unread. Doc 14: player payout mechanics listed as an open item, but framed purely as a tax/mechanics question. Doc 10: the recruiting pitch is already written.

**The fix.** Reframe every team-side player payment as licensing income for name/image/likeness/data rights under an athlete platform agreement the athlete signs directly with the platform entity (not the team), so the payer is arguably not the member team. Then put the question to counsel WITH the four league agreements in hand, and get league posture in writing before any player-facing promise. The ledger can run in display-only accrual mode indefinitely; payouts wait for the green light. Note the map already half-knows this ("before any promise is made in the locker room"); the review's point is that the gating question is league permission, not payout mechanics.

### F2 (CRITICAL): Money out does not exist, and the obligations calendar would eat the map's revenue alive

**The attack.** List what the team must pay and when, from doc 09 alone: $100,000 franchise payment (due August 1, 2026, presumably paid); $200,000 letter of credit or cash deposit by November 1, 2026; league assessments beginning November 1, 2026 (league office, officials, central payroll share, workers comp, playoffs); capital calls on a three-quarter board vote at any time; the second $100,000 drawn from the LOC after the 2027 season. None of this appears in the map. Nor does any operating cost: travel, equipment, insurance, venue, staff, marketing, the platform's own COGS beyond a pass-through box. Against that: doc 10's honest magnitude statement puts the founding window at "tens of thousands" on a 2,000-contact list, and league revenue share cannot arrive before the 2028 season completes. The system being designed processes the smallest money in the program while the money that can kill the franchise (default under 3.3 means termination and forfeiture of all sums paid) moves entirely outside it, unscheduled, unmodeled, and invisible. A cash-flow model that cannot answer "can we cover the November assessment" is not fixing the cash flow model.

**The evidence.** Doc 14's diagram: four downstream boxes, of which "team operations" is a terminal arrow with no contents. No obligations calendar, no reserve policy, no cash forecast anywhere in docs 10, 11, or 14.

**The fix.** Add the outflow half: a team obligations calendar (every dated league and operating obligation, amounts, sources of funds) and a rolling 13-week cash forecast as first-class objects in the same system that runs the split engine. The staff dashboard (doc 11) should show cash position and next obligations, not just revenue by stream. This is mostly a spreadsheet-grade artifact plus two portal screens; it is cheap, and it is the part Cody's ad hoc finance actually bleeds from.

### F3 (HIGH): The funds-flow topology is undefined at the exact point where regulation attaches

**The attack.** Who holds the money between the fan's card and the four downstream boxes? If the platform entity receives gross funds into its own account and then disburses to the team, players, and vendors, it is transmitting money on behalf of others: state money-transmitter licensing (Texas Money Services Act) and FinCEN registration territory, and holding fan deposits as spendable-later credit is stored-value issuance on top. The map writes "KYC" into the checkout box, which is backwards twice: card-paying fans are the processor's KYC problem, while the parties who actually need onboarding, verification, and W-9s (players receiving payouts, the team account) appear nowhere. The presence of "Circle-backed rails available where they earn their place" multiplies the regulatory surface for zero v1 benefit.

**The evidence.** Doc 14 rails note 1 and the diagram. No statement anywhere of which legal entity holds funds at rest.

**The fix.** The obvious mitigation works and should be adopted by name: Stripe Connect marketplace topology. Platform is the Connect platform; the team is a connected account; each paid athlete is an Express connected account. Charges settle with destination/split transfers so the regulated processor holds all balances and the platform never takes possession of funds; Stripe carries payee KYC and (configured correctly) 1099 generation. This converts F3 from a licensing problem into an integration task. Cut Circle from v1 entirely; revisit only if a concrete stream demands it. One caveat to carry to counsel: fan deposit credits held long-term may sit awkwardly even on a connected account (see F4).

### F4 (HIGH): Deposit "escrow-style accounting" is an entry, not an account, and the refund-as-credit policy will not survive contact

**The attack.** Seat deposits are "100% held as credit... escrow-style accounting." Accounting entries do not segregate cash. If deposit dollars land in the team's operating balance, the November assessment will spend them, and the team enters the season owing seats it has already consumed the money for; this is the classic seasonal-business death, spending float in the trough. Separately, the refund-as-credit-only policy (doc 11) is not chargeback-proof: a cardholder disputes, the card network claws the cash regardless of the written policy, and the "credit" evaporates while the ledger says it exists. Long-lived dormant credits also raise Texas unclaimed-property (escheat) obligations nobody has looked at, and if the venue never materializes on schedule, a mass of unapplied deposits becomes a mass refund event precisely at the moment of worst cash.

**The evidence.** Doc 14 split table row 3 and rails note 1; doc 11 commerce mechanics 4; doc 10's venue-unknown status.

**The fix.** Deposits go to a genuinely segregated balance (separate bank account or a held balance on the processor, not commingled with operations), with a written policy covering refund triggers (including venue non-delivery by a named date), dormancy, and escheat, reviewed by counsel. Treat deposit float as untouchable in the cash forecast from F2.

### F5 (HIGH): Losses are allocated to nobody, which means they are allocated to the platform

**The attack.** Walk the failure paths. A stolen card buys a founding pass and premium follows; the split executes at settlement; the player accrual is visible in the portal same day; the monthly payout runs; the chargeback arrives on day 45. The clawback "pro-rata across the same split" now needs money back from a paid-out athlete ("never invoiced back," per rails note 3), so the shortfall lands... where? Under Stripe Connect, disputes on platform-mediated charges debit the platform by default. Same shape: sponsor defaults after testing-day content ships and pool accruals are visible; a player is cut mid-season carrying a positive accrued balance (pay it? hold it? below-threshold forfeiture?) or a negative one (written off by whom?); a scout disputes a metered pull the athlete already watched accrue. Every one of these ends with a real dollar loss and no named owner, and the design's proudest feature, same-day ledger visibility, becomes a trust liability the first time a visible number is clawed back.

**The evidence.** Doc 14 rails note 3; doc 11 PlayerAccrual entity has states (accrued, paid) with no pending/cleared distinction and no dispute state.

**The fix.** Three mechanisms, all standard: (1) ledger states, accrued-pending, then cleared after a holdback window (say 30 to 45 days, matching the dispute window), then paid; clawbacks hit pending, almost never cleared, and the portal displays the states honestly, which preserves the trust move; (2) a small rolling reserve on player payouts; (3) an explicit loss-allocation table in the Empressa-Cody commercial agreement (fraud losses, sponsor defaults, cut-player balances, each with an owner). Stripe Radar on from day one.

### F6 (HIGH): The split table invites the fights it will lose

**The attack, in pieces.**

*Where Cody pushes back first: the uniform platform fee on team-native streams.* The platform charging 15% on the Founding Pass and tryout registration is charging 15% on streams Cody could run on Shopify for roughly 3% plus $39 a month. The founding drop is the team's launch capital; taking 15 points of it reads as rent, not service. By contrast, 15% on metered external access, a stream that cannot exist without the platform, is easily defended. The stacked-tools benchmark the platform should expect to be argued against: Stripe (~2.9% + 30c) plus Shopify plus a Patreon-class fan tool (8-12%) lands an all-in blended cost in the low teens for the streams they cover, and zero platform fee on streams a spreadsheet covers. A uniform 15-20% will be litigated row by row; better to walk in with fees differentiated by value created (low single digits on team-native commerce, mid on shared streams, high teens on platform-created streams) than to be negotiated there.

*The follow split gives away the team's headline stream.* Premium follows at 30/50/20 hands 70% of "the athlete's headline stream" away from the entity that owns the fan relationship, paid the customer-acquisition cost, and carries the brand. Defensible on recruiting-pitch grounds, but expect Cody to open at 50/30/20 and to be right that the team's share should reflect who built the audience.

*Pool pro-rata by participation drains toward the individual channel and hands stars holdout leverage.* The star's rational move is to class everything possible as individual (where he keeps 30-80%) and starve the pool (where he gets 1/25th); his agent will demand exactly that. Meanwhile the consent-denominator design means one marquee player declining a data class guts the sellable value of testing-day sponsorship for everyone, which is holdout leverage the design hands out for free. And the moment players discover they are negotiating splits as a group, the team has convened collective bargaining over compensation with no structure for it, adjacent to a league that centralizes payroll precisely to avoid that. This does not make pool shares wrong; it makes "pool shares pro-rata by participation" a governance design, not a percentage, and the doc treats it as a percentage.

*Small tell:* the appearance marketplace pays the platform 15% and the team 5%; the platform earning three times the team on a player's in-person appearance will not survive Cody reading the table.

**The fix.** Differentiate platform fees by stream class before the conversation, not during it. Reprice follows with the team majority or plan the concession. For pools: fixed pool percentages per content class with a published allocation rule, a minimum-participation clause in the athlete platform agreement (consent to core testing content classes travels with program participation, with genuine opt-outs on sensitive classes), and one-on-one athlete agreements executed individually to keep this on the NIL-licensing side of the line.

### F7 (MEDIUM): "End to end" excludes tickets, concessions, off-platform sponsorship, and league money, which is to say most of a sports team

**The attack.** The map's own words: "One rail, every stream." The streams outside the rail: tickets (the largest single stream a team has; doc 11 concedes link-out v1 with vendor unknown), concessions and gameday, local sponsorship sold the traditional way (arena signage and the deals Cody already closes off-platform, likely his current largest actual revenue), league distributions from 2028, and tryout event logistics beyond registration. If this map is presented as fixing the cash flow model of the operation, it is overpromising: it is the member-economy lane, roughly the fourth-largest lane, built beautifully while the freight lanes run ad hoc beside it.

**The evidence.** Doc 14 title and "The picture"; doc 11 integrations 3; doc 09 section on revenue share timing.

**The fix.** Two moves. First, honesty in scope: retitle the map as the member-economy rail and stop claiming end-to-end until it is. Second, and more valuable: add a ledger-of-record layer, a place where off-platform flows (ticket settlement reports, sponsor invoices and receipts, league assessment notices) are recorded even though they are not processed, so the dashboard from F2 sees the whole business. The OS claim requires visibility over everything; it only requires rails under some things. This is the single highest-leverage addition for the "fix the wild ad hoc finance" mission, and it is mostly data entry screens.

### F8 (MEDIUM): The league can silently claim pieces of at least four split rows

**The attack.** Row by row against doc 09: player-linked merch and collectibles almost certainly carry team marks, and the league holds a royalty-free, sublicensable, worldwide license to team IP (3.1(h)); the unseen Operating Agreement may contain league-wide merch arrangements that constrain or tax the merch takeover (doc 14 already flags this but proceeds); the Membership Agreement's "Rights Fee" (3.1(d), unseen) is a levy of unknown base that could reach digital revenue; the revenue-share pool definition ("total non-equity revenue minus league budget") and the assessment mechanics mean the league's accounting categories touch member economics in ways nobody outside the unseen documents can bound. Add 7.14: marketing the platform cannot say anything about the league agreement without consent, which constrains exactly the "first fully-twinned franchise" story. And F1's data-rights question rides on the same unseen paper.

**The fix.** The four underlying agreements are already doc 06/09's named gating item; this review adds the specific read-for list: merch arrangements and vendor mandates, Rights Fee base, indebtedness and revenue-pledge covenants, player data and NIL posture, side-payment rules, and any league claim to digital or platform revenue. No split row that the league can reach should be represented to Cody as settled before that read.

### F9 (MEDIUM): Tax mechanics are named but not designed

**The attack.** "1099 path" and "Stripe Tax from dollar one" are labels, not plumbing. Undecided: who is payer of record to athletes (team, platform entity, or Stripe Express, each with different 1099-NEC/1099-K outcomes and different F1 implications); W-9 collection and TIN matching at athlete onboarding (absent from doc 11's player class, which has consents and earnings but no tax onboarding); backup withholding when a W-9 is missing; whether specific streams are even taxable sales in Texas and under what category (digital goods are taxable; data-processing services, which metered profile access plausibly is, are 80% taxable with a 20% exemption; amusement services have their own rules; Stripe Tax executes categories, it does not choose them); sales tax on the sponsor-side streams; franchise-tax and entity questions for whichever entity runs the rail. None of this blocks building; all of it blocks the first real payout and the first audit.

**The fix.** One session with the accountant producing: payer-of-record decision, athlete tax onboarding added to the player class (W-9 in the consent flow), a per-stream Texas tax categorization table feeding Stripe Tax config, and a filing calendar entry in the F2 obligations calendar.

### F10 (LOW): Assorted operational sharp edges

Numbered physical items in capped series have an irreplaceability problem (a lost shipment of item #7 of 100 cannot be reprinted honestly; hold reserve stock or write the replacement policy now). Merch takeover needs the inventory-risk decision (print-on-demand thins the "70% net of COGS" row to small absolute dollars; stocked inventory puts real capital at risk in a seasonal trough; the split table should be sanity-checked against POD unit economics before it is shown to Cody). The metered-access rail needs a dispute workflow (duplicate pulls, accidental pulls, accreditation revocation) before the first scout seat is sold. Split configurations need versioning with effective dates, because every percentage in the table is explicitly provisional and retroactive renegotiation against an immutable ledger is a contradiction. And the revoked-for-cause founding pass (doc 11) has no stated refund posture, which is a small consumer-terms landmine.

## What the piping v1 must include that doc 14 lacks

1. A funds-flow topology decision, recommended: Stripe Connect marketplace, platform as Connect platform, team and athletes as connected accounts, platform never holds funds. Named entities on every box of the diagram.
2. The outflow half: a dated team obligations calendar (LOC, assessments, capital-call exposure, insurance, taxes, vendor payables) inside the same system as the split engine.
3. A rolling 13-week cash forecast surfaced on the staff dashboard, with deposit float excluded from spendable cash.
4. A genuinely segregated deposit balance with a written refund/dormancy/escheat policy, including the venue-non-delivery trigger.
5. Ledger states on every accrual: pending, cleared (post holdback window), paid, disputed; portal displays the states; clawbacks hit pending.
6. A rolling reserve on player payouts and Stripe Radar from the first sale.
7. A loss-allocation table in the Empressa-Cody agreement: fraud, chargebacks post-payout, sponsor default, cut-player balances, each with a named owner.
8. Athlete tax and identity onboarding in the player class: W-9/TIN, payout account (Express onboarding), payer-of-record decision executed.
9. A per-stream Texas sales-tax categorization table driving Stripe Tax configuration, including the data-processing treatment of metered access.
10. Platform fees differentiated by stream class (team-native, shared, platform-created) replacing the uniform 15-20%.
11. An athlete platform agreement (individual, NIL-licensing-shaped, signed with the platform entity) as the legal container for every player-side split, contingent on the league-permission answer.
12. A ledger-of-record layer for off-platform flows (ticket settlements, off-platform sponsorship, league notices) so the dashboard sees the whole operation even where it processes none of it.
13. Meter dispute workflow and accreditation lifecycle for external access buyers.
14. Split-configuration versioning with effective dates.

## Three questions for Nick

1. Before anything is said in a locker room: will you get, from Cody, the four underlying league agreements plus a direct written answer on whether member teams may route supplemental income to league-paid players, and are you prepared for the answer to be no (which kills the earning loop but not the platform)?
2. Which product are you actually selling Cody: the member-economy rail (what doc 14 is), or the team financial OS (what the pitch says)? If the OS, the ledger-of-record layer and obligations calendar move into v1 scope ahead of follows and collectibles; if the rail, the pitch language must shrink to match.
3. Who eats unrecoverable losses, fraud after payout, sponsor default after accrual, a cut player's balance: Empressa or the team? This is a term-sheet line, it defaults to Empressa under Connect if unstated, and it should be priced into the platform fee before the split table is ever shown.
