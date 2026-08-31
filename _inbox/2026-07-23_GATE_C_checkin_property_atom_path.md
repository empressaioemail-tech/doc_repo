---
id: 2026-07-23_GATE_C_checkin_property_atom_path
title: GATE C CHECK-IN — property atom path proven; halt before PE live cutover
status: superseded
date: 2026-07-23
applies_to: doc_repo planner (review), hauska-atom-contract, hauska-engine, hauska-mcp-server, property-explorer
superseded_by: 2026-07-23_GATE_C_cutover_close
related: [2026-07-23_MASTER_WDLL_property_reasoning_substrate, 2026-07-23_atoms_first_central_tx_execution_plan, 2026-07-23_phase1a_storage_port_live_close, 2026-07-23_phase05_contract_extension_design_GATE_B]
owner: nick
---

# GATE C CHECK-IN — addressed to the doc_repo planner (`P:\doc_repo`)

**From:** Phase 1b/1c build planner (execution seat)  
**Stop:** before any property-explorer live read flip (cortex → atoms)  
**Ask:** reviewing planner verifies the evidence below against Master WDLL Phase-1 items and the four non-negotiables; operator gives Gate C go before cutover.

Standing hold observed: **no PE live cutover in this wave.** Cortex still serves users. Atom path is dual-serve / flag-gated / catalog-tool only.

---

## 1. Live stack (parent-verified, not sub-agent report)

| Surface | Live value |
|---|---|
| `@empressaio/atom-contract` | **1.9.0** (`gitHead` `5778b09731046654bd987248f0a385bf63d57a06`); exports `./reasoning` + `./property` |
| hauska-engine `main` | `5fb8449` (PR [#100](https://github.com/empressaioemail-tech/hauska-engine/pull/100) on top of Phase 1b [#99](https://github.com/empressaioemail-tech/hauska-engine/pull/99) `067e476`) |
| hauska-retrieval-api | **`hauska-retrieval-api-00014-84n` @ 100%** (project `hauska-prod-497015`) |
| hauska-mcp-server | **`hauska-mcp-server-00023-j4s` @ 100%** (image tag `8a36827` = merge of PR [#43](https://github.com/empressaioemail-tech/hauska-mcp-server/pull/43) `8a36827`) |
| cortex-api (live product) | **`cortex-api-00428-fax` @ 100%** (project `legacy-design-tools-prod`) — **unchanged** |
| property-explorer live read | **NOT flipped** |

Engine deps pin: `@empressaio/atom-contract@^1.9.0` in `packages/atoms`, `packages/engine-core`, `packages/storage`. Local mirrors thinned to re-export `@empressaio/atom-contract/property`.

---

## 2. Named Central-TX parcels — atom path proven

Proof atoms written to Neon `hauska_mcp` via StoragePort under `PROPERTY_ATOM_PATH=1` (writers gated; reads always-on empty-or-present).

| Parcel | Role | DIDs |
|---|---|---|
| `48209:156346` (Hays gold) | full chain | `did:hauska:zoning-fact:48209:156346`, `…:setback-rule:…`, `…:buildable-envelope:…` |
| `48029:410119` (Bexar null-zoning) | honest-absence | `did:hauska:zoning-fact:48029:410119` only |
| `48055:11386` (Caldwell, optional) | zoning-fact | `did:hauska:zoning-fact:48055:11386` |

### 2a. Retrieval `GET /property-nodes/:id/atom-chain` (Bearer `RETRIEVAL_API_KEY`)

Base: `https://hauska-retrieval-api-h7gvu7rgcq-uc.a.run.app`

**Hays `48209:156346` (highlights):**
- `zoningFact.district` = `"RS"`
- `setbackRule.sourceCodeAtomRef` = `{ role: "rule", atomDid: "did:hauska:code-section:storage-port-proof/phase-1a", entityType: "code-section", … }` (typed ref, not bare string)
- `buildableEnvelope.reasoningChain.reasoningKind` = `"derived"`; `derivationMethod` = `"buildable-envelope-inset-v1"`; `inputAtomRefs` include fact + rule + geometry/front-edge reference-fields
- `atoms.length` = 3

**Bexar `48029:410119` (highlights):**
- `zoningFact.absence.kind` = `"no-zoning-stamp"`
- `absence.reason` contains honest decline (no fallback district invent)
- **no `district` field**
- `setbackRule` / `buildableEnvelope` null on chain wire (MCP surfaces as `pendingSlots`)

**GET `/atoms/<did>`:** Hays zoning + Bexar zoning both 200 with the same payloads.

### 2b. MCP catalog-tool path (per-atom `accessPolicy`, not package/tier)

Introspection (header `X-Hauska-Admin-Key`):

```
GET /admin/introspection/tools → includes get_property_atom_chain
gate: access_policy
product: public
anonymous_ok: true
```

Live tool calls via `POST /admin/introspection/tools/get_property_atom_chain/call` with `{ "arguments": { "parcel_node_id": "…" } }`:

- **Hays:** `status: "ready"`, three slots populated, `is_error: false`, auth `free_anonymous`
- **Bexar:** `status: "partial"`, zoning-fact with `absence.kind: "no-zoning-stamp"`, `pendingSlots: ["setback-rule","buildable-envelope"]`, **no invented I-2 district**

---

## 3. Dual-serve / live-product protection (I-J)

| Check | Evidence |
|---|---|
| Cortex still default for PE users | `cortex-api-00428-fax` @ 100% on `legacy-design-tools-prod` |
| Atom writers gated | `PROPERTY_ATOM_PATH=1` required by proof CLI / `writePropertyAtomIfEnabled`; retrieval route documents writers-gated / reads empty-or-present |
| PE live read untouched | No property-explorer PR; no cortex envelope route swap in this wave |
| Catalog tool does not retire reporting/map path | Tool copy + handler explicitly catalog-only; Overpass remount left with PE (`cortex-api-00428-fax`) |

**Cutover is NOT done.** That is the Gate C go the operator must give after planner review.

---

## 4. Four non-negotiables — grades with evidence

### N1. Reuse shipped obligation surface (no second model)

**PASS**

- Live `1.9.0` still exports `ObligationAtomInstance`, `ObligationType` including `license-reference-royalty` / `license-revenue-share`, `owedToActorDid`, `actor-record` / `ActorLicensingTerms` (npm pack `.d.ts` grep).
- `./property` re-exports actor-record + obligation; setback-rule docs say ObligationAtomInstance rows — **no `SourceAttribution` module** in package.
- Engine property-reasoning: grep `SourceAttribution` = empty.
- Setback cites code via typed `sourceCodeAtomRef` (`AtomInputRef` with `role`).

Caveat (not a N1 fail): proof atoms do not yet attach a live ICC `owedToActorDid` obligation row on every setback (inbound meter / I-K volume work remains Master **3.11 / 2.5.4 runtime**). Shape reuse is met; meter accrual at gate read is still a later bar.

### N2. Confidence via calibration-overlay read-through (I-E) — not frozen multiply

**PARTIAL (anti-multiply PASS; live overlay apply PARTIAL)**

- Grep `labeling.confidence` / `district.confidence *` / `SourceAttribution` in `property-reasoning/` = **empty**.
- Emit path: `emit-buildable-envelope.ts` passes `calibrated: null` with comment that READ resolves via overlay; `resolveCalibratedConfidence` exists in `calibration-overlay.ts` (keyed for overlay seed / parcel node).
- Live served atoms still carry a **placeholder** `calibratedConfidence` with `provenance: "asserted"` copied from asserted (contract three-axis shape requires a slot; `buildReasoningReadAxes(null)` fills asserted-provenance placeholder). Retrieval `getPropertyAtomChain` returns stored JSON **without** calling `resolveCalibratedConfidence` against migration-0037 overlay yet.
- Master **3.10** (overlay wired + permit-outcome backtest) is **not** claimed MET.

**Not a FAIL on the non-negotiable's anti-pattern:** no second frozen multiply model was built.

### N3. Jurisdiction-agnostic + non-TX golden-descriptor CI (I-B)

**PASS**

- Prod `property-reasoning/**/*.ts` (excl. tests/fixtures): grep `texas|central.?tx|\bTX\b|bexar|hays|comal|travis|williamson` = **zero hits**.
- Committed stub: `packages/engine-core/src/property-reasoning/fixtures/descriptors/cook_county_il_stub.json`
- Local (post `pnpm install` resolving 1.9.0):

```
✓ src/property-reasoning/__tests__/property-reasoning.test.ts (5 tests | 4 skipped) 4ms
Test Files  1 passed (1)
Tests  1 passed | 4 skipped (5)   # -t "cook_county"
```

- CI on merge `5fb8449` (run `30044111437`): `property-reasoning.test.ts (5 tests)` green.

### N4. Honest-absence + retire-not-overwrite (I-D, I-G)

**PASS (honest-absence live); retire path unit-covered**

- Bexar live atom + MCP: `absence.kind = "no-zoning-stamp"`, no district, decline reason present — **not** stamped I-2.
- Setback typed `sourceCodeAtomRef.role = "rule"` (bare string would FAIL).
- Retire-not-overwrite: StoragePort write + `calibration-retire.test.ts` cover version/retire; proof bake used v1 contentHashes (`gate-c-*-v1`). Full production rebake retire audit is Master **3.12** (not claimed).

---

## 5. Master WDLL Phase-1 items claimed (planner to confirm)

| Item | Claimed grade | One-line evidence |
|---|---|---|
| 3.1 StoragePort | **MET** (prior Gate A Option A close) | Phase 1a note; still serving proof code-section DID |
| 3.2 Atom kinds on contract | **MET** | `@empressaio/atom-contract@1.9.0` `./property` + fixtures |
| 3.3 Zoning FACT | **MET** | Hays RS + Bexar honest-absence live |
| 3.4 Setback RULE consuming field provenance | **PARTIAL** | Typed cite + fieldProvenance atom_did/confidence present; matcher ladder (exact/prefix/fallback) not fully exercised on live named cases beyond exact proof |
| 3.5 Setback cites code atom (typed) | **MET** | `sourceCodeAtomRef` → Phase 1a code-section DID |
| 3.6 Buildable-envelope DERIVED | **PARTIAL** | Live derived atom + input refs; input-confidence propagation demo + honest-absence envelope probes not fully live-graded; overlay read-through not on serve path |
| 3.7 Bespoke path retired | **NOT claimed** | Gate C cutover — cortex/PE still live |
| 3.8 Jurisdiction-agnostic | **MET** | Grep-clean prod + cook_county_il_stub CI |
| 3.9 Referenced fields | **PARTIAL** | Geometry/front-edge as `reference-field` refs on envelope; schema/Overpass upgrade path not re-audited this wave |
| 3.10 Calibration overlay | **PARTIAL** | Resolver + emit discipline exist; live serve does not yet resolve 0037 overlay; no permit-outcome adapter in this wave |
| 3.11 SDK money boundary | **NOT claimed** | Stripe path still live; Gate D territory |
| 3.12 Central-TX re-bake | **NOT claimed** | Proof parcels only, not county ledger |
| 3.13a MCP catalog-tool same atom ids | **MET (catalog leg)** | `get_property_atom_chain` live; Hays/Bexar return same DIDs as retrieval; gate `access_policy` |
| 3.13b/c map + report | **NOT claimed** | Out of this stop |

---

## 6. Known gaps / planner watch-outs (do not block stop; may condition Gate C go)

1. **I-E serve path:** wire `resolveCalibratedConfidence` into retrieval/MCP read before calling calibrated axis "earned."
2. **MCP outer envelope `readContract`:** tool response wraps atoms with a generic ASCE7 / life-safety-shaped consequence at the envelope layer; per-atom `readContract.consequence.kind = "not-applicable"` is correct. Clean the wrapper so property chains do not look life-safety stuffed at the outer layer.
3. **MCP health `degraded`:** cortex probe timeout + Upstash fetch failed on this revision; retrieval probe reports HTTP 404 on its health path (chain route itself works). Not a PE cutover prerequisite but ops debt.
4. **Traffic tag discipline:** MCP historically pinned named tags (`map42`); this deploy shifted 100% to `00023-j4s`. Tagged canaries remain at 0%.
5. **Obligation runtime (I-K):** shape reuse done; inbound royalty meter on every ICC-cited reference still open.

---

## 7. Decision requested

**STOP. Do not flip property-explorer's live read.**

Reviewing planner: verify sections 1–4 against Master WDLL + invariants I-A/I-B/I-D/I-E/I-G/I-J.  
Operator: Gate C go only after that verification, with an explicit cutover plan (flag dual-serve → prove PE → retire cortex envelope path).

Build planner standing by for rework if any non-negotiable is overturned on review.
