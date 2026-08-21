---
id: blueprint_30_lifecycle
title: Master blueprint — lifecycle
status: draft
last_updated: 2026-08-21
compiled_at_commit: 4b174d1b129fa9eee54464967fe7da2b03828a72
applies_to: portfolio
related: [_blueprint/20_pipeline, 51_ingestion_pipeline_reference]
---

# Master blueprint — lifecycle

States and gates for data from acquisition through customer serve. Gates name **what must be true**; consumers in `40_rule_register.md`.

## State machine

```
ACQUIRED → LANDED → CANDIDATE → RESOLVED → RECONCILED → INDEXED → SERVED
                ↓                    ↓
            (retention           PROVISIONAL
             expires)                ↓
                              ADJUDICATED → promoted to RESOLVED
```

| State | Meaning | Store evidence |
| --- | --- | --- |
| **ACQUIRED** | Bytes fetched with checksum | Work root / acquisition log |
| **LANDED** | Immutable raw retained per class | `neondb` staging, GCS |
| **CANDIDATE** | Adapter output, no canonical binding | Pre-write buffer (often skipped in practice) |
| **RESOLVED** | Canonical node id assigned | `entity_id` on atom |
| **PROVISIONAL** | Resolved but identity unconfirmed | Flag + queue (underfed) |
| **RECONCILED** | Coexists with prior atoms without silent conflict | Conflict atoms or supersession |
| **INDEXED** | Row in `atoms` + optional `atom_links` | `hauska_mcp` |
| **SERVED** | Read path returns value to customer | Live GET |

## Transitions and gates

### ACQUIRED → LANDED

**Gate BP-LAND-01:** Manifest retention class honored; checksum recorded.

**Trigger:** Acquisition job complete.

**Failure:** Landing refuse if retention policy blocks write.

**Consumer:** Acquisition scripts (per-source; no unified CI).

### LANDED → CANDIDATE

**Gate BP-ADAPT-01:** Adapter registered; emits six-field candidates only.

**Trigger:** Canonicalisation job start.

**Failure:** Adapter throw; no partial graph write.

### CANDIDATE → RESOLVED

**Gate BP-RESOLVE-01:** Canonical key minted; node type explicit; resolution atom recorded.

**Gate BP-PARCEL-KEY-01:** Parcel keys normalized to single grammar before bind.

**Trigger:** Resolution tier success.

**Failure:** Route to adjudication (T3) or refuse — never silent default type.

**Bypass:** Direct ingest writing `entity_id` from source (V1, V12).

### RESOLVED → RECONCILED

**Gate BP-RECON-01:** Meaning-shaped cross-store check before supersede.

**Trigger:** Second source for same node.

**Failure:** Emit `divergenceObservationCount` / conflict atom — field starved (V7).

### RECONCILED → INDEXED

**Gate BP-WRITE-01:** Atom append accepts only canonical bindings.

**Gate BP-EDGE-01:** Property facts write `applies-to` link to parcel-node.

**Gate BP-ABSENCE-01:** Verified absence pair when claiming "none found".

**Gate BP-ACCESS-01:** Explicit `accessPolicy`; no default on omit.

**Trigger:** Storage port write / bulk apply.

**Failure:** Refuse write (intended); defaults bypass in retrieval (V3).

### INDEXED → SERVED

**Gate BP-SERVE-01:** Layer 4 read path reads indexed graph only; retired sources repointed.

**Gate BP-SERVE-02:** Address and facet fields pass meaning-shaped validation.

**Gate BP-LICENSE-01:** Gate intersects accessPolicy ∩ license (starved — license field empty).

**Trigger:** Customer GET / MCP tool.

**Failure:** Refuse or degrade with declared degradation — never silent null vs wrong value.

### PROVISIONAL → RESOLVED (promotion)

**Gate BP-PROMOTE-01:** Adjudication outcome recorded; queue depth measured.

**Trigger:** Operator or auto-adjudication above threshold.

**Failure:** Provisional population monotonic growth = gate fail.

## Scored / certified (parallel track)

County manifest cells pass through **materialized ledger** (`county_ledger_snapshot`):

| Indicator | Required variation | Observed 2026-08-20 |
| --- | --- | --- |
| `hasWriter` | true/false per cell | **constant** all 3,556 cells (V5) |
| `atomFamilyState` | varies by coverage | **constant** (V5) |
| `isPartial` | varies | varies (only working indicator) |

Launch criteria graded by constant indicators **cannot fail** — instrument repair is R-09, not model change.

## Retirement lifecycle

When a store or adapter retires (tier2 flood):

1. Stop new writes.
2. **Repoint all L4 consumers** to successor binding.
3. Prove retirement by decline (404 / empty with explicit basis).

Skipping step 2 → V9.

## Factory lifecycle (operator observation)

Factory can **start** (P-21/P-22 sweep, onboarding runners). **No defined termination** — V10; rule BP-FACTORY-01 filed as MISSING (R-04).
