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

PLAN-ROW: P-92 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools

# P2b serve honesty — X2 edge disposition WITH sourceVintage, five one-liners, PE scope

# P2b — the serve path says what the wire says

## How to work this card (read first)

**Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.**

**You are authorized.** Compiled from the plan of record; carries the operator's
go. If a step is wrong, say so in the handback and do the rest.

**Verification must terminate.** Builds, typechecks, `vitest run`, or
background-start plus `curl` plus kill. Never a watch or a serve.

**Read product code by ref.** `hauska-map` and `legacy-design-tools` checkouts here
sit ~200-240 commits behind on feature branches and do not contain these files.
Use `git -C <repo> show origin/main:<path>`.

**Hand back, do not land.** No commit, push, or deploy.

## Why this supersedes the existing PE wiring card

Do not work from `_inbox/2026-08-30_ctx_pe_wiring_WDLL.md`. It was written against
a recon that was measured wrong in three places:

- It says the grey box keys on **envelope nullity**. It does not. It keys on
  per-row `absent-uncovered` ∩ `inCoverageBlock` over `landUse` / `zoning` /
  `setbacks`, with `buildable` explicitly excluded. A lane following that card goes
  to the envelope code — the wrong file.
- It says PE "lies about a value it has". It does not. PE **refuses cortex zoning
  by design** (`atom-chain-to-facets.ts:1201`, anti-zombie), so copy alone will
  never surface PDD.
- It treats item 3's `partial` as a **deploy lag**. It is a missing change: #310 is
  merged but only widens a type union in `src/lib/layer-absence.ts`, and the BFF
  drops the token — `api/_lib/verdict-layer-merge.ts:5` keeps a private union
  (`absent-verified | lookup-failed | not-applicable`) that #310 never widened.
  Redeploying changes nothing.

## The through-line

Every item here is the same defect: **a disposition vocabulary that exists at the
section level and is unreachable at the leaf.** Five instances now. Fix them
together or the hole moves one field over.

## 1. Edge disposition (X2) — and item 4 lands WITH it, not after

`artifacts/api-server/src/lib/parcelDrawStub.ts` types `state: "present"` — a
literal with **one inhabitant**, hardcoded at the push site. All 17 edges across
three live parcels read `"present"`, including two demonstrable ray-casts. Of
9,877 neighbour ids Bastrop ships, **741 are sound (7.5%)**.

Widen to the real union **as a type, not a check** — ENFORCEMENT prefers a
discriminated union the compiler enforces, because it has no trigger to be missing
and no call site to be absent. `tsc` failing is the evidence it works.

Two states, do not collapse: a neighbour nobody cross-checked is `unknown`; a
neighbour the payload positively contradicts is `refused` with `agentGuidance`.

**Simultaneously**, `parcelDrawFromReads` maps every absent read as bare
`{state: "absent"}` and drops `sourceVintage`, so `verifiedAbsence` always returns
`unknown` / "provenance unknown; vintage unknown". **`absent-verified` is
unreachable** on flood, well and specialDistrict, and on pipeline plain-absent —
the only absent-verified the draw can emit today is pipeline present-outside.
Carry `sourceVintage` through. Shipping X2 while the overlays still cannot reach
`absent-verified` leaves the identical hole one field over.

Also stop encoding absence by omission: `...(neighbor ? { neighbor } : {})` gives
three states two encodings between them.

## 2. Four more one-liners, all located

From `_inbox/2026-08-30_p91_measurement5_field_inventory.md` items 3, 5, 6, 8:

| Defect | Fix |
|---|---|
| `attrs.landUse.desc` — reader keys `landUseDescription` / `desc`; bake writes `description` | align the key |
| `attrs.landUse.taxYear` — reader keys `taxYear`; bake writes `vintage` | align the key |
| `yearBuiltFromBake` reads `facets.yearBuilt` / `baseFacts.yearBuilt` — **keys no Tier-1 bake writes** | only the structural `cad_property` read can populate this; remove the dead fallback or point it at the real key |
| `manifestLayers` reads `facets.envelope.geojson` from a snapshot the loader already nulled | `layers` is always empty, `degraded` always true — **empty by construction**. Fix the read order or refuse honestly |

The manifest one is a dormant mechanism: a manifest that can never carry a layer
will never report one missing.

## 3. PE copy — scope, not wording

The grey box's **"setbacks" half is TRUE** (Rainmaker is in a 3,747-parcel
`no-setback-row` refused roster). Do not fix the string as a unit — replacing a
half-lie with a whole lie is worse. The defect is scope: a per-parcel row state
printed as "in this area".

Also: `inspectHighLevelLabel` returns the literal `"Zone"` for `landUse`; and
`"A1 — A1"` is minted inside PE by `description: landUseLabel ?? landUseCode` — a
defaulted field — then rendered again as a second datum at
`sheet-to-card-model.ts:526`. Three PE renderers of that one field disagree.

**Render `yearBuilt` with its source.** CAD says 2021 on Driftwood
`48021:8715051`; the listing says 2022. A bare number puts two contradicting
figures on one screen.

## 4. Restore `sourceAdapter`; add an absolute anchor

`sourceAdapter` is on `BoundaryEdgeFactPresent` and appears nowhere in
`parcelDrawStub.ts` or `parcelDrawFromReads.ts` — zero grep hits, absent from the
wire. **19,159 of Bastrop's 26,846 edges are `descriptor-fixture`.** Neither the
customer nor the model can tell fixture geometry from production. Carry it.

`parcelDrawStub` types `origin: "centroid"` with no absolute anchor, so every ring
ships in its own local frame. Add one. It is the same root cause behind the v3
multi-parcel view and behind X1 being unable to test endpoint coincidence.

## Acceptance — both directions, and on a live surface

A refuted neighbour cannot emit `present`; a gold that passes reciprocity may stay
`present`. A flood/well/specialDistrict absence with a known vintage emits
`absent-verified`; without one it emits `unknown`. `attrs.landUse.desc` and
`.taxYear` populate. `sourceAdapter` appears on the wire. `tsc` fails before the
change is complete.

**Customer-done is a live brief plus a deployed bundle marker, never a merged PR.**
#310 is the proof. Note the deployed PE bundle currently carries no marker and
nothing writes one — coordinate with the Gate 8 lane, which owns adding it.

## Do not

Deploy. Mint or repair atoms. Repair neighbour labels (74.5% of misses have no
counterpart to overwrite from). Add the `adjacencyKind ⇒ neighbour NULL`
invariant — measured and **refused**: 99.56% of those 2,039 pairs touch at 0.0 ft
and it would null ~300 true ids. Copy GIS or the bake ring onto
`property-boundary-edge`. Widen `present` to admit a bad value — split the type.
Work from the superseded PE wiring card.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-30_p2b-serve_cp1.json
  CP2: _inbox/2026-08-30_p2b-serve_cp2.json
  CLOSE: _inbox/2026-08-30_p2b-serve_close.json
