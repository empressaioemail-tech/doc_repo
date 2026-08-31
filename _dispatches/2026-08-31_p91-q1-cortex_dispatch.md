CANON-PREAMBLE v6f9d139b
- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HOLD LIFTED 2026-08-26 for the Factory program (`_decisions/2026-08-26_factory_program_and_hold_lifts.md`); the Bastrop QA condition is cosmetic and does not gate the data path. NO PRIVILEGED DATA and the Hauska spine rule stand.
- THE FACTORY (OPS-19, `F-` rows) — one machine built to the MODEL LAW (`19_the_instrument_contract.md`, `_blueprint/10_model.md`, `_blueprint/20_pipeline.md`, `_blueprint/40_rule_register.md`, `51_ingestion_pipeline_reference.md`, `24_instrument_conformance_program.md`; package `dist/*.d.ts` is the tiebreaker; `25_atom_architecture_reference.md` is superseded for the model): four layers, five canonicalisation stages, each stage the executor of its `BP-` rules; own repo `hauska-factory`, own Neon store, console Smart Site Factory in `hauska-map/apps/factory`; staging Smart Site under the Factory base URL and every publish lands on staging before the identical job runs on production; nothing reaches a serving store except through publish; laptop ingest is FROZEN (`_decisions/2026-08-26_ingest_freeze_and_cloud_loader.md`). **OPTION A ruled** (`_decisions/2026-08-26_factory_model_law_and_option_a.md`): P-82-lite plus BP-WRITE-01 land on the existing writer as a bug fix; Bexar 48029 cad finishes on the current shape (660,000 of 703,257 done); NO new county is written on the old shape; Harris, Dallas and the Texas remainder wait for the conformant stage E writer (F-15, F-16, F-18). STATUS 2026-08-27: Phase A closed; F-02 runner `factory-atoms-cad` (us-east4, digest-pinned, run row first) is the only writer job; OLD-SHAPE WRITES ENDED permanently (no `--apply` through the old writer for any county; Bexar 703,257 = roll, complete); the store is still the old shape and still serves; next card is the conformant writer (F-16 resolution, F-17 reconcile, F-20 stage-and-merge write, F-18 intensional demotion) on one Texas source, F-15 types from the substrate seat by request, then F-10 drains Texas, then F-06 publishes. Every lane has its own registered worktree; never build in another lane's checkout.
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

AGENT-CONTRACT v1890f0bb — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
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

PLAN-ROW: P-91, P-85 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools

# Q1 cortex routes, the subdivision ruling, and the BLOCK regex defect

# Mission: the two cortex routes Q1 needs, one ruling, and a silent-degradation defect on the records path

Four items, three of them small. They are batched because they share a seat and a file tree, not because they are one piece of work. Item 4 is unrelated to Q1 and can be done first; it is the only one with a live customer consequence.

## Item 1. A radius search. This is the whole of `near`

Q1 wants `find_parcel` to gain `near: {query, radiusFt}`. Measurement established that the centre point is NOT the gap and is already solved three separate ways: `situs-search` address-point hits carry latitude and longitude, `POST /place/resolve` geocodes any address, and the node facets route serves `cityLimitsFact.queryPoint` per parcel (live-verified at `{-97.31654, 30.10981}` for `48021:34137`).

What does not exist anywhere in the place surface is the set search: given a point and a radius, return the parcels. `neighboring-context.atom.ts` is the one purpose-built abstraction and it is registration-only with zero route callers, so it is a dormant mechanism rather than an available one. Whether that atom is the right home or a new route is cleaner is your call, not the planner's.

Two constraints from the consuming side, so it gets built once:

A truncated result must DECLARE its truncation rather than resemble a complete answer. The MCP already runs this rule everywhere (`anchorBatch` names cap, received, attempted and notAttempted for exactly this reason). A radius that silently returns the first N is the defect class this program keeps finding, and it is invisible from outside.

The cap wants to be a stated number rather than an implicit one, because the MCP publishes caps in its tool descriptions the way the 25 and 50 caps are published today.

## Item 2. Bare street-name search

The smaller half of `street`. A house-number-prefixed query already works through the existing wrapper with no change. A bare street name, the "everyone on Pine St" case Q1 exists for, does not, because the prefix match is anchored on the full house-number-first address string. This may fall out of item 1; if it does, say so rather than building it twice.

## Item 3. Subdivision. A RULING is owed before any code

Do not widen the regex. This is a source question wearing a parsing question's clothes.

The evidence: no `txgio` column holds subdivision or legal text at all, and the source shapefile's `LEGAL_DESC` field is documented as deliberately not captured. The shipped parser was run against all six real `legalDescription` fixtures in the repo's own suite and extracted a subdivision on ZERO of six, including two that plainly name one.

So the ruling is: do we ACQUIRE a subdivision field, or does the parameter REFUSE with a stated reason. Per the v3 card's own rule, if it cannot parse reliably it refuses. A wider regex is the wrong answer and would produce confident wrong groupings, which is worse than the refusal because a bad grouping looks like an answer.

Return the ruling with its reasoning. If the answer is acquire, name the source and the cost per jurisdiction, because the cost rule applies.

## Item 4. The `BLOCK` defect. Unrelated to Q1, and the only one with a live consequence

`artifacts/api-server/src/lib/recordsSearchQueryPlan.ts:16` reads:

    /\bBLK(?:OCK)?\.?\s+(\d+[A-Z]?)\b/i

That alternation expands to `BLK` or `BLKOCK`. It can never match the literal word `BLOCK`. Verified by violation rather than by reading:

    NOMATCH  "BLOCK 3"
    MATCH    "BLK 3"  -> block=3
    MATCH    "BLK. 3"  -> block=3
    NOMATCH  "BLOCK 12A"
    NOMATCH  "PECAN GROVE BLOCK 3 LOT 5"

Intended pattern is `BL(?:OC)?K`, or plainly `BLK|BLOCK`.

This matters more than its size because it degrades SILENTLY. A legal description carrying `BLOCK 3` yields no block term, so the records search query plan runs one term short and returns a wider result set that still looks like a complete answer. Nothing fails, nothing logs, and the caller cannot tell.

Two things beyond the one-line fix. Add a fixture that fails on the old pattern, so the repair is proven by violation rather than by reading. And check whether any already-issued records request was planned without a block term it should have carried; re-running those is cheap, and a wrong result there is indistinguishable from a right one from the outside.

## Optional item 5, same seat, cut it if you want a tighter card

Found in the 2026-08-31 W2 walk and confirmed at the paint layer: the flood facet's `zoneSubtype` never reaches the served row. All parcels read `present`, but some sit in the 0.2 percent annual chance band and others are minimal flood hazard, and the panel cannot tell them apart because the subtype is not on the wire. Two materially different findings rendering identically is a serve gap, not a data gap; the value is held.

## Boundaries and law

`artifacts/api-server/` is yours. `artifacts/smartsite-mcp/` is NOT: the integration seat owns it and any consuming change there is a separate card. Do not edit it, and do not add a vocabulary row for anything you introduce here. If a new refusal code or provenance string ships on a route the MCP reads, name it in your close and the planner will map it; a prose sentence is not a token and mapping one would be a starved row.

Work in your own registered worktree on your own branch. Subagents produce diffs and hand them back; you commit. Merge to main is self service on green CI read by conclusion string, not by exit code, and re-check that the base has not moved before merging.

## Fail closed

Every one of these has a refusal that is a correct outcome. A radius that cannot bound its result set should not ship. A subdivision that cannot parse should refuse with its reason. If item 1 turns out to need a store change you do not want to make yet, say so and stop; a declared block is worth more than a partial route.

State your snapshot in your first output: repo, branch, commit. Declare a leave-behind at close even if it is none.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-31_p91-q1-cortex_cp1.json
  CP2: _inbox/2026-08-31_p91-q1-cortex_cp2.json
  CLOSE: _inbox/2026-08-31_p91-q1-cortex_close.json
