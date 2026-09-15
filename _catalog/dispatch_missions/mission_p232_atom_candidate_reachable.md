## Mission — P-232: six districts already have usable setbacks and the gate order makes them unreachable

### The finding you are acting on

P-225's census (`_inbox/2026-09-15_p225_census.json`) established that of Bastrop's 16 live
zoning district codes, **all six uncodified ones are BDC conditional codes whose scalars
already exist on GIS layer 23 and are served today by the facets route** — GC, MU and their
siblings. They cover **3,825 parcels in the demo county**.

**No acquisition is required. The data is already in the system and being served on another
route.** What blocks it is control ORDER.

In `artifacts/api-server/src/lib/buildableEnvelope/authoritativeSetbackSource.ts`,
`resolveAuthoritativeSetbacks` does this:

```
const table = getSetbackTableForZoning(jurisdictionKey, districtCode);
if (!table?.districts.length) return null;
const mapped = mapDistrict(table, districtCode);
if (!mapped || mapped.kind === "fallback-conservative") return null;   // <-- returns here

const candidates = [codifiedCandidate(table, mapped)];
const atomC = args.atomRule ? atomCandidate(args.atomRule) : null;      // <-- never reached
if (atomC) candidates.push(atomC);
```

`args.atomRule` is already passed in by the caller. The atom candidate is constructed AFTER
the codified-table gate, so when the table has no row the function returns null before the
atom rule is ever looked at. **The capability is present and the control order makes it
unreachable** — the same class as the Bastrop parcel-node instance recorded in
ENFORCEMENT.md, where a live county check sat after the gate that had already declined.

Customer-visible consequence, measured 2026-09-15: `POST /brokerage/v1/place/buildable-envelope`
returns `404 no-district` with reason "No authoritative setback source covers this district"
for a GC parcel, and no buildable envelope is drawn at all — an empty map with no explanation.
An SF-1 parcel on the same street returns a real Polygon.

### Done looks like

Where the codified table has no usable row for a district **but the atom chain carries a
usable dated setback rule**, the resolver serves the atom candidate — with its own provenance,
source label and date — instead of returning null. R-1 date-first ranking still applies to the
candidate set; you are making the atom candidate REACHABLE, not making it win by default.

Proof: a Bastrop GC parcel returns a real polygon from the live derive where it returns
`404 no-district` today. **Verify on the MAP, not the API.** The API and the map are different
read paths and the API looked healthy the whole time the map was blank on 2026-09-15.

### The line you must not cross

**A district with no usable candidate on EITHER side must still refuse.** This row makes an
existing value reachable; it does not manufacture one. If the codified table has no row and
the atom chain has no usable rule, `404 no-district` is the correct answer and must survive.

Do not widen a setback table. Do not invent a value. Do not lower the bar for what counts as
a "usable" atom rule in order to make more parcels draw — an unusable rule that draws a
polygon is worse than an honest refusal, because a customer can build on it.

### Falsifiers, pre-register your answers before you run anything

1. **Pick a district with no codified row AND no usable atom rule and confirm it STILL returns
   `404 no-district`.** If everything now draws, you removed the gate rather than reordering
   it, and this row is failed regardless of how many parcels light up.
2. Take a district that HAS a codified row and confirm its served setbacks are unchanged. If a
   codified district starts serving atom-chain values, you inverted the precedence instead of
   extending the candidate list.
3. Confirm the served GC values match what the facets route already serves for the same parcel
   (20/5/20 on the parcel measured in P-225). If the two routes disagree, you have created a
   new instance of the served-answer-contradicts-itself class rather than closing one.
4. If the parcel count that starts drawing is materially different from the census's 3,825,
   suspect your change's scope before believing the number.

### Known traps

- `district_name` matching takes the FIRST TOKEN. `C-2 General Commercial` matches code `C-2`,
  never `GC`. Two districts that mean the same thing in prose are different codes here.
- The resolver ranks date-first through `@empressaio/setback-corpus/resolve` (R-1,
  most-current-source-wins), with authority tier breaking ties only when dates are equal or
  unreadable. An atom rule with an unreadable date does not automatically lose — read the
  resolver rather than assuming.
- `conflict` is already part of this function's return shape. If a codified row and an atom
  rule disagree, disclose it the way the existing code does; do not silently pick.
- legacy-design-tools does NOT auto-deploy. A merge there builds an image only; the deploy is a
  deliberate workflow_dispatch canary plus a traffic shift, owned by the integration seat.

### Do not

- Do not change, add or remove any setback VALUE or table row.
- Do not touch `getSetbackTableForZoning`'s jurisdiction routing. The routing is correct; the
  candidate ordering is the defect.
- Do not deploy or merge. Open the PR green and hand it back.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

State the parcel you verified on the map and what it drew. Close to `_inbox/` on doc_repo main
and PUSH it. Declare `leave_behind` explicitly. State your snapshot (repo, branch, commit).
