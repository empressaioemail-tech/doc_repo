# Scratch: P-91 listing bind (Wave D follow-up)

## GROUND-TRUTH

2026-08-29T04:05Z: Operator scored outcome 1 on serving `smartsite-mcp-00031-jih` / #541. Label sat still. Host had nothing to drop. Residual: throw before the label flip would look identical. Defect is the panel, not `ui/message`.

## LESSON

Board paint proving script ran on `create_screen` does not prove the `get_smart_site` parcel iframe is a live document with listeners. Host may snapshot painted HTML (button visible, listeners gone). Split: `#boot` starts `script-off` and flips to `script-ran` at script start; header also paints `script-ran` only if `render()` ran; clicks delegate from `document.body`; label flips before `listingHistoryMessage` or `postMessage`.

## OPEN

LDT #542 squash `f4cc90bc` serving `00033-hin` @100% `p542`. Digest `sha256:754e1124…`. Fresh Connect: create screen, Open Pine, click listing. Report `script-ran` visibility and whether the label flips. Do not start Wave H or A5 forty until that score.

Wave H next, not A5. They cannot use the product while the widget looks dead and clicks do nothing. A5 is a coverage probe.

## GROUND-TRUTH

2026-08-29T04:42Z: Listing local ack earned. Parcel panel boot `script-ran`, header `script-ran`, label `Requesting listing history`, `Posted 281 chars`. 281 equals `listingHistoryMessage` for `908 PINE , BASTROP, TX 78602`. No transcript turn. Score `host_drop`. Open on the board still produced no turn. Our `ui/message` is a JSON-RPC notification (no `id`). Spec and ext-apps send it as a request with an `id`. That is the next cheapest host_drop fix. #543 squash `b8e0b751` serving `00035-tov` @100% `p543`, digest `sha256:b0071cddc1f6c17ec93b4a449ffa5dcba8f207e776a8e8109c595f8a82f58b95`. `ui/message` now has `id:rpcId++`. Resource URI `ui://smartsite/app-p543.html`. Reconnect required. If label flips and a turn still does not land, host_drop is still the score and the next miss is not the missing id.

## GROUND-TRUTH

2026-08-29T05:24Z: Connect on `00035-tov` / p543 scored `host_drop`. Screen `93468d11-35b3-4afd-93c1-407ca3f06ca1`. Label Requesting listing history, Posted 281, no turn, no tools after click. Open typed. Envelope refused `atom_path_pending`. No 42%. Evidence `_inbox/2026-08-29_p91_listing_host_drop.md`. Next miss is initialize-then-wait, not another id and not another listener.

## GROUND-TRUTH

2026-08-29T05:44Z: LDT #544 squash `62980e5b` serving `smartsite-mcp-00037-xoz` @100% tag `p544`. Digest `sha256:35268e308e6dc3100ea504b8eea5eba4b163904b37d6acdce4658723454e5641` on the revision, minScale=1. Live `/health` names `00037-xoz`. Tools (13). Cortex still `00656-vek` @100% tag `p539`. Staging `00646-luj` still tag `staging` at 0%. URI `ui://smartsite/app-p544.html`. Reconnect required. If listing still `host_drop`, stop treating it as a widget bind bug.

## GROUND-TRUTH

2026-08-29T05:54Z: Connect on `00037-xoz` / p544 scored `host_drop`. Screen `0dcbe31b-8b2f-46a1-b8aa-30587df8ad35`. Label Requesting listing history, Posted 281, no turn, no tools after click. After Posted the host sat (`Thought for 11s`) and the chat went unresponsive. Ack did not un-paint. Open typed. Envelope refused `atom_path_pending`. No 42%. Evidence `_inbox/2026-08-29_p91_listing_host_drop_p544.md`. Handshake wait is closed. Do not add a listener. Do not start Wave H or A5.

## GROUND-TRUTH

2026-08-29T06:12Z: LDT #545 squash `479213ec` serving `smartsite-mcp-00039-req` @100% tag `p545`. Digest `sha256:381e34a4d4dcbfff16586db3839da1630ff52f99b56261521ffb826866f3b91a` on the revision, minScale=1. Live `/health` names `00039-req`. Tools (13). URI `ui://smartsite/app-p545.html`. `ui/message` content is now the spec object. Reconnect required. If listing still `host_drop`, park listing and come back. Wave H stays parked.

## GROUND-TRUTH

2026-08-29T06:35Z: Fresh planner diagnosis `_inbox/2026-08-29_p91_listing_fresh_read.md`. Not a bind bug. Host answers initialize with hostCapabilities.message (optional) and ui/message with isError. We discarded both. p545 content object fails schema.json (array is normative). Do not grade p545. Next ship is read_the_reply, zero bind-logic change.

## GROUND-TRUTH

2026-08-29T06:53Z: LDT #546 squash `006fd009` serving `smartsite-mcp-00041-caj` @100% tag `p546`. Digest `sha256:a9f1c5ece60ee50a2e6d220562985e891a95b85cb0819cf92abb57b28f1518d3` on the revision, minScale=1. Live `/health` names `00041-caj`. Cortex still `00656-vek` @100% tag `p539`. Staging `00646-luj` still tag `staging` at 0%. URI `ui://smartsite/app-p546.html`. Instrument only. Click path unchanged. Do not grade p545.

## GROUND-TRUTH

2026-08-29T06:57Z: Connect on `00041-caj` / p546 scored `working`. Screen `d5a2b761-7c6a-4aca-9e09-b2e43fb7bb44`. Listing turn landed in the required `Find listing history for 908 PINE , BASTROP, TX 78602` shape. Guard held: web_search x2, no `ask_the_map`, no Smart Site research. Envelope refused `atom_path_pending`. No 42%. Open typed. Boot strip, label, Posted N, composer, panel stability unmeasured. `host_consent` ruled out by the turn existing. Evidence `_inbox/2026-08-29_p91_listing_working_p546.md`. Wave D listing unblocked. Wave H and Open stay separate.

## OPEN

If the iframe is still open, read the boot strip verbatim and whether the panel changed besides the ack. Not required to keep the `working` score. Next product call is Wave H (Stone) or Open, not another listing protocol ship. A5 forty still parked.

2026-08-29T01:59-05 integration board: took Wave H as the next call. Open stays a separate dead click. Wave H does not start until Nick says go. Interview prompt already filed `_inbox/2026-08-29_p91_ui_agent_stone_questions.md`.

## GROUND-TRUTH

2026-08-29T07:16Z: Wave H painted in isolated tree `P:/tmp/legacy-design-tools-p91-stone` branch `feat/p91-wave-h-stone` (base `006fd009`). URI `ui://smartsite/app-p547.html`. Tests 86/86 in that tree. Live still `00041-caj` / p546. Leftover: `--bg:#1c1c1c` has no `--ss-*` name. Keys `--ss-t6`. Listing button `--ss-blue`. Node id `--ss-atom`. Unknown `--ss-t5`. Envelope reason `--ss-slate`. Contract still requires `data-theme="claude"` and `btn primary`. Deploy waits on Nick. Evidence `_inbox/2026-08-29_p91_wave_h_paint_leftover.md`. Do not write the listing agent tree. Open and 3.8 copy stay owed.

## OPEN

Paint is in-tree only. Say deploy for p547 (digest-pin, no env, leave cortex). Or say commit. Open stays typed. A5 forty stays parked.

## GROUND-TRUTH

2026-08-29T07:21Z: p547 serving. `smartsite-mcp-00043-mex` @100% tag `p547`. Digest `sha256:3f1718cb5edfbdc1476216cecc89cd7d067c94e697143e10193d5602ee1f8f31` on the revision, minScale=1. Live `/health` `revision` is `smartsite-mcp-00043-mex`. Cortex still `00656-vek` @100% tag `p539`. Staging `00646-luj` still tag `staging` at 0%. URI `ui://smartsite/app-p547.html`. Tools (13). Reconnect required. Not a customer-done paint grade. Evidence `_inbox/2026-08-29_p91_wave_h_p547_deploy.md`.

## OPEN

Reconnect and look at the iframe. Open stays typed. 3.8 copy stays owed. A5 forty stays parked. Commit of the stone tree waits on Nick.

## GROUND-TRUTH

2026-08-29T08:00Z: Wave I serving. `smartsite-mcp-00045-kes` @100% tag `p548`. Digest `sha256:f19261461bedb02599f0ad1680723ac8f72df4b15969bc9b7ff487bcb467021d` on the revision, minScale=1. Live `/health` `revision` is `smartsite-mcp-00045-kes`. Cortex still `00656-vek` @100% tag `p539`. URI `ui://smartsite/app-p548.html`. Isolated tree still dirty on `feat/p91-wave-h-stone` base `006fd009`. Tests 89/89. Open turn opener is `Open this parcel`. Envelope human at render. Ring and edges only from the tool result. Not a customer-done walk grade. Evidence `_inbox/2026-08-29_p91_wave_i_p548_deploy.md`.

## GROUND-TRUTH

2026-08-29T15:04Z: Wave I Connect grade on `smartsite-mcp-00047-vos` / p549, screen `366eabd8-1e03-42c4-97e4-f907d452ce53`. `score_open` typed. `score_draw` ring_and_edges. `score_i1` held. Envelope human MET. Not customer-done. Open button renders. Every Open turn was pasted. Rainmaker has no ring. Evidence `_inbox/2026-08-29_p91_wave_i_connect_grade.md`.

## LESSON

2026-08-29T15:18Z: Clicking Open fills Claude's composer with `Open this parcel …`. That is the widget posting `ui/message`. The host drafts it for consent. It is not a typed paste. `reply=ok` on the boot strip after create_screen already showed a send was accepted. Deleting the draft and asking for a "clean" click will recreate the same draft. Send is the rest of the turn.

## GROUND-TRUTH

2026-08-29T15:21Z: Open leftover closed on screen `bcfbf326`. Click filled composer. Send ran `get_smart_site` once, depth node, no save. Parcel node teal. Envelope human visible. Wave I items 1-4 held on gold. Wave J unstarted.

## LESSON

2026-08-29T15:24Z: Widget-authored Open draft named `save_to_screen` and `find_listing_history`, neither in the catalog. Host cannot tell draft from typed. Listing button is the Wave D web turn, not a missing tool. Findings `_inbox/2026-08-29_p91_wave_i_findings.md`.

## GROUND-TRUTH

2026-08-29T15:33Z: Open punch plus Wave J serving. `smartsite-mcp-00049-duw` @100% tag `p550`. Digest `sha256:5958d8a5a3020aa430aed85f4e633356c0fb77f081aba0ec947204f080ee3ab0` on the revision, minScale=1. Live `/health` `revision` is `smartsite-mcp-00049-duw`. Cortex still `00656-vek` @100% tag `p539`. URI `ui://smartsite/app-p550.html`. Isolated tree still dirty on `feat/p91-wave-h-stone` base `006fd009`. Tests 92/92. Open instruction names `save_property` and forbids web search. No ghost tools. F5/F6 copy bound. Listing stays the Wave D web turn. Not a customer-done walk grade. Evidence `_inbox/2026-08-29_p91_wave_j_p550_deploy.md`.

## GROUND-TRUTH

2026-08-29T15:50Z: Wave J Connect frames on p550, screen name `Bastrop walk`. Open punch MET. Item 5 legend MET. Item 6 zzzz slot MET; F5/F6 unmeasured. Item 7 buttons MET (`Save property`, `Find listing history`); listing turn not clicked. Gold draw still holds. Evidence `_inbox/2026-08-29_p91_wave_j_connect_grade.md`.

## GROUND-TRUTH

2026-08-29T15:52Z: Listing click on p550 gold. Button ack `Requesting listing history`. Turn posted in the Wave D shape. Guard in the text. Panel overlays unchanged. Connect then refused web search (walk-rule collision + claimed missing `find_listing_history` tool). Item 7 is `turn_posted`, not `working`. Do not add a 14th tool.

## GROUND-TRUTH

2026-08-29T15:54Z: Listing `working` on p550 gold. Transcript-only: 2005 list $265,000 / sold $216,000, TX non-disclosure caveat, no current copy. Guard held. No ask_the_map. Nothing written to the panel. Item 7 closed. F5/F6 still unmeasured.

## GROUND-TRUTH

2026-08-29T15:59Z: F5 MET on p550. A5 forty `create_screen` HTML 500 twice. No screen written. Cap is 50. Resolver throw / leaked 20s situs search under 8s row timeout is the write-path reading. Evidence `_inbox/2026-08-29_p91_a5_forty_500.md`. Do not deploy cortex from this seat.

## GROUND-TRUTH

2026-08-29T16:12:37Z: A5 four POST /screens 500 in 1.84s on `00656-vek`. GET /screens 200. Bastrop walk POST 200 at 15:45:24Z. Two forties 500 at 15:58. Cortex tag still p539. Fast 500 rejects a hung 20s search; does not reject a starved pool that fails checkout. Evidence in `_inbox/2026-08-29_p91_a5_forty_500.md`.

## GROUND-TRUTH

2026-08-29T16:39:14Z: `A5 one` create_screen 200. Pine `48021:34137`. Write path alive. n=4 and n=40 still 500 in the earlier window.

## GROUND-TRUTH

2026-08-29T16:41Z: n=1 bare `48021:34137` 200. Node-id path is not the solo defect. n=4 with node still 500 after n=1 200s. n=3 at 15:45 is stale.

## GROUND-TRUTH

2026-08-29T16:44Z: n=3 200. n=4 no-node 200. Failing n=4 had Pine plus `48021:34137`. Unique index `pe_screen_rows_screen_node_uidx`. create_screen does not catch the collision. Forty list is poisoned with the same duplicate.

## GROUND-TRUTH

2026-08-29T16:46Z: A5 two same-node (Pine + `48021:34137`) 500. Confirms unique index collision. Cortex untouched. Forty not rerun.

## LESSON

`create_screen` resolved then inserted with no duplicate check. `add_to_screen` already dedups. Null nodes do not collide. Address + bare id for the same parcel is the repro.

## GROUND-TRUTH

2026-08-29T16:54Z: A5 unique forty 200. Item 18 MET. Item 30 MET. 40 rows. Pine `48021:34137`. Rainmaker `48021:8720522`. Last six unresolved, no Open. Cortex still `00656-vek`. Grade `_inbox/2026-08-29_p91_a5_forty_grade.md`.

## LESSON

A node-id string that parses is written `resolved` even when no parcel exists (`48021:90000x`). That is parse, not found. Fat-finger Open is the leftover. Not an A5 fail.

## GROUND-TRUTH

2026-08-29T16:59:17Z: A13 MET. Screen `4316b571-c7d2-4b9f-9e50-4f7a16dbfa94`. Live neighbor `48021:34169` from gold `draw.edges` boundary 1. Source `walk`. Saves 16→16. Board paints both Opens. Query-alpha sort puts the node id above Pine.

## GROUND-TRUTH

2026-08-29T17:03Z: Item 19 MET. Screen-only `48021:34169` refused. `48021:25420` wrote Watching. A13 screen untouched. Second list reported 15 and named `48021:36105` missing.

## LESSON

`GET /saved-properties` has no LIMIT. Status update bumps `updatedAt` on one row. A reported 16→15 after that write is not a 15-row cap. Confirm 36105 with a second list before calling it data loss.

## GROUND-TRUTH

2026-08-29T17:07Z: Re-list 16. `48021:36105` present, id `db43d173`, `updatedAt` unchanged `2026-07-29T16:37:27.103Z`, last row. `48021:25420` Watching at top. `48021:34169` absent. Item 19 count MET. Item 20 MET. 16→15 was transcript truncation.

## LESSON

A raw save count is not a reliable A-item check once the list is long enough to truncate on the way into context. Specific ids present or absent survive. A count does not. Flag truncation at the time, not after a delete-versus-cap frame.

## GROUND-TRUTH

2026-08-29T17:18Z: F6 step 1 screenshot is setup, not a grade. A13 walk board painted (`48021:34169` + Pine). Rails unread. No fail sentence. Operator still has to click Open on `48021:34137` and not Send. Pass is `Open did not reach me`. Fail is `Not on file in Bastrop`. Old iframe (p550) has no timer.

## GROUND-TRUTH

2026-08-29T17:39Z: Cortex leftovers serving. `cortex-api-00660-bux` @100% tag `p540`. Digest `sha256:0c12685330e82e41fe46265138cab68c6fb9611e3f375d6173d5855eb49077d0`. Built from leftover tree on `b5fc2e87` plus the two leftover hunks. Wave 1 had already moved prod to `00658-peq` / `canary` (digest `e6cd1fb2`) before this shift. Not a customer-done grade. Evidence `_inbox/2026-08-29_p91_leftovers_p540_deploy.md`.

## GROUND-TRUTH

2026-08-29T17:46Z: F6 step 1 MET. Panel `Open did not reach me`. Composer unsent. Clicked `48021:34169` not Pine. Same on-file mechanism. Step 2 unmeasured.

2026-08-29T17:46Z: Cortex leftovers MET on `00660-bux` / p540. leftover-dup JSON `duplicate_resolved_node`. leftover-absent `48021:900001` unresolved, no Open. Grades `_inbox/2026-08-29_p91_f6_step1_grade.md` and `_inbox/2026-08-29_p91_leftovers_cortex_grade.md`.

## GROUND-TRUTH

2026-08-29T17:49Z: F6 step 2 planted. `add_to_screen` wrote `48021:900099` resolved/walk on A13 `4316b571-…`. Not graded. `create_screen` would refuse the same id. After F6 scores, that intake split is the next leftover.

## GROUND-TRUTH

2026-08-29T17:52Z: F6 step 2 click landed on `48021:34169` (query-alpha top), not `48021:900099`. Host held. No `get_smart_site`. Step 2 still unmeasured. Same miss as step 1 (clicked 34169 instead of Pine).

## GROUND-TRUTH

2026-08-29T17:54Z: Operator looked at leftover-absent (`48021:900001`, no Open). That is the existence-check pass. F6 step 2 is `48021:900099` on A13 `4316b571-…` via `add_to_screen`, which still paints Open.

## GROUND-TRUTH

2026-08-29T17:58Z: F6 step 2 Open reached on `48021:900099`. One `get_smart_site`. JSON `baked_snapshot_not_found`. No draw. Panel `Not on file in Bastrop` not in the shot. Grade `_inbox/2026-08-29_p91_f6_step2_grade.md`.

## GROUND-TRUTH

2026-08-29T18:01Z: F6 step 2 FAIL. Board painted `Open did not reach me` after `get_smart_site` `baked_snapshot_not_found` on `48021:900099`. isError path treated a tool error as silence. Grade `_inbox/2026-08-29_p91_f6_step2_grade.md`.

## LESSON

A tool `isError` is a result. Dead-Open is only the 12s timer. The host replies to `ui/message` with `isError` and does not also send `ui/notifications/tool-result`, so the reply handler must `accept()`.

## GROUND-TRUTH

2026-08-29T18:11Z: p552 serving. `smartsite-mcp-00053-jup` @100%. Digest `sha256:92ae83aec2e520f056076ee349d713aef71f4feea6f926c6a4515dc92b684915`. Prod `/health` `revision` is `smartsite-mcp-00053-jup`. URI `ui://smartsite/app-p552.html`. Tests 95/95. Evidence `_inbox/2026-08-29_p91_f6_p552_deploy.md`.

## GROUND-TRUTH

2026-08-29T18:14Z: Claimed p552 reopen still painted `Open did not reach me` on list_screens. That is the p551 fail document. Tool 404 unchanged. Panel after Open not in the shot. Not a p552 grade. Evidence `_inbox/2026-08-29_p91_f6_p552_not_graded.md`.

## GROUND-TRUTH

2026-08-29T18:17Z: Fresh A13 board, no fail sentence. Three Opens including `48021:900099`. This is the p552 gate. Not a step-2 grade.

## GROUND-TRUTH

2026-08-29T18:19Z: p552 Open on `48021:900099` reached. Same `baked_snapshot_not_found`. Other chat refused to score JSON. Post-tool panel still not in the shot. Step 2 still unmeasured.

## GROUND-TRUTH

2026-08-29T18:22Z: F6 step 2 FAIL on p552. Fresh board, then Open `900099`, then `Open did not reach me`. Host thought 16s. Timer won. 404 stayed in chat. p553 punch: bake miss is `isError` false; ok reply `accept()`s content.

## GROUND-TRUTH

2026-08-29T18:29Z: p553 serving. `smartsite-mcp-00055-qan` @100%. Digest `sha256:f91765bfb93f5ab60e137ff975e54710e369372e4037f658caee31b657190a54`. URI `ui://smartsite/app-p553.html`. Tests 98/98. Evidence `_inbox/2026-08-29_p91_f6_p553_deploy.md`.

## GROUND-TRUTH

2026-08-29T18:58Z: F6 step 2 FAIL on p553. Gates held. Tool 404 in chat. Panel `Open did not reach me`. Host kept the `error` body out of the iframe. Grade `_inbox/2026-08-29_p91_f6_p553_grade.md`.

## GROUND-TRUTH

2026-08-29T19:04Z: p554 serving. `smartsite-mcp-00057-xuk` @100%. Digest `sha256:4d749f3440e4421b3382b48c40a370dda1e4c4dd74c63b2cdcadec154f6005e4`. URI `ui://smartsite/app-p554.html`. Tests 100/100.

## GROUND-TRUTH

2026-08-29T19:15Z: F6 step 2 FAIL on p554. Fail sentence was after Send, not a stale iframe. This seat misread that. Grade `_inbox/2026-08-29_p91_f6_p554_grade.md`.

## GROUND-TRUTH

2026-08-29T19:22Z: Operator go on `add_to_screen` existence. Live cortex at that moment was `cortex-api-00662-hij` @100% tag `canary`, digest `sha256:74bc10312707324de360b44d33c93e2600c5fc83df2b3d118451afbc0c1ed3ed`. Not p540. Leftover tree fast-forwarded `b5fc2e87` → `889b1556` (PR #548) so p541 does not rewind Wave 1. A13 `4316b571-…` already has `48021:900099` written resolved; re-add is idempotent and keeps Open. Grade on a new screen.

## GROUND-TRUTH

2026-08-29T19:35Z: p541 serving. `cortex-api-00664-hib` @100% tag `p541`. Digest `sha256:a93eb0924d951ba921ac355ba5258e7473c3b8bf6b04e22c97554e2244ee3bf3`. Base `889b1556` plus leftover hunks. MCP still `00057-xuk` / p554. Tests: peScreenSave 17/17, resolve 4/4. Route suites did not collect in this isolate (cad-ingest specifier). Evidence `_inbox/2026-08-29_p91_leftovers_p541_deploy.md`.

## GROUND-TRUTH

2026-08-29T19:54Z: leftover-add-exist screen `36e51f5a-2ed9-4778-b378-890a786a3e26`. Frame still one Pine row. Shot's tool report: `900099` unresolved null, `34169` resolved walk. Paint unmeasured. Serving still `00664-hib` / p541. Other chat's "stone / p539" line is false. Grade `_inbox/2026-08-29_p91_leftovers_add_exist_grade.md`.

## GROUND-TRUTH

2026-08-29T19:57Z: leftover-add-exist paint MET. Screen `36e51f5a-2ed9-4778-b378-890a786a3e26`. `900099` no Open, slot `Nothing to open until this resolves`. `34169` Open. Serving `00664-hib` / p541. Grade `_inbox/2026-08-29_p91_leftovers_add_exist_grade.md`.

## LESSON

2026-08-29T21:34Z: Deep dive `_inbox/2026-08-29_p91_mcp_app_deep_dive.md`. Mechanisms A and B were both half. Claude mounts one app instance per tool call. Gold parcel is the `get_smart_site` iframe (named in this file 2026-08-29T04:05Z). `ui/message` reply is `{}`. The clicking board's 12s timer paints dead-Open on gold and miss. `NOT_ON_FILE` is unreachable in the instance the host runs. Four punches changed miss shape, not instance.

## OPEN

O1–O3 on p554 before any deploy. Prompt `_inbox/2026-08-29_p91_p554_three_observations.md`. If O2 kills (board becomes the parcel), withdraw the deep dive. Do not commit leftover hunks until fail-open existence is fixed. Do not ship p555. A13 still holds resolved `900099`.

## OPEN

2026-08-29T15:33Z: Outer chat asked how to get a flood study into Smart Site. There is no ingest path in the 13 tools. `create_screen` takes query strings. `get_smart_site` / `run_report` / `export_instrument` are read-side. `save_property` notes land on a CRM row, not a facet. `request_records` is not live. A local study belongs as a flood facet in the bake, same atom-path blocker as envelope `atom_path_pending`. Do not start that from this companion walk. Need form and coverage (LOMR vs city drainage vs H and H; parcel bind vs polygon) before any card.

## LESSON

2026-08-29T06:57Z: Three `host_drop` scores were looking at a proxy. The product outcome is a transcript turn in the required shape with the guard held. `read_the_reply` plus the schema array is what the host accepted. `host_consent` is a waiting composer, not a posted turn. Boot strip names the mechanism. It is not required to keep `working` once the turn exists.

Missing `script-ran` is not one mechanism. Three: CSP/strip, frozen snapshot that keeps `script-off`, and an old iframe with no `#boot` at all. Presence first. No boot strip, or no Open on a resolved row, is `00031-jih` (or earlier). Reconnect. Do not score CSP from absence.

## GROUND-TRUTH

2026-08-29 (deep dive, integration on main 2847a20): Serving read as JSON by field name: smartsite-mcp-00057-xuk 100% p554; cortex-api-00664-hib 100% p541. Mechanism is neither A nor B. The host mounts one app instance per tool call; the gold parcel painted in the `get_smart_site` instance, not the board. `ui/message` reply is `{}` (spec: host must not return follow-up results). NOT_ON_FILE is reachable only inside the instance that clicked Open, which is the one instance the result never reaches. Two independent harnesses (`_inbox/2026-08-29_p91_iframe_instrument.mjs`, `_inbox/2026-08-29_p91_iframe_harness.mts`) agree. Live `ask_the_map` on gold with the two documented args: `invalid_request`, "Provide runId, address, or areaContext". Write-up `_inbox/2026-08-29_p91_mcp_app_deep_dive.md`.

## LESSON

Four punches changed what the miss looked like and what the board's reply handler did; none changed which instance the result reaches. When N orthogonal changes leave an observable byte-identical, the defect is not in the domain those changes address. The grading scripts scored "the panel" meaning the board and never asked anyone to look under the tool row; the unobserved half is where the result went. A sentence that is present in the HTML and satisfies a presence grep can still be unreachable in the flow the host runs; the harness, not the grep, is the check.

## LESSON

`ui/message` is a composer draft and an ack on Claude. The spec-sanctioned way for an existing instance to get fresh data is app-initiated `tools/call` (`hostCapabilities.serverTools`). Read the boot strip `caps=` before designing around the host; it has never been recorded on any grade.

## GROUND-TRUTH

2026-08-30 (build to deploy, integration): serving pair smartsite-mcp p556 (`00061-zik`, digest 3de92afc) and cortex-api p542 (`00666-cuf`, digest da92e63a), both by field name. #550 squash-merged `42d56c32` (Test SUCCESS, Typecheck SUCCESS). Live through the planner's connector: `900099` -> `parcel_not_found, parcelExists false`; `ask_the_map` -> `not_ready`; fresh screen rows carry `stub`/`stubRead` on create and on read; batch stub returns flat rails plus `notFound`. Close `_inbox/2026-08-29_p91_build_close.md`; CP2 `_inbox/2026-08-29_p91_build_cp2.md`.

## LESSON

The live batch stub carries rails flat on the parcel; the build plan wrote a nested `stub` from memory of the screen-row shape and S1 built to it. Caught only by a live call after the shift, fixed in p556. A wire contract written from the plan is a claim; one live call per shape before the fan is the check.

## LESSON

Two suites the isolate could not collect (`propertyExplorerRecordsRequest*`) were the ones that went red on CI: a direct `txgioAddressResolve` import in the route reached a module-load table read behind a hand-listed `@workspace/db` mock. Route the probe through the seam the tests already mock (`cortexNodeLookup`). When a suite cannot collect locally, name it as the CI risk before pushing, not after.

## LESSON

The seat gate refuses git writes from every second worktree of one repo path (`product_index_foreign`), and the primary LDT worktree carried P-85. The honest path was to register the standalone clones under the property seat with their own path and prove the gate in both directions, not the override env.

## GROUND-TRUTH

2026-08-30 (continuation): p557 serving `smartsite-mcp-00063-rej` (icons, redirects, find_parcel parcels-only + `located`, bakedAt wording), #552 squash `7cbe0bc4`. Smart Site mark tile ink live: hauska-map #315 `a275a459`, Vercel `property-explorer-limy5bkix`, five icon URLs changed bytes, live corners rgba(50,50,52,255). Operator QA walk on p556/p542 recorded the boot strip for the first time: `caps=` includes `serverTools` and `updateModelContext`.

## LESSON

The three raster icons on main had never been rendered from the SVG; two marks were in the wild under one name and nobody could regenerate either. A "colour-only" asset change is the moment that surfaces. Measure the old raster before rendering the new one, carry both geometries by name in one script, and make the check decode the files on disk.

## LESSON

The connector card icon is whatever the product site serves at the URLs the server names; our server named none, so the card took the site's icon. Name the icons explicitly (`serverInfo.icons`) so the card follows the product on reconnect and the source is never a guess again.
