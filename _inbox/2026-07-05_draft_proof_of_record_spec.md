---
id: draft_proof_of_record_spec
title: Proof-of-record spec — how an atom-backed answer becomes a verifiable record
status: draft
last_updated: 2026-07-05
applies_to: portfolio
owner: planner
related: [09_post_saas_substrate_thesis, 08_tiered_access_model, 14_pricing_framework, 01a_atom_conventions, 25_atom_architecture_reference, 04a_arrow_two_calibration_capture, 80_adrs/adr_012_atom_export_format, 80_adrs/adr_017_atom_access_control, 80_adrs/adr_018_atom_contract_substrate_layer, _decisions/2026-07-04_convergence_program_execution_model, _decisions/2026-07-04_icc_poc_play]
---

# Proof-of-record spec

> **Filing note.** Drafted in scratchpad for review; on filing this takes a root numeric slot. Recommended slot: `62_proof_of_record_spec.md` (62 through 69 are open in the substrate band as of 2026-07-05; 50 through 61 carry the spine and substrate program docs). The `id` field updates to match at filing time per `01_doc_conventions.md`.

> **Status posture.** Spec-level draft, a Phase 4 (monetization capture) artifact of the convergence program per `_decisions/2026-07-04_convergence_program_execution_model.md` and the Phase 4 queue line in `_inbox/2026-07-04_convergence-program_STATUS.md` ("Stripe test-mode pricing; proof-of-record spec; siting spike memo; certification scaffold"). The program docs name the artifact but do not define it; this doc is the definition. The only prior use of the term in the doc set is `_catalog/repo_intents.md`, which flags the Hauska SDK's VDA/IPFS/wallet stack as the "proof-of-record substrate candidate." Nothing described in the "Proposed" sections below exists in code unless the "What exists today" section says it does.

## What a proof-of-record is

A proof-of-record is the substrate mechanism by which a Hauska atom-backed answer becomes a durable, independently verifiable record. Structural commitment #1 already requires that every output carries reasoning chain, source citation, confidence score, and timestamp, at every tier. The proof-of-record extends that from a property of the response in flight to a property a counterparty can check later: given a record identifier or a portable record file, a third party who was not present at the original call can verify what was answered, what atoms the answer cited, what those atoms contained at the time (by content hash), what confidence was stated and on what basis, and that none of it has been altered since.

The commercial logic follows the post-SaaS substrate thesis (`09_post_saas_substrate_thesis.md`): reasoning chains are the unit of accounting, and the durable layer is the substrate, not the response text. A metered reasoning walk that can be re-verified years later by an insurer, a lender, a permitting authority, or an opposing counterparty is worth more than one that cannot. The record is the artifact that lets an agent-mediated answer stand in a dispute, an audit, or a diligence file.

## What exists today (verified against the doc set, not asserted beyond it)

The proof-of-record composes machinery that is largely already built or already committed as a conformance target. Recording the split honestly:

Built and live. The sealed `EngineEnvelope` is shipped end to end (hauska-engine #72 emit, legacy-design-tools #183 consume, per `75i_investor_radar_prelaunch_sprint.md` task 2 and the seam-seal dispatch STATUS note). The envelope carries `lineage.atomIds`, per-source `deeplink`, `retrievedAt`, `snapshotDate`, `dataVintage`, `verificationState`, a `confidence` object with `value`, `kind` (calibrated, asserted, deterministic, none), `grade`, and `basis`, and a `coverage` object with degradation reasons (shape per `_research/2026-06-11_engine_robustness_audit.md`). Atom instances carry `contentHash`, `sourceAdapter`, `sourceUrl`, `fetchedAt` provenance fields (the BaseAtomInstance convention, `_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md`). The atom contract carries the five-value `accessPolicy` union (ADR-017; fifth value added in 1.2.0 per CLAUDE.md ground truth) and is published through `@hauska/atom-contract@1.6.1` (STATUS verification log 2026-07-05). The arrow-two evidence ledger and the `atom_calibration_overlay` exist (`04a_arrow_two_calibration_capture.md` Phases 1 and 3 merged), with the honest caveat that the M1 case-grain re-run has not returned go, so served confidence today is asserted-with-provenance, not earned (the 2026-06-25 retraction note in 04a).

Committed as target, not uniformly present. The atom conformance target (`_architecture_homes/02_atoms_lifecycle_ownership.md`, `01a_atom_conventions.md`) requires every atom to carry the three-axis read-contract confidence object and, for data-level atoms, an append-only, hash-chained, signed event history with a verify-chain, and defines a downloadable-atom shape that is self-contained and verifiable without trusting the hosting system. ADR-012 (accepted) commits the `.atom` / `.atompack` export container with self-service verification (hash unpacked content against the manifest CID, verify `_signatures/` against manifest public keys, offline). ADR-012 explicitly leaves the signature scheme open (COSE, JWS, or custom, interacting with ADR-011 key management). The conformance audit that would establish which families actually carry the signed-history layer today is Track A of `_architecture_homes/04_audit_and_sequence.md` and has not been reported complete in the docs read for this draft.

Built but unused for this purpose. The Hauska SDK carries a VDA, IPFS, and wallet stack, retained specifically as the proof-of-record substrate candidate per `_catalog/repo_intents.md`. The crypto settlement rail is built (`@hauska-sdk/payment` v0.1.0 per `14_pricing_framework.md`); none of it is wired to record issuance because record issuance does not exist.

Not built at all. There is no record object, no record store, no issuance path, no record-verification endpoint or tool, and no signing key infrastructure designated for records. Everything below the next heading is proposal.

## Proposed: the record object

The record is a small, canonically serialized document that freezes the verifiable surface of one answer. It deliberately carries hashes and references, not content. Spec-level shape (field names indicative, not final):

```
ProofOfRecord {
  recordId            // stable id, e.g. did:hauska:record:<id>
  schemaVersion
  issuedAt            // ISO timestamp (commitment #1)
  issuer              // the gate/service identity + key id that signed
  subject {
    tool | surface    // which gate tool or product surface produced the answer
    queryDigest       // hash of the canonicalized request (never raw PII)
    tenant            // tenant scope, or public/anonymous
  }
  answerDigest        // hash of the canonicalized response body (the reasoning text)
  envelope {          // frozen from the live EngineEnvelope at issue time
    confidence { value, kind, grade, basis }   // earned vs asserted preserved verbatim
    coverage { status, degraded, degradationReasons }
  }
  citations: [ {
    atomId            // did:hauska:<type>:<id>
    contentHash       // the cited atom's contentHash at issue time
    accessPolicy      // the atom's accessPolicy at issue time (five-value union)
    editionRef        // code-edition / corpus-snapshot stamp where applicable
    deeplink          // sourceUrl or licensed deep link (ICC deep links, never text)
  } ]
  corpusStamp         // corpus snapshot / edition-at-date identifier the answer ran against
  licensing           // marks for licensed content in the chain (e.g. ICC attribution)
  prevRecordHash      // append-only chain link within the record log
  signature           // over the canonical serialization; scheme per ADR-012 open item
}
```

Three properties are load-bearing. First, the record freezes confidence with its kind and basis, so an asserted number can never later masquerade as calibrated; this is commitment #2 carried into the durable artifact, and it inherits the envelope rule that `kind: calibrated` requires a real calibration row. Second, citations are by `atomId` plus `contentHash`, which makes the record robust to corpus evolution: the public corpus atom can be superseded, re-minted, or re-editioned, and the record still proves what was cited because the contentHash pins the exact content. Third, the record contains no atom bodies and no licensed text, which is what makes retention, licensing, and sovereignty tractable (next sections).

## Proposed: what is hashed, signed, and stored

Issuance happens at the gate-front seam, the same chokepoint where `sealEnvelope` runs today, because that is the one place every surface's output already passes through in sealed form (Phase 1 of the convergence program is the single-chokepoint gate; the record writer belongs behind it). The flow: canonicalize the response and request, compute digests, assemble the record, link it to the previous record hash in the tenant-scoped (or public-scoped) record log, sign, persist, and return `recordId` alongside the response.

Storage is layered. The base layer is an append-only record log in the spine's Postgres, the same pattern as the existing `atom_events` append-only discipline. Above that, two optional anchors, both proposal: an IPFS pin of the record document via the SDK's existing IPFS stack (this is the concrete reuse the repo_intents "proof-of-record substrate candidate" note points at), and, genuinely later, an on-chain anchor of periodic log-root hashes via the built USDC-rail infrastructure's chains. The base layer alone delivers the product; the anchors buy trust-without-trusting-Hauska and are explicitly severable scope.

The signing key is a Hauska Inc. record-signing key, distinct from tenant keys, with the scheme decision deferred to the ADR-012 signature-scheme open item so the record and the `.atom` export settle on one answer rather than two. Records over tenant-private atoms are themselves tenant-private under the same accessPolicy logic (ADR-017); a record never leaks a private atom's content because it never contains content, but the record's existence and its query digest are still tenant data and stay in the tenant partition (tenant-sovereignty rule).

## Proposed: how a counterparty verifies later

The verifier holds either a `recordId` (online path) or a portable record file (offline path, the ADR-012 posture: verifiable without contacting the platform).

1. Integrity. Recompute the record's digest over its canonical serialization and verify the signature against the published Hauska record key set. Check the `prevRecordHash` chain link if the verifier has log access (online path) or a published log root (anchor path).
2. Answer binding. If the verifier also holds the original answer document, hash it and compare to `answerDigest`. This proves the prose they were handed is the prose that was issued.
3. Citation resolution. For each citation, resolve the `atomId` against the public corpus (retrieval API or a downloaded `.atompack`) and compare `contentHash`. A match proves the cited source content is unchanged; a mismatch plus the `editionRef` proves the source has since been superseded, which is itself useful information (the answer was correct against the pinned edition).
4. Confidence provenance. Read the frozen confidence object. `kind` and `basis` tell the verifier whether the number was calibrated or asserted at issue time; if calibrated, the calibration overlay's edition-and-source-set stamp (04a) is the audit trail behind it.
5. Coverage honesty. Read the frozen coverage object; a degraded answer says so permanently, with reasons. A record can never launder a degraded answer into a clean one.

Steps 1 and 2 need no Hauska relationship at all once the key set and log roots are published. Steps 3 through 5 need Layer 1 access, which is free. This is deliberate: per the `08_tiered_access_model.md` guardrail that verifiability cuts both ways, verification must never be the paywall.

## Licensed content and the ICC boundary

The ICC play (`_decisions/2026-07-04_icc_poc_play.md`, `_research/2026-07-05_icc_code_connect_technical_answers.md` per the STATUS pickup notes) sets two constraints the record shape is designed around. First, the derivative boundary: citing plus analysis is not derivative, but ICC text directly incorporated is, so the record carries the formal citation string, the ICC deep link, and hashes, never I-Code text. Second, destroyability: stored ICC-derived content, vector stores included, must be destroyable on contract termination. Because the record contains hashes and citations rather than content, a termination event destroys the corpus without invalidating a single issued record; the record still proves what was cited and that the answer was licensed and attributed at issue time. The citation's `deeplink` degrades to a dead link, the proof does not degrade at all. This property should be stated in any future licensed-content negotiation; it is the licensing-safe shape of a permanent record over impermanent licensed content, and it is the same template the ICC decision names for every future licensed-content partnership.

## Retention

Proposal: records are retained indefinitely by default, because the artifact's whole value is longevity, and the content-free shape makes indefinite retention cheap and licensing-safe. Tenant-private records follow the tenant's lifecycle: exportable by the tenant as part of the downloadable-atom story (a record is a natural companion object to the portable atom in `_architecture_homes/02`), destroyable on tenant departure at the tenant's election, with the note that destroying a record destroys the tenant's own ability to prove its past answers, so the default on departure should be export-then-delete rather than silent deletion. Public-scope records retain indefinitely. Retention duration is listed under open questions rather than settled here because it interacts with the regulatory-posture open question in `14_pricing_framework.md` (records of paid reasoning calls may acquire bookkeeping obligations once money moves against them).

## Tier placement and pricing posture

Commitment #1 already grants every tier the reasoning chain, citation, confidence, and timestamp on the response. The tier line therefore sits between the response carrying its chain and the chain being persisted as a signed, retained, independently verifiable record:

Layer 1, free: every response carries the full chain in flight, as today. Verifying any existing record is free, including for non-customers (verifiability cuts both ways).

Layer 2, paid: issuance of a persisted proof-of-record, priced within the existing v1 canon (`14_pricing_framework.md`: Layer 2 per-call default, optional stream subscription), either as a per-call flag on metered reasoning calls or as an always-on property of a package subscription. This sells reasoning durability, not data, so it sits cleanly inside commitment #1's binding constraint from `08_tiered_access_model.md` (a package's Layer 2 is reasoning over the domain, never raw-data resale). Which of the two shapes (per-call flag versus package property) wins is an open pricing decision; the recommendation is the package property for the certification and enterprise motion and the per-call flag for the agent-builder tiers, revisited at first paid signal per the take-rate philosophy.

The certification scaffold (companion Phase 4 draft) consumes this mechanism directly: a certification is proposed there as a proof-of-record over an eval run, which makes this spec the substrate dependency of that one.

## Open questions

1. Signature scheme and key management. Shared open item with ADR-012 (COSE vs JWS vs custom) and ADR-011; one decision should cover `.atom` exports, record signing, and log-root publication.
2. Canonical serialization. A canonical JSON form (field ordering, number normalization) must be pinned before any hash is meaningful; candidates include JCS-style canonicalization. Not chosen here.
3. Record store partition. Whether the record log lives in the MCP gate's Postgres (it sits at the chokepoint and already carries `request_log`) or the engine's (it owns atoms and calibration). Check against the spine-vs-BFF target topology per the decoupling rule before deciding; the gate is the recommendation because issuance is a gate-front concern, but this is not settled.
4. Query privacy. `queryDigest` hides the raw query, but for some counterparty-verification uses the verifier legitimately needs the question, not just its hash. An optional encrypted or tenant-released query payload is a design decision with PII implications (ADR-007 scope rules).
5. On-chain and IPFS anchoring. Severable scope; whether it ships at all, and on which of the three built chains, is deferred until the base layer proves demand.
6. Confidence at verification time versus issue time. A verifier may want both "what was stated then" (in the record) and "what does calibration say now" (a live overlay read). The second is a Layer 2 feature riding the same citation list; whether the verification endpoint offers it is open.
7. Interaction with tenancy. Issuance for tenant-private answers is gated on the tenant leg (sprint 54, build-and-stage per the autonomy grant); the public-scope record path has no such gate and can lead.

## Cross-references

- `09_post_saas_substrate_thesis.md` (reasoning chains as the unit of accounting; substrate durability)
- `08_tiered_access_model.md` (tier guardrails; verifiability cuts both ways; data packages)
- `14_pricing_framework.md` (Layer 2 per-call canon; take-rate philosophy; regulatory posture open item)
- `_research/2026-06-11_engine_robustness_audit.md` (EngineEnvelope shape and seal rules)
- `_architecture_homes/02_atoms_lifecycle_ownership.md` (conformance target; downloadable atom; signed history)
- `04a_arrow_two_calibration_capture.md` (calibration ledger and overlay; asserted-with-provenance baseline)
- `80_adrs/adr_012_atom_export_format.md` (self-service verification; signature-scheme open item)
- `80_adrs/adr_017_atom_access_control.md` (accessPolicy union the record freezes and obeys)
- `_decisions/2026-07-04_icc_poc_play.md` and the ICC technical answers (derivative boundary; destroyability)
- `_catalog/repo_intents.md` (SDK VDA/IPFS/wallet as proof-of-record substrate candidate)

## Revision history

- **2026-07-05 (origin, draft):** Drafted in scratchpad as the Phase 4 proof-of-record spec named in the convergence program queue. Defines the record object, issuance, verification flow, licensed-content boundary, retention posture, and tier placement; everything beyond the "What exists today" section is proposal. Filing slot recommendation: 62.
