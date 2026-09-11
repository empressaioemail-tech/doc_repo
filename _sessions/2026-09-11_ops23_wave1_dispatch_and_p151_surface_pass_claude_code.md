---
date: 2026-09-11
agent: planner
repo: docs
session_type: execution
memory_graded: none
rolled_up: false
snapshot: >
  doc_repo main, resumed after a context compaction at 0acc23f6, committed 0cacf4c5 (P-152
  dispatch), a90adbb5 (wave 1), febe8f3e (P-151 probe PASS), d99b7918 (probe entry guard).
  Integration seat, P:/doc_repo, branch main. Read-only verification of origin/main by five
  sub-agents: hauska-map 6ab6914, legacy-design-tools 3950ce9b, hauska-engine 79fa573,
  hauska-factory 217b7dd, hauska-atom-contract 8dde29c. Production probed live: smartsite.cloud
  facets, the PE retrieval proxy (near-bbox), the cortex point route through the PE proxy.
---

# OPS-23 evening: wave 1 to the dispatch planner, and P-151 passing on the surface

Successor to `2026-09-11_ops23_ledger_serving_path_and_probe_claude_code.md`, same day. The
operator resumed after a compaction with five asks: what the P-151 screenshot must show, a go
on the P-152 batch, the P-153 dispatch to carry, and a wave of every no-dependency row as one
dispatch to a sub-planning agent that spawns its own lanes and reports back. All five were
delivered; three lanes and the wave are in flight at close.

## What was done

**Topology R-5 activated and seated.** The operator's instruction to run the wave through a
sub-planner was the go on the overseer / dispatch planner / lane decision. The decision record
flipped to active, OPS-23 section 6 and the card say so, and a `dispatch-planner` seat is
registered with its own doc_repo worktree (`P:/seat-worktrees/dispatch-planner/doc_repo`,
branch `seat/dispatch-planner`, pushed) that compiles and writes but never commits. The seat
gate resolves it as a doc seat.

**Wave 1 verified before it was written.** Five read-only sub-agents read origin/main for the
five rows the card lists as depending on nothing. Their reports are on disk
(`_inbox/2026-09-11_ops23_wave1_verify_p1{55,57,58,59,67}.md`) and every mission cites them.
Each report contradicted its plan row: P-155's engine writes nothing durable until the PDF is
stored and has no async primitive at all; P-157's loader is LDT `lib/cad-ingest`, not the
factory, and treats `APPRAISAL_IMPROVEMENT_DETAIL.TXT` as optional and silent, after which both
the fill writer and cortex stamp `absent-verified` on a field nobody looked for; P-158's
10pct label is emitted by the engine and hides three join outcomes, the denominator is the
footprint area (fine), cortex reads the statewide atoms table (the Bastrop-only belief is
refuted), the map already reads the reader path, and the county writer never ran for Bastrop
or Travis; P-159 has two numeric sources rendered on four surfaces and an LLM narrative that
receives both numbers with nothing checking its output; P-167 has five byte-identical vocab
copies, two parity locks, a vendor-drift test that skips in CI, and no package dependency in
hauska-map or smartsite-mcp. Fourteen lane worktrees were registered, two of them only after
the verification showed the work lived elsewhere (the loader in LDT, the label in the engine).

**Five missions, one wave mission, one compiled dispatch.** Each row mission carries the
verified facts with paths and line numbers, the change, a pre-registered falsifier, the probe
observation keys, and a close shape. The wave mission is the dispatch planner's operating
procedure: compile per lane with `dispatch.mjs`, spawn one level with the compiled text and the
no-nesting first line, CP1 and CP2 per row, run the probe itself, per-row closes citing PASS
artifacts, a wave-level close whose `planRows` lists only PASS rows, a checkpoint at the third
close and at the end, and a report back that pastes raw output. Sequencing rules: P-167's
consumer halves cut only after P-153 merges (shared vocab files); three lanes reach
`hauska-engine-api`, so deploys are from origin/main after merge, one at a time; factory jobs
serialised across P-157 and P-158. The compiled dispatch
(`_dispatches/2026-09-11_ops23-wave1_dispatch.md`, 25,730 bytes) carries five rows in one
program. The operator carried it; the planner re-synced to `a90adbb5`, compiled all five lane
dispatches at 21:34Z, and the lanes cut their worktrees.

**The probe grew five predicates.** P-155 (observed: refresh 202, MCP PDF, app PDF without
retry), P-157 (machine: `structuralFact` present with living area and year built), P-158
(machine: `buildingFootprintFact` present and near-bbox count at least one; the near-bbox
route's shape `{ countyFips, bbox, limit, count, footprints }` was read live, and an
unrecognised shape reports UNMEASURED, never zero), P-159 (observed: distinct figures, percent
without atom, empty-lot claim), P-167 (observed: strings identical per parcel; locks deleted
and importers under `_vocab`). The fixture manifest gained the day's PDF observation as the
P-159 known-bad. Self-test passes in both directions; a live baseline run fails all four
machine-measured parcels before the wave, as it should. The module now runs `main()` only as
the entry point, after an import-triggered live run wrote an artifact nobody asked for.

**P-151 passes on the customer surface.** The operator's two screenshots after the deploy:
`48453:474034` shows "unincorporated Travis County: no municipal zoning applies";
`48453:113408` shows header `414 SPILLER LN`, the parcel placed and ringed on open, the label
`Land use`, and all seven rows (flood Zone X, lot 1.5083 ac, land use A1, special district
LCRA, school Eanes ISD, utility Austin Energy, values from the appraisal roll) where the
morning card showed four lines and `No street address`. Folded in as data
(`_inbox/2026-09-11_p151_observations.json`), the probe reads PASS on both parcels
(`_inbox/2026-09-11_214505_surface_probe.json`). The owner row rendering places the account at
Studio or Team, which answers the owed screenshot-tier item for P-151 and P-153. The lane's
close JSON is the last input and had not landed at close.

**Commits.** `0cacf4c5` P-152 dispatch batch; `a90adbb5` wave 1, topology, seat, missions,
probe predicates, verify records, baseline; `febe8f3e` P-151 PASS artifact, observations, F16;
`d99b7918` probe entry guard and the snapshot refresh. Every commit by explicit pathspec; the
other seats' dirty set was never swept. The operator gave a standing go on commits for the
rest of the session ("or whenever you need to"); each was reported after.

## What was learned (changes to ground truth)

- Any Agent-tool prompt from doc_repo, even a read-only verifier, must carry the full compiled
  header: no-nesting first line, `CANON-PREAMBLE`, `AGENT-CONTRACT` and `FLEET-MEMORY` markers,
  the verbatim M0 paragraph, an exit-bounded clause, and a named `_inbox/` close path. The two
  hooks blocked the verifiers three times, one missing clause per round. Memory file written.
- The facets payload carries `cadRoll: null` for both Travis probe parcels while both cards
  print a tax-assessed value, so the values row is composed from a path other than the facets
  endpoint. F6 in miniature; goes to P-152's read-path inventory.
- The Find box on smartsite.cloud does not resolve `414 SPILLER LN` after the deploy (F16). It
  is a geocoder path separate from the sheet resolver P-151 re-seeded; P-27 ruled the situs
  index over any geocoder. The P-151 close must say whether the lane touched it.
- P-152 CP2 (21:05Z): the engine half is merged (#417, #418, #419); the RO secret is mounted on
  the operator's explicit approval; the canary at zero traffic answers `/record` 200 for all
  five probe parcels; `48021:34049` resolves 21 rails `record` and 44 `legacy-transitional`,
  which is the P152-PANEL retirement backlog. A `place_key = ANY(array)` binding failed at the
  database on every call and was caught only by the zero-traffic canary; the unit tests ran
  against a fake store that cannot exercise real SQL binding. A third direct factory
  connection (`parcelRecordFactRead.ts`, flood into the brief generator) was found by the
  dispatch's own grep step and repointed. The lane is holding the traffic shift for operator
  sign-off, which no ruling requires.
- The three wave-1 findings are visible on the customer surface tonight for both Travis
  parcels: the P-157 `absent-verified` text, the P-158 raw join label, and a raw
  `property-boundary-edge atom-miss` token, the last a P-167 leave-behind (raw codes served as
  display text).
- The near-bbox route returns zero footprints around both P-158 parcels live, confirming the
  2026-08-19 relay that the county writer never ran for Bastrop or Travis.

## Planner errors this session, all caught by an instrument or by a hook

- A fixture-reading one-liner imported `surface-probe.mjs` and fired a live probe, because
  the module ran its main on import. Caught by the run's own output; fixed by the entry guard
  and proven by an import that runs nothing.
- The P-153 recompile showed a one-line diff that I first read as a possible stale compile;
  it was my own missing `--repo hauska-map` flag. Caught by the diff; recompiled byte-identical.
- The five verifier prompts were sent three times before they satisfied both hooks. Not a
  false claim, a process cost; the lesson is now a memory file so it is paid once.
- The P-151 commit plan listed the lane's close as its first path; the operator's go arrived
  before the close landed. Committed the four existing paths and said the close would follow,
  rather than waiting on a file that was not there.

## What is open

- P-151 lane close JSON (`_inbox/2026-09-11_p151-seam_close.json`): must cite
  `_inbox/2026-09-11_214505_surface_probe.json` and answer F16 in `contradicted`. Its commit is
  the first OPS-23 close commit and the live verification of `probe-close-gate` through the
  harness; the gate is also run directly against the staged close before committing.
- P-153 DRAW: hauska-map worktree one commit ahead, LDT at zero; close pending.
- P-152 READER lane 1: LDT PR #658 in CI; cortex canary and both traffic shifts pending; the
  lane awaits an operator word on the shift. Recommendation relayed: proceed once the
  five-parcel facets diff against the pre-captured baseline is exactly the added
  `atomBacked`/`serve` labels, and paste that diff in the close; no separate sign-off.
- Wave 1: five lanes running under the dispatch planner; the report back lands in the
  overseer's thread with the paths to copy and commit.
- Owed by the operator, still: free-tier drawing ruling (F2); Bastrop authority if the three
  setback dates tie; verified-absence atoms before P-164; the four other-county probe parcels
  (P-152's lane may choose them now that it holds the role); the three OPS-22 identity rulings
  P-161 needs. Answered tonight: the screenshot tier (Studio or Team); the topology go; the
  dispatch-planner seat; the RO secret mount.
- Uncommitted at close: the card's P-152 status row (from its CP2) and this session file; they
  ride with the P-151 close commit.

## Suggested canonical doc updates

- OPS-16: an amendment row for the Find box (F16) if the P-151 close says the lane did not
  touch it; a row for the engine `ingest-existing.ts` null-versus-unloaded distinction that
  P-157's close will leave behind; a row for the unmerged footprint loader branch P-158 names.
- OPS-22 section 5: the values row's source path (facets `cadRoll` null while the card prints
  values) added to the read-path inventory, beside the third factory connection P-152 found.
- ENFORCEMENT.md: the clause the earlier session owed (a hook is verified through the process
  that calls it) lands with the P-151 close commit's gate evidence, whichever way it goes.
- `_catalog/repo_intents.md`: hauska-map and smartsite-mcp carry no `@empressaio/atom-contract`
  dependency; the P-167 close will change that and the intents row should say so.
