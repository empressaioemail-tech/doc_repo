---
id: 2026-09-13_ops23_session_close_and_handoff
title: OPS-23 session close and handoff — waves 1 through 5, the Hays program, and where a cold agent picks up
date: 2026-09-13
status: handoff
applies_to: OPS-23 (90_operations/OPS-23_surface_completion_program.md), OPS-16 P-151 through P-182
owner: integration seat (overseer)
snapshot: doc_repo main ea3a7fd2. Read _inbox/2026-09-11_ops23_ledger_serving_path_WDLL.md's status block (dated 2026-09-13T23:55Z) before anything below — it is the maintained, re-verified source; this file is a narrative companion written once, at session close, and will not be updated again.
related:
  - _inbox/2026-09-11_ops23_ledger_serving_path_WDLL.md
  - _inbox/2026-09-13_ops23_checkpoint_5.md
  - _dispatches/2026-09-13_ops23-wave5_dispatch.md
  - _sessions/2026-09-11_ops23_wave1_dispatch_and_p151_surface_pass_claude_code.md
---

# Why this file exists

This is a hard session close, written because the operator is switching agent sessions
mid-program and needs a cold-start-safe reconciliation for a successor. It closes out the
running narrative kept in `_sessions/2026-09-11_ops23_wave1_dispatch_and_p151_surface_pass_claude_code.md`
(five days, five waves, do not re-read that file end to end — it is a scrollback log, not a
briefing). Everything load-bearing from it is restated here in final form, cross-checked
against source one more time at close.

**A successor's first three actions, in order:**

1. Read `_inbox/2026-09-11_ops23_ledger_serving_path_WDLL.md`'s status block (top of file,
   dated 2026-09-13T23:55Z). It is the durable card and is kept current; this narrative file
   is not.
2. Read `_inbox/2026-09-13_ops23_checkpoint_5.md` in full. It is the wave-5 dispatch planner's
   own mid-wave recovery checkpoint and is the single most detailed, most current artifact in
   the whole program.
3. Check whether the wave-5 dispatch-planner session that wrote that checkpoint is still
   running (`ListAgents` or ask the operator). As of this file's writing it had already
   resumed on its own (two open PRs, two renewed leases, confirmed live). If it is still
   running, do not duplicate its work — read its state, don't re-derive it.

# The arc, in one paragraph

The operator opened OPS-23 on 2026-09-11 with one broken parcel card and asked why setbacks,
zoning and a feasibility PDF all disagreed with each other and with the map. The finding was
never one bug: six read paths existed for the same facts, and "the ledger is the serving path"
became the program — one reader, one writer, one vocabulary, everything else retired. Five
waves of hand-carried dispatch-planner lanes have executed against that thesis since, each
wave's closes independently re-verified at source by this overseer seat before being trusted,
because lane and even planner self-reports have been wrong often enough this session that
"it says PASS" is never sufficient — a probe artifact, a PR read by number with its conclusion
string, and a serving revision read by field are the only accepted evidence.

# What is actually true right now, row by row

**Fully closed, re-verified at source by the overseer:** P-151 (placement), P-153 (envelope
draw), P-155 (async feasibility — but see F23 below, it has since regressed), P-157 (TCAD
structural data), P-158 (footprint county-tagging, three real bugs found and fixed), P-159 (one
buildable figure), P-169 (loader Cloud Run jobs), P-171 (footprint write provenance), P-172
(Find box reads the situs index), P-173 (lease history), P-174 (search-landing bug), P-145
(Hays identity disposition), P-152 lane 5 (entitlement gate in the engine and MCP), P-179
(engine bearer check armed, closed-partial — see below).

**Closed-partial with a real, named, unclosed gap (not rounded off):**
- **P-152** (panel reads the reader): the report composer and 11 of 21 facet rails are right;
  ten rails still ride the legacy atom chain; a hauska-map axis-override function serves stale
  setback values on three axes even where the record has the current value; five allowlist
  rails ("representative-key siblings") have no per-rail slate entry. Ruled by the overseer
  (A-140, operator veto window closed with "veto - okay"): the reader's per-rail semantics are
  the contract; the siblings get literal slate entries; the grouping is retired. Wave-5 lane
  `p152-siblings` is mid-flight on exactly this (see wave 5 below).
- **P-154** (most-current setback resolver): the resolver is built, published as
  `@empressaio/setback-corpus`'s `./resolve` subpath (1.2.0), and consumed by hauska-engine,
  hauska-factory and legacy-design-tools — this half is DONE and live (get_smart_site and the
  endpoint both read 30/10/30/20 dated 2026-04-14 for 1109 Pecan). The Property Explorer panel
  itself still shows the old value; same root cause as P-152's axis override, same fix, same
  wave-5 lane.
- **P-167** (one display vocabulary): package is 1.34.0, published, with a new
  `no-zoning-stamp` token; hauska-engine's PDF labels and hauska-map's `zoningProvenance` wire
  field are both fixed and deployed. Legacy-design-tools' importers still resolve 1.33.1 in
  their lockfile (an overseer mission-writing error this session — LDT was left out of the
  original P-167 wave-5 worktree list; being corrected as a same-wave addendum, PR #679, open).
  The PDF leg cannot be independently re-verified right now because of F23 (below).
- **P-175 / P-177** (Hays: the Sturgeon-lot chimera): fixed on the MCP path (all five
  addresses now serve their own polygon, label and value through `get_smart_site` and
  `find_parcel`). The Property Explorer's own record path (a different store, `parcel_record`
  in the hauska-engine database, filled by a writer that still joins by bare account number)
  is NOT fixed — this is P-180, currently paused mid-wave-5 on a real production-write
  go/no-go (see below). Two rulings are filed and final: the node id stays the parcel-map id
  (never re-key on the appraisal account), and the account is reached only through the
  published crosswalk, never a bare-number join.

**Reopened this session:** **P-155**, on a new finding, **F23**: the feasibility export's
refresh hop stopped producing new documents. Verified directly by the overseer:
`export_instrument(kind: feasibility)` called twice a minute apart for `48021:34049` returned
byte-identical PDFs (same sha256, same 1,172,470 bytes) with a PDF `/CreationDate` two hours
*before* that day's engine deploy. Root cause is confirmed (not speculative) by the wave-5
`p155-refresh` lane's CP1: it is entirely client-side, in
`legacy-design-tools/artifacts/smartsite-mcp/src/feasibility-export.ts` — the MCP only
refreshes a job that is `never-requested` or `failed`; a `ready` job is served forever
regardless of age, with no TTL. Fix is chosen (client refreshes a `ready` job past a 15-minute
staleness bound; `generatedAt` goes on the wire) but not yet fully landed — see wave 5.

**Not yet dispatched at all:** P-156 (unstaged Travis cities), P-161 through P-166 (identity
rulings, one-writer-per-atom, atoms from gated cells, edges as atoms, node succession), P-168
(preamble scoping — built, not yet fired live through the harness), P-170 (traffic-lease
gate — built and used successfully this session, harness-level live-trigger verification still
technically owed).

**Landed on main this session from OUTSIDE this thread's review loop, UNVERIFIED by the
overseer:** P-176 (a Cotality vendor bake-off, another session's work), **P-181** (an
assumption-register / "dead controls" audit across three repos, claiming 94 assumption rows
and 8 structurally-unfalsifiable controls) and **P-182** (a sub-county coverage audit). These
came in as commit `ea3a7fd2` mid-session. Their numbers read as plausible and well-constructed
but have not been read against source the way every other claim on this card has been. Treat
as reported, not confirmed, until someone does that read.

# The two independent rulings this session made and filed permanently

1. **Hays node identity** (`_decisions/2026-09-13_hays_node_identity_is_the_parcel_map_id.md`):
   in a county where the parcel map and the appraisal district use different numbers for the
   same parcel (Hays, and Williamson has the same structure), the Smart Site node id and
   ledger `place_key` stay the parcel-map id, permanently. The appraisal account is reached
   only through the published crosswalk. Minting nodes on the account number is rejected.
2. **Hays declared 2026 roll** (`_decisions/2026-09-13_hays_declared_2026_roll_is_the_8_26_export.md`):
   the certified 2026-08-26 CAD export supersedes the preliminary export loaded 2026-09-02,
   consistent with the earlier Travis ruling. Lands via P-178 as a watched re-ingest with
   accounts absent from the new drop explicitly marked, never silently dropped or silently
   kept as if certified.

Both are executed by named rows (P-177/P-161 and P-178) and are not up for re-litigation
without a new operator ruling.

# Wave 5 — the thing actually in flight right now

Compiled by the overseer, sent by the operator, run by a dispatch-planner session in
`P:/seat-worktrees/dispatch-planner/doc_repo` (branch `seat/dispatch-planner`). Five lanes
(P-152 lane 6 "siblings", P-180 "Hays cells", P-179 "engine gate", P-167 "strings" follow-up,
P-155 "refresh" — the last two added mid-wave by overseer addenda after F23 and the P-167
mission gap were found).

**All four running lane sub-agents were killed simultaneously** by an account-level
`HTTP 429 monthly spend limit` mid-task. This was an external interrupt, not a bug in any
lane's own work — their on-disk state is a snapshot of "paused," not "failed," and the
dispatch planner (itself about to be replaced by a model switch) wrote a full recovery
document before handing off: `_inbox/2026-09-13_ops23_checkpoint_5.md`. That file is
authoritative for wave-5 detail; do not re-derive it. As of this handoff:

- **p179-gate: CLOSED (closed-partial).** Fully done, independently re-verified live by the
  planner (a `curl` with no bearer token against the real production URL returned 401 on a
  gated route, 200 on `/health`). No action needed. Step 4 (removing public invoker access)
  is untouched and needs its own separate operator go, later.
- **p180-hays-cells: PAUSED on a real, correctly-withheld go/no-go.** The lane built and
  live-verified (read-only, against production) a crosswalk fix for the writer that fills
  Hays' `parcel_record` cells, confirmed it would produce exactly P-177's known-good values,
  then asked to run `--apply` against 116,420 PRODUCTION rows having shown only a dry run and
  no confirmed staging-environment execution. The planner correctly withheld approval (the
  house rule is staging before production, always) and was killed before the lane answered.
  **Do not approve that production apply until the staging-target question in checkpoint 5 is
  answered** — either a real staging run happens first, or someone confirms with evidence
  (not assumption) that this specific factory job has no staging store at all.
  Williamson is explicitly and correctly held out of scope for this fix this wave (its
  bare-number join is empirically ~99.998% correct there today; applying the crosswalk fix
  would convert a large correct population to absence — a real leave-behind, not a quick yes).
- **p152-siblings: PAUSED mid-deploy.** An urgent unplanned fix (stale Hays dollar-rail slate
  entries serving wrong owner data on real vacant lots) was found and merged clean
  (hauska-engine PR #439, MERGED). The main mission's PR, legacy-design-tools **#678**, is
  OPEN as of this file's writing (10 checks SUCCESS, 1 pending) with a `cortex-api` lease held
  and renewed to 2026-09-14T02:00Z by an already-resumed successor planner session.
- **p167-strings follow-up: PAUSED mid-deploy.** The original P-167 mission is already closed
  (closed-partial, done, don't redo). The follow-up (bump every LDT importer to `^1.34.0`) is
  legacy-design-tools **PR #679**, OPEN (10 checks SUCCESS, 1 pending), `smartsite-mcp` lease
  renewed to 2026-09-14T02:00Z by the same resumed session.
- **p155-refresh: PAUSED mid-fix, no close yet.** Root cause fully confirmed (see F23 above);
  a client-side fix and an engine-side `generatedAt` header were both in progress when killed.
  Do not restart the investigation — its CP1 has everything needed.

**A live successor planner session had already resumed as of this handoff** (confirmed by the
overseer via lease-renewal timestamps at 23:46–23:55Z, minutes before this file was written,
and by both #678 and #679 being open with CI in flight). Check whether it is still active
before assuming wave 5 is idle.

# The Hays re-ingest (P-178) — separate from wave 5, also mid-flight

Items 1–3 landed on main (LDT #675, #676, #677, all merged clean). Item 4 (staging load) is
DONE and independently verified by the overseer at source: 134,591 rows from the certified
8-26-2026 export, zero missing identifiers, the three largest predicted account-value moves
landed exactly as predicted, 629 Sturgeon Dr correctly at $50,390, and the 390 accounts absent
from the new drop correctly marked `absent-from-declared-drop` — **but that marking was done
by a hand-run SQL `UPDATE`, not a scripted, recorded step**, which the overseer flagged back to
the lane as needing to become a real loader step or a scripted command with its own durable
record before it is trusted again on production. **Item 5 (the production load) has NOT run**
and is explicitly waiting on the operator's literal go, to be quoted back in that lane's own
thread, after the lane pastes its staging-vs-production dry-run counts. The operator has
signed off the *shape* of this run (staged, watched, migrations handled) but has not yet given
the specific go for the production apply itself.

# Standing rules a successor must not relearn the hard way

- **Never trust a lane's or a planner's self-report.** Every close this session that was
  accepted at face value on first read turned out to have at least one wrong claim on
  independent verification (a "closed PASS" that the instrument read as FAIL; a cited probe
  artifact that was a hand-made file wearing the instrument's name; a "the rebind reached the
  bake" claim disproven by reading the actual served geometry). Read PRs by number with their
  conclusion string, read serving revisions by field name, and re-run the probe yourself before
  writing a close into the durable card.
- **Never run a git command against a path that is not your own registered worktree.** Two
  incidents this session (a lane in the shared `P:/hauska-engine` bare hub, a session in a
  second doc_repo clone) both destroyed uncommitted work this way. Both were contained but
  both were avoidable.
- **A resumption writes a new dated file; it never overwrites a previous wave's close.** One
  planner this session rewrote wave-2's P-157 and P-158 closes in place; the overseer had to
  restore them from a lane's own worktree.
- **A wave-level close's `rowStatuses` must literally agree with each row's own close file.**
  One wave close called a row "closed, PASS" while that row's own close said closed-partial;
  the overseer's re-run of the instrument sided with the row's own close, not the wave
  summary.
- Lanes and planners never commit to doc_repo. Only this overseer seat does, always by
  explicit pathspec, gated by `probe-close-gate.mjs`.

# What is owed by the operator, restated plainly

1. **The go for P-178's production load**, after the Hays lane pastes staging-vs-production
   dry-run counts in its own thread.
2. **A decision on P-180's staging-target question**, before anyone approves a 116,420-row
   production write.
3. Eventually, **the separate go for removing `hauska-engine-api`'s public invoker access**
   (P-179 step 4) — deliberately not bundled into the mount-the-token approval already given.
4. Whenever convenient: someone should independently verify **P-181 and P-182's** claims the
   way every other row on this card has been verified, since they entered the record without
   that pass.

This file will not be updated further. The durable card and checkpoint 5 are where the truth
lives from here.
