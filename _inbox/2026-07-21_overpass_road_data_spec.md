---
id: 2026-07-21_overpass_road_data_spec
title: Spec — private Overpass / OSM extract for road-based envelope labeling
status: scaffolded-operator-blocked
date: 2026-07-21
last_updated: 2026-07-21
applies_to: legacy-design-tools (buildableEnvelope/roads.ts, node-facet Tier-2 bake), infra
related: [2026-07-20_provable_county_data_pipeline_design, 2026-07-18_property_brief_gtm_critical_path]
owner: nick
---

> SEQUENCING (operator ruled 2026-07-21): this is the SOON-TO-FOLLOW addition, executed AFTER everything currently in flight lands and the operator QAs the browse surface. It is a quality upgrade, independent of the in-flight wave, with a self-hosted-infra dependency that should NOT gate the browse QA. Recommended path confirmed = Option A (self-hosted Overpass). Pick it up as the next deliberate deliverable once the Vercel QA URL is validated. Tier-2 PR #319 is held pending this (its FEMA leg can ship independently sooner if desired).
>
> **2026-07-21 scaffold:** LDT `infra/overpass/` (Compose + Texas Geofabrik import + smoke.sh + GCE/Cloud Run runbook) landed via PR #328. `OVERPASS_URL` env hook already on main (#323). WDLL 8 remains **operator-blocked** until GCP billing/project, persistent disk, VPC connector CIDR, and a private-endpoint smoke query (highway ways) are observed. WDLL 9 (`--enable-roads` county bake) must not start before that smoke.

# Spec — road data for the buildable-envelope front-edge signal

## Problem (grounded, measured 2026-07-21)

The buildable envelope's HIGH-confidence front-edge labeling needs the nearest road to each parcel. Our code (`artifacts/api-server/src/lib/buildableEnvelope/roads.ts`) fetches this from the shared PUBLIC Overpass instance `https://overpass-api.de/api/interpreter`. Live measurement during the Tier-2 bake: the public instance returns HTTP 504 ("too busy") ~50-100% of the time, capping throughput at ~0.1 nodes/sec — categorically infeasible for a county bake (a single county at 0.1/sec is days). The mechanism is correct (proven by unit tests + a precheck that got 36 roads in 4.8s when the instance briefly wasn't saturated); the blocker is the shared instance's throughput, and the public instance's usage policy explicitly discourages bulk use.

Without this, envelopes fall back to the point/shape front-edge guess (Tier-1 grade: honest, lower confidence, `roadsPending`/`roadSignalUsed:false`), never a fabricated high-confidence front. So this is a QUALITY upgrade (approximate -> survey-adjacent front edge), not a correctness fix.

## What our code actually needs from a road source (the real contract)

`roads.ts` issues, per parcel (or per cache tile): `way(around:R,lat,lng)[highway]; out body geom` — i.e. all OSM ways tagged `highway=*` within radius R (default ~90m) of a point, returning each way's geometry (polyline), its `highway` class, and its `name` tag. That is the ENTIRE requirement:
- Input: a lat/lng + radius (or a bbox for a tile).
- Output: nearby `highway` ways with geometry + `highway` class + `name`.
- Scope: the 10 Central-TX counties today; all of TX, then national, later.
- Access pattern: the Tier-2 bake tiles the county (0.001 deg grid) and issues one query per tile, reused across the tile's parcels (cache-first already implemented). At national scale this is millions of tile queries over time, plus re-bakes.

A national, always-hammered public instance cannot serve that. We need a source WE control.

## The one code hook (do this regardless of option)

`OVERPASS_URL` in `roads.ts` is env-configurable (WDLL item 7 / LDT PR #323): trim `process.env.OVERPASS_URL`, default to the public instance (`https://overpass-api.de/api/interpreter`) only when unset or empty. Bake/service points at our own endpoint via env — no code change to switch sources.

**Deploy / bake wiring:** set `OVERPASS_URL` on the cortex-api Cloud Run service (and any bake job env) to the self-hosted interpreter URL once Option A is up. Leave unset in environments that should keep the public default (dev / until private mirror exists). The Tier-2 CLI warns if `--enable-roads` is set while `OVERPASS_URL` is unset/empty because the public instance is 504-saturated for county bakes.

## Option A — Self-hosted Overpass API instance (RECOMMENDED for the roadmap)

Run our own Overpass API server seeded with an OSM extract, queried exactly like the public one (same `[highway];out geom` API), just pointed at our host.

- Data: seed from a Geofabrik OSM extract (Texas .osm.pbf for the TX phase; North America / per-state for national). Geofabrik publishes daily per-state/per-country extracts, free.
- Software: the standard Overpass API (`osm-de/overpass-api` docker image, or the official build). Import the .pbf, run the interpreter service.
- Sizing: Texas .osm.pbf is a few GB; the Overpass DB after import is larger (tens of GB) but road-only needs are modest. A single modest Cloud Run / GCE VM (or a container with a persistent disk) handles it. National is bigger (North America pbf ~15GB, DB ~hundreds of GB) but still one beefy VM or a managed instance.
- Refresh: OSM roads change slowly for our purpose (a road's existence + class + name). A monthly (or quarterly) re-import of the Geofabrik extract is ample. No live diff-sync needed for envelope labeling.
- Cost: one small-to-medium always-on VM/container + disk. Cheap relative to the value (it unblocks high-confidence envelopes region-wide + is reusable by any road-dependent feature).
- Pros: same API our code already speaks (zero query rewrite), no rate limit, no 504, ours to scale, generalizes to national by swapping the extract. Removes the 2-slot concurrency cap the Tier-2 bake had to impose.
- Cons: an always-on service to operate (import job + the interpreter). One-time setup + a monthly re-import cron.

## Option B — One-time OSM extract -> local spatial index (no Overpass server)

Skip Overpass entirely. Download the Geofabrik Texas .osm.pbf ONCE, extract only `highway=*` ways (geometry + class + name), load them into our own store (PostGIS if we had it — we don't — OR a flat geo-index / a baked road-tile artifact), and do the nearest-road query in-process.

- Data: same Geofabrik extract; filter to highways with osmium/osmconvert; keep geometry + highway + name.
- Query: our OWN nearest-road-by-radius against the loaded roads (ray-cast / R-tree in JS, same shape as our existing no-PostGIS geometry math, OR a baked road-tile PMTiles-style artifact the bake reads).
- Pros: no running Overpass service; a static, versioned road artifact (fits the "content-hashed vintage" pattern we use for parcels); fully offline bake, fastest per-node (no network at all).
- Cons: we implement + maintain the nearest-road query ourselves (Overpass gives it for free); a re-extract to refresh; more code than Option A. Doesn't reuse the exact Overpass query, so `roads.ts` gets a new local-source path (behind the same interface).

## Recommendation

Do the ENV HOOK now (make OVERPASS_URL configurable — tiny, unblocks both).

For the source: OPTION A (self-hosted Overpass) is the better roadmap fit. It reuses the exact API our code speaks (no query rewrite, lowest code risk), scales to national by swapping the Geofabrik extract, and is reusable by every future road-dependent feature. Option B is attractive ONLY if we want a fully-static offline bake with zero running services and are willing to own the nearest-road query — a reasonable "no new always-on infra" choice, but more code. Given we already run Cloud Run services, a self-hosted Overpass container is the lower-friction, more general answer.

Sequence when greenlit:
1. Make OVERPASS_URL env-configurable (roads.ts) — trivial PR.
2. Stand up the self-hosted Overpass (TX Geofabrik extract, docker interpreter, persistent disk) + a monthly re-import.
3. Point the bake/service OVERPASS_URL env at it.
4. Re-run the Tier-2 road-envelope leg per county (it was proven, just throughput-blocked) -> high-confidence front edges region-wide. FEMA leg (already feasible on the public FEMA service) can ship independently now.

## Honesty note

This is a quality upgrade, not a correctness gate. Until it lands, envelopes are honest point/shape-grade (front edge inferred, lower confidence, flagged) — never a fabricated high-confidence front. The map is fully usable without it; this makes the envelope's front-edge orientation authoritative rather than inferred, which matters most for the "where exactly does the ADU fit" precision the wedge promises.
