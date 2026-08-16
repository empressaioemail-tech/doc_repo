---
id: atx_bulls_14_cashflow_map
title: Cash-flow map — the Bulls member economy, end to end
status: draft
last_updated: 2026-08-14
applies_to: portfolio
owner: nick
related: [atx_bulls_10_fan_platform_vision, atx_bulls_11_portal_spec, atx_bulls_01_fan_monetization_now, _rd_digital_economies/04_economic_model]
purpose: Maps every money flow in the Bulls member economy - sources, splits, rails, and ledgers - with the player-earning loop made concrete. All split percentages are PROPOSED DEFAULTS for the Cody conversation, not agreed terms. Feeds the AF1 franchise template as the reference cash-flow architecture.
---

# Cash-flow map: the Bulls member economy

## The picture

```
  FANS                    SPONSORS              EXTERNAL DATA BUYERS
   |                         |                   (scouts, media, agents)
   |  passes, memberships,   |  graph inventory,        |
   |  deposits, merch,       |  testing-day and         |  per-reference
   |  follows, collectibles  |  drop sponsorships       |  profile access
   v                         v                          v
 +-----------------------------------------------------------------+
 |                    ONE CHECKOUT / ONE METER                      |
 |   card + wallet pay-in  ·  sales tax  ·  refund policy  ·  KYC   |
 |            PROGRAMMATIC SPLIT AT SETTLEMENT (splits as code)     |
 +-----------------------------------------------------------------+
      |                  |                     |               |
      v                  v                     v               v
  TEAM ACCOUNT     PLAYER LEDGERS         PLATFORM FEE     PASS-THROUGH
  (Cody)           (per-athlete accrual,  (Empressa)       (COGS, processing,
                    visible day one)                        fulfillment, tax)
      |                  |
      v                  v
  team operations    monthly settlement -> athlete payout
                     (mechanics: accountant + counsel gate)
```

One rail, every stream. No stream settles outside the split engine; no split is a quarterly reconciliation argument, because the split executes at settlement.

## The two access classes (the key design decision)

Player-linked value flows through two deliberately different doors:

1. **Internal access (bundled).** Fans see verified profiles through membership and premium follows. No per-view charge to the fan; player compensation comes as a share of the stream (follow revenue to the individual; membership/testing-day content to the player pool).
2. **External access (metered).** Scouts, media, agents, and any third party pull profiles through metered access: per-reference pricing, each access recorded, the referenced athlete accrues individually. This is the obligation-meter pattern running in production elsewhere, pointed at athletes.

Two doors because the economics differ: fans buy belonging (flat, recurring), professionals buy specific verified data (metered, per-use). Collapsing them either overcharges fans or underpays athletes.

## Pool versus individual (the group-licensing split)

Mirrors how sports licensing already works: **individual content pays the individual** (a follow on Marcus, a Marcus stat card, a Marcus appearance, an external pull of Marcus's profile); **collective content pays the player pool** (testing-day sponsorship, roster-wide membership content, team collectible drops), split pro-rata by participation in the content. An athlete who declines a data class simply is not in that pool's denominator. This keeps consent meaningful and makes participation visibly worth money.

## Stream-by-stream splits (PROPOSED defaults, all open to the Cody terms conversation)

| Stream | Payer | Team | Players | Platform | Notes |
|---|---|---|---|---|---|
| Founding Pass | fan | 80% | 5% pool | 15% | pool share funds the testing-day content the pass promises |
| Annual membership | fan | 75% | 10% pool | 15% | recurring base; pool share keeps roster content flowing |
| Seat deposits | fan | 100% held as credit | 0 | 0 | not revenue until applied to tickets; escrow-style accounting |
| Merch and drops | fan | ~70% net of COGS | 0 | 15% of net | plain merch |
| Player-linked merch/collectibles | fan | 50% net | 30% individual | 20% | primary sales only; no secondary market at launch |
| Premium follows | fan | 30% | 50% individual | 20% | the athlete's headline stream |
| Testing-day / content sponsorship | sponsor | 60% | 25% pool | 15% | players are the content; the pool share is the consent engine |
| Graph/segment sponsorship | sponsor | 70% | 10% pool | 20% | fan-graph inventory |
| External profile access (metered) | third party | 20% | 65% individual | 15% | the "profile accessed, player paid" loop; athlete majority by design |
| Appearance marketplace | fan/business | 5% | 80% individual | 15% | team cut covers facilitation/brand |
| Tryout registration | applicant | 85% | 0 | 15% | rung-2 revenue |

Platform share shown as a uniform 15-20% of digital gross; the actual Empressa-Cody commercial structure (percentage vs fee vs hybrid, and design-partner terms) is an open item from doc 05 and gates nothing here except final numbers.

## The player-earning loop, made concrete

```
 access event                meter                    ledger                payout
 -------------               ------------------       -------------------   -------------------
 scout pulls Marcus's   ->   reference recorded  ->   accrual row lands ->  monthly settlement
 verified profile            (who, what, when,        in Marcus's ledger    to the athlete
 ($15 illustrative           which data class,        (visible in his       (1099 path; exact
 per full pull, or           rate applied)            portal same day)      mechanics gated on
 $250/mo league-wide                                                        accountant + counsel
 scout seat)                                                                per doc 10 open item)
```

Illustrative year-one magnitude, stated honestly: at arena-league visibility, an average player might see hundreds of dollars, standouts low thousands, from follows plus pool shares plus occasional external pulls. That is real supplemental income at this tier (league-set central payroll is modest), and the number grows with the platform, but no athlete should be promised more than the ledger shows. The ledger being visible from day one, before the numbers are large, is the trust move: the athlete watches the machine work rather than taking anyone's word.

## Rails and accounting notes

1. Checkout: Stripe (cards, Apple/Google Pay), Stripe Tax from dollar one; Circle-backed rails available where they earn their place. Deposits held as credit, not recognized revenue.
2. Splits execute at settlement via the platform's revenue-router pattern; every split writes ledger rows (team, player, platform) at the moment of the transaction.
3. Refunds and chargebacks claw back pro-rata across the same split; player ledgers can go briefly negative against future accruals (never invoiced back).
3a. **Loss allocation RULED (Nick, 2026-08-14): unrecoverable losses land on the team, as the main account holder and merchant of record, like any other business.** Doc 16 question 3 closed. Mechanics that implement the ruling: ledger states (pending, cleared, paid) so accruals are not spendable inside the clawback window; a small rolling reserve on the team account absorbing routine cases; the loss line written into the Empressa-Cody agreement so it is contractual, not customary.
4. Player payouts: monthly, above a small minimum threshold, as contractor income; the through-team vs direct-platform payout question (tax, league assessment interactions) remains the accountant/counsel gate before any promise is made in the locker room.
5. League interactions: team-local digital revenue; the unseen Membership Agreement's "Rights Fee" and any league merch arrangements must be checked before the merch takeover finalizes (doc 06 item).

## What this feeds forward (AF1 template)

This map IS the member-lane cash-flow architecture of the franchise template: one checkout, splits as code, two access classes, pool-versus-individual, visible athlete ledgers. At league scale two things are added: the center's share enters each split row (per league structure), and network-level sponsor inventory becomes a center-sold stream splitting center/nodes/pool/platform. The Bulls prove the mechanics; the template inherits them with one more column.

## Open to decide (Nick and Cody)

1. The split table above, row by row (it is written to be argued with).
2. External access pricing (per-pull vs seat licenses) and who may buy (scout/media accreditation).
3. Empressa commercial terms (the platform column).
4. Player payout mechanics (the accountant/counsel gate).
5. Whether pool shares vest per season or per content event.
