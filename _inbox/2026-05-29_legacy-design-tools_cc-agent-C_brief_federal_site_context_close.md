---
id: 2026-05-29_legacy-design-tools_cc-agent-C_brief_federal_site_context_close
title: Close — PB-003 federal site-context layers on Property Brief
date: 2026-05-29
agent: cc-agent-C
repo: legacy-design-tools
branch: cortex/brief-federal-site-context
base: main @ 2de10040 (PR #134)
commit: 3e0b8d7
related: [75c_property_brief_data_backlog, 2026-05-29_cc-agent-C_brief_federal_site_context_layers]
---

# PB-003 close — federal site-context layers on `/brief`

## Hygiene note

Workspace had **alien uncommitted files** on `cortex/property-brief-lay-surface` / `cortex/encumbrance-r4` (encumbrance R4, GTM schema). Stashed unrelated WIP as `stash@{0}: cc-agent-C-alien-wip` before branching from `main` @ `2de10040`.

## Delivered

| Item | Status |
|------|--------|
| USGS NED + EPA EJScreen on `fetchBrokerageSiteContext` | Done |
| FEMA + Regrid unchanged | Done |
| Snapshots → cache → live order | Done |
| 30s total `AbortSignal` budget (`BROKERAGE_SITE_CONTEXT_TIMEOUT_MS`) | Done |
| Failed layers skipped (brief does not fail) | Done |
| `laySummary` wetlands + soils consumer cards (unknown until layers exist) | Done |
| PB-008 TCEQ spike: `isTceqEdwardsEnabled` + brief-path only (not `ALL_ADAPTERS`) | Done |
| Tests `brokerageSiteContext.test.ts` + snapshot integration mock update | Done |
| PR for operator merge | Push `cortex/brief-federal-site-context` |

## Gap (honest)

**USDA (soils) and USFWS (wetlands) adapters do not exist** in `@workspace/adapters` today — only FEMA, USGS, EPA, Regrid (+ optional FCC gate). Dispatch text assumed generate-layers already ran USDA/USFWS; code parity is **USGS + EPA** from `FEDERAL_ADAPTERS`. Follow-up: add `usda:*` / `usfws:*` adapter modules, register in `FEDERAL_ADAPTERS`, append to `brokerageSiteContextAdapters()`.

## Files

- `artifacts/api-server/src/lib/brokerageSiteContext.ts` — adapter set, timeout, summaries
- `artifacts/api-server/src/lib/propertyBriefLaySummary.ts` — wetlands/soils verdicts
- `artifacts/api-server/src/__tests__/brokerageSiteContext.test.ts`
- `artifacts/api-server/src/__tests__/brokerageSiteContext.snapshots.integration.test.ts`
- `lib/adapters/src/registry.ts` — `isTceqEdwardsEnabled`
- `lib/adapters/src/index.ts` — export gate helpers

## Tests run (local)

```
pnpm exec vitest run src/__tests__/brokerageSiteContext.test.ts src/__tests__/propertyBriefLaySummary.test.ts
# 7 passed
pnpm --filter @workspace/adapters test
# 250 passed (includes registry TCEQ gate)
```

## Operator acceptance

1. Merge PR from `cortex/brief-federal-site-context` → `main`.
2. Deploy cortex-api with existing adapter env (FEMA/Regrid/USGS/EPA need no new vars).
3. Optional: `TCEQ_EDWARDS_ENABLED=true` for Edwards Aquifer on TX briefs.
4. Smoke: `POST /api/brokerage/v1/brief` — Bastrop pilot address; expect `siteContext.layers` with `usgs-ned-elevation`, `epa-ejscreen-blockgroup` when upstreams respond (plus fema/regrid when configured).

## PR

Create from pushed branch:

`https://github.com/empressaioemail-tech/legacy-design-tools/compare/main...cortex/brief-federal-site-context`
