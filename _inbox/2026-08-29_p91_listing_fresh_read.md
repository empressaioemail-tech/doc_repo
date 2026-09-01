---
id: 2026-08-29_p91_listing_fresh_read
title: Listing host_drop is a grading defect, not a bind defect. Read the reply.
date: 2026-08-29
status: ready
plan_row: P-91
items: [16, 26]
serving: smartsite-mcp-00039-req
supersedes_recommendation: grade_p545
---

# 1. Snapshot

Repository `P:\doc_repo`, branch `main`, commit `f7a9d2a94c6c398ffcfea7a113118cd1738206df`, equal to `origin/main`. Seat is integration. Product source was read only, from the registered worktree `P:/seat-worktrees/property/legacy-design-tools-p91-listing` on `feat/p91-ui-message-object` at `6f93139d4f37157cef9ff7bb8d02ba0223a196f6`. No product write. No commit.

Serving, read from `gcloud run services describe smartsite-mcp --region us-central1 --project legacy-design-tools-prod --format=json` by field name, not through a positional formatter:

```
latestReadyRevisionName: smartsite-mcp-00039-req
  revisionName='smartsite-mcp-00039-req' percent=100 tag='p545'
  revisionName='smartsite-mcp-00037-xoz' percent=None tag='p544'
  revisionName='smartsite-mcp-00035-tov' percent=None tag='p543'
  revisionName='smartsite-mcp-00033-hin' percent=None tag='p542'
  revisionName='smartsite-mcp-00031-jih' percent=None tag='p541'
```

Live `/health` on `https://smartsite-mcp-1062716564162.us-central1.run.app`:

```
{"status":"ok","service":"smartsite-mcp","name":"Smart Site","version":"0.0.1","authConfigured":true,"cortexConfigured":true,"revision":"smartsite-mcp-00039-req","failureDomain":"smartsite-mcp"}
```

Traffic and health agree on `00039-req`. The handoff serving line is confirmed at source. Note the service lives in project `legacy-design-tools-prod`, not `hauska-prod-497015`.

# 2. The observation

Four Connect grades on listing. `00031-jih` scored `handler_unbound`, correctly, because the label never moved. `00033-hin`, `00035-tov` and `00037-xoz` each scored `host_drop`: boot `script-ran`, header `script-ran`, label flipped to Requesting listing history, `Posted 281 chars`, no transcript turn, no tools after the click, panel unchanged. Three orthogonal corrections were shipped across those three revisions, a JSON-RPC request id, an initialize-then-wait handshake, and a resource URI bump, and the observable did not move by one character. `00039-req` is serving with a fourth correction, the content shape, and is ungraded.

# 3. The defect class

Every one of those scores was derived from a proxy. The score reads a downstream absence in the transcript and infers an upstream cause in the host. But the protocol is bidirectional, and it carries its own authoritative answer to the exact question being asked. We have been discarding that answer, unread, on every run.

Two records prove it, both from `@modelcontextprotocol/ext-apps` `src/spec.types.ts` on `main` and its generated `src/generated/schema.json`.

First, `ui/message` is an optional host capability, not a required one:

```
export interface McpUiHostCapabilities {
  ...
  /** @description Host supports receiving content messages (ui/message) from the view. */
  message?: McpUiSupportedContentBlockModalities;
```

The host declares that capability, and the content modalities it will accept within it (`text`, `image`, `audio`, `resource`, `resourceLink`, `structuredContent`), in `McpUiInitializeResult.hostCapabilities`. That result is the reply to the `ui/initialize` we have been sending since p544. Our listener at `artifacts/smartsite-mcp/src/mcp-app.ts:555` reads it like this:

```
if(String(d.id)===String(initId)&&(d.result!==undefined||d.error)){
  markHandshake(d.error?"error":"ready");
  flushReady();
}
```

It tests that a result exists and throws the result away. Open question 1, does Claude Connect implement `ui/message` at all, has been answered by the host on every Connect run since p544 and has never been looked at.

Second, the host replies to `ui/message` itself:

```
export interface McpUiMessageResult {
  /** @description True if the host rejected or failed to deliver the message. */
  isError?: boolean;
```

We send `ui/message` with `id:rpcId++` and have no handler for that id. Open question 2, which content shape the host accepts, has been answered up to three times and discarded the same way. A `-32601` method-not-found error keyed to that id would have landed in the same listener and fallen through the same floor.

There is a third instance of the class one level down. p544 shipped `data-handshake` with values `wait|ready|error|timeout`, which separates a completed handshake from a 2s timeout fallback. It is set as a DOM attribute on a strip whose visible text says only `script-ran`. The only grading channel is an operator reading a painted panel. The instrument was shipped, is correct, and cannot be read by the one party who does the reading. It is starved, and it reports as success.

The class: we built a one-way instrument on a two-way protocol, then graded four times on the half that carries no information.

# 4. Mechanisms

All four below produce Posted 281 and no turn. Nothing measured so far separates them.

**M1. The host does not implement the `message` capability.** Spec-legal, since `message?` is optional. The published client matrix marks Claude web as supporting MCP Apps, but that matrix is extension-level, not method-level, so it does not answer this. A host that renders apps and pushes tool results down, but declines to let a third-party iframe inject user turns, is fully compliant and would behave exactly as observed. Distinguisher: `hostCapabilities.message` in the initialize result. Not run.

**M2. The host implements it and rejected our payload.** Either a schema failure on the content shape, an undeclared modality, or the consent path, since the spec states the host MAY request user consent. Distinguisher: the reply keyed to the `ui/message` id, specifically `isError`, or a JSON-RPC error object. Not run.

**M3. The handshake never completed, we fired on the 2s timeout, and the host discards pre-ready traffic.** Distinguisher: `data-handshake` equals `ready` versus `timeout`. Already present in the DOM on the serving revision. Not run, because it is invisible to the grader.

**M4. The host consent-gated the message and surfaced it where the grade never looked.** The composer, a permission chip, a pending-approval affordance. Every grade recorded the transcript and the panel. None recorded the message composer. Distinguisher: look at the composer after the click. Not run.

The mechanism I reject is the one the last three ships were built on, that the framing is nearly right and one more protocol correction lands it. I reject it because three independent interventions produced a byte-identical observable. A defect whose observable does not move under three orthogonal corrections is not in the domain those corrections address. Continuing to patch there is the treadmill.

I do not reject M1 through M4. All four are live, and one run separates all four.

# 5. Regression finding on the serving revision

p545 changed `params.content` from a `ContentBlock` array to a single object, on the strength of the prose example in `specification/2026-01-26/apps.mdx`. The normative types and the generated schema disagree with that example. `spec.types.ts` declares `content: ContentBlock[]`, and `src/generated/schema.json` under `$defs.McpUiMessageRequest.properties.params.properties.content` declares:

```
"content": { "type": "array", "items": { "anyOf": [ ... ] } }
```

A host built on the SDK validates against the generated schema. A single object fails it. The handoff framed this as a symmetric spec split where either shape might be right. It is not symmetric: the schema is normative, the prose example is illustrative and wrong. p545 is therefore a probable regression, and a bare grade of it would most likely return a fifth `host_drop` caused by a new defect, teaching nothing about the original one. That is the strongest argument against `grade_p545` as the next move.

# 6. Recommended next move

A named fourth: **`read_the_reply`**. One instrument ship that makes the host's own answers visible to the grader, then one Connect run.

Because the answers to open questions 1 and 2 are already being delivered into our iframe and thrown away, and one run that reads them separates M1, M2, M3 and M4 at once, where a fifth bare grade separates nothing.

The ship changes no bind logic and the click path stays byte-identical. Contents: revert `params.content` to the schema-normative array; keep the initialize result and render the keys of `hostCapabilities`, and of `hostCapabilities.message` if present, as visible text in the boot strip; add a reply handler for the `ui/message` id and render `isError` or the JSON-RPC error code as visible text; promote `data-handshake` from an attribute to visible text. The Connect script gains one line, look at the message composer as well as the transcript.

Do not bundle a new theory into the instrument ship. No `ui/update-model-context` fallback, no typed-turn substitute, no second verb. The instrument measures; the next ship acts on what it measured. Bundling them is how the last three ships each destroyed their own evidence.

If that run returns `hostCapabilities` with no `message` key, then `ui/message` is the wrong verb for this host, open question 4 answers itself, and the decision moves to whether listing ships as a copyable prompt, as `ui/update-model-context` plus an operator turn, or parks. That is a product call for Nick, not a further widget iteration.

# 7. What I will not do

I refuse another click-listener ship. I refuse another resource URI bump offered as a fix. I refuse a Connect run on any build whose only readout is the transcript, because that readout has already returned the same non-answer four times. I am not opening Open on the board, not starting Wave H, not starting A5 forty, not touching `ask_the_map`, not adding a fourteenth tool, and not deploying without Nick's go. I did not relitigate the four earned scores; `00031-jih` `handler_unbound` and the three `host_drop` labels stand as recorded against what was observable at the time.

# 8. leave_behind

```
leave_behind:
  - item: p545 single-object ui/message content shape on serving 00039-req (schema-invalid)
    owner: property seat
    plan_row: P-91 item 26
  - item: data-handshake attribute is unreadable by the grading channel
    owner: property seat
    plan_row: P-91 item 26
  - item: Open on the board painted and dead on a document that ran JS
    owner: property seat
    plan_row: P-91 item 12
  - item: canvases/smartsite-mcp-loop.canvas.tsx stale at 00033-hin / outcome 1
    owner: integration
    plan_row: P-91 item 16
```

# Sources

- `@modelcontextprotocol/ext-apps` `src/spec.types.ts` at `main`, read via `gh api`
- `@modelcontextprotocol/ext-apps` `src/generated/schema.json` at `main`, read via `gh api`
- `specification/2026-01-26/apps.mdx`
- `https://modelcontextprotocol.io/extensions/client-matrix`
- `artifacts/smartsite-mcp/src/mcp-app.ts` at `6f93139d`
