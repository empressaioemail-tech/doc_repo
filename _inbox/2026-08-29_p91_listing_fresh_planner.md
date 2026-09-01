---
id: 2026-08-29_p91_listing_fresh_planner
title: Fresh-planner handoff. Listing host_drop. Step back.
date: 2026-08-29
status: ready
plan_row: P-91
items: [16, 26]
serving: smartsite-mcp-00039-req
---

Filed: 2026-08-29
From: integration planner (`P:\doc_repo`)
To: a new planner agent in a new chat
Re: Smart Site MCP listing click. Three earned host_drops. Do not add a listener. Step back.

# Paste everything below this line into a new planner chat

You are a planner on OPS-16 P-91 items 16 and 26. Plan of record `90_operations/OPS-16_texas_market_plan_of_record.md`. WDLL `_inbox/2026-08-28_smartsite_mcp_app_WDLL.md`. Contract `90_runbooks/AGENT_CONTRACT.md`. Enforcement `ENFORCEMENT.md`. Seat is integration on `P:\doc_repo` main. Product writes only in an isolated LDT worktree. Never write `P:/legacy-design-tools` (dirty). Subagents do not commit. Doc_repo commits are planner-owned and wait for Nick.

Read first: `_STATE.md`, `MEMORY.md`, `_scratch/p91-listing-bind.md`, `_inbox/2026-08-29_p91_listing_host_drop.md`, `_inbox/2026-08-29_p91_listing_host_drop_p544.md`, this file. Then the WDLL items 16 and 26.

Snapshot in your first output: repo, branch, commit. If you cannot, stop.

## Your job

Step back. Name the defect class. Do not continue the cheapest-miss treadmill.

The last three Connect grades on listing are the same observation: the panel handler ran, 281 characters were posted, no user turn appeared, no tools ran after the click. The prior planner treated each miss as a widget-protocol bug and shipped one change at a time (body bind, request id, handshake wait). Each ship earned `host_drop` again. A fourth listener or a fifth URI bump is not a plan.

You inherit the scores. You do not relitigate them. You do not ship until you can name two mechanisms that would produce the same observation, say which one you reject and why, and say what observation would distinguish them. Enforcement: "Stopping at the first plausible explanation is the documented recurring error."

You may recommend a next ship. You may recommend parking listing. You may recommend that `ui/message` is the wrong verb for this host. You may recommend that Claude Connect does not implement MCP Apps `ui/message` the way the spec describes. Those are all legal outcomes. Another bind patch is not the default.

## Standing

Cotality extinguished. Deploys planner-owned. No privileged data. Code-done is not customer-done. Image tag is the full SHA. Never trust `latest`. Read `status.traffic[]` by field name. Do not use `--set-env-vars` on a digest-pin. Do not shift staging cortex `00646-luj`. Apex `smartsite.cloud` stays Vercel. I1 I5 I6 bind. No listing feed. No web content in the panel. No 14th tool. Do not widen `ask_the_map`. Do not deploy Hauska MCP. Do not take P-90. Wave H and A5 forty stay parked until a listing turn lands.

Claude in Connect cannot see or click the iframe. The operator reports painted facts. A `get_smart_site` tool call is not Open working.

## What already passed. Do not reopen.

Wave E address paste PASS. HTTP: Pine 200 to `48021:34137`. Rainmaker Cv 200 to `48021:8720522`. zzzz `missClass=no-hit`. Connect paste PASS n=1.

Wave F save PASS. Board `updatedAt` equals `createdAt`. A12 met.

Envelope refuse on gold `get_smart_site`: `atom_path_pending`, no 42 percent. Ruling B. Wave G parked.

Gold parcel is `48021:34137`. CAD situs is `908 PINE , BASTROP, TX 78602` (space before the comma, no ST). Junk is `zzzz-not-a-situs-99999`.

## The listing problem

**Listing** is the white Find listing history button on the parcel panel. Click should post one `ui/message` turn: public web search for prior sales, price cuts, listing copy. Answer in chat only. Panel and board unchanged. I5. WDLL item 26.

Exact turn text (`listingHistoryMessage`):

```
Find listing history for ${who}. Search the public web for prior sales, price cuts, and listing copy. Put the answer only in this transcript. Do not call ask_the_map. Do not start Smart Site research. Do not write it into the Smart Site board or parcel panel.
```

`${who}` is `model.label || model.parcelNodeId || "this parcel"`. For gold, length is 281.

`classifyListingOutcome`: no turn + no ack = `handler_unbound`; no turn + ack = `host_drop`; guarded turn + `ask_the_map` = `guard_failed`; guarded turn + answer = `working`; guarded turn + no answer throws `listing_outcome_unclassified`.

## Earned listing scores. In order.

1. `00031-jih` / #541. Label sat still. Outcome 1 / `handler_unbound`. Host had nothing to drop.
2. `00033-hin` / #542. Boot `script-ran`, header `script-ran`, label Requesting listing history, Posted 281. No turn. `host_drop`. Open on the board painted and dead. `ui/message` was a JSON-RPC notification (no `id`).
3. `00035-tov` / #543. Same ack. Same 281. Same no turn. `host_drop`. `ui/message` now a request with `id:rpcId++`. URI `ui://smartsite/app-p543.html`. Screen `93468d11-35b3-4afd-93c1-407ca3f06ca1`. Evidence `_inbox/2026-08-29_p91_listing_host_drop.md`.
4. `00037-xoz` / #544. Same ack. Same 281. Same no turn. `host_drop`. Handshake wait shipped: `ui/initialize`, wait for reply (string or number id), then `ui/notifications/initialized`, queue outbound until ready, 2s timeout. After Posted, Claude sat (`Thought for 11s`) and the chat went unresponsive. Ack did not un-paint. Screen `0dcbe31b-8b2f-46a1-b8aa-30587df8ad35`. Evidence `_inbox/2026-08-29_p91_listing_host_drop_p544.md`.
5. `00039-req` / #545. Serving now. `ui/message` `content` changed from a ContentBlock array to the published spec object `{ type: "text", text }`. URI `ui://smartsite/app-p545.html`. **Ungraded.** Do not treat this ship as failed. Do not treat it as working.

Open on the board is a separate defect. Painted, `script-ran`, no hover, no turn. `open_path: typed`. Inline `onclick` did not fix it. Leave it. Do not keep adding handlers for Open unless listing is `working` and you still need Open.

## What is serving right now. Verify before you use it.

Claimed, last verified 2026-08-29T06:12Z. Re-read traffic JSON by field name and `/health` before you act.

- MCP: `smartsite-mcp-00039-req` @100% tag `p545`, digest `sha256:381e34a4d4dcbfff16586db3839da1630ff52f99b56261521ffb826866f3b91a`, minScale=1. Live `/health` names `00039-req`. Tools (13). App URI `ui://smartsite/app-p545.html`.
- Cortex: `cortex-api-00656-vek` @100% tag `p539`. Staging `00646-luj` still tagged `staging` at 0%. Leave it.

Current post (p545 HTML):

```
parent.postMessage({jsonrpc:"2.0",id:rpcId++,method:"ui/message",params:{role:"user",content:{type:"text",text:text}}},"*")
```

Handshake: `ui/initialize` with `protocolVersion: "2026-01-26"`, wait for matching id, then `ui/notifications/initialized`. 2s timeout still sends initialized. Boot `#boot` starts `script-off`, flips to `script-ran`, `data-handshake` is `wait|ready|error|timeout`.

Source: isolated worktree `P:/seat-worktrees/property/legacy-design-tools-p91-listing`, file `artifacts/smartsite-mcp/src/mcp-app.ts`. Main SHA for p545 is `479213ec`.

## Spec split you must not paper over

Published MCP Apps example (`specification/2026-01-26/apps.mdx`): `params.content` is one object `{ type: "text", text }`.

`@modelcontextprotocol/ext-apps` `McpUiMessageRequest` / `App.sendMessage`: `params.content` is `ContentBlock[]`.

p542 and p543 and p544 sent the array. All `host_drop`. p545 sends the object and has not been Connect-graded.

A host that implements the SDK type will reject the object. A host that implements the published example will reject the array. We do not know which Claude Connect implements. We also do not know whether Claude Connect implements `ui/message` at all.

## Presence rules. Do not invent CSP.

Missing `script-ran` is three mechanisms. Score presence first.

1. Boot strip visible and `script-off`: script did not run. CSP or frozen snapshot.
2. No boot strip at all: old iframe, or the host cropped `#boot`. Reconnect if Open is also missing on a resolved row.
3. Resolved Pine row has no Open: old build. Stop.
4. Boot or header `script-ran`: that document ran JS.
5. Label flips to Requesting listing history, chat empty: `host_drop`.
6. Label sits with `script-ran` present: click is not reaching the handler.
7. Label flips, guarded turn, answer only in chat, panel unchanged: `working`.

Host chrome titled `Smart Site` plus a tool name is not our `.hdr`. Vertical scroll of the table well cannot reveal `#boot` or the card header. They sit outside the well.

## What you produce

A diagnosis, not a patch. Write `_inbox/2026-08-29_p91_listing_fresh_read.md`.

Must include:

1. Snapshot (repo, branch, commit). Serving traffic JSON by field name. `/health` revision.
2. The observation in one paragraph (what is earned, what is ungraded).
3. At least two mechanisms that would produce Posted 281 and no turn. For each: what would distinguish it, and whether that distinguisher has been run.
4. A recommended next move: one of `grade_p545`, `park_listing`, `change_verb`, `host_research`, or a named fourth. One sentence why. Not a menu.
5. What you will not do. Explicitly refuse another click-listener ship unless a distinguisher requires it.
6. `leave_behind`.

Do not start Wave H. Do not start A5 forty. Do not deploy unless Nick says go after you file the read. Do not update the canvas unless the diagnosis changes a wave status; the canvas at `canvases/smartsite-mcp-loop.canvas.tsx` is stale at `00033-hin` / outcome 1 and is not your first artifact.

## Decisions already reached (do not reopen)

1. Listing answer lives in the transcript, never in the panel or board. I5. Owner: operator. Reversal: a WDLL amendment.
2. Absence of a turn is not `host_drop` until a local ack is observed. Owner: planner. Reversal: if the ack itself is shown to be a lie.
3. Open typed is an allowed substitute for grading the parcel panel. It does not count as Open working. Owner: planner. Reversal: a live Open click that produces a turn.
4. Wave H is held until listing works. Owner: operator. Reversal: operator says the widget look is the next customer-facing card anyway.

## Open questions for you

1. Does Claude Connect implement `ui/message` at all? Why open: three drops after a proven post. Routing: host research or a p545 grade, not another widget patch.
2. Which content shape does that host accept, object or array? Why open: spec and SDK disagree; only the array has been graded. Routing: one Connect on p545, or a host-side citation.
3. Why is Open dead on a document that ran JS and whose listing handler runs? Why open: same iframe, one click works locally, one does not. Routing: after listing, not before.
4. Is `ui/message` the wrong product verb if the host will only accept a typed user turn? Why open: every click that needs a model turn is currently this path. Routing: your call after the two-mechanism write-up.

## Artifacts

- `_scratch/p91-listing-bind.md` — live scratch. Read first.
- `_inbox/2026-08-29_p91_listing_host_drop.md` — p543 grade.
- `_inbox/2026-08-29_p91_listing_host_drop_p544.md` — p544 grade.
- `_inbox/2026-08-29_p91_listing_claude_connect_prompt.md` — operator-click Connect script. Serving line may still say an older revision; verify.
- `_inbox/2026-08-28_smartsite_mcp_app_WDLL.md` — items 16 and 26.
- `canvases/smartsite-mcp-loop.canvas.tsx` — stale. Do not treat it as current state.

## Stakeholder

Nick is the operator. He clicks. He is tired of a Connect chat that hangs after Posted 281. Do not send him into another Connect run unless your distinguisher requires it and you say so in one sentence.
