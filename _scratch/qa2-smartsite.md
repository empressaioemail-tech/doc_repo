## GROUND-TRUTH 2026-08-29T00:33Z
P-94 deploy held before shift. LDT #537 merged `47f8274909303ea4b4d3bf3ae1ed7b66f037b831`. Canary `cortex-api-00653-yoy` tag=canary percent=null digest `sha256:976840636cd29ed942dc95e59bf693cf8f8362632afb3c76cf8c78dc74e7bdea` image_tag=full merge SHA. Serving still `cortex-api-00651-tor` 100. latestReady is 00653-yoy and is not serving. Staging 00646-luj percent=null. Bake on 00653-yoy `CORTEX_USER_DAILY_API_LIMIT=50000`. Job 33223511364 applied `0089_pe_team_roster.sql` at 2026-08-29T00:26:45.854Z (pending then ok applied). Unsigned canary GET team/members 401 authentication_required. Live BFF GET /api/spine-deep/api/property-explorer/v1/team/members with dummy pe_session is 403 Path not on deep allowlist. hauska-map main spine-deep DEEP_GET_EXACT has no team path. Tab cannot light after a shift. Did not shift. Did not write hauska-map. Close `_inbox/2026-08-29_p94_team_roster_deploy_close.json`.

## OPEN 2026-08-29T00:33Z
Need (1) Nick signed-in session for canary GET 200 parser shape, (2) exception to add team/members to spine-deep DEEP_GET_EXACT, (3) then shift-traffic. Stripe still does not write seats_purchased.

## GROUND-TRUTH 2026-08-28T23:55Z
Property-seat canvas worker salvage filed. `_inbox/2026-08-28_property_seat_canvas_salvage.md`. Byte copies under `_inbox/canvas_salvage/`. P-94 chat will close that worker. Remainder lives in the salvage, not the canvas.

## GROUND-TRUTH 2026-08-28T22:48Z
Planner reviewed P-94 Team close against P:/tmp/legacy-design-tools-team-roster. Pathspec matches git status (6 modified + 6 untracked). Write path: invite holds a seat, unknown seats 409 seats_purchased_unknown, last joined owner 409 on DELETE and PATCH, administrator dropped + CHECK. GET auto-inserts the billing user as joined owner. Accept path is absent: an invited email who signs in becomes owner of a new account via ensureOwnerMembership, invitation never converts. Did not commit, apply 0089, or deploy.

## GROUND-TRUTH 2026-08-28T22:45Z
Chrome debt shipped. hauska-map #294 squash 5fa74c15. Linux CI test+typecheck pass after rebase on #293. Prod dpl_7nbUVXLMi7sbGa5p5u4iG5zg5t8S aliased smartsite.cloud. Live GET / Age 0 Last-Modified 2026-08-28T22:45:17Z bundle index-BZZjHM_5.js. Tree P:/tmp/hauska-map-p93-chrome-debt @ 5fa74c1. Named leftovers 21 hex / 5 buttons remain.

## GROUND-TRUTH 2026-08-28T22:40Z
P-94 Team roster SERVER half on isolated LDT tree P:/tmp/legacy-design-tools-team-roster branch feat/pe-team-roster base 89e539f6 (origin/main). Uncommitted. Endpoints: GET /api/property-explorer/v1/team/members, POST /team/invitations, DELETE /team/invitations/:id, DELETE /team/members/:email, PATCH /team/members/:email. Reuses pe_user_identities / pe_user_entitlements / users. New tables pe_team_members + pe_team_invitations. seats_purchased nullable on pe_user_entitlements; omitted on the wire when null or when subscription_tier is not team. Violate-then-pass 19/19: POST at capacity 409 seat_capacity_exceeded and zero overflow row; DELETE/PATCH last joined owner 409 last_joined_owner and table unchanged; solo account omits seatsPurchased; planted administrator fails pe_team_members_role_chk and is not emitted. Did not commit, deploy, take Stripe, or write a second user table.

## OPEN 2026-08-28T22:40Z
seats_purchased is never written by the existing checkout/webhook. Checkout already sends Team seats as Stripe line-item quantity (base 10 + extras) but the webhook only persists subscription_tier. Until a Stripe grant writes the column, a live Team account omits seatsPurchased and invite refuses seats_purchased_unknown. Migration 0089 not applied to live Neon. OPS-16 row still pending. Parent commits the pathspec. Isolated tree is unregistered.

## GROUND-TRUTH 2026-08-28T22:50Z
P-93 chrome-debt conversion on isolated clone P:/tmp/hauska-map-p93-chrome-debt main 496f21b (descendant of 0e4dc5c). Hex 87→21, native buttons 60→5, baseline 37→8 files. Gate still fires: planted #aabbcc and <button/> in App.tsx each made `pnpm --filter property-explorer test` exit 1 and name the file; checkout island plant did not; gold-as-fill on PricingModal (`var(--ss-gold)`) exit 1 brand-mark message. pe-chrome-kit-gate.mjs unchanged. Close `_inbox/2026-08-28_p93_chrome_debt_close.json`. Unconverted: ExplorerMap MapLibre cyan, FEMA/hydro, Google/Microsoft brand hexes, InspectCard #a78bfa, Button.tsx primitive, four ss-bubble rail circles. Did not commit, deploy, or start W8 / P-90 / Stripe / P-85 / P-87 / Factory.

## OPEN 2026-08-28T22:50Z
Parent planner commits the pathspec in the chrome-debt close. 21/5 remainder is named leftover, not W8. pe-llms-txt Windows CRLF still fails locally; Linux CI is the grade.

## GROUND-TRUTH 2026-08-28T22:26Z
P-89 serving graded on hauska-mcp-server-00084-mof. traffic[].percent 100, tag p89-1ae9f28. Revision image digest sha256:58f5fb3a0c3d1e72dc4edf668f7f3f743ed1a67948010c397a9bb2999811724a. 01:17Z claim held. No redeploy. Request log lines name 00084-mof, not latestReady. Refresh live 422 pipeline_output_absent: no verdict (ad16a103), placeholder (7a1af82f), brief null (c8ff00b3), empty sections. No %PDF. No /dossier-export/refresh on those lines. download 48021:27479 streamed 606503-byte %PDF-1.7 CreationDate 20260826224001Z and GET engine /dossier-export/download 200 (6c636888). 48021:34137 missing artifact still hit GET /download then 404 (65e78f9c). Item 3 not live-MET. Did not start P-90. Close _inbox/2026-08-28_p89_serving_close.json.

## GROUND-TRUTH 2026-08-28T22:40Z
Planner reviewed P-93 chrome-debt close against the isolated tree. git status 35 files match pathspec. pe-chrome-kit-gate.mjs and src/checkout/ have no diff. Baseline JSON is 8 files / 21 hex / 5 buttons. ReportsTool imports Button + PE. Removed a duplicate height:auto in ChatTool citation-chip style (lane slop). Did not commit, PR, or deploy. Waiting Nick.

## OPEN 2026-08-28T22:32Z
Planner read of P-89 serving close: refresh MET live; item 3 not live-MET. Code read on hauska-mcp-p89 src/xray-export-gate.ts: isStoredDossierArtifactHollow(undefined) returns false, so missing artifacts fall through to engine GET /download (34137). 27479 stream may be a complete-metadata old packet (P-90 content) rather than a metadata-hollow miss; status fields were not in the logs. Do not start P-90. Do not open a second MCP PR from this seat. Chrome + Team still in flight.

## OPEN 2026-08-28T22:26Z
P-89 customer-done blocked on stored-hollow download. Do not compile P-90 from a narrated pass. W8 stays queued. Stripe other agent. Kit debt (87/60) is a P-93 follow-on, not W8.

## OPEN 2026-08-28T22:25Z
Property closer seated from integration (P:/doc_repo main 50c1607), not a property checkout. Consolidated canvas: C:/Users/cente/.cursor/projects/p-doc-repo/canvases/property-seat-board.canvas.tsx. Predecessor QA canvas superseded for leftovers.

Fan now: Card 1 P-89 serving+refuse; Card 3 chrome 87/60; Team server half (no OPS-16 row yet, WDLL _inbox/2026-08-28_p94_team_roster_WDLL.md). Do not fan P-90 (WDLL draft _inbox/2026-08-28_p90_engine_pdf_WDLL.md) or W8. Stripe / Factory / P-85 / P-87-92 / item 21 stay off.

P-89 01:17Z deploy claim (00084-mof / p89-1ae9f28 / digest 58f5fb3a) is a claim. 22:07Z QA row says not deployed. Grade serving by JSON field.

## GROUND-TRUTH 2026-08-27T22:45Z
Nick walk: My properties detail stays open (keepDock). Persona select white-on-white. No Copy link on dossier mint. Share recipient lands on Brief (share flight stole). Plans first paint Annual; 2 months free chip; seat stepper off the Team column.

## GROUND-TRUTH 2026-08-27T22:50Z
#254 merged `0fa17be`. Prod `dpl_9viNLTjjkX6aVoRkyxWZTmsC3yPW` bundle `index-CJ_n-E23.js`.

## GROUND-TRUTH 2026-08-27T23:12Z
#255 squash-merged `987e5be`. Prod `dpl_BHHFS7ENuTVichTb9oNGgwJhr8E7` aliased smartsite.cloud. Bundle `index-JEQCZEMl.js`. Live GET `/api/pe-geocode?q=905%20Pecan` (no client bias) first hit is 905 Pecan Street, Bastrop. `17000 Simsbrook` is Simsbrook Drive, Pflugerville. Situs `1620 Bryant` returns unit rows. Situs `905 Pecan ST` is still empty; parcel id `48021:34161` is the store row. Photon `Bastrop Texas` still leads with the prison house; client drops addresses on place queries.

## GROUND-TRUTH 2026-08-27T23:13Z
Nick W3 remainder: 3.2 first Flood on a fresh parcel saved the property. 3.5 chat expands and contracts in the property area. 3.6 pass does not delete. View PDF on that Flood opened the navy viewer chrome with no page (W2.5 live miss). Cause: flood download Content-Disposition attachment; iframe stays empty.

## GROUND-TRUTH 2026-08-27T23:18Z
#257 squash-merged `e2b432e`. Prod `dpl_4qwYLw1jpLgJ8Xm4Z96aFjUH7Xkg` aliased smartsite.cloud. Bundle `index-C7-zXSi2.js`. View PDF now fetches %PDF bytes and iframes a blob URL.

## GROUND-TRUTH 2026-08-27T23:46Z
Nick: W1 leftovers verified. W2.2 / W2.3 verified. Stripe leftovers banked (no live Stripe this QA). Item 21 stays parked. Reports defects: return-to-report Download only; Brief X-ray download only; Reports requires a selected parcel; fresh View is a huge gray sad-doc.

## GROUND-TRUTH 2026-08-27T23:55Z
#258 squash-merged `ebbf1b0`. Prod `dpl_CgFFrtcGcm3UD7m1HZwgvZHGa5V1` aliased smartsite.cloud. Bundle `index-DGFULALu.js`.

## OPEN 2026-08-27T23:55Z
Nick re-walks View on 927 Main exports, Brief X-ray, Reports with no parcel. SKU ruling open. W6 Stripe banked. W4 P1+ / W2.4 banked. Item 21 parked. Do not start W8 / W9.

## GROUND-TRUTH 2026-08-28T00:05Z
Nick SKU ruling: Feasibility is a report. Comparison is a report and a tool. Brief is a tool. Records stays a tool. Decision `_decisions/2026-08-27_report_sku_feasibility_comparison_brief.md`. OPS-16 A-044 adds P-89 (Hauska MCP fail-closed) and P-90 (engine PDF). P-32 stays do-not-start. Dispatch compiled `_dispatches/2026-08-28_p89-mcp_dispatch.md`. Stripe leftovers still banked. Item 21 parked. Do not start W8 / W9.

## OPEN 2026-08-28T00:05Z
Hand-carry P-89 to the substrate MCP agent. Compile P-90 only after P-89 refuse is live. Nick still owes the #258 View re-walk.

## GROUND-TRUTH 2026-08-28T05:08Z
Nick: PDF viewer never worked; wants it painted and on brand. White void on 703 Cypress Flood View. Cause: Chrome `<embed type=application/pdf>` with white ground. Native plugin is the defect class (navy empty, sad-document, white sheet). Rebuild on `fix/qa-w2-pdf-js` merged #266 `b32d988`. Prod `dpl_5GxvPb1ibxKrxWwa6aqcs2ZEUcHb` aliased smartsite.cloud. Bundle `index-GKUuHHrr.js`. pdf.js canvases + chrome v2 modal. Native embed retired.

## GROUND-TRUTH 2026-08-28T05:41Z
Nick: viewer verified good. W2.5 MET. PE in-wave leftovers for this QA are closed. Leave-behind: P-89 MCP, P-90 engine bytes, W6 Stripe, W8/W9 queued, item 21 parked.

## GROUND-TRUTH 2026-08-28T21:09Z
Nick handed Stripe (W6 leftovers + live-key swap) to another agent. This canvas no longer owns it. Do not walk or deploy Stripe from this seat.

## GROUND-TRUTH 2026-08-28T21:15Z
Operator go: compile W9, do not fan W8. OPS-16 A-047 adds P-93. Dispatch `_dispatches/2026-08-28_p93-w9_dispatch.md`.

## GROUND-TRUTH 2026-08-28T22:00Z
P-93 W9 MET. Lane tree P:/tmp/hauska-map-p93-w9 @ 036288f. PR https://github.com/empressaioemail-tech/hauska-map/pull/291. Planner added Dock to the KIT existence list before commit. Gate verified here: plant src/components/_p93_plant.tsx with #aabbcc failed; clean tree 28/28 self-test. Leave-behind: 87 hex / 60 buttons is a P-93 follow-on, not W8.

## GROUND-TRUTH 2026-08-28T22:05Z
#291 squash-merged 0e4dc5c. Prod dpl_J6Liza2UFgYYpzDXZAwSgmtrXBwN aliased smartsite.cloud. Bundle index-BLH3XqH_.js.

## GROUND-TRUTH 2026-08-28T22:07Z
P-89 close: hauska-mcp-server #77 1ae9f28 MET at the MCP boundary, 26/26 violate tests. Not deployed. Customer-done is a live refuse on the serving revision.

## OPEN 2026-08-28T22:07Z
Planner deploy of Hauska MCP, then live probe, then compile P-90. W8 stays queued. Stripe other agent. Kit debt (87/60) is a P-93 follow-on, not W8.

## GROUND-TRUTH 2026-08-27T22:54Z
Nick: all pass on #254 (Shared analysis, Copy link, persona, Plans monthly + Team column).

# Smart Site Q&A #2

Source: `P:\tmp\Smart site Q & A #2 - Google Docs.pdf` (33 pages, 2026-08-26/27).
Anchor parcel in the PDF: **1308 Pecan St, Bastrop** `48021:27479`.
Live surface: `https://smartsite.cloud` (`b1ec036` / `dpl_FtHc68SJ7xhxR4rGazWD7sJAMEdg` after left-stack).
Hoffman session (pricing/checkout) not available in this seat.

## GROUND-TRUTH 2026-08-27T19:12Z
W2 #247 merged `3fd7f5e`. Prod `dpl_HrFQHm7fUTYA7LaPPwgUhWSowkRQ` bundle `index-DZ53i0Px.js`. Browser `/s/c86a0001-…` 302 → `/share?g=` and lands 908 PINE on the map. `?format=html` stays the instrument. W2.5 viewer + W2.6 tabs live. Notes on this grant absent.

## GROUND-TRUTH 2026-08-27T19:28Z
W3 #249 merged `2655986`. Prod `dpl_7A2spvv9AxtaCeHbKtwMnT18yPd9` bundle `index-DQ3tFl87.js`. W2.1 still 302. W3 live-grade needs Nick Google.

## OPEN 2026-08-27T19:26Z
W3 #249 on `8040214`. Merge after CI. Live-grade needs Nick Google. Flood exclude stored, instrument has no flood artifact slot.

## OPEN 2026-08-27T19:12Z
W3 unblocked (W2.1 live). Signed-in leftovers still need Nick Google: Hoffman W6, W7 catalog/lock chips, W5 notes+click-B, W2.2/W2.3, W0.2 two-column Compare, W0.7 note colors. P1 still blocked on engine chips.

## OPEN 2026-08-27T16:30Z
Operator greened the full in-wave program. Canvas `smartsite-design-system-gap.canvas.tsx`. WDLL `_inbox/2026-08-27_smartsite_qa_program_WDLL.md`. Parked items stay on the canvas only. First fan: W0 chrome + W4.P0.

## LESSON 2026-08-27T16:15Z
#234 stacked right-rail docks on the left. Val: right rail stays single-tenant on the right; only left map bubbles stack, each in its own container. Brief docks right.

## Inventory

### Before login
1. Side black box too tall; cannot scroll to Save.
2. Typed address does not fly/scroll the map to it.
3. `1308 Pecan` suggest skips Bastrop; had to type `street` to get a street hit.
4. Flood study map shows flow lines + front-lot ponding; generated report does not.
5. Re-run moves the overlay; ponding still missing; run 3 = run 2.
6. X-ray titles the parcel id, not the address; no ponding.
7. Zoning brief opens a site, not a map.
8. Inspect card vs property brief: one has setbacks, the other says setback not available.
9. Strip sources + confidence from the customer end of reports.
10. Fresh Find zooms; picking a prior search from the dropdown does not zoom/highlight.
11. Logged in, Studio reports are locked.

### Chrome notes (unnumbered)
Android share off. Explain buttons. Move legend fields. Make the maps one. Explain the tools.

### Hoffman / not paid (pricing)
P1. Team 12 seats: copy said $25 after 10; checkout $45, not +$50.
P2. "2 months free" has no visible application.
P3. No back-to-cart / change-seats on checkout.
P4. Delete ICC I-Code ingest-hold line from the surface.
P6. One-parcel unlock payment error.
P7. Add-card black box cannot scroll to the bottom.
P9. Cash App QR does not show.
P10. Other wallets hit the same error.

### PDF evidence already in the packet
- Site plan 2026-08-27 01:06Z carries `1308 PECAN ST` correctly.
- X-ray 2026-08-26 22:40Z prints `PARCEL 48021:27479 NO ADDRESS` (item 6).
- Earlier X-ray 22:01Z: verdict UNAVAILABLE, brief facts UNAVAILABLE.
- Flood PDF sheets *do* print ponding 2,089 sf. Operator complaint is the *drawing* missing flow/ponding that the on-map study showed.

## GROUND-TRUTH 2026-08-27T18:42Z
W5 #245 merged `ce7e979`. Prod `dpl_3rhtry2GhnTYCj1B87m7FAxbczVD` bundle `index-EVyeDBjF.js`. `48021:27479` lands 1308 PECAN ST. Compare signed-out is `compare-sign-in`. Signed-in Hoffman leftover.

## OPEN 2026-08-27T17:06Z
Nick must rule Records/Brief as Tools vs two-report register before 01/04/05 refresh. Stripe unlock unverified. Valuation not implemented. Screenshot review not invented.
