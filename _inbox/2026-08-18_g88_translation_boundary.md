---
id: 2026-08-18_g88_translation_boundary
title: G-88 investigation — where the React-to-static translation stops being lossless
status: active
last_updated: 2026-08-18
applies_to: smartcity
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _inbox/2026-08-18_g88_surface_inventory,
    _decisions/2026-08-18_smartcity_kit_component_package,
  ]
---

# G-88 investigation: the translation boundary

Read-only investigation, fanned at G-88 scoping (A-070). The claim under test is the one A-070 rests on: because the kit adds zero styling and every component wraps classes that already exist in the shipping stylesheet, a design composed only of kit components is by construction expressible as the exact class markup the product already serves, and the translation is therefore mechanical and lossless in one direction.

## The verdict

**The class-level claim holds and is already machine-proven. The screen-level claim does not hold.**

A kit composition is guaranteed to emit only classes the product's stylesheet defines. That gate is structural and it fires. But a kit composition is not a complete product screen: it renders zero `id` attributes, zero `hidden` branches, and zero `data-*` behaviour hooks.

The reason this was not already known is worth stating on its own, because it is the same failure shape this program keeps finding. `test/_markup.mjs` reduces both sides to a normalized shape string before comparing, and what it normalizes away is exactly `id`, every element carrying `hidden`, and every non-class attribute. **The parity proof is silent about the missing layer by construction.** It could never have reported this, and a green suite was never evidence either way.

Translation is mechanical for what the browser paints, and lossy for what `app.js` can address.

## Measured, not estimated

The three composed kit screens emit 0 `id` attributes and 0 `hidden` elements. The product carries 23 ids on those same three regions, 94 distinct ids page-wide, and 14 hidden elements page-wide, and `app.js` makes 33 `getElementById` plus 10 `querySelectorAll` calls.

For the top bar alone, the delta after a perfect class-level translation is six ids, two hidden elements the kit does not render at all, one `aria-describedby` wiring, and one inline `display:none`. The sidebar additionally needs `data-lens` or `data-work` on all fifteen nav items.

So the honest description of the work is: **class markup is a copy-paste; the addressability layer is a manual re-attach of roughly 23 ids and 14 hidden branches across the three composed regions.** That is bounded and rote. It is not lossless, and a plan that calls it lossless will under-scope every surface PR.

## Parity reach is 18.4 percent

Nineteen parity tests pass. They cover 13 of 73 components with a named single-component case, and three composed screens totalling 251 of the page's 1363 elements. That is one lens of fifteen. The other 60 components are proven only by gate 3, which asserts their classes exist, and have never been compared against real product markup.

Vendor pinning is sound: all four vendored files match the product byte for byte by git blob hash.

## Four holes worth the operator's attention

**The largest section's severity colour is outside the kit's typed surface.** `shell.css` colours the connections register entirely off `data-disposition`, and `data-disposition` appears nowhere in kit source. Attribute selectors are not counted by the class rule, so gate 3 would never notice its absence. `work-connections` is the single largest section of the page at 446 elements. Nine attribute selectors carry style that the 109 does not count, including both theme classes' `data-theme` forms and `[disabled]`.

**Seven components are attribute or structure wrappers, not class wrappers.** `DataHead`, `DataHeadCell`, `DataBody`, `DataRow`, `DataCell`, `KeyValue` and `Tab` render bare elements or a fragment with no class at all. `Tab` is styled by `[aria-selected="true"]` and therefore contributes zero to the 109 while being a real design surface. The sentence "every component is a typed wrapper over classes" is false for these seven.

**The product's own class gate has a live hole.** Its counting rule does not strip CSS comments, so six words that appear only inside comments are falsely counted as shipped: `css`, `hidden`, `html`, `md`, `mjs`, `test`. An injected `class="hidden"` does not fire the product gate; the kit's rule catches it. This was proven by injection in memory, both arms.

**The scan covers two of five markup sources.** `web/index.html` and `web/app.js` are scanned. `src/shell-homes.mjs` generates `class="srcreg"` markup as a server template and reaches the scan only through a bake step whose output is never byte-asserted, so a class change without a re-bake ships stale and passes every test. `src/staff-map.mjs` and `src/staff-review.mjs` are served to the browser and are unscanned; they assign no classes today. The scan list should be derived from `server.mjs`'s `sendFile` calls rather than hardcoded, so a new served asset cannot dodge it.

Also: the runtime-classes extractor reads only literal `className =` assignments, template heads and `classList` first-args, so it is blind to classes passed as function arguments. `app.js` assigns `id` and `subj` through a `td(value, className)` helper, so the true runtime set is 20 and the extractor reports 18.

## The acceptance test already exists

`src/ui.test.mjs:352`, "composes existing kit classes and declares no new one", is passing today. The G-88 acceptance item is a **hardening** job, not a build: port the kit's comment-stripping counting rule over the product's weaker one, widen the scan to all five sources derived from `sendFile`, and add the injected-violation arm so an unrun check and a passing check cannot look alike.

It must live in the product repo, because that is where screens merge and a kit-side gate blocks nothing at the moment of merge. Keep the kit's vendor-parity arm B as the second independent statement, and have it assert that the two counting rules produce identical sets so they cannot drift apart silently.

Do not import `stylesheetClasses()` from the kit. It is not exported, and depending on the kit would add an npm dependency to a repo whose only dependency is `pg`. Port the eight lines and name the kit as their source.

## The denominator: 117 is a floor, not a prediction

The counting rule is: read the two vendored stylesheets CRLF-normalized, strip comments, match every `.` followed by an identifier, deduplicate. It is pinned at 109 in `gate3-classes.test.mjs` and the pin fails the moment the vocabulary changes size. The rule was audited for false positives and has none.

`mx*`, `cite` and `atomchip` exist nowhere today, in either repo. If the CSS ships exactly the eight class names the conventions header enumerates, the denominator becomes 117. **Treat that as a floor.** The rule also counts element-scoped children, and every existing family brought them: `.srcreg` brought `.rail` and `.nm`, `.metric` brought `.k` `.v` `.n`, `.state` brought `.st-k`. A real applicability matrix will almost certainly bring header and cell children the conventions list does not enumerate.

So the honest statement is derived rather than forecast: after the CSS merges, re-run the rule, update the pin, and quote the number it returns. Do not publish 117 beforehand. The one thing certain now is that the pin will fail on merge and force the recount, which is the gate working.

## One product defect found in passing

`roster-lens` ships on five sections, is defined in neither stylesheet, and is read by no code. The kit cannot emit it, gate 3 would fail any component that did, and the parity normalizer drops it. The fix is deleting it from the product, not adding it to the kit. It currently sits as the sole permanent entry in two exclusion lists and should carry a deletion ticket rather than amnesty.

## Consequence for the plan

Leg 3 is not blocked, but step 5 must be re-worded. "Translate to static markup" is two jobs: a mechanical class-markup transcription, and a manual re-attach of the addressability layer that no instrument currently checks. The second one needs its own acceptance item, because nothing in the parity suite can tell you it was done, and a screen that renders perfectly and cannot be driven by `app.js` will pass every gate in both repos.
