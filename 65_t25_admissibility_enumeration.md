---
id: 65_t25_admissibility_enumeration
title: T-25 Sentinel and Default Admissibility Enumeration, Property Substrate
status: active
last_updated: 2026-08-20
applies_to: property substrate
related: [61_enforcement_doctrine, ENFORCEMENT, 51_ingestion_pipeline_reference, 90_enforcement_build_order, OPS-12_instrument_inventory]
owner: operator
---

# T-25 admissibility enumeration, property substrate

The complete row set. Every check in the property substrate's write, resolution and scoring
paths that was read, with the cheapest value that satisfies it and whether that value carries
meaning.

This file supersedes three scattered locations and is the address a cold reader is pointed
at. The rows previously lived in `_inbox/2026-08-19_ss-w16_close.json` (two rows),
`_inbox/2026-08-20_t25_property_rows_03_30.md` (rows 3 to 30) and
`_inbox/2026-08-20_t25_property_rows_31_46.md` (rows 31 to 46). Those remain as the dated
lane record. This is the canon.

## What this test cannot see, read before any row

T-25 enumerates checks that EXIST and asks what they admit. **A check that does not exist has
no row.** It finds weak checks by construction and missing ones only when a reader remarks on
an absence.

Three of the largest findings in the estate surfaced that way, not because the method reached
them: the atom append boundary with no binding validation, the database with no constraint on
`entity_id`, and the geocode builder with no country predicate. **The filter is absent, not
weak.**

State coverage as *the weak checks that exist*, never as *every place the substrate can accept
garbage*. The closing inversion is field-driven: for each field carrying a claim, ask what
validates it, and record NOTHING as a row. That is a separate pass and is deliberately not
folded in here, because folding it in would guarantee neither completes.

## Numbering, and a collision a reader must know about

**"Rows 1 to 46" is not 46 distinct checks.** Two numbering schemes collided during the arc.

The `W-` / `R-` / `S-` identifiers are canonical and are what the rest of the estate cites.
The bare ordinals 1 and 2 from the SS-W16 close, and 31 to 46 from the continuation pass, are
positional and are mapped into the canonical scheme here.

- SS-W16 row 1 is the same check as **R-3**. Not a separate row.
- SS-W16 row 2 is the tier2 tile predicate, carried in the scoring-path prose below. Not a
  separate row.
- Continuation rows 31 to 46 are assigned **W-13 through W-28**.

Distinct verified checks: **47**. The gap against 46 is the two duplicates above, and it is
recorded rather than quietly closed.

## Derivation states

1. **Available now.** Two independent sources, the only shape that evidences a source is
   right; or source versus our own derivation, which catches our transformation error and
   never the source's.
2. **Available once a named dependency lands.** Name it. **Zero rows in property**, looked for
   explicitly on three separate passes.
3. **Internal consistency only.** Both values from one upstream. One party acting alone could
   satisfy both sides.
4. **None exists.** The purchasing list. Subdivided foreclosed, absent, self authored.

Not second derivations: a second implementation of the same computation over the same input;
a fallback branch computing a different value inside the same function.

## Snapshots

| repo | read at |
| --- | --- |
| hauska-map | `204789f` |
| hauska-engine | `d3f3794` |
| legacy-design-tools | `1113c649` |
| doc_repo | `cc96276` |

Live store, for W-9 and W-27: Neon, database **`hauska_mcp`** (not `neondb`), user
`neondb_owner`, snapshot `2026-08-20T12:37:26Z`.

**Evidence grade is READ, not executed,** for every row except W-9, W-27 and the S-21
disposition. Read from source beats grep and is weaker than running the code.

## WRITE PATH, hauska-engine `d3f3794`

| # | Location | Predicate | Cheapest satisfier | Valid | Derivation state |
|---|---|---|---|---|---|
| W-1 | `parcel-terrain/parcel-geometry-resolver.ts:29` | `/^(\d{5}):([^:\s]+)$/` identifier FORM | `"00000:x"` | No | 1, two sources: binding vs parcel-node table |
| W-2 | `retrieval/scripts/three-layer-audit.mjs:168` | `body->>'countyFips' <> split_part(entity_id,':',1)` | none | **Yes** | 1, two sources. **TEMPLATE ROW** |
| W-3 | `flood-hazard-fact/geo.ts:142` | `ringCentroid` = `[sx/n, sy/n]`, vertex mean | any concave parcel | No | 1, source vs our derivation: ring containment |
| W-4 | `flood-hazard-fact/geo.ts:157-163` | MultiPolygon centroid reads `coordinates[0]` only | any multi-part parcel | No | 1, source vs our derivation: part count is in the source |
| W-5 | `flood-hazard-fact/geo.ts:167` | `sfhaTf === "T" \|\| "t" \|\| "true"` | **anything else**: `"Y"`, `"1"`, `null`, a schema change | No | **4, none exists.** A hazard flag that FAILS OPEN |
| W-6 | `storage/src/pg-storage.ts:112` | `if (!candidate.entityType \|\| !candidate.entityId) return null` | any non-empty string | No | 1, two sources. **Returns null rather than raising** |
| W-7 | `storage/src/property-atom-batch-write.ts:87,116` | insert + `ON CONFLICT ... entity_id = EXCLUDED.entity_id` | any string; **no predicate at all** | No | 1, two sources |
| W-8 | `storage/src/property-atom-batch-write.ts:50` | `buildAtomDid(entityType, entityId).raw` | any binding; the DID inherits it | No | **3.** An identifier derived from a value cannot verify that value |
| W-9 | `atoms` table, live | **CONFIRMED 2026-08-20.** No PK, no unique constraint, no FK, no check on `entity_id` | any non null string whose pair is unused | No | 1 (a migration, not source code). See the W-9 note below |
| W-10 | `special-district-fact/geo.ts:162` | `geometryCentroid`, vertex mean | any concave district | No | 1, source vs our derivation. **DORMANT, see W-12** |
| W-11 | `utility-easement/geo.ts:14` | private `ringCentroid`, vertex mean | any concave easement | No | 1, source vs our derivation. Private, so not reachable by a shared-export fix |
| W-12 | `well-fact/geo.ts:153` | `geometryCentroid`; ring path diverges from flood's | **RESOLVED 2026-08-20**, see below | No, both copies | 1, source vs our derivation |
| W-13 | `flood-hazard-fact-atoms.ts:103-136` `verifyStoredFloodHazardFactAtom` | schema parse, `parcelNodeId` equality, `outcome` equality, nothing else | any atom parsing the schema with the right `parcelNodeId` and no absence marker. `floodZone`, `inSpecialFloodHazardArea`, `accessPolicy` never compared | No | 3 |
| W-14 | `write-flood-hazard-fact-county.mjs:184-187`, `:754-757` vs `flood-hazard-fact-atoms.ts:127-130` | call site omits `\|\| verifiedAbsence`; the module includes it. **Two derivations of one property differ** | any atom without that state combination | No, as a design | 3 |
| W-15 | `special-district-fact-atoms.ts:140-148` | `expected.districtId && atom.districtId !== expected.districtId` | **OMISSION**. No `districtId` and the check is skipped in silence | No | 3 |
| W-16 | `utility-easement-atoms.ts:158-163` | `easementId` check, plus an exemption for `outcome === "county-coverage"` | **OMISSION**, plus the exemption. `:40` writes the sentinel `easementId: "county-coverage"` for exactly that case | No | **4, self authored.** The writer authors both the sentinel and its exemption |
| W-17 | `building-footprint-writer.ts:155-159`, `:143` | NONE. `observation.footprintId ?? "primary"` | **OMISSION** | No | **4, self authored.** See the W-17 note below |
| W-18 | `building-footprint-writer.ts:160` | NONE. `observation.sourceTier ?? "ml-derived"` | **OMISSION** | No | 4, self authored |
| W-19 | all six `packages/atoms/src/*-writer.ts`, 18 sites | NONE. `provenance.observedAt ?? new Date().toISOString()` | **OMISSION**. Absent observation time becomes write time | No | 4, absent. See the W-19 note below |
| W-20 | same six, 18 sites | NONE. `provenance.verificationStatus ?? "machine"` | **OMISSION** | No | 4, self authored |
| W-21 | `rail-corridor-fact-writer.ts:106,157` | NONE. `observation.bufferMeters ?? RAIL_CORRIDOR_DEFAULT_BUFFER_METERS` | **OMISSION**. The distance deciding "near" defaults silently | No | 4, self authored |
| W-22 | `flood-hazard-fact-atoms.ts:44-49`, `:62-67` | NONE. Hash covers `parcelNodeId`, `sourceTier`, `inSpecialFloodHazardArea`, `floodZone` only | two atoms differing only in `baseFloodElevation` hash identically | No | 4, self authored. `sourceTier: "fema-nfhl"` is hardcoded regardless of actual provenance |
| W-23 | all six `*-writer.ts` hash part lists | NONE. `parts.X ?? null` on every claim field | `undefined`. Absent and null hash identically | No | 4, absent |
| W-24 | `flood-hazard-fact/geo.ts:198-200` | `candidates.find(isSfhaFlag)` then `sfha ?? candidates[0]!` | any candidate array. All-false yields the first zone by array order | No | 1, available now. See the W-24 note below |
| W-25 | `flood-hazard-fact-atoms.ts:43`, `special-district-fact-atoms.ts:40` | truthiness spread, `entry.taxRate ? {...} : {}` | `0`, or the empty string | No | 4, absent. A real zero tax rate is unrepresentable |
| W-26 | all six `write-*-county.mjs`, the `if (!back)` branch | `storedByDid.get(atom.atomDid)` after `SELECT body FROM atoms WHERE atom_did IN (...)` | any stored row whose `body.atomDid` matches | **Partially** | 3. **Strongest in the family**, see the W-26 note |
| W-27 | `document_ingest_atoms`, `migrations/004_document_ingest.sql:32-46` + live | `entity_id text NOT NULL` and nothing else. **No pair-unique index either** | any non null string, including `""` | No | 4, absent. **Strictly weaker than `atoms`** |
| W-28 | `document-ingest/src/pg-atom-store.ts:73-105` | NONE on the binding. `entityId` flows unchecked into `buildAtomDid` at `:76`, which becomes the PK at `:105` | any non null string | No | 4, self authored |

### W-9, confirmed, and the two things that do not shrink it

Queried against the live store. Both constraint queries returned no rows. The text search
answer was correct, and the confirmation changes its evidence class rather than its content.
That is the outcome that most justifies having refused to let it stand: it would have been
right either way and no reader would have known which.

Two things exist and both belong in the row.

`atoms.entity_id` is `text NOT NULL`. That refuses nulls and nothing else.

A unique index `atoms_entity_composite_unique` exists on the pair (entity type, entity id).
It is a `CREATE UNIQUE INDEX` rather than a table constraint, which is why it correctly
returned nothing from both constraint queries. Recorded deliberately: had the absence been
reported without it, the answer would have been right and incomplete, and a later reader
finding the index could reasonably conclude the finding was overstated.

Neither is binding validation. `NOT NULL` asks whether a value is present. The unique index
asks whether a pair is unused. Neither asks whether the value resolves to a node, and a
fabricated identifier never used before satisfies both.

**Full size, both layers, now evidenced rather than inferred.** The application layer has no
binding validation: a presence test returning null (W-6), an insert with no predicate (W-7),
and a derived identifier inheriting whatever the binding was (W-8, W-17, W-28). The database
layer has no binding validation in either table (W-9, W-27). The store takes any non null
string the writer sends, provided the pair has not been used, and nothing at any layer asks
whether the binding resolves to a node.

### W-12 resolved, and it inverts

Flagged for reading with an instruction not to assert correct or defective from a name match.
Both copies read. **Neither is uniformly correct.**

| input | `flood-hazard-fact/geo.ts:145` | `well-fact/geo.ts:153` | correct |
| --- | --- | --- | --- |
| Point | returns the point | returns the point | same |
| Polygon | `ringCentroid`, **de-duplicates the closing vertex** (`:132-136`) | inline vertex mean over the whole ring, **no de-duplication** | **flood** |
| MultiPolygon | first part only, silently, no declaration that N-1 parts were dropped | **returns null** | **well-fact** |

RFC 7946 requires a Polygon ring be closed, so well-fact double counts the closing vertex on
every well formed input. On multi-part geometry well-fact refuses and flood answers for part
one of N without declaring the degradation.

**Reconciling onto either copy alone imports the other's defect.** This needs a third
implementation derived from what each got right, not a winner.

### Defined, imported and invoked are three different facts

**Of three `geometryCentroid` definitions only one is reached.**

- `flood-hazard-fact/geo.ts:145` is LIVE, at `write-flood-hazard-fact-county.mjs:504` and three `f1_pip_*` probes.
- `well-fact/geo.ts:153` is DORMANT. Its writer imports it by exact name, unaliased, and the only occurrence of "centroid" in that entire file is the import line.
- `special-district-fact/geo.ts:162` is DORMANT. Its writer does not import it at all.

Second mechanism considered and rejected: indirect reach through `planCountyWellFacts` from
the same barrel. Rejected by enumerating every textual occurrence of the identifier across
`packages/` and `services/` and finding none inside `well-fact/` beyond the definition and the
barrel re-export.

**Consequence for the reconciliation: a scope counted from definitions is scoped against the
wrong number.** Two of the sibling table's three `geometryCentroid` entries admit nothing
today. The well-fact defect is a trap rather than a live defect, and the trap is that its name
matches the correct implementation two directories away.

### W-13 and W-17, the two that matter

**W-13.** A verification comparing schema, binding and outcome, and never comparing the hazard
zone, the hazard flag or the access policy, increments a `verified` count over exactly the
value most likely to be wrong. `well-fact` and `rail-corridor-fact` both check `accessPolicy`;
`building-footprint` refuses a present atom with no geometry; the one writer carrying a hazard
determination checks neither a policy nor a value. **Where several writers share a
verification pattern, the one carrying the highest consequence should check more than its
siblings, and it checks less.** W-5 manufactures the wrong value and W-13 certifies the write.

**W-17.** The sentinel in a key. `footprintId ?? "primary"` reaches
`buildingFootprintAtomDid` and `entityIdOf`, so the sentinel becomes the atom identity. Two
unresolved footprints on one parcel produce the same DID and collide on write. The verify is
blind to it because both sides carry the sentinel. **This class destroys the evidence of its
own size, because the distinguishing values were the key.** The markets seat found the same
shape independently, in a deduplication key for calendar events.

### W-19, stated with both halves because either alone misleads

All six `*-fact-atoms.ts` type their run provenance as
`Omit<PropertyFactWriteProvenance, "contentHash" | "observedAt"> & { observedAt: string }`,
making `observedAt` required for every caller routed through engine-core. The default cannot
fire on the county writer path. It remains open at the `@hauska-engine/atoms` package
boundary, which is a published contract with consumers outside this repo. Required at the
engine type boundary and open at the published package boundary are two facts.

### W-24, W-5 is larger than it was filed

W-5 is filed as a boolean that fails open. It is also a **zone selection** that fails open.
When `isSfhaFlag` returns false for every candidate, `find` yields undefined and
`findZoneAtPoint` returns `candidates[0]`, the first zone in array order. The doc comment at
`:171-174` claims "Prefers SFHA zones when multiple intersect (stricter finding wins)". Under
a county encoding change that preference is silently lost and the reported `floodZone` string
is wrong too, not only the boolean.

### W-26, the strongest check in the family, and why that is not saying much

All six writers do a real store readback. This retires the carried claim that
special-district's verify is vacuous, which was **true of the source it measured** and was
fixed at hauska-engine `9fb41c7` (PR #306, 2026-08-11), replacing
`verifyStoredSpecialDistrictFactAtom(atom,` with `(back,`. Any gate resting on that claim is
already satisfied.

The readback proves the write round tripped. It catches truncation, JSONB coercion and
wrong-column writes. It cannot catch a wrong value, because the writer authored both the row
and the expectation.

### The call-site divergence, per module

Three of six diverge between the call site's `expected.outcome` and the module's own
`storedOutcome`. This is the second axis of non-uniformity and it is not visible in the
sibling table.

| module | call site | module | agree |
| --- | --- | --- | --- |
| flood-hazard-fact | `absence \|\| sourceTier==="absent"` | plus `\|\| verifiedAbsence` | NO |
| special-district-fact | `absence` only | plus both | NO, widest gap |
| well-fact | `absence` only | `absence` only | yes |
| rail-corridor-fact | `absence \|\| sourceTier==="absent"` | plus `\|\| verifiedAbsence` | NO |
| utility-easement | three valued | three valued | yes |
| building-footprint | complete | complete | yes |

## RESOLUTION PATH, hauska-map `204789f`

| # | Location | Predicate | Cheapest satisfier | Valid | Derivation state |
|---|---|---|---|---|---|
| R-1 | situs address non-null | `IS NOT NULL` | `", ,"`, on 1,248,412 parcels | No | 1, two sources: CAD roll vs `tx_city_boundary` centroid containment |
| R-2 | `situs_city` non-null / non-blank | non-empty string | `","`, `"@"`, `"????"` (11); `"OFF E US HWY 290"` (1,305, Gillespie), which passes non-null, non-blank AND alphanumeric | No | 1, two sources |
| R-3 | `baked-facets.ts:430` | `base.includes("/property-atoms")` | any string containing it | No | 4. **DEAD CODE**, `PE_FACETS_PROXY_BASE` is a const with 0 overriding call sites. Type-expressible |
| R-4 | `atom-chain-to-facets.ts:229` | `env.PROPERTY_ATOM_PATH?.trim() === "1"` | **omission**, falsy, other branch | No | 3 |
| R-5 | `pe-property-atoms.ts:199-202` | spreads `tier2`, nulls ONLY `envelope` | any tier2 object | No | 3 |
| R-6 | `api/_lib/pe-geocode-core.ts` `buildPhotonUrl` | q, limit, bias, lang. **No country predicate** | **omission, the filter is absent** | No | 1, two sources: `countrycode` on the wire feature vs queried viewport |
| R-7 | `api/_lib/pe-site-plan-export-core.ts:194` | `typeof flags.floodZoneHonestUnavailable === 'boolean'` | omission, then default | No | 3 |
| R-8 | same site as R-4 | — | — | — | Duplicate of R-4, confirmed reachable by walker |

## SCORING PATH, legacy-design-tools `1113c649`

Carried in unchanged from earlier verified work: **S-1** column-absence read as source-absence
(fixed, merged); **S-2** `real-at-ceiling` at 0.00%; **S-3** unread `rule.denominator`; **S-4**
`hasWriter` uniform on 3,556 cells; **S-5** `maxCountiesReachable:1` contradicting its own
`sourceBasis`; **S-6** `honestCoveragePct:0` with null source; **S-7** `areaShare:0`; **S-8**
`NaN` carriers; **S-9** Bastrop zoning cell carrying the ENVELOPE row's measurement. Plus the
tier2 tile predicate (`FEMA_TILE_DEG = 0.005`, `Math.round(lat/deg)*deg`), retired 2026-08-19,
predicate preserved here because retirement destroys the evidence otherwise.

| # | Location | Predicate | Cheapest satisfier | Valid | Derivation state |
|---|---|---|---|---|---|
| S-10 | `countyCoverageScoreCli.ts:400` | `countyNames[fips] ?? LEGACY_FALLBACK[fips] ?? fips` | the FIPS itself, a county named `"48021"` | No | 1, two sources: roster vs `tx_city_boundary` |
| S-11 | `countyCoverageScoreCli.ts:498` | `total > 0 ? (matched/total)*100 : 0` | `total = 0` yields **0%**, not unmeasured | No | 3 |
| S-12 | `countyGeometryScoreCli.ts:213` | `entity_id?.match(/^([0-9]{5})/)?.[1] ?? null` | any id starting with 5 digits | No | 1, two sources. This is W-2's check, unenforced here |
| S-13 | `countyGeometryScoreCli.ts:361` | `absenceDetermination.source ?? "honest-absence-determination"` | omission, then a literal masquerading as a source name | No | 4 |
| S-14 | `countyCoverageScoreCli.ts:366` | `Number(rows[0]?.n ?? 0) > 0` | no rows, 0, "source absent" | No | 3 |
| S-15 | `railScoring/measure.ts:78-79` | `/^[a-z_][a-z0-9_]*$/i.test(value)` then **THROWS** | none | **Yes** | 3. **PASS** |
| S-16 | `railScoring/measure.ts:114` | `Number(r.rows[0]?.features ?? 0)` | no rows, 0 | No | 3. **The file's own comment at `:95-98` says a missing table is "no denominator, not a zero". Comment and code disagree; the comment is right** |
| S-17 | `railScoring/engine.ts:136` | `if (!offered.basis \|\| offered.basis.trim() === "")` | any non-blank string | No | 1, two sources: basis text vs the artifact it describes |
| S-18 | `railScoring/engine.ts:149` | `absenceProbeCoversCounty(probe, countyFips)`, refuses | none | **Yes** | 1, two sources. **PASS** |
| S-19 | `railScoring/run.ts:169` | `Number(row.honest_coverage_pct ?? 0)` | null column, 0%, indistinguishable from measured zero | No | 3 |
| S-20 | `railScoring/registry.ts:222` | `denominator: { kind: "none", basis: "no measurement spec yet" }` | the declaration | Honestly no | 4, correctly declared unmeasurable |
| S-21 | `railScoring/registry.ts:197` | 253 live geometry rows scored against an "accounted features" denominator | — | — | **RESOLVED 2026-08-20: NOT FOUND. Rows RETIRED, re-derivation ordered.** See below |
| S-22 | `railScoring/registry.ts:195` | **CORRECTED 2026-08-20.** The machine-readable field `denominator: PARCEL_FEATURE_DENOMINATOR` on the `geometry` rule, while its 253 live rows were computed against a different denominator | the declaration itself | **No.** The structured field and the live data disagree | 4, self authored. See the S-22 correction below |
| S-23 | `railScoring/registry.test.ts:77-78` | `expect(rule.denominator.kind).toBeTruthy()` and `expect(rule.denominator.basis.trim().length).toBeGreaterThan(10)` | `kind: "x"`, `basis: "eleven chars"` | No | 4, absent. **The only guard on the declaration, and it is presence-shaped over a meaning-shaped property.** It cannot see that geometry's declared denominator does not describe geometry's rows |
| S-24 | `railScoring/registry.ts:182-186` vs `railScoring/measure.ts:95,201,241,286` | NONE. The declaration carries a `kind` and prose `basis`; `measure.ts` implements the counting query independently | any divergence between the two | No | 1, available now. **Two implementations of one rule with no divergence test.** `rule.denominator` is only ever copied into a provenance string (`engine.ts:189`, `run.ts:303`, `countyRailScoreCli.ts:193`); it never computes anything, so the declared basis can drift from the executed query silently |

### S-21 disposition: NOT FOUND, rows RETIRED, re-derivation ordered

The producer `B2_cp2_geometry_scorer_apply.mjs` was searched for in the systems seat's
bundle, `_catalog/branch_bundles/ldt-bp01-152-2026-08-19.bundle`, **the bundle itself and not
a description of it**, fetched into a scratch bare repo with ldt `origin/main` supplied as the
thin bundle's prerequisite.

Method: 86 refs fetched, 89 commits unique against ldt main, every tree walked with
`git ls-tree -r` yielding 3,262 distinct paths, searched for `B2_cp2`, `geometry_scorer`,
`geometryScorer` and `geometry-scorer`, then widened to any path matching `scorer`, `B2` or
`cp2`; plus `git log --diff-filter=A --name-only` across all 263 refs, which covers
added-then-deleted and ldt's own full history. Positive control: the traversal returns 45
`package.json` paths, so it is not a search that cannot find anything. One near miss,
`artifacts/api-server/src/_P1-2_cp2_verify.mjs`, confirms the lane-prefixed one-off naming
family is real and is not the producer.

**Wording to preserve: NOT RECOVERABLE FROM ANYTHING REACHABLE HERE, not "gone".**

**The 253 rows are RETIRED, not superseded.** Superseding implies the new number corrects the
old along a known dimension. Here an unknown quantity is being replaced by a known one. The
honest record is that the prior figures were **unreproducible rather than wrong**, and the new
run is not reconciled against them because there is nothing to reconcile against.

### S-22 corrected: the prose is honest, the structured field is not

S-22 was filed as "the file asserts the denominator is reconstructible from checked-in
source, and that assertion is FALSE." **That reading does not survive reading the note.**

The `notes` string at `:197` says the rule "declares the denominator that IS reconstructible
from checked-in source." That is a contrast against the lost accounted-features denominator,
which the same sentence explicitly says is not in the repo. The note names the missing
producer, names the verify script that regexes its output, states that the rule will NOT
reproduce the live values where `foldedExtraFeatures > 0`, and routes the resolution to the
planner. It is one of the more honest artifacts in the estate, and deleting it would destroy
S-21's evidence trail.

**The defect is one level down and worse than the version filed.** The `geometry` rule
declares `denominator: PARCEL_FEATURE_DENOMINATOR` as a machine-readable field while its 253
live rows embody a different denominator. A consumer reading the structured field is misled;
only a human reading the prose is warned. The reconciliation exists solely as prose that
nothing enforces, which is the doctrine's governing case: declared is not enforced.

Second mechanism considered and rejected: that the prose is a false claim and the structured
field is incidental. Rejected because the prose disclaims precisely what it is accused of
asserting, and because the structured field is the half that consumers read.

**Disposition.** The prose stays. The machine-readable field is the false half. Since the 253
rows are RETIRED, the honest declaration for `geometry` is a retired or unmeasured state
until the re-derived scorer lands, so that no consumer reads a denominator describing rows
that no longer stand. S-23 and S-24 must move with it: a presence-shaped test cannot detect
this class, and a declared basis that never computes anything can drift from the executed
query in silence.

## The sibling table, corrected

**There is no shared module.** Six copies of the same helper names with divergent bodies.
Same name in several places is evidence of copying, not sharing, so a shared-site fix is not
available and the per-module count is what a reconciliation scopes against.

Verified structurally at `d3f3794` by resolving import blocks, not by name matching: four of
the six `geo.ts` import nothing at all, `utility-easement` imports `polygon-clipping` plus a
contract type, `building-footprint` imports a local type. No barrel, no re-export, no shared
helper.

| module | `geometryCentroid` | reached | vertex-mean ring | `isSfhaFlag` |
|---|---|---|---|---|
| flood-hazard-fact | yes | **LIVE** | **YES**, closing vertex de-duplicated | **YES** |
| special-district-fact | yes | **DORMANT**, writer does not import it | **YES** | no |
| well-fact | yes | **DORMANT**, imported, never invoked | **YES**, closing vertex NOT de-duplicated (W-12) | no |
| utility-easement | no | — | **YES** (private) | no |
| rail-corridor-fact | no | — | no | no |
| building-footprint | no | — | no | no |

The `reached` column is the correction. The original table's first column read as capability;
two of its three `yes` entries admit nothing today.

W-3 replicates in three of six. W-5 is unique to flood. The `coordinates[0]` pattern appears
in five of six but consequentially in fewer. The call-site divergence recorded under W-14 is a
further axis this table does not show.

## Counts

```
Available now, two independent sources       15
Available now, source vs our derivation       4
Available once a dependency lands             0   <- looked for explicitly on three passes
Internal consistency only                    14
None exists                                  17
   of which foreclosed                        0
   of which absent                            6
   of which self authored                     6
   (5 carried from rows 3-30, unsubdivided)
Flagged, not filed                            0   <- W-12 and S-21 both resolved
                                            ----
distinct verified checks                     47
duplicate ordinals reconciled                 2   (SS-W16 rows 1 and 2)
carried in                                   10
type-expressible                              9
CHECKS THAT HOLD                              3   (S-15, S-18, and building-footprint's
                                                   present-requires-geometry refusal)
```

**Three checks hold in forty seven rows.** All three REFUSE rather than defaulting. That is the
shape everything else is being converted toward.

**Zero dependency-pending rows means the entire remediable set is buildable now.** Nothing
waits on a source, a feed or another lane. The purchasing list is one line: **NFHL at parcel
resolution rather than tile.**

## Type-expressible subset, cheapest coverage, outside every failure state

R-3 and R-4 (discriminated route selector, exhaustive branch); S-11, S-14, S-16, S-19
(`number | null` rather than `?? 0`); S-13 (required field, no default); W-5 (parsed enum over
the SFHA domain, unrecognised raises); W-6 and W-7 (a validated binding type). S-7 and S-8
were converted during this arc and stand as precedent.

Where a type can express the constraint, prefer the type over any check. A discriminated union
the compiler enforces at every consumer has no trigger to be missing and no call site to be
absent, which removes it from the dormant and starved categories entirely.

## Paths completed against paths remaining

**Completed.** flood-hazard-fact geo; the three scorer CLIs' guard, default and fallback
sites; the PE resolution and facets-composition path; the atom append path; the six-module
writer-family `geo.ts` surface; `lib/railScoring/*`; PE backends under `api/_lib/`; the six
`*-fact-atoms.ts` verify and construction predicates; the six `write-*-county.mjs` verify call
sites; the six `packages/atoms/src/*-writer.ts` default surfaces; `document_ingest_atoms` DDL
and write path.

**Remaining, and untouched rather than thin.** `packages/retrieval` beyond
`three-layer-audit.mjs`. Not opened, not skimmed, zero rows. The prediction for it stands
untested: sentinel defaults on serving sweep field tallies, and the `?? 0` collapse of absent,
zero and unmeasured.

Also named rather than implied: the six `plan-county-*.ts` planners, where `absenceKind` and
`reason` are chosen before the writers receive them; the six zod schemas, which set the floor
for every `safeParse` in W-13 through W-26; and `document_ingest_atoms` callers, unenumerated.

## Standing instrument rules

Graph walker for structural questions. Reachability, ownership and identity are not answerable
by text search. Walker at
`artifacts/api-server/scripts/checkBootGraphNoCliImports.mjs`, self-tests both directions, 344
modules from `src/index.ts`.

Mark READ versus VERIFIED. Read from source beats grep and is weaker than executing.

State the snapshot, per repository, in every output.

Verify a check by violating it. Where it can be made to fail two different ways, that beats
making it pass, because a clean pass is consistent with a check that cannot fail.

For every finding, name the second mechanism that would produce the same observation and why
you rejected it. This applies to instruments as well as findings.

Pre-register verification bands before running. One band should be able to predict a defect in
your own output. The practice has fired twice: once against the author's own work, once
against a prediction carried in the dispatch that turned out not to exist in the code.

Distrust your own negative results most.

## Provenance of this file

Rows 3 to 30 existed only as dispatch prose from 2026-08-19 until filed on 2026-08-20. That
was **F-0**, and it is the same shape as S-21: a measurement whose content survived only
outside version control, with references propagating while the thing itself never entered the
estate. It was produced by the enumeration that found S-21, on the artifact whose entire
purpose was to be picked up by someone else. Cited and untracked is the worst state.

Third instance of one pattern this week: a scorer producing 253 ledger rows and never
committed; 152 branches whose content existed only in local working trees until bundled; this
handover. The estate's work products live in working trees and chat until somebody
deliberately files them, and nothing enforces the filing.
