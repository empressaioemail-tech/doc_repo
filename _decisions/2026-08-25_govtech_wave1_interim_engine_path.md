---
decision_id: 2026-08-25_govtech_wave1_interim_engine_path
date: 2026-08-25
owner: nick
status: active
related_canonical:
  [
    _inbox/2026-08-24_govtech_program_scope,
    _inbox/2026-08-24_govtech_engine_migration_plan,
    _inbox/2026-08-24_adr023_amendment_draft,
    _decisions/2026-08-24_plan_review_engine_home_r_d,
    90_operations/OPS-17_govtech_stack_plan_of_record,
  ]
---

## Decision

Wave 1 ships on the **INTERIM engine path**: deploy plan-review **#7** (Cloud Run + Vercel together), declare edition in the UI, and keep finding generation on the existing HTTP hop to engine-api via legacy-design-tools; **S2-1 migration into plan-review is blocked until ADR-023 amendment (DOC-5) is operator-ratified.**

## Context

G-108 ("Plan review honesty path") allowed either S2-1 migration or a "scoped interim." R-D still names plan-review as the eventual engine home (`_decisions/2026-08-24_plan_review_engine_home_r_d.md`), but DOC-5 remains draft and S2-1 execution is explicitly gated. The nine-repo scope pass found plan-review has zero engine imports today; the only production consumer of `routeGenerateFindings` is `legacy-design-tools/artifacts/api-server/src/routes/findings.ts`. Wave 1 E2E proof (S5-5, G-110) cannot wait on a multi-repo migration while merged fixes (#7, #361, #75) sit undeployed.

This ruling closes the G-108 ambiguity: **interim is the Wave 1 path**, not a parallel option lanes may choose independently.

## Structural commitment check

ADR-008 (Hauska = substrate): **green** — interim keeps product reasoning out of substrate; migration deferred, not reversed.
MCP-first: **neutral** — interim does not block MCP citation reads.
Tenant sovereignty: **green** — no pooling change.
Sell reasoning, not data: **yellow until deployed** — edition selector and typed absence (S2-7/8/9) must ship on the interim path; merged ≠ live.

## Reasoning

The migration plan establishes that redirecting the hop (ldt → plan-review) does not remove the network boundary; it moves it. Wave 1's honest-transaction contract (`_inbox/2026-08-24_govtech_transaction_contract.md`) requires edition declared at lookup, substrate-minted citations on the read path, and typed absence on retrieval failure (defect #7). PR #7 fixes plan-review's neighbour-fallback and client-side citation synthesis on the **city surface**; engine-api #361 fixes the atoms writer default. Those deploy gates (G-105) unblock honesty work before S2-1 lands.

Attempting S2-1 in parallel with Wave 1 deploy would split govtech execution across two engine homes while ADR-023 still names legacy-design-tools. The interim path accepts a documented temporary hop, preserves R-D direction, and keeps S2-1 as a named post-ratification row (G-111 when filed).

## Interim path — what ships

| Layer | Wave 1 behavior | Owner seat |
|---|---|---|
| Edition | Declared in plan-review UI; reads filter on edition, not jurisdiction alone (S2-9) | govtech |
| Code lookup refuse | plan-review #7 deployed service + Vercel together | govtech |
| Finding generation | HTTP hop: plan-review → legacy-design-tools api-server → engine-api (existing path) | property (engine-api), govtech (BFF wiring) |
| Citations | Substrate mints at serve; plan-review selects, never constructs (contract rule 6) | substrate + govtech |
| Typed absence | S2-8 on code path; defect #7 fixed on engine path if interim touches retrieval | govtech + property |

## What is blocked

- S2-1 code move (`hauska-engine/packages/engine-core/src/finding/` → plan-review)
- ADR-023 body update in place
- G-111 migration dispatch row
- Retiring legacy-design-tools as engine consumer

Blocked until: operator ratifies `_inbox/2026-08-24_adr023_amendment_draft.md` (DOC-5 closed).

## Reversal criteria

Revisit and prefer accelerated S2-1 if any of the following:

1. Interim hop latency or coupling blocks S5-5 E2E proof on `template-city` after DEPLOY-7 and honesty items land (measured, not estimated).
2. Defect #7 or #8 cannot be closed on the legacy-design-tools path without duplicating logic that S2-1 would centralize in plan-review.
3. Operator ratifies DOC-5 and a measured migration plan shows decoupling cost below the interim maintenance cost (ADR-023 original reversal test).
4. A second consumer of finding generation appears outside plan-review, making the four-homes problem acute before Wave 1 closes.

Sunset: interim path expires at Wave 1 close (S5-5 graded) or 2026-09-30, whichever comes first, unless operator files an explicit extension with a named date.

## Dependencies

Depends on: DOC-1 transaction contract (filed), G-105 DEPLOY-7, `_decisions/2026-08-24_plan_review_engine_home_r_d.md` (provisional, direction only).

Blocks: G-108 lanes must cite this decision instead of "migration or interim." S2-1 execution remains blocked on DOC-5.

Unblocks: G-108 edition selector, typed absence, applicability matrix work on interim wiring; property DEPLOY-361 and defect #7/#8 fixes scoped to engine-api path.

## Counterparties

Internal: govtech seat (plan-review, dashboards, files), property seat (engine-api, legacy-design-tools hop), substrate seat (MCP meter). Operator: DOC-5 ratification for migration unlock.
