# Card

Make the `hidden` attribute work product-wide, with one rule instead of another one-off patch.

Housing: `empressaioemail-tech/smartcity-dashboards`. Clone fresh to a new directory under `P:\tmp`. Branch from `origin/main` as `g81/hidden-works`. Node 22+, `npm install`, `npm test`.

You own `web/shell.css` and a new test file. A parallel lane (G-80) owns `web/index.html`, `web/app.js` and the rest of `src/`. **Do not edit those, and do not edit `web/sc-kit.css`.**

# The defect

The kit gives several components an explicit display: `.pill` and `.prov` are `inline-flex`, `.state` is `flex`, `.metric` is `flex`. The `hidden` attribute sets nothing but the UA default `display: none`, which a class rule of equal or greater specificity overrides. So `el.hidden = true` is inert on exactly the components most likely to be conditionally shown.

This is not theoretical. It shipped: the Overview Public meetings panel rendered an amber **Partial** pill directly beside the words "No meeting packet has been read". It has also been patched twice, one component at a time, in `web/shell.css`: `.stage[hidden] { display: none; }` and `.stage-esc[hidden] { display: none; }`. Two patches and a live defect is the signal that the per-component approach is the wrong shape.

# Build

One global rule in `web/shell.css` that makes `hidden` win over a component's own display, and retire the two per-component patches that it subsumes.

Think about specificity rather than guessing. `[hidden]` is one attribute selector; `.pill` is one class; they tie, so source order decides, and a later rule such as `.state { display: flex }` would beat a global rule placed early. Choose a form that holds regardless of where a future component rule lands in the file, and say in a comment why that form was chosen.

Do not remove any behavioural workaround in `web/app.js`. That file belongs to the other lane this wave, and the belt-and-braces is harmless. Note it in your report as a follow-up.

# Constraints

- `web/shell.css` must keep zero hex colors, zero `rgb()`/`rgba()`, zero `--sc-*` token declarations.
- The 30b type law still holds: nothing below the 12px floor. `src/type-conformance.test.mjs` already guards this and must stay green.
- Change no color, no radius, no duration, no type step. This card is one display rule and the deletion of the two it replaces.
- Do not add a component or a class family.

# Verify before reporting

1. `npm test`. All pass, including `src/type-conformance.test.mjs` and every test you did not write.
2. **Prove it renders, do not assert it from the stylesheet.** A static test that greps for the rule proves the text exists, not that the attribute works. Start the server on a free port in the background and drive headless Chrome at `C:\Program Files\Google\Chrome\Application\chrome.exe`. Measure `getComputedStyle` for a `hidden` `.pill`, a `hidden` `.prov`, a `hidden` `.state` and a `hidden` `.metric`, and confirm each computes to `display: none` while its non-hidden sibling does not. `--dump-dom` runs page scripts, so a probe that writes its measurements into the DOM and is read back is a workable harness. Kill the server when done; never run a command that does not exit.
3. Confirm nothing that should be visible became hidden: screenshot Overview, Development services, Citizen, Assets and Connections at 1600x1000 and **look at them**.
4. Add a test that fails if a new per-component `[hidden]` patch appears in `web/shell.css`, so the pattern this card retires cannot come back one selector at a time.

# Report

PR number, CI check-run conclusion string, close artifact path, the rule form you chose and the specificity reasoning behind it, the four measured `display` values, what the screenshots showed, and — required — **every code path your tests do not exercise, naming any that differs between a local run and the deployed service.**
