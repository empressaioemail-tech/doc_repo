#!/usr/bin/env node
/**
 * STEP 6 — Live area-sweep for Bastrop downtown drill (R14 RENDERED SET).
 * Cert scope = BCAD parcels PE renders in test bbox (not curated manifest alone).
 * PE facets + fresh Parcels_One_Click/23 ground truth.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const MANIFEST = join(REPO_ROOT, '_catalog/bastrop_downtown_drill_test_area.json');
const OUT = join(REPO_ROOT, '_scratch/bastrop-downtown-area-sweep-results.json');

const PE_BASE = 'https://property-explorer-xi.vercel.app/api/spine/property-atoms';
const LAYER23 =
  'https://services7.arcgis.com/qOeXJdBtGknaCJC4/arcgis/rest/services/Parcels_One_Click/FeatureServer/23/query';
const BCAD_PARCELS =
  'https://maps.co.bastrop.tx.us/server/rest/services/Cadastral_BP/Bastrop_County_Parcels/FeatureServer/0/query';

const ZONE_CLASS = {
  1: 'P/OS', 2: 'RR', 3: 'SF-1', 4: 'SF-2', 5: 'SF-3', 6: 'MU', 7: 'GC', 8: 'PI', 9: 'IND', 10: 'PDD',
};

const REPEALED = /^(P-\d|P\/OS$)/i;
const BUILD_TO = /build-to/i;
const REPEALED_SOURCE = /b3-code-april-2025|descriptor-fixture|cortex-tier1-snapshot-breadth-bake/i;
const PENDING_REWARM = /pending re-warm|verify with city/i;
const CURRENT_BDC = /^(SF-[123]|GC|MU|RR|PI|IND|PDD)/i;

function curlJson(url) {
  const raw = execFileSync('curl.exe', ['--ssl-no-revoke', '-sS', '-w', '\n%{http_code}', url], {
    encoding: 'utf8',
    maxBuffer: 5 * 1024 * 1024,
  });
  const nl = raw.lastIndexOf('\n');
  const body = raw.slice(0, nl);
  const code = Number(raw.slice(nl + 1));
  if (code < 200 || code >= 300) {
    throw new Error(`HTTP ${code} for ${url}`);
  }
  return JSON.parse(body);
}

function queryUrl(base, params) {
  const url = `${base}?${new URLSearchParams(params)}`;
  return curlJson(url);
}

function parseCornerSide(sideText) {
  if (!sideText || typeof sideText !== 'string') return null;
  const m = sideText.match(/Corner Side Street Setback:\s*(\d+(?:\.\d+)?)\s*ft/i);
  return m ? Number(m[1]) : null;
}

function isNonScalarSide(text) {
  if (!text) return false;
  return /reference building code|fire code|none\s*-/i.test(text);
}

function pickLayer23Row(rows, districtCode) {
  if (!rows.length) return null;
  if (rows.length === 1) return rows[0];
  const codeNum = districtCode
    ? Number(Object.entries(ZONE_CLASS).find(([, v]) => v === districtCode)?.[0] ?? NaN)
    : NaN;
  if (!Number.isNaN(codeNum)) {
    const hit = rows.find((r) => r.ZoneTypeClass === codeNum);
    if (hit) return hit;
  }
  return [...rows].sort((a, b) => (b.Shape__Area ?? 0) - (a.Shape__Area ?? 0))[0];
}

function layer23Scalars(pick, cornerFrom83) {
  const sideText = pick.SideSetback ?? '';
  const sideDecline = isNonScalarSide(sideText);
  let corner = parseCornerSide(sideText);
  if (corner == null && cornerFrom83) {
    const m = String(cornerFrom83).match(/(\d+(?:\.\d+)?)/);
    if (m) corner = Number(m[1]);
  }
  return {
    front: Number(pick.FrontSetback_) || null,
    sideInterior: sideDecline ? null : Number(pick.SideSetback_) || null,
    sideCorner: corner,
    sideDecline,
    rear: Number(pick.RearSetback_) || null,
  };
}

function ringVertCount(facets) {
  const feats = facets?.envelope?.geojson?.features ?? [];
  const ring = feats[0]?.geometry?.coordinates?.[0];
  if (!Array.isArray(ring)) return 0;
  return ring.length > 0 ? ring.length - 1 : 0;
}

function openRingCoords(ring) {
  if (!Array.isArray(ring) || ring.length < 4) return [];
  const open = ring.slice();
  const first = open[0];
  const last = open[open.length - 1];
  if (first && last && first[0] === last[0] && first[1] === last[1]) open.pop();
  return open;
}

/** Local equirectangular projection for convex/orthogonality checks at parcel scale. */
function projectRingLngLat(open) {
  if (open.length < 3) return null;
  const originLng = open.reduce((s, p) => s + p[0], 0) / open.length;
  const originLat = open.reduce((s, p) => s + p[1], 0) / open.length;
  const mPerDegLat = 111_320;
  const mPerDegLng = mPerDegLat * Math.cos((originLat * Math.PI) / 180);
  const points = open.map(([lng, lat]) => ({
    x: (lng - originLng) * mPerDegLng,
    y: (lat - originLat) * mPerDegLat,
  }));
  return { points, originLng, originLat, mPerDegLng, mPerDegLat };
}

function turnAngleDeg(a, b, c) {
  const v1x = b.x - a.x;
  const v1y = b.y - a.y;
  const v2x = c.x - b.x;
  const v2y = c.y - b.y;
  const l1 = Math.hypot(v1x, v1y);
  const l2 = Math.hypot(v2x, v2y);
  if (l1 < 1e-9 || l2 < 1e-9) return 0;
  const cos = (v1x * v2x + v1y * v2y) / (l1 * l2);
  return Math.acos(Math.max(-1, Math.min(1, cos))) * (180 / Math.PI);
}

function isNearRectangularRing(open) {
  if (open.length < 4 || open.length > 6) return false;
  const frame = projectRingLngLat(open);
  if (!frame) return false;
  for (let i = 0; i < frame.points.length; i++) {
    const a = frame.points[(i + frame.points.length - 1) % frame.points.length];
    const b = frame.points[i];
    const c = frame.points[(i + 1) % frame.points.length];
    const turn = turnAngleDeg(a, b, c);
    if (turn < 12) continue;
    const v1x = b.x - a.x;
    const v1y = b.y - a.y;
    const v2x = c.x - b.x;
    const v2y = c.y - b.y;
    const l1 = Math.hypot(v1x, v1y);
    const l2 = Math.hypot(v2x, v2y);
    if (l1 < 0.3 || l2 < 0.3) continue;
    if (turn < 75 || turn > 105) return false;
  }
  return true;
}

function isConvexProjected(open) {
  const frame = projectRingLngLat(open);
  if (!frame) return false;
  const pts = frame.points;
  let sign = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[(i + pts.length - 1) % pts.length];
    const b = pts[i];
    const c = pts[(i + 1) % pts.length];
    const cross = (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x);
    const ab = Math.hypot(b.x - a.x, b.y - a.y);
    const bc = Math.hypot(c.x - b.x, c.y - b.y);
    if (ab < 1e-6 || bc < 1e-6) continue;
    const sin = cross / (ab * bc);
    const turnDeg = Math.abs(Math.asin(Math.max(-1, Math.min(1, sin))) * (180 / Math.PI));
    if (turnDeg < 12) continue;
    const s = Math.sign(cross);
    if (s === 0) continue;
    if (sign === 0) sign = s;
    else if (s !== sign) return false;
  }
  return sign !== 0;
}

/** R5 tightened gate (e): near-rect parcel → convex inset ≤ parcel edge count. */
function geometryGatePass(facets, parcelRing) {
  const env = facets?.envelope ?? {};
  if (env.status !== 'ok') {
    return { pass: false, note: `envelope status=${env.status ?? 'missing'}` };
  }
  const feats = env.geojson?.features ?? [];
  const insetRing = feats[0]?.geometry?.coordinates?.[0];
  const insetOpen = openRingCoords(insetRing);
  const insetVerts = insetOpen.length;
  if (insetVerts < 4) {
    return { pass: false, note: `inset verts=${insetVerts}` };
  }
  if (!env.buildableAreaSqFt || env.buildableAreaSqFt <= 0) {
    return { pass: false, note: 'zero buildable area' };
  }
  const parcelOpen = openRingCoords(parcelRing);
  if (parcelOpen.length >= 4 && isNearRectangularRing(parcelOpen)) {
    if (insetVerts > parcelOpen.length + 1) {
      return {
        pass: false,
        note: `near-rect parcel (${parcelOpen.length} edges) → inset verts=${insetVerts} exceeds cap`,
      };
    }
    if (!isConvexProjected(insetOpen)) {
      return { pass: false, note: 'near-rect parcel → non-convex inset (notch/jog)' };
    }
  }
  return { pass: true, note: `inset verts=${insetVerts}` };
}

function ringCentroid(ring) {
  if (!ring?.length) return null;
  let lng = 0;
  let lat = 0;
  for (const [x, y] of ring) {
    lng += x;
    lat += y;
  }
  return [lng / ring.length, lat / ring.length];
}

function fetchLayer23Spatial(lng, lat) {
  const url = `${LAYER23}?${new URLSearchParams({
    geometry: JSON.stringify({ x: lng, y: lat, spatialReference: { wkid: 4326 } }),
    geometryType: 'esriGeometryPoint',
    inSR: '4326',
    spatialRel: 'esriSpatialRelIntersects',
    outFields: '*',
    returnGeometry: 'false',
    f: 'json',
  })}`;
  const data = curlJson(url);
  return (data.features ?? []).map((f) => f.attributes);
}

function gradeParcel(propId, nodeId, l23, pe, manifestNote, parcelRing) {
  const facets = pe?.facets ?? {};
  const zDistrict = facets.zoning?.district?.trim() ?? '';
  const env = facets.envelope ?? {};
  const sb = env.setbacks ?? {};
  const disclosure = String(env.disclosure ?? '');
  const notes = [];

  const d = { a: true, b: true, c: true, d: true, e: true, f: true, g: true, h: true, i: true };

  const l23Resolvable =
    l23 &&
    l23.front != null &&
    l23.rear != null &&
    (l23.sideDecline || l23.sideInterior != null);

  // (f) R9 parcel-currency — prop_id exists in current BCAD cadastral
  if (!parcelRing) {
    d.f = false;
    notes.push('R9: prop_id absent from BCAD cadastral (superseded — re-key manifest)');
  }

  // (g) R10 persisted == recompute — warm path served, not stale declined
  const honestDeclineReason =
    env.declineReason === 'setback-rule-pending' ||
    env.declineReason === 'split-zone-ambiguous';
  if (
    l23Resolvable &&
    env.status === 'declined' &&
    !PENDING_REWARM.test(disclosure) &&
    !honestDeclineReason
  ) {
    d.g = false;
    notes.push(`R10: stale declined envelope (persisted != recompute)`);
  }
  if (l23Resolvable && env.status === 'ok') {
    if (!String(pe.readPath ?? '').includes('atom-chain-warm')) {
      d.g = false;
      notes.push(`R10: readPath=${pe.readPath ?? 'missing'} (expect atom-chain-warm)`);
    }
    if (!env.buildableAreaSqFt || env.buildableAreaSqFt <= 0) {
      d.g = false;
      notes.push('R10: zero buildable area on ok envelope');
    }
  }

  // (d) no blank district
  if (!zDistrict) {
    d.d = false;
    notes.push('blank district');
  }

  // (b) current edition — no repealed P-x; no build-to on current BDC districts
  if (REPEALED.test(zDistrict) || BUILD_TO.test(JSON.stringify(sb))) {
    d.b = false;
    notes.push(`repealed/build-to district=${zDistrict}`);
  }
  if (
    env.status === 'ok' &&
    /^SF-[123]/.test(zDistrict) &&
    (BUILD_TO.test(disclosure) ||
      (sb.front_ft === 15 && sb.not_specified?.side && sb.not_specified?.rear))
  ) {
    d.b = false;
    notes.push('R13: repealed P-5-style scalars or build-to on SF district');
  }

  // (h) R13 — repealed regime unreachable (fail-closed decline OK; stale ok envelope NOT)
  if (env.status === 'ok' && /^SF-[123]/.test(zDistrict)) {
    if (BUILD_TO.test(disclosure) || REPEALED_SOURCE.test(disclosure)) {
      d.h = false;
      notes.push('R13: ok envelope carries repealed/build-to disclosure');
    }
    if (sb.front_ft === 15 && sb.not_specified?.side && sb.not_specified?.rear) {
      d.h = false;
      notes.push('R13: serving repealed F15/S-R-not-specified pattern');
    }
  }
  if (
    env.status === 'declined' &&
    !PENDING_REWARM.test(disclosure) &&
    !honestDeclineReason &&
    l23Resolvable
  ) {
    d.h = false;
    notes.push('R13: declined without honest pending-re-warm disclosure');
  }

  // (i) R14 — rendered parcel must be gradable (has BCAD ring)
  if (!parcelRing) {
    d.i = false;
    notes.push('R14: rendered parcel missing BCAD ring — lookup miss');
  }

  // (a) internal consistency
  if (zDistrict && env.district && env.district !== zDistrict) {
    d.a = false;
    notes.push(`zoning ${zDistrict} != envelope ${env.district}`);
  }
  if (env.status === 'ok' && !sb.front_ft && sb.front_ft !== 0) {
    d.a = false;
    notes.push('envelope ok but no setbacks');
  }
  if (pe.readPath && !String(pe.readPath).includes('atom-chain')) {
    d.a = false;
    notes.push(`readPath=${pe.readPath}`);
  }

  // (c) numbers match layer 23 — skip when honest decline (no scalars served)
  const honestDeclined =
    env.status === 'declined' &&
    (PENDING_REWARM.test(disclosure) ||
      env.declineReason === 'setback-rule-pending' ||
      env.declineReason === 'split-zone-ambiguous');
  if (l23 && !honestDeclined) {
    if (sb.front_ft != null && l23.front != null && sb.front_ft !== l23.front) {
      d.c = false;
      notes.push(`front PE=${sb.front_ft} L23=${l23.front}`);
    }
    if (sb.rear_ft != null && l23.rear != null && sb.rear_ft !== l23.rear) {
      d.c = false;
      notes.push(`rear PE=${sb.rear_ft} L23=${l23.rear}`);
    }
    if (l23.sideDecline) {
      if (!sb.not_specified?.side && sb.side_ft !== 0) {
        d.c = false;
        notes.push('MU/GC side should honest-decline');
      }
    } else {
      const peSide = sb.side_ft;
      const peCorner = sb.side_corner_ft ?? sb.corner_ft;
      const peInterior = sb.side_interior_ft;
      if (l23.sideInterior != null) {
        const interiorOk =
          peInterior === l23.sideInterior ||
          (peInterior == null && peSide === l23.sideInterior);
        const cornerOk =
          l23.sideCorner == null ||
          peCorner === l23.sideCorner ||
          (peCorner == null && peSide === l23.sideCorner);
        if (!interiorOk && !(l23.sideCorner != null && peSide === l23.sideCorner)) {
          d.c = false;
          notes.push(
            `side PE=${peSide}/${peInterior}/${peCorner} L23=${l23.sideInterior}/${l23.sideCorner}`,
          );
        }
        if (l23.sideCorner != null && peSide === l23.sideCorner && peInterior == null && l23.sideInterior !== l23.sideCorner) {
          d.c = false;
          notes.push(`corner lot missing interior side (PE side=${peSide} L23 int=${l23.sideInterior} corner=${l23.sideCorner})`);
        }
      }
    }
  } else if (!l23 && !honestDeclined) {
    d.c = false;
    notes.push('no layer 23 row');
  }

  // (e) geometry invariant — R5 vertex cap + convexity for near-rect parcels
  if (env.status === 'ok') {
    const geom = geometryGatePass(facets, parcelRing);
    if (!geom.pass) {
      d.e = false;
      notes.push(geom.note);
    }
  } else if (env.status === 'declined' && honestDeclined) {
    // R13 honest decline — no buildable geometry required
  } else if (env.status !== 'pending' && env.status !== 'unavailable') {
    d.e = false;
    notes.push(`envelope status=${env.status ?? 'missing'}`);
  }

  const rowPass = d.a && d.b && d.c && d.d && d.e && d.f && d.g && d.h && d.i;
  return { grades: d, rowPass, notes, peSetbacks: sb, l23, ringVerts: ringVertCount(facets) };
}

function fetchRenderedParcelsInBbox(bbox) {
  const geom = JSON.stringify({
    xmin: bbox.xmin,
    ymin: bbox.ymin,
    xmax: bbox.xmax,
    ymax: bbox.ymax,
    spatialReference: { wkid: 4326 },
  });
  const data = queryUrl(BCAD_PARCELS, {
    geometry: geom,
    geometryType: 'esriGeometryEnvelope',
    inSR: '4326',
    spatialRel: 'esriSpatialRelIntersects',
    outFields: 'prop_id,SITUS_ADDR,file_as_name',
    returnGeometry: 'true',
    outSR: '4326',
    f: 'geojson',
  });
  const rendered = [];
  const parcelRings = new Map();
  for (const feat of data.features ?? []) {
    const pid = Number(feat.properties?.prop_id ?? feat.properties?.PROP_ID);
    if (!Number.isFinite(pid)) continue;
    const ring = feat.geometry?.coordinates?.[0];
    if (ring) parcelRings.set(pid, ring);
    rendered.push({
      prop_id: pid,
      node_id: `48021:${pid}`,
      situs: feat.properties?.SITUS_ADDR ?? feat.properties?.situs_addr ?? '',
    });
  }
  rendered.sort((a, b) => a.prop_id - b.prop_id);
  return { rendered, parcelRings };
}

async function main() {
  const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
  const bbox = manifest.envelope_wgs84;
  const { rendered, parcelRings } = fetchRenderedParcelsInBbox(bbox);
  const manifestByProp = new Map(manifest.parcels.map((p) => [p.prop_id, p]));
  const seedPropIds = new Set(manifest.parcels.map((p) => p.prop_id));
  const notInManifest = rendered.filter((p) => !seedPropIds.has(p.prop_id));
  if (notInManifest.length) {
    console.log(
      JSON.stringify({
        event: 'r14.rendered-set.diff',
        rendered_count: rendered.length,
        seed_count: seedPropIds.size,
        not_in_manifest: notInManifest.map((p) => p.node_id),
      }),
    );
  }

  const propIds = rendered.map((p) => p.prop_id);
  const idList = propIds.join(',');

  const d23 = queryUrl(LAYER23, {
    where: `prop_id IN (${idList})`,
    outFields: '*',
    returnGeometry: 'false',
    f: 'json',
  });
  const by23 = new Map();
  for (const f of d23.features ?? []) {
    const pid = f.attributes.prop_id;
    if (!by23.has(pid)) by23.set(pid, []);
    by23.get(pid).push(f.attributes);
  }

  const rows = [];
  for (const p of rendered) {
    const nodeId = p.node_id;
    const seed = manifestByProp.get(p.prop_id);
    let pe;
    try {
      pe = curlJson(`${PE_BASE}/${encodeURIComponent(nodeId)}/facets`);
    } catch (e) {
      pe = { error: String(e.message ?? e) };
    }

    const zDistrict = pe?.facets?.zoning?.district?.trim() ?? '';
    const l23rows = by23.get(p.prop_id) ?? [];
    const ring = parcelRings.get(p.prop_id) ?? null;
    let l23PickRows = l23rows;
    if (!l23PickRows.length && ring) {
      const c = ringCentroid(ring);
      if (c) l23PickRows = fetchLayer23Spatial(c[0], c[1]);
    }
    const pick = pickLayer23Row(l23PickRows, zDistrict || null);
    const l23 = pick ? layer23Scalars(pick, null) : null;
    const situs =
      pe?.facets?.baseFacts?.situsAddress?.trim() ||
      pick?.SITUS_ADDR?.trim() ||
      p.situs ||
      seed?.situs ||
      '';

    if (!pe.error) {
      const g = gradeParcel(
        p.prop_id,
        nodeId,
        l23,
        pe,
        seed?.note,
        ring,
      );
      rows.push({
        node_id: nodeId,
        prop_id: p.prop_id,
        situs,
        district: zDistrict,
        in_manifest: !!seed,
        ...g,
        readPath: pe.readPath,
        anchor: seed && Object.values(manifest.evidence_anchors ?? {}).includes(nodeId) ? nodeId : null,
      });
    } else {
      rows.push({
        node_id: nodeId,
        prop_id: p.prop_id,
        situs,
        district: '',
        in_manifest: !!seed,
        rowPass: false,
        grades: { a: false, b: false, c: false, d: false, e: false, f: false, g: false, h: false, i: false },
        notes: [pe.error],
        error: pe.error,
      });
    }
    process.stdout.write(`${nodeId} ${rows.at(-1).rowPass ? 'PASS' : 'FAIL'}\n`);
  }

  const passCount = rows.filter((r) => r.rowPass).length;
  const failIds = rows.filter((r) => !r.rowPass).map((r) => r.node_id);
  const payload = {
    swept_at: new Date().toISOString(),
    cert_scope: 'rendered-set-r14',
    bbox,
    rendered_count: rendered.length,
    seed_manifest_count: manifest.parcels.length,
    not_in_manifest: notInManifest.map((p) => p.node_id),
    serving: {
      engine_api: 'hauska-engine-api-00152-nuz @100% tag bdc-downtown',
      retrieval_api: 'hauska-retrieval-api-00045-yek @100% tag bdc',
      pe: 'property-explorer-xi.vercel.app PROPERTY_ATOM_PATH=1',
    },
    pass_count: passCount,
    fail_count: rows.length - passCount,
    verdict: failIds.length === 0 ? 'PASS' : 'FAIL',
    fail_ids: failIds,
    rows,
  };

  writeFileSync(OUT, JSON.stringify(payload, null, 2));
  console.log(JSON.stringify({ out: OUT, verdict: payload.verdict, rendered: rendered.length, pass: passCount, fail: failIds.length, fail_ids: failIds }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
