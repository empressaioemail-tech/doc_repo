---
id: 2026-08-16_blueprint_plan_review
title: Blueprint — plan-review container (complete functions + ICC activity portal)
status: draft
last_updated: 2026-08-16
applies_to: portfolio
owner: nick
related: [2026-08-16_icc_demo_program_WDLL, 2026-08-16_blueprint_mcp_icc, 2026-08-16_blueprint_icc_compliance, 48_cortex_reporting_plan_review_spec, 80_adrs/adr_023_cortex_reporting_repo_designation]
---

# Blueprint: plan-review container

Pickup-executable. Housing is Smart Files-shaped. Functions are spec 48 complete. Visual is basic (white background, no branding). Do not invent names. Do not subtree LDT.

Program WDLL items 1-13, 21. Start only when WDLL approved and decision active.

## Locked names

| Thing | Value | Refuse if |
|---|---|---|
| GitHub repo | `empressaioemail-tech/plan-review` (PUBLIC, operator creates) | any other name; subtree of LDT |
| Local path | `P:\plan-review` | dirty LDT `feat/s1-instrument-hardening` |
| Neon | project name `plan-review`; DSN at `%USERPROFILE%\.empressa\plan-review.database_url` | cortex/files/atoms Neons; DSN in git or Vercel |
| GCP | `plan-review-505715` (display name plan-review). Not `hauska-prod-497015`, not `legacy-design-tools-prod`, not `smart-files-505619`, not `smartcity-os-prod` | deploy into any of those four |
| Cloud Run | service `plan-review`, us-east1 | piggyback hauska-prod |
| Vercel | project `plan-review-app` | `property-explorer`, `cmdcenter`, `smart-files-app` |
| Secrets | `PLAN_REVIEW_DATABASE_URL`, `PLAN_REVIEW_SERVICE_TOKEN` | plaintext DSN |
| Vercel env | `PLAN_REVIEW_BACKEND_URL`, `PLAN_REVIEW_API_KEY`, `SMART_FILES_BACKEND_URL`, `SMART_FILES_API_KEY` | any `*DATABASE*` |
| Probe | `GET /` 200 `{ok:true,service:plan-review}` | claiming GFE `/healthz` 404 is a process fail |

Operator creates GitHub + Neon + GCP. Planner scaffolds after they exist.

## What lives where

Plan-review Neon: engagements, findings, canned findings, session/key hashes, letter artifacts, activity-read cache (optional; source of truth is inbound ledger). Not file bytes. Not ICC atoms. Not Texas parcel atoms.

Smart Files: **all** engagement documents, sheets, and dataroom atoms. Tenant `icc-demo`. Plan review is the first product consumer. PE isolation mount is a probe only.

hauska_mcp: code-section atoms, parcel-nodes, adjudication atoms after engine ingest, inbound meter ledger.

cortex-prod: zero new plan-review writes after remount. LDT `artifacts/plan-review` is not the serving UI. cortex-api `/api/plan-review` becomes a proxy to this Cloud Run.

## Function package (complete, not a stub)

Elevate the live cortex-api BFF (`planReviewBff.ts` + `@empressaio/cortex-client`). Pages may be simpler than LDT chrome. Every G-60 function must be true. Do not replace working routes with empty 501s. Calibration is out of this container. After Cloud Run is live, cortex remounts `/api/plan-review` as a proxy.

| Function | Must be true | Fixture |
|---|---|---|
| F1 queue | Stages Submitted, In Review, Approved, Approved with Conditions, Denied. Counts correct. Click loads F2. | Two engagements in the walk |
| F2 intake | Parcel + project type + optional scope text. Jurisdiction from parcel-node. Corpus via MCP. **Zero Cotality.** Sheets optional via Smart Files, not required to start. | A: `48021:28286` `new-single-family`. B: `48021:27303` `new-single-family` |
| F3 matrix | Applicable sections list. >=1 IBC determination from atom-chain with atom ID + confidence object. Uncertain/Unchecked prominent. Canonical citation. No verbatim body. | IBC2018P6 section pinned into the walk after live query |
| F4 adjudication | Accept or override with reason. Engine ingest. MCP read-back. accessPolicy platform-internal. Stage moves. | `icc-demo/reviewer` |
| F5 library | Finding from A retrievable by section on B. One canned template auto-populates. | Two live engagements, not mocks |
| F6 code library | IBC 2018 by chapter/section. Bastrop UDC by section. IPMC 2018 typed absence (G-41) with basis, not a populated fake. | IBC live; IPMC empty honest |
| F7 briefing | Show reasoning = atom chain the graph returned. Confidence object. Timestamp. No fabricated steps. | Same determination as F3 |
| E6 map | F2: center on parcel + boundary. F3: overlay update, no navigation. Import from hauska-map in a **clean worktree**. | `48021:28286` then B |
| Decision letter | Intake-to-letter on A. Cites atoms. No ICC body. Served by this service. | GET `/api/plan-review/engagements/:id/letter` |
| Files room | Smart Files folder on A. | `folder:tenant:icc-demo:<slug>` |
| ICC portal | `/icc/activity` | see HTTP below |

Still out (spec 48 already): applicant portal, Bluebeam, visual design, SmartCity session, G-52 MyGov consumer pass.

Display (75n): `2018 International Building Code Section <n>`, heading, analysis, optional subsection, ICC deep-link. Never full verbatim body.

## HTTP contract

Bearer on every `/api/*`. Anon `/api/*` = 401. `GET /` anonymous 200.

| Method | Path | Success |
|---|---|---|
| GET | `/` | `{ok:true,service:plan-review}` |
| GET | `/api/plan-review/queue` | buckets + counts |
| POST | `/api/plan-review/intake` | `{parcelNodeId, projectType, orgId, userId, scope?}` 201 engagement, `cotalityCalls:0` |
| GET | `/api/plan-review/engagements/:id` | engagement + folder + stage |
| GET | `/api/plan-review/engagements/:id/matrix` | sections[] with determination, atomId, confidence, citation, `bodyVerbatim:false` |
| POST | `/api/plan-review/engagements/:id/override` | `{orgId,userId,sectionAtomId,determination,reason}` 201 `{adjudicationAtomDid}` |
| GET | `/api/plan-review/findings?sectionId=` | library hits across engagements |
| GET | `/api/plan-review/canned` | templates[] |
| GET | `/api/plan-review/code?book=&chapter=&section=` | citation + analysis or typed absence |
| GET | `/api/plan-review/engagements/:id/briefing?sectionAtomId=` | atom chain as returned |
| GET | `/api/plan-review/engagements/:id/letter` | letter HTML/PDF |
| POST | `/api/plan-review/engagements/:id/files-room` | creates Smart Files folder |
| GET | `/api/icc/activity?actorDid=did:hauska:actor:org:icc` | activity rows (ledger) |

Personas: `icc-demo/reviewer` (F1-F7 + files writes), `icc-demo/observer` (read + `/icc/activity`). Add both to Smart Files `QA_PERSONAS`. Unknown persona 400.

## Vercel routes

`/gate`, `/queue`, `/engagements/:id` (intake, matrix, decide, files, map, briefing, letter), `/library`, `/code`, `/icc/activity`.

Unauthed ICC content 401. Footer on `/icc/activity`: "PoC. IPMC 2018 not ingested (G-41). Not customer-facing. Purge: sourceAdapter=icc-code-connect, jurisdictionTenant=icc-model-code."

Do not enable PE `VITE_ICC_CITATIONS_ENABLED`. Do not put this portal on Command Center.

## F2 resolve

MCP `get_property_atom_chain` for the parcel. Fail intake if trace contains `api.corelogic.com`, `cotality`, or `get_property_detail`.

## Adjudication write

Engine ingest, spec 48 shape, `provenance.source=plan-review`. Then MCP `get_atom`. Announce if the atoms lease is live; do not start a second `--apply`.

## E6

Clean hauska-map worktree or published component. Plan-review Vercel project is `plan-review-app`. Dirty `P:\hauska-map` stays linked to property-explorer and is never this deploy vehicle.

## Forbidden

Dirty LDT as the remount PR vehicle. Dirty hauska-map as deploy. `P:\smartcity-os`. DSN on Vercel. ICC verbatim. Public-paid. Second MCP. Cortex `/api/plan-review` 404 (that is the files pattern, wrong here). G-58b DROP. L26 steal. One-engagement stub graded as F1-F7. Rewriting F1-F7 from empty stubs while the BFF already exists.

## Close

`_inbox/2026-08-16_plan_review_container_close.json`. Cite WDLL 1-13, 21. Record both engagement ids, letter URL, library probe, map proof, portal URL, Cotality grep = 0.
