---
generated: 2026-08-09
lane: F4
county: 48355 Nueces
classification: SOURCE_DEFECT (archive short on east; store matches archive completely)
adversarial_checkpoint: independent extent verification — PASS on store-vs-roster identity
---

# F4 — Nueces 48355 re-pull / extent triangulation

## Coastal trigger (C2)

- Store east **−97.046791** vs L1 boundary east **−96.984281** → gap **0.06251°**
- East-edge band: **2,100** distinct features, σ **0.003351** → **SUSPICIOUS-GAP** (vertical wall)

## Three-frame comparison (2026-08-09 live SQL + roster)

| Frame | east max | west min | south min | north max | count |
|-------|----------|----------|-----------|-----------|-------|
| **L1 county boundary** (`tx_county_boundary`) | **−96.984281** | −97.942146 | 27.558358 | 27.995659 | polygon |
| **Store** (`txgio_parcel` all rows) | −97.046791 | −97.941339 | 27.558500 | 27.995350 | 168,759 rows |
| **Store distinct features** | (same bbox) | | | | **157,198** |
| **Roster / prior apply** (`parcel_count_est`, `featuresRead`) | n/a | n/a | n/a | n/a | **157,198** |

Verbatim SQL outputs:

```
store rows:     168759,-97.941339,-97.046791,27.558500,27.995350
L1 boundary:    -97.942146,-96.984281,27.558358,27.995659
distinct feat:  157198
```

Prior apply artifact `_inbox/2026-08-09_L2_W3R2_48355_declined_idem.json`:

```json
"featuresRead": 157198,
"featuresParsed": 157198,
"declinedCount": 0
```

Roster `_catalog/texas_roster_v1.csv`: **157,198** parcels, vintage 202507.

## Archive re-pull attempt

Direct download from TxGIO URL returned **HTTP 403** from this environment (curl + Invoke-WebRequest). Sweep matrix (2026-08-08) recorded **HTTP 206**, **85,277,395 bytes**, same URL — source was live then.

**Archive header bbox:** not re-measured locally (download blocked). Inference is strong without it:

- `featuresRead` = `distinct feature_index` in store = roster `parcel_count_est` → **ingest is complete, not truncated**
- Store east extent is therefore the archive east extent
- Gap to L1 boundary is **0.06251°** on east (~3.4 nm at this latitude)

## Diagnosis

**SOURCE_DEFECT with identity:** StratMap `stratmap25-landparcels_48355_nueces_202507` appears to omit the eastern coastal parcel cohort relative to L1 county boundary. The 2,100-parcel east wall is a **complete eastern cutoff in source data**, not a reader defect (fail-closed multi-shp reader on main; Harris was the only multi-shp county).

**NOT STORE_DEFECT** — re-ingest under supersede contract would reproduce the same extent unless TxGIO publishes a corrected vintage.

## Recommended actions

1. Operator or alternate egress: re-download zip, run `ogrinfo -al -so` on `.shp` header bbox; attach MD5 to extent report.
2. Record honest absence / `not-yet` for eastern Nueces coastal strip in manifest until a newer StratMap vintage or CAD override closes the gap.
3. Do **not** treat as ingest truncation; idempotency re-run would net zero extent change.

## Adversarial checkpoint (post-fix)

Independent verification: **PASS** on store completeness (`157,198` distinct = roster = apply read count). Archive bbox still owes one ogrinfo read when download unblocks.
