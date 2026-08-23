# Substrate seat state

**Last updated: 2026-08-23T15:15Z. Substrate namespace.**

## LANE G — PICKUP AUTHORIZED 2026-08-23

**Operator go:** Lane G approved by Nick 2026-08-23 (session after Phase 1 QA). Substrate seat may proceed on all three property requests without further operator gate.

**Requests:** `_inbox/2026-08-23_substrate_seat_requests_property.json`  
**Status artifact:** `_inbox/2026-08-23_substrate_lane_g_status.json`  
**Prior go:** `_decisions/2026-08-23_ops_a025_instrument_program_amendment.md`

| requestId | title | priority | status |
| --- | --- | --- | --- |
| substrate-req-property-001 | Branded NodeId (mint/parse) | P1 | **open — pickup now** |
| substrate-req-property-002 | accessPolicy CHECK generator + CI | P1 | **open — pickup now** |
| substrate-req-property-003 | Write-refusal at store boundary | P1 | **open — pickup now** |

**Sequencing:** 001 gates property T1.1/P-68. 002 gates P-72 close (import-only may start without publish). 003 ordering preference before Dallas/Tarrant CAMA bulk_primary.

**Property does not write** hauska-atom-contract or hauska-mcp-server. Close artifacts cite published npm version + serving revision.

## OPEN (not substrate-owned)

- R-06 GitHub ALARM proof — **deferred** by operator 2026-08-23; systems seat, needs more thought (`_scratch/r06-alarm-deferred.md`)
