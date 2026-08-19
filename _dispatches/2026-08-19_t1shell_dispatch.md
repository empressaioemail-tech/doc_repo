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
repo: smartcity-dashboards

# G-90 shell function parity

## MISSION — G-90, shell function parity with live Bastrop

Housing: `empressaioemail-tech/smartcity-dashboards`. Your clone, and nobody else's: **`P:/tmp/t1shell-dash`**.
Clone fresh. A sibling lane is working in `P:/tmp/t1pack-dash` on the same repo right now.

Branch from `main` at `e11155246196a82224e4d291d53ba63bd7735849`. Branch `g90/shell-function-parity`.
**You open the PR. You do NOT merge and you do NOT deploy.**

**You own `web/`.** The sibling lane owns `src/` and may not touch `web/`; you may edit `src/server.mjs`
and add tests, but do NOT edit `src/fixtures.mjs`, `src/adapters.mjs`, `src/city-pack.mjs` or
`src/compose.mjs` — those are theirs and you will collide.

### Read first

`P:/doc_repo/_inbox/2026-08-19_template_city_lens_build_sheet.md`, the "Shell function parity" table —
that table IS this mission. Then `P:/doc_repo/_inbox/2026-08-17_bastrop_dashboard_layout_inventory.md`
for the shell section.

### What this is, and what it is NOT

The operator walked the deployed Dashboards surface and found the new shell missing functions the live
Bastrop shell has. **Capture the FUNCTIONS, not the layout and not the look.** You are not cloning
Bastrop's chrome; you are making sure a staff member does not lose a capability by moving to this product.
How each one renders is a design decision inside the existing visual law, not a copy of the old shell.

### The eight, measured against the live bundle

The Dashboards top bar today is: mobile menu button, seal, pack name, `Demo` chip, search stub with a
`Not built` badge, and the Compass source button. That is all of it.

| Function | Live Bastrop evidence | Build |
|---|---|---|
| Theme toggle, light/dark | `theme-toggle`, `localStorage theme \|\| "dark"`, `theme-transition`, `theme-v2-migrated` | persisted, defaults dark. **See the first-paint trap below — this is the one that can go wrong.** |
| Account / user menu | labels `My Account`, `My Profile`, `Account Settings`, `Support` | menu exists; entries honest-disabled until a staff session exists |
| Sign in / out / session | `/api/auth/{login,logout,user,providers,register}`, `/api/logout` | anonymous stays the DEFAULT path |
| Notifications | `Notifications`, `No new notifications`, `View all notifications` | honest empty state, never a fabricated count |
| Tenant branding | `/api/tenant/branding` | seal, name and accent already come from the pack; wire what is missing |
| Record search | live search works | today a stub; make it real or keep it honestly stubbed and say which |
| Help / support | `Support` and help surfaces | |
| Feedback | `/api/feedback` | |

### The trap that will bite, and it is the one this repo just paid for

**The theme must be resolved BEFORE first paint, in the SAME inline head script G-89 shipped.** That
script already exists in `web/index.html`, runs before the parser reaches the body, and stamps
`data-surface`, `data-tab` and `data-atab` on the root. Theme has exactly the same shape: read
`localStorage`, stamp `data-theme` on the ROOT, before paint. If you add the toggle in `app.js` instead,
you get a flash of the wrong theme on every navigation — the identical defect G-89 was opened to kill,
one attribute over.

So: **extend the existing head script, do not add a second one.** And `src/first-paint.test.mjs` is the
instrument that already models this; extend it to cover theme rather than writing a parallel test. Watch
it fail on a build where theme is resolved late — a fix nobody watched fail is the pattern this program
keeps paying for.

`data-theme` goes on the ROOT element and never on a page-level provider. `web/index.html` currently
hardcodes `data-theme="dark"` on `<html>`; the toggle must not fight that, and light is a first-class
theme in this system ("light = paper"), not a degraded mode.

### Class discipline, and the chain it may trigger

A design may use only classes the vendored stylesheets define. Read the current count and its counting
rule out of `src/ui.test.mjs` — do not take a number from this brief. The class gate is hardened and
watched firing, and it will reject a new class at merge.

**If a function genuinely needs CSS that does not exist** — a dropdown menu, a notification tray — ship
that CSS into `web/shell.css` using only existing `var(--sc-*)` tokens, and **STATE the new class
vocabulary count in your close**. Do not hand-write a class into markup without its rule, and do not
touch `web/sc-kit.css`, which is byte-identical across three repos and whose header says a repo that
edits a token value has forked the system. A new colour or type step is a product-line decision, not
this PR. The kit re-vendor that follows a vocabulary change is the planner's, not yours.

### Two gates now exist that did not exist yesterday

**The addressability gate** (`src/addressability.test.mjs`) asserts every id `app.js` addresses is
present in the SERVED markup, every `hidden` branch survives, and every behaviour hook the code reads
stays attached. New chrome that `app.js` drives must carry its ids. It is watched firing; if it fires on
you, the markup is wrong rather than the gate.

**The bake-freshness assertion** makes `web/index.html` a fixed point of `connectionsRegisterHtml()`. If
you touch anything the bake owns, re-bake rather than hand-editing, or that test names you.

### Honest states, which ruling 1 did not relax

Notifications with nothing in them says so; it never shows a fabricated count. A disabled account entry
says why. No invented freshness anywhere — no `last sync`, `last read` or `last updated` string. Every
empty region keeps a `.basis` line. No real city asserted as content. Live Bastrop no-touch.

**Session, and a standing trap:** anonymous is the default path and must stay working. An auth flip that
orphans anonymous data is a known defect class in this program — if a signed-in state would strand what
an anonymous visitor did, model the claim path or keep the session read-only and say so.

### Verification

EXIT-BOUNDED only: builds, test runs, one-shot curls, bounded polls. If you start a local server, start
it detached, curl it, and kill it in the same bounded step — and **verify the kill actually killed it**,
because Git Bash job pids do not map to Windows node processes and `kill` can report success while the
port stays bound. Probe with GET; HEAD returns 404 on this service.

Merge gates read the CI check-run **conclusion string**, never a `gh` exit code.

### Deliverables

- Branch pushed, PR opened, number and head SHA reported. **Do not merge.**
- CI run to completion; the check-run conclusion string.
- Each of the eight functions: built, or honestly deferred with its reason. A deferral is a fine outcome;
  a silent omission is not.
- The theme first-paint proof: the extended `first-paint.test.mjs` watched FAILING on late resolution,
  raw output, then passing.
- The class vocabulary count if you shipped CSS, with its counting rule.
- Confirmation that the addressability gate and the bake-freshness assertion are both still green, and
  what you had to attach to keep them that way.
- CP1 before you build: which of the eight you are building versus deferring and why, and your head-script
  plan for theme. CP2 at the pilot: theme end to end with the first-paint arm watched failing.
- Close artifact carrying `missionPremise`, `completionPredicate` and `scopeBasis`. Paste raw output.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-19_t1shell_cp1.json
  CP2: _inbox/2026-08-19_t1shell_cp2.json
  CLOSE: _inbox/2026-08-19_t1shell_close.json
