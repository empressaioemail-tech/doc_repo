---
id: 2026-06-06_cc-agent-C_cotality_adapter_scaffold
title: Dispatch — Cotality parcel/zoning adapter scaffold on the Regrid port
date: 2026-06-06
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [00_current_state, 00d_portfolio_roadmap_reference, 01a_atom_conventions, 20_agent_operating_rules, 76c_operator_master_next_steps, 75c_property_brief_data_backlog, _decisions/2026-06-06_cotality_parcel_provider, _research/2026-05-30_cotality_property_brief_recon]
---

# Cotality parcel/zoning adapter scaffold

You are **cc-agent-C**, the single owner of `legacy-design-tools` (cortex-api) for this run.

## Model (HR-12)

Default: **Grok Build 0.1** (multi-file / agentic). Use **grok-code-fast-1** for narrow, speed-only tasks. Escalate to Claude only if Grok fails after retry; log the escalation in your session summary.

Cursor: base URL `https://api.x.ai/v1`.

## Atoms to resolve

Resolve these before reading full canonical docs (catalog: [`01a_atom_conventions.md`](../01a_atom_conventions.md)):

- `current-state:portfolio` — fleet status, blockers
- `briefing-source:regrid` — the existing national parcel/zoning adapter shape this must mirror
- `parcel-briefing:round_rock_tx` — the brief that consumes the site-context layers (test jurisdiction)

## Read first (after atoms)

1. [`_decisions/2026-06-06_cotality_parcel_provider.md`](../_decisions/2026-06-06_cotality_parcel_provider.md) — the decision and implementation posture
2. [`_research/2026-05-30_cotality_property_brief_recon.md`](../_research/2026-05-30_cotality_property_brief_recon.md) — §2b API lanes, §3 integration paths, §4 field mapping, §6 license risks
3. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-3, HR-8, HR-11

## Workspace ownership

- Clone: `P:\legacy-design-tools`
- Branch prefix: `cortex/` (e.g. `cortex/cotality-adapter-scaffold`)
- One agent per clone per [`agent_workspace_hygiene`](../90_runbooks/agent_workspace_hygiene.md)
- Refuse alien HEAD or uncommitted state; report verbatim `git status` + `git log -3`

## Scope

**In scope:**
- Build `cotality:parcels` and `cotality:zoning` adapters under `lib/adapters/src/national/` (sibling to the Regrid adapter), emitting the **same** `siteContext.layers[]` shape so `overlays.ts` and `brokerageSiteContext.ts` consume them unchanged (recon §4 contract: GeoJSON Polygon on `payload.parcel.geometry` / `payload.zoning.geometry`).
- Map fields against the CoreLogic/Cotality developer-portal API docs (https://developer.corelogic.com) — property characteristics, parcel, zoning, AVM. Mirror the Regrid field map; carry `CLIP` as the stable parcel id (Regrid `ll_uuid` analog).
- Gate live calls behind `COTALITY_API_KEY` (30-day trial key) read from Secret Manager; provider falls back to Regrid when the key is absent so both apps stay testable.
- One-address smoke on **1904 Heathwood Cir, Round Rock, TX 78664** when the trial key is mounted.

**Out of scope:**
- Removing or disabling the Regrid adapter (it stays as interim fallback).
- The MCP federation path (Hauska MCP → Cotality MCP) — that is the production track, separate dispatch after the MCP eval lands.
- Trestle MLS and bulk/Snowflake paths.
- Any consumer-extension display of Cotality fields before license terms are confirmed (recon §6) — keep behind the dev/public-tier gate.

## Acceptance criteria

- Adapters compile and register on the national-adapter port; `overlays.ts` / `brokerageSiteContext.ts` unchanged.
- With no `COTALITY_API_KEY`: provider cleanly falls back to Regrid, no errors.
- With trial `COTALITY_API_KEY`: smoke on the test address returns `cotality:parcels` / `cotality:zoning` = `ok` with a parcel polygon + zoning where Regrid returned `no-coverage`; record vintage/refresh date.
- Tests: existing adapter test suite green; add a Cotality adapter unit test with a recorded fixture.
- PR held for operator merge (do not merge).
- Verbatim verification artifacts in report (HR-8).

## Reporting

At session break-point, write to `P:\doc_repo\_inbox\` as `2026-06-06_legacy-design-tools_cc-agent-C_cotality_adapter_scaffold.md`.

Include:
- Atom refs touched
- Model used (if not default Grok Build 0.1)
- PR URL + branch SHA
- Field-map gaps (any Brief need not satisfiable from the trial tier)
- Blockers verbatim
