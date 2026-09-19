## Mission — P-379: a city not established at source carries a declared refusal, not `unaccounted`

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-factory` and open one PR from current
`origin/main` with the SHA declared. **Fire after P-378 closes** (its table is this lane's input for which
cities remain unsettled). You do not merge, deploy, apply or write any store.

**Operator ruling (2026-09-19, `_decisions/2026-09-19_unclassified_cities_research_then_declared_refusal.md`,
option C):** a no-table city still not settled at source after P-378 gets a DECLARED REFUSAL on its
parcels' setback cells, so the setback gates can close. The ruling names its own cost: this lowers
`unaccounted` without acquiring anything, which ENFORCEMENT calls relabelling. So it must be honest,
counted and reopenable.

### What to build

1. **Apply P-378's table first.** Cities P-378 classified go into `city-setback-classification.json` with
   their evidence (via `scripts/build-p300-city-classification.mjs`), exactly as the first two tables did.
   Thrall's row is corpus work (a coded jurisdiction-default row), not this lane's: name it for the corpus
   batch that follows P-377.
2. **A new, explicit class for the residue**, e.g. `unclassified-declared`: the writer writes a REFUSAL on
   the five setback rails with the reason "this city's zoning status is not established at source; verify
   the setback line with the city", and a basis carrying the city, what was read, what would settle it,
   the ruling id, and `corpusVersion`/`class` fields P-377 can read. Never a value, never `absent-verified`,
   never folded into ruling 6's or class (a)'s refusal (a reader must be able to count it on its own).
3. **Reopenable.** P-377 (in flight) releases a refusal this job wrote when its classification entry
   changes. Confirm this refusal carries what P-377 reads, and add a test that a later classification of
   the city reopens its parcels. If P-377 has not merged, coordinate: say what it must read.
4. **Counted.** The run report carries the declared-refusal parcels as their own counter per city.

### Verify by violation

Pre-register: the per-county parcel counts that move from `unaccounted` to the declared refusal (from
P-378's residue), and zero movement for any classified city; a fixture city later classified reopens; the
reason never reads as "no setback applies". Then a read-only per-county dry run under the heavy-scan lease,
beside the prediction.

### Close

Declare: the start commit and PR, the class and its reason text, the counts, the falsifiers with both
directions shown, and `leave_behind` (including the cities still owed a real classification).
