Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

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

PLAN-ROW: G-151 (90_operations/OPS-17_govtech_stack_plan_of_record.md)
FAN-DEPTH: 0
This lane launches no sub-agents (stated at the top; the commit gate refuses a close that declares any fan, A-181).

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane g151-parks-lens --seat <your-seat-id> --plan-row G-151 --dispatch _dispatches/2026-09-19_g151-parks-lens_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane g151-parks-lens --seat <your-seat-id>

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


## Mission - G-151: build the Parks lens, the one lens that does not exist, drawn as NOT existing

You launch no sub-agents (FAN-DEPTH 0). You WRITE in `smartcity-dashboards`. You write nothing in
`doc_repo` (hand any doc edit back as a diff, uncommitted) and nothing in `smartcity-os`.

### Why this row is the one most likely to be "fixed" wrong

Parks has no vendor and no registered domain. **Absence from `DOMAIN_REGISTRY` is the only surviving
meaning of "not built" in this product.** So the surface you are building renders a NEGATIVE claim, and
every instinct a builder has - fill the table, add a tile, show a zero - would turn it into a positive
claim that is false. An empty built surface and an unbuilt surface are different assertions; the first is
a lie about the second.

Six other lenses render data. This one renders that there is no data to render, and the reason there is
none. Get that backwards and the row is worse than not built.

### What you are building, and the boundary you must not cross

Design `_design/smartcity-parks-lens/`, RATIFIED 2026-09-17, `check.mjs` with 32 self-tests both
directions and two artboards. The built surface must carry, from `README.md`:

- **`data-lens-body`, not `data-lens-scope`.** The instrument scopes on the body attribute and REFUSES
  (exit 2) rather than degrading if it cannot scope the board. Do not rename it.
- **No metric tile, no empty table, and none of the built-surface vocabulary.** `Main.dc.html` renders
  parks as a surface that does not exist; `Difference.dc.html` is the contrast board and deliberately
  carries the built-surface terms. The boundary between the two is a rule the instrument checks, not a
  style choice.
- **The three refusals, all in the product**, already pinned by `src/department-domains.test.mjs` against a
  probe domain named `parks-facilities`: `assertDomainShape` refuses `gated by parks, which is not a
  catalogued adapter kind`; `assertCityPackShape` refuses `fixtureGrants names parks, which is not a
  catalogued adapter kind`; `composeDomain` refuses a record whose vendor id does not match its region
  gate. Confirm all three still hold and that the built surface says so.
- **The one thing that would change it, stated as a decision nobody has made.** Adding an eleventh
  catalogued adapter kind is a sourcing decision and a contract, not a sprint item.

**Do NOT add Parks to `DOMAIN_REGISTRY`.** That is the single move that makes the page claim coverage it
does not have, and it is out of scope for this row.

### Three near misses, named so you do not reach for them

Each is a real thing in the product carrying the word Parks, and none of them is this lens. Filling the
page with one of them answers a different question:

- **A map layer.** `src/property-map-catalog.mjs` catalogues a `parks` polygon layer and a
  `parks-recreation` view preset. That is geometry on the property map, not a department register.
  Whether it returns features for any city is UNESTABLISHED from this repo - state that, do not assume it
  either way.
- **A role.** `src/staff-identity.mjs` carries `parks` in `DEPARTMENT_ROLES` and in `NINE_LENSES`. A role
  that can be issued is not a surface that can be opened, and that module states G-132 does not enforce
  lens access.
- **A register row.** `src/shell-homes.mjs` routes "Departments including Parks and Courts" to the Parks
  lens with disposition "Not built". That row is the pointer, not a source.

### How to build it

Read the lens implementations that already landed and follow the pattern they set: `g152-public-works-fire-ems`
and `g153-fleet-police-lens` are merged on `main`. You are NOT inventing a mounting mechanism; you are
adding one entry that resolves to the not-built state.

### Acceptance - run these yourself and paste raw output

1. `node _design/smartcity-parks-lens/check.mjs` passes **on the built surface** with a NON-ZERO
   matched-input count, and fails against a planted violation **in both directions**. A pass on the design
   boards alone does NOT satisfy this: those boards pass today, before your change, so the pre-existing
   green is evidence about the folder and not about the surface you are building.
2. The shipped Parks surface renders no metric tile, no empty table and no built-surface vocabulary,
   **checked as a file rather than by eye**.
3. The surface is reached on the DO app per D-12, verified by the edge header, with the reach recorded.
4. `node --test` for the repo exits 0, and `src/department-domains.test.mjs` still refuses all three
   `parks-facilities` probes.

### What you must not do

- **Do not weaken the instrument to pass it.** `check.mjs` is inherited and its two-sided rule is the
  point. Editing its predicates to reach exit 0 is the defect class this program exists to catch.
- **Do not register the domain**, add a metric tile, or add a vendored data source.
- Do not touch the six other lenses' modules, and do not rename any `data-lens-*` attribute.

### Known pre-existing, not yours

`smartcity-dashboards` `main` is RED (three consecutive CI failures on `cbdfaeb6`). It is a date-rolled
test fixture in `src/dev-services-naming.test.mjs`, carded as G-166 and dispatched separately. If you see
that failure, it is inherited, it is not yours, and you should name it as inherited rather than chase it.
Your PR's checks may be red for that reason alone; say so rather than "fixing" it here.

### Evidence your close must carry

- The pre-change behaviour of the Parks route, and the post-change, both pasted.
- `check.mjs` both directions ON THE BUILT SURFACE, with the matched-input count visible.
- The edge-header read proving reach on the DO app, with the moment you read it.
- Your snapshot (repo, ref, moment read) per `ENFORCEMENT.md`, and your scratch block
  (LESSON / DEAD-END / GROUND-TRUTH with a timestamp / OPEN) returned in the close.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-19_g151-parks-lens_cp1.json
  CP2: _inbox/2026-09-19_g151-parks-lens_cp2.json
  CLOSE: _inbox/2026-09-19_g151-parks-lens_close.json
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
    "lane": "g151-parks-lens",
    "planRows": ["G-151"],
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
