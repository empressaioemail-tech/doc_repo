## Mission: ICC obligation ledger — reconciliation and reader (govtech half only)

Plan row G-109 (OPS-17, Layer 1 Wave 1). WDLL acceptance items 11, 12 in
`_inbox/2026-08-25_govtech_wave1_WDLL.md` describe the full row; **this dispatch
covers only the govtech-seat half of it.** S4-3 (populate `sourceActorDid` on
envelopes) and S4-7 (record cited atom + book_id + section_id) are seat
`substrate`, live in `hauska-mcp-server`, and are NOT in scope here — request them
from the substrate seat. Building them here would be writing another seat's repo.

### Context verified this session (2026-09-02) — the WDLL's own schema assumption is wrong, read this first

- Migration 009 IS applied. `source_obligation_ledger` exists on the MCP server's
  Neon (`hauska-prod-497015`), 12 rows, all pre-dating the #75 fix (most recent
  2026-08-16; #75 merged 2026-08-24). Item 11 is effectively met — do not re-run
  that check, just cite this.
- **The WDLL's item 12 check assumes columns that do not exist.** It expects
  `reference_kind, book_id, section_id, edition_id`. The REAL schema is: `id,
  created_at, source_actor_did (not null), atom_did (not null), tool (not null),
  product (not null), tier (not null), request_id (not null), obligation_type
  (default 'license-reference-royalty'), amount_minor, currency, grace_terms, note`.
  There is no citation-shaped quadruple on this table today — `atom_did` is the only
  link back to what was cited, and `book_id`/`section_id`/`edition_id` would need to
  come from a JOIN against the atom itself (that's plausibly what S4-7 from
  substrate is meant to add — confirm with them, don't assume). Do not write S4-1b
  or S4-8 against the WDLL's literal column list; write against the real one, and
  flag the mismatch back if S4-7 is supposed to have closed this gap and hasn't.
- `amount_minor` is null on every existing row — expected at this stage. The real
  ICC rate (O-1) is explicitly deferred until after this accrual work closes; do not
  block on it and do not invent a rate.
- DEPLOY-75 is LIVE and graded, WITH A NAMED RESIDUAL (OPS-17 A-088): the PR's own
  shipped self-test (`scripts/violation-probes.mjs` in hauska-mcp-server) passes
  non-vacuously, and a live replay of a known false-positive (a non-ICC Bastrop
  setback-rule that was wrongly billed pre-fix) now correctly produces zero accrual.
  **The true-positive path — does a real ICC citation still accrue correctly — is
  UNVERIFIED.** Anonymous `get_atom` on the ICC corpus atom is refused
  (`"not readable under the caller's accessPolicy"`); it needs a `codex`-tier
  product key, which wasn't available this session. Build S4-1b/S4-8 to tolerate
  this being an open question, and get a codex-tier key before calling this track
  fully done — that's item q11 on the canvas queue.

### Scope for this dispatch

**S4-1b — ledger reconciliation.** `source_obligation_ledger` is authoritative;
activity (the existing activity table on plan-review) is a cache (R-I, closed
ruling). Implement the reconciliation: dedup keys, activity rows matched against
ledger rows by `request_id`, divergence surfaced rather than silently dropped.
Depends on S4-7 landing from substrate first (or at least a stable interim shape
you can build against — confirm with them before assuming the shape).

**S4-8 — obligation ledger reader.** A reader endpoint or view a licensor could
audit against. Where this lives (plan-review, or a new small surface) is not
decided — read `_decisions/2026-08-16_g60_does_not_wait_on_l26.md` and the seam
table in OPS-17 for precedent, and make a call; note the reasoning in your close.

### Out of scope

S4-3, S4-7 (substrate's repo, request don't build). The real ICC rate (O-1, S4-B1).
Circle billing (S4-11). S2-1 engine migration. Live Bastrop is absolute no-touch.
