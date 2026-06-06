---
id: 2026-05-28_dispatch-C_engine_central-tx-corpus-icc
title: Dispatch C — Engine Central TX corpus + ICC (wave 2)
date: 2026-05-28
agent: cc-agent-E
repo: hauska-engine
kind: dispatch
related: [2026-05-28_central-tx-property-brief-scope, 75b_brief_coverage_v0, 73_partnerships]
blocked_on: ICC API credentials for wave 2.6
---

# Dispatch C — Engine Central TX corpus + ICC (wave 2)

You are **cc-agent-E**, single owner of `hauska-engine` for this run.

**Scope ref:** [`2026-05-28_central-tx-property-brief-scope.md`](2026-05-28_central-tx-property-brief-scope.md)  
**LDT consumer:** `lib/codes/src/centralTexasPilot.ts` keys sourced from `services/retrieval-api/corpus/snapshot.json`

## Model (HR-12)

Default: **Grok Build 0.1**. Escalate to Claude only on retry failure.

## Tasks

### C1 — Corpus registry export (unblocks LDT warmup)

1. Generate/maintain `central_texas_coverage.json` from corpus snapshot:
   - `jurisdiction_key`, display name, geocode aliases, atom count, eval scores if available.
2. Document operator export path: substrate → Neon `code_atoms` for each `engine_only` key LDT coverage endpoint lists.
3. Keep `snapshot.json` as source of truth; LDT `ENGINE_CORPUS_JURISDICTION_KEYS` should track snapshot on refresh.

**Engine keys in snapshot (2026-05-26):**  
`austin_tx`, `bastrop_county_tx`, `bastrop_tx`, `boerne_tx`, `brownsville_tx`, `cedar_hill_tx`, `converse_tx`, `copperas_cove_tx`, `crowley_tx`, `dripping_springs_tx`, `el_paso_tx`, `elgin_tx`, `georgetown_tx`, `grand_county_ut`, `hutto_tx`, `keller_tx`, `killeen_tx`, `lago_vista_tx`, `leander_tx`, `live_oak_tx`, `lockhart_tx`, `manor_tx`, `mission_tx`, `new_braunfels_tx`, `pasadena_tx`, `rollingwood_tx`, `round_rock_tx`, `saginaw_tx`, `san_antonio_tx`, `schertz_tx`, `sugar_land_tx`, `taylor_tx`, `watauga_tx`, `wimberley_tx`

### C2 — Brief law retrieval via substrate MCP (optional path for LDT)

- Expose search that LDT can call when `BRIEF_CODE_RETRIEVAL=mcp`.
- Jurisdiction tenant slug must match `jurisdiction_key` above.

### C3 — ICC L1 ingest (when credentials land)

1. Ingest ICC L1 on engine → `code-edition` atoms.
2. Wire **effective-code** resolution into brief prompt context (coordinate with LDT `retrieveAtomsForQuestion` or MCP handoff).

## Acceptance

- Operator can warm Round Rock / Austin / Plano-class keys into LDT Neon from substrate export.
- [`75b_brief_coverage_v0.md`](../75b_brief_coverage_v0.md) coverage table matches engine snapshot counts.
- ICC path documented even if creds not yet available.

## Do NOT

- Dallas city UDC (AmLegal partnership — blocked in LDT geocode).
- Paywall.

## Partnership rule (doc only — wave 0e)

City/county MOUs add **Plane E/B enrichment APIs into `property-workspace` place node only** — never a parallel code path. Logged in [`73_partnerships.md`](../73_partnerships.md) by planner.

## Report back

`P:/doc_repo/_inbox/2026-05-28_hauska-engine_cc-agent-E_central-tx-corpus-icc_close.md`

Include export artifact path, snapshot diff if keys changed, ICC doc path, blockers verbatim.
