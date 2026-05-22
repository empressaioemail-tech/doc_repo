---
id: 2026-05-21_cc-agent-AC_qa17_cortex_substrate_integration
title: Dispatch — cc-agent-AC QA-17 Cortex substrate integration (framework-proving pass)
date: 2026-05-21
agent: cc-agent-AC
repo: legacy-design-tools
kind: dispatch
related: [43_cortex_qa_backlog, 44_mcp_cortex_architecture_map, 28_mcp_first_product_design, 50_hauska_mcp_server, 11_roadmap, 20_agent_operating_rules, CLAUDE.md]
---

# cc-agent-AC dispatch — QA-17 Cortex substrate integration (framework-proving pass)

You are cc-agent-AC, reassigned from hauska-atom-contract steady-state to `legacy-design-tools` for QA-17. Work from a fresh `legacy-design-tools` clone, separate from cc-agent-C's clone. cc-agent-C is running the Cortex QA close-out in parallel against its own clone; you must not share a working tree.

## Why this exists

QA-17 in [`43_cortex_qa_backlog.md`](../43_cortex_qa_backlog.md): the Cortex Code Library lists only 2 of 5 ingested jurisdictions. Root cause per [`44_mcp_cortex_architecture_map.md`](../44_mcp_cortex_architecture_map.md): the Cortex app is not wired to the Hauska substrate; the Code Library reads cortex-prod-local `code_atoms` tables. Connecting it is the Cortex MCP retrofit per [`28_mcp_first_product_design.md`](../28_mcp_first_product_design.md).

This dispatch is the framework-proving first pass. The goal is not deep coverage. The goal is to prove the cortex-api to Hauska-substrate wiring works end to end at the current small scale, so the architecture is de-risked before the corpus deepens.

## Scope, this pass

Wire cortex-api to consume the Hauska substrate, and make the Code Library page read the live substrate catalog.

- cortex-api gains a client to the Hauska substrate. Recommended: consume the deployed Hauska MCP server (`https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app`) with an authenticated Cortex product key, so Cortex dogfoods the same MCP surface external agents use, per doc 28. Consuming the retrieval API directly is the alternative; pick one and document the choice in your session summary.
- An authenticated key is needed for the Code Library to see the platform-internal jurisdictions (Bastrop County, Elgin, Hutto), not just the two public-free ones. Minting a Cortex product key is a prerequisite; the MCP server has an admin key-issuance endpoint. Coordinate with the operator to mint it.
- The Code Library page reads the substrate catalog. Success criterion: the Code Library lists all five substrate jurisdictions with real atom counts.

## Out of scope, fast-follow

- The in-app-agent catalog tool (`chat.ts`). cc-agent-C is editing `chat.ts` for QA-23; adding the catalog tool there waits until that work has landed, to avoid a shared-file collision.
- QA-20 background code collection for uningested jurisdictions. Separate mechanism, fast-follow once this wiring is proven.

## Run posture

Operator-supervised, not maximum-autonomy. Open PRs for review. Do not self-deploy cortex-api.

## Workspace provisioning and ownership

**Amended 2026-05-21:** the dedicated clone this dispatch assumed did not exist on disk; cc-agent-AC surfaced the blocker per the stop-and-surface clause rather than working in cc-agent-C's tree. Provisioning is now explicit.

cc-agent-AC owns a dedicated `legacy-design-tools` clone for this dispatch, separate from cc-agent-C's. It does not yet exist — create it as your first step:

```
git clone https://github.com/empressaioemail-tech/legacy-design-tools P:\ldt-ac-qa17
```

Branch your work under `qa-17/*` from `origin/main`. Do not work in `P:\legacy-design-tools` — that is cc-agent-C's tree, currently on `qa-22/site-context-reliability` with cc-agent-C's uncommitted scratch.

cc-agent-C is running QA-22 Part 1 (site-context layer reliability — the server-side adapter-runner timeout and the site-context layer components). You are on the cortex-api substrate client and the Code Library page. Those are distinct Cortex surfaces, and because you work a separate clone, any incidental file overlap surfaces only as a PR-time merge conflict, never a working-tree collision. If QA-17 turns out to need a file QA-22 is also editing, flag it to the planner. If you enter a working directory and see another agent's uncommitted changes, stop and surface.

## Reporting

At every session break-point, write your session summary and any decision-relevant finding to `P:\doc_repo\_inbox\` as `<date>_legacy-design-tools_cc-agent-AC_<topic>.md`. Do not commit to the doc repo or edit anything outside `_inbox/`. Keep committing the original in your own repo. This is HR-11 per [`20_agent_operating_rules.md`](../20_agent_operating_rules.md).
