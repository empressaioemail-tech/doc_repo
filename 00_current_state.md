---
id: 00_current_state
title: Current state snapshot — 2026-08-15
status: active
last_updated: 2026-08-15
applies_to: portfolio
related: [_STATE, 90_operations/OPS-16_texas_market_plan_of_record, 90_operations/OPS-17_govtech_stack_plan_of_record, 90_runbooks/AGENT_CONTRACT, 90_runbooks/current_state_protocol]
---

# Current state snapshot

Pointer doc. Live revisions and standing decisions live in `_STATE.md`. Do not treat this file as the serving-revision ledger.

## 1. Active fires

- **Fire 1: L26 Texas ingest.** Lease L26 holds the atoms writer. Flood 84/84 and Harris applied. Scoreboard at session close: phase `pipelines-redrain`, current `48035` started 2026-08-15T20:28:35Z, queue 193, deferred 52. Pickup `_inbox/2026-08-15_l26_gotomarket_pickup.md`. Do not start a second writer. Do not DROP cortex-prod `smart_file_*` while this is live.
- **Fire 2: Smart Files operator QA.** Isolation (G-58) and QA rooms (G-59) closed on serving path. Walk https://smart-files-app.vercel.app. Cortex stays unmounted.
- **Fire 3: Doc_repo dirty tree.** Many uncommitted files from prior sessions. Session-close commit must be a named list, never the whole working tree.

## 2. In-flight sprints

- **OPS-16 / L26** Texas flush to launch-gate grade. Plan `90_operations/OPS-16_texas_market_plan_of_record.md`. WDLL `_inbox/2026-08-15_texas_flush_server_plan_WDLL.md`. After pipelines: wells, footprints, roads, CAD 48439/48113/48135, ledger materialize, `node scripts/gate-grade.mjs`.
- **OPS-17 Lane A Smart Files.** G-58 CLOSED serving path. G-59 CLOSED serving path. G-58b OPEN (DROP after L26 quiet). G-56 remains Cortex prototype, not the home. G-53 sellable remains OPEN. G-11 login remains OPEN. Write MCP tools remain OPEN on the existing Hauska MCP server.
- **L25** drain rearchitecture not seated. Do not restart per-county JS pipeline runners.
- **L24** flood plan remainder banked; Harris applied under L26. Do not redo flood.

## 3. Open ADRs to be aware of

- ADR-008 engine factor-out (amended): Hauska substrate, Empressa products. Smart Files is an Empressa product.
- ADR-017 accessPolicy: five-value union. Files default `tenant-private`. MCP is the policy gate.
- ADR-018 atom contract is Hauska substrate. Files consume it; they are not the contract.
- ADR-020/021 encumbrances and file-set: folder membership is an edge, not identity.

## 4. Agent fleet assignments

- Doc_repo planner (this seat): OPS-17 Smart Files cards, session close, dispatch compile. Doc_repo commits are planner-owned and wait for operator go.
- L26 detached Node jobs: work root `P:/tmp/l26_flood_drain_20260815/`. Drain tree `l24-flood-plan-emit`. Pipeline tree `l26-pipeline-postgis`. `P:/hauska-engine` is stale.
- Dirty `P:\legacy-design-tools` on `feat/s1-instrument-hardening`: never clean or stash for Smart Files work.
- Dirty `P:\hauska-map` linked to Vercel `property-explorer`: never deploy Command Center from it.
- `P:\smartcity-os` is no-touch.

## 5. Recent session summaries

- 2026-08-15 Smart Files isolation + QA rooms (this close): `_sessions/2026-08-15_smart_files_isolation_and_qa_rooms_claude_code.md`
- 2026-08-15 L16B overnight recovery: `_sessions/2026-08-15_l16b_overnight_recovery_session_close.md`
- 2026-08-15 drain program and control plane: `_sessions/2026-08-15_drain_program_and_control_plane_claude_code.md`
- 2026-08-14 govtech program standup: `_sessions/2026-08-14_govtech_program_standup_claude_code.md`
- 2026-08-14 digital economies bulls: `_sessions/2026-08-14_digital_economies_bulls_program_claude_code.md`

## 6. Cross-cutting watch list

- Two plans of record run together. Work that cannot name OPS-16 `P-xx` or OPS-17 `G-xx` is not scoped. Dispatches are compiled via `node scripts/dispatch.mjs`.
- Cotality extinguished. Deploys planner-owned. No privileged data. CTX/national HELD. Code-done is not customer-done.
- Vercel project links: PE from hauska-map ROOT (`property-explorer`). CC from a worktree linked to `cmdcenter`. Smart Files QA from `P:\smart-files\web` into `smart-files-app` only.
- Files Neon `snowy-bread-83475727` only. Never cortex-prod `fancy-fire-06136146` or smartcity-os-prod `tiny-art-63602898` for files. DSN never in git, README, Vercel, or Cloud Run plaintext env.
- PE save/share is still the get-by. It is not Smart Files.
- `MEMORY.md` is named and missing. Do not invent it this close.
- This snapshot was reset 2026-08-15 from a 2026-08-10 kitchen-sink log that violated the 80 to 120 line protocol. History stays in `_sessions/`.
