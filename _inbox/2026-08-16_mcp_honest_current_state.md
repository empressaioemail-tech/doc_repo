---
id: 2026-08-16_mcp_honest_current_state
title: Honest current state — Hauska MCP Server
status: draft
last_updated: 2026-08-16
applies_to: portfolio
owner: nick
related: [50_hauska_mcp_server, 52_mcp_offer_and_buildout, 28_mcp_first_product_design, 29_mcp_surface_tier_model, _architecture_homes/03_mcp_gate_and_agent_surface, 14_pricing_framework, 90_operations/OPS-17_govtech_stack_plan_of_record]
---

# Honest current state: Hauska MCP Server

Date: 2026-08-16. Status: draft recon for the MCP WDLL. Not a grade. Not a launch claim.

## One line

The gate is a live Cloud Run service with a real limiter and a large tool registry. It is not a buyable product, not a public directory listing, and not the front door that hauska.dev currently serves.

## What is live (probed 2026-08-16 unless dated)

Serving URL `https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app`. **Re-pin 2026-08-16 afternoon:** revision `hauska-mcp-server-00072-puy` @100% tag `g60`. Tools **82** = public 13 / Codex 9 / reporting 53 / map 7. Codex tools call plan-review Cloud Run. Smart Files create/upload live. Cotality `get_property_detail` extinguished. Retrieval health `state=ok` with no HTTP 404 detail (probe path `/health`). Morning recon below is the pre-G-60 baseline.

Morning `_STATE` pin 2026-08-15: revision `hauska-mcp-server-00047-tpc` @100% tag `g58` (MCP #67, Smart Files backend retarget). L19 measured a different revision (`00063-fic`) on 2026-08-14.

`GET /health` 200 morning. `status=ok`. Postgres rate-limit store primary, `memory_fallback=false`, outage policy fail-degraded. Cortex dependency 200. **Morning lie (fixed on `00072-puy`):** retrieval then reported `state=ok` with `detail=HTTP 404`. 404 is not a working catalog path. Afternoon serving uses `/health` and does not call 404 ok.

Anonymous `POST /mcp` initialize 200, protocol `2024-11-05`, serverInfo name `hauska` version `0.1.0`. No header resolves to public. Malformed `X-Hauska-Key` is 401. `Authorization: Bearer` does not authenticate (silent public). Admin introspection uses a different header (`X-Hauska-Admin-Key`).

Metrics on this process: started 2026-08-15T20:33:56Z, `total_requests=7`, `tool_calls={}`. This instance has almost no production tool traffic.

Limiter (L19, 2026-08-14, then-serving `00063-fic`): anonymous initialize capped at 60 per wall-clock UTC minute per IP. First 429 at cumulative 72 because the bucket is a calendar minute, not a sliding 60s. Paid-tier load test: not run. 1,000 concurrent free sessions: not demonstrated.

Four product gates remain the architecture: public, codex, reporting, map. Afternoon live count on `00072-puy`: **82 tools** (public 13 / Codex 9 / reporting 53 / map 7). Morning recon still cited 76j F (2026-08-09, then-serving `00040-ctj`) **71 tools** (public 13 / codex 5 / reporting 46 / map 7). Canon docs that still say 63 or 62 are stale.

Smart Files list/read were retargeted off cortex-api (G-58). Afternoon: `create_smart_file_folder` and `upload_smart_file` are live MCP tools against the files service (`folder:tenant:icc-demo:g60-mcp-write-probe`, `smartfile:tenant:icc-demo:mcp-g60-probe.txt`). `share_smart_file_folder` is registered, not separately live-called.

Codex gate on `00072-puy` is retargeted at plan-review (`PLAN_REVIEW_BACKEND_URL`). Live: `codex_findings_fetch`, `codex_finding_generation`, `codex_override_write`, `codex_briefing_fetch`, `plan_review_get_code`, `plan_review_get_letter`, `icc_activity_list`. Spec 48 F2 Cotality copy is still a doc lie; the live path is parcel-node / public-record.

## What is designed and not wired

Metering exists as a rate limiter and a product-key gate. It does not charge anyone. `@hauska-sdk/payment` has a USDC/x402 crypto rail in package form. Circle is the settled fiat rail. There is no Circle payment creation, no webhook, no verification. `generateFiatCheckoutUrl()` returns a fake `checkout.circle.com` URL. Revenue routing / split layer is unbuilt. Take rate 1.5 to 2.5 percent sets at first paid Layer 2 call. ICC is the first real SDK customer (decision 2026-08-15). G-30 defect is live: ICC ingest still hardcodes a public-free path on engine main. S-4 content-to-actor reference is heuristic, not a hard field.

Self-serve signup and key issuance for an unknown agent operator do not exist. Keys are minted by operators. Command Center is non-commercial (doc 29). Do not put a checkout on CC.

Contract pin on MCP has lagged the published `@empressaio/atom-contract` (76j F: deployed ^1.9.0 against program 1.15.0+). Re-verify on current revision.

76j F (2026-08-09): every `hauskaClient` call from MCP to retrieval-api returned 401 because Bearer keys did not match. MCP1 (2026-08-12) widened the property atom chain and probed live parcels. Afternoon `00072-puy`: `get_property_atom_chain` on `48021:28286` is ready; `search_atoms` reaches retrieval (0 hits for the bastrop-tx setback query used in the probe). Morning 404-as-ok health lie is gone.

Map/reporting tools still described Cotality in 76j F. Standing decision: re-route, never rotate that credential.

## What discoverability actually is

May 2026 GTM track shipped code for `hauska.dev/mcp`, `llms.txt`, `.well-known/agents.txt`, and draft directory submissions. Those drafts were not submitted.

Live 2026-08-16:

- `https://hauska.dev/` and `https://hauska.dev/mcp` return the 114-byte SmartSite lander (`window.location.href="/lander"`).
- `https://hauska.dev/llms.txt` is a generic robots allow/disallow-training file, not the MCP agent catalog.
- `https://hauska.dev/.well-known/agents.txt` is the same lander HTML.
- `https://mcp.hauska.dev/mcp` does not resolve (DNS NXDOMAIN).

The public claim "Texas building code MCP" has no public hostname that an agent directory can list. The working transport is the Cloud Run URL. Cursor's `user-hauska-cortex` connector in this workspace is in error and requires re-auth.

Directory packages exist as drafts in `hauska-mcp-server/launch/` (Anthropic directory, awesome-mcp-servers PR). Not filed.

## What "monetizable" is not

A working limiter is not a price. A product key is not a customer. A Vercel QA UI is not an MCP offer. Smart Files write tools landed on `00072-puy` as G-60; they are not a buyable catalog. Command Center traffic is not commercial proof. PE save/share is not Smart Files and not MCP.

## Split (so the next WDLL does not become one unbounded card)

1. **Functional substrate.** Catalog tools actually reach retrieval. Health does not call 404 ok. Cotality paths fail closed. Contract pin current. Smart Files write tools optional and small.
2. **Lane C tools.** Only after F1 through F7 are live-true. Wrapping a Cotality F2 is a lie.
3. **Tested.** Live probe suite on serving revision. Paid-tier limiter proof. Negative tests for anon vs bad key vs product gate.
4. **Monetizable.** Self-serve key. Meter to Circle. ICC actor reference. G-30 stamp. First paid Layer 2 call with a take-rate number.
5. **Discoverable.** A hostname that is the MCP, not the SmartSite lander. Real `llms.txt` / `agents.txt`. One directory listing filed only after 1 and 3 pass.

Companion WDLL `_inbox/2026-08-16_mcp_wdll_monetizable_tested_discoverable.md` is **superseded**. ICC-altitude successor: `_inbox/2026-08-16_blueprint_mcp_icc.md` under `_inbox/2026-08-16_icc_demo_program_WDLL.md`. This recon file stays as input; re-pin live before grading.
