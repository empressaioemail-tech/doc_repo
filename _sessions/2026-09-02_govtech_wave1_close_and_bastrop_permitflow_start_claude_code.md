---
date: 2026-09-02
agent: planner
repo: docs
session_type: execute
memory_graded: none
rolled_up: false
rolled_up_into:
---

# Session: Wave 1 close, Bastrop-cutover reconciliation, G-115 (PermitFlow island cut) start

Ran 2026-09-02 into 2026-09-03. Seat: `integration` (`P:/doc_repo`, branch `main`) — not a product-owning seat. All product-repo work in this session was dispatched to the govtech seat's registered worktrees and verified from close artifacts, never built directly here.

## What was done

**Wave 1 closed.** G-110 (the program's E2E capstone row) walked live end to end on `template-city`: real staff upload, edition declaration, a genuine Pass and a genuine typed absence in one matrix run, Dashboards' embed resolving correctly. One residual named honestly — no session-scoped `source_obligation_ledger` row, because the walk's own ICC-touching rows were typed absence — and closed on operator ruling ("residual named is fine," OPS-17 A-104). WDLL items 1-15 all graded; the frozen Start card's own Finish-card mechanism was filled in for the first time (`_inbox/2026-08-25_govtech_wave1_WDLL.md`), rather than leaving it ungraded while OPS-17 carried the grading in prose only.

**A wrong claim found and corrected same-session.** While scoping "get the ICC demo functioning" (operator instruction), checked the substrate directly instead of trusting one route's prior output and found real, licensed IBC 2018 content already exists — 4,825 code-section atoms, live-retrievable via MCP, licensed through Dec 30 2026 — contradicting OPS-17 A-102/A-103's claim that no real per-section ICC content exists anywhere. Corrected as A-105: the actual gap was a wiring gap (plan-review's `code-lookup.mjs` had no query path into the substrate), not a data-acquisition gap.

**Bastrop-cutover reconciliation, before any new scoping.** Operator instruction: "did you look at what we had already... don't do a bunch of duplicate work." Surveyed existing Bastrop planning via a dedicated research pass before drafting anything. Found and fixed real drift in OPS-17: G-13 (consumer contract) was already closed by an existing decision but had sat OPEN for two weeks; G-15/G-16/G-22/G-31/G-51 (blocking G-52, the real Bastrop-consumer-pass row) all measured the wrong repo — `legacy-design-tools/artifacts/plan-review` (the AEC-cortex-facing surface), not the standalone `plan-review` repo Wave 1 built and Bastrop actually consumes. Ratified the previously-unratified ADR-023 DOC-5 amendment (Wave 1 had already been built on its premise) to close that ambiguity formally. Re-pointed G-52 at its real prerequisites — both already satisfied — surfacing its genuine remaining scope (A-106).

**Three stale Bastrop docs status-flipped** to `superseded` per the repo's retire-via-status-flip convention: `11a_bastrop_live_roadmap.md`, `31a_bastrop_maintenance_sprint.md`, `_research/2026-06-01_bastrop_holistic_planning_handoff.md` (the last is likely the material the operator remembered as "thought through it quite a bit" — genuinely detailed, genuinely superseded by the standalone Plan Review architecture).

**G-52 corrected a second time.** First reconciliation pass framed it as "open and unstarted." Checked the full `_inbox/2026-08-17_dashboards_missing_pieces.md` sequencing doc before drafting anything and found it explicitly says "Do not dispatch a Bastrop cutover WDLL. Do not start G-52" — because G-52 needs a live permit-record feed on `template-city` that doesn't exist (G-63 closed the adapter contract only; `grantedAdapters` is still `[]`). Still valid, not stale. Corrected G-52's own row accordingly (A-107).

**New decision recorded:** `_decisions/2026-09-02_plan_review_leads_the_bastrop_push.md` — a fresh ruling (not a citation), grounded in Bastrop's real pain point (PermitFlow) being specifically a Plan Review gap.

**G-115 (PermitFlow island cut) drafted, approved, and partially built same session.** Per the sequencing doc's own rule (each island replacement is its own WDLL with a staff go-live — explicitly not "Bastrop cutover"), scoped the one piece Wave 1 unblocks without needing a feed: PermitFlow dies when `plan-review-app` is the reviewer Bastrop staff actually use. Six acceptance items, approved with two standing constraints (live Bastrop stays 100% live throughout; additive-only, reuse existing data/component mapping, no rebuilding). Items 1 (real `bastrop_tx` tenant, cross-tenant refusal) and 4 (ICC live wiring) dispatched, built, and closed (A-108) — plan-review PR #14 merged, deployed `plan-review-00014-bbg` @100%. Item 5 (tenancy/access — accept the current persona model for this pilot, real auth stays separately tracked) resolved by direct operator ruling. A real incidental production defect was found and fixed along the way (a payload-extraction bug silently breaking a standalone code-lookup route since G-108 shipped) — verified directly against `mcp.mjs` that this did NOT affect `matrixFromChain` or any WDLL-graded determination, so nothing from earlier in the session needed walking back.

## What was learned (changes to ground truth)

- Real, licensed ICC (IBC 2018) section content already exists in the substrate (4,825 atoms, `icc-code-connect` adapter, fetched 2026-07-06) — this was NOT known/asserted correctly earlier in this same session (A-102/A-103) and is now corrected (A-105).
- ADR-023's original 2026-07-01 text (city plan review lives in `legacy-design-tools`) has been factually superseded by practice since 2026-08-16/24, but the ADR itself sat unratified until this session (now ratified).
- `_inbox/2026-08-17_dashboards_missing_pieces.md`'s "do not start G-52" instruction is still live and correct as of 2026-09-02 — its underlying reason (no feed) has not changed.
- This session's own worktree (`P:/doc_repo`) is the `integration` seat per `_catalog/seat_register.json` — not the govtech seat, not a product-owning seat at all. It cannot write another seat's `_state/<seat>/STATE.md` (seat-worktree-gate refuses it).

## What's still open

- `_state/govtech/STATE.md` — 8+ days stale (last touched 2026-08-25), predates this entire session. Cannot be refreshed from the `integration` checkout; needs a session running in the govtech seat's own registered doc_repo worktree.
- G-115 items 2 (a live matrix run specifically under the `bastrop_tx` persona/edition — not yet attempted), 3 (honest UDC coverage measurement against a real submittal sample), and 6 (a real staff go-live — the operator's own action, not a dispatch).
- G-112's own residual (a genuine matched/divergent ledger row) shares G-110's exact root cause and was deliberately left un-upgraded under the operator's "residual named is fine" ruling — it wasn't the row that ruling was asked about.
- Smart Files needs a matching `bastrop_tx` `QA_PERSONAS` entry before a Bastrop-persona file upload will work (routed to that repo, not fixed in this session).
- Substrate's jurisdiction-rollup-vs-per-atom `accessPolicy` disagreement (both report `public-free` at the rollup level while individual atoms refuse anonymous reads) — named for the substrate seat, not fixed here.
- Operator ended this session citing "seat and write path confusion" and intent to close everything and reset the workspace. Handoff filed: `_inbox/2026-09-03_govtech_seat_writepath_handoff.md`.

## Suggested canonical doc updates

- `00_current_state.md` carries stale OPS-17/Bastrop lines from the 2026-08-17 era (G-60/G-66-draft framing) that predate Wave 1's close and this session's reconciliation entirely. Per the current (2026-08-20) snapshot protocol this file is a pointer only and should not be hand-regenerated here — flagged for whoever next runs a real `_state/<seat>/STATE.md` → `generate-combined.mjs` pass.
- `11a_bastrop_live_roadmap.md`, `31a_bastrop_maintenance_sprint.md`, `_research/2026-06-01_bastrop_holistic_planning_handoff.md` — already status-flipped this session; no further action needed unless the operator wants full retirement (delete) rather than a status flip, which was not requested.
