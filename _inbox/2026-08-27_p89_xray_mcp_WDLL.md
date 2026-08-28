---
id: 2026-08-27_p89_xray_mcp_WDLL
title: WDLL — P-89 Hauska MCP X-ray generator fail-closed
status: approved
last_updated: 2026-08-28
operator_approval: 2026-08-27 verbal go (give me the mcp dispatch)
plan_row: P-89
---

# WDLL: P-89 Hauska MCP X-ray generator fail-closed

Date: 2026-08-27  Status: approved
Operator approval: 2026-08-27 (compile the MCP dispatch and hand-carry)
Plan row: P-89
Repo: `hauska-mcp-server` (substrate). Isolated worktree from `origin/main`. Do not write `P:/seat-worktrees/substrate/hauska-mcp-server` (dirty, PR #74) or the ICC-meter worktree.

Cites QA WDLL `_inbox/2026-08-27_smartsite_qa_program_WDLL.md` items 19 (MCP half), 28 leftover on the generator, 29 (MCP refuse half). Engine print is P-90, not this card.

## Done looks like

Any caller of Hauska MCP, including PE and a raw tool call, cannot mint or re-download a hollow X-ray. `refresh_parcel_dossier_export` refuses when the verdict is unresolved or brief facts are empty. A previously stored hollow artifact refuses on GET download. `live_view_url` is accepted and forwarded to the engine assembler. No Feasibility or Comparison generate path is built. Hauska engine and hauska-map are not written.

## Acceptance items

1. **Verdict required.** `refresh_parcel_dossier_export` refuses when the verdict is missing or unresolved. Check: call with no verdict (and a second call with the unresolved placeholder). Response is a named refuse (4xx, no `%PDF` body, no new stored artifact). Grade: [met] MCP boundary on hauska-mcp-server `1ae9f28` (PR #77). 422 `pipeline_output_absent` before engine POST. Not deployed by this lane.

2. **Brief facts required.** The same tool refuses when brief facts are empty or null even if a verdict string is present. Check: call with a verdict and `brief: null` / empty facts. Same refuse. Grade: [met] same SHA. `brief: null` and empty sections refuse. No engine call.

3. **Stored hollow cannot download.** GET download of a previously stored hollow X-ray refuses and does not stream PDF bytes. Check: request a known hollow stored artifact (or a fixture the test plants). Body is not `%PDF`. Grade: [met] at `download_parcel_dossier_export`. Engine GET `/download` still streams if called directly (P-90).

4. **Live-view forwarded.** The tool accepts `live_view_url` and forwards that exact URL to the engine assembler and on the returned/stored metadata. Check: call with `https://smartsite.cloud/share?g=` plus a grant id; payload carries the same string. Printing that URL onto PDF bytes is P-90. Grade: [met] MCP accepts and puts `liveViewUrl` on the POST body and returned metadata. Engine `dossierRefreshBody` has no `liveViewUrl` key (P-90).

5. **Flood pair.** The flood refresh tool accepts `liveViewUrl` the same way if it is a separate tool. Check: same as item 4 on that tool, or a written finding that flood refresh is the same write path. Grade: [met] written finding: no flood refresh tool on this server. PE BFF to engine-api is the flood write path.

6. **Violation suite.** Each refuse above is shown to fail on a known violation before it is reported working. A pass-only run is not a grade. Grade: [met] 26/26 in `xray-export-gate` + `dossier-export-catalog` re-run 2026-08-28T22:02Z.

## Out of scope

Writing `hauska-engine` or `hauska-map`. Deploying MCP (planner-owned after merge). Building Feasibility or Comparison generate. Touching Smart Site product MCP (P-87). Inventing report SKUs. Starting W8 or W9.

## leave_behind at close

Engine `emitPdfDossier` UNAVAILABLE chips, site-plan sheet append, address title, and live-view printed on PDF bytes (P-90). PE viewer size is already a PE card.
