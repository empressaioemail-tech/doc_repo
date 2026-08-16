---
id: atx_bulls_11_design_system_claude_brief
title: ATX Bulls design system — Claude Design brief (extracted from live site)
status: active
last_updated: 2026-08-13
applies_to: portfolio
owner: nick
related: [atx_bulls_00_program_overview, atx_bulls_10_fan_platform_vision]
purpose: Live-extracted design tokens, type, components, and voice from atxbulls.com, packaged as a paste-ready brief for Claude Design. Source is the production CSS and computed styles on 2026-08-13, not a brand-guide PDF.
---

# ATX Bulls design system (live extract)

Source: [atxbulls.com](https://atxbulls.com/) inspected 2026-08-13. Tokens pulled from `:root` in `/assets/index-DDCu5niA.css` and from computed styles in the browser. Do not invent a "Texas burnt orange" from memory. The live brand orange is `#f25a18`, not UT burnt orange, not `#FF5A1F`.

Stack on the live site: Vite RSC, Google Fonts, custom CSS on top of Tailwind v4. Single-page homepage with hash sections plus `/team` as a roster placeholder.

The block below is the paste-ready prompt. Everything after it is the evidence appendix.

---

## PASTE THIS INTO CLAUDE DESIGN

```
Design a visual system that extends the live ATX Bulls brand. Match the existing site exactly. Do not "improve" the palette, do not round the buttons, do not switch to a different orange, do not introduce serif, and do not lighten the dark theme into a sports-template look.

BRAND
ATX Bulls. Arena Football One expansion team. Austin, Texas. Inaugural season 2027. Opening night March 20, 2027. Voice: punchy, all-caps, Texas pride, arena-loud. Taglines already in market: "Austin's new main event." "Lights out. Horns up." "Loved here. Feared everywhere." "Horns up × Hard hits × Heart of Texas." OG line: "Good men walk in. Bad Bulls walk out."

MOOD
Cinematic dark-mode sports. Gritty night photography, orange rim light, smoke, wet asphalt, Austin skyline as backdrop, large bull-head watermark. High contrast. Aggressive but family-night friendly (the site sells both hard hits and family night). Streetwear merch energy (blackout Drop 001).

COLOR TOKENS (use these exact values)
--ink:    #080706    /* page background, button text on orange, join CTA fill */
--panel:  #15110f    /* raised panels, unused live-wire bg */
--orange: #f25a18    /* primary CTA, accents, ticker, join invert, em highlights */
--burnt:  #bf4016    /* darker orange, reserved */
--bone:   #f3eee6    /* primary text on dark, button hover fill */
--muted:  #a79d94    /* labels, proof row, meta */
--line:   #f3eee62b  /* 1px hairlines = bone at ~17% opacity */

Supporting (not in :root, used in CSS):
Hero lede: #d3c9c0
Section lede: #d0c6bd
Near-black overlays: #050403, #040302, #030302, #030201
Tryouts rails: #a99e95
Join legal hairline: #08070652
Join invert is FULL orange field with ink type. Schedule (latent CSS, not currently rendered) inverts the other way: bone field, ink type.

Never use pure #000 or pure #FFF as the brand black/white. Ink is warm black. Bone is warm off-white.

TYPOGRAPHY
Google Fonts:
https://fonts.googleapis.com/css2?family=Archivo+Black&family=Barlow+Condensed:ital,wght@0,600;0,700;0,800;0,900;1,800;1,900&family=Inter:wght@400;500;600;700&display=swap

Display / H1 H2 H3 / game dates:
  font-family: "Archivo Black", Impact, sans-serif;
  font-weight: 400; /* Archivo Black is a single black cut */
  text-transform: uppercase;
  letter-spacing: -0.06em;
  line-height: 0.86;
  color: var(--bone);
Headline emphasis: wrap the punch words in <em>. em is NOT italic. em { color: var(--orange); font-style: normal; }
  Example: AUSTIN'S <em>NEW MAIN</em> EVENT.
  Example: TEXAS MADE. <em>ARENA READY.</em>
Display scale (clamp, desktop-first):
  Hero H1: clamp(64px, 6.9vw, 108px)  (mobile falls to ~42–54px)
  Section H2: clamp(58px, 8.3vw, 118px), often 62–72px at ~800px viewport
  Join H2 (on orange): same family, color ink, clamp(54px, 7vw, 86px)

UI / nav / buttons / labels / ticker:
  font-family: "Barlow Condensed", sans-serif;
  Always uppercase.
  Nav links: 800 / 13px / letter-spacing 0.12em
  Eyebrow / kicker: 800 / 12px / letter-spacing 0.2em / color orange / flex with a 34×3px currentColor bar
  Lede (subhead under H1/H2): 700 / clamp(19px, 2vw, 28px) / line-height 1.2 / color #d0c6bd / uppercase
  Hero lede: 700 / clamp(17px, 1.45vw, 22px) / letter-spacing 0.015em / color #d3c9c0
  Button: 900 / 14px / letter-spacing 0.11em  (small: 14px in 42px-tall control; large tryouts: 15px / 64px tall; merch: 17px / 68px)
  Proof / meta row: 800 / 10px / letter-spacing 0.15–0.17em / color muted
  Ticker: 900 / 19px / letter-spacing 0.11em / color ink on orange
  Vertical side lockup: writing-mode vertical-rl; 800 / 10px / letter-spacing 0.28em
  Event labels (DATE / LOCATION): 800 / 9px / letter-spacing 0.2em / muted
  Event values: 900 / clamp(21px, 2vw, 28px) / bone
  Join email input: 900 / 24px Barlow Condensed / ink / placeholder YOU@EMAIL.COM
  Footer legal: 800 / 10px Inter / letter-spacing 0.12em

Body / fallback:
  font-family: Inter, Arial, sans-serif;
  16px / 24px / 400 / color bone on ink. Almost no sentence-case body exists on the live site. If you need body, keep it short and still feel like sports copy.

LOGO
Mark: stylized bull head, black fill, white horns, orange outline, white X on the forehead, nose ring. Aggressive, angular, not cartoon.
Wordmark: ATX in bone, BULLS in orange, Archivo Black, tight tracking.
Lockup files (use these, do not redraw unless asked):
  https://atxbulls.com/bulls-logo-official.png          (mark)
  https://atxbulls.com/atx-bulls-official-logo.png      (full lockup)
  https://atxbulls.com/af1-logo.png                     (Arena Football One, navy/red — league, not team)
Favicon = the mark. Raised hero lockup uses a heavy drop-shadow: drop-shadow(0 20px 54px #000000bf) drop-shadow(0 0 30px #f25a1833)

LAYOUT
Max content shell: width: min(100% - 64px, 1280px); margin: auto; (mobile: calc(100% - 40px))
Fixed nav: 78px tall, transparent over hero, becomes .nav--solid on scroll: background #080706e6, backdrop-blur 18px, 1px bone hairline.
Nav structure: mark left, links centered (TRYOUTS STORY TEAM UNIFORM MERCH), orange CTA right (RESERVE TICKETS).
Section pattern (repeat this): full-bleed photo, left-aligned copy stack, min-height ~900–940px, 1px --line borders between sections.
Copy stack order: eyebrow (orange bar + kicker) → huge H2 with orange <em> → uppercase lede → clipped CTA → optional proof/meta row.
Photo treatment: object-fit cover; left-to-right gradient shade so type sits on near-black; faint 86–90px grid overlay masked out toward the photo; optional radial orange glow in the photo (e.g. radial-gradient(circle at 66% 45%, #f25a1824, transparent 34%)).
Hero extra: looping video https://atxbulls.com/atx-bulls-hero.mp4 with poster https://atxbulls.com/hero-main-event.png; left gradient + bottom fade; vertical type on the right "LOVED HERE · FEARED EVERYWHERE"; AF1 badge bottom-right.
Hairlines, not cards. No rounded rectangles. No drop shadows on type. Buttons may have orange glow (0 22px 70px #f25a1842).

PRIMARY BUTTON (the signature component)
Class: .button
Fill: --orange
Text: --ink, Barlow Condensed 900, 14px, uppercase, letter-spacing 0.11em
Height: 56px default; 42px small (.button--small); 64–68px hero/merch
Padding: 0 26px (small: 0 18px)
Layout: inline-flex, space-between, gap 34px, trailing northeast arrow (lucide-style: line from 7,17 to 17,7 plus polyline 7,7 17,7 17,17), stroke 2.25, 18×18
CLIP PATH (do not round corners):
  clip-path: polygon(0 0, 100% 0, 100% 78%, 94% 100%, 0 100%);
  That is a chamfer on the bottom-right only.
Hover: background --bone; transform: translateY(-2px); transition 0.2s
Zero border-radius. Zero box-shadow except optional orange glow on featured CTAs.

SECONDARY / TEXT LINK
.text-link: Barlow Condensed 900 / 13px / letter-spacing 0.12em / uppercase / 2px bone underline / padding 14px 0 / inline-flex with arrow.
.outline-button (used on orange invert): same but 2px ink underline, ink type, gap 48px.

TICKER
Full-bleed orange bar, 54px (46px mobile), ink type, repeating "HORNS UP × HARD HITS × HEART OF TEXAS ×" with × as 24px Barlow 900. Infinite 22s linear marquee. prefers-reduced-motion: disable.

CIRCULAR STAMP / BADGE
Used on tryouts, uniform, merch. Circle, 108–116px, 2px orange stroke, orange type, Barlow 900 ~13–16px / line-height 0.85–0.9, rotate(8deg), orange glow 0 0 40–48px #f25a1829. Frosted dark fill #050403c7. Copy examples: "ARE YOU READY?" / "OFFICIAL 2027 UNIFORM" / "OFFICIAL DROP 001"

PROOF / META ROW
Flex row, 1px --line on top, items separated by 1px vertical hairline. 10px muted uppercase. Examples: "2027 SEASON | ARENA FOOTBALL | AUSTIN, TEXAS" and "PREMIUM HEAVYWEIGHT | LIMITED EDITION | BUILT IN AUSTIN"

EVENT SPLIT (tryouts date/location)
Two-column grid, 1px --line on top and bottom and between. Label 9px muted, value 21–28px bone.

JOIN / VIP (the invert)
Full-bleed --orange. Ink type. Centered. Logo 320px with ink outline drop-shadows so it punches off orange. H2 "JOIN VIP LIST". Sub: "BE FIRST TO KNOW WHEN TICKETS DROP!"
Form: 3px ink underline, grid 1fr + 60px. Input transparent, 24px Barlow 900, placeholder YOU@EMAIL.COM. Submit is ink fill, bone type, 12px Barlow 900, 63px tall (footer variant) OR the clipped orange button elsewhere.
VIP MODAL: overlay #030202d1 + blur 15px. Panel is orange, clip-path polygon(0 0, 100% 0, 100% 93%, 96% 100%, 0 100%), padding ~52px, width min(620px, 100%), box-shadow 0 34px 110px #000000b8. Close is 48×48 ink square, bone ×. Input: 2px ink border, height 58px, fill #ffffff21. Submit: ink fill, bone type, 12px Barlow 900.

INPUTS
No rounded fields. No gray bootstrap look. Either underline-only on orange, or 2px ink bordered on the modal.

SOCIAL ICONS
44×44 square, 2px ink border, ink glyph, grid-centered. On orange invert. Hover inverts to ink fill / bone glyph.

NAV ON SCROLL
.nav--solid: background #080706e6, backdrop-filter blur(18px), border-bottom 1px var(--line).

BREAKPOINTS IN THE LIVE CSS
800px is the main split. Also 360 / 380 / 520 / 900. Desktop enhancements from 801px up. Respect prefers-reduced-motion.

IMAGERY RULES
Photography is cinematic, high contrast, orange rim light, night, smoke, Austin skyline, players in black/orange/white uniforms, families in the stands, merch laid out as a blackout still life. Photos are slightly saturated (.95) and contrast-boosted (1.04) on the austin-tough banner. Do not use sunny daylight stock football. Do not use NFL/UT Longhorns imagery. Uniform is Texas orange + black + white, 2027 set.

LIVE PHOTO ASSETS (reference, do not re-generate unless asked)
https://atxbulls.com/austin-tough-banner.png
https://atxbulls.com/origin-story-2027.png
https://atxbulls.com/family-arena-2027.png
https://atxbulls.com/story-section-2027.png
https://atxbulls.com/uniform-reveal.png
https://atxbulls.com/merch-hero.png
https://atxbulls.com/hero-main-event.png
https://atxbulls.com/og.png

PAGES / IA TO HONOR
Homepage sections in order: Hero → orange ticker → Austin Tough banner → Tryouts → Family / opening night → Origin story → Uniform reveal → Merch Drop 001 → Join VIP (orange invert) → footer.
/team is a single hero: "TEXAS MADE. ARENA READY." Roster not published yet. Back-to-home text link top right.
Tryout register currently leaves the site to Fillout: https://form.fillout.com/t/qVMoDaWhEmus
Shop / Reserve / Save seats / Meet team currently open the VIP email modal, not a store.
Social links currently stub to #top.

DO NOT
Do not use UT burnt orange (#BF5700) or neon #FF5A00. Live orange is #f25a18.
Do not use rounded pills, 8px cards, glassmorphism except the specific nav blur and stamp frost.
Do not introduce a second display serif or a script font.
Do not italicize headlines. Emphasis is color, not slant (Barlow italic 800/900 exists in the font load but is unused on live type).
Do not put sentence-case marketing paragraphs under the H2. Ledes stay uppercase condensed.
Do not add a light theme.
Do not make the chamfer on more than the bottom-right of buttons.
Do not swap Inter in as the headline.

IF YOU ARE DESIGNING A NEW SURFACE (fan account, pass, merch PDP, ticket flow)
Keep this system. New UI should feel like a continuation of atxbulls.com, not a SaaS dashboard. Prefer hairlines, the clipped CTA, orange-on-ink, the orange invert for conversion moments, Archivo Black for the one loud sentence, Barlow Condensed for everything chrome.
```

---

## Evidence appendix

Extracted 2026-08-13 from live CSS `:root` and computed styles at viewport 824×952.

### Tokens

```css
:root {
  --ink: #080706;
  --panel: #15110f;
  --orange: #f25a18;
  --burnt: #bf4016;
  --bone: #f3eee6;
  --muted: #a79d94;
  --line: #f3eee62b;
}
html { background: var(--ink); scroll-behavior: smooth; }
body { background: var(--ink); color: var(--bone); font-family: Inter, Arial, sans-serif; }
```

### Button (verbatim)

```css
.button {
  background: var(--orange);
  min-height: 56px;
  color: var(--ink);
  letter-spacing: 0.11em;
  text-transform: uppercase;
  clip-path: polygon(0 0, 100% 0, 100% 78%, 94% 100%, 0 100%);
  justify-content: space-between;
  align-items: center;
  gap: 34px;
  padding: 0 26px;
  font: 900 14px "Barlow Condensed";
  transition: all 0.2s;
  display: inline-flex;
}
.button:hover { background: var(--bone); transform: translateY(-2px); }
.button--small { gap: 18px; min-height: 42px; padding: 0 18px; }
```

### Display type (verbatim)

```css
h1, h2, h3, .game__date {
  text-transform: uppercase;
  letter-spacing: -0.06em;
  font-family: "Archivo Black", Impact, sans-serif;
  line-height: 0.86;
}
h1 em, h2 em { color: var(--orange); font-style: normal; }
.eyebrow {
  color: var(--orange);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  align-items: center;
  gap: 12px;
  margin: 0 0 24px;
  font: 800 12px/1 "Barlow Condensed";
  display: flex;
}
.eyebrow span { background: currentColor; width: 34px; height: 3px; display: block; }
```

### Latent components (in CSS, not rendered on live pages today)

The stylesheet already defines roster/player cards (`.player` 600px on `--panel`, huge orange `.player__number`), a bone-inverted `.schedule` table, `.ticket-poster`, `.live-wire`, `.fan-game`, `.ritual`, `.experience-rule`. Treat these as the brand's own next-surface vocabulary if you are designing team, tickets, or gameday, rather than inventing a new kit.

### Site copy already in market (keep the voice)

Hero: "Austin's new main event." / "Lights out. Horns up. The most electric new show in Texas."
Ticker: HORNS UP × HARD HITS × HEART OF TEXAS
Tryouts: "The wait is over." / "Your opportunity. Your future. Our team."
Opening night: "Austin. Pick your side." / Family night, doors 5:30, kickoff 7:00, March 20, 2027
Origin: "Built on Texas pride."
Uniform: "Texas orange. Never looked better."
Merch: "Wear your horns." / Drop 001 blackout essentials
Join: "JOIN VIP LIST" / "Be first to know when tickets drop!"
Team: "Texas made. Arena ready."
OG alt: "Good men walk in. Bad Bulls walk out."
