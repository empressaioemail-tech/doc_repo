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

PLAN-ROW: P-101 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools

# P-101 ladder re-cut: read-only change inventory

---
id: 2026-08-31_p101_ladder_scope_mission
title: MISSION — P-101 ladder re-cut: read-only change inventory
date: 2026-08-31
status: open
applies_to: legacy-design-tools, hauska-map
plan_row: P-101
mode: READ-ONLY scoping. No code, no commits, no PRs, no deploys, no working-tree writes.
owner: scoping subagent hands back to the doc_repo planner; planner writes the build card
---

# P-101 ladder re-cut — read-only change inventory

YOU DO NOT SPAWN SUB-AGENTS. You do this work yourself and hand the artifacts back to the doc_repo planner, who commits. You do not commit, push, merge, open PRs, or deploy. You are a sub-agent under AGENT_CONTRACT section 1 and nesting below you is forbidden.

VERIFICATION IN THIS LANE IS EXIT-BOUNDED. Every command must exit; each one terminates on its own. This lane's verification is entirely `git show origin/main:<path>`, `git grep <pattern> origin/main`, `git rev-parse`, and `git log`, all of which exit. Do not run a watch, tail, or server, and never a non-exiting command of any kind: no `tail -f`, no `--follow`, no `--watch`, no dev server, nothing that waits for input or runs until killed. If you need to bound output, pipe to `head`. A non-terminating command in this lane is a defect, not an inconvenience.

You produce an inventory. You write no code, make no commits, open no PRs, and touch no working tree.

## Hard constraints

Read ONLY via `git show origin/main:<path>` and `git grep <pattern> origin/main` in `P:\legacy-design-tools` and `P:\hauska-map`. Both repos have dirty local checkouts on unrelated branches. Never check out, stash, clean, or modify anything. Never read the working tree; it is not the source of truth and reading it is a documented failure in this operation.

Every claim carries `file:line` on a named commit. What you cannot establish from code goes under Unestablished rather than being guessed.

A negative claim, such as "nothing calls X", must be verified repo-wide, not with a scoped grep, and you state the exact command that produced the negative. Scoped negatives are a known recurring failure here and a negative without its command is not accepted.

## The ruling you are scoping

Read `_decisions/2026-08-31_smartsite_ladder_recut_studio_works_a_list.md` and `_smartsite_gtm/03_ladder_recut_proposal.md` in `P:\doc_repo` first. What must become true:

1. Screens and boards move from ungated to studio-or-team. The three tools are `create_screen`, `add_to_screen`, `list_screens`, currently gated only by "signed in". They must be gated the way owner data and the Studio export kinds already are.
2. The gate goes at the TIER and both surfaces inherit it. The Smart Site MCP must NOT get its own parallel gate. A helper `subscriptionTierGrantsStudio` exists in both `artifacts/api-server/src/lib/peEntitlement.ts` and `artifacts/smartsite-mcp/src/entitlement.ts`.
3. The records package becomes a visible pricing row. It is already Studio, hidden inside export kind `dossier` in `STUDIO_EXPORT_KINDS`.
4. The comparison table regroups to: Answer this parcel, Work a list of them (screens, owner data, records), Hand it off (site plan CAD, terrain), Work as a firm (seats). Studio's badge stops being "The packet".
5. Studio goes from one seat to two.
6. Prospect is redefined from "the set-level answer" to monitoring (alerts, saved searches), still post-launch and marked coming soon.

Prices do not change. Free, the $15 thirty-day unlock, Solo $49, Studio $129, Team $299 for three seats then $25, annual default.

## Deliverable

One markdown report handed back as your final answer. No files written anywhere.

**A. Snapshot.** Exact commit SHA and date of `origin/main` in each repo when you read it.

**B. Screens gating inventory.** Every place that must change, with `file:line`. Every MCP tool handler for the three screen tools and where a gate call goes relative to the existing `canRunStudioReport` / `refuseStudioReport` pattern near `artifacts/smartsite-mcp/src/tools.ts:815-855`. Every api-server route serving screens; tests named `propertyExplorerScreens*` exist, so find the routes they cover. Any hauska-map client code that renders or calls screens and would need an upgrade-prompt path rather than a broken call. Critically: is there any OTHER entry point to screen creation that is not one of the above, and name how you searched for it.

**C. The shared-versus-duplicated gate question.** Are the two `subscriptionTierGrantsStudio` definitions one shared piece of code or two copies? If two copies, what stops them drifting? This determines whether "gate at the tier, both surfaces inherit" is structurally true today or is a claim the code does not currently support. Treat this as a finding in its own right.

**D. `pricing.ts` change inventory.** `hauska-map apps/property-explorer/src/lib/pricing.ts` is declared config-not-code. List every key that changes for items 3 through 6. Name which tests in `pricing.test.ts` and `pricing-modal.test.tsx` break, by test name.

**E. Studio seats one to two.** What actually reads a per-tier seat count? `PE_TEAM_INCLUDED_SEATS` is 3 for Team at `artifacts/api-server/src/lib/peTeamSeatsFromStripe.ts:10`. Is there an equivalent for Studio, or is Studio's "1" purely a display string with no server concept? This decides whether item 5 is a copy change or a real entitlement change. Highest-uncertainty item; be explicit about what you could not establish.

**F. Prospect copy.** Where do "Prospect" and "coming soon" appear in shipped surfaces? If nowhere, say so; that is a valid and useful finding.

**G. Free-user impact.** Anything that would break, 500, or render a dead control for an existing free user the moment screens are gated. Specifically, does any client path assume screens are always available?

**H. Test surface.** Which existing tests assert the CURRENT ungated screen behaviour and would need inverting? Name them. A test asserting screens are free is the pins-a-defect class: it must be rewritten to fail in both directions, never deleted.

**I. Unestablished.** Everything you could not determine from code, stated plainly.

**J. Risks.** Anything that makes this bigger than it looks.

Be skeptical of your own negatives. If a search returns nothing, say which command produced the nothing.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-01_p101-scope_cp1.json
  CP2: _inbox/2026-09-01_p101-scope_cp2.json
  CLOSE: _inbox/2026-09-01_p101-scope_close.json
