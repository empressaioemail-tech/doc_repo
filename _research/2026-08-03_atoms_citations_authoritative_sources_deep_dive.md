---
id: 2026-08-03_atoms_citations_authoritative_sources_deep_dive
title: Deep dive — atoms, citations, and authoritative data sources across the live system
date: 2026-08-03
status: active
owner: nick
agent: claude_code (planner + 3 sonnet readers, planner-verified live probes)
related: [43_cortex_qa_backlog, 90_operations/OPS-8_blocker_free_onboarding_model, 09_post_saas_substrate_thesis, 01a_atom_conventions, _inbox/2026-08-01_spine_health_audit_ledger]
---

# Atoms, citations, and authoritative sources — the live map

Trigger: operator observed the PE property chat answering a Bastrop SF-1 ADU/subdivision question with hard setback numbers but zero atom chips, claiming the SF-1 regulations were "not included in the current sources." This deep dive maps what is actually atomized, how citations actually work, and where the authoritative-source chain breaks. Three read-only Sonnet audits (hauska-engine, hauska-map PE, legacy-design-tools cortex path) plus planner live probes against prod. Every load-bearing claim below was either probed live by the planner or file:line-cited in the agent reports (session transcript).

## The headline

The data was never missing. The full adopted Bastrop BDC 2026 is atomized and retrievable, including 14.02.003 District Requirements (the SF-1 text), 14.02.008 Table of Permitted Uses (the ADU answer), 14.04.006 Accessory Uses, and the county subdivision regs (separate tenant). Planner-probed live: `/search?jurisdiction=bastrop_tx` returns them scored and snippeted. The observed failure was a SILENT AUTH OUTAGE plus three structural gaps in the citation architecture.

## Proximate cause (FIXED live 2026-08-03)

cortex-api held a 59-char `BRIEF_RETRIEVAL_API_KEY`; retrieval-api expected a 40-char key after its out-of-band `gcloud run deploy --source` redeploy. The cortex-to-retrieval `/search` call 401'd on every property-chat turn; the ldt retrieval path catches the SubstrateRetrievalError into `degradedReasons` and continues with ZERO atoms, no visible error (the recurrence of the key-rotation-on-source-deploy class, and precisely the fail-open masking the 2026-08-01 spine ledger flagged). With an empty numbered-sources block, the LLM either emits no markers or markers that resolve to nothing, and honestly reports the code as "not in current sources."

Fix applied by planner: secret version 2 (the 40-char key, sanity-probed 200 before write) on `BRIEF_RETRIEVAL_API_KEY` in legacy-design-tools-prod; cortex-api pinned to explicit secret version `2` (not `latest`, which is deploy-time-resolved); new revision `cortex-api-00292-cbb` smoke-tested via tag, traffic shifted to 100%, health 200. **OPERATOR-VERIFIED 2026-08-03: atom chips render live in PE chat post-fix.** The end-to-end cited-substrate chain (corpus → /search → chat → teal chips) is confirmed working in production.

## What IS atomized (live inventory)

| Family | Types | Scale / notes |
|---|---|---|
| Code corpus | code-section, code-edition, code-amendment, code-cross-reference, jurisdiction-corpus (code-definition declared, 0 instances) | retrieval snapshot: 29,977 atoms, 35 jurisdictions, 22,724 code-sections. bastrop_tx: 318 atoms, current edition BDC 2026 (100 sections, full zoning apparatus), superseded B3 edition retained |
| Property atoms (per warmed parcel) | zoning-fact, setback-rule, buildable-envelope, parcel-terrain-model | contract-shaped, engine-persisted; NOT in the atom registry machinery; served by parcel-keyed atom-chain, NOT searchable via /search |
| Road / boundary | road-node, property-boundary-edge | vendored from contract 1.11.0 (27c depth engine) |
| Cortex L-surface | response-task, sheet-content-extraction, attached-document, deliverable-letter, detail-callout-spec, product-spec-reference, deliverable-letter-render | tenant-private |
| Workspace | property-workspace, brief-run, workspace-attachment, workspace-share-edge | tenant-private |
| Document-derived | document-derived-claim, survey-record, utility-bill-record | caller-set accessPolicy |
| ICC model code | 4,825 code-sections | deep-link footing per ADR-019: bodyText is Hauska reasoning summary, verbatim licensed text never hosted |

All in ONE Postgres `atoms` table discriminated by `entity_type`, with `atom_links` edges (cites, derives-from, amends, supersedes and more).

## What is NOT atom-backed (the honest list)

- Setback VALUES come from hand-curated JSON tables (`bastrop-development-code.json` and 8 sibling files). The emitted setback-rule atom cites a code-section atomDid, but the citation is asserted by the curator, not derived from the code text at runtime.
- Zoning district ASSIGNMENT (which district a parcel is in) comes from the GIS zoning-stamp layer, minted into a zoning-fact atom after the fact.
- The PE inspect-card payload (`BakedFacetPayload` via `/api/spine/property-atoms/.../facets`) carries NO atom DIDs and no code refs for zoning, land use, or setbacks; the one citation-shaped field (`envelope.citationUrl`) is parsed then dropped before render.
- CAD-roll land-use fields and baked place-layer facets serve without atom provenance.

## The citation architecture (how a chip is born, and where it dies)

1. ldt `POST /api/brokerage/v1/research/chat` retrieves code atoms via substrate `/search` (8 per query; district-specific query fires when the district code reaches `areaContext`), numbers them into a Sources block, prompts the LLM.
2. Citations are a REGEX PARSE of `[n]` markers in the generated prose mapped back to `atoms[n-1]`. No structural which-atoms-grounded-this signal exists. presentationMode `consumer` (the schema default) instructs the model to emit NO markers, making consumer answers citationless by construction; PE hardcodes `pro` (LOCK ruling 2026-07-29), so PE should always get markers when atoms exist.
3. Confidence is `citations.length > 0 ? 0.75 : 0.5` (rules-fallback 0.4/0.1): a binary marker-survival proxy, not grounding strength. Violates commitment #2's spirit; a fully grounded consumer answer reports 0.5 forever.
4. The SUBJECT PARCEL CONSTRAINTS block (zoning label, setbacks, envelope numbers) is injected OUTSIDE the numbered atoms, so parcel facts are structurally uncitable even in pro mode. That is why the card-adjacent numbers appear in answers with no chip.
5. PE renders chips ONLY when the response carries resolvable refs (`citations`/`sources`/`inlineRefs` with a did or entityId); unmatched `[n]` renders as inert plain text (observed in the operator's second screenshot).

## The graph gap (the operator's instinct, confirmed)

`zoning-fact` carries NO `sourceCodeAtomRef`. "This parcel is SF-1" and "here is the SF-1 district text (14.02.003)" are disconnected in the atom graph; only setback-rule links to a code atom, and only for setback values. Even a perfect chat pipeline cannot WALK from a parcel's zoning to its district regulations today; it can only text-search for them. The chip the operator expected on "SF-1" has no edge to hang on.

## Additional serve gaps found

- Edition mixing: `/search` returned a superseded B3-edition atom in ADU results, and the result shape (`atomDid, entityId, entityType, jurisdictionTenant, score, sectionNumber, snippet`) carries no edition/superseded flag a consumer could filter on.
- County subdivision regs live in a separate `bastrop_county_tx` tenant (platform-internal, 17 atoms): a city-scoped search structurally cannot answer subdivision questions even when wired, unless the route also queries the county tenant.
- PE has TWO citation systems: teal atom chips (chat) and blue footnote appendix (brief panel) citing baked-snapshot provenance strings, not atom DIDs. Unreconciled visual and data languages.
- /search auth fail is silent at the caller (degradedReasons only). The spine-ledger fail-closed caller-contract lane covers this; this incident is its second proof.

## Fix list (ranked)

1. DONE 2026-08-03: key desync fixed, cortex-api 00292-cbb serving, secret pinned to explicit version.
2. Fail-LOUD on substrate 401/5xx in the ldt retrieval path: a degraded retrieval must surface in the response (and alert), never silently produce an uncited answer. (Spine-ledger lane; now twice-proven.)
3. Add `sourceCodeAtomRef` (district-requirements atom + permitted-use-table atom) to zoning-fact at mint: the missing graph edge. Then card chips and chat grounding can walk the graph instead of text-searching.
4. Carry atom DIDs in the baked-facets payload and render provenance chips on the inspect card (zoning, setbacks, envelope). Today the card drops provenance at the payload boundary.
5. Make parcel facts citable: feed the subject-constraints block as numbered sources (or emit atom-chain refs directly; PE already fetches atom-chain for its accordion cards).
6. Citation determinism: a structured atoms-used signal alongside the prose parse; derive confidence from grounding (retrieval hit strength + atom confidence), not marker survival.
7. Edition filter: /search excludes superseded editions by default (or carries effective flags); the BDC/B3 mix is a wrong-answer risk on any date-sensitive question.
8. Route subdivision questions to the county tenant where the subject sits in a city inside that county (server-side, accessPolicy respected).
9. RULED 2026-08-03 (operator accepted planner recommendation): consumer mode keeps markerless prose but ALWAYS carries the grounding-derived structured sources array; confidence derives from grounding, retiring the 0.75/0.5 marker proxy. Implementation folds into fix 6. Decision record: [`_decisions/2026-08-03_consumer_mode_citation_posture.md`](../_decisions/2026-08-03_consumer_mode_citation_posture.md).

## Cross-checks that held

- PE hardcoding `pro` (map reader) resolved the cortex reader's open question; consumer-default was ruled OUT as the screenshot mechanism.
- Corpus completeness (engine reader, from committed snapshot) matched planner live probes atom-for-atom on the SF-1/ADU/subdivision queries.
- The zero-atom hypothesis predicted exactly both observed renders (no markers; inert markers) before the key desync was found, then the 401 probe confirmed it.
