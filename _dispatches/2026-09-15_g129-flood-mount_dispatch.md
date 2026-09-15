CANON-PREAMBLE v9e22f2c4
- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HOLD LIFTED 2026-08-26 for the Factory program (`_decisions/2026-08-26_factory_program_and_hold_lifts.md`); the Bastrop QA condition is cosmetic and does not gate the data path. NO PRIVILEGED DATA and the Hauska spine rule stand.
- THE FACTORY IS THE ONLY WRITER PATH (OPS-19) — one machine built to the MODEL LAW (`19_the_instrument_contract.md`, `_blueprint/10_model.md`, `_blueprint/20_pipeline.md`, `_blueprint/40_rule_register.md`, `51_ingestion_pipeline_reference.md`, `24_instrument_conformance_program.md`; package `dist/*.d.ts` is the tiebreaker); own repo `hauska-factory`, own Neon store; every publish lands on staging before the identical job runs on production; nothing reaches a serving store except through publish; laptop ingest is FROZEN (`_decisions/2026-08-26_ingest_freeze_and_cloud_loader.md`); OPTION A ruled (`_decisions/2026-08-26_factory_model_law_and_option_a.md`): no new county is written on the old shape and old-shape writes ended permanently 2026-08-27. Every lane has its own registered worktree; never build in another lane's checkout. Row-level status lives in `_catalog/program_preambles/OPS-19.md` and `_state/property/STATE.md`, never here.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- MOST-CURRENT SOURCE WINS (operator 2026-09-11) — for setbacks and every dimensional rule, in every city and county, the source with the most recent effective date supplies the value; tier breaks ties only on equal or unreadable dates; dates are read at source (ordinance effective date, ArcGIS `editingInfo.lastEditDate`), never assumed from source kind; an unreadable date produces a conflict row with both values, never a silent pick. Supersedes tier-first ranking in LDT `authoritativeSetbackSource.ts` and layer-23-first in hauska-map. `_decisions/2026-09-11_setback_source_most_current_wins.md`.
- ENVELOPE DRAWN, FIGURE REFUSED (operator 2026-09-11) — Ruling B reversed for the polygon only: map and MCP draw block draw the modelled buildable envelope from the same `place/buildable-envelope` call with its disclosure wherever a district and setback table exist; buildable area and percent stay refused until an envelope atom backs them. Entitlement gate unchanged. `_decisions/2026-09-11_ruling_b_reversed_polygon_only.md`.
- THE LEDGER IS THE SERVING PATH, ATOMS ARE CANONICAL (operator 2026-09-11) — node = identity, atom = one claim from one authority at one time, edge = an atom whose value is a node; a cell is accounting (state, atom reference, provenance, cached rendering keyed to atom version and vocabulary version), never a copied value; one reader in `hauska-engine/services/retrieval-api` walks gated cells and dereferences atoms and every surface and the Hauska MCP catalog consume it; unslated rails refuse, never fall to legacy; one writer mints atom + pointer + rendering in one transaction; one vocabulary module in the atom-contract package. Never add a read path, a vocabulary copy, or a value-holding cell. `_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md`, ADR-031 amendment 2026-09-11, OPS-23 §0.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

AGENT-CONTRACT v79be86e2 — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
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

PLAN-ROW: G-129 (90_operations/OPS-17_govtech_stack_plan_of_record.md)
repo: hauska-map

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane g129-flood-mount --seat <your-seat-id> --plan-row G-129 --dispatch _dispatches/2026-09-15_g129-flood-mount_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane g129-flood-mount --seat <your-seat-id>

On 2026-09-14 this exact dispatch shape was handed to two sessions at once. One found
out mid-execution from a merged commit appearing in its own fetch.

# PROGRAM CONTEXT — OPS-17 govtech stack (Dashboards, Smart Files, Plan Review, ICC demo)

You are working a lane of OPS-17. The rulings below were standing decisions in the shared
preamble until 2026-09-11; they are program law and moved here so lanes in other programs stop
carrying them. Each still binds every OPS-17 lane. If this section conflicts with the general
canon preamble, this section is narrower and wins on scope; if it conflicts with the AGENT
CONTRACT or ENFORCEMENT, those win.

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


# MISSION — G-129: mount the Flood and Drainage study in the SmartCity platform

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

## Who this is for

**Sylvia Carrillo, city manager of Bastrop**, asked for this in her own words: *"I want to be
able to tell what happens when four inches of rain falls on a property."* Her stated value is
screening out sites that plainly do not need a drainage engineer — roughly ninety percent of that
spend. **A named deliverable to a real customer.**

Operator, 2026-09-14: *"we need the function in the smart city platform"* and *"usable across
departments."*

## What already exists — do not rebuild any of it

**The study.** `hauska-engine` `packages/engine-core/src/site-plan/` — a real D8 flow-accumulation
model producing flow paths, catchment swaths, drainage zones and ponding. Not a FEMA zone lookup.

**The rainfall control.** G-125 CLOSED 2026-09-14. `rainfallDepthInches` is live and verified at
two depths on a real Bastrop parcel against the deployed engine and the deployed Property Explorer
bundle.

**The service surface, already addressable by parcel:**

```
POST /api/pe-site-plan-export?report=flood-drainage                 run / refresh
GET  ...&action=study&parcelNodeId=...                              cached study
GET  ...&action=download&parcelNodeId=...&format=pdf-flood-drainage the PDF
```

**The renderer.** `hauska-map` `apps/property-explorer/src/browse/flood-map-overlay.ts`, MapLibre,
with a deliberate colour taxonomy.

## MOUNTED, NOT PORTED — the ruling that shapes this row

The PE overlay is **MapLibre**. The city map is **Leaflet**. Porting the renderer creates a second
implementation of one study that will drift, and deepens the island that
`_decisions/2026-06-18_map_engine_maplibre_cotality_national.md` already named.

**The platform consumes the service; it does not rebuild the renderer.** In G-128's dock (CLOSED,
serving) this is a **view mode of the map area in Full** — it takes the map region rather than
nesting a map inside a page that has one.

This needs an embed mode on the PE side (`hauska-map`). That is the real cost of the row and it is
the right cost.

## THE HONESTY PROPERTY — G-125 caught a live fabrication, do not reintroduce it

G-125's pre-registered falsifier fired on its first deploy. A 4-inch parameter-sourced run
returned `gradient.note = "Design storm 4 inch, 100-yr 24-hr"` — **fabricating a return period the
run did not carry.** Root cause: a `??` fallback treated *"the caller explicitly decided no claim
is honest"* identically to *"the caller never passed this field."* Fixed in PR #447; the live
production string is now `"Design storm 4 inch, 24-hr."` with no invented year.

**Every surface you mount must carry that same discipline.** The depth, and the return period only
where one genuinely applies, on screen and in the PDF. If your mount re-derives, re-formats or
re-labels that string anywhere, you have recreated the defect. **Prefer passing the engine's own
note through verbatim to composing your own.**

And the framing, because the whole value is a city skipping an engineer: the surface says what
this is, what it is not, and when to call an engineer anyway — visible on screen and in the PDF,
not a footnote. Portfolio precedent: property lines render as *"GIS-approximate — not a survey."*

## Cross-department, not a tab

Operator ruling. This mounts the way SmartSite and Files already mount, reachable from **Public
works** (drainage planning), **Development services** (review) and **Fire and EMS** (operations) —
not as one lens's tab. Build it once as a capability.

Note the role model: per `_decisions/2026-09-14_staff_identity_and_department_rbac.md` the roster
is the nine lenses, and G-127's enforcement is not built yet. Do not invent gating here; make the
capability mountable and let G-127 gate it.

## TWO FLOODS ON ONE SCREEN — solve this deliberately

The city map already carries **FEMA flood zones**, **AE floodway** and **BEFCO flood points**.
Those are **regulatory** — what insurance and permits depend on. The study is **derived** — what
actually happens on the dirt when it rains.

**A parcel can sit outside the FEMA zone and still pond badly. That is precisely the case Sylvia
is trying to catch**, and it is the case where the two answers appear to contradict each other.

They must read as **two different questions**, never as competing versions of one answer. Decide
how, and state the decision in your close.

Related and already ruled: `_decisions/2026-09-14_flood_determination_authority.md` — the
parcel-record rail is the authoritative FEMA determination, tier2 is retired. That ruling is about
the regulatory zone, **not** about this study. Do not conflate them.

## The colour taxonomy will collide — name it, do not silently resolve it

The PE overlay's discipline is deliberate: *"amber is RESERVED for SUBJECT / buildable envelope;
hydro moves OFF amber entirely. FEMA keeps its muted blue; hydro uses slate-teal so both Context
layers stay legible without colliding."* It reads from a shared `layer-role-taxonomy`.

The city map has **52 layers with their own colours**, including FEMA flood zones, low water
crossings, live stream gauges and storm drainage.

Mounting inside an embed mostly sidesteps this, because the study renders in its own frame. **If
your design causes the two taxonomies to meet anywhere, stop and report** rather than picking a
winner — that is a product-line decision across repos.

## A constraint that will bite

A **cached** study returns fast. A study at a **new depth** is a fresh computation, and a note on
record says these runs land at **85 to 154 seconds** while clients abort at **55**. Establish
whether a depth change is a cache miss on the path you are mounting. If it is, the mount needs
async refresh and polling — a control that times out on first use is not a delivered control.

## Snapshot

Repos: `hauska-map` (`apps/property-explorer`, the embed mode) and `smartcity-dashboards` (the
mount). Fetch both, work from current `origin/main`, declare repository, branch and commit SHA for
each in your first output line. Own branch, own worktree, per repo.

**G-128 is CLOSED and serving** (`smartcity-dashboards-00072-cow`); the dock and its Full state
exist. Rebase on current main rather than assuming the layout you remember.

## A known verification wall — do not burn the row on it

Three lanes have failed to verify authenticated `bastrop_tx` behaviour in v2 for want of a product
key; G-128's own close records that the map iframe never mounted in a full-shell probe for exactly
this reason. **G-133 is a live recon into why.**

If you hit the same 401, **say so, cite G-133, and verify what you can on `template-city`** rather
than treating it as your row's failure or spending the row chasing a credential.

## Method

Verify by violation: the same parcel at two depths produces materially different study output
through the mounted path, not just through PE directly.

Pre-register the falsifier before each check. G-125's caught a real fabrication — this is not
ceremony.

ENUMERATE BEFORE ASSERTING ABSENCE. Say what you searched.

State the mechanism explaining an observation, then a second mechanism that would produce the same
observation and why you rejected it.

Every verification command exit-bounded (`timeout 120 ...`).

## Out of scope

Porting the renderer to Leaflet. The map engine question. The FEMA determination ruling (G-130,
closed). RBAC enforcement (G-127). Provisioning credentials (G-133).

## Close

Deploys are planner-owned: you deploy and you fix your own failed deploys. Canary with
`--no-traffic`, smoke, shift, verify by reading the traffic JSON **by field name**.

Write your close to the path named in the CHECKPOINTS AND CLOSE block above — that is the
machine-checkable one, and this mission deliberately does not name a second.

State: the two-depth violation test through the MOUNTED path; the exact design-storm string the
mounted surface renders, quoted verbatim, proving no fabricated return period; how the regulatory
FEMA zone and the derived study are distinguished on screen; whether a depth change is a cache miss
and what you did about it; which lenses the capability is reachable from; and whether the colour
taxonomies met anywhere.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-15_g129-flood-mount_cp1.json
  CP2: _inbox/2026-09-15_g129-flood-mount_cp2.json
  CLOSE: _inbox/2026-09-15_g129-flood-mount_close.json
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
    "lane": "g129-flood-mount",
    "planRows": ["G-129"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
