---
id: 2026-08-28_property_seat_canvas_salvage
title: Property-seat canvas salvage (worker closing with P-94 chat)
date: 2026-08-28
last_updated: 2026-08-28
status: salvage
owner: integration (this chat)
source_canvases:
  - C:/Users/cente/.cursor/projects/p-doc-repo/canvases/property-seat-board.canvas.tsx
  - C:/Users/cente/.cursor/projects/p-doc-repo/canvases/smartsite-design-system-gap.canvas.tsx
byte_copies:
  - _inbox/canvas_salvage/property-seat-board.canvas.tsx
  - _inbox/canvas_salvage/smartsite-design-system-gap.canvas.tsx
truth_rule: property-seat-board wins on serving and ship state. Predecessor wins on item-level acceptance the board compressed. Stale predecessor claims are named below and must not be re-quoted.
---

# Property-seat canvas salvage

The P-94 Team-roster chat will close the property-seat canvas worker. This file is the remainder. A fresh agent reads this, not the dead worker.

Snapshot when salvaged: SEAT-01 integration, `P:/doc_repo` `main` `5aa0564`. Canvas files copied under `_inbox/canvas_salvage/`.

## What is still live (do these, in this order)

### P-94 Team roster server half (in flight in the owning chat)

OPS-16 A-048 added the row. Isolated tree `P:/tmp/legacy-design-tools-team-roster` on `feat/pe-team-roster`, base `89e539f6`. GET plus invite / cancel / remove / patch. 19/19 violate tests. Uncommitted. Unregistered. Do not start a second writer on that tree.

Customer-done: PR, apply `0089_pe_team_roster.sql`, cortex canary, migrate, smoke, shift. Signed-in Team tab lights from GET with no PE client change.

Two leftovers, do not collapse them.

1. Stripe still does not persist `pe_user_entitlements.seats_purchased`. Checkout already sends quantity. Webhook writes `subscription_tier` only. Live Team GET omits the field. POST invite 409s `seats_purchased_unknown`. Honest.
2. Accept-invite is not built. An invited email who signs in becomes owner of a new account via `ensureOwnerMembership`. The invitation never converts. Out of the P-94 WDLL.

Named errors: `authentication_required`, `owner_required`, `seat_capacity_exceeded`, `seats_purchased_unknown`, `last_joined_owner`, `invalid_role`, `invalid_email`, `already_on_roster`, `invitation_not_found`, `member_not_found`, `viewer_email_unresolved`.

WDLL `_inbox/2026-08-28_p94_team_roster_WDLL.md` (approved). First close `_inbox/2026-08-28_p94_team_roster_close.json`. Decision `_decisions/2026-08-28_p94_team_roster_server_half.md`.

### P-89 leftover (do not start P-90 from a narrated pass)

Serving `hauska-mcp-server-00084-mof` @100%, tag `p89-1ae9f28`, digest `sha256:58f5fb3a0c3d1e72dc4edf668f7f3f743ed1a67948010c397a9bb2999811724a`. No redeploy. Refresh 422 `pipeline_output_absent` is live (no verdict `ad16a103`, placeholder `7a1af82f`, brief null `c8ff00b3`).

Item 3 download is not live-MET.

- `48021:27479` streamed a 606503-byte `%PDF-1.7` dated 2026-08-26T22:40Z and issued engine GET `/download` 200 (`6c636888`).
- `48021:34137` has no artifact and still issued GET `/download` then 404 (`65e78f9c`).
- `isStoredDossierArtifactHollow(undefined)` returns false, so a missing pdf-dossier row is treated as not hollow.

Planner split: 34137 is a P-89 hole (absent artifact still hits the engine). 27479 content (NO ADDRESS / UNAVAILABLE) is P-90 unless the stored metadata is actually `verdictIncluded` false or `briefFactCount` 0, which the logs did not carry.

Close `_inbox/2026-08-28_p89_serving_close.json`. Predecessor canvas claim "P-89 not deployed" is stale. Do not re-quote it.

Also leftover: item 5 test remains `assert.ok(true)`. Substrate.

### P-93 chrome leftovers (shipped; named, not a next card)

hauska-map #294 squash `5fa74c15`. Prod `dpl_7nbUVXLMi7sbGa5p5u4iG5zg5t8S` aliased to smartsite.cloud. Bundle `index-BZZjHM_5.js`. Last-Modified `2026-08-28T22:45:17Z`. Tree `P:/tmp/hauska-map-p93-chrome-debt`. Gate file and `src/checkout/` untouched.

21 hex / 5 native buttons remain: MapLibre cyan, FEMA/hydro, Google and Microsoft brand hexes, InspectCard `#a78bfa`, kit Button primitive, four `ss-bubble` rail circles. Honest. Not a silent baseline wipe. Not W8.

Predecessor live deploy `dpl_J6Liza2UFgYYpzDXZAwSgmtrXBwN` / merge `0e4dc5c` is the older W9 kit land. #294 superseded it.

### P-90 engine PDF (draft; do not fan)

WDLL `_inbox/2026-08-28_p90_engine_pdf_WDLL.md` is draft. Operator approval pending. Isolated `hauska-engine` from `origin/main` after Nick greets the card and a compiled dispatch exists.

Gate written as "after P-89 live refuse." Refresh refuse is live. Download leftover is not. Do not compile P-90 from a narrated pass.

Envelope ruling B binds this card: X-ray refuses buildable envelope the same way `get_smart_site` does (`atom_path_pending` / `envelope.kind: "not-derived"`). Decision `_decisions/2026-08-28_p91_o1_envelope_xray_must_refuse.md`.

W2.4 (live-view printed on PDF bytes) lives here. W4 P1 verdict packet, P2 provenance, P3 units, Q4 flood drawing, Q6 address title also live here. Engine GET `/dossier-export/download` of a stored hollow still streams.

### W8 Site Constraints (queued)

QA item 41 / W8.1 to W8.4. Starts after P-90 customer-done on live X-ray PDFs. Do not absorb into chrome.

- W8.1 RRC wells, pipelines, rail, utility easements, soils, drainage, road node as a Site Constraints section inside the X-ray. No third report SKU.
- W8.2 Beds / baths / rooms only in Structure, only when a structure exists, never on the free headline, never next to appraisal.
- W8.3 Mailing addresses suppressed in share views and exports.
- W8.4 No raw CAD field names on any customer surface.

Operator later asked for RRC on the Layers list. That park-behind-X-ray is now a product conflict, not a silent W8 absorb. Layers `texas-rrc` is `live:false` (M39). Do not add a dead checkbox. Apply is F-10 after the card F waiter. See fleet-bearings.

## Predecessor remnants the board compressed (do not lose)

These lived on `smartsite-design-system-gap` and were collapsed to four cards. They are still the item-level law.

### Stripe (other agent; do not start a second lane)

Handed off 2026-08-28. Sandbox catalog already built (monthly 49 / 129 / 299+25, annual 490 / 1290 / 2990, unlock 15). Cortex has the eight test price IDs. A live key does not exist. Decision 2026-08-24: leftovers first, then key swap.

- A1 Monthly Team, 12 seats: popup $349 (299 + 2×25). Entitlement Team. Back-to-cart stays.
- A2 Unlock this property, 30 days: $15. Webhook writes the unlock. Parcel opens.
- A3 Wallets: Cash App QR or honest decline. Never a silent white error.
- A4 Monthly vs annual: Studio 129/mo not 1290/yr. Annual Team at 12 seats is honest refuse or cap-at-10, never 2990 for 12.
- B1 Nick only: live Stripe account, Smart Site names, zero Hauska strings.
- B2 Other agent after B1: live keys + eight live price IDs on serving cortex. Revision by field name.
- B3 First real money, then refund if a probe.

Checkout is the pricing popup, not checkout.stripe.com. Interval is required. Annual Team extra seats cannot mix in one Stripe session. P-85 Records is inside Studio, no new price. Hosted-kill and the 404 install-scoped fallback are leave-behinds unless they fire on A1. Do not write `src/checkout/` or the Stripe agent tree.

P-94 does not take this Stripe write. `seats_purchased` persist is the join between this leftover and P-94 invite.

### W4 items still open after P0 costume

P0 PE click refuse is MET as costume. MCP refresh refuse is now live. Remaining:

- W4.P1 verdict packet (P-90)
- W4.P2 provenance four-column table (P-90)
- W4.P3a contour / elevation / no UNAVAILABLE chips (P-90)
- W4.P3b flood zone X vs flood-study non-determination (P-90)
- W4.Q4 flood PDF drawing carries flow lines and ponding (P-90)
- W4.Q6 address title, not PARCEL NO ADDRESS (P-90)
- W4.Q11 Studio reports reachable for a Studio account
- W4.REC Records unreachable is an auth defect (coordinate P-85). Do not open a parallel records lane.
- W4.ZON zoning brief does not dump the user on an unexpected site

### W7 leftovers still unwalked

Signed-out offer is MET (#241). Signed-in catalog leftover remains. W7.9 fourth-chat wall is still unwalked: fourth chat names the loss, then one unlock, no "3 of 3 chats used."

### Conflicts. Stop and flag. Do not ship around them.

1. Report menu length. Locked 2026-08-27. Feasibility and Comparison are reports. Brief and Records are tools. Do not invent a fifth. Generate paths not opened.
2. Provenance vs strip. X-ray and Flood keep Layer | Source | Vintage | Confidence. Other dumps strip the raw table.
3. Drawn envelope. Free map does not paint the buildable polygon. Find may show setback facts. Ruling B: no live lot-percentage on X-ray.
4. Valuation. Blocked. Leave it off every surface.
5. RRC home. W8 puts constraints in the X-ray. Operator later asked for Layers toggles. That is a product ask, not a silent checkbox. Data path is F-10.
6. Demo parcel. Gold `48021:34137` (908 Pine). P3 exports used `48021:34161` (905 Pecan). Q&A #2 used `48021:27479` (1308 Pecan). Do not silently retarget the gold demo.

### Parked long-term (visible so they do not vanish)

Claude directory filing (P-88 item 21). Gmail-from-export. Smart Files upload / note attachments. Ida affiliate. Nationwide fly-to. A-la-carte water report (ruled no). ETJ on/off on Layers. RRC as layer toggles (see conflict 5). Full CAD detail audit. Abandoned-easement chat re-probe (P-85). Claude Design flyout. Chris visual pass. AI chat voice. Status change from Compare. Highlight-all-saved / OSM extras.

Item 21 stays parked until QA in-wave leftovers finish. Do not file it from this seat.

## Already MET. Do not reopen.

W0 chrome. W1 Find (Nick 23:46Z). W2 PE viewer (pdf.js #266 `b32d988`; W2.1 / 2.2 / 2.3 / 2.5 / 2.6). W3 My properties. W4.P0 PE click refuse (costume). W5 Compare. W6 first paint (monthly, seats in Team column). W7 signed-out offer. W9 kit gate (then #294 debt convert live). P-89 code `hauska-mcp-server` #77 `1ae9f28` (26/26). P-93 convert live.

Closed-wave IDs W0.1 to W0.7, W1.1 to W1.8, W2.1-W2.3 W2.5 W2.6, W3.1 to W3.6, W5.1 W5.2, W7 signed-out, W9.1 to W9.3 remain MET. Full checks are in the predecessor byte copy.

## SKU lock

Live generate: X-ray and Flood. Feasibility is a report, not live generate. Comparison is a report and a tool. Brief and Records are tools. Site plan and terrain are exports. Do not invent SKUs. P-32 stays parked. Do not pitch Feasibility or Comparison as live.

## Hard out of scope from this seat

Stripe leftovers + live-key swap (other agent). Second P-89 PR. P-87 / P-91 / P-92 MCP App (other canvas). Factory / OPS-19 / F- rows. P-85 Records. P-32 assembler. Valuation. Feasibility or Comparison generate. `src/checkout` / Stripe tree. Dirty `P:/seat-worktrees/property/*`. Substrate MCP #74. ICC-meter tree.

## Do-not-write trees

`P:/seat-worktrees/property/legacy-design-tools` (P-85), `-mcp`, `-publish`, `-rename`, `-daily-limit`. `P:/hauska-map` dirty checkout. Stripe agent checkout. `P:/tmp/legacy-design-tools-team-roster` is owned by the P-94 chat until it closes.

## Cited artifacts

- `_inbox/2026-08-28_p89_serving_close.json`
- `_inbox/2026-08-27_p89_xray_mcp_WDLL.md`
- `_inbox/2026-08-28_p90_engine_pdf_WDLL.md`
- `_inbox/2026-08-28_p93_w9_kit_WDLL.md`
- `_inbox/2026-08-28_p93_chrome_debt_close.json`
- `_inbox/2026-08-28_p94_team_roster_WDLL.md`
- `_inbox/2026-08-28_p94_team_roster_close.json`
- `_decisions/2026-08-28_p94_team_roster_server_half.md`
- `_decisions/2026-08-28_p91_o1_envelope_xray_must_refuse.md`
- `_scratch/qa2-smartsite.md`
- `_scratch/p94-team-roster.md`
- `90_operations/OPS-16_texas_market_plan_of_record.md` A-044, A-047, A-048
