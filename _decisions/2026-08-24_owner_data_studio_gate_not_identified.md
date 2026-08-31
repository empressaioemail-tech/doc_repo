---
decision_id: 2026-08-24_owner_data_studio_gate_not_identified
date: 2026-08-24
owner: operator
status: active
related_canonical:
  - _inbox/2026-08-10_smartsite_pricing_and_gtm_LOCKED.md
  - _inbox/2026-08-24_phase_close_live_qa_WDLL.md
  - _inbox/2026-08-24_field_mapping_pass.md
---

## Decision

Owner name and mailing on Smart Site are Studio and Team only. A signed-in free or Solo session, and a $15 unlock, must not receive or paint `ownerName`. Identified session is not the gate.

## Context

Live QA 2026-08-24 on smartsite.cloud `?parcelNodeId=48021:34097` (906 Chestnut). The operator was not a paying customer and the inspect card showed Owner GEAUXNU HOLDINGS LLC. The inspect Owner row reads cortex `ownerFact` (P-54). That path already refuses anonymous callers. It still serves a name once a brokerage session exists. The locked ladder (2026-08-10) places owner data on Studio, not on Free or Solo.

## Structural commitment check

Sell reasoning, not data: aligned. Owner is a Studio deliverable, not a free Layer 1 fact on the inspect card.

Confidence is earned: aligned. Absence is a typed refusal, not a blank invention.

Tenant sovereignty: aligned. No pooling change.

MCP-first: not in scope.

## Reasoning

Skip-trace is the locked Studio reason to exist beside CAD. Serving the CAD owner to any signed-in user collapses that rung and contradicts the pricing table already on the live modal (Solo dash on Owner data; Studio check). The share-loop exception (recipient sees what the sharer stored) is unchanged and is not this card.

## Reversal criteria

Revisit only if the operator moves owner data onto Solo or Free in a new locked-ladder amendment. Do not reopen from "the name is public-record CAD." Public-record source does not set the product gate.

## Dependencies

Depends on PE entitlement `studio` / `team`. Unlock metadata must not grant owner. P-54 anonymous refuse stays. Field-mapping row that said "identified session only" is superseded for the inspect paint.
