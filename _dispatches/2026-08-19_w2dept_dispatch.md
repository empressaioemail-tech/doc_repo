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

# G-92 wave 2 department domains

## MISSION — G-92 wave 2: public safety, fleet-adjacent and civic domains

Housing: `empressaioemail-tech/smartcity-dashboards`. Your clone: **`P:/tmp/w2dept-dash`**. Clone fresh.
Two sibling lanes are live: `P:/tmp/w2ds-dash` (Development services domains, same repo) and
`P:/tmp/w2fix-dash` (owns `web/`).

Branch from `main` at `c7d7980b98752fe6625e07da1e4e9b9921f67950`. Branch `g92/department-domains`.
**You open the PR. You do NOT merge. You do NOT deploy.**

**`src/` ONLY. You may NOT touch anything under `web/`.** Rendering is a separate serial pass because all
fifteen lenses share one `web/index.html` and one unpartitioned `web/shell.css`.

### Read first, do not re-derive

`P:/doc_repo/_inbox/2026-08-19_template_city_lens_build_sheet.md`, the department-lens entries. Then the
seam: `src/domains.mjs`, `src/fixture-seam.mjs`, and both existing generators —
`src/domains/work-orders.mjs` (compound, the shape to copy) and `src/domains/fleet-vehicles.mjs` (simple
roster). `src/domains/patrol-vehicles.mjs` is the deliberately-ungranted exemplar; read it to see how an
ungranted domain is expressed.

### The domains

Live Bastrop evidence is in the build sheet; the API families are proof of what data exists, **not an
instruction to connect a feed**. No adapter is granted by this work.

- **Police cameras** — live Verkada (`cameras`, `alerts`, `analytics/occupancy`). Gated `verkada`.
  A camera inventory with a status dimension. **No LPR plates, no persons-of-interest**: those are
  surveillance records about identifiable people and have no place in a demo fixture pack, which the
  content guard would reject anyway. Say in your close that you excluded them and why.
- **Fire apparatus and stations** — live FirstDue (`apparatus`, `stations`, `occupancies`, `summary`).
  Gated `firstdue`. A roster with a station dimension.
- **Public works projects** — live PowerBI (`cip-data`, `reports`). Gated `powerbi`. A CIP/projects
  register with a phase dimension.
- **Call analytics** — live GoTo (`call-summary`, `call-history`). Gated `goto`. Aggregate call volumes
  only. **No call recordings, no individual call detail, no extension-to-person mapping.**

Then two lenses that have **no vendor at all** today, which is the interesting case:

- **Parks facilities** and **Court docket**. The build sheet records these as "gates: none yet — sources
  arrive per city." **The seam requires a domain to declare a gating adapter kind.** Determine from
  `src/fixture-seam.mjs` and `src/domains.mjs` whether a no-vendor domain is expressible, and if it is
  NOT, say so plainly and report rather than inventing a fake adapter kind to satisfy the shape. A
  vendorless department is going to be common as other cities onboard, so this is a real design question
  and "the seam cannot express it yet" is a valid and useful answer. Do not add a kind to
  `src/adapters.mjs` that no live vendor corresponds to.

### The seam's rules, structural not advisory

Both content guards run at the seam over every domain's return — you call neither. Real city names, street
addresses, money, invented freshness, bare confidence and undeclared vocabulary are all rejected; the
planner verified this by neutering a guard and watching four tests go red. Declare `vocabulary` and
`formats` on each registry entry.

Determinism is measured: no `Math.random`, no `Date.now`, no `new Date()`. Everything from the pack seed
via `seedFor`; two separate node processes must produce byte-identical output and you assert it.

`empty-city` generates nothing and stays the regression target. Four states, not two —
`ungranted` and `granted-empty` are different sentences to a customer.

### The registry is the one file your sibling also edits

`src/domains.mjs` holds `DOMAIN_REGISTRY`; the Development services lane appends to it too. Keep your
additions contiguous and append-only, and expect to be rebased and re-greened before merge. The
Development services lane merges FIRST because it carries the operator's stated priority.

### Verification

EXIT-BOUNDED only. Merge gates read the CI check-run **conclusion string**. Quote every ratio with its
counting rule. Reporting a planner figure as wrong is a successful outcome.

### Deliverables

- Branch pushed, PR opened, number and head SHA. **Do not merge.**
- CI conclusion string. `git diff --stat origin/main -- web/` must be EMPTY; state it.
- Per domain: id, gating kind, record count on `template-city`, counting rule.
- **The Parks/Court vendorless answer, whichever way it goes**, with the evidence from the seam.
- Determinism proof across two separate processes.
- Each new domain watched being REJECTED on a planted guard violation.
- What you deliberately excluded on privacy grounds and why.
- CP1 with record shapes and declared vocabularies. CP2 with one domain end to end.
- Close artifact with `missionPremise`, `completionPredicate`, `scopeBasis`. Paste raw output.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-19_w2dept_cp1.json
  CP2: _inbox/2026-08-19_w2dept_cp2.json
  CLOSE: _inbox/2026-08-19_w2dept_close.json
