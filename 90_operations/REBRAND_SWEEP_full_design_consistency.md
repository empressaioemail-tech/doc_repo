---
id: REBRAND_SWEEP_full_design_consistency
title: REBRAND SWEEP — finish the design system across all surfaces (blue=primary, gold=brand)
date: 2026-08-03
status: dispatch (the full tokenization sweep from the audit; blue-primary/gold-brand decided; one agent)
owner: nick
related: [2026-08-03_PE_design_consistency_audit, REBRAND_IMPL_design_system_wiring, REBRAND_UI_map_chrome_cluster]
---

# REBRAND SWEEP — full design-system consistency

The design system reached only ~2 of ~11 surfaces (audit: `_inbox/2026-08-03_PE_design_consistency_audit.md`). This sweep finishes it across the whole app, coherently, per the audit's file:line tables. ONE agent, one branch. Read the audit report first — it has the exhaustive file:line tables for every item below.

## THE ACCENT DECISION (operator-ratified — apply exactly)
- PRIMARY / INTERACTIVE accent = **BLUE `#3B82F6`** (`--brand-blue`). This is the app's interactive hue: links, active states, primary CTAs in dense surfaces (chat, workbench, tools), selected rows, focus. The old interaction-cyan `#7dd3fc` (the de-facto `ACCENT` in 15 files) becomes BLUE, not gold.
- GOLD (`--brand-gold #E8963B` / `--brand-gold-light #F5B95C`) = BRAND + HERO only: the logo/badge/mark, and ONE hero CTA per major surface (e.g. "Make subject", "Run the X-ray", "Export"). Do NOT gold-fill every button — the operator dislikes heavy gold buttons. Most interactive elements are blue or neutral; gold is the accent you spend once per surface.
- Net: the app reads BLUE-primary with gold brand punctuation. Close to the current cyan feel, on-brand.

## THE SWEEP (from the audit, ranked systemic-first)

### 1. Kill the hardcoded ACCENT cyan → blue (15 files + ~20 rgba sites) — BIGGEST WIN
Every `ACCENT = "#7dd3fc"` const + `rgba(125,211,252,…)` site across the workbench/chat/tools/share surfaces → `var(--brand-blue)` / the blue rgba equivalents. Per the audit's table. This is what makes the app read consistently. EXCEPTION: the map's ExplorerMap interaction-cyan search-highlight (already flagged leave-alone) stays; and any hero CTA that should be gold (see below) goes gold not blue.

### 2. Honest-absence yellow → slate (13 files, `AMBER` const) — with the split
`#fcd34d` / `#c98b3a` (`AMBER`): sort each use (the audit + chat-citations.ts map which is which):
- genuine "we don't have this data" honest-absence → `var(--semantic-absence)` #7C8BA0 slate.
- genuine warning/caution → `var(--semantic-warning)` #F59E0B (stays amber-ish, it's semantic).
Do NOT blanket-replace; classify per use (same discipline as the first impl pass, which did 3 correctly).

### 3. Fonts + title
- Oxygen (`--font-display`) is a DEAD token (never loaded → silent system-ui fallback). DECIDE + do: EITHER load Oxygen via an inlined @font-face (data-URI, CSP-safe — no external CDN) so headings actually use it, OR drop `--font-display` to system-ui and remove the dead references. Recommend: load it (the lockup uses Oxygen; headings should match) IF a self-hosted/inlinable Oxygen is available; else drop cleanly. Flag which you did.
- `index.html` `<title>` still says "Empressa" → "Smart Site" (+ the meta description if it names Empressa). This is the browser-tab rebrand.

### 4. Buttons → the component (17+ ad-hoc, 17 in ChatTool)
Migrate the ad-hoc native buttons to `src/components/Button.tsx` (variants: primary/secondary/ghost/subtle). Wrong radius (6px) → the token 9px. Apply the accent decision: primary CTA per surface = gold (hero) OR blue (dense/interactive) per its role; supporting = secondary/ghost/subtle. Preserve every button's LABEL exactly (styling, not copy).

### 5. Greys / text / borders → tokens
The drifting `MUTED` (`#8b97a5` vs `#9aa6b2` — two values that disagree) → `--surface-muted` #94A3B8 (one value). `TEXT = "#e5e7eb"` (12 files, no token) → add a `--text-body` token and reference it. Card-bg / border rgba re-expressed ~30× → `--surface-card` / `--surface-border`. Per the audit tables.

### 6. The CARTO badge (operator flag)
The `© CARTO` MapLibre AttributionControl (bottom-left, map-renderer.js ~219) collides with the SmartSiteBadge and is redundant with the new lower-right MapSourceInfo ⓘ. It is REQUIRED by CARTO/OSM terms — do NOT delete it. MOVE it: either to a different corner, or feed the attribution into the MapSourceInfo ⓘ bubble (preferred — one source-of-attribution place). If it's in the map-renderer package (cross-package), and moving it there is out of scope, at minimum reposition the AttributionControl to bottom-right / into the ⓘ so it's not behind the badge. Flag if cross-package.

### 7. The ⓘ bubble position (operator flag)
The MapSourceInfo ⓘ bubble is currently ABOVE the layers bubble; the operator wants it BESIDE (to the left of) the layers bubble, same row. Reposition.

## OUT OF SCOPE (do NOT do here — flag/route)
- "No citations in chat" is UPSTREAM (Cortex research/chat endpoint doesn't return the citations array; PE already renders them when present). NOT a PE fix — do NOT touch the PE citation loop. (Route to the Cortex/backend planner separately.)
- Hydrology teal is a separate map-renderer CONTEXT palette (cross-package), possibly intentional. Do NOT change it in this sweep — flag it for a design decision (reconcile hydro teal to the palette, or confirm it's deliberately muted).

## BOUNDARIES
- PE keeps --surface-ink #0b0e13; no Smart City navy surfaces. Install-id untouched. Do NOT touch the map interaction-cyan search-highlight, PDF print blue, the retrieval/serve logic, or copy/wording. Base on `rebrand/combined-deploy` (has the tokens + Button + all prior UI). Isolated worktree.

## VERIFY + DELIVER
- grep: zero hardcoded `#7dd3fc` ACCENT consts remain (only the map search-highlight); zero un-tokenized `#fcd34d` absence uses; MUTED single value; title not "Empressa".
- Coverage: state which of the ~11 surfaces are now token-compliant (target: all).
- Buttons: every ad-hoc button migrated or flagged.
- Typecheck green (build @hauska/map-renderer, tsc --noEmit). Touched test suites pass. No non-exiting dev server.
- Commit to `rebrand/design-sweep` off `rebrand/combined-deploy`; push. NO merge, NO deploy. Report: the per-dimension before/after, the accent-decision application (what went blue vs gold), the font decision, the coverage map, any cross-package/needs-decision flags.

## STANDING DECISIONS
Operate/extend (tokens exist — reference them; don't re-invent). Verification never delegated (planner greps + builds). Anti-fabrication (classify absence-vs-warning honestly; don't recolor a warning to absence for a count). Blue=primary/gold=brand is RATIFIED — apply it, don't re-litigate. Isolated worktree. Merge/deploy only on operator go. No timeframe estimates. Paste raw greps + the coverage map + the surface-by-surface before/after.

## ADDENDUM (operator changed the default-layers decision 2026-08-03)
NEW default on landing: ALL layers ON EXCEPT zoning/land-use, and INCLUDE aerial/satellite ON (was all-but-aerial; aerial-on is a better first impression). Two touch points:
1. `consumer-layers.ts` `consumerColdOpenVisible()` — return consumerKnownLayers() MINUS the `zoning` key (zoning initializes OFF/unchecked; keep the toggle). All other layers stay ON.
2. Satellite/aerial basemap default (separate `useState(false)` in MapToolset.tsx) — flip to ON.
Net: Satellite/aerial ✓ + all layers ✓ EXCEPT Zoning/land use (off). All toggles preserved. Folded into the design-sweep branch.
