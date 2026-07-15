---
id: 2026-07-15_next-planning-agent-handoff
title: Planning-agent handoff — post-Cotality-swap state, open lanes, sequenced next moves
date: 2026-07-15
kind: dispatch-handoff
related: [_decisions/2026-07-13_cotality_swap_public_record_migration, _sessions/2026-07-15_post_swap_data_completeness_and_console_hardening_claude_code, 55_spine_data_intelligence_stack, 2026-07-15_ossf_septic_records_access_survey]
---

# Handoff — next planning agent

You are the planner/executor for the Empressa / Hauska Inc. / Legacy Group ATX portfolio in `P:\doc_repo`. Read `CLAUDE.md` then `00_current_state.md`, then this. Execution model: you plan/review/verify/merge/deploy; subagents execute; **verification is never delegated** — adversarially review every subagent deliverable and every plan (the premortem skill is retired; do not invoke it). Merge only on green CI (compare headRefOid; never trust a pre-push watch). Batch deploys; don't spin one canary per PR.

## Where things stand (all LIVE in prod, verified)
Cotality was migrated off (dark vendor) to public-record providers 2026-07-13; the console was then lit and hardened, and a data-completeness + engine wave shipped. Live handles: **cortex-api `00329-xun` @100%** (rollback 00327→00325), **hauska-engine-api `00024-rd6` @100%** (rollback 00023-2qp), cmdcenter on Vercel prod. Migrations on main through `0055_permit_record`.

Verified working end-to-end in production: map parcels (7 counties: 5 county-GIS + Hays/Comal self-hosted TxGIO) with **Hays land-use coloring now live** (161/200 parcels colored post-ingest); Property Brief with CAD owner/tax/absentee slots + **permits rehab-reality slot live** (SA verified: "5 permits since 2021…"); hydrology/drainage (pysheds warmed, real flow lines); SSURGO subsurface (real soil); topography; the command center (live map tile with click→brief/site-analysis, edit-layout, 47-report + 20-component library picker, Runs panel on real report_run history + honest not-scheduled warming label). Data in prod Neon: ~1.07M CAD rows (5 counties) + Hays land codes + ~220k TxGIO parcels + ~2.85M permit rows.

## Open lanes — sequenced

### 1. Engine auth-gate enforce — NO-GO as a naive flip; do the sequence
Survey (2026-07-15): `services/engine-api/src/server.ts` bearer gate reads `ENGINE_API_GATE_TOKEN`; UNSET on live = allow-all (gate-front headers still required). Enforcing now 401s BOTH callers: cortex-api (`engineSpineClient.ts`, reads `ENGINE_API_GATE_TOKEN`) and hauska-mcp-server (`engine-api-client.ts`, reads `HAUSKA_ENGINE_API_GATE_TOKEN` ?? `HAUSKA_ENGINE_API_KEY`). Secret `HAUSKA_ENGINE_API_KEY` exists in hauska-prod-497015. **Procedure:** (a) set `ENGINE_API_GATE_TOKEN` (=that secret) on cortex-api AND hauska-mcp-server first, redeploy, verify zero 401s hitting engine; (b) THEN enforce on engine: `gcloud run deploy hauska-engine-api --project hauska-prod-497015 --region us-central1 --update-secrets ENGINE_API_GATE_TOKEN=HAUSKA_ENGINE_API_KEY:latest` (--update-secrets, NOT --set-env-vars). Single-variable; monitor engine logs for 401.

### 2. Setback fan-out is CORPUS-first, not extraction
The acceptance gate (#252, `lib/adapters/src/local/setbacks/gate.ts` + `docs/setback-extraction-acceptance-gate.md`) is ratified and CI-wired. San Marcos serves honest-empty because it has **zero code atoms in the corpus**. Next step is a San Marcos code-onboarding ingest (Municode/eCode360/PDF → clean code-section atoms) — NOT a setback extraction. Only after code lands do you run extraction → gate → human-review-promote → serve. Batch 3-5 jurisdictions per wave behind the gate.

### 3. Septic/OSSF — Comal Tier-1 PoC (survey filed 2026-07-15)
Only Comal has machine-pullable OSSF docs (predictable PDF URL). No county has an OSSF GIS layer. Hardest risk = phase-3 georeferencing scanned site plans onto parcels. Prototype on Comal before any fan-out. Do NOT build this wave unless prioritized.

### 4. Commercial data phase (external-gated)
RentCast (rent, ToS-cleared for display+cache; ~$74/mo entry — needs operator spend approval); MLS via eXp (comps/HOA — bizdev-gated on Valerie Thompson); Cotality MCP federation (UAT creds live + verified but **0 SKUs provisioned** — vendor owes; build the Hauska-MCP→Cotality-MCP adapter the moment tools appear, internal-eval-only per the 100/day closed-system agreement).

### 5. Small follow-ups
Comal land-use coloring (needs a Comal CAD roll — none loaded); WCAD Williamson land codes (same Orion `--land-file` fix as Hays, needs a WCAD re-ingest — its map is unaffected since county-GIS serves USECD, but the store would benefit).

## Operator-owned (do NOT run — Nick's tasks)
Bexar CAD roll via Public Information Request; WCAD tax-year confirm on next portal refresh; San Marcos code onboarding decision; RentCast/MLS go-ahead; Cotality SKU provisioning chase (email Michelle Taylor).

## Traps carried forward
- `permits-ingest` CLI: `pnpm --filter ... permits-ingest -- --flag` injects an extra `--` it rejects as positional. Use `pnpm exec tsx src/permits/cli.ts --flag` from `lib/cad-ingest/`.
- Migration numbering: check the live `lib/db/drizzle/` right before numbering; concurrent lanes collide (0054 collided this wave — resolved to 0055).
- Two dispatch double-spawns happened this wave (truncated prompts seeding shadow agents). Verify an agent's actual task/identity before re-messaging it; don't re-spawn a lane already in flight.
- cmdcenter deploys: `pnpm --filter ./apps/command-center build` must pass locally before merge (dev server hides prod-build gaps); it self-builds map-renderer first.
- Cheaper models for recon/probe/survey agents; strong model for code builds that open PRs.
