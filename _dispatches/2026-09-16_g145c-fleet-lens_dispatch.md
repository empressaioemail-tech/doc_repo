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

PLAN-ROW: G-145 (90_operations/OPS-17_govtech_stack_plan_of_record.md)

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane g145c-fleet-lens --seat <your-seat-id> --plan-row G-145 --dispatch _dispatches/2026-09-16_g145c-fleet-lens_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane g145c-fleet-lens --seat <your-seat-id>

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


# MISSION — design the Fleet lens

One of the last two undesigned department lenses. Fleet is IN SCOPE as of the operator ruling
2026-09-15 (`_decisions/2026-09-15_police_and_fleet_lenses_in_scope.md`), which reversed an earlier
"not in the pilot" exclusion because v1 is being retired and an undesigned lens does not keep its
current level of service after cutover, it disappears.

**Police is being designed in parallel by another lane. Do not draw it.** Read the shared
constraint below; it binds both of you and the two lenses must not answer it differently.

**Bastrop approves the design before we build.** This is headed for a customer's eyes.

## The source state, established. Re-verify it, do not re-derive it

`smartcity-dashboards` `origin/main` `f776b4bf`. One registered region on this lens:

| Region | Domain | `gatedBy` | recordType |
|---|---|---|---|
| Vehicle roster | `FLEET_VEHICLES_DOMAIN` | `samsara` | `fleet-vehicle` |

**Fleet is the first lens designed whose vendor actually returns data.** `src/vendor-live.mjs`
header, live-verified 2026-09-03: Samsara, Spireon and PowerBI return real data; FirstDue returns
a specific 403; GoTo returns not-authorized. Samsara also has a live mapper and a platform route
(`smartcity-os /api/platform/samsara/vehicles`). Public works, Parks and Fire and EMS were all
drawn at some distance from data. **This one can be drawn connected, and that is what makes it
different from its three neighbours rather than a fourth copy of them.**

Do not let that make the board complacent. The live mapper is still a cutover risk and the last
lane found two of them falling back to colliding sentinel ids (`unknown-apparatus`,
`unknown-project`); check whether the Samsara mapper does the same and say so on the board if it
does.

**Fleet is deliberately the SIMPLE exemplar and its own module says why:**

> the reason this domain is one of the three exemplars is that it is SIMPLE and its shape shares
> almost nothing with the permit queue: a flat roster, no place, no due date, and one grouping
> dimension. If the seam only worked for case-shaped records it would look correct on the
> pipeline and fail on the first lens that is not a queue.

So resist importing the queue vocabulary. A flat roster with one grouping dimension is the shape,
and a design that dresses it as a work queue misrepresents the domain and wastes the one lens that
proves the seam generalises.

**A VEHICLE IS NOT AN ASSET, and this is the standing example.** From the module:

> G-24 stays at zero, and fleet telemetry has been the standing example of the thing that looks
> like it should fill an asset inventory and must not. The record type is fleet-vehicle under a
> files-writing vendor kind, never a city-owned asset node.

The Assets surface is excluded from design by ruling for exactly this reason. A Fleet lens that
reads as an asset inventory would undercut that ruling from the side, so the board should be
positively clear about what it is not. `_design/smartcity-parks-lens/` shows how to draw a
"what this is not" panel without it reading as an apology.

## The shared constraint, and Police's lane has the identical paragraph

**The operator is a person, the person must not be named, and the dimension still has to work.**
This lens is where that rule is stated most plainly, so you are the reference implementation:

> A DRIVER IS A PERSON. A granted Samsara feed carries driver names; a generated record must not,
> so the roster groups on an opaque operator reference under a declared format and the record
> states in its own basis why the name is absent. An absence with no basis is the defect this
> program hunts, so the absence is written positively rather than left as a missing field.

Draw the opaque operator reference as a working dimension, with its declared format visible and
the basis on the page. Police faces the same problem for patrol vehicles and a stronger version
in plate reads. If you conclude Fleet needs a treatment Police could not share, say so in your
report rather than diverging silently.

## What to produce

`_design/smartcity-fleet-lens/`, per `_design/README.md`: `README.md`, `gen.mjs`, `_kit.css`, the
artboards, `canvas.json`, `check.mjs`.

`_kit.css` is copied BYTE-IDENTICAL from `_design/smartcity-dev-services/_kit.css`. Verify with
`md5sum` and report the hash; it must be `58a68730e051b1ee2ffa21f08eae6752`.

**Read `_design/smartcity-fire-ems-lens/` first and follow its pattern.** It is the closest
precedent: one region, a roster, and a grouping dimension drawn as small multiples because the
domain's own brief said a rollup could not answer the question. Ask what YOUR grouping dimension
can and cannot answer before choosing its shape. Also read
`_design/smartcity-public-works-lens/` for the blocked-region component, which states four things
and never fewer (state, basis verbatim, what KIND of thing would move it, when it was last read).

Draw the number of boards the lens honestly needs. Fire and EMS took two and deliberately cut a
third because it would have repeated a sentence another board already made. Fleet being connected
may argue for a board its neighbours did not need; it does not argue for padding.

## The instrument

`check.mjs` that self-tests in BOTH directions before reading any artboard, ABORTS rather than
reporting a verdict it cannot support, reports a NON-ZERO matched-input count per predicate and
aborts if any predicate matched nothing, and is VERIFIED BY VIOLATION on a real artboard. Report
exactly what you broke and that you restored it.

Precedents: `_design/smartcity-fire-ems-lens/check.mjs` (34 self-tests),
`_design/smartcity-public-works-lens/check.mjs` (35), `_design/smartcity-parks-lens/check.mjs` (32).

At minimum it must refuse: a domain, region, vendor or record-type name absent from the product's
own source; **any person-shaped name in any cell, and specifically any driver name**; an operator
reference that does not match the declared format; asset-inventory vocabulary appearing on this
lens; and rows drifting from the composer output.

**Two known narrownesses in the existing checks — do better if it is cheap.** They verify the
structured provenance foot against the registry but do NOT check vendor names appearing in prose,
so a basis sentence can name a vendor the foot contradicts. And the Parks big-figure rule is
scoped to `font:[45]00` at 20px+, so a non-kit weight evades it.

## Render before claiming

    "C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --screenshot=out.png --window-size=1600,1040 file:///<abs>/<Board>.dc.html

Every board, both themes (`{{themeClass}}` resolves to `sc-dark` / `sc-light`). Look at every
screenshot with the Read tool. Rendering caught three defects the last lane could not find by
reading: a matrix that had to be transposed, a clipped row while the basis claimed a full count,
and rails running past the bottom edge.

## Conventions

Tokens copied, never invented. **Nobody is named on a published canvas.** Fixture data badged as
fixture ON THE PAGE. Absent, zero and unmeasured are three different states, and `ungranted`,
`granted-empty` and `not built` are three more. Every money figure traceable or the board declares
itself illustrative. Externally to a city say "the record", "the asset", "current state" — never
"digital twin".

**The product's money gate refuses the standalone word `cent`**, so British "per cent" trips it.
Write "percent".

## Hard limits

You do NOT commit, stage, or touch git. You do NOT spawn sub-agents. You write only inside
`P:/doc_repo/_design/smartcity-fleet-lens/` plus your close artifacts under `_inbox/`. You read
product repos and write to none. You do not touch `_catalog/lane_claims.json` or any existing
`_design` folder. Commands must be exit-bounded.

## Hand back

Per board: what it shows, the design argument and what IN THE SOURCE produced it, the self-test
count AND matched-input count, what you broke to verify by violation, the `_kit.css` md5, and
confirmation every board was rendered and looked at. Plus a FLEET MEMORY block (LESSON /
DEAD-END / GROUND-TRUTH with timestamps / OPEN) and a `leave_behind:` declaration.

State anything you could not establish at source as UNESTABLISHED.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-16_g145c-fleet-lens_cp1.json
  CP2: _inbox/2026-09-16_g145c-fleet-lens_cp2.json
  CLOSE: _inbox/2026-09-16_g145c-fleet-lens_close.json
  These paths are relative to the doc_repo worktree the session RUNNING YOU is rooted in: for a
  lane spawned by the dispatch planner that is the planner's worktree; for the dispatch planner
  itself it is its own seat worktree (never P:/doc_repo, the integration seat's checkout). This
  dispatch was compiled in p:/doc_repo. Two lanes in each of waves 1 and 2 wrote
  into the property seat's worktree instead and their artifacts had to be found by hand.
  No notification arrives when a background command finishes: poll with a bounded loop and a
  timeout; a lane that ends its turn waiting for a wake-up stalls (two lanes did, wave 2).

CLOSE SKELETON (the fields the enforcement gate reads; spell them exactly, or the gate refuses
the commit rather than guessing what you meant):
  {
    "lane": "g145c-fleet-lens",
    "planRows": ["G-145"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
