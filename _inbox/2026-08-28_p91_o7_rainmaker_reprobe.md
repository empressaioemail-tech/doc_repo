---
id: 2026-08-28_p91_o7_rainmaker_reprobe
title: P-91 item 27 O7 — Rainmaker re-probe after #526 serving
date: 2026-08-28
status: accepted-abbreviation-works
plan_row: P-91
wdll: _inbox/2026-08-28_smartsite_mcp_app_WDLL.md
wdll_item: 27
prior: _inbox/2026-08-28_p91_o7_abbrev_probe.md
payload: _inbox/2026-08-28_p91_o7_rainmaker_reprobe.json
---

# O7 Rainmaker re-probe

Snapshot: 2026-08-28T20:51Z. Seat integration on `P:\doc_repo` main. No product code. Key never printed.

## Serving observed

`gcloud run services describe cortex-api --format=json` and `gcloud run revisions describe cortex-api-00643-rib --format=json`, fields read by name.

`status.traffic` names `revisionName` `cortex-api-00643-rib` at `percent` 100. `latestReadyRevisionName` is `cortex-api-00644-soz` (staging, `CORTEX_STAGING=1`, `STAGING_DEPLOYMENT_DATABASE_URL`). Traffic is pinned. Serving is not latest.

Serving revision env `CORTEX_USER_DAILY_API_LIMIT` is `50000`. Image digest `sha256:59a4696fa468d047f5f1ea950d7ff45ddad01cc93af40892f23241142df16cc1`. `autoscaling.knative.dev/minScale` is absent (workflow still bakes `--min-instances=0`). Shift run `33209942592` conclusion `success`. Production `/api/healthz` 200 in 320 ms before the situs probes.

## Falsifiers (stated before the results)

If both Rainmaker queries return the same Bastrop node without abort, abbreviation works.

If Cv is empty or a different county and Cove is Bastrop, abbreviation is the miss class.

If either aborts or exceeds 25 s, O4 is not closed on this query.

## Results

`q=908 Pine, Bastrop TX 78602` (warm) 200 in 3335 ms. First hit `48021:34137` / `48021` / `parcel-situs`. Second hit address-point, `parcelNodeId` null.

`q=111 Rainmaker Cv, Bastrop TX` 200 in 2902 ms. First hit `48021:8720522` / `48021` / `parcel-situs`. Second hit address-point.

`q=111 Rainmaker Cove, Bastrop TX 78602` 200 in 2696 ms. Same first node `48021:8720522`. Same two-hit shape.

`q=908 Pine St, Bastrop TX` 200 in 2250 ms. Gold `48021:34137`.

`q=908 Pine Street, Bastrop TX` 200 in 5805 ms. Gold `48021:34137`.

No abort. No 25 s exceed. Bodies present.

## Which falsifier fired

`abbreviation_works` fired. Both Rainmaker queries returned the same Bastrop node `48021:8720522` under 3 s.

`o4_not_closed` did not fire. Both returned HTTP under 25 s.

`abbreviation_is_the_miss_class` did not fire. Neither was empty or a different county.

## Second mechanism, then why it was rejected

The observation is five 200s, Rainmaker pair identical. The mechanism I believe is #526's 20 s budget plus SET LOCAL, now on serving `00643-rib`. The miss path completes and returns hits.

The second mechanism that would look the same is a cold-start skip because healthz already woke the min-0 revision. Rejected for the pair itself: both Rainmaker calls completed after the warm Pine, and the prior hang on `00635-qux` was two consecutive 40 s zeros on a warm minScale=1 revision. A wake does not explain the prior hang, and this pair did not need a 20 s budget to finish.

A third mechanism is that Rainmaker now hits a store row that did not exist at 16:42Z. Rejected as the sole explanation: a new row would still have hung on the unbounded miss scan if the scan ran first and never returned. The code change is what bounds the wait. A new row can explain a hit instead of `hits: []`, not the end of the hang.

## Grade

Item 27 check (paired Cv vs Cove on a warm-enough revision; abbrev miss is unresolved with the original query, never a silent omit): both queries resolved to the same node. Abbreviation works end to end. The honesty check for an abbrev miss remains ungraded because this pair is not a miss.

leave_behind: none on the hang. Item 27 miss-honesty still needs a query that returns empty under 25 s if we want that half scored. Owner planner. Plan row P-91 item 27.
