---
id: 2026-08-29_p91_mcp_app_deep_dive_handoff
title: Handoff — Smart Site MCP App deep dive
date: 2026-08-29
status: handoff
plan_row: P-91, P-92
from: integration seat, this chat
to: deep-dive agent
snapshot: P:/doc_repo main 2847a20
---

Filed: 2026-08-29
From: integration on P:/doc_repo main `2847a20`
To: a fresh agent doing a write-path deep dive on the Smart Site MCP App
Re: The companion walk works on gold. The miss path still paints silence. Do not inherit "wait on Anthropic."

# 1. Conversation summary

P-91 is a screening board plus parcel panel inside Claude as an MCP App. Smart Site is the door. The catalog is 13 tools. There is no 14th tool, no map in Claude, no listing feed, no web content in the panel (I5). A parcel draws from a bare node id (I6). The iframe never calls an endpoint the conversation could not (I1).

The gold look-up walk is held as customer-done n=1 on p550: paste, board, Open 908 Pine, live `draw` ring and edges, envelope in human words, listing only in the transcript, save does not change the screen, zzzz has no Open. Persistence items 18, 19, 20, 28, 29, 30 are MET. Cortex now existence-checks a typed node id on both `create_screen` and `add_to_screen` (p541). Serving MCP is `smartsite-mcp-00057-xuk` / tag p554 / URI `ui://smartsite/app-p554.html`. Serving cortex is `cortex-api-00664-hib` / tag p541. Verify those live before quoting them.

After the gold walk, this seat spent the rest of the day on F6: dead Open versus a county miss. Step 1 (click Open, no Send, 12s, `Open did not reach me`) is MET. Step 2 (Send runs `get_smart_site` on a miss, panel should say `Not on file in Bastrop`) FAILED on p551, p552, p553, and p554. Each time a result reached the chat (`baked_snapshot_not_found`, later rewritten to `{ parcels: [], notFound }`). The panel kept the silence sentence. This seat called that host-starved and stopped the URI treadmill. The operator rejected waiting on Anthropic: the tool is not done, and that conclusion is not proven. This handoff is the brief for a deep dive that starts from the write path, not from that call.

# 2. Decisions reached

1. Catalog stays 13. Find listing history is `ui/message`, not a tool. Owner: operator, 2026-08-28. Reversal: a named connector amendment.

2. Board reads a screen, not `list_my_properties`. Screens and saves are different tables. Owner: operator, A-046. Reversal: a WDLL amendment.

3. No Mapbox, Leaflet, or tiles in Claude. Interactive map stays on smartsite.cloud. Owner: operator. Reversal: a named card.

4. Cotality is extinguished. No privileged data. Deploys are planner-owned once started. Digest-pin. No `--set-env-vars` on cortex. Owner: standing decisions.

5. This seat will not ship p555 for F6 step 2. That is a local stop, not a proof the host is the defect. Owner: this seat. Reversal: the deep-dive finds a write-path punch that can be violated in-tree.

6. `add_to_screen` existence is MET on a new screen (`36e51f5a-2ed9-4778-b378-890a786a3e26`). A13 `4316b571-c7d2-4b9f-9e50-4f7a16dbfa94` still has `48021:900099` written resolved from before the check. Re-add there is a no-op. Owner: this seat, graded 2026-08-29T19:57Z.

# 3. Open questions

1. Why does a gold Open paint a parcel and a miss Open paint `Open did not reach me` after the tool has already returned in chat?

Why open: four URI punches changed our JSON shape and our reply handler. The panel sentence did not change. This seat's first mechanism is: the host never posts a miss result into the iframe. The operator's challenge is: that is not proven, and our tool is unfinished. A second mechanism that produces the same observation is required before anyone waits on Anthropic.

Recommended routing: one isolated reader on the stone iframe tree. Do not deploy a new URI until a check has been violated in-tree.

Recommended next action: read `accept()`, the `message` listener, `sendOpen`, and `parse` in `artifacts/smartsite-mcp/src/mcp-app.ts`. Then instrument what the iframe actually receives on a gold Open versus a miss Open. Keys, `id`, `method`, `result.content`, `isError`. Do not infer from the chat transcript.

2. Does `parse` of `{ parcels: [], notFound: [id] }` even paint the miss sentence if `accept()` runs?

Why open: that payload becomes `kind: "empty"`. `accept()` would set `openFail` to `Not on file in Bastrop` and replace the model with empty, which is the F5 empty board. The live fail frames kept the three-row board and the silence sentence. That pair is the timer path (`openFail` set, `accept` not run). It is also what you would see if a reply consumed `pendingMsg` without calling `accept`.

Recommended routing: same reader. Unit-test the live HTML `parse` + `accept` against a recorded host message, not only against `parseToolResult`.

3. Should item 16 close as held with F6 leftover, or stay open until the miss sentence is live?

Why open: operator has not closed the card. Gold n=1 is held. F6 step 2 is FAIL. P-92 later overlays still wait on item 16 in the WDLL text even though persistence already shipped under A-046.

Recommended routing: operator after the deep dive. Do not close it from this handoff.

4. Are leftover hunks and iframe hunks on main?

Why open: both isolates are dirty and uncommitted. Wave 1 moved cortex under us once already (`00662-hij` / canary had neither leftover existence check). p541 restored them on current main `889b1556`.

Recommended routing: operator says commit. Pathspec only. Subagents do not commit.

# 4. What is live (verify before quoting)

Product MCP:

- Service `smartsite-mcp`
- Revision last named `smartsite-mcp-00057-xuk` @100% tag `p554`
- Digest `sha256:4d749f3440e4421b3382b48c40a370dda1e4c4dd74c63b2cdcadec154f6005e4`
- URI `ui://smartsite/app-p554.html`
- Isolated tree `P:/tmp/legacy-design-tools-p91-stone` branch `feat/p91-wave-h-stone` base `006fd009` plus iframe hunks
- Do not write `P:/legacy-design-tools` or `P:/seat-worktrees/property/*`

Cortex:

- Service `cortex-api`
- Revision last named `cortex-api-00664-hib` @100% tag `p541`
- Digest `sha256:a93eb0924d951ba921ac355ba5258e7473c3b8bf6b04e22c97554e2244ee3bf3`
- Isolated tree `P:/tmp/legacy-design-tools-p91-cortex-leftover` branch `feat/p91-cortex-leftovers` HEAD `889b1556` plus leftover hunks
- Staging `00646-luj` stays 0%. Do not shift it.
- No `--set-env-vars`. No migrations for this cut.

Health: MCP `/health` has a `revision` field. Cortex `/api/healthz` is `{"status":"ok"}` with no revision. Traffic must be read as JSON by field name (`revisionName`, `percent`, `tag`), never a positional formatter.

An open Connect iframe that was not reconnected is still the old URI. `list_screens` / `create_screen` paint the widget. `add_to_screen` and `get_smart_site` do not replace it unless the host posts a result the iframe `accept()`s.

# 5. What the plan still owes

Source: `_inbox/2026-08-28_smartsite_mcp_app_WDLL.md`. Grades below are the card's, plus this session.

## Closed enough to leave alone

3, 4, 7, 17, 18, 19, 20, 27 (abbrev half), 28, 29, 30. Gold walk steps 1-6. F6 step 1. Cortex leftover-dup, create existence, add existence. Listing turn on gold (item 26 turn half).

## Still open on P-91

| Item | State | Why it is still a card item |
| --- | --- | --- |
| 1 annotations | partial | Code on an old revision. Connect `tools/list` unprobed on p554. |
| 2 situs compose | partial | Live stub 25420 ok. Saved-list leftover unprobed. |
| 5 unread | partial | Unit exists. Live unread cells are the gold dots on an unopened board, not a fifth-state grade. |
| 6 O5 five parcels | not a ship gate | HTTP bodies on four warm ids still leave-behind. |
| 8 setbacks | done as omit | Keep them off. Do not start O2. |
| 9 citation honesty | partial | Merged. Re-probe on current serving if you touch citations. |
| 10 ask_the_map leak | partial | Merged. Same. |
| 11 item 21 file | blocked | File the 13-tool catalog. Do not file an 8-tool listing. |
| 12 iframe chrome | partial | Stone on p554. Cream is gone. Customer-done is item 16, not this row. |
| 13 turn vs local | partial | Sort is local. Three-parcel scroll ungraded. |
| 14 no 14th tool | held | Catalog is 13. Keep it there. |
| 15 O3 ROW | not started | Do not walk `48021:34121`. |
| 16 customer-done | held gold n=1 | F6 step 2 FAIL. This is the live fight. |
| 25 I6 bare id | partial | Parser accepts bare draw. A Connect open with no screen membership is ungraded. |
| 26 I5 listing | partial | Turn half MET. Panel-byte half unmeasured on some runs. |

## Parked on P-92 (do not start)

21 drainage overlay. 22 zoning `codeRefs`. 23 reciprocity sweep. 24 selection language. Chrome / Gmail / file intake.

P-92 persistence already shipped under A-046. The WDLL sentence that says P-92 waits on item 16 is stale for screens and saves. It still holds for drainage and later intake.

# 6. The live defect (F6 step 2)

## What must be observed

Click Open on a resolved-looking miss. Send. One `get_smart_site`. Panel fail line is `Not on file in Bastrop`. No ring. Board stays. That sentence has never been observed.

What has been observed every time after Send: tool JSON in the chat, panel `Open did not reach me`.

## Plant history

F6 used `add_to_screen` `48021:900099` source `walk` on A13 `4316b571-…`. That write did not existence-check. The row is still resolved there. Do not use that board to retest existence. Do not Open `900099` if the point is existence. For the miss-sentence deep dive you need a node the board will Open and cortex will 404: either that old plant, or a real unbaked parcel, not `48021:900001` (create unresolved, no Open).

`baked_snapshot_not_found` is the same 404 for a never-parcel and an unbaked real parcel. The name is not proof the node exists. Three answers, one id: `create_screen` lookup unresolved, old `add_to_screen` resolved, `get_smart_site` bake-miss.

Query-alpha sorts `34169` above `900099`. People click the top teal row. Host then correctly holds. That is not a miss grade.

## Write path to read first

Stone tree, not leftover cortex, for the iframe:

- `P:/tmp/legacy-design-tools-p91-stone/artifacts/smartsite-mcp/src/mcp-app.ts`
  - `APP_HOST_TOOLS` is only `create_screen`, `list_screens`, `get_smart_site`
  - `sendOpen` starts a 12s timer (`OPEN_DEAD_MS`), sets `openWait`, posts `host.sendMessage`
  - `accept(result)` reads `result.content[0].text`, `parse`s, and only then can overwrite dead-Open with `Not on file in Bastrop`
  - `message` listener: init id, then `pendingMsg[d.id]`, then fallthrough `ui/notifications/tool-result` and `d.result.content`
  - `pendingMsg` hit with `d.result` and no `content` sets `reply=ok` and returns without `accept` (p553 tried to close this)
  - `d.error` on that id paints dead-Open on purpose
  - inline `parse` (around line 778) is a copy of `parseToolResult`. `{ parcels: [], notFound }` is `kind: "empty"`
- `P:/tmp/legacy-design-tools-p91-stone/artifacts/smartsite-mcp/src/tools.ts` `get_smart_site` case
- `P:/tmp/legacy-design-tools-p91-stone/artifacts/smartsite-mcp/src/tool-honesty.ts` `rewriteBakeMissForHost`, `getSmartSiteIsError`, `bakeMissHostPayload`
- Tests: `tests/mcp-app.test.ts` (isError accept, ok accept, 12s), `tests/tool-honesty.test.ts`

Leftover cortex tree, for existence only (already graded):

- `artifacts/api-server/src/lib/peScreenSave.ts` `addToScreen` 4th arg `lookup`
- `artifacts/api-server/src/lib/txgioAddressResolve.ts` `lookupParcelNodeForScreen`
- Do not deploy cortex from the stone tree. That snapshot would rewind `889b1556`.

## Two mechanisms that produce the same panel

Mechanism A (this seat, unproven as exclusive): the host delivers gold `get_smart_site` results into the iframe and leaves miss results in the chat only. `accept()` never runs. The timer paints silence. Rejected only if a recorded miss message reaches the listener.

Mechanism B (operator's challenge, start here): our listener drops a miss that the host did send. Candidates already in the file:

- `pendingMsg` consumed by an earlier `reply=ok` with no `content`, then the real result is ignored because we `return`d
- gold Open rides `ui/notifications/tool-result`; miss rides a `ui/message` reply shape we do not `accept`
- `isError` / rewritten 200 still does not match `pendingMsg` ids
- `parse` / `accept` run and then a second render from the timer (timer should be cleared in `accept`; prove it)
- two iframes or a stale URI (operator already corrected one stale-iframe misread on p554)

Code reading outranks output measuring. A check observed only passing has not been observed working. Pre-register what result would kill your mechanism before you run it.

## Punches already shipped (do not redo)

p551: 12s timer. Step 1 MET. Step 2 FAIL.
p552: `isError` calls `accept()`. FAIL.
p553: bake miss `isError` false; ok reply `accept`s `content`. FAIL.
p554: bake miss rewritten to `{ parcels: [], notFound }`. FAIL after Send.

Do not ship another resource URI until you have a host message dump or an in-tree violate.

# 7. Artifacts

| File | Purpose |
| --- | --- |
| `_inbox/2026-08-28_smartsite_mcp_app_WDLL.md` | Card of record |
| `_inbox/2026-08-29_p91_companion_ux_walk.md` | Gold walk |
| `_inbox/2026-08-29_p91_f6_step2_grade.md` | First step 2 FAIL |
| `_inbox/2026-08-29_p91_f6_p552_grade.md` | p552 FAIL |
| `_inbox/2026-08-29_p91_f6_p553_grade.md` | p553 FAIL |
| `_inbox/2026-08-29_p91_f6_p554_grade.md` | p554 FAIL after Send |
| `_inbox/2026-08-29_p91_leftovers_add_exist_grade.md` | add existence MET |
| `_inbox/2026-08-29_p91_leftovers_p541_deploy.md` | cortex digest-pin |
| `_scratch/p91-listing-bind.md` | Tier 2. Read first. Do not promote. |
| `_decisions/2026-08-28_smartsite_mcp_app_screen_save_decouple.md` | I5 I6 screen/save |
| `_canvases` local: `smartsite-mcp-loop.canvas.tsx` | Path board. `smartsite-mcp-app.canvas.tsx` is a stale encyclopedia. |

# 8. Stakeholder updates

None. This is an internal handoff. Do not message Sylvia, directory reviewers, or Anthropic.

# 9. Context the next agent must inherit

Seat: if you write doc_repo, you are integration on `P:/doc_repo` `main`. If you write LDT, use the named isolate. Confirm with `_catalog/seat_register.json` and `scripts/enforcement/seat-worktree-gate.mjs`. Do not work in another seat's checkout.

Read first: this file, `_STATE.md` standing decisions, `MEMORY.md` top lines, the WDLL, `_scratch/p91-listing-bind.md`, then `mcp-app.ts`.

Do not: 14th tool, listing feed, web in the panel, map in Claude, Cotality, `--set-env-vars`, deploy from stone to cortex, write Wave 1 trees (`P:/tmp/hauska-map-mcp-login-stone`), walk a ROW (`48021:34121`), `save_property` on 34169, re-save 36105, add-all, subagent commits.

Do: state your snapshot (repo, branch, commit). Verify serving by field name. Leave `leave_behind` in your close. Flag lessons in the scratch file. Do not self-promote to MEMORY.md.

# 10. Suggested first day

1. Snapshot MCP and cortex traffic as JSON. Confirm p554 / p541 or write the new names.
2. Read `sendOpen`, `accept`, and the `message` listener until you can name which branch paints dead-Open without `accept`.
3. Add an in-iframe log of every inbound message (method, id, result keys, content length, isError). That is an instrument, not a URI bump.
4. One Connect miss Open. Read the log you just painted. Then decide mechanism A vs B with a second mechanism written down.
5. Only then change code. Violate the new check before you claim it.

leave_behind: this handoff; dirty stone tree; dirty leftover cortex tree; A13 historical `900099` resolved row; item 16 unclosed.
