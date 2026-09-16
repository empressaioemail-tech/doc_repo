# Handoff: Smart Site sign in redesign (smartsite.cloud)

## Overview

Replacement for the current smartsite.cloud sign in modal. The old card listed
categories, put "Sign in with Google" first and buried "browse without an
account" as a ghost button at the bottom. The redesign inverts that order: show
what the product answers, let a visitor open a real sample report with no
account, and drop the account block to secondary weight.

Three states are designed:

1. **State 1, the card.** Centered modal over the live satellite parcel map.
   Wordmark, eyebrow, H1, sub, then a three-up row of the three report
   instruments, then a Claude channel block, then the CTAs.
2. **State 2, the sample report.** A wider split panel over the map, zoomed to
   the example parcel. Left 55 percent is the lot drawn on imagery; right 45
   percent is the readout, tabbed. The left visual changes with the tab. All
   three tab states are rendered side by side in the deliverable.
3. **State 3, the Claude view.** A mock conversation inside Claude showing the
   Smart Site connector answering a plain language question with cited values.
   This screen gets screenshotted by affiliates, so it is built to read at
   small size in a feed.

Desktop and mobile are designed for states 1 and 2 (mobile state 2 shows the
X-ray tab). Mobile flood, terrain and Claude views are not drawn yet.

## About the design files

`Smart Site Sign In.dc.html` and the standalone copy in this bundle are
**design references authored in HTML**. They are prototypes of intended look
and content, not production code to lift. Recreate them in the app's existing
environment (the Property Explorer front end and its `pe-tokens.css`), using
its established components and patterns. Every value below maps to a token in
`pe-tokens.css` where one exists.

## Fidelity

**High fidelity.** Colors, type sizes, spacing, radii and copy are final.
Recreate pixel-accurately with the codebase's own components.

Two deliberate departures from the Smart Site design system, both requested by
the operator and both overriding the system's rule:

- **Orange as a button fill.** The system reserves gold for the brand mark and
  the unread dot. The primary CTA here is a solid `#E8963B` fill with
  `#1B1B19` text, because the brief requires it to be the highest contrast
  element on the card. The gold CI allow-list needs an entry for these two
  buttons.
- **A 40px numeral** was used in an earlier round and has since been removed.
  The current design stays inside the six-size ramp. No seventh step is needed.

The satellite map behind the card and inside the state 2 left panel is a
**drawn approximation** in SVG (flat parcel blocks, canopy, roads). Production
must use the real aerial basemap. The parcel geometry, buildable envelope,
flood polygon and contour rendering are the parts to reproduce faithfully.

The Claude starburst mark in the Claude block and state 3 is a **drawn
placeholder**. Swap in the official asset before shipping.

## Copy, verbatim

All copy below is fixed. Do not rewrite.

State 1:
- Eyebrow: `Parcel intelligence for Central Texas`
- H1: `What can you actually build on it?`
- Sub: `Zoning, setbacks, buildable envelope and flood for any parcel in the Austin metro, cited to the ordinance section it came from.`
- Instrument names: `X-ray`, `Flood & Drainage`, `Terrain`
- `X-ray`: `What you can build, and where the envelope is`
- `Flood & Drainage`: `What the water does, with the FEMA panel it came from`
- `Terrain`: `How the ground falls across the lot`
- Claude block, left: `Or ask from inside Claude.`
- Claude block, right: `Connect Smart Site to Claude and ask about a parcel in plain language. Every tier, including free.`
- Differentiator line: `When the record does not say, we say so. We do not invent a setback.`
- Primary CTA: `See a real parcel report`
- Sample links label: `No address in mind?` then `An Austin infill lot`, `A Bastrop tract`, `A Hays corridor lot`
- Account block: `Sign in with Google`, `or`, field placeholder `you@example.com`, text link `Continue with email`, note `No password, ever. We'll email you a link.`
- Last line: `Browse the map yourself`

State 2:
- Header: address, APN, and `Example parcel. No account needed.`
- Tabs: `X-ray`, `Flood & Drainage`, `Terrain`
- Envelope tag: `approximate, not survey grade.`
- Footer: `Look up your own parcel`, `Sign in to save and share this`

Absence: the chip reads `reported absent`, lower case, muted grey, thin border,
no icon, no red, no warning styling. It is never an error, a warning, or a
locked or upgrade prompt. **One chip only in state 2**, inline in its natural
row (On site septic (OSSF)). No absence section, no absence heading.

Banned language, enforced: no `feasibility` anywhere; no `3D`; no comparison
report; no property value, estimate, comp or sale price; no time saved or money
saved figure; coverage language is `the Austin metro` only, never Texas wide,
statewide or nationwide; no em dashes or en dashes.

## Example parcel

One parcel is used across every state. **Illustrative, not live** — each frame
carries `Mockup. Values illustrative, not live.` in its margin. Replace with
real records on wiring up.

```
Address              4207 BRANDT RD, AUSTIN, TX 78744
APN                  04-0405-0113
Lot                  0.21 ac
Zoning district      SF-3                    cite 25-2-492
Front setback        25 ft                   cite 25-2-492
Rear setback         10 ft                   cite 25-2-492
Side setback         5 ft                    cite 25-2-492
Max height           35 ft                   cite 25-2-531
On site septic       reported absent
Buildable envelope   4,150 sq ft             cite 25-2-492  (tag: approximate, not survey grade.)
Flood zone           AE (partial)            cite 44 CFR 64.3
Base flood elevation 458 ft NAVD88           cite FIRM
Floodway flag        OUTSIDE FLOODWAY        cite 44 CFR 60.3
FEMA panel id        48453C0610K             cite FIRM
Effective date       2019-01-22              cite FIRM
Share in zone AE     18 pct                  cite FIRM
High point           466 ft                  cite TNRIS 2021
Low point            455 ft                  cite TNRIS 2021
Fall across lot      11 ft                   cite TNRIS 2021
Mean grade           4.2 pct                 cite TNRIS 2021
Fall direction       NW to SE                cite TNRIS 2021
Contour interval     2 ft                    cite TNRIS 2021
```

County strings stay verbatim and uppercase where the county writes them
uppercase. Dates are ISO.

## Interactions and behavior

- **See a real parcel report** and each of the three sample parcel links open
  state 2. The links preselect a parcel; the CTA opens the example parcel.
- **Instrument cards** in state 1 are clickable and open state 2 on that
  instrument's tab.
- **Tabs** in state 2 swap both the right readout and the left visual. Only the
  visual and rows change; header, tabs and footer are fixed. State lives in one
  variable, `activeTab: 'xray' | 'flood' | 'terrain'`.
- **Claude block** in state 1 opens state 3 (or the connector install flow).
- **Citation links** open the cited ordinance section or FIRM panel.
- **Look up your own parcel** opens the search. **Sign in to save and share
  this** opens the account block.
- **Responsive**: at mobile width the card becomes a near full bleed sheet and
  the instruments stack; state 2 becomes drawing on top, sheet below.

## State management

```
authState        anonymous | emailPending | signedIn
view             card | report | claude
activeTab        xray | flood | terrain
selectedParcel   apn, address, geometry, values, citations
email            string, for the magic link field
```

Report values are fetched per parcel and per instrument. Every value carries its
citation and an explicit `absent` case; render `absent` as the chip, never as an
empty string, a dash, or a zero.

## Design tokens

From `pe-tokens.css`. Do not spell literals where a token exists. Full token
values, plus the mock's non-token colors and their intended use, are in the
design-of-record file (`Smart Site Sign In.dc.html`) itself.

## Files in this handoff

- `Smart Site Sign In.dc.html` — the design of record, markup and copy
  verbatim. Seven frames: desktop state 1, mobile state 1, three desktop
  state 2 tab frames, state 3, mobile state 2. Frame margins carry the mockup
  label and each frame carries a `data-screen-label`.
- `assets/smart-site-logo.svg` — the wordmark, re-saved without its embedded
  C2PA content-credentials manifest (provenance metadata from the tool that
  rendered it, not part of the design). The two hardcoded golds inside the
  file must not be changed.

**Not archived here:** the self-contained "standalone" preview bundle (fonts
and the React/ReactDOM runtime inlined as base64) and the two superseded
earlier rounds (v1, bracketed-placeholder; v2, hero-numeral). All three add
no content beyond what is captured above and in the design-of-record file;
the operator holds the originals if the interactive preview is needed again.

Earlier rounds (a bracketed-placeholder untabbed v1, and a hero-numeral v2)
were superseded by the design of record above and are not included here —
kept for context only in the original handoff, not to be built.

## Provenance

Handed to the integration seat by the operator 2026-09-16, alongside a
screenshot confirming the CURRENT live smartsite.cloud card (the P-122 Batch 7
copy rewrite, shipped 2026-09-08) as the baseline this design replaces. Filed
as plan row P-247 in `90_operations/OPS-16_texas_market_plan_of_record.md`.
