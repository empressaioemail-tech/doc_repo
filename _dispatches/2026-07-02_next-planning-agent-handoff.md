---
id: dispatches/2026-07-02_next-planning-agent-handoff
title: Handoff — next planning agent, autonomous multi-agent build process
status: active
date: 2026-07-02
related: [_inbox/2026-07-02_cortex-workspace-qa-build_STATUS, _research/2026-07-02_ai_native_and_twin_review, _inbox/2026-07-02_phase3_tenancy_sprint_plan, _sessions/2026-07-02_cortex_qa_phase2_deepreview_claude_code]
---

# Handoff to the next planning agent

You are the doc_repo planner and master orchestrator. This is how the last two sessions built (Shared Surface Sprint, then the cortex QA Phase 1 and Phase 2 plus a deep review), and where things stand. Build the same way.

## The orchestration model

Collapse the courier model. Do not hand copy-paste prompts to the operator for separate windows. You ARE the fleet: spawn one lead agent per track with the Agent tool (run_in_background: true), and each lead spawns its own build sub-agent plus an adversarial review sub-agent per phase. You own wave sequencing, cross-repo coordination, every doc_repo commit, and the final verification.

Per-track lead agent prompt shape (what worked):
- Point it at the exact dispatch/spec/close-report files to READ first (P: drive paths).
- Give it the repo, the deploy target, and the acceptance criteria.
- Require: build sub-agent + adversarial review sub-agent per phase; the reviewer independently verifies with pasted evidence and tries to break the claim; bounded repair (3 cycles) then STOP and report rather than force.
- Merge policy: PR, CI green, squash-merge only after the reviewer passes; --admin only if branch protection blocks and the reviewer passed.
- Deploy policy: the repo's canary sequence, smoke before traffic shift; STOP on deploy failure, do not shift traffic onto a broken revision.
- Close report to _inbox/ (WRITE, do not git-commit — the planner commits doc_repo).
- Return a structured summary with PR+merge, per-phase verdicts, deploy revision+health, blockers, verbatim key outputs.

Deploy-race rule: never run two agents that deploy the SAME service concurrently. Different services (engine-api vs cortex-api vs a package vs the mcp server) are safe in parallel. Same service (for example two cortex-api tracks) must serialize their deploys, or be one lead agent doing phased work with one coordinated deploy.

Adversarial review is not ceremony. This session it caught: a pg-to-ESM boot crash that failed a canary at 0 percent (never hit prod), a dead pointer-events interaction, a relevance-scorer bug, a firewall escalation attempt, and more. Keep the gate real.

When a reviewer escalates a judgment call (for example diminishing-returns hardening on contrived inputs), YOU make the call and inject it into the lead via SendMessage. When a lead deadlocks waiting on a sub-agent whose result bounced across the sibling boundary, relay the result to the lead via SendMessage (it resumes). This happened twice; watch for it.

## Hardened workspace rules (a hazard bit us this session)

Fresh tmp clones under p:\tmp (especially shared subpaths like p:\tmp\phase2) can be RECYCLED mid-build by concurrent operations; unpushed branch work is then lost. Require every build agent to:
1. Clone into a SESSION-UNIQUE tmp path, not a shared one.
2. `git push -u origin <branch>` right after the FIRST commit, and keep pushing as it goes.
3. If a tmp clone is recycled, re-clone into a NEW tmp dir — never fall back to the operator's persistent clone (for example P:\hauska-map) as the primary workspace; if recovery did touch a persistent clone, restore it to clean main afterward.

## doc_repo commit hygiene

The shared P:\doc_repo clone gets concurrent commits from other agents. Before each commit: git log -1 to check the tip, stage EXPLICIT paths only (never git add -A — other agents leave modified/untracked files and stray clones in the tree), commit promptly, push. autocrlf shows CRLF warnings; ignore them. There is currently a stray hauska-mcp-server/ clone and a _thoughtbank/ dir untracked in doc_repo — the first is an agent wrong-cwd clone (safe to rm), the second is the operator's own files (leave it).

## Local-vs-prod (important, cost us confusion this session)

The operator's local dev servers (for example localhost:19592 cortex workspace, localhost:5174 spine console) run from LOCAL clones that lag main and often sit on feature branches. Production (Cloud Run) and origin/main are the source of truth. A deploy verified against a stale local dev server shows old code. When the operator says "I don't see it," check their local clone's branch/commit vs main first; point them at the production URL (https://cortex-api-tds7av26va-uc.a.run.app/codex-reviewer-qa/) or have them sync (git stash if dirty, checkout main, pull, pnpm install, restart).

## State as of 2026-07-02 (all live in prod)

Repos and tips: hauska-map 678517d, legacy-design-tools c6ba01f, hauska-mcp-server 080eb01, hauska-engine 7e15710. Serving: cortex-api-00284-zuq, hauska-engine-api-00029-buy, hauska-mcp-server-00008-mcr.

Done: Shared Surface Sprint (7 tracks); cortex QA Phase 1 (engine fixes, workspace shared-parcel + tiles, map-overlay code, precedence already-live); Phase 2 (spine admin console, shell experience layer, file-to-atom + durability, Dataroom tile); the deep review synthesis and the Phase 3 plan draft.

Live capabilities worth knowing: POST /v1/document-ingest (durable file-to-atom, firewall-enforced); the tile capability registry at GET /api/plan-review/admin/tile-registry (Bearer SERVICE_API_KEY); compose_workspace MCP tool under the cortex gate; the shared active-parcel with address search + map-click; server-persisted spaces; the Module Map; the spine admin console.

## What is next (in priority order)

1. Operator-gated, unblock on their action: set NPM_TOKEN on hauska-map -> push tag map-renderer-v0.1.1 -> bump @hauska/map-renderer to ^0.1.1 in legacy-design-tools cortex-tiles + pass overlays in MapTile -> deploy; the map then draws spatial overlays. And the ICC OpenAPI spec -> wire the real I-Code ingest adapter.
2. Phase 3 tenancy (needs operator go on the plan _inbox/2026-07-02_phase3_tenancy_sprint_plan.md): T1 gate as single reasoning chokepoint -> T2 tenant-private write/owned-collection primitive (54 step 2) -> T3 second real tenant + ADR-005 Layer B zero-cross-leak load test. This is the spine of the multi-investor twin; security-critical, load-tested, not rushed.
3. Node aggregator + digital-twin lifecycle ADR (rides on Phase 3; DR-3 shape). IoT sensor-stream atom shape gets its own small ADR when the first operational-twin use case is real.
4. Quality follow-ups: hydrology DEM->GeoTIFF; pin engine Docker wheels; cosmetic hydrology degradedReason; ENGINE_API_GATE_TOKEN (folds into T1); broader spine atom persistence (code atoms still in-memory — separate storage-migration sprint).
5. Adjacent AI-native builds (schedule by value): vector retrieval behind the existing search() signature; agent write-back (implement ADR-013 into the spine); confidence-at-the-wire (expose the three-axis widthed confidence through MCP); the AI-native eval (golden agent tasks over the real MCP).
6. Roughly 13 PLANNED tiles remain a roadmap needing real engine capability, not a one-wave build.

## Doc-hygiene corrections the review surfaced (fix when convenient)

CLAUDE.md and current-state say 46 MCP tools; live main is 59. 56_engine_extraction_sprint is marked QUEUED but the extraction is largely done (stale). The Cotality map-mesh cache is live (a three-tier cache shipped); docs and memory calling it uncached are stale. The calibration loop is live-but-unfueled (fuel is the M1 backtest), not absent and not fully earned.

## The four structural commitments still gate every move

Sell reasoning not data; confidence earned not asserted (asserted-with-provenance until the loop fuels); cost per jurisdiction under target; dual interface MCP-first. Run premortem-check on load-bearing multi-file plans. Read 00_current_state.md and this session's docs first.
