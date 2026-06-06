---
date: 2026-05-28
agent: claude_code
repo: doc_repo
type: recon
topic: brokerage_v1_memory_rollup
---

# Brokerage v1 memory rollup (last 3-5 days)

## 1) Claims

- **C1. Brokerage v1 backend API (brief + summarize + research chat) was implemented and merged.**  
  Source chat date: **2026-05-26**.  
  Evidence: `_inbox/2026-05-26_legacy-design-tools_cc-agent-C_brokerage_brief_api.md` reports merged backend routes and migration for brokerage runs.

- **C2. Architecture direction is thin extension client and thick `cortex-api` server for production intelligence.**  
  Source chat date: **2026-05-26**.  
  Evidence: `_sessions/2026-05-26_brokerage_extension_api_dispatch_claude_code.md` decision section states extension MCP path for dev, production via `/api/brokerage/v1/*`.

- **C3. Hauska Property Brief extension doc now records GTM consent/events and graph-opt-in controls.**  
  Source chat date: **2026-05-28**.  
  Evidence: `75a_hauska_brief_extension.md` defines `/api/brokerage/v1/gtm/consent`, `/gtm/events`, and graph event gating on `graphOptIn`.

- **C4. Sharing/viral graph, workspace atomization, and paywall/metering are captured as post-v1 requirements, not launch-gate deliverables.**  
  Source chat date: **2026-05-28**.  
  Evidence: `75a_hauska_brief_extension.md` "Operator capture addendum (2026-05-28)" lists these in the post-v1 section.

- **C5. Brokerage strategy is being reframed as a place-graph lane with metered reasoning, not a standalone one-off feature.**  
  Source chat date: **2026-05-27**.  
  Evidence: `_sessions/2026-05-27_place_graph_tx_crg_minerals_claude_code.md` and `77_place_graph_strategy.md` describe brokerage as a segment on the place-graph strategy.

- **C6. There is no verified evidence in the last 3-5 days that sharing graph telemetry or paywall metering is live in production.**  
  Source chat date: **2026-05-28**.  
  Evidence: Current docs describe contracts and requirements, but no deploy verification artifact in `_sessions`/`_inbox` confirms live telemetry or live billing enforcement.

## 2) Decisions proposed or made

- **Made (2026-05-26):** Thin client / thick server split for brokerage brief generation and research chat.
- **Made (2026-05-26):** Research chat included in v1 backend slice (not deferred).
- **Proposed/captured (2026-05-28):** Post-v1 queue includes workspace history, attachments, sharing edges, atom package shape, paywall behavior ("block new compute only"), wallet top-up, and admin graph view.
- **Strategic framing (2026-05-27):** Brokerage remains a GTM lane under broader place-graph strategy.

## 3) Open questions / unresolved conflicts

- What is the explicit v1 vs v1.1 boundary for sharing, atomization, and billing features (requirement text exists, milestone mapping still ambiguous)?
- How should wallet-style top-up and compute blocking map to canonical pricing/tier docs without conflicting policy language?
- Is "admin graph view" a brokerage-specific feature or a cross-product analytics surface?
- **Assumption:** References to post-v1 items in `75a_hauska_brief_extension.md` are operator-captured intent, not completed implementation.

## 4) Suggested canonical doc patches (exact file paths + sections)

- `P:/doc_repo/75a_hauska_brief_extension.md`  
  Section: `## Operator capture addendum (2026-05-28)`  
  Patch: add `status`, `owner`, `target phase` columns for each post-v1 requirement.

- `P:/doc_repo/75_hauska_brokerage_workflow_plan.md`  
  Sections: `## Product definition`, `## Pilot offer (30 days)`  
  Patch: split shipped backend scope vs queued sharing/atomization/paywall scope.

- `P:/doc_repo/14_pricing_framework.md`  
  Section: pricing/metering policy block  
  Patch: add brokerage-specific note for "existing read access retained; new compute blocked when quota exhausted."

- `P:/doc_repo/29_mcp_surface_tier_model.md`  
  Section: tier enforcement semantics  
  Patch: clarify endpoint-level metering behavior for brokerage routes.

- `P:/doc_repo/77_place_graph_strategy.md`  
  Section: segment/milestone mapping  
  Patch: add explicit dependency line from brokerage sharing graph telemetry to place-graph maturity milestones.

## 5) Confidence per claim (high/med/low)

- **C1:** High
- **C2:** High
- **C3:** High
- **C4:** High
- **C5:** Medium
- **C6:** Medium
---
id: 2026-05-28_claude_code_brokerage_v1_memory_rollup
title: Brokerage v1 memory rollup (last 3-5 days)
date: 2026-05-28
agent: claude_code
scope_window: 2026-05-24..2026-05-28
---

# Brokerage v1 memory rollup

Sources used:
- [V1 requirements capture](a563da55-e202-4f4a-8968-754ca2c820a4)
- [Memory rollup request](8a67373f-c551-4ed5-828a-1a4692356a46)

## 1) Claims (verifiable, chat-sourced)

- **C1 (2026-05-28):** Operator set sequencing to launch extension V1 first, then pick up added scope.  
  **Evidence:** "current sprint to get v1 launched then we will pick up on the rest." ([V1 requirements capture](a563da55-e202-4f4a-8968-754ca2c820a4))
- **C2 (2026-05-28):** Operator requested persistent property history/reopen and source-link retrieval in the extension.  
  **Evidence:** "see a list of recent properties... open said property... access a link back." ([V1 requirements capture](a563da55-e202-4f4a-8968-754ca2c820a4))
- **C3 (2026-05-28):** Operator requested property-level attachments and full-share payloads (research + files + notes).  
  **Evidence:** "add... links, images and pdfs and notes" plus "share this property with all the details... attachments." ([V1 requirements capture](a563da55-e202-4f4a-8968-754ca2c820a4))
- **C4 (2026-05-28):** Operator requested this as the start of project atomization (packaged research + sources).  
  **Evidence:** "this should be the start of the atomization... package the research and sources." ([V1 requirements capture](a563da55-e202-4f4a-8968-754ca2c820a4))
- **C5 (2026-05-28):** Operator requested paywall behavior that preserves existing project access while gating new research.  
  **Evidence:** "dont want them to be locked out of their projects... block them from doing more research." ([V1 requirements capture](a563da55-e202-4f4a-8968-754ca2c820a4))
- **C6 (2026-05-28):** Operator requested wallet-style metering with $5 auto-top-up increments.  
  **Evidence:** "add like 5$ and then... draft another 5 when that first 5 runs out." ([V1 requirements capture](a563da55-e202-4f4a-8968-754ca2c820a4))
- **C7 (2026-05-28):** Operator requested an admin geographic/share graph (blue dots + connecting lines) and flagged viral graph ideas from other chats.  
  **Evidence:** "map... little blue dots... thin blue line connecting it... thoughts about making it viral." ([V1 requirements capture](a563da55-e202-4f4a-8968-754ca2c820a4))
- **C8 (2026-05-28):** Operator requested auditable memory rollups from recent chats only, with confidence tags and explicit assumptions.  
  **Evidence:** "Include only verifiable items... Confidence per claim... Flag assumptions explicitly." ([Memory rollup request](8a67373f-c551-4ed5-828a-1a4692356a46))

## 2) Decisions proposed or made

- **Made (operator):** V1 launch-first sequencing (C1).
- **Proposed (operator):** Post-V1 scope bundle = workspace history, sharing, atomization, paywall/metering, viral/admin graph (C2-C7).
- **Proposed (assistant in-chat, verify before treating as final):** queue collaboration + atomization + paywall + graph phases after V1 launch; preserve read access under paywall; gate net-new compute.

## 3) Open questions / unresolved conflicts

- Is the post-V1 bundle formally accepted as a single roadmap phase set or split across separate dispatches?
- Is paywall/metering target strictly wallet-first ($5 auto-top-up) vs mixed subscription + wallet?
- What are the consent/privacy rules for the share/viral graph (explicit opt-in default, retention window, revocation behavior)?
- Where do `property-workspace` atoms live first: product-local schema vs `@hauska/atom-contract` extension?
- **Assumption:** "recent chats" coverage here is limited to transcripts currently accessible in this workspace; any unlogged chat is out of scope.

## 4) Suggested canonical doc patches (paths + sections)

- `P:/doc_repo/75a_hauska_brief_extension.md` -> **Operator capture addendum (2026-05-28)**  
  Add explicit acceptance checks for: reopen fidelity, attachment integrity, share payload completeness, and paywall read-vs-compute gating.
- `P:/doc_repo/75_hauska_brokerage_workflow_plan.md` -> **Phase 3d / Phase 3e**  
  Add risk controls: billing failure fallback, anti-abuse limits, and consent audit events for graph edges.
- `P:/doc_repo/14_pricing_framework.md` -> **Micro-metering / top-up policy section**  
  Clarify whether $5 auto-refill is sanctioned portfolio policy or TX-brokerage-only experiment.
- `P:/doc_repo/01a_atom_conventions.md` -> **Atom catalog table**  
  Add provisional entries (if approved): `property-workspace`, `brief-run`, `workspace-attachment`, `workspace-share-edge`.

## 5) Confidence per claim

| Claim | Confidence | Why |
|---|---|---|
| C1 | High | Direct operator quote with explicit sequence language |
| C2 | High | Direct feature requirement in user bullet list |
| C3 | High | Direct feature requirement in user bullet list |
| C4 | High | Direct operator statement naming atomization |
| C5 | High | Direct paywall behavior constraint |
| C6 | High | Direct wallet increment and auto-refill statement |
| C7 | High | Direct admin map/share-graph requirement + viral mention |
| C8 | High | Direct current-task instruction from operator |

