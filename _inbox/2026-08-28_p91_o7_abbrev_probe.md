---
id: 2026-08-28_p91_o7_abbrev_probe
title: P-91 item 27 O7 — find_parcel abbreviation vs abort on warm cortex
date: 2026-08-28
status: accepted-o4-not-closed
planner_cp2: _inbox/2026-08-28_p91_wave_a_CP2.md
plan_row: P-91
wdll: _inbox/2026-08-28_smartsite_mcp_app_WDLL.md
wdll_item: 27
cp1: _inbox/2026-08-28_p91_wave_a_CP1.md
payload: _inbox/2026-08-28_p91_o7_abbrev_probe.json
---

# O7 abbreviation probe

Snapshot: 2026-08-28T16:40Z. Agent O7 on `P:\doc_repo` main `843b3437`. No product code. No commit. No deploy. Companion JSON is redacted: no Authorization header, no key.

MCP `find_parcel` calls `GET /api/brokerage/v1/place/situs-search?q=...` on cortex. This probe hit that path on the production URL with a service Bearer only.

## Serving observed

`gcloud run services describe cortex-api --format=json` and `gcloud run revisions describe cortex-api-00635-qux --format=json`, fields read by name.

`status.traffic` names `revisionName` `cortex-api-00635-qux` at `percent` 100 with tag `canary`. `status.address.url` is `https://cortex-api-tds7av26va-uc.a.run.app`. Revision annotation `autoscaling.knative.dev/minScale` is `1`. `status.imageDigest` is `us-central1-docker.pkg.dev/legacy-design-tools-prod/apps/cortex-api@sha256:2437d70444edb18607cdae5e3a38058d47031ed3142b70d0d79135a4105d1d71`. `desiredReplicas` is 1. `MinInstancesProvisioned` is True.

That matches the expected serving revision. Request-log confirmation of which revision served each Rainmaker call was not retrieved: `gcloud logging read` filter quoting failed in this shell. The three Pine calls that completed returned 200 from the same production URL.

An unauthenticated ping to the same path returned 401 in 182 ms, so the host was reachable before the timed probes.

## Falsifiers (stated before the results)

If both Rainmaker queries return the same Bastrop node without abort, abbreviation works.

If Cv is empty or a different county and Cove is Bastrop, abbreviation is the miss class.

If either aborts or exceeds 25 s, O4 is not closed on this query even with minScale=1.

## Results

`q=111 Rainmaker Cv, Bastrop TX` did not return HTTP. curl exit 28 after 40022 ms with 0 bytes received. Status 0. Exceeded 25 s. Client aborted.

`q=111 Rainmaker Cove, Bastrop TX 78602` did the same: curl exit 28 after 40029 ms, 0 bytes, status 0, exceeded 25 s, client aborted.

`q=908 Pine, Bastrop TX 78602` returned 200 in 6120 ms (curl 5822 ms). First hit `48021:34137` / `908 PINE , BASTROP, TX 78602` / `48021` / `parcel-situs`. Second hit is the honest same-county address-point (`parcelNodeId` null, `908 PINE ST, Bastrop, TX, 78602`). That is the known-good control.

`q=908 Pine St, Bastrop TX` returned 200 in 2223 ms. Same first node `48021:34137`, same two-hit shape.

`q=908 Pine Street, Bastrop TX` returned 200 in 2113 ms. Same first node `48021:34137`, same two-hit shape.

MCP `cortexFetch` aborts at 30 s. Connect would have aborted both Rainmaker calls before this 40 s client cap.

## Which falsifier fired

`o4_not_closed` fired. Both Rainmaker queries aborted and both exceeded 25 s on a warm minScale=1 revision. O4 is not closed for this query class.

`abbreviation_works` did not fire. Neither Rainmaker query returned a Bastrop node.

`abbreviation_is_the_miss_class` did not fire. There were no bodies to compare. Empty versus wrong-county cannot be scored from a timeout.

## Second mechanism, then why it was rejected

The observation is two 40 s hangs, then three 200s. The mechanism I believe is a store prefix scan that does not return when the normalized key misses (or takes longer than the client will wait). `searchPlaceByPrefix` runs `ILIKE` of a normalized SQL expression across every `txgio-store` county, first on `txgio_parcel`, then on `txgio_address`. A hit path can stop early. A miss path has to exhaust the scan. Pine is a hit path and returned. Rainmaker never produced a byte.

The second mechanism that would look the same is a cold start on scale-to-zero. Rejected: the serving revision carries `minScale=1` and `desiredReplicas=1`; the second Rainmaker call also hung for 40 s after the first had already been in flight; the Pine control that followed returned 200 in 6 s, then 2 s. A cold start does not explain two consecutive full-cap hangs and a fast success on the next different query.

A third mechanism is abbreviation mismatch (Cv versus Cove). Rejected on code reading, which outranks the missing bodies. `normalizeSitusSearchPrefix` tokenizes the first-comma segment through `STREET_TYPE_ABBR`. `COVE` maps to `CV`. Both Rainmaker strings become the same prefix `111 RAINMAKER CV`. They cannot diverge on abbreviation. St versus Street on gold is the same fold (`STREET` to `ST`) and both returned `48021:34137` in about 2 s, so the fold works on a hit path.

A fourth mechanism is auth or network flake. Rejected: the unauthenticated ping was 401 in 182 ms, and three authenticated Pine calls returned 200 with the expected gold node.

## Recommended next

Code. Do not leave this as unresolved-query yet.

Unresolved requires a completed response that still carries the original query. These calls never completed. A screen that dropped six Rainmaker-shaped rows would look like a tool abort, not like six addresses that did not resolve. Item 27's honesty check (abbrev miss is unresolved with the original query, never a silent omit) cannot be graded until `hits: []` returns under 25 s.

Do not spend a card on abbreviation expansion. The fold already exists for Cv/Cove and St/Street. After the miss path is bounded, re-probe the same pair. If both then return empty, the screen layer (P-92 item 30) keeps the typed string. If both then return the same Bastrop node, abbreviation works end to end and item 27 can grade on that.

leave_behind: Rainmaker Cv and Cove abort at 40 s with 0 bytes on warm `cortex-api-00635-qux` minScale=1. Owner property / planner. Plan row P-91 item 27.
