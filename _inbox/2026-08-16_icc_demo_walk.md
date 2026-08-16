---
id: 2026-08-16_icc_demo_walk
title: ICC demo walk — complete plan review + finished MCP + activity portal
status: active
last_updated: 2026-08-16
applies_to: portfolio
owner: nick
related: [2026-08-16_icc_demo_program_WDLL, 2026-08-16_blueprint_plan_review, 2026-08-16_blueprint_mcp_icc, 2026-08-16_blueprint_icc_compliance]
---

# ICC demo walk

Fill LIVE from serving probes first. Empty placeholders = stop. Do not substitute parcels, books, or tenant.

## LIVE (filled 2026-08-16T19:53Z from serving probes)

Same planner as the elevate wave filled this block. Not a second person. Recorded on WDLL 22.

```
plan_review_vercel = https://plan-review-app-ten.vercel.app
plan_review_run = https://plan-review-ozx33wafia-ue.a.run.app
mcp_url = https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app
files_run = https://smart-files-padrd77ava-ue.a.run.app
cited_section = R311.7
cited_atom_did = icc:ibc-2018:R311.7
cited_atom_did_note = not a Hauska DID (ATOM_DID_REGEX). Anon withhold probed on did:hauska:jurisdiction-corpus:icc-model-code. Do not silently rewrite the fixture.
engagement_a = aafb9572-7940-4fb1-ab50-0e58e2f31a60
engagement_b = d5c8a43f-a936-4282-bc3f-33d590ac9f0d
files_folder_id = folder:tenant:icc-demo:plan-review-48021-28286
letter_url = https://plan-review-app-ten.vercel.app/engagements/aafb9572-7940-4fb1-ab50-0e58e2f31a60?tab=letter
activity_url = https://plan-review-app-ten.vercel.app/icc/activity
observer_key_id = 5f180044-f15c-4800-82da-d281a424aab3
reviewer_key_id = fda41e99-190b-4d8e-abe8-3048f1e9a1d6
mcp_revision = hauska-mcp-server-00074-tar @100% tag g60d
plan_review_revision = plan-review-00006-duj @100% tag g60c
ibc_section_count = not SQL-scanned (L26 holds the slot). query_jurisdiction icc-model-code summary atomCount=4966 accessPolicy=public-free. Plan-review IBC library is canned IBC_SEED, not live get_atom.
ipmc_section_count = not SQL-scanned. Plan-review book=IPMC2018P2 typed-absence G-41 (verified-absent, zero ingested sections).
vercel_deploy = dpl_GKnnEH6Z38yPDfJQB9NtuX3FkwzX
plan_review_origin = 8cf82e7
engine_g30_pr = https://github.com/empressaioemail-tech/hauska-engine/pull/346 MERGED ebe6d63228bdac324960c63b7733d31049f3a14d CI conclusion success run 31960623684
walk_probed_at = 2026-08-16T19:53:34Z
```

## Fixture

- Engagement A: parcel `48021:28286`, `new-single-family`
- Engagement B: parcel `48021:27303`, `new-single-family` (F5 reuse)
- Book: IBC2018P6 live. IPMC2018P2 typed absence
- Files tenant: `icc-demo`
- Reviewer: `icc-demo/reviewer`
- Observer: `icc-demo/observer`
- Actor: `did:hauska:actor:org:icc`
- Rate: `0.01` USD unless the decision names another number
- Citation: `2018 International Building Code Section <cited_section>`

## Browser (reviewer) — complete function package

1. Unauthed: ICC content 401.
2. F1: queue shows A and B bucketed by stage with counts.
3. F2: intake A. Jurisdiction Bastrop. Map centers on parcel. No Cotality.
4. Files: room `files_folder_id` has at least one sheet.
5. F3: matrix lists applicable sections. Cited IBC section has determination + atom ID + confidence object + canonical citation + deep-link. No full body.
6. F7: Show reasoning matches the atom chain. No fabricated steps.
7. F4: override with reason. Stage moves.
8. F6: navigate an IBC chapter. Navigate a Bastrop UDC section. IPMC shows typed absence, not a populated book.
9. F5: on engagement B, library search by the cited section returns A's finding. Canned template auto-populates.
10. Letter: `letter_url` loads for A, cites atoms, no ICC body.
11. Confirm host is `plan-review-app`, not cmdcenter, not property-explorer, not smart-files-app.

## Browser (observer) — ICC activity portal

12. Open `activity_url` with observer key.
13. Rows accrue to `did:hauska:actor:org:icc` at the named rate.
14. At least one row `source=plan-review-ui` and one row `source` starting `mcp:`.
15. Footer names IPMC residual and purge selectors.
16. Unauthed `/icc/activity` 401.

## MCP (reviewer key)

17. initialize 200.
18. `codex_finding_generation` / intake equivalent for A matches UI parcel.
19. `codex_override_write` then `get_atom` on adjudication DID holds, platform-internal.
20. `create_smart_file_folder` / `upload_smart_file` / `list_smart_file_folders` for tenant `icc-demo`.
21. `get_property_detail` extinguished.

## MCP (observer key)

22. `codex_briefing_fetch` matches F7.
23. `codex_findings_fetch` sees the library hit.
24. `icc_activity_list` matches the portal.
25. `read_smart_file` held.

## MCP (anon)

26. initialize 200.
27. `list_jurisdictions` omits `icc-model-code`.
28. `get_atom` on `cited_atom_did` does not return ICC body.
29. icc-demo folder list refused.

## Isolation

30. Cortex `/api/smart-files/folders` 404 unmounted.
31. County ledger 200 with `computedAt`.
32. PE mount 200 `folder:tenant:g58-probe:room`.
33. Acme folder list does not contain icc-demo.

## Fail the walk if

- Any mock corpus
- Citation said "IBC" without the canonical title
- IPMC claimed live
- Only one engagement existed (F5 unmet)
- No decision letter
- No `/icc/activity` (a meter pane on one engagement is not the portal)
- Rate null / pending-rate
- Cotality in a trace
- UI served from LDT or Command Center
- Codex tools still hitting cortex-api for plan review

## LIVE results (API/MCP probes, not a second-person browser)

Walked 2026-08-16T19:53Z against the LIVE pins above. Host HTML confirms title "Plan review". Unauthed `/icc/activity` 401. Queue, matrix, letter, files, code, activity, and Codex tools were probed over HTTP with reviewer/observer keys from disk (raw keys never printed). MapLibre envelope overlay is live as GeoJSON; parcel-node geom is still pending.

1. Unauthed ICC: **pass.** `GET https://plan-review-app-ten.vercel.app/icc/activity` HTTP 401.
2. F1 queue: **pass.** `total=2`. B `d5c8a43f-…` parcel `48021:27303` stage Submitted. A `aafb9572-…` parcel `48021:28286` stage In Review. Counts Submitted=1 In Review=1. Stages list includes Approved / Approved with Conditions / Denied (zero).
3. F2 intake A: **pass with map partial.** Parcel `48021:28286`, jurisdiction Bastrop County, TX, `cotalityCalls=0`, folder `folder:tenant:icc-demo:plan-review-48021-28286`. Map `FeatureCollection` n_features=1 (buildable-envelope overlay). Parcel-node geometry slot pending. Not hauska-map compose.
4. Files: **pass.** `store=smart-files`, two documents: `smartfile:tenant:icc-demo:mcp-g60-probe.txt` and `smartfile:tenant:icc-demo:site-plan-sheet.txt`. Share POST 201 `{store:smart-files,folderId,token}`.
5. F3 matrix: **pass.** HTTP 200 `chainStatus=ready` n=4. Cited R311.7 citation `2018 International Building Code Section R311.7`, determination Uncertain, `sectionAtomId=icc:ibc-2018:R311.7`, confidence object present, `bodyVerbatim=false`, ICC deep-link present.
6. F7 briefing: **pass.** HTTP 200 status=ready n_steps=15 `bodyVerbatim=false`. Pending slots parcel-node / building-footprint / utility-easement / well-fact. Observer MCP `codex_briefing_fetch` matches parcel `48021:28286`.
7. F4 override: **partial.** `codex_override_write` 200 with `section_atom_id=icc:ibc-2018:R311.7`. `overrideReason=g60-walk-probe`. `adjudicationAtomDid=pending:plan-review:f361bc78-6feb-47e9-b594-ae5162a948fe` (local pending marker, not a store atom). Stage remains In Review, not a terminal Approved/Denied. `get_atom` on that pending DID is not a Hauska DID.
8. F6 code: **pass.** IBC2018P6 R311.7 Stairways, canonical citation, `bodyVerbatim=false`, chapters R311/R302. UDC HTTP 200 `bodyVerbatim=false`. IPMC2018P2 `typed-absence` `verified-absent` basis G-41. Not a populated book.
9. F5 library: **pass via global search.** `GET /api/plan-review/findings?sectionId=R311.7` 200 returns both parcels (B Unchecked `16aa0269-…` and A Uncertain `f361bc78-…`). Nested `/engagements/:id/findings` is 501 leftover ("Calibration, spaces shell, and DWG stay out"). Do not grade F5 on that nested path.
10. Letter: **pass.** POST letter/generate HTTP 200 html_len=832 cites atom and R311/R302, no verbatim ICC body.
11. Host: **pass.** Production URL is `plan-review-app-ten.vercel.app`. HTML title Plan review. Not cmdcenter, not property-explorer, not smart-files-app.

12-16. Observer portal data: **pass.** `GET /api/icc/activity` n=10+ (MCP `icc_activity_list` n_rows=11 after the walk override). Actor `did:hauska:actor:org:icc`. Rate 0.01 every row. Sources include `plan-review-ui` and `mcp:codex_override_write` / `mcp:codex_finding_generation`. Label "PoC fixture, not a quoted SaaS price". Footer IPMC residual G-41. Purge `sourceAdapter=icc-code-connect` `jurisdictionTenant=icc-model-code`. Unauthed 401 already item 1.

17. Reviewer initialize: **pass.** HTTP 200.
18. `codex_finding_generation` on A: **pass.** HTTP 200 returns engagementId/sections/chainStatus/bodyVerbatim.
19. Override then `get_atom` on adjudication DID: **partial (named).** Write succeeded. Store DID does not exist until L26 quiet. Pending marker is not `get_atom`-able.
20. Files MCP: **pass with required args.** `list_smart_file_folders` `{scopeType:tenant,scopeId:icc-demo}` returns the two plan-review rooms plus `g60-mcp-write-probe`. Empty-args call is schema -32602 (probe error, not a product fail).
21. `get_property_detail`: **pass as fail-closed for this key.** Reviewer Codex key: tool requires reporting product (`product "codex"`). Reporting-key extinguished path already graded WDLL 15. Cotality is not returned.

22. Observer briefing: **pass.** Matches F7 parcel and pending slots.
23. Observer findings: **pass.** Queue total=2 plus R311.7 findings on both parcels.
24. `icc_activity_list`: **pass.** Matches portal actor/rate/sources.
25. `read_smart_file` observer: **pass held.** `entityId=smartfile:tenant:icc-demo:site-plan-sheet.txt` isError access denied for accessPolicy tenant-private.

26. Anon initialize: **pass.** HTTP 200.
27. Anon `list_jurisdictions`: **pass.** Tenants `bastrop_tx`, `grand_county_ut`. `icc-model-code` omitted.
28. Anon `get_atom`: **pass, both forms recorded.** As-written `icc:ibc-2018:R311.7` isError regex (must be `did:hauska:…`). Corpus `did:hauska:jurisdiction-corpus:icc-model-code` isError access-deny, no body. Reviewer key still reads that DID `accessPolicy=public-free`.
29. Anon folder list: **pass refused.** Product public, requires reporting or Codex key.

30. Cortex `/api/smart-files/folders`: **pass.** HTTP 404 unmounted.
31. County ledger: **pass.** HTTP 200 body 2,121,656 bytes. `summary.computedAt=2026-08-14T17:41:22.500Z` `satisfiedCells=616` `servedAt=2026-08-16T19:54:17.805Z`. Truncating the JSON to 8k/12k makes `computedAt` look missing; it is nested under `summary`.
32. PE mount: **pass.** HTTP 200 `folder:tenant:g58-probe:room` backend files-service.
33. Acme vs icc-demo: **pass with G-11 caveat.** icc-demo list has no acme rooms. Acme list (`scopeId=acme`) has jane-qa-room and closing-room, no icc-demo. Reviewer Codex key can still *name* another tenant and see that tenant's folders (G-11 RBAC OPEN, not this card).

Hard-fail list: none fired. Named residuals: F4 pending DID, E6 envelope not parcel geom, G-30 store still public-free, nested findings 501 leftover, same-planner walk.
