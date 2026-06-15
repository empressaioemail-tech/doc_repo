---
id: 2026-06-11_cc-agent-C_chat_web_first_code_and_zoning_grounding
title: Dispatch — wire the side-chat to web-first ground code (extend #172) + zoning (net-new), honesty-gated
date: 2026-06-11
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: FIRE-READY — premortem YELLOW cleared with the honest-confidence + spine-capability guardrails baked below
related: [61_property_intelligence_master_plan, _research/2026-06-11_engine_robustness_audit, _dispatches/2026-06-11_cc-agent-C_C1_findings_persist_and_jurisdiction_keysynth, 08_tiered_access_model, 03a_positioning_framework]
---

# Wire the side-chat for web-first code + zoning grounding

> Driven by a real drafting-client feasibility study (146 S. Fredericksburg St., San Marcos TX — duplex feasibility). The side-chat answered from model-knowledge-only and honestly flagged "San Marcos not in the corpus." It already calls `retrieveAtomsForQuestion` (`routes/chat.ts:656`) but lacks the #172 jurisdiction-key synthesis and the web-first grounding supplement, so unwarmed jurisdictions retrieve nothing. This wires the chat to (A) web-first ground building code (reuse the plan-review machinery) and (B) web-first ground zoning (net-new). **Premortem cleared YELLOW** with hard guardrails (below); the load-bearing condition is honest confidence on zoning.

You are **cc-agent-C**, single owner of `P:\legacy-design-tools`. Worktree off `origin/main` (carries C1-C3 #169-#179). Branch prefix `cortex/`. Model: Grok Build 0.1; escalate on failure after retry. HR-8 artifacts.

## Guardrails (premortem load-bearing — non-negotiable)

1. **Confidence is earned, not asserted (commitment #2).** Zoning grounding has ZERO calibration. Every zoning answer MUST carry `verificationState: unverified-web-source`, an honest asserted-baseline confidence (never a bare number presented as earned), and the explicit "confirm against the jurisdiction's adopted ordinance / amendments before relying on this" gate. Same for code grounded web-first on an unwarmed jurisdiction. Keep the honest posture the chat already shows; attach citations to it. NEVER present web-searched zoning as authoritative.
2. **Quality gate (commitment #7 / #1).** Chat output must emit the provenance contract: citations (code reasoning-atom ids + zoning source deeplinks), verification state, confidence (honest), timestamp. Chat is contractless today (audit) — this fixes that for the grounded answers. Align with the canonical envelope shape where practical (the audit's `EngineEnvelope` is the target; at minimum carry lineage + sources + verificationState + confidence-kind + timestamp).
3. **Spine capability, not a chat-only bypass (commitments #4/#5).** Build zoning grounding as a reusable grounding capability that deposits **zoning reasoning atoms** into the catalog (mirroring code reasoning atoms — multi-link, edition/source, verification state, arrow-two seam), so plan-review/MCP can reuse it and it feeds the Hauska spine. Do NOT strand it as a one-off web-search inside the chat route. No verbatim ordinance-text storage (deeplink/reasoning only), same boundary as code.

## Scope

### Part A — code grounding on chat (extend #172, moderate)
In `routes/chat.ts`, replace the bare `retrieveAtomsForQuestion` path with the plan-review grounding chain: resolve the jurisdiction via `keyFromEngagementOrSynthesize` (the #172 synthesizer) so unwarmed cities resolve a key, then run `supplementCodeSectionsWithReasoningGrounding` (web-first) when the corpus returns thin/empty. Result: chat code answers ground the same way plan-review does, for any jurisdiction. Carry the citations + verification state into the chat response per guardrail 2.

### Part B — zoning grounding on chat (net-new)
Add a zoning grounding path: for zoning questions (permitted uses, setbacks, lot coverage, density/units, parking, height, overlay districts), web-first retrieve the jurisdiction's adopted zoning ordinance / UDC from authoritative sources (the jurisdiction's Municode/eCode/city site — reuse the web-first allowlist + edition-verification pattern from the code path), reason over it, and answer with deeplinked citations + `unverified-web-source` + the confirm-against-ordinance gate. Deposit zoning reasoning atoms per guardrail 3. Honesty: zoning amendments/overlays are jurisdiction-specific and web sources can be stale — the gate is mandatory.

### Part C — recon + report the honest scope
Before building Part B, recon the web-first machinery you are reusing (allowlist, edition verification, reasoning-atom deposit) and report what zoning sources are reliably reachable vs not (e.g., eCode360 blocks programmatic access — note where zoning will be thin). Do not overclaim coverage.

## Acceptance

- Chat on San Marcos (146 S. Fredericksburg / 613 Sturgeon) returns: (a) **code** answers grounded web-first with reasoning-atom citations + verification state (not model-knowledge-only); (b) **zoning** answers (duplex permitted? setbacks? density? parking?) grounded from the adopted San Marcos UDC with deeplinked citations, `unverified-web-source`, and the confirm-against-ordinance gate. Paste a verbatim chat exchange showing the citations + the honest gate.
- Zoning reasoning atoms deposited (catalog/spine), not chat-only. No verbatim ordinance text stored.
- Chat output carries the provenance contract (lineage + sources + verificationState + honest confidence + timestamp).
- No bare/asserted-as-earned confidence on zoning. Honesty gate present on every web-sourced answer.
- Typecheck + tests green; PR held for operator merge; HR-8 artifacts.

## Out of scope / honesty for 61

Zoning/CC&R cross-layer remains "do not market as a finished, verified product" (61) — this builds the honest web-first grounding, not a verified zoning compliance engine. Cross-layer reconciliation (zoning x code x CC&R) is a separate future build. Note in the report where zoning grounding is thin per jurisdiction.

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-11_legacy-design-tools_cc-agent-C_chat_code_zoning_grounding_fix.md`: the recon (reusable machinery + zoning source reachability), fix locations (file:line), the verbatim San Marcos chat exchange (code + zoning, with citations + honesty gate), the zoning-reasoning-atom deposit proof, PR URL + SHA, blockers.
