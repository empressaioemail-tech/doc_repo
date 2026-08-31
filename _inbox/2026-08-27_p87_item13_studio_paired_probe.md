---
id: 2026-08-27_p87_item13_studio_paired_probe
title: Operator probe — P-87 item 13 Studio paired grade
date: 2026-08-27
status: ready
plan_row: P-87
wdll_item: 13
gold_parcel: 48021:34137
gold_situs: 908 Pine St, Bastrop TX
---

# Item 13 — Studio paired inspect vs get_smart_site

Run after LDT PR deploy (setbacks refusal polish) and hauska-map #250 PE deploy.

## Preconditions

- Signed in as **Studio or Team** (not Free) on smartsite.cloud
- Parcel unlocked or tier covers deep read
- Claude Connect on same account (or MCP curl with OAuth token)

## Step A — Workbench inspect

1. Open `https://smartsite.cloud`, find **908 Pine** / `48021:34137`
2. Open brief dock on the right
3. Record for each section:
   - Zoning district / code
   - Setbacks-envelope: data vs refusal (must NOT be silent null)
   - Flood: present/refused + zoneExposureSummary if present
   - Land use

## Step B — MCP get_smart_site

Same session in Claude (or direct MCP):

```
get_smart_site parcelNodeId 48021:34137
```

## Pass criteria (item 13 met)

| Field | Workbench | MCP | Match? |
| --- | --- | --- | --- |
| parcelNodeId | 48021:34137 | 48021:34137 | required |
| Zoning | | | same district/code |
| Setbacks | | | same data OR same refusal code + reason |
| Flood | | | same disposition; atom present/refused aligned |
| Land use | | | same code |

**Fail if:** MCP shows `setbacks-envelope` with `data: null` and no `refusal` / `disposition: refused` / `agentGuidance`.

**Fail if:** MCP body is thinner than workbench (withheld fields not labelled).

## Record

File timestamp, cortex-api revision, smartsite-mcp revision, PE bundle hash, and one JSON snippet of `brief.sections` from MCP.

## After pass

Unblock item 21 Claude directory filing (Option B complete).
