CANON-PREAMBLE v6c68a963

- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HELD until Bastrop QA-done + operator go.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- SMARTCITY PRODUCT LINE THEN UI THEN ONE FEED — template Dashboards UI first, then one adapter/source onto `template-city`. Live Bastrop is an island, not the next card. Three identities: `template-city` demo, live `tenant_id=2` Bastrop, next onboarded city. Do not rewrite `tenant_id=2` in place. CitizenConnect is the citizen lens, not a SKU. Feeds are adapters that write records. Destination still `_decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding.md`. Next-card sequence `_decisions/2026-08-17_dashboards_ui_then_one_feed.md`. Gap map `_inbox/2026-08-17_dashboards_missing_pieces.md`.
- FEED ADAPTER CONTRACT (G-63 CLOSED) — kinds are a catalog; grants are per city pack. Write spine or files with provenance. Never a Dashboards vendor table. Never Pipedrive as a city feed. Samsara fleet copies are not G-24. Decision `_decisions/2026-08-17_g63_feed_adapter_contract.md`.
- G-11 CITY-PACK TENANCY (CLOSED 2026-08-17 as sequencing) — a city pack is the tenant. Identified caller is a Hauska product key whose `jurisdiction_tenant` equals `cityKey`. `DASHBOARDS_API_KEY` is not a tenant. Fixture pack `fixture-city`. Not sprint-54 done. Not live ingest. WDLL `_inbox/2026-08-17_g11_tenancy_WDLL.md`. Decision `_decisions/2026-08-17_g11_city_pack_tenancy.md`. Close `_inbox/2026-08-17_g11_close.json`.
- G-45 SMARTSITE STAFF MAP (CLOSED 2026-08-17) — Dashboards staff map is the SmartSite embed of gold `48021:34137`. GET `/` auto-loads it. Do not cut live Leaflet. Do not clone PE. WDLL `_inbox/2026-08-17_g45_smartsite_staff_map_WDLL.md`. Decision `_decisions/2026-08-17_g45_smartsite_staff_map.md`. Close `_inbox/2026-08-17_g45_close.json`.
- G-64 LANE C STAFF PATH (CLOSED 2026-08-17) — Dashboards development-services mounts plan-review-app. GET `/?lens=development-services` auto-loads it. GET `/` stays G-45 SmartSite. Do not cut live PermitFlow. Do not start G-52. WDLL `_inbox/2026-08-17_g64_lane_c_staff_path_WDLL.md`. Decision `_decisions/2026-08-17_g64_lane_c_staff_path.md`. Close `_inbox/2026-08-17_g64_close.json`. Serving Dashboards `00007-8sc`.
- G-65 PERMITFLOW KILL (CLOSED 2026-08-17) — PermitFlow dead as a Dashboards product. Live `/permitflow/*` uncut until a named island replacement. WDLL `_inbox/2026-08-17_g65_permitflow_kill_WDLL.md`. Decision `_decisions/2026-08-17_g65_permitflow_kill.md`. Close `_inbox/2026-08-17_g65_close.json`.
- COMPASS IS SHARED-ELEMENT SHEET CHROME — G-66 item. Top-bar source control, not a page, not a rail-only assistant. Answer engine is out of this wave. Old Compass is not the atom-render reference; SmartSite is. Decision `_decisions/2026-08-17_ux_implementation_sequence.md`.
- UX IMPLEMENTATION SEQUENCE (G-67 first) — kit copy, then G-66 / G-68 / G-69 in parallel. Those three CLOSED 2026-08-17. G-24 stays zero. Live Bastrop no-touch.
- FILES COMPOSE THEN ONE FEED (G-70 G-71 G-72 CLOSED 2026-08-17) — Work → Files mounts smart-files-app. G-71 wrote Bastrop municode meetings onto `template-city` files. That host is a HOLD (identity collapse), not a feed win. Decision `_decisions/2026-08-17_files_compose_then_one_feed.md`.
- SHELL BEFORE FEEDS (G-73 CLOSED 2026-08-17) — Every G-18 / live-Bastrop staff function has a named home on the Dashboards shell. Connections is 67 of 67 Homes-table rows. Assets honest-empty. Feeds still pause. Register `_inbox/2026-08-17_g18_shell_homes.md`. Decision `_decisions/2026-08-17_shell_before_feeds.md`. WDLL `_inbox/2026-08-17_g73_shell_homes_WDLL.md`. Close `_inbox/2026-08-17_b_g73_close.json`.
- TEMPLATE-CITY IDENTITY (G-74 CLOSED 2026-08-17) — municode grant pulled off template-city. Compose meetings empty with basis `no municode calendar grant on template-city`. Citizen has no Chestnut. Connections HTML has zero Bastrop. No clerk retarget. Decision `_decisions/2026-08-17_template_city_identity.md`. WDLL `_inbox/2026-08-17_g74_identity_leak_WDLL.md`. Close `_inbox/2026-08-17_b_g74_close.json`.
- DEMO-CITY CHROME (G-75 CLOSED 2026-08-17) — mounts fill the frame, one SmartSite iframe, Compass-class map motion from current rails, 30c screens honest-empty. Serving `00013-vkl`. Plan Review `embed=1` is Dashboards-side; host already had detection. Interruptibility partial. Register 67 of 67 plus 3 addenda. Note `_inbox/2026-08-17_g75_shell_mounts_motion.md`. WDLL `_inbox/2026-08-17_g75_shell_mounts_motion_WDLL.md`. Close `_inbox/2026-08-17_b_g75_close.json`. Handoff `_inbox/2026-08-17_demo_city_template_handoff.md`.
- SMARTCITY PRODUCT-LINE DESIGN SYSTEM — one Empressa kit governs Dashboards, Smart Files, Plan Review, and future Asset Management. Not a Dashboards-only theme. Not Hauska chrome. Decision `_decisions/2026-08-17_smartcity_product_line_design_system.md`.
- SMARTCITY VISUAL LAW (session 1, operator loved 2026-08-17) — quiet surfaces, loud exceptions, honest absence. Register not card deck. Sidebar. Inverted applicability (Pass quiet, Unchecked hatch). Inter + Plex Mono, 12px floor. Environment badge. Not-built nav. Provenance chip; no bare confidence. Code citation has no ICC body slot. Light `--sc-atom` `#177F78`, dark `#4CC9C0`. Kit extract `_inbox/2026-08-17_sc_kit.css`. Decisions `_decisions/2026-08-17_smartcity_visual_law.md` and `_decisions/2026-08-17_atom_accent_light_hex.md`.
- SMARTCITY DASHBOARDS HOUSING — one product repo `empressaioemail-tech/smartcity-dashboards`, cities as tenant packs. Live Bastrop stays `smartcity-os` until a named island replacement. Decision `_decisions/2026-08-17_smartcity_dashboards_housing.md`.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

---

# Seat: property

# Property seat state

Preserved from _STATE.md at the 2026-08-20 topology split. Write this file, not the generated combined view. Duplicate branch-protection paragraphs from the concurrent double write were removed; the surviving record is `_state/systems/STATE.md`. The Smart Markets block moved to `_state/markets/STATE.md`.

Single source of truth for WHERE WE ARE RIGHT NOW. Not decisions (those are in memory / _decisions/), not history (those are in _sessions/). Live state a fresh agent picks up from; edit it constantly. **Last updated: 2026-08-20. Property namespace. Restructured from _STATE.md; branch protection lives in _state/systems/STATE.md.**

**LANE B 2026-08-19 (waves 1 and 2 SHIPPED): TEMPLATE CITY BUILD IS RUNNING.** Read `_inbox/2026-08-19_template_city_lens_build_sheet.md` and OPS-17 rows **A-073 to A-079**. **THE CORRECTION THAT OPENED THIS: the G-18 register's `Not built` meant THIS SURFACE DOES NOT EXIST YET, and three agent handoffs hardened it into THIS SURFACE IS MEANT TO BE EMPTY.** Rulings: honest absence is now about SOURCES per region, not screens; the department roster matches live and GROWS; demo data on every lens with one `Demo` chip. Dashboards main **`1b271c8c3dc7bf361c09f00a095cc8e9022a6946`**, serving **`smartcity-dashboards-00025-mam` @100%**, suite **320/320**. Kit main **`17eccfade057c0f8a835b8731be834cd4b828166`**, vocabulary **143**, components **86**, Design project **482** files. **Registry: 11 domains, 10 carrying on `template-city`, 0 of 11 on `empty-city`; `patrol-vehicles` stays the single `ungranted` region on purpose** — granting everything deletes the state that proves ruling 1. Footer now carries two claims: `0 of 10 sources granted` beside `6 of 10 demonstrated with fixture records`. Connections register split to **70 rows / 5 addenda**. **WAVE 3 SHIPPED 2026-08-20** under OPS-17 rows **A-080 to A-084**. Every department lens now renders its domain. Conformance instrument is live and is the reason wave 3 grew: 92 scans over 23 surfaces DERIVED from route definitions (the hand-built list of 16 was 30% short), 0 unwaived nodes, 132 adjudicated, bound stated as JUDGED not CONTAINED. Vertosoft handoff bundle assembled at `P:/tmp/VPAT/vertosoft_handoff_2026-08-20/` (tagged PDFs + CSV, verified against an untagged control). Heads and serving revisions are in the L1/L2 closes, not restated here. **OPEN and dispatchable: G-103 shared tagged-PDF render service, G-104 SmartSite title + glyph fix.** Both compile through `scripts/dispatch.mjs`; a fabricated row refuses. The eleven domains reach no pixel; all fifteen lenses share one `web/index.html` and one unpartitioned `web/shell.css`, so lens rendering merges one at a time. **Open, operator-owed:** Parks and Court are NOT expressible on the seam (four gate points, pinned to go red if a vendorless path appears) and four build-sheet lenses have no vendor — W2DEPT-F2; the register's disposition column is still hand-declared and can drift; the Design picker walk is STILL unrun. Closes `_inbox/2026-08-19_w2ds_close.json`, `_w2dept_close.json`, `_w2fix_close.json`.

**DRAIN STATUS 2026-08-17: L26 IDLE, QA/LAUNCH ON CURRENT MAP.** Read `_inbox/2026-08-17_l26_backfill_and_gtm_stand.md` first. Decision `_decisions/2026-08-17_qa_launch_current_map.md`. GTM `_decisions/2026-08-17_smartsite_gtm_pipedrive_popup_hobby.md`. Pickup `_inbox/2026-08-15_l26_gotomarket_pickup.md`. 15-min scoreboard loop PID 85672 **dead**. Lease **L26** heartbeat PID **22096** still live (expires ~21:53

AGENT-CONTRACT v92aa194c — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
interruption recovery, slot law + lease, heavy-scan serialization, verification rules, close schema).
Read it before any work; where this dispatch and the contract disagree, STOP and report.

DEV-PROCESS vbb19bd34 — you are bound by 90_runbooks/DEV_PROCESS.md in full. It governs how work
is SHAPED and how a result is JUDGED: coverage figures travel with their denominator, classes are
measured never subtracted, an instrument's exclusion set is part of its contract, gating indicators are
proven able to fire, paired controls need a divergence test, guardrails that do not survive a clone are
not guardrails. Every rule in it is traced to an incident. Read it before any work.

PLAN-ROW: R-09 (90_operations/OPS-18_canon_reconciliation_plan_of_record.md)

# Finish R-09: prove the launch-gate indicators can return a red

## Mission — property seat: finish R-09, prove the indicators can return a red

You own `legacy-design-tools`. You built both halves of this. The planner took it as far as it
could and stopped at a production-affecting step that is yours to judge, not its.

Work in `P:/seat-worktrees/property/legacy-design-tools` on `seat/property`. SEAT-01 is armed
now and refuses writes from any other worktree, including the shared checkout at
`P:/legacy-design-tools`, which is dirty on `feat/s1-instrument-hardening` with 63 files and
must never be cleaned or stashed.

---

## STATE, verified, do not re-derive

**Merged.** PR 447 merged as `4a52dee1`. Merged on the PR HEAD `164378da`, not on the SHA the
R-09 close named; the branch had moved four commits past it.

**Deployed as a CANARY AT ZERO PERCENT.** This is the deploy workflow behaving as designed.

    100%  cortex-api-00522-row               <- SERVING. Pre-R-09 code.
      0%  cortex-api-00524-pit  tag=canary   <- R-09's code
    canary URL: https://canary---cortex-api-tds7av26va-uc.a.run.app

**The recompute works.** `POST /api/county-ledger/recompute` with
`Authorization: Bearer $SERVICE_API_KEY` (secret `SERVICE_API_KEY`, project
`legacy-design-tools-prod`) completes and COMMITS. Cloud Run cuts the CLIENT at 300s with a
504 while the transaction lands. Two ran today; `summary.computedAt` moved 2026-08-14 ->
`2026-08-21T12:39:05.869Z` -> `2026-08-21T12:48:59.242Z`. Both ran on the SERVING revision,
so both wrote a snapshot computed by PRE-R-09 code.

**The advisory lock clears.** It is held for the run and released when the pooled connection
is reaped. It is not permanently orphaned; a filed note saying otherwise is corrected in
`_inbox/2026-08-21_recompute_lock_orphaned_on_cloud_run_timeout.md`.

**The indicators have not moved on any read.** 3,556 cells, `hasWriter` true on all,
`atomFamilyState` present on all, `isPartial` false on all. Canary and production return
BYTE-IDENTICAL payloads (2,121,675) on the same stored snapshot, so R-09's read-path overlay
makes no difference to a snapshot the old compute wrote.

---

## THE ONE THING THAT IS ACTUALLY UNPROVEN

Whether R-09's COMPUTE produces indicators that take more than one value.

Nothing established today touches that. Every recompute so far ran old compute. Every read,
canary or production, read a snapshot old compute wrote.

---

## THE CLEAN PATH, and it is why this is small

`dryRun` is a **QUERY PARAMETER**, read by `firstQueryValue(req, "dryRun")`. It is NOT a body
field. The planner sent it in the body, it was silently ignored, and a full real recompute
started by accident. Do not repeat that.

    POST https://canary---cortex-api-tds7av26va-uc.a.run.app/api/county-ledger/recompute?dryRun=1

That runs **R-09's compute on the canary**, diffs against the stored snapshot, reports what
WOULD change, and **writes nothing**. It proves or disproves the row without touching what
production serves.

Run it in the background or with a client timeout above 300s. It will 504 at the edge; that
does not mean it failed. Read the diff from the response if you get one, and from the request
log if you do not.

---

## What done looks like

**A firing, with a cell id.** Name a specific county and rail whose `hasWriter`,
`atomFamilyState` or `isPartial` returns a negative value under R-09's compute, and show the
payload it came from and which revision produced it. `latestReadyRevisionName` is NOT the
serving revision; the authoritative answer is `resource.labels.revision_name` on the request
log line for your own request.

**Or a disproof, which is equally valuable.** If R-09's compute still produces constants, say
so and name the mechanism: hand-declared, erased in transit, or starved. The three have
different fixes and the evidence for each lives in a different place. Do not report one when
you have evidence of another.

---

## Fences

**No traffic shift.** Promoting the canary to serving traffic is an operator decision and is
outside this row, exactly as R-09's original dispatch stated.

**No non-dry recompute against the shared snapshot from canary code** without saying so first.
Both revisions read one database. A snapshot written by canary compute is immediately served by
the production read path, which is not the code that wrote it.

**No absence minting. No `--apply`. No store writes. No migrations.** You repair an instrument;
you do not close a cell and you do not change what the gate requires. If a launch criterion is
WRONG rather than merely ungradeable, file it for the operator and stop — criteria are an
OPS-16 amendment.

---

## Three planner errors from today. Carry them; do not repeat them.

**Twice** the planner reported the serving revision as `00524-pit` at 100 percent, claiming to
have checked the traffic split. It had misread semicolon-aligned `gcloud --format="value(...)"`
output where the percent column shifts. Use `--format=json` and read `status.traffic[]`, or
read the revision off the request log line.

It reported the advisory lock permanently orphaned, from two 409s taken minutes apart.

It reported the route incapable of completing, when the route completes and commits and only
the client is cut.

All three were confident verification claims on facts never established, and all three shared
one shape: **the check returned the expected answer, so it was not interrogated.** A convenient
result is a reason to distrust the instrument.

---

## The residual defect, filed, not yours to fix in this row

`SET LOCAL statement_timeout = 240_000` bounds ONE STATEMENT.
`computeCountyLedgerPayload` runs a capability probe per rail, each in its own SAVEPOINT, plus
the snapshot read and write. N statements each under 240s run unbounded past Cloud Run's 300s
ceiling, so the 504 is structural. Raising or lowering the statement timeout changes nothing.
It needs a transaction-level or request-level deadline, or the scan off the request path.
Filed at `_inbox/2026-08-21_recompute_lock_orphaned_on_cloud_run_timeout.md`.

---

## Return

Close naming: repo and commit for everything read and changed; which revision served each
request you made, taken from the log line; the dry-run diff; and either the firing with its
cell id or the disproof with its mechanism. State plainly whether the two launch criteria
graded by `hasWriter` and `atomFamilyState` are now capable of failing, and if only partly,
which part.

Tier 2 scratch to `_scratch/r09_finish.md` using LESSON, DEAD-END, GROUND-TRUTH with
timestamps, and OPEN.

End with a `leave_behind:` block. `none` is valid and cheap; the declaration is required.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-21_r09-finish_cp1.json
  CP2: _inbox/2026-08-21_r09-finish_cp2.json
  CLOSE: _inbox/2026-08-21_r09-finish_close.json
