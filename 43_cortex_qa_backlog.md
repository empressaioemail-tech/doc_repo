---
id: 43_cortex_qa_backlog
title: Cortex QA backlog — post-cutover verification window
status: active
last_updated: 2026-05-20
applies_to: design-accelerator
related: [00_current_state, 40_design_accelerator, 42_design_accelerator_program_plan, 41_advanced_capture_features, 49_code_ingestion_pipeline, 90_runbooks/legacy_design_tools_replit_to_cloud_run_cutover]
---

# Cortex QA backlog

> Running QA backlog for Cortex. Operator reports items; planner triages into workstreams and tracks to closure. New items append as QA-15 and up.

## Purpose

The Replit to Cloud Run cutover landed 2026-05-20: cortex-api runs on Cloud Run against cortex-prod Neon, the Replit data dependency severed, per the [cutover runbook](90_runbooks/legacy_design_tools_replit_to_cloud_run_cutover.md) Stage 9. With the platform stable, operator-driven QA is unblocked. This doc is Stage 5 of that runbook in practice: the verification-window backlog.

Item IDs are QA-NN, assigned in report order and never reused. The first 14 entries were captured in a single operator QA pass on 2026-05-20.

## Item register

| ID | Item | Type | Workstream | Status |
|---|---|---|---|---|
| QA-01 | Engagement-detail tabs are crowded (ten tabs). Reorganize, and move the model "View in 3D" into its own tab. | UX | WS-B | Fixed (PR #55) |
| QA-02 | Projects cannot be archived. Left sidebar sections should expand and collapse. | Feature (small) | WS-B | Fixed (PR #55) |
| QA-03 | Site context layers fail intermittently (varies which layer and when; observed EPA EJScreen, FCC broadband). Site 3D view renders nothing. | Bug | WS-A | ugrc:dem fixed (PR #55); rest diagnosed |
| QA-04 | Revit add-in: IFC upload fails HTTP 500, and the new engagement did not reach the Cloud Run Cortex app. | Bug | WS-A | Open: IFC 500 filed; add-in repoint flagged |
| QA-05 | No architecture diagram of which MCP servers run what, how they relate to the database, and how they consume the Hauska SDK. | Doc | WS-D | Delivered — doc 44 |
| QA-06 | Productize turning a custom plan set into a publisher-ready plan set. Also scope what Claude operating the Revit platform would take. | Strategy | WS-E | Gated |
| QA-07 | No way to select sheets to send to chat (checkbox on thumbnail). Want the in-app agent to read sheets and platform state directly. | Feature | WS-C | Open |
| QA-08 | Grand County site data will not populate; map view fails on some engagements; site 3D fails; surrounding buildings and topo missing. Want the house model rendered on the site, and a self-run code review shown in the center frame and converted to a task list. | Bug + Feature | WS-A + WS-C | Site diagnosed (PR #55); WS-C open |
| QA-09 | Detail-callout and product-spec tabs: intent unclear. Candidate to become an AI-driven function rather than manual forms. | Question | WS-C | Open |
| QA-10 | Add Hutto, TX as the next code-ingestion target (growth surge expected). | Strategy/catalog | WS-E | Gated |
| QA-11 | Deliverable-letters page is glitchy and unusable. Self-run code reviews should be pushable to a response task and from chat. | Bug + Feature | WS-B + WS-C | Fixed: page (PR #55); WS-C open |
| QA-12 | Snapshots tab: hide the raw JSON block, move the 3D model higher, make the tab more actionable. | UX | WS-B | Fixed (PR #55) |
| QA-13 | Code Library warmup fails (HTTP 403, codes_warmup_requires_internal). Elgin absent entirely. Open whether Code Library reflects the MCP server or an old database. | Bug | WS-A | Diagnosed: by-design, not a wiring bug |
| QA-14 | Header alert bell is non-functional. | UX | WS-B | Fixed (PR #55) |
| QA-15 | plan-review header bell stopped rendering after WSB.5 made the shared Header notifications prop-driven. plan-review must opt into `headerNotifications`, or the bell stays removed. | UX | WS-B follow-on | Logged |

## Workstreams

### WS-A. Cutover-tail data integrity

Items QA-03, QA-04, QA-08 (site-data portion), QA-13. The four share one root question: is the post-cutover environment correctly wired for auth headers, data source, and external-API connectivity. Sequenced audit-first. A read-only data-source audit settles what each surface reads and writes, then the fixes follow. Nothing gates WS-A, and it gates trust in the Code Library and site data, so it runs first. Dispatched to cc-agent-C 2026-05-20 per [`_dispatches/2026-05-20_cc-agent-C_cortex_qa_wsa_audit.md`](_dispatches/2026-05-20_cc-agent-C_cortex_qa_wsa_audit.md).

Status 2026-05-20: WS-A merged via legacy-design-tools PR #55. Outcomes per the WSA.1 audit (`legacy-design-tools/_research/2026-05-20_cortex_qa_wsa_data_source_audit.md`):

- WSA.1: cortex-api is self-contained for all four audited surfaces. The MCP integration is inbound and one-directional only (hauska-mcp-server calls cortex-api's L-surface over a SERVICE_API_KEY bearer); cortex-api makes no outbound call to the MCP server or hauska-engine. The earlier "zero MCP integration" headline was the stale-checkout error and is corrected.
- WSA.2 (Revit add-in repoint): flagged, not fixed. The backend URL is the per-workstation `ReplitUrl` setting in the separate `legacy-revit-sensor` C# repo. Finding 1's data-scatter risk stays live until that is changed.
- WSA.3 (IFC 500): filed. Root-cause hypothesis is the GCS object-storage write branch of `ingestSnapshotIfc`; Cloud Run log retrieval was blocked. QA-04 stays open.
- WSA.4 (site context): the ugrc:dem ArcGIS 400 was a constructed-URL bug, fixed in PR #55. The EPA, FCC, and Grand County "cancelled by the caller" failures are the 15-second server-side adapter-runner timeout firing on slow upstreams, not a wiring bug.
- WSA.5 (Code Library): the warmup 403 and the missing jurisdictions are by-design and architecture-level, not wiring bugs. See QA-13 and the standing findings.

### WS-B. UI and UX cleanup

Items QA-01, QA-02, QA-11 (letter-page glitch portion), QA-12, QA-14. Low-risk, independent UI cleanup. Dispatched to cc-agent-C 2026-05-20 per [`_dispatches/2026-05-20_cc-agent-C_cortex_qa_wsb_ui_cleanup.md`](_dispatches/2026-05-20_cc-agent-C_cortex_qa_wsb_ui_cleanup.md), sequenced as cc-agent-C's next dispatch after WS-A since cc-agent-C is a single Cursor terminal. The EngagementDetail split that QA-01 and QA-12 build on already merged (legacy-design-tools PR #43); WS-B is post-split follow-on, not a fold-in.

Status 2026-05-20: WS-B merged via legacy-design-tools PR #55, all five sub-tasks fixed. WSB.1 grouped the tab row into five visual sections (Model and source, Site, Review, Deliverables, Config) and added the model-3d tab. WSB.4 root cause was a transformed `.sc-card` ancestor capturing the fixed-position modal as its containing block, fixed by portaling the modal to body. PR CI caught one regression (the snapshots BIM viewer was hidden once WSB.3 gated the BIM panel on having a snapshot; fixed in commit `d7d5e9b` to show it whenever BIM elements exist) and the PR merged green. WSB.5 surfaced QA-15.

### WS-C. In-app agent: write-back and platform awareness

Items QA-07, QA-08 (review-to-taskboard portion), QA-09, QA-11 (push-to-response-task portion). One coherent gap: the in-app agent reads the BIM model but not the rest of the platform, and cannot write anything back. Needs a design pass mapping the capability onto the Cortex MCP tool surface before any build. Gated on WS-D so the design knows where write-back plugs in.

### WS-D. Architecture documentation

Item QA-05. Planner deliverable: an MD diagram covering cortex-api, cortex-prod Neon, hauska-mcp-server, the hauska-engine retrieval API, and how each consumes the atom contract versus the Hauska SDK. Assembled from cc-agent-C's WSA.1 audit output plus cc-agent-M input. WSA.1 feeds it.

Status 2026-05-20: delivered. cc-agent-M produced the hauska-mcp-server side and cc-agent-C's WSA.1 audit the Cortex side; the planner synthesized both into [`44_mcp_cortex_architecture_map.md`](44_mcp_cortex_architecture_map.md). One follow-up: `50_hauska_mcp_server.md` is stale on the tool surface (slash namespace, "14 tools") and needs a corrective edit.

### WS-E. Strategy and catalog

Items QA-06, QA-10. Not QA bugs; each gets its own conversation.

QA-06 routes to [`41_advanced_capture_features.md`](41_advanced_capture_features.md), where rendering is descoped, and the operator framed plan-set publishing as pairing with rendering work. It carries a catalog-thesis-check gate before any commitment because it raises product-line placement questions: whether publisher-ready plan export is an Empressa product surface, and whether "Claude operates Revit" sits in the Hauska or Empressa layer.

QA-10 carries a premortem-check gate and routes through Sylvia per the partnership-preferred rule. It intersects the currently-deferred Sync 5 (16-plus TX cities deferred to public-launch demand), so adding Hutto is either a demand signal that justifies un-deferring Sync 5 or it queues behind it. Tracked against [`49_code_ingestion_pipeline.md`](49_code_ingestion_pipeline.md).

### Execution order

WS-A and WS-B merged via legacy-design-tools PR #55. WS-D is delivered as [`44_mcp_cortex_architecture_map.md`](44_mcp_cortex_architecture_map.md). WS-C, the in-app agent design pass, is next and is informed by doc 44; the WSA.1 audit reframes it as the Cortex MCP retrofit, net-new wiring rather than a repair. WS-E conversations are scheduled separately.

## Standing findings

Three calls already supported by the QA evidence, recorded so they are not re-derived.

Finding 1. The Revit add-in is still pointed at Replit. The "Snapshot sent" dialog shows the workbench link as the retired `prompt-agent-accelerator.replit.app`. Sheets and the new engagement pushed to Replit-side Neon, which is why they did not appear in the Cloud Run Cortex app. Every add-in push during QA scatters test data across two databases. Repointing the add-in backend URL to cortex-api is the time-sensitive item inside WS-A. Update 2026-05-20: WSA.2 located it. The backend URL is the per-workstation `ReplitUrl` setting in the separate `legacy-revit-sensor` C# repo, not in legacy-design-tools. It was flagged, not fixed; the data-scatter risk stays live until the operator updates that setting and `legacy-revit-sensor` gets a rename plus default-value fix. Tracked under QA-04.

Finding 2. Resolved by the WSA.1 audit. The Code Library reads cortex-prod-local tables (`code_atoms`, `code_atom_sources`, `code_atom_fetch_queue`) directly via `@workspace/db`. It does not call the MCP server or the Hauska substrate at all, so the original "MCP server versus old database" question resolves to: a cortex-prod-local corpus, never connected to the substrate. Grand County showing 290 atoms matching the substrate corpus is coincidental. Elgin and Bastrop County are absent because the Code Library's jurisdiction registry contains only `grand_county_ut` and `bastrop_tx` (City of Bastrop), and no Cortex-side ingest exists for them; their Sync 4.5 atoms live only in the Hauska substrate, which the Cortex app has no path to. Connecting the Code Library to the substrate is the Cortex MCP retrofit, a roadmap item per [`28_mcp_first_product_design.md`](28_mcp_first_product_design.md), not a cutover-tail bug. The warmup 403 is a separate, by-design failure: the production session auth stub never grants `audience: internal`, so the "Warm up now" button is structurally dead on Cloud Run.

Finding 3. QA-07, the QA-08 review portion, QA-09, and the QA-11 push portion are one gap, not four. The in-app chat works (it produced full code reviews, so the cutover-close Anthropic-key issue is resolved), but it is read-only. It reported directly that it cannot create tasks or write back. All four items are the same need: give the in-app agent platform read scope and write-back, wired onto the Cortex MCP tool surface.

## Cross-references

- [`90_runbooks/legacy_design_tools_replit_to_cloud_run_cutover.md`](90_runbooks/legacy_design_tools_replit_to_cloud_run_cutover.md) — Stage 9 executed-cutover state and known issues. WS-A closes its Probe 6.
- [`_dispatches/2026-05-20_cc-agent-C_cortex_qa_wsa_audit.md`](_dispatches/2026-05-20_cc-agent-C_cortex_qa_wsa_audit.md) — WS-A dispatch.
- [`_dispatches/2026-05-20_cc-agent-C_cortex_qa_wsb_ui_cleanup.md`](_dispatches/2026-05-20_cc-agent-C_cortex_qa_wsb_ui_cleanup.md) — WS-B dispatch.
- [`_dispatches/2026-05-20_cc-agent-M_architecture_map_input.md`](_dispatches/2026-05-20_cc-agent-M_architecture_map_input.md) — QA-05 architecture-map input (hauska-mcp-server side).
- [`44_mcp_cortex_architecture_map.md`](44_mcp_cortex_architecture_map.md) — QA-05 deliverable: the assembled MCP and Cortex architecture map.
- [`40_design_accelerator.md`](40_design_accelerator.md) — Cortex production target.
- [`42_design_accelerator_program_plan.md`](42_design_accelerator_program_plan.md) — program plan this backlog feeds.
- [`00_current_state.md`](00_current_state.md) — portfolio snapshot.
