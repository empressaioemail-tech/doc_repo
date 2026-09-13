## Mission — P-181 / PREBAKE-ENG: what does the hauska-engine atom write path believe about its input?

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself. READ-ONLY: no commit, no checkout, no branch, no network, no database, and no file written except your one output artifact.

### What an assumption register is

An assumption is something the CODE BELIEVES ABOUT ITS INPUT that could be false for some county. The purpose is to predict what breaks when a county is processed, BEFORE processing it, so 254 counties do not each teach the same lesson serially.

### Snapshot discipline

`P:\hauska-engine` local checkout is STALE. Read `origin/main` only:

```
cd /p/hauska-engine && git rev-parse origin/main    # declare this SHA
cd /p/hauska-engine && git show origin/main:<path>
```

`git fetch origin` is permitted. Nothing else git-wise. It was `112bccb` at dispatch; report what you actually read.

### What to read

- `packages/atoms/src/fact-writer-ids.ts`, especially `normalizeForJoin()`
- `packages/atoms/src/write-boundary.ts` and its tests
- the parcel-node planner and writer (`parcel-node`, `parcelNodeId`, `foldedExtraFeatures`)
- the atoms writer lease: `atoms_writer_lease`, heartbeat, `ATOMS_WRITER_LEASE_NOT_HELD`
- `writePropertyAtomsBatch` and the writer allowlist
- `resolveDeclaredCadVintage`
- the owner-fact, land-use-fact and flood-hazard-fact writers
- `services/retrieval-api` reader, where it makes input assumptions

### Verified context — do not re-derive, DO verify whether still true at your SHA

**The identity seam.** `place_key` is `"{county_fips}:{prop_id}"` RAW; `parcelNodeId` is `"{county_fips}:{normalized prop_id}"` where `normalizeForJoin()` strips leading zeros on all-digit tokens. A factory job's own header flags this as an explicit ASSUMPTION: if `"27303"` and `"027303"` are both real distinct CAD rows, the join conflates them, and **that population has never been measured.**

**Account is not feature.** The parcel-node planner folds every `txgio_parcel` feature sharing one prop_id into ONE atom by design (`foldedExtraFeatures`). Tarrant has 28,665 prop_ids mapping to more than one distinct feature; one Tarrant prop_id carries 532 rows across 111 distinct owner names.

**Vintage disagreement.** Factory takes the LATEST `cad_property.tax_year`; the engine uses a per-county DECLARED year via `resolveDeclaredCadVintage`, engine-internal and not exposed to Factory. Factory's owner cell does not record which year it reflects.

**A real incident to check the code against.** Harris parcel-node apply spent 58 minutes in its plan phase, the writer lease expired, and the apply wrote 0 atoms with `ATOMS_WRITER_LEASE_NOT_HELD`, because the CLI heartbeats only inside `writePropertyAtomsBatch` and the plan phase had none. The retry with a 4-hour TTL landed 1,523,640/1,523,640 verified.

A claim above that is now FIXED is a valuable finding, not a failure. Say so and cite the line.

### Row format

```
ID: ENG-01
BELIEF: <what the code assumes, one sentence>
WHERE: <path>:<line> in <function>   (quote the 1-3 decisive lines)
FAILURE MODE: silent-wrong-value | silent-collapse | silent-skip | loud-throw | lease-loss | timeout
GUARDED: none | partial | fail-closed — by what, at what line
KNOWN VIOLATORS: <counties, or "none known">
PRE-RUN DETECTABLE: yes/no — if yes, EXACTLY what query or probe reveals the violation before any atom is written
CONFIDENCE: read-at-source | inferred
```

### Rules

1. **Silent failures rank first.** A loud throw is already safe.
2. **Cite only lines you opened.** Anything else is `CONFIDENCE: inferred` with the reason.
3. **Scale assumptions count as rows.** Anything that loops in application code over county-sized cardinality belongs here: Harris is roughly 1.5M parcels and killed several such paths.
4. **A guard that cannot fire is your most valuable finding** — no call site, unreachable branch, a vacuous default. Show the call sites.
5. **`normalizeForJoin` gets its own careful row.** State precisely what input makes it collapse two distinct real parcels into one, and name the exact query against `cad_property` that would measure how large that population actually is. Nobody has ever run it.

### Bounded

A few minutes per file. Aim for 12 to 25 solid rows. On large files read exports and function tops rather than every line. No repo-wide greps returning hundreds of hits. Every command must exit on its own.

### Output

`_inbox/2026-09-13_assumption_register_engine.md` — snapshot header (repo, the `origin/main` SHA you read, the files you actually opened), then the rows, then a `COULD NOT ESTABLISH` section. An empty COULD NOT ESTABLISH section is itself a finding and will be read as one.
