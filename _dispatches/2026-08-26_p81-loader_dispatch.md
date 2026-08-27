CANON-PREAMBLE vd3c673f8
- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HOLD LIFTED 2026-08-26 for the Factory program (`_decisions/2026-08-26_factory_program_and_hold_lifts.md`); the Bastrop QA condition is cosmetic and does not gate the data path. NO PRIVILEGED DATA and the Hauska spine rule stand.
- THE FACTORY (OPS-19, `F-` rows) — one machine built to the MODEL LAW (`19_the_instrument_contract.md`, `_blueprint/10_model.md`, `_blueprint/20_pipeline.md`, `_blueprint/40_rule_register.md`, `51_ingestion_pipeline_reference.md`, `24_instrument_conformance_program.md`; package `dist/*.d.ts` is the tiebreaker; `25_atom_architecture_reference.md` is superseded for the model): four layers, five canonicalisation stages, each stage the executor of its `BP-` rules; own repo `hauska-factory`, own Neon store, console Smart Site Factory in `hauska-map/apps/factory`; staging Smart Site under the Factory base URL and every publish lands on staging before the identical job runs on production; nothing reaches a serving store except through publish; laptop ingest is FROZEN (`_decisions/2026-08-26_ingest_freeze_and_cloud_loader.md`). **OPTION A ruled** (`_decisions/2026-08-26_factory_model_law_and_option_a.md`): P-82-lite plus BP-WRITE-01 land on the existing writer as a bug fix; Bexar 48029 cad finishes on the current shape (660,000 of 703,257 done); NO new county is written on the old shape; Harris, Dallas and the Texas remainder wait for the conformant stage E writer (F-15, F-16, F-18).
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

AGENT-CONTRACT v92aa194c — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
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

PLAN-ROW: P-81, P-82, P-83, P-84 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-engine

# Option A on the existing write path (OPS-19 F-02): P-81 harness, P-82-lite plus BP-WRITE-01, P-83 scoped lease, P-84 run ledger; Bexar resume only, no new county on the old shape

---
id: 2026-08-26_cloud_loader_WDLL
title: WDLL — Option A on the existing write path (P-81 harness, P-82-lite plus BP-WRITE-01, P-83 scoped lease, P-84 run ledger; OPS-19 F-02)
date: 2026-08-26
last_updated: 2026-08-26
status: approved
applies_to: hauska-engine, legacy-design-tools, hauska-factory
plan_row: P-81, P-82, P-83, P-84
parent_plan_row: F-02 (90_operations/OPS-19_factory_plan_of_record.md)
operator_go: 2026-08-26 option A ruled ("fix the path, freeze new fills on it; finish Bexar's resume on the current shape; every new fill waits for the conformant writer"); card approved by the operator 2026-08-26 ("two cards approved")
parent_wdll: _inbox/2026-08-24_parcel_facts_write_path_WDLL.md
design: _inbox/2026-08-26_cloud_loader_design.md (read its review amendments section first) and _inbox/2026-08-26_factory_program_design.md
decision: _decisions/2026-08-26_factory_model_law_and_option_a.md
review: _inbox/2026-08-26_p81-review_close.json
supersedes: _inbox/2026-08-26_partitioned_lease_review_handoff.md
depends_on:
  - _inbox/2026-08-26_factory_phase_a_WDLL.md (F-00 repo, F-01 store, F-03 control core)
  - _blueprint/40_rule_register.md (BP-WRITE-01, BP-KEY-SENTINEL-01, BP-EDGE-01, BP-DID-01)
  - 51_ingestion_pipeline_reference.md §remediation step 1
  - _inbox/2026-08-21_recompute_lock_orphaned_on_cloud_run_timeout.md
  - 90_operations/OPS-13_store_topology.md
snapshot: P:/doc_repo main 9753b830a8e929ba1b59e625a2c60e50712ebcc0 · hauska-engine cfa18bc · legacy-design-tools origin/main 46e1a5a1 · Bexar 48029 cad 660,000 of 703,257 rewritten (verified 2026-08-26T13:42Z)
owner: property seat. Deploys planner-owned per standing decision.
---

# WDLL: option A on the existing write path

Date: 2026-08-26  Status: approved  Operator approval: 2026-08-26 (option A ruled; card approved)

This is 51 §remediation step 1 applied to the live writer: stop the orphan population growing (BP-WRITE-01), remove the round-trip loop that made the path run at 21 atoms/s, bind the lease to a process and to the data it writes, record every run, and finish the one county already mid-rewrite. It is not a fill program. After Bexar, this path writes no new county; the Texas remainder, Harris and Dallas included, waits for the conformant stage E writer (OPS-19 F-15, F-16, F-18). The brief's numbers are the planner's; reporting one wrong is a successful outcome.

## Done looks like

`writePropertyAtomsBatch` refuses a node binding that is not canonical grammar and a sentinel inside a key, writes all of a batch's `applies-to` links in one statement, runs under a process-bound scoped lease locked inside each chunk transaction, and records every run and refusal in the Factory run ledger. Bexar 48029 cad completes its rewrite from an edge-presence read (43,257 atoms remaining), verifies against the writer's own counts, and its cell moves by bounded materialise. The real-table rate from `us-east4` is measured and recorded. No `--apply` runs from the PC. No county other than Bexar is written on this path, and a work list containing one refuses with `OLD_SHAPE_FILL_FROZEN`.

## Acceptance items

### P-82-lite write path plus BP-WRITE-01 (hauska-engine)

1. **Write boundary refuses bare keys and sentinels.** A `parcelNodeId` or `entityId` that is not `{fips}:{integer}` (plus the declared discriminators) refuses `NON_CANONICAL_BINDING` before any `INSERT`; `:outside`, `:primary` and any sentinel token inside a key refuse `KEY_SENTINEL`; `body.atomDid` in a different namespace from the column refuses `DID_NAMESPACE`. Verified by violation for each. Bexar's existing keys pass. | check: three refuse fixtures plus a Bexar-row pass fixture | grade: [ ]

2. **Links are one statement per batch.** `writeAtomLinks` inserts all links of a batch in one multi-row `INSERT ... ON CONFLICT (from_atom_did, to_atom_did, link_type) DO NOTHING`; the per-link loop is gone; `writePropertyAtomsBatch` stays the shared path for every caller. | check: a 5,000-atom batch issues fewer than 10 statements to `atom_links`, counted by a query-logging double | grade: [ ]

3. **Differential identity holds** for atoms and links on the W1 fixture set. | check: `property-atom-batch-differential.test.ts` extended to links | grade: [ ]

4. **The edge cannot be omitted, independently derived.** Expected link count per batch from atom bodies (`parcelNodeId` non-null and not county-coverage); links written must equal it; a batch whose writer skipped the helper fails `STARVED_EDGE`. Both directions. | check: fixture pair | grade: [ ]

5. **Verify is two-derivation.** Atoms readable back equals the count the writer built; stored `content_hash` equals the client hash for every atom; links equal item 4. A corrupted row and a dropped row each fail the run, record `failed`, exit non-zero on the real exit, and enqueue no score. | check: three fault fixtures | grade: [ ]

6. **Per-leg timing** (`plan_ms`, `upsert_ms`, `links_ms`, `verify_ms`, `rtt_ms`) in every run record. | check: non-null on the Bexar run | grade: [ ]

7. **Benchmark on the real table from `us-east4`.** `writePropertyAtomsBatch` end to end (lease, upsert, links, verify) on a throwaway county with its snapshot stated. Pre-registered prediction: at least 300 atoms/s against the only real-table band on record (L4 950 to 1,319/s, pre-#356). Below 150 atoms/s the database is the bound and the conformant writer (F-18 stage-and-merge shape) opens with that number in hand. | check: benchmark JSON with snapshot | grade: [ ]

### P-83 scoped lease v2 (hauska-engine)

8. **Scope `(entity_type, county_fips)`; no GLOBAL; token-bound `HeldLease`; no env-var holder path.** | check: type signature; runtime negative | grade: [ ]

9. **Scope check on data, in the DB, inside the transaction.** Lease row locked `FOR UPDATE WHERE holder_token = $t AND expires > now()` per batch; `SCOPE_MISMATCH` on any atom outside the scope before any `INSERT`; an expired lease inside a slow batch refuses at the lock. | check: fixtures both directions plus an expiry-race fixture | grade: [ ]

10. **Disjoint scopes concurrent; same scope refuses; same label different token refuses.** | check: concurrent test on two small scopes with zero DID overlap | grade: [ ]

11. **Liveness is the writer's.** Heartbeat from the writing process on a dedicated connection plus per batch; TTL 15 min; steal after expiry records `stolen_from`; no advisory locks. | check: kill-and-retake; grep for `pg_advisory` returns nothing | grade: [ ]

12. **Heavy-scan scope** for PostGIS plan phases; second concurrent heavy plan waits or refuses, recorded. | check: concurrent plan test | grade: [ ]

13. **v1 retired by refuse.** `takeWriterLease` throws `ATOMS_WRITER_LEASE_V1_RETIRED`; CI asserts a v1 take cannot satisfy a v2 write. | check: test plus CLI exit | grade: [ ]

14. **AGENT_CONTRACT section 3 amended** with OPS-19 rule 7 wording; compiler re-hashes. | check: marker diff | grade: [ ]

15. **Bypass enumeration disposed**, including `writeAtoms` loops in `pipeline-runner/runner.ts` and corpus `edition-history/ingest.ts`, the `UPDATE atoms` repair scripts, and `load-snapshot-into-pg.mjs`; `status --audit` reports serving-store rows with `updated_at` outside any run window. | check: table in close; audit output | grade: [ ]

### P-84 run ledger and scoring (hauska-factory, legacy-design-tools)

16. **Every run and refusal is a row with a termination record** (max duration, success exit, failure exit, lease release); a run cannot start without its row; a job that exits without a termination record fails its own close. | check: refuse fixtures; ledger-connection fault; missing-termination fixture | grade: [ ]

17. **Progress has one instrument.** `factory status` from `runs`; no bare `count(*)` on `atoms` anywhere in the Factory. Bexar reads 660,000 rewritten, 43,257 pending, from an edge-presence read. | check: grep and runtime; status output | grade: [ ]

18. **Scoring is a job with its own env contract.** `countyRailScoreCli.ts --rail --county --apply` with `ATOMS_DATABASE_URL` and `DEPLOYMENT_DATABASE_URL` set explicitly (no gcloud fallback in the image); its advisory lock bounded per county and released on exit; rrc-wells dropped from this card or its registry reach fixed first. | check: job spec; exit 2 negative; rrc-wells decision recorded | grade: [ ]

19. **The cell moves by bounded materialise** within 30 min of a verified run; the full-grid recompute is unreachable from the Factory; a pending score older than 30 min is an alarm. | check: cell move on Bexar; alarm test with the scheduler disabled | grade: [ ]

20. **Cost recorded** per run against commitment 3. | check: run rows | grade: [ ]

### P-81 harness (hauska-factory, GCP hauska-prod-497015)

21. **Image and job pinned**; explicit `--task-timeout` and `--max-retries=0`; `engine_sha` and `image_digest` on every run; `--expect-engine-sha` mismatch refuses. | check: `gcloud run jobs describe` JSON read by field; refuse test | grade: [ ]

22. **RTT measured**; prediction under 5 ms. | check: run record | grade: [ ]

23. **Work list derived; holds are rows; old-shape fill frozen.** `factory plan --state=48 --path=existing` returns Bexar 48029 cad only; any other county on the existing path refuses `OLD_SHAPE_FILL_FROZEN` and records the refusal; holds imported once from the routing pin with `docRepoHead` and a CI divergence test until the pin is retired. | check: plan output; refuse rows | grade: [ ]

24. **Secrets in the job definition; missing env refuses.** | check: job YAML; refuse test | grade: [ ]

25. **Nothing runs on the PC.** `write-*-county.mjs --apply` without a `HeldLease` refuses; a `HeldLease` requires a `run_id`; `overnight.mjs` and `_w5a_detached_heartbeat.mjs` retired in the runbook. | check: local `--apply` refuse | grade: [ ]

### Proof

26. **Bexar resume.** `48029` cad completes from the edge-presence read: 43,257 atoms rewritten with edges, verify per item 5, cell moved; no atom rewritten twice without cause recorded; the run's termination record present. | check: run rows; store counts before and after with timestamps | grade: [ ]

27. **Out of this card.** Harris 48201, Dallas 48113 and the Texas remainder (held to the conformant writer, OPS-19 F-15, F-16, F-18); publish (F-06), staging (F-07), verify walk (F-08), acquisition manifests (F-09), depth (F-11), discovery (F-13), `countAtoms()` health scan (substrate seat), P-09, COVER, P-25. Named so unmentioned is not the failure state. | check: pathspec on close; `notStarted` list | grade: [ ]

## Do not

- Write any county other than Bexar 48029 on this path. `OLD_SHAPE_FILL_FROZEN` is the control, not a note.
- Use the v1 lease for anything. It is retired by item 13.
- Add `GLOBAL` scope, an env-var holder, a dual-accept window, or an advisory lock in the loader.
- Create `UNLOGGED` tables on Neon.
- Count atoms by hand as progress.
- Run the full-grid Manifest recompute.
- Run any `--apply` from `P:/` once item 25 lands.

## Amendments

- 2026-08-26: card rewritten after the adversarial review; first draft superseded in place.
- 2026-08-26 (later): re-scoped to option A: BP-WRITE-01 added as item 1; Harris, Dallas and the Texas remainder moved out to the conformant writer; `OLD_SHAPE_FILL_FROZEN` added as item 23; parent OPS-19 F-02.
- 2026-08-26 (night, before dispatch): three bindings added at compile time. (a) Worktree: the drain runs in `P:/seat-worktrees/property/hauska-engine-drain` on `seat/property-drain`, created from `origin/main` (`git -C P:/hauska-engine worktree add P:/seat-worktrees/property/hauska-engine-drain -b seat/property-drain origin/main`); the row is registered in `_catalog/seat_register.json`; never the primary property engine worktree, which holds another lane. (b) Pre-step, sanctioned serving-store write: before any Bexar resume, apply engine migration `010_drop_access_policy_defaults.sql` on `hauska_mcp` and run `packages/storage/scripts/backfill-icc-access-policy.mjs` against `hauska_mcp` (never `neondb`), as a recorded run with snapshot, counts before and after, and the `schema_migrations` row read back (OPS-16 A-033; the writer half shipped in engine PR #361 `cfa18bc`, the store still carries `DEFAULT public-free`). The substrate seat retires `access-policy.ts:87` after this lands; that is their card. (c) Item 20 of the Phase A card (`published_at` on the served ledger) is NOT this lane; it is an LDT route change under OPS-19 F-05.

## Finish card (graded at close)

1. (graded at close)

leave_behind: (declared at close)

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-26_p81-loader_cp1.json
  CP2: _inbox/2026-08-26_p81-loader_cp2.json
  CLOSE: _inbox/2026-08-26_p81-loader_close.json
