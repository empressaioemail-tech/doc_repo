---
id: 2026-08-29_p91_leftovers_prompt
title: F6 pair Connect paste after p551
date: 2026-08-29
status: step2-panel-owed
plan_row: P-91
wdll: 6
serving: smartsite-mcp p551
uri: ui://smartsite/app-p551.html
---

# How to run

Disconnect Smart Site MCP. Reconnect. New chat. URI must be `ui://smartsite/app-p551.html`. An old chat is still p550 and has no dead-Open timer.

Catalog stays 13. Do not search the web. Do not call `ask_the_map`. Do not call `save_property`.

Cortex leftovers are now serving `00660-bux` / p540. Do not grade those on this paste. Separate prompt `_inbox/2026-08-29_p91_leftovers_cortex_prompt.md`.

Paste everything below the line.

---

You are grading Smart Site MCP F6 on `app-p551.html`. Use only Smart Site tools. Do not search the web. Do not call `ask_the_map`. Do not call `save_property`.

Two sentences must stay distinct: `Open did not reach me` is host silence. `Not on file in Bastrop` is a tool result that is not a parcel.

## Step 1. Dead Open

Call `list_screens` with screenId `4316b571-c7d2-4b9f-9e50-4f7a16dbfa94` so the board paints. Ask the operator to click Open on `48021:34137` and not Send. Wait. Do not call `get_smart_site`.

Pass: after 12 seconds the panel reads `Open did not reach me`. Fail: `Not on file in Bastrop`, or no change.

## Step 2. County miss

Call `add_to_screen` on that same screen with `parcelNodeId` `48021:900099` and source `walk`. Then the operator clicks Open on `48021:900099` and Sends.

Pass: `get_smart_site` runs once. Panel reads `Not on file in Bastrop`. Fail: the retry sentence, or a drawn parcel.

Then stop.
