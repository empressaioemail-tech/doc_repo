---
id: 2026-08-29_p91_wave_i_claude_connect_prompt
title: Fresh Claude Connect prompt to grade Wave I Look up
date: 2026-08-29
status: ready
plan_row: P-91
items: [1, 2, 3, 4]
serving: smartsite-mcp-00045-kes
uri: ui://smartsite/app-p548.html
---

# How to run

Disconnect Smart Site MCP. Reconnect it. New chat after that reconnect. The app URI is `ui://smartsite/app-p548.html`. An old chat still has p547 and will not show the ring.

Connector is `https://mcp.smartsite.cloud`, not Hauska. Paste everything below the line into Claude. You click. Claude does tools and JSON only.

This run grades Wave I only: Open is a turn, the parcel drawing, envelope human, I1. Do not start Wave J. Do not call this customer-done from JSON alone.

---

You are grading Smart Site MCP Wave I in this conversation. Use only Smart Site tools, not Hauska. You cannot see the widget DOM and you cannot click it. After each tool call, report the JSON facts named below, then stop and ask the operator for any painted fact. Write `unmeasured` if they have not reported it. Do not guess. Do not invent a 42 or lot-coverage percent. Do not invent edge labels, street names, or road nodes that are missing from the tool JSON. Do not call `ask_the_map`. Do not search the web. Do not write listing copy into the board or panel.

This chat is testing `app-p548.html` on serving `smartsite-mcp-00045-kes`. Last listing score on gold was `working` on p546. That score does not grade this walk.

Gold is `48021:34137`. CAD situs is `908 PINE , BASTROP, TX 78602` (space before the comma, no ST). Rainmaker is `48021:8720522`. Junk is `zzzz-not-a-situs-99999`.

Dump edges, used only to compare if the tool JSON actually has `draw.edges`: rear alley `48021:road:925036023`; neighbor `48021:34169`; front `48021:road:15113284`; side_corner ROW `48021:road:129017865`. Invented nodes `4429`, `4430`, `4431` are a fail. Labeling three sides PINE is a fail. If `draw.edges` is absent, the panel must show a ring and no invented alley / 34169 / PINE / ROW. That is I1 holding, not a miss of dump labels.

Wire envelope reason is `atom_path_pending`. The iframe must print `Withheld, setbacks unruled` and must not print the machine string.

## Hands

You: `tools/list`, `create_screen` with the three queries, then wait. `get_smart_site` only after an Open turn lands or the operator pastes a typed fallback. `list_screens` / `save_property` only if they ask.

Operator: boot strip, Open button, the drawing, overlay words, every click.

Host chrome (`Smart Site` plus a tool name) is not the widget header.

## Step 1. Catalog

Name every Smart Site tool. Report the count. If it is not 13, stop.

## Step 2. Screen

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
- Open button on zzzz? Must be no.
- Node ids look teal (`--ss-atom`), not gold?
- Boot strip verbatim, or `script-ran` in the card header?

If they report no Open on Pine: `old_iframe`. Tell them to disconnect, reconnect, new chat. Stop.

## Step 3. Open

Ask the operator to click Open on Pine once. Do not call `get_smart_site` yourself.

Then report: did a user turn appear that starts with `Open this parcel`? Does it name `48021:34137`, `get_smart_site`, depth node, and do not save? Which tools ran after the click?

If a turn lands and you are told to call `get_smart_site` depth node for that id, do that once. Do not save.

If they say the button does nothing (no hover, no turn): mark `open_path: typed`. Then they will paste: `Open this parcel 48021:34137. Call get_smart_site once with depth node for this id. Do not save it. Do not call save_to_screen. Do not call find_listing_history.` You may run that tool call after they paste it. Open stays failed. The parcel JSON can still be graded.

## Step 4. Draw JSON

From the `get_smart_site` JSON report only what is there:

- `draw.label` (must be `908 PINE , BASTROP, TX 78602` if present)
- `draw.ring` vertex count and the four points if present
- whether `draw.edges` exists; if yes, each edge role, adjacency, neighbor, roadNode, ft, bearing
- envelope overlay state and reason (pass on the wire is refused / `atom_path_pending`)
- flood overlay state
- any 42 or lot-percentage (must be none)
- any of `4429`, `4430`, `4431` (must be none)

Do not add dump labels that the JSON omitted.

Expected gold ring if present, local ft, y north:

`(48.6, 83.94), (-50.37, 83.7), (-49.07, -84.28), (50.84, -83.36)`

## Step 5. Painted parcel

Ask the operator, one list:

- Is there a line drawing of the lot (closed ring), not a street map and not a blank overlay list?
- How many edge labels are printed? Quote them.
- Three sides labeled PINE? Must be no.
- Envelope words: `Withheld, setbacks unruled`?
- Is `atom_path_pending` visible anywhere in the panel? Must be no.
- Flood quieter than the envelope refuse?
- Node id `48021:34137` visible and teal, not gold?
- Any 42% or lot-coverage number? Must be no.
- Save property and Find listing history both visible?

## Final report

```
catalog: <n> tools
screen: <id>
pine: resolved <node or miss>
rainmaker: resolved <node or miss>
zzzz: unresolved yes/no
open_button_pine: yes/no/unmeasured
open_button_zzzz: yes/no/unmeasured
open_path: operator_click | typed | skipped
open_turn: yes/no
open_turn_prefix: Open this parcel | other | none
tools_after_open: ...
ring_vertices: <n or absent>
ring_matches_gold: yes/no/absent
edges_on_wire: yes/no
edge_labels_json: ...
edge_labels_painted: ...
three_sides_pine: yes/no/unmeasured
invented_road_nodes: yes/no
envelope_wire: <state> <reason>
envelope_painted: ...
atom_path_pending_visible: yes/no/unmeasured
pct_42: yes/no
drawing_visible: yes/no/unmeasured
score_open: working | typed | host_drop | skipped
score_draw: ring_and_edges | ring_only | no_ring | unmeasured
score_i1: held | invented | unmeasured
```

One paragraph: what came from JSON, what the operator reported, what stayed unmeasured. Do not call the walk customer-done.
