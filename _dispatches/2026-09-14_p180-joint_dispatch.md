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

AGENT-CONTRACT v9029908c — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
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

PLAN-ROW: P-180, P-183 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-factory

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


## Mission — the walk's S13 admits a non-string as a provenance token, so an earned retirement is graded as if it had served a bad provenance; fix that, then republish 48209 in ONE joint run and come back for the go

You are the deepest worker in OPS-23 wave 6, succeeding the `p178-publish` lane whose close is
`_inbox/2026-09-14_p178-publish_close.json` (status `blocked`, on this exact ruling). You do not
spawn sub-agents. The dispatch planner supervises you and reviews CP1 and CP2.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail, a dev server, or an unwaited Cloud Run job
behind. If you find a publish already in flight, do NOT start a second one — see step 3.

### The ruling you execute (operator, 2026-09-14 — S13 option (a))

The P-180 retirement pass (`A-146` option B) did what it was asked: the 16 excluded hollow nodes no
longer trip `BP-PUBLISH-RUN-01`, and the counts are exactly right. The walk is nonetheless RED, all
16 graded `S13`, and the mechanism is a false positive in the walk itself — the planner verified
both halves at source:

- `src/stages/grade/s-rules.mjs:698-705` — `servedProvenanceTokens` maps the three provenance keys
  and filters `.filter((t) => t != null && t !== false)`. A **non-string object survives that
  filter** and is handed to the provenance allowlist as though it were a token. An earned
  retirement is facts-free, so what it serves is a mirrored *refusal* object
  (`verdict: "refused"`, `authority: "unresolved"`, `serveLayer: "zoning"`), and the allowlist
  rejects it.
- `src/stages/grade/v-rules.mjs:74-76` — `isNonPassGrade` returns
  `grade === "FAIL" || grade === "KNOWN_OPEN"`, so `UNMEASURED` is NOT a non-pass grade.

So the chain is: admit only strings -> the refusal object yields **no** token -> `S13` lands on
`UNMEASURED` -> acceptable -> the 16 grade `RETIRED` and the walk goes green. **The operator ruled
option (a): make `servedProvenanceTokens` admit only string tokens.** An object can never be a
valid provenance token, and declining to grade provenance on a row that by construction has none is
correct rather than evasive — but see the falsifiers, because a filter that admits less is exactly
the shape of change that can silence a real signal.

### Where you work

One `hauska-factory` worktree, new branch off `origin/main`. The walk (`src/jobs/verify-walk.mjs`,
`src/stages/grade/s-rules.mjs`, `src/stages/grade/v-rules.mjs`) AND the publish pin
(`cloudbuild.publish.yaml _LDT_SHA`) both live in this one repo, so you need only the one checkout.
Declare your start commit. `_LDT_SHA` is already `bae48d406f7595af3d47111b558d0ebc3efd9c56` (P-183,
#148) on `origin/main` — confirm that, and do not move it.

Worth reading before you start: the worktree `hauska-factory-ctx-walkrule` on branch
`fix/ctx-walkrule-retired-grading`, which by its name has been near this grading before. If it
already carries a partial version of this change, say so and reconcile rather than re-deriving.

### What is true today (re-verify at your start; `_inbox/2026-09-14_p178-publish_cp2.json` and `..._close.json`)

- The staging publish `b0864dde` **baked successfully** (`publish_runs.status = succeeded`, walk id
  `c636b630`) and then **failed its walk**: `runs.refuse_code = WALK_FAILED`, 86 graded, 70 pass,
  16 fail, all `S13`. `BP-PUBLISH-RUN-01` occurs **0** times.
- The 16 are `48209:38774` and `48209:84629` through `84648` (gaps included: 84629, 84630, 84631,
  84635, 84636, 84637, 84639, 84641-84648). Every one has **zero** `txgio_parcel` rows for 48209 —
  they are exactly P-180's excluded population.
- Counts on staging: `173,050` current-run rows, `0` stale, `116,421` fact + `56,629` retirement =
  `173,050` exactly; `0 of 56,629` excluded nodes carry any fact-shaped key.
- The image that ran was built from LDT `84f4e7c9` (#686, P-180 only). **No image has ever been
  built from `bae48d40`**, so #148's P-183 own-row geometry fix is unexercised on staging — that is
  what this lane's joint run fixes.
- A second party ran the whole step-2/step-3 sequence against the shared project on 2026-09-14
  between 13:30Z and 13:43Z, including a staging reset that destroyed the prior mixed state. The
  predecessor correctly refused to double-run. Treat the staging store and the Cloud Run job as
  shared resources with no lease: take the job lease explicitly before you reset.

### What you build, in order

1. **The fix.** In `servedProvenanceTokens`, admit only string tokens (the function already filters
   `null`/`false`, so extend that filter rather than restructuring it). Add a test that fails when a
   non-string is passed through as a token, AND a companion test that a genuine off-allowlist
   **string** still fails `S13` — the change must reduce false positives, not silences. Merge on the
   conclusion string, and quote the conclusion strings, not `gh pr checks` printing "pass".
2. **The joint build, and PROVE it is joint.** Build the image from the current pin and read the
   **deployed digest** back — do not infer the pin from `origin/main`, which is precisely the error
   the predecessor's close records as *"a pin-merge is not a pin-deploy"*. Resolve which LDT SHA the
   digest you are about to run actually carries, and state both (factory merge sha and LDT sha)
   before the run. If the digest does not carry `bae48d40`, stop and report — the run would be
   P-180-only and would not exercise P-183.
3. **Staging publish, 48209, gold 97658.** Reset staging, take the job lease, publish, read the run
   row and the walk verdict, and paste the stamp counts. **If an identical publish is already in
   flight, do not start a second one** — wait it out with a bounded terminating poll and read its
   result, and say so.
4. **Both predicates, not just one.** (a) The walk's **overall verdict is `pass`** — see falsifiers.
   (b) P-183's own predicate, which is independent of the walk: the five Sturgeon nodes' served
   record points, read through the point-keyed leg. The predecessor established that a red walk does
   not prevent this measurement, so measure it either way.
5. **Return to the planner for the go.** Step 4 of the predecessor's mission (the PRODUCTION
   publish) is a serving-store write and is **NOT** in your scope. Stop at CP2 with the staging
   verdict and counts, and let the planner request the gate.

### Falsifiers, pre-registered

- **If the walk's overall verdict is not `pass` after step 3, this lane has not succeeded**,
  regardless of whether the individual counts are right. This is the falsifier the predecessor's set
  was missing: on 2026-09-14 every pre-registered check cleared while the walk was still red,
  because the set tested the stamp and not the walk's other grade families. Do not close a
  partial-green walk as green.
- **If a parcel that serves a genuinely off-allowlist *string* provenance no longer fails `S13`,
  you have silenced a real signal** and the fix is wrong. Demonstrate both directions.
- If any of the 16 no longer grades `RETIRED`, say which and why.
- If the current-run row count differs from `173,050`, or any excluded node serves facts, or
  `BP-PUBLISH-RUN-01` fires on any node, the retirement pass regressed — name the population.
- If the digest you ran does not carry `bae48d40`, the run is not joint; say so rather than
  attributing a green walk to P-183.

### Out of scope

The PRODUCTION publish (the planner requests the operator's go). The record store and the P-183
source fix — you consume #148, you do not change it. Williamson (P-184). `FIGURE-IN-PAYLOAD` and
`NO-CONTAINING-POLYGON` (other open items). The seven `get_smart_site` card reads, which the planner
does with its own connector. Which Bastrop source is right in law (F24 is resolved by A-148).

### Close

`_inbox/<date>_p180-joint_staging_close.json`, `planRows` `["P-180", "P-183"]`, with your start
commit, the fix PR and merge sha with its conclusion string, the two-directional test evidence, the
factory merge sha AND the LDT sha the deployed digest carries (both stated explicitly), the run id
and walk id, the walk's overall verdict, the stamp counts, the two predicates, and the planner's
probe artifact if it has run. `leave_behind` is required. If you stop at a checkpoint, write CP2
rather than a close.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-14_p180-joint_cp1.json
  CP2: _inbox/2026-09-14_p180-joint_cp2.json
  CLOSE: _inbox/2026-09-14_p180-joint_close.json
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
    "lane": "p180-joint",
    "planRows": ["P-180", "P-183"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
