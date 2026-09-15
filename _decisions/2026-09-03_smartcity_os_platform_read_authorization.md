---
decision_id: 2026-09-03_smartcity_os_platform_read_authorization
date: 2026-09-03
owner: nick
status: active
related_canonical: [90_operations/OPS-17_govtech_stack_plan_of_record, _decisions/2026-09-03_bastrop_tx_dashboards_pack_ratified, _inbox/2026-08-17_dashboards_missing_pieces]
---

# Decision

A single, narrow, additive-only change to `smartcity-os` is authorized: a new platform-internal, API-key-gated, read-only endpoint (`GET /api/platform/mygov/permits`) for `smartcity-dashboards` to consume. Nothing else about `smartcity-os` changes.

## Context

`smartcity-os` has been treated as absolute no-touch throughout this entire program (every OPS-17 amendment, every WDLL, every seat state file) because it is the live system genuinely serving real Bastrop staff today — PermitFlow, the welded ops app, `smartcityos.io`. It is also not a govtech-registered repo; this session has no write access to it via the seat-worktree-gate the rest of this program's writes go through.

G-116 Phase 2 (real vendor feeds on `smartcity-dashboards`) found that `smartcity-os` already has a real, hardened MyGov integration — a dedicated scraper microservice, cron sync, a repair/reconciliation pipeline, and a documented data-accuracy contract (active permit counts must use `in_mygov_active_list=true`, not `status_normalized='active'`, which undercounts by 193 records). It also already exposes `GET /api/mygov/permits`, but gated by session-based tenant middleware only — no service-to-service auth path exists for another product to read it.

Three options were weighed: re-scrape MyGov independently (duplicates a pipeline `smartcity-os` already built and hardened, against a login-gated third-party site); read `smartcity-os`'s Postgres directly (zero changes there, but couples `smartcity-dashboards` to its internal schema); or add a narrow read path to `smartcity-os` itself. Operator chose the third, explicitly authorizing the no-touch line to be crossed for this one purpose.

## Reasoning

Reading through `smartcity-os`'s live API reuses all of its existing sync/repair/enrichment work and the specific, hard-won accuracy contract, rather than re-deriving or duplicating it. It keeps the two products' data models decoupled (an API contract, not a shared schema) in a way a direct DB read would not. The alternative — re-scraping independently — would re-introduce exactly the kind of gotcha (`status_normalized` undercounting) `smartcity-os`'s own team already found and fixed.

The change itself is scoped to stay narrow on purpose: one new route, one new secret (`PLATFORM_INTERNAL_API_KEY`), fails closed if unset, accepts no query parameters (a fixed, correct query — not a free-form filtering surface for an external caller), and reuses the existing `dbPermitToApi` row shape and query logic rather than writing new mapping code. It does not touch, wrap, or modify any existing route's session-based auth. Full test suite (114 tests, 20 files) passes unchanged after the addition; `tsc --noEmit` shows the same pre-existing errors as `origin/main`, none introduced.

## Structural commitment check

- Sell reasoning, not data: unaffected.
- Confidence earned, not asserted: the new route asserts nothing about permit status beyond what the documented, already-verified `in_mygov_active_list` contract states.
- Cost per jurisdiction onboarded: this pattern (a narrow platform-internal read endpoint on the source system) is the template for the remaining 6 vendors with transferred credentials (Samsara, OpenGov, FirstDue, GoTo, PowerBI, Spireon) if the same "smartcity-os already has it, working" situation holds for each — not assumed here, to be checked per vendor.
- Dual interface: unaffected.

## Reversal criteria

Revert the `smartcity-os` change (delete the route, delete the secret) if: it is never actually consumed by `smartcity-dashboards`; a security review of the key-based auth pattern finds it insufficient; or `smartcity-os`'s own team (property seat) objects to a govtech-authored change living in their repo, in which case the route gets re-authored by or handed to that seat instead.

## Dependencies

Depends on: G-116 Phase 2 credential transfer (A-113), the three-option architecture question the operator resolved directly.
Feeds: the actual `smartcity-dashboards` consumer code (permits-pipeline domain reading this endpoint), not yet built.
Does not reopen: the general absolute-no-touch rule for `smartcity-os`, which stands for every OTHER kind of change — this decision authorizes exactly one endpoint, not open season on that repo.
