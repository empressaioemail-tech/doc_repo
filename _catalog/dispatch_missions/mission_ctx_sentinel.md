# CTX-SENTINEL — a family of rows that are not parcels, and nobody has counted them

Repo: `legacy-design-tools`. **Measurement lane. A code diff is not expected and shipping
nothing is a valid close.** Two prior lanes in this fleet correctly committed nothing and
said so; do the same if that is the honest outcome.

## Why this exists

Caldwell's staging walk has failed on one parcel through every run today:
`48055:1`, HTTP 422, `SITUS_PUNCTUATION_ONLY`, refused at the serve guard before any
payload exists. CTX-WALKRULE diagnosed it precisely and stated its own fix could not clear
it. A later prediction that CTX-SITUS-SKIP would clear it as a side effect was wrong: the
bake changed, the serve guard did not.

Along the way, three separate lanes found pieces of what looks like one family and none was
scoped to count it:

- **CTX-RETIRE:** `txgio_parcel` holds **203 distinct features sharing `prop_id` `'1'`** in
  Caldwell, and **227 sharing `'0'`**. Almost certainly sentinel or bucket ids from the
  `stratmap25-landparcels` ingest rather than real CAD account identities. It also found
  that `48055:1`'s served acreage (195.2 from a shoelace over whichever of the 203 features
  the join picked first) does not match the 7.025 the dispatch had stated.
- **CTX-ACREAGE:** `48491:PRIVATE ROAD` — a literal string where a `prop_id` belongs,
  returning HTTP 400. Confirmed a lineage artifact at both the landing and serving stores,
  with the graft and walk-parsing hypotheses rejected by direct query.
- **CTX-HAYS-SPLIT:** StratMap rows were grafted into `cad_property` and **overwrote
  `source_file` in place** on roughly 75,551 existing rows, so lineage is not reliably
  readable from that column alone. It recovered genuine CAD rows from under the StratMap tag
  using `assessed_value IS NOT NULL`.

Each of those is a single instance reported honestly. **Nobody has asked how many there
are.**

## The question

**What is the population of rows in the six Central Texas counties that are not
well-formed parcel accounts?** Counted, with a stated counting rule and a predicate control
proving the query can return a non-zero answer for a population you did not target.

Candidate members of the family, and you must establish whether they are actually one family
or several:

- a `prop_id` that is not a numeric or R-prefixed account identifier at all
  (`PRIVATE ROAD` is the known case);
- a `prop_id` shared by many `txgio_parcel` features, which is a bucket id rather than a
  parcel (`'1'` at 203, `'0'` at 227 in Caldwell);
- a row whose situs is punctuation-only **and** which has no other CAD signal;
- rows whose `source_file` says StratMap and which carry no `assessed_value`,
  `exemption_codes` or `living_area_sqft` — the shape CTX-HAYS-SPLIT used to separate
  38,060 geometry-only rows from 384 genuine CAD accounts in Hays.

**Do not assume these are one class.** State which criteria co-occur and which are
independent. If they turn out to be three unrelated populations, that is the finding and it
is more useful than a single number.

## Then, and only then, the disposition question

For whatever population you find, what is the honest treatment? You are recommending, not
implementing.

The options this fleet has already established, so you argue against real alternatives:

- **A declared non-account state.** These rows are in the store because we hold geometry for
  them, not because an appraisal district ever assessed them. That is a legitimate permanent
  condition, not a gap.
- **`recordRetirement`.** Already ruled inappropriate for the Hays geometry-only population,
  because it asserts an account left a roll and these were never on one. The same reasoning
  probably applies here; confirm or refute it rather than inheriting it.
- **Exclusion from the walk cohort.** **Argue this one carefully.** Two lanes deliberately
  refused to tune the ascending-`prop_id` sampler on the grounds that adjusting a sampler to
  avoid a failure it correctly found is sampling around the problem. If your recommendation
  is exclusion, it must be a named class with a counting rule and a written justification,
  never a filter, and you must say why it is not the same mistake.
- **Data correction.** CTX-LEAVES2 wrote but did not run a correction script for the single
  `PRIVATE ROAD` row. If the population is small and genuinely erroneous, that may
  generalise; if it is large, it almost certainly does not.

## The serve-guard question, which is separate

`48055:1` fails at `refusePayloadAtServe` / `assertSitusNotPunctuationOnly`, throwing before
`snapshot` is produced, so the handler returns 422 and no body exists for the walk to grade.

That guard is correct — it exists because this program was serving `", ,"` as an address.
The question is not whether to weaken it. The question is **what a customer should see when
they request a parcel that is not an account**, and whether a bare 422 is the honest answer
or whether it should be a declared refusal with a reason, as the layer-absence contract does
elsewhere.

There is prior art: `_inbox/2026-09-03_pe_refusal_contract_split.md` names a legibility gap
between the Doc-19 layer-absence chip contract and the bare `atom-miss` refusal used by
several fact reads. This may be the same gap at the parcel level. Read that finding and say
whether it is the same class.

## What you must NOT do

Do not weaken `PUNCTUATION_ONLY_RE`, `assertSitusNotPunctuationOnly`, or any serve guard.

Do not write, delete or correct any row. This lane measures.

Do not deploy, submit a Cloud Build, or run any Cloud Run job, bake, publish or walk. A
read-only query and an HTTP read of a served payload are expected and are not executions.

Do not write to `hauska-factory`, `hauska-engine` or `hauska-map`. If the fix belongs in
one, report it precisely enough to dispatch.

## Traps carried forward, all paid for today

`parcel_record_cell.place_key` is `<fips>:<prop_id>`. `place_layer_snapshots.place_key` is
`node:<fips>:<prop_id>`. Two tables, two shapes.

`runs` has `started_at`, not `created_at`.

`parcel_gate_verdict` carries an `evaluated_at` and is a **cached** evaluation. A verdict
read during a write is meaningless; check the timestamp.

Unscoped scans on `parcel_record_cell` time out. Scope by prefix, `rail_key` or
`updated_at`, and set `statement_timeout`.

`txgio_parcel` carries multiple geometry rows per `prop_id` (48021: 74,729 rows against
62,257 distinct). Per-parcel `EXISTS` aggregation, never a flat join.

`source_file` was overwritten in place by the StratMap graft, so it is not a reliable
lineage field on its own.

## Close contract

Standard lane close JSON, plus:

- The population, per county and total, with counting rule and predicate control.
- Whether the candidate criteria are one family or several, with the co-occurrence evidence.
- Your recommended disposition, with the alternatives you rejected and why.
- Whether the 422 legibility question is the same class as the 2026-09-03 refusal-contract
  split.
- If a fix is warranted: where, precisely enough to dispatch.
- `leave_behind`.
