---
id: 2026-08-30_ctx_remainder_deep_review
title: Adversarial review — CTX remainder card, W1 bake card, Rainmaker wiring recon
date: 2026-08-30
status: filed
plan_row: F-05, F-06, F-08
reviewer: doc_repo planner (review seat; not integration, not property)
related:
  - _inbox/2026-08-30_ctx_facts_complete_WDLL.md
  - _inbox/2026-08-30_ctx_w1_bake_WDLL.md
  - _inbox/2026-08-30_rainmaker_open_complete_recon.md
  - _decisions/2026-08-30_ctx_facts_complete_waves.md
  - _decisions/2026-08-29_ctx_open_situs_join_not_prop_id.md
  - 90_operations/OPS-19_factory_plan_of_record.md
---

# 1. Snapshot and method

Repository `P:/doc_repo`, branch `main`, commit `c24ba66`. I am the review seat.
I did not write `_state/property/STATE.md`, did not amend either card, did not
commit, bake, publish, or dispatch. This file is the only write.

The two cards, both decisions, all three W0 artifacts, the recount instrument and
the recon were read at `c24ba66`. Product code was read by ref, not from the
working trees: `legacy-design-tools` at `origin/main` `cfea2b6d`, `hauska-map` at
`origin/main` `b6b00d1`, `hauska-factory` at `origin/main`. This matters. The
checkouts on this machine are `feat/s1-instrument-hardening` (206 behind) and
`fix/p35-vercel-token-preflight` (236 behind); neither contains the conformant
bake at all. A review run against those trees would have returned confident
wrong answers.

Probed live, anonymous, 14:02-14:23Z: facets for `48021:8720522`, `48021:34137`,
`48453:231086`, `48453:493738`, with response headers. Store re-measured
read-only on Neon `cortex-prod`, database `hauska_mcp`, schema `public`, on an
index-only predicate with self-tests in both directions.

Not probed, and why: no county-wide atoms scan (a 90 s `LIKE` scan already timed
out once; a global footprint count did time out here and is recorded
`unmeasured`, never 0). PE brief words were graded from code and the existing
probe, not from a fresh browser session. One store read that would upgrade the
A-025 finding from two converging routes to three is named in section 3 and was
not run.

Six review subagents fanned; all read-only; none committed; I read their
artifacts. Two required a logged `CANON_OVERRIDE` / `DISPATCH_OVERRIDE` because
the canon gate correctly read a product-repo brief as a dispatch.

**Incident, self-reported.** My instruction to run the recount instrument's
`--self-test` truncated `_inbox/2026-08-30_ctx_w0_residue_recount.json` from
5,124 to 879 bytes. The file is untracked, so there was no git recovery. It was
restored and I verified the restoration byte-for-byte against my own pre-agent
read: all six counties, `liveStatus: measured`, identical values and key order,
`sha256:b3353b9677d4efbc1372d20ee2084766185bbaf5771f469a238fab38ad8c2c5f`. A
verified copy is held outside the repo. The mechanism is finding F-01 below and
is not my error alone: the instrument writes its report from module top level.

---

# 2. Parent card, item by item

| # | Item | Grade | Evidence |
|---|---|---|---|
| 1 | Ruling recorded | **met** | Decision exists and says one rebake, seed stays, P-80 after the split. Defect: untracked (§3.8) |
| 2 | W0 recount | **overclaimed** | Card requires "snapshot (commit, host, time)". `docRepoCommit` is a string literal, false; host absent; self-tests certify a code path that produced none of the numbers |
| 3 | W0 PE probe | **partial, wrong cause** | Grade is right. Stated reason ("not customer-done on the live surface") is wrong: it is a missing change, not a deploy lag |
| 4 | Point source named | **partial** | The ordered list omits `txgio_address`, and no source addresses the 58,461 wrong-parcel centroids |
| 5 | Tax-year rule | **partial** | Rule is correctly scoped. The defect it names is understated: arbitrary-wins, not last-wins |
| 6 | W1 LDT bake | **ungraded, scope wrong** | Reverses a locked design decision across three consumers; landUse absent from it |
| 7 | W1 Factory walk point | **ungraded, hole** | The "sibling card" it defers to does not exist |
| 8 | W2 or drop | **ungraded** | Correctly parked |
| 9 | Wave R | **ungraded, underspecified** | Omits two A-021 preconditions: refusal fixtures green, per-county GRADE LOG record |
| 10 | Post-R grade | **ungraded** | Re-runs the item-2 instrument, inheriting its defects |
| A1 | Amendment 1 | **met** | Situs is FIPS-gated out of 48453 in code; the class has genuinely had no situs attempt |

Pre-H 534,700 is **not** quoted as the live remainder anywhere. It is correctly
labelled and used only as a subtrahend, and the subtraction is genuinely
like-for-like (identical predicate). That is a pass.

**Item 2 detail.** The numbers are almost certainly right and all arithmetic
reconciles — every county, every totals key, and `recovered_from_H: 301930`.
What fails is that the instrument does not establish them. `--self-test` and a
bare `import` both destroy the artifact; a failed `--live` overwrites a good
measurement with an `unmeasured` stub. JSON key order proves the artifact was
not emitted by this source (the code returns `{liveStatus, counties,
rawLineCount}` and appends; the file has `totals` and `reading` *before*
`rawLineCount`, which that code path cannot produce) — confirmed independently
against my own pre-agent read. The six self-tests grade `classifyBody`/`tally`,
which the live path never calls; it shells to psql. The suite has already
drifted from the SQL. Mutation testing killed 4 of 7 mutants: making
`unstamped_sentinel` a pure alias survives, deleting the SQL's unstamped clauses
survives, and deleting an assertion still reports `tests: 6`. The SQL does not
filter on `publishRunId` and nothing compares the runs found to `CARD_H_RUNS`.
Every join number rests on `provenance.parcelJoin.state`, the bake's own label;
the 2026-08-29 decision names `ownersAgree` as *the* second derivation and makes
an owner-agree sample its reversal criterion, and the instrument never reads it.

**A number the card does not carry.** `rows_total - conformant` = **18,100** CAD
rows with no conformant row, Bastrop 16,104 (20.7% of the county). No join state
in the card's four-value vocabulary describes them. They are absent from item
2's grade line, and `stamped` is counted unfiltered against them while joins are
conformant-filtered.

---

# 3. Alignment gaps

## 3.1 landUse is in no acceptance item — and it is a live A-025 violation

**Verdict: card is wrong. Blocking.**

A-025(1) verbatim requires the conformant bake to project "the CAD claim fields,
the zoning stamp join, the derived envelope, **land use**, acreage, structural
where present) **or writes an explicit absent-verified per facet, never an
omitted key**."

Served live on both Bastrop parcels, card H run `e2c5c6d7`:

```
baseFacts.landUse:                  null      (key present)
facetCoverage.landUse:              false
provenance.landUseSource:           null
provenance.landUseGateBlocked:      false     <- hardcoded, dead signal
provenance.landUseAddressRecovered: false
zoning.district:                    PDD / SF-1
```

`null + coverage:false` is not absent-verified. BP-ABSENCE-01 defines the pair as
`evaluated:true` plus a non-empty `provenanceScope`; `19_the_instrument_contract.md`
requires verdict, authority, scopeSearched, asOf, basis. A boolean is precisely
the "boolean default" sentinel ENFORCEMENT forbids.

And it is worse than unmeasured-presented-as-absent. It is **present-presented-as-absent**.
Three independent derivations say the value exists: the land-use atom (A1, entity
`…:2025`, evaluated 2026-08-12, re-measured this session), the CAD roll
(`property_use_code = A1`, re-measured), and PE itself, which is rendering
`zoneChip: "A1 — A1"` off that same wire right now. The bake says absent.

Mechanism, confirmed in code: the conformant bake reads land use **only** from
`claim.propertyUseCode`; the old bake joins `cad_property`. Different upstreams.
The second mechanism I considered — a lookup table with no A1 entry — is rejected
because the emitted `landUseSource` is null rather than an unmatched-code marker,
and because `landUseGateBlocked` is hardcoded `false` at `:366` even for
48209/48491, so the override signal is dead and cannot be the discriminator.

One store read would make this three converging routes instead of two: whether
`claim.propertyUseCode` is null on these atoms while `cad_property` carries A1.
It was not run. The verdict does not depend on it — route 1 (the absent-verified
definition) is unconditional.

**The recon says "fold the bake miss into W1." The W1 card's four acceptance
items are situs-extend, seed, tax year, handback. LandUse is in none of them.
Parent item 6 does not name it either.** It exists only in untracked recon prose.
Smallest lock: amend W1 with a fifth acceptance item before W1 starts.

## 3.2 The control that would catch it cannot fail

**Verdict: both incomplete. Blocking.**

A-025(2) requires the walk to grade content: each facet key "present **or
explicitly absent-verified**". The walk implements the first half only.
`BP-CONTENT-01` filters the 28 required paths through `hasKeyPath`, whose own
docstring states the value "may be null". `landUse` **is** in the required list.
The walk's own `--self-test` asserts that an **all-null payload passes**.

That last point is the ENFORCEMENT violation that matters most: a test asserting
a value no external authority recognises converts a defect into a specification
and makes the fix read as a regression. All six counties passed BP-CONTENT-01
vacuously with respect to absent-verified. Wave R will pass it again.

A second layer is starved: the test that checks the walk's mirrored path list
against the LDT source resolves by filesystem path, not by ref, and skips in CI
by its own admission ("CI runs without the LDT checkout"). Locally it would read
whichever branch a seat left checked out. Nothing counts the skips.

## 3.3 Item 3 and wiring items 1-3 are the same defect class with no owner

**Verdict: both incomplete. Blocking for customer-done, not for Wave R.**

There is no PE wiring WDLL, no hauska-map owner card, and no plan row. Track D
confirms no F-row covers PE copy. Work that cannot name a plan row is not scoped.

The probe's diagnosis is wrong in a way that would misroute an executor. PR #310
**is** merged (`1a00b27`, four commits behind tip). Its only production change
widens a type union and a validator array in `src/lib/layer-absence.ts` — no copy,
no component. `stamp-missing` exists at `origin/main` in three files: that one and
two test files. Zero PE copy. The BFF then drops the token: `api/_lib/verdict-layer-merge.ts:5`
keeps a private union (`absent-verified | lookup-failed | not-applicable`) that
#310 never widened, so `layerAbsenceFromRecord` returns `null` for anything else.
#310 is a starved mechanism. Customer-visible text comes from an untouched third
function, `fact-sheet-resolver.ts` `zoningFact()`, whose `declineReason` map never
inspects a verdict and whose string "this area is not zoned or not stamped" is
verbatim the probe's Laird label. **Redeploying `b6b00d1` would change nothing.**

Two corrections to the recon that would otherwise send an executor to the wrong
file:

- The grey box does **not** key on envelope nullity. It keys on per-row
  `absent-uncovered` ∩ `inCoverageBlock` over `landUse`/`zoning`/`setbacks`,
  with `buildable` explicitly excluded. The defect is scope: a per-parcel row
  state printed as "in this area".
- "PE lies about a value it has" does not hold. PE refuses cortex zoning **by
  design** (`atom-chain-to-facets.ts:1201`, anti-zombie). Copy alone will not
  surface PDD. Whether that refusal should lift for a stamped district is a
  design decision, not a wording fix.

**The string is half honest and must not be fixed as a unit.** "Not stamped in
this area" is false. "Setbacks" is *true* — Rainmaker genuinely has no setback
row (§4). Replacing the whole string would trade a half-lie for a whole lie.

## 3.4 Is Wave R customer-done without the PE card

**Verdict: no, and the card already says so.** "Done looks like" names PE words
on the six. If only the LDT bake ships, the grey box still fires on Rainmaker and
Pine after Wave R. Code-done is not customer-done.

The mold already names the missing control and nobody has built it. Gate 8
(SMOKE) is explicitly **not mechanical** — "the 'is the data true and available
in the app' benchmark that killed the scan-fix loop" — and its seed is written
down: a deployed-bundle marker check (fetch index, fetch bundle, assert a
change-marker string), which "catches the Vercel no-auto-deploy trap
mechanically." hauska-map has no build marker and no working deploy trigger (its
only prod-deploy workflow fires on its own file changing). That is the check the
PE acceptance item needs, and it is specified in canon already.

## 3.5 The Laird `A1 — A1` chip is a second card, not item 3

**Verdict: recon incomplete.** Two defects, two files, two triggers.
`inspectHighLevelLabel` returns the literal `"Zone"` for `landUse` while the real
Zoning row is collapsed. Separately, `"A1 — A1"` is minted **inside PE** by
`description: landUseLabel ?? landUseCode` — a defaulted field, ENFORCEMENT's
named prohibition — and then rendered again as a second datum at
`sheet-to-card-model.ts:526`. Three PE renderers of that one field disagree.
Neither fix reveals the other's failure, so one acceptance item cannot cover both.

## 3.6 Factory point index (item 7) is a hole, not a sibling

**Verdict: card is wrong.** Item 7 defers to a sibling card that does not exist.
Either cut it or fold it, but it cannot stay a deferral to nothing.

## 3.7 W3 rails vs the Rainmaker ring

**Verdict: recon is wrong, and the constraint people fear is not the binding one.**

On the rule: TxGIO-derived edges **fulfil** P-53 and P-91 rather than violating
them. P-53's ban is read-time; it explicitly permits `provenance.kind=gis-approximate`
as write-time honesty on the atom. `chainAnchoring: backfill` was ratified
2026-08-23 for exactly this batch depth-warm case. Four Bastrop parcels already
serve such edges with provenance naming the county parcel ring. "Do not invent
one" means serializer fabrication at read time, not a provenanced writer.

On the plan: the recon's proposed fix **cannot run** (§4). This is a writer, it is
W3, and it must not be called wiring. It also must not be scheduled until the
refusal gate is dealt with, or it will ship and write nothing.

## 3.8 The whole program is untracked

**Verdict: both incomplete. Blocking for canon, not for execution.**

Untracked: both decisions, the parent card, the W1 card, all three W0 artifacts,
the recount instrument, the PE probe, the recon, and `_scratch/ctx-quality.md`.
ENFORCEMENT: "Anything cited by tracked canon must itself be tracked. Cited and
untracked is the worst state."

**A-026 is not committed** — `git show HEAD:…OPS-19… | grep -c '^| A-026'`
returns 0. It exists only in the dirty worktree. Three cards cite it as authority.

**Card H has zero GRADE LOG rows.** None dated 2026-08-30, none for card G or H
at all. Eighteen rows exist for card F. The waves decision "depends on card H
production closes" whose only record is an untracked scratch file. A-021 requires
the planner to record the revision, run id and freshness stamp per county in that
log. For card H that was not done.

## 3.9 Smaller misalignments, all confirmed

- Parent Waves prose permits the `geo_id` join its own Amendment 1 forbids, and
  mis-cites "item 1" where it means item 2.
- W1 extends situs recovery to three counties with **no measured owner-agree
  rate**, against a decision scoped to two and whose reversal criterion is an
  owner-agree sample.
- "Staging concurrent, production serial" is A-024(4), not A-021.
- P-80 belongs to F-10 per OPS-16 A-043 but is carded under F-05/06/08.
- Duplicate A-017 row in HEAD.
- Recon `leave_behind: none` is false: its own Sequence schedules three unowned
  PE items two paragraphs earlier. The parent's Finish card is `(ungraded)` with
  no declaration at all.
- **"Facts complete" appears in no plan, mold, or contract.** It is invented, and
  it reads as county-complete. The mold's §1b lists roads and boundary edges as
  layers a complete county contains and §1c lists land use. Rename to **"CTX
  tier-1 facet integrity (six counties)"** with an explicit not-county-complete
  line. The recon exists because this exact confusion already cost a session.

## 3.10 Gate quality

Against ENFORCEMENT's three-question gate, the parent scores **0 gate-complete,
3 gate-partial, 7 no-gate** — items 7, 8 and 10 are pure "a PR citing item N" or
"a file exists". W1 scores **3 gate-complete, 1 no-gate** and is materially better
engineered than its parent.

---

# 4. The recon's mechanisms

**Mechanism 1 (three stores, one screen): accepted but incomplete.** Every factual
claim I could test independently is confirmed, none refuted — footprint 48021 = 0,
well-fact = 0, edges 26,846 on 3,732 distinct prop_ids, Rainmaker 0, Pine 4,
land-use atom A1 on both, `cad_property` rows byte-exact, depth-warm parcels
27943/32243/33223/35073 present and 82112/36249 absent. The factual base is sound.

**Mechanism 2 (card H wiped it): stays rejected.** I could not reopen it, and the
recon is exonerated on better evidence than it used. Its own Pine counter is weak
— a hand-made 5-digit fixture id against Rainmaker's 7-digit is the worst possible
control for a width-sensitive key break. The real kill is card H's WDLL grade 5,
`addressJoinKey null for 48021/…`: FIPS-scoped out of Bastrop, proved by fixture,
five files all in the bake, zero writers.

## Mechanism 3, which the recon did not state and which changes the plan

**Boundary-edge absence is not an independent store. It is downstream of the
setback refusal.**

`_inbox/2026-08-08_D4_bastrop_dry_postfork_refused_roster.json`, `event:
R4-depth-refused-roster`, `refusedCount: 3747`, dated **21 days before card H**,
contains `{"parcelNodeId": "48021:8720522", "reason": "no-setback-row"}` — and
its entire plat, 8720515 through 8720529 unbroken. The writer
(`emitBoundaryEdgesFromWarmCandidate`, adapter `depth-warm-verify-promote`) sits
behind that same gate. Discriminator holds 8 of 8: three refused parcels carry
zero edges, four non-refused carry depth-warm edges. Pine is the sole exception
*because* `descriptor-fixture` bypasses the gate entirely.

Consequences:

1. One cause, three surfaces — edges, envelope, "setbacks unruled" — not three
   independent gaps.
2. The recon's Sequence line ("depth-warm can write edges from the TxGIO ring")
   **would run and write nothing** for 3,747 Bastrop parcels.
3. The grey box's "setbacks" half is true, and true *for this reason*.

## The third denominator

The operator's memory is anchored to something real that the recon never found.
`_catalog/bastrop_downtown_drill_test_area.json` carries `"cert_scope":
"rendered-set-r14"` — 39 parcels on six downtown streets, audit verdict **"PASS
(36/36 PASS, 0/36 FAIL)"**, "Grade EVERY parcel", "RULING R3/R14", every row with
a filled setback triple. A genuine 14-rail certification passed. Rainmaker: zero
hits. That is 0.046% of the county, and the scope never travelled with the claim.
(A fourth exists: OPS-19 line 140, "Bastrop's staging sibling is complete", a
232-parcel walk on the same downtown streets.)

This does not make Rainmaker certified. It makes the recollection honest, and it
means "Bastrop was complete" has four different denominators in the record, none
of them per-parcel county-wide.

## Two further wire findings the recon did not report

**The schema version does not move when the shape moves.** All four probed
parcels declare `node-facets-tier1-conformant-v1` while Bastrop and Travis emit
incompatible bodies: `facets.zoning.district` and `structuralFact.yearBuilt` are
`undefined` on every Travis parcel, and Travis adds `facets.livingAreaSqft` that
Bastrop lacks. **The PE card, written and tested on Bastrop, will silently render
blank on Travis.** This also explains the walk pass: `zoning` is a required path
but `zoning.district` is not, and `structuralFact` is not in the 28 at all.

**`absent-verified` is stamped with the request clock.** Two Laird reads 113 s
apart differed in exactly three leaves, all `asOf`, while `bakedAt` held at
03:16Z. An eleven-hour-old bake serves a "verified absence" timestamped now, with
a `basis` string character-identical across two different parcels. A field that
always contains the same string is a ceremony, not a justification. This weakens
every `absent-verified` in the system — including the escape hatch A-025 offers.

Also: `tier2.floodDisposition: refused / no-flood-facet` sits in the same body as
`floodHazardFact: present / Zone X`; the recon flattened these to one row. And
**71% of Bastrop's edges are `descriptor-fixture`** — 19,159 of 26,846, including
the Pine ring the entire Open grade rests on; the production writer accounts for
1,671 parcels; **426 parcels carry edges from both adapters at different
indices**, two conflicting geometries both served.

---

# 5. The finding that most changes the plan

**~58,461 Hays and Williamson parcels serve a query point the conformant bake
never computed, derived from the join the seed exists to forbid. A re-bake will
not clear it.**

Situs-recovered rows *do* carry geometry through a shared `parcelSelectList`,
so parent item 6's premise is right: extending situs to Travis does recover
points. The recount proves it — on all four non-blocked counties `no-row ===
point_sentinel` **exactly** (15,542 / 23,660 / 0 / 119,389).

The blocked counties invert. Hays: 41,619 gate-blocked, only 13,971 sentinels.
Williamson: 91,021 and 60,208. The difference is **58,461 parcels that serve a
non-zero coordinate**, preserved by the upsert's `CASE WHEN EXCLUDED = 0,0 THEN
keep prior` at `:352-359` — inherited from the **old** bake, which keyed on the
fabricating TxGIO↔CAD collision. The payload honestly says `gate-blocked`. The
served `queryPoint` is a wrong-parcel centroid. `usableCityLimitsQueryPoint`
refuses only exact 0,0.

This is the seed's own fabrication surviving the seed, in a different field, and
a 0,0 is *safer* than this because 0,0 is detectable. It reframes my own earlier
arithmetic: of 132,640 gate-blocked parcels, 74,179 refuse honestly and 58,461
lie plausibly.

It needs its own card. Wave R does not fix it.

Two further code facts that bear on W1's scope:

- **W1 reverses a locked design decision, it does not extend one.**
  `joinNormalize.ts:180` is `if (!blockedFips.has(countyFips)) return null;`.
  Four call sites in three layers; the CLI's situs and prop_id branches are
  mutually exclusive (`:217-246`, `:285`), so a second pass must be built. And
  `addressJoinKey` has **three** production consumers — the conformant bake, the
  old bake, and `parcelsPmtilesBakeCli` — so editing it silently changes the map
  tiles. Existing tests name 48021/48055/48453 individually as null.
- **Tax-year selection is arbitrary-wins, not last-wins.** `SELECT … FROM atoms`
  has no `ORDER BY` at `:187`, so the winner is non-deterministic per re-bake;
  roughly 373k Travis writes were overwritten in one run. Two bakes of identical
  input produce different bodies. The W0 rule is otherwise correctly scoped —
  `taxYear` is read as an integer and all years already load.
- **W1 can deliver zero and report clean.** `fetchCountyLandUseByAddress` returns
  an empty-but-truthy map; if `tryResolveDeclaredCadVintage` misses for 48453,
  the recovery silently does nothing and the run looks successful. Other
  fail-opens: a default county `?? "48021"`, and `joinTable ?? "txgio_parcel"`
  naming a table that is not queried.

---

# 6. The pre-publish scrub

The operator's requirement is that this pass be the last one. The honest version
of that: a scrub cannot guarantee no further bake, and I will not claim it does.
Staging bakes are cheap; the expensive, visible thing is a production publish.
What is achievable is that **no body reaches production that a scrub has not
cleared**, and that every defect class in this review is caught before a customer
sees it. A scrub failure at staging is a staging rebake — that is the outcome
being bought, not the one being avoided.

Two structural rules decide whether it is real.

**It extends the walk; it does not sit beside it.** A-021 already requires a
passed staging walk before any production publish. That is a live trigger already
gating the thing that matters. A separate scrub script would be a fifth dormant
mechanism — this review found four (BP-CONTENT-01 passing on null, #310 starved
at the BFF, the LDT divergence test skipping in CI, the recount self-tests
grading dead code). The scrub must be new **grades in the walk's grade set**, so
a failure blocks production through machinery that already runs.

**Every check needs two independently derived inputs.** A presence check has one
input and a sentinel satisfies it; that is exactly how `landUse: null` shipped.
The test for each check: could one upstream, acting alone, satisfy both sides? If
yes it is internal consistency, and it catches transcription errors, not wrong
sources.

| | Family | Second derivation | Population | Motivating finding |
|---|---|---|---|---|
| S1 | Sentinel sweep — `", ,"`, `", TX 78660"`, `0,0`, `UNKNOWN`, `1900`, `A1 — A1` | real vs non-null coverage, reported separately per field | 100% SQL | situs "99.3% populated" counted sentinels |
| S2 | Three-state audit — every null carries verdict + authority + scopeSearched + `asOf` + basis, or it fails | the null vs its provenance record | 100% SQL | §3.1 landUse; A-025's escape hatch |
| S2b | Absence integrity — `asOf` must be evaluation time, never the request clock; `basis` must vary per parcel | `asOf` vs `bakedAt`; basis cardinality across parcels | 100% | §4 Laird 113 s drift, identical basis |
| S3 | Cross-source agreement — landUse (CAD / atom / TxGIO), yearBuilt (CAD vs listing), acreage (CAD vs shoelace) | 3-way; disagreement refuses and records, never picks | 100% SQL | Driftwood 2021 vs 2022; §3.1 |
| S4 | Binding integrity — the served query point must fall **inside** the bound ring (`ST_Contains`) | geometry vs join label | 100% PostGIS, zone-major | §5, 58,461 wrong-parcel centroids |
| S5 | **Refusal reconciliation** — every upstream-refused parcel's served body must name *that* refusal | refused roster vs served facet reason | 100% join | §4, the 3,747 roster |
| S6 | Serve-path divergence — facets vs `get_smart_site` vs PE vs MCP, same node, same run | reader A vs reader B; vocabulary may differ, **state may not** | area sweep | two readers disagree on 48021:8720522 |
| S7 | Ledger vs served truth — a rail scored 0% while serving live is a ledger defect | ledger cell vs live probe | per rail | `landuse 98.26` vs served null |
| S8 | Provenance completeness — no value without source and timestamp | value vs source | 100% SQL | quality-gate rule |
| S9 | Unit and frame — plausibility bands per field | declared unit vs value range | 100% SQL | `152.4 m` in a feet frame |
| S10 | Identifier hygiene — `jurisdictionKey_` vs `city-key`, id arity, prop_id width | key form vs registry | 100% SQL | 5- vs 7-digit width sensitivity |
| S11 | Schema-version fidelity — the version must change when the leaf set changes | cross-county shape diff at one version | per publish | Travis blanks where Bastrop renders |
| S12 | Adapter conflict — one parcel, two adapters, different geometry must refuse or resolve | adapter A vs adapter B | 100% SQL | 426 Bastrop parcels |

**S4 and S5 are the two that most need building, and S5 is the one nobody had.**
The 3,747-parcel refused roster is invisible to the bake; that is precisely why
Rainmaker serves "not stamped in this area" instead of "no setback row for this
district." S1, S2, S8, S9, S10 and S12 are set-based SQL and can run over 100% of
rows immediately.

**Sampling.** Full population for anything expressible in SQL. **Area sweep, not
random sample**, for the HTTP-bound checks, with the hard classes forced into the
sweep rather than left to chance: the refused roster, the gate-blocked set, the
no-row set, PDD and overlay parcels, 5-digit *and* 7-digit ids, parcels carrying
two tax years, unincorporated parcels, and the 18,100 CAD rows with no conformant
row. Random sampling certified a broken Bastrop once.

**Proving each check.** Before any family is trusted it runs against a
deliberately poisoned row of its own class and must fail, **and** against a
known-good row and must pass. Both directions are required, not one. A reviewer
this session nearly refuted a correct finding because a "widened" range bound
appended `0`, which *narrows* under C collation (`:` = 0x3A > `0` = 0x30); only
the positive control caught it. A check observed only passing has not been
observed working, and a check observed only failing may be broken in the other
direction.

**Determinism gate.** Because tax-year selection is currently arbitrary-wins,
bake the same county twice on the same input and diff the bodies. A non-empty
diff means no divergence test between old and new snapshots can be trusted, and
that must be closed before Wave R rather than after.

---

# 7. Sequence lock

**Start W1 now, or block?** — **Block, then start.** Two amendments first, both
small: add landUse projection as a fifth W1 acceptance item (§3.1), and add a
non-vacuous recovery-count item so W1 cannot deliver zero and report clean (§5).
Also re-scope item 1's language from "extend" to "reverse a locked decision", and
name `parcelsPmtilesBakeCli` as blast radius. W1 is otherwise the better-built of
the two cards and should proceed immediately after.

**PE wiring card before W1, in parallel, or after Wave R?** — **In parallel,
starting now**, as its own card with a plan row it does not currently have. Not
one card: PE copy scope, the `"Zone"` label, the `A1 — A1` default, and yearBuilt
are four items across three files. Its acceptance check is a live brief plus a
deployed-bundle marker, never a merged PR — #310 proves a merged PR here means
nothing. Do not fix the grey box as a single string; the setbacks half is true.

**Is Wave R allowed while PE still says "not stamped"?** — **Wave R is allowed;
"facts complete" is not.** They are different claims. Wave R may publish under
A-021 once W1 lands, provided item 9 adds the two preconditions it omits
(refusal fixtures green, per-county GRADE LOG record). But the card's own "done
looks like" names PE words, so the *card* cannot close on Wave R alone. Publish
if you want the landUse fix served; do not call it done.

**Is P-80 still parked?** — **Yes.** Amendment 1 is correct and confirmed in
code: situs is FIPS-gated out of 48453, so that class has genuinely had no
attempt. Do not code it inside W1. It also belongs to F-10, not F-05/06/08.

**Does one rebake still hold after adding landUse and PE?** — **Yes for landUse
and PE. No for the whole remainder.** PE is not a bake input. LandUse rides the
same W1 pin. But §5's 58,461 wrong-parcel centroids are *not* cleared by a
rebake — the upsert preserves them — so a second, targeted write is required
whenever that card is cut. Say that now rather than discovering it after Wave R
and calling it a regression.

**Ordering.** Amend W1 (landUse + non-vacuous recovery) and cut the PE card in
parallel → W1 lands and pins → determinism gate → S1/S2/S2b/S8/S9/S10/S12 over
100% of rows → six staging bakes → S4/S5/S6/S7/S11 on the staging bodies → Wave R
under A-021 → post-R recount on a repaired instrument. The centroid card and the
W3 refusal-gate work run outside this line and do not block it.

**Two things to do before any of it, both cheap.** Track and commit the program
(§3.8) — nine artifacts and A-026 currently exist only in a dirty worktree, and
card H has no GRADE LOG row. And rename "facts complete" to something that does
not read as county-complete.

---

# 8. Close

The recon's factual base is sound and survived independent re-measurement. Its
sequencing is not: it schedules a writer that cannot run, hands off four items it
declares as no leave-behind, and mis-locates two of the four defects it names.
The parent card overclaims item 2 and under-scopes item 6. The W1 card is the
best-engineered artifact in the set and is still missing the one item the recon
says belongs to it.

Nothing here requires a second CTX bake to "restore Bastrop." Bastrop was never
complete in the sense the screenshot implies; it was certified on 39 downtown
parcels, and Rainmaker's empty lines are one upstream setback refusal, not a
regression.

```
leave_behind:
  - item: PE wiring card (copy scope, "Zone" label, A1 — A1 default, yearBuilt with source)
    owner: unassigned — needs a hauska-map owner and a plan row
    plan_row: none exists; request one under F-06 or a new row
  - item: gate-blocked wrong-parcel centroid clear (~58,461 Hays/Williamson)
    owner: property seat
    plan_row: request under F-06; not fixed by Wave R
  - item: BP-CONTENT-01 absent-verified predicate + all-null-passes self-test
    owner: Factory seat
    plan_row: F-08
  - item: recount instrument repair (write guard, run-time commit, host, publishRunId assert, ownersAgree column)
    owner: integration seat
    plan_row: F-05
  - item: depth-warm refusal gate vs edge writer (3,747 Bastrop parcels)
    owner: property seat
    plan_row: W3 / F-11, not this card
  - item: track and commit the nine untracked program artifacts, A-026, and a card H GRADE LOG row
    owner: planner
    plan_row: F-05
```
