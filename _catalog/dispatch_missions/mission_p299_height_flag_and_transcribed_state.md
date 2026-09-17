## Mission — P-299: the height flag gets one meaning, transcribed sources get an honest state, no surface shows a placeholder height

You launch no sub-agents (FAN-DEPTH 0). Two repos, one lane: `hauska-setback-corpus` first, then
`legacy-design-tools`. You open PRs and do not deploy or publish; the integration seat merges,
publishes the corpus version and deploys LDT.

### The ruling you build (read it first)

`_decisions/2026-09-17_setback_corpus_flag_state_and_default_line_rulings.md`, rulings OT-1 and
OT-2 (operator, A-199). OT-10 (city-wide default lines) is P-300, not you. OT-3 is a worklist
change, not you.

### Where you work

Fresh clones from `origin/main` under `P:/tmp/` into NEW directories, branch
`fix/p299-height-flag-and-state` in each. Declare both start commits (corpus main `fc4a25e`,
version 1.3.0; LDT main `44029db` at compile). Register both clones under the property seat and
remove the entries at close. In LDT, two other lanes may be open: P-297 on the serve cutovers and
`parcelRecordAllowlist.ts`, and P-249 (PR #701) on `artifacts/api-server/src/lib/buildableEnvelope/`
(its `reconcileAtomEnvelope.ts`, `composeBuildableEnvelopeDerivation.ts`,
`fetchPropertyAtomChain.ts`). You touch `buildableEnvelope/derive.ts`, which P-249 does not; say
in CP1 if you find you need any file P-249 touches, and stop there.

### The facts (read by the integration seat, 2026-09-16 and 2026-09-17)

- Corpus `src/setbacks/gate.ts`: G7 blocks a `max_height_ft` flagged `not_specified` whose value
  is not `NOT_SPECIFIED_MAX_HEIGHT_FT` (999); G2 requires a resolving `atom_did` for `asserted`
  and `human-verified`; `primary-source-verified` is the only state without an atom.
- P-258's close (OT-1): 130 shipped rows flag `max_height_ft`; 120 carry a value other than 999
  (san-antonio 21, belton 18, leander 17, liberty-hill 14, austin 9, cedar-park 9, lockhart 7,
  pflugerville 7, taylor 6, bastrop-city 6, san-marcos 4, hutto 1, killeen 1). Austin SF-1 carries
  a quoted 35 ft AND the flag. The corpus tests call the gate but import no shipped table.
- P-258's close (OT-2): 169 acquired rows read from mirrors, renders or a transcription carry
  `primary-source-verified` because no weaker reachable state exists.
- hauska-factory `src/jobs/parcel-envelope-cells.mjs` reads a checked-in classification table
  (`not-specified-classification-table.json`, P-146) that sorts flagged rows into
  REAL_VALUE_FLAGGED, SENTINEL_SUSPECT_IN_MIXED_GROUP and SENTINEL_UNIFORM. That is your
  starting point for the reconciliation; read it, do not edit it.
- LDT `buildableEnvelope/derive.ts:221` sets `maxHeightFt` from `d.max_height_ft` without reading
  the flag; `routes/localSetbacks.ts` returns `max_height_ft` raw. LDT's table copy carries 999 on
  39 district rows at `44029db` (10 at the serving commit `9ce30b8`).

### What to build

1. **Corpus, OT-1.** Reconcile every flagged `max_height_ft` row: a quoted limit clears the flag
   and keeps the value; a silent instrument carries 999. Each change cites the table's own quote
   or the P-146 classification; a row you cannot decide from either stays as it is and is listed
   in CP2 for the operator. Add a test that runs the gate over every shipped table and fails on any
   block.
2. **Corpus, OT-2.** Add the fourth verification state (propose its name in CP1; the ruling's
   working name is `transcription-read`), its meaning in the gate and the docs, a lower confidence
   cap, and relabel the rows whose notes say the value was read from a copy (mirror, render,
   transcription). G2 treats it like `primary-source-verified` (no atom required). Bump the
   version as a minor release in the changelog; do not publish.
3. **LDT.** Apply the same row corrections to LDT's table copy (they must be byte-identical to
   the corpus rows; say how you checked). Make `derive.ts` and the `/local-setbacks` route treat a
   flagged height as absent (no number, with the reason), and add the new state wherever LDT
   validates verification states, with a divergence test against the corpus list.
4. **Consumers.** List every other reader of `verification_state` and of `max_height_ft` in
   hauska-engine and hauska-factory, and what each does with the new state and with a flagged
   height. Report; do not change them.

### Falsifiers, pre-register your answers first

1. The gate run over every shipped table exits clean after the change and blocks at least one
   row before it (show both).
2. Austin SF-1 keeps its 35 ft and loses the flag.
3. A Round Rock SF-2 envelope from LDT's `deriveBuildableEnvelope` carries no 999 height.
4. A row relabelled to the new state passes G2 without an atom; a row relabelled to `asserted`
   without an atom still blocks.

### Do not

- Publish the corpus, deploy LDT, or edit the factory.
- Touch the P-297 or P-249 files.
- Launch sub-agents.

### Close

Snapshot per repo; files touched; the reconciliation table (row, old value, new value, reason);
both PRs with every CI check's literal conclusion string; the consumer list; the four falsifiers
with evidence. `status`: `closed-partial` until the corpus is published and LDT is deployed.
`probe`: `{"notApplicable": "build lane; graded on a live Round Rock envelope after the LDT deploy"}`.
`subAgents`. `leave_behind`.
