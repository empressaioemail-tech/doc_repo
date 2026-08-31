---
date: 2026-08-21
agent: planner
repo: docs
session_type: execute
memory_graded: none
rolled_up: false
plan_row: OPS-18a / P-08
wdll: _inbox/2026-08-21_sellable_WDLL.md
snapshot:
  seat: integration
  doc_repo: P:/doc_repo main 83081da (ahead of origin)
  cortex_serving: cortex-api-00531-fus (land-use + flood atom read; not 00529-peg)
  pe_serving: smartsite.cloud dpl_JHohCzrJs4JRnbTjy7HFg9eqNBuc (PR 176)
  ledger: 664/3556 satisfied, texasCompletenessPct 22.45, computedAt 2026-08-21T22:20:20.726Z
---

# Session capture — sellable heartbeat and atom-serve

Sellable as redefined 2026-08-21: live Command Center heartbeat plus existing property-spine atoms serving their parcel on SmartSite. No new ingest. Empty County Manifest cells are coverage not-yet, not a dead board. Decision `_decisions/2026-08-21_sellable_is_cc_heartbeat_and_atoms_on_parcels.md`. Path `90_operations/OPS-18a_path_to_smartsite_market.md`. Data fix plan `90_operations/OPS-18b_data_remediation_plan.md`.

Gold probe: Bastrop `48021:34137`. Confirmatory: Lockhart `48055:18925`. Both integer and padded `{fips}:{prop}.00000000`.

## What was done

### Sellable WDLL

| Item | Grade | Evidence |
| --- | --- | --- |
| 1 Heartbeat stamps match GET | met live | CC `#panel=county-manifest` `computedAt` matches `GET /api/county-ledger` summary. Hard reload is the customer load. Leftover tab STALE is frozen SPA. |
| 2 Scheduled executor | met live | Cloud Scheduler `county-ledger-heartbeat` `*/10 * * * *` Etc/UTC POST `recompute?probe=skip` Bearer SERVICE_API_KEY body `{}`. Manual POST is the named bypass. |
| 3 Flood inspect reads the atom | met live JSON and painted card | Cortex PR 449 squash `a028ed37` serving `00529-peg`. PE PR 174 then 175. Gold Flood row Zone X, `source=flood-hazard-fact`. SS-W16 stays (`tier2.flood` null). |
| 4 Name every family's consumer | met as inventory | 15/15 named. Six serve the atom on inspect. Eight HOLDs. Scout `_inbox/2026-08-21_s2-family-scout_planner_review.json`. |
| 5 Parcel bind / dual grammar | met live on inspect families in scope | PE PR 175 `0a5ae0e` then 176 `3ea9852`. Padded gold matches integer (SF-1, envelope, Zone X, roads, land-use-fact A1). Lockhart pair both RLD / Zone X / land-use-fact A1. |
| 6 No new ingest | met | No Harris PBF. No statewide roads apply. No minted absence. Scoring and identity alias allowed. |

### Shipped this session (live)

| Surface | Change | PR / pin | Live probe |
| --- | --- | --- | --- |
| cortex-api | `floodHazardFact` root field from `flood-hazard-fact` atoms; dual-grammar bind; snapshots still refused | LDT [449](https://github.com/empressaioemail-tech/legacy-design-tools/pull/449) `a028ed37`; revision `cortex-api-00529-peg` @100%; ATOMS_DATABASE_URL mounted | Gold GET Zone X, `tier2.flood` null |
| SmartSite inspect | Copy `floodHazardFact`; Flood row from that field only | hauska-map [174](https://github.com/empressaioemail-tech/hauska-map/pull/174) `cf6ddc0` then [175](https://github.com/empressaioemail-tech/hauska-map/pull/175) | Painted `inspect-flood` Zone X integer and padded |
| SmartSite bind | Lookup alias `{fips}:{prop}` <-> `{fips}:{prop}.00000000`; echo requested id; no store re-key | hauska-map 175 `0a5ae0e`; deploy `dpl_GpHHZv6ThSY5pHCJCwLTgyNtNZdd` | Padded gold was empty before; now matches integer |
| Command Center | Heartbeat so Manifest is not frozen after 15 min | Scheduler job, not a CC code PR | 664/3556, 22.45%, stamp ticks ~10 min |
| cortex-api | `landUseFact` root field from `land-use-fact` atoms; prefix+taxYear bind | LDT [450](https://github.com/empressaioemail-tech/legacy-design-tools/pull/450) `24d280c`; revision `cortex-api-00531-fus` @100%; ATOMS_DATABASE_URL mounted | Gold GET A1, `source=land-use-fact`, bake stays cad-roll |
| SmartSite inspect | Copy `landUseFact`; Land use row prefers that field | hauska-map [176](https://github.com/empressaioemail-tech/hauska-map/pull/176) `3ea9852`; deploy `dpl_JHohCzrJs4JRnbTjy7HFg9eqNBuc` | Painted `inspect-landuse` A1 present. Integer and padded gold and Lockhart |
| Ector identity (earlier) | Parcel-nodes re-keyed geo_id | P-02 apply 75859 active / 3791 retired | Geometry `48135` still not-yet |
| Ledger score (earlier same day) | Flood 76-county score | P-08 score apply | Flood 114 → 162 satisfied; 92 not-yet remain |

### Inspect families (criterion 2)

| Family | Consumer | Status |
| --- | --- | --- |
| parcel-node | Bind key + parcel polygon | serving |
| zoning-fact | Inspect zoning | serving atom-chain |
| setback-rule | Inspect setbacks | serving atom-chain |
| buildable-envelope | Inspect buildable | serving atom-chain |
| road-node | Map near-bbox + attaching-roads | serving |
| flood-hazard-fact | Inspect Flood row | serving live (this session) |
| land-use-fact | Inspect Land use | serving live (this session) |
| cad-parcel-roll | Bake / retiredStore | not the inspect Land use atom |
| owner-fact | HOLD | anonymous inspect never shows owner |
| special-district-fact | HOLD | map slot `live:false` |
| rrc-pipeline-fact | HOLD | `texas-rrc` `live:false` |
| well-fact | HOLD | dormant map slot |
| building-footprint | HOLD | no PE layer |
| rail-corridor-fact | HOLD | dormant |
| property-boundary-edge | HOLD | not this inspect surface |
| code-section / code-cross-reference | HOLD Codex | not SmartSite |

## What's left

### Immediate (this sellable wave)

Closed this pickup. Land-use cortex GET, PE copy, and painted gold Land use row are live. County Manifest cells are unchanged. That is expected.

Execute `_inbox/2026-08-21_landuse_pair_execute.json`.

### Later (not this board ticking)

| Work | Plan | Why Manifest still looks empty |
| --- | --- | --- |
| Roads / footprints / wells / pipelines / rail 0/254 | OPS-18b Wave A. A1 scout: score without new `--apply` is NO-GO | No new ingest this wave. Cells stay not-yet. |
| Honest-absent on sparse rails | Wave A2. Verified-absence pair 0/1025 (R-07 Q5e) | Do not mint absence. MUD ABS is the existing terminal. Wells/pipe/rail cannot copy that yet. |
| Flood 92 not-yet | Wave A1 remainder (63 below 95% + missing-row FIPS) | Score/threshold doctrine, not inspect wire. Inspect gold is already Zone X. |
| Geometry `48135` | DC-2. Named denom 75891 still scores 5% not-yet | Overcount: prefix parcel-nodes include 3791 retired. |
| Depth rails (zoning 1, CAD 22, LU 11, envelope 12) | Wave B Factory 2 / 28-county footprint | Post-sellable. |
| Dual grammar at write | Wave C1 BP-PARCEL-KEY-01. Q8 flood 16/100 unbound | Inspect alias papers over gold. Does not rewrite 100M rows. Manifest unchanged. |
| Sentinels in `entity_id` | C2 `footprint:primary`, `sd:outside` | New writes first. |
| `externalKeys` empty | C3 0/1025 | Identity alias at mint. |
| Property `applies-to` | C4 `atom_links` has no property edges | Edge write at fact persist. |
| HOLD families on SmartSite | Later cards | `mud-pid` / `texas-rrc` stay `live:false`. Do not turn on this wave. Owner HOLD is doctrine. |

### Explicitly out

| Do not start | Why |
| --- | --- |
| Harris PBF / statewide roads apply | Item 6. Slot law. |
| Texas flush 254/254 as sellable | Later launch claim. Empty cells are coverage. |
| Pipedrive / Stripe / pricing popup | Checkout polish. |
| Dashboards G-103 / G-104 | Parked. |
| Filling County Manifest cells as this wave | Heartbeat is the CC gate, not 664 → 3556. |
| Second atoms COUNT(*) | R-07 closed. |
| `image_tag=latest` | Frozen digest trap. |

## What was learned

County Manifest 664/3556 and the same empty columns after this session is the correct observation. The heartbeat moves `computedAt`. Coverage does not move without `--apply` or a score that already has atoms above threshold.

PE-only hauska-map PRs stay BLOCKED without required check context `test` (Command Center CI job id) on the pull_request event. Touching `.github/workflows/command-center-ci.yml` is the working hatch. `workflow_dispatch` of that workflow does not satisfy branch protection.

Vercel does not auto-deploy hauska-map main. PE and cmdcenter are different projects (`prj_vcZGXbqdffk5C20WzaplEpzFynK3` vs `prj_M9jNh8nBEHW0CnaUKlNT4pp4ebpe`). Read `.vercel/project.json` before every deploy.

Land-use `entity_id` is `{parcel}:{taxYear}`. Flood's `entity_id = ANY(parcel keys)` misses. LIKE `_` in parcel ids must be escaped.

A leftover Command Center tab can show STALE against a fresh GET. Customer-done is a hard reload.

## Suggested canonical doc updates

- `90_operations/OPS-18a_path_to_smartsite_market.md` step 6: land-use is PR 450/176, not "in flight agents"; live flood serving is `00529-peg`.
- `_inbox/2026-08-21_sellable_WDLL.md` item 5 leftover: land-use still cad-roll until 450+176 live.
- `_state/property/STATE.md` / combined `_STATE.md`: heartbeat job, flood live, dual-grammar live, land-use PRs, ledger 664/3556. Last generated 2026-08-20.

Doc_repo commits remain planner-owned. This file is uncommitted until Nick goes.

## leave_behind

1. County Manifest empty cells stay coverage. Do not score this pair by 664/3556.
2. Optional copy: painted Land use `A1 — A1` because `landUseLabel` is null on the live atom. Not a cad-roll cite.
3. Eight HOLD families unchanged. Do not turn on `mud-pid` / `texas-rrc`.
