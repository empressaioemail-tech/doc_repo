# Lane B G-18 scratch

Workstream: G-18 SmartCity keep/mount/kill inventory. Read-only. WDLL approved 2026-08-17.

- GROUND-TRUTH (2026-08-17T12:45:56-05:00): smartcity-api-00118-qox @100% tag lane4. smartcityos.io HTML last-modified 2026-08-01T23:02:34Z bundle /assets/index-kGj7uMs4.js 5578225 bytes. GET /api/health 200 db=connected.
- GROUND-TRUTH (2026-08-17T12:48:07Z): GET /api/ai/morning-brief 200 generatedAt now; WO 25-000280 Locate Water / Wastewater Lines; activePermits=340 overdueWorkOrders=64.
- GROUND-TRUTH (2026-08-17T12:48Z): GET /api/ai/city-snapshot 200 Active Permits=12599 Fleet=84 Open WO=142 budget=89338711 overdue=0.
- GROUND-TRUTH (2026-08-17T12:48Z): GET /api/calendar/status 200 lastScrapeAt=2026-08-17T10:30:41.290Z lastScrapeStatus=ok cachedSource=municode.
- GROUND-TRUTH (2026-08-17): live bundle smartsite.cloud=0 leaflet=11 permitflow=160 plan-review=0 cotality=0 stripe.com=0 smart-files=0.
- LESSON: SPA path HTML 200 is catch-all (3624 byte shell). Grade the handler / JSON / bundle string, never the HTML 200.
- LESSON: serving CSP connect-src/frame-src is a live probe of what the city can mount. SmartSite/plan-review/files are not in it.
- DEAD-END: do not treat /api/calendar HTML 200 as the calendar API. Real probes are /api/calendar/status and /api/calendar/events/public.
- OPEN: G-21 on the same rows. Staff session would grade Spireon/Verkada/FirstDue/GoTo/Power BI. Reconcile 340 vs 12599 and 64 vs 0.
- OPEN: G-24 rogue entity_type COUNT not run (L26 holds slot; no heavy scan).
- OPEN: G-61 housing `empressaioemail-tech/smartcity-dashboards` main `01a6cfe`. MCP [PR #70](https://github.com/empressaioemail-tech/hauska-mcp-server/pull/70), not serving. Cutover WDLLs not started.
- GROUND-TRUTH (2026-08-17): G-13 CLOSED caller-split contract. G-61 items 1-2 met.
- GROUND-TRUTH (2026-08-17): GitHub `empressaioemail-tech/smartcity-dashboards` created; cloned to `P:\smartcity-dashboards`. Live `P:\smartcity-os` still dirty `secrets_scan.yml` + `mygov.ts` on `ci/dast-issues-write-permission`.
- LESSON: G-18 as-found and the product-line overlay are different jobs. Cloning live wallpaper is not a Dashboards template.
