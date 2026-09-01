# Mission — P-91 Wave C MCP App iframe

Plan rows: P-91, P-92. WDLL `_inbox/2026-08-28_smartsite_mcp_app_WDLL.md` items 12, 13, 16, 25, 26.

## Seat and tree

Planner executes in an isolated LDT worktree from `origin/main`. Do not write `P:/legacy-design-tools` (dirty `feat/s1-instrument-hardening`). Do not write `P:/seat-worktrees/property/legacy-design-tools-mcp` (`fix/cortex-min-instances-1`). Housing is `artifacts/smartsite-mcp` only.

## Preconditions already met

- O1 customer-done: More facts on `48021:33223` prints BUILDABLE `Not stamped here`. No 42%.
- HTTP A12 met on cortex `00649-wuq`. Persistence tools live on MCP `00023-kud` (`llms.txt` Tools 13).
- Address `situs-search` is empty at 20s. Node-id search still works. Board must render unresolved rows with the original query. Do not treat that as an iframe defect.

## Build

Ship the Claude MCP App view for the screening board and parcel panel.

1. Register a `ui://` resource, mime `text/html;profile=mcp-app`. Attach `_meta.ui.resourceUri` on `list_screens` and `get_smart_site` only. Do not add a fourteenth named tool. Do not add a board HTTP endpoint (I1).
2. Board reads a screen from the tool result (`list_screens` / `create_screen`). Never `list_my_properties`. Rows keep original query. Five-state cells. No column aggregates. Unread and unknown do not share a glyph.
3. Parcel panel renders `get_smart_site` `draw` from a bare node id (I6). Envelope refused stays refused. No lot-percentage. No setback distances on the ring (item 8 / O2).
4. Find listing history is the only ask-Claude control. It sends `ui/message` and changes no panel bytes (I5 / A15).
5. Turns: open parcel, save, add to screen, listing history. Local: sort, filter, hover, layer toggle.
6. CSP deny-by-default. No Google fonts. No private origins. `connectDomains` empty unless a declared public origin is required. System fonts only.
7. Tests must fail when: a private URL appears in the HTML; listing-history click mutates panel payload; unread and unknown share a glyph; a column total is rendered; `list_my_properties` is the board source.

## Out

Drainage overlay. codeRefs hop. Walk across ROW (O3). Item 21 file (after this ships). P-90. Hauska MCP deploy. Staging `00646-luj` shift. A5 forty until address search hits.

## Close

CP1/CP2/close under `_inbox/2026-08-28_p91c_*`. leave_behind named. Subagent does not commit.
