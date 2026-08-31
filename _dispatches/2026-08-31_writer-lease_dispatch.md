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
repo: hauska-engine

# Four writers can be selected and none can persist: mint the lease CAD already mints

# Mission — the lease hole: four writers can be selected and none can persist

## Why this card exists

WRITEPATH-PROOF ran `well-fact` on Bastrop 48021 through the allowlisted job on
2026-08-31. The execute path is proven: `executionCount` moved 8 to 9, execution
`factory-atoms-cad-lwnvz` carried `--writer=well-fact --county=48021 --apply
--run-id=59444d3f-...`, Cloud Run recorded those args on the execution, and the
child was `write-well-fact-county.mjs` and not CAD. The predicted override defect
did not fire.

It then planned 69,000 atoms across 63,357 parcels (12,079 present, 56,921 absent)
and **wrote zero**, exiting 1 on:

```
LeaseRequiredError: writePropertyAtomsBatch requires a HeldLease
  write-well-fact-county.mjs:310 -> pg-storage.ts:295
```

Store read in `hauska_mcp` confirms `well-fact` 48021 = 0 and Caldwell 48055
unchanged at 53,841. CAD 48021 `max(updated_at)` is still 2026-08-12, which
independently confirms the correct child ran.

**So "the allowlist unlocks four of five writers" is measured false at the persist
layer.** It unlocks SELECTION for four and PERSIST for none. Only CAD can write.

## The hole, scoped by measurement rather than guessed

| writer | lease | `--run-id` | apply guard | calls write |
|---|---|---|---|---|
| `write-cad-parcel-roll-county` | 1 | 3 | 2 | 1 |
| `write-well-fact-county` | 0 | 0 | 0 | 1 |
| `write-building-footprint-county` | 0 | 0 | 0 | 1 |
| `write-utility-easement-county` | 0 | 0 | 0 | 1 |
| `write-setback-city` | 0 | 3 | 0 | 0 |

Three writers call `writePropertyAtomsBatch` with no lease, no `--run-id` parsing
and no guard. All three die exactly as `well-fact` did. The setback writer parses
`--run-id`, mints nothing and does not write yet, so it is a **fourth instance
latent** behind `SETBACK_APPLY_HELD` and must be fixed in the same pass or it
becomes the next identical surprise.

**A second defect rides with it.** CAD refuses `--apply` without `--run-id` at
`write-cad-parcel-roll-county.mjs:165` and exits 2 before doing any work. The others
accept `--apply`, plan the entire county, then die at the write. Fail-closed but
fail-late: `well-fact` burned a full county plan to reach a refusal it could have
made at parse time.

## The pattern to replicate, which already exists

Do not invent a lease design. CAD's is the reference and it is small:

1. Parse `--run-id` in **both** the spaced and `--run-id=` forms
   (`write-cad-parcel-roll-county.mjs:70-71`). Cloud Run passes `--name=value`, and
   a spaced-form-only reader silently runs on defaults.
2. Guard **before any planning work**: `if (args.apply && !args.runId)` refuse with
   code `LEASE_REQUIRED` and exit 2, carrying CAD's message verbatim in substance:
   a Factory runs row is required, the HeldLease is minted from that id, and a v1
   `ATOMS_WRITER_LEASE_HOLDER` env value cannot satisfy a write.
3. Take the lease with `takeScopedLease(sql, { scope, holder_label, run_id })` from
   `packages/storage/src/atoms-writer-lease.ts`, which returns a `HeldLease` and
   itself refuses an empty `run_id`. CAD's call shape:

```
scope: { scope_type: "write", entity_type: "<this rail>", county_fips: args.county }
holder_label: CLOUD_RUN_EXECUTION || K_REVISION || "<rail>-writer"
run_id: args.runId
```

4. Thread the `HeldLease` into `writePropertyAtomsBatch`.

**`entity_type` must be this rail's own, never `cad-parcel-roll`.** The lease scope
is `(scope_type, entity_type, county_fips)`, so a correct scope is what mechanically
enforces the standing "one bulk-writer per (store, entity_type, county_fips)" rule.
Copying CAD's `entity_type` would make two rails contend for one lease and turn a
concurrency control into a deadlock.

## Falsifier, stated before any run

For **each** of the four writers, both directions, and the second arm is the one
nobody has:

- `--apply` with **no** `--run-id` refuses `LEASE_REQUIRED` and exits 2 **at parse
  time**, before any county planning. Measure that it refuses early, not merely
  that it refuses.
- `--apply` **with** a valid `--run-id` takes a lease and writes. This is the arm
  that has never been observed for any non-CAD writer.

A writer observed only refusing has not been observed working. That is exactly how
this hole survived a merged allowlist, green CI, and a job read-back.

## The live re-verify

After the code lands, re-run the WRITEPATH-PROOF shape: `well-fact` on Bastrop
48021, one heavy operation at a time, run row first. Expected: 69,000 atoms planned
and **written**, verified by reading `hauska_mcp` (never `neondb`), plus the binding
spot-check that was UNMEASURED last time because no atom existed. Compare the
written count against the plan; a gap between planned and written is a finding, not
a rounding.

Do not re-run 48021 on the old image.

## Do not

- Do not weaken or bypass the lease requirement. It is the control working.
- Do not write without a Factory runs row.
- Do not reuse CAD's `entity_type` in another rail's lease scope.
- Do not fix only `well-fact`. Three are broken and a fourth is latent.
- Do not run two heavy operations concurrently.
- Do not release Hays, McLennan, Travis or Williamson. This card does not release
  the wells wave and does not release P4.
- Do not touch the setback quarantine, which is `P4-QUARANTINE`'s card.
- Do not touch any repository other than the registered engine worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare
snapshot (repo, branch, commit) in the first output. State the falsifier for each
writer before running it, and report both arms per writer. `leave_behind` named.
Subagents do not commit. Verification does not delegate below the lane planner.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-31_writer-lease_cp1.json
  CP2: _inbox/2026-08-31_writer-lease_cp2.json
  CLOSE: _inbox/2026-08-31_writer-lease_close.json
