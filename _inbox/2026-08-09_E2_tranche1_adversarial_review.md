---
id: 2026-08-09_E2_tranche1_adversarial_review
title: Adversarial review - E2 tranche 1 CAD source registry (W5 F1)
date: 2026-08-09
status: review finding (read-only; live HTTP probes; registry JSON not modified)
owner: E2-ADV
method: 10% sample (7 FIPS) live four-point probe per OPS-1; honest_absent reproduction; schema E2-1 check
reviews: _catalog/tx_cad_source_registry.json tranche 1 (35 rows) vs builder close 2026-08-09
related:
  - _dispatches/2026-08-09_W5_depth_factory_dispatch_pack.md
  - _inbox/2026-08-09_E2_tranche1_builder_close.json
  - _inbox/2026-08-09_E2_tranche1_preregistered_expectations.json
---

# E2 tranche 1 adversarial review (W5 F1 CAD registry)

**VERDICT: PASS**

**Tranche grade:** PASS (35-row tranche; adversarial sample reproduces builder claims; no refuted verified REST row in sample)

Reviewer: E2-ADV (independent of builder). Probed at 2026-08-09 (live HTTP).

---

## Pre-registered sample

Rule: 10% of tranche 1 (35 rows), minimum 5, plus mandatory gap-fill **48209** and bulk/partial **48439**.

| FIPS | County | Registry probe_status | In sample |
|------|--------|----------------------|-----------|
| 48021 | Bastrop | verified | yes (builder suggested) |
| 48031 | Blanco | verified | yes |
| 48053 | Burnet | verified | yes |
| 48055 | Caldwell | verified | yes |
| 48149 | Fayette | verified | yes |
| 48209 | Hays | honestly_absent | yes (mandatory gap-fill) |
| 48439 | Tarrant | partial | yes (mandatory bulk/partial) |

Additional honest_absent reproduction (brief requirement): **48163** Frio, **48255** Karnes, **48397** Rockwall.

---

## Pre-registered expectations (E2-1 through E2-4)

| ID | Result | Evidence |
|----|--------|----------|
| E2-1 schema_portability | PASS | `_schema.generic_design_note` documents generic field names; `format_enum` and `auth_posture_enum` are not TX-only. Row values use TX COG labels in `cog_region`; header maps to regional_council. |
| E2-2 honest_absent | PASS | 48209, 48163, 48255, 48397: `format=honest_absent`, `auth_posture=absent`, `public_rest_endpoint=false`, `service_url=null`. Live probes reproduce absence. |
| E2-3 adversarial_sample | PASS | Five verified REST rows reproduce triplet and four-point probe. 48439 REST triplet non-functional but matches documented partial status. |
| E2-4 no_privileged | PASS | No Cotality/Regrid paths. Rockwall candidate returns token required (499), excluded from public REST. |

---

## Four-point probe results (OPS-1)

Steps: (1) service root / layer metadata, (2) `prop_id_field` exact casing, (3) sample polygon query features, (4) feature count.

### 48021 Bastrop (verified)

- Registry: `BastropCADWebService/FeatureServer`, layer **0**, `prop_id_field` **prop_id**
- (1) `.../FeatureServer?f=json` **HTTP 200**
- (2) Layer `.../0?f=json` **HTTP 200**; **prop_id** in fields
- (3) Query sample **HTTP 200**; **1** feature
- (4) Count **65285** (registry 65285)
- **REPRODUCED**

### 48031 Blanco (verified)

- Registry: `BlancoCADWebService/FeatureServer`, layer **0**, **prop_id_text**
- (1) **HTTP 200** | (2) **HTTP 200**; **prop_id_text** present | (3) **HTTP 200**; 1 feature | (4) **14696**
- **REPRODUCED**

### 48053 Burnet (verified)

- Registry: `BurnetCADWebService1/FeatureServer`, layer **0**, **prop_id_text**
- (1) **HTTP 200** | (2) **HTTP 200**; **prop_id_text** | (3) **HTTP 200**; 1 feature | (4) **50645**
- **REPRODUCED**

### 48055 Caldwell (verified)

- Registry: `Caldwell_County_Parcel_Map/FeatureServer`, layer **1**, **Prop_ID**
- (1) **HTTP 200** | (2) **HTTP 200**; **Prop_ID** | (3) **HTTP 200**; 1 feature | (4) **27445**
- **REPRODUCED**

### 48149 Fayette (verified)

- Registry: `FayetteCADWebService/FeatureServer`, layer **0**, **prop_id**
- (1) **HTTP 200** | (2) **HTTP 200**; **prop_id** | (3) **HTTP 200**; 1 feature | (4) count **23151** live vs registry **23147** (+4 drift only)
- **REPRODUCED**

### 48209 Hays (honest_absent)

- Registry: `service_url` null, `format=honest_absent`
- `https://maps.co.hays.tx.us/arcgis/rest/services?f=json` **HTTP 200**; 1 service; **0** parcel/CAD-like names
- **ABSENCE REPRODUCED**

### 48439 Tarrant (partial / bulk)

- Registry: `bulk_export`, `probe_status=partial`, `public_rest_endpoint=false`
- Stored URL: `https://mapit.tarrantcounty.com/arcgis/rest/services/TADParcels/FeatureServer`, layer **0**, **prop_id**
- (1) FeatureServer `?f=json` **HTTP 200** body `error.code` **404** (`Service TADParcels/MapServer not found`)
- (2) Layer `.../0?f=json` **HTTP 200** body same **404** (no fields)
- (3) Query **HTTP 200** body same **404**; **0** features
- (4) count unavailable
- Matches `_inbox/t6_cad_probe_48439.json`. **REST triplet not reproducible (expected); partial status reproduced**

**Report-only correction:** F1 factory must gate on `format`/`probe_status` before using Tarrant `service_url`. ArcGIS returns **HTTP 200** with error JSON, not a working layer list.

---

## Honest_absent rows 48163, 48255, 48397

| FIPS | Live probe | HTTP | Result |
|------|------------|------|--------|
| 48163 Frio | ArcGIS search `FrioCADWebService` | **200** | 0 hits; absence reproducible |
| 48255 Karnes | ArcGIS search `KarnesCADWebService` | **200** | 0 hits; absence reproducible |
| 48397 Rockwall | `Rockwall_County_Parcel_Data/FeatureServer` | **200** | `error.code` **499** Token Required; not public anonymous REST |

---

## Fail-tranche rule

Verified sample rows **48021, 48031, 48053, 48055, 48149** all reproduce `service_url`, `layer_id`, and `prop_id_field`. Honest_absent rows reproduce documented absence. **48439** does not yield working REST but is not claimed verified. **Tranche not failed.**

---

## Builder close cross-check

- 35 rows, 30 verified REST, 4 honest_absent, 1 partial: consistent with adversarial findings.
- Builder `sample_rows_for_review`: all five **REPRODUCED**.

---

## Summary

| Item | Value |
|------|-------|
| Verdict | **PASS** |
| Rows probed | 48021, 48031, 48053, 48055, 48149, 48209, 48439, 48163, 48255, 48397 |
| Failures | None in verified sample; Tarrant REST dead as documented |
| Artifact | `_inbox/2026-08-09_E2_tranche1_adversarial_review.md` |
