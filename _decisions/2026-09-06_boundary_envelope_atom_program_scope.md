---
decision_id: 2026-09-06_boundary_envelope_atom_program_scope
date: 2026-09-06
owner: operator
status: active
related_canonical:
  - 80_adrs/adr_031_parcel_record_ledger_over_atoms
  - _inbox/2026-09-06_ctx-wrapup-engine_boundary-envelope-pilot_close
  - _inbox/2026-09-05_smart-site-architecture-diagram_gaps
---

## Decision

The `property-boundary-edge` / `buildable-envelope` atom program is scoped as its
own, self-contained effort — separate from atomizing the rest of the parcel_record
ledger's 65 rails, which is deliberately deferred as its own future card (see
"Full ledger atomization" below). This record captures the scope as understood
immediately after the 2026-09-05/06 pilot, before the conversation's context is
lost.

## Program components

| # | Component | What it requires | Why it's needed | Status |
|---|---|---|---|---|
| 1 | Parcel succession/refresh mechanism | New engineering — detect when a parcel is re-platted/renumbered (a "succession matcher"), cascade staleness to downstream atoms | Without it, every backfill decays silently. Confirmed: 92.7% of Bastrop's existing `buildable-envelope` atoms are already stale this exact way, and the store doesn't know it | Not started. Confirmed no path exists today, not even manual, by design (`reconcile-county-parcel-nodes.ts`'s own header) |
| 2 | Shared reader — retire the second, independent implementation | Rewire `legacy-design-tools`'s `buildableEnvelope/derive.ts` to read the atom chain instead of independently re-deriving from raw geometry + its own setback-table logic | Confirmed: MCP-facing `cortex-api` does not consume the engine's atom at all today. A full atom backfill would not by itself fix MCP parity, and two independent implementations is exactly the drift risk the atom-first architecture exists to prevent | **DONE 2026-09-06.** `legacy-design-tools#626` merged to main at `c742439a` (verified live via `gh pr view`, state MERGED, mergedAt 2026-09-06T20:21:28Z), CI green on 5th attempt. `reconcileAtomEnvelope.ts` ships and reconciles the atom's reported area/outcome against `derive.ts`'s own live polygon without fabricating geometry the atom doesn't carry; a validation-failed local decline is never overridden. Close doc: `_inbox/2026-09-06_legacy-design-tools-shared-reader_items-2-3_close.json`. Note this closes the *reconciliation* half of the drift problem, not PE's separate third data path found in the hauska-map probe (§ below) — that remains open |
| 3 | Third-defect audit | Check whether `derive.ts`'s default `roadClassSetbackTableForJurisdiction` call can still produce a road-class-derived setback value — the exact defect class already retired on the engine side (commit `293633a`) | Flagged, not confirmed either way — a real open question for whoever picks up item 2 | **DONE 2026-09-06.** Confirmed live on real Bastrop P-5 parcels via same PR #626 — the production caller always skipped the explicit-override parameter, silently substituting a road-class-derived setback. Fixed via explicit opt-in only; 2 new regression tests in `derive.test.ts` |
| 4 | Lockhart spatial join | Build a real parcel-to-zoning-district join; today's registry row points at a 244-feature polygon layer with no `prop_id` and no fallback join anywhere in `zoning-staging/registry.ts` | Not stale — structurally unimplemented. Confirmed the ledger's own `zoningDistrict` data for Lockhart is fine (6,456 real values); this is strictly an atom-pipeline gap | **DONE 2026-09-06** (`hauska-engine#390`, `62dc2d09`, verified merged). Major scope discovery en route: `tx_zoning_district_staging` already holds real staged zoning-district polygons for 107 cities, not just Lockhart — including all 5 of item 6's setback-research cities. The join is now built generic/city-parameterized, tested only against Lockhart per scope. Dry-run: 4,897 real parcel matches, 4,894 clean, 3 genuinely ambiguous (real polygon disagreement, correctly left unresolved rather than picked). Cross-validated against the independent Tier-1 breadth-bake pipeline — identical district values on every checked parcel, no drift. Net finding: Lockhart's real gap was never missing data, it was the absence of any join capability — Tier-1 already had Lockhart covered, so a real `--apply` would write zero new atoms (all matches already stamped). The other 106 staged cities, including the item-6 overlap, remain an explicit, real, unscoped opportunity — not yet decided |
| 5 | Travis join-key implementation | Build the `geo_id_or_address_crosswalk` `JoinKey` strategy — a type declaration exists and names Travis by comment, zero code implements it anywhere in engine-core | Travis's real `prop_id` bad-rate (51%) makes the default join unsafe. Confirmed the ledger's own CAD data for Travis is fine (0 unaccounted); strictly an atom-pipeline gap | **Re-scoped 2026-09-07 after real pre-implementation investigation (see below) — phase 1 approved and in progress, phase 2 held.** |

**Travis join-key — full current understanding, 2026-09-07 (corrects the row above,
which described the target as a from-scratch `JoinKey` build; that target does not
match what actually needs building).**

The `JoinKey`/`jurisdiction-registry.ts` mechanism the original design named is
type-level only — zero implementation, zero registry rows use it. A **separate,
already-real, already-live mechanism** (`ParcelKeyKind` in the published
`@empressaio/atom-contract` package, `CROSSWALK_HOLD_FIPS` in
`packages/atoms/src/fact-writer-ids.ts`) already handles Travis today: it correctly
declines (honest hold, not an unsafe join) for `cad-parcel-roll`/`land-use-fact`/
`flood-hazard-fact`. Building the originally-named `JoinKey` system from scratch
would have shipped new infrastructure duplicating something already correct.
Approved fix extends the real mechanism instead.

Real per-plan investigation before any code (do not skip this step if this gets
picked back up cold) found the fix is three pieces, not one:
1. `ParcelKeyKind` lives in the published atom-contract package, not locally in
   engine — adding a real address tier means a real contract PR + publish cycle,
   same shape as tonight's `property-boundary-edge` work.
2. The planner (`plan-county-parcel-nodes.ts`) currently assigns **one static
   tier for an entire county**, not a per-parcel cascade — likely means Travis
   sits entirely in the unresolved/hold tier today, even for the roughly 49% of
   parcels where `prop_id` alone would actually resolve fine. A real per-parcel
   cascade (try prop_id, fall back to geo_id, fall back to address) is a control-flow
   rewrite, not a config change — and is shared infrastructure, not Travis-specific.
3. Address data itself does not exist anywhere queryable yet for this planner
   (`txgio_parcel` carries no situs/address fields; no existing TCAD-situs
   ingestion code was found to build on). A real address tier needs a real
   sourcing decision (live per-parcel TCAD query at plan time vs. a persisted
   ingestion/crosswalk table) before it can be built at all — genuinely open,
   not scoped further than that.

**Ruling:** build phase 1 now — the contract PR (new `ParcelKeyKind` value) plus
the real per-parcel cascade using prop_id and geo_id only. This is a real,
substantial, standalone improvement (resolves the real-district-carrying majority
of Travis parcels currently sitting in hold for no reason beyond the county-wide
policy being too coarse), buildable today with zero new data sourcing. Phase 2
(the address tier) is explicitly held pending a real decision on how address data
gets sourced and stored — not resolved as a side effect of phase 1.
| 6 | Hays / McLennan / Williamson in-city onboarding | From-scratch GIS source recon + ordinance transcription, same scale as the original Bastrop/Elgin/Lockhart build | Confirmed: these three have real, substantial `zoningDistrict` ledger data already (49,655 / 53,365 / 167,732 real values respectively) — the gap is specifically setback-*value* resolution (needs a live per-parcel record or codified table), which the ledger's zoning classification alone doesn't provide | Scoping only. **2026-09-06 correction below invalidates the "not-applicable stamp" quick-win path for Caldwell/Hays/McLennan/Williamson; item 6's real-gap framing (setback-value resolution, not zoning-existence) is CONFIRMED correct by the same finding** |
| 7 | Preflight re-validation | Re-run and fix the existing 8-check `onboard-preflight` gate against current reality | Confirmed stale — last touched 2026-08-05/08, a full month before ADR-031 was ratified (2026-09-03) | Not started |
| 8 | Rebake/publish trigger verification | Confirm whether `legacy-design-tools`'s facet-bake process (`nodeFacetBakeTier1`/`Tier2`) needs to explicitly re-run to pick up freshly-minted atoms, or reads them live | Found real precedent for the concern: Tier-1's own code comment describes an earlier "anti-zombie cut" retiring its own independent envelope computation in favor of deferring to the atom chain — implying baking is a separate step from emission, the same "correct in the store, not yet served" pattern found elsewhere in this sprint | Not started — flagged, not verified |
| 9 | Per-county atom backfill | The actual production run, once 1–8 are done or explicitly accepted as risk | The "final mile" — looked simple at pilot start, turned out to depend on everything above | Not started |

## End result

Durable, atom-backed buildable envelopes rendering correctly in both Property
Explorer and the MCP app, across all 6 CTX counties, through one shared reader
rather than two independently-drifting implementations, with a real mechanism
keeping coverage current as parcels change — not a one-time fill that quietly
rots the way Bastrop's already has.

## Correction (2026-09-07): this doc's "DONE" has been merge-verification
## wearing the word "live" — a serving state is now tracked separately

Found while compiling a real SERVING-vs-merged enumeration at the operator's
request. Items 2 and 3 above read "DONE 2026-09-06... verified live via
`gh pr view`" — that verifies the PR's merge state, not that the code is
serving production traffic. Cross-referencing merge timestamps against
actual Cloud Run serving-revision creation times (a cheap, general
instrument, credited to doc-repo-6f) settles it either way: `cortex-api`'s
currently-serving revision (`00737-fog`) was created 2026-09-05T17:56Z and
`smartsite-mcp`'s (`00097-sov`) at 2026-09-05T13:59Z — both **before**
`legacy-design-tools#626` merged (2026-09-06T20:21:28Z) and before `#632`
merged (2026-09-07). A revision created before a merge cannot contain it,
regardless of which of the two surfaces actually hosts this code path. Items
2 and 3 are **merged, correct, and not currently serving any request** —
neither PE nor the MCP app is reading this fix in production today. Same
holds for the separately-tracked "PE / Smart Site MCP app parity" closure
below (`#632`), whose own "verified live" language almost certainly means a
real Postgres integration test, not production traffic — both readings were
honest when written; neither means what a fresh reader takes it to mean.

**Standing convention from here forward**: `DONE` in this document records
git/code state (merged, correct, tested) and is never sufficient on its own
to claim something serves a customer. Before restating any item above as
currently correct in production, check the actual serving revision against
the merge commit — the same check that caught this. This is the same defect
shape as the constraint-index finding elsewhere in tonight's work (code
correct, nothing runs it) approached from the opposite direction (code
correct, merged, nothing serves it) — both are ENFORCEMENT's opening line:
an artifact that exists, is correct, and does nothing.

## Update (2026-09-07, later same session): cortex-api genuinely redeployed
## and verified — items 2/3 and the #632 parity fix are now actually serving

cente-c1 deployed cortex-api for real after operator approval independently
confirmed through its own channel, not taken on relay: revision
`cortex-api-00739-xoy`, pinned to `#632`'s exact merge commit's image digest
(`sha256:bc13c708...`), 100% traffic confirmed by reading the JSON traffic
field by name (not a positional formatter). `DATABASE_URL` binding checked
by field name both before and after the shift — the pooler-revert hazard
this thread had flagged did not fire. The one pending migration
(`0098_tx_wcad_ag_valuation.sql`) applied as a documented no-op (table
already existed). The prior "merged, not deployed" status for items 2/3 and
the #632 parity closure is superseded: they are now genuinely serving.

**Killeen re-test found the original test parcels were invalid, not that the
fix was wrong.** Of the two parcels first used to claim Killeen worked: one
(`48027:41199`) is actually in Belton, not Killeen, and separately hit a
real, unrelated geometry-validation bug (a boolean clip error on that
parcel's specific ring) — its setback data itself resolved correctly once
the city mixup was corrected. The other (`48027:455201`) is zoned
commercial, genuinely out of scope for the residential-only table — its
"no-district" result was correct, not a defect. A real, valid, in-scope
Killeen residential parcel (`48027:5720`) was found and re-tested instead:
clean 200, real drawn polygon, correct PR #630 setback values with a real
citation. The unrelated Belton geometry-validation bug is a fresh, separate
finding, not yet filed as its own record or assigned an owner.

**A new, honest, deployed-but-invisible finding on D5/D6.** The zoning
precedence fix (D5) is deployed and its logic is correct (proven by local
tests), and `setbacksFact` (D6) is wired and appears on the live facets
endpoint. But live production data shows the gate-evaluation pipeline that
would ever let D5's "record wins" branch fire has never actually passed a
single county for these two rails — zero rows in `parcel_gate_verdict` for
`setbackFrontFt`, and every evaluated county shows `zoningDistrict` refuse,
not pass. Every real parcel today falls through to the pre-existing baked
behavior, correctly and as designed. This is not a D5/D6 defect — it is a
separate, real gap in the gate-evaluation pipeline (nobody has scheduled or
run it for these rails), meaning the fix's actual effect on any live user
is currently zero and will stay that way until that evaluation runs
somewhere. Not yet carded or assigned.

## Full ledger atomization — explicitly out of scope here

ADR-031 already anticipated a "CTX atom-backfill card" as an open decision, not
yet opened at the time it was ratified. This program (items 1–9 above) opens
that card, scoped narrowly to the `property-boundary-edge`/`buildable-envelope`
rail-family. The remaining ~63 rails' relationship to the atom estate is
deliberately NOT addressed here. Rationale, per the operator's own instinct
mid-scoping: doing one rail-family well first — including building the shared
reader and the succession mechanism, both reusable infrastructure — makes every
subsequent rail-family's atomization cheaper and safer than attempting a single
undifferentiated sweep. ADR-031 itself is designed for exactly this: rails
migrate to atom-served individually, coexisting for as long as the slates take.

A separate card should be opened when this program is far enough along to
inform it, naming: which rails atomize next, whether the succession/refresh
mechanism built for boundary/envelope generalizes to other rail-families
unchanged, and whether the shared-reader principle (item 2) should become a
standing architectural rule enforced across all rails, not a one-off fix.

## Reasoning

Every item above is backed by a direct verification during the 2026-09-05/06
pilot, not an assumption — see the pilot close doc
(`_inbox/2026-09-06_ctx-wrapup-engine_boundary-envelope-pilot_close.json`) for
the full evidence trail. The scope grew substantially from the operator's
original framing (a handful of stale registry rows to refresh) as each layer
was independently checked against live sources rather than trusted from
config or memory — exactly the discipline this whole sprint has depended on.

## Reversal criteria

If profiling (see the parallel compute-bottleneck investigation) finds the
shared Neon compute cannot sustain a real backfill's throughput regardless of
concurrency fixes, this program's sequencing may need to invert — fixing
throughput before item 9 becomes viable at all, not after.

## Dependencies

Cross-repo: hauska-engine (items 1, 7, 9 and the underlying computation),
legacy-design-tools (items 2, 3, 8), hauska-factory (item 6's McLennan
zoningDistrict sub-finding shares a mechanism with this program but is
ledger-side, not atom-side — tracked separately in OPS-19b's successor
thread). Depends on the compute-bottleneck investigation (dispatched
2026-09-06) for a realistic throughput estimate on item 9.

## Counterparties

Internal: Engine lane (`cente-67`), Factory lane (`cente-b5`), LDT ownership
(not yet dispatched — items 2/3/8 need an LDT-side lane), operator (ruling,
scope confirmation).

## Execution log (2026-09-06, operator go-ahead on full sequencing)

Operator reviewed the full program plus a parallel factory-health thread
(zombie/orphan process audit, compute-bottleneck investigation) that
surfaced from the same scoping conversation, and ruled on sequencing and
staffing for both together. Recorded here so the plan survives context loss.

**Ruling: Program 2 (factory health) is a partial, not full, prerequisite
for Program 1.** The compute-bottleneck/throughput thread gates Program 1's
real backfill execution (item 9) directly — running a volume backfill
against a compute known to be degraded just reproduces the same pain at
scale. The zombie/orphan-process cleanup does not block Program 1's design
work (items 1-3, 7-8) but should substantially complete before Program 1
ships for real, per the operator's own standing concern about residual
processes from prior factory rebuild attempts causing confusion.

**Staffing, as of this entry:**
- Engine (`cente-67`): expanded zombie audit covering `hauska-engine`'s own
  `packages/engine-core/scripts/` (real evidence per script, not guessing
  from names); real per-county sample-atom batches (see below); scoping
  Lockhart's spatial join and Travis's join-key implementation as bounded
  engineering tasks.
- Factory (`cente-b5`): decommissioning the 8 confirmed-zombie Cloud Run
  jobs with a real close-doc audit trail; the two deferred bottleneck test
  items (falsify the one-heavy-op-at-a-time rule; re-measure atoms/s
  throughput) bundled with Engine's sample-batch work since both need real
  compute time against the same live stores — coordinated to avoid
  confounding either measurement.
- LDT (new lane, operator opening a session): item 2 (the shared-reader
  fix — rewire `buildableEnvelope/derive.ts` to actually consume the atom
  chain instead of independently re-deriving) is the priority item, not
  deferred further. Item 3 (the possible road-class-defect echo) and the
  LDT-side portion of the zombie audit (Tier-1/Tier-2 bake chain,
  `cortex-api`) are the same lane's other work.

**Real per-county sample-batch sequencing — corrects an earlier gap.** Only
Bastrop ran in the original pilot; the operator asked for a batch per
county and did not get one. Real, currently-runnable sequencing:
Bastrop/Elgin already piloted; Caldwell/Hays/McLennan/Williamson each have
a real, working unincorporated/rural registry row and can run a real
dry-run sample batch immediately, exercising the legitimate not-applicable
coverage path and producing real per-county timing data; Lockhart and
Travis are blocked on real, not-yet-built code (a spatial join and a
join-key implementation respectively) and cannot run a sample until that
lands.

**Operator instruction applied throughout**: lane planners may use their
own sub-agents to cover ground in parallel where independent (e.g., one
sub-agent per ready-now county's dry-run batch) — the lane planner reviews
and commits, sub-agents do not. Every write-shaped action (zombie
decommission, sample-batch apply, any code merge) keeps the same
dry-run-first, canary-then-shift, independently-verified discipline used
for every real change tonight. No production regression tolerated as a
tradeoff for speed.

## Correction (2026-09-06, Engine pre-write verification): the not-applicable
## cohort for Caldwell/Hays/McLennan/Williamson does not exist as scoped

Before writing anything, Engine queried the live substrate atoms table
(`ATOMS_DATABASE_URL`) to size the cohort the "emit not-applicable directly
from parcel identity" plan was meant to run against, rather than trusting
the registry's `zoningRegime: "unzoned"` label or this doc's earlier framing.
Real result, per county (active parcel-nodes / existing real envelope atoms
already on file, all real `buildable`/`no-buildable-area` outcomes, zero
`absence`, zero `not-applicable`):

- Caldwell (48055): 25,181 nodes, 24,006 (95.3%) already covered
- Hays (48209): 116,842 nodes, 102,143 (87.4%) already covered
- McLennan (48309): 114,369 nodes, 65,814 (57.5%) already covered
- Williamson (48491): 282,695 nodes, 282,436 (99.9%) already covered

Some already-deployed pipeline other than `depth-warm-city-batch.mjs` (none
of these registry rows have `warmRunner`) already ran real per-parcel
computation across the large majority of each county. That pipeline's
identity was traced by Engine within the hour (read-only, no writes): it is
`bake-property-atom-county.mjs`'s Tier-1-snapshot mode (`emitFromTier1Snapshot`),
reading CORTEX_DATABASE_URL's `place_layer_snapshots` — a separate upstream
from the registry/depth-warm system entirely, run across all four counties
2026-07-23 through 2026-08-05, still live and wired in `package.json`. Its
companion `cascade-unzoned-envelope-decline.ts` (real commit as recently as
2026-08-09) already closed the entire absence-zoning-fact gap in all four
counties using an older decline shape (`outcome.kind`/`warmVerifyDeclineCode`,
pre-dating tonight's `not-applicable` union member) that already
distinguishes genuinely-rural parcels from in-city-but-unonboarded ones via
a situs-city heuristic. The registry's `zoningRegime:"unzoned"` label is
therefore correct and narrow as written — it describes the county
government's own non-zoning posture, not "no zoning exists in this county."
Real cities inside these counties (Waco, Round Rock, Georgetown, San
Marcos, Kyle, Axtell, and others) already carry real zoning signal through
this separate Tier-1 pipeline, entirely disconnected from
`jurisdiction-registry.ts`'s formal per-city row model.

The pipeline is idempotent and safe to re-run, but re-running it would NOT
close the remaining real gap. Engine traced why directly from the adapter
registry file list (`packages/adapters/src/local/setbacks/index.ts`):
`emitFromTier1Snapshot` resolves setback dimensions via
`getSetbackTableForZoning(cityKey, district)`, which only has hand-authored
tables for Bastrop, Elgin, Austin, Pflugerville, San Antonio, plus two
out-of-state counties — Waco, Round Rock, Georgetown, San Marcos, and Kyle
are not in the table at all, so a real-district parcel in any of those
cities returns null and emits nothing, every time. McLennan's low ceiling
(57.5%) versus Williamson's high one (99.9%) is not a partial run; it is
that McLennan's real-district population is dominated by Waco (no table)
while Williamson's resolves cleanly against tables that already exist.
**This independently confirms item 6's setback-value-resolution framing a
second way** — via the adapter registry's actual file list, not the ledger
data the item was originally written from. Once item 6's ordinance
transcription lands for the relevant cities, item 9's backfill for these
four counties closes through this existing breadth-bake pipeline, not new
code. Nothing here changes the pause on the not-applicable path; there is
still no honest cohort for it to run against.

Of the remaining gap (parcel-nodes with no envelope atom), the overwhelming
majority already carry a real zoning district on file: Caldwell 83.6% of
gap, McLennan 99.8%, Hays 97.1%, Williamson 51.5% — with zero zoning-fact
`absence` markers anywhere in any of the four counties. Stamping
not-applicable onto these would be a fabricated claim, not an honest scope
statement — exactly the failure mode the not-applicable doctrine exists to
prevent, pointed at a cohort nobody expected. The residual "no zoning-fact
atom at all" bucket (115-422 per county) is 100% synthetic `_feature-*`
StratMap keys with unresolved `prop_id`, not real addressable parcels.

**Net: zero real, resolved-identity parcels in any of these four counties
currently have an honest not-applicable cohort to run against.** The
registry's "unzoned" label describes the Rail A/B/C CAD-ingest source
characteristic, not "no zoning exists in this county" — real incorporated
cities inside these counties (Round Rock/Georgetown, San Marcos/Kyle, Waco,
Lockhart/Luling) already have real district data from the still-unidentified
pipeline above. This confirms item 6's own framing (the real gap is
setback-*value* resolution / ordinance transcription for those cities, not
zoning-existence) and invalidates this doc's "per-county sample-batch
sequencing" entry above insofar as it proposed Caldwell/Hays/McLennan/
Williamson as a cheap not-applicable dry-run — that path is paused pending
operator direction. Engine ran read-only queries only; no production write
was made. Full evidence in Engine's report to the integration seat,
2026-09-06.

## Item 1 (parcel succession/refresh mechanism): DESIGN RULED 2026-09-07, not yet
## implemented

Real path to close the item 1 gap named in the original program scope
(`reconcile-county-parcel-nodes.ts` retires a parcel "without successor...
until a succession matcher is decided," and no path exists today, not even
manual, by design). Operator-approved design:

1. **Trigger off the existing retirement event.** `reconcile-county-parcel-nodes.ts`
   already retires a node "without successor" on every ingest cycle — that
   event already fires, it just currently goes nowhere. Add a step
   immediately after retirement rather than build a new detection mechanism.
2. **Matching heuristic.** When a node retires, check whether any
   newly-ingested node in the same county has geometry overlapping the
   retired node's last-known geometry above a real threshold — starting
   point ~50% intersection, tunable once real data shows the right cut.
3. **Record, never delete.** A match records a `succeeded_by` pointer on the
   retired node. Matches the portfolio's standing retirement discipline
   (`ENFORCEMENT.md`: "Retirement is proven by decline, never by
   documentation... repoint consumers first, then retire the store") — the
   old node stays, it just carries a pointer forward.
4. **Cascade.** Downstream atoms still keyed to the old node get flagged
   superseded, not deleted. The successor node gets queued through the
   *existing* writer pipeline exactly as a brand-new parcel would — no new
   atom-writing logic needed, only triggering the pipeline that already
   exists.
5. **Cadence.** Runs as a batch step inside the same job that already
   performs the county's periodic StratMap refresh — not a new standing
   service. Matches this portfolio's existing job-oriented architecture
   (Cloud Run jobs, not always-on daemons) rather than introducing a new
   pattern.

Not yet implemented; not yet dispatched to a lane. This record exists so
the design survives context loss and doesn't need re-deriving when it's
picked up.

## Named gap: hauska-mcp-server has zero ledger connection — deferred, not urgent

`hauska-mcp-server` (the commercial catalog gate, distinct product from Smart
Site per settled brand separation) reads only atoms via retrieval-api,
with zero connection anywhere to the parcel_record ledger — meaning for the
15 rails that ARE ledger-served elsewhere, a hauska-mcp-server customer can
get a different answer than a Smart Site user asking the same question. Real
gap, matches this session's own two/three-readers drift pattern at a bigger
scale. **Deliberately deferred**: operator's stated priority is PE/Smart-Site-
MCP-app parity first (below), which is the actual near-term market-facing
risk; this is a known skeleton to fix in a later wave, not urgent tonight.

## Named gap and priority: PE / Smart Site MCP app parity — the real
## market-blocking risk, 2026-09-07

The operator's actual priority: Property Explorer (the web app) and the
Smart Site MCP app (the Claude extension linked to it,
`legacy-design-tools/artifacts/smartsite-mcp/`) must serve identical data in
production. Tonight's ledger-tracing work already surfaced three concrete,
confirmed divergences as a side effect, not from a dedicated audit:
`valueHistory` and `agValuation` are wired into PE's own path
(`brokerageNodeFacets.ts`) but not into the MCP app's brief-assembly path
(`propertyExplorer.ts`'s `assembleNodeBriefBody`); `zoningDistrict` is
computed two structurally different ways in each — PE derives its own answer
from city-limits containment, while the MCP-app brief path reads the real
ledger `zoningDistrict` cell directly. These three were found incidentally;
a dedicated, systematic field-by-field audit of both functions would almost
certainly find more. Real precedent exists for exactly this kind of audit —
a separate parity effort (MCP connector vs. web app package/tier gating,
PR #619/#620, referenced in tonight's OPS-16 amendment log) already used a
"full audit matrix before any change" method for a different but structurally
similar question.

**Ruling: this is the priority item, dispatched now.**

**CLOSED 2026-09-07.** `legacy-design-tools#632` (`c9d2806c`, verified merged).
All six ruled-in divergences fixed and verified live, not just merged: D5
(zoning) — a gate-passing live ledger fact now overrides a stale baked stamp
end-to-end, proven with real integration tests against real Postgres. D6
(setbacks) — the public inspect-card route now returns real setback values
for gate-passing counties; it returned none for any parcel before this fix.
D1/D2/D4 — missing fields wired on, land-use precedence corrected. D3 (owner)
— added only after confirming the paid-tier gate already covers it at every
real call site, proven both directions (refused when ungated, served when
granted). This closes the confirmed part of the "will setbacks actually
render" question: the public map already rendered them via the codified
table (found separately), and now the MCP/brief path's own setback section
does too.

Real question the operator asked twice: does the ledger need to be "in place"
for data to serve correctly? Answer, live-traced per rail, not inferred from
doctrine: of 65 total rails, **15 are genuinely served live through the
ledger today** (cityLimits, flood, wells, specialDistricts, valueHistory,
assessedValue, marketValue, landValue, improvementValue, livingAreaSqft,
yearBuilt, utilityService, overlayDistricts, agValuation, schoolDistrict).
**4 have a real gate verdict but are not actually serving through the
ledger**, for two different reasons that must not be conflated: `landUseCode`
and `owner` are genuinely starved — gate passes, zero consuming code
anywhere, no slate entry, no adapter file — a clean instance of the "declared
but nothing reads it" failure mode. `zoningDistrict` and
`maxImperviousCoverPct` are wired correctly end-to-end but their live gate
verdict is currently refuse (346,165 unincorporated parcels unaccounted for
zoning; 244,669 for Travis imperviousness) — **this is the system working
correctly, fail-closed, against a real known gap, not a defect.** The
remaining **46 rails have no gate verdict at all** and structurally cannot be
ledger-served yet — this is the same ceiling the earlier ledger-atomization
research found, confirmed independently here.

No gap found against the original wiring decision
(`_decisions/2026-09-02_step7_consumer_c_then_b.md`) — every rail it named
for Slate 1 is confirmed genuinely wired. The gap is in ADR-031's own summary
sentence ("the main serve path reads record cells"), which is true but
doesn't distinguish "wired and passing" from "wired and correctly refusing"
from "declared but starved" — a fresh reader would not catch the landUseCode/
owner gap from that sentence alone.

**Real architectural clarification, previously unclear all night**: there are
two separate MCP-facing apps, not one. `hauska-mcp-server` — treated all
session as "the MCP gate" — has zero references to the ledger anywhere in its
codebase; it's a pure HTTP proxy to the atoms store and other services. The
tool that's actually live for `get_smart_site` (used in this very session)
lives in a third, separately-deployed app,
`legacy-design-tools/artifacts/smartsite-mcp/`, which genuinely does read the
ledger for the 11 currently-passing gated rails when it calls into cortex-api's
brief-assembly function. Property Explorer is a pure HTTP consumer of that
same resolved data — it never touches `parcel_record_cell` directly. This
needs to be represented correctly in the architecture document, not
simplified into "the MCP server reads the ledger."

## Command Center's real production URL — resolved 2026-09-07

Tonight's architecture survey flagged a real ambiguity: no Vercel project named
`command-center`/`cmdcenter` exists, and four differently-named, lane-scoped
projects (`hauska-map-records`, `hauska-map-lookup-perf`, `hauska-map-auth-esm`,
`lane-a4c-panel`) were each independently found serving the identical
`Empressa Command Center` app title, with no way to tell which was real
production from the outside. Resolved directly by the operator: the real
production URL is **`https://cmdcenter-blush.vercel.app`** — confirmed live
(200, matching title) by the integration seat. Matches prior standing guidance
("CC deploy = cmdcenter/blush, not command-center/jade — verify in the blush
bundle") — the survey's finding independently rediscovered why that guidance
exists rather than contradicting it.

**Not yet resolved**: whether the four `hauska-map-*`/`lane-a4c-panel` Vercel
projects the survey found are stale, abandoned lane deploys worth decommissioning
(consistent with tonight's broader "quarantine orphaned things" work), or
something still legitimately in use for a reason not yet checked. Worth a real
look, not urgent — flagged here so a future agent doesn't mistake one of them
for production the way tonight's survey nearly did.

## Canonical setback-table source — three real implementation decisions,
## 2026-09-07, ruled before Engine started building

1. **Where it lives**: a new, dedicated repo, same shape as
   `hauska-atom-contract` — own `package.json`, own tag-triggered publish
   workflow. Not homed inside either `hauska-engine` or `legacy-design-tools`
   — that would recreate an ownership asymmetry instead of fixing one.
2. **Georgetown/San Marcos granularity**: not actually a conflict —
   `hauska-engine`'s corpus has no competing version of either city.
   `legacy-design-tools`'s field-level merge (9 preserved districts + 4 new)
   is simply the correct, complete version to bring in as-is. Standing
   principle for the rest of the merge: preserve field/district-level
   granularity wherever both sides genuinely have data for the same city;
   most cities only have one real source, so this is rarely a live question.
3. **Consumer model — replace, not sit alongside.** Both `hauska-engine` and
   `legacy-design-tools` import from the new package and retire their own
   local JSON copies once the import is proven. A package that coexists with
   both originals would recreate a fourth copy, not fix the drift problem
   this whole effort exists to solve. PE's small local copy retires the same
   way once its own atom-chain reconciliation (already landed) is trusted
   enough to lean on fully — not blocking, same eventual direction.

## Canonical setback-table source: ESCALATED TO TOP PRIORITY 2026-09-07

Confirmed directly against a live parcel: the corpus merge is not just an
atom-catalog completeness question — it is the actual blocker on the nine
cities researched tonight (Killeen, Belton, Seguin, Cibolo, Waco, Round Rock,
Kyle, Georgetown, San Marcos) rendering anywhere, map or brief, for real
users. Nothing shows for these cities today, in either app, until this
lands. Escalated above other queued work; dispatched to Engine to start now
(data-merge side, independent of LDT's governance-porting contribution,
which folds in once their current D5/D6 parity fix closes).

## Canonical setback-table source: DIRECTION RULED 2026-09-07, not yet executed

Three independently-vendored copies of the setback-table JSON corpus exist
(hauska-engine's `packages/adapters/src/local/setbacks/`, legacy-design-tools'
separate `lib/adapters/src/local/setbacks/`, and PE's own
`apps/property-explorer/api/_lib/setback-tables/`), diverging further tonight
as new cities landed independently in the first two. Operator ruling: make
hauska-engine's corpus the one canonical data source (it already feeds the
real atom-emission pipeline that serves production), port legacy-design-tools'
governance onto it (the real citation-verification gate plus tonight's honest
`primary-source-verified` state — genuinely more mature than anything on the
hauska-engine side), merge legacy-design-tools' newly-landed cities in
(Killeen, Belton, Seguin, Cibolo, Elgin), then publish the merged, governed
result as its own small versioned package — same pattern as
`@empressaio/atom-contract`, proven out end-to-end tonight. Both repos import
from it instead of vendoring; PE drops its local copy once the atom-chain
reconciliation (already landed, PR #362) is trusted enough to lean on fully.

**Not started.** Real, multi-repo work — engine-led (deepest context on the
emission pipeline, just proved the publish pattern), LDT folded in
specifically for the governance-porting piece. Immediate, lower-cost action
taken now: freeze further ad-hoc city additions to either corpus so the
divergence stops growing while this gets properly scoped. Consequence worth
naming explicitly: until this merge and a real atom-emission run against the
merged cities happens, Killeen/Belton/Seguin/Cibolo/Elgin's setback data is
reachable only through each app's own local JSON fallback rendering, not as
real served atoms — the research and honest labeling landed tonight is real
and correct, but it is not yet the same thing as these cities being part of
the actual atom backfill.

## property-boundary-edge orphan type: CLOSED 2026-09-07

Registered end to end and independently verified live at every layer: `hauska-engine#394`
(`e2ce39b0`, merged) registers the type in `PROPERTY_ENTITY_TYPES`; `hauska-mcp-server#81`
(`69f727d7`, merged) adds it to `ENGINE_PROPERTY_ENTITY_TYPES_MIRROR`, its own live
sparse-checkout drift test confirmed failing before the engine-side merge and passing clean
after; `hauska-atom-contract#27` (`8dde29c1`, merged) adds the real `BoundaryEdgeAtomInstance`
shape at 1.31.0, tagged and published to the public npm registry (`npm view
@empressaio/atom-contract@1.31.0` and `dist-tags` both independently re-verified live by the
integration seat, not just the workflow's own report). The 26,846+ real Bastrop
`property-boundary-edge` atoms are now reachable through `get_property_atom_chain` and typed
in the published contract any external consumer depends on — genuinely closed, not just
merged.

## Addendum (2026-09-06, hauska-engine deep-probe): a contract-shape gap that
## caps what Program item 9 can deliver, plus a quarantine flag

**`BuildableEnvelopeAtomInstance` cannot carry a geometry/ring field, in the
published contract or in hauska-engine's own local extension.** It carries
only a scalar `areaSqFt` and/or a typed decline reason. This program's
stated "End result" (durable, atom-backed buildable envelopes *rendering
correctly* in both Property Explorer and the MCP app) requires drawing an
envelope shape — which cannot come from the atom as currently typed under
any amount of backfill or reader-unification work. Item 9 executed in full
still leaves every consumer recomputing the ring itself from raw geometry.
This is a contract-schema gap, not a coverage gap, and needs its own scoping
decision (add a geometry field to the contract, version-bump, migrate
readers) before item 9's stated end state is actually reachable. Not yet
scoped as a numbered program item; flagging here so it isn't lost.

**Corroboration, from the writer side, of the `property-boundary-edge`
orphan-type finding already recorded via the atom-contract/MCP audit**:
hauska-engine's own `packages/atoms/src/boundary-instances.ts` docstring
says outright the type is "vendored... until @empressaio/atom-contract
publishes property-boundary-edge... provisional," and yet it has been
live-writing production atoms (26,846, Bastrop only) since before it had
any home in the actual published contract.

**Quarantine flag (matches the operator's standing request to find and
quarantine anything not part of an approved factory process):** the live
`tx_building_footprint` table (10.67M rows, all of Texas, real data
consumed by real atom writers) has no creating migration or ingest script
anywhere in hauska-engine `main`'s git history. The actual DDL and ingest
scripts exist only on an unmerged branch,
`origin/feat/p2-4-tx-building-footprint-staging` (5 commits ahead of `main`,
128 behind, never merged, 2026-08-11/12), whose migration file also claims
migration number `0073` — already taken on `main` by an unrelated,
already-merged flood-zone migration, a live numbering collision.someone ran
this branch's migration and ingest directly against production without
merging the commits that define them. `main` cannot reproduce its own
database from its own history. Separately and more encouragingly: CTX-6's
raw footprint geometry is already 100% staged (705,897 rows across all six
counties since 2026-08-12) — the reason 5 of 6 CTX counties show zero
building-footprint atoms is not a data-acquisition gap, it is that the atom
writer was invoked against a different, undocumented 174-county list that
happens to include Caldwell but exclude Bastrop, Hays, McLennan, Travis,
and Williamson. Closing the CTX footprint-atom gap may be far cheaper than
assumed — a writer re-run against the 5 missing counties, not a new
ingest — but that re-run should not proceed until the orphaned-branch
reconciliation (merge or formally adopt the migration, resolve the `0073`
collision) is resolved, so the next person to rebuild from `main` doesn't
inherit a database `main` cannot explain.

**CLOSED 2026-09-07.** All five counties applied for real and independently
verified live by the integration seat directly against the atoms table
(not just the writer's own self-report): McLennan 125,973, Williamson
308,889, Travis 396,462, Bastrop 71,501, Hays 128,569 — 1,031,394 atoms
total, zero verify failures, zero errors across the sequence. Sequenced one
county at a time with live verification between each, per the operator's
own instruction not to batch-apply blind. Bastrop and Hays each got a
fresh dry-run first since their original numbers predated the roster-query
perf fix (PR #392); both came back sane and consistent with the earlier
figures before being applied. The real coverage gap that started this
whole thread — Bastrop having zero building-footprint atoms despite being
the flagship pilot city — is closed. Per-county coverage remains genuinely
uneven (touch rates from 20% to 99.96%), but every county's variance is
now understood as real, non-fixable-by-code geographic/data-source
coverage, not a defect, per the dedicated diagnostic earlier tonight.

**Resolved 2026-09-06: the declining present-atom ratio (Caldwell 51%→
Bastrop 37.7%→Hays 19.8%) is real, non-fixable-by-code data-source variance,
not a join bug.** A dedicated diagnostic replicated the production overlap
computation directly against real geometry for all three counties: the
join/threshold logic attaches >99.9% of footprints that touch any parcel
polygon at all, in every county — the threshold is not where the loss
happens, and loosening it was explicitly rejected as a fix (would risk false
attaches without addressing the real cause). The entire decline is upstream:
whether a staged ML footprint polygon touches any `txgio_parcel` geometry at
all, which is a property of how completely the StratMap25 parcel layer
(TNRIS, vintage 202503) covers each specific county, not of hauska-engine's
join code. Rural/large-lot bias, multi-tract dedup, and stale-geometry
theories were each tested directly and rejected by evidence (e.g., Hays has
the *smallest* median parcel of the three, the opposite of what the
large-lot theory needs). One correction worth carrying forward: Caldwell's
cited 51% reference figure did not reconcile against live data (computed
36.19%) — flagged as stale or differently-computed, needs re-verification
before further use as a comparison anchor. Cleared to run the remaining
three counties' dry-runs; two genuine, separate, lower-urgency bugs found
along the way (a MultiPolygon outer-ring bug silently dropping secondary
tracts, and the writer re-parsing JSONB geometry in JS instead of using the
already-indexed native PostGIS column — the latter plausibly a real
contributor to tonight's worsening query times).
