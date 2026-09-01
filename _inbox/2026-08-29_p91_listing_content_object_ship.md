---
id: 2026-08-29_p91_listing_content_object_ship
title: ui/message spec content object shipped on p545
date: 2026-08-29
status: serving
plan_row: P-91
items: [16, 26]
serving: smartsite-mcp-00039-req
---

# Ship

LDT [PR #545](https://github.com/empressaioemail-tech/legacy-design-tools/pull/545) squash `479213ec`.

`ui/message` `content` is now `{ type: "text", text }` per the published MCP Apps example. The ContentBlock array is the shape every prior `host_drop` used.

Serving `smartsite-mcp-00039-req` @100% tag `p545`. Digest on the revision `sha256:381e34a4d4dcbfff16586db3839da1630ff52f99b56261521ffb826866f3b91a`. minScale=1. Live `/health` names `00039-req`. Tools (13). URI `ui://smartsite/app-p545.html`.

Disconnect, reconnect, new chat. If listing is `host_drop` again, park listing and come back. Wave H stays parked.

leave_behind:
- item: Open on the board still dead (`open_path: typed`)
  owner: property
  plan_row: P-91
