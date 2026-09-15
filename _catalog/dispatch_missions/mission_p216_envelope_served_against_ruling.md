## Mission — P-216: San Marcos is told its lots have no buildable area, from a figure R-2 refuses to publish

You are a lane of OPS-24. You do not spawn sub-agents. The integration seat supervises you,
reviews CP1 and CP2, and runs the verification itself.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

**This is the only open row where a customer can act on a wrong answer to their own detriment.
Treat it that way.**

### What a customer sees, measured live 2026-09-15

`GET https://smartsite.cloud/api/spine/property-atoms/48209%3A97658/facets` returns:

```json
"envelope": {
  "status": "no-buildable-area",
  "district": "SF-6",
  "setbacks": { "front_ft": 25, "side_ft": 5, "rear_ft": 20 },
  "buildableAreaPct": 0,
  "buildableAreaSqFt": 0,
  "emptyReason": "Setbacks consume the lot — no buildable area remains.",
  "approximate": true, "provisional": true,
  "disclosure": "Reader-composed axis override (parcel_record) applied to one or more
                 setback axes; other axes remain atom-chain-sourced."
}
"facetCoverage": { "envelope": true }
```

Four of four adjacent Sturgeon Dr parcels return this: 97650, 97651, 97652, 97658. A random
Hays sample of six returned three more zeros against three positive percentages (44.9, 49.8,
61.5), so it is widespread and not universal.

### Defect 1: we publish what our own ruling refuses

**R-2 refuses the envelope family** — `buildableAreaSqFt`, `buildableAreaPct`,
`envelopeStatus`, `envelopeDisclosure` read zero BY RULING. The MCP path honours that and
returns `refused / atom_path_pending`. **This path computes and serves it anyway**, and
`facetCoverage.envelope: true` claims coverage the ruling declines.

A fabricated zero is worse than an absence. A zero reads as a finding and enters whatever the
reader does next; an absence forces a decision.

### Defect 2, and it may be the worse one: the zero is probably WRONG

`48209:97658` is roughly 55 x 138 ft, 8,615 sq ft, with 25/5/20 setbacks. That leaves on the
order of 4,200 sq ft buildable. "Setbacks consume the lot" is not plausible for this parcel.

**HYPOTHESIS, not a finding — falsify it rather than confirming it.** The served ring has NINE
edges for a near-quadrilateral, five of them labelled `side`. If the computation insets every
edge labelled `side`, a long narrow lot collapses to zero. Read the write path. If the cause is
something else, that is the deliverable and you say so.

Whatever the cause: **a zero must be proven against geometry before it is served.** A
"no-buildable-area" verdict is a substantive negative claim about someone's property.

### Defect 3: the payload is a hybrid wearing one date

`snapshotAt` reads `2026-07-23`, 54 days stale — but the payload's own `disclosure` says some
setback axes come from `parcel_record` (written 2026-09-15) while others remain atom-chain. So
it is part September, part July, labelled July. This is what P-200's pre-registered falsifier 3
caught: the store write was real and the customer surface did not reflect it.

A hybrid payload carries the vintage of its NEWEST axis, or it declares the mix in a form a
reader can act on. One stale timestamp over mixed-age content is a label that lies.

### Defect 4: 35,365 values were written with unreadable provenance and no conflict row

Every setback cell P-200 wrote carries:

```json
{"value": 25, "source": "@empressaio/setback-corpus@1.1.0:san-marcos-tx",
 "dateBasis": "unreadable", "sourceDate": null, ...}
```

The 2026-09-11 setback-source ruling ("most current wins") states that **an unreadable source
date produces a CONFLICT ROW**. 35,365 values were written without one. The apply reconciled to
the row against its prediction, which is exactly why nobody read what the values said about
themselves — the integration seat included.

In scope for you: raise the conflict row the ruling requires, or establish with evidence that
`dateBasis: unreadable` here does not meet the ruling's trigger. Do not silently accept it.

### Sequencing, and it is not optional

**PR #691 is OPEN and UNMERGED in legacy-design-tools** (P-214's fix) and touches nearby
composition code. Coordinate with it: rebase onto it or state why you do not need to. Do not
merge it for another lane.

**A merge to legacy-design-tools main AUTO-DEPLOYS.** Nothing ships without the operator's go.

### Falsifiers, pre-register before you write anything

- If you suppress the envelope and the panel then shows nothing where a customer expects a
  finding, you have traded a wrong answer for a silent one. R-2's refusal must be VISIBLE as a
  declared refusal, not a blank.
- If you "fix" the zero by making the number positive without establishing why it was zero, you
  have changed a wrong number into a different wrong number.
- If your fixture passes on the pre-fix code, it does not test this.
- If the 44.9 / 49.8 / 61.5 parcels also stop serving a percentage, check whether that is
  correct under R-2 rather than assuming it is collateral.

### Do not

Change the setback corpus or any ruled table. Invent a buildable figure. Touch `smartcity-os`
or `smartcity-dashboards`. Deploy without the operator's go.

### Close

`_inbox/<date>_p216-envelope-served_close.json`, `planRows` `["P-216"]`, with: which code path
computes and serves the envelope, the cause of the zero with the rejected alternative, the
fixture failing before and passing after, a live re-read of all four Sturgeon Dr parcels, the
disposition of the hybrid vintage, and what you did about the unreadable `dateBasis`.
`leave_behind` is required.

**Commit your close to doc_repo main and PUSH it.** Six lanes this week left doc_repo artifacts
stranded in a worktree where no instrument could see them.
