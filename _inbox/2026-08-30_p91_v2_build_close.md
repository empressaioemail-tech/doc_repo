---
id: 2026-08-30_p91_v2_build_close
title: P-91 v2 build close. Five lanes, two images, one paired shift, one regression repaired
date: 2026-08-30
status: closed (PR #555 squash-merged 24553cfc on Test SUCCESS, Typecheck SUCCESS, CLEAN; both feature branches deleted on origin)
plan_row: P-91 (carry), P-92 (opens)
card: _inbox/2026-08-30_smartsite_mcp_app_v2_WDLL.md
checkpoints: _inbox/2026-08-30_p91_v2_build_cp.md
deploys: _inbox/2026-08-30_p91_p558_deploy.md; _inbox/2026-08-30_p91_p543_deploy.md
walk: _inbox/2026-08-30_p91_p558_connect_walk_prompt.md (W1; grades fill the card)
serving: smartsite-mcp-00065-siv tag p558 100%; cortex-api-00668-cos tag p543 100%; both read by field name 2026-08-30
---

# What was built

Two branches from LDT main `7cbe0bc4`. `feat/p91-v2-cortex` (S9): declared duplicates on `create_screen`, an explicit `disposition` on every brief section with `unread` for drainage, `absent-verified` earned by a known vintage, the pipeline radius printed at the source's resolution, `zoneExposureSummary` withheld while citations are degraded, the stub as a projection of node. PR #553 squash-merged `d8dfb319`; image p543. `feat/p91-v2-panel` (S10, S6, S7, S8 in sequence on the shared iframe file): node batch cap 25, explicit `unread` kept through normalization, every non-OK body declared; hover a property line, a shared line is a door, zoning and flood on the drawing, north and scale cues; citations as links, flood as facts, verified only when earned, as-of on every row, the why-turn, save with status, add a neighbor, a report view; board candidates and lookups, declared duplicates and reads, reopen picker, county groups, completeness sort. PR #555 from `ff36c8f0`; image p558.

Suites at each return, rerun by the planner: 180, 195, 210, 226 (smartsite-mcp) and 163 (cortex, 14 files). Every lane's fixtures were shown failing first and every load-bearing predicate was mutated with the exact fixtures named that failed; one vacuous mutation (S8 B4) was caught by the lane and repaired with a boundary fixture.

# What was verified by the planner, not delegated

Each lane's return was read as a diff and attacked (CP2 in the checkpoint file). The paired shift ran p558 first and p543 second so no interval served a cortex `unread` through an MCP that rewrote it to `absent`. Both traffic tables were read from `services describe --format=json` by field name, and both serving revisions' `imageDigest` values equal the Artifact Registry digests. After the shifts, four calls through the planner's own connector matched the wire the lanes built to: declared duplicate with the kept query; `drainage: unread` on every stub and in the node brief with its reason; pipeline and special district `unknown` with reasons and `500 ft`; no `zoneExposureSummary` while degraded; the picker shape from a bare `list_screens`; 26 node ids refused at cap 25 with a declared body.

# Regression found and repaired

Since p555 (the one-parser change), an unresolved screen row with `parcelNodeId: null` and a uuid `id` bound to its own row id and painted an Open button carrying a uuid. The p554 inline parser had no such fallback; the exported twin did; no walk after p555 opened a created screen with an unresolved row. S8's fixtures found it, not review. Fixed on p558 with regression fixtures on both parsers. The lesson is already in `_scratch/p91-listing-bind.md`: a wire shape that no live call has exercised is a claim, and the fixtures for a parser must include every row shape the wire can carry, including the ones a walk has not produced yet.

# Grades

Fill at the W1 walk from the operator's screenshots and sentences. The card's section 4 items are graded there, not here. Interpretations taken without a ruling are listed per lane in the checkpoint file and are the first things to read at the walk: MINIMAL prints no zone on the drawing; the north arrow needs a `frame`; the scale bar needs `units: ft`; a section-level `absent` paints verified only with a known `data.sourceVintage`; a present flood section without `evaluatedAt` paints unknown / as-of missing.

# Leave behind

    leave_behind:
      - item: typed-absence atoms carry no vintage, so every live typed absence paints unknown until they do (F5 honest state, not a panel defect)
        owner: data lane (the operator's data agent)
        plan_row: P-91 v2 card X1 / D8
      - item: flood section without evaluatedAt paints as-of missing (cortex gives flood no bakedAt fallback)
        owner: property seat
        plan_row: P-91 (one-line cortex fallback)
      - item: countyFips on screen candidates (cortex wireRow emits id and label only; the panel groups by county only when carried)
        owner: property seat
        plan_row: P-91 v2 card B4
      - item: export-instrument.ts swallows the Hauska HTTP status (declared unmeasured at the boundary; path unreachable in prod)
        owner: substrate seat (export endpoint and key)
        plan_row: P-91 v2 card R2
      - item: the second spelling of a duplicate query is declared, not persisted (a column, if wanted)
        owner: property seat
        plan_row: P-91 v2 card B2, on operator ask
      - item: N1 neighbor seam, F9 codeRefs, R3 flood-study forms
        owner: planner
        plan_row: P-92
      - item: Free tier gate unchanged (pricing law, not ruled)
        owner: operator
        plan_row: P-91 v2 card 3.5
      - item: branches feat/p91-v2-panel and feat/p91-v2-cortex deleted on origin after the merges; clones P:/tmp/legacy-design-tools-p91-stone and -p91-cortex-leftover stay registered under the property seat
        owner: planner
        plan_row: P-91

# Open at the time of this close

PR #555 (panel) was squash-merged `24553cfc` on Test SUCCESS, Typecheck SUCCESS, CLEAN, after this close was drafted. The serving image was built from its head `ff36c8f0`, so the merge changed nothing on the wire; main now carries what serves. Both feature branches were deleted on origin; the two clones stay registered on their local branches.
