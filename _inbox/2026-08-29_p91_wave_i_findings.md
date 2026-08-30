---
id: 2026-08-29_p91_wave_i_findings
title: Wave I walk findings after gold held
date: 2026-08-29
status: recorded
plan_row: P-91
screen: bcfbf326-8106-4b69-9b7c-4c4b6df8b0df
serving: smartsite-mcp-00047-vos
---

# Reconciliation

Painted gold edges match the `get_smart_site` payload field for field. I1 held. Envelope human held. Open scored working on host consent. Wave I items 1-4 held. Full walk not customer-done.

# Finding 1. Widget-authored draft names ghost tools

The Open click drafts:

`Open this parcel 48021:34137. Call get_smart_site once with depth node for this id. Do not save it. Do not call save_to_screen. Do not call find_listing_history.`

`save_to_screen` and `find_listing_history` are not in the 13-tool catalog. The live save tool is `save_property`. Listing is a host turn, not a tool. The draft is conservative (fewer calls, not more). The host cannot tell this text from a typed prompt unless the operator says so.

Ruling: this is a real leftover. Punch the Open instruction so it only names catalog tools and host verbs that exist. Do not add tools to make the old words true.

Proposed punch (not shipped):

`Call get_smart_site once with depth node for this id. Do not call save_property. Do not search the web.`

# Finding 2. Find listing history looks like a missing tool

It is not. There is no fourteenth tool. The button posts the Wave D listing turn: search the public web, answer only in the transcript, do not call `ask_the_map`, do not write into the board. That path already scored `working` on p546 gold. Wave I barred web search so the grader saw a live button with no catalog name.

Ruling: walk-rules hole, not a catalog hole. Wave J grades that button on this drawn panel. Do not add `find_listing_history` to the connector. Do not call the button dead.

# Finding 3. Consent is the gate

`ui/message` drafts. Send is the only gate between a widget-authored instruction and tool calls. Recorded as a lesson. Not a fail. A draft that pushed toward more calls would look identical.
