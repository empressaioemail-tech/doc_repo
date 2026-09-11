"""What does `not_specified` mean in @empressaio/setback-corpus?

Meaning-shaped, two independently written parts of the same record compared against each
other: the FLAG, and the VALUE it sits on. Then a second derivation, the distribution of
that value across sibling districts in the same jurisdiction, which separates a placeholder
from a transcription without relying on a magic-number list.

  SENTINEL_UNIFORM  flag sits on a value identical across every flagged sibling -> the flag
                    is doing real work, warning the value is a placeholder. absent-verified
                    is a DEFENSIBLE cell here.
  REAL_VALUE_FLAGGED  flag sits on a varied, transcribed value -> the flag is wrong and any
                    absent-verified written from it is a FALSE ABSENCE.
  AMBIGUOUS_SINGLETON  only one flagged district in the group, so uniformity proves nothing.
  HONEST_ABSENCE    flag on a null. If the flag meant "ordinance is silent" this is where it
                    would live.

Self-tests run first and must discriminate every class before any corpus number prints.
"""
import json, sys, glob, os, collections

FIELDS = ("max_height_ft", "max_lot_coverage_pct")
KNOWN_PLACEHOLDERS = {0, 100, 999}   # corroborating signal only, never the sole basis

def flagged(d, f):
    return bool(d.get("provenance", {}).get(f, {}).get("not_specified", False))

def classify_group(values):
    """values: list of flagged values for one (jurisdiction, field). Returns per-value class."""
    present = [v for v in values if v is not None]
    out = []
    for v in values:
        if v is None:
            out.append("HONEST_ABSENCE"); continue
        uniform = len(set(present)) == 1
        if uniform and (len(present) >= 3 or v in KNOWN_PLACEHOLDERS):
            out.append("SENTINEL_UNIFORM")
        elif uniform:
            out.append("AMBIGUOUS_SINGLETON")
        elif v in KNOWN_PLACEHOLDERS:
            # Mixed group: real values AND a placeholder-shaped one. Forcing this to either
            # class would overstate. It needs the corpus owner, not an inference.
            out.append("SENTINEL_SUSPECT_IN_MIXED_GROUP")
        else:
            out.append("REAL_VALUE_FLAGGED")
    return out

def selftest():
    cases = [
        ([999]*10,           "SENTINEL_UNIFORM",    "uniform 999 across ten siblings"),
        ([100]*13,           "SENTINEL_UNIFORM",    "uniform 100 across thirteen siblings"),
        ([0]*8,              "SENTINEL_UNIFORM",    "uniform 0"),
        ([35,40,45,50,60],   "REAL_VALUE_FLAGGED",  "varied transcribed values"),
        ([None],             "HONEST_ABSENCE",      "flag on a null"),
        ([42],               "AMBIGUOUS_SINGLETON", "one non-placeholder district proves nothing"),
    ]
    mixed = classify_group([30, 40, 100, 100])
    assert mixed[:2] == ["REAL_VALUE_FLAGGED"]*2, f"mixed group: reals misread {mixed}"
    assert mixed[2:] == ["SENTINEL_SUSPECT_IN_MIXED_GROUP"]*2, f"mixed group: placeholder misread {mixed}"
    cases += [
    ]
    seen = set()
    for values, want, why in cases:
        got = classify_group(values)
        assert all(g == want for g in got), f"SELFTEST FAIL ({why}): wanted {want} got {got}"
        seen.add(want)
    assert len(seen) == 4, f"SELFTEST FAIL: vacuous, only produced {seen}"
    # negative direction: a varied group must NOT be called a sentinel
    assert "SENTINEL_UNIFORM" not in classify_group([35, 40]), "SELFTEST FAIL: varied read as sentinel"
    print(f"selftest: {len(cases)}/{len(cases)} pass, {len(seen)} classes discriminated, negative case held")

selftest()
src = sys.argv[1]
groups = collections.defaultdict(list)   # (jurisdiction, field) -> [(district, value)]
for path in sorted(glob.glob(os.path.join(src, "*.json"))):
    doc = json.load(open(path, encoding="utf-8"))
    key = doc.get("jurisdictionKey", os.path.basename(path))
    for d in doc.get("districts", []):
        for f in FIELDS:
            if flagged(d, f):
                groups[(key, f)].append((d.get("district_name"), d.get(f)))
assert groups, "no flagged slots found -- corpus empty or schema changed"

tally = collections.Counter()
defects = collections.defaultdict(int)
for (key, f), items in groups.items():
    for (name, v), cls in zip(items, classify_group([v for _, v in items])):
        tally[cls] += 1
        if cls in ("REAL_VALUE_FLAGGED", "AMBIGUOUS_SINGLETON", "SENTINEL_SUSPECT_IN_MIXED_GROUP"):
            defects[(key, f, cls)] += 1

total = sum(tally.values())
print(f"\nflagged slots examined: {total}  across {len(groups)} (jurisdiction, field) groups")
for k in ("SENTINEL_UNIFORM", "SENTINEL_SUSPECT_IN_MIXED_GROUP", "REAL_VALUE_FLAGGED",
          "AMBIGUOUS_SINGLETON", "HONEST_ABSENCE"):
    print(f"  {k:22} {tally.get(k, 0)}")   # zeros printed: an absent line must not stand in for a zero
print("\nFALSE-ABSENCE population (flag on a transcribed value), by jurisdiction and field:")
for (key, f, cls), n in sorted(defects.items(), key=lambda x: -x[1]):
    print(f"  {key:28} {f:22} {cls:20} {n}")
