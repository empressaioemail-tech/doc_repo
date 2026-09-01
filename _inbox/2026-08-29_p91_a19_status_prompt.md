---
id: 2026-08-29_p91_a19_status_prompt
title: Item 19 live status Connect paste
date: 2026-08-29
status: scored-met
plan_row: P-91
wdll: 19
serving: smartsite-mcp-00049-duw
screen: A13 walk
screen_id: 4316b571-c7d2-4b9f-9e50-4f7a16dbfa94
---

# How to run

Same Connect. Catalog stays 13. Do not search the web. Do not call `ask_the_map`. Do not call `save_property` unless step 1 shows `48021:34169` is already a save. Then stop and write that.

Screen-only neighbor from A13 is `48021:34169` on screen `4316b571-c7d2-4b9f-9e50-4f7a16dbfa94`.

Paste everything below the line.

---

You are grading Smart Site MCP item 19. Use only Smart Site tools. Do not search the web. Do not call `ask_the_map`. Do not call `save_property`. Do not call `create_screen`. Do not call `add_to_screen`.

## Step 1. Who is saved

Call `list_my_properties`. Report the count. Say whether `48021:34169` is in that list.

If it is in the list, stop. This neighbor is not screen-only and cannot grade the refuse.

## Step 2. Screen-only refuse

Call `set_property_status` on `48021:34169` with status `Watching`.

Pass: refuse `saved_property_not_found`. Fail: a save appears, or the call 200s.

## Step 3. Status on a real save

Pick one parcel that step 1 already listed. Call `set_property_status` on that id with `Watching`. Then `list_my_properties` again.

Pass: that id shows `Watching`. Count equals step 1. `48021:34169` is still absent.

## Step 4. Screen rows have no status

Call `list_screens` with screenId `4316b571-c7d2-4b9f-9e50-4f7a16dbfa94`.

Pass: two rows, same queries, no status field on either row. Pine still `pasted`. Neighbor still `walk`.

Then stop.
