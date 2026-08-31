---
id: 2026-08-28_p88_item21_claude_directory_submission
title: Item 21 — Claude connector directory submission copy
date: 2026-08-28
last_updated: 2026-08-28
status: blocked
plan_row: P-88
wdll: _inbox/2026-08-28_smartsite_mcp_app_WDLL.md
wdll_item: 11
legacy_item: 21
blockers: _inbox/2026-08-28_p88_item21_directory_blockers.md
operator_ruling: 2026-08-28 — hold filing; B1 and B3 customer-done; B2/B4/S1-S3 copy-ready; S4 unconfirmed
llms_txt: https://mcp.smartsite.cloud/llms.txt
llms_txt_fetched: 2026-08-28
snapshot: doc_repo main 843b343
---

# Claude connector directory — DO NOT SUBMIT

**Blocked** per operator review 2026-08-28. Blocker card: `_inbox/2026-08-28_p88_item21_directory_blockers.md`.

B1 is customer-done on `00623-mag` (2026-08-28 Connect probe). B3 legal pages are customer-done 2026-08-28T15:36Z (`https://smartsite.cloud/privacy` and `/terms` serve real HTML). B2, B4, and S1 to S3 copy below is aligned to live `https://mcp.smartsite.cloud/llms.txt` (fetched 2026-08-28). S4 is still unconfirmed. Item 21 remains blocked on the operator prompt battery and the operator file. Do not file this listing.

---

## Form fields (draft — copy-ready for B2, B4, S1 to S3; not filed)

### Connector name

```
Smart Site
```

### MCP server URL (required)

```
https://mcp.smartsite.cloud/mcp
```

Do **not** use a `*.run.app` URL.

### Short description (≈280 chars)

```
Smart Site property intelligence. OAuth 2.1 + PKCE via WorkOS AuthKit; Google/Microsoft match the workbench. Find parcels, open analysis with source attribution and citations where available, list saved properties, run reports, ask the map. Tier-gated like smartsite.cloud.
```

### Long description (if the form has a separate field)

```
Smart Site helps land professionals, developers, and brokers understand flood hazard, land use, zoning, and build constraints.

Coverage is statewide flood and CAD land use where those layers exist in the store. Zoning is live in named Central Texas jurisdictions. Bastrop city (bastrop-city-tx) is the served reference. Empty zoning on a Dallas or Houston parcel is store absence, not a broken server.

Connect with OAuth 2.1 + PKCE via WorkOS AuthKit; Google/Microsoft match the workbench. Your Stripe subscription tier is the ceiling. Tools refuse honestly when data is unavailable rather than inventing setback distances or flood zones. Analysis includes source attribution and citations where available.

Eight tools. Find a parcel, get its smart site, list my properties, run a report, and ask the map. Export an instrument is live: it proxies Hauska MCP when configured and returns degraded (not server-down) if Hauska is unreachable. Request records and check a request are not ready until Records Request is live on production.

This is the Smart Site product connector, not the Hauska developer MCP catalog (mcp.hauska.dev).

Discovery: https://mcp.smartsite.cloud/llms.txt
Health: https://mcp.smartsite.cloud/health
Product: https://smartsite.cloud
```

### Category (pick closest)

Real estate · Property research · Legal / land use (use whatever Claude offers)

### Publisher / company

```
Empressa (Legacy Group ATX LLC)
```

### Website

```
https://smartsite.cloud
```

### Privacy policy URL

```
https://smartsite.cloud/privacy
```

Live HTML (B3 customer-done 2026-08-28T15:36Z). Not an open gate.

### Terms URL

```
https://smartsite.cloud/terms
```

Live HTML (B3 customer-done 2026-08-28T15:36Z). Not an open gate.

### Support email (S4 still unconfirmed)

```
support@empressa.io
```

No monitored `support@smartsite.cloud` alias found in tracked canon (MEMORY, `_smartsite_masters`, `72_hauska_inc_operations.md`, privacy/terms docs). Keep `support@empressa.io` until the operator confirms a monitored Smart Site alias.

---

## Example prompts (if the form asks)

B1 city/ZIP is customer-done on `00623-mag`. Prompt 3 is the S2 self-contained gold string.

```
Find 927 Main St, Bastrop TX 78602
```

```
Find 908 Pine St, Bastrop TX 78602
```

```
Get the smart site for 48021:34137 and summarize flood risk
```

```
List my saved properties
```

---

## After you submit

1. Save the public directory URL Anthropic returns.
2. Stranger-account reprobe: listing to Connect to OAuth to `48021:34137` at that account's tier.
3. File result in `_inbox/` with directory URL plus serving revision. That closes item 21.

Do not run those steps until the operator re-runs the prompt battery and files.

---

## In-app path (already live)

smartsite.cloud, signed in, **Use in your AI**, Claude, **Connect**.
(Deep link fixed hauska-map #250: Customize, then Connectors)
