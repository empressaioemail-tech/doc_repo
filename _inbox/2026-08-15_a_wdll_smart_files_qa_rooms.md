---
id: 2026-08-15_a_wdll_smart_files_qa_rooms
title: WDLL — Smart Files QA rooms (create, upload, share, org)
status: approved
last_updated: 2026-08-15
applies_to: portfolio
owner: nick
related: [_inbox/2026-08-15_a_wdll_smart_files_isolation, _decisions/2026-08-15_smart_files_is_a_product, _decisions/2026-08-15_file_set_edges_not_identity, 90_operations/OPS-17_govtech_stack_plan_of_record, 28_mcp_first_product_design]
---

# WDLL: Smart Files QA rooms

Date: 2026-08-15  Status: approved
Operator approval: 2026-08-15 (operator: leave Cortex as unmounted; think the flow through at the Smart Files level; spin a UI on Vercel for QA)
Plan row: G-59 (OPS-17). Does not reopen G-58. Does not start G-58b. Does not touch L26. Does not remount Command Center or cortex-api.

## Done looks like

Nick can open a Smart Files URL (not Command Center, not cortex-api, not SmartSite save/share) and run the room flow: pick a person in an org, create a folder, upload a file, share that folder, and see another person in the same org listed on the same rooms. A person in a different org does not see those rooms. A share link opens the room read-only. Bytes live on the files store (CID on the version row). Cortex stays 404 on `/api/smart-files`. PE mount and the isolation seed still work.

This is a QA surface for the product, not G-11 city-staff RBAC and not G-53. Personas are named test actors, not a login product.

## Flow (the thing being proven)

1. Actor is `(orgId, userId)`. Org is the tenant. Folder is a data room node. File is a document atom. Membership is a `placed-on` edge.
2. Create folder in the current org. Empty rooms are first-class (a folders table), not inferred from files.
3. Upload a file into a folder. Default accessPolicy `tenant-private`. CID is a hash of the bytes. Bytes stay on the files database.
4. Share folder mints a token. Anyone with the link can read that room. They cannot write. They cannot see other rooms in the org.
5. Org view lists rooms created by any user in that org. Switching from Joe/Acme to Jane/Acme shows Joe's room. Switching to Nick/Empressa does not.
6. Cortex is not in this flow. A later card may remount an embed. Not this card.

## Thesis check

- Brand: Empressa product UI. Aligned.
- One MCP server: no second server. Aligned.
- MCP-first (28): partial. List/read tools already exist. Write tools (create folder, upload, share) are named follow-on on the same Hauska MCP server, not this card's live grade. Operator asked for a Vercel QA UI at the files service.
- Catalog web UI: this is a product surface, not a catalog UI. Aligned.
- Tenant sovereignty: files Neon only. Aligned.
- Cortex left unmounted. Aligned.

## Acceptance items

1. **This card is approved and G-59 is in OPS-17.**
   | check: this file `status: approved`. OPS-17 has row G-59 citing this WDLL.
   | grade: [x] met 2026-08-15 | evidence: this file status approved; OPS-17 G-59 + A-023
   | depends on: nothing

2. **Write API lives on the files service.** Create folder, upload file into a folder, mint share, list org folders. Bearer service token required for writes. No files DSN on Vercel. Cortex routes stay 404.
   | check: live POST against `smart-files-*.run.app` (via the QA BFF or direct with the local token) creates a folder that GET list then returns. `GET https://cortex-api-tds7av26va-uc.a.run.app/api/smart-files/folders` still 404 unmounted.
   | grade: [x] met 2026-08-15 | evidence: files `smart-files-00003-kmm` @100%. Live POST `/api/smart-files/folders` 201 `folder:tenant:acme:closing-room` createdBy acme/joe. Cortex folders still 404 unmounted. Vercel env has URL+key only.
   | depends on: 1

3. **Bytes and CID are on the files store.** Upload stores bytes keyed by CID. Read returns the same CID. Default policy `tenant-private`.
   | check: SQL or live read after upload. New document without an explicit policy is `tenant-private`.
   | grade: [x] met 2026-08-15 | evidence: BFF POST upload 201 `smartfile:tenant:acme:jane-note.txt` accessPolicy tenant-private contentCid sha256:2d58b12a… byteSize 12. Earlier note.txt sha256:a7160ec3… tenant-private.
   | depends on: 2

4. **Org isolation.** Two users in org `acme` see the same org folder list. A user in org `empressa` does not see `acme` folders.
   | check: live list as joe/acme, jane/acme, nick/empressa after joe creates a room.
   | grade: [x] met 2026-08-15 | evidence: BFF list tenant/acme returns Closing room (acme/joe) + Jane QA room (acme/jane). tenant/empressa returns folders [].
   | depends on: 2

5. **Share link.** A minted share URL opens that folder read-only without switching persona. It does not list the rest of the org.
   | check: live GET share token returns the shared folder and its files only.
   | grade: [x] met 2026-08-15 | evidence: BFF POST share 201 token NFKLgL2BNh58nu5nKpgmaghD. GET share returns Closing room + note.txt only (not Jane QA room).
   | depends on: 2

6. **Vercel QA UI is live.** Operator can create, upload, share, and switch persona in a browser. Project is not `property-explorer` and not `cmdcenter`.
   | check: live URL. Create + upload + share visible in the page. `vercel` project name is a Smart Files project.
   | grade: [x] met 2026-08-15 | evidence: https://smart-files-app.vercel.app HTML 200 with create/upload/share + persona select. Project `smart-files-app` prj_Mkk6of1Bg3pfu5OIywkVOcvvZS3p dpl_GFNfepXPZyQhyDnCTrHzQ3zHgKxP. BFF writes 201 through that host. Not PE, not cmdcenter.
   | depends on: 2, 3, 4, 5

7. **Isolation seed and PE mount still hold.** `folder:tenant:g58-probe:room` still lists. PE `/api/pe-smart-files-mount` still 200. Ledger still 200 with `computedAt`.
   | check: the three live probes.
   | grade: [x] met 2026-08-15 | evidence: PE mount 200 host=files-service folder:tenant:g58-probe:room. Cortex folders 404 unmounted. Ledger 200 computedAt=2026-08-14T17:41:22.500Z satisfiedCells=616.
   | depends on: 2

8. **Honest close.** Names the Vercel URL, files revision, what G-11 still is not, that write MCP tools are OPEN, that Cortex was not remounted. Does not claim G-53. Does not claim PE save/share is Smart Files.
   | check: `_inbox/2026-08-15_a_smart_files_qa_rooms_close.json`
   | grade: [x] met 2026-08-15 | evidence: close filed. Operator browser walk is the remaining QA, not a WDLL gap.
   | depends on: 6, 7

## Out of scope

G-11 full auth. G-53. G-58b DROP. Remounting Command Center or cortex-api. Replacing PE save/draw/share. Second MCP server. IPFS public network. City-staff roles. L26 / atoms `--apply`.

## Amendments

A-001 2026-08-15. Operator approved the card in session: Cortex stays as unmounted; flow is proven on Smart Files; Vercel UI for QA. Reason: fishing the same flow through Cortex is unnecessary now.
