---
id: alan_watch_app_design_handoff
title: Design handoff — Property Watch mobile mockups for Alan Hoffman one-pager
date: 2026-08-23
status: handoff
audience: Claude Code (design session) → Nick → Alan Hoffman (Waypoint Management)
owner: nick
related: [65_sensors/watch_app_spec, 65_sensors/pilot_waypoint, 65_sensors/positioning_and_brand, _sessions/2026-08-06_alan_claude_code]
---

# Design handoff: Property Watch mobile mockups (Alan one-pager)

## Your job

Produce **two mobile screenshots** (iPhone 15 Pro frame, 393×852 logical) plus the **copy blocks** below them so Nick can paste everything into a **single-page PDF** for Alan Hoffman. This is a sales one-pager, not a full app spec. Show enough UI that Alan can picture his maintenance team using it on a freeze night.

Do **not** design a third brand. This is the **Field Companion** surface inside **Smart Site** / **Property Watch**. No "IoT platform," no "digital twin" in any customer-visible copy.

---

## Audience

**Alan Hoffman** — owner/operator, Waypoint Management. Multifamily: student housing and assisted living, Minnesota. His pain: pipes freeze when tenants leave heat off over winter break; water damage; no early warning today. He said he'd buy pipe-freeze early warning if it existed. He is the **owner persona** on the one-pager; his **maintenance staff** are the people who get alerts and run walkthroughs.

Pilot building (placeholder name for mockups): **Riverview Hall** — student housing, ~80 units, Minnesota.

---

## Visual direction

- **Feel:** Serious operating tool a property manager would show another manager. Quiet surfaces, loud exceptions. Not a SaaS landing page, not glowing govtech glass cards.
- **Layout:** List-first. Structured rows with live state — no 3D floor plans, no map hero.
- **Typography:** Inter (UI), system sans fallback. 12px minimum body. Numbers and readings in a mono face (SF Mono / JetBrains Mono).
- **Color:** Calm neutral background (off-white `#F7F8F6` or near). Ink `#16202A`. **Accent teal** `#177F78` for primary actions and "armed / healthy" watch state. **Act-now** uses a restrained warm red/orange border or banner — not alarm-red flashing. Informational tier is muted blue-gray.
- **Density:** High signal. Every alert shows **why** (reading + source + time), not just "alert."
- **Reference mood:** Linear / Stripe dashboard clarity, not Palantir, not consumer weather apps.

---

## Screenshot 1 — Owner portfolio (Alan's home screen)

**Persona:** Alan, operator, glancing at phone between meetings.

**State to show:** Winter season. One building in portfolio for the pilot (Riverview Hall). Freeze watch **armed**. One informational pre-alert open ("Hard freeze forecast Thursday night"). Zero act-now events (calm default — exceptions are loud when they happen).

**Must include on screen:**

| Element | Example content |
|---------|-----------------|
| Header | "Waypoint" or "Your buildings" — keep generic, no fake product logo required |
| Building row | **Riverview Hall** · Student housing · Minnesota |
| Watch chips | `Freeze watch` armed · `Water watch` armed · `Energy watch` connected |
| Forecast banner | "Hard freeze Thursday night — 8°F. Walkthrough suggested for vacant units." |
| Season ledger strip | "This season: 2 pre-alerts · 0 pipe events · Last freeze night: handled" |
| Open events | 1 informational · 0 act-now |
| Footer nav (optional) | Buildings · Alerts · (no need to design full nav) |

**Do not show:** Per-sensor pricing, technical radio jargon, "digital twin," floor plans.

---

## Screenshot 2 — Freeze pre-alert + walkthrough (staff phone)

**Persona:** Maintenance staff member (e.g. "Jordan") — the person on the roster who gets the push at 4pm before a cold night.

**State to show:** Informational tier freeze pre-alert. App generated a **vacant-unit walkthrough** checklist from the building record (break week; units known vacant).

**Must include on screen:**

| Element | Example content |
|---------|-----------------|
| Alert header | **Freeze pre-alert** · Informational |
| Evidence block | "Forecast low 8°F Thursday 2–8 AM · North riser currently 42°F · Source: NWS + RT-1" |
| Timestamp | "Issued today 4:12 PM" |
| Action | Primary button: **Start walkthrough** (12 stops) |
| Checklist preview | First 3 stops visible: "Unit 204 — verify heat ≥ 55°F" · "Unit 211 — verify heat ≥ 55°F" · "North riser closet — visual check" |
| Acknowledge | Secondary: **Acknowledge** (names the person on the ledger) |
| Note | Small line: "Act-now alerts also sent by text message." |

**Optional third screen (only if fast):** Act-now variant — "North riser 36°F and falling" with red/orange accent. Not required for v1 of the one-pager.

---

## Copy blocks (Nick pastes these beside the screenshots on the one-pager)

### Headline (top of page)

**Property Watch — early warning for your buildings**

### How it works (4 sentences max)

Your building gets a live record: where the pipes run, which units are vacant over break, who gets called. **Freeze watch** joins weather forecast to pipe and riser readings. Before a hard freeze, staff get a walkthrough list for vacant units. If a pipe actually gets cold, the right person gets an alert on their phone and by text — with a timestamped record of who responded.

### What we watch (bullet list, customer language)

- **Freeze watch** — forecast + pipe temperature on risers and mechanical spaces
- **Water watch** — leak sensors at high-risk spots + supply-line pressure (catches drips before a floor gets wet)
- **Energy watch** — utility meter patterns (when master-metered) for equipment faults

### What Alan provides to get started (checklist — this is the ask)

1. **Pick one building** for the pilot (student housing recommended first).
2. **Drawings or plans** you already have — as-builts, renovation sets, anything.
3. **Confirm master metering** — who pays utilities; access to interval meter data if available.
4. **Staff roster** — who gets alerts (names and mobile numbers); current freeze protocol today.
5. **Break calendar** — when units go vacant over winter break (drives the walkthrough list).
6. **One-hour install window** — a maintenance person (or our arranged installer) follows a labeled kit guide; ~1 hour, no wiring.
7. **One opt-in unit** (optional) — one tenant agrees to an ambient sensor + under-sink leak sensor for the pilot.
8. **30-minute discovery call** — confirm internet for the gateway, mechanical room access, past freeze incidents (so we know what "success" looks like).

### What we provide

- Small sensor kit (~$775 hardware, you own it) — bench-tested before it ships
- Phone install guide (station by station, photo confirm each step)
- The app (maintenance alerts, walkthroughs, owner portfolio view)
- **Forecast freeze watch free** on day one, before any hardware ships

### Footer line

Pilot scoped for Waypoint Management · No pricing on this page · Questions on the discovery call

---

## Deliverables back to Nick

1. **Two PNG exports** — Screenshot 1 (portfolio) and Screenshot 2 (pre-alert/walkthrough), transparent or white background, 2× resolution.
2. **Figma/HTML source** if you built one — optional.
3. **Confirm** copy blocks above are unchanged (or flag if you tightened wording).

---

## Vocabulary — use / avoid

| Use | Avoid |
|-----|-------|
| freeze watch, water watch, building, staff, walkthrough, alert, record | digital twin, IoT, sensor platform, monitoring solution |
| armed, pre-alert, act-now (sparingly) | prevents (absolute), guarantees |
| senses (only if needed) | LoRaWAN, gateway, DevEUI, MCP |

---

## Canon references (read only if you need more)

- `65_sensors/watch_app_spec.md` — full app flows
- `65_sensors/pilot_waypoint.md` — pilot sequence and kit
- `65_sensors/positioning_and_brand.md` — claims discipline
- `_sessions/2026-08-06_alan_claude_code.md` — session of record

---

## Out of scope for this design session

- Full onboarding flow, commissioning QR scan, inventory label-capture, native app chrome
- Pricing, contract terms, assisted-living-specific UI
- Desktop layouts, marketing website, install guide (already exists separately)
