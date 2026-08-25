---
id: 2026-08-25_substrate_govtech_wave1_pickup
title: Substrate seat pickup — govtech Wave 1 MCP meter chain
status: active
date: 2026-08-25
from: govtech planner (doc_repo)
to: substrate seat
owner: substrate
related:
  - _decisions/2026-08-25_govtech_wave1_execution_rulings
  - _inbox/2026-08-24_govtech_transaction_contract
  - _inbox/2026-08-24_govtech_program_scope
  - 90_operations/OPS-17_govtech_stack_plan_of_record
plan_rows: G-105, G-109
---

# Substrate seat pickup — govtech Wave 1

Read this before deploying hauska-mcp-server #75 or touching obligation ledger / envelope builders for govtech Wave 1. Substrate owns MCP meter, citation mint shape, and `source_obligation_ledger`. Govtech owns product surfaces; property owns atoms writer backfill (paired).

**Snapshot:** doc_repo 2026-08-25. Execution rulings provisional: `_decisions/2026-08-25_govtech_wave1_execution_rulings.md` (O-3 cited billable, O-5 substrate mints citations).

---

## Work items (substrate seat)

### 1. DEPLOY-75 — MCP meter + detector fixes live

| Field | Value |
|---|---|
| PR | hauska-mcp-server **#75** MERGED |
| Scope | Plan-review tool meter bypass fix; ICC detector reconciliation (S4-2, S4-4 partial) |
| Gate | G-105 deploy cut + live violation probe |
| Probe | Codex plan-review tool call accrues to ledger; pre-fix revision under-counts |

**Ordering constraint 3 (scope rev 3):** deploy meter bypass **before** setting a real ICC rate. A real number over an under-counting meter is silent underpayment.

Merged ≠ live. Grade on serving MCP revision digest, not `latestReadyRevisionName` alone.

Known bypass (pre-#75): `wrap()` in `plan-review-tools.ts` hardcodes empty provenance; `logToolRead` never fires. Contract cites this as the reason accrual is zero on plan-review MCP path.

### 2. S4-0 — migration 009 applied probe

| Field | Value |
|---|---|
| Migration | `hauska-mcp-server/migrations/009_source_obligation_ledger.sql` |
| Item | S4-0 on Wave 1 critical path step 4 |
| Question | Is table present on deployment Neon, and do inserts succeed? |

**Two diagnoses, same empty observation** (doctrine: state both):

- Table unapplied → every accrual throws into swallowed catch in `accrueSourceObligations`
- Table applied, no traffic → legitimately empty

**Settling probes** (run against MCP server Neon, read catalog not query shape):

```sql
SELECT to_regclass('public.source_obligation_ledger');
SELECT count(*) FROM source_obligation_ledger;
```

Also confirm migrations 008–009 status in deployment migration table if present.

File probe output to `_inbox/` close artifact or scratch with timestamp. Govtech G-109 cannot close S4-1b without S4-0 green.

### 3. S4-3 — populate `sourceActorDid` on envelope builders

| Field | Value |
|---|---|
| Item | S4-3 in scope rev 3 |
| Gap | ~3 of ~20 envelope builders stamp `sourceActorDid`; ICC sections accrue zero |
| Depends | None for code; pairs with DEPLOY-75 for live proof |

**Execution ruling O-5:** substrate mints citations; `sourceActorDid` on citation is load-bearing for meter (null means public record, not unknown). Unresolved actor → refuse serve as citable section, fail closed.

Align with S4-4 single ICC detector definition exported from one module (`access-policy.ts` vs `source-obligation-meter.ts` tenant mismatch documented in transaction contract).

---

## Dependency order

```
S4-0 probe (migration 009 applied?)
    ↓
DEPLOY-75 live + violation probe
    ↓
S4-3 sourceActorDid on all envelope builders
    ↓
(property S4-6 backfill — parallel after property S4-5; substrate validates accrual rows)
    ↓
S4-7 cited atom shape + S4-1b reconciliation (govtech/substrate paired)
```

DEPLOY-75 and property DEPLOY-361 are **same G-105 deploy cut** from govtech's view; substrate must not lag property writer fix if accrual probes run together.

---

## What govtech needs back (deliverables)

| # | Deliverable | Unblocks govtech | By when |
|---|---|---|---|
| 1 | S4-0 probe transcript (`to_regclass`, row count, migration status) | G-109 S4-8 reader, accrual honesty | **Before** DEPLOY-75 probe interpreted |
| 2 | DEPLOY-75 live probe (deliberate violation fails pre-fix; passes on serving) | G-105, G-109, O-1 rate block lift | With G-105 deploy cut |
| 3 | S4-3 completion evidence (builder inventory + spot ICC serve accrues non-zero `sourceActorDid`) | G-109 chain, O-5 mint path | After #2 |
| 4 | Serving revision digest + traffic percent JSON (read fields by name, not positional CLI) | Planner STATE, G-110 | Each deploy |

**Blocked on property:** S4-6 backfill proves stamped atoms in store; substrate validates accrual rows match citation quadruple after property delivers.

**Blocked on operator:** O-3 `cited` billable ruling provisional until confirm; S4-B1 ICC rate agreement still operator/commercial.

---

## Accrual shape govtech expects (post-rulings)

Per transaction contract + `_decisions/2026-08-25_govtech_wave1_execution_rulings.md`:

| Field | Wave 1 rule |
|---|---|
| `referenceKind` | `served` recorded, not billed; `cited` billable when rate exists |
| `citation` | quadruple + `bodyDisposition` denormalized at write |
| `rateBasis` | `unrated` until S4-B1; never nullable disagreeing columns |
| Write atomicity | Serve + accrual commit together or serve declines (no detached `void async`) |

---

## What NOT to do

- Do not set real ICC rate (S4-9) before DEPLOY-75 probe + Wave 1 accrual probe pass.
- Do not treat PR #75 merge as deployed.
- Do not read multi-field gcloud output through positional `--format=value(a,b,c)`.
- Govtech does not write hauska-mcp-server; substrate does not write plan-review/smart-files.
- Doc_repo commits planner-owned.

---

## Key docs

1. `_inbox/2026-08-24_govtech_transaction_contract.md` — accrual record, O-3/O-5 OPEN (now provisionally ruled)
2. `_inbox/2026-08-24_govtech_program_scope.md` — S4-0 through S4-8, ordering constraint 3, L5
3. `_decisions/2026-08-25_govtech_wave1_execution_rulings.md` — O-3, O-5
4. `_state/substrate/STATE.md` — read at pickup

## Dispatch

`node scripts/dispatch.mjs --plan OPS-17 --lane MCP --plan-row G-105` or `G-109`. Cite acceptance items from frozen WDLL when filed.
