---
id: 11_roadmap
title: Roadmap
status: active
last_updated: 2026-05-18
applies_to: portfolio
related: [00_current_state, 10_ground_truth, 15_replit_neon_ownership_advisory, 18_stakeholder_graph, 23_dev_setup_assessment, 27_engine_evolution_plan, 30a_smartcity_stabilization_sprint, 33_smartcity_codex_1b_integration, 42_design_accelerator_program_plan, 48_codex_program_plan, 49_code_ingestion_pipeline, 50_hauska_mcp_server, 51_substrate_v1_sprint, 60_eci_atomization, adr_013_procedure_execution_atoms, adr_015_actor_atoms, adr_017_atom_access_control, adr_018_atom_contract_substrate_layer]
---

# Roadmap

> **Working checklist + milestone view.** Edit in place. Check items off as
> they ship. Move items between tiers as priority shifts. Bump `last_updated`
> on every edit. The checklist is the operational view; the milestone
> roadmap above orients new work and shows the path to the end state.
>
> **2026-05-16 (alignment session followup):** Codex naming override resolved — Codex brand now covers plan review (1a + 1b) plus code intelligence (free Layer 1 code-lookup on Hauska MCP Server). Updates landed in 47_codex_plan_review.md, 48_codex_program_plan.md, 07_product_line_summary.md, and the 2026-05-16 strategic brainstorm session file. ADR-013 (procedure-execution atoms) scaffolded combining Q2 decision (option C) and Q5 purpose-field rider. Adjudication-record atom spec confirmed present at 27_engine_evolution_plan.md line 263 onward; the earlier "doc gap" finding was incorrect.
>
> **2026-05-16: Q4 Q5 Q6 master roadmap session.** Three new ADRs
> scaffolded (015 actor atoms, 017 atom access control), Q5 deferred
> to ADR-016 v2 candidacy. 11_roadmap extended with Active sprint
> exit criteria, Open architectural questions, Queued ADR work
> sections per master roadmap consolidation decision.
>
> **2026-05-15 changes (v3):** Catalog roadmap dialogue absorbed.
> Texas IP attorney memo added at P1 (gates non-Bastrop catalog
> ingest). Tech E&O insurance added at P3 (gated on first enterprise
> contract; mitigates new Risk 12 in [`13`](13_risk_register.md)).
> Separate legal entity for the catalog added to Open strategic
> questions. Stakeholder graph landed at
> [`18_stakeholder_graph.md`](18_stakeholder_graph.md). ECI atomization
> spec drafted at [`60_eci_atomization.md`](60_eci_atomization.md);
> own sprint queued post-51 v1 ship. ADR-013 (procedure-execution
> atoms) and ADR-014 (skill + behavior atoms, queued for Q3 v2
> activation) added to ADR queue. See dialogue thread at
> [`_sessions/2026-05-15_catalog_roadmap_input.md`](_sessions/2026-05-15_catalog_roadmap_input.md)
> through `_response_reply.md` for context.
>
> **2026-05-15 changes (v2):** Substrate v1 sprint added at P1 — combined
> Code Ingestion Pipeline + Hauska MCP Server execution plan at
> [`51_substrate_v1_sprint.md`](51_substrate_v1_sprint.md). Two new
> repos (`hauska-engine` + `hauska-mcp-server`), two parallel tracks,
> four streams per track, eight cc-agents. Supersedes the standalone
> sprint sections in 49 and 50 — those become canonical reference.
> Velocity-first; no timeframes; task-list driven.
>
> **2026-05-15 changes:** Hauska MCP Server v1 sprint added at P1
> ([`50_hauska_mcp_server.md`](50_hauska_mcp_server.md)). Operationalizes
> the "Bring-your-own-agent public API" open strategic question; that
> entry below now points at the sprint doc rather than sitting open.
> Phase 0 (revenue model + BD ownership + hosting + tool surface trim +
> logging + coupling route + key issuance) is the immediate next step.
>
> **2026-05-11 changes:** End-state framing + milestone roadmap added
> (M-Stabilize, M-PropIntel, M-CortexQA, M-CodexQA). Three new active
> sprints landed in doc_repo: `30a_smartcity_stabilization_sprint.md`
> (SmartCity OS platform-ready), `27_engine_evolution_plan.md` (Hauska
> Engine evolution + atom registry expansion + brand migration Stream G),
> `42_design_accelerator_program_plan.md` (Cortex program through GA),
> `48_codex_program_plan.md` (Codex program through GA). Cross-track stub
> at `33_smartcity_codex_1b_integration.md`. P1 reorganized so 30a heads
> the list and absorbed items reference their executing sprint. Snapshot
> doc + orientation protocol landed (`00_current_state.md`,
> `90_runbooks/current_state_protocol.md`).
>
> **2026-05-10 changes:** Codex (formerly "Plan Review Amplifier")
> launched as canonical reviewer-side product home in `47_codex_plan_review.md`.
> Living lineage thesis (`05_*`) and cities value narrative (`06_*`)
> landed. ADR-007 cross-stakeholder atom access and ADR-008 Hauska Engine
> factor-out added. Three commits: `822dd1b` initial + `48d43a7`
> housekeeping A + `eb48911` housekeeping B.
>
> **2026-05-06 changes:** Tooling setup complete on Nick box. Migration
> sprint structure decided as 3-phase split, landed as `12_migration_sprint.md`.
> Cloud Run canary deploy pattern codified.
>
> **2026-05-05 changes:** P0 docs work closed. Risk register, leading
> indicators, pricing framework extracted as `13`, `17`, `14`.

## End state

The portfolio is "ready to bring on more clients and build more on top" when three product readiness milestones are met. Beyond end state lives downstream of these gates.

| Milestone | What it means | Source |
|---|---|---|
| **M-PropIntel** | SmartCity OS has property intelligence visualization in place — Sylvia's hydrology query and analogous city-manager workflows answered against the same engine that powers DA parcel briefing. | M-Stabilize exit + property intelligence sprint (TBD scope) |
| **M-CortexQA** | Cortex (formerly Design Accelerator) is functional end-to-end on real Moab projects. Nick can structurally evaluate every output as classified atoms. Ready for heavy QA testing from real-world industry users. | [`42_*`](42_design_accelerator_program_plan.md) Phase 2 exit |
| **M-CodexQA** | Codex 1b is functional end-to-end on real submittals. Nick can structurally evaluate every output. Ready for heavy QA testing from real-world industry users. | [`48_*`](48_codex_program_plan.md) Phase 2 exit |

**Beyond end state — enabled by it, not part of it:**

- New client onboarding (Jarrell, M9, future cities)
- IoT work, cit hub, additional SmartCity OS surfaces
- Codex 1b Bastrop production activation ([`48_*`](48_codex_program_plan.md) Phase 4)
- Codex 1a invited mode + contractor firm pilot ([`48_*`](48_codex_program_plan.md) Phase 5-6)
- GA for both products ([`48_*`](48_codex_program_plan.md) Phase 7, [`42_*`](42_design_accelerator_program_plan.md) Phase 6)
- Hauska Engine factor-out to `hauska-engine` repo (ADR-008; gated on M-Stabilize Phase 2C)

## Milestone roadmap

### M-Stabilize → unblocks everything

- **Doc:** [`30a_smartcity_stabilization_sprint.md`](30a_smartcity_stabilization_sprint.md)
- **Target:** ~3-4 weeks across 4 workstreams (WS-1 migration spine, WS-2 W1 sprint, WS-3 security sweep, WS-4 schema/multi-tenancy)
- **Progress:** WS-2 verified 2026-05-11; W1 implementation follow-ons (A.6 PR #12, A.8 PR #11, A.7 PBI Option B scoping PR #13) shipped + deployed to Cloud Run revision `smartcity-api-00084-vhr` 2026-05-11. Cutover env-var rebind cluster surfaced 2026-05-11 (30+ vars dropped in 2026-05-03 cutover) — P1 next-session two-track work. WS-1, WS-3 remaining (beyond x-internal-ai CORS removal bundled into W1.C.2's PR #9), and WS-4 still pending.
- **Exits:** SmartCity OS on Empressa Neon end-to-end; all fires closed; code-side security debt cleared; schema hygiene baseline; ADR-005 canonical + multi-tenancy invariants verified; ✅ W1 sprint complete (2026-05-11); CI clean baseline.

### M-PropIntel — SmartCity property intelligence

- **Gated on:** M-Stabilize exit (multi-tenancy verified; ADR-005 canonical; engine factor-out unblocked via ADR-008)
- **Doc:** TBD — currently lives as "Bastrop property intelligence" in P2 backlog below; needs scope-and-sprint after M-Stabilize.
- **Scope:** City-manager view of property intelligence — Sylvia's hydrology query is the canonical use case. Engine-backed parcel briefing scoped to jurisdiction. Slice of the same engine that powers DA parcel briefing per [`27_engine_evolution_plan.md`](27_engine_evolution_plan.md). Also informs [`48_*`](48_codex_program_plan.md) Phase 3 CDX-6 (reviewer-side parcel intelligence).

### M-CortexQA — Cortex functional, QA-ready

- **Gated on:** [`27_*`](27_engine_evolution_plan.md) Streams A/B/C/D running; [`42_*`](42_design_accelerator_program_plan.md) Phase 1 complete
- **Doc:** [`42_design_accelerator_program_plan.md`](42_design_accelerator_program_plan.md) Phase 2 exit
- **Exits:** Nick can run Musgrave (or any active Moab project) end-to-end with structural evaluation per the 8-point QA-readiness definition. Bugs are pointable-at-atoms.

### M-CodexQA — Codex 1b functional, QA-ready

- **Gated on:** [`27_*`](27_engine_evolution_plan.md) Streams A/B/C/D running; [`48_*`](48_codex_program_plan.md) Phase 1 complete
- **Doc:** [`48_codex_program_plan.md`](48_codex_program_plan.md) Phase 2 exit
- **Exits:** Nick can run real reviewer pass end-to-end through Codex 1b on Moab projects with structural evaluation per the 8-point QA-readiness definition.

### Cross-cutting work in flight

- **Brand migration** (Plan Review → Codex, Design Accelerator → Cortex) — [`27_*`](27_engine_evolution_plan.md) Stream G. Gated on legacy-design-tools PR #17 landing.
- **Atom registry expansion** — [`27_*`](27_engine_evolution_plan.md) Stream B. Coordinated rollout across all consumers, single minor version bump.
- **Cross-track interface spec** — [`33_smartcity_codex_1b_integration.md`](33_smartcity_codex_1b_integration.md) stub. Full spec deferred to post-M-Stabilize coordination session.

## Active sprint exit criteria

Per-sprint exit conditions for the three active sprints. Detailed exit criteria live in each sprint doc; this is the at-a-glance reference. Added 2026-05-16 per master roadmap consolidation decision.

**[`51_substrate_v1_sprint.md`](51_substrate_v1_sprint.md) — Substrate v1.** Exits when: (1) `hauska-engine` running the Code Ingestion Pipeline in production with quality-gated 20+ jurisdiction corpus (TX-first per the explicit Stream 1D city list); (2) `hauska-mcp-server` running at the chosen public endpoint wired to `hauska-engine` retrieval API; (3) listed in MCP directories serving real external traffic; (4) logging captured for training-data + commercial-use monitoring. Phase 0's 16 consolidated decisions land first. Sync Point #6 (Texas IP attorney memo) gates non-Bastrop ingestion.

**[`11a_bastrop_live_roadmap.md`](11a_bastrop_live_roadmap.md) — Bastrop-live.** Exits when Codex 1b live in Bastrop production; Sylvia and Jaime running real submittals through the SmartCity OS Plan Review surface (Sprint A.3 exit). Gated on M-Stabilize closeout (A.0). Sprint A.1 corpus load coordinates with [`51`](51_substrate_v1_sprint.md) Stream 1D's B.6 validation pass.

**[`30a_smartcity_stabilization_sprint.md`](30a_smartcity_stabilization_sprint.md) — M-Stabilize.** Exits when: SmartCity OS on Empressa Neon end-to-end; all fires closed; code-side security debt cleared; schema hygiene baseline; ADR-005 canonical + multi-tenancy invariants verified; W1 sprint complete; CI clean baseline. WS-2 verified 2026-05-11; WS-1, WS-3 remainder, and WS-4 still pending per [`00_current_state.md`](00_current_state.md).

## Summary

Active state across the portfolio: M-Stabilize sprint (`30a`) plus parallel Codex/Cortex track (`27`/`42`/`48`) executing toward end-state. ~45 backlog items below tracked by priority tier; most P1 items now absorbed by active sprints. Five active fires (Fires 1 + 4 closed; Fire 2 held on Bastrop IT; Fire 3 pending; Fire 5 closes at M-Stabilize Phase 2C). Roadmap balances milestone view (above) with operational tier view (below).

**Priority tiers (operational):**

- **P0** — fire / blocking / today-this week
- **P1** — committed work this week / next
- **P2** — next 2-4 weeks
- **P3** — backlog (important, not urgent)
- **Open strategic questions** — awaiting external signal; not work items in the same shape

**Sizing:** S < 1h · M = 1-4h · L = 1+ days · XL = multi-day sprint.

**Owner notation:** Nick = manual / decision / browser. Agent = Cursor Claude Code or Replit Agent. Planner = Claude.ai planning chat. Open = no owner.

---

## P0 — now / this week

- [ ] **Fire 3:** verify legacy-design-tools `post-merge.sh` Neon-guard on GitHub web UI — `fire` · Nick (browser) · S · ref: [`10_ground_truth.md`](10_ground_truth.md). May go moot after [`42_*`](42_design_accelerator_program_plan.md) Phase 1 clears.
- [x] **Fire 1:** W1.C.4a auth bypass fix on SmartCity OS — closed 2026-05-10 (PR #6, commit `5e9fca3`, Cloud Run revision `smartcity-api-00084-weg`).
- [ ] **Fire 2:** plaintext secrets in `.replit` — internal items absorbed into [`30a`](30a_smartcity_stabilization_sprint.md) WS-3; external rotations held for Bastrop IT engagement. `fire` · Nick + agent · M.
- [x] **Atom architecture ADR migration** — shipped 2026-05-05.
- [x] **Recon backfill** into `_sessions/2026-05-05_*` — shipped 2026-05-05.

## P1 — this week / next

- [ ] **Substrate v1 sprint** (Code Ingestion Pipeline + Hauska MCP Server combined) — [`51_substrate_v1_sprint.md`](51_substrate_v1_sprint.md), active 2026-05-15. Two new repos (`hauska-engine`, `hauska-mcp-server`), two parallel tracks, four streams per track, eight cc-agents. v1 ships quality-gated TX-first jurisdiction corpus + public MCP endpoint at `mcp.hauska.dev`. **Phase 0 decisions are immediate next step** — 16 consolidated decisions including revenue model, BD ownership, hosting, orchestration substrate, OCR provider, quality bar, query authoring, TX-first batch list, cost budget. Supersedes standalone sprint sections in 49 + 50 (those remain canonical reference for pipeline design + MCP product framing). Resolves "Bring-your-own-agent public API" open strategic question + Risk 1. `product` · Nick (Phase 0 decisions) + 8 cc-agents (streams) · XL sprint.
- [ ] **Texas IP attorney opinion memo** — data-licensing posture for catalog ingest; budget $8–12K. **Gates [`51`](51_substrate_v1_sprint.md) Stream 1D non-Bastrop ingestion.** Candidates per [`18_stakeholder_graph.md`](18_stakeholder_graph.md): Husch Blackwell Austin, Norton Rose Fulbright Austin, Pillsbury Austin (data licensing + AI practice). Sourced from catalog roadmap dialogue 2026-05-15. `legal / strategic` · Nick · M.
- [ ] **SmartCity OS Stabilization Sprint** — [`30a_smartcity_stabilization_sprint.md`](30a_smartcity_stabilization_sprint.md), active 2026-05-11. Orchestrates Phase 2 migration + W1 sprint + security sweep + multi-tenancy foundation. ~3-4 weeks across 4 workstreams. **This is M-Stabilize.**
- [ ] **Codex/Cortex Phase 1 work** — [`27_engine_evolution_plan.md`](27_engine_evolution_plan.md) Streams A/B/C/D/G + [`42_*`](42_design_accelerator_program_plan.md) Phase 1 + [`48_*`](48_codex_program_plan.md) Phase 1. Module boundary refactor, atom registry expansion, engine quality, corpus depth, brand migration. Path to M-CortexQA and M-CodexQA. `product` · Nick + agent · XL sprint.
- [ ] **Migration sprint Phase 1** — legacy-design-tools full migration · executing per existing track. `migration` · Nick + agent · XL sprint · ref: [`12_migration_sprint.md`](12_migration_sprint.md). 2026-05-10 PM: Phase 1B Stage 1 verified — schema parity to Empressa Neon. Phase 1B Stage 2 / Phase 1C eligible to schedule.
- [ ] **Migration sprint Phase 2** — SmartCity OS Empressa Neon swap (us-central1 closes Fire 5) · **executing under [`30a`](30a_smartcity_stabilization_sprint.md) WS-1**. `migration` · Nick + agent · XL sprint.
- [ ] **Migration sprint Phase 3** — Drizzle migrate adoption · **executing under [`30a`](30a_smartcity_stabilization_sprint.md) WS-1 Phase 3 (ADR-006)**. `migration` · Nick + agent · XL sprint.
- [ ] **Dispatch prompts queue** — 4 prompts pending draft · W1 specs absorbed by [`30a`](30a_smartcity_stabilization_sprint.md). Remaining un-drafted: A04.7 followups, lockfile drift, prefix collisions, GoTo OAuth. `docs` · planner · M.
- [x] **W1.A.6-9 forensics dispatches** (calendar / Power BI / police units / health-watch email) — verified 2026-05-11. Findings docs shipped to smartcity-os `_research/`; A.6/A.8 plaintext-at-HEAD redacted in `.replit` + `SPIREON_API_TROUBLESHOOTING.md`. Implementation follow-ons (A.6/A.7/A.8 structural fixes; A.9 ~7.5h V1) post-sprint. Operational rotation continues as A.6.b/A.8.b (see P2).
- [x] **W1.C.1-3 implementation dispatches** (Prophecy design-system alignment / CSP frame-src + bundled x-internal-ai CORS removal / OpenGov BNP hardening) — verified 2026-05-11. Smartcity-os PRs #10, #9 (`8402e66`), #8 (`281126a`) all squash-merged. W1.C.1 reframed mid-stream from viewport fix to design-system alignment per Nick's actual symptom.
- [ ] **$21M water/wastewater state grant** — June 1 deadline, no owner, no technology narrative drafted. `strategic` · Nick (open) · XL.
- [x] **W1.A.6 Calendar implementation** — verified 2026-05-11. Smartcity-os PR #12 squash-merged (`86a90ff`); F-1 public read-only `/api/calendar/events/public`, F-3 parseDate TZ fix, F-4 VTIMEZONE block, F-5 Municode await + 1.5s timeout, F-6 boot probe + `/api/calendar/status` extension. Deployed in revision `smartcity-api-00084-vhr`. F-2 (board schedule reconciliation) remains blocked on Bastrop city clerk authoritative schedule. A.6.b CALENDAR_API_KEY bind for env-keyed partner subscriptions still gated on F-7/F-8 dual-key middleware (bundled into cutover env-var rebind cluster Track B).
- [x] **W1.A.8 Spireon implementation** — verified 2026-05-11. Smartcity-os PR #11 squash-merged (`5b9815e`); F-2 mapDepartment reorder, F-3 active flag + inactive UI label, F-4 retry + LKG fallback, F-8 disappearance log. Deployed in revision `smartcity-api-00084-vhr`. User-visible value (police cars on live map) gated on A.8.b Spireon credentials bind — bundled into cutover env-var rebind cluster Track B. F-1 (DB-backed override) remains at P2.
- [x] **W1.A.7 PBI Option B scoping** — verified 2026-05-11. Smartcity-os PR #13 squash-merged (`04b296e`); scoping doc shipped at `_research/w1_a_7_pbi_option_b_scoping.md` (198 lines). Frames Option B as "delete, don't correct" — eliminates 11 Option A divergences as a class. `/projects` Reports tab already proves embed plumbing works; Option B is "expand and shift." Implementation Phase 1 gated on Nick resolving Section 8 open questions (Bastrop PBI workspace visual inventory via Monday ask, ProjectDetailCard treatment, RLS posture, executive-overview / AI-assistant consumer disposition, filter-chip → bookmark wiring). `sprint follow-on / smartcity-os` · Nick + cc-agent · M-L · ref: [`30a`](30a_smartcity_stabilization_sprint.md) W1.A.7 status line.

- [ ] **Cutover env-var rebind — Track A (silent-drop restore)** — 11 vars not awaiting vendor rotation: `MYGOV_USERNAME`, `MYGOV_PASSWORD`, `RESEND_API_KEY`, `PIPEDRIVE_API_TOKEN`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `OPENGOV_TRANSPARENCY_KEY`, `ADMIN_RESET_PASSWORD`, `BASTROP_BOOTSTRAP_PASSWORD`, `USER_RESET_EMAIL`, `USER_RESET_PASSWORD`. Source values from old Replit env / vendor portals. Bind in GCP Secret Manager → reference from Cloud Run service spec → new revision. Per [`91_postmortems/2026-05-11_cutover_env_var_silent_drops.md`](91_postmortems/2026-05-11_cutover_env_var_silent_drops.md). `security / follow-on / smartcity-os` · Nick + cc-agent · M.
- [ ] **Cutover env-var rebind — Track B (rotation-pending restore)** — 12 vars awaiting vendor coordination via Monday Bastrop message: Spireon×3 (Solera Tier-2), Verkada×2, ESRI/ArcGIS×3, VFD codes×6 (Bastrop VFD admin). Bind as fresh values arrive. Verify integration health endpoints post-bind. Absorbs prior A.6.b / A.8.b rotation work. **Calendar API key×1 removed 2026-05-18.** `CALENDAR_API_KEY` env var verified unbound on current Cloud Run revision; production `/api/calendar/events.ics` auth is exclusively per-tenant via `?key=<tenants.settings.calendarFeedKey>`. F-7 rotation has no operational target on the env path; F-8 dual-key middleware no longer load-bearing for this auth path. Historical leaked value in git remains a defense-in-depth follow-on under portfolio-level Fire 2 git-history scrub. P2 entries at lines 181 (W1.A.6 verified) and 193 (W1.A.6.b rotation completion) carry stale rotation framing pending a follow-on doc-set sweep. See [`91_postmortems/2026-05-18_ical_dtstart_nan_silent_drop.md`](91_postmortems/2026-05-18_ical_dtstart_nan_silent_drop.md). `security / follow-on / smartcity-os` · Nick + cc-agent · L.
- [ ] **`AI_INTEGRATIONS_*` code rename** — `server/lib/anthropic.ts:5-6` (and `server/replit_integrations/{image,audio}/client.ts`) read Replit-era prefixed names that don't match Cloud Run bindings. Anthropic SDK env fallback masks the mismatch; OpenAI has no fallback. Update code to read bound names; drop Replit-era prefix. ~10 LoC across 3 files. `hygiene / smartcity-os` · cc-agent · S.
- [ ] **`90_runbooks/agent_workspace_hygiene.md`** — author runbook. Four wrong-branch / detached-HEAD / shared-working-tree incidents to date across cc-agent dispatches (latest: A.6/A.8 parallel-attempt collision 2026-05-11). Specify `git worktree add ../<repo>-<branch-short> main` canonical pattern + recon-time refusal as safety net + branch-naming conventions for parallel dispatches. `docs` · planner · M.

## P2 — next 2-4 weeks

- [ ] **Fire 4:** SmartCity OS Repl drift cleanup — PR #7 merged 2026-05-10 PM. Workspace rename to `SmartCityOSMain-retired-20260510` pending Nick UI action — fully closes after rename. `fire (demoted)` · Nick + agent · M.
- [ ] **W1.A.6.b — Calendar rotation completion** (post-sprint follow-on to W1.A.6) — F-8 dual-key middleware, Cloud Shell rotation of `CALENDAR_API_KEY` via BeWith, ~14-day `.ics` subscriber re-key window, old-key disable, git-history scrub coordination with A.8.b. Needed for Fire 2 closure on Calendar side. `security / follow-on` · Nick + agent + BeWith · L · ref: [`30a`](30a_smartcity_stabilization_sprint.md) §WS-2 W1.A.6 Status line.
- [ ] **W1.A.8.b — Spireon rotation completion** (post-sprint follow-on to W1.A.8) — `SPIREON_TOKEN` rotation via Solera Tier-2 (most urgent), `SPIREON_USERNAME` + `SPIREON_PASSWORD` rotation, Cloud Shell + Cloud Run cutover, git-history scrub coordination with A.6.b, identity-field review for troubleshooting doc, F-2 mapDepartment 5-LoC reorder. Needed for Fire 2 closure on Spireon side. `security / follow-on` · Nick + agent + Solera Tier-2 · L · ref: [`30a`](30a_smartcity_stabilization_sprint.md) §WS-2 W1.A.8 Status line.
- [x] **Saga package cleanup** — shipped 2026-05-05.
- [x] **ADR-Replit-Neon-001/002/003 migrate** — shipped 2026-05-05.
- [ ] **ADR-005 multitenancy migration** · **executing under [`30a`](30a_smartcity_stabilization_sprint.md) WS-4 cross-cutting prereq**. `docs` · planner · M.
- [ ] **Bastrop property intelligence** — city-manager view (Sylvia's hydrology query). **Path to M-PropIntel.** Slice of same engine as DA parcel briefing per [`27_*`](27_engine_evolution_plan.md); scoped at jurisdiction level. Sprint scope TBD after M-Stabilize exit. `product` · Nick + agent · L · ref: [`30_smartcity_os.md`](30_smartcity_os.md).
- [ ] **Watchlist / risk register owner assignment** — Nick to set, Valerie to operate. `ops` · Nick (decision) · S.
- [ ] **Cente box layout confirmation** — `ops` · Nick · S.
- [x] **SSH remotes migration** — superseded 2026-05-06.
- [x] **`gh auth login` on Nick box** — done 2026-05-06.
- [x] **Cloud Run canary deploy runbook** — shipped 2026-05-06.
- [x] **Migration sprint structure decision** — decided 2026-05-06 as 3-phase split.
- [ ] **Biz ops repo creation** — `corporate` · Nick + planner · M.
- [ ] **Anthropic GitHub MCP wiring** — `ops` · Nick + planner · M.
- [ ] **Empressa credentials vault decision** — `ops` · Nick · S.
- [ ] **Pre-docs-repo migration progress** — ~22 migrate / 12 absorb / 6 archive / 7 retire. `docs` · planner · L.
- [ ] **Design Accelerator Moab waves W0-W3** · **executing under [`42_*`](42_design_accelerator_program_plan.md) Phase 1 DA-2**. `product` · Nick + agent · XL sprint.
- [ ] **DA-PI-1:** Design Accelerator parcel intelligence MVP · informs M-PropIntel. `product` · Nick + agent · XL sprint.
- [ ] **AI Plan Review M4-B kickoff** — Now Codex 1b. Vocabulary cross-mapping deferred to [`33_smartcity_codex_1b_integration.md`](33_smartcity_codex_1b_integration.md) (stub). Execution under [`48_*`](48_codex_program_plan.md) Phase 1-2. `product` · Nick + agent · XL sprint.
- [ ] **B1 bidirectional taxonomy** · **executing under [`42_*`](42_design_accelerator_program_plan.md) Phase 2 DA-7**. `product` · L.
- [ ] **Sprint A04.7 followups** · pending dispatch draft (in P1 queue). `product` · agent · M.
- [ ] **Codex Wave 1 (commercial wedge / 1a invited foundation)** · **deferred to [`48_*`](48_codex_program_plan.md) Phase 5** (1b-first sequencing decision 2026-05-11). `product` · ref: [`48_codex_program_plan.md`](48_codex_program_plan.md).
- [ ] **W1.A.8 F-1 — DB-backed Spireon department override mechanism** — `tenants.settings.spireonDepartmentOverrides` schema column + admin UI to set per-asset overrides. Proper fix for `mapDepartment` heuristic mis-bins; F-2 reorder (in W1.A.8 P1) is the bite-sized partial. `sprint follow-on / smartcity-os` · Nick + cc-agent · L · ref: smartcity-os `_research/w1_a_8_police_units_spireon.md`.

- [ ] **`90_runbooks/cutover_env_var_audit.md`** — author forward-looking runbook for future infra cutovers covering: enumerate `process.env.*` references in code, snapshot source env bindings, produce mapped checklist, verify post-cutover. Gated on Track A shipping (so the runbook reflects post-restoration state). Distinct from the 2026-05-11 point-in-time audit at [`90_runbooks/smartcity_cloud_run_env_audit_2026-05-11.md`](90_runbooks/smartcity_cloud_run_env_audit_2026-05-11.md). `docs` · planner · M.

## P3 — backlog

- [ ] **Jarrell onboarding** + city-to-city architecture (M9) — beyond M-PropIntel; new-client motion. `product` · Nick + open · XL sprint.
- [ ] **Digital Twinning surface** — `product` · Nick + agent · XL.
- [ ] **typecheck baseline → zero** (SmartCity OS 422 errors) · **executing under [`30a`](30a_smartcity_stabilization_sprint.md) WS-4**. `ops` · agent · XL.
- [ ] **SmartCity OS `migrations/` prefix collisions** · **executing under [`30a`](30a_smartcity_stabilization_sprint.md) WS-1 Phase 2A prereqs**. `ops` · agent · S.
- [ ] **Lockfile drift root cause** (SmartCity OS) · **executing under [`30a`](30a_smartcity_stabilization_sprint.md) WS-4**. `ops` · agent · S.
- [ ] **Universal `sync_health` adoption** — `ops` · agent · M.
- [ ] **Schema migration framework decision** · **executing under [`30a`](30a_smartcity_stabilization_sprint.md) WS-1 Phase 3 (ADR-006)**. `ops` · Nick + planner · S.
- [ ] **Devcontainer / Codespaces evaluation** — `ops` · Nick + planner · L.
- [ ] **Compass system prompt refactoring** — `ops` · planner + agent · M.
- [ ] **Quantum cryptography strategic vision doc** — `strategic` · Nick + planner · L.
- [ ] **Tech E&O insurance** before first enterprise contract — data-provider + AI-liability specialist broker. Mitigates new Risk 12 in [`13_risk_register.md`](13_risk_register.md). Sourced from catalog roadmap dialogue 2026-05-15. `corporate / risk` · Nick · M (when first enterprise conversation activates).
- [ ] **ECI atomization sprint** (likely `60a_eci_atomization_sprint.md` when scoped) — execute the [`60_eci_atomization.md`](60_eci_atomization.md) draft spec; wire ECI to Hauska Engine + atom substrate + internal MCP read surface. Gated on [`51`](51_substrate_v1_sprint.md) v1 ship. `architecture / product` · Nick + cc-agent · L sprint.
- [ ] **Security Day** — 4 deferred security commits. `ops` · Nick + agent · M.
- [ ] **GoTo Connect OAuth fix** — `ops` · agent · S.
- [ ] **Deduplicate `mygov_work_orders` schema** · **folded into [`30a`](30a_smartcity_stabilization_sprint.md) WS-1 Phase 2A schema sync**. `ops` · Nick (decision) · M.
- [ ] **Hauska ↔ Legacy services agreement** — `corporate` · Nick + Valerie · M.
- [ ] **Hauska Inc. GitHub org migration** — `corporate / ops` · Nick · M.
- [ ] **Engineer-2 operational protocol** — `ops` · Nick · M (when triggered).
- [ ] **ADR-006 anchoring substrate decision** — Polygon CDK vs TSA vs Hauska cluster vs customer-controlled. Precondition for M6. Also relevant to `audit-trail-anchor` atom in [`27_*`](27_engine_evolution_plan.md). `architecture` · Nick + planner · M.
- [ ] **Nick Chesser subdivision real name** — `ops` · Nick · S.
- [ ] **Semgrep `// nosemgrep:` annotation** · **executing under [`30a`](30a_smartcity_stabilization_sprint.md) WS-3**. `docs/cleanup` · agent · S.
- [ ] **`server/routes/ai-assistant.ts:4212` stale `x-internal-ai` header** · **executing under [`30a`](30a_smartcity_stabilization_sprint.md) WS-3**. `bug` · agent · S.
- [ ] **`server/app.ts:85` CORS allowlist removal of `x-internal-ai`** · **executing under [`30a`](30a_smartcity_stabilization_sprint.md) WS-3**. `security` · agent · S.
- [ ] **Auth middleware vitest coverage gap** · **executing under [`30a`](30a_smartcity_stabilization_sprint.md) WS-3**. `test-debt` · agent · M.
- [ ] **Audit production Neon for MyGov raw-records growth pattern** · **executing under [`30a`](30a_smartcity_stabilization_sprint.md) WS-4**. `recon` · agent · M.
- [ ] **Hauska Engine factor-out sprint** — gated on M-Stabilize Phase 2C closure. Repo `hauska-engine`. `architecture` · Nick + agent · XL sprint · ref: [ADR-008](80_adrs/adr_008_engine_factor_out.md).
- [ ] **Codex 1b standalone in SmartCity OS Plan Review** — full integration spec in [`33_smartcity_codex_1b_integration.md`](33_smartcity_codex_1b_integration.md) (stub today); execution as [`48_*`](48_codex_program_plan.md) Phase 4. Beyond M-CodexQA. `product` · Nick + agent · L.
- [ ] **PropTech ecosystem partner outreach** — gated on engine factor-out + ADR-007. `corporate / strategic` · Nick · M.
- [ ] **Audit legacy-design-tools test isolation pattern** · **executing under [`42_*`](42_design_accelerator_program_plan.md) Phase 1 DA-Test-Iso**. `recon` · agent · M.
- [ ] **`30_smartcity_os.md` deploy-architecture section** — substantive write-up: two-target reality (build vs build:cloud-run, index-prod vs index-cloud), canonical Cloud Run build path (Dockerfile.api + cloudbuild-api.yaml), traffic-tag awareness, `deploy:check` script disposition, post-cutover Replit-is-dead state. `docs` · planner · M.
- [ ] **`deploy:check` package.json script disposition** — stale post-2026-05-03 cutover (warns to deploy Replit when client changes). Remove or comment as Replit-legacy. Coordinate with `npm run build` script disposition (Replit target is dead code). `hygiene / smartcity-os` · Nick + cc-agent · S.
- [ ] **Cloud Run traffic-tag audit + cleanup on smartcity-api** — three tags at 0% traffic (`p0-3-canary`, `p0-followup-prophecy`, `w1-c-4a-auth-fix`). Decide keep-for-record vs remove; document remaining tags' purposes if kept. Prevents future silent-strand traps. `hygiene / smartcity-os` · Nick · S.

---

## Open decisions / judgment calls

- ~~Atom ADR + recon backfill at P0~~ — resolved 2026-05-05.
- **$21M grant at P1 with size XL** — time-bound by June 1; needs owner.
- ~~Migration sprint as one item vs split~~ — resolved 2026-05-06 as 3-phase split.
- **Jarrell at P3 not P2** — Bastrop fires + product roadmap clear first.
- **Compass system prompt refactoring at P3** — rises to P2 if blocking AI Plan Review M4-B.
- **Items not on this roadmap because it's a software roadmap:** marketing/sales pipeline, Sylvia $1M proposal restructuring, EdgeConneX partnership outreach. Decision pending whether to absorb here or separate roadmap.

## Open strategic questions

Decisions awaiting external signal — customer conversations, market data, regulatory developments, or sustained deliberation. Listed by category with current owner.

### Commercial — Legacy

- **Per-city price envelope for deal #2** — *Valerie*.
- **Services vs. platform revenue on Bastrop** — *Valerie + Nick*.
- **Plan review module-or-bundle** — *Nick + Valerie*. Resolves before Bastrop's first plan-review billing event.
- **Tenth-deal economics** — *Valerie*.
- **`@hauska/atom-contract` commercial posture revisit** — *Nick*. Trigger: revisit when (a) third-party agent builders outside the Empressa product surfaces request consumption, OR (b) a paid Layer 2 surface ships first revenue — whichever comes first. (Settled 2026-05-18 with the 14_pricing_framework close-the-loop pass; package renamed from `@empressaio/atom` 2026-05-18 per [ADR-018](80_adrs/adr_018_atom_contract_substrate_layer.md); atom contract is Hauska commercial substrate, peer to the Hauska SDK.)

### Commercial — Hauska Inc.

- **Hauska SDK pricing model** — *Nick*.
- **Hauska Inc. external developer motion** — *Nick*.
- **Separate legal entity for the catalog** — *Nick*. Sourced from catalog roadmap dialogue 2026-05-15; whether the Hauska MCP Server + ingestion engine warrants a distinct entity from Hauska Inc. Resolves alongside Hauska / Legacy Group separation timing.

### Regulatory and positioning

- **Active vs. passive posture toward TCEQ standard-setting** — *Nick + Sylvia conversation*. Tied to Risk 7.
- **Bring-your-own-agent public API** — *Nick (product decision)*. Tied to Risk 1. **In flight as [`50_hauska_mcp_server.md`](50_hauska_mcp_server.md) Phase 0 (2026-05-15).** Resolution drops this entry when Phase 0 closes.
- **Empressa Company Intelligence trajectory** — *Nick*.

### Market and customer

- **Which second customer, and what the referral funnel looks like** — *Valerie + Sylvia*.

## Open architectural questions

Architectural decisions awaiting resolution or in flight via ADR drafting. Mirrors [Open strategic questions](#open-strategic-questions) in shape; commercial questions stay separate from architectural ones. Added 2026-05-16 per master roadmap consolidation decision.

- **Q4 actor atoms** — *Nick*. **Decided 2026-05-16:** single `actor-record` atom type with discriminator field (`actorType: person | agent | organization`) plus `trustLevel` enum. [ADR-015](80_adrs/adr_015_actor_atoms.md) scaffolded; lands with ECI atomization sprint internal-atom bump. Status: proposed pending ratification.
- **Q5 intent atoms** — *Nick*. **Decided 2026-05-16:** no new atom type for v1. Add a `purpose` field to procedure-execution atoms (ADR-013) with optional links to parent `decision-record` / `sprint-item` / `open-question` atoms in the ECI internal registry. Run for one quarter post ECI atomization; promote to full `intent-record` atom type in ADR-016 if usage demands. ADR-016 status: deferred to v2 candidacy.
- **Q6 atom access control** — *Nick*. **Decided 2026-05-16:** extend the atom contract per ADR-001 with a layered `accessPolicy` field (`public-free` / `public-paid` / `tenant-private` / `tenant-shared` / `platform-internal`). [ADR-017](80_adrs/adr_017_atom_access_control.md) scaffolded; sequenced after ADR-015; added as a dependency for the ECI atomization sprint. Status: proposed pending ratification.
- ~~**Adjudication-record atom spec gap**~~ — **Resolved 2026-05-16 (alignment session recon):** spec IS present at [`27_engine_evolution_plan.md`](27_engine_evolution_plan.md) "Compounding-context atoms (Bastrop-live capture)" section (line 263 onward). Full atom contract per ADR-001, 14 key fields with cross-tenant scope per ADR-007, link taxonomy per ADR-010, six explicit open questions. The earlier finding was based on incomplete search (the section title doesn't contain "adjudication-record" verbatim).
- ~~**Codex naming follow-up**~~ — **Resolved 2026-05-16 (alignment session):** Codex is the product brand covering plan review (1a contractor-side + 1b city-side) AND code intelligence (the code-lookup surface over `code-section` atoms via Hauska MCP Server tools, free at Layer 1). The catalog-roadmap-default "skip sub-brand, describe functionally" was overridden in favor of brand consolidation. Updates propagated to [`47_codex_plan_review.md`](47_codex_plan_review.md), [`48_codex_program_plan.md`](48_codex_program_plan.md), [`07_product_line_summary.md`](07_product_line_summary.md), and the 2026-05-16 strategic brainstorm session file.

## Queued ADR work

ADRs not yet drafted, scaffolded but proposed, or active drafts. Tracked here so architectural work doesn't go invisible. Added 2026-05-16.

| ADR | Topic | Status |
|---|---|---|
| ADR-005 | Multi-tenancy | Deferred; queued under [`30a`](30a_smartcity_stabilization_sprint.md) WS-4 |
| ADR-006 | Anchoring substrate (Polygon CDK / TSA / Hauska cluster / customer-controlled) | Deferred until `audit-trail-anchor` atom production unblocks |
| ADR-009 | Firm tenancy | Deferred until Codex 1a returns to active scope (post-[`11a`](11a_bastrop_live_roadmap.md)) |
| ADR-013 | Procedure-execution atoms | **Scaffolded 2026-05-16 (alignment session)** — [`80_adrs/adr_013_procedure_execution_atoms.md`](80_adrs/adr_013_procedure_execution_atoms.md). Status: proposed pending ratification. Combines Q2 2026-05-15 (option C audit shape) and Q5 2026-05-16 (purpose-field rider). Slots into Bump 2. |
| ADR-014 | Skill / behavior atoms | Queued for Q3 v2 activation; design pre-committed (Hauska-layer brand per ADR-008, 08 tier model inherited). Stricter discipline gates than ADR-013 — atomizes stable distributable versioned procedures only. |
| ADR-015 | Actor atoms | **Scaffolded 2026-05-16** — [`80_adrs/adr_015_actor_atoms.md`](80_adrs/adr_015_actor_atoms.md). Status: proposed pending ratification |
| ADR-016 | Intent atoms | Deferred to v2; revisit one quarter post ECI atomization (Q5 trial period) |
| ADR-017 | Atom access control | **Scaffolded 2026-05-16** — [`80_adrs/adr_017_atom_access_control.md`](80_adrs/adr_017_atom_access_control.md). Status: proposed pending ratification; sequenced after ADR-015 |

## References

**Foundation / meta:**
- [`00_current_state.md`](00_current_state.md) — current state snapshot (orientation entry point per [`90_runbooks/current_state_protocol.md`](90_runbooks/current_state_protocol.md))
- [`00_README.md`](00_README.md), [`01_doc_conventions.md`](01_doc_conventions.md), [`02_doc_migration_plan.md`](02_doc_migration_plan.md)

**Strategic foundation:**
- [`05_living_lineage_thesis.md`](05_living_lineage_thesis.md), [`06_cities_value_narrative.md`](06_cities_value_narrative.md)

**Portfolio reference:**
- [`10_ground_truth.md`](10_ground_truth.md), [`12_migration_sprint.md`](12_migration_sprint.md), [`13_risk_register.md`](13_risk_register.md), [`14_pricing_framework.md`](14_pricing_framework.md), [`15_replit_neon_ownership_advisory.md`](15_replit_neon_ownership_advisory.md), [`17_leading_indicators.md`](17_leading_indicators.md)

**Agent rules + dev flow:**
- [`20_agent_operating_rules.md`](20_agent_operating_rules.md), [`21_ai_first_dev_flow.md`](21_ai_first_dev_flow.md), [`22_workstation_inventory.md`](22_workstation_inventory.md), [`23_dev_setup_assessment.md`](23_dev_setup_assessment.md), [`25_atom_architecture_reference.md`](25_atom_architecture_reference.md), [`26_atom_upgrade_guide.md`](26_atom_upgrade_guide.md), [`27_engine_evolution_plan.md`](27_engine_evolution_plan.md)

**Product homes + program plans:**
- [`30_smartcity_os.md`](30_smartcity_os.md), [`30a_smartcity_stabilization_sprint.md`](30a_smartcity_stabilization_sprint.md), [`33_smartcity_codex_1b_integration.md`](33_smartcity_codex_1b_integration.md)
- [`40_design_accelerator.md`](40_design_accelerator.md), [`41_revit_connector.md`](41_revit_connector.md), [`42_design_accelerator_program_plan.md`](42_design_accelerator_program_plan.md)
- [`47_codex_plan_review.md`](47_codex_plan_review.md), [`48_codex_program_plan.md`](48_codex_program_plan.md)

**ADRs:**
- [`80_adrs/adr_001_atom_architecture.md`](80_adrs/adr_001_atom_architecture.md) through [`80_adrs/adr_004_*`](80_adrs/), [`80_adrs/adr_007_*`](80_adrs/adr_007_cross_stakeholder_atom_access.md), [`80_adrs/adr_008_*`](80_adrs/adr_008_engine_factor_out.md). ADR-005 and ADR-006 pending; ADR-009 deferred.

**Operational:**
- [`90_runbooks/`](90_runbooks/) — `cloud_run_canary_deploy`, `neon_schema_migration_via_cloud_shell`, `replit_deploy`, `session_close_template`, `current_state_protocol`, `regenerate_schema_fixture_windows`
- [`91_postmortems/`](91_postmortems/) — `2026-05-05_track_b_deploy_saga`, `2026-05-07_replit_dev_db_wedged`
