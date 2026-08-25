---
id: 2026-08-25_govtech_preflight_checklist
title: Govtech Wave 1 preflight checklist
status: active
last_updated: 2026-08-25
applies_to: govtech
owner: nick
related:
  [
    _inbox/2026-08-24_govtech_program_scope,
    _inbox/2026-08-24_govtech_transaction_contract,
    90_operations/OPS-17_govtech_stack_plan_of_record,
    scripts/govtech/preflight-wave1.mjs,
  ]
---

# Govtech Wave 1 preflight checklist

Operator-facing map from each unsettled probe to plan row, WDLL scope item, command, pass criteria, and owning seat. **Instrument:** `node scripts/govtech/preflight-wave1.mjs` (read-only runnable checks + structured JSON for unmeasured probes). **Tests:** `node scripts/govtech/preflight-wave1.test.mjs`.

Wave 1 WDLL is **pending operator approval** (expected path `_inbox/2026-08-25_govtech_wave1_WDLL.md`). Until filed, grade doc hygiene and deploy probes against scope rev 3 items DOC-1 through DOC-5 and OPS-17 rows G-105 through G-110.

## Runnable without secrets (script executes)

| Probe | Command | Pass criteria | Owner seat | Plan row | WDLL / scope |
|---|---|---|---|---|---|
| Scope unsettled section parsed | `node scripts/govtech/preflight-wave1.mjs` | META-SCOPE-BULLETS pass; ≥6 bullets from scope doc | govtech (doc_repo) | G-105 | DOC-3 |
| Contract unsettled section parsed | same | META-CONTRACT-BULLETS pass; ≥4 bullets | govtech | G-110 | DOC-1 / S5-1 |
| Transaction contract filed | same | DOC-CONTRACT pass | govtech | G-110 | DOC-1 |
| Program scope rev 3 filed | same | DOC-SCOPE pass | govtech | G-105 | scope rev 3 |
| Engine migration plan filed | same | DOC-MIGRATION pass | govtech | G-108 | DOC-2 / S2-1 |
| ADR-023 amendment draft filed | same | DOC-ADR023 pass | govtech | G-108 | DOC-5 |
| OPS-17 plan of record present | same | DOC-OPS17 pass | govtech | G-105 | DOC-4 |
| Live program canvas present | same | DOC-CANVAS pass | govtech | G-110 | canvas |
| G-105 declared in OPS-17 | same | PLAN-G-105 pass | govtech | G-105 | A-085 |
| Dispatch compiles G-105 | same | DISPATCH-G-105 pass | govtech | G-105 | canon gate |
| Wave 1 WDLL approved | same | WDLL-WAVE1 `pass` when `operator_approval: approved`; **pending** when draft or absent | govtech | G-110 | S5-5 |

Compile probe (side effect): `node scripts/dispatch.mjs --plan OPS-17 --lane govtech-preflight --plan-row G-105 --title "Govtech Wave 1 preflight compile probe"` writes `_dispatches/<date>_govtech-preflight_dispatch.md`.

## Unmeasured — operator runs command (script emits JSON only)

| Probe | Command | Pass criteria | Owner seat | Plan row | WDLL / scope |
|---|---|---|---|---|---|
| HAUSKA_MCP_URL on dashboards | `gcloud run services describe smartcity-dashboards --region=us-east1 --project=smartcity-dashboards --format=json(spec.template.spec.containers[0].env)` | Env entry `HAUSKA_MCP_URL` non-empty on serving revision | govtech | G-105 | S1-15 |
| city_packs table contents | `psql "$DASHBOARDS_DATABASE_URL" -c "SELECT city_key, access_policy, lenses FROM city_packs ORDER BY city_key;"` | Only expected demo keys; no stray `bastrop` breaking `/api/city-packs` | govtech | G-110 | S1-17 / R-C |
| MCP migrations 008 + 009 applied | `psql "$MCP_DATABASE_URL" -c "SELECT to_regclass('public.source_obligation_ledger');"` and metering table checks | Both migrations applied; ledger table exists | property | G-109 | DEPLOY-75 / S4-0 |
| ICC tenant atoms missing adapter | `psql "$MCP_DATABASE_URL" -c "SELECT count(*) FROM atoms WHERE body->>'jurisdictionTenant'='icc-model-code' AND coalesce(body->>'sourceAdapter','') <> 'icc-code-connect';"` | Count recorded; drives S4-4 sizing | property | G-109 | S4-4 |
| PermitFlow accumulated rows | — (moot) | Skipped under R-A unless data disposition opened | govtech | — | R-A |
| Demo record density (visual) | Manual browse `/?cityKey=template-city` on serving dashboards URL | 171 records feel full across lenses at 1920×1080 | govtech | G-110 | S5-5 |
| ICC_ACTOR_RECORD_FIXTURE licensing | `npm pack @empressaio/atom-contract@1.9.0 --pack-destination /tmp` then read `sourceLicensing` | `perReferenceRateMinor` and `meterFreeTier` documented | property | G-109 | S4-9 / O-2 |
| source_obligation_ledger row count | `psql "$MCP_DATABASE_URL" -c "SELECT count(*) FROM source_obligation_ledger;"` | Table exists; zero vs traffic vs throw diagnosed | property | G-109 | S4-1b / R-I |
| plan_review_findings Pass/Fail | `psql "$PLAN_REVIEW_DATABASE_URL" -c "SELECT determination, count(*) FROM plan_review_findings GROUP BY 1;"` | Pass/Fail seen or honestly absent pending S2-7 | govtech | G-108 | S2-7 |
| Citation validator cross-repo | Write S5-2c validator; `node --test` in dashboards, plan-review, smart-files | Fails on citation missing `editionId` in all three | govtech | G-110 | S5-2c |

## Exit semantics

| Outcome | Meaning |
|---|---|
| Exit 0 | All runnable checks passed; unmeasured probes listed in JSON for operator |
| Exit 1 | At least one runnable check failed (missing doc, dispatch compile error, etc.) |
| `status: unmeasured` | Probe documented with exact command; not executed by script |
| `status: pending` | Wave 1 WDLL not yet operator-approved |

## Source probes

Scope doc `_inbox/2026-08-24_govtech_program_scope.md` section **What could not be established** (rev 3).

Transaction contract `_inbox/2026-08-24_govtech_transaction_contract.md` section **What I could not establish**.
