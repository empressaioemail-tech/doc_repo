---
decision_id: 2026-09-07_affiliate_chargeback_cancellation_handling
date: 2026-09-07
owner: Nick
status: active
related_canonical: [74_commercial_agreements.md]
---

## Decision

A chargeback against an affiliate-referred transaction is withheld from that
affiliate's next distribution; a subscription cancellation simply stops future
royalty payments going forward, with no retroactive clawback of royalties
already paid for the period the referral was active.

## Context

Surfaced when cente-b9 (hauska-map lane) hit the undesigned affiliate
revenue-split/chargeback/cancellation handling item while triaging the
2026-09-04 Smart Site UI review backlog (`_inbox/2026-09-07_integration_smart-site-ui-review-triage.md`).
cente-b9 correctly declined to invent this itself, naming it a business and
financial decision with real money and likely ToS exposure rather than an
engineering call, and routed it for a ruling before treating it as a task.
Nick ruled directly in this session. The 20% affiliate revenue split named in
the source triage doc was not itself in question and stands unchanged.

## Structural commitment check

No hit on the four structural commitments (reasoning-sale, confidence,
cost-per-jurisdiction, dual-interface); this is bizops/commercial policy for
the affiliate program, not portfolio architecture.

## Reasoning

Withholding a chargeback from the affiliate's next distribution nets it
against future earnings rather than creating a separate clawback or
negative-balance transaction, which avoids a collections problem if a given
affiliate has no further activity to net against. Cancellation stopping only
future royalty, with no retroactive clawback, keeps the model simple and
doesn't dispute a royalty the affiliate legitimately earned for a period the
referral was actually active and paying.

## Reversal criteria

Revisit if legal/ToS review (once the IP attorney engagement referenced in
`72_hauska_inc_operations.md` happens) finds real liability exposure, notably
the unbounded case where a chargeback exceeds an affiliate's entire
outstanding balance with nothing left to net against. Also revisit if real
affiliate volume shows the withholding model creates a cash-flow or
collections problem in practice.

## Dependencies

Unblocks the build of the Stripe/affiliate revenue-split logic. **Correction,
2026-09-07, same day**: this record originally named cente-b9 (hauska-map)
as the downstream builder. cente-b9 investigated before building (per this
operation's own standing discipline) and found hauska-map has no Stripe
webhook handling, no subscription-state storage, and no affiliate-attribution
mechanism at all — the same absence already confirmed for the dual-active-
billing-plan bug routed to cente-c1 earlier tonight. The real infrastructure
this logic sits on top of (`checkout.session.completed`/`customer.subscription.*`/
`charge.dispute.*` handling) lives in legacy-design-tools
(`brokerageBilling.ts`/`brokerageStripe.ts`), not hauska-map. Real builder is
cente-c1 (legacy-design-tools), not cente-b9. The affiliate-link visibility
gating item is separately blocked on its own open question (how a user
becomes a recognized affiliate and where that state lives) and is not
resolved by this ruling either way.

## Counterparties

Internal. Owner: Nick. Affects Hauska Inc./Legacy Group ATX affiliate program
design. Downstream builder: cente-c1 (legacy-design-tools), corrected
2026-09-07 from an initial, wrong assignment to cente-b9 (hauska-map) — the
same-day error was caught by cente-b9 itself, verifying against live code
before building rather than accepting the assignment on the record's word.
