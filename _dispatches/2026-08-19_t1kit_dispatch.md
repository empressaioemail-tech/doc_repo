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

PLAN-ROW: G-90 (90_operations/OPS-17_govtech_stack_plan_of_record.md)
repo: smartcity-kit

# G-90 kit follow-on, re-vendor at 143

## MISSION — G-90 kit follow-on: re-vendor at 143 and wrap the four new classes

Housing: `empressaioemail-tech/smartcity-kit`. Your clone: **`P:/tmp/t1kit-kit`** (write) plus a READ-ONLY
`smartcity-dashboards` clone at **`P:/tmp/t1kit-dash`**. Clone both fresh. Do not touch any other clone.

Branch from kit `main` at `d6bd9a1d7e29a0306fd5b331282a0483ef110e61`. Branch `g90/revendor-143-shell-chrome`.
**You open the PR. You do NOT merge. You do NOT run the DesignSync upload** — the re-sync is the planner's.

### Why this exists, and it corrects a conclusion

G-90 shipped shell function parity into `smartcity-dashboards` (merged `c7d7980b98752fe6625e07da1e4e9b9921f67950`).
It added four classes to `web/shell.css` — `topmenu`, `pop`, `pop-group`, `pop-item` — taking the product
vocabulary from **139 to 143**.

That lane concluded "no kit re-vendor owed" on the reasoning that `sc-kit.css` was untouched and no token
was added or overridden. That reasoning is correct about the PRODUCT-LINE question — `sc-kit.css` is
byte-identical across three repos and editing a token there forks the system — but it is the wrong test
for this one. **The kit vendors BOTH stylesheets.** `vendor/shell.css` is a copy of the product's
`web/shell.css`, `stylesheetClasses()` counts across both, and `test/vendor-parity.test.mjs` arm B
byte-compares against whatever `smartcity-dashboards` main is at the moment CI runs.

Measured by the planner right now: product `web/shell.css` is blob `1c0529d671916e33a887cffe7d5a5a60f9223c91`,
kit `vendor/shell.css` is `aa655b2021bcf1133a38b706f5884078ac7f51f2`. Stale. `sc-kit.css` matches on both
sides at `54339204691415d5ee817117699322ed0826c768` and stays untouched.

So the kit's green is perishable and would go red the moment anything re-runs it. This is the third time
today a cross-repo green expired under a product merge; it is a known shape, not a surprise.

### The work, and you have a worked precedent from earlier today

This is the same chain kit PR #7 ran this morning (109 to 139). Read `_inbox/2026-08-19_b8845_close.json`
in doc_repo for how that went, then do it again at this size.

1. **Re-vendor** from the dashboards clone at `c7d7980`: `npm run refresh:vendor <path>`. Read
   `scripts/refresh-vendor.mjs` first. Expect `vendor/shell.css` to move and `vendor/index.html` and
   `vendor/app.js` to move too, since G-90 edited the head script and `app.js`. `vendor/sc-kit.css` must
   NOT move; if it does, stop and report, because that is a product-line event.
2. **Recount.** Update the pin at `test/gate3-classes.test.mjs`. The planner measures **143** over the
   merged tree with the counting rule stated in `test/_lib.mjs`. That is a planner figure: run the rule
   and report what it RETURNS. If it is not 143, say so and reconcile rather than agreeing.
3. **Wrap the four.** `test/gate3-classes.test.mjs` carries a coverage assertion that every shipped class
   is emitted by some component; it will go red on exactly `topmenu`, `pop`, `pop-group`, `pop-item`. That
   redness is the work list. **Do not weaken the assertion, do not add an exclusion set, do not park a
   class as structural.** Read what those four DO in the product's `web/shell.css` and in `web/index.html`
   before designing an API — they are the top-bar menu and popover chrome G-90 shipped, so the component
   shape should follow the markup the product actually serves, not an invented one.
4. **Gallery and previews.** One `GALLERY` entry per new component with a real `node`, a `from`, and a
   `covers` list that EQUALS what it renders (gate 3 asserts that equality directly). One
   `.design-sync/previews/<Name>.tsx` per new component. There are 82 today; state the new count.
5. **README** publishes the coverage claim with its denominator. Restate it.
6. **Fix a stale count while you are in the file:** `.design-sync/NOTES.md` line 35 says the gallery covers
   "all 82 components" and line 64 still says "all 73". Two numbers that should agree and do not.

### Gates

`npm test` with `SC_DASHBOARDS_DIR` pointed at your read-only dashboards clone so **arm B actually runs** —
locally-unrun is the default and it is the trap this whole mission is about. `npm run typecheck` and
`typecheck:examples`. `npm run prove:gates` — it was 31 of 31 this morning and now runs in CI; report the
tally. `test/markup-parity.test.mjs` compares against `vendor/index.html`, which is about to change, so
measure whether any parity case moves and say which rather than assuming none does.

### Do NOT

Touch `vendor/sc-kit.css` or any token. Rebuild or modify `ds-bundle/`, `.ds-sync/` or `.render-check.json`.
Upload anything to the Design project. Merge your own PR. Write to the dashboards clone.

### Verification

EXIT-BOUNDED only. Merge gates read the CI check-run **conclusion string**, never a `gh` exit code. Quote
every ratio with its counting rule at the point of use. Reporting a planner figure as wrong is a success.

### Deliverables

- Branch pushed, PR opened, number and head SHA. **Do not merge.**
- CI conclusion string, and confirmation that arm B ran rather than declaring itself unrun.
- The recounted denominator with its counting rule, and a reconciliation if it is not 143.
- New component count, new preview count, coverage restated as N of N.
- Whether any markup-parity case moved, and which.
- CP1 after the re-vendor and recount, with the coverage gate watched going red on the four, raw output.
- CP2 with one family wrapped and gate 3 green for it.
- Close artifact carrying `missionPremise`, `completionPredicate`, `scopeBasis`. Paste raw output.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-19_t1kit_cp1.json
  CP2: _inbox/2026-08-19_t1kit_cp2.json
  CLOSE: _inbox/2026-08-19_t1kit_close.json
