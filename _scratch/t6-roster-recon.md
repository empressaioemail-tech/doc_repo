# T6 Texas roster recon scratch

## GROUND-TRUTH (2026-08-05T20:05Z — BIS bulk close)
- Roster: **173 verified / 22 partial / 59 absent / 0 pending** (253 probes + Hays absent row)
- BIS `{County}CADWebService`: 145 verified; GIS hub fallback: 28 verified
- StratMap Rail C: 253/254 (Donley gap)

## LESSON
- Tarrant mapit.tarrantcounty.com TADParcels returned 404 2026-08-05 — service may have moved; only ODY_Base on services root
- ArcGIS Online search with "owner:bis" too narrow; `{County}CADWebService` title search works (Calhoun found)
- BIS bulk discovery script with owner:bis query found 0/60 — query formulation matters

## OPEN
- 22 partial counties — adversarial re-probe pass
- 48107 Crosby — manual re-probe (prior probe_failed)
- 48201 Harris — HCAD separate planning track (sharding)

## CLOSED (subagent follow-up 2026-08-05)
- Adversarial review [e68f737d](e68f737d-b550-4024-b77f-89b5ea959184): 5/5 REPRODUCED
- City code recon [82a9f3b2](82a9f3b2-a67c-43fe-bba9-fb17c251bbb3): top-59 merged
- North TX CAD probe [fd834d81](fd834d81-f27d-4eea-960c-8184c2a07c0f): batch merged
- BIS bulk CAD probe [26ed74e9](26ed74e9-083b-4f55-b831-2fc9c4bdb106): **253/254 probed, 173v/22p/59a/0 pending** — final roster state
- Central TX CAD probe [387a0942](387a0942-182f-499c-8d48-9b37ebb40a08): superseded by BIS bulk final merge; batch artifact `_inbox/t6_cad_batch_central_tx.json` kept as provenance (Hardeman 48197 false-positive 2.1M count corrected to honestly_absent in bulk pass)
