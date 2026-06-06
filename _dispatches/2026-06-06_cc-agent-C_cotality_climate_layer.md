---
id: 2026-06-06_cc-agent-C_cotality_climate_layer
title: Dispatch — Cotality climate/hazard brief layer (hydrology v1)
date: 2026-06-06
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [00_current_state, 77b_cotality_integration_strategy, 40d_cortex_site_context_sprint, 01a_atom_conventions, 20_agent_operating_rules, 76c_operator_master_next_steps, _decisions/2026-06-06_cotality_parcel_provider, _research/2026-05-30_cotality_property_brief_recon, _inbox/2026-06-06_legacy-design-tools_cc-agent-C_cotality_adapter_scaffold]
---

# Cotality climate/hazard brief layer (hydrology v1)

You are **cc-agent-C**, the single owner of `legacy-design-tools` (cortex-api) for this run.

Increment 2 of the Cotality integration sequence ([`77b_cotality_integration_strategy.md`](../77b_cotality_integration_strategy.md) §2, §6). This is the cited hydrology/climate v1 answer: parcel flood/peril/precipitation risk with forward scenarios, the first half of the hydrology blend that the Cortex site simulator will later consume as forcing.

## Model (HR-12)

Default: **Grok Build 0.1**. Use **grok-code-fast-1** for narrow tasks. Escalate to Claude only if Grok fails after retry; log it.

Cursor: base URL `https://api.x.ai/v1`.

## Atoms to resolve

- `current-state:portfolio` — fleet status, parcel-adapter landing, blockers
- `briefing-source:cotality` — the parcel/zoning adapter shape this extends
- `briefing-source:fema` — the existing flood layer; do NOT double-bill (FEMA stays free-baseline flood, Cotality climate is premium forward-looking)
- `parcel-briefing:round_rock_tx` — the brief that consumes the layer

## Read first (after atoms)

1. [`_inbox/2026-06-06_legacy-design-tools_cc-agent-C_cotality_adapter_scaffold.md`](../_inbox/2026-06-06_legacy-design-tools_cc-agent-C_cotality_adapter_scaffold.md) — parcel adapter you extend
2. [`77b_cotality_integration_strategy.md`](../77b_cotality_integration_strategy.md) §2 (hydrology blend), §7 (gating), §8 (don't double-bill flood)
3. [`_research/2026-05-30_cotality_property_brief_recon.md`](../_research/2026-05-30_cotality_property_brief_recon.md) §6 license risks
4. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-3, HR-8, HR-11

## Gate (entitlement — read before starting)

Cotality **Climate Risk Analytics is a premium SKU, not in the self-serve 30-day trial** (trial = property-data + AVM calls only). This layer therefore gates on the **MCP eval / Climate Risk Analytics entitlement** from the Cotality sales track (Hannah call), not the trial key. **Build the adapter + normalization + tests against the documented response shape and a recorded fixture now; live smoke waits for the entitled climate key.** Confirm entitlement before attempting a live call.

## Workspace ownership

- Clone: `P:\legacy-design-tools`
- Branch prefix: `cortex/` (stack on / branch from the parcel adapter branch)
- One agent per clone; refuse alien HEAD or uncommitted state; report verbatim `git status` + `git log -3`

## Scope

**In scope:**
- `cotality:climate` adapter under `lib/adapters/src/national/`, same site-context port pattern, CLIP-joined.
- Fields: per-peril risk (inland flood, storm surge, wildfire, wind, hail; chronic: extreme precipitation, heat, drought), parcel Average Annual Loss (AAL), Probable Maximum Loss where available, and the forward-scenario trend (current + 2030/2040/2050 under the warming pathways the entitlement returns). Capture extreme-precipitation intensity explicitly — it is the forcing input the Cortex simulator will consume (see 40d re-scope).
- Same `COTALITY_API_KEY` (or climate-specific key) gate + clean fallback, cache/logging/error taxonomy as the parcel adapter.
- Unit tests + recorded fixture from the documented Climate Risk Analytics response; eligibility contract update; package export.

**Out of scope:**
- Removing or overriding the FEMA flood layer — FEMA stays the free-baseline flood narrative; Cotality climate is the premium forward-looking layer. Do not double-count flood in the brief.
- Consumer-extension display before recon §6 license terms cleared (PUC) — premium/dev tier only.
- Insurance-quote framing — informational, source-cited risk only.
- The simulator coupling itself (that is Cortex 40d 2D.2/2D.3, cc-agent-R) — this dispatch only exposes the climate data the simulator will later ingest.

## Acceptance criteria

- Adapter compiles + registers; shape contract intact; FEMA layer untouched.
- No key / no entitlement → clean fallback, zero network.
- Unit tests + fixture green against the documented Climate Risk Analytics shape; extreme-precipitation intensity is a first-class field in the normalized output.
- Live smoke command prepared for when the entitled climate key is mounted (mirror the parcel dispatch handoff).
- PR held for operator merge.
- Verbatim verification artifacts (HR-8).

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-06_legacy-design-tools_cc-agent-C_cotality_climate_layer.md`. Include atom refs, model used, PR URL + SHA, the precip-forcing field shape (for 40d handoff), entitlement status, and blockers verbatim.
