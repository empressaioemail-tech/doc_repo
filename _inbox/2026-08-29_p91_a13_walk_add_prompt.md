---
id: 2026-08-29_p91_a13_walk_add_prompt
title: A13 walk-add Connect paste
date: 2026-08-29
status: scored-met
plan_row: P-91
wdll: 29
serving: smartsite-mcp-00049-duw
uri: ui://smartsite/app-p550.html
---

# How to run

Same Connect as the look-up walk. Serving is p550. Catalog stays 13. Do not add tools. Do not search the web. Do not call `ask_the_map`. Do not call `save_property`.

Do not run this on `A5 forty unique`. That screen already has `48021:34169` as a pasted row. `add_to_screen` is idempotent and would return source `pasted`.

Do not walk across a ROW. Do not add `48021:34121` or any `48021:road:*` node.

Paste everything below the line.

---

You are grading Smart Site MCP item A13 in this conversation. Use only Smart Site tools. Catalog is 13. There is no fourteenth tool. Do not search the web. Do not call `ask_the_map`. Do not call `save_property`. Do not call `set_property_status`.

Gold is `48021:34137`. The neighbor you add must come from this turn's `get_smart_site` `draw.edges[].neighbor`. Do not type a remembered id before that JSON exists. Do not add a road node.

## Step 1. Saved-list baseline

Call `list_my_properties`. Report the count. Remember that number.

## Step 2. Fresh screen

Call `create_screen` named `A13 walk` with source `pasted` and exactly one query:

```
908 Pine, Bastrop TX
```

Pass: one row, Pine resolves to `48021:34137`, source `pasted`. If this 500s, stop.

## Step 3. Open gold

Call `get_smart_site` once, depth node, id `48021:34137`. Do not save.

From `draw.edges`, pick the first edge that has a `neighbor` and is not a road (`road` / `48021:road:` absent). Report that neighbor string exactly as returned.

If the string is already `digits:id`, use it. If it is only a prop id, prefix the gold county `48021:`. If no neighbor field exists, stop and write `unmeasured`. Do not invent `34169`.

## Step 4. Walk add

Call `add_to_screen` on the `A13 walk` screen id with that parcel node id and source `walk`. Then `list_screens` with that screenId.

Pass: two rows. New row is `resolved`, `source` is `walk`, node equals the live neighbor. Pine row is unchanged. `list_my_properties` count equals step 1.

Fail: source `pasted` or `saved`. A new save. A road node. A 500. Adding the neighbor that was already on `A5 forty unique`.

Then stop.
