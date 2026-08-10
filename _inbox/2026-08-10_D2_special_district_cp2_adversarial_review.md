---
id: 2026-08-10_D2_special_district_cp2_adversarial_review
title: Special-district rail CP2 — post dry-run adversarial review
date: 2026-08-10
checkpoint: CP2 (after 48201 + 48021 dry-runs)
---

# CP2 — post dry-run adversarial review

## Harris ratio (48201) — CP1 pre-registration

| CP1 band (all-type) | 12% – 32% (mid 22%) |
|---|---|
| **Measured dry-run** | **95.09%** (1,523,291 / 1,602,027 parcels) |
| **CP1 verdict** | **REFUTED** for whole-layer membership |

**Why CP1 was wrong:** CP1 assumed MUD-sized suburban footprints. The build correctly ingests the **whole TCEQ layer** (17 TYPE values). Harris carries ~22 large regional water-authority / OTH polygons (e.g. North Harris County Regional Water Authority) that blanket most of the county. Independent random-20k probe: **99.97%** any-type hit rate; **MUD-only subset ~25.2%** — consistent with CP1's original MUD-centric intuition.

**Defect hunt:** PIP sanity checks pass (west Texas 0 hits; Galveston Bay 0; downtown 4 typed hits). No proximity/buffer API. Overlap emits multiple present rows per parcel (avg ~4.1 memberships/in-district parcel in Harris).

## Bastrop ratio (48021) — regression

| CP1 band | 3% – 15% (mid 8%) |
|---|---|
| **Measured** | **14.63%** (10,932 / 74,726) |
| **Verdict** | **CONFIRMED** within band |

## Statewide-negative string hunt

- Absence kind: `outside-tceq-source-boundaries` only
- Sample dry-run reasons cite `tx_special_district` scope; no forbidden phrases in `BANNED_STATEWIDE_ABSENCE_PHRASES` test seam
- **No output string found** reading as "this parcel is in no special district statewide"

## Comptroller rate enrichment

`rateEnrichedCount: 0` on both counties — registry CSV loaded, join by normalized `{countyFips}|{comptrollerEntityType}|{districtName}` matched zero TCEQ names. **Honest optional absence** (not zero substituted). Name reconciliation is a follow-up, not a ship blocker for DRY-RUN.

## CP2 verdict

**ACCEPT** dry-run counts. Harris high all-type ratio is **expected geometry**, not PIP defect. Ship contract + engine PRs; `--apply` remains held.
