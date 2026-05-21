---
id: 2026-05-21_retrieval_api_hauska_prod_redeploy_cc-agent-E
title: Session — retrieval API redeployed into hauska-prod-497015, MCP catalog wired
date: 2026-05-21
agent: cc-agent-E
repo: hauska-engine
session_type: engineering
rolled_up: false
related: [2026-05-21_e0_retrieval_api_deploy_cc-agent-E, 2026-05-21_e1_layered_substrate_architecture_cc-agent-E, _dispatches/2026-05-21_cc-agent-E_adr019_pipeline_and_sync5]
---

# retrieval API redeploy into hauska-prod-497015

## Status

Done. The E0 retrieval API moved off its interim `legacy-design-tools-prod`
home into the dedicated `hauska-prod-497015` project. The Hauska MCP
Server's public catalog is wired to it and verified end to end. The
interim deploy is torn down; the data plane lives in one project.

## What was done

The `hauska-prod-497015` project was created by the operator, which
un-gated the redeploy.

Redeployed the retrieval API into `hauska-prod-497015` / `us-central1`,
service `hauska-retrieval-api`, from the committed corpus snapshot (5
jurisdictions, 2702 atoms — unchanged from E0). A fresh bearer key was
generated for the production deploy; the interim key is retired with
the interim service. The service runs `min-instances=1`: the public
catalog is a live data plane and a scale-to-zero cold start was
observed to exceed the MCP server's engine-call timeout, so the data
plane is pinned warm.

Production retrieval API URL:
`https://hauska-retrieval-api-172690833726.us-central1.run.app`

Wired the MCP server per cc-agent-M's hand-off doc
(`hauska-mcp-server/_sessions/2026-05-21_lane_m_handoff_cc-agent-M.md`):
the fresh key was added as version 2 of the `HAUSKA_ENGINE_API_KEY`
Secret Manager secret, and the MCP server was rebuilt via
`cloudbuild-mcp.yaml` with `_HAUSKA_BACKEND_URL` set to the production
retrieval API. The MCP `/health` engine dependency reads `ok`.

Tore down the interim `hauska-retrieval-api` service in
`legacy-design-tools-prod`. No retrieval-api service remains there.

`doc_repo/Secrets.txt` updated: `RETRIEVAL_API_URL` and
`RETRIEVAL_API_KEY` now carry the production values.

## Verification

All five public catalog tools were exercised end to end through the
deployed MCP Streamable HTTP endpoint, each resolving real data from
the production retrieval API:

| Tool | Result |
|---|---|
| `list_jurisdictions` | 2 public-free jurisdictions (bastrop_tx, grand_county_ut) |
| `search_atoms` | ranked results for "setback requirements" |
| `get_atom` | resolved a code-section atom by DID |
| `query_jurisdiction` | bastrop_tx status, quality bar passing, 181 atoms |
| `search_permit_atoms` | permit-tagged atoms for "single-family residence" |

Verdict: 5 / 5. The unauthenticated free-anonymous path returns only
`public-free` jurisdictions, so Path A tagging holds through the
deployed surface: the three `platform-internal` jurisdictions are not
visible to an unauthenticated catalog caller.

## Notes

`list_jurisdictions` returned a `Powered by Hauska Engine` attribution
string whose em-dash renders as mojibake in the MCP envelope. Cosmetic,
in the MCP server's envelope code (cc-agent-M's repo), not the engine;
flagged for cc-agent-M, not chased here.

## Next

Continuing Lane E Phase E1: the Layer 1 model-code adapter (E1.C.2)
and the edition-batch ingest, recent IRC / IBC / IECC first.
