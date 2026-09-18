## Mission — P-359: an ETJ ring that swallows its own city is a drawing convention, not an answer

You launch no sub-agents (FAN-DEPTH 0). You build in `legacy-design-tools` only and open one PR,
branched from current `origin/main` with the SHA declared (`25d1782f` at compile). You do not merge,
deploy, re-ingest or write any store; the integration seat does all four. Any doc_repo change is
handed back as a diff in your close.

### What P-332 measured (`_inbox/2026-09-18_p332-etj-panel_close.json`, validated run)

Of 611,116 in-city parcels in the six counties, 77,459 (12.67 percent) sit inside an ETJ ring of their
own city, so the panel's rule serves them `conflicting` (city limits `incorporated`, ETJ `present`).
The split is the finding:

- **75,299 (97.2 percent) sit in a ring whose polygon overlaps the city's own limits.** Decisive test:
  exactly three published rings contain their own city's representative point
  (`ST_PointOnSurface(tx_city_boundary.geometry)`): `georgetown-tx:9644`, `leander-tx:1`,
  `dripping-springs-tx:1`. Their full-ring counts equal about 100 percent of their own in-city
  parcels (Georgetown 39,015 of 39,015; Leander 31,755 of 31,779; Dripping Springs 4,015 of 4,016).
  An ETJ is by definition outside city limits, so this is a property of the polygon: those publishers
  drew one shape for "city plus ETJ". Every ring of every other city fails the test.
- **2,160 (0.35 percent of in-city) sit inside a ring that genuinely lies outside the city's limits.**
  There two independently derived reads really disagree (e.g. `48453:134392`: the jurisdiction row
  reads in-city Austin, the ring reads Austin's 2-mile ETJ). Which read is wrong is a separate
  store-ownership question. This row does not decide it, and `conflicting` stays correct for them.
- **24 of 355 rings are invalid** (`ST_IsValid` false: ring self-intersection, nested shells, hole
  outside shell), named in full in that close's `leave_behind`. `ST_Contains` against an invalid
  polygon is undefined in GEOS; the validated run applied `ST_MakeValid` and the counts moved for
  exactly the cities owning invalid rings (Liberty Hill 527 to 47, Kyle 828 to 816, Elgin 65 to 42,
  Hutto 51 to 31).
- P-332 measured same-city co-occurrence only; cross-city pairs (a parcel in city A inside city B's
  ring) were excluded by its join and are unmeasured, not zero.

Do not cite `_p332_etj_results.UNTRUSTWORTHY-inflated.txt`; P-332 found it wrong by two orders of
magnitude on Austin.

### Where the rings live (LDT at `25d1782f`)

`tx_etj_boundary` (`lib/db/src/schema/txEtjBoundary.ts`, migration `0102`), ingested by
`lib/cad-ingest/src/boundary/etjIngest.ts` / `etjParse.ts` / `etjRegistry.ts` / `etjVerify.ts`, read by
`lib/cad-ingest/src/boundary/etjFact.ts` and `containment.ts`, and served through cortex's
`artifacts/api-server/src/lib/etjFactRead.ts` (the P-296 determination the panel reads).

### What to build

1. **Self-containing rings.** Detect, at ingest and by the same decisive test, a published ring that
   contains its own city's limits. Keep the publisher's geometry verbatim and serve a derived geometry,
   the ring minus the city's limits, with the derivation recorded on the row (what was subtracted,
   which city boundary and its vintage). If a ring cannot be cleanly derived, declare it (the
   determination says the ring was withheld and why) rather than serving a blanket `present`.
2. **Invalid rings.** Repair with `ST_MakeValid` and record the repair on the row (the reason
   `ST_IsValid` gave, the repaired validity, the area before and after), or exclude and declare. A
   repair that moves the area by more than a declared tolerance is excluded and declared, not served.
   The serve path must never run containment against an invalid polygon: make that a refusal in the
   reader, not a hope about the store.
3. **The re-count.** After your change, re-count same-city co-occurrence AND cross-city co-occurrence
   in the six counties (a dry run against the derived geometry, read-only, heavy-scan lease), with the
   validated method P-332 used (materialized CTEs, `ST_MakeValid`, the ring's own `city_name` for the
   join, not a normalized `city_key`, which silently dropped Bastrop). Predict first: the
   self-containing publishers' 74,785 should fall to about their strip-only counts (Georgetown 125,
   Leander 111, Dripping Springs 173).
4. **Downstream.** P-336 (in flight) writes the `etjStatus` ledger cells from the same determination.
   Say which cells your change would move once re-ingested, so the seat can order the re-ingest before
   or after P-336's apply and re-run the one that goes first.

### Verify by violation

Pre-register your falsifiers. Fixtures: a ring that contains its city (served minus the city; a parcel
in the city reads `absent` for that ring, a parcel in the strip reads `present`); a genuine strip ring
(unchanged); an invalid ring (repaired and recorded, or excluded and declared, never read raw); a
repair past the tolerance (excluded). Show each on the pre-change code where it should fail. Then the
dry-run re-count beside an independent query that does not use your derivation code.

### The three-question gate

Answer in your close: what executes the derivation and the validity refusal, what triggers them (an
ingest run; say what happens to a ring published after this change), what fails when a
self-containing or invalid ring reaches the reader, and what bypasses it (a raw insert into
`tx_etj_boundary`, a reader that does not go through `etjFact.ts`).

### Constraints

- No store writes, no re-ingest, no deploys, no merges.
- LDT lanes in flight this wave: P-351 (bake retirement), P-354 (Georgetown dates), P-339 to P-341's
  LDT half, P-270's address half. Stay inside the ETJ ingest and read path; name any shared file.
- The 2,160 genuine disagreements are not yours to resolve; report their count after your change.

### Close

Declare: the start commit and PR, the derivation and repair records' shape, the per-ring table (which
rings were derived, repaired or excluded, with areas), the re-count against your prediction and the
independent query, the cells P-336 would see move, the falsifiers with both directions shown, the
three-question gate answers, and `leave_behind`.
