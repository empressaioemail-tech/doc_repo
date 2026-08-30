---
id: 2026-08-29_p91_listing_handshake_ship
title: Handshake wait shipped on p544
date: 2026-08-29
status: serving
plan_row: P-91
items: [16, 26]
serving: smartsite-mcp-00037-xoz
---

# Ship

LDT [PR #544](https://github.com/empressaioemail-tech/legacy-design-tools/pull/544) squash `62980e5b`.

`ui/initialize` now waits for the host reply (string or number id) before `ui/notifications/initialized`. Outbound `ui/message` queues until ready. 2s timeout still sends initialized so a silent host cannot deadlock paint. Boot strip `data-handshake` is `wait` then `ready`, `error`, or `timeout`. Resource URI `ui://smartsite/app-p544.html`.

Serving `smartsite-mcp-00037-xoz` @100% tag `p544`. Digest on the revision `sha256:35268e308e6dc3100ea504b8eea5eba4b163904b37d6acdce4658723454e5641`. minScale=1. Live `/health` names `00037-xoz`. `GET /llms.txt` Tools (13). Cortex `00656-vek` @100% tag `p539`. Staging `00646-luj` still tag `staging` at 0%.

Disconnect, reconnect, new chat. An old iframe is still p543. If listing is `host_drop` again, stop treating this as a widget bind bug.

leave_behind:
- item: Open on the board still dead (`open_path: typed`)
  owner: property
  plan_row: P-91
