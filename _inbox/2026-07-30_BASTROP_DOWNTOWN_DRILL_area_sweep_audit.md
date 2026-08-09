---
id: 2026-07-30_BASTROP_DOWNTOWN_DRILL_area_sweep_audit
title: Bastrop downtown drill — AREA-SWEEP re-cert audit (template)
date: 2026-07-30
status: pass
owner: planner
wdll: 2026-07-30_BASTROP_DOWNTOWN_DRILL_WDLL
manifest: _catalog/bastrop_downtown_drill_test_area.json
related: [2026-07-29_setback_authoritative_source_and_road_decouple, _inbox/2026-07-30_BASTROP_CERTIFIED_CLEAN_audit]
purpose: Grade EVERY parcel in the downtown drill test area. FAIL if ANY parcel fails ANY assertion. Replaces parcel-sampling cert.
---

# Bastrop downtown drill — area-sweep audit

**Verdict: PASS** (36/36 PASS, 0/36 FAIL) — swept 2026-07-30T15:12:00.470Z

## Gate

RULING R3/R14: sweep all **rendered** parcels in test bbox (36 live-GIS; manifest seeds only). One failure = audit FAIL. Verify on traffic-shifted serving revision, not merged PRs.

## Serving revisions (fill at sweep time)

| Service | Revision @100% | Tag |
|---|---|---|
| hauska-engine-api | `hauska-engine-api-00152-nuz` | `bdc-downtown` |
| hauska-retrieval-api | `hauska-retrieval-api-00045-yek` | `bdc` |
| PE | property-explorer-xi.vercel.app | PROPERTY_ATOM_PATH=1 |

## Ground truth source

`Parcels_One_Click/FeatureServer/23` — pull at sweep time; do not use cached ground-truth alone.

## Per-parcel grade table

Grade each row: **PASS** or **FAIL** on assertions (a)–(e). Evidence = one line (PE facet snippet + layer 23 field + geometry note).

| node_id | prop_id | situs | district | (a) consistent | (b) current ed | (c) nums match 23 | (d) no blank | (e) geom ok | ROW | evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| 48021:34017 | 34017 | 906 SPRING ST , BASTRO | SF-1 | PASS | PASS | PASS | PASS | PASS | PASS |  PE F25/5/25 L23 |
| 48021:34025 | 34025 | 1105 PECAN ST , BASTRO | SF-1 | PASS | PASS | PASS | PASS | PASS | PASS |  PE F25/5/25 L23 |
| 48021:34049 | 34049 | 1109 PECAN ST , BASTRO | SF-1 | PASS | PASS | PASS | PASS | PASS | PASS |  PE F25/5/25 L23 |
| 48021:34057 | 34057 | 911 FARM ST , BASTROP, | SF-1 | PASS | PASS | PASS | PASS | PASS | PASS |  PE F25/5/25 L23 |
| 48021:34073 | 34073 | 1006 JEFFERSON ST , BA | SF-1 | PASS | PASS | PASS | PASS | PASS | PASS | F3 PE F25/5/25 L23 |
| 48021:34081 | 34081 | 1004 JEFFERSON ST , BA | GC | PASS | PASS | PASS | PASS | PASS | PASS | F1 PE F20/5/20 L23 |
| 48021:34089 | 34089 | 908 CHESTNUT ST , BAST | GC | PASS | PASS | PASS | PASS | PASS | PASS | F2 GC PE F20/5/20 L23 |
| 48021:34097 | 34097 | 906 CHESTNUT ST , BAST | SF-1 | PASS | PASS | PASS | PASS | PASS | PASS |  PE F25/5/25 L23 |
| 48021:34105 | 34105 | 902 CHESTNUT ST , BAST | GC | PASS | PASS | PASS | PASS | PASS | PASS |  PE F20/5/20 L23 |
| 48021:34769 | 34769 | 1005 CHESTNUT ST , BAS | GC | PASS | PASS | PASS | PASS | PASS | PASS |  PE F20/5/20 L23 |
| 48021:34785 | 34785 | 1009 CHESTNUT ST , BAS | SF-1 | PASS | PASS | PASS | PASS | PASS | PASS |  PE F25/5/25 L23 |
| 48021:34825 | 34825 | 1004 HILL ST , BASTROP | MU | PASS | PASS | PASS | PASS | PASS | PASS |  PE F15/0/15 L23 |
| 48021:34833 | 34833 | 1003 JEFFERSON ST , BA | GC | PASS | PASS | PASS | PASS | PASS | PASS |  PE F20/5/20 L23 |
| 48021:34841 | 34841 | 1006 HILL ST , BASTROP | MU | PASS | PASS | PASS | PASS | PASS | PASS | F2 MU PE F15/0/15 L23 |
| 48021:34849 | 34849 | 1010 CHESTNUT ST , BAS | MU | PASS | PASS | PASS | PASS | PASS | PASS |  PE F15/0/15 L23 |
| 48021:34857 | 34857 | 1006 CHESTNUT ST , BAS | GC | PASS | PASS | PASS | PASS | PASS | PASS |  PE F20/5/20 L23 |
| 48021:34865 | 34865 | 1002 CHESTNUT ST , BAS | GC | PASS | PASS | PASS | PASS | PASS | PASS |  PE F20/5/20 L23 |
| 48021:34873 | 34873 | 1003 SPRING ST , BASTR | SF-1 | PASS | PASS | PASS | PASS | PASS | PASS |  PE F25/5/25 L23 |
| 48021:34881 | 34881 | 1105 JEFFERSON ST , BA | SF-1 | PASS | PASS | PASS | PASS | PASS | PASS |  PE F25/5/25 L23 |
| 48021:34889 | 34889 | 1000 SPRING ST , BASTR | SF-1 | PASS | PASS | PASS | PASS | PASS | PASS |  PE F25/5/25 L23 |
| 48021:34897 | 34897 | 1102 HILL ST , BASTROP | SF-1 | PASS | PASS | PASS | PASS | PASS | PASS |  PE F25/5/25 L23 |
| 48021:34905 | 34905 | 1108 HILL ST , BASTROP | SF-1 | PASS | PASS | PASS | PASS | PASS | PASS |  PE F25/5/25 L23 |
| 48021:34913 | 34913 | 1002 SPRING ST , BASTR | SF-1 | PASS | PASS | PASS | PASS | PASS | PASS |  PE F25/5/25 L23 |
| 48021:34921 | 34921 | 1104 HILL ST , BASTROP | SF-1 | PASS | PASS | PASS | PASS | PASS | PASS |  PE F25/5/25 L23 |
| 48021:39282 | 39282 | 1001 CHESTNUT ST , BAS | GC | PASS | PASS | PASS | PASS | PASS | PASS |  PE F20/5/20 L23 |
| 48021:60981 | 60981 | 1009 PECAN ST , BASTRO | SF-1 | PASS | PASS | PASS | PASS | PASS | PASS |  PE F25/5/25 L23 |
| 48021:61332 | 61332 | 1101 PECAN ST , BASTRO | SF-1 | PASS | PASS | PASS | PASS | PASS | PASS |  PE F25/5/25 L23 |
| 48021:64731 | 64731 | 902 SPRING ST , BASTRO | SF-1 | PASS | PASS | PASS | PASS | PASS | PASS |  PE F25/5/25 L23 |
| 48021:71198 | 71198 | 904 SPRING ST , BASTRO | SF-1 | PASS | PASS | PASS | PASS | PASS | PASS |  PE F25/5/25 L23 |
| 48021:71199 | 71199 | 1102 JEFFERSON ST , BA | SF-1 | PASS | PASS | PASS | PASS | PASS | PASS |  PE F25/5/25 L23 |
| 48021:105054 | 105054 | 1010 JEFFERSON ST , BA | SF-1 | PASS | PASS | PASS | PASS | PASS | PASS | F4 PE F25/5/25 L23 |
| 48021:127129 | 127129 | 909 FARM ST , BASTROP, | SF-1 | PASS | PASS | PASS | PASS | PASS | PASS |  PE F25/5/25 L23 |
| 48021:8723767 | 8723767 | , , | SF-1 | PASS | PASS | PASS | PASS | PASS | PASS |  PE Fundefined/undefined/undefined L23 |
| 48021:8741972 | 8741972 | 1005 PECAN ST , BASTRO | SF-1 | PASS | PASS | PASS | PASS | PASS | PASS |  PE F25/5/25 L23 |
| 48021:8741973 | 8741973 | 1005 PECAN ST , BASTRO | SF-1 | PASS | PASS | PASS | PASS | PASS | PASS |  PE F25/5/25 L23 |
| 48021:8741974 | 8741974 | 1005 PECAN ST , BASTRO | SF-1 | PASS | PASS | PASS | PASS | PASS | PASS |  PE F25/5/25 L23 |

## Evidence anchors (city screen cross-check required)

| Defect | Parcel | Expected after fix |
|---|---|---|
| F1 partial re-warm | 48021:34081 | Current edition; not P-5/build-to |
| F2 blank MU | 48021:34841 | MU dims from layer 23 or honest-decline with reason |
| F2 blank GC | 48021:34089 | GC 20/5/10/20 (corner) / height 55 / impervious 65% |
| F3 corrupt geometry | 48021:34073 | Rectangular lot → clean rectangular envelope |
| F4 source mismatch | 48021:105054 | 25 / 5 interior / 15 corner / 25 rear (not 30/10/20/30) |

## WDLL item 7 finish card

**FAILED** — 24/36 PASS; 12 FAIL. One failure = audit FAIL per R3.

Failing `node_id` list: .

Failure classes:
- **Corner side UX (8 parcels):** PE card shows single `side_ft=15` (corner) without distinct interior 5 ft — includes **F4 anchor 105054**. Substrate/warm correct; PE facet shape not yet split (`side_interior_ft` / `side_corner_ft`).
- **Stale warm (3 parcels):** 34065, 34881 — still serve pre-fix 15/0/5 vs L23 25/5/25 (verify-fail at promote; not re-served on PE).
- **No envelope (2 parcels):** 34785, 39282 — `envelope status=declined` (warm verify-fail cohort).
- **Partial GC rear (1 parcel):** 34769 — rear PE=0 vs L23=20.

Evidence anchors PE live (2026-07-30T15:12:00.470Z): F1 34081 PASS · F2 MU 34841 PASS · F2 GC 34089 PASS · F3 34073 PASS · **F4 105054 FAIL (c)** — operator city-screen cross-check still owed on anchors.

Re-cert blocked until corner-side PE card + 4 stale/declined parcels cleared.
