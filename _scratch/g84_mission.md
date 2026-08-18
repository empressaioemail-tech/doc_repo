# Card

Ship the design system's two typefaces from the kit, so anything built with the package renders in the system's own type rather than a fallback.

Housing: `empressaioemail-tech/smartcity-kit`. Clone fresh under `P:\tmp`, branch `g84/ship-fonts` from `origin/main`. Node 22+. Do not modify `smartcity-dashboards`.

# The defect

`vendor/sc-kit.css` declares `--sc-font-ui: "Inter", …` and `--sc-font-data: "IBM Plex Mono", …`. The package ships neither family and no `@font-face`, so `package-validate.mjs` in the design sync reports:

```
! [FONT_MISSING] "Inter", "Inter Variable", "IBM Plex Mono", "Cascadia Mono" referenced by
  the shipped CSS but no @font-face ships them
```

The product itself gets away with this: `smartcity-dashboards/web/index.html` loads both from a Google Fonts `<link>`. Nothing built from this package has that link. Every design an agent builds, and every consumer app that imports the kit, renders in a system fallback — which silently discards the type ramp that G-76 existed to fix, and does it in a way no test downstream catches.

# The ruling, as amended today

`_decisions/2026-08-18_smartcity_kit_component_package.md` gate item 4 previously forbade the package adding any CSS rule, which forbade the `@font-face` that fixes this. It now reads:

> The package adds no CSS rule of its own, with one bounded exception: it may ship `@font-face` rules, and only those, for families the canonical token block already names in `--sc-font-*`.

Read the amendment note in full. The boundary is the point: a font file is not a design decision being forked, because the families are already declared in the canonical token block and shipping them fulfils that declaration. Your job includes making that boundary mechanical.

# Build

1. **Obtain the font files.** Inter and IBM Plex Mono are both SIL Open Font License, so redistribution is permitted; include each family's `OFL.txt` alongside the files and record where each came from. Prefer `woff2`. Ship the weights the product actually uses and no more — read them from the Google Fonts URL in `smartcity-dashboards/web/index.html`, which is the authoritative statement of what the product loads. Do not ship the full variable range if the product asks for named weights.
2. **Emit `@font-face` from the build**, as its own stylesheet, with `font-display: swap` and `src` paths that resolve relative to the shipped file. Do not put `@font-face` inside `kit.css`: gate 4 asserts `kit.css` is byte-exactly its two registered copies in order, and that assertion is load-bearing.
3. **Decide and state how a consumer gets the fonts.** A separate export they import, or folded into the existing `kit.css` import, is your call — but the README's install section is the contract and must say exactly what to import, in what order, and what happens if they skip it. The current README's ordering paragraph is the model.
4. `Cascadia Mono` is a system font in the `--sc-font-data` fallback stack and is not ours to ship. Say so in the README rather than leaving it looking forgotten.

# Make the boundary mechanical

Extend gate 4 so the exception cannot widen:

- The fonts stylesheet contains **only** `@font-face` rules — any other rule fails.
- Every `font-family` it declares appears in a `--sc-font-*` value in `vendor/sc-kit.css`. A family the token block does not name is a fork.
- Every `src: url(...)` resolves to a file the package actually ships.
- `kit.css` byte-equality is untouched and still passes.

Watch each new assertion fail before you trust it — inject a real violation (a non-`@font-face` rule in the fonts sheet, a family the tokens do not name, a dangling `url()`), confirm it fails and names the violation, then restore. `npm run prove:gates` is the existing harness for exactly this; extend it rather than testing by hand.

# Constraints

- Do not edit `vendor/sc-kit.css` or `vendor/shell.css`; they are byte copies and `test/vendor-parity.test.mjs` guards them.
- Do not add a component, a class, or any rule that styles a component.
- Do not publish to npm. Do not add a LICENSE file — licensing is held for an operator ruling; the fonts' own OFL texts are not that and should be included.
- These strings must not appear in shipping files: `permitflow`, `CitizenConnect`, `leaflet`, `pipedrive`, `stripe.com`. For `Bastrop` and `Chestnut`, a shipping file must not **assert** them as content; a refusal guard or leak-detector needle that names one in order to reject it is correct and expected.

# Verify before reporting

1. `npm test` passes, including every test you did not write.
2. `npm run prove:gates` — every injected violation caught and named, including your new ones.
3. **Prove the fonts actually load.** Render a page that uses both families through headless Chrome (`C:\Program Files\Google\Chrome\Application\chrome.exe`, `--headless=new --disable-gpu --no-sandbox --virtual-time-budget=8000`) and check `document.fonts` reports them loaded, and that measured text metrics differ from the same string in a system fallback. A stylesheet that parses is not a font that loaded. Every command must exit on its own; kill any server you start.
4. Confirm `dist/kit.css` is still byte-exactly its two registered copies.

# Report

PR number, CI conclusion string, close artifact path, which files and weights you shipped and from where, what a consumer must import and what the README now says, how each new gate assertion is enforced and the violation you watched it catch, the measured evidence that both families actually loaded, and — required — every code path your tests do not exercise, naming any that differs between a local run and a consumer installing the built package.
