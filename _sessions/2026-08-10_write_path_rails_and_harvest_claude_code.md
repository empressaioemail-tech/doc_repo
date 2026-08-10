---
id: 2026-08-10_write_path_rails_and_harvest_claude_code
title: Session close — five rails, the write-path misdiagnosis, harvest completeness, and a stranded fixture
date: 2026-08-10
type: session-summary
owner: planner
memory_graded: pending
related:
  [
    _sessions/2026-08-10_five_rails_and_write_throughput_claude_code,
    _decisions/2026-08-10_harvest_completeness_ruling,
    _decisions/2026-08-10_market_layer_thesis_parked,
    90_operations/OPS-15_owner_and_rrc_rail_gap_analysis,
    90_operations/QA_polish_register,
  ]
---

# Session close — 2026-08-10

Second capture of the day; the mid-session one is `_sessions/2026-08-10_five_rails_and_write_throughput_claude_code.md` and is NOT superseded — read both. This one covers everything after it.

## 1. THE BIGGEST CORRECTION — I misdiagnosed the sweep bottleneck, twice

**First diagnosis (mid-session):** 87.7% of sweep wall time is "the apply", caused by 32 concurrent single-row INSERTs. W1 (eng #302) fixed that and benchmarked 63x.

**That was half wrong, and the fix produced NO GAIN in production.** Moving the sweep onto the new write path measured **22 atoms/sec — SLOWER than the old 47.**

`EXPLAIN ANALYZE` on the write-then-verify SELECT:

```
Seq Scan on atoms
  Rows Removed by Filter: 10,708,795
  Execution Time: 10,143 ms
```

**Every 500-atom batch was seq-scanning all 10.7M atoms.** The apply phase contains BOTH the write and the verify; I attributed all of it to the write.

**The index hypothesis was ALSO wrong** — recorded so nobody retries it. `atoms_property_parcel_node_idx` has `WHERE entity_type = ANY(zoning-fact, setback-rule, buildable-envelope, parcel-terrain-model)` — it EXCLUDES `parcel-node`. I created a correctly-scoped index (`atoms_parcel_node_lookup_idx`, 122 MB, valid) which helps SINGLE-value equality enormously (8,700 ms -> 3 ms) but does nothing for the 500-value `= ANY` form. Measured alternatives, all worse: forced index **39/sec**, `unnest()` JOIN **57/sec**, serial single lookups **20/sec** against a ~49 ms Neon round-trip floor. Seq scan at 55/sec was the best available.

**The actual lever was batch size.** Verify cost is ~CONSTANT per batch — measured **9,128 ms for 500 ids vs 9,296 ms for 5,000**. `run_sweep.mjs` now passes `--batch=5000`. Measured on 48183 Gregg: 57,903 atoms in 259 s = **223 atoms/sec, 4.7x**. Sweep went from ~54 h remaining to ~8 h.

**MOLDED:** *a phase-level timing attributes cost to the phase's NAME, not to what it does.* Profile the STEPS inside a phase before optimizing the one it is named after. And **when a fix produces no gain, that is data, not a setup error** — the 22/sec result is what led to the real cause.

Also corrected in the same arc: the W1 executor reported 63x on a THROWAWAY schema while its own artifact showed the LEGACY path at 182/sec there vs my 47/sec in production — same code, 3.9x apart, unreconciled. The live table is 10.9M rows / 20 GB / NINE indexes. Realistic production rate is **~765 atoms/sec, 16x not 63x**. Molded: *a write benchmark on an empty table measures the CODE; on the production table it measures the SYSTEM.*

## 2. FIVE RAILS MERGED — and every one still has ZERO coverage

| Rail | Contract | Engine PR |
|---|---|---|
| `owner-fact` | 1.16.0 | #296 / #297 |
| `rail-corridor-fact` | 1.17.0 | #299 |
| `well-fact` | 1.18.0 | #300 |
| `building-footprint` (HOLD-1 closed) | — | #294 |
| `special-district-fact` | 1.19.0 | #301 |

`PROPERTY_ENTITY_TYPES` = **14**. All five applies are queued behind the atoms slot. **We are building faster than we can apply** — the manifest reads 0.7689% regardless of how many PRs merge.

**Parallel-lane version collision, twice in one day.** A and C both claimed contract 1.17.0; D2 declared 1.17.0 while its report said 1.18.0, and both were already published. Worse, D2's engine PR pinned EXACT `"1.18.0"` — a DIFFERENT rail's contract, which installs a package lacking the type it registers. **GitHub reported all of them `MERGEABLE`** because it compares each PR against main, never against each other. **RULE: assign versions UP FRONT in the dispatch, or serialize contract merges.**

**Merge-resolution defect class:** naive keep-both-sides produced a semicolon mid-union (twice), a truncated function (`fact-writer-ids.ts` cut mid-array THREE times), a type alias whose body became the next doc comment, and a package.json edit that silently DROPPED 2 of 17 dependencies. **Three times a file failed to TRANSFORM and never loaded while the suite reported everything else passing** — once as "168 passed" with two files absent. **RULE: verify a merge with `tsc` AND a test-FILE count, never a green total.**

## 3. R1 RAIL SPLIT IS LIVE IN PRODUCTION

12 rails -> 14. `countyRailRefreshCli --apply` run; cortex-api canary `00497-cep` deployed, smoked at 0% traffic, shifted to 100%. **Live: `totalRails: 14`, `totalCells: 3556`, `texasCompletenessPct: 0.7689%`** (was 12 / 3,048 / 0.897%). The number went DOWN because the denominator grew — same 89 satisfied cells, honest grid.

Per-rail states now distinguish **built-but-unapplied from not-built**: `owner` reads `not-yet` x254 while the four unbuilt rails read `no-atom` x254.

Deploy gotcha molded: cortex-api Artifact Registry tags are FULL 40-char SHAs; the 8-char prefix fails with `Image not found` and burns a run.

## 4. OPERATOR RULINGS

- **R1** — split RRC into `rrc-wells` + `rrc-pipelines`, add `rail-corridor`. DONE, live.
- **R2** — RESOLVED FROM LIVE CODE: `texas-rrc.ts` already fetches two distinct endpoints and tags `rrcAsset: 'well'|'pipeline'`. The data already arrives split. PHMSA NPMS not needed for v1.
- **R3** — **OWN is pre-launch-gate.** Constraint recorded: the 15 CAD counties are a SUBSET of the 196 geometry counties, so OWN can never reach 100% of 254 — the gate must read OWN as "done where CAD exists" or it can never close.
- **R4** — owner privacy enforced in THREE layers, not documented: schema pins `public-paid`, writer fail-closes, `verifyStoredOwnerFactAtom` re-checks stored bytes.
- **HARVEST COMPLETENESS** (`_decisions/2026-08-10_harvest_completeness_ruling.md`) — *"grab all the data from all the sources we are already touching. More manifest cells, so be it. EVERY source."* The expensive part is the VISIT, not the payload. Bounded: completeness at sources we ALREADY touch, not new acquisition targets; tenant-sovereignty and no-privileged-data still bind.
- **MARKET LAYER PARKED** until after Texas launch (`_decisions/2026-08-10_market_layer_thesis_parked.md`). No build lane.
- **Launch gate may DRIFT.** Maximize parallel movement.

## 5. RECONCILIATION FINDINGS (planner-run, no dispatch)

- **Atoms store inventory:** 10,925,628 atoms / 15 types. Four types are 99.9% of rows and all four are served. **The "dead weight" hypothesis is WRONG** — nothing orphaned; the bottom eleven types are 0.8% of the store.
- **Read path measured for the first time and healthy:** PE facets warm at **0.63/0.71 s** (certified Bastrop) and **0.51/0.47 s** (fabric-only Denton). No read crisis at 20 GB. **The asymmetry worth keeping:** the serving read is fast because it looks up ONE parcel by an indexed path; the sweep's verify was slow looking up 500 scattered ones. **Query SHAPE decided it, not row count.**
- **Zoning and geometry are county-INVERTED.** Only **FIVE** counties have both zoning-fact and parcel-node: 4.6M zoning-facts sit in 19 metro counties, 168 counties have parcel-nodes. The zoning bake ran metro-first, the sweep runs smallest-first. **Prediction: the metro tail the sweep is finishing ALREADY has its zoning half done** — Bexar/Dallas/Tarrant/Travis/Collin hold ~2.9M zoning-facts waiting. The manifest should gain disproportionately.
- `zoning-fact` carries NO `countyFips` field while `parcel-node` does — county must be parsed from `parcelNodeId`. That asymmetry silently returned `fips=null` for all 4.6M rows on the obvious grouping query.

## 6. THE HARVEST GAP — we probed 254 counties and never read the field lists

`_inbox/t6_cad_probe_<fips>.json`: **254 files, 176 with full field inventories, 47.3 fields/county.** `cad_property` persists ~15 columns. The inventory was 70% collected and unread.

Dispatched the rollup; **both close artifacts filed and verified** — `_catalog/source_field_inventory.json` (1,330 entries after correction, 11 sources) and `_inbox/2026-08-10_HARVEST_field_inventory_report.md`.

**Class C = 0** — every new-rail proposal refuted to a body field (R1 split rule working). accessPolicy held at 1,317 free / 13 paid, paid confined to owner mailing.

**PLANNER CORRECTION APPLIED:** the rollup keyed on `(field, type)` CASE-SENSITIVELY. ArcGIS returns mixed casing across counties, so one field became several rows each with a partial count. **`BLOCK` was reported at 83 counties and is actually 151** (understated by 67); `GEO_ID` 148 -> 158; `PROP_ID` 143 -> 163. 77 pure case duplicates. Catalogue re-keyed on `UPPER(field)`, 104 entries merged, 83 counts corrected from the probe files. **RULE: normalise identifiers before counting them** — same family as the situs comma tail and CAD `prop_id` zero-padding, now three instances.

**Take-list (corrected):** `GEO_ID` 158 (A), `BLOCK` 151 (A), `DEED_DATE` 148 (B), `SCHOOL` 147 (B), `HOOD_CD` 147 (B), `MAP_ID` 147 (A), `ABS_SUBDV_CD` 143 (A), `TRACT_OR_LOT` 142 (A).

**Structural fields are NOT in the REST layers** — `YEAR_BUILT` in 9 counties, `IMPRVMAINAREA` in 2. They live in the CAMA bulk export. Separate motion (Q5).

## 7. CAD STRUCTURAL DATA GAP

`cad_property`: `owner_name` 98.4%, `market_value` ~98%, but **`living_area_sqft` 10.5%**, `year_built` 10.2%. All-or-nothing per county: Williamson 76.9%, Hays 69.3%, Bastrop 52.7%, and **Bexar/Dallas/Tarrant/Travis/Collin/Denton ALL 0.0%** (~3.3M parcels). Cause is a source tier — direct CAD exports carry it, TxGIO StratMap does not. **The registry already flags `bulk_primary: true` on Dallas and Tarrant and the ingest ignores it.**

## 8. THE PE OUTAGE (fixed)

Operator's R6 browse found EVERY parcel showing "Parcel facts temporarily unreachable". Root cause: PE's `HAUSKA_RETRIEVAL_API_KEY` predated the P0 rotation -> 401 on every call. **The store was never sick.** Two traps: `hauska-map` was linked to the **`cmdcenter`** Vercel project (a deploy would have pushed PE's build to the Command Center), and the two projects use different var names. **Standing fix still owed (Q10)** — the key is hand-synced in two places and has drifted twice.

## 9. Q13 — STRANDED HONESTY WORK, AND THE FIXTURE IT WAS MEANT TO RETIRE IS STILL LIVE

Operator surfaced an old chat while cleaning history. Traced: PRs #273/#274/#275 in **legacy-design-tools** merged 2026-07-16; **#276 was CLOSED without merging** on 2026-08-08, and it carried the branch the other composites were built on.

Six commits sit on `origin/feat/oz-crossfilter-derivation`, 6 ahead of main, last touched 2026-07-16. They replace FOUR synthetic fixtures with real derivations (OZ from live CDFI/HUD with 8,765 tracts verified, `deriveOzDealCrossfilter`, buildable-envelope retiring a 78% fixture, constraint-density retiring a 4-overlay fixture, motivated-seller retiring the **0.74 propensity fixture**).

**VERIFIED: `0.74` is STILL ON MAIN** (`brokerageGisCompositeLayers.ts:177`, with `propensity: 0.81`) and `deriveOzDealCrossfilter` is NOT on main. The honesty work was reviewed clean, never merged, and the synthetic values it existed to retire are still what the composite layers serve. **Decision owed: rebase-and-merge, or close deliberately and document the fixtures as known-synthetic.**

## 10. ALSO SHIPPED

- **L1 buildable-header defect RESOLVED** (eng #298) — a site plan printed `LOT 1,722,104 SF / BUILDABLE 1,722,104 SF` on a parcel with no setback atom, while its own legend said "no setback rule on file". Fixed upstream so every consumer inherits it. Planner audited the `1e-9` tolerance rather than assuming: a 1-inch setback on a 39.5-acre parcel yields 2.54e-4 relative delta, five orders above threshold. The reported residual was a MISREAD — the alarming line is inside `injectBadWarmCandidate`, a deliberate RED-demo fixture.
- **QA polish register** started (`90_operations/QA_polish_register.md`): Q1 flood PDF missing the `SMART SITE` header prefix, Q2 chat not rendering markdown.
- **Two OPS-14 precondition hooks built and wired** — `dispatch-template-gate.ps1` and `dirty-tree-close-gate.ps1`, tested on 8 payload shapes. The dirty-tree gate caught the planner on an unrelated engine push; scope fixed same session rather than overridden.
- **K lane verified** — statewide tiles live (13,710,413 features / 196 counties / 2.96 GiB), CORS from the PE origin confirmed exposing `Content-Range` (the check the agent report did not make). **Buried defect found and fixed:** K5's code was UNCOMMITTED on an already-merged branch, so a redeploy from a clean checkout would have silently reverted PE to the 19-county tileset. Merged as map #157.

## 11. STATE AT CLOSE

**Sweep:** 123 landed / 9 remaining / 6,330,268 atoms / 4,841,548 features left / no halts. Queue is ALL metros: 48215(328k) 48121(354k) 48157(375k) 48085(388k) 48141(407k) 48113(694k) 48029(710k) 48439(757k) 48453(829k). ~8 h at recent rate. **Runner: `P:/tmp/parcel_node_sweep_20260809/run_sweep.mjs`; the sweep tree is `P:/hauska-engine` on branch `sweep/fast-write` at origin/main — do NOT edit that tree while it runs.**

**Ledger live:** 14 rails / 3,556 cells / 89 satisfied / **0.7689%**.

**Open PRs:** engine #295 (utility-easement writer, CI SUCCESS, needs a merge-from-main), engine #293 (F5 roads, CI FAILURE, DO-NOT-MERGE). ldt / map / contract: zero open.

**Dispatched, awaiting return:** B2 footprint metro join, IDX atoms index audit.

**Queued work register is `_STATE.md` section "QUEUED WORK" — Q1 through Q13.** That is the pickup list.
