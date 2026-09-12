## Mission — P-174 ONE PLACEMENT PATH: a search-landed subject seals the same sheet a click does

You are the deepest worker in OPS-23 wave 3 (added as an addendum). You do not spawn
sub-agents. The dispatch planner supervises you, reviews your design at CP1 and your first
pilot at CP2, and runs the surface probe itself after your deploy.

Exit-bounded verification: every command you run must terminate on its own; wrap anything
that could hang in `timeout`; never leave a watch, a tail or a dev server running.

### Where you work

`empressaioemail-tech/hauska-map`, worktree `P:/seat-worktrees/property/hauska-map-p174-landing`,
branch `fix/p174-search-landing-seals-full-sheet`, from `origin/main`. Declare the start commit.
`P:/hauska-map` is someone else's checkout. P-152 lane 3 and P-167 also change Property
Explorer this wave; rebase before your PR, re-green on the current base, merge only on the
conclusion string `success`.

### The finding (F20, operator 2026-09-12)

"When I search a property and make the property subject so the program clicks the property,
versus me manually clicking a property, when the system selects it the setbacks don't show
up and I have to click another property then come back and click my subject in order for
the setbacks to show." Two placement paths produce two sealed sheets for one parcel; only the
click path shows setbacks. OPS-23 P-151 ruled that placement never depends on geocoding and
seeds from the record point; invariant I2 says the card issues no lookup of its own and reads
the sealed sheet. A sheet that seals differently depending on how the subject was reached is
the defect class this program hunts: one truth, two paths.

### What is true today (hauska-map `4350ab9` and the P-153 checkpoints; re-verify at your start commit)

- Search landing: `SearchBar.tsx` submit calls `runParcelLookup` (`browse/ExplorerMap.tsx:2208, 1002`),
  which resolves the id through `resolveLookupToParcelNodeId` (`src/lib/parcel-lookup.ts:141`,
  situs index first since P-172) and lands through `executeSearchLanding` (`ExplorerMap.tsx:1329`)
  and `adoptSubject`, which passes only `{ geometry }` to the resolver (P-151 verification).
- Click: `InspectCard` reads the sealed sheet from `fact-sheet-resolver.ts resolveSheet`;
  `ExplorerMap.handleEnvelope` draws from it (I2).
- P-153's checkpoint (`_inbox/2026-09-11_p153-draw_cp2.json`, contradictedSoFar): the
  live-envelope augmentation `augmentFacetsWithLiveEnvelope` had zero production callers until
  hauska-map #386 wired it into `resolveSheet`; and `resolveGeometry` fetches live envelope
  geometry "only as a placement-seed side effect gated on `!seed`", and P-151's record-point
  fallback satisfies `seed` for exactly these parcels. Two mechanisms that fit the operator's
  observation: (a) the search-landing path seals the sheet on a code path that skips the
  envelope augmentation, or seals before the record point exists, while the click path
  re-resolves with it; (b) a sheet cache keyed by parcel id holds a sheet sealed during the
  typeahead or the landing without setbacks, and clicking another parcel evicts it so the
  return click re-seals. The measurement decides.

### The change

1. **Measure first.** With the browser's network tab and the console, reproduce the
   operator's sequence on `48021:34049`: search `1109 PECAN ST`, land, read the card (no
   setbacks); click a neighbour; click back (setbacks). Record for each step which resolver
   entry ran, whether `augmentFacetsWithLiveEnvelope` ran, which facets and envelope the
   sealed sheet carried, and whether a cached sheet was served. Paste it in CP1 and name the
   mechanism with the second one rejected.
2. **One sealing path.** A subject reached by search, by parcel id, by a shared link or by a
   click seals through one function with one input shape (the record's own point and
   geometry, per P-151), and the card reads that one sheet. Delete the branch that seals
   without the augmentation, or the cache entry that outlives its inputs; never add a
   "re-resolve on landing" that leaves two paths alive.
3. **A test that fails on the bug.** A test drives the search-landing path and asserts the
   sealed sheet carries the same setbacks and envelope variant as the click path for the same
   fixture; and a test that a sheet sealed with an incomplete input is never cached as
   complete.

### Verification, and the falsifier you pre-register

Write down at CP1: *if after the deploy a search for `1109 PECAN ST` lands on a card without
the setbacks row while a click on the same parcel shows it, the row is not done.* Deploy
Property Explorer through the Vercel CLI, live bundle confirmed. The planner runs
`node scripts/surface-probe.mjs --rows P-174 --observations <file>`; the P-174 predicate is
observed: `searchLandedSetbacksShown` (the operator searches `1109 PECAN ST` and the card
shows setbacks without any second click) and `clickSetbacksShown` (the same after a click),
both true, with `observedBy` and `observedAt`.

### Close

`_inbox/<date>_p174-landing_close.json` per AGENT_CONTRACT §6 plus the OPS-23 four fields.
`leave_behind`: every other entry path you found (shared link, saved property, screen), and
whether each seals through the one function after this lane.
