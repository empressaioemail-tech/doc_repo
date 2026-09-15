## Mission — P-217: a served payload whose parts contradict each other refuses, instead of picking a half

You are a lane of OPS-24. You do not spawn sub-agents. The integration seat supervises you,
reviews CP1 and CP2, and runs the verification itself.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### DO NOT START UNTIL P-216 HAS CLOSED

P-216 is in the same repo and edits the same composition path. Two lanes in one composer is how
work gets swept. Check `_catalog/lane_claims.json` before claiming; if `p216-envelope-served`
is held, stop and say so rather than working around it.

### Why this is one control and not seven rows

Seven instances measured in two days, each on a different rail or a different reader:

```
1  brief says land use ABSENT (join-hold) while draw.attrs prints C1, same response
   -> P-207, FIXED and deployed
2  brief setbacks-envelope PRESENT 30/10/30/20 while the envelope overlay in the SAME
   response reads refused / atom_path_pending
   -> P-214 defect 2, root-caused, NOT FIXED -- this is your live fixture
3  stub depth reports envelope PRESENT; depth-node reports it refused. Same parcel,
   same moment, two readers
4  parcel_gate_verdict reports owner and landUseCode PASS at 0 unaccounted on all six
   counties while the serve returns a LANDUSE_JOIN_HOLD absence  -> F27
5  the panel evaluates "expected 5ft for role side" against a served sideFt: 10  -> P-214
6  a card prints "the county's parcel id does not match the appraisal record, so zoning
   is unavailable" and then prints "ZONING SF-6" two rows below it
   -> operator screenshot 2026-09-15
7  the store holds September setback cells while the serve labels the payload July
   -> P-216
```

**These are not seven bugs. Nothing checks that a served answer agrees with itself before it
reaches a customer.** Instance 2's own root cause proves the two halves were never going to
agree on their own: the baked-facets route unconditionally nulls `facets.envelope` at bake time
and the MCP JSON has no equivalent of the web panel's client-side live-derive augment.

### Build a REFUSAL, not a detector

Canon, 2026-09-15: this operation has a long record of building detectors later found dormant,
starved, or vacuous — including a drift self-test that was passing while blind to the exact
drift it existed to catch. A refusal that fires beats a report nobody reads.

So: a response whose sections make opposite claims about the same rail **fails to serve**, and
says which two parts disagreed. Not a warning field. Not a log line.

### Answer the three-question gate in your close

1. What executes it? 2. What triggers it? 3. What fails, and is that running in production?
4. What bypasses it — name the paths that reach a customer without passing through.

### THE HONEST LIMIT, and you must state it rather than oversell the control

This is **internal consistency within one payload**. Our own doctrine warns that this looks
meaning-shaped and is not: one upstream fabricating both halves satisfies it, because a single
party can satisfy both sides. It catches CONTRADICTION. It does not catch a wrong source that
agrees with itself.

Say that in the close. A control described as stronger than it is becomes the reason nobody
builds the stronger one.

### Done looks like

A refusal that fires on instance 2, which is unfixed and therefore live today, proven by
violation on a fixture built from a real parcel. And a demonstration that a coherent payload
still serves — a refusal that blocks everything is worse than the defect.

### Falsifiers, pre-register before you write anything

- If your fixture passes on the pre-fix code, it does not test this.
- If the refusal fires on a payload whose parts legitimately differ (a rail absent in one
  section and simply not carried in another is NOT a contradiction), your predicate is too
  broad and it will teach the fleet to bypass it.
- If it cannot fire on instance 2 as it exists today, you built it against a hypothetical.
- If you find yourself listing rails by hand to compare, ask whether the type can express the
  constraint instead. A compiler-enforced discriminated union has no trigger to be missing.

### Do not

Fix any of the seven instances — this row builds the control, the instances have their own
rows. Touch `smartcity-os` or `smartcity-dashboards`. Deploy without the operator's go; a merge
to legacy-design-tools main AUTO-DEPLOYS.

### Close

`_inbox/<date>_p217-payload-coherence_close.json`, `planRows` `["P-217"]`, with: the
three-question gate answered including bypasses, the violation proof both directions, the
fixture, and the honest-limit statement in your own words. `leave_behind` is required.

**Commit your close to doc_repo main and PUSH it.**
