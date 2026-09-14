# SmartCity map dock — three states

**Artifact:** https://claude.ai/code/artifact/9a33103c-9765-4a50-ad7f-461fa6f17f43
**Plan row:** OPS-17 G-128 (blocked on G-120 and G-123 merging — all three touch the lens shell)
**Status:** approved by operator 2026-09-14
**Supersedes:** `_design/smartcity-place-tab/` (the parity option, kept as the record)

The map becomes a persistent RIGHT RAIL on Development services, matching Overview, with the lens
tabs between the left sidebar and the rail. **Place stops being a tab** — the map is context you
work beside, not a destination.

## The three states, and what redistributes

| State | Map | Components |
|---|---|---|
| **Dock** (~360px rail) | top, fixed height | property detail and records STACKED beneath |
| **Expand** | top, grows | the two SIDE BY SIDE below at roughly 2/3 · 1/3 |
| **Full** | dominant | full-width permit ROW under the map; one-click property detail in the right column; layers sidebar |

## The layers rule — the point of the design

**The layers panel exists in FULL ONLY.** Fifty-two layers in a fixed panel cannot work at rail
width. Today it is present at every size: it crushes the map when expanded and collapses to an
unreadable sliver when docked, with clipped control text.

Dock and Expand get a Layers BUTTON carrying the active count. Only Full has room to group 52
layers by their seven categories. The panel is the wrong component below a certain width; making
it narrower or scrollable does not fix that.

## Held across every state

The Bastrop-only refusal (`composePropertyIntelSummary` returns `unavailable` for any other
cityKey). `buildable area` rendering REFUSED with its basis per ruling R-2 — never dropped to save
vertical space. Record rows carrying id, subject and status and never the free-text description.

## Regenerate

    node gen.mjs
