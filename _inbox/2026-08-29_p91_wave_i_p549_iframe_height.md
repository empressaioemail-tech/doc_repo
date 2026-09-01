---
id: 2026-08-29_p91_wave_i_p549_iframe_height
title: Wave I iframe grows to the board
date: 2026-08-29
status: serving
plan_row: P-91
serving: smartsite-mcp-00047-vos
tag: p549
digest: sha256:1c19a19c7ad32c9f740ef4a0a26f7633804e7c1c9bb17147ebb52b0142b2a2aa
uri: ui://smartsite/app-p549.html
---

# What was wrong

The board painted all three rows. Claude gave the iframe a short slot. The document used `height:100%` and `overflow:hidden`, so the host measured a postage stamp and locked it. Only `zzzz-not-a-situs-99999` was readable. Pine and Rainmaker sat behind a 2px scrollbar.

Claude.ai reads `document.documentElement` height from the iframe DOM. It does not honor `ui/notifications/size-changed` alone. `100vh` would loop.

# What shipped

Removed fill-the-host height. After each paint, `fitHost` measures content, sets `documentElement` height (floor 420), and still posts `size-changed` for spec hosts. URI `ui://smartsite/app-p549.html`.

# Deploy

Cloud Build `3cbbf3fb-0d9a-47c2-9cb6-228f4c98d2f0` SUCCESS. Digest from Artifact Registry `image_summary.digest`. Canary `smartsite-mcp-00047-vos` @0% tag `p549`, tag `/health` named that revision, `minScale` 1. Then `--to-tags=p549=100`. Production `/health` `revision` is `smartsite-mcp-00047-vos`. Cortex left alone.

Tests 89/89. Reconnect required. Old iframe is still p548.

# Walk leftover

Connect on p548 already had gold `draw.ring` (4 vertices, matches dump) and `draw.edges` (4 dump roads). Rainmaker has no ring. Open turns in that chat were typed pastes, not graded as working clicks.
