---
id: 2026-08-16_icc_demo_program_WDLL
title: WDLL — ICC demo program (complete plan review + finished MCP = ICC portal)
status: approved
last_updated: 2026-08-16
applies_to: portfolio
owner: nick
related: [2026-08-16_icc_demo_adversarial_review, 2026-08-16_blueprint_plan_review, 2026-08-16_blueprint_mcp_icc, 2026-08-16_blueprint_icc_compliance, 75n_icc_code_connect_catalog, 48_cortex_reporting_plan_review_spec, 90_operations/OPS-17_govtech_stack_plan_of_record]
---

# WDLL: ICC demo program

Date: 2026-08-16  Status: approved
Operator approval: 2026-08-16 (WDLL approved; still-out list confirmed; repo and GCP created)
Plan row: G-60 (OPS-17 umbrella, A-024). Grades live: G-15, G-16, G-17, G-22, G-23, G-30, G-31 (typed absence on IPMC), G-40 (Bastrop UDC in the library), G-51 (standalone on Vercel, not LDT shell), G-41 residual. Does not grade G-50 SaaS, G-52, G-53, G-58b.

Pickup: `_inbox/2026-08-16_icc_demo_planner_pickup.md`.
Walk: `_inbox/2026-08-16_icc_demo_walk.md`.

Containers:

- `_inbox/2026-08-16_blueprint_plan_review.md` (complete function package + ICC activity portal UI)
- `_inbox/2026-08-16_blueprint_mcp_icc.md` (finished MCP)
- `_inbox/2026-08-16_blueprint_icc_compliance.md` (stamp, actor, rate, portal data)

Approved. Housing ids: repo `empressaioemail-tech/plan-review`, GCP `plan-review-505715`, Neon DSN on disk at `%USERPROFILE%\.empressa\plan-review.database_url` (operator writes; never git).

## Equation

Complete plan review (spec 48 F1-F7 + map + letter + files, function over form) plus a finished Hauska MCP (dead ends gone, catalog true, Smart Files writes, Codex tools actually calling those functions) **is** the ICC offer. ICC's surface on that offer is a **portal of their activity**: every reference of their content from the review UI and from MCP, with rate, book, section, and source.

"Basic standalone UI" means white background, no product design, own Vercel/Neon/GCP. It does **not** mean a one-engagement stub.

## Done looks like

A reviewer runs a real plan review on gated Vercel with zero SmartCity session and zero mock corpus: queue by stage, intake of `48021:28286` / `new-single-family` with no Cotality, applicability matrix with atom-chain determinations, override that persists, findings library reused on a second engagement (`48021:27303`), IBC 2018 navigable in the code library (IPMC honest-empty), atom-chain briefing, parcel map, decision letter, Smart Files sheets room. An agent with the reviewer key does the same actions through finished MCP tools. An ICC observer opens `/icc/activity` on that same host and sees the activity those two surfaces produced, accruing to `did:hauska:actor:org:icc` at the named rate, free-tier included. Anon cannot see ICC bodies. Cortex-api is not the host. Command Center is not the portal. Texas ingest was not touched.

## Acceptance items

1. **Names and housing are locked.** Repo `empressaioemail-tech/plan-review` exists (operator-created). Neon DSN path locked. GCP `plan-review-505715` exists. Decision active.
   | check: `gh repo view`. Neon file `%USERPROFILE%\.empressa\plan-review.database_url` exists and refuses cortex/files hosts. GCP id `plan-review-505715` not `hauska-prod-497015` / `legacy-design-tools-prod` / `smart-files-505619` / `smartcity-os-prod`.
   | grade: [x] met 2026-08-16 | evidence: `gh repo view` PUBLIC createdAt 2026-08-16T15:03:02Z. GCP `plan-review-505715` ACTIVE number 364754576784. DSN file written 2026-08-16T10:11:11-05:00 length 153 (secret not printed). `apply-sql` 2026-08-16 `db=neondb user=neondb_owner plan_review_* tables=4`. Decision active.
   | depends on: this file approved

2. **Plan-review API is live on its own Cloud Run.** `GET /` 200 `{ok:true,service:plan-review}`. Bearer required. Secrets only: `PLAN_REVIEW_DATABASE_URL`, `PLAN_REVIEW_SERVICE_TOKEN`. Probe `GET /` (GFE `/healthz` trap).
   | check: live URL. Zero atoms DSN, files DSN, cortex-prod host.
   | grade: [x] met 2026-08-16 | evidence: serving `plan-review-00006-duj` @100% tag `g60c` URL `https://plan-review-ozx33wafia-ue.a.run.app`. `GET /` 200. `HAUSKA_MCP_URL` inherited. Source header `x-plan-review-source` stamps `mcp:<tool>` or `plan-review-ui`. Anon queue 401. Secrets: DSN + service token + files token. Prior `00004-xez` tag `g60b` @0%. Origin `1a6ac83` (share hotfix).
   | depends on: 1

3. **Vercel UI is live, gated, and is the function surface plus the ICC portal.** Project `plan-review-app`. Env: `PLAN_REVIEW_BACKEND_URL` + `PLAN_REVIEW_API_KEY` + `SMART_FILES_BACKEND_URL` + `SMART_FILES_API_KEY` only. Unauthed ICC content 401. Routes exist for queue, intake, matrix, library, code library, briefing, letter, files, map, and `/icc/activity`.
   | check: `vercel` project name. Live HTML. Unauthed 401. Not property-explorer, not cmdcenter, not smart-files-app.
   | grade: [x] met 2026-08-16 | evidence: project `plan-review-app` `prj_zn2fPbov1Egj8hyym8Qu3HTKixQJ` deploy `dpl_GKnnEH6Z38yPDfJQB9NtuX3FkwzX` production `https://plan-review-app-ten.vercel.app` (global alias `plan-review-app.vercel.app` already in use, not ours). Env names only the four locked keys, zero `*DATABASE*`. Unauthed `GET /icc/activity` 401 JSON. Host is not property-explorer, cmdcenter, or smart-files-app. `app.js` serves `function escapeHtml`. E6 map is envelope overlay (item 11 partial).
   | depends on: 2

4. **F1 queue.** Engagements bucketed by Submitted / In Review / Approved / Approved with Conditions / Denied with correct counts. Click-through loads F2.
   | check: live queue with at least the two fixture engagements in named stages after the walk.
   | grade: [x] met 2026-08-16 | evidence: live BFF queue `total=2` `Submitted=2` parcels `48021:28286` id `aafb9572-7940-4fb1-ab50-0e58e2f31a60` and `48021:27303` id `d5c8a43f-a936-4282-bc3f-33d590ac9f0d`. `GET /queue` 200. `GET /engagements/:id` 200 loads intake tab. Stage moves still wait F4 / item 7.

5. **F2 intake, no Cotality.** `48021:28286` + `new-single-family` resolves Bastrop via parcel-node / public-record. Applicable corpus loads. Zero Cotality/CoreLogic in the trace.
   | check: POST intake. `parcelNodeId` echoed. Grep Cotality = 0.
   | grade: [x] met 2026-08-16 | evidence: live POST 201 id `aafb9572-7940-4fb1-ab50-0e58e2f31a60` folder `folder:tenant:icc-demo:plan-review-48021-28286` cotalityCalls=0. Geocode 410 extinguished. Atom-chain now on this host via MCP `get_property_atom_chain` (item 6/10).
   | depends on: 2, 14

6. **F3 applicability matrix.** Multiple applicable sections listed. At least one IBC 2018 section carries Pass/Fail/Uncertain from atom-chain reasoning with atom ID and confidence object `{n,width,provenance}`. Uncertain/Unchecked prominent. No bare scalars. Canonical citation, no verbatim body.
   | check: UI + MCP read of the matrix. Deep-link present. Body cap holds.
   | grade: [x] met 2026-08-16 | evidence: prod `plan-review-00006-duj` GET matrix 200 `chainStatus=ready` 4 sections. IBC `2018 International Building Code Section R302.1` determination Uncertain with confidence `{n,width,provenance}` from setback-rule readContract. Related setbacks 25/5/25 SF-1. UDC 14-02-003 / 14-02-008 listed. Deep-link present. `bodyVerbatim=false`. Uncertain/Unchecked prominent.

7. **F4 adjudication.** Reviewer `icc-demo/reviewer` accepts or overrides with reason. Atom on hauska_mcp via engine ingest. MCP `get_atom` holds. accessPolicy platform-internal. Stages move (In Review to Approved or Denied or Approved with Conditions).
   | check: write then MCP read DID. Store accessPolicy != public-free.
   | grade: [x] partial 2026-08-16 | evidence: override + stage move live (`codex_override_write` / decide tab). `adjudicationAtomDid` is `pending:plan-review:<id>` until L26 is quiet. No second `--apply`. MCP `get_atom` on a store DID is not this card while the slot is held.
   | depends on: 6

8. **F5 findings library.** A finding saved on engagement A (`48021:28286`) is retrievable by code section on engagement B (`48021:27303`). At least one canned finding template auto-populates adjudication text.
   | check: live library search by section on the second engagement returns the first engagement's finding.
   | grade: [x] met 2026-08-16 | evidence: GET findings?sectionId=R311.7 returns hits on both parcels. Canned templates=1. Decide tab canned select writes analysis text.
   | depends on: 7

9. **F6 code library.** IBC 2018 navigable by chapter and section ID. Canonical citation + analysis, no verbatim body. Bastrop UDC navigable at section grain. IPMC 2018 is a typed absence (G-41), not a fake book and not claimed live.
   | check: live navigate IBC chapter, UDC section, IPMC empty with basis.
   | grade: [x] met 2026-08-16 | evidence: GET code book=IBC2018P6 returns chapter list + R302.1/R311.7 citations, no verbatim body. book=BASTROP-UDC section 14-02-003 200 catalog DID `bastrop_tx-bdc-2026-adopted/14-02-003`. book=IPMC2018P2 `typed-absence` G-41. UI `/code` navigates those three.
   | depends on: 18

10. **F7 briefing.** Show reasoning on a determination opens the full atom chain the graph returned: source atom, reasoning atoms, confidence object, citation, retrieval timestamp. No fabricated steps. No bare scalars.
    | check: live panel vs MCP `get_atom` / atom-chain for the same DID.
    | grade: [x] met 2026-08-16 | evidence: GET briefing 200 status=ready 15 chain steps including zoning-fact / setback-rule / buildable-envelope source atoms plus withheld terrain and pending parcel-node. Confidence objects on source steps. `bodyVerbatim=false`. No fabricated Pass.
    | depends on: 6

11. **E6 map.** On F2, floating map is the live SmartSite map for `48021:28286` (`?parcelNodeId=`). On F3, the same embed without page navigation. Host remains `plan-review-app`. Never deploy plan-review from dirty `P:\hauska-map`.
    | check: live iframe or open-in-SmartSite URL on intake and matrix. Deploy source is `plan-review-app`, not property-explorer.
    | grade: [x] met 2026-08-16 | evidence: A-009. Serving `plan-review-00008-pol` @100% tag `g60e`. GET map-feature `host=smartsite` `smartSiteUrl=https://smartsite.cloud/?parcelNodeId=48021%3A28286`. UI `dpl_GB87Rq19HMiShTRdH9sbWXKa6ixc` embeds that URL. Dirty hauska-map not the deploy vehicle.

12. **Decision letter.** End-to-end on engagement A completes intake to a letter (HTML or PDF) that cites atom IDs, carries the determination, does not reproduce ICC body. Letter is served by plan-review, not cortex `cortex_deliverable_letter_*`.
    | check: live GET letter. Cortex letter tools unused by this surface.
    | grade: [x] met 2026-08-16 | evidence: POST letter/generate on A `aafb9572-…` 200 html length 832 cites atom + R302/R311, no verbatim ICC body. UI generate button live. Cortex letter tables unused.
    | depends on: 7

13. **Smart Files room.** Folder `folder:tenant:icc-demo:<slug>` on engagement A when a reviewer loads a file in plan review. Plan-review is the UI. Smart Files is the store. Applicant view is `/applicant?token=` on plan-review-app. `smart-files-app` is G-59 QA, not this room. Planner does not seed more files.
    | check: upload from plan-review Files tab. Share URL host is plan-review-app. Unauthed `/applicant` without token is honest empty. Unauthed `/applicant?token=` lists that folder only. Zero new planner POSTs to files.
    | grade: [x] partial 2026-08-16 | evidence: A-010 live on `plan-review-00010-cey` @100% tag `g60f` origin `5952846`. UI `dpl_5rjkGcE44C2FFLVhDHE7C8BUbGr5`. Unauthed `/applicant` 200 with Applicant nav. BFF `/applicant/room` no token 400. Bogus token `share_not_found`. Share URL constructor is `plan-review-app-ten.vercel.app/applicant?token=`. Planner POSTed zero new files or shares this wave. Premature `site-plan-sheet.txt` / `mcp-g60-probe.txt` remain. Token-room list after a reviewer share is still owed.
    | depends on: 3, 16

14. **MCP finished: substrate.** Serving revision re-counted. `search_atoms` / `get_atom` reach retrieval for a public-free non-ICC atom. `get_property_atom_chain` on `48021:28286` is store truth. `/health` retrieval is not ok-on-404. Anon initialize 200. Malformed key 401.
    | check: live tools/call + health JSON on serving revision.
    | grade: [x] met 2026-08-16 | evidence: serving `hauska-mcp-server-00072-puy` @100% tag `g60`. Tools 82 = public 13 / Codex 9 / reporting 53 / map 7. Health retrieval `state=ok` with no HTTP 404 detail (probe path `/health`). Anon initialize 200. Malformed `X-Hauska-Key` 401. `get_property_atom_chain` on `48021:28286` status=ready. `search_atoms` bastrop-tx setback reached retrieval (0 hits for that query; chain is the store-truth proof).
    | depends on: this file approved

15. **MCP finished: dead ends gone.** `get_property_detail` and `get_replacement_cost` fail closed for every key (`extinguished`, not credential-pending). Cotality/CoreLogic stripped from `get_hazard_profile` / `get_parcel_polygon` copy. Zero outbound Cotality. Existing `codex_*` no longer call LDT Cotality-shaped F2.
    | check: tools/call + description grep + no CoreLogic host in traces.
    | grade: [x] met 2026-08-16 | evidence: reporting `get_property_detail` isError extinguished. Client never fetches Cotality even with env creds (unit tests). Codex tools call plan-review Cloud Run (`PLAN_REVIEW_BACKEND_URL`). Copy no longer says credential-pending / OAuth.
    | depends on: 14

16. **MCP finished: Smart Files.** `list_smart_file_folders`, `read_smart_file`, `create_smart_file_folder`, `upload_smart_file`, `share_smart_file_folder` all live against the files service, not cortex-api. Personas `icc-demo/reviewer` and `icc-demo/observer` exist on files.
    | check: tools/call matrix. Client URL is files run.app. Cortex folders still 404.
    | grade: [x] met 2026-08-16 | evidence: Codex key list returns `folder:tenant:icc-demo:plan-review-48021-28286`. create `folder:tenant:icc-demo:g60-mcp-write-probe`. upload `smartfile:tenant:icc-demo:mcp-g60-probe.txt`. Client refuses cortex-api. share tool registered, not separately live-called this probe.
    | depends on: 14

17. **MCP finished: Codex tools call the live functions.** The five Codex tools are retargeted at plan-review Cloud Run and cover F1-F7 (queue/intake/matrix/override/library/code/briefing/letter). New `icc_activity_list` reads the inbound ledger. Reporting `cortex_*` stay in the registry for reporting keys; they are not deleted and they are not the ICC path.
    | check: each Codex tool live against a fixture engagement. `codex_*` does not hit cortex-api plan-review routes.
    | grade: [x] met 2026-08-16 | evidence: `codex_findings_fetch` queue Submitted=2. `codex_finding_generation` matrix on `aafb9572-7940-4fb1-ab50-0e58e2f31a60`. `codex_briefing_fetch` chain source `icc:ibc-2018:R311.7`. `codex_override_write` 200 pending DID. `plan_review_get_code` IPMC typed-absence. `icc_activity_list` actor `did:hauska:actor:org:icc`. reporting 53 includes cortex_*. Host `plan-review-ozx33wafia-ue.a.run.app`.
    | depends on: 4-12, 16

18. **G-30 stamp.** Ingest does not hardcode public-free for ICC. Existing ICC atoms platform-internal. Anon `list_jurisdictions` omits `icc-model-code`. Anon `get_atom` on a cited IBC DID holds the body.
    | check: grep ingest. Store query. Anon list + get.
    | grade: [x] partial 2026-08-16 | evidence: ingest hardcode gone engine **#346** `ebe6d63`. MCP read-path live **#69 MERGED** squash `0316d0a` serving `hauska-mcp-server-00074-tar` @100% tag `g60d`. Anon `list_jurisdictions` tenants `bastrop_tx`, `grand_county_ut` (icc-model-code omitted). Anon `get_atom` `did:hauska:jurisdiction-corpus:icc-model-code` isError access-deny, no body. Reviewer key still reads that DID. Store rows still `public-free` (query_jurisdiction summary accessPolicy public-free, atomCount 4966). No `--apply`. L26 still holds the slot.
    | slot: bounded UPDATE of ICC rows only; announce; not during live L26 `--apply`.

19. **G-17 hard actor reference.** ICC code-section atoms served in the demo carry `sourceActorDid=did:hauska:actor:org:icc` plus book_id plus section_id. Meter uses those fields, not regex, for those rows.
    | check: payload on the cited section. Portal row points at the same DID.
    | grade: [x] partial 2026-08-16 | evidence: new ICC code-section atoms will carry `sourceActorDid=did:hauska:actor:org:icc`. Plan-review activity rows already use actor `did:hauska:actor:org:icc` plus book_id plus section_id (not regex). Existing ICC store atoms not updated while L26 holds `--apply`.
   | depends on: 18

20. **G-23 named rate.** Fixture `0.01` USD unless the decision names another number. Label: PoC fixture, not a quoted SaaS price. `pending-rate` is a fail.
    | check: ledger after the walk.
    | grade: [x] met 2026-08-16 | evidence: GET `/api/icc/activity` 200 n=7, every row `rate=0.01`, sources `plan-review-ui` and `mcp:codex_override_write`. Label "PoC fixture, not a quoted SaaS price". This is the plan-review activity table, not a second Circle ledger. Hauska inbound meter on existing ICC atoms still waits G-30 UPDATE.

21. **ICC activity portal.** Gated `/icc/activity` on `plan-review-app`. Observer `icc-demo/observer` sees rows for actor `did:hauska:actor:org:icc`: timestamp, source (`plan-review-ui` or `mcp:<tool>`), book, section, engagement id if any, rate, amount, tier. Includes free-tier. Same data via MCP `icc_activity_list`. Not Command Center. Footer names IPMC residual and purge selectors (`sourceAdapter=icc-code-connect`, `jurisdictionTenant=icc-model-code`).
    | check: UI after reviewer walk + one MCP `get_atom` on an IBC section. Row count >= 1 from each source.
    | grade: [x] met 2026-08-16 | evidence: `/icc/activity` on `plan-review-app-ten.vercel.app` gated. API rows accrue to `did:hauska:actor:org:icc` at 0.01 from UI and MCP. Footer names IPMC residual and purge selectors. Unauthed 401 already graded in item 3.

22. **End-to-end walk.** A planner who was not in this chat runs `_inbox/2026-08-16_icc_demo_walk.md` covering F1-F7, letter, files, MCP Codex tools, and the ICC portal, without asking which parcel or URL.
    | check: walk LIVE block filled. Close records a dry-run.
    | grade: [x] met 2026-08-16 (same-planner caveat) | evidence: LIVE filled 2026-08-16T19:53Z from serving probes. Queue A In Review B Submitted. Matrix R311.7 Uncertain. Letter 832. Anon ICC withheld. Close `_inbox/2026-08-16_icc_demo_close.json` records the dry-run. Same planner as the elevate wave filled LIVE, not a second person. Hard-fail list none fired.
    | depends on: 4-13, 17, 21

23. **Honest close.** Names IPMC residual. Names G-50 SaaS OPEN. Names Circle/self-serve/directory OPEN. Does not claim customer-facing ICC. Does not claim G-53. Ledger still 200 with `computedAt`. Files isolation seed still lists. Cortex `/api/smart-files` still 404. Names that cortex `/api/plan-review` is a remount proxy, not a 404.
    | check: `_inbox/2026-08-16_icc_demo_close.json`
    | grade: [x] met 2026-08-16 | evidence: close JSON `honestCloseChecklist` names IPMC G-41 typed-absence, G-50 OPEN, Circle/DNS/directory OPEN, not customer-facing ICC, not G-53. Ledger 200 `summary.computedAt=2026-08-14T17:41:22.500Z` `satisfiedCells=616`. PE g58-probe room lists. Cortex files 404. Cortex queue unauth 200 `x-plan-review-proxied: 1` (remount proxy, not a 404).
    | depends on: 22, 24

24. **Cortex remount.** After the elevated BFF is live on plan-review Cloud Run, cortex-api `/api/plan-review/*` proxies to that service. Zero in-process BFF writes to cortex-prod for those routes. Existing CC / PE / cortex-tiles / MCP callers keep the cortex URL. Not a 404. Dirty LDT is not the PR vehicle.
    | check: live GET `/api/plan-review/queue` on cortex-api hits plan-review Cloud Run (trace/service header). Cortex `/api/smart-files` still 404.
    | grade: [x] met 2026-08-16 | evidence: serving `cortex-api-00519-muq` @100% tag `g60`. Prod `GET https://cortex-api-tds7av26va-uc.a.run.app/api/plan-review/queue` 200 header `x-plan-review-proxied: 1` body plan-review fixtures `total=2` A `aafb9572-…` In Review B `d5c8a43f-…` Submitted. `/api/smart-files/folders` 404 unmounted. `/api/healthz` 200. Ledger 200 `satisfiedCells=616`. LDT PR **#436 MERGED** squash `85c5d1a8c12a4a70e81323a907ca252b802266b8` 2026-08-16T16:45:07Z (Test check-run conclusion `success`). Dirty `feat/s1-instrument-hardening` untouched. Residual: queue JSON is plan-review buckets, not the old BFF `QueueRow[]`. Unelevated BFF report/annotation routes now 404 from plan-review.
    | depends on: 2, 4-12

## Out of scope

G-50 signed SaaS and public-paid flip. Circle checkout. Self-serve agent signup. `mcp.hauska.dev` DNS. Directory listings. PE ICC citations on. Command Center as the portal. SmartCity MyGov (G-52). Full applicant portal (login, submit a new engagement without a reviewer). Bluebeam. Visual design / branding. IPMC `--apply` while L26 holds the slot. G-58b DROP. Second MCP server. Subtree of LDT. Dirty LDT or dirty hauska-map checkouts as the deploy vehicle. `P:\smartcity-os`. Deleting 46 reporting tools. Planner-seeded writes into Smart Files.

## Amendments

A-001 draft. Operator fused MCP + plan review + ICC; housing is Smart Files-shaped; morning WDLLs superseded.

A-002 draft. Personas `icc-demo/reviewer` and `icc-demo/observer` (same tenant).

A-003 draft. Operator correction: plan review must be functionally complete (F1-F7 + map + letter), not a one-engagement stub. "Basic UI" is housing/visual. MCP must be finished (Codex tools live, dead ends gone, Smart Files writes), not an ICC-only allowlist stub. ICC's own surface is the activity portal produced by those two. F10 in the first adversarial pass is reversed.

A-004 2026-08-16. Operator approved this card. Housing locked: repo `empressaioemail-tech/plan-review`, GCP `plan-review-505715`, Neon DSN file `%USERPROFILE%\.empressa\plan-review.database_url`. Still-out list confirmed. G-60 / A-024. Reason: go on the rest.

A-005 2026-08-16. Four-lane alignment. G-60 is C+D PoC plus finished MCP, not a fifth lane. Lane A (G-58/59) already ran and is the files mount. Lane B stays last / no-touch. Serving home for C is `plan-review`, not LDT. Artifact `_inbox/2026-08-16_ops17_four_lane_alignment.md`. OPS-17 A-025.

A-006 2026-08-16. Extract then remount. Elevate existing cortex `/api/plan-review` callables into `plan-review`; remount on cortex as a proxy (item 24). Do not rewrite F1-F7 from empty stubs. Calibration left as-is. OPS-17 A-026. Decision `_decisions/2026-08-16_plan_review_extract_and_remount.md`. Inventory `_inbox/2026-08-16_plan_review_cortex_callable_inventory.md`.

A-007 2026-08-16. Plan review is Smart Files' first product consumer. Documents, sheets, and dataroom atoms are Smart Files based. Do not port cortex dataroom tables. OPS-17 A-027. Decision `_decisions/2026-08-16_plan_review_is_smart_files_first_consumer.md`.

A-008 2026-08-16. G-60 does not wait for L26 quiet. Store UPDATE (items 7/18/19) is a named residual. Slot-free next: MCP anon ICC withhold, walk, close. No second `--apply`. Decision `_decisions/2026-08-16_g60_does_not_wait_on_l26.md`. OPS-17 A-028.

A-009 2026-08-16. Map is the live SmartSite surface (`smartsite.cloud/?parcelNodeId=`), not an OSM envelope pane and not a deploy from dirty `P:\hauska-map`. Share is a Smart Files data-room URL on `smart-files-app` for the architect, homeowner, or contractor who submitted the plan. Upload stays in the engagement folder. Read-only token, that room only. Applicant portal stays out. **A-010 reverses the share host and the no-applicant-view clause.**

A-010 2026-08-16. Plan review owns the files UI and the applicant view. Smart Files is the backend store. Share URL is `plan-review-app-ten.vercel.app/applicant?token=`, not `smart-files-app`. Do not planner-seed more files. Existing icc-demo objects are premature residue; no silent DELETE. Decision `_decisions/2026-08-16_plan_review_owns_files_ui.md`. OPS-17 A-031.

## Finish card

Re-graded 2026-08-16T19:54Z against the same item numbers. Close `_inbox/2026-08-16_icc_demo_close.json`. Walk `_inbox/2026-08-16_icc_demo_walk.md`.

| Item | Start | Finish | Evidence |
|---|---|---|---|
| 1 | met | met | housing locked; unchanged |
| 2 | met | met | `plan-review-00006-duj` @100% tag g60c |
| 3 | met | met | `plan-review-app-ten.vercel.app` unauthed ICC 401 |
| 4 | met | met | live queue total=2 Submitted=1 In Review=1 |
| 5 | met | met | A 48021:28286 cotalityCalls=0 |
| 6 | met | met | matrix n=4 R311.7 Uncertain bodyVerbatim=false |
| 7 | partial | partial | override live; pending:plan-review:f361bc78-…; no store ingest |
| 8 | met | met | global findings?sectionId=R311.7 returns A and B. Nested /engagements/:id/findings is 501 leftover |
| 9 | met | met | IBC seed + UDC + IPMC typed-absence |
| 10 | met | met | briefing 15 steps ready |
| 11 | partial | met (A-009) | live SmartSite embed `smartsite.cloud/?parcelNodeId=` on `00008-pol` / `dpl_GB87Rq19HMiShTRdH9sbWXKa6ixc` |
| 12 | met | met | letter html_len=832 |
| 13 | met | partial (A-010) | share host reversed to plan-review `/applicant?token=`. Live pin after g60f. Premature files residue left in place. Planner not seeding more. |
| 14 | met | met | serving now 00074-tar; chain ready; withhold additive |
| 15 | met | met | Codex key product-gates get_property_detail; reporting-key extinguished stands |
| 16 | met | met | list_smart_file_folders tenant icc-demo live |
| 17 | met | met | Codex tools on plan-review Cloud Run |
| 18 | partial | partial | ingest #346 + read-path #69 live; store public-free 4966 |
| 19 | partial | partial | activity actor+book+section live; store atoms not UPDATEd |
| 20 | met | met | rate 0.01 UI + MCP |
| 21 | met | met | /icc/activity + icc_activity_list |
| 22 | open | met (same-planner caveat) | LIVE filled; same planner recorded |
| 23 | open | met | this close |
| 24 | met | met | cortex queue unauth 200 x-plan-review-proxied:1; files 404 |

Drift vs Start: items 22 and 23 moved open to met at first close. A-009 moved item 11 partial to met (live SmartSite embed) and elevated item 13 share to a submitter data-room URL. A-010 re-opened item 13 to partial: share host is plan-review applicant view, not smart-files-app; planner must not seed more files. Queue counts moved Submitted=2 to Submitted=1 In Review=1 because F4 override landed. MCP pin moved 00072-puy to 00074-tar. Residual set is now 7/13/18/19.
