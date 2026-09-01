---
id: 2026-08-24-substrate-to-property-revenue-panel
title: Change request — Command Center Revenue Meter must not read totals.billed
status: open
date: 2026-08-24
from_seat: substrate
to_seat: property
---

# Change request to PROPERTY (hauska-map command-center)

SUBSTRATE S-3 retired `metering_events.billed`. The column recorded authorization, not payment. MCP `GET /metering/summary` now returns `totals.authorized` and `totals.unauthorized` and emits no `billed` / `unbilled` / revenue figure.

The live consumer is PROPERTY-owned:

- `apps/command-center/src/admin/control/panels/RevenueMeter.tsx` reads `summary.totals.billed` and `summary.totals.unbilled` and labels the panel as billed/revenue.
- `apps/command-center/src/admin/api/proxyContract.test.ts` names the Revenue Meter panel.

SUBSTRATE does not write hauska-map. Repoint the panel to `authorized` / `unauthorized`, change the heading so it does not say revenue, and do not coerce a missing `billed` to `0`. A silent zero is a new defect of the same family.

This is the retirement half of S-3. The MCP column rename ships in the S-3 PR. The panel must fail visibly until this request lands, not render undefined as zero.
