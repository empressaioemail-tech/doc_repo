---
id: 2026-08-29_p91_claude_design_brief
title: Claude Design brief for the Smart Site MCP companion
date: 2026-08-29
status: ready-to-paste
plan_row: P-91
owner: Nick (operator)
returns: mockup frames, not code
---

# Paste this whole block to Claude Design

You are designing the Smart Site companion that lives inside Claude's chat. Design the whole experience as one product. Do not design a single widget in isolation. Do not write production code. Return annotated mockup frames.

Product name is Smart Site. Brand is Empressa. Not Hauska. Not a catalog. Not Property Explorer. The interactive map stays on smartsite.cloud. This surface is the judgment companion that appears in the conversation.

## Who and the job

The user is a land operator (developer, broker, city staff) talking to Claude. They paste a list of addresses. Claude resolves them. The companion opens in the chat as a screening board. They open one parcel. They see a drawing of that parcel assembled from our `draw` payload, not a street map. They ask Claude to find listing history. The answer stays in the transcript. The board does not change.

One sentence: atoms answer what is on record; Claude answers what is being said; those two stay visibly separate.

## The three levels (design all three, in one conversation)

1. **Conversation.** User paste, Claude's short reply, then the companion panel. The panel is a guest inside Claude's permission card. It recedes. It does not look like a second website.
2. **Board.** Triage. Rows are pasted queries. Columns are rails: situs, zoning, land use, flood, drainage, envelope. Each cell is one of five states. No column totals. No coverage percentages. No 42%.
3. **Parcel.** Judgment. A line drawing of the lot from `draw.ring` and `draw.edges` (already projected; you just stroke the points). Road-facing edges marked. Six overlays with labels. Refusals heavier than flood. Envelope refuse is a slate reason word, not a red alarm.

Neighborhood walk is later. Do not invent a third map of adjacent lots.

## Frames to return (minimum)

Draw these as one story, desktop and a narrow mobile crop of frames 2 and 3.

**F1. Paste.** User message: three lines, `908 Pine, Bastrop TX`, `111 Rainmaker Cv, Bastrop TX`, `zzzz-not-a-situs-99999`. Claude says it created a screen. Companion shows the board. Pine resolved to `48021:34137`. Rainmaker resolved to `48021:8720522`. zzzz is `situs unresolved` and still shows the typed string.

**F2. Board, mixed states.** Same screen. Show all five cell states in the legend and in the grid: present (quiet body + filled square), absent-verified (faint + empty square), unknown (hatch + `--ss-t5`), refused (dashed + `--ss-warn`), unread (gold dot only, no cell fill). Open on a resolved row is an obvious click. Open on zzzz is visibly a miss, not a dead control. Design the words for those two. Do not use machine strings.

**F3. Parcel open.** Gold `48021:34137`, label `908 PINE , BASTROP, TX 78602` exactly, including the space before the comma. Line drawing of the ring. Four edges from the dump, not from this sentence: rear alley (`48021:road:925036023`), neighbor `34169`, front PINE (`48021:road:15113284`), side_corner ROW (`48021:road:129017865`). Do not label three sides PINE. Node id is `--ss-atom`, never `--ss-gold`. Overlays listed. Envelope is refused with a human reason (not `atom_path_pending`). Flood is present and quieter than the refuse. Canonical url may be a text link. No aerial. No basemap. No north-arrow chrome unless it earns its space. Confidence if shown is the word `seed`, never a number.

**F4. Listing click.** Same parcel panel, byte-identical. Button reads as a Stone blue action, label like `Find listing history`. Below the panel, Claude's next turn is the listing answer in the transcript. The panel did not grow a sales column. Annotate that split.

**F5. Waiting / empty.** Companion mounted, no screen yet. Honest empty. Not a skeleton that pretends rows exist.

**F6. Failure pair.** Two small states: (a) Open clicked, host did nothing; (b) Open clicked, parcel really is not on file. They must not look the same. This is the 3.8 leftover. Invent the words. Do not invent a sixth hue.

## Visual law (Stone)

Live tokens from Property Explorer `pe-tokens.css`. Not the cream prototype. Not v2 dark. Declare them. Do not invent hex.

Ground: `--ss-void` `#2A2A2B`, `--ss-ink` `#323234`, `--ss-raised` `#3F4043`.
Hairlines: `--ss-line-06` `#414247` inside a surface, `--ss-line-14` `#56575C` as the edge of a surface.
Text: `--ss-t3` `#D6D8DB` body, `--ss-t5` `#A9ABAF` meta, `--ss-t6` `#999B9F` faint metadata.
Action: `--ss-blue` `#86ADDF` is the only action colour. Listing button may be a solid blue fill. White host primary is out.
Records: `--ss-atom` `#6FC1B8` for an openable node id.
Absence: `--ss-slate` `#A9ABAF` for unresolved query and for envelope refuse reason.
Waiting cell: `--ss-warn` `#CFB165`.
Unread: `--ss-gold` `#E8963B` as a dot only. Brand mark may use gold. Not a button, not a key, not a cell fill.
Type: `--ss-ui` system stack. Meta 12.5, body 14.5. No 10, 13, 26, or 32 in this panel. No Google fonts. No Oxygen file.
Radius: 12 (`--ss-r-tip`). Do not add 18.
No cream `#F3F5F1` `#F5F5F0` `#EAEEE7`. No lime `#8fde5d`. No purple refuse. No emoji. No exclamation marks.

**Guest well leftover.** The page behind the card recedes at `#1c1c1c`. The kit has no name for that. Do not call it `--ss-ink` or `--ss-void`. Card chrome is `--ss-ink`. Inner well is `--ss-void`. Report the leftover if you keep it. Do not invent a token.

`--ss-sky` is map geometry on the workbench. Never inside this panel.
`--ss-ok` is not present. Present is quiet `--ss-t3`.
`--ss-err` is not envelope refuse. Envelope refuse is slate plus a reason word. Cell refuse and envelope refuse are different jobs. Keep both.

Washes, if any, are `color-mix` from a token, never a spelled rgba. No `var(--token, fallback)`.

Voice: operator writing for an operator. One fact, then stop. Absence is a title plus one sentence. County strings stay verbatim. Labels uppercase in chrome, sentence case in prose.

## What the drawing is

The parcel picture is a planimetric line drawing from our payload:

- `ring`: closed polyline in a local frame (US survey feet, origin at centroid, y north).
- `edges[]`: each has `ft`, `bearing`, `adjacency`, optional `roadNode` / `roadClass` / `neighbor`.
- `overlays[]`: id, state, label, optional reason.
- `confidence: "seed"`.
- Gold ring (approx, for the picture, not for engineering): `(48.6, 83.94), (-50.37, 83.7), (-49.07, -84.28), (50.84, -83.36)`.

You assemble the path. You do not geocode. You do not fetch tiles. You do not ask Claude to freehand a plat. Unknown overlays carry a label in the region, not only in a legend. Hatch alone reads as texture.

Setback feet exist on some edges and are off this drawing until a later ruling. Do not dimension them.

## Interaction (design, do not implement)

Local, no turn: sort, filter, hover, legend.

A turn (Claude does the next thing): Open parcel, Save property, Find listing history, later Walk neighbor.

Save property does not change the screen. The button is never labeled Save to screen. Opening a parcel does not write a save. Find listing history does not write the board.

The companion never has its own search box that hits the network. Claude already has the composer.

## Hard no

No interactive street map. No Mapbox, Leaflet, Google tiles, aerial.
No mini-map inside Claude.
No R1 report renderer, no GLB/IFC/terrain, no records workflow.
No listing feed, no Zillow, no sales column, no web results in the panel.
No coverage %, no 42%, no column totals, no invented confidence number.
No sixth rail. No 14th tool. No Hauska wordmark.
No self-hosted fonts. No remote images required to understand the frame.
Do not restyle Claude's chrome. Design the guest panel and how it sits in a plausible Claude thread.

## What to send back

1. The six frames (F1 to F6), annotated.
2. A one-page component inventory: header, mark, board row, five glyphs, ring, overlay row, primary action, secondary action, empty, the two failure copies.
3. Token list you used. Any colour you needed and did not find, named as a leftover, not invented.
4. The exact words you chose for envelope refuse, unresolved situs, dead Open, and honest miss.

If a screen needs a primitive Stone does not have, name the primitive. Do not add a hue to paper over it.

## Picture of record

Visual source is `P:/tmp/Smart Site MCP Companion (standalone).html` (inner document). Punch does not redesign it. Four bindings only, applied 2026-08-29:

1. Legend: hatch is unknown. Gold dot is unread. Not "Not read yet" on hatch. Not "New since you last looked" on the dot. Drainage that has not been fetched is a gold dot, not a hatch.
2. Parcel header node id is `--ss-atom`.
3. Gold edges as the dump: alley, neighbor 34169, PINE, ROW. No invented road nodes.
4. Secondary action is Save property.

Punched HTML to open: `P:/tmp/Smart Site MCP Companion (punched).html`.
