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

PLAN-ROW: G-93 (90_operations/OPS-17_govtech_stack_plan_of_record.md)
repo: smartcity-dashboards

# G-93 granted vs demonstrated, and the auth row split

## MISSION — G-93: two operator-ruled corrections

Housing: `empressaioemail-tech/smartcity-dashboards`. Your clone: **`P:/tmp/w2fix-dash`**. Clone fresh.
Two sibling lanes are live in `P:/tmp/w2ds-dash` and `P:/tmp/w2dept-dash`; both are `src/`-only and
neither touches `web/`. **You own `web/` and `src/shell-homes.mjs`.** Do not add or edit anything under
`src/domains/`, and do not edit `src/domains.mjs`, `src/fixture-seam.mjs` or `src/adapters.mjs`.

Branch from `main` at `c7d7980b98752fe6625e07da1e4e9b9921f67950`. Branch `g93/granted-vs-demonstrated`.
**You open the PR. You do NOT merge. You do NOT deploy.**

Both items below were surfaced by executors rather than by the planner, taken to the operator, and ruled
on 2026-08-19. Neither is a judgement call you re-open; both are shapes you implement.

### Read first

`P:/doc_repo/_inbox/2026-08-19_template_city_lens_build_sheet.md` for the posture. Then
`_inbox/2026-08-19_t1pack_close.json` for why `fixtureGrants` exists and what it is not, and
`_inbox/2026-08-19_t1shell_close.json` for the register rows in item 2.

### Item 1 — the footer must distinguish GRANTED from DEMONSTRATED

`template-city` reads `0 of 10 sources granted` in the nav footer while three regions render populated
fixture data. Every word of that is true: `fixtureGrants` is a demo-data axis that names adapter kinds,
carries no `sourceUrl`, and connects nothing, so the granted count is genuinely zero. But a prospect
reads a contradiction, and the fix is to distinguish the two states rather than collapse them.

**Operator ruling: distinguish.** A granted source and a demonstrated shape are different claims and the
footer must say which is which. `grantedAdapters` stays `[]` on every pack — `assertCityPackShape` throws
`a pack that generates fixtures grants no adapter` and that guard is load-bearing, so do not weaken it.

Constraints on how: the count must stay **derived** and never hardcoded — the `0 of 7` that was short by
three for weeks corrected itself the moment the catalog grew, and that property must survive. No invented
freshness. Every claim keeps its basis. If the honest phrasing needs a class the stylesheet does not
define, ship the CSS with it and **state the new class vocabulary count** — it is 143 today and a change
means a kit re-vendor, which is the planner's follow-on, not yours. Do not touch `web/sc-kit.css`.

### Item 2 — split the Connections register's auth row into its four jobs

The row `Auth / session / notifications / theme / sign out` bundles four distinct jobs. After G-90, two of
them exist (notifications, theme) and two do not (auth/session actions, sign out). The disposition
vocabulary is closed at six values, so **no single value is true of the row as written** — which is why
the G-90 lane deliberately did not edit it and routed it as a ruling instead.

**Operator ruling: split it.** Each job gets its own row with its own honest disposition. The second row
the G-90 lane flagged, `Feedback with screenshot and category`, has the same problem — feedback now
exists but the screenshot and category legs do not — so apply the same treatment and say what you did.

**Connections is GENERATED.** It comes from `connectionsRegisterHtml()` in `src/shell-homes.mjs` and is
baked into `web/index.html`. **Change the generator and RE-BAKE.** `web/index.html` is now an asserted
fixed point of that bake — a hand edit fails `G-88 the bake is fresh / leaves web/index.html unchanged
when the bake is run again` by name. The register is 67 of 67 rows plus addenda; if splitting changes the
row count, the counting rule and any test pinning it move with it, and you state the new count.

### Gates that will look at you

The **addressability gate** asserts every id `app.js` addresses is in the served markup, every `hidden`
branch survives, and every behaviour hook stays attached — and it diffs the SERVED documents, not the
bake source, so a change that lands in the generator but not in `index.html` is exactly what it catches.
The **class gate** rejects any class outside the 143. The **type gate** holds the 12px floor with its one
named evidence-chip exception. `hidden-rule.test.mjs` forbids a second `display: !important`.

Standing and unrelaxed: no invented freshness, no `last sync` / `last read` / `last updated`; every empty
region keeps a `.basis` line; no real city asserted as content; live Bastrop no-touch.

### Verification

EXIT-BOUNDED only. If you start a local server, start it detached, curl it, kill it, and **verify the
kill actually killed it** — Git Bash job pids do not map to Windows node processes and `kill` can report
success while the port stays bound. Probe with GET; HEAD returns 404 on this service. Merge gates read
the CI check-run **conclusion string**.

### Deliverables

- Branch pushed, PR opened, number and head SHA. **Do not merge.**
- CI conclusion string.
- The footer's new phrasing, and proof its counts are DERIVED — change the catalog or the grants in a
  scratch copy and watch the number move without a source edit.
- The register rows before and after, the new row count with its counting rule, and proof the bake was
  re-run rather than the HTML hand-edited (the bake-freshness test green, watched failing on a hand edit).
- The class vocabulary count if you shipped CSS.
- CP1 with both phrasings before you build. CP2 with the footer done and its derivation proven.
- Close artifact with `missionPremise`, `completionPredicate`, `scopeBasis`. Paste raw output.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-19_w2fix_cp1.json
  CP2: _inbox/2026-08-19_w2fix_cp2.json
  CLOSE: _inbox/2026-08-19_w2fix_close.json
