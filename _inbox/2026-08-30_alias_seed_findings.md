# `breadth_*` to `place_fips` alias seed — enumeration half

Draft for operator confirmation. **Nothing here is written anywhere.** This is a
scratchpad artifact; no product repo, no store, and no doc_repo file was touched.

## Snapshot

| | |
|---|---|
| Measured at | 2026-08-30T21:56:29Z |
| Atom store | Neon project `fancy-fire-06136146` (cortex-prod), branch `br-crimson-feather-aphfmy91`, endpoint `ep-lucky-truth-apodo8hr` (direct, unpooled), **database `hauska_mcp`**, schema `public`, table `atoms` |
| Store scale | `atoms` reltuples 111,241,840 over 192 GB (CLAUDE.md carries 100,025,152 / 131 GB from 2026-08-20; that figure is now stale) |
| Newest `breadth_48021_*` atom | 2026-08-16T22:08:37Z |
| Boundaries / roster store | same project, **database `neondb`**, tables `tx_county_boundary`, `tx_city_boundary` |
| Roster file | `P:\doc_repo\_catalog\texas_roster_v1.json`, `t6_roster_v1`, generated 2026-08-12T16:47:05Z; join derived 2026-08-11, 1,214 linked / 9 unlinked |
| doc_repo | branch `main`, commit `97d42bb4e6ab1f0814cf4af316ae6fdac30642e0` |
| Session guard | `default_transaction_read_only=on` at startup, proven by violation (below) |
| `statement_timeout` | **120000 ms** for the controls, **300000 ms** for the enumeration, **540000 ms** for the two aggregate passes. No query timed out. Nothing in this document is `unmeasured`. |

Credentials: `NEON_API_KEY` was found in the environment. Connection URIs were fetched
from the Neon control plane for the existing `neondb_owner` role and written to two
scratchpad files. No new role, branch, or endpoint was created, so there is nothing to
delete at close beyond those two local files, which are removed. No secret is printed
in this document or in the JSON.

## Verification by violation

Run before any count was believed. All four came from one `psql -f` against `hauska_mcp`.

```
--- session facts ---
db | stmt_timeout | read_only
hauska_mcp | 2min | on

--- POSITIVE CONTROL: breadth_48021_ (expect >0) ---
jurisdiction_tenant | n
breadth_48021_bastrop | 86765
breadth_48021_unknown | 67564
breadth_48021_elgin-tx | 7332
breadth_48021_cedar_creek | 6634
breadth_48021_bastrop-city-tx | 5795
(5 rows)

--- NEGATIVE CONTROL A: fabricated FIPS breadth_48999_ (expect 0 rows) ---
jurisdiction_tenant | n
(0 rows)

--- NEGATIVE CONTROL B: fabricated value (expect n=0) ---
n
0

--- NEGATIVE CONTROL C: non-vacuity, predicate must not match everything ---
matches_bastrop_prefix
0
```

Control C is the non-vacuity fixture: `WHERE p AND NOT p` must return 0, which proves
the predicate is not an always-true alternation. That is the failure mode ENFORCEMENT.md
records from 2026-08-21, and it is checked here rather than assumed.

Read-only was proven the same way:

```
$ psql ... -c "CREATE TABLE _probe_should_fail(x int);"
ERROR:  cannot execute CREATE TABLE in a read-only transaction
```

**Instrument failure caught mid-run, disclosed:** the first enumeration pass was written
with `psql ... | tee file | head -100`. `head` exited, `tee` took SIGPIPE, and the file was
silently truncated at 141 of 226 lines. Had I read that file I would have reported ~139
distinct values instead of 225. The enumeration was re-run writing to a file with no pipe.
Every count below comes from the un-piped run.

## The predicate

The index is `atoms_jurisdiction_idx btree (jurisdiction_tenant)` with the default opclass,
and `hauska_mcp` is `datcollate = C.UTF-8`. Under C collation a prefix `LIKE` compiles to a
btree range condition, so the anchored form is index-driven and no unanchored `LIKE` is used:

```
EXPLAIN SELECT jurisdiction_tenant, count(*) FROM public.atoms
 WHERE jurisdiction_tenant LIKE 'breadth\_48021\_%' GROUP BY 1;

GroupAggregate  (cost=0.57..71.11 rows=710 width=18)
  Group Key: jurisdiction_tenant
  ->  Index Only Scan using atoms_jurisdiction_idx on atoms  (cost=0.57..53.38 rows=2127 width=10)
        Index Cond: ((jurisdiction_tenant >= 'breadth_48021_'::text)
                 AND (jurisdiction_tenant < 'breadth_48021`'::text))
        Filter: (jurisdiction_tenant ~~ 'breadth\_48021\_%'::text)
```

The escaped underscores matter. `breadth_48021_%` unescaped would also admit
`breadth148021x...`; escaping makes the literal underscore literal.

Master enumeration, 2 min 44 s wall, no timeout:

```sql
SELECT jurisdiction_tenant,
       count(*)                                            AS atom_rows,
       count(DISTINCT (body->>'parcelNodeId'))             AS parcels,
       count(*) FILTER (WHERE entity_type='road-node')      AS roads,
       string_agg(DISTINCT entity_type, ',')                AS types
  FROM public.atoms
 WHERE jurisdiction_tenant LIKE 'breadth\_48021\_%'
    OR jurisdiction_tenant LIKE 'breadth\_48055\_%'
    OR jurisdiction_tenant LIKE 'breadth\_48209\_%'
    OR jurisdiction_tenant LIKE 'breadth\_48309\_%'
    OR jurisdiction_tenant LIKE 'breadth\_48453\_%'
    OR jurisdiction_tenant LIKE 'breadth\_48491\_%'
 GROUP BY 1 ORDER BY parcels DESC, atom_rows DESC;
```

## 1. The enumeration is finite: 225 distinct values

| FIPS | County | distinct `breadth_*` values | atom rows | distinct parcels | parcels under >1 value |
|---|---|---:|---:|---:|---:|
| 48021 | Bastrop | 49 | 193,717 | 62,260 | 43,800 |
| 48055 | Caldwell | 27 | 68,292 | 24,989 | 337 |
| 48209 | Hays | 87 | 294,003 | 116,421 | 0 |
| 48309 | McLennan | 58 | 208,856 | 114,255 | 0 |
| 48453 | Travis | 3 | 726,346 | 380,918 | 22,012 |
| 48491 | Williamson | 1 | 689,505 | 282,570 | 0 |
| | **Total** | **225** | **2,180,719** | **981,413** | **66,149** |

**The prior program note holds up.** It said seven spellings of Bastrop, six of Smithville,
five of Cedar Creek, four of Luling. Measured independently before comparing: within 48021,
Smithville is exactly 6 and Cedar Creek exactly 5; within 48055, Luling is exactly 4.
Bastrop in 48021 is **7 or 8** depending on one judgement call — there are 7 spellings of
the bare name (`bastrop`, `astrop`, `bastroop`, `bastropd`, `bastrrop`, `basttrop`,
`batrop`) plus `bastrop-city-tx`, which is a different key *form* rather than a misspelling.
Counting the bare spellings gives the note's seven. Three exact, one reproduced under a
stated reading. The note was not stale.

What the note did not carry is the total, and the total is the deliverable: **225 distinct
values**, and Bastrop is not the worst case. Ranked by spelling count:

| place | distinct `breadth_*` spellings | worst examples |
|---|---:|---|
| Dripping Springs (48209) | 17 | `dripping_srpings`, `drippingsprings_texas`, `dripping_spr` |
| Wimberley (48209) | 14 | `womberley`, `wimbelrey`, `wmberley` |
| San Marcos (48209 + 48055) | 13 | `tsan_marcos_tx`, `esan_marcos_tx`, `san_marocs` |
| Bastrop (48021 + 48055) | 8 | `astrop`, `bastropd`, `basttrop` |
| Smithville (48021) | 6 | `smmithville_tx`, `smihville` |
| Buda (48209 + 48055) | 6 | `biuda`, `budaa` |
| Cedar Creek (48021) | 5 | `ceder_creek`, `cedar_crekk` |
| Elgin (48021) | 5 | `elgiin`, `elgin_t` |
| Kyle (48209 + 48055) | 5 | `kyl`, `kyle_s` |
| Waco (48309) | 4 | `wacxo`, `wco` |
| Luling (48055) | 4 | `lulung`, `luing` |

Concentration is extreme, which is what makes the confirmation pass short. The top 3 values
cover 663,467 of the 1,047,727 parcel-rows (63.3 percent). **The top 25 rows cover 94.7
percent.** At the other end, 112 of the 225 values carry two parcels or fewer, and 97 carry
exactly one. `alias_seed.json` is sorted by `parcel_count` descending so the operator
confirms in that order and can stop when the marginal row stops mattering.

## 2. Confidence split

| Confidence | rows | parcel-rows | share |
|---|---:|---:|---:|
| `certain` | 33 | 180,692 | 17.2% |
| `likely` | 93 | 300,812 | 28.7% |
| `needs-human` | 99 | 566,223 | 54.0% |
| | **225** | **1,047,727** | |

`parcel-rows` sums `parcel_count` across values and therefore **double counts** the 66,149
parcels that carry more than one `breadth_*` value. Distinct parcels are 981,413. Use the
column for ordering by impact, never as a parcel population.

Rule applied for `certain`: exact match to a roster place name after case and punctuation
normalisation only, with the roster's own `parent_county_fips` agreeing. Anything that
needed a token stripped (`-tx`, a trailing zip, the legal-status word) is `likely`, not
`certain`. Nothing was promoted into `certain` on similarity.

### The semantic limit on every `certain` and `likely` row

An alias row maps **a string to a place**. It does **not** establish that the parcels
carrying that string lie inside that place's corporate limits. CAD situs city is a
**postal** city. `breadth_48209_kyle` covers 30,923 parcels; Kyle's incorporated parcel
count is far smaller, and the balance is unincorporated Hays County with a Kyle mailing
address. If the alias is consumed as a jurisdiction assertion, it fabricates city
jurisdiction on tens of thousands of real parcels — the exact defect class this program
is cleaning up. In-limits membership is a point-in-polygon question against
`tx_city_boundary`, and it is a different job from this one. Every `certain` and `likely`
note carries this sentence.

The strongest single piece of evidence for that, in the data: 48021 carries **both**
`breadth_48021_bastrop` (17,538 parcels) and `breadth_48021_bastrop-city-tx` (5,795
parcels). Two keys, one place name, a 3x parcel gap. They are not the same claim.

## 3. Resolution against the roster, not from my own knowledge

Every proposed `place_fips` comes from `texas_roster_v1.json`. Two independent derivations
are required before a misspelling is normalised:

1. **Data-derived cluster head.** Within a FIPS, the highest-parcel-count spelling that
   resolves in the roster becomes the anchor. Misspellings attach to it by
   `difflib` ratio >= 0.82. The anchor comes from the store.
2. **Roster match.** The anchor must itself resolve to a roster place whose
   `parent_county_fips` or `all_county_fips` includes the FIPS. That comes from the file.

One party cannot satisfy both halves: the store supplies the cluster, the roster supplies
the identity and the county. Below 0.82 nothing is proposed; the row becomes `needs-human`
and the note names the closest in-county roster place as a *lead*, explicitly not a mapping.

A second index on the roster's `full_name` (`Bastrop city`, `Buda town`) was added after it
caught a real error: `breadth_48021_bastrop-city-tx`, 5,795 parcels, was initially graded
as an unincorporated place because `bastrop city` does not match the `name` field. It is
consulted only on a primary-index miss and only on a single hit. One collision exists in
the roster (`Clarksville City` versus `Clarksville city`); it is in Gregg County and cannot
reach these six.

**Straddles.** The brief's roster arithmetic reproduces exactly: 72 places hold territory
in the six counties, 69 have their primary county among the six, **24 of the 72 straddle**
(more than one `all_county_fips`), and exactly 3 hold territory in the six while keying to
a primary county outside — Golinda, Staples, Thorndale. That is the 72-versus-69 gap.
Statewide the roster carries 203 straddling places; the 24 is the six-county subset, and
the two numbers are not in conflict.

Five rows in this seed are straddles. They are graded `likely`, not flagged as errors:

| value | parcels | place | primary county |
|---|---:|---|---|
| `breadth_48209_austin` | 7,379 | Austin | 48453 (Travis) |
| `breadth_48055_san_marcos` | 124 | San Marcos | 48209 (Hays) |
| `breadth_48209_austin_tx` | 66 | Austin | 48453 (Travis) |
| `breadth_48055_uhland` | 3 | Uhland | 48209 (Hays) |
| `breadth_48055_niederwald` | 1 | Niederwald | 48209 (Hays) |

Golinda, Staples and Thorndale — the three that hold territory in the six while keying to a
primary county outside — **do not appear in the store at all**. No `breadth_*` value names
any of them, in any spelling. They are a roster-side concern and generate no alias row, so
the seed does not need a special case for them.

## 4. Out-of-county values, classified

24 rows name a place whose roster county does not include the FIPS they are filed under,
covering 20 distinct place names. County adjacency was computed with PostGIS on
`neondb.tx_county_boundary` rather than asserted:

```sql
WITH g AS (SELECT county_fips, ST_MakeValid(ST_GeomFromGeoJSON(geometry::text)) AS geom
             FROM public.tx_county_boundary)
SELECT a.county_fips, b.county_fips FROM g a JOIN g b
  ON a.county_fips <> b.county_fips AND ST_Intersects(a.geom, b.geom)
 WHERE a.county_fips IN ('48021','48055','48209','48309','48453','48491');
```

```
48021: 48055 48149 48287 48453 48491
48055: 48021 48149 48177 48187 48209 48453
48209: 48031 48055 48091 48187 48453
48309: 48027 48035 48099 48145 48217 48293
48453: 48021 48031 48053 48055 48209 48491
48491: 48021 48027 48053 48287 48331 48453
```

| value | parcels | names | its county | class |
|---|---:|---|---|---|
| `breadth_48055_kyle` | 1,017 | Kyle | 48209 | (c) undecidable — adjacent county, postal spillover |
| `breadth_48055_harwood` | 456 | Harwood | unknown | **(c) undecidable** — roster gap, no county on the roster row |
| `breadth_48055_buda` | 118 | Buda | 48209/48453 | (c) undecidable — adjacent county, postal spillover |
| `breadth_48021_flatonia` | 111 | Flatonia | 48149 | (c) undecidable — adjacent county, postal spillover |
| `breadth_48021_waelder` | 62 | Waelder | 48177 | **(b) CAD data error** |
| `breadth_48055_waelder` | 56 | Waelder | 48177 | (c) undecidable — adjacent county, postal spillover |
| `breadth_48209_new_braunfels` | 48 | New Braunfels | 48091/48187 | (c) undecidable — adjacent county, postal spillover |
| `breadth_48021_giddings` | 41 | Giddings | 48287 | (c) undecidable — adjacent county, postal spillover |
| `breadth_48021_manor` | 40 | Manor | 48453 | (c) undecidable — adjacent county, postal spillover |
| `breadth_48209_round_mountain` | 32 | Round Mountain | 48031 | (c) undecidable — adjacent county, postal spillover |
| `breadth_48021_la_grange` | 25 | La Grange | 48149 | (c) undecidable — adjacent county, postal spillover |
| `breadth_48309_aquilla` | 14 | Aquilla | 48217 | (c) undecidable — adjacent county, postal spillover |
| `breadth_48209_blanco` | 11 | Blanco | 48031 | (c) undecidable — adjacent county, postal spillover |
| `breadth_48309_oglesby` | 7 | Oglesby | 48099 | (c) undecidable — adjacent county, postal spillover |
| `breadth_48021_austin` | 4 | Austin | 48453/48491 | (c) undecidable — adjacent county, postal spillover |
| `breadth_48209_martindale` | 3 | Martindale | 48055/48187 | (c) undecidable — adjacent county, postal spillover |
| `breadth_48309_abbott` | 2 | Abbott | 48217 | (c) undecidable — adjacent county, postal spillover |
| `breadth_48055_bastrop` | 1 | Bastrop | 48021 | (c) undecidable — adjacent county, postal spillover |
| `breadth_48055_wealder` | 1 | Waelder | 48177 | (c) undecidable — adjacent county, postal spillover |
| `breadth_48209_johnson_city` | 1 | Johnson City | 48031 | (c) undecidable — adjacent county, postal spillover |
| `breadth_48209_new_bruanfels` | 1 | New Braunfels | 48091/48187 | (c) undecidable — adjacent county, postal spillover |
| `breadth_48309_aaquilla` | 1 | Aquilla | 48217 | (c) undecidable — adjacent county, postal spillover |
| `breadth_48309_mount_calm` | 1 | Mount Calm | 48217 | (c) undecidable — adjacent county, postal spillover |
| `breadth_48021_lexington` | 1 | Lexington | 48287 | (c) undecidable — adjacent county, postal spillover |

**(a) Straddle:** none of these. Straddles were resolved upstream against `all_county_fips`
and are the five `likely` rows in section 3. A straddle is not an out-of-county row.

**(b) CAD data error — one row.** `breadth_48021_waelder`, 62 parcels. Waelder is in
Gonzales (48177). Bastrop's adjacent counties are 48055, 48149, 48287, 48453, 48491.
48177 is not among them, so a postal spillover across an intervening county is implausible
and this reads as bad situs text. It is the only row where adjacency rules out the benign
explanation. Note the same string in Caldwell (`breadth_48055_waelder`, 56 parcels) is
**legitimate** — 48177 does border 48055.

**(c) Undecidable from here — 23 rows.** In every one the named place sits in a county
that physically touches the filing county. CAD situs city is a postal city and postal
cities routinely cross county lines, so an out-of-county name on a parcel near the county
line is expected behaviour, not evidence of an error. A point-in-polygon test would settle
each; the roster alone cannot. `breadth_48055_kyle` (1,017 parcels) is the one worth
looking at first on volume alone.

**The roster gap.** `breadth_48055_harwood` (456 parcels) is undecidable for a different
reason: the roster row for Harwood is one of the 9 with no `parent_county_fips` and an
empty `all_county_fips`, so adjacency cannot be tested at all. That is a roster defect
surfacing as an alias question, and it should be fixed in the roster rather than decided here.

**Reconciling the prior 'eight cities not in Bastrop County'.** In 48021 I measure **seven**
roster-resolvable out-of-county city names — Austin, Flatonia, Giddings, La Grange,
Lexington, Manor, Waelder — plus **two** out-of-county postal places that are not in the
roster, Del Valle and Dale. Seven or nine depending on whether the unincorporated pair
counts. The prior figure of eight sits between the two readings; I cannot reproduce it
exactly and am not going to round to it.

## 5. What the alias table cannot fix

Three populations here, and they need three different dispositions. None of them is an
alias row.

### 5a. Not a jurisdiction at all — 21 rows

| value | parcels | why |
|---|---:|---|
| `breadth_48491_unknown` | 282,570 | literal `unknown` token |
| `breadth_48453_unknown` | 169,688 | literal `unknown` token |
| `breadth_48021_unknown` | 52,869 | literal `unknown` token |
| `breadth_48209_unknown` | 2,806 | literal `unknown` token |
| `breadth_48309_unknown` | 1,739 | literal `unknown` token |
| `breadth_48055_unknown` | 239 | literal `unknown` token |
| `breadth_48021_training_center` | 2 | facility name, not a place |
| `breadth_48209_(s_lief_johson_tr)` | 2 | freeform CAD note |
| `breadth_48209_guad_co` | 1 | county abbreviation (Guadalupe County |
| `breadth_48309_&_pareya_dr` | 1 | road fragment |
| `breadth_48309_0896.11s44a` | 1 | contains digits that are not a trailing zip |
| `breadth_48309_berwick_ct,_mackintosh_ct` | 1 | road fragment |
| `breadth_48021_cedar` | 1 | truncated fragment, ambiguous |
| `breadth_48021_co_rd` | 1 | road fragment (County Road |
| `breadth_48021_cr102` | 1 | road fragment (CR 102 |
| `breadth_48021_empire` | 1 | road/subdivision fragment (Empire St |
| `breadth_48021_empire_st` | 1 | road fragment |
| `breadth_48021_houses_only` | 1 | literal `houses_only` token |
| `breadth_48021_m66626` | 1 | CAD internal code |
| `breadth_48209_behind_joe_romer's` | 1 | freeform CAD note |
| `breadth_48209_owner_responsibilty` | 1 | CAD remark text, not a place |

Six of the 21 are the literal `unknown` token and they carry essentially all the weight:
509,911 parcel-rows against 17 for the other fifteen combined. The other fifteen are road
fragments (`co_rd`, `cr102`, `empire_st`, `&_pareya_dr`, `berwick_ct,_mackintosh_ct`), CAD
remark text (`houses_only`, `owner_responsibilty`, `behind_joe_romer's`, `training_center`),
an internal code (`m66626`, `0896.11s44a`), and a county abbreviation (`guad_co`). Correct
disposition for all 21 is `unknown` under the four-state contract. An alias row for any of
them would be a fabricated jurisdiction.

### How much of the corpus is `unknown`, and how much is recoverable

This is the number that matters most, so it was measured against distinct parcels rather
than inferred. A parcel can carry `unknown` on one atom and a real city on another, in
which case the second atom recovers it without any alias work:

| FIPS | County | parcels touching `unknown` | also under a named value | `unknown` only | `unknown`-only share of county |
|---|---|---:|---:|---:|---:|
| 48021 | Bastrop | 52,869 | 38,174 | **14,695** | 23.6% |
| 48055 | Caldwell | 239 | 0 | **239** | 1.0% |
| 48209 | Hays | 2,806 | 0 | **2,806** | 2.4% |
| 48309 | McLennan | 1,739 | 0 | **1,739** | 1.5% |
| 48453 | Travis | 169,688 | 22,012 | **147,676** | 38.8% |
| 48491 | Williamson | 282,570 | 0 | **282,570** | 100.0% |
| | **Total** | **509,911** | **60,186** | **449,725** | **45.8%** |

**449,725 of 981,413 parcels — 45.8 percent — have no jurisdiction string anywhere in the
store.** No alias table reaches them. They need a spatial assignment or a re-ingest, and
they are the actual long pole, not the spelling variants.

The distribution is the finding. Williamson is 282,570 parcels under a single value,
`breadth_48491_unknown`, and nothing else — one distinct value for the whole county, zero
recoverable. Travis is 147,676 unknown-only against three total values. Between them the
two largest counties in the program are 96 percent of the unknown-only population, and the
alias table does nothing for either. Bastrop is the opposite case: 38,174 of its 52,869
unknown-touching parcels are recoverable from a second atom, because 43,800 of its 62,260
parcels carry more than one `breadth_*` value.

### 5b. Real places with no `place_fips` to map to — 40 rows, 17 distinct places

These are not misspellings and not errors. They are unincorporated communities, CDPs, and
postal places that appear in CAD situs and **have no row in the target vocabulary**:

- `texas_roster_v1.json` carries 1,223 **incorporated** cities.
- `neondb.tx_city_boundary` carries 1,222 rows, all incorporated.
- Probed directly for Cedar Creek, Driftwood, Del Valle, Manchaca, Paige, McDade, Red Rock,
  Rosanky, Dale, Maxwell, Elm Mott, China Spring, Axtell, Henly, Fischer, Prairie Lea,
  Fentress, Eddy, Bruceville: **0 of 19 present in either source.**

| value | parcels | reads as |
|---|---:|---|
| `breadth_48021_cedar_creek` | 6,634 | Cedar Creek |
| `breadth_48055_dale` | 3,938 | Dale |
| `breadth_48209_driftwood` | 3,380 | Driftwood |
| `breadth_48309_china_spring` | 2,545 | China Spring |
| `breadth_48209_maxwell` | 2,302 | Maxwell |
| `breadth_48309_elm_mott` | 2,137 | Elm Mott |
| `breadth_48021_del_valle` | 2,078 | Del Valle |
| `breadth_48021_dale` | 2,045 | Dale |
| `breadth_48021_paige` | 1,776 | Paige |
| `breadth_48055_maxwell` | 1,715 | Maxwell |
| `breadth_48309_axtell` | 1,627 | Axtell |
| `breadth_48309_eddy` | 1,274 | Eddy |

36,287 parcel-rows sit under these 40 values. **The declared target form `place_fips`
cannot express them at all**, so this is not a hand-seeding task that more effort finishes;
it is an operator ruling. Three options, and the choice belongs to the operator:

1. Extend the roster with Census CDP place FIPS, giving these a real `place_fips`.
2. Add an explicit `unincorporated` disposition distinct from `unknown`, so a Cedar Creek
   parcel is honestly typed rather than collapsed into the 45.8 percent.
3. Map them to the county and drop the postal name, losing real signal.

Option 2 preserves the distinction between *we do not know* and *we know it is
unincorporated*, which the four-state contract already asks for and which option 3 destroys.
Bruceville and Eddy are a special case inside this bucket: both lead to the incorporated
**Bruceville-Eddy** (place_fips 10828), so 2,286 parcels across those two values may be a
clean `certain` mapping once a human confirms the two halves of the hyphenated name.

### 5c. Wrong scope, not wrong spelling — 4 rows

| value | parcels | road-node atoms | reading |
|---|---:|---:|---|
| `breadth_48209_hays` | 0 | 40,987 | county-scoped only |
| `breadth_48021_bastrop` | 17,538 | 36,802 | **mixed**: county roads and parcels under one string |
| `breadth_48309_mclennan` | 0 | 28,787 | county-scoped only |
| `breadth_48055_caldwell` | 337 | 13,790 | **mixed**: county roads and parcels under one string |

All four free texts are **county** names, and all four collide with an incorporated city
name elsewhere in Texas. A naive roster lookup resolves `breadth_48309_mclennan` to nothing
but resolves `breadth_48055_caldwell` to **Caldwell city in Burleson County** and
`breadth_48209_hays` to **Hays city** — both wrong, and both would look like clean
`certain` matches to a seeder working from the string alone. This is the trap that would
have fired first.

`breadth_48021_bastrop` is the worst of the four: 36,802 county road-node atoms **and**
17,538 parcels under one string, while a separate `breadth_48021_bastrop-city-tx` carries
the 5,795 city-stamped parcels. It cannot be aliased to a single `place_fips` until the
two scopes are split. I graded it `needs-human` for that reason, overriding what was
otherwise an exact roster match on `Bastrop`.

Entity-type composition across all 225 values, which is where the road/parcel split comes from:

| entity_type | atom rows | distinct `breadth_*` values |
|---|---:|---:|
| `zoning-fact` | 981,415 | 222 |
| `buildable-envelope` | 707,394 | 159 |
| `setback-rule` | 344,698 | 13 |
| `road-node` | 120,366 | 4 |
| `property-boundary-edge` | 26,846 | 1 |

Note there are **no `parcel-node` atoms** under any `breadth_*` tenant. `parcel_count` in
the JSON is `count(DISTINCT body->>'parcelNodeId')`, which is the parcel population these
facet atoms attach to, not a count of parcel nodes.

## 6. What a human still has to decide

Ordered by what unblocks the most.

1. **The 45.8 percent.** `unknown`-only is 449,725 parcels and the alias table does not
   touch it. Williamson and Travis are 96 percent of it. Decide whether that is a spatial
   assignment job or a re-ingest before treating the alias table as the long pole; on these
   numbers it is not the long pole.
2. **The `place_fips` vocabulary gap.** 40 values / 17 real postal places have no
   `place_fips` in any source held. Rule on CDP extension versus an `unincorporated`
   disposition. Until that is ruled, those 40 rows cannot be seeded at all.
3. **The four mixed-scope keys.** Split county roads from parcels, or the first four
   confident-looking mappings in the table are wrong.
4. **Confirm the top 25 rows.** 94.7 percent of parcel weight. Should be a short pass.
5. **`breadth_48021_waelder`** (62 parcels) — the one probable CAD situs error.
6. **`breadth_48055_harwood`** (456 parcels) — fix the roster row, then re-run the class.
7. **Ten unresolved rows** (79 parcel-rows total) where the nearest spelling sits just
   under the 0.82 threshold: `moddy`->Moody at 0.80, `mt_calm`->Mount Calm at 0.80,
   `kylr`->Kyle at 0.75, `dael`->Dale at 0.75. Each note names the lead. I did not promote
   them; a human eyeball is cheaper than a fabricated mapping.

## 7. What I could not resolve, stated plainly

- **In-limits membership for any row.** Not attempted. Requires point-in-polygon against
  `tx_city_boundary`. Every `certain` and `likely` row is a string-to-place claim only.
- **The county of any unincorporated place.** Del Valle, Dale, Cedar Creek and the other 14 of the 17
  are absent from both roster and boundary table, so I cannot say from a source which county
  they sit in. I did not fill this from my own knowledge.
- **Harwood's county.** Roster gap, 9 unlinked rows, adjacency untestable.
- **Whether the 23 `(c)` rows are spillover or error.** Adjacency rules out the error
  reading for none of them and rules it in for none. It is genuinely undecidable without geometry.
- **`breadth_48309_cavitt` and `breadth_48309_shadow_ridge`** (1 parcel each). They read as
  a street and a subdivision, but neither matched a road-fragment pattern and neither is
  near any place name. Left `unresolved` rather than guessed into the non-jurisdiction bucket.
- **Why Travis has 3 values and Williamson 1** while Hays has 87. That is a difference in
  how each county's CAD situs was ingested, not something this enumeration explains. It is
  worth asking, because Williamson having exactly one value and it being `unknown` looks
  more like a dropped field at ingest than a property of Williamson CAD.

## Alternative mechanism, considered and rejected

The observation is 225 distinct values with heavy misspelling. The mechanism I state is
unnormalised free-text CAD situs carried through to the tenant key.

The second mechanism that would produce the same observation: multiple ingest runs with
different normalisation rules, so `bastrop` and `bastrop-city-tx` are two *eras* rather than
two *sources*. I rejected it as the sole explanation but not entirely: 43,800 of 62,260
Bastrop parcels carry more than one `breadth_*` value, which is exactly what era-layering
looks like, and it matches the known `ENVELOPE-BEHIND-STAMP` defect in
`90_operations/onboarding_defect_class_backlog.md` where a re-stamp left older-tenant
envelopes behind. But era-layering cannot explain `wacxo`, `brucville`, or
`behind_joe_romer's`, which are keystroke-level source text. **Both mechanisms are
operating.** That matters for the fix: an alias table addresses the free-text half, and
nothing in it addresses the era half. Deduplicating a parcel that carries two tenants is a
separate card.

## Files

- `alias_seed.json` — 225 objects, sorted by `parcel_count` descending. Required keys
  `breadth_value`, `county_fips`, `parcel_count`, `proposed_place_fips`,
  `proposed_place_name`, `confidence`, `note`, plus `county_name`, `atom_rows`,
  `road_node_rows`, `entity_types`, `kind`.
- `alias_seed.md` — this file.
- `master_raw.tsv` — raw enumeration output, un-piped.
- `adjacency.txt` — raw PostGIS adjacency output.
- `build_alias.py`, `gen_md.py` — the instruments.

`confidence` describes the **string-to-place** proposal only. `kind` carries why.
