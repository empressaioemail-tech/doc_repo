---
id: 2026-08-29_p91_a13_walk_add_grade
title: A13 walk-add Connect grade
date: 2026-08-29
status: met
plan_row: P-91
wdll: 29
serving_mcp: smartsite-mcp-00049-duw
serving_cortex: cortex-api-00656-vek
screen: A13 walk
screen_id: 4316b571-c7d2-4b9f-9e50-4f7a16dbfa94
---

# Snapshot

Connect A13 on p550. Neighbor taken from this turn's `get_smart_site` `draw.edges`. Cortex still `00656-vek`. This grade is the other chat's tool JSON plus the painted board. Traffic was not re-read.

# Scores

| Item | Score | Evidence |
| --- | --- | --- |
| 29 A13 walk add | MET | `list_my_properties` 16 before and after. Screen `4316b571-c7d2-4b9f-9e50-4f7a16dbfa94`. Pine ordinal 0, source `pasted`, `48021:34137`. Live neighbor from `draw.edges` boundary 1 (`neighbor-parcel`, no road) is `48021:34169`. `add_to_screen` ordinal 1, source `walk`, query `48021:34169`. Board paints both rows with Open. No `save_property`. No `48021:34121`. |

# Painted board

Both rows unread. Legend unread is the orange dot. Neighbor query is the node id, which is what `add_to_screen` stores. Pine query stays the typed address.

The walk row paints above Pine. Default board sort is query string, not ordinal. `48021:34169` sorts before `908 Pine`. That is item 13 local sort, not an A13 miss.

# Rejected fails

Source `pasted`: JSON says `walk`. Unique-index 500: two distinct nodes. ROW walk: `34121` is boundary 2 with a road node and was skipped.

# Close

Unit walk-add on 34169 plus this live bind. Do not rerun on `A5 forty unique`. O3 still parks walk across a ROW.
