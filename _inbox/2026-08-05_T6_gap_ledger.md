---
id: t6_gap_ledger_v1
title: T6 — Gap ledger (named engineering/acquisition problems)
date: 2026-08-05
status: active
owner: nick
related: [T6_texas_roster_recon_track, _catalog/texas_roster_v1.json]
---

# T6 gap ledger

Every jurisdiction with NO viable source for a required rail, with probe evidence. No silent blanks.

## County — cadastral live REST

| FIPS | County | Gap | Evidence | Fallback |
|---|---|---|---|---|
| 48209 | Hays | No public ArcGIS REST | `_inbox/2026-08-04_county_fan_cadastral_recon.md` | StratMap bulk |
| 48397 | Rockwall | Portal-only SPA | `_inbox/2026-08-04_dfw_phase0_recon.md` | StratMap bulk |
| 48113 | Dallas | Bulk zip only | `_inbox/2026-08-04_dfw_phase0_recon.md` | StratMap + DCAD zip |
| 48439 | Tarrant | REST 404 on re-probe | `_inbox/t6_cad_probe_48439.json` | StratMap bulk |
| 48129 | Donley | No StratMap zip | StratMap matrix 2026-08-02 | CAD direct required |

## County — geometry Rail C

| FIPS | County | Gap | Evidence |
|---|---|---|---|
| 48129 | Donley | StratMap zip HTTP 404 | `_land_records/txgio_stratmap_county_matrix_2026-08-02.json` |

## County — join crosswalk required

48453 Travis (0.5147), 48395 Robertson (1.0), 48359 Oldham (0.9995), 48393 Roberts (0.9992), 48345 Motley (0.5281), 48153 Floyd (0.4559), 48127 Dimmit (0.3913), 48295 Lipscomb (0.3765) — StratMap matrix.

## County — planning

48201 Harris — sharding required (~1.5M parcels).

## Rails — footprints/easements statewide

0/11 onboarded counties have CAD footprint REST (T3 2026-08-05). Default ML-derived. Easements: McLennan 48309 only at county level.

## City — code text (sample)

Webberville TX — no live code host (CAPCOG registry gap). Smithville — eCode360 403 friction. ~1,164 cities publisher unknown-needs-probe (top-59 recon complete per `_inbox/t6_city_code_recon_top50.json`).

## City — operator escalation rows (top-59 recon)

| City | Gap | Publisher track | Evidence |
|---|---|---|---|
| Pflugerville | robots-blocked-escalation | eCode360 PF6442 + EncodePlus `/regs/` disallow | `_inbox/t6_city_code_recon_top50.json` |
| Arlington | general-code partnership | Municode NO-RESULT | same |
| North Richland Hills | general-code partnership | Municode NO-RESULT | same |
| Harlingen | general-code partnership | Municode NO-RESULT | same |
| Cedar Park | eCode360 scraper path | CE6271; ZoningHub not standard REST | same |
| McAllen | eCode360 scraper path | MC6775 | same |

**Corpus-lane readiness:** 48 Municode cities warmable now; Dallas/FW need AmLegal adapter; Bastrop on self-hosted BDC PDF with verified GIS stack.

## Pending

211 counties cadastral verification pending BIS bulk probe (2026-08-05; 34 verified as of last merge).
