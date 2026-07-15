---
id: 2026-07-15_ossf_septic_records_access_survey
title: OSSF (septic) records-access survey — Central TX 7-county footprint (scoping, no build)
date: 2026-07-15
kind: inbox-scoping
related: [55_spine_data_intelligence_stack, no-special-data-access-stand-on-own-merit]
owner: nick
---

# OSSF (Septic) records-access survey — Central Texas 7-county spine footprint

Scoping survey only; sizes the septic/OSSF data layer queued 2026-07-14 (commit e2a9ad4 in 55). Probes run 2026-07-15 (WebSearch/WebFetch). Every claim carries source + probe result; "needs manual check" marks SPA/JS-gated items.

## Regulatory frame
TCEQ regulates OSSF (30 TAC Ch. 285) but delegates permitting to local Authorized Agents — all 7 spine counties run their own programs. No statewide parcel-level shortcut: TCEQ's published data is annual aggregate counts by county in PDF only (no addresses, no site plans). Every county must be sourced individually. Edwards Aquifer §285.40 overlay adds recharge/contributing-zone requirements in Bexar, Comal, Hays (county is still the permitting agent).

## Master table

| County | Authorized Agent | Access route | Queryable by | Site-plan format | Build difficulty |
|---|---|---|---|---|---|
| **Comal** (48091) | County Engineer / Env. Health (830-608-2090) | **Public portal** cceo.comalcounty.gov/searches/record_search.html + direct scanned PDFs at `/environmental/documents/septic_permits/<num>.pdf` | Owner/subdivision/lot + per-record Map link; address column present, APN-query unconfirmed | Scanned PDF (CCITT fax) — VERIFIED pulled (8.5 MB) | **Easy** |
| **Travis** (48453) | TNR Development Services (512-854-4215) | Pre-2014 Public Access portal (scanned PDFs, no login) + MGO for current | Wildcard; address-vs-permit# unconfirmed | Scanned PDF image files | Easy-Medium |
| Bexar (48029) | County Environmental Services (210-335-6700) — NOT SARA | GovPilot status map + PIR via GovQA | Address/parcel on map; OSSF-status return unconfirmed | Scanned PDF via GovQA | Medium |
| Hays (48209) | Development Services / Env. Health (512-393-2150) | MyGovernmentOnline (+PIR) | MGO search (anonymous access unconfirmed) | Scanned PDF | Medium |
| Williamson (48491) | Dept of Infrastructure / Co. Engineer (512-943-3330) | MGO intake (search account-gated) + PIR | MGO permit search (login) | Scanned PDF | Medium |
| Bastrop (48021) | Development Services — Env. & Sanitation (512-581-7176) | PIR (possible MGO post-2021 per repo wave1 doc — RECONCILE) | PIR by request | Scanned PDF | Medium-Hard |
| Caldwell (48055) | Sanitation Dept — K. Miles (512-398-1803) | PIR / appointment only, no portal | N/A | Scanned PDF | Hard |

## Tiers
- **Tier 1 (public, machine-reachable):** Comal (flagship — predictable PDF URL pattern, verified pull) and Travis pre-2014.
- **Tier 2 (portal, gated/status-only):** Hays + Williamson (both MyGovernmentOnline — one integration serves both plus Travis-current; blocking unknown = anonymous search vs login, needs live browser check); Bexar (GovPilot status map + GovQA PIR docs).
- **Tier 3 (PIR-only):** Bastrop (reconcile the "no portal" finding against the repo wave1 MGO claim), Caldwell (no portal).

**No county exposes a per-parcel OSSF GIS feature service** — two near-hits are false positives (Williamson `ossf_package_plants` = treatment plants; Travis `Septic_Permit_Refund_Area` = flood fee boundary). Nothing to wire like the other map layers; OSSF geometry must be extracted from scanned site plans and georeferenced onto the CAD parcel layer.

## Build phases (a real implementation)
1. **Records pull** — per-county adapters (not one scraper). Comal buildable now (direct HTTP); MGO adapter (Hays/WilCo/Travis-current) gated on anonymous-search confirmation; GovPilot/GovQA for Bexar; PIR human-in-loop for Bastrop/Caldwell. All routes open to any requester — consistent with [[no-special-data-access-stand-on-own-merit]].
2. **Site-plan extraction** — uniform hard problem: every county is scanned raster PDF (Comal confirmed CCITT-fax B&W). OCR the metadata block + vision model for the drawing region (tank/drainfield geometry, setback callouts). Built once.
3. **Georeference** — register the drawing onto the CAD parcel layer. **HARDEST UNKNOWN**: scans carry no coordinate system; registration inferred from parcel geometry + drawing bearings/dimensions; quality varies wildly. De-risk here first, on Comal.
4. **Suitability reasoning** — compose extracted septic geometry with the live SSURGO soils + parcel geometry + hydrology (setbacks, drainfield-vs-soil suitability, well/water conflicts). The payoff that ties into the existing spine layers.

## Recommendation
Start with a **Comal proof-of-concept** — the only county with machine-pullable documents today — and use it to de-risk phase-3 georeferencing (the load-bearing risk) before any multi-county fan-out. The MGO anonymous-search question is the single most valuable manual browser check (it decides whether Hays/WilCo/Travis-current are Tier 1 or Tier 3).

## Open items needing manual (browser) check
MGO anonymous record search vs login (Hays/WilCo/Travis-current); Bastrop MGO-vs-PIR reconciliation against wave1 inventory; Bexar GovPilot status return + GovQA delivery format; Comal address/APN query support + any open-data septic feature service; Travis pre-2014 portal searchable keys; per-parcel EAA §285.40 overlay boundaries.
