---
id: 2026-06-08_cc-agent-M_bastrop_cip_powerbi_repoint_dataverse
title: Dispatch — Bastrop CIP Power BI repoint to Jaime's live Dynamics/Dataverse dataset
date: 2026-06-08
agent: cc-agent-M
repo: empressaio_tech_smartcity_os
kind: dispatch
status: ready
related: [00_current_state, 31a_bastrop_maintenance_sprint, 30a_smartcity_stabilization_sprint, 20_agent_operating_rules, 01a_atom_conventions]
---

# Bastrop CIP Power BI repoint to live Dynamics/Dataverse dataset

> **Fire-ready, self-contained.** Does not touch the WS-1 migration data path or DATABASE_URL. Independent of the deferred build-out deploy. Maps to 31a P2-6 (PBI Option B Phase 1) / the W1.A.7 line. One cc-agent-M clone per run; do not run concurrently with another cc-agent-M dispatch on this repo.

You are **cc-agent-M**, single owner of `empressaio_tech_smartcity_os` for this run. Jaime (Bastrop) stood up a new live CIP database. The SmartCity OS Power BI service principal already has Workspace Admin on the CIP workspace and can reach it (verified from production 2026-06-08: embed token generates, live queries work, 28 live CIP projects returned, e.g. Agnes Street Extension, Wastewater Treatment Plant #4). The new source is a live Dynamics 365 / Dataverse connection (`org260e8b61.crm9.dynamics.com`), NOT the old imported-Excel model. Production is still wired to the OLD config, so CIP tiles are empty/stale because the old dataset is gone (404). Repoint and remap.

## Model (HR-12)

Default: **Grok Build 0.1** (multi-file / agentic). Use **grok-code-fast-1** for narrow, speed-only tasks. Escalate to Claude only if Grok fails after retry; log the escalation in your session summary.

Cursor: base URL `https://api.x.ai/v1`.

## Atoms to resolve

Resolve before reading full canonical docs (catalog: [`01a_atom_conventions.md`](../01a_atom_conventions.md)):

- `service:smartcity-api` — city platform health contract
- `jurisdiction:bastrop` — tenant_id 2, the affected tenant

## Read first (after atoms)

1. [`31a_bastrop_maintenance_sprint.md`](../31a_bastrop_maintenance_sprint.md) — P2-6 PBI Option B; this dispatch closes the dataset-gone gap
2. `server/services/powerbi.ts` (your repo) — the service you are changing; note `discoverCIPSchema()` already exists (INFO.TABLES/COLUMNS/MEASURES) and is your discovery tool
3. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-8, HR-11

## Workspace ownership

- Clone: `P:\empressaio_tech_smartcity_os`
- Branch: `fix/bastrop-cip-powerbi-dataverse-repoint`
- One agent per clone. Refuse alien HEAD or uncommitted state; report verbatim `git status` plus `git log -3`.

## Verified facts (source: doc_repo 2026-06-08 session close, probed from prod service principal)

- New CIP dataset id: `f86e76e6-26f6-43b2-86e6-0b3aaec72243` (live Dataverse-backed).
- New CIP report id: `8a4009f6-e5c9-4ccf-b1e2-66409158538a`.
- Old `POWERBI_CIP_DATASET_ID` is GONE (404) — current cause of empty CIP tiles.
- `POWERBI_WORKSPACE_ID` (CIP workspace) is still correct, unchanged.
- Old data model table was `PowerBIDashboardTasks` (imported Excel); the new model is a live Dynamics/Dataverse entity set (`msdyn_project` family). Do NOT assume column names — discover them.

## Scope

**In scope:**

1. **Repoint config.** Update GCP Secret Manager in `smartcity-os-prod`: `POWERBI_CIP_DATASET_ID` -> `f86e76e6-26f6-43b2-86e6-0b3aaec72243`; `POWERBI_REPORT_ID` -> `8a4009f6-e5c9-4ccf-b1e2-66409158538a`. Update the hardcoded fallback default in `powerbi.ts` (line ~182, `CIP_DATASET_ID = process.env.POWERBI_CIP_DATASET_ID || "8ab767a6-..."`) to the new id so the fallback is not the dead dataset.
2. **Discover the new schema FIRST.** Run `discoverCIPSchema()` (already in the file) against the new dataset id and capture the real table, column, and measure names verbatim. The new model is Dataverse `msdyn_project` (projects) and almost certainly a task/stage entity (`msdyn_projecttask` or a project-bucket/stage table). Paste the discovered INFO.TABLES + INFO.COLUMNS output in your close note; that is the mapping source of truth.
3. **Remap `getCIPProjectData()`** from `EVALUATE PowerBIDashboardTasks` and the `PowerBIDashboardTasks[...]` row accessors to the discovered Dataverse entity and columns. Preserve the existing output contract exactly: the `CIPTask` and `CIPProject` interfaces and the returned shape must not change, so the frontend and any consumers keep working. Map the new fields onto: `projectName`, `task` (phase/stage), `phaseStart`, `phaseEnd`, `completion` (0..1), `taskDuration`. If the new model expresses status/completion differently (e.g. a Dataverse status reason or percent-complete field) than the old five-phase task rows (Initiation, Planning, Notice and Award, Execution, Reconciliation), adapt the phase-ordering and status-derivation logic (lines ~448-496) to the real shape; do not force the old phase names if the data does not carry them. Keep `discoverCompletionMeasures()` working if a completion measure exists, else fall back to a discovered percent-complete column.
4. **Verify against the 28 live projects.** Confirm `getCIPProjectData()` returns the live projects (Agnes Street Extension and WWTP #4 must appear) with sane completion/status. Paste the project count and two sample projects in the close note.

**Out of scope:**

- DATABASE_URL / WS-1 migration data path (untouched).
- The embed-token path for the visual report (`getEmbedToken` / `getEmbedTokenForReport`) beyond the report-id repoint — the report still embeds; do not rewrite embedding.
- Any other 31a item (Verkada, ESRI, Prophecy, transparency key).
- Frontend changes beyond what a changed CIP data shape strictly forces (and if it forces any, flag it, do not silently restyle).

## Acceptance criteria

- Secrets repointed (verbatim `gcloud secrets versions access` length-echo or describe, not the value).
- `discoverCIPSchema()` output for the new dataset pasted verbatim (tables + columns).
- `getCIPProjectData()` returns the 28 live projects from the Dataverse source; Agnes Street Extension and WWTP #4 present with completion/status (verbatim sample).
- `CIPTask` / `CIPProject` output contract unchanged; typecheck green; vitest green.
- The dead-dataset fallback default removed from `powerbi.ts`.
- All outputs carry source, value, and timestamp (quality-gate rule).
- PR held for operator merge (do not merge); branch + SHA reported.
- Verbatim verification artifacts (HR-8): the schema-discovery output, the live project sample, typecheck + test results.

## Stakeholder note to relay to Jaime (operator sends)

Confirmed: the SmartCity OS service principal has Workspace Admin and we pull 28 live CIP projects from the new Dynamics dataset. We are repointing our config and updating the data mapping to the new Dataverse schema; CIP tiles will reflect the live database after deploy.

## Reporting

At break-point, write to `P:\doc_repo\_inbox\` as `2026-06-08_smartcity-os_cc-agent-M_bastrop_cip_powerbi_repoint.md`. Include atom refs touched, model used (if not default Grok), PR URL plus branch SHA, the schema-discovery output, the live-project verification sample, and blockers verbatim.
