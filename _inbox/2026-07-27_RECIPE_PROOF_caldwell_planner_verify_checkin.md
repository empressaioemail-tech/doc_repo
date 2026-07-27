---
id: 2026-07-27_RECIPE_PROOF_caldwell_planner_verify_checkin
title: Check-in — RECIPE-PROOF Caldwell #2 planner verify (7 held / 1 new-baked)
status: check-in
date: 2026-07-27
planner: depth-engine planning agent
pr: https://github.com/empressaioemail-tech/hauska-engine/pull/145
merge: 8b0734c9f888b0adbdd0c7608cadea0cf6dbd8f8
merged_at: 2026-07-27T14:02:23Z
executor: _inbox/2026-07-27_RECIPE_PROOF_caldwell_executor_close.md
---

# RECIPE-PROOF Caldwell — planner verify (MEASUREMENT)

Framing held: this is N held / M new-baked, not pass/fail. CTX HELD. Hays #3 gated on operator go (M0 promotion landed this check-in).

## Planner live evidence (2026-07-27T14:00Z–14:05Z)

Independent of executor report.

### Depth tally (`pnpm run tally-caldwell-depth`)

```json
{
  "at": "2026-07-27T14:00:47.498Z",
  "road_nodes": 5171,
  "zoning_facts_with_district": 6490,
  "zoning_place_type": 5027,
  "place_type_district_codes": ["RHD", "RLD", "RMD"],
  "depth_warm_promoted": 337,
  "depth_ratio_place_type_pct": 6.7038,
  "depth_ratio_all_pct": 5.1926,
  "txgio_parcel_48055": 32781
}
```

Matches executor close. **Matches.**

### Provenance split (planner SELECT)

```
county-roadway-authoritative     = 2273
approximate-assumed-per-class    = 1887
county-roadway-undefined         = 1011
total                            = 5171
```

**Matches.**

### Smoke

```
48055:103533  depthWarmPromotion=depth-warm-promoted-v1  areaSqFt=14177
verifiedAt=2026-07-27T13:03:06.409Z
```

**Matches.**

### Cost (from executor pilot JSON — under commitment #3)

```
extrapolatedJurisdictionUsd ≈ 0.39–0.40
flaggedOverCostGate = false
costGateUsd = 200
```

Accepted. Dollar gate clear; wall hours ~9 for full place-type extrapolation is compute, not the $200 human+compute kill.

### UNREACHABLE-CITY-GIS (planner independent DNS)

```
gis.lockhart-tx.org  → DNS NXDOMAIN
maps.lockhart-tx.org → DNS NXDOMAIN
```

Recon miss is real. New decision accepted for promotion.

### PR / CI

PR [#145](https://github.com/empressaioemail-tech/hauska-engine/pull/145) SHA `6f2505e` — `typecheck + test` SUCCESS. **MERGED** squash `8b0734c` @ 2026-07-27T14:02:23Z.

## Per-gate grades (planner)

| Gate | Executor | Planner | Note |
|------|----------|---------|------|
| 1 Descriptor | HELD | **HELD** | RLD/RMD/RHD fit `(district, road-class, edge-role)` — early RE-OPEN hypothesis on flat→indexed lift was wrong; shape held |
| 2 Intake+recon | RE-OPENED | **RE-OPENED** | UNREACHABLE-CITY-GIS confirmed; SCHEMA≠DATA still applied (not re-derived) |
| 3 Front labeling | HELD | **HELD** | fixtures green; no new case |
| 4 Rule | HELD | **HELD** | alley feet honest-absent |
| 5 Reasoning | HELD | **HELD** | smoke inset present; no 28286-class false-reject observed in cohort |
| 6 Warm/verify/promote | HELD | **HELD** | mechanical verify; cohort proof only (not full Lockhart ceiling) |
| 7 Tally+cost | HELD | **HELD** | live SELECT + cost under #3 |
| 8 Smoke | HELD | **HELD** | named atom live |

## Generalization number (honest)

- **N held = 7**
- **M new-baked = 1** (UNREACHABLE-CITY-GIS → 27d recipe gate)

M0-reach miss list: **none** (planner concurs).

### Honesty caveats (not failures)

1. Depth **6.70%** is a **cohort proof** (≈500 Lockhart place-type promotes), not Caldwell market-ready ceiling. Mold measurement still valid.
2. Luling / Martindale / Mustang Ridge not in this measurement.
3. Mechanical vitest asserting UNREACHABLE verdict in recon fixture is **owed hardening** (fixture JSON exists; test preferred over prose alone).

## M0 promotion (planner-owned — landed)

- Amended `27d_county_onboarding_recipe_and_fleet_reliability.md` Gate 3 with **UNREACHABLE-CITY-GIS**.
- Scratch `_scratch/county-48055.md` + `_scratch/depth-engine-27c.md` updated.
- Thesis parity ledger entry appended.

## Verdict on "is start county X real yet?"

Closer. On Caldwell, **7/8 gates carried** without re-figuring Bastrop decisions; **1 new decision** surfaced and was baked. That is a strong mold signal — not a greenlight for unattended CTX fan-out. Still need: (a) Hays #3 second data point, (b) UNREACHABLE vitest hardening, (c) operator go. **CTX HELD.**

## Next

1. ~~Merge PR #145~~ done `8b0734c`.
2. Fan Hays #3 RECIPE-PROOF only after operator go.
3. Do not open CTX fan-out.
