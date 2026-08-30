---
id: 2026-08-29_p91_listing_bind
title: Listing bind follow-up for outcome 1
date: 2026-08-29
status: serving
plan_row: P-91
pr: https://github.com/empressaioemail-tech/legacy-design-tools/pull/542
serving: smartsite-mcp-00033-hin
---

# Listing bind

Operator scored outcome 1 on `00031-jih`. Label sat still. Host is off the suspect list for that run.

LDT #542 squash `f4cc90bc` is serving as `smartsite-mcp-00033-hin` @100% tag `p542`, digest `sha256:754e11247c202612b596a7ead8fc69070a94f805a4a8231a02c2abe0bf4bde7c`, minScale=1. Live `/health` names `00033-hin`. Tools (13). Cortex still `00656-vek`. Staging `00646-luj` still 0%.

The panel now paints `script-ran` at boot and in the card header, flips the listing label before any other work, and delegates clicks from `document.body`. Resolved board rows get an Open button. Listing stays off the board.

Fresh Connect after the MCP pin. Check presence first, not just state:

1. Boot strip visible and `script-off`: on p542, script did not run. CSP or frozen snapshot.
2. No boot strip at all: old iframe (no `#boot`). Nothing proven. Reconnect.
3. Resolved Pine row has no Open button: same, old build. Stop.
4. Boot strip `script-ran` and Open present: on p542. Then click listing.
5. Label flips, chat empty = `host_drop`.
6. Label sits with `script-ran` = click is not reaching the iframe.

Wave H next, not A5 forty. Do not start either until this score.
