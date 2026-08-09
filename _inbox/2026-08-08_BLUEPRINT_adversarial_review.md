---
id: 2026-08-08_BLUEPRINT_adversarial_review
title: Adversarial review - the Blueprint program plan
date: 2026-08-08
status: active
owner: nick
related: [_inbox/2026-08-08_BLUEPRINT_program_plan, _inbox/2026-08-08_PROBE_from_scratch_feasibility, _inbox/2026-08-08_PROBE_profile_hot_path, _inbox/2026-08-08_LEDGER_schema_audit, _inbox/2026-08-08_MEMORY_system_audit, _inbox/2026-08-08_BLUEPRINT_doc_inventory, _decisions/2026-08-08_county_shape_thirteen_rails_and_geometry_first]
---

# Adversarial review - 2026-08-08 Blueprint program plan

Read-only. Target: `_inbox/2026-08-08_BLUEPRINT_program_plan.md`. Every evidence doc was read independently and every load-bearing number was recomputed from the primary artifact rather than accepted from the plan's summary. Code citations were resolved against live source in `P:\hauska-engine` and `P:\legacy-design-tools`.

Bottom line up front: the plan's diagnosis is largely sound and its citations are unusually clean. Its **conclusions do not follow from its own evidence** on the two things that matter most - whether the throughput work reaches statewide scale, and whether the plan's sequencing serves the operator's stated goal. It also carries one internally contradictory pair of numbers, one denominator substitution that inflates a headline speedup, and it is silent on a live half-mutated production store.

---

## SEVERITY 1 - The plan does not say, plainly, that it cannot deliver the operator's stated goal

**CLAIM under attack.** The plan is offered as the answer to "I want Texas finished within 48 hours... we need to engineer this so that happens" and "I need Texas complete and to market in a fully mature 100% complete and functional form."

**EVIDENCE.** Compute it from the plan's own numbers. Rail C parcel count from `_catalog/texas_roster_v1.json`, summed independently this session across all 254 `identity.parcel_count_est` fields: **13,360,496** (the plan's figure is correct). At the plan's own Phase 3 measured rate of 141.975 ms/parcel:

```
13,360,496 x 141.975 ms = 1,896,856,420 ms
                        = 526.9 hours
                        = 21.95 days   (single-threaded, no write path)
```

At the unoptimized 522 ms baseline it is **80.7 days**. To land 13.36 M parcels inside 48 hours single-threaded requires **12.93 ms/parcel** - a 40x improvement on the current pipeline and a further 11x on the *already-optimized* bulk pass. Put the other way: at 141.975 ms/parcel it takes roughly **11-way sustained parallelism** to fit 48 hours, before any write cost, before verification, and before the other twelve rails.

And the plan concedes the write path is unmeasured (`program_plan.md:74`): "The 141.98 ms excludes write-then-verify and promote. No Texas throughput figure is claimable until a bulk pass WITH the write path is measured." The probe agrees (`PROBE_from_scratch_feasibility.json` blockers): "NO WRITE PATH MEASURED... A production bulk apply must add write cost." The hot-path probe puts a per-round-trip Neon cost at 91-101 ms (`situsQuery` 91.884 ms, `alreadyPromotedQuery` 91.485 ms, `geomResolve` 101.599 ms). Write-then-verify is at minimum a write plus a read-back - two more round trips. If those are not batched, the write path plausibly **doubles or triples** 141.975 ms, which would erase most of the 3.7x and put statewide back near two months.

The plan never performs this arithmetic. It never states a statewide time figure at all. Phase 4 says only "Rail C across all 254 counties first" with no duration, no parallelism model, and no shard plan. A reader who wants Texas in 48 hours will read Phases 1 through 4 and find nothing that tells him it is 22 days at best.

**VERDICT: CONFIRMED.** This is the single most damaging omission. The plan is not wrong about the work; it is silent about the gap between the work and the goal, and silence here reads as implicit agreement that the plan gets there.

**RECOMMENDED CHANGE.** Add a section headed "What this plan does and does not deliver against the 48-hour goal," stating the 21.95-day single-threaded figure verbatim, the 12.93 ms/parcel budget the goal implies, and the parallelism factor required. Then make the plan's actual Phase 3/4 target *concurrency and sharding*, not per-parcel micro-optimization - because no achievable single-thread optimization closes a 40x gap, and the pipeline is already established as latency-bound (`PROBE_profile_hot_path.json` finding: "the pipeline is latency-bound, not compute-bound, and the fix shape is batching plus caching plus concurrency"). Concurrency is named in the probe's finding and **is absent from the plan's Phase 3 entirely** - its four numbered items are fork-closing, bulk-loading, R30 restore, and spatial indexing. None of them is parallelism.

---

## SEVERITY 2 - "97.4 percent I/O" and "8.89 percent geometry" cannot both be true; they sum to 106.3 percent

**CLAIM under attack.** `program_plan.md:19`: "Geometry is 8.89 percent of loop wall time. 97.4 percent is blocking I/O."

**EVIDENCE.** Both numbers appear in the source, but they are defined over **overlapping** partitions and the plan states them as if they were complements. From `PROBE_profile_hot_path.json`:

- `allIoShareDefinition` (line 112, verbatim): "every named bucket except otherCompute and warmThenVerify... measured as bucketSum/wallMsTotal, i.e. **100 minus otherCompute**".
- `geometryComputeShareDefinition` (line 114, verbatim): "(warmThenVerify + otherCompute) / wallMsTotal * 100".

The two definitions are inconsistent with each other. The first computes 97.4 as `100 - otherCompute/wall`, which **silently counts `warmThenVerify` (10,383.8 ms, 6.29%) as I/O**, while the second definition counts that same bucket as geometry. Recomputed from the raw buckets against `wallMsTotal` 165,037:

```
otherCompute share                       =  2.60 %
100 - otherCompute                       = 97.40 %   <- the plan's "97.4% I/O"
(warmThenVerify + otherCompute)/wall     =  8.89 %   <- the plan's "8.89% geometry"
TRUE I/O (all buckets minus both compute)= 91.11 %
97.40 + 8.89                             = 106.29 %
```

The honest pair is **91.1% I/O and 8.89% compute**. The probe's own `allIoShareDefinition` is self-refuting on its face ("i.e. 100 minus otherCompute" is not "every named bucket except otherCompute *and warmThenVerify*"). The plan inherited the defect without checking it.

This is not a rounding quibble. The plan's entire framing rests on it - `program_plan.md:20` says the geometry work was "0.2 percent of the 522 ms per-parcel budget" and "A week was spent auditing math that was never the cost." That conclusion survives (compute is genuinely small). But a plan whose headline finding is *"nobody measured, so nobody knew"* must not itself ship two mutually exclusive percentages of the same denominator.

**VERDICT: CONFIRMED.** Both numbers appear in the cited source; the source is internally inconsistent; the plan reproduced the inconsistency without noticing.

**RECOMMENDED CHANGE.** State "91.1 percent blocking I/O, 8.89 percent in-process compute," and add a one-line correction note to `PROBE_profile_hot_path.json`'s `allIoShareDefinition`. Under the plan's own Phase 2 rule ("Where a doc states a fact the system could contradict, that fact lives in the spec tier and CI fails on divergence"), a percentage partition that does not sum to 100 is exactly the class of fact that must be mechanically checked.

---

## SEVERITY 3 - The 3.7x is not apples-to-apples; three different denominators are in play and the plan picks the most flattering

**CLAIM under attack.** `program_plan.md:65`: "The bulk pass ran 141.98 ms/parcel against a 522 ms baseline (3.7x)."

**EVIDENCE.** The arithmetic 522 / 141.975 = 3.677 is correct, and both figures appear in `PROBE_from_scratch_feasibility.json` (`speedupVsCurrent`). The problem is what each denominator counts.

**(a) The 522 baseline is a whole-script number and the probe says so.** `PROBE_profile_hot_path.json` caveat, verbatim: "The master planner's 522 ms/parcel figure (3,021,150 ms / 5,785 parcels) is a **whole-script number including setup**; the comparable figure here is **330 ms/parcel loop-only or 387 ms/parcel including the 28.3 s setup**." I confirmed 3,021,150 / 5,785 = 522.24. Against the profile probe's own like-for-like figures the speedup is:

```
330.07 / 141.975 = 2.32x   (loop-only vs loop-only)
387    / 141.975 = 2.73x   (both including setup)
522    / 141.975 = 3.68x   <- the plan's number
```

The plan cites the hot-path probe five lines earlier for the 97.4/8.89 figures and then ignores that same probe's explicit statement that 522 is not the comparable baseline.

**(b) The 522 baseline was measured on a leg that ran a *different computation*.** The plan's own Phase 3 item 1 establishes that the dry leg does not read boundary primitives (`depth-warm-bastrop-batch.mjs:653`, verified verbatim in live source this session - `if (!dryRun && storageHandle?.storage)`). So 522 ms is the cost of the *cheaper* code path. The apply leg adds `boundaryEdgesRead`, which the hot-path probe recorded as `callCount: 0` with the note "Expect a per-parcel atoms-DB round-trip here on apply," and possibly `bcadDivergenceFetch`. The probe states this outright: "a --force-overwrite apply will be **slower per parcel** than the 330 ms measured here." Comparing a bulk pass against the *dry* baseline understates the current pipeline's real cost - which makes the speedup **conservative in that direction**. This one cuts in the plan's favor and I note it for fairness.

**(c) The denominator substitution the prompt asked about - 5,792 parcels vs 3,548 envelopes.** Verified: 822,319 / 5,792 = 141.975 exactly. So the ms/parcel figure is arithmetically correct **on a parcel denominator**. But 1,990 of those parcels exited at `no-setback-row` and 231 at `empty-inset` (`declines` block), so only 3,548 envelopes were computed. On an envelope basis: 822,319 / 3,548 = **231.77 ms/envelope**, and the speedup against 522 collapses to **2.25x**. Which denominator is right depends on the scaling question: for "how long to sweep Texas" the parcel denominator is the correct one *provided the decline ratio holds statewide* - and it will not, because the 1,990 `no-setback-row` declines are a Bastrop-zoning artifact, not a statewide constant. Unincorporated counties (the majority of Texas, and the plan's own Phase 4 target) are unzoned and will decline at a *higher* rate, which flatters ms/parcel further. The probe was honest about the mirror-image version of this hazard in its `blockers` ("including them would have flattered ms/parcel, so they are excluded") but neither probe nor plan carries the forward-scaling caveat.

**VERDICT: CONFIRMED on (a) and (c); noted-in-plan's-favor on (b).** The defensible speedup on a like-for-like basis is **2.3x to 2.7x**, not 3.7x.

**RECOMMENDED CHANGE.** Replace "3.7x" with "2.3x loop-for-loop (330 ms to 142 ms), 3.7x against the whole-script 522 ms figure," and add: "the ms/parcel denominator includes 2,244 declined parcels; ms/envelope is 232. Statewide extrapolation on a parcel basis will overstate throughput because unzoned counties decline at a higher rate."

---

## SEVERITY 4 - Phase 1 is not a "schema extension," and calling it one is a soft-sell

**CLAIM under attack.** `program_plan.md:35`: "Per the ledger audit this is a SCHEMA EXTENSION, not a rebuild. `county_facet_coverage` is already keyed `(county_fips, facet)`; the grain is correct."

**EVIDENCE.** The plan's own six-item list for Phase 1 enumerates: a new table, a new dimension, three new columns with a new CHECK constraint, a rewritten handler query, a replaced CLI target set, and a rebuilt Command Center grid. The ledger audit's headline is more careful than the plan's paraphrase - `LEDGER_schema_audit.md:16`, verbatim: "**SCHEMA EXTENSION on the cell table, plus a genuinely NEW manifest table. Not a fill, not a full rebuild.**" The audit's qualifier ("on the cell table") is doing all the work, and the plan dropped it. The audit is explicit that the new table "is the missing piece and **the real work**" (line 246).

Scope items the plan's framing hides:

1. **Seeding 254 rows from a file that is ingested nowhere.** `LEDGER_schema_audit.md:267`: "**No. It lives only as a file in doc_repo.**" Zero hits for `texas_roster` across all three code repos. This is a new ingest path, not a migration.
2. **The `facet` vocabulary goes from 3 to 13.** Verified in live source: `countyCoverageScoreCli.ts:698` reads `const targets = all ? Object.keys(COUNTY_NAMES) : [single as string];` (confirmed verbatim), and `COUNTY_NAMES` holds ten FIPS. Ten of the thirteen rails have **no writer at all** - no scorer emits them. Phase 1 as written delivers a grid where 10/13 columns are structurally `not-yet` forever until someone writes ten new scorers. The plan's acceptance criterion ("the console shows 254 rows on day one, almost all mostly `not-yet`") is satisfiable by a grid that is 96% empty by construction and stays that way.
3. **`join_quality` is not a peer cell.** `LEDGER_schema_audit.md:106`: it "lives as the `owner_match_rate` column on the land-use row... not as a peer cell." Promoting it to rail 3 of 13 is a data-model change, not a column add.
4. **The CC panel rewrite.** The audit (section 5) shows the panel's five columns and its empty state "No county has been through the factory line yet" - the audit's own words: "the panel's own mental model is a run log, not a manifest." Changing a run log into a manifest is a rebuild of that panel's premise.

**VERDICT: CONFIRMED.** "Extension not rebuild" is true only of `county_facet_coverage`'s primary key. Applied to Phase 1 as a whole it is a soft-sell.

**RECOMMENDED CHANGE.** Restate as: "extension on the cell table; new manifest table, new rail dimension, new ingest path for the roster, ten new rail scorers, and a panel whose premise changes from run-log to manifest." Then state explicitly that Phase 1 delivers an *honest empty grid* and that filling 10 of 13 rails is separate, unscoped work not in this plan.

---

## SEVERITY 5 - The sequencing claim is asserted, not argued, and Phase 1 is not a prerequisite for Phase 3

**CLAIM under attack.** `program_plan.md:29`: "Observability precedes optimization precedes scale. Building throughput on an unobservable factory reproduces the last month at higher speed. Phase 1 is the manifest because it is the denominator every later phase reports against."

**EVIDENCE.** Test the dependency directly. Phase 3's four items are: close the `!dryRun` fork; bulk-load acquisition out of the loop; restore R30 relabel; index the road scan. Its acceptance is "byte-parity with the currently-proven pipeline on the operator twelve, block13 7/7, and a 250+ random sample, measured by the independent instrument."

**None of those four items reads, writes, or depends on `county_manifest`, the rail dimension, `rail_state`, or the Command Center grid.** The parity instruments Phase 3 grades against already exist and already ran - the from-scratch probe executed all three (operator twelve 12/12, block13 5/7, random sample 223/250) **with no manifest in existence**. Phase 3's observability prerequisite is *per-parcel roster emission*, which the 770 probe specifies in detail (`PROBE_770_refusal_join.md`, "Required instrumentation" items 1-5: uncapped refused-parcel roster, discriminate the promote catch, emit boundary-primitive counts, make the dry leg honest, raise sample caps). That is an **engine-side change in `depth-warm-bastrop-batch.mjs`** and has nothing to do with the county ledger schema.

So the plan conflates two different observability objects:
- **Run-level observability** (which parcels refused and why) - a genuine Phase 3 prerequisite, and it lives in the engine.
- **Program-level observability** (how much of Texas is done) - a reporting surface, and it is Phase 1.

Phase 1 is a prerequisite for *knowing whether Texas is finished*. It is not a prerequisite for *finishing it*. The plan's own Phase 4 needs the manifest as a denominator; Phase 3 does not.

**What the ordering costs.** Phase 1 as scoped is a new table plus a new dimension plus a roster ingest plus a query rewrite plus a CLI replacement plus a CC panel rebuild, spanning two repos (`legacy-design-tools` and `hauska-map`) plus a migration that per standing memory must be hand-verified against deployment Neon (`migration-merged-not-applied-to-deployment-neon`, and the ledger audit could not read `information_schema` for lack of credentials - `program_plan.md:96` concedes this). Serializing all of that ahead of the only work that moves parcels through the factory is, in the operator's terms, the plan choosing to build the dashboard before the machine.

**VERDICT: CONFIRMED.** The stated dependency does not exist as stated. The aesthetic ordering is defensible as *risk* management and indefensible as *dependency*.

**RECOMMENDED CHANGE.** Split the phases by repo and run them in parallel, since they touch disjoint code:
- **Lane A (engine, starts immediately):** the 770 probe's instrumentation items 1-4, then close `!dryRun`, then bulk-load, then R30, then measure the write path. This is the only lane on the critical path to Texas.
- **Lane B (ldt + map, parallel):** manifest table, rail dimension, roster ingest, query rewrite, CC grid.
- **Lane C (docs, parallel, no code dependency):** Phase 2.
Keep the *rule* that no Texas completeness number is quoted before Lane B lands - that preserves the honesty commitment without serializing the machine behind the dashboard.

---

## SEVERITY 6 - The plan is silent on a live half-mutated production store

**CLAIM under attack.** `program_plan.md:90`: "What is NOT in this plan: Elgin (held). The 770 refusal (now a named engine defect, fixed by the Phase 3 `!dryRun` close, **not by re-running**)."

**EVIDENCE.** `_STATE.md` line 7, verbatim:

> **T1 cohort re-persist (2026-08-08):** Recovery re-pair **DONE** @ `dba7a82`. Apply promoted **1668**; extended parity **2438 == 1668 + 770**. Post-verify: block13 **7/7**, saga twelve **12/12**, warden v1.3 serveTruthEdgeLabels **0** on sample. Pack: `_inbox/2026-08-08_T1_bastrop_recovery_post_verify.json`. Elgin queued. Slot **HELD** (master-planner close ruling).

**1,668 parcels were promoted. 770 were not.** The Bastrop city store is therefore in a mixed generation state right now: some parcels carry post-Geometry-Law envelopes, 770 carry whatever preceded them. The 770 probe adds a sharper fact about a subset - `PROBE_770_refusal_join.md:243`, verbatim: the 369 `declines.other` bucket "does **not** get a `promoteHonestVerifyDecline` write (unlike the verifyFail path at line 876) - these 369 parcels are left with whatever was previously in the store." So 369 parcels are serving stale envelopes **with no honest-decline marker on them**, meaning the serve path cannot distinguish them from good ones.

The plan says the fix is the `!dryRun` close "not by re-running." That is right about the *engine defect* and wrong about the *store*. Closing the fork makes future runs honest; it does not touch 770 already-diverged parcels. And the plan's Phase 3 acceptance is "byte-parity with the currently-proven pipeline" - but "currently-proven" is now a store containing 1,668 new-generation and 770 old-generation envelopes. Parity against a mixed baseline is not a well-defined test.

This also directly engages the `area-sweep-not-parcel-sample` standing memory: the post-verify cited in `_STATE.md` is "warden v1.3 serveTruthEdgeLabels **0 on sample**." A sample. On a cohort known to be 31% unpromoted.

**VERDICT: CONFIRMED.** The plan names the 770 as an engine defect and does not name the store as being in a mixed state, does not say whether that state is safe to serve, and does not say what closes it.

**RECOMMENDED CHANGE.** Add to Phase 3, before the parity acceptance: "The Bastrop city cohort is currently 1,668 promoted / 770 unpromoted, of which ~369 carry no honest-decline marker. Establish whether those 369 are servable, mark them if not, and define which generation is the parity baseline - a mixed-generation store cannot be a byte-parity reference." This is a serve-path honesty question under OPS-7, not only a throughput question.

---

## SEVERITY 7 - Self-serving framing: the corrections are carried, but the plan over-credits its own instruments

**CLAIM under attack.** Whether the plan honestly carries the master planner's three errors this session.

**EVIDENCE.** Checked each:

1. **"Asserted probes were running when they were not."** Not mentioned anywhere in the plan. However, this is a session-conduct error with no bearing on the plan's technical content, and I do not think a program plan is the right artifact for it. **Not a hit** - but see the recommendation, because the memory audit found the grading rung that *would* capture it has a 0% execution rate, so it will be captured nowhere.

2. **"Ruled the extended parity equation valid when it is diagnostically empty."** **Honestly carried.** `program_plan.md:67`, verbatim: "including the extended parity equation ruled on 2026-08-08 - which is arithmetically true but diagnostically empty, since `computePassNotPersisted` is defined as the residual." This tracks the probe's language closely (`PROBE_770_refusal_join.md:346`: "arithmetically true but diagnostically empty... a tautology"). Credit where due - this is a self-correction stated plainly, in the plan's own body, without hedging. Note though that `_STATE.md` line 7 **still presents "extended parity 2438 == 1668 + 770" as a post-verify result**, so the correction has not propagated to the rolling state doc.

3. **"Hypothesized BCAD network flakiness which was disproven."** **Honestly carried, and the plan states the disproof as its own finding.** `program_plan.md:18` describes the 770 audit correctly as a code-path divergence. The probe's headline is blunter ("**The leading hypothesis is WRONG**"). The plan does not name whose hypothesis it was. That is a soft landing but not a laundering - the substance is fully present.

**Where the plan does over-credit itself.** `program_plan.md:82`: "The memory store is accurate (11 of 11 technical claims resolved exactly at file:line) and never graded." The "11 of 11" is real (`MEMORY_system_audit.md:105`) but it is the *narrow* accuracy figure for repo-level path/header/enum claims. The audit's actual verdict tally on all checkable claims (line 103) is: "**13 VERIFIED, 2 STALE, 4 SUPERSEDED, 1 partially superseded, 5 UNVERIFIABLE**." Quoting 11/11 and omitting 6 stale-or-superseded out of 20 checkable claims makes the store sound cleaner than the audit found it. The audit's own summary sentence is "the system is a well-curated **reference library**... It is not yet a **learning loop**."

Also over-credited: `program_plan.md:23` says the grading rung is "0 of 214" sessions. Measured live this session: `find _sessions -name "*.md"` returns **216** files, `ls _sessions/` returns **215** entries, and the memory audit itself says **215** (line 21: "zero times in 215 session summaries"). The plan wrote 214. The `grep -rl "HARMED" _sessions/` = 0 result is confirmed exactly.

**VERDICT: CONFIRMED (partial).** Two of three corrections are carried honestly and prominently - this is better than the prompt's framing assumed and I want that on the record. The hits are the 11/11 selective quotation, the 214-vs-215 slip, and that the parity correction has not propagated to `_STATE.md`.

**RECOMMENDED CHANGE.** Quote the memory audit's full verdict tally, not the flattering subset. Fix 214 to 215. Add `_STATE.md` line 7 to the Phase 2 "immediate corrections owed" list, since it still presents the tautological parity equation as verification.

---

## SEVERITY 8 - Numbers audit: every remaining figure checked, three defects found

Each figure from the prompt's list, traced to its primary source and recomputed.

| Figure | Plan location | Verdict |
|---|---|---|
| 8.89% geometry share | `:19` | **In source; but see Severity 2** - cannot coexist with 97.4% |
| 97.4% I/O | `:19` | **DEFECT.** True I/O is 91.11%. Source definition self-contradictory |
| 522 ms baseline | `:20`, `:65` | In source; 3,021,150/5,785 = 522.24 confirmed. **Mis-framed** - see Severity 3 |
| 141.98 ms bulk | `:65` | CONFIRMED. 822,319/5,792 = 141.975 exactly |
| 0.28 ms/envelope | `:20` | CONFIRMED. `offsetInsetMsPerEnvelope: 0.284`; 1,008 ms / 3,548 |
| 3.7x | `:65` | Arithmetically correct (3.677); **not like-for-like** - see Severity 3 |
| 5 DB queries | `:65` | CONFIRMED. `bulkQueryCount: 5` |
| 0 live HTTP | `:65` | CONFIRMED. `liveHttpCalls: 0`, tripwire-enforced |
| 57 cells vs 3,302 | `:22` | CONFIRMED. 19 counties x 3 facets = 57; 254 x 13 = 3,302 |
| 19 counties / 3 facets | `:22` | CONFIRMED against the live endpoint payload in the audit |
| 0 of 214 HARMED | `:23` | **DEFECT.** 0 HARMED confirmed; denominator is **215** (audit says 215; `find` returns 216 files) |
| 2 of 11 dispatches | `:84` | CONFIRMED. `grep -il "standing decision" _dispatches/2026-08-*.md` returns exactly 2 of 11 |
| 253/254 StratMap | `:78` | CONFIRMED. Counted `in_stratmap: true` = 253 of 254 |
| 13,360,496 parcels | `:37` (implied), Severity 1 | CONFIRMED. Summed `identity.parcel_count_est` across 254 rows |
| 1,689 markdown files | `:21` | **MINOR DEFECT.** Live count this session: **1,695**. Six files added since the inventory ran - including the plan itself. Directionally fine |
| 6 to 7 serial round trips | `:19`, `:65` | CONFIRMED. `currentPipelineContrast` lists exactly 7 (one optional) |
| "same layer-23 lookup fired twice" | `:19` | CONFIRMED. `layer23SetbackProbe` (491 calls) + `layer23SetbackBuild` (110 calls), probe note: "same call, same arguments, same parcel, moments apart" |
| 81% mechanical verify + ground truth | `:70` | CONFIRMED. (335,488 + 245,971)/721,380 = 80.6% |
| O(edges x 13,987 roads) | `:70` | CONFIRMED. `roadsLoaded: 13987` in all four logs |
| block13 5/7, 27-of-250 | `:69` | CONFIRMED. `block13.agree: 5, disagree: 2`; `randomSample.agree: 223, disagree: 27` |
| index-locked "8/12 and 2/7" | `:72` | CONFIRMED. `operatorTwelve.agreeIndexLocked: 8`; `block13.agreeIndexLocked: 2` |

**File:line citations - all five verified against live source this session:**

| Citation | Verdict |
|---|---|
| `countyLedger.ts:91` | **CONFIRMED verbatim.** `const rows = await db.select().from(countyFacetCoverage);` at line 91 |
| `countyCoverageScoreCli.ts:698` | **CONFIRMED verbatim.** `const targets = all ? Object.keys(COUNTY_NAMES) : [single as string];` at line 698 |
| `depth-warm-bastrop-batch.mjs:653` | **CONFIRMED.** Line 653 is `if (!dryRun && storageHandle?.storage) {` - exactly the `!dryRun` gate described |
| `OPS-2:33` | **CONFIRMED verbatim.** Line 33 is the STAGE 4 INSET line opening "BCAD rings trusted, no scrub (A5)" |
| `OPS-5:34` | **CONFIRMED verbatim.** Line 34 is the R28 line: "recompute boundary primitive when stored normals disagree with the working BCAD ring" |

Citation quality is high. This is the plan's strongest attribute and it deserves saying.

**VERDICT: CONFIRMED on three defects** (97.4%, 214, 1,689) and one framing defect (3.7x, covered above). Everything else holds.

---

## SEVERITY 9 - Unknown unknowns the plan missed

**(a) The engine repo is on a feature branch, not main.** Verified live:

```
HEAD              = dba7a8291a4545daa3a14e8aa5779827b9778533
origin/main       = dba7a8291a4545daa3a14e8aa5779827b9778533
origin/fix/warden-situs-address-column = 38c3fe6008...
git status -sb    = ## fix/warden-situs-address-column...origin/fix/warden-situs-address-column [ahead 3]
```

**Correcting the premise in my brief:** HEAD is **identical to origin/main** - there is no unpushed work relative to main and no rewind risk. The "[ahead 3]" is relative to the *stale feature branch remote*, which main has already absorbed via the #277 merge. The working tree also carries untracked `_build_plain_geom.mjs` / `_build_post_verify.mjs` scratch files. **This is a PLAUSIBLE-not-CONFIRMED concern:** the state is benign, but an executor dispatched into this clone starts on a feature branch whose name implies uncommitted work, which is exactly the confusion class `stale-clone-rewind-trap` exists to prevent. The plan should pin the SHA.

**(b) 56 sibling clones, not ~40.** Enumerated live: 56 directories matching the four repo prefixes under `P:\` (8 engine, 4 map, 40 ldt, 4 legacy-design-tools variants). The plan's open item says "~40 sibling worktree clones were not enumerated for `.cursor/rules` install." The real number is 56, and the memory audit already flagged the consequence (`MEMORY_system_audit.md:326`): "if executors typically run in worktrees rather than the canonical clone, the rules install may reach far fewer seats than the four-repo check suggests." The plan lists this as an open item but assigns it to no phase. Given that Phase 3 dispatches engine work and Phase 1 dispatches ldt+map work, this is a **live risk to both**, not a background nit.

**(c) The cert-lane BCAD frame is named but not scheduled.** `program_plan.md:98` lists it under "Open items the plan does not resolve": "The cert lane still grades against BCAD rings - a hard gate on the next county cert wave, unresolved." But Phase 4 is "Rail C across all 254 counties," and the Geometry Law decision states verbatim (`:36`): "reconcile cert frame with the serve-consistency law **before the next county cert wave**." Phase 4 *is* the next county wave. The plan therefore schedules the thing its own open item says is gated, and does not connect the two. **CONFIRMED.**

**(d) In-flight product commitments get no treatment.** `_STATE.md` carries live work the plan does not mention: `hauska-map` PR #118 flagged as `CONFLICTING`/`DIRTY` with an explicit warning that careless merge "silently reverts PRs #114/#116/#117"; W1/W2 (approved as T7 in the most recent commit message); the MCP + ICC audits "in flight." The plan's "What is NOT in this plan" section lists only Elgin, the 770, T7 LightBox, W3/W4, and Bexar. Four phases spanning three repos will contend for the same seats and the same heavy-scan slot. **CONFIRMED as an omission.**

**(e) The heavy-scan slot is a hard serializer the plan never names.** `CATCHUP_program_2026-08-05.md:32`, verbatim: "HEAVY-SCAN SLOT: **one heavy scan/bake on the atoms Neon at a time**. T1 holds the slot; T5/T3 data-runs reserve it through the master planner." `_STATE.md` line 7: "Slot **HELD**." Phase 3's acceptance requires a 250+ random sample and a bulk pass with the write path measured - both heavy scans. Phase 4 is 254 counties of heavy scans. **The plan proposes statewide scale under a one-at-a-time serialization rule it never acknowledges**, and Severity 1 already showed that ~11-way parallelism is what the 48-hour goal requires. These are in direct conflict. **CONFIRMED, and this is arguably a Severity-2-class finding**: the single-slot rule and the 48-hour goal cannot both stand, and the plan resolves neither.

**(f) Phase 2's own framing is under-scoped.** Consolidating 1,689 (really 1,695) docs with six competing factory specs is called "Consolidation, not authoring." The inventory lists **four parallel invariant sets with different numbering**, seven ABSENT or near-absent domains (store topology has no doc at all), and ~30 docs superseded-but-unmarked. Writing a store-topology doc that does not exist is authoring, not consolidation. **CONFIRMED but low severity** - Phase 2 is off the critical path either way, which is itself an argument for running it in parallel per Severity 5.

---

## WHAT I TRIED TO BREAK AND COULD NOT

- **The 770 root cause.** I attempted to find an alternative explanation for the dry/apply divergence. The probe's chain is airtight: I confirmed `depth-warm-bastrop-batch.mjs:653` gates `boundaryEdges` on `!dryRun` in live source, and the downstream consequence (different compute function, `osmHighwayTag` present only on apply, `verify-mechanical:55` no-op on dry) is a complete causal account. The four-way byte-identical `failureSamples` and 201/201 divergence-ID match are strong determinism evidence. **The plan's central diagnosis is correct.**
- **The "geometry was never the cost" conclusion.** I tried to make the 0.28 ms/envelope figure misleading by re-basing it. It survives every denominator: 0.28 ms/envelope, 1,008 ms of a 721,380 ms loop (0.14%), 1,008 ms of 822,319 ms total (0.12%). Even against the *envelope* denominator rather than parcel, geometry is a rounding error. **The plan is right that a week of math auditing chased the wrong cost.**
- **The ledger denominator finding.** I tried to find a county list the audit missed. `countyLedger.ts:91` is confirmed a bare select; `COUNTY_NAMES` is confirmed ten entries at `:698`; the roster is confirmed absent from all three code repos. 19 counties x 3 facets = 57 against 254 x 13 = 3,302. **Unassailable.**
- **The 13,360,496 parcel figure.** Recomputed independently from the roster. Exact.
- **The three-state model's necessity.** I tried to argue `integrity_verdict` or `classification` could absorb `rail_state`. They cannot - the audit is right that both encode join integrity, and migration 0060's comment ("a BLOCKED join records 0 (honest-absence)") proves absence is currently a *coverage number*, structurally unable to distinguish satisfied-absent from not-yet. **The plan's item 3 warning against overloading those enums is correct and load-bearing.**
- **The parity-comparison-rule argument.** I tried to argue index-locked comparison is the correct test. It is not: the probe shows `agreeIndexLocked: 8` for the operator twelve where the operator himself verified 12/12 on the live product, and the mismatch is fully explained by edge-count conventions (the R32 measurer collapses near-collinear edges; the bulk pass keeps every ring vertex). **The plan's Geometry-Law-rule-7 extension to comparison is sound.**
- **The plan's handling of its own corrections.** I expected laundering and found the opposite on the two substantive items (see Severity 7). The extended-parity self-correction at `:67` is stated more plainly than it had to be.

---

## WHAT I COULD NOT DETERMINE

1. **The write path's actual cost.** Central to Severity 1 and 3. I estimated 2-3 additional Neon round trips at 91-101 ms each from the hot-path probe's measured per-query latencies, but that is inference from adjacent buckets, not measurement. Until a bulk pass with writes is measured, every statewide figure in this review is a lower bound. The plan is right to refuse a throughput claim; it is wrong not to state the lower bound.
2. **Whether the 369 unmarked parcels are currently servable.** I could not query the store (read-only, no DB credentials). The probe establishes they receive no `promoteHonestVerifyDecline` write; whether the serve path surfaces them as stale, honest-absent, or silently-good is unverified.
3. **Whether the deployed cortex-api schema matches the migration files.** Same gap the ledger audit named (`:288`): no `information_schema` access. Phase 1 builds on assumed schema. The `migration-merged-not-applied-to-deployment-neon` memory says this class has already bitten once (2026-08-04).
4. **The decline-rate distribution across Texas.** My Severity 3(c) claim that unzoned counties will decline at a higher rate than Bastrop is reasoning from the county-shape ruling ("unincorporated county is unzoned") plus the observed `no-setback-row: 1,990`, not from measurement. **Labeled speculative.** It affects the direction of the ms/parcel bias, not the order of magnitude of Severity 1.
5. **Achievable concurrency.** The 11-way parallelism figure in Severity 1 is arithmetic, not an engineering estimate. Neon connection limits, ArcGIS rate limits on bulk acquisition, and the heavy-scan slot rule all bound it and I could not measure any of them. The real number could be far worse.
6. **Whether the ~10 unwritten rail scorers are days or weeks of work.** Severity 4 establishes they do not exist. I did not scope them.
7. **Whether `.cursor/rules` reaches any of the 56 clones.** I counted the directories; I did not enumerate `.cursor/rules` inside each. The memory audit did not either.
