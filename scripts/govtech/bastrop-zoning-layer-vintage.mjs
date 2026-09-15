#!/usr/bin/env node
/**
 * bastrop-zoning-layer-vintage.mjs
 *
 * Does the zoning layer our code reads still get edited by the city?
 *
 * This is a MEANING shaped check, not a presence shaped one. It has two
 * independently derived inputs and asks whether they agree:
 *
 *   1. The layer URL the product actually reads, extracted from
 *      `smartcity-os` `server/routes/esri.ts` at a named git ref. Not typed
 *      here, so the instrument cannot drift away from the app.
 *   2. Every zoning-shaped feature service the City of Bastrop publishes in
 *      its own ArcGIS Online organisation, read live, with each layer's
 *      `editingInfo.lastEditDate` and feature count.
 *
 * It FAILS when the layer we read is not the most recently edited one the
 * city publishes. A single source cannot satisfy both halves: the city would
 * have to stop publishing a newer layer AND our code would have to point at
 * the newest one.
 *
 * ABSENT, ZERO and UNMEASURED are three different states here. A candidate
 * layer with no `editingInfo` is `unmeasured` — it is reported and it can
 * never be used to prove staleness, and it is never silently treated as old.
 * If the layer WE read is unmeasured, the run ABORTS rather than returning a
 * verdict it cannot support.
 *
 * Exit codes: 0 agree, 1 stale (a newer layer exists), 2 abort (cannot judge).
 *
 * Self-tests: `node bastrop-zoning-layer-vintage.test.mjs` — offline, both
 * directions, including an explicit not-vacuous case.
 */

import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const ORG_SERVICES_URL =
  'https://services7.arcgis.com/qOeXJdBtGknaCJC4/arcgis/rest/services';

/** Service names in the city's org that carry zoning-district geometry. */
export const CANDIDATE_LAYERS = [
  { service: 'PlaceTypesCharacterDistricts', layer: 1 },
  { service: 'Zoning_Place_Type', layer: 0 },
  { service: 'Zone_Types', layer: 25 },
  { service: 'Zoned_Parcels', layer: 83 },
];

/* ------------------------------------------------------------------ pure */

/**
 * Pull the zoning layer URL out of the product's own source text.
 * Returns null when the constant is absent, so a renamed constant ABORTS
 * instead of silently comparing nothing.
 */
export function extractReadUrl(sourceText, constName = 'BASTROP_ZONING_URL') {
  if (typeof sourceText !== 'string' || sourceText.length === 0) return null;
  const normalised = sourceText.replace(/\r\n/g, '\n');
  const re = new RegExp(`\\bconst\\s+${constName}\\s*=\\s*["']([^"']+)["']`);
  const m = normalised.match(re);
  return m ? m[1] : null;
}

/**
 * Decide, from the two derivations, whether they agree.
 *
 * @param {string|null} readUrl   the layer the product reads
 * @param {Array<{url:string,name:string,lastEditDate:number|null,count:number|null}>} layers
 * @returns {{verdict:'OK'|'STALE'|'ABORT', reason:string, inputs:number, newer:Array}}
 */
export function judge(readUrl, layers) {
  const inputs = Array.isArray(layers) ? layers.length : 0;

  // A check with no inputs is worse than no check. Abort, never pass.
  if (inputs === 0) {
    return { verdict: 'ABORT', reason: 'zero candidate layers resolved', inputs, newer: [] };
  }
  if (!readUrl) {
    return { verdict: 'ABORT', reason: 'could not extract the read URL from source', inputs, newer: [] };
  }

  const mine = layers.find((l) => l.url === readUrl);
  if (!mine) {
    return {
      verdict: 'ABORT',
      reason: `the URL the product reads (${readUrl}) is not among the candidate layers; the candidate list is stale`,
      inputs,
      newer: [],
    };
  }
  // unmeasured is not old. Refuse rather than guess.
  if (mine.lastEditDate === null || mine.lastEditDate === undefined) {
    return {
      verdict: 'ABORT',
      reason: 'the layer we read reports no editingInfo; its vintage is unmeasured, not old',
      inputs,
      newer: [],
    };
  }

  const newer = layers.filter(
    (l) =>
      l.url !== readUrl &&
      l.lastEditDate !== null &&
      l.lastEditDate !== undefined &&
      l.lastEditDate > mine.lastEditDate,
  );

  if (newer.length > 0) {
    return {
      verdict: 'STALE',
      reason: `${newer.length} layer(s) the city publishes were edited more recently than the one we read`,
      inputs,
      newer,
      mine,
    };
  }
  return { verdict: 'OK', reason: 'the layer we read is the most recently edited candidate', inputs, newer: [], mine };
}

export const iso = (ms) => (ms === null || ms === undefined ? 'unmeasured' : new Date(ms).toISOString().slice(0, 10));

/* ------------------------------------------------------------------- io */

async function fetchJson(url, timeoutMs = 45000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

async function readLayer({ service, layer }) {
  const url = `${ORG_SERVICES_URL}/${service}/FeatureServer/${layer}`;
  const meta = await fetchJson(`${url}?f=json`);
  if (meta && meta.error) throw new Error(meta.error.message || 'layer metadata error');
  let count = null;
  try {
    const c = await fetchJson(`${url}/query?where=1%3D1&returnCountOnly=true&f=json`);
    count = typeof c.count === 'number' ? c.count : null;
  } catch {
    count = null; // unmeasured, not zero
  }
  return {
    url,
    service,
    name: meta?.name ?? '(unnamed)',
    lastEditDate: meta?.editingInfo?.lastEditDate ?? null,
    count,
  };
}

function readSource(repoPath, ref, file) {
  const text = execFileSync('git', ['-C', repoPath, 'show', `${ref}:${file}`], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  const sha = execFileSync('git', ['-C', repoPath, 'rev-parse', ref], { encoding: 'utf8' }).trim();
  return { text, sha };
}

async function main() {
  const repoPath = process.env.SMARTCITY_OS_PATH || 'P:/smartcity-os';
  const ref = process.env.SMARTCITY_OS_REF || 'origin/main';
  const file = 'server/routes/esri.ts';

  let source;
  try {
    source = readSource(repoPath, ref, file);
  } catch (e) {
    console.error(`ABORT — cannot read ${file} from ${repoPath} @ ${ref}: ${e.message}`);
    process.exit(2);
  }

  const readUrl = extractReadUrl(source.text);

  console.log('bastrop-zoning-layer-vintage');
  console.log(`  snapshot: smartcity-os ${ref} ${source.sha.slice(0, 8)} :: ${file}`);
  console.log(`  read at:  ${new Date().toISOString()}`);
  console.log(`  product reads: ${readUrl ?? '(constant not found)'}`);
  console.log('');

  const layers = [];
  for (const c of CANDIDATE_LAYERS) {
    try {
      layers.push(await readLayer(c));
    } catch (e) {
      console.log(`  !! ${c.service}/${c.layer} unreadable: ${e.message}`);
    }
  }

  for (const l of layers.slice().sort((a, b) => (b.lastEditDate ?? -1) - (a.lastEditDate ?? -1))) {
    const marker = l.url === readUrl ? '<= WE READ THIS' : '';
    const count = l.count === null ? 'unmeasured' : String(l.count);
    console.log(`  ${iso(l.lastEditDate)}  ${String(count).padStart(6)}  ${l.service}/${l.name}  ${marker}`);
  }
  console.log('');

  const v = judge(readUrl, layers);
  console.log(`  inputs matched: ${v.inputs}`);
  console.log(`  verdict: ${v.verdict} — ${v.reason}`);

  if (v.verdict === 'ABORT') process.exit(2);
  if (v.verdict === 'STALE') process.exit(1);
  process.exit(0);
}

/**
 * Is this module being executed directly, rather than imported?
 *
 * Exported and unit-tested because the naive `file://${argv[1]}` form is
 * WRONG on Windows -- `pathToFileURL('P:\\a\\b.mjs')` is `file:///P:/a/b.mjs`,
 * three slashes and a drive letter, so the comparison silently failed, main()
 * never ran, and the script exited 0 having checked nothing. A verifier that
 * cannot run and reports success is the defect this whole file exists to
 * catch, so its own entry point gets a test.
 */
export function isDirectRun(argv1, importMetaUrl) {
  if (!argv1 || !importMetaUrl) return false;
  return pathToFileURL(argv1).href === importMetaUrl;
}

if (isDirectRun(process.argv[1], import.meta.url)) {
  main();
}
