## Mission — P-156 (Bastrop pilot): the per-city zoning completeness declaration that unblocks the CTX bake

You are the deepest worker in OPS-23 wave 6. You do not spawn sub-agents. The dispatch
planner supervises you and reviews CP1 (the declaration's shape) before any write.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### AMENDMENT (A-148, overseer 2026-09-14T14:10Z) — F24 RESOLVED AT SOURCE

**Scope added to item 2 and its falsifiers; nothing else changes.**

The City of Bastrop named `Zone_Types/FeatureServer/25` (updated 2026-07-09) as its **current,
authoritative** zoning layer. Its SF row carries 30/10/30/20 in its TEXT fields and 25/5/25 in
unrefreshed numeric shortcut columns (`FrontSetback_`, `SideSetback_`, `RearSetback_`; there is
no numeric corner column), and the One Click join reads the NUMBERS.

For this declaration that means two hard rules:

- **The district source is `Zone_Types/25`'s TEXT fields, never the underscore numeric
  columns.** A district read from `FrontSetback_`/`SideSetback_`/`RearSetback_` is reading stale
  data; those columns are values, not district, and they are never the `field` the declaration
  records as the zoning district source.
- **The declaration records the discrepancy per district.** Where the text fields and the
  numeric columns disagree, the declaration names the district and both readings, so a later
  lane can see which districts the city's own layer contradicts itself on. It is data with
  provenance, not a note.

Superseded: item 2's framing that `Zoned_Parcels/83` and `Parcels_One_Click/23` are two
competing services whose setback disagreement the declaration must record. The live question is
one layer's text-vs-numeric divergence, and P-154 owns the setback VALUES (out of scope here).

### Why this row is the CTX blocker

**AMENDED 2026-09-14 (planner, verified by the lane's CP1 and re-verified by the planner at
`origin/main`). The premise below as originally written is STALE — do not act on it as a claim
about today.**

As written on 2026-09-08 (`_decisions/2026-09-08_zoning_unaccounted_two_populations.md`): after
`parcel-r5-zoning` re-ran, 5,876 in-city parcels across the six counties were still `unaccounted`
for `zoningDistrict` (Bastrop 181, Travis 2,758, Williamson 1,271), the rail gate is
zero-tolerance, and clearing them honestly needed a PER-CITY COMPLETENESS DECLARATION that existed
nowhere.

**Measured state 2026-09-14 — all three clauses have moved:**

- Bastrop's `zoningDistrict` unaccounted count is **0**, not 181, and the gate reads `pass`, not
  refuse. Measured two ways by the lane: the real gate code
  (`src/lib/parcel-record-engine/gate-rail-cli.mjs --county=48021 --rail=zoningDistrict` ->
  `{ok: true, unaccountedCount: 0, cellCount: 62256}`) and the stored verdict
  (`parcel_gate_verdict`: all six CTX counties `verdict='pass', unaccounted_count=0`).
- The 181 were each disposed with a written reason on 2026-09-08/09: 155 `not-applicable` carrying
  a `completenessDeclaration` key (city=Bastrop, DECLARED_COMPLETE), 9 `refused` naming Elgin's
  declared layer gap, 17 `value` from `txgio_parcel.zoning_district` (Elgin staleness class).
  155 + 9 + 17 = 181 exactly.
- **The declaration exists** — it is `src/config/zoning-layer-completeness.mjs` (30,291 chars, 428
  lines, tracked at `origin/main`), exporting `DECLARED_COMPLETE` (22 cities), `EXPLICITLY_HELD`
  (Elgin) and `DECLARED_LAYER_GAP`, and it is consumed by `src/jobs/parcel-r5-zoning.mjs`
  (imports at lines 87-92, used at 399). Its own header says it is "that missing declaration" and
  "the ONLY thing that makes a `not-applicable` on this rail defensible".

So **nothing is blocked and there is no before/after gate write to make.** Do not fabricate one.

**What still stands, and is this lane's real job.** The declaration is a **code constant**
(`.mjs`), which is exactly the shape item 1 forbids: it carries a declared set and its numbers but
not the per-city provenance record the mission specifies. This lane therefore ADDS the missing
versioned-data shape (provenance, the city's own layer read at source with its `lastEditDate`, the
district source field, the measured counts and the unmatched dispositions, the A-148 per-district
text-vs-numeric discrepancy), binds it to the live constant with a divergence test (one
authoritative copy per DEV_PROCESS 6.2; no second declared set), and performs **no store write**.
Travis and Williamson follow with the same shape in the next wave.

Writing `not-applicable` to clear a count is still forbidden (the relabelling tripwire stands).

### Where you work

`hauska-factory-p156-bastrop` (branch `feat/p156-city-completeness-declaration`),
`hauska-engine-p156-bastrop` (branch `feat/p156-city-declaration-consumer`) if the reader
must read the declaration, from `origin/main`; declare start commits.

### What you build

1. **The declaration.** One record per city: the staged zoning layer (URL, field, the city's
   own last-edit date read at source), the city limits polygon used, the parcel count in city
   limits, the count matched to a district polygon, the count matched to none, and a state:
   `DECLARED_COMPLETE` (the city publishes one layer and it covers its limits; the unmatched
   parcels are named with a reason each, e.g. right-of-way, water, county island) or
   `EXPLICITLY_HELD` (with the numbers and the reason the layer cannot be called complete). It
   is data with provenance, versioned, read by the gate; never a code constant.
2. **Bastrop.** Run `zoning-discovery` for Bastrop, and read the city's **current** zoning layer
   `Zone_Types/FeatureServer/25` (updated 2026-07-09) live this week, plus the two services the
   earlier read named (`Zoned_Parcels/FeatureServer/83`, edited 2026-07-23, and
   `Parcels_One_Click/FeatureServer/23`, edited 2026-08-24) to confirm which one the zoning
   stamp actually reads. Per A-148: **the district comes from `Zone_Types/25`'s TEXT fields —
   never from the `FrontSetback_`/`SideSetback_`/`RearSetback_` numeric columns**, which are
   unrefreshed; and **the declaration records the text-vs-numeric discrepancy per district**.
   Then measure cellPct and arealPct, disposition every one of the 181 unaccounted parcels
   individually (the reason is data, not a label), and write the declaration.
3. **The gate reads it.** A parcel that is unaccounted in a `DECLARED_COMPLETE` city with a
   named reason moves to the honest state the reason implies (`not-applicable` only where the
   parcel is not land the code zones, else `refused` with the reason); in an
   `EXPLICITLY_HELD` city nothing moves. A test that a declaration with zero unmatched cannot be
   written by a run that matched zero (not vacuous), and a test that the tripwire still fires
   on unaccounted falling without a declaration.
4. **Do not fabricate a proof.** Bastrop's unaccounted count is already 0 and the gate already
   reads `pass` (measured 2026-09-14 by both the real gate code and the stored verdict table), so
   there is no before/after change to demonstrate and this lane performs **no store write**. Paste
   the reads you actually took, state plainly that the "after" is the same read, and record the
   premise correction instead of manufacturing a delta. Do not run the bake; that is the next wave
   once Travis and Williamson carry declarations.

### Falsifiers

- If Bastrop's unaccounted falls to 0 without every one of the 181 carrying a named reason,
  the declaration relabelled.
- If the gate passes a city whose declaration is `EXPLICITLY_HELD`, the gate is wrong.
- If the declaration can be written by hand without the measured counts, it is a constant.
- A-148: if the declaration's zoning-district `field` is any `FrontSetback_`/`SideSetback_`/
  `RearSetback_` numeric column, it is reading stale data as district — the source is the
  `Zone_Types/25` TEXT fields.
- A-148: if the text-vs-numeric discrepancy is not recorded per district, the declaration hides
  the city's own contradiction.

### Out of scope

Travis and Williamson (next wave, same shape). Setback values, and the conflict note's wording
(P-154). The bake.

### Close

`_inbox/<date>_p156-bastrop_close.json`, `planRows` `["P-156", "P-124"]`, with the declaration
file path, the district source named as `Zone_Types/25`'s text fields, the per-district
text-vs-numeric discrepancy record, the 181 dispositions with their counting rule, the two gate
reads you actually took (and the plain statement that they are the same read, not a delta), the
premise correction with its instruments, PRs and merge SHAs with conclusion strings.
`leave_behind` is required.
