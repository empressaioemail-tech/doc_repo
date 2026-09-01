---
id: 2026-08-17_claude_design_prompt_3_compass
title: Claude Design prompt 3 — Compass sheet + SmartSite atom render (complete handoff)
status: draft
last_updated: 2026-08-17
applies_to: smartcity
owner: nick
related:
  [
    2026-08-17_claude_design_prompt_1_design_system,
    2026-08-17_claude_design_prompt_2_platform,
    2026-08-17_claude_design_session1_visual_law,
    _decisions/2026-08-17_smartcity_visual_law,
    _decisions/2026-08-17_smartcity_product_line_design_system,
    30b_smartcity_design_system,
    30c_smartcity_platform_ia,
    2026-07-29_pe_ai_chat_atom_citations_spec,
  ]
---

# Prompt 3 — paste this as one complete Compass pass

You already set the SmartCity product-line design system and the platform IA. **Use only those tokens and components.** Frozen law stays frozen: quiet surfaces, loud exceptions, honest absence; register not card deck; sidebar; inverted applicability; Inter + IBM Plex Mono, 12px floor on body; environment badge is the only amber in chrome; not-built nav; provenance chip; code citation with no body slot. Do not reopen those.

This session designs **Compass only**. Not the four-product IA again. Not a restyle of live `smartcityos.io`. Not production code. Not a commit. Not a copy of old Compass.

Compass is the assistant slot that follows the user across Dashboards, Smart Files, Plan Review, and Asset Management. One collapsed or expanded state. Not a full-page chatbot. Not a third product in the nav.

## What you must not look at

Do **not** use old Compass as a visual or interaction reference. That includes `/ask-smartcity`, the Bastrop header overlay chatbot, the Mox sidebar, AskSmartCity bubbles, and any Compass checkout you can still open. That version is old and outdated. Copying it is a defect.

Do **not** invent a new atom card. Do **not** use a chat-bubble aesthetic, an AI badge, a sparkle, or a second Leaflet.

## What you must look at

**SmartSite is the family source for how atoms render.** It is the most recent surface and it is part of the family. Live: `https://smartsite.cloud`. The implementation lives in Property Explorer (`hauska-map` / `apps/property-explorer`): `shared/atom-chip` (InspectCard) and the workbench chat accordion (`ChatTool` `AtomCardView`).

Open SmartSite. Click a parcel. Look at the inspect chips on Zoning / Setbacks / Buildable. Then open Deep Research and look at how a cited answer grows a chip into BRIEF, then more, then FULL, then a lineage walk. That is the atom language. Compass uses that language inside SmartCity chrome.

Hauska, ICC-demo, and Command Center stay out of this kit. SmartSite's **product chrome** is not copied. SmartSite's **atom render** is.

## Two jobs, do not collapse them

1. **Compass chrome** is a shared-element sheet: present, dismiss, maximize. Apple present/dismiss, not a page route and not a center-screen modal.
2. **Atom language inside the sheet** is SmartSite's: reserved chip, fetch-on-tap, BRIEF, more, FULL, lineage walk, honest degrade.

The sheet is how Compass arrives. The chip accordion is how evidence opens. They are separate objects.

---

# Part A — Compass chrome (shared element transition)

## Ticket sentence (pin this)

Panel expands from the tapped element's rect using a shared element transition, spring eased, with corner radius interpolating from tile to container, content fading in on a short delay, and the underlying surface scaling up slightly and dimming.

## Vocabulary (use these words; they are the brief)

The umbrella term is a **shared element transition**, also called a **hero transition** or **matched geometry transition**. Apple's names: **zoom transition** (UIKit) and **matchedGeometryEffect** (SwiftUI). The small thing and the big thing are the **same object changing size**, not two views swapping places.

Five things happen at once. Skipping any one is why copies feel off.

1. **Origin anchoring.** The panel grows from the exact position of the element you tapped, not from the center of the screen. The transform origin is the **source rect**. This is what makes the content feel like it came from somewhere.
2. **Corner radius interpolation.** Corners animate from the source's radius down to the sheet's radius over the same duration. Skipping this is the single most common reason a copy feels wrong. Use a **continuous corner curve** (squircle), not a circular arc.
3. **Spring physics, not easing curves.** Damped spring: mass, stiffness, damping. Fast start, a slight settle at the end, no perceptible stop. Duration reads as roughly 350 to 500ms but is a function of the spring, not a fixed ease-in-out.
4. **Content crossfade with a delay.** Destination content fades in slightly after the container starts growing, clipped inside the expanding frame. The container leads. The content follows.
5. **Background recession.** Whatever the panel launched from scales up a few percent and dims or blurs behind it, so there is a z-axis between layers. Closing reverses the same five.

The property that makes it feel alive rather than canned: animations are **interruptible and velocity preserving**. You can grab the panel mid-open and drag it back. It reverses from current position and speed. It does not finish, then restart.

## Build technique (for whoever implements)

Name: **FLIP** (First, Last, Invert, Play). Measure the source rect. Measure the destination rect. Apply an inverting transform so the destination starts looking exactly like the source. Release it. **Transform-based**, not animating width and height, so it stays on the compositor.

Three web paths, pick one and name it in the spec:

- **Framer Motion `layoutId`** on both the source control and the panel. Closest to `matchedGeometryEffect`. Spring, interruptibility, layout matching for free. Starting spring that lands near iOS: `{ type: "spring", stiffness: 320, damping: 32, mass: 0.9 }`. Tune damping until the settle is just barely perceptible.
- **View Transitions API** with `view-transition-name`. Native, less spring control.
- **Hand-rolled FLIP** with the Web Animations API if you want no dependency.

This session is design. Spec the motion. Do not ship a production implementation. If you mock it, the mock must show origin-from-source, radius interpolation, delayed content fade, and background recession. A center-screen fade is a fail.

## Motion exception (named, Compass only)

The design system caps ordinary motion at 180ms (`--sc-dur-3`) and says data never animates. That law still holds for numbers, rows, and skeletons.

Compass present, dismiss, and maximize are a **named spring exception**. They are allowed to read 350 to 500ms because they are a shared-element transition, not data motion. Nothing else inherits this exception. `prefers-reduced-motion` still zeroes it: reduced-motion users get an instant present/dismiss with no spring and no scale.

Do not reopen the 180ms cap for drawers, dialogs, or row enters.

## Source, states, and maximize

**Source control.** One control in the shell (sidebar slot or top-bar utility: pick one and keep it). That control is the source rect. Compass is not a nav item that routes to a page.

**Collapsed.** The source control at rest. Scope line is visible in a whisper: city + current lens. No unread-dot theater. No AI badge.

**Presented (default sheet).** A right-hand sheet that **is** the source control, grown. Not a new layer that appears beside it. Width: roughly 360 to 420px on desktop, full-bleed on a narrow viewport. It does not cover the whole work surface.

**Maximized.** A second shared-element step from the presented sheet to a near-full work surface (leave the sidebar and environment badge). Maximize is the same object again, not a route. A control on the sheet does this. Dismiss from maximized reverses through presented or straight back to the source; pick one and keep it. Do not invent a third chrome.

**Dismiss.** Reverse the five properties. Drag-to-dismiss is required in the spec even if the mock only implies it: interruptible, velocity preserving, rubber-band if you drag the wrong way.

**One Compass.** One instance for the signed-in user across all four products. Switching lens or product does not spawn a second sheet. Thread is scoped to city + lens. Switching city or lens re-scopes; it does not keep the previous city's atoms on screen.

**Not a page.** No `/compass`. No full-page chat. No nested header inside the sheet.

---

# Part B — Atom language (copy SmartSite, retoken to the kit)

## Reserved atom accent

SmartSite reserves `#4CC9C0` for atoms and nothing else. That rule ports. In this kit the token is `--sc-atom`. It is **not chrome**. Amber stays the environment badge only. Teal-as-glow, teal-as-hero, and teal-as-everything are still forbidden. `--sc-atom` means "this is openable recorded evidence." Numbers, emphasis, and web or unverified links use a different color and never wear the atom chip.

Chip type: Inter for the label. IBM Plex Mono for the DID and any identifier. Body of BRIEF/FULL is Inter at the 12px floor. The chip itself may stay compact (SmartSite is ~9.5px) so it still reads as a citation, not a button. That compact chip is the only density exception.

## Two SmartSite surfaces, both in Compass

### 1. Fact-row chip (InspectCard)

A reserved-accent pill on a fact (zoning, setback, envelope, a finding citation, a file provenance). Tap opens **one** detail under or beside that row: label, source, never-bare confidence (`value · basis` or nothing), as-of, access policy, DID. Re-tap closes. One open at a time. Fetch-on-tap. A dead DID says "Full record unavailable." The chip never breaks.

This is the small popover. It is not the Compass sheet. A chip on a dashboard row does not launch Compass.

### 2. Answer accordion (Deep Research / ChatTool)

Numbered citations in an answer become the same reserved chips. Tap grows an accordion **inside the answer**, not a modal and not a second page:

1. **BRIEF immediately** from the local citation: claim, snippet, source · method, confidence with basis, freshness, as-of, access.
2. Enrichment layers on when the atom record lands (`GET atoms/:did`).
3. **more →** opens **FULL**: calibration honesty line ("asserted, not earned" when that is true), source citation, "Open cited source," then the lineage walk.
4. **Computed from** / **Would affect** are chips. Tap **swaps the card in place**. **← back** walks the graph. Absent links render nothing. Do not fabricate relationships.
5. **less ←** collapses. One card open per answer.

Streaming: a half-written citation is held. Raw markup never flashes.

Web or unverified sources are visually distinct and labeled unverified. They are never atom chips.

## Honesty rules (non-negotiable)

These are already visual law. They are also SmartSite law. Restate them on the Compass components so they cannot be "simplified" in the mock.

1. **Never-bare confidence.** Value and basis together, or the number is omitted.
2. **Earned vs asserted.** Most atoms today are asserted. Show that. Do not dress an asserted fact as calibrated.
3. **Gated serve.** Forbidden, unknown, and unservable look the same. Degrade to local BRIEF plus "full record unavailable." Never a broken chip. Never leak "forbidden."
4. **Honest empty.** No citable atoms: no chips. Plain prose. Do not invent citations to look authoritative.
5. **Read-time freshness.** Computed at read, not a stored flag. Fresh is quiet. Stale is louder.
6. **Anti-fabrication.** Chips only for real atoms in the current city + lens scope. A chip that points at nothing is worse than no chip.
7. **ICC.** Licensed code citation: full canonical title, no body slot. Local UDC may quote. The chip marks which.

## What Compass answers look like

Not a bubble. Not a transcript of rounded pills. A **register of turns**: user line in Inter, assistant line in Inter, chips inline, accordion clipped to the sheet. Composer pinned at the bottom. Scope line above the thread: city + lens + environment. Starter prompts are allowed if they are jobs ("What is open on this case?", "What is actually connected in Finance?"), not personality.

The sheet can cite atoms from the current lens. It does not become a second Plan Review. It does not become SmartSite. If the user is on a parcel in Development / Place, chips may be property atoms. If the user is on a review, chips may be findings and code atoms. If the user is on Files, chips may be file provenance. Cross-lens citation is in-scope only when that atom is actually on the current record.

---

# Part C — What to produce this session

One artifact. Kit tokens only. No second look.

1. **Source control** in the shell, collapsed, with scope whisper.
2. **Present** from that control: shared-element sheet, origin-anchored, radius interpolating, content delayed, background receding.
3. **Thread** in the sheet: two or three turns, at least one answer with two atom chips.
4. **One chip in BRIEF.** One chip taken to FULL with a real lineage walk (computed-from chips, back). One degraded chip ("full record unavailable") that does not break.
5. **One fact-row chip** on a Place or Review row **behind** the receded surface, so the difference between row-popover and Compass sheet is visible.
6. **Maximize** from the presented sheet, same object.
7. **Dismiss** reverse, including a still that implies interruptible drag.
8. **Reduced-motion** still: instant present, no spring, no scale.
9. **A short motion spec** in the artifact (or a sibling note): FLIP, the five properties, the named spring exception, the starting spring `{ stiffness: 320, damping: 32, mass: 0.9 }`, and which web path you recommend (Framer `layoutId` unless you have a reason).

Also patch, in place if you already own them:

- `30b`: add `--sc-atom` and the Compass spring exception. Do not raise the 180ms cap for anything else. Provenance chip and atom chip are cousins: provenance is source+time on a value; atom chip is openable recorded evidence. Do not merge them into one component that lies.
- `30c`: Compass is no longer "one rail state." It is the source control plus the shared-element sheet plus maximize. Update the Compass row and the "not mocked" line that froze the assistant as rail-only.

## Stop

When the artifact shows present, maximize, dismiss, BRIEF, FULL, lineage, and degrade: **stop**.

Do not `git add`. Do not commit. Do not push. Do not copy tokens into product repos. Do not restyle `smartcityos.io`. Do not open old Compass. Do not design a Compass page. Do not add charts. Do not invent hydrants, payments, or a second map.

If Files and AM close-out from the previous prompt is still unfinished, finish that first, then do this pass. Do not interleave.
