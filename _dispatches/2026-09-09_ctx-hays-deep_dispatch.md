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
repo: legacy-design-tools

# The operator does not believe Hays CAD is missing 30000 properties

# CTX-HAYS-DEEP — the operator does not believe Hays CAD is missing 30,000 properties, and he should not have to take our word for it

Repo: `legacy-design-tools`. Reuse the registered worktree
`P:/seat-worktrees/property/legacy-design-tools-ctx-hays` on branch
`fix/ctx-hays-2026-cad-reacquire`. Read-only measurement; a code diff is not expected.

## Why this exists

Two prior lanes have looked at Hays and both concluded the same thing, and the operator's
instinct is pushing back on it. That instinct is the reason for this lane. Every
measurement so far has been taken against sources we chose, using our own parsing logic,
compared against our own store. Nothing external has ever confirmed the account count.

Read first, in this order:

- `_inbox/2026-09-09_hays_2026_cad_roll_is_incomplete_finding.md` (the original alarm)
- `_inbox/2026-09-09_ctx-hays_acquisition_mechanism_resolved_finding.md` (mechanism B)
- `_inbox/2026-09-09_ctx-hays-split_close.json` (the lineage split)

## The two readings of the operator's doubt, and you test both

The operator said: "I don't see the appraisal district missing 30k+ properties on their
roll."

**Reading 1 — is 134,606 the whole Hays roll?** Maybe our export covers only part of what
Hays CAD actually appraises. This is the reading that would reopen mechanism A and it has
never been tested against anything outside our own pipeline.

**Reading 2 — did Hays actually lose 30k accounts?** On the current evidence, no. The
prior lanes' own numbers say the 2025 CAD-only population was 131,246 and the 2026 roll is
134,606, which is GROWTH of about 3,360, entirely normal. The apparent 21.8 percent shrink
came from our own 2025 baseline having been padded with 116,421 StratMap land-parcel rows,
40,870 of them net new, applied 2026-08-25 as a coverage fallback. If that holds, the
answer to the operator is that the appraisal district is not missing anything and we
inflated our own baseline.

**Confirm or refute reading 2 explicitly and state it in one sentence a non-technical
reader can act on.** It may already be the whole answer, and if so it should be said
plainly rather than buried under a third investigation.

## The independent authority, which is the point of this lane

Everything so far is one derivation: our fetch, our parser, our store. Get a second one
that Hays CAD and this program do not both control.

Candidates, in rough order of authority. Use at least two:

1. **Texas Comptroller.** The Property Tax Assistance Division publishes per-CAD data
   including the Property Value Study and biennial Methods and Assistance Program reviews.
   These carry account or parcel counts per appraisal district from an authority that is
   neither us nor Hays CAD. This is the strongest available check.
2. **Hays CAD's own published totals.** Certified totals, annual report, or board
   materials on `hayscad.com` typically state a roll size and a property-type breakdown.
   A number they publish in prose is independent of the file they publish as data.
3. **Property-type composition.** A CAD roll is not only real property. It carries
   personal or business property, mineral and industrial accounts, and exempt accounts.
   Establish what property types the Orion record-1 Property file contains and whether any
   category is published in a separate file we never fetched. **This is the single most
   likely mechanism for an undercount and it is cheap to check.**
4. **Per-capita and per-county sanity.** Compare accounts against population and against
   the five other counties already in the store (48021, 48055, 48309, 48453, 48491). A
   Hays figure wildly out of line with its neighbours is a signal; one in line is weak
   confirmation. Weak confirmation, stated as weak, is still worth having.

## Also check the mundane failure modes, because they are the most common

- Does `hayscad.com/data-downloads/` publish more than one 2026 file set, or a file we
  have never fetched? The prior lane fetched three and all agreed, but agreement among
  three files of the same kind does not rule out a fourth of a different kind.
- Is the record-1 Property file paginated, split, or truncated in any of the drops?
- Does our Orion parser drop rows silently on a schema it does not recognise? The
  2026-07-18 Certified export used a different schema entirely and the prior lane counted
  it as raw rows (R=123,429 P=8,682 M=2,479 N=10). **Those record-type letters look like
  they encode property class. Establish what R, P, M and N mean.** If M is mineral and P
  is personal property, that breakdown may be the answer to the whole question.

## Pre-register your falsifier

Before you fetch anything, state what result would prove reading 2 wrong and mechanism A
right. Name the number you expect from the independent authority and what you will
conclude at each of: near 134,600, near 172,000, or something else.

If an external authority reports Hays at roughly 172,000 accounts, mechanism A is back and
this program has a real acquisition gap on a launch county. Report that loudly. Being
wrong twice is cheaper than being confidently wrong once.

## What you must NOT do

Do not re-acquire, apply, or write anything to `cad_property`.

Do not touch `MAX_MISS_RATE` or any gate threshold.

Do not bake, publish, walk, deploy, submit a Cloud Build, or run a Cloud Run job.

Do not write to hauska-factory, hauska-engine or hauska-map.

Do not manufacture a code diff. Two prior lanes in this worktree correctly shipped nothing
and said so. Do the same if that is the honest outcome.

Fetching a public page needs a browser User-Agent; a bare fetch gets a 403 WAF block. That
is a header, not an auth bypass. Do not attempt anything that requires credentials, and do
not crawl on borrowed logins.

## Close contract

Standard lane close JSON, plus:

- The independent authority figures, each with its source URL, publication date and what
  exactly it counts.
- The property-type composition of the export, and what R, P, M and N denote.
- A plain-language verdict on reading 2 in one sentence.
- Whether mechanism A is reopened, and if so what the real acquisition gap is.
- Your pre-registered falsifier and whether it fired.
- `leave_behind`.

Write the close so the operator can read the verdict without reading three prior closes
first. He is the audience for this one.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-09_ctx-hays-deep_cp1.json
  CP2: _inbox/2026-09-09_ctx-hays-deep_cp2.json
  CLOSE: _inbox/2026-09-09_ctx-hays-deep_close.json
