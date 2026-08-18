# Card

Bring `smartcity-dashboards` type into conformance with the SmartCity design system type law, and add a test that keeps it there. This is most of why the serving build reads flat.

Housing: `empressaioemail-tech/smartcity-dashboards`. Clone fresh to a new directory under `P:\tmp` (e.g. `P:\tmp\g76-type`). Branch from `origin/main` as `g76/type-conformance`. Node 22+, `npm install`, `npm test`.

You own `web/shell.css`. You may also touch `web/index.html` **only in the top bar and the left nav** if a size change forces a markup change there. Lane B77 owns the rest of `index.html`, so do not edit any `<section class="lens">`, and do not touch `web/app.js` or anything in `src/` except the new test file you add.

# The law you are conforming to

`30b_smartcity_design_system.md` section 1.3. Two faces only: `--sc-font-ui` (Inter) for anything read aloud as a sentence, `--sc-font-data` (IBM Plex Mono) for anything read aloud as a number or a code. Ramp, eight steps:

| Step | Size / line | Weight | Tracking | Use |
|---|---|---|---|---|
| display | 26 / 32 | 650 | -0.022em | Lens titles. Rare. |
| title | 19 / 26 | 620 | -0.015em | Page header |
| head | 15 / 22 | 620 | -0.008em | Panel and section |
| body | 14 / 20 | 400 | 0 | Default interface text |
| body-em | 14 / 20 | 600 | 0 | Subject lines |
| label | 12 / 16 | 500 | 0.06em, uppercase, mono | Field and section labels |
| caption | 12 / 16 | 400 | 0 | Metadata |
| data | 13 / 18 | 400 | mono, tabular-nums | Identifiers, dates, money |

**12px is the floor and nothing renders below it.** The single named exception is the evidence chip label at 10px, and that component does not exist in this product, so treat the floor as absolute here. Uppercase only for mono labels, always with 0.06em to 0.16em tracking, never on a sentence. Every column of digits gets `font-variant-numeric: tabular-nums`. Reading prose caps at 68 characters.

# Confirmed defects, measured 2026-08-18 on main

Fourteen declarations in `web/shell.css` render below the floor. Line numbers on current main: 89, 129, 200, 244, 265, 304, 322, 346, 419, 432, 463, 496, 631, 728. They include the nav group label, nav badges, `.prov`, `.env`, `.state .st-k`, `.dt thead th`, `.region-bar .t`, `.metric .k`, `.metric .n`, `.seal`, `.cp-source em`, and `.kv dt`. Verify the set yourself rather than trusting the list; the count is what the planner measured, not a contract.

Four ramp steps are off:

| Selector | Shipped | Must be |
|---|---|---|
| `.panel-head .t` | 620 13px/18px | head, 620 15/22, -0.008em |
| `.srcreg .nm b` | 600 13px/18px | body-em, 600 14/20 |
| `.state h2, .state h5` | 620 16px/23px | head, 620 15/22, -0.008em |
| `.pagehead h1` | 620 20px/27px | title, 620 19/26, -0.015em |

Also check and fix: `.cz h1` should be display (650 26/32, -0.022em); `.navitem`, `.btn` and `.tabs a` set 13px which is not a ramp step and should be body 14/20 unless that breaks the frame; `.t-caption` at 12/17 should be caption 12/16.

# The hard part, and how to solve it

Raising the nav badges and group labels to the floor makes them wider. The sidebar is `--sc-nav` (248px) and labels like "Development services" already fill the row. **Never solve this by going under the floor.** Solve it with layout: move the badge to a second line under the label, give the nav item auto height with the badge right-aligned below, or reduce the badge to its state word without decoration. You may not change `--sc-nav`; it is a kit token. Information must not be lost: every destination that is Preview, Empty or Not built must still say so in the nav.

Same problem in the top bar with `.env` and `.badge-off`, and in `.region-bar`.

# Constraints

- `web/shell.css` must contain zero hex colors, zero `rgb()`/`rgba()`, and zero `--sc-*` token declarations. It consumes `var(--sc-*)` only. Do not fork or edit `web/sc-kit.css`.
- Change no color, no radius, no duration, no easing. This card is type and the layout consequences of type. Nothing else.
- Do not add a component, a class family, or a token.
- The environment badge must still read Demo.

# Add the guard

Add `src/type-conformance.test.mjs` that reads `web/shell.css` and fails on: any `font-size` or `font:` shorthand below 12px; any of the four ramp selectors above not matching its step; any `text-transform: uppercase` on a rule not using `--sc-font-data`; any hex or `rgb()` in the file. Write it so the failure message names the offending selector and value, not just a boolean.

# Verify before reporting

1. `npm test` from the repo root. All tests pass, including ones you did not write.
2. Prove the nav did not break. Start the server on a free port in the background (`PORT=8097 node src/server.mjs &`), wait, then drive headless Chrome at `C:\Program Files\Google\Chrome\Application\chrome.exe` with `--headless=new --disable-gpu --no-sandbox --hide-scrollbars --window-size=1600,1000 --virtual-time-budget=8000 --screenshot=<path> <url>` at 1600x1000 and at 820x900, and **look at the images**. Confirm no nav item clips, no badge overlaps a label, no text is cut off. Kill the server when done.
3. Re-grep for the forbidden strings and for hex/rgb in `web/shell.css`.

# Report

PR number, CI conclusion string, a before/after table of every declaration you changed, how you solved the nav badge width problem, what the screenshots showed, and anything you found and did not fix. If a defect in the list turns out not to be real, say so plainly rather than inventing a fix for it.
