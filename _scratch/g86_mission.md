# Card

Finish the first design sync of `@empressaio/smartcity-kit`. Seventy remaining preview cards, conventions header, incremental upload.

Housing: `empressaioemail-tech/smartcity-kit`. Working clone `P:\tmp\g82v` on `main` after PR #4 squash `8ef0203`. Node 22+. WDLL `_inbox/2026-08-18_g86_previews_WDLL.md` items 2 through 6.

# As-found

Project SmartCity Product Kit `f5e5465e-943f-4f68-b52f-608925bc07b0` created, pinned, empty. Converter clean: 73 components, 43 KB bundle. Authored and graded good, carrying forward: Pill, State, MetricStrip. Remaining: 70. `dist/` is gitignored; build first. Playwright pin is 1.57.0.

# Authoring

Compositions already exist in `examples/gallery.tsx`: one GALLERY entry per component with `covers`, `from`, and a real `node`. Porting means splitting that JSX into named exports in `.design-sync/previews/<Name>.tsx`, 2 to 3 cells, fixture content kept. Worked examples: Pill.tsx, State.tsx, MetricStrip.tsx. Import from `@empressaio/smartcity-kit`, not from `examples/`. Layout shells that gallery shows as `{null}` take their children from `examples/screens.tsx` (TopBar, Sidebar, OverviewHeader, CompassPanel) inlined as kit composition.

# Fan rules

Disjoint component sets. A subagent edits only its own `previews/<Name>.tsx` and its own grade files. Never run `package-build.mjs` or `package-validate.mjs`. Use `lib/preview-rebuild.mjs --components <theirs>` then `package-capture.mjs --components <theirs>`. Config, NOTES, and conventions edits are planner-only. A config-level root cause is the planner's to fix globally. Never write a grade for a sheet you have not read this iteration. Do not set `cfg.provider` to Theme with `mode: "dark"`.

# Then

Author `.design-sync/conventions.md` and set `readmeHeader`, then rebuild so the README carries it. Dark is the staff default; tell the design agent to set `data-theme="dark"` on the root. Upload incrementally into the empty project. The live demo city at `smartcity-dashboards-00017-vx4` is a different surface.

# Standing

Live Bastrop no-touch. No adapter grant. No G-52. No G-24. `permitflow`, `CitizenConnect`, `leaflet`, `pipedrive`, `stripe.com` must not appear in shipping files. `Bastrop` and `Chestnut` must not be asserted as content.
