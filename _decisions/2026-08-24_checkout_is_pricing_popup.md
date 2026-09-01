---
decision_id: 2026-08-24_checkout_is_pricing_popup
date: 2026-08-24
owner: operator
status: active
related_canonical:
  - _inbox/2026-08-24_rebrand6_checkout_3b_WDLL.md
  - _inbox/2026-08-24_phase_close_live_qa_WDLL.md
---

## Decision

Start Solo, Studio, or Team keeps the map mounted and opens payment in a popup in the same family as the pricing modal. A full-page `/checkout` that replaces the map is retired.

## Context

3b WDLL item 4 froze a full-page `/checkout` with Smart Site on the left and Stripe Payment Element on the right. After the elements hotfix served, the operator started Studio from 1105 Hill and landed on `/checkout?...` with the map gone. The instruction: checkout needs to be a popup just like the pricing page popup. Unlock was already a modal. The money path (elements session, webhook, prices) does not change.

## Structural commitment check

No thesis conflict. Chrome only. Same Stripe Checkout Session.

## Reasoning

The pricing modal is the commercial surface the operator already accepted. Leaving the map to pay breaks return-to-work, which was the whole 3b point. A second full-page product is a different object than "checkout inside Smart Site."

## Reversal criteria

Revisit if Stripe Elements cannot mount reliably inside the modal (wallet or 3DS) and a hosted page is the only path that completes. That would be a recorded amendment, not a silent fallback.

## Dependencies

3b serving cortex `uiMode` map (`custom` alias to `elements`). No new prices. No invented card fields.
