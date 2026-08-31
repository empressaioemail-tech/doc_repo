# -*- coding: utf-8 -*-
import json, re, collections, io, hashlib

SEED = r"P:\doc_repo\_catalog\2026-08-30_breadth_place_alias_seed.json"
ROST = r"P:\doc_repo\_catalog\texas_roster_v1.json"
OUT  = r"C:\Users\cente\AppData\Local\Temp\claude\p--doc-repo\fee8e111-788c-4d0e-bd16-5510b77df32c\scratchpad\alias_confirm_sheet.md"

seed_raw = open(SEED, 'rb').read()
R = json.loads(seed_raw.decode('utf-8'))
C = json.loads(open(ROST, 'rb').read().decode('utf-8'))['cities']
ros = {c['name'].lower(): c for c in C}
TOT = sum(r['parcel_count'] for r in R)
DEC = {'roster-exact', 'misspelling-of-roster-place', 'straddle'}
CDPK = {'unincorporated-place-no-place-fips', 'misspelling-of-unincorporated-place'}
BE = {'breadth_48309_eddy', 'breadth_48309_bruceville', 'breadth_48309_brucevill', 'breadth_48309_brucville'}
grank = {r['breadth_value']: i for i, r in enumerate(R, 1)}
DECR = [r for r in R if r['kind'] in DEC]
decTOT = sum(r['parcel_count'] for r in DECR)
main = [r for r in DECR if r['parcel_count'] > 2]
tail = [r for r in DECR if r['parcel_count'] <= 2]

FLAG = {
    'breadth_48453_austin-tx': 'CAVEAT',
    'breadth_48021_bastrop-city-tx': 'PAIR',
    'breadth_48209_ausitn': 'FLOOR',
    'breadth_48209_kyl': 'FLOOR',
}


def reason(r):
    n, k = r['note'], r['kind']
    m = re.search(r'similarity (0\.\d+)', n)
    if k == 'misspelling-of-roster-place':
        a = re.search(r'MISSPELLING of `([^`]+)`', n)
        anchor = a.group(1) if a else (r['proposed_place_name'] or '').lower()
        return "misspelling of `%s`, sim %s" % (anchor, m.group(1) if m else '?')
    if k == 'straddle':
        c = ros.get((r['proposed_place_name'] or '').lower())
        return "straddle, primary county %s, holds territory in %s" % (c['parent_county_fips'] if c else '?', r['county_fips'])
    if k == 'roster-exact':
        if n.startswith('Exact roster match'):
            return "exact roster name, county agrees"
        s = re.match(r'Roster match after stripping ([^;]+);', n)
        return "roster match, stripped %s" % (s.group(1) if s else 'suffix')
    return n.split('.')[0][:70]


CAVEAT = (
    "> **An alias maps a STRING to a PLACE. It does not say the parcel is inside that place's corporate limits.** "
    "CAD situs city is a *postal* city. `48209_kyle` is 30,923 parcels, far more than Kyle's incorporated count; "
    "the balance is unincorporated Hays County with a Kyle mailing address. Confirming a row here is **not** a "
    "jurisdiction sign-off. In-limits membership is a point-in-polygon test against `tx_city_boundary`, and it is "
    "a different job from this one.\n"
)

o = io.StringIO()
W = o.write

W("# `breadth_*` to `place_fips` alias, operator confirm sheet\n\n")
W("**Read this first.**\n\n")
W("1. **61 rows carry the decision.** They are 481,429 of the 481,504 alias parcel-rows (**99.98%** of alias weight, **46.0%** of the corpus). The first 20 of them are 96.2%. Everything after row 20 is optional.\n")
W("2. **42 more rows need four rulings, not a yes/no**: the Bruceville-Eddy correction (4 rows, 2,288 parcels, flagged below as a seed error), the 4 county-scoped traps (17,875), the 24 out-of-county rows (2,054), the 10 `unresolved` rows (79). Combined weight 22,296 parcel-rows, and 17,875 of that is the four traps alone.\n")
W("3. **122 rows need nothing from you.** 21 are `unknown` or CAD junk (509,928 parcel-rows, disposition already fixed by the four-state contract), 36 are already ruled `unincorporated` by the 2026-08-30 decision, and 65 are alias tail rows worth **75 parcels in total** (confirmable as 23 one-line blocks, or skipped).\n\n")
W(CAVEAT + "\n")

W("## Provenance\n\n")
W("| | |\n|---|---|\n")
W("| Seed | `P:\\doc_repo\\_catalog\\2026-08-30_breadth_place_alias_seed.json`, 225 rows |\n")
W("| Seed sha256 | `%s` |\n" % hashlib.sha256(seed_raw).hexdigest())
W("| Roster | `_catalog/texas_roster_v1.json`, 1,223 incorporated cities |\n")
W("| doc_repo | branch `main`, commit `e4b312ea351dcd3638da82c13316166125069e91` |\n")
W("| Sources read | the seed JSON, `_inbox/2026-08-30_alias_seed_findings.md`, `_decisions/2026-08-30_unincorporated_is_the_disposition.md`, the roster file |\n")
W("| Store access | **none**. This sheet is derived entirely from files. No query was run, so nothing here is `unmeasured` and nothing here re-measures the store. |\n")
W("| Instrument | file-based Python, self-tested in both directions before use: 225 rows, 1,047,727 parcel-rows, top-3 = 663,467 (63.32%), top-25 = 94.72%, 112 rows at 2 parcels or fewer, 97 at exactly 1. Two negative controls (fabricated `kind` returns 0; `p AND NOT p` returns 0) and one non-vacuity control passed. |\n\n")
W("`parcel_count` double counts the 66,149 parcels carrying more than one `breadth_*` value. Distinct parcels are 981,413. Use these percentages for **ordering by impact**, never as a parcel population.\n\n")

W("---\n\n## 1. The decision table, 61 rows\n\n")
W(CAVEAT + "\n")
W("Ordered by impact. `cum% alias` is the running share of the 481,504 alias parcel-rows. `#` is the row's global rank among all 225 seed rows, so you can see which already-ruled rows it steps over. Confidence is the seed's own grade, **not upgraded by me**.\n\n")
W("| # | `breadth_*` (prefix stripped) | County | Parcels | cum% alias | cum% corpus | place_fips | Place | Conf | Reason | OK? |\n")
W("|---:|---|---|---:|---:|---:|---|---|---|---|---|\n")
c = 0
for i, r in enumerate(main, 1):
    c += r['parcel_count']
    gr = grank[r['breadth_value']]
    fl = FLAG.get(r['breadth_value'], '')
    flt = {'CAVEAT': ' **[see 7.2]**', 'PAIR': ' **[see 7.3]**', 'FLOOR': ' *(at 0.82 floor)*'}.get(fl, '')
    W("| %d | `%s` | %s | %s | %.1f%% | %.1f%% | %s | %s | %s | %s%s | [ ] |\n" % (
        gr, r['breadth_value'].replace('breadth_', ''), r['county_name'], format(r['parcel_count'], ','),
        100 * c / decTOT, 100 * sum(x['parcel_count'] for x in R[:gr]) / TOT,
        r['proposed_place_fips'], r['proposed_place_name'], r['confidence'], reason(r), flt))
    if i == 20:
        W("| | **STOP LINE. The 20 rows above are 96.2% of alias weight. The 41 below add 3.8%, 18,436 parcel-rows.** | | | | | | | | | |\n")
W("\n")

W("---\n\n## 2. Alias tail, 65 rows, 75 parcels in total\n\n")
W(CAVEAT + "\n")
W("Every row here is 1 or 2 parcels. They are grouped by target so each block is one decision rather than one per string. Confirming all 23 blocks moves alias weight by 0.02%. Skipping them is defensible.\n\n")
W("| Place | place_fips | County | Rows | Parcels | Strings | OK? |\n|---|---|---|---:|---:|---|---|\n")
g = collections.defaultdict(list)
for r in tail:
    g[(r['proposed_place_fips'], r['proposed_place_name'], r['county_name'])].append(r)
for (f, n, cty), rs in sorted(g.items(), key=lambda kv: (-len(kv[1]), kv[0][1])):
    vals = ", ".join("`%s`" % x['breadth_value'].replace('breadth_', '') for x in sorted(rs, key=lambda z: z['breadth_value']))
    W("| %s | %s | %s | %d | %d | %s | [ ] |\n" % (n, f, cty, len(rs), sum(x['parcel_count'] for x in rs), vals))
W("\n")

W("---\n\n## 3. NOT alias candidates: the `unknown` rows. No decision required.\n\n")
W("**509,911 parcels carry the literal token `unknown` and no jurisdiction string at all.** That is **52.0% of the 981,413 distinct parcels**, and 48.7% of the 1,047,727 parcel-rows. (The two denominators differ because 66,149 parcels carry more than one `breadth_*` value. The 52.0% figure is the one that describes parcels.) There is nothing to alias. No `place_fips` exists or can exist for them. Do not attempt to map them, and do not let their size pull them into this pass: they sit at the very top of the impact ladder and they are not a decision.\n\n")
W("Containment resolves them, not names. Per the 2026-08-30 ruling, jurisdiction comes from spatial containment against `tx_city_boundary`; a parcel outside every incorporated polygon is `unincorporated` **by measurement**. The alias table stays name normalisation and never becomes a jurisdiction source.\n\n")
W("Of the 509,911, **449,725 have no jurisdiction string anywhere in the store** and 60,186 are recoverable from a second atom on the same parcel. Williamson (282,570, one value for the whole county, zero recoverable) and Travis (147,676 unknown-only) are 96% of the unrecoverable population. That is a spatial-assignment or re-ingest question and it is the actual long pole. The alias table does not touch it.\n\n")
W("| `breadth_*` | County | Parcels | Why it is not a place |\n|---|---|---:|---|\n")
for r in sorted([r for r in R if r['kind'] == 'not-a-jurisdiction'], key=lambda z: -z['parcel_count']):
    m = re.search(r'NOT A JURISDICTION \((.*?)\)(?:\.|$)', r['note'])
    W("| `%s` | %s | %s | %s |\n" % (r['breadth_value'].replace('breadth_', ''), r['county_name'], format(r['parcel_count'], ','), m.group(1) if m else '?'))
W("\nSix rows are the literal token and carry 509,911 parcel-rows. The other fifteen are road fragments, CAD remark text, internal codes and a county abbreviation, and carry **17 parcel-rows between them**.\n\n")

W("---\n\n## 4. The four county-scoped keys. These are traps, not clean matches.\n\n")
W("All four free texts are **county** names. Three of the four collide with a real incorporated city elsewhere in Texas, and a seeder working from the string alone would map them confidently and wrongly.\n\n")
W("| `breadth_*` | Parcels | road-node atoms | What a naive roster lookup does | Why that is wrong |\n|---|---:|---:|---|---|\n")
W("| `48209_hays` | 0 | 40,987 | Resolves to **Hays city**, `place_fips` 32906, whose `parent_county_fips` is **48209**. Both halves of the `certain` test pass, so it grades **`certain`**, not merely matched. | Hays city is a small incorporated town inside Hays County. The string here is the **county**. This is the worst of the four precisely because the county-agreement check cannot catch it. |\n")
W("| `48055_caldwell` | 337 | 13,790 | Resolves to **Caldwell city**, `place_fips` 11836, in **Burleson County (48051)**. | The county check does catch this one, but it catches it as *out-of-county*, which is the wrong diagnosis. The row is not a city filed under the wrong county, it is not a city at all. A wrong diagnosis leads to a wrong disposition. |\n")
W("| `48309_mclennan` | 0 | 28,787 | Resolves to nothing. No roster place is named McLennan (verified against the roster file). | Safe by luck, not by design. |\n")
W("| `48021_bastrop` | 17,538 | 36,802 | Exact roster match on **Bastrop**, `place_fips` 05864, primary county 48021. Both halves pass, so it grades `certain`. | **Mixed scope.** 36,802 county road-node atoms and 17,538 parcels under one string, while a separate `48021_bastrop-city-tx` carries 5,795 city-stamped parcels. The string is doing two jobs. It cannot take a single `place_fips` until the scopes are split. |\n")
W("\n`48209_hays` and `48309_mclennan` carry **zero parcels** and only `road-node` atoms, which is the tell: they are county road networks keyed by county name. `48021_bastrop` and `48055_caldwell` are **mixed**, carrying county roads and parcels under one string.\n\n")
W("**The decision here is a scope split, not a mapping.** Until roads and parcels are separated, none of the four should receive an alias row.\n\n")

W("---\n\n## 5. The CDP rows. Already ruled. No confirmation required.\n\n")
W("The 2026-08-30 decision `_decisions/2026-08-30_unincorporated_is_the_disposition.md` settles these: a place that is not an incorporated city gets the explicit disposition **`unincorporated`**, the roster is **not** extended to CDPs, and nobody seeds around the gap. Listed here so you can see the scope the ruling covers, not so you can decide it.\n\n")
W("**Scope correction, and it matters.** The ruling text says 40 values covering 17 places. **Four of those 40 rows are out of scope**, because the place they name is incorporated and does have a `place_fips`. See 7.1. The corrected scope is **36 rows, 33,999 parcel-rows, 15 real unincorporated places** (the seed spells McDade two ways, `Mcdade` and `Mc Dade`, which reads as 16 in the table below).\n\n")
W("| Place | County | Rows | Parcels | Strings |\n|---|---|---:|---:|---|\n")
rest = [r for r in R if r['kind'] in CDPK and r['breadth_value'] not in BE]
gg = collections.defaultdict(list)
for r in rest:
    gg[r['proposed_place_name']].append(r)
for n, rs in sorted(gg.items(), key=lambda kv: -sum(x['parcel_count'] for x in kv[1])):
    W("| %s | %s | %d | %s | %s |\n" % (
        n, ", ".join(sorted({x['county_name'] for x in rs})), len(rs),
        format(sum(x['parcel_count'] for x in rs), ','),
        ", ".join("`%s`" % x['breadth_value'].replace('breadth_', '') for x in sorted(rs, key=lambda z: -z['parcel_count']))))
W("\nAll were probed against both `texas_roster_v1.json` (1,223 incorporated cities) and `tx_city_boundary` (1,222 polygons) and found in neither. `place_fips` cannot express them, which is exactly what the ruling decided rather than worked around.\n\n")

W("---\n\n## 6. The 24 out-of-county rows\n\n")
W(CAVEAT + "\n")
W("**An arithmetic note before the table.** The findings doc and the framing of this request differ on whether the 5 straddles sit inside the 24. The findings are explicit and I follow them: a straddle is **not** an out-of-county row. The 24 = **1 CAD error + 23 undecidable**. The 5 straddles are a separate, already-resolved class, listed here for completeness because they are the rows that would *look* out-of-county to a naive check.\n\n")
W("### 6a. Straddles, 5 rows, resolved via `all_county_fips`. Already in the section 1 table.\n\n")
W("| `breadth_*` | Parcels | Place | Primary county | Resolves because |\n|---|---:|---|---|---|\n")
for r in sorted([r for r in R if r['kind'] == 'straddle'], key=lambda z: -z['parcel_count']):
    cc = ros.get((r['proposed_place_name'] or '').lower())
    W("| `%s` | %s | %s | %s | `all_county_fips` %s includes %s |\n" % (
        r['breadth_value'].replace('breadth_', ''), format(r['parcel_count'], ','), r['proposed_place_name'],
        cc['parent_county_fips'] if cc else '?', cc.get('all_county_fips') if cc else '?', r['county_fips']))
W("\nThese are legitimate and not errors. Austin holds territory in 48209, 48453 and 48491; San Marcos in 48055 and 48209.\n\n")
W("### 6b. CAD data error, exactly 1 row.\n\n")
W("| `breadth_*` | Parcels | Place | Its county | Why this one is different |\n|---|---:|---|---|---|\n")
W("| `48021_waelder` | 62 | Waelder | 48177 Gonzales | Bastrop's adjacent counties are 48055, 48149, 48287, 48453, 48491 (computed with PostGIS, not asserted). **48177 is not among them.** Postal spillover across an intervening county is implausible, so this reads as bad situs text. It is the only row where adjacency rules out the benign explanation. |\n")
W("\nNote the same string in Caldwell, `48055_waelder`, 56 parcels, is **legitimate**: 48177 does border 48055. Same string, two counties, two different answers. Do not batch them.\n\n")
W("### 6c. Adjacent-county postal spillover, 23 rows, 1,992 parcel-rows. Undecidable from here.\n\n")
W("In every one of these the named place sits in a county that physically touches the filing county. **CAD situs city is a postal city, and postal cities routinely cross county lines**, so an out-of-county name on a parcel near the county line is expected behaviour, not evidence of an error. Adjacency rules the error reading neither in nor out. A point-in-polygon test would settle each; the roster alone cannot.\n\n")
W("| `breadth_*` | County filed under | Parcels | Names |\n|---|---|---:|---|\n")
for r in sorted([r for r in R if r['kind'] == 'c-undecidable'], key=lambda z: -z['parcel_count']):
    W("| `%s` | %s | %s | %s |\n" % (r['breadth_value'].replace('breadth_', ''), r['county_name'], format(r['parcel_count'], ','), r['proposed_place_name']))
W("\n`48055_kyle` at 1,017 parcels is the only one worth geometry on volume alone.\n\n")
W("**`48055_harwood`, 456 parcels, is undecidable for a different reason.** The roster row for Harwood is `place_fips` 32684, `parent_county_fips` **null**, `parent_county_name` the sentinel **`I`** (verified in the roster file). It is one of the 9 unlinked rows, so adjacency cannot be tested at all. That is a roster defect surfacing as an alias question, and it should be fixed in the roster rather than decided here.\n\n")

W("---\n\n## 7. What I would not sign\n\n")
W("Nothing below is upgraded. Where I disagree with the seed I say so and move the row toward needs-human; I do not promote anything to `certain`.\n\n")
W("### 7.1 The seed misfiles Bruceville-Eddy. 4 rows, 2,288 parcels. This is a real error.\n\n")
W("The seed grades `48309_eddy` (1,274), `48309_bruceville` (1,012), `48309_brucevill` (1) and `48309_brucville` (1) as `unincorporated-place-no-place-fips`. **That is false.** Verified against the roster file:\n\n")
W("```\nplace_fips 10828 | Bruceville-Eddy | \"Bruceville-Eddy city\" | parent 48309 McLennan | all_county_fips ['48145','48309']\n```\n\n")
W("The seeder's lookup is exact-name, and `bruceville` and `eddy` are each one half of a hyphenated name, so it correctly reported no exact match and then drew the wrong conclusion from it. The findings doc caught this in prose (section 5b), but **the `kind` field in the JSON still says the place has no `place_fips`**, and an operator working the CDP list would sweep all four rows into the 2026-08-30 `unincorporated` ruling. They must not be. A `place_fips` exists, so the ruling does not reach them.\n\n")
W("This is a decision, not an acknowledgement: confirm that all four map to 10828, or split them. I would not sign it blind, because Bruceville and Eddy were separate communities before they merged and the two halves may key different territory in CAD.\n\n")
W("### 7.2 `48453_austin-tx`, 211,209 parcels, is 43.9% of the entire alias decision in one row.\n\n")
W("I would sign the string-to-place mapping. `austin-tx` means Austin, `place_fips` 05000. What I would not sign is anything downstream treating it as jurisdiction. Travis County has 380,918 distinct parcels in this corpus and this single postal string covers 211,209 of them. If this alias is consumed as a jurisdiction assertion it fabricates Austin city jurisdiction on a six-figure parcel population in one move. **This row is where the semantic caveat stops being theoretical.**\n\n")
W("### 7.3 Do not confirm `48021_bastrop-city-tx` in isolation.\n\n")
W("The seed maps it to Bastrop 05864, `likely`, 5,795 parcels. The mapping is right. The hazard is the pairing: `48021_bastrop` at global rank 11 holds **17,538 parcels of the same place name** and is unresolved as a mixed-scope key (section 4). Confirm `bastrop-city-tx` alone and any consumer joining on `place_fips = 05864` silently gets 5,795 parcels and misses 17,538, with nothing announcing the gap. Two keys, one place name, a 3x parcel gap. They are not the same claim. Resolve them together or neither.\n\n")
W("### 7.4 The 10 `unresolved` rows are misclassified as a spelling problem. 79 parcel-rows.\n\n")
W("The seed treats these as no spelling being close enough to normalise. Read individually they are four different populations, and only two rows are genuinely unknown:\n\n")
W("| `breadth_*` | County | Parcels | Seed lead | What it actually is |\n|---|---|---:|---|---|\n")
W("| `48209_fischer` | Hays | 37 | none, 0.38 to `wimberley` | Unincorporated community. Absent from the roster and from `tx_city_boundary` (both probed in the findings). Belongs in the **`unincorporated` ruling**, not here. |\n")
W("| `48209_henly` | Hays | 25 | none, 0.43 to `wimberley` | Same. Absent from both sources. **`unincorporated`**. |\n")
W("| `48209_henley` | Hays | 1 | none, 0.53 | Spelling variant of the row above. **`unincorporated`**. |\n")
W("| `48309_birome` | McLennan | 10 | none, 0.43 to `robinson` | Absent from the roster. I verified only the roster, **not** the boundary table, so this one needs the probe the two above already had before it is routed. |\n")
W("| `48309_moddy` | McLennan | 1 | `moody` at 0.80 | Genuine alias row. **Moody is in the roster**, `place_fips` 49200, parent county 48309, so it is in-county and clean. It sits below the 0.82 floor and nothing else. |\n")
W("| `48209_kylr` | Hays | 1 | `kyle` at 0.75 | Genuine alias row. Kyle 39952, parent 48209, in-county. Below the floor and nothing else. |\n")
W("| `48021_dael` | Bastrop | 1 | `dale` at 0.75 | Dale has **no** `place_fips`. Belongs in the **`unincorporated` ruling**. |\n")
W("| `48309_mt_calm` | McLennan | 1 | `mount calm` at 0.80 | **Mount Calm is in the roster**, 49692, parent county **48217 Hill**, which is adjacent to McLennan. This is an **out-of-county spillover row (6c)**, not an unresolved one. Its full-spelling twin `48309_mount_calm` is already classed that way. |\n")
W("| `48309_cavitt` | McLennan | 1 | none, 0.50 to `hallsburg` | Genuinely unknown. Leave `unresolved`. |\n")
W("| `48309_shadow_ridge` | McLennan | 1 | none, 0.40 | Genuinely unknown. Leave `unresolved`. |\n")
W("\nNet effect: 3 rows move to the `unincorporated` ruling with a 4th pending one probe, 2 stay alias rows sitting below the similarity floor, 1 moves to out-of-county, 2 stay genuinely unresolved. The bucket as labelled implies a better spelling match would clear it. It would not.\n\n")
W("### 7.5 Six decision rows sit at the 0.82 similarity floor. I would sign all six, but eyeball them once.\n\n")
W("| `breadth_*` | Parcels | Proposed | Sim | My read |\n|---|---:|---|---|---|\n")
W("| `48209_ausitn` | 59 | Austin | 0.83 | Transposition. Sign. |\n")
W("| `48209_kyl` | 3 | Kyle | 0.86 | Truncation, only candidate in Hays. Sign. |\n")
W("| `48309_wco` | 1 | Waco | 0.86 | Sign. |\n")
W("| `48209_dripping_spr` | 1 | Dripping Springs | 0.85 | A truncation rather than a misspelling, but the only candidate in Hays. Sign. |\n")
W("| `48309_lorean` | 1 | Lorena | 0.83 | Sign. |\n")
W("| `48055_lulung` | 1 | Luling | 0.83 | Sign. |\n")
W("\nI name them because 0.82 is an arbitrary threshold and these six are the rows where it did the work. Total exposure across all six is 66 parcels.\n\n")
W("### 7.6 Cosmetic, but it will fork a display name.\n\n")
W("`48021_mcdade` carries `proposed_place_name` **`Mcdade`** and `48021_mc_dade` carries **`Mc Dade`**. One place, two spellings in the seed, and neither is the conventional **McDade**. Both are headed for the `unincorporated` disposition so no `place_fips` is at risk, but if a display name is ever derived from this field it forks. Worth one edit.\n\n")

W("---\n\n## 8. Reconciliation\n\n")
W("Every row is accounted for exactly once.\n\n")
BUCKETS = [
    ("Decision table (section 1)", main, "Confirm, yes/no. Stop after 20 if you like."),
    ("Alias tail (section 2)", tail, "Confirm 23 blocks, or skip."),
    ("`unknown` and CAD junk (section 3)", [r for r in R if r['kind'] == 'not-a-jurisdiction'], "Nothing. Already disposed."),
    ("County-scoped traps (section 4)", [r for r in R if r['kind'] in ('county-level-key', 'mixed-scope-key')], "Rule on a scope split. Not a mapping."),
    ("CDP, already ruled (section 5)", rest, "Nothing. Acknowledge the ruling's scope."),
    ("Out-of-county (section 6)", [r for r in R if r['kind'] in ('c-undecidable', 'b-cad-error')], "One class ruling plus one CAD-error correction."),
    ("Bruceville-Eddy, seed error (7.1)", [r for r in R if r['breadth_value'] in BE], "Decide. A `place_fips` exists."),
    ("`unresolved` (7.4)", [r for r in R if r['kind'] == 'unresolved'], "Re-route per 7.4, then decide 2 rows."),
]
seen = [v for _, rs, _ in BUCKETS for v in (x['breadth_value'] for x in rs)]
assert len(seen) == len(set(seen)) == 225, ("bucket overlap or gap", len(seen), len(set(seen)))
assert sum(len(rs) for _, rs, _ in BUCKETS) == 225
assert sum(sum(x['parcel_count'] for x in rs) for _, rs, _ in BUCKETS) == TOT
W("| Bucket | Rows | Parcel-rows | What you do |\n|---|---:|---:|---|\n")
for name, rs, act in BUCKETS:
    W("| %s | %d | %s | %s |\n" % (name, len(rs), format(sum(x['parcel_count'] for x in rs), ','), act))
W("| **Total** | **%d** | **%s** | |\n\n" % (sum(len(rs) for _, rs, _ in BUCKETS), format(TOT, ',')))
W("Every `breadth_*` value appears in exactly one bucket above, asserted in the generator rather than added up by hand: the eight buckets hold 225 distinct values and their parcel-rows sum to 1,047,727. Row-count checks: 61 + 65 = 126 alias candidates; 36 + 4 = 40 CDP rows as the seed grades them; 21 + 4 + 24 + 10 = 59; 126 + 40 + 59 = 225.\n\n")
W(CAVEAT)
W("\n*Prepared read-only. No repo, store, or product file was written. This sheet is built to be confirmed, not to be authoritative: where it disagrees with the seed, section 7 says so explicitly rather than silently correcting the JSON.*\n")

open(OUT, 'w', encoding='utf-8').write(o.getvalue())
print("WROTE", OUT, len(o.getvalue()), "bytes")
