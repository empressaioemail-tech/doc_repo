# Interrupt note — G-86 W1 ping timeout

Stopped: [W1 foundation](b8fcf8c8-42f1-4f82-98af-8614708b8d45)
When: 2026-08-18 ~21:43Z, during `preview-rebuild.mjs` (PING timed out).
Disposition: SUPERVISED CONTINUATION, closed. Do not re-dispatch.

## Recovery (planner, 2026-08-18)

W1 14/14 captured and graded good this iteration: Theme, Text, Grow, Fill, Button, ButtonLink, MenuButton, Input, SearchField, Prov, Basis, Seal, BrandCity, EnvBadge.

Seal BesideName is wrapped in ShellTop because `.seal` is `display:grid` and stacks without the flex row.

Theme DarkSubtree is good on purpose: inner `Theme mode="dark"` is a subtree, not a page provider. A later worker grade that marked it needs-work was overwritten.

## LESSON

Capture viewport 900x700 sits on `@media (max-width: 900px)`. Isolated `.shell-nav.open` becomes `position:fixed` inside `.ds-single { transform }` and photographs blank. Fix: `cfg.overrides.<Name>.viewport: "1100x700"` then full `package-build.mjs` (targeted rebuild prints CONFIG_STALE). Applied to ShellNav, NavItem, NavGroup, ShellBody, ShellRecede. Do not apply to MenuButton: `.menu-btn` only paints at max-width 900px.
