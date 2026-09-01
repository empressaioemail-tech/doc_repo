CANON-PREAMBLE v03c41aa2

- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HELD until Bastrop QA-done + operator go.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- SMARTCITY PRODUCT LINE THEN BASTROP CUTOVER — template Dashboards (doc 31), then migrate city one. Do not rewrite `tenant_id=2` in place. Kill PermitFlow after Lane C is the staff path. CitizenConnect is the citizen lens, not a SKU. Feeds are adapters that write records. Decision `_decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding.md`.
- FEED ADAPTER CONTRACT (G-63, WDLL approved) — kinds are a catalog; grants are per city pack. Write spine or files with provenance. Never a Dashboards vendor table. Never Pipedrive as a city feed. Samsara fleet copies are not G-24. No live MyGov/Samsara on this card. Decision `_decisions/2026-08-17_g63_feed_adapter_contract.md`.
- SMARTCITY DASHBOARDS HOUSING — one product repo `empressaioemail-tech/smartcity-dashboards`, cities as tenant packs. Live Bastrop stays `smartcity-os` until a named cutover. Decision `_decisions/2026-08-17_smartcity_dashboards_housing.md`.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

AGENT-CONTRACT v7b714e95 — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
interruption recovery, slot law + lease, heavy-scan serialization, verification rules, close schema).
Read it before any work; where this dispatch and the contract disagree, STOP and report.

DEV-PROCESS vbb19bd34 — you are bound by 90_runbooks/DEV_PROCESS.md in full. It governs how work
is SHAPED and how a result is JUDGED: coverage figures travel with their denominator, classes are
measured never subtracted, an instrument's exclusion set is part of its contract, gating indicators are
proven able to fire, paired controls need a divergence test, guardrails that do not survive a clone are
not guardrails. Every rule in it is traced to an incident. Read it before any work.

PLAN-ROW: G-63 (90_operations/OPS-17_govtech_stack_plan_of_record.md)

# G-63 feed adapter contract

# G-63 feed adapter contract

WDLL `_inbox/2026-08-17_g63_feed_adapter_contract_WDLL.md` (approved 2026-08-17). Decision `_decisions/2026-08-17_g63_feed_adapter_contract.md`. Cite WDLL items on every PR.

## Mission premise

Operator approved G-63 2026-08-17. A vendor feed becomes a record with provenance and accessPolicy written onto spine or files. Kinds are a catalog. Grants stay empty on template-city. Not a product SKU, not a Dashboards vendor table, not live MyGov or Samsara, not G-24, not G-11.

## Completion predicate

Live `GET /api/adapter-kinds` on serving Dashboards lists mygov, samsara, opengov, esri, municode, firstdue, verkada; each kind has `writesTo` spine or files and a default `accessPolicy`. Pipedrive absent. Live `GET /api/city-packs/template-city` with Bearer has `grantedAdapters` length 0. Serving MCP `dashboards_list_adapter_kinds` anonymous. Compose is not a vendor JSON lens. City `00118-qox` unchanged. Planner owns merge, deploy, live probe.

## Scope basis

G-63 only. Catalog plus refusals. Not live vendor ingest. Not atoms `--apply`. Not Smart Files fixture seed. Not G-11. Not G-24 fill. Not smartcity-os. Not L26.

## Workers (no deploy, no merge)

1. Dashboards (WDLL 3, 4, 6, 7): isolated worktree from origin/main. Adapter kinds catalog. Public `GET /api/adapter-kinds`. template-city `grantedAdapters` stays []. Tests refuse pipedrive and `writesTo: mygov_permits`. Compose keys stay G-13 mounts, no vendor widget. No vendor API client. No new secrets. PR.
2. MCP (WDLL 5): isolated worktree from origin/main. `dashboards_list_adapter_kinds` anonymous on existing server. Hits `GET /api/adapter-kinds` with authorization omit. No credentials in the tool. No second MCP. CI four-set union. PR.

## Invariants

P:\smartcity-os no-touch. L26 holds atoms writer. G-60 STOP. One Hauska MCP. Samsara writesTo is files, not G-24. Deploys planner-owned. Verification stays with the lane planner.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-17_g63_cp1.json
  CP2: _inbox/2026-08-17_g63_cp2.json
  CLOSE: _inbox/2026-08-17_g63_close.json
