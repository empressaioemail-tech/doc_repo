## Mission — P-241: enumerate the published ETJ and city-limits layers, and name who owns the staging path

### THIS LANE IS READ-ONLY. You write no code in any product repo.

You produce a written enumeration and a repo attribution. You do not promote the toggle, you do
not stage a layer, you do not touch `report-model.ts`. A build lane follows from what you return.

Two reasons this is scoped that way, and both are real. The staging path most likely lands in
hauska-engine, where **P-240 is executing in the same window**, so a build here would collide. And
**a dispatch in this program has stated the wrong repo twice in two days**, both times caught only
by someone tracing the live call. You are the one tracing it.

### What is already established, so you do not re-derive it

**The toggle exists and is correctly dark.** hauska-map, `packages/map-renderer/src/layer-registry.js`:

    key: "etj", label: "Extraterritorial jurisdiction", group: "regulatory",
    live: false, fuelGated: true, pending: true,
    emptyBasis: "Declared pending and fuel-gated - no source wired in map-renderer.
                 Turning this on draws nothing anywhere."

It is absent from the consumer panel because `apps/property-explorer/src/browse/consumer-layers.ts`
`consumerKnownLayers()` admits a row only when `entry.live` is true or the key is one of thirteen
named exceptions. `etj` is neither. It is NOT in `CONSUMER_EXCLUDED_LAYERS`, so nothing hides it
deliberately, it simply never qualifies. **Flipping `live` is a one-word change and the wrong one
while no source exists**, because the `emptyBasis` says what happens next.

**`LayersControl.tsx` already renders source-less rows honestly**, with a basis line and the
checkbox deliberately left operable, on the stated rule that "a toggle that turns on nothing should
say so ... the point is disclosure, not concealment."

**Both rails are hardcoded today.** OPS-23 F19 records `report-model.ts:791-796` setting city limits
AND ETJ to `unresolved` for every parcel, and `pdf/feasibility.ts:194-197` printing the literal
sentence "no city-limits or ETJ boundary source is wired for this county yet, so annexation status
is unverified" on every PDF in every county.

**Austin publishes both, and the integration seat measured it 2026-09-15, anonymously, no token:**
org `0L95CJ0VTaxqcmED`, `BOUNDARIES_jurisdictions/FeatureServer/0`, wkid 2277, **388 polygons**
being 270 `AUSTIN 2 MILE ETJ`, 24 `AUSTIN 5 MILE ETJ`, 4 `AUSTIN ETJ AG DEVELOPMENT AGREEMENT`,
26 FULL-purpose and 64 LIMITED-purpose. Re-verify it yourself rather than inheriting it; that is
one query and it is the anchor for everything else you conclude.

### What you are answering

1. **Which cities in the current footprint publish an ETJ layer, and which do not.** Austin is
   confirmed yes. Bastrop, Elgin, the Hays cities and every other wired city are UNCHECKED. For
   each: the service URL, the geometry type, the spatial reference, the feature count, and the
   attribute that carries the ETJ distinction. For each miss, say whether the city has an ArcGIS
   presence at all or none was found, because those are different facts.
2. **Does the same layer carry city limits.** Austin's does, which is why one acquisition may close
   two rails. Check whether that holds for the others, because it changes the value of each.
3. **Who owns the staging path.** Name the repo, the directory and the existing registry a
   jurisdiction layer would be added to, by tracing an EXISTING boundary layer end to end from
   acquisition to what the report reads. Do not reason from directory names.
4. **What it would take to unwire F19's two hardcoded `unresolved` values** for a county where a
   source exists. Name the files and functions. Do not change them.

### The ruling you are NOT making

`OPS-1` line 54 says: "ETJ - NO statewide layer; derive from city-limits + Local Gov Code §42.021,
or per-city GIS." A-027 recorded P-76 as honestly scoped with **"no fabricated buffer."** Whether a
§42.021 population-keyed derivation is a legitimate derived boundary or that refused buffer is an
OPERATOR ruling and it is not yours. The integration seat has recommended it be DEFERRED, because
per-city GIS is live for Austin.

**Two things to carry into your report, not to decide.** Austin's four AG-development-agreement
polygons show its real ETJ is carved by agreement rather than by the formula, which is evidence
against a derivation. And there is an UNVERIFIED claim on the card that SB 2038 (2023) created ETJ
release by petition; if true, a derived ETJ is the fabricated buffer P-76 already refused. **If you
can verify that from a primary source cheaply, do, and say so with the citation. If you cannot,
leave it flagged as unverified. Do not repeat it as fact.**

### Falsifiers, pre-register your answers before you run anything

1. **Every "no ETJ layer" finding must distinguish three states**: the city publishes nothing, the
   city publishes a portal you could not query, and you did not look. Collapsing those is the exact
   defect ENFORCEMENT names as absent-versus-unmeasured.
2. **Re-measure Austin yourself.** If your counts differ from the 388 above, your instrument or the
   seat's is wrong and that must be resolved before anything downstream trusts either.
3. **Your repo attribution must come from tracing an existing layer's live path**, not from reading
   a directory listing. State the file and function chain you followed.
4. If you conclude the enumeration cannot be completed for some city, name the city and the reason.
   A bounded honest gap is a result; a silent omission is not.

### Known traps

- The atoms store is on Neon database `hauska_mcp`; a query against the wrong database returns a
  FALSE ABSENCE indistinguishable from a real one.
- Never pipe an enumeration through `tail`. It drops rows and a zero reads as "nothing is wrong."
- ArcGIS `resultRecordCount` caps silently. Check `exceededTransferLimit` before reporting a count.
- `P:/hauska-map` and other local clones may be stale. Read `origin/main` after an explicit fetch.

### Do not

- Do not write code in any product repo. This lane is read-only.
- Do not promote the `etj` registry row.
- Do not stage, acquire or bake any layer.
- Do not rule on §42.021.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

Return the enumeration as a table, the repo attribution with its trace, and the file-and-function
list for the F19 unwiring. State plainly which cities you could not resolve and why. Declare
`leave_behind` explicitly. State your snapshot (repo, branch, commit).
