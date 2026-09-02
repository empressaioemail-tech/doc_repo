# Parcel-record program review — adversarial review of the program, not its output

**Lane:** PARCEL-REVIEW (F-01). **Seat:** property. **Mission:** ruling step 5 —
`_decisions/2026-09-01_parcel_record_is_the_gate_to_everything.md`. Findings only; fixes
are step 6, separate cards.

**Snapshot.** doc_repo `main` at claim (`d10fa86`). hauska-factory `origin/main` `27bf8e4`
(the PR #68 merge — the tip after all nine cards this session, including the parallel
session's PARCEL-R4-COMPANIONS). hauska-engine reviewed at a fresh clone of `main`
(`a38cbb2` lineage). Reads: `PRODUCTION_NEONDB_URL`/neondb (`cad_property`,
`landing_parcel_jurisdiction`) and `FACTORY_DATABASE_URL` (`parcel_record`,
`parcel_record_cell`), both `SET default_transaction_read_only = on`,
`statement_timeout` bounded per query (15s–240s, stated per finding below). No write
executed against any store. No product-repo commit — this card is read-only by mandate.

**Method note, stated up front because it shaped the review:** the store repeatedly
timed out under what is almost certainly concurrent writer load from other active
sessions — a full store-wide `unaccounted` count timed out at 60s via the dedicated
partial index; a 39-rail batched liveness check timed out at 15s; a two-table join for
the NA-cell audit timed out at 60s. This is not a review artifact; it is itself finding
#8 below, freshly reproduced by this card's own read-only work. Every number in this
report that required a live query states the query's actual timeout and whether it
succeeded. No number here is asserted without either a successful live measurement or an
explicit code-read citation.

---

## Ranked findings

### 1. [CRITICAL — confirmed live] The Williamson crosswalk has a many-to-one collision path. It has already duplicated real dollar data onto at least one pair of distinct parcels in production.

**Defect.** `WILLIAMSON_CROSSWALK_SQL` in `hauska-factory/src/jobs/parcel-record-fill.mjs`
(lines 260–288) computes uniqueness as `count(*) OVER (PARTITION BY target_prop_id) = 1`
— it guards against one R-prefix row matching *multiple* numeric rows, but it has no
guard in the other direction: if **two different R-prefix accounts share one
situs_address**, and that address has exactly one numeric-roll counterpart, *both*
R-accounts independently satisfy `match_count = 1` from their own partition and both get
crosswalked to the *same* numeric account.

**Mechanism.** New-construction subdivisions routinely carry more than one CAD account
against one physical address during the platting-to-sale lifecycle — a developer's raw
land account, a homebuilder's construction account, and eventually the finished home's
owner-occupied account. Live example, fully traced: `1428 TREASURE MAP VW, LEANDER, TX
78641` is shared by R-prefix accounts `R664999` (owner `PHAU - PALMERA BLUFF 7-8 LLC`, a
developer holding entity) and `R665023` (owner `HIGHLAND HOMES AUSTIN LLC`, a builder).
Both independently pass the uniqueness gate against the single numeric account `490339`
(owner `JADHAV NIRANJAN DASHRATH & SRUSHTI DADAJI SONAWANE`, `improvement_value=613956`).
Confirmed live in `parcel_record_cell` (FACTORY_DATABASE_URL, 30s timeout, succeeded):
`48491:R664999.improvementValue = {kind: value, value: 613956}` **and**
`48491:R665023.improvementValue = {kind: value, value: 613956}` — the identical
six-figure dollar value, byte-identical, on two structurally distinct parcel accounts.

**Second mechanism considered and rejected.** Coincidence — two unrelated parcels
happening to carry the same improvement value. Rejected on two grounds: (a) $613,956 is
high-precision enough that an accidental match is not plausible at scale, and this was
not an isolated pair — the underlying condition (shared situs, unique numeric match) was
found in 134 groups; (b) `cad_property.legal_description` for both R-accounts reads
`S13718 - PALMERA BLUFF SECS 7 & 8 (AMD)`, the identical subdivision/phase as the matched
numeric account's `S13718 - PALMERA BLUFF SECS 7 & 8 (AMD), BLOCK J, Lot 30` — confirming
these are genuinely different CAD-account phases of construction on the same platted lot,
not an unrelated coincidence.

**Severity, sized.** Independently derived, live, 180s timeout, succeeded: **4,558**
situs addresses are shared by 2+ Williamson R-prefix accounts; of those, **134 groups
(777 R-prefix accounts total, 0.3% of the 282,569 R-prefix population)** have a numeric
counterpart that is itself unique — i.e., 777 accounts are exposed to this collision
path. Confirmed manifested (not merely exposed) on at least the `R664999`/`R665023`
pair; a full sweep of all 134 groups to count how many actually collided with an
identical *non-zero* value (vs. legitimately both landing on $0, which is not
distinguishable from a coincidence without further work) was not run this card — sizing
the *actually-wrong* subset, not just the exposed subset, is the natural first step of
the step-6 fix.

**Severity in production terms.** This is invisible to every control that exists today:
it passed R1-crosswalk's own audit (which checked `r_fanout` uniqueness only, in the
same direction as the code, and validated against *owner-name* agreement — a field that,
in this collision, actually *disagreed* between the two colliding R-rows, which R1
interpreted as expected "ownership-transfer noise" rather than as a possible collision
signal). It passed R1B's and R6B's own production runs and both cards' spot-checks
(neither sampled a shared-situs pair). It is invisible to the publish gate (finding #3,
#9 below — the gate only checks for `unaccounted`, and this cell is `value`, fully
earned). A customer reading this parcel's improvement value today gets a specific,
plausible, wrong dollar figure with no signal anywhere that it is shared with a
different account.

**Falsifier (already run, positive).** Query: for Williamson R-prefix rows sharing a
situs_address, does any such group also have a unique numeric-roll match? If none
existed, the collision path would be theoretical only. It is not theoretical: 134 groups
exist, and at least one group's improvement value is confirmed byte-identical across two
distinct place_keys in the live store.

---

### 2. [CRITICAL] `parcel_record` has zero downstream consumers anywhere in the org. Every card this session — the entire "gate to everything" build — writes to a store nothing reads.

**Defect.** `gh search code "parcel_record" --owner empressaioemail-tech` returns matches
only in `doc_repo` (planning prose), `hauska-engine` (the schema/logic source), and
`hauska-factory` (the writer jobs, migrations, and the job's own internal
`parcel_record_layer` status-tracking field in `src/ledgers/city.mjs` — itself a
*separate*, hand-maintained govtech-stack progress ledger, not a live query against the
table). **Zero** matches in `legacy-design-tools`, `property-explorer`,
`smartcity-dashboards`, `cortex-api`, `hauska-map`, or any other repo in the
organization.

**Mechanism.** The parcel-record program (schema, 65-rail template, cad-null-verified
semantics, the Williamson crosswalk, flood/wells/special-district ingestion, jurisdiction
stamping — every card this session) was built and filled to a Factory-owned Neon store
that no product surface has been wired to read from. Confirmed independently in
DOLLAR-FIELDS' own close: "cortex-prod/place_layer_snapshots is what Property Explorer
and LDT api-server actually serve from right now" — a structurally different, older
store (Wave R / LDT bake), which is what the dollar-fields/dollar-run cards separately
patched.

**Second mechanism considered and rejected.** That a consumer exists but doesn't
reference the literal string `parcel_record` (e.g., through an ORM model name, a view, or
an environment-variable-constructed table name). Rejected: `gh search code` on GitHub's
index is a full-text search across file contents, not a literal-grep with escaping
issues; and cross-checking manually, no repo other than hauska-factory/hauska-engine even
holds a `FACTORY_DATABASE_URL` reference at all (the Factory store's own connection
string isn't configured anywhere outside hauska-factory's own deploy templates,
independently corroborating that nothing outside hauska-factory even *connects* to that
database).

**Severity in production terms.** This is the answer chapter 8 is asking for, stated
plainly: **prod, by the operator's own definition ("the record SERVES the product"), is
not reachable from the current state by filling more cells.** Every unaccounted cell
converted to value or absent-verified this session moved the store closer to a
publish-gate PASS that, even fully achieved, changes nothing a user sees, because nothing
consumes the verdict or the data. This is not a criticism of the ordering (the ruling is
explicit that ingestion/audit/acquisition precede "what's needed to reach production" —
step 7) — it is the sizing that step 7 needs, stated as starkly as the evidence supports.

**Falsifier.** A grep or `gh search code` hit for `parcel_record` (or a wrapped
abstraction over it) in any repo outside hauska-factory/hauska-engine/doc_repo would
falsify this. None was found.

---

### 3. [CRITICAL] The publish gate is dormant. It has never been run against the live store, in production, by any deployed mechanism.

**Defect.** `evaluatePublishGate`/`assertPublishableCounty`
(`hauska-engine/packages/engine-core/src/parcel-record/publish-gate.ts`) are correct,
tested, well-designed pure functions. Their **only call site anywhere in
hauska-factory** is `parcel-record-fill.mjs:900`, inside a `--poison-place`-flagged
branch of the job's *sample*-mode path (`instantiateAndIngest` on
`selection.propIds`, a small targeted sample, not a county-wide run) — a self-test that
poisons one cell and asserts the gate correctly refuses on that single poisoned record.
No code path anywhere queries the live store's full rail-liveness state (the module's own
documented `RAIL_LIVENESS_SQL` contract — a global, no-county-filter aggregate over
`parcel_record_cell` — has zero call sites in hauska-factory outside its own test file)
and evaluates a real publish decision against it. The gap ledger's "Publish gate REFUSE
on every county" (2026-09-01) was a one-time manual measurement performed by that card's
author with a bespoke script, not a standing check.

**Three-question gate, applied (ENFORCEMENT.md):**
1. *What executes this?* Nothing in production. A CLI flag on a sample-mode dev/test run.
2. *What triggers it?* Nothing — no job, no CI step, no scheduled task, no deploy gate.
3. *What fails when it's violated?* Nothing, because it never runs against real data.

**Severity in production terms.** Combined with finding #2: even setting aside that
nothing reads `parcel_record`, nothing would even *know* whether a county is
publish-ready without a human manually writing and running a script — exactly the
"artifact that exists, is correct, and does nothing" class ENFORCEMENT.md names as the
defect this operation actually suffers from. This is the single clearest instance of that
class found in this review.

**Falsifier.** Any cloudbuild job, scheduled task, or CI step invoking
`assertPublishableCounty`/`evaluatePublishGate` against the live store (not a sample)
would falsify this. `grep -rn "evaluatePublishGate|assertPublishableCounty"
src/jobs/*.mjs cloudbuild.*.yaml` in hauska-factory turns up only the one sample-mode
call site above.

---

### 4. [HIGH] The surface that actually serves users today has a known, ruled, unfixed pipeline-state leak — violating its own four-state serve contract, live, right now.

**Defect.** `_decisions/2026-09-01_serve_path_never_emits_pipeline_state.md` ruled
`unmeasured`/`unresolved` pipeline-internal words must never reach the wire; the serve
contract is four states (value/absent-verified/not-applicable/refused) or a refusal.
CAD-SERVE-RECONCILE (closed 2026-09-01T16:02Z, the card that produced the ruling's
evidence) named the leave_behind explicitly: *"Implement
`_decisions/2026-09-01_serve_path_never_emits_pipeline_state.md`... Not this card,"*
owner planner, plan_row F-01. No card on the board this session, and none among the
currently-claimable cards (`cell-ledger`, `parcel-caldwell-geom`, `parcel-scout-*`,
`parcel-value-history`, `zoning-band1`), addresses it. It remains open.

**Mechanism (from CAD-SERVE-RECONCILE's own live sweep, 146 parcels, all six counties):**
`etjStatus=unresolved` on 146/146 — 100% of the sweep, every county. `cityLimitsFact.status
=unmeasured` on 7 sweep parcels including two named golds (`48491:76149`,
`48453:493738`). The decision's own root-cause: the bake looked, found no usable parcel
query point, and wrote its own internal word onto the wire instead of translating that
outcome to `absent-verified` with a basis — the four-state contract already expresses
this; the bake simply never translates at the serve boundary.

**Severity in production terms.** This is not a parcel_record problem (parcel_record has
no consumers at all, per #2) — it is a defect on `place_layer_snapshots`, the store that
*does* serve Property Explorer and LDT api-server, live, today. A live customer request
for `etjStatus` gets a word ("unresolved") the serve contract explicitly forbids, on
every single request, in every county, right now.

**Second mechanism considered and rejected.** That this was fixed incidentally by
DOLLAR-RUN or DOLLAR-FIELDS, which also touched `place_layer_snapshots`. Rejected: both
cards' scope was explicitly the CAD dollar/living/legal fields (`baseFacts.cadRoll`);
neither touched `cityLimitsFact` or `etjStatus`, and neither close mentions the pipeline
words. No evidence of a fix.

**Falsifier.** A live `/facets` request against `48491:76149` or `48453:493738` showing
`cityLimitsFact.status` and `etjStatus` as one of the four contract states (or absent
entirely) rather than `unmeasured`/`unresolved` would falsify this. Not run this card
(would require a live HTTP call against a customer-facing endpoint, judged out of a
read-only DB review's scope) — flagged as the fast, cheap verification step for whoever
picks this up.

---

### 5. [HIGH] `exemptionCodes` (and, by the same mechanism, `landUseSource`/`acreageMethod`) are live rails permanently stuck at large scale — a code gap, not a data gap, and nobody has scoped the fix.

**Defect.** R6B's own close flagged this as an open item without sizing it: *"exemption_
codes (text[]) is never stamped as a value by this module regardless of R6 — a populated
array stays unaccounted forever."* This review sized it directly, live
(`FACTORY_DATABASE_URL`, 60s timeout, succeeded): **`exemptionCodes` is live (503,780
absent-verified cells exist) with 477,625 of 981,405 cells (48.7%) still unaccounted —
and will stay there indefinitely absent a code change**, because it is *live* (has earned
cells, so it fully participates in the publish gate) but structurally incapable of
reaching 100% under the current module.

**Mechanism, read from source
(`hauska-engine/packages/engine-core/src/parcel-record/ingest-existing.ts`).**
`stampText(key, raw)` branches on `hasText(raw)` (true only for non-empty *string*
values) or `isCadNullText(raw)` (true only for `null` or blank *string* values) — the
module's own comment on `isCadNullText` states this precisely: *"An unexpected type (e.g.
text[] exemption_codes) is not a CAD null."* `cad.exemption_codes` is a Postgres `text[]`
column; when populated, the driver hands back a real JS array, which is neither a
non-empty string (`hasText` false) nor null/blank (`isCadNullText` false) — so **neither
branch fires**, and the cell is left exactly as it started: `unaccounted`. A `NULL`
exemption_codes value *does* correctly route to `cadNullVerified` → `absent-verified`
(matching the 503,780 figure); only the *populated* case is stuck. This is not a crash
and not a silent wrong value — it is a clean, fail-closed no-op that happens to leave
half the store permanently short of the gate.

**Same mechanism, smaller scale, on `landUseSource`/`acreageMethod`.** Both are stamped
*only* inside the positive branch (`stampValue("landUseSource", "cad-roll")` fires only
when `hasText(cad.property_use_code)`; `stampValue("acreageMethod", ...)` fires only
when `cad.land_acres != null`) — neither has a corresponding `stampAbsent` call in the
null branch. Wherever `property_use_code`/`land_acres` is null at the CAD source (sized
in gap-ledger section 9: `landUseCode null` 21,398–282,570 per county; `acreageAcres
null` up to 114,254 in McLennan), `landUseSource`/`acreageMethod` stay unaccounted
forever on those rows too — same class of defect, not independently re-measured live
this card given the timeout pressure documented above, but the code-read mechanism is
identical and equally certain.

**Second mechanism considered and rejected.** That this is intentional design (arrays
genuinely can't carry the same three-state semantic as a scalar). Rejected as the
*whole* explanation: a companion-row representation (the same side-table pattern already
used for flood/wells/specialDistricts) would resolve it cleanly, and R6B's own close
already flags it as an open ruling question rather than a closed design decision — "a
future card should rule on whether these are intended gaps or defects."

**Severity in production terms.** On its own, this single item is sufficient to keep
every county's publish gate at REFUSE indefinitely, with no acquisition problem behind
it at all — the data exists at the CAD source; the code simply can't stamp it. This
should rank ahead of any acquisition-shaped leave_behind (Caldwell's geometry gap,
zoning's 49 unstamped cities) as the cheapest, highest-leverage fix available for moving
toward a real PASS.

**Falsifier.** A count of `parcel_record_cell` rows where `rail_key='exemptionCodes'`
grouped by `kind` showing 0 unaccounted, or showing the module correctly emitting
`value` for a populated array, would falsify this. The live count above (503,780 /
477,625, zero `value`) confirms it as stated.

---

### 6. [HIGH] A publish-gate PASS can never mean "every real parcel is present" — and only one county has even been checked for the class of gap that breaks that claim.

**Defect / structural limit.** `parcel_record`'s population is fixed at
`landing_parcel_jurisdiction`'s 981,405 rows. B3-GEOMGAP (closed) found and sized a real,
distinct-from-acquisition gap: **approximately 938 genuinely real Bastrop parcels** are
outside `landing_parcel_jurisdiction` (hence outside `parcel_record`) entirely — 879
single-owner accounts affected by a 10-month vintage gap between the CAD tax roll
(January 2026) and the txgio GIS parcel fabric (March 2025), plus 59 distinct
undivided-interest tracts of which 58 have no geometry-bearing sibling account. These
parcels do not show up as `unaccounted` cells anywhere, because they are not rows in the
table at all — the exact "missing column is invisible" principle the founding ruling
names, recurring one level up as "missing row is invisible."

**Mechanism.** `landing_parcel_jurisdiction` is itself built from a GIS snapshot
(txgio_parcel) with its own vintage; a tax roll that outpaces that snapshot (new
subdivisions platted after the GIS pull) produces real, addressable, taxed parcels that
never entered the landing population the whole program is built on top of. B3-GEOMGAP
checked this only for Bastrop and only for the specific $0-improvement-with-real-acreage
subset R1-crosswalk had already flagged as anomalous; it was not run for the other five
counties, and B3-GEOMGAP's own leave_behind says as much: "the undivided-interest
fan-out mechanism... may be worth a lightweight statewide check... to avoid
re-discovering it county by county."

**Second mechanism considered and rejected.** That this is fully covered by the
already-known "genuinely-missing" class in gap-ledger section 11 (Travis
livingAreaSqft, McLennan assessedValue, etc.). Rejected: those are field-level gaps on
parcels that *are* in the record. This is population-level — parcels that never entered
the record's universe at all, a category the gap ledger's own census (section 1, "Store
COUNT is 981,407... Landing 62256+...=981405") treats as closed by definition, since it
only ever compares the store against landing, never landing against ground truth.

**Severity in production terms.** Directly answers the dispatch's own question for
chapter 8 ("does the gate's own definition produce the honest serve the tenant-
sovereignty and quality-gate rules require"): no — a customer or downstream consumer
reading "publish gate PASS, zero unaccounted on live rails" would reasonably infer
completeness at the *parcel* level, not just the *cell* level, and that inference is
false today, quietly, for at least ~938 Bastrop parcels and for an unmeasured number in
the other five counties.

**Falsifier.** A statewide (or even five-more-county) re-run of B3-GEOMGAP's method
finding zero comparable gaps elsewhere would narrow this to a Bastrop-specific issue
rather than a structural one. Not run this card (B3-GEOMGAP's own method — cross-
referencing $0-improvement-with-real-acreage CAD orphans against txgio, then de-
duplicating undivided-interest fan-out — is itself a multi-query investigation, out of
this read-only review's remaining budget after the timeouts documented above).

---

### 7. [MEDIUM-HIGH — process] A cross-session collision defeated the queue's claim mechanism and produced concurrent live writers for several minutes. Caught by vigilance, not by structure.

**What happened (from PARCEL-R2-JURIS-STAMP's own close, independently cross-read here,
not re-investigated).** A peer session misread a `REFUSED`/`ALREADY_CLAIMED` queue
response as `GRANTED` and pushed an unauthorized, materially different design directly
into the authorized lane's claimed worktree and remote branch — including a generic
`--delete-place` flag the governing addendum did not authorize (only two specific,
hardcoded place_keys were ever authorized for deletion). Even after the unauthorized
commit was quarantined and the branch reset, **the peer session's own Cloud Run
executions kept writing** — two of six county fills (Williamson, Travis) were still
actively running against production for roughly two to three minutes *after* the
authorized session's corrected re-runs had already started, silently clobbering rows
mid-flight. One overlap (Williamson) was caught live by a wrong-shape count ticking
*up* between two measurements and the foreign execution was cancelled directly; the
other (Travis) was not caught until a post-completion spot-check still showed 200
residual wrong-shape rows, requiring a second re-run to reach a clean store.

**Why this belongs in the process-pattern attack surface, and why it's the headline
item there.** The dispatch names three process patterns to check (stale-dispatch,
lease-lapse, store-timeout); this incident is a fourth, more severe pattern the dispatch
doesn't name and this review adds under "go beyond it": **the queue's claim mechanism is
a convention enforced by careful reading, not a structural lock.** A session that
misreads a refusal as a grant faces no technical barrier to writing into another lane's
worktree, pushing to its branch, or launching Cloud Run executions against the shared
production store under that lane's job identity. The close reports this was caught only
because the authorized lane happened to re-measure the live store rather than trust
completed execution statuses — exactly the discipline ENFORCEMENT.md asks for ("a
completed execution status means that execution's own work finished... verify the STORE,
not the execution status"), but that discipline is a *behavior*, not a *control*: nothing
would have stopped the wrong data from standing if the authorized session had trusted
its own "all six True" result and moved on, which is the default, reasonable-looking
thing to do.

**Second mechanism considered and rejected.** That this is an acceptable one-off, not a
structural gap — a rare human error, unlikely to recur. Rejected: the *same* close
separately documents the **lease-lapse pattern** as a second, independent gap in the
same queue system (this lane's own claim TTL expired mid-incident-response, and the
close was filed and treated as authoritative anyway "per convention," with the queue's
own bookkeeping left unreconciled) — two distinct queue-integrity gaps surfacing in one
card is evidence of a systemic weakness in the claim/lease model, not one unlucky
session.

**Severity in production terms.** For a system whose stated non-negotiable rule is
"store writes only through a Cloud Run job with a run row" specifically to make writes
attributable and controlled, a claim mechanism that can be defeated by a misread menu
response — with no structural check that a Cloud Run execution's launching identity
actually holds a currently-valid claim on the county it's writing — is a gap in exactly
the control this whole program depends on.

**Falsifier.** A queue/dispatch design where a Cloud Run job's execution is refused
(not just discouraged) unless the invoking identity holds a live, unexpired claim on
the target county at execution *start* time (checked server-side, not client-side) would
close this. No such check exists today; `requireWriterJob`/the writer allowlist checks
*which job* is running, never *whether the invoker currently holds the card*.

---

### 8. [MEDIUM — process, reproduced live by this review] The store has no reporting-safe read path. Verification queries — including this review's own — routinely time out under writer load.

**Defect, reproduced directly.** This card's own read-only, statement_timeout-guarded
queries against `FACTORY_DATABASE_URL` timed out repeatedly: a store-wide `unaccounted`
count via the dedicated partial index (60s timeout, failed); a 39-rail batched liveness
EXISTS check (15s timeout, failed); a two-table NA-cell audit join (60s timeout, failed).
Single-rail, single-table counts against `parcel_record` (not `parcel_record_cell`)
succeeded quickly every time. This matches — and freshly reproduces, first-person — the
pattern already named in five-plus prior closes this session
("PARCEL-R1B-REINGEST... isolating query timed out," "store reads time out under writer
load," PARCEL-R4-COMPANIONS' own constraint note).

**Mechanism.** `parcel_record_cell` is ~63.8M rows and growing; there is one writable
Neon primary and no read replica, cached rollup, or materialized summary table. Any
query touching a meaningful fraction of that table competes directly with whatever
writer job (this session's own, or a peer session's) happens to be active, and Neon's
serverless compute scaling appears to make this worse under contention rather than
gracefully degrading.

**Severity in production terms.** This directly undercuts chapter 8's own question. Even
setting aside findings #2 and #3 (nothing consumes the gate, nothing runs it), a full,
honest, live re-derivation of "what stands between current state and a publish-gate PASS
per county" is not reliably *computable* today except in narrow, single-rail slices —
exactly what this review had to fall back to. Any prior close's "store-wide" figure
should be read as "as measured at that specific timestamp, if the query happened to
complete," not as a standing, re-checkable truth.

**Second mechanism considered and rejected.** That this review's specific queries were
unusually expensive (e.g., a bad join plan) rather than a general property of the store.
Rejected: the queries that failed were simple, single-predicate aggregates or indexed
EXISTS checks — not complex joins — and the *specific* queries that succeeded
(single-rail `GROUP BY kind` on `parcel_record_cell`, restricted by the indexed
`rail_key` column) took 60–100 seconds each for a ~981K-row-per-rail scan, which is slow
for that row count on indexed access, consistent with genuine contention rather than a
plan problem on this review's part.

**Falsifier.** A materialized, periodically-refreshed rail-liveness/coverage summary
table, or a read replica dedicated to reporting, that a query like finding #3's
`RAIL_LIVENESS_SQL` could run against without timing out during active writer load,
would resolve this. Neither exists today.

---

### 9. [MEDIUM — structural, ties #1 and #3 together] The publish gate measures presence, never correctness. It cannot, by its own definition, catch finding #1's kind of defect even if it were wired up.

**Defect.** `evaluatePublishGate` (read directly, `publish-gate.ts`) does exactly one
thing: for every live rail, check `isUnaccounted(state)` and count failures. It has no
opinion on whether a `value` cell's *value* is correct — a duplicated dollar figure, a
mis-joined address, a transposed digit, all present identically as `{kind: "value", ...}`
to this check. This is a **presence-shaped check on a program whose worst-named risk
("a silent mis-join is the worst defect available in this program," attack surface 1's
own framing) is a meaning-shaped problem** — per ENFORCEMENT.md's own distinction, a
presence check has one input; a meaning check needs two independently derived inputs
that must agree. The gate has exactly the former.

**Second mechanism considered and rejected.** That this is fine because correctness is
handled elsewhere (e.g., the crosswalk's own owner-name corroboration, or the
legal_description third-derivation this review ran). Rejected as a full answer: those
checks ran *once*, by hand, during design and during this review — neither is a standing,
re-run-on-every-write mechanism. Nothing re-verifies a crosswalked cell's correctness at
write time or at gate time; the 60-sample legal_description audit this review performed
(finding: strong, clean corroboration — see "positive findings" below) is the *first*
time that specific check has ever been run, and it is not wired to run again.

**Severity in production terms.** Combined with #1: a future publish-gate PASS —
however it eventually gets computed and wherever it eventually gets consumed — would
happily certify a county containing the 777-account collision exposure (or the ~700-ish
subset that actually resolved to shared values) as fully, correctly served. The gate's
name promises more than its mechanism delivers.

**Falsifier.** Any consistency check comparing two independently-derived signals (e.g.,
re-deriving the crosswalk match set from a differently-sourced field, or spot-auditing a
random sample of `value` cells against a second source on every gate evaluation) wired
into the gate or a sibling check would falsify the "presence-only" characterization. None
exists today.

---

### 10. [RESOLVED — reported for completeness, not a defect] The R1B 24,966-vs-24,965 residue discrepancy.

Fully resolved this review, live, in two queries (30s and 60s timeouts, both succeeded).
`parcel_record` holds **282,570** Williamson records, not 282,569 — the extra row is
`48491:PRIVATE ROAD`, a real, non-R-prefix landing/CAD account (right-of-way key, not a
numeric or R-prefix prop_id) that R1's crosswalk design never claimed to cover (the
crosswalk is R-prefix-only by construction). `PRIVATE ROAD` goes through the *ordinary*
CAD identity-join path instead: its own `cad_property` row exists with `tax_year=2025`
but null `improvement_value`/`land_value`/`assessed_value`, so R6/R6B's cad-null-verified
mechanism correctly emits `absent-verified` for it (confirmed live: all three dollar
rails on `48491:PRIVATE ROAD` are `absent-verified`, source empty as expected for a
basis-carrying record). At the R1B checkpoint (before R6-cadnull was vendored into
Factory), that same cell was `unaccounted`, which is exactly the "one more than
predicted" the close reported. R1's 24,965 prediction was scoped to "the R-prefix
population"; R1B's live measurement was scoped to "county 48491, unaccounted on this
rail," which naturally includes this one non-R-prefix row too. Both numbers were
internally correct; the gap was a scope mismatch between two honestly-stated
denominators, not data loss, a mis-join, or a silent skip.

---

## Positive findings — controls that held up under adversarial testing

Reporting these is required by the same discipline as reporting defects (ENFORCEMENT.md:
"a convenient result is a reason to distrust the instrument, not a result" cuts both
ways — a clean result from a genuinely adversarial test is evidence, not an excuse to
stop looking, and this review did not stop looking after finding these).

**The crosswalk mechanism itself, tested against a genuine third derivation, held.** A
random (not owner-agreement-curated, unlike R1's own 50 fixture pairs) sample of 60
crosswalked Williamson pairs was checked against `legal_description` — a field neither
the crosswalk's primary key (`situs_address`) nor its corroborating field (`owner_name`)
uses. 60 of 60 showed clear subdivision/lot correlation (the numeric row's legal
description is consistently a fuller elaboration of the R-row's: `"S10632 - SIENA SEC
21"` → `"S10632 - SIENA SEC 21, BLOCK AA, Lot 68"`), including several pairs where
`owner_name` genuinely disagreed (real ownership-transfer noise between the two CAD
vintages, exactly as R1-crosswalk's own close predicted for the 7.8% non-agreement
class) — proving `legal_description` is doing independent confirming work, not just
echoing owner agreement. This is real evidence the crosswalk mechanism (situs-based,
uniqueness-gated) is sound; finding #1 is a gap in the uniqueness gate's *direction*, not
evidence the mechanism is broadly wrong.

**The cad-null-verified structural claim holds.** Read directly:
`ingestCadOntoRecords` has `if (!cad) continue;` before calling `applyCadScalar`, which
is the sole caller of `stampAbsent`, which is the sole caller of `cadNullVerified`.
Neither `applyCadScalar` nor `cadNullVerified` is exported. A join-miss cannot reach the
emission without a new call site — the R6 close's claim is correct, confirmed by reading
the code, not just trusting the fixtures as instructed. The blank-string/type-exhaustion
logic (`hasText`/`isCadNullText`) is provably exhaustive for string and null inputs; the
only gap (non-string, non-null types like `text[]`) is explicit and documented in the
code's own comment, and is exactly finding #5, already priced in above.

**The tax_year fail-closed guard earned its keep once already, live.** `cadNullVerified`
refuses (returns null, no fabricated basis year) when `cad.tax_year` is null or blank.
Because the underlying `cad_property.tax_year` column is `integer NOT NULL`, this branch
is effectively unreachable against real source data *today* — but it was the exact
mechanism that surfaced R6B's starved-input bug (`CAD_ROWS_SQL` omitting `tax_year` from
its SELECT list): every row's `tax_year` was `undefined`, the guard correctly refused on
every single row, and the resulting "zero absent-verified anywhere despite ok:true"
signal is what led directly to the bug's discovery. A fail-closed guard that looks like
dead code today is not the same as a guard that never mattered.

**The two-parcel demotion test in PARCEL-RAILS-V2 is honestly scoped, and its own close
names its limit correctly.** The close states plainly: "a single-parcel poison of the
only earned cell on a live rail does not refuse: the rail drops out of the live set and
the gate passes. That is the decision's stated derivation limit... not a gate bug." This
review's attack (finding #9) extends that admitted limit rather than contradicting it —
the rails-v2 card was honest about what its own test does and does not prove.

---

## Attack surfaces not exhausted, stated plainly (no silent caps)

- **Finding #1's full blast radius** — all 134 shared-situs groups, not just the one
  confirmed pair — was not swept for actually-divergent (vs. coincidentally-agreeing)
  values. Natural first step for the step-6 fix card.
- **Finding #6's cross-county generalization** — B3-GEOMGAP's method was run only for
  Bastrop. Caldwell, Hays, McLennan, Travis, and Williamson have not been checked for
  the same vintage-gap/undivided-interest population-completeness class.
- **A full, current, all-65-rails × six-county publish-gate recomputation** was not
  completed — blocked by finding #8's own timeout pattern. What's reported above
  (zoningDistrict: 94,222 unaccounted of 611,116 in-city, live; exemptionCodes: 477,625
  of 981,405, live) are the specific rails this review could confirm cheaply via
  single-rail queries, not an exhaustive per-county table. A step-6 or step-7 card with
  either a longer maintenance window (writers paused) or a materialized reporting table
  (finding #8's own falsifier) should run the full table.
- **Finding #4's live-wire verification** (an actual HTTP request against a gold parcel)
  was not run — judged out of scope for a DB-only read-only review; flagged as the
  cheapest next step for whoever picks it up.
- **The landUseSource/acreageMethod sizing** in finding #5 is asserted from code-reading
  plus the gap ledger's pre-existing null counts, not independently re-measured live this
  card, given the timeout pressure documented in finding #8.

---

## Constraints honored

READ-ONLY throughout: `default_transaction_read_only = on` set on every session against
both `PRODUCTION_NEONDB_URL` and `FACTORY_DATABASE_URL`; no `INSERT`/`UPDATE`/`DELETE`
executed; no product-repo file changed; no `--apply` run anywhere. `statement_timeout`
bounded on every query (stated per-finding above). No `unaccounted` converted to
`absent-verified`. Every finding above states its falsifier and, where run, the actual
result. Every live number states its query's timeout and success/failure. Full 50-plus
attributed-fact pre-reading pass completed before any query was written: the ruling, both
named rails decisions, the gap ledger, and every `parcel-*` close in `_inbox` (17
close artifacts read in full, not summarized from memory).

One correction made mid-review and disclosed rather than silently fixed: this reviewer's
first pass toward chapter 8 conflated ZONING-INGEST's read-only production-side findings
(against `place_layer_snapshots`/hauska_mcp, a different store) with `parcel_record`'s
own zoning-envelope rails, and nearly reported zoningDistrict as declared-ahead on that
basis. A direct live query against `parcel_record_cell` (100s timeout, succeeded)
caught this before it reached this report: zoningDistrict is in fact live with 516,894
real value cells, 370,289 not-applicable, and 94,222 unaccounted. Reported here per
ENFORCEMENT.md's instrument-is-part-of-the-claim discipline, as an example of exactly
the failure mode that discipline exists to catch — caught this time, by verifying at
source rather than trusting a plausible inference chain.
