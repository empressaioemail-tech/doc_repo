---
id: 2026-08-28_p88_item21_directory_blockers
title: Item 21 filing blockers — operator pre-submit review
date: 2026-08-28
status: active
plan_row: P-88
wdll: _inbox/2026-08-28_smartsite_mcp_app_WDLL.md
wdll_item: 11
legacy_item: 21
operator_ruling: Hold all filing until remaining blockers clear. B1 and B3 customer-done 2026-08-28. B2/B4/S1-S3 copy-ready (not filed) 2026-08-28.
last_updated: 2026-08-28
snapshot: doc_repo main 843b343
llms_txt_fetched: 2026-08-28 https://mcp.smartsite.cloud/llms.txt
---

# Item 21 — do not submit until cleared

Operator ran four example prompts plus discovery endpoints against production (2026-08-28). **Item 21 remains blocked** on the operator prompt battery and the operator file. Copy for B2, B4, and S1 to S3 is ready in `_inbox/2026-08-28_p88_item21_claude_directory_submission.md`. Not filed.

## Closed on live probe

### B1 — find_parcel city/ZIP — CUSTOMER-DONE 2026-08-28T13:38Z

Connect probe on serving cortex-api `00623-mag` (LDT #518 `ab0cac20`):

- B1 `find_parcel("908 Pine St, Bastrop TX 78602")` → top hit `48021:34137` / `48021` / `908 PINE , BASTROP, TX 78602` / `parcel-situs`. First two attempts aborted (`This operation was aborted`); third succeeded.
- B2 `find_parcel("908 Pine, Bastrop TX 78602")` → same gold pair.
- B3 `find_parcel("48021:34137")` → node-id control unchanged.
- Georgetown `find_parcel("908 Pine St, Georgetown TX 78626")` → `48491:R042064` only. B1 had no 48491 row.

Second hit on B1/B2 is an honest same-county address-point (`parcelNodeId: null`, `908 PINE ST, Bastrop`). Not the old Georgetown leak. leave_behind: first-call abort on a scale-to-zero revision (see Notes).

### B3 — Legal routes serve SPA shell — CUSTOMER-DONE 2026-08-28T15:36Z

hauska-map PR #275 merged `e3e40c2`. Live curl (no JS):

- `https://smartsite.cloud/privacy` and `/privacy/` → `Privacy | Smart Site` / `<h1>Privacy</h1>` / `filename="privacy.html"`
- `https://smartsite.cloud/terms` and `/terms/` → `Terms | Smart Site` / `<h1>Terms</h1>` / `filename="terms.html"`

Support address remains `support@empressa.io` (S4 still unconfirmed). B3 is not an open gate on the directory draft.

## Copy-ready (not filed)

Draft: `_inbox/2026-08-28_p88_item21_claude_directory_submission.md`. Authority: live `https://mcp.smartsite.cloud/llms.txt` fetched 2026-08-28.

### B2 — export_instrument status — COPY-READY 2026-08-28

Live `llms.txt` lists eight tools. `export_instrument` is described as live: proxies Hauska MCP when configured; returns degraded (not server-down) if Hauska is unreachable. Only `request_records` and `check_request` are marked not ready.

Submission long description now matches that split. It no longer says three tools are `not_ready`.

### B4 — Coverage — COPY-READY 2026-08-28

Draft no longer says "Texas parcels." Coverage line is statewide flood and CAD land use where the store exists; zoning live in named Central Texas jurisdictions. Bastrop city (`bastrop-city-tx`) is the served reference. Dallas/Houston empty zoning is written as store absence, not a broken server.

### S1 — Citations — COPY-READY 2026-08-28

Short and long copy say "source attribution and citations where available." They do not guarantee "citations and verdicts."

### S2 — Example prompt — COPY-READY 2026-08-28

Self-contained gold prompt is exactly: `Get the smart site for 48021:34137 and summarize flood risk`.

### S3 — Auth string — COPY-READY 2026-08-28

Single string in short and long copy: `OAuth 2.1 + PKCE via WorkOS AuthKit; Google/Microsoft match the workbench.`

## Still open

### S4 — Support mailbox — UNCONFIRMED

Draft keeps `support@empressa.io`. Search of tracked canon (MEMORY.md, `_smartsite_masters`, `72_hauska_inc_operations.md`, privacy/terms docs) found no monitored `support@smartsite.cloud` alias. Operator still owes a confirm that `support@empressa.io` is the mailbox they want on the listing, or a monitored Smart Site alias.

### Item 21 file gate

Copy alignment is not a filing. Operator re-runs the prompt battery, then files. Item 21 stays blocked until both happen.

## Minor (same wave if cheap)

- Junk saved row `48021:25420` label `", ,"` visible in list_my_properties (P-91 item 2)
- Health `version: 0.0.1` reads pre-alpha. Bump or omit in public copy
- First-call abort on scale-to-zero (cortex-api `minScale` on next main-workflow canary; LDT #521)

## Passes (no change needed)

Health green; authConfigured + cortexConfigured true. Eight tools on llms.txt. get_smart_site + list_my_properties clean. Envelope honest refusal on 34137 defensible. Privacy and terms live HTML.

## Execution order

1. **B2 + B4 + S1 to S3** copy alignment. DONE 2026-08-28 in the directory draft. Not filed.
2. Minor hygiene + first-call abort (cortex-api `minScale` on next main-workflow canary; LDT #521)
3. Operator confirms S4 mailbox
4. Re-run operator prompt battery, then item 21 file
