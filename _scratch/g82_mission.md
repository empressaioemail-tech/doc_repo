# Card

Build the SmartCity kit as a typed React wrapper over the existing class vocabulary, so a design agent can build screens out of the real parts. This is the prerequisite for syncing the design system to Claude Design; nothing about that sync is in this card.

Housing: **`empressaioemail-tech/smartcity-kit`**, created empty and public by the planner on 2026-08-18. Clone it fresh under `P:\tmp` and build it out on branch `g82/kit-wrapper` from the empty default branch. Node 22+.

Source of truth for the vocabulary is `empressaioemail-tech/smartcity-dashboards` on `main`: `web/sc-kit.css` (the kit), `web/shell.css` (product chrome), `web/index.html` (every component in real use), `web/app.js`. Clone that read-only as your reference. **Do not modify smartcity-dashboards in this card.**

# The ruling you are implementing

`_decisions/2026-08-18_smartcity_kit_component_package.md`, active, amended 2026-08-18 before implementation. It amends `30b_smartcity_design_system.md` section 4, which had said the kit ships as one file with no package to version.

The package is a typed wrapper that renders existing kit classes and **owns no styling**. `sc-kit.css` stays the single source of truth for the design. Read the ruling in full, including the amendment note explaining why gate items 1 and 4 were rewritten.

The four-part gate, each enforced by a test you write:

1. The package declares no `--sc-` token of its own. It may carry the canonical token block, and if it does that block is byte-identical to `30b` section 4.1; every other token declaration is a fork.
2. No component file contains a hex color, an `rgb()` value, or a hardcoded px radius or duration.
3. Every class a component emits exists in `sc-kit.css` or the product stylesheet.
4. The package adds no CSS rule of its own. It ships the kit and renders its classes.

Gate 3 is the one that will catch real mistakes, so make it structural: extract the class strings your components actually emit and check each against the stylesheets, rather than maintaining a hand-written list that goes stale.

# Build

**Coverage is the whole shipped vocabulary** (operator ruling): roughly 110 classes across `sc-kit.css` and `shell.css`, which should land as about 18 to 22 components. A partial kit is worse than none, because the design agent invents whatever is missing and that is the failure this package exists to prevent. Enumerate the vocabulary from the stylesheets first and report anything you deliberately leave out with a reason.

Components must map 1:1 onto markup that ships today. `web/index.html` is the reference for every one of them: if the shipped markup wraps a thing a particular way, the component wraps it that way. Do not improve the markup, do not rename a class, do not add a wrapper element that the product does not have.

Requirements:

- React components, TypeScript types emitted as `.d.ts` per component.
- esbuild to `dist/`, with `main`, `module`, `types` and `exports` correctly set in `package.json`. Package name `@empressaio/smartcity-kit`, matching the `@empressaio/atom-contract` convention. **Do not publish to npm in this card.**
- React as a peer dependency, not a bundled one.
- `sc-kit.css` copied in byte-identical from smartcity-dashboards, with a test asserting the copy still matches its source. State in the README that it is a copy and which file is canonical.
- A usage example per component, drawn from real shipped screens rather than invented. The fixture pipeline on `template-city` gives you populated `.dt` rows, all four `.pill` severity states, and `.metric` tiles with real counts; the roster lenses give you the honest-empty `.state` and `.basis` shapes. Use those.

# What the design system requires of you

Read `30b_smartcity_design_system.md` before writing components, in particular:

- **Law 3, quiet on satisfied and loud on unresolved.** Pass is gray; Uncertain and Unchecked carry the strongest treatment. A `Pill` component whose API makes it easy to render a satisfied thing loudly has encoded the inverse of the system's law. Think about what your prop names make easy.
- **Section 1.3, the type ramp and the 12px floor.** The package adds no CSS, so it cannot violate this directly, but a component that takes a `size` prop and maps it to something off-ramp can. Do not offer sizes the ramp does not have.
- **Section 1.6, the elevation ruling.** A resting panel has no shadow and is defined by its 1px border. Do not offer an `elevation` prop on `Panel`.
- **Never-bare confidence and provenance.** `Prov` exists to carry a source; an API that lets a number be rendered without its basis works against the thing the system is for.

# Constraints

- Do not modify `smartcity-dashboards`, `plan-review`, `smart-files`, or anything under `smartcity-os-prod`.
- Do not publish to npm.
- These strings must not appear in shipping files: `permitflow`, `CitizenConnect`, `leaflet`, `pipedrive`, `stripe.com`. For `Bastrop` and `Chestnut` the rule is that a shipping file must not **assert** them as content; a refusal guard or a leak-detector needle that names one in order to reject it is correct and expected. Do not treat their presence as automatically a defect, and do not add either as content.
- No sample city data in examples beyond what the fixture pack already generates, and any example record stays marked as fixture.

# Verify before reporting

1. The package builds, and `npm test` passes. Include a test that imports from the built `dist/` rather than from source, so a broken build fails rather than passing on source resolution.
2. **Render the components and look at them.** A type-checking build proves the API compiles, not that a component renders the right markup. Stand up a minimal harness, render every component, and compare against the same element in the shipped product. Use `C:\Program Files\Google\Chrome\Application\chrome.exe` with `--headless=new --disable-gpu --no-sandbox --hide-scrollbars --virtual-time-budget=10000 --screenshot=<path> <url>` and read the images. Every verification command must exit on its own; kill any background server you start.
3. For at least one composed screen, render it from your components and compare against the real page it mirrors. A kit that renders each part correctly and cannot compose a screen has not been proven.
4. Run the four gate tests and confirm each was watched fail before it passed.

# Report

PR number, CI conclusion string if the repo has CI (it is new, so say so if it has none rather than implying a gate that does not exist), the close artifact path, the component inventory with the classes each covers, anything in the vocabulary you deliberately left out and why, what the rendered comparisons showed, how each of the four gate items is enforced and by which test, and — required — **every code path your tests do not exercise, naming any that differs between a local run and a consumer installing the built package.**
