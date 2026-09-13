# Assumption register: the hauska-engine atom write path

Lane PREBAKE-ENG. PLAN-ROW P-181. 2026-09-13.

## Snapshot

    repo:            hauska-engine
    read via:        git show origin/main:<path>   (READ-ONLY; no checkout, no network, no database)
    origin/main SHA: 112bccb8bed29da639955219511975bddbb425b4
    dispatch stated: 112bccb  (agrees)
    local HEAD:      8d8e8803550f6f7fdaae42c59a25c4a2d9acc71c  (STALE, detached; not read)
    doc_repo seat:   integration, P:/doc_repo, branch main

An assumption here is something the CODE BELIEVES ABOUT ITS INPUT that could be false for some
county. Every row was read at the SHA above. No store was queried, so no row carries a population;
each row instead carries the exact probe that would measure its population before an atom is written.

### Files opened at origin/main

    packages/atoms/src/fact-writer-ids.ts
    packages/atoms/src/write-boundary.ts
    packages/atoms/src/parcel-write-identity.ts
    packages/atoms/src/parcel-node-writer.ts
    packages/atoms/src/owner-fact-writer.ts
    packages/atoms/src/flood-hazard-fact-writer.ts
    packages/engine-core/src/parcel-node/plan-county-parcel-nodes.ts
    packages/engine-core/src/parcel-node/parcel-node-atoms.ts
    packages/engine-core/src/owner-fact/plan-county-owner-facts.ts
    packages/engine-core/src/cad-vintage/resolve-declared-cad-vintage.ts
    packages/engine-core/src/parcel-terrain/parcel-geometry-resolver.ts
    packages/engine-core/scripts/writer-apply-lease.mjs
    packages/engine-core/scripts/write-owner-fact-county.mjs
    packages/engine-core/scripts/write-land-use-fact-county.mjs    (header + write block)
    packages/engine-core/scripts/write-flood-hazard-fact-county.mjs (header + write blocks)
    packages/engine-core/scripts/write-parcel-node-county.mjs       (apply block)
    packages/storage/src/property-atom-batch-write.ts
    packages/storage/src/access-policy-write.ts
    packages/storage/src/atoms-writer-lease.ts       (exports, take, heartbeat, scope assert)
    packages/storage/src/pg-storage.ts               (writePropertyAtomsBatch, list, createPgStorage)
    packages/storage/src/layered-storage.ts          (delegation only)
    services/retrieval-api/src/parcel-record-db.ts
    services/retrieval-api/src/parcel-record-reader.ts

### Verified context, re-checked at this SHA

The identity seam is REAL and unchanged. See ENG-02.

Account-is-not-feature is REAL and deliberate, and the counter that reports it is a MIXED
population. See ENG-06.

Vintage disagreement is REAL. The engine side additionally covers only 15 of 254 counties.
See ENG-11 and ENG-12.

The Harris writer-lease incident is PARTLY FIXED. The plan phase no longer runs inside the lease,
because the take moved after planning. The heartbeat is still the only TTL extension and it silently
resets to the 15-minute default. See ENG-05, which is the residual.

---

## Rows

### ENG-01

BELIEF: three of the CAD-derived county writers believe `writePropertyAtomsBatch` can be called
without a lease.

WHERE: `packages/engine-core/scripts/write-owner-fact-county.mjs:416`,
`write-land-use-fact-county.mjs:374`, `write-flood-hazard-fact-county.mjs:164` and `:734`, against
the method opening at `packages/storage/src/pg-storage.ts:297`.

    // write-owner-fact-county.mjs:416
    await handle.storage.writePropertyAtomsBatch(slice);

    // pg-storage.ts, inside writePropertyAtomsBatch
    if (!isHeldLease(lease)) {
      throw new LeaseRequiredError();
    }

FAILURE MODE: loud-throw, but the class is VACUOUS WRITE PATH. The CLI runs, parses, plans,
contract-validates every atom, prints a dry-run that predicts the apply, and then throws on the
first batch. It runs, it passes review, it cannot succeed.

GUARDED: fail-closed at pg-storage. `handle` is `createPgStorage(...)` (owner writer line 170),
which returns `new PgStorage(sql)` (pg-storage.ts:1393), so no alternate storage implementation
would accept the call. A case-insensitive grep for "lease" over all three scripts returns ZERO
matches: no import, no take, no threading.

KNOWN VIOLATORS: every county, for owner-fact, land-use-fact and flood-hazard-fact. The sibling
writers that DO take a lease are parcel-node (`write-parcel-node-county.mjs:468`), cad-parcel-roll
(`:334`), building-footprint (`:517`), utility-easement (`:424`) and well-fact (`:328`).

PRE-RUN DETECTABLE: yes, with no database.
`git grep -c -i lease packages/engine-core/scripts/write-*.mjs` and compare against the writer
roster; any writer script with 0 matches that calls `writePropertyAtomsBatch` cannot apply.

CONFIDENCE: read-at-source.

### ENG-02

BELIEF (`normalizeForJoin`): two CAD account ids that differ only in leading zeros are the same
account.

WHERE: `packages/atoms/src/fact-writer-ids.ts:165`.

    export function normalizeForJoin(value: string): string {
      const trimmed = value.trim();
      if (!/^\d+$/.test(trimmed)) return trimmed;
      return trimmed.replace(/^0+(?=\d)/, "");
    }

PRECISELY WHAT COLLAPSES: two distinct rows whose trimmed `prop_id` values are BOTH all-digit
(`/^\d+$/`), are not all-zero, and are equal after leading zeros are stripped. `"027303"` and
`"27303"` collapse. `"27303 "` and `"27303"` collapse, by the trim. `"0A123"` and `"A123"` do NOT
collapse here, because neither is all-digit, and that asymmetry is itself a defect: see ENG-03.
`"000"` does not become `""`, because the lookahead keeps one digit, and `isUsablePropId` rejects it
first at `:189`.

WHERE THE LOSS HAPPENS, silently, with the count computed and then discarded:

    // packages/engine-core/src/owner-fact/plan-county-owner-facts.ts:96-101
    for (const row of rows) {
      if (!isUsablePropId(row.propId)) continue;
      const key = normalizeForJoin(row.propId);
      const prev = out.get(key);
      if (!prev || row.taxYear >= prev.taxYear) out.set(key, row);   // >= : equal years, last wins
    }

    // same file, :146-148  (the parcel side, also silent)
    const parcelKey = normalizeForJoin(parcel.parcelKey);
    if (seen.has(parcelKey)) continue;

`cadRowsRead` counts the input and `cadByKey.size` is never compared against it. `skippedUnusableKey`
is incremented for unusable keys and NOT for the collapse. Nothing counts either loss.

FAILURE MODE: silent-collapse, then silent-wrong-value. The survivor's owner name, mailing address
and exemption flags are written onto the losing account's parcel.

GUARDED: none on the write side. The READ side has a mitigation that does not help the writer:
`services/retrieval-api/src/parcel-record-db.ts:172-190` tries the direct key plus six zero-padded
candidates and returns `ambiguous` when two or more are real, and `parcel-record-reader.ts:144-158`
refuses on ambiguous. So the reader can DETECT a collapse the writer cannot.

KNOWN VIOLATORS: none known. This population has never been measured.

PRE-RUN DETECTABLE: yes. This is the query nobody has run. It mirrors `normalizeForJoin` exactly,
including the all-digit guard and the one-digit floor.

    -- Distinct CAD accounts that normalizeForJoin would silently merge, per county and tax year.
    -- accounts_lost is the exact number of rows indexOwnerCadRowsByJoinKey discards.
    WITH t AS (
      SELECT county_fips, tax_year, btrim(prop_id) AS raw
      FROM cad_property
      WHERE prop_id IS NOT NULL
        AND btrim(prop_id) <> ''
        AND btrim(prop_id) !~ '^0+$'        -- isUsablePropId rejects all-zero
        AND btrim(prop_id) ~ '^[0-9]+$'     -- normalizeForJoin only rewrites all-digit tokens
    ),
    g AS (
      SELECT county_fips, tax_year,
             CASE WHEN ltrim(raw,'0') = '' THEN '0' ELSE ltrim(raw,'0') END AS join_key,
             COUNT(DISTINCT raw) AS raw_variants
      FROM t
      GROUP BY 1,2,3
    )
    SELECT county_fips,
           tax_year,
           COUNT(*)                     AS colliding_join_keys,
           SUM(raw_variants)            AS raw_accounts_involved,
           SUM(raw_variants) - COUNT(*) AS accounts_lost
    FROM g
    WHERE raw_variants > 1
    GROUP BY 1,2
    ORDER BY accounts_lost DESC;

The parcel-side twin, which measures what the parcel-node planner folds for the same reason:

    WITH f AS (
      SELECT DISTINCT ON (feature_index) county_fips, feature_index, btrim(prop_id) AS raw
      FROM txgio_parcel
      WHERE county_fips = $1
        AND prop_id IS NOT NULL AND btrim(prop_id) <> '' AND btrim(prop_id) !~ '^0+$'
      ORDER BY feature_index, tile_key
    )
    SELECT COUNT(*) AS colliding_join_keys,
           SUM(raw_variants) - COUNT(*) AS features_folded_by_zero_strip
    FROM (
      SELECT CASE WHEN raw ~ '^[0-9]+$'
                  THEN CASE WHEN ltrim(raw,'0')='' THEN '0' ELSE ltrim(raw,'0') END
                  ELSE raw END AS join_key,
             COUNT(DISTINCT raw) AS raw_variants
      FROM f GROUP BY 1
    ) g WHERE raw_variants > 1;

A zero in either result is a POSITIVE determination of absence for that county. A non-zero is the
number of parcels that will be wrong.

CONFIDENCE: read-at-source.

### ENG-03

BELIEF: the four implementations of "normalize a parcel key" agree with each other.

WHERE: there are FOUR, and the SQL one is not equivalent to the other three.

    packages/atoms/src/fact-writer-ids.ts:165                      normalizeForJoin
    packages/engine-core/src/parcel-node/plan-county-parcel-nodes.ts:169
                                                                   normalizeParcelKeyToken
    packages/atoms/src/parcel-write-identity.ts:126                resolveCanonicalParcelKey
    packages/engine-core/src/parcel-terrain/parcel-geometry-resolver.ts:176

    AND regexp_replace(prop_id, '^0+', '') = regexp_replace(${propId}, '^0+', '')

The first two are textually identical copies of the same regex. The third strips a DECIMAL pad, not
zeros. The SQL form has NO all-digit guard and NO one-digit floor. Consequence at this SHA: a raw
`prop_id` of `"0A123"` is keyed by the planner as `{fips}:0A123` (unchanged, not all-digit), and the
resolver then looks for `regexp_replace('0A123','^0+','')` which is `'A123'`, matching the DIFFERENT
parcel whose raw prop_id is `"A123"`. The comment at plan-county-parcel-nodes.ts:165-168 asserts
these normalizations match on both sides of the lookup. They do not.

FAILURE MODE: silent-wrong-value. A parcel serves another parcel's ring.

GUARDED: none. `normalizeParcelKeyToken`'s docstring is the only statement of the invariant, and it
is prose.

KNOWN VIOLATORS: none known. Requires a token that is all-digit AFTER the zero strip but not before,
that is, a leading-zero token containing a letter.

PRE-RUN DETECTABLE: yes.

    SELECT county_fips, COUNT(*) AS keys_where_sql_and_js_disagree
    FROM (
      SELECT county_fips, btrim(prop_id) AS raw FROM txgio_parcel WHERE county_fips = $1
      UNION
      SELECT county_fips, btrim(prop_id)        FROM cad_property WHERE county_fips = $1
    ) t
    WHERE raw ~ '^0+' AND raw !~ '^[0-9]+$'     -- leading zero AND not all-digit
    GROUP BY 1;

CONFIDENCE: read-at-source.

### ENG-04

BELIEF (`assertEdgesNotStarved`): the applies-to edge count derived from the atom bodies is an
independent check on the edges actually persisted.

WHERE: `packages/storage/src/pg-storage.ts`, inside `writePropertyAtomsBatch` (method opens at 297):

    const links = appliesToLinksFromPropertyAtoms(instances);
    assertEdgesNotStarved(instances, links.length);
    ...
    if (links.length > 0) await this.writeAtomLinks(links, sql);

    // packages/atoms/src/write-boundary.ts:151-161
    export function assertEdgesNotStarved(atoms, linksWritten) {
      const expected = expectedAppliesToCount(atoms);
      if (expected > 0 && linksWritten !== expected) throw ...
    }

`expectedAppliesToCount` (write-boundary.ts:138-149) skips `parcel-node`, skips a falsy
`parcelNodeId`, and skips county-coverage. `appliesToLinkFromPropertyAtom`
(parcel-write-identity.ts:217-228) returns null for exactly those same three conditions, in the same
order. The two sides are the SAME predicate over the SAME array, so `linksWritten === expected` is
true by construction on every call. The parameter is named `linksWritten` and is not the number of
links written: it is computed BEFORE the transaction and never compared against what `writeAtomLinks`
actually persisted.

FAILURE MODE: the guard is VACUOUS. It cannot fire, and the condition it is named for, a starved
edge, is unmeasured. This is the most valuable row in the register under rule 4.

GUARDED: this IS the guard.

KNOWN VIOLATORS: not applicable; nothing can violate a check that cannot fail.

PRE-RUN DETECTABLE: yes, statically. Verify by violation: there is no atom array and no value of
`linksWritten` produced by `appliesToLinksFromPropertyAtoms` over the same array that makes the throw
fire. The fix shape is to pass the row count returned by `writeAtomLinks` rather than `links.length`,
which converts internal consistency into a real second derivation.

CONFIDENCE: read-at-source.

### ENG-05

BELIEF: a lease TTL chosen by the operator survives the run.

WHERE: `packages/storage/src/atoms-writer-lease.ts:26` and `:310-321`, against
`packages/engine-core/scripts/writer-apply-lease.mjs:65-83`.

    export const DEFAULT_LEASE_TTL_MS = 15 * 60 * 1000;

    // lockAndHeartbeatLease, called once per writePropertyAtomsBatch with NO options:
    const expiresIso = new Date(now.getTime() + ttlMsOrDefault(options?.ttlMs)).toISOString();
    ... SET heartbeat = ${nowIso}, expires = ${expiresIso}

`railLeaseArgs` returns `{scope, holder_label, run_id}` and no `ttlMs`. A grep for `ttlMs` or `TTL`
over `packages/engine-core/scripts/*.mjs` returns NOTHING. Only the standalone CLI
`packages/storage/scripts/atoms-writer-lease.mjs:58` exposes `--ttl-sec`, and a writer takes its own
lease rather than adopting one. So every county writer takes 15 minutes, and pg-storage calls
`lockAndHeartbeatLease(sql, lease)` with no options, which RESETS `expires` to now plus 15 minutes. A
longer TTL taken out of band would be silently shortened by the first batch write.

The Harris incident is otherwise FIXED at this SHA: in `write-parcel-node-county.mjs` the atoms are
built before the apply branch and `takeScopedLease` is called at `:468`, after planning, so the plan
phase is no longer inside an unheartbeaten lease. The residual is that the 15-minute window now
bounds a SINGLE batch plus its read-back verify, with no resume.

FAILURE MODE: lease-loss mid-county. Loud (`LEASE_EXPIRED` / `ATOMS_WRITER_LEASE_NOT_HELD`), and it
leaves a partially written county with no resume path.

GUARDED: fail-closed. `takeScopedLease` steals only a scope whose `expires <= now` (`:255`), and the
prior holder's next heartbeat finds no row for its `holder_token` and throws.

KNOWN VIOLATORS: any county whose per-batch write plus verify can exceed 15 minutes. Neon
autosuspend between batches is the realistic trigger.

PRE-RUN DETECTABLE: yes, statically: `railLeaseArgs` has no ttl parameter, so no county can be given
one. Operationally, take the worst observed batch duration from a prior county's `writeAccum` and
`verifyAccum` and compare against 900 seconds.

CONFIDENCE: read-at-source.

### ENG-06

BELIEF: `foldedExtraFeatures` counts one thing.

WHERE: `packages/engine-core/src/parcel-node/plan-county-parcel-nodes.ts:456-484`.

    const byAccount = new Map<string, FeatureView[]>();
    ...
    const bucket = byAccount.get(view.parcelKey);   // view.parcelKey is ALREADY normalized (:446)
    ...
    if (extras.length > 0) { multiFeatureAccounts += 1; foldedExtraFeatures += extras.length; }

Two different causes land in the same bucket and are reported by the same counter: (a) one real
account genuinely spanning several source features, which is the designed behaviour and the Tarrant
case, and (b) two DISTINCT accounts whose raw ids differ only in leading zeros, which is ENG-02's
collapse. Nothing distinguishes them, so `foldedExtraFeatures` cannot answer whether a county is
healthy or is silently merging accounts.

FAILURE MODE: silent-collapse hidden inside a legitimate counter.

GUARDED: partial. The fold itself is deliberate and counted; the CAUSE is not recorded.

KNOWN VIOLATORS: Tarrant for cause (a): 28,665 prop_ids over more than one feature, one prop_id at
532 rows and 111 owner names (dispatch context, not re-derived by this lane). Cause (b) is
unmeasured.

PRE-RUN DETECTABLE: yes, and the split is cheap. Run ENG-02's parcel-side query; its
`features_folded_by_zero_strip` is cause (b), and the remainder of `foldedExtraFeatures` is cause (a).

CONFIDENCE: read-at-source.

### ENG-07

BELIEF (`verifyStoredParcelNodeAtom`): comparing `geometryStoreRef` to `parcelNodeId` proves the
pointer resolves in `txgio_parcel`.

WHERE: `packages/engine-core/src/parcel-node/parcel-node-atoms.ts:243`, with the claim at `:202`.

    //   3. a resolved atom's pointer names the same county+key it claims, so the
    //      pointer actually resolves in `txgio_parcel`.
    if (`${ref.countyFips}:${ref.propId}` !== atom.parcelNodeId) { ... }

Both operands are fields of the SAME body, and the builder writes both from one variable:
`parcel-node-writer.ts:147` sets `parcelNodeId` and `:156` sets `geometryStoreRef.propId`, both from
`observation.parcelKey`. One upstream acting alone satisfies both sides, so this is internal
consistency, not the resolution proof the comment claims, and it is guaranteed to pass. Separately,
`ref.propId` holds the NORMALIZED key while `txgio_parcel.prop_id` is raw, so the pointer only
resolves because the resolver applies its own, different, normalization (ENG-03) - the part this
check does not test at all.

FAILURE MODE: the guard cannot fire on the defect it names, and it is reported as verification.

GUARDED: this IS the guard.

KNOWN VIOLATORS: not applicable.

PRE-RUN DETECTABLE: yes, statically, by reading `parcel-node-writer.ts:147` and `:156`. A real second
derivation would be an EXISTS against `txgio_parcel` for the raw key.

CONFIDENCE: read-at-source.

### ENG-08

BELIEF (`assertDidNamespace`): the body atomDid and the column atom_did are checked for agreement.

WHERE: `packages/atoms/src/write-boundary.ts:74` and `:78`.

    if (bodyDid == null || bodyDid === "") return;
    // ...
    if (!bodyDid.startsWith("did:")) return;

Every property-fact atomDid minted in this repo is a prefixed FNV token, never a `did:` string:
`cadroll_`, `lufact_`, `ownfact_`, `wlfact_`, `ueasm_`, `fhfact_`, `railfact_`, `pipefact_`,
`bfoot_`, `sdfact_` (fact-writer-ids.ts:51-158). All of them take the early return at `:78`. Only
`parcel-node` mints a `did:` form, via `parcelNodeAtomDid`. The narrowness is declared in the comment
at `:75-77`; the register carries it because the function is called unconditionally from
`assertPropertyWriteBoundary:134` on EVERY atom and therefore reads as universal coverage at the call
site.

FAILURE MODE: dormant for 10 of 11 property atom families. Not a wrong value, but a control whose
claim at its call site is broader than its reach.

GUARDED: partial. `resolvePropertyAtomDid` (property-atom-batch-write.ts:47-52) then ignores the body
did entirely for these families and mints the column from `entityType` plus `entityId`, so the body
did is never the stored identity and is decorative for those families.

KNOWN VIOLATORS: all counties, all fact families except parcel-node.

PRE-RUN DETECTABLE: yes, statically.

CONFIDENCE: read-at-source.

### ENG-09

BELIEF (`dedupePreparedRowsLastWins`): rows that collide on `atom_did` within one batch are
interchangeable.

WHERE: `packages/storage/src/property-atom-batch-write.ts:55-63` and `:97-101`.

    const byDid = new Map<string, PreparedPropertyAtomRow>();
    for (const row of rows) byDid.set(row.atom_did, row);   // silent overwrite, no count
    return [...byDid.values()];

    // preparePropertyAtomRows: `out` is built from ALL instances, `rows` only after dedupe
    return { rows: dedupe ? dedupePreparedRowsLastWins(rows) : rows, out };

`writePropertyAtomsBatch` returns `out`, so the caller's success count is the PRE-dedupe count. The
county writers then do `summary.atomsWritten += slice.length`
(`write-parcel-node-county.mjs:486`, `write-owner-fact-county.mjs:417`), which does not even read the
return value. A collapse of N rows into 1 reports N written.

The write-then-verify does not catch it either: the read-back looks up
`did:hauska:<type>:<entityId>` and matches on `body.atomDid`, and two collapsed atoms share BOTH, so
both verify against the same stored row and both pass. A report of `1,523,640/1,523,640 verified` is
consistent with any number of collapses.

FAILURE MODE: silent-collapse plus an overstated count presented as verified.

GUARDED: none. The collapse population is computed at `:58-62` and discarded; `byDid.size` versus
`rows.length` is the whole measurement and it is one line away.

KNOWN VIOLATORS: none known. Same unmeasured population as ENG-02.

PRE-RUN DETECTABLE: partly. Statically, the count identity above. At run time, compare `byDid.size`
against `rows.length` per batch, or after a run compare
`SELECT COUNT(*) FROM atoms WHERE entity_type = $1 AND entity_id LIKE $2 || ':%'` against the
reported `atomsWritten`. Two numbers that should agree and do not is the finding.

CONFIDENCE: read-at-source.

### ENG-10

BELIEF (`syntheticParcelKey`, invariant S1): two vintages can never produce the same synthetic key
for a keyless feature.

WHERE: `packages/engine-core/src/parcel-node/plan-county-parcel-nodes.ts:225-244`, invariant stated
at `:185-207`.

    export function sanitizeVintageToken(sourceVintage) {
      const raw = (sourceVintage ?? "").trim();
      if (raw.length === 0) return "unknown";
      const cleaned = raw.replace(/[^A-Za-z0-9.-]+/g, "-").replace(/^-+|-+$/g, "");
      return cleaned.length === 0 ? "unknown" : cleaned;
    }

The invariant claims the collision is UNREPRESENTABLE. It is representable in two ways. First, a null
or blank `source_vintage` in two different loads both yield `"unknown"`, so V1 feature 7 and V2
feature 7 both key to `_feature-unknown-7` and the second upserts onto the first, which is exactly
the false continuity the invariant forbids. Second, two vintages differing only in stripped
characters collapse: `"2025 Q1"` and `"2025/Q1"` both become `"2025-Q1"`.

FAILURE MODE: silent-wrong-value. One vintage's land reads as another vintage's parcel continuing.

GUARDED: none. The sanitizer's fallback is the hole, and the invariant docstring directly above
asserts the property the fallback breaks.

KNOWN VIOLATORS: none known. Requires a county load with a null or blank `source_vintage`.

PRE-RUN DETECTABLE: yes.

    SELECT county_fips,
           COUNT(*) FILTER (WHERE source_vintage IS NULL OR btrim(source_vintage) = '') AS blank_vintage_rows,
           COUNT(DISTINCT source_vintage)                                               AS raw_vintages,
           COUNT(DISTINCT regexp_replace(btrim(coalesce(source_vintage,'')),
                                         '[^A-Za-z0-9.-]+','-','g'))                    AS sanitized_vintages
    FROM txgio_parcel
    WHERE county_fips = $1
    GROUP BY 1;

`blank_vintage_rows > 0`, or `sanitized_vintages < raw_vintages`, means S1 does not hold for that
county.

CONFIDENCE: read-at-source.

### ENG-11

BELIEF (`resolveDeclaredCadVintage`): a declared CAD vintage exists for the county being processed.

WHERE: `packages/engine-core/src/cad-vintage/resolve-declared-cad-vintage.ts:25-41` and `:57-65`.

    export const DECLARED_CAD_VINTAGES = Object.freeze({ "48021": {...}, ... });   // 15 entries
    if (!resolved) throw new Error(`cad vintage FAIL CLOSED: no declared current_tax_year/current_tier for county ...`);

Fifteen counties: 48021, 48027, 48029, 48055, 48085, 48091, 48113, 48121, 48187, 48209, 48257, 48309,
48439, 48453, 48491. The other 239 Texas counties throw.

FAILURE MODE: loud-throw. Correct behaviour, and a hard statewide blocker: every CAD-derived rail
(owner-fact, land-use-fact, cad-parcel-roll) refuses for 239 counties before any atom is planned.

GUARDED: fail-closed, correctly, and the writers additionally refuse a `--taxYear` that disagrees
(`write-owner-fact-county.mjs:218`, `write-land-use-fact-county.mjs:201`,
`write-cad-parcel-roll-county.mjs:220`).

KNOWN VIOLATORS: 239 of 254 counties, by enumeration of the map above.

PRE-RUN DETECTABLE: yes, with no database, because the map is a literal. Compare it against the
county set a wave intends to process before the wave is dispatched.

CONFIDENCE: read-at-source.

### ENG-12

BELIEF: the engine's declared-vintage map stays in lockstep with the LDT source it mirrors.

WHERE: same file, `:1-10`.

    * Engine cannot import `@workspace/cad-ingest`. Keep this map in lockstep
    * with lib/cad-ingest/src/vintage.ts DECLARED_CAD_VINTAGES; parity test
    * freezes the fixture at packages/engine-core/src/cad-vintage/declared-fixture.json.

The parity test compares the engine map to a CHECKED-IN FIXTURE in the same repo. Both halves live in
hauska-engine, so both can drift from the real LDT source together and the test still passes. The
second derivation is not independent. Separately, Factory takes the LATEST `cad_property.tax_year`
while the engine takes this declared year, and Factory's owner cell does not record which year it
reflects, so the two sides can disagree with no detector.

FAILURE MODE: silent-wrong-value across the engine and Factory seam. A cell reads as current while
the atom behind it is a different tax year.

GUARDED: partial on the engine side, via the fixture parity test; none across the seam.

KNOWN VIOLATORS: 48113 and 48439 both carry inline comments recording a flip made by hand on
2026-08-14, which is evidence the map is maintained by hand rather than derived.

PRE-RUN DETECTABLE: yes.

    SELECT county_fips, MAX(tax_year) AS latest_tax_year
    FROM cad_property GROUP BY 1 ORDER BY 1;

Compare column 2 against `DECLARED_CAD_VINTAGES[county].taxYear`. Any disagreement is a county where
Factory and engine will write different years for the same parcel.

CONFIDENCE: read-at-source.

### ENG-13

BELIEF (`listPropertyAtomsByParcelNodeId`): the most recently UPDATED atom of a type is the one to
serve.

WHERE: `packages/storage/src/pg-storage.ts`, the method immediately after `writePropertyAtomsBatch`.

    ORDER BY entity_type ASC, updated_at DESC
    ...
    if (inst.entityId === parcelNodeId && prior.entityId !== parcelNodeId) byType.set(...)

Owner-fact, land-use-fact and cad-parcel-roll all use `entityId = ${parcelNodeId}:${taxYear}`
(`owner-fact-writer.ts:94-96`, stated at `:12-13`). No such entityId ever equals the bare
`parcelNodeId`, so the preference branch never fires for them and the FIRST row in `updated_at DESC`
order wins. That is the most recently WRITTEN atom, not the most recent TAX YEAR. A 2025 backfill run
after a 2026 write serves 2025.

FAILURE MODE: silent-wrong-value, and it contradicts MOST-CURRENT-SOURCE-WINS.

GUARDED: none for the tax-year case. `setback-rule` has a dedicated tiebreaker
(`pickPreferredSetbackRule`); the CAD-derived families have none.

KNOWN VIOLATORS: any county written more than once at different tax years, out of year order.

PRE-RUN DETECTABLE: yes.

    SELECT entity_type, split_part(entity_id, ':', 1) AS county_fips, COUNT(*) AS wrong_year_served
    FROM (
      SELECT entity_type, entity_id,
             row_number() OVER (PARTITION BY entity_type, regexp_replace(entity_id,':[0-9]{4}$','')
                                ORDER BY updated_at DESC) AS by_write,
             row_number() OVER (PARTITION BY entity_type, regexp_replace(entity_id,':[0-9]{4}$','')
                                ORDER BY (regexp_match(entity_id,':([0-9]{4})$'))[1]::int DESC) AS by_year
      FROM atoms
      WHERE entity_type IN ('owner-fact','land-use-fact','cad-parcel-roll')
        AND entity_id ~ ':[0-9]{4}$'
    ) t
    WHERE by_write = 1 AND by_year <> 1
    GROUP BY 1,2;

CONFIDENCE: read-at-source.

### ENG-14

BELIEF: `cad_property.exemption_codes` is an array column in every county's load.

WHERE: `packages/engine-core/scripts/write-owner-fact-county.mjs:289`.

    exemptionCodes: Array.isArray(p.exemption_codes) ? p.exemption_codes : null,

Anything that is not an array - a delimited TEXT value, a JSON string, a null - becomes `null`.
`deriveExemptionFlags(null)` returns `undefined` (`owner-fact-writer.ts:74`), the field is omitted
from the atom, and the whole county silently carries no exemption flags.

FAILURE MODE: silent-wrong-value at county scale. A county with full homestead data reads as a county
with none.

GUARDED: none. Nothing counts how many rows produced flags versus how many were dropped.

KNOWN VIOLATORS: none known.

PRE-RUN DETECTABLE: yes, in two cheap queries.

    SELECT data_type, udt_name FROM information_schema.columns
     WHERE table_name = 'cad_property' AND column_name = 'exemption_codes';

    SELECT county_fips, tax_year, COUNT(*) AS rows,
           COUNT(*) FILTER (WHERE exemption_codes IS NOT NULL) AS non_null
    FROM cad_property GROUP BY 1,2 ORDER BY 1,2;

A county at `non_null = 0` will write no exemption flags, and the run will not say so.

CONFIDENCE: read-at-source.

### ENG-15

BELIEF (`deriveExemptionFlags`): a code whose text starts with one of these prefixes means that
exemption, and an empty code list means no exemptions.

WHERE: `packages/atoms/src/owner-fact-writer.ts:71-92`.

    if (!exemptionCodes || exemptionCodes.length === 0) return undefined;
    ...
    homestead:          has("HS", "HB", "HT"),
    seniorOrDisability: has("OV65", "O65", "DP", "DI"),
    agricultural:       has("AG", "1D", "OS", "TIM", "WL"),
    veteran:            has("DV", "VET"),

Two assumptions in one function. First, the prefix table is uniform across 254 appraisal districts;
the docstring reasons only about false negatives, which makes FALSE POSITIVES the unexamined risk (a
local code beginning `DI`, `OS` or `AG` that is not that exemption). Second, and worse, three
distinct input states - no codes present, an empty array, and the field never acquired - all return
`undefined`, so the atom omits the field identically. Absent, zero and unmeasured are collapsed into
one representation.

FAILURE MODE: silent-wrong-value on the prefix table; silent state collapse on the absence.

GUARDED: none.

KNOWN VIOLATORS: none known. Would require a per-county exemption code inventory, which does not
exist in this repo.

PRE-RUN DETECTABLE: yes.

    SELECT county_fips, code, COUNT(*)
    FROM cad_property, unnest(exemption_codes) AS code
    WHERE county_fips = $1
    GROUP BY 1,2 ORDER BY 3 DESC;

Any code matching a prefix that is not that exemption is a false positive waiting to be written.

CONFIDENCE: read-at-source.

### ENG-16

BELIEF: the `flood-hazard-fact` identity and content hash capture the claim.

WHERE: `packages/atoms/src/fact-writer-ids.ts:100-106` and
`packages/atoms/src/flood-hazard-fact-writer.ts:69-87`, stated at `:6`.

    export function floodHazardFactAtomDid(identity: { parcelNodeId: string }): string {
      return `fhfact_${fnv1a64Hex(JSON.stringify(["flood-hazard-fact", identity.parcelNodeId]))}`;
    }

    return factClaimContentHash([
      parts.parcelNodeId, parts.sourceTier,
      parts.inSpecialFloodHazardArea ?? null, parts.floodZone ?? null,
      parts.absenceKind ?? null, parts.absenceReason ?? null,
      parts.verifiedAbsenceScope ? [...parts.verifiedAbsenceScope] : null,
    ]);

Two problems. The identity carries no NFHL edition, so a re-run against a new FIRM upserts in place
and the prior claim is gone; under "atom equals one claim from one authority at ONE TIME" this atom
cannot express two times. And the content hash omits `baseFloodElevation` and `zoneSubtype`, both of
which the builder does write (`:109-110` and the block following), so a parcel whose BFE changed
keeps the SAME content hash and any change detector reading `content_hash` sees no change.

FAILURE MODE: silent-wrong-value, and a change detector that cannot detect a BFE change.

GUARDED: none.

KNOWN VIOLATORS: every county, on the second NFHL edition.

PRE-RUN DETECTABLE: yes, statically, by reading the two functions. Confirm in store with:

    SELECT COUNT(*) FROM atoms
    WHERE entity_type = 'flood-hazard-fact' AND body ? 'baseFloodElevation';

Any non-zero is a population whose content hash does not cover a field it carries.

CONFIDENCE: read-at-source.

### ENG-17

BELIEF: the geometry resolver's join returns THE parcel, and a miss means the parcel is absent.

WHERE: `packages/engine-core/src/parcel-terrain/parcel-geometry-resolver.ts:166-181` and `:146-147`.

    WHERE county_fips = ${countyFips}
      AND regexp_replace(prop_id, '^0+', '') = regexp_replace(${propId}, '^0+', '')
    ORDER BY ingested_at DESC
    LIMIT 1
    ...
    if (!row || !validBbox(row)) return null;

`LIMIT 1` silently picks one row when the normalized key matches many, which is precisely the
account-is-not-feature case: a Tarrant prop_id with 532 features returns whichever was ingested last.
Separately, `!row` (nothing found) and `!validBbox(row)` (found, but with a degenerate or null bbox)
both return `null`, so "no such parcel" and "this parcel's stored bbox is unusable" are
indistinguishable to every caller.

FAILURE MODE: silent-wrong-value on the LIMIT 1; silent state collapse on the null.

GUARDED: none.

KNOWN VIOLATORS: Tarrant for the multi-feature case (28,665 prop_ids over more than one feature).

PRE-RUN DETECTABLE: yes.

    -- how often LIMIT 1 is choosing
    SELECT county_fips, COUNT(*) AS join_keys_with_many_rows
    FROM (
      SELECT county_fips, regexp_replace(btrim(prop_id),'^0+','') AS k, COUNT(*) AS n
      FROM txgio_parcel WHERE county_fips = $1 GROUP BY 1,2
    ) t WHERE n > 1 GROUP BY 1;

    -- how often a found row is discarded as if absent
    SELECT county_fips, COUNT(*) AS rows_with_unusable_bbox
    FROM txgio_parcel
    WHERE county_fips = $1
      AND (west_lng IS NULL OR south_lat IS NULL OR east_lng IS NULL OR north_lat IS NULL
           OR east_lng <= west_lng OR north_lat <= south_lat)
    GROUP BY 1;

CONFIDENCE: read-at-source.

### ENG-18

BELIEF: `regexp_replace(prop_id, ...)` in the join predicate is cheap.

WHERE: the same query, `:176`.

The left side wraps the column in a function, so no index on `prop_id` can serve the predicate and
each resolve scans the `county_fips` partition. At Harris scale that is roughly 1.5M parcels plus
tile inflation, per lookup. The repo has already measured and documented this exact class of cost on
this store: `write-parcel-node-county.mjs:493-498` records 229,382 ms per 5,000-id batch versus 399
ms by primary key, a 575x difference, with EXPLAIN BUFFERS read=3,230,674 dirtied=212,124. The same
class of predicate is still live in the resolver.

FAILURE MODE: timeout, and under the "reads time out under writer load" pattern it is
indistinguishable from a miss, because `resolve()` returns null on every failure path above it.

GUARDED: none. No functional index on `regexp_replace(prop_id,'^0+','')` appears in anything this
lane read.

KNOWN VIOLATORS: any large county. Harris first.

PRE-RUN DETECTABLE: yes, without writing anything.

    EXPLAIN (ANALYZE, BUFFERS)
    SELECT geometry FROM txgio_parcel
    WHERE county_fips = '48201'
      AND regexp_replace(prop_id,'^0+','') = regexp_replace('27303','^0+','')
    ORDER BY ingested_at DESC LIMIT 1;

A Seq Scan or a Bitmap Heap Scan over the county partition confirms the row.

CONFIDENCE: read-at-source for the code; inferred for the Harris magnitude, which extrapolates the
repo's own 2026-08-11 measurement on `atoms` rather than a measurement on `txgio_parcel`.

### ENG-19

BELIEF: an entire county fits in one Node heap.

WHERE: `packages/engine-core/scripts/write-owner-fact-county.mjs:242-319`, declared at `:236`.

    note: "two-table join in app code on one pool (no SQL JOIN); store-truth at execution time",

Three full-county materializations before planning: `parcels[]` (every distinct feature),
`cadRows[]` (every CAD row at the declared year WITH owner name, mailing address, exemption codes and
source vintage), and `otherVintageKeys` (a Set of every distinct prop_id at every other year).
`planCountyOwnerFacts` then builds `cadByKey`, `seen` and `planned` over the same cardinality. The
parcel-node planner has the same shape: `planCountyParcelNodes(rows, policy)`
(plan-county-parcel-nodes.ts:357) takes every raw tile row for the county, each carrying a GeoJSON
geometry, and builds `byFeature`, `features[]`, `byAccount` and `planned[]` over it.

FAILURE MODE: loud-throw at best (heap OOM), timeout at worst, and neither leaves a resume point.
This is the class the dispatch names: application-code loops over county-sized cardinality, Harris at
roughly 1.5M parcels.

GUARDED: none for a full run. `--limit` bounds a sample; `--limit=0` is the county default and
`softCeiling` is then `Number.POSITIVE_INFINITY` (`:246`).

KNOWN VIOLATORS: none confirmed by this lane. Harris is the obvious candidate.

PRE-RUN DETECTABLE: yes. Size the county before dispatching it:

    SELECT (SELECT COUNT(DISTINCT feature_index) FROM txgio_parcel WHERE county_fips=$1) AS features,
           (SELECT COUNT(*)                FROM cad_property WHERE county_fips=$1 AND tax_year=$2)  AS cad_rows,
           (SELECT COUNT(DISTINCT prop_id) FROM cad_property WHERE county_fips=$1 AND tax_year<>$2) AS other_vintage_keys,
           (SELECT pg_size_pretty(SUM(pg_column_size(owner_name) + pg_column_size(owner_mailing_address)))
              FROM cad_property WHERE county_fips=$1 AND tax_year=$2) AS owner_text_bytes;

CONFIDENCE: read-at-source.

### ENG-20

BELIEF: `prop_id` is unique within `(county_fips, tax_year)`, so keyset pagination on it is safe.

WHERE: `packages/engine-core/scripts/write-owner-fact-county.mjs:271-295`, and the sibling block at
`:300-318`.

    WHERE county_fips = ${args.county} AND tax_year = ${taxYear} AND prop_id > ${lastProp}
    ORDER BY prop_id LIMIT ${cadPageSize}
    ...
    lastProp = page[page.length - 1].prop_id;

A strictly-greater cursor on a non-unique column SKIPS every remaining row sharing the last page's
final `prop_id`. Since the open question in ENG-02 is exactly whether duplicate and near-duplicate
prop_ids exist, this assumption is unproven by the same evidence that makes it doubtful.

FAILURE MODE: silent-skip. The skipped CAD rows never enter `cadByKey`, so their parcels are planned
as `no-cad-row` absences: a manufactured absence that looks like a finding.

GUARDED: none. The loop's only termination checks are `page.length === 0` and
`page.length < cadPageSize`.

KNOWN VIOLATORS: none known.

PRE-RUN DETECTABLE: yes, in one query.

    SELECT COUNT(*) AS duplicate_prop_ids,
           SUM(n) - COUNT(*) AS rows_at_risk_of_keyset_skip
    FROM (SELECT prop_id, COUNT(*) AS n
          FROM cad_property WHERE county_fips = $1 AND tax_year = $2
          GROUP BY 1 HAVING COUNT(*) > 1) t;

Zero is a positive determination of safety for that county and year.

CONFIDENCE: read-at-source.

### ENG-21

BELIEF: all tile rows of one source feature carry the same `prop_id`, so any representative will do.

WHERE: `packages/engine-core/src/parcel-node/plan-county-parcel-nodes.ts:339-347` versus
`packages/engine-core/scripts/write-owner-fact-county.mjs:249`.

    // planner: lowest tile_key wins
    function representativeOf(rows) {
      let best = rows[0]!;
      for (const row of rows) if (row.tileKey < best.tileKey) best = row;
      return best;
    }

    -- owner writer: whichever row the group returns first
    SELECT DISTINCT ON (feature_index) feature_index, prop_id ... ORDER BY feature_index

Two writers, two different representative-picking rules over the same table, with no divergence test.
`DISTINCT ON (feature_index) ... ORDER BY feature_index` leaves the row choice within the group
unspecified, while the planner deterministically picks the lowest `tile_key`. If tile rows of one
feature ever disagree on `prop_id`, the parcel-node atom and the owner-fact atom for the same feature
can be keyed differently, and the owner fact then applies to a parcel node that does not exist.

FAILURE MODE: silent-wrong-value, and an orphaned applies-to edge that ENG-04 cannot catch.

GUARDED: none.

KNOWN VIOLATORS: none known.

PRE-RUN DETECTABLE: yes.

    SELECT county_fips, COUNT(*) AS features_with_disagreeing_prop_id
    FROM (SELECT county_fips, feature_index, COUNT(DISTINCT btrim(prop_id)) AS n
          FROM txgio_parcel WHERE county_fips = $1 GROUP BY 1,2) t
    WHERE n > 1 GROUP BY 1;

CONFIDENCE: read-at-source.

### ENG-22

BELIEF: an account's geometry can be judged from its primary feature.

WHERE: `packages/engine-core/src/parcel-node/plan-county-parcel-nodes.ts:477-516`, stated at
`:486-489`.

    bucket.sort((a, b) => a.featureIndex - b.featureIndex);
    const primary = bucket[0]!;
    ...
    const shape = classifyGeometryShape(primary.row.geometry);

The primary is the LOWEST feature index, a shapefile sequence number with no relation to size or
representativeness. Two consequences. If the primary's ring is unusable but a sibling feature has a
good ring, the whole account is written as `no-parcel-geometry`: a verified absence for a parcel that
has geometry. If the primary is reducible, the account is written `resolved` and the pointer resolves
ONE feature, so for the Tarrant prop_id carrying 532 rows a consumer following the pointer gets one
fragment presented as the parcel. `additionalFeatureIndexes` records the count, but the atom's
outcome is still `resolved`.

FAILURE MODE: silent-wrong-value in both directions, and a fabricated verified-absence in the first.

GUARDED: partial. The extras are counted and carried on the atom, which is honest accounting; the
SERVED answer is still one ring.

KNOWN VIOLATORS: Tarrant, 28,665 multi-feature prop_ids.

PRE-RUN DETECTABLE: yes.

    SELECT county_fips, COUNT(*) AS accounts_where_primary_is_unusable_but_a_sibling_is_not
    FROM (
      SELECT county_fips, btrim(prop_id) AS raw,
             bool_or(geometry IS NOT NULL) AS any_geom,
             (array_agg(geometry ORDER BY feature_index))[1] IS NULL AS primary_null
      FROM txgio_parcel WHERE county_fips = $1 AND btrim(prop_id) !~ '^0+$'
      GROUP BY 1,2
    ) t WHERE primary_null AND any_geom GROUP BY 1;

CONFIDENCE: read-at-source.

### ENG-23

BELIEF (`mintParcelFactIdentity`): entity-id suffixes are contract-legal tokens.

WHERE: `packages/atoms/src/parcel-write-identity.ts:145-165` and `:167-178`.

    const entityId = suffixes.length === 0
      ? base.parcelNodeId
      : `${base.parcelNodeId}:${suffixes.join(":")}`;
    assertCanonicalParcelEntityId(entityId);

`assertCanonicalParcelEntityId` only rejects the two named sentinels and the decimal-padded grammar
ON TOKEN 1. It never applies the token alphabet `/^[A-Za-z0-9._-]+$/` that the planner applies at
`plan-county-parcel-nodes.ts:419`. So `specialDistrictPresentEntityId(pnid, "MUD 1")` produces
`48021:27303:sd:MUD 1`, with a space, and it passes both this assertion and `assertCanonicalBinding`
in write-boundary. A suffix containing a colon silently changes the token count.

FAILURE MODE: silent-wrong-value in a key. Readers that split on `:` or re-parse the id see a
different shape than the writer intended.

GUARDED: partial. The parcel-node PATH is guarded at the planner; the FACT suffix path is not.

KNOWN VIOLATORS: none known. Depends on the district id vocabulary the special-district writer is
fed.

PRE-RUN DETECTABLE: yes.

    SELECT entity_type, COUNT(*)
    FROM atoms
    WHERE entity_id ~ '[^A-Za-z0-9._:-]'
    GROUP BY 1 ORDER BY 2 DESC;

CONFIDENCE: read-at-source.

### ENG-24

BELIEF: `refuseApplyOutsideCloudRunJob` freezes laptop writes.

WHERE: `packages/engine-core/scripts/writer-apply-lease.mjs:53-63`, with its own scope note at
`:50-51`.

    * P-169 wires it into write-building-footprint-county.mjs only -- the other three writers
    * (well-fact, utility-easement, setback) are a different lane's scope.

Enumerated call sites at this SHA: `write-building-footprint-county.mjs:129` and
`retag-building-footprint-county.mjs:130`. That is 2 scripts. `refuseApplyWithoutRunId` reaches 4:
building-footprint, parcel-node, utility-easement, well-fact. Neither reaches owner-fact,
land-use-fact, flood-hazard-fact, cad-parcel-roll, special-district, rail-corridor or rrc-pipeline.
Those rails rely instead on `takeScopedLease` refusing an empty `run_id`
(`atoms-writer-lease.ts:218`), which is a weaker check on a different property, and three of them do
not take a lease at all (ENG-01).

FAILURE MODE: a control narrower than its name. Not itself a wrong value; it means the laptop-write
freeze is enforced for one rail.

GUARDED: this IS the guard. Its narrowness is declared in its own docstring, which is the honest
form.

KNOWN VIOLATORS: every writer script other than the two named.

PRE-RUN DETECTABLE: yes, statically:
`git grep -l refuseApplyOutsideCloudRunJob packages/engine-core/scripts/write-*.mjs`.

CONFIDENCE: read-at-source.

### ENG-25

BELIEF (retrieval-api): a place key can be constructed when resolution fails.

WHERE: `services/retrieval-api/src/parcel-record-reader.ts:161-162`.

    const placeKey =
      resolution.state === "resolved" ? resolution.placeKey : `${countyFips}:${normalizedPropId}`;

On `not-found`, the reader fabricates a place key that is known not to exist in `parcel_record`, then
loads every rail against it. Every cell misses, and the response carries `placeKey` as if it were the
parcel's identity, so a consumer echoing it believes it.

Adjacent, at `parcel-record-db.ts:164-169`: `loadGateVerdict` wraps its query in a bare `catch`
returning `null`, so a connection failure, a revoked grant and a genuinely ungraded pair all produce
the same `gate.verdict: null`. The degradation IS declared in the response, since `serve` stays
`legacy-transitional` (`parcel-record-reader.ts:107-109`), which is the honest half; the three input
states remain indistinguishable to the consumer.

FAILURE MODE: silent-wrong-value on the fabricated key; silent state collapse on the gate.

GUARDED: partial. `ambiguous` refuses loudly (`:144-158`) and is a genuinely good control.
`not-found` does not.

KNOWN VIOLATORS: any parcel not yet in the Factory store; any county whose raw prop_id carries more
than `MAX_ZERO_PAD_ATTEMPTS` (6) leading zeros (`parcel-record-db.ts:86`).

PRE-RUN DETECTABLE: yes, for the pad ceiling.

    SELECT county_fips, MAX(length(raw) - length(ltrim(raw,'0'))) AS max_leading_zeros
    FROM (SELECT county_fips, btrim(prop_id) AS raw
          FROM cad_property WHERE btrim(prop_id) ~ '^0+[0-9]') t
    GROUP BY 1 HAVING MAX(length(raw) - length(ltrim(raw,'0'))) > 6;

Any row returned is a county where the reader's crosswalk cannot reach its own parcels.

CONFIDENCE: read-at-source.

### ENG-26

BELIEF (`factClaimContentHash`): `JSON.stringify` of the parts is a canonical form.

WHERE: `packages/atoms/src/fact-writer-ids.ts:47-49`, and `fnv1a64Hex` at `:34-41`.

    export function factClaimContentHash(parts: unknown): string {
      return `fnv1a64:${fnv1a64Hex(JSON.stringify(parts))}`;
    }

Two assumptions. `JSON.stringify` preserves key INSERTION order and drops `undefined`, so two
semantically identical claims built by different code paths hash differently, and a field set to
`undefined` hashes the same as a field never set. Every current caller passes an ARRAY, which makes
the order stable in practice; the signature is `unknown` and does not enforce it. Separately,
`fnv1a64Hex` XORs `charCodeAt`, which is UTF-16 code units rather than bytes, so it is not FNV-1a over
the string's encoding. It is deterministic, but it is not the algorithm its name claims, and a
surrogate pair in an owner name is folded as two units.

FAILURE MODE: silent-wrong-value for a change detector, at low probability. A 64-bit space over
roughly 1.1e8 atoms gives a birthday collision probability near 3e-4, which is small, is not zero,
and is not detected anywhere.

GUARDED: none.

KNOWN VIOLATORS: none known.

PRE-RUN DETECTABLE: yes, in store.

    SELECT content_hash, COUNT(DISTINCT atom_did) AS distinct_atoms
    FROM atoms WHERE entity_type = $1
    GROUP BY 1 HAVING COUNT(DISTINCT atom_did) > 1
    ORDER BY 2 DESC LIMIT 50;

CONFIDENCE: read-at-source for the code; inferred for the collision arithmetic, which uses the
111,241,840 row figure recorded in CLAUDE.md from `_inbox/2026-08-20_store_audit_atom_graph.md`, not
a measurement taken by this lane.

### ENG-27

BELIEF: the join-hold county sets are complete.

WHERE: `packages/atoms/src/fact-writer-ids.ts:16-31`.

    export const CROSSWALK_HOLD_FIPS = new Set([
      "48453","48395","48359","48393","48345","48153","48127","48295",
    ]);
    export const LANDUSE_JOIN_HOLD_FIPS = new Set(["48209","48491"]);

Eight counties and two counties, hand-declared. The header calls them "join-policy metadata for known-
bad prop_id crosswalks", which is honest about their provenance: they are the counties where someone
NOTICED. They were not derived by measuring all 254. A county with an equally bad crosswalk that
nobody probed is not in the set, will be written with a wrong join silently, and the writer will
report success. This is the same hand-declared shape as `resolveDeclaredCadVintage` (ENG-11) and
carries the same risk: the declaration is refreshed by hand after a discovery, never by derivation.

FAILURE MODE: silent-wrong-value at county scale. Another property's owner and land use written onto
tens of thousands of parcels, which is exactly what the Williamson and Hays note at
`plan-county-parcel-nodes.ts:76-79` records having already happened for roughly 97k and 78k parcels.

GUARDED: none. Membership is the only control and nothing measures non-members.

KNOWN VIOLATORS: by construction, unknown ones.

PRE-RUN DETECTABLE: yes, and this is the probe that would turn a hand-declared set into a derived
one. Run it for every county BEFORE dispatching it and compare the hit rate against the two declared
sets:

    -- What fraction of a county's TxGIO prop_ids exist in its own CAD roll at the declared year?
    WITH p AS (
      SELECT DISTINCT CASE WHEN btrim(prop_id) ~ '^[0-9]+$'
                           THEN CASE WHEN ltrim(btrim(prop_id),'0')='' THEN '0'
                                     ELSE ltrim(btrim(prop_id),'0') END
                           ELSE btrim(prop_id) END AS k
      FROM txgio_parcel
      WHERE county_fips = $1 AND btrim(prop_id) <> '' AND btrim(prop_id) !~ '^0+$'
    ),
    c AS (
      SELECT DISTINCT CASE WHEN btrim(prop_id) ~ '^[0-9]+$'
                           THEN CASE WHEN ltrim(btrim(prop_id),'0')='' THEN '0'
                                     ELSE ltrim(btrim(prop_id),'0') END
                           ELSE btrim(prop_id) END AS k
      FROM cad_property
      WHERE county_fips = $1 AND tax_year = $2 AND btrim(prop_id) <> ''
    )
    SELECT (SELECT COUNT(*) FROM p)                  AS parcel_keys,
           (SELECT COUNT(*) FROM c)                  AS cad_keys,
           (SELECT COUNT(*) FROM p JOIN c USING (k)) AS joined,
           round(100.0 * (SELECT COUNT(*) FROM p JOIN c USING (k))
                       / NULLIF((SELECT COUNT(*) FROM p),0), 2) AS join_rate_pct;

A county at a low `join_rate_pct` that is NOT in `LANDUSE_JOIN_HOLD_FIPS` is an undetected
Williamson. Run it for all 254 and the set stops being hand-declared.

CONFIDENCE: read-at-source.

---

## COULD NOT ESTABLISH

This section is not empty, which the dispatch says is itself a finding. These are the things a
read-only, database-free lane structurally cannot settle.

**Every population in this register.** Twenty-seven rows and not one carries a count. A register of
code beliefs ranks CLASSES; it cannot rank by how many counties actually violate each belief. That is
why every row carries an exact probe instead. The single highest-value follow-up is ENG-02's query,
which has never been run and which is a bounded read.

**Whether the three lease-less writers (ENG-01) are live or effectively retired by the Factory.**
Their headers carry full usage blocks and no retirement note, and OPS-19 says the Factory is the only
writer path. Whether a broken engine CLI matters depends on whether anything still invokes it, which
this lane could not establish from hauska-engine alone; it needs the Factory job definitions and the
deployed job roster. Both readings, per the reporting rule: the mechanism I believe explains it is a
regression introduced when the lease became mandatory in `writePropertyAtomsBatch` and only the
lease-taking writers were updated. The second mechanism that would produce the same observation is a
deliberate retirement of these three CLIs in favour of Factory jobs, with dead code left in place. I
rejected the second as the primary reading because a deliberate retirement would normally leave a
header note, and because siblings in the same directory WERE updated, which points at an incomplete
sweep rather than a decision. I did not verify it.

**Whether `writeAtomLinks` returns a count that could feed ENG-04's fix.** I read its call site in
`writePropertyAtomsBatch` but not its body, so I cannot say whether a real second derivation is one
line away or needs a new return value.

**The `txgio_parcel` index set.** ENG-18's claim that no functional index serves
`regexp_replace(prop_id,'^0+','')` rests on not having seen one in the files read, and an absence
inferred from files read is not a positive determination. It needs `\d+ txgio_parcel`.

**Whether `PARCEL_RECORD_SLATE`'s unslated default of `legacy-transitional`
(`parcel-record-reader.ts:92-93`) is the transitional state OPS-23 permits, or the "unslated rails
refuse, never fall to legacy" rule being violated.** The code is clear; which of the two it is, is a
canon question this lane did not have standing to settle, so the tension is recorded rather than a
verdict.

**The per-county CAD exemption code vocabularies (ENG-15).** No such inventory exists in this repo,
and the prefix table's false-positive rate cannot be bounded without one.

**Whether the `_feature-unknown-` collision in ENG-10 has already happened.** It is representable;
whether any county was loaded with a blank `source_vintage` is a store question.
