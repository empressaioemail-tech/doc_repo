## Mission: wire plan-review's ledger reconciliation to the live substrate reader

Plan row G-112 (OPS-17, added 2026-09-02 A-096). Both prerequisites this row
was blocked on are now live: G-111 (substrate) shipped the `request_id`
echo-back and the reader endpoint; a `platform_internal`/`codex`/`team` key
for plan-review to call it is minted and stored. Nothing consumes either
yet — that's this row.

### Context verified 2026-09-02, trust this over any older comment in the code

- `src/ledger-reconciliation.mjs`'s `fetchLedgerRows()` returns `null` on
  purpose — read its own docstring before touching anything, it names
  exactly this row as the trigger to change it. `reconcileActivity()` is
  already correct and tested; do not modify its logic, only what feeds it.
- `src/mcp.mjs`'s `mcpCall()` currently discards the HTTP response headers
  entirely — it does `const raw = await res.text()` then returns
  `textPayload(parseSseOrJson(raw))`, never touching `res.headers`. The new
  `x-hauska-request-id` header (confirmed live on every `/mcp` tool-call
  response, OPS-17 A-094) needs to be captured here. `mcpCall` is shared by
  every MCP-calling route in this service (`getPropertyAtomChain`,
  `getAtom`, and whatever else calls it) — changing its return shape is a
  cross-cutting change. Prefer adding the header value as an additional
  property on the object `textPayload` already returns rather than changing
  its shape to a tuple/array, so existing call sites that read specific
  fields off the result (e.g. `chain.data`) keep working unchanged. Verify
  this claim yourself before relying on it — read every call site.
- `src/store.mjs`'s `recordActivity(row)` already accepts `row.requestId`
  and stores it in `plan_review_activity.request_id` (column exists,
  `sql/003`, already applied). Every current call site passes `requestId:
  null` (or omits it) with a comment saying it's null "until
  hauska-mcp-server gives this service a way to learn the request_id" —
  that comment is now stale; find every such call site and thread the
  captured header value through instead of leaving it null. Do not conflate
  this with `dedupKey` (`sql/004`) — a different, already-correct concept
  (plan-review's own write-time idempotency key, unrelated to the ledger's
  `request_id`).
- The reader: `GET /obligations/source-ledger` on `hauska-mcp-server`,
  requires `X-Hauska-Key` with a `platform_internal` key. That key is
  stored as GCP secret `plan-review-platform-key` (project
  `plan-review-505715`), already IAM-granted to the plan-review Cloud Run
  runtime service account — bind it to the service on your deploy
  (`--update-secrets=HAUSKA_PLATFORM_KEY=plan-review-platform-key:latest`
  or whatever env var name you choose; nothing currently reads it, name is
  your call, just be consistent and document it). Query by `request_id`
  and/or `source_actor_did` per the endpoint's own params (read
  `source-obligation-reader.ts` in `hauska-mcp-server` — read-only,
  substrate's repo, do not write there).
- `source_obligation_ledger` still has no `book_id`/`section_id` columns
  (S4-7, substrate, not landed). `reconcileActivity()` only compares
  `sourceActorDid` once a `request_id` match is found — that's already
  correct and sufficient for this row; do not attempt citation-level
  comparison, it has nothing to compare against yet.

### Acceptance

1. Live probe: a real call through a route that produces an ICC citation
   (the code-lookup route, or wherever the service actually calls the ICC
   corpus through the MCP gate) results in a `plan_review_activity` row
   whose `request_id` matches the `x-hauska-request-id` the MCP call
   actually returned — confirmed by direct query, not by reading the code
   and assuming it works.
2. Live probe: with real ledger rows behind it, `reconcileActivity()`
   (called through whatever route/tool exposes it, or directly in a scratch
   script against production data) returns at least one genuine `matched`
   or `divergent` result — not `ledger-unavailable`. If every row in the
   window happens to be `no-correlation-key`, that's a legitimate finding —
   state which and why, don't force a match.
3. Existing behavior unchanged: `getPropertyAtomChain`/`getAtom` and any
   other `mcpCall` consumer still work exactly as before — this is an
   additive change to what `mcpCall` returns, not a rewrite. Regression-test
   the existing MCP-calling routes, live, post-deploy.

### Out of scope

Do not touch `hauska-mcp-server` (substrate's repo) beyond reading it for
context. Do not attempt S4-7 (citation-level ledger columns) or the real
ICC rate. Do not touch Smart Files or Dashboards. Live Bastrop is absolute
no-touch. Deploy is yours to do (deploys are planner-owned) — use the same
tag + smoke-test + shift discipline this whole wave has used, not a blind
straight-to-100% deploy.
