---
id: 2026-08-30_smartsite_mcp_app_v3_scoping
title: Smart Site MCP App v3 scoping. Rulings logged 2026-08-30; lens conversation and UI conversation queued
date: 2026-08-30
status: scoping (no build opened; v3 and the multi-parcel view ship as ONE build per operator ruling 2026-08-30)
plan_row: P-92 (N1 partially subsumed by the block view), v3 rows to be opened on OPS-16 when scoping closes
prior: _inbox/2026-08-30_smartsite_mcp_app_v2_WDLL.md (v2, serving); the v3 discussion opened in the 2026-08-30 planner chat off the Rentometer / OneHome / PropertyRadar examples
owner: planner (this card); property seat and data lane named per item when the build opens
---

# Operator rulings logged 2026-08-30

One build. The multi-parcel view (shared frame, draw depth, area selectors) and v3 ship together, not as a P-92 increment plus a v3.

Lens equals persona. One concept, one word. What a lens IS (a prompt contract, a tool parameter, a saved view, or something else), how it is called, and the build sequence across lenses are NOT ruled; they need their own scoping conversation first. Nothing about lenses is buildable from this card yet.

Data before examples. OneHome and Rentometer were illustrations, not targets. The v3 spine is a gap ledger: all the data we want, what we hold (measured, not assumed), the gap between, with sourcing per field; and per field a call on what belongs in the twin versus what stays an external feed.

Worthiness carries no opinion. The ledger does not editorialize a field as worthy or unworthy. It carries the facts (source, acquisition path, measured coverage, vintage, cost) and the user and the model judge. The entry gate that DOES remain is structural, not editorial: the twin holds only uniformly acquired public record; licensed or user-connected data stays an external feed and is labelled as whose it is.

Public records: cleanest answer, lowest effort. Purchase of documents exists (the web app path; the MCP tools for it are blocked stubs on P-85 item 4). What v3 needs is reasoning over the records WITHOUT a county purchase. Working shape, to verify by measurement: the county clerk index (grantor, grantee, instrument type, amount, date) is public record, is enough for lien, release, deed and distress reasoning, and is an order cheaper than document images; purchase remains the path to the document itself.

Pro forma is investor only, and held. One base model delivered to the LLM is acceptable IF built; the product vision needs more shape before that decision. Do not build, do not scope further than this line.

A UI and rendering conversation follows once this card is logged. Queued behind the lens conversation.

# The multi-parcel view (design settled in chat, folded into the v3 build)

Origin story: the QA walk opened three adjacent parcels through boundary-line doors and the model had to reconstruct a composite by solving frame translations from shared edges, because every ring ships in its own centroid-origin local frame (`parcelDrawStub` types `origin: "centroid"`, no absolute anchor; verified against origin/main). Users must never solve translations. Three pieces:

1. Shared frame per call. A multi-parcel `get_smart_site` result carries one frame (origin the set's centroid) with every ring pre-translated by cortex; single-parcel calls unchanged; optionally an `anchor` per parcel (centroid in a named CRS) so results compose across calls.
2. Draw-weight depth. `depth: "draw"`: ring, anchor, label, zoning district and family, flood tint, state flags. Roughly 600 chars a parcel against 7.5K for a node brief; cap set from the measured row size against the host's ~150K ceiling, declared in the tool description like the existing 25/50 caps.
3. Area selectors. `find_parcel` today takes exactly one situs `query` (verified). Add `near: {query, radiusFt}`, `subdivision`, and `street`, returning capped hits with truncation declared. Flows compose: area find, then one draw-depth call for the block view, then the ordinary Open turn per parcel (the 2026-08-29 ruling holds: one call, one widget, everything in the result is in Claude's context; instances are never stitched).

Honesty rules that bind harder in a block view: a parcel in the extent that cannot be drawn paints as a hatched not-on-file or not-warmed gap, never as empty ground; a truncated area query names what it dropped. An area query around an address is the useful half of what `ask_the_map` promised; when the selector ships, rule whether `ask_the_map` retires rather than unblocks.

# Measurements to run before the build card

1. Does the store hold a queryable subdivision field (CAD legal descriptions usually carry it)? Instrument, not assertion.
2. Measured size of a draw-depth row, to set the cap honestly.
3. What the county clerk exposes for the index in the launch counties (Bastrop first): endpoint, fields, terms, cost. This decides the records-reasoning path.
4. What we hold today for deeds and liens (index rows versus nothing), before any claim about reasoning over records.
5. The gap ledger itself starts from a field inventory: every field the current twin serves (by reading the write paths, not output), then the wanted list from the lens conversation.
6. Iframe network probe (operator question 2026-08-30: can the app iframe render the literal SmartSite map). The Claude app iframe's outbound-fetch policy is UNMEASURED; no instrument has probed it (the boot strip's foreign count is postMessage sources, not network). The literal map is MapLibre GL plus three external origins (server.arcgisonline.com World_Imagery, storage.googleapis.com/hauska-map-tiles, services7.arcgis.com). Build a p559-style boot-strip extension that attempts one fetch per origin and paints ok or blocked per origin; one deploy, one connect, definitive. Fallbacks if blocked: server-rendered snapshot as a data URI in the tool result (single parcel fits the host result ceiling; no pan or zoom), and ui/open-link deep link to the PE map (works today). Decision belongs to the queued UI and rendering conversation; the probe should run before it so the conversation has facts.

# Map ground options (brainstorm logged 2026-08-30; no decision)

The operator's read: the bare-ring drawing is not the most useful ground; imagery or something like it would be better; the full PE app must not come along (its controls do not translate). The map part is `@hauska/map-renderer` (already factored out of PE chrome), so "map without the app" is a real seam. Options enumerated, each with its enabler:

A. Live trimmed map: MapLibre inlined in the iframe, tiles fetched by URL, chrome-less, locked or light camera. Enabler: the CSP probe passes for the tile origins. Cost: none per open (tiles go browser to origin).
B. Server-rendered snapshot, the semi-cropped parcel-and-surroundings view: cortex composes aerial plus rings at a buffered bbox. Three transports: B1 data URI in the tool result (works regardless of CSP, but the base64 lands in the model context, roughly 40K to 80K chars per open, capping batch use); B2 an image URL to our origin (zero context cost; needs CSP to allow it, and the endpoint properly gated); B3 the snapshot exposed as an MCP resource the widget reads through the host bridge (`serverResources` is in the observed caps; would dodge both CSP and context burn; whether Claude's bridge allows app-initiated resources/read is unmeasured).
C. Deep link to the PE map via ui/open-link. Works today, zero build, zero context cost; the panel stays abstract. Complement, not competitor.
D. Snapshot as UNDERLAY beneath the existing SVG drawing rather than a second view: same server geometry produces both, so registration is exact; hover, edges, doors and tints stay interactive on top. The recommended shape whatever the transport.
E. Vector plat ground with no imagery: neighbor rings, road centerlines with names, water, from draw-depth data. No CSP question, no licensing, tiny payload, and it falls out of the block-view build. Recommended as the default ground regardless; imagery is the enhancement.

Imagery sourcing if B or D: PE serves Esri World_Imagery; server-side export of it needs a terms check before any snapshot pipeline uses it. TxGIO / USDA NAIP orthoimagery is public domain, on the public-record posture, ingestable into the hauska-map-tiles bucket for the launch counties; size and ingest cost are a measurement.

Probe extension: measurement 6 grows to test BOTH channels in one deploy: per-origin fetch, and app-initiated resources/read through the host bridge.

Decision routed to the UI and rendering conversation.

# Queue

1. Lens scoping conversation (operator plus planner): what a lens is, how it is called, what each persona's field list demands of the gap ledger. Blocks the build sequence ruling and the pro forma decision.
2. UI and rendering conversation. After this card is logged; covers the block view paint, the panel at draw depth, and whatever the lens conversation implies for the panel.
3. Then the v3 WDLL, the gap ledger as its spine, rows opened on OPS-16.
