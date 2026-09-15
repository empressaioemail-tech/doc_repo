## Mission — P-154 (wave 6): when two city sources disagree, the card says so

You are the deepest worker in OPS-23 wave 6. You do not spawn sub-agents. The dispatch
planner supervises you and runs `scripts/surface-probe.mjs --rows P-154` after your deploys.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### The finding (operator 2026-09-14, verified at source)

For `48021:34049` (1109 Pecan, SF-1), the City of Bastrop's own services disagree: the
Zoned Parcels layer (`Zoned_Parcels/FeatureServer/83`, edited 2026-07-23) prints 30/10/30/20
citing the Bastrop Development Code Sec. 14.02.003; the One Click layer
(`Parcels_One_Click/FeatureServer/23`, edited 2026-08-24) prints 25/5/25/15 citing Ordinance
2019-51, which Ordinance 2026-06 repealed effective 2026-04-14. Our card prints 30/10/30/20
from the ordinance text (corpus `bastrop-development-code`, human-verified) and says nothing
about the One Click card a customer can open in the city's tool. R-1 (most-current wins, date
read at source) says a disagreement between readable-dated sources is a CONFLICT ROW: both
values, both citations, both dates, and which one we follow and why. The P-154 lane left
conflicts in `display_meta.second_source`, never on the card, and `getSetbackTableForZoning`
returns `SetbackTable | null` with no conflict variant.

### Where you work

`hauska-engine-p154-conflict` (branch `feat/p154-conflict-row`), `legacy-design-tools-p154-conflict`
(branch `feat/p154-conflict-row-mcp`), `hauska-map-p154-conflict` (branch
`feat/p154-conflict-row-panel`), from `origin/main`; declare start commits.

### What you build

1. **The type.** `SetbackResolution` already carries `ConflictSetback` in the corpus `./resolve`
   subpath. The engine's `getSetbackTableForZoning` gains the conflict variant instead of
   collapsing to a value; every caller handles it (the compiler finds them). A conflict is:
   two sources with readable dates whose values differ; the resolver still names the one it
   follows (most current by effective date; a layer's edit date is not a content date when its
   citation names an older ordinance) and carries the other as `secondSource` with its date and
   citation.
2. **The surfaces.** Panel, `get_smart_site` and the PDF print the followed values with the
   citation and effective date, and a one-line conflict note: "The city's One Click card shows
   25/5/25/15 citing Ord. 2019-51 (repealed 2026-04-14)". Same string on all three, from the
   vocabulary package (add the token; bump; P-167's pattern). Deploy under leases.
3. **Observation.** After the deploys, the planner pastes the panel, MCP and PDF strings for
   `48021:34049` into the P-154 observations and runs the probe; the row predicate accepts
   "all four equal with a source date" or "all four show the conflict row".

### Falsifiers

- If any surface prints a value with no citation after the change, the disclosure is missing.
- If the conflict note appears where the two sources agree, the detector is wrong.
- If `getSetbackTableForZoning` still returns a bare value on a real conflict, the type did
  not reach the caller.

### Out of scope

Deciding which Bastrop source is right in law (the operator asks the city). New tables.

### Close

`_inbox/<date>_p154-conflict_close.json`, `planRows` `["P-154"]`, with the PRs and merge SHAs
with conclusion strings, the token version, the revisions and deployment by field, the three
strings, and the planner's probe artifact. `leave_behind` is required.
