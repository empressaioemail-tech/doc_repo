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

# Launch gate instrument repair

## Mission — R-09: make the launch-gate indicators capable of returning a red

You are a PLANNER. You fan workers, you adversarially review what they hand back, and you
assemble the result yourself. You do not commit.

### The defect, measured

Live `GET https://cortex-api-tds7av26va-uc.a.run.app/api/county-ledger` on 2026-08-20,
2,121,656 bytes, 254 counties x 14 rails = 3,556 cells:

    hasWriter        {"true": 3556}
    atomFamilyState  {"present": 3556}
    isPartial        {"false": 3556}
    displayState     {"not-yet": 2940, "satisfied-present": 540, "satisfied-absent": 76}

Three indicators are constant. Two of the five Texas-flush launch criteria are graded by two
of them: `_decisions/2026-08-11_texas_flush_launch_gate_amendment.md` resolves `no-writer` by
`hasWriter: true` and `no-atom` by `atomFamilyState` reaching present. **Those two criteria
cannot fail.** A criterion that cannot fail is not a criterion.

`displayState` is the only one carrying signal and it is doing all the work.

Prior evidence you must confirm or refute rather than inherit: `hasWriter` and
`atomFamilyState` were reported hand-declared rather than derived; `isPartial` was reported
as NOT dead but ERASED at read time, with the store holding 18 partial cells (all zoning)
while the served payload shows 0. A read-time depth gate clearing the field would be a
different defect from a constant field, with a different fix. Establish which it is.

### THE SCOPE FENCE. Read it twice.

**You repair an instrument. You do not close a cell and you do not change what the gate
requires.**

Do not mint absence atoms. Do not run a scorer to move a number. Do not touch the launch
criteria. Minting provenanced absence to close cells was explicitly REJECTED by operator
ruling as gaming the gate.

If you conclude a criterion is WRONG rather than merely ungradeable, you file that for the
operator and stop. Changing launch criteria is an OPS-16 amendment and is operator-ruled.

### Seat and repository

The manifest and its scorers live in `legacy-design-tools`, which the **property seat** owns
per `_catalog/seat_register.json`. The serving path is `cortex-api`.

You may read anything. Before you write a line of product code, confirm with the operator
that you hold the property seat for this row, or hand your prescribed change to the seat that
does. Do not write into a repository you do not own. `P:/legacy-design-tools` is dirty on
`feat/s1-instrument-hardening`: never clean or stash it. Work in your own worktree.

### What done looks like

Each of `hasWriter`, `atomFamilyState` and `isPartial` **demonstrably takes more than one
value**, proven by producing a cell that reads negative. Not by reading the code and
concluding it could. By making one fire.

The proof is the deliverable. For each indicator: what you injected, which cell went
negative, the live payload showing it, and the restore.

Where an indicator cannot be made to fire because its input genuinely does not exist yet,
that is a finding and you state it as one: the indicator is STARVED, name the input, name who
would supply it, and file it. Do not fabricate an input to make a green look earned.

### The three mechanisms to distinguish, because the fix differs

**Constant by hand-declaration.** The field is set by a declaration file that says true
everywhere. Fix: derive it, or delete the field, because a constant field is worse than an
absent one.

**Erased in transit.** The store holds variation and the read path flattens it. Fix: stop
flattening, and add a divergence test between store and served payload.

**Starved.** The field is derived correctly and its input is never populated. Fix: populate
the input, or declare the indicator unavailable rather than serving a default.

Do not report one when you have evidence of another. Establishing which requires reading the
WRITE path, not measuring the output. Every real defect in this operation to date was found by
reading a write path; none were found by measuring output, because measuring output applies
the same predicates that admitted the defect.

### Adjacent facts that will confuse you if you do not hold them

`railCapabilities` carries a per-rail ceiling the grid ignores, scoring every rail against
254. `rrc-wells` has ceiling 1, `owner` 15, `mud` 186, `rail-corridor` 253. `rrc-wells` at
0/254 manufactures a 253-county hole that does not exist.

Bastrop `48021:zoning` was reported carrying the ENVELOPE rail's measurement verbatim; real
zoning there measures about 15.22%, not 99.77%.

There is no recompute route. `/api/county-ledger/recompute` and `/refresh` return the SPA
HTML fallthrough. What moves the manifest is a scorer run in hauska-engine. A console re-read
that does not move `computedAt` is evidence of staleness, never of a successful refresh.
Every figure from this endpoint is a claim about its `computedAt`, never about now.

Those are context. **None of them are your row.** Record any you confirm; fix none of them.

### Fan discipline

Split by indicator, one worker each, so no two workers touch the same write path.

Adversarially review every return. When a worker says an indicator now varies, ask for the
live payload and the cell id. When a worker says it cannot vary, ask which write path they
read and which line sets the value. A clean output is a reason to distrust the instrument,
not a result.

Workers do not spawn workers. Workers do not commit. You do not commit.

### Hard stops

No `--apply`. No store writes. No migrations. No deploys to production traffic. No absence
minting. No scorer runs that move a published number. If your change needs a deploy to
demonstrate, use a canary with `--no-traffic`, smoke it, and report; do not shift traffic.

### Return

A close naming: repo and commit for everything you read and everything you changed; for each
of the three indicators, the mechanism you established (hand-declared, erased, or starved)
with the write path and line that proves it; the proof-by-firing for each you could make fire;
and the filed finding for each you could not, naming the missing input and its owner.

State plainly whether the two launch criteria are now capable of failing. If the answer is
partly, say which part.

Tier 2 scratch to `_scratch/r09_gate_repair.md` using LESSON, DEAD-END, GROUND-TRUTH with
timestamps, OPEN.

End with a `leave_behind:` block. `none` is valid and cheap; the declaration is required.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-21_r09-gate-repair_cp1.json
  CP2: _inbox/2026-08-21_r09-gate-repair_cp2.json
  CLOSE: _inbox/2026-08-21_r09-gate-repair_close.json
