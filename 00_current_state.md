---
id: 00_current_state
title: Current state snapshot — 2026-08-16
status: active
last_updated: 2026-08-16
applies_to: portfolio
related: [_STATE, 90_operations/OPS-16_texas_market_plan_of_record, 90_operations/OPS-17_govtech_stack_plan_of_record, 90_runbooks/AGENT_CONTRACT, 90_runbooks/current_state_protocol]
---

# Current state snapshot

Pointer doc. Live revisions and standing decisions live in `_STATE.md`. Do not treat this file as the serving-revision ledger.

## 1. Active fires

- **Fire 1: L26 Texas ingest.** Lease L26 holds the atoms writer. Pickup `_inbox/2026-08-15_l26_gotomarket_pickup.md`. Do not start a second writer. Do not DROP cortex-prod `smart_file_*` while this is live. Do not ICC store UPDATE.
- **Fire 2: G-60 ICC portal elevate.** Files UI + applicant view are live (A-031). Next is the ICC observer portal on the same plan-review host, same manner: plan-review owns the UI, activity table is the store, do not seed writes, do not send ICC to Command Center. Pickup `_inbox/2026-08-16_icc_demo_planner_pickup.md`.
- **Fire 3: Doc_repo dirty tree.** Many uncommitted files from prior sessions. Commits are a named list, never the whole working tree.

## 2. In-flight sprints

- **OPS-16 / L26** Texas flush to launch-gate grade. Plan `90_operations/OPS-16_texas_market_plan_of_record.md`.
- **OPS-17 G-60** CLOSED_ON_DEMO_PATH plus A-031. Serving plan-review `00010-cey` @100% tag `g60f` origin `5952846`. UI `https://plan-review-app-ten.vercel.app` `dpl_5rjkGcE44C2FFLVhDHE7C8BUbGr5`. Smart Files is the files store. Applicant view is `/applicant?token=`. WDLL `_inbox/2026-08-16_icc_demo_program_WDLL.md`.
- **OPS-17 Lane A Smart Files.** G-58/G-59 CLOSED serving path. G-58b OPEN. `smart-files-app` is G-59 QA, not the plan-review room.
- **L25** not seated. **L24** flood remainder banked. Do not redo flood.

## 3. Open ADRs to be aware of

- ADR-008: Hauska substrate, Empressa products. Plan review is Codex. Smart Files is the files product and store.
- ADR-017 accessPolicy. Files default `tenant-private`.
- ADR-018 atom contract is Hauska substrate.

## 4. Agent fleet assignments

- Doc_repo planner (this seat): G-60 elevate, named commits, dispatch compile.
- L26 detached Node jobs: work root `P:/tmp/l26_flood_drain_20260815/`.
- Dirty `P:\legacy-design-tools` on `feat/s1-instrument-hardening`: never clean or stash.
- Dirty `P:\hauska-map` linked to Vercel `property-explorer`: never deploy Command Center or plan-review from it.
- `P:\smartcity-os` is no-touch.

## 5. Recent session summaries

- 2026-08-16 G-60 files UI + applicant view: `_sessions/2026-08-16_g60_files_ui_applicant_view_planner.md`
- 2026-08-15 Smart Files isolation + QA rooms: `_sessions/2026-08-15_smart_files_isolation_and_qa_rooms_claude_code.md`
- 2026-08-15 L16B overnight recovery: `_sessions/2026-08-15_l16b_overnight_recovery_session_close.md`
- 2026-08-15 drain program and control plane: `_sessions/2026-08-15_drain_program_and_control_plane_claude_code.md`
- 2026-08-14 govtech program standup: `_sessions/2026-08-14_govtech_program_standup_claude_code.md`

## 6. Cross-cutting watch list

- Two plans of record. Work that cannot name `P-xx` or `G-xx` is not scoped.
- Cotality extinguished. Deploys planner-owned. No privileged data. CTX/national HELD. Code-done is not customer-done.
- Plan-review files writes are reviewer uploads only. Planner does not seed Smart Files.
- Hauska inbound meter / ICC store UPDATE waits a quiet L26 slot.
- `MEMORY.md` is named and missing. Do not invent it this close.
