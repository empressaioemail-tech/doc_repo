---
id: 2026-08-17_g13_consumer_contract_WDLL
title: WDLL — G-13 consumer contract shape (spine / SmartSite / Smart Files)
status: graded
last_updated: 2026-08-17
applies_to: portfolio
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding,
    _decisions/2026-08-15_capability_mount_composition,
    _decisions/2026-08-17_g13_consumer_contract,
    _inbox/2026-08-17_g61_dashboards_template_WDLL,
    28_mcp_first_product_design,
    51_substrate_v1_sprint,
    80_adrs/adr_008_engine_factor_out,
  ]
---

# WDLL: G-13 consumer contract shape

Date: 2026-08-17  Status: graded
Operator approval: 2026-08-17 (operator: both are approved)

Plan row: **G-13** (OPS-17 shared leg S-5). Instrument: *Decision record; the B integration plan cites it.*

Lane B needs this ruling before G-61. It is not a Bastrop rewrite and not a new MCP server.

## Done looks like

One decision record names how SmartCity (and any later Empressa surface) consumes three suppliers: Hauska spine, SmartSite map, Smart Files. The contract chooses among MCP, atom-read, and service API once, not per category. Dual interface stands: MCP tools on the existing Hauska MCP server plus an embed/HTTP mount. Stores stay isolated. Live Bastrop is unchanged. G-61 may cite this record and must not invent a private shape.

## Acceptance items

1. **Operator approves this card.** Status flips from draft to approved before the ruling is treated as G-13 closed.
   | check: this file `Operator approval:` dated; status `approved`.
   | grade: [x] met 2026-08-17 | evidence: operator said both are approved.
   | depends on: none

2. **One decision record.** Filed at `_decisions/` with owner, reversal criteria, and the three suppliers named. Not a Slack paraphrase.
   | check: file exists; related list includes this WDLL; G-13 instrument satisfied.
   | grade: [x] met 2026-08-17 | evidence: `_decisions/2026-08-17_g13_consumer_contract.md`
   | depends on: 1

3. **Shape is one of MCP / atom-read / service API, named per supplier if they differ.** No fourth private bus. No second Hauska MCP server.
   | check: the decision table lists spine, SmartSite, Smart Files and the contract each uses; `51_substrate_v1_sprint.md` one-server rule is cited.
   | grade: [x] met 2026-08-17 | evidence: decision table: spine MCP+atom-read HTTP; SmartSite MCP+embed; files MCP+service HTTP. Pattern once (caller split). No second MCP.
   | depends on: 2

4. **B integration plan cites it.** G-61 WDLL related list and any Lane B dispatch name the G-13 decision id. A template that mounts without citing this record fails this item.
   | check: G-61 related frontmatter; a compiled dispatch `--plan-row G-61` would name G-13 as blocker until this item is met.
   | grade: [x] met 2026-08-17 | evidence: G-61 related list includes `_decisions/2026-08-17_g13_consumer_contract`.
   | depends on: 2

5. **Capability-mount composition is not reopened.** Isolated stores, application-layer composition, tenant-private default on files. This card chooses the wire, not the housing.
   | check: decision cites `_decisions/2026-08-15_capability_mount_composition.md` and does not merge databases.
   | grade: [x] met 2026-08-17 | evidence: decision cites capability-mount; forbids DSN and copied tables.
   | depends on: 2

6. **Live city unchanged.** No `P:\smartcity-os` writes. No city deploys. No G-11 session implied.
   | check: close names zero city deploys; G-11 remains OPEN.
   | grade: [x] met 2026-08-17 | evidence: close deploys=0 smartcityOsWrites=0. G-11 remains OPEN.
   | depends on: 1

## Out of scope

G-61 build. G-11 auth. G-45 cutover. G-52. Filling G-24. PermitFlow deletion. Second MCP server. Cortex remount of Smart Files.

## Amendments

(none until operator go)

## Finish card (graded at close)

Re-graded 2026-08-17 against the same item numbers. Decision `_decisions/2026-08-17_g13_consumer_contract.md`. Close `_inbox/2026-08-17_g13_close.json`.

1. met: operator approved
2. met: decision filed
3. met: caller-split table; HTTP target named per supplier
4. met: G-61 cites the decision
5. met: capability-mount not reopened
6. met: live city unchanged; G-11 OPEN

Drift vs Start: none. "Once" is the pattern; per-supplier HTTP targets are the isolated stores, not a private bus.
