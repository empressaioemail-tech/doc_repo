---
id: 2026-08-18_g88_design_into_apps_WDLL
title: WDLL — Lane B G-88 design into the apps
status: approved
last_updated: 2026-08-18
applies_to: smartcity
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _inbox/2026-08-18_g88_surface_inventory,
    _inbox/2026-08-18_g88_translation_boundary,
    _inbox/2026-08-18_g88_shell_css_cache,
    _inbox/2026-08-18_g88_css_families_investigation,
    _decisions/2026-08-17_smartcity_visual_law,
    30b_smartcity_design_system,
  ]
---

# WDLL: Lane B G-88 design into the apps

Date: 2026-08-18  Status: **approved**
Operator approval: 2026-08-18 (operator: "approved", on the card as written including the item 8 re-sequencing and the three rulings G1, G2, G6)
Plan row: **G-88** (OPS-17, scoped at A-070). Housing: `empressaioemail-tech/smartcity-dashboards`, with a re-vendor leg into `empressaioemail-tech/smartcity-kit`.

Instrument: the deployed surface walked with GET, plus the product's own class gate once hardened. A merged PR is not a grade.

## Three operator rulings this card rests on

Ruled 2026-08-18 before the card was written, because each changes what an executor builds.

**G1, the type floor holds.** 30b's own CSS sets `.cite em` at 11px, `.cite.model .corpus` at 10px and `.mxgroup .lic` at 10px. The product ships zero sub-12px declarations in 827 lines and already resolved this conflict once by shipping `.prov` at 13px where 30b says 11px. The port raises all three to 12px. The consequence is accepted and named: 30b's own specimens stop matching what ships, and 30b is now the looser document.

**G2, 30b governs the CSS and 30c governs atomchip markup.** The two docs diverge in five places with no stated precedence, including `.mxrow` at 132px versus 108px and `.cite.model:hover .sect` present in one and absent in the other. Every divergence resolves to 30b. 30c supplies atomchip markup only, because 30b carries none.

**G6, a fourth family ships.** `finding` / `basisline` / `meter` joins the three. It is specified in the same 30b section as the matrix, it composes `.cite` and `.prov`, and it is the unit of a comment letter. Shipping a matrix and a citation without the row they compose into leaves the design agent to invent the assembly, which is the exact failure the wrapper exists to prevent.

## As-found, measured 2026-08-18

`smartcity-dashboards` at `cdfca39`, clean, 185 tests passing, deployed bytes sha256-identical to main on all four shipping assets. `smartcity-kit` on main at `93f2e6b` after G-86 and G-87 merged, 74 tests passing, 27 of 27 injected violations firing.

Four investigations were run before this card was written. Three of them contradicted a premise the row was scoped on, and those corrections are carried below rather than buried.

**The CSS already exists.** All four families are fully written, token-only, in 30b's own `<style>` block. This is a port of roughly 26 rules, not a design job, and it needs **zero new tokens**. `--sc-atom` and `--sc-atom-wash` already ship in all three theme blocks. That is what makes item 2 a Dashboards PR rather than a product-line ruling across three repos.

**Nothing unstyled is shipping.** No product markup references any of the twelve class names, so there is no cleanup leg.

**The translation is not lossless.** A kit composition emits zero `id` attributes, zero `hidden` branches and zero `data-*` hooks. The product carries 94 ids page-wide and `app.js` makes 33 `getElementById` calls against them. The existing parity proof normalizes away exactly `id`, `hidden` and every non-class attribute before comparing, so it is silent about the gap by construction and its nineteen green tests were never evidence either way. Item 7 exists because of this.

**The cache defect does not block anything.** Measured with a real Chrome on a persistent profile against the live service, in three scenarios including a full browser restart and an in-session deploy: the returning browser fetched fresh CSS and rendered the new value every time. With no `Last-Modified` there is no basis for heuristic freshness, so Chrome revalidates, and with no validator that degrades to a full GET. The defect is inverted from the one recorded at A-061: never stale, and 145 KB re-transferred on every navigation with a `304` structurally impossible. Item 8 keeps the fix and drops its blocker status.

**One-PR-per-surface is logical, not physical.** All fifteen surfaces live in one `web/index.html` and share one unpartitioned `shell.css`.

## Done looks like

Nick opens the deployed dashboards, walks the surfaces named in item 9, and sees a design pass that used only classes the product already ships. The three families a Plan Review screen needs are real CSS rather than something a design agent invented. Every screen that renders can also be driven, because the ids and hidden branches `app.js` addresses are still attached and a test says so. The honest-empty surfaces are still honest-empty. Live Bastrop was never touched.

## Acceptance items

1. **Operator approves this card.**
   | check: this file carries `status: approved` and a dated `Operator approval:` line.
   | grade: [ ]
   | depends on: none

2. **The four CSS families ship into `smartcity-dashboards`.** `cite`, `mx*`, `atomchip`, and `finding`/`basisline`/`meter`, ported from 30b's `<style>` block into `web/shell.css` under rulings G1 and G2.
   | check: every class name greps in `web/shell.css`; `web/sc-kit.css` is byte-unchanged by git blob hash; zero `--sc-` declarations added to `shell.css`; zero font declarations below 12px in `shell.css`; the existing type-conformance, hidden-rule and `ui.test.mjs` suites stay green; the five 30b-versus-30c divergences are each named in the close with the value shipped.
   | grade: [ ]
   | depends on: 1

3. **The product's class gate is hardened BEFORE any screen ships.** Port the kit's comment-stripping counting rule over the product's weaker one, widen the scan from two sources to all five, and derive the scan list from `server.mjs`'s `sendFile` calls rather than hardcoding it.
   | check: an injected `class="hidden"` FIRES, where today it does not because the product's rule counts words appearing only inside CSS comments; an injected `class="mx-card"` fires; the scan covers `web/index.html`, `web/app.js`, `src/shell-homes.mjs`, `src/staff-map.mjs`, `src/staff-review.mjs`; both the clean arm and the injected arm live in the same test so an unrun check and a passing check cannot look alike.
   | grade: [ ]
   | depends on: 1

4. **The denominator is recounted, not forecast.** After item 2 merges, re-run the kit's counting rule and update the pin.
   | check: `gate3-classes.test.mjs` pins the recomputed number and passes; the close quotes that number and states the counting rule beside it. **138 is an estimate and is not the acceptance value**; the two investigations disagreed (117 versus 128 versus 138) and the recount is the only authority. The 109 pin failing on merge is the gate working, not a regression.
   | grade: [ ]
   | depends on: 2

5. **The kit wraps the four families and the bundle re-syncs.** Re-vendor `sc-kit.css` and `shell.css`, rebuild, wrap each family as components, re-upload the delta.
   | check: vendored copies byte-identical to the product by git blob hash; `package-validate.mjs` exit 0; `prove:gates` still 27 of 27 plus any new cases; the DesignSync delta uploads sentinel first and `_ds_sync.json` last and alone; `list_files` reconciles against the new expected count; the coverage claim is restated against the recounted denominator from item 4.
   | grade: [ ]
   | depends on: 4

6. **Screens are designed in the Design project from kit components only.**
   | check: each screen's composition names only exports from `window.SmartCityKit`; no screen introduces a class outside the recounted vocabulary, which item 3's gate now enforces at merge.
   | grade: [ ]
   | depends on: 5

7. **The addressability layer is re-attached, and a test proves it.** This is the item no existing instrument covers. A translated screen renders correctly and cannot be driven, and it would pass every gate in both repos.
   | check: for every surface shipped under item 9, every `id` that `app.js` addresses via `getElementById` or `querySelectorAll` is present in the shipped markup, every `hidden` branch the surface previously carried is still present, and every `data-lens` / `data-work` / `data-stage` / `data-disposition` hook survives. A test asserts this by extracting the addressed set from `app.js` and diffing it against the served HTML, and it is watched failing against a removed id.
   | grade: [ ]
   | depends on: 3

8. **The static-asset cache contract ships and is proven.** `cache-control: no-cache` plus a strong content-hash `ETag` on all six served assets. Re-sequenced as NOT a blocker per the measurement above.
   | check: three HTTP legs against the deployed service. A plain GET advertises `cache-control: no-cache` and an `etag`. A conditional GET with that etag returns `304` with no body. **A conditional GET with a STALE etag returns `200`, a full body, and a DIFFERENT etag.** The third leg is the one that can fail: a constant or hardcoded etag causes permanent staleness and passes the first two. Plus a returning-browser measurement showing a restarted browser costs headers-only on an unchanged deploy and re-downloads only the changed file after one.
   | grade: [ ]
   | depends on: 1

9. **Each surface ships as its own PR, merged serially.** Surfaces, in merge order from the bottom of `index.html` upward so earlier line offsets stay stable: the seven roster shells as ONE PR (Public works, Parks, Police, Fire and EMS, Fleet, Records search, People and access), then Assets, then Connections, then Finance, then Citizen, then Development services, then Overview, then chrome.
   | check: each PR states which classes it used and asserts none is outside the vendored stylesheet; each passes item 3's gate; PRs merge one at a time with a rebase between. Connections is changed at `connectionsRegisterHtml()` in `src/shell-homes.mjs` and re-baked, never by editing the HTML, because the next bake silently reverts a hand edit.
   | grade: [ ]
   | depends on: 6, 7

10. **The deployed surface is walked.** A grade is a live probe, never a merged PR.
   | check: GET each shipped surface on the deployed service, on `template-city` and again on `?cityKey=empty-city`; HEAD returns 404 on this service so probe with GET; the serving revision is read and quoted.
   | grade: [ ]
   | depends on: 9

11. **Standing constraints hold.** Live Bastrop no-touch. No adapter grant, `grantedAdapters` stays empty on every pack. No G-52. No G-24, and city-owned asset records stay at zero. L26 untouched. `permitflow`, `citizenconnect`, `leaflet`, `pipedrive` and `stripe.com` appear nowhere in shipping files. No real city asserted as content, and no city name hardcoded into markup, which stays on the fallback vocabulary. The sixteen honest-empty states enumerated in the surface inventory stay empty, and every `.basis` line survives, because removing one to tidy a layout is a substantive change rather than a cosmetic one.
   | check: greps over `web/` and `src/`; the honest-empty list walked surface by surface on both packs; `GET /api/city-identity` shows `granted 0 of 7` on every pack.
   | grade: [ ]
   | depends on: 1

## Out of scope

Recolouring or re-typing. `web/sc-kit.css` is byte-identical across three repos and its header says a repo that edits a token value has forked the system, so any new colour or type-ramp change is a product-line decision, not this card. This is a layout, hierarchy, spacing and density pass inside a fixed palette.

Plan review and Files as design targets. Both are pure iframe mounts; the only restylable surface is the region frame, and everything inside the iframe belongs to another product.

React in the products. No build step. No bundler.

`.prov.stale`, which is missing from a shipped load-bearing component so a stale source currently renders identical to a current one. It is a live honesty defect, it is NOT one of the four families, and it wants its own row.

`roster-lens`, a class shipped on five sections and defined in neither stylesheet. The fix is deleting it from the product; it currently holds permanent amnesty in two exclusion lists and should carry a deletion ticket instead.

The forbidden-string gate not scanning CSS. Its walk is `.mjs`, `.js` and `.html` only, so a vendor name in a `shell.css` comment would pass. G-88 is the card that adds CSS, so this is worth knowing, but widening it is its own row.

The runtime-class extractor's blindness to classes passed as function arguments, which makes its reported set 18 where the true set is 20.

Feeds, adapters, tenancy, and anything on live Bastrop.

## Sequencing note the operator should accept or reject

The dispatch ordered the cache fix third and ahead of the design pass, on the stated reasoning that landed design changes would otherwise be invisible to a returning operator. That reasoning was measured and is false. This card therefore re-sequences item 8 as parallel and non-blocking, and lets item 6 begin as soon as items 2 through 5 land. Nothing else in the order changed. If the operator prefers the original sequence it costs only wall-clock, not correctness.
