"""File-based check for the hyphenated-roster-component class.

Falsifier 1 (component leak): for every seed row graded
unincorporated-place-no-place-fips or misspelling-of-unincorporated-place,
the free-text token must not be a hyphen-separated component of any
multi-token roster place holding territory in the filing county.

Falsifier 2 (four-row delta): compared to a baseline seed, exactly four
named rows change, and west / lacy_lakeview stay certain / roster-exact.

Two independently derived inputs: master_raw.tsv free text (via the seed's
breadth_value) and texas_roster_v1.json compound names. Neither source can
satisfy both halves alone.

Self-tests both directions, including a not-vacuous case, before any
live seed is scored.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from collections import Counter
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]
ROSTER_PATH = REPO / "_catalog" / "texas_roster_v1.json"
DEFAULT_SEED = REPO / "_catalog" / "2026-08-30_breadth_place_alias_seed.json"
START_SHA256 = "7f384d0dcbeb1eeb8c47b7e51732871fb5a07ae26e5360dd09fc42dacd685394"

LEAK_KINDS = {
    "unincorporated-place-no-place-fips",
    "misspelling-of-unincorporated-place",
}
EXPECTED_DELTA = {
    "breadth_48309_eddy": {
        "confidence": "likely",
        "kind": "roster-component",
        "proposed_place_fips": "10828",
    },
    "breadth_48309_bruceville": {
        "confidence": "likely",
        "kind": "roster-component",
        "proposed_place_fips": "10828",
    },
    "breadth_48309_brucevill": {
        "confidence": "likely",
        "kind": "misspelling-of-roster-place",
        "proposed_place_fips": "10828",
    },
    "breadth_48309_brucville": {
        "confidence": "likely",
        "kind": "misspelling-of-roster-place",
        "proposed_place_fips": "10828",
    },
}
UNCHANGED = {
    "breadth_48309_west": {
        "confidence": "certain",
        "kind": "roster-exact",
        "proposed_place_fips": "77332",
    },
    "breadth_48309_lacy_lakeview": {
        "confidence": "certain",
        "kind": "roster-exact",
        "proposed_place_fips": "40168",
    },
}
COMPARE_FIELDS = (
    "proposed_place_fips",
    "proposed_place_name",
    "confidence",
    "kind",
    "note",
)


def nk(s: str) -> str:
    s = re.sub(r"[^a-z0-9]+", " ", s.lower()).strip()
    return re.sub(r"\s+", "", s)


def normalise(free: str):
    s = re.sub(r"[,\.]+$", "", free).replace("_", " ").replace("-", " ")
    s = re.sub(r"\s+", " ", s).strip()
    for _ in range(2):
        m = re.search(r"\s(7\d{4})$", s)
        if m:
            s = s[: m.start()].strip()
        m = re.search(r"\s(tx|texas|tex)$", s)
        if m:
            s = s[: m.start()].strip()
    return s.strip()


def holds_territory(city: dict, fips: str) -> bool:
    if city.get("parent_county_fips") == fips:
        return True
    return fips in (city.get("all_county_fips") or [])


def hyphen_components(name: str) -> list[str]:
    if "-" not in name:
        return []
    return [p.strip() for p in name.split("-") if p.strip()]


def load_roster(path: Path) -> list[dict]:
    return json.loads(path.read_text(encoding="utf-8"))["cities"]


def component_hits_for_token(token_key: str, fips: str, cities: list[dict]) -> list[dict]:
    hits = []
    seen = set()
    for c in cities:
        for part in hyphen_components(c.get("name") or ""):
            if nk(part) != token_key:
                continue
            if not holds_territory(c, fips):
                continue
            pf = c["place_fips"]
            if pf in seen:
                continue
            seen.add(pf)
            hits.append({"place_fips": pf, "name": c["name"], "component": part})
    return hits


def parse_breadth(value: str):
    m = re.match(r"^breadth_(\d{5})_(.*)$", value)
    if not m:
        return None, None
    return m.group(1), m.group(2)


def leak_violations(seed: list[dict], cities: list[dict]) -> list[dict]:
    out = []
    for r in seed:
        if r.get("kind") not in LEAK_KINDS:
            continue
        fips, free = parse_breadth(r["breadth_value"])
        if not fips:
            continue
        key = nk(normalise(free))
        hits = component_hits_for_token(key, fips, cities)
        if hits:
            out.append(
                {
                    "breadth_value": r["breadth_value"],
                    "parcels": r.get("parcel_count"),
                    "kind": r.get("kind"),
                    "hits": hits,
                }
            )
    return out


def index_by_value(seed: list[dict]) -> dict:
    return {r["breadth_value"]: r for r in seed}


def changed_rows(before: list[dict], after: list[dict]) -> list[str]:
    b, a = index_by_value(before), index_by_value(after)
    keys = set(b) | set(a)
    changed = []
    for k in sorted(keys):
        if k not in b or k not in a:
            changed.append(k)
            continue
        if any(b[k].get(f) != a[k].get(f) for f in COMPARE_FIELDS):
            changed.append(k)
    return changed


def grade_ok(row: dict, expect: dict) -> bool:
    return (
        row.get("confidence") == expect["confidence"]
        and row.get("kind") == expect["kind"]
        and row.get("proposed_place_fips") == expect["proposed_place_fips"]
    )


def counts(seed: list[dict]) -> dict:
    c = Counter(r.get("confidence") for r in seed)
    return {
        "rows": len(seed),
        "certain": c.get("certain", 0),
        "likely": c.get("likely", 0),
        "needs-human": c.get("needs-human", 0),
    }


def _fixture_city(name, place_fips, parent, allc):
    return {
        "name": name,
        "place_fips": place_fips,
        "parent_county_fips": parent,
        "all_county_fips": allc,
    }


def _fixture_row(value, kind, **extra):
    rec = {
        "breadth_value": value,
        "kind": kind,
        "parcel_count": extra.get("parcel_count", 1),
        "proposed_place_fips": extra.get("proposed_place_fips"),
        "proposed_place_name": extra.get("proposed_place_name"),
        "confidence": extra.get("confidence"),
        "note": extra.get("note", ""),
    }
    return rec


def self_test() -> None:
    cities = [
        _fixture_city("Bruceville-Eddy", "10828", "48309", ["48145", "48309"]),
        _fixture_city("West", "77332", "48309", ["48309"]),
        _fixture_city("West Lake Hills", "77632", "48453", ["48453"]),
        _fixture_city("Lacy-Lakeview", "40168", "48309", ["48309"]),
        _fixture_city("Lakeview", "40888", "48191", ["48191"]),
        _fixture_city("Cedar Creek", "99999", None, []),
    ]

    leak_seed = [
        _fixture_row(
            "breadth_48309_eddy",
            "unincorporated-place-no-place-fips",
            parcel_count=1274,
        ),
        _fixture_row(
            "breadth_48309_bruceville",
            "unincorporated-place-no-place-fips",
            parcel_count=1012,
        ),
        _fixture_row(
            "breadth_48309_brucevill",
            "misspelling-of-unincorporated-place",
            parcel_count=1,
        ),
        _fixture_row(
            "breadth_48021_cedar_creek",
            "unincorporated-place-no-place-fips",
            parcel_count=100,
        ),
    ]
    v = leak_violations(leak_seed, cities)
    names = {x["breadth_value"] for x in v}
    assert names == {"breadth_48309_eddy", "breadth_48309_bruceville"}, names
    assert len(v) == 2, v

    clean_seed = [
        _fixture_row(
            "breadth_48309_eddy",
            "roster-component",
            confidence="likely",
            proposed_place_fips="10828",
            proposed_place_name="Bruceville-Eddy",
            parcel_count=1274,
        ),
        _fixture_row(
            "breadth_48309_bruceville",
            "roster-component",
            confidence="likely",
            proposed_place_fips="10828",
            proposed_place_name="Bruceville-Eddy",
            parcel_count=1012,
        ),
        _fixture_row(
            "breadth_48309_brucevill",
            "misspelling-of-roster-place",
            confidence="likely",
            proposed_place_fips="10828",
            parcel_count=1,
        ),
        _fixture_row(
            "breadth_48021_cedar_creek",
            "unincorporated-place-no-place-fips",
            parcel_count=100,
        ),
    ]
    assert leak_violations(clean_seed, cities) == []

    # not-vacuous: a token that is a component but in the wrong county is not a hit
    wrong_county = [
        _fixture_row("breadth_48453_eddy", "unincorporated-place-no-place-fips"),
    ]
    assert leak_violations(wrong_county, cities) == []

    # Lakeview in 48309 would be a name-index hit in the generator; as a leak
    # check it is a component of Lacy-Lakeview holding territory in 48309.
    lake = [_fixture_row("breadth_48309_lakeview", "unincorporated-place-no-place-fips")]
    lv = leak_violations(lake, cities)
    assert len(lv) == 1 and lv[0]["hits"][0]["place_fips"] == "40168", lv

    before = [
        _fixture_row(
            "breadth_48309_eddy",
            "unincorporated-place-no-place-fips",
            confidence="needs-human",
            note="old-eddy",
        ),
        _fixture_row(
            "breadth_48309_bruceville",
            "unincorporated-place-no-place-fips",
            confidence="needs-human",
            note="old-bruceville",
        ),
        _fixture_row(
            "breadth_48309_brucevill",
            "misspelling-of-unincorporated-place",
            confidence="needs-human",
            note="old-brucevill",
        ),
        _fixture_row(
            "breadth_48309_brucville",
            "misspelling-of-unincorporated-place",
            confidence="needs-human",
            note="old-brucville",
        ),
        _fixture_row(
            "breadth_48309_west",
            "roster-exact",
            confidence="certain",
            proposed_place_fips="77332",
            proposed_place_name="West",
            note="west-note",
        ),
        _fixture_row(
            "breadth_48309_lacy_lakeview",
            "roster-exact",
            confidence="certain",
            proposed_place_fips="40168",
            proposed_place_name="Lacy-Lakeview",
            note="lacy-note",
        ),
        _fixture_row(
            "breadth_48021_cedar_creek",
            "unincorporated-place-no-place-fips",
            confidence="needs-human",
            note="cdp-note",
        ),
    ]
    after_ok = [dict(r) for r in before]
    by = index_by_value(after_ok)
    by["breadth_48309_eddy"].update(
        EXPECTED_DELTA["breadth_48309_eddy"],
        proposed_place_name="Bruceville-Eddy",
        note="component eddy of Bruceville-Eddy",
    )
    by["breadth_48309_bruceville"].update(
        EXPECTED_DELTA["breadth_48309_bruceville"],
        proposed_place_name="Bruceville-Eddy",
        note="component bruceville of Bruceville-Eddy",
    )
    by["breadth_48309_brucevill"].update(
        EXPECTED_DELTA["breadth_48309_brucevill"],
        proposed_place_name="Bruceville-Eddy",
        note="misspelling of bruceville",
    )
    by["breadth_48309_brucville"].update(
        EXPECTED_DELTA["breadth_48309_brucville"],
        proposed_place_name="Bruceville-Eddy",
        note="misspelling of bruceville",
    )
    ch = changed_rows(before, after_ok)
    assert set(ch) == set(EXPECTED_DELTA), ch

    after_fifth = [dict(r) for r in after_ok]
    index_by_value(after_fifth)["breadth_48309_west"]["note"] = "flipped"
    ch5 = changed_rows(before, after_fifth)
    assert "breadth_48309_west" in ch5 and len(ch5) == 5, ch5

    print("SELFTEST ok (leak fail, leak pass, wrong-county miss, lakeview hit, four-row pass, fifth-row fail)")


def report_leak(seed: list[dict], cities: list[dict]) -> int:
    v = leak_violations(seed, cities)
    for row in v:
        hit = row["hits"][0]
        print(
            "VIOLATION %s parcels=%s kind=%s -> component of %s (%s)"
            % (
                row["breadth_value"],
                row["parcels"],
                row["kind"],
                hit["name"],
                hit["place_fips"],
            )
        )
    print("violations=%d" % len(v))
    return 0 if not v else 1


def report_delta(before: list[dict], after: list[dict]) -> int:
    ch = changed_rows(before, after)
    after_i = index_by_value(after)
    before_i = index_by_value(before)
    ok = True
    if len(after) != 225:
        print("FAIL row_count=%d expected=225" % len(after))
        ok = False
    ac = counts(after)
    if ac["certain"] != 33:
        print("FAIL certain=%d expected=33" % ac["certain"])
        ok = False
    if ac["needs-human"] != 95:
        print("FAIL needs-human=%d expected=95" % ac["needs-human"])
        ok = False
    if set(ch) != set(EXPECTED_DELTA):
        print("FAIL changed=%s expected=%s" % (ch, list(EXPECTED_DELTA)))
        ok = False
    for key, expect in EXPECTED_DELTA.items():
        row = after_i.get(key)
        if not row or not grade_ok(row, expect):
            print("FAIL %s after=%s expected=%s" % (key, row, expect))
            ok = False
        else:
            print(
                "OK %s %s / %s / %s"
                % (key, row["confidence"], row["kind"], row["proposed_place_fips"])
            )
    for key, expect in UNCHANGED.items():
        row = after_i.get(key)
        prev = before_i.get(key)
        if not row or not grade_ok(row, expect):
            print("FAIL unchanged-grade %s after=%s" % (key, row))
            ok = False
        elif prev and any(prev.get(f) != row.get(f) for f in COMPARE_FIELDS):
            print("FAIL %s moved" % key)
            ok = False
        else:
            print(
                "OK unchanged %s %s / %s / %s"
                % (key, row["confidence"], row["kind"], row["proposed_place_fips"])
            )
    print(
        "delta_rows=%d certain=%d likely=%d needs-human=%d"
        % (len(ch), ac["certain"], ac["likely"], ac["needs-human"])
    )
    return 0 if ok else 1


def main(argv: list[str]) -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--seed", type=Path, default=None)
    p.add_argument("--baseline", type=Path, default=None)
    p.add_argument("--current", type=Path, default=None)
    p.add_argument("--skip-self-test", action="store_true")
    args = p.parse_args(argv)

    if not args.skip_self_test:
        self_test()

    rc = 0
    cities = load_roster(ROSTER_PATH)
    if args.seed:
        raw = args.seed.read_bytes()
        seed = json.loads(raw.decode("utf-8"))
        print("seed_sha256", hashlib.sha256(raw).hexdigest())
        print("seed_path", args.seed)
        rc |= report_leak(seed, cities)
    if args.baseline and args.current:
        before = json.loads(args.baseline.read_text(encoding="utf-8"))
        after = json.loads(args.current.read_text(encoding="utf-8"))
        print("baseline", args.baseline)
        print("current", args.current)
        rc |= report_delta(before, after)
    if args.seed is None and args.baseline is None:
        seed_path = DEFAULT_SEED
        raw = seed_path.read_bytes()
        seed = json.loads(raw.decode("utf-8"))
        print("seed_sha256", hashlib.sha256(raw).hexdigest())
        print("seed_path", seed_path)
        print("start_sha256_expected", START_SHA256)
        rc |= report_leak(seed, cities)
    return rc


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
