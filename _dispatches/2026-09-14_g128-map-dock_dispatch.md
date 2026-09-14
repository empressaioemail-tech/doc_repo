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

PLAN-ROW: G-128 (90_operations/OPS-17_govtech_stack_plan_of_record.md)
repo: smartcity-dashboards

CLAIM YOUR LANE BEFORE YOU DO ANYTHING ELSE. This dispatch may have been handed to
more than one session. Run this FIRST, from the doc_repo worktree you are rooted in:

  node scripts/lane-claim.mjs claim --lane g128-map-dock --seat <your-seat-id> --plan-row G-128 --dispatch _dispatches/2026-09-14_g128-map-dock_dispatch.md

Exit 0 means proceed. **Exit 3 means another seat is already executing this lane:
STAND DOWN, do not execute, and report which seat holds it.** Exit 4 means the claim
is stale — confirm the holder is gone before re-running with --force. Release when
your close is filed:

  node scripts/lane-claim.mjs release --lane g128-map-dock --seat <your-seat-id>

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


# MISSION — G-128: the map dock, three states, one component

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

## SEQUENCING — read this before you branch

**G-120 and G-123 are in flight and touch the same layout files as this row.** G-120 rebuilds the
Overview lens including its right rail. G-123 rebuilds the Development services lens including its
tab strip. This row changes both.

**Start only after both have merged**, and rebase on current `origin/main` before your first
commit. Three concurrent branches editing one lens shell produces a merge nobody can review, and
this operation has already lost work to exactly that this week.

If either is unmerged when you pick this up, say so and stop rather than working around it.

## Snapshot first

Repo: `smartcity-dashboards` (`empressaioemail-tech/smartcity-dashboards`). The local checkout
at `/p/smartcity-dashboards` was **43 commits behind** `origin/main` on 2026-09-14. Fetch and
work from current `origin/main`. Declare repository, branch and commit SHA in your first output
line. Work on your own branch in your own worktree.

Design: `https://claude.ai/code/artifact/9a33103c-9765-4a50-ad7f-461fa6f17f43`
Source and reasoning: `_design/smartcity-map-dock/` — read the README first.

## What this row does

The city map becomes a **persistent right rail** on Development services, matching Overview. The
lens tabs sit between the left sidebar and the rail. The map is context you work beside, not a
destination.

**Consequence: Place stops being a tab.** It is the rail. Remove it from the Development services
tab strip. The parity design that treated Place as a tab (`_design/smartcity-place-tab/`) is
superseded and kept only as the record of the option not taken.

## The three dock states, and what redistributes

The dock control is already a three-setting affordance on the existing map container. What is new
is that **the components redistribute per state** rather than the map simply growing.

**1 · DOCK** (right rail, ~360px). Map on top at a fixed height. Property detail and records
stacked beneath it in the rail, in that order. This is the Overview pattern.

**2 · EXPAND.** Map takes the top and grows. The two components sit below it **side by side at
roughly two-thirds / one-third**: records take the width because they are a list, property detail
takes the narrow column because it is a stack of short facts.

**3 · FULL.** Map dominant. A **full-width permit row beneath it**, rendered with the same table
treatment as every other operational list in this product so it reads as records rather than as a
panel. The right column carries the one-click property detail. The layers sidebar appears.

## THE LAYERS RULE — the point of this row

**The layers panel exists in FULL ONLY.**

Fifty-two layers in a fixed panel cannot work at rail width. Today the panel is present at every
size: it crushes the map when expanded and collapses to an unreadable sliver when docked, with
clipped control text. That is the defect this row exists to fix.

Dock and Expand get a **Layers button** carrying the active count, opening a sheet. Only Full has
the room to group 52 layers by their seven categories.

Do not solve this by making the panel narrower or scrollable at small sizes. The panel is the
wrong component below a certain width; the button is the right one.

## Constraints you must not break

**The Bastrop-only refusal stays.** `composePropertyIntelSummary` returns `unavailable` for any
`cityKey` but `bastrop_tx`, because the upstream parcel, zoning and flood queries are bound to
Bastrop's ArcGIS services. Every dock state must render that refusal honestly rather than showing
an empty map that looks broken. **Do not make it serve another city's data under this city's name
to fill the space.**

**`buildable area` renders REFUSED with its basis in all three states.** Operator ruling R-2: the
envelope draws, the figure is withheld until an envelope atom backs it. Do not drop the row to
save vertical space in Dock — a missing row reads as a gap and invites someone to fix a decision.

**Record rows carry id, subject and status. Never the free-text description**, which is where
citizen names and personal phone numbers live. Same rule as G-123's tables. If you find a path
that renders a description into any of these panes, report it.

**Leaflet stays, and it is sanctioned.** `web/property-map.html`/`.js` is the one narrow,
decision-backed exception to this product's no-Leaflet rule. Do not replace the renderer; this
row is layout and state, not a map-engine change.

**The 52 layer keys come from `getAllLayerKeys()` in `src/property-map-catalog.mjs`**, derived
from smartcity-os's own `layerCatalog.ts`. One list, not two that can drift. Do not hand-list
them a second time for the sidebar.

**The frozen kit.** `shell.css` may declare no colour and no token; `web/sc-kit.css` is
byte-identical across three repos and must not be touched; the type ramp is pinned with a 12px
floor; no new CSS class without a rule. If a state appears to need a colour that does not exist,
STOP and report.

## A defect to confirm or clear on the way

The rail map currently renders broken on the live `bastrop_tx` Overview — it collapses to a
narrow vertical sliver with clipped control text. **Establish whether that is a layout bug this
row fixes, or a component failure underneath it**, and say which. Those have very different
costs and the design assumes the first.

## Method

Verify each state at its own width, and each state on a pack **with** a boundary and **without**
one. State what you checked.

ENUMERATE BEFORE ASSERTING ABSENCE. Say what you searched.

State the mechanism explaining an observation, then a second mechanism that would produce the same
observation and why you rejected it.

Every verification command exit-bounded (`timeout 120 ...`).

## Out of scope

The Flood and Drainage study overlay (a separate row, not yet scoped — the colour-taxonomy
collision with the 52 city layers is unresolved and is an operator discussion). The map engine.
Any feed or grant work. Anything in `smartcity-os` beyond reading the layer catalog.

## Close

Deploys are planner-owned: you deploy and you fix your own failed deploys. Canary with
`--no-traffic`, smoke, shift, verify the shift by reading the traffic JSON **by field name**,
never a positional `value()` formatter.

Write your close to `_inbox/2026-09-14_g128_map_dock_close.json`. State the deployed revision and
digest, which of the three states you verified at which widths, the with-boundary and
without-boundary results, and your answer on the sliver defect.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-14_g128-map-dock_cp1.json
  CP2: _inbox/2026-09-14_g128-map-dock_cp2.json
  CLOSE: _inbox/2026-09-14_g128-map-dock_close.json
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
    "lane": "g128-map-dock",
    "planRows": ["G-128"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
