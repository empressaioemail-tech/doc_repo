---
id: 2026-09-15_bastrop_zoning_layer_findings
title: FINDINGS — the zoning the map shows comes from a layer the city stopped editing in April 2023
date: 2026-09-15
status: findings — carded as G-140
kind: findings
owner: nick
programs: [OPS-17]
plan_rows: [G-140]
related:
  - _inbox/2026-09-15_roadmap_reconciliation.md
  - 90_operations/OPS-17_govtech_stack_plan_of_record.md
sources:
  - scripts/govtech/bastrop-zoning-layer-vintage.mjs, run 2026-09-15T20:36:43Z, verdict STALE, exit 1
  - smartcity-os origin/main 8bea7fa5, server/routes/esri.ts
  - smartcity-dashboards origin/main f776b4bf, src/property-map.mjs, src/property-map-catalog.mjs
  - City of Bastrop ArcGIS Online organisation services7.arcgis.com/qOeXJdBtGknaCJC4, read live
---

# The zoning layer is three years stale, and nothing was ever going to say so

The Jaime call reported that a property's zoning district was changed from commercial and the map
does not reflect it. That is one symptom. The mechanism underneath it is larger than one property.

## What the instrument returned

`scripts/govtech/bastrop-zoning-layer-vintage.mjs`, run 2026-09-15, exit 1. Snapshot declared in
its own output: `smartcity-os` `origin/main` `8bea7fa5`, `server/routes/esri.ts`.

| Last edited | Features | Service / layer | |
|---|---:|---|---|
| 2026-07-23 | 7,125 | `Zoned_Parcels` / Zoned_Parcels_Revisions_Clip | |
| 2026-07-09 | 595 | `Zone_Types` / Zone_Types_Draft_11_2025 | |
| 2025-06-02 | 574 | `Zoning_Place_Type` / Place Type | |
| **2023-04-28** | **565** | **`PlaceTypesCharacterDistricts` / Zoning Place Types** | **we read this one** |

The product reads the layer the city last edited on 28 April 2023. The city publishes three
zoning-shaped layers that are newer, the newest of them by nearly three years and four months.

`Zone_Types` carries the city's own description of what is happening:

> Layer for the new zoning districts that will replace the B3 PlaceType code (2025)

So Bastrop is in the middle of replacing the code edition our map is drawn from, and our map is
drawn from the edition before the one before that.

## Why this was never going to surface as an error

The read path is `const BASTROP_ZONING_URL` in `server/routes/esri.ts`, hardcoded, queried live on
every request with no cache. The query succeeds. The layer is healthy. It returns 565 well-formed
polygons with the fields the code asks for. **Every failure mode this product can detect is
absent**: no 502, no timeout, no missing field, no empty result. The endpoint returns a confident,
well-shaped, current-looking answer that is three years old.

This is the silent half of G-136. G-136 was the loud one: Bastrop dropped a field from their parcel
layer on 2026-09-10, ArcGIS rejected the whole query, One Click went down, and the city told us
within days. Its fix — tolerate a missing field — would not have caught this, because nothing here
is missing. A layer that is merely superseded generates no complaint from anybody, which is exactly
why it survived. *A control that fails to fire produces no complaint. Nobody finds the miss from
the outside.*

## The second mechanism, and why it was rejected

The obvious alternative explanation is a **cache**: we hold a copy and have not refreshed it. That
would produce the same symptom — a changed district not showing.

Rejected by reading the write path. `/api/esri/bastrop-zoning`, `/api/esri/zoning-at-point` and
`/api/esri/zoning` each `fetch` the upstream URL per request and hold nothing. There is no cache to
be stale. The staleness is in the *choice of layer*, which no refresh interval can fix.

A third possibility — the city edits our layer through a view whose `lastEditDate` does not
advance — is not excluded by the dates alone. It is excluded by the feature counts: 565 against
574, 595 and 7,125. Four different populations, not one population seen four ways.

## This is not only zoning

Eight City of Bastrop layer URLs are hardcoded in `esri.ts` with no vintage check on any of them:
zoning, character districts, city limits, ETJ, water mains, wastewater, CIP and city address. The
zoning one was found because a customer happened to notice one property. **The other seven have had
no instrument pointed at them**, and the same silence applies to each. The card scopes the fix to
zoning and the *instrument* to all eight, because the expensive part is the instrument and it is
the same instrument.

## And one thing worth more than the fix

`Zoned_Parcels_Revisions_Clip`, edited 2026-07-23, 7,125 features, carries per-parcel `prop_id`,
`ZoneType`, `ZoneDesc`, `TypicalUses`, `MinimumLotSize`, `FrontSetback`, `SideSetback`,
`RearSetback`, `CornerSideSetbacks`, `AccessoryStructSetback` and `MaxBuildingHeight`.

That is a live, parcel-level, city-published setback and envelope source for Bastrop, and no
product reads it. It is the input the envelope computation has been declining for want of, and it
has been sitting in the city's own public ArcGIS org. It is not carded here because it is not a
zoning-map fix and it belongs to whoever owns the envelope path, but it should not be lost:
recorded in G-140's leave-behind.

## What the city has to answer

Which layer is authoritative, and whether the 2025 draft has been adopted. We should not pick.
Reading a layer named `Draft_11_2025` and rendering it to staff as their zoning would be the same
defect in the opposite direction. The question is one email to Bastrop GIS and it is a question of
fact, not of preference.

## Before the fix ships

The move from a 565-polygon layer to a 574- or 595-polygon layer changes the zoning shown on
properties across the city. That is a mass change to what staff see, and it lands under the rule
that a mass state change refuses before it lands: the cutover reports the count and the diff of
affected parcels **before** it is switched, not after.
