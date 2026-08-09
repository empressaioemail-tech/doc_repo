---
id: 2026-08-08_BLUEPRINT_program_plan
title: Blueprint program plan v2 — Command Center first, then parallel lanes to statewide
date: 2026-08-08
status: DRAFT v2 — revised after adversarial review; pending operator approval
owner: nick
related: [_decisions/2026-08-08_county_shape_thirteen_rails_and_geometry_first, _decisions/2026-08-07_envelope_saga_close_and_geometry_law, _inbox/2026-08-08_BLUEPRINT_adversarial_review, _inbox/2026-08-08_BLUEPRINT_doc_inventory, _inbox/2026-08-08_MEMORY_system_audit, _inbox/2026-08-08_LEDGER_schema_audit, _inbox/2026-08-08_PROBE_profile_hot_path, _inbox/2026-08-08_PROBE_from_scratch_feasibility, _inbox/2026-08-08_PROBE_770_refusal_join, _inbox/2026-08-08_CONTRACT_coherence_audit, 90_operations/CATCHUP_program_2026-08-05]
---

# Blueprint program plan v2

Revised after adversarial review (`_inbox/2026-08-08_BLUEPRINT_adversarial_review.md`). Seven findings landed; all seven are incorporated. Corrections to v1 are named inline rather than silently fixed.

## The target, stated numerically (v1 omitted this — review finding 1)

Texas is 13,360,496 parcels across 254 counties.

| Per-parcel cost | Statewide, single-threaded |
|---|---|
| 522 ms (current pipeline, whole-script) | 80.72 days |
| 330 ms (current, loop-only) | 51.03 days |
| 141.98 ms (measured bulk pass, no write path) | 21.95 days |
| **12.93 ms (what a 48-hour statewide run requires)** | **2.00 days** |

The 48-hour goal therefore requires roughly **11-way sustained parallelism on top of the bulk pass**, or an equivalent combination of further per-parcel reduction and concurrency. v1 contained no parallelism item at all and stated no statewide duration. Both are corrected here: parallelism is a first-class workstream, and every throughput claim carries its statewide implication.

Honest caveat that bounds all of the above: the 141.98 ms figure EXCLUDES the write path (write-then-verify plus promote). No statewide duration is final until a bulk pass WITH writes is measured.

## Corrections to v1 (carried openly, per review finding on self-serving framing)

- **The 3.7x speedup was not like-for-like.** The source probe states 522 ms is a whole-script number and the comparable figure is 330 ms loop-only. Like-for-like is **2.32x** (2.73x setup-to-setup, 2.25x on an envelope denominator). All later references use 2.32x.
- **"97.4 percent I/O" plus "8.89 percent geometry" summed to 106.3 percent.** The probe's two definitions both claimed `warmThenVerify` (6.29 percent). True I/O share is **91.11 percent**. Geometry remains 8.89 percent at most, and 0.12 to 0.14 percent measured as pure offset-core time.
- **Phase 1 is not merely a schema extension.** The ledger audit's verdict was extension on the cell table PLUS a genuinely new manifest table, which it called "the real work." Restored below.
- **The extended parity equation** ruled valid earlier on 2026-08-08 is arithmetically true but diagnostically empty (`computePassNotPersisted` is defined as the residual). `_STATE.md` still presents it as a post-verify result and must be corrected.
- **The engine repo is NOT ahead of origin.** HEAD equals `origin/main` at `dba7a82`; the earlier "3 commits ahead" reading was against a stale feature-branch remote. Sibling clones number **50 to 56**, not ~40.
- The memory audit tally is 13 verified / 2 stale / 4 superseded / 5 unverifiable, not the flattering "11 of 11" subset quoted in v1.
- Doc count is 1,695 (not 1,689); the HARMED grep denominator is 215 sessions (not 214).

## SPRINT 1 — Command Center, standalone, operator-gated

Operator directive: nothing else starts until the Command Center is right. This is a standalone sprint with an explicit review loop, not a phase inside a larger program.

The console must answer two questions: **INTAKE** (what do I onboard next, what does it cost, what is blocked) and **MAINTENANCE** (what is drifting, what is stale, what broke, what needs a re-warm).

Build:

1. New `county_manifest` table, 254 rows, seeded from `_catalog/texas_roster_v1.json` (not ingested anywhere today; carries `parcel_count_est` for rollup weighting and a pre-computed satisfied-absent in `zoning_regime.doctrine`). The review is explicit that this new table, not the cell-table columns, is the real work.
2. 13-entry rail dimension with declared per-rail coverage thresholds.
3. Additive columns on `county_facet_coverage` (already correctly keyed `(county_fips, facet)`): `rail_state` (new CHECK: satisfied-present / satisfied-absent / not-yet), `threshold_pct`, `absence_basis`. Do NOT overload the existing `integrity_verdict` or `classification` enums, which encode join integrity rather than acquisition.
4. Rewrite `countyLedger.ts:91` as a LEFT JOIN from manifest x rails so unworked counties render as `not-yet` instead of vanishing. Replace the hardcoded 10-entry `COUNTY_NAMES` map at `countyCoverageScoreCli.ts:698`.
5. Grid UI: 254 x 13, per-cell state plus coverage percent, threshold, source, vintage, open defects. Per-county completeness. Texas rollup weighted by parcel count. Per-rail statewide progress.
6. Intake view: next-best county by cost and risk class (156 bis-field-template, 59 no-rest, 18 stratmap-vintage-drift, 8 crosswalk-required, 1 no-stratmap, 1 harris-sharding-required), with blockers named.
7. Maintenance view: staleness, drift, open defect classes, failures promoted to the surface rather than sitting in `_inbox` artifacts.

**The 10-missing-writers problem, named (review finding 4).** Only 3 rails have a scorer today (land-use, zoning, envelope). Ten rails have NO writer, so the grid ships 96 percent structurally empty unless writers land with it. Sprint 1 must either include a minimal scorer per rail (even one that only reports satisfied-absent from the roster) or explicitly label uninstrumented rails as `no-writer` — a fourth display state distinct from `not-yet`, so the console never implies we looked when we did not.

Acceptance: 254 rows visible on day one, mostly `not-yet`, Texas number honest and low. Operator reviews, iterates, and signs off. **No other lane starts until that sign-off.**

## After sign-off: three PARALLEL lanes (review finding 5)

v1 sequenced these as serial phases on the claim that observability precedes optimization. The review demonstrated that none of the throughput items touch the manifest, and the parity instruments already ran with no manifest in existence. v1 conflated run-level observability (engine-side refused-parcel rosters — a genuine prerequisite for the engine lane) with program-level observability (the ledger — a reporting surface). Corrected: the lanes run in parallel, separated by repo.

### Lane A — engine throughput (hauska-engine)

1. Close the `!dryRun` fork at `depth-warm-bastrop-batch.mjs:653`. Until this lands no dry/apply parity claim means anything.
2. Emit an uncapped refused-parcel roster (`sampleOutcomes` caps at 8, `failureSamples` at 30) and `instanceof` discrimination at the bare catch on :823. This is the run-level observability the engine lane genuinely needs first.
3. Bulk-load acquisition out of the derivation loop; cache the layer-23 lookup that fires twice per parcel with identical arguments.
4. Restore R30 relabel in the bulk path (cause of the block13 5/7 and the 27-of-250 sample residuals; pure function over in-memory roads, zero I/O).
5. **Parallelism workstream (new in v2).** Concurrency model, keyspace sharding beyond Bexar, worker fan-out, and the store's concurrent-write ceiling. The hot-path probe's own conclusion named concurrency as part of the fix shape and v1 dropped it. This is the workstream the 48-hour goal actually depends on.
6. Then the real remaining cost: mechanical verify plus ground-truth is 81 percent of the bulk loop; edge labeling is an O(edges x 13,987 roads) scan wanting a spatial index.
7. Measure a bulk pass WITH the write path and restate the statewide number.

Acceptance: byte-parity with the proven pipeline on the operator twelve (verbatim saga values), block13 7/7, and a 250+ random sample, by the independent instrument, using **rotation-invariant matching**. Index-locked comparison is the wrong parity test — it gave 8/12 and 2/7 where truth is 12/12 and 5/7. Every existing cert and parity harness must be audited for index-locked comparison.

### Lane B — doc set and contract (doc_repo, atom-contract)

Consolidation, not authoring. Authoritative and reusable per the inventory: `factory_onboarding_runbook.md`, `OPS-WDLL_the_factory.md`, `OPS-7`, `OPS-8`, the defect-class backlog, the Geometry Law, the nine `_smartsite_masters/` docs.

Two tiers: **narrative** (prose, for humans) and **spec** (machine-readable, benchmarkable — county manifest, atom contract, invariant register). Where a doc states a fact the system could contradict, that fact lives in the spec tier and CI fails on divergence.

Domains: factory pipeline, county manifest, Smart Site application, Command Center, MCP servers, data contract, store topology (ABSENT today — worst gap; the authoritative correction survives only inside a superseded dispatch), verification and instrument inventory, failure taxonomy, environments and deploy topology, economics, invariants, and **workspace and repo operations** (new in v2, operator-requested: repo topology and canonical paths, branch and clone discipline across 50+ sibling clones, artifact conventions and retention, the `_inbox` contract, the session-start cross-repo state check).

Corrections owed: two BCAD-frame contradictions (`OPS-5:34`, `OPS-2:33`); `75m` MUD/RRC LIVE labels; ADR-017 four-value vs live five-value accessPolicy; `_STATE.md` ruled authoritative over `00_current_state.md` with CLAUDE.md corrected; six competing factory specs given precedence or retirement; `_STATE.md`'s extended-parity presentation corrected.

Contract coherence is audited separately (`_inbox/2026-08-08_CONTRACT_coherence_audit.md`, in flight): rail-to-atom mapping for all 13 rails, orphan atom families, source coherence, accessPolicy assignment, whether `satisfied-absent` is first-class at the atom layer or an R27 workaround, and canonical parcel-key divergence. Its findings fold into this lane.

Rule: four parallel invariant sets exist with different numbering; only the Geometry Law names an enforcing mechanism per rule, and it is the only one that held. Every invariant names its check or it is not an invariant.

### Lane C — learning loop and hygiene (doc_repo, all repos)

1. Dispatch template auto-carries standing decisions. `_dispatches/_template.md` is dated 2026-05-27 with zero standing-decision, fleet-memory, or no-nesting content; August adoption is 2 of 11.
2. The grading rung gets a trigger that fires, or it is deleted. 0 of 215 sessions have run it.
3. Complete retirement of the 6 orphan Cotality/Regrid memory files; refresh the 2 stale and 4 superseded memories.
4. Workspace hygiene: enumerate and recycle the 50+ sibling clones; verify rule distribution actually reaches executor seats.
5. Run the zombie-code cleanup pass — its gate has now cleared.

## Blockers and contradictions this plan must resolve, not merely name

- **The heavy-scan slot serializes what the goal needs parallel (review finding 7).** CATCHUP mandates one heavy scan on the atoms Neon at a time; the 48-hour target needs ~11-way parallelism. Either the slot rule is replaced with a concurrency model that is safe by construction (disjoint key ranges, one writer per range), or the goal is unreachable. This is a required ruling, not a footnote.
- **A live half-mutated store (review finding 6).** Bastrop promoted 1,668 / refused 770. The 369 `declines.other` parcels receive NO `promoteHonestVerifyDecline` write, so they serve stale envelopes with no honest-decline marker. That is a serve-truth defect on production today, and it means Lane A's "byte-parity with the currently-proven pipeline" baseline is mixed-generation. Must be dispositioned before Lane A acceptance is meaningful.
- **The cert lane still grades against BCAD rings.** A hard gate on the next county cert wave.

## What is NOT in this plan

Elgin (held). Re-running the 770 (fixed by the fork close, not by re-running). T7 LightBox (parked with footprints and easements per operator ruling). W3 RRC and W4 MUD build work (held under the 2026-08-01 scale ruling; in the SHAPE, not in the sequence). Bexar (waits for Lane A).

## Open items the plan does not resolve

- Per-rail coverage thresholds (start 95 percent spine / 90 percent derived, tune against measured reality).
- The sub-200-dollar cost commitment is UNVERIFIED against 13 rails; the roster's `engine_250_heuristic` covers spine compute only and the economics doc is a confirmed-absent domain.
- Deployment Neon `information_schema` was not readable (no creds); the serving Cloud Run revision was not confirmed against main HEAD.
- Whether 12.93 ms/parcel is reachable at all, or whether the 48-hour target resolves to a different shape (more machines rather than faster code). Answerable only after Lane A item 7.
