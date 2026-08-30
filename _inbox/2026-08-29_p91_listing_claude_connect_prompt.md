---
id: 2026-08-29_p91_listing_claude_connect_prompt
title: Fresh Claude Connect prompt to grade the Smart Site MCP App
date: 2026-08-29
status: ready
plan_row: P-91
serving: smartsite-mcp-00041-caj
---

# How to run

Disconnect Smart Site MCP. Reconnect it. New chat after that reconnect. The app URI changed to `ui://smartsite/app-p546.html`. An old chat still has the p545 document that sent `ui/message` content as an object.

Connector is `https://mcp.smartsite.cloud`, not Hauska. Paste everything below the line into Claude. You click. Claude does tools and JSON only.

Do not grade p545. This run is `read_the_reply`. The boot strip and the message composer are the instruments. The transcript alone is not.

---

You are grading Smart Site MCP in this conversation. Use only Smart Site tools, not Hauska. You cannot see the widget DOM and you cannot click it. After each tool call, report the JSON, then stop and ask the operator for any painted fact. Write `unmeasured` if they have not reported it. Do not guess. Do not invent a 42 or lot-coverage percent. Do not write web listing copy into the board or panel. Do not call `ask_the_map` unless a later step says the listing guard failed.

Last score, do not relitigate: p542 through p544 earned `host_drop`. p545 is ungraded and is a probable regression (content sent as an object; schema requires an array). This chat is testing `read_the_reply` on `app-p546.html`. The click path is unchanged. The host already answers whether `ui/message` is supported and whether a send failed. Score from the boot strip and the composer, not from transcript absence.

Gold is `48021:34137`. CAD situs is `908 PINE , BASTROP, TX 78602` (space before the comma, no ST). Junk is `zzzz-not-a-situs-99999`.

## Hands

You: `tools/list`, `create_screen`, `get_smart_site` only when the operator says Open is dead, `list_screens`, `save_property` if they say Save did nothing, web search only after a listing turn lands.

Operator: boot strip (the whole line), Open button, listing label, every click, the message composer after the listing click.

Host chrome (`Smart Site` plus a tool name) is not the widget header.

## Boot strip (operator reads this verbatim)

Expected shape after script runs:

`script-ran handshake=<state> caps=<keys|none|empty|unread|error> message=<none|yes|modalities|unread|error> reply=<none|ok|isError|<code>|empty>`

`handshake=` is `wait`, `ready`, `error`, or `timeout`.
`message=none` means the host declared no `ui/message` capability. Stop after the listing click and say so. Do not score a fifth `host_drop`.
`reply=` stays `none` until the listing click. After the click it must become `ok`, `isError`, a JSON-RPC error code, or `empty`.

## Step 1. Catalog

Name every Smart Site tool. Report the count. If it is not 13, stop.

## Step 2. Screen

Call `create_screen` with exactly `908 Pine, Bastrop TX` and `zzzz-not-a-situs-99999`. Do not save. Do not open a parcel.

Report from JSON: screen id; each row query, resolution, parcelNodeId; Pine to `48021:34137`; zzzz unresolved with the original query.

Then ask the operator:

- Is there a ninth empty column after ENVELOPE, and an Open button on Pine?
- Is there an Open button on zzzz? There must not be.
- Boot strip verbatim (must include `handshake=`, `caps=`, `message=`, `reply=`)
- Does the card header show `script-ran`?

If they report no Open and no ninth column: `old_iframe`. Tell them to disconnect, reconnect, new chat. Stop.
If they report boot `script-off` or a strip without `handshake=`: `script_dead` or `old_iframe`. Stop.
If Open is present or header/boot is `script-ran`: continue.

## Step 3. Open

Ask the operator to click Open on Pine once. Do not call `get_smart_site` yourself.

If they say the button does nothing (no hover, no turn): mark `open_path: typed`. Then they will paste: `Open parcel 48021:34137 with get_smart_site depth node. Do not save it.` You may run that tool call after they paste it. Open stays failed. The parcel panel can still be graded.

## Step 4. Parcel

From the tool JSON report: draw label, envelope state and reason (pass is refused / `atom_path_pending`), any 42 or lot-percentage (must be none), any listing copy already in the payload (must be none).

Ask the operator: boot strip verbatim; header `script-ran`; listing button label (must still be Find listing history); Save property visible.

If `message=none` already, note it. Still do the listing click once. The reply field is what confirms a send was attempted.

## Step 5. Listing click

Ask the operator to click Find listing history once. You do not click. You do not retry. You do not call `ask_the_map`. You do not search the web yet.

Then report: did a user turn appear that starts with `Find listing history for`? Which tools ran after the click?

Ask the operator:

- Did the label become Requesting listing history?
- Did Posted N chars appear?
- Did overlays change besides that ack?
- Boot strip verbatim after the click (`handshake=`, `caps=`, `message=`, `reply=`)
- Look at the message composer and any permission or consent chip. The spec says the host MAY request user consent. Report what is there, including absence.

Score from the instruments, not from transcript absence alone:

- `old_iframe` or `script_dead` (should have stopped earlier)
- `handler_unbound` (new build, label did not change)
- `message_unsupported` (`message=none` on the boot strip)
- `host_reject` (`reply=isError` or `reply=<code>`)
- `handshake_timeout` (`handshake=timeout`)
- `host_consent` (`reply=ok` and a composer or consent chip is waiting)
- `host_drop` (label flipped, `reply=ok`, composer empty, no listing turn)
- `guard_failed` (listing turn appeared and `ask_the_map` or research ran)
- `working` (listing turn appeared)

If `message_unsupported`, `host_reject`, `handshake_timeout`, or `host_consent`, stop. Do not search the web. Do not add a listener.

If the label did not change, stop. Do not search the web.

## Step 6. Listing answer

Only if a turn landed that tells you to search the public web: search for prior sales, price cuts, and listing copy for `908 PINE , BASTROP, TX 78602` / `48021:34137`. Answer only in this transcript. Cite sources. If you find nothing, say so. Do not call `ask_the_map`. Do not write into the board or panel. Ask the operator whether the panel stayed the same aside from the ack.

## Step 7. Save

Only if steps 2 to 4 worked. `list_screens` on this screen. Record row ids, queries, `updatedAt`. Ask the operator to click Save property, or call `save_property` for `48021:34137` if they say the button did nothing. `list_screens` again. Pass is unchanged rows and unchanged `updatedAt`.

## Final report

```
catalog: <n> tools
screen: <id>
pine: resolved <node or miss>
zzzz: unresolved yes/no
open_button_pine: yes/no/unmeasured
boot_board: <verbatim strip or unmeasured>
open_path: operator_click | typed | skipped
boot_parcel: <verbatim strip or unmeasured>
envelope: <state> <reason>
pct_42: yes/no
listing_label_before: ...
listing_label_after: ...
listing_turn: yes/no
posted_chars: <n or none>
boot_after_click: <verbatim strip or unmeasured>
composer_or_consent: <what was there, or absent, or unmeasured>
tools_after_click: ...
panel_unchanged: yes/no/unmeasured
save_board_unchanged: yes/no/skipped
score: old_iframe | script_dead | handler_unbound | message_unsupported | host_reject | handshake_timeout | host_consent | host_drop | guard_failed | working
```

One paragraph: what came from JSON, what the operator reported, what stayed unmeasured.
