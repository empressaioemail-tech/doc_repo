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
repo: hauska-map

# repoint the staging site at the stable Neon branch

## Mission — repoint the staging site at the stable Neon branch

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

You are a FRESH session. Everything you need is here; do not go hunting for context in
other threads.

### Your seat and worktree

You are the **property seat**. The Vercel project `smart-site-factory` deploys from
`hauska-map/apps/factory`, and hauska-map is the property seat's repo.

Register a worktree in `_catalog/seat_register.json` before your first git write or the
seat-worktree-gate refuses you. Add it under the `property` seat with **BOTH** `path` and
`worktree` set to the same value:

    {
      "name": "hauska-map-sitepoint",
      "path": "P:/tmp/hauska-map-sitepoint",
      "worktree": "P:/tmp/hauska-map-sitepoint",
      "branch": "fix/staging-site-stable-branch"
    }

An entry carrying only `worktree` resolves to an empty repoPath, collides with every other
such entry, and the gate refuses every git write with `product_index_foreign`. That defect
has been introduced twice this week. Set both.

`_catalog/seat_register.json` is a last-writer-wins shared blob with no per-seat namespace
and three other doc_repo threads are live right now. `git pull` immediately before you edit
it, `git add` it by explicit pathspec, and never `git add -A`.

Declare your snapshot in your first output: repository, branch, commit.

### The problem, in one paragraph

`smart-site-factory.vercel.app` serves the staging Smart Site. Its database connection
string was fixed at deploy time and its last deploy was 2026-08-27, so it is pinned to a
Neon branch created that day. Meanwhile `factory-staging-reset` used to mint a NEW
timestamped Neon branch on every run. The result: the staging site has never once read the
branch a staging bake writes to. Measured 2026-09-08 on Caldwell parcel 48055:20478 — the
staging branch carried a fresh bake at 14:41Z while the site served a 2026-09-01 snapshot.
Because OPS-19 rule 6 requires a passed staging sibling before any production publish, this
made the production bake path unreachable for EVERY county, not just the one being baked.

The factory side is already fixed (hauska-factory `3e0edafe`): staging-reset now restores a
STABLE branch named `f06-staging-neondb` in place, keeping its id and endpoint host, so the
host never moves again. Your job is the one-time repoint of the site onto that stable host.
After this, no repoint is ever needed again.

### What to do

**1. Confirm the stable branch exists before anything else.** Read the authoritative record
rather than trusting this document, whose values would go stale:

    -- against FACTORY_DATABASE_URL
    SELECT neondb_host, neondb_branch_id, reset_at FROM staging_targets WHERE id = 'staging';

Cross-check the branch NAME via the Neon API and confirm it is exactly `f06-staging-neondb`
with no timestamp suffix:

    curl -s -H "Authorization: Bearer $NEON_API_KEY" \
      https://console.neon.tech/api/v2/projects/fancy-fire-06136146/branches

If the name still ends in digits, the stable-branch reset has not run yet. **STOP and report
to the integration seat.** Do not repoint at a timestamped branch; you would be redoing this
next week.

**2. Get the connection string for that branch.** `STAGING_NEONDB_URL` in GCP Secret Manager
(project `hauska-prod-497015`) is rotated by staging-reset to the current staging branch:

    gcloud secrets versions access latest --secret=STAGING_NEONDB_URL --project=hauska-prod-497015

Confirm its host matches `neondb_host` from step 1 before using it. If they disagree, stop
and report — that disagreement is itself a finding.

**Never print a connection string into a commit, a PR body, a doc_repo artifact, or a chat
message.** Echo its length to prove you have it, nothing more.

**3. Set it on the Vercel project and redeploy.** Project `smart-site-factory`, scope
`empressaioemail-techs-projects`. There is NO local `.vercel` link for it; hauska-map's
existing link points at `property-explorer`, a DIFFERENT project (smartsite.cloud) that must
not be touched. Link in a scratch directory or pass `--project` so you do not disturb it.

Read `apps/factory` source to find which env var the app actually reads before setting
anything. Do not assume it is `DATABASE_URL`.

This project has no auto-deploy; every deploy is a CLI deploy. A changed env var does NOT
take effect until you redeploy.

**4. Verify by reading the served data, never the deploy record.** A Vercel CLI exit code
does not tell you what is serving, and the newest Production deploy timestamp does not tell
you which env is in it. Both commands below terminate; do not use a watch, tail or serve.

    curl -s --max-time 60 "https://smart-site-factory.vercel.app/site/api/spine/cortex/api/brokerage/v1/place/node/48055%3A20478/facets" | head -c 300

Read `snapshotAt`. Before your change it is `2026-09-01T22:01:22.861Z`. After, it must equal
the `snapshot_at` for that parcel in the staging branch:

    -- against STAGING_NEONDB_URL
    SELECT snapshot_at FROM place_layer_snapshots
     WHERE place_key = 'node:48055:20478' AND adapter_key = 'node-facets:tier1';

**Those two values matching is the whole deliverable.** If `snapshotAt` is unchanged, the env
var did not take effect, whatever the deploy reported.

### What you must NOT do

Do not touch the `property-explorer` project or `smartsite.cloud`. That is the customer
production surface and a different project entirely.

Do not delete any Neon branch. Six staging branches have accumulated and the site is
currently pointed at one of them. Deleting is irreversible and cleanup is an operator call
that happens AFTER this repoint is verified, not as part of it.

Do not change `PRODUCTION_NEONDB_URL` or anything in the production project.

Do not run a bake, a staging reset, or `publish-gate-sched`.

### Report

CP1 after step 1, stating whether the stable branch exists and what `staging_targets` says.

Close with: the env var name you found and set, the deployment URL, `snapshotAt` before and
after, the matching `snapshot_at` from the staging branch, and a `leave_behind` block.

If the two timestamps do not match at the end, say so plainly and do NOT close green. A
repoint that reports success while the site still serves stale data is worse than not
running at all, because the next person will trust the walk.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-08_ctx-sitepoint_cp1.json
  CP2: _inbox/2026-09-08_ctx-sitepoint_cp2.json
  CLOSE: _inbox/2026-09-08_ctx-sitepoint_close.json
