CANON-PREAMBLE v664d6256

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

AGENT-CONTRACT v7b714e95 — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
interruption recovery, slot law + lease, heavy-scan serialization, verification rules, close schema).
Read it before any work; where this dispatch and the contract disagree, STOP and report.

DEV-PROCESS vbb19bd34 — you are bound by 90_runbooks/DEV_PROCESS.md in full. It governs how work
is SHAPED and how a result is JUDGED: coverage figures travel with their denominator, classes are
measured never subtracted, an instrument's exclusion set is part of its contract, gating indicators are
proven able to fire, paired controls need a divergence test, guardrails that do not survive a clone are
not guardrails. Every rule in it is traced to an incident. Read it before any work.

PLAN-ROW: G-92 (90_operations/OPS-17_govtech_stack_plan_of_record.md)
repo: smartcity-dashboards

# G-92 wave 2 development services domains

## MISSION — G-92 wave 2: Development services domains

Housing: `empressaioemail-tech/smartcity-dashboards`. Your clone: **`P:/tmp/w2ds-dash`**. Clone fresh.
Two sibling lanes are live: `P:/tmp/w2dept-dash` (other domains, same repo) and `P:/tmp/w2fix-dash`
(owns `web/`).

Branch from `main` at `c7d7980b98752fe6625e07da1e4e9b9921f67950`. Branch `g92/dev-services-domains`.
**You open the PR. You do NOT merge. You do NOT deploy.**

**`src/` ONLY. You may NOT touch anything under `web/`.** The four source states already reach no pixel by
design; rendering them is a separate serial pass, because all fifteen lenses share one `web/index.html`
and one unpartitioned `web/shell.css`. Domains fan wide because `src/domains/*.mjs` are separate files;
markup does not. That asymmetry is the shape of this wave.

### Read first, do not re-derive

`P:/doc_repo/_inbox/2026-08-19_template_city_lens_build_sheet.md`, the Development services entry.
Then the seam you are building on: `src/domains.mjs`, `src/fixture-seam.mjs`, and BOTH existing
generators — `src/domains/work-orders.mjs` (compound, the shape to copy) and
`src/domains/fleet-vehicles.mjs` (simple roster). Also `P:/doc_repo/_inbox/2026-08-19_t1pack_close.json`
for why the seam is shaped as it is.

### Why this lane is first

The operator's requirement, in his words: Development services must match the data the PRODUCTION Bastrop
dashboard displays today, because it monitors the MyGov system the city already runs. Live carries MyGov
across **sixteen** endpoints. Only two are modelled: `permits` (as `permits-pipeline`) and `work-orders`.

Add the three that close the gap, all gated by `mygov`:

- **`inspections`** — live `mygov/inspections`. A scheduled/completed queue with a result dimension.
- **`code-violations`** — live `mygov/code-violations` and `code-violations/stats`. Cases with a status
  and an escalation dimension.
- **`business-licenses`** — live `mygov/business-licenses`. Licences with an expiry dimension.

Read what the live endpoints imply about shape from the build sheet before designing a record; do not
invent a shape the product would not receive.

### The seam's rules, which are structural and not advisory

Both content guards run at the seam over every registered domain's return — you call neither. A generator
that emits a real city name, a street address, money, invented freshness, a bare confidence or an
undeclared vocabulary string is REJECTED, and the planner verified that by neutering a guard and watching
four tests go red. Declare your `vocabulary` and `formats` on the registry entry; anything a record puts
in a string field must be covered by one of them.

**Determinism is measured, not assumed.** No `Math.random`, no `Date.now`, no `new Date()`. Everything
derives from the pack seed via `seedFor`. Two separate node processes must produce byte-identical output;
assert it.

**`empty-city` generates nothing** and stays the regression target, because with zero records there are no
exceptions, every pill renders quiet, and the tension mechanism switches off — the one input under which
this design is guaranteed to look flat.

**Four states, not two.** `ok`, `granted-empty`, `ungranted`, `no-fixture-source`, plus `not-registered`.
`ungranted` and `granted-empty` are different sentences to a customer and collapsing them re-creates the
defect ruling 1 exists to fix.

### The registry is the one file your sibling also edits

`src/domains.mjs` holds `DOMAIN_REGISTRY`. The sibling domain lane appends to it too. Keep your additions
contiguous and append-only so the planner's rebase is mechanical, and expect to be rebased and re-greened
before merge — the base has moved under a PR three times today.

### Verification

EXIT-BOUNDED only. Merge gates read the CI check-run **conclusion string**, never a `gh` exit code. Quote
every ratio with its counting rule at the point of use. An empty result is not an absence. Reporting a
planner figure as wrong is a successful outcome.

### Deliverables

- Branch pushed, PR opened, number and head SHA. **Do not merge.**
- CI conclusion string. `git diff --stat origin/main -- web/` must be EMPTY; state it.
- Per domain: id, gating kind, record count on `template-city`, and the counting rule.
- Determinism proof across two separate processes.
- Each new domain watched being REJECTED by the seam on at least one planted guard violation.
- `empty-city` asserted empty for every registered domain, derived from the registry not a list.
- CP1 with your three record shapes and the vocabulary each declares. CP2 with one domain end to end.
- Close artifact with `missionPremise`, `completionPredicate`, `scopeBasis`. Paste raw output.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-19_w2ds_cp1.json
  CP2: _inbox/2026-08-19_w2ds_cp2.json
  CLOSE: _inbox/2026-08-19_w2ds_close.json
