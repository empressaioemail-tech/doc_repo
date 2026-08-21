---
id: blueprint_50_grading
title: Master blueprint — grading
status: draft
last_updated: 2026-08-21
compiled_at_commit: 4b174d1b129fa9eee54464967fe7da2b03828a72
applies_to: portfolio
related: [_blueprint/40_rule_register, _blueprint/00_WDLL]
---

# Master blueprint — grading

How to score any artifact against this blueprint. Output is a **list of rule ids** (pass/fail/starved/missing), not a percentage.

Executable by hand today. Steps marked **[AUTO candidate]** are R-06 tooling targets.

## Inputs required

1. Artifact under test (writer, store sample, document, dataset, CI job).
2. Blueprint `_blueprint/40_rule_register.md`.
3. Evidence source: code read, live query with timestamp, or canon cite.
4. Snapshot: doc_repo commit + store endpoint if live.

## Procedure

### Step 1 — Classify artifact

| Kind | Examples | Primary rule bands |
| --- | --- | --- |
| Writer / adapter | fema-nfhl-bulk-v1, cad-property-owner-v1 | BP-ADAPT-01, BP-KEY-01, BP-EDGE-01 |
| Store / table | atoms, atom_links, county_ledger_snapshot | BP-EDGE-01, BP-LEDGER-01, BP-PARCEL-KEY-01 |
| Read path | cortex retrieval, smartsite facets | BP-ACCESS-01, BP-SERVE-01, BP-ADDRESS-01 |
| Document / ADR | ADR-028 | BP-BITEMP-01, mesh status in 00_README |
| Factory / job | Factory 1.5 sweep | BP-FACTORY-01, BP-LAND-01 |

### Step 2 — Select applicable rules

Include every rule whose consumer touches this artifact or whose bypass path this artifact uses. Do not subtract rules by omission.

### Step 3 — For each rule, record

```
rule_id:
  verdict: PASS | FAIL | STARVED | NOT_APPLICABLE
  evidence: <file:line, query, or observation>
  second_mechanism: <alternative explanation considered>
  rejected_because: <why>
```

**FAIL** = artifact violates imperative statement.

**STARVED** = rule exists, executor exists or typed, but input never supplied (store audit pattern).

**PASS** = meaning-shaped evidence of compliance OR honest UNENFORCED with no false claim.

### Step 4 — Meaning-shaped spot checks (property writers)

When grading a writer, run at least one:

1. **County binding check [AUTO candidate]:** body county vs entity_id county — pattern from `three-layer-audit.mjs`.
2. **Parcel bind check [AUTO candidate]:** sample N fact rows; resolve parcel-node by parcelNodeId; report unresolved / key_shape_mismatch rates (store audit Q8 method).
3. **Edge check [AUTO candidate]:** COUNT atom_links applies-to for writer's entity_types — expect >0 if BP-EDGE-01 applies.

If only presence checks pass, verdict is **UNMEASURED**, not PASS.

### Step 5 — Violation set regression (blueprint self-grade)

When grading **the blueprint itself**, run D4 from `00_WDLL.md`: for each V1–V15, confirm `40_rule_register.md` D4 table names rule id + failing sentence. Missing row = blueprint fail.

Expected: V10 → MISSING RULE BP-FACTORY-01 filed R-04.

### Step 6 — Output format

```yaml
graded_at: ISO8601
snapshot:
  doc_repo: <sha>
  store: <endpoint + timestamp if used>
artifact: <description>
rules:
  - id: BP-KEY-01
    verdict: FAIL
    evidence: externalKeys 0/1025 store audit Q5
  - id: BP-FACTORY-01
    verdict: MISSING
    evidence: R-04 filed
missing_rules: [BP-FACTORY-01]
starved_rules: [BP-EDGE-01, BP-ABSENCE-01, ...]
```

## Grading by artifact type (quick reference)

| Artifact | Minimum rule set |
| --- | --- |
| New county ingest writer | BP-KEY-01, BP-PARCEL-KEY-01, BP-ADAPT-01, BP-EDGE-01, BP-ABSENCE-01, BP-ACCESS-01 |
| MCP retrieval change | BP-ACCESS-01, BP-LICENSE-01, BP-SERVE-02 |
| ADR proposing contract fields | BP-BITEMP-01, mesh AUTHORITATIVE rules in 00_README |
| Launch gate change | BP-LEDGER-01 (must fire red on negative cell) |
| Factory runner | BP-FACTORY-01, BP-LAND-01 |

## Automation candidates (P6 / R-06)

| Step | Rule ids | Instrument idea |
| --- | --- | --- |
| Parcel key grammar scan | BP-PARCEL-KEY-01, BP-KEY-SENTINEL-01 | SQL shape mask on entity_id sample |
| Starvation dashboard | all STARVED | Periodic sample of contract fields in body |
| Edge coverage | BP-EDGE-01 | applies-to count by entity_type / writer |
| Ledger variation | BP-LEDGER-01 | ASSERT variance >0 post-R-09 |
| Check violation test | BP-VERIFY-01 | CI injects known bad row |

## Hand grading example (abbreviated)

**Artifact:** `fema-nfhl-bulk-v1` writer (2026-08-20 store)

| Rule | Verdict | One-line evidence |
| --- | --- | --- |
| BP-FLOOD-01 | FAIL (historical) | tier2 centroid path; retired |
| BP-EDGE-01 | STARVED | 0 applies-to for flood-hazard-fact |
| BP-PARCEL-KEY-01 | FAIL | 7/100 key_shape_mismatch Q8 |
| BP-KEY-01 | FAIL | entity_id borrows prop_id |

No percentage computed. Five rule ids tell the remediation story.

## What grading is not

- Not a jurisdiction count scoreboard.
- Not OPS-16/OPS-17 plan row status.
- Not `_STATE.md` snapshot (grades **ought**, not **is** unless evidence cited).
