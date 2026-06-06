---
date: 2026-05-28
agent: cursor-auto
repo: doc_repo
type: finding
topic: brokerage_v1_memory_rollup
related: [75_hauska_brokerage_workflow_plan, 75a_hauska_brief_extension, 77_place_graph_strategy, _sessions/2026-05-26_brokerage_extension_api_dispatch_claude_code, _inbox/2026-05-26_legacy-design-tools_cc-agent-C_brokerage_brief_api]
---

# Brokerage v1 memory rollup (last 3-5 days)

## 1) Claims

- **C1. Brokerage brief architecture was framed as thin client plus thick server.**
  - Source chat date: **2026-05-26**
  - Evidence: Session summary states extension remains orchestration/UI while intelligence and persistence move to `cortex-api` `/api/brokerage/v1/*`.

- **C2. Brokerage v1 backend scope was reported as implemented with three core endpoints.**
  - Source chat date: **2026-05-26**
  - Evidence: Close report lists `POST /brief`, `POST /brief/summarize`, and `POST /research/chat` plus migration `0026_brokerage_brief_runs.sql`.

- **C3. Property Brief extension status includes merged backend and remaining operator gates.**
  - Source chat date: **2026-05-28**
  - Evidence: `75a_hauska_brief_extension.md` notes backend merge and separately tracks deploy/migration/extension endpoint wiring as pending.

- **C4. Sharing/viral graph behavior is currently documented as consent-gated API contract, not confirmed production telemetry.**
  - Source chat date: **2026-05-28**
  - Evidence: `75a_hauska_brief_extension.md` includes `gtm/consent` + `gtm/events` behavior and `graphOptIn` requirement for share/graph events.

- **C5. Brokerage-related atomization was captured as queued package shape, not yet a completed contract dispatch.**
  - Source chat date: **2026-05-28**
  - Evidence: Operator addendum in `75a_hauska_brief_extension.md` lists proposed package shapes (`property-workspace`, `brief-run`, `workspace-attachment`, `workspace-share-edge`) under "Atomization start."

- **C6. Paywall/metering requirements were captured as product rules but remain requirement-level in the sampled chats.**
  - Source chat date: **2026-05-28**
  - Evidence: `75a_hauska_brief_extension.md` addendum specifies quota lock behavior, `$5` top-up increments, and read-retention expectations under lockout.

- **C7. Brokerage lane was reframed as a view on a place graph with metered reasoning as strategy anchor.**
  - Source chat date: **2026-05-27**
  - Evidence: Place-graph strategy chat and filing describe agent queries as metered reasoning walks and position brokerage as one GTM lane.

## 2) Decisions proposed or made

- **Made (2026-05-26):** Keep brokerage intelligence server-side (`cortex-api`) with extension as frontend/orchestration surface.
- **Made (2026-05-26):** Include research chat in backend Phase 0 scope rather than deferring it.
- **Proposed/captured (2026-05-28):** Sequence post-v1 around workspace history, sharing graph, atomization start, and paywall/metering UX.
- **Made (2026-05-27 strategy framing):** Treat brokerage as GTM lane on top of place-graph substrate strategy.

## 3) Open questions / unresolved conflicts

- Are `property-workspace` and `workspace-share-edge` atom shapes scheduled in a named `@hauska/atom-contract` dispatch, or still requirement text only?
- Are consent/event endpoints deployed and emitting metrics, or documented only?
- How should brokerage paywall semantics map cleanly to canonical tier docs without conflicting policy?
- Should admin share-graph visibility live in brokerage docs or in a cross-product analytics doc?
- **Assumption:** "merged backend" in docs reflects branch/PR state and not necessarily production rollout completeness.

## 4) Suggested canonical doc patches (exact file paths + sections)

- `p:/doc_repo/75a_hauska_brief_extension.md`
  - Section: `## Gates` and `## Operator capture addendum (2026-05-28)`
  - Patch: add explicit per-item `status` (`shipped`/`in-progress`/`queued`) and owner.

- `p:/doc_repo/75_hauska_brokerage_workflow_plan.md`
  - Section: `## Product definition` and `## Unified pilot — "Hauska for [Brokerage]"`
  - Patch: split v1 shipped backend capabilities vs queued sharing/paywall/graph work in one table.

- `p:/doc_repo/29_mcp_surface_tier_model.md`
  - Section: product-level tier enforcement semantics
  - Patch: add brokerage quota behavior mapping to Layer 2 metering language.

- `p:/doc_repo/14_pricing_framework.md`
  - Section: substrate/payment implementation status
  - Patch: add note on micro-top-up and "read retained, new compute blocked" policy assumption for brokerage.

- `p:/doc_repo/77_place_graph_strategy.md`
  - Section: segment and maturity metrics sections
  - Patch: clarify whether sharing graph telemetry is a strategic metric or only product instrumentation.

## 5) Confidence per claim

- **C1:** High
- **C2:** High
- **C3:** High
- **C4:** Medium
- **C5:** Medium
- **C6:** Medium
- **C7:** High
---
id: 2026-05-28_cursor-auto_brokerage_v1_memory_rollup
title: Memory rollup — brokerage v1 (recent chats)
date: 2026-05-28
agent: cursor-auto
status: draft
---

# 1) Claims

- **C1 (brokerage workflow framing):** On **2026-05-26**, the chat moved from generic MCP positioning to a specific brokerage wedge: Matrix listing latch + SkySlope file latch under "Hauska Property Brief".  
  **Evidence (2026-05-26 chat):** assistant wrote canonical `75_hauska_brokerage_workflow_plan.md` with title "Matrix listing + SkySlope" and summarized "one cited brief engine, two latch points".

- **C2 (extension/API contract formalized):** On **2026-05-26**, extension and API contract were codified in canonical docs, including `/api/brokerage/v1/brief`, `/brief/summarize`, `/research/chat`.  
  **Evidence (2026-05-26 chat):** assistant wrote `75a_hauska_brief_extension.md` and dispatch `_dispatches/2026-05-26_cc-agent-C_brokerage_brief_api.md` with the 3-route contract.

- **C3 (brokerage API merged in product repo):** On **2026-05-26**, PR #128 was reported merged for brokerage routes and auth model.  
  **Evidence (2026-05-26 chat + inbox close):** `_inbox/2026-05-26_legacy-design-tools_cc-agent-C_brokerage_brief_api.md` records merged routes and auth via `BROKERAGE_DEV_API_KEY` / `BROKERAGE_API_KEYS`.

- **C4 (prod deploy conflict resolved at revision/traffic layer):** On **2026-05-28**, brokerage endpoint returned `brokerage_api_unconfigured` until serving traffic moved to a newer revision that had brokerage secret bindings.  
  **Evidence (2026-05-28 chat):** user pasted 503 `brokerage_api_unconfigured`; subsequent verification showed authed brief returned `runId` with `method=grok`.

- **C5 (deep research behavior gap identified):** On **2026-05-28**, observed deep research remained local snippet search rather than live AI chat, despite UI expectations.  
  **Evidence (2026-05-28 chat):** user screenshot + statement "behavior ... didn't change" and request for parcel-level research beyond code references.

- **C6 (extension-side fix shipped in chat context):** On **2026-05-28**, deep research was updated to call live `/api/brokerage/v1/research/chat` when brief API + key are configured, with fallback to local mode.  
  **Evidence (2026-05-28 chat):** assistant reported extension v0.4.2 wiring live research chat and re-run requirement for new `runId`.

- **C7 (parcel data gap remains backend-side):** As of **2026-05-28**, brokerage research still uses code atoms; parcel/zoning/flood adapters are not yet included in brokerage routes.  
  **Evidence (2026-05-28 chat):** backend route review showed `/brokerage/v1/*` uses geocode + code retrieval only; follow-on dispatch created for site-context layer inclusion.

- **C8 (paywall/metering status):** In recent chats, monetization was framed as premium pilot/per-deal or team-cap, but no new implemented paywall/metering mechanism was verified as shipped in brokerage v1.  
  **Evidence (2026-05-26 chat):** brokerage workflow plan discussed premium packaging; no chat evidence of runtime meter enforcement implementation in brokerage routes.

- **C9 (atomization scope in this window):** No new atomization architecture decision was logged in these brokerage-focused chats; atom usage remained citation-level consumption in outputs.  
  **Evidence (2026-05-24 to 2026-05-28 chats):** discussion and artifacts centered on extension/API workflow and deployment, not new atom type/registry decisions.

# 2) Decisions proposed or made

- **Made (2026-05-26):** Establish canonical brokerage planning docs (`75`, `75a`) and dispatch backend implementation to `legacy-design-tools`.
- **Made (2026-05-28):** Treat Cloud Run revision/traffic pinning as the primary immediate deploy issue for brokerage auth behavior.
- **Proposed (2026-05-28):** Shift extension deep research from local keyword behavior to live brokerage research API path (now reported shipped in chat context).
- **Proposed (2026-05-28):** Add brokerage-side site-context adapters (Regrid/FEMA/etc.) so research includes parcel intelligence, not only code atoms.
- **Proposed (2026-05-26):** Keep v1 auth simple (shared key env), defer key rotation + per-tenant metering to follow-on work.

# 3) Open questions / unresolved conflicts

- Should brokerage v1 demo proceed with code-first + Grok, or block on parcel adapter integration first?
- What is the minimum acceptable "all parcel data" envelope for pilot: Regrid+FEMA only, or full adapter parity with engagement `generate-layers`?
- Where should metering/paywall land first: key-level counters in `cortex-api`, or external billing substrate hook?
- Should extension continue dual-mode (MCP fallback + API), or force API-only for pilot consistency and supportability?
- What is the canonical owner/repo boundary for brokerage site-context enrichment: `legacy-design-tools` only vs shared library change in adapters/codes?

# 4) Suggested canonical doc patches (exact file paths + sections)

- `P:/doc_repo/75a_hauska_brief_extension.md`  
  - **Section:** "Product surface" and "Extension version history (pilot)"  
  - **Patch:** Confirm deep research mode semantics explicitly: live `/research/chat` path, fallback conditions, and required operator settings.

- `P:/doc_repo/75a_hauska_brief_extension.md`  
  - **Section:** "POST /api/brokerage/v1/research/chat"  
  - **Patch:** Add an explicit limitation note: current backend context is code-atom grounded; parcel adapters pending.

- `P:/doc_repo/75_hauska_brokerage_workflow_plan.md`  
  - **Section:** "Phase 0" scope table  
  - **Patch:** Split "research chat live" vs "site-context parcel enrichment" as separate checkboxes to avoid false-closed status.

- `P:/doc_repo/00_current_state.md`  
  - **Section:** brokerage fire / active track  
  - **Patch:** Add deploy reliability note: Cloud Run traffic pinning can mask new secret/env revisions; include required verify step (`status.traffic` + endpoint auth check).

- `P:/doc_repo/_dispatches/2026-05-26_cc-agent-C_brokerage_brief_api.md`  
  - **Section:** acceptance criteria  
  - **Patch:** Add a follow-on acceptance block for parcel layer ingestion in brokerage routes (or cross-link to new site-context dispatch).

# 5) Confidence per claim

- **C1:** High
- **C2:** High
- **C3:** High
- **C4:** High
- **C5:** High
- **C6:** Medium (reported in chat context; treat as implementation-complete pending user-side reload/E2E reconfirm)
- **C7:** High
- **C8:** Medium (plan-level monetization statements are verified; implementation absence inferred from available route evidence)
- **C9:** Medium (negative claim based on reviewed recent chat window)

## Assumptions (explicit)

- Assumption A1: "Recent chats" scope interpreted as the active transcript window from 2026-05-24 to 2026-05-28 plus today’s deploy/debug exchange.
- Assumption A2: "Already-canonical facts" interpreted as avoiding broad restatement unless it materially changed execution status in this window.
