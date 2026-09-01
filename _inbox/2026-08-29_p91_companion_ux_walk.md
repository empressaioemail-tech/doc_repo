---
id: 2026-08-29_p91_companion_ux_walk
title: Companion look-up walk and two-wave cut
date: 2026-08-29
status: held-gold-n1
plan_row: P-91
items: [12, 13, 16, 25, 26]
picture: P:/tmp/Smart Site MCP Companion (punched).html
brief: _inbox/2026-08-29_p91_claude_design_brief.md
operator_go: 2026-08-29 (look up a property and get the full companion experience)
---

# Companion look-up walk

Date: 2026-08-29  Status: approved  Operator approval: 2026-08-29

## Done looks like

You are in Claude, Smart Site MCP reconnected to the serving revision. You paste three lines. A screening board opens in the thread. You click Open on 908 Pine. The panel becomes a parcel: a line drawing from live `draw`, four edges named as the dump, overlays, envelope withheld in human words, flood quiet, no 42%. You click Find listing history. The answer is only in the transcript. You save. The board does not change. zzzz never offers Open. If Open dies, it does not look like a county miss.

Picture of record: `P:/tmp/Smart Site MCP Companion (punched).html`. Not the cream prototype. Not Property Explorer. Not a street map.

## The walk (one property)

Queries: `908 Pine, Bastrop TX`, `111 Rainmaker Cv, Bastrop TX`, `zzzz-not-a-situs-99999`.

Gold: `48021:34137`, label `908 PINE , BASTROP, TX 78602`. Rainmaker: `48021:8720522`.

| Step | You do | You see | Frame |
| --- | --- | --- | --- |
| 1 | Paste the three lines | Board. Pine and Rainmaker have atom node ids. zzzz keeps the typed string. | F1 / F2 |
| 2 | Open 908 Pine | Turn calls `get_smart_site` depth node. Panel is the parcel. | F3 |
| 3 | Look at the drawing | Ring from `draw.ring`. Alley, neighbor 34169, PINE, ROW. No invented road nodes. Drainage unread is a gold dot. Envelope: Withheld, setbacks unruled. | F3 |
| 4 | Find listing history | Transcript answers. Panel has no sales column. | F4 |
| 5 | Save property | Board rows and queries unchanged. | A12 |
| 6 | Do not click Open on zzzz | Slot reads Nothing to open until this resolves. | F2 |
| 7 | If Open is dead | Open did not reach me, retry. Not the same as Not on file in Bastrop. | F6 |

Empty board before paste is F5. No search box in the panel.

## Already live (do not rebuild)

Wave E paste n=1. Wave F save. Wave D listing turn on gold. Wave H Stone on `00043-mex` / p547. Envelope refuse on the wire. Tools (13). Cortex `00656-vek`.

## Missing (why the walk fails today)

Open is still typed. Parcel panel lists overlay keys and throws the ring away. Envelope still shows the machine reason. Empty and the failure pair are not designed in the live iframe. Save button may still say the wrong product. Legend words are not the punched bind.

## Wave I — Look up

You can look up gold and see the site.

1. **Open is a turn.** Board click on a resolved row posts a transcript turn that calls `get_smart_site` depth node for that id and does not save. | check: Connect on serving MCP; Open on `48021:34137` produces the turn; panel becomes parcel | grade: working via host consent. Click fills composer. Send runs get_smart_site. Screen bcfbf326.
2. **Parcel drawing from live `draw`.** Ring SVG from `draw.ring`. Four edges labeled alley / 34169 / PINE / ROW with dump road nodes. No tiles. No setback dimensions. | check: gold panel on Connect; ring vertices match the tool result, not a freehand; neighbor edge is dashed | grade: ring_and_edges. Painted labels match the wire. Street name PINE not used as an edge label (I1).
3. **Envelope human, flood quiet.** Overlay copy is Withheld, setbacks unruled. Machine `atom_path_pending` does not print. No 42%. Node id is `--ss-atom`. | check: gold overlay list; no `atom_path_pending` in the iframe HTML; no lot-percentage | grade: MET on copy and flood. Parcel node color unmeasured.
4. **I1.** Every vertex and edge label is in the tool result Claude also received. | check: unit fixture of gold `draw`; a panel that labels three sides PINE fails | grade: held. Live gold. No invented road nodes.

Depends on serving p547 or later. Isolated tree only. Digest-pin deploy, no env, leave cortex.

## Wave J — Honesty

The rest of the punched picture.

5. **Board legend.** Present / absent-verified / unknown (hatch) / refused / unread (gold dot). Hatch is not labeled unread. | check: live iframe legend strings; unit fails if hatch caption is Not read yet | grade: MET on p550 board
6. **Empty and miss.** F5 before a screen. zzzz has no Open control. F6 pair if Open dies. | check: Connect empty, then paste; zzzz slot has no button; dead Open copy is the retry sentence | grade: PARTIAL. F5 MET. zzzz MET. F6 timer serving on p551 (`Open did not reach me` at 12s). Live pair ungraded. Prompt `_inbox/2026-08-29_p91_leftovers_prompt.md`.
7. **Listing on the drawn panel.** Same as Wave D, on the Wave I parcel. Panel fingerprint unchanged. Button Find listing history. Secondary is Save property. | check: Connect listing turn; fingerprint before/after; no Save to screen string | grade: working on p550 gold. Transcript-only 2005 sales. Guard held. No 14th tool

Depends on Wave I serving. A5 unique forty MET. A13 walk-add MET 2026-08-29. P-92 drainage overlay stays parked.

## Out

Interactive map. Claude freehand plat. Mini-map. R1 in the frame. Listing feed. 14th tool. Factory. P-94. P-90.

## Amendments

- 2026-08-29 (open). Operator: I want it built so I can look up a property and get the full user experience. Picture is the punched mockup. Two waves. Reason: item 16 named the walk but the live surface could not show the drawing or Open it.
- 2026-08-29 (p550). Operator: both in one go. Open draft punch plus Wave J items 5-7 shipped together on `smartsite-mcp-00049-duw` / `ui://smartsite/app-p550.html`. Serving, not walked. Reason: get through the companion walk leftovers so the next conversation can move on.
