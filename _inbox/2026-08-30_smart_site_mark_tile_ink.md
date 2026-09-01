---
id: 2026-08-30_smart_site_mark_tile_ink
title: Smart Site mark tile moves from page void to component ink, on every surface that serves the mark
date: 2026-08-30
status: live 2026-08-30 (hauska-map #315 squash a275a459; Vercel property-explorer-limy5bkix aliased to smartsite.cloud; all five icon URLs changed bytes; live PNG corners rgba(50,50,52,255); live SVG rect #323234; record _inbox/2026-08-30_pe_mark_ink_deploy.md; connector card refreshes on the next reconnect)
plan_row: P-95 (Stone / Light Charcoal), P-91 (connector card follows)
operator_ask: 2026-08-30 "I want our background of the favicon to be the lighter grey that is the main color of the app components, across all sites not just the MCP app"
owner: property seat (hauska-map assets and Property Explorer deploy); planner runs it as a lane on go
source_of_truth_for_the_mark: https://smartsite.cloud/icons/icon-192.svg (crosshair, gold dot, Stone void tile; comment in the file: "Stone --ss-void. The v2 near-black tile is retired.")
---

# What changes

The Smart Site mark (white crosshair, gold `--ss-gold #E8963B` dot) stays. The tile behind it changes from the page colour to the component colour.

| Token | Hex | Role today | Tile? |
| --- | --- | --- | --- |
| `--ss-void` | `#2A2A2B` | page background | today's tile |
| `--ss-ink` | `#323234` | cards, panels, wells: the component fill | recommended tile |
| `--ss-raised` | `#3F4043` | buttons and raised controls | alternative if "components" meant controls |

Recommendation: `--ss-ink #323234`. The operator said "the main color of the app components"; in the Light Charcoal handoff (`_inbox/2026-08-29_smartsite_mcp_app_design_handoff.md`, 66 tokens at `6360670`) that is `--ss-ink`, the fill of every card and panel; `--ss-raised` is only the control fill. One confirmation needed: ink or raised.

# Assets that carry the mark (the Smart Site family)

| Surface | Asset | Where it lives | Note |
| --- | --- | --- | --- |
| smartsite.cloud (Property Explorer) | `public/favicon.ico` (32x32 PNG-in-ICO), `public/apple-touch-icon.png` (180x180), `public/icons/icon-192.svg`, `public/icons/icon-512.svg`, and the `?v=` cache-buster on the `<link rel="icon">` | hauska-map `apps/property-explorer` | The three raster files are generated from the SVG; regenerate all four from one source so they cannot drift again. Bump the `v=` query so browsers refetch. |
| Web manifest `theme_color` / `background_color` | both `#2A2A2B` today | same | Not part of the ask (browser chrome tint, splash background). Left at void unless the operator says otherwise; named here so the choice is deliberate. |
| Share pages `/s/{grantId}` and `/llms.txt` | inherit the app's icons | hauska-map | No separate asset. |
| Smart Site MCP connector card (Claude) | none of its own | `artifacts/smartsite-mcp` (LDT) | p557 points `serverInfo.icons` at the smartsite.cloud PNG and SVG above, so the card follows the site on the next reconnect. Nothing to change here after the assets land. |
| Claude connector directory listing (P-88) | not filed yet | n/a | Uses the same URLs when filed. |

Out of scope by product line: SmartCity dashboards, Command Center, hauska.dev, ICC portal, plan review. They carry their own marks (`_decisions/2026-08-17_smartcity_product_line_design_system.md`). If "all sites" was meant to include a product that does not carry the Smart Site mark, that is a brand decision, not an asset regeneration.

# Finding during the lane (2026-08-30) and the geometry ruling

The three raster files on main were never rendered from the SVG. Decoded and measured: the rasters carry a larger, full-bleed mark on a square opaque tile (ring stroke r 0.369 to 0.417 of the size, ticks from r 0.239 through the ring to the tile edge, dot r 0.072, no rounding, no alpha), which is what the Claude connector card and the iOS home screen show; the SVG carries a smaller mark with a 10 percent margin inside a rounded rect (ring r 0.3125, ticks r 0.208 to 0.396), which is what browser tabs show. Two marks in the wild, one name.

Ruling (planner, inside the operator's colour-only ask): rasters keep the full-bleed geometry on an ink tile (square, alpha 255 everywhere; Apple renders transparent corners black and hosts round the tile themselves); SVGs keep their geometry with the ink rect. `render-mark.mjs` carries both geometries by name so each can be regenerated from one file and the drift cannot recur silently. Whether the two marks should become one is a brand decision for the operator, not this lane.

# How it runs (lane, on go)

1. Generate the four files from one SVG source with the tile fill set to the confirmed token; keep the crosshair geometry and the gold dot byte-identical; bump `?v=`.
2. Verify by viewing the rendered PNG and the ICO's embedded PNG, and by diffing the SVG path data against the current file (only the `rect fill` may change).
3. PR to hauska-map, CI green, merge.
4. Vercel CLI deploy of Property Explorer (`vercel link --project` first; PE root `apps/property-explorer`), then read the live bytes of all four URLs and their `Last-Modified` headers.
5. Reconnect the Smart Site connector once so the Claude card refetches.

Leave-behind if the manifest colours stay at void: none; recorded above as deliberate.
