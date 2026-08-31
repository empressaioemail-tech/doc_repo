---
decision_id: 2026-08-27_p85_records_request_email_and_studio_pricing
date: 2026-08-27
owner: Nick
status: active
related_canonical:
  - _inbox/2026-08-26_p85_central_texas_easements_WDLL.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md
---

## Decision

P-85 Records Request completion email uses **Resend** (existing portfolio domain setup). Records Request is **included in the existing Studio package**; no separate Stripe price or add-on for this feature.

## Context

WDLL item 11 required the operator to pick a transactional email provider; none was wired in PE or cortex-api at card start. Item 13 gated Free/Solo withholding on Stripe Studio price ids; operator confirms Studio pricing is already set and this report is part of that package, not a standalone SKU.

## Structural commitment check

- Sell reasoning, not data: unchanged; email links to parcel records with provenance, not raw index dumps.
- Tenant sovereignty: completion email goes to the requesting user's PE auth email only.
- Fail closed: if Resend send fails, record a run event (item 11 acceptance); do not silently skip.

## Reasoning

Resend is already provisioned for other domains in the portfolio, so item 11 should reuse it rather than introduce SendGrid/Postmark unless Resend proves incompatible (attachment size, throughput, or domain verification gap on the smartsite sending domain). Studio entitlement for Records Request should read the same gate as other Studio reports (feasibility, flood package depth), not a new price id, so item 13 prod gate aligns with existing Studio subscription rather than a separate checkout.

## Reversal criteria

- Revisit if Resend cannot send from the smartsite/PE from-address or bounce rate blocks production sends.
- Revisit if Studio packaging splits Records Request into a paid add-on with its own price id.

## Dependencies

- Item 11 implementation lane (cortex-api or api-server send on job terminal states).
- Item 13 gate reads existing Studio entitlement; dev_role bypass remains operator test-only.

## Counterparties

- Operator (Nick) — provider and pricing ruling.
- Studio subscribers — receive Records Request as part of Studio tier.
