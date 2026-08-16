---
id: 2026-08-16_contribute_or_pay_attention_layer
title: Contribute or pay — the barter sits on the Attention layer, never on the front door
date: 2026-08-16
status: active
applies_to: portfolio
owner: nick
decider: nick
related: [_rd_disclosure_twin/08_build_scope, _rd_disclosure_twin/09_twin_read_contract, _rd_disclosure_twin/11_gtm_thoughts, 08_tiered_access_model, 14_pricing_framework]
---

# Contribute or pay

## Decision

The Attention layer of the instrument twin, meaning the aggregate count of participants who have marked a band, is obtained either by contributing your own declared levels or by paying for it. Every other layer stays on the existing tier model.

The barter sits on that one layer. It does not sit on the front door.

Adopted 2026-08-16 as the working posture. Parameters are explicitly open and expected to be tuned; see below.

## Why this shape and not the alternatives

Mandating contribution at the door was the tempting option because the Attention layer is worthless without population, and population is the whole cold-start problem. It was rejected for four reasons.

It would break Layer 1 free, which is settled in `08_tiered_access_model.md`. Free-but-you-must-hand-us-data is barter, not free, and moving a settled tier decision by program drift rather than by explicit supersession is exactly how canon rots.

It would fight the distribution plan. Discovery depends on MCP registries and anonymous Layer 1 access per `_rd_disclosure_twin/06_the_move.md`. An agent browsing a registry will not implement a write path in order to try a read, so a door gate adds friction at the precise moment the strategy is trying to be found. That contradicts the traction-first posture recorded in `11_gtm_thoughts.md`.

It is a disclosure ask rather than a data ask. Telling a service where you intend to buy reveals a hand before it is played. Retail may not care; an institutional caller may be prohibited outright, which narrows the buyer before the buyer is known.

And the sharpest reason: adverse selection at cold start. A mandatory gate produces contributions made to satisfy the gate rather than to be correct. The defense against that is calibration weighting, where an account with no graded record contributes zero to the published figure, but that defense needs grading history and at cold start there is none. A door gate would flood the layer with noise at the one moment it cannot be filtered.

## What this does not change

**Layer 1 stays free.** This decision is compatible with the settled tier model rather than a supersession of it, because the barter is a property of one differentiated layer rather than of access itself. No ADR is required and `08_tiered_access_model.md` is unchanged.

## Consequences

The write path and the entitlement policy are separate concerns and stay separate. Row TW-27 builds the mechanism by which an agent declares a level; whether declaring buys anything is a policy layer above it. That separation is what makes the parameters tunable without a rebuild.

Contribution and payment are alternative routes to the same entitlement, so the layer needs a single entitlement check with two satisfying conditions rather than two access paths.

The self-selection property is the point, not a side effect. Someone contributing in order to see the layer has a reason to contribute honestly, which is the opposite of the gate-satisfying behaviour a door gate would produce.

## Parameters left open, to be tuned with real data

How much contribution buys how much access, and over what window. Whether contribution decays, so that a single historic declaration does not buy indefinite access. Whether calibration standing modifies the rate, so that a contributor with a graded record earns more access per declaration than an unproven one. What the paid price is, which routes to `14_pricing_framework.md`. And whether any part of the Attention layer is visible at Layer 1 at all, for example a cohort-size figure without the band detail.

None of these needs answering before row TW-29, which sits behind TW-27 and TW-28, so they will be decided against observed contribution behaviour rather than a guess.

## Reversal criteria

Tighten to a door gate if, after the write path is live and marketed, contribution volume is too thin to make the Attention layer meaningful and the paid route produces no revenue either. That is the case where the softer bargain has been shown not to work.

Loosen toward fully free if the contributed corpus turns out to be large enough that the marginal contribution is worth less than the distribution gained by removing the gate.

Reverse the whole posture if publishing aggregate declared intent proves to carry a regulatory characterisation nobody has tested yet. That question has not been asked of counsel and is not assumed answered here.
