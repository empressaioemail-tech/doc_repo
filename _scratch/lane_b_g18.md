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
- GROUND-TRUTH (2026-08-17T19:04Z): G-64 as-found. Dashboards `00006-vfk` GET `/` is G-45 SmartSite 908 PINE. Served app.js permitflow=0 plan-review=0 development-services absent from JS (lenses from API). Plan-review-app GET `/` 200 persona gate icc-demo reviewer/observer/applicant. Plan-review Cloud Run GET `/` 200 `{ok:true,service:plan-review}` HEAD `/` 404. City CSP omits plan-review-app. Live PermitFlow uncut.
- GROUND-TRUTH (2026-08-17): operator aligned on Compass as the doc 34 sidebar (not a category, not a card this wave). Live chatbot stays until the sidebar exists.
- GROUND-TRUTH (2026-08-17T19:18Z): G-64 CLOSED. Dashboards `00007-8sc` GET `/?lens=development-services` iframe `https://plan-review-app-ten.vercel.app/` Plan review persona gate, no Compose click. GET `/` still 908 PINE / APN 34137. Served app.js permitflow=false. Anon MCP `data.planReview.url` matches. City `00118-qox` `/permitflow/review` 200, bundle permitflow=160. MCP `00082-mat` tag g11. Close `_inbox/2026-08-17_g64_close.json`.
- GROUND-TRUTH (2026-08-17T19:22Z): G-65 CLOSED. Dashboards GET `/app.js` permitflow=0; GET `/permitflow` 404; GET `/permitflow/review` 404. Paired control city bundle permitflow=160 and `/permitflow/review` 200. No G-65 product PR. Close `_inbox/2026-08-17_g65_close.json`.
- OPEN: live `/permitflow/*` deletion is a named island replacement, not G-65 and not a city-wide Bastrop cutover. Do not start G-52. Compass not a card.
- OPEN (2026-08-17): operator rejected Bastrop cutover as next. Sequence is G-66 UI then one source onto template-city. Three identities: template-city demo, live Bastrop island, next-city pack. Gold 48021:34137 is a demo fixture. Gap `_inbox/2026-08-17_dashboards_missing_pieces.md`. Decision `_decisions/2026-08-17_dashboards_ui_then_one_feed.md`.
- GROUND-TRUTH (2026-08-17T23:12Z): G-66 CLOSED. Dashboards `00008-d55` @100%. GET `/` badge Demo, no compose-form. GET `/?lens=finance` Partial, no $0. GET `/?lens=citizen` no Pay now. GET `/compass` 404. Compose JSON atomCount 9 gold 48021:34137. PR **#8** squash `4ad3ba4489d0896744f59cee21ad7b87b3ba51d2` CI run 32079207831 conclusion success. City `00118-qox` `/permitflow/review` 200. Close `_inbox/2026-08-17_b_g66_close.json`.
- OPEN: G-68 Files UI and G-69 Plan Review UI still in flight. First adapter grant after those. G-24 stays zero.
- GROUND-TRUTH (2026-08-17T23:17Z): G-68 CLOSED. Files QA `dpl_3KjVHdKS1s7Rcpj3hehDvEJmqKqM`. PR **#2** squash `569bbdbd`. Create 201 share 201 token `FT6d3VBvfyM-c1gQBSwf6aH2`. Cortex 404. Close `_inbox/2026-08-17_a_g68_close.json`.
- GROUND-TRUTH (2026-08-17T23:17Z): G-69 CLOSED. Plan Review QA `dpl_CKg13X2su89rQYjore9VevtfDfP9`. PR **#2** squash `4330ac85`. Planner fix: `/` auto-sets reviewer so queue lands. Dashboards compose still iframes this host. City `00118-qox` `/permitflow/review` 200. Close `_inbox/2026-08-17_c_g69_close.json`.
- OPEN: one source onto template-city. Native Dashboards Review compose (iframe residual). G-24 stays zero. Do not start G-52.
- GROUND-TRUTH (2026-08-17): G-45 as-found. Dashboards `00005-m5t` GET `/` iframe about:blank. After Compose 48021:34137 / template-city, iframe src `https://smartsite.cloud/?parcelNodeId=48021%3A34137`, PE bundle `index-Dt-8jbWe.js` shows 908 PINE APN 34137 SF-1. Atoms ok 9. Files unavailable files auth refused. City CSP still omits smartsite.cloud.
- GROUND-TRUTH (2026-08-17T17:28:05.794Z): G-11 CLOSED. Dashboards `00005-m5t` unauth fixture-city 401, Bearer 403, identified grants []. MCP `00082-mat` @100% tag g11 whoami plus identified get_city_pack. City `00118-qox` @100% lane4. Probe keys revoked. Close `_inbox/2026-08-17_g11_close.json`.
- GROUND-TRUTH (2026-08-17): G-11 local tests Dashboards 43 pass, MCP tsc clean and 501 pass. CP2 HOLD `_inbox/2026-08-17_g11_cp2.json`.
- GROUND-TRUTH (2026-08-17): G-63 CLOSED. Dashboards `00004-zsq` GET /api/adapter-kinds seven kinds, samsara writesTo files, template-city grantedAdapters []. MCP `00080-voc` @100% tag g63 anon dashboards_list_adapter_kinds. City `00118-qox` @100% lane4. Close `_inbox/2026-08-17_g63_close.json`.
- GROUND-TRUTH (2026-08-17T14:30:55.899Z): unauth compose `48021:34137` types include `owner-fact` (public-paid). G-62 fail. Artifact `_scratch/g61_dashboards_live_probe.json`.
- GROUND-TRUTH (2026-08-17): G-13 CLOSED caller-split contract. G-61 items 1-2 met.
- GROUND-TRUTH (2026-08-17): Dashboards Cloud Run `smartcity-dashboards-00001-92j` @100% `https://smartcity-dashboards-52ecsl5mvq-ue.a.run.app` health 200 db=connected name=neondb. City-packs 401 unauthed. Live city still `00118-qox` @100% tag lane4.
- LESSON: G-18 as-found and the product-line overlay are different jobs. Cloning live wallpaper is not a Dashboards template.
