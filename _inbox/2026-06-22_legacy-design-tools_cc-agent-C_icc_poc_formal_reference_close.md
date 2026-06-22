---
id: 2026-06-22_legacy-design-tools_cc-agent-C_icc_poc_formal_reference_close
title: cc-agent-C — ICC PoC formal reference section + plan-review module formalization
date: 2026-06-22
agent: cc-agent-C
repo: legacy-design-tools
dispatch: ICC PoC demo — WS-B (formal reference, criterion 1) + WS-C (reusable plan-review module)
status: close
commit: fde7a2a7
mirrored_by: planner (cc-agent-C committed to product repo; mirrored to doc_repo by planner)
---

# Close — ICC PoC formal reference + plan-review module formalization (WS-B + WS-C)

Landed as commit `fde7a2a7` in legacy-design-tools. Adds the formal reference section (highest-scrutiny criterion 1) and formalizes `@workspace/finding-engine` into the reusable, surface-independent plan-review module. No ICC content required; built against existing atoms.

WS-B — formal reference (criterion 1):
- `lib/finding-engine/src/references.ts`: `buildDeduplicatedReferences` mints reference rows ONLY from atoms present in the caller-supplied `codeSections` allow-list (the gate-retrieved set) — a finding can only cite a section that was actually retrieved (anti-hallucination seam). `reconcileReferencesWithFindings` cross-checks inline `[[CODE:atomId]]` tokens against the minted bibliography (orphaned tokens / uncited references).
- `lib/finding-engine/src/formalReferenceRenderer.ts`: renders section identifier + title + edition per cited atom, never the section body (layer-in-between). The identifier string format is a render parameter (`SectionIdentifierFormat`) because ICC has not confirmed the citation grammar — resolves on open question #2 without reworking the pipeline.

WS-C — module formalization (the reusable artifact):
- Inputs gain explicit applicable ICC titles + editions (`iccEditions.ts`, `parseApplicableIccEditions`, `ApplicableIccEdition`/`IccCodeTitle` types). Outputs gain `references[]` and per-query usage events (`RetrievalUsageEvent`, `buildRetrievalUsageEvent`). Gate-consumption path standardized (`codeRetrieval.ts`, `resolveCodeRetrievalMode`/`isGateCodeRetrievalMode`). Provenance wired through the findings route (`artifacts/api-server/src/routes/findings.ts`).
- Module surface exported cleanly from `lib/finding-engine/src/index.ts`, so the two plan-review shells (municipal IPMC, B2B IBC) and the Brief consume it unchanged. Reasoning and calibration stay out of the ICC-content partition (derivative-works separation).

Verification (planner ran, 2026-06-22): `vitest run` on `references.test.ts`, `formalReferenceRenderer.test.ts`, `iccEditions.test.ts`, `engine.test.ts` — 4 files, 26 tests passed.

Unblocks: the two plan-review surface shells (municipal IPMC, B2B IBC over `artifacts/plan-review`) and the Brief surfacing (hauska-brief-extension), which consume this module + the formal-reference renderer. Dispatches follow.
