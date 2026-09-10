# CTX-B1 — a customer is told a StratMap figure came from the appraisal district

Repo: `legacy-design-tools`. This is the customer-facing defect of the whole program and
the operator ruled on it tonight.

## What a customer is served today, measured

Read on the production Smart Site MCP connector at **paid depth** on 2026-09-10 by the
third-party review (`_inbox/2026-09-10_ctx_third_party_review.md` section 3). Every prior
customer read in this program was at free tier, where all four dollar fields are gated, so
these are the first measurements of a paying customer's view.

    48309:184293  311 Austin Ave, Waco     market 6,506,490   source cad_property
                                                              valueBasis county-assessed
    48309:168429  100 Washington Ave, Waco market 27,845,140  same
    48055:32541   308 W San Antonio        market 1,884,580   same, and GENUINE CAD export

The McLennan values are StratMap-redistributed. The Caldwell one came from the appraisal
district's own export. **They are byte-identical in label.** StratMap origin appears only on
the structural fact's tier and on owner/land-use source vintage, never on the value.

The MCP tool description names the block "CAD-roll market/assessed/land/improvement value".
The web UI labels the row "McLennan County appraisal roll" and the module comment calls it
"A REAL, SOURCED FIGURE FROM THE COUNTY APPRAISAL DISTRICT".

The mechanism is two string constants. `cadRollValue.ts:13,16` define
`CAD_PROPERTY_SOURCE = "cad_property"` and `COUNTY_ASSESSED_VALUE_BASIS = "county-assessed"`;
`bakedDollar` (130-142) stamps them on every dollar. The roll loader reads `source_vintage`
(`joinIntegrityGate.ts:386`) and the slice type it hands the bake **has no field for it**
(`cadRollValue.ts:226-236`). The live overlay path does the same and discards the Factory
cell's `cellSource` (`cadRollFactFromParcelRecord.ts:60-97`, `parcelRecordCellRead.ts:251`).

**The tier is loaded and dropped at one seam.**

## Operator rulings you are implementing, 2026-09-10

**A1. Provenance is a label, not an absence.** Every served dollar carries the roll tier and
the source vintage it came from, and `valueBasis` is **derived from the tier** rather than
asserted by a constant. The declared non-account absence state is REJECTED — it would delete
values a customer can legitimately use if labelled, across all of McLennan.

**A3, the part that lives here.** A retired payload must bake `facets.base.situsAddress`
null, **or** the serve guard must exempt an earned retirement. Caldwell's `48055:1` still
returned 422 after last night's re-bake on the fixed pin, so the situs fix did not reach it.
Pick one of the two and say why.

## The design constraint that binds you

`cad_property.source_file` and `source_vintage` are **overwritten unconditionally** by the
merge's `ON CONFLICT` clause (`p78Merge.ts`, established by CTX-HAYS-SPLIT). On any county
applied more than once at one tax year, that column is the **last writer, not the lineage.**

So the tier must be derived from the declared vintage **together with a field StratMap
structurally cannot populate.** CTX-HAYS-SPLIT used `assessed_value IS NOT NULL` to recover
244 genuine CAD rows from under an overwritten StratMap tag; that is the known-good
discriminator. **Do not read the tier off `source_file`.**

## Paths that must all carry it

The review names four and they are not one change:

1. the bake path (`cadRollValue.ts`, `bakedDollar`);
2. the live overlay path (`cadRollFactFromParcelRecord.ts`, which discards `cellSource`);
3. the wire (`artifacts/smartsite-mcp/src/constants.ts:21`, `tool-honesty.ts:521-560`);
4. the UI label (`fact-sheet-resolver.ts:289-298`, `tax-valuation-paint.ts:24-31`).

A fix that reaches the bake and not the wire changes nothing a customer sees. **State which
of the four you reached and prove each one.**

## Verify by violating

**A StratMap-tier row must not serialise with `valueBasis: county-assessed`.** That is the
required test and it must be observed failing before it passes.

Also confirm a genuine CAD-export row still serialises unchanged — Caldwell `48055:32541` is
the known-good control from the measurement above.

## The thing this fix does NOT resolve, and you must not imply it does

The review found that **Travis serves a systematic tenfold gap** between its 2025
StratMap-derived row and its 2026 CAD row: 7,946,041 then 79,460,410; 8,612,027 then
86,153,487. Both present, same label. One of the two is wrong by an order of magnitude and
which is not decidable read-only.

Labelling makes the provenance honest. **It does not make a 10x-wrong number right.** The
operator has flagged that gap as a separate blocker. If your labelling work surfaces
anything about which side is wrong, report it; do not attempt to fix it here and do not
write a close implying the label change addresses it.

## What you must NOT do

Do not implement a non-account absence state. It was ruled against tonight.

Do not weaken any serve guard.

Do not deploy, submit a Cloud Build, or run any Cloud Run job, bake, publish or walk. The
integration seat owns every execution and deploy.

Do not write to `hauska-factory`, `hauska-engine` or `hauska-map`.

## Close contract

Standard lane close JSON, plus:

- Which of the four paths you reached, each proven separately.
- The discriminator you used to derive the tier, and why it survives the `ON CONFLICT`
  overwrite.
- Which A3 option you took for the retired-situs case and why.
- The violation runs: StratMap row refusing `county-assessed`, CAD row unchanged.
- Anything you learned about the Travis 10x gap, reported not fixed.
- `leave_behind`.

Report the merge commit. The integration seat pins the factory to it and rebuilds.
