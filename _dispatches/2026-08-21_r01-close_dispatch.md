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

PLAN-ROW: R-01, R-02, R-04 (90_operations/OPS-18_canon_reconciliation_plan_of_record.md)

# Close R-01 against its own WDLL, then unblock R-02b and R-04b

## Mission — incoming planner: close R-01, then unblock R-02b and R-04b

You are taking over as planner. Read `_sessions/2026-08-21_ops18_lanes_and_instrument_rules_claude_code.md`
first; it is the handover and it is honest about what the previous planner got wrong.

Do not start by chasing a defect. Start by closing the thing four rows depend on.

---

## The situation in one paragraph

OPS-18 is a ten-row plan of record about one problem: **the artifact exists and nothing feeds
it or reads it.** Five lanes ran in parallel. Four returned and are landed. The blueprint they
were all supposed to grade against **fails two of its own criteria**, and both remaining halves
of the programme gate on it.

## Row state, verified, do not re-derive

    R-00  CLOSED    c6399e8. WDLL, 15 violations, 7 criteria.
    R-01  RAN, FAILS ITS OWN WDLL. D1 FAIL, D2 MET, D3 PARTIAL, D4 MET,
                    D5 FAIL, D6 MET, D7 PARTIAL.
    R-02  census done (1,998 files). QUARANTINE HALF OPEN, gated on R-01.
    R-03  DONE. 99 parts; 14 ZOMBIE; 10 with no termination condition, plus 3
                    the detector missed because it does not match "superseded".
    R-04  register half done (57 doc_repo controls, 43 product, 55/57 with a
                    non-empty bypass). BLUEPRINT-MAPPING HALF OPEN, gated on R-01.
    R-05  CLOSED.
    R-06  9 controls live, 5 BLOCKING, all five violation-verified.
    R-07  partially pre-empted: the store audit produced the 9-family key grammar.
    R-08  not started.
    R-09  FIRED. Canary cortex-api-00525-bev at 0%. Traffic is operator-owned.

## Your first job: close R-01

**D1 fails because the WDLL never bounded "the canon set."** The mesh classifies 60 documents,
which is a curated subset of an estate the census puts at 1,998 markdown files. Nobody can say
a subset of what. Fix the CRITERION as well as the mesh: state what the canon set is, by rule,
so the mesh is checkable rather than a judgement call. Amend `_blueprint/00_WDLL.md` if D1 is
what is wrong; a criterion that cannot be met is a defect in the standard.

**D5 fails because the diagram and the prose disagree.** The mermaid puts Candidate then
Provisional; the ASCII puts Provisional under Resolved. D5 exists precisely to catch a diagram
asserting something the text does not define, and it caught one inside the blueprint. Make them
agree, and say which was right.

D3 and D7 are PARTIAL and are cheaper: D3 wants every rule naming a consumer, D7 wants every
figure citing the log it came from (one special-district figure cites the wrong one).

Then R-02b and R-04b unblock and can run in parallel again.

## Do NOT start with hasWriter, and here is why it is tempting

`deriveHasWriter` returns `indeterminate` on cortex-api because the engine script is not on
that container. That is honest — it does not fake a `false` — but a permanent "cannot tell" is
not a measurement.

**The fix is already half-built and is one wire.** `RAIL_ENGINE_BINDINGS` is a committed table
shipping inside cortex-api. `railEngineBindingCoverage.test.ts` already verifies CI-fail-closed
that every declared writer script exists in a real hauska-engine checkout. So the declaration
is in production and the verification is in CI, and production probes a filesystem anyway. The
change is: trust the committed binding, because CI already proves it true.

That is a genuine defect and it is exactly the governing line in product code. **It is also one
row in the map R-04b is supposed to produce.** File it, do not chase it. The previous planner
spent most of a session on the R-09 chain and produced one wire and ten wrong statements.

## Read this before you verify anything

`ENFORCEMENT.md` gained four rules on 2026-08-21 after the previous planner made ten wrong
load-bearing claims in one session. Every one was an ad hoc shell instrument that returned a
plausible answer. Not one was caught by re-reading a conclusion; each was caught by a lane, a
seat, or a control.

    A load-bearing claim needs a file-based instrument that has been shown to fail.
    Never read multi-field CLI output through a positional formatter.
    Read the authoritative record, never a proxy for it.
    Pre-register the falsifier for your own checks, not only for other agents' work.

The shape was constant: **the check returned the expected answer, so it was not interrogated.**
Assume yours will too.

## Standing facts that will save you a session

The doc_repo tree moves under you; it moved four times in one hour. `git log -1` and `git fetch`
before staging, explicit pathspecs only, and read `git diff --cached --stat` before committing.
A `git add _scratch/` once staged 528 files and 208,108 lines of scraped HTML.

SEAT-01 is armed now and refuses writes from unregistered worktrees. Register before writing;
registering afterwards does not cure a write already made.

CI is a ratchet. Known debt is pinned; new debt fails. **Never raise a `baselineExit` to turn a
red build green.** `cited-untracked` is marked `environmentStarved` because it cannot fire in a
clean checkout, and that exemption is only honoured when the entry carries both its evidence
and its way out.

The memory promotion gate fires when the untriaged Tier 2 backlog grows past its pin. Triage is
a decision; declining is valid and is the honest outcome for most lessons.

## Open operator decisions, not yours

The canary traffic shift for R-09. ADR-010 and doc 77 need superseded-in-detail amendments;
ADR-028 needs a real ruling because it is proposed, partly shipped, and its bitemporality
argument rests on a table with zero rows. And DC-4/DC-5 count `no-atom`/`no-writer` while
R-09's compute stamps `derivation-indeterminate`, which those criteria do not count.

## Close

Update `90_operations/OPS-18_canon_reconciliation_plan_of_record.md` row statuses as you go.
File decisions in `_decisions/`. Tier 2 scratch to `_scratch/`, and leave promotion to the gate.

End with a `leave_behind:` block. `none` is valid and cheap; the declaration is required.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-21_r01-close_cp1.json
  CP2: _inbox/2026-08-21_r01-close_cp2.json
  CLOSE: _inbox/2026-08-21_r01-close_close.json
