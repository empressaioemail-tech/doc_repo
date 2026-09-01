---
id: 2026-08-09_E3_elgin_adversarial_review
title: E3-ADV adversarial review — Elgin unified dry-run (W5 F3)
date: 2026-08-09
status: final
owner: E3-ADV
related: [_dispatches/2026-08-09_W5_depth_factory_dispatch_pack.md, _inbox/2026-08-09_E3_elgin_builder_close.json]
---

# E3-ADV adversarial review — Elgin (48021)

**Reviewer:** E3-ADV (independent of E3 builder)  
**Reviewed at:** 2026-08-09T19:40Z (UTC)  
**Apply executed by reviewer:** no (explicit STOP honored)

## Verdict

**blocked** — not apply-ready.

Named blockers (in dependency order):

1. **B1 `missing_parcel_node_anchors_48021`** — live atoms DB has zero `parcel-node` rows for Bastrop (`did:hauska:parcel-node:48021:*`). Unified runner correctly refuses the full cohort at C1/C5 preflight.
2. **B2 `atoms_bulk_slot_not_free`** — anchor mint remains unauthorized until Handoff D lanes release the atoms bulk slot (`_STATE.md` W5 E3 note). Executor correctly did not mint.
3. **B3 `legacy_counter_parity_deferred`** — unified vs legacy counter parity (0-mismatch gate) cannot pass until B1 is cleared; mismatch is explained by substrate + gate, not shown to be a unified-runner regression.

**HOLD** would apply only after B1+B2 clear and a re-run shows non-degenerate warm outcomes; this review does not upgrade to apply-ready or HOLD-with-conditions beyond documenting the above.

---

## Attack frame (source-verified)

### 1. Parcel-node count for 48021 (DATABASE_URL)

**Method:** `gcloud secrets versions access latest --secret=DATABASE_URL --project=hauska-prod-497015`, then independent query via engine-core `postgres` client (reviewer script, not builder artifact).

**Query:**

```sql
SELECT count(*)::int
FROM atoms
WHERE entity_type = 'parcel-node'
  AND atom_did LIKE 'did:hauska:parcel-node:48021:%';
```

**Result:** `0` at `2026-08-09T19:37:41.508Z`.

**Spot checks (5 roster parcels):** `48021:103412`, `48021:104923`, `48021:105013`, `48021:105014`, `48021:105015` — all **absent** in atoms DB.

**Grade:** Builder blocker B1 **CONFIRMED** at source.

### 2. Unified dry-run counters vs log + refused roster

**Artifacts:** `_inbox/2026-08-09_E3_elgin_dryrun_artifact.json`, `_inbox/2026-08-09_E3_elgin_unified_dryrun.log`, `_inbox/2026-08-09_E3_elgin_refused_roster.json`.

| Field | Artifact | Log JSON | Roster re-derive |
|---|---:|---:|---:|
| `no-parcel-node-anchor` | 500 | 500 | 500 / 500 parcels |
| `verifyPass` | 0 | 0 | n/a (preflight) |
| `anchorsFound` (preflight) | 0 | 0 | n/a |

Preflight log line matches artifact verbatim (`declined:500`, `declinesByCode.no-parcel-node-anchor:500`).

**Grade:** Builder counter narration **CONFIRMED**; no inflation or roster/log drift detected.

### 3. Legacy `depth-warm-elgin-batch.mjs` at `4bfff71` (executor-error check)

**Method:** Clean git worktree at commit `4bfff71` (`fix(depth-warm): close dry-run compute fork on boundary primitive read (#279)`), same env secrets, command:

`pnpm --filter @hauska-engine/engine-core run depth-warm-elgin-batch -- --dry-run --city-cohort`

**Independent outcomes (reviewer run, full log `P:/tmp/e3_adv_legacy_full.log`):**

- `verifyPass`: **102**
- `verifyFail`: **72**
- declines: `already-promoted` 276, `no-setback-row` 32, `no-road-adjacency` 10, `other` 8 (sums to 500 with verify outcomes)

Matches builder `_inbox/2026-08-09_E3_elgin_legacy_dryrun.log` and dryrun artifact `legacy_comparison` block **exactly**.

**Interpretation:** Legacy path at `4bfff71` still performs warm/verify without the unified C1/C5 parcel-node preflight gate; it is **not** evidence that the unified runner is broken. Unified 500/500 preflight refusals with zero anchors is the expected fail-closed behavior.

**Grade:** Builder legacy comparison **CONFIRMED**; not an executor transcription error.

### 4. E3-4 dry-must-predict-apply (`depth-warm-city-batch.mjs`)

**Method:** Static audit on engine `@41cfdb4` unified script (present on current workspace HEAD containing PR #287 merge).

Findings:

- No `if (dryRun)` branches that skip read/compute paths (only connection pool sizing and promote/storage/ledger gates).
- Comment at L329-330 documents intent: dry-run reads boundary primitives; writes gated on `!dryRun`.
- `warmThenVerify` (`warm-then-verify.ts`) always calls `computeWarmCandidate` before verify; `storage: undefined` / `promote: false` under dry-run suppresses **promote only**, not compute.
- **Caveat:** This Elgin cohort never entered the parcel loop (preflight declined all 500), so compute-path parity was **not exercised live** on unified runner this run. Code audit passes; runtime proof waits on B1.

**Grade:** Pre-registered **E3-4 PASS** (code-level); runtime exercise **NOT EXERCISED** (substrate block).

### 5. Pre-registered expectations crosswalk

Source: `_inbox/2026-08-09_E3_elgin_preregistered_expectations.json`

| ID | Builder result | ADV independent grade |
|---|---|---|
| E3-1 parcel-node anchors | FAIL | **CONFIRM** (500/500 anchor declines; DB count 0) |
| E3-2 legacy parity | FAIL_WITH_DOCUMENTED_CAUSE | **CONFIRM** cause (zero anchors + C1/C5 gate vs legacy no-gate); parity gate correctly not met |
| E3-3 bulkBcad decline surface | NOT_EXERCISED | **CONFIRM** (preflight blocked BCAD loop) |
| E3-4 dry predict apply | PASS | **CONFIRM** (static); note runtime not exercised |
| E3-5 R28/R30 exercised | FAIL | **CONFIRM** on unified; legacy run exercised verify paths only |

---

## Engine / dispatch alignment

- Expected PR #287 SHA `41cfdb4c5486d5ef9f6745b06da72065fab131fd` resolves in repo (`41cfdb4`).
- Builder `apply_executed: false` and dispatch STOP **honored** by builder and reviewer.

---

## Planner next actions (unchanged from builder close, ADV-endorsed)

1. Release atoms bulk slot after Handoff D D0/D1.
2. Mint `48021` parcel-node anchors for Elgin city cohort via established writer path.
3. Re-run unified `--row-id=Elgin --dry-run --city-cohort`; expect legacy bucket parity within 0-mismatch once `anchorsFound > 0`.
4. Only then consider apply (planner go + slot + E3-ADV re-review).

---

## Evidence paths (non-secret)

- Builder close: `P:\doc_repo\_inbox\2026-08-09_E3_elgin_builder_close.json`
- Dry-run artifact: `P:\doc_repo\_inbox\2026-08-09_E3_elgin_dryrun_artifact.json`
- Pre-registered expectations: `P:\doc_repo\_inbox\2026-08-09_E3_elgin_preregistered_expectations.json`
- Refused roster: `P:\doc_repo\_inbox\2026-08-09_E3_elgin_refused_roster.json`
- Unified log: `P:\doc_repo\_inbox\2026-08-09_E3_elgin_unified_dryrun.log`
- Legacy log (builder): `P:\doc_repo\_inbox\2026-08-09_E3_elgin_legacy_dryrun.log`
- ADV legacy re-run log: `P:\tmp\e3_adv_legacy_full.log` (local temp; not committed)
- ADV DB probe timestamp: `2026-08-09T19:37:41.508Z`, count `0`
