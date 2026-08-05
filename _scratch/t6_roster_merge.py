#!/usr/bin/env python3
"""Merge T6 probe artifacts into texas_roster_v1.json and regenerate CSV."""
from __future__ import annotations
import csv, json, re
from datetime import datetime, timezone
from pathlib import Path

REPO = Path(r"P:\doc_repo")
ROSTER = REPO / "_catalog" / "texas_roster_v1.json"
CSV_OUT = REPO / "_catalog" / "texas_roster_v1.csv"
INBOX = REPO / "_inbox"
CITY_RECON = INBOX / "t6_city_code_recon_top50.json"
ADVERSARIAL = INBOX / "t6_adversarial_review_summary.json"

HONESTLY_ABSENT = {
    "48209": {"vendor": "not-found", "probe_note": "No public ArcGIS REST; adversarial REPRODUCED 2026-08-05"},
    "48397": {"vendor": "rockwall-no-rest", "probe_note": "Portal-only SPA; adversarial REPRODUCED 2026-08-05"},
    "48113": {"vendor": "dcad-bulk-only", "probe_note": "Bulk zip only; no stable REST"},
}


def load_probes() -> dict[str, dict]:
    probes = {}
    for p in INBOX.glob("t6_cad_probe_*.json"):
        fips = p.stem.replace("t6_cad_probe_", "")
        probes[fips] = json.loads(p.read_text(encoding="utf-8"))
    return probes


def adversarial_verdicts() -> dict[str, str]:
    if not ADVERSARIAL.exists():
        return {}
    d = json.loads(ADVERSARIAL.read_text(encoding="utf-8"))
    return {fips: v["verdict"] for fips, v in d.get("counties", {}).items()}


def merge_cadastral(county: dict, probe: dict | None, adv: dict[str, str]) -> None:
    fips = county["fips"]
    if probe and probe.get("service_url"):
        status = probe.get("status", "partial")
        if status in ("verified",):
            verification = "verified"
        elif status in ("partial",):
            verification = "partial"
        else:
            verification = "partial"
        if fips in adv and adv[fips] == "REPRODUCED" and verification == "verified":
            verification = "verified"
        elif fips in adv and adv[fips] == "DOWNGRADED":
            verification = "unverified"
        prop_field = None
        for cand in probe.get("prop_id_candidates", []):
            if cand.lower() in ("prop_id", "propid", "propertyid", "prop_id_text"):
                prop_field = cand
                break
        if not prop_field and probe.get("prop_id_candidates"):
            prop_field = probe["prop_id_candidates"][0]
        county["cadastral"] = {
            "service_url": probe["service_url"],
            "layer_id": probe.get("layer_id", 0),
            "prop_id_field": prop_field,
            "vendor_pattern": probe.get("vendor") or ("bis-consultants" if "CADWebService" in (probe.get("service_url") or "") else "unknown"),
            "live_feature_count": probe.get("live_feature_count"),
            "verification": verification,
            "evidence": f"_inbox/t6_cad_probe_{fips}.json",
            "adversarial_verdict": adv.get(fips),
            "discovery_source": probe.get("discovery_source"),
        }
        if probe.get("stratmap_feature_count") and probe.get("live_feature_count"):
            ratio = probe["live_feature_count"] / probe["stratmap_feature_count"]
            if ratio < 0.85 or ratio > 1.15:
                county["cadastral"]["count_divergence"] = round(ratio, 3)
    elif probe and probe.get("status") in ("honestly_absent", "honestly_absent_rest", "not_found", "probe_failed"):
        county["cadastral"] = {
            "service_url": probe.get("service_url"),
            "verification": "honestly_absent",
            "vendor_pattern": probe.get("vendor") or "none",
            "probe_note": probe.get("probe_note") or probe.get("note") or probe.get("error") or f"status={probe.get('status')}",
            "evidence": f"_inbox/t6_cad_probe_{fips}.json",
            "adversarial_verdict": adv.get(fips),
            "stratmap_fallback": county["geometry"].get("in_stratmap"),
            "discovery_log": probe.get("discovery_log"),
        }
    elif fips in HONESTLY_ABSENT:
        ha = HONESTLY_ABSENT[fips]
        county["cadastral"] = {
            "service_url": None,
            "verification": "honestly_absent",
            "vendor_pattern": ha["vendor"],
            "probe_note": ha["probe_note"],
            "evidence": f"_inbox/t6_adversarial_review_{fips}.json" if (INBOX / f"t6_adversarial_review_{fips}.json").exists() else f"_inbox/t6_cad_probe_{fips}.json" if (INBOX / f"t6_cad_probe_{fips}.json").exists() else None,
            "adversarial_verdict": adv.get(fips),
            "stratmap_fallback": county["geometry"].get("in_stratmap"),
        }
    elif probe:
        county["cadastral"] = {
            "service_url": probe.get("service_url"),
            "verification": "unverified",
            "probe_note": f"Unclassified probe status: {probe.get('status')}",
            "evidence": f"_inbox/t6_cad_probe_{fips}.json",
        }


def merge_cities(cities: list, city_recon: dict) -> list:
    if not city_recon:
        return cities
    recon_by_name = {c["city"].upper(): c for c in city_recon.get("cities", [])}
    for city in cities:
        key = city["name"].upper()
        if key not in recon_by_name:
            continue
        r = recon_by_name[key]
        city["zoning_regime"] = {
            "classification": r.get("zoning_regime"),
            "verification": "verified" if r.get("zoning_regime") in ("unzoned", "euclidean-zoned") else "partial",
            "evidence": r.get("evidence"),
        }
        ct = r.get("code_text", {})
        city["code_text"] = {
            "publisher": ct.get("publisher"),
            "url": ct.get("url"),
            "verification": "verified" if ct.get("publisher") not in (None, "unknown-needs-probe") else "partial",
            "ecode360_posture": ct.get("ecode360_posture"),
        }
        zl = r.get("zoning_layer", {})
        city["zoning_layer"] = {
            "source_url": zl.get("candidate_url"),
            "verification": zl.get("verification", "unverified"),
        }
        pr = r.get("parcel_record_layer", {})
        city["parcel_record_layer"] = {
            "source_url": pr.get("candidate_url"),
            "verification": pr.get("verification", "unverified"),
        }
    return cities


def risk_classes(county: dict) -> list[str]:
    risks = []
    jq = county.get("join_quality", {})
    if (jq.get("prop_id_bad_rate") or 0) >= 0.25:
        risks.append("crosswalk-required")
    cad = county.get("cadastral", {})
    if cad.get("verification") == "honestly_absent":
        risks.append("no-rest")
    if cad.get("vendor_pattern") == "bis-consultants" or "CADWebService" in (cad.get("service_url") or ""):
        risks.append("bis-field-template")
    if not county.get("geometry", {}).get("in_stratmap"):
        risks.append("no-stratmap")
    if county["fips"] == "48201":
        risks.append("harris-sharding-required")
    if cad.get("count_divergence"):
        risks.append("stratmap-vintage-drift")
    return risks


def main():
    roster = json.loads(ROSTER.read_text(encoding="utf-8"))
    probes = load_probes()
    adv = adversarial_verdicts()

    for county in roster["counties"]:
        fips = county["fips"]
        probe = probes.get(fips)
        merge_cadastral(county, probe, adv)
        county["risk_class"] = risk_classes(county)

    if CITY_RECON.exists():
        city_recon = json.loads(CITY_RECON.read_text(encoding="utf-8"))
        roster["cities"] = merge_cities(roster["cities"], city_recon)
        roster["city_recon_coverage"] = {
            "top50_probed": city_recon.get("city_count"),
            "publisher_counts": city_recon.get("publisher_pattern_counts"),
        }

    verified = sum(1 for c in roster["counties"] if c["cadastral"].get("verification") == "verified")
    partial = sum(1 for c in roster["counties"] if c["cadastral"].get("verification") == "partial")
    absent = sum(1 for c in roster["counties"] if c["cadastral"].get("verification") == "honestly_absent")
    pending = sum(1 for c in roster["counties"] if c["cadastral"].get("verification") == "unverified")

    roster["generated_at"] = datetime.now(timezone.utc).isoformat()
    roster["coverage"]["cad_verified"] = verified
    roster["coverage"]["cad_partial"] = partial
    roster["coverage"]["cad_honestly_absent"] = absent
    roster["coverage"]["cad_pending"] = pending
    roster["coverage"]["adversarial_reproduced"] = sum(1 for v in adv.values() if v == "REPRODUCED")

    ROSTER.write_text(json.dumps(roster, indent=2), encoding="utf-8")

    with CSV_OUT.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["record_type", "fips", "name", "parcel_count", "stratmap_vintage", "prop_id_bad_rate",
                    "join_key", "cad_url", "cad_verification", "vendor", "adversarial", "risk_classes", "cost_est_usd"])
        for c in roster["counties"]:
            cad = c.get("cadastral", {})
            w.writerow(["county", c["fips"], c["name"], c["identity"]["parcel_count_est"],
                        c["geometry"].get("vintage_yyyymm"), c["join_quality"].get("prop_id_bad_rate"),
                        c["join_quality"].get("join_key"), cad.get("service_url") or "",
                        cad.get("verification"), cad.get("vendor_pattern") or "",
                        cad.get("adversarial_verdict") or "", ";".join(c.get("risk_class", [])),
                        c["cost_estimate"].get("estimated_usd")])

    print(f"Merged {len(probes)} probes -> verified={verified} partial={partial} absent={absent} pending={pending}")
    print(f"Wrote {ROSTER} and {CSV_OUT}")


if __name__ == "__main__":
    main()
