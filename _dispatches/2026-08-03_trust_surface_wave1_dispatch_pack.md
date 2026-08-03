---
id: 2026-08-03_trust_surface_wave1_dispatch_pack
title: Dispatch pack — trust-surface wave 1 (D1 ldt, D2 engine, D3 map) + D4 factory foundation queued
date: 2026-08-03
status: closed (ALL EXECUTED 2026-08-03: 8 PRs merged — ldt #376/#377/#378, map #146, engine #214/#215/#216/#217 — 3 services deployed + live-verified; see _sessions/2026-08-03_trust_surface_wave1_execution_claude_code.md)
owner: nick
agent: claude_code planner (executors: 3 sonnet subagents wave 1; D4 wave 2)
related: [_research/2026-08-03_atoms_citations_authoritative_sources_deep_dive, 90_operations/OPS-8_blocker_free_onboarding_model, _decisions/2026-08-03_cert_scope_annotation_ruling, 43_cortex_qa_backlog]
---

# Trust-surface wave 1 dispatch pack

Adversarially reviewed before dispatch (reviewer verdicts: D1 NOT-READY as first drafted, rewritten; D2/D3/D4 READY-WITH-EDITS, edits applied). Planner dispatched the wave-1 executors directly as Claude subagents; this doc records scopes, contracts, and sequencing. Planner reviews every PR diff, requires green CI, merges, deploys, and verifies live. Verification never delegated.

## Reviewer corrections applied (what changed from the first draft)

1. D1 fail-loud is an EXTENSION of the existing `substrateStatus`/`degradedReasons` response mechanism (brokerageBrief.ts ~1338-1427), not a new field. The uncovered case is zero-atoms-while-substrate-configured; thrown SubstrateRetrievalError is already surfaced.
2. D1 provenance re-targeted from the facets route (zero-compute anonymous bake route, must not grow live calls) to the authenticated atom-chain envelope route (brokeragePlaceBuildableEnvelope.ts, tryServeAtomChainEnvelope).
3. NEW cross-repo dependency named: the atom-chain wire carries no atomDids today. D2 gains PR-3 (wire enrichment: atomDid + sourceCitation + sourceCodeAtomRef surfaced per slot). D1 PR-2/PR-3 and D3 degrade gracefully until it lands and retrieval-api redeploys.
4. D2 district-to-code-section mapping is NEW config infrastructure (no existing map anywhere in the repo), seeded for bastrop_tx only; DIDs verified present in the corpus snapshot before hardcoding.
5. D2 edition filtering requires a per-result edition join; strategy pinned: batch-resolve editions once per distinct jurisdictionTenant, never N+1.
6. D3 path corrected: `apps/property-explorer/src/lib/baked-facets.ts` (not src/browse/); CI pinned to property-explorer-ci.yml.
7. D4: the TODO(onboard-fips) lives on jurisdiction-registry.ts:29-30; parcel-cohort-loader.ts hard-assumes cityFilter (non-null assertion, buildWhereClause). D4 dispatch will paste the OPS-8 8-check table and the cert-with-scope-annotation ruling verbatim. D2-before-D4 is a stability/review-bandwidth choice (file sets are disjoint), stated as such.

## The pinned cross-repo contract (identical in D1-PR3, D2-PR3, D3)

```
provenanceRefs?: {
  zoning?: { atomDid: string },
  setback?: { atomDid: string },
  envelope?: { atomDid: string },
  codeSections?: Array<{ atomDid: string, sectionNumber: string, title?: string }>
}
```

Additive and optional at every layer; absence renders exactly today's behavior.

## Wave 1 scopes

**D1 — legacy-design-tools (3 PRs, one agent, PR-1 then PR-2 rebases; PR-3 independent).** PR-1 `fix/research-chat-degrade-zero-atoms`: extend the existing degrade mechanism to the zero-atoms case + one error-level structured log on any degrade. PR-2 `feat/research-chat-citable-parcel-facts`: subject-parcel facts become a numbered source entry (DID-less until upstream lands; graceful), and the structured sources array attaches on every response regardless of presentationMode. PR-3 `feat/envelope-provenance-refs`: provenanceRefs on the atom-chain envelope route response, tolerant of DID-less upstream. CI gate: pr-checks workflow; local api-server baseline is known-red without CI env, so verify by baseline-compare and CI-authoritative.

**D2 — hauska-engine (3 PRs, one agent, land 1 then 2 then 3 with rebases).** PR-1 `feat/zoning-fact-code-refs`: new district-to-code-section map module (bastrop_tx seed: districts to 14-02-003 district requirements + 14-02-008 permitted-use table) + optional sourceCodeAtomRef/codeSectionRefs on zoning-fact mint. PR-2 `feat/search-edition-honesty`: /search default-excludes superseded editions (includeSuperseded=true opt-in), result rows gain editionId + isCurrentEdition, batch edition-resolve join. PR-3 `feat/atom-chain-wire-dids`: atom-chain response surfaces atomDid + sourceCitation + sourceCodeAtomRef per slot. CI gate: ci.yml.

**D3 — hauska-map (1 PR).** `feat/inspect-card-provenance-chips`: InspectCard renders teal provenance chips (Zoning / Setbacks / Buildable rows) off provenanceRefs when the envelope response carries it, opening atom detail via the existing /api/spine/retrieval/atoms/:did pattern; chip primitives shared cleanly rather than a browse-to-workbench reach-in; stub-tested with and without refs; no deploy (planner deploys). CI gate: property-explorer-ci.yml.

## Wave 2 (queued, dispatches after D2 merges)

**D4 — hauska-engine factory foundation.** Registry rail becomes optional/discriminated (unzoned/no-city-filter representable) + Bastrop-County-unincorporated and Elgin rows + cohort-loader generalization (kill the non-null assertion) + onboard-preflight(fips) implementing the 8 OPS-8 checks producing PASS/decline JSON + ledger events + scopeAnnotations[] on cert artifacts per the 2026-08-03 ruling. Operate-not-rebuild: drives block13-cert-grade.mjs and the proven warm path, no parallel wrappers. Registry file re-verified against live main at dispatch time (frozen 2026-08-02, drift risk flagged by reviewer).

## Deploy and verify (planner-owned, after merges)

retrieval-api redeploy (picks up D2-PR3 wire + the #213 parity), cortex-api canary (D1), PE Vercel deploy (D3). Live verification: a warmed Bastrop parcel's card shows chips resolving to real atoms; a degraded-substrate chat turn visibly reports it; /search no longer returns B3-edition atoms by default.

## Deferred (named)

Confidence-from-grounding, county-tenant subdivision routing, CC gaps-column console, consumer-mode chip UX (operator ruling owed).
