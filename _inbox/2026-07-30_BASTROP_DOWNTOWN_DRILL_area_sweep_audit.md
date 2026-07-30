---
id: 2026-07-30_BASTROP_DOWNTOWN_DRILL_area_sweep_audit
title: Bastrop downtown drill — AREA-SWEEP re-cert audit (template)
date: 2026-07-30
status: pending
owner: planner
wdll: 2026-07-30_BASTROP_DOWNTOWN_DRILL_WDLL
manifest: _catalog/bastrop_downtown_drill_test_area.json
related: [2026-07-29_setback_authoritative_source_and_road_decouple, _inbox/2026-07-30_BASTROP_CERTIFIED_CLEAN_audit]
purpose: Grade EVERY parcel in the downtown drill test area. FAIL if ANY parcel fails ANY assertion. Replaces parcel-sampling cert.
---

# Bastrop downtown drill — area-sweep audit

**Verdict: PENDING** (planner fills after STEP 5 deploy + LIVE sweep)

## Gate

RULING R3 (AMENDMENT 3): sweep all **36** manifest parcels. One failure = audit FAIL. Verify on traffic-shifted serving revision, not merged PRs.

## Serving revisions (fill at sweep time)

| Service | Revision @100% | Tag |
|---|---|---|
| hauska-engine-api | _(fill)_ | _(fill)_ |
| hauska-retrieval-api | _(fill)_ | _(fill)_ |
| PE | property-explorer-xi.vercel.app | PROPERTY_ATOM_PATH=1 |

## Ground truth source

`Parcels_One_Click/FeatureServer/23` — pull at sweep time; do not use cached ground-truth alone.

## Per-parcel grade table

Grade each row: **PASS** or **FAIL** on assertions (a)–(e). Evidence = one line (PE facet snippet + layer 23 field + geometry note).

| node_id | prop_id | situs | district | (a) consistent | (b) current ed | (c) nums match 23 | (d) no blank | (e) geom ok | ROW |
|---|---|---|---|---|---|---|---|---|---|
| 48021:34017 | 34017 | | | | | | | | |
| 48021:34025 | 34025 | | | | | | | | |
| 48021:34049 | 34049 | | | | | | | | |
| 48021:34057 | 34057 | | | | | | | | |
| 48021:34065 | 34065 | 1005 PECAN | | | | | | | |
| 48021:34073 | 34073 | 1006 JEFFERSON | | | | | | | **F3 anchor** |
| 48021:34081 | 34081 | 1004 JEFFERSON | | | | | | | **F1 anchor** |
| 48021:34089 | 34089 | 908 CHESTNUT | | | | | | | **F2 GC anchor** |
| 48021:34097 | 34097 | 906 CHESTNUT | | | | | | | |
| 48021:34105 | 34105 | | | | | | | | |
| 48021:34121 | 34121 | | | | | | | | |
| 48021:34145 | 34145 | | | | | | | | |
| 48021:34153 | 34153 | | | | | | | | |
| 48021:34769 | 34769 | | | | | | | | |
| 48021:34785 | 34785 | | | | | | | | |
| 48021:34825 | 34825 | | | | | | | | |
| 48021:34833 | 34833 | | | | | | | | |
| 48021:34841 | 34841 | 1006 HILL | | | | | | | **F2 MU anchor** |
| 48021:34849 | 34849 | | | | | | | | |
| 48021:34857 | 34857 | | | | | | | | |
| 48021:34865 | 34865 | | | | | | | | |
| 48021:34873 | 34873 | | | | | | | | |
| 48021:34881 | 34881 | | | | | | | | |
| 48021:34889 | 34889 | | | | | | | | |
| 48021:34897 | 34897 | | | | | | | | |
| 48021:34905 | 34905 | | | | | | | | |
| 48021:34913 | 34913 | | | | | | | | |
| 48021:34921 | 34921 | | | | | | | | |
| 48021:39282 | 39282 | | | | | | | | |
| 48021:60981 | 60981 | | | | | | | | |
| 48021:61332 | 61332 | | | | | | | | |
| 48021:64731 | 64731 | | | | | | | | |
| 48021:71198 | 71198 | | | | | | | | |
| 48021:71199 | 71199 | | | | | | | | |
| 48021:105054 | 105054 | 1010 JEFFERSON | | | | | | | **F4 anchor** |
| 48021:127129 | 127129 | | | | | | | | |

## Evidence anchors (city screen cross-check required)

| Defect | Parcel | Expected after fix |
|---|---|---|
| F1 partial re-warm | 48021:34081 | Current edition; not P-5/build-to |
| F2 blank MU | 48021:34841 | MU dims from layer 23 or honest-decline with reason |
| F2 blank GC | 48021:34089 | GC 20/5/10/20 (corner) / height 55 / impervious 65% |
| F3 corrupt geometry | 48021:34073 | Rectangular lot → clean rectangular envelope |
| F4 source mismatch | 48021:105054 | 25 / 5 interior / 15 corner / 25 rear (not 30/10/20/30) |

## WDLL item 7 finish card

_(Planner: met | failed + failing prop_ids list)_
