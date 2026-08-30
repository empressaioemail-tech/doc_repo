---
id: 2026-08-29_p91_listing_fresh_agent
title: Fresh-agent prompt and test for listing bind
date: 2026-08-29
status: ready
plan_row: P-91
wdll: _inbox/2026-08-28_smartsite_mcp_app_WDLL.md
items: [16, 26]
serving_claimed: smartsite-mcp-00033-hin
---

Wrong audience if you wanted Claude in Connect. That prompt is `_inbox/2026-08-29_p91_listing_claude_connect_prompt.md`.

# Prompt (paste to a Cursor lane planner)

Copy from the heading "You are" through "Close artifact". Do not shorten. Verify every serving claim at source before you use it.

---

You are a lane planner on OPS-16 P-91 items 16 and 26. Plan of record `90_operations/OPS-16_texas_market_plan_of_record.md`. WDLL `_inbox/2026-08-28_smartsite_mcp_app_WDLL.md`. Contract `90_runbooks/AGENT_CONTRACT.md`. Enforcement `ENFORCEMENT.md`.

Seat: property. Isolated LDT worktree only. Never write `P:/legacy-design-tools` (dirty). Never write another seat's tree. Subagents do not commit. You commit by pathspec on operator go. Doc_repo commits are planner-owned; leave doc edits uncommitted and list them.

Read first: `_STATE.md`, `MEMORY.md`, `_scratch/smartsite-ai-connector.md`, `_scratch/p91-listing-bind.md`, `_inbox/2026-08-29_p91_listing_bind.md`, `_inbox/2026-08-29_p91_listing_outcome_1.md`, this file.

Snapshot in your first output: repo, branch, commit. If you cannot, stop.

## Standing

Cotality extinguished. Deploys planner-owned. No privileged data. Code-done is not customer-done. Image tag is the full SHA. Never trust `latest`. Read `status.traffic[]` by field name. Do not use `--set-env-vars` on a digest-pin. Do not shift staging cortex `00646-luj`. Apex `smartsite.cloud` stays Vercel. I1 I5 I6 bind. No listing feed. No web content in the panel. No 14th tool. Do not widen `ask_the_map`. Do not deploy Hauska MCP. Do not take P-90. Wave H and A5 forty wait on a listing score.

## What is already scored. Do not relitigate.

Wave E address paste PASS. HTTP: Pine 200 to `48021:34137`; Rainmaker Cv 200 to `48021:8720522`; zzzz `missClass=no-hit`. Connect paste PASS n=1.

Wave F save PASS. Board `updatedAt` equals `createdAt`. A12 met.

Envelope refuse on gold `get_smart_site`: `atom_path_pending`, no 42 percent. Ruling B. Wave G parked.

Listing on `00031-jih`: outcome 1. Label sat still. Host had nothing to drop. Residual: throw before the label flip would look the same.

Listing bind #542 squash `f4cc90bc` claimed serving `smartsite-mcp-00033-hin` @100% tag `p542`, digest `sha256:754e11247c202612b596a7ead8fc69070a94f805a4a8231a02c2abe0bf4bde7c`, minScale=1. Tools (13). Cortex still `00656-vek`. Re-read traffic and `/health` before you treat that as true.

Latest operator crop (2026-08-29T04:25Z): host chrome `Smart Site get_smart_site`, overlays pipeline / specialDistrict / well, buttons Save property and Find listing history. No boot strip in the crop. Label did not flip. Button did nothing. Open was a tool call, so `data-act="open"` is still unscored.

## Defect class

An artifact that exists, is correct, and does nothing. Current listing tests grep strings in `buildAppHtml()`. That cannot fail a live click. A check observed only passing has not been observed working.

## Presence first

Missing `script-ran` is three mechanisms. Score presence before state.

1. Boot strip visible and `script-off`: on the p542 HTML, script did not run. CSP or frozen snapshot.
2. No boot strip at all: old iframe (no `#boot`), or the host cropped `#boot` and our `.hdr`. Nothing proven about CSP. Reconnect if Open is also missing on a resolved row.
3. Resolved Pine row has no Open button: old build. Stop. Do not click listing.
4. Boot `script-ran` or header `script-ran` visible: that document ran JS. Then click listing.
5. Label flips to `Requesting listing history`, chat empty: `host_drop`.
6. Label sits with `script-ran` present: click is not reaching the handler.
7. Label flips, guarded turn, answer only in chat, panel unchanged: `working`.

Host chrome titled `get_smart_site` is not our `.hdr`. Our markers are `#boot` (`script-off` / `script-ran`) and the span `script-ran` in the card header. If the crop starts at overlays, say unmeasured, not absent.

A new Connect turn on an old connection can still be cached `00031-jih` HTML. Disconnect the connector and reconnect before a Connect grade. A `get_smart_site` tool call skips the Open button. Score Open only from a board click.

## Exact listing turn

```
Find listing history for ${who}. Search the public web for prior sales, price cuts, and listing copy. Put the answer only in this transcript. Do not call ask_the_map. Do not start Smart Site research. Do not write it into the Smart Site board or parcel panel.
```

`${who}` is `model.label || model.parcelNodeId || "this parcel"`. Gold label is `908 PINE , BASTROP, TX 78602`.

`classifyListingOutcome`: no turn + no ack = `handler_unbound`; no turn + ack = `host_drop`; guarded turn + `ask_the_map` = `guard_failed`; guarded turn + answer = `working`; guarded turn + no answer throws `listing_outcome_unclassified`.

## What you do

Do the mechanical tests first. File results. Only then ask the operator for a Connect pass. Do not start Wave H or A5. Do not ship a 14th tool. Do not put web results in the panel.

If the jsdom click test fails, fix the panel until it passes both directions, then PR MCP only. If it passes and Connect still does nothing after a proven p542 document, stop and report `host_drop` or `click_not_reaching_iframe`. Do not keep adding listeners that the host never runs.

Allowed product writes: `artifacts/smartsite-mcp/src/mcp-app.ts` and `artifacts/smartsite-mcp/tests/mcp-app.test.ts` in your isolated tree. Pathspec only.

Deploy if you ship: digest-pin `smartsite-mcp` only, `--no-traffic --tag=pNNN --min-instances=1`, no `--set-env-vars`, then `--to-tags=pNNN=100`. Leave cortex and `00646-luj`. Verify `/health` names the new revision by reading the JSON field.

## Close artifact

`_inbox/2026-08-29_p91_listing_fresh_close.md`

Must include: snapshot (repo, branch, commit), serving traffic JSON by field name, `/health` revision, each test row below as met / fail / unmeasured with one line of evidence, listing outcome if Connect ran, leave_behind.

---

# Test (the agent runs every row)

Falsifier column is what would prove the row wrong. Run the fail case on any row you claim as working.

Gold parcel `48021:34137`. Junk `zzzz-not-a-situs-99999`. Screen queries: `908 Pine, Bastrop TX` and the junk string.

## A. Serving (must pass before any Connect claim)

| ID | Check | How | Pass | Falsifier |
| --- | --- | --- | --- | --- |
| A1 | Live health | `curl https://mcp.smartsite.cloud/health` | JSON `revision` is a string | Trusting `latestReadyRevisionName` |
| A2 | Traffic 100% | `gcloud run services describe smartsite-mcp --format=json` then read `status.traffic[]` by field name | Exactly one row with `percent` 100 | Positional `--format=value` |
| A3 | Digest | Revision container image | Equals the Artifact Registry digest for the merge SHA, not a tag | Image tag `latest` |
| A4 | minScale | Revision annotation `autoscaling.knative.dev/minScale` | `1` | minScale 0 |
| A5 | Cortex untouched | Same JSON describe on `cortex-api` | `00656-vek` or whatever was 100% before you started, still 100%. `00646-luj` still tag `staging` at 0% | Any cortex traffic shift |
| A6 | Catalog | `GET https://mcp.smartsite.cloud/llms.txt` | `Tools (13)` | A 14th tool |
| A7 | HTML on the serving image | `resources/read` `ui://smartsite/app.html` if you have OAuth, else extract `buildAppHtml()` from the merge SHA that A3 named | Contains `id="boot"`, `script-off`, `script-ran`, `data-act="open"`, `data-act="listing"`, `document.body.addEventListener("click"`, `Requesting listing history` before `host.sendMessage` | Grepping a dirty worktree that is not the serving SHA |

## B. Source contract (local, against the SHA you will ship)

| ID | Check | How | Pass | Falsifier |
| --- | --- | --- | --- | --- |
| B1 | Package tests | `pnpm --filter @workspace/smartsite-mcp test` | Exit 0 | Green because a test was deleted |
| B2 | Existing greps | Current `mcp-app.test.ts` | Still asserts boot, body delegate, Open, ack-before-send, 13 tools, I5 fingerprint | Weakening an assertion to pass |
| B3 | htmlContractViolations | Plant private origin, 42%, cream hex, `ask_the_map(` | Each planted string fails | A check that only passes |

## C. jsdom click (you write this if it does not exist). This is the instrument.

File: `artifacts/smartsite-mcp/tests/mcp-app.dom.test.ts`. jsdom. Load `buildAppHtml()`, inject the inline script, do not mock `armListing`.

| ID | Check | How | Pass | Falsifier |
| --- | --- | --- | --- | --- |
| C1 | Boot starts off | Parse HTML before running the script | `#boot` text is `script-off` and `data-script="off"` | Defaulting the fixture to `script-ran` |
| C2 | Script flips boot | Run the inline script | `#boot` text is `script-ran` | Asserting only that the string exists in source |
| C3 | Parcel paint | `postMessage` a `ui/notifications/tool-result` for gold `get_smart_site` JSON: node `48021:34137`, label `908 PINE , BASTROP, TX 78602`, envelope refused `atom_path_pending` | Header contains the label and `script-ran`. Button `data-act="listing"` exists and reads `Find listing history`. No 42% | Painting the board instead of the parcel |
| C4 | Label first | Click the listing button | Button text is `Requesting listing history` and `disabled` before any `postMessage` is recorded | Flip after send |
| C5 | Message shape | Capture `parent.postMessage` | Method `ui/message`. Text equals `listingHistoryMessage` for that model. Contains `Do not call ask_the_map` and `public web` | A different opener |
| C6 | I5 | Fingerprint before vs after click | Equal. Overlays unchanged. No web copy in the DOM | Allowing an overlay append |
| C7 | Re-render survival | Click listing, then post a second tool-result that re-renders the parcel, then click again on the new button | Second click also flips and posts. Listener is on `document.body`, not the discarded node | Attaching a per-button listener that this test would still pass |
| C8 | Open | Paint a board with Pine resolved and zzzz unresolved. Click Open on Pine | `postMessage` text is `Open parcel 48021:34137 with get_smart_site depth node. Do not save it.` Unresolved row has no Open | Listing button on the board |
| C9 | Violation | Delete the body listener (or the listing branch) and re-run C4 | C4 fails | A test that still passes with the listener gone |

If C4 cannot be written because the script is a string inside a template and jsdom will not execute it, extract the panel script to a named function the HTML calls, then test the function. Do not skip C. A grep is not C.

## D. Connect (operator or you in a browser you can see)

Disconnect Smart Site MCP. Reconnect. New chat. Do not reuse an open iframe.

| ID | Check | How | Pass | Unmeasured if |
| --- | --- | --- | --- | --- |
| D1 | Connector refresh | New connection after A2 | You can say the iframe was created after the serving revision | Same chat as the 04:25Z crop |
| D2 | Screen | `create_screen` with Pine address and zzzz | Pine resolved `48021:34137`. zzzz unresolved, query verbatim | |
| D3 | Build presence on the board | Look at the board widget, not host chrome | Boot strip present, or Open present on Pine | Crop that starts at host chrome only |
| D4 | Old-build abort | If no boot and no Open | Stop. Score `old_iframe`. Do not click listing | |
| D5 | Open path | Click Open on Pine, not a tool call | Parcel panel opens. Envelope refused `atom_path_pending`. No 42% | Tool-call open (that skips D5) |
| D6 | Build presence on the parcel | After D5 | Boot strip or header `script-ran` visible. If the well is scrolled, scroll to the header. Screenshot the header, not only the last overlays | Crop of pipeline / well / buttons only |
| D7 | Script-off | Boot visible and `script-off` | Score `script_dead` (CSP or frozen snapshot). Do not treat as old iframe | |
| D8 | Listing click | Click Find listing history once | Record label before and after. Record whether a transcript turn appeared. Record tools called | |
| D9 | Score | Apply `classifyListingOutcome` plus presence rules above | One of: `old_iframe`, `script_dead`, `handler_unbound`, `host_drop`, `guard_failed`, `working` | Empty chat with no localAck and no presence check |
| D10 | I5 live | If a turn landed | Panel overlays and buttons (aside from the ack label) unchanged. Board `list_screens` unchanged. No listing copy in the panel | |

## Report shape

For every row: `id`, `result` (met / fail / unmeasured), `evidence` (one line, a command output or a visible string), `falsifier_run` (yes/no). If A fails, stop. If C9 does not fail when the listener is removed, C is not a test. If D3/D6 are unmeasured, do not score CSP.
