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
- GROUND-TRUTH (2026-08-17T14:32Z): G-61 CLOSED. Dashboards `00002-sxq` @100% health packsStore=neon. Compose 48021:34137 atoms ok 11 types, files empty tenant:template-city. MCP `00076-veq` list_lenses still live. City `00118-qox` @100% lane4. Dirty secrets_scan.yml + mygov.ts only.
- GROUND-TRUTH (2026-08-17T14:59Z): G-62 CLOSED. Dashboards `00003-jc2` compose omits owner-fact. MCP `00078-xuv` @100% tag g62 anon dashboards_compose_city_manager atomCount 9. City `00118-qox` @100% lane4.
- OPEN: G-11 WDLL drafted, pending operator approval (`_inbox/2026-08-17_g11_tenancy_WDLL.md`). Not dispatched. G-45, PermitFlow kill, Compass, Bastrop cutover, G-24 ingest not started. G-21 honesty still OPEN.
- GROUND-TRUTH (2026-08-17): G-63 CLOSED. Dashboards `00004-zsq` GET /api/adapter-kinds seven kinds, samsara writesTo files, template-city grantedAdapters []. MCP `00080-voc` @100% tag g63 anon dashboards_list_adapter_kinds. City `00118-qox` @100% lane4. Close `_inbox/2026-08-17_g63_close.json`.
- GROUND-TRUTH (2026-08-17T14:30:55.899Z): unauth compose `48021:34137` types include `owner-fact` (public-paid). G-62 fail. Artifact `_scratch/g61_dashboards_live_probe.json`.
- GROUND-TRUTH (2026-08-17): G-13 CLOSED caller-split contract. G-61 items 1-2 met.
- GROUND-TRUTH (2026-08-17): Dashboards Cloud Run `smartcity-dashboards-00001-92j` @100% `https://smartcity-dashboards-52ecsl5mvq-ue.a.run.app` health 200 db=connected name=neondb. City-packs 401 unauthed. Live city still `00118-qox` @100% tag lane4.
- LESSON: G-18 as-found and the product-line overlay are different jobs. Cloning live wallpaper is not a Dashboards template.
