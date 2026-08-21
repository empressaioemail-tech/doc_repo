# L18 scratch — ledger materialize-on-write (P-14)

## OPEN

- CLOSED. Scorer auto-invoke of countyLedgerMaterializeCli --apply still owed (CC will show STALE after 15 min until next --apply). L16 still holds the atoms slot.

## GROUND-TRUTH (2026-08-14T12:42Z)

- Migration 0074 applied (workflow 31801448660, log: `0074_county_ledger_snapshot.sql applied` at 12:42:59.887Z). Image build 31801416501 success for SHA 19da3b1b.
- L16 pipelines IN FLIGHT (48001 landed; current 48003). Per-county keyed parcel reads, not a statewide GROUP BY.
- Live prod GET is itself the competing full-table scan: pg_stat_activity 12:46:55Z pid 18970 `SELECT COUNT(DISTINCT county_fips) FROM txgio_parcel` age ~5 min, wait Neon/PS_ReadIO. That is the hung CC/console.

## SEQUENCE (done)

- Sequence used: deploy-canary 0% then smoke (503 until snapshot) then shift (prod GET 503s fast) then cancel leftover COUNT DISTINCT then materialize --apply then GET 200 then CC vercel. Brief 503 window was honest; overlapping a second COUNT DISTINCT would have violated heavy-scan serialization.

## GROUND-TRUTH (2026-08-14T13:15Z)

- L18 CLOSED. Prod GET 200 in 0.773s computedAt=2026-08-14T13:10:24.947Z satisfied=616/3556 during L16 drain. CC #panel=county-manifest in-page fetch 1082ms; stamp visible; stale backdate showed STALE banner; computed_at restored. Serving cortex-api-00503-yiq @100%. CC dpl_EbbEV3fdix8uajn8cvmWrey8rqru bundle index-IA3I57kN.js. Close `_inbox/2026-08-14_l18_close.json`.

## ANNOUNCE STARTED (2026-08-14T12:53Z)

- Target: COUNT DISTINCT county_fips on cad_property / txgio_parcel / tx_special_district plus county_facet_coverage full read, then UPSERT county_ledger_snapshot.
- Expected duration: 10-20 min (prior hung GET on txgio_parcel COUNT DISTINCT was 9 min when cancelled).
- Does NOT take atoms slot / lease. Cancelled leftover GET pid 18970 after shift. L16 pipelines still IN FLIGHT (current 48005, 2 landed) — per-county keyed, not a second full-table scan.
- Prod GET currently 503 county_ledger_not_materialized in 305ms (revision cortex-api-00503-yiq @100%).

## GROUND-TRUTH (2026-08-14T12:20Z)

- GET /api/county-ledger computes on request: probeRailCapabilities COUNT DISTINCT cad_property + txgio_parcel + tx_special_district; full facet-coverage scan; CROSS JOIN grid.
- CC CountyManifestGrid getJson timeout 20_000ms (CountyLedger sibling 12_000ms). Page is timing out now (operator).
- NodeGraph STALE pattern: Pill sev=warn "tally stale" + caption "showing committed artifact (STALE)."
- L16 HOLDS atoms slot + DB lease. L18 is slot-free (no --apply atoms).
- origin/main LDT @ b9480277 (L17 vintage). Main checkout is dirty feat/s1-instrument-hardening — do not touch that tree.

## LESSON

- A hung GET with 0 bytes is how a days-old 195-cell view survives: the client keeps the last 200. Fix is constant-time GET + computedAt on the surface, not a faster timeout.
- Server must never import a *Cli.ts (esbuild isDirectRun boot-crash). Compute lives in a no-main module.

## DEAD-END

- DB trigger on county_facet_coverage to refresh the snapshot: would COUNT DISTINCT 15M-row txgio_parcel on every scorer upsert and serialize with L16. Skip at CP1.
- Tuning CC timeout upward: does not fix a 300s hang; the GET must not do the probe.

## ADDENDUM (operator 2026-08-14)

CC county manifest page IS the customer-done probe. Curl-pass + console-timeout = FAIL.
