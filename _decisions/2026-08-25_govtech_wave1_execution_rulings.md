---
decision_id: 2026-08-25_govtech_wave1_execution_rulings
date: 2026-08-25
owner: nick
status: provisional
verification_pending:
  - Operator confirms each ruling below (yes/no per item)
  - O-3 ICC agreement alignment on cited-only billing (S4-B1)
related_canonical:
  [
    _inbox/2026-08-24_govtech_transaction_contract,
    _inbox/2026-08-24_govtech_program_scope,
    _decisions/2026-08-17_template_city_identity,
    90_operations/OPS-17_govtech_stack_plan_of_record,
  ]
---

## Decision

Batch close of four transaction-contract open items (O-3, O-4/O-5/O-6 from `_inbox/2026-08-24_govtech_transaction_contract.md` OPEN section) as **operator-recommended defaults**. Lanes may plan against these rulings; operational commits that depend on commercial terms stay provisional until operator confirms.

---

### Ruling 1 — O-4 / S1-17: Wave 1 tenant is `template-city`

**Decision:** `template-city` is the Wave 1 tenant for submittals, folders, and plan-review identity. `icc-demo` is retired to a QA-only persona set and must not appear in production document ids for Wave 1 proof.

**Context:** R-C already names template-city as the demo city. The transaction contract documents a live mismatch: `plan-review/web/app.js` hardcodes `template-city` while `plan-review/src/actors.mjs` personas write `icc-demo` scope ids. S1-17 and S2-6 depend on one tenant.

**Reasoning:** Wave 1 E2E proof (S5-5) is evidence that the transaction worked on the demo city. Documents whose entity ids say `smartfile:tenant:icc-demo:*` are not that evidence. Aligning persona `orgId`, folder creation, and UI `CITY_KEY` to `template-city` closes the identity defect without lifting the Bastrop hold (Wave 2).

**Reversal criteria:** Reverse only if operator names a different Wave 1 tenant key under a filed WDLL amendment, or if ICC contractual demo requirements explicitly require `icc-demo` as the production tenant (would reopen R-C).

**Dependencies:** Unblocks S2-6 staff upload, G-107, G-110. Govtech seat executes; no property or substrate write required for the persona alignment itself.

---

### Ruling 2 — Contract O-3: `cited` is billable; `served` is recorded only

**Decision:** Accrual rows with `referenceKind: "cited"` are billable obligations (subject to agreed rate). Rows with `referenceKind: "served"` are recorded for reconciliation and are **not** billed in Wave 1.

**Context:** The transaction contract requires both kinds recorded and distinguishable. O-3 left the commercial question open for ICC agreement (S4-B1).

**Reasoning:** A citation in a determination is use of licensor material in a work product. A serve into a retrieval window is closer to index lookup; billing serves would tie licensor revenue to our retrieval breadth. Both signals stay in `source_obligation_ledger`; only `cited` rows carry billable `rateBasis.kind: "resolved"` once a rate exists.

**Reversal criteria:** Reopen if ICC agreement in writing requires serve-time billing, or if Wave 1 accrual probe shows cited-only under-counts against ICC's reconciliation model.

**Dependencies:** S4-7 (cited atom recorded), S4-1b reconciliation, S4-B1 rate agreement. Block setting a real rate until DEPLOY-75 + accrual probe pass (scope ordering constraint 3).

---

### Ruling 3 — Contract O-5: substrate mints all citations

**Decision:** Every citation object in the Wave 1 transaction is minted by the substrate at serve time, including out-of-corpus web-search fallbacks. No consumer constructs citation fields.

**Context:** Rule 6 in the transaction contract forbids consumer-authored citation strings. The Brief/web path today produces `CodeSectionWebProvenance` outside the substrate.

**Reasoning:** A second minting path is a second definition of citation, which produced IRC sections labelled as IBC on the ICC surface. Web-sourced sections map to substrate citations with `bodyDisposition: "reasoning-layer"`, `editionCurrency: "unresolved"`, and verification state on determination confidence, not inside the citation object.

**Reversal criteria:** Reopen only if substrate mint latency blocks S5-5 on template-city and a time-boxed consumer validator is filed with explicit sunset (must not persist as a second mint path).

**Dependencies:** S4-3 (`sourceActorDid` on envelope builders), S5-2c citation validator vendored to products. Substrate seat owns mint shape; govtech owns consumer validate-and-refuse.

---

### Ruling 4 — Contract O-6: `contested` not in Wave 1

**Decision:** The determination vocabulary does **not** gain `contested` in Wave 1. The four-value CHECK (`Pass`, `Fail`, `Uncertain`, `Unchecked`) stays unchanged.

**Context:** Doc 19 layer status includes `contested` for dual-authority cases (e.g. ETJ parcel with conflicting city and county rules). `Uncertain` must not absorb that meaning.

**Reasoning:** Adding a value used for two meanings is harder to split later than reserving and adding once. Wave 1 on template-city uses model-code corpus without ETJ derivation; contested authority cases are out of scope for S5-5 proof.

**Reversal criteria:** Reopen when a Wave 1+ card names a live template-city determination that requires dual-authority reporting, filed with CHECK migration and WDLL acceptance items.

**Dependencies:** S2-7 applicability matrix must not map authority conflicts to `Uncertain` without an explicit absence or future `contested` value. Govtech seat enforces in review.

---

## Structural commitment check (batch)

Sell reasoning, not data: **green** — citations stay substrate-minted with provenance.
Confidence is earned: **neutral** — O-6 deferral does not block calibration capture on overrides.
Tenant sovereignty: **green** — template-city isolation preserved.
MCP-first: **green** — no change to gate architecture.

## Provisional to active

When operator confirms each ruling (verbal or written in session), edit this record: `status: active`, remove `verification_pending`, add under Context: "Operator confirmed YYYY-MM-DD."

If operator rejects a item, set that subsection to reversed and file a superseding `decision_id` for the corrected direction.

## Counterparties

Internal: govtech (S1-17, S2-7/8/9), substrate (O-5 mint, O-3 accrual shape), property (engine path honesty). External: ICC (O-3 commercial alignment via S4-B1).
