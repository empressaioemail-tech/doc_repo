---
id: 2026-08-27_nick_val_qa_attack_plan
title: Nick + Val Smart Site QA attack plan
status: draft
last_updated: 2026-08-27
---

# Nick + Val Smart Site QA attack plan

Sources: Otter `P:\tmp\Nick and Val Smart site_otter_ai_transcript.txt`; Q&A #2 PDF `P:\tmp\Smart site Q & A #2 - Google Docs.pdf`; live `smartsite.cloud` after #234.

This is a plan. No build until the operator greens a wave.

## The law we broke

#233/#234 conflated two chrome systems.

**Right rail** (brief, chat, reports, properties, share, use-in-AI, compare) already worked. One bubble open, one dock, on the **right**. Compare expand lived there. Opening brief must not stack chat. This must be restored.

**Left chrome** (notifications, legend, draw, layers) is the only set that should stack. Each is its own container. Draw and layers must not share one panel. If only layers is open, the list uses the height and does not scroll. If more left panels open, they share height and may collapse. Brief docks on the **right**, never over the left bubbles.

Val, verbatim: "You conflated two things." "The bubbles on the right should function how they were." "What I want to stack was all the things on the left." "Property brief should be docking on the right-hand side."

Chris gets a later visual pass. Claude Design is for flyout / example-question polish, not this remediation.

## What is in vs parked

In this program: chrome restore, Find, share regression, my-properties notes/share, reports honesty, compare restore, Hoffman checkout (operator session).

Parked until a named later card: Gmail hookup, Smart Files upload, Ida affiliate, nationwide state/county fly-to if it is a new ingest path, a-la-carte water-report SKU (ruled no), ETJ / RRC / full CAD audit (planner session, not this UI wave), abandoned-easement chat-probe (P-85 follow-on).

## Wave 0. Undo the chrome conflation

One card. One worktree. Acceptance is a live screenshot, not a merged PR.

1. Right rail is single-tenant again. Open chat closes brief. Docks sit on the right. Compare expand works.
2. Brief bubble stays. Brief dock is on the right. Inspect facts live inside brief, but the card is not a left overlay.
3. Brief is no longer a mashup dump. High-level first (address, zone, flood, lot). Special district, who serves, zoning detail, and the rest are collapsed until clicked.
4. Left bubbles only: notifications, original legend, draw, layers. 34px. Separate containers. All four can be open without covering each other or the right dock.
5. Map-pin notes: distinct colors up to 10, hover shows the text.

This wave exists to put the map back in a state a human can use. Do not mix Find or Reports into it.

## Wave 1. Find

The product is unusable if search is wrong. Live probe already failed: `1308 Pecan` returns Guadalupe `48187:29690`, not Bastrop `48021:27479`. `1308 Pecan st`, `1308 Pecan Bastrop`, and `48021:27479` return zero hits.

Must do:

1. Disambiguate. Typing `905 Pecan` or `17000 Simsbrook` offers Street / Drive and city options. Never assume one hit.
2. One click from the dropdown lands, highlights gold, zooms to the parcel, makes it subject, opens brief on the right.
3. History pick behaves the same as a fresh Find. Show the address, not the APN.
4. Place lookup: `Bastrop Texas` without a comma flies to the place. Dropdown labels city vs county.
5. Sub-second suggest. 10 to 15 seconds is a fail.
6. Lock the parcel, not the subdivision. Geocode-miss must not hover a neighborhood and then 404.

Give ingest-shaped misses (Pflugerville / Round Rock geocode) an honest "data" tag. Do not spend Wave 1 building statewide city/county/state fly-to if that is a new ingest path. Note it.

## Wave 2. Share regression

Share used to land the recipient on the property. It now does not. Restore that first.

Then, only after land-on-property is live:

1. Recipient is a free user who can read the shared reports and cannot generate new ones until upgrade.
2. Anonymous work survives sign-in / upgrade.
3. PDF reports carry a live-view link at the top.
4. In-app PDF viewer (especially mobile) is the preferred next step over a raw download.
5. Reports bubble gets a **Shared with me** tab. Not a new surface.

Custom share packages (architect vs builder vs investor pickers, persona default messages) are Wave 3 if Wave 2 is green. Do not design the package picker while land-on-property is still dead.

## Wave 3. My properties

Status researching / offer / pass **stays**. Pass does not auto-delete.

1. Notes persist (already observed). Export / share can include or exclude notes.
2. Running any report auto-saves the property and files that report on the property and in the reports bubble.
3. Share control on the property (persona dropdown: title, agent, builder, architect, other) with a default message you can overwrite. Future, not Gmail-send.
4. Drop X-ray as the only export from the property row. Offer add/exclude reports.
5. Saved-chat list: dated, collapsed, one open at a time. Strip markdown asterisks, em dashes, "next steps" dump.
6. Stars stay. Gray = pass, gold = researching. No extra highlight program.

## Wave 4. Reports honesty

Q&A #2 plus the transcript.

1. Flood PDF drawing must carry the flow lines and ponding the on-map study showed. Re-run must not wander or drop ponding.
2. X-ray titles the address, not `PARCEL … NO ADDRESS`.
3. Customer reports drop the source/confidence table (item 9). Provenance stays in a disclosure, not the face.
4. Studio reports must be reachable for a Studio account. Hoffman lock is a grade, not a guess.
5. Records request "unreachable" is an auth/reachability defect. Appraisal-district probe is a **separate** verb from courthouse records. Do not merge them.
6. Zoning brief must not dump the user on an unexpected site.

## Wave 5. Compare

Restore expand-wider (regression from Wave 0 if Wave 0 is done first). Show existing notes on A and B. Allow adding a note while comparing. Clicking B opens that property in My properties and collapses compare; returning to compare keeps the pair.

Do not add status-change inside compare in this wave.

## Wave 6. Hoffman checkout

Needs Hoffman's session or an operator replay. Do not guess Stripe.

Team 12-seat math, "2 months free" copy, back-to-cart, delete the ICC I-Code hold line, one-parcel unlock error, add-card scroll, Cash App / wallet QR.

## Recommended first build

Wave 0 only. Until the right rail is a right rail again, every other note is graded on a broken surface.

Leave-behind if Wave 0 ships: Find still wrong; share still lands wrong; Hoffman checkout ungraded.
