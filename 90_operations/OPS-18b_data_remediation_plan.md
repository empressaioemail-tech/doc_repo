---
id: OPS-18b_data_remediation_plan
title: OPS-18 R-08 — Data remediation plan
status: active
last_updated: 2026-08-21
applies_to: portfolio
owner: nick
related:
  - 90_operations/OPS-18_canon_reconciliation_plan_of_record
  - 90_operations/OPS-18a_path_to_smartsite_market
  - 90_operations/OPS-18c_parallel_execution
  - _decisions/2026-08-21_all_board_parallel_execution
  - _inbox/2026-08-21_r07_store_grade.md
  - _inbox/2026-08-21_r09-wire_live_close.json
  - _decisions/2026-08-11_texas_flush_launch_gate_amendment
  - _blueprint/40_rule_register
---

# R-08 data remediation plan

This is the fix plan. It does not execute the remediations. Every defect class names an owner, a blueprint rule, and a recurrence control. Recurrence control means executor, trigger, and failure, not a person who remembers.

Live instrument: `GET /api/county-ledger` on serving `cortex-api-00527-yic` @100%, snapshot `computedAt` 2026-08-21T18:05:57.209Z (flood-score recompute), 14 rails, 254 counties, 3556 cells. Prior pin 15:53:02.907Z is the R-09-live snapshot. Planner parsed both. No new COUNT(*) on `atoms`.

## What the honest launch DCs do on that snapshot

| DC | Result | Evidence |
| --- | --- | --- |
| DC-4 no-atom | PASS 0 | live GET |
| DC-5 no-writer | PASS 0 | live GET; `hasWriter` true on 3556/3556 (capability) |
| DC-14 unmeasured | PASS 0 | no `derivation-indeterminate` |
| DC-2 geometry fabric | FAIL 1 | FIPS `48135` geometry `not-yet`, `honestCoveragePct` 5, instrument still `B2_cp2_geometry_scorer_apply.mjs` at 2026-08-12T12:42:12.313Z. Parcel-nodes are now geo_id-keyed (75859 active). Score remains NO-GO until denom is named. |
| DC-3 uniform rails satisfied | FAIL | not-yet after 18:05Z GET: roads 254, footprint 254, rrc-wells 254, rrc-pipelines 254, rail-corridor 254, flood 92, mud 45, geometry 1. Flood was 140 at 15:53Z; 48 new `satisfied-present` from the 76-county score. |
| DC-6 depth footprint | FAIL | depth not-yet statewide: easement 254, envelope 254, zoning 253, cad/owner/landuse 241 each. Footprint 28 cannot be all satisfied on those counts. |

`texasCompletenessPct` 22.45 (was 18.6 at 15:53Z) is progress only (DC-12). Do not turn it into a gate.

`hasWriter` and `atomFamilyState` are capability constants after the binding wire. Do not "fix" them by making them false. BP-LEDGER-01's original "must vary" is satisfied by `displayState` and `isPartial` (zoning `isPartial` true on 18 cells). DC-5 cannot go red unless a rail has no declared writer. That is an OPS-16 meaning question, not this plan's first wave.

## Order

Sellable (OPS-18a step 6, redefined 2026-08-21) is Command Center heartbeat plus existing atoms on SmartSite parcels. That slice is met. Remaining Wave A `--apply` is IN as OPS-18a step 7 / OPS-18c COVER. Scoring rails that already have atoms, and a named-denom geometry score on `48135`, remain first. Wave B depth stays in COVER slot gaps. Do not mint absence atoms without the verified pair. Do not restart Harris PBF.

## Wave A — uniform rails still `not-yet` (DC-2, DC-3)

### A1. Score rails that already have atoms

Scout 2026-08-21 (`_inbox/2026-08-21_a1-coverage_close.json`, Neon `fancy-fire-06136146` / `neondb` at 2026-08-21T16:46:40.428Z): **all five rails NO-GO** to score without a new atoms `--apply`. Planner re-ran the GROUP BY; flood 114/63, geometry 252/1/1, mud 134/75/45, roads and footprint absent. Do not dispatch a score-apply from this class as written.

| Field | Value |
| --- | --- |
| Class | Coverage row missing or below threshold while writer exists |
| DCs | DC-3 roads 254, footprint 254, flood 140, mud 45; DC-2 geometry `48135` |
| Rule | BP-SERVE-02 (serve scored Layer 4, not raw landing). Flood remainder also BP-SERVE-01. |
| Owner | property (LDT scorers: `countyGeometryScoreCli`, `countyFloodScoreCli`, `countyCoverageScoreCli`, roads/footprint/mud score paths already bound in `RAIL_ENGINE_BINDINGS`) |
| Fix (superseded by scout) | Running existing scorers does not move these cells. Geometry `48135` already scored at 5 percent (`foldedExtraFeatures=72100`); next is P-02 re-key, not a re-score. Flood 114 already match the GET; 63 are scored below 95 percent; 77 have no coverage row (atoms presence UNMEASURED; `--all` only iterates counties that already have `flood-hazard-fact` atoms). Roads and footprint have zero coverage rows and `RAIL_SCORING_DECLARATION` kind=unspecified (SS-W14). Mud 45 not-yet already have rows from `l16-score-mud.mjs`, which is not in the repo. |
| Recurrence control | Executor: a CI or factory-close check that, for each uniform rail, counts `displayState === "not-yet"` on live GET and fails when the count is above the pin. Trigger: after score apply and after ledger recompute. Failure: non-zero exit. Bypass: skipping recompute (the 14:50 vs 15:53 class). Pin known remaining debt; never raise the pin to go green. |

### A2. Sparse uniform rails that should be honest-absent

Scout 2026-08-21 (`_inbox/2026-08-21_a2-absence_close.json`): sparse rails cannot go honest-absent today. L7 Donley writes `county_facet_coverage.absence_basis`, not the verified pair. Wells/pipelines/rail/mud scorers are `kind=unspecified`. Apply CLIs never call the county-coverage pair builders. Mud leftover 45 are below-threshold, not zero-source absence.

| Field | Value |
| --- | --- |
| Class | `rrc-wells`, `rrc-pipelines`, `rail-corridor`, leftover `mud` cells stuck `not-yet` |
| DCs | DC-3. GATE-R2 already says honest absence is the expected terminal for geographically sparse uniform rails. |
| Rule | BP-ABSENCE-01 |
| Owner | property + engine. Scorer may emit `satisfied-absent` only when the atom carries `evaluated: true` and non-empty `provenanceScope`. Engine writers that today write typed `absence` without the pair (R-07 Q5d vs Q5e) are the bypass. |
| Fix (superseded by scout) | Do not copy L7 `--honest-absent` onto wells (that is the Q5d bypass). Do not mint `_county_coverage` markers this wave. Do not run a statewide wells `absenceProbe` over the Harris ArcGIS layer (registry.ts:293-294). Recurrence throw in `scoreRailCell` is a lock, not a cell mover, and is incomplete until `countyGeometryScoreCli.ts` is also pair-gated. Operator still owes: pair required vs L7 facet-only; which wells universe (`tx_rrc_well` vs Harris). |
| Recurrence control | Executor: `scoreRailCell` in `artifacts/api-server/src/lib/railScoring/engine.ts` throws if it would emit `satisfied-absent` without an independently read atom whose `verifiedAbsence.evaluated===true` AND `provenanceScope.length>0`. Known violation already in tree: `engine.test.ts:144` passes on basis-only. Trigger: score write. Failure: throw; cell stays `not-yet`. Bypass: raw SQL; `countyGeometryScoreCli.ts --honest-absent`; historical `l16-score-mud.mjs`. Do not implement until the operator rules L7 vs pair. |

### A3. Flood consumer never repointed

Scout 2026-08-21 (`_inbox/2026-08-21_a3-flood_close.json`): ledger score path is already on `flood-hazard-fact`. A3 as written is mis-aimed at the ledger. Inspect/serve still SELECTs `place_layer_snapshots`; that is a second defect, not the 140 `not-yet`.

| Field | Value |
| --- | --- |
| Class | tier2 `place_layer_snapshots` retired; L4 flood still not fully on `flood-hazard-fact` |
| DCs | DC-3 flood was 140 `not-yet` vs 114 `satisfied-present` at 15:53Z; 92 vs 162 after the 76-county score |
| Rule | BP-SERVE-01 |
| Owner | property |
| Evidence | Ledger: `countyFloodScoreCli.ts` 109-113 FROM atoms `flood-hazard-fact`; zero `place_layer_snapshots`. Inspect: `brokerageNodeFacets.ts` 361-381 still SELECT snapshots; flood values refused (SS-W16). The 140 is A1 coverage (63 below threshold + 77 missing rows), not this consumer. |
| Fix | Do not patch the ledger scorer. Next flood ledger work is P-08 apply for missing-row FIPS once atoms presence is measured, plus threshold doctrine for the 63. Inspect wiring of `flood-hazard-fact` is a separate card. |
| Recurrence control | Score-path lock: `countyFloodScoreCli.graph.test.ts` failing if that file names `place_layer_snapshots`. Inspect already has `ci-tier2-flood-not-served`. Pair with A1's live GET pin on flood `not-yet`. |

## Wave B — depth footprint (DC-6)

Depth rails: `cad`, `owner`, `zoning`, `envelope`, `landuse`, `easement`. Footprint: 28 FIPS in `_decisions/2026-08-09_launch_footprint_counties.md`.

| Field | Value |
| --- | --- |
| Class | Writer live, cell not scored inside footprint |
| DCs | DC-6, DC-8 (owner) |
| Rule | BP-LAND-01 plus per-rail factory termination (BP-FACTORY-01). The factory-termination detector now fails `kind=factory` with `terminationCondition` NONE; it does not yet fail a footprint cell left `not-yet`. |
| Owner | property (Factory 1 / 1.5 / 2 already named in OPS-16). Envelope and easement are 254 `not-yet`; they are first. |
| Fix | Score and stamp the 28, then recompute. Honest-absent where no CAD path exists (DC-8). Fabricated owner is never acceptable. |
| Recurrence control | Executor: GET filter depth rail × footprint FIPS, fail on any `not-yet`. Trigger: factory close and ledger recompute. Failure: non-zero exit. Bypass: closing the factory on acquisition-staged without score. Factory close already requires F15-style verify; add the ledger GET as the second derivation. |

## Wave C — store identity (R-07 launch-critical; inspect card)

These do not move DC-4/DC-5. They make parcel join and inspect dishonest. Do not estimate families Q8 did not count.

### C1. Dual parcel key grammars

| Field | Value |
| --- | --- |
| Q | Q4a, Q4b, Q8a, Q8b |
| Rule | BP-PARCEL-KEY-01 |
| Owner | engine (mint at resolution) + property (joiners that still string-match) |
| Evidence | Q8a flood→parcel 16/100 do not bind. Q8b special-district 20/100. Anderson control 100/100 when both sides use `48001:10001.00000000`. |
| Fix | Normalize to `{fips}:{integer}` at write. Alias the StratMap decimal form in `externalKeys` (C3). Do not rewrite 100M rows in one job; start with writers going forward, then a bounded backfill of the inspect-card families (parcel-node, flood-hazard-fact, special-district-fact). |
| Recurrence control | Executor: BP-WRITE-01 at the storage port, currently DORMANT (atoms has no triggers, Q1a). Arm it: reject `entity_id` that matches the decimal-padded grammar when `entity_type` is a parcel-keyed family. Trigger: bulk apply. Failure: refuse the batch. Bypass: `COPY` / raw SQL. Second derivation: the Q8 sample join as a scheduled check that fails if unresolved+mismatch rise above the 2026-08-20 pin (flood 16/100, sd 20/100). Never raise that pin. |

### C2. Sentinels in primary keys

| Field | Value |
| --- | --- |
| Q | Q4c `footprint:primary` 182/200; Q8c `sd:outside` 289/500 |
| Rule | BP-KEY-SENTINEL-01 |
| Owner | engine writers for building-footprint and special-district-fact |
| Fix | Move `primary` / `outside` out of `entity_id` into a body field or a typed absence/edge. New writes first. |
| Recurrence control | Executor: same storage-port reject for `entity_id` containing `:outside` or `:primary`. Trigger: bulk apply. Failure: refuse. Bypass: raw SQL. |

### C3. `externalKeys` unfed

| Field | Value |
| --- | --- |
| Q | Q5b 0/1025 |
| Rule | BP-KEY-01 |
| Owner | engine resolution |
| Fix | Mint canonical key; put source keys in `externalKeys`. Required on the same write as C1 so old grammars remain findable. |
| Recurrence control | Executor: writer unit test that a fixture source key appears in `externalKeys` and the canonical key is the integer grammar. Trigger: engine CI. Failure: test fail. Bypass: a writer that does not go through resolution. Register that writer in parts inventory or it is a zombie. |

### C4. Property `applies-to` unfed

| Field | Value |
| --- | --- |
| Q | Q2b `atom_links` 33066 est rows, seven code-corpus types, `applies-to` absent |
| Rule | BP-EDGE-01 |
| Owner | engine canonicalisation |
| Fix | Write `applies-to` from fact atom to parcel-node at the same moment as the fact. Do not treat `body.parcelNodeId` as the edge. |
| Recurrence control | Executor: after each property writer, assert at least one `applies-to` row for the written DID. Trigger: writer close. Failure: refuse close. Bypass: inserting atoms without the link helper. A GET-shaped count of `applies-to` that stays zero fails the pin (today: 0). Lower the pin only when the count is real. |

### C5. Verified-absence pair unfed

Covered as the mechanism of A2. R-07 Q5e 0/1025. Do not close A2 by widening typed `absence` to count as the pair.

## Out of this plan's first three waves

Q5n `containsPii` has no BP-*. Register gap, not a invented rule. Follow-on.

BP-BITEMP-01 / empty `knowledge_atoms`: already accepted-partial on ADR-028. Do not cite that table. No backfill to fake bitemporality.

DC-5 capability constant: file for operator if launch still wants a no-writer fail mode. Not a data backfill.

## WDLL

Done looks like: this file is tracked, OPS-18 row R-08 cites it, and a stranger can execute Wave A without re-deriving the GET.

1. Live GET scores for DC-2/3/4/5/6/14 are in this file with `computedAt` 2026-08-21T15:53:02.907Z.
2. Every class in Waves A–C has owner, BP-*, and a recurrence control that names executor, trigger, and failure.
3. No class whose fix is "mint absence atoms" without the verified pair.
4. No new full-table COUNT(*) on `atoms`.
5. OPS-18a step 5 points here.

## leave_behind

Wave A scout closed 2026-08-21. Flood EXISTS then score closed the same day: 76 of 76 wrote, GET flood 162 present / 92 not-yet (91 coverage not-yet + Donley `48129`). P-02 apply closed: prefix-range 75859 active geo_id / 3791 retired prop_id; lease released. Geometry `48135` score still NO-GO. Recurrence throw in `scoreRailCell` waits on an operator ruling (L7 facet-only vs the verified pair). Operator 2026-08-21 evening: remaining board is OPS-18c. Next compile after WDLL+A-021: SERVE P-48, COVER-geom P-56, IDENT P-55, GOV R-06. Do not restart Harris PBF. Do not mint absence without the pair.
