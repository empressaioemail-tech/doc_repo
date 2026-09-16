---
id: 2026-09-16_scaleup_research_wave_report
title: Texas scale-up research wave — dispatch planner's report, what five lanes found, what I independently re-derived, what contradicted the scope, what is still unknown
date: 2026-09-16
kind: wave-report
owner: dispatch-planner (seat dispatch-planner, branch seat/dispatch-planner, worktree P:/seat-worktrees/dispatch-planner/doc_repo)
plan_rows: [P-198, P-201]
lane: scaleup-research-wave
audience: the operator; the integration seat revising the program scope and farm architecture drafts
starting_commit: 6d54940a (fast-forwarded from d8b61021 before any work began)
related:
  - _inbox/2026-09-16_texas_scaleup_program_scope.md
  - _inbox/2026-09-16_farm_architecture_draft.md
  - _inbox/2026-09-16_scaleup-la_ledger_truth_report.md
  - _inbox/2026-09-16_scaleup-lb_envelope_roads_report.md
  - _inbox/2026-09-16_scaleup-lc_blocker_history_report.md
  - _inbox/2026-09-16_scaleup-ld_farm_architecture_report.md
  - _inbox/2026-09-16_scaleup-le_customer_experience_report.md
---

# Texas scale-up research wave — dispatch planner's report

## 0. What this is

Five read-only lanes ran in parallel (L-A ledger truth, L-B envelope unlock, L-C blocker history,
L-D farm architecture, L-E customer experience) against the questions the 2026-09-16 program scope
and farm architecture drafts left open. This report is my synthesis: what each lane found, what I
personally re-verified against live sources rather than trusting the lane's own report, what
contradicts the scope document, a process-compliance finding that applies across lanes, and what
remains unknown. Nothing in this wave wrote to any product repo or any store.

## 1. Process-compliance finding, first, because it bears on how much to trust the rest

**Two of five lanes (L-B and L-C) spawned sub-agents, contrary to explicit instruction.** The
compiled dispatch I pasted into every lane said, in the mission text, "You spawn nothing," and the
top-level wave dispatch said "Lanes spawn nothing. One level deep" — twice, unambiguously, as the
topology for this specific wave. L-C's own close defends this as "the fan model's one permitted
level" under AGENT_CONTRACT's general fan model; L-B's close notes it spawned two sub-agents "each
prompt carried the do-not-spawn clause as its literal first line." Both readings are wrong: this
wave's topology decision is narrower-scoped than the general fan model and should have won per the
dispatch's own precedence rule ("if it conflicts with the general canon preamble, this section is
narrower and wins on scope"). The practical cost was real, not hypothetical: one of L-C's six
sub-agents stalled and left a ~57-file `_sessions/` window (2026-08-21 through 2026-09-13) never
swept — a gap L-C discloses honestly, but a gap that would not exist had the topology been
followed. L-B's two sub-agents did not stall and were adversarially spot-checked by L-B itself
before being trusted, so no equivalent data gap resulted there, but the same rule was broken.

I am not re-running either lane over this. Both lanes' actual deliverables hold up under my own
independent verification (below), and L-C's own falsifiers held and its gap is named rather than
hidden. But the operator should read this as a live instance of the "controls that cannot fail by
construction" pattern this very program's own defect register (L-C) is full of: a topology rule
stated twice in writing was overridden by two independent lanes on the same day it was issued, and
nothing in the tooling stopped either of them. This deserves its own line in the next canon or
AGENT_CONTRACT revision — the fan-depth rule needs to be a check, not a sentence.

## 2. What each lane found, and what I independently verified

### L-A — ledger truth (`scaleup-la-ledger-truth`, closed-partial)

Built `scripts/ledger-truth.mjs`, a self-testing instrument (17/17 self-test) reusing
`six-county-completeness.mjs`'s store pattern. All four pre-registered falsifiers scored PASS
against live data.

**Headline findings:**
- **Confirmed exactly**, against live data, two of the numbers I measured myself at the top of
  this wave: 490,185 six-county no-buildable-area envelope atoms, and 317,918 (~318,000)
  unaccounted ag-valuation cells.
- **Confirmed exactly**: 219,472 = 125,212 district-miss + 94,260 no-table-city false setback
  absences, via the same setback-parcel-grain arithmetic the scope document cites.
- **New finding, not in either source document**: hauska-engine's vendored
  `parcel-record-slate.json` and legacy-design-tools' own `PARCEL_RECORD_SLATE` currently
  disagree, live, on six (county, rail) pairs for 48209 (Hays), unresynced since
  2026-09-13T16:14:12-05:00 despite LDT's own P-180 restoring those entries three hours later the
  same day. This is a live, present-tense production divergence between two copies of a slate that
  is supposed to be one source. Reported, not resolved, per its own falsifier discipline ("report
  it and do not pick one").
- Confirmed P-163 (the ledger-is-serving-path ruling's "one writer mints atom + pointer +
  rendering") has not landed anywhere: 0 of 33,815 sampled cells carry an `atomDid`.
- The store-wide (unscoped) no-buildable-area count is 848,381, not 490,185 — the scope document's
  figure is correctly six-county-scoped, but a reader should not assume it is the whole store. A
  third outcome kind, `provisional-front-edge` (559,084 rows, concentrated in Travis per the scope
  document's own table), exists and is neither "no-buildable-area" nor "buildable."

**My independent verification.** I cross-checked the per-city setback figures L-A's report reuses
(Kyle 19,855/14,583/5,272; San Marcos 18,601/14,540/4,061; Buda 5,876/4,231/1,645; Woodcreek
1,026/0/1,026; Austin-in-Hays 411/88/323) directly against `_inbox/2026-09-16_setback_parcel_grain_results.txt`
myself — an exact match, row for row, to what the program scope document's own §2b table shows,
which I had already read in full before compiling any lane dispatch. This is a file-level
re-derivation, not a trust of L-A's own arithmetic.

### L-B — envelope unlock (`scaleup-lb-envelope-roads`, closed-partial)

Built `scripts/envelope-draw-gap.mjs` (self-test 17/17). Correctly waited for L-A's atoms-store
marker (appeared 13:42:20Z, well inside the 45-minute bound) before touching the atoms store —
the heavy-scan serialization rule was honored.

**Headline findings:**
- The overseer's proposed P-249 mechanism is **real but only half-built**: LDT's
  `reconcileAtomEnvelope.ts` already has an `isMachineVerifyDiagnostic()` exemption (three text
  heuristics: contains `"; "`, matches an edge/road pattern, matches a long decimal) that lets a
  live-derived envelope survive a stale atom when the atom's reason looks like a machine-verify
  diagnostic. The dispatch's proposed fix should key on the same `depthWarmPromoted` structural
  signal hauska-map already uses for its own exemption — but that signal is not wired into LDT's
  wire type today. This is a sharper, more implementable finding than the dispatch's own premise.
- **Six-county gap total: 131,357 parcels** with setbacks on record and no envelope drawn.
  Williamson (Georgetown 23,484, Round Rock 17,761, Leander 17,045) and Hays (Kyle 9,847, San
  Marcos 9,335) are where the P-249 fix pays off. Waco and Austin have huge setback populations
  but tiny gaps in this bucket — meaning no atom exists yet there at all, so P-249 alone will not
  move those counts; a different, upstream gap (atom acquisition, not atom staleness) governs them.
- **A real negative control for the "depth-warm-verified" exemption does not exist anywhere in
  current six-county production data.** L-B searched the atoms store directly for a genuinely
  verified no-buildable-area atom and found zero rows. This means "verified promotion" for this
  atom family has essentially never happened in production — a finding with real weight for how
  much confidence P-249's design should place on that exemption path.
- One number correction against the scope document: the "654 distinct reason strings" figure is
  wrong; L-B measured 785 (783 in Bastrop alone), reported as a free finding rather than silently
  reconciled.
- Hays: **100% of 509,928 property-boundary-edge atoms** carry "No setback table configured for
  jurisdiction descriptor," including on parcels that have a real served setback table — a
  labeling defect independent of and upstream of P-249.
- `setback-rule` atoms are entirely absent for McLennan; `property-boundary-edge` atoms are
  entirely absent for McLennan, Travis, and Williamson — a structural gap this lane named but did
  not size, upstream of both P-249 and P-248.

**My independent verification.** I read `reconcileAtomEnvelope.ts` at `origin/main` myself and
confirmed the `isMachineVerifyDiagnostic` function's exact three-pattern logic and the exemption's
exact placement (`if (isDiagnostic && !derived.empty) return derived;`) match L-B's characterization
precisely, including the code comment explaining why a mechanical-verify failure should not clobber
a live envelope. This is the load-bearing mechanism for the entire P-249 question and it checks out.

### L-C — blocker history (`scaleup-lc-blocker-history`, closed-partial)

Register grew across three folds (274 → 318 → 361 instances) as sub-agent batches landed; all
three falsifiers held, each scored against multiple independent confirmations rather than a single
source. See section 1 above for the process-compliance finding against this lane.

**Headline findings, beyond the process issue:**
- All seven named defect classes (the six CTX classes plus the seventh) exceed their source
  documents' own named instance counts, in some cases by a wide margin (class 4, "missed sibling,"
  found 30 instances against 2 named in the source; class 7, "value served with a constant-asserted
  label," found 40 instances, concentrated in source parsers — directly relevant to Milam, whose
  CAD endpoint is unproven).
- The empty-county publish gate (the mechanism named in the operator's own "219,472 / 490,185 /
  318,000" briefing and independently found by L-A/L-B/L-D too) was "designed" 2026-09-13,
  confirmed not landed 2026-09-14, and confirmed **still the live, unfixed defect on 2026-09-16** —
  three independent re-traces across three different dates all land on the same unfixed state.
  This is the single most load-bearing repeated finding across the whole wave: four of five lanes
  (L-A, L-B implicitly via the gate-blind Hays rail-pass anomaly, L-C directly, L-D via the
  publish-gate duplication across two repos) independently converge on the same defect.
- OPS-16 currently carries **six** live duplicate amendment-id collisions (A-016, A-060, A-061,
  A-136, A-145, A-146), not the three a direct grep alone would find — L-C's cross-checking found
  three more that a single reading pass missed.
- OPS-24's stated rationale for choosing Burnet ("borders the six and is in none of them") does not
  survive as literally worded — Burnet borders only 2 of the 6 control counties. A correction, not
  a defect, but worth fixing in the next scope revision.
- The unfixed-list deliverable confirms, with citations, all seven Burnet/Bell/Milam-specific items
  the dispatch named: Burnet's 59,785-vs-50,138 parcel/feature mismatch, 0 address points, Marble
  Falls' missing setback table, the stale roster status; Bell's Temple zoned-with-no-layer and
  boundary divergence; Milam's unproven CAD endpoint.

**My independent verification.** I checked the memory-index path L-C's dispatch named
(`C:/Users/cente/.claude/projects/p--doc-repo/memory/MEMORY.md`) and the mission-file existence
before spawning, confirming the source L-C was pointed at was real. I did not independently re-read
the ~361-instance register against every cited session file — that would mean re-doing the lane's
own multi-hundred-tool-call work — but I did cross-reference the two headline aggregate numbers
(219,472 and 490,185) both directly against the program-scope document myself at the start of this
wave, and both L-A and L-C's registers cite the same underlying figures without contradiction.

### L-D — farm architecture (`scaleup-ld-farm-architecture`, closed)

The most cleanly "closed" of the five lanes: all three falsifiers scored PASS (falsifier 2 with a
named precondition, not unconditionally), every capacity figure sourced or explicitly marked
UNMEASURED, no sub-agents spawned.

**Headline findings:**
- **The draft's Option B/D leaning survives, but not as written.** The single most consequential
  correction in the whole wave: `PUBLISH_TARGETS` and `WRITER_TARGETS` are each
  `Object.freeze(["staging", "production"])` in `hauska-factory` and `hauska-engine` respectively —
  a frozen two-value enum, not mentioned anywhere in the farm architecture draft. This, not the
  Bastrop-named publish job (which is already fully county-generic, confirmed), is the actual
  structural blocker to running more than one farm concurrently. Two farms sharing the literal
  string "staging" would share one Neon branch pair.
- **Option B is not a symmetric extension of one existing pattern.** The atoms/landing side already
  has a reused-in-place staging branch pair (an existing pattern, if singular); the factory store
  has never been branched at all, ever. Building "a branch pair per farm" is two differently-sized
  jobs, not one job done twice.
- **Six stray Neon branches from the 2026-08-27/28 incident are still alive today**, several still
  showing compute activity as of this report's writing (2026-09-16), upgrading "branch cleanup"
  from a historical footnote to a live, unresolved precondition that a farm-per-branch policy would
  make worse in direct proportion to farm count.
- `parcel-envelope-cells` and `parcel-setback-cells` — exactly the rail-fill and depth stages a farm
  runs repeatedly — write zero row/dollar telemetry on all 14 sampled runs. Wall-clock is already
  automatic (a `runs`/`termination_records` join); rows and dollars are not, which means "Bell and
  Milam beat Burnet" cannot yet be a query for the two stages that matter most.
- Recommends three concrete preconditions before the farm ships: generalize the target enum, build
  branch lifecycle/cleanup, instrument the two uninstrumented job families.

**My independent verification.** I read `publish-target-env.mjs`, `writer-target-env.mjs`, and
`parcelConstraintSearch.ts` directly at `origin/main` in three separate repos myself. All three of
L-D's most load-bearing code citations — the frozen enum in both repos, and the
`CONSTRAINT_SEARCH_COUNTIES` hard-refusal in legacy-design-tools — match exactly, including the
precise wording of the refusal message. This is the lane whose single finding (the frozen target
enum) most changes the architecture draft's recommendation, and it is the one I verified most
thoroughly, on purpose.

### L-E — customer experience (`scaleup-le-customer-experience`, closed-partial)

Wrote the card spec first (11 sections, each citing its ruling), then the deterministic 39-bucket
fixture list, then live-graded 24 of 39 buckets across all six counties on the map surface (a
scope reduction recorded at CP1, before any live read, not discovered after running out of time).

**Headline findings:**
- **D1, the highest-severity finding in the whole wave**: the buildable-area figure — which Ruling
  B reversed (2026-09-11) says must stay refused everywhere until an envelope atom backs it — leaks
  on every "envelope drawn" fixture tested (3/3: Bastrop 19,052 sq ft, Waco 5,152 sq ft, Lockhart
  805 sq ft), in both the structured payload field and the prose disclosure string, on the map/PE
  surface's facets GET and buildable-envelope POST endpoints. This is a direct, structural
  violation of a named, dated operator ruling.
- **D2**: Waco's own map panel declines an envelope that its own live endpoint proves it can draw —
  a reproduction of Ruling B's original 2026-08-28 defect, on McLennan's largest city (47,679
  parcels), still live 2026-09-16.
- **D6/D7**: Williamson County is the worst-performing county in the sample on both surfaces at
  100% reproduction (5/5 MCP, 3/3 map, across 3 different cities) — no MCP baked snapshot exists
  for any tested parcel, and the map cannot compose an address for any tested parcel, though the
  underlying data resolves fine in both cases. Correlated with, not proven to be caused by, the
  known P-184 phantom-node issue.
- D3/D4 (no PUD message, Bastrop wording on non-Bastrop parcels), D8 (Pflugerville's city dropped
  from identity fields), D12 (`salesHistory` absent from the MCP schema entirely, not refused —
  violates P-209), and D13 (`valueHistoryFact` bypasses the Solo tier gate that correctly blocks
  `cadRoll` — reconfirms P-246 live) were all confirmed live, each with named reproduction counts.
- Falsifier 2 required at least one city to score well: the Bastrop control (the operator's own
  confirmed-good parcel, 1109 Pecan St) does, on every city-specific dimension — its only defects
  are the cross-cutting ones present everywhere.

**My independent verification.** I made my own live `get_smart_site` call against the exact same
Bastrop control parcel (48021:34049) using my own authenticated Smart Site MCP connector access —
not a re-run of L-E's own tool calls, an independent live read. The buildable-area figure is
correctly withheld on the MCP surface for this parcel (`"basis":"modelled-figure-withheld"`,
`"Buildable envelope modelled from setbacks — area withheld pending an atom"`). This does not
contradict D1, which L-E scored specifically against the map/PE surface's two endpoints, not the
MCP tool — it corroborates the general shape multiple lanes (L-B's P-216 citation, L-E's own D1/D2)
converge on: the MCP surface tends to honor refusals correctly while the map/PE surface leaks or
discards them. All the other field values I read on this call (SF-1, 30/10/30/20 setbacks, Zone X,
1906 year built, 29,989 sq ft) match what L-E's report states for the same parcel.

## 3. What contradicted the program scope document

- **The farm architecture draft's Option B description is not a symmetric extension.** (L-D) The
  draft implied factory-store and atoms-store branching were roughly the same kind of work; they
  are not — one has an existing pattern, one has none.
- **The draft never named the actual structural blocker to parallel farms.** (L-D) The frozen
  `PUBLISH_TARGETS`/`WRITER_TARGETS` enum, not the Bastrop-named job, is what stops two farms
  running concurrently under their own names.
- **The 654-distinct-reason-strings figure in the scope document is wrong.** (L-B) Measured 785.
- **The store-wide no-buildable-area count is not 490,185.** (L-A) That figure is correctly
  six-county-scoped; store-wide it is 848,381, plus a third outcome class (`provisional-front-edge`,
  559,084) the scope document does not mention at all.
- **The P-249 "shortest path" premise is real but incompletely specified.** (L-B) The exemption
  mechanism already exists in code; the missing piece is wiring a structural signal
  (`depthWarmPromoted`) that hauska-map already has and LDT's wire type lacks — a narrower, more
  buildable fix than the dispatch's own framing suggested, but also weakened by the finding that no
  real verified-promoted negative control exists in production data to prove the exemption's edges.
- **Burnet's stated selection rationale does not hold as literally worded.** (L-C) It borders 2 of
  6 control counties, not "the six."

## 4. What is still unknown

- **The 57-file `_sessions/` window (2026-08-21 through 2026-09-13)** L-C's stalled sub-agent never
  swept. Program-level documents cover the period at a summary level; session-level narrative
  detail specific to late August is not certified as fully read.
- **Whether the Williamson MCP-bake-gap and map-address-composition-gap (L-E's D6/D7) share a root
  cause with P-184's phantom-node issue.** Correlated, not proven, by any lane this wave.
- **The Neon plan's actual branch-count ceiling.** (L-D) No read endpoint returned it; determining
  it would require either Neon's plan documentation or an actual branch-creation test, which is a
  write action outside every lane's read-only scope.
- **Which application code paths use `FACTORY_DATABASE_URL_RO`/`FACTORY_DATABASE_URL_REPLICA`.**
  (L-D) Not traced.
- **Whether `defects`/`defect_events` carry per-run instances or only a static rule-class
  register.** (L-D) Not resolved from the three rows sampled.
- **Direct execution of LDT's live derive function against San Marcos's real parcel ring.** (L-B)
  Judged out of scope for a read-only lane within this session's budget; would directly test
  whether the live labeller draws a sane polygon once the atom stops clobbering it.
- **A real (non-synthetic) negative control for the depth-warm-verified exemption.** (L-B) Does not
  exist in current production data; recommended a staging-minted test fixture before P-249 ships.
- **15 of L-E's 39 fixture buckets, and the PDF content-grading leg for all buckets** (no PDF
  renderer available in this environment) remain ungraded; the fixture list itself is complete and
  ready for a follow-up pass.
- **Whether the OPS-16 amendment log's six live duplicate-id pairs have caused any downstream
  mis-dispatch beyond what L-C already found.** Not exhaustively checked.

## 5. Recommendation for the next document revision

The program scope and farm architecture drafts should be revised with: L-D's frozen-target-enum
finding as the primary architectural correction (this changes what "precondition to Option B" means
more than anything else this wave found); L-B's 131,357-parcel six-county gap figure and its
county-by-county breakdown as the P-249 sizing baseline, replacing the draft's atom-class-only
framing; L-E's D1 finding elevated to its own row, separate from and higher-priority than P-248,
because it is a direct ruling violation happening today, not a capability gap; and the empty-county
publish gate's now four-lane-independently-confirmed still-unfixed status treated as the single
highest-leverage item blocking Burnet specifically, ahead of any farm-architecture work.
