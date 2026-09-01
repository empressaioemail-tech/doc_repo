Filed: 2026-08-28
From: chat planning agent
To: smartsite-mcp build agent
Re: Build scope, Smart Site MCP App v1 (screening board + parcel panel)

Reference prototype: `smartsite-mcp-app-prototype.html`. It is a single static HTML file built on real payloads only. Treat it as the behavioral spec for interaction and disposition language. It is not production code and it is not styled to any design system.

---

## 0. Invariants

These are not preferences. Violating any one of them changes what the product is.

**I1. The app may never call anything the conversation could not.** Every byte the panel renders comes from a tool result Claude also received. No private endpoints, no UI-only API, no side channel. When the board needs data, the fix is to make the tool return it, not to add a board endpoint. This is what keeps the MCP surface as the product rather than a data source for a viewer.

**I2. No number appears that cannot be defended at the parcel where it appears.** No coverage percentages. No column aggregates. No confidence floats while n is zero. No setback figures from the road-class table until the corner-lot case is settled.

**I3. Absence is the primary visual language, not a footnote.** Where the system does not know, the interface says so at the exact parcel where it is true, with the producer name and decline reason attached.

**I4. Anything durable round trips to Smart Site.** The sandbox has no storage of any kind. Claude memory holds none of it.

**I5. Web-sourced content never enters the panel.** Search results have no disposition, no asOf, no producer, and no citation in our vocabulary. Rendering them beside cited atoms launders unverified content into the provenance system and the four-state language stops meaning anything. Atoms answer what is on record. Claude answers what is being said. The two stay visibly separate. The button lives in the panel. The answer lives in the transcript.

**I6. Rendering requires no persistence.** Any parcel node id can be drawn without being saved. Saving is a separate, explicit act.

---

## 1. What already exists (do not rebuild)

Verified live on 2026-08-28 unless noted.

- `find_parcel` resolves Bastrop on both `parcel-situs` and `address-point` as of cortex-api `00623-mag`. B1 through B3 and the Georgetown negative all pass. Two transient aborts were observed on first call; see open item O4.
- `get_smart_site` returns the `draw` object: server-projected local frame ring in US survey feet, `ringOrder`, typed boundary edges carrying `ft`, `bearing`, `adjacency`, `roadNode`, `roadClass`, `neighbor`, six labeled overlays across four dispositions, `confidence: "seed"`, and a canonical `url`. Payload measured at 4.4 KB.
- The parcel fabric is walkable and reciprocal. 34137 edge 1 and 34169 edge 4 describe the same shared line from both sides, same length, opposite bearing, from independent atom bodies. 34169's two west edges sum to exactly its east edge.
- `list_my_properties` returns id, parcelNodeId, label, updatedAt. Thirteen rows on the test account, multi-county, one situs sentinel rendering as `", ,"` on `48021:25420`.
- `run_report` is synchronous over the baked snapshot and honest about tier.
- Drainage and X-ray producers exist and emit real sheets (`FD-48021-35073`, `PD-48021-33223`).
- Export contracts already enumerate `glb`, `ifc`, `dxf-3dface`, `dxf-contour`, `dxf-site-plan`, `ifc-site-plan`, `pdf-site-plan`.

---

## 2. Sandbox constraints (these shape the design)

1. No cookies, no localStorage, no sessionStorage, no IndexedDB. `allow-same-origin` is omitted on the innermost iframe.
2. No WebAssembly. `McpUiResourceCsp` exposes only domain lists, with no way to add `wasm-unsafe-eval`. WebGL is fine.
3. Deny-by-default CSP. Declare origins in `_meta.ui.csp` under `connectDomains` and `resourceDomains`. Undeclared origins do not load.
4. Every server call goes app to host to server via `callServerTool`. Design for pre-fetch, not fetch-on-click.
5. One build serves mobile, web, and desktop. Submission takes one screenshot batch for all three.
6. UI resource payload ceiling is unmeasured. Do not design anything that depends on it.
7. Auth flows through the host's existing OAuth session. Tier gating stays in `entitlement.ts` untouched.

---

## 3. Server-side scope

### 3.1 Batched disposition read

Extend `get_smart_site` rather than adding a tool, per I1.

- Accept `parcelNodeId` as a string or an array, cap 50.
- Add `depth` with four levels: `stub`, `node`, `hop1`, `subgraph`. v1 implements `stub` and `node` only.
- `stub` returns label, node id, canonical url, and a five-state value per rail. Target 40 tokens per parcel.
- `node` returns the existing `draw` object unchanged.
- Arrays never fail on one bad id. Return per-parcel dispositions plus an explicit `notFound` array.

**Rails for v1:** `situs`, `zoning`, `landUse`, `flood`, `drainage`, `envelope`.

**A1.** `get_smart_site` with an array of 13 node ids at `depth: "stub"` returns in one call, under 1 KB, with every rail carrying one of the five states.
**A2.** An array containing one invalid id returns 12 rows plus that id in `notFound`, not an error.
**A3.** `depth: "node"` on a single id returns byte-identical output to today's `draw`.

### 3.2 The fifth state

The four-state vocabulary breaks on a lazy-loaded board. `unread` is not `unknown`: one is a gap in the fetch, the other a gap in the data. They must never share a glyph.

- Add `unread` as a serialized state, returned only where the read has not been attempted.
- `atom-miss` continues to map to `unknown`, never to `absent-verified`. `verifiedAbsence` has never been written, so only a positive typed result (pipeline present-outside, `:sd:outside`) earns `absent-verified`.

**A4.** A parcel never read returns `unread` on its unread rails and `unknown` on rails where a read returned no row.

### 3.3 Screen object and persistence (replaced 2026-08-28)

Screens and saved properties are decoupled.

A screen holds parcel references, not saved properties. A screen row carries the node id, the original query text verbatim, the resolution result, and the intake source. Creating a screen writes nothing to the saved list. An investor screening forty listings wants one board and maybe three saves; if all forty land in saved properties the saved list is unusable inside a week.

Screen row shape: `{ parcelNodeId | null, query, resolution: "resolved" | "ambiguous" | "unresolved", source: "pasted" | "chrome" | "gmail" | "file" | "walk" | "saved", candidates? }`. The source field matters. When six of forty fail to resolve the customer needs to see which six and what they typed, and when a screen is rebuilt from a Gmail alert tomorrow, source explains why the row set changed.

Saving is explicit, origin-independent, and a turn. It works on any node id including one reached by walking to a neighbor. Removing a save does not remove the screen row. Adding a save does not require the parcel to have come from a screen.

Screens persist by default, auto-named, cheap, deletable. The sandbox has no history and "the list I ran last Tuesday" is a real need.

Tools: `create_screen(name, queries[], source)`, `add_to_screen(screenId, parcelNodeId, source)`, `list_screens()`, `save_property(parcelNodeId, status?, note?)`, `set_property_status(parcelNodeId, status)` with statuses New, Watching, Chasing, Passed, and `list_my_properties` returning the stub disposition vector, status, and note for saved properties only.

Consequence for the client: `list_my_properties` stops being the board's data source. The board reads from a screen, and a screen may contain zero saved properties.

**A5.** Forty pasted addresses resolving to thirty-four produce a screen with forty rows, six marked unresolved with the original query text preserved.
**A6.** A status set from the panel survives a reload and is visible to `list_my_properties` in the conversation.
**A11.** A parcel renders in the panel from a bare node id with no saved record and no screen membership.
**A12.** Saving a parcel from the panel does not alter any screen; removing a save does not remove any screen row.
**A13.** A neighbor reached by walking can be added to the current screen with source `walk`.
**A14.** A screen created from pasted text preserves each original query verbatim, including the ones that did not resolve.

### 3.4 Situs composition fix

`48021:25420` returns `label: ", ,"`. Compose-side fallback to node id when situs components are empty, and return an explicit `situs: "unknown"` disposition rather than a punctuation string.

**A7.** No saved property ever returns a label consisting only of separators.

### 3.5 Drainage as a rail

The drainage producer exists and emits sheets. Surface it on the wire.

- Add a `drainage` overlay to `draw` with `geom` carrying catchment boundary, traced flow lines, and ponding polygons in the same local frame as `ring`. Empty arrays are meaningful: `flowLines: []` renders as "no concentrated flow path traced," not as an empty picture.
- Raster gradient by URL under a declared `connectDomains` origin, never inlined.
- Carry `provenance: "degraded"` when rainfall forcing falls back to the regional default.

**A8.** Drainage renders as vector overlay on the parcel ring in the same frame, with zero-length results shown as verified absence rather than blank.

### 3.6 Tool annotations

`registerTool` currently passes only `{ title, description, inputSchema }`. No `annotations` object exists anywhere in source. `readOnlyHint` and `destructiveHint` are a stated directory requirement and determine whether Claude prompts on every call.

**A9.** Every tool declares `annotations` with at minimum `readOnlyHint`. Read tools run without per-call confirmation.

### 3.7 Trace serialization (small, high value)

The zoning atom body names `sourceCodeAtomRef` and `codeSectionRefs` as DID pointers to `14-02-003` and `14-02-008`. They do not survive serialization.

- Emit `codeRefs` on the zoning attr with `refBasis: "body-denorm"`.
- When those DIDs land in `atom_links` as typed edges, flip to `refBasis: "atom-link"` with no schema change.
- Until then, serialize hop-1 neighbors as `basis: "parcel-bind"` with `edge: null`. A body pointer is not a walk. Do not present the `:sd:{id}` suffix as district membership.

**A10.** Clicking a zoning district in the panel returns the establishing code section id, labeled as a denormalized reference rather than a traversed edge.

### 3.8 Intake

Smart Site never ingests a listing feed. The user brings addresses, we resolve them to parcels, and the listing data stays where it came from. This is settled. Zillow retired its public API in 2021, Bridge Interactive is gated behind MLS affiliation with a multi-week approval, scraping is against their terms, and third-party wrappers mean reselling someone else's ToS risk inside a Claude directory listing. Unlock MLS redistribution is already an open question; do not stack a second licensing problem on it.

An address is not licensed content. Operator-verified 2026-08-28: three addresses taken off a Zillow results page resolved cleanly to `48021:8718300`, `48021:8704645`, and `48021:8720522`.

v1 intake is paste, which needs no intake-side build: text, screenshot, PDF, CSV. Claude parses and calls `create_screen`. v2 adds Claude for Chrome reading the user's own browsing session, Gmail parsing listing alert emails against a saved screen and surfacing only what changed, and bulk file upload.

---

## 4. Client-side scope

### 4.1 Three levels

| Level | Job | Contents |
|---|---|---|
| Board | Triage | Disposition matrix, parcels as rows, rails as columns, one of five states per cell. Sort, filter, status. |
| Parcel | Judgment | Ring and edges from `draw`. Six overlays with labels. Attrs. Refusal objects with producer and decline code. |
| Neighborhood | Context | Edge traversal to named neighbors. Coverage seam visible across adjacent parcels. |

### 4.2 Board rules

- Parcels are rows, rails are columns. Default sort by parcel completeness ascending.
- **No column aggregates, ever.** The operations reading (a column of unknowns) falls out by eye from cells that are each individually true and clickable. A percentage at the bottom of a column is a claim the board cannot defend.
- Unresolved rows render as "situs unresolved" with the node id, never as punctuation or a blank.
- Cross-county grouping supported. The test account already spans Bastrop and Kyle.

### 4.3 Parcel panel

- Ring assembled client side from `draw.ring` and `draw.edges`. Server does the projection; the client never converts units or does trigonometry.
- Road-facing edges marked. Three of four edges on the gold parcel front a road, so road adjacency is per-edge and independent of the `front` role.
- Overlays in `unknown` or `refused` are clickable and push a question into the conversation via `ui/update-model-context` or `ui/message`.
- Refusal content gets more visual weight than the flood zone. It is the most valuable thing on screen and the flood zone is available from any county portal.
- `unknown` overlays must carry a mandatory label rendered inside the region, not in the legend. Hatch alone reads as texture.

### 4.4 Bridge usage

- `ui/message` for panel-originated prompts and calls to action.
- `ui/update-model-context` when a selection should inform the next answer without a visible turn.
- `ui/open-link` for the canonical deep link.
- `callServerTool` for parcel reads, walks, and drainage runs.
- `IntersectionObserver` to pause any WebGL when offscreen.

### 4.5 Ask-Claude buttons

Panel controls that push a prompt to Claude via `ui/message` and let Claude answer in the transcript. The app never searches, never caches, never holds the result. Per I5 none of it renders in the panel.

v1 ships exactly one: Find listing history. Claude web-searches prior sales, price cuts, days on market, and prior listing copy for the situs address. The mechanism generalizes at no additional cost to nearby sales, recent code adoptions, local news, and public permit mentions, but ship one and let the pattern earn the rest.

The sharpest use is verification. A listing says "zoned for multifamily, buyer to verify." Claude pulls the listing copy, the panel supplies the zoning atom with its citation, and the answer names the gap.

**A15.** Clicking Find listing history produces a visible turn in the transcript and adds nothing to the panel, the board, or any stored record.

---

## 5. Five-state design system

This is the signature element and the hardest visual problem in the build.

| State | Meaning | Requirement |
|---|---|---|
| present | A value exists and is cited | Filled |
| absent, verified | Someone asserted it is not there | Clean and confident, never "missing" |
| unknown | Not measured, no row bound | Must never read as a value or as zero |
| refused | A policy or pipeline decline with a named reason | Visually distinct from unknown |
| unread | Not fetched yet | Distinct from unknown; will dominate first paint at 40 rows |

Constraints: colorblind safe, distinguished by shape as well as fill, legible at 380 px and at 1400 px from one layout, legible at 40 rows.

---

## 6. Turn versus local

The panel sits in a scrolling transcript with no persistent navigation, no URL, and no back button. The transcript is the navigation.

**Rule:** if the customer would want it in the history, it is a turn. If not, it is local state.

- **Local:** sort, filter, hover, layer toggle, expanding a row's detail in place.
- **Turn:** opening a parcel, walking to a neighbor, saving, adding to a screen, Find listing history, running drainage, changing a status, requesting an export.

Opening a parcel appends a new panel below rather than expanding in place. The board stays intact above it, so a customer can open three parcels and compare by scrolling. In-place expansion is smoother for one parcel and materially worse for the actual job.

---

## 7. Out of scope for v1

- **Rebuilding the R1 report in the frame.** Claude writes better prose than any renderer, and rendering it twice means maintaining it twice. `run_report` returns to the conversation.
- **3D, GLB, IFC, terrain inline.** These ship as downloads through `export_instrument`. A GLB in a phone-sized iframe is the least decision-relevant thing in the product and is unmeasured on mobile.
- **Records request as a workflow.** Multi-step async in a sandbox with no storage is the worst possible host. Fire it, hand the job id to the conversation, let `check_request` answer there.
- **Selection language.** "Find me the smart sites" implies fit between parcel and intent, and there is no Project node to bind against. v1 promises triage: nothing known disqualifies it, and here is what is not known. Selection arrives with the Project node in v2.
- **Any listing feed of any kind.** No Zillow integration, no third-party wrapper, no scraper, no cached listing content.
- **Web-sourced content in the panel.** The Find listing history button is in scope. Rendering its answer as panel content is not.

---

## 8. Prerequisites before this ships

The app is not the next thing to build. In order:

1. **Confirm the Claude organization tier.** The submission portal requires a Team or Enterprise org with Owner or Primary Owner. This gates the whole path and is a settings check, not engineering. Do this first.
2. **Tool annotations** (3.6). Hours of work against a hard requirement currently at zero.
3. **Kill the three dead tools.** `HAUSKA_MCP_BASE_URL` is unset on the deployed service, which is the single thing blocking `export_instrument`. Set it in the workflow file, not the console. Then either ship `request_records` and `check_request` or remove them from the surface. A tool that returns `isError: true` on valid parameters fails the directory criterion regardless of how honest the message is; "honestly tier gated" does not clear it, because a blocked tool is not a tier refusal.
4. **`ask_the_map`**: fix the selector translation so `parcelNodeId` resolves internally, and sanitize validation errors at the MCP boundary. It currently leaks `workspaceDid`, `personaBucket`, `starterPromptId`, `mls_id`, and `presentationMode` to any external caller who trips the validator.
5. **Citation and label hygiene.** Flood and land use ship `citationsDegraded: true` with empty citation arrays while marked `present`. This blocks the verifiability claim the whole product rests on.
6. **Legal pages.** `smartsite.cloud/privacy` serves the SPA shell on a plain fetch. Directory review checks these.
7. **Submit item 21.**
8. **Then this scope.**

---

## 9. Open items to resolve during scoping

**O1. The 42% reconciliation. RULED B 2026-08-28.** The X-ray asserts "Buildable (approximate), 42% of the lot" on `48021:33223` while `get_smart_site` refuses buildable envelope with `atom_path_pending`. Producer is live `deriveBuildableEnvelope` (X-ray only), not a bake or envelope atom MCP can serve. X-ray must refuse like MCP until the atom path is live. Decision `_decisions/2026-08-28_p91_o1_envelope_xray_must_refuse.md`. Paired probe on `48021:33223` still unfiled.

**O2. Side_corner setback.** Edge 3 on the gold parcel faces a residential ROW and the road-class table gave it 0 feet, identical to the interior side. Most codes impose a street side setback on a corner lot. If this is a table defect it is probably systematic across every corner lot in the county. Setbacks stay off the drawing until this is settled.

**O3. Cross-ROW neighbor references.** Both 34137 and 34169 name `48021:34121` as the neighbor across the Pine ROW. A cross-ROW `neighbor` may be resolving to whatever parcel a ray hits rather than a real relationship. Reciprocity checking will not catch it, because there is no shared edge to disagree with. Confirm before traversal lets customers walk across streets.

**O4. Transient aborts on `00623-mag`.** Two `find_parcel` calls aborted before a third succeeded within the same minute. Reads as cold start or pool behavior rather than query specific, but a reviewer's first call may be their only one.

**O5. `descriptor-fixture`.** All four gold boundary edges carry `sourceAdapter: "descriptor-fixture"`. If gold's geometry is a fixture rather than a live county ring, `draw` works on gold and returns nothing elsewhere. Test `draw` on at least five unrelated Bastrop parcels before building a renderer on it.

**O6. Payload ceiling.** Unmeasured. One measurement. Only gates drainage rasters and any future GLB.

**O7. Street-type abbreviations and abort.** `find_parcel` on "111 Rainmaker Cv, Bastrop TX" aborted twice, then "111 Rainmaker Cove, Bastrop TX 78602" succeeded immediately. Same abort pattern as O4, now on a second query, so it is not a one-off. Once the aborts are fixed, confirm whether the resolver actually handles street-type abbreviations (Cv/Cove, St/Street, Trl/Trail) or whether the retry only appeared to fix it. This bears directly on intake: pasted listing addresses arrive abbreviated, and a screen that silently drops six rows to abbreviation handling looks identical to a screen where six addresses genuinely do not exist.

---

## 10. Free instrument worth building alongside

Every shared boundary edge is two independent assertions that must agree: same length, reciprocal bearing, neighbor pointing back. Run that as a county-wide sweep and the repair effort gets a defect map derived entirely from data already in the store, with no new ingestion. It is also a trust claim no competitor can make, because none of them store edges as first-class objects with named neighbors.

---

## 11. What v1 is

A customer drops a list of properties and gets a board of what is known and what is not. They open a parcel and see it drawn, with the gaps marked. They walk to the neighbor and see the coverage seam. They point at an absence and get a real answer about why, with the producer name and the decline code.

Not a viewer. A place to ask "why don't you know this" and get an answer that holds up.
