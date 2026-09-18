CANON-PREAMBLE v49001500
- COTALITY REST IS DEAD, THE VENDOR IS RE-ENGAGED FOR THE FARM, AND WE SHIP WITHOUT IT (operator 2026-09-16, `_decisions/2026-09-16_texas_scaleup_sequence_and_four_rulings.md`; operator 2026-09-17, OPS-16 A-212): when code hits Cotality REST (502/OAuth/fallthrough), re-route to county-gis/public-record and NEVER rotate the credential. The MCP eval channel is live for internal evaluation only. No vendor-sourced value reaches a customer until the commercial agreement is read, and the factory never bulk-calls the vendor. **The vendor is about two weeks out as of 2026-09-17 and NOTHING waits on it:** Cotality is struck from the Phase 0 exit criteria, and every rail that wanted it ships as a DECLARED absence — `unaccounted` at rest, labelled where a customer reads it, never fabricated, never a silent gap, and never relabelled `absent-verified` to clear a gate. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HOLD LIFTED 2026-08-26 for the Factory program (`_decisions/2026-08-26_factory_program_and_hold_lifts.md`); the Bastrop QA condition is cosmetic and does not gate the data path. NO PRIVILEGED DATA and the Hauska spine rule stand.
- THE FACTORY IS THE ONLY WRITER PATH (OPS-19) — one machine built to the MODEL LAW (`19_the_instrument_contract.md`, `_blueprint/10_model.md`, `_blueprint/20_pipeline.md`, `_blueprint/40_rule_register.md`, `51_ingestion_pipeline_reference.md`, `24_instrument_conformance_program.md`; package `dist/*.d.ts` is the tiebreaker); own repo `hauska-factory`, own Neon store; every publish lands on staging before the identical job runs on production; nothing reaches a serving store except through publish; laptop ingest is FROZEN (`_decisions/2026-08-26_ingest_freeze_and_cloud_loader.md`); OPTION A ruled (`_decisions/2026-08-26_factory_model_law_and_option_a.md`): no new county is written on the old shape and old-shape writes ended permanently 2026-08-27. Every lane has its own registered worktree; never build in another lane's checkout. Row-level status lives in `_catalog/program_preambles/OPS-19.md` and `_state/property/STATE.md`, never here.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- MOST-CURRENT SOURCE WINS (operator 2026-09-11) — for setbacks and every dimensional rule, in every city and county, the source with the most recent effective date supplies the value; tier breaks ties only on equal or unreadable dates; dates are read at source (ordinance effective date, ArcGIS `editingInfo.lastEditDate`), never assumed from source kind; an unreadable date produces a conflict row with both values, never a silent pick. Supersedes tier-first ranking in LDT `authoritativeSetbackSource.ts` and layer-23-first in hauska-map. `_decisions/2026-09-11_setback_source_most_current_wins.md`.
- ENVELOPE DRAWN, FIGURE REFUSED (operator 2026-09-11) — Ruling B reversed for the polygon only: map and MCP draw block draw the modelled buildable envelope from the same `place/buildable-envelope` call with its disclosure wherever a district and setback table exist; buildable area and percent stay refused until an envelope atom backs them. Entitlement gate unchanged. `_decisions/2026-09-11_ruling_b_reversed_polygon_only.md`.
- THE LEDGER IS THE SERVING PATH, ATOMS ARE CANONICAL (operator 2026-09-11) — node = identity, atom = one claim from one authority at one time, edge = an atom whose value is a node; a cell is accounting (state, atom reference, provenance, cached rendering keyed to atom version and vocabulary version), never a copied value; one reader in `hauska-engine/services/retrieval-api` walks gated cells and dereferences atoms and every surface and the Hauska MCP catalog consume it; unslated rails refuse, never fall to legacy; one writer mints atom + pointer + rendering in one transaction; one vocabulary module in the atom-contract package. Never add a read path, a vocabulary copy, or a value-holding cell. `_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md`, ADR-031 amendment 2026-09-11, OPS-23 §0.
- DO TOOLING IS CONFIGURED FLEET-WIDE, BUT DOCTL AUTH IS PER-SESSION (operator 2026-09-17, corrected 2026-09-17 per OPS-25 D-11's close) — the `do-apps`/`do-droplets` MCP servers are configured in the global Cursor config on the fleet machine with an agent token scoped to Droplets and Apps only (no account, database, or networking access), and that MCP config travels with any lane using this machine's Cursor. `doctl`'s own CLI auth does NOT reliably carry over to every lane's session (found unauthenticated in D-11's environment) — a lane needing `doctl` specifically, not just the MCP tools, should confirm with `doctl account get` and run `doctl auth init` itself if needed, rather than assume it is live. Do not ask the operator to reconfigure the MCP servers or token; do check `doctl` auth per-session.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

AGENT-CONTRACT v378cd643 — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
interruption recovery, slot law + lease, heavy-scan serialization, verification rules, close schema).
Read it before any work; where this dispatch and the contract disagree, STOP and report.

DEV-PROCESS vbb19bd34 — you are bound by 90_runbooks/DEV_PROCESS.md in full. It governs how work
is SHAPED and how a result is JUDGED: coverage figures travel with their denominator, classes are
measured never subtracted, an instrument's exclusion set is part of its contract, gating indicators are
proven able to fire, paired controls need a divergence test, guardrails that do not survive a clone are
not guardrails. Every rule in it is traced to an incident. Read it before any work.

FLEET-MEMORY v2a98086b — you are bound by 90_runbooks/fleet_memory_practice.md (M0).
The verbatim install block follows. Product-repo agents do not carry .cursor/rules; this is the install.

FLEET MEMORY (M0): As you work, capture build knowledge in a scratch block you return in your close, using four entry kinds — LESSON (a hard-won fact worth a test/note), DEAD-END (a tried-and-failed path + reason, so it is not retried), GROUND-TRUTH (a live-verified state WITH its timestamp), OPEN (a live thread the next context must pick up). Read any scratch context passed to you FIRST before re-deriving. Do NOT promote anything to durable memory yourself — return lessons in your close; the planner gates promotion. Nearing your limit, flush open threads + live ground-truths into your close so the next instance starts warm.

PLAN-ROW: G-164 (90_operations/OPS-17_govtech_stack_plan_of_record.md)
FAN-DEPTH: 0
This lane launches NO sub-agents. Do the work yourself. The commit gate refuses a close that declares any (A-181).

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane g164-design-repairs --seat <your-seat-id> --plan-row G-164 --dispatch _dispatches/2026-09-18_g164-design-repairs_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane g164-design-repairs --seat <your-seat-id>

On 2026-09-14 this exact dispatch shape was handed to two sessions at once. One found
out mid-execution from a merged commit appearing in its own fetch.

# PROGRAM CONTEXT — OPS-17 govtech stack (Dashboards, Smart Files, Plan Review, ICC demo)

You are working a lane of OPS-17. The rulings below were standing decisions in the shared
preamble until 2026-09-11; they are program law and moved here so lanes in other programs stop
carrying them. Each still binds every OPS-17 lane. If this section conflicts with the general
canon preamble, this section is narrower and wins on scope; if it conflicts with the AGENT
CONTRACT or ENFORCEMENT, those win.

- BASTROP IS THE PROVING PACK (operator 2026-09-18, `_decisions/2026-09-18_bastrop_is_the_proving_pack.md`, OPS-17 A-146). SmartCity designs are implemented and PROVEN on `bastrop_tx`, against the live data Bastrop already has wired. `template-city` is a demo and fixture pack, and a pass on it is not a pass on a Bastrop design. `bastrop_tx` grants seven live feeds today (municode calendar; MyGov, one kind-level grant covering permits, work orders, inspections, code violations and business licenses; Samsara, Spireon, FirstDue, Power BI CIP, GoTo), so Development services, Fleet, Police, Public works and Fire and EMS can read live Bastrop data now. Four rules. (1) Verify every dashboards design build on `bastrop_tx` and its granted feeds. (2) Bastrop data that is wired in v1 but not reachable from v2 (OpenGov, OpenGov budgeting and planning, v1 permit revenue, the v1 executive overview) is a BRIDGE to card, never a fixture to fall back on: a v1 platform route, a v2 adapter declaration, and a `bastrop_tx` grant. Until the bridge lands, the surface says so as a declared absence. (3) Never default a city: a route that takes `cityKey` REFUSES when it is missing, because a `template-city` default silently serves demo data. (4) v1 (`smartcity-os`, behind `smartcityos.io`) is still production. Adding a platform route to it is a bridge and is allowed; every v1 deploy goes by canary with `services[0].source_commit_hash` read back (OPS-25 rule 13), and the v1 surface Bastrop uses today is never broken. This SUPERSEDES the August template-city-first, "live Bastrop is an island", "live Bastrop no-touch" and "live Bastrop stays `smartcity-os`" rulings below, which were right when no Bastrop pack existed and were never retired after G-116 created one.
- A `bastrop_tx` PROOF NEEDS A CREDENTIAL, AND ONLY ONE KIND IS YOURS TO USE (OPS-17 A-148, G-135). A tenant-private pack answers 401 to an anonymous read on any deployed app. The key a lane may use is the verification-scoped `bastrop_tx` key minted under G-135; `_catalog/credential_access_index.json` (entry `hauska-tenant-key-bastrop_tx-lane-verification`) says whether it exists yet and where it lives. Read it into your process environment from inside a script file, and never print, commit or paste it. Never use the operator's own pilot key ("Nick, bastrop_tx staff pilot"), and never ask the operator to paste a key into a file. If the verification key does not exist yet, the `bastrop_tx` leg is UNMEASURED, and you say so; it is never replaced by a `template-city` pass. The refusal directions need no key, so prove them anyway: keyless is refused, `bastrop_tx` named anonymously is 401, and an unknown pack is 404.
- SMARTCITY PRODUCT LINE THEN UI THEN ONE FEED — **SUPERSEDED IN PART 2026-09-18 (A-146):** the "template Dashboards UI first, then one feed onto `template-city`" sequencing and "live Bastrop is an island, not the next card" are retired by BASTROP IS THE PROVING PACK above. Still in force: three identities: `template-city` demo, live `tenant_id=2` Bastrop, next onboarded city. Do not rewrite `tenant_id=2` in place. CitizenConnect is the citizen lens, not a SKU. Feeds are adapters that write records. Destination still `_decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding.md`. Next-card sequence `_decisions/2026-08-17_dashboards_ui_then_one_feed.md`. Gap map `_inbox/2026-08-17_dashboards_missing_pieces.md`.
- FEED ADAPTER CONTRACT (G-63 CLOSED) — kinds are a catalog; grants are per city pack. Write spine or files with provenance. Never a Dashboards vendor table. Never Pipedrive as a city feed. Samsara fleet copies are not G-24. Decision `_decisions/2026-08-17_g63_feed_adapter_contract.md`.
- G-11 CITY-PACK TENANCY (CLOSED 2026-08-17 as sequencing) — a city pack is the tenant. Identified caller is a Hauska product key whose `jurisdiction_tenant` equals `cityKey`. `DASHBOARDS_API_KEY` is not a tenant. Fixture pack `fixture-city`. Not sprint-54 done. Not live ingest. WDLL `_inbox/2026-08-17_g11_tenancy_WDLL.md`. Decision `_decisions/2026-08-17_g11_city_pack_tenancy.md`. Close `_inbox/2026-08-17_g11_close.json`.
- G-45 SMARTSITE STAFF MAP (CLOSED 2026-08-17) — Dashboards staff map is the SmartSite embed of gold `48021:34137`. GET `/` auto-loads it. Do not cut live Leaflet. Do not clone PE. WDLL `_inbox/2026-08-17_g45_smartsite_staff_map_WDLL.md`. Decision `_decisions/2026-08-17_g45_smartsite_staff_map.md`. Close `_inbox/2026-08-17_g45_close.json`.
- G-64 LANE C STAFF PATH (CLOSED 2026-08-17) — Dashboards development-services mounts plan-review-app. GET `/?lens=development-services` auto-loads it. GET `/` stays G-45 SmartSite. Do not cut live PermitFlow. Do not start G-52. WDLL `_inbox/2026-08-17_g64_lane_c_staff_path_WDLL.md`. Decision `_decisions/2026-08-17_g64_lane_c_staff_path.md`. Close `_inbox/2026-08-17_g64_close.json`. Serving Dashboards `00007-8sc`.
- G-65 PERMITFLOW KILL (CLOSED 2026-08-17) — PermitFlow dead as a Dashboards product. Live `/permitflow/*` uncut until a named island replacement. WDLL `_inbox/2026-08-17_g65_permitflow_kill_WDLL.md`. Decision `_decisions/2026-08-17_g65_permitflow_kill.md`. Close `_inbox/2026-08-17_g65_close.json`.
- COMPASS IS SHARED-ELEMENT SHEET CHROME — G-66 item. Top-bar source control, not a page, not a rail-only assistant. Answer engine is out of this wave. Old Compass is not the atom-render reference; SmartSite is. Decision `_decisions/2026-08-17_ux_implementation_sequence.md`.
- UX IMPLEMENTATION SEQUENCE (G-67 first) — kit copy, then G-66 / G-68 / G-69 in parallel. Those three CLOSED 2026-08-17. G-24 stays zero. (The "live Bastrop no-touch" clause is SUPERSEDED 2026-09-18, A-146; see BASTROP IS THE PROVING PACK. v1 is still never broken, per its rule 4.)
- FILES COMPOSE THEN ONE FEED (G-70 G-71 G-72 CLOSED 2026-08-17) — Work → Files mounts smart-files-app. G-71 wrote Bastrop municode meetings onto `template-city` files. That host is a HOLD (identity collapse), not a feed win. Decision `_decisions/2026-08-17_files_compose_then_one_feed.md`.
- SHELL BEFORE FEEDS (G-73 CLOSED 2026-08-17) — Every G-18 / live-Bastrop staff function has a named home on the Dashboards shell. Connections is 67 of 67 Homes-table rows. Assets honest-empty. Feeds still pause. Register `_inbox/2026-08-17_g18_shell_homes.md`. Decision `_decisions/2026-08-17_shell_before_feeds.md`. WDLL `_inbox/2026-08-17_g73_shell_homes_WDLL.md`. Close `_inbox/2026-08-17_b_g73_close.json`.
- TEMPLATE-CITY IDENTITY (G-74 CLOSED 2026-08-17) — municode grant pulled off template-city. Compose meetings empty with basis `no municode calendar grant on template-city`. Citizen has no Chestnut. Connections HTML has zero Bastrop. No clerk retarget. Decision `_decisions/2026-08-17_template_city_identity.md`. WDLL `_inbox/2026-08-17_g74_identity_leak_WDLL.md`. Close `_inbox/2026-08-17_b_g74_close.json`.
- DEMO-CITY CHROME (G-75 CLOSED 2026-08-17) — mounts fill the frame, one SmartSite iframe, Compass-class map motion from current rails, 30c screens honest-empty. Serving `00013-vkl`. Plan Review `embed=1` is Dashboards-side; host already had detection. Interruptibility partial. Register 67 of 67 plus 3 addenda. Note `_inbox/2026-08-17_g75_shell_mounts_motion.md`. WDLL `_inbox/2026-08-17_g75_shell_mounts_motion_WDLL.md`. Close `_inbox/2026-08-17_b_g75_close.json`. Handoff `_inbox/2026-08-17_demo_city_template_handoff.md`.
- SMARTCITY PRODUCT-LINE DESIGN SYSTEM — one Empressa kit governs Dashboards, Smart Files, Plan Review, and future Asset Management. Not a Dashboards-only theme. Not Hauska chrome. Decision `_decisions/2026-08-17_smartcity_product_line_design_system.md`.
- SMARTCITY VISUAL LAW (session 1, operator loved 2026-08-17) — quiet surfaces, loud exceptions, honest absence. Register not card deck. Sidebar. Inverted applicability (Pass quiet, Unchecked hatch). Inter + Plex Mono, 12px floor. Environment badge. Not-built nav. Provenance chip; no bare confidence. Code citation has no ICC body slot. Light `--sc-atom` `#177F78`, dark `#4CC9C0`. Kit extract `_inbox/2026-08-17_sc_kit.css`. Decisions `_decisions/2026-08-17_smartcity_visual_law.md` and `_decisions/2026-08-17_atom_accent_light_hex.md`.
- SMARTCITY DASHBOARDS HOUSING — one product repo `empressaioemail-tech/smartcity-dashboards`, cities as tenant packs. **SUPERSEDED IN PART 2026-09-18 (A-146):** v2 on `bastrop_tx` is now the named replacement. v1 `smartcity-os` stays production and is changed only as a bridge, by canary. Decision `_decisions/2026-08-17_smartcity_dashboards_housing.md`.


## Mission - G-164: repair the 11 findings four design instruments disclosed

You launch no sub-agents (FAN-DEPTH 0). **This is the rare lane whose deliverable IS `doc_repo`:** you
WRITE in `doc_repo` under `_design/` and nowhere else. You write nothing in `smartcity-dashboards`,
`smartcity-os`, `plan-review`, `smart-files` or any other product repo. Doc_repo commits are
planner-owned, so **you leave every edit UNCOMMITTED and list the paths in your close**, and the
planner commits them. Do not stage, do not commit, do not push.

### The lane you follow, and why this row exists at all
    10|
`g148-design-instruments` instrumented four designs that were past DRAFT with no adversarial read. All
four instruments were delivered and the design gate went green, **and all four instruments exit 1 on
the boards as shipped.** The lane disclosed 11 findings as `leave_behind` rather than fixing them,
because its dispatch was to instrument what exists and not to redraw it. No row owned the 11, so the
operator carded them as ONE row, this one (OPS-17 `A-159`), because the repair and the instrument that
proves it are one unit of work. Its close is `_inbox/2026-09-18_g148-design-instruments_close.json`.

**The gate is RED until you land.** `A-159` also changed the gate's R3 rule: it used to test that a design's `check.mjs` EXISTS, and it now tests that it EXITS 0. That is why the gate read `exit 0` / `FINISHED` at `2026-09-18T20:32:13Z` and reads `exit 1` / `UNFINISHED`
with four R3 findings at `21:15:53Z`, on the same boards, with nothing in the designs changing in
    20|between. You are the row that turns it green, and `G-146` still does not close on it (`A-152`).

### What to repair, by folder, with the exact diagnosis

Read each finding as a CLAIM TO RE-CHECK AGAINST SOURCE, not as a copy fix. Most are stale negatives:
the design asserts something is absent or unavailable and the product or the engine has since made it
true. Ten are unblocked. **One is blocked and you must NOT fix it** (see below).

**`_design/plan-review-departments/` (4).** `Department.dc.html` draws finding 13 as "Fire apparatus
access" where the product's 13 is "Parking spaces required". `Letter.dc.html` renders 3 notice classes
counting 1 + 2 + 10 over the product's 13 findings, and carries no heading for the product's heldBack
    30|class, so that class is silently folded into another. `Letter.dc.html` also prints held-back finding 6
("Driveway width") under the escalations heading, which asks nothing of the applicant. And the design's
"no department model at all" claim, in the README and the canvas, is stale against `DEPARTMENT_ROLES`
at `plan-review` `origin/main` `99c156ba` `src/staff-identity.mjs:283`, a factual question A-145
already answered in the affirmative.

**`_design/smartcity-map-dock/` (4).** `Main.dc.html` and `Expand.dc.html` each render "Licences",
which is not a product tab, and each drop "Licenses", which is. That is four findings from one
one-letter error in two files, and the repair is to make each board's tab set match the shipped surface
rather than to rename it in both directions.

**`_design/smartcity-overview-lens/` (2).** `Main.dc.html` states "4 of 6 reading" over six lanes where
    40|3 render a fact read from a source. `Sparse.dc.html` is granted 1 of 10 sources and still promotes
Connections above the decision queue, where the shipped function demotes it. Note that
`_design/smartcity-overview-lens/check.mjs` is ALSO `G-157`'s inherited instrument, so repairing these
two is what makes G-157's proving instrument pass. It does not unblock G-157 itself, which still waits
on a v1 combined-dashboard capture.

**`_design/smartcity-flood-study/` (1) - BLOCKED, AND YOU MUST NOT REPAIR IT.** The design says naming
a depth by return period "would need a local rainfall atlas nobody has cited yet", while the engine
carries `rainfallSource: noaa-atlas14`, cites NOAA Atlas 14 seven times, pairs return period to depth
in `rainfallCurve`, and renders "100-yr (NOAA Atlas 14)". **A design-only correction here would make
    50|the page agree with a value the parser INVENTS.** G-125's unowned leave-behind is that NOAA's Atlas 14
HDSC endpoint changed payload shape, `parsePfdsDepthTable` never matches, and every no-parameter study
in every county silently uses Bastrop's 9.5in default. Leave the design byte-identical, leave
`check.mjs` byte-identical, and state in your close that this finding is held open on G-125, so that
one folder still exits 1 and the gate reports one finding rather than none.

### Acceptance, verbatim from the row

> `node _design/<folder>/check.mjs` exits 0 in all four folders with a non-zero matched-input count,
> each `violate.mjs` still catches every plant, and `node scripts/govtech/design-completion-gate.mjs`
> exits 0 with the instruments RUN rather than counted (A-159)

    60|Read that carefully: three of the four clauses are about the INSTRUMENTS still working, not about the
boards. Repairing a design until its instrument passes while hollowing out the instrument is the
defect this row exists to catch.

### The line you must not cross

- **You repair the DESIGN. You do not edit `check.mjs` or `violate.mjs` to make a finding go away.**
  Loosening a predicate so it stops firing is the exact defect class this whole program is about: an
  artifact that exists, is correct, and enforces nothing. The instrument is the second derivation; if
  you weaken it, the finding is gone and nothing was fixed.
- **If you conclude an instrument's finding is itself WRONG**, that is legitimate and important: state
  it with evidence, leave the instrument byte-identical, and put it in your close as a disputed finding
  for the planner to adjudicate. Do not delete the check.
- `_design/smartcity-records-search/Main.dc.html` was damaged once already this session by a batch
  `violate.mjs` sweep over every design folder: the sweep stripped a `data-coverage-rule` element from
  a tracked, RATIFIED board and only `git status` found it. **Run `violate.mjs` per folder, never in a
  batch, and after each run confirm the tree is clean.** If a run modifies anything, restore it by name
  and say so rather than silently checking it out. `node scripts/govtech/design-instrument-exits.mjs`
  is the hardened version of that sweep and refuses on a dirty `_design` tree, so prefer it over any
  ad-hoc loop.

### What you must not touch

- **No product repo.** If a finding looks like a product defect rather than a design defect, it is not
  yours; name it in the close.
- **Do not regrade plan rows, do not edit `90_operations/OPS-17_...`, do not edit
  `_catalog/repo_intents.md`, and do not run `smartcity-tracker.mjs`.** Those are planner acts. If a row
  status or an amendment looks wrong to you, say so in your close and leave the file alone.
- **Do not repair the flood-study finding.** It is the one blocked half of this row.

### Evidence your close must carry

- For each of the four folders: `check.mjs` pasted, exit 0, with its matched-input counts NON-ZERO
  (a zero count means the instrument stopped reading the board, which is a new defect, not a pass).
- For each folder you touch: its `violate.mjs` run pasted, every planted violation still caught, and
  `git status` showing `_design/` clean afterwards.
- `node scripts/govtech/design-completion-gate.mjs` pasted, showing `exit 0` with instruments RUN, or
  `exit 1` with exactly ONE finding if the flood-study half is still held - and if it is one finding,
  say which one and why.
- The exact list of uncommitted `doc_repo` paths you are handing back, so the planner can commit them
  by explicit pathspec.
- Your scratch block (LESSON / DEAD-END / GROUND-TRUTH with a timestamp / OPEN), returned in the close.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-18_g164-design-repairs_cp1.json
  CP2: _inbox/2026-09-18_g164-design-repairs_cp2.json
  CLOSE: _inbox/2026-09-18_g164-design-repairs_close.json
  These paths are relative to the doc_repo worktree the session RUNNING YOU is rooted in: for a
  lane spawned by the dispatch planner that is the planner's worktree; for the dispatch planner
  itself it is its own seat worktree (never P:/doc_repo, the integration seat's checkout). This
  dispatch was compiled in P:/doc_repo. Two lanes in each of waves 1 and 2 wrote
  into the property seat's worktree instead and their artifacts had to be found by hand.
  No notification arrives when a background command finishes: poll with a bounded loop and a
  timeout; a lane that ends its turn waiting for a wake-up stalls (two lanes did, wave 2).

CLOSE SKELETON (the fields the enforcement gate reads; spell them exactly, or the gate refuses
the commit rather than guessing what you meant):
  {
    "lane": "g164-design-repairs",
    "planRows": ["G-164"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "...",
    "subAgents": { "spawned": <int>, "maxDepth": <int> }
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
  subAgents is required and honest: spawned counts every sub-agent this lane launched, maxDepth
  is the deepest level reached (0 when none), and neither may exceed FAN-DEPTH 0.
