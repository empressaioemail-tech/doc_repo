#!/usr/bin/env node
/**
 * STEP0 — Pull per-parcel ground truth for Bastrop downtown drill test area.
 * WDLL: 2026-07-30_BASTROP_DOWNTOWN_DRILL_WDLL item 0
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const MANIFEST = join(REPO_ROOT, '_catalog/bastrop_downtown_drill_test_area.json');
const OUT = join(REPO_ROOT, '_scratch/bastrop-downtown-drill-ground-truth.json');

const LAYER23 =
  'https://services7.arcgis.com/qOeXJdBtGknaCJC4/arcgis/rest/services/Parcels_One_Click/FeatureServer/23/query';
const LAYER83 =
  'https://services7.arcgis.com/qOeXJdBtGknaCJC4/arcgis/rest/services/Zoned_Parcels/FeatureServer/83/query';

const ZONE_CLASS = {
  1: 'P/OS',
  2: 'RR',
  3: 'SF-1',
  4: 'SF-2',
  5: 'SF-3',
  6: 'MU',
  7: 'GC',
  8: 'PI',
  9: 'IND',
  10: 'PDD',
};

function parseCornerSide(sideText) {
  if (!sideText || typeof sideText !== 'string') return null;
  const m = sideText.match(/Corner Side Street Setback:\s*(\d+(?:\.\d+)?)\s*ft/i);
  return m ? Number(m[1]) : null;
}

function isNonScalarSide(text) {
  if (!text) return false;
  return /reference building code|fire code|none\s*-/i.test(text);
}

async function queryUrl(base, params) {
  const url = `${base}?${new URLSearchParams(params)}`;
  const raw = execFileSync(
    'curl.exe',
    ['--ssl-no-revoke', '-sS', url],
    { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 },
  );
  return JSON.parse(raw);
}

async function getDistrictFrom83(propId) {
  const data = await queryUrl(LAYER83, {
    where: `prop_id=${propId}`,
    outFields: 'prop_id,ZoneTypeClass,CornerSideSetbacks',
    returnGeometry: 'false',
    f: 'json',
  });
  const rows = (data.features ?? []).map((f) => f.attributes);
  if (!rows.length) return { district: null, cornerFrom83: null, rows: [] };
  // Prefer largest area polygon's district — use first SF-1/GC/MU by priority if multi
  const codes = [...new Set(rows.map((r) => r.ZoneTypeClass))];
  let pick = rows[0];
  for (const prefer of [3, 6, 7, 4, 5, 2, 10, 1, 8, 9]) {
    const hit = rows.find((r) => r.ZoneTypeClass === prefer);
    if (hit) {
      pick = hit;
      break;
    }
  }
  return {
    district: ZONE_CLASS[pick.ZoneTypeClass] ?? String(pick.ZoneTypeClass),
    cornerFrom83: pick.CornerSideSetbacks ?? null,
    allDistricts: codes.map((c) => ZONE_CLASS[c] ?? c),
    rows: rows.length,
  };
}

async function getRecord23(propId, districtCode) {
  const data = await queryUrl(LAYER23, {
    where: `prop_id=${propId}`,
    outFields: '*',
    returnGeometry: 'false',
    f: 'json',
  });
  const rows = (data.features ?? []).map((f) => f.attributes);
  if (!rows.length) return null;

  const districtName = typeof districtCode === 'string'
    ? Object.entries(ZONE_CLASS).find(([, v]) => v === districtCode)?.[0]
    : null;
  const codeNum = districtName ? Number(districtName) : null;

  let pick = rows[0];
  if (codeNum != null) {
    const hit = rows.find((r) => r.ZoneTypeClass === codeNum);
    if (hit) pick = hit;
  } else if (rows.length > 1) {
    const byArea = [...rows].sort((a, b) => (b.Shape__Area ?? 0) - (a.Shape__Area ?? 0));
    pick = byArea[0];
  }

  const sideText = pick.SideSetback ?? '';
  const cornerParsed = parseCornerSide(sideText);
  const sideDecline = isNonScalarSide(sideText);

  return {
    prop_id: propId,
    situs: pick.SITUS_ADDR?.trim() ?? null,
    zoneTypeClass: ZONE_CLASS[pick.ZoneTypeClass] ?? pick.ZoneTypeClass,
    front_ft: pick.FrontSetback_ ?? null,
    side_interior_ft: sideDecline ? null : pick.SideSetback_ ?? null,
    side_corner_ft: cornerParsed,
    side_decline: sideDecline,
    side_raw: sideText,
    rear_ft: pick.RearSetback_ ?? null,
    height_ft: pick.MaxBuildingHt ?? null,
    impervious: pick.MaxImpervisionCoverage ?? null,
    min_lot: pick.MinimumLotSize ?? null,
    ordinance_link: pick.Ordinance_Link ?? null,
    overlap_rows: rows.length,
  };
}

async function main() {
  const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
  const propIds = manifest.parcels.map((p) => p.prop_id);
  const results = [];
  const errors = [];

  const idList = propIds.join(',');
  let all83 = [];
  let all23 = [];
  try {
    const d83 = await queryUrl(LAYER83, {
      where: `prop_id IN (${idList})`,
      outFields: 'prop_id,ZoneTypeClass,CornerSideSetbacks,Shape__Area',
      returnGeometry: 'false',
      f: 'json',
    });
    all83 = (d83.features ?? []).map((f) => f.attributes);
    const d23 = await queryUrl(LAYER23, {
      where: `prop_id IN (${idList})`,
      outFields: '*',
      returnGeometry: 'false',
      f: 'json',
    });
    all23 = (d23.features ?? []).map((f) => f.attributes);
  } catch (e) {
    console.error('Batch query failed:', e.message ?? e);
    process.exit(1);
  }

  const by83 = new Map();
  for (const row of all83) {
    const pid = row.prop_id;
    if (!by83.has(pid)) by83.set(pid, []);
    by83.get(pid).push(row);
  }
  const by23 = new Map();
  for (const row of all23) {
    const pid = row.prop_id;
    if (!by23.has(pid)) by23.set(pid, []);
    by23.get(pid).push(row);
  }

  for (const propId of propIds) {
    try {
      const rows83 = by83.get(propId) ?? [];
      let pick83 = rows83[0];
      for (const prefer of [3, 6, 7, 4, 5, 2, 10, 1, 8, 9]) {
        const hit = rows83.find((r) => r.ZoneTypeClass === prefer);
        if (hit) {
          pick83 = hit;
          break;
        }
      }
      const d83 = {
        district: pick83 ? (ZONE_CLASS[pick83.ZoneTypeClass] ?? String(pick83.ZoneTypeClass)) : null,
        cornerFrom83: pick83?.CornerSideSetbacks ?? null,
        allDistricts: [...new Set(rows83.map((r) => ZONE_CLASS[r.ZoneTypeClass] ?? r.ZoneTypeClass))],
        rows: rows83.length,
      };

      const rows23 = by23.get(propId) ?? [];
      if (!rows23.length) {
        errors.push({ prop_id: propId, error: 'no layer 23 row' });
        continue;
      }
      const codeNum = d83.district
        ? Number(Object.entries(ZONE_CLASS).find(([, v]) => v === d83.district)?.[0] ?? NaN)
        : NaN;
      let pick = rows23[0];
      if (!Number.isNaN(codeNum)) {
        const hit = rows23.find((r) => r.ZoneTypeClass === codeNum);
        if (hit) pick = hit;
      } else if (rows23.length > 1) {
        pick = [...rows23].sort((a, b) => (b.Shape__Area ?? 0) - (a.Shape__Area ?? 0))[0];
      }

      const sideText = pick.SideSetback ?? '';
      const cornerParsed = parseCornerSide(sideText);
      const sideDecline = isNonScalarSide(sideText);
      const rec = {
        prop_id: propId,
        situs: pick.SITUS_ADDR?.trim() ?? null,
        zoneTypeClass: ZONE_CLASS[pick.ZoneTypeClass] ?? pick.ZoneTypeClass,
        front_ft: pick.FrontSetback_ ?? null,
        side_interior_ft: sideDecline ? null : pick.SideSetback_ ?? null,
        side_corner_ft: cornerParsed,
        side_decline: sideDecline,
        side_raw: sideText,
        rear_ft: pick.RearSetback_ ?? null,
        height_ft: pick.MaxBuildingHt ?? null,
        impervious: pick.MaxImpervisionCoverage ?? null,
        min_lot: pick.MinimumLotSize ?? null,
        ordinance_link: pick.Ordinance_Link ?? null,
        overlap_rows: rows23.length,
      };
      if (rec.side_corner_ft == null && d83.cornerFrom83) {
        const m = String(d83.cornerFrom83).match(/(\d+(?:\.\d+)?)/);
        if (m) rec.side_corner_ft = Number(m[1]);
        rec.corner_source = 'Zoned_Parcels/83';
      }
      results.push({
        ...rec,
        stamped_district_83: d83.district,
        all_districts_83: d83.allDistricts,
      });
    } catch (e) {
      errors.push({ prop_id: propId, error: String(e.message ?? e) });
    }
  }

  const districtCounts = {};
  for (const r of results) {
    const d = r.stamped_district_83 ?? r.zoneTypeClass ?? '?';
    districtCounts[d] = (districtCounts[d] ?? 0) + 1;
  }

  const payload = {
    pulled_at: new Date().toISOString(),
    manifest: manifest.id,
    parcel_count: results.length,
    district_counts: districtCounts,
    errors,
    parcels: results,
    evidence_anchors: manifest.evidence_anchors,
  };

  writeFileSync(OUT, JSON.stringify(payload, null, 2));
  console.log(JSON.stringify({ out: OUT, parcel_count: results.length, district_counts: districtCounts, errors: errors.length }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
