---
id: 00_current_state
title: Current state snapshot — 2026-08-20
status: pointer
last_updated: 2026-08-20
applies_to: portfolio
related: [_STATE, 90_operations/OPS-16_texas_market_plan_of_record, 90_operations/OPS-17_govtech_stack_plan_of_record, 90_runbooks/AGENT_CONTRACT, 90_runbooks/current_state_protocol]
---

# Current state snapshot

Pointer doc. Live revisions and standing decisions live in `_STATE.md`. Do not treat this file as the serving-revision ledger.

## 1. Active fires

- **Fire 1: GTM / checkout, not L26 fill.** Operator 2026-08-17: QA the live map at `https://smartsite.cloud`. Stripe checkout mechanically works; polish owed. Pipedrive with `smartsite` + tier tags. Pricing popup like lander signup. Hobby stays. Stand `_inbox/2026-08-17_l26_backfill_and_gtm_stand.md`. Do not restart Harris statewide-PBF. L26 lease heartbeat still live; do not start a second writer. Do not DROP cortex-prod `smart_file_*`.
- **Fire 2: G-60 demo path STOP.** Closed on demo path. ICC-demo https://icc-demo.vercel.app. WDLL 13 met. Residuals 7/18/19 held with L26. Pickup `_inbox/2026-08-16_icc_demo_planner_pickup.md`.
- **Fire 3: Doc_repo dirty tree.** Many uncommitted files from prior sessions. Commits are a named list, never the whole working tree.

## 2. In-flight sprints

- **OPS-16 / L26** Fill factory stopped. QA/launch on current map (A-017). Backfill redesign later. Plan `90_operations/OPS-16_texas_market_plan_of_record.md`.
- **OPS-17 Lane B** G-61 through G-65 CLOSED. Serving Dashboards `00007-8sc` `https://smartcity-dashboards-52ecsl5mvq-ue.a.run.app`. MCP `00082-mat` tag g11. Next card G-66 Dashboards UI (draft). Not a Bastrop cutover. Three identities: template-city demo, live Bastrop island, next-city pack. Path `_decisions/2026-08-17_dashboards_ui_then_one_feed.md`. `P:\smartcity-os` no-touch.
- **OPS-17 G-60** CLOSED_ON_DEMO_PATH STOP. ICC-demo https://icc-demo.vercel.app. Plan-review `00012-pen` @100% tag `g60g`. Applicant `/applicant?token=` met. Smart Files QA personas restored. Held: store UPDATE, F4, G-58b, G-50.
- **OPS-17 Lane A Smart Files.** G-58/G-59 CLOSED serving path. G-58b OPEN. `smart-files-app` is G-59 QA plus icc-demo rooms. Plan-review owns the review files UI.
- **L25** not seated. **L24** flood remainder banked. Do not redo flood.

## 3. Open ADRs to be aware of

- ADR-008: Hauska substrate, Empressa products. Plan review is Codex. Smart Files is the files product and store. ICC-demo is the licensed-IP access portal. Dashboards is Empressa.
- ADR-017 accessPolicy. Files default `tenant-private`. Unauth Dashboards must not publish live Bastrop ops.
- ADR-018 atom contract is Hauska substrate.

## 4. Agent fleet assignments

- Doc_repo planner (this seat): G-66 WDLL drafted, pending operator approval. Do not steal L26. Do not touch `P:\smartcity-os`. Do not start G-52 or a feed grant.
- L26 detached Node jobs: work root `P:/tmp/l26_flood_drain_20260815/`.
- Dirty `P:\legacy-design-tools` on `feat/s1-instrument-hardening`: never clean or stash.
- Dirty `P:\hauska-map` linked to Vercel `property-explorer`: never deploy Command Center or plan-review from it.
- `P:\smartcity-os` is no-touch.
- `P:\smart-files` has uncommitted `src/actors.mjs` + `web/` persona restore (live on Vercel). Do not lose it.
- `P:\icc-portal\web\.vercel\project.json` may still say `web`. Confirm `icc-portal-app` before deploy.

## 5. Recent session summaries

- 2026-08-19 Smart Site QA to enforcement doctrine (18 lanes; tier2 retired and deployed; branch protection gap): `_sessions/2026-08-19_smartsite_qa_to_enforcement_claude_code.md`
- 2026-08-18 Smart Site QA remediation (OPS-16 A-018, P-39..P-44; six lanes; fact-sheet contract): `_sessions/2026-08-18_smartsite_qa_remediation_claude_code.md`
- 2026-08-17 Lane B G-64/G-65 plus UI-then-one-feed: `_sessions/2026-08-17_lane_b_dashboards_g64_g65_planner.md`
- 2026-08-17 L26 GTM rulings (Pipedrive, popup, Hobby): `_sessions/2026-08-17_l26_gtm_rulings_planner.md`
- 2026-08-17 L26 QA/launch on current map: `_sessions/2026-08-17_l26_qa_launch_current_map_planner.md`
- 2026-08-16 G-60 ICC-demo stop: `_sessions/2026-08-16_g60_icc_demo_session_close_planner.md`
- 2026-08-16 ICC-demo separate portal: `_sessions/2026-08-16_icc_demo_separate_portal_planner.md`

## 6. Cross-cutting watch list

- Two plans of record. Work that cannot name `P-xx` or `G-xx` is not scoped. G-66 is draft until approved.
- Cotality extinguished. Deploys planner-owned. No privileged data. CTX/national HELD. Code-done is not customer-done.
- Gold parcel `48021:34137` on Dashboards is a demo fixture, not Bastrop onboarded.
- Plan-review files writes are reviewer uploads only. Planner does not seed Smart Files.
- Hauska inbound meter / ICC store UPDATE waits a quiet L26 slot.
- `MEMORY.md` is named and missing. Do not invent it this close.
