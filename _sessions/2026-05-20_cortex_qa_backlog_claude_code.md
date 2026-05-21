---
id: 2026-05-20_cortex_qa_backlog_claude_code
title: Session — Cortex QA backlog opened (post-cutover verification window); WS-A/B/D delivered
date: 2026-05-20
agent: planner
repo: docs
session_type: planning
rolled_up: false
rolled_up_into: []
related:
  - 43_cortex_qa_backlog
  - 44_mcp_cortex_architecture_map
  - 90_runbooks/legacy_design_tools_replit_to_cloud_run_cutover
  - _sessions/2026-05-20_cutover_orientation_and_workflow_pr_claude_code
---

## TL;DR

Opened the Cortex QA backlog as a running list of the operator's post-cutover QA findings. 15 items triaged into five workstreams (WS-A cutover-tail data integrity, WS-B UI cleanup, WS-C in-app agent, WS-D architecture doc, WS-E strategy). Four dispatches filed. WS-A and WS-B executed by cc-agent-C and merged via legacy-design-tools PR #55. WS-D delivered as new doc 44, the MCP and Cortex architecture map, synthesized from code-verified recon by cc-agent-M (hauska-mcp-server) and cc-agent-C (legacy-design-tools WSA.1 audit). A forensic dispatch (cc-agent-C2) confirmed the reported un-attributed working-tree changes were a CRLF phantom diff: an empty stash, no data lost. Net new canonical docs: 43 (QA backlog), 44 (architecture map). QA-04 is the lone open WS-A item; WS-C is reframed as the Cortex MCP retrofit (roadmap-scale); WS-E (QA-06, QA-10) are separate conversations.

## What was done

- Created [`43_cortex_qa_backlog.md`](../43_cortex_qa_backlog.md): the running Cortex QA backlog. The operator fed 14 QA items from a post-cutover QA pass; the planner triaged them into a 15-item register (QA-15 surfaced by WSB.5) across five workstreams, with standing findings and strategy gates.
- Filed four dispatches at `_dispatches/2026-05-20_*`: WS-A cutover-tail audit and fix (cc-agent-C), WS-B UI cleanup batch (cc-agent-C), QA-05 architecture-map input (cc-agent-M), and working-tree forensics (cc-agent-C2).
- WS-A and WS-B were executed by cc-agent-C and merged via legacy-design-tools PR #55. The branch was re-cut off origin/main after a 12-commit-stale checkout was caught; CI caught and fixed one regression (the snapshots BIM viewer hidden once WSB.3 gated the BIM panel on a snapshot).
- Created [`44_mcp_cortex_architecture_map.md`](../44_mcp_cortex_architecture_map.md): the QA-05 deliverable, synthesized from cc-agent-M's hauska-mcp-server recon and cc-agent-C's WSA.1 audit. One unified diagram, six headline facts, component breakdown.
- Reconciled doc 43 against the WSA.1 audit: Finding 2 settled, WS-A statuses corrected (QA-13 was not a fix; corrected to diagnosed).

## What was learned (changes to ground truth)

- MCP topology: one hauska-mcp-server process, not two. hauska-codex and hauska-cortex are two Cursor entries on the same `:3000` process, distinguished only by key. 40 tools are registered for every caller; the 31-plus-4 split is the count each product key can call.
- The MCP-to-Cortex integration is one-directional. hauska-mcp-server calls into cortex-api's L-surface over a SERVICE_API_KEY bearer; cortex-api makes no outbound call to the MCP server or hauska-engine. Cortex feeds the MCP layer, it does not consume it.
- The Hauska SDK is consumed nowhere. The MCP server imports `@hauska/atom-contract` type-only; cortex-api still uses `@workspace/empressa-atom` (the contract migration remains a tracked can-kick).
- The Code Library reads cortex-prod-local `code_atoms` tables, never connected to the Hauska substrate. Grand County showing 290 atoms matching the substrate corpus is coincidental. Elgin and Bastrop County are absent because the Cortex jurisdiction registry has only two entries.
- The Code Library warmup 403 is by-design: the production session auth stub never grants `audience: internal`, so the "Warm up now" button is structurally dead on Cloud Run.
- Re-triage: QA-13 (Code Library substrate gap) and QA-07 (in-app agent awareness and write-back) are not cutover-tail bugs. They are the Cortex MCP retrofit, a roadmap item per `28_mcp_first_product_design.md`. WS-C is net-new wiring, not a repair.
- The Revit add-in still points at Replit via the per-workstation `ReplitUrl` setting in the separate `legacy-revit-sensor` C# repo. Flagged, not fixed; the data-scatter risk is live.
- The reported un-attributed working-tree changes were not real. `stash@{0}` is empty, a CRLF phantom diff under `core.autocrlf=true` with no `.gitattributes`. No data was lost.
- `50_hauska_mcp_server.md` is stale on the tool surface (slash namespace, "14 tools"; actual is 35 product-gated plus 5 public, flat underscore names).

## What's still open

- QA-04: IFC upload 500 is filed (root-cause hypothesis is the GCS object-storage write branch of `ingestSnapshotIfc`; Cloud Run log retrieval was blocked). WSA.2 (Revit add-in repoint) is flagged: the operator updates the `legacy-revit-sensor` `ReplitUrl` setting, and that repo needs a rename plus default-value fix.
- WS-C, the Cortex MCP retrofit, is roadmap-scale and needs a design and scoping pass, not a quick dispatch.
- WS-E: QA-06 (plan-set to publisher; catalog-thesis-check gate; routes to `41_advanced_capture_features.md`) and QA-10 (Hutto TX ingestion; premortem-check gate; partnership routing via Sylvia).
- QA-15: plan-review header bell opt-in (minor).
- `50_hauska_mcp_server.md` tool-surface correction.
- legacy-design-tools repo hygiene: add a root `.gitattributes` (`* text=auto eol=lf`) to stop the empty-stash recurrence; `stash@{0}` and `stash@{1}` are empty and droppable; `stash@{2}` and `stash@{3}` are genuine May-1 WIP worth a separate glance.
- cc-agent-M's MCP architecture research doc is uncommitted in hauska-mcp-server; it should be committed as the durable record.

## Suggested canonical doc updates

- `00_current_state.md`: section 5 prepend with this session, section 6 Cortex QA backlog entry, frontmatter refresh. Applied this session.
- `50_hauska_mcp_server.md`: tool-surface correction (slash to underscore names, "14 tools" to 35 gated plus 5 public). Deferred to a follow-up edit; tracked in doc 44.

## Commit batch

This session's doc_repo artifacts: new docs 43 and 44; four dispatch files at `_dispatches/2026-05-20_*` (cc-agent-C WS-A, cc-agent-C WS-B, cc-agent-M architecture map, cc-agent-C2 forensics); this session summary; `00_current_state.md` regeneration.

Note: the prior cutover session's commit batch (`00_current_state.md` earlier edits, `90_runbooks/legacy_design_tools_replit_to_cloud_run_cutover.md` Stage 9, and the two 2026-05-20 cutover and cc-agent-M session files) was still uncommitted in the working tree at the start of this session. The commit plan presented to the operator covers both.
