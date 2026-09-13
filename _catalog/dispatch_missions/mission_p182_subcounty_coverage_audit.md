## Mission — P-182 / COVERAGE-SUB: every city, town and postal place in the six onboarded counties, and what each is missing

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself. READ-ONLY: no commit, no checkout, no branch, no write to any database, and no file written except your one output artifact.

### Why this row exists — the worked example

The operator searched `202 ELECTRA ST, THRALL, TX 76578` on the live `smartsite.cloud` surface on 2026-09-13. Thrall is an incorporated city inside Williamson County, which is one of our six onboarded counties. The brief refused on four rails and each refusal named a different real gap:

- LAND USE: "Not read: the county's parcel id does not match the appraisal record, so zoning is unavailable"
- LIVING AREA: `lookup-failed` — "No `cad_property` row at declared vintage for 48491:R007189"
- ZONING: "inside Thrall limits; **no zoning layer on file for Thrall**"
- SETBACKS: "no setback table covers this parcel's district"
- BUILDABLE: "Not stamped here"

The surface behaved correctly. It refused honestly and named why. The problem is that **nobody has ever enumerated which places inside an onboarded county have no coverage**, because county onboarding was treated as the unit of work. Thrall proves the unit is wrong.

Your job is that enumeration. Thrall MUST appear in your output as a row.

### The six counties

Bastrop 48021, Caldwell 48055, Hays 48209, McLennan 48309, Travis 48453, Williamson 48491.

### The roster — get this right or the rest is worthless

Enumerate every incorporated place, town and postal place in those six counties from an authoritative source. Candidates, in preference order: a Census/TIGER place-to-county roster if one is already in the repo or the factory store; `tx_city_boundary`, which OPS-22 section 2 records at **69 cities across these six**; and the city rosters inside `ZONING_LAYERS` and the ruled setback tables. State which roster you used and why. **A place that exists in the world and is absent from every roster we hold is itself a finding** — say so rather than quietly working from our own list, because working only from our own list is how Thrall stayed invisible.

### Per place, report

| column | question |
|---|---|
| place | name, county, FIPS if available |
| incorporated | city / town / CDP / postal-only |
| zoning layer on file | is there a zoning source for this place at all |
| in `ZONING_LAYERS` | is it wired in the LDT registry |
| ruled setback table | does one cover this place |
| parcels bound | does `landing_parcel_jurisdiction` bind parcels to it |
| live surface | what the deployed surface returns for ONE real address in it |

The live-surface column is optional if you cannot reach the surface read-only without credentials. If you cannot, say UNMEASURED for that column rather than inferring it from the registry.

### The baseline you must reproduce or contradict

OPS-22 section 2 records **69 cities across the six counties, 23 with a zoning endpoint**, split: Bastrop 3/3, Caldwell 3/3, Hays 5/11, Williamson 7/14, Travis 3/18, McLennan 2/20.

If your enumeration does not reproduce those numbers, **say so loudly and show both**. Do not silently report a different figure. A disagreement between your count and OPS-22 is a finding either way: either the doc is stale or your roster is wrong, and which one it is matters.

### Rules

1. Cite the source of every column. A column you could not establish is UNMEASURED, never a guess and never a default of "no".
2. "No coverage" and "not checked" are different states and must not collapse.
3. Rank the output so places with the LARGEST population or parcel count and NO zoning coverage come first — that is the list the operator will act on.
4. Do not acquire anything, do not wire anything, do not propose a build. This row enumerates.

### Bounded

Read-only, a few minutes per source. No repo-wide greps returning hundreds of hits. Every command must exit on its own. If a store query is needed, `FACTORY_DATABASE_URL_RO` is the read-only role; every statement must be a SELECT and carry a statement timeout.

### Output

`_inbox/2026-09-13_subcounty_coverage_audit.md` — snapshot header (what rosters and SHAs or store you read, and when), the per-place table, the reproduce-or-contradict verdict against the OPS-22 baseline, a ranked "largest places with no zoning coverage" list, and a `COULD NOT ESTABLISH` section. An empty COULD NOT ESTABLISH section is itself a finding and will be read as one.
