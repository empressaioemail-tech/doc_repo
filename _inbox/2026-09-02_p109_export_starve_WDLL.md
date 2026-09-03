---
id: 2026-09-02_p109_export_starve_WDLL
title: WDLL — P-109: export_instrument is starved, so every Studio deliverable is unreachable via the connector
date: 2026-09-02
last_updated: 2026-09-02
status: open
applies_to: legacy-design-tools (smartsite-mcp config and deploy workflow)
plan_row: P-109
owner: property seat
---

# P-109 the export starve

## The defect, established at source, do not re-derive

`export_instrument` returns `not_ready` in production with `"Hauska MCP export proxy not configured"`. Verified three independent ways on 2026-09-02:

- `artifacts/smartsite-mcp/src/tools.ts:854` refuses on `if (!loadHauskaMcpConfig())`
- `artifacts/smartsite-mcp/src/hauska-client.ts` reads `HAUSKA_MCP_BASE_URL` and `HAUSKA_MCP_SERVICE_KEY`
- the serving revision `smartsite-mcp-00085-nuj` carries nine env vars and **zero** HAUSKA-prefixed ones

Exists, has a trigger, gating precondition never supplied. Starved, which reports as success and is worse than absent because absent is visible.

**The consequence is larger than one tool.** Site plan CAD, terrain and dossier are the Studio deliverables. None of them is reachable through the connector. P-104 spent a lane enforcing Studio gating on exports that cannot be exported via MCP at all.

## Done looks like

Either the config is supplied and `export_instrument` performs a real export end to end, or it is established that the upstream does not exist and the tool stops being advertised as available.

## Acceptance items

1. **Establish whether the upstream exists, before configuring anything.** Does a Hauska MCP server serve an export endpoint today, at what URL, and does a credential for it exist? Check Secret Manager, check what is actually deployed, probe the endpoint. Report present, absent, or unmeasured, each with the command that produced it. Do not infer from a document. | check: a live probe with its verbatim response | grade: [ ]

2. **If it exists, configure durably.** Both variables go in `.github/workflows/cloud-run-deploy-smartsite-mcp.yml`, never a manual `gcloud run services update`, because a workflow deploy is authoritative-replace and would revert a manual value at the next deploy. The key comes from Secret Manager as a `secretKeyRef`, never a literal. | check: read the config off the SERVING REVISION after a deploy, never the service template, which is the distinction that already caught this operation once | grade: [ ]

3. **If it does not exist, stop advertising it.** `mcp.smartsite.cloud/llms.txt` currently lists `export_instrument`. A catalog entry for a tool that always refuses is a claim the product cannot keep, and a directory portal that syncs the tool list off the running server will surface it. Remove it from the advertised list and say plainly in the close that the capability is not available. | check: the deployed llms.txt no longer lists it | grade: [ ]

4. **Either way, the catalog and the runtime must agree, and something must keep them agreeing.** Today nothing does, which is the same finding P-88 reached from the other direction: two capabilities went stale within five days and nothing flagged either. Name the executor, the trigger, and what fails when they disagree. If the honest answer is that nothing does, say that rather than implying the catalog maintains itself. | check: name the control or declare its absence | grade: [ ]

5. **Verify by violation, both directions.** Every check above shown failing on a deliberate violation and passing on restore, with verbatim failure text. | check: the close carries both directions per item | grade: [ ]

## Explicitly not this card

Do not build an export engine. Do not change the Studio gate; P-101 owns that and is in an open PR. Do not touch `artifacts/smartsite-mcp/src/tools.ts` beyond the minimum item 3 requires, because two open PRs hold that file. Do not rotate or create credentials for a third party.

## Leave behind

Declared at close per the contract, `none` being a valid answer.
