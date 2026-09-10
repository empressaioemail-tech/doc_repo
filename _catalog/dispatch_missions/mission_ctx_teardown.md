# CTX-TEARDOWN — tear apart the integration seat's thesis for getting CTX to production

**You are an adversarial reviewer. Your job is to break the argument below, not to help
build it.** A close that says "this looks right" is a failed close. If the thesis survives
you, it survives because you could not break it, not because you agreed with it.

Read-only. No repo writes, no deploys, no job runs. Your output is a verdict and a list of
defects in the reasoning.

## Calibrate on the author first

The integration seat wrote this thesis. Its measured error record for 2026-09-09/10, kept
because it should change how much weight you give any unsupported claim below:

- **Seven wrong data-shape assumptions**, each corrected only by hitting an error: the
  wrong Dockerfile for an engine-api build; a premature all-clear on an image that then
  existed; an incomplete Cloud Run argument set that silently dropped `--gold`; `place_key`
  assumed as `node:<fips>:<prop_id>` when `parcel_record_cell` uses `<fips>:<prop_id>`;
  `runs.created_at` which is `started_at`; a `parcel_gate_verdict` read taken mid-write and
  nearly reported as a partial failure; a gate verdict trusted as live when it is cached.
- **Four wrong dispatch premises**, each corrected by the lane it was sent to: `69de8fe6`
  declared urgent when it never reached the bake; the Elgin ceiling declared derivable from
  a staged table with no live consumer; CTX-SP pointed at the wrong spatial predicate; and
  worst, CTX-HAYS-GATE told that the geometry-only population "structurally cannot" cause
  the cadRoll refusal when **99.0 percent of it does**.
- **Two wrong predictions**: that the situs fix would clear Caldwell as a side effect, and
  that the zoning apply would move ~532 cells rather than 5,118.
- **One job assigned to itself at 09:00 and forgotten until 23:00.**

The common shape is reasoning from what a thing appears to be rather than reading it.
**Assume that shape is present somewhere in the thesis below and find it.**

## The thesis, stated so it can be attacked

### T1. Six counties are blocked by four remaining things, not six

    Bastrop      acreage class in the walk (fix merged, needs rebuild + re-run)
                 non-account population 62,257 (80% of county) — disposition unruled
    Travis       acreage class (same rebuild)
    Williamson   acreage class AND the unmeasured class — TWO different actions
    McLennan     passes 182/182 staging; HELD on the non-account question
    Caldwell     48055:1 serve-guard 422; needs a re-bake per CTX-SENTINEL
    Hays         cadRoll post-condition; fix named (tax-year scoping), not implemented

**Attack this first:** the seat has been wrong about "what is left" at every checkpoint
today. Each time it declared a county one step away, a second thing appeared behind the
first. Find the reason to expect that again rather than accepting the list.

### T2. Williamson needs a cortex-api deploy, not just a bake rebuild

CTX-PIN2 found only one of CTX-LEAVES2's three fixes reaches the bake's 26-module graph.
The acreage fix is in it; the `unmeasured`-to-`refused` fix and the prop_id guard are
grep-confirmed outside it, in LDT's live-serve and CAD-ingest code.

**Attack:** is a cortex-api deploy actually sufficient for the `unmeasured` half? Nobody has
traced that path end to end. The seat is asserting it from the negative finding.

### T3. The non-account population is the largest open question and it is about the product

176,512 of 1,187,370 rows across the six counties, concentrated entirely in Bastrop (62,257,
80 percent) and McLennan (114,255, **100 percent**). One family: StratMap source plus zero
CAD signal. 159,243 of them carry a normal-looking address and were invisible to every prior
lane because all of them looked for punctuation.

These rows carry land, market and improvement values sourced from **TxGIO/StratMap rather
than from the appraisal district's own export.**

**Attack hardest here.** Specifically:

- Is "zero CAD signal" the right frame at all, or is this a provenance-labelling question
  wearing an absence costume?
- McLennan is the county the seat called "the first one through" on a 182/182 walk **and**
  is 100 percent this population. Are those two facts compatible? If the walk grades content
  and the whole county is non-account geometry, what exactly did the walk verify?
- What is a customer actually being told today about a valuation on one of those parcels?
  The seat has NOT checked this. It is the question that matters most and it is unmeasured.
- CTX-SENTINEL recommends a declared non-account state mirroring `recordRetirement`. Is
  that honest, or does it convert a provenance problem into an absence problem and lose
  information?

### T4. The pipeline is now correct rather than capable, and that gap is not closing

Fleet memory records that of thirteen things a customer can ask a parcel, eight refuse, and
that eight of those refusals are independent of jurisdiction coverage. Today's work made the
product more honest, not more capable.

**Attack:** is that still true after today, or has it changed? CTX-FAMILIES wired six fact
families to the feasibility route. Nobody has re-measured the refusal count since.

### T5. What "production" requires, in the seat's view

1. Rebuild publish on the new pin; re-run Bastrop and Travis; both should clear the acreage
   class.
2. Deploy cortex-api; re-run Williamson.
3. Rule the non-account disposition; re-bake Caldwell; re-run.
4. Implement tax-year scoping on `CADROLL_EXPECTATION_SQL`; re-run Hays.
5. Promote all six from staging to production.

**Attack the sequencing and the omissions.** What is missing from this list? What in it is
optimistic? Which step has an unstated dependency? The seat believes step 5 is mechanical
and has never done it for a county that passed the corrected walk.

### T6. The claim the seat is least sure of

That the six defect classes found today are the whole set. Every one was invisible until the
one in front of it cleared. **The seat has no basis for believing the sixth is the last, and
states that explicitly.**

**Attack:** is there a structural reason to expect a seventh? Where would it live? What has
never been graded at all?

## What you must do

1. **Verify T1 through T6 against source and live state**, not against this document. Every
   number here traces to a lane close in `_inbox/2026-09-09_*` or `_inbox/2026-09-10_*`.
   Read the closes, not the summaries.
2. **Rank the defects in the reasoning** by how much they would cost if acted on.
3. **Name what the thesis omits.** The seat's error record shows it misses things by
   reasoning from shape; find the thing it has not thought to look at.
4. **Give a verdict on T5**: is that sequence sufficient to reach production, and if not,
   what is the real sequence?
5. **Answer T3's customer question if you can do it read-only.** What does a customer see
   today for a McLennan parcel? That is the single highest-value unmeasured fact.

## What you must NOT do

Do not fix anything. Do not write to any repo. Do not deploy, build, or run any job.

Do not accept a claim because it carries a number. Several numbers in this program have been
correct measurements of the wrong population — the 22.22 percent Hays figure, the 71 percent
sampled miss rate, the 48-versus-26 residue. Ask what population each number describes.

Do not stop at the first defect you find. The documented recurring failure here is stopping
at the first plausible explanation.

## Close contract

A verdict document, not a lane close JSON. It must contain:

- A ranked list of defects in the thesis, each with the evidence that establishes it.
- What the thesis omits entirely.
- Your own answer to T5: the real sequence to production.
- Your answer to T3's customer question, or a statement that it cannot be answered
  read-only and what it would take.
- Explicitly: which of T1 to T6 survived you, and why each survivor survived.
- `leave_behind`.

If you find nothing wrong, say so plainly and say what you checked — but be aware that the
prior probability of that is low, given the record above.
