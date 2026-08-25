---
id: 2026-08-25_govtech_wave1_WDLL
title: WDLL — Govtech Wave 1 execution hardening on template-city
status: draft
last_updated: 2026-08-25
applies_to: portfolio
owner: nick
operator_approval: pending
related:
  - 90_runbooks/wdll_practice.md
  - 90_operations/OPS-17_govtech_stack_plan_of_record
  - _inbox/2026-08-24_govtech_program_scope.md
  - _inbox/2026-08-24_govtech_transaction_contract.md
  - _inbox/2026-08-24_govtech_engine_migration_plan.md
  - _decisions/2026-08-17_g13_consumer_contract
  - canvases/govtech-master-program.canvas.tsx
plan_row: G-105 through G-110 (OPS-17 A-085)
---

# WDLL: Govtech Wave 1 — template-city execution hardening

Date: 2026-08-25  Status: draft
Operator approval: pending

Plan rows: **G-105** through **G-110** (`90_operations/OPS-17_govtech_stack_plan_of_record.md`, amendment A-085). Scope rev 3: `_inbox/2026-08-24_govtech_program_scope.md`. Transaction contract (S5-1): `_inbox/2026-08-24_govtech_transaction_contract.md`.

## Done looks like

A staff member uploads a submittal into Smart Files on `template-city`, plan review runs against a **declared code edition** (not jurisdiction alone), and the matrix emits determinations that cite substrate-minted sections or carry typed absence where the corpus was not reached. ICC references accrue in `source_obligation_ledger` as the authoritative store, reconciled against the activity cache. Each product still runs standalone; composition in one shell is proven but not required for any SKU to sell alone. Merged PRs are not graded until deploy gates pass live violation probes on the serving revision. Wave 1 **may** call `hauska-engine` retrieval-api over HTTP for findings generation until S2-1 lands; that interim hop does not relax edition selection or DEPLOY-7 honesty. Live Bastrop is no-touch throughout.

## Interim path (Wave 1)

Until **S2-1** (engine migration into plan-review, blocked on DOC-5 ADR-023 ratification), plan review may reach the finding engine via **HTTP to `hauska-engine` retrieval-api** (`/v1/findings/generate*`). This interim is allowed only when **S2-9** (edition selector) is live and **DEPLOY-7** (code-lookup refuse, no neighbour fallback) is deployed on the serving plan-review revision together with its Vercel front. No real determination ships without both. S2-1, when dispatched, replaces the hop; it is not in this card's acceptance set.

## Acceptance items

1. **DEPLOY-7 + Vercel paired cut live.** Plan-review Cloud Run revision serving PR #7 and the matching Vercel front are cut together; neighbour-fallback code-lookup is armed on the deployed surface.
   | scope: S5-2a, S2-3, S2-4 | OPS: **G-105**
   | check: on the **pre-deploy** serving revision, `curl -sS "$PLAN_REVIEW_URL/api/plan-review/code?book=IBC2018P6&section=ZZZZ-NOT-A-SECTION" | jq -e '.error // .refused // (.sectionNumber != "R311.7" and .sectionNumber != "R302.1")'` exits **non-zero** (violation probe **must fail pre-deploy** — neighbour or seed fallback returns 200 with a wrong section today). After deploy, the same probe exits **0** with an explicit refuse payload (4xx/structured error, never a neighbour section).
   | depends on: none (do first among deploy gates)
   | grade: [ ]

2. **DEPLOY-39 dashboards compose gate live.** SmartCity Dashboards #39 is the serving revision; anonymous compose and absent-`accessPolicy` fail closed on deployed routes implicated by defect #1 and #2.
   | scope: S5-2a, S1-13, S1-14 | OPS: **G-105**
   | check: on the **pre-deploy** serving revision, `curl -sS -o /dev/null -w '%{http_code}' "$DASHBOARDS_URL/api/lenses/city-manager/compose?cityKey=template-city&pack=development-services"` returns **200** while `packContentReadStatus` requires auth (violation probe **must fail pre-deploy**). Post-deploy, the same anonymous call returns **403** (or equivalent refuse). Secondary: unit probe in `smartcity-dashboards` tenancy tests — `atomVisibleToCaller` with absent `accessPolicy` returns **false**, verified by violation fixture before trust.
   | depends on: none
   | grade: [ ]

3. **DEPLOY-75 MCP meter bypass fix live.** Hauska MCP #75 is the serving revision; plan-review Codex tools accrue licensed references instead of bypassing via empty provenance.
   | scope: S5-2a, S4-2 | OPS: **G-105**, **G-109**
   | check: on the **pre-deploy** MCP revision, invoke any plan-review gate tool (e.g. `plan_review_matrix_from_chain`) against a known ICC section; then `SELECT count(*) FROM source_obligation_ledger WHERE request_id = '<that-request-id>';` against MCP Neon returns **0** (violation probe **must fail pre-deploy**). Post-deploy, the same call yields **count >= 1** with non-null `source_actor_did`.
   | depends on: none
   | grade: [ ]

4. **DEPLOY-361 engine-api writer refuse live.** Property engine-api #361 is the serving revision; atoms writer refuses unknown `accessPolicy` instead of defaulting `public-free`.
   | scope: S5-2a, S4-5, S5-2b | OPS: **G-105**, **G-109**
   | check: on the **pre-deploy** engine-api revision, run the repo's writer violation fixture (atom ingest with absent/malformed `accessPolicy`) — probe **must fail pre-deploy** (write succeeds with `public-free`). Post-deploy, the same fixture exits non-zero or returns explicit refuse. Paired: document `load-snapshot-into-pg.mjs` bypass in S5-2b inventory with owner and retirement row; bypass must not satisfy this item alone.
   | depends on: none
   | grade: [ ]

5. **Smart Files read-path scope enforced.** Defect #3 closed: folder, file, document, and blob reads require a verified caller scope; write-only enforcement is insufficient.
   | scope: S3-1 | OPS: **G-106**
   | check: against deployed Smart Files service, `curl -sS -o /dev/null -w '%{http_code}' "$SMART_FILES_URL/api/folders?scopeType=tenant&scopeId=template-city"` without bearer token returns **403**. Wrong-tenant token against a known seeded artifact returns **403**. Matching-tenant service token returns **200** with folder list. Violation: anonymous `GET .../api/documents/<entityId>/blob/<cid>` returns bytes today — probe **must fail pre-deploy**, **403 post-deploy**.
   | depends on: 2 (dashboards #39 BFF posture paired)
   | grade: [ ]

6. **`template-city` tenant identity unified.** Wave 1 demo city is `template-city` end to end; `icc-demo` is not the write scope for staff submittals (O-4 / S1-17).
   | scope: S1-17, S1-16 | OPS: **G-107** (prerequisite)
   | check: staff-path upload (item 7) produces `entity_id` matching `smartfile:tenant:template-city:%` in Smart Files Postgres: `SELECT entity_id FROM smart_file_documents WHERE entity_id LIKE 'smartfile:tenant:template-city:%' ORDER BY created_at DESC LIMIT 1;` — not `icc-demo`. Plan-review `CITY_KEY` and persona `orgId` agree on `template-city` in deployed `web/app.js` and `src/actors.mjs`.
   | depends on: 5
   | grade: [ ]

7. **Staff upload into Smart Files end to end.** R-B intake: file input in plan-review UI, provenance stamped, bytes in city-scoped folder before review runs.
   | scope: S2-6 | OPS: **G-107**
   | check: on deployed plan-review surface for `template-city`, upload a PDF through the staff upload control; response JSON includes `entityId`, `contentCid`, and provenance keys `capturedBy`, `capturedAt`, `sourceKind=staff-upload`, `originalFilename`, `declaredRole`. Confirm in Smart Files: `SELECT current_version, provenance->>'sourceKind' FROM smart_file_versions v JOIN smart_file_documents d ON d.id = v.document_id WHERE d.entity_id = '<returned entityId>';` returns version **>= 1** with expected provenance.
   | depends on: 5, 6, DOC-1 contract field ownership for `docSlug` and provenance
   | grade: [ ]

8. **Edition selector live; interim engine HTTP hop allowed.** Reads and the review UI declare and filter on `editionId`; model/corpus path receives edition, not jurisdiction alone.
   | scope: S2-9, S2-11 | OPS: **G-108**
   | check: deployed plan-review UI exposes edition selector bound to engagement; API read for code sections includes non-empty `editionId` on every returned citation-shaped object. Interim: finding generation may POST to `$ENGINE_API_URL/v1/findings/generate` — log or trace shows HTTP hop, not DSN. **Blocked until items 1 and 7 met.** Violation probe: pre-fix retrieval drops edition at boundary (`toCodeSectionInput` projection) — integration test or live call showing `editionId` absent **must fail pre-fix**, present post-fix.
   | depends on: 1, 7
   | grade: [ ]

9. **Typed absence on code path; no silent empty success.** Retrieval failure and never-looked paths emit `lookup-failed` / `absent-verified` per transaction contract, never `succeeded` with empty sections.
   | scope: S2-8, S5-2c | OPS: **G-108**
   | check: force corpus unreachable (bad MCP URL or known-down host) on staging deploy; review run returns determinations with `verdict: "Unchecked"` and `absence.verdict` in `{lookup-failed, absent-verified}` with required `failure` on lookup-failed — not HTTP 200 matrix with all-Pass. Unit: `node --test` in plan-review for absence mapper imports guard from substrate path. Spelling is **`absent-verified`**, not `verified-absent` (L3).
   | depends on: 8
   | grade: [ ]

10. **Applicability matrix with honest Pass and Fail.** Section adjudicator emits one determination per applicable section; Pass/Fail reachable through cited sections, not hardcoded rows.
    | scope: S2-7 | OPS: **G-108**
    | check: after a review run on `template-city` with declared edition, `SELECT determination, count(*) FROM plan_review_findings WHERE engagement_id = '<eid>' GROUP BY 1;` includes at least one row each in **`Pass`** and **`Fail`** OR documents typed **`Unchecked`** with absence for sections not reached (never silent omit). No row carries hand-authored citation text; citations are structured objects with `editionId`, `bookId`, `sectionNumber` (forbidden rule 6/7 in transaction contract).
    | depends on: 8, 9
    | grade: [ ]

11. **Migration 009 applied; obligation ledger exists and accepts writes.** Substrate store ready before accrual chain grading.
    | scope: S4-0 | OPS: **G-109**
    | check: against MCP server deployment Neon: `SELECT to_regclass('public.source_obligation_ledger');` returns **`source_obligation_ledger`** (not null). Pre-apply probe **must fail** if table absent. Post-apply: schema matches `hauska-mcp-server/migrations/009_source_obligation_ledger.sql` (column list includes `source_actor_did`, `atom_did`, `request_id`, `amount_minor`, `grace_terms`).
    | depends on: 3
    | grade: [ ]

12. **ICC obligation ledger chain: cited atom, reconciliation, reader.** Meter records `referenceKind`, citation quadruple, and activity cache reconciles to authoritative ledger (R-I).
    | scope: S4-1b, S4-2, S4-3, S4-4, S4-7, S4-8 | OPS: **G-109**
    | check: live ICC reference probe (plan-review determination or MCP tool) produces row: `SELECT reference_kind, book_id, section_id, edition_id, source_actor_did FROM source_obligation_ledger WHERE request_id = '<probe-request-id>';` with **`reference_kind = 'cited'`**, non-null quadruple, and `rate_basis` or grace terms honest (`unrated` until O-1/S4-B1). Activity cache row for same event reconciles (matching `request_id` or dedup key, no double-count). Reader endpoint or SQL view named in S4-8 close returns the row for licensor audit. Pre-deploy: plan-review MCP path accrues zero (item 3 violation); post-deploy: count >= 1.
    | depends on: 3, 4, 10, 11
    | grade: [ ]

13. **Seam vocabulary conformance across repos.** Shared citation validator and unified absence spelling; no consumer constructs citations.
    | scope: S5-2c | OPS: **G-110** (prerequisite)
    | check: vendored citation validator `node --test` in plan-review, smart-files, and smartcity-dashboards — fixture missing `editionId` **throws/refuses** (verified by violation before merge). Grep gate: zero new string literals matching `/International Building Code Section/` outside substrate repos. `verified-absent` absent from plan-review IPMC branch (corrected to `absent-verified`).
    | depends on: DOC-1
    | grade: [ ]

14. **Presentation shell composes with independent deployability.** One shell may mount plan review and Smart Files; each product still deploys and runs alone (R-F, G-13).
    | scope: S5-3 | OPS: **G-110** (prerequisite)
    | check: (a) dashboards shell at `$DASHBOARDS_URL/?cityKey=template-city` renders plan-review lens and files lens without iframe-only scope trap — `CITY_KEY` not hardcoded to a different tenant than mounts. (b) Standalone: `$PLAN_REVIEW_URL` and `$SMART_FILES_URL` each serve core flows without dashboards origin. (c) Close declares separate Cloud Run/Vercel services and SKUs `SCOS-PLAN-DEP`, `SCOS-FILE-DEP`, `SCOS-DASH-DEP`.
    | depends on: 2, 6, 7
    | grade: [ ]

15. **Wave 1 end-to-end transaction proof on `template-city` (S5-5).** The program definition of done: one staff submittal, declared edition review, honest determination or absence, accrual in obligation ledger, visible in composed shell.
    | scope: S5-5 | OPS: **G-110**
    | check: scripted operator walk (or `scripts/govtech/wave1_e2e_probe.mjs` when filed): (1) staff upload item 7 artifact id, (2) create/run review with selected edition from item 8, (3) matrix shows cited ICC section with matching `editionId` or typed Unchecked with absence from item 9, (4) `source_obligation_ledger` row from item 12 for same session, (5) dashboards shell shows same determination without recomputation. Grade **met** only if all five observations pass on **deployed** revisions named in close artifact with commit/digest per revision.
    | depends on: 1, 2, 3, 5, 6, 7, 8, 9, 10, 12, 13, 14
    | grade: [ ]

## Out of scope (this card)

S2-1 engine migration execute (blocked DOC-5). S2-2 architect surface. Bastrop / Wave 2. S1 demo feed arc (S1-6–S1-12). Real ICC rate (O-1, S4-B1) and Circle billing (S4-11). S5-4 branch protection Stage 2 (O-4). S2-19 calibration write-back. Fourth demo pack (S1-11) unless needed to unblock S5-5.

## Amendments

(none until operator approval)

## Finish card (graded at close)

(to be filled item-by-item: met | partial | dropped, one line evidence each)
