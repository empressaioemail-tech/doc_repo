---
id: 2026-05-20_cc-agent-C_cortex_qa_wsa_audit
title: Dispatch — cc-agent-C cortex QA WS-A (cutover-tail data integrity audit + fix)
date: 2026-05-20
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [43_cortex_qa_backlog, 90_runbooks/legacy_design_tools_replit_to_cloud_run_cutover, 40_design_accelerator, _decisions/2026-05-19_sync_4_5_and_cortex_sprint, CLAUDE.md]
---

# WS-A — cc-agent-C dispatch (cutover-tail data integrity audit + fix)

You are cc-agent-C continuing on the `legacy-design-tools` repo. This dispatch handles WS-A of the Cortex QA backlog: the cutover-tail data integrity items surfaced during the post-cutover QA verification window. WS-A covers four QA items: QA-03, QA-04, QA-08 (site-data portion), and QA-13. See [`43_cortex_qa_backlog.md`](../43_cortex_qa_backlog.md) for the full backlog, standing findings, and workstream map.

## Why this exists

The Replit to Cloud Run cutover landed 2026-05-20: cortex-api on Cloud Run, cortex-prod Neon, Replit data dependency severed per the cutover runbook Stage 9. The four WS-A items share one root question: is the post-cutover environment correctly wired for auth headers, data source, and external-API connectivity. Several of the findings smell like cutover wiring gaps rather than independent bugs. The QA backlog records three standing findings (Revit add-in still on Replit; Code Library probably reading a pre-cutover database; the in-app agent being read-only); WS-A confirms or refutes the first two.

## Read first

In order:

1. [`CLAUDE.md`](../CLAUDE.md) — operating instructions.
2. [`43_cortex_qa_backlog.md`](../43_cortex_qa_backlog.md) — backlog, standing findings, workstream map.
3. [`90_runbooks/legacy_design_tools_replit_to_cloud_run_cutover.md`](../90_runbooks/legacy_design_tools_replit_to_cloud_run_cutover.md) — Stage 9 executed-cutover state and Stage 9 known issues. This dispatch closes the runbook's Probe 6 (deferred IFC bug). Note the recorded wiring facts: hauska-mcp-server runs locally at `:3000`; the hauska-engine retrieval API is not deployed (`HAUSKA_BACKEND_URL=http://localhost:8080`); the MCP server uses the `X-Hauska-Key` header, not `Authorization: Bearer`.
4. [`40_design_accelerator.md`](../40_design_accelerator.md) — Cortex production target and external-services table.

## Critical sequencing note

WSA.1 is read-only and runs first. It gates WSA.2 through WSA.5: several fixes cannot be done correctly until the audit settles what each surface reads and writes. WSA.5 in particular depends on whether Code Library reads cortex-prod or the MCP server. Report WSA.1 findings before starting any fix.

## Scope

### WSA.1 — Data-source audit (read-only)

Work.

- Trace, for each of these four surfaces, what it reads from and what it writes to: (a) the Code Library page, (b) site-context layer generation, (c) the in-app Claude chat panel, (d) the Revit add-in snapshot and IFC push path.
- For each surface name the exact endpoint, the database or service it resolves to (cortex-prod Neon, hauska-mcp-server, hauska-engine retrieval API, or a named external API), and the auth header or key used.
- Settle QA-13: does Code Library read a cortex-prod-local table, or the MCP server. If the MCP server, what product tier does the key resolve to, and does that tier filter platform-internal jurisdictions.
- Confirm whether Elgin and Bastrop County atoms exist anywhere reachable by the Cortex app.

Output. A `_research/2026-05-20_cortex_qa_wsa_data_source_audit.md` doc in legacy-design-tools, with file and line refs, a per-surface data-flow table, and a draft MD data-flow diagram of the Cortex side (cortex-api, cortex-prod, and the calls out to the MCP server and hauska-engine). This fragment hands off to the planner for the QA-05 full architecture diagram.

Test. None; research only.

### WSA.2 — Revit add-in endpoint repoint

Context. The Revit add-in "Snapshot sent" dialog shows the workbench link as `https://prompt-agent-accelerator.replit.app`, the retired Replit URL. Add-in pushes are landing on Replit-side Neon, not cortex-prod. This actively scatters QA test data across two databases and is the time-sensitive fix in this dispatch. Do WSA.2 immediately after WSA.1.

Work.

- Locate where the add-in's backend URL is configured.
- If that config lives in the `legacy-design-tools` repo, repoint it to the cortex-api Cloud Run service URL.
- If the add-in is a separate repo (revit-connector or equivalent), do not reach across repos. Flag the exact file and setting back to the planner with the value that needs changing.

Test. After repoint, a Revit add-in snapshot push creates the engagement in the Cloud Run Cortex app and the row lands in cortex-prod Neon.

### WSA.3 — IFC upload HTTP 500

Context. This is Probe 6 of the cutover runbook, deferred from the 2026-05-19 cortex-track close-out on the bet that a clean Cloud Run environment surfaces the real root cause. The IFC upload fails HTTP 500 against the post-cutover environment (observed on engagement 1324 Eagle Point_C; sheet upload succeeded, IFC failed).

Work.

- Diagnose using cortex-api Cloud Run logs (filter `severity>=ERROR` around the failing request).
- Determine root cause. Fix if it is in the legacy-design-tools repo.
- If the root cause is environment-independent and out of repo scope, file it with verbatim Cloud Run log evidence and report back. Per the cutover runbook a still-failing Probe 6 does not block the cutover; the import path was already broken pre-cutover.

Test. IFC re-ingest succeeds, or the failure is filed with verbatim Cloud Run log output and a named root cause.

### WSA.4 — Site context layer failures

Context. QA-03 and the site portion of QA-08. Observed failures vary by run: EPA EJScreen (fetch failed after 3 attempts), FCC broadband (cancelled by caller during attempt 1), ugrc:dem (ArcGIS error 400 invalid URL), grand-county-ut:parcels and grand-county-ut:zoning (cancelled by caller during attempt 2). Map view does not load on some engagements; the site 3D view renders nothing.

Work.

- Separate genuine external-API flakiness from a client-side cancellation or timeout bug. The repeated "cancelled by the caller" messages suggest aborted requests (timeout too short, or an unmounting component aborting in-flight fetches), not a remote outage.
- Fix the ugrc:dem ArcGIS 400. An invalid URL is a constructed-URL bug, almost certainly in-repo and fixable.
- Diagnose why map view fails to load on some engagements and why the site 3D view is blank. Check whether the site 3D is a regression against prior site-3D work or unfinished scope.

Test. Site context layers succeed on a Grand County engagement, or each remaining failure is attributed to a named external-API cause with evidence.

### WSA.5 — Code Library warmup and missing jurisdictions

Context. QA-13. Warmup fails HTTP 403 with `codes_warmup_requires_internal`. Elgin is absent from Code Library entirely despite being onboarded in Sync 4.5 (210 atoms, platform-internal). Bastrop County (17 atoms, platform-internal) is also absent.

Work.

- Resolution depends on WSA.1. If the warmup endpoint requires an internal service key the Cortex app is not sending, wire the correct key and header. The hauska-mcp-server uses the `X-Hauska-Key` header, not `Authorization: Bearer`; a wrong header silently falls through to public tier.
- Restore Elgin and Bastrop County visibility per whatever WSA.1 determines the correct data path to be.

Test. Warmup completes without 403; Elgin and Bastrop County appear in Code Library with their expected atom counts.

## Dependencies

- WSA.1 gates WSA.2 through WSA.5. Report WSA.1 findings before starting fixes.
- WSA.2 is the most time-sensitive fix (data scatter). Do it immediately after WSA.1.
- WSA.3 closes the cutover-runbook Probe 6.
- Parallel-safe with WS-B (UI cleanup) if that is dispatched concurrently; confirm no code-path overlap at WSA.1.

## Hand-off

Session summary documents all five sub-tasks with explicit fixed, filed, or flagged state per item. The WSA.1 audit doc and its data-flow diagram fragment hand off to the planner for the QA-05 full architecture diagram. Any cross-repo items, notably a separate-repo Revit add-in, flag back to the planner rather than being actioned in this dispatch.
