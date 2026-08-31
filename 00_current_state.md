---
id: 00_current_state
title: Current state snapshot — 2026-08-30
status: pointer
last_updated: 2026-08-30
applies_to: portfolio
related: [_STATE, 90_operations/OPS-16_texas_market_plan_of_record, 90_operations/OPS-17_govtech_stack_plan_of_record, 90_runbooks/AGENT_CONTRACT, 90_runbooks/current_state_protocol]
---

# Current state snapshot

Pointer doc. Live revisions and standing decisions live in `_STATE.md`. Do not treat this file as the serving-revision ledger. **Caveat added 2026-08-31: `_STATE.md` is a pure concatenation of the six `_state/<seat>/STATE.md` files and carries NO smartsite-mcp or cortex-api revision at all; every seat source file predates its 2026-08-29T01:39Z generation, so regenerating it would refresh only its timestamp. For Smart Site MCP and cortex-api revisions, read Cloud Run by field name, not this file and not `_STATE.md`.**

**Canon change 2026-08-22.** [`19_the_instrument_contract.md`](19_the_instrument_contract.md) is ratified and governs the model portfolio-wide: node, atom with an intensional subject, edge, layer, instrument, lens, access as two fields, and the four-property benchmark. It supersedes `77_place_graph_strategy` as north star and subsumes `05_living_lineage_thesis`; `_rd_disclosure_twin/09_twin_read_contract` and the atom contract package sit under it as its executable forms. Program at [`24_instrument_conformance_program.md`](24_instrument_conformance_program.md), positioning at [`03c_records_as_instruments_positioning.md`](03c_records_as_instruments_positioning.md), seat briefs in `_inbox/2026-08-22_{property,substrate}_seat_instrument_brief.md`. **Nothing in 19 may be claimed in present tense externally unless its armed table says armed.** This header's date predates the change; edited as a single pointer line because this file has concurrent writers.

## 1. Active fires

- **Fire 1: GTM / checkout, not L26 fill.** Operator 2026-08-17: QA the live map at `https://smartsite.cloud`. Stripe checkout mechanically works; polish owed. Pipedrive with `smartsite` + tier tags. Pricing popup like lander signup. Hobby stays. Stand `_inbox/2026-08-17_l26_backfill_and_gtm_stand.md`. Do not restart Harris statewide-PBF. L26 lease heartbeat still live; do not start a second writer. Do not DROP cortex-prod `smart_file_*`.
- **Fire 2: G-60 demo path STOP.** Closed on demo path. ICC-demo https://icc-demo.vercel.app. WDLL 13 met. Residuals 7/18/19 held with L26. Pickup `_inbox/2026-08-16_icc_demo_planner_pickup.md`.
- **Fire 3: Doc_repo dirty tree.** Many uncommitted files from prior sessions. Commits are a named list, never the whole working tree.

## 2. In-flight sprints

- **THE FACTORY (OPS-19).** Plan `90_operations/OPS-19_factory_plan_of_record.md`. The six Central Texas counties serve `node-facets-tier1-conformant-v1` from walked card H production publishes (image `sha256:7bef3ce7`, LDT `889b1556`). That met A-020 shape. It is not county-complete. **Live remainder 2026-08-30T13:48:33Z: 232,770 unstamped 0,0. Do not quote pre-H 534,700 as live.** Travis `no-row` still 119,389 (situs never tried). Seed leak 0. Operator go on the remainder; cards at `_inbox/2026-08-30_ctx_facts_complete_WDLL.md` and `_inbox/2026-08-30_ctx_w1_bake_WDLL.md`. **Do not start W1 until the operator routes `_inbox/2026-08-30_ctx_remainder_deep_review.md`** (block-then-amend: landUse on W1, PE wiring card with a plan row, Wave R allowed but not customer-done). Rainmaker `48021:8720522` atom-miss is not a card H wipe; recon `_inbox/2026-08-30_rainmaker_open_complete_recon.md`. `_state/property/STATE.md` is stale (still card F / 534,700). Pickup `_sessions/2026-08-30_ctx_remainder_and_rainmaker_wiring_claude_code.md`. Deferred by A-020 stays deferred: wave 1 remainder, F-09, F-11 to F-14. Do not restart `scllr`. Do not lift the seed.

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

- 2026-08-31 P-91 v3 MCP half SHIPPED and VERIFIED LIVE. p563 vocabulary and display strings serving on `smartsite-mcp-00078-fat` (digest `sha256:ecc72a40`, LDT #562 merged `03050926`): one 19-entry table owned in one place, reaching the panel and the model, plus `displayText`, `agentGuidance` on every non-present facet, a derived-figures deny, and the unknown-overlay label/finding split. Operator seven-test walk passed on a reconnected connector: **the Neon write path is PROVEN end to end** (incident mitigation confirmed working; the incident itself is still mitigated-not-cured and unpooled), `atom_path_pending` no longer leaks, no derived figures invented, and **the `tools=` channel is MEASURED** (a held door hover produced the preview, discharging p562's one open limitation). Q1 selectors are CORTEX-BLOCKED by measurement, not built: `near` and `subdivision` need routes that do not exist; ask routed at `_inbox/2026-08-31_p91_q1_cortex_ask_property_seat.md`. A silent-degradation defect found on the records path (`BLK(?:OCK)?` can never match `BLOCK`). OPS-16 A-053 opens the v3 rows. Deploy `_inbox/2026-08-31_p91_p563_deploy.md`. **Still open: the panel is unverified against `cortex-api-00672-ceq`.**
- 2026-08-30/31 P-91 v3 scoped, ruled and APPROVED, then four MCP-only cuts shipped: p559 probe (all three iframe gates open), p560 anchor plus aerial ground, p561 multi-parcel canvas, p562 paint-only preview; serving `smartsite-mcp-00076-fes` (tag `dbfix`, running the p562 digest `sha256:674baef6`, so the revision name moved but the code did not) and `cortex-api-00672-ceq` (corrected 2026-08-31 from `00670-bay`, which was the secret-only dbfix redeploy on an unchanged digest; `00672-ceq` carries a NEW digest deployed 02:52Z by another seat, most likely the F-11 setback refuse LDT #560, and the P-91 v3 panel has NOT been verified against it). M1 (a cortex shared frame) proven UNNECESSARY: the anonymous facets route already serves a parcel anchor, so the whole wave touched no api-server file. **LIVE ISSUE: the Neon pooler injected read-only on `neondb` and killed every write across both apps; MITIGATED not cured by routing both services to the direct endpoint, so we run unpooled until Neon explains it** (`_inbox/2026-08-31_neon_pooler_readonly_incident.md`). Claude Sync verified buildable (`claude.ai/new?q=` prefills and executes). Report styling and vocabulary filed as V1-V8. Session `_sessions/2026-08-30_p91_v3_mcp_wave_claude_code.md`.
- 2026-08-30 CTX remainder cards, Rainmaker Open/wiring recon, deep review (W1 blocked pending operator route): `_sessions/2026-08-30_ctx_remainder_and_rainmaker_wiring_claude_code.md`
- 2026-08-29/30 P-91 deep dive, ruling (Open stays a turn), build to deploy: `smartsite-mcp` p557 (`00063-rej`) and `cortex-api` p542 (`00666-cuf`) serving; `ask_the_map` blocked; rails at first paint; existence fails closed; PRs #550/#551/#552 merged; operator QA walk graded the panel half (miss sentence still unobserved); Smart Site mark tile to ink live on smartsite.cloud (hauska-map #315): `_sessions/2026-08-29_p91_mcp_app_deep_dive_and_build_claude_code.md` v2 (2026-08-30): five lanes built and serving on p558 (`00065-siv`) and p543 (`00668-cos`), paired shift, p555 uuid-binding regression repaired; PR #555 squash-merged `24553cfc`; card `_inbox/2026-08-30_smartsite_mcp_app_v2_WDLL.md`, close `_inbox/2026-08-30_p91_v2_build_close.md`, walk W1 `_inbox/2026-08-30_p91_p558_connect_walk_prompt.md`.
- 2026-08-29 Team seats 3 + P-96 chrome pile + live `/favicon.ico` ICO (operator confirmed serving). This seat idle. `_sessions/2026-08-29_p96_chrome_and_team_seats_claude_code.md`
- 2026-08-28 Smart Site design system: Stone exact port opened (P-95) + chrome defect pile (P-96); design system rebuilt and swapped in; the chrome gate sees 7.1% of colour literals: `_sessions/2026-08-28_smart_site_design_system_stone_port_claude_code.md`
- 2026-08-28 P-91 situs-search budget, daily-limit bake 50000, Rainmaker live on `00643-rib`: `_sessions/2026-08-28_p91_situs_budget_daily_limit_claude_code.md`
- 2026-08-28 CTX six counties served (OPS-19 A-020 to A-025; card F on `00643-rib`): `_sessions/2026-08-28_ctx_six_counties_served_claude_code.md`
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
- `MEMORY.md` exists (six prose rows, unenforced). Do not invent a second copy this close.
- cortex-api traffic is pinned. Read `status.traffic[]` before asserting serving. Baked `CORTEX_USER_DAILY_API_LIMIT=50000` in LDT deploy-canary (`ci-cortex-daily-limit-50000`). Do not shift staging `00644-soz`.
