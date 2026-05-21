---
id: 2026-05-21_e1_layered_substrate_architecture_cc-agent-E
title: Session — Lane E Phase E1 break-point (ADR-019 layered-substrate architecture complete)
date: 2026-05-21
agent: cc-agent-E
repo: hauska-engine
session_type: engineering
rolled_up: false
related: [_dispatches/2026-05-21_cc-agent-E_adr019_pipeline_and_sync5, 80_adrs/adr_019_layered_code_substrate, 49_code_ingestion_pipeline, 2026-05-21_e0_retrieval_api_deploy_cc-agent-E]
---

# Lane E Phase E1 — layered-substrate architecture complete

## Status

E1 break-point. The ADR-019 layered code substrate is built in the atom
layer and the retrieval layer: the Layer 2 overlay atom shape, the
effective-rule composition engine, and the Layer 1 deep-link footing
field all merged to `hauska-engine` main, each its own conformance-
tested PR. The remaining E1 work is the Layer 1 model-code base ingest,
the corpus-volume phase.

## The five ADR-019 mechanism decisions (decide-and-document)

ADR-019 §Open decisions left five implementation-mechanism calls to
cc-agent-E. Operator greenlit them 2026-05-21 as within decide-and-
document authority; logged here.

1. **Jurisdictional amendment representation.** Extend the existing
   `code-amendment` atom type with an `amendmentScope` discriminant
   (`temporal` | `jurisdictional-overlay`) rather than introduce a
   distinct atom type. A jurisdictional overlay arm carries
   `baseEditionId` and an `overlayOperation`. This keeps the
   entity-type-enum surface (storage schema, retrieval-api zod enum,
   registry, search filters) unchanged, and a city adoption ordinance
   already carries an ordinanceId / effectiveDate / authority exactly
   as a temporal amendment does.

2. **Edition ingest order.** Recent IRC, IBC, IECC first, the editions
   Texas jurisdictions most commonly adopt, then IFC / IMC / IPC /
   IFGC, then the NEC; the most recent two to three cycles per code.

3. **Deep-link target granularity.** Section-level. ICC's free viewer
   exposes section-addressable anchors; section-level matches the
   `code-section` atom grain and the plan-review citation use case.

4. **Effective-rule composition.** Query-time merge of base plus
   overlay, not a materialized per-jurisdiction effective-section atom.
   No staleness, no per-jurisdiction atom-count multiplication;
   composition is a pure deterministic function over stored atoms. The
   ADR-019 reversal criterion (materialize if retrieval finds the merge
   unworkable) stands.

5. **Deep-link health and drift detection.** Folded into B.5
   drift-detection alongside the existing source-drift check. The
   Bastrop UDC Municode `clientId 1169` drift surfaced in E0 folds in
   here too.

None turned out to be a structural fork; all were mechanism choices.

## What was done

Three focused PRs, each conformance-test-first, self-merged on green CI.

**E1.A — `code-amendment` jurisdictional-overlay extension (PR #17).**
`CodeAmendmentAtomInstance` becomes a discriminated union on
`amendmentScope`. The `temporal` arm is the unchanged Bump 1 shape; the
`jurisdictional-overlay` arm adds `baseEditionId` and `overlayOperation`
(`modify` | `replace` | `add` | `delete`). `CODE_AMENDMENT_SCHEMA` Zod
discriminated union, `isJurisdictionalOverlay` / `isTemporalAmendment`
guards, scope-aware registry contextSummary. 18-test conformance suite.

**E1.B — effective-rule composition engine (PR #18).**
`composeEffectiveSection` is the pure algorithm: overlays apply in
effective-date order, the latest operation drives the resolution
(`base-only` | `modified` | `replaced` | `added` | `deleted`), and a
`baseTextGoverns` flag tells a consumer whether the deep-linked Layer 1
verbatim text is still authoritative. `resolveEffectiveRule` and
`HybridRetrieval.resolveEffectiveRule` are the storage-backed query
path. `StoragePort.getJurisdictionalOverlays` is the supporting query.
14-test conformance suite.

**E1.C.1 — `code-section` deep-link footing field (PR #19).**
Optional `verbatimTextDeepLink` on `code-section`. When set, the
section is a Layer 1 model-code base section whose verbatim normative
text is deep-linked to the publisher's free viewer, not hosted, and
`bodyText` is the reasoning layer. Absent for hosted Layer 2 / Layer 3
sections, so every existing section atom keeps its meaning. The
never-host-verbatim-model-code-text constraint is now encoded in the
atom shape itself. `CODE_SECTION_SCHEMA` Zod schema,
`isDeepLinkFootingSection` guard. 10-test conformance suite.

`jurisdiction-corpus.adoptedEditionIds` already supports referencing
shared Layer 1 editions alongside a jurisdiction's own editions, so no
shape change was needed there: a jurisdiction-corpus atom listing
`["icc/irc-2021", "hutto_tx/hutto-udc-march-2024"]` is the design.

## Test posture

`pnpm typecheck` clean and full `pnpm test` green at each merge. End
state: atoms 140, retrieval 14, storage 9, corpus 41, migrate-legacy-
codes 27, retrieval-api 12.

## Next phase — Layer 1 model-code base ingest

The atom architecture is complete; what remains is the corpus-volume
phase: a Layer 1 model-code adapter and the edition-batch ingest of the
ICC I-Codes and the NEC on the interim deep-link footing.

One genuine open question to resolve on contact, not a structural fork:
the structural source for the I-Codes. The deep-link footing means the
ingest does not scrape verbatim text, but it still needs each edition's
section hierarchy, numbers, titles, cross-references, and section-level
deep-link anchors. ICC's free viewer is a single-page app; the ingest
needs a reliable read of its table-of-contents structure (or an
equivalent structural manifest). This is the first task of the next
E1 phase and is mechanism-level, decidable by cc-agent-E.

The retrieval-api gains an effective-rule endpoint once there is Layer
1 corpus to resolve against; deferred to that phase so it ships with
data behind it.

## Gated item — hauska-prod redeploy

The operator's instruction to redeploy the retrieval API into a
`hauska-prod` GCP project, re-hand the URL and key to cc-agent-M, and
tear down the interim `legacy-design-tools-prod` deploy is gated on
`hauska-prod` existing. It does not yet (the GCP projects are
`empressa-trading-prod`, `legacy-design-tools-prod`,
`smartcity-os-prod`). The retrieval API stays on the interim
`legacy-design-tools-prod` deploy until then; the redeploy is a clean
`gcloud run deploy` plus a Secrets.txt re-hand plus a service teardown
when the project appears.
