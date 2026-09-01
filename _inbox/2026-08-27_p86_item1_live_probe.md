---
id: 2026-08-27_p86_item1_live_probe
title: P-86 item 1 live probe on smartsite.cloud
date: 2026-08-27
status: recorded
plan_row: P-86
---

# P-86 item 1 live probe

Snapshot: 2026-08-27T02:17Z. hauska-map #227 merged `f968d6fe`. PE `dpl_DLL3qfcjsXsor4zEmHUtehT1QPLe` aliased smartsite.cloud. Cortex `cortex-api-00589-jen` @100% image `0dd3e159abcff8968c02c226881d42b4136627ee`.

Probe grant `c86a0001-0086-4086-a001-000000000001` on `48021:34137`, created 2026-08-27T02:11:07.662Z, expires 2026-09-26T02:11:07.662Z.

| Check | Result |
|---|---|
| Pre-deploy `/s/{id}` | SPA `index.html` |
| Live HTML GET | 200, not SPA, `X-Share-Freshness-Days: 30`, parcel 48021:34137 |
| Live markdown | 200 `text/markdown` |
| Live JSON | 200 `kind: grant-scoped-share-instrument` |
| HMAC in `/s/` | 403 `share_grant_invalid` |
| `/share` | still SPA `index.html` |
| `/llms.txt` | 200 `text/plain`, hash form non-fetchable |

Item 1 customer-done on `https://smartsite.cloud/s/c86a0001-0086-4086-a001-000000000001`.
