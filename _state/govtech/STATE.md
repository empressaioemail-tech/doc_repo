# Govtech seat state

**Last updated: 2026-09-03.** Namespace `govtech`. Branch `seat/govtech`. OPS-17 lanes B, C, D: SmartCity Dashboards, plan review, Smart Files, ICC.

## Where things stand

**Wave 1 CLOSED** (A-104). **G-115 (PermitFlow island cut) CLOSED**, items 1–5 all MET (A-108–A-110). `plan-review` PR #14 merged, deployed `plan-review-00014-bbg`@100%. Coverage measured honestly: `14-02-003` (front setback) is the only adjudicable UDC section; `14-02-008` (permitted-use) has a real citation but no adjudication logic anywhere, by design; 5 of 6 real setback/height dimensions on the setback-rule atom are fetched but unused. A live GIS-source conflict (two disagreeing City of Bastrop layers) was found on both sampled parcels, unresolved, property/substrate's to fix. **Item 6** (real staff go-live) is unblocked but is the operator's own action, not a dispatch — scope it against the coverage findings above before scheduling.

**G-116 (real `bastrop_tx` pack on `smartcity-dashboards`) — Phase 0 + Phase 1 CLOSED, fully deployed** (A-111, A-112). Decision: `_decisions/2026-09-03_bastrop_tx_dashboards_pack_ratified.md`. A real, tenant-private `bastrop_tx` pack now exists (`environment: staging` — no go-live declared), wired through `smart-files` (new `bastrop_tx/staff` persona, PR #12 merged, deployed `smart-files-00010-b9v`@100%). **First real, non-fixture feed proven live**: the municode public-meetings scraper — previously stuck on `template-city` per G-71/G-74's identity hold — now runs for real against `bastrop_tx`. Live-verified against production: 25 real meetings fetched from `bastrop-tx.municodemeetings.com`, 5 written and read back; `template-city` confirmed unchanged. `smartcity-dashboards` PR #41 merged (`01e9c141`) and deployed (`smartcity-dashboards-00030-whz`@100%) — the live app itself now serves the pack. Post-deploy check: `tenant-private` access policy genuinely enforced (401 anonymous, 403 for a bare service key — correct by design, `tenancy.mjs`). Close: `_inbox/2026-09-03_g116-bastrop-dashboards-pack_close.json`.

**Real, not-yet-provisioned gap found during deploy verification:** full compose-content verification (embed URLs actually rendering for a real caller) needs a Hauska tenant key scoped to `bastrop_tx`, which doesn't exist yet — the same "real staff auth" gap already named as a deliberately-unbuilt future item, now concretely blocking one specific thing (live-viewing the composed bastrop_tx dashboard as an identified caller) rather than being purely theoretical.

**Then, a real open question for the operator (not resolved, not guessable):** G-116 Phase 2 — the other 10 fixture domains (permits-pipeline, work-orders, fleet-vehicles, patrol-vehicles, police-cameras, fire-apparatus, cip-projects, call-analytics, inspections, code-violations, business-licenses) and real vendor feeds (MyGov, Samsara, OpenGov, Esri, FirstDue, Verkada, Spireon, GoTo, PowerBI) — zero credentials exist for any of them today, and granting an adapter today only changes wording, not data source (the real-feed mechanism itself doesn't exist yet for these 10). The gap map names one sanctioned shortcut: a real MyGov scraper/credential may already exist on live `smartcity-os` to port (read-only reference; that repo stays no-touch to modify). Ask before scoping Phase 2 further.

**Smaller named follow-ups, not blocking:** per-pack default subject parcel for the SmartSite staff-map embed (currently one global constant, harmlessly correct for Bastrop today by coincidence, not truly per-pack).

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
