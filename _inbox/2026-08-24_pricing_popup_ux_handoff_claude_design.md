---
id: 2026-08-24_pricing_popup_ux_handoff_claude_design
title: Pricing popup UX/UI — design-exploration handoff for Claude Design
date: 2026-08-24
status: operator-facing handoff (design only; no checkout or Stripe work)
owner: Nick (operator) + Claude Design
audience: Claude Design
---

# Pricing popup — design exploration handoff

Filed: 2026-08-24
From: planner (doc_repo / Smart Site)
To: Claude Design
Re: Rework the Smart Site pricing popup. Nick does not like the shipped version. UX/UI only.

You are doing visual and interaction design only. Do not invent prices, tier names, or entitlements. Do not design Stripe Checkout, webhooks, or the Reports dock. Produce frames of the in-app pricing surface so Nick can pick a direction before we rebuild it.

Work on the dark Smart Site chrome: satellite map behind a scrim, dark translucent card, system UI, blue `#3B82F6` as the only loud accent, no emoji, no marketing gradients, no Hauska or Empressa branding. Product name is Smart Site.

---

## 1. What shipped, and why it failed

The operator asked for "all pricing in a popup like the landing popup, so a user can see everything and navigate it," and for the right-hand dock to stop showing price cards.

What shipped is a centered modal (`min(560px)`, scrollable to `84vh`) that dumps the whole ladder as a vertical stack:

1. SMART SITE kicker + title "Pricing" + a framing sentence
2. Optional blue context box (the tool that gated, e.g. reports copy)
3. A Free row crammed on one line
4. Unlock this property — $15 (full-width button)
5. Solo — $49/mo (card + blurb + features + button)
6. Studio — $129/mo (same)
7. Team — $299/mo (same, plus a seats number input)
8. Footer: inspect card and map stay free

It copies the cold-open landing card's materials (same charcoal panel, same kicker, same border) but not its discipline. The landing card has one job and three bullets. This modal has five products, each repeating title / blurb / features / CTA. It reads as a paywall dump you scroll, not a page you navigate. Equal visual weight on Unlock, Solo, Studio, and Team. No comparison. No annual. Team seats look bolted on. The triggering-tool context box fights the header.

Nick's ruling still stands: pricing does not live in the dock. Locked tools show a value line plus **View pricing & unlock**, which opens this surface. That entry point is correct. The surface behind it is what you are redesigning.

---

## 2. The locked ladder (do not change the numbers)

| Tier | Price | What it is |
| --- | --- | --- |
| Free | $0 | Map, all layers, inspect card (zoning, setbacks, envelope, flood, land use, acreage), save, 3 AI messages per property, **share** |
| Unlock this property | $15 for 30 days (not forever) | All reports + unlimited AI on **this** property for 30 days. On-ramp. Breakeven vs Solo is ~3.3 properties |
| Solo | $49/mo · $490/yr | X-ray, flood & drainage study, unlimited AI, unlimited properties. The full answer on one parcel at a time |
| Studio | $129/mo · $1,290/yr | Solo plus professional deliverables: site-plan CAD (DXF, IFC), terrain export, **owner data** |
| Team | $299/mo · $2,990/yr for 10 seats, then $25/mo per extra seat | Everything in Studio, for a firm. Shared saved properties, one bill |
| Prospect | Coming soon on Studio and Team | Set-level answer. Ghost it. Not for sale |

Annual is two months free and should be **presentable**. The locked GTM doc says annual is the default presentation, monthly the alternative. Extra Team seats are monthly-only; an annual Team checkout cannot carry more than 10 seats. Show that constraint honestly if you show a seat control on annual.

Share is free. A shared link shows whatever the sharer stored, even to a free recipient. What is gated is what the recipient can produce on their own account.

Tiers split on **what the output is**, not volume: Free answers about a place. Solo answers about one parcel deeply. Studio produces deliverables you hand to someone else. Team does it as a firm.

Owner data is Studio, not Solo. Unlock does not include Studio-only features (terrain, CAD, owner data). When the user arrived from a Studio-only gate (terrain export), the UI must make that obvious without hiding Unlock.

Unlock expiry is a **freshness** property ("verified through [date]"), not a punishment.

There is no sales team. This surface must close the purchase without a "contact us." Team must be self-serve.

Do not pitch time saved. Architect value is cited, derived geometry, not hours.

---

## 3. Entry states you must design for

The same surface opens from several places. Design the default, then the two variants.

1. **Browse / no active parcel.** Unlock is disabled with "Inspect a property first." Subscriptions still work.
2. **Locked tool on a parcel** (Reports, Brief, Chat). A short context line is allowed if it does not steal the page. Example: "Professional reports on this property."
3. **Studio-only gate** (terrain). Unlock remains visible but marked as not covering this feature. Studio and Team are the honest path.
4. **Signed out.** Sign in first (Google / Microsoft), then the ladder. Do not make them pick a plan before they have an account unless you have a strong reason and show it.

Also draw one **already-subscribed** state (e.g. Solo user opens pricing from terrain): current plan marked, Studio highlighted as the upgrade, no second Solo checkout.

---

## 4. Options to draw (do all three)

Desktop over the live map (scrim + card or sheet). One mobile treatment per option. Use **801 PINE ST, BASTROP, TX 78602** (or 906 FARM ST) so it reads as the real app: inspect card left, map behind, this surface on top.

### Option A — Compare, then buy

A real pricing table: rows are capabilities (map & inspect, share, unlimited AI, flood study, X-ray, CAD/terrain, owner data, seats). Columns are Free / Unlock / Solo / Studio / Team. One primary CTA per column. Monthly / annual toggle at the top. Unlock column is the on-ramp, visually lighter than subscriptions.

Goal: self-serve complete. A rep would have answered from this table. Risk: wide; may need a larger sheet than 560px.

### Option B — Two beats (this property vs subscribe)

Beat 1: a quiet choice, two tiles only.

- This property — $15 / 30 days
- Subscribe — from $49/mo (or $490/yr if annual is default)

Beat 2 (only after Subscribe): Solo / Studio / Team as a comparison or three cards, plus the seat control on Team, plus the 3.3-property nudge back toward subscribe if they hesitate on Unlock.

Goal: the landing-card discipline (few choices), then navigation into the ladder. This is the closest reading of "like the landing popup" **and** "navigate everything."

### Option C — Horizontal plan cards, landing restraint

One row of three subscription cards (Solo, Studio, Team), annual as default with a monthly switch. Unlock is a compact secondary path under the row ("or unlock just this property — $15 / 30 days"), not a peer card of equal height. Free is a one-line caption, not a product card. Prospect is a "coming soon" chip on Studio/Team.

Goal: looks like a pricing page people already know how to use. Unlock does not compete with Solo.

### Optional fourth sketch

A **full-page pricing route** (`/pricing`) that the popup can grow into, with the in-app modal as a short version. Only draw this after A–C. Label whether the in-app surface is a summary that links out, or the full page itself. Nick has not asked for a marketing site page; this is only if the popup cannot hold a self-serve-complete table.

---

## 5. Copy you may use (do not rewrite prices)

- Header: Pricing
- Framing (you may tighten): "Start free. Unlock one property. Or subscribe."
- Unlock: "Unlock this property — $15" / "All reports + unlimited AI on this property for 30 days"
- Unlock disabled: "Inspect a property first to unlock it."
- Studio-only note: "This feature is not part of the single-property unlock. It needs Studio or Team."
- Solo blurb: "The full answer on one parcel at a time"
- Studio blurb: "Deliverables you hand to someone else — CAD, terrain, owner data"
- Team blurb: "The firm plan. Shared properties, one bill."
- Seat note: "10 seats included, then $25 per seat"
- Annual note: "2 months free"
- Nudge: "Unlocking more than a few properties? Solo covers unlimited properties."
- Free footnote: "The inspect card and map layers stay free. Share is free."
- Prospect: "Coming soon"
- CTA verbs: Unlock / Start Solo / Start Studio / Start Team. Not "Subscribe" on every button.

You may rewrite framing and blurbs for scannability. You may not change $15, $49, $129, $299, $490, $1,290, $2,990, $25/seat, or 30 days.

---

## 6. Product laws

1. One pricing surface. Dock stays price-free.
2. Fail honest. Disabled Unlock says why. Studio-only says Unlock will not unlock that feature. Do not hide a tier.
3. No "contact sales." Team closes here.
4. No fake success, no "coming soon" on a purchasable tier.
5. Annual default is preferred if you show interval at all. Monthly must remain one click away.
6. Do not put Reports catalog design in this brief. If a capability row helps the table (CAD, flood, owner data), name the capability; do not design the report.

---

## 7. What success looks like

Nick can look at three visuals and answer:

1. Is Unlock a peer of Solo, or a smaller on-ramp?
2. Is annual the default?
3. Does Team look like a real firm plan (seats included) or a bolted-on input?
4. Can a stranger understand Free vs Unlock vs Solo vs Studio in five seconds?
5. Does the surface still feel like Smart Site (map, quiet, one accent) or like a generic SaaS paywall?

You do not decide. Draw so he can.

Deliver: frames labeled Option A/B/C, plus the entry-state variants on at least Option B. One paragraph per option on what you optimized for. No implementation spec. No Stripe screens.
