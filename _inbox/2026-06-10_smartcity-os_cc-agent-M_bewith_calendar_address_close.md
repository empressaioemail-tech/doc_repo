---
id: 2026-06-10_smartcity-os_cc-agent-M_bewith_calendar_address_close
title: BeWith calendar feed address/location enrichment close
date: 2026-06-10
agent: cc-agent-M
repo: empressaio_tech_smartcity_os
kind: inbox
status: complete
related: [2026-06-10_cc-agent-M_bewith_calendar_address_enrichment, 31a_bastrop_maintenance_sprint, service:smartcity-api, jurisdiction:bastrop]
---

# BeWith calendar feed address/location enrichment — close

**Timestamp:** 2026-06-10T18:56:00Z  
**Model:** Grok Build 0.1 (default; no escalation)

## Atoms touched

- `service:smartcity-api` — calendar feed contract (`server/routes/calendar.ts`)
- `jurisdiction:bastrop` — tenant_id 2, Municode ingest + outbound feeds

## Recon answers (HR-5)

### 1. Where does the address live, and does ingest already capture it?

**Source:** `server/routes/calendar.ts` `parseMunicodeHTML()` + live Municode fetch 2026-06-10.

The ingest fetches only the Municode meetings **listing** (`https://bastrop-tx.municodemeetings.com/`). It parses table rows for title, date, time, links (detail, agenda, packet, minutes, video). **No location field is scraped.** Meeting detail pages also omit venue text in the HTML body (verified: `regular-city-council-meeting-67` detail page shows date/time only).

Venue addresses live in **agenda PDF headers**, one layer deeper. Example verbatim extractions from Municode agenda PDFs fetched 2026-06-10:

| Body | Municode agenda source line (verbatim) |
|------|---------------------------------------|
| City Council | `City Hall City Council Chambers \| 1311 Chestnut Street \| Bastrop, Texas 78602` |
| BEDC | `Bastrop City Hall City Council Chambers \| 1311 Chestnut Street \| Bastrop, TX 78602` |
| Bridging Bastrop | `City Hall City Council Chambers \| 1311 Chestnut Street \| Bastrop, TX 78602` |
| Main Street Advisory Board | `Bastrop City Hall City Council Chambers \| 1311 Chestnut Street \| Bastrop, TX 78602` |
| Parks/Tree Advisory Board | `Bastrop City Hall City Council Chambers \| 1311 Chestnut Street \| Bastrop, TX 78602` |
| Historic Landmark Commission | `Bastrop City Hall City Council Chambers \| 1311 Chestnut Street \| Bastrop, TX 78602` |
| Planning and Zoning | `City Hall City Council Chambers \| 1311 Chestnut Street \| Bastrop, TX 78602` |
| Zoning Board of Adjustments | `Bastrop City Hall City Council Chambers \| 1311 Chestnut Street \| Bastrop, TX 78602` |
| Public Library Board | `Bastrop Public Library Pressley Meeting Room \| 1100 Church Street \| Bastrop, TX 78602` |

**Conclusion:** Location does **not** come for free from the listing scrape. Implemented a meeting-body → venue map keyed by event title (Library Board off-site; all other recurring bodies → City Hall Council Chambers). Addresses normalized to full single-line strings for feed emission.

### 2. Which feed does BeWith consume?

**Source:** `BEWITH_CALENDAR_INTEGRATION_GUIDE.md` (repo root).

BeWith consumes the **env-keyed authenticated** endpoints:

- `GET /api/calendar/events.json?api_key=YOUR_API_KEY`
- `GET /api/calendar/events.ics?api_key=YOUR_API_KEY`
- `GET /api/calendar/events.rss?api_key=YOUR_API_KEY`

Base URL documented as `https://smartcityos.io`. Auth via `?api_key=`, `?key=`, or `Authorization: Bearer`.

The public endpoint `/api/calendar/events/public` exists (no auth) but is **not** the BeWith integration path per the guide.

**`CALENDAR_API_KEY` status (operator-pending):** Not bound on Cloud Run `smartcity-api` as of 2026-06-10T18:56Z. `gcloud run services describe smartcity-api --region us-central1` returns no `CALENDAR_API_KEY` env or secret ref. BeWith must use either operator-bound `CALENDAR_API_KEY` or tenant `calendarFeedKey` via `?key=`. **Operator action required** to bind `CALENDAR_API_KEY` in Secret Manager + Cloud Run if BeWith uses the env-keyed path documented in the guide.

### 3. What field does BeWith read for location?

**Source:** `BEWITH_CALENDAR_INTEGRATION_GUIDE.md` (pre-change) listed JSON event fields without `location`; iCal section listed SUMMARY, DESCRIPTION, URL but not LOCATION.

**Implemented end-to-end:**

- JSON (`events.json`, `events`, `events/public`): `location` string on each event
- iCal (`events.ics`): RFC 5545 `LOCATION:` property on each `VEVENT`
- RSS: `Location:` line in item description

## Body → address map (implemented)

| Match rule | Emitted `location` | Municode agenda source |
|------------|-------------------|------------------------|
| Title contains `library` (case-insensitive) | `Bastrop Public Library Pressley Meeting Room, 1100 Church Street, Bastrop, TX 78602` | Public Library Board Agenda 06/01/2026: `Bastrop Public Library Pressley Meeting Room \| 1100 Church Street \| Bastrop, TX 78602` |
| All other Bastrop meeting titles (default) | `City Hall City Council Chambers, 1311 Chestnut Street, Bastrop, TX 78602` | City Council Agenda 06/09/2026: `City Hall City Council Chambers \| 1311 Chestnut Street \| Bastrop, Texas 78602` (and matching lines on BEDC, Bridging Bastrop, Main Street, Parks/Tree, HLC, P&Z, ZBA agendas) |

## Sample feed events (live canary, 2026-06-10T18:55Z)

**JSON** (`GET /api/calendar/events/public` on canary — same enrichment on authenticated feeds):

```json
{
  "title": "Regular City Council Meeting",
  "isoDate": "2026-06-09T18:30:00-05:00",
  "date": "06/09/2026",
  "time": "6:30pm",
  "category": "Council",
  "location": "City Hall City Council Chambers, 1311 Chestnut Street, Bastrop, TX 78602"
}
```

```json
{
  "title": "Public Library Board",
  "isoDate": "2026-06-01T18:00:00-05:00",
  "date": "06/01/2026",
  "time": "6:00pm",
  "category": "Board",
  "location": "Bastrop Public Library Pressley Meeting Room, 1100 Church Street, Bastrop, TX 78602"
}
```

**iCal VEVENT** (from `eventsToICal` unit test / production formatter):

```
BEGIN:VEVENT
UID:2026-06-09T18:30:00-05:00-regular-city-council-meeting@bastrop-dashboard
DTSTART;TZID=America/Chicago:20260609T183000
DTEND;TZID=America/Chicago:20260609T203000
SUMMARY:Regular City Council Meeting
LOCATION:City Hall City Council Chambers\, 1311 Chestnut Street\, Bastrop\, TX 78602
DESCRIPTION:Category: Council\nLocation: City Hall City Council Chambers\, 1311 Chestnut Street\, Bastrop\, TX 78602\nTime: 6:30pm
URL:https://bastrop-tx.municodemeetings.com/bc-citycouncil/page/regular-city-council-meeting-67
DTSTAMP:20260610T184835Z
END:VEVENT
```

## Code changes

| File | Change |
|------|--------|
| `server/routes/calendar.ts` | `location` on `CalendarEvent` / `PublicCalendarEvent`; `resolveMeetingLocation` / `enrichEvents`; iCal `LOCATION:` + RSS description; serve-time enrichment for LKG backward compat |
| `tests/server/calendar-location.test.ts` | New — venue resolution + iCal LOCATION |
| `tests/api/calendar-public.test.ts` | `location` in public allowlist + assertion |

## Verification

| Check | Result | Timestamp |
|-------|--------|-----------|
| `npm run check` | **PASS** | 2026-06-10T18:48Z |
| `npm run test` (vitest) | **PASS** — 110 tests | 2026-06-10T18:48Z |
| Canary `/api/health` | **200** `{"status":"ok","db":"connected",...}` | 2026-06-10T18:55Z |
| Prod `/api/health` | **200** `{"status":"ok","db":"connected",...}` | 2026-06-10T18:55Z |
| Canary `/api/calendar/events/public` | **200** — all 25 events carry `location` | 2026-06-10T18:55Z |

## Git / PR

| Item | Value |
|------|-------|
| Branch | `feat/bewith-calendar-address-enrichment` |
| SHA | `f0f81f6` |
| PR | https://github.com/empressaioemail-tech/smartcity-os/pull/24 |

**Workspace at start:** `main` @ `f2bd0b4`, clean except untracked audit markdown files (unchanged).

## Deploy (canary → prod)

```
gcloud builds submit --config cloudbuild-api.yaml
STATUS: SUCCESS
IMAGE: us-central1-docker.pkg.dev/smartcity-os-prod/cloud-run-source-deploy/smartcity-api:latest

gcloud run deploy smartcity-api \
  --image us-central1-docker.pkg.dev/smartcity-os-prod/cloud-run-source-deploy/smartcity-api:latest \
  --region us-central1 \
  --tag bewith-addr-20260610 \
  --no-traffic
Revision: smartcity-api-00113-rar (0% traffic)

# smoke canary
GET https://bewith-addr-20260610---smartcity-api-7dyaiy7wha-uc.a.run.app/api/health → 200

gcloud run services update-traffic smartcity-api \
  --region us-central1 \
  --to-tags bewith-addr-20260610=100
```

**Post-shift traffic table:**

```
  0%   smartcity-api-00080-men   (p0-3-canary)
  0%   smartcity-api-00082-pog   (p0-followup-prophecy)
  0%   smartcity-api-00084-weg   (w1-c-4a-auth-fix)
  0%   smartcity-api-00096-jig   (pbi-ai-cal-20260511)
  0%   smartcity-api-00099-vip   (lkg-20260515-1848)
  0%   smartcity-api-00101-nir   (ical-nan-fix-20260518)
  0%   smartcity-api-00103-tur   (pbi-dax-workspace-fix-20260518)
  0%   smartcity-api-00104-taw   (bastrop-tenant-fix)
  0%   smartcity-api-00106-riz   (empressa-neon)
  0%   smartcity-api-00111-zes   (cip-dataverse-20260610)
  100% smartcity-api-00113-rar   (bewith-addr-20260610)
```

Prod URL: https://smartcity-api-494195107606.us-central1.run.app

## Blockers (verbatim)

1. **`CALENDAR_API_KEY` unbound on Cloud Run** — BeWith integration guide documents `?api_key=` auth; env var not present on `smartcity-api` runtime. Operator must bind secret if BeWith uses that path. Alternative: tenant `calendarFeedKey` via `?key=` (DB-backed, already supported by `validateFeedKeyMiddleware`).

2. **PR #24 not merged to `main`** — deployed from feature branch build (image built from local `feat/bewith-calendar-address-enrichment` @ `f0f81f6`). Merge recommended before next unrelated deploy overwrites `:latest`.
