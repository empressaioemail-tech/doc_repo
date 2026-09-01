---
id: 2026-08-30_pe_mark_ink_deploy
title: Smart Site mark on the ink tile is live on smartsite.cloud
date: 2026-08-30
status: live
plan_row: P-95 (Light Charcoal), P-91 (connector card follows)
card: _inbox/2026-08-30_smart_site_mark_tile_ink.md
repo: hauska-map, PR #315, squash a275a459 (test SUCCESS, Typecheck SUCCESS, encoding SUCCESS, mergeStateStatus CLEAN)
clone: P:/tmp/hauska-map-p91-mark feat/smart-site-mark-ink 5acc48cb (registered under the property seat 2026-08-30)
deployment: property-explorer-limy5bkix (Vercel, production, status Ready, aliases https://smartsite.cloud and https://www.smartsite.cloud), deployed 2026-08-30 09:49 CDT via `vercel deploy --prod` from the clone at main a275a459
previous_production: property-explorer-6l7jd4aix (19 h earlier)
---

# What shipped

Tile fill on every Smart Site icon asset moved from page void `#2A2A2B` to component ink `#323234`; the crosshair, the white and the gold dot are unchanged. `apps/property-explorer/scripts/render-mark.mjs` (dependency-free) now renders all six assets from two named geometries (`MARK_SVG`, `MARK_RASTER`), with `--check` decoding the files on disk and `--self-test` showing each predicate failing on a violating render. Cache-buster `ss-ink-1` on the three icon links and the manifest icons; manifest colours unchanged. `p96-chrome.test.ts` pins the ink fill and the busted href.

Finding recorded on the card: the rasters on main had never been rendered from the SVG (full-bleed mark on a square tile versus the SVG's smaller mark in a rounded rect). Ruling inside the colour-only ask: rasters keep the full-bleed geometry (what the Claude connector card and iOS show; square, alpha 255), the SVG keeps its own; the new rasters measure within 0.001 of the old on every parameter. Whether the two marks become one is the operator's brand call.

# Verification, live, by the planner

Before (read 2026-08-30 before the deploy) and after (read after the alias moved), sha256 prefixes and `Last-Modified`:

| URL | before | after | after Last-Modified |
| --- | --- | --- | --- |
| /favicon.ico | 7f9ee6d2454 | 75197bf251c | Sun, 30 Aug 2026 14:49:48 GMT |
| /favicon-32.png | 945f7fcbbd5 | 4b03c4cdbe8 | 14:49:49 GMT |
| /apple-touch-icon.png | 1a6d3ba47dc | dfcfb87aee6 | 14:49:50 GMT |
| /icons/icon-192.svg | 26b5907178c | 49cd5a737f3 | 14:49:51 GMT |
| /icons/icon-512.svg | 1a7c27cf565 | 0626453c801 | 14:49:52 GMT |

Live `apple-touch-icon.png` decoded: corner (0,0) `rgba(50,50,52,255)`, ring on the axis `rgba(251,251,252,255)`. Live `favicon-32.png` corner `rgba(50,50,52,255)`. Live `icons/icon-192.svg` rect `fill="#323234"`. Live `index.html` links `/favicon.ico?v=ss-ink-1`, `/icons/icon-192.svg?v=ss-ink-1`, `/apple-touch-icon.png?v=ss-ink-1`. Function-served routes after the deploy: `/llms.txt` 200 `text/plain`; `/s/c86a0001-0086-4086-a001-000000000001` 200 HTML naming 908 PINE.

Build log: TypeScript errors in `api/_lib/pe-property-atoms.ts` (656, 669) and `api/_lib/verdict-layer-merge.ts` (50, 132). Pre-existing: the previous production build (`property-explorer-6l7jd4aix`, 2026-08-29T19:59Z) carries the same lines, 51 matches of the same codes. Not introduced here; the build succeeded both times; named below.

# Connector card

The Smart Site MCP server (p557) points `serverInfo.icons` at `https://smartsite.cloud/apple-touch-icon.png` and `icons/icon-512.svg`, so the Claude card shows the ink tile after one disconnect and reconnect. No MCP change.

leave_behind:
  - item: pre-existing TypeScript errors in apps/property-explorer/api/_lib (pe-property-atoms.ts 656/669, verdict-layer-merge.ts 50/132) that Vercel's build logs but does not fail on
    owner: property seat
    plan_row: P-95 backlog
  - item: two Smart Site marks in the wild (full-bleed rasters, margined SVG); one script now renders both; unifying them is a brand decision
    owner: operator
    plan_row: P-95
  - item: pe-llms-txt.test.ts fails on any Windows autocrlf checkout (CRLF public/llms.txt versus an LF constant); green on Linux CI
    owner: property seat
    plan_row: P-95 backlog
