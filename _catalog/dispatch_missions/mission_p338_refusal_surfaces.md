## Mission — P-338, surface half: the map, the MCP and the PDF say which district and which city

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-map`, `legacy-design-tools` (cortex-api
and `artifacts/smartsite-mcp`) and `hauska-engine` (the PDF), one PR per repo, each from current
`origin/main` with the SHA declared (map `163fde32`, LDT `25d1782f`, engine `c41a1482` at compile). You
do not merge or deploy; the integration seat does both. Any doc_repo change is handed back as a diff in
your close.

### The rulings

- **Ruling 6** (`_decisions/2026-09-18_phase0_closeout_rulings.md`) makes a district-miss refusal an
  accepted Phase 0 terminal state "provided the refusal names the parcel's district and its city and
  says to verify with the city, **on every surface**."
- **A-224** (same file, "Ruling 5 amended") adds a second accepted refusal on the same terms: a parcel in
  a zoned city whose zoning layer was never acquired ("zoning district not acquired; verify with the
  city"). It also adds the OT-10 jurisdiction default, which must always carry its disclosure that a
  recorded plat or another ordinance may set a different line.

The writer half (`_dispatches/2026-09-18_p300-p338-setback-residual-writer_dispatch.md`) writes those
cells: ruling 6's refusal for 9,510 parcels, and A-224's three outcomes for the 48,829 in 40 no-layer
cities. This lane makes sure what the cell says reaches the customer intact.

### Where each surface speaks about a setback it does not have (read at compile)

- **Map:** `apps/property-explorer/api/_lib/setback-decline-wording.ts` (P-257's decline sentence,
  pinned in `setback-decline-wording.test.ts`), `planned-development-district.ts`, and the setback
  facet in `atom-chain-to-facets.ts`.
- **LDT / cortex-api:** `artifacts/api-server/src/lib/buildableEnvelope/authoritativeSetbackSource.ts`,
  `absentZoningHonesty.ts`, `plannedDevelopmentSetback.ts`, `setbackRulesFactFromParcelRecord.ts`,
  `setbackProvenanceDisposition.ts`, `envelopeBriefRefusal.ts`.
- **MCP:** `artifacts/smartsite-mcp/src/tools.ts` (the tools that answer setbacks and draw the
  envelope).
- **PDF:** hauska-engine `packages/engine-core/src/site-plan/resolve-export-setback.ts` and
  `site-model.ts`.

Find out, per surface, what it shows today for a parcel whose setback cell is `refused` with a reason,
and for one whose cell is a default value with a disclosure. Read the served payload and the rendering
code; do not assume the reason travels.

### What to build

1. **The refusal travels verbatim.** On each surface, a ruling 6 refusal shows the parcel's district
   code, the city, and "verify with the city". An A-224 class (a) refusal shows the city and says the
   zoning district was not acquired. Never a generic "setbacks unavailable", and never a figure.
   Where a surface composes its own sentence (P-257's decline wording), it composes it from the
   cell's district and city, not from a literal that omits them.
2. **The default carries its disclosure.** A value from a jurisdiction-default row shows the values
   together with the plat disclosure, on every surface, and is labelled as the city's default line,
   not a district's setback.
3. **The envelope follows.** The drawn envelope (the 2026-09-11 "envelope drawn, figure refused" rule)
   is refused for a refused setback, with the same reason, and drawn from a default line only with its
   disclosure.
4. **Shared wording is one literal.** The sentences are shared across map, LDT and engine. Name each
   one for P-331's cross-repo table (P-331 builds the drift check), and pin it in each repo in the
   meantime.

### Verify by violation

Pre-register your falsifiers. Fixtures built from the writer half's cell shapes (ask the seat for the
writer's PR if it has opened, or build them from its mission's cell specification): a ruling 6
refusal, a class (a) refusal, a Gholson default, and a normal value. On each surface, the pre-change
code drops the district, the city or the disclosure (show it), and the post-change code carries each.
Name the probe the seat runs after the writer's cells are applied and your PRs deploy: `node
--use-system-ca scripts/surface-probe.mjs` in doc_repo, on a district-miss parcel, a Manor parcel and
a Gholson parcel. Pick the three parcels from the store read-only and give their place keys.

### The three-question gate

Answer in your close: what executes the wording on each surface, what triggers it, what fails when a
refusal reaches a customer without its district or city, and what bypasses it (a surface that reads
a baked payload instead of the cell, the PDF's own copy of a sentence).

### Constraints

- No deploys, no merges, no store writes.
- Other lanes are in flight in these repos: P-339 to P-341 (surface agreement), P-353 (Find box),
  P-270's address half and P-354 (Georgetown dates) in map and LDT; P-358 (the PDF's ETJ) in the
  engine. Stay inside the setback refusal and default paths, and name every file you share.

### Close

Declare: the start commits and PRs, per surface what it showed before and after for each of the four
cell shapes, the shared literals for P-331, the three probe parcels, the falsifiers with both
directions shown, the three-question gate answers, and `leave_behind`.
