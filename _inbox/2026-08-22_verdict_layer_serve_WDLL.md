---
id: 2026-08-22_verdict_layer_serve_WDLL
title: Verdict layer serve — typed absence on property inspect (doc 19)
status: approved
date: 2026-08-22
plan_row: P-63
operator_approval: 2026-08-22 evening verbal (thesis planner recommend + operator go)
related:
  - 19_the_instrument_contract.md
  - _decisions/2026-08-22_thesis_planner_parcel_gap_rulings.md
  - _decisions/2026-08-22_verdict_serve_operator_go.md
  - _inbox/2026-08-22_thesis_planner_reply_integration.md
  - _inbox/2026-08-22_atom_full_surface_WDLL.md
  - _scratch/contract-surface-store-truth.md
---

# WDLL: verdict layer serve (property inspect)

Date: 2026-08-22  Status: approved
Operator approval: 2026-08-22 evening verbal

## Done looks like

Every property-spine family on SmartSite inspect that is not populated returns a **layer absence verdict** per `19_the_instrument_contract.md` §Layer, not an HTTP 200 with zero facts and no declaration. Verdict is one of `absent-verified`, `lookup-failed`, or `not-applicable`, each carrying `authority`, `scopeSearched`, `asOf`, and `basis`. Metro structural layers where CAMA bulk export exists in registry but is not loaded return **`lookup-failed`** (basis names export + tier). Unincorporated land with no zoning authority returns **`not-applicable`** for zoning layers, not zero and not a manifest gap.

This ships in the **serve layer** (cortex-api + PE inspect) before any CAMA row lands. Smart Files absence enum is the vocabulary reference; property path does not invent new verdict strings.

Gold `48021:34137` remains regression anchor. At least one metro parcel in a `bulk_primary` county without CAMA load proves `lookup-failed` on structural family.

P-59 scorer work may proceed in parallel on plumbing only; **scorer semantics that count presence/absence must not ship until verdict fields are live** (thesis planner: built against null = rebuilt).

## Acceptance items

1. **Schema.** Inspect GET for a non-populated family includes `status: absent` and `verdict` ∈ {`absent-verified`,`lookup-failed`,`not-applicable`} plus `authority`, `scopeSearched`, `asOf`, `basis`. Populated families unchanged. | check: live GET field names on gold + one metro | grade: [ ]
2. **lookup-failed (structural).** Dallas or Tarrant parcel with StratMap-tier roll only: `living_area_sqft` / structural layer returns `lookup-failed`, not empty chain. Basis cites registry `bulk_primary` and undeclared CAMA load. | check: live GET named parcel + registry row quoted | grade: [ ]
3. **not-applicable (zoning shape).** Unincorporated parcel with no zoning authority: zoning layer returns `not-applicable`, not `absent-verified` and not scored as manifest gap. | check: live GET + shape predicate named | grade: [ ]
4. **Violation test (empty-success).** File-based instrument: metro structural fixture with empty chain and no verdict **FAILS**; same fixture with `lookup-failed` **PASSES**. Self-test both directions exit 0. | check: `scripts/verdict-layer-serve-selftest.mjs` or equivalent in repo | grade: [ ]
5. **No upgrade in transit.** Gate/serve path never upgrades `lookup-failed` → `absent-verified`. | check: code read + violation fixture | grade: [ ]
6. **Conformance fixtures.** One golden fixture per verdict per parcel shape filed under `_inbox/` or test dir; doc 19 conformance rule cited in close. | check: fixture paths + run log | grade: [ ]
7. **Deploy grade.** Serving cortex-api revision named in close; live probe timestamps within 15 min of close. | check: `gcloud` revision + live GET | grade: [ ]

## Dependencies

- Registry: `_catalog/tx_cad_source_registry.json` (`bulk_primary`, declared vintage).
- P-59 scorers: consume verdict as input; do not ship boolean gap logic until item 1–3 live.
- Inspect/manifest divergence check is a **separate** WDLL item on atom full surface card (thesis item 6).

## Amendments

- 2026-08-22: opened at operator go after thesis planner session. Supersedes bare `atom-miss` as sufficient honesty on inspect.

## Finish card (graded at close)

1. **partial (PE display):** [PE verdict display](2390182e-c156-4ee1-ab9a-e699d6bcb4f8) — `layer-absence.ts`, InspectCard verdict/basis/chips, silent-empty `data-silent-empty`. Vitest 995 pass / 1 todo (live metro). Evidence `_inbox/2026-08-22_p63-verdict-serve_pe_cp1.json`. **Live GET blocked on Track A cortex + BFF forward.**
2. pending — cortex registry-driven lookup-failed
3. pending — cortex not-applicable zoning shape
4. **met (instrument):** `node scripts/verdict-layer-serve-selftest.mjs --self-test` exit 0, 7/7 direction checks 2026-08-22 planner verify. Evidence `_inbox/2026-08-22_p63-verdict-serve_instrument_cp1.json`.
5. pending — code read on serve path after cortex lands
6. **met (fixtures):** `_inbox/2026-08-22_p63_verdict_fixtures/` (3 golden files) + `scripts/fixtures/verdict-layer-serve/` (5 self-test fixtures).
7. pending — live GET post-deploy
