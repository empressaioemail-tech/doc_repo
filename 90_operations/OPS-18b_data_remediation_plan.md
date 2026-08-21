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
  - _inbox/2026-08-21_r07_store_grade.md
  - _inbox/2026-08-21_r09-wire_live_close.json
  - _decisions/2026-08-11_texas_flush_launch_gate_amendment
  - _blueprint/40_rule_register
---

# R-08 data remediation plan

This is the fix plan. It does not execute the remediations. Every defect class names an owner, a blueprint rule, and a recurrence control. Recurrence control means executor, trigger, and failure, not a person who remembers.

Live instrument: `GET /api/county-ledger` on serving `cortex-api-00527-yic` @100%, snapshot `computedAt` 2026-08-21T15:53:02.907Z, 14 rails, 254 counties, 3556 cells. Planner parsed that payload. No new COUNT(*) on `atoms`.

## What the honest launch DCs do on that snapshot

| DC | Result | Evidence |
| --- | --- | --- |
| DC-4 no-atom | PASS 0 | live GET |
| DC-5 no-writer | PASS 0 | live GET; `hasWriter` true on 3556/3556 (capability) |
| DC-14 unmeasured | PASS 0 | no `derivation-indeterminate` |
| DC-2 geometry fabric | FAIL 1 | FIPS `48135` geometry `not-yet`, `honestCoveragePct` 5 |
| DC-3 uniform rails satisfied | FAIL | not-yet: roads 254, footprint 254, rrc-wells 254, rrc-pipelines 254, rail-corridor 254, flood 140, mud 45, geometry 1 |
| DC-6 depth footprint | FAIL | depth not-yet statewide: easement 254, envelope 254, zoning 253, cad/owner/landuse 241 each. Footprint 28 cannot be all satisfied on those counts. |

`texasCompletenessPct` 18.6 is progress only (DC-12). Do not turn it into a gate.

`hasWriter` and `atomFamilyState` are capability constants after the binding wire. Do not "fix" them by making them false. BP-LEDGER-01's original "must vary" is satisfied by `displayState` and `isPartial` (zoning `isPartial` true on 18 cells). DC-5 cannot go red unless a rail has no declared writer. That is an OPS-16 meaning question, not this plan's first wave.

## Order

Wave A is what keeps the launch gate red today (DC-2, DC-3). Wave B is DC-6 footprint depth. Wave C is store identity from R-07, which makes the inspect card dishonest even when a cell scores. Sell on the current map (OPS-18a step 6) in parallel with A. Do not wait for C to finish before selling. Do not mint absence atoms without the verified pair. Do not restart Harris PBF.

## Wave A — uniform rails still `not-yet` (DC-2, DC-3)

### A1. Score rails that already have atoms

| Field | Value |
| --- | --- |
| Class | Coverage row missing or below threshold while writer exists |
| DCs | DC-3 roads 254, footprint 254, flood 140, mud 45; DC-2 geometry `48135` |
| Rule | BP-SERVE-02 (serve scored Layer 4, not raw landing). Flood remainder also BP-SERVE-01. |
| Owner | property (LDT scorers: `countyGeometryScoreCli`, `countyFloodScoreCli`, `countyCoverageScoreCli`, roads/footprint/mud score paths already bound in `RAIL_ENGINE_BINDINGS`) |
| Fix | Run the existing scorers so `county_facet_coverage` gets a `rail_state`. Then non-dry `recompute?probe=skip` from the serving revision. Geometry `48135` (Ector): 5 percent coverage is why it is `not-yet`; either finish that county or rule honest-absent with provenance. |
| Recurrence control | Executor: a CI or factory-close check that, for each uniform rail, counts `displayState === "not-yet"` on live GET and fails when the count is above the pin. Trigger: after score apply and after ledger recompute. Failure: non-zero exit. Bypass: skipping recompute (the 14:50 vs 15:53 class). Pin known remaining debt; never raise the pin to go green. |

### A2. Sparse uniform rails that should be honest-absent

| Field | Value |
| --- | --- |
| Class | `rrc-wells`, `rrc-pipelines`, `rail-corridor`, leftover `mud` cells stuck `not-yet` |
| DCs | DC-3. GATE-R2 already says honest absence is the expected terminal for geographically sparse uniform rails. |
| Rule | BP-ABSENCE-01 |
| Owner | property + engine. Scorer may emit `satisfied-absent` only when the atom carries `evaluated: true` and non-empty `provenanceScope`. Engine writers that today write typed `absence` without the pair (R-07 Q5d vs Q5e) are the bypass. |
| Fix | Feed the verified-absence pair on the sparse-rail write. Do not mint well/pipeline/rail atoms for counties that do not have them. Do not count typed `absence` as the pair. |
| Recurrence control | Executor: atom-contract conformance already refuses `evaluated: true` with empty scope. Missing piece: the county-ledger scorer must refuse `satisfied-absent` when the pair is absent. Trigger: score write. Failure: throw, cell stays `not-yet` (honest) rather than a fake satisfied. Bypass: writing `rail_state` by SQL. Add a GET check: every `satisfied-absent` cell has non-null `absenceBasis` or `verifiedByInstrument` (subset of DC-9). |

### A3. Flood consumer never repointed

| Field | Value |
| --- | --- |
| Class | tier2 `place_layer_snapshots` retired; L4 flood still not fully on `flood-hazard-fact` |
| DCs | DC-3 flood 140 `not-yet` vs 114 `satisfied-present` |
| Rule | BP-SERVE-01 |
| Owner | property |
| Evidence | R-07 did not re-query this. Blueprint V9 / parts inventory: successor serves nothing while predecessor data remains. Live GET is the remaining 140. |
| Fix | Repoint the flood score/read path to `flood-hazard-fact`. Prove by a named county that is `not-yet` today becoming `satisfied-present` or `satisfied-absent` after repoint+score+recompute. |
| Recurrence control | Executor: a test that the serving flood path does not read `place_layer_snapshots`. Trigger: PR CI in LDT. Failure: fail if that table name appears in the flood serve/score import graph. Bypass: raw SQL in a one-off. Pair with A1's live GET pin on flood `not-yet`. |

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

Execution of Wave A is property, after this row closes. Recurrence controls that do not yet exist are R-06 remainder, not silent scope on this file.
