---
id: 2026-08-30_p91_p558_connect_walk_prompt
title: Connect walk W1 for the v2 companion on p558 / p543
date: 2026-08-30
status: ready
plan_row: P-91 (v2 card W1)
uri: ui://smartsite/app-p558.html
serving_required: smartsite-mcp tag p558 at 100% and cortex-api tag p543 at 100% (both read by field name before pasting)
serving_read: 2026-08-30 smartsite-mcp-00065-siv percent=100 tag=p558; cortex-api-00668-cos percent=100 tag=p543; both by field name from services describe --format=json
fixtures: _inbox/2026-08-30_p91_fixture_set_bastrop.md
card: _inbox/2026-08-30_smartsite_mcp_app_v2_WDLL.md
---

# How to run

Wait for this seat to report both tags at 100%. Disconnect the Smart Site connector, start a new chat, reconnect (the card icon refreshes here too). Use only Smart Site tools. Do not search the web except where step 7 says so. Do not call `ask_the_map`.

Screenshot every panel state named below; the sentences are graded verbatim. Look at both the board and the panel under each tool row.

Paste everything below the line.

---

You are walking the Smart Site MCP App v2 on `ui://smartsite/app-p558.html`. Confirm the URI and that the catalog is 13 tools; stop if either is wrong. Copy the boot strip verbatim once.

## 1. Board from a block

Call `create_screen` with name `Higgins walk`, source `pasted`, and these queries exactly: `102 Higgins St, Bastrop TX`, `108 Higgins St, Bastrop TX`, `106 1/2 Higgins St, Bastrop TX`, `111 Higgins St, Bastrop TX`, `zzzz-not-a-situs-99999`, `111 Rainmaker Cv, Bastrop TX`, `111 Rainmaker Cove, Bastrop TX 78602`.

Report: rows, which resolved, whether `degraded.duplicates` names the Cove spelling with the Cv one kept. Ask the operator: does the board open with the least-known rows first; does every resolved row show rail glyphs; is there a note under the board saying the Cove line is the same parcel and was not added twice; does zzzz have a "Look this up" control and no Open.

## 2. Hover a property line

Operator clicks Open on 108 Higgins St (`48021:31272`) and presses Send. One `get_smart_site` depth node. Report what the board line says before Send (expected: `Sent to chat. Press Send to open.`).

Operator hovers each edge of the drawing. Report, for one edge with a neighbor and one on the street: the tooltip text (length in ft, bearing, the adjacency in words, the neighbor id or the road). A street edge must say `across the right of way` and offer no Open.

## 3. A shared line is a door

Operator hovers a neighbor edge and clicks its Open, then Send. Report that the new panel is that neighbor, and that the first panel showed `Sent to chat` while waiting. Then, on the door tooltip, click Add to screen and Send; report the `add_to_screen` call (source `walk`) and that the board gained the row.

## 4. Zoning on the drawing

On any open parcel: report the district printed inside the ring and the jurisdiction beneath it; click the district and report whether the zoning citation opened (a new tab to the ArcGIS layer). Report the ring's tint family word if visible in the html (`data-zone-family`).

## 5. Flood on the drawing

Ask Claude: "Call get_smart_site with parcelNodeId 48021:49295 and depth node." Report the flood tint (heavy) and the zone label above the ring (expected to include `floodway`). Then `48021:33223`: expect no tint and a row saying minimal. Then `48021:32243`: expect heavy tint, `Zone A`.

## 6. Facts, why, report

On 145 Hasler Shores: report the flood row (zone, subtype, SFHA, base flood elevation or none on record, vintage, evaluated-at; no prose sentence). Click the citation control on zoning and report it opened. Click the envelope row (refused) and report the drafted question verbatim; do not Send it. Toggle Report and report the section list (title, state word, as-of, source, citation control) and that nothing else changed.

## 7. Save and listing

On the same parcel click Save, choose Watching, Send. Report `save_property` with status Watching. Click Find listing history; Send; report the transcript answer stays out of the panel.

## 8. Miss and reopen

Ask Claude: "Call get_smart_site with parcelNodeId 48021:900099 and depth node." Report the sentence under that row (expected `Not on file in Bastrop`). Then ask Claude to call `list_screens` with no id; report the picker (names, updated dates, Open per screen) and click Open on `Higgins walk`, Send; report the board came back with rails.

Then stop. Paste the boot strip again if it changed.
