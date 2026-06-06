---
id: 2026-06-06_cc-agent-C_cotality_property_layer
title: Dispatch — Cotality property (Carfax-depth) brief layer
date: 2026-06-06
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [00_current_state, 77b_cotality_integration_strategy, 01a_atom_conventions, 20_agent_operating_rules, 76c_operator_master_next_steps, _decisions/2026-06-06_cotality_parcel_provider, _research/2026-05-30_cotality_property_brief_recon, _inbox/2026-06-06_legacy-design-tools_cc-agent-C_cotality_adapter_scaffold]
---

# Cotality property (Carfax-depth) brief layer

You are **cc-agent-C**, the single owner of `legacy-design-tools` (cortex-api) for this run.

Increment 3 of the Cotality integration sequence ([`77b_cotality_integration_strategy.md`](../77b_cotality_integration_strategy.md) §6). Builds on the merged parcel/zoning adapter (branch `cortex/cotality-adapter-scaffold`, commit `e5c0daa`). This is the "Carfax depth" the operator wants leveraged: owner, transaction history, tax, value, structure characteristics.

## Model (HR-12)

Default: **Grok Build 0.1**. Use **grok-code-fast-1** for narrow tasks. Escalate to Claude only if Grok fails after retry; log it.

Cursor: base URL `https://api.x.ai/v1`.

## Atoms to resolve

- `current-state:portfolio` — fleet status, parcel-adapter landing, blockers
- `briefing-source:cotality` — the parcel/zoning adapter shape this extends (`lib/adapters/src/national/cotality.ts`)
- `parcel-briefing:round_rock_tx` — the brief that consumes the layer (test address 1904 Heathwood Cir)

## Read first (after atoms)

1. [`_inbox/2026-06-06_legacy-design-tools_cc-agent-C_cotality_adapter_scaffold.md`](../_inbox/2026-06-06_legacy-design-tools_cc-agent-C_cotality_adapter_scaffold.md) — the parcel adapter you extend; endpoint/normalization/field-gap notes
2. [`77b_cotality_integration_strategy.md`](../77b_cotality_integration_strategy.md) §3 (Carfax depth), §7 (tier/license gating)
3. [`_research/2026-05-30_cotality_property_brief_recon.md`](../_research/2026-05-30_cotality_property_brief_recon.md) §4 field map
4. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-3, HR-8, HR-11

## Workspace ownership

- Clone: `P:\legacy-design-tools`
- Branch prefix: `cortex/` (stack on `cortex/cotality-adapter-scaffold` or branch from it once merged)
- One agent per clone; refuse alien HEAD or uncommitted state; report verbatim `git status` + `git log -3`

## Gate

The self-serve 30-day trial grants property-data calls (100/day) + AVM calls (25/day), so the Carfax attributes are **in-trial-scope** and this layer is live-smokeable on the trial key (unlike the climate layer, which needs the Climate Risk Analytics entitlement from the eval). Proceed once: parcel adapter PR merged (or branch from its tip), and the trial key + corrected endpoint/response shape from the parcel smoke are confirmed.

## Scope

**In scope:**
- `cotality:property` adapter under `lib/adapters/src/national/`, same site-context port pattern as the parcel/zoning adapters, CLIP-joined to the parcel.
- Fields: owner name, last sale (date/price), transaction history summary, tax (assessed value, annual amount, year), AVM value + confidence, structure characteristics (acres/lot size, sqft, year built, structure type).
- Same `COTALITY_API_KEY` gate + clean fallback (absent key → `no-coverage`, no network) and the cache/logging/error taxonomy the parcel adapter established.
- Unit tests + recorded fixture; eligibility contract update for the new adapter; package export entry.
- One-address smoke on 1904 Heathwood Cir when the trial key is mounted; record which attributes the trial tier actually returns.

**Out of scope:**
- Consumer-extension display of any Cotality property fields before recon §6 license terms are cleared (PUC). Keep behind the dev/internal tier; `brokerageSiteContext.ts` extension path unchanged.
- AVM/valuation framing as a regulated appraisal — informational, source-cited only.
- Climate layer (separate dispatch), MCP federation, Trestle MLS, bulk/Snowflake.

## Acceptance criteria

- Adapter compiles + registers; overlays/brokerageSiteContext shape contract intact.
- No key → clean fallback, zero network.
- With trial key: smoke returns the available property attributes for the test address; record exactly which fields the trial tier returns vs withholds (entitlement map for the operator).
- Existing suite green; new unit test + fixture green.
- PR held for operator merge.
- Verbatim verification artifacts (HR-8).

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-06_legacy-design-tools_cc-agent-C_cotality_property_layer.md`. Include atom refs, model used, PR URL + SHA, the trial-tier attribute entitlement map, and blockers verbatim.
