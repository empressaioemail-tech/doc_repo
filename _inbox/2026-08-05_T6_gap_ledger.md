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
| 48023 | Baylor | BIS service token-gated (499) | `_inbox/t6_cad_probe_48023.json` | StratMap bulk |
| 48065 | Carson | BIS service token-gated (499) | `_inbox/t6_cad_probe_48065.json` | StratMap bulk |
| 48009 | Archer | No public REST | `_inbox/t6_cad_batch_north_tx.json` | StratMap bulk |
| 48011 | Armstrong | No public REST | `_inbox/t6_cad_batch_north_tx.json` | StratMap bulk |
| 48045 | Briscoe | No public REST | `_inbox/t6_cad_batch_north_tx.json` | StratMap bulk |
| 48075 | Childress | No public REST | `_inbox/t6_cad_batch_north_tx.json` | StratMap bulk |
| 48087 | Collingsworth | No public REST | `_inbox/t6_cad_batch_north_tx.json` | StratMap bulk |

## County — cadastral partial / crosswalk risk

| FIPS | County | Issue | Evidence |
|---|---|---|---|
| 48001 | Anderson | Parcels layer **5** (not 0); no `prop_id` — join via `GISLINK`/`GISLINK2` | `_inbox/t6_cad_probe_48001.json` |
| 48077 | Clay | Layer **21**; count 3,728 vs StratMap 13,521 | `_inbox/t6_cad_probe_48077.json` |
| 48085 | Collin | Parcels layer **4** (not 0); `PROP_ID` string | `_inbox/t6_cad_probe_48085.json` |
| 48113 | Dallas | REST verified (693k) but **bulk-primary** per DFW recon | `_inbox/t6_cad_probe_48113.json` |

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

70 counties cadastral verification still pending (2026-08-05 post-merge: 161 verified, 21 partial, 2 absent, 235 probed total). North TX batch: `_inbox/t6_cad_batch_north_tx.json` (36 verified, 3 partial, 9 absent).
