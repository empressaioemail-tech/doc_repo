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

## Follow-up 2026-08-27T18:42Z

W5 #245 squash-merged `ce7e979`. Prod `dpl_3rhtry2GhnTYCj1B87m7FAxbczVD` aliased smartsite.cloud, bundle `index-EVyeDBjF.js`.

W1.8 parcel-id: `48021:27479` offered "Open parcel 48021:27479 direct parcel id" and landed `1308 PECAN ST , BASTROP, TX 78602`. Search bar then showed the address, not the APN.

W0.2: Compare dock Expand report toggles to Collapse report.

W5 live signed-out: `data-testid=compare-sign-in` text "Sign in to compare saved properties". Notes on A and click-B not walked without a saved pair.

## W5

LIVE on `ce7e979`. Sign-in gate graded. Notes / click-through leftover signed-in.

## leave_behind

- W0.7 note colors.
- Signed-in Hoffman / Stripe / fourth chat.
- `48021:27479` typed as a raw Find string.
- Engine/MCP still chip UNAVAILABLE (P1 still blocked).

## W2 2026-08-27T19:12Z

LIVE on hauska-map `3fd7f5e` (#247). Vercel `dpl_HrFQHm7fUTYA7LaPPwgUhWSowkRQ` aliased `https://smartsite.cloud`. Bundle `index-DZ53i0Px.js`.

| Item | Grade | Evidence |
| --- | --- | --- |
| 16 W2.1 | met | Browser GET `/s/c86a0001-0086-4086-a001-000000000001` with `Sec-Fetch-Dest: document` returns 302 `Location: /share?g=…`. Signed-out browser lands the full map at 908 PINE , BASTROP, TX 78602, gold parcel, brief on the right. This grant has no notes in the dock (notes unmeasured on this fixture). `?format=html` + dest=document stays 200 instrument titled 908 PINE. No sec-fetch stays 200 instrument. |
| 17 W2.2 | leftover | Free recipient cannot generate: signed-out Reports says "Sign in to run reports". Paid-vs-free generate lock needs a signed-in free account. |
| 18 W2.3 | leftover | Anonymous work survives sign-in: Google OAuth, planner cannot complete. |
| 19 W2.4 | partial | Instrument HTML has `data-testid=share-live-view` → `/share?g=…`. In-app PDF viewer header has "Open live view of this property". Engine PDF bytes unmeasured. |
| 20 W2.5 | met | Shared analysis "View PDF" opened `pdf-viewer` with Close + Download PDF + live-view link. |
| 21 W2.6 | met | Reports dock has My reports (pressed) and Shared with me. |

leave_behind: engine must render live-view at top of Flood/X-ray PDFs. Notes-on-share need a grant that actually carries notes.

## W3 2026-08-27T19:28Z

LIVE on hauska-map `2655986` (#249). Vercel `dpl_7A2spvv9AxtaCeHbKtwMnT18yPd9` aliased smartsite.cloud. Bundle `index-DQ3tFl87.js`. W2.1 still 302 on the fixture grant.

Signed-out My properties is the sign-in dock (items 22–27 need a saved property). Bundle contains `dossier-share-persona`, Include notes, and "does not send email".

| Item | Grade | Evidence |
| --- | --- | --- |
| 22–27 W3.1–W3.6 | leftover | Unit suite green. Live signed-in walk not done (Google). Flood exclude is stored on the package; the grant instrument has no flood artifact slot. |
