---
id: 2026-06-09_cc-agent-M_gate_citation_lineage
title: Dispatch — gate carries citation lineage (findings-fetch + override threading) so arrow-two deposits through the gate
date: 2026-06-09
agent: cc-agent-M (+ cc-agent-C cortex-side companion)
repo: hauska-mcp-server (+ legacy-design-tools)
kind: dispatch
status: MERGED - gate half #30 (codex_findings_fetch + override citation threading + tenant scoping + rail-quiet; 270/270) and cortex companion #159 (override route preserves citations; ledger-deposit proven overrideCount:1 not zero). The arrow-two deposit loop now closes through the MCP gate. Scope item 3 (briefing-emit) done #28. Remaining for 56 step 5: the gate-front seam (54 step 2).
related: [57_national_code_warming_sprint, 56_engine_extraction_sprint, _decisions/2026-06-09_codewarm_arrow_two_combined, _inbox/2026-06-09_legacy-design-tools_cc-agent-C_lineage_completeness_audit, _dispatches/2026-06-09_cc-agent-C_atomid_namespace_normalization, 54_tenant_leg_sprint, 80_adrs/adr_005_multitenancy, 50_hauska_mcp_server, 20_agent_operating_rules]
---

# Gate carries citation lineage (P0a + P2)

> The lineage audit ([`_inbox/2026-06-09_legacy-design-tools_cc-agent-C_lineage_completeness_audit.md`](../_inbox/2026-06-09_legacy-design-tools_cc-agent-C_lineage_completeness_audit.md)) found the MCP gate is arrow-one-only for the Codex finding path: `codex_finding_generation` returns a `generationId` with no citations, there is no `fetchSubmissionFindings` through the gate, and `codex_override_write` drops citation lineage on the revised text. The server-side ledger join still closes on the HTTP path, but once 56 step 5 cuts consumers to the gate, an agent (or gate-routed reviewer) cannot complete the arrow-two loop — the flywheel goes silent on the gate path. This dispatch closes the gate-deposit loop so the engine extraction can route adjudication through the gate without breaking calibration.

> **HELD.** P0b is merged (#158): citations are canonical in the stored finding rows, so the gate returns them verbatim and does not normalize anything (the earlier "gate imports the key function" requirement was withdrawn). Two gates remain: (1) **sprint-54 step-1 gate tenant resolution** must land (`src/auth.ts` `AuthContext` carries product + tier only today — no tenant field, so the tenant-scoping acceptance fixture cannot be built); (2) this must precede 56 step 5. **Independent exception:** scope item 3 below (`cortex_briefing_emit` provenance `brief-run` fix, `tools.ts:1313`) has no dependency and may land standalone now. Verify identifiers against live source before firing.

## Owners and clones

cc-agent-M owns `hauska-mcp-server`; the cortex-side override-route piece is a cc-agent-C companion in `legacy-design-tools`. One agent per clone; coordinate the two pieces, do not cross clones in one run.

## Model (HR-12)

Grok Build 0.1 default; escalate to Claude only on failure after retry, log it.

## Scope

**cc-agent-M (hauska-mcp-server):**

1. **`codex_findings_fetch` (P0a).** Add a tool (or extend the generation poll) wrapping `GET /api/submissions/:id/findings` + the status endpoint; return `data.findings[].citations` with the atom ids **as stored** (already canonical post-P0b #158 — return verbatim, do not re-normalize), plus per-citation `envelope.atoms[]` enumerating cited code-section DIDs (not the row-scoped synthetic `legacy:{kind}:{rowId}`); `reasoning:`/`websearch:` ids pass through as-is. `legacy-client.ts` gains `fetchSubmissionFindings` / `getFindingGenerationStatus`.
2. **`codex_override_write` citation threading (P2).** The override body carries and validates `citations[]`; the gate passes them through to the cortex-api override route so an override-via-gate does not strip lineage.
3. **`cortex_briefing_emit` provenance fix. DONE — landed standalone 2026-06-09 (PR #28, `62c2d65`).** `brief-run` added to the `CodexProvenanceParams.atomKind` union; `cortex_briefing_emit` now tags `brief-run`. Do not redo; this item is closed.
4. **Tenant scoping (load-bearing, premortem condition).** `codex_findings_fetch` MUST enforce the gate's tenant partition (ADR-005 Layer A, now live per #29): scope by `req.hauska.jurisdiction_tenant` (with the `platform_internal` Hauska bypass), reusing the `access-policy.ts` `filterByAccessPolicy` / `canReadAccessTarget` helpers from #29 rather than re-implementing. A caller only ever receives findings within its resolved tenant; never wrap `GET findings` in a way that can return cross-tenant findings. This is an acceptance gate, not a nicety.
5. **Rail-quiet (I7).** Atom-id lineage is present in outputs; the calibration grade is NOT. Confirm no grade leaks into the new tool output schemas.

**cc-agent-C (legacy-design-tools companion):**

6. **Override route preserves citations (P2, server side).** The cortex-api override route (`findings.ts` override path, ~1612) preserves/validates `citations[]` on the revised finding text, same as the manual-create path (~1434), so an override never produces an adjudicated finding with zero cited atoms. This is the server-side half of P2 and is what actually prevents ledger starvation.

Out of scope: Phase 3 calibration computation (separate, migration 0037); the briefing-source non-deposit decision (operator call, tracked in 57); pulling the physical engine lift forward.

## Acceptance criteria (the closure tests)

- **Generation-persists-citations (the assumption, now proven):** an agent calls `codex_finding_generation` then `codex_findings_fetch` through the gate and receives findings WITH `citations[].atomId`. This demonstrates the server-side job persisted citations, not just that the HTTP path has them.
- **Override-via-gate preserves lineage:** an override through `codex_override_write` yields a revised finding whose `citations[]` survive; the adjudication ledger fans to those atoms (no starvation).
- **Key-space consistency:** ids returned through the gate normalize (via the P0b function) to the same overlay key as the HTTP path; a fixture proves a gate-fetched citation and an HTTP citation for the same atom resolve identically.
- **Tenant scoping:** a two-tenant fixture proves `codex_findings_fetch` returns only the caller-tenant's findings; a cross-tenant fetch attempt is denied.
- **Rail-quiet:** calibration grade absent from the new tool outputs; atom-id lineage present.
- Existing mcp + cortex-api suites green plus the new closure tests. PRs held for operator merge; branches + SHAs reported.

## Reporting

At break-point write to `P:\doc_repo\_inbox\` as `2026-06-09_hauska-mcp-server_cc-agent-M_gate_citation_lineage.md`: the new tool + legacy-client methods, the override-threading change (both repos), the four closure-test outputs (generation-persists, override-preserves, key-space-consistency, tenant-scoping), PR URLs + branch SHAs, blockers verbatim.
