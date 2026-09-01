#!/usr/bin/env node
/**
 * Product-surface smoke suite — live GET probes for PE / engine / retrieval.
 * Runbook: 90_runbooks/product_surface_smoke_suite.md
 *
 * Usage:
 *   node scripts/product-surface-smoke.mjs
 *   node scripts/product-surface-smoke.mjs --dry-run
 *   RETRIEVAL_API_KEY=... node scripts/product-surface-smoke.mjs
 *
 * --dry-run: still hits live endpoints; prints a planned probe list first and
 *            never exits non-zero (report-only). Default mode exits 1 on fail.
 */
import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const OUT_DEFAULT = join(REPO_ROOT, '_scratch/product-surface-smoke-last.json');

const PE_BASE = process.env.PE_BASE || 'https://property-explorer-xi.vercel.app';
const ENGINE_BASE =
  process.env.ENGINE_API_URL || 'https://hauska-engine-api-h7gvu7rgcq-uc.a.run.app';
const RETRIEVAL_BASE =
  process.env.RETRIEVAL_API_URL ||
  'https://hauska-retrieval-api-h7gvu7rgcq-uc.a.run.app';

/** Three Bastrop downtown / gold parcels with known warm chains (adjust via SMOKE_PARCELS). */
const DEFAULT_PARCELS = ['48021:34073', '48021:34785', '48021:34017'];

const dryRun = process.argv.includes('--dry-run');
const parcels = (process.env.SMOKE_PARCELS || DEFAULT_PARCELS.join(','))
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const startedAt = new Date().toISOString();
const checks = [];

function curlRaw(url, { headers = [], method = 'GET' } = {}) {
  const args = ['--ssl-no-revoke', '-sS', '-w', '\n%{http_code}', '-X', method, url];
  for (const h of headers) {
    args.push('-H', h);
  }
  const raw = execFileSync('curl.exe', args, {
    encoding: 'utf8',
    maxBuffer: 12 * 1024 * 1024,
  });
  const nl = raw.lastIndexOf('\n');
  const body = raw.slice(0, nl);
  const code = Number(raw.slice(nl + 1));
  return { code, body };
}

function curlJson(url, opts) {
  const { code, body } = curlRaw(url, opts);
  let json = null;
  try {
    json = body ? JSON.parse(body) : null;
  } catch {
    json = null;
  }
  return { code, body, json };
}

function record(name, pass, detail) {
  const row = { name, pass, detail };
  checks.push(row);
  const mark = pass ? 'PASS' : 'FAIL';
  console.log(`[${mark}] ${name}${detail ? ` — ${detail}` : ''}`);
  return pass;
}

function ringVerts(geojson) {
  const feats = geojson?.features ?? [];
  let n = 0;
  for (const f of feats) {
    const rings = f?.geometry?.coordinates ?? [];
    for (const ring of rings) {
      if (Array.isArray(ring)) n = Math.max(n, ring.length);
    }
  }
  return n;
}

function setbacksFromFacets(facets) {
  const sb = facets?.envelope?.setbacks ?? {};
  return {
    front: sb.front_ft ?? null,
    side: sb.side_ft ?? sb.side_interior_ft ?? null,
    rear: sb.rear_ft ?? null,
    sideCorner: sb.side_corner_ft ?? null,
  };
}

function setbacksFromChain(chain) {
  const rule = chain?.setbackRule ?? {};
  if (!rule || rule.status === 'absent' || rule.absence) {
    return { front: null, side: null, rear: null, sideCorner: null, status: rule.status ?? 'missing' };
  }
  return {
    front: rule.front ?? null,
    side: rule.side ?? rule.sideInteriorFt ?? null,
    rear: rule.rear ?? null,
    sideCorner: rule.sideCornerFt ?? null,
    status: rule.status ?? 'active',
  };
}

function setbacksMatch(a, b) {
  const keys = ['front', 'side', 'rear'];
  for (const k of keys) {
    if (a[k] == null && b[k] == null) continue;
    if (Number(a[k]) !== Number(b[k])) return false;
  }
  return true;
}

console.log(`product-surface-smoke ${dryRun ? '(dry-run / report-only)' : '(strict)'}`);
console.log(`started ${startedAt}`);
console.log(`PE=${PE_BASE}`);
console.log(`ENGINE=${ENGINE_BASE}`);
console.log(`RETRIEVAL=${RETRIEVAL_BASE}`);
console.log(`parcels=${parcels.join(',')}`);
if (dryRun) {
  console.log('\nPlanned probes:');
  console.log('  GET engine /health');
  console.log('  GET retrieval /health');
  console.log('  GET retrieval /health/search');
  console.log('  GET PE /api/spine/property-atoms/{id}/facets  (x3)');
  console.log('  GET PE /api/spine/retrieval/property-nodes/{id}/atom-chain  (x3)');
  console.log('  GET retrieval /search?q=setback&limit=3  (Bearer if RETRIEVAL_API_KEY set)');
  console.log('');
}

// --- Service health -------------------------------------------------------
{
  const r = curlJson(`${ENGINE_BASE}/health`);
  record(
    'engine.health',
    r.code === 200 && r.json?.status === 'ok' && r.json?.adapters === true,
    `HTTP ${r.code} status=${r.json?.status} adapters=${r.json?.adapters}`,
  );
}
{
  const r = curlJson(`${RETRIEVAL_BASE}/health`);
  record(
    'retrieval.health',
    r.code === 200 && r.json?.status === 'ok',
    `HTTP ${r.code} status=${r.json?.status}`,
  );
}
{
  const r = curlJson(`${RETRIEVAL_BASE}/health/search`);
  record(
    'retrieval.health_search',
    r.code === 200 && r.json?.ok === true && (r.json?.resultCount ?? 0) > 0,
    `HTTP ${r.code} ok=${r.json?.ok} resultCount=${r.json?.resultCount} latencyMs=${r.json?.latencyMs}`,
  );
}

// --- Per-parcel: card (facets) vs sheet (atom-chain) setbacks + envelope ---
for (const nodeId of parcels) {
  const enc = encodeURIComponent(nodeId);
  const facetsUrl = `${PE_BASE}/api/spine/property-atoms/${enc}/facets`;
  const chainUrl = `${PE_BASE}/api/spine/retrieval/property-nodes/${enc}/atom-chain`;

  const facetsRes = curlJson(facetsUrl);
  const facetsOk =
    facetsRes.code === 200 &&
    facetsRes.json?.parcelNodeId === nodeId &&
    facetsRes.json?.facets != null;
  record(
    `pe.facets:${nodeId}`,
    facetsOk,
    `HTTP ${facetsRes.code} readPath=${facetsRes.json?.readPath ?? 'n/a'}`,
  );

  const chainRes = curlJson(chainUrl);
  const chainOk = chainRes.code === 200 && chainRes.json?.parcelNodeId === nodeId;
  record(`pe.atom_chain:${nodeId}`, chainOk, `HTTP ${chainRes.code}`);

  if (!facetsOk || !chainOk) continue;

  const facets = facetsRes.json.facets;
  const cardSb = setbacksFromFacets(facets);
  const sheetSb = setbacksFromChain(chainRes.json);
  const consistent = setbacksMatch(cardSb, sheetSb);
  record(
    `setback.card_vs_sheet:${nodeId}`,
    consistent,
    `card=${JSON.stringify(cardSb)} sheet=${JSON.stringify({
      front: sheetSb.front,
      side: sheetSb.side,
      rear: sheetSb.rear,
    })}`,
  );

  const env = facets.envelope ?? {};
  const verts = ringVerts(env.geojson);
  const area = Number(env.buildableAreaSqFt ?? 0);
  const status = env.status ?? env.declineReason ?? 'unknown';
  let envPass = false;
  let envDetail = `status=${status} areaSqFt=${area || 'n/a'} ringVerts=${verts}`;
  if (status === 'ok') {
    envPass = area > 0 && verts >= 4;
    if (!envPass) envDetail += ' (ok envelope missing area or ring)';
  } else if (
    status === 'declined' ||
    env.declineReason === 'setback-rule-pending' ||
    env.declineReason === 'split-zone-ambiguous' ||
    env.declineReason === 'unzoned-no-district-basis'
  ) {
    // Honest decline is a valid smoke outcome; geometry sanity N/A.
    envPass = true;
    envDetail += ' (honest decline — geometry N/A)';
  } else {
    envPass = false;
    envDetail += ' (unexpected envelope state)';
  }
  record(`envelope.sanity:${nodeId}`, envPass, envDetail);
}

// --- Corpus search --------------------------------------------------------
{
  const key = process.env.RETRIEVAL_API_KEY || '';
  if (!key) {
    record(
      'retrieval.search',
      true,
      'SKIPPED (set RETRIEVAL_API_KEY for Bearer /search probe; /health/search already covered)',
    );
  } else {
    const url = `${RETRIEVAL_BASE}/search?${new URLSearchParams({
      q: 'setback',
      limit: '3',
      jurisdiction: 'bastrop_tx',
    })}`;
    const r = curlJson(url, { headers: [`Authorization: Bearer ${key}`] });
    const count =
      r.json?.results?.length ??
      r.json?.atoms?.length ??
      r.json?.hits?.length ??
      (Array.isArray(r.json) ? r.json.length : 0);
    record(
      'retrieval.search',
      r.code === 200 && count > 0,
      `HTTP ${r.code} hits≈${count}`,
    );
  }
}

const failed = checks.filter((c) => !c.pass);
const summary = {
  startedAt,
  finishedAt: new Date().toISOString(),
  mode: dryRun ? 'dry-run' : 'strict',
  bases: { PE_BASE, ENGINE_BASE, RETRIEVAL_BASE },
  parcels,
  pass: failed.length === 0,
  failed: failed.map((c) => c.name),
  checks,
};

const outPath = process.env.SMOKE_OUT || OUT_DEFAULT;
try {
  writeFileSync(outPath, JSON.stringify(summary, null, 2));
  console.log(`\nWrote ${outPath}`);
} catch (err) {
  console.log(`\n(Could not write artifact: ${err.message})`);
}

console.log(
  `\nSummary: ${checks.length - failed.length}/${checks.length} pass` +
    (failed.length ? ` — FAILED: ${failed.map((c) => c.name).join(', ')}` : ' — ALL PASS'),
);

if (!dryRun && failed.length) process.exit(1);
