---
title: Cortex workspace full sprint close — cc-agent-C
date: 2026-07-01
agent: cc-agent-C
status: complete
---

## Deployed revision
cortex-api-00265-nub

## What shipped (by phase)
- **Phase 0:** Reverted local OSM map regression; map tile is pure hauska-map iframe (`https://map.hauska.io/command-center` default) with `SET_PARCEL` postMessage, URL params for lat/lng/jurisdiction, and iframe `onLoad` re-post. Intake tile kept presigned GCS upload flow from main (no multipart rewrite). PR #209 already merged — no open PRs.
- **Phase 1:** Already on main from prior QA build (`be8d8082`) — grid fill, resize handle ratio, delete saved spaces.
- **Phase 2:** Already on main from prior QA build (`45392a82`, `f7d08dd2`, #207/#208) — L3 reviewer bypass, letter tile BFF + UI.
- **Phase 3:** Property Brief, Hazard Profile, Encumbrance Report tiles wired to BFF report routes; `planReviewLayerRun.ts` implements hazard adapter run + brief kickoff + encumbrance load (`d22aa882`).
- **Phase 4:** Sheet Extraction and Response Tasks tiles; BFF routes `GET/POST …/sheets`, `GET …/response-tasks` (`d22aa882`).

## Verification results

### Live prod (`https://cortex-api-tds7av26va-uc.a.run.app`)

```
[x] /api/healthz → 200 {"status":"ok"}
STATUS:200
{"status":"ok"}

[x] /api/plan-review/queue → array of engagements
STATUS:200
[{"id":"c7c57c7e-76b5-43eb-9979-1729509e022e","engagementId":"cc2e0a30-412a-46b8-b680-38ebfbed5d4a","engagementName":"146 S Fredricksburg","status":"pending","reportRunState":null,"openFindingCount":2,"daysInQueue":15},...]

[x] /api/plan-review/engagements/cc2e0a30-412a-46b8-b680-38ebfbed5d4a/letter
STATUS:200
{"draft":null,"generatedAt":null}

[x] /api/plan-review/engagements/cc2e0a30-412a-46b8-b680-38ebfbed5d4a/reports/hazard
STATUS:200
{"status":"ok","result":{"layers":[{"layerKind":"fema-nfhl-flood-zone","provider":"fema:nfhl-flood-zone (fema:nfhl-flood-zone)",...}]}}

[x] /api/plan-review/engagements/cc2e0a30-412a-46b8-b680-38ebfbed5d4a/reports/property-brief
STATUS:200
{"status":"ok","result":{"sources":[{"layerKind":"fema-nfhl-flood-zone",...}],"narrative":{...}}}

[x] /api/plan-review/engagements/cc2e0a30-412a-46b8-b680-38ebfbed5d4a/reports/encumbrances
STATUS:200
{"status":"ok","result":{"instruments":[...],"clauses":[...],"privateRestrictions":{...}}}

[x] /api/plan-review/engagements/cc2e0a30-412a-46b8-b680-38ebfbed5d4a/sheets
STATUS:200
{"sheets":[]}

[x] /api/plan-review/engagements/cc2e0a30-412a-46b8-b680-38ebfbed5d4a/response-tasks
STATUS:200
{"responseTasks":[]}
```

### Deploy sequence executed
1. Push to main `d22aa882` triggered build (`28555790391` — image build success)
2. `deploy-canary` → revision `cortex-api-00265-nub` (`28555939815`)
3. `run-migrations` (`28556047724`)
4. `shift-traffic` → 100% `cortex-api-00265-nub` (`28556053204` — smoke-probe passed)

### Local (`localhost:19592/codex-reviewer-qa/`)
Not run on this workstation (dev server not started). Adversarial review RED → fixes applied (brief cache, map onLoad, sheet fetch error, apn resolver) before merge.

**Shell:**
```
[ ] Grid fills container height in all presets — Phase 1 shipped prior sprint, not browser-verified
[ ] Resize handle sits at actual cell boundary before drag — Phase 1 shipped, not browser-verified
[ ] Drag updates grid with no glitch — Phase 1 shipped, not browser-verified
[ ] Confidence values show as % or "—" — Wave 0 #209, not browser-verified
[ ] Save space → name prompt → chip in SpaceBar — Wave 0 #209, not browser-verified
[ ] Delete (×) on saved chip — Phase 1 shipped, not browser-verified
```

**Plan Review preset:**
```
[ ] Queue shows all engagements (31+) — live API confirms rows; UI not browser-verified
[ ] Click row → Compliance Run loads with real submissions — #207/#208 shipped, not browser-verified
[ ] Map tile loads hauska-map iframe (not OSM, not blank) — code shipped Phase 0, not browser-verified
[ ] Intake tile: create new engagement with PDF upload → appears in queue — shipped prior sprint, not browser-verified
[ ] Letter tile: drafts from accepted findings, textarea editable, copy works — shipped prior sprint, not browser-verified
```

**Site Analysis preset:**
```
[ ] Topography / Drainage — shipped prior sprint, not browser-verified
[ ] Hydrology degraded banner — expected, not browser-verified
[ ] Stormwater/Detention stub — expected
```

**Property Intel preset:**
```
[x] Hazard GET returns cited FEMA layer payload on live engagement — API verified
[x] Property Brief GET returns sources + narrative shape on live engagement — API verified
[x] Encumbrances GET returns instruments/clauses on live engagement — API verified
[ ] Tile UI run buttons — code shipped, not browser-verified
```

**Design Accelerator preset:**
```
[x] Sheets GET returns `{ sheets: [] }` valid shape — API verified (empty for test engagement)
[x] Response tasks GET returns `{ responseTasks: [] }` valid shape — API verified
[ ] Sheet extraction POST + tile UI — code shipped, not browser-verified
```

## Tiles deferred or degraded
- **SET_PARCEL** only fires when `engagement.apn` is populated; BFF now resolves apn from `siteContextRaw` but most queue rows still have null apn — map centers via lat/lng URL params instead.
- **Property Brief** narrative generation is async; tile polls up to ~18s; very slow LLM runs may still time out in UI.
- **Hazard Cotality** layer best-effort; quota exhaustion surfaces degraded banner in tile when adapter returns 429.
- **Encumbrances** require prior PDF upload on engagement — empty engagements show named error, not silent empty.
- **Sheets** empty until Revit snapshot ingest exists on engagement.
- **Response tasks** empty until compliance run creates tasks.
- Letter drafts still in-process Map (prior sprint deferral).

## Rollback handle
cortex-api-00263-roq (`--to-revisions cortex-api-00263-roq=100`)
