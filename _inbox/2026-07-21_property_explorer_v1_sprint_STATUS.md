---
id: 2026-07-21_property_explorer_v1_sprint_STATUS
title: Property Explorer v1 sprint — live STATUS tracker
status: active
date: 2026-07-21
applies_to: hauska-map (property-explorer), legacy-design-tools
related: [2026-07-21_property_explorer_v1_sprint_WDLL, 75j_property_explorer_destination_ledger]
owner: nick
---

# Property Explorer v1 — STATUS

WDLL: `_inbox/2026-07-21_property_explorer_v1_sprint_WDLL.md` — **APPROVED 2026-07-21**
Deploy URL: https://property-explorer-m38nta44a-empressaioemail-techs-projects.vercel.app/

## Wave status

| Wave | Focus | Status | Notes |
|---|---|---|---|
| 0 | Live honesty + FEMA | MET | Items 1–3 probe-met; item 4 operator visual QA PASS 2026-07-21 |
| 1 | Moat (setbacks, San Marcos, Overpass) | PARTIAL | Setbacks 51–53 met (tables). Overpass WDLL 8/9 re-met on tip `cortex-api-00428-fax` (LDT #350). Envelope confidence still open for atomization track Phase 1. |
| 2 | Auth OIDC + entitlement | PARTIAL (code live) | LDT #335 + hauska-map #43 MERGED. Cortex `00406-dim`@100% — `/api/auth/session-exchange` live (401 without bearer). Live Google/MS sign-in still blocked on OIDC secrets + Vercel `PE_SESSION_EXCHANGE_SECRET` |
| 3 | Paywalled R1–R10 + manifest | IN PROGRESS | R1/R7/R10 scaffolds in #335 + #43; spine report_run wiring pending |
| 4 | GTM + CRM | MERGED (partial live) | LDT #334 + hauska-map #42 merged. Cortex tip includes GTM routes on `00406-dim`@100%. Live CRM/checkout still need Pipedrive/Stripe mounts confirmed. |
| 5 | Personas / PWA / extension / ICC | MERGED | hauska-map #42 → `fd6f105` (2026-07-22) after #334; Vercel PE redeploy still owed unless auto-preview already refreshed. |
| 6 | Atoms + MCP | DEFERRED (on-card) | After UI functioning |

## WDLL item grades (running)

| Item | Grade | Evidence |
|---|---|---|
| 1 | met (probe) | Live URL HTTP 200; `<title>Empressa - Explore your property</title>`; cold-open Google + Just browse; browser snapshot 2026-07-21 |
| 2 | met (probe) | `48055:10068` → `source:"baked-snapshot"`, landUse A1, no owner field; `48491:R062578` zoning SF2 + honest envelope; `48209:156346` landUse C1 |
| 3 | met (probe) | Caldwell `tier2.flood` zone X from fema-nfhl vintage 2026-07-21T16:51:50Z (verified); Williamson+Hays sample nodes `flood:null` (honest not-yet / absent) |
| 4 | met | Operator visual QA PASS 2026-07-21 on deploy URL |
| 5 | partial | Populated LIVE: Cedar Park (7), Pflugerville (3), San Marcos (2). Honest-empty batch-3 cited. PF LIVE: `48453:907247` → `ok`/`pflugerville_tx` (DB 22,009 keyed / 6,449 ok). Conditional cities still honest-empty |
| 6 | met | LDT #324 `8c88434` (was CA GIS); live stamp 18,900/117,427 Hays matches; tier1 re-bake; live facet `48209:*` shows `SF-6` |
| 7 | met | LDT #323 merged `cdc07a46` — OVERPASS_URL env + test; documented in deploy runbook + overpass spec |
| 8 | met (re-grade 2026-07-23) | Durable remount: LDT #350 / `ab34b330` bakes `OVERPASS_URL=http://10.128.0.2:8080/api/interpreter` + VPC `cortex-connector` / `private-ranges-only` into `cloud-run-deploy.yml` (not a manual gcloud set). Serving tip `cortex-api-00428-fax` @ 100%: revision env has `OVERPASS_URL` present. VM `overpass-tx-01` RUNNING at `10.128.0.2`. |
| 9 | met (re-grade 2026-07-23) | Fresh Caldwell tier2 `--enable-roads` rebake after #350 tip: live `node:48055:11386` (`node-facets:tier2`, bakedAt `2026-07-23T17:32:42.198Z`) → `edgeSignal:road` / `roadSignalUsed:true` / `candidateCount:3` / `source:osm-overpass`. Grade keyed to this live proof, not deploy green alone. |
| 12 | partial | hauska-map #43 merged with Google and Microsoft Authorization Code + PKCE BFF and no Clerk; live sign-in remains blocked on operator-held provider credentials and redirect registration |
| 13 | partial | #335 session exchange and #43 browse/deep split merged. Cortex canary and production health probes passed; Vercel deploy plus signed-session probe remain pending |
| 14 | partial | #335 Test passed with anonymous 401, free 402, and paid fixture pass-through. Canary R1 request returned `401 authentication_required`; paid live probe is held on OIDC configuration |
| 15 | partial | #335 Test passed with tenant plus owner scoped saved-property isolation. Live user-A/user-B proof remains held on OIDC configuration |
| 16 | met | Hold list filed below and #43 renders `sign-in-not-configured` while preserving anonymous browse. No fake OAuth success path |
| 17 | partial | R1 is behind the paid deep gate but returns an explicit `report_not_ready` 503 until the spine serves a cited report run |
| 18 | partial | The report-owned `layer-manifest-v1` seam exists, but no live R2 constraints/buildable report or populated manifest-backed overlay has been observed |
| 19 | partial | R3–R6 have no observed live, manifest-shaped spine endpoint on this consumer surface. They remain unavailable rather than synthetic |
| 20 | partial | R7/R10 paid endpoints return explicit `spine_degraded` responses, never geometry |
| 21 | partial | #335 serves the report-owned manifest contract seam and #43 consumes the deep boundary; no populated live manifest observed |
| 22 | deferred-held | No entitled R1/R2 export or share artifact is available before a live report result exists; anonymous access remains denied at the deep gate |

## Wave 2–3 PRs (2026-07-21)

| Repo | PR | WDLL items | Status |
|---|---|---|---|
| legacy-design-tools | [#335](https://github.com/empressaioemail-tech/legacy-design-tools/pull/335) | 13, 14, 15 | **MERGED** `29d8f470` (Test+Typecheck+Rubric green). Migration repair [#337](https://github.com/empressaioemail-tech/legacy-design-tools/pull/337) merged `23aafaed` after `0061` found an already-present identity table |
| hauska-map | [#43](https://github.com/empressaioemail-tech/hauska-map/pull/43) | 12–22 | **MERGED** `cbe89483`; Property Explorer CI Test + Typecheck green |

### Wave 2 deploy evidence

- Cortex canary workflow `29882351930` succeeded. Migration workflow `29882444374` applied `0060` but stopped at pre-existing `pe_user_identities`; resumable repair #337 passed Test + Typecheck and migration retry `29882921593` succeeded.
- Canary `https://canary---cortex-api-tds7av26va-uc.a.run.app` returned health `200` and anonymous R1 request `401 {"error":"authentication_required"}`.
- Traffic promotion workflow `29882987120` succeeded. Vercel production deployment and OAuth completion remain deferred for the listed secrets.

## Wave 4–5 grades (2026-07-21 agent run)

| Item | Grade | Evidence |
|---|---|---|
| 24 | met | `76h_property_explorer_gtm.md` / `_inbox/2026-07-21_property_explorer_gtm.md`; linked from 75j rows 14–15 |
| 25 | partial | Merged LDT #334 `0671cbd` — PE GTM/Pipedrive routes on main. Image built (deploy run 29882027954); **0% canary skipped** on push — canary deploy still owed. Live CRM needs `PIPEDRIVE_API_TOKEN` on revision |
| 26 | partial | Merged hauska-map #42 `fd6f105` BFF + LDT checkout seam. Simulated until Stripe mounted on canary cortex |
| 27 | met | Cold-open copy fixed; rent-heat layer excluded; Comal gap footnote; meta description honest (#42) |
| 28 | met | Inspect card persona toggle + shared-facts headline (homeowner/investor/architect) (#42) |
| 29 | partial | manifest + theme-color + viewport + GPS; Vercel redeploy owed; Lighthouse/install = operator QA |
| 30 | partial | `scripts/extension-handoff-smoke.mjs` verifies `?parcelNodeId=` URL contract; extension→account wiring still blocked |
| 31 | deferred-held | ICC hold note on inspect card; live citation blocked on operator ICC creds |

### Wave 4–5 merge record (2026-07-22)

| Repo | PR | Merge SHA | CI | Deploy |
|---|---|---|---|---|
| legacy-design-tools | [#334](https://github.com/empressaioemail-tech/legacy-design-tools/pull/334) | `0671cbd6ce93290fec01716a199432b267f6bb78` | Test+Typecheck green (Test re-run after flaky envelope timeout) | Push built image; then `workflow_dispatch` deploy-canary → revision `cortex-api-00404-gon` @ 0% / tag `canary` — https://canary---cortex-api-tds7av26va-uc.a.run.app (tip at deploy: `29d8f47`, includes #334+#335). Prod traffic still `00399-cez`. |
| hauska-map | [#42](https://github.com/empressaioemail-tech/hauska-map/pull/42) | `fd6f1058a99834dd5cc32d854bb3e3722351968a` | Test+Typecheck green | Vercel PE redeploy owed (no auto Cloud Run path) |

## Secrets / infra hold list

**Wave 1 Overpass (WDLL 8–9):** MET (re-grade 2026-07-23 after env-revert regression). Tip `cortex-api-00428-fax`; LDT #350 / `ab34b330`; Caldwell `node:48055:11386` fresh `edgeSignal:road`.

**Wave 4 GTM/CRM (WDLL 25–26):**
- `PIPEDRIVE_API_TOKEN` on cortex Cloud Run (exists in GCP SM; verify mounted on deployed revision)
- Stripe bundle on cortex deploy (`STRIPE_SECRET_KEY`, price IDs, webhook secret) for live checkout
- Optional `PIPEDRIVE_PE_UPGRADE_STAGE_ID` for deal stage mapping

**Wave 4 GTM/CRM (WDLL 25–26) — code path:** hauska-map BFF `api/pe-gtm.ts` + `api/pe-billing.ts`; cortex `gtm/property-explorer/*` + `property-explorer/billing/*` (simulated when secrets absent).

**Wave 5 ICC (WDLL 31):** ICC Code Connect credentials — operator-owned; infra built, ingest unfed.

**Wave 2 OIDC (WDLL 12–16):**
- `GOOGLE_OIDC_CLIENT_ID` / `GOOGLE_OIDC_CLIENT_SECRET`
- `MICROSOFT_OIDC_CLIENT_ID` / `MICROSOFT_OIDC_CLIENT_SECRET` / `MICROSOFT_OIDC_TENANT_ID` (`common` unless restricted)
- Production redirect URI(s): `{deploy}/api/auth/google/callback`, `{deploy}/api/auth/microsoft/callback`
- `OIDC_STATE_SECRET` (PKCE/state cookie encryption)
- `PE_SESSION_EXCHANGE_SECRET` on **both** Vercel BFF and cortex-api (shared; do not expose `SESSION_SECRET` to browser)
- Run LDT migration `0061_property_explorer_auth.sql` on deployment DB before session-exchange goes live
- Cortex `00406-dim`@100% (Wave 2 tip); migration 0061 tracked; `PE_SESSION_EXCHANGE_SECRET` on Cloud Run
- Vercel PE redeployed 2026-07-22 → https://property-explorer-xi.vercel.app (alias). Still need OIDC + `PE_SESSION_EXCHANGE_SECRET` on Vercel for live sign-in
- Vercel env mounts; keep `CORTEX_SERVICE_API_KEY` scoped to anonymous browse only (`/api/spine/cortex` facet/envelope/map-data allowlist)
- A cited, manifest-shaped spine response for R1/R2 before enabling paid research or an export/share artifact

## Wave 2 auth scout (2026-07-21)

Implemented in #335 + #43. Google/Microsoft PKCE BFF on Vercel; Cortex session-exchange + PE entitlement schema; browse/deep proxy split.

## Resume queue

1. Merge #335 after CI green + canary cortex; run migration 0061
2. Merge #43; deploy property-explorer preview
3. Operator: OIDC client registration + env mount (hold list above) for live sign-in proof (WDLL 12)
4. Finish #333 merge + Travis rebake; live-probe PF envelopes
5. Overpass Option A infra (WDLL 8) — operator GCP later
6. Wire spine report_run for R1 live brief (WDLL 17) once auth path proven

## Operator visual QA owed

- [x] Wave 0 (item 4) — PASS 2026-07-21
- [x] Wave 3 (item 23) — **BYPASSED by operator 2026-07-21** (autonomous close authorized; secrets deferred to end)

## Autonomous run (operator stepped away 2026-07-21)

Operator authorized: get as far as possible; bypass remaining visual QA; hold secrets until last. Planner merges/deploys autonomously.

## Coverage equalization + R1 spine push (2026-07-22)

Operator: max map completeness, same treatment all corpus counties, then gold QA; include R1 spine wire; hold Pipedrive/Stripe; atoms later.

Amendment: `_inbox/2026-07-22_pe_coverage_equalization_and_spine_WDLL_amendment.md` (items 42–50)  
Gold list: `_inbox/2026-07-22_pe_gold_parcel_qa_list.md`

| Item | Focus | Status |
|---|---|---|
| 42 | Dev paid entitlement bypass | MET — allowlist + DB `paid` for `empressaioemail@gmail.com`; live Research this works |
| 43 | Bastrop P-5 district mapping | MET — #338 + #340/#341; live `48021:33512`/`47728` → declined `setback-table-pending` (no invented Public/Institutional setbacks) |
| 44–47 | Setbacks + roads + zoning-attr | 44 inventory `docs/property-explorer-setback-coverage-central-tx.md` (populated vs honest-empty). 46 PARTIAL — roads sparse (see `P:\tmp\pe-roads-truth.md`); deepen IN FLIGHT. 47: land-use lives at `baseFacts.landUse` (not missing bake) |
| 48–49 | R1 facet-intel + layer-manifest | MET for facet-intel path; full AI engagement brief still follow-up |
| 50 | Gold list filed | MET — operator QA deferred until map-truth done |

**Map truth pass (2026-07-22 night):** P-5 honesty + roads deepen baseline.

## No honest-empty setback push (2026-07-23)

Operator: keep going until done; **no honest-empty** — make tables, rebake, track; QA only when planner done.  
Amendment: `_inbox/2026-07-23_pe_no_honest_empty_setbacks_WDLL_amendment.md` (items 51–54)

| Item | Grade | Evidence |
|---|---|---|
| 51 | met | Central-TX empty tables populated (#342–#345, #348); inventory `docs/property-explorer-setback-coverage-central-tx.md` |
| 52 | met | Bastrop B3 P-1…P-5 via #343; live P-5 ok (not Public/Institutional invent) |
| 53 | met | Rebakes EXIT 0: 48021/48055/48491/48453/48209; Bexar full ~703k/709k; deepen+mono verified |
| 54 | met (running) | Progress `P:\tmp\pe-setback-populate-progress.md`; this STATUS section |

| jurisdictionKey / fix | Status | Evidence |
|---|---|---|
| bastrop-city-tx | LIVE | #343 B3 P-1…P-5 |
| austin / liberty-hill / taylor | LIVE | #342 |
| lockhart-tx | LIVE deepened | #344/#345 RLD/RMD/RHD; hard holds PDD/CCB/IH/AO/PI/MH decline |
| san-antonio-tx | LIVE deepened | #344/#345 C/O/I; Bexar full rebake EXIT 0 |
| cedar-park / pflugerville | LIVE deepened | #344/#345 |
| san-marcos-tx | LIVE deepened | #348 legacy MU/CC/GC/P/NC/OP; Hays rebake — MU ~4.5k matched |
| kyle-tx | LIVE deepened | #348 R-1-A/RS/M-2; #349 omit bare R-1 (R-1-T invent); Hays re-rebake R-1-T → pending |
| Unmatched invent | LIVE | #346 decline + #347 mono force-replace |
| Cortex tip | LIVE | `cortex-api-00428-fax` @ 100% (LDT #350 / `ab34b330` — Overpass durable + absent-zoning honesty) |

**Honest-empty jurisdiction tables:** CLEAR for Central-TX inventory.  
**Remaining hard holds:** permanent-decline for now (Lockhart PDD/CCB/IH/AO/PI/MH; SA OCL/UZROW/PUD/FR; Cedar Park UR/PA/PD; Taylor EC/CS; Bastrop PDD/P-CS; Austin overlays; SM CD-*/MF-*/TH/FD; Kyle R-1-T; typo situs; Comal forbidden). **Stop hard-hold deepen** until atomization (conditional rule-atoms).  
**Bars (planning feedback 2026-07-23):** table population (51–53) = met. Safe honesty pickups (a)(b) = done on tip / live nodes (see WDLL 8/9 re-grade + Bexar proof below). Remaining envelope confidence = atomization track Phase 1 (spine), not cortex invent.  
**Decision:** `_decisions/2026-07-23_pe_envelope_atom_spine_and_post_map_truth_pickups.md` — atom family in hauska-engine; pickups absorbed into that track's Phase 1.

Progress: `P:\tmp\pe-setback-populate-progress.md`

---

## CORRECTION NOTE (2026-07-23) — superseded by re-grade below

Earlier same-day note: WDLL 8/9 had **regressed** on tip `cortex-api-00422-diy` (`OVERPASS_URL` absent — env-revert trap after manual mount on `00406-dim`). That correction stands as history; it is no longer the live grade.

## WDLL 8/9 RE-GRADE (2026-07-23) — met, keyed to live proof

Operator-accepted. Grade carries its proof inline (not deploy-green alone).

| Item | Grade | Proof |
|---|---|---|
| 8 | **met** | Serving revision **`cortex-api-00428-fax` @ 100%**: env has `OVERPASS_URL=http://10.128.0.2:8080/api/interpreter`; VPC `cortex-connector` / `private-ranges-only`. Durable bake in workflow via **LDT #350** / merge SHA **`ab34b330`** (not a manual `gcloud --set-env-vars`). |
| 9 | **met** | Fresh Caldwell tier2 `--enable-roads` after tip remount: **`node:48055:11386`** → `edgeSignal:road` / `roadSignalUsed:true` / `source:osm-overpass` (bakedAt `2026-07-23T17:32:42.198Z`). |

**Companion honesty pickup (absorbed into atomization Phase 1, not a WDLL 8/9 item):** Bexar **`node:48029:410119`** prior stamped `I-2 San Antonio heavy industrial district` with null zoning; after #350 → `status:declined` / `declineReason:no-zoning-stamp` / `district:null` / conservative estimate setbacks+geojson retained.
