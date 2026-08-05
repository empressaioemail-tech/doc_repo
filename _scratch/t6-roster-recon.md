# T6 Texas roster recon scratch

## GROUND-TRUTH (2026-08-05T19:45Z)
- Roster checkpoint: `_catalog/texas_roster_v1.json` — 254 counties + 1223 cities
- CAD probes: 21 verified / 3 partial / 3 absent / 227 pending (BIS bulk executor in flight)
- Adversarial: 5/5 REPRODUCED (`_inbox/t6_adversarial_review_summary.json`)
- City top-59: Municode 48, eCode360 3, Houston unzoned verified

## LESSON
- Tarrant mapit.tarrantcounty.com TADParcels returned 404 2026-08-05 — service may have moved; only ODY_Base on services root
- ArcGIS Online search with "owner:bis" too narrow; `{County}CADWebService` title search works (Calhoun found)
- BIS bulk discovery script with owner:bis query found 0/60 — query formulation matters

## OPEN
- BIS bulk executor running for remaining ~227 counties
- Merge + second adversarial pass after bulk completes
- OPS-1 row table needs URL expansion as probes land
- Tarrant alternate URL discovery
