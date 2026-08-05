# T6 Texas roster recon scratch

## GROUND-TRUTH (2026-08-05T20:00Z)
- Roster merge: **161 verified / 21 partial / 2 absent / 70 pending** (235 probes)
- North TX batch [fd834d81](fd834d81-f27d-4eea-960c-8184c2a07c0f): 36v/3p/9a in 48 counties — merged

## LESSON
- Tarrant mapit.tarrantcounty.com TADParcels returned 404 2026-08-05 — service may have moved; only ODY_Base on services root
- ArcGIS Online search with "owner:bis" too narrow; `{County}CADWebService` title search works (Calhoun found)
- BIS bulk discovery script with owner:bis query found 0/60 — query formulation matters

## OPEN
- 70 counties still pending CAD probe
- Second adversarial sample on North TX verified counties (Collin layer 4, Anderson GISLINK)
- Tarrant alternate URL discovery

## CLOSED (subagent follow-up 2026-08-05)
- Adversarial review [e68f737d](e68f737d-b550-4024-b77f-89b5ea959184): 5/5 REPRODUCED
- City code recon [82a9f3b2](82a9f3b2-a67c-43fe-bba9-fb17c251bbb3): top-59 merged; operator escalation rows in gap ledger
- North TX CAD probe [fd834d81](fd834d81-f27d-4eea-960c-8184c2a07c0f): batch merged; gap ledger + vendor library updated (Collin L4, Anderson GISLINK, Baylor/Carson token-gated)
