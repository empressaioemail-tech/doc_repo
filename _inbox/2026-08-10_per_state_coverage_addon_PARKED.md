---
id: 2026-08-10_per_state_coverage_addon_PARKED
title: Per-state coverage add-on — settled mechanics, parked for revisit
date: 2026-08-10
status: PARKED by operator 2026-08-10; revisit after the parcel-node sweep lands
owner: nick
related:
  [
    _inbox/2026-08-10_smartsite_pricing_and_gtm_LOCKED,
    _inbox/2026-08-10_smartsite_humanless_gtm_handoff,
    _smartsite_masters/06_smart_site_gtm_audiences_and_pricing,
    _decisions/2026-08-09_texas_flush_launch_gate,
    90_operations/OPS-14_texas_flush_game_plan,
    _inbox/2026-08-09_76j_billing_surface_audit,
  ]
purpose: Capture the per-state coverage add-on before the thread is parked. The two-axis ruling and the mechanics below are settled; pricing, the user journey, and the map-filter thread are open. Post-launch, not a launch requirement.
---

# Per-state coverage add-on — parked with the mechanics settled

Operator raised this 2026-08-10 while the parcel-node sweep was still running: "we will need a add state for $x." Discussed to the point where the structure is settled and the open questions are clean, then **parked by the operator** — the thread opens a larger user-journey question and a map-performance question that deserve their own session. Revisit after the sweep lands.

**Post-launch, not a launch requirement.** Texas-first gating is operator-set (`76j`: no launch outside Texas until the factory has the target states flush). With one state in the catalog at launch, a coverage add-on has nothing to sell on day one. Treatment is the same as Prospect: named now for headroom, priced later.

This does NOT reopen the locked ladder. Free $0 / Solo $49 / Studio $129 / Team $299-for-10 / unlock $15-for-30-days stands unchanged.

## The ruling that settles the structure

**Operator, 2026-08-10: the per-state add-on tiers with whatever plan the user is on.** A Solo user who buys more states has Solo capabilities in all of them. Buying coverage never buys capability.

That produces the governing frame:

> **Tier is what you can do. Coverage is where you can do it.**

Two independent axes. Every gate evaluates both, and neither can be bought through the other. This matters because the locked ladder deliberately splits tiers on *what the output IS* rather than on volume of the same thing — a coverage axis would erode that logic if it were treated as a fourth rung. It is not a rung; it is orthogonal. **Write that sentence into any surface that describes the add-on**, or the add-on will drift into being priced like a tier.

Why the cost structure supports it: per the two-factory seam, **statewide onboarding cost is roughly constant per state regardless of county count** — one source, one pass, blankets a state; Texas at 254 counties and Rhode Island at 5 are nearly the same shape of work. So a per-state price maps onto a genuine per-state unit of acquisition work. That is the condition under which a volume-axis add-on does not feel arbitrary.

The caveat on that: the **jurisdiction** factory (zoning, setbacks, code text) scales with jurisdiction count, and that is where the moat is. A state is cheap on fabric and expensive on depth. Whether $X prices the fabric or the depth is an open question below, and it decides whether $X is flat or scales.

## Settled mechanics

**Entitlement becomes a pair, not a scalar.** Verified live 2026-08-09 (`_inbox/2026-08-09_76j_billing_surface_audit.md`), the entitlement payload is `{authenticated, tier, tenantId, userId, devRole, entitlementSource}` — **there is no geographic dimension in it at all.** The shape needed:

```
{ tier: "solo" | "studio" | "team",
  coverage: ["48", "35"],        // state FIPS
  ... }
```

Both checks run independently; both must pass.

**Key on state FIPS, never names or abbreviations.** The store already keys on FIPS (`48` = Texas; sweep counties are `48xxx`), so a parcel's state derives from data already held by truncating the county FIPS. Storing "Texas" or "TX" adds a normalization layer that will drift — the same identifier-normalization family that has bitten three times already (situs comma tail, CAD `prop_id` zero-padding, the `BLOCK` case-split that understated coverage by 67 counties). Do not open a fourth.

**Coverage survives a tier downgrade.** Studio-with-four-states dropping to Solo narrows capability, not coverage — the states are paid for separately. Falls out of the operator ruling directly, and is worth stating because the naive implementation resets everything on plan change.

**On cancel, saved properties stay readable.** Consistent with existing treatment of saved work. What is lost is producing *new* answers in states no longer held.

**Team coverage is shared at the account, not per seat.** A firm buys Colorado once and all ten seats work Colorado. Per-seat coverage contradicts "one bill" and is a billing tangle. Side benefit: this gives Team a genuine third reason to exist beyond seats and shared properties, which the ladder currently lacks.

**Free browse and the share loop stay nationwide.** Recommended, not yet ruled. Free browse and the inspect card are the demo and the top of the funnel; the share loop is the acquisition channel. Fencing free to one state turns a shared Texas smart site opening for a Colorado stranger into a dead end rather than a conversion — and the locked share ruling says a shared property carries everything the sharer stored at full fidelity regardless of the recipient's tier. **So coverage gating attaches to the paid capabilities, not to the map.** That is also simpler to build than fencing the whole surface. The clean journey: a Colorado stranger opens a shared Texas analysis at full fidelity, sees the free inspect card work on their own Colorado parcel, and hits the coverage gate the moment they want the X-ray there.

## The trap — billing state masquerading as data state

**The coverage gate and the honest-absence message must never produce the same string.** Once coverage exists, a single parcel can be denied for three completely different reasons:

| Outcome | Meaning | Class |
|---|---|---|
| "Not verified for this parcel" | We do not have the data | Honest absence — a selling point |
| "You don't hold New Mexico" | We have it; you have not bought it | Coverage gate |
| "Owner data is a Studio capability" | Tier gate, orthogonal to both | Tier gate |

If a coverage denial ever renders as "not verified," a paywall is wearing the costume of a data gap. That inverts the G7 ruling (30-day expiry must read as freshness, never as billing pressure) in the opposite direction — **same defect class: billing state presented as data state.** It is worse in this direction, because it makes the product look like it has less coverage than it does, damaging the exact behavior the collateral leans on as a differentiator.

**Build rule that prevents it:** evaluate and message the coverage denial BEFORE the data lookup happens, so the two cannot be conflated in one code path.

## Open — operator calls, not planner calls

1. **Does $X price a state's fabric or its depth?** Different cost curves; decides flat versus scaling.
2. **Flat across tiers, or scaling with tier?** Planner lean: **scales.** A Studio user extracts more value per state (CAD, owner data there), and a flat add-on means the second state carries a lower effective markup than the first, which reads backwards.
3. **A national / all-states bundle?** Large Team accounts will ask immediately.
4. **Swap versus stack.** If a user's home state is Texas and they now work Colorado — add ($X/mo forever) or swap (free, lose Texas)? Planner lean: **allow a swap with a cooldown**, roughly once per billing period. No swap path means someone who genuinely changed markets pays twice or churns; an uncapped swap turns states into a rotating library and the add-on stops earning. The cooldown is what makes it a coverage grant rather than a rental.
5. **How the base state is chosen.** Planner lean: the user **picks and can change it.** Inference from IP or first parcel guesses wrong for exactly this audience — an Austin investor working New Mexico land.

## Threads this opened — the reason it is parked

**State filters on the map, for load time.** Operator, 2026-08-10: "I will want to do state filters as well to help with loading time on the map." This is a **performance and UX concern that exists independent of billing** — it would be wanted even if the add-on never shipped. It is likely to interact with the coverage model (a coverage set is a natural default filter) but must not be designed as a billing feature: filtering for speed and gating for payment are different jobs, and collapsing them recreates the trap above in the UI layer. Worth scoping on its own.

**The user journey.** Signup, home-state selection, the moment a user first crosses a state line, what the map does when they hold three states, how the upgrade prompt reads, and how the free nationwide browse coexists with paid per-state capability. Substantial, and it deserves the interview treatment rather than a planner draft.

## Dependencies before any of this is buildable

- **The entitlement-model change** (tier + coverage set) — lands in the same neighborhood as the Team seat-management build. Both are `76j` program work.
- **Stripe add-on line items** on a subscription, not just a plan swap.
- **Gate changes at every serving endpoint** plus a UI surface showing which states are held.
- **A genuinely multi-state factory.** The add-on gets its commercial force from the joint that makes multi-state work — the `parcel-node` seam — which is what the sweep is writing now. Second-state candidate set is UT / NM / CO / AZ per OPS-14.

**The mechanics are correct to settle now and premature to build now.**

## Revisit checklist

When this comes back: read this doc, confirm the locked ladder is still the ladder, then take the five open calls in order — they cascade. Question 1 (fabric versus depth) decides 2 (flat versus scaling), which bounds 3 (the bundle). Then the map-filter thread and the user journey get their own scope, and the entitlement-model change gets sized against the Team seat build it shares a neighborhood with.
