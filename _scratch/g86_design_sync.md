# G-86 design sync scratch

## GROUND-TRUTH 2026-08-18T21:15Z
Kit PR #4 merged squash `8ef0203f376107306595b26ccd75171965c66d51`. CI check-run `test` conclusion `SUCCESS` (run 32185143428). Clone `P:\tmp\g82v` on `main` at that SHA. `npm run build` emitted 27 files into `dist/`.

## GROUND-TRUTH 2026-08-18T22:50Z
73/73 capture jsons have every cell graded good (planner-read). W2–W5 ping timeouts recovered in place: no re-dispatch. Viewport 1100x700 also on ShellRegions and ShellTop. CompassGrab nested in CompassHead. Stage uses inline size standing in for the app.js anchor rect. Scrims sit over the city map region.

## GROUND-TRUTH 2026-08-18T23:05Z
Kit PR #5 open on branch `g86/preview-cards-and-conventions`, head `c935ad07dae7c7320c3eb37f68c2548632194108`, base `8ef0203`, CI run 32194013389 conclusion `success`, mergeable, NOT merged. 72 files: 70 previews + conventions.md + config.json. `package-validate.mjs` exit 0 — 73/73 render cleanly, zero floor cards, zero bad, **zero GRID_OVERFLOW**, anchor matches disk (73 hashes recomputed). 73 grade files / 155 cells / zero non-good. `npm test` 73 pass 1 skipped locally; CI ran vendor-parity arm B and it passed. Upload payload is 417 files (components 292, fonts 44, _preview 73, _vendor 2, plus 6 root files); `tokens/` and `guidelines/` are empty and that is correct.

## GROUND-TRUTH 2026-08-18T23:22Z
**The upload HAPPENED. This thread is closed; it was open across two sessions for want of a tool.** A Claude Code seat carrying DesignSync ran the mechanical STEP 2 replay from `_inbox/2026-08-18_b86_close.json`. Project `f5e5465e-943f-4f68-b52f-608925bc07b0` holds **417 of 417**, reconciled by prefix against the remote: components 292, `_preview` 73, fonts 44, `_vendor` 2, six root files, `tokens/` and `guidelines/` empty and correct. Sentinel first and alone, 416 content files in nine chunks, no deletes, sentinel re-armed, `_ds_sync.json` last in its own call. Zero write failures, zero retries, no chunk halving. `package-validate.mjs` re-run as preflight: exit 0, anchor matched disk on 73 recomputed hashes. The bundle was NOT rebuilt. Kit PR **#5** merged squash `d4f7b615b25f5ec79c3058ea28dfbae1b4515fa3`. Close `_inbox/2026-08-18_b86u_close.json`, plan row A-068.

Two things the upload did NOT settle, both recorded rather than absorbed. **Nobody has looked at the picker**: the uploading seat had no browser, and `_ds_needs_recompile` is still armed, so the app has not rebuilt its card index. Item 5's named check has two halves and only the `list_files` half was observed. And the count rose 0 to 416 to 417 across three listings, not in named batches, because there were no batches left; everything was verified on the green PR, so the run was one push.

**Reconciling BEFORE arming the anchor is the load-bearing move here, not a flourish.** The anchor vouches for everything beneath it, so a listing taken after it is armed cannot falsify it. A fresh anchor over a half-applied upload is permanent; an un-anchored project merely re-verifies on the next sync. Verify, then arm.

## LESSON
**Before a dispatch assumes a tool, check the seat's server list.** G-86 was issued twice on the belief that the executing seat carried DesignSync. Each mis-issue cost a session, and the second one was written by a planner who had the artifact proving the first failure. A dispatch that depends on a capability must open by proving that capability exists AND authenticates, and the proof is a read call against the real target, never a catalog listing alone. Here that was `get_project` returning the project name, `PROJECT_TYPE_DESIGN_SYSTEM` and `canEdit true` before any write.

## LESSON
G-85 was used as a kit PR title without an OPS-17 amendment row. A-065 closes that honestly: G-85 ADDED then CLOSED on the merge, G-86 ADDED for the remaining 70. Capture at 900px is on the kit's narrow breakpoint: isolated `position:fixed` nav photographs blank. Stamp `cfg.overrides.<Name>.viewport` to 1100x700 and full-build. Do not widen MenuButton.

## LESSON
**The sheet a grader reads is not the card the operator sees.** Grading reads per-story captures taken through `?story=`, which are full-bleed and therefore unaffected by `cardMode`. The card is the component HTML loaded at its declared viewport. Two cards (CompassScrim, StageScrim) rendered as an empty white box with `package-validate` reporting `bad=false, blank=false, collapsed=false, thin=false` and every grade `good`, because nothing in the pipeline ever looks at the card. Load `components/<group>/<Name>/<Name>.html` at `cfg.overrides.<Name>.viewport` and look. Candidate for a committed capture mode (follow-up F-2) — the throwaway script that found this was deleted.

## LESSON
**A `Region` outside `ColStack rail` collapses to height 0.** The rail is the kit's height home; six sibling previews use it. Without it `.region-canvas` keeps its `#E7EBEE` map ground and its mount note in the DOM but paints nothing, so anything layered over it (the two scrims, at 0.34 canvas) recedes nothing. Same failure family as "Stage uses inline size standing in for the app.js anchor rect": in the product these get height from the shell, and an isolated preview has no shell.

## LESSON
**`cardMode` is not in the grade key; `viewport` is.** So flipping a card to `column`/`single` carries grades, and stamping a viewport re-grades. Corollary learned the hard way: do NOT pass `--force` to `package-capture.mjs` to get fresh sheets after a `cardMode`-only edit. It clears verdicts by design; 15 files / 31 cells were re-graded for nothing. Without `--force` the changed preview content re-captures anyway.

## LESSON
**`.design-sync/` is invisible to the kit's own constraint gate.** `walk()` in `test/_lib.mjs` skips `ds-bundle`, `.ds-sync` and `.design-sync` at ROOT as `TOOL_OUTPUT_DIRS`, so `constraints.test.mjs` scans neither `conventions.md` nor the 73 previews. The skip was recorded correctly in kit PR #2 (a repo-wide scan read the converter's generated stylesheets as the package authoring CSS) — but the directory changed character at G-85 when authored source moved into it, and `conventions.md` ships verbatim inside the uploaded README. A vendor-brand violation sat there with CI green. Found by hand-grepping the durable set before opening the PR. Follow-up row F-1; do not fix it as a drive-by, it touches three scans.

## LESSON
**Check which list a forbidden string is on before ruling it a compliant refusal guard.** `test/constraints.test.mjs` keeps two and its header says they are not the same rule: `ASSERTION_ONLY` (`bastrop`, `chestnut`) may be named in order to be rejected; `ABSOLUTE` (`permitflow`, `citizenconnect`, `leaflet`, `pipedrive`, `stripe.com`) may not appear at all. The carve-out was written knowingly and withheld from vendors. "The gate forbids the compliant case" is a real pattern in this program and it did NOT apply here — the gate was right and the content was wrong. Reaching for the pattern reflexively would have granted a carve-out that is the operator's to grant.

## DEAD-END
Do not set `cfg.provider` to Theme with `mode: "dark"`. Renders broken, build passes. See kit `.design-sync/NOTES.md`.

## DEAD-END
Do not look for a non-MCP upload path. `.ds-sync/` has no HTTP client, no token, no CLI upload. `resync.mjs` computes the diff; the agent's DesignSync tool moves the bytes. Checked so the next context does not re-derive it.
