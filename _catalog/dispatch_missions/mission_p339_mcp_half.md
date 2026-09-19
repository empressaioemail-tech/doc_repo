## Mission — P-339, MCP half: the MCP draw block follows the drawing route's own outcome

You launch no sub-agents (FAN-DEPTH 0). You build in `legacy-design-tools` only and open one PR from
current `origin/main` with the SHA declared (`2e7ca7c4` at compile). You do not merge or deploy; the
integration seat does. Any doc_repo change is handed back as a diff in your close.

The map half of P-339 shipped (hauska-map #422, live on Property Explorer `fohg2os70`). This half did
not: the first P-339 lane designed it and stopped because it could not run LDT's suite. Read
`_inbox/2026-09-18_p339-p341-surface-agreement_close.json` `leave_behind[0]` first; it is the design
this mission builds.

### What is wrong (measured)

On the customer-leg probe of record (`_inbox/2026-09-18_221332_surface_probe.json`, signed in), the
MCP's `get_smart_site` answer serves the draw overlay `{state: "refused", reason: "atom_path_pending",
reasonDisplayText: "Withheld, setbacks unruled"}` for parcels whose own payload rules the table and
whose route draws. Three P-254 buckets FAIL on exactly this in the MCP text: Austin `1006 WISTERIA CIR`,
Kyle `151 FENDER DR` (`48209:145880`), Martindale `108 DELEON LN` (`48055:27929`). The earlier artifact
of record showed the same on `48453:367134`, `48453:239852`, `48309:103015`, `48453:445501`,
`48055:27929`, `48209:145880`. `atom_path_pending` means, in `@empressaio/atom-contract/display`'s own
VOCABULARY, "not ruled or baked for this jurisdiction yet; no distance or polygon exists": the claim
these payloads falsify.

### What to build

1. **Find the step first, by instrument.** The point-seeded derivation runs (the payload carries
   `queryPoint`, the draw frame an `anchor`) and returns null somewhere after it starts: the first
   parcel ring, the partner-identity guard, `resolveAuthoritativeSetbacks`, `labelEdges`, or
   `wireStatus !== 'ok'`. Instrument it on the named parcels and say which, per parcel.
2. **A discriminated result.** `tryComposeEnvelopeModelForDraw`
   (`artifacts/api-server/src/lib/buildableEnvelope/parcelDrawEnvelopeModel.ts` ~line 89) collapses
   modelled, declined and unreached into `null`. Return which one happened, with the reason. Re-point
   the three pinned null-contract tests in `parcelDrawEnvelopeModel.test.ts`; do not delete them.
3. **The route's outcome wins.** `parcelDrawFromReads.ts` (~69 `envelopeReason`, ~77
   `atomPathPending`) lets the bake's stored token outrank the route attempt; `parcelDrawStub.ts`
   (~545 `envelopeOverlay`) defaults a refusal's reason to `atom_path_pending`; smartsite-mcp
   `src/propertyExplorer.ts` (~355-362) gates which reason reaches the overlay. Make the route
   attempt's own outcome decide the overlay: a drawn polygon is served drawn (with
   `modelled-figure-withheld` where the figure is withheld, the token the package already carries);
   a real decline carries the route's own reason; `atom_path_pending` is reachable only when no
   property atom chain exists at all. No new vocabulary token.
4. **Name the two honest chain-unreachable states** (`pe-property-atoms.ts` ~753
   `stripCortexEnvelopeProductTruth`, ~775 `honestAtomPendingResponse` in hauska-map) as out of scope
   here and say whether LDT has an equivalent.

### Verify by violation

Pre-register your falsifiers. On the named parcels: the MCP overlay reads drawn (or the route's own
decline reason) and never `atom_path_pending` beside a ruled table; a parcel with no atom chain still
reads `atom_path_pending`; a real route decline still reads as that decline. Show each failing on the
pre-change code where it should. The customer predicate is the probe's P-254 MCP text rows, graded by
the seat after deploy (the MCP leg needs the operator's sign-in).

### The three-question gate

Answer in your close: what executes the overlay decision, what triggers it, what fails when a ruled
table is served as unruled, and what bypasses it (another composer of the draw block, a cached
stub).

### Constraints

- No merges, no deploys. The fix follows the route; it never manufactures a polygon the route did not
  draw.
- P-340 (card and route tables) runs as its own lane in parallel and may touch
  `authoritativeSetbackSource.ts`. Keep your change to the draw overlay's decision; rebase if P-340
  lands first.

### Close

Declare: the start commit and PR, the failing step per named parcel, the falsifiers with both
directions shown, the three-question gate answers, and `leave_behind`.
