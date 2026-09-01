---
id: 2026-08-24_reports_dock_ux_handoff_claude_design
title: Reports dock UX/UI — design-exploration handoff for Claude Design
date: 2026-08-24
status: operator-facing handoff (design only; no product code)
owner: Nick (operator) + Claude Design
audience: Claude Design
---

# Reports dock — design exploration handoff

Filed: 2026-08-24
From: planner (doc_repo / Smart Site)
To: Claude Design
Re: Visual options for the Smart Site Reports & exports dock, showing the finished catalog (live items real, unbuilt items Coming soon)

You are doing UX/UI only. Do not invent report content, data models, pricing logic, or PDF page design. The PDF sheet styling is locked and is not this brief. Produce clickable or static mockups of the in-app dock (and any overlay it opens) so Nick can feel the finished product and pick a direction.

Work against a dark map chrome (satellite aerial behind a dimmed or un-dimmed map). Match the existing Smart Site language: dark translucent panels, Inter-like system UI, blue `#3B82F6` as the only loud accent, quiet surfaces, honest absence, no emoji, no marketing gradients.

---

## 1. What is broken today

The Reports & exports panel is a vertical stack of three generate factories in a narrow right-hand workbench dock (~280–320px):

1. Site plan export — format dropdown + Export site plan
2. Flood & drainage report — Generate flood & drainage study
3. Terrain export — format dropdown + Export terrain

Each row is a form. There is no library of things already generated. There is no composed package. The most complete document we already ship (the property dossier) lives on a different surface. Research / Brief lives on a third surface ("Research this" on the inspect card).

Nick's reaction: this does not feel like a reporting product, and it will get worse when the Feasibility Study arrives if we just add a fourth Generate button.

Pricing does not belong in this dock. A separate pricing popup already exists (or is shipping). Locked tools show a one-line value statement plus "View pricing & unlock." Do not redesign checkout here.

---

## 2. What "finished" means (the catalog)

Show the FULL catalog in every option so Nick can see the end state. Mark items that are not live today as **Coming soon** (muted, not clickable, no fake download). Do not hide them. The point of the exercise is to feel a populated product, not a three-button MVP.

### A. Composed packages (hand to a client)

These are documents. One generate, one PDF, many sections inside.

| ID | Name | Status in mock | One-line promise | Notes for chrome only |
| --- | --- | --- | --- | --- |
| FEAS | Feasibility Study | Coming soon (hero of the future catalog) | The cited package you hand to a buyer, lender, or architect | Studio. Completeness strip (see §3). This is the inbound report. |
| DOSS | Property dossier | Live today, but NOT in this dock yet | Cover, verdict, facts, notes, appended site-plan sheets | May be folded into FEAS later. Show it so Nick can decide keep / merge / retire. |
| COMP | Comparison report | Coming soon | Two or more parcels side by side | Later. Include as a ghost card so the catalog has a place to grow. |

Feasibility Study interior (do not design the PDF; you MAY show a section checklist in the dock card so completeness is visible):

1. Cover + contents
2. Executive verdict + bottom line
3. Location and jurisdiction (city / ETJ / unresolved)
4. Parcel and ownership (owner data is Studio)
5. Zoning, setbacks, buildable envelope
6. Flood and drainage
7. Special districts / MUD
8. Wells and pipelines
9. Terrain and site conditions
10. Utilities who-serves (plus "service letter required")
11. HOA and recorded restrictions (v1: "not searched")
12. Existing structures / footprint
13. Data quality and superseded runs
14. Open items / what's missing
15. Appended site-plan + flood sheets

In the mock, invent a plausible completeness state for a Bastrop parcel, e.g. "11 of 16 sections have a finding · 5 honest absences" with chips like `ETJ unresolved`, `HOA not searched`, `Service letter required`. That completeness language is the product, not decoration.

### B. Studies and briefs (run on this parcel)

| ID | Name | Status in mock | One-line promise |
| --- | --- | --- | --- |
| FLOOD | Flood & drainage study | Live | 2-sheet PDF; also draws on the map while open |
| BRIEF | Property brief | Live, currently on "Research this" | Cited research writeup (not a deliverable packet) |
| XRAY | X-ray | Live as a site-plan run / failed-run class | Include only as a library row if a run exists; failed runs must read as superseded, never as a second independent finding |

### C. Technical exports (files for tools, not for clients)

| ID | Name | Formats | Status in mock | Gate (label only) |
| --- | --- | --- | --- | --- |
| SP-PDF | Site plan sheet | PDF | Live | Unlock or subscription |
| SP-DXF | Site plan CAD | DXF layered | Live | Studio (CAD) |
| SP-IFC | Site plan model | IFC layered | Live | Studio (CAD) |
| TER-GLB | Terrain mesh | GLB | Live | Studio |
| TER-IFC | Terrain | IFC4 | Live | Studio |
| TER-DXF | Terrain surface / contours | DXF | Live | Studio |

### D. Out of this catalog (do not invent tiles for these)

- HOA packet / recorded-document pull (separate future program; inside FEAS it is an honest "not searched")
- MLS or sales comps (out of scope, not public record)
- County-portal screenshot pages (superseded; our facts carry citations)
- Pricing / checkout
- Map layer toggles

---

## 3. Product laws the mocks must obey

1. **One dock, no second product surface.** Reports stays a workbench bubble on the right rail. You may use an in-dock disclosure, tabs, or a sheet that expands from the dock. Do not invent a new top-level app or a full-page reports studio unless you explicitly label that as a rejected-and-shown alternative.
2. **Honest absence is a feature.** Coming soon and "not searched" are quiet, labeled, never fake-complete. No progress bars that imply work that is not happening.
3. **Library beats form.** If something has already been generated, the first action is Download (with date). Generate / refresh is secondary.
4. **Report vs export.** A composed PDF you hand to a person is not the same object as a DXF. The UI must make that split readable in under two seconds.
5. **Pricing stays out.** No $15 / $49 / $129 cards in this panel. A small lock or "Studio" chip is fine. Checkout is a different popup.
6. **Flood-on-map stays.** Opening or focusing the flood study may still paint the map. Preserve that in the interaction notes even if the visual is static.
7. **Inspect card stays left.** Do not move APN / zoning / setbacks into Reports. Reports is deliverables, not the fact sheet.
8. **No new brand.** Smart Site, not Hauska, not Empressa chrome.

Reference parcel for all frames: **801 PINE ST, BASTROP, TX 78602** (or 906 FARM ST if you already have that frame). Dark satellite, parcel outline on the lot, inspect card visible on the left so the mock reads as the real app.

---

## 4. Options to draw (do all three)

Draw each option as a finished catalog (Coming soon included), at desktop (1440+) and one mobile/sheet treatment. Annotate what is live vs coming soon. Nick will pick; you are not deciding.

### Option A — Package first (planner recommendation)

The dock hero is the Feasibility Study card: title, promise, completeness strip, Download if present else Generate (Coming soon disabled). Under it, a collapsed disclosure **Technical exports** holding site plan formats + terrain formats. Flood study sits either as a peer under the hero (because it also paints the map) or inside the package as "included in the study" plus a "Run on map" action.

Dossier is either absorbed into the Feasibility card as "also available" or shown as a smaller sibling. Comparison is a ghost card at the bottom.

Goal: one thing you hand to someone, everything else is an ingredient.

### Option B — Library of artifacts

No hero. The dock is a list of artifacts for this parcel, newest first, each row: name, status (Ready / Coming soon / Honest absence), date if Ready, Download / Generate. Group headers: Packages / Studies / Exports.

Empty state (never generated anything) still shows the full catalog as ungenerated rows, not a blank panel.

Goal: feels like a filing cabinet for the lot. Scales when we add reports. Risks feeling flat and like today's stack if grouping is weak.

### Option C — Two tabs inside the one dock

Tab 1 **Reports**: Feasibility (hero), Dossier, Brief, Comparison (coming soon), Flood study.
Tab 2 **Exports**: site plan formats + terrain formats as a compact format grid, not three stacked forms.

Goal: the taxonomy is explicit. Costs an extra click. Tests whether Nick wants the CAD audience split from the client-packet audience without adding a seventh rail bubble.

### Optional fourth sketch (only if A–C are done)

A rejected-and-shown **full-page Reports studio** that takes over the map. Include it only to prove it is worse (loses the map, violates the one-dock law). Label it REJECTED CANDIDATE so it cannot be mistaken for a recommendation.

---

## 5. States to show (per option, at least A)

For Option A, draw these four frames. For B and C, the default + locked + coming-soon catalog is enough.

1. **Unlocked, nothing generated yet.** Full catalog visible. Feasibility Coming soon. Live exports offer Generate. Completeness strip still visible on the Feasibility card (this is allowed: the package can know its section coverage before the PDF exists).
2. **Unlocked, library populated.** Feasibility Ready (even if you mark the PDF Coming soon, show the *shape* of a ready package). Flood Ready with date. Site plan PDF Ready. Terrain Ready. Download is the primary button.
3. **Locked (signed in, not entitled).** Value line + View pricing & unlock. No price cards. No generate buttons.
4. **Signed out.** Sign in first. Map and inspect card still visible and free.

---

## 6. Copy you may use (do not rewrite prices or tier names)

- Dock title: Reports & exports
- Feasibility promise: "The cited package you hand to someone else."
- Completeness example: "11 of 16 sections have a finding · 5 honest absences"
- Absence chips: ETJ unresolved · HOA not searched · Service letter required · Footprint not on file
- Technical exports disclosure: "CAD and mesh"
- Coming soon (disabled): "Coming soon"
- Locked button: "View pricing & unlock"
- Free footnote: "The inspect card and map layers stay free."
- Flood live note: "Drawn on the map while this study is open"
- Failed / superseded: "Superseded · do not read as a second finding"

Do not invent new tier names. Existing names: Free, Unlock, Solo, Studio, Team.

---

## 7. What success looks like for this design pass

Nick can sit with three (or four) visuals and answer:

1. Is Feasibility the hero, or is the catalog flat?
2. Do CAD exports live under the package, in a tab, or as peers?
3. Does the dossier stay, merge into Feasibility, or leave the dock?
4. Does Brief belong in Reports or stay on the inspect card?
5. Does Coming soon in a finished-looking catalog feel honest or like vaporware?

You do not need to answer those. Draw so he can.

Deliver: a small set of frames (Figma, screens, or a design canvas) labeled Option A/B/C, with a one-paragraph note per option on what you were optimizing for. No implementation spec. No component library extract unless it helps the mock.

---

## 8. Context the designer does not need to re-derive

- Product: Smart Site at smartsite.cloud, map-first, inspect card left, workbench rail right.
- Why Feasibility exists: a human (Val) merged our site plan + flood sheets with tax, ETJ, HOA, and a written verdict into a 57-sheet packet. The product should compose that packet. Data we lack ships as honest absence and fills in over time; the chrome does not change when data arrives.
- Why this is urgent now: adding Feasibility as a fourth generate row would cement a bad pattern.
- Out of scope for you: Stripe, setbacks geometry, tile bake, PDF tokens, ingest sequencing.

If a visual conflict appears (e.g. completeness strip vs Coming soon on the same card), prefer honesty: the card can be Coming soon as a download and still show what the package will contain.
