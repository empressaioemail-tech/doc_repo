---
id: 2026-05-28_cc-agent-C_brokerage_fema_regrid_brief_layers
title: Dispatch — Property Brief FEMA + Regrid layers on /brief (prod enablement)
date: 2026-05-28
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [75a_hauska_brief_extension, 75b_brief_coverage_v0, _dispatches/2026-05-26_cc-agent-C_brokerage_site_context_layers, 90_runbooks/property_brief_cortex_deploy]
---

# Property Brief — FEMA flood + Regrid parcel/zoning on `/brief`

You are **cc-agent-C** on `legacy-design-tools`.

## Context

- **Code is merged:** PR #131 (`cortex/brokerage-site-context`, SHA `e964fc8`) is on `origin/main` (also in #133 merge line `aa41554`).
- `artifacts/api-server/src/lib/brokerageSiteContext.ts` runs `fema-nfhl`, `regrid:parcels`, `regrid:zoning` and returns `siteContext.layers[]` on `POST /api/brokerage/v1/brief`.
- `generateLaySummary` uses flood layer summary for the **Flood risk** verdict when layers are present.
- Operator is on **V1 launch gate step 4** (citations + parcel intelligence visible on brief). Extension panel work is a **separate dispatch** — do not block on extension UI in this run.

## Atoms to resolve

- `current-state:portfolio`
- `product:property-brief` — step 4 parcel layer gate

## Read first

1. [`75a_hauska_brief_extension.md`](../75a_hauska_brief_extension.md) — API contract (`siteContext`, `laySummary`)
2. [`90_runbooks/property_brief_cortex_deploy.md`](../90_runbooks/property_brief_cortex_deploy.md) — deploy + smoke
3. Prior implementation spec (historical): [`_dispatches/2026-05-26_cc-agent-C_brokerage_site_context_layers.md`](2026-05-26_cc-agent-C_brokerage_site_context_layers.md)

## Scope

**In scope:**

1. **Prod secret verification** — `REGRID_API_KEY` mounted on Cloud Run `cortex-api` (`legacy-design-tools-prod`). FEMA NFHL uses public federal endpoints (no Regrid token required for flood-only smoke).
2. **Deploy confirmation** — serving revision includes `aa41554` or later `main` (brief route + `brokerageSiteContext.ts` + `laySummary`).
3. **Smoke** — `POST /api/brokerage/v1/brief` for Bastrop pilot address; assert response shape:
   - `siteContext.layers` array present (may be empty only if geocode fails)
   - At least one layer with `status: "ok"` and non-empty `summary` for **FEMA** and/or **Regrid** when `REGRID_API_KEY` is set
   - `laySummary.verdicts` includes `id: "flood"` with status other than `unknown` when FEMA layer ok
4. **Research chat** — confirm stored `siteContext` from brief run is passed into `generateResearchChat` (read-only verify; fix only if regression found).
5. **Runbook patch** — add `siteContext` + `REGRID_API_KEY` checks to [`90_runbooks/property_brief_cortex_deploy.md`](../90_runbooks/property_brief_cortex_deploy.md) smoke section (small doc PR in `doc_repo` or note in inbox for planner).

**Out of scope:**

- Extension panel rendering (`_dispatches/2026-05-28_extension_property_brief_parcel_layers_panel.md`).
- USGS, EPA, county GIS adapters beyond FEMA + Regrid trio.
- `briefing_sources` persistence.
- API path rename off `/api/brokerage/v1/*`.

## Operator actions (coordinate in inbox)

| Action | Command / note |
|--------|----------------|
| Confirm Regrid secret | `gcloud secrets describe REGRID_API_KEY --project=legacy-design-tools-prod` |
| Mount on cortex-api | Cloud Run → `REGRID_API_KEY` env from Secret Manager (same binding as engagement adapters per `_decisions/2026-05-23_partnership_first_scoping.md`) |
| Redeploy if needed | [`property_brief_cortex_deploy.ps1`](../90_runbooks/property_brief_cortex_deploy.ps1) with current `main` SHA |

Pilot addresses:

- `245 Flaming Oak Dr, Bastrop, TX 78602` (operator Zillow test)
- `251 Cool Water Dr, Bastrop, TX 78602` (runbook smoke)

## Acceptance criteria

- [ ] `curl` brief smoke returns HTTP 200 with `siteContext.layers.length >= 1` and at least one `layerKind` matching `fema` or `regrid` with `status: "ok"` when Regrid key mounted.
- [ ] `laySummary.verdicts` flood entry reflects FEMA summary when flood layer ok (not stuck on "Flood data was not available").
- [ ] Verbatim `curl` output (redact API key) in `_inbox/` close note.
- [ ] No new code required if smoke passes after secret mount; if code fix needed, single PR held for operator merge.

## Reporting

`_inbox/2026-05-28_legacy-design-tools_cc-agent-C_fema_regrid_brief_layers.md` with PR URL (if any), revision SHA serving prod, smoke JSON excerpt, blockers verbatim.
