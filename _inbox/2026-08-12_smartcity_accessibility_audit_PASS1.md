---
id: 2026-08-12_smartcity_accessibility_audit_PASS1
title: SmartCity OS accessibility audit — pass 1 (static, pre-VPAT)
date: 2026-08-12
status: partial — static analysis complete, browser testing owed
owner: nick
related: [2026-08-12_smartcity_accessibility_audit_request, 30_smartcity_os, _prospects/vertosoft/2026-06-07_vertosoft_channel_and_offer]
purpose: First-pass accessibility findings against the live smartcityos.io deployment, for the VPAT going into the Vertosoft vendor package. Static analysis of served HTML and the production JS bundle. Browser-based testing (axe, keyboard, screen reader) is the required second pass and is NOT covered here.
---

# SmartCity OS accessibility audit — pass 1

Run 2026-08-12 against the live deployment at `smartcityos.io` (also served from `smartcity-api-7dyaiy7wha-uc.a.run.app`; all three known hosts return the same 3,624-byte document).

**What this pass is.** Static analysis of the served HTML and the production JavaScript bundle (`/assets/index-kGj7uMs4.js`, 5.57 MB). It produces a verified route inventory, one confirmed violation, and a prioritised list of what browser testing will most likely surface.

**What this pass is not.** It is not the audit. Nothing here substitutes for axe, keyboard, or screen-reader testing, for the reason given below.

---

## The finding that shapes the whole audit

**SmartCity OS is a fully client-rendered single-page application.** The served HTML body contains exactly one meaningful element:

```html
<body>
  <div id="root"></div>
</body>
```

There is no server-rendered content and no `<noscript>` fallback.

Three consequences, all of which bind the VPAT work:

**Static analysis cannot produce a conformance claim.** Assistive technology reads the rendered DOM, which does not exist until JavaScript executes. Any criterion about headings, landmarks, labels, alt text, focus order, or contrast is untestable from source and must be tested in a browser against the live rendered page.

**Automated tooling must run in-browser.** WAVE's URL-paste mode and any source-fetching scanner will report almost nothing, because they see the empty shell. Use the axe DevTools **extension** or Lighthouse **in DevTools**, both of which run against the live DOM. A WAVE run by URL would produce a clean-looking result that is meaningless — worth knowing before someone reports it as a pass.

**Every route needs its own scan.** There are 139 of them (below), and in an SPA a single misbehaving shared component can fail the same criterion on all of them.

---

## Confirmed violation

**WCAG 1.4.4 Resize Text — Does Not Support.** Applies to all surfaces.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
```

`maximum-scale=1` disables pinch-to-zoom on mobile browsers. A low-vision user cannot enlarge the page. This is a well-known, unambiguous Level AA failure, it is one line, and the fix is to delete `maximum-scale=1`. There is no functional reason to keep it.

This is the only criterion this pass can mark with confidence, and it should be fixed before the VPAT is filled in rather than reported as a failure.

---

## Route inventory — the audit scope

139 distinct routes extracted from the production bundle. This is the real page-template list; do not audit only the homepage.

**Note on probing:** every path returns HTTP 200 because the SPA serves a catch-all. A 200 is not evidence a route exists. The list below comes from the bundle's route table, which is authoritative.

### VPAT surface 1 — citizen-facing (14 routes)

`/citizen` · `/citizen/adopt-pet` · `/citizen/business-license` · `/citizen/contact` · `/citizen/events` · `/citizen/library` · `/citizen/parking-permit` · `/citizen/parks` · `/citizen/pay-citation` · `/citizen/pay-utilities` · `/citizen/permits` · `/citizen/public-records` · `/citizen/report-issue` · `/citizen/volunteer`

**This is the highest-risk surface and should be tested first.** It is the one a member of the public uses, the one most likely to draw a complaint, and the one a government buyer's reviewer will open first. It also contains the transactional flows — permits, citation payment, utility payment, issue reporting — where a keyboard trap or an unlabelled form field is a hard failure rather than an inconvenience.

### VPAT surface 2 — staff and internal (106 routes)

19 admin routes under `/admin/*`, plus 87 staff and operational routes including `/dashboard`, `/city-pulse`, `/executive-overview`, `/departments/*` (7), `/permitflow/*` (10), `/portal/*` (12), `/reports/*`, `/fleet`, `/police`, `/fire-ems`, `/emergency-response`, `/gps`, `/call-analytics`.

Sampling is defensible here. Test one representative of each shared layout — an admin table view, a department dashboard, a permitflow step, a portal page, a report view — rather than all 106.

### Marketing and demo (19 routes)

`/ai/*`, `/blog/*`, `/demo/*`, `/deck`, `/about`, `/contact`, `/pricing`, `/solutions`.

Lower priority for the VPAT, which covers the product. Do not skip entirely: if the buyer's reviewer starts at the marketing site, its failures colour the whole assessment.

### VPAT surface 3 — generated documents

**Not yet inventoried.** The system generates PDFs (permit confirmations, reports). PDF accessibility is a separate conformance section with its own criteria, and it is the most commonly skipped surface. Someone needs to generate one of each output type and check tagging, reading order, and text extractability.

---

## What browser testing will likely find

From bundle analysis. **Indicative only — none of these are conformance claims, and each must be confirmed or dismissed in a browser.**

**No skip link (WCAG 2.4.1 Bypass Blocks).** Zero occurrences of any "skip to main content" pattern across the entire bundle. With the navigation this application carries, a keyboard user likely tabs through the full nav on every page. Expect a finding. Cheap to fix.

**Focus indicators suppressed (WCAG 2.4.7 Focus Visible).** 78 instances of `outline:none` or `outline-none` against only 28 `focus-visible` rules. That ratio suggests default focus rings are removed in more places than custom ones are supplied. This is the single most likely source of real findings and it directly determines whether the keyboard pass succeeds.

**Click handlers without keyboard equivalents (WCAG 2.1.1 Keyboard).** 980 `onClick` handlers against 36 `onKeyDown`. Most of that gap is benign — real `<button>` elements handle keyboard natively. The risk is any clickable `<div>` or `<span>`, which is invisible to keyboard and screen-reader users. Worth grepping the source for click handlers on non-interactive elements.

**Canvas content (WCAG 1.1.1 Non-text Content).** 20 `<canvas>` elements, presumably charts. Canvas is opaque to screen readers unless given a text alternative or an accessible data table. Charts on executive dashboards are a predictable finding.

**Images (WCAG 1.1.1).** 94 image elements against 69 `alt` props. The shortfall may be decorative images correctly marked `aria-hidden` (23 occurrences), or it may be missing alt text. Must be checked in the DOM.

**Page titles (WCAG 2.4.2 Page Titled).** The served title is identical for all 139 routes. If the SPA does not update `document.title` on navigation, every page announces the same name to a screen reader. Easy to check, easy to fix.

**Live regions (WCAG 4.1.3 Status Messages).** Only 5 `aria-live` regions across an application full of dashboards, async loads, and form submissions. Status changes are probably silent for screen-reader users.

### The mitigating factor

**124 references to Radix UI.** Radix primitives are built for accessibility — correct roles, focus management, and keyboard interaction come free wherever they are used. Dialogs, dropdowns, and tabs built on Radix will likely pass. The findings will cluster in hand-rolled components, not in the design-system ones. That is a genuinely better starting position than most applications of this size.

---

## Honest position for the VPAT

**Do not fill in the conformance table from this pass.** One criterion (1.4.4) can be marked Does Not Support today. Everything else requires browser testing, and marking a criterion "Supports" without a test behind it is the failure mode to avoid — a VPAT is a self-attestation to a government buyer.

Recommended order:

1. **Fix 1.4.4 now.** One line, no reason to ship it.
2. **Run axe DevTools on the 14 citizen routes.** Highest risk, smallest set, and it will resolve most of the predicted findings above in an afternoon.
3. **Keyboard-only pass on the three transactional flows** — permit submission, citation payment, issue reporting. This is where a hard failure would live.
4. **Sample the staff surface** — one representative per shared layout.
5. **Screen-reader pass (NVDA)** on the citizen permit flow.
6. **Inventory and check the generated PDFs.**

Steps 1 and 2 alone would let the VPAT be filled honestly for the citizen surface, which is the surface a buyer scrutinises.

---

## Method, for reproducibility

Served HTML retrieved from `https://smartcityos.io` (3,624 bytes) and inspected directly. Production bundle `/assets/index-kGj7uMs4.js` (5,574,375 chars) retrieved and analysed for route definitions and accessibility-relevant patterns. Route table extracted from `path:` and `<Route path=` declarations, deduplicated, and classified by prefix. Pattern counts are raw occurrence counts in minified source and carry the usual caveats of that method — they indicate where to look, not what is true.

No browser, no assistive technology, and no rendered DOM was involved in this pass.
