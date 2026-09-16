CANON-PREAMBLE v9e22f2c4
- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HOLD LIFTED 2026-08-26 for the Factory program (`_decisions/2026-08-26_factory_program_and_hold_lifts.md`); the Bastrop QA condition is cosmetic and does not gate the data path. NO PRIVILEGED DATA and the Hauska spine rule stand.
- THE FACTORY IS THE ONLY WRITER PATH (OPS-19) — one machine built to the MODEL LAW (`19_the_instrument_contract.md`, `_blueprint/10_model.md`, `_blueprint/20_pipeline.md`, `_blueprint/40_rule_register.md`, `51_ingestion_pipeline_reference.md`, `24_instrument_conformance_program.md`; package `dist/*.d.ts` is the tiebreaker); own repo `hauska-factory`, own Neon store; every publish lands on staging before the identical job runs on production; nothing reaches a serving store except through publish; laptop ingest is FROZEN (`_decisions/2026-08-26_ingest_freeze_and_cloud_loader.md`); OPTION A ruled (`_decisions/2026-08-26_factory_model_law_and_option_a.md`): no new county is written on the old shape and old-shape writes ended permanently 2026-08-27. Every lane has its own registered worktree; never build in another lane's checkout. Row-level status lives in `_catalog/program_preambles/OPS-19.md` and `_state/property/STATE.md`, never here.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- MOST-CURRENT SOURCE WINS (operator 2026-09-11) — for setbacks and every dimensional rule, in every city and county, the source with the most recent effective date supplies the value; tier breaks ties only on equal or unreadable dates; dates are read at source (ordinance effective date, ArcGIS `editingInfo.lastEditDate`), never assumed from source kind; an unreadable date produces a conflict row with both values, never a silent pick. Supersedes tier-first ranking in LDT `authoritativeSetbackSource.ts` and layer-23-first in hauska-map. `_decisions/2026-09-11_setback_source_most_current_wins.md`.
- ENVELOPE DRAWN, FIGURE REFUSED (operator 2026-09-11) — Ruling B reversed for the polygon only: map and MCP draw block draw the modelled buildable envelope from the same `place/buildable-envelope` call with its disclosure wherever a district and setback table exist; buildable area and percent stay refused until an envelope atom backs them. Entitlement gate unchanged. `_decisions/2026-09-11_ruling_b_reversed_polygon_only.md`.
- THE LEDGER IS THE SERVING PATH, ATOMS ARE CANONICAL (operator 2026-09-11) — node = identity, atom = one claim from one authority at one time, edge = an atom whose value is a node; a cell is accounting (state, atom reference, provenance, cached rendering keyed to atom version and vocabulary version), never a copied value; one reader in `hauska-engine/services/retrieval-api` walks gated cells and dereferences atoms and every surface and the Hauska MCP catalog consume it; unslated rails refuse, never fall to legacy; one writer mints atom + pointer + rendering in one transaction; one vocabulary module in the atom-contract package. Never add a read path, a vocabulary copy, or a value-holding cell. `_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md`, ADR-031 amendment 2026-09-11, OPS-23 §0.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

AGENT-CONTRACT v79be86e2 — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
interruption recovery, slot law + lease, heavy-scan serialization, verification rules, close schema).
Read it before any work; where this dispatch and the contract disagree, STOP and report.

DEV-PROCESS vbb19bd34 — you are bound by 90_runbooks/DEV_PROCESS.md in full. It governs how work
is SHAPED and how a result is JUDGED: coverage figures travel with their denominator, classes are
measured never subtracted, an instrument's exclusion set is part of its contract, gating indicators are
proven able to fire, paired controls need a divergence test, guardrails that do not survive a clone are
not guardrails. Every rule in it is traced to an incident. Read it before any work.

FLEET-MEMORY v2a98086b — you are bound by 90_runbooks/fleet_memory_practice.md (M0).
The verbatim install block follows. Product-repo agents do not carry .cursor/rules; this is the install.

FLEET MEMORY (M0): As you work, capture build knowledge in a scratch block you return in your close, using four entry kinds — LESSON (a hard-won fact worth a test/note), DEAD-END (a tried-and-failed path + reason, so it is not retried), GROUND-TRUTH (a live-verified state WITH its timestamp), OPEN (a live thread the next context must pick up). Read any scratch context passed to you FIRST before re-deriving. Do NOT promote anything to durable memory yourself — return lessons in your close; the planner gates promotion. Nearing your limit, flush open threads + live ground-truths into your close so the next instance starts warm.

PLAN-ROW: P-156, P-124 (90_operations/OPS-16_texas_market_plan_of_record.md)

# PROGRAM CONTEXT — OPS-23 surface completion

You are working a lane of OPS-23. Everything below is program law for this lane. If it
conflicts with the general canon preamble, this section is narrower and wins on scope; if it
conflicts with the AGENT CONTRACT or ENFORCEMENT, those win. The plan is
`90_operations/OPS-23_surface_completion_program.md`; read sections 2, 3 and 7 before any work.

## The one goal

The Property Explorer panel, the map, the exported PDFs, and the Smart Site MCP connector show
the same facts for the same parcel, from one reader, with honest absences that name the city or
source that is missing. Six Central Texas counties first. **The customer surface is the
predicate.** A merged PR, a cortex read, a ledger count, or an MCP read alone does not close a
lane in this program.

## The five rulings (operator, 2026-09-11) — do not relitigate

- **R-1 MOST-CURRENT SOURCE WINS.** For setbacks and every dimensional rule, everywhere: the
  source with the most recent effective date supplies the value; tier breaks ties only when dates
  are equal or unreadable; dates are read from the source (ordinance effective date, ArcGIS
  `editingInfo.lastEditDate`), never assumed from source kind; unreadable dates produce a conflict
  row with both values, never a silent pick. `_decisions/2026-09-11_setback_source_most_current_wins.md`.
- **R-2 ENVELOPE DRAWN, FIGURE REFUSED.** The map and the MCP draw block draw the modelled
  buildable envelope from the same call with its disclosure wherever a district and a setback
  table exist. The buildable area number and percent stay refused until an envelope atom backs
  them. `_decisions/2026-09-11_ruling_b_reversed_polygon_only.md`.
- **R-3 THE CITY IS THE UNIT.** Zoning and setback work is scoped per city with a per-city
  predicate. Until a city is done, every absence string names the city.
- **R-4 THE SURFACE PROBE IS THE PREDICATE.** Your close cites a `surface-probe` artifact run
  after your deploy (or, until `scripts/surface-probe.mjs` lands, the raw output of the hand
  probes in OPS-23 §2 pasted verbatim) showing your change on the surface you claim to have
  changed.
- **R-5 THREE ROLES.** You are a lane. You do not commit to doc_repo; you hand artifacts back.
  You may fan one level per AGENT_CONTRACT §1 and verification stays with you.
- **R-6 THE LEDGER IS THE SERVING PATH AND ATOMS ARE CANONICAL.** A node is identity; an atom
  is one claim from one authority at one time; an edge is an atom whose value is a node. A cell
  is accounting: state, atom reference, provenance, and a cached rendering keyed to atom
  version and vocabulary version; a cell never holds a value as canon. One reader in
  `hauska-engine/services/retrieval-api` walks gated cells and dereferences atoms; every
  surface and the Hauska MCP catalog consume it; unslated rails refuse, never fall to legacy.
  One writer mints atom, pointer and rendering in one transaction. One vocabulary module in
  the atom-contract package. Never add a seventh read path, a second vocabulary, or a cell
  that copies a value. `_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md`, OPS-23 §0.

## The probe set — every lane measures on these, and may add one, never remove one

`48021:34049` (1109 Pecan St, Bastrop, corner lot, improved 1906) · `48021:33223` (P-91 gold) ·
`48453:113408` (414 Spiller Ln, West Lake Hills, split situs) · `48453:474034` (2601 Sterling
Panorama Ct, unincorporated, Lake Pointe MUD) · `48453:367134` (5833 Taylor Draper Cv, Austin
SF-2). Calls: `GET https://smartsite.cloud/api/spine/property-atoms/<id>/facets`;
`POST https://smartsite.cloud/api/spine/cortex/api/brokerage/v1/place/buildable-envelope`
by address and by `{lat,lng}`; `POST .../brokerage/v1/map-data/gis-layer {"layer":"parcels","bbox":{west,south,east,north}}`.

## Facts a lane must carry (verified 2026-09-11; re-verify at source before relying)

- The panel reads facets through hauska-map's own adapter (`api/_lib/pe-property-atoms.ts`,
  `atom-chain-to-facets.ts`), `readPath: atom-chain`, not through cortex node-facets. The
  record-served setback cutover lives in LDT `nodeFacetTier1Assemble.ts` /
  `setbacksFactServeCutover.ts` and reaches `get_smart_site`, not the panel.
- The map draws an envelope only through `ExplorerMap.handleEnvelope`, fed by `InspectCard`
  from the sealed sheet (`fact-sheet-resolver.ts`); the card issues no lookup of its own
  (invariant I2). `sheetEnvelopeIsAtomPathPending` (`fact-sheet-resolver.ts:216-241`) is Ruling
  B's mechanism. `handleEnvelope` also gates drawing on `isEntitled` (Pro, unlocked, dev role);
  that gate is not yours to change.
- `resolveGeometry` (`fact-sheet-resolver.ts:2520-2660`) already accepts `hint.centroid`;
  `ExplorerMap.adoptSubject` passes only `{ geometry }`. The live parcel layer
  (`map-data/gis-layer`) returns the ring for a bbox around `cityLimitsFact.queryPoint`.
- cortex geocoding cannot find "414 SPILLER LN" with or without ", WEST LAKE HILLS, TX"
  (422 `geocode_miss` both ways). Placement must not depend on it.
- The feasibility engine (`hauska-engine-api-00198-cir`) completes Travis refreshes in 85 to
  154 s with 201; PE and smartsite-mcp abort at 55 s; the download endpoint serves the finished
  PDF in 0.2 s afterwards.
- Cell-state vocabulary is OPS-21's (`_catalog/program_preambles/OPS-21.md`). Six states. Use no other.

## What a lane in this program must not do

- Do not mint or backfill envelope atoms; that program resumes when P-152 closes.
- Do not change the entitlement gate or any pricing surface.
- Do not fix a naming mismatch by renaming; report it.
- Do not widen a check to admit a value it does not satisfy; report it.
- Do not read a working tree to verify a deploy; read the serving revision by field name and probe the surface.
- Do not write to a repository your seat does not own; request it from the owning seat via the close.

## Close requirements, in addition to AGENT_CONTRACT §6

- `probe:` the artifact path or the pasted raw output, per R-4.
- `falsifier:` the result you pre-registered that would have proved your change wrong, and what you observed.
- `contradicted:` what in the dispatch or the plan was wrong when you got there. "Nothing" is acceptable and must be said.
- `leave_behind:` per ENFORCEMENT.md.


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

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-14_p156-bastrop_cp1.json
  CP2: _inbox/2026-09-14_p156-bastrop_cp2.json
  CLOSE: _inbox/2026-09-14_p156-bastrop_close.json
  These paths are relative to the doc_repo worktree the session RUNNING YOU is rooted in: for a
  lane spawned by the dispatch planner that is the planner's worktree; for the dispatch planner
  itself it is its own seat worktree (never P:/doc_repo, the integration seat's checkout). This
  dispatch was compiled in P:/seat-worktrees/dispatch-planner/doc_repo. Two lanes in each of waves 1 and 2 wrote
  into the property seat's worktree instead and their artifacts had to be found by hand.
  No notification arrives when a background command finishes: poll with a bounded loop and a
  timeout; a lane that ends its turn waiting for a wake-up stalls (two lanes did, wave 2).

CLOSE SKELETON (the fields the enforcement gate reads; spell them exactly, or the gate refuses
the commit rather than guessing what you meant):
  {
    "lane": "p156-bastrop",
    "planRows": ["P-156", "P-124"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
