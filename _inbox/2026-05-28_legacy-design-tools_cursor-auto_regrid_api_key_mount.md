---
date: 2026-05-28
agent: cursor-auto (Cursor, cente workstation)
repo: legacy-design-tools
type: finding
status: done
---

# Ops — `REGRID_API_KEY` mounted on prod `cortex-api`

## Summary

`REGRID_API_KEY` was not mounted on Cloud Run `cortex-api` (secret existed in GCP Secret Manager only). Operator ran one-time mount on **2026-05-28**; smoke confirms FEMA + Regrid adapters are live. Parcel/zoning may still return `no-coverage` for addresses outside Regrid coverage — that is data, not a missing secret.

## Cloud Run

| Item | Value |
|------|-------|
| Project | `legacy-design-tools-prod` |
| Service | `cortex-api` |
| Region | `us-central1` |
| Revision | `cortex-api-00062-bq6` (100% traffic after deploy) |
| Service URL | `https://cortex-api-1062716564162.us-central1.run.app` |
| Smoke URL (alias) | `https://cortex-api-tds7av26va-uc.a.run.app` |

### Commands executed

```powershell
gcloud config set project legacy-design-tools-prod
gcloud run services update cortex-api `
  --region=us-central1 `
  --update-secrets=REGRID_API_KEY=REGRID_API_KEY:latest
```

`update-traffic --to-latest` was not required separately — deploy routed 100% to the new revision.

### Env confirmed on template

`REGRID_API_KEY` → `secretKeyRef: REGRID_API_KEY:latest` (alongside existing FEMA path; no code change).

## IAM correction

Runbook snippet used default compute SA; **actual runtime SA** is:

`api-server-runtime@legacy-design-tools-prod.iam.gserviceaccount.com`

Granted `roles/secretmanager.secretAccessor` on secret `REGRID_API_KEY` (deploy had already succeeded; binding documents the correct SA for future rotations). Prior binding for `1062716564162-compute@developer.gserviceaccount.com` retained.

## Smoke — `POST /api/brokerage/v1/brief`

| Field | Value |
|-------|-------|
| Address | `245 Flaming Oak Dr, Bastrop, TX 78602` |
| `presentationMode` | `consumer` |
| `X-Hauska-Install-Id` | `smoke-01` |
| Auth | prod `BROKERAGE_DEV_API_KEY` (already on service env) |

### `siteContext.layers`

| Layer | Status | Notes |
|-------|--------|-------|
| `fema-nfhl-flood-zone` | **ok** | Flood Zone X — minimal hazard |
| `regrid-parcel` | `no-coverage` | Regrid API responded; no parcel polygon at geocode |
| `regrid-zoning` | `no-coverage` | No zoning record at lat/lng |

### `laySummary.verdicts` (flood)

| Field | Value |
|-------|-------|
| `id` | `flood` |
| `status` | `no` (not `unknown`) |
| `oneLine` | Property sits in Flood Zone X with low flood risk |

**Pass criteria met:** FEMA layer `ok`; Regrid rows present (authenticated, not empty/missing-key); flood verdict not `unknown`.

### Follow-up for “ok” Regrid row in smoke

Use a pilot address known to sit in Regrid parcel index (Travis/Bastrop coverage). `no-coverage` at Flaming Oak Dr is expected when Regrid has no polygon for that point — not a mount failure.

## Related

- `_inbox/2026-05-26_legacy-design-tools_cc-agent-C_wedge_gtm_parcel.md` (LDT repo) — Track 2 acceptance noted `REGRID_API_KEY` mount required on Cloud Run
- `doc_repo/_inbox/2026-05-28_legacy-design-tools_cc-agent-C_property_brief_lay_surface_close.md` — lay summary + site context consumer surface
- Code env name: `REGRID_API_KEY` (not `REGRID_API_TOKEN`)

## Out of scope

No merge, no migration, no extension release. Chrome extension does not carry Regrid key (server-only).
