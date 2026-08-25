---
id: 2026-08-25_property_govtech_wave1_pickup
title: Property seat pickup — govtech Wave 1 substrate chain
status: active
date: 2026-08-25
from: govtech planner (doc_repo)
to: property seat
owner: property
related:
  - _decisions/2026-08-25_govtech_wave1_interim_engine_path
  - _decisions/2026-08-25_govtech_wave1_execution_rulings
  - _inbox/2026-08-24_govtech_program_scope
  - _inbox/2026-08-24_govtech_transaction_contract
  - _inbox/2026-08-24_govtech_smartsite_findings_relay
  - 90_operations/OPS-17_govtech_stack_plan_of_record
plan_rows: G-105, G-109
---

# Property seat pickup — govtech Wave 1

Read this before touching hauska-engine, legacy-design-tools engine paths, or atoms backfill for govtech. Govtech does not write property repos; request via this pickup or a compiled dispatch.

**Snapshot:** doc_repo main working tree 2026-08-25. Wave 1 program scope rev 3. Interim engine path: `_decisions/2026-08-25_govtech_wave1_interim_engine_path.md` (active).

## Why property is on the Wave 1 critical path

Wave 1 runs on `template-city` with the **interim engine hop** (plan-review → legacy-design-tools api-server → engine-api). Property owns:

- **hauska-engine** atoms writer and corpus (S4-5, S4-6, DEPLOY-361)
- **legacy-design-tools** finding retrieval path (defect #7, #8 when interim touches engine)
- **L2** latent bypass (`load-snapshot-into-pg.mjs`)

Substrate meter and govtech product surfaces cannot close G-109 or G-110 until property delivers the chain below in order.

---

## Work items (property seat)

### 1. DEPLOY-361 — engine-api writer fix live

| Field | Value |
|---|---|
| PR | hauska-engine **#361** MERGED |
| Scope | `resolveAccessPolicyOrRefuse` on atoms writer; refuse `?? "public-free"` default (defect #5) |
| Gate | G-105 deploy cut + live violation probe |
| Probe | Attempt write with unresolved accessPolicy; serving revision must refuse, not default |

Merged ≠ live. Govtech grades ICC accrual and G-110 only on deployed revision.

### 2. S4-5 — writer refuse before backfill

Fix and deploy **before** S4-6. Scope doc ordering constraint 2: backfill before writer fix is undone by the next ingest.

Includes stamping all four ICC atom types (today only `code-section` is stamped). Pairs with DEPLOY-361.

### 3. L2 — `load-snapshot-into-pg.mjs` bypass

| Field | Value |
|---|---|
| Instance | L2 in scope rev 3 latent register |
| Location | `packages/storage/scripts/load-snapshot-into-pg.mjs` (~lines 107, 197) |
| Defect | Writes `inst.accessPolicy ?? "public-free"` direct to Postgres; bypasses `resolveAccessPolicyOrRefuse` |
| Blocks | S4-5 closure, S5-2b bypass inventory |

**Ruling inherited:** `_decisions/2026-08-24_osm_roads_boundary_public_free.md` — script stays ops-only; no card to bless the bypass. Either route through writer refusal or document ops-only with a CI grep that fails if a live ingest path imports it.

Relay: `_inbox/2026-08-24_govtech_smartsite_findings_relay.md` section 3.

### 4. S4-6 — ICC atom backfill (blocked on DSN)

| Field | Value |
|---|---|
| Item | S4-6 in scope rev 3 |
| Depends | S4-5 deployed |
| Blocker | **`hauska_mcp` DSN** not in property seat context |
| Chain | G-109 dispatch |

Backfill existing mis-stamped ICC rows **after** writer refuse is live. Ordering constraint 8: S4-6 before G-50 accessPolicy flip (S4-12). Substrate L5 (ICC withhold compensating mis-stamps) retires after backfill proves clean.

**Operator action:** provide or confirm DSN path for property seat (`%USERPROFILE%\.empressa\` pattern or seat register entry). Without DSN, property reports blocked, not partial.

### 5. Defect #7 — retrieval failure → empty success (if touching engine path)

| # | Instance | Repo |
|---|---|---|
| 7 | Retrieval failure caught into `codeSections = []`; run completes `succeeded` | legacy-design-tools `findings.ts` |

Required for interim path honesty (S2-8 typed absence). Import `isSubstrateRetrievalError` / branch to `lookup-failed`, not empty array. Contract rule 2.

**Touch gate:** fix when interim hop work modifies `legacy-design-tools/artifacts/api-server/src/routes/findings.ts` or engine-api retrieval boundary. Do not defer silently if G-108 honesty probes fail on this shape.

### 6. Defect #8 — repealed B3 setbacks served as current (if touching engine path)

| # | Instance | Repo |
|---|---|---|
| 8 | Repealed B3 setbacks served over HTTP as current law; repeal is comment-only | legacy-design-tools |

S2-12 tracks schema `repealedOn`; defect #8 is the live HTTP serve. Fix or honest refuse when engine path is touched for Wave 1.

---

## Dependency order (execute in this sequence)

```
DEPLOY-361 live (S4-5 on serving revision)
    ↓
L2 closed or declared ops-only with armed grep
    ↓
S4-6 backfill (requires hauska_mcp DSN)
    ↓
Defect #7 / #8 fixes on engine path (same PR series if interim work touches ldt)
```

Parallel constraint: DEPLOY-361 must not lag DEPLOY-75 (substrate); govtech G-105 runs both probes in one deploy cut.

---

## What govtech needs back (deliverables)

Return to govtech planner with evidence, not narration. Each row names what unblocks which govtech row.

| # | Deliverable | Unblocks govtech | By when (dependency order) |
|---|---|---|---|
| 1 | DEPLOY-361 live probe artifact (violation + pass on serving digest) | G-105, G-108 code path | **First** — before any real determination on template-city |
| 2 | L2 disposition (writer-routed or ops-only + grep) | G-109 S4-5 sign-off, S5-2b | With #1 |
| 3 | S4-6 backfill count + spot-check query on ICC-by-tenant atoms | G-109, S4-12, L5 withhold retirement | After #1; **blocked until DSN** |
| 4 | Defect #7 fix deployed or explicit refuse on retrieval failure | G-108 typed absence, interim path | Before G-110 E2E |
| 5 | Defect #8 fix or honest decline on repealed B3 | G-108 corpus fidelity | Before G-110 if B3 in template-city matrix |
| 6 | Leave-behind: branch names, serving revision digests, probe JSON paths | Planner close | Each deploy |

**Hard dates:** Wave 1 interim sunset per `_decisions/2026-08-25_govtech_wave1_interim_engine_path.md` — 2026-09-30 or S5-5 graded, whichever first. Property chain items 1–3 are on the critical path to G-110; item 3 cannot start without operator DSN.

---

## What NOT to do

- Do not start S2-1 engine migration into plan-review (blocked on DOC-5 / ADR-023 ratification).
- Do not backfill (S4-6) before writer refuse (S4-5) is on serving revision.
- Do not treat merged PR #361 as customer-done; deploy + probe only.
- Do not use property seat LDT/PE dirty trees for Wave 1 gold; pin `origin/main` for govtech-facing work.
- Doc_repo commits are planner-owned; property leaves code in product repos and files close JSON to `_inbox/` when dispatched.

---

## Key docs (read order)

1. `_decisions/2026-08-25_govtech_wave1_interim_engine_path.md`
2. `_inbox/2026-08-24_govtech_program_scope.md` — defect register #5–8, Wave 1 critical path step 4, ordering constraints 2 and 8
3. `_inbox/2026-08-24_govtech_transaction_contract.md` — rules 2, 5, field ownership citations
4. `_state/property/STATE.md` — property seat snapshot (read at pickup, do not write doc_repo STATE)

## Dispatch

When operator assigns lane work: `node scripts/dispatch.mjs --plan OPS-17 --lane <ID> --plan-row G-105` or `G-109`. Cite WDLL acceptance items and this pickup path.
