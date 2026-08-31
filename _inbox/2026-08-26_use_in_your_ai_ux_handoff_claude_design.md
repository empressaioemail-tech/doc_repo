---
id: 2026-08-26_use_in_your_ai_ux_handoff_claude_design
title: Use in your AI — in-app button and OAuth consent, design handoff for Claude Design
date: 2026-08-26
status: operator-facing handoff (design only; no MCP or OAuth implementation)
owner: Nick (operator) + Claude Design
audience: Claude Design
plan_row: P-87
wdll: _inbox/2026-08-26_smartsite_ai_connector_WDLL.md
decision: _decisions/2026-08-26_smartsite_product_mcp_and_ai_connector.md
---

# Use in your AI — design exploration handoff

Filed: 2026-08-26
From: planner (doc_repo / Smart Site)
To: Claude Design
Re: Design the in-app control and the Smart Site half of the auth flow that lets a signed-in user run Smart Site from Claude, ChatGPT, Cursor, or Copilot.

You are doing visual and interaction design only. Do not invent tools, prices, tiers, or a second product. Do not draw an API-key screen. Do not brand this Hauska or Empressa. Product name is Smart Site.

Work on the dark Smart Site chrome: satellite map behind, dark translucent panels, system UI, blue `#3B82F6` as the only loud accent, no emoji, no marketing gradients. Use **801 PINE ST, BASTROP, TX 78602** (gold `48021:34137`) so it reads as the real app: inspect card left, map behind, this surface on top.

---

## What you are designing

Two surfaces, one job.

**Surface A — in the map app.** A signed-in control that opens a small sheet: pick the AI console you already use, connect it to this Smart Site account. After it is connected, the same sheet says so and lets you disconnect.

**Surface B — the consent page we own.** When Claude (or Cursor) redirects here for OAuth, the user sees a Smart Site page: who is asking, which Smart Site account will be used, what that account can do at their tier, Approve or Deny. This is not a Claude screen. It is ours. It must feel like the same product as the map.

You are not designing Claude's "Add custom connector" dialog, ChatGPT's developer-mode settings, or a Cursor config file. Those belong to the vendors. You may show them as a simple "other window" beat so the story is complete, but do not invent a fake one-click inside Claude.

---

## The job, in one line

A Studio user stays signed into Smart Site, clicks once, approves once, and their Claude chat can find a parcel, open its smart site, list their properties, run a report, request records, and export, at Studio. They never see a key. Their Free friend who connects gets Free: map and inspect, not Studio reports.

Tiers travel. The connector is not a new SKU.

---

## What the user can do once connected (do not add more)

These are the eight jobs the connector exposes. Design copy around this list. Do not invent a ninth.

1. Find a parcel
2. Get its smart site
3. List my properties
4. Run a report
5. Request records
6. Check a request
7. Export an instrument
8. Ask the map

The interactive map stays on `smartsite.cloud`. Chat gets the reasoning, citations, reports, and files. Do not draw a mini-map inside Claude.

---

## What you must not draw

- An API key, `X-Hauska-Key`, Bearer token, Cloud Run URL, or "paste this into your config."
- A Connect button that works before OAuth exists. If the backend is not live, the control is absent or a quiet Coming soon chip. Never a fake Connect.
- Hauska, Empressa, "MCP server," "product key," or developer jargon on a customer frame. "Use in your AI" / "Connect Claude" is the language. MCP is the mechanism, not the label.
- A second pricing ladder. If they need Studio, the existing pricing popup opens. This sheet is not checkout.
- Per-answer prices. Access is the tier they already have.
- ChatGPT as a working Connect if that account class cannot complete per-user MCP. The row says unavailable and why. Honesty over symmetry.

---

## Surface A — the in-app control

### Where it lives

Signed-in chrome. Not in the Reports dock. Not a locked-tool paywall. Not on the anonymous lander.

Draw two placements and pick one:

1. **Account cluster** (preferred). Next to the signed-in identity (email / avatar / plan chip). Same weight as account, quieter than Share.
2. **Share adjacency.** Near Share, because both are "this work leaves the map." Share is for a person. This is for their AI.

Do not put it on the inspect card as a fourth CTA. Inspect already has research, save, share.

Signed out: the control is not shown, or it is shown and the first beat is sign in (Google / Microsoft, the existing path). Do not make them pick Claude before they have an account.

### The sheet

Title: **Use in your AI**
One sentence: Your Smart Site account, in the chat you already use. Same plan. No key.

Four rows, always in this order:

| Row | When Connect is real | When it is not |
| --- | --- | --- |
| Claude | **Connect** | Coming soon, or Connected |
| ChatGPT | **Connect** only if that user's ChatGPT class can finish per-user MCP | **Unavailable** plus one honest line (e.g. "ChatGPT needs a Business or Enterprise workspace for this. Claude works today.") |
| Cursor | **Connect** (opens a two-step: we copy the server URL, they finish in Cursor) | Coming soon |
| Copilot | Same as Cursor if we support it | Coming soon or Unavailable |

Each row shows: vendor name, one-line what you get, status, one action.

Statuses you must draw for Claude (the reference row):

1. **Connect** — OAuth is live, not yet linked.
2. **Continue in Claude** — they clicked Connect; we opened Claude; we are waiting. Do not look broken.
3. **Connected** — this Smart Site account is linked. Show the plan chip (Free / Solo / Studio / Team). Action becomes Disconnect.
4. **Coming soon** — OAuth not shipped. No Connect.
5. **Reconnect** — the link expired or was revoked on our side. Not a generic error.

Also draw:

6. **Signed out** — sheet opens, primary action is Sign in, rows disabled.
7. **Already this plan** — Studio user, Claude Connected. No upsell on the sheet. A quiet "Studio · connected as you@firm.com" is enough.
8. **Free user, Claude Connected** — same sheet, Free chip. One line: Reports and owner data stay on Solo and Studio. Do not hide Connect. Free is a real connector at a lower ceiling.

Disconnect is a confirm, not a toast that already did it. After disconnect, the row returns to Connect. We revoke the grant. We do not tell them to go delete Claude's connector (you may mention it as a secondary line, not as the only way out).

### The Connect click (Claude)

Two beats. Draw both.

**Beat 1 — still in Smart Site.** A short panel: "Claude will ask you to add Smart Site, then send you back here to approve." Primary: Open Claude. Secondary: Cancel. We do not ask them to paste a key. If we must show the server address (`mcp.smartsite.cloud`), it is a copyable hostname, labelled "Smart Site address," never a Cloud Run hash.

**Beat 2 — other window (schematic only).** A muted frame that says this is Claude's connector list, not us. They add the address and click Connect. That Connect is what opens Surface B.

If we later have a directory listing, Beat 1 can become one button that lands deeper in Claude. Design Beat 1 so that path can shorten without a new layout.

Cursor / Copilot Beat 1 may keep the hostname copy. Still no key.

---

## Surface B — the OAuth consent page (we own this)

This is a real Smart Site page at something like `smartsite.cloud/connect` (final path is not yours to pick). It is not a modal over the map. It is a full page, same dark system, no map required. A person arrives here from Claude's redirect. They may not have the map open in this tab.

### What it must say

- **Who is asking.** "Claude wants to use Smart Site." (or Cursor, Copilot, ChatGPT)
- **Which account.** The signed-in email and the plan chip. If they are not signed in, Sign in first, then the same consent. Do not let them approve as a different implied user.
- **What Claude will be able to do.** The eight jobs, in plain language, as a list. Not "full access to your account." Not "read and write everything."
- **What it will not do.** It will not change your plan. It will not see a key. It will not use a different person's Smart Site. Interactive map stays here.
- **How long.** Until you disconnect in Smart Site (or the grant expires if we time-box it). Do not promise "only this chat."
- **Actions.** Approve. Deny. Deny returns them to Claude without a grant.

### States to draw

1. **Signed in, Studio, Claude asking.** The happy path. Approve is the only loud button.
2. **Signed in, Free, Claude asking.** Same page. Free chip. The eight jobs are listed; Studio-only jobs are visible and marked "on Solo and Studio" so they are not surprised later. Approve is still valid.
3. **Not signed in.** Sign in (Google / Microsoft). After sign-in, return to this same consent, do not dump them on the map.
4. **Wrong or missing session.** "Sign in again to approve." No silent public approve.
5. **Deny.** Quiet confirmation, then back to Claude.
6. **Already approved.** "Claude is already connected as you@firm.com." Primary: Back to Claude. Secondary: Disconnect.
7. **Expired / revoked mid-flow.** "This request expired. Start again from Smart Site or from Claude." No Approve.

Do not put Stripe, seats, or upgrade CTAs on this page. If you need a path for a Free user who came here because they wanted reports, one text link "View plans" that opens the existing pricing story is enough. Consent is not a paywall.

---

## Return and manage

After Approve, Claude continues. The next time they open **Use in your AI** in the map app, Claude is Connected.

Draw one **manage** state on the sheet (or a one-step drill-in): connected since date, plan, Disconnect. No token display. No "copy refresh token."

Draw one **error return**: they Approved but Claude failed to finish. Sheet shows Reconnect, not Connected. One line of what happened, no stack trace.

---

## Frames to produce

Desktop first, one mobile treatment for the sheet and for the consent page.

1. Map + signed-in chrome with the new control (your recommended placement).
2. Sheet, Claude = Connect; ChatGPT = Unavailable (honest); Cursor = Connect; Copilot = Coming soon. User is Studio.
3. Same sheet, user is Free.
4. Same sheet, signed out.
5. Same sheet, Claude = Coming soon (OAuth not live). No fake Connect.
6. Beat 1 after clicking Connect on Claude.
7. Consent page, Studio, Claude asking (Surface B happy path).
8. Consent page, not signed in.
9. Consent page, Free.
10. Sheet, Claude = Connected (Studio).
11. Disconnect confirm.
12. Mobile: sheet + consent.

Optional but useful: one frame of a Claude chat *after* connect (schematic, not a Claude UI clone) showing the user asking "what's on 801 Pine in Bastrop" and a Smart Site-shaped answer with citations. So Nick can see the end of the story. Label it as illustration, not a screen we ship.

---

## Copy constraints

- Product: Smart Site.
- Control: Use in your AI.
- Actions: Connect, Approve, Deny, Disconnect, Reconnect, Sign in.
- Plan names only: Free, Solo, Studio, Team. Unlock ($15 / 30 days) is not a connector state.
- Forbidden in customer chrome: Hauska, Empressa, MCP, API key, product key, Cloud Run, OAuth, PKCE, token, Bearer.
- "OAuth" may appear in this brief. It must not appear in the frames.
- No time-saved claims. No "your AI assistant." The user already has Claude; we are the data and the reasoning they attach to it.

---

## What done looks like for this design pass

Nick can point at a frame and say: that is the button, that is the sheet, that is the approve page, that is connected, that is the honest ChatGPT row. Engineering can build P-87 items 15 and 16 from the frames without inventing a key screen. If a frame requires a key or a Hauska mark to work, it is wrong.
