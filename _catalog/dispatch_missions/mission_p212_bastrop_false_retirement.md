## Mission — P-212: 57,704 Bastrop parcels are marked retired and about 54,800 of them are live

You are a lane of OPS-24. SEVERITY-1. You do not spawn sub-agents. The integration seat
supervises you, reviews CP1 and CP2, and runs the verification itself.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### What is true, measured, not reported

```
atoms, entity_type='parcel-node', jurisdiction_tenant='tx_48021'
    57,704 retired   4,690 active     = 92.5% retired

txgio_parcel, county_fips='48021'
    74,729 rows   0 null geom   62,257 DISTINCT prop_id

parcel-node atoms total 62,394  vs  62,257 distinct prop_ids  -- these MATCH
```

**Nothing is missing. The prop_ids are present and the geometry is intact. The comparison is
wrong.** The retirement status is set by a set-difference reconcile against the 2026-09-03
TxGIO reacquisition.

Containment, also measured: Hays, Caldwell, McLennan and Williamson hold **zero** retired
parcel-nodes; Travis holds 40; Ector holds 3,791. All six were reloaded on 2026-09-03, so the
reload alone did not cause this. The reconcile has only ever been run against Bastrop.

### Your fixtures, free, already verified against the county

Twenty retired parcel-nodes, drawn by `md5(entity_id)` so the window was not chosen
conveniently, queried against Bastrop County's own public cadastral FeatureServer:

```
LIVE AT THE COUNTY (19) -- these must NOT be retired:
  30544  58602  98624  42037  26132  70980  112357  51067  8736456
  29677  23036  26446  29203  8715489  123776  82068  61675  22509  34146

NOT FOUND AT THE COUNTY (1) -- your negative control:
  77293
```

`77293` is the most valuable id in this mission. A fix that un-retires all twenty is broken.
A correct fix keeps `77293` retired, or explains with evidence why it should not be.

Two of the live ids are seven digits (`8715489`, `8736456`) and two of the others are five.
`23036` returned three duplicate features from the county, which is a pre-existing
PROPID-GEOMETRY-NONUNIQUE instance and not your bug.

Endpoint, read-only, public, no auth:
`https://maps.co.bastrop.tx.us/server/rest/services/Cadastral_BP/Bastrop_County_Parcels/FeatureServer/0/query?where=prop_id%20IN%20(...)&outFields=prop_id&returnGeometry=false&f=json`

### The order of work, and step 3 is where the trap is

**1. Read the write path.** `reconcileCountyParcelNodes` / `write-parcel-node-county.mjs`.
Find how the set-difference compares, and what makes a present prop_id read as absent.

A HYPOTHESIS, not a diagnosis, and you are expected to improve on it: PREBAKE-ENG's ENG-03
found an unfixed normalization divergence in this exact identity-continuity code
(`parcel-geometry-resolver.ts:176` needs the all-digit guard and one-digit floor that
`plan-county-parcel-nodes.ts`'s JS side already has). The mixed digit-widths above are
consistent with that. So is the 74,729-versus-62,257 duplicate spread. **If the write path says
something else, the write path wins and your finding is the deliverable.**

**2. Prove it by violation.** A fixture where the set-difference says absent and the county
says live must fail on the current code and pass after. Nineteen real ones are above.

**3. REGENERATE, DO NOT HAND-PATCH.** Do NOT write a bulk `UPDATE ... SET status='active'`.
That writes a value nobody re-derived, with no per-node record of why, and it is structurally
indistinguishable from the bad write that caused this. Repair the comparator, then **re-run the
repaired reconcile against Bastrop so the correct status falls out as a derived result**, with
a run id on every change. Our own rule: a recorded correction does not regenerate its artifact;
file the regeneration, never hand-patch.

**4. Verify by re-sampling.** Re-query the same twenty against the county after the re-run.
Expect the nineteen active and `77293` still retired.

### The guard that must exist before the re-run

The reconcile must not be able to flip an atom to retired without a live-CAD cross-check.
**The machinery already exists and is unreachable:** `parcelCurrencyFromBcadMap` is loaded in
the same batch script and sits AFTER the parcel-node gate in the loop, so it never runs once
the gate has declined. You are moving an existing capability to where it can fire, not building
a new one.

Nothing is on a schedule that would re-run this, so the freeze is a build item and not an
emergency. Do not let that make you casual: a human can run it, and running it as it stands
would reproduce this on the other five counties.

### Do not

Mass-UPDATE status. Touch the serve path — making it honour retirement is P-206 and it is
BLOCKED ON THIS ROW, because the serve path's blindness is currently the only thing keeping
92.5 percent of Bastrop visible and fixing it first would take the county dark. Un-retire
anything without the re-run producing it. Write to a repo you do not own. Deploy without the
operator's go.

Out of scope and flagged to nobody: `factory-conformant reap` runs every ten minutes carrying
a destructive verb and is unaudited. Look if it is cheap; do not chase it; do not assume it is
defective.

### Falsifiers, pre-register before you touch code

- If your fix un-retires `77293`, it is admitting everything rather than fixing the comparison.
- If the re-run leaves the count near 57,704, you repaired a comparator that was not the one
  making this decision.
- If the re-run flips ALL 57,704 to active, you have removed the retirement path rather than
  corrected it, and a genuinely gone parcel can no longer be retired.
- If you conclude Bastrop genuinely re-platformed its account space, explain why 19 of 20 old
  prop_ids still resolve at the county today.

### Close

`_inbox/<date>_p212-bastrop-false-retirement_close.json`, `planRows` `["P-212"]`, with: the
comparator defect named from the write path and the mechanism you rejected, the
violation-proof both directions, the re-run's run id and before/after counts, the twenty-id
re-sample, and the guard's new position. `leave_behind` is required.

**Commit your close to doc_repo main and PUSH it.** Three lanes tonight left doc_repo artifacts
stranded in a worktree where no instrument could see them. If you cannot push, say so in your
handback rather than leaving them.
