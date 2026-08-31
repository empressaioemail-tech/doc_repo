---
id: 2026-08-30_p91_v3_map_build_cp
title: P-91 v3 MCP-only wave. CP1 design attacks; CP2 per lane on return
date: 2026-08-30
status: in-flight
plan_row: P-91 (v3 WDLL items M3 map ground, P1 paint channel; anchor is the enabling half of M1 done MCP-side)
scope: artifacts/smartsite-mcp ONLY. Operator scoped this thread to MCP 2026-08-30 ("all i want to work on is MCP"). No cortex edit, no api-server edit, no doc outside this card and the deploy record. Another seat has live LDT worktrees on parcelDrawStub.ts and parcelDrawFromReads.ts under P-92; those files are OUT for this wave and nothing here touches them.
tree: P:/tmp/legacy-design-tools-p91-stone, branch feat/p91-v3-map, from origin/main 28969a36
card: _inbox/2026-08-30_smartsite_mcp_app_v3_WDLL.md
---

# The unlock this wave rests on (measured, not planned)

The v3 WDLL assumed the map ground needed M1, a cortex change adding an absolute anchor to the draw frame, because `parcelDrawStub` types `origin: "centroid"` with no absolute position. That assumption was wrong in a useful way. The anonymous cortex route `GET /api/brokerage/v1/place/node/:parcelNodeId/facets`, which the MCP server can already reach through its existing generic client, serves `cityLimitsFact.queryPoint` as `{longitude, latitude}` from the bake lat/lng index at five decimal places, roughly 1.1 metres. Read live 2026-08-30 against deployed cortex on three fixture parcels:

    48021:31254  {"longitude":-97.32528,"latitude":30.10592}
    48021:49295  {"longitude":-97.33348,"latitude":30.11473}
    48021:82112  {"longitude":-97.31907,"latitude":30.12288}

Including 48021:82112, the sparsest record in the fixture set (no ring, no year built), so the anchor is populated where geometry is not. Null only when the bake holds the 0,0 sentinel. That is a parcel-grade anchor available with zero cortex work, and combined with the p559 probe result (arcgisonline imagery fetches, WebGL2 present, declared CSP honored or unrestricted) it makes the map ground an MCP-scope build.

Corrected on the way: measurement 5 said the building-footprint read exists but is not wired into the draw. Live read shows the same route returns `{"state":"refused","code":"atom-miss"}` for the gold parcel. The READ exists; the DATA does not. Footprints stay an honest gap and no lane in this wave paints one.

# Design: no MapLibre

The obvious build inlines MapLibre into the served page. Rejected. It adds roughly 800 KB to a 76 KB resource, brings a WebGL dependency into a panel that renders fine without one, and replaces the SVG drawing the last three waves hardened. The cheaper and more honest design: compute Web Mercator tile coordinates from the anchor in about a hundred lines, place a small mosaic of tile images as an UNDERLAY, and draw the existing SVG ring over it unchanged. Every v2 behavior (hover, doors, tints, why-turns) survives untouched because the drawing is untouched. Pan and zoom are not in this cut and are not promised.

# CP1 (design, pre-build)

Claim: the anchor is real or it is absent, never invented. Attack: a missing or sentinel coordinate defaults to 0,0 and paints a parcel in the Gulf of Mexico with full confidence. Answer: absent anchor means NO map ground at all, falling back to today's void background; no default coordinate exists anywhere in the lane; the fixture set includes a null-anchor parcel and asserts the void ground.

Claim: the ring registers on the imagery correctly. Attack: a projection or zoom error puts the parcel fifty metres off, and the user reads a neighbor's building as sitting on this lot. That is the worst failure available to this wave, because it is invisible and confident. Answer: registration is computed, not eyeballed. The anchor's pixel position and the ring centroid's pixel position are the SAME point by construction, and a fixture asserts it; the Web Mercator conversion is tested against known coordinate pairs; the frame already declares `gis-approximate` and the ground carries a visible source and approximation label. A mutation of the conversion constant must fail the registration fixtures.

Claim: imagery is a third-party claim and must be labelled as such. Attack: fresh-looking aerial implies currency we cannot support; Esri does not publish per-tile capture dates. Answer: the ground labels its source and states the vintage as unstated rather than implying one. This is the same rule the panel already applies to a degraded citation.

Claim: a second upstream call is safe. Attack: the facets call is slow or down and every panel now waits on it. Answer: bounded timeout, issued concurrently with the brief rather than after it, and its outcome declared on the wire as `anchorRead: ok | error | skipped` so an absent ground says why. A failed anchor read never fails the panel.

Claim: the CSP declaration is doing its job. Attack: the p559 run passed with the origins declared, so we cannot tell whether the declaration was necessary or the host simply does not restrict; a lane could conclude declaration is unnecessary and drop it. Answer: keep declaring, and the declared set must contain the tile origin the code actually fetches, derived from the same constant rather than copied.

Claim: paint-only previews do not violate the Open ruling. Attack: a hover preview shows facts the model does not have, and the user believes the conversation knows them. Answer: the two ruled invariants, enforced by contract checks, not by intention: a paint-only result is visually distinct and never claims to be in context, and anything the user acts on still drafts a turn.

Not taken and why: MapLibre and true pan or zoom (bundle cost against a static parcel view); a server-rendered snapshot (needs cortex, out of scope this thread); block or multi-parcel ground (needs draw depth, cortex, out of scope); footprint paint (no atoms exist).

# CP2 (per lane, on return)

## M-1 server anchor (returned first)

Read by the planner as a diff. New `src/parcel-anchor.ts` plus small edits to `tools.ts`, `cortex-client.ts` and `tests/tools.test.ts`; two new test files. Suite rerun by the planner: 267 of 267, up from 238.

Attack 1: the unawaited anchor promise on the non-OK brief path could reject and take the process down. Checked at source: every path in `readParcelAnchor` is guarded, the fetch in try or catch, the response validity tested before use, `res.clone().text()` in its own try or catch, and the body parse guarded inside `anchorFromFacetsBody`. The function cannot reject, so leaving it unawaited on the declared-miss return is safe. Accepted.

Attack 2: the attach step could corrupt a body or pass an upstream coordinate through. Checked: non-JSON and non-object bodies return unchanged, and the function DELETES any `anchor` and `anchorRead` the upstream carried before writing its own. That last defence was not in the brief and is the right one: the only coordinate that can leave the server is one this module read. Accepted, and noted as a strengthening.

Attack 3: the sentinel check might be vacuous. The planner ran an independent mutation, replacing `lon === 0 || lat === 0` with `false`: exactly four fixtures failed, and the tree was restored and reverified green. Not vacuous.

Attack 4: the read might not be concurrent, so a slow facets call would add its latency to every panel. Checked in the diff: `briefPromise` is created and NOT awaited, `anchorPromise` is created next, and only then is the brief awaited, so both requests are in flight together and the panel waits the longer of the two. Timeout 2,000 ms, matched to `PROBE_TIMEOUT_MS` in `hauska-client.ts`. Accepted.

Deviation the lane declared, and the planner accepts it: `anchorRead` is an object `{status, reason}` rather than one of four bare strings. The brief asked for both a four-value status and a reason, which a bare string cannot carry. The package has both precedents (`stubRead` is a bare string with reasons carried separately in `degraded`; declared error bodies are `{status, reason, upstreamStatus}`). The object keeps the reason with the status it explains, which is the better shape for a single field, and it is now named explicitly in the M-2 brief so the next lane does not write `anchorRead === "ok"`.

Correction the lane made to the brief, verified: `cityLimitsFact` is top level on the facets body, not nested under `facets`. The planner's live read had shown the same path and the brief was loose about it.

Instrument note: the anchor attaches on the 200 path only, never on a declared miss or refusal, which is correct (a miss has no parcel to anchor). One pre-existing call-count assertion in `tests/tools.test.ts` moved from 1 to 2 for the single-id node entry, which is the concurrent second call by design.

## M-2 iframe map ground (returned second)

Read by the planner as a diff. Only `src/mcp-app.ts` in src, plus a new ground suite and seven appended served fixtures. Suite rerun by the planner: 323 of 323, up from 267.

Attack 1, the one that would have been invisible: a transposed Esri tile path fetches real imagery of the wrong place and renders beautifully. Planner mutation, independent of the lane: `tile/{z}/{y}/{x}` to `tile/{z}/{x}/{y}` fails 14 fixtures. The lane had already found its own first check weak here (it asserted against the url builder's own output, so a transposition would have satisfied both sides) and replaced it with a fixture that decodes an emitted url back through the inverse projection onto the anchor. That is a one-party-cannot-satisfy-both-sides check, and it is the right repair.

Attack 2: dropping the `cos(latitude)` term makes every parcel about 15 percent wrong at this latitude, a drawing that does not match the roof beneath it. Planner mutation: removing the cosine fails 3 fixtures, including the second-latitude fixture that exists precisely so the omission cannot hide. `GROUND_EQUATOR_MPP` is the standard constant and feet convert by the survey factor the frame declares, not the international one.

Attack 3: registration by assertion drifts. The lane went further than the brief and made it tautological: the anchor pixel and the ring origin pixel are the SAME call, `ringPixel(fit, 0, 0)`, so there are not two derivations that could disagree. `ringFit` and `ringPixel` were extracted from the existing `ringSvg` with byte-identical output, so the drawing is genuinely unchanged.

Attack 4: an over-zoomed tile request. Esri answers above zoom 19 with a placeholder image, which is exactly the grey box standing in for imagery that the brief forbade. The lane found this itself and capped the zoom rule at 19. Accepted, and it is the kind of thing that would have shipped as a mystery.

Attack 5: the non-ok anchor guard could be reachable only through another guard. The lane found this too: its first fixture passed only because the parse layer already dropped a coordinate under a bad read, so the guard itself was never exercised. It added a fixture calling `groundPlan` directly with a good coordinate under a bad read. Second self-caught weak check, closed rather than reported adequate.

Attack 6: the `direct_network` contract could be tripped or quietly widened. Checked: tile `img` elements are not fetch, XHR or WebSocket, the predicate has no removed line in the diff, and two new contract rules were added rather than any existing one loosened.

Deviation the lane declared, and the planner accepts with a note for the operator: the ring polygon's void fill drops from 55 percent to 16 percent, one CSS line scoped to `[data-ground="on"]`, because a 55 percent scrim hides the roof the ground exists to show. With the ground off or absent the drawing is byte identical to today. If the operator reads "drawing unchanged" as covering rendered opacity, deleting that one line reverts it and nothing else moves.

Left unmeasured and named by the lane, correctly: the p559 probe measured `fetch` reachability, not `img` loading under the declared `resourceDomains`. Whether the host honors the declaration for images is answered by the first live panel render and by nothing else, which makes the deploy itself the instrument.

## Planner instrument failure, 2026-08-30: the p558 image tag was overwritten

Recorded because the rule it broke is one this operation already wrote down, and because a fresh reader will otherwise trust a tag.

What happened. The planner produced `cloudbuild.p560.yaml` with `sed 's/p559/p560/g' cloudbuild.p558.yaml`, substituting a string the source file does not contain. Nothing matched, the output was a verbatim copy still naming `smartsite-mcp:p558`, and the build pushed the new code to the `p558` tag. The subsequent digest read for a `p560` tag returned empty and the chain exited non-zero, which is the only reason it surfaced at all: had the chain not read the digest by name, a wrong-tagged image would have deployed silently.

Blast radius, measured rather than assumed. `smartsite-mcp-00065-siv` is pinned to digest `sha256:1d11950148f8bd5942152a8a00e117f1493816218fd5703490a1296462409ed0` and is still serving 100 percent. Cloud Run revisions run a digest, never a tag, so production was never affected. What moved is the Artifact Registry tag `p558`, which now resolves to `sha256:9998dd94b210c07e9ef9a0c497b77a3cffcf1debbefa5032db76fac1cd3afbce`, the M-1 plus M-2 code. The Cloud Run traffic tag `p558` is a different namespace and still points at the correct revision.

Why the record survives anyway: every deploy record in this program names the digest, not only the tag, so what p558 actually served is still recoverable from `_inbox/2026-08-30_p91_p558_deploy.md`. That is the standing rule working as intended: read the authoritative record, never a proxy for it. The tag is the proxy.

Repair: `cloudbuild.p560.yaml` regenerated by substituting the string the source file actually contains, behind a guard that refuses to build unless the config names p560 twice and p558 zero times. The guard is the fix, not the care. Do not repoint the `p558` registry tag: the digest in the deploy record is the authority and moving a tag backwards would create a second lie.

## M-3 iframe paint channel

(not dispatched yet; follows the p560 canary)
