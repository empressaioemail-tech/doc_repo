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

PLAN-ROW: G-112 (90_operations/OPS-17_govtech_stack_plan_of_record.md)
repo: plan-review

# Wire plan-review's ledger reconciliation to the live substrate reader

## Mission: wire plan-review's ledger reconciliation to the live substrate reader

Plan row G-112 (OPS-17, added 2026-09-02 A-096). Both prerequisites this row
was blocked on are now live: G-111 (substrate) shipped the `request_id`
echo-back and the reader endpoint; a `platform_internal`/`codex`/`team` key
for plan-review to call it is minted and stored. Nothing consumes either
yet — that's this row.

### Context verified 2026-09-02, trust this over any older comment in the code

- `src/ledger-reconciliation.mjs`'s `fetchLedgerRows()` returns `null` on
  purpose — read its own docstring before touching anything, it names
  exactly this row as the trigger to change it. `reconcileActivity()` is
  already correct and tested; do not modify its logic, only what feeds it.
- `src/mcp.mjs`'s `mcpCall()` currently discards the HTTP response headers
  entirely — it does `const raw = await res.text()` then returns
  `textPayload(parseSseOrJson(raw))`, never touching `res.headers`. The new
  `x-hauska-request-id` header (confirmed live on every `/mcp` tool-call
  response, OPS-17 A-094) needs to be captured here. `mcpCall` is shared by
  every MCP-calling route in this service (`getPropertyAtomChain`,
  `getAtom`, and whatever else calls it) — changing its return shape is a
  cross-cutting change. Prefer adding the header value as an additional
  property on the object `textPayload` already returns rather than changing
  its shape to a tuple/array, so existing call sites that read specific
  fields off the result (e.g. `chain.data`) keep working unchanged. Verify
  this claim yourself before relying on it — read every call site.
- `src/store.mjs`'s `recordActivity(row)` already accepts `row.requestId`
  and stores it in `plan_review_activity.request_id` (column exists,
  `sql/003`, already applied). Every current call site passes `requestId:
  null` (or omits it) with a comment saying it's null "until
  hauska-mcp-server gives this service a way to learn the request_id" —
  that comment is now stale; find every such call site and thread the
  captured header value through instead of leaving it null. Do not conflate
  this with `dedupKey` (`sql/004`) — a different, already-correct concept
  (plan-review's own write-time idempotency key, unrelated to the ledger's
  `request_id`).
- The reader: `GET /obligations/source-ledger` on `hauska-mcp-server`,
  requires `X-Hauska-Key` with a `platform_internal` key. That key is
  stored as GCP secret `plan-review-platform-key` (project
  `plan-review-505715`), already IAM-granted to the plan-review Cloud Run
  runtime service account — bind it to the service on your deploy
  (`--update-secrets=HAUSKA_PLATFORM_KEY=plan-review-platform-key:latest`
  or whatever env var name you choose; nothing currently reads it, name is
  your call, just be consistent and document it). Query by `request_id`
  and/or `source_actor_did` per the endpoint's own params (read
  `source-obligation-reader.ts` in `hauska-mcp-server` — read-only,
  substrate's repo, do not write there).
- `source_obligation_ledger` still has no `book_id`/`section_id` columns
  (S4-7, substrate, not landed). `reconcileActivity()` only compares
  `sourceActorDid` once a `request_id` match is found — that's already
  correct and sufficient for this row; do not attempt citation-level
  comparison, it has nothing to compare against yet.

### Acceptance

1. Live probe: a real call through a route that produces an ICC citation
   (the code-lookup route, or wherever the service actually calls the ICC
   corpus through the MCP gate) results in a `plan_review_activity` row
   whose `request_id` matches the `x-hauska-request-id` the MCP call
   actually returned — confirmed by direct query, not by reading the code
   and assuming it works.
2. Live probe: with real ledger rows behind it, `reconcileActivity()`
   (called through whatever route/tool exposes it, or directly in a scratch
   script against production data) returns at least one genuine `matched`
   or `divergent` result — not `ledger-unavailable`. If every row in the
   window happens to be `no-correlation-key`, that's a legitimate finding —
   state which and why, don't force a match.
3. Existing behavior unchanged: `getPropertyAtomChain`/`getAtom` and any
   other `mcpCall` consumer still work exactly as before — this is an
   additive change to what `mcpCall` returns, not a rewrite. Regression-test
   the existing MCP-calling routes, live, post-deploy.

### Out of scope

Do not touch `hauska-mcp-server` (substrate's repo) beyond reading it for
context. Do not attempt S4-7 (citation-level ledger columns) or the real
ICC rate. Do not touch Smart Files or Dashboards. Live Bastrop is absolute
no-touch. Deploy is yours to do (deploys are planner-owned) — use the same
tag + smoke-test + shift discipline this whole wave has used, not a blind
straight-to-100% deploy.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-02_g112-reconciliation-wiring_cp1.json
  CP2: _inbox/2026-09-02_g112-reconciliation-wiring_cp2.json
  CLOSE: _inbox/2026-09-02_g112-reconciliation-wiring_close.json
