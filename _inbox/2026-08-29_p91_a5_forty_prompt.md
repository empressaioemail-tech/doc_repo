---
id: 2026-08-29_p91_a5_forty_prompt
title: A5 forty create_screen paste
date: 2026-08-29
status: superseded
plan_row: P-91
wdll: 18
items: [18, 30]
serving: smartsite-mcp-00049-duw
uri: ui://smartsite/app-p550.html
---

# SUPERSEDED

Pine + CAD Pine + `48021:34137` are one node. This list 500s. Use `_inbox/2026-08-29_p91_a5_forty_unique.md`.

# How to run

Same Connect as the look-up walk. Serving is p550. Catalog stays 13. Do not add tools. Do not search the web. Do not call `ask_the_map`. Do not open a parcel on this run unless a row fails to paint.

Paste the forty lines into Claude and tell it: create one screen named `A5 forty` with these queries, in this order, source pasted. Then stop.

## Pass

`create_screen` returns 40 rows. Ordinals 1-40. Every query string is byte-identical to the line below, including the six junk lines. Those six stay `unresolved` with no Open button and the slot `Nothing to open until this resolves`.

Pine and Rainmaker must resolve to `48021:34137` and `48021:8720522`. A screen that drops a junk line, or that rewrites `Cv` to `Cove`, fails.

Do not treat a missing ring on Rainmaker as an A5 fail.

## Forty queries

```
908 Pine, Bastrop TX
111 Rainmaker Cv, Bastrop TX
927 Main St, Bastrop TX
48021:34137
48021:34169
48021:33223
48021:35073
48021:27943
48021:32243
48021:34729
908 PINE , BASTROP, TX 78602
111 Rainmaker Cove, Bastrop TX 78602
1002 Main St, Bastrop TX
1101 Main St, Bastrop TX
1301 Chestnut St, Bastrop TX
1402 Chestnut St, Bastrop TX
501 Farm St, Bastrop TX
602 Farm St, Bastrop TX
801 Spring St, Bastrop TX
902 Spring St, Bastrop TX
100 Pine St, Bastrop TX
200 Pine St, Bastrop TX
301 Walnut St, Bastrop TX
402 Walnut St, Bastrop TX
501 Water St, Bastrop TX
602 Water St, Bastrop TX
701 Hill St, Bastrop TX
802 Hill St, Bastrop TX
48021:25420
48021:34121
1011 Pecan St, Bastrop TX
1202 Pecan St, Bastrop TX
1501 Church St, Bastrop TX
1602 Church St, Bastrop TX
zzzz-not-a-situs-99999
yyyy-not-a-situs-88888
xxxx-not-a-situs-77777
wwww-not-a-situs-66666
no-such-place-55555
not-an-address-44444
```

Junk lines are the last six. They must come back with those exact strings.

## After the tool

Ask Claude for JSON only: screen id, rowCount, each row query / resolution / parcelNodeId. Then you look at the board: forty rows visible, six slots with no Open.

Wave 1 stays in the other chat. Do not start walk-neighbor or drainage from this paste.
