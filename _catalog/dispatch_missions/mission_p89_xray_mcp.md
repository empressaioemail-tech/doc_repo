## Mission — P-89: Hauska MCP X-ray generator fail-closed

You are a LANE PLANNER on the **substrate** seat. You may spawn sub-agents. You supervise every one to completion. You never delegate verification. You do not commit (the parent planner commits). You do not deploy.

**PLAN-ROW:** P-89
**Repo:** `hauska-mcp-server`
**WDLL:** `_inbox/2026-08-27_p89_xray_mcp_WDLL.md` (items 1–6). Also cite QA WDLL items 19 (MCP half), 28 leftover on the generator, 29 (MCP refuse half).
**Decision:** `_decisions/2026-08-27_report_sku_feasibility_comparison_brief.md`

### Snapshot and worktree

Declare repository, branch, and commit in your first output.

Create an isolated worktree from `origin/main`. Do **not** write:

- `P:/seat-worktrees/substrate/hauska-mcp-server` (dirty; open PR #74)
- `P:/seat-worktrees/substrate/hauska-mcp-icc-meter` (ICC meter card)

If you cannot isolate, stop and say so.

### Why this card exists

PE W4.P0 now refuses a hollow X-ray click (`pipeline_output_absent`). That is a costume if Hauska MCP still treats verdict and brief as optional. Adversarial record: `_inbox/2026-08-27_w4_p0_adversarial.md`. `refresh_parcel_dossier_export` still emits. GET download still streams a previously stored hollow artifact. Engine `emitPdfDossier` still chips UNAVAILABLE; that is **P-90**, a property-seat engine card. Do not write the engine.

W2.4 live-view chrome is already on PE. This card forwards `live_view_url` / `liveViewUrl` into the assembler contract. Printing the link onto PDF bytes is P-90.

### Read first

1. This mission and the P-89 WDLL.
2. `_inbox/2026-08-27_w4_p0_adversarial.md`
3. `_scratch/qa-w2-share.md` (live-view field names)
4. The write path for `refresh_parcel_dossier_export` and the download GET. Code reading outranks output measuring. Read the write path before changing it.

### Acceptance mapping

| WDLL | Work |
|------|------|
| 1 | Refuse `refresh_parcel_dossier_export` when verdict is missing or unresolved. Named 4xx. No `%PDF`. No new stored artifact. |
| 2 | Refuse when brief facts are empty or null even if a verdict string is present. |
| 3 | GET download of a stored hollow X-ray refuses. Body is not `%PDF`. |
| 4 | Accept `live_view_url` and forward that exact URL to the engine assembler and on returned metadata. |
| 5 | Same for flood `liveViewUrl`, or a written finding that it is the same write path. |
| 6 | Each refuse is verified by violating it. Pass-only is not a grade. |

### Constraints

- Fail closed. Do not chip UNAVAILABLE and still write a PDF.
- Do not write `hauska-engine` or `hauska-map`. If the refuse belongs in the engine assembler, file that as P-90 leave_behind and still refuse at the MCP boundary so a non-PE caller cannot bypass PE.
- Do not build Feasibility or Comparison generate. Those names are now locked reports; their generate paths are not this card. P-32 stays do-not-start.
- Brief is a tool. Records is a tool (P-85). Do not add report tools for them.
- Do not touch Smart Site product MCP (P-87 / `artifacts/smartsite-mcp`).
- Do not deploy. Open a PR. Planner deploys.
- Commit is not yours. Explicit pathspec list in the close.
- Subagents do not commit.

### Falsifiers (pre-register, then run)

1. A tool call with no verdict still returns 200 and PDF bytes. If that happens after your change, item 1 is not met.
2. A tool call with a verdict string and empty brief still stores an artifact. If that happens, item 2 is not met.
3. GET download of a hollow stored id returns `%PDF`. If that happens, item 3 is not met.

### Close

File CP1 / CP2 / close at the paths this dispatch names. Declare `leave_behind` (P-90 engine PDF honesty is the expected leftover). Return scratch entries (LESSON / DEAD-END / GROUND-TRUTH with timestamp / OPEN) in the close. Do not promote to MEMORY.md.
