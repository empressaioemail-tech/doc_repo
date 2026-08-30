---
id: 2026-08-30_smartsite_mcp_app_v3_WDLL
title: WDLL — Smart Site MCP App v3. One build: the territory view, the spectrum of functions, receipts everywhere
date: 2026-08-30
status: APPROVED (operator 2026-08-30 "skeleton approved"; refine by amendment; build NOT yet opened, rows open on OPS-16 once the commit freeze lifts, since OPS-16 currently carries another seat's uncommitted edits and an amendment row would entangle with them)
plan_row: P-91 (carry), P-92 (absorbed: N1 PARTIALLY subsumed by the block view, F9 carried as a data-lane feed into wired readers, R3 held with flood studies), v3 rows to open on OPS-16 when this WDLL is ratified
n1_correction: 2026-08-30, caught by the canvas agent against the scoping card. "Subsumed" overclaimed. The block view supplies the neighbor's rings and rails in one frame, which is N1's precondition; the seam glyph where two parcels' rails DIFFER is a paint decision and is in none of the M items. Remainder carried explicitly: paint the differing-rail seam on a shared line. Scoping card's "partially subsumed" is the correct reading and wins.
prior: _inbox/2026-08-30_smartsite_mcp_app_v2_WDLL.md (v2, serving on p558/p543); _inbox/2026-08-30_smartsite_mcp_app_v3_scoping.md (three ruling sets, thesis, levers, map options, measurements)
measurements_in: 5 (field inventory, _inbox/2026-08-30_p91_measurement5_field_inventory.md, verified at 8d94ddad); 6 (iframe probe, strip verbatim in the scoping card; net pass, gl=webgl2, bridge=ok)
serving_at_draft: smartsite-mcp p558 (00065-siv), cortex-api p543 (00668-cos)
owner: planner (this card, walks, deploys); property seat (cortex and app code); data lane (acquisition, named per row, not scoped here)
---

# Thesis (ruled)

The twin grounds, Claude reasons, the panel shows receipts. The product is the conversation about a property in which every claim traces to a source, a vintage, and an honest gap. No standalone lenses: real estate pros wear multiple hats, so one build covers the spectrum of functions, and a lens is only a frame of reference for who is asking. The model does the judgment; the panel paints the verdict with receipts; nothing painted is absent from the model's context.

# What finished means (the yardstick, ruled)

Function-scored, not persona-scored. Each of the thirteen ledger functions gets a walk scenario (the W1 pattern applied to a job: "screen this list, pick three, show receipts"), graded on correctness against the record, citation coverage, honest-gap behavior where data is absent, and turns spent. v3 is finished when every function whose data exists scores usable, and every function whose data does not exist refuses or declares honestly, on live parcels through a real connector. Grades land in section 9.

# 1. The gap ledger (the spine; order is the operator's axis, strongest today to biggest gap)

Today-states are measured (measurement 5, live wire reads, or named as unmeasured), never assumed. "Serve" means cortex serialization only; "acquire" means the data lane.

| # | Function | Today (measured) | Gap | Path | v3 items |
|---|---|---|---|---|---|
| 1 | Screen a list | usable (v2) | board at territory scale | serve | M2, M4, Q1 |
| 2 | Flood exposure | partial-strong: live atom fact, BFE honest; stored Tier-2 facet never crosses the wire; no citation URL; studies absent | serve the stored facet; studies are acquisition | serve, then acquire | S1, S2; studies with R3 (held) |
| 3 | Zoning and what it allows | district + citation + provenance; codeRefs readers wired, never fed | code depth | data lane feeds F9 refs | S3 (reader side done; feed named) |
| 4 | Listing history | disclosed web-search fallback | MLS-adjacent feed ruling | external feed, labelled | R-2 ruling |
| 5 | Outreach targeting | year built (CAD live read); acreage and APN baked, never served | serve baked fields; owner unmeasured | serve, then measurement 4 | S1 |
| 6 | Can I build X | honest refuse (envelope declined in bake, atom path pending); edges and ring usable | envelope production | data lane | none in v3; honesty already correct |
| 7 | Area: around X, subdivision, street | dead; fully scoped | the build itself | build | M1 to M5, Q1 to Q3 |
| 8 | Ownership and equity | UNMEASURED (owner-stripped at serve today by design; deeds unknown) | measurement 4, then a ruling | measure, rule, acquire | X4, then R-1 |
| 9 | Resale value and value-add | year built and acreage near (see 5); sale history and comps unmeasured or absent | measurement 4 scope; comps are a feed question | measure, rule | X4, R-2 |
| 10 | Distress (liens, delinquency) | dead; clerk index not held | the index acquisition | measure endpoints, acquire | X3, then a data-lane row |
| 11 | Permit activity | dead; per-city sources | acquisition per city, cost rule applies | acquire | data-lane row, not v3 |
| 12 | Rental value and market | dead; not public record | feed ruling (bring-your-own-key posture recommended, not ruled) | rule | R-2 |
| 13 | Investor pro forma | held by ruling | product vision | rule later | none; do not scope |

Ledger law (ruled): the ledger carries facts per field (source, acquisition path, measured coverage, vintage, cost), never a worthiness opinion. The structural entry gate stands: the twin holds only uniformly acquired public record; licensed or user-connected data is an external feed labelled as whose it is.

# 2. Serve what we already hold (property seat; first cards; no acquisition)

S1. Serialize the bake-held fields the panel never serves: APN, acreage {value, sqft, method}, countyFips and countyName, facetCoverage, the provenance block. Each lands as a section field or draw attr with the same disposition discipline as everything else (explicit disposition, asOf, citations or citationsDegraded).

S2. Serve the stored Tier-2 FEMA flood facet content (status, floodZone, SFHA, zoneSubtype, baseFloodElevation, provenance) instead of only its refusal, reconciled with the live flood atom (two derivations of one fact: when they disagree, declare the disagreement, never pick silently).

S3. Fix the named defect list from measurement 5: draw landUse reads desc/taxYear where the bake writes description/vintage; yearBuiltFromBake reads keys no bake writes; absent reads for flood, well, and specialDistrict drop sourceVintage so absent-verified is unreachable (thread it; the data lane's typed-absence vintage then flows through); the always-empty layer manifest either serves a layer or says why per row. codeRefs stays reader-ready.

# 3. The territory view (the one build's core)

M1. Shared frame per call: a multi-parcel result carries one frame (origin the set's centroid), rings pre-translated by cortex; per-parcel `anchor` in a named CRS so results compose across calls. Single-parcel unchanged. Users never solve translations.

M2. Draw depth: `get_smart_site` `depth: "draw"` returning ring, anchor, label, zoning district and family, flood tint, state flags. Cap set by measurement X2 against the host ceiling, declared in the description like the 25/50 caps.

M3. The map ground, per measurement 6 (all gates passed): the trimmed live map. MapLibre inlined, aerial imagery and our tile origins fetched by URL under the declared CSP, WebGL2 confirmed, no PE chrome. E's vector layers (neighbor rings, road names, water, tints) ride on top and ship regardless as the no-imagery fallback rendering. A parcel tap resolves to a node and drafts the ordinary Open turn. `bridge=ok` is the transport for any server-rendered asset if ever needed. Esri terms check for this usage context is a named to-do before ship; NAIP-in-our-bucket remains the sovereign alternative (measurement of size and cost if chosen).

M4. Block board: the board and the map are two paints of the same screen; county groups, completeness sort, candidates and lookups carry over from v2 unchanged.

M5. Honesty at territory scale: a parcel in the extent that cannot be drawn paints as a hatched not-on-file or not-warmed gap, never empty ground; truncation names what it dropped; no aggregate numbers invented anywhere (v2 contract carries forward).

# 4. Selectors (the territory view's front door)

Q1. `find_parcel` gains `near: {query, radiusFt}`, `subdivision`, `street`; capped hits, truncation declared, `located-unbound` miss class carried from v2. No new tool: the catalog stays 13; any fourteenth tool needs its own ruling.

Q2. Subdivision source per measurement X1: cad_property.legal_description exists (text); whether subdivision parses out cleanly, or a txgio column serves better, is settled by the build-time instrument before the parameter ships. If neither parses reliably, the parameter refuses with that reason rather than fuzzy-matching.

Q3. `ask_the_map` retirement ruling: when Q1 ships, rule whether ask_the_map retires (recommended) rather than unblocks; retirement is proven by decline per the standing law.

# 5. The paint channel (ruled in, two invariants)

P1. serverTools paint-only calls for hover previews and lazy section detail. Invariant one: a paint-only result never claims to be in context and never renders as a fact the model vouched for; painted-from-preview content is visually distinct until opened. Invariant two: anything the user acts on (open, add, save, why) still drafts a turn. Contract checks enforce both in the served suite, verified by violation.

P2. The three-tier result discipline stands and is written into tool descriptions: painted (what the eye needs), carried (the full result in context), pointed (past the host ceiling, a pointer the model fetches by tool).

# 6. Not in v3 (ruled)

Standing watches (out). Client-facing share artifact (out; Claude composes reports from context). Free tier (unchanged; pricing law). Pro forma (held). Exports via the substrate seat endpoint (dependency, unscheduled). Permit acquisition, drainage producer, envelope production, footprint geometry, land-use coverage, typed-absence vintage, F9 code refs (data lane; the app's readers and honest-absence lines are already in place and everything re-warms when the lane lands).

# 7. Open measurements and rulings

X1. Subdivision parseability (half-measured; instrument at build time, see Q2).
X2. Draw-depth row size against the host ceiling (instrument at build time, sets M2's cap).
X3. MEASURED 2026-08-30, `_inbox/2026-08-30_p91_measurement_x3_clerk_index.md`. The index we want EXISTS and is free to a human: Bastrop runs Aumentum Recorder (Harris Recording Solutions) at `cc.co.bastrop.tx.us`, no account, permanent index 1973 to present, searchable on grantor, grantee, filed date, instrument number, book, page, a roughly 160 value document type vocabulary carrying the whole lien, deed, release and distress set, and legal description; copies are 1.00 dollar per page and 5.00 dollars per document to certify. Travis runs the identical product at `tccsearch.org` (index from 1988). Williamson breaks the pattern: land records sit on a Tyler self service portal whose coverage was unreadable, and the free-back-to-1848 surface everyone cites is Commissioners Court minutes only.

The constraint that decides the path: automated access to the free surface is disallowed by the machine readable signal at every one of the three. Bastrop's `robots.txt` is `Disallow: /` in full; Williamson allows only the homepage; Travis publishes `Disallow: /` with named blocks on ClaudeBot, GPTBot and CCBot plus `Content-Signal: search=yes,ai-train=no,use=reference`. No county or vendor page carries a human readable no-scraping clause; the machine readable one is uniform and restrictive. Class (b), a published priced bulk index product, does not exist in any of the three. The lawful uniform routes are a Local Government Code 191.008 contractual access agreement (requires a commissioners court order) or a Public Information Act extract priced under the AG rules (roughly 15 dollars per hour personnel, 28.50 dollars per hour programming, 20 percent overhead); Harris and Tarrant prove county bulk desks are lawful in Texas without publishing prices.

Consequence for R-1, and it is a real fork rather than a detail: reasoning over the index cannot be fed by crawling the free portal, so functions 8 and 10 are gated on a per county statutory acquisition (191.008 or PIA), which is uniform public record and available to anyone (it is NOT a relationship privilege, so the no-privileged-data rule is satisfied), but it carries per county cost and lead time and must be checked against the cost per jurisdiction rule before any wave. Ruling owed. Note also that the ecode360 scrape posture (2026-08-04) does not transfer here: that ruling answered a plain 403, this is an explicit machine readable disallow.

Instrument note, declared rather than buried: the research agent's own fetches were automated against those robots signals, on a dispatch of mine that said public pages only and did not say respect robots.txt. Both the finding and the method flaw are recorded in the report. A standing acquisition rule is owed: what our crawlers do when a source publishes a disallow, before any lane acts on this measurement.
X4. What we hold for deeds, liens, sale history, owner (HELD until the data lane quiets, per the store-load rule).
R-1. Records and ownership serving posture (after X3/X4): what the twin serves, what stays behind purchase, what the tenant-sovereignty and owner-strip rules require.
R-2. External feed posture for rental and MLS-adjacent data (bring-your-own-key recommended; not ruled).
R-3. Esri imagery terms for the in-iframe map context (M3 to-do) or the NAIP alternative.

# 8. Walk W2 (function-scored; grades fill section 9)

One scenario per ledger function that is buildable in v3, on live parcels through a real connector, split agent-reports (wire) and operator-reports (paint) per the W1 reissue pattern. Scenarios drafted when the build's first cut serves; the fixture set extends the Bastrop 28 with a territory case (one block, one subdivision, one radius) and the honest-gap cases per function. Standing walk instruction learned on p559: every cut requires a full connector disconnect and reconnect; the host caches the app resource per connector session.

# 9. Grades

(empty until W2)

# Amendments

(none yet; skeleton)

# Leave behind (declared at build close, per lane law)

    leave_behind: (declared when the build closes; the v2 close's open items carry until then)
