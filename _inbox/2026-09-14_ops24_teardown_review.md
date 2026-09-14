---
id: 2026-09-14_ops24_teardown_review
title: OPS-24 teardown — a fresh planner's read-only attempt to break the county-to-serving program before anything is built
date: 2026-09-14
status: verdict, read-only review, not committed by its author
owner: nick
seat: dispatch-planner (seat/dispatch-planner, worktree P:/seat-worktrees/dispatch-planner/doc_repo); no sub-agent spawned
applies_to: hauska-factory, legacy-design-tools, hauska-map, hauska-engine, doc_repo
plan_rows: [P-186, P-195, P-198]
severity: program-blocking (the gate) / program-shaping (the rest)
snapshot:
  doc_repo: seat HEAD aacefa14 (diverged from origin/main by 4 local checkpoint commits; origin/main
    cd1d798e read directly via git show throughout — see the deviation note below)
  hauska-factory: origin/main 84642360184a685596417f2e0b066cd8a56cacaf
  legacy-design-tools: origin/main bae48d406f7595af3d47111b558d0ebc3efd9c56
  hauska-engine: origin/main 14c7e8500cad8a5947bdf4e6fe4391fe33b9d22c
  hauska-map: origin/main 848ec0aab141ce98f308e152c5f3cb1a076716ee
instruments:
  - git show origin/main:<path> and git grep against the five snapshots above, for every claim below
  - scripts/surface-probe.mjs --self-test, run offline against its committed fixtures (no network,
    no store write) — the one live execution this review performed, justified in CP1/CP2 as staying
    inside "read-only" and "never a write" because the mode is fixture-only by the script's own design
  - no gh, gcloud, psql, curl, or any live production/staging read (unlike the 2026-09-10 CTX-teardown
    precedent) — this dispatch's read set is git-only and this review held to that
related:
  - _dispatches/2026-09-14_ops24-teardown_dispatch.md
  - 90_operations/OPS-24_county_to_serving_program.md
  - _inbox/2026-09-14_county_to_serving_program_map.md
  - _catalog/program_preambles/OPS-24.md
  - _inbox/2026-09-13_dead_controls_ranked_fixes.md
  - _inbox/2026-09-13_assumption_register_{ldt,engine,factory}.md
  - _inbox/2026-09-14_ops24-teardown_cp1.json
  - _inbox/2026-09-14_ops24-teardown_cp2.json
  - precedent: _dispatches/2026-09-10_ctx-teardown_dispatch.md, _inbox/2026-09-10_ctx_third_party_review.md
---

# OPS-24 teardown: verdict and evidence

A fresh read of `90_operations/OPS-24_county_to_serving_program.md` and
`_inbox/2026-09-14_county_to_serving_program_map.md`, testing every claim against source in the four
product repos and doc_repo, in the six-item order the dispatch specified. No sub-agent was spawned; no
code was written; no store was touched; no working tree in the four product repos was used (git
show/grep against `origin/main` only). One deviation from the dispatch's literal instructions is
declared up front because it changed how evidence was gathered.

**Deviation, declared per the dispatch's own "STOP and report" clause.** The dispatch says to "fetch
and fast-forward to `origin/main` first and declare the commit" for the seat's own doc_repo checkout.
The seat branch has diverged: 4 local checkpoint commits (`09109127`, `05586acf`, `844cb7a5`,
`aacefa14`) not on `origin/main`, and `origin/main` carries 1 commit (`cd1d798e`, the OPS-24 program
commit this review targets) not on the seat branch. A literal fast-forward is impossible without
rewriting one side's history, which this mission's "never a write" bound does not license a read-only
lane to do unilaterally. This review instead read every doc_repo target file via
`git show origin/main:<path>`, exactly the method the dispatch mandates for the four product repos,
and left the seat branch untouched. Filed as CP1's `deviationDeclared` field.

## Verdict in one paragraph

The program's central, load-bearing claim survives and is worse in one respect than the map states it:
the publish gate's total-absence-passes defect is real, verified here by direct code trace rather than
by citing the map's prose (`hauska-factory/src/lib/publish-readiness-gate.mjs:216-300` and
`src/lib/parcel-record-engine/publish-gate.js:9-84`), it is the same defect already isolated and
fix-proposed the day before as P-181 entry 1, and it remains unfixed at the current SHA — so Law 2
("the gate is fixed before anything trusts it") is accurately gating the program on work that has not
happened yet, which is the correct call. But the program's OTHER central claim — Law 1, that
`scripts/surface-probe.mjs` is "the finish line for every stage" — is not true today for a single OPS-24
row: the probe's own `ROWS` table carries predicates for OPS-23's rows only (P-151 through P-175), zero
for P-186 through P-198, and the one hook that would force a close to cite a passing probe artifact
(`probe-close-gate.mjs`) is regex-scoped to P-151..P-167 and silently does not apply to any OPS-24 row
either. Six of the thirteen "not built" claims in the stage table (farm manifest, pre-bake audit as a
*runnable* check, completeness check, the gate's empty-county test, the cost meter, the merge gate) are
confirmed not built by an absence of any matching code anywhere in the four repos — the table is honest
there. One number the program repeats in three places (the "94 assumption rows") does not reconcile
against the documents it cites, by about 7-8%, and the session that received those documents explicitly
flagged them as unverified the day before OPS-24 restated the number as settled. One hole (atoms
partitioning) survives for a different reason than stated: the write LEASE is already scoped per
county, contradicting "ONE GLOBAL RESOURCE" read literally, but the underlying atom identity scheme
genuinely is not county-partitioned, so the hole is real one layer down from where the map puts it.
Burnet's sources check out (CAD REST reachable, 50,645 accounts, StratMap present); its rationale
overstates its geography.

## 1. Every "exists" in the stage table

| # | Row | Table says | This review found | Basis |
|---|---|---|---|---|
| 0 | P-186 | "recon exists; no gate reads per-place coverage" | Accurate, but the instrument column overclaims: `DECLARED_COMPLETE`/`EXPLICITLY_HELD` exist and are real (`hauska-factory/src/config/zoning-layer-completeness.mjs:69,107`) but are zoning-only, scoped to 22 cities (`test/parcel-r5-zoning.test.mjs:726`), not a general per-*place* gate across rail families. `tx-source-truth.mjs` (real, self-test logic sound) reports per-*county*, not per-place. Neither of the two named instruments, nor their combination, implements what P-186's own predicate describes. | git show + read, both files |
| 1 | P-187 | "not built" | Confirmed. A single-repo `_LDT_SHA` pin exists across `hauska-factory/cloudbuild.*.yaml` (e.g. `cloudbuild.bake-migrate.yaml:66`), CI-watched by `.github/workflows/ldt-pin-staleness.yml`. It is one SHA, one repo — not the four-line manifest (LDT + engine + factory + two package versions) the row requires. | git grep across cloudbuild.*.yaml |
| 2 | P-188 | "not built"; predicate cites "the 94 assumption rows" | The three registers this cites (`_inbox/2026-09-13_assumption_register_{ldt,engine,factory}.md`, P-181) are real and substantive. Recounted here by two independent methods (per-file structural markers `WHERE:`/`FAILURE MODE:`/`CONFIDENCE:`, which recur at equal counts within each file, and a cruder heading count): both converge on **~87**, not 94 (factory 29, engine 27, ldt ~31; heading count 38+29+20=87). See "numbers" finding below. As a *runnable* check (GREEN/AMBER/RED against a county's live source), confirmed not built — no code anywhere probes these registers against a store. | grep -c across all three files, two methods; git grep for a runnable-check implementation, none found |
| 3 | P-189 | "exists" | Confirmed, and the absorbed P-178 vintage rule ("never an upsert that keeps notice values silently") is genuinely implemented, not just claimed: `legacy-design-tools/lib/cad-ingest/src/rollMembership.ts` with its own dedicated test file. This is a thesis that SURVIVES — the row is not overclaiming here. | git ls-tree + git grep, legacy-design-tools |
| 4 | P-190 | "exists, fragile"; instrument "hays-identity-reconciliation.mjs generalised" | Mostly already true, in the safe direction: the script (`hauska-factory/scripts/ops21-h1/hays-identity-reconciliation.mjs`, 188 lines) is already county-generic — `--county=<fips>` is a real parameter, and the *only* Hays-specific code is a deliberate guard that refuses to run for 48209 without `--allow-hays` (a live-hold, not a hardcode). "Generalised" reads like a rewrite is owed; on this read it is closer to a rename/promotion. Minor, and it understates readiness rather than overstates it. | full file read |
| 5 | P-191 | "exists" | Corroborated indirectly: the rail/cell-state machinery this stage depends on (`isEarnedCell`, `PARCEL_RECORD_RAIL_KEYS`, cell states value/absent-verified/refused/not-applicable/unaccounted) is real, exercised by a large test suite, and load-bearing in the stage-9 investigation below. Not independently re-verified beyond that; this review did not open `parcel-record-fill.mjs`'s full-shape-on-first-write logic line by line. | inferred from stage-9/6/7 reads; flagged as lighter-touch |
| 6 | P-192 | "partly broken... owner/land-use/flood writers take NO LEASE and throw on first batch" | Confirmed, and sharper than stated: `hauska-factory/src/jobs/parcel-owner.mjs` and `src/jobs/flood-ingest.mjs` contain zero lease-acquisition code (no call into `atoms_writer_lease_v2` or any other lease table), yet **both unconditionally write `lease_released: true`** in their run-termination record, on the success path and the failure path alike (`parcel-owner.mjs:380,392`, `flood-ingest.mjs:274,286`). The run record does not merely omit a lease; it affirmatively claims one was released. Could not verify "throws on first re-run" read-only (would require executing against a store) — flagged open. | full-file grep + read, both jobs |
| 7 | P-193 | "exists, contended"; "atoms_writer_lease = ONE GLOBAL RESOURCE" | Does NOT survive as literally worded, on the lease specifically. `atoms_writer_lease_v2`'s `scope_id` is `${entityType}:${countyFips}` at every call site found (`conformant.mjs:319,608,953`, `restamp-access.mjs`), matching `AGENT_CONTRACT.md` section 3's current law verbatim, and no v1 single-row global lease code exists anywhere in current `origin/main`. Two counties can hold separate leases concurrently today. BUT the deeper claim in the map's "holes" section survives independently: `atom_did` (`src/stages/write/edges.mjs:9-19`, `did:hauska:<entityType>:<id>`) carries no `county_fips`, unlike `parcel_record`'s `place_key` (`{fips}:{prop_id}`), so the atoms table's *identity scheme*, not its lease, is genuinely not county-partitioned — a farm's local merge-back does need real reconciliation, for that reason. | 4 call sites read; edges.mjs read |
| 8 | P-194 | "not built" | Confirmed. No code anywhere implements two independently-derived counts that must agree at the *county completeness* level (distinct from the zoning-specific completeness machinery in row 0). | git grep, no hits beyond zoning |
| 9 | P-195 | "broken" | Confirmed by direct code trace, not just by citing the map — see the dedicated section below. This is the review's deepest and most consequential finding. | see below |
| 10 | P-196 | "exists; one label lie... OPS-23 F25" | Not independently re-verified beyond what OPS-24 itself already discloses; `F25` is a doc_repo finding id, not a code string, so it could not be grepped for directly. A related but distinct check exists in code (`src/stages/grade/s-rules.mjs` `gradeS2b`, asOf-vs-bakedAt distinctness) that does not itself prove F25 is fixed or unfixed. Treated as reported, matching the row's own honest framing. | light touch, flagged |
| 11 | P-197 | "exists (probe); meter not built" | Both halves confirmed, and the probe half needs a sharper statement than "exists": the file is real and its self-test is genuinely non-vacuous (run here, offline, fixtures only — exit 0, all checks pass in both directions). But its `ROWS` table has zero predicates for any of P-186 through P-198. The cost meter: zero code anywhere in `hauska-factory` or doc_repo for dollars/operator-minutes per county per stage. | self-test executed; grep for P-18x/P-19x rows, and for cost-meter code, both empty |
| 12 | P-198 | "not built" | Confirmed. Zero hits for "merge gate" or "merge back" as a concept anywhere in `hauska-factory` (the repo that would host it). | git grep, no hits |

## 2. The order

Section 3's sequence (teardown → gate → pre-bake audit → Burnet stages 3-12 → P-186 → farm/merge) does
not have a code dependency running the wrong direction: nothing in stages 3-5's *existing* code reads a
farm concept (stage 1 literally does not exist yet, so nothing can depend on it), and the gate
(stage 9) is a read at publish time, not a precondition wired into stages 3-5's writers. So the
sequencing claim — that a farm or a differently-fixed gate is not secretly load-bearing earlier — holds
on this read.

Where the order is more fragile than stated: **P-186's per-place declaration (section 3 step 5) is
scheduled to feed "the fixed gate,"** but the fixed gate (P-195) as scoped by its own row only closes
the total-absence hole in `evaluatePopulation`/`evaluatePublishGate`. Nothing in P-195's predicate
("a county with zero earned cells") mentions per-*place* granularity within a non-empty county — the
gate operates on rail cells across the whole county's `parcel_record` rows, not on the roster's list of
places. A county that is 40% present and 60% simply missing places (the Thrall shape the map's own
holes section names) is not "zero earned cells" and would not trip the fixed gate at all; it would need
P-186's declaration to catch it. So step 5 (P-186) is not merely *fed by* the fixed gate as the order
implies — it is doing independent, non-overlapping work the gate fix does not cover, and treating it as
a downstream consumer understates how much of the "no partial county ships" promise actually depends on
P-186 shipping too, not on P-195 alone.

## 3. The six laws — one violation each, with enforceability

| Law | One violation found, at source | Enforceable by |
|---|---|---|
| 1. Customer predicate is the definition of done | `scripts/surface-probe.mjs`'s `ROWS` has zero entries for P-186..P-198; `probe-close-gate.mjs`'s `GATED_ROW` regex (`scripts/enforcement/probe-close-gate.mjs:37`, `/^P-1(5[1-9]|6[0-7])$/`) does not match any OPS-24 row either. A lane could close P-195, P-197 or P-198 today citing no probe artifact and nothing would block the commit. | Person only, today. A hook and a ROWS table exist that do exactly this job for OPS-23 — the gap is that neither was extended, not that the mechanism is missing in kind. |
| 2. The gate is fixed before anything trusts it | `evaluatePopulation` (`publish-readiness-gate.mjs:216-300`) and `evaluatePublishGate` (`publish-gate.js:9-47`) both return `{ok:true}` on a totally empty county — see section 1 row 9 and the dedicated section below. | Currently: not enforced at all (no test proves the failure mode; P-181's own proposed fix is not yet landed). Could become a hook or a type-level invariant relatively cheaply — the fix P-181 proposes is a function-signature change plus one new refusal branch, not an architecture change. |
| 3. One county end to end before any farm | No violation found: stage 1 (farm) and stage 13/P-198 (merge) are both confirmed not built (rows 1, 12 above), so nothing can currently violate this by building a farm first — there is no farm code to build with. | N/A this snapshot; enforceable by a hook only once farm code exists to gate. |
| 4. Three operator stop points | `traffic-lease-gate.mjs` hooks the production-serving-store-write stop point. No hook anywhere in `.claude/hooks/` (10 files: `_git-repo-target`, `_override-log-target`, `authoritative-read`, `branch-guard`, `canon-divergence-run`, `canon-gate`, `dirty-tree-close-gate`, `dispatch-template-gate`, `probe-close-gate`, `traffic-lease-gate`) addresses "a new credential or secret mount" or "a ruling" — the other two stop points. | 1 of 3 is hook-enforced; 2 of 3 are person-only. |
| 5. Every stage meters itself | Zero code anywhere in `hauska-factory` or doc_repo computes or records dollars or operator-minutes per county per stage. Confirmed absent, matching the table's own "meter not built" for P-197 — but the law applies to *every* stage, and no stage has it, not just P-197. | Not enforceable today; nothing exists to enforce. |
| 6. Nothing measured once is state | The "94 assumption rows" figure (section 1 row 2) is the clean violation: it appears in three places (OPS-16 A-149, OPS-24's own stage table, the map) without a SHA or a recount, and does not reconcile against the documents it cites. The documents themselves are dated and SHA'd correctly at their own point of origin (P-181's registers each declare their `origin/main SHA` in their own frontmatter) — the violation is in the *propagation* of a derived number, not in the source documents. | Mechanically checkable (a script could recount the registers and diff against any restated total) but nothing does this today; person only. |

## 4. The four holes

- **Atoms not county-partitioned.** Real, one layer deeper than stated — see section 1 row 7. The
  map's framing ("ONE GLOBAL RESOURCE") is about the lease and does not survive; the underlying
  identity-scheme claim does survive. OPS-24 section 4 lists this hole but section 5 ("owed design
  items") only assigns "whether the atoms writer lease is per county or per farm" as owed — which,
  per this review's finding, is already answered (per county, confirmed in code) at the lease level;
  the actually-owed question is the *identity* reconciliation on merge-back, which section 5 does not
  separately name. OPS-24's treatment is therefore not sufficient: it owes the wrong sub-question.
- **Address points outside CAPCOG.** Confirmed at the code level that ingest is county-generic
  (`legacy-design-tools/lib/cad-ingest/src/address/ingest.ts` takes `countyFips` as a plain parameter,
  no hardcoded county list) — so this is a *data* gap (nobody has run the ingest for Burnet), not a
  *code* gap, which matters for how expensive it is to close. The specific "6 of 254 counties as of
  2026-08-08" count could not be re-verified read-only (it requires a live `txgio_address` row count,
  which this dispatch's read set does not authorize); the map already flags it "five weeks stale and
  must be re-verified," and by this review's date that staleness has grown by two more days on top of
  what the map itself measured. OPS-24's treatment (silence — it is not named as a stage-0 prerequisite
  anywhere in the thirteen rows) is hand-waving: if Burnet genuinely lacks address points, the Find-box
  path the whole program's "done looks like" (section 1, `surface-probe.mjs` with a real Burnet address)
  depends on would not resolve, and nothing in P-186 through P-198 currently owns fixing that.
- **No retract-by-run-id.** Confirmed real and total: zero hits for "retract" combined with "run" across
  all four product repos. OPS-24 does not name this as a row or a law at all — it appears only in the
  map's holes section and nowhere in the program document itself. Section 4 of OPS-24 lists it among
  "findings that shaped this" but no row absorbs it, unlike the other three holes which map onto
  specific rows (per-place → P-186, atoms → P-193, address points → implicitly P-189). This is a real
  gap in OPS-24's own bookkeeping, not just in the pipeline.
- **Per-place coverage has no rollup and no gate.** Same finding as section 1 row 0: the two states
  that would need to generalize (`DECLARED_COMPLETE`/`EXPLICITLY_HELD`) exist for zoning only. OPS-24's
  P-186 names this as its own predicate, so unlike the address-points hole, this one IS owned by a row
  — but the instrument column for that row does not yet implement what the predicate requires, which
  is a gap between the row's predicate and its own cited instruments, not an unowned gap.

## 5. What is missing

Cost metering: **nothing** — not a row, not a law with an instrument, a law (5) with zero code behind
it anywhere. Access policy per county and the calibration hook: **honestly named as owed, not hidden**
— OPS-24 section 5 and OPS-16's own A-149 amendment both say so explicitly in the source read for this
review (`90_operations/OPS-16_texas_market_plan_of_record.md:342`: "Owed design items, not rows: access
policy per county, the calibration hook, lease scope per county or per farm"). This review's only
addition is that the third of those three ("lease scope per county or per farm") is already answered
by the code (per county, confirmed) — so one of the three "owed" items is not actually still open;
the amendment overstates its own backlog by one item. Operator stop points: **a law (4), one-third
hook-enforced** (section 3 above).

**What Burnet will trip on that no row covers, found in this read:** the retract-by-run-id gap (no row
owns it) and the address-points gap (silent — no row names it as a stage-3 prerequisite even though the
map's own text calls it exactly that: "address-point ingest is a stage-3 prerequisite nobody had on the
list"). OPS-24's stage table does not correct this omission from the map; it inherited the map's
silence on it verbatim.

## 6. The Burnet choice

Sources check out for the parts this review can read. `_inbox/t6_cad_probe_48053.json`: CAD REST
reachable (`sample_query.ok: true`, `count: 50645`), ArcGIS FeatureServer responsive. The roster
(`_catalog/texas_roster_v1.json:1913-1945`) carries a StratMap download URL and cites the same probe as
its evidence. Multiple named places under Burnet appear in the roster (three GEOIDs plus a city entry
for Burnet city itself around lines 20765-24604). On the evidence this review could read, Burnet can at
least clear stage 3 (acquire) at the source-availability level; whether it clears stages 4-12 depends
on live-store facts (identity collapse rate, record instantiation, rail-writer coverage) this dispatch's
read set cannot check.

**The stated rationale overstates the geography, as a hypothesis-level correction (not sourced from a
repo artifact — flagged per DEV_PROCESS 3.2a as unquoted and therefore weaker than the file-cited
findings above).** OPS-24 section 1 says Burnet was "chosen because it borders the six and is in none of
them." By ordinary Texas county adjacency, Burnet directly borders Travis and Williamson — 2 of the CTX
six (Bastrop, Caldwell, Hays, McLennan, Travis, Williamson) — and does not directly border Bastrop,
Caldwell, Hays, or McLennan. "Borders the six" is true of 2 of 6, not 6 of 6. This does not disqualify
Burnet as a prototype — proximity to Travis/Williamson and CAPCOG-region data availability are still
real reasons — but the stated justification is more generous to itself than the geography supports, and
a genuinely more-adjacent seventh county (one bordering more of the six, e.g. Lee or Milam, unverified
here) might be the more honest "borders the six" prototype if that specific property is what the row
wants to optimize for. Given this review could not independently confirm those alternates' source
availability, this is offered as a question for the operator, not a substitute recommendation.

## Ranked findings, by what they would cost if acted on

1. **The gate's total-absence-passes defect is real and unfixed.** Building anything downstream of
   P-195 before this lands (per-place declarations, a farm's merge gate, the completeness check) is
   building on a control that currently cannot fail on the single worst case it exists to catch — a
   county with nothing acquired at all. Already scoped correctly by P-195's own row ("empty-county test
   built first"); this review's contribution is confirming the defect at source rather than trusting
   the row's characterization, and surfacing that the fix was already designed on 2026-09-13
   (P-181 entry 1) and simply has not landed.
2. **Law 1 has no live enforcement surface for this program.** Every other stage's "done" depends on a
   human remembering to wire its predicate into `surface-probe.mjs` and widen `probe-close-gate.mjs`'s
   regex. Given this program explicitly absorbs OPS-21's and OPS-23's unfinished work (section 6 of
   OPS-24), and OPS-23's own version of this exact gap (CTRL-1, a regex that silently excluded new
   rows) is the incident DEV_PROCESS 2.4 was written from, this is the same defect class recurring
   one plan-row-range later.
3. **The "94 assumption rows" figure does not reconcile, and its own paper trail already flagged it as
   unverified.** Low cost to fix (recount, correct, or explain the discrepancy) and it is the cleanest
   instance of Law 6 failing on the program's own numbers before the program has built anything.
4. **Two of OPS-24's four holes are unowned by any row** (retract-by-run-id entirely; the address-point
   stage-3 prerequisite implicitly, since the map already named it as one). A Burnet run could stall on
   either with no row whose job it is to notice.
5. **Owner/land-use/flood writers report a lease release they never took.** Smaller in scope than the
   gate defect but the same shape — a run record that reads as compliant while being unable to prove
   it, one layer removed from a store write rather than a gate read.
6. **The atoms-partitioning hole is correctly flagged but imprecisely explained.** Acting on the map's
   literal words ("fix the global lease") would not fix the real problem (identity reconciliation on
   merge-back); acting on OPS-24's owed-item list (section 5) would also miss it, since that list
   already treats the lease-scope question as open when it is not.

## What this teardown could not settle, and why

1. Whether `evaluatePublishGate`/`evaluatePopulation`'s empty-county pass is reachable end-to-end from
   a real publish run (vs. only demonstrated here as a pure-function trace) — would need to execute the
   orchestrating job (`publish-gate-sched.mjs` or the Bastrop/county publish entry point) against a
   store, which this dispatch's read-only, no-database bound does not permit.
2. Whether `parcel-owner.mjs`/`flood-ingest.mjs` genuinely throw on a second run under "the current
   lease" as the map states, versus some other failure mode — same live-execution limit.
3. The current, live `txgio_address` row count for Burnet (48053) and whether the 6-of-254 figure has
   moved since 2026-08-08 — needs a database read this dispatch does not authorize.
4. Whether `.claude/settings.json`'s hardcoded `P:/doc_repo/.claude/hooks/*` paths actually resolve
   correctly for a session rooted in a different seat worktree (this session's own seat, for instance)
   — observed as a fact (the paths are hardcoded to the integration seat) but not confirmed as a defect;
   plausibly a deliberate single-canonical-copy design. Flagged, not scored.
5. Whether a more-adjacent seventh county than Burnet exists with comparable source availability — this
   review checked Burnet's own sources but did not survey alternates.
6. The exact row count in the ldt assumption register: its four structural markers (`WHERE:`,
   `FAILURE MODE:`, `CONFIDENCE:`, `GUARDED:`) disagree with each other by 1-2 rows (30-32), so even
   this review's ~87 figure carries a small internal uncertainty band the underlying document itself
   should resolve, not infer from marker-counting.

## Which parts of OPS-24 and the map survive

| item | result | why |
|---|---|---|
| Stage table rows 1, 8, 12 ("not built": farm manifest, completeness check, merge gate) | survived | zero matching code anywhere; the table is not overclaiming |
| Stage table row 9 (gate "broken") | survived, deepened | confirmed by direct trace, not just citation; found the exact prior-art fix (P-181 entry 1) still unlanded |
| Stage table row 3 (P-178 vintage rule "exists") | survived | genuinely implemented with its own tests, not just declared |
| Stage table row 4 ("generalised" framing) | survived weaker than stated | the script is already mostly generic; less remaining work than implied |
| Stage table row 6 ("no lease") | survived, sharpened | confirmed, plus the false `lease_released:true` finding the table does not mention |
| Stage table row 7 ("ONE GLOBAL RESOURCE") | did not survive as worded | the lease is already county-scoped; the real hole is atom identity, one level deeper |
| Law 1 ("probe is the finish line") | did not survive for OPS-24 | true of the file, false of its current row coverage and its enforcement hook's regex range |
| "94 assumption rows" | did not survive | recounts to ~87 by two methods; already flagged unverified the day before it was restated as settled |
| Hole: atoms not partitioned | survived, relocated | real, but at the identity layer, not the lease layer the map names |
| Hole: retract-by-run-id | survived | confirmed absent everywhere, and confirmed unowned by any OPS-24 row |
| Hole: per-place gate | survived | real, and correctly owned by P-186, whose own instrument list does not yet implement it |
| Section 1's Burnet rationale ("borders the six") | did not survive precisely as worded | Burnet borders 2 of 6 directly; a hypothesis-level geographic correction, not source-quoted |
| Section 3's order (gate before farm, farm before merge) | survived | no code dependency runs backward; nothing exists yet to violate it |
| Owed-items list (section 5, access policy / calibration hook / lease scope) | survived at 2 of 3 | lease-scope-per-county is already answered by code, not actually still open |

## Leave behind

```
leave_behind:
  - item: evaluatePopulation/evaluatePublishGate return ok:true on a totally empty county (no roll,
      no records); P-181 entry 1 already proposes the fix (split declared-ahead-program-wide from
      zero-earned-cells-this-county); not yet landed at hauska-factory origin/main 84642360
    owner: property seat (hauska-factory), per P-195
    plan_row: P-195
  - item: surface-probe.mjs has zero ROWS entries for P-186..P-198; probe-close-gate.mjs's GATED_ROW
      regex (P-151..P-167) does not cover any OPS-24 row either -- Law 1 is unenforced for this program
    owner: integration seat / whichever seat owns the first OPS-24 build row
    plan_row: P-197, and the enforcement hook itself (no row currently owns extending it)
  - item: "94 assumption rows" does not reconcile against the three registers it cites (~87 by two
      counting methods); the receiving session already flagged the registers unverified on 2026-09-13
    owner: whoever owns P-188
    plan_row: P-188
  - item: retract-by-run-id has no code anywhere and no owning row (only appears in the map's holes
      section, absorbed by nothing in OPS-24's thirteen rows)
    owner: unassigned
    plan_row: none named; candidate P-193 or P-196
  - item: address-point ingest for a county outside the CAPCOG six is a real stage-3 prerequisite the
      map itself names but no OPS-24 row owns; Burnet's own txgio_address coverage is unverified as of
      this review (map's figure is from 2026-08-08, now over five weeks stale)
    owner: unassigned
    plan_row: none named; candidate P-189
  - item: parcel-owner.mjs and flood-ingest.mjs write lease_released:true unconditionally despite never
      acquiring a lease (success and failure paths both)
    owner: property seat (hauska-factory), per P-192
    plan_row: P-192
  - item: atoms hole is mis-described at the lease layer (already county-scoped, confirmed) but real at
      the atom_did identity layer (not county-prefixed); OPS-24 section 5's owed-item list should be
      corrected to name identity reconciliation, not lease scope
    owner: integration seat (doc edit) + property seat (hauska-factory, if a fix is designed)
    plan_row: P-193
  - item: Burnet's "borders the six" rationale is geographically imprecise (2 of 6 direct borders);
      worth a ruling on whether adjacency-to-all-six or adjacency-to-some-plus-data-availability is the
      actual criterion, since a different seventh county might score higher on the former
    owner: operator
    plan_row: none named
  - item: this review's own instruments were git show/grep against the five declared snapshots plus one
      offline self-test run; nothing here was verified by live execution against a store, and the six
      items in "what this teardown could not settle" name exactly where that limit bit
    owner: none
    plan_row: none
```
