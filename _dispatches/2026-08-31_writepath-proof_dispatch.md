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

PLAN-ROW: F-02 (90_operations/OPS-19_factory_plan_of_record.md)
repo: hauska-factory

# One named execution: well-fact on Bastrop, to turn executionCount 8 into evidence

# Mission — one named execution to convert `executionCount: 8` into evidence

## Why this card exists

The writer allowlist is merged at both layers. Engine PR #367 (`76b13d16`) puts
`--args=--writer=cad-parcel-roll` on the `factory-atoms-cad` template and removes
the unconditional `CAD_PARCEL_ROLL_PATH`. Factory PR #45 (`d93c7b06`) stamps the
writer flag into the execute override, because `containerOverrides.args` REPLACE
template args rather than appending. The job read-back at generation 3 confirms
`args: ["--writer=cad-parcel-roll"]`.

**And `executionCount` is still 8. Nothing has run through the new path.**

A path proven in tests and never executed in production is not proven. The write
path is the historical bottleneck on this board, and the right time to find a
problem in it is on one named county, not partway through six counties of rails.

**This card is a P4 rail apply. It is not the P4 wave, and it does not release
one.** Be honest about that in the close rather than calling it something else.

## The candidate, and why this one

**`well-fact` on Bastrop 48021.** Chosen on entanglement first, size second.

Wells are owed on five counties (Caldwell already holds 53,841). Bastrop at 62,257
parcels is the smallest owed county. Every FIPS has wells, so the fact path is
exercised and not only the absence path.

The two things blocking the P4 wave do not touch this rail:

- The **quarantines** are 188,103 placeholder `setback-rule` atoms and McLennan's
  65,814 envelopes derived from zero rules. Different entity types. Wells land
  nowhere near them.
- **P3 absence** concerns the city-scoped rails (setbacks, edges, envelope) whose
  scope comes from zoning. Wells are county-scoped. A parcel with no well is an
  absence within this rail itself, per A-028.

So wells is the rail least entangled with what is actually blocking P4, which is
exactly what a proving run should be.

`utility-easement` was considered and rejected: Bastrop is tiny there (~155
features) but the easement writer still live-fetches ArcGIS, a known unfixed
defect. Proving the write path on a writer with a known defect proves nothing.

## What to do

1. **Serialize.** P2-JURIS-PERSIST may be running containment on Caldwell or Hays.
   Confirm no other heavy operation is live before starting. Different logical
   stores (`hauska_mcp` for atoms, the Factory/landing side for containment) but
   confirm rather than assume they are not contending.
2. **Run row first.** No write without one. If the run record cannot be written,
   the run does not start.
3. Execute `factory-atoms-cad` with `--writer=well-fact --county=48021`. Note the
   template carries `--writer=cad-parcel-roll`; the execute override REPLACES
   template args, so the override must carry BOTH flags or the writer selection is
   wrong. That interaction is the single most likely failure and is the thing this
   run exists to expose.
4. One `run_event` per chunk, naming range, row count and wall time. A count is not
   a record.
5. Record wall time per chunk. It is **data, not a law**. Do not fit a curve, do not
   derive a rate, do not let it license a chunk size or a wave estimate.

## The falsifier, stated before the run

**`executionCount` must move from 8 to 9.** If it does not, the execution never
reached the job and everything downstream is a story about a run that did not
happen.

Then, and this is the part that matters: **verify from the STORE, not from the
job's own report.** A job reporting success is a claim. Read back:

- atoms written for 48021 `well-fact`, counted in `hauska_mcp` (NOT `neondb` — the
  wrong database returns a false absence)
- the termination record exists and says what the job says
- spot-check that a written atom's `county_fips` matches the county parsed from its
  binding, which is two independently derived inputs rather than one field

**Pre-registered failure outcomes, all of which are findings and none of which are
to be worked around:**

- The job runs the **CAD writer** instead of well-fact. That means the override did
  not carry the writer flag and the allowlist selected the template default.
- The job **refuses** `WRITER_REQUIRED` or `WRITER_NOT_ALLOWLISTED`. The guard bites
  in production, which is good, and the caller is wrong.
- The job succeeds and the store holds **nothing**. Silent success is the worst
  outcome on this board and must be reported loudly.
- Wall time is far outside the 67 to 149 atoms/s the write path measured
  previously. Report the number; do not explain it with a mechanism you have not
  measured.

## What this run does NOT do

It does not release the wells wave. Hays, McLennan, Travis and Williamson stay held
until this reads back clean from the store.

It does not release P4. The quarantines are still owed and P3 still has zero files.

It does not license a rate, a chunk size, or a duration estimate for any other
county.

## Do not

- Do not run a second heavy operation concurrently.
- Do not start without a run row.
- Do not re-run a completed rail to feel safe. Caldwell wells are done; leave them.
- Do not apply any other rail, county, or writer on this card.
- Do not touch the setback placeholders or the McLennan envelopes.
- Do not read `neondb` for atom counts.
- Do not treat the job's own success report as the verification.
- Do not touch any repository other than the registered worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare
snapshot (repo, branch, commit) in the first output. State the falsifier before
running the execute. Report `executionCount` before and after. `leave_behind`
named. Subagents do not commit. Verification does not delegate below the lane
planner.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-31_writepath-proof_cp1.json
  CP2: _inbox/2026-08-31_writepath-proof_cp2.json
  CLOSE: _inbox/2026-08-31_writepath-proof_close.json
