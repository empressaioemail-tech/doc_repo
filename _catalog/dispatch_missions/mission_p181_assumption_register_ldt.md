## Mission — P-181 / PREBAKE-LDT: what does the legacy-design-tools ingest and bake believe about its input?

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself. READ-ONLY: no commit, no checkout, no branch, no network, no database, and no file written except your one output artifact.

### What an assumption register is

An assumption is something the CODE BELIEVES ABOUT ITS INPUT that could be false for some Texas county. The purpose is to predict what will break when a county is baked, BEFORE baking it, so 254 counties do not each teach us the same lesson serially.

### Snapshot discipline

`P:\legacy-design-tools` local checkout is STALE. Read `origin/main` only:

```
cd /p/legacy-design-tools && git rev-parse origin/main    # declare this SHA
cd /p/legacy-design-tools && git show origin/main:<path>
```

`git fetch origin` is permitted. Nothing else git-wise. It was `31d181c2` at dispatch; report what you actually read.

### Read this file FIRST, it calibrates you

`lib/cad-ingest/src/txgio/shapefile-discover.ts`. Through 2026-08-09 the CLI used `files.find(/\.shp$/i)`, taking the first shapefile and silently discarding every other. Harris ships east and west halves; two thirds of the county vanished and EVERY count-based gate agreed with the truncated input. The fix discovers all `.shp` and FAILS CLOSED on N>1 unless the operator passes `--multi-shp=concat`, because silent auto-concat is its own defect when the second layer might be a different feature class.

That is one register row: belief ("one .shp per archive"), violator (Harris), failure mode (silent truncation), now guarded fail-closed. Find the rest.

### What to read

- `lib/cad-ingest/src/txgio/parse.ts` — `normalizeTxgioFeature`, `assertTexasWgs84Bbox`, `assertWgs84Prj`, `classifyPrj`, `isNullPlaceholderFeature`, `assertDeclineCeiling`, `assertFinalDeclineCeiling`
- `lib/cad-ingest/src/txgio/` — `shapefile-discover.ts`, `reproject.ts`, `landuse.ts`, `zoning-stamp.ts`, `zoning-layers.ts`, `zoning-service.ts`
- `lib/cad-ingest/src/` — `p78Merge.ts`, `vintage.ts`, `vintage-crosswalk.ts`, `vintage-fallback.ts`, `normalize.ts`, `zip.ts`, `download.ts`, `ingest.ts`
- vendor parsers: `pacs/parser.ts`, `pacs/layout.ts`, `orion/parser.ts`, `vendors/dcad-certified/parser.ts`, `vendors/tad-propertydata/parser.ts`
- the Tier-1 bake: find `nodeFacetBakeTier1`, `computeTier1Envelope`, `mergeBakedBaseFacts`, `brokeragePlaceBuildableEnvelope`

### Already verified by the planner at this SHA — do not re-derive, DO note if now different

Four assumptions are already fixed and fail closed: `shapefile-discover.ts` (multi-shapefile), `assertTexasWgs84Bbox` at `parse.ts:185` (envelope AND a per-feature grid-cell ceiling), `isNullPlaceholderFeature` at `parse.ts:455` (declines only on the CONJUNCTION of impossible coordinates and no identity; out-of-envelope WITH a real `Prop_ID` still throws), `assertDeclineCeiling` at `parse.ts:327` (fires mid-stream per declination, absolute term for large counties and fraction term for small ones).

Your value is in what those four do NOT cover.

### Row format

```
ID: LDT-01
BELIEF: <what the code assumes about its input, one sentence>
WHERE: <path>:<line> in <function>   (quote the 1-3 decisive lines)
FAILURE MODE: silent-wrong-value | silent-truncation | silent-skip | loud-throw | timeout | crash
GUARDED: none | partial | fail-closed  — by what, at what line
KNOWN VIOLATORS: <counties, or "none known">
PRE-BAKE DETECTABLE: yes/no — if yes, EXACTLY what probe against the SOURCE (not our store) reveals the violation before any row is written. Name the request, the field, the comparison.
CONFIDENCE: read-at-source | inferred
```

### Rules that decide whether this is worth anything

1. **Silent failures rank first.** A loud throw is already safe. Order your rows so silent-wrong and silent-truncation come first.
2. **Cite only lines you opened.** Anything else is `CONFIDENCE: inferred` with the reason stated.
3. **Do not invent violators.** "none known" is a good answer.
4. **`PRE-BAKE DETECTABLE` is the deliverable.** An assumption nobody can test from the source before baking is far less useful than one that can be probed. Be concrete.
5. Report well-guarded assumptions too, marked `fail-closed`. Knowing what is safe stops someone re-fixing it.
6. **A guard that cannot fire is your most valuable finding** — no call site, unreachable branch, a default that makes it vacuous. Show the call sites. `computeTier1Envelope` is the known instance in this repo: two return branches, both `status:"declined"`, so it runs, returns a well-formed object, passes every test, and is structurally incapable of producing a value. Look for that shape elsewhere.

### Bounded

A few minutes per file. Aim for 15 to 30 solid rows across a broad read rather than 5 exhaustive ones. On large files read the exports and the top of each function. No repo-wide greps returning hundreds of hits. Every command must exit on its own.

### Output

`_inbox/2026-09-13_assumption_register_ldt.md` — snapshot header (repo, the `origin/main` SHA you read, the files you actually opened), then the rows, then a `COULD NOT ESTABLISH` section. An empty COULD NOT ESTABLISH section is itself a finding and will be read as one.
