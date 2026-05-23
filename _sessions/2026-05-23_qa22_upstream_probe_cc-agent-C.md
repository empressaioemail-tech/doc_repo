---
title: cc-agent-C QA-22 upstream probe — three-scope close-out
date: 2026-05-23
agent: cc-agent-C
repo: legacy-design-tools
kind: session-summary
dispatch: 2026-05-23_cc-agent-C_qa22_upstream_probe
related: [43_cortex_qa_backlog, _sessions/2026-05-23_qa22_throw_path_cc-agent-C]
---

# QA-22 upstream probe — cc-agent-C

Three scopes, one shipped PR (#94 — SCOPE B), two written
recommendations (SCOPE A + SCOPE C). PR #92's `throwExcerpt`
capture returned exactly the diagnostic surface each scope needed
to root-cause cleanly.

| Field | Content |
|-------|---------|
| **SCOPE A** | EPA — old URL `https://ejscreen.epa.gov/mapper/ejscreenRESTbroker3.aspx` (NXDOMAIN, hostname decommissioned). **No new URL found.** WebFetch on `geopub.epa.gov/arcgis/rest/services/OECA` (only `msep_imagery`), `gispub.epa.gov/arcgis/rest/services`, `www.epa.gov/ejscreen/learn-use-ejscreen` (404), `www.epa.gov/ejscreen/ejscreen-api` (404), and `catalog.data.gov/dataset?q=ejscreen` (no EPA EJScreen entries surfaced). Per dispatch step 5, stopped at recommendation — no code change in this PR. Operator decision needed (see below). |
| **SCOPE B** | FCC — timeout floor raised from `SLOW_UPSTREAM_TIMEOUT_MS` (45s) to dedicated `FCC_BROADBAND_TIMEOUT_MS = 90_000` (90s) for `fcc:broadband` only; new 15-min in-memory cache keyed by lat/lng rounded to 5 d.p. (same as the existing 24h Postgres `adapter_response_cache`). 3 new tests + 1 updated invariant in `federalAdapters.test.ts`. PR #94 (`fix/qa22-upstream-probe`). |
| **SCOPE C** | Grand County GIS — adapter URLs are `https://gis.grandcountyutah.net/server/rest/services/Public/{Parcels,Zoning,Roads}/MapServer/0` ([grand-county-ut.ts:37-44](https://github.com/empressaioemail-tech/legacy-design-tools/blob/main/lib/adapters/src/local/grand-county-ut.ts#L37-L44)). **No reference to `webgis.grandcountyutah.net`** (the NXDOMAIN host the operator probed). Cloud Run pill `UND_ERR_CONNECT_TIMEOUT` is TCP-level (no SYN-ACK); that semantics requires DNS to have succeeded, so `gis.grandcountyutah.net` resolves from Cloud Run — the firewall is what's blocking. **Verdict: operator infra**, not code. |
| **Deploy** | Operator merge + redeploy required for SCOPE B to take effect on Redd re-test. SCOPE A and SCOPE C land in subsequent dispatches. |

## SCOPE A — EPA (recommendation, no code change)

**Root cause**: `ejscreen.epa.gov` is NXDOMAIN — the entire EJScreen
hostname appears decommissioned. The current adapter at
[`epa-ejscreen.ts:29-30`](https://github.com/empressaioemail-tech/legacy-design-tools/blob/main/lib/adapters/src/federal/epa-ejscreen.ts#L29-L30)
calls `https://ejscreen.epa.gov/mapper/ejscreenRESTbroker3.aspx`,
which now fails with `ENOTFOUND getaddrinfo ejscreen.epa.gov` (PR #92's
captured pill). The legacy broker contract no longer exists at any
EPA-published URL I could find via WebFetch.

**WebFetch sweep**:

- `geopub.epa.gov/arcgis/rest/services/OECA` — only `msep_imagery`,
  no EJScreen service.
- `gispub.epa.gov/arcgis/rest/services` — no EJScreen folder visible
  at root level. (Did not exhaustively drill every subfolder.)
- `www.epa.gov/ejscreen` — 404.
- `www.epa.gov/ejscreen/learn-use-ejscreen` — 404.
- `www.epa.gov/ejscreen/ejscreen-api` — 404.
- `catalog.data.gov/dataset?q=ejscreen` — search returned unrelated
  popular datasets; no EJScreen entries surfaced in the response.

**Recommendation — operator decides**:

1. **Wait for EPA replacement**. If EPA publishes a successor API
   (EJScreen 2.x on `geopub` / `gispub`, or via Envirofacts), update
   the adapter then. No code change now.
2. **Switch to CDC EJI** (`https://www.atsdr.cdc.gov/placeandhealth/eji/`).
   Different geography (census tract vs block group), different
   indicator set, different schema — non-trivial adapter rewrite,
   not a URL swap.
3. **Use a PEDP mirror** (Public Environmental Data Project). The
   dispatch explicitly says \"PEDP mirror is not acceptable for
   production without operator sign-off,\" so this is operator-gated.
4. **Remove the EJScreen adapter** until a successor is identified.
   The briefing engine would surface a perma-`no-coverage` row in
   the interim.

**No code change in this PR** — the adapter remains in its current
state and continues to surface the informative
`ENOTFOUND getaddrinfo ejscreen.epa.gov` pill from PR #92.

## SCOPE B — FCC (PR #94, code-side mitigation)

**Root cause**: FCC BDC v2 endpoint at
`broadbandmap.fcc.gov/nbm/map/api/published/location/availability` is
legitimately slow from Cloud Run egress. The 45s
`SLOW_UPSTREAM_TIMEOUT_MS` floor isn't enough on cold-call paths
(pill: `did not respond in time during attempt 1`); the operator's
workstation curl confirmed the endpoint exists but timed out at 60s
with 0 bytes.

**Mitigation (PR #94)**:

- **Timeout**: per-adapter floor raised from `SLOW_UPSTREAM_TIMEOUT_MS`
  (45s) → `FCC_BROADBAND_TIMEOUT_MS = 90_000` (90s) **on the FCC
  adapter only**. EPA / Grand County deliberately stay at the shared
  floor — their failure modes (DNS, TCP connect-timeout) wouldn't
  benefit from a longer budget.
- **Cache**: 15-min in-memory `Map`, keyed by lat/lng rounded to
  `CACHE_COORDINATE_PRECISION` (5 d.p., ~1.1m at the equator —
  same precision as the existing Postgres `adapter_response_cache`,
  so an in-mem hit and a Postgres hit are interchangeable for the
  same parcel). Sits in front of the existing 24h Postgres cache;
  catches the operator-reload case where the same engagement
  re-runs Generate Layers within 15 min before the Postgres row is
  read back, or when the runner is invoked without a Postgres
  cache (tests, scripts). Both empty-result and populated-result
  paths cache through.

**Existing infra note for context**:
`artifacts/api-server/src/lib/adapterCache.ts` already wires a
Postgres-backed `adapter_response_cache` (24h default TTL,
`FEDERAL_TIER_CACHE_PREDICATE` default). FCC has been eligible for
that cache all along — the in-mem layer added here is a complement,
not a replacement.

| Layer | TTL | Scope |
|---|---|---|
| In-memory (PR #94) | 15 min | Per-process |
| Postgres (existing) | 24h | Cross-instance |

**Tests**: 3 new in `federalAdapters.test.ts` + 1 updated invariant.
All 227/227 adapter tests pass.

## SCOPE C — Grand County GIS (recommendation, operator infra)

**Adapter URLs** ([grand-county-ut.ts:37-44](https://github.com/empressaioemail-tech/legacy-design-tools/blob/main/lib/adapters/src/local/grand-county-ut.ts#L37-L44)):

```
parcels: https://gis.grandcountyutah.net/server/rest/services/Public/Parcels/MapServer/0
zoning:  https://gis.grandcountyutah.net/server/rest/services/Public/Zoning/MapServer/0
roads:   https://gis.grandcountyutah.net/server/rest/services/Public/Roads/MapServer/0
```

The actual REST query the adapter builds (via `arcgisPointQuery` in
[`arcgis.ts`](https://github.com/empressaioemail-tech/legacy-design-tools/blob/main/lib/adapters/src/arcgis.ts)):

```
{serviceUrl}/query
  ?f=json
  &geometry={"x":-109.5498,"y":38.5733,"spatialReference":{"wkid":4326}}
  &geometryType=esriGeometryPoint
  &inSR=4326
  &spatialRel=esriSpatialRelIntersects
  &outFields=*
  &returnGeometry=true
```

**Workstation recon** (from dispatch table): `webgis.grandcountyutah.net`
→ NXDOMAIN, `grandcountyutah.maps.arcgis.com` → 200 in ~0.5s.
**Important**: the operator probed `webgis.` (the NXDOMAIN host),
but the adapter uses `gis.grandcountyutah.net` — a different host
entirely. The adapter has no reference to `webgis.` so the dispatch's
"if any reference to webgis…, fix to the live host" rule doesn't
trigger.

**Cloud Run vs workstation gap**: Cloud Run pill is `UND_ERR_CONNECT_TIMEOUT`
— TCP-level (socket opened, no SYN-ACK received within the timeout).
That semantics requires DNS to have succeeded; otherwise undici would
report `ENOTFOUND` or `EAI_AGAIN`, not `CONNECT_TIMEOUT`. So
`gis.grandcountyutah.net` resolves from Cloud Run; the TCP handshake
is what's failing. Classic firewall / IP-allowlist behavior on the
upstream — Grand County GIS is plausibly allowlisting state/county
networks and dropping SYNs from Google Cloud Run egress IP ranges.

**Verdict: operator infra**, not code. Code is fine.

**Recommendation**:

1. **Provision a serverless VPC connector for cortex-api** + Cloud
   NAT with a **stable allocated egress IP**. Without this, Cloud
   Run egress source IPs rotate within Google's pool — any
   whitelist outreach is pointless until the IP is stable.
2. **Outreach to Grand County GIS** (the county's GIS contact) to
   whitelist that egress IP for `gis.grandcountyutah.net`.
3. **As a fallback** if the county can't / won't whitelist: switch
   the adapter to `grandcountyutah.maps.arcgis.com` (ArcGIS Online
   mirror — confirmed working from operator's workstation). That
   would be a separate dispatch — non-trivial because AGOL uses
   different service IDs (UUIDs) and the layer schema may differ
   from the county-hosted MapServer.

**Note on `grand-county-ut:roads` "ok"**: the roads adapter is `ok`
because it falls through to the OSM Overpass fallback when the
county GIS fails. That is **not** evidence Grand County GIS is
healthy — same as the dispatch table calls out.

## Deploy & verification

- **PR #94** ([`fix/qa22-upstream-probe`](https://github.com/empressaioemail-tech/legacy-design-tools/pull/94))
  — operator merge + redeploy required before Redd re-test.
- After deploy, expected Redd pill changes:
  - `epa:ejscreen` → unchanged (`ENOTFOUND getaddrinfo
    ejscreen.epa.gov`) until SCOPE A lands.
  - `fcc:broadband` → first call takes up to 90s and warms both
    caches; second call (or any subsequent re-run within 15 min)
    returns instantly with cached payload.
  - `grand-county-ut:parcels` / `:zoning` → unchanged
    (`UND_ERR_CONNECT_TIMEOUT`) until SCOPE C operator infra lands.
- Branch off `origin/main` HEAD `0fc4e7d` (includes PRs #92 and
  #93). All 227 adapter tests pass, workspace typecheck clean.
- Workspace YAML + lockfile reverted post-verify per the
  `project_windows_test_natives` workaround.

## Out of scope this session (confirmed not touched)

- Cached-last-good fallback in `runner.ts` — still a worthwhile
  follow-on but separate dispatch.
- VPC connector / Cloud NAT / whitelist implementation — operator.
- Changing `retry.ts` throw-capture behavior — no regression
  identified; left alone.
- QA-33 / QA-35 (separate dispatches), 2D-site-context, Phase 3
  features.
