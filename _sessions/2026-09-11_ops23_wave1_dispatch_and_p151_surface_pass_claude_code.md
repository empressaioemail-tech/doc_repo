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

## Review of the closes (2026-09-12 02:20Z to 03:00Z)

The operator reported every lane landed and the last traffic shift running. The overseer read
the closes, the checkpoints and the probe artifacts, verified every cited merge by conclusion
string with `gh` (thirteen PRs, all SUCCESS; engine #421 open as stated) and every serving
revision by field from the Cloud Run JSON (`hauska-engine-api-00205-san`,
`hauska-retrieval-api-00086-nur`, `cortex-api-00776-wov`, `smartsite-mcp-00109-zip`, each at
100 percent), re-ran the probe from doc_repo HEAD for the rows that closed, and copied the
artifacts from the two other doc_repo worktrees the lanes had written into (the planner's and
the property seat's), keeping lane-original copies where the planner had corrected a close.
Verdicts: P-151 closed; P-159 closed PASS; P-152 lane 1 closed with the row partial; P-155,
P-158 and P-167 closed-partial with the open leg named; P-157 blocked at CP1 with three
operator questions; P-153 still in flight with two merged hauska-map PRs and an unmerged LDT
half. The dispatch planner's checkpoint 1 and wave close are the swap artifact and the
summary; its four-entry error log stands, including that finding F8 was stale on the day it
was written.

**The gate, verified through the harness.** The first live attempt, a throwaway close
claiming closed on an UNMEASURED artifact staged and committed in one Bash call, went through
as `213f5369`: the hook reads the index when the call starts, before the add has run. Reverted,
the file left staged, and the commit attempted alone: the harness fired the hook and refused
it. A same-command add-and-commit rule was added and observed refusing the second shape. Two
further gate defects the wave exposed were fixed with self-tests: closes carrying `planRow`
(singular) were silently skipped, and an honest partial close could never be committed. The
compiler now prints the close skeleton the gate reads.

## The rulings and wave 2 (2026-09-12 03:00Z to 03:40Z)

The operator ruled yes to all seven recommendations. Recorded as five decision records under
`_decisions/2026-09-12_*`, rowed as OPS-16 A-132 (P-169 infra, P-170 traffic lease, P-171
provenance, P-172 Find box; rulings on P-157 and P-158), the OPS-23 program range extended to
P-172, the card and OPS-23 section 4 carrying the rows in the same commit. The agent contract
gained the deploy-traffic lease clause. P-170 was built the same hour: `traffic-lease-gate`
(rules module with seventeen self-test checks, hook on the Bash matcher, `_catalog/leases/`
ignored by git), verified by direct invocation in both directions; live firing through the
harness is owed the next session because a hook registered mid-session does not arm.

Wave 2 was prepared for a successor dispatch planner: missions for P-169, P-171, P-152 lane 2
(the panel consumes the reader) and P-172 (the Find box), phase sections appended to P-158
(merge #421, count the staged layer before any source is bought) and P-157 (resume after
P-169 with the certified 07182026 export), six lane worktrees registered, the probe extended
with a `readPath` check on P-152 and predicates for P-169, P-171 and P-172, and the wave-2
dispatch compiled across seven rows.

**A correction to this record's own review section.** The tax-assessed values are not
composed from a second path. The verifier read the code: cortex gates the four cadRoll fields
Studio, Team or Property Unlock and emits a typed `studio-gated` refusal to everyone else, and
the Property Explorer BFF's `isCadRollValueWire` guard admits only present, zero or absent, so
the refusal collapses to `null`. An anonymous probe therefore reads `null` where a signed-in
browser reads dollars. The earlier sentence, "composed from a path other than the facets
endpoint", was a mechanism named from one read; the second mechanism was the right one. The
collapse itself is a defect (a typed refusal turned into an absence) and is fixed in P-152
lane 2's mission.

**Live reads for P-172 before it shipped.** The situs-search route returns HTTP 502 after a
five-second cortex timeout for the bare `414 SPILLER LN`, zero hits for the city-qualified
form, and, for the parcel id, one hit whose street line is `", TX"`: the index row exists and
is empty for the anchor parcel. The operator's earlier successful Find for the Sterling
address therefore landed through the geocoder, unlabelled, which is finding F12 exactly. The
mission carries all three measurements and the fixtures hold the known-bad.

## Wave 2 reviewed (2026-09-12, afternoon)

The successor dispatch planner ran seven rows and reported back with checkpoint 2. The
overseer verified every cited PR by conclusion string (ten, all SUCCESS), cortex-api at
`00778-peq` by field, both Cloud Run jobs by field, and `X-Pe-Read-Path: record` live on the
panel. Verdicts: P-169 CLOSED (the two loader jobs); P-171 CLOSED, outcome (b): the
2026-09-07 footprint write was the engine lane `cente-67` running `--apply` from a P:/
worktree under the operator's contemporaneous direction with no break-glass row, now filed as
a proposed decision for the operator to accept, amend or reject; P-172 CLOSED (the situs index
backfilled from the roll, both query forms resolve in under 50 ms, the geocoder labelled; the
502 was a five-second proxy budget against a twenty-second route, not a slow scan); P-152
lane 2 CLOSED-PARTIAL (the panel reads the reader; the setback and zoning rails still ride the
atom chain, so the F3 disagreement persists on two Bastrop parcels); P-157 BLOCKED (the load
ran through the new job on staging and production and moved nothing, because the shared PACS
parser rolls living area up from "MAIN AREA" segments and TCAD types them "1st/2nd/3rd
Floor"); P-158 CLOSED-PARTIAL with the finding that settles the footprint question:
`tx_building_footprint.county_fips` is mistagged near county lines (29.6 percent of the
footprints inside Bastrop city limits carry Bastrop's code; West Lake Hills' are all tagged
Hays; the anchor parcel has a footprint 1.63 m away), so neither a source gap nor a sparse
load, and no second source; P-167 not started, P-153 still unmerged.

The operator's own comparison of FS-48453-474034 with the card produced three findings (F17
to F19): the PDF names a different special district, cannot see session-gated values and so
calls an improved parcel unimproved with the P-159 guard starved, and says no city-limits
source is wired where the card prints the record's rail. All three are the report composer
reading cortex facets with the service key instead of the reader, and go to P-152 lane 3.

Three contradictions of the overseer's own missions, carried: `Dockerfile.atoms-writer` lives
in hauska-engine, not the factory; the footprint mechanism was mistagging, not the load gap
the overseer favoured nor the source gap the lane favoured; the bare-search timeout was a
budget mismatch. Two lanes wrote their artifacts into the property seat's doc worktree instead
of the planner's, for the second wave running; the dispatch template should name the
worktree. The planner left its cortex-api lease file in place after the wave; removed.

## Correction on P-153, and the operator's five answers (2026-09-12 afternoon)

The operator answered: the break-glass row is accepted as written; the P-157 lane owns the
parser fix as a per-county segment vocabulary; the Sterling study ran on the first click (P-155
CLOSED, artifact `_inbox/2026-09-12_173553_surface_probe.json`, the probe's P-155 row aligned
to the card's predicate parcel); the Find box landed on the Spiller card first try (P-172's
observed leg); and nothing is in flight. The overseer then read LDT PR #661 by number: it
merged at 2026-09-12T00:00:04Z with SUCCESS. The wave-2 planner's "P-153 still unmerged" and
the overseer's own repeat of it rested on `gh pr list --search p153`, which does not match a
title written "P-153/MCP". Planner error, section 10 shape: a claim of absence from a search
whose tokenisation was never checked; the authoritative read is the PR by number. P-153 is
both halves merged, hauska-map deployed by its lane, cortex-api `00778-peq` built after the
merge; it closes on the operator's screenshot of the amber inset, the lane's MCP observation
and one probe run. P-167 is unblocked now, not after a resumption lane. P-173 (lease history)
was rowed under A-133.

## Wave 3 prepared, and a second mechanism correction (2026-09-12 evening)

Two verifiers read the code for the last two wave-3 missions. P-154: the five setback
producers for `48021:34049` and their dates read at source. The ordinance (effective
2026-04-14) and the city's Revisions layer (edited 2026-07-23) both say 30/10/30/20; the
city's OneClick layer carries the newest layer edit stamp (2026-08-24) but its row cites
Ordinance 2019-51 and prints 25/5/25/15; no producer reads any date; LDT ranks by tier with
date as tiebreaker and treats atom emit time as a date; the engine cites a dead layer-83 URL
and requests an outField the layer lacks. The mission makes the rule date-first in one module
with the per-parcel row dated by the ordinance it cites, and records the three dates as the
decision's evidence.

P-152 lane 3: the report composer does not read cortex facets at all. It reads the engine
substrate atoms store plus four live layers; the values print UNAVAILABLE because that store
holds no roll atom for the parcel; city limits and ETJ are hard-coded `unresolved` with a
literal sentence on every PDF in every county; school district is not on the report path;
special districts are every TCEQ-membership atom with no picker, against the record's cell on
the card; a reader outage on the panel falls silently to the atom chain with HTTP 200; no
entitlement reaches the engine (static `public-paid` headers from both clients). The
overseer's F17 to F19 mechanism, "reads cortex facets with the service key", was the panel's
cadRoll collapse transposed onto the PDF from one read: planner error, corrected in the plan,
the card, the snapshot and the wave-3 mission the same hour. The fix direction stands.

Wave 3 compiled for a successor planner: P-152 lane 3 (the last panel rails and the report
composer read the reader, entitlement travels with the rule unchanged, a reader outage is
declared), P-154, P-157 resumption 2, P-158 phase 3, P-167 steps 2 to 5, P-173. The probe
carries P-154 and P-173 predicates. P-153 closes on the operator's two legs when they arrive.

## P-153 closed, and F20 rowed (2026-09-12, 18:00Z)

The operator's screenshot of 1109 Pecan St shows the amber inset envelope drawn, the
Buildable row reading "modelled from setbacks, area withheld pending an atom", and no figure.
With the lane's own MCP observation (six vertices, the endpoint's count) and the Sterling
refusal, the probe reads PASS on both parcels (`_inbox/2026-09-12_180231_surface_probe.json`)
and the overseer wrote the close from the lane's two checkpoints, the PRs verified by
conclusion string and the revisions read by field. The tier that sees the drawing is Studio
or Team. In the same message the operator reported a bug: a subject reached by search shows
no setbacks until the user clicks another parcel and back, while a clicked subject shows them.
Two placement paths seal two sheets for one parcel. Recorded as F20, rowed as P-174 (A-134)
with a mission and a probe predicate, and handed to the wave-3 planner as an addendum. The
probe now carries P-174.

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
