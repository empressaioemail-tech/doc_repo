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

# P1 edge honesty on the wire — DrawEdge.state union, retired-edge filter, sourceAdapter passthrough

# P1 controls — legacy-design-tools (edge honesty on the wire)

## How to work this card (read first)

**Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.**
If a step looks like it needs a second agent, it needs a smaller step instead.

**You are authorized.** This card is compiled from the plan of record and carries
the operator's go for the work described. Do not stall waiting for permission you
already have. If you believe a step is wrong or unsafe, say so in the handback and
do the rest — do not silently narrow the scope, and do not refuse the whole card
over one item.

**Verification must terminate.** Every command you run exits on its own: builds,
typechecks, `vitest run`, or background-start plus `curl` plus kill. Never `watch`,
`serve`, `tail -f`, or anything that waits for a signal.

**Read product code by ref, not from the working tree.** Local checkouts here sit
on feature branches hundreds of commits behind and may not contain the files named
below. Use `git -C <repo> show origin/main:<path>` and
`git -C <repo> grep -n <pattern> origin/main -- <pathspec>`.

**Hand back, do not land.** No commit, no push, no deploy, no migration applied to
any store, no job started. Produce the diff and write the close artifact named at
the end of this dispatch. The planner commits and runs.


Two changes. One makes a dead field able to express refusal; the other stops
serving retired geometry. Both are serve-path, neither mints an atom.

Repo: `legacy-design-tools`. Read by ref (`git -C /p/legacy-design-tools show
origin/main:<path>`) — the local clone sits on a feature branch ~200 commits
behind and does not contain these files. No deploy. Produce a diff and a handback;
the planner commits and deploys.

## Why now

Measured on the live wire and in `hauska_mcp` on 2026-08-30: of **9,877** neighbour
ids Bastrop ships, **741 are sound — 7.5%**. Of 7,838 edges asserting a shared
boundary, 7,097 fail reciprocity (90.55%), and the failures are not near-misses:
median length disagreement 31.2 ft, median bearing error 85.4°. Every one of those
edges serializes with `state: "present"`.

## 1. `DrawEdge.state` must be able to say something other than present

`artifacts/api-server/src/lib/parcelDrawStub.ts` types `state: "present"` — a
literal with **one inhabitant** — and the push site hardcodes it. All 17 edges
across three live parcels read `"present"`, including two neighbours that are
demonstrably ray-casts across a street.

This is worse than a missing field. The key is `state`, **the same key overlays
use**, where it is a real union (`present` / `unknown` / `refused`, with `reason`,
`provenance`, `vintage`). Anyone grepping for a disposition on edges finds one and
answers yes; a model that learned from the overlays that `state` is earned reads a
refuted neighbour's `present` as earned.

Widen it to the real union. **Do this as a type, not a check** — ENFORCEMENT
prefers a discriminated union the compiler enforces over any check, because it has
no trigger to be missing and no call site to be absent. Every consumer should fail
to compile until it handles the other states, and the writer should be forced to
choose.

Two states, not one, and do not collapse them:
- A neighbour that is merely **unverified** (nobody cross-checked it) is `unknown`.
- A neighbour that is **refuted** — the payload contains a positive contradiction —
  is `refused` with `agentGuidance`. `unknown` there would be a lie in the other
  direction, because `unknown` means we did not look.

Also stop encoding absence by omission: `...(neighbor ? { neighbor } : {})` gives
three states ("none found", "found by probe", "found and contradicted") two
encodings between them.

## 2. Stop serving retired edges

**723 retired fixture edges ship live** — verified through `get_smart_site` on
`103387`, `104119`, `104121`. The serve path does not filter `status`. They
duplicate ring segments, corrupt the drawn ring, and on the **426** parcels
carrying edges from both adapters they supply the **only** neighbour id.

Filter `status` on the serve path. This is the one item that must land before P4
mints, and it is independent of the neighbour join.

## 3. Restore `sourceAdapter` to the projection

`sourceAdapter` is on `BoundaryEdgeFactPresent` and appears nowhere in
`parcelDrawStub.ts` or `parcelDrawFromReads.ts` — zero grep hits, absent from the
live wire. **19,159 of Bastrop's 26,846 edges are `descriptor-fixture`** against
~7,687 from the production writer. Neither the customer nor the model can currently
tell fixture geometry from production geometry. Carry it through.

## Not in scope, deliberately

- **Do not repair neighbour labels.** 74.5% of misses have no geometric counterpart
  at all, so there is nothing to overwrite from; and overwriting from a reciprocal
  is the same 3 m probe pointed the other way — one derivation laundered as two.
- **Do not add the `adjacencyKind ∈ {ROW, alley} ⇒ neighbour NULL` invariant.** It
  was measured and **refused**: 99.56% of those 2,039 pairs are touching at exactly
  0.0 ft, and it would null ~300 geometrically true ids. Alleys are *more* valid
  than ROW (35.92% vs 12.07%), so splitting by kind does not rescue it.
- **Do not touch the writers.** Depth-warm hardcodes `parcelNeighborPropId: null`
  (`emit-boundary-edges-from-warm.ts:120`); the fixture corpus came from
  `boundary-primitive/compute.ts:226`. Neither is this card.

## Acceptance — both directions

A fixture whose neighbour is refuted cannot emit `present`, and a gold shared
boundary that passes reciprocity may stay `present`. A retired edge is absent from
the served body and an active one is present. `sourceAdapter` appears on the wire.
`tsc` fails before the change is complete — that failure is the evidence the type
is doing the work.

## Do not

Deploy. Mint or repair atoms. Copy GIS or the bake ring onto `property-boundary-edge`
(P-53 is read-time and still binds). Widen `present` to admit a bad neighbour —
split the type instead. Report a check working because it passed once.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-30_p1-ldt_cp1.json
  CP2: _inbox/2026-08-30_p1-ldt_cp2.json
  CLOSE: _inbox/2026-08-30_p1-ldt_close.json
