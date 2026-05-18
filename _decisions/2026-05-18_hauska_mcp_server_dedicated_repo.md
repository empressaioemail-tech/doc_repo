---
decision_id: 2026-05-18_hauska_mcp_server_dedicated_repo
date: 2026-05-18
owner: nick
status: active
related_canonical: [50_hauska_mcp_server, 51_substrate_v1_sprint, 80_adrs/adr_008_engine_factor_out, 80_adrs/adr_018_atom_contract_substrate_layer, _decisions/2026-05-18_atom_contract_hauska_namespace, CLAUDE.md]
---

## Decision

Migrate the Hauska MCP Server starter implementation from `doc_repo/MCP Server/` (currently gitignored) to a dedicated `empressaioemail-tech/hauska-mcp-server` GitHub repo. Scaffold the new repo as empty starter; do not bolt MCP-server code into any existing product repo. Nick creates the repo; agent then deletes local files in doc_repo and updates the scaffold-location pointer in [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md).

## Context

The CLAUDE.md open-items list has flagged the MCP server code migration as pending: `MCP Server/` directory in doc_repo holds a starter implementation (auth.ts, hauska-client.ts, index.ts, tools.ts, package.json) gitignored locally until a proper repo home exists. [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) names a dedicated `hauska-mcp-server` repo as the v1 execution target. Two recons today (Hauska SDK; legacy-design-tools) confirmed zero production MCP-server code exists anywhere in the portfolio: legacy-design-tools has no `@modelcontextprotocol/*` dependency and an api-server that is a plain Express REST app; the Hauska SDK has no MCP code either. The earlier-in-conversation belief that the current MCP server lived in legacy-design-tools turned out to be wrong; the starter in doc_repo is the only MCP-server-shaped artifact in the portfolio.

The paired decision today renames the M2-C atom-contract extraction target to `@hauska/atom-contract` per [ADR-018](../80_adrs/adr_018_atom_contract_substrate_layer.md). The MCP server consumes the atom contract directly. Giving the MCP server a real repo home now (before M2-C extraction lands) means the contract package and the MCP server can extract into clean, coordinated targets rather than the MCP server getting bolted into whichever repo is convenient at extraction time.

## Structural commitment check

Premortem-check 2026-05-18: five green plus one yellow on the focus-queue rule (half-day operational cost of repo creation and file move). Yellow is operational only, not load-bearing; deferring is more expensive than absorbing the half-day now. Catalog-thesis-check 2026-05-18: all aligned. Direct expression of ADR-008 brand placement (MCP server is Hauska commercial layer). Direct execution of the [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) plan.

## Reasoning

Three substantive points. First, dependency coordination. Once M2-C extracts `@hauska/atom-contract` as a published package, the MCP server is its first significant external consumer. Locating the MCP server in a dedicated repo means the contract-package consumer story can be exercised cleanly from day one: the MCP server `package.json` lists `@hauska/atom-contract` as a dependency, no monorepo workspace cheat, no in-source import. This validates the contract-as-published-substrate story before any product takes the dependency.

Second, brand and tier placement. The MCP server is the public Layer-1 surface for the Hauska catalog per [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) and [`29_mcp_surface_tier_model.md`](../29_mcp_surface_tier_model.md). A dedicated repo at `empressaioemail-tech/hauska-mcp-server` (matching the same `empressaioemail-tech` org convention used for `hauska-sdk` and the planned `hauska-engine` per ADR-008) puts the repo name in agent-developer view as `hauska-mcp-server`, matching the brand and the substrate placement. The repo will migrate with the rest of the Hauska org content if the Hauska Inc. GitHub org migration completes per the P3 roadmap entry in ADR-008.

Third, cheapest moment. The starter has no production consumers. Moving four TypeScript files and a package.json into a new empty repo is half a day of operator work. Doing it after M2-C extraction, after starter consumers exist, after the doc_repo gitignore has lived in place for additional months, is strictly more expensive in every dimension.

## Reversal criteria

Revisit if (a) Hauska Inc. corporate structure or GitHub org migration timing per ADR-008 reveals a repo-ownership blocker that makes a separate repo at `empressaioemail-tech/hauska-mcp-server` premature (for example, the IP attorney memo recommends keeping all Hauska-layer code in one repo until the org migration completes); or (b) the M2-C extraction sprint reveals that the atom contract and the MCP server are structurally better co-located in a single Hauska-substrate monorepo than in peer repos. Case (b) is unlikely given the recon evidence (the SDK is already a separate repo and the contract has zero SDK dependency), but is the only realistic structural reversal path.

## Dependencies

Depends on [`_decisions/2026-05-18_atom_contract_hauska_namespace.md`](2026-05-18_atom_contract_hauska_namespace.md): the MCP server's import target depends on the renamed contract package; the two decisions extract in coordinated form. Unblocks [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) Phase 1 (Backend coupling) by giving the MCP server starter a real repo home before Phase 1 work begins. Awaits Nick action to run `gh repo create empressaioemail-tech/hauska-mcp-server --private` (or web UI equivalent) before the local file-move can complete.

## Counterparties

Internal: Nick (operator, creates the repo). Agent (deletes local files in doc_repo, updates scaffold-location pointer in [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md), surfaces the new repo URL into [`00_current_state.md`](../00_current_state.md) Cross-cutting watch list once the migration completes).

External: future consumers of the Hauska MCP Server (MCP-capable agents on Claude Desktop, Claude Code, Cursor, custom Anthropic SDK agents, PropTech embedders per [`50:67-72`](../50_hauska_mcp_server.md#L67-L72)). The dedicated repo is what they will discover when finding the server in the Anthropic MCP directory or `awesome-mcp-servers` listings.
