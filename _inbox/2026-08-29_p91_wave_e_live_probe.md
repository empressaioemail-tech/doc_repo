---
id: 2026-08-29_p91_wave_e_live_probe
title: Wave E live situs-search after #539 serving
date: 2026-08-29
status: accepted-hits
plan_row: P-91
wdll: 18, 27, A5
---

# Wave E live probe

Snapshot: 2026-08-29T02:28Z. Serving `cortex-api-00656-vek` @100% tag `p539`. Digest `sha256:8c5fcd2577807fd6af1b06a5752eeccc8b1e937410eee0ebcb8229490c0fc000` = image tag `d070e2ad85a55de167446734cfcb2d7d2bb371ce` (#539 squash). minScale=1. `CORTEX_USER_DAILY_API_LIMIT=50000`. Staging `00646-luj` still tagged `staging` at 0%. Production `/api/healthz` 200.

Instrument: `GET /api/brokerage/v1/place/situs-search` on `https://cortex-api-tds7av26va-uc.a.run.app` with service Bearer. Key not printed. `--max-time 25`.

## Falsifiers (stated before the results)

Pine and Rainmaker must be hits. zzzz must be `missClass=no-hit`. A budget class on Pine is a fail.

## Results

| q | http | s | n | first | missClass |
|---|---|---|---|---|---|
| `908 Pine, Bastrop TX` | 200 | 1.418 | 2 | `48021:34137` parcel-situs `908 PINE , BASTROP, TX 78602` | none |
| `111 Rainmaker Cv, Bastrop TX` | 200 | 2.833 | 2 | `48021:8720522` parcel-situs | none |
| `zzzz-not-a-situs-99999` | 200 | 0.364 | 0 | | `no-hit` |

Second hit on Pine and Rainmaker is an address-point (`parcelNodeId` null). Not a miss.

A5 forty unblocked on HTTP. `create_screen` Connect paste still ungraded. Wave D listing still a separate MCP deploy.
