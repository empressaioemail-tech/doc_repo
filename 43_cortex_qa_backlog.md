---
id: 43_cortex_qa_backlog
title: Cortex QA backlog — post-cutover verification window
status: active
last_updated: 2026-05-21
applies_to: design-accelerator
related: [00_current_state, 40_design_accelerator, 42_design_accelerator_program_plan, 41_advanced_capture_features, 49_code_ingestion_pipeline, 90_runbooks/legacy_design_tools_replit_to_cloud_run_cutover]
---

# Cortex QA backlog

> Running QA backlog for Cortex. Operator reports items; planner triages into workstreams and tracks to closure. New items append as QA-27 and up.

## Purpose

The Replit to Cloud Run cutover landed 2026-05-20: cortex-api runs on Cloud Run against cortex-prod Neon, the Replit data dependency severed, per the [cutover runbook](90_runbooks/legacy_design_tools_replit_to_cloud_run_cutover.md) Stage 9. With the platform stable, operator-driven QA is unblocked. This doc is Stage 5 of that runbook in practice: the verification-window backlog.

Item IDs are QA-NN, assigned in report order and never reused. The first 14 entries were captured in a single operator QA pass on 2026-05-20. QA-17 through QA-26 came from a second operator pass plus the cc-agent-C reconciliation on 2026-05-21. New items append as QA-27 and up.

## Item register

| ID | Item | Type | Workstream | Status |
|---|---|---|---|---|
| QA-01 | Engagement-detail tabs are crowded (ten tabs). Reorganize, and move the model "View in 3D" into its own tab. | UX | WS-B | Fixed (PR #55) |
| QA-02 | Projects cannot be archived. Left sidebar sections should expand and collapse. | Feature (small) | WS-B | Fixed (PR #55) |
| QA-03 | Site context layers fail intermittently (varies which layer and when; observed EPA EJScreen, FCC broadband). Site 3D view renders nothing. | Bug | WS-A | ugrc:dem fixed (PR #55); rest diagnosed |
| QA-04 | Revit add-in: IFC upload fails HTTP 500, and the new engagement did not reach the Cloud Run Cortex app. | Bug | WS-A | Part 1 done (add-in repointed, merged). Part 2: 3 of 4 layers fixed (cortex-prod schema migration; PR #57; PR #58); 4th layer architectural — **OPEN, gated on QA-16** |
| QA-05 | No architecture diagram of which MCP servers run what, how they relate to the database, and how they consume the Hauska SDK. | Doc | WS-D | Delivered — doc 44 |
| QA-06 | Productize turning a custom plan set into a publisher-ready plan set. Also scope what Claude operating the Revit platform would take. | Strategy | WS-E | Gated |
| QA-07 | No way to select sheets to send to chat (checkbox on thumbnail). Want the in-app agent to read sheets and platform state directly. | Feature | WS-C | Fixed (WS-C, PR #56 merged) |
| QA-08 | Grand County site data will not populate; map view fails on some engagements; site 3D fails; surrounding buildings and topo missing. Want the house model rendered on the site, and a self-run code review shown in the center frame and converted to a task list. | Bug + Feature | WS-A + WS-C | Site diagnosed (PR #55); WS-C fixed (PR #56 merged) |
| QA-09 | Detail-callout and product-spec tabs: intent unclear. Candidate to become an AI-driven function rather than manual forms. | Question | WS-C | Fixed (WS-C, PR #56 merged) — agent AI-populates the L4/L5 forms, draft-only |
| QA-10 | Add Hutto, TX as the next code-ingestion target (growth surge expected). | Strategy/catalog | WS-E | Done — Hutto UDC ingested + loaded (hauska-engine PR #15); eCode360 general code routed to partnership track |
| QA-11 | Deliverable-letters page is glitchy and unusable. Self-run code reviews should be pushable to a response task and from chat. | Bug + Feature | WS-B + WS-C | Fixed: page (PR #55); WS-C fixed (PR #56 merged) |
| QA-12 | Snapshots tab: hide the raw JSON block, move the 3D model higher, make the tab more actionable. | UX | WS-B | Fixed (PR #55) |
| QA-13 | Code Library warmup fails (HTTP 403, codes_warmup_requires_internal). Elgin absent entirely. Open whether Code Library reflects the MCP server or an old database. | Bug | WS-A | Diagnosed: by-design, not a wiring bug |
| QA-14 | Header alert bell is non-functional. | UX | WS-B | Fixed (PR #55) |
| QA-15 | plan-review header bell stopped rendering after WSB.5 made the shared Header notifications prop-driven. plan-review must opt into `headerNotifications`, or the bell stays removed. | UX | WS-B follow-on | Logged |
| QA-16 | IFC parse runs inline on the api-server Node main thread behind a non-reentrant `IfcAPI` singleton; a hung or trapped parse wedges the whole cortex-api instance. Isolate the parse in a worker. | Bug + architecture | WS-A follow-on | PR #59 merged 2026-05-21 (one-shot worker_threads isolation). QA-04 still gated: the canary deploy + traffic shift are operator-supervised |
| QA-17 | Code Library lists only 2 of 5 ingested jurisdictions (Grand County UT, Bastrop TX); Bastrop County, Elgin, Hutto absent. | Bug / architecture | WS-F | Dispatched 2026-05-21: framework-proving pass (Code Library reads substrate), cc-agent-AC |
| QA-18 | No path to upload client PDFs, photos, and notes to an engagement for the in-app agent to reference. | Feature | WS-F | PR #62 merged 2026-05-21 — rebased onto main, conflicts resolved, CI green (design-tools 326/326, run 26261220824). cc-agent-C completed the `CitationChip.test.tsx` `useEngagementsStore` mock with all 5 QA-18 store members (3 record slices + `loadAttachedDocuments`/`uploadAttachedDocument`) |
| QA-19 | In-app chat does not auto-scroll while the AI streams a response. | Bug (UX) | WS-F | PR #61 merged 2026-05-21 |
| QA-20 | Engagements outside an ingested jurisdiction should trigger best-effort background code collection. | Feature (engine/substrate) | WS-F | Routed 2026-05-21 to cc-agent-E Lane E: an engine/substrate feature that pairs with Phase E1 (ADR-019 + the ICC ingest); folds into E1 when ICC access unblocks |
| QA-21 | Net-new SoftPlan and ArchiCAD connectors. Operator-flagged off current roadmap. | Strategy / new workstream | WS-F | Routed: strategic session (premortem, catalog-thesis-check, focus-queue). BD asset logged: ~7,000-member SoftPlan/ArchiCAD designer Facebook group as a distribution channel, per [`18_stakeholder_graph.md`](18_stakeholder_graph.md) |
| QA-22 | Site-context layers still failing post-WSA.4; focused session requested, then a Bastrop SmartCity dashboard install. | Bug + strategy | WS-F | Part 1 (site-context reliability) dispatched to cc-agent-C 2026-05-21, gated behind the Cortex QA close-out merge. Part 2 (SmartCity dashboard install) is an M-PropIntel input, a separate strategic call |
| QA-23 | In-app agent presents ungrounded code as confident citations for jurisdictions it has no atoms for (Pagosa Springs / Daulton)CO). | Bug (quality gate) | WS-F | PR #60 merged 2026-05-21 |
| QA-24 | Stale second Cloud Run service `api-server` (Phase 1A, last deployed 2026-05-06) still in `legacy-design-tools-prod`. | Ops cleanup | WS-F | Logged: decommission candidate |
| QA-25 | Orphaned empty `EMPRESSA_DATABASE_URL` secret, superseded and unused. | Ops cleanup | WS-F | Logged: cleanup candidate |
| QA-26 | `legacy-design-tools` has `core.autocrlf=true` and no root `.gitattributes`; recurring phantom diffs and empty stashes. | Ops cleanup | WS-F | Logged: add root `.gitattributes` |

## Workstreams

### WS-A. Cutover-tail data integrity

Items QA-03, QA-04, QA-08 (site-data portion), QA-13. The four share one root question: is the post-cutover environment correctly wired for auth headers, data source, and external-API connectivity. Sequenced audit-first. A read-only data-source audit settles what each surface reads and writes, then the fixes follow. Nothing gates WS-A, and it gates trust in the Code Library and site data, so it runs first. Dispatched to cc-agent-C 2026-05-20 per [`_dispatches/2026-05-20_cc-agent-C_cortex_qa_wsa_audit.md`](_dispatches/2026-05-20_cc-agent-C_cortex_qa_wsa_audit.md).

Status 2026-05-20: WS-A merged via legacy-design-tools PR #55. Outcomes per the WSA.1 audit (`legacy-design-tools/_research/2026-05-20_cortex_qa_wsa_data_source_audit.md`):

- WSA.1: cortex-api is self-contained for all four audited surfaces. The MCP integration is inbound and one-directional only (hauska-mcp-server calls cortex-api's L-surface over a SERVICE_API_KEY bearer); cortex-api makes no outbound call to the MCP server or hauska-engine. The earlier "zero MCP integration" headline was the stale-checkout error and is corrected.
- WSA.2 (Revit add-in repoint): DONE 2026-05-21. The `legacy-revit-sensor` add-in was repointed off the retired Replit URL to cortex-api; the per-workstation `ReplitUrl` setting was renamed to `BackendUrl` with a cortex-api default and a migration guard that drops stored Replit values; the snapshot-secret pairing was verified matching. Part 1 committed and merged. The data-scatter risk is closed. The IFC 500 (WSA.3) is QA-04 Part 2, dispatched to cc-agent-C.
- WSA.3 (IFC 500): diagnosed 2026-05-21. The earlier GCS object-storage-write hypothesis is superseded. The failure is four bugs stacked: (1) cortex-prod was never migrated past roughly migration 0008, so `ingestSnapshotIfc`'s `snapshot_ifc_files` query threw an uncaught 500 — fixed by applying drizzle migrations 0009-0014 plus `track-b-ifc-ingest.sql` to cortex-prod, which also un-broke the L-surface (response-tasks, detail-callouts, product-specs, deliverable-letters had silently been dark on cortex-prod); (2) web-ifc's Node entry was resolved via a non-exported subpath — fixed in PR #57 (merged); (3) web-ifc WASM init exceeds the 2 GiB container limit — fixed in PR #58 (Cloud Run memory raised to 8 GiB, merged); (4) the IFC parse runs inline on the Node main thread behind a non-reentrant `IfcAPI` singleton, so a hung or trapped parse wedges the whole instance — unresolved, architectural, filed as QA-16. QA-04 stays open, gated on QA-16. See [`_sessions/2026-05-21_qa04_ifc_500_cc-agent-C.md`](_sessions/2026-05-21_qa04_ifc_500_cc-agent-C.md).
- WSA.4 (site context): the ugrc:dem ArcGIS 400 was a constructed-URL bug, fixed in PR #55. The EPA, FCC, and Grand County "cancelled by the caller" failures are the 15-second server-side adapter-runner timeout firing on slow upstreams, not a wiring bug.
- WSA.5 (Code Library): the warmup 403 and the missing jurisdictions are by-design and architecture-level, not wiring bugs. See QA-13 and the standing findings.

### WS-A follow-on. QA-16 — isolate the IFC parse

QA-04 Part 2 closed three of four IFC-failure layers this session (cortex-prod schema migration, PR #57, PR #58) and surfaced the fourth as architectural. The IFC ingest parse (`web-ifc`, `lib/ifcParser`) runs inline on the api-server Node main thread behind a process-global non-reentrant `IfcAPI` singleton with no reset path. web-ifc's WASM traps on malformed input and leaves the singleton corrupt; a parse that hangs blocks the entire event loop, so the cortex-api instance stops answering everything, healthz included. This was observed live 2026-05-21: a malformed-IFC probe on the fixed canary revision wedged the instance, and a traffic shift onto that revision briefly took cortex-api unresponsive before a rollback to `cortex-api-00011-xut` restored production within minutes.

QA-16 moves the parse into a `worker_threads` worker (the `ifcParser` module already flags this as its intended upgrade) or a separate Cloud Run service, so a crash, hang, or OOM kills only the worker and each parse gets a fresh WASM context. Fold in the lighter robustness follow-ups: wrap the unguarded `await db.*` calls in `ingestSnapshotIfc` and `lookupSnapshotForIfc` so a DB error returns the route's clean `db_error` JSON instead of an opaque HTML 500 (the cause of Layer 1's opacity). QA-16 is the gate before IFC ingest can take production traffic and the gate before QA-04 can close: the revision carrying PRs #57 + #58 + the worker isolation deploys as a canary, a real Revit IFC must return `201` against it, then traffic shifts. A revision with a live, un-isolated IFC parse path must not take production traffic. See [`_sessions/2026-05-21_qa04_ifc_500_cc-agent-C.md`](_sessions/2026-05-21_qa04_ifc_500_cc-agent-C.md).

### WS-B. UI and UX cleanup

Items QA-01, QA-02, QA-11 (letter-page glitch portion), QA-12, QA-14. Low-risk, independent UI cleanup. Dispatched to cc-agent-C 2026-05-20 per [`_dispatches/2026-05-20_cc-agent-C_cortex_qa_wsb_ui_cleanup.md`](_dispatches/2026-05-20_cc-agent-C_cortex_qa_wsb_ui_cleanup.md), sequenced as cc-agent-C's next dispatch after WS-A since cc-agent-C is a single Cursor terminal. The EngagementDetail split that QA-01 and QA-12 build on already merged (legacy-design-tools PR #43); WS-B is post-split follow-on, not a fold-in.

Status 2026-05-20: WS-B merged via legacy-design-tools PR #55, all five sub-tasks fixed. WSB.1 grouped the tab row into five visual sections (Model and source, Site, Review, Deliverables, Config) and added the model-3d tab. WSB.4 root cause was a transformed `.sc-card` ancestor capturing the fixed-position modal as its containing block, fixed by portaling the modal to body. PR CI caught one regression (the snapshots BIM viewer was hidden once WSB.3 gated the BIM panel on having a snapshot; fixed in commit `d7d5e9b` to show it whenever BIM elements exist) and the PR merged green. WSB.5 surfaced QA-15.

### WS-C. In-app agent: write-back and platform awareness

Items QA-07, QA-08 (review-to-taskboard portion), QA-09, QA-11 (push-to-response-task portion). One coherent gap: the in-app Cortex chat panel reads the BIM model but not the rest of the platform, and cannot write anything back.

Scoped 2026-05-20 against docs 28 and 42: this is a bounded sprint, not the roadmap-scale retrofit the earlier framing implied. The Cortex MCP tool surface already shipped in the combined Cortex/Codex sprint (31 Cortex tools on hauska-mcp-server, the full L1-L6 atom and endpoint set). WS-C wires the one surface that never got connected: the in-app chat (`chat.ts`), which calls Anthropic with no tool use. All four items collapse to adding Anthropic tool-use to `chat.ts`, wired to cortex-api's own L-surface and read endpoints (the in-app chat is inside cortex-api and does not route through the MCP server). Dispatched to cc-agent-C 2026-05-20 per [`_dispatches/2026-05-20_cc-agent-C_cortex_qa_wsc_in_app_agent.md`](_dispatches/2026-05-20_cc-agent-C_cortex_qa_wsc_in_app_agent.md). Operator decisions: direct-write (agent writes persist immediately, must be reversible and visible); one sprint covering all four items. Pre-mortem cleared green, with the quality-gate guardrails (agent-created atoms carry source attribution, timestamp, AI-origin marker; every write reversible; agent-action log) as a hard dispatch requirement (WSC.5). doc 42 gains a WS-C stream entry at session close.

Status 2026-05-21: WS-C complete (cc-agent-C; legacy-design-tools, PR #56 merged). `chat.ts` converted to a bounded Anthropic tool-use agentic loop (12 tools, capped at 8 iterations) wired to cortex-api's own tables in-process, never through the MCP server. WSC.5 resolved cleanly: L4/L5 spec creation is draft-only (the agent pre-fills the existing manual forms, the operator saves), so there is no irreversible agent spec-write and the confirm-step exception was designed out, not skipped; response-task writes are direct and reversible via the L1 cancelled state, with a session agent-action log. typecheck green across all six artifacts; CI runs the vitest suites.

### WS-D. Architecture documentation

Item QA-05. Planner deliverable: an MD diagram covering cortex-api, cortex-prod Neon, hauska-mcp-server, the hauska-engine retrieval API, and how each consumes the atom contract versus the Hauska SDK. Assembled from cc-agent-C's WSA.1 audit output plus cc-agent-M input. WSA.1 feeds it.

Status 2026-05-20: delivered. cc-agent-M produced the hauska-mcp-server side and cc-agent-C's WSA.1 audit the Cortex side; the planner synthesized both into [`44_mcp_cortex_architecture_map.md`](44_mcp_cortex_architecture_map.md). One follow-up: `50_hauska_mcp_server.md` is stale on the tool surface (slash namespace, "14 tools") and needs a corrective edit.

### WS-E. Strategy and catalog

Items QA-06, QA-10. Not QA bugs; each gets its own conversation.

QA-06 routes to [`41_advanced_capture_features.md`](41_advanced_capture_features.md), where rendering is descoped, and the operator framed plan-set publishing as pairing with rendering work. It carries a catalog-thesis-check gate before any commitment because it raises product-line placement questions: whether publisher-ready plan export is an Empressa product surface, and whether "Claude operates Revit" sits in the Hauska or Empressa layer.

QA-10 resolved 2026-05-20. Pre-mortem cleared green (all load-bearing commitments clear; one operational yellow on focus-queue, operator-acknowledged). The operator chose a prioritized one-off Hutto ingest ahead of the deferred Sync 5, over the planner's queue-with-Sync-5 recommendation. Decision record at [`_decisions/2026-05-20_hutto_tx_prioritized_ingest.md`](_decisions/2026-05-20_hutto_tx_prioritized_ingest.md); dispatched to cc-agent-E per [`_dispatches/2026-05-20_cc-agent-E_hutto_tx_ingest.md`](_dispatches/2026-05-20_cc-agent-E_hutto_tx_ingest.md). The decision is provisional pending platform verification: if Hutto publishes on eCode360 rather than Municode, the one-off ingest re-routes to a bizops partnership-API track (the Smithville pattern). Sylvia partnership outreach to Hutto runs in parallel as operator-paced bizops. Tracked against [`49_code_ingestion_pipeline.md`](49_code_ingestion_pipeline.md).

Update 2026-05-21: HUTTO.1 found a split. Hutto's general Code of Ordinances is on eCode360 (access-blocked), but the Unified Development Code is a free born-digital PDF. The operator reshaped: the UDC ingested via the raw-PDF path (1716 code-section atoms, eval 1.0 / 1.0 / 1.0, declared loaded, hauska-engine PR #15), and the eCode360 general code routes to the bizops General Code partnership track. The decision record is now active, scope narrowed to the UDC. QA-10 is closed for the UDC; the general code is a partnership-track item. cc-agent-E's session summary also surfaced two strategic threads (a layered code substrate and an ICC commercial-layer pitch) routed to a dedicated strategic session.

### WS-F. Second operator pass (2026-05-21)

A second operator QA pass on 2026-05-21 produced QA-17 through QA-23; the cc-agent-C reconciliation the same day added QA-24 through QA-26 as ops cleanup. Confirmed working this pass: snapshot and sheet ingest (the Daulton)CO engagement pushed 16 sheets clean), the in-app chat agent parsing a pasted client email thread into a structured task list, the Code Library render, and the engagement-detail tabs.

QA-17, QA-20, and QA-23 share one root cause: the Cortex app is not wired to the Hauska substrate. QA-17 is the Code Library showing 2 of 5 ingested jurisdictions, QA-20 wants best-effort background code collection for uningested jurisdictions, and QA-23 is the in-app agent presenting ungrounded code as a confident citation (it cited fabricated "Grand County, Colorado" codes for the Pagosa Springs Daulton)CO engagement). All three resolve through the Cortex MCP retrofit per [`28_mcp_first_product_design.md`](28_mcp_first_product_design.md). The scoping decision, whether to pull the retrofit forward into this QA round or hold it as a roadmap line, is taken in the roadmap scrub. QA-23 is load-bearing on the quality-gate rule and ships regardless: until coverage is real, the agent flags jurisdiction coverage and confidence rather than fabricating.

QA-19 (chat auto-scroll) is a quick frontend fix for the QA-fix round. QA-18 (client PDF, photo, and note upload) is a moderate Cortex feature that reuses the L2 attached-document atom shape already in the engine registry; the build is upload UI, blob storage, and wiring the in-app chat to read attachments.

QA-21 (SoftPlan and ArchiCAD connectors) is an operator-flagged off-roadmap workstream. It does not enter the QA-fix round. It routes to a strategic session carrying premortem-check, a catalog-thesis-check for brand and layer placement, and the focus-queue rule naming what is displaced. A distribution-channel BD asset is logged against it: the operator holds a relationship with the owner of a ~7,000-member Facebook group of architects and home designers who use SoftPlan and ArchiCAD, the exact ICP for these connectors. It is recorded under Distribution channels in [`18_stakeholder_graph.md`](18_stakeholder_graph.md); it does not change QA-21's routing or its catalog-thesis-check gate.

QA-22 splits. The site-context layers still fail after the WSA.4 timeout diagnosis; that is a focused engineering session, not a fold-in. The attached goal of installing the site-context capability into Bastrop's SmartCity OS dashboard is a separate cross-product decision needing its own catalog-thesis-check and premortem. Fix first, install decision second.

QA-24, QA-25, and QA-26 are ops cleanup from the cc-agent-C reconciliation: a stale `api-server` Cloud Run service in `legacy-design-tools-prod`, an orphaned `EMPRESSA_DATABASE_URL` secret, and the missing root `.gitattributes`.

Incoming dependency: the operator has an appointment for ICC API access and will ingest the full ICC model-code corpus. That unblocks Lane E Phase E1 (the Layer 1 model-code base) and pairs with QA-20. Tracked in [`73_partnerships.md`](73_partnerships.md).

### Execution order

WS-A and WS-B merged via legacy-design-tools PR #55. WS-D is delivered as [`44_mcp_cortex_architecture_map.md`](44_mcp_cortex_architecture_map.md). WS-C is complete (cc-agent-C; PR #56 merged). WS-E: QA-10's Hutto UDC ingest is done (hauska-engine PR #15), with the eCode360 general code routed to a partnership track; QA-06 let-ride to doc 41. Every first-pass QA item (QA-01 through QA-16) is delivered, merged, complete, or routed except QA-04: its Part 2 IFC fixes are landed (PRs #57 and #58 merged, the cortex-prod schema migration applied), but QA-04 stays open behind QA-16, the WS-A follow-on that isolates the IFC parse before IFC ingest can take production traffic. The second operator pass (QA-17 through QA-26) is the open WS-F backlog, triaged above and feeding the roadmap scrub.

## Standing findings

Three calls already supported by the QA evidence, recorded so they are not re-derived.

Finding 1. The Revit add-in is still pointed at Replit. The "Snapshot sent" dialog shows the workbench link as the retired `prompt-agent-accelerator.replit.app`. Sheets and the new engagement pushed to Replit-side Neon, which is why they did not appear in the Cloud Run Cortex app. Every add-in push during QA scatters test data across two databases. Repointing the add-in backend URL to cortex-api is the time-sensitive item inside WS-A. Update 2026-05-21: resolved. The `legacy-revit-sensor` add-in was repointed to cortex-api (Part 1 of QA-04, merged): the `ReplitUrl` setting renamed to `BackendUrl` with a cortex-api default and a migration guard that drops stored Replit values, and the snapshot-secret pairing verified matching. The data-scatter risk is closed. The IFC upload 500 (QA-04 Part 2) is now diagnosed as a four-layer failure: three layers fixed (cortex-prod schema migration, PR #57, PR #58), the fourth — an inline main-thread IFC parse that wedges the instance — filed as QA-16. QA-04 stays open, gated on QA-16.

Finding 2. Resolved by the WSA.1 audit. The Code Library reads cortex-prod-local tables (`code_atoms`, `code_atom_sources`, `code_atom_fetch_queue`) directly via `@workspace/db`. It does not call the MCP server or the Hauska substrate at all, so the original "MCP server versus old database" question resolves to: a cortex-prod-local corpus, never connected to the substrate. Grand County showing 290 atoms matching the substrate corpus is coincidental. Elgin and Bastrop County are absent because the Code Library's jurisdiction registry contains only `grand_county_ut` and `bastrop_tx` (City of Bastrop), and no Cortex-side ingest exists for them; their Sync 4.5 atoms live only in the Hauska substrate, which the Cortex app has no path to. Connecting the Code Library to the substrate is the Cortex MCP retrofit, a roadmap item per [`28_mcp_first_product_design.md`](28_mcp_first_product_design.md), not a cutover-tail bug. The warmup 403 is a separate, by-design failure: the production session auth stub never grants `audience: internal`, so the "Warm up now" button is structurally dead on Cloud Run.

Finding 3. QA-07, the QA-08 review portion, QA-09, and the QA-11 push portion are one gap, not four. The in-app chat works (it produced full code reviews, so the cutover-close Anthropic-key issue is resolved), but it is read-only. It reported directly that it cannot create tasks or write back. All four items are the same need: give the in-app agent platform read scope and write-back. Scoped as WS-C 2026-05-20: the wiring goes into the in-app chat route (`chat.ts`) against cortex-api's own L-surface endpoints, not through the MCP server, which serves external agents.

## Cross-references

- [`90_runbooks/legacy_design_tools_replit_to_cloud_run_cutover.md`](90_runbooks/legacy_design_tools_replit_to_cloud_run_cutover.md) — Stage 9 executed-cutover state and known issues. WS-A closes its Probe 6.
- [`_dispatches/2026-05-20_cc-agent-C_cortex_qa_wsa_audit.md`](_dispatches/2026-05-20_cc-agent-C_cortex_qa_wsa_audit.md) — WS-A dispatch.
- [`_dispatches/2026-05-20_cc-agent-C_cortex_qa_wsb_ui_cleanup.md`](_dispatches/2026-05-20_cc-agent-C_cortex_qa_wsb_ui_cleanup.md) — WS-B dispatch.
- [`_dispatches/2026-05-20_cc-agent-M_architecture_map_input.md`](_dispatches/2026-05-20_cc-agent-M_architecture_map_input.md) — QA-05 architecture-map input (hauska-mcp-server side).
- [`44_mcp_cortex_architecture_map.md`](44_mcp_cortex_architecture_map.md) — QA-05 deliverable: the assembled MCP and Cortex architecture map.
- [`_dispatches/2026-05-20_cc-agent-C_cortex_qa_wsc_in_app_agent.md`](_dispatches/2026-05-20_cc-agent-C_cortex_qa_wsc_in_app_agent.md) — WS-C dispatch.
- [`_decisions/2026-05-20_hutto_tx_prioritized_ingest.md`](_decisions/2026-05-20_hutto_tx_prioritized_ingest.md) — QA-10 decision: prioritized Hutto TX ingest.
- [`_dispatches/2026-05-20_cc-agent-E_hutto_tx_ingest.md`](_dispatches/2026-05-20_cc-agent-E_hutto_tx_ingest.md) — QA-10 dispatch: Hutto TX ingestion.
- [`_sessions/2026-05-21_qa04_ifc_500_cc-agent-C.md`](_sessions/2026-05-21_qa04_ifc_500_cc-agent-C.md) — QA-04 Part 2 IFC-upload diagnosis, three-layer fix, and QA-16 handoff.
- [`40_design_accelerator.md`](40_design_accelerator.md) — Cortex production target.
- [`42_design_accelerator_program_plan.md`](42_design_accelerator_program_plan.md) — program plan this backlog feeds.
- [`00_current_state.md`](00_current_state.md) — portfolio snapshot.
