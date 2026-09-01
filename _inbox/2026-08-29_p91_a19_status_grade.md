---
id: 2026-08-29_p91_a19_status_grade
title: Item 19 live status Connect grade
date: 2026-08-29
status: met
plan_row: P-91
wdll: 19
serving_mcp: smartsite-mcp-00049-duw
serving_cortex: cortex-api-00656-vek
screen: A13 walk
screen_id: 4316b571-c7d2-4b9f-9e50-4f7a16dbfa94
---

# Snapshot

Connect item 19 on p550. Cortex still `00656-vek`. This grade is the other chat's tool JSON plus a code reading of the list and status write paths. Traffic was not re-read. Store was not queried.

# Scores

| Item | Score | Evidence |
| --- | --- | --- |
| 19 screen-only refuse | MET | `set_property_status` on `48021:34169` returned `saved_property_not_found`. That node was absent from the saved list. |
| 19 status on a save | MET | `48021:25420` wrote `Watching`. Confirmed CRM write. |
| 19 screen has no status | MET | `list_screens` `4316b571-c7d2-4b9f-9e50-4f7a16dbfa94` still two rows, Pine pasted, neighbor walk. Status write did not touch the screen. |
| 19 count equals step 1 | MET | Third `list_my_properties` is 16. `48021:36105` present, id `db43d173`, label `711 MARTIN LUTHER KING JR DR`, status null, `updatedAt` still `2026-07-29T16:37:27.103Z`. Last row. `48021:25420` Watching at top, `updatedAt` `2026-08-29T17:02:48.296Z`. `48021:34169` still absent. |

WDLL item 19 is the first three plus the count. They held.

# 16 to 15 was transcript truncation

The 15-row read and the 16-row read are the same endpoint. Only a status write sat between them. The dropped row was the tail. The tail moved because 25420 jumped to the top. Nothing was deleted. No `LIMIT` is in play.

A raw save count on a list this size is not a reliable A-item check. Specific ids present or absent survive truncation. A count does not.

# Item 20 from the same lists

`list_my_properties` is 16 saves, not the A13 two rows and not the forty. Screen-only `48021:34169` is absent. Schema `screenId` refuse already green. Item 20 MET on that evidence.
