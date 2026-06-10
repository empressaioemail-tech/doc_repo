---
id: 2026-06-10_cc-agent-M_bewith_calendar_address_enrichment
title: Dispatch — BeWith calendar feed address/location enrichment
date: 2026-06-10
agent: cc-agent-M
repo: empressaio_tech_smartcity_os
kind: dispatch
status: ready
related: [00_current_state, 31a_bastrop_maintenance_sprint, 30a_smartcity_stabilization_sprint, 20_agent_operating_rules, 01a_atom_conventions, 90_runbooks/cloud_run_canary_deploy]
---

# BeWith calendar feed address/location enrichment

> **Recon-first, self-contained.** Public-consumption partner feed only. Does NOT touch DATABASE_URL / WS-1, the CIP/Power BI path, or Verkada/ESRI (separate dispatch). One cc-agent-M clone per run; do not run concurrently with another cc-agent-M dispatch on this repo. Maps to 31a P2-9.

You are **cc-agent-M**, single owner of `empressaio_tech_smartcity_os` for this run. BeWith is an external partner that subscribes to Bastrop's public city-meetings calendar feed for public display. Today the feed carries meeting body + date + time but **no location/address**. BeWith needs the venue address so the public sees where each meeting is. Add the address to the calendar event data and emit it on the feed BeWith consumes.

## Model (HR-12)

Default: **Grok Build 0.1** (multi-file / agentic). Use **grok-code-fast-1** for narrow, speed-only tasks. Escalate to Claude only if Grok fails after retry; log the escalation in your close note. Cursor base URL `https://api.x.ai/v1`.

## Atoms to resolve

Resolve before reading full canonical docs (catalog: [`01a_atom_conventions.md`](../01a_atom_conventions.md)):

- `service:smartcity-api` — city platform contract
- `jurisdiction:bastrop` — tenant_id 2, the affected tenant

## Read first (after atoms)

1. [`31a_bastrop_maintenance_sprint.md`](../31a_bastrop_maintenance_sprint.md) — P2-9, the calendar traffic-light line
2. `BEWITH_CALENDAR_INTEGRATION_GUIDE.md` (your repo root) — the authoritative description of what BeWith subscribes to and the feed format it reads
3. `server/services/calendar*` and `server/routes/calendar*` (your repo) — the Municode ingest, the event model, and the outbound feed endpoints
4. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-8, HR-11

## Verified facts (source: doc_repo 2026-06-10 session, live WebFetch + repo recon)

- The Municode meetings index at `https://bastrop-tx.municodemeetings.com/` carries body name + date + time ONLY. **No address/location on the listing** (verified by live fetch 2026-06-10). The address is not in the feed you currently scrape; it lives one layer deeper (meeting detail page and/or the agenda PDF header, typically "City Hall Council Chambers, 1311 Chestnut Street, Bastrop, TX 78602").
- BeWith is the named env-keyed partner subscriber. `CALENDAR_API_KEY` (the env-keyed `?api_key=` partner-subscription key) is **currently unbound in Cloud Run** (per `90_runbooks/smartcity_cloud_run_env_audit_2026-05-11.md`). A public read-only endpoint `/api/calendar/events/public` exists and works (W1.A.6 F-1, PR #12). You must determine which path BeWith actually uses.
- Bastrop has ~7 recurring meeting bodies: Regular City Council, Main Street Advisory Board, Bridging Bastrop Board, Bastrop Economic Development Corporation (BEDC), Historic Landmark Commission, Zoning Board of Adjustments, plus others. Most meet at City Hall chambers; some (BEDC especially) may meet elsewhere. Do NOT assume one address for all.

## Recon (do this FIRST, report before implementing — HR-5)

Answer all three with evidence, then proceed:

1. **Where does the address live, and does the ingest already capture it?** Read the Municode ingest in `server/services/calendar*`. Does it already fetch the meeting detail page / parse a location, or only the listing fields? Check whether a meeting detail page or agenda PDF header carries a structured venue string. Conclusion: does location come for free from the source, or must we derive it?
2. **Which feed does BeWith consume?** From `BEWITH_CALENDAR_INTEGRATION_GUIDE.md`: the public `/api/calendar/events/public` endpoint, or the env-keyed `?api_key=` path (needs `CALENDAR_API_KEY`)? If env-keyed, binding `CALENDAR_API_KEY` is a prerequisite — flag it; the operator holds the value.
3. **What field does BeWith read for location?** iCal `VEVENT LOCATION`, a JSON `location` field, or both? Confirm the exact field end to end.

## Scope

**In scope (implement after recon):**

1. **Address source.** Preferred: a small, explicit **meeting-body → venue address map** keyed by body name, with each address taken VERBATIM from that body's most recent agenda header on Municode (paste the source line per address in your close note — no invented addresses, quality-gate + source-required). Use detail-page/PDF scraping for location only if recon shows venues genuinely vary per occurrence and a static map is wrong. If the ingest already captures a reliable location, plumb that through instead and skip the map.
2. **Event model.** Populate the calendar event `location` field (add it if absent) for Bastrop (tenant_id 2) meetings.
3. **Feed emission.** Ensure the field BeWith reads is populated end to end — iCal `VEVENT` emits `LOCATION:<address>` and/or the JSON feed carries `location`, per recon answer 3.
4. **`CALENDAR_API_KEY` (only if recon answer 2 says env-keyed).** Flag to operator; bind if value provided (Secret Manager + Cloud Run, IAM secretAccessor on the runtime SA). If BeWith is on the public endpoint, skip.

**Out of scope:**

- DATABASE_URL / WS-1 migration data path.
- CIP / Power BI (separate, already deployed).
- Verkada / ESRI (separate dispatch).
- Any other tenant's calendar; any tenant-private data. This feed is public-tier only (published public meetings + public venue address) — no private or tenant-pooled data goes to BeWith.
- Geocoding to lat/long (ESRI) — BeWith needs the text address; coordinates are out of scope here.

## Deploy (canary form — smartcity-api)

Per [`90_runbooks/cloud_run_canary_deploy.md`](../90_runbooks/cloud_run_canary_deploy.md). smartcity-api specifics, all confirmed 2026-06-10:

- Build via `gcloud builds submit --config cloudbuild-api.yaml` — NEVER `--source .` (Buildpacks ship the stale Replit entry point).
- Run the build step ALONE and let it finish; do not paste the whole block (a Ctrl-C mid-build with queued deploy commands leaves a half-deployed revision from a non-finalized `:latest`).
- Canary: `gcloud run deploy smartcity-api --image <repo>/smartcity-api:latest --region us-central1 --tag bewith-addr-20260610 --no-traffic`, smoke the tag URL, then `update-traffic --to-tags bewith-addr-20260610=100`.
- Health endpoint is `/api/health` (not `/api/healthz`). Audit existing traffic tags before relying on `--to-latest`; the service is carrying stale 0% tags.
- One cc-agent-M deploys; do not deploy concurrently with the Verkada/ESRI dispatch.

## Acceptance criteria

- Recon answers (1-3) reported with evidence before code.
- Bastrop meeting events carry the venue address; each mapped address quoted from its Municode agenda source (verbatim).
- The feed BeWith consumes emits the location field (paste a sample `VEVENT` and/or JSON event showing `LOCATION`/`location`).
- If env-keyed: `CALENDAR_API_KEY` bind reported (length-echo / describe, not the value) or flagged as operator-pending.
- Typecheck green; vitest green (verbatim).
- Deployed via canary; live revision + traffic table pasted; `/api/health` 200 on the canary and on prod after shift.
- All outputs carry source, value, timestamp (quality-gate rule); verbatim verification artifacts (HR-8).

## Reporting

At break-point, write to `P:\doc_repo\_inbox\` as `2026-06-10_smartcity-os_cc-agent-M_bewith_calendar_address_close.md`. Include atom refs touched, model used (if not default Grok), recon answers, the body→address map with per-address Municode source quotes, the sample feed event, branch + SHA + PR URL, deploy revision + traffic table, and blockers verbatim.

## Workspace ownership

- Clone: `P:\empressaio_tech_smartcity_os`
- Branch: `feat/bewith-calendar-address-enrichment`
- One agent per clone. Refuse alien HEAD or uncommitted state; report verbatim `git status` plus `git log -3`.
