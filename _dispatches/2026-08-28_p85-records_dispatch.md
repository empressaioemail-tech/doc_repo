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

PLAN-ROW: P-85 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools

# Records Request extraction fails closed

## Why this card exists

The operator opened a Records Request result and said the presentation is
useless. The visible symptom is that the `parties` field renders as a pipe
joined dump of a clerk index grid. Reading the write path shows the symptom is
the smallest of three defects, and that fixing only what is visible would leave
the dangerous half in place.

Snapshot for this diagnosis: `legacy-design-tools`, worktree
`P:/seat-worktrees/property/legacy-design-tools`, branch
`feat/p85-worker-v8-tag`, commit `63e14028`.

## The three findings, each traced to a line

**Finding 1. `parties` is a leftover bucket, not a parse.**
`artifacts/records-request-worker/src/recipes/indexHits.ts`, `normalizeIndexHit`.
The function claims three cells by pattern guess, then assigns to `parties`
every remaining cell joined with `" | "`. There is no parties parse that fails.
There is no parties parse at all. Whatever the grid held that the three guesses
did not claim (legal description, page count, fee, status text, checkbox label)
is concatenated into the field and shipped to the surface.

**Finding 2. The row shape is never resolved, so `documentType` is at equal
risk and nobody can see it.** `ResultRowExtract` in `recipes/types.ts` is
`{ cells: string[]; link: string | null }`. It carries no column names, and
`extractResultRows()` never reads the grid header. Nothing downstream can know
which column is which. `typeCell` is selected as the first cell longer than
three characters that is not the ref, not the date, not all digits and not the
word "view". A grantor name satisfies every one of those conditions. When a
portal orders its columns name before type, `documentType` silently becomes a
person's name. Finding 1 is visible and embarrassing. Finding 2 is invisible and
wrong.

**Finding 3. The classifier converts an unresolved type into a fabricated one.**
`artifacts/api-server/src/lib/recordsRequestInstrumentClassify.ts`,
`classifyRecordsRequestDocumentType`. Two branches return
`documentKind: "deed"` for a document type it could not resolve: the empty
branch near line 57, and the terminal fallthrough near line 137. So a grantor
name sitting in `documentType` matches no regex, falls through, and is written
as a deed. `artifacts/api-server/src/lib/recordsRequestClassifyWrite.ts` line 181
calls this with no guard on the input.

The three compose into the reason a partial fix is not worth shipping. Making
the scraper fail closed on an unresolvable type, on its own, sends
`documentType: null` into the empty branch, which returns `deed`. The honest
null is converted straight back into a fabricated classification. Cards 1 and 2
land together or neither lands.

No test pins the unknown to deed default. Every fixture in
`__tests__/recordsRequestClassify.test.ts` passes a label that matches a real
regex. The default is untested behaviour, which is why it survived, and the fix
does not read as a regression.

## Card 1. The classifier refuses instead of inventing

`classifyRecordsRequestDocumentType` must not return a `documentKind` for a
document type it did not resolve. Both the empty branch and the terminal
fallthrough refuse.

The machinery already exists and is simply not applied here.
`RecordsRequestClassifyRefuseError` is defined in the same file, three
`assert*` helpers throw it, and `classifyAndWriteRecordsRequestArtifact`
already catches it and records `status: "refused"` with a `refuseCode`. Add
`unclassifiable_document_type` and route both branches to it.

Absent, unresolved and deed are three different states. A refused artifact is
visible in the job record and can be worked. A fabricated deed is invisible and
enters every downstream count as though it were established.

Verify by violation: a fixture passing `null`, a fixture passing `""`, and a
fixture passing a plausible grantor name such as `"SMITH JOHN A"` each refuse
with that code. Confirm the caller records the refusal rather than throwing out
of the job.

## Card 2. Resolve the row shape from the grid header

Extend the browser seam so a result row carries the column names the portal
published, and bind every field to a named column. Any field whose column
cannot be named is `null`.

`ResultRowExtract` grows a header. `extractResultRows()` reads the grid header
row. `normalizeIndexHit` stops guessing: it maps a header label to each field
through a per vendor alias table, and returns `null` for any field it cannot
bind. Delete the leftover join for `parties` outright. Where the header cannot
be read at all, the run refuses rather than falling back to positional guessing,
because positional guessing is the defect.

Nothing about this weakens the existing dedupe: `dedupeIndexHits` keys on
`recordingRef` first, which stays a resolved field.

The surface already renders honestly on a null. The PE records view shows
"Parties not extracted yet" when `parties` is null, so Card 2 turns a wrong
answer into a true one at the surface with no PE change required for that half.

Verify by violation: a fixture whose header names the columns binds each field
to the right one, and a fixture whose header is absent or unrecognised returns
nulls or refuses, and never returns a joined string. Add a fixture with the
name column ahead of the type column and pin that `documentType` is not the
name. That is Finding 2 stated as a test.

## Card 3. Give the record something to render

This is the operator ask that Cards 1 and 2 do not answer. A resolved header
triple is still a text row. The product ask is to render, store and manage the
document.

Persist the instrument page image already captured during acquisition through
the artifact store, and expose a `documentUrl` on the records payload so the
surface can display the instrument. Property Explorer has a working `PdfViewer`
and today has nothing to point it at.

The Smart Site half of this card belongs to the registered worktree
`P:/seat-worktrees/property/hauska-map-records` on branch
`seat/property-records`, not to this checkout. Hand it across rather than
reaching into it.

Ordering: Cards 1 and 2 ship together and are the correctness fix. Card 3 is the
product fix and follows. Card 3 without Cards 1 and 2 renders a document next to
a fabricated classification of it.

## Out of scope

Portal vendor coverage beyond the vendors this lane already drives. Do not add a
county. Do not change the purchase threshold or the acquisition budget. Do not
touch the ADR-020 `instrumentType` enum: the extension is already requested of
the substrate seat in
`_inbox/2026-08-26_substrate_request_p85_adr020_instrument_type_extension.md`
and this card routes unresolvable types to a refusal, not to a new enum member.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-28_p85-records_cp1.json
  CP2: _inbox/2026-08-28_p85-records_cp2.json
  CLOSE: _inbox/2026-08-28_p85-records_close.json
