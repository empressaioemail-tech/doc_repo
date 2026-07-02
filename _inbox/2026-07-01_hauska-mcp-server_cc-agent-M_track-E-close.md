---
title: Track E close — compose_workspace MCP tool
date: 2026-07-02
agent: cc-agent-M
track: E (Shared Surface Sprint)
repo: empressaioemail-tech/hauska-mcp-server
status: COMPLETE
pr: 34
merge_commit: 080eb0147dbd17f0f43e161301e9d21ad307286a
deployed_revision: hauska-mcp-server-00008-mcr
service_url: https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app
rollback_revision: hauska-mcp-server-00007-njc
---

# Track E close — compose_workspace MCP tool

Status COMPLETE. The `compose_workspace` tool ships on the Hauska MCP server under the cortex product gate. It reads the live 46-entry cortex-api tile capability registry at invocation time and returns a WorkspaceComposition from a natural-language intent. Merged (PR #34, squash), deployed via the cloudbuild-mcp.yaml build-push-deploy pipeline, live revision healthy at 100 percent traffic, gate behavior independently verified on the deployed service.

## Tool registered under gate

cortex.

Gate reconciliation (flagged per org convention): the Track E dispatch and the shared_surface_principle doc name a "reporting" product gate. The live product enum in this repo is `public | codex | cortex` (src/products.ts); there is no "reporting" value, and per the ADR-008 2026-06-21 amendment cortex-api IS the reporting function package. Every cortex-api-backed tool (generate_property_brief, get_hazard_profile, the engagement tools) is already gated on `cortex`. compose_workspace reads the cortex-api registry and returns a cortex workspace composition, so `cortex` is its correct home. Registering under a non-existent "reporting" enum value would be permanently unreachable: `getCurrentProduct()` can never resolve to a value not in the enum, no minted key carries it, so the tool would 401 for every caller. Recommendation: keep the gate as `cortex`; if the org wants the surface renamed "reporting" to match the ADR reframe, that is a repo-wide product-enum rename (products.ts + keys/DB migration 002 + deploy), tracked separately, not a Track E change.

## End-to-end test result

Verified in Phase 2 against the LIVE registry (46 entries) through the exact runtime code path — request-context bound to product=cortex, real Bearer service token (LEGACY_BACKEND_API_KEY), live cortex-api fetch, real composition. Raw output:

    testA (with engagementId cc2e0a30-412a-46b8-b680-38ebfbed5d4a):
      registryCount: 46
      tiles: ["intake","hazard","intake-queue","compliance-run"]
      layoutId: "4"
      engagementId: "cc2e0a30-412a-46b8-b680-38ebfbed5d4a"
      why: 'Selected Intake & Upload, Hazard Profile, Intake & Queue, Compliance Run for: "show me compliance and hazard for a plan review"'

    testB (no engagementId, same intent):
      registryCount: 46
      tiles: ["intake","hazard","intake-queue","compliance-run"]
      layoutId: "4"
      why: 'Selected Intake & Upload, Hazard Profile, Intake & Queue, Compliance Run for: "show me compliance and hazard for a plan review"'

    testC (spatial intent "show the parcel and flood zone on the site map"):
      tiles: ["topography","drainage","subsurface","map"]
      layoutId: "4"    (map force-included via the spatial rule)

    testD (product=codex, gate check):
      gateRejected: true
      message: 'Tool "compose_workspace" requires a "cortex"-product API key. The caller is on product "codex". Contact support@hauska.dev to request access.'

Both testA and testB include the compliance (compliance-run) and hazard (hazard) tiles by their ACTUAL live registry ids, layoutId is a valid tile-shell key ("4"), why is non-empty, and engagementId echoes when provided. This matches the dispatch's expected shape (the dispatch's illustrative id "hazard-profile" is actually "hazard" and "document-viewer" is present on the workspace but not always in the top 4; assertions are against the ids the live endpoint returns).

Live deployed-server smoke (revision 00008-mcr):
- POST /mcp initialize -> 200, serverInfo hauska 0.1.0.
- POST /mcp tools/list -> 200, 59 tools, compose_workspace PRESENT with the correct input schema (intent required; engagement_id uuid, available_tile_ids string[], max_tiles int<=12 optional) and the CORTEX_TIER description.
- POST /mcp tools/call compose_workspace anonymously (product=public) -> 200 isError:true, "requires a cortex-product API key ... caller is on product public". Confirms the gate is enforced on the live revision (tool is NOT public).

## Tile registry fetch working?

Yes. Endpoint GET https://cortex-api-tds7av26va-uc.a.run.app/api/plan-review/admin/tile-registry, auth Authorization: Bearer <LEGACY_BACKEND_API_KEY>. Verified live independently (Invoke-RestMethod with the deployed secret): HTTP 200, 46 entries, hazard entry {"id":"hazard","label":"Hazard Profile","status":"live","requires":{"engagementId":true,"apn":true}}, compliance-run {"id":"compliance-run","label":"Compliance Run","requires":{"engagementId":true,"uploadedDocuments":true}}. The tool fetches it via legacyClient.getTileRegistry() INSIDE the handler (invocation time, never at startup).

## Env vars / secrets

No new env var or secret. The dispatch's CORTEX_API_URL / SERVICE_API_KEY are the conceptual names; the live wiring already present on the deployed service is reused:
- LEGACY_BACKEND_URL = https://cortex-api-tds7av26va-uc.a.run.app  (env var, already set)
- LEGACY_BACKEND_API_KEY  (Secret Manager secret in hauska-prod-497015, already bound; this IS the SERVICE_API_KEY the C-bridge close referenced, sent as Authorization: Bearer by the existing legacyFetch helper).
Both were already wired in cloudbuild-mcp.yaml and on the running service; the deploy re-applied them unchanged.

## Deploy revision + health

Deploy method: gcloud builds submit --config=cloudbuild-mcp.yaml (build + push + gcloud run deploy; this repo has no canary sequence and no GH deploy workflow). Project hauska-prod-497015, service hauska-mcp-server, region us-central1. Cloud Build a2a8cb8f-1836-4935-8811-e62be0a62d52 SUCCESS.

New revision hauska-mcp-server-00008-mcr, 100 percent traffic. Prior revision hauska-mcp-server-00007-njc is the rollback target.

Health (GET /health on the new revision): status "degraded" with dependency detail cortex_api=ok (47ms), postgres=ok (297ms), engine_retrieval_api=ok (HTTP 404 is the expected root-path detail), upstash=down ("fetch failed"). The upstash-down line is a pre-existing health-probe egress artifact on the rate-limit Redis and is unrelated to this change (this PR is additive: one new tool + one client method + a pure-logic module; it touches no rate-limit or upstash code). The dependency compose_workspace actually needs, cortex_api, is healthy.

## PR + merge

PR #34 (feat(cortex): add compose_workspace MCP tool). CI build-test PASS (22s). Adversarial reviewer PASS 9/9 (gate=cortex; valid MCP input schema; WorkspaceComposition output; invocation-time registry fetch; named-error degradation via describeLegacyFailure; pickLayout valid for counts 0-6; engagement filtering; no invented env/secret; build/lint/test green). Squash-merged as 080eb01. Full local suite 290 pass / 0 fail.

## Files

- src/legacy-client.ts — TileCapability wire type + legacyClient.getTileRegistry()
- src/compose-workspace.ts (new) — pure I/O-free composition: tokenizeIntent (stop-word + sub-3-char filter), word-boundary keyword scoring, coverage-first selectTiles, spatial map reservation, pickLayout, isSatisfied
- src/tools.ts — server.tool registration under requireProduct("compose_workspace","cortex")
- src/tool-copy.ts — LLM-facing description
- tests/compose-workspace.test.ts (new) — unit coverage incl. the live-registry crowding regression guard

## Known limitations

1. Engagement context is derived conservatively. cortex-api has no single engagement-context endpoint returning {apn, uploadedDocuments, completedFindings}. When engagement_id is given, the handler sets the engagementId requirement satisfied by the id, probes GET /engagements/:id/briefing to infer apn/jurisdiction (briefing present -> resolved), and treats uploadedDocuments/completedFindings optimistically as true (an active engagement normally has an uploaded submission; strict filtering here would wrongly drop compliance-run / document-viewer for a valid engagement). A dedicated engagement-context endpoint on cortex-api is the clean follow-on; wire isSatisfied to it when it exists.

2. Tile selection is keyword ranking, not LLM ranking. A coverage-first pass (one representative per named intent term) then a score-fill was added after live testing showed the naive substring scorer let stop-word noise ("a", "me") and same-category crowding bury the hazard tile. It is deterministic and testable. Full LLM re-ranking is a follow-on; the calling agent already supplies high-level reasoning, so the mechanical layer only needs to surface what is possible and relevant.

3. pickLayout emits "1","2h","3l","4","6" and never "2v"/"3r" (both are valid tile-shell keys). Acceptable; the consumer can override layoutId.

## Rollback

gcloud run services update-traffic hauska-mcp-server --region us-central1 --project hauska-prod-497015 --to-revisions=hauska-mcp-server-00007-njc=100

No DB migration in this change; nothing to unwind.
