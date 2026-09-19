---
title: QA capture log — operator screenshots and notes
date: 2026-09-15
status: open
type: capture
owner: planner
---

# QA capture log

Raw operator QA entries. Capture only: each entry is logged verbatim as observed, with no
triage, no root-cause guess, and no fix proposed at capture time. Triage into a program or a
coherent defect list happens at close, on operator call.

Snapshot at open: doc_repo, branch main, commit 5bc169ad.

Entry format: sequential QA-nn, timestamp, surface if named, operator note verbatim, and a
factual description of any screenshot. Nothing inferred.

---

## QA-01 — Flood and drainage study times out

Logged 2026-09-15. Surface: smartsite.cloud (Smart Site / PE prod). Parcel: 2407 PRINCETON DR,
badged "verified 15 September 2026". Footer badge reads SMART SITE / Travis County.

Operator note, verbatim:

> the flood and drainage study keeps timing out.

Screenshot, as observed:

Reports & Exports panel open on the right, "My reports" tab active, report selector set to
"Flood and Drainage". Card reads "Flood and Drainage / Where water goes on this lot, as a
2-sheet PDF." Format PDF. Includes: "Drawn on the map while this study is open". Rainfall depth
field empty with placeholder "default (100-" and unit "in"; "Run at this depth" button present;
helper text "Leave blank to use the location's NOAA Atlas 14 100-year 24-hour design storm."
"Generate flood & drainage study" button present.

Error text shown under the generate button, verbatim:

> Drainage study timed out — the model run (DEM fetch + hydrology) can take up to a minute on a
> cold start. Try again in a moment.

A "Change" button sits below the error. Below that: "The inspect card and map layers stay free."

Recent artifact list visible beneath, all dated 2026-09-15: Feasibility Study / 1109 PECAN ST,
BASTROP, TX 78602 (View, Download); Site plan / 1109 PECAN ST, BASTROP, TX 78602 (View,
Download); X-ray / 1109 PECAN ST, BASTROP, TX 78602 (View, Download); Site plan / STURGEON DR,
SAN MARCOS, TX 78666 (Download only, no View); Flood & drainage / 629 STURGEON (partially cut
off at the panel edge, View / Download).

Map state: aerial basemap, parcel boundary drawn, buildable envelope polygon rendered over the
structure, FEMA flood zone linework crossing the north of the frame. Flood legend open top-left
showing 1% annual chance base flood elevation set (AE, AH) IN; 1% annual chance sheet flow (AO)
IN; 1% annual chance no elevation set (A, A99, AR) IN; 0.2% annual chance 500-year (X shaded)
OUT; Open water (OPEN WATER) em-dash; Hazard undetermined / not analysed (D, area not included)
em-dash; Minimal hazard outside the mapped floodplain (X unshaded) OUT. Note: "A parcel can sit
in more than one zone at once."

LAYERS panel open, tabs Flood / Entitlement / Terrain. Checked: Satellite / aerial, Buildable
envelope, Contours (1 ft / 3DEP), FEMA flood zone, GIS Parcel Boundary, Hydrography, My
properties, Opportunity Zone tract, Regulatory floodway, Sidewalks / footpaths. Unchecked:
Building footprint, MUD/PID districts, Road nodes (ROW), Zoning / land use.

No triage recorded at capture.

---

## QA-02 — X-ray report is behind; should be derived from the feasibility study

Logged 2026-09-15. Surface: Smart Site reports (X-ray, Feasibility Study). No screenshot.

Operator note, verbatim:

> the xray report needs to be caught up I had stopped working on it because I wanted to get the
> feasibility study to where it needs to be. And now the feasibility study is pretty good. And so
> the x-ray is, is just a simplified feasibility study with less sheets. Maybe like three or four
> sheets. And just more of a snapshot. Feasibility study is a deep dive. So x-ray should be
> derived from feasibility study.

Stated shape, as given: X-ray is a simplified feasibility study, roughly three or four sheets,
snapshot rather than deep dive; feasibility study is the deep dive; derivation runs X-ray FROM
feasibility, not as a parallel build.

No triage recorded at capture.

---

## QA-03 — Flood and drainage runs inside feasibility but not standalone

Logged 2026-09-15. Surface: smartsite.cloud (Smart Site / PE prod). Parcel: 2407 PRINCETON DR,
badged "verified 15 September 2026". Related to QA-01.

Operator note, verbatim:

> flood and drainage study are also a part of the feasibility study. And flood and drainage will
> run with feasibility but will not run as a standalone flood study.

Screenshot, as observed:

Reports & Exports panel, report selector set to "Feasibility Study". Card reads "Feasibility
Study / Zoning envelope, flood, terrain, utilities, wells, and every open item: one composed
PDF, site plan appended." Format PDF. Generated 2026-09-15. Header line "REPORT   Download ·
2026-09-15". Buttons: View PDF, Download PDF. Status text "Feasibility Study PDF ready (13
pages)." Below: "Re-run" and "Change".

DOWNLOAD PDF modal open over the map, link at top "Open live view of this property". Page 1 of
13 rendered at 100%, Prev / Next / zoom controls and a Download PDF button at the modal footer.

Sheet content as rendered: title "2407 PRINCETON DR", right-hand fields "20,187 SF" and "NONE
MODELED". Subtitle "Parcel 48453:289990 · Travis County (48453)". Aerial site figure with
property line drawn as a solid rectangle over the structure, a dashed traced flow line running
down and right of the parcel, and a vertical line at the right of the frame.

Sheet legend, as rendered: "Property line  /parcelNode/id=48453%3A289990"; "Water gradient —
modeled flow and ponding at 9.5" storm"; "Traced flow line"; "Flow exit". Scale bar 0 / 38 /
77 ft with "1" = 52 ' FD-48453-289990 | generated 2026-09-15 16:11Z". A further legend row is
cut off below the visible area.

So: this feasibility PDF page 1 is the flood/drainage figure, generated and rendering, on the
same parcel where the standalone Flood and Drainage generate path timed out in QA-01.

Recent artifact list now shows Feasibility Study · 2407 PRINCETON DR · 2026-09-15 (View,
Download) at the top, above the 1109 PECAN ST entries from QA-01.

Map/layers state unchanged from QA-01 except Sidewalks / footpaths now appears checked and
Zoning / land use unchecked; Building footprint, MUD/PID districts, Road nodes (ROW) remain
unchecked.

No triage recorded at capture.

---

> **Batch marker, 2026-09-15.** QA-01 through QA-03 packaged as reports scope in
> `_inbox/2026-09-15_reports_scope_handoff.md` for the master planner. Design work excluded per
> operator. Capture continues below from QA-04; this marker records where the batch went and
> closes nothing.

---

## QA-04 — ETJ should render as a toggleable map layer

Logged 2026-09-15. Surface: smartsite.cloud map / LAYERS panel. No screenshot.

Operator note, verbatim:

> ETJ should render on our map. We should have a setting in the layers panel that I can click
> ETJ on and off and see all the ETJs in the area.

Stated ask, as given: an ETJ (extraterritorial jurisdiction) layer in the LAYERS panel, toggled
on and off like the existing entries, rendering all ETJs in the visible area rather than only the
subject parcel's.

Context from QA-01 and QA-03 captures, recorded because it bears on where the toggle would sit:
the LAYERS panel has tabs Flood / Entitlement / Terrain. Entries observed in those captures were
Satellite / aerial, Buildable envelope, Building footprint, Contours (1 ft / 3DEP), FEMA flood
zone, GIS Parcel Boundary, Hydrography, MUD/PID districts, My properties, Opportunity Zone tract,
Regulatory floodway, Road nodes (ROW), Sidewalks / footpaths, Zoning / land use. No ETJ entry was
present in either screenshot. Whether the panel scrolls below "Zoning / land use" was not
established; both captures cut off at that row.

No triage recorded at capture. Whether ETJ geometry exists in the store is not established here.

---

## QA-05 — Mark record request as coming soon

Logged 2026-09-15. Surface: not named by the operator. No screenshot.

Operator note, verbatim:

> mark record request to coming soon

Read as an instruction to label the record request capability "coming soon" rather than presenting
it as live. Not specified at capture and not inferred here: which surface or surfaces carry the
label (web app, MCP connector, or both), whether the affected thing is the Records tool, the
`request_records` action, the purchased-records read path, or all of them, and whether "coming
soon" means disabled, visibly labelled, or both.

No triage recorded at capture.

---

## QA-06 — Tool containers should expand wider and shorter, seated under the search bar

Logged 2026-09-15. Surface: smartsite.cloud, tool/report container geometry. Screenshot carries a
hand-drawn annotation.

Operator note, verbatim:

> I want to change who the tool containers expandi think it should be more full screen and reduce
> in height so it fits under the search bar. It should go roughly where the red box I drew is

Read as: change how tool containers expand. Wider, closer to full width. Shorter in height. Top
edge seated below the search bar rather than beside or behind it. The red box is the target
footprint.

Annotation, as observed: a hand-drawn red rectangle covering nearly the whole viewport below the
browser chrome. Its top edge runs just under the search bar row, its left edge sits near the left
edge of the map canvas inboard of the left rail icons, its right edge runs near the right edge of
the map canvas inboard of the right rail icons, and its bottom edge sits just above the SMART SITE
/ Bastrop County footer badge. The box is drawn over both the map and the existing panel, so it
describes a footprint, not a crop of the current panel.

Current geometry, as observed for contrast: the REPORTS panel is docked to the right, occupying
roughly the right two thirds of the width and running nearly the full height from the top chrome
down to the footer. The search bar sits inside the panel header rather than above it, and the
panel overlaps the vertical position the search bar occupies. The map is visible only in the left
third.

Screenshot state, as observed:

Parcel 1306 FAYETTE ST, BASTROP, TX 78602, badged "verified 8 September 2026". Footer badge reads
SMART SITE / Bastrop County. Panel titled REPORTS with tabs My reports and Shared with me, My
reports active. Selector set to Feasibility Study. Card reads "Feasibility Study / Zoning
envelope, flood, terrain, utilities, wells, and every open item: one composed PDF, site plan
appended." Format PDF. Generated 2026-09-08. Header line "REPORT   Download · 2026-09-08". Buttons
View PDF, Download PDF. Status text "Feasibility Study PDF ready (7 pages)." Then Re-run, then
Change. Below: "The inspect card and map layers stay free."

Recent artifact list, as observed, all Bastrop TX 78602: Feasibility Study 1306 FAYETTE ST
2026-09-08; X-ray 1505 WATER ST 2026-09-08; Feasibility Study 1505 WATER ST 2026-09-08;
Feasibility Study 1404 CHURCH ST 2026-09-08; Site plan 1101 CHESTNUT ST 2026-09-08; X-ray 1101
CHESTNUT ST 2026-09-08; Flood & drainage 1101 CHESTNUT ST 2026-09-08; Feasibility Study 1101
CHESTNUT ST 2026-09-08; X-ray 1007 WATER ST UNIT 2026-09-07. Each carries View and Download. The
first four rows carry an amber dot at the left margin; the later rows do not.

Note recorded because it bears on QA-02 and not triaged here: an X-ray artifact for 1505 WATER ST
and for 1101 CHESTNUT ST appears in this list dated 2026-09-08, and a Flood & drainage artifact
for 1101 CHESTNUT ST appears dated 2026-09-08. This capture does not establish whether those
generated then or are stale rows.

Also observed and not part of the ask: this feasibility PDF is 7 pages, where the 2407 PRINCETON
DR feasibility in QA-03 was 13 pages.

No triage recorded at capture.

---

## QA-07 — Move the settings button to the bottom of the toolbar

Logged 2026-09-15. Surface: smartsite.cloud left vertical toolbar. Screenshot carries a hand-drawn
annotation.

Operator note, verbatim:

> Move the setting button to the bottom of the tool bar

Annotation, as observed: a red curved arrow drawn on the left side of the toolbar, starting at the
gear icon and sweeping down past the two icons below it, ending at the bottom of the rail. The
arrow describes the move, not a new control.

Toolbar, as observed top to bottom: a stack of horizontal lines (menu or list icon), then a circled
"i" (info), then a gear (settings), then a tag or label icon, then a stacked-layers icon at the
bottom. Dark rounded pill rail over the aerial map.

Target order implied by the arrow: the gear moves from third position to last, below the layers
icon, leaving the order as menu, info, tag, layers, gear.

Not established at capture: whether the tag and layers icons hold their current relative order once
the gear leaves, and whether the bottom of the rail means below the layers icon inside the same
pill or a separated group.

No triage recorded at capture.

---

## QA-08 — Building footprint does not render on the PDFs and should

Logged 2026-09-15. Surface: smartsite.cloud, Site plan export PDF. Parcel 908 PINE, BASTROP, TX
78602, badged "verified 15 September 2026". Footer badge SMART SITE / Bastrop County.

Operator note, verbatim:

> building footprint doewn not show up on the pdfs and it shoud

Screenshot, as observed:

Reports & Exports panel on the right, selector set to "Site plan". Card reads "EXPORT   Download ·
2026-09-04", title "Site plan", description "The drawn sheet and the layers a drafter can open."
Format "PDF, DXF, IFC". Generated 2026-09-04. A Format dropdown is set to "PDF site-plan sheet".
Buttons View PDF, Download PDF (381 KB). Status "Site plan ready, download above."

Provenance block under the buttons, verbatim as rendered:

> Source: USGS 3DEP · 2026-09-04
> Confidence 0.72 (asserted) · Mesh Z: USGS 3DEP DEM field (NAVD88 orthometric metres (USGS 3DEP;
> not ellipsoidal height)); contours: bastrop-county:Contour1Ft2017 (2017 StratMap LiDAR, 1-ft
> vertical interval); mesh Z band [110.845, 111.554] m; calibration pending
> Derived from public GIS records. Not a boundary survey. Not for legal record.

Then Re-run, then Change. Then "The inspect card and map layers stay free." Then a recent artifact
row: Site plan · 908 PINE , BASTROP, TX 78602 · 2026-09-15 (View, Download).

DOWNLOAD PDF modal open, page 1 of 3 at 100%. A line at the top of the modal reads "Live view
unavailable" where other captures showed an "Open live view of this property" link.

Sheet as rendered: SMART SITE mark top left, "SITE PLAN" top right. Title "908 PINE". Subtitle
"BASTROP, TX 78602 · PARCEL 48021:34137 · Bastrop". Right of the title, "DOCUMENT SP-48021-34137".
Header fields: LOT 16,673 SF; BUILDABLE NONE; ZONING SF-1. North arrow present.

Drawing as rendered: a solid rectangular property line with bearing and distance tags (99.0' N
89 52' E along the top, 99.5' S 89 26' W along the bottom, 168.1' N 7 21" W on the left, 167.3' S
17 46" E on the right). A dashed inner rectangle labelled FRONT SETBACK 30', SIDE 5 (left), SIDE
CORNER 20' (right), REAR 30'. An inner area labelled "16,673 sq ft". Contour lines crossing the
sheet. Street labels JEFFERSON STREET (right, vertical) and PINE STREET (bottom, dashed). Scale
bar 0 / 33 / 66 ft with "1" = 44 · SP-48021-34137 · generated 2026-09-15 22:52Z".

Legend as rendered, partially cut off at the bottom of the visible area: "Property line",
"Contour, 1 m interval", and a third row beginning "Buildable envelope" paired with a row
beginning "Proposed something 3D GIS" (illegible at this resolution).

**No building outline is drawn inside the property line.** The parcel interior carries the setback
rectangle and contours only.

LAYERS panel, as observed: tabs Flood / Entitlement / Terrain. Checked: Satellite / aerial,
Buildable envelope, **Building footprint**, Contours (1 ft / 3DEP), FEMA flood zone, GIS Parcel
Boundary, Hydrography, My properties, Opportunity Zone tract, Regulatory floodway, Sidewalks /
footpaths. Unchecked: MUD/PID districts, Road nodes (ROW), Zoning / land use. Building footprint is
checked here, unlike the QA-01 and QA-03 captures where it was unchecked.

DRAW & MEASURE panel also open, MEASUREMENTS & NOTES (4): "271 sqft / 1 Shape · perimeter 67 ft ·
4 pts"; "264 sqft / 2 Shape · perimeter 68 ft · 4 pts"; "1 add front patio"; "2 Proposed ADU
location".

Recorded and not triaged: the sheet prints "BUILDABLE NONE" in its header while the legend names a
buildable envelope and the layer is checked in the panel. Whether that is related to the missing
footprint is not established here. Also recorded: the card says Generated 2026-09-04 while the
sheet stamp says generated 2026-09-15 22:52Z and the artifact row says 2026-09-15.

No triage recorded at capture.

---

## QA-09 — Landing page and "See a real parcel report" screens need work

Logged 2026-09-16. Surfaces named by operator: the landing page, and the parcel report screen
reached from it.

Operator note, verbatim:

> this landing page and see a parcel report screens need work.

Screenshots, as observed.

**Landing page.** Centred dark card over a dimmed map background. SMART SITE mark top left.
Eyebrow line "Parcel intelligence for Central Texas". Headline "What can you actually build on
it?". Subhead "Zoning, setbacks, buildable envelope and flood for any parcel in the Austin metro,
cited to the ordinance section it came from."

Three feature tiles in a row, each with a small line drawing: "X-ray / What you can build, and
where the envelope is"; "Flood & Drainage / What the water does, with the FEMA panel it came
from"; "Terrain / How the ground falls across the lot".

Below the tiles, a wide bordered row with an orange spark icon: "Or ask from inside Claude." with
"Connect Smart Site to Claude and ask about a parcel in plain language. Every tier, including
free."

Then the line "When the record does not say, we say so. We do not invent a setback."

Then a full-width orange primary button "See a real parcel report". Under it an example row: "No
address in mind? An Austin infill lot | A Bastrop tract | A Hays corridor lot" (the three examples
rendered as links).

Then a full-width white "Sign in with Google" button with the Google mark. Then an "or" divider.
Then an email field with placeholder "you@example.com", with "Continue with email" at the left and
"No password, ever. We'll email you a link." at the right. At the bottom, centred, "Browse the map
yourself".

**Parcel report screen.** Left side: map of the Zilker area (Austin street grid; Zilker label and
street labels such as Anita Drive, Bluebonnet Lane, South Lamar Boulevard, Rae Dell Avenue,
Kinney Avenue visible), rendered faded and desaturated, with a zoom control (+ / - and a collapse
chevron) top left.

Right side, report panel: SMART SITE mark; heading "Address not on record for this parcel";
"APN 939221"; subline "Example parcel. No account needed." Tabs across: X-ray (active, underlined
orange), Flood & Drainage, Terrain.

Rows as rendered, each label at the left and value at the right, with a linked citation on most
rows:

- Zoning district — `SF-3` with link `austin-tx_zoning_layer`
- Front setback — `25 ft` with link `setback_table,_district_SF-3`
- Side setback — `5 ft` with the same link
- Rear setback — `10 ft` with the same link
- Corner side setback — `15 ft` with the same link
- Buildable envelope — a pill reading "reported absent"

Then the same line as on the landing page: "When the record does not say, we say so. We do not
invent a setback."

At the bottom of the panel, a full-width orange button "Look up your own parcel" and, under it, a
full-width outlined button "Sign in to save and share this".

Recorded and not triaged: the operator named these two screens without naming which elements are
wrong. No specific element, layout, copy, or behaviour was identified at capture. The map behind
the report panel is rendered dimmed to the point that the parcel being reported is not visually
identifiable in the capture.

No triage recorded at capture.

---

## QA-10 — Something broke with Stripe (checkout cannot mount)

Logged 2026-09-16. Surface: smartsite.cloud checkout, Smart Site Studio plan.

Operator note, verbatim:

> Something broke with stripe

Screenshot, as observed:

Checkout screen, dark theme. Header left reads SMART SITE with a "< Back to cart" link. Left
column: eyebrow "SUBSCRIBE", heading "Smart Site Studio", price "$1 , 290 /year" with a smaller
line "$129/mo" beneath it (the price renders split as "$1 , 290"). An "INCLUDED" list with green
check marks: "Flood and drainage study"; "X-ray"; "Unlimited questions, unlimited properties";
"Work a list of parcels on one board"; "Owner of record and mailing address"; "Records package,
the county documents behind the answer"; "Site plan file your designer can open (DXF, IFC)";
"Terrain model of the site (GLB, IFC4, DXF)". Footer row: "Cancel any time", "Payments by Stripe",
"Terms", "Privacy".

Right column: an empty bordered box (a large blank rectangle, no rendered payment content inside).
Below it a promo-code field, populated with the text "SMARTSITEQA", and an "Apply" button.

Error text under the promo field, verbatim:

> Stripe Checkout cannot confirm without a mounted session

Then a "Total due today" row reading "$1 , 290" (again split). Then helper copy: "Cash App Pay and
wallets open as a QR in this box. If they do not appear, they are not available for this charge.
Use a card." Then a disabled-looking "Subscribe $1 , 290" button.

Recorded and not triaged: the payment box is empty while the page's own helper text says Cash App
Pay and wallets "open as a QR in this box", so the box has no payment session mounted in it. The
screenshot is taken over a dimmed map background, consistent with the other Smart Site captures in
this log. Whether the promo code was already applied is not visible. No Stripe error code, request
ID, or console output was captured.

No triage recorded at capture.

---

## QA-11 — Tools and setbacks: setbacks appear and disappear while using tools

Logged 2026-09-16. Surface: smartsite.cloud map, search for 807 MAIN ST, BASTROP TX 78602.

Operator note, verbatim:

> tools and setbacks (when the setbacks appear and dissappear when using tools )needs work

Screenshot, as observed:

Aerial basemap, zoomed in on a streetscape. A pill-shaped search field top right reads
"807 MAIN ST, BASTROP TX 78602" with a "Find" button to its right. Street label "Main Street"
rendered vertically on the map. A parcel boundary is drawn over the frame with a blue dotted line
running through it.

Top left, the tool rail as a dark rounded vertical pill: a menu (hamburger) icon, then a circled
"i" (info), then a gear (settings), then a stack-of-layers icon at the bottom, with a small
chevron. To the right of the rail, the DRAW & MEASURE panel is open, titled "DRAW & MEASURE" with a
collapse chevron and a close "x". The panel holds two rows of icon buttons: first row four buttons
(one appears active/highlighted), second row three buttons including what reads as a location pin.
Below them, a row of three small controls (check, undo, clear/trash).

On the map, a portion of the parcel is enclosed by a dashed orange outline, with a translucent
overlay tinting the area inside it, spanning from the parcel interior across toward the neighbouring
parcel to the right.

Bottom left, the SMART SITE badge with "Bastrop County".

Recorded and not triaged: the operator's note points at two coupled behaviours, the tools
themselves and setbacks appearing and disappearing while a tool is in use. No specific tool, step
sequence, or setback element was identified at capture, and the screenshot does not itself show a
setback line, so the disappear/appear behaviour is not captured in this frame. The active tool in
the first button row is highlighted but its identity (polygon, line, or other) is not legible at
this resolution.

No triage recorded at capture.

---

