#!/usr/bin/env python3
"""T6 Texas roster builder — seeds StratMap, runs four-point CAD probes, checkpoints roster."""
from __future__ import annotations

import csv
import json
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

REPO = Path(r"P:\doc_repo")
STRATMAP = REPO / "_land_records" / "txgio_stratmap_county_matrix_2026-08-02.json"
ROSTER_JSON = REPO / "_catalog" / "texas_roster_v1.json"
ROSTER_CSV = REPO / "_catalog" / "texas_roster_v1.csv"
PROBE_DIR = REPO / "_inbox"
CENSUS_PLACES = "https://www2.census.gov/geo/docs/reference/codes2020/national_place2020.txt"

RATE_LIMIT_S = 0.5  # ~2 req/s
UA = "Hauska-T6-Roster-Recon/1.0 (doc_repo; public-record only)"

# Known verified CAD URLs from prior recon (2026-08-04/05) — adversarial re-probe required before "verified"
KNOWN_CAD: dict[str, dict[str, Any]] = {
    "48021": {"url": "https://services.arcgis.com/aS4XD9PgZha28y8P/arcgis/rest/services/BastropCADWebService/FeatureServer", "layer": 0, "prop_id_field": "prop_id", "vendor": "bis-consultants", "source": "2026-08-05_T3_footprint_source_recon"},
    "48055": {"url": "https://services.arcgis.com/rVxY74DxxIDrDbc0/arcgis/rest/services/Caldwell_County_Parcel_Map/FeatureServer", "layer": 1, "prop_id_field": "Prop_ID", "vendor": "county-run-agol", "source": "engine_registry"},
    "48027": {"url": "https://services7.arcgis.com/EHW2HuuyZNO7DZct/arcgis/rest/services/BellCADWebService/FeatureServer", "layer": 0, "prop_id_field": "prop_id", "vendor": "bis-consultants", "source": "2026-08-04_county_fan_cadastral_recon"},
    "48029": {"url": "https://maps.bexar.org/arcgis/rest/services/Parcels/MapServer", "layer": 0, "prop_id_field": "PropID", "vendor": "county-run", "source": "2026-08-04_county_fan_cadastral_recon"},
    "48091": {"url": "https://services6.arcgis.com/eNPJk90aMrXNOKF8/arcgis/rest/services/Comal_County_Parcels/FeatureServer", "layer": 40, "prop_id_field": "PROP_ID", "vendor": "harris-govern-tnris-repack", "source": "2026-08-04_county_fan_cadastral_recon", "caveat": "stale_2021_layer"},
    "48187": {"url": "https://services9.arcgis.com/1l4hbpt78hjlsIcl/arcgis/rest/services/GuadalupeCADWebService/FeatureServer", "layer": 0, "prop_id_field": "prop_id", "vendor": "bis-consultants", "source": "2026-08-04_county_fan_cadastral_recon"},
    "48309": {"url": "https://services8.arcgis.com/5e4b1SY8bogTc3pH/arcgis/rest/services/McLennanCADWebService/FeatureServer", "layer": 0, "prop_id_field": "prop_id", "vendor": "bis-consultants", "source": "2026-08-04_county_fan_cadastral_recon"},
    "48453": {"url": "https://gis.traviscountytx.gov/server1/rest/services/Boundaries_and_Jurisdictions/TCAD/MapServer", "layer": 0, "prop_id_field": "PROP_ID", "vendor": "county-run-tnr", "source": "2026-08-04_county_fan_cadastral_recon", "caveat": "count_divergence_vs_stratmap"},
    "48491": {"url": "https://gis.wilco.org/arcgis/rest/services/public/county_wcad_parcels/MapServer", "layer": 0, "prop_id_field": "PropertyID", "vendor": "county-run", "source": "2026-08-04_county_fan_cadastral_recon"},
    "48439": {"url": "https://mapit.tarrantcounty.com/arcgis/rest/services/TADParcels/FeatureServer", "layer": 0, "prop_id_field": "prop_id", "vendor": "county-run", "source": "2026-08-05_T3_footprint_source_recon"},
    "48113": {"url": None, "layer": None, "prop_id_field": None, "vendor": "dcad-bulk-only", "source": "2026-08-04_dfw_phase0_recon", "bulk_url": "DCAD certified zip via ViewPDFs proxy"},
    "48209": {"url": None, "vendor": "not-found", "source": "2026-08-04_county_fan_cadastral_recon", "probe_note": "No public ArcGIS REST; StratMap-only fallback"},
    "48397": {"url": None, "vendor": "rockwall-no-rest", "source": "2026-08-04_dfw_phase0_recon", "probe_note": "Portal-only SPA; no public REST"},
}

# Cost model constants (engine #250 recalibrated)
COST_PER_PARCEL_USD = 0.000002  # atom-write heuristic component
COST_NEON_CU_HR = 0.16
COST_CU_PER_PARCEL = 0.25


def fetch_json(url: str, timeout: int = 30) -> dict[str, Any]:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8", errors="replace"))


def get(url: str) -> tuple[int | None, dict[str, Any] | str | None]:
    time.sleep(RATE_LIMIT_S)
    try:
        return 200, fetch_json(url)
    except urllib.error.HTTPError as e:
        try:
            body = e.read().decode("utf-8", errors="replace")[:500]
        except Exception:
            body = str(e)
        return e.code, body
    except Exception as e:
        return None, str(e)


def service_root_url(base: str) -> str:
    base = base.rstrip("/")
    if base.endswith("/FeatureServer") or base.endswith("/MapServer"):
        return base
    return base


def four_point_probe(fips: str, base_url: str, layer_id: int, sample_prop_id: int | str | None = None) -> dict[str, Any]:
    """Run four-point probe; return probe artifact."""
    artifact: dict[str, Any] = {
        "fips": fips,
        "probed_at": datetime.now(timezone.utc).isoformat(),
        "service_url": base_url,
        "layer_id": layer_id,
        "probe_steps": {},
    }
    root = service_root_url(base_url)
    # 1. Layer list
    code, data = get(f"{root}?f=json")
    artifact["probe_steps"]["layer_list"] = {"http": code, "ok": code == 200 and isinstance(data, dict)}
    if not isinstance(data, dict):
        artifact["status"] = "probe_failed"
        artifact["error"] = str(data)
        return artifact

    layers = data.get("layers") or data.get("subLayers") or []
    if not layers and "fields" in data:
        layers = [{"id": layer_id, "name": data.get("name", "layer")}]
    artifact["layers"] = [{"id": l.get("id"), "name": l.get("name")} for l in layers[:20]]
    artifact["service_name"] = data.get("serviceDescription") or data.get("name")
    artifact["owner"] = (data.get("documentInfo") or {}).get("Author") or data.get("copyrightText")

    # Determine layer URL form
    if "/FeatureServer" in root:
        layer_base = f"{root}/{layer_id}"
    else:
        layer_base = f"{root}/{layer_id}"

    # 2. Fields
    code2, ldata = get(f"{layer_base}?f=json")
    artifact["probe_steps"]["fields"] = {"http": code2, "ok": code2 == 200 and isinstance(ldata, dict)}
    if not isinstance(ldata, dict):
        artifact["status"] = "probe_failed_fields"
        return artifact

    fields = ldata.get("fields", [])
    artifact["fields"] = [{"name": f["name"], "type": f.get("type")} for f in fields]
    prop_candidates = [f["name"] for f in fields if re.search(r"prop|parcel|acct|property", f["name"], re.I)]
    artifact["prop_id_candidates"] = prop_candidates

    # 3. Sample polygon query
    where = "1=1"
    if sample_prop_id is not None:
        for cand in prop_candidates[:5]:
            where = f"{cand}={sample_prop_id}"
            qurl = f"{layer_base}/query?{urllib.parse.urlencode({'where': where, 'outFields': '*', 'returnGeometry': 'true', 'resultRecordCount': 1, 'f': 'json'})}"
            code3, qdata = get(qurl)
            if code3 == 200 and isinstance(qdata, dict) and qdata.get("features"):
                artifact["probe_steps"]["sample_query"] = {"http": code3, "ok": True, "where": where, "field": cand}
                feat = qdata["features"][0]
                geom = feat.get("geometry", {})
                artifact["sample_geometry_type"] = geom.get("rings") and "esriGeometryPolygon" or geom.get("type")
                artifact["sample_attrs"] = {k: feat["attributes"].get(k) for k in prop_candidates[:3]}
                break
        else:
            # fallback: any polygon
            qurl = f"{layer_base}/query?{urllib.parse.urlencode({'where': '1=1', 'outFields': '*', 'returnGeometry': 'true', 'resultRecordCount': 1, 'f': 'json'})}"
            code3, qdata = get(qurl)
            ok = code3 == 200 and isinstance(qdata, dict) and bool(qdata.get("features"))
            artifact["probe_steps"]["sample_query"] = {"http": code3, "ok": ok, "where": "1=1 fallback"}
            if ok:
                feat = qdata["features"][0]
                artifact["sample_attrs"] = feat.get("attributes", {})
                geom = feat.get("geometry", {})
                artifact["sample_geometry_type"] = "esriGeometryPolygon" if geom.get("rings") else "unknown"
    else:
        qurl = f"{layer_base}/query?{urllib.parse.urlencode({'where': '1=1', 'outFields': '*', 'returnGeometry': 'true', 'resultRecordCount': 1, 'f': 'json'})}"
        code3, qdata = get(qurl)
        ok = code3 == 200 and isinstance(qdata, dict) and bool(qdata.get("features"))
        artifact["probe_steps"]["sample_query"] = {"http": code3, "ok": ok}

    # 4. Count
    qurl = f"{layer_base}/query?{urllib.parse.urlencode({'where': '1=1', 'returnCountOnly': 'true', 'f': 'json'})}"
    code4, cdata = get(qurl)
    count = cdata.get("count") if isinstance(cdata, dict) else None
    artifact["probe_steps"]["count"] = {"http": code4, "count": count}
    artifact["live_feature_count"] = count

    all_ok = all(
        artifact["probe_steps"].get(k, {}).get("ok", artifact["probe_steps"].get(k, {}).get("count") is not None)
        for k in ["layer_list", "fields"]
    ) and artifact["probe_steps"].get("sample_query", {}).get("ok") and count is not None
    artifact["status"] = "verified" if all_ok else "partial"
    return artifact


def estimate_cost(parcel_count: int) -> dict[str, Any]:
    atom_writes = parcel_count * 3  # zoning + envelope + misc heuristic
    neon_cost = (parcel_count * COST_CU_PER_PARCEL / 3600) * COST_NEON_CU_HR
    write_cost = atom_writes * COST_PER_PARCEL_USD
    total = neon_cost + write_cost
    return {
        "parcel_count": parcel_count,
        "estimated_usd": round(total, 2),
        "method": "engine_250_heuristic",
        "flagged_over_200": total >= 200,
    }


def risk_classes(county: dict[str, Any]) -> list[str]:
    risks = []
    rate = county.get("prop_id_bad_rate") or 0
    if rate >= 0.25:
        risks.append("crosswalk-required")
    if not county.get("cadastral", {}).get("service_url"):
        risks.append("no-rest")
    if county.get("cadastral", {}).get("caveat") == "stale_2021_layer":
        risks.append("stratmap-vintage-drift")
    if county.get("cadastral", {}).get("vendor") == "bis-consultants":
        risks.append("bis-field-template")
    if not county.get("geometry", {}).get("in_stratmap"):
        risks.append("no-stratmap")
    if county.get("fips") == "48201":  # Harris
        risks.append("harris-sharding-required")
    return risks


def build_county_row(sm: dict[str, Any], probe: dict[str, Any] | None, known: dict[str, Any] | None) -> dict[str, Any]:
    fips = sm["fips"]
    row: dict[str, Any] = {
        "record_type": "county",
        "fips": fips,
        "name": sm["county_name"],
        "identity": {
            "fips": fips,
            "population": {"status": "unverified", "value": None, "note": "Census 2020 ACS — not probed this session"},
            "parcel_count_est": sm.get("feature_count"),
        },
        "geometry": {
            "rail": "C",
            "source": "txgio_stratmap_bulk",
            "in_stratmap": sm.get("in_stratmap", True),
            "download_url": sm.get("download_url"),
            "vintage_yyyymm": sm.get("vintage_yyyymm"),
            "vintage_date": sm.get("vintage_date"),
            "feature_count": sm.get("feature_count"),
            "flags": sm.get("flags", []),
            "verification": "verified",
            "evidence": "_land_records/txgio_stratmap_county_matrix_2026-08-02.json",
        },
        "cadastral": {},
        "join_quality": {
            "prop_id_bad_rate": sm.get("prop_id_bad_rate"),
            "prop_id_bad_count": sm.get("prop_id_bad_count"),
            "join_key": "geo_id_or_address_crosswalk" if (sm.get("prop_id_bad_rate") or 0) >= 0.25 else "prop_id",
            "crosswalk_risk": (sm.get("prop_id_bad_rate") or 0) >= 0.25,
            "owner_match_gate_required": True,
            "verification": "verified",
            "evidence": "_land_records/txgio_stratmap_county_matrix_2026-08-02.json",
        },
        "zoning_regime": {
            "unincorporated": "unzoned",
            "doctrine": "PASS — county unincorporated = honest absence",
            "verification": "verified",
        },
        "code_text": {"unincorporated": "none", "note": "County unincorporated has no municipal code"},
        "rails": {
            "footprint_tier": "ml-derived",
            "footprint_note": "0/11 onboarded counties have CAD footprint REST; default ML per T3 recon 2026-08-05",
            "easement_tier": "absent",
            "easement_note": "County-level honest-absence default; McLennan exception at 48309",
            "verification": "verified" if fips != "48309" else "partial",
        },
        "risk_class": [],
        "cost_estimate": estimate_cost(sm.get("feature_count") or 0),
    }
    if fips == "48309":
        row["rails"]["easement_tier"] = "cad-easement-rest"
        row["rails"]["easement_url"] = "https://services8.arcgis.com/5e4b1SY8bogTc3pH/arcgis/rest/services/McLennanCADWebService/FeatureServer/9"

    if known and known.get("url"):
        p = probe or {}
        row["cadastral"] = {
            "service_url": known["url"],
            "layer_id": known.get("layer", 0),
            "prop_id_field": known.get("prop_id_field") or (p.get("prop_id_candidates") or [None])[0],
            "prop_id_field_type": next((f["type"] for f in p.get("fields", []) if f["name"] == known.get("prop_id_field")), None),
            "vendor_pattern": known.get("vendor"),
            "live_feature_count": p.get("live_feature_count"),
            "max_record_count": 2000,
            "verification": "verified" if p.get("status") == "verified" else "unverified",
            "evidence": f"_inbox/t6_cad_probe_{fips}.json",
            "prior_source": known.get("source"),
            "caveat": known.get("caveat"),
        }
    elif known and not known.get("url"):
        row["cadastral"] = {
            "service_url": None,
            "verification": "honestly_absent",
            "vendor_pattern": known.get("vendor"),
            "probe_note": known.get("probe_note") or known.get("bulk_url"),
            "evidence": known.get("source"),
            "stratmap_fallback": sm.get("in_stratmap"),
        }
    else:
        row["cadastral"] = {
            "service_url": None,
            "verification": "unverified",
            "probe_note": "CAD four-point probe pending — batch executor",
            "evidence": None,
        }

    row["risk_class"] = risk_classes(row)
    return row


def load_census_incorporated() -> list[dict[str, Any]]:
    req = urllib.request.Request(CENSUS_PLACES, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=120) as resp:
        text = resp.read().decode("latin-1")
    cities = []
    for line in text.splitlines():
        if not line.startswith("TX|"):
            continue
        parts = line.split("|")
        if len(parts) < 8:
            continue
        if parts[5] != "INCORPORATED PLACE":
            continue
        place_fips = parts[2]
        geoid = parts[3]
        name = parts[4]
        county_name = parts[7] if len(parts) > 7 else ""
        cities.append({
            "record_type": "city",
            "place_fips": place_fips,
            "geoid": geoid,
            "name": name.replace(" city", "").replace(" town", "").strip(),
            "full_name": name,
            "parent_county_name": county_name.replace(" County", "").strip(),
            "parent_county_fips": None,  # filled later if mappable
        })
    return cities


def classify_city_defaults(city: dict[str, Any]) -> dict[str, Any]:
    name = city["name"].upper()
    row = {
        **city,
        "zoning_regime": {
            "classification": "unknown-needs-probe",
            "verification": "unverified",
        },
        "code_text": {
            "publisher": "unknown-needs-probe",
            "verification": "unverified",
        },
        "zoning_layer": {"source_url": None, "verification": "unverified"},
        "parcel_record_layer": {"source_url": None, "verification": "unverified"},
        "rails": {
            "footprint_tier": "ml-derived",
            "easement_tier": "absent",
            "verification": "unverified",
        },
        "risk_class": ["city-lane-adapter-needed"],
    }
    if name == "HOUSTON":
        row["zoning_regime"] = {"classification": "unzoned", "verification": "verified", "evidence": "doctrine — Houston has no zoning ordinance"}
        row["code_text"] = {"publisher": "none-zoning", "verification": "verified", "note": "Development codes exist but no Euclidean zoning districts"}
    elif name in ("AUSTIN", "SAN ANTONIO", "DALLAS", "FORT WORTH", "EL PASO", "ARLINGTON", "PLANO", "LAREDO"):
        row["zoning_regime"]["classification"] = "euclidean-zoned"
        row["zoning_regime"]["verification"] = "partial"
        row["zoning_regime"]["note"] = "Major metro — euclidean assumed; layer probe pending"
    return row


def main(probe_known: bool = True, checkpoint: bool = True) -> None:
    stratmap = json.loads(STRATMAP.read_text(encoding="utf-8"))
    counties_raw = stratmap["counties"]

    probes: dict[str, dict] = {}
    if probe_known:
        for fips, known in KNOWN_CAD.items():
            if known.get("url"):
                print(f"Probing {fips} {known['url']}...")
                sample = {"48021": 34785, "48055": 1000, "48027": 496496, "48029": 344800,
                          "48091": "60213", "48187": 53150, "48309": 420532, "48453": 177373,
                          "48491": "67611", "48439": 1000}.get(fips)
                probes[fips] = four_point_probe(fips, known["url"], known.get("layer", 0), sample)
                probe_path = PROBE_DIR / f"t6_cad_probe_{fips}.json"
                probe_path.write_text(json.dumps(probes[fips], indent=2), encoding="utf-8")
                print(f"  -> {probes[fips].get('status')} count={probes[fips].get('live_feature_count')}")

    county_rows = []
    for sm in counties_raw:
        fips = sm["fips"]
        known = KNOWN_CAD.get(fips)
        probe = probes.get(fips)
        county_rows.append(build_county_row(sm, probe, known))

    cities = [classify_city_defaults(c) for c in load_census_incorporated()]

    roster = {
        "schema_version": "t6_roster_v1",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "method": "T6 Texas roster recon — StratMap verified + CAD four-point probes",
        "coverage": {
            "counties_total": 254,
            "counties_in_roster": len(county_rows),
            "cities_incorporated_total": len(cities),
            "cities_in_roster": len(cities),
        },
        "counties": county_rows,
        "cities": cities,
    }

    if checkpoint:
        ROSTER_JSON.parent.mkdir(parents=True, exist_ok=True)
        ROSTER_JSON.write_text(json.dumps(roster, indent=2), encoding="utf-8")
        print(f"Wrote {ROSTER_JSON}")

        # CSV mirror (counties only for brevity in v1)
        with ROSTER_CSV.open("w", newline="", encoding="utf-8") as f:
            w = csv.writer(f)
            w.writerow(["record_type", "fips", "name", "parcel_count", "stratmap_vintage", "prop_id_bad_rate",
                        "join_key", "cad_url", "cad_verification", "vendor", "risk_classes", "cost_est_usd"])
            for c in county_rows:
                cad = c.get("cadastral", {})
                w.writerow([
                    "county", c["fips"], c["name"],
                    c["identity"]["parcel_count_est"],
                    c["geometry"].get("vintage_yyyymm"),
                    c["join_quality"].get("prop_id_bad_rate"),
                    c["join_quality"].get("join_key"),
                    cad.get("service_url") or "",
                    cad.get("verification"),
                    cad.get("vendor_pattern") or "",
                    ";".join(c.get("risk_class", [])),
                    c["cost_estimate"].get("estimated_usd"),
                ])
        print(f"Wrote {ROSTER_CSV}")

    verified_cad = sum(1 for c in county_rows if c["cadastral"].get("verification") == "verified")
    absent_cad = sum(1 for c in county_rows if c["cadastral"].get("verification") == "honestly_absent")
    pending = sum(1 for c in county_rows if c["cadastral"].get("verification") == "unverified")
    print(f"Counties: verified_cad={verified_cad} absent={absent_cad} pending={pending} total={len(county_rows)}")
    print(f"Cities: {len(cities)}")


if __name__ == "__main__":
    main()
