# Step 7 scoping — a consumer for the parcel record

Planner packet for the operator, 2026-09-02. Input: the step-5 review
(`_inbox/2026-09-02_parcel_program_review.md`), whose findings #2 and #3 reframe the
prod question: the record is ahead of its consumer, the publish gate is dormant, and
no punch-list of cells matters until something reads the store and something runs the
gate. This packet proposes the consumer. Ruling reference:
`_decisions/2026-09-01_parcel_record_is_the_gate_to_everything.md` step 7.

## Where the record stands (measured 2026-09-02T16:16Z, live census)

63,791,325 cells on 981,405 parcels. Accounted 44.2 percent, up from 27.4 at fill time.

| state | cells | movement since fill |
|---|---|---|
| value | 17,129,557 | +6.3M (crosswalk, jurisdiction, flood, wells, districts, zoning, value-history) |
| absent-verified | 4,367,340 | +4.37M earned (cad-null semantic, sweep bases) |
| not-applicable | 6,665,202 | unchanged, exact 18 x 370,289 |
| unaccounted | 35,629,226 | -10.7M (down 23 percent) |

Serve-ready rails today (filled, verified, honest): CAD identity and dollars (six
counties, crosswalked), cityLimits (100 percent accounted), flood zone + floodway
(five counties at 99.5 percent match, Caldwell blocked on the geom backfill), wells,
specialDistricts, zoningDistrict (23 staged cities + the five stamp-gap cities at
98.78 percent), valueHistory (all six, rowCounts = landing exactly). Known-defect rail:
Williamson crosswalked dollars carry the S6 collision exposure (134 groups) until the
S6 card closes — its fix is in flight.

## The three options

**A. Full repoint.** The serve path (cortex/LDT compose + bake) reads parcel_record as
its source of record for every rail the record carries; old stores retired by decline.
Cleanest end state; largest change surface; gates the entire cutover on the slowest
rail and on gate wiring for all 65 rails at once. This is the destination, but as a
first move it maximizes time-to-first-consumer — the exact defect the review named.

**B. Staged per-rail augment (recommended).** The serve layer gains ONE parcel-record
reader; rails cut over individually, each cutover carrying its retirement item for the
old path in the same card (ENFORCEMENT retirement rule). The publish gate is wired
rail-scoped: a scheduled evaluation writes a per-county per-rail verdict, and the serve
allowlist consumes it — a rail serves from the record only where its verdict passes.
First cutover slate (already better in the record than on the old path): cityLimits/
jurisdiction, flood zone + floodway (with the reconciled point-on-surface rule the old
bake provably lacks), wells, specialDistricts, valueHistory (net-new capability, no old
path to retire). Second slate after S6 closes: the dollar rails. This ships a real
consumer fastest, makes the gate live with a real customer, and never serves a rail
the gate refuses.

**C. Report-surface-first accelerant (compatible with B).** The X-ray / Flood and
Drainage report generators read parcel_record directly as their data source before the
main serve path cuts over. A consumer exists within one card, exercises the record
end-to-end on the two GTM-live reports, and the wedge ships the reconciled flood rule
plus floodway detail immediately. Zero risk to the existing serve path.

## Gate wiring (decision inside the decision)

Cadence: scheduled (per-county, post-write-wave) rather than per-write (too hot) or
on-demand-only (dormancy reborn). Consumer of REFUSE: the serve allowlist above — a
refused rail-county simply keeps its old path (option B) or drops from the report
(option C), visibly. The verdict runs through the existing job harness with run rows,
and its excludedDeclaredAhead list publishes with every evaluation.

## What the operator decides

1. Option B, C, or both (recommendation: both — C immediately, B's first slate behind
   it; A remains the destination after slates prove out).
2. The first-slate rail list (proposed above; strike or add).
3. Whether the dollar rails wait for S6's close before entering any slate
   (recommendation: yes, hard requirement).

## What follows the decision (no action until it lands)

Cards: the reader + allowlist in the serve layer (LDT/cortex, property seat), the gate
scheduler job (factory), the C report-source card (if chosen), one retirement card per
cut-over rail, and the NFHL sibling-layer re-ingest (EFF_DATE + S_BFE, per scout-flood
— a re-ingest, not an acquisition) to deepen the flood rail before or during the slate.

## Late inputs from the cell-ledger close (2026-09-02)

The gate's DB loader now exists and is verified against one live county; the remaining
wiring choice belongs inside the gate-scheduler card: an engine CLI entrypoint the
Factory job shells out to, versus the Factory importing engine-core directly (the
engine-CLI form matches the existing job pattern and is the planner's default).
Loader cost is real: 101.5 seconds to materialize the smallest county's cells implies
25+ minutes for Travis single-shot — the option-B reader and the gate scheduler must
stream or batch per rail, never full-county-materialize.
