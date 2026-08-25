---
id: 2026-08-25_govtech_execution_hardening_index
title: Govtech Wave 1 execution hardening — artifact index
status: active
last_updated: 2026-08-25
applies_to: portfolio
owner: nick
related:
  - _inbox/2026-08-25_govtech_wave1_WDLL.md
  - _inbox/2026-08-24_govtech_program_scope.md
  - 90_operations/OPS-17_govtech_stack_plan_of_record
  - _decisions/2026-08-25_govtech_wave1_interim_engine_path.md
  - _decisions/2026-08-25_govtech_wave1_execution_rulings.md
---

# Govtech Wave 1 execution hardening index

Filed 2026-08-25 after parallel agent pass. **Operator gate:** set `operator_approval: approved` on the WDLL before G-106–G-110 build lanes start.

## Acceptance authority

| Artifact | Role |
|---|---|
| `_inbox/2026-08-25_govtech_wave1_WDLL.md` | 15 numbered acceptance items; grade at close |
| `90_operations/OPS-17_govtech_stack_plan_of_record.md` | G-105–G-110 plan rows (A-085) |

## Instruments (file-based; self-tested)

| Script | Tests | WDLL items |
|---|---|---|
| `scripts/govtech/deploy-violation-probes.mjs` | `deploy-violation-probes.test.mjs` (13) | 1–4 pre/post deploy |
| `scripts/govtech/preflight-wave1.mjs` | `preflight-wave1.test.mjs` (19) | doc + plan-row gate before Wave 1 |
| `scripts/govtech/wave1_e2e_probe.mjs` | `wave1_e2e_probe.test.mjs` | 15 orchestrator / checklist |

Run all: `node --test scripts/govtech/*.test.mjs`

## Operator runbooks

| Doc | Use |
|---|---|
| `_inbox/2026-08-25_govtech_preflight_checklist.md` | Morning-of checklist |
| `_inbox/2026-08-25_govtech_deploy_runbook.md` | G-105 deploy cut order (DEPLOY-7+39, 75, 361) |

## Dispatches (compile with dispatch.mjs when executing)

| Dispatch | Plan row | WDLL items |
|---|---|---|
| `_dispatches/2026-08-25_govtech-deploy_dispatch.md` | G-105 | 1–4 |

## Decisions (2026-08-25)

| Decision | Status |
|---|---|
| `_decisions/2026-08-25_govtech_wave1_interim_engine_path.md` | active — HTTP hop to retrieval-api until S2-1 |
| `_decisions/2026-08-25_govtech_wave1_execution_rulings.md` | provisional — O-3/O-4/O-5/O-6 batch |

## Cross-seat pickups

| Seat | Pickup |
|---|---|
| property | `_inbox/2026-08-25_property_govtech_wave1_pickup.md` |
| substrate | `_inbox/2026-08-25_substrate_govtech_wave1_pickup.md` |

## Tomorrow execution order

1. Operator approves WDLL.
2. Run `node scripts/govtech/preflight-wave1.mjs` (expect WDLL pending until approved).
3. G-105 deploy lane: runbook → pre-deploy violation probes (`--expect fail`) → cuts → post-deploy probes (`--expect pass`).
4. Parallel: property/substrate pickups for DEPLOY-361, DEPLOY-75, S4-6.
5. G-106–G-110 dispatches cite WDLL items 5–15 respectively.

## Known gaps (honest)

- Live probes for deploy-75 / deploy-361 require credentials; instruments document credential-gap vs violation.
- Preflight no longer compiles dispatch side-effect files (fixed 2026-08-25).
- Ten preflight live probes remain `unmeasured` until operator env is supplied.
