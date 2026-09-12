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

AGENT-CONTRACT v1890f0bb — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
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

PLAN-ROW: P-167 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-atom-contract

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


## Mission — P-167 VOCABULARY: one display module, one package, and the copies deleted

You are the deepest worker in OPS-23 wave 1. You do not spawn sub-agents. The dispatch
planner supervises you, reviews your design at CP1 and your first pilot at CP2, and runs the
surface probe itself after your deploy; your own probe run is evidence, not the close.

Exit-bounded verification: every command you run must terminate on its own; wrap anything
that could hang in `timeout`; never leave a watch, a tail or a dev server running.

### Where you work

Four repos, two seats, all registered in `_catalog/seat_register.json`. Create each from
`origin/main` at the moment the planner says that half may start, and declare its start
commit before you write anything:

- `empressaioemail-tech/hauska-atom-contract` (substrate seat), worktree `P:/seat-worktrees/substrate/hauska-atom-contract-p167-vocab`, branch `feat/p167-display-vocabulary`. Starts now.
- `empressaioemail-tech/hauska-map`, worktree `P:/seat-worktrees/property/hauska-map-p167-vocab`, branch `feat/p167-vocab-import`. Starts only after P-153 DRAW has merged in hauska-map.
- `empressaioemail-tech/hauska-engine`, worktree `P:/seat-worktrees/property/hauska-engine-p167-vocab`, branch `feat/p167-vocab-import`. Starts after the package release that carries P-153's token.
- `empressaioemail-tech/legacy-design-tools`, worktree `P:/seat-worktrees/property/legacy-design-tools-p167-vocab`, branch `feat/p167-vocab-import`. Starts only after P-153 DRAW has merged in legacy-design-tools.

`P:/hauska-atom-contract`, `P:/hauska-map`, `P:/hauska-engine`, `P:/legacy-design-tools` are
other people's checkouts; never build there. P-153 edits `buildable-display-vocab.ts` and
`smartsite-mcp/src/vocabulary.ts` and adds one token; P-159 and P-155 also change
hauska-engine and hauska-map in this wave. Rebase before every PR, re-green on the current
base, deploy from `origin/main` after merge.

### The ruling you are implementing

R-6, the vocabulary clause: one vocabulary module, shipped in the atom-contract package,
produces the human face of every atom, so the panel row, the PDF sheet and the connector's
display text are the same information. OPS-16 P-167: the display vocabulary (the MCP's table
plus Property Explorer's `buildable-display-vocab.ts`) becomes one versioned subpath of
`@empressaio/atom-contract`; writer, reader, PE and engine import it; the parity lock is
deleted. Predicate: both repos import the package, the lock files are gone, display strings
identical across surfaces for the probe set.

### What is true today, verified 2026-09-11 at hauska-atom-contract `8dde29c`, hauska-map `6ab6914`, hauska-engine `79fa573`, LDT `3950ce9b`

Record: `_inbox/2026-09-11_ops23_wave1_verify_p167.md`. Re-verify at your start commits.

- `@empressaio/atom-contract` is at 1.31.0 in `package.json` and live on npm (2026-09-11).
  `exports` has 18 subpaths (`.`, `./testing`, `./encumbrances`, `./workspace`,
  `./read-contract`, `./conformance`, `./export`, `./temporal`, `./og`, `./reasoning`,
  `./property`, `./identity`, `./provenance`, `./derivation`, `./absence`, `./lineage`,
  `./selector`, `./access`), each `types` to `./dist/<name>/index.d.ts` and `import` to
  `./dist/<name>/index.js`. Publish is `.github/workflows/publish.yml` on tags `v*.*.*` or
  `workflow_dispatch`, never on push to main; it skips an already-published version. Tests are
  vitest, colocated and under per-subpath `__tests__`. No display or vocabulary module exists
  (`src/render.ts` is render MODE resolution, not display strings).
- Five byte-identical copies of the buildable display vocab, all sha256 `45c277d7…29cac`:
  hauska-map `apps/property-explorer/src/lib/buildable-display-vocab.ts` (303 lines; exports
  `BuildableDisplayKind`, `EnvelopeStatusInput`, `WarmEnvelopeKind`, `BuildableDisplayInput`,
  `BuildableDisplayVocab`, `resolveBuildableAreaSqFt`, `mapBuildableDisplay`,
  `violatesHistoricalDisagreementGuard`; one runtime importer, `src/lib/baked-facets.ts:29`);
  hauska-map `__fixtures__/buildable-display-vocab.peer.fixture` plus
  `__fixtures__/buildable-display-vocab.parity.lock.json`; hauska-engine
  `packages/engine-core/src/site-plan/buildable-display-vocab.ts` (consumed by
  `site-model.ts:24`, re-exported by `site-plan/index.ts:83-90`) plus its lock and the parity
  test `__tests__/buildable-display-vocab.parity.test.ts:43-59`; and a THIRD engine copy,
  `packages/retrieval/src/serving-sweep/vendor/buildable-display-vocab.ts`, imported by
  `vendor/baked-facets.ts:28` and guarded by `vendor-drift.test.ts`, which compares against a
  local `P:/hauska-map` checkout and SKIPS in CI (10-14, 92): a control that never fired.
- hauska-map has NO `@empressaio/atom-contract` dependency in any of its seven `package.json`
  files; root and `packages/map-renderer` carry the retired `@hauska/atom-contract ^1.5.0`.
  Importing the package is a new dependency for Property Explorer. hauska-engine pins
  `^1.22.0` (`engine-core`, `atoms`, `atom-contract-pin`) and `^1.20.0` elsewhere. LDT
  `artifacts/api-server` and four `lib/*` packages pin `^1.30.0`; `artifacts/smartsite-mcp`
  has no atom-contract dependency at all.
- The MCP table is `artifacts/smartsite-mcp/src/vocabulary.ts` (450 lines): the P-91 v3
  `VOCABULARY` (34 entries by count; the line-109 comment still says 19), typed
  `VocabularyEntry { token, displayText, meaning }`, plus `WIRE_DISPOSITION_DISPLAY_TEXT` (six
  keys), `DERIVED_FIGURES_POLICY` (denies `area, coverage_ratio, lot_coverage_pct,
  setback_distance, buildable_area`), `VOCABULARY_RESOURCE_URI = "docs://smartsite/vocabulary-p91v3.json"`,
  `buildVocabularyResourceText`, `registerVocabularyResource`, `STANDING_VOCAB_BLOCK_TEXT`. It
  imports nine display constants from `./mcp-app.js` one way. "p563" is the Cloud Run image
  tag of the P-91 v3 deploy (`_inbox/2026-08-31_p91_p563_deploy.md`), not a code label.
  `tool-honesty.ts` (1,046 lines) imports the table and enforces it: `facetGuidance` 404-405,
  `honestOverlay` 442 (`reasonDisplayText: envelopeHuman(reason) ?? reason`), 512
  (`derivedFigures`), 542 and 562, and throws at 929-940 and 1004-1010 when a code has no row.
  `envelopeHuman` (`mcp-app.ts:448-451`) maps exactly one token, `atom_path_pending`, to
  "Withheld, setbacks unruled"; a SECOND copy of that string sits inside the served panel
  script at `mcp-app.ts:3881`.
- Other copies of display strings, none locked: "buildable % pending" also at hauska-map
  `api/_lib/setback-not-specified.ts:209` (capitalised, in `buildToLineDisclosure`); "Not
  stamped here" at `src/browse/InspectCard.tsx:495`; "setbacks present" at
  `api/_lib/atom-chain-to-facets.ts:1958` and the engine vendor copy; setback display strings
  in hauska-map `setback-not-specified.ts` (`formatSetbackDisplay`, `buildToLineDisclosure`)
  and hauska-engine `site-plan/setback-display.ts` (`formatSetbackSummaryLine`,
  `formatSetbackEdgeLabel`), both carrying "build-to-line governs".
- Adjacent, not yours: engine `serving-sweep/vendor/atom-chain-to-facets.ts` (847 lines
  against the map's 2,038) and `vendor/baked-facets.ts` (524 against 1,155) have drifted under
  the skipping control. Name it in `leave_behind`; do not fix it.

### The change

1. **The package half (now).** A new subpath `./display` in `@empressaio/atom-contract` with
   two modules: `buildable` (the buildable display vocab moved VERBATIM from the identical
   copies, same exports, same strings, with the test file moved beside it) and `wire` (the
   MCP `VOCABULARY`, `WIRE_DISPOSITION_DISPLAY_TEXT`, `DERIVED_FIGURES_POLICY`,
   `VocabularyEntry`, moved verbatim, with the nine constants it imports from `mcp-app.js`
   moved with it so the module has no dependency on the MCP server; the comment count
   corrected to the real entry count by a test that counts). Self-tests: every `VOCABULARY`
   token is unique; every `BuildableDisplayKind` has a `pdfLabel`; a snapshot test of the
   full string table so any edit is a visible diff. Bump minor, tag `v1.32.0`, publish through
   the tag workflow, confirm on `npm view @empressaio/atom-contract@1.32.0 exports` that
   `./display` resolves. The publish credential already works at 1.31.0; if the workflow
   fails on auth, that is a finding, not a reason to publish from a laptop.
2. **Fold P-153's token (after P-153 merges).** P-153 adds one token and one display text to
   both the map vocab and the MCP table. When it has merged in both repos, cut the package
   worktree again from `origin/main`, add that token to `./display` exactly as P-153 wrote it
   (diff the merged files against the package modules; the diff must be exactly the token
   and nothing else, or you stop and report), tag `v1.33.0`, publish, confirm. Consumers
   import 1.33.0, never 1.32.0.
3. **Consumers import, copies die (after step 2).** hauska-map: add `@empressaio/atom-contract`
   to `apps/property-explorer/package.json` at `^1.33.0`; `baked-facets.ts` imports from
   `@empressaio/atom-contract/display`; delete `buildable-display-vocab.ts`, its test, the
   peer fixture, the parity lock and the parity test. hauska-engine: `site-model.ts` and
   `site-plan/index.ts` import from the package; delete `site-plan/buildable-display-vocab.ts`,
   its lock and parity test; delete `serving-sweep/vendor/buildable-display-vocab.ts` and
   repoint `vendor/baked-facets.ts`; bump the engine's pins that touch these packages to
   `^1.33.0`. legacy-design-tools: add the dependency to `artifacts/smartsite-mcp`;
   `vocabulary.ts` becomes a thin re-export of `@empressaio/atom-contract/display` plus the
   resource registration that stays MCP-specific; `tool-honesty.ts` and `mcp-app.ts` import
   the package; `envelopeHuman` reads the table rather than its own literal; the served panel
   script's inline copy at `mcp-app.ts:3881` is generated from the same table at build time or
   templated from it at serve time, so there is one source. `artifacts/api-server` bumps to
   `^1.33.0` if it consumes any of it.
4. **Retirement is proven by decline.** After each consumer merges: `git ls-files` on
   `origin/main` shows no `buildable-display-vocab.ts` outside `node_modules` and no
   `*.parity.lock.json` in either repo; `git grep -n "Withheld, setbacks unruled"` in LDT
   returns only the package import site or a generated artifact, not a literal; a CI test in
   each consumer fails if a file named `buildable-display-vocab` reappears. The vendor-drift
   test in the engine is deleted with the copy it guarded, and its skip-in-CI shape is named
   in `leave_behind` as the control class that never fired.
5. **Out of scope, named so it is not assumed.** The setback display strings
   (`setback-not-specified.ts`, `setback-display.ts`) and the "Not stamped here" literal are
   not moved in this lane; list them in `leave_behind` with their paths as the next
   vocabulary card. Do not change any display string's wording; the row moves strings, it
   does not edit them.

### Verification, and the falsifier you pre-register

Write down at CP1 before any code: *if after the consumer deploys any display string for any
probe-set parcel differs between the Property Explorer Buildable row, the `get_smart_site`
`reasonDisplayText` or disposition text, and the feasibility PDF label, the row is not done;
and if either parity lock or the vendor copy still exists on `origin/main`, the retirement is
fake.* Also: *if the 1.33.0 diff against the merged P-153 files is anything but the one
token, stop.*

Deploy: Property Explorer through the Vercel CLI with the live bundle confirmed to carry no
local vocab module; smartsite-mcp through its workflow with the serving revision read by
field name and `/health/dependencies` still `hauska_mcp: ok`; engine-api from `origin/main`
in the order the planner sets against P-155 and P-159; the retrieval service by hand per
`services/retrieval-api/DEPLOY.md` only if the serving-sweep vendor change reaches it, and
only after P-152 READER has merged its retrieval-api work, from `origin/main`.

Then the strings, for every probe-set parcel (`48021:34049`, `48021:33223`, `48453:113408`,
`48453:474034`, `48453:367134`): paste a table of panel Buildable row text, MCP
`reasonDisplayText` and disposition text (the operator runs `get_smart_site` and pastes it),
and the PDF buildable label where a PDF exists, side by side. The planner runs
`node scripts/surface-probe.mjs --rows P-167 --observations <file>`; the P-167 predicate reads
per parcel `displayStringsIdentical` (true only if every string that appears on two or more
surfaces is identical across them) with `displayStrings: { panel, mcp, pdf }` as the evidence,
and under `_vocab`: `parityLockDeleted` (true only after both locks and the vendor copy are
gone on `origin/main`), `packageVersion` (the version every consumer imports), and
`importers` (the repos that import it). Each entry carries `observedBy` and `observedAt`.

### Close

`_inbox/<date>_p167-vocab_close.json` per AGENT_CONTRACT §6 plus the OPS-23 four fields.
`leave_behind` must carry: the two package versions with their tags and publish run ids; the
per-repo dependency versions after the bumps; the strings you found copied but did not move
(with paths); the engine vendor drift finding; and any consumer that still carries a literal
you could not remove, with the reason.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-11_p167-vocab_cp1.json
  CP2: _inbox/2026-09-11_p167-vocab_cp2.json
  CLOSE: _inbox/2026-09-11_p167-vocab_close.json
