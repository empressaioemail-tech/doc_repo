## Mission — P-222: the reporting surface says things the record contradicts

### The shape, which is why this is one lane and not five

Five defects remain: **D5, D7, D8, D9 and the D11 set.** D3 already split out as P-231 and is not
yours.

**D7, D8 and D9 share one cause: the facet has the data and the report does not ask.** Fix that
cause once and read what is left, rather than patching three symptoms. D5 and D11 are adjacent and
cheap while you are in the same code.

### The five, verbatim from the row

**(D7) Utilities.** The facet serves a City of Bastrop **sewer CCN 20466** and **electric CCN 1324**,
while the report says water and sewer "have no acquisition path in this repo yet" and calls electric
three unresolved overlapping HIFLD territories. The report is asserting an absence the record
refutes.

**(D8) The Old Town overlay never reaches any report**, despite `overlayDistrictsFact` being present
with the TND pattern and full character-district text. On a 1906 structure in a named historic
district, **the overlay is the most likely binding constraint after the base district** and the one a
buyer would most want. It is on the facet and absent from every report.

**(D9) Drainage.** The brief says `unread`, "drainage facet not produced for this parcel", while
sheets 6, 7 and 9 of the same document carry a real parcel-scoped study: 2.91-acre catchment, 188 sq
ft ponding at a four-inch storm, zero traced flow exits, stamped `FD-48021-34049`. **One document
says it was never read and prints it three pages later.**

**(D5) One `UNAVAILABLE` chip is doing three epistemic jobs**: a genuine miss (recorded
restrictions, "not searched"); a verified absence (special districts, `absent-verified`,
`verifiedAbsence true`, "no tx_special_district polygon intersects this parcel's geometry", vintage
2026-09-02); and a permanently unavailable value. **Absent, zero and unmeasured are three different
states** and this chip collapses them, which is the ENFORCEMENT rule this repo names explicitly.

**(D11 set) Lot area has two canonical values**: 29,989 sq ft by shoelace versus 29,888.77 by
`ST_Area`. Reports use the larger; coverage math would use the smaller. Also in the set: edge 4's
setback is refused as "retired road-class derivation" while **edge 3 with the same role and adjacency
resolves to 10 ft**, and `pipelineFact` prints inconsistently.

### Folded in 2026-09-15, same row, no separate lane

**A 7-page feasibility in Bastrop where Travis renders 13.** 1306 FAYETTE ST rendered 7 pages;
2407 PRINCETON DR rendered 13. **Discriminate BEFORE building anything**: generate both, compare
sheet manifests against the facets each county actually serves. If the page count tracks real data
absence it is correct behaviour and closes as a no-op. If it tracks a composition path, it is this
row's own cause a fourth time and it belongs with D7/D8/D9.

### Repo

`hauska-engine`, the report pipeline. Free as of 2026-09-15 — P-240's async port merged as
`cba971a` and is deployed at `hauska-engine-api-00234-jez`. Cut from `origin/main` after a fetch;
the local `P:/hauska-engine` checkout has been 181 commits behind and dirty.

### Done looks like

No report asserts an absence the facet refutes, for any of the five. Where a value genuinely is not
available, the report says which of the three states it is in.

### Falsifiers, pre-register your answers before you run anything

1. **Regenerate the same documents and decode them.** The PDFs use Identity-H CID fonts, so drawn
   text is **NOT greppable** — inflate the FlateDecode streams and parse `beginbfchar` into a
   CID-to-Unicode map. A grep returning nothing on a correct PDF has told you nothing.
   **And the corollary that bit this repo already**: pdf-lib `StandardFonts` carry no ToUnicode CMap
   at all, so text drawn in them is silently invisible to that very method. Verify the font before
   trusting a clean decode.
2. **For each of D7, D8, D9: show the facet value and the report text side by side, before and
   after.** That pairing is the whole claim.
3. **D11's two lot areas: pick one and say why**, and make every consumer use it. Do not fix the
   display and leave coverage math on the other. If they must differ, the document must say so.
4. **D5: prove the three states are now distinguishable** by producing one parcel that renders each.
   A chip that says three different things is only fixed when you can show it saying them.
5. **Do NOT assert a value the system produces that no external authority recognises.** Where you
   change a printed figure, verify it against the source authority, not against current output. That
   converts a defect into a specification otherwise.
6. If the 7-vs-13 page difference turns out to track real data absence, say so and close that leg as
   a no-op. An honest no-op is a result.

### Known traps

- **hauska-engine has NO deploy workflow at all.** A merge ships nothing and nothing says so. Your
  work is not live when merged; say so plainly in the close.
- D3 is P-231's and the engine is SYMMETRIC on that leg — P-227 established by code read that both
  routes call `composeSitePlanModelForParcel`, whose own doc says "Caller-supplied only." Do not
  re-open it and do not fix an address in the renderer.
- A renderer that invents a value it was not given is the fabrication class this program refuses.
  Where the facet is genuinely silent, the report stays silent too, explicitly.

### Do not

- Do not touch D3 / P-231.
- Do not deploy or merge. Open the PR green and hand it back.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

For each of the five, give the facet value, the old report text and the new report text. State which
lot area you chose and why. Give the 7-vs-13 verdict with the sheet manifests that decided it.
Declare `leave_behind` explicitly. State your snapshot (repo, branch, commit).
