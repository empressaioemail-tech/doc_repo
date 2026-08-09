---
title: "Multi-shapefile truncation: downstream atom contamination assessment"
date: 2026-08-09
status: assessed
scope: "Read-only live atoms-store assessment for Harris County FIPS 48201"
source: "Live PostgreSQL observation at 2026-08-09T16:10:12Z"
---

# Multi-shapefile truncation: downstream atom contamination assessment

## Result

Harris County, Texas (`48201`, tenant `tx_48201`) has **0 parcel-node atoms** in the live Hauska atoms store. No atom of any entity type is scoped to `tx_48201`, and no parcel-derived atom references a `parcelNodeId` beginning `48201:`. Therefore the known east-only Harris TxGIO geometry truncation has **not contaminated the atom store** as observed.

The live store contains **796,046 parcel-node atoms across 79 county tenants**, not the approximate 748,000 across 77 in the intake. This is a point-in-time live read, not a claimed customer-surface grade. The atom table held 7,749,103 atoms total, with atom creation timestamps from 2026-07-23T20:11:44.991925+00:00 through 2026-08-09T16:09:53.208029+00:00.

## Store and access verification

The requested deployment credential resolved from `DEPLOYMENT_DATABASE_URL` in `legacy-design-tools-prod`. Its direct Neon hostname was used after removing `-pooler`; a disposable table was created, inserted into, deleted from, and dropped successfully before database inspection.

`CORTEX_DATABASE_URL` was absent from `legacy-design-tools-prod` and resolved successfully in `hauska-prod-497015`, but that target was the deployment application database rather than the populated atoms store. The populated live atoms store was discovered at `DATABASE_URL` in `hauska-prod-497015`, database `hauska_mcp`. Its direct Neon hostname was used. All queries against this atoms store were read-only and executed in a repeatable-read, read-only transaction. No atom writer, vacuum, lock, or atom mutation was run.

## Harris exposure checks

| Check | Exact count |
| --- | ---: |
| `parcel-node` with `jurisdiction_tenant = tx_48201` | 0 |
| All atom entity types with `jurisdiction_tenant = tx_48201` | 0 |
| All atom entity types with `body.countyFips = 48201` | 0 |
| Boundary edges with `parcelNodeId` prefix `48201:` | 0 |
| Parcel-derived atoms with `parcelNodeId` prefix `48201:` | 0 |

Harris jurisdiction rows: No rows

### East-only versus missing-west determination

No Harris parcel-node or dependent parcel atom exists, so there is no Harris atom that can reference a parcel limited to the east-only subset or omit a west-half parcel. A geographic east-versus-west comparison is consequently unnecessary for the atoms store at this point.

If a later run mints Harris atoms, establish east/west completeness by retaining the full-source manifest and comparing the full land-parcel feature or stable parcel-key set against the atom `entity_id`/`body.parcelNodeId` set. Geometry is not stored in these parcel-node atom bodies (`geometryLoaded: false` in sampled live atoms), so atom records alone cannot establish a parcel's spatial half without the source geometry manifest or a joined geometry table.

## Parcel-node keying observed

A parcel node is keyed by `entity_type = parcel-node`, `jurisdiction_tenant = tx_<FIPS>`, and a unique `(entity_type, entity_id)` composite. Its DID and `body.parcelNodeId` repeat that key. The identifier begins `<countyFips>:`. The source payload records `countyFips`, `sourceVintage`, `sourceAdapter`, source citation, and `keyKind`.

| `keyKind` | Live parcel-node count |
| --- | ---: |
| `prop_id` | 796,046 |

The sampled `prop_id`-kind record demonstrates the fallback shape when TxGIO has no usable `prop_id`: `48093:_feature-stratmap25-landparcels-48093-comanche-202503-9481`. A repair cannot assume every atom is keyed only by a stable assessor parcel ID. Some are deterministic source-feature keys containing the source-vintage file stem and feature index.

## Live parcel-node counts by county tenant

| County tenant | Parcel-node atoms |
| --- | ---: |
| `tx_48093` | 17,134 |
| `tx_48395` | 16,935 |
| `tx_48377` | 16,663 |
| `tx_48239` | 16,610 |
| `tx_48165` | 16,425 |
| `tx_48159` | 16,361 |
| `tx_48281` | 16,271 |
| `tx_48219` | 16,169 |
| `tx_48179` | 16,136 |
| `tx_48297` | 16,086 |
| `tx_48145` | 15,596 |
| `tx_48127` | 15,411 |
| `tx_48503` | 15,365 |
| `tx_48287` | 15,236 |
| `tx_48273` | 14,860 |
| `tx_48131` | 14,442 |
| `tx_48389` | 13,977 |
| `tx_48193` | 13,956 |
| `tx_48489` | 13,943 |
| `tx_48031` | 13,687 |
| `tx_48279` | 13,610 |
| `tx_48415` | 13,527 |
| `tx_48387` | 13,254 |
| `tx_48399` | 12,982 |
| `tx_48153` | 12,740 |
| `tx_48505` | 12,299 |
| `tx_48083` | 12,209 |
| `tx_48379` | 12,201 |
| `tx_48371` | 12,082 |
| `tx_48059` | 11,981 |
| `tx_48341` | 11,906 |
| `tx_48429` | 11,757 |
| `tx_48063` | 11,463 |
| `tx_48487` | 11,143 |
| `tx_48117` | 10,604 |
| `tx_48271` | 10,593 |
| `tx_48003` | 10,497 |
| `tx_48313` | 10,041 |
| `tx_48175` | 9,874 |
| `tx_48283` | 9,845 |
| `tx_48507` | 9,535 |
| `tx_48137` | 9,369 |
| `tx_48267` | 9,357 |
| `tx_48345` | 9,354 |
| `tx_48009` | 9,200 |
| `tx_48445` | 8,946 |
| `tx_48333` | 8,753 |
| `tx_48319` | 8,650 |
| `tx_48385` | 8,142 |
| `tx_48335` | 7,669 |
| `tx_48095` | 7,629 |
| `tx_48295` | 7,415 |
| `tx_48501` | 7,246 |
| `tx_48081` | 7,201 |
| `tx_48495` | 7,171 |
| `tx_48425` | 6,695 |
| `tx_48357` | 6,501 |
| `tx_48369` | 6,481 |
| `tx_48437` | 6,406 |
| `tx_48119` | 6,399 |
| `tx_48069` | 6,339 |
| `tx_48275` | 6,322 |
| `tx_48023` | 6,287 |
| `tx_48111` | 6,154 |
| `tx_48017` | 5,897 |
| `tx_48435` | 5,803 |
| `tx_48169` | 5,699 |
| `tx_48047` | 5,630 |
| `tx_48205` | 5,564 |
| `tx_48443` | 5,527 |
| `tx_48417` | 5,420 |
| `tx_48079` | 5,280 |
| `tx_48413` | 4,868 |
| `tx_48359` | 4,162 |
| `tx_48311` | 3,803 |
| `tx_48033` | 3,288 |
| `tx_48173` | 2,910 |
| `tx_48393` | 2,574 |
| `tx_48261` | 529 |

## Repair requirements if a future multi-shapefile county is already atomized

Do not execute these from this assessment. The required repair plan is:

1. Confirm the complete source set and source manifest for the county, including every shapefile part, feature count, source-vintage identifier, and county FIPS. Reject promotion if the manifest does not cover the expected geography.
2. Compare the complete source key set to existing `parcel-node` `entity_id` values and `body.parcelNodeId` values for `jurisdiction_tenant = tx_<FIPS>`. Split results into retained keys, missing keys to mint, and stale keys that were only in the truncated ingestion.
3. Trace dependent atoms whose `body.parcelNodeId` begins `<FIPS>:`. The relevant live entity types include `property-boundary-edge`, `zoning-fact`, `setback-rule`, `buildable-envelope`, and `parcel-terrain-model`.
4. Delete or retire stale parcel-node atoms and every dependent atom linked to a stale parcel-node key, using a scoped, reviewable migration with pre/post counts. Do not use a global writer or a blanket county delete without the key-diff artifact.
5. Re-mint parcel-node atoms from the full source through the approved writer, then regenerate dependent geometry and property atoms from the new parcel-node set. Where the prior source supplied no stable `prop_id`, expect source-vintage/feature-index keys to change and treat them as a replacement set rather than assuming in-place identity.
6. Validate exact county counts, all expected source parts, zero stale truncated-only keys, and dependent-atom referential coverage. Only a live deployed-surface probe can establish customer-done status.

For Harris specifically, steps 4 through 6 are currently unnecessary because the scoped atom counts are zero. The only required precaution is to prevent any future writer run from consuming the known truncated east-only source.

## Evidence limits

This report assesses the live Hauska atom store only. It does not assert the state of raw TxGIO geometry tables, tile cache, deployment database, or deployed customer surfaces. The `CORTEX_DATABASE_URL` target had no populated `knowledge_atoms` rows and is not the parcel-node store used for these counts.
