!!! SUPERSEDED 2026-08-31 — DO NOT HAND-CARRY THIS ONE.
!!! Replaced by _dispatches/2026-08-31_p91-cortex-verify2_dispatch.md
!!! Reason: this brief asserts `cortex-api-00672-ceq` is serving 100 percent. It is not.
!!! The planner deployed over it twice the same day for P-87; `cortex-api-00678-jup` serves now.
!!! A lane running this brief probes a revision no user reaches and reports against the wrong id.
!!! The mission substance is unchanged and the replacement narrows the diff target.

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

PLAN-ROW: P-91 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools

# Is the v3 Smart Site panel still correct against cortex-api-00672-ceq

# Mission: is the v3 Smart Site panel still correct against `cortex-api-00672-ceq`?

## The situation, and why this is not a formality

The P-91 v3 MCP wave (cuts p560 through p563) was built, graded and deployed against cortex serving `cortex-api-00668-cos` and `00670-bay`, which share image digest `41f998d5`. Those cuts are now serving as `smartsite-mcp-00078-fat` (digest `sha256:ecc72a40`, tag p563), and the operator's seven-test live walk passed on 2026-08-31.

Cortex then moved underneath that wave. `cortex-api-00672-ceq` was created 2026-08-31T02:52:52Z on a NEW digest and is serving 100 percent. It is LDT PR #560, the F-11 road-class setback refuse, merged `8f11e81b` by another seat AFTER the P-91 wave closed. Nobody on the P-91 thread verified anything against it.

This is not a generic "re-run the tests" ask. F-11 touched three files that the Smart Site MCP demonstrably consumes:

    artifacts/api-server/src/lib/setbackProvenanceDisposition.ts
    artifacts/api-server/src/lib/boundaryEdgeFactRead.ts
    artifacts/api-server/src/__tests__/brokerageNodeFacets.test.ts

The node facets route is the route the MCP reads for the per-parcel anchor and for panel content. `boundaryEdgeFactRead` feeds `draw.edges[]`, which the panel paints as named edges with roles. And `setbackProvenanceDisposition` changes setbacks from a served VALUE to a REFUSED state carrying a new `basis` string matching `retired road-class derivation`.

## The specific defect to hunt, stated first because it is the whole point

p563 shipped a 19-entry vocabulary table that maps machine tokens to exact display strings, published as an MCP resource and attached to every tool result. It exists because a live session printed the raw token `atom_path_pending` into user-facing prose, which was a missing field rather than a model failure.

**If F-11 introduced a refusal code, decline reason, or provenance/basis string that the p563 vocabulary table does not map, that value leaks raw to the user, and it is the exact defect class the whole V programme was built to close.** The table currently maps these refusal-side tokens and no others: `upgrade_required`, `parcel_not_found`, `baked_snapshot_not_found`, `parcel_batch_cap`, `open_did_not_reach_me`, `depth_not_implemented`, `declined-in-bake`, `not-in-bake`, `atom_path_pending`, `citationsDegraded`, `gis-approximate`, `seed`, `side_corner`, plus the six disposition words.

A new road-class refusal shape is precisely the kind of thing that is absent from that list. Find out.

## What to determine

1. **What actually changed on the wire.** Diff `41f998d5` against the digest `00672-ceq` runs, scoped to what the node facets route emits. Read the write path, do not infer from output. Name every field whose shape, presence, or value vocabulary changed.

2. **Which of those fields the MCP reads.** In `artifacts/smartsite-mcp/`, the consumers are the cortex client, the tool-honesty normalization seam, and the served panel. A changed field the MCP never reads is a non-finding and should be reported as such rather than padded into the result.

3. **Every token the panel or the model could now receive that the p563 vocabulary does not map.** This is the primary deliverable. For each: the token, where it originates, what a user would see today, and whether it reaches user-facing text or stays internal.

4. **Setbacks and the buildable envelope specifically.** Ledger function 6 is "Can I build X", whose today-state was recorded as an honest refuse. If F-11 flipped some parcels from a served setback value to a refusal, the panel's function-6 behaviour changed without anyone deciding it should. Say whether it is still honest, and whether the refusal reads as a decline or as an absence.

5. **`draw.edges[]` and edge roles.** `boundaryEdgeFactRead` changed. The panel paints named edges and the vocabulary maps `side_corner`. Confirm the role vocabulary did not gain a value, and that the reciprocal-edge behaviour did not change.

## Method

Probe live against `cortex-api-00672-ceq` and read code. When a probe and the code disagree, that disagreement IS the finding; report both readings rather than picking one.

The anonymous route is `GET /api/brokerage/v1/place/node/:parcelNodeId/facets`. It is the only anonymous route in the place surface; every other route there is gated. Fixture parcels with known shapes: `48021:34137`, `48021:34169` and `48021:34161` are a contiguous block; `48021:82112` is the sparsest record, no ring and no year built; `48021:31254` and `48021:31272` are the Higgins block.

Compare against the two shipped instruments rather than against memory: the p563 vocabulary table in `artifacts/smartsite-mcp/src/vocabulary.ts`, and the 452-test suite in that package.

## Boundaries

`artifacts/api-server/` is READ-ONLY for this lane. The property seat owns it and holds live worktrees there. If the correct fix is in api-server, name it and hand it back; do not edit it.

Any MCP-side change (for example a vocabulary entry for a newly discovered token) is produced as a diff and handed back. The planner commits, merges and deploys. Do not commit and do not push.

## Fail closed

If you cannot establish whether a token reaches user-facing text, report it as UNDETERMINED and say what instrument would settle it. Do not report a token as safe because you did not see it leak; absence of an observed leak is not evidence of mapping.

Distinguish absent, zero and unmeasured throughout, and state your snapshot (repo, branch, commit, and the cortex revision each probe hit) in the output.

## Deliverable

A findings document naming, at minimum: every changed wire field, every unmapped token with its user-visible consequence, a verdict on function 6, a verdict on edge roles, and an explicit statement of what you did NOT measure.

Lead with the single decision-relevant sentence: whether the v3 panel is still correct against `00672-ceq`, or what specifically is now wrong.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-31_p91-cortex-verify_cp1.json
  CP2: _inbox/2026-08-31_p91-cortex-verify_cp2.json
  CLOSE: _inbox/2026-08-31_p91-cortex-verify_close.json
