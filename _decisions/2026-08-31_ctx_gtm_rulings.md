---
decision_id: 2026-08-31_ctx_gtm_rulings
date: 2026-08-31
owner: operator
status: active
related_canonical:
  - _smartsite_gtm/01_central_texas_gtm_strategy
  - _inbox/2026-08-10_smartsite_pricing_and_gtm_LOCKED
  - _inbox/2026-08-10_smartsite_humanless_gtm_handoff
  - 76j_smartsite_launch_readiness_program
---

# Decision

Three rulings on the Central Texas go-to-market, operator 2026-08-31.

**1. Affiliate is opt-in with an application.** Subscribers do not automatically receive an affiliate link.

**2. McLennan is held.** The launch target is the Austin metro five: Bastrop 48021, Travis 48453, Williamson 48491, Hays 48209, Caldwell 48055. Serving Waco continues unchanged; targeting it waits.

**3. Affiliate launch holds on share and funnel instrumentation.** This is the only hold in the plan.

## Context

The affiliate channel is in flight with another agent group, running PromoteKit attributed against Stripe with PayPal payouts, and the Stripe live switch is running with that same group. The share loop already works and carries full fidelity. Claude Sync shipped and is operator-confirmed. The absence of channel data is a pre-market fact rather than a defect; what survives as a real gap is whether the events exist to catch data once traffic starts, and they do not.

## Structural commitment check

- Sell reasoning, not data: unchanged, no channel sells a data dump.
- Confidence earned: instrumentation is the mechanism by which channel claims become measured rather than asserted, which is why ruling 3 exists.
- Cost per jurisdiction: not in scope.
- Dual interface: unchanged, and the connector's placement is ruled separately.

## Reasoning

On 1. PromoteKit makes universal affiliate links free to issue, which is exactly why the question arose. Issuing them universally converts the share loop into a 20 percent recurring cost on referrals the locked ladder already says arrive at no cost, and it changes the share gesture from generous to transactional at the moment that gesture is the cheapest acquisition in the portfolio. The program should pay 20 percent for reach that would not otherwise exist. An application gate also makes the approved-claims constraint enforceable, since an affiliate who never applied cannot be held to a claims register.

On 2. McLennan is served and stays served; this is a targeting ruling, not a coverage one. Waco is a separate media market with separate groups, agents, and influencers, and holding both blurs affiliate targeting at the moment it most needs to be sharp. Holding it also creates something more valuable than five percent more reach: a clean test of whether the playbook transfers to a second market.

On 3. Affiliate and share have to be told apart during the first window of real traffic, and events cannot be backfilled. The hold is cheap because it blocks only link distribution: recruiting, kits, content, and the GoHighLevel buildout all proceed in parallel. It is also mechanically partial anyway, since PromoteKit attributes against live Stripe subscriptions and therefore cannot be exercised before the live switch completes.

## Reversal criteria

Reverse 1 if the share loop, once instrumented, shows recipients converting at a rate that a compensated sharer would plausibly raise; that is a measured argument and the current ruling is explicitly provisional on the absence of measurement. Reverse 2 when the Austin five have produced a working affiliate cohort, at which point Waco is the intended next step rather than a reversal. Reverse 3 only if the operator accepts that the first cohort of affiliate spend will be unattributable, which is a cost decision and not a planner call.

## Dependencies

Ruling 3 depends on the share, funnel, and activation event work, which is unbuilt and is items 5 through 7 of the locked humanless handoff. Ruling 1 depends on PromoteKit configuration, which depends on the Stripe live switch. Ruling 2 depends on nothing.

Open and not decided here: the one-line outcome each affiliate segment sells. Candidates were drafted 2026-08-31 and deliberately not ratified, because the ladder re-cut proposal changes which tier each segment is sold into.

## Counterparties

Internal. The affiliate and Stripe agent group owns the PromoteKit and live-switch work. Property seat owns the instrumentation. Operator owns the segment lines.
