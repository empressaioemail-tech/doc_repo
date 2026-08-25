# Govtech seat state

**Last updated: 2026-08-24T21:00Z.** Namespace `govtech`. Branch `seat/govtech`. OPS-17 lanes B, C and D: SmartCity Dashboards, plan review, Smart Files, ICC.

## Program board

**Authoritative tracker:** `canvases/govtech-master-program.canvas.tsx` (Cursor managed path). Scope rev 3: `_inbox/2026-08-24_govtech_program_scope.md`. Adversarial CP1: `_inbox/2026-08-24_govtech_plan_adversarial_cp1.json`. **OPS-17 Wave 1 rows:** G-105–G-110 (A-085). **ADR-023 draft:** `_inbox/2026-08-24_adr023_amendment_draft.md` (operator ratify).

## Why this seat exists

Operator ruling 2026-08-24: four product repos moved off property. Property keeps `legacy-design-tools`, `hauska-engine`, `hauska-map`, `smartcity-os` (NO-TOUCH).

## Standing rules

- Product repos: branch, PR, merge on green. May merge own branches.
- Does not write property, markets, or substrate repos. Request changes from owning seat.
- Deploys are planner-owned. Merged ≠ live. Grade on deployed surface with violation probes.

## Shipped this thread (code)

| repo | PR | deploy state |
|---|---|---|
| plan-review | #6 | **LIVE** — BFF scope gate; narrows defect #4, does not close Smart Files read path |
| plan-review | #7 | **NOT DEPLOYED** — must deploy Cloud Run + Vercel together |
| smartcity-dashboards | #39 | **NOT DEPLOYED** |
| hauska-engine | #361 | **MERGED** — property; writer fix; backfill + load-snapshot bypass remain |
| hauska-mcp-server | #75 | **MERGED** — substrate; not proven on serving MCP revision |
| hauska-sdk | #3, #4 | **MERGED** — substrate |

## OPEN — Wave 1 blockers

1. **Deploy queue:** DEPLOY-7, DEPLOY-39, DEPLOY-75, DEPLOY-361 — dispatch as **G-105**.
2. **S3-1:** Smart Files read-path scope. Defect #3 open. Dispatch **G-106**.
3. **S4-6:** property backfill blocked on `hauska_mcp` DSN. Dispatch **G-109** chain.
4. **DOC-5:** Operator ratify ADR-023 amendment draft before S2-1 execution.
5. **S1-17:** `template-city` vs `icc-demo` tenant mismatch on plan-review surface.

## Rulings taken (2026-08-24)

PermitFlow extinguished. Staff upload. Wave 1 on template-city. Engine migrates to plan-review (R-D). Smart Files whole city (R-E). One app if SKUs stay independent (R-F). SmartSite parked (R-G). Fourth demo pack (R-H). **`source_obligation_ledger` authoritative; activity is cache (R-I).** Architect surface deferred, not retired (R-J).

## Rulings owed

- O-1: ICC rate model (recommend flat; block until DEPLOY-75 + accrual probe).
- O-3: spireon / patrol-vehicles (recommend keep ungranted).
- O-4: branch protection Stage 2.
- O-5a: Connections disposition vocabulary.

## Filed plans (2026-08-24)

- `_inbox/2026-08-24_govtech_transaction_contract.md` (S5-1)
- `_inbox/2026-08-24_govtech_engine_migration_plan.md` (S2-1)

## Defect class

Ten named instances + latent register L1–L5 in scope rev 3. Honest closure on deployed surface today: **1 of 10** (defect #4 BFF layer live-verified). S5-2 decomposed into deploy probes, bypass inventory, seam vocabulary (canvas).

## Corrections (inherit; do not re-derive)

Corpus claim over-generalised. Absent I-Code bodies = licence working. Two ICC ledgers (reconciliation problem, not zero accrual). ADR-018 satisfied. R311.7 / R302.1 fixed in #7 (undeployed).
