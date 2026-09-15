## Mission — P-207: one payload, two opposite claims about whether land use is on record

You are a lane of OPS-24. You do not spawn sub-agents. The integration seat supervises you,
reviews CP1 and CP2, and runs the verification itself.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### The finding, measured in a single response

One `get_smart_site` depth-node call for `48209:97658` on 2026-09-14 returned BOTH of these,
in the same payload:

```
brief.sections[id=land-use]:
  data.state    "absent"
  absence.kind  "join-hold"
  reason        "LANDUSE_JOIN_HOLD county 48209 - TxGIO prop_id does not join
                 CAD property_use_code"
  agentGuidance "This facet is reported absent... Do not invent a land-use code"

draw.attrs.landUse:
  { "v": "C1", "desc": "Vacant lot or tract", "state": "present" }
```

The brief says land use is absent and instructs the reader not to invent a code. The draw
block, which is what the panel paints, hands the reader a code. `ownerFact` carries the same
`join-hold` shape.

One of these is lying to the customer and they are in the same response.

### The root cause is upstream of both, and it is already established

Hays is in `LANDUSE_JOIN_DISABLED_FIPS_SEED = {48491, 48209}` in legacy-design-tools
`joinNormalize.ts`. That was found independently by the P-180 lane while diagnosing a
different defect. **Do not re-derive it.** Your question is not why the join is disabled. It is
why two halves of one payload disagree about the consequence.

### The third instrument, which you should read but not chase

The GATE disagrees with both. `parcel_gate_verdict` reports rails `owner` and `landUseCode`
as `pass` with `unaccounted_count = 0` on all six counties, including Hays, on the same day the
serve reported the join-hold. That is finding F27 in
`_inbox/2026-09-14_p195-gate_close.json`, where two mechanisms are named and neither
eliminated: the gate may measure stored cells while the serve re-derives the join at request
time, or those rails may pass vacuously.

**F27 is not yours to close.** But if your reading of the write path settles which mechanism is
right, say so, because nobody else has been able to eliminate one.

### Done looks like

Brief and draw agree for every rail on one payload, proven by a fixture built from the case
that disagrees today. Agreement in the honest direction: if the join is disabled and the value
is not on record, the panel must not paint it. If the value IS legitimately available from
another source, then the brief's `absent` is the wrong half and it must say where the value
came from.

Decide which half is right on evidence, not on which is easier to change.

### Falsifiers, pre-register before you write anything

- If you make them agree by deleting the draw value and the value was actually legitimate and
  sourced, you have removed a working rail to satisfy a consistency check.
- If you make them agree by softening the brief's `absent` to something weaker, you have
  converted a real finding into a label and the customer still gets an unsourced value.
- If your fixture passes both before and after your change, it does not test the disagreement.
- This is INTERNAL consistency within one payload, which our own doctrine warns looks
  meaning-shaped and is not: one upstream fabricating both halves would satisfy it. State
  where the second, independent derivation comes from, or state plainly that you only have
  one and that the check is therefore narrower than it looks.

### Do not

Change `LANDUSE_JOIN_DISABLED_FIPS_SEED` or re-enable the join. That is a different decision
with its own blast radius and it is not carded. Touch `smartcity-os` or
`smartcity-dashboards`. Deploy without the operator's go. Invent a land-use code for any
parcel.

### Close

`_inbox/<date>_p207-payload-contradiction_close.json`, `planRows` `["P-207"]`, with: which
half was wrong and the evidence, the fixture that fails before and passes after, a live
`get_smart_site` read of `48209:97658` showing agreement, whether your reading eliminates one
of F27's two mechanisms, the PRs with merge SHAs and CI conclusion strings. `leave_behind` is
required, and `none` is a valid and cheap answer.
