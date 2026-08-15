## Mission — Lane A / G-34: typed absence on the Smart Files store

You are the LANE A planner, continuing the lane. G-14 built the Smart Files foundation and left one
named gap. This dispatch closes it.

**Read `_inbox/2026-08-15_a_close.json` first.** It is your predecessor's close (same lane, previous
dispatch) and it carries `missionPremise`, `completionPredicate`, and `scopeBasis` plus the frozen WDLL
card at `_inbox/2026-08-15_a_wdll_g14_frozen.md`. Per DEV_PROCESS 3.3b this dispatch names the prior
artifacts explicitly: **you inherit that lane state; you do not re-derive it and you do not re-author
the G-14 card.**

### Where G-14 left off — the honest state

PR #430 merged at `7bb79248` (planner-verified: MERGED, all `statusCheckRollup` conclusion strings
SUCCESS). Three tables — `smart_file_documents` (identity), `smart_file_versions` (content,
append-only), `smart_file_placements` (location, many-to-many). Placements reference the DOCUMENT, never
a version, so revise-once-current-everywhere is structural. entityId is
`smartfile:<jurisdictionFips>:<docSlug>` per `_decisions/2026-08-15_smart_files_entity_id_shape.md`.

**G-14 is deliberately NOT CLOSED and this dispatch does not close it.** Its remaining obligation is to
apply `lib/db/drizzle/0078_smart_files_foundation.sql` to the deployment database and refresh the
fixture from live. **The operator has ruled HOLD on that apply** (OPS-17 A-014) — it is a production
schema change on a shared database. **You do not apply 0078. You do not run migrations against any
deployment database.** If your work needs the tables live somewhere, use a scratch or test database and
say so.

The store's own header states the gap, at `smartFileStore.ts:23` in the merge commit:

> *No typed absence. `readDocument` returns null for a document that is not held.*

Your predecessor was explicit that "don't render that as a data gap" is currently a documented
constraint, not an enforced one. **Enforcing it is this dispatch.**

### What to build (G-34)

**1. Typed absence on the read path.** A document that is not held must return a TYPED, PROVENANCED
absence, never `null` and never an empty result a caller can mistake for a data gap. Inherited spine
constraints 1, 2 and 3 govern:

- The absence carries its BASIS. "Not found" is not a basis; *why* it is not found is.
- **Only a POSITIVE determination writes an absence.** An empty or failed lookup re-enters the queue;
  it does not become a recorded absence. This one rule killed an entire defect class on the spine.
- **`satisfied-absent` is a first-class product state.** A verified "we looked, it is genuinely not
  there" is a real answer and must be renderable as one, distinct from "we never looked" and from "the
  lookup failed".

The seven-status taxonomy on the spine exists because one undifferentiated "absent" carried at least
seven meanings and a probe failure wore the costume of a data gap. **Do not copy those seven statuses
mechanically** — they are jurisdiction-layer states. Derive the status set the DOCUMENT layer actually
needs, name each one, and justify each. A status nobody can produce is dead weight; a missing status is
a silent conflation. Say which spine statuses you deliberately did not carry, and why.

**2. The STALE indicator, proven in both directions, on the read path that serves.** G-14 built a
freshness evaluator and mutation-tested it — forcing `isStale: true` failed the suite on real exit code
1, and the two silence-direction tests caught it. **Verify that property still holds** and extend it to
cover the absence path: an absence must carry freshness semantics too, because "we verified this is
absent" decays exactly like a positive fact does.

Per DEV_PROCESS 2.2 a gating indicator is tested for its ability to FIRE before it is trusted, and per
G-14's own finding a fire-only test would pass a permanently-firing gate. Both directions, both paths.

**3. The contract-type promotion decision.** OPS-17 A-013 ruled that the Smart Files contract type is
authored locally in `legacy-design-tools` with a NAMED promotion step to `@empressaio/atom-contract`,
and **the promotion criterion is "when G-34 closes"** — because typed absence was judged the last thing
that reshapes the shape.

So at close you make a call and record it: **is the shape settled enough to promote?** If yes, name what
promotion requires (the repo consumes a vendored 1.6.0 tarball, not the published package — backlog
item 27 — so promotion is not a version bump). If no, say what is still moving and what would settle
it. **Either answer is acceptable; an unrecorded answer is not.** Do not perform the promotion in this
dispatch.

### Constraints

- **Do not apply 0078 or run migrations against a deployment database.** Operator HOLD.
- `smartcity-os` is absolute no-touch. No brokerage rename, no brokerage refactor (backlog item 25).
- Import the shared `ACCESS_POLICY_SCHEMA`; do not add a fourth copy (backlog item 28).
- **CI does not execute `.sql` migrations** (backlog item 26, planner-verified: no `drizzle-kit` step in
  any workflow). Green CI proves the drizzle schema, the fixture and the pushed test DB agree — it does
  NOT prove a migration file runs. Do not read green CI as an applied migration.
- Merge only on the CI check-run conclusion STRING "success", read from `statusCheckRollup`.
- Work in an ISOLATED WORKTREE. The main `legacy-design-tools` checkout sits on
  `feat/s1-instrument-hardening` with ~55 uncommitted files belonging to another lane — **do not clean,
  stash, revert, or build in that tree.**
- Doc_repo commits are planner-owned; leave edits uncommitted and list them in your close.
- Your close carries `missionPremise`, `completionPredicate`, `scopeBasis`, and states explicitly where
  a field is inapplicable rather than omitting it.

### WDLL card

Freeze a G-34-scoped card at CP1. The G-14 card at `_inbox/2026-08-15_a_wdll_g14_frozen.md` deferred
items 6 through 10; **item 6 is typed absence and is yours** — carry it forward rather than re-authoring
it, and record what you carried. Items 7, 8, 9, 10 (corpus capture, coverage counting, surface
deployment, sellability) stay deferred to G-44, G-20, G-53. Never call it an "acceptance card".

### The numbers in this brief are the planner's

Reporting one wrong is a successful outcome (DEV_PROCESS 3.2). A correction carries the same
evidentiary standard as the claim it corrects: quote the source text, name file and line (3.2a). Your
predecessor corrected two planner figures this way, and both corrections were right.

### Out of scope

Applying 0078. G-20, G-44, G-53. Any Smart Files UI or collateral. The contract promotion itself (decide
and record; do not perform). Lanes B, C, D. The brokerage rename. Any claim change to doc 34.
