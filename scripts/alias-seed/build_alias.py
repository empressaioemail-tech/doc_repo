import json, re, difflib
from collections import Counter, defaultdict

SCR = r"C:/Users/cente/AppData/Local/Temp/claude/p--doc-repo/fee8e111-788c-4d0e-bd16-5510b77df32c/scratchpad"
ROSTER = r"P:/doc_repo/_catalog/texas_roster_v1.json"
SIX = {'48021': 'Bastrop', '48055': 'Caldwell', '48209': 'Hays',
       '48309': 'McLennan', '48453': 'Travis', '48491': 'Williamson'}
LIMITS = (" Maps the STRING to a PLACE; it does NOT establish that these parcels lie inside "
          "that place's corporate limits. CAD situs city is a postal city.")

d = json.load(open(ROSTER, encoding='utf-8'))
cities = d['cities']
counties = {c['fips']: c['name'] for c in d['counties']}

adj = defaultdict(set)
for line in open(SCR + "/adjacency.txt", encoding='utf-8'):
    p = line.strip().split("|")
    if len(p) == 3:
        adj[p[0]].add(p[1])


def nk(s):
    s = re.sub(r"[^a-z0-9]+", " ", s.lower()).strip()
    return re.sub(r"\s+", "", s)


roster_by_key = {}
for c in cities:
    roster_by_key.setdefault(nk(c['name']), []).append(c)

# secondary index on full_name ("Bastrop city", "Buda town", "Volente village").
# CAD situs strings sometimes carry the legal-status word, e.g. `bastrop-city-tx`.
roster_by_fullname = {}
for c in cities:
    roster_by_fullname.setdefault(nk(c['full_name']), []).append(c)


def roster_lookup(key):
    """Primary name index first; fall back to the full_name index only on a clean single hit.
    Returns (hits, matched_via) or (None, None)."""
    if roster_by_key.get(key):
        return roster_by_key[key], 'name'
    alt = roster_by_fullname.get(key)
    if alt and len(alt) == 1 and key not in roster_by_key:
        return alt, 'full_name'
    return None, None

rows = []
for line in open(SCR + "/master_raw.tsv", encoding='utf-8'):
    line = line.rstrip("\n")
    if not line or line.startswith("Pager"):
        continue
    p = line.split("\t")
    if len(p) < 5:
        continue
    m = re.match(r"^breadth_(\d{5})_(.*)$", p[0])
    rows.append(dict(jt=p[0], fips=m.group(1), free=m.group(2),
                     atoms=int(p[1]), parcels=int(p[2]), roads=int(p[3]), types=p[4]))
assert len(rows) == 225, len(rows)

NONJUR = {'unknown': 'literal `unknown` token',
          'houses_only': 'literal `houses_only` token',
          'training_center': 'facility name, not a place',
          'owner_responsibilty': 'CAD remark text, not a place',
          'cedar': 'truncated fragment, ambiguous',
          'co_rd': 'road fragment (County Road)',
          'empire': 'road/subdivision fragment (Empire St)',
          'empire_st': 'road fragment',
          'cr102': 'road fragment (CR 102)',
          'm66626': 'CAD internal code',
          'guad_co': 'county abbreviation (Guadalupe County), not a place in this county'}
APOS = chr(39)


def nonjur(f):
    if f in NONJUR:
        return NONJUR[f]
    if re.fullmatch(r"\d{5}", f):
        return 'zip code only'
    if re.search(r"[0-9]", f) and not re.search(r"_7[0-9]{4}$", f):
        return 'contains digits that are not a trailing zip'
    if re.search(r"(^|_)(st|dr|ct|tr|rd|ln|cv|blvd)($|_|,)", f):
        return 'road fragment'
    if APOS in f or "(" in f or "&" in f:
        return 'freeform CAD note'
    return None


def normalise(free):
    s = re.sub(r"[,\.]+$", "", free).replace("_", " ").replace("-", " ")
    s = re.sub(r"\s+", " ", s).strip()
    stripped = []
    for _ in range(2):
        m = re.search(r"\s(7\d{4})$", s)
        if m:
            stripped.append("zip " + m.group(1))
            s = s[:m.start()].strip()
        m = re.search(r"\s(tx|texas|tex)$", s)
        if m:
            stripped.append("state suffix `" + m.group(1) + "`")
            s = s[:m.start()].strip()
    return s.strip(), stripped


anchors, postal = {}, {}
for r in rows:
    if nonjur(r['free']) or (r['roads'] > 0 and r['parcels'] == 0):
        continue
    base, _ = normalise(r['free'])
    hh, _via = roster_lookup(nk(base))
    if hh:
        cur = anchors.setdefault(r['fips'], {}).get(nk(base))
        if cur is None or r['parcels'] > cur[2]:
            anchors[r['fips']][nk(base)] = (base, hh, r['parcels'])
for r in sorted(rows, key=lambda x: -x['parcels']):
    if nonjur(r['free']) or (r['roads'] > 0 and r['parcels'] == 0):
        continue
    base, _ = normalise(r['free'])
    if roster_lookup(nk(base))[0] or r['parcels'] < 100:
        continue
    postal.setdefault(r['fips'], {}).setdefault(nk(base), (base, r['parcels']))


def best_anchor(fips, key):
    pool = {}
    for k, (b, h, pc) in anchors.get(fips, {}).items():
        pool[k] = ('roster', b, h, pc)
    for k, (b, pc) in postal.get(fips, {}).items():
        pool.setdefault(k, ('postal', b, None, pc))
    pool.pop(key, None)          # never match a value against itself
    best, bestr = None, 0.0
    for k, v in pool.items():
        rr = difflib.SequenceMatcher(None, key, k).ratio()
        if rr > bestr:
            bestr, best = rr, (k, v)
    return best, bestr


# every roster place that holds territory in the county, as a lead for unresolved values
county_pool = {}
for c in cities:
    for f in (c.get('all_county_fips') or []):
        county_pool.setdefault(f, {})[nk(c['name'])] = c


def county_hint(fips, key):
    best, bestr = None, 0.0
    for k, c in county_pool.get(fips, {}).items():
        rr = difflib.SequenceMatcher(None, key, k).ratio()
        if rr > bestr:
            bestr, best = rr, c
    if not best:
        return ""
    return (" Closest incorporated place holding territory in %s is %s (place_fips %s), similarity "
            "%.2f -- a lead for the human, NOT a proposed mapping." % (fips, best['name'], best['place_fips'], bestr))


def out_of_county_class(h, fips):
    """(a) straddle handled upstream. Here: (b) CAD error, (c) undecidable/spillover."""
    allc = [x for x in (h.get('all_county_fips') or []) if x]
    prim = h.get('parent_county_fips')
    pool = set(allc) | ({prim} if prim else set())
    if not pool:
        return ('c-undecidable',
                "The roster row for %s carries NO parent_county_fips and an empty all_county_fips "
                "(it is one of the 9 unlinked roster rows). Its county cannot be established from "
                "the roster, so adjacency cannot be tested. ROSTER GAP, not shown to be a CAD error."
                % h['name'])
    if pool & adj.get(fips, set()):
        near = sorted(pool & adj[fips])
        return ('c-undecidable',
                "%s sits in %s, which is ADJACENT to %s (%s). CAD situs city is a POSTAL city and "
                "postal cities routinely cross county lines, so this is expected behaviour near the "
                "county line, not shown to be an error. Undecidable from the roster alone; a "
                "point-in-polygon test on the parcels would decide it."
                % (h['name'], "/".join(near), fips, SIX[fips]))
    return ('b-cad-error',
            "%s sits in %s (%s), which is NOT adjacent to %s (%s). Adjacent counties of %s are %s. "
            "A postal spillover is implausible at that distance, so this reads as a CAD situs "
            "data error."
            % (h['name'], "/".join(sorted(pool)), counties.get(prim, '?'), fips, SIX[fips],
               fips, ",".join(sorted(adj.get(fips, set())))))


out = []
for r in rows:
    fips, free = r['fips'], r['free']
    rec = dict(breadth_value=r['jt'], county_fips=fips, parcel_count=r['parcels'],
               proposed_place_fips=None, proposed_place_name=None,
               confidence=None, note=None,
               county_name=SIX[fips], atom_rows=r['atoms'],
               road_node_rows=r['roads'], entity_types=r['types'],
               kind=None)

    # 1. road-bearing tenants: county-scoped, never a place alias as-is
    if r['roads'] > 0:
        base0, _ = normalise(free)
        is_county_name = (nk(base0) == nk(SIX[fips]))
        wrong = roster_lookup(nk(base0))[0]
        wrongtxt = ""
        if wrong:
            w = wrong[0]
            wrongtxt = (" A naive roster lookup resolves this string to %s (place_fips %s, county "
                        "%s), which is a DIFFERENT thing; do not accept that mapping."
                        % (w['name'], w['place_fips'], w.get('parent_county_fips')))
        if r['parcels'] == 0:
            rec.update(confidence='needs-human', kind='county-level-key',
                       note=("COUNTY-LEVEL KEY, not a city. %d road-node atoms and ZERO parcels. The "
                             "free text is the COUNTY name (%s). place_fips is the WRONG TARGET: this "
                             "row denotes county %s. It needs a county binding, not a place alias.%s"
                             % (r['roads'], 'yes' if is_county_name else 'no', fips, wrongtxt)))
        else:
            rec.update(confidence='needs-human', kind='mixed-scope-key',
                       note=("MIXED-SCOPE KEY. One string is serving two scopes: %d county-scoped "
                             "road-node atoms AND %d parcels. Free text equals the county name: %s. "
                             "It cannot be aliased to a single place_fips until the two scopes are "
                             "split.%s"
                             % (r['roads'], r['parcels'], 'yes' if is_county_name else 'no', wrongtxt)))
        out.append(rec)
        continue

    # 2. not a jurisdiction at all
    nj = nonjur(free)
    if nj:
        rec.update(confidence='needs-human', kind='not-a-jurisdiction',
                   note=("NOT A JURISDICTION (%s). No place_fips exists or can exist. Correct "
                         "disposition is `unknown` under the four-state contract, not an alias row." % nj))
        out.append(rec)
        continue

    base, stripped = normalise(free)
    key = nk(base)
    hits, matched_via = roster_lookup(key)
    mixed = (" MIXED KEY: this tenant ALSO carries %d county-scoped road-node atoms, so one string "
             "is serving two different scopes." % r['roads']) if r['roads'] > 0 else ""

    if hits:
        ambiguous = len(hits) > 1
        if ambiguous:
            inc = [h for h in hits if fips in (h.get('all_county_fips') or [])]
            if len(inc) == 1:
                hits = inc
        h = hits[0]
        allc = h.get('all_county_fips') or []
        prim = h.get('parent_county_fips')
        if fips == prim:
            conf = 'certain' if not stripped else 'likely'
            note = ("Exact roster match on name; primary county agrees." if not stripped
                    else "Roster match after stripping %s; primary county agrees." % (" + ".join(stripped)))
            kind = 'roster-exact'
        elif fips in allc:
            conf, kind = 'likely', 'straddle'
            note = ("STRADDLE, legitimate, not an error. %s has primary county %s (%s) but its "
                    "all_county_fips includes %s."
                    % (h['name'], prim, counties.get(prim, '?'), fips))
        else:
            conf = 'needs-human'
            kind, why = out_of_county_class(h, fips)
            note = ("OUT OF COUNTY. %s is roster place_fips %s, primary county %s (%s), "
                    "all_county_fips %s, which does not include %s. CLASS %s: %s"
                    % (h['name'], h['place_fips'], prim, counties.get(prim, '?'),
                       allc or '[]', fips, kind, why))
        if matched_via == 'full_name':
            note += (" Matched via the roster full_name `%s` (the CAD string carries the legal-status word)." % h['full_name'])
            if conf == 'certain':
                conf = 'likely'
        if ambiguous:
            note += " AMBIGUOUS NAME: %d roster places share this name." % len(roster_by_key.get(key, []))
            if conf == 'certain':
                conf = 'likely'
        if r['roads'] > 0 and conf != 'needs-human':
            conf = 'needs-human'
            note += mixed + (" DOWNGRADED to needs-human: a key that carries both county roads and "
                             "parcels cannot be aliased to a single place without splitting it first.")
            kind = 'mixed-scope-key'
        else:
            note += mixed
            if conf != 'needs-human':
                note += LIMITS
        rec.update(proposed_place_fips=(h['place_fips'] if conf != 'needs-human' else None),
                   proposed_place_name=h['name'], confidence=conf, note=note, kind=kind)
        out.append(rec)
        continue

    # 3. unresolved -> cluster to an in-county anchor
    ba, ratio = best_anchor(fips, key)
    if ba and ratio >= 0.82 and ba[0] != key:
        k, (src, b, h, pc) = ba
        if src == 'roster':
            hh = h[0]
            allc = hh.get('all_county_fips') or []
            prim = hh.get('parent_county_fips')
            if fips == prim or fips in allc:
                rec.update(proposed_place_fips=hh['place_fips'], proposed_place_name=hh['name'],
                           confidence='likely', kind='misspelling-of-roster-place',
                           note=("MISSPELLING. Nearest in-county spelling `%s` (%d parcels), "
                                 "similarity %.2f, which resolves to roster place %s (%s)."
                                 % (b, pc, ratio, hh['name'], hh['place_fips'])) + mixed + LIMITS)
            else:
                kind, why = out_of_county_class(hh, fips)
                rec.update(proposed_place_name=hh['name'], confidence='needs-human', kind=kind,
                           note=("MISSPELLING of `%s` (similarity %.2f) which resolves to %s, whose "
                                 "counties %s do not include %s. CLASS %s: %s"
                                 % (b, ratio, hh['name'], allc or '[]', fips, kind, why)) + mixed)
        else:
            rec.update(proposed_place_name=b.title(), confidence='needs-human',
                       kind='misspelling-of-unincorporated-place',
                       note=("MISSPELLING of the postal place `%s` (%d parcels, similarity %.2f). "
                             "That place is NOT in texas_roster_v1, which carries the 1,223 "
                             "INCORPORATED cities only, and is not in tx_city_boundary (1,222 rows) "
                             "either. No place_fips exists in this operation to map it to."
                             % (b, pc, ratio)) + county_hint(fips, key) + mixed)
        out.append(rec)
        continue

    # 4. unresolved, no anchor
    if key in postal.get(fips, {}):
        rec.update(proposed_place_name=base.title(), confidence='needs-human',
                   kind='unincorporated-place-no-place-fips',
                   note=("Reads as a place name but is NOT in texas_roster_v1 (1,223 incorporated "
                         "cities) and NOT in tx_city_boundary (1,222 rows). Consistent with an "
                         "unincorporated community / CDP / postal place. No incorporated place_fips "
                         "exists to map to; this needs a roster extension carrying CDP place FIPS, "
                         "or an explicit unincorporated disposition.") + county_hint(fips, key) + mixed)
    else:
        near = ("Nearest in-county anchor `%s` at similarity %.2f, below the 0.82 threshold."
                % (ba[1][1], ratio)) if ba else "No anchor exists in this county."
        rec.update(confidence='needs-human', kind='unresolved',
                   note=("UNRESOLVED. Not in the roster and not close enough to any in-county "
                         "spelling to normalise safely. " + near) + county_hint(fips, key) + mixed)
    out.append(rec)

out.sort(key=lambda r: (-r['parcel_count'], -r['atom_rows'], r['breadth_value']))
json.dump(out, open(SCR + "/alias_seed.json", "w", encoding='utf-8'), indent=1, ensure_ascii=False)

print("total rows:", len(out))
print("confidence:", dict(Counter(r['confidence'] for r in out)))
print("kind:", json.dumps(dict(Counter(r['kind'] for r in out)), indent=1))
tot = sum(r['parcel_count'] for r in out)
print("parcel_count sum (NOT distinct):", tot)
for c in ('certain', 'likely', 'needs-human'):
    s = sum(r['parcel_count'] for r in out if r['confidence'] == c)
    print("  %-12s rows=%3d parcel_rows=%9d (%.1f%%)" % (c, sum(1 for r in out if r['confidence'] == c), s, 100.0 * s / tot))
