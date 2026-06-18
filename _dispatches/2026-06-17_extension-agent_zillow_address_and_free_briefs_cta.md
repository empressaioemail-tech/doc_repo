---
id: 2026-06-17_extension-agent_zillow_address_and_free_briefs_cta
title: extension-agent — fix Zillow address extraction (wrong listing) + show free-briefs-remaining instead of wallet-zero
date: 2026-06-17
agent: extension-agent
repo: hauska-brief-extension
branch: extension/unified-signin-v067
kind: dispatch
priority: HIGH — briefs run on the WRONG property; first brief blocked by a stale wallet CTA
related: [2026-06-17_cc-agent-C_wire_free_brief_tier_into_gate]
---

# extension-agent — Zillow address + free-briefs CTA

Two bugs from live QA on a Zillow listing (`zillow.com/homedetails/205-Javelina-Trl-Bastrop-TX-78602/90242388_zpid/`). The panel showed **"419 sqft · Active · 103 Kamaiki Dr"** (a different, wrong listing) and **"Wallet balance is zero. Top up in $5 increments"** blocking the first brief.

## Bug 1 — Zillow scrapes the wrong address

`extractFromZillow()` does `document.querySelector("h1")` and takes the first `h1` on the page — on Zillow's current DOM that's a sidebar/related card, not the listing. There are THREE copies: `src/adapters/zillow.js`, `src/content/intel-panel.js` (~:301, the live panel path), and `src/content/content-bundle.js` (~:1175).

Fix (all three, ideally consolidate to one):
- **Derive the address from the homedetails URL slug** — it is the canonical address and is immune to DOM changes. From `/homedetails/<slug>/<zpid>_zpid/`, the slug `205-Javelina-Trl-Bastrop-TX-78602` → match `^(.*)-([A-Z]{2})-(\d{5})$` and render "205 Javelina Trl, Bastrop, TX 78602" (hyphens → spaces, comma before state). This is the PRIMARY source.
- Fall back to the DOM/title only if the slug fails to parse. Do NOT use a bare `querySelector("h1")` as primary.
- Carry the parsed `streetAddress, city, state, zip` so the brief request sends the right parcel, and the panel header shows the listing being briefed (not a stray card).
- Verify against the screenshot case: on the 205 Javelina Trl page the panel header and the brief must be **205 Javelina Trl, Bastrop, TX 78602 / 2,472 sqft**, never 103 Kamaiki Dr / 419 sqft.

## Bug 2 — wallet-zero CTA blocks the first brief

`src/research/research-app.js:885` reads `balanceCents` and renders "Wallet balance is zero. Top up in $5 increments". The backend free-brief tier is being wired ([`cc-agent-C`](2026-06-17_cc-agent-C_wire_free_brief_tier_into_gate.md)) so the panel must stop gating on wallet balance:
- Read the entitlement snapshot (`freeBriefsRemaining`, `freeBriefsCap`, `proActive`) from the brief response / the new entitlement endpoint cc-agent-C exposes.
- Show **"N free briefs remaining"** (or nothing) while `freeBriefsRemaining > 0` or `proActive` — the "Run full brief" button must be enabled. Do NOT show the $5 wallet top-up CTA.
- Only when free briefs are exhausted AND not Pro, show an **upgrade CTA** (Pro subscription), driven off the `upgrade_required` signal — not the legacy wallet top-up.
- Update the panel header CTA in the screenshot ("Run full brief" with "Wallet balance is zero…" subtext) accordingly.

## Coordinate

The entitlement-snapshot field shape is owned by cc-agent-C's close. Don't guess field names — use the contract. Land after (or with) the backend deploy so the panel reads real entitlement.

## Report back

`P:/doc_repo/_inbox/2026-06-17_hauska-brief-extension_extension-agent_zillow_address_and_cta_close.md` — version bump; a screen capture of the 205 Javelina Trl page showing the correct address in the panel and "N free briefs remaining" with Run enabled at wallet balance 0; the three extractFromZillow copies fixed; prod-verify re-run.
