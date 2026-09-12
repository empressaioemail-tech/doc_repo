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

PLAN-ROW: P-175, P-145 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools

# PROGRAM CONTEXT — OPS-21 serve completion

You are working a lane of OPS-21. Everything below is program law for this lane. If it
conflicts with the general canon preamble, this section is narrower and wins on scope; if it
conflicts with the AGENT CONTRACT or ENFORCEMENT, those win.

## The one goal

Every one of the 65 parcel-record rails reaches a real state with an instrument behind it, in
production, for the six Central Texas counties. **Not "acquire everything."** Values where we
have data, honest dispositions where we do not.

Counties: `48021` Bastrop, `48055` Caldwell, `48209` Hays, `48309` McLennan, `48453` Travis,
`48491` Williamson.

## The six cell states — this is the vocabulary, use no other

| state | means | requires |
|---|---|---|
| `value` | measured | instrument, scope, measuredAt |
| `absent-verified` | something looked and it is not there | a NAMED instrument and an explicit SCOPE |
| `not-applicable` | a ruling says this does not govern here | a decision-record pointer |
| `refused` | a real value exists upstream and the source cannot say which | instrument, scope |
| `unaccounted` | nobody has looked | nothing — it is the default |
| `available-on-request` | not acquired in bulk; fetched per parcel on demand. Nobody has asked for this one | a named, REACHABLE `requestPath` |

**`available-on-request` is NOT an absence claim.** It says nothing about whether the fact
exists. A `requestPath` that is not reachable is not this state — a dead path makes the cell
`unaccounted` or `refused`, never a promise the product cannot keep. Adding a rail to this
state is a ruling, never a lane's discretion. Ruled 2026-09-10.

**`unaccounted` is legitimate at rest and fatal at publish.** Both halves are load-bearing. If
it stops being fatal it becomes cover; if it stops being legitimate the pressure moves to
fabricating values.

**Never convert `unaccounted` to `absent-verified` to clear a gate.** `absent-verified` is a
claim that something looked. Writing it where nothing looked is a lie that passes every check.
A relabelling tripwire counts unaccounted falling without a matching acquisition landing.

**Where a real limit exists and the source cannot say which, the state is `refused`, not
`not-applicable`.** Default to the weaker state. `not-applicable` on an in-city parcel claims
the land is unzoned.

## Identity — get this wrong and every cell is wrong

```
place_key      "{county_fips}:{prop_id}"              RAW. This is what cells are keyed on.
parcelNodeId   "{county_fips}:{normalizeForJoin(prop_id)}"   NORMALIZED (engine side).
entity_id      "{parcelNodeId}:{suffix}"              atoms only.
```

`normalizeForJoin` strips leading zeros on all-digit tokens. **Write cells on the RAW
`place_key`. Do not normalize.** The divergence between the two is a known, unmeasured
conflation risk; do not widen it.

A parcel is not an account. `parcel_record`'s intended population is
`landing_parcel_jurisdiction`, not the `cad_property` account roll. N polygons can share one
`prop_id` and are folded to one atom by design.

## Stores

CORRECTED 2026-09-10. This block previously read "Two databases on one Neon host" and
bucketed every table under a single `neondb`. That was wrong in the way that matters most,
because `neondb` is a shared default database NAME, not one store. Two lanes hit it
independently: OPS-21 S1 (`_inbox/2026-09-10_ops21-s1_close.json`) and OPS-21 S2
(`_inbox/2026-09-11_ops21-s2_cp1.json`), each re-verifying live. It also contradicted the
FACTORY canon line that gives `hauska-factory` its own Neon store.

```
HOST ep-lucky-truth-apodo8hr          (PRODUCTION_NEONDB_URL, and atoms)
  db hauska_mcp    atoms
  db neondb        txgio_parcel, cad_property, landing_parcel_jurisdiction

HOST ep-round-base-au0jofwp           (FACTORY_DATABASE_URL)
  db neondb        parcel_record, parcel_record_cell, parcel_record_companion_row

  db neondb        parcel_gate_verdict   (RESOLVED 2026-09-11 by the OPS-21 S4 lane:
                   it lives on the FACTORY host, same host as parcel_record itself)

NOT ESTABLISHED -- do not assume either host
                   tx_* layers, permit_record
```

The three NOT ESTABLISHED entries were carried in the old single bucket and their host was
never actually resolved by either lane. They are listed unresolved on purpose rather than
being silently assigned to the more likely host. If your lane needs one, resolve it live and
report which host answered, so this block gains a line instead of a guess.

**Two separate Neon HOSTS. A SQL join across them cannot be written at all**, and that
includes the join a reader of the old block would most naturally reach for, between
`parcel_record_cell` and `landing_parcel_jurisdiction`, which are on different hosts. The
same-name `neondb` on each host is the trap: a connection string that looks right, a
database name that looks right, and a query against the wrong host returns a FALSE ABSENCE,
not an error. Declare which HOST and which database you opened, not just the database.

## Grading is not serving

`publish-gate-sched` writes verdicts to `parcel_gate_verdict`. `parcelRecordAllowlist.ts`
(LDT) requires BOTH code-owned slate membership AND a `pass` verdict before a rail serves from
the record, and the slate is **never** auto-derived from a passing verdict. Do not conflate
the two controls.

**CORRECTION 2026-09-10, found by the D5 lane, not by the planner.** An earlier version of
this preamble said "widening what is graded changes nothing a customer sees." That is true of
the LDT serve-side allowlist and **FALSE for hauska-factory's own publish gate**:
`publish-readiness-gate.mjs:359` defaults `requiredRails` to `DEFAULT_SCHED_RAIL_KEYS`, and
`bastrop-publish.mjs:407` calls `requirePreBakeReadiness` with no third argument, so it takes
that default. Widening that constant literally would block every publish for every county.

**The general lesson, which is this program's whole subject:** one constant, two controls,
and the planner read one of them. Before you change any shared constant, enumerate its
consumers — `git grep` the symbol across the repo — and check that your mission's stated
blast radius matches what you find. If it does not, stop and report rather than proceeding on
the mission's word. A grading denominator and a policy floor can be the same identifier.

## Jurisdiction

`landing_parcel_jurisdiction.disposition` is three values: `unincorporated`, `in-city`,
`unresolved`. **ETJ is not one of them** — `etjStatus` is a separate rail.

`UNINCORPORATED_NOT_APPLICABLE_RAIL_KEYS` already writes `not-applicable` on 18 rails at row
creation for unincorporated parcels. **Do not touch those cells.** Most zoning-envelope work
is in-city only, which is a much smaller population than the county count suggests.

The six counties hold 69 cities; 23 carry a zoning layer endpoint. Two binding methods are in
play (`covers-v1`, `intersection-v1`) and must never be averaged across versions.

## The defect class this program exists to close

**Vacuous write paths.** Dormant means no trigger. Starved means a trigger and correct logic
with an input never supplied. **Vacuous means it runs perfectly, every test passes, and it
cannot succeed on any branch.** Nothing in this fleet detects the third.

The instance: `computeTier1Envelope` (LDT `nodeFacetBakeTier1.ts:92`) has two return branches
and both are `status:"declined"`. Six weeks of "setbacks keep coming up short" is that one
function. Before reporting a rail blocked on data, read its write path and check whether a
value is reachable at all.

## Hard prohibitions

- **Bastrop MyGov is off limits.** `smartcity-os` `tenant_id=2` carries 658 active permits and
  full inspection, violation and work-order data. It is a city customer's internal feed.
  Tenant sovereignty and NO PRIVILEGED DATA both forbid it populating a public parcel rail.
  The join will look like free coverage. It is not.
- **Do not hand-author a rail list.** The closed set is
  `src/lib/parcel-record-engine/rail-keys.js`, 65 rails, derived not hand-authored. A
  hand-maintained denominator is the defect class this program exists to close.
- **Do not lift `SETBACK_APPLY_HELD`** or route through the setback atom writer. Out of scope
  by operator decision; cells are written from the ruled table.
- **Stay in your own repository.** Read across repos freely; write only where your lane says.

## Completion is a predicate, not a close file

Your lane's row in OPS-21 carries a completion predicate that is a query, not a paragraph.
`node scripts/plan-progress.mjs --sql` in doc_repo prints them. **A lane is done when its
predicate says so.** Reporting done against any other instrument is the failure this program
was opened to fix — the publish gate graded 17 of 65 rails, so an agent could honestly pass a
question nobody asked.

State your snapshot: repository, branch, commit. Verify by violation before reporting any
check as working.


## Mission — P-175 HAYS ONLINE: the identifier backfill, the rebind bake, the vacant-lot binding, and five Sturgeon Dr cards a customer can use

You are a hand-carried lane on the property seat. You are the deepest worker: you do not spawn
sub-agents. The integration seat (overseer) reviews your CP1 design and your CP2 staging pilot
in this thread, and the OPERATOR gives the go for the production apply in this thread. You run
the surface probe yourself after each publish.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### Why this row exists (the customer)

The operator, an architect, has a builder client who received this from the City of San Marcos
on 2026-09-12 (Capital Improvements/Engineering): "We would like to see 2D hydraulic modeling
performed on one of the proposed houses to review impacts to the floodplain." The houses are
615, 617, 619, 627 and 629 Sturgeon Dr, San Marcos, Hays County 48209. The operator needs Smart
Site's flood read on the five. Today the product cannot give it, for two different reasons, and
this row removes both.

### What is true today (read at source 2026-09-12 by the integration seat; re-verify at your start)

**The five lots.** CAD's 8-26-2026 PROPERTY export (`hays.zip`, sha256
`7a4bd56dad244b0ead0a0899e082800d2ea01660129d69a3b60387602ee2b193`, member
`2026-PROPERTY-DATA-EXPORT-FILE-PROPERTY-8.26.2026.zip` / `PropertyDataExport1404449.txt`, 40
columns, 134,592 records; the IMPROVEMENT member has 11 columns and is the wrong file) carries
Conway Addition Sec IV block 1:

| lot | CAD PropertyID | QuickRefID | PropertyNumber (= TxGIO geo_id) | TxGIO prop_id | situs on the roll | value |
|---|---|---|---|---|---|---|
| 4 | 84632 | R97651 | 11-2011-0001-00400-3 | 97651 | `STURGEON DR, SAN MARCOS` (no number) | land only 50,130 |
| 5 | 84633 | R97652 | 11-2011-0001-00500-3 | 97652 | no number | land only |
| 6 | 84634 | R97653 | 11-2011-0001-00600-3 | 97653 | no number | land only |
| 10 | 84638 | R97657 | 11-2011-0001-01000-3 | 97657 | no number | land only 50,390 |
| 11 | 84639 | R97658 | 11-2011-0001-01100-3 | 97658 | `629 STURGEON DR` | land only 50,390 |

The CAPCOG address points in `txgio_address` (615 at 29.87113, -97.92674; 617 at 29.87124,
-97.92662; 619 at 29.87135, -97.92649; 627 at 29.87177, -97.92600; 629 at 29.87188, -97.92588)
fall inside exactly those TxGIO parcels by `ST_Contains` (production, 2026-09-12). The city has
assigned numbers the appraisal district has not yet written, so the four vacant lots are
`located-unbound` in `find_parcel` and the Find box: the address is known, no parcel string
matches it, and nothing binds by geometry.

**The chimera.** `find_parcel("629 Sturgeon Dr, San Marcos")` returns node `48209:97658`
(source `parcel-situs`). Its snapshot (`bakedAt 2026-08-30T06:21:20Z`, runId
`pe-r1-NDgyMDk6OTc2NTg…`) carries the Sturgeon lot's polygon (9 vertices, 0.1889 ac, matching
lot 11's 0.19) and every geometry-derived facet: zoning SF-6 San Marcos, city limits
incorporated San Marcos, San Marcos CISD, Upper San Marcos Watershed Reclamation and FCD, flood
Zone AO SFHA true point-on-surface `NFHL_48_20260101`. It also carries CAD account 97658's
attributes: draw label `13669 MESA VERDE DR, AUSTIN, TX 78737`, anchor 30.18232, -97.97703
(`bake-latlng-index`, about 35 km away), market 636,690, structure 2012 / 2,867 sq ft, value
history 2025 635,094. `cad_property` on production: `(48209, 97658, 2026)` situs `13669 MESA
VERDE DR`, source `2026-PRELIMINARY-DATA-EXPORT-FILES.zip`; `(48209, 97658, 2025)` situs `629
STURGEON DR`, source `stratmap25-landparcels_48209_lp.zip` (the P-78 overwrite). TxGIO parcel
128076 (geo_id `11-0362-000E-01500-4`) is the real Mesa Verde Dr polygon. This is
CTX-HAYS-KEY's mechanism (`_inbox/2026-09-10_ctx-hays-key_close.json`): TxGIO's prop_id is the
QuickRefID R-stem, cad_property's prop_id is the PropertyID, and the tier-1 bake joined them on
one bare number. One node, two parcels.

**What is built and not executed.**
- LDT #653 `c43e2436` (CTX-HAYS-REBIND): `parcelCrosswalkJoinKey` in
  `artifacts/api-server/src/lib/joinNormalize.ts`, consumed by
  `nodeFacetBakeTier1ConformantCli.ts:433`; for a gate-blocked county geometry binds through
  `property_number` to `txgio_parcel.geo_id`, corroborated by the QuickRefID stem. MERGED.
- LDT #654 `cebd041d` (CTX-HAYS-BACKFILL): `cad-backfill-published-identifiers`, a two-column
  backfill that refuses six ways and verifies an untouched-columns digest. MERGED. Migration
  `0099_cad_property_published_identifiers` is applied on production AND on
  `f06-staging-neondb` (both carry `quick_ref_id` and `property_number`; the close's
  leave-behind saying staging lacked it is stale).
- hauska-factory `cloudbuild.publish.yaml` pins `_LDT_SHA: cebd041d…`, which contains both
  PRs, and #129 scoped `CADROLL_EXPECTATION_SQL` to the declared vintage
  (`src/lib/publish-cadroll-postcondition.mjs:138-141`).
- OPS-21 H1 (P-145): `hauska-factory-ops21-h1`, commit `eee3c21`
  `feat(P-145/OPS21-H1): Hays identity disposition classifier, control-validated, Hays run
  held`. `scripts/ops21-h1/hays-identity-reconciliation.mjs --county=48209 --allow-hays`, held
  on this backfill (`_inbox/2026-09-10_ops21-h1_cp2.json`).
- Production: `quick_ref_id IS NOT NULL` on 0 of 134,606 Hays 2026 rows; 173,050 tier-1
  snapshots for 48209 dated 2026-08-30. Nothing has reached a customer.

**The declared-roll question is open and NOT yours.** The store carries the PRELIMINARY 2026
drop; the 8-26-2026 drop moves market value on 45,524 accounts. Identifiers describe the
account, values describe the drop; the backfill writes identifiers only. Do not re-ingest.

### What you build and run, in this order

**Step 0. Snapshot.** Worktree `P:/seat-worktrees/property/legacy-design-tools-p175-hays-online`
from `origin/main` (declare the commit; it must contain `cebd041d`). `pnpm install`. Declare the
Neon project `fancy-fire-06136146` branches you will touch: `f06-staging-neondb` first,
`production` second. Verify by violation that the backfill CLI refuses a wrong branch name and a
missing `--tax-year` before you run it for real.

**Step 1. Backfill on staging.** From `_inbox/2026-09-10_ctx-hays-backfill_close.json`
`theInvocation`: dry-run with `--record`, read the record, then apply. Read, do not assume,
staging's matched / skipped / not-written figures. The record must end with `committed`. CP2 is
this pilot: paste the summary line, the record's tail, and
`SELECT count(*) FROM cad_property WHERE county_fips='48209' AND tax_year=2026 AND quick_ref_id IS NOT NULL`.

**Step 2. Backfill on production, on the operator's go in this thread.** Dry-run first; paste
its plan counts against the pre-registered expectation (roll rows 134,606; accounts offered
134,591; matched 134,216; updated 134,216 first run, 0 on re-run; skipped no roll row 375;
skipped null identifier 0; not written 390; digest VERIFIED). Any other number is a finding you
report before applying. Then apply, on the go. Keep both record files and name them in your
close: they are the durable record of a state-changing operation. Re-run once to prove 0.

**Step 3. H1 on production.** In `hauska-factory-ops21-h1` (rebase `feat/ops21-h1-hays-identity`
on `origin/main` first), run the reconciliation with the crosswalk read from the backfilled
columns or from the export (the CP2 says either; prefer the columns now that they exist, and say
so). Deliver the four-bucket disposition table for every non-intersecting Hays row and the count
with no disposition, which must be 0. Commit, PR, merge on the conclusion string `success`. This
closes P-145's predicate; name both rows in your close.

**Step 4. Publish Hays tier-1, staging then production.** The factory job:
`gcloud run jobs execute factory-publish --region us-east4 --project hauska-prod-497015 --args=bastrop-publish,--target=staging,--county=48209,--skip-pmtiles` (confirm the job name and
region from `gcloud run jobs list` before you run; read the current `_LDT_SHA` from
`cloudbuild.publish.yaml` on `origin/main` and confirm it still contains `c43e2436`). Read the
`runs` / `publish_runs` row for the verdict, not the console. If the cadRoll gate refuses, paste
the refuse code and the gate's own arithmetic (re-derive its SQL; a refusal writes no event
body, per `_inbox/2026-09-10_ctx-hays-gate_close.json`). Walk. Then production, same job, same
pin. After the production publish, `get_smart_site 48209:84639` must carry the Sturgeon polygon
AND the 629 label; `48209:97658` must carry the Mesa Verde polygon (TxGIO 128076) and label.
Read both and paste them.

**Step 5. The situs resolver, two changes in `artifacts/api-server/src/lib/txgioAddressResolve.ts`.**
(a) When the parcel-situs ladder returns no hit and the address-point ladder returns a located
point, bind the point to the TxGIO parcel that contains it (`ST_Contains`, one query, county
scoped) and return it as a hit with `source: "address-point-containment"`; keep
`located-unbound` for a point no parcel contains. (b) For a gate-blocked county, a parcel-situs
hit keyed by a TxGIO prop_id resolves to the node the CAD account names through the crosswalk
(`property_number` to `geo_id`), so "629 STURGEON" resolves to `48209:84639`, not to `97658`.
Tests that fail on today's behaviour for both. Same for `smartsite-mcp`'s `find_parcel` if it
has its own copy of the ladder (`artifacts/smartsite-mcp/src/tools.ts:366` says situs-search is
not used there; read it and say which path the connector takes). Deploy api-server and
smartsite-mcp the way their workflows deploy (one traffic shift per service, lease per P-170).

**Step 6. Probe.** `node scripts/surface-probe.mjs --rows P-175` in your doc_repo worktree. PASS
on all five, or the exact reason on each. The artifact path goes in your close.

### Falsifiers, pre-registered

- If after Step 4 `48209:97658` still shows the Sturgeon polygon under the Mesa Verde label, the
  rebind did not reach the bake: the pin, the blocked-county set, or the crosswalk key is wrong.
- If after Step 5 "615 STURGEON DR" resolves to a parcel other than TxGIO 97651, the
  containment query is wrong (check SRID 4326 and the county scope).
- If the production backfill updates a number other than 134,216 on first run or other than 0
  on re-run, stop and report; do not proceed to Step 4.
- If the probe passes while the operator's own Find box search for 629 lands on a card that
  reads Mesa Verde, the probe reads a different path than the browser; report which.

### Also measure, do not necessarily fix

`find_parcel near {"query":"629 Sturgeon Dr, San Marcos, TX","radiusFt":300}` returned twenty
hits, every one at `distanceFt 0`, nineteen of them stacked `705 W RIVER RD` rows, truncated at
radius 300 and again at 75 (two sessions, 2026-09-12). State the mechanism (the centre point,
the distance computation, or a stacked-condo geometry) and one rejected alternative with
evidence. Fix it only if the cause is inside the file you are already changing; otherwise it is
a leave-behind with an owner.

### Out of scope

Adopting the 8-26-2026 drop as the declared roll. Repairing `p78Merge`'s overwrite in other
counties (a P-124 follow-up with its own retirement item). OPS-21 cell fill for Hays beyond what
the bake serves. Any 2D hydraulic model: Smart Site supplies the floodplain determination and
the record inputs, not the engineering study.

### Close

`_inbox/2026-09-12_p175-hays-online_close.json`, `planRows` `["P-175", "P-145"]`, with the two
backfill record paths, the H1 table, both publish run ids, the two `get_smart_site` reads, the
PR numbers and merge SHAs with conclusion strings, the serving revisions read by field, and the
probe artifact. `leave_behind` is required; `none` is a valid answer.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-12_p175-hays-online_cp1.json
  CP2: _inbox/2026-09-12_p175-hays-online_cp2.json
  CLOSE: _inbox/2026-09-12_p175-hays-online_close.json
  These paths are relative to the doc_repo worktree the session RUNNING YOU is rooted in: for a
  lane spawned by the dispatch planner that is the planner's worktree; for the dispatch planner
  itself it is its own seat worktree (never P:/doc_repo, the integration seat's checkout). This
  dispatch was compiled in P:/doc_repo. Two lanes in each of waves 1 and 2 wrote
  into the property seat's worktree instead and their artifacts had to be found by hand.
  No notification arrives when a background command finishes: poll with a bounded loop and a
  timeout; a lane that ends its turn waiting for a wake-up stalls (two lanes did, wave 2).

CLOSE SKELETON (the fields the enforcement gate reads; spell them exactly, or the gate refuses
the commit rather than guessing what you meant):
  {
    "lane": "p175-hays-online",
    "planRows": ["P-175", "P-145"],
    "status": "closed | closed-partial | blocked",
    "probe": { "artifact": "_inbox/<date>_<HHMMSS>_surface_probe.json" },
    "falsifier": "...", "contradicted": "...", "leave_behind": [...],
    "missionPremise": "...", "completionPredicate": "...", "scopeBasis": "..."
  }
  A close that says "closed" must be PASS for every parcel of every row in planRows on the cited
  artifact. A close that says "closed-partial" or "blocked" must still cite an artifact that
  measured its rows; the verdicts may be FAIL or UNMEASURED. planRows is an array, never a
  string; probe.artifact is a path under _inbox/ produced by scripts/surface-probe.mjs.
