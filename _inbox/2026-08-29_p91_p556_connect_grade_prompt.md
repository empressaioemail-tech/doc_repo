---
id: 2026-08-29_p91_p556_connect_grade_prompt
title: Connect grade for p556 / p542. Board honesty, panel sentences, rails at first paint, O1-O3
date: 2026-08-29
status: ready-after-shift
plan_row: P-91
uri: ui://smartsite/app-p556.html
serving_required: smartsite-mcp tag p556 at 100%; cortex-api tag p542 at 100% (read by field name before pasting)
build_plan: _inbox/2026-08-29_p91_build_plan_p555_p542.md
---

# How to run

Wait until this seat reports both tags at 100%. Disconnect the Smart Site connector. New chat. Reconnect. Use only Smart Site tools. Do not search the web. Do not call `save_property`. Do not call `ask_the_map` (it returns `not_ready` by design now; calling it is not a fail, it is just not this grade).

Look at two panels after every Send: the board at the top, and any new panel under the `get_smart_site` row. Write down both. Prior grades scored "the panel" as whichever one showed a picture; this grade needs both sentences.

Paste everything below the line.

---

You are grading Smart Site MCP p556 with cortex p542. Confirm the resource URI is `ui://smartsite/app-p556.html` and that the catalog is 16 tools (updated 2026-09-03: was 13 at authoring time; P-106 added `find_parcels` and P-113 added `list_purchased_records`/`read_purchased_record`, both merged and deployed same day, see OPS-16 A-078/A-079/A-082). Stop if either is wrong.

## O1. Boot strip

On the first live panel, copy the boot strip verbatim. It starts `script-ran` and includes `handshake=`, `caps=`, `message=`, `reply=`, `foreign=`. Paste the whole line. Say whether `caps=` contains `serverTools`.

## Step 1. Screen with rails

Call `create_screen` with name `p556 walk`, source `pasted`, queries exactly `908 Pine, Bastrop TX`, `111 Rainmaker Cv, Bastrop TX`, `zzzz-not-a-situs-99999`.

Report from the JSON: screen id; for each row its `resolution`, `parcelNodeId`, and whether it carries `stub` and `stubRead`; whether the screen carries `stubsDegraded`.

Ask the operator: on the board, does the Pine row show six rail glyphs (squares, hatch, or a dashed refuse) or six gold dots? Does zzzz have an Open button? (It must not.)

## Step 2. Gold Open (O2)

Operator clicks Open on Pine (`48021:34137`). Before Send, report the line above the rows on the board. Expected: `Sent to chat. Press Send to open.` Fail: `Open did not reach me` before Send.

Operator presses Send. One `get_smart_site` depth node. Report: what the board at the top says now (expected: still the Sent line, or nothing; never `Open did not reach me`), and what paints under the `get_smart_site` row (expected: the parcel with a ring and edges; header `Smart Site · 908 PINE ...`). If the board itself turned into the parcel and no new panel appeared, say so exactly; that withdraws the deep dive.

## Step 3. Miss Open (O3)

Call `add_to_screen` on this screen with parcelNodeId `48021:900099`, source `walk`. Expected: row written `unresolved`, `parcelNodeId` null, no Open on the board.

Then ask Claude directly: "Call get_smart_site with parcelNodeId 48021:900099 and depth node." Report the tool JSON keys (`parcels`, `notFound`, `reason`, `parcelExists`) and `isError`. Report what paints under that row. Expected: `Not on file in Bastrop` with the id. Fail: `No screen yet`, `Open did not reach me`, or no panel at all (say which).

## Step 4. Unbaked versus absent

Ask Claude: "Call get_smart_site with parcelNodeId 48021:34169 and depth node." Report the panel sentence under that row. Expected: either the parcel, or `No baked snapshot yet for 48021:34169` if it is not baked. It must not say `Not on file`.

## Step 5. Batch board

Ask Claude: "Call get_smart_site with parcelNodeId ["48021:34137", "48021:8720522", "48021:900099"] and depth stub." Report what paints under that row. Expected: a board with two resolved rows carrying rails and one row `node unresolved` for `900099`. Fail: `No screen yet`.

Then stop. Do not open zzzz. Do not save. Paste the boot strip again at the end if it changed.
