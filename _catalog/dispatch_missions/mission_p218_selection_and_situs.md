## Mission — P-218: the panel can render and export a parcel the customer did not select

You are a lane of OPS-24. You do not spawn sub-agents. The integration seat supervises you,
reviews CP1 and CP2, and runs the verification itself.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### Part A — THE FIX. Selection state leaks into the export target

Observed in production by the operator, 2026-09-15: a search for **`48209:97652`** rendered a
property brief titled **"Parcel 97651"**. The Reports and Exports panel then refused with:

> **"Export target 48209:97651 is not the selected property (48209:97652). Reselect the
> property and try again."**

**The serve layer is NOT at fault and this was checked before you were dispatched.** A direct
read of each id returns its own matching `apn`:

```
48209:97650 -> apn 97650      48209:97651 -> apn 97651
48209:97652 -> apn 97652      48209:97658 -> apn 97658
```

So the binding is correct at the API and the defect is in the panel's selection state, which
then propagates into the export target.

**This is the serious half: a customer can export a study bound to a parcel they did not
select.** The refusal message is the system catching itself downstream, which is better than
silence, and it is not a fix — by the time it fires, the brief has already rendered the wrong
parcel and the customer has read it.

Done for Part A: the rendered brief's parcel id always equals the requested id, and an export
target that disagrees with the selection is **impossible to construct** rather than refused
after the fact. Proven by violation on the 97651/97652 pair.

### Part B — MEASURE ONLY. Situs is allocated in patches

Four adjacent Sturgeon Dr parcels, same street, same block, same county, same bake:

```
48209:97650   "613 STURGEON DR, SAN MARCOS, TX 78666"
48209:97651   NO SITUS  -> renders "No street address on the county record"
48209:97652   NO SITUS  -> renders "No street address on the county record"
48209:97658   "629 STURGEON DR, SAN MARCOS, TX 78666"
```

This is the recorded situs class surfacing as a visible product gap: situs has been counted
99.3 percent populated against a real street coverage near 89.9 percent, and the named fix was
a per-county JOIN.

**Part B IS MEASUREMENT, NOT A FIX.** Produce, per county: how many parcels have a real situs,
how many have none, and how many have a SENTINEL — a value that is present but carries no
street. Then characterise the gap: is it random, or does it track a population (unplatted lots,
recent subdivisions, a particular CAD vintage)?

Do not write to the situs join in this lane. The measurement decides whether the fix is one
join or several, and dispatching a fix before that is how you get a per-county patch.

Related and ALREADY CARDED — do not merge it in: P-215's `48021:8723767` reports situs
`present` while its value is the bare token "TX". That is the sentinel case and it belongs to
the identity row.

### Falsifiers, pre-register before you write anything

- If you fix the export refusal message rather than the selection state, you have hidden the
  detector and kept the defect. The message is the symptom.
- If the brief renders correctly but the export target is still settable independently, the two
  can still diverge and you have fixed one of two paths.
- If your Part B counts treat a present-but-streetless situs as populated, you have reproduced
  the exact miscount that made this look like a 99.3 percent problem.
- If the gap turns out random, say so — an evidenced "no pattern" is a real answer and it
  changes the fix.

### Do not

Write to the situs join or any acquisition path — Part B is measurement. Touch `smartcity-os`
or `smartcity-dashboards`. Deploy without the operator's go. Note that a merge to
legacy-design-tools main AUTO-DEPLOYS; `hauska-map` does not, but verify before assuming.

### Close

`_inbox/<date>_p218-selection-and-situs_close.json`, `planRows` `["P-218"]`, with: Part A's
root cause and the fixture failing before and passing after, a live re-read of the 97651/97652
pair through both the brief and the export panel, and Part B's per-county counts split three
ways (real situs, none, sentinel) with the gap characterised. `leave_behind` is required.

**Commit your close to doc_repo main and PUSH it.**
