---
decision_id: 2026-09-03_p32_feasibility_tier_ruling
date: 2026-09-03
owner: Nick
status: active
related_canonical:
  - _inbox/2026-08-24_feasibility_v1_plan_DRAFT.md
  - _decisions/2026-09-03_p32_feasibility_unfrozen.md
  - _inbox/2026-08-10_smartsite_pricing_and_gtm_LOCKED.md
  - _catalog/dispatch_missions/mission_p32_feasibility_assembler_wave1.md
---

## Decision

The composed Feasibility Study PDF is gated Studio and Team. This ratifies spec item 2 (`_inbox/2026-08-24_feasibility_v1_plan_DRAFT.md` §4, item 1: "the composed Feasibility Study PDF is a Studio deliverable"), made explicit for Team rather than left to inherit implicitly.

## Context

Operator: "feasibility study belongs to studio and team (should be wired that way already)." Verified before recording rather than assumed: Team already satisfies every existing Studio gate in the live product today. `subscriptionTierGrantsStudio` exists as three cross-referenced, byte-identical implementations (`legacy-design-tools/artifacts/api-server/src/lib/peEntitlement.ts`, `legacy-design-tools/artifacts/smartsite-mcp/src/entitlement.ts`, `hauska-map/apps/property-explorer/src/lib/entitlementClient.ts`), each `return tier === "studio" || tier === "team"`, plus a server-computed `studioGranted` field on `/property-explorer/v1/entitlement` (P-104) that downstream consumers (site-plan/terrain export, owner-fact display, screens/boards, records extraction) read rather than re-derive. No exact-match gate anywhere in either repo was found excluding Team.

**This is a hardcoded allow-list, not an ordinal tier comparison** — there is no ranked `tier >= studio` check anywhere in the codebase. It is consistent today by discipline (three copies, each commented to name the other two, deliberately kept small rather than centralized), not by structure. A new, independent tier check would not automatically include Team; it would need `|| tier === "team"` written by hand.

## Reasoning

Ratifying the tier placement unblocks spec item 10 (the PE gating leg, wave 2), which was waiting on this. The instruction that actually matters for build correctness isn't "Studio and Team" alone — that much was already true by inheritance — it's *how* the gate gets built: reuse the existing pattern, don't add a fourth.

## Build instruction (binding on wave 2)

The Feasibility PE leg must gate through the existing `studioGranted` field (or, server-side in a new repo context, import one of the three existing `subscriptionTierGrantsStudio` implementations) — never write a new, independent tier check. If none of the three existing implementations is reachable from wherever the Feasibility gate needs to live, that is itself a finding to report, not a reason to write a fourth.

## Reversal criteria

Revisit if the ladder's tier structure changes such that Team stops being a strict superset of Studio (not the case today), or if the operator wants Feasibility priced independently of the Studio/Team boundary.

## Dependencies

Unblocks: spec item 10 (PE leg, wave 2) — still also waiting on wave 1 item 4 (the assembler) landing. Feeds: `_decisions/2026-09-03_p32_feasibility_unfrozen.md`'s open dependency on item 2.

## Counterparties

Internal: Nick (ruling), property seat (wave 2 build, both repos, once wave 1 lands).
