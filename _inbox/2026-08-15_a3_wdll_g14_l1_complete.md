---
id: 2026-08-15_a3_wdll_g14_l1_complete
title: WDLL — Smart Files Lane A Layer 1 through completion
status: graded
last_updated: 2026-08-15
applies_to: portfolio
owner: nick
related: [_inbox/2026-08-15_a_wdll_g14_frozen, 90_operations/OPS-17_govtech_stack_plan_of_record]
---

# WDLL: Smart Files Lane A Layer 1 through completion

Date: 2026-08-15  Status: approved
Operator approval: 2026-08-15 verbal go ("Smart Files Lane 1 through completion")
Plan rows: G-10 (lane A half), G-14
Repo: legacy-design-tools
This card does not replace the frozen G-14 card. It is the completion-wave card. Grade both at close.

## Done looks like

Smart Files is a spine module with a declared scope-keyed identity, a three-table store, and that store APPLIED on the deployment database. A stranger can build `smartfile:jurisdiction:…`, `smartfile:tenant:…`, and `smartfile:site:…` (site scopeId may contain colons) from one builder, parse them back, and watch the old three-segment FIPS form return null. A live schema read against the deployment database shows 0078, 0079, and 0080 applied. The frozen G-14 card item 2 applied-half is MET. G-14 can be closed as foundation-complete. Nothing here is customer-done (no G-53). No corpus (no G-44). No coverage count (no G-20). No Command Center panel. No atom-contract promotion.

## Acceptance items

1. **Module identity is declared and in code.** Builder/parser implement `smartfile:<scopeType>:<scopeId>:<docSlug>` per `_decisions/2026-08-15_smart_files_module_identity.md`. Closed scopeType set: jurisdiction, tenant, site. Last-segment-is-slug. Old `smartfile:<fips>:<slug>` returns null. Reconstruction traps include parcel-keyed, CID-keyed, and the superseded three-segment form.
   | check: decision record active; contract tests on real exit code 0; no shape rebuilt from parts in store code.
   | grade: [ ] | depends on: nothing (blocks 2)
   | WDLL: frozen G-14 item 1 as amended 2026-08-15

2. **Schema carries scope without rewriting merged 0078.** `smart_file_documents` gains `scope_type` and `scope_id` (both NOT NULL once applied), `jurisdiction_fips` becomes nullable and is populated only for `scopeType=jurisdiction`, unique on `entity_id` and on `(scope_type, scope_id, doc_slug)`. New migration `0080_*.sql` is additive. 0078 and 0079 files are not rewritten.
   | check: migration file read at source; drizzle schema agrees; fixture-drift gate in CI.
   | grade: [ ] | depends on: 1

3. **G-34 typed absence still holds on the new key.** `readDocument` still cannot return null. `SmartFileAbsence` carries scopeType/scopeId/docSlug. `jurisdictionFips` is not required min(1) on tenant/site reads. Empty lookup is still `not-sought`. Malformed entityId is `lookup-failed` with parse-null parts, not a synthesized FIPS.
   | check: absence contract + integration probes (CI Postgres) still mutation-capable on the STALE indicator.
   | grade: [ ] | depends on: 2
   | note: G-34 is L3 and already merged; this item is a regression gate, not a re-close of G-34.

4. **Brokerage and smartcity-os untouched.** Zero brokerage files in the PR diff. `P:\smartcity-os` never opened.
   | check: `git diff --name-only` against the PR base, mechanical.
   | grade: [ ] | depends on: 2

5. **0078, 0079, and 0080 are APPLIED on the deployment database.** Planner-owned `workflow_dispatch` `run-migrations` on `cloud-run-deploy.yml`. Live read of `_schema_migrations` names all three. Live `information_schema.tables` shows `smart_file_documents`, `smart_file_versions`, `smart_file_placements`, `smart_file_absence_determinations`. Live columns include `scope_type`, `scope_id`, nullable `jurisdiction_fips`. Fixture refreshed from live after apply.
   | check: SQL against the deployment database, not CI, not a scratch cluster. Timestamped.
   | grade: [ ] | depends on: 2 (and PR merge)
   | WDLL: frozen G-14 item 2 applied half
   | constraint: do not apply until item 2 is merged. Do not steal the atoms bulk-writer slot. DDL on cortex-prod is slot-free; still announce and confirm no heavy scan.

6. **Frozen G-14 items 3, 4, 5 still MET after the identity change.** Store-once, revise-once, STALE both directions, proven on CI Postgres against the new key (at least one jurisdiction, one tenant, one site-with-colon-in-scopeId document).
   | check: integration probes in CI log actually ran (duration, not skip).
   | grade: [ ] | depends on: 2

7. **G-14 closed honestly.** Close artifact names merge SHA, CI conclusion strings, live apply evidence, and remaining open (G-20, G-44, G-53, A-013 promotion, CC panel). Does not claim customer-done.
   | check: `_inbox/2026-08-15_a3_close.json` plus frozen G-14 finish card graded.
   | grade: [ ] | depends on: 5, 6

## Out of scope

G-20, G-44, G-53. Command Center Smart Files rail. Atom-contract promotion (A-013 criterion fired but identity must land first; promoting the FIPS shape is forbidden). Lanes B, C, D. G-30 ICC. Texas flush / OPS-16. Applying migrations before the identity PR merges. Rewriting 0078 or 0079. Cleaning or stashing the dirty LDT checkout on `feat/s1-instrument-hardening`.

## Amendments

(none yet)

## Finish card (graded at close)

1. met: decision `_decisions/2026-08-15_smart_files_module_identity.md`; builder/parser on main `015b15d6`; old three-segment form returns null; site scopeId with colons round-trips.
2. met: 0080 additive, 0078/0079 not rewritten. Live columns: scope_type/scope_id NOT NULL, jurisdiction_fips nullable.
3. met: G-34 absence suite 15/15 executed in CI (15952ms). Absence jurisdiction_fips nullable live. Store writes null not empty string.
4. met: 9 files, 0 brokerage names. smartcity-os never opened.
5. met: 0078/0079/0080 applied on cortex-prod neondb. Live `_schema_migrations` timestamps above. information_schema.tables lists all four Smart Files tables. Also applied 0075/0076/0077 which were already pending on the same queue (FINDING, recorded in close).
6. met: CI executed store-once/revise-once/STALE on jurisdiction, tenant, and site-with-colons (15 tests, 15864ms).
7. met: this close artifact. G-14 foundation CLOSED. Not customer-done.
