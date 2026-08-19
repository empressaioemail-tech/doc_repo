---
id: 2026-08-18_g88_surface_inventory
title: G-88 investigation — smartcity-dashboards surface inventory
status: active
last_updated: 2026-08-18
applies_to: smartcity
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _decisions/2026-08-17_smartcity_visual_law,
    _inbox/2026-08-17_g18_shell_homes,
  ]
---

# G-88 investigation: the surfaces a design pass would touch

Read-only investigation, fanned at G-88 scoping (A-070). Clone `P:\tmp\g75-dash` verified current against `origin/main` at `cdfca39c9ed3fd7c61a13984e41b3ec1e9b6f77b`, working tree clean. Baseline suite 185 pass / 0 fail.

## Deployed matches main, byte for byte

All four shipping assets sha256-match the local tip: `index.html` 75687 bytes, `app.js` 32914, `shell.css` 26969, `sc-kit.css` 4409. **There is no stale-CSS problem in what is being served right now.** That is not the same as the cache defect being absent; it means the current served bytes are correct, so the returning-browser exposure is the open question and is the subject of the separate cache investigation.

## Fifteen surfaces, twenty-two rendered panels

Thirteen single-panel sections, plus six Development-services tabs and three Assets tabs. Development services is the largest real design surface at 129 lines with the only `<table>` in the product and two mount anchors; then Overview with a 14-row source register and the map rail; then Assets across three tabs. Connections is the biggest by bytes at 20.8 KB, 28 percent of the file, but it is machine-generated.

Seven surfaces are near-identical roster shells at 17 to 28 lines each, one `.state` block and one `.basis` line apiece: Public works, Parks, Police, Fire and EMS, Fleet, Records search, People and access. They are one PR, not seven.

**Plan review and Files are iframe mounts and are out of scope by construction.** Three persistent iframes point at `smartsite.cloud`, `plan-review-app-ten.vercel.app` and `smart-files-app.vercel.app`. What this repo can restyle inside a mount surface is only the frame: `.region-bar`, `.region-canvas` ground, `.mount-note`, `.region-foot`, and stage geometry. Everything inside the iframe belongs to another product.

## Finding 1: one PR per surface is LOGICAL, not physical

Every one of the fifteen surfaces edits the same `web/index.html` and the same `web/shell.css`. `index.html` is one static document with every lens inline; `app.js` does not assemble screens, it toggles an `.on` class and hydrates a few text nodes. The router is nine lines.

Consequences the plan has to carry rather than discover:

Every PR after the first needs a rebase or conflicts, because HTML line numbers shift when an earlier section grows. Merge serially, or sequence surfaces from the bottom of the file upward so earlier offsets stay stable.

`shell.css` is shared and unpartitioned. A pass on Finance that touches `.panel`, `.state`, `.srcreg` or `.pill` changes every other surface at the same time. Only three blocks are surface-scoped: assets, citizen-scoped-light, and the roster/not-built views.

Connections must be changed at `connectionsRegisterHtml()` in `src/shell-homes.mjs` and re-baked. Hand-editing the seventy rows in the HTML is silently reverted by the next bake and is test-guarded.

## Finding 2: the palette and the type ramp are locked, and that bounds what a design pass IS

Four mechanical gates will reject a design PR that ignores them.

`shell.css` may declare no colour and no token. The assertions are literal: no `:root`, no hex of any length outside comments, no `rgb()` or `rgba()`. Every colour must be `var(--sc-*)` from the frozen kit.

`web/sc-kit.css` is byte-identical across `smartcity-dashboards`, `smart-files` and `plan-review`, and its own header says a repo that edits a token value has forked the system.

The type ramp is pinned by selector, with exact size, line-height, weight and tracking for named selectors. 12px is an absolute floor. Uppercase only on mono.

No new CSS class may be introduced without a rule; a test diffs every `class="..."` in the HTML and every runtime `classList` call against the classes defined in the two stylesheets, allowing exactly one unstyled marker.

**The load-bearing consequence for G-88 step 1.** Shipping `mx*`, `cite` and `atomchip` into `shell.css` is fine only while those families consume EXISTING `--sc-*` tokens. If any of them needs a new colour, that colour cannot live in `shell.css`, and putting it in `sc-kit.css` is a product-line decision across three repos rather than a Dashboards PR. Inverted applicability needs a hatch treatment for Unchecked, which is the most likely place this bites. The CSS-families investigation is scoped to name the exact tokens each family consumes, and that answer decides whether step 1 is one PR or a product-line ruling.

Read plainly: this is a layout, hierarchy, spacing and density pass inside a fixed palette and a fixed type ramp. Recolouring or re-typing is a different, larger decision.

## Identity: four in play, not three

`template-city` is the default and needs no parameter; public-free, generates 14 fixture permit-case records, seal TC. `empty-city` is public-free and generates nothing. `fixture-city` is tenant-private and 401s anonymously. Live Bastrop is not a pack here at all and cannot become one: `src/city-pack.mjs` throws `Bastrop is not a pack on this card`.

Develop against `template-city` and regression-check every surface against `empty-city`. The reasoning is the operator's own: on a city with zero records there are no exceptions, so every pill renders quiet and the tension mechanism is switched off, which is the one input under which this design is guaranteed to look flat. `empty-city` is the check that honest-empty screens stay reachable, not the development target. Do not develop against `fixture-city`.

A design pass must not hardcode a city name into markup. Static markup carries only the fallback vocabulary: "This city", "this pack", "Demo", "Sources not read".

## Sixteen honest-empty states that must stay empty

Assets across all three tabs, as a ruling about the world rather than about the demo, with G-24 at zero and every header action disabled. `grantedAdapters` is `[]` on all three packs and a pack that generates fixtures grants no adapter, structurally. Seven not-built surfaces each carrying a named home and a basis line. Finance entire, with a test asserting the string `$0` never appears, because four zeros in a header would be four false claims. The Overview metric strip reading Not read rather than zero. The Overview decision queue and public meetings. Three Development-services tabs that are chrome and say so. The Development-services honest-empty pipeline state, which must stay reachable even though `template-city` now populates it. Citizen address lookup, requests and payments, all disabled.

Two cross-cutting rules: every empty state carries a `.basis` line, and removing one to tidy a layout is a substantive change rather than a cosmetic one; and no invented freshness anywhere, with tests asserting no "last sync", "last read" or "last updated" appears.

## Forbidden strings: `web/` is clean

Zero hits of all five vendor needles across the four shipping assets. Every `src/` hit is either the refusal list itself in `catalog.mjs` or a test asserting the guard fires.

Two gaps reported, not ruled. **The shape gate does not scan CSS**: its walk is `.mjs`, `.js` and `.html` only, so a vendor name in a `shell.css` comment would not be caught, and G-88 is a card that adds CSS. And the city-name gate is case-sensitive and scoped to `web/index.html` alone, so a lowercase `bastrop` in that file, or any occurrence in `app.js`, would pass.

`48021:34137` is a Bastrop County parcel hardcoded in shipping files and positively asserted by the gate alongside a `Demo fixture` label. This is deliberate and ruled, not a leak. A design pass must keep the `Demo fixture` label adjacent to that string wherever it renders.

## Unrun

No browser was opened, so every claim here is source, API response, or byte hash, and nothing about how a surface LOOKS is verified. Responsive breakpoints exist and were not exercised. The 67-home register was not verified against live Bastrop, which is no-touch. Whether the mounted products honour `?embed=1` today was taken from the G-75 note and not re-verified; that note also carries an open item, that SmartSite renders its own search field, wordmark and tab bar inside the map region and has no embed mode. The Cloud Run serving revision was not read; served bytes were compared to local main instead, which is the stronger check for this purpose.
