---
id: 2026-08-03_trust_surface_wave1_execution
title: Session — Trust-surface wave 1 + factory foundation: 8 PRs merged, 3 services deployed, chain verified live
date: 2026-08-03
status: closed
owner: nick
agent: claude_code (planner + 5 sonnet executors + 1 adversarial reviewer)
related: [_dispatches/2026-08-03_trust_surface_wave1_dispatch_pack, _research/2026-08-03_atoms_citations_authoritative_sources_deep_dive, 90_operations/OPS-8_blocker_free_onboarding_model, _decisions/2026-08-03_cert_scope_annotation_ruling]
---

# Trust-surface wave 1 + factory foundation execution

Operator greenlit running the deep-dive fix list plus the factory foundation as planner-orchestrated dispatches, with an adversarial review gate before dispatch. Everything shipped, merged on green CI, deployed, and live-verified in one arc.

## Shipped and live

Eight PRs, all planner-reviewed and merged on green CI:

- legacy-design-tools #376 (fail-loud zero-atom retrieval degrade, extends the existing substrateStatus/degradedReasons mechanism), #377 (subject-parcel facts become numbered citable sources; the "cite the source with no numbered target" prompt bug fixed), #378 (provenanceRefs on the atom-chain envelope route, pinned contract, omit-on-absence).
- hauska-map #146 (InspectCard provenance chips both data paths, shared atom-chip module extracted, 921 tests).
- hauska-engine #214 (district-to-code-section map, new config surface; zoning-fact gains sourceCodeAtomRef + codeSectionRefs at mint), #215 (/search edition honesty: superseded editions excluded by default, editionId + isCurrentEdition on results, batch join no N+1), #216 (atom-chain wire DIDs on all three slots via withGuaranteedAtomDid), #217 (onboard-fips foundation: parcelFilter discriminated union incl. no-filter/unzoned, zoningRegime field, Bastrop-County-unincorporated + Elgin pre-flight-pending rows, rowId keying, onboard-preflight module + CLI with all 8 OPS-8 checks and defectClass-grouped ledger events, scopeAnnotations wired into block13-cert-grade behind an optional flag — byte-identical default output).

Deploys (planner-owned, canary-smoked, traffic-shifted, live-verified): retrieval-api 00034-gmd (edition filter live: the ADU query that returned a superseded B3 atom in the morning probe now returns zero B3; atom-chain DIDs verified on all three slots of a normal warmed parcel; RETRIEVAL_API_KEY carried over intact), cortex-api 00466-yin (workflow canary; secret pin reverted to latest by the workflow exactly per the standing trap memory — benign because latest resolves to the correct v2 key), PE index-CFjRUvVy.js (provenanceRefs + atom-chip markers verified in the served bundle).

## Process record (for the fleet lessons ledger)

The pre-dispatch adversarial review earned its cost: it killed D1 as first drafted (fail-loud field half-existed; provenance targeted a zero-compute bake route; and the atom-chain wire carried no DIDs — an unstated cross-repo dependency that became engine PR #216). Executor-layer stops caught two more false premises (D3: fetchBuildableEnvelope lives in buildable-envelope.js, two mutually exclusive card data paths; D1-PR2b: consumer sources were never conditionally stripped — emergent-empty, structural fix stays deferred item 6). Fleet friction, both now in memory: one executor refused a valid dispatch (inherited CLAUDE.md, could not see the operator greenlight; fixed by a fresh agent with authorization context baked in), another chain-delegated two levels deep (supervised the deepest worker to completion instead of re-dispatching; all three PRs landed clean).

## Carried

- Code-section chips (zoning to 14.02.003/14.02.008) light up after the next Bastrop re-warm re-mints zoning facts with the new refs; rides with the D4-era factory work, not a special run.
- Parcel-facts chat source uses parcelNodeId as its ref id until ldt maps the real chain DIDs (post-#216 refinement); chip tap lands in the designed "record unavailable" honest fallback meanwhile.
- Preflight geometry-parity, serve-path, and cost-sample probes are dependency-injected but intentionally unwired in the CLI (need infra beyond the registry row); wiring them is D5-scope.
- Deferred (named): confidence-from-grounding, county-tenant subdivision routing, CC gaps-column console, consumer-mode chip UX (operator ruling owed).
- Nit for D5: block13-cert-grade's preflight-row lookup should use loadJurisdictionRegistryRowById instead of scanning module exports.
- Operator visual check owed: teal chips on a warmed Bastrop parcel card (PE deployed; hard refresh).
