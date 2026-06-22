---
id: 2026-06-22_hauska-mcp-server_cc-agent-M_icc_poc_usage_metering_close
title: cc-agent-M — ICC PoC usage attribution wiring + scoped content-usage + pay-per-query views
date: 2026-06-22
agent: cc-agent-M
repo: hauska-mcp-server
dispatch: ICC PoC demo — WS-M (usage tracking, criterion 3)
status: close
commit: 693b396
mirrored_by: planner (cc-agent-M has no doc_repo access; mirrored by planner per protocol)
---

# Close — ICC PoC usage attribution + pay-per-query (WS-M)

Landed as commit `693b396` in hauska-mcp-server. Wires atom-grain read attribution into the gate ledger and builds the ICC-scoped content-usage and pay-per-query demo views. No ICC content required; built against existing atom traffic.

What landed:
- `logToolRead` wired across the catalog and L-surface read tools in `src/tools.ts` (389 lines reworked), so `request_log.atom_ids_returned` is populated with the exact DIDs the gate returned — the same ledger that backs the formal citation (criterion 1) and the usage meter (criterion 3).
- `observability/queries/content_usage.sql`: per-atom usage grouped by atom, surface (product), and tool, with an ICC-scoped panel filtering to ICC-derived atoms. Section labels parsed from the DID local id so dashboards do not join the engine.
- `observability/queries/pay_per_query.sql`: per-query ICC meter, `would_charge_usd = atoms x demo_cents_per_atom`, with `charge_state` hard-set to `NOT-CHARGED`. PoC forbids commercial use; this is a demonstrated mechanism, content-usage only (no calibration or atom internals).

ICC scope filter matches cc-agent-E's DID convention: `did:hauska:code-section:icc-%` OR `icc-model-code` as the first path segment. Verified consistent against E's `demo-instance.ts` (DIDs minted as `did:hauska:code-section:icc-model-code/...`); the `section_ref` regex strips exactly E's prefix. The usage view resolves ICC atoms at demo time.

Verification (planner ran, 2026-06-22): `node --import tsx --test tests/read-attribution.test.ts` — 2 tests passed (`atomIdsFromProvenance` dedupes/trims DIDs; `logToolRead` emits `atom_ids` and `atom_ids_returned`).
