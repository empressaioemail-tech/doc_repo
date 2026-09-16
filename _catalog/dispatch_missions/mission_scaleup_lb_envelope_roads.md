## Mission — L-B ENVELOPE UNLOCK: the shortest path to an "ok" envelope wherever the ledger holds setbacks, and the whole envelope family including footprints

**Read-only lane in the Texas scale-up research wave.** You spawn nothing. You write no product
code and change no store. **You start your atoms-store reads only when your planner says L-A has
finished its own.** Everything else can start at once.

### The operator's direction, 2026-09-16, which sets your priorities

1. **Envelope rendering first.** "Getting that ok is great; we want the shortest path to
   unlocking all that."
2. **Footprints must render.** The building footprint must render on the site plan and the
   other studies. That was reported as QA-08 on 2026-09-15 and never routed; it is now P-248.
3. **Road nodes are NOT a priority.** "Customers don't care about road nodes right now." A full
   road-node pass (a TIGER cross-check, a street-name normalisation dictionary,
   classification rules, and the `roads` and `edgeSignal` ledger rails) comes **after**
   Phase 2. **Study road data only where it blocks envelope or footprint rendering, and say
   exactly where it does.**

**The overseer's reading of the shortest path, which you must test, not assume (P-249).**

- LDT `artifacts/api-server/src/lib/buildableEnvelope/reconcileAtomEnvelope.ts` lets **any**
  `no-buildable-area` atom replace a good live-derived envelope with an empty one. The only
  exception is when its reason looks like a machine-verify diagnostic.
- "Unzoned", "not yet onboarded" and reason-less July zeros are not diagnostics, so they clobber
  today's setbacks.
- The 2026-09-11 ruling (envelope drawn, figure refused) says the modelled polygon draws wherever
  a district and a setback table exist, and only the AREA waits on an atom.
- **Proposed fix:** a stale or unverified zero atom keeps governing the area figure (which is
  withheld anyway) and stops suppressing the live polygon. hauska-map
  `atom-chain-to-facets.ts`'s `envelope-unverified` decline changes to match.

**Your first job is to prove or break that:**

- Which parcels would draw after the change, counted per city.
- Which would fall to the live derive's own geometry gates (`validation-failed`), and what the
  customer would then see.
- Whether the live labeller draws a sane polygon on `48209:97658` and on a sample of each atom
  class. Run LDT's derive locally, read-only, against the parcel ring.
- What could go wrong map-wide, since P-216 took the map down once with a one-branch change.
  Specify the staging proof.

**Road-node questions below are answered ONLY as far as they block rendering after P-249.**

### What is already established (scope section 2c), and what you verify first

- The live derive `POST /api/spine/cortex/api/brokerage/v1/place/buildable-envelope` is
  `atom-reconciled`: when an envelope atom exists, its outcome wins. The map draws the wedge only
  when that call returns `ok` with geometry, for an entitled viewer
  (hauska-map `ExplorerMap.tsx` `handleEnvelope`).
- **Pflugerville** `48453:427599` draws (a buildable atom, 5,027 sq ft, front from the
  situs-named street).
- **San Marcos** `48209:97658` does not. Its atom is `no-buildable-area`, area 0, from
  `cortex-tier1-snapshot-breadth-bake`, dated 2026-07-24, with the front from the nearest street.
- 490,185 envelope atoms in the six counties say `no-buildable-area`, grouped by their own
  `reason`:
  - 208,868 unzoned;
  - 153,775 not onboarded;
  - 123,706 zero with no reason, or copied from the tier-1 snapshot;
  - 1,948 with no layer-23 row;
  - 1,119 road and edge-label failures (Bastrop only);
  - 685 inset failures;
  - 84 superseded.

**Re-derive at least the class totals yourself.** Try to break the mechanism: find a parcel where
the atom says buildable and nothing draws, or one where it says zero and something draws. Give a
second mechanism for the San Marcos symptom and say whether it survives.

### The questions, all of them, not the first one that yields

1. **The draw gap, per city.** For every wired city and the unincorporated remainder of each
   county, count the parcels by ledger setback state against envelope-atom outcome and reason
   class. These are two stores: export parcel ids per city from the factory store, then look
   them up in the atoms store in index-bounded batches. **The headline is "setbacks on record,
   no envelope drawn", per city.** Confirm the rendering on at least three parcels per class
   through the facets endpoint and the live derive.
2. **The whole envelope family, per county, footprints included.** For footprints, also trace why no sheet draws the footprint polygon (engine `site-plan/site-model.ts` and `site-plan/pdf/*` carry footprints only as text today) and what drawing it requires (P-248). Each item is counted, or sampled and declared:
   - setback-rule atoms;
   - boundary-edge atoms: edges per parcel, role distribution, and the edge-level setback state,
     including how many carry "No setback table configured for jurisdiction descriptor";
   - building-footprint atoms;
   - zoning-fact atoms;
   - the matching ledger rails;
   - `maxHeightFt`, `maxLotCoveragePct`, `maxFootprintSqFt` and `parcelAreaSqFt`, including
     Hays's 27,949 refusals.
3. **Road nodes, per county. ONLY where they block rendering after P-249; the full pass is deferred.**
   - `road-node` atom counts; the provenance kinds (OSM, county roadway authoritative, county
     surveyed); vintages.
   - **A second derivation:** compare road coverage against Census TIGER for the same county,
     by count or by length, and say which you used and why.
   - **Street-name normalisation.** Classify all distinct Bastrop failure reasons (654 distinct
     reason strings across the six counties' no-buildable-area atoms). Name the normalisation
     rules that would resolve them: state highways, FM and RM roads, directionals, suffixes,
     misspellings.
   - Where the labeller's name source differs from the situs source, and how often situs has no
     house number or no street.
4. **The two labellers and the two setback registries.**
   - Name the import graph: engine `depth-warm/edgeLabeling.ts`, engine
     `boundary-primitive/lot-line-scrub.ts`, LDT `buildableEnvelope/edgeLabeling.ts`, engine
     `property-reasoning/emit-setback-rule.ts` and its jurisdiction descriptors, and the
     `@empressaio/setback-corpus` package.
   - **Which one minted which atoms?**
   - Is there one implementation consumed twice, or two?
5. **What a re-derive at scale needs.**
   - The writer to use (breadth bake, depth-warm, or a new one), with evidence.
   - Why P-208's re-mint is a no-op.
   - Which runners skip `gateWarmCohort`.
   - Lease and blast-radius requirements.
   - Dry-run parity.
   - The jurisdiction registry rows missing for the wired cities.
   - What the staging branch lets you measure without a production write.
6. **Customer wording per class.** For each failure class:
   - what the map card says and draws;
   - what `get_smart_site` returns;
   - what a PDF would say.

   Mark the PDF leg UNMEASURED where the account is not entitled. Name every place where the
   wording is wrong for the parcel, for example Bastrop's "layer-23" text on a Kyle lot.

### Falsifiers

Pre-register your answers before you run anything.

1. Your class totals must reproduce the scope's, or you show which query is wrong.
2. **Not vacuous:** the draw-gap instrument must report San Marcos `48209:97658` in the "setbacks
   on record, no envelope" bucket and Pflugerville `48453:427599` outside it.
3. **Not vacuous for the unlock:** your P-249 count must include `48209:97658`, or explain why the live derive still refuses it, and it must exclude a genuinely consumed lot. Find one (a verified `no-buildable-area` from `depth-warm-verify-promote`, or a tiny lot).

### Close

**Report.** `_inbox/<date>_scaleup-lb_envelope_roads_report.md`, covering:

- the per-city draw gap;
- the envelope-family counts;
- road-node coverage and the normalisation class list;
- the labeller and registry graph;
- the re-derive requirements;
- the wording defects;
- a checked-in instrument under `scripts/` for the draw gap, with a self-test.

**Close JSON.** `_inbox/<date>_scaleup-lb-envelope-roads_close.json`, carrying:

- `planRows` `["P-249", "P-248"]`;
- `probe` `{"notApplicable": "read-only research lane"}`;
- `falsifier` scored;
- `leave_behind`.
