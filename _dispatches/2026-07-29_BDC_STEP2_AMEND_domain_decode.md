---
id: 2026-07-29_BDC_STEP2_AMEND_domain_decode
title: Amendment — STEP 2 ZoneTypeClass coded-domain decode (SF-1 not 3)
date: 2026-07-29
amends: 2026-07-29_BDC_STEP2_zoning_stamp_zoned_parcels
---

# STEP 2 amendment — coded domain

Planner LIVE probe 2026-07-29: Zoned_Parcels/83 `ZoneTypeClass` is SmallInteger coded domain. prop_id 105054 → code 3 = SF-1.

Stamp MUST emit domain NAME string (`SF-1`), never the integer `3`. Prefer ZoneTypeClass over ZoneType. CORRECTION A unchanged (do not copy FrontSetback/etc into setback table).
