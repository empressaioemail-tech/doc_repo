---
id: 2026-06-07_cc-agent-C_subsurface_data_layer
title: Dispatch - subsurface data layer (SSURGO soils + USGS geology/groundwater/seismic)
date: 2026-06-07
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: FIRE-READY (Wave 1, parallel-safe; lib/adapters only, disjoint from the finding-engine workstreams)
related: [00_current_state, 01a_atom_conventions, 20_agent_operating_rules, 55_spine_data_intelligence_stack, 52_mcp_offer_and_buildout]
---

# Subsurface data layer (SSURGO soils + USGS geology / groundwater / seismic)

> **FIRE-READY.** Wave 1, parallel-safe. Touches `lib/adapters` (site-context tier) only, disjoint from the finding-engine workstreams on the c2 clone. All sources are free federal public-records (product-baseline; partnership-first does not gate). Verify identifiers against live source before firing.

You are **cc-agent-C**, the single owner of the `P:\legacy-design-tools` main clone for this run.

## Model (HR-12)

Default: **Grok Build 0.1** (multi-file / agentic). Escalate to Claude only if Grok fails after retry; log the escalation. Cursor base URL `https://api.x.ai/v1`.

## Atoms to resolve

- `current-state:portfolio` - fleet status, blockers
- `sprint:55` - spine robustness roadmap (this is workstream 4, subsurface)
- `product:cortex` - site-context adapters live in cortex-api

## Read first (after atoms)

1. [`55_spine_data_intelligence_stack.md`](../55_spine_data_intelligence_stack.md) - Section 6 (subsurface), Section 2 (site-context adapter pattern)
2. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) - HR-1, HR-2, HR-3, HR-8, HR-11

## Workspace ownership

- Clone: `P:\legacy-design-tools` (main clone)
- Branch prefix: `cortex/`
- One agent per clone per [`agent_workspace_hygiene`](../90_runbooks/agent_workspace_hygiene.md). **cc-agent-C2 is on the c2 clone doing plan-set decomposition this wave; stay in `lib/adapters` and the registry, do not touch the finding-engine.**
- Refuse alien HEAD or uncommitted state; report verbatim `git status` + `git log -3`

## Scope

**In scope:**

- Recon first. Read the existing federal/state adapter pattern (`lib/adapters/src/federal/*`, `lib/adapters/src/state/texas.ts` Edwards aquifer, the registry at `lib/adapters/src/registry.ts`, the cache and runner). Report the adapter contract verbatim.
- Build new site-context adapters, following the existing adapter contract, cache, and neutral-no-coverage-pill pattern:
  - **`usda:ssurgo-soils`** - USDA NRCS Soil Survey (SSURGO). Soil map units, drainage class, hydrologic soil group, bearing/shrink-swell where available. Highest priority.
  - **`usgs:groundwater`** - USGS NWIS groundwater (depth to water table / well records) where coverage exists.
  - **`usgs:geology`** - USGS bedrock/surficial geology (formation) layer.
  - **`usgs:seismic`** - USGS Earthquake Hazards seismic design parameters + fault proximity (feeds an ASCE 7 hook later).
- Each adapter: free public source, source attribution, freshness threshold, neutral pill on no-coverage (do not fail red when a layer is absent for the geography), 24h cache via the existing `adapter_response_cache`.
- Register the adapters and gate any that need a geography flag the same way the Edwards adapter is gated.
- Tests mirroring the existing adapter test suites (coverage hit, no-coverage neutral, cache).

**Out of scope:**

- Any finding-engine / briefing-engine / precedence change (cc-agent-C2).
- Karst/sinkhole and liquefaction rasters (follow-on; note them as staged, do not build this round).
- Paid sources (this is the free federal layer).
- MCP tool wraps for these (a later cc-agent-M follow-on; build the adapters first).

## Acceptance criteria

- The four adapters return real data on a covered geography (demonstrate SSURGO on a Central Texas parcel) and a neutral no-coverage pill off-coverage.
- Source attribution + freshness + cache on each; no red failures for absent layers.
- Registered in the adapter registry; disjoint from finding-engine files (no collision with the c2 clone).
- Tests: adapter suite green plus the new adapter tests.
- PR held for operator merge (do not merge).
- Verbatim verification artifacts in report (HR-8).

## Reporting

At break-point write to `P:\doc_repo\_inbox\` as `2026-06-07_legacy-design-tools_cc-agent-C_subsurface_data_layer.md`. Include atom refs touched, model used (if not default), PR URL + branch SHA, blockers verbatim.
