---
id: tx_cad_source_registry_coverage_summary
title: TX CAD source registry — tranche 1 coverage summary
date: 2026-08-09
status: adversarial PASS (E2-ADV 2026-08-09)
owner: E2-recon-executor
related: [_catalog/tx_cad_source_registry.json, 90_operations/OPS-1_texas_source_registry.md, _dispatches/2026-08-09_W5_depth_factory_dispatch_pack.md]
---

# TX CAD source registry — tranche 1 coverage summary

Tranche 1 scope: **CAPCOG + AACOG corridor + NCTCOG Dallas metro** (35 appraisal districts). Rows transformed from `_inbox/t6_cad_probe_{fips}.json` artifacts (2026-08-05 batch) with one live gap-fill (Hays 48209).

> Doctrine: figures below are **source availability / registry probe state**, not data-loaded or served-to-product claims. See OPS-1 correction blocks.

**Total rows:** 35

## Public REST endpoint summary

| Metric | Count |
|---|---|
| Public REST endpoint (yes) | 30 |
| Public REST endpoint (no) | 5 |
| Probe status verified | 30 |
| Probe status partial | 1 |
| Probe status honestly absent / not found | 4 |
| Format honest_absent | 4 |
| Auth posture bulk_only | 2 |

## Per COG region

| COG | Rows | Public REST yes | Public REST no | verified | partial | absent |
|---|---|---|---|---|---|---|
| CAPCOG | 11 | 10 | 1 | 10 | 0 | 1 |
| AACOG | 11 | 9 | 2 | 9 | 0 | 2 |
| NCTCOG | 13 | 11 | 2 | 11 | 1 | 1 |

## Crosswalk-required counties in tranche 1

- **Travis** (48453): prop_id_bad_rate=0.5147

## Honest-absent counties (success rows)

- **Hays** (48209, CAPCOG): E2 gap-fill 2026-08-09: no authoritative CAD parcel REST on maps.co.hays.tx.us; StratMap fallback
- **Frio** (48163, AACOG): no public CAD REST
- **Karnes** (48255, AACOG): no public CAD REST
- **Rockwall** (48397, NCTCOG): No public ArcGIS REST parcel service found after search + host patterns

## Gaps / follow-up

- Live gap-fill probes run: 48209
- Partial rows without live feature count (adversarial re-probe candidate): Tarrant (48439)

## Adversarial checkpoint

Planner fans E2-ADV: 10% sample (min 5) live four-point re-probe before tranche close.
