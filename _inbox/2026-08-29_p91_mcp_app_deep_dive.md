---
id: 2026-08-29_p91_mcp_app_deep_dive
title: P-91 deep dive. The miss never had a road to the board; the tool that answers questions cannot answer one
date: 2026-08-29
status: ready
plan_row: P-91, P-92
from: integration seat, P:/doc_repo main 2847a20
handoff_in: _inbox/2026-08-29_p91_mcp_app_deep_dive_handoff.md
serving_read: smartsite-mcp-00057-xuk 100% tag p554; cortex-api-00664-hib 100% tag p541 (gcloud describe --format=json, fields by name, 2026-08-29)
trees_read: P:/tmp/legacy-design-tools-p91-stone feat/p91-wave-h-stone 006fd009 + dirty; P:/tmp/legacy-design-tools-p91-cortex-leftover feat/p91-cortex-leftovers 889b1556 + dirty
instruments: _inbox/2026-08-29_p91_iframe_instrument.mjs (17 checks); _inbox/2026-08-29_p91_iframe_harness.mts (30 checks, independent build); ext-apps 10195ad and claude.com/docs/connectors/building/mcp-apps read 2026-08-29; one live ask_the_map call
supersedes_recommendation: wait_on_anthropic; ship_p555_for_f6_step_2
---

# 1. What was done

The handoff asked for a write-path deep dive starting from mechanism B. This seat read `mcp-app.ts`, `tools.ts`, `tool-honesty.ts`, the four F6 grades, the gold walk, the WDLL, the scratch file, and the connector card, then built a file-based instrument that runs the served iframe script in a DOM shim against recorded host messages, with a positive control and a not-vacuous case. Five read-only reviewers ran in parallel: one on the MCP Apps spec and Anthropic's host docs, one on the iframe, one on the MCP server, one on the cortex leftover hunks, one on product value. The iframe reviewer built a second harness without seeing the first. Nothing was committed, deployed, or written to a product tree.

# 2. The mechanism. Neither A nor B

The host renders one app instance per tool call that carries `_meta.ui.resourceUri`. The board is the `create_screen` or `list_screens` instance. The gold parcel painted in a second instance mounted by the `get_smart_site` call; the scratch record of 2026-08-29T04:05Z already named "the `get_smart_site` parcel iframe" with its own boot strip. The reply to `ui/message` is an acknowledgement with no content. Nothing routes a later tool call's result into an earlier instance, gold or miss.

Three independent proofs.

The spec. `McpUiMessageResult` is `{ isError?: boolean }`. The host SDK's own handler doc says "the host should NOT return conversation content or follow-up results". Anthropic's page on instance supersession says "Each time Claude calls a tool that renders an MCP App, a separate iframe is mounted in the conversation." `tool-input` and `tool-result` are sent once, to the instance the call mounted. Anthropic's troubleshooting page recommends "app-initiated tool calls to load additional data from within your widget".

The instrument (`_inbox/2026-08-29_p91_iframe_instrument.mjs`, 17 checks, all predictions held). A fresh instance receiving the p554 miss `{ parcels: [], notFound: [id] }` paints "No screen yet. Paste addresses in the chat. This panel does not search." The board instance, after the host acknowledges `ui/message` with `{}` (`reply=ok`), still has its 12s timer armed and paints "Open did not reach me" on a miss and on gold alike. Even in the same-instance hypothetical, the miss drops the three-row board to the empty panel, which contradicts F6 "board stays". Any window can repaint the panel; `ev.source` is never checked.

The second harness (`_inbox/2026-08-29_p91_iframe_harness.mts`, 30 checks, 0 unexpected, built independently under `node:vm`). Same three results, plus the sentence search: `NOT_ON_FILE` is written to the DOM only inside `accept()` and only when `openWait` or `openFail === OPEN_DID_NOT_REACH_ME`, which only `sendOpen`, the timer, and the error branch of the same instance can set. A fresh instance has never run `sendOpen`. The sentence exists in the HTML, satisfies the `miss_copy_unbound` grep, and is unreachable in the flow the host runs. That is the governing-rule defect class.

Why four punches did not move the observable: each changed what the miss looked like (`isError`, body shape) or what the board's reply handler did. None changed which instance the result reaches. On p551 and p552 the miss was `isError: true`, and a tracked spec issue reports Claude does not mount a widget on an error result, so there was no second instance at all. On p553 and p554 a second instance would have mounted and painted the F5 empty copy under the tool call. No grading script asked anyone to look there; every script scored "the panel" meaning the board.

Pre-registered falsifiers. Any `ui/notifications/tool-result` arriving in the board instance carrying the second call's payload kills "never routes". After Send, no new widget under the `get_smart_site` row while the board changes state kills "one instance per call". A `ui/message` reply carrying `content` kills "only an ack". The searched negatives: no write of `NOT_ON_FILE` outside `accept()`, no assignment to `openWait` or `openFail` outside the three sites named above.

# 3. How to get unstuck

## 3.1 Three observations on p554 before any deploy

O1. Read the boot strip verbatim on any live panel: `script-ran handshake=<state> caps=<keys> message=<...> reply=<...>`. The `caps=` field has never been recorded on any grade. If it names `serverTools`, the host will proxy `tools/call` from the iframe and the design in 3.2 is available. If it does not, the design in 3.3 is the only honest one.

O2. Gold Open on the A13 board, then Send. Prediction: at 12s the board reads "Open did not reach me" while the parcel appears in a new panel under the `get_smart_site` row. If the board itself becomes the parcel, section 2 is wrong and this document is withdrawn.

O3. Miss Open (`48021:900099` on A13, or any real unbaked id), then Send. Prediction: a new panel under the tool row reads "No screen yet. Paste addresses in the chat." If no panel mounts at all for that 200 result, the host suppresses empty results and 3.3 collapses to 3.2.

Optional O4 on Claude Desktop with developer mode: inspect the board iframe and add a `message` listener in its console before Send. Prediction: zero `tool-result` notifications arrive in the board; the `ui/message` reply is `{"jsonrpc":"2.0","id":N,"result":{}}`.

## 3.2 The design, as ruled: Open stays a turn; the new panel is the honest surface

Operator ruling, same day, after this document was first filed: every Open must land in Claude's context. That settles the fork this section originally left open. The widget-to-model side channel (`ui/update-model-context`) is reported dropped on both Claude surfaces, so an app-initiated `tools/call` from the board would paint in place and leave Claude blind to it. Open therefore stays a `ui/message` turn: the click drafts, the user presses Send, Claude runs `get_smart_site`, and the result is in Claude's context because Claude ran it. The Send click is Anthropic's consent design and does not go away.

The consequence is to use the host's printout model instead of fighting it. Every Open produces a new panel under its tool row, and that panel must be able to say parcel, miss, or refuse from the result alone (section 3.3). The board above says "Sent to chat. Press Send to open." on acknowledgement and stays a real board because its rows carry rail states from first paint. The thread reads as a board followed by a trail of parcels, which is how Claude's own apps behave. What is given up is Open in place with a Back control. What is gained is that "can I build a duplex on the one I just opened" answers from context with no re-fetch.

The app-initiated call remains the right tool for one thing: refreshing the board's own rows without a turn (a reopen picker, a re-pull of stubs). It is not the Open path. The `caps=` field on the boot strip still needs reading once, so that option is known to exist or not.

Second mechanism considered and rejected: self-fetch plus `ui/update-model-context`. Rejected on the two open reports of that channel being dropped; the falsifier is a "Reading widget context" step appearing in Claude's turn, cheap to check later without changing this cut.

Build plan and wire contract: `_inbox/2026-08-29_p91_build_plan_p555_p542.md`.

## 3.3 What goes into p555 regardless of O1

One URI, verified by violation in the harness before it ships, each item a fixture in both directions.

Stateless miss. `parse` maps `{ parcels: [], notFound }` to a fourth kind `miss` carrying the ids. `render` paints the miss sentence plus the ids for that kind with no dependency on `openWait`. Batch with both `parcels` and `notFound` non-empty paints the parcel and a miss line.

County-correct copy. `NOT_ON_FILE` is hardcoded "Not on file in Bastrop" and wrong for the other CAPCOG counties. Derive the county name from the fips prefix, "this county" when unknown.

Three sentences, three states. Dead (no reply in 12s), miss (result says not found), upgrade (`upgrade_required` in the body). Today upgrade paints as miss or as dead. A Free user's every Open is that case; see section 5.

Ack honesty. After `reply=ok` the host did receive the click; "Open did not reach me" is false. The ack clears the dead timer and paints "Sent. Press Send in the chat to open." The dead sentence is reserved for no reply. This amends F6 step 1 copy (WDLL item 6/16). If 3.2 ships, this path only remains under the secondary button.

Listener guard. `if (ev.source !== window.parent) return;` as the first line. Delete the bare `d.result.content` accept; unmatched responses are refused and counted on the boot line.

Attribute escaping. `esc` escapes `"` and `'`; `glyph` whitelists state against the five values and falls to `unread`.

Sticky state. `accept` decides `openFail` only when `openWait` is set; any accepted result otherwise clears it. A non-text first content part is its own declared state ("result not readable"), never `empty`; scan parts for the first text.

One parser. The served inline `parse` diverges from the tested `parseToolResult` in eight of ten fixtures (unknown rail states render as the bare square, a visual twin of absent-verified). Generate one from the other or delete the copy. Promote the harness into `tests/` so the served script, not the exported twin, is what the suite executes. The suite today never runs the listener, `accept`, `render`, the timer, or the inline parser; the two tests nearest F6 assert the defective branch is shaped the way it is.

## 3.4 What does not go into p555

Another `isError` or body-shape punch. A fifth `ui/message` variant. Any change to cortex from the stone tree. A 14th tool. `ui/update-model-context` as the primary channel. A listing feed.

# 4. Review findings, ranked

Severity is the reviewer's, re-read by this seat. File lines are working-tree lines in the named isolate.

## 4.1 MCP server (stone tree, `artifacts/smartsite-mcp/src`)

| Rank | Finding | Where | Status |
| --- | --- | --- | --- |
| 1 | `ask_the_map` cannot succeed. MCP posts `{parcelNodeId, message}`; cortex `RESEARCH_CHAT_BASE` drops the id and its `superRefine` demands `runId | address | workspaceDid | areaContext`. Every legal call is the sanitized 400 with `isError: true`. `tests/tools.test.ts:432-450` fixtures that 400 as expected. | `tools.ts:501-509`; cortex `brokerageBrief.ts:209-249` | Confirmed live this session: `invalid_request`, "Provide runId, address, or areaContext". The error body coaches the caller to inject `address` or `areaContext` through the `.passthrough()` schema, and `areaContext.visibleParcels[0].zoning` then shapes retrieval. Latent second defect: the chat handler's service branch skips the PE free-message meter, so the moment the body is fixed a Free user gets unmetered chat. |
| 2 | Identity join binds by `(provider, email)` with no verified-email check; A-037 says verified email. Paths 1 and 3 cannot match a WorkOS `sub` against BFF-written OIDC subjects. | `identity.ts:58-108`; `peAuth.ts:22-29` | Conditional HIGH. Falsifier (a): `select provider, left(subject,8) from pe_user_identities limit 20`; `user_`-prefixed subjects downgrade this to dead-path LOW. Run that before anything else. |
| 3 | `rewriteBakeMissForHost` turns a 404 that never checked parcel existence into `{ parcels: [], notFound }`, `isError: false`, dropping the reason. The iframe then paints "Not on file". A fabricated negative. | `tool-honesty.ts:320-342`; `tools.ts:266-271` | Carry `reason: "baked_snapshot_not_found"` and `parcelExists: "unmeasured"`, copy "No baked snapshot" until cortex probes existence (4.3 row 5). Batch path never 404s, so the rewrite only fires on single-id calls. |
| 4 | `run_report` stamps `reportKind`, `reportReadMode`, `async:false` onto 402/404/401 bodies. | `tool-honesty.ts:152-174`; `tools.ts:335-341` | Stamp only on `res.ok`. |
| 5 | `/health` derives `authConfigured` from `WORKOS_CLIENT_ID && WORKOS_JWKS_URI`; the `/mcp` gate is `jwksUri && workosIssuer`. Deploy smoke asserts HTTP 200 only; health returns 200 with `status: "degraded"`. Traffic can shift onto a server that 503s all MCP. | `health.ts:28-30`; `auth.ts:154-157`; `cloud-run-deploy-smartsite-mcp.yml` smoke step | Health calls `isAuthConfigured(loadAuthConfig())`; smoke asserts `.status == "ok"`. |
| 6 | `sanitizeExternalDraw` deletes the whole `draw` with no marker; float checks are substring matches (`'"estimate":0.7'` matches 0.70 to 0.79, misses 0.65); citation rule applied to flood and landUse only. | `tool-honesty.ts:215-258` | Emit `drawWithheld: {reason, overlayId}`; walk confidence by path; apply the rule uniformly or state why zoning is exempt. |
| 7 | `stripEntitlementForExternal` has no caller and, if wired, treats `authenticated: true` as entitled. | `tool-honesty.ts:7-33` | Delete or reduce. |
| 8 | `readOnlyHint: true` on `export_instrument` (creates an artifact when live) and on `ask_the_map` once metered. `get_smart_site` lacks `.max(50)` in the schema. `ask_the_map` `.passthrough()` where `.strict()` is the type-level control. | `tools.ts:124-164` | Enum and strict schemas. |
| 9 | `SERVICE_API_KEY` is the whole tenant boundary and is shared by smartsite-mcp, hauska-mcp-server, and the PE BFF; cortex accepts any non-`anon_` `X-PE-User-Id` without an existence check; tenant is always `"default"` on the service path. | `peServiceUserId.ts:28-39`; `propertyExplorer.ts:234-241` | Per-caller keys or an HMAC over `(userId, ts)`; log caller plus asserted user on cortex. |

Verified fine and not to be re-audited: `requireAuthContext()` throws outside the ALS store and every handler calls it first; no anonymous or default user exists in the MCP server; `/mcp` is the only MCP route and sits behind auth; jose enforces signature, `aud`, `iss`; per-request server plus stateless transport, no session bleed; cortex enforces the paid gate itself on `research/brief`, so the missing MCP-side gate on `get_smart_site` is not a bypass; screens and saves wire shapes carry no owner or tenant ids.

## 4.2 Iframe (stone tree, `mcp-app.ts`)

Beyond section 2 and 3.3: `pendingMsg` is a plain object, so `id: "constructor"` takes the reply branch (use `Object.create(null)`); `rec.rows` truthy but not an array throws inside the listener before `clearOpenTimer`, so a delivered result still ends as dead-Open; the literal debug token `script-ran` paints into the user-visible header; exported `renderParcelDraw` has zero escaping and is one reuse away from a server-side XSS; `htmlContractViolations` is entirely presence-shaped, `handshake_no_wait` is satisfied by its own comment text, and `miss_copy_unbound` is satisfied by the dead branch this document is about.

## 4.3 Cortex leftover (leftover tree, uncommitted hunks)

| Rank | Finding | Where | Fix shape |
| --- | --- | --- | --- |
| 1 | The existence check fails open to absence. `try { hit = await lookup(id) } catch { hit = null }` writes a durable `unresolved` row on pool exhaustion, statement timeout, or the deleted-Neon-endpoint auth error. `existingQuery` then returns that row on every later add and never re-runs the lookup; the test at `:342` asserts it must not. A transient DB error becomes a permanent false absence with no API path to correct it. Same collapse in `peScreenSaveResolveCore.ts:22-27` (`catch { return [] }`). Tests at `peScreenSave.test.ts:349-393` and `peScreenSaveResolve.test.ts:33-37` assert the fallback as specification. | `peScreenSave.ts:569-586, 558-567` | A throw is a refuse (`lookup_unavailable`, 503), nothing written. Core branch rethrows. If a row must be written the state is representable (a `reason` column; migration 0088 is not yet applied to live Neon per its own header, so amending it is cheap now). The idempotent short-circuit applies only to measured rows. Fix before these hunks are committed. |
| 2 | No JSON error boundary in the Express app. `withTimeout` has no rejection path, `mapPool` runs outside the try, the route has no try, and Express renders `finalhandler` HTML. MCP passes that HTML verbatim with `isError: true`. In non-production `DrizzleQueryError` embeds SQL and params in the page. | `peScreenSave.ts:338-354, 468-472`; `propertyExplorer.ts:461-487`; `app.ts` | One 4-arity JSON boundary after `app.use("/api", router)`. |
| 3 | `add_to_screen` pre-checks then inserts with no transaction and no 23505 catch; two concurrent adds of one node (an agent retry after the 30s abort) produce HTML 500. `create_screen`'s 23505 catch is unreachable and untestable: the memory store throws an `Error` with no `code`. | `peScreenSave.ts:550-578, 523-525`; `peScreenSaveMemory.ts:178` | Catch the violation, refetch, return the existing row. Give the memory store's error `code: "23505"` so the catch can be observed firing. |
| 4 | The 8s per-row timer starts at call time and includes pool-queue wait (pool max 10, concurrency 8, search budget 20s inside a transaction). Under a slow store most of a 40-row screen is written `unresolved` without a query running; nothing in the response says so. | `peScreenSave.ts:38, 380-390`; `txgioAddressResolve.ts:583, 661-680` | Declare it (`degraded: true`, per-row reason); bound the total to the 25s contract; cancel via the existing search budget rather than a second uncancelling timer. |
| 5 | `baked_snapshot_not_found` conflates absent parcel with unbaked parcel; the only gate before the 404 is the id format. `lookupParcelNodeForScreen` is one indexed `eq` and would split them. `refusePayloadAtServe`'s throw in the route is uncaught (HTML 500). | `propertyExplorer.ts:883-955`; `brokerageNodeFacets.ts:525-550` | 404 `parcel_not_found` vs 404 `baked_snapshot_not_found`; batch adds `absent: string[]` additively. Tests pinning the current value are listed in the reviewer's return. |
| 6 | `GET /saved-properties` has no limit and fans out two queries per row with no cap; one row failing `refusePayloadAtServe` fails the whole list. | `propertyExplorer.ts:298-329` | Limit plus cursor or a declared `truncated: true`; bounded fan-out; per-row refuse. |
| 7 | The existence probe compares the normalized suffix against raw `prop_id`; the store holds raw ids (`str(props.Prop_ID)`), reads normalize. Any county whose ids carry leading zeros gets a false absence with no error. Bastrop fixtures have none, so A5 and gold cannot catch it. | `txgioAddressResolve.ts:552`; `parcelNodeId.ts:39-62`; `cad-ingest/src/txgio/parse.ts:523` | Falsifier: `SELECT county_fips, count(*) FROM txgio_parcel WHERE prop_id ~ '^0\d' GROUP BY 1`. Zero rows means latent; any row means live. Query `ltrim(prop_id,'0') = suffix` or store a normalized column. |
| 8 | `lookupParcelNodeForScreen` itself has no test; the seam tests prove a double fails closed. `peScreenSave.test.ts:453-467` is a text-presence check on route source whose `not.toContain` is vacuous. | tests | A fake-db test with present, empty-situs, absent, and leading-zero cases. The leading-zero case fails today, which is the point. |

Verified fine: a rebound id is rejected (`:575`); HEAD's parse-equals-found is gone; `create_screen` duplicate refuse runs before the transaction and returns 400 JSON with both queries and no partial write; `isUniqueViolation` covers drizzle's `cause.code`; the resolved-implies-node CHECK holds at the DB and in the memory store; every `ok: false` reaches the wire as JSON.

# 5. What users would hit first

Three findings reframe the product before any cheap win.

A Free user cannot Open anything. `research/brief` sits behind `requirePePaidOrPropertyUnlocked()` at both depths, so even `depth stub` is paid on MCP while the LOCKED ladder says the inspect card is Free on the web. A Free Open returns 402 "Unlock this property or go Pro" ("Pro" is the ladder retired 2026-08-10); the MCP marks it `isError`, and the panel paints either "Not on file in Bastrop" or "Open did not reach me". Neither is "upgrade". `run_report`'s MCP gate is `tier === "paid"` and ignores the 30-day unlock cortex honours, so an unlocked Free parcel gets the brief via `get_smart_site` and a refuse via `run_report`. Whether stub or draw is Free on MCP is an operator decision, not a bug.

The board is empty at paint. Screen rows carry no stub, so forty rows paint forty gold dots; drainage is hardcoded `attempted: false` and is a permanent gold dot until item 21. A bare `list_screens` returns `{ screens: [...] }`, which the parser turns into `empty` and renders "No screen yet. Paste addresses in the chat." while the transcript lists the user's screens. The daily reopen path starts with a panel that looks broken.

`ask_the_map` is dead (4.1 row 1), and its description promises "visible map context" that does not exist in Claude.

Cheap wins inside the 13 tools, ranked by value over cost. Each names the WDLL item it touches.

| Rank | Proposal | Class | WDLL |
| --- | --- | --- | --- |
| 1 | Rails at first paint. `createScreen` and `listScreens(screenId)` attach `stub` to resolved rows; cortex already has `assembleStubBody` and the saved list does exactly this; the iframe already reads `r.stub`. I1-legal because it is the tool result the conversation sees. Do not do it as an iframe batch call that depends on host delivery. Bake-miss must map to `unknown`, not `unread` (item 5; the saved list's `?? "unread"` is the violation not to copy). | cortex | 4, 5, 12; new item |
| 2 | Open in place with Back (3.2). Miss, upgrade, and dead sentences in the row slot. | iframe | 13, 16 F6 |
| 3 | Three honest sentences, county-correct (3.3). | iframe | 16 F6, 12 |
| 4 | Reopen picker: render `{ screens }` as a list with one Open per screen, `updatedAt` and row count from the result. | iframe | 13; new |
| 5 | Save as status: the Save control offers New, Watching, Chasing, Passed and sends one `save_property(id, status)` turn. Needs no saved-state knowledge (I6). | iframe | 19; new |
| 6 | Ambiguous rows list `candidates` with "Use this" (an `add_to_screen` turn); unresolved rows offer "Look this up" (a `find_parcel` turn). The original row stays as typed; no tool rewrites a row. | iframe + copy | 18, 30; new |
| 7 | Walk-neighbor Add on the parcel panel: carry `screenId` through Open; button only on edges with `neighbor` set and no `roadNode` (item 15 guard). | iframe | 29, 15 |
| 8 | Enum schemas: `source` and `status` as literals. Type over check. Two error paths deleted. | server | new |
| 9 | Node id click-to-copy; drainage copy "not fetched in this version". | iframe | 12; 21 parked |

Descriptions. `constants.ts` is what the model reads. The worst three and their rewrites are in the product reviewer's return; the shape of each: `ask_the_map` flips to `readiness: "blocked"` with `blockedReason: "parcel chat path unwired"` so it returns `not_ready` rather than a coaching 400 (no catalog change), and its copy drops "visible map context". `get_smart_site` says any parcel in coverage, no save needed, what each depth returns, what is never on the wire (setback distances, use tables, listings, sales, owner), the tier rule, the array cap and `notFound`. `find_parcel` says up to 10 hits plus `missClass`, one address here and a list to `create_screen`, and that an empty result is "no match in our store" not "does not exist". `list_screens` says the bare call lists and does not open a board. `save_property` and `set_property_status` name the four exact-case statuses.

Beyond the 13 tools, named and not endorsed: a `share_property` that mints a grant (today Claude will offer `draw.url`, a viewer-tier deep link, as if it were a share); a flood-study intake (the scratch OPEN of 2026-08-29T15:33Z; belongs as a flood facet in the bake, same atom-path blocker as envelope).

Honesty risks in the above and the fail-closed rendering: rails at first paint must never paint a miss as `unread`; the upgrade sentence carries nothing from the 402 body but the state; the candidate picker lists all hits and auto-picks nothing; the walk button exists only for a neighbor id present in `draw.edges`; a Save acknowledgement comes only from the tool reply and is session-local; `ask_the_map` wiring makes the MCP schema `.strict()` and lets cortex build the subject from the bake so a Claude-supplied district is refused; zoning answers get `agentGuidance` that uses are not on this wire; listing history stays transcript-only; `draw.url` is described as a deep link, not a share.

# 6. Decisions for the operator

1. Ruled 2026-08-29 (operator): Open stays a turn so every opened parcel lands in Claude's context. Item 13 is unchanged. F6 step 2 is re-specified to the panel under the tool row (decision 5 below). Reversal: Claude's `ui/update-model-context` channel is observed working on both surfaces, at which point in-place Open plus a context push can be reconsidered as a named card.

2. Free tier on MCP. Today nothing opens for Free. Options: mirror the web ladder (stub Free, draw Free, brief paid); or keep paid-only and make the panel say "upgrade". This seat's call: mirror the web ladder for `depth stub`, keep `node` paid, and paint the upgrade sentence. Reason: a board of gold dots that refuses every Open is not a product a Free user will pay to unlock.

3. `ask_the_map`: flip to `blocked`/`not_ready` now (honest, no catalog change), and card the wiring (subject from the bake, `.strict()`, PE meter on the service path) as its own item. This seat's call: yes to both; do not leave a coaching 400 in production.

4. Cortex leftover hunks: fix 4.3 row 1 before committing. The tests that pin the fail-open must change with it. This seat's call: do not commit the leftover hunks as they stand.

5. Item 16 F6 step 2: the check as written (miss sentence on the board after Send via `ui/message`) cannot be met on this host. Re-specify to the 3.2 design (sentence in the row slot on an app-initiated call) or, if 3.2 is rejected, to the second-instance sentence under the tool row. Item 16 stays held gold n=1 either way.

6. Rails at first paint (5, rank 1) as a P-91 item or the first P-92 item. This seat's call: P-91, because the board is the product and today it is empty.

# 7. Instruments and the next check

Both harnesses are tracked next to this document. Before p555 ships, the p554 observations O2 and O3 become recorded fixtures in the harness (the exact `postMessage` payloads, if O4 is run, otherwise the painted text), and the p555 change must make a pre-registered check flip from fail to pass on those fixtures. A URI that ships without that is the treadmill.

Two SQL falsifiers to run first, from a seat with Neon access: 4.1 row 2 (a) on `pe_user_identities`, and 4.3 row 7 on `txgio_parcel`.

leave_behind:
  - item: this document and two instrument files in _inbox
    owner: integration
    plan_row: P-91 item 16
  - item: dirty stone tree (p554 iframe hunks) and dirty leftover tree (existence hunks with the fail-open in 4.3 row 1)
    owner: property seat
    plan_row: P-91 items 16, 18, 29
  - item: A13 board still holds 48021:900099 written resolved from before the check
    owner: property seat
    plan_row: P-91 item 16
  - item: ask_the_map live 400 on every legal call
    owner: property seat
    plan_row: P-91 item 10, new item
