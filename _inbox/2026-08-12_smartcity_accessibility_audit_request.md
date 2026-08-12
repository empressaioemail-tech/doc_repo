---
id: 2026-08-12_smartcity_accessibility_audit_request
title: Accessibility audit request — SmartCity OS Bastrop (for VPAT)
date: 2026-08-12
status: request, awaiting assignment
owner: nick
related: [_smartcity_masters/Pricing/00_pricing_basis, _prospects/vertosoft/2026-06-07_vertosoft_channel_and_offer, 30_smartcity_os]
purpose: Scoped request for the accessibility audit that feeds the VPAT in the Vertosoft vendor package. Written to be sent as-is once the assignee and dates are filled in.
---

**To:** [assignee]
**From:** Nick
**Subject:** Accessibility audit — SmartCity OS Bastrop, due [date]

We need an accessibility audit of the live Bastrop deployment. It feeds the VPAT — the accessibility conformance report — that goes into our vendor package for the public-sector channel. Government buyers require one, and I cannot fill out the conformance table with anything except real test results.

Below is the exact scope so you do not have to guess at any of it.

## What to test

The live Bastrop production instance. Treat these as three separate surfaces, because the VPAT distinguishes them and the findings need to be attributable:

1. **Citizen-facing portal** — public pages, permit submission, any public dashboards.
2. **Staff-facing dashboards** — the internal, login-gated views.
3. **Generated documents** — any PDF or file the system produces, such as permit confirmations and reports. PDFs have their own conformance criteria and are the most commonly missed surface.

## Step 1 — Automated scan

Do this first. It is fast and it will cover most of what a buyer's reviewer checks.

Run one of these against **every distinct page template**, not just the homepage. A handful of unique page types usually covers most of a site like this.

- **axe DevTools** — browser extension for Chrome or Firefox; the free tier is enough.
- **WAVE** — `wave.webaim.org`, paste in a URL, nothing to install.
- **Lighthouse** — already built into Chrome DevTools, under the Lighthouse tab.

Each tool returns violations tagged to a WCAG success criterion number, such as 1.1.1 or 2.4.7. **Save the full output per page**, not just a summary. I need the criterion numbers.

## Step 2 — Keyboard-only test

Unplug the mouse. For each major flow — login, submit a permit, view a dashboard — navigate using only Tab, Shift+Tab, Enter, and the arrow keys. Check four things:

- Can you reach every interactive element: links, buttons, form fields.
- Is there always a **visible focus indicator** showing where you are.
- Does tab order follow a logical reading order.
- Can you actually complete the permit submission end to end this way.

That last one is the one that matters most. A form you can tab into but cannot submit is a hard fail, and it is the kind of thing an automated scan will not catch.

## Step 3 — Screen reader test

Use **NVDA** on Windows, which is free, or **VoiceOver** on Mac, which is built in and toggles with Cmd+F5.

Turn it on and complete the same core flows using only what you hear. Note anywhere the screen reader reads nothing, reads the wrong thing, or gets stuck and cannot move forward.

## Step 4 — Color contrast

The axe or WAVE scan catches most of this automatically. Spot-check anything it might miss — text over colored backgrounds, text inside charts, status badges — against **4.5:1 for normal text** and **3:1 for large text**. WebAIM has a free contrast checker if you want to verify by hand.

## How to hand results back

For every finding, give me three things:

1. **The WCAG success criterion number** — whatever the tool flagged, or the closest one if it was a manual finding.
2. **A conformance level**: Supports, Partially Supports, Does Not Support, or Not Applicable.
3. **A one-line note** on what is actually broken and where.

A spreadsheet with those three columns, one row per criterion, drops straight into the VPAT table. Add a fourth column for which of the three surfaces it applies to, since the same criterion can pass on one surface and fail on another.

**If a criterion has zero findings across all three surfaces, mark it Supports.**

## Deadline

Spreadsheet by **[date]**.

If the full manual and screen reader pass does not fit this week, **send the automated scan alone and flag the rest as not yet tested**. Partial real data beats zero real data. We are not blocking on perfection here, only on accuracy — a VPAT with honest gaps is fine, a VPAT with guesses is not.

Anything ambiguous, ask me rather than assuming. A wrong conformance claim in a government vendor package is worse than an incomplete one.

— Nick
