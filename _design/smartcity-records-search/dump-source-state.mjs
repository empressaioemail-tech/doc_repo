/**
 * G-147 / Records search — dump the source state this design is checked against.
 *
 *   node dump-source-state.mjs
 *
 * Writes `source-state.json`. Re-dump rather than hand-edit: every vocabulary
 * this design's check enforces is read out of the product here, so a product
 * rename shows up as a failing check rather than as a design that quietly
 * invented a word.
 *
 * BOTH INPUTS ARE READ AT A NAMED REF WITH `git show`. Neither is read from a
 * checkout: the dashboards working tree is parked on an unrelated commit, and
 * the smart-files tree carries an in-flight lane's edits. A design checked
 * against a neighbouring lane's half-saved tree is checked against nothing.
 *
 * The domain map is not transcribed. It is the product's own composer output:
 * the modules `src/domains.mjs`, `src/city-pack.mjs`, `src/staff-review.mjs` and
 * `src/shell-homes.mjs` are extracted from the ref file by file, following
 * their relative imports into a temp directory, and imported from there. So a
 * change to a domain's status string or to the nav's work list lands in
 * source-state.json without anyone editing this design.
 *
 * The dispatch names `smartcity-dashboards` `96fdafbb`; the gate read that ref.
 * The files this design's product claims rest on are asserted byte-identical
 * between `96fdafbb` and the ref dumped here, and the result is recorded rather
 * than assumed.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));

const DASH = process.env.SMARTCITY_DASHBOARDS_PATH || 'P:/smartcity-dashboards';
const FILES = process.env.SMART_FILES_PATH || 'P:/smart-files';
const DASH_REF = process.env.SMARTCITY_DASHBOARDS_REF || 'origin/main';
const FILES_REF = process.env.SMART_FILES_REF || 'origin/main';
const DISPATCH_DASH_REF = process.env.DISPATCH_DASHBOARDS_REF || '96fdafbb';

const git = (repo, args) =>
  execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

const gitShow = (repo, ref, p) => git(repo, ['show', `${ref}:${p}`]).replace(/\r\n/g, '\n');
const rev = (repo, ref) => git(repo, ['rev-parse', ref]).trim();

function abort(msg) {
  console.error(`ABORT — ${msg}`);
  process.exit(2);
}

/* ------------------------------------------------ dashboards: the named ref */

const dashSha = rev(DASH, DASH_REF);

/**
 * Extract the ref's module graph into a temp directory, following relative
 * imports, so the composer can be imported at the ref rather than at whatever
 * the checkout happens to be. Only `src/` modules are followed; anything that
 * would reach outside `src/` (npm packages, data files) is left to resolution.
 */
const refRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'g147-dash-'));

/**
 * `src/city-pack.mjs` reaches `src/db.mjs`, which imports `pg`. The composer
 * never opens a pool, but the import graph has to resolve, so the installed
 * driver is made visible to the temp tree through a directory junction rather
 * than by stubbing the module: a stub would be this design pretending to know
 * what the driver exports. If the dependency is not installed, the dump stops
 * and says so instead of inventing one.
 */
const modulesPath = path.join(DASH, 'node_modules');
if (!fs.existsSync(path.join(modulesPath, 'pg', 'package.json'))) {
  abort(
    `${DASH}/node_modules/pg is not installed. The ref's city-pack.mjs imports src/db.mjs, so the ` +
      `composer cannot be imported at the named ref without it. Install the dashboards dependencies ` +
      `(npm ci in the product repo, which this design does not run for you) and re-run.`,
  );
}
fs.symlinkSync(modulesPath, path.join(refRoot, 'node_modules'), 'junction');

const extracted = new Set();
function extractModule(rel) {
  if (extracted.has(rel)) return;
  extracted.add(rel);
  let src;
  try {
    src = gitShow(DASH, DASH_REF, rel);
  } catch {
    abort(`${DASH} has no ${rel} at ${DASH_REF}, so the composer cannot be imported at the named ref`);
  }
  const dest = path.join(refRoot, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, src);
  for (const m of src.matchAll(/from\s+"(\.{1,2}\/[^"]+\.mjs)"/g)) {
    extractModule(path.posix.normalize(path.posix.join(path.posix.dirname(rel), m[1])));
  }
}
for (const entry of [
  'src/domains.mjs',
  'src/city-pack.mjs',
  'src/staff-review.mjs',
  'src/shell-homes.mjs',
  'src/adapters.mjs',
  'src/fixture-seam.mjs',
]) {
  extractModule(entry);
}
const at = (rel) => pathToFileURL(path.join(refRoot, rel)).href;

const dispatchSha = rev(DASH, DISPATCH_DASH_REF);
/**
 * The files this design's product claims rest on. byte-identical at the ref the
 * dispatch names and at the ref dumped here is what lets one dump serve both.
 */
const NAMED_FILES = ['src/staff-review.mjs', 'src/shell-homes.mjs', 'web/index.html'];
const dispatchRefMatches = {};
for (const f of NAMED_FILES) {
  dispatchRefMatches[f] = gitShow(DASH, DISPATCH_DASH_REF, f) === gitShow(DASH, DASH_REF, f);
}

const sr = await import(at('src/staff-review.mjs'));
const sh = await import(at('src/shell-homes.mjs'));
const dom = await import(at('src/domains.mjs'));
const cp = await import(at('src/city-pack.mjs'));
const ad = await import(at('src/adapters.mjs'));
const seam = await import(at('src/fixture-seam.mjs'));

const bastropMap = dom.composeDomainMap(cp.BASTROP_TX);
const grantedKinds = [...new Set(cp.BASTROP_TX.grantedAdapters.map((g) => g.kind))].sort();

/* ----------------------------------------------------- the shipped stub text

Parsed out of web/index.html at the ref rather than restated, so a copy change in
the product makes the design's stub quotes go stale and fail the check.

TWO MARKERS, AND THEY ARE NOT THE SAME KIND OF THING. The product scopes the
stub with `id="work-records"`, which is a real product id and the thing this
design must keep drawing. The boards additionally carry
`data-lens-body="records"`, which is a DESIGN-side convention this folder
invents so its own check can scope its read past the nav's badges — parks,
police and fire already do it the same way. The dump records both so the
difference is written down rather than assumed.
*/
const indexHtml = gitShow(DASH, DASH_REF, 'web/index.html');
const line = (re, what, where = indexHtml) => {
  const m = where.match(re);
  if (!m) abort(`web/index.html no longer carries ${what}`);
  return m[1];
};

const stubStart = indexHtml.indexOf('id="work-records"');
if (stubStart < 0) abort('web/index.html no longer carries the Records search stub (id="work-records")');
const stubHtml = indexHtml.slice(stubStart, indexHtml.indexOf('</section>', stubStart));

const stub = {
  sectionId: 'work-records',
  /** The design's own scoping marker. Not a product attribute; see the note above. */
  designBodyMarker: 'data-lens-body="records"',
  heading: line(/<h1>([^<]*)<\/h1>/, 'the Records search heading', stubHtml),
  pill: line(/<span class="pill p-quiet">([^<]*)<\/span>/, 'the Records search pill', stubHtml),
  stateKey: line(/<span class="st-k">([^<]*)<\/span>/, 'the Records search state key', stubHtml),
  pageHeading: line(/<h2>([^<]*)<\/h2>/, 'the Records search stub heading', stubHtml),
  pageBody: line(/<p>([^<]*)<\/p>/, 'the Records search stub body', stubHtml),
  pageBasis: line(/<span class="basis">([^<]*)<\/span>/, 'the Records search stub basis', stubHtml),
  crumb: line(/<div class="crumb">[\s\S]*?<span>\/<\/span>\s*([^<]*)<\/div>/, 'the Records search crumb', stubHtml),
  topbarInputId: line(/id="(record-search)"/, 'the top-bar record search input'),
  topbarPlaceholder: line(/id="record-search"[^>]*placeholder="([^"]*)"/, 'the top-bar placeholder'),
  topbarAriaLabel: line(/id="record-search"[^>]*aria-label="([^"]*)"/, 'the top-bar aria-label'),
  topbarDisabled: /id="record-search"[^>]*\sdisabled/.test(indexHtml),
  topbarBadge: line(/id="record-search"[\s\S]{0,600}?<span class="badge-off">([^<]*)<\/span>/, 'the top-bar Not built badge'),
  topbarNoteId: line(/id="(record-search-note)"/, 'the top-bar note id'),
};

/* ------------------------------------------------------- smart-files, the ref */

const filesSha = rev(FILES, FILES_REF);
const sfStore = gitShow(FILES, FILES_REF, 'src/store.mjs');
const sfExtract = gitShow(FILES, FILES_REF, 'src/extract.mjs');
const sfIdentity = gitShow(FILES, FILES_REF, 'src/identity.mjs');

function stringArray(text, constName, what, { exported = true } = {}) {
  const m = text.match(new RegExp(`(?:export )?const ${constName} = \\[([\\s\\S]*?)\\];`));
  if (!m) abort(`smart-files no longer declares ${constName} (${what})`);
  const vals = [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
  if (!vals.length) abort(`smart-files declares ${constName} with no values (${what})`);
  if (exported && !new RegExp(`export const ${constName}`).test(text)) {
    abort(`${constName} is no longer exported (${what})`);
  }
  return vals;
}
function stringConst(text, constName, what) {
  const m = text.match(new RegExp(`(?:export )?const ${constName} =\\s*"([^"]+)"`));
  if (!m) abort(`smart-files no longer declares string const ${constName} (${what})`);
  return m[1];
}

const sf = {
  repo: 'smart-files',
  ref: FILES_REF,
  commit: filesSha,
  scopeTypes: stringArray(sfIdentity, 'SMART_FILE_SCOPE_TYPES', 'scope types'),
  accessPolicies: stringArray(sfIdentity, 'SMART_FILE_ACCESS_POLICIES', 'access policies'),
  provenanceSourceKinds: stringArray(sfIdentity, 'PROVENANCE_SOURCE_KINDS', 'provenance source kinds'),
  provenanceRequiredKeys: stringArray(sfIdentity, 'PROVENANCE_REQUIRED_STRING_KEYS', 'provenance required keys'),
  readRefusalCode: stringConst(sfIdentity, 'READ_REFUSAL_CODE', 'the read refusal code'),
  indexableContentTypes: stringArray(sfExtract, 'SEARCH_INDEXABLE_CONTENT_TYPES', 'indexable content types'),
  notIndexedReasons: stringArray(sfStore, 'NOT_INDEXED_REASONS', 'the named not-indexed reasons'),
  searchIndexStates: stringArray(sfStore, 'SEARCH_INDEX_STATES', 'the search index states'),
  /** Read with the non-exported allowlist: COUNTING_RULE is module-private on purpose. */
  countingRule: stringConst(sfStore, 'COUNTING_RULE', 'the document counting rule'),
  /**
   * The coverage counting rule, verbatim from emptyCoverage(). The boards' own
   * coverage line is compared against this, so the design cannot paraphrase the
   * denominator it is claiming.
   */
  coverageCountingRule: (() => {
    const m = sfStore.match(/export function emptyCoverage\(\)[\s\S]*?countingRule:\s*\n?\s*"([^"]+)"/);
    if (!m) abort('smart-files emptyCoverage() no longer states a countingRule');
    return m[1];
  })(),
  /**
   * The four keys of the coverage object, read out of emptyCoverage() rather
   * than restated. `reason-not-recorded` is here and is deliberately NOT in
   * NOT_INDEXED_REASONS: it is the state of a row whose reason was never
   * recorded, and the product's own CHECK constraint refuses it as a stored
   * reason. A design that let the two lists merge would be inventing a reason.
   */
  coverageReasonKeys: [
    ...(sfStore.match(/export function emptyCoverage\(\)[\s\S]*?byReason:\s*\{([\s\S]*?)\}/)?.[1] || '').matchAll(
      /"([^"]+)":\s*0/g,
    ),
  ].map((m) => m[1]),
  /** Every searchIndexBasis the read path can print, read out of searchability(). */
  searchIndexBases: [...sfStore.matchAll(/searchIndexBasis:\s*\n?\s*"([^"]+)"/g)].map((m) => m[1]),
  /** searchDocuments takes an explicit scope; a corpus read is never unscoped. */
  searchEntryPoint: 'searchDocuments(scopeType, scopeId, q)',
  searchSignature: (sfStore.match(/export async function searchDocuments\([^)]*\)/) || [''])[0].replace(/\s+/g, ' '),
};

if (sf.searchIndexStates.length !== sf.notIndexedReasons.length + 2) {
  abort(
    `smart-files declares ${sf.notIndexedReasons.length} reasons and ${sf.searchIndexStates.length} states; ` +
      `the design's arithmetic assumes reasons + indexed + reason-not-recorded`,
  );
}
if (!sf.coverageReasonKeys.includes('reason-not-recorded')) {
  abort('the coverage object no longer carries reason-not-recorded, so the not-recorded case is not countable');
}
if (sf.notIndexedReasons.includes('reason-not-recorded')) {
  abort('reason-not-recorded has entered NOT_INDEXED_REASONS; the design assumes it never can');
}

/* ----------------------------------------------------------------- the state */

const state = {
  snapshot: {
    producedBy: 'lane g147-record-search, doc_repo, 2026-09-18',
    how:
      'both inputs are read at a NAMED REF with `git show`; the dashboards modules are extracted from the ref ' +
      'file by file (following relative imports) into a temp dir and imported from there, so the domain map is ' +
      'the product\'s own composer output rather than a transcription. Re-dump rather than hand-edit.',
    displayRules:
      'every count on the boards is either the composer output recorded here or explicitly badged fixture; ' +
      'no figure is transcribed from prose',
    dashboards: {
      repo: 'empressaioemail-tech/smartcity-dashboards',
      ref: DASH_REF,
      commit: dashSha,
      dispatchRef: DISPATCH_DASH_REF,
      dispatchRefSha: dispatchSha,
      dispatchRefMatchesFor: dispatchRefMatches,
      dispatchRefAllMatch: Object.values(dispatchRefMatches).every(Boolean),
    },
    files: { repo: 'smart-files', ref: FILES_REF, commit: filesSha },
  },
  nav: {
    RECORDS_WORK: sr.RECORDS_WORK,
    WORK_IDS: sr.WORK_IDS,
    WORK_LABELS: sr.WORK_LABELS,
    recordsLabel: sr.WORK_LABELS[sr.RECORDS_WORK],
    ALL_LENS_IDS: sr.ALL_LENS_IDS,
    /**
     * Which work surfaces are iframe mounts of another product. Records search
     * is NOT one of them, and that is the load-bearing fact for its documents
     * leg: the corpus it must search lives behind a mounted product, so the read
     * crosses an origin rather than a function call.
     */
    MOUNT_WORK_IDS: sr.MOUNT_WORK_IDS,
    mountedWorkLabels: sr.MOUNT_WORK_IDS.map((id) => sr.WORK_LABELS[id]),
    smartFilesOrigin: sr.DEFAULT_SMART_FILES_ORIGIN,
    recordsIsMount: sr.MOUNT_WORK_IDS.includes(sr.RECORDS_WORK),
  },
  register: {
    DISPOSITIONS: sh.DISPOSITIONS,
    rows: sh.SHELL_HOMES.filter((r) => /document search|document table/i.test(r.job)).map((r) => ({
      table: r.table,
      job: r.job,
      home: r.home,
      disposition: r.disposition,
    })),
    countingRule: sh.SHELL_HOMES_COUNTING_RULE,
  },
  stub,
  domains: {
    statuses: seam.DOMAIN_STATUSES,
    fifthState: 'not-registered',
    fifthStateBasis:
      'a domain absent from DOMAIN_REGISTRY has no entry in DOMAIN_STATUSES on purpose: absent from the registry ' +
      'means the surface does not exist, which is the only surviving meaning of Not built',
    adapterKindIds: ad.ADAPTER_KINDS.map((k) => k.id),
    /** Emitted as `domainId` to match the composer's own key, rather than listDomains()' `id`. */
    registry: dom.listDomains().map((d) => ({
      domainId: d.id,
      lensId: d.lensId,
      region: d.region,
      gatedBy: d.gatedBy,
      recordType: d.recordType,
    })),
    regionCount: bastropMap.regionCount,
    /** The pack this design is drawn on, and what it actually grants. */
    pack: {
      cityKey: cp.BASTROP_TX.cityKey,
      displayName: cp.BASTROP_TX.displayName,
      environment: cp.BASTROP_TX.environment,
      grantedKinds,
    },
    /**
     * The composer's own answer for bastrop_tx. It is `no-fixture-source` for
     * every region BY DESIGN: this seam does not read a live feed, so the
     * fixture path cannot produce a Bastrop row. That is exactly why the board
     * quotes the composer's sentence and marks every RECORD COUNT as read live.
     */
    bastropMap: {
      withRecords: bastropMap.withRecords,
      countingRule: bastropMap.countingRule,
      regions: bastropMap.regions.map((r) => ({
        domainId: r.domainId,
        lensId: r.lensId,
        region: r.region,
        gatedBy: r.gatedBy,
        recordType: r.recordType,
        status: r.status,
        basis: r.basis,
      })),
    },
    /** A region whose gating adapter is granted on the pack. Counted, not asserted. */
    regionsWithGatingAdapterGranted: bastropMap.regions.filter((r) => grantedKinds.includes(r.gatedBy)).length,
    regionsWithoutGatingAdapterGranted: bastropMap.regions.filter((r) => !grantedKinds.includes(r.gatedBy)).length,
    /**
     * THE ONE FIELD EVERY CASE HAS. The finder needs an anchor it is entitled
     * to assume, and the product has already declared one: RECORD_ENVELOPE_FIELDS
     * makes recordId a required identifier on every record of every kind. Any
     * OTHER field the finder matches on is this design's decision rather than a
     * product guarantee, and is stated as a decision on the board.
     */
    recordEnvelopeRequired: ad.RECORD_ENVELOPE_FIELDS.filter((f) => f.required).map((f) => f.name),
    caseSearchAnchor: {
      field: 'recordId',
      basis:
        'RECORD_ENVELOPE_FIELDS declares recordId a required identifier on every record of every kind, ' +
        'so every case in every region is reachable by it without the finder assuming anything per region',
    },
  },
  documents: sf,
  /**
   * THE FINDER'S LEGS. Two, and each names the product surface it reads. A leg
   * is not a data source this design invents: `cases` is DOMAIN_REGISTRY and
   * `documents` is the Smart Files corpus, both named above.
   *
   * `parcels` is deliberately NOT a leg. A parcel is a place, not a record; the
   * place surface already exists and is designed elsewhere. The shipped
   * top-bar placeholder names three nouns and the third is the reason this is
   * written down rather than left to the reader.
   */
  /**
   * THE OUTCOME VOCABULARY, derived here rather than declared, so neither the
   * boards nor the check can widen it by being edited. Every word is a word the
   * product already says:
   *
   *   four   the composer's DOMAIN_STATUSES, the states a region can be in
   *   one    the read refusal code, the state a scope request can be in
   *   two    "searched" and "not-searched", which are the product's own two
   *          counts in emptyCoverage()'s countingRule
   *
   * A finder that could invent an outcome word could invent the sentence "we
   * searched everything", which is the one sentence this surface must not be
   * able to say when it has not.
   */
  derived: {
    outcomeVocabulary: [
      ...seam.DOMAIN_STATUSES,
      (() => {
        const m = sfIdentity.match(/export const READ_REFUSAL_CODE = "([^"]+)"/);
        if (!m) abort('smart-files no longer declares READ_REFUSAL_CODE');
        return m[1];
      })(),
      'searched',
      'not-searched',
    ],
    outcomeVocabularyBasis:
      'DOMAIN_STATUSES from src/fixture-seam.mjs, READ_REFUSAL_CODE from smart-files src/identity.mjs, ' +
      'and searched/not-searched from the two counts in smart-files emptyCoverage() countingRule',
  },
  legs: [
    {
      id: 'cases',
      label: 'Cases',
      reads: 'DOMAIN_REGISTRY, the regions the department lenses read',
      anchor: 'recordId, which RECORD_ENVELOPE_FIELDS makes required on every record of every kind',
      predicate:
        'the recordId of a case in a region whose gating adapter is granted on this pack; any further field ' +
        'the finder matches on is a DESIGN decision named on the board, not a product guarantee',
    },
    {
      id: 'documents',
      label: 'Documents',
      reads: 'the Smart Files corpus for this city tenant',
      predicate: 'the current version of a document whose search_text matches the query',
    },
  ],
  notALeg: {
    id: 'parcels',
    why:
      'a parcel is a place, not a record; the top-bar placeholder names three nouns and only two of them are records. ' +
      'Wiring the third is a place-lookup change and is named as an acceptance item, never changed quietly here',
  },
};

fs.writeFileSync(new URL('./source-state.json', import.meta.url), JSON.stringify(state, null, 2) + '\n');

console.log('wrote source-state.json');
console.log(`  dashboards ${DASH_REF} ${dashSha.slice(0, 8)} (dispatch ${DISPATCH_DASH_REF} ${dispatchSha.slice(0, 8)}, all named files match: ${state.snapshot.dashboards.dispatchRefAllMatch})`);
console.log(`  smart-files ${FILES_REF} ${filesSha.slice(0, 8)}`);
console.log(`  registered domains: ${state.domains.regionCount}; on bastrop_tx the gating adapter is granted for ${state.domains.regionsWithGatingAdapterGranted} and not granted for ${state.domains.regionsWithoutGatingAdapterGranted}`);
console.log(`  smart-files reasons: ${sf.notIndexedReasons.join(', ')}`);
console.log(`  smart-files states:  ${sf.searchIndexStates.join(', ')}`);
console.log(`  register rows:       ${state.register.rows.map((r) => `${r.job} -> ${r.home} (${r.disposition})`).join(' | ')}`);
