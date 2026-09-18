## Mission — P-353: the Find box tells the customer which kind of "no result" it is

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-map` only and open one PR, branched from
current `origin/main` with the SHA declared. You do not merge or deploy; the integration seat does both.
Any doc_repo change is handed back as a diff in your close.

### What is wrong, measured 2026-09-18

The coverage answer is right upstream and lost on the map. For an address that does not exist in a real
locality, the customer is owed one of four answers: a covered miss (`no-hit`), an uncovered county named
with its state (`county_out_of_coverage`), out of state (`out_of_coverage`), or "the coverage check is
unavailable" (`coverage_check_unavailable`). The upstream route (`legacy-design-tools`
`routes/brokeragePlaceSitusSearch.ts`) returns `missClass` plus `outOfCoverageCounty` /
`outOfCoverageState` / `coverageCheckUnavailableReason`; the MCP's `find_parcel` serves them correctly
(P-205's MCP half PASS 4 of 4, `_inbox/2026-09-18_155840_surface_probe.json`). The map does not:

| Query on `smartsite.cloud/api/pe-situs-search` | Owed | Served |
|---|---|---|
| `99999 ZZYZX RD, AUSTIN, TX 78701` | `no-hit` | `{"hits":[]}` |
| `99999 ZZYZX RD, CAMERON, TX 76520` | `county_out_of_coverage`, Milam County (48331), TX | `{"hits":[]}` |
| `99999 ZZYZX RD, MARBLE FALLS, TX 78654` | `county_out_of_coverage`, Burnet County (48053), TX | `{"hits":[]}` |
| `1600 BROADWAY, DENVER, CO 80202` | `out_of_coverage`, CO | `{"hits":[]}` |

Where it is lost, read at hauska-map `163fde32`:

- `apps/property-explorer/api/_lib/pe-situs-search-core.ts` lines 82 to 106 map the upstream JSON to
  `{ hits }` only.
- `apps/property-explorer/src/lib/situs-search-client.ts` returns the hit array only, so the UI never
  sees a miss class at all. `api/pe-situs-search.ts` says the situs index ranks above a Photon geocode:
  find out whether an empty situs answer falls through to a geocoded point, because a geocoded pin for
  an address we do not cover is a worse answer than an empty list.

### What to build

1. The BFF passes the four fields through unchanged beside `hits`.
2. The client and the Find box carry the miss class to the customer: a sentence per class, naming the
   county and state for an uncovered county and the state for out of state, and saying the coverage
   check is unavailable (never "no results") when it is. A covered miss reads as a covered miss.
3. If an empty situs answer falls through to a geocoder, a miss class of `county_out_of_coverage` or
   `out_of_coverage` stops that fall-through (a geocoded pin must not stand in for "we do not cover
   this county"); say what you found and what you changed.
4. Check the BFF's 5 s upstream timeout against the coverage path's measured latency (3.8 s end to end
   for Cameron on 2026-09-18). A timeout must read as "coverage check unavailable", never as a miss.

### Verify by violation

Pre-register your falsifiers before you run them. Revert-and-run on the BFF and client fixtures built
from the live upstream shapes: the pre-change code drops `missClass`, the post-change code carries it
for all four classes; a query that finds hits is unchanged byte for byte. Name the probe for after the
deploy: `node --use-system-ca scripts/surface-probe.mjs --rows P-205` in doc_repo, map half PASS on the
four coverage subjects.

### The three-question gate

Answer in your close: what executes the miss class on the map, what triggers it, what fails when it is
dropped again, and what bypasses it (the Find box's other paths: parcel-id search, a geocoder).

### Constraints

- No store writes, no deploys, no merges. hauska-map only.
- hauska-map main carries P-332 (#419). P-339 to P-341 (surface agreement) and P-270's address half
  are in flight in other files of this repo; stay inside the Find box path and name any file you share.

### Close

Declare: the start commit and PR, the files changed, what the geocoder fall-through does, the
falsifiers with both directions shown, the probe to run after the deploy, the three-question gate
answers, and `leave_behind`.
