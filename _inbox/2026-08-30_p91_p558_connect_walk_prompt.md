---
id: 2026-08-30_p91_p558_connect_walk_prompt
title: Connect walk W1 for the v2 companion on p558 / p543 (reissued: agent reports tool JSON, operator reports paint)
date: 2026-08-30
status: ready (reissue 2 after the first run stopped at the host approval gate)
plan_row: P-91 (v2 card W1)
uri: ui://smartsite/app-p558.html
serving_required: smartsite-mcp tag p558 at 100% and cortex-api tag p543 at 100% (both read by field name before pasting)
serving_read: 2026-08-30 smartsite-mcp-00065-siv percent=100 tag=p558; cortex-api-00668-cos percent=100 tag=p543; re-read after the first run, unchanged
first_run: stopped at the gate. create_screen and find_parcel both returned "No approval received" from the host. That string does not exist in the MCP server or cortex source; it is the Claude.ai per-call approval prompt. The planner's own connector executed the same calls this session.
dedupe_evidence: the B2 dedupe (degraded.duplicates with keptQuery) is on LDT origin/main and serves through cortex-api-00668-cos. Planner probe 2026-08-30T17:37:48Z: create_screen with 111 Rainmaker Cv and 111 Rainmaker Cove wrote screen bfd1c7a4, four rows, degraded.duplicates naming the Cove spelling with Cv kept. Step 1 is a real test.
second_run: 2026-08-30 ~18:43Z, same result at step 1 ("No approval received"). Server log (smartsite-mcp, Cloud Logging, read 18:51Z): the walk session reconnected at 18:42:49Z (401 then OAuth discovery from the Claude.ai backend), completed three initialize / initialized / tools-list handshakes at 18:43:05Z to 18:43:08Z (each preceded by a 400 for a session id from before the p558 revision), and then sent nothing. The planner list_screens at 18:51:29Z arrived as POST /mcp 200 size 5182, so calls that reach the server show in this log. The create_screen never left the host. Fix is the connector tool permission in Claude.ai, not the app.
---

# How to run (operator)

Before pasting: when the Smart Site connector asks for approval on a tool call, allow it. If the chat offers "always allow" for this connector, take it for the walk; every refused call leaves the step unmeasured. Disconnect and reconnect the connector once in a new chat so the card icon and the app resource refresh.

Screenshot every panel state named under "Operator reports". The agent cannot see the widget; its job is the tool JSON and the transcript. Yours is the paint. Both halves come back here and I grade the card from them.

Paste everything below the line.

---

You are walking the Smart Site MCP App v2 on `ui://smartsite/app-p558.html`. Use only Smart Site tools. Do not search the web. Do not call `ask_the_map`.

Rule for this walk: you report tool inputs, tool JSON, and what appears in the transcript. You do not report anything painted in the widget; the operator reports paint and is asked for it under "Operator reports" in each step. When a step needs the operator to click, wait for them and then continue. If a call returns "No approval received", stop and say so; do not retry more than once.

## Gate

Confirm the resource URI is `ui://smartsite/app-p558.html` and the catalog is 13 tools. Stop if either is wrong. Copy the boot strip verbatim once if it appears in the transcript; if it only appears in the widget, say so and the operator screenshots it.

## 1. Board from a block

Agent: call `create_screen` with name `Higgins walk`, source `pasted`, and these queries exactly: `102 Higgins St, Bastrop TX`, `108 Higgins St, Bastrop TX`, `106 1/2 Higgins St, Bastrop TX`, `111 Higgins St, Bastrop TX`, `zzzz-not-a-situs-99999`, `111 Rainmaker Cv, Bastrop TX`, `111 Rainmaker Cove, Bastrop TX 78602`.

Agent reports: the screen id; every row with `ordinal`, `query`, `parcelNodeId`, `resolution`, `stubRead`, and the stub rails; the full `degraded` object. Expected: six rows written (the Cove spelling is not a row), `degraded.duplicates` naming the Cove query with `keptQuery` the Cv one, zzzz `unresolved` with `parcelNodeId: null`.

Operator reports: does the board open with the least-known rows first; does every resolved row show rail glyphs; is there a note under the board saying the Cove line is the same parcel and was not added twice; does zzzz show a "Look this up" control and no Open.

## 2. Hover a property line

Operator: click Open on 108 Higgins St (`48021:31272`), then press Send.

Agent reports: the drafted message that arrived in the composer (verbatim), then the `get_smart_site` call it produced (parcelNodeId, depth) and, from the JSON, the `edges` array: for each edge `role`, `ft`, `bearing`, `adjacency`, `neighbor`, `roadNode`.

Operator reports: what the board line said before Send (expected `Sent to chat. Press Send to open.`); then hover each edge of the drawing and read out, for one edge with a neighbor and one on the street, the tooltip text. A street edge must say `across the right of way` and offer no Open.

## 3. A shared line is a door

Operator: hover a neighbor edge, click its Open, press Send. Then on the same door tooltip click Add to screen, press Send.

Agent reports: both drafted messages verbatim; the `get_smart_site` call for the neighbor and its `draw.node`; the `add_to_screen` call (screen id, source `walk`, the node) and its response rows.

Operator reports: the new panel is that neighbor; the first panel showed `Sent to chat` while waiting; the board gained the row after the add.

## 4. Zoning on the drawing

Agent reports: from the open parcel's JSON, `draw.attrs.zoning` (`v`, `jurisdiction`, `state`) and the zoning section's `citations`.

Operator reports: the district printed inside the ring and the jurisdiction beneath it; click the district and say whether a new tab opened to the ArcGIS layer; the ring's `data-zone-family` value if visible in the html.

## 5. Flood on the drawing

Agent: call `get_smart_site` with `parcelNodeId` `48021:49295`, depth `node`; then `48021:33223`; then `48021:32243`.

Agent reports: for each, the flood section `data` (`floodZone`, `zoneSubtype`, `inSpecialFloodHazardArea`, `baseFloodElevation`, `sourceVintage`, `evaluatedAt`) and the flood overlay (`label`, `draw`, `state`, `citationsDegraded`).

Operator reports: 49295 heavy tint and the zone label above the ring including `floodway`; 33223 no tint and a row saying minimal; 32243 heavy tint, `Zone A`.

## 6. Facts, why, report

Agent reports: for 145 Hasler Shores (49295), the sections array with each `id`, `disposition`, `reason` (if any), `asOf`; and, after the operator clicks the envelope row, the drafted question that arrived in the composer, verbatim. Do not send it.

Operator reports: the flood row as painted (zone, subtype, SFHA, base flood elevation or none on record, vintage, evaluated-at; no prose sentence); the zoning citation control opened a tab; the envelope row click drafted a question (screenshot it); toggle Report and describe the section list (title, state word, as-of, source, citation control) and that nothing else changed.

## 7. Save and listing

Operator: click Save, choose Watching, press Send. Then click Find listing history, press Send.

Agent reports: the `save_property` call and response (status `Watching`); what the listing-history draft asked and what you answered in the transcript.

Operator reports: the panel did not change after the listing answer (the transcript answer stays out of the panel).

## 8. Miss and reopen

Agent: call `get_smart_site` with `parcelNodeId` `48021:900099`, depth `node`. Report the full body (expected `parcels: []`, `notFound: ["48021:900099"]`, `reason`, `parcelExists`). Then call `list_screens` with no id and report the screens array (name, rowCount, updatedAt) including `Higgins walk`.

Operator: click Open on `Higgins walk` in the picker, press Send.

Agent reports: the drafted message verbatim and the resulting call and row count.

Operator reports: the sentence under the miss row (expected `Not on file in Bastrop`); the picker showed names, updated dates, and an Open per screen; the board came back with rails.

Then stop. Agent: paste the boot strip again if it changed. Operator: bring the screenshots and the sentences back to the planner.
