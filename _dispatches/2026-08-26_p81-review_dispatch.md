CANON-PREAMBLE v78ed9c62

- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HELD until Bastrop QA-done + operator go.
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

---

# Seat: property

# Property seat state

Preserved from _STATE.md at the 2026-08-20 topology split. Write this file, not the generated combined view. Duplicate branch-protection paragraphs from the concurrent double write were removed; the surviving record is `_state/systems/STATE.md`. The Smart Markets block moved to `_state/markets/STATE.md`.

Single source of truth for WHERE WE ARE RIGHT NOW. Not decisions (those are in memory / _decisions/), not history (those are in _sessions/). Live state a fresh agent picks up from; edit it constantly. **Last updated: 2026-08-23T18:35

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

# Adversarial review of the atoms county loader program (read-only; findings returned as text)

# Adversarial review lane: atoms county loader program (P-81..P-84)

You are an adversarial reviewer. Your job is to REFUTE, not to grade. The planner (integration seat on P:/doc_repo main @ 9753b83) produced a re-engineering program on 2026-08-26 and the operator wants it attacked before committing to it. Default posture: every claim is wrong until traced to a file, a line, or a live read-only measurement.

HARD CONSTRAINTS. You are read-only everywhere. Do NOT: write or edit any file in any repo; run git add, commit, push, checkout, or stash anywhere; take or release any database lease; run any script with --apply; kill any process; write to _state/ or _inbox/. This is a review lane: return your findings as TEXT in your final message. Do not write the CP1/CP2/close files named at the bottom of this dispatch; the planner files the close from your returned text. DO NOT SPAWN SUB-AGENTS. You MAY run the read-only SELECT instruments named below (they connect with max 1 and only SELECT).

## Read first (doc_repo, P:/doc_repo)

1. _inbox/2026-08-26_cloud_loader_design.md (the design)
2. _inbox/2026-08-26_cloud_loader_WDLL.md (the 30-item card)
3. _decisions/2026-08-26_ingest_freeze_and_cloud_loader.md
4. 90_operations/OPS-16_texas_market_plan_of_record.md amendment row A-028 (grep "^| A-028")
5. _dispatches/2026-08-26_p81-loader_dispatch.md (compiled; confirm CANON-PREAMBLE, AGENT-CONTRACT, DEV-PROCESS, FLEET-MEMORY markers and PLAN-ROW P-81..P-84)
6. _inbox/2026-08-26_partitioned_lease_review_handoff.md (the proposal the program rejects)
7. ENFORCEMENT.md; 90_runbooks/AGENT_CONTRACT.md sections 3 and 4; 90_runbooks/DEV_PROCESS.md section 2 (apply 2.4 "paired controls need a divergence test" hard)
8. _inbox/2026-08-21_recompute_lock_orphaned_on_cloud_run_timeout.md; 90_operations/OPS-13_store_topology.md; _inbox/2026-08-25_factory_operating_instructions.md; _inbox/2026-08-24_factory_routing_pin.json; _inbox/2026-08-24_county_manifest_dump.json (rails array)
9. C:/Users/cente/.claude/projects/p--doc-repo/memory/atoms-write-path-rtt-bound-in-writeatomlinks.md (a memory the planner saved; attack it too)
10. 01_doc_conventions.md (frontmatter and prose rules, for S4)

## Code to read (read-only)

Engine worktree P:/hauska-engine-worktrees/w5a-cad-owner-landuse at cfa18bc (do not switch branches):
- packages/storage/src/pg-storage.ts (writePropertyAtomsBatch near L276, writeAtomLinks near L764, countAtoms near L1063, createPgStorage near L1110)
- packages/storage/src/property-atom-batch-write.ts (upsert helper, dedupe last-wins, ON CONFLICT column list)
- packages/storage/src/atoms-writer-lease.ts; packages/storage/migrations/009_atoms_bulk_writer_lease.sql
- packages/storage/scripts/benchmark-property-atom-write.mjs
- packages/atoms/src/parcel-write-identity.ts (appliesToLinkFromPropertyAtom)
- packages/engine-core/scripts/write-cad-parcel-roll-county.mjs (page loop near L200-262, verify loop near L295-345); write-owner-fact-county.mjs; write-land-use-fact-county.mjs; write-flood-hazard-fact-county.mjs; write-special-district-fact-county.mjs; write-parcel-node-county.mjs (header); packages/engine-core/src/parcel-node/reconcile-county-parcel-nodes.ts (header)
- services/pipeline-runner/src/*.ts; cloudbuild.property-atom-bake.yaml; services/engine-api/Dockerfile
- git log -S "if (links.length > 0) await this.writeAtomLinks(links);" -- packages/storage/src/pg-storage.ts (planner claims #356 / 29ab77c on 2026-08-22 introduced links into the batch path)

legacy-design-tools: the local checkout P:/legacy-design-tools is on a STALE branch. Use `git -C P:/legacy-design-tools show origin/main:<path>` for: artifacts/api-server/src/countyRailScoreCli.ts; artifacts/api-server/src/lib/railScoring/registry.ts; lib/db/src/manifestGridRead.ts; lib/db/src/schema/countyFacetCoverage.ts.

## Live evidence the planner relied on (read-only; you may re-run)

Scratchpad C:/Users/cente/AppData/Local/Temp/claude/p--doc-repo/9fd983d3-f05c-491f-8bd5-9736ffa100d2/scratchpad/:
- lease_sampler.mjs: samples atoms_bulk_writer_lease heartbeat for about 5.5 minutes; planner read 5000-atom batch boundaries 234 to 235 s apart, i.e. 21.3 atoms/s. NOTE: the W5-A Bexar cad apply may have finished by the time you run. If the lease row is gone or no batch heartbeats appear, report "cannot reproduce live; W5-A finished", not a refutation.
- probe2.mjs: pg_stat_activity, links per county, Bexar atoms updated since 04:18:30Z.
- rtt.mjs: 10x SELECT 1 round trip; planner measured 44 ms p50.
- P:/tmp/w5a_48257_20260825/apply.log, overnight.log, *_apply.json (Kaufman wall times).
Run them with `node <path>` from P:/hauska-engine-worktrees/w5a-cad-owner-landuse (they import postgres by absolute file URL).

## Planner's load-bearing claims (attack each; give VERDICT refuted / not refuted / cannot test, with file:line or measurement)

C1. The live apply runs at about 21 atoms/s and 94 percent of each 5000-atom batch is 5000 sequential single-row INSERT INTO atom_links at about 44 ms RTT.
C2. Links entered writePropertyAtomsBatch in #356 (29ab77c, 2026-08-22); no throughput measurement on record postdates it; the W1 benchmark calls upsertPropertyAtomRowsMulti directly and never exercised links, lease, or verify.
C3. The current lease is holder-string scoped: two processes with the same ATOMS_WRITER_LEASE_HOLDER both pass assertAndHeartbeatWriterLease; the detached heartbeat decouples lease liveness from writer liveness.
C4. Same-county rails (cad, owner, landuse) are row-disjoint: distinct atom_did per entity_type, atom_links insert is ON CONFLICT DO NOTHING, no fact writer upserts parcel-node rows; the handoff's "same-county graph race" is overstated at the row level.
C5. "Store already holds 703257 Bexar cad atoms" in the handoff counted pre-existing 2026-08-12 rows; progress must be updated_at >= run start.
C6. countAtoms() runs SELECT COUNT(*) on atoms (160 GB) and serves /healthz; observed multi-minute from a pooled client, up to three concurrent.
C7. The proposed stage plus merge SQL (design section 4) preserves the current ON CONFLICT DO UPDATE semantics and the dedupe-last-wins behaviour of preparePropertyAtomRows; server-side applies-to derivation from stage.parcel_node_did is equivalent to appliesToLinkFromPropertyAtom.
C8. Scoped lease v2 (design section 5) preserves A-012's fail-closed intent and does not reintroduce the orphaned-advisory-lock failure class of 2026-08-21.
C9. Cloud Run Jobs in us-east4 is a feasible host: task timeout, memory, parallelism, secrets, digest pinning, and Neon direct-host access from GCP work as the design assumes. Check the Cloud Run Jobs limits you know (task timeout maximum, memory maximum) against a 703k-row rail.
C10. The Manifest move design (score_requests in neondb drained by an LDT Cloud Run Job running countyRailScoreCli.ts --rail --county --apply) matches that CLI's real inputs and does not repeat the in-request recompute failure.
C11. The derived work list (design section 3) correctly states the Texas remainder: cad 241, owner 241, landuse 241, flood 92, mud 45, rrc-wells 254, rrc-pipelines 253, rail-corridor 253, easement 254 not-yet; footprint and roads held; parcel-node (geometry) excluded at 253/254.
C12. The WDLL's 30 items are each verifiable by violation and none can pass vacuously; the build order P-82, P-83, P-84a, P-81, proof, P-84b, Texas is dependency-correct.
C13. Design section 10 bypass enumeration is complete for engine cfa18bc (grep INSERT INTO atoms, UPDATE atoms, DELETE FROM atoms, atom_links outside tests).
C14. holds.json in hauska-engine mirroring the doc_repo routing pin is acceptable. Apply DEV_PROCESS 2.4: is this a paired control without a divergence test?

## Also answer

S1. Scope. Does the program cover what "Factory 1", "Factory 1.5", and "Factory 2" are currently trying to achieve? Find the definitions: grep -rn "Factory 1.5" and "Factory 2" across P:/doc_repo _inbox, _decisions, 90_operations, 90_runbooks, and 27a_jurisdiction_factory_engine_spec.md; _inbox/2026-08-25_factory_operating_instructions.md has a table "What each factory is allowed to write". State which factory objectives the loader covers, which it does not, and whether the design misnames or omits any.
S2. The strongest mechanism that would make the whole program wrong, and why you accept or reject it.
S3. What you would cut from the WDLL and what you would add before any code is written.
S4. Convention violations in the four doc_repo artifacts: em dashes or en dashes in body prose (section titles, commit subjects, verbatim brand strings, and direct quotes are exempt), missing frontmatter fields per 01_doc_conventions.md, a cited-but-untracked path, a number without a snapshot.

## Return format (text in your final message; no files)

1. Snapshot you read against (doc_repo commit, engine commit, LDT origin/main commit, UTC time).
2. Fatal findings (would change the design or the decision), each with evidence.
3. Non-fatal findings.
4. Claim table C1..C14: verdict and evidence.
5. S1..S4 answers.
6. For every refutation, the second mechanism you considered (the alternative reading) and why you rejected it.

Be specific. Quote lines with file and line number. An unquoted correction is a hypothesis and must say so.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-26_p81-review_cp1.json
  CP2: _inbox/2026-08-26_p81-review_cp2.json
  CLOSE: _inbox/2026-08-26_p81-review_close.json
