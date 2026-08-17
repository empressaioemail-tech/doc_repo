---
id: 00_current_state
title: Current state snapshot — 2026-08-17
status: active
last_updated: 2026-08-17
applies_to: portfolio
related: [_STATE, 90_operations/OPS-16_texas_market_plan_of_record, 90_operations/OPS-17_govtech_stack_plan_of_record, 90_runbooks/AGENT_CONTRACT, 90_runbooks/current_state_protocol]
---

# Current state snapshot

Pointer doc. Live revisions and standing decisions live in `_STATE.md`. Do not treat this file as the serving-revision ledger.

## 1. Active fires

- **Fire 1: L26 Texas ingest.** Lease L26 holds the atoms writer. Pickup `_inbox/2026-08-15_l26_gotomarket_pickup.md`. Do not start a second writer. Do not DROP cortex-prod `smart_file_*` while this is live. Do not ICC store UPDATE.
- **Fire 2: G-60 demo path STOP.** Closed on demo path. ICC-demo https://icc-demo.vercel.app. WDLL 13 met. Residuals 7/18/19 held with L26. Pickup `_inbox/2026-08-16_icc_demo_planner_pickup.md`.
- **Fire 3: Doc_repo dirty tree.** Many uncommitted files from prior sessions. Commits are a named list, never the whole working tree.

## 2. In-flight sprints

- **OPS-16 / L26** Texas flush to launch-gate grade. Plan `90_operations/OPS-16_texas_market_plan_of_record.md`.
- **OPS-17 Lane B** G-61 housing `empressaioemail-tech/smartcity-dashboards`. Scaffold at `P:\smartcity-dashboards`, not deployed. Item 6 MCP not on serving server. `P:\smartcity-os` no-touch.
- **OPS-17 G-60** CLOSED_ON_DEMO_PATH STOP. ICC-demo https://icc-demo.vercel.app. Plan-review `00012-pen` @100% tag `g60g`. Applicant `/applicant?token=` met. Smart Files QA personas restored. Held: store UPDATE, F4, G-58b, G-50.
- **OPS-17 Lane A Smart Files.** G-58/G-59 CLOSED serving path. G-58b OPEN. `smart-files-app` is G-59 QA plus icc-demo rooms. Plan-review owns the review files UI.
- **L25** not seated. **L24** flood remainder banked. Do not redo flood.

## 3. Open ADRs to be aware of

- ADR-008: Hauska substrate, Empressa products. Plan review is Codex. Smart Files is the files product and store. ICC-demo is the licensed-IP access portal.
- ADR-017 accessPolicy. Files default `tenant-private`.
- ADR-018 atom contract is Hauska substrate.

## 4. Agent fleet assignments

- Doc_repo planner (this seat): G-61 housing locked, scaffold local. Do not steal L26. Do not touch `P:\smartcity-os`.
- L26 detached Node jobs: work root `P:/tmp/l26_flood_drain_20260815/`.
- Dirty `P:\legacy-design-tools` on `feat/s1-instrument-hardening`: never clean or stash.
- Dirty `P:\hauska-map` linked to Vercel `property-explorer`: never deploy Command Center or plan-review from it.
- `P:\smartcity-os` is no-touch.
- `P:\smart-files` has uncommitted `src/actors.mjs` + `web/` persona restore (live on Vercel). Do not lose it.
- `P:\icc-portal\web\.vercel\project.json` may still say `web`. Confirm `icc-portal-app` before deploy.

## 5. Recent session summaries

- 2026-08-16 G-60 ICC-demo stop: `_sessions/2026-08-16_g60_icc_demo_session_close_planner.md`
- 2026-08-16 ICC-demo separate portal: `_sessions/2026-08-16_icc_demo_separate_portal_planner.md`
- 2026-08-16 G-60 ICC observer portal (reversed): `_sessions/2026-08-16_g60_icc_portal_planner.md`
- 2026-08-16 G-60 files UI + applicant view: `_sessions/2026-08-16_g60_files_ui_applicant_view_planner.md`
- 2026-08-15 Smart Files isolation + QA rooms: `_sessions/2026-08-15_smart_files_isolation_and_qa_rooms_claude_code.md`

## 6. Cross-cutting watch list

- Two plans of record. Work that cannot name `P-xx` or `G-xx` is not scoped.
- Cotality extinguished. Deploys planner-owned. No privileged data. CTX/national HELD. Code-done is not customer-done.
- Plan-review files writes are reviewer uploads only. Planner does not seed Smart Files.
- Hauska inbound meter / ICC store UPDATE waits a quiet L26 slot.
- `MEMORY.md` is named and missing. Do not invent it this close.
