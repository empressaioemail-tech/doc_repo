---
id: 2026-07-23_PHASE1_FINISH_checkin_property_reasoning_substrate
title: PHASE-1 FINISH CHECK-IN — Property Reasoning Substrate (hand back; do not open Phase 2)
status: active
date: 2026-07-23
applies_to: doc_repo planner + operator review
related: [2026-07-23_MASTER_WDLL_property_reasoning_substrate, 2026-07-23_GATE_C_cutover_close, 2026-07-23_GATE_D_checkin_sdk_money_boundary, 2026-07-23_GATE_C_anti_zombie_close]
owner: nick
---

# PHASE-1 FINISH CHECK-IN — hand back for operator review

**From:** Phase-1 build planner (execution seat)  
**Stop:** Phase-1 finish line. **Do not open Phase 2** (engine / jurisdiction-factory WDLL).  
**Visual QA:** CLEARED 2026-07-23 (operator). Standing by for next call (PARTIALs / Phase 2 / breadth).

Gates already approved this session: A → B → C (cutover) → D (3.11 MET). Remaining finish work ran autonomously after Gate D go.

---

## 1. Live stack (parent-verified 2026-07-23 ~18:05 CT)

| Surface | Live value |
|---|---|
| `@empressaio/atom-contract` | **1.9.0** (`./reasoning` + `./property`) |
| hauska-engine `main` | **`4f98c9a`** (includes #101 overlay, #102 permit adapter, #103 gold bake) |
| hauska-retrieval-api | **`00015-2x8` @ 100%** |
| hauska-mcp-server | **`00026-fn5` @ 100%** (`5dc8fac`, I-K meter) |
| cortex-api | **`cortex-api-00430-hiz` @ 100%** (LDT #351 anti-zombie) |
| property-explorer | https://property-explorer-xi.vercel.app — hauska-map **`313ee2c`** (#50 Find bar + deep-link; prior #49 dual-serve) |
| Phase 1 visual QA | **CLEARED 2026-07-23 (operator)** — standing by; Phase 2 not opened |

---

## 2. Negative done-line (must all be false)

| Negative condition | Verdict | Evidence |
|---|---|---|
| Second envelope confidence path (multiply or T1/T2 old way) | **FALSE (cleared)** | `derive.ts` returns `confidence: null`; multiply grep on live path excl. tests = empty; CI `antiZombieConfidence.test.ts`; node-facets wire forces `envelope: null`; T1/T2 write `atom_path_pending` / absence, not multiply product |
| Jurisdiction literal in reasoning code | **FALSE** | prod `property-reasoning/**` TX/FIPS grep empty; cook_county_il_stub golden **PASS** |
| Paid read metered outside hauska-sdk | **FALSE** | Stripe `api.stripe.com` grep-clean; `McpMeteringGate.authorizeCall` on `00026`; `@hauska-sdk/metering@^0.1.1` |
| Licensed-source ref without inbound meter (free included) | **FALSE (cleared for ICC test path)** | free_anonymous `get_property_atom_chain` accrued `source_obligation_ledger` row owed to `did:hauska:actor:org:icc` |
| Atom overwrite in place | **FALSE (discipline held)** | StoragePort retire/version; gold bake uses contentHash/CID versions |
| Served value missing attribution/confidence/timestamp | **FALSE on atom path** | MCP + retrieval atoms carry sourceCitation, readContract axes, extractedAt |
| Stuffed life-safety consequence on property atoms | **FALSE** | property atoms use `consequence.kind: not-applicable` / property-risk |
| Honest-absence faked as null invent | **FALSE** | Bexar `no-zoning-stamp`; no-atom parcel `atom_path_pending` (not I-2) |

---

## 3. Master WDLL Phase-1 item grades (finish card)

| Item | Grade | One-line live evidence |
|---|---|---|
| 2.1–2.4 Phase 0 | **MET** (prior Gate A) | Spine home + Option A StoragePort bar |
| 2.5.1–2.5.3 | **MET** (prior Gate B) | contract 1.8.0/1.9.0 reasoning + property |
| 2.5.4 Source-obligation + ICC | **PARTIAL→inbound MET** | Inbound free-tier ICC ledger live; outbound RevenueRouter / commercial rates **PARTIAL** (Circle unset, pending-rate) |
| 3.1 StoragePort | **MET** | Neon `hauska_mcp` atoms + retrieval serve |
| 3.2 Atom kinds | **MET** | `@empressaio/atom-contract@1.9.0` `./property` |
| 3.3 Zoning FACT | **MET** | PE+MCP Hays RS; Bexar honest-absence |
| 3.4 Setback RULE | **PARTIAL** | Live exact+fieldProvenance; matcher ladder not all named |
| 3.5 Typed code cite | **MET** | `sourceCodeAtomRef.role=rule` |
| 3.6 Envelope DERIVED | **PARTIAL** | Live derived + overlay; named no-buildable-area exists in gold (`48021:33512` outcome); provisional-front-edge probe not fully graded |
| 3.7 Three-orchestrator retirement | **MET (envelope zombie cleared)** | LDT #351 + map #49 + engine #103; multiply gone; PE envelope never `cortex-fallback` (`atom-chain` \| `atom-pending`); `Tier1FacetPayload` type remains for baseFacts bake bag but **envelope stripped from live wire** |
| 3.8 Jurisdiction-agnostic | **MET** | golden + grep |
| 3.9 Referenced fields | **PARTIAL** | reference-field refs; landUse may still come from cortex facets |
| 3.10 Calibration overlay | **PARTIAL** | Read-through MET; breadth feeds Austin+San Marcos+San Antonio+Cedar Park+New Braunfels wrote; Hays overlay `0.73/backtest/n=119`; bastrop_mygov + grand still PARTIAL |
| 3.11 SDK money boundary | **MET** (Gate D) | authorize-time SDK; Stripe retired; Circle settlement **PARTIAL** (placeholder secrets) |
| 3.12 Central-TX re-bake | **MET** | Breadth 2026-07-24: 10/10 metro full Tier1 bake (~2.48M atoms); live spot-audit; milestone `_inbox/2026-07-24_BREADTH_COVERAGE_MILESTONE_central_tx.md` |
| 3.13 Three consumers same IDs | **PARTIAL** | (a) MCP MET; (b) PE BFF atom-chain MET; (c) report identity **not claimed** |

---

## 4. Verbatim live proofs (parent)

### 4a. PE anti-zombie envelope path

```
48209:156346 path=atom-chain zoning=RS envelope=ok
48029:410119 path=atom-chain zoning=null envelope=declined decline=no-zoning-stamp
48453:907247 path=atom-chain zoning=SF-R envelope=ok
48055:99991  path=atom-pending zoning=null envelope=declined decline=atom_path_pending
```

No `cortex-fallback`. Cortex revision `00430-hiz` still up for landUse/flood / rollback of non-envelope surfaces.

### 4b. Overlay + permit fuel (Hays envelope)

```json
"assertedConfidence": { "estimate": 0.88, "provenance": "asserted" }
"calibratedConfidence": { "estimate": 0.73, "n": 10, "provenance": "backtest" }
```

(Adapter-driven; supersedes Gate C hand-seed 0.71.)

### 4c. I-K free-tier ICC accrual (from Gate finish agent; schema confirmed on main)

Anonymous chain read accrues:

```json
{
  "source_actor_did": "did:hauska:actor:org:icc",
  "atom_did": "did:hauska:setback-rule:48209:156346",
  "tool": "get_property_atom_chain",
  "product": "public",
  "tier": "free_anonymous",
  "obligation_type": "license-reference-royalty",
  "amount_minor": null,
  "grace_terms": "pending-rate"
}
```

### 4d. Greps

- Live-path multiply (excl. tests): **empty**
- Engine prod TX literals in property-reasoning: **empty**
- MCP `api.stripe.com`: **empty**
- Golden: `cook_county_il_stub` **1 passed**

### 4e. Coverage ledger

Committed: `hauska-engine/packages/engine-core/src/property-reasoning/fixtures/central-tx-gold-coverage-ledger.json`  
Totals: parcels=8, atomsWritten=16, approx Neon compute under $1 (I-H note). Full-county (~984k) deferred.

---

## 5. PRs this finish wave

| Repo | PR | SHA |
|---|---|---|
| hauska-engine | [#101](https://github.com/empressaioemail-tech/hauska-engine/pull/101) overlay | in `bc5c84c`… |
| hauska-engine | [#102](https://github.com/empressaioemail-tech/hauska-engine/pull/102) permit adapter | `fde33ae` |
| hauska-engine | [#103](https://github.com/empressaioemail-tech/hauska-engine/pull/103) gold bake | `4f98c9a` |
| legacy-design-tools | [#351](https://github.com/empressaioemail-tech/legacy-design-tools/pull/351) anti-zombie | `75a7b6b` |
| hauska-map | [#49](https://github.com/empressaioemail-tech/hauska-map/pull/49) retire cortex envelope fallback | `3d02cea` |
| hauska-mcp-server | [#46](https://github.com/empressaioemail-tech/hauska-mcp-server/pull/46) I-K inbound | `5dc8fac` |

---

## 6. Operator-owned residuals (not invented)

1. **Circle secrets** in `hauska-prod-497015`: replace placeholder `absent` with real `CIRCLE_API_KEY`, `CIRCLE_MERCHANT_WALLET_ID`, `HAUSKA_CHECKOUT_BASE_URL`; redeploy MCP → clears 3.11 settlement PARTIAL.
2. **ICC commercial rates** on actor licensing terms (outbound RevenueRouter $ amounts).
3. **Full-county atom re-bake** (3.12 finish) when ready for national seed — gold set is the Phase-1 anti-zombie minimum.
4. **Report consumer identity** (3.13c) — not proven this wave.
5. **Bastrop / Grand County permit feeds** need partner secrets or alternate public bulk source.

---

## 7. Dual-serve / cortex retirement status

| Step | Status |
|---|---|
| Retire multiply across route+T1+T2 | **DONE** |
| PE envelope critical path cortex-fallback removed | **DONE** (`atom-chain` \| `atom-pending`) |
| Unset `PROPERTY_ATOM_PATH` | **N/A as rollback lever** — flag remains `1` as atom-path enable; dual-serve *envelope* fork is gone. Cortex still serves landUse/flood / anonymous facets for non-envelope. |
| Retire cortex entirely | **NOT done** — would strand landUse/R1 until those facets atomize. Envelope zombie path is retired. |

---

## 8. Hand-back decision

Phase-1 finish line is reached for the **anti-zombie + money + ICC inbound + earning-loop seed** commitments, with named PARTIALs above.

**Do not open Phase 2** until operator accepts this card (or amends the PARTIALs into the Phase-2 annex explicitly).

Reviewing planner: verify sections 2–4 against live URLs/revisions. Operator: accept / amend / queue residuals.
