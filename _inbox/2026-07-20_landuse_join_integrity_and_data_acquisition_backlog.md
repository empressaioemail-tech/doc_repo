---
id: 2026-07-20_landuse_join_integrity_and_data_acquisition_backlog
title: Land-use join integrity finding + data-acquisition backlog (Central-TX node facets)
status: active
date: 2026-07-20
applies_to: legacy-design-tools (parcelsPmtilesBakeCli land-use join, nodeFacetBakeTier1, joinNormalize)
related: [2026-07-20_map_first_program_launch, zoning-stamp-roll-mechanics]
owner: nick
---

# Land-use join integrity + data-acquisition backlog

An audit of the Tier-1 node-facet bake's land-use coverage (2026-07-20) found that the per-county join rates were partly FABRICATED, and separated the genuine gaps from recoverable ones. The truth oracle was an owner-name match test: for a "joined" parcel, does the txgio owner equal the cad owner. 100% = real join; ~0% = numeric collision producing false land-use.

## The integrity finding (being fixed)

Hays (48209) and Williamson (48491) land-use joins were FABRICATING data. Their txgio prop_ids are R-account form (Williamson `R062578`) or a different numbering system (Hays); the `normalizeForJoin` R-strip + leading-zero strip produced numeric COLLISIONS with cad_property ids belonging to DIFFERENT properties. Verified directly: every sampled Williamson "match" has a different owner (`R062578` = PURVIS vs cad `62578` = BREM). ~167k parcels were showing wrong land-use.

Root cause: the R-strip added to `normalizeForJoin` (the earlier "Williamson R-prefix fix") was itself the bug. No county uses the R-strip correctly; only Hays+Williamson have R/mismatched ids and for both it collides. The earlier "Williamson 91.6% join" figure was cross-county false positives (prop_id is NOT globally unique — "163031" exists in 6 counties); the honest same-county figure is ~0% real.

Fix (in flight): gate the numeric land-use join OFF for FIPS 48209 + 48491 in BOTH the PMTiles bake and the Tier-1 facet bake, so they store honest land-use-absence, pending an external CAD account<->prop_id crosswalk. Commitment #1: an honest gap beats a false match. Re-bake those two counties to honest-absence after merge.

## The honest per-county land-use picture (post-fix)

REAL joins at ceiling (no fix available, remainder genuinely absent from the public roll): Bexar 87%, Bastrop 98%, Caldwell 94%, McLennan 78%, Guadalupe 76%, Bell 76% (all ~100% owner-match on joined parcels).

Travis: NOT a join bug. On parcels carrying a real prop_id it joins 95%; but ~50% of TxGIO Travis parcels ship with prop_id AND geo_id both literally "0" (no key). Headline 47%. Needs a fresher TxGIO vintage or an address crosswalk, not a code fix.

Comal: join key is CORRECT (100% owner-match); cad_property has 103k rows but ZERO coded land-use — the StratMap STAT_LAND_ field is blank for Comal. Needs a source with a populated category.

Hays + Williamson: honest ~0% until an external crosswalk is acquired (see below).

## Data-acquisition backlog (queued, NOT chased mid-program per operator 2026-07-20)

These raise land-use coverage but need EXTERNAL data we do not have loaded. Do not fabricate to close them; show honest-absence until acquired.

1. WCAD (Williamson) account<->prop_id crosswalk. WCAD publishes a PROP_ID / GEO_ID / R-account cross-reference in its bulk appraisal-roll export. Acquire it -> map the R-account geometry side to the cad prop_id -> recover ~280k Williamson parcels' land-use honestly.
2. HaysCAD account<->geo crosswalk. Same shape as WCAD; recovers ~130k Hays parcels.
3. Comal land-use — RECON COMPLETE 2026-07-21: no FREE per-parcel source exists. Comal Appraisal District does not publish the PTAD state category on ANY public surface (its own GIS layer omits the field; its eSearch renders "Property Use" blank; StratMap ships it blank because the CAD doesn't publish it). The code lives ONLY in the certified appraisal roll = LICENSED/PAID (Comal AD custom bulk, 830-625-8597 / 900 S. Seguin Ave; or TaxNetUSA Comal Pro). BIZOPS DECISION, off the free public-record rail. Operator ruled 2026-07-21: leave honest-absent for now, log as acquisition item. GOOD NEWS when acquired: ingest is CLEAN — the roll is True Automation PACS format (our existing pacs CAD-roll ingest handles it) and joins by integer prop_id at 99.0% owner-match (verified live), no fuzzy address matching. Path: buy roll -> pacs ingest -> owner-match gate -> bake. Comal's zoning+setbacks fill separately via free county/city sources. Until acquired: 0% / true-source-gap, honest.
4. Travis fresher TxGIO land-parcel vintage that populates Prop_ID (the ~450k id-"0" half), or a situs/address crosswalk to the roll.

## Other facet columns (separate from land-use)

Zoning: exists only where a city's public zoning GIS layer was stamped (Williamson/Comal/Hays + the 6 setback cities). Raising it = stamp more cities (the per-city process in [[zoning-stamp-roll-mechanics]]). Rural/unincorporated parcels correctly have no zoning.

Buildable envelope: derivative — needs zoning + a per-jurisdiction setback table. Rises automatically as zoning + setback-table coverage rises.

## The lesson

The owner-match test is the integrity oracle for any parcel<->attribute join. A numeric-id join across two systems that both use short integers WILL produce false positives; always validate with an independent field (owner name, situs address) before trusting a join rate. The R-strip "fix" looked like a 60-point coverage win but was fabricating — caught only by reconciling the bake's real output + the owner-match test against live data, not by trusting the metric.
