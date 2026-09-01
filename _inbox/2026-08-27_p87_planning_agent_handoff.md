---
id: 2026-08-27_p87_planning_agent_handoff
title: Handoff — fresh planning agent to finish Smart Site agent distribution (P-86 leftover, P-87, P-88)
date: 2026-08-27
status: active
from: integration / prior planner session on P:/doc_repo
to: next planning agent (Cursor, doc_repo)
plan_row: P-86, P-87, P-88
wdll: _inbox/2026-08-26_smartsite_ai_connector_WDLL.md
decision: _decisions/2026-08-26_smartsite_product_mcp_and_ai_connector.md
canvas: canvases/smartsite-ai-connector-finish.canvas.tsx (Cursor managed)
---

# Handoff: finish Smart Site agent distribution

Filed: 2026-08-27
From: prior planner session (P:/doc_repo, integration checkout)
To: next planning agent
Re: Take P-87 from Coming soon to a live Claude Connect, then P-88

Copy the prompt in section 7 into a new chat. Read sections 1 to 6 first if you are already in this repo.

## 1. Conversation summary

This program is Smart Site reaching people through the AI consoles they already use. Not paste an API key. Product MCP at `mcp.smartsite.cloud`, OAuth against the Smart Site account, Stripe tier as ceiling. Hauska MCP stays the catalog. Fresh product, shared backends. No second writer.

P-86 shipped a fetchable share URL. P-87 chrome shipped: a Use in your AI rail bubble and an honest sheet. The operator opened that sheet and saw Coming soon on Claude, Cursor, and Copilot, and Unavailable on ChatGPT. That is correct. Connect is not live. The remaining work is the MCP server, WorkOS AuthKit, the eight (or six-plus-honest) tools, the sheet flip, a stranger-account probe, then directory listings.

## 2. Decisions reached

1. Product MCP, not a Hauska filter. Reasoning: one connector URL lists whatever the server lists; teaching Hauska a second identity contaminates both products. Owner: operator, recorded 2026-08-26. Reversal: first-party vendor listing binds Hauska hostname and Stripe without a second server, by amendment.

2. Three rows in this order: P-86 shares, P-87 MCP + Use in your AI, P-88 listings after a live probe. Owner: operator (A-035). Reversal: amend OPS-16.

3. Housing (b): MCP in `legacy-design-tools/artifacts/smartsite-mcp`. Share UI stays in hauska-map. Owner: planner reply 2026-08-26. Reversal: dedicated repo by amendment.

4. Authorization server is hosted WorkOS AuthKit (A-037). Fallback if Claude Connect fails twice: Stytch Connected Apps, by amendment of A-037. Identity join only through `peUserIdentities` by `(provider, subject)` or verified email on the same provider. Never a second account. Never a tier the entitlements row does not carry. Item 10 is the falsifier.

5. Share URL carries the grant id, not the HMAC. HMAC stays on `/share#token` only.

6. Smart Site MCP never calls engine-api directly (A-039). Go through workbench paths.

7. If OAuth is not live, Use in your AI is absent or Coming soon. Never a fake Connect. Never a key or Cloud Run URL. This session shipped the Coming soon sheet. That item (16) is met. Item 15 is partial until Connect exists.

8. Records tools and P-86 item 8 wait on P-85 item 4. Do not build a second records path. Do not block Connect on Records. If shipping six live tools first, amend item 12 rather than claiming eight.

## 3. Open questions

1. Ship six live tools and amend item 12, or wait for P-85 item 4 so `tools/list` is eight? Open because Records is a parallel card. Route to planner on P-87 start. Recommended: ship six, keep two labelled not-ready or amend.

2. WorkOS project and DNS for `mcp.smartsite.cloud` are operator-owed and not in this repo. Route to Nick. Recommended first action: ask for AuthKit org access and the DNS change in the same breath as compiling the dispatch.

3. hauska-map #229 is open; Use in your AI is already on production from a worktree deploy. Merge is hygiene, not the grade.

## 4. Artifacts produced

| File | Purpose |
|---|---|
| `_inbox/2026-08-26_smartsite_ai_connector_WDLL.md` | Approved card. Amendments bind. Do not rewrite items in place. |
| `_decisions/2026-08-26_smartsite_product_mcp_and_ai_connector.md` | Binding decision |
| `_scratch/smartsite-ai-connector.md` | Tier 2 continuity. Read before archaeology. |
| `_dispatches/2026-08-27_p86-ai-connector_dispatch.md` | P-86 hauska-map dispatch (already run) |
| `_inbox/2026-08-26_use_in_your_ai_ux_handoff_claude_design.md` | Binding UI copy and states |
| `_inbox/2026-08-27_p86_item1_live_probe.md` | Item 1 live evidence |
| `_inbox/2026-08-27_p87_planning_agent_handoff.md` | This file |
| Cursor canvas `smartsite-ai-connector-finish.canvas.tsx` | Finish-line tracker |

## 5. Stakeholder updates needed

Nick (operator): AuthKit project, CIMD on, Google and Microsoft on that AS, DNS `mcp.smartsite.cloud`. No customer comms until item 20.

Sylvia / GTM: none. Do not claim Connect in market copy.

## 6. Context the next session must inherit

Read in this order: `_STATE.md`, this handoff, the WDLL, the decision, `_scratch/smartsite-ai-connector.md`, `90_runbooks/AGENT_CONTRACT.md`, `90_runbooks/DEV_PROCESS.md`.

Worktrees, never the wrong checkout:

- hauska-map: `P:/seat-worktrees/property/hauska-map-smartsite-ai` on `seat/property-ai`
- LDT MCP: `P:/seat-worktrees/property/legacy-design-tools-mcp` on `seat/property-mcp`
- Never `fix/pe-pricing-a2`, never the records hauska-map worktree, never LDT `feat/p85-records-request`

Live evidence:

- Share: `https://smartsite.cloud/s/c86a0001-0086-4086-a001-000000000001`
- PE: `dpl_DE5i8ajH8Ms3Bu41AJjTjUzcNUDX` aliased to smartsite.cloud
- Cortex share-grants: `cortex-api-00589-jen` @ 100%, image `0dd3e159` (LDT #481)
- Use in your AI: hauska-map `80585e8`, PR https://github.com/empressaioemail-tech/hauska-map/pull/229

Grade is a live probe, never a merged PR. Deploys are planner-owned. Subagents do not commit. Commit by explicit pathspec. Do not amend OPS-16 unless the operator asks.

## 7. Paste this into a fresh planning agent

```
You are the planning agent for OPS-16 rows P-86 (leftover), P-87, and P-88. Smart Site agent distribution. Seat: identify yourself from _catalog/seat_register.json. If you are on P:/doc_repo main you are integration, not a planner seat: you may compile dispatches and write _inbox/_sessions/_scratch; you must not write _state/property. Confirm you are not in another seat's worktree before any product commit.

Snapshot this output: repo, branch, commit. Today is 2026-08-27.

Read first, in order, before planning or writing product code:
1. _STATE.md
2. _inbox/2026-08-27_p87_planning_agent_handoff.md
3. _inbox/2026-08-26_smartsite_ai_connector_WDLL.md
4. _decisions/2026-08-26_smartsite_product_mcp_and_ai_connector.md
5. _scratch/smartsite-ai-connector.md
6. 90_runbooks/AGENT_CONTRACT.md
7. 90_runbooks/DEV_PROCESS.md
8. MEMORY.md lines that touch MCP, deploys, Cotality, code-done

Open the finish-line canvas beside the chat:
C:\Users\cente\.cursor\projects\p-doc-repo\canvases\smartsite-ai-connector-finish.canvas.tsx

Done looks like (WDLL): a Studio user clicks Use in your AI, picks Claude, completes OAuth as themselves, and from Claude can find a parcel, open its smart site, list properties, run a report, request records, check a request, export, and ask the map, at their Stripe tier. Unresolvable credentials are 401. Hauska MCP is unchanged. Directory listings exist only after that probe.

What is already customer-done:
- P-86 items 1, 2, 3, 4, 6, 7. Live share https://smartsite.cloud/s/c86a0001-0086-4086-a001-000000000001 (HTML/markdown/JSON 200; HMAC 403).
- P-87 items 15 (chrome only) and 16 (Coming soon, no key). Rail bubble Use in your AI is on production (PE dpl_DE5i8ajH8Ms3Bu41AJjTjUzcNUDX, hauska-map 80585e8, PR #229).
- Cortex share-grants live: cortex-api-00589-jen @ 100% image 0dd3e159 (LDT #481). Migration 0085 applied.

What is not done:
- P-86 item 5 partial (owner-fact leave-behind). Item 8 blocked on P-85 item 4.
- P-87 items 9, 10, 11, 12, 13, 14, 17. Item 10 is the falsifier.
- P-88 items 19–21 after item 20.

Binding rules you must not violate:
- Product MCP, not a Hauska filter. Housing: legacy-design-tools/artifacts/smartsite-mcp via cloud-run-deploy.yml.
- AS is WorkOS AuthKit (A-037). Stytch Connected Apps only if Claude Connect fails twice, by amendment of A-037.
- Identity join: peUserIdentities (provider, subject) or verified email on the same provider. Never a second account. Never a tier peUserEntitlements does not carry.
- A-039: this server never calls engine-api. Workbench paths only.
- Exactly the eight named tools. Additional tools need a WDLL amendment.
- request_records, check_request, and P-86 item 8 wait on P-85 item 4. Shared backends only.
- Item 16 still binds: never ship a Connect that shows a key or a Cloud Run URL.
- Code-done is not customer-done. Grade is a live probe.
- Dispatches are compiled: node scripts/dispatch.mjs --plan OPS-16 --lane p87-mcp --plan-row P-87 --repo legacy-design-tools
- Preamble must carry vd3c673f8 or later. Never hand-assemble.
- Worktrees: hauska-map P:/seat-worktrees/property/hauska-map-smartsite-ai on seat/property-ai. LDT P:/seat-worktrees/property/legacy-design-tools-mcp on seat/property-mcp. Never the pricing, records, or P-85 LDT checkouts.
- Subagents do not commit. You commit by explicit pathspec. Never git add all. Never commit OPS-16 unless the operator asks for an amendment.
- Do not absorb GPT store, Zapier, SEO parcel pages, per-call pricing, or hauska-mcp-server OAuth.

Your first hour:
1. Recut or confirm both worktrees from origin/main (P-86 squash is on main; #229 may still be open).
2. Compile the P-87 dispatch. Do not start hostname/OAuth work in a hand-written prompt.
3. Ask the operator, in one message, for: WorkOS AuthKit access, CIMD enabled, Google+Microsoft on that AS, DNS mcp.smartsite.cloud. Do not invent credentials.
4. Scaffold the MCP server so POST https://mcp.smartsite.cloud/mcp can initialize with serverInfo.name Smart Site. Health does not call 404 ok.
5. Implement the identity join and refuse Bearer-without-OAuth (401, no public catalog).
6. Wire the six workbench-live tools. Leave records tools labelled not-ready or amend item 12.
7. Do not flip Claude to Connect until item 10 has one completed custom-connector Connect.
8. File CP1 before build and CP2 before the live Connect attempt.

If you disagree with a closed finding, report both readings and let the operator route. Do not start P-88 filings. Do not rotate Cotality. Do not escalate a deploy.

When you finish or hand off: update _scratch/smartsite-ai-connector.md (LESSON / DEAD-END / GROUND-TRUTH with timestamp / OPEN). Leave durable promotion to the planner gate.
```
