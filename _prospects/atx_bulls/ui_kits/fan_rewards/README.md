# UI kit — ATX Bulls Fan Rewards (mobile app)

A click-through fan rewards app at 390×844, built entirely from this design system's components.

**This surface does not exist yet.** The brand ships a marketing site only. Everything here is a
*new surface designed on the existing system* per the brief's instruction: keep hairlines, the
chamfered CTA, orange-on-ink, and the orange invert for conversion moments — never a SaaS dashboard.

## Flow
1. **Sign in** — blackout hero, uppercase lede, email capture, "Get in the arena".
2. **Home** — points meter, next-game orange invert panel, weekly challenges, ticker, featured reward.
3. **Rewards** — filter tabs, 2-up catalog, chamfered confirm dialog, balance updates live.
4. **Game day** — ticket stub, gate check-in (+250 points), venue facts, streak progress.
5. **Rank** — season / game day / friends standings; the fan's own row inverts to orange.
6. **Me** — tier ladder, notification switches, account rows.

## Files
`index.html` (mount) · `AppShell.jsx` (frame, header, routing, toasts, sign-in) ·
`HomeScreen.jsx` · `RewardsScreen.jsx` · `GameDayScreen.jsx` · `RankScreen.jsx` ·
`ProfileScreen.jsx` · `data.js` (sample content on `window.ATX_DATA`)

## Notes
- Reward photography is intentionally empty (hairline grid panels). Drop real merch and arena
  photography in when it exists — do not substitute stock.
- "Horn points" is the working name for the currency. Tiers are Rookie / Starter / Captain / Legend.
