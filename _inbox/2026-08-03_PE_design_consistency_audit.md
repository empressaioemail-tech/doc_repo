---
title: Property Explorer design-consistency audit (read-only findings)
status: active
last_updated: 2026-08-03
owner: planner
repo: hauska-map
branch: rebrand/combined-deploy
scope: apps/property-explorer/src + apps/property-explorer/api
intended_destination: p:\doc_repo\_inbox\2026-08-03_PE_design_consistency_audit.md
purpose: enumerate every design-system inconsistency so a coherent fix pass can follow
---

# Property Explorer design-consistency audit

Read-only. No code changed. Base: `origin/rebrand/combined-deploy` at commit `d54fffb`. Every file:line below is against that tree.

The design system (`src/styles/pe-tokens.css` + `src/components/Button.tsx`) is real and correct, but it reached only a THIN slice of the app. The reference-compliant surface is the InspectCard (uses the Button component, uses `--semantic-absence`, uses tokens). Almost nothing else adopted it. The dominant pattern across the app is a per-file block of hardcoded color CONSTANTS (`ACCENT`, `AMBER`, `MUTED`, `TEXT`, `CARD_BG`, `BORDER`) copy-pasted into 15-18 files, none of which reference the tokens. The recolor decisions the tokens encode (absence off yellow, atom off purple, one accent hue) never propagated past the token file.

Two structural facts make the whole thing look un-branded in the running app, and both are ranked #1 and #2 below because they are cheap and they touch every screen at once.

---

## COVERAGE SUMMARY

Rough tokenization compliance by surface (share of color/type/button decisions that route through `pe-tokens.css` / `Button.tsx`):

| Surface | Files | Compliant? | Note |
|---|---|---|---|
| Inspect card | `browse/InspectCard.tsx` | ~FULL | Uses Button + `--semantic-absence` + tokens. The reference surface. Two stray `#fcd34d` (below). |
| Map corner chrome (badge + ⓘ source bubble) | `browse/MapCornerChrome.tsx` | ~FULL | Uses `--brand-*` / `--surface-muted` with hex fallbacks. Clean. |
| Search bar | `browse/SearchBar.tsx` | PARTIAL | Imports Button, but its own `FONT`/color palette is all hardcoded hex; local `#fcd34d`, `#8b97a5`, cyan. |
| Site-plan / terrain export sections | `browse/SitePlanExport…`, `TerrainExport…` | PARTIAL | Import Button, but define local `MUTED`/`ACCENT=#7dd3fc`/`WARN=#c98b3a` (absence-yellow variant not recolored). |
| Property brief panel | `browse/PropertyBriefPanel.tsx` | PARTIAL | Own `MUTED`/`AMBER=#fcd34d`/`TEXT` block + cyan link/highlight; no Button. |
| Workbench shell + ALL tools | `workbench/**` | UNTOUCHED | Zero Button imports. Every tool defines `ACCENT=#7dd3fc`, `AMBER=#fcd34d`, `MUTED`, `TEXT`. Primary CTA hue is OLD CYAN, not brand gold. |
| AI chat panel | `workbench/tools/ChatTool.tsx` | UNTOUCHED (chrome) | 17 native `<button>`, cyan send button, `AMBER=#fcd34d`. Atom-chip citation UI itself IS tokenized (`ATOM_ACCENT #4CC9C0`). |
| Flood / hydro tool + map overlay | `workbench/tools/FloodTool.tsx`, `browse/flood-map-overlay.ts` | SEPARATE SYSTEM | Uses the `@hauska/map-renderer` taxonomy palette (slate-teal), disconnected from PE tokens. See operator flag #1. |
| Share funnel (view/landing/dock) | `share/**` | UNTOUCHED | Own `ACCENT=#7dd3fc`/`AMBER=#fcd34d`/`MUTED`/`TEXT` block, no Button. |
| Cold-open sign-up | `coldopen/SignUpCard.tsx` | UNTOUCHED | Own `ACCENT=#7dd3fc`, hardcoded card bg; OAuth brand hexes are legitimately exempt. |
| Paywall / unlock | `browse/PaywallGate.tsx`, `browse/UnlockFlow.tsx` | UNTOUCHED | Own `MUTED`/`AMBER`/`ACCENT` block, ad-hoc buttons. |

Headline: the design system reached ~2 of ~11 surfaces fully (InspectCard, MapCornerChrome). Everything downstream of the workbench tab bar is on the pre-rebrand palette.

Two app-wide defects on top of the per-surface drift:
- The `--font-display` (Oxygen) token is DEAD — Oxygen is never loaded (no `@font-face`, no font `<link>`), so every heading silently falls back to system-ui. The display typeface does not exist in the running app.
- `index.html` `<title>` still reads "Empressa — Explore your property" (pre-Smart-Site brand).

---

## DIMENSION 1 — COLOR TOKEN ADOPTION (ranked by frequency)

### 1A. SYSTEMIC — old interaction-cyan `#7dd3fc` used as the PRIMARY accent/CTA hue (15 files)

`--atom-accent` was recolored off purple to teal `#4CC9C0`, and gold is the brand primary. But 15 files hardcode `const ACCENT = "#7dd3fc"` (the cyan the token file explicitly reserved for "map search-highlight only") and use it for buttons, links, active tabs, selected chips, and section accents. This is the single biggest reason the app does not read as gold-branded.

| File:line | Current | Should be | Severity |
|---|---|---|---|
| `browse/SitePlanExportSection.tsx:12` | `ACCENT = "#7dd3fc"` | needs design decision: brand accent token (gold/blue) — cyan is search-highlight-reserved | High |
| `browse/TerrainExportSection.tsx:12` | `ACCENT = "#7dd3fc"` | same | High |
| `browse/UnlockFlow.tsx:39` | `ACCENT = "#7dd3fc"` | same | High |
| `coldopen/SignUpCard.tsx:17` | `ACCENT = "#7dd3fc"` | same | High |
| `share/SharedDossierDock.tsx:27` | `ACCENT = "#7dd3fc"` | same | High |
| `share/ShareLandingOverlay.tsx:22` | `ACCENT = "#7dd3fc"` | same | High |
| `share/ShareView.tsx:32` | `ACCENT = "#7dd3fc"` | same | High |
| `workbench/tools/ChatTool.tsx:115` | `ACCENT = "#7dd3fc"` (send button, links) | same | High |
| `workbench/tools/CompareTool.tsx:51` | `ACCENT = "#7dd3fc"` | same | High |
| `workbench/tools/FloodTool.tsx:67` | `ACCENT = "#7dd3fc"` | same | High |
| `workbench/tools/LockedToolPanel.tsx:19` | `ACCENT = "#7dd3fc"` | same | High |
| `workbench/tools/PropertiesTool.tsx:58` | `ACCENT = "#7dd3fc"` | same | High |
| `workbench/tools/PropertyDossierDetail.tsx:24` | `ACCENT = "#7dd3fc"` | same | High |
| `workbench/tools/ShareTool.tsx:34` | `ACCENT = "#7dd3fc"` | same | High |
| `workbench/Workbench.tsx:39` | `ACCENT = "#7dd3fc"` (active-tab fill) | same | High |

Plus non-const cyan uses of the same hue: `browse/PropertyBriefPanel.tsx:334`, `browse/ExplorerMap.tsx:761,764` (this one IS legitimately the search-highlight — leave it), and every `rgba(125,211,252,…)` border/bg (that is `#7dd3fc` at alpha) across ChatTool, ShareView, FloodTool, PaywallGate, UnlockFlow, PropertyDossierDetail, SharedDossierDock — same recolor question, ~20 occurrences.

Design decision needed: what is the PE primary-action hue? The Button component says GOLD; the whole workbench says CYAN. Pick one and route both through it.

### 1B. SYSTEMIC — honest-absence STILL on yellow `#fcd34d` / `#c98b3a` (recolor MISSED, 13+ files)

`--semantic-absence` was deliberately moved OFF yellow to slate `#7C8BA0`. These files never got the memo — they still carry `const AMBER = "#fcd34d"` (and export-warn `#c98b3a`) and use it for not-verified / no-coverage / outdated / warning states.

| File:line | Current | Should be | Severity |
|---|---|---|---|
| `browse/PropertyBriefPanel.tsx:32,49` | `AMBER = "#fcd34d"`, `aging: "#fcd34d"` | `--semantic-absence` (absence) OR `--semantic-warning` (caution) per meaning | High |
| `browse/UnlockFlow.tsx:40` | `AMBER = "#fcd34d"` | same | High |
| `share/SharedDossierDock.tsx:26` | `AMBER = "#fcd34d"` | same | High |
| `share/ShareLandingOverlay.tsx:23,59` | `AMBER = "#fcd34d"`, `rgba(252,211,77,0.45)` | same | High |
| `share/ShareView.tsx:30` | `AMBER = "#fcd34d"` | same | High |
| `workbench/tools/BriefTool.tsx:32` | `AMBER = "#fcd34d"` | same | High |
| `workbench/tools/ChatTool.tsx:116,431` | `AMBER = "#fcd34d"`, `rgba(252,211,77,0.5)` outdated-badge | needs decision: this surface reserves amber for warning (see chat-citations.ts note) — confirm keep-vs-recolor | High |
| `workbench/tools/CompareTool.tsx:49` | `AMBER = "#fcd34d"` | same | High |
| `workbench/tools/LockedToolPanel.tsx:18` | `AMBER = "#fcd34d"` | same | High |
| `workbench/tools/PropertiesTool.tsx:56` | `AMBER = "#fcd34d"` | same | High |
| `workbench/tools/PropertyDossierDetail.tsx:22` | `AMBER = "#fcd34d"` | same | High |
| `workbench/tools/ShareTool.tsx:32` | `AMBER = "#fcd34d"` | same | High |
| `workbench/Workbench.tsx:40` | `AMBER = "#fcd34d"` | same | High |
| `browse/SearchBar.tsx:87,267` | `#fcd34d` (search-unavailable notice) | `--semantic-absence` or warning | Med |
| `browse/InspectCard.tsx:309,323` | `color: "#fcd34d"` (no-buildable-area) | needs decision: warning (`--semantic-warning`) not absence — this is a real caution state, in an otherwise-compliant file | Med |
| `browse/TransientChips.tsx:34,40` | `#fcd34d` / `rgba(252,211,77,0.5)` | absence/warning (component no longer rendered — may be dead) | Low |
| `browse/SitePlanExportSection.tsx:13` | `WARN = "#c98b3a"` | absence/warning token | Med |
| `browse/TerrainExportSection.tsx:13` | `WARN = "#c98b3a"` | absence/warning token | Med |
| `coldopen/SignUpCard.tsx:139` | `color: "#c98b3a"` (auth-load-error) | `--semantic-error`? (it is an error) | Med |

Note: there is a real semantic ambiguity the tokens don't resolve — some of these yellows mean "not verified here" (→ absence slate) and some mean "caution / no buildable area / superseded edition" (→ `--semantic-warning`, which is ALSO yellow `#F59E0B`). The fix pass must split them, not blanket-recolor. Flag as needs-design-decision per use.

### 1C. SYSTEMIC — one-off greys instead of `--surface-muted` (18 files, and they DISAGREE)

`--surface-muted` is `#94A3B8`. Every file defines its own `MUTED`, and there are TWO drifting values that don't even match each other:

- `MUTED = "#8b97a5"` — `InspectCard:42`, `PaywallGate:13`, `SitePlanExportSection:11`, `TerrainExportSection:11`, `UnlockFlow:38`, `FloodTool:66`, `SearchBar:95/121`
- `MUTED = "#9aa6b2"` — `PropertyBriefPanel:31`, `SharedDossierDock:25`, `ShareLandingOverlay:21`, `ShareView:29`, `BriefTool:31`, `ChatTool:114`, `CompareTool:48`, `LockedToolPanel:17`, `PropertiesTool:55`, `PropertyDossierDetail:21`, `ShareTool:31`, `Workbench:38`

All → `--surface-muted`. Also secondary greys `#c6d0dc`, `#c3ccd6`, `#aeb8c4`, `#6b7684` scattered (SearchBar, PaywallGate, SignUpCard, export sections) with no token — likely need a `--surface-muted-2` mapping (`#64748B` exists) or a new mid-grey token.

### 1D. SYSTEMIC — body text `TEXT = "#e5e7eb"` with NO token to point at (12 files)

`TEXT = "#e5e7eb"` appears identically in 12 files (`PropertyBriefPanel`, `UnlockFlow`, `ShareLandingOverlay`, `ShareView`, `ChatTool`, `CompareTool`, `FloodTool`, `LockedToolPanel`, `PropertiesTool`, `PropertyDossierDetail`, `ShareTool`, `Workbench`). Also `#e6edf3` (InspectCard:204, PaywallGate:56, export sections, FloodTool parcel-stroke) and `#e9eef5` (SignUpCard:76). These are the primary body-text color and there is NO `--surface-text` / `--surface-text-strong` token — the token file only defines `--brand-white #F8FAFC`. GAP: add body-text tokens, then point all of these at them. Severity: Med (consistent value, but untokenized and fragmented across three near-identical hexes).

### 1E. Card/panel backgrounds duplicated as raw rgba (not a token)

`CARD_BG = "rgba(13,17,23,0.94)"` (InspectCard, ShareLandingOverlay, ShareView, Workbench), `PANEL_BG = "rgba(13,17,23,0.9x)"` (MapCornerChrome, PaywallGate, MobilePanelContext, SearchBar), `#0d1117` option/menu bg (CompareTool:59, ChatTool:961), `SignUpCard` `rgba(17,21,28,0.92)`. These are all the same intent (translucent card ink) with drifting alpha and one drifting base (`0d1117` vs `0b0e13` vs `11151c`). None map to `--surface-card #141928` or `--surface-ink #0b0e13`. Add a `--surface-card-translucent` token (or standardize on the existing surface tokens with a documented alpha) and route them. Severity: Med.

### 1F. Border color duplicated as raw rgba (not a token)

`rgba(154,166,178,0.xx)` (a grey at alpha) is THE border color of the whole app — it appears ~30 times as `1px solid rgba(154,166,178,0.2–0.4)` across Workbench (`BORDER`), ChatTool (`CHIP_BORDER`), CompareTool, PropertyDossierDetail, ShareView, SitePlan/Terrain sections, MapCornerChrome, MobilePanelContext, SearchBar. `--surface-border #1E293B` and `--surface-border-soft #243247` exist but are used almost nowhere. Standardize. Severity: Med (very high frequency, low individual risk).

---

## DIMENSION 2 — BUTTON CONSISTENCY

Only **4 files** import `components/Button.tsx`: `InspectCard`, `SearchBar`, `SitePlanExportSection`, `TerrainExportSection`. Every other clickable in the app is an ad-hoc native `<button>` or styled element. Native `<button>` counts (non-test): ChatTool 17, PropertyDossierDetail 5, PropertiesTool 5, Workbench 4, ShareTool 3, SignUpCard 3, UnlockFlow 2, SearchBar 2, PropertyBriefPanel 2, plus singles in FloodTool, CompareTool, ShareView, PaywallGate, MobilePanelContext, MapCornerChrome.

The ad-hoc button pattern (representative — `PropertiesTool.tsx:208`):
```
padding: "7px 10px", fontSize: 11.5, fontWeight: 600,
color: "#0d1117", background: ACCENT /* cyan */, border: "none", borderRadius: 6
```
Note the divergences from tokens: `borderRadius: 6` (token is `--btn-radius: 9px`), ad-hoc padding (token pad scale ignored), CYAN fill (Button `primary` is GOLD).

Ad-hoc buttons to migrate (→ suggested Button variant):

| File:line | Current | → variant |
|---|---|---|
| `workbench/tools/PropertiesTool.tsx:208` "Save current property" (cyan fill) | primary CTA | `primary` |
| `workbench/tools/PropertiesTool.tsx:~240` status-filter pills | toggle chips | `subtle`/`ghost` (or keep as pills, tokenize color) |
| `workbench/tools/ShareTool.tsx:99,150` (cyan-fill actions) | primary CTA | `primary` |
| `workbench/tools/ChatTool.tsx:~1745,~1880` send / primary (cyan `ACCENT` fill) | primary CTA | `primary` |
| `workbench/tools/ChatTool.tsx` (session-list, chip, detail toggles) | low-emphasis | `ghost`/`subtle` |
| `workbench/tools/PropertyDossierDetail.tsx:100` selected/action | selected chip | `subtle` + selected state |
| `workbench/tools/CompareTool.tsx` (single button) | secondary | `secondary` |
| `workbench/tools/FloodTool.tsx:445,544` (cyan-border run buttons) | secondary/ghost | `secondary` |
| `workbench/Workbench.tsx:~90` tab buttons (cyan active fill) | tab (special) | keep as tabs but route hue through token |
| `browse/UnlockFlow.tsx:148` (cyan-fill unlock) | primary CTA | `primary` |
| `browse/PaywallGate.tsx` CTA | primary CTA | `primary` |
| `browse/PropertyBriefPanel.tsx` (2 buttons) | mixed | `ghost`/`secondary` |
| `share/ShareView.tsx` CTA + `share/ShareLandingOverlay.tsx` | primary CTA | `primary` |
| `coldopen/SignUpCard.tsx` OAuth buttons (3) | brand OAuth | keep custom (brand-locked), but tokenize the surrounding chrome |

On the operator's "heavy solid-gold buttons" dislike: the gold-fill `primary` is currently used in very FEW places (it only exists in the 4 Button-importing files — e.g. InspectCard "Make subject", the export "Export" actions). It is NOT overused today; the app is actually over-CYAN, not over-gold. When the migration routes the 15 cyan-`ACCENT` CTAs onto Button, do NOT make them all `primary` gold — that WOULD create the heavy-gold problem the operator dislikes. Recommendation: reserve `primary` (gold fill) for the ONE headline action per panel (Export, Unlock, Make subject, Send); everything else → `secondary` (outline), `ghost`, or `subtle`. This is a design decision to make explicit before the fix pass, not a mechanical swap.

---

## DIMENSION 3 — TYPOGRAPHY + SPACING

### 3A. HIGH — `--font-display` (Oxygen) is never loaded (dead token)

`pe-tokens.css:45` defines `--font-display: 'Oxygen', …`. There is NO `@font-face`, no Google-Fonts `<link>` in `index.html`, no font file in `public/`, and `main.tsx` imports only `pe-tokens.css`. So Oxygen never renders — every "display" heading falls to the `ui-sans-serif, system-ui` fallback. And the token itself is referenced almost nowhere anyway (headings use hardcoded font strings). Fix: either load Oxygen (add the webfont) or drop the display-font pretense. Needs decision. Severity: High (the branded typeface is invisible).

### 3B. Font family hardcoded instead of `--font-body` (~11 places)

`"system-ui, -apple-system, Segoe UI, Roboto, sans-serif"` is pasted directly at: `InspectCard:205`, `MapCornerChrome:71,116`, `MobilePanelContext:74`, `PaywallGate:57`, `PropertyBriefPanel:294,307`, `SearchBar:62` (`FONT` const), `ShareLandingOverlay:48`, `ShareView:325,518`, `Workbench:246`, `TransientChips:28`, plus `SignUpCard:77`. All → `var(--font-body)`. MapCornerChrome:71 and SignUpCard:77 paste a hardcoded `'Oxygen', …` string → should be `var(--font-display)` (once Oxygen actually loads). Severity: Med.

### 3C. Ad-hoc font sizes, no scale

Font sizes are set as raw numbers everywhere with no scale: `10`, `10.5`, `11`, `11.5`, `12`, `12.5`, `13`, `9.5` (Button uses `12`/`12.5`). There is no `--font-size-*` scale in the tokens. High variance, low coherence. Recommendation: add a small type scale (e.g. `--fs-1..5`) and map. Severity: Med (cosmetic but pervasive — dozens of `fontSize:` sites).

### 3D. Ad-hoc padding/margin, `--space-*` scale unused

`--space-1..8` is defined and used essentially NOWHERE. Padding/margin are raw px (`padding: "7px 10px"`, `marginTop: 8`, `"0 0 14px"`, `padding: "10px 12px"`, etc.) across every file. Values cluster near the scale (4/8/16) but drift (5, 6, 7, 10, 14). Severity: Low-Med (high frequency, low individual impact; a genuine full-scale adoption is a large mechanical pass).

---

## DIMENSION 4 — COMPONENT / CHROME CONSISTENCY

The common chrome intent is: translucent dark card (`rgba(13,17,23,0.9x)`), a `rgba(154,166,178,0.2–0.4)` hairline border, `borderRadius` ~8-9, a `0 Ny Nx rgba(0,0,0,0.4–0.5)` drop shadow. It is re-expressed by hand in every file, and diverges in these ways:

| Element | Where | Divergence |
|---|---|---|
| Card radius | Button `9px` vs ad-hoc buttons `6` (PropertiesTool, others) vs pills `999` vs cards `8`/`9`/`12`/`14` | radii not standardized (`--radius-card 8`, `--radius-chip 4`, `--btn-radius 9` exist but under-used) |
| Card bg alpha | `0.94` (InspectCard, ShareView, Workbench) vs `0.9`/`0.92`/`0.96`/`0.98` (MapCornerChrome, SearchBar, PaywallGate, MobilePanelContext) | drifting translucency |
| Card base color | `13,17,23` (most) vs `#0b0e13` (App/ShareFunnel/ShareView bg) vs `17,21,28` (SignUpCard) | base ink drifts; none = `--surface-card #141928` or `--surface-ink #0b0e13` |
| Border color | `rgba(154,166,178,α)` (app-wide) vs `rgba(174,184,196,0.28)` (SignUpCard:153,202) vs cyan borders `rgba(125,211,252,α)` | SignUpCard uses a different grey; cyan borders are the recolor-question again |
| Border width | `0.5px` (InspectCard, MapCornerChrome, export, SignUpCard) vs `1px` (Workbench, ChatTool, ShareView, CompareTool) | hairline width inconsistent |
| Blur | No `backdrop-filter` anywhere | cards are translucent but NOT blurred — if a frosted look is intended it is missing everywhere (consistent-by-absence; flag only if design wants blur) |
| Atom chip | ChatTool `ATOM_ACCENT #4CC9C0` teal | THIS is the one correctly-tokenized chip; everything else diverges from IT |

The atom-chip citation UI in ChatTool (`ATOM_ACCENT`/`ATOM_ACCENT_BG`/`ATOM_ACCENT_BORDER`) is the model of a tokenized component. The rest of the workbench chrome should be brought to that standard.

---

## OPERATOR FLAGS

### Flag 1 — "Hydrology is different than the rest" — CONFIRMED

Root cause: the flood/drainage AND hydrography map layers are painted from a SEPARATE color system — the shared map-renderer taxonomy `packages/map-renderer/src/map/layer-role-taxonomy.js` — that is completely disconnected from `pe-tokens.css`.

- Hydrography line: `layer-role-taxonomy.js:140` `CONTEXT_HYDROGRAPHY = "#5b7c8a"` (slate-blue).
- Flood/drainage family: `layer-role-taxonomy.js:36-42` `CONTEXT_FLOOD_TEAL = { low:#8ebfc9, med:#4f8f9e, high:#2a5f6d, pondingFill:#1a4552, pondingRim:#0d2a33, line:#2a5f6d }` — a slate-TEAL ramp.
- Consumed at `browse/flood-map-overlay.ts:26,74-118`; the flow/exit ICON RGBs are hardcoded AGAIN at `flood-map-overlay.ts:812-813` (`#2a5f6d`, `#0d2a33`) rather than derived from the taxonomy constants.
- FEMA reference stays blue: `FloodTool.tsx:188-189` `rgba(59,130,246,0.55)` / `#1d4ed8`.

Why it looks off: this slate-teal ramp is a THIRD teal in the app, and it does not match `--atom-accent #4CC9C0` (the PE teal) OR the cyan `#7dd3fc` OR the brand blue `#3B82F6`. So hydro reads as its own muted blue-green island next to the gold/cyan chrome. It is internally coherent (the taxonomy is deliberate — CONTEXT layers are muted so SUBJECT amber/envelope pops) but it was never reconciled with the PE brand palette.

Fix location + decision: this is a cross-package decision. Either (a) accept that map-CONTEXT layers live in the taxonomy palette by design and document that hydro is SUPPOSED to be muted-teal (then the "different" is intentional and the fix is just to say so in the legend), or (b) reconcile `CONTEXT_FLOOD_TEAL`/`CONTEXT_HYDROGRAPHY` toward `--atom-accent`/brand-blue. Because it is shared-renderer code consumed by other apps, do NOT unilaterally recolor — needs design decision at the taxonomy level. At minimum, `flood-map-overlay.ts:812-813` hardcoded icon RGBs should be derived from the taxonomy constants, not re-typed.

### Flag 2 — "No citations in the AI chat" — NOT a rendering bug; it is a DATA/response gap

The citation loop IS fully present in the PE chat code, and it mirrors the brief:
- `workbench/tools/chat-citations.ts` — complete: `refsFromChatResponse()` merges `citations` + `sources` + `atoms.inlineRefs` + `inlineRefs`, `parseAnswerSegments()`/`refForCitationNumber()` handle inline `[n]` anchors, freshness derivation, atom-accent reservation.
- `workbench/tools/chat-research.ts:572` — the answer turn sets `refs: refsFromChatResponse(body)`.
- `workbench/tools/ChatTool.tsx` — renders `ChatCitationChips` (line ~821), inline `[n]` anchors (line ~338-360), freshness badges; all wired to `ATOM_ACCENT`.

So the chips only appear if the upstream response `body` actually CARRIES `citations`/`sources`/`atoms.inlineRefs`. The PE proxy (`api/spine-deep.ts:102-106`) passes the upstream body through verbatim, so it is not stripping them. Conclusion: the chat endpoint `api/brokerage/v1/research/chat` (Cortex, upstream — NOT in this repo) is returning an answer `message` WITHOUT the citation arrays the brief endpoint returns. The "no citations" symptom is an upstream contract gap, not a PE UI gap.

Root cause: upstream `research/chat` response shape (missing `citations`/`sources`). Fix location: Cortex `research/chat` handler (out of this repo) must emit the same citation payload `research/brief` does. Verification hook already exists PE-side: `chat-citations.test.ts` / `chat-tool.test.tsx` assert the chips render when refs are present — so once the upstream returns them, chips light up with no PE change. Recommend: capture a live `research/chat` response body and confirm `citations`/`sources` are absent before dispatching the upstream fix.

### Flag 3 — "cart.com / source badge still behind the logo" — CONFIRMED, and it is a DUPLICATE attribution

Root cause: a MapLibre `AttributionControl({ compact: true })` is mounted at `"bottom-left"` in `packages/map-renderer/src/map-renderer.js:~219`. The `SmartSiteBadge` sits in the same lower-left corner (`browse/MapCornerChrome.tsx:39-40`, `left:12, bottom:12`). So the collapsed attribution ⓘ (which expands to `© OSM © CARTO` — the CARTO credit links to carto.com, the "cart.com" the operator sees; from `packages/map-renderer/src/map/hauska-map-style.js:23-24`) renders in the lower-left, colliding with / behind the Smart Site badge.

Worse, it is now REDUNDANT: the rebrand already moved source/attribution to a NEW lower-right collapsible ⓘ bubble (`MapCornerChrome.tsx MapSourceInfo`, mounted `ExplorerMap.tsx:1456`), whose header comment (`MapCornerChrome.tsx:11-16`) explicitly says attribution was "moved from the lower-left … to a small circular ⓘ bubble in the lower-right." But the base-map's own MapLibre AttributionControl was never removed from the map-renderer, so BOTH exist.

Constraint: OSM (ODbL) and CARTO terms REQUIRE visible tile attribution, so the credit cannot simply be deleted — the map-renderer comment (`map-renderer.js:210-217`) flags this. The fix is to reconcile the two: either (a) move the MapLibre AttributionControl to `"bottom-right"` so it stops colliding with the badge and let it be the single source of tile credit (then MapSourceInfo need not duplicate tile credit), or (b) keep MapSourceInfo as the single lower-right disclosure and feed the required OSM/CARTO/Esri tile credit INTO it, then remove the `bottom-left` control. Because the control lives in shared map-renderer code, this is a cross-package coordination point. Needs decision on which corner owns attribution; the collision itself is unambiguous and should be fixed either way.

---

## RANKED FIX PRIORITY (systemic first)

1. Resolve the PRIMARY-HUE decision (gold vs cyan) and recolor the 15 `ACCENT=#7dd3fc` files + ~20 `rgba(125,211,252,…)` sites (Dimension 1A). Single biggest visual win; touches the whole workbench + share + chat.
2. Load Oxygen OR drop `--font-display` (Dimension 3A). One change, app-wide; the branded typeface currently does not render at all. Also fix `index.html` stale "Empressa" title.
3. Recolor honest-absence off yellow — the 13-file `AMBER=#fcd34d` block — splitting absence vs warning per use (Dimension 1B). Directly undoes a shipped design decision that never propagated.
4. Attribution collision (Flag 3) — cheap, high-visibility, one file (`map-renderer.js`) + a corner decision.
5. Collapse the `MUTED` (18 files, 2 drifting values), `TEXT` (12 files, no token), `CARD_BG`/`PANEL_BG`, and border-rgba duplications into tokens; add the missing `--surface-text` and card/border tokens (Dimensions 1C-1F).
6. Button migration: route the ad-hoc workbench/share/paywall buttons onto `Button`, deliberately spreading `primary/secondary/ghost/subtle` so the app is NOT wall-to-wall gold (Dimension 2).
7. Hydro reconciliation decision at the taxonomy level (Flag 1) — cross-package, lower urgency, may be intentional.
8. Type-scale + `--space-*` adoption (Dimensions 3C-3D) — large mechanical pass, lowest individual impact, do last.

Upstream (not in this repo): Cortex `research/chat` must return the citation payload `research/brief` does (Flag 2) — PE renders it the moment it arrives.
