---
id: 2026-08-29_p91_leftovers_cortex_grade
title: Cortex leftovers MET on p540
date: 2026-08-29
status: met
plan_row: P-91
serving: cortex-api-00660-bux
tag: p540
---

# Duplicate node

`create_screen` leftover-dup (Pine + `48021:34137`) returned JSON `duplicate_resolved_node` with `node` `48021:34137` and the two queries echoed. Not Express HTML 500. No board of two rows.

# Absent node id

`create_screen` leftover-absent (`48021:900001`) wrote one unresolved row. `parcelNodeId` null. Query stays `48021:900001`. Caption is `node unresolved` (item 12 paint, not a rewrite). Slot is `Nothing to open until this resolves`. No Open.

This is the reverse of the 16:51 parse-as-found write.

# Serving

These answers came from `00660-bux` / p540, not `00656-vek` / p539. Wave 1 had already moved prod to `00658-peq` / `canary` before this leftover image shifted to p540. The leftover card that still said p539 was stale by the time this grade ran.

The A5 unique forty with 24 synthetic node ids is stale evidence. Those strings would now be unresolved.

# Not this card

`48021:900099` was not added on the p540 grade. That plant stayed on A13 via the old `add_to_screen`. p541 existence-checks new adds. Re-add on A13 `4316b571-…` is a no-op and keeps Open. Grade p541 on a new screen.
