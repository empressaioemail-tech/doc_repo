---
id: 2026-06-08_smartcity-os_cc-agent-M_bastrop_cip_powerbi_repoint
title: Bastrop CIP Power BI repoint to live Dataverse — close
date: 2026-06-08T18:00:00Z
agent: cc-agent-M
repo: empressaio_tech_smartcity_os
kind: inbox
status: complete
related: [31a_bastrop_maintenance_sprint, 2026-06-08_cc-agent-M_bastrop_cip_powerbi_repoint_dataverse]
---

# Bastrop CIP Power BI repoint — close

**Source:** cc-agent-M dispatch `2026-06-08_cc-agent-M_bastrop_cip_powerbi_repoint_dataverse.md`
**Model:** Grok Build 0.1 (default; no escalation)
**Timestamp:** 2026-06-08T18:00:00Z

## Atoms touched

| Atom ref | Value |
|---|---|
| `service:smartcity-api` | CIP tile data path via `/api/powerbi/cip-data` → `getCIPProjectData()` |
| `jurisdiction:bastrop` | tenant_id 2; Bastrop CIP workspace + Dataverse org `org260e8b61.crm9.dynamics.com` |

## PR (held for operator merge)

- **URL:** https://github.com/empressaioemail-tech/smartcity-os/pull/23
- **Branch:** `fix/bastrop-cip-powerbi-dataverse-repoint`
- **SHA:** `da079be5e45cb2d0cdf2e235137edc954687386e`

## GCP Secret Manager repoint (`smartcity-os-prod`)

| Secret | New value length | Version |
|---|---|---|
| `smartcity-POWERBI_CIP_DATASET_ID` | 36 | v3 |
| `smartcity-POWERBI_REPORT_ID` | 36 | v4 |

Values (not echoed): dataset `f86e76e6-26f6-43b2-86e6-0b3aaec72243`; report `8a4009f6-e5c9-4ccf-b1e2-66409158538a`.

**Note:** Initial Windows `echo -n | gcloud` pipe wrote corrupted v2 (len=2); corrected via `--data-file` temp files to v3/v4 (len=36 each).

## Schema discovery output (`discoverCIPSchema()`)

`INFO.TABLES()`, `INFO.COLUMNS()`, and `INFO.MEASURES()` all return **400** on this DirectQuery/Dataverse dataset (AnalysisServices error `3239575574`). Fallback sample-row discovery used instead.

### INFO.TABLES (fallback equivalent)

```json
[
  { "[Name]": "msdyn_project", "[IsHidden]": false },
  { "[Name]": "msdyn_projecttask", "[IsHidden]": false },
  { "[Name]": "msdyn_projectbucket", "[IsHidden]": false }
]
```

### INFO.COLUMNS (fallback — mapping columns used by `getCIPProjectData()`)

**msdyn_project**

| [TableName] | [Name] | [DataType] |
|---|---|---|
| msdyn_project | Project | discovered-from-sample-row |
| msdyn_project | Name | discovered-from-sample-row |
| msdyn_project | % Complete | discovered-from-sample-row |
| msdyn_project | Start Date | discovered-from-sample-row |
| msdyn_project | Finish Date | discovered-from-sample-row |
| msdyn_project | Duration (Days) | discovered-from-sample-row |
| msdyn_project | statuscodename | discovered-from-sample-row |

**msdyn_projecttask**

| [TableName] | [Name] | [DataType] |
|---|---|---|
| msdyn_projecttask | msdyn_project | discovered-from-sample-row |
| msdyn_projecttask | Project Task Name | discovered-from-sample-row |
| msdyn_projecttask | Outline Level | discovered-from-sample-row |
| msdyn_projecttask | msdyn_summary | discovered-from-sample-row |
| msdyn_projecttask | % Complete | discovered-from-sample-row |
| msdyn_projecttask | Start Date | discovered-from-sample-row |
| msdyn_projecttask | Start | discovered-from-sample-row |
| msdyn_projecttask | Finish | discovered-from-sample-row |
| msdyn_projecttask | Duration | discovered-from-sample-row |
| msdyn_projecttask | Project Bucket | discovered-from-sample-row |

**msdyn_projectbucket**

| [TableName] | [Name] | [DataType] |
|---|---|---|
| msdyn_projectbucket | Name | discovered-from-sample-row |
| msdyn_projectbucket | msdyn_project | discovered-from-sample-row |
| msdyn_projectbucket | Display Order | discovered-from-sample-row |

### INFO.MEASURES

```json
[]
```

Completion sourced from `msdyn_projecttask[% Complete]` column (no DAX measures on this dataset).

## Live project verification (`getCIPProjectData()`)

**Source:** prod service principal + new dataset `f86e76e6-26f6-43b2-86e6-0b3aaec72243`
**Timestamp:** 2026-06-08T17:52:00Z

- **projectCount:** 28
- **taskRows:** 119 (outline-level-1 summary phases + 2 project-level fallbacks for IT CIP projects without phase summaries)

### Sample: Agnes Street Extension Project

```json
{
  "name": "Agnes Street Extension Project",
  "overallCompletion": 0.828,
  "currentPhase": "Reconciliation",
  "status": "in-progress",
  "phases": [
    { "task": "Initiation", "completion": 1, "phaseStart": "2018-07-10T09:00:00", "phaseEnd": "2021-12-14T17:00:00" },
    { "task": "Planning", "completion": 1, "phaseStart": "2022-06-03T09:00:00", "phaseEnd": "2024-07-26T12:00:00" },
    { "task": "Notice and Award", "completion": 1, "phaseStart": "2024-08-05T09:00:00", "phaseEnd": "2024-10-01T17:00:00" },
    { "task": "Execution", "completion": 1, "phaseStart": "2024-10-08T09:00:00", "phaseEnd": "2026-02-13T17:00:00" },
    { "task": "Reconciliation", "completion": 0.14, "phaseStart": "2025-12-29T09:00:00", "phaseEnd": "2028-02-14T14:00:00" }
  ]
}
```

### Sample: Wastewater Treatment Plant #4

```json
{
  "name": "Wastewater Treatment Plant #4",
  "overallCompletion": 0.46,
  "currentPhase": "Planning",
  "status": "in-progress",
  "phases": [
    { "task": "Planning", "completion": 0.92, "phaseStart": "2025-06-02T09:00:00", "phaseEnd": "2026-04-27T17:00:00" },
    { "task": "Execution", "completion": 0, "phaseStart": "2026-05-11T09:00:00", "phaseEnd": "2027-09-01T17:00:00" }
  ]
}
```

## Code changes

- `server/services/powerbi.ts`: default `CIP_DATASET_ID` → `f86e76e6-26f6-43b2-86e6-0b3aaec72243`; DAX queries target `msdyn_projecttask` summary phases (outline level 1) joined to `msdyn_project`; projects without phase rows get project-level fallback; duplicate names disambiguated with GUID prefix.
- `CIPTask` / `CIPProject` interfaces unchanged.

## Verification artifacts

| Check | Result | Timestamp |
|---|---|---|
| `npm test` | 103 passed (17 files) | 2026-06-08T17:51:00Z |
| `tests/server/powerbi-dax-url.test.ts` | 2 passed | 2026-06-08T17:52:00Z |
| `npx tsc --noEmit` | No new `powerbi.ts` errors; pre-existing client framer-motion TS debt unchanged | 2026-06-08T17:52:00Z |
| Live DAX `EVALUATE msdyn_project` | 28 rows | 2026-06-08T17:30:00Z |

## Stakeholder note (relay to Jaime)

Confirmed: the SmartCity OS service principal has Workspace Admin and we pull 28 live CIP projects from the new Dynamics dataset. We repointed our config and updated the data mapping to the new Dataverse schema; CIP tiles will reflect the live database after deploy.

## Blockers / follow-ups

1. **Deploy required:** PR #23 held for operator merge + `smartcity-api` Cloud Run deploy to pick up code. Secrets already updated in GCP.
2. **INFO.* DAX unsupported** on DirectQuery/Dataverse dataset — `discoverCIPSchema()` uses sample-row fallback; documented in close note.
3. **Duplicate project names** (`Simple Project`, `Project Management`) disambiguated in output as `Name (xxxxxxxx)` using GUID prefix — frontend may show suffix; flag if Jaime prefers a different label.
4. **Two IT CIP projects** lack outline-level phase summaries; mapped via single project-level fallback phase from `msdyn_project[% Complete]`.
