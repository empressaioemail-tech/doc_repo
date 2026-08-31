---
id: 2026-08-17_demo_city_template_handoff
title: Handoff — build the rest of the demo city (template for Bastrop)
status: closed
last_updated: 2026-08-17
applies_to: smartcity
owner: nick
related:
  [
    30b_smartcity_design_system,
    30c_smartcity_platform_ia,
    2026-08-17_g73_shell_design_review,
    2026-08-17_g18_shell_homes,
    2026-08-17_g74_identity_leak_WDLL,
  ]
---

# Handoff: build the rest of the demo city

Paste the prompt below to the build agent. Identity leak (G-74) is CLOSED on serving `00012-9dk`: no Bastrop meetings, no Chestnut, zero Bastrop on Connections. Do not undo G-74. Do not ingest Bastrop. This handoff is chrome, mounts, and map motion so template-city becomes the city pack Bastrop will later wear.

## Prompt (paste)

You are building the rest of **template-city** on serving SmartCity Dashboards so it can become the template Bastrop (and the next city) wears. This is a chrome and mount pass, not a data feed, not a Bastrop cutover.

A solid pass means: every product surface that Bastrop will need already exists as designed chrome (mounted, empty, or honestly Not built), every iframe mount fits its container without a second top bar or a clipped canvas, and the map has Compass-class motion while still starting in the map regions already on the page. The operator will do a **light visual QA** to get shape right. Your job is to make that QA small: wiring, sizes, motion, empty states, and kit law should already be right.

### What this is

template-city on Dashboards is the city pack. Live Bastrop stays `https://smartcityos.io` (`smartcity-api-00118-qox`) until a named cutover. Do not clone `smartcity-os`. Do not deploy into `smartcity-os-prod`. Do not start MyGov, Samsara, OpenGov, or any adapter grant. Do not fill G-24. Do not put Bastrop meetings, Bastrop streets, Bastrop staff names, or the word Bastrop on demo-visible chrome.

Lane B already pulled identity leaks off the demo (G-74 CLOSED, Dashboards PR #12, serving `00012-9dk`). If you still see Bastrop council on Overview or 1311 Chestnut on Citizen, that is a regression: stop and report it. Do not re-add them.

### Read first

1. Design law: `P:\doc_repo\30b_smartcity_design_system.md` (and local `30b_smartcity_design_system.html` if present). No hex, no `rgb()`, no token definitions in product CSS. Consume `--sc-*` only.
2. IA and layouts: `P:\doc_repo\30c_smartcity_platform_ia.md` and `P:\doc_repo\30c_smartcity_platform_ia.html`. These are the screens Bastrop will need. Build the missing chrome against them.
3. Function homes: `P:\doc_repo\_inbox\2026-08-17_g18_shell_homes.md`
4. Live Bastrop inventory (what the template must be able to host later): `P:\doc_repo\_inbox\2026-08-17_g18_smartcity_inventory.md` and `P:\doc_repo\_inbox\2026-08-17_bastrop_dashboard_layout_inventory.md`
5. Design review of the current shell (remaining defects B through G, plus C1 mount chrome): `P:\doc_repo\_inbox\2026-08-17_g73_shell_design_review.md`
6. Kit extract: `P:\doc_repo\_inbox\2026-08-17_sc_kit.css`

### Live surfaces to grade and change

Dashboards: https://smartcity-dashboards-52ecsl5mvq-ue.a.run.app  
Housing: `empressaioemail-tech/smartcity-dashboards`. Isolated worktree from `origin/main`. Do not edit `P:\smartcity-os`.

Mount hosts (must stay these origins, do not clone):

- SmartSite map: `https://smartsite.cloud/?parcelNodeId=48021%3A34137` (gold demo fixture, not Bastrop onboarded)
- Plan Review: `https://plan-review-app-ten.vercel.app/`
- Smart Files: `https://smart-files-app.vercel.app/?embed=1`

Walk every lens and work view: `/`, `/?lens=development-services` and every DS tab, `/?lens=finance`, `/?lens=citizen`, `/?work=files`, `/?work=assets`, `/?work=connections`. Screenshot the mounts. Measure the containers.

### Required work

**1. Mount and container audit (blocking).**

For each iframe (`#overview-site`, `#place-site`, `#review-site`, `#files-site`) record: parent class, computed width and height, iframe width and height, whether a second product top bar is visible, whether the canvas clips, whether min-height 220px is the only size (too short for a staff map). `.region-canvas` today is `min-height: 220px; flex: 1`. If a mount is a postage stamp, a letterbox, or a nested header, that is a defect. Fix container CSS using `--sc-*` only. Do not fork `sc-kit.css`.

Plan Review currently stacks two top bars. Smart Files is the working embed reference: Dashboards `smartFilesIframeSrc()` appends `?embed=1`, Files HTML detects embed (query, iframe, referrer) and sets `html[data-embed=1]`, CSS hides `#app > .shell-top`. Mirror that on Plan Review: Dashboards must pass `embed=1`, and plan-review-app must actually set `data-embed` (the CSS is already there; the detection script is missing). Housing for Plan Review is `empressaioemail-tech/plan-review`. Isolated worktree. Do not cut live PermitFlow.

**2. Map motion: Compass-class, same homes.**

The map must keep starting where it is today: Overview context rail (`#overview-site`) and Development services Place rail (`#place-site`). Do not move the map into the Compass top-bar control. Do not make a second map product.

Give those map regions the same animation and flexibility Compass already has in `web/app.js` `bindCompass()`:

- Spring: `springEase(320, 32, 0.9, 60)` already in the file. Reuse it. Do not invent a second easing.
- States: collapsed (the current region-canvas), presented (larger sheet), maximized (near-viewport).
- Flip: transform from the current canvas rect to the dest rect (scale + translate), border-radius from `--sc-r-control` to `--sc-r-lg`.
- Recede: when presented/max, the rest of the shell scales slightly and dims (`scale(1.03)` / `brightness(0.72)` on the recede wrapper), same as Compass.
- Reduced motion: duration 0.
- Escape, scrim click, and a control on the region bar dismiss. Maximize control on the region bar, not only in Compass.
- The iframe must survive the transform (keep it mounted; do not reload SmartSite on every expand).

Collapsed size is a layout fix (part 1). Motion is part 2. Both are required.

**3. Remaining demo-city chrome so Bastrop can land later.**

Build against 30c layouts, honest-empty where there are no records. This is the template, so empty is correct. Missing chrome is not.

Must exist as designed screens, not only nav chips:

- Overview metric strip of four, empty until records exist (Needs a decision, Overdue reviews, Permits in flight, Meetings this week). Do not invent counts.
- Across departments source register: all nine roster lenses, not four of nine (design review E).
- Assets: chrome-complete inventory per 30c (tabs, header, actions, map region with city outline and **no asset layer**). Fixture asset record only behind an explicit Demo fixture label, never as live. G-24 stays zero. No Samsara paint.
- Plan Review as a Work product with one current nav item (design review C2). Prefer `/?work=review` as the product home; DS Review tab can mount the same console.
- Citizen: scoped light (`class="cz sc-light"`). Do **not** flip `document.documentElement.dataset.theme` (design review C3). Lookup must say it does nothing until a source exists (D2). No invented street.
- Not built lenses stay named: Public works, Parks, Police, Fire and EMS, Fleet. Add a one-panel honest-empty view if that is cheaper than a dead chip; do not paint vendor wallpaper.
- Records search stays Not built, but the top-bar search must not contradict it (D1): badge the search or disable it with the same vocabulary.
- Compass Maximize on a chrome-only sheet is a lie until the engine exists (D3): remove Maximize or label the sheet as chrome-only without a fake maximize.
- "Viewing as" is not a persona switcher (D4). Rename it or remove it.

Honesty vocabulary (design review B) is in scope if you touch those panels:

- Kill hardcoded "0 of 4" on Overview and the nav footer. Finance's four named sources may keep a real denominator. Quote the counting rule.
- Nav badge vs page-header chip must agree. Empty homes need a badge; "none" cannot mean both Mounted and Empty.
- Connections: six dispositions only (Mounted, Empty, Not built, Island, Killed, Not connected). No home printed as "none". No "twelve tiles" marked Mounted. Keep iframe-residual truth on Plan review rows. Zero `Bastrop` on that page.

Still homeless from the layout inventory (design review F): name a home, do not build the engine.

- Print / PDF export
- Feedback (screenshot plus category)
- Municipal court: deliberate ruling (Not built on Connections is acceptable; say so)

**4. Kit and identity invariants.**

- `web/shell.css` (and any new CSS) declares zero hex, zero `rgb()`, zero `:root` tokens.
- No `compose-form`. No `$0`. No sample rows. No hydrant. No Samsara on Assets.
- Environment badge stays Demo.
- Gold parcel `48021:34137` stays a demo fixture on SmartSite, not "Bastrop onboarded."
- Forbidden product strings in shipping chrome: `permitflow`, `CitizenConnect`, `leaflet`, `pipedrive`, `stripe.com`.
- Tests: `npm test` in the Dashboards worktree. CI check-run conclusion must be the string `success` before merge. Planner owns merge and Cloud Run.

### Done looks like

A grader can walk the demo city and see every Bastrop-needed product surface as a home. Maps start in today's rails and expand with Compass motion. Iframes fill their regions with one shell, not two. Empty states still explain themselves. Light QA is shape and spacing, not missing screens or broken mounts.

### Out of scope

New adapter grants. Clerk calendar retarget. G-52 MyGov. G-24 ingest. Live Bastrop `/permitflow/*` or Leaflet cuts. Compass answer engine. Staff session / People and access as a real auth product. Atoms `--apply`. L26 slot.

### How to report back

File a short inbox note: mounts table (four iframes, before/after sizes), map motion states proven, list of 30c layouts now present vs still Not built, any WDLL items you need approved before merge. Do not merge. Do not deploy. Planner owns those.
