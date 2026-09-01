---
id: 2026-08-27_ship_wave_live_grade
title: Live grade — ship wave W0 W1 P0 W6/W7
status: filed
last_updated: 2026-08-28
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

## Nick signed-in walk 2026-08-27T22:15Z

Operator screenshots. Live was `5ff60e4` / `index-BjUy_omD.js` at walk time. Fix for the two defects shipped `2b3a736` `dpl_94JVCwjnB6tuyefDe6MTqtDVKJrt` bundle `index-DYJTvYgr.js`.

| Item | Grade | Evidence |
| --- | --- | --- |
| W0.2 | met | Compare two-column: 1101 Chestnut vs 145 Hasler Shores. |
| W0.7 colors | met | Draw notes 1 blue / 2 green on 1101 Chestnut. |
| W0.7 hover | defect then fix | White text on white MapLibre popup. Contrast CSS shipped. Re-grade. |
| W3 row click | defect then fix | Clicking a saved row opened Brief (`inspectInPlace` stole the rail). `keepDock` shipped. Re-grade. |
| W3.4 list | met | List rows show X-ray / Flood include, status chips, notes/chat/drawings labels. |
| W2 include-notes | met on rail | Share dock checkbox + `/s/750145cc-…`. Dossier notes on share still need the dossier dock. |
| W5.1 / W5.2 | met | Notes on B (`test note`). Pair survives. |
| W6.2 copy | met | Plans: "2 months free · 10 × monthly". Start Solo / Studio / Team. $15 / 30 days. 12 seats $349 helper. |
| W6.1 checkout | partial | 10 seats $299. 12-seat checkout not clicked. |
| W6.3 | met | Back to cart + Change seats on Stripe Team page. |
| W6.2 toggle | leftover | Plans Monthly selected; Stripe still "billed annually" $2,990. |

leave_behind: monthly toggle vs annual Stripe session. 12-seat live checkout. Wallets / unlock error. Flood exclude on the instrument.

## Nick signed-in walk 2026-08-27T22:36Z

My properties detail stayed open (keepDock). Operator then graded the next defects on that surface.

| Item | Grade | Evidence |
| --- | --- | --- |
| W3 dossier stay | met | 145 Hasler Shores detail: notes `test note`, Researching, Include notes, Agent persona. |
| W3.3 persona contrast | defect | Who I am sharing with: white text on white OS list. |
| W3.3 copy after mint | defect | Link `https://smartsite.cloud/s/dae16d61-…` shown with no Copy link. |
| W2.1 recipient dock | defect | Recipient `/share?g=b0864737-…` opened Property brief, not Shared analysis. |
| W6 first paint | defect | Plans landed on Annual. |
| W6.2 chip | defect | "2 months free · 10 × monthly" sat next to the toggle. |
| W6.1 seat placement | defect | Seat stepper and 12-seat $349 sat off the Team column. Math itself correct. |

Amendment filed. LIVE hauska-map `0fa17be` (#254). Vercel `dpl_9viNLTjjkX6aVoRkyxWZTmsC3yPW` aliased smartsite.cloud. Bundle `index-CJ_n-E23.js`.

## Nick signed-in walk 2026-08-27T22:54Z

Operator: all pass on the #254 ship.

| Item | Grade | Evidence |
| --- | --- | --- |
| W3.3 persona | met | Dark who-I-am-sharing-with menu readable. |
| W3.3 copy | met | Copy link after mint. |
| W2.1 recipient dock | met | Share land stays on Shared analysis, not Brief. |
| W6 first paint | met | Plans lands Monthly. |
| W6.2 chip | met | No header 2 months free chip. |
| W6.1 seat placement | met | Seats and $349 live in the Team column. |

leave_behind: W3.2 auto-save, W3.5 chats, W3.6 pass; W1 leftover strings; W2.2 / W2.3 / W2.4; 12-seat checkout click; wallets / unlock; W4 P1 blocked on engine chips.

## W1 leftovers 2026-08-27T23:12Z

LIVE hauska-map `987e5be` (#255). Vercel `dpl_BHHFS7ENuTVichTb9oNGgwJhr8E7` aliased smartsite.cloud. Bundle `index-JEQCZEMl.js`. Shipped for Nick walk. Not graded met.

| Check | Instrument | Result |
| --- | --- | --- |
| 905 Pecan | GET `/api/pe-geocode?q=905%20Pecan` no viewport | First feature is 905 Pecan Street, Bastrop. Second is 905 West Pecan Street, Stephenville. |
| 905 PECAN ST situs | GET `/api/pe-situs-search?q=905%20Pecan%20ST` | Empty. Store row exists as `48021:34161`. Cortex prefix leave-behind. |
| 17000 Simsbrook | GET `/api/pe-geocode?q=17000%20Simsbrook` | 17000 Simsbrook Drive, Pflugerville. |
| 1620 Bryant | GET `/api/pe-situs-search?q=1620%20Bryant` | Unit rows (1404, 2204, 1802, …). Not collapsed. |
| Bastrop Texas | GET `/api/pe-geocode?q=Bastrop%20Texas` | Photon still leads with FCI Bastrop house. Client merge drops address rows on place queries so UI should show City then County. |

leave_behind: Nick walk of the five Find strings; cortex situs prefix for 905 PECAN ST; W3.2 / W3.5 / W3.6; W2.2 / W2.3 / W2.4; 12-seat checkout; wallets / unlock; W4 P1 blocked on engine chips.

## W3 remainder 2026-08-27T23:13Z

Nick walk on live `987e5be` / 927 MAIN ST Bastrop.

| Item | Grade | Evidence |
| --- | --- | --- |
| 23 W3.2 | met | Flood on a fresh parcel created a saved property. |
| 26 W3.5 | met | Chat expands and contracts in the property area. |
| 27 W3.6 | met | Pass does not delete the property. |
| 20 W2.5 | defect | View PDF opened navy viewer chrome (live-view + Close + Download PDF) with no page. Flood download sends Content-Disposition attachment; Chrome iframe stays empty. |

## Nick walk 2026-08-28T05:41Z

LIVE hauska-map `b32d988` (#266). Vercel `dpl_5GxvPb1ibxKrxWwa6aqcs2ZEUcHb` aliased smartsite.cloud. Bundle `index-GKUuHHrr.js`.

| Item | Grade | Evidence |
| --- | --- | --- |
| 20 W2.5 | met | Operator: viewer verified good. Pages paint in the pdf.js chrome v2 card. Native embed retired. |
