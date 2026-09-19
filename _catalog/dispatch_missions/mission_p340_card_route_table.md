## Mission — P-340: the card and the drawing route resolve a parcel's setbacks the same way

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-map` and, only where the route itself is
off the shared path, `legacy-design-tools`; one PR per repo from current `origin/main` with the SHA
declared (map `b08f4b89`, LDT `2e7ca7c4` at compile). You do not merge or deploy.

### The rulings and the design choice (made by the seat)

- **Ruling 14** (`_decisions/2026-09-18_phase0_closeout_rulings.md`): card vs draw table, the
  most-current source wins, and an unreadable date produces a conflict row carrying both.
- **The mechanism is already decided:** `_decisions/2026-09-13_share_the_most_current_setback_resolver.md`
  puts ONE resolver in ONE package, `@empressaio/setback-corpus/resolve`. The first P-339/P-341 lane
  left two options open (`_inbox/2026-09-18_p339-p341-surface-agreement_close.json`
  `leave_behind[1]`): (a) the card reads the route's resolution and echoes it, or (b) the card
  resolves through the shared resolver. **Build (b).** Reasons: the standing decision already names
  one resolver for every producer; and (a) would put the draw route on the card's hot path, and the
  register records that route answering 504 under load.

### What is wrong (measured)

The probe's `PANEL-DRAW-TABLE-DISAGREE` fires on 7 parcels (the class compares the two 4-tuples with no
exemptions). Two mechanisms:

- **A missing or differing corner axis on the card** (5): `48209:140047` card 20/10/25/- against route
  20/10/25/15; `48209:142415`, `48209:145880`, `48209:166141`, `48209:97658` alike.
- **A wholly different table** (2): `48453:367134` and `48453:239852`, card 25/5/10/15 against route
  15/3.5/5/10.

hauska-map `apps/property-explorer/api/_lib/codified-setback-from-zoning.ts` is a vendored four-city
table resolving by exact leading-token match. The route resolves through LDT's adapters (`mapDistrict`
plus R-1 source selection) and `authoritativeSetbackSource.ts`, which the standing decision moved onto
the shared resolver. The card also serves record-path setbacks (`setbackSource: "parcel-record"`) where
the ledger rails are served.

### What to build

1. **Per subject, name each side's source first.** For the 7 parcels: which source, table and row the
   card served and which the route served, with dates. A table, before any code.
2. **The card resolves through `@empressaio/setback-corpus/resolve`** wherever it would otherwise
   resolve from the vendored table, so card and route pick among the same sources by the same rule.
   Say what happens to `codified-setback-from-zoning.ts`: retired by decline (a test fails if it is
   imported again) or kept for a named reason. Mind the LDT esbuild `["workspace"]` condition if LDT
   changes.
3. **The conflict row.** Where the most-current source's date is unreadable, both surfaces serve the
   conflict row carrying both candidates (the P-270 citation-vintage vocabulary already exists; reuse
   it).
4. **A divergence test** between the card's answer and the route's for the 7 parcels, failing on
   disagreement (ENFORCEMENT: paired controls need one).

### Verify by violation

Pre-register your falsifiers: each of the 7 agrees after the change and disagreed before; a parcel with
an unreadable winning date shows the conflict row on both surfaces; the divergence test fails when one
side's table is changed alone. Grade with `node --use-system-ca scripts/surface-probe.mjs --rows P-254`
(doc_repo) after the seat deploys; the class must read zero.

### The three-question gate

What executes the resolution on each surface, what triggers it, what fails when they disagree, and what
bypasses it (a surface that resolves outside the shared package; the bake's stored values).

### Constraints

- No merges, no deploys. Setback values do not change except where the most-current rule says the card
  was wrong; list every value that changes.
- P-339's MCP half runs in parallel in LDT. P-354's factory half (#179) and the P-300/P-338 writer touch
  setback rows; read #179 at its head.

### Close

Declare: the start commits and PRs, the per-subject source table, the retirement decision, the
falsifiers with both directions shown, the three-question gate answers, and `leave_behind`.
