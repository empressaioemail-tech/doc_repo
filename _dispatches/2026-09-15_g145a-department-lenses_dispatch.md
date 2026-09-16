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

  node scripts/lane-claim.mjs claim --lane g145a-department-lenses --seat <your-seat-id> --plan-row G-145 --dispatch _dispatches/2026-09-15_g145a-department-lenses_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane g145a-department-lenses --seat <your-seat-id>

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


# MISSION — design the Public works, Parks and Fire and EMS lenses

Three of the five department lenses that ship in the nav and have never been designed. Police
and Fleet are IN SCOPE as of the operator ruling 2026-09-15 but are a SEPARATE lane; do not
draw them here.

**Why this is urgent rather than backlog.** v1 is being retired, not run alongside — stated to
the customer on the 2026-09-15 Jaime call: *"the version two dashboard. I'm retiring the one
you're working off of."* These lenses exist in v1 today, so shipping v2 without them removes
capability from departments that have it. Jaime named engineering and fire as likely flood-study
users.

**Bastrop approves the design before we build.** Everything here is headed for a customer's eyes.

## The source state, already established — do not re-derive it, DO re-verify it

Read against `smartcity-dashboards` `origin/main` `f776b4bf`. Confirm each of these yourself at
source before you draw; they are given so you spend your budget designing rather than searching.

`src/domains.mjs` `DOMAIN_REGISTRY` and the per-domain modules:

| Lens | Registered domains | `region` | `gatedBy` |
|---|---|---|---|
| `public-works` | `CIP_PROJECTS_DOMAIN`, `CALL_ANALYTICS_DOMAIN` | Capital projects, Call analytics | `powerbi`, `goto` |
| `fire-ems` | `FIRE_APPARATUS_DOMAIN` | Apparatus and stations | `firstdue` |
| `parks` | **NONE** | — | — |

**The Parks finding is the design problem, and it is load bearing.** `src/domains.mjs` states its
own rule in a comment, and the design must obey it:

> WHAT ABSENCE FROM THIS LIST MEANS, and it is the only surviving meaning of the words "not
> built": the surface does not exist yet. Everything in the list is built, and its emptiness on a
> given pack is a statement about SOURCES with a basis attached (ruling 1, operator-approved
> 2026-08-19). Those are different sentences to a customer and this list is the line between them.

and

> WHAT WAVE 2 COULD NOT ADD, and it is a finding rather than an omission. Parks facilities and
> Court docket have no vendor at all — the build sheet records both as "gates: none yet".

So **Parks is not an empty Public works.** Public works and Fire and EMS are built surfaces that
may read nothing yet, and their emptiness is a statement about a missing grant with a basis.
Parks is a surface that does not exist, with no vendor to grant. A design that renders the two
the same way collapses two states the product deliberately keeps apart, and it is the exact
defect class this program exists to prevent. Draw the difference.

`src/staff-identity.mjs` carries the role vocabulary: `DEPARTMENT_ROLES` (seven),
`TIER_ROLES` (nine). Use those names; do not invent a department.

## What to produce

Three folders under `_design/`, per `_design/README.md`:

    _design/smartcity-public-works-lens/
    _design/smartcity-parks-lens/
    _design/smartcity-fire-ems-lens/

Each with `README.md`, `gen.mjs`, `_kit.css`, `<Name>.dc.html` artboards, `canvas.json`, and
**`check.mjs`**.

`_kit.css` is **copied byte-identical** from an existing design folder. Verify with `md5sum`
against `_design/smartcity-dev-services/_kit.css` and report the hash. If a design appears to
need a token that does not exist, that is a product-line decision — say so, do not add one.

Follow the shape the Development services lens established: a queue plus a second axis, and
**draw each second axis as the shape its data actually is** rather than flattening all three to
one template. That lens's design argument came out of the source, and yours should too. If the
honest answer for a lens is fewer artboards, produce fewer — do not pad to match.

## The instrument is not optional and it is not a formality

Every folder gets a `check.mjs` that:

- self-tests in **both directions** before reading any artboard, and **aborts** rather than
  reporting a verdict it cannot support
- reports a **NON-ZERO count of matched inputs**, and aborts if a predicate matched nothing
- is **verified by violation** against a real artboard: break something on purpose, confirm the
  check fails, put it back

**A check with no inputs is worse than no check.** One shipped on 2026-09-15 that self-tested
perfectly and matched nothing on any artboard, because the canvas rendered display forms and
never the product's actual codes. It reported success and checked nothing. Count the matches.

Working precedents to read first: `_design/smart-files/check.mjs` (12 self-tests, closed
vocabularies), `_design/smartcity-dev-services/check.mjs` (21 self-tests), and
`_design/smartcity-finance-lens/check.mjs` (11).

At minimum each check must refuse: a domain, region or vendor name not present in the product's
own source; a person-shaped name in any table cell; and, for Parks, any rendering that presents
it as an empty built surface rather than a surface that does not exist.

## Render it before you say it works

Naming a risk is not clearing it. A prototype shipped on 2026-09-15 that had been declared
un-rendered, and it was wrong.

    "C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --screenshot=out.png --window-size=1600,1040 file:///<abs path>/<Board>.dc.html

Render **every** artboard and look at it. `_design/demo/export-screens.mjs` already does this for
all 48 boards in both themes if you want the existing harness.

## Conventions that are non-negotiable

Tokens copied, never invented. **Nobody is named on a published canvas** — a previous pass put
three residents' names beside their addresses on a canvas bound for their own city, and two of
them were the same people that folder's README quotes as PII the design must not render. Fixture
data is badged as fixture **on the page**. Absent, zero and unmeasured are three different states
and no surface collapses them. Every money figure traceable to a record, or the board declares
itself illustrative.

Vocabulary: internally twin, node, atom, graph; **externally to a city: the record, the asset,
current state. Never say digital twin to a city.**

## Hard limits on this lane

**You do not commit, stage, or touch git.** Produce the artifacts and hand them back. The planner
reads the diff and commits. This is what makes the fan safe.

**You do not spawn sub-agents.** Do the work yourself in this session.

**You write only inside `P:/doc_repo/_design/` and the three folders named above**, plus your
close artifact under `_inbox/`. You do not write to `smartcity-dashboards` or any other product
repo — read them only.

**Do not touch `_catalog/lane_claims.json`** or any other file another seat appends to.

## What to hand back

A report naming, per lens: the artboards produced and what each shows, the design argument and
what in the source produced it, the `check.mjs` self-test count and **matched-input count**, what
you broke to verify it by violation, the `_kit.css` md5, and confirmation that every board was
rendered and looked at.

State anything you could not establish at source as unestablished. An honest gap is worth more
than a plausible fill, and every one of the seven defects the last design pass caught was
invisible to a re-read of the canvas.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-15_g145a-department-lenses_cp1.json
  CP2: _inbox/2026-09-15_g145a-department-lenses_cp2.json
  CLOSE: _inbox/2026-09-15_g145a-department-lenses_close.json
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
    "lane": "g145a-department-lenses",
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
