---
id: 2026-06-22_hauska-brief-extension_extension-agent_icc_poc_brief_citation_close
title: extension agent — ICC PoC Brief surfacing with formal citation
date: 2026-06-22
agent: extension-agent
repo: hauska-brief-extension
dispatch: ICC PoC demo — Ext-1 (Brief ICC surfacing with formal citation)
status: close
commit: ab5c6e9
mirrored_by: planner (extension agent committed to product repo; mirrored to doc_repo by planner)
---

# Close — ICC PoC Brief citation surfacing (Ext-1)

Landed as commit `ab5c6e9` in hauska-brief-extension. Surfaces one ICC item inside the existing Brief flow with a correct, formal citation, demonstrating criterion 1 (citation) and criterion 2 (layer-in-between) on the Brief surface. Reuses existing factor chrome; runs on cc-agent-E's icc-model-code fixtures via the live gate.

What landed:
- `src/lib/icc-gate-retrieval.js` (233 lines): retrieves one IPMC 2018 maintenance section from the `icc-model-code` tenant through the reporting-product MCP gate with `platform-internal` access.
- `src/lib/formal-reference.js`: mints a finding-engine-shaped formal reference (section identifier + title + edition), matching cc-agent-C's `@workspace/finding-engine` reference shape for cross-surface consistency.
- Renders the reasoned line plus the cite in existing chrome (`brief-engine.js`, `lay-render.js`, `mcp-client.js`, and the popup/content/panel/research bundles) without any section body text (never republishes the raw code).
- Probe and test scripts: `scripts/probe-icc-gate.mjs` (live-gate probe), `scripts/test-formal-reference.mjs` (local reference-minting test).

Verification (planner ran, 2026-06-22): `node scripts/test-formal-reference.mjs` — "test-formal-reference: ok", exit 0.

Consumes via the gate (never the engine directly); the gate uses the reporting product key with the platform-internal access tier for ICC atoms.
