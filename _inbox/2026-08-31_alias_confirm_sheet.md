# `breadth_*` to `place_fips` alias, operator confirm sheet

**Read this first.**

1. **63 rows carry the decision.** They are 483,715 of the 483,792 alias parcel-rows. The first 20 of them still carry almost all of the alias weight. Everything after row 20 is optional.
2. **42 more rows need four rulings, not a yes/no**: the Bruceville-Eddy correction (4 rows, 2,288 parcels, flagged below as a seed error), the 4 county-scoped traps (17,875), the 24 out-of-county rows (2,054), the 10 `unresolved` rows (79). Combined weight 22,296 parcel-rows, and 17,875 of that is the four traps alone.
3. **122 rows need nothing from you.** 21 are `unknown` or CAD junk (509,928 parcel-rows, disposition already fixed by the four-state contract), 36 are already ruled `unincorporated` by the 2026-08-30 decision, and 65 are alias tail rows worth **75 parcels in total** (confirmable as 23 one-line blocks, or skipped).

> **An alias maps a STRING to a PLACE. It does not say the parcel is inside that place's corporate limits.** CAD situs city is a *postal* city. `48209_kyle` is 30,923 parcels, far more than Kyle's incorporated count; the balance is unincorporated Hays County with a Kyle mailing address. Confirming a row here is **not** a jurisdiction sign-off. In-limits membership is a point-in-polygon test against `tx_city_boundary`, and it is a different job from this one.

## Provenance

| | |
|---|---|
| Seed | `P:\doc_repo\_catalog\2026-08-30_breadth_place_alias_seed.json`, 225 rows |
| Seed sha256 | `7e5ac620452cbeca9bd7d59042af1cc4678c239fc3aa46f20646292439bf94f3` |
| Roster | `_catalog/texas_roster_v1.json`, 1,223 incorporated cities |
| doc_repo | branch `main`, commit `e4b312ea351dcd3638da82c13316166125069e91` |
| Sources read | the seed JSON, `_inbox/2026-08-30_alias_seed_findings.md`, `_decisions/2026-08-30_unincorporated_is_the_disposition.md`, the roster file |
| Store access | **none**. This sheet is derived entirely from files. No query was run, so nothing here is `unmeasured` and nothing here re-measures the store. |
| Instrument | file-based Python, self-tested in both directions before use: 225 rows, 1,047,727 parcel-rows, top-3 = 663,467 (63.32%), top-25 = 94.72%, 112 rows at 2 parcels or fewer, 97 at exactly 1. Two negative controls (fabricated `kind` returns 0; `p AND NOT p` returns 0) and one non-vacuity control passed. |

`parcel_count` double counts the 66,149 parcels carrying more than one `breadth_*` value. Distinct parcels are 981,413. Use these percentages for **ordering by impact**, never as a parcel population.

---

## 1. The decision table, 63 rows

> **An alias maps a STRING to a PLACE. It does not say the parcel is inside that place's corporate limits.** CAD situs city is a *postal* city. `48209_kyle` is 30,923 parcels, far more than Kyle's incorporated count; the balance is unincorporated Hays County with a Kyle mailing address. Confirming a row here is **not** a jurisdiction sign-off. In-limits membership is a point-in-polygon test against `tx_city_boundary`, and it is a different job from this one.

Ordered by impact. `cum% alias` is the running share of the 481,504 alias parcel-rows. `#` is the row's global rank among all 225 seed rows, so you can see which already-ruled rows it steps over. Confidence is the seed's own grade, **not upgraded by me**.

| # | `breadth_*` (prefix stripped) | County | Parcels | cum% alias | cum% corpus | place_fips | Place | Conf | Reason | OK? |
|---:|---|---|---:|---:|---:|---|---|---|---|---|
| 2 | `48453_austin-tx` | Travis | 211,209 | 43.7% | 47.1% | 05000 | Austin | likely | roster match, stripped state suffix `tx` **[see 7.2]** | [ ] |
| 5 | `48309_waco-tx` | McLennan | 48,441 | 53.7% | 73.0% | 76000 | Waco | likely | roster match, stripped state suffix `tx` | [ ] |
| 6 | `48209_kyle` | Hays | 30,923 | 60.1% | 75.9% | 39952 | Kyle | certain | exact roster name, county agrees | [ ] |
| 7 | `48209_san_marcos` | Hays | 22,373 | 64.7% | 78.1% | 65600 | San Marcos | certain | exact roster name, county agrees | [ ] |
| 8 | `48453_pflugerville-tx` | Travis | 22,033 | 69.2% | 80.2% | 57176 | Pflugerville | likely | roster match, stripped state suffix `tx` | [ ] |
| 9 | `48309_waco` | McLennan | 20,572 | 73.5% | 82.1% | 76000 | Waco | certain | exact roster name, county agrees | [ ] |
| 10 | `48209_buda` | Hays | 19,026 | 77.4% | 84.0% | 11080 | Buda | certain | exact roster name, county agrees | [ ] |
| 12 | `48209_dripping_springs` | Hays | 12,090 | 79.9% | 86.8% | 21424 | Dripping Springs | certain | exact roster name, county agrees | [ ] |
| 13 | `48209_wimberley` | Hays | 11,654 | 82.3% | 87.9% | 79624 | Wimberley | certain | exact roster name, county agrees | [ ] |
| 14 | `48055_lockhart` | Caldwell | 10,673 | 84.5% | 88.9% | 43240 | Lockhart | certain | exact roster name, county agrees | [ ] |
| 15 | `48209_austin` | Hays | 7,379 | 86.1% | 89.6% | 05000 | Austin | likely | straddle, primary county 48453, holds territory in 48209 | [ ] |
| 16 | `48309_woodway` | McLennan | 6,685 | 87.4% | 90.3% | 80224 | Woodway | certain | exact roster name, county agrees | [ ] |
| 18 | `48309_hewitt` | McLennan | 5,819 | 88.6% | 91.5% | 33428 | Hewitt | certain | exact roster name, county agrees | [ ] |
| 19 | `48021_bastrop-city-tx` | Bastrop | 5,795 | 89.8% | 92.0% | 05864 | Bastrop | likely | roster match, stripped state suffix `tx` **[see 7.3]** | [ ] |
| 20 | `48021_elgin` | Bastrop | 5,666 | 91.0% | 92.5% | 23044 | Elgin | certain | exact roster name, county agrees | [ ] |
| 21 | `48021_smithville` | Bastrop | 5,327 | 92.1% | 93.1% | 68456 | Smithville | certain | exact roster name, county agrees | [ ] |
| 22 | `48055_luling` | Caldwell | 4,719 | 93.1% | 93.5% | 45096 | Luling | certain | exact roster name, county agrees | [ ] |
| 23 | `48309_west` | McLennan | 4,368 | 94.0% | 93.9% | 77332 | West | certain | exact roster name, county agrees | [ ] |
| 24 | `48309_lorena` | McLennan | 4,251 | 94.9% | 94.3% | 44020 | Lorena | certain | exact roster name, county agrees | [ ] |
| 25 | `48309_mcgregor` | McLennan | 4,066 | 95.7% | 94.7% | 45672 | McGregor | certain | exact roster name, county agrees | [ ] |
| | **STOP LINE. The 20 rows above are 96.2% of alias weight. The 41 below add 3.8%, 18,436 parcel-rows.** | | | | | | | | | |
| 27 | `48021_elgin-tx` | Bastrop | 3,762 | 96.5% | 95.5% | 23044 | Elgin | likely | roster match, stripped state suffix `tx` | [ ] |
| 31 | `48309_moody` | McLennan | 2,354 | 97.0% | 96.5% | 49200 | Moody | certain | exact roster name, county agrees | [ ] |
| 33 | `48309_mart` | McLennan | 2,200 | 97.4% | 96.9% | 46824 | Mart | certain | exact roster name, county agrees | [ ] |
| 37 | `48309_crawford` | McLennan | 2,010 | 97.9% | 97.7% | 17564 | Crawford | certain | exact roster name, county agrees | [ ] |
| 42 | `48309_riesel` | McLennan | 1,543 | 98.2% | 98.5% | 62108 | Riesel | certain | exact roster name, county agrees | [ ] |
| 43 | `48309_eddy` | McLennan | 1,274 | 98.4% | 98.7% | 10828 | Bruceville-Eddy | likely | hyphen-component `Eddy` of Bruceville-Eddy | [ ] |
| 45 | `48209_uhland` | Hays | 1,082 | 98.7% | 98.9% | 74216 | Uhland | certain | exact roster name, county agrees | [ ] |
| 47 | `48055_martindale` | Caldwell | 1,016 | 98.9% | 99.1% | 46848 | Martindale | certain | exact roster name, county agrees | [ ] |
| 48 | `48309_bruceville` | McLennan | 1,012 | 99.1% | 99.1% | 10828 | Bruceville-Eddy | likely | hyphen-component `Bruceville` of Bruceville-Eddy | [ ] |
| 49 | `48309_valley_mills` | McLennan | 1,001 | 99.3% | 99.2% | 74732 | Valley Mills | certain | exact roster name, county agrees | [ ] |
| 50 | `48209_san_marcos_tx` | Hays | 828 | 99.5% | 99.3% | 65600 | San Marcos | likely | roster match, stripped state suffix `tx` | [ ] |
| 53 | `48209_niederwald` | Hays | 493 | 99.6% | 99.5% | 51492 | Niederwald | certain | exact roster name, county agrees | [ ] |
| 56 | `48309_robinson` | McLennan | 359 | 99.6% | 99.6% | 62588 | Robinson | certain | exact roster name, county agrees | [ ] |
| 59 | `48209_dripping_springs_tx` | Hays | 259 | 99.7% | 99.7% | 21424 | Dripping Springs | likely | roster match, stripped state suffix `tx` | [ ] |
| 62 | `48209_mountain_city` | Hays | 227 | 99.7% | 99.8% | 49600 | Mountain City | certain | exact roster name, county agrees | [ ] |
| 64 | `48209_dripping_sprigns` | Hays | 173 | 99.8% | 99.8% | 21424 | Dripping Springs | likely | misspelling of `dripping springs`, sim 0.93 | [ ] |
| 65 | `48209_wimberley_tx` | Hays | 168 | 99.8% | 99.8% | 79624 | Wimberley | likely | roster match, stripped state suffix `tx` | [ ] |
| 67 | `48209_kyle_tx` | Hays | 127 | 99.8% | 99.9% | 39952 | Kyle | likely | roster match, stripped state suffix `tx` | [ ] |
| 68 | `48309_leroy` | McLennan | 125 | 99.9% | 99.9% | 42400 | Leroy | certain | exact roster name, county agrees | [ ] |
| 69 | `48055_san_marcos` | Caldwell | 124 | 99.9% | 99.9% | 65600 | San Marcos | likely | straddle, primary county 48209, holds territory in 48055 | [ ] |
| 72 | `48209_buda_tx` | Hays | 73 | 99.9% | 99.9% | 11080 | Buda | likely | roster match, stripped state suffix `tx` | [ ] |
| 73 | `48209_austin_tx` | Hays | 66 | 99.9% | 99.9% | 05000 | Austin | likely | straddle, primary county 48453, holds territory in 48209 | [ ] |
| 75 | `48209_ausitn` | Hays | 59 | 99.9% | 99.9% | 05000 | Austin | likely | misspelling of `austin`, sim 0.83 *(at 0.82 floor)* | [ ] |
| 76 | `48309_bellmead` | McLennan | 58 | 99.9% | 99.9% | 07408 | Bellmead | certain | exact roster name, county agrees | [ ] |
| 78 | `48209_san_marocs` | Hays | 52 | 99.9% | 99.9% | 65600 | San Marcos | likely | misspelling of `san marcos`, sim 0.89 | [ ] |
| 80 | `48209_wimberely` | Hays | 43 | 100.0% | 99.9% | 79624 | Wimberley | likely | misspelling of `wimberley`, sim 0.89 | [ ] |
| 85 | `48209_neiderwald` | Hays | 31 | 100.0% | 100.0% | 51492 | Niederwald | likely | misspelling of `niederwald`, sim 0.90 | [ ] |
| 86 | `48209_san_marcos_tx_78666` | Hays | 30 | 100.0% | 100.0% | 65600 | San Marcos | likely | roster match, stripped zip 78666 + state suffix `tx` | [ ] |
| 87 | `48209_drippiing_springs` | Hays | 27 | 100.0% | 100.0% | 21424 | Dripping Springs | likely | misspelling of `dripping springs`, sim 0.97 | [ ] |
| 93 | `48209_dripping_springs_tx_78620` | Hays | 14 | 100.0% | 100.0% | 21424 | Dripping Springs | likely | roster match, stripped zip 78620 + state suffix `tx` | [ ] |
| 96 | `48209_wimberlery` | Hays | 7 | 100.0% | 100.0% | 79624 | Wimberley | likely | misspelling of `wimberley`, sim 0.95 | [ ] |
| 98 | `48209_dripping_spring` | Hays | 6 | 100.0% | 100.0% | 21424 | Dripping Springs | likely | misspelling of `dripping springs`, sim 0.97 | [ ] |
| 99 | `48209_dripping_sprgs` | Hays | 6 | 100.0% | 100.0% | 21424 | Dripping Springs | likely | misspelling of `dripping springs`, sim 0.93 | [ ] |
| 100 | `48209_wimberley_tx_78676` | Hays | 5 | 100.0% | 100.0% | 79624 | Wimberley | likely | roster match, stripped zip 78676 + state suffix `tx` | [ ] |
| 101 | `48209_wimberly` | Hays | 5 | 100.0% | 100.0% | 79624 | Wimberley | likely | misspelling of `wimberley`, sim 0.94 | [ ] |
| 102 | `48209_woodcreek` | Hays | 5 | 100.0% | 100.0% | 80058 | Woodcreek | certain | exact roster name, county agrees | [ ] |
| 103 | `48209_austn` | Hays | 4 | 100.0% | 100.0% | 05000 | Austin | likely | misspelling of `austin`, sim 0.91 | [ ] |
| 106 | `48055_uhland` | Caldwell | 3 | 100.0% | 100.0% | 74216 | Uhland | likely | straddle, primary county 48209, holds territory in 48055 | [ ] |
| 107 | `48209_austiin` | Hays | 3 | 100.0% | 100.0% | 05000 | Austin | likely | misspelling of `austin`, sim 0.92 | [ ] |
| 108 | `48209_dripping_spirngs` | Hays | 3 | 100.0% | 100.0% | 21424 | Dripping Springs | likely | misspelling of `dripping springs`, sim 0.93 | [ ] |
| 109 | `48209_wimbreley` | Hays | 3 | 100.0% | 100.0% | 79624 | Wimberley | likely | misspelling of `wimberley`, sim 0.89 | [ ] |
| 110 | `48309_lacy_lakeview` | McLennan | 3 | 100.0% | 100.0% | 40168 | Lacy-Lakeview | certain | exact roster name, county agrees | [ ] |
| 112 | `48209_kyl` | Hays | 3 | 100.0% | 100.0% | 39952 | Kyle | likely | misspelling of `kyle`, sim 0.86 *(at 0.82 floor)* | [ ] |

---

## 2. Alias tail, 67 rows, 77 parcels in total

> **An alias maps a STRING to a PLACE. It does not say the parcel is inside that place's corporate limits.** CAD situs city is a *postal* city. `48209_kyle` is 30,923 parcels, far more than Kyle's incorporated count; the balance is unincorporated Hays County with a Kyle mailing address. Confirming a row here is **not** a jurisdiction sign-off. In-limits membership is a point-in-polygon test against `tx_city_boundary`, and it is a different job from this one.

Every row here is 1 or 2 parcels. They are grouped by target so each block is one decision rather than one per string. Confirming all 23 blocks moves alias weight by 0.02%. Skipping them is defensible.

| Place | place_fips | County | Rows | Parcels | Strings | OK? |
|---|---|---|---:|---:|---|---|
| Dripping Springs | 21424 | Hays | 9 | 11 | `48209_dirpping_springs_tx`, `48209_driping_springs`, `48209_dripping_spr`, `48209_dripping_springs_,`, `48209_dripping_srings`, `48209_dripping_srpings`, `48209_drippings_springs`, `48209_drippingsprings_texas`, `48209_drippng_springs_tx` | [ ] |
| San Marcos | 65600 | Hays | 8 | 11 | `48209_esan_marcos_tx`, `48209_rsan_marcos_tx`, `48209_sam_marcos_tx`, `48209_san_marcos,`, `48209_san_marcos_tex`, `48209_san_marcox_tx`, `48209_san_maros`, `48209_tsan_marcos_tx` | [ ] |
| Wimberley | 79624 | Hays | 7 | 9 | `48209_wimbelrey`, `48209_wimberely_tx`, `48209_wimberey`, `48209_wimberley_78676`, `48209_wimerley`, `48209_wmberley`, `48209_womberley` | [ ] |
| Bastrop | 05864 | Bastrop | 6 | 6 | `48021_astrop`, `48021_bastroop`, `48021_bastropd`, `48021_bastrrop`, `48021_basttrop`, `48021_batrop` | [ ] |
| Smithville | 68456 | Bastrop | 5 | 5 | `48021_smihville`, `48021_smithille`, `48021_smithviile`, `48021_smithville_tx`, `48021_smmithville_tx` | [ ] |
| Buda | 11080 | Hays | 3 | 3 | `48209_biuda`, `48209_buda_tx_78610`, `48209_budaa` | [ ] |
| Elgin | 23044 | Bastrop | 3 | 3 | `48021_elgiin`, `48021_elgin_t`, `48021_ellgin` | [ ] |
| Luling | 45096 | Caldwell | 3 | 4 | `48055_luing`, `48055_lulilng`, `48055_lulung` | [ ] |
| Bruceville-Eddy | 10828 | McLennan | 2 | 2 | `48309_brucevill`, `48309_brucville` | [ ] |
| Crawford | 17564 | McLennan | 2 | 3 | `48309_crwford`, `48309_drawford` | [ ] |
| Lockhart | 43240 | Caldwell | 2 | 2 | `48055_lcokhart`, `48055_lockhrt` | [ ] |
| Lorena | 44020 | McLennan | 2 | 2 | `48309_lorean`, `48309_loren` | [ ] |
| McGregor | 45672 | McLennan | 2 | 2 | `48309_mc_gregor`, `48309_mcgrergor` | [ ] |
| Waco | 76000 | McLennan | 2 | 2 | `48309_wacxo`, `48309_wco` | [ ] |
| Woodway | 80224 | McLennan | 2 | 2 | `48309_woodaway`, `48309_wooday` | [ ] |
| Hallsburg | 31880 | McLennan | 1 | 1 | `48309_hallsburg` | [ ] |
| Hewitt | 33428 | McLennan | 1 | 1 | `48309_hewtt` | [ ] |
| Kyle | 39952 | Hays | 1 | 1 | `48209_kyle_s` | [ ] |
| Martindale | 46848 | Caldwell | 1 | 1 | `48055_martndale` | [ ] |
| Niederwald | 51492 | Caldwell | 1 | 1 | `48055_niederwald` | [ ] |
| Niederwald | 51492 | Hays | 1 | 1 | `48209_niedewald` | [ ] |
| Riesel | 62108 | McLennan | 1 | 1 | `48309_risel` | [ ] |
| Uhland | 74216 | Hays | 1 | 1 | `48209_uhland_tx` | [ ] |
| Valley Mills | 74732 | McLennan | 1 | 2 | `48309_valley_mill` | [ ] |

---

## 3. NOT alias candidates: the `unknown` rows. No decision required.

**509,911 parcels carry the literal token `unknown` and no jurisdiction string at all.** That is **52.0% of the 981,413 distinct parcels**, and 48.7% of the 1,047,727 parcel-rows. (The two denominators differ because 66,149 parcels carry more than one `breadth_*` value. The 52.0% figure is the one that describes parcels.) There is nothing to alias. No `place_fips` exists or can exist for them. Do not attempt to map them, and do not let their size pull them into this pass: they sit at the very top of the impact ladder and they are not a decision.

Containment resolves them, not names. Per the 2026-08-30 ruling, jurisdiction comes from spatial containment against `tx_city_boundary`; a parcel outside every incorporated polygon is `unincorporated` **by measurement**. The alias table stays name normalisation and never becomes a jurisdiction source.

Of the 509,911, **449,725 have no jurisdiction string anywhere in the store** and 60,186 are recoverable from a second atom on the same parcel. Williamson (282,570, one value for the whole county, zero recoverable) and Travis (147,676 unknown-only) are 96% of the unrecoverable population. That is a spatial-assignment or re-ingest question and it is the actual long pole. The alias table does not touch it.

| `breadth_*` | County | Parcels | Why it is not a place |
|---|---|---:|---|
| `48491_unknown` | Williamson | 282,570 | literal `unknown` token |
| `48453_unknown` | Travis | 169,688 | literal `unknown` token |
| `48021_unknown` | Bastrop | 52,869 | literal `unknown` token |
| `48209_unknown` | Hays | 2,806 | literal `unknown` token |
| `48309_unknown` | McLennan | 1,739 | literal `unknown` token |
| `48055_unknown` | Caldwell | 239 | literal `unknown` token |
| `48021_training_center` | Bastrop | 2 | facility name, not a place |
| `48209_(s_lief_johson_tr)` | Hays | 2 | freeform CAD note |
| `48209_guad_co` | Hays | 1 | county abbreviation (Guadalupe County), not a place in this county |
| `48309_&_pareya_dr` | McLennan | 1 | road fragment |
| `48309_0896.11s44a` | McLennan | 1 | contains digits that are not a trailing zip |
| `48309_berwick_ct,_mackintosh_ct` | McLennan | 1 | road fragment |
| `48021_cedar` | Bastrop | 1 | truncated fragment, ambiguous |
| `48021_co_rd` | Bastrop | 1 | road fragment (County Road) |
| `48021_cr102` | Bastrop | 1 | road fragment (CR 102) |
| `48021_empire` | Bastrop | 1 | road/subdivision fragment (Empire St) |
| `48021_empire_st` | Bastrop | 1 | road fragment |
| `48021_houses_only` | Bastrop | 1 | literal `houses_only` token |
| `48021_m66626` | Bastrop | 1 | CAD internal code |
| `48209_behind_joe_romer's` | Hays | 1 | freeform CAD note |
| `48209_owner_responsibilty` | Hays | 1 | CAD remark text, not a place |

Six rows are the literal token and carry 509,911 parcel-rows. The other fifteen are road fragments, CAD remark text, internal codes and a county abbreviation, and carry **17 parcel-rows between them**.

---

## 4. The four county-scoped keys. These are traps, not clean matches.

All four free texts are **county** names. Three of the four collide with a real incorporated city elsewhere in Texas, and a seeder working from the string alone would map them confidently and wrongly.

| `breadth_*` | Parcels | road-node atoms | What a naive roster lookup does | Why that is wrong |
|---|---:|---:|---|---|
| `48209_hays` | 0 | 40,987 | Resolves to **Hays city**, `place_fips` 32906, whose `parent_county_fips` is **48209**. Both halves of the `certain` test pass, so it grades **`certain`**, not merely matched. | Hays city is a small incorporated town inside Hays County. The string here is the **county**. This is the worst of the four precisely because the county-agreement check cannot catch it. |
| `48055_caldwell` | 337 | 13,790 | Resolves to **Caldwell city**, `place_fips` 11836, in **Burleson County (48051)**. | The county check does catch this one, but it catches it as *out-of-county*, which is the wrong diagnosis. The row is not a city filed under the wrong county, it is not a city at all. A wrong diagnosis leads to a wrong disposition. |
| `48309_mclennan` | 0 | 28,787 | Resolves to nothing. No roster place is named McLennan (verified against the roster file). | Safe by luck, not by design. |
| `48021_bastrop` | 17,538 | 36,802 | Exact roster match on **Bastrop**, `place_fips` 05864, primary county 48021. Both halves pass, so it grades `certain`. | **Mixed scope.** 36,802 county road-node atoms and 17,538 parcels under one string, while a separate `48021_bastrop-city-tx` carries 5,795 city-stamped parcels. The string is doing two jobs. It cannot take a single `place_fips` until the scopes are split. |

`48209_hays` and `48309_mclennan` carry **zero parcels** and only `road-node` atoms, which is the tell: they are county road networks keyed by county name. `48021_bastrop` and `48055_caldwell` are **mixed**, carrying county roads and parcels under one string.

**The decision here is a scope split, not a mapping.** Until roads and parcels are separated, none of the four should receive an alias row.

---

## 5. The CDP rows. Already ruled. No confirmation required.

The 2026-08-30 decision `_decisions/2026-08-30_unincorporated_is_the_disposition.md` settles these: a place that is not an incorporated city gets the explicit disposition **`unincorporated`**, the roster is **not** extended to CDPs, and nobody seeds around the gap. Listed here so you can see the scope the ruling covers, not so you can decide it.

**Scope correction, and it matters.** The ruling text says 40 values covering 17 places. **Four of those 40 rows are out of scope**, because the place they name is incorporated and does have a `place_fips`. See 7.1. The corrected scope is **36 rows, 33,999 parcel-rows, 15 real unincorporated places** (the seed spells McDade two ways, `Mcdade` and `Mc Dade`, which reads as 16 in the table below).

| Place | County | Rows | Parcels | Strings |
|---|---|---:|---:|---|
| Cedar Creek | Bastrop | 5 | 6,640 | `48021_cedar_creek`, `48021_cedar_crek`, `48021_cedar_ceek`, `48021_cedar_crekk`, `48021_ceder_creek` |
| Dale | Bastrop, Caldwell | 2 | 5,983 | `48055_dale`, `48021_dale` |
| Maxwell | Caldwell, Hays | 3 | 4,021 | `48209_maxwell`, `48055_maxwell`, `48209_maxwell_tx` |
| Driftwood | Hays | 2 | 3,398 | `48209_driftwood`, `48209_driftwood_tx` |
| China Spring | McLennan | 5 | 2,549 | `48309_china_spring`, `48309_china_sprng`, `48309_china_srping`, `48309_ching_spring`, `48309_chins_spring` |
| Elm Mott | McLennan | 2 | 2,138 | `48309_elm_mott`, `48309_elm_mottt` |
| Del Valle | Bastrop | 2 | 2,079 | `48021_del_valle`, `48021_de_valle` |
| Paige | Bastrop | 1 | 1,776 | `48021_paige` |
| Axtell | McLennan | 2 | 1,628 | `48309_axtell`, `48309_atell` |
| Red Rock | Bastrop, Caldwell | 2 | 1,390 | `48021_red_rock`, `48055_red_rock` |
| Rosanky | Bastrop, Caldwell | 2 | 839 | `48021_rosanky`, `48055_rosanky` |
| Mcdade | Bastrop | 1 | 740 | `48021_mcdade` |
| Manchaca | Hays | 3 | 462 | `48209_manchaca`, `48209_manchaca_tx`, `48209_manchaca_xs` |
| Fentress | Caldwell | 1 | 209 | `48055_fentress` |
| Prairie Lea | Caldwell | 2 | 146 | `48055_prairie_lea`, `48055_praire_lea` |
| Mc Dade | Bastrop | 1 | 1 | `48021_mc_dade` |

All were probed against both `texas_roster_v1.json` (1,223 incorporated cities) and `tx_city_boundary` (1,222 polygons) and found in neither. `place_fips` cannot express them, which is exactly what the ruling decided rather than worked around.

---

## 6. The 24 out-of-county rows

> **An alias maps a STRING to a PLACE. It does not say the parcel is inside that place's corporate limits.** CAD situs city is a *postal* city. `48209_kyle` is 30,923 parcels, far more than Kyle's incorporated count; the balance is unincorporated Hays County with a Kyle mailing address. Confirming a row here is **not** a jurisdiction sign-off. In-limits membership is a point-in-polygon test against `tx_city_boundary`, and it is a different job from this one.

**An arithmetic note before the table.** The findings doc and the framing of this request differ on whether the 5 straddles sit inside the 24. The findings are explicit and I follow them: a straddle is **not** an out-of-county row. The 24 = **1 CAD error + 23 undecidable**. The 5 straddles are a separate, already-resolved class, listed here for completeness because they are the rows that would *look* out-of-county to a naive check.

### 6a. Straddles, 5 rows, resolved via `all_county_fips`. Already in the section 1 table.

| `breadth_*` | Parcels | Place | Primary county | Resolves because |
|---|---:|---|---|---|
| `48209_austin` | 7,379 | Austin | 48453 | `all_county_fips` ['48209', '48453', '48491'] includes 48209 |
| `48055_san_marcos` | 124 | San Marcos | 48209 | `all_county_fips` ['48055', '48187', '48209'] includes 48055 |
| `48209_austin_tx` | 66 | Austin | 48453 | `all_county_fips` ['48209', '48453', '48491'] includes 48209 |
| `48055_uhland` | 3 | Uhland | 48209 | `all_county_fips` ['48055', '48209'] includes 48055 |
| `48055_niederwald` | 1 | Niederwald | 48209 | `all_county_fips` ['48055', '48209'] includes 48055 |

These are legitimate and not errors. Austin holds territory in 48209, 48453 and 48491; San Marcos in 48055 and 48209.

### 6b. CAD data error, exactly 1 row.

| `breadth_*` | Parcels | Place | Its county | Why this one is different |
|---|---:|---|---|---|
| `48021_waelder` | 62 | Waelder | 48177 Gonzales | Bastrop's adjacent counties are 48055, 48149, 48287, 48453, 48491 (computed with PostGIS, not asserted). **48177 is not among them.** Postal spillover across an intervening county is implausible, so this reads as bad situs text. It is the only row where adjacency rules out the benign explanation. |

Note the same string in Caldwell, `48055_waelder`, 56 parcels, is **legitimate**: 48177 does border 48055. Same string, two counties, two different answers. Do not batch them.

### 6c. Adjacent-county postal spillover, 23 rows, 1,992 parcel-rows. Undecidable from here.

In every one of these the named place sits in a county that physically touches the filing county. **CAD situs city is a postal city, and postal cities routinely cross county lines**, so an out-of-county name on a parcel near the county line is expected behaviour, not evidence of an error. Adjacency rules the error reading neither in nor out. A point-in-polygon test would settle each; the roster alone cannot.

| `breadth_*` | County filed under | Parcels | Names |
|---|---|---:|---|
| `48055_kyle` | Caldwell | 1,017 | Kyle |
| `48055_harwood` | Caldwell | 456 | Harwood |
| `48055_buda` | Caldwell | 118 | Buda |
| `48021_flatonia` | Bastrop | 111 | Flatonia |
| `48055_waelder` | Caldwell | 56 | Waelder |
| `48209_new_braunfels` | Hays | 48 | New Braunfels |
| `48021_giddings` | Bastrop | 41 | Giddings |
| `48021_manor` | Bastrop | 40 | Manor |
| `48209_round_mountain` | Hays | 32 | Round Mountain |
| `48021_la_grange` | Bastrop | 25 | La Grange |
| `48309_aquilla` | McLennan | 14 | Aquilla |
| `48209_blanco` | Hays | 11 | Blanco |
| `48309_oglesby` | McLennan | 7 | Oglesby |
| `48021_austin` | Bastrop | 4 | Austin |
| `48209_martindale` | Hays | 3 | Martindale |
| `48309_abbott` | McLennan | 2 | Abbott |
| `48055_bastrop` | Caldwell | 1 | Bastrop |
| `48055_wealder` | Caldwell | 1 | Waelder |
| `48209_johnson_city` | Hays | 1 | Johnson City |
| `48209_new_bruanfels` | Hays | 1 | New Braunfels |
| `48309_aaquilla` | McLennan | 1 | Aquilla |
| `48309_mount_calm` | McLennan | 1 | Mount Calm |
| `48021_lexington` | Bastrop | 1 | Lexington |

`48055_kyle` at 1,017 parcels is the only one worth geometry on volume alone.

**`48055_harwood`, 456 parcels, is undecidable for a different reason.** The roster row for Harwood is `place_fips` 32684, `parent_county_fips` **null**, `parent_county_name` the sentinel **`I`** (verified in the roster file). It is one of the 9 unlinked rows, so adjacency cannot be tested at all. That is a roster defect surfacing as an alias question, and it should be fixed in the roster rather than decided here.

---

## 7. What I would not sign

Nothing below is upgraded. Where I disagree with the seed I say so and move the row toward needs-human; I do not promote anything to `certain`.

### 7.1 Bruceville-Eddy half-names, corrected in this regeneration.

`48309_eddy` and `48309_bruceville` now grade `likely` / `roster-component` on Bruceville-Eddy `10828`. `48309_brucevill` and `48309_brucville` follow as `likely` / `misspelling-of-roster-place` on the same place. They sit in the decision table and the alias tail, not in the CDP bucket. A component match is never `certain` and never `roster-exact`.

This is still a string-to-place mapping, not a jurisdiction assertion. Bruceville-Eddy is a small city and 2,288 parcels under those two keys is almost certainly larger than its incorporated parcel count.

### 7.2 `48453_austin-tx`, 211,209 parcels, is 43.9% of the entire alias decision in one row.

I would sign the string-to-place mapping. `austin-tx` means Austin, `place_fips` 05000. What I would not sign is anything downstream treating it as jurisdiction. Travis County has 380,918 distinct parcels in this corpus and this single postal string covers 211,209 of them. If this alias is consumed as a jurisdiction assertion it fabricates Austin city jurisdiction on a six-figure parcel population in one move. **This row is where the semantic caveat stops being theoretical.**

### 7.3 Do not confirm `48021_bastrop-city-tx` in isolation.

The seed maps it to Bastrop 05864, `likely`, 5,795 parcels. The mapping is right. The hazard is the pairing: `48021_bastrop` at global rank 11 holds **17,538 parcels of the same place name** and is unresolved as a mixed-scope key (section 4). Confirm `bastrop-city-tx` alone and any consumer joining on `place_fips = 05864` silently gets 5,795 parcels and misses 17,538, with nothing announcing the gap. Two keys, one place name, a 3x parcel gap. They are not the same claim. Resolve them together or neither.

### 7.4 The 10 `unresolved` rows are misclassified as a spelling problem. 79 parcel-rows.

The seed treats these as no spelling being close enough to normalise. Read individually they are four different populations, and only two rows are genuinely unknown:

| `breadth_*` | County | Parcels | Seed lead | What it actually is |
|---|---|---:|---|---|
| `48209_fischer` | Hays | 37 | none, 0.38 to `wimberley` | Unincorporated community. Absent from the roster and from `tx_city_boundary` (both probed in the findings). Belongs in the **`unincorporated` ruling**, not here. |
| `48209_henly` | Hays | 25 | none, 0.43 to `wimberley` | Same. Absent from both sources. **`unincorporated`**. |
| `48209_henley` | Hays | 1 | none, 0.53 | Spelling variant of the row above. **`unincorporated`**. |
| `48309_birome` | McLennan | 10 | none, 0.43 to `robinson` | Absent from the roster. I verified only the roster, **not** the boundary table, so this one needs the probe the two above already had before it is routed. |
| `48309_moddy` | McLennan | 1 | `moody` at 0.80 | Genuine alias row. **Moody is in the roster**, `place_fips` 49200, parent county 48309, so it is in-county and clean. It sits below the 0.82 floor and nothing else. |
| `48209_kylr` | Hays | 1 | `kyle` at 0.75 | Genuine alias row. Kyle 39952, parent 48209, in-county. Below the floor and nothing else. |
| `48021_dael` | Bastrop | 1 | `dale` at 0.75 | Dale has **no** `place_fips`. Belongs in the **`unincorporated` ruling**. |
| `48309_mt_calm` | McLennan | 1 | `mount calm` at 0.80 | **Mount Calm is in the roster**, 49692, parent county **48217 Hill**, which is adjacent to McLennan. This is an **out-of-county spillover row (6c)**, not an unresolved one. Its full-spelling twin `48309_mount_calm` is already classed that way. |
| `48309_cavitt` | McLennan | 1 | none, 0.50 to `hallsburg` | Genuinely unknown. Leave `unresolved`. |
| `48309_shadow_ridge` | McLennan | 1 | none, 0.40 | Genuinely unknown. Leave `unresolved`. |

Net effect: 3 rows move to the `unincorporated` ruling with a 4th pending one probe, 2 stay alias rows sitting below the similarity floor, 1 moves to out-of-county, 2 stay genuinely unresolved. The bucket as labelled implies a better spelling match would clear it. It would not.

### 7.5 Six decision rows sit at the 0.82 similarity floor. I would sign all six, but eyeball them once.

| `breadth_*` | Parcels | Proposed | Sim | My read |
|---|---:|---|---|---|
| `48209_ausitn` | 59 | Austin | 0.83 | Transposition. Sign. |
| `48209_kyl` | 3 | Kyle | 0.86 | Truncation, only candidate in Hays. Sign. |
| `48309_wco` | 1 | Waco | 0.86 | Sign. |
| `48209_dripping_spr` | 1 | Dripping Springs | 0.85 | A truncation rather than a misspelling, but the only candidate in Hays. Sign. |
| `48309_lorean` | 1 | Lorena | 0.83 | Sign. |
| `48055_lulung` | 1 | Luling | 0.83 | Sign. |

I name them because 0.82 is an arbitrary threshold and these six are the rows where it did the work. Total exposure across all six is 66 parcels.

### 7.6 Cosmetic, but it will fork a display name.

`48021_mcdade` carries `proposed_place_name` **`Mcdade`** and `48021_mc_dade` carries **`Mc Dade`**. One place, two spellings in the seed, and neither is the conventional **McDade**. Both are headed for the `unincorporated` disposition so no `place_fips` is at risk, but if a display name is ever derived from this field it forks. Worth one edit.

---

## 8. Reconciliation

Every row is accounted for exactly once.

| Bucket | Rows | Parcel-rows | What you do |
|---|---:|---:|---|
| Decision table (section 1) | 63 | 483,715 | Confirm, yes/no. Stop after 20 if you like. |
| Alias tail (section 2) | 67 | 77 | Confirm 23 blocks, or skip. |
| `unknown` and CAD junk (section 3) | 21 | 509,928 | Nothing. Already disposed. |
| County-scoped traps (section 4) | 4 | 17,875 | Rule on a scope split. Not a mapping. |
| CDP, already ruled (section 5) | 36 | 33,999 | Nothing. Acknowledge the ruling's scope. |
| Out-of-county (section 6) | 24 | 2,054 | One class ruling plus one CAD-error correction. |
| `unresolved` (7.4) | 10 | 79 | Re-route per 7.4, then decide 2 rows. |
| **Total** | **225** | **1,047,727** | |

Every `breadth_*` value appears in exactly one bucket above, asserted in the generator rather than added up by hand: the 7 buckets hold 225 distinct values and their parcel-rows sum to 1,047,727.

> **An alias maps a STRING to a PLACE. It does not say the parcel is inside that place's corporate limits.** CAD situs city is a *postal* city. `48209_kyle` is 30,923 parcels, far more than Kyle's incorporated count; the balance is unincorporated Hays County with a Kyle mailing address. Confirming a row here is **not** a jurisdiction sign-off. In-limits membership is a point-in-polygon test against `tx_city_boundary`, and it is a different job from this one.

*Prepared read-only. No repo, store, or product file was written. This sheet is built to be confirmed, not to be authoritative: where it disagrees with the seed, section 7 says so explicitly rather than silently correcting the JSON.*

## Hash pin, line endings

The pin above is the **LF** sha256, which is what git stores and what a verifier
recomputing from the repository will get: `7e5ac620452cbeca9bd7d59042af1cc4678c239fc3aa46f20646292439bf94f3`.

The CRLF sha256 of the same content is `d3f6d340c2a713a2987aa93992b29135864d0f3aa7b7bd1578859ac7cf02fa97`. That value was pinned first,
computed on a Windows working copy before commit, and it does not match the
committed artifact. Corrected 1 occurrence(s) 2026-08-31. When pinning a hash for
an artifact that will be committed, compute it on the bytes git will store.
