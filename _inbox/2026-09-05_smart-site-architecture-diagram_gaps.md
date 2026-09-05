---
title: Smart Site architecture diagram — confirmed gaps, needs full rebuild
date: 2026-09-05
status: open, deferred to after tonight's launch work
related:
  - 90_operations/OPS-19b_ctx_pipeline_wrapup_sprint
---

# Smart Site architecture diagram — rebuild needed, not a patch

The published artifact ("Smart Site Architecture",
`https://claude.ai/code/artifact/83229270-04c7-451f-86b1-7d53834a3bef`) was built
by generalizing `_inbox/2026-09-05_ledger_serving_audit.md` — an audit deliberately
scoped to hauska-factory's `parcel_record` ledger/gate-verdict chain — into a claim
about "the full architecture of Smart Site." It is materially incomplete and
contains at least one affirmatively false claim. Operator ruling 2026-09-05:
rebuild after tonight's launch work (gate-eval, F-11, item 10) lands, not now.

## Confirmed findings (independent adversarial review, live repo reads)

1. **False claim, not omission**: the diagram states "hauska-engine is vendored,
   not deployed" as a general fact. True only for the `ingest-existing.ts` path
   vendored into hauska-factory. False generally: hauska-engine ships two live,
   independently deployed production services — `engine-api` (Cloud Build to
   `hauska-prod-497015`, consumed synchronously by cortex-api's production config
   with named feature flags) and `retrieval-api` (own documented deploy, consumed
   live by hauska-map's Command Center proxy `api/spine.ts`).
2. Four more live, deployed legacy-design-tools surfaces missing entirely:
   `smartsite-mcp` (OAuth-gated MCP server at `mcp.smartsite.cloud`, tools live
   in this session's own connector roster), `plan-review` (jurisdiction reviewer
   app), `records-request-worker` (Playwright county-portal automation),
   `design-tools` (architect/engagement cockpit).
3. **Command Center** confirmed absent from the diagram, AND misattributed by
   the planner to the wrong repo mid-investigation (said legacy-design-tools;
   it actually lives at `hauska-map/apps/command-center`, sibling to Property
   Explorer). Second repo-location error this session, caught by an independent
   check rather than by the planner.
4. `@empressaio/cortex-tiles` — a 24+ component shared framework (compliance,
   hazards, hydrology, 3D model viewer, encumbrances, map, property-intel)
   consumed by both Command Center and Property Explorer. Only one component
   (LocalSetbacksTile) ever surfaced anywhere in the diagram's lineage.
5. `cortex-api` never called by that name in the diagram (labeled generically
   as api-server/brokerageNodeFacets.ts) despite being this org's own settled
   ADR-008 term for exactly that service.
6. Noted, not independently verified (repo not cloned for this review): the
   Hauska MCP Server / atom substrate is completely absent from the diagram.
   Corroborated indirectly (hauska-map's `X-Hauska-Key` proxy calls, smartsite-mcp's
   own README contrasting itself against it) but not confirmed at source.

## What was correctly NOT flagged

hauska-factory's job harness (the diagram's actual subject matter) matches live
state. `apps/factory` in hauska-map is correctly just the factory's console per
its own README, not a separate surface. `hauska-engine/services/pipeline-runner`
was explicitly NOT flagged as a gap — reviewer could not establish it's reachable
in production (no deploy pipeline found), correctly left out rather than asserted.

## Root cause

Same pattern twice in one night: a check/audit correctly scoped to one question
("does hauska-factory's ledger data reach a served customer field") got
generalized into a broader claim ("this is the full architecture") without an
independent, from-scratch survey to verify completeness first.

## Next step

Rebuild from a genuine full survey of all repos' `apps/`/`packages/`/`services/`
trees (the method the adversarial reviewer used: survey blind, then diff against
any prior claim), not from any existing audit's framing. Scheduled after tonight's
launch-blocking work closes.
