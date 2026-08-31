---
id: 2026-08-10_D2_mud_cp1_adversarial_review
title: MUD rail CP1 — pre-code adversarial review
date: 2026-08-10
checkpoint: CP1 (before implementation)
---

# CP1 — pre-code adversarial review

## Pre-registered Harris in-district parcel ratio (48201)

**Inputs (planner-verified 2026-08-10):**

| Input | Value |
|---|---|
| Harris county FIPS | 48201 |
| TCEQ polygons in FIPS `201` (TX_CNTY/FIPS field) | **638** (all types) |
| TCEQ MUD polygons in Harris | **514** |
| Harris `txgio_parcel` rows (post multi-shp reload) | **~1,602,031** |

**Ratio hypothesis (pre-code, falsifiable at CP2):**

| Metric | Lower | Mid | Upper |
|---|---|---|---|
| Parcels with ≥1 intersecting TCEQ water-district polygon | **12%** | **22%** | **32%** |
| Absolute parcel count (mid) | ~192k | ~352k | ~512k |

**Reasoning:** MUD/WCID belts cluster in suburban greenfield (Katy, Cypress, Kingwood, Clear Lake fringe). Downtown, industrial east side, Port, and large rural west tracts sit outside water-district boundaries. 638 polygons cannot cover a majority of 1.6M parcels without implausible overlap density.

**Bastrop regression (48021):** pre-register **3%–15%**, mid **8%** — smaller county, fewer but denser MUD footprints around Bastrop/Smithville growth corridors.

## Attacks on binary membership design

| Attack | Expected mitigation |
|---|---|
| Proximity/buffer creep ("near MUD" ⇒ in MUD) | **REJECT.** Code comments + tests: PIP only; no distance threshold API |
| Adjacency semantics | **REJECT.** Neighbor parcel in MUD does not imply membership |
| First-hit-only when multiple districts overlap | **REJECT.** Emit one atom per intersecting polygon (0..N present) |
| Statewide negative strings | **REJECT.** Absence kind `outside-tceq-source-boundaries` + scoped reason; test bans forbidden phrases |
| `no-special-district` without source scope | **REJECT.** Reason must cite `tx_special_district` / TCEQ layer incompleteness |

## CP1 verdict

**PROCEED** with implementation constraints above. CP2 will refute or confirm Harris ratio against dry-run counts.
