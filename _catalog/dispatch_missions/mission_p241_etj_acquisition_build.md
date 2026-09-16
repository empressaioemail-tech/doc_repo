## Mission — P-241 build, acquisition half: give ETJ a real data source

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

### Where you work

`legacy-design-tools`, `lib/cad-ingest/src/boundary/` and `lib/db/src/schema/`. No worktree
exists yet for this lane. Clone fresh from `origin/main`, cut your own branch, and declare the
commit you started from before you write anything. A second lane (P-206) may be running
concurrently in this same repo, scoped to `artifacts/smartsite-mcp` and possibly
`hauska-engine` — do not touch either; this row has no reason to.

### Context: this is the acquisition half of a larger, already-enumerated build

P-241's read-only investigation lane closed 2026-09-15
(`_inbox/2026-09-15_p241-etj-enumeration_close.json` — read it in full; it is short and answers
most of what follows in more detail than this mission repeats). It found: ETJ is hardcoded
`"unresolved"` at eight sites across three repos; 20 of 23 wired cities publish a directly
queryable ETJ layer; and — the load-bearing finding for THIS mission — **the two consumer
hardcode sites in `hauska-engine` (`report-model.ts:966`, `feasibility.ts:210-212`) do nothing
useful once unwired, because no real ETJ data exists anywhere in this product yet.** Building
the acquisition path first is the only sequencing that produces a customer-visible result;
unwiring the consumer sites before this exists just swaps one hardcoded "unresolved" for
another. **This mission is acquisition only. Unwiring the consumer sites (hauska-engine,
hauska-map) is explicitly follow-on work, not this lane's job — see "Do not" below.**

### The traced repo attribution — read this, don't re-derive it

Two live mechanisms exist in this portfolio for a jurisdiction-shaped fact; the close doc
traced both and named the right one for ETJ:

- **Chain A (city limits, THIS repo, already wired for every non-slated county today):**
  TxGIO statewide layer → `@workspace/cad-ingest`'s boundary-ingest CLI → `tx_city_boundary`
  table (`lib/db/src/schema/txCityBoundary.ts`) → `resolveCityContainmentAtPoint()`
  (`lib/cad-ingest/src/boundary/containment.ts`) → `cityLimitsFactFromContainment()`
  (`lib/cad-ingest/src/boundary/cityLimitsFact.ts`) → `loadCityLimitsFact()` →
  `loadCityLimitsFactForServe()` (checks a per-county slate, routes to Chain B for slated
  counties, else falls through to live point-in-polygon here) → consumed by
  `artifacts/api-server/src/routes/brokerageNodeFacets.ts:864` and
  `routes/propertyExplorer.ts:312`.
- **Chain B (the ledger/atom architecture, `hauska-engine`+`hauska-factory`, live for special
  districts, NOT for jurisdiction/ETJ data, and only serves currently-slated counties):**
  named in the close doc for completeness; **do not build against this chain** — it does not
  cover most counties today, and `hauska-factory`'s own `parcel-record-rail-registry.ts:54`
  already declares an `etjStatus` slot that sits dead (zero entries in
  `parcel-record-slate.json`'s 152 rows) precisely because no writer has ever populated it.
  Populating that slate is a real alternative future path, not this mission's job.

**Chain A is where this mission builds**, per the close doc's own conclusion: "this is the
layer's real closest sibling, already fully wired, and is the DEFAULT path for essentially
every county today."

### What to build

Mirroring `txCityBoundary.ts`'s existing shape (read it first — do not design from scratch
what already has a working precedent one file away):

1. **Schema:** a new `tx_etj_boundary` table in `lib/db/src/schema/`, sibling to
   `txCityBoundary.ts`. Read that file's actual column shape and mirror it; do not invent a
   different one without a stated reason.
2. **Acquisition:** a bulk-ingest CLI mirroring the existing City_Boundaries pull, targeting a
   real, queryable ETJ source. **You have a menu of real, already-enumerated sources from the
   close doc's `enumeration` block** — do not re-discover them. Start with Austin (388 polygons,
   confirmed live and re-measured this session:
   `services.arcgis.com/0L95CJ0VTaxqcmED/arcgis/rest/services/BOUNDARIES_jurisdictions/
   FeatureServer/0`) since it is the largest city in the footprint and its data is the most
   scrutinized already. Extend to the other 19 cities with a confirmed layer using the close
   doc's per-city URL table — you do not need to re-enumerate, but DO spot-verify a handful live
   before trusting the close doc's URLs wholesale (they are 1 day old; a source going stale
   between then and now is a real, if small, risk).
3. **Containment:** extend `containment.ts` (it already has an `etjUnresolved()` function that
   is unconditional today — "this module was BUILT for ETJ and still cannot resolve it," per
   the close doc) or add a sibling module, your call, but state which and why.
4. **Fact DTO + read path:** mirror `cityLimitsFact.ts` → a new `etjFact.ts`-shaped module, and
   the corresponding `load...Fact()` read function.

### Predicate

A real ETJ query, run against a real onboarded-footprint address (Austin, at minimum), returns
a genuine present/absent-verified/unresolved disposition backed by live source data — not a
hardcoded string. The mechanism generalizes to the other 19-of-23 cities with a confirmed
layer without a per-city code branch (a config/registry entry per city, not an if-chain).

### Falsifiers, pre-register your answers before you run anything

1. **Austin, a real address inside the 2-mile ETJ ring.** Query your new path and get a real
   `present` ETJ disposition citing the source, not `unresolved`.
2. **Austin, a real address inside city limits (not ETJ).** Confirm your path correctly
   distinguishes this from the ETJ case — the combined-layer cities (Austin, New Braunfels,
   Kyle, Cibolo) all carry city-limits and ETJ in ONE layer distinguished by an attribute value;
   read that distinguishing field correctly or you will misclassify both.
3. **Round Rock or Cedar Park** (city-limits-only, no ETJ layer found on their own host per the
   close doc). Confirm your path returns an honest `unresolved`/absent-source disposition for
   these, not a false negative dressed as a confirmed absence — there is a real difference
   between "checked, no ETJ here" and "no source to check."
4. **A city outside the 23-city footprint entirely.** Confirm your path does not silently
   return a false answer for a county/city this acquisition was never pointed at.

### Known traps

- **The two SB numbers are both real and mean different things — do not conflate them.**
  SB 2038 (2023, confirmed against capitol.texas.gov) created ETJ release by petition/election/
  municipal inaction. SB 1844 (2025, confirmed) is a different, narrower disannexation
  mechanism (water/wastewater service failure near navigable water) — land disannexed under it
  lands IN the ETJ, not released from it, per Austin's own council records. Both are cited
  correctly in the close doc; if you touch any statutory-derivation logic (you should not need
  to — this mission is acquisition from live GIS sources, not statutory computation), do not
  merge these two.
- **Do not build a §42.021 statutory-buffer derivation.** That approach is retired as a
  candidate, not merely deferred — Austin's real ETJ is shaped by individual AG-development
  agreements and disannexation actions that a formula would contradict. Acquire the real
  published layer; do not compute one.
- The close doc's per-city URLs are informational, gathered by a sub-agent and only spot-
  verified for 2 of 22 non-Austin cities (New Braunfels, Bastrop) — treat the rest at one notch
  lower confidence, per the close doc's own disclosure.
- `P:/hauska-engine`'s local checkout was found stale during the close (predates the entire
  site-plan feature area). Irrelevant to this mission's scope (you're not touching
  hauska-engine), but if you find yourself reaching for that repo for any reason, fetch fresh.

### Do not

- Do not touch `hauska-engine` (`report-model.ts`, `feasibility.ts`) or `hauska-map`'s three
  duplicate hardcode sites. Unwiring the consumers is explicit follow-on work, not this
  mission — it does nothing useful before this acquisition exists, and doing it now would be
  two lanes racing on files this mission has no need to touch.
- Do not touch `artifacts/smartsite-mcp` or `artifacts/api-server`'s routes — a concurrent lane
  (P-206) may be working there.
- Do not build against Chain B (the ledger/atom architecture) or populate
  `parcel-record-rail-registry.ts`'s dead `etjStatus` slot — that is a different, larger,
  unscoped alternative path, not this mission.
- Do not deploy or run the ingest CLI against production. Open the PR green and hand it back;
  a real bulk-ingest run against production data is a separate, deliberate operator-triggered
  step per this repo's own ingest conventions.
- Do not spawn sub-agents.

### Close

State your snapshot (repo, branch, commit). Name the exact schema, files, and CLI you built.
Paste all four falsifier results with real query output. Name how many of the 20 cities with a
confirmed layer your registry actually covers at close (all 20 is not required to close this
row — say honestly how many, and why any gap). Declare `leave_behind` explicitly, including
the six duplicate hardcode sites (three in this repo, three in hauska-map) and the
hauska-engine consumer-unwiring work this mission deliberately did not touch.
