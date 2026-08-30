---
id: 2026-08-29_p91_leftovers_cortex_prompt
title: Cortex leftover Connect paste after p540
date: 2026-08-29
status: scored-met
plan_row: P-91
serving: cortex-api-00660-bux
tag: p540
---

# How to run

New chat after F6, or the same chat after F6 is scored. Use only Smart Site tools. Do not search the web. Do not call `ask_the_map`. Do not call `save_property`. Do not Open the A13 walk board for this grade.

Paste everything below the line.

---

You are grading two cortex leftovers on serving `p540`. Use only Smart Site tools.

## Duplicate node

Call `create_screen` with name `leftover-dup`, source `pasted`, and queries exactly `908 Pine, Bastrop TX` and `48021:34137`.

Pass: the tool is an error. Body JSON has `error` `duplicate_resolved_node` and `node` `48021:34137`. No new screen. Fail: HTML 500, or a painted board with two rows.

## Absent node id

Call `create_screen` with name `leftover-absent`, source `pasted`, and one query `48021:900001`.

Pass: one row, query verbatim, unresolved, no Open. Fail: resolved, or Open.

Then stop. Do not add `48021:900099` here. That id is reserved for F6 step 2 on the A13 walk board.
