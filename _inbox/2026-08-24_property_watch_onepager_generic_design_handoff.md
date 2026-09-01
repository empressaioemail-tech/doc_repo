---
id: property_watch_onepager_generic_design_handoff
title: Design handoff — REVISION to generic Property Watch one-pager (architecture client)
date: 2026-08-24
status: handoff
audience: Claude Design (revision session) → Nick → architecture practice client
owner: nick
supersedes_in_part: _inbox/2026-08-23_alan_watch_app_design_handoff.md
related: [65_sensors/positioning_and_brand, 65_sensors/watch_app_spec, portfolio_thesis/01_the_layer_and_the_three_doors]
---

# Design handoff: REVISE Property Watch one-pager (generic / architecture client)

## What this is

A **revision** of the one-pager you already produced from `_inbox/2026-08-23_alan_watch_app_design_handoff.md`. Keep what worked: **two mobile screenshots**, same visual system, same layout quality. Change the **framing, copy, and mockup details** so the page is **generic value proposition**, not a pilot onboarding doc for a named operator.

**Do not start from zero** unless you no longer have the prior art. **Revise** screens and rebuild the one-page layout around the new copy below.

---

## Who will see this

An **architecture practice client** (developer or owner-side) planning a **new student-housing duplex**. Nick is the architect. The page shows how **Property Watch** fits a building like theirs — early warning and a durable record — without reading like a vendor implementation checklist.

**Building context for realistic mockup labels** (use in UI copy only; no floor plans on the page):

| Fact | Detail |
|------|--------|
| Type | Duplex, student housing |
| Layout | **6 bedrooms per side** (12 total), each bedroom with **en suite bath** |
| Shared | **Common kitchen and dining** per side; **common laundry**; **common bath** |
| Stories | **Three stories** |
| Implied pains | Vertical risers across three floors; many wet rooms; vacancy over breaks; one operator, small maintenance roster |

Placeholder building name for screenshots: **Campus Duplex** (subtitle: *Student housing · 3 stories · 12 beds*).

Remove all references to: Waypoint, Alan Hoffman, Riverview Hall, Minnesota, pilot, discovery call, kit pricing, sensor SKUs, hardware dollar amounts.

---

## Page structure (single letter PDF, one side)

Design the **full one-pager**, not only the phone frames. Suggested layout:

```
┌─────────────────────────────────────────────────────────┐
│  HEADLINE + one-line subhead                            │
│  [optional: 3 short value pillars in a row]           │
├──────────────────────┬──────────────────────────────────┤
│  Screenshot 1        │  Screenshot 2                    │
│  (owner view)        │  (staff pre-alert / walkthrough)   │
├──────────────────────┴──────────────────────────────────┤
│  "How it works" — 3–4 sentences                         │
│  "Why it fits student housing" — 3 bullets              │
│  "What you get" — 3 bullets (outcomes, not sensors)     │
│  Footer: one soft CTA line                              │
└─────────────────────────────────────────────────────────┘
```

**Leave off entirely:** sensor hardware list, LoRaWAN/gateway detail, "what you provide to get started" checklist, pricing, pilot language, per-watch technical breakdown list from the Alan version.

---

## Visual direction (unchanged from v1)

Keep the prior mockup style unless a revision clearly improves it:

- Quiet, professional, list-first mobile UI
- Inter + mono for readings
- Background `#F7F8F6`, ink `#16202A`, accent teal `#177F78`
- Act-now / pre-alert styling restrained, evidence-forward
- No glass cards, no "IoT platform" chrome, no fake logo required
- Product name on page: **Property Watch** (subtitle optional: *part of Smart Site* — small, not dominant)

---

## Screenshot 1 — Owner / developer view (REVISE labels only)

Same **screen pattern** as v1 (portfolio / building summary). Update content:

| Element | Revised content |
|---------|-----------------|
| Building | **Campus Duplex** · Student housing · 3 stories |
| Status line | **Live** or **Watches armed** (pick one; avoid jargon) |
| Watch chips | `Freeze watch` · `Water watch` · `Energy watch` — all **armed** or **on** (no sensor counts) |
| Forecast banner | "Hard freeze expected Thursday night. Suggested walkthrough for vacant beds." |
| Ledger strip | "This season: alerts answered · events on record" (generic; no fake savings numbers) |
| Open events | 1 informational · 0 urgent |

Persona label for the one-pager caption (small text under frame): *Owner view — status across the building.*

---

## Screenshot 2 — Staff pre-alert (REVISE for duplex + student housing)

Same **screen pattern** as v1 (informational freeze pre-alert + walkthrough). Update checklist labels to match the building:

| Element | Revised content |
|---------|-----------------|
| Alert header | **Freeze pre-alert** · Informational |
| Evidence | "Forecast low 9°F Thursday 2–8 AM · North riser 41°F · Source: weather + building" |
| Action | **Start walkthrough** (e.g. 8 stops) |
| Checklist preview (3 visible) | "Bed 4 — verify heat" · "Bed 5 — verify heat" · "Laundry — visual check" |
| Note | "Urgent alerts also go by text message." |

Use **bed / laundry / riser** language, not "Unit 204" apartment numbers.

Persona caption under frame: *Staff view — before a cold night.*

---

## Copy blocks — paste onto the one-pager (REPLACE Alan version entirely)

### Headline

**Property Watch**

### Subhead (one line)

**Early warning for the building — before a pipe freezes, a leak spreads, or a break week turns into damage.**

### Value pillars (three short lines — optional row under subhead)

| Pillar | Line |
|--------|------|
| **See it coming** | Forecast and live readings combined — not a generic alarm. |
| **Right person, right time** | Staff get a clear task list on their phone; owners see the whole building. |
| **A record that stays** | Who was notified, who responded, and what was found — on the building's history, not lost in a text thread. |

### How it works (max 4 sentences)

The building carries a **live record**: where water runs, which rooms are vacant over break, who is on call. **Property Watch** puts named watches on that record — freeze, water, and energy — and notifies staff when something is worth acting on. Before a hard freeze, the app can issue a **walkthrough** for vacant beds and shared spaces. Every alert shows **why it fired**, with source and time, and the response is logged for the owner.

### Why it fits student housing (3 bullets)

- **Break weeks** — vacant beds and shared kitchens are exactly when heat drops and pipes fail; the watch knows the occupancy pattern.
- **Many wet rooms** — en suite baths, common laundry, and vertical risers on three stories mean small leaks and cold snaps show up in the structure, not only in one unit.
- **Small teams** — one maintenance roster, many rooms; the phone becomes the run sheet, not another dashboard to babysit.

### What you get (outcomes — NOT a sensor list)

- **Freeze watch** — weather plus pipe and riser awareness; walkthroughs before cold nights.
- **Water watch** — early notice when something is wet or flowing when it should not be.
- **Energy watch** — unusual use patterns that often mean equipment trouble (when utility data is available).
- **Owner and staff apps** — portfolio view for the owner; alerts and checklists for the people in the building.
- **Spec-ready for new construction** — the live layer can be **designed in** with the building, not bolted on after move-in.

### Soft CTA (footer, one line)

**Ask how to include Property Watch in your project — from design through first occupancy.**

Optional second line, smaller: *We watch the building, not the residents — no cameras, no room surveillance.*

(That line is scope honesty, not a headline. Keep it small in the footer if used at all.)

---

## Vocabulary — unchanged rules

| Use | Avoid |
|-----|-------|
| Property Watch, building, watches, staff, walkthrough, record, live | digital twin, IoT platform, sensor network, monitoring solution |
| freeze watch, water watch, energy watch (as capabilities) | LoRaWAN, gateway, DevEUI, kit, pilot, SKU list |
| early warning, on record, designed in | prevents, guarantees, saves $X |

Do not promise insurance discounts, dollar savings, or "prevents all damage."

---

## Deliverables

1. **One complete one-pager** — PDF-ready layout (letter, portrait), headline through footer, both screenshots embedded.
2. **Two PNG exports** — revised screenshots at 2×, matching the generic Campus Duplex content.
3. **Source file** — HTML, Figma, or whatever you used in v1, updated in place.
4. **Note to Nick** — one sentence on what you changed from the Alan version.

---

## Explicitly out of scope

- Sensor hardware list or BOM
- Implementation checklist ("what the client must provide")
- Pricing, subscription tiers, contract language
- Alan / Waypoint / any named customer
- Floor plans, 3D, or architectural drawings of the duplex
- Assisted living, city, or SCADA angles

---

## Revision checklist (self-verify before handback)

- [ ] No named operator or pilot language anywhere
- [ ] No sensor shopping list or dollar hardware figures
- [ ] Mockups say Campus Duplex / student housing / beds & laundry, not apartment units
- [ ] Page reads as **value prop + product vision**, not onboarding
- [ ] Two screenshots still match v1 quality and visual system
- [ ] Architect "design it in" angle appears once in copy, not as a sales checklist
