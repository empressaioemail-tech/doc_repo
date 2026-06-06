---
id: 2026-05-28_cc-agent-M_gtm_engine_discoverability
title: Dispatch — GTM engine Track M (discoverability + MCP place tools)
date: 2026-05-28
agent: cc-agent-M
repo: hauska-mcp-server
kind: dispatch
related: [76b_gtm_engine_polish_sprint, _decisions/2026-05-28_gtm_engine_polish_sprint, 50_hauska_mcp_server, 16_commercialization_roadmap, _catalog/ops/gtm_public_capability_matrix_v1.yaml, _dispatches/2026-05-28_cc-agent-C_gtm_engine_observation_place_api]
---

# Lane M — GTM engine discoverability + MCP read surface

You are **cc-agent-M**, owner of `hauska-mcp-server` for this dispatch.

**Sprint:** [`76b_gtm_engine_polish_sprint.md`](../76b_gtm_engine_polish_sprint.md)  
**Depends on:** cc-agent-C place HTTP routes (merge before wiring `get_place_*` tools to prod).

## Model (HR-12)

Default: **Grok Build 0.1**. **grok-code-fast-1** for copy-only passes. Escalate to Claude on retry failure.

## Atoms to resolve

- `current-state:portfolio`
- `strategy-module:gtm-engine-polish-sprint`
- `hauska-product:hauska-mcp-server`

## Read first

1. [`76b_gtm_engine_polish_sprint.md`](../76b_gtm_engine_polish_sprint.md) — exit E1–E5, E9–E11
2. [`_catalog/ops/gtm_public_capability_matrix_v1.yaml`](../_catalog/ops/gtm_public_capability_matrix_v1.yaml) — docs must match
3. [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) — one server, attribution, ICP
4. [`_dispatches/2026-05-21_cc-agent-M_commercialization_streams_2c_2d.md`](2026-05-21_cc-agent-M_commercialization_streams_2c_2d.md) — autonomy model (draft GTM, do not publish)
5. [`44_mcp_cortex_architecture_map.md`](../44_mcp_cortex_architecture_map.md) — cortex-api bearer path

## Run posture

- Self-merge when CI green; self-deploy `hauska-mcp-server` Cloud Run.
- **Do not publish** HN, blog, directory, or social. Draft under `docs/gtm/`.
- **Do not** add Stripe or paid-tier signup.

## Scope — in

### M1 — Docs site (`hauska.dev/mcp`)

- Canonical landing: **Texas building code MCP + property workspace read API** (not full country dossier).
- Pages: home, quickstarts (Claude Desktop, Claude Code, Cursor), tool catalog (grouped), attribution, commercial-use, privacy (training-data disclosure), link to capability matrix YAML rendered as table.
- Redirect or host `llms.txt` and `.well-known/agents.txt` at **site root** (`hauska.dev`), not only under `/mcp`.
- Coverage page **embed or link** to `GET /api/brokerage/v1/coverage` (C track hosts API; you consume URL from env `COVERAGE_API_URL`).

### M2 — Tool description audit (all 40 tools)

- Each description: purpose, example `jurisdiction_key`, tier (public / product-gated), typical failure modes.
- Align names with [`gtm_public_capability_matrix_v1.yaml`](../_catalog/ops/gtm_public_capability_matrix_v1.yaml).

### M3 — Registry + example agent (`docs/gtm/`)

- `anthropic_mcp_directory/` — submission package per Anthropic current template.
- `awesome_mcp_servers_pr.md` — PR body + server blurb.
- `blog_mcp_v1_draft.md`, `show_hn_draft.md`, `producthunt_draft.md` — stub channel paragraphs pending `gtm_launch_channel_plan_v1.yaml`.
- **Example agent:** public GitHub repo or gist — multi-step: `search_atoms` → `get_atom` → `resolve_place` → `get_place_dossier`.

### M4 — New MCP tools (read-only, same process)

Wire to cc-agent-C routes via `CORTEX_API_URL` + service bearer (same pattern as existing `cortex_*` tools):

| Tool | Backend |
|------|---------|
| `resolve_place` | `POST /api/brokerage/v1/place/resolve` |
| `get_place_layers` | `GET /api/brokerage/v1/place/:placeKey/layers` |
| `get_place_dossier` | `GET /api/brokerage/v1/place/:placeKey/dossier` |
| `list_property_workspaces` | existing brokerage workspace API |
| `get_property_workspace` | existing |
| `list_workspace_share_edges` | existing |

Product gate: use **brokerage** or **cortex** key per existing `requireProduct` pattern; document which key unlocks place tools in docs.

### M5 — MCP usage logging (E5/E6)

Extend structured logs (Stream 2C shape): `tool`, `key_hash`, `is_external` (true when key not in internal allowlist env `HAUSKA_INTERNAL_KEY_HASHES`), `jurisdiction_key`, `error_class`, `latency_ms`, `atom_ids_returned` count.

Document Cloud Logging filter in close report for operator “first external caller” query.

## Scope — out

- Place API implementation (cc-agent-C)
- `gtm_events` migration (cc-agent-C)
- Extension UI (cc-agent-C)
- Publishing launch posts
- Paid tier / Stripe

## Acceptance criteria

- [ ] `https://hauska.dev/mcp` returns docs (or documented redirect from `mcp.hauska.dev/docs` with operator DNS note).
- [ ] `curl -s https://hauska.dev/llms.txt` includes MCP URL, ICP, coverage link.
- [ ] All 40 tool descriptions updated; CI green.
- [ ] New tools registered; MCP Inspector script passes against staging/prod for `resolve_place` + `get_place_dossier` on Cedar Hill or Bastrop pilot coords.
- [ ] `docs/gtm/` contains directory + awesome-mcp + blog/HN drafts (unpublished).
- [ ] Example agent URL in docs.
- [ ] External-caller log filter documented with sample query.

## Tests

- `pnpm test` (or repo standard) green.
- Manual MCP Inspector: public catalog tool + one place tool with test key.
- Cross-client: Cursor config snippet in docs verified once.

## Report back

`P:/doc_repo/_inbox/2026-05-28_hauska-mcp-server_cc-agent-M_gtm_engine_discoverability_close.md`

Include: PR URLs, SHAs, deploy revision, docs URLs, example agent URL, log filter string, blockers verbatim.
