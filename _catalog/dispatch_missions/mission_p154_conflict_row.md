## Mission — P-154 (wave 6): when two city sources disagree, the card says so

You are the deepest worker in OPS-23 wave 6. You do not spawn sub-agents. The dispatch
planner supervises you and runs `scripts/surface-probe.mjs --rows P-154` after your deploys.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### AMENDMENT (A-148, overseer 2026-09-14T14:10Z) — F24 RESOLVED AT SOURCE

**The conflict VARIANT and the type work stand exactly as written below. Only the finding's
mechanism and the conflict-note sentence are amended.**

The City of Bastrop named `Zone_Types/FeatureServer/25` (updated 2026-07-09) as its **current,
authoritative** zoning layer. Its SF row says 30/10/30/20 in its TEXT fields and **25/5/25** in
unrefreshed numeric shortcut columns (`FrontSetback_`, `SideSetback_`, `RearSetback_`; there is
no numeric corner column). **One Click reads the numbers.** So this is not two layers citing two
ordinances: it is ONE current layer whose numeric columns were never refreshed, and the city's
words agree with our card.

Superseded by this amendment, do not act on these: (a) the framing that `Zoned_Parcels/83` and
`Parcels_One_Click/23` are two competing sources with different ordinances; (b) the claim that
Ordinance 2019-51 governs the One Click values and that Ordinance 2026-06 repealed it — 2019-51
"on draft zone types" was the earlier read from One Click layer 23 and the resolution names
stale columns, not a repealed ordinance; (c) the conflict-note string in item 2 below, which is
replaced by the exact sentence given there.

### The finding (operator 2026-09-14, verified at source; mechanism corrected by A-148)

For `48021:34049` (1109 Pecan, SF-1), a customer who opens the City of Bastrop's own tool and a
customer who reads our card see different numbers for the same parcel. Our card prints
30/10/30/20 from the ordinance text (corpus `bastrop-development-code`, human-verified) and
matches the city layer's TEXT fields; the One Click join reads that same layer's unrefreshed
numeric shortcut columns and shows 25/5/25. R-1 (most-current wins, date read at source) says a
disagreement between readable-dated sources is a CONFLICT ROW: both values, both citations, both
dates, and which one we follow and why. The P-154 lane left conflicts in
`display_meta.second_source`, never on the card, and `getSetbackTableForZoning` returns
`SetbackTable | null` with no conflict variant.

**OPEN FOR THE OPERATOR (do NOT resolve in-lane).** A-148's card text records the `Zone_Types/25`
SF row as citing **Ordinance 2024-38**, while the sentence the overseer specified for the
conflict note cites **Ordinance 2026-06** (the B3 Code Repeal and Adoption ordinance our corpus
already carries). Both appear in this wave. Build the sentence with the ordinance the overseer
specified (2026-06), and flag the 2024-38 / 2026-06 divergence in your close with both readings;
do not silently pick one.

### Where you work

`hauska-engine-p154-conflict` (branch `feat/p154-conflict-row`), `legacy-design-tools-p154-conflict`
(branch `feat/p154-conflict-row-mcp`), `hauska-map-p154-conflict` (branch
`feat/p154-conflict-row-panel`), from `origin/main`; declare start commits.

### What you build

1. **The type.** `SetbackResolution` already carries `ConflictSetback` in the corpus `./resolve`
   subpath. The engine's `getSetbackTableForZoning` gains the conflict variant instead of
   collapsing to a value; every caller handles it (the compiler finds them). A conflict is:
   two sources with readable dates whose values differ; the resolver still names the one it
   follows (most current by effective date) and carries the other as `secondSource` with its
   date and citation. A-148 adds a second shape of the same conflict that the detector must also
   catch: **one source whose TEXT fields and the numeric shortcut columns its join reads
   disagree** (the Bastrop case), where the followed value is the text value and the second
   source is the same layer's numeric column. The detector distinguishes the two shapes so the
   note can say which one it is; it never prints a value with no citation.
2. **The surfaces.** Panel, `get_smart_site` and the PDF print the followed values with the
   citation and effective date, and a one-line conflict note. For `48021:34049` that sentence is
   EXACTLY (one sentence, identical on all three surfaces):

   `The city's One Click card shows 25/5/25 from unrefreshed numeric columns of its zoning layer; the same layer's text and Ordinance 2026-06 say 30/10/30/20 (confirmed with the City of Bastrop 2026-09-14)`

   Note the shape A-148 requires of `setbackConflictNote`: the second source's values come from
   the numeric shortcut columns, so three axes and **no corner** (there is no numeric corner
   column); the sentence names the columns as unrefreshed rather than citing a repealed
   ordinance; and the ordinance clause names the current ordinance the text fields reflect.
   Same string on all three surfaces, from the vocabulary package (add the token; bump; P-167's
   pattern). Deploy under leases.
3. **Observation.** After the deploys, the planner pastes the panel, MCP and PDF strings for
   `48021:34049` into the P-154 observations and runs the probe; the row predicate accepts
   "all four equal with a source date" or "all four show the conflict row".

### Falsifiers

- If any surface prints a value with no citation after the change, the disclosure is missing.
- If the conflict note appears where the two sources agree, the detector is wrong.
- If `getSetbackTableForZoning` still returns a bare value on a real conflict, the type did
  not reach the caller.
- A-148: if the note still says the One Click values cite Ordinance 2019-51 and that it was
  repealed, the amendment did not land — the resolved mechanism is unrefreshed numeric columns.
- A-148: if the note prints a corner value for `48021:34049`, it read a column that does not
  exist (the numeric shortcut columns are front/side/rear only).

### Out of scope

Deciding which Bastrop source is right in law — **RESOLVED by A-148**: the city named
`Zone_Types/FeatureServer/25` as its current layer, and its TEXT fields (30/10/30/20) match our
card; the operator tells the city its numeric columns are stale. New tables.

### Close

`_inbox/<date>_p154-conflict_close.json`, `planRows` `["P-154"]`, with the PRs and merge SHAs
with conclusion strings, the token version, the revisions and deployment by field, the three
strings (which must all equal the A-148 sentence character for character), the
2024-38 / 2026-06 ordinance divergence with both readings, and the planner's probe artifact.
`leave_behind` is required.
