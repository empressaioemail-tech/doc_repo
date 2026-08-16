# ATX Bulls — design system

Arena Football One expansion team. Austin, Texas. Inaugural season 2027, opening night
March 20, 2027. This system extends the live brand at [atxbulls.com](https://atxbulls.com/)
so new surfaces — starting with a fan rewards platform — read as a continuation of the site,
not a sports template.

## Sources

| Source | What it gave us |
| --- | --- |
| `uploads/11_design_system_claude_brief.md` | **The ground truth.** A live extract of the production CSS (`/assets/index-DDCu5niA.css`) and computed styles, taken 2026-08-13: `:root` tokens, verbatim `.button` and display-type rules, the full component list, layout metrics, imagery rules, and the do-not list. Every value in `tokens/` comes from here. |
| [atxbulls.com](https://atxbulls.com/) | Copy, section order, photography URLs, IA. Fetched 2026-08-13. |
| [atxbulls.com/team](https://atxbulls.com/team) | Single hero, no roster published. |
| `assets/reference-homepage-hero.png` | Screenshot of the live hero, supplied by the user. |
| `assets/atx-bulls-mark-on-ink.png`, `assets/atx-bulls-lockup-on-orange.png` | Screenshot-derived copies of the official mark and lockup. Low resolution — see "Assets" below. |

No repository, Figma file, or brand-guide PDF was provided. The live site's own stylesheet is
the authority; where a framework convention (Tailwind defaults, shadcn radii) differs, the site wins.

## Products

1. **Marketing site** — single-page homepage plus a `/team` placeholder. Recreated in
   `ui_kits/marketing_site/`.
2. **Fan rewards platform** — the surface being designed. Does not exist yet; built here as a
   new surface on the existing system in `ui_kits/fan_rewards/`.
3. **Latent surfaces** — the live stylesheet already defines roster cards, an inverted schedule
   table, a ticket poster, live-wire, fan-game and ritual blocks that no page renders yet. `PlayerCard`
   and `ScheduleTable` implement the first two; the rest are noted as the brand's own next-surface
   vocabulary rather than invented from scratch.

---

## Content fundamentals

**Everything is uppercase.** Headlines, ledes, nav, buttons, labels, meta rows, form
placeholders. Lowercase sentence-case copy appears in exactly two places on the live site: two
short explanatory paragraphs (tryouts, origin story) and the footer legal line. If a string can be
uppercase condensed, it is.

**Voice.** Punchy, declarative, Texas-proud, arena-loud. Sentences are short and land hard.
Fragments are normal. Two-part constructions with a period in the middle are the house rhythm:

> LIGHTS OUT. HORNS UP.
> GET EVALUATED. BE SEEN. COMPETE AT THE HIGHEST LEVEL.
> YOUR OPPORTUNITY. YOUR FUTURE. OUR TEAM.

**Headline shape.** A statement split in two, with the punch words coloured orange:
"AUSTIN'S *NEW MAIN* EVENT." · "THE WAIT *IS OVER.*" · "TEXAS ORANGE. *NEVER LOOKED BETTER.*" ·
"WEAR YOUR *HORNS.*" · "BUILT ON *TEXAS PRIDE.*" · "AUSTIN. *PICK YOUR SIDE.*"

**Person.** Second person, possessive, inclusive. "YOUR opportunity", "OUR team", "MEET YOUR TEAM",
"WEAR YOUR HORNS", "PICK YOUR SIDE". The team speaks as *we* only implicitly — it addresses the fan
directly and hands them ownership.

**Taglines already in market** (use these, do not write new ones without asking):
"Austin's new main event." · "Lights out. Horns up." · "Loved here. Feared everywhere." ·
"Horns up × Hard hits × Heart of Texas." · "Good men walk in. Bad Bulls walk out." ·
"Texas made. Arena ready."

**Two audiences at once.** The site sells hard hits *and* family night in the same breath —
"the loudest three hours in Texas" next to "doors open 5:30 PM · kickoff 7:00 PM". Aggression is
about the football, never about the crowd. Keep both registers.

**CTA copy.** Imperative, 2–4 words: GET IN THE ARENA · RESERVE TICKETS · SAVE YOUR SEATS ·
REGISTER FOR TRYOUTS · SHOP NOW · MEET YOUR TEAM · JOIN THE VIP LIST. No "Learn more", no
"Get started", no question-mark CTAs.

**Numbers and dates** are written out and shouted: AUGUST 30 · MARCH 20, 2027 · DROP 001 ·
2027 SEASON · 5:30 PM. Facts sit in hairline-separated meta rows, never in prose.

**Punctuation.** Middle dots separate facts (`2027 SEASON · ARENA FOOTBALL · AUSTIN, TEXAS`).
A multiplication sign separates chants (`HORNS UP × HARD HITS`). Em dashes appear once, in body
copy. No exclamation marks except "BE FIRST TO KNOW WHEN TICKETS DROP!".

**No emoji. Anywhere.** Not in UI, not in copy, not in notifications.

---

## Visual foundations

**Colour.** One accent on a warm blackout ground. `--orange #f25a18` is the only orange — not UT
burnt orange, not neon. `--ink #080706` is a warm black; `--bone #f3eee6` a warm off-white. Pure
`#000` and `#FFF` are never the brand black and white. `--muted #a79d94` carries every label and
meta line. `--burnt #bf4016` is held in reserve (and used here for error states). There is **no
light theme** — the one inverted surface is a full orange field with ink type, and one latent
bone-field schedule table.

**Type.** Two families do all the work. **Archivo Black** (one black cut, weight 400) for display:
uppercase, `letter-spacing: -0.06em`, `line-height: 0.86`. **Barlow Condensed** 600–900 for every
piece of chrome: nav, buttons, eyebrows, ledes, meta, values, form fields, ticker. **Inter** exists
for the rare body paragraph and the footer legal line. No serif, no script, no third family.
Emphasis inside a headline is **colour, not slant** — `em` is orange and upright. Barlow's italics
are loaded on the live site and unused; keep them unused.

**Spacing and layout.** Content shell is `min(100% - 64px, 1280px)`, dropping to `100% - 40px`
below the 800px breakpoint (other breaks: 360 / 380 / 520 / 900). Fixed nav is 78px. Sections run
900–940px minimum height, separated by 1px `--line` rules. Every section repeats the same copy
stack, left-aligned on the shaded third of a full-bleed photo: eyebrow → huge H2 with an orange
`em` → uppercase lede → chamfered CTA → optional proof row.

**Backgrounds and imagery.** Full-bleed cinematic photography, always. Night, high contrast,
orange rim light, smoke, wet asphalt, the Austin skyline, a large bull-head watermark. Photos are
filtered `saturate(.95) contrast(1.04)`, shaded left-to-right to near-black so type sits on ink,
faded at the bottom, and often carry a radial orange bloom inside the image
(`radial-gradient(circle at 66% 45%, #f25a1824, transparent 34%)`). A faint 88px hairline grid
overlays the shaded side and masks out toward the photo. No sunny daylight stock football, no
NFL or Longhorns imagery, no illustration, no gradient meshes, no textures beyond that grid.

**Corners and shape.** `border-radius: 0` everywhere. Emphasis geometry is the **chamfer**:
`polygon(0 0, 100% 0, 100% 78%, 94% 100%, 0 100%)` — bottom-right only — on every button, and a
shallower `100% 93%, 96% 100%` variant on modals. No pills, no 8px cards, no rounded fields. The
single circle in the system is the tilted **stamp**: 108–116px, 2px orange stroke, orange type,
`rotate(8deg)`, frosted `#050403c7` fill.

**Cards.** There are none. Grouping is done with 1px `--line` hairlines and the `--panel #15110f`
fill — no shadow, no radius, no coloured left border. Anywhere you would reach for a card, use
`Panel` (`hairline` on photography, `panel` on flat ink).

**Shadows.** Type never gets one. Only four exist: the CTA bloom `0 22px 70px #f25a1842`, the stamp
glow `0 0 44px #f25a1829`, the modal `0 34px 110px #000000b8`, and the hero lockup's
`drop-shadow(0 20px 54px #000000bf) drop-shadow(0 0 30px #f25a1833)`.

**Transparency and blur.** Exactly two uses: the scrolled nav (`#080706e6` + `blur(18px)` + a
bone hairline) and the modal scrim (`#030202d1` + `blur(15px)`), plus the stamp's frosted fill and
the modal input's 13% white fill. Nothing else is glassy.

**Protection.** Type over photography sits on a gradient, never in a capsule or a tinted box —
the left-to-right shade plus the bottom fade do the work.

**Animation.** Everything transitions at `0.2s ease`. That is the whole motion system, plus the
22s linear ticker loop and 0.36s progress fills. Nothing bounces, nothing springs, nothing scales.
`prefers-reduced-motion` kills the ticker and the transitions.

**Hover.** The CTA inverts — orange fill becomes bone, and the button rises `translateY(-2px)`.
Text links turn label, rule and arrow orange. Panels raise 2px and their hairline goes orange.
Square icon buttons fully invert their fill. Nav links go orange.

**Press.** There is no press state on the live site: no darkening, no shrink, no scale. Hover is
the only feedback. (New surfaces in this system follow that — the 0.97 shrink common in app UI is
deliberately absent.)

**Borders.** 1px `--line` for structure, 2px for input edges and icon squares, 2px for text-link
underlines, 3px for form underlines and tab indicators. Dashed only once, on the ticket tear line.

**Fixed elements.** The nav is the only fixed chrome on the site. The fan app adds a bottom tab bar
using the same ink-blur treatment.

---

## Iconography

- **Lucide**, loaded from CDN (`https://unpkg.com/lucide@latest`) and used through `Icon`.
  The site's own trailing button arrow is a Lucide-style north-east arrow drawn inline
  (`line 7,17 → 17,7` plus `polyline 7,7 17,7 17,17`) at **stroke-width 2.25** — so icons in this
  system run at 2.25 rather than Lucide's default 2, to match. **This is a substitution:** the live
  site draws that one arrow by hand and has no icon library. Lucide was chosen because the arrow's
  geometry, weight and square caps are Lucide's. If the brand adopts a different set, swap it in
  `components/core/Icon.jsx` only.
- **No icon font, no sprite sheet, no PNG icons** exist in the source.
- **No emoji, ever.** No unicode pictographs standing in for icons. The only non-alphabetic
  glyphs used as design elements are `·` (fact separator), `×` (ticker separator) and `↗`
  (the CTA arrow, drawn as SVG).
- Icons are always paired with an uppercase label in navigation. Icon-only controls are limited to
  square 44×44 bordered buttons (social, close, utility).
- Sizes: 13–15 inline with meta text, 18 in buttons, 21 in the tab bar, 26 in feature positions,
  40 for the ticket QR block.

## Assets

`assets/` holds what could be captured:

- `atx-bulls-mark-on-ink.png` — bull-head mark, 125×117.
- `atx-bulls-lockup-on-orange.png` — ATX BULLS lockup on orange, ~275px.
- `reference-homepage-hero.png` — live hero screenshot, for layout reference.

**Both logo files are screenshots, not production art** — low resolution, opaque backgrounds, no
vector. `Logo` therefore loads the official transparent PNGs from the live site and falls back to
these local copies:

- `https://atxbulls.com/bulls-logo-official.png` (mark, 4096²)
- `https://atxbulls.com/atx-bulls-official-logo.png` (lockup, 4096²)
- `https://atxbulls.com/af1-logo.png` (league mark — navy/red, never recoloured)

**Photography is not copied in.** The live PNGs are hotlink-protected against programmatic
download, so `PhotoSection` and the marketing kit reference them by URL:
`austin-tough-banner.png`, `origin-story-2027.png`, `family-arena-2027.png`,
`story-section-2027.png`, `uniform-reveal.png`, `merch-hero.png`, `hero-main-event.png`,
`og.png`, and the hero video `atx-bulls-hero.mp4`. They render in a browser but cannot be
embedded by screenshot tooling, so some card thumbnails show the shaded panels without imagery.
**Ask the brand for the source files.** The bull mark, wordmark and all photography were
supplied by the brand or captured from the brand's own site — nothing here was drawn or generated.

## Fonts

Loaded from Google Fonts, matching the live site's font request exactly:

```
https://fonts.googleapis.com/css2?family=Archivo+Black&family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;0,900;1,800;1,900&family=Inter:wght@400;500;600;700&display=swap
```

These are the real brand faces (the live site uses Google Fonts too), so this is not a
substitution. No local `.woff2` files are shipped; if you need offline or self-hosted builds,
download the three families and replace the `@import` in `tokens/fonts.css` with `@font-face` rules.

---

## Index

**Root**
- `styles.css` — the single entry point consumers link. `@import` lines only.
- `readme.md` — this file.
- `SKILL.md` — Agent Skills wrapper, for use in Claude Code.
- `thumbnail.html` — homepage tile.

**`tokens/`** — `fonts.css` · `colors.css` · `typography.css` · `spacing.css` · `geometry.css`
(radius 0, chamfer clip-paths, control heights) · `effects.css` (glows, photo treatment, blur) ·
`motion.css` · `base.css` (resets, `h1/h2/h3`, `em`, `.atx-shell`, `.atx-grid-overlay`).

**`guidelines/`** — 21 specimen cards feeding the Design System tab: colour core / hairlines /
supporting / invert; display type / emphasis / UI chrome / ledes / ticker / body; chamfer / button
sizes / stamp / underlines; shell / section pattern; glows / photo treatment / motion; logo / icons.

**`components/`**
- `core/` — **Button**, **TextLink**, **Panel**, **Icon**, **IconSquare**, **Tag**
- `brand/` — **Logo**, **Eyebrow**, **SectionHeading**, **Ticker**, **Stamp**, **ProofRow**, **EventSplit**, **VerticalLockup**
- `site/` — **NavBar**, **PhotoSection**, **JoinInvert**, **VipModal**, **Footer**, **PlayerCard**, **ScheduleTable**
- `forms/` — **Input**, **Checkbox**, **Switch**
- `feedback/` — **ProgressBar**, **Toast**, **Dialog**
- `navigation/` — **Tabs**, **TabBar**
- `rewards/` — **PointsMeter**, **TierBadge**, **RewardCard**, **ChallengeRow**, **TicketStub**, **LeaderboardRow**

Each directory carries one `@dsCard` HTML showing its variants. Each component has a `.d.ts` props
contract and a `.prompt.md` usage note.

**`ui_kits/`**
- `marketing_site/` — homepage recreation (`Hero.jsx`, `Sections.jsx`, `Site.jsx`, `index.html`).
- `fan_rewards/` — mobile fan rewards app (`AppShell.jsx`, `HomeScreen.jsx`, `RewardsScreen.jsx`,
  `GameDayScreen.jsx`, `RankScreen.jsx`, `ProfileScreen.jsx`, `data.js`, `index.html`).

### Intentional additions

The live site defines the first three groups. These exist only because the fan rewards platform
needs them, and each was built from the site's own vocabulary rather than a framework default:

- **Tag** — square metadata flag. The site has no badge; this keeps the 0-radius rule.
- **Checkbox**, **Switch** — square, orange-when-on. No account surface exists on the site yet.
- **ProgressBar**, **Toast**, **Tabs**, **TabBar** — app chrome; the tab indicators reuse the
  3px orange rule and the tab bar reuses the nav's ink-blur.
- **Dialog** — a generalisation of the site's one modal (`VipModal`), same chamfer and scrim.
- All six **`rewards/`** components — the platform's domain objects. Tier marks use stacked bars in
  brand colours rather than gold/silver medals, because metals are not in this palette.

### Do not

Do not swap the orange. Do not round a corner. Do not italicise a headline. Do not add a light
theme. Do not put a sentence-case paragraph under an H2. Do not chamfer more than the bottom-right.
Do not use Inter for display. Do not add a second display family. Do not use emoji.
