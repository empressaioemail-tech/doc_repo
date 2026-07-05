---
id: draft_certification_scaffold
title: Hauska-certified — certification program scaffold
status: draft
last_updated: 2026-07-05
applies_to: portfolio
owner: planner
related: [49_code_ingestion_pipeline, 25a_atom_principle_llm_economics, 08_tiered_access_model, 14_pricing_framework, 09_post_saas_substrate_thesis, 04a_arrow_two_calibration_capture, _decisions/2026-07-04_icc_poc_play, _decisions/2026-07-04_convergence_program_execution_model, _inbox/2026-07-04_convergence-program_STATUS]
---

# Hauska-certified: certification program scaffold

> **Filing note.** Drafted in scratchpad for review; on filing this takes a root numeric slot. Recommended slot: `63_hauska_certification_program.md`, adjacent to the proof-of-record spec's recommended slot 62 (62 through 69 open in the substrate band as of 2026-07-05). The `id` field updates to match at filing time per `01_doc_conventions.md`.

> **Status posture.** Scaffold, not a spec: sections carry named decisions with options and a recommendation each, per the repo's decision culture. The artifact is named in the convergence program's Phase 4 queue (`_inbox/2026-07-04_convergence-program_STATUS.md` line 7: "Stripe test-mode pricing; proof-of-record spec; siting spike memo; certification scaffold") and the ICC decision names its motion explicitly: the ICC PoC is "depended on by: the certification and licensed-distribution motion in Phase 4" (`_decisions/2026-07-04_icc_poc_play.md`). Beyond those two lines, no certification program exists anywhere in the doc set or, per the docs read for this draft, in code. Nothing here is built. The eval harness the program leans on IS built and has run corpus-wide; its current output is explicitly not publishable (see Decision 2).

## Why certification, and why now

The substrate thesis sells reasoning with earned trust attached (commitments #1 and #2). A certification designation is the packaging of that trust into a nameable, checkable claim a buyer, a licensor, or a counterparty can rely on without reading the eval harness source: "this jurisdiction corpus is Hauska-certified" should compress "it passed the published eval bar, on real curated queries, against a pinned edition, attested by a named party, and here is the verifiable evidence." Phase 4 is monetization capture; certification is the artifact that lets Layer 2 quality be priced rather than merely claimed, and it is the template the ICC relationship converts into (licensed content in, metered and certified reasoning out, publisher paid, per the ICC decision's reasoning section).

The honesty constraint governs everything below: per commitment #2, a certification is exactly the kind of confidence signal that must be earned and calibratable, never asserted. The program's own recent history makes the point concretely; see Decision 2.

## Decision 1: what can be certified

Three candidate certification objects, from the Phase 4 framing:

An adapter (a source-ingest path: Municode, RawPdfAdapter, ICC Code Connect). Certifying an adapter says "corpora produced through this path meet the bar," a process claim.

A jurisdiction corpus (Bastrop UDC at a pinned edition, the IBC2018P6 ingest). Certifying a corpus says "this specific atom set, at this snapshot, passed the bar," an artifact claim.

A calibration claim (a stated confidence stream matches observed frequency for a domain or tenant). Certifying calibration says "the confidence numbers on these outputs are earned," an ongoing-behavior claim.

Options. (a) Corpus-only at v1. (b) Corpus plus adapter. (c) All three from the start.

Recommendation: (a) with (b)'s substance kept internal. The corpus is the natural first object because the eval harness already runs per-jurisdiction, the "declared loaded" gate in `49_code_ingestion_pipeline.md` is already effectively a certification predicate, and it is the object a buyer or licensor can point at. Adapter quality stays an internal release gate rather than a public designation, because an adapter certificate invites "certified process, broken output" failure modes. Calibration certification is explicitly deferred, gated on the M1 case-grain re-run returning go: per the 2026-06-25 retraction in `04a_arrow_two_calibration_capture.md`, served confidence today is asserted-with-provenance, and certifying a calibration claim before the earning loop is verified live would be exactly the unearned-number failure commitment #2 forbids. The deferral and its gate should be stated in the public program description rather than hidden.

## Decision 2: the eval bar

The bar exists and is canonical: 90 percent top-3 retrieval on curated reviewer-realistic queries, 100 percent section-number retrievability, 95 percent cross-reference resolution, set as the "declared loaded" quality bar in `49_code_ingestion_pipeline.md` and restated in `25a_atom_principle_llm_economics.md` and `51_substrate_v1_sprint.md`. It was ratified as a proposal to be refined after first-jurisdiction data (49's open items).

The live caution that shapes this decision: the 2026-07-05 eval-scores run (STATUS tracker) produced 32 of 34 jurisdictions "passing" top-3 with `queriesEvaluated: 0`, a vacuous pass presented as a perfect score, and was correctly ruled not publishable under commitment #2. Only Grand County and Bastrop have real curated query sets. Section-retrievability and crossref sampling (100 each) are real across the corpus. So today, the certifiable-on-real-evidence set is roughly two jurisdictions, not thirty-four, and any certification program that launched on the current artifact would be certifying vacuously.

Options. (a) Adopt the existing three-threshold bar unchanged. (b) Raise it for certification (certification as a stricter tier above "declared loaded"). (c) Adopt it plus a non-vacuousness floor.

Recommendation: (c). Keep the three thresholds exactly as published (they are canonical, and a silent second bar would fork the quality story), and add one structural requirement rather than a higher number: a minimum curated-query count per jurisdiction (floor value an open operator decision; it must be large enough that 90 percent is a meaningful fraction), with the query set itself versioned and hash-pinned so the certificate names the evidence it was earned against. The rule the eval-scores incident teaches is that the bar was never the weakness; the evidence volume was. A certificate must state n. An edition-mismatch failure like Bastrop's current one (query set built against a different code edition) is a certification blocker by design, not a technicality, because edition binding is part of the claim.

## Decision 3: who attests

Options. (a) Executor self-certification. (b) Planner verification against live systems, operator signs. (c) Independent third-party attestation. (d) Licensor co-attestation for licensed corpora.

Recommendation: (b) as the v1 mechanism, with (d) as the ICC-shaped extension. (a) is already forbidden program-wide: "no self-certified closes" is a standing mitigation in the program premortem, and the execution model rules that verification is never delegated to executors. The same discipline transfers: the eval run is executed by whatever agent runs it, but the certificate issues only on planner verification against the live system (verbatim eval output, pinned corpus snapshot, pinned query-set hash), and the operator signs anything public because public claims are operator-gated per the execution model decision. For licensed corpora, licensor co-attestation is the natural deepening of the ICC relationship: ICC attesting "this is our content, correctly cited, within the derivative boundary" alongside Hauska attesting the retrieval bar converts the licensing relationship into the distribution partnership the ICC decision aims at. (c), true independent attestation, is a mature-program option, not v1; it earns a place if certification acquires regulatory or insurance-adjacent weight.

## Decision 4: how certification decays and re-runs

A certificate that never expires becomes a stale claim wearing a badge; the doc set already treats staleness as a first-class signal (the 60-day staleness convention in `01_doc_conventions.md`, the source-set-drift invalidation stamps in the calibration overlay per 04a).

Decay triggers, in recommended order of bindingness. First, edition change: the certificate is pinned to a code edition and corpus snapshot hash, and a new edition or amendment for the jurisdiction voids it for the new edition automatically (the old certificate remains true of the old edition forever; edition-at-date is the engine's own direction per `_catalog/repo_intents.md`). Second, corpus re-mint: any re-mint of the jurisdiction's atoms produces a new snapshot hash and therefore requires re-running eval to re-issue; the certificate names the hash, so this is mechanical. Third, query-set revision: improving the curated set voids certificates earned against the old set only when the operator says so (a better exam does not retroactively fail old graduates, but the program may choose to re-examine). Fourth, a time-based re-run cadence, which is an open operator decision; this doc deliberately names no interval.

Options for the decay model. (a) Hard expiry on any trigger. (b) Trigger-based voiding with no time expiry. (c) Trigger-based plus time-based.

Recommendation: (b) at v1. Every named trigger is content-driven and verifiable; a calendar expiry adds operational drag without adding truth while the corpus is small. Revisit toward (c) when calibration certification (Decision 1 deferral) arrives, because ongoing-behavior claims genuinely do decay with time in a way artifact claims do not.

## Decision 5: the certificate artifact

Options. (a) A page on the public catalog ("certified" flag plus scores). (b) A signed document. (c) A proof-of-record over the eval run.

Recommendation: (c), rendered as (a). The companion Phase 4 draft (proof-of-record spec, recommended slot 62) defines a signed, hash-chained, independently verifiable record whose citations pin content by hash. An eval run is exactly the kind of answer that mechanism was designed to freeze: subject (jurisdiction, edition, snapshot hash, query-set hash), scores per threshold, n, issuer, timestamp, signature. Issuing the certificate as a proof-of-record means anyone can verify the certification claim offline the same way they verify any other record, and the certification program becomes the proof-of-record mechanism's first internal dogfood customer, which is the correct dependency direction for Phase 4. The public catalog then renders the record; it does not constitute it. This creates a real sequencing dependency: the certificate artifact in this form waits on the proof-of-record base layer. If Phase 4 sequencing wants certification first, (b) with a manually signed document is an acceptable stopgap whose contents are field-identical, upgradeable to (c) without re-running eval.

## Decision 6: how certification prices into Layer 2

The constraint set: Layer 1 is free and Layer 2 is paid (`08_tiered_access_model.md`); a package's Layer 2 sells reasoning over the domain, never raw-data resale (the binding constraint in 08); v1 pricing canon is per-call default with stream upsell, take rate 1.5 to 2.5 percent, package-composed tiers per the Decision B reshape (`14_pricing_framework.md`); and Stripe work in this phase is test-mode only per the autonomy grant.

Options. (a) Certification is an included property of the Layer 2 catalog: paid calls against certified corpora, certification itself never separately billed. (b) Certification is a separately priced assurance SKU per corpus or per counterparty. (c) Licensor-facing certification as a component of licensed-distribution economics (the ICC motion).

Recommendation: (a) as the floor, (c) as the revenue line, (b) narrowly and later. Certification's first commercial job is raising the clearing price and conversion of Layer 2 itself: a certified corpus justifies the paid tier's premium over the free baseline, exactly the "what the code means, in practice" moat framing in 08, and gating certification behind a separate fee would tax the trust signal that makes the metered calls sellable. The genuinely new revenue is (c): in the ICC-template relationship, certification of the licensed corpus plus visible metering is part of what the licensor is paying for, or offsetting against, in the distribution deal, and it composes with the SDK metering and the revenue-routing direction in 14 (routing layer honestly not built; any near-term licensor economics are contractual, not substrate-enforced, and materials must say so). (b), a paid assurance artifact, becomes real when a specific counterparty (an insurer, a lender, an enterprise procurement) wants a certificate document with their name on the reliance line; price it Path B when it appears (`14_pricing_framework.md` defaults table, enterprise row) and treat it as selling the reasoning-durability artifact, not the data. No dollar numbers are set here; per the pricing framework's own discipline, numbers set at first paid signal.

## What exists versus what this scaffold proposes

Exists, verified in the doc set: the eval harness with the three-threshold bar, run corpus-wide; real curated query sets for Grand County and Bastrop (Bastrop currently failing on a query-set edition mismatch, not retrieval); real section-retrievability and crossref sampling across 34 jurisdictions; the "declared loaded" gate concept in 49; the calibration ledger and overlay with the M1 gate open; the signed ICC contract and answered technical questions; the four-gate MCP chokepoint deployed with metering staged per the ICC play.

Does not exist: any designation named "Hauska-certified"; any certificate artifact, store, or issuance path; a non-vacuousness floor or minimum query count; per-jurisdiction curated query sets beyond the two named; licensor co-attestation in any agreement; any pricing wiring for certification. This entire scaffold is proposal pending operator review of the six decisions above.

## Open questions

1. The minimum curated-query count per jurisdiction (Decision 2 floor value), and who authors curated queries at scale without the authoring cost blowing the per-jurisdiction onboarding budget (structural commitment #3 applies to certification cost too).
2. Whether the certification mark is a Hauska mark or surfaces under Empressa product branding. The branding canon says Hauska is substrate-only; a corpus certification is a substrate claim, so "Hauska-certified" appears canon-consistent, but marks on product surfaces need the operator's branding ruling before anything public ships.
3. Whether certification of ICC-derived corpora survives ICC contract termination given the destroyability requirement; the proof-of-record answer (hashes and citations survive, content does not) suggests yes for issued certificates, but this should be confirmed in the licensed-distribution negotiation.
4. Where the certification registry lives (public catalog on the gate versus the atom-contract repo's published spec surface), checked against the spine topology before building.
5. Whether "declared loaded" (internal gate) and "Hauska-certified" (public designation) remain two names for one predicate or deliberately diverge (this scaffold's Decision 2 recommendation keeps thresholds identical and adds the evidence floor only to the public designation, which is a divergence; flagging it explicitly).

## Cross-references

- `49_code_ingestion_pipeline.md` (the eval bar and "declared loaded" gate this program packages)
- `25a_atom_principle_llm_economics.md` (why the eval bar exists economically)
- `08_tiered_access_model.md` (tier structure, moat framing, sell-reasoning binding constraint)
- `14_pricing_framework.md` (v1 pricing canon, Path A/B, routing-layer honesty)
- `09_post_saas_substrate_thesis.md` (trust and substrate durability as the position)
- `04a_arrow_two_calibration_capture.md` (calibration state; the M1 gate on Decision 1's deferral)
- `_decisions/2026-07-04_icc_poc_play.md` (the certification and licensed-distribution motion)
- `_inbox/2026-07-04_convergence-program_STATUS.md` (Phase 4 queue naming this artifact; the eval-scores non-publishable ruling)
- Companion draft: proof-of-record spec (recommended slot 62), the certificate's substrate per Decision 5.

## Revision history

- **2026-07-05 (origin, draft):** Drafted in scratchpad as the Phase 4 certification scaffold named in the convergence program queue. Six decisions framed with options and recommendations: certification objects, eval bar plus non-vacuousness floor, attestation, decay, certificate-as-proof-of-record, and Layer 2 pricing posture. Filing slot recommendation: 63.
