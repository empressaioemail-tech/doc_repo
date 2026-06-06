---
date: 2026-05-28
agent: planning-agent
repo: doc_repo
type: recon
topic: brokerage_v1_memory_rollup
---

# Brokerage v1 memory rollup (last 3-5 days)

## 1) Claims

- **C1. Brokerage v1 backend endpoints are implemented and merged.** Source chat date: **2026-05-26**. Evidence: `_inbox/2026-05-26_legacy-design-tools_cc-agent-C_brokerage_brief_api.md` records PR #128 merged with `POST /api/brokerage/v1/brief`, `/brief/summarize`, and `/research/chat`.
- **C2. The extension-to-API architecture decision is thin client, thick server.** Source chat date: **2026-05-26**. Evidence: `_sessions/2026-05-26_brokerage_extension_api_dispatch_claude_code.md` decision line: extension remains MCP-capable for dev; production intelligence routes to `cortex-api` `/api/brokerage/v1/*`.
- **C3. GTM consent/event contracts and graph-opt-in were added to the extension/API contract doc.** Source chat date: **2026-05-28**. Evidence: `75a_hauska_brief_extension.md` defines `/api/brokerage/v1/gtm/consent`, `/gtm/events`, and states share/graph events require `graphOptIn: true`.
- **C4. Post-v1 requirements were explicitly captured as queued (not launch-gating): sharing, atomization start, paywall behavior, wallet metering, admin graph view.** Source chat date: **2026-05-28**. Evidence: `75a_hauska_brief_extension.md` "Operator capture addendum (2026-05-28)" lists these as next-wave items after v1 launch gate.
- **C5. A measurable metering implementation exists on collateral export path (credits + metering rows), which can inform brokerage paywall/metering design.** Source chat date: **2026-05-26**. Evidence: `_inbox/2026-05-26_legacy-design-tools_cc-agent-C_placid_collateral_close.md` documents `collateral_metering_events`, `credits_estimated`, and `credits_actual`.
- **C6. Encumbrance atom contract shipped and was integrated in upload path at least locally, increasing atomization readiness for brokerage dossier-style workspaces.** Source chat dates: **2026-05-26**. Evidence: `_inbox/2026-05-26_hauska-atom-contract_cc-agent-AC_recorded_restriction_atoms_close.md` (contract v1.2.0) and `_inbox/2026-05-26_legacy-design-tools_cc-agent-C_encumbrances_phase_1_close.md` (uses `@hauska/atom-contract/encumbrances`).

## 2) Decisions proposed or made

- **Made (2026-05-26):** Use `/api/brokerage/v1/*` on `cortex-api` as production intelligence path; keep extension MCP path for dev fallback.
- **Made (2026-05-26):** Include research chat in Phase 0 backend slice rather than deferring to a later phase.
- **Proposed/captured (2026-05-28):** Post-v1 include property workspace history, workspace sharing, property-workspace atom package, quota behavior that blocks new compute (not existing project access), wallet-style top-up, and internal graph view.

## 3) Open questions / unresolved conflicts

- **OQ1. Launch-vs-v1.1 boundary:** Which of the 2026-05-28 addendum items are mandatory for "v1 GA" versus explicitly deferred to v1.1+?
- **OQ2. Billing model consistency:** The docs include both seat/deal pilot pricing (`75_hauska_brokerage_workflow_plan.md`) and wallet microfunding/top-up behavior (`75a_hauska_brief_extension.md`). Need a single canonical sequencing statement to avoid mixed pricing signals.
- **OQ3. Atom package ownership:** Post-v1 "property-workspace atom bundle" is specified in `75a` but atom registration ownership is not assigned in dispatch form.
- **OQ4. Graph privacy defaults:** `graphOptIn` exists, but retention, visibility scope, and revocation semantics are not yet codified in canonical policy language.
- **Assumption (explicit):** This rollup treats 2026-05-28 operator-capture content in `75a` as chat-derived memory that should be audited, not yet fully executed product behavior.

## 4) Suggested canonical doc patches (exact file paths + sections)

- `p:/doc_repo/75_hauska_brokerage_workflow_plan.md`
  - Section: **Phase 0 — Brief API + manual pilot (weeks 1 to 3)**
  - Patch: Add explicit status note that `/brief`, `/brief/summarize`, and `/research/chat` are merged (PR #128), with remaining deploy gates only.
- `p:/doc_repo/75_hauska_brokerage_workflow_plan.md`
  - Section: **Pilot offer (30 days)** and/or pricing section
  - Patch: Add cross-reference to wallet top-up/paywall intent from `75a` and clarify whether this is pilot-only instrumentation or planned default monetization path.
- `p:/doc_repo/75a_hauska_brief_extension.md`
  - Section: **Operator capture addendum (2026-05-28)**
  - Patch: Add explicit owner + target phase column for each item (sharing, atomization, paywall, metering, graph), so queue order is auditable.
- `p:/doc_repo/14_pricing_framework.md`
  - Section: **Usage metering / take-rate mechanics**
  - Patch: Add a brokerage-v1 annex note covering "block new generation only" policy and wallet auto-top-up semantics to align with existing pricing governance.
- `p:/doc_repo/01a_atom_conventions.md`
  - Section: **doc_repo Atom Catalog**
  - Patch: Add provisional refs for `product:property-workspace`, `workflow:brokerage-brief-run`, and `graph:workspace-share-edge` as queued atom IDs (status=proposed).

## 5) Confidence per claim

- **C1:** High
- **C2:** High
- **C3:** High
- **C4:** High
- **C5:** Medium (evidence is from collateral path, not brokerage route itself)
- **C6:** Medium (contract + local integration verified; end-to-end brokerage usage not yet shown)
