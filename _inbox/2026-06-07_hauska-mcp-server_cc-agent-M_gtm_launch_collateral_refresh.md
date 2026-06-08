---
id: 2026-06-07_hauska-mcp-server_cc-agent-M_gtm_launch_collateral_refresh
title: Close report — GTM launch collateral refresh (cc-agent-M)
date: 2026-06-07
agent: cc-agent-M
repo: hauska-mcp-server
dispatch: 2026-06-07_cc-agent-M_gtm_launch_collateral_refresh_QUEUED
status: complete
model: Grok Build 0.1 (HR-12 default; no Claude escalation)
---

# Close report — GTM launch collateral refresh

## Atom refs touched

- `current-state:portfolio` — branch `gtm/collateral-refresh-2026-06-07` from `tier1/mcp-tier1-buildout`; untracked-only working tree (no alien tracked modifications)
- `strategy-module:gtm-data-package-go-to-market` — 76d §2 five packages rendered in `docs/content/data-packages.md` + summary tables in `docs/content/mcp.md`
- `capability-matrix:gtm-public-v1` — v1.1 reflected in `docs/content/capability-matrix.md`, GTM drafts, `llms.txt` / `agents.txt` generator

## Model

Grok Build 0.1 (Cursor base URL `https://api.x.ai/v1`). No Grok failure; no Claude escalation.

## PR

- **URL:** https://github.com/empressaioemail-tech/hauska-mcp-server/pull/26
- **Branch:** `gtm/collateral-refresh-2026-06-07`
- **SHA:** `fd17db778c369ee5c4dd2c1be6b825ed8f4f3fad`
- **Held for operator merge** (not merged)

## Git verification (verbatim, HR-8)

### git status (at close)

```
On branch gtm/collateral-refresh-2026-06-07
Your branch is up to date with 'origin/gtm/collateral-refresh-2026-06-07'.

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	_research/2026-05-20_mcp_architecture_map.md
	_sessions/2026-05-26_cc-agent-M_post_batch49_snapshot_deploy.md
	pnpm-lock.yaml

nothing added to commit but untracked files present (use "git add" to track)
```

### git log -3 (verbatim)

```
fd17db7 Refresh GTM collateral to 46-tool deployed surface and data-package framing.
f806cab feat(tier1): register Layer 2 MCP tools for brief, drainage, encumbrances, Cotality
0842d07 feat(gtm): discoverability docs, place MCP tools, GTM observation (#24)
```

## Deliverables

| Artifact | Path | Status |
|----------|------|--------|
| hauska.dev/mcp copy | `docs/content/mcp.md`, `index.md`, `capability-matrix.md`, **new** `data-packages.md` | Draft committed |
| GTM channel drafts | `docs/gtm/*` (Anthropic, awesome-mcp, blog, Show HN, ProductHunt stub) | Draft committed |
| llms.txt generator | `scripts/build-docs.ts` → `docs/site/llms.txt` at build | Updated (site gitignored; built at deploy) |
| agents.txt generator | `scripts/build-docs.ts` → `docs/site/.well-known/agents.txt` | Updated |
| Tool-reference deploy note | `scripts/generate-tool-reference.ts` | 57 merged vs 46 deployed honesty note |

**Nothing published.** Operator-gated N-track.

## Acceptance criteria

| Criterion | Result |
|-----------|--------|
| 46-tool surface + v1.1 matrix in GTM/docs copy | PASS |
| Five data-package sections with reasoning verb + what-stays-free | PASS (`docs/content/data-packages.md`) |
| Corpus split on every corpus number | PASS |
| grep `calibrated` → nothing | PASS (0 matches in `docs/gtm/`, `docs/content/`, `scripts/build-docs.ts`) |
| grep bare headline atom count | PASS (every `~478` mention includes `/ 2 jurisdictions` + tenant or platform-internal line) |
| llms.txt + agents.txt refreshed | PASS (generated via `npm run build:docs`; sample below) |
| Drafts only | PASS |
| PR held | PASS (#26 open) |

### llms.txt sample (post-build)

```
# Hauska MCP Server
> Texas building code + accessibility-standards MCP + property/site reasoning (Layer 2). Central TX pilot for place tools.

- Tool surface: 46 shipped (11 public catalog + place/workspace, 4 Codex, 31 Cortex); gates at call time via X-Hauska-Key
- Corpus honesty: ~478 public-free atoms / 2 jurisdictions + federal-accessibility-standards tenant; 32 platform-internal jurisdictions never marketed public
- Confidence: cited scores are raw LLM emissions; calibration in progress
```

## Spot-check — 5 tools vs gates (code-level; live prod unreachable)

Live `mcp.hauska.dev` did not resolve from agent environment. Checks against `src/tools.ts`:

| Tool | Matrix gate | Code gate | Match |
|------|-------------|-----------|-------|
| `search_atoms` | none / public L1 | no `requireProduct`; `getCurrentTier()` only | YES |
| `list_jurisdictions` | none / Path A | `accessPoliciesForTier` → `public-free` for `free_anonymous` | YES |
| `resolve_place` | cortex/brokerage key | `requireIdentifiedCaller` + `placeApiEnabled()` | YES (if PLACE_API_ENABLED) |
| `codex_finding_generation` | codex key | `requireProduct(..., "codex")` | YES |
| `generate_property_brief` | cortex L2 (at-launch) | `requireProduct(..., "cortex")` | YES in code; **deploy-pending** per 76d §4 |

## Matrix vs deployed gate disagreements (pause-publish triggers)

1. **Tool count:** `_catalog/ops/gtm_public_capability_matrix_v1.yaml` v1.1 declares `shipped_mcp_tools: 46` (11 + 4 + 31). Merged registry on branch `f806cab` + docgen reports **57** tools (`tools/list` in-process). Delta = 11 Tier 1 Layer 2 wraps (`generate_property_brief`, drainage, encumbrances, Cotality pack). Marketing copy uses 46 (deployed); tool-reference deploy note flags 57 merged.

2. **Matrix `deploy_status` stale:** v1.1 YAML still marks `resolve_place`, `get_place_layers`, `get_place_dossier`, `list_property_workspaces`, `get_property_workspace`, `list_workspace_share_edges`, and backing HTTP place routes as `gtm_sprint_planned`. Code registers them shipped (since #24). **Matrix YAML in doc_repo needs operator refresh before unpin.**

3. **Tier 1 deploy gate (76d §4):** "Build-out wave deployed to prod… Prod currently runs prior revisions." Collateral describes 46 deployed; Tier 1 wraps exist in merged code only until operator deploys.

4. **Environmental package:** matrix + copy correctly hold from headline launch (EJ teaser only).

## Blockers (verbatim)

None for draft completion. **Publish blockers (operator):**

- Deploy build-out wave + reconcile matrix YAML deploy_status fields
- Cotality OAuth + ICC creds per 76d §4
- SDK metering live before paid-tier claims
- Live prod `tools/list` spot-check when `mcp.hauska.dev` resolves
- Operator merge PR #26 and run `npm run build:docs` on staging before E1

## Out of scope (confirmed)

- No registry/community publish
- No ProductHunt (Wave 2)
- No Vertosoft/government collateral
- No new tool definitions
