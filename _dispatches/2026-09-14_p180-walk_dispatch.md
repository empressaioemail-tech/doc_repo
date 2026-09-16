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

PLAN-ROW: P-180 (90_operations/OPS-16_texas_market_plan_of_record.md)
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


## Mission — the walk grades a DECLINED EARNED RETIREMENT as a meaning failure, so no gate-blocked county can ever walk green; fix the grade from two independent sources, and prove it in BOTH directions

You are the deepest worker in OPS-23 wave 6. You do not spawn sub-agents. The dispatch planner
supervises you and reviews CP1 and CP2.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that could
hang in `timeout`; never leave a watch, a tail, a dev server, an unwaited Cloud Run job or an
unwaited `verify-walk` behind.

### The finding you are fixing (planner, measured — artifact `_inbox/2026-09-14_step4_restamp_outcome.json`, plan amendment A-152)

The operator-authorised production restamp of 48209 (`publishRunId`
`bc47625c-2de9-4c59-bec9-1e5fe0b313ce`, walk `065523f5-2fd6-4b62-84e0-ac0183d1b41e`) landed and the
walk came back **RED** — but NOT on the family anyone predicted. `sFamilies.failed` is `{}` with
`S13` present in `ruleIds`, so the joint digest's S13 fix (PR #149, factory `63aca2c`) **worked**:
S13 failures went 16 -> 0. The 16 now fail as **`BP-MEANING-01` with `reason` literally `"HTTP 404"`**
in `walk_results`.

The two walks are otherwise identical, same county, same digest, same 86 parcels:

- staging `8eacb135` — `verdict pass`, `retiredCount 16`, grades `{BP-MEANING-01 pass 69, RETIRED pass 16, BP-VERIFY-01 pass 1}`
- production `065523f5` — `verdict fail`, `retiredCount 0`, grades `{BP-MEANING-01 pass 69, BP-MEANING-01 fail 16, BP-VERIFY-01 pass 1}`

**The only difference is those 16 rows.** Mechanism: the bake writes an earned retirement; the
production serve DECLINES it (`shouldDeclineRetiredRecordAtServe`, `serveGuards.ts:200-233`, with
`LANDUSE_JOIN_DISABLED_FIPS_SEED = {48491, 48209}` at `joinNormalize.ts:93`); the route answers
`404 {"error":"not_baked","errorClass":"no_coverage"}`; the walk reads **through the serve**, sees no
row, and grades a 404 as a *meaning* failure. Staging serves the same rows, so the staging cortex-api
revision does not carry the decline — which is why the same digest passes there and fails here.

**Consequence:** no production publish of 48209 or 48491 can produce a green walk at ANY pin. The
restamp is DONE; do not fire another publish. Your change is the companion to PR #149 on the same 16
rows.

### THE TWO CONDITIONS — operator ruling 2026-09-14, both non-optional

**CONDITION 1 — derive the grade from TWO INDEPENDENT SOURCES, never from an exclusion list.**
Accept a 404 only where the **store independently holds an earned retirement for that node**
(`recordRetirement.status` `retired`, `verdict` `absent-verified`, **with a vintage**). A grade that
accepts a 404 *because the node was excluded from the work list* is **presence-shaped**: the publish
would be satisfying both halves of its own check, and **one party acting alone must not be able to
pass it**. So the acceptance predicate must be the conjunction of (i) the serve's typed refusal on
**this** node and (ii) an earned retirement for **this** node read from a source that is NOT the
publish's own excluded-work-list. Say in your close exactly which source (ii) is, how you read it, and
why it is independent of (i). If the walk cannot reach a store in its environment, that is a FINDING
to report — not something to work around by falling back on the exclusion list.

**CONDITION 2 — prove it in BOTH directions.** Re-running the walk against `bc47625c` shows only that
it now PASSES. You must ALSO show the walk still **FAILS** on a node that 404s with **NO earned
retirement** in the store. **A check observed only passing has not been observed working.** Both
directions must discriminate: revert the change and show direction 1's test fires (as PR #149's lane
did with its negative control).

### Where you work

One `hauska-factory` worktree, new branch off `origin/main`. The walk is
`src/jobs/verify-walk.mjs` + `src/stages/grade/s-rules.mjs` + `src/stages/grade/v-rules.mjs`. Declare
your start commit. Note the deployed pin is now the JOINT digest `sha256:bb3d7148` (factory `63aca2c`
+ LDT `bae48d40`), pinned on `factory-bastrop-publish`, `factory-staging-reset` and
`factory-verify-walk`; if your change needs to run on a job, read the digest back from the JOB by
field name — `runs.image_digest` and `runs.ldt_sha` are NULL for this job shape and can never tell
you.

Worth reading before you start: `src/stages/grade/s-rules.mjs`'s `servedProvenanceTokens` and its
comment block (PR #149's own reasoning — a row that by construction serves no provenance should not
be graded as if it served nothing). Your change is the same argument one step further out, and the
two must not contradict each other. Quote the FUNCTION NAME, not a line range; the merged tree is
already 2 lines off the ranges quoted in the previous dispatch.

### What you build, in order

1. **The fix.** A declined earned retirement must be an ACCEPTABLE served outcome. Write it so it
   CANNOT silence a genuine `no_coverage` 404 that has no earned retirement behind it — the refusal
   body alone is not sufficient evidence, and neither is the work list.
2. **The two-directional test**, on the same footing as PR #149's: direction 1 (a 404 for a node with
   an earned retirement in the store -> acceptable), direction 2 (a 404 for a node with NO earned
   retirement -> still FAIL), plus a negative control with the change reverted. Merge on the
   conclusion string, quoting it — not `gh pr checks` printing "pass".
3. **Prove it against production's EXISTING run, which is a READ.** Run `factory-verify-walk` with
   `--target=production --county=48209 --publish-run=bc47625c`. This exercises the fix on production
   against a run that already exists — **no store write, no publish, nothing at risk.** Read the
   walk's overall verdict and paste it. Watch the gold requirement: county 48209 has NO registered
   gold (`GOLD_PARCELS` registers only `48021:34137`), so `--gold=48209:97658` is required or the run
   refuses `GOLD_REQUIRED`. If a walk is already in flight, do not start a second one.
4. **Both predicates, not just one.** (a) The walk's overall verdict is `pass` on `bc47625c`. (b) The
   surface still 404s on `48209:84629` and still 200s on `48209:97658` — your change fixes the GRADE,
   not the surface, and if the surface changed you have touched something you were not asked to.

### Falsifiers, pre-registered

- **PRESENCE-SHAPED (the operator's named failure):** if the acceptance can be satisfied by the
  node's presence in the publish's excluded-work-list alone, or by any source that is not independent
  of the publish's own bookkeeping, the row HAS NOT LANDED. Say so plainly rather than reporting a
  green walk.
- **If direction 2 does not fail** — a 404 with no earned retirement still passing — you have silenced
  a real signal and the fix is wrong, whatever the walk says about `bc47625c`.
- **If the walk's overall verdict on `bc47625c` is not `pass`**, this lane has not succeeded,
  regardless of how the individual counts look. This is the falsifier the predecessor's set was
  missing: on 2026-09-14 every pre-registered check cleared while the walk was still red, because the
  set tested the stamp and not the walk's grade families.
- If any of the 16 no longer grades as a retirement in the expected direction, say which and why.
- If your run needs the digest read back and it does not carry the joint pin, say so rather than
  attributing a result to a build that did not run.

### OUT OF SCOPE — and this one must NOT be closed by your change

**Production `get_smart_site` at the depth node returns `reason=parcel_not_found` and
`parcelExists=false` for `48209:84629` (measured today), while the store holds an earned retirement
for it.** That is the serving surface **collapsing a provenanced absence into never-had-it**, and it
is carded separately by the integration seat. **The walk fix must NOT be used to close it, must not
be cited as evidence about it, and is not a fix for it.** If your work touches it, stop and report.

Also out of scope: the record store and the P-183 source fix; the PRODUCTION publish (done — it was a
restamp, and another fire has nothing left to accomplish); Williamson (P-184); `FIGURE-IN-PAYLOAD`;
`NO-CONTAINING-POLYGON`; the seven `get_smart_site` card reads; the cortex-api shift (HELD — a shift
with no `_catalog/leases/cortex-api.json` is refused by the P-170 gate, and the lease directory holds
only its README).

### Close

`_inbox/<date>_p180-walk_declined_retirement_close.json`, `planRows` `["P-180"]`, with your start
commit, the fix PR and merge sha with its conclusion string, the two-directional test evidence and the
negative control, **exactly which source (ii) is and why it is independent**, the production walk
verdict against `bc47625c` with its walk id, the surface control reads, and the named open item you
did NOT close. `leave_behind` is required. If you stop at a checkpoint, write CP2 rather than a close.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-14_p180-walk_cp1.json
  CP2: _inbox/2026-09-14_p180-walk_cp2.json
  CLOSE: _inbox/2026-09-14_p180-walk_close.json
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
    "lane": "p180-walk",
    "planRows": ["P-180"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
