---
id: 2026-08-29_p91_leftovers_add_exist_prompt
title: add_to_screen existence Connect paste after p541
date: 2026-08-29
status: scored-met
plan_row: P-91
serving: cortex-api-00664-hib
tag: p541
---

# How to run

Do not disconnect for a new MCP URI. Stay on `ui://smartsite/app-p554.html`. Catalog stays 13. Use only Smart Site tools. Do not search the web. Do not call `ask_the_map`. Do not call `save_property`. Do not Open `48021:900099`. Do not use screen `4316b571-c7d2-4b9f-9e50-4f7a16dbfa94`. That board already has `900099` written resolved. Re-add there is a no-op and keeps Open.

Paste everything below the line after traffic is on p541.

---

You are grading `add_to_screen` existence on serving cortex `p541`. Use only Smart Site tools.

## Absent add

Call `create_screen` with name `leftover-add-exist`, source `pasted`, and one query `908 Pine, Bastrop TX`.

Then call `add_to_screen` on that `screenId` with `parcelNodeId` `48021:900099` and source `walk`.

Pass: the new row is unresolved. `parcelNodeId` is null. Query stays `48021:900099`. No Open. Slot is `Nothing to open until this resolves`. Fail: resolved, or Open.

## Walk still resolves

Call `add_to_screen` on the same screen with `parcelNodeId` `48021:34169` and source `walk`.

Pass: resolved, Open, `parcelNodeId` `48021:34169`. Then stop.
