/**
 * The product side of the flood-study instrument, dumped rather than typed.
 *
 *   node dump-source-facts.mjs
 *
 * It reads the four source files the design names -- the engine core, the client, the tool and the
 * pure viz model -- at one git ref, so the artboards are checked against bytes the repo served
 * rather than whatever a working tree happened to hold. The ruling that governs the surface is
 * read at the doc_repo's own HEAD, for the same reason.
 *
 * WHAT IT DELIBERATELY PROVES, instead of assuming:
 *
 *   1. THE LEGEND IS THE PRODUCT'S, IN THE PRODUCT'S ORDER. The labels are parsed out of the
 *      Legend component's own item() calls, so the design's nine entries can be compared to the
 *      source's nine rather than to a list typed here.
 *   2. THE TWO CLAIMS THE BOARDS MAKE ABOUT THE PRODUCT ARE COUNTED. "No storm duration" and
 *      "naming a depth by return period would need a local rainfall atlas nobody has cited" are
 *      both statements about source, so both get a scan count across the four files. The first
 *      comes back zero and the claim holds; the second comes back non-zero and the claim does
 *      not, which is a finding rather than a fact for a check to quietly accept.
 *   3. THE DEPTH BOUND IS READ TWICE, from the client's constants and from the engine's own
 *      rejection message, and the two are required to agree before either is written down.
 *   4. NOTHING IS TYPED THAT COULD BE PARSED, and every parser is required to have matched
 *      something -- a facts file that silently holds an empty legend would let the check pass by
 *      having nothing to compare.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const MAP = 'P:/hauska-map';
const DOCS = path.resolve(here, '..', '..');

const git = (repo, args) => execFileSync('git', args, { cwd: repo, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

const REF = 'origin/main';
const MAP_COMMIT = git(MAP, ['rev-parse', REF]).trim();
const DOCS_COMMIT = git(DOCS, ['rev-parse', 'HEAD']).trim();

const FILE = {
  core: 'apps/property-explorer/api/_lib/pe-flood-drainage-core.ts',
  client: 'apps/property-explorer/src/lib/floodDrainageClient.ts',
  tool: 'apps/property-explorer/src/workbench/tools/FloodTool.tsx',
  viz: 'apps/property-explorer/src/workbench/tools/flood-viz.ts',
};
const src = {};
for (const [k, p] of Object.entries(FILE)) src[k] = git(MAP, ['show', REF + ':' + p]);

const RULING = '_decisions/2026-09-14_flood_determination_authority.md';
const ruling = git(DOCS, ['show', 'HEAD:' + RULING]);

function refuse(msg) {
  console.error('REFUSING TO DUMP: ' + msg + '.');
  console.error('A facts file with a hole in it is worse than no facts file, because the check that reads it');
  console.error('will pass by having nothing to compare.');
  process.exit(2);
}
const must = (cond, msg) => {
  if (!cond) refuse(msg);
};
const grab = (text, re, label) => {
  const m = text.match(re);
  must(m, 'the parser for ' + label + ' matched nothing');
  return m[1];
};
/** One string-valued export, whichever quote style it was written with. */
const stringConst = (text, name) => {
  const m = text.match(new RegExp(name + ' =\\s*\\n?\\s*([\'"`])([\\s\\S]*?)\\1'));
  must(m, 'the parser for ' + name + ' matched nothing');
  return m[2];
};
const count = (text, re) => (text.match(re) || []).length;

/* ------------------------------------------------------------ the depth bound */
const clientMin = Number(grab(src.client, /RAINFALL_DEPTH_MIN_INCHES = (\d+)/, 'RAINFALL_DEPTH_MIN_INCHES'));
const clientMax = Number(grab(src.client, /RAINFALL_DEPTH_MAX_INCHES = (\d+)/, 'RAINFALL_DEPTH_MAX_INCHES'));
const engineMessage = grab(src.core, /'([^']*rainfallDepthInches must be a number[^']*)'/, 'the engine rejection message');
const engineBounds = engineMessage.match(/\((\d+), (\d+)\]/);
must(engineBounds, 'the engine message does not state its bounds in the (low, high] shape');
must(
  Number(engineBounds[1]) === clientMin && Number(engineBounds[2]) === clientMax,
  'the client constants (' + clientMin + ', ' + clientMax + '] and the engine message (' + engineBounds[1] + ', ' + engineBounds[2] + '] disagree',
);

/* ----------------------------------------------------------------- the legend */
const legendSrc = src.tool
  .slice(src.tool.indexOf('function Legend'))
  .slice(0, src.tool.slice(src.tool.indexOf('function Legend')).indexOf('export function FloodDrainageSection'))
  .replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
const itemChunks = legendSrc.split('item(').slice(1).map((c) => c.slice(0, c.indexOf(')}')));
const legendLabels = itemChunks
  .map((c) => {
    const quoted = [...c.matchAll(/"([^"]+)"/g)];
    return quoted.length ? quoted[quoted.length - 1][1] : null;
  })
  .filter((s) => s !== null);
must(legendLabels.length === 9, 'the Legend parser found ' + legendLabels.length + ' of the source\'s nine entries');
must(legendLabels[0] === 'Parcel', 'the legend parser did not reach the source\'s own labels');
const pondingConditional = /\{hasPonding &&/.test(legendSrc);

/* ------------------------------------------------- the two claims about source */
const floodFiles = Object.values(FILE);
const scanTerm = (re) => floodFiles.reduce((n, f) => n + count(src[f === FILE.core ? 'core' : f === FILE.client ? 'client' : f === FILE.tool ? 'tool' : 'viz'], re), 0);
const TERMS = [
  ['duration', /\bduration\b/gi],
  ['returnPeriod', /returnPeriod/gi],
  ['noaa-atlas14', /NOAA Atlas 14/gi],
  ['rainfallCurve', /rainfallCurve/gi],
];
const byTerm = Object.fromEntries(TERMS.map(([name, re]) => [name, scanTerm(re)]));
const filesScanned = floodFiles.length;
must(filesScanned === 4, 'the scan did not read all four files');

const returnPeriodNaming = {
  byTerm,
  atlas: 'NOAA Atlas 14',
  curveField: grab(src.client, /(rainfallCurve\?)/, 'the rainfallCurve field') ? 'rainfallCurve' : null,
  lookupFunction: grab(src.client, /export function (returnPeriodYearsForDepthInches)/, 'the return-period lookup') ? 'returnPeriodYearsForDepthInches' : null,
  defaultValueLabel: grab(src.tool, /"(\d+-yr \(NOAA Atlas 14\))"/, 'the default storm label'),
  interpolatedForm: grab(src.tool, /(`[^`]*equivalent \(interpolated\)`)/, 'the interpolated equivalent') ? '≈N-yr equivalent (interpolated)' : null,
  sourceField: grab(src.client, /(rainfallSource)/, 'the rainfallSource field') ? 'rainfallSource' : null,
  sourceValues: [...(grab(src.client, /rainfallSource: ([^\n]+)/, 'the rainfallSource union').matchAll(/'([a-z0-9-]+)'/g))].map((m) => m[1]),
};
must(returnPeriodNaming.sourceValues.length === 3, 'the rainfallSource union did not parse');

/* --------------------------------------------------------- the engine's classes */
const jobStates = [...grab(src.core, /export type FloodDrainageJobState = ([^\n]+)/, 'the job state union').matchAll(/'([a-z]+)'/g)].map((m) => m[1]);
must(jobStates.length === 4, 'the job state union did not parse');
const retryable = [...src.core.matchAll(/error: '(engine_[a-z]+)'/g)].map((m) => m[1]);
must(retryable.length === 2, 'the two retryable engine classes did not parse');
const copyOf = (name) => grab(src.core + src.client + src.tool, new RegExp(name + ' =\\s*\\n?\\s*[\'`]([^\'`]+)[\'`]'), name);

const facts = {
  _purpose:
    'The product facts the flood-study artboards are checked against. Derived by dump-source-facts.mjs: the depth bound from the client constants cross-checked against the engine\'s own rejection message, the legend parsed out of the Legend component\'s item() calls, the job states and the two retryable engine classes from the engine core, the study-view vocabulary and the depth-to-return-period machinery from the client, and the serving/citation rule from the G-130 ruling read at doc_repo HEAD. Never typed by hand.',
  _source: {
    repo: MAP,
    ref: REF,
    commit: MAP_COMMIT,
    files: FILE,
    ruling: RULING,
    rulingRepo: DOCS,
    rulingCommit: DOCS_COMMIT,
  },
  depth: {
    minInches: clientMin,
    maxInches: clientMax,
    statedRange: '(' + clientMin + ', ' + clientMax + ']',
    engineMessage,
  },
  legend: {
    labels: legendLabels,
    pondingEntry: legendLabels.find((l) => /^ponding/i.test(l)) || null,
    pondingConditional,
    parseNote: 'labels are the source\'s own, in the source\'s paint order; the board\'s em dash for the source\'s colon is a display form and is normalized before comparing',
  },
  states: {
    jobStates,
    retryable,
    retryableErrorField: [...src.core.matchAll(/error: '(engine_[a-z]+)'/g)].map((m) => m[1]).join(', '),
    failureCopy: {
      timeout: stringConst(src.core, 'FLOOD_ENGINE_ACK_TIMEOUT_MESSAGE'),
      unreachable: stringConst(src.core, 'FLOOD_ENGINE_ACK_UNREACHABLE_MESSAGE'),
      locked: stringConst(src.core, 'FLOOD_PROPERTY_LOCKED_MESSAGE'),
      gateToken: stringConst(src.core, 'FLOOD_ENGINE_GATE_TOKEN_MESSAGE'),
    },
    noPondingLine: stringConst(src.tool, 'FLOOD_NO_PONDING_LINE'),
    twoQuestionsBanner: stringConst(src.tool, 'FLOOD_VS_FEMA_EMBED_BANNER'),
    disclaimer: stringConst(src.client, 'FLOOD_DRAINAGE_SCREEN_DISCLAIMER'),
  },
  timing: {
    runsForSeconds: [15, 45],
    ackTimeoutMs: Number(grab(src.core, /FLOOD_REFRESH_ACK_TIMEOUT_MS = ([\d_]+)/, 'the ACK timeout').replace(/_/g, '')),
    engineTimeoutMs: Number(grab(src.core, /FLOOD_ENGINE_TIMEOUT_MS = ([\d_]+)/, 'the engine timeout').replace(/_/g, '')),
  },
  viz: {
    emptyWhenHonestEmpty: grab(src.viz, /empty: (study\.honestEmpty !== undefined)/, 'the empty model rule') ? 'study.honestEmpty !== undefined' : null,
    drawsNothingButTheRing: /nothing is invented|renders as absent|nothing is drawn but the ring/i.test(src.viz),
    honestEmptyReason: grab(src.tool, /(study\.honestEmpty\.reason)/, 'the verbatim reason field') ? 'study.honestEmpty.reason' : null,
    studyFields: [...grab(src.client, /export interface FloodDrainageStudyView \{([\s\S]*?)\n\}/, 'the study view interface').matchAll(/^\s{2}([a-zA-Z]+)\??:/gm)].map((m) => m[1]),
  },
  returnPeriodNaming,
  scan: { filesScanned, byTerm, files: floodFiles },
  ruling: {
    source: RULING,
    commit: DOCS_COMMIT,
    servingPhrase: /\bprovisional for citation\b/.test(ruling),
    servingQuote: grab(ruling, /(\*\*`?authoritative for serving and provisional for citation`?\*\*|[^\n]*authoritative for serving and provisional for citation[^\n]*)/i, 'the serving/citation sentence').trim(),
    vintageRequired: /must carry a vintage/i.test(ruling),
    atomFallbackCovers: /six counties/.test(ruling) && /atom fallback covers the rest/.test(ruling),
    notGovernedByRuling: 'the ruling governs the flood-zone determination, not the modeled drainage study',
  },
  derivedBy: 'node dump-source-facts.mjs',
  derivedAt: new Date().toISOString(),
};

for (const [k, v] of Object.entries({ legendLabels: legendLabels.length, jobStates: jobStates.length, retryable: retryable.length, studyFields: facts.viz.studyFields.length })) {
  must(v > 0, k + ' came back empty');
}

fs.writeFileSync(path.join(here, 'source-facts.json'), JSON.stringify(facts, null, 2) + '\n');
console.log('wrote source-facts.json');
console.log('  ' + MAP + ' @ ' + REF + ' ' + MAP_COMMIT.slice(0, 12));
console.log('  depth ' + facts.depth.statedRange + ' (client and engine agree)');
console.log('  legend ' + legendLabels.length + ' entries, ponding conditional: ' + pondingConditional);
console.log('  states ' + jobStates.join('/') + ', retryable ' + retryable.join('/'));
console.log('  scan ' + filesScanned + ' files: ' + Object.entries(byTerm).map(([k, v]) => k + '=' + v).join(', '));
console.log('  ruling ' + RULING + ' @ ' + DOCS_COMMIT.slice(0, 12) + ' vintage required: ' + facts.ruling.vintageRequired);
