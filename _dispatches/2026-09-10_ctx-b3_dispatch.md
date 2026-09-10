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

PLAN-ROW: P-124 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-factory

# The instrument that ends the serial discovery

# CTX-B3 — the instrument that ends the serial discovery

Repo: `hauska-factory`. This is the structural correction the third-party review identified.
It is worth more than any individual fix in this program.

## Why this exists

The review's central finding
(`_inbox/2026-09-10_ctx_third_party_review.md` section 2): **the instrument that declares a
county done guarantees a new defect class behind every cleared one.**

`verify-walk.mjs`'s `gradeParcelResponse` grades a sample of roughly 180 parcels per county
by one HTTP read each. It **short-circuits** — a non-ok HTTP response fails
`BP-MEANING-01` at 478-480 and nothing behind it is graded; an earned retirement grades
`RETIRED` and skips content at 490-522. `gradeTier1Content` (424-464) checks that each of 28
required leaves carries one of four recognised states. **It does not read a dollar value, a
provenance string, or a second source.**

And `BAKE_OWNED_REQUIRED_LEAF_PATHS` is grown **by hand**: four leaves on 2026-09-08, acreage
on 2026-09-09. The divergence test between the walk's list and the bake's list **skips in
CI** because no LDT checkout is present
(`_inbox/2026-09-09_ctx-walkrule_close.json:84-90`).

So a leaf not yet on the list is invisible until someone adds it, a 422 hides every leaf
behind it, and 180 sampled parcels could never see 291,231 null acreage cells — which one
SQL over the store could have counted at any time since 2026-08-30.

**Serial discovery is guaranteed by construction. Another fix does not end it. This does.**

## The precedent, already in this repo

`scripts/ctx-prov/provenance-population.mjs` re-expressed **one** walk predicate as SQL over
the whole served store for all six counties and found **18,037 rows** in a full-table scan
that the sampled walk had surfaced as a **single parcel**.

B3 is that script generalised to every required leaf.

## What to build

A file-based, self-tested script that reads **every** `place_layer_snapshots` tier-1 row for
a county on the target store and classifies:

- each of the 28 required leaves, using the walk's own classifier so the two cannot disagree;
- the four dollar fields;
- the owner name;
- the structural tier.

Reporting counts per `(county, leaf, state)`.

**It must refuse on:**

- any unrecognised state — the walk's `classifyRequiredLeaf` silently passed those before
  2026-09-09 and that is exactly the failure being designed against;
- any sentinel string — the review found an owner name of `"-"` served as present
  (`48309:109745`), a value-history entry with every field null served as present
  (`48055:1`), and a `vintage` field that is a batch write timestamp on present values and a
  source-edition string on absent ones, so the field does not mean one thing;
- any tier-field disagreement — `48021:35585` has a structural tier saying `cad-export`
  while its own vintage string says `tier:stratmap-roll;adapter:stratmap`.

## Take the leaf list from the bake, not the walk

The walk-rule lane recorded that **the walk's required-path list is stale against the pinned
bake by eight paths.** So B3 must read its list from the bake's own
`BAKE_OWNED_REQUIRED_LEAF_PATHS` **at the pin**, not from the walk.

If those two lists disagree, that disagreement is itself a finding and belongs in your close
with the count.

## Self-test in both directions, and the instrument's own falsifier

Required fixtures, each observed failing before passing:

- a bare null must fail;
- an owner of `"-"` must fail;
- a clean fixture must pass.

**The instrument's falsifier: if it passes a store the walk fails, it is wrong.** State how
you tested that rather than asserting it.

This is the discipline CTX-PIN used when it validated its module tracer by first reproducing
a known answer at the old pin before trusting it anywhere new. Do the same.

## Scope

Read-only against the store. This script measures; it writes nothing to any parcel, cell or
snapshot.

It must run per county and against either target (staging or production), taking the store
from the same environment variables the existing jobs use. Say which store each reported
number came from — a census that does not name its store is the stale-instrument failure
this repo already documents.

## What you must NOT do

Do not modify the walk, `BP-CONTENT-01`, the permitted state set, or the cohort sampler.
This lane builds a second instrument; it does not change the first.

Do not deploy, submit a Cloud Build, or run any Cloud Run job, bake, publish or walk.

Do not write to `legacy-design-tools`, `hauska-engine` or `hauska-map`.

Two other lanes are live in this repo on separate worktrees (CTX-B2 on the cadRoll
expectation and pin; CTX-TEARDOWN read-only). If your work touches the same files, STOP and
report the collision rather than resolving it.

## Traps carried forward, all paid for in the last two days

`place_layer_snapshots.place_key` is `node:<fips>:<prop_id>`. `parcel_record_cell.place_key`
is `<fips>:<prop_id>`. Two tables, two shapes; the integration seat assumed wrong and got six
rows of `n=1` that looked like an answer.

Unscoped scans on these tables time out. Scope and set `statement_timeout`.

`runs` has `started_at`, not `created_at`. Dry runs write no run row.

`parcel_gate_verdict` is a **cached** evaluation carrying `evaluated_at`; a read taken during
a write is meaningless.

## Close contract

Standard lane close JSON, plus:

- The census output for all six counties, per leaf, per state, with the store named.
- The disagreement between the walk's list and the bake's list, with the count.
- Every sentinel class it refuses, and how many rows each catches today.
- All three self-test runs, both directions.
- How you tested the instrument's own falsifier.
- `leave_behind`.

Report the merge commit. This instrument is what the integration seat runs before and after
every county publish from here on.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-10_ctx-b3_cp1.json
  CP2: _inbox/2026-09-10_ctx-b3_cp2.json
  CLOSE: _inbox/2026-09-10_ctx-b3_close.json
