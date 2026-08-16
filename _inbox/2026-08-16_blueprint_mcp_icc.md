---
id: 2026-08-16_blueprint_mcp_icc
title: Blueprint — finished MCP (dead ends gone, Codex live, Smart Files writes, ICC activity)
status: draft
last_updated: 2026-08-16
applies_to: portfolio
owner: nick
related: [2026-08-16_icc_demo_program_WDLL, 2026-08-16_mcp_honest_current_state, 50_hauska_mcp_server, 28_mcp_first_product_design]
---

# Blueprint: finished MCP

Pickup-executable. One server. Repo `empressaioemail-tech/hauska-mcp-server`. GCP `hauska-prod-497015`, us-central1, service `hauska-mcp-server`. No second server. No new GCP.

"Finished" for this card: catalog path true, health honest, Cotality dead, Smart Files complete, Codex tools calling live plan-review functions, ICC activity tool reading the inbound ledger. Not: Circle, self-serve keys, `mcp.hauska.dev`, directory listings.

Program WDLL items 14-17, 21 (MCP half). Substrate (14-15) may run in parallel with housing. Codex retarget (17) waits until plan-review `GET /` is 200.

Recon input: `_inbox/2026-08-16_mcp_honest_current_state.md`. Re-pin live before grading.

## Re-pin before any grade

- URL `https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app` (verify)
- Serving pin 2026-08-16: `hauska-mcp-server-00072-puy` @100% tag `g60`. Prior `00047-tpc` tag `g58`
- Auth: `X-Hauska-Key`. Bearer does not authenticate. No header = public. Malformed = 401
- Admin: `X-Hauska-Admin-Key`
- Health lie 2026-08-16 morning (404-as-ok) is gone on `00072-puy`: retrieval `state=ok` with no HTTP 404 detail (probe path `/health`)
- DNS: `mcp.hauska.dev` NXDOMAIN. Do not fix DNS on this card

## Dead ends (gone for every key)

| Tool | Action |
|---|---|
| `get_property_detail` | Fail closed `extinguished`. Not credential-pending. Zero Cotality. |
| `get_replacement_cost` | Same |
| `get_hazard_profile` / `get_parcel_polygon` | Strip Cotality/CoreLogic from copy. No Cotality call. NFHL rewire is not this card unless already a one-line copy fix |
| Retrieval health 404-as-ok | 404 is not `ok` |
| `codex_*` still aimed at LDT Cotality F2 | Retarget to plan-review Cloud Run. Leaving them on LDT is a remaining dead end |

Do not delete `generate_property_brief` or the 46 `cortex_*` tools. Reporting keys keep them. They are not the ICC path.

## Codex gate retarget (this is "MCP finished" for plan review)

Existing names, new backend. Client env `PLAN_REVIEW_BACKEND_URL` + `PLAN_REVIEW_API_KEY`. Zero plan-review DSN on MCP. Refuse cortex-api as the plan-review host.

| Existing tool | Calls |
|---|---|
| `codex_findings_fetch` | GET queue + GET findings library |
| `codex_finding_generation` | POST intake and/or GET matrix (generation of determinations) |
| `codex_override_write` | POST override (engine ingest behind plan-review) |
| `codex_briefing_fetch` | GET briefing |
| `codex_snapshot_ingest` | Smart Files upload into the engagement folder (not LDT snapshot) |

Add (do not invent a second server):

| New tool | Calls |
|---|---|
| `plan_review_get_letter` | GET letter |
| `plan_review_get_code` | GET code library |
| `plan_review_get_map_context` | GET engagement map payload (parcel + overlays). Does not serve tiles from MCP. |
| `icc_activity_list` | GET `/api/icc/activity` |

If a Codex tool cannot be retargeted without lying, fail closed with `not_wired` until plan-review is live. Do not keep a Cotality path as a fallback.

## Smart Files (complete)

Client `SMART_FILES_BACKEND_URL` + `SMART_FILES_API_KEY`. Refuse cortex-api.

| Tool | HTTP |
|---|---|
| `list_smart_file_folders` | GET `/api/smart-files/folders?scopeType=tenant&scopeId=` |
| `read_smart_file` | GET `/api/smart-files/files/:entityId` |
| `create_smart_file_folder` | POST `/api/smart-files/folders` |
| `upload_smart_file` | POST `/api/smart-files/folders/:id/files` |
| `share_smart_file_folder` | POST `/api/smart-files/folders/:id/share` |

Add files personas `icc-demo/reviewer` and `icc-demo/observer`. Redeploy `smart-files` in `smart-files-505619`. Isolation: Acme list does not contain icc-demo. `folder:tenant:g58-probe:room` still lists.

## Keys

Mint reviewer + observer product keys named `icc-demo`. Record ids. Revoke extras.

Reviewer: Codex tools (write), Smart Files writes, catalog `get_atom` / `search_atoms` / `get_property_atom_chain` / `list_jurisdictions`.

Observer: Codex reads, Smart Files list/read, `icc_activity_list`, catalog reads that the stamp allows.

Both: Cotality tools extinguished. Anon: no ICC bodies, no icc-demo folders, no `icc-model-code` in list_jurisdictions after G-30.

This is a product-key gate on a finished server, not a five-tool toy server.

## Substrate checks (before retarget)

1. Re-count tools with denominator (total / by gate).
2. Public-free non-ICC `get_atom` or `search_atoms` is store truth.
3. `get_property_atom_chain` on `48021:28286` and `48021:27303`.
4. Health retrieval not ok-on-404.
5. `get_property_detail` extinguished for anon and operator key.
6. Record `@empressaio/atom-contract` pin vs published.

## Out

Circle. Self-serve signup. DNS. Directory. Deleting reporting tools. Public-paid. Second server. Command Center checkout. 1000-session load test.

## Deploy

Worktree off hauska-mcp-server main. Canary then 100%. Planner-owned. Probe health + initialize + Codex tool against a live engagement before 100%.

## Close

`_inbox/2026-08-16_mcp_icc_container_close.json`. Cite WDLL 14-17. Record revision, tool count, Codex retarget matrix, Smart Files write proofs, `icc_activity_list` sample, Cotality call body.
