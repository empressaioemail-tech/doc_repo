## Mission: ICC obligation ledger — substrate half (request_id echo-back + reader)

Plan row G-111 (OPS-17, Layer 1 Wave 1, added 2026-09-02 A-091). This is the
substrate-seat half of what G-109 (govtech, CLOSED PARTIAL A-090) could not close on
its own. Full background: `_inbox/2026-09-02_govtech_to_substrate_ledger_asks.md`
(the filed request) and `_inbox/2026-09-02_d_close.json` (the govtech close that
surfaced both gaps).

### Context verified by two independent sessions building G-109 (2026-09-02) — trust this over older docs

- `plan-review` PR #8 (merged) matches `source_obligation_ledger.request_id` against
  its own `plan_review_activity` table. It cannot produce a single real reconciled
  match today, for two reasons, both here:
- **Gap 1 (blocks reconciliation).** `hauska-mcp-server` mints
  `source_obligation_ledger.request_id` server-side via `randomUUID()`
  (`src/index.ts:289`) and never returns it to the caller in a response body or
  header. Confirmed by reading `src/index.ts`, `tools.ts`,
  `source-obligation-meter.ts`, `gate-front.ts`, `request-context.ts` — not assumed.
- **Gap 2 (blocks the reader).** Zero matches for `ledger` or `obligation` in
  `hauska-mcp-server/src/tools.ts` — no MCP tool or endpoint reads
  `source_obligation_ledger` at all today. Even with Gap 1 fixed, a consumer has no
  substrate-side path to check a cached value against the authoritative ledger
  (R-I: ledger is authoritative, activity is a cache).
- The registered worktree for this class of work,
  `P:/seat-worktrees/substrate/hauska-mcp-icc-meter` (branch `feat/icc-meter-s1-s4`),
  exists on disk but is **13 commits behind current `origin/main`** — it's what PR
  #75 (the meter-bypass fix, merged 2026-08-24, OPS-17 A-088) shipped from and was
  never cleaned up. Fetch fresh and start a new branch off current `origin/main`
  from there; do not build on the stale branch tip.
- `source_obligation_ledger`'s real schema (verified live, migration 009 applied):
  `id, created_at, source_actor_did, atom_did, tool, product, tier, request_id,
  obligation_type, amount_minor, currency, grace_terms, note`. No
  `book_id`/`section_id`/`edition_id` columns exist — if S4-7 is meant to add a
  citation-shaped quadruple, that's this row's job; don't assume it's already there.
- DEPLOY-75 closed with a named residual (A-088): the true-positive path (does a
  real ICC citation still accrue correctly post-fix) is unverified — anonymous
  `get_atom` on the ICC corpus atom is refused, needs a `codex`-tier product key.
  Worth resolving alongside this row if a key becomes available, not required to
  close it.

### Scope

**Gap 1 — echo `request_id` back.** Either shape closes it: echo the minted id on
the response (body field or header), or accept and honor a caller-supplied
correlation id on the request. Your call which; state the reasoning in your close.

**Gap 2 — a reader.** A scoped MCP tool or endpoint that reads
`source_obligation_ledger` by `request_id` and/or `source_actor_did`. Shape is your
call — exposing the whole table isn't necessary, a licensor audit and plan-review's
reconciliation both only need scoped lookups.

### Acceptance

1. Live probe: any plan-review Codex-gate tool call against a known ICC section
   returns a `request_id` (or accepts one) that the caller can read back — not just
   log server-side.
2. Live probe: the new reader tool/endpoint returns the ledger row(s) for that same
   `request_id`, with non-null `source_actor_did`.
3. Once both land, notify the govtech thread (this session, or directly to
   `plan-review` PR #8's author) — G-109's reconciliation can then be re-verified
   end to end and the production migration/deploy (held per A-090) reconsidered.

### Out of scope

Do not touch `plan-review`, `smart-files`, or `smartcity-dashboards` — those are
govtech's repos. Do not set the real ICC rate (O-1, S4-B1). Do not attempt the
DEPLOY-75 true-positive verification unless a codex-tier key is already in hand.
