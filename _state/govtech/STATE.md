# Govtech seat state

**Last updated: 2026-09-03.** Namespace `govtech`. Branch `seat/govtech`. OPS-17 lanes B, C, D: SmartCity Dashboards, plan review, Smart Files, ICC.

## Where things stand

**Wave 1 CLOSED** (A-104). **G-115 (PermitFlow island cut) CLOSED**, items 1–5 all MET (A-108–A-110). `plan-review` PR #14 merged, deployed `plan-review-00014-bbg`@100%. Coverage measured honestly: `14-02-003` (front setback) is the only adjudicable UDC section; `14-02-008` (permitted-use) has a real citation but no adjudication logic anywhere, by design; 5 of 6 real setback/height dimensions on the setback-rule atom are fetched but unused. A live GIS-source conflict (two disagreeing City of Bastrop layers) was found on both sampled parcels, unresolved, property/substrate's to fix. **Item 6** (real staff go-live) is unblocked but is the operator's own action, not a dispatch — scope it against the coverage findings above before scheduling.

**G-116 (real `bastrop_tx` pack, real data feeds, real auth) — CLOSED. All 10 real-domain routes + real Hauska auth are live end to end on `smartcity-dashboards`** (A-111 through A-119). Decision trail: `_decisions/2026-09-03_bastrop_tx_dashboards_pack_ratified.md`, `_decisions/2026-09-03_smartcity_os_platform_read_authorization.md` (the absolute-no-touch line on `smartcity-os` crossed once, narrowly, on explicit operator authorization — real changes now exist in that repo, not read-only anymore for this one purpose).

**What's real and live right now:** a tenant-private `bastrop_tx` pack (`environment: staging`) on `smartcity-dashboards`, wired through `smart-files`, deployed as `smartcity-dashboards-00048-kic`@100% traffic (verified by field, not by CLI summary). Ten domains have a real (non-fixture) source defined; **eight are genuinely returning live Bastrop data**, live-verified directly against production before and after the traffic shift:
- permits (312 records), work-orders (174), inspections (2015), code-violations (1495), business-licenses (72) — all via `smartcity-os`'s new `/api/platform/mygov/*` routes.
- fleet-vehicles (75 real Samsara vehicles), patrol-vehicles (24 real Spireon units), cip-projects (14 real PowerBI capital projects).

**Two are honestly unavailable, not broken** — grants provisioned, code correct, blocked on a real-world action outside engineering: fire-apparatus (FirstDue's own credential lacks apparatus/assets API scope — contact `dashboards@firstarriving.com`) and call-analytics (GoTo's OAuth consent was never completed by a human — `GET /api/goto/authorize` on `smartcity-os`). GoTo's real feed is deliberately aggregate-only (no individual call detail — real citizen phone numbers would be a genuinely higher sensitivity class than the fixture domain's own already-stated concern about inventing them).

**Verkada (police-cameras)** remains the one domain with **no credential anywhere** — needs real vendor onboarding, not more engineering.

**Real statuses are never force-mapped onto this product's own invented fixture taxonomies** (checked per domain, not assumed) — every real record keeps its real status/telemetry value as-is; each compose function's `extras` groups honestly instead of guessing a translation.

**Real auth is live.** A real Hauska tenant key was minted (`hauska-mcp-server` admin API, `tier: team`, `product: public`, `jurisdiction_tenant: bastrop_tx`, owner the operator) and a minimal browser bootstrap ships in `web/app.js` (reads `?hauskaKey=` once, persists to `localStorage`, attaches `x-hauska-key` to same-origin API calls). Verified end to end against the live 100%-traffic revision: real key → `resolveHauskaTenant` → `canReadPack` tenant match → real composed data (`origin: feed`, `source: live`, 312 real permit records). Raw key value delivered to the operator directly (never logged in this repo); not needed again unless a new caller is provisioned.

**What's genuinely still open (all real-world, not engineering):**
1. **fire-apparatus / call-analytics** — vendor scope grant (FirstDue) and human OAuth consent (GoTo), respectively.
2. **Verkada** — real vendor onboarding, no credential exists anywhere yet.
3. Small, non-blocking: per-pack default subject parcel for the SmartSite staff-map embed (currently one global constant, harmlessly correct for Bastrop by coincidence).

**Two real bugs found and fixed during the operator's own first look at the live dashboard, not by a dispatch** (A-120): (1) the Development Services / Pipeline page — the exact page the operator screenshotted earlier — never dispatched to real data at all; `/api/domains/:id` and `/api/city-domains` had the real-source branch, this one route was missed and kept calling the fixture composer unconditionally even for `bastrop_tx`. (2) None of the 8 live real domains populated `extras.metrics` (only `extras.realStatusCounts`), so every domain's summary tiles showed "Not read" despite real records in the table underneath. (3) Found alongside: every one of the 24 static nav hrefs in `index.html` carries no `cityKey`, so clicking ANY sidebar link dropped the visitor back onto the default pack — surfaced live as "my bastrop login went away" when it was really "my city selection went away" (the Hauska key itself never left `localStorage`). All three fixed together (`smartcity-dashboards` PR #46, merged `6aed1a5`), deployed `smartcity-dashboards-00050-hiz`@100%, live-verified against the real deployed service both before and after the traffic shift (312 real permits, real status counts present, nav fix confirmed shipped in served `app.js`). 512/512 tests.

**Two more real bugs found and fixed on the operator's Fleet page QA** (A-121): (4) the 5 vendor-live composers (fleet/patrol/fire-apparatus/cip/call-analytics) never populated `extras.realStatusCounts` either — the same "Not read" tile symptom as (2), just missed on this half of the real domains. (5) `renderRegion`/`renderPipeline`/`sourcedLabel` showed the fixture-only "Demo records" pill and nav badge on ANY `ok` payload, with zero real/fixture check — a live, active false claim over 75 genuinely real Samsara vehicles. Fixed at the call edges (`payload.source === "live"` / `pipeline.realStatusCounts` / `regions.some(r => r.source === "live")`) rather than inside `LENS_BADGE`/`LENS_BADGE_ORDER`, which stay exactly the fixture seam's guarded five-word vocabulary (`src/lens-claims.test.mjs` holds them equal to `DOMAIN_STATUSES`) — a real domain isn't a seam status and doesn't get a sixth word spliced in. A real `ok` region now reads "Live records". Both fixed together, `smartcity-dashboards` PR #47 merged `9ad2a70`, deployed `smartcity-dashboards-00052-vug`@100%. 513/513 tests.

**A third, real-world root cause found alongside (6):** every real Samsara vehicle showed status "unknown" with no odometer/fuel — not a mapping bug. `smartcity-os`'s own `/api/platform/samsara/vehicles` route only ever called Samsara's static vehicle-roster endpoint, never the separate stats-batch endpoint that actually carries live telemetry, despite the route's own comment claiming otherwise. Fixed (`smartcity-os` PR #43, merged `e0b627a`, deployed `smartcity-api-00127-quv`@100%) by adding the same stats-batch call the existing session-gated `/api/samsara/vehicles` route already proved. **Live-verified, partial and honest, not force-completed:** odometer now real for 72 of 75 vehicles (e.g. 10,167 mi), engine hours present — genuine improvement. Engine on/off state and fuel percent remain empty for all 75, using the identical proven field-extraction the working route already uses; read as a real hardware/sensor-coverage gap on this fleet (OBD-derived stats like odometer are broadly available, engine-state/fuel-level sensors are not guaranteed on older or retrofitted municipal vehicles), not a further code defect — not chased further without vendor-side evidence otherwise. Before deploying, confirmed by ancestry check that `smartcity-os` `main`'s tip was exactly "what's already live + this one commit" (a stale local branch pointer briefly made it look like 10 commits of unrelated concurrent work had landed; verified via `git log`/`git show` before touching the no-touch repo's live deploy, not assumed).

**Ready for the operator's deep UI QA session** — this was the operator's own stated sequencing (data feeds, then auth, then UI QA) and both prerequisites are now live, with all bugs the operator's own QA pass has surfaced so far already closed.

## Reconciliation corrections (2026-09-02, A-105–A-107 — inherit, don't re-derive)

- Real, licensed IBC 2018 content already exists in the substrate (4,825 atoms, `icc-code-connect` adapter, entitled through Dec 30 2026). Earlier claim that "no real ICC content exists anywhere" (A-102/A-103) was wrong — corrected to a wiring gap, closed by G-115 item 4.
- ADR-023 DOC-5 amendment **RATIFIED**: city plan review lives in the standalone `plan-review` repo, not `legacy-design-tools/artifacts/plan-review`. G-15/G-16/G-22/G-31/G-51 marked out-of-scope-for-Bastrop (they measure the wrong repo; still real rows for AEC-cortex's own surface whenever built).
- **G-52** (SmartCity-initiated engagement from a MyGov permit record) stays genuinely blocked — needs a live permit feed (`grantedAdapters` still `[]` on the packs that would carry one, per G-63's close). Do not start G-52.

## Standing rules

- Product repos: branch, PR, merge on green. May merge own branches.
- Does not write property, markets, or substrate repos. Request changes from the owning seat.
- Deploys are planner-owned. Merged ≠ live. Grade on the deployed surface with violation probes, not the diff.
- **G-115/G-116 standing constraints (operator, binding on every dispatch under either card):** live Bastrop (`smartcityos.io`, PermitFlow) stays 100% live and untouched throughout; additive-only — reuse existing data/component mapping, no rebuilding what already works.
- `smartcity-os` remains ABSOLUTE NO-TOUCH — this seat's subject, not its property.
- Stay on the product surface actually in focus. Findings that belong to another seat's domain (property/substrate GIS data, etc.) get named as leave-behinds, not chased deeper — see `[[feedback-govtech-scope-discipline]]` (auto-memory).

## Notes from this session

- Confirmed this worktree (`P:/seat-worktrees/govtech/doc_repo`, branch `seat/govtech`) matches `_catalog/seat_register.json`'s current govtech entry exactly.
- **Registry drift found, still open:** `icc-portal` is registered (`P:/seat-worktrees/govtech/icc-portal`) but does not exist on disk. Not currently blocking. Flag before opening a session there.
- Both `smartcity-dashboards` and `smart-files` worktrees were one commit behind `origin/main` at session start (G-114) — resynced before branching each time. General reminder: check worktree staleness at the start of any new lane, don't assume current.
- The old "Authoritative tracker: `canvases/govtech-master-program.canvas.tsx`" pointer from a prior version of this file no longer resolves — file doesn't exist on disk. Dropped.

## Filed this thread

- `_sessions/2026-09-02_govtech_wave1_close_and_bastrop_permitflow_start_claude_code.md` — prior session record
- `_inbox/2026-09-03_govtech_seat_writepath_handoff.md` — seat/write-path model + reset checklist
- `_inbox/2026-09-02_bastrop_permitflow_islandcut_WDLL.md` — G-115 frozen card, all items graded
- `_inbox/2026-09-03_g115-matrix-verify_close.json`, `_inbox/2026-09-03_g115-coverage-measure_close.json` — G-115 items 2/3 closes
- `_decisions/2026-09-02_plan_review_leads_the_bastrop_push.md`
- `_decisions/2026-09-03_bastrop_tx_dashboards_pack_ratified.md` — G-116 ratification
- `_inbox/2026-09-03_g116-bastrop-dashboards-pack_close.json` — G-116 Phase 0+1 close
