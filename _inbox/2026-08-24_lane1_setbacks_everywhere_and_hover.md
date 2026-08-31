---
id: 2026-08-24_lane1_setbacks_everywhere_and_hover
title: Lane 1 leftovers — Pflugerville setbacks + hover multi-shape
status: open
date: 2026-08-24
plan_row: P-60
supersedes_mechanism: 2026-08-24T14:40Z scratch said no-parcel / geocode-low; live probe 2026-08-24T15:23Z is no-district / null jurisdictionKey
audit: _inbox/2026-08-24_write_path_serve_audit.md
---

# Lane 1 leftovers (audit-corrected)

Operator visual after #203, then write-path audit on gold, Jefferson, Wainee, Simsbrook, Dashwood, neighbor 280230.

## 1. Setbacks everywhere we have a table

Card scalars and the map wedge are different write paths. Do not collapse them.

- **Card scalars** come from atom-chain facets. Dashwood 280210 and neighbor 280230 print `F 25 / S 7.5 / R 20` (Pflugerville SF-S). Tables were never the defect.
- **Wedge** is POST `buildable-envelope`. Live Dashwood situs is `17006 DASHWOOD CREEK DR , TX 78660`. Parcel resolves (`parcel_node_id` comes back). Then `cityStateFromSitus` needs three comma parts, city is null, `jurisdictionKey` is null, `resolveAuthoritativeSetbacks` returns null, HTTP 404 `no-district`. Same parcel with `17006 Dashwood Creek, Pflugerville TX` returns 200 and a 10-pt ring.

`#203` only drops `, TX` or a 1–4 digit ZIP. A five-digit city-less line still POSTs. That is why scalars print and the wedge does not.

Wainee 35772 is honest `no-zoning-stamp`. Lane 3 coverage, not this card.

**Do not** widen `isTravisUnusableSitus` to every 5-digit ZIP as the fix. Coords-only recovery of `jurisdictionKey` is unmeasured. A second composer on situs shape is the pile-up class.

**Card:** give envelope resolve a jurisdiction that does not require a three-part CAD situs. Durable path is LDT accept `parcel_node_id` (still 400 `unrecognized_keys` live) and resolve jurisdiction from the node. Grade on Dashwood 280210 and neighbor 280230 with the **CAD situs PE actually sends**: wedge paints, card scalars stay, gold 34137 wedge does not regress.

## 2. Hover multi-shape is pile-up

Unchanged. Click = PMTiles fill. Hover = live-mesh `hits[0]`. Post-seal = sheet rings. Paint still unmeasured; code-read stands. Card: hover uses the same layer and promote id as click.

Search/inspect desync stays a third leftover. Do not absorb.

## 3. Added by the audit (not absorbed into 1)

Gold 34137 and Jefferson 34073: card prints `F 25 / S 5 / R 25`, live derive insets `F 30 / S 10 / R 30`. `applyLiveDeriveToFacets` copies geometry only. Two tables on one parcel. P-58 / A3 mapping, not the Pflugerville card.
