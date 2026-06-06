---
decision_id: 2026-05-29_property_brief_data_backlog_priorities
date: 2026-05-29
owner: nick
status: active
related_canonical: [75c_property_brief_data_backlog, 90_runbooks/partner_outreach_brief_wave, 73_partnerships]
---

## Decision

Execute Property Brief data completeness in two lanes: **(1) non-partner engineering today** (federal layers, Neon warmup exports, encumbrance upload path) and **(2) partner outreach 2026-05-30** (General Code, ICC, county clerk, Bastrop ops, one HOA pilot), tracked in [`75c_property_brief_data_backlog.md`](../75c_property_brief_data_backlog.md).

## Context

Central TX engine corpus is strong on Plane A for ~34 Municode cities but brief UX is thin because most keys are `engine_only`, brief site context is FEMA+Regrid only, and HOA/private restrictions have no bulk feed. Valerie pilot needs honest, cited layers—not more jurisdiction count alone.

## Structural commitment check

1. Sell reasoning, not data — green; all layers carry provenance in brief.
2. Partnership-first — green for city ops and recorder; federal/Regrid baselines explicitly out of scope for scrape refusal.
3. Cost per jurisdiction — green for Neon warmup (reuse existing atoms); new ingest gated.
4. MCP-first — green; warmup + MCP retrieval path prioritized over UI-only.

## Reasoning

Broker-visible wins this week are **code in brief** (Neon warmup), **environmental depth** (federal adapters already built for Cortex), and **HOA path honesty** (upload R4). General Code and ICC unlock the largest remaining Plane A holes without violating partnership policy. Scored backlog prevents thrash between engine ingest and brief product work.

## Reversal criteria

- If Neon warmup cannot complete for three pilot keys within one operator session, defer Austin-sized loads and demo on `cedar_hill_tx` + `round_rock_tx` only.
- If General Code declines integrator API, maintain partnership-track honesty in `75b`; do not scrape eCode360.
- If federal adapters blow 30s brief SLA, ship progressive layers (FEMA+Regrid first, federal async v2).

## Dependencies

- PR #134 merge + migration `0030` (place snapshots).
- ICC credentials (PB-102) independent of P0 federal layers.

## Counterparties

General Code, ICC, county clerks, Bastrop city, one HOA pilot (operator-selected).
