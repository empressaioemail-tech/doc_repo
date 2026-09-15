## Mission — P-181 / PREBAKE-FAC: what does hauska-factory believe about its input, and what could detect a SHORT fill?

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself. READ-ONLY: no commit, no checkout, no branch, no network, no database, and no file written except your one output artifact.

### Snapshot discipline — read this twice

`P:\hauska-factory` local checkout is a STALE clone sitting at "Initial commit". **It has no usable source. Do not read it and conclude anything.** Read `origin/main` only:

```
cd /p/hauska-factory && git rev-parse origin/main    # declare this SHA
cd /p/hauska-factory && git show origin/main:<path>
```

`git fetch origin` is permitted. Nothing else git-wise. It was `97b9387` at dispatch; report what you read. A compiled copy of the rail set exists at `P:/tmp/parcel-record-js-22e71e1/rail-keys.js` for cross-reference only; the repo is authoritative and disagreement between them is a finding.

### What to read

- `src/lib/parcel-record-engine/rail-keys.js` — the 65 rails, grain, access pairs, `UNINCORPORATED_NOT_APPLICABLE_RAIL_KEYS`, `RAILS_V2_DECLARED_AHEAD`
- the county fill job and the rail jobs (`parcel-record`, `rail`, `fill`, `publish-gate-sched`, `DEFAULT_SCHED_RAIL_KEYS`)
- `src/jobs/owner-rail-collision-check.mjs` — read its header, it flags its own assumption explicitly
- the cell writers and how `cell_state` jsonb is shaped
- the scorers and the publish gate (`parcel_gate_verdict`)
- the setback and envelope cell writers, if they exist
- `railCapabilities`, if present

### Verified context — do not re-derive, DO verify whether still true at your SHA

- `parcel_record` columns are exactly `place_key, county_fips, prop_id, incorporated, instantiated_at`. 981,405 rows across 6 counties.
- `parcel_record_cell` columns are exactly `place_key, rail_key, cell_state jsonb, updated_at`. 63,791,325 rows, which is 981,405 x 65 exactly. **There is no version column.**
- Cell state lives under the jsonb key `kind`, not `state`. Kinds observed live: `value`, `unaccounted`, `absent-verified`, `not-applicable`, `refused`.
- A sixth state `available-on-request` was ruled 2026-09-10 and requires a NAMED, REACHABLE `requestPath`. An unreachable path is NOT this state.
- The publish gate graded 17 of 65 rails; card D5 / P-136 was widening it to 65.
- `write-setback-city.mjs` reportedly throws `SETBACK_APPLY_HELD` on `--apply` and has no live parcel loader (`PARCEL_SOURCE_REQUIRED`). **Verify whether that is still true.**

### SECTION A — assumption register rows

```
ID: FAC-01
BELIEF: <what the code assumes, one sentence>
WHERE: <path>:<line> in <function>   (quote the 1-3 decisive lines)
FAILURE MODE: silent-wrong-value | silent-skip | vacuous-write | loud-throw | timeout
GUARDED: none | partial | fail-closed — by what, at what line
KNOWN VIOLATORS: <counties, or "none known">
PRE-FILL DETECTABLE: yes/no — if yes, EXACTLY what probe reveals it before any cell is written
CONFIDENCE: read-at-source | inferred
```

**Special attention: VACUOUS WRITE PATHS.** A function that runs, returns a well-formed object, passes its tests, and is structurally incapable of producing a value on any branch. `computeTier1Envelope` in legacy-design-tools is the known instance: two return branches, both `status:"declined"`. Ask of every factory writer: does it have at least one REACHABLE path to a real value? **A writer that cannot succeed is the highest-value finding available in this review.** Show call sites.

### SECTION B — completeness inventory

For each rail, or sensibly grouped: **is there any check that would detect a SHORT fill, as distinct from a WRONG one?** A short fill is a job that succeeds and writes fewer rows than the source actually holds.

The governing lesson, and the reason this section exists: for Harris, dry-run, apply, apply2 and SQL **all agreed at 564,948 because all four read the same truncated input**, and the membership file's own parcel-count estimate was 536,512, exactly the east-only count, so the sizing probe carried the identical bug. **A check whose input derives from the same upstream as the thing it checks cannot detect truncation.** What finally saw it was an independent derivation: reading the ZIP central directory.

Report per rail or group:
- what count-based checks exist today
- whether their input is INDEPENDENT of the write path being checked — this is the whole question
- what an independent second derivation would actually be

### Rules

1. Silent failures and vacuous writes rank first.
2. Cite only lines you opened. Anything else is `CONFIDENCE: inferred` with the reason.
3. A guard that cannot fire is the most valuable finding. Show the call sites.
4. If the repo is unreadable for any reason, say **UNMEASURED** loudly rather than reasoning from the stale clone or from the compiled copy alone. A confident wrong answer here is worse than no answer.

### Bounded

A few minutes per file. Aim for 12 to 25 assumption rows plus the Section B inventory. On large files read exports and function tops. No repo-wide greps returning hundreds of hits. Every command must exit on its own.

### Output

`_inbox/2026-09-13_assumption_register_factory.md` — snapshot header (repo, the `origin/main` SHA you read, the files you actually opened), Section A, Section B, then a `COULD NOT ESTABLISH` section. An empty COULD NOT ESTABLISH section is itself a finding and will be read as one.
