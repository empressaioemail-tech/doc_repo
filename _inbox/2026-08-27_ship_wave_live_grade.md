---
id: 2026-08-27_ship_wave_live_grade
title: Live grade — ship wave W0 W1 P0 W6/W7
status: filed
last_updated: 2026-08-27
---

# Ship wave live grade

Snapshot: hauska-map `b97a3e6` (#241 on #240 #238 #237). Vercel `dpl_96eN8m1qXAivZFDGHjtQEbVFqXts` aliased `https://smartsite.cloud`. HTML serves `index-D9fe2RH0.js`. Graded 2026-08-27T18:30Z signed out. WDLL items 1–15, 28, 39–40.

## W0 Chrome

| Item | Grade | Evidence |
| --- | --- | --- |
| 1 W0.1 | met | Open brief then chat. Brief released, chat pressed. One dock. Bubbles on the right. |
| 2 W0.2 | partial | Dock expand control toggles Expand/Collapse report. Two-column Compare read not graded (signed out, no saved pair). |
| 3 W0.3 | met | 1308 PECAN ST brief on the right. Inspect facts inside brief. Left bubbles still usable. |
| 4 W0.4 | met | High-level Zone / Lot / Flood first. More facts collapsed. |
| 5 W0.5 | met | Legend, notifications, drawing tools, layers are four left bubbles. Draw and layers opened together as separate panels. |
| 6 W0.6 | met | Both left panels open. Collapse all is present. |
| 7 W0.7 | dropped this pass | Note pin colors and hover not walked. |

## W1 Find

| Item | Grade | Evidence |
| --- | --- | --- |
| 8–14 W1.1–W1.7 | partial | 1308 Pecan disambiguates Parcel vs Address (Street / Drive / city). One click on Bastrop landed, gold subject, zoom, setback line, brief right. Other strings and 1620 Bryant not walked. |
| 15 W1.8 | met | `1308 Pecan` offered 1308 Pecan Street Bastrop, Texas. Pick landed `1308 PECAN ST , BASTROP, TX 78602`. Parcel-id string `48021:27479` not walked this pass. |

## W4.P0

| Item | Grade | Evidence |
| --- | --- | --- |
| 28 | met | Live bundle contains `pipeline_output_absent`. POST `/api/pe-site-plan-export?kind=dossier` with only `parcelNodeId` returned 401 and no PDF bytes. Server 422 hollow path not reached without a session. |

## W6 / W7

| Item | Grade | Evidence |
| --- | --- | --- |
| 39–40 | partial | Signed-out Reports is sign-in first. Body has no Coming soon and no 10/12 meter. Team $349, annual default, Stripe unlock, fourth chat, and marketing Pricing nav not live-clicked (need a signed-in session). Unit suite on #241 still holds those. |

## W5

Code on `fix/qa-w5-compare`. Not in this deploy. Live click-through waits for the next SHA.

## leave_behind

- W0.7 note colors.
- Signed-in Hoffman / Stripe / fourth chat.
- `48021:27479` typed as a raw Find string.
- Engine/MCP still chip UNAVAILABLE (P1 still blocked).
