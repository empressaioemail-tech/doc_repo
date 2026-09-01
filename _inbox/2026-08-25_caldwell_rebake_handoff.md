---
id: 2026-08-25_caldwell_rebake_handoff
title: Handoff — Caldwell 48055 leftover rebake then STOP
date: 2026-08-25
status: filed
plan_row: P-78
from: integration reviewer
to: in-flight property planner
---

# Caldwell leftover rebake

Operator go on this WDLL. After close you stop. We review. A fresh agent starts the long Texas fill. You do not start that fill.

Paste below the line.

---

You are still the write-path planner. KEEP is law (`_decisions/2026-08-25_p25_tarrant_keep.md`, commit `53a0139`). This card is WDLL `_inbox/2026-08-25_p78_caldwell_leftover_rebake_WDLL.md` items 1-8. Cite those numbers in the close.

## First

Item 1 is already met: origin `53a0139`, five canvases KEEP. Pull if you are behind that SHA. Do not restamp KEEP again.

## This wave

One county. Caldwell **48055**. Path A `stratmap-landuse` leftover year/acres onto `cad_property`. Parser already shipped (`72cffc8`). Parse-only dry-run already filed (`_inbox/2026-08-25_p78_leftover_dryrun_caldwell_48055.json`).

Isolated LDT from `origin/main` (`46e1a5a1`). Use the named 202503 zip/DBF from the dry-run when it still exists; otherwise the county TxGIO zip. Announce first (item 2). Before SQL (item 3). Apply (item 4). After SQL (item 5). Prop_ID `0` note (item 6). Close (item 8).

CLI shape (confirm flags on the tree you run):

`pnpm --filter @workspace/cad-ingest stratmap-landuse -- --county=48055 --file=<zip-or-dbf>`

No `--allow-stratmap-fallback`. That flag is for Dallas/Tarrant only and is forbidden here.

`landuse.ts` will key `Prop_ID` `"0"` as `"0"` (lookahead does not strip it). Count those. Do not call them leftover success.

## Do not start

48113. 48439. Travis. atoms `--apply`. L17. rematerialize. tad.org. P-80. P-79. P-09. COVER. baseline_set. Tarrant DELETE. new PE tree. 280238 geometry. land-use-fact rewrite. A second county "while we are here."

## Done

WDLL 1-8 graded. Close JSON filed. Five canvases restamped. Pin `--check` still PASS. P-25 still `ready:false`. You stop and wait for review. You do not open the Texas fill.
