---
id: smartcity_tracker
title: "SmartCity tracker (generated)"
status: generated
kind: tracker
owner: nick
programs: [OPS-17, OPS-25]
---

# SmartCity tracker

**Generated, do not edit.** Regenerate with `node scripts/govtech/smartcity-tracker.mjs`. Read from doc_repo `9ad6a657`: 119 OPS-17 rows, 35 OPS-25 rows, and every `_inbox/*_close.json`. The milestones are the roadmap's, in `_inbox/2026-09-15_roadmap_reconciliation.md`.

**Coverage:** 143 of 982 close records name no plan row, so no row can be checked against them. They are counted, not guessed.

**Every tracked row agrees with its own close.** A close that lands without re-grading its row fails this run.

| Milestone | Rows | Done | Open or blocked |
|---|---|---|---|
| M1 Staff on v2: the soft launch | 6 | 2 | 4 |
| M2 The next deliverable: Finance, hotel occupancy tax, RBAC, city management board | 6 | 4 | 2 |
| M3 Lens builds on Bastrop live data | 10 | 5 | 5 |
| M4 DigitalOcean migration complete | 7 | 4 | 3 |
| M5 Design complete, and the controls that keep it honest | 6 | 5 | 1 |

## M1. Staff on v2: the soft launch

| Row | What | Status | Close on file |
|---|---|---|---|
| D-12 | PUT CUSTOMER TRAFFIC ON THE DASHBOARDS DO APP, AND MAKE MAIN THE THING IT BUILDS. | closed, partly | closed-partial |
| G-134 | wire WorkOS and put real Bastrop staff on v2 — the critical path for the phase-1 soft launch. | closed, partly | closed-partial |
| G-143 | People and access design — the same surface as the WorkOS build, so design and build land togeth | designed, awaiting ratification | — |
| G-127 | RBAC by department. | blocked | blocked |
| G-144 | the plan-review role-gate deferral has no mechanism, and this row IS the mechanism. | open | — |
| G-158 | WRITE DOWN WHO OPENED A RECORD — the access-log write path the audit trail cannot exist without. | open | — |

## M2. The next deliverable: Finance, hotel occupancy tax, RBAC, city management board

| Row | What | Status | Close on file |
|---|---|---|---|
| G-156 | BUILD THE FINANCE LENS, once the operator rules whether Finance belongs in the Bastrop package a | closed, partly | CLOSED-PARTIAL |
| G-159 | THE FINANCE BRIDGE — put Bastrop's live finance data where v2 can read it. | closed, partly | closed-partial |
| G-162 | v1 FINANCE HONESTY: THREE DEFECTS G-159 FOUND IN THE PRODUCTION FINANCE CODE AND DELIBERATELY DI | closed, partly | closed-partial |
| G-138 | the filings design carries two citations to external authorities that trace to nothing, and it i | closed | — |
| G-137 | the Localgov Filings feed — the hotel occupancy tax integration the customer prioritised and wil | open | — |
| G-157 | THE CITY MANAGEMENT BOARD — v2 must not remove what the city manager works from in v1. | open | — |

## M3. Lens builds on Bastrop live data

| Row | What | Status | Close on file |
|---|---|---|---|
| G-135 | distribute the bastrop_tx tenant key — it exists, it works, and no lane can reach it. | closed, partly | closed-partial, closed-partial |
| G-161 | NEVER DEFAULT A CITY, EVERYWHERE, NOT ONLY ON THE FINANCE ROUTE. | landed, not graded | — |
| G-154 | BUILD THE DEVELOPMENT SERVICES LENS EXTENSION, which is the delta the design grew AFTER its buil | closed, partly | The four corrections are implemented, merged and proven on the live bastrop_tx surface on d12-main-uat - three of the four by direct measurement, and the fourth NAMED AS UNMEASURED because the live feed draws no workload ranking for it to be measured on. Getting there exposed four defects, three of them in the proving tools rather than the product; all three are fixed and each fix is proven in both directions. |
| G-149 | BUILD THE RATIFIED FLOOD STUDY DESIGN into the Development services tab. | open | — |
| G-153 | BUILD THE FLEET AND POLICE LENSES, and fix the three live-mapper defects they both run on. | closed, partly | closed |
| G-152 | BUILD THE PUBLIC WORKS AND FIRE AND EMS LENSES. | landed, not graded | — |
| G-151 | BUILD THE PARKS LENS, the one lens that does not exist, drawn as not existing. | open | — |
| G-155 | BUILD THE SMART FILES DESIGN, in its own repo and outside the DigitalOcean gate. | closed | closed |
| G-150 | BUILD THE RATIFIED REASONER PATH, the plan review design a city is shown. | closed | closed |
| G-165 | THE NOAA ATLAS 14 PARSER NEVER MATCHES, SO EVERY NO-PARAMETER STUDY IN EVERY COUNTY SILENTLY USE | open | — |

## M4. DigitalOcean migration complete

| Row | What | Status | Close on file |
|---|---|---|---|
| D-5 | PROMOTED, FRESH-BUILD MIGRATION OF THE WHOLE SMARTCITY PRODUCT LINE (smartcity-api, smartcity-sc | closed, partly | closed-partial |
| D-9 | CONFIGURE THE TWO DO APPS AND COMPLETE THE smartcity-api CUTOVER. | closed | closed |
| D-10 | SWITCH THE SCRAPER'S TRIGGER FROM OIDC TO A SHARED SECRET. | closed, partly | closed-partial |
| D-11 | FLIP hauska-mcp-server'S DASHBOARDS_BACKEND_URL. | closed | closed |
| D-13 | THE DASHBOARDS STILL READ EVERY BASTROP FEED FROM THE GCP v1. REPOINT THEM AT walrus-app, OR DEC | landed, not graded | — |
| D-14 | walrus-app BUILDS FROM A SIDE BRANCH, SO NOTHING MERGED TO v1 main CAN REACH smartcityos.io. | landed, not graded | — |
| G-163 | TWO PLATFORM ROUTES FAIL OPAQUELY ON walrus-app, WHERE THE GCP COPY STATED THE REASON. | open | — |

## M5. Design complete, and the controls that keep it honest

| Row | What | Status | Close on file |
|---|---|---|---|
| G-146 | FINISH THE DESIGN WORK — the completion gate, and the FIRST card. | open | — |
| G-142 | Citizen lens design. | closed | closed |
| G-147 | the three designed-nowhere surfaces that had no row at all. | closed, partly | closed-partial |
| G-148 | five designs are past DRAFT and carry no adversarial read, and two of them are already dispatche | closed | closed |
| G-160 | A DEPLOY IS NOT DONE UNTIL THE CONSOLE AND THE API SERVE THE SAME COMMIT. | closed, partly | closed-partial |
| G-164 | REPAIR THE 11 FINDINGS G-148 DISCLOSED, WHICH NO ROW OWNED. | closed, partly | closed-partial |
