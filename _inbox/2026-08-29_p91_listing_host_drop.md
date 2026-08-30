---
id: 2026-08-29_p91_listing_host_drop
title: Listing click scored host_drop on p543
date: 2026-08-29
status: accepted
plan_row: P-91
items: [16, 26]
serving: smartsite-mcp-00035-tov
screen: 93468d11-35b3-4afd-93c1-407ca3f06ca1
---

# Grade

Connect on `smartsite-mcp-00035-tov` / `p543` after the `ui/message` request-id fix. Cortex still `00656-vek`.

catalog: 13 tools
screen: 93468d11-35b3-4afd-93c1-407ca3f06ca1
pine: resolved 48021:34137
zzzz: unresolved yes
open_button_pine: yes
boot_board: script-ran
open_path: typed
boot_parcel: script-ran
envelope: refused atom_path_pending
pct_42: no
listing_label_before: Find listing history
listing_label_after: Requesting listing history
listing_turn: no
posted_chars: 281
tools_after_click: none
panel_unchanged: yes
save_board_unchanged: skipped
score: host_drop

The handler ran. 281 equals `listingHistoryMessage` for `908 PINE , BASTROP, TX 78602`. No user turn. No tools after the click. The missing `id` was not the miss. The same local ack on `00033-hin` (notification, no `id`) was also `host_drop`.

Open on the board is painted and dead. `open_path: typed`. That is a separate defect from listing `host_drop`.

Next cheapest listing miss: we send `ui/initialize` and immediately send `ui/notifications/initialized` without waiting for the host response. The spec requires initialize, then the host reply, then initialized. A host that is not finished with the handshake can drop later `ui/message` requests.

Do not add another click listener. Do not change the resource URI again for this score. Wave H and A5 forty stay parked. Step 7 save check is optional; A12 already passed on an earlier Connect run.
