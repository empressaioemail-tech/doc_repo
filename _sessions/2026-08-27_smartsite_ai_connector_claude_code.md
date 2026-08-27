---
id: 2026-08-27_smartsite_ai_connector_claude_code
title: Session close — P-86 share live, Use in your AI chrome, P-87 finish-line handoff
date: 2026-08-27
agent: planner
repo: docs
session_type: execute
memory_graded: none
plan_row: P-86, P-87, P-88
rolled_up: false
---

# Session: Smart Site agent distribution (P-86 / P-87 chrome)

## What was done

Ran the approved WDLL `_inbox/2026-08-26_smartsite_ai_connector_WDLL.md` as the planning agent on the integration checkout (`P:/doc_repo` main). Product writes stayed in the registered property worktrees.

P-86 item 1 is customer-done. Minted share URLs are grant-scoped `/s/{grantId}`. Live probe 2026-08-27T02:17Z on `https://smartsite.cloud/s/c86a0001-0086-4086-a001-000000000001`: HTML, markdown, and JSON 200; HMAC-in-path 403; `/llms.txt` 200; `/share` still the human SPA. Cortex had to move off #480 onto `cortex-api-00589-jen` (LDT #481, image `0dd3e159`) before the grant route existed.

The operator then said there was no button to hook it up. That was true. P-87 item 15 chrome was not built. This session added **Use in your AI** as a live rail bubble (registry id `use-in-ai`), with Coming soon / Unavailable rows and no fake Connect (item 16). The working hook on that sheet is the same `/s/{grantId}` mint Share already uses. Deployed to production: PE `dpl_DE5i8ajH8Ms3Bu41AJjTjUzcNUDX`. Code: hauska-map `80585e8` on `seat/property-ai`, PR #229.

The operator opened the live sheet and asked what it takes to finish. Answer: P-87 MCP + WorkOS AuthKit (item 10 is the falsifier), then the sheet flip, then P-88 after a stranger-account probe. Records tools wait on P-85 item 4 and must not block Connect.

This close files a finish-line canvas, a pasteable planning-agent handoff, a WDLL amendment for the chrome ship, and scratch continuity.

## What was learned (changes to ground truth)

- A fetchable share URL is not a connector. The operator experience of "hook it up" is a visible control. Item 1 live without item 15 chrome reads as unfinished.
- Item 16 held: the sheet shipped as Coming soon, not a fake Connect.
- First live `/s/{id}` 403 was cortex still on #480, not a bad grant id. Read the serving revision, not `latestReadyRevisionName`.
- `vercel deploy --prod` from the hauska-map repo root with `NODE_OPTIONS=--use-system-ca`. First `vercel link` failed TLS until system CA was set.
- The "three bodies agree" share checker cloned a hidden HTML comment from the same object. One derivation, not two. Do not treat it as meaning-shaped.
- Integration on `P:/doc_repo` main is not a planner seat. Product commits happened in `hauska-map-smartsite-ai`. This close does not write `_state/property`.

## Decisions

- Use in your AI placement: workbench rail circle after Share, before Compare. Binding design: rail circle, not inspect-card CTA.
- Until item 10, Claude / Cursor / Copilot = Coming soon. ChatGPT = Unavailable plus the Business/Enterprise line.
- Six workbench-live MCP tools may ship before P-85. Item 12 (exactly eight) needs an amendment if we claim the catalog before records tools exist. Recommended, not yet amended.
- No new A-id. A-035 is the program. A-037 is AuthKit. A-039 is the engine-api ban.

## Outputs

- hauska-map #227 merged (P-86 share instrument)
- hauska-map #229 open (Use in your AI)
- PE prod `dpl_DE5i8ajH8Ms3Bu41AJjTjUzcNUDX` on smartsite.cloud
- Cursor canvas `smartsite-ai-connector-finish.canvas.tsx`
- `_inbox/2026-08-27_p87_planning_agent_handoff.md`
- WDLL amendment (item 15 chrome / item 16 live)
- `_scratch/smartsite-ai-connector.md` ground-truth rows

## Outstanding from this session

1. Compile and run P-87 on `seat/property-mcp` (MCP server + AuthKit join).
2. Operator: WorkOS AuthKit, CIMD, Google/Microsoft, DNS `mcp.smartsite.cloud`.
3. Flip Claude to Connect only after item 10.
4. Merge #229.
5. P-86 item 5 owner-fact leave-behind. Item 8 waits on P-85.
6. P-88 after item 20.

## References

- WDLL `_inbox/2026-08-26_smartsite_ai_connector_WDLL.md`
- Decision `_decisions/2026-08-26_smartsite_product_mcp_and_ai_connector.md`
- Design `_inbox/2026-08-26_use_in_your_ai_ux_handoff_claude_design.md`
- Handoff `_inbox/2026-08-27_p87_planning_agent_handoff.md`
- OPS-16 A-035, A-037, A-039
