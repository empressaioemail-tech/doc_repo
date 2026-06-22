---
id: 2026-06-22_hauska-engine_cc-agent-E_icc_poc_fixtures_isolation_close
title: cc-agent-E — ICC PoC fixtures, isolated demo instance, ingest path, runbook
date: 2026-06-22
agent: cc-agent-E
repo: hauska-engine
dispatch: ICC PoC demo — WS-0 (fixtures for dry run) + WS-F (isolation, Administrator, wind-down)
status: close
commit: ebdfa98 (+ 1097cd3 barrel export fix)
mirrored_by: planner (cc-agent-E committed to product repo; mirrored to doc_repo by planner)
---

# Close — ICC PoC fixtures + isolated demo instance (WS-0 + WS-F)

Landed as commit `ebdfa98` in hauska-engine (fixtures, ingest path, runbook), with `1097cd3` exporting `ICC_CODE_CONNECT_FIXTURES` from the adapters barrel. Enables an end-to-end PoC dry run on hand-built fixtures before live ICC credentials land. No live ICC API access used.

What landed:
- 2018 IBC and 2018 IPMC hand-built fixtures (`packages/corpus/src/adapters/icc-code-connect/__fixtures__/ibc-2018.ts`, `ipmc-2018.ts`), to be reconciled against live Code Connect payloads when credentials arrive.
- Isolated demo instance at `packages/corpus/src/model-code/demo-instance.ts`: synthetic tenant `icc-model-code`, `platform-internal` accessPolicy, an `X-Hauska-Access-Tier: platform-internal` designated-Administrator gate, and the wind-down property (delete the partition = wind-down, no production city tenant affected). ICC normative text is deep-linked, not hosted (layer-in-between enforced at ingest).
- Ingest path (`model-code/ingest.ts`) and eval rubric (`model-code/eval-rubric.ts`).
- Adapter README runbook (167 lines): live-ingestion steps (set ICC_CODE_CONNECT_CLIENT_ID/SECRET, reconcile the nine @assumption contract fields against ICC's real OpenAPI spec, discover, filter to the 2018 titles, ingest) plus teardown.

ICC scope convention (coordinated with cc-agent-M's usage views): ICC atoms are identifiable by three axes — `jurisdictionTenant === "icc-model-code"`, `sourceAdapter === "icc-code-connect"`, and DID localId prefix `icc-model-code/` (so DIDs are `did:hauska:code-section:icc-model-code/...`).

Verification (planner ran, 2026-06-22): `vitest run` on `model-code/__tests__/demo-instance.test.ts` and `ingest.test.ts` — 2 files, 6 tests passed.

Gate-1-blocked remainder: live OAuth credentials + assumption reconciliation + real ingestion only. Everything else runs on fixtures now.
