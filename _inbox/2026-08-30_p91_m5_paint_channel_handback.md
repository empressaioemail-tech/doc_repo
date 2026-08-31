---
id: 2026-08-30_p91_m5_paint_channel_handback
title: P-91 v3 M-5 handback, the paint only preview channel and the off canvas naming
date: 2026-08-30
status: returned
plan_row: P-91 v3 M-5
---

Snapshot: repo legacy-design-tools, worktree `P:/tmp/legacy-design-tools-p91-stone`, branch `feat/p91-v3-paint`, base commit `bb814f1cc855f2b3fe6d9fc685a1b81a34fda76a` (`feat(p91): v3 multi-parcel canvas`, p561). Nothing committed and nothing pushed: subagents do not commit. The diff is uncommitted in that worktree.

Files touched, all under `artifacts/smartsite-mcp/`: `src/mcp-app.ts`, `tests/mcp-app-multi.test.ts`, `tests/mcp-app-served.test.ts`, `tests/mcp-app-probe.test.ts`. Nothing outside that directory. `cloudbuild.p559.yaml` shows modified and `cloudbuild.p547..p554.yaml` show untracked; both predate this checkout and were not touched.

Suite: 413 passing, 17 files, up from 373. `tsc --noEmit` clean.

## Item 1, the naming that was conditional on a canvas

The parser routing is unchanged: below two drawable parcels there is still no canvas and still today's single parcel panel. What changed is that the whole parcel set now travels on that model, so the panel names every parcel it did not draw with a reason.

The rule implemented is wider than "name the undrawable ones", because the narrower rule has a hole. When `parcels[0]` is itself undrawable, the panel paints an empty card for it and a DRAWABLE parcel further down the array goes unnamed. Both are omissions and only one of them is an undrawable row. So: every parcel the result carried that this panel did not draw is named, and the shown parcel is excluded only when it actually has a ring and an anchor.

`undrawnReason` is still the one predicate. `offCanvasParcels` asks it; nothing here re-derives what drawable means.

## Item 2, the paint only preview channel

A dwell on a shared boundary door tooltip reads that neighbour's stub rails through one app initiated `tools/call` on `get_smart_site` at stub depth, and paints them. The tool catalog stays at 13; the tool is already in `APP_HOST_TOOLS`.

Both invariants are contract checks and fixtures, not intentions. The block carries its own class, its own CSS rule, and an explicit line on every state saying it was not sent to the chat. The reply is routed by rpc id and never reaches `accept()`, so a preview cannot repaint the panel or become model state. Open and Add to screen on that door are untouched.

Fail closed: rails paint under exactly one condition, `ok` with a row. Every other state paints one stated line and emits no rail glyph at all. States are pending, ok, empty, declined, error with its code, timeout, unsupported and busy, plus a fail closed sentence for a state word nothing names.

Bounds chosen: dwell 350 ms (a pointer crossing an edge in transit is on it for well under 200 ms; a hover held past 350 ms is a decision), timeout 4000 ms (shorter than the p559 probe's 6000 and much shorter than the 12000 ms open dead timer, because this waits on a tooltip a pointer is being held over rather than a panel a user is reading), one call in flight, one call per neighbour per panel instance, reset on the next accepted result.

## Item 3, the tools= token

Fourth token on the boot strip, with a `data-tools` attribute: `unread`, `pending`, `ok`, `err<code>`, `timeout`, `unsupported`. `unsupported` is set the moment the handshake settles without `serverTools`, including on a handshake error and on a handshake that never answers, so the token is never left at `unread` by a dead host.

Contradiction with the brief, stated: the token reads `unread` on a live host that DOES advertise `serverTools` until a door dwell fires. The panel makes no unrequested tool call, so the channel is measured lazily. One screenshot of a freshly loaded panel therefore does not answer "is the channel real" on a capable host; a screenshot after one door hover does. The alternative was a speculative boot time call against a real tool on the user's account, which is a side effect the card did not authorise.

## Vacuous checks found in my own first pass

Two, both in rules I wrote.

The first: `off_canvas_list_unbound` required the page to contain `offCanvasHtml(model)`. The emitted declaration is `function offCanvasHtml(model) {`, which is a substring match, so deleting the call from the render left the rule passing. The rule now counts CALL sites and does not count an occurrence preceded by `function `.

The second: `preview_not_marked` required the page to contain the not-in-conversation sentence. That sentence is also a `var` declaration in the served scope, so deleting the line from the block left the sentence in the page and the rule passing. Both that rule and the absence sentence rule now read the BODY of the served function, cut out of the page at the two space indent boundary `inlineSharedSource` emits.

A third finding, not a vacuous check but a dormant one: the once per neighbour bound had two guards, one in `showEdge`'s arming condition and one in `firePreview`. Deleting the `firePreview` guard broke nothing, because the arming guard already covered every reachable path. Collapsed to a single enforcement site in `firePreview`; `showEdge` now decides only whether the line is a door. Deleting that one guard is now caught.

Also non circular now: the fixtures asserted the panel printed `app.PREVIEW_*`, which passes on any edit to the constant including one that deletes the promise. The sentences are written out literally in the test file and checked against the constants, the same two derivation rule the file's existing COPY table uses.

## Left undone

The app resource URI is still `ui://smartsite/app-p561.html`. Bumping it is a deploy shaped decision and deploys are planner owned; flagging it so the deploy step decides rather than discovering it.

leave_behind:
  - item: branch feat/p91-v3-paint in P:/tmp/legacy-design-tools-p91-stone, uncommitted
    owner: planner
    plan_row: P-91 v3 M-5
