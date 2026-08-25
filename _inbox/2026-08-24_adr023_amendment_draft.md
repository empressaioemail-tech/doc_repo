---
id: 2026-08-24_adr023_amendment_draft
title: ADR-023 amendment draft — plan review engine serving home
status: draft
last_updated: 2026-08-24
applies_to: portfolio
owner: nick
related:
  [
    80_adrs/adr_023_cortex_reporting_repo_designation,
    _inbox/2026-08-24_govtech_program_scope,
    _inbox/2026-08-24_govtech_engine_migration_plan,
    _decisions/2026-08-16_plan_review_extract_and_remount,
  ]
---

# ADR-023 amendment draft (DOC-5)

**Status: draft for operator ratification.** Do not execute S2-1 migration until this amendment is accepted or a superseding decision is filed active.

## Conflict on the record

| Source | Says plan review engine lives in |
|---|---|
| ADR-023 (2026-07-01) | `legacy-design-tools` |
| A-026 / G-60 (2026-08-16) | Serving **housing** is `empressaioemail-tech/plan-review`; ADR body not edited |
| Ruling R-D (2026-08-24) | Finding engine migrates into **`plan-review` repo** (Empressa product, not Hauska substrate) |

A-026 amended serving home only. R-D amends **function-package home** for the city plan review engine. Both can stand together if ADR-023 is updated to distinguish:

1. **cortex-reporting function package** (reporting, findings, adjudication capture) — taxonomy label unchanged
2. **City plan review engine** — product logic in `empressaioemail-tech/plan-review`
3. **Architect surface (home A)** — deferred per R-J; remains a client of the engine, not its home
4. **Hauska engine** — substrate retrieval/corpus only per ADR-008; not plan review reasoning

## Proposed ADR-023 edits

### Decision section — replace paragraph 1

> `legacy-design-tools` is formally designated as the `cortex-reporting` repo in the architecture taxonomy. It is the reporting function package: plan review engine, code corpus query layer, findings management, adjudication capture, delivery letter generation.

**Replace with:**

> The `cortex-reporting` function package spans two serving homes. **City plan review product logic** (finding engine, applicability matrix, edition selection, staff review BFF, adjudication write-back for SmartCity) lives in `empressaioemail-tech/plan-review`, isolated per G-60/A-026. **`legacy-design-tools`** retains architect-facing reporting surfaces and remains the cortex-reporting repo for AEC-cortex clients until home A is explicitly remounted or retired. **Hauska engine** (`hauska-engine`) is substrate only: corpus, retrieval, atom write paths — not Empressa plan review reasoning (ADR-008, ruling R-D 2026-08-24).

### Consequences section — add

> The icc-demo and template-city Wave 1 build targets `plan-review`, not `legacy-design-tools/artifacts/plan-review`. Migration plan: `_inbox/2026-08-24_govtech_engine_migration_plan.md`. Execution blocked until this amendment or `_decisions/2026-08-24_plan_review_engine_home_r_d.md` is active.

### Reversal criteria — add

> If migration cost exceeds maintaining a thin HTTP hop from plan-review to engine-api for Wave 1 only, operator may defer R-D execution while still accepting the serving-home amendment (plan-review owns the BFF; engine remains external caller temporarily). That is a schedule reversal, not a layer reversal.

## Ratification path

1. Operator approves this draft (or edits and approves).
2. Apply in-place edit to `80_adrs/adr_023_cortex_reporting_repo_designation.md`: bump `last_updated`, add amendment note in frontmatter `related`.
3. Optionally file active decision `_decisions/2026-08-24_plan_review_engine_home_r_d.md` pointing here.
4. Add OPS-17 row G-111 for S2-1 migration dispatch (separate amendment after ratification).
5. Unblock S2-1 lanes citing DOC-5 closed.

## Mapping to canvas / scope

| Canvas id | Scope id | This draft unblocks |
|---|---|---|
| DOC-5 | — | S2-1 execution gate |
| S2-1 | S2-1 | After ratification + G-111 row |
