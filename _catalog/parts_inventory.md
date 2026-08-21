---
id: parts_inventory
title: Parts inventory and termination conditions (R-03)
status: draft
last_updated: 2026-08-21
owner: nick
related: [90_operations/OPS-18_canon_reconciliation_plan_of_record, _blueprint/30_lifecycle, 90_operations/OPS-13_store_topology]
---

# Parts inventory — R-03

**Snapshot:** `4b174d1` @ `P:/tmp/r03-parts`, compiled 2026-08-21T02:15:00Z.

## Summary

| Metric | Value |
| --- | --- |
| Total parts | 99 |
| LIVE | 44 |
| IDLE | 27 |
| DORMANT | 10 |
| ZOMBIE | 14 |
| UNKNOWN | 4 |

### By kind

- **factory**: 4
- **service**: 9
- **app**: 6
- **store**: 26
- **control**: 13
- **instrument**: 7
- **job**: 34

## Row output: parts with no termination condition (10)

These are quarantined in R-02's sense: named, not deleted. A termination condition that reads "when we decide to" is recorded as NONE.

- `empressa-trading-cockpit`
- `hauska_mcp.atoms`
- `smart-files-neon`
- `smart-markets`
- `hauska_mcp.document_blobs`
- `neondb.county_manifest`
- `neondb.county_rail`
- `neondb.onboarding_ledger_event`
- `neondb.code_atoms`
- `neondb.reasoning_atoms`

## UNKNOWN status (4)

- **empressa-trading-cockpit**: Markets seat authority per seat_register; no live HTTP probe this session
- **smart-markets**: Markets seat authority; no live HTTP probe this session
- **hauska_mcp.document_blobs**: Listed hauska_mcp catalog audit Q2; row count not queried
- **neondb.reasoning_atoms**: ~10MB sweep 2026-08-08; consumers unknown

## Worked ZOMBIE example: tier2 flood retirement

`place_layer_snapshots` tier2 flood was retired correctly (cortex-api 1113c649, 2026-08-19). No consumer was repointed to `flood-hazard-fact` atoms. Successor serves nothing while predecessor data remains. See `_blueprint/30_lifecycle.md` retirement paired-control rule.

## Critical findings

1. **No LIVE factory runners** — all named PIDs dead; heartbeat logs stale 2026-08-15–19.
2. **LDT regression** — `countyLedgerMaterializeCli` and `countyFloodScoreCli` removed from HEAD; ledger snapshot still served from last materialize.
3. **Scorer gap (P-47)** — `countyRailScoreCli` never committed; six rails at zero coverage rows; historical numbers from uncommitted lane scripts.
4. **Serving revision drift** — smartcity-dashboards `00037-ced` live vs _STATE pin `00025-mam`; cortex-api `00522-row` vs `00519-muq`.
5. **Seat gaps** — hauska-mcp-server, plan-review, icc-portal, smartcity-os marked UNASSIGNED in seat_register.

Full machine-readable inventory: `_catalog/parts_inventory.json`.
