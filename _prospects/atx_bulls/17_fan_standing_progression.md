---
id: atx_bulls_17_fan_standing_progression
title: Fan standing — how the fan twin earns rank, and what raving fans get
status: draft
last_updated: 2026-08-14
applies_to: portfolio
owner: nick
related: [atx_bulls_10_fan_platform_vision, atx_bulls_11_portal_spec, atx_bulls_14_cashflow_map]
purpose: The progression system for the fan twin - the axes of standing, how rank is derived from the verified record, the tier ladder, the reward matrix, and the anti-gaming rules. Feeds the AF1 template as the standing architecture every node inherits.
---

# Fan standing and progression

## The design soul

Standing is earned by showing up, not bought. Spend counts, but presence and participation outrank wallet - a fan who attends every game and votes in everything outranks a fan who bought one of everything and never came. Without that rule this is a points program; with it, standing is an honor system fans defend, and the fan twin becomes something a person is proud of rather than a rewards balance.

Second rule, in house style: **standing is derived from the record, never stored as a balance.** The fan twin accrues verified events (attended, voted, bought, renewed, referred); current standing is computed from those events by published rules, at read time. No point inflation, no balance adjustments, no support tickets about missing points - the record is the truth and the rank is a view of it. A fan can always see exactly which events produced their rank.

## The three axes

1. **Era (fixed, historical).** When you arrived. Day One (before first kickoff), Founding (pass holder), Season One - stamps that can never be earned later. Scarcity of time; the axis that makes early fans permanently special.
2. **Standing (earned, current).** The active rank, derived from the last two seasons' record - so rank reflects who is showing up now, and a lapsed fan gently descends without losing history.
3. **Honors (permanent, listed).** Discrete achievements that never decay: full-season attendance, playoff away game, 100th event, vote-in-every-poll season, founding-drop sellout participant. The trophy case on the twin.

Lifetime record never decays; current standing breathes. Both display on the fan card.

## What accrues (verified events, with weights shaped by the soul rule)

| Event class | Verification | Weight class |
|---|---|---|
| Game attendance (home) | ticket scan tied to account | highest |
| Away-game attendance | scan/geo check-in at venue | highest, rarity-boosted |
| Season streaks (consecutive games) | derived | multiplier on attendance |
| Votes cast | native | medium |
| Membership renewal (consecutive years) | native | medium-high |
| Referrals that become members | attributed signup | medium |
| Purchases (merch, drops, content) | native | low weight, capped share of rank - spend contributes, never dominates |
| Testing-day / event attendance | check-in | medium |
| Content engagement (watch, share) | native | lowest, capped hard |

The cap mechanics matter: purchase-class events may never contribute more than a fixed fraction (proposal: 25 percent) of the score behind any rank threshold. Published, so the "can I just buy my way up" question has a printed answer: partially, never past the cap.

## The ladder (working names - Bulls-flavored, Nick and Cody to ratify)

Cattle-brand motif recommended: rank renders as brand marks burned onto the fan card - visually distinctive, thematically dead-on for a bulls team, and it makes rank legible at a glance on any card.

| Rank | Working name | Roughly | Flavor |
|---|---|---|---|
| 1 | THE HERD | any account | you belong |
| 2 | BRANDED | first verified attendance + first vote | you showed up; first mark on the card |
| 3 | STAMPEDE | regular attendance + participation in a season | the loud middle - most active fans live here |
| 4 | RAISED HORNS | near-full-season attendance, votes, renewal | the proven core |
| 5 | LEGEND OF THE HERD | multi-season sustained top standing | capped small by math, not by quota; the fans everyone knows |

Five ranks, not ten: each must feel like a real place. Era stamps and honors render alongside rank, so a Day One STAMPEDE fan and a Season Three STAMPEDE fan are distinguishable at a glance.

## The reward matrix (consumptive, mostly zero-marginal-cost, per the perk-debt discipline)

| Reward class | Examples by rising rank | Cost shape |
|---|---|---|
| Recognition | card visuals and brand marks; name on the digital fan wall; RAISED HORNS wall in the future venue; anniversary PA shoutouts; Legend banner moments | ~zero |
| Access | early entry windows; testing-day invites (STAMPEDE+); tunnel high-five row lottery; open-practice access; Legend sideline passes for a designated game | low, inventory-controlled |
| Priority | seat-upgrade priority; first allocation on numbered drops; playoff-ticket priority order by standing within era | zero (ordering, not inventory) |
| Voice | vote eligibility at BRANDED; proposal-submission right at RAISED HORNS (suggest the next vote topic) | zero; votes stay trivial-matter |
| Experiential (the raving-fan tier) | honorary captain coin toss; game ball presentations; "13th player" of the season honored at the final home game; away-trip with the team (Legend, lottery) | real cost, tiny inventory, huge story value |
| Economic | member pricing deepens one notch per rank | margin trade, bounded |

Every reward enters the perk register with an owner and delivery mechanism before it appears anywhere (BIG3 rule). Experiential inventory is Cody's to size - it costs sideline space and staff attention, and it is the single highest-leverage reward class because it produces the stories other fans chase.

## Anti-gaming and integrity

1. Attendance is scan-verified only; no self-report path exists.
2. Streaks are honest; one "ranch pass" per season (miss a game without breaking the streak) - a designed mercy, published, not a support favor.
3. Referrals count on the referred account's first verified attendance or paid membership, not on signup - kills bot referrals.
4. Purchase caps (above) make wallet-climbing structurally impossible past the cap.
5. Rank derivation rules are published in the portal; changes are versioned and never retroactive - a fan's earned rank never drops from a rules change, only from their own record breathing.
6. All of it is the same machinery as everything else: verified events with provenance, derivation at read, honest absence (a fan with no scans has "no attendance recorded," never a zero that looks like contempt).

## Feeds the AF1 template

Standing is per-team; era and honors travel. At league scale two additions: away-game verification becomes reciprocal across nodes (your scan at any AF1 venue lands on your twin), and a league-level honor tier for cross-team fandom (attend in N cities) becomes the traveling-fan story only a league umbrella can offer. The standing architecture ships with the template; each node names its own ladder in its own voice.

## Open (Nick and Cody)

1. Ladder names and the brand-mark visual direction.
2. Experiential inventory sizing (how many sideline passes, away-trip seats, coin tosses per season).
3. The purchase-weight cap number (25 percent proposed).
4. Whether standing influences anything in the venue era (seat-license priority is the obvious candidate - flag: that edges toward financial value and needs the same lane discipline).
5. Ticket-scan integration path (depends on the venue/ticketing answer; until then, testing-day and event check-ins are the attendance rail).
