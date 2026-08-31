---
id: 2026-08-31_p91-cortex-verify_findings
title: P-91 v3 panel versus cortex-api-00672-ceq (F-11 / LDT #560)
date: 2026-08-31
status: measured
plan_row: P-91
lane: p91-cortex-verify
snapshot: doc_repo P:/doc_repo main 5d821b74. Product tree P:/tmp/legacy-design-tools-p91-stone feat/p91-v3-vocab HEAD b9d51b7a (p563; #560 merge 8f11e81b is an ancestor). Live facets 2026-08-31T12:51Z via smartsite.cloud BFF and 12:52:10Z via cortex-api-tds7av26va-uc.a.run.app. Serving revision name not on the response; wire shape matches #560.
---

# Verdict

The v3 panel is still correct against the F-11 cortex image on every field the Smart Site MCP actually reads. The new setback refusal is unmapped in the p563 vocabulary and would leak raw if it reached overlay.reason or the get_smart_site JSON. It does not travel on those paths today. Function 6 remains an honest refuse. Edge roles did not gain a value.

# What changed on the wire

LDT #560 (`12215749`, merge `8f11e81b`) touches five files. That is the write-path diff between the p563-era cortex digest and `00672-ceq`.

`serveBoundaryEdgeSetback` in `setbackProvenanceDisposition.ts` is new. It turns a stored edge `setback` into a four-arm union:

- `value` carries `feet`, `provenance`, `atomCitation`, and a prose `basis`
- `refused` carries only `basis` (no feet)
- `unknown` carries only `basis` (placeholder / phase-1a proof)
- `absent` carries only `basis` (no object, or an unmapped kind)

Road-class provenance `road-class-setback-table` becomes `state: "refused"` with basis exactly `refused: retired road-class derivation — a road class is not a setback`. The retired token itself is kept out of the served string so Gate 8 C7 does not stay red on a refused value. A storage-port placeholder becomes `state: "unknown"` with basis `unknown: source cites the phase-1a storage-port proof — nobody looked`.

`boundaryEdgeFactRead.ts` changed in one load-bearing place: `setback: rec.setback ?? null` became `setback: serveBoundaryEdgeSetback(rec.setback)`. Role, adjacency, neighbor, and retired-edge filtering did not move. `brokerageNodeFacets` emits the classified object on the anonymous facets route as `boundaryEdgeFact.setback` and `boundaryEdgeFact.edges[].setback`.

`research/brief` loads the same reader, then `parcelDrawFromReads.boundaryInput` copies geometry and drops `setback`. Overlay `reason` still comes from `envelopeBriefRefusal` (the bake), via `envelopeReason`, which yields `atom_path_pending`, `not-in-bake`, or another bake code. F-11 does not write that field.

Live, 2026-08-31T12:51Z, PE BFF and the Cloud Run URL agreed on gold size (11322 bytes). Five of six fixtures serve the refused road-class arm with no `feet`. `48021:82112` is `atom-miss` (no edges). `road-class-setback-table` is not in the gold body. `facets.envelope` is still null and `facetCoverage.envelope` is still false. `cityLimitsFact.queryPoint` is present on all six, so the MCP anchor read is still fed.

# Which of those fields the MCP reads

`get_smart_site` POSTs `/api/property-explorer/v1/research/brief`, then reads the facets route only for `cityLimitsFact.queryPoint` (`parcel-anchor.ts`). `attachAnchorToResponseText` copies `anchor` and `anchorRead` and drops the rest of the facets body.

The panel's `edgesFromDraw` copies `role`, `adjacency`, `neighbor`, `road`, `ft` / `lengthFt`, and `bearing`. It does not read `setback`. `envelopeHuman` maps one string, `atom_path_pending`, and returns every other reason unchanged. `sanitizeExternalDraw` attaches `reasonDisplayText` on overlays only.

So the changed field is a non-finding for current MCP consumers: the brief assembler strips it, the facets consumer never copies it, and the panel never paints it.

# Unmapped tokens

Primary (F-11, live on five fixtures):

| token | origin | reaches user text today | what a user would see if it did |
|---|---|---|---|
| `refused: retired road-class derivation — a road class is not a setback` | `RETIRED_ROAD_CLASS_SETBACK_BASIS` on facets `boundaryEdgeFact.setback` | no, write path omits it from brief and from the MCP facets read | raw sentence, because `envelopeHuman` would pass it through and the standing table has no key |
| `unknown: source cites the phase-1a storage-port proof — nobody looked` | `PLACEHOLDER_SETBACK_UNKNOWN_BASIS` | not observed on these six parcels; same non-path if it appeared | raw sentence |
| `no setback object on edge` | absent arm | not observed here; same non-path | raw sentence |
| `malformed setback object — not a dimensional record` | refuse arm when feet missing | not observed here; same non-path | raw sentence |
| setback `state` values `value` / `unknown` / `absent` as new machine words on a setback object | the union | MCP does not read the object | n/a today |

These are prose basis strings, not closed codes. Putting the 70-character sentence into `VOCABULARY` would be the wrong shape: a punctuation change would miss, and a standing-block row nobody looks up is a starved mapping. If a later cut starts forwarding `setback`, cortex should emit a code beside the prose (`retired-road-class-derivation`, and siblings) and MCP should map the code. That fix is api-server. This lane does not edit it.

`envelopeHuman` pass-through remains the leak class the V programme exists to kill. It is not the door this token uses today.

# Function 6

Still an honest refuse. The brief setbacks-envelope section and the envelope overlay still come from the bake refusal (`extractEnvelopeBriefRefusal` / `envelopeReason`). #560 does not touch those files. Served `facets.envelope` is still null. F-11 flipped per-edge setback from a stored VALUE to a REFUSED object on a field the panel never painted as a setback distance (`get_smart_site` already declares it never contains setback distances). The refuse reads as a decline (bake not derived / atom path pending), not as an absence of the parcel.

The operator's 2026-08-31 seven-test walk printed "Withheld, setbacks unruled" against the prior cortex. The brief path that produces that string did not move.

# Edge roles

The role union is still `front | side | rear | side_corner`. Live roles on the six fixtures are exactly those four. `side_corner` is present on `48021:34137`, `48021:31254`, and `48021:31272`. `EDGE_WORDS.side_corner` remains "corner side". Reciprocal-edge / neighbor disposition lives in `disposeDrawEdgeNeighbor`, which #560 did not touch.

# What this lane did not measure

- Live `POST /research/brief` and live `get_smart_site` JSON (both gated; this lane holds no MCP auth). The write path is the finding. A serving brief that started forwarding `setback` would make the leak real; that change is not in #560.
- A live connector walk against `00672-ceq`. The p563 seven-test pass was against the prior cortex image.
- Cloud Run revision name on the request (BFF is Vercel; the Cloud Run URL sent no revision header; `gcloud` was not authenticated here). The classified refuse with no feet and no retired token is the #560 shape; C7 re-read at 02:56Z named `cortex-api-00672-ceq` at 100 percent.
- The placeholder, value, and absent setback arms on live parcels (only the refused road-class arm appeared).
- Counties other than Bastrop, and the PE inspect card (out of scope).
- Pre-existing unmapped bake codes such as `baked-envelope-not-served` and `no-zoning-stamp`. Not F-11.

# Handback

No MCP diff. Do not add the basis sentence to the 19-entry table.

If the property seat later puts `boundaryEdgeFact.setback` or `edges[].setback` on the brief or tool JSON, ship a closed `code` on each serve arm in `setbackProvenanceDisposition.ts` first, then a vocabulary row for that code. Until then a mapping here would be starved.

`artifacts/api-server/` was not edited.
