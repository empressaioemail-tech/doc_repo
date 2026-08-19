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

PLAN-ROW: G-91 (90_operations/OPS-17_govtech_stack_plan_of_record.md)
repo: smartcity-dashboards

# G-91 the fixture-pack seam

## MISSION — G-91, the fixture-pack seam

Housing: `empressaioemail-tech/smartcity-dashboards`. Your clone, and nobody else's: **`P:/tmp/t1pack-dash`**.
Clone fresh. A sibling lane is working in `P:/tmp/t1shell-dash` on the same repo right now.

Branch from `main` at `e11155246196a82224e4d291d53ba63bd7735849`. Branch `g91/fixture-pack-seam`.
**You open the PR. You do NOT merge and you do NOT deploy.**

**You may edit `src/` ONLY. You may NOT touch `web/index.html`, `web/app.js`, `web/shell.css` or
`web/sc-kit.css`** — the sibling lane owns `web/` and you will collide. If something can only be fixed in
`web/`, REPORT it and stop; do not reach across.

### Read first, and do not re-derive any of it

`P:/doc_repo/_inbox/2026-08-19_template_city_lens_build_sheet.md` is your contract. Read it whole.
Then `P:/doc_repo/_inbox/2026-08-17_g18_shell_homes.md` for the 67-row inventory this rests on.

### What this is

Template city gets built out so a prospect sees a working city, with a mock data pack that swaps per
city. **The mechanism already exists and this is an extension, not a new system.** `src/fixtures.mjs` is a
seeded deterministic generator (`fnv1a` seed, `mulberry32` PRNG) carrying two content guards,
`assertNoRealWorldContent` and `assertDeclaredVocabulary`. `src/city-pack.mjs` already declares `cityKey`,
`accessPolicy`, `environment`, `seal`, `generatesFixtures`, `grantedAdapters`. It generates exactly ONE
domain today: the permits pipeline.

**You are building the SEAM plus three exemplar domains, not all nineteen lenses.** Wave 2 fans one lane
per lens and each adds its domain on the seam you leave. Your job is to make that fan possible and to
prove the seam works on domains that differ in shape. Over-building here serialises what should fan.

### The ruling this rests on, and it reverses a standing constraint

**RULING 1, operator-approved 2026-08-19: "not built" moves down one level.** It used to describe the
SURFACE. From here the surface exists, and honest absence is a statement about SOURCES: the lens renders
its designed shape, and what is honest is which adapter kinds this pack has GRANTED, per region, with its
basis. The product currently cannot distinguish "we did not build Parks" from "your city has no Parks
data", and those are different sentences to a customer.

If a prior dispatch, comment or test tells you the honest-empty states must stay empty forever, that
instruction is SUPERSEDED by this row and by A-076. It was a misreading of a disposition column: the
G-18 register's `Not built` meant *this surface does not exist yet*, and three handoffs turned it into
*this surface is meant to be empty*.

**What does NOT change, and a gate that stops enforcing any of these is a defect:** no invented freshness
anywhere, and no `last sync` / `last read` / `last updated` string; every empty region keeps a `.basis`
line; no real city asserted as content and no city name in markup beyond the fallback vocabulary; the
12px type floor; `web/sc-kit.css` byte-identical across three repos; live Bastrop no-touch, and
`src/city-pack.mjs` MUST keep throwing on it.

### The work

**1. The domain-generator seam.** Generalise `fixtures.mjs` so a domain is registered rather than
hardcoded: a domain declares its id, the adapter kind that gates it, and a generator taking the pack and
a derived seed. `composePipeline` becomes one registered domain rather than the shape of the file.
Everything is keyed off the SAME pack seed so a city's data is stable across reloads and reproducible;
two runs on one pack must be byte-identical, and you should assert that rather than assume it.

**2. Both content guards apply to EVERY domain, structurally.** `assertNoRealWorldContent` and
`assertDeclaredVocabulary` currently run on pipeline records. They must run on every registered domain's
output, enforced by the seam rather than by each generator remembering to call them. Prove it: register a
throwaway domain that emits forbidden content and watch the seam reject it.

**3. Three exemplar domains, chosen because they differ in shape.** Do not add more.
  - **MyGov work orders** — compound, and it is the operator's priority because Development services must
    match what the production Bastrop dashboard shows. Live carries `work-orders` plus `daily-queue`,
    `geo-clusters`, `sla` and `stats`, so this domain must produce a queue WITH an SLA dimension and a
    daily slice, not a flat list. Gated by `mygov`.
  - **Samsara vehicles** — a simple roster with a driver dimension. Gated by `samsara`.
  - **A gated-but-ungranted case** — pick any domain whose adapter is not on `template-city`'s
    `grantedAdapters` and show it renders as honest absence WITH its basis rather than as absence of the
    region. This is the case that proves ruling 1 is implemented rather than described.

**4. Adapter catalog, 7 to 11.** `src/adapters.mjs` declares `mygov`, `samsara`, `opengov`, `esri`,
`municode`, `firstdue`, `verkada`. Live Bastrop integrates eleven vendor families. Add **`spireon`**
(police vehicles), **`goto`** (phones), **`powerbi`** (CIP and reporting). The nav footer's
`0 of 7 sources granted` is a COUNTED figure and should correct itself; verify that it does rather than
assuming, and if any test pins 7, that pin is the gate working and you update it to what the rule returns.

**5. The pack declares what it generates.** `template-city` generates; `empty-city` generates NOTHING and
stays the regression target, because with zero records there are no exceptions, every pill renders quiet,
and the tension mechanism switches off — that is the one input under which this design is guaranteed to
look flat. `fixture-city` stays tenant-private. Assert `empty-city` produces an empty result for every
registered domain, derived from the registry rather than from a list you maintain.

**6. Re-scope the gates ruling 1 forces, and this is the delicate half.** Several tests currently enforce
honest-empty as a PERMANENT state and will block every populated lens in wave 2. They must become
**per-pack** assertions rather than being deleted or weakened. Known ones, and you should find the rest by
running the suite against a pack that generates:
  - the assertion that the string `$0` never appears. Under a generating pack, real fixture figures
    render; under `empty-city`, `$0` must STILL never appear, because four zeros in a header would be
    four false claims. So the rule is per-pack, not absolute.
  - the honest-empty walk and the sixteen `.state` blocks. **Both read `web/index.html`, which you may
    not edit.** Re-scope the TEST if the test lives in `src/`; if honest re-scoping requires changing
    markup, REPORT and stop — that is wave 2's, not yours.

**Do not delete a gate to make data pass.** A gate that goes red because data now exists is telling you
its predicate needs a pack dimension, not that it should go. Every re-scoped gate keeps a firing arm, and
you watch it fire on both arms: populated pack renders, `empty-city` stays honest.

### Traps

**The seam must not let a generator skip a guard.** If a domain can emit records without
`assertNoRealWorldContent` running, the guard is advisory and the first wave-2 lane that forgets will ship
a real city name into a demo pack. Enforce at the seam.

**Determinism is a claim you must measure.** `Math.random()` and `Date.now()` anywhere in a generator
make the pack irreproducible and every downstream test flaky. Derive everything from the pack seed, and
assert two runs are byte-identical.

**An ungranted domain is not an empty domain.** "This city has not granted MyGov" and "this city granted
MyGov and it returned nothing" are different states with different basis lines, and collapsing them
re-creates the defect ruling 1 exists to fix. Model both.

**`generatesFixtures` is not the same as `grantedAdapters`.** A pack that generates fixtures still only
populates domains whose adapter kind it has granted. Keep the two orthogonal; the wave-2 lanes will lean
on that.

### Verification

EXIT-BOUNDED only: builds, test runs, one-shot commands. Never a watch, a tail, or a non-exiting server.
Merge gates read the CI check-run **conclusion string**, never a `gh` exit code. Quote every ratio with
its counting rule at the point of use. An empty result is not an absence — say why, positively.

Reporting a planner figure as wrong is a successful outcome of this dispatch.

### Deliverables

- Branch pushed, PR opened, number and head SHA reported. **Do not merge.**
- CI run to completion; the check-run conclusion string.
- The registry: every domain id, its gating adapter kind, and which pack generates it.
- Determinism proof: two runs byte-identical, with the command.
- The seam-enforced guard watched REJECTING a throwaway forbidden-content domain, raw output.
- The ungranted-domain case rendering honest absence with its basis, raw output.
- Every gate you re-scoped, with both arms watched: populated renders, `empty-city` stays honest.
- The adapter count before and after, and whatever the `sources granted` denominator now returns.
- CP1 before you write generators: the registry design, how the seam enforces both guards, and your
  re-scope plan for each gate you found. CP2 at the pilot: one domain end to end with raw output.
- Close artifact carrying `missionPremise`, `completionPredicate` and `scopeBasis`. Paste raw output.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-19_t1pack_cp1.json
  CP2: _inbox/2026-08-19_t1pack_cp2.json
  CLOSE: _inbox/2026-08-19_t1pack_close.json
