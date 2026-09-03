# Govtech seat state

**Last updated: 2026-09-03.** Namespace `govtech`. Branch `seat/govtech`. OPS-17 lanes B, C, D: SmartCity Dashboards, plan review, Smart Files, ICC.

## Where things stand

**Wave 1 CLOSED** (OPS-17 A-104, WDLL items 1–15 all met). G-110 (E2E capstone) walked live on `template-city` 2026-09-02: real staff upload, edition declaration, a genuine Pass and a genuine typed absence in one matrix run. One residual named (no session-scoped `source_obligation_ledger` row) and accepted by operator ruling ("residual named is fine," A-104).

**G-115 — PermitFlow island cut — items 1–5 all MET, item 6 unblocked but not started.** Frozen card: `_inbox/2026-09-02_bastrop_permitflow_islandcut_WDLL.md`. Not "Bastrop cutover" — a narrower, explicitly-scoped island replacement per `_inbox/2026-08-17_dashboards_missing_pieces.md`'s sequence. `plan-review` PR #14 merged, deployed `plan-review-00014-bbg` @100% — unchanged since item 2 (no code has touched this service since; items 2 and 3 were both live-verification/measurement-only lanes).

**What's actually true about coverage (item 3, A-110) — read this before scoping item 6:** section-reference coverage is 2/2 (100%) — every UDC section the real chain data names is already ingested; the WDLL's own "missing section numbers" framing was wrong and corrected. The real gap is one level down: `14-02-008` (permitted-use table) has a real citation but zero adjudication logic anywhere, ever, by design — whether a proposed use is even permitted is never checked. Within the one section that IS adjudicable (`14-02-003`), only front setback is compared (1/6 real dimensions — side, corner, rear, max height, and min lot size are fetched but unused). Confirmed live across 2 real parcels/districts and 4 submittal types, which also confirmed `projectType` has zero effect on coverage (`seedMatrix` never passes it to `matrixFromChain`). **New, previously-unnamed finding:** both sampled parcels' setback-rule atoms already carry an unresolved conflict between two City of Bastrop GIS layers on the exact dimension being adjudicated — flagged in the data, never actioned. This is honest, by-design Unchecked, not a defect — but item 6 (staff go-live) should be scoped with this shape in view, not discovered by the first real reviewer.

**OPEN on G-115 — next work:**
- **Item 6** — real staff go-live proof (named staff, named submittal, their own confirmation). Unblocked (items 1–5 all MET/resolved) but genuinely the operator's own action, not a dispatch — needs a scoping decision first given item 3's findings above.
- **Real follow-on engineering identified but not filed as its own G- row:** (a) wire the 5 unused real setback/height dimensions into adjudication — no new data needed, mirrors `adjudicateMinimumSetback`'s existing shape; (b) a real use-permissibility check against `14-02-008`'s table; (c) resolve which of the two conflicting Bastrop GIS layers (23 vs 83) is authoritative — property/substrate seat's data, not plan-review's defect.

**Leave-behinds from A-108 (not this card's scope — don't lose):**
- Smart Files needs a `bastrop_tx` entry in its own `QA_PERSONAS` before a Bastrop-persona file upload works.
- Substrate: jurisdiction-rollup `accessPolicy` reports `public-free` while individual atom reads refuse anonymous callers — two signals disagree. Named for the substrate seat, not fixed here.

## Reconciliation corrections (2026-09-02, A-105–A-107 — inherit, don't re-derive)

- Real, licensed IBC 2018 content already exists in the substrate (4,825 atoms, `icc-code-connect` adapter, entitled through Dec 30 2026). Earlier claim that "no real ICC content exists anywhere" (A-102/A-103) was wrong — corrected to a wiring gap, now closed by G-115 item 4.
- ADR-023 DOC-5 amendment **RATIFIED**: city plan review lives in the standalone `plan-review` repo, not `legacy-design-tools/artifacts/plan-review`. G-13 was already closed by decision but sat OPEN on the tracker for two weeks — re-graded. G-15/G-16/G-22/G-31/G-51 marked out-of-scope-for-Bastrop (they measure the wrong repo; still real rows for AEC-cortex's own surface whenever built).
- **G-52** (SmartCity-initiated engagement from a MyGov permit record) stays genuinely blocked — needs a live permit feed on `template-city` (`grantedAdapters` still `[]`, per G-63's close). The 2026-08-17 instruction stands: do not start G-52.

## Standing rules

- Product repos: branch, PR, merge on green. May merge own branches.
- Does not write property, markets, or substrate repos. Request changes from the owning seat.
- Deploys are planner-owned. Merged ≠ live. Grade on the deployed surface with violation probes, not the diff.
- **G-115 standing constraints (operator, 2026-09-02, binding on every dispatch under this card):** live Bastrop (PermitFlow on `smartcityos.io`) stays 100% live and untouched throughout; additive-only — reuse existing data/component mapping, no rebuilding what already works.
- `smartcity-os` remains ABSOLUTE NO-TOUCH — this seat's subject, not its property.

## Notes from this session's orientation pass

- Confirmed this worktree (`P:/seat-worktrees/govtech/doc_repo`, branch `seat/govtech`) matches `_catalog/seat_register.json`'s current govtech entry exactly. Clean tree.
- **Registry drift found:** `icc-portal` is registered (`P:/seat-worktrees/govtech/icc-portal`) but does not exist on disk. Not currently blocking — G-115 doesn't touch it — flagged per the reset-checklist rule (fix the registry entry, or ask the planner, before opening a session there).
- `smartcity-dashboards` worktree is in detached HEAD at `origin/main`, clean. `smart-files` carries one small uncommitted local change (`web/.gitignore` +`.env*`), harmless and unstaged. `plan-review` is on `main`, clean, matching its post-merge PR #14 state.
- The old "Authoritative tracker: `canvases/govtech-master-program.canvas.tsx`" pointer in the prior version of this file no longer resolves — file doesn't exist on disk. Dropped rather than carried forward; if a program-board canvas still exists it needs re-pointing.

## Filed this thread

- `_sessions/2026-09-02_govtech_wave1_close_and_bastrop_permitflow_start_claude_code.md` — full session record
- `_inbox/2026-09-03_govtech_seat_writepath_handoff.md` — seat/write-path model + reset checklist (this session's orientation source)
- `_inbox/2026-09-02_bastrop_permitflow_islandcut_WDLL.md` — G-115 frozen card
- `_decisions/2026-09-02_plan_review_leads_the_bastrop_push.md`
- `_inbox/2026-09-03_g115-tenant-icc_close.json` — close artifact, G-115 items 1 and 4
