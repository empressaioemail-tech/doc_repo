---
id: 2026-08-29_p91_wave_j_claude_connect_prompt
title: Fresh Claude Connect prompt to grade Open punch plus Wave J
date: 2026-08-29
status: ready
plan_row: P-91
items: [1, 5, 6, 7]
serving: smartsite-mcp-00049-duw
uri: ui://smartsite/app-p550.html
---

# How to run

Disconnect Smart Site MCP. Reconnect it. New chat after that reconnect. The app URI is `ui://smartsite/app-p550.html`. An old chat still has p549 and will not show the punched Open draft or the F5/F6 copy.

Connector is `https://mcp.smartsite.cloud`, not Hauska. Paste everything below the line into Claude. You click. Claude does tools and JSON only.

This run grades the Open punch and Wave J: legend words, empty and miss copy, listing on the drawn panel. Wave I draw already held on gold. Do not call this customer-done from JSON alone.

---

You are grading Smart Site MCP Wave J plus the Open draft punch in this conversation. Use only Smart Site tools, not Hauska. You cannot see the widget DOM and you cannot click it. After each tool call, report the JSON facts named below, then stop and ask the operator for any painted fact. Write `unmeasured` if they have not reported it. Do not guess. Do not invent a 42 or lot-coverage percent. Do not invent edge labels, street names, or road nodes that are missing from the tool JSON. Do not call `ask_the_map` until the operator clicks Find listing history. Do not write listing copy into the board or panel.

This chat is testing `app-p550.html` on serving `smartsite-mcp-00049-duw`. Last Wave I gold score held on p549 screen `bcfbf326`. That score does not grade this walk.

Gold is `48021:34137`. CAD situs is `908 PINE , BASTROP, TX 78602` (space before the comma, no ST). Rainmaker is `48021:8720522`. Junk is `zzzz-not-a-situs-99999`.

Catalog is 16 (updated 2026-09-03: was 13 at authoring time; P-106 added `find_parcels` and P-113 added `list_purchased_records`/`read_purchased_record`, both merged and deployed same day, see OPS-16 A-078/A-079/A-082). There is no `find_listing_history` tool and no `save_to_screen` tool. Save is `save_property`. Listing is a host web turn. Do not add tools. Do not treat a missing catalog name as a dead button.

## Hands

You: `tools/list`, then wait if the operator looks at the empty panel first. Then `create_screen` with the three queries. `get_smart_site` only after an Open turn lands. Web search only after Find listing history posts its turn.

Operator: empty copy before paste, legend words, zzzz slot, Open click plus Send, listing click.

Host chrome (`Smart Site` plus a tool name) is not the widget header.

## Step 1. Catalog

Name every Smart Site tool. Report the count. If it is not 16, stop.

## Step 2. Empty board (F5)

Before any screen, ask the operator what the panel says.

Pass: `No screen yet` plus `Paste addresses in the chat. This panel does not search.` Fail: `Waiting for a screen or a parcel.`

## Step 3. Screen

Call `create_screen` with exactly these three queries, in this order:

```
908 Pine, Bastrop TX
111 Rainmaker Cv, Bastrop TX
zzzz-not-a-situs-99999
```

Do not save. Do not open a parcel.

Report from JSON: screen id; each row query, resolution, parcelNodeId. Pass is Pine `48021:34137`, Rainmaker `48021:8720522`, zzzz unresolved with the original query.

Then ask the operator:

- Open button on Pine? Must be yes.
- Open button on Rainmaker? Must be yes.
- Open button on zzzz? Must be no. Slot must read `Nothing to open until this resolves`.
- Legend words: present / absent, verified / unknown / refused / unread. Hatch must not be captioned `Not read yet`.
- Boot strip verbatim, or `script-ran` in the card header?

If they report no Open on Pine: `old_iframe`. Tell them to disconnect, reconnect, new chat. Stop.

## Step 4. Open punch

Ask the operator to click Open on Pine once. A draft will fill the composer. Tell them to Send it. Do not tell them to delete it. Do not call `get_smart_site` yourself first.

The draft must start with `Open this parcel` and must contain `48021:34137`, `get_smart_site`, depth node, `Do not call save_property`, and `Do not search the web`. Fail if it names `save_to_screen` or `find_listing_history`.

If a turn lands and you are told to call `get_smart_site` depth node for that id, do that once. Do not save. Do not search the web on this step.

If they say the button does nothing (no hover, no draft): mark `open_path: dead`. Ask whether the panel now says `Open did not reach me`. That sentence must not be `Not on file in Bastrop`.

## Step 5. Drawn panel

From the `get_smart_site` JSON report only what is there: ring vertex count, whether `draw.edges` is present, envelope reason. Do not invent edges.

Ask the operator: ring visible, envelope `Withheld, setbacks unruled`, no `atom_path_pending`, buttons `Save property` and `Find listing history`. Fail if they see `Save to screen`.

Rainmaker has no ring. Do not invent one. A missing ring is not F6.

## Step 6. Listing on the drawn panel

Ask the operator to click Find listing history once.

Then report: did a user turn appear that starts with `Find listing history for`? Does it name the gold label or node, search the public web, put the answer only in this transcript, and forbid `ask_the_map`? Which tools ran after the click?

Web search is allowed on this step only. Do not call `ask_the_map`. Do not write sales into the panel.

Ask the operator: did the panel grow a sales column? Pass is no. The listing answer lives in the transcript.

## Step 7. Stop

Do not start a flood study. Do not call `request_records`. Do not grow the catalog. Report scores:

- `score_open_punch`: draft named only live verbs, or fail
- `score_legend`: legend words plus hatch not unread
- `score_empty_miss`: F5 copy, zzzz slot, F6 pair distinct or unmeasured
- `score_listing`: Wave D turn on this drawn panel, or fail
