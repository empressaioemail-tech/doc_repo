---
id: 2026-09-02_govtech_to_substrate_ledger_asks
title: Request to substrate seat — two ICC obligation ledger blockers found by govtech (G-109)
status: active
last_updated: 2026-09-02
applies_to: hauska-mcp-server (substrate seat)
owner: nick
related:
  - 90_operations/OPS-17_govtech_stack_plan_of_record (A-090)
  - _inbox/2026-09-02_d_close.json
plan_row: S4-3, S4-7 (OPS-17 Wave 1, referenced from G-109)
---

# Request to substrate — two ICC obligation ledger blockers

Filed by the govtech-thread planner (doc-repo-1d) on behalf of two executor sessions
that independently found and confirmed the same two gaps while building G-109 (the
plan-review half of the ICC obligation ledger chain, OPS-17 A-090). Neither is
something govtech can build around — both live in `hauska-mcp-server`, which is
substrate's repo, out of scope for the govtech seat to write.

Plan-review's half (`plan-review` PR #8, merged) is done and CI-green: it matches
`source_obligation_ledger.request_id` against `plan_review_activity`, reports a typed
`ledger-unavailable` state rather than a fabricated match when it can't read the
ledger, and folds a reader into the existing `GET /api/icc/activity` endpoint. It is
currently **structurally unable to produce a single real reconciled match**, for the
two reasons below — not because of a bug in what govtech built, but because the
substrate-side pieces it needs don't exist yet.

## Ask 1 — echo `request_id` back to the caller (blocks S4-1b reconciliation)

`hauska-mcp-server` mints `source_obligation_ledger.request_id` server-side via
`randomUUID()` (`src/index.ts:289`) and never returns it in the response body or a
header. Plan-review's activity table can only reconcile against the ledger by
`request_id` — that's the join key the whole design (and the WDLL's own item 12
check) assumes. Without it coming back to the caller, there is no way to correlate a
specific plan-review call to the ledger row it produced.

Either shape closes this:
- Echo the minted `request_id` back on the response (body field or header) so the
  caller can record it and join later, or
- Accept and honor a caller-supplied correlation id on the request, so plan-review
  mints its own id up front and the ledger row carries it.

Verified by reading `src/index.ts`, `tools.ts`, `source-obligation-meter.ts`,
`gate-front.ts`, `request-context.ts` (not assumed) and confirmed independently by
two sessions working the same dispatch from different starting points.

## Ask 2 — a reader tool or endpoint for `source_obligation_ledger` (blocks S4-8 fully doing its job)

Zero matches for `ledger` or `obligation` in `hauska-mcp-server/src/tools.ts` — there
is no MCP tool or endpoint that reads `source_obligation_ledger` today. Even with
Ask 1 fixed, plan-review's reader can only report what plan-review itself can see
(its own activity table), not confirm against the authoritative ledger a licensor
would actually audit. This is R-I's own ruling made real: the ledger is
authoritative, activity is a cache — but nothing on the substrate side lets a
consumer read the authoritative source to check the cache against it.

Shape is substrate's call; a scoped read (by `request_id`, by `source_actor_did`, or
both) would be enough for reconciliation and for a real audit reader, without needing
to expose the whole table.

## Also worth knowing, not a substrate ask

`source_obligation_ledger` has no `book_id`/`section_id`/`edition_id` columns today
(real schema in OPS-17 A-088/A-090). WDLL item 12 was written assuming those columns
exist. If S4-7 (recording the cited atom + book_id + section_id, already substrate's
row) is meant to add them, landing it would also close that gap — worth confirming
whether S4-7's scope already covers this or needs to be widened.

## Why this wasn't built around

Both plan-review sessions considered and rejected working around these gaps (see
`workingNotes` in `_inbox/2026-09-02_d_close.json`) — an exploratory client call to a
not-yet-existing MCP tool was written, tested against the deployed server to confirm
its actual error shape, then reverted in favor of an honest typed-absence result.
Fabricating a reconciled match, or inventing a client-side citation shape the server
doesn't provide, is exactly the failure class this whole product line exists to
refuse.
