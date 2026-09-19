---
id: 2026-09-19_p350_williamson_RECORD
title: P-350 Williamson 48491, fill applied and the phantom retired ahead of the staging publish, record
date: 2026-09-19
last_updated: 2026-09-19
status: fill APPLIED 03:52Z (20 value-to-absent cells on 10 named parcels, inside the accepted bound); phantom retired 03:55Z; floor 16 of 16 pass post-fill; STAGING PUBLISH REFUSED by P-351's writer-(b) guard (the whole numeric keyspace excluded), blocked on P-370; production not requested
kind: production-write record
owner: nick
maintained_by: integration seat
programs: [OPS-24, OPS-16]
plan_rows: [P-350, P-335, P-352, P-351, P-327, P-333]
snapshot: factory store ep-round-base-au0jofwp (FACTORY_DATABASE_URL / _RO); cortex store ep-lucky-truth-apodo8hr (neondb); record-fill image sha256:4138ecfd (factory 415d3212); publish image sha256:502e9734 (factory f5f758d6, bake LDT 03bb424a); doc_repo 31f74990 plus uncommitted seat edits
authority: OPS-16 P-350 (Done: P-335's crosswalk loaded and the fill applied; P-327, P-333 and P-351 shipped; a staging publish passes the retirement gate and the walk; production on the operator's go; the served population intact by census; PITR branch deleted). A-220: P-335's movement bound accepted, "the pair is authoritative; the 30 parcels are listed in P-350's apply record". The operator's go of 2026-09-19 for the list and "the williamson publish if its ready".
---

# P-350, Williamson 48491

## 1. What P-350 needs, and where each stands

| Precondition | State |
|---|---|
| P-335 (the crosswalk) | merged #178; the pair is read live by the fill, never persisted (by decision) |
| P-333 (join-miss restore) | merged #186; Williamson is excluded by its join (restore reason `crosswalk-county-identifier-miss`) |
| P-327 (the gate measures the bake's population) | merged #177; in the publish image `502e9734` |
| P-351 (the bake retires only a gone account) | merged LDT #723 `03bb424a`, factory #188 `f5f758d6`; in the publish image |
| Record-fill image | deployed 02:14Z (`4138ecfd`, graded 390 of 390) |
| Fill applied | section 3 |
| Staging publish passes the gate and the walk | section 5 |
| Production publish | **the operator's go** |
| PITR branch `br-late-rain-apffmnp2` deleted | after production |

## 2. The census, re-taken before the apply (P-335's leave-behind)

Read-only, factory store, heavy-scan lease `b7003aef` (02:42:28Z to 02:52:23Z, holder
`integration-p350`), P-310's own instrument `scripts/p310-factory-census.mjs` at factory `415d3212`.
Output `_inbox/2026-09-19_p350_williamson_factory_census_before_fill.txt`. Its last query (a
sample of gate verdict rows) failed on a renamed column (`basis`); it was not needed and is left as
found.

On the fill's own population (282,569 R-keyed place keys): `yearBuilt` 233,250 value / 49,319
absent-verified; `livingAreaSqft` 233,277 / 49,292; `exemptionCodes` 0 value / 95,384
absent-verified / 187,186 unaccounted (county-wide); `situsState` 282,570 unaccounted (county-wide).
These equal P-310's 2026-09-17 census, so the stored side of P-335's movement bound is unchanged:
at most 20 value-to-absent field moves on 30 parcels, all inside the 48 accounts where the address
path and the published pair disagree, and 24 of P-335's 44 on `exemptionCodes`, which holds no
value to lose.

## 3. The fill

### Dry run `factory-parcel-record-fill-dc2pj` (03:20:06Z to 03:22:34Z)

Args read back `parcel-record-fill --county=48491`. The dry run never connects to the factory store,
so it measures the bind and the would-be writes, not stored movement. Inside the seat's cortex-host
window (`integration-p350`, taken 03:20:03Z).

| Measure | Dry run | Pre-registered (P-335 close) |
|---|---|---|
| Landing parcels | 282,569 | 282,569 |
| CAD rows bound (`cadPresent`) | 282,219 | 282,219 |
| Unbound | 268 join-miss + 82 instantiation-refused = 350 | 350 |
| `situsState` resolved (unaccounted to value) | 282,487 | "starts resolving the 282,570" (P-352) |
| Join-miss restore | 0, reason `crosswalk-county-identifier-miss` | 0 (P-333: Williamson excluded by its join) |
| Join-miss unresolved cells | 4,020 = 268 x 15 CAD rails | (the 350 minus the 82) |

**Finding: the 82 refused instantiations are real R accounts, not label keys.** P-352's guard
refuses a key that resolves to neither exactly one parcel geometry nor a CAD account. The 82
samples are R-account keys (`48491:R006142`, `R008416`, `R009569`, `R010065`, `R010298`, ...) with
2 or 4 parcel geometries and no reachable CAD account; `R006142` is also among P-351's named
unreachable accounts. A multipart parcel with a CAD miss therefore reads as "not a parcel". For this
apply the effect is benign: those records already exist (instantiated 2026-09-02), so the refusal
means they are not refreshed, and nothing is deleted or downgraded. As a class it is a false
refusal, and P-352's close named the adjacent gap ("a label key carrying exactly ONE geometry and no
CAD account"). Carded as a follow-on.

### Before-snapshot (03:31:48Z, inside factory window `b38c1040`)

`q_48491_value_cells.sql`: every VALUE cell on `yearBuilt`, `livingAreaSqft`, `exemptionCodes` for
48491, with an md5 of its state: 466,527 rows (233,250 + 233,277 + 0), sha256 `dd0408eaa91e9a24...`.
`q_48491_rail_kinds.sql`: per-rail, per-kind counts over all rails (126 rows). Diff instrument
`diff_value_cells.mjs`, self-tested both ways (a fixture with one lost, one changed and one gained
cell reports exactly those; an empty before-snapshot refuses with exit 2).

The hourly gate trigger was PAUSED at 03:31:37Z for the write session, after the 03:00Z run
`fdh7l` completed at 03:31:18Z on the new image.

### Apply `factory-parcel-record-fill-wt4pb`

Args read back `parcel-record-fill --county=48491 --apply --twice`, started 03:32:29Z.
Completed 03:52:22Z, `succeededCount 1`. Its done line: `landing=282569 pages=1413 records=282487
cells=5932227 drift=zero-drift cadPresent=282219 situsStateMoved=282487 instantiationRefused=82
joinMissUnresolvedParcels=268 joinMissUnresolvedCells=4020 joinMissRestoredCells=0
joinMissRestoreReason=crosswalk-county-identifier-miss`. Every count equals the dry run's, and
`--twice`'s second pass found zero drift.

### After-snapshot and the diff (03:53Z, the same two queries, the same window)

`diff_value_cells.mjs p350_cells_before.csv p350_cells_after.csv p350_kinds_before.csv p350_kinds_after.csv`:

- **Value to non-value: 20 cells on 10 parcels**, all `yearBuilt` + `livingAreaSqft`, none on any
  other rail. That is exactly P-335's bound (at most 20) and inside its population (the 30 parcels
  in the 48 divergent accounts). Named:

  | Parcel | Now | Basis (the pair's account) |
  |---|---|---|
  | `48491:R010358` | yearBuilt, livingAreaSqft `absent-verified` | `cad_property` 69047, tax year 2026 |
  | `48491:R010575` | same | 69263 |
  | `48491:R012758` | same | 71425 |
  | `48491:R019244` | same | 77867 |
  | `48491:R023433` | same | 82025 |
  | `48491:R040784` | same | 99182 |
  | `48491:R332247` | same | 170630 |
  | `48491:R362090` | same | 189383 |
  | `48491:R511701` | same | 317561 |
  | `48491:R641301` | same | 466965 |

  Under A-220 the published pair is authoritative, so these are corrections: the values had come
  from an address-matched row for a different account, and the county's own account for each
  parcel carries no improvement.
- **Per-rail kind deltas over ALL rails** (a second derivation, of NET movement only). Every
  rail's net movement is toward value or neutral:
  `situsState` unaccounted to value 282,487; `landUseVintage` unaccounted to value 282,487;
  `acreageSqft` unaccounted to value 282,219; `exemptionCodes` 0 to 202,442 values (15,256 from
  absent-verified, 187,186 from unaccounted); `assessedValue`, `landValue`, `improvementValue`
  +25,392 each; `landUseCode` +25,410; `situsCity` +25,182; `situsZip` +25,180; `yearBuilt`
  +9,070; `livingAreaSqft` +9,100; `marketValue` +4,699; `legalDescription` +10; `landUseSource`
  25,424 unaccounted to 25,410 value and 14 absent-verified. No rail shows a net loss of value.
  A net delta can hide a loss offset by a gain, so per-cell value-to-non-value is measured on the
  three bound rails only. On every other rail the evidence is P-335's construction argument (the
  merge is add-only over the node's own R row and the pair's account row) plus the absence of any
  net loss, not a per-cell diff.
- **What this instrument cannot see, stated rather than hidden.** The snapshot hashes the whole
  cell state, and every rewritten cell carries a new vintage, so 466,507 cells read "changed" and
  the instrument cannot tell a value change from a re-stamp. A value-only before-image was not
  taken. Value-to-value changes on the three rails are therefore unmeasured by this record. P-335's
  analysis bounds them to the 48 divergent accounts.

## 4. The phantom, retired (P-352 item 3)

`factory-retire-phantom-record` deployed from its own build (`c91c31df`, generation 1; template
args carry no `--apply`).

- Dry run `xlxzp` (03:12Z): would remove exactly `48491:PRIVATE ROAD` (65 cells, 3 companion rows),
  evidence `geometryCount 2`, `cadAccount false`.
- Apply `wmm8k` (03:54:51Z to 03:55:23Z), args read back `retire-phantom-record --apply`: run
  `434b2d7f-a806-4375-8943-9853f4b1fcd8`, `recordsDeleted 1`, `cellsDeleted 65`,
  `companionRowsDeleted 3`, `deletedKeys ["48491:PRIVATE ROAD"]`.
- Read back from the store: phantom record 0, cells 0, companion rows 0; control `48491:R010358`
  still 1 record and 65 cells; Williamson records 282,569 (282,570 before).

The factory and cortex windows were released at 03:56:17Z and 03:56:20Z. The gate trigger was
RESUMED at 03:56:22Z (next run 04:00Z); the 04:00Z cycle is the first to grade Williamson after the
fill.

## 5. The post-fill grade, then the staging publish

### The county graded after the fill (the 04:00Z hourly cycle `s7frh`, run `a885ec9b`)

Pre-registered: all 16 of Williamson's publish-floor rails (computed from
`floorRailsForCounty(PUBLISH_FLOOR_RAIL_KEYS, "48491")` at factory `f5f758d6`: cityLimits, flood,
wells, specialDistricts, valueHistory, overlayDistricts, zoningDistrict, marketValue,
assessedValue, landValue, improvementValue, livingAreaSqft, yearBuilt, utilityService,
landUseCode, owner; `maxImperviousCoverPct` skipped by scope) read `pass` in a verdict written
after the fill. Grader `grade_floor_48491.mjs`, checked both ways (a `--since` later than every
row reads UNMEASURED 16 of 16, exit 2).

**Result: 16 of 16 pass**, written 04:19:42Z to 04:29:06Z. `s7frh` completed 04:29:08Z. Copy:
`_inbox/2026-09-19_p350_williamson_verdicts_after_fill.csv`.

Non-floor rails against the pre-fill baseline:

| Rail | Before | After | Why |
|---|---|---|---|
| situsState | refuse 282,570 | refuse 82 | the 82 keys the instantiation guard refused (P-368) |
| landUseVintage | refuse 282,570 | refuse 82 | same 82 |
| acreageSqft | refuse 282,570 | refuse 350 | the 268 join misses plus the 82 |
| landUseSource | refuse 25,775 | refuse 350 | same 350 |
| exemptionCodes | refuse 187,186 | pass 0 | the pair's account rows carry the codes |
| buildingFootprint | refuse 1 | pass 0 | the one open cell was the phantom's (P-348's Williamson cell) |
| maxImperviousCoverPct | refuse 282,570 | refuse 282,569 | out of Williamson's floor scope; the phantom removed |

### Staging publish `factory-bastrop-publish-cswmw`

Started 04:29:51Z, args read back `bastrop-publish --target=staging --county=48491
--gold=48491:76149 --skip-pmtiles`, image `502e9734`, no `OPERATOR_PUBLISH_GO` or
`PRODUCTION_SITE_URL` on the execution. No `factory-staging-reset` run (not part of a county
publish; A-181/P-276's rotation gap applies to a reset).

**Pre-registered:** the readiness gate clears (16 of 16); the retirement gate measures 0 new
retirements in the R keyspace (P-351: every reachable account is on the declared roll, 424
declared-undetermined rather than retired) and a share at or below 0.05 (P-361); the walk passes on
gold `48491:76149`. **Falsifiers:** any retirement share above 0.05, a readiness refusal, a red
walk. A writer-(b) refusal on the numeric keyspace would be a finding, not a failure, and on
staging it is safe.

**Result: FAILED `BAKE_FAILED` at 04:33:35Z, run `bd087474-f194-4f01-be5a-f058606e3ace`. Nothing was
written.** Read from `run_events` (through `FACTORY_DATABASE_URL` with the session forced read-only,
checked by violation: an `UPDATE ... WHERE false` was refused; the `_RO` role cannot read `runs`):

| Stage | Result |
|---|---|
| `pre-bake-readiness` | OK: record vs landing 282,569 of 282,569; bake vs roll 602,049 of 602,049; the 16 floor rails clear |
| `coverage-floor` | OK: retention 1.0514 against 0.95, scoped to the R keyspace (the numeric keyspace named unmeasured) |
| `retirement-gate` | OK: numeric 319,480 present on the roll, 0 new retirements; R 282,569 already retired, 0 new; blast radius share 0 against 0.05, destructive 0 |
| bake | FAILED 6.4 s after taking its job-execution lease on the staging MCP store; lease released |

**The mechanism.** On a gate-blocked county the bake's account-keyed prepass (writer (b)) treats
every work id missing from the parcel table as a hollow node. Williamson's `txgio_parcel` holds
282,569 R-prefixed ids and **zero numeric ids** (read in staging AND production), while the work list
carries the 319,480 numeric served ids, which are live accounts on the 2026 roll (P-327). So the
whole numeric keyspace is excluded, and P-351's new guard (`assertAccountKeyedBlastRadius`, set
equality) refuses. This is the 2026-09-17 emptying mechanism, **refused instead of written**. The
guard is doing its job; writer (b)'s membership test is the defect.

**The second mechanism, and why it is not ruled out completely.** Something else failing in the
first 6.4 seconds of the bake. Two candidates were measured and rejected: the staging store lacking
P-351's new inputs (it carries `tx_wcad_owner`, `tx_wcad_ag_valuation`, `cad_property`,
`txgio_parcel`), and a schema difference (the column sets of the three tables are identical in
staging and production). It cannot be closed completely because the publish drops the bake's
stderr and stdout (`runShell` wraps them into the error, and the job prints only the code), so the
guard's own per-keyspace line is not on any record. That is P-371.

**What it means for P-350.** The Williamson publish is NOT ready and the production publish is not
asked for. It waits for **P-370** (writer (b) tests membership through the county's published pair,
as P-351 did for writer (a), with CP1 stating what the served state should be when two keyspaces
name the same parcels). The staging store's Williamson rows are unchanged by this run (all 602,050
were already retired there by the 2026-09-17 staging run).

## 6. State after this record

| | |
|---|---|
| Fill | applied, verified, 20 value-to-absent cells named |
| Phantom | retired |
| Verdicts | 16 of 16 floor rails pass post-fill |
| Staging publish | refused by P-351's guard; blocked on P-370 (and P-371 for the reason to reach the record) |
| Production publish | not requested |
| PITR branch `br-late-rain-apffmnp2` | kept (production is still unpublished) |
