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

PLAN-ROW: P-152 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-map

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


## Mission — P-152 lane 3, P152-RAILS: the last panel rails and the feasibility report read the one reader

You are the deepest worker in OPS-23 wave 3. You do not spawn sub-agents. The dispatch
planner supervises you, reviews your design at CP1 and your first pilot at CP2, and runs the
surface probe itself after your deploys; your own probe runs are evidence, not the close.

Exit-bounded verification: every command you run must terminate on its own; wrap anything
that could hang in `timeout`; never leave a watch, a tail or a dev server running.

### Where you work

Two repos, property seat, registered in `_catalog/seat_register.json`; create each from
`origin/main` and declare the start commit before you write anything:

- `empressaioemail-tech/hauska-map`, worktree `P:/seat-worktrees/property/hauska-map-p152-rails`, branch `feat/p152-setbacks-zoning-from-reader`. The panel half.
- `empressaioemail-tech/hauska-engine`, worktree `P:/seat-worktrees/property/hauska-engine-p152-reports`, branch `feat/p152-report-composer-reads-reader`. The report half.

Other people's checkouts are never built in. P-167's consumer half shares hauska-map with
you and P-154, P-158, P-173 and P-167 share hauska-engine; `hauska-engine-api` deploys are
from `origin/main` after merge, one at a time, under the planner's lease. You do not touch
legacy-design-tools or the factory.

### What lane 2 left, and what this lane makes true

Lane 2 (`_inbox/2026-09-12_p152-panel_close.json`) made the panel read the reader for
fourteen rails (`COMPOSED_RECORD_RAIL_KEYS` in `apps/property-explorer/api/_lib/pe-record-to-facets.ts:89-104`)
and left three things on other paths by its own module doc (lines 8-16): zoning and the
envelope (setbacks) stay on the retrieval atom chain, and cadRoll's four dollar rails and the
owner fact stay on cortex. This lane finishes the panel and makes the feasibility report the
third consumer of the reader. Done looks like the card's P-152 row: panel, MCP and PDF
identical on value, source and vintage for every probe parcel; disagreement count zero.

### What is true today, verified 2026-09-12 (`_inbox/2026-09-12_ops23_wave3_verify_p152_lane3.md`; hauska-map `4350ab9`, engine `99f9146`, factory `7a94ae5`, LDT `78ad8a51`)

The panel (hauska-map):

- `pe-property-atoms.ts:350` fetches `/property-nodes/:id/atom-chain`; line 681 "atom-chain is
  the envelope product path"; line 706 "never zoning/envelope, those stay atom-owned";
  `atom-chain-to-facets.ts:1808` `zoningFact`, `1813` `setbackRule`; line 1661 "zoning +
  envelope stay ATOM-OWNED". `applyRecordPatch` (486-519) never touches `facets.zoning` or
  `facets.envelope`. The panel prints 25/5/25/15 for `48021:34049` from the layer-23 atom while
  the reader's cells and the MCP print 30/10/30/20 (F3).
- The reader's rail registry (`services/retrieval-api/src/parcel-record-rail-registry.ts:56-75`,
  pinned to factory `217b7dd`, unchanged at `7a94ae5`) carries `zoningDistrict`,
  `zoningJurisdictionKey`, `zoningProvenance`, `envelopeStatus`, `setbackFrontFt`,
  `setbackSideFt`, `setbackRearFt`, `setbackCornerFt`, `parcelAreaSqFt`, `buildableAreaSqFt`,
  `buildableAreaPct`, `maxLotCoveragePct`, `maxHeightFt`, `maxFootprintSqFt`, `citationUrl`,
  `envelopeDisclosure`, `edgeSignal`, `maxImperviousCoverPct`, `treeProtection`, and the
  companion `setbackRules`. The slate for 48021 (`parcel-record-slate.json` lines 8-30, 21
  entries) includes `zoningDistrict`, `setbackFrontFt`, `setbackRules`, `parcelAreaSqFt`,
  `maxHeightFt`, `maxLotCoveragePct`, `maxFootprintSqFt`, `marketValue`, `assessedValue`,
  `landValue`, `improvementValue`; it does NOT include `setbackSideFt`, `setbackRearFt`,
  `setbackCornerFt`, `envelopeStatus`, `buildableAreaSqFt`, `buildableAreaPct`,
  `envelopeDisclosure`, `citationUrl`. Unslated rails serve `legacy-transitional`
  (`parcel-record-reader.ts:92-110`). For 48453, `marketValue` and `assessedValue` are slated
  (lines 12-13) and the panel still takes them from cortex.
- **A reader outage degrades silently.** `fetchParcelRecordOnce` (464-466) returns `ok:
  false` on any non-2xx and `applyRecordPatch` returns the payload untouched: the response is
  HTTP 200 with `readPath` `atom-chain` or `atom-chain-warm` (731-735). That is the silent
  fallback this program hunts (R-6: never fall to legacy).

The report (hauska-engine):

- `services/engine-api/src/routes/parcel-terrain.ts` refresh (754) runs `runFeasibilityJob`
  (683); facts enter at 713-715 as `LIVE_PARCEL_REPORT_FACT_RESOLVERS` (four live reads: FEMA
  NFHL, SSURGO soil, HIFLD electric, gas declared absent) plus `storage`, the engine's own
  substrate Postgres (`storageFromEnv` 284-291, `SUBSTRATE_DATABASE_URL`). No call to the
  reader, no call to cortex node-facets, anywhere on the report path (searched).
- `packages/engine-core/src/site-plan/report-model.ts composeParcelReportFacts` (428): line 434
  `atoms = storage.listPropertyAtomsByParcelNodeId(parcelNodeId)`; values, year built and
  living area from a `cad-parcel-roll` atom (442, 456-461); owner from `owner-fact` (443,
  462-463); special districts from every non-absence `special-district-fact` atom (501-503,
  524; the writer is TCEQ membership by `ST_Intersects`, one atom per district, no
  one-district picker); flood from `flood-hazard-fact` (476). When neither roll nor owner atom
  exists the section is `absent("blocked-at-source", "The county appraisal roll carries no
  record for this parcel.")` (445-449): that is why FS-48453-474034 prints values UNAVAILABLE
  beside the card's dollars; the substrate store has no roll atom for that parcel.
- City limits and ETJ are CONSTANTS: `report-model.ts:791-796` sets `cityLimitsStatus:
  "unresolved", etjStatus: "unresolved"` for every parcel, and `pdf/feasibility.ts:194-197`
  prints the literal "No city-limits or ETJ boundary source is wired for this county yet" on
  every PDF in every county, while the record's `cityLimits` rail is `record` for all five
  probe parcels and the card prints it.
- School district: NOT FOUND on the report path. Water who-serves: named only in a `residual`
  string (`who-serves-electric-only.ts`). The PDF therefore lacks rows the card has.
- Entitlement never reaches the engine. The PE BFF (`pe-feasibility-export-handler.ts:86-118
  requireStudioSession`) gates in the BFF, then calls the engine with a shared service Bearer
  and STATIC gate-front headers (`pe-feasibility-export-core.ts:53-75`: `x-hauska-tenant-id:
  public-catalog`, `x-hauska-access-tier: public-paid`, credential `property-explorer-feasibility-bff`);
  smartsite-mcp (`feasibility-export.ts:325-328`, `engine-client.ts:56-69`) sends the same
  static values and checks no entitlement. The engine (`server.ts:43-67`) checks only the
  Bearer and header presence; `x-hauska-subject-id` is optional (`gate-front-context.ts:68,97`)
  and never sent.

### The change

**Panel half (hauska-map).**

1. **Setbacks and zoning from the reader.** `pe-record-to-facets.ts` composes `zoning` and
   `envelope.setbacks` from the reader's `zoningDistrict`, `zoningJurisdictionKey`,
   `zoningProvenance`, `setbackFrontFt`, `setbackSideFt`, `setbackRearFt`, `setbackCornerFt`,
   `setbackRules` (companion; the effective date lives there), `envelopeDisclosure` and
   `citationUrl`, for every rail whose `serve` is `record`. For 48021 today that is the
   district, the front setback and the rule companion; the side, rear and corner rails are
   unslated and serve `legacy-transitional`. Do not invent slate entries: where a rail is
   `legacy-transitional`, keep the atom-chain value for that rail only, labelled, and count it
   in the close; the slate change that makes the side, rear and corner rails `record` is the
   factory's (name it in `leave_behind` for the overseer to row, with the counts). R-2 stays:
   the polygon draws from the same `place/buildable-envelope` call as P-153 wired; the figure
   stays refused until an envelope atom backs it; `buildableAreaSqFt` never composes from a
   cell into the panel.
2. **The dollar rails and the owner move too, gated in the BFF.** `marketValue`,
   `assessedValue`, `landValue`, `improvementValue` and the owner fact compose from the reader
   where slated (48453 slates market and assessed), and the BFF applies exactly the gate it
   already evaluates (`requireStudioSession` and `fetchPeEntitlementDetail` in the export
   handler; reuse that decision for the facets handler) so an anonymous read gets the typed
   `studio-gated` refusal and a Studio read gets the values. The gate's rule does not change;
   its decision moves to the place that now holds the value. Lane 2's cortex copy for these
   rails is deleted in this branch once the reader path serves them.
3. **A reader outage is declared, never a fall to the atom chain.** When `/record` answers
   anything but 2xx, every rail that would have been `record` is returned as a refusal
   carrying the reader's `errorClass` and HTTP status, `readPath` is `record-unavailable`, and
   the response says so; the atom chain is consulted only for the rails it still owns after
   step 1. A test proves a simulated 503 yields refusals, not atom-chain values.

**Report half (hauska-engine).**

4. **The report composer reads the reader.** `composeParcelReportFacts` gains a reader client
   (the retrieval service's `/property-nodes/:id/record`, Bearer `RETRIEVAL_API_KEY`, the same
   client the panel and cortex use) and composes, from `record` rails: city limits and ETJ
   (`cityLimits`, replacing the constant and the literal sentence), the four dollar values,
   year built and living area, school district, utility and who-serves, special districts,
   and the setback and zoning rails with their companion date. The substrate atoms remain the
   source only for rails the reader serves as `legacy-transitional` or does not carry (flood
   hazard stays on the parcel-scoped study; the four live layers stay live), each labelled
   with `serve` on the fact so the PDF's provenance table says which. The literal "no
   city-limits source is wired" sentence is deleted; where the rail is refused or transitional
   the PDF prints the cell state and names the source that is missing.
5. **Entitlement travels, the rule unchanged.** The BFF and smartsite-mcp send the requester's
   entitlement decision to the engine on the refresh call (a signed claim or the subject id
   plus tier in the existing `x-hauska-subject-id` and `x-hauska-access-tier` headers, which
   the engine already parses), replacing the static `public-paid`; the engine composes gated
   rails only when the claim says so and prints the typed refusal otherwise. The rule is the
   one the BFF already applies; nothing about who is entitled changes. If the engine gate
   requires a new secret to verify a signed claim, STOP and report the exact mount command.
6. **The vacancy guard sees both inputs.** With the roll values composed from the reader,
   `footprintContradictsAppraisal` reaches the narrative payload as well as the facts page
   (P-159's mission item 3 asked for this and the guard was starved by a null roll; the PDF
   for `48453:474034` called an improved parcel unimproved on 2026-09-12). A test plants a
   roll with an improvement value and an absent footprint and proves the narrative payload
   carries the contradiction wording.
7. **Two special-district stores are one list.** The PDF's special districts come from the
   reader's `specialDistricts` rail (the record) when `record`; the engine's TCEQ atoms are
   listed beside it only where the record is transitional, labelled; a disagreement between
   the two for a probe parcel is reported in the close with both values (F17: Lake Pointe MUD
   on the record, West Travis County MUD 3 in the substrate atoms for `48453:474034`), not
   resolved here; P-165's parcel-in-district edges will carry every district.

### What this lane does not do

Change the entitlement rule or any pricing surface (it moves the decision, not the rule);
edit the slate (report the rails it needs); mint atoms; touch the setback resolver (P-154);
retune anything in P-153's draw path.

### Verification, and the falsifier you pre-register

Write down at CP1 before any code: *if after both deploys the panel facets and
`get_smart_site` disagree on setbacks, zoning, values, city limits or special district for any
probe parcel where the reader serves `record`, or the feasibility PDF for `48453:474034` still
prints values UNAVAILABLE beside the card's dollars or still prints the city-limits constant,
or an anonymous read shows a studio-gated value, or a simulated reader 503 yields an
atom-chain value with HTTP 200, the change is wrong.* Non-vacuity: the pre/post captures for
all five probe parcels, signed in and anonymous, diffed; the PDF for `48453:474034` regenerated
and its sheets 1, 9 and 12 extracted with `pdftotext`, pasted.

Deploy Property Explorer through the Vercel CLI (live bundle confirmed; `X-Pe-Read-Path:
record` on every probe parcel); engine-api from `origin/main` after merge under the planner's
lease, revision read by field. The planner runs `node scripts/surface-probe.mjs --rows P-152
--observations <file>` with the operator's `get_smart_site` setbacks per parcel as
`mcpSetbacks`; the P-152 predicate requires `readPath` `record` and panel equal to MCP for all
five parcels. For the report half, the planner records `pdfValuesPresent`, `pdfCityLimits`
and `pdfSpecialDistricts` for `48453:474034` from the regenerated PDF as observations under
P-152 (the overseer folds them into the card).

### Close

`_inbox/<date>_p152-rails_close.json` per AGENT_CONTRACT §6 plus the OPS-23 four fields.
`leave_behind`: the per-parcel `serve` counts after this lane (the rails still transitional
are the slate request); the entitlement transport chosen and what the engine verifies; the
special-district disagreements found; the substrate atoms the report still reads and why.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-12_p152-rails_cp1.json
  CP2: _inbox/2026-09-12_p152-rails_cp2.json
  CLOSE: _inbox/2026-09-12_p152-rails_close.json
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
    "lane": "p152-rails",
    "planRows": ["P-152"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
