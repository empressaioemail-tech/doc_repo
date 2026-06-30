---
date: 2026-06-19
agent: extension-agent
repo: hauska-brief-extension
branch: feat/shell-refinement
base: extension/unified-signin-v067 @ d8786b2 (v0.6.22 committed tip)
version: 0.6.22 (intentionally not bumped — see Version note)
dispatch: shell_refinement (sidebar/rail v2, dock, control cohesion, panel, brand)
status: code-ready — pushed to origin/feat/shell-refinement; operator screen captures owed
commit: 510f25a
---

# Close — UI shell refinement (rail v2, dock feel, control cohesion)

Scope was the UI shell only: deep-dive page chrome, the dock, the right rail, the
on-listing panel, controls. The map canvas and backend data are other agents and
were not touched.

## Branching — premise correction (read this first)

The dispatch assumed the map agent was isolated on its own branch and I could branch
off `extension/unified-signin-v067` in the shared clone. That premise was wrong on the
ground. In `P:\hauska-brief-extension` there is one shared working directory, no git
worktrees, and no separate map-agent branch (local or remote). The committed tip is
v0.6.22; the map agent's v0.6.24 work (the CSP fix plus the render rewrite in
gis-map-paint.js, site-map.js, gis-map-render.js, and incidental touches to
intel-panel.js and research-app.js) was sitting uncommitted in that shared tree, edited
within the hour. Branches isolate commits, not the working tree, so a plain checkout in
that directory would have dragged the map agent's uncommitted work onto my branch and
flipped the map agent onto my branch mid-edit.

Per operator answer, I created an isolated git worktree at
`P:\hauska-brief-extension-shell` on `feat/shell-refinement` from the committed v0.6.22
tip. The map agent's clone was never touched. All my work, build, and commit happened in
the worktree.

## Version note

I deliberately left manifest.json / package.json at 0.6.22. The map agent's uncommitted
work is 0.6.24; if I had bumped, manifest.json would be a guaranteed merge conflict.
Leaving it unchanged means the 3-way merge takes the map agent's version cleanly. The
integration owner should set the final version (e.g. 0.6.25) after merging map v0.6.24 +
this shell branch, then rebuild.

## What shipped

### 1. Sidebar / rail v2 (the "doesn't flow" fix)

Reordered the rail to lead with what is actionable, narrative last, matching the v2
proposal from the 2026-06-18 QA close and refining it:

  Property context chip  (new)
  At a glance            (verdict dots, moved up)
  Your buy box           (chips + keep / pass)
  Who you are            (operator profile, moved down)
  Blind spots            (now a collapsed <details>)
  Attachments
  "This profile is yours" footer

- **Property context chip** (new): a compact card at the top of the rail — street
  address, a tier-colored dot, and the matched jurisdiction. Anchors the rail to the
  active brief and is hidden in the empty state. Rendered by a new `renderRailContext()`
  in research-app.js, wired into `renderRailIndicators()` and the empty-state path.
- **Operator-profile box restyle**: the `.twin` card is now a calm brand-tint card
  (flat `--brand-tint` ground, `--brand-tint-border`, mono overline label) instead of
  the heavier gradient/inset slab. No black slab remains.
- **Blind spots collapsible**: wrapped in `<details>` with a styled summary + chevron,
  closed by default, and the section is hidden until real blind spots exist (no more
  empty heading flashing pre-render).
- **Rhythm**: consistent rail padding and a single `--sp-5` inter-section gap so the
  sections read as one scannable column rather than a stack of competing headings.
- **Cohesion win**: the "This week" nav tier dots (`.vdot`) had no color rule at all
  (dead since the markup moved to `.ri`); added deal/look/dead coloring.

### 2. Dock — make the resize/collapse actually feel right

- **Smooth widths**: registered `--dock-nav-w`, `--dock-rail-w`, `--dock-map-w` via
  `@property` so collapse/expand and map open/close animate the column widths smoothly.
  The transition is suppressed under `body.hauska-dock-resizing` so dragging stays
  instant (no lag chasing the cursor).
- **Grip affordance**: each resizer now shows a centered grip line on hover/drag (brand
  on hover), so the handle reads as draggable. Suppressed on a collapsed column.
- **Double-click to reset**: double-clicking a handle snaps that panel back to its
  default width (nav 264, rail 320, map 480), persisted to layout storage.
- **Map split / full-screen / Map tab seam**: unchanged contract. The dock continues to
  host and size the map and exposes `setMapOpen` / `showMapShell` / `setMapFullscreen`;
  the map agent's `renderSiteMap` drives them via `onExpandChange` / `onMapModeChange`.
  The Map tab markup + `.hp-spatial__tab` styling live in the map agent's files
  (site-map.js / site-map.css) — I did not reach into them; research.css only references
  `.hp-spatial__tab` for the full-screen hide it already owned. Map default width is 480
  and grows to min(72vw, 1100), so the map gets real width.

### 3. Control cohesion (prod-readiness bar)

Audited every visible control on both surfaces. Findings:

- Upgrade Pro ($29) and Max ($65), Manage subscription, settings, This week / reopen,
  attachments + Add, + Research a property, keep / pass, share, entitlement strip,
  panel run / capture / auth / deep-research — all already bound to real flows
  (verified against research-app.js, intel-panel.js, billing-api.js, entitlement-api.js).
  Dual-tier checkout is live (`startProCheckout` / `startMaxCheckout`).
- **Removed one visible stub**: the share modal's "Invite by email" input + button were
  `disabled title="Coming soon"`. Per "hide it, don't stub it," removed the row. The
  share link + copy + people-with-access remain.
- **Collaborators avatars**: `renderCollaborators()` hard-hides the button regardless of
  data, so it is not a visible no-op — left as is.

### 4. On-listing panel (shadow-DOM)

- Added a hairline divider above the secondary action row (`.hp-btn-row`: Deep research /
  + Research property / Share) so the primary "Run full brief" reads as primary and the
  secondary nav reads as secondary. Panel styling flows through `src/content/inject.css`
  (see Build architecture).

### 5. Visual cohesion

All new CSS uses Edition-02 tokens (`--sp-*`, `--r-*`, `--brand*`, verdict ramps,
`--font-mono` for overlines) from hauska.css. No new hard-coded hex except where matching
existing notice colors.

## Build architecture (for the next agent)

- `styles/hauska.css` and `styles/hauska-shadow.css` are **generated** at build by
  `scripts/sync-hauska-css.mjs` from `Hauska site/hauska.css` (the design-system source)
  plus `src/content/inject.css` (panel extras). Editing the generated files directly is
  futile — they are overwritten. Panel shadow-DOM styling = edit `inject.css`; design
  tokens/components = edit `Hauska site/hauska.css`.
- `research/research.css` is linked directly (not generated, not bundled) — edit in place.
- esbuild bundles `src/research/research-app.js` → `research/research-bundle.js` and
  `src/content/intel-panel.js` → `src/content/content-bundle.js` (committed outputs).

## Known follow-up (not done — flagged, not silently threaded)

`research/research.css` carries two accreted style layers: an Edition-02 layer (compound
selectors like `.hauska-workspace-rail.rail`) and an older single-class `hauska-*` layer.
The Edition-02 compound selectors win on specificity, so most of the legacy block is dead
code (e.g. `.hauska-recent-item`, legacy `.hauska-chat`, `.hauska-chat-form`,
`.hauska-chat-composer`). It is harmless (overridden) but confusing for future edits. I
left it untouched this pass to avoid removal risk; a dedicated dead-CSS purge is worth a
follow-up.

## Live verification

| Check | Result |
|-------|--------|
| `npm install` (fresh worktree) | exit 0 |
| `node scripts/build.mjs` | PASS — keyed public client injected |
| Rail/dock IDs referenced by JS present + unique in research.html | 28/28, no duplicate IDs |
| `renderRailContext` in built research-bundle.js | present |
| Generated hauska-shadow.css picked up panel divider | confirmed |
| No dangling refs to removed `hauska-invite-email` | confirmed (0 in src) |

No headless browser is available in the repo (no puppeteer/playwright/jsdom), so QA was
static/structural. Visual captures are operator-owed.

## Operator checklist (Load unpacked from P:\hauska-brief-extension-shell)

1. Open a listing → run a brief → **Deep research** → confirm the rail reads top-to-bottom:
   context chip (address + colored dot + jurisdiction) → At a glance → Your buy box →
   Who you are (calm brand-tint card, no black slab) → Blind spots (collapsed) → Attachments.
2. Drag the nav / rail / map handles — confirm the grip line appears and the resize feels
   instant; release and collapse a column — confirm it animates smoothly.
3. Double-click a handle — confirm the panel snaps back to default width.
4. Open the map (Map tab) — confirm it gets real width and full-screen works.
5. Share modal — confirm no "Invite by email" stub; link + copy + people-with-access only.
6. Capture chrome-extension:// PNGs: rail v2 (with brief), empty-state rail, dock resize
   with grip, map open at width, panel with the new secondary-row divider.

## Git state

- Branch `feat/shell-refinement` off d8786b2 (v0.6.22), commit `510f25a`, pushed to
  `origin/feat/shell-refinement`.
- Isolated worktree `P:\hauska-brief-extension-shell`; the shared clone and the map
  agent's uncommitted v0.6.24 work were not touched.
- Files: research.html, research.css, research-app.js, research-dock.js, inject.css,
  generated hauska-shadow.css, rebuilt research-bundle.js(+map), package-lock.json
  (version sync only). Incidental rebuild churn in popup/panel/content/vendor outputs was
  reverted to keep the commit shell-scoped and reduce merge surface.
- **Merge to integration:** pending coordination with the map agent (their v0.6.24 is
  still uncommitted). Recommend: map agent commits v0.6.24 first, then merge this branch
  on top, rebuild, set the final version.
