---
id: 2026-08-16_icc_demo_walk
title: ICC demo walk — complete plan review + finished MCP + activity portal
status: draft
last_updated: 2026-08-16
applies_to: portfolio
owner: nick
related: [2026-08-16_icc_demo_program_WDLL, 2026-08-16_blueprint_plan_review, 2026-08-16_blueprint_mcp_icc, 2026-08-16_blueprint_icc_compliance]
---

# ICC demo walk

Fill LIVE from serving probes first. Empty placeholders = stop. Do not substitute parcels, books, or tenant.

## LIVE (fill at execute)

```
plan_review_vercel = https://plan-review-app-ten.vercel.app
plan_review_run = https://plan-review-ozx33wafia-ue.a.run.app
mcp_url = https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app
files_run = https://smart-files-padrd77ava-ue.a.run.app
cited_section = R311.7
cited_atom_did = icc:ibc-2018:R311.7
engagement_a = aafb9572-7940-4fb1-ab50-0e58e2f31a60
engagement_b = d5c8a43f-a936-4282-bc3f-33d590ac9f0d
files_folder_id = folder:tenant:icc-demo:plan-review-48021-28286
letter_url = https://plan-review-app-ten.vercel.app/engagements/aafb9572-7940-4fb1-ab50-0e58e2f31a60?tab=letter
activity_url = https://plan-review-app-ten.vercel.app/icc/activity
observer_key_id = 5f180044-f15c-4800-82da-d281a424aab3
reviewer_key_id = fda41e99-190b-4d8e-abe8-3048f1e9a1d6
mcp_revision = hauska-mcp-server-00072-puy @100% tag g60
plan_review_revision = plan-review-00003-ws8
ibc_section_count = <live SQL>
ipmc_section_count = <live SQL, expect 0>
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
