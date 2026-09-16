/**
 * Produces `source-state.json` by RUNNING the product's own composers.
 *
 *   node dump-source-state.mjs --repo <path to a smartcity-dashboards checkout>
 *
 * It is not a transcription and it must never be hand-edited. Every row, count,
 * basis sentence and counting rule on the artboards comes from its output, so a
 * rename in the product breaks the board rather than quietly disagreeing with it.
 *
 * WHY THIS FILE EXISTS AND THE THREE EARLIER LENS FOLDERS HAVE NO EQUIVALENT.
 * `_design/README.md` says "Re-dump it rather than editing it" and the lanes that
 * shipped Public works, Parks and Fire and EMS left the dumper in a session
 * scratchpad that died with the session. An instruction to re-run something nobody
 * can re-run is a control whose executor is that a human remembers. This is the
 * executor.
 *
 * IT NEVER READS THE WORKING TREE. The checkout may sit on any branch — ours sat
 * on `g135-tenant-key-env-doc` while this design targets `origin/main` — and a
 * working tree is a proxy for the commit you meant, not the commit itself
 * (ENFORCEMENT, "read the authoritative record, never a proxy for it"). So this
 * EXTRACTS the named ref into a temporary directory with `git archive` and
 * imports from there. `node_modules` is borrowed from the checkout because
 * src/db.mjs imports `pg` at module load.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const argv = process.argv.slice(2);
const argOf = (name) => {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : undefined;
};
if (!argOf('--repo')) {
  console.error('usage: node dump-source-state.mjs --repo <path to smartcity-dashboards> [--ref origin/main]');
  console.error('The checkout must carry node_modules (pg) so src/city-pack.mjs can import db.mjs.');
  process.exit(2);
}
const REPO = path.resolve(argOf('--repo'));
const REF = argOf('--ref') || 'origin/main';

/** Extract the ref, so what is imported is the ref and not somebody's working tree. */
const git = (...a) => execFileSync('git', ['-C', REPO, ...a]).toString().trim();
const refSha = git('rev-parse', REF);
const TREE = path.join(os.tmpdir(), 'smartcity-police-lens-' + refSha.slice(0, 12));
fs.rmSync(TREE, { recursive: true, force: true });
fs.mkdirSync(TREE, { recursive: true });
const tar = execFileSync('git', ['-C', REPO, 'archive', '--format=tar', REF, 'src', 'package.json'], {
  maxBuffer: 64 * 1024 * 1024, encoding: 'buffer',
});
execFileSync('tar', ['-x', '-C', TREE], { input: tar });
const NM = path.join(REPO, 'node_modules');
if (!fs.existsSync(NM)) {
  console.error('no node_modules in ' + REPO + '; src/db.mjs imports pg at module load and this will fail.');
  process.exit(2);
}
fs.cpSync(NM, path.join(TREE, 'node_modules'), { recursive: true });

const srcUrl = (rel) => pathToFileURL(path.join(TREE, 'src', rel)).href;

const { composeDomainById, listDomains, DOMAIN_REGISTRY, getDomain } =
  await import(srcUrl('domains.mjs'));
const { TEMPLATE_CITY, EMPTY_CITY, BASTROP_TX } = await import(srcUrl('city-pack.mjs'));
const { DOMAIN_STATUSES, composeDomain } = await import(srcUrl('fixture-seam.mjs'));
const { ROSTER_LENS_IDS } = await import(srcUrl('staff-review.mjs'));
const adapters = await import(srcUrl('adapters.mjs'));
const cameras = await import(srcUrl('domains/police-cameras.mjs'));
const patrol = await import(srcUrl('domains/patrol-vehicles.mjs'));
const { SHELL_HOMES } = await import(srcUrl('shell-homes.mjs'));

const checkoutHead = git('rev-parse', 'HEAD');
const checkoutBranch = git('rev-parse', '--abbrev-ref', 'HEAD');
/** The files this design reads, pinned by blob hash so a later edit is detectable. */
const READ_FILES = [
  'src/domains.mjs', 'src/domains/patrol-vehicles.mjs', 'src/domains/police-cameras.mjs',
  'src/fixture-seam.mjs', 'src/adapters.mjs', 'src/city-pack.mjs', 'src/vendor-live.mjs',
  'src/server.mjs', 'src/shell-homes.mjs', 'src/lens-claims.test.mjs', 'src/domains.test.mjs',
  'web/index.html', 'web/app.js',
];
const blobs = Object.fromEntries(READ_FILES.map((f) => [f, git('rev-parse', `${REF}:${f}`)]));

/**
 * The product's OWN proving pack, copied from src/domains.test.mjs probePack().
 * Not invented here: the patrol module states "to watch it populate, add spireon
 * to a pack's fixtureGrants. Nothing else changes", and the test does exactly
 * that so the ungranted region is proven reachable rather than assumed reachable.
 */
const probePack = (fixtureGrants) => ({
  cityKey: 'probe-city', jurisdictionFips: null, displayName: 'Probe city',
  accessPolicy: 'public-free', environment: 'demo', generatesFixtures: true,
  lenses: [], grantedAdapters: [], fixtureGrants,
});

const slim = (r) => ({
  domainId: r.domainId, lensId: r.lensId, region: r.region, gatedBy: r.gatedBy,
  recordType: r.recordType, status: r.status, granted: r.granted, generated: r.generated,
  basis: r.basis, recordCount: r.recordCount, countingRule: r.countingRule,
  records: r.records, extras: r.extras,
});

const snapshot = {
  producedBy: 'lane g145b-police-lens, doc_repo, 2026-09-15',
  how: "the product's own composers, run directly against the checkout named below. Not a transcription. Re-dump rather than hand-edit.",
  repo: 'empressaioemail-tech/smartcity-dashboards',
  readFrom: REPO,
  ref: REF,
  commit: refSha,
  extractedTo: TREE,
  checkoutBranchAtDumpTime: checkoutBranch,
  checkoutHeadAtDumpTime: checkoutHead,
  checkoutNote:
    'the checkout was NOT on the ref this design reads; the ref was extracted with git archive and imported from there, so no working tree was read',
  readAt: new Date().toISOString(),
  blobs,
  packs: [
    'template-city (demo, generates, verkada granted / spireon deliberately not)',
    'empty-city (generates nothing, grants nothing)',
    'bastrop_tx (staging, generates nothing, seven live grants including spireon and NOT verkada)',
    'probe-city (the test\'s own throwaway pack, spireon granted, never shipped)',
  ],
};

const states = {
  DOMAIN_STATUSES,
  fifthState: 'not-registered',
  fifthStateBasis:
    'a domain absent from DOMAIN_REGISTRY has no entry in DOMAIN_STATUSES on purpose: absent from the registry means the surface does not exist, which is the only surviving meaning of Not built',
  liveStatus: 'unavailable',
  liveStatusBasis:
    'src/vendor-live.mjs returns status unavailable when a granted live route does not answer; it is not a fixture-seam status and does not appear in DOMAIN_STATUSES',
};

const vocab = {
  ROSTER_LENS_IDS,
  registry: listDomains(DOMAIN_REGISTRY),
  adapterKinds: adapters.ADAPTER_KINDS.map((k) => ({ id: k.id, displayName: k.displayName, writesTo: k.writesTo, notes: k.notes })),
  shellHomesPolice: SHELL_HOMES.filter((r) => /police/i.test(String(r.home)) || /police|camera/i.test(String(r.job))),
};

/** The two record shapes this lens draws, and the fields each declares it never carries. */
const shapes = {
  spireon: adapters.RECORD_SHAPES.spireon,
  verkada: adapters.RECORD_SHAPES.verkada,
  samsara: adapters.RECORD_SHAPES.samsara,
};

const axis = {
  VEHICLE_STATUS_VALUES: adapters.VEHICLE_STATUS_VALUES,
  DEVICE_STATUS_VALUES: adapters.DEVICE_STATUS_VALUES,
  OCCUPANCY_BANDS: cameras.OCCUPANCY_BANDS,
  CAMERA_FAMILIES: cameras.CAMERA_FAMILIES,
  SITE_COUNT: cameras.SITE_COUNT,
  CAMERA_FIXTURE_PLAN: cameras.CAMERA_FIXTURE_PLAN,
  PATROL_FIXTURE_PLAN: patrol.PATROL_FIXTURE_PLAN,
  PATROL_VOCABULARY: patrol.PATROL_VOCABULARY,
  OPERATOR_COUNT: patrol.OPERATOR_COUNT,
  OPERATOR_BASIS: patrol.OPERATOR_BASIS,
  CAMERA_IDENTITY_BASIS: cameras.CAMERA_IDENTITY_BASIS,
  NOT_AN_INVENTORY_NODE_BASIS: cameras.NOT_AN_INVENTORY_NODE_BASIS,
  EXCLUDED_FAMILIES_BASIS: cameras.EXCLUDED_FAMILIES_BASIS,
  formats: {
    PATROL_ID_FORMAT: String(patrol.PATROL_ID_FORMAT),
    UNIT_LABEL_FORMAT: String(patrol.UNIT_LABEL_FORMAT),
    OPERATOR_REF_FORMAT: String(patrol.OPERATOR_REF_FORMAT),
    CAMERA_ID_FORMAT: String(cameras.CAMERA_ID_FORMAT),
    DEVICE_LABEL_FORMAT: String(cameras.DEVICE_LABEL_FORMAT),
    SITE_REF_FORMAT: String(cameras.SITE_REF_FORMAT),
  },
};

/**
 * The grant picture, DERIVED rather than typed. It is what makes the Bastrop
 * board's two different no-fixture-source sentences checkable: the sentences
 * come from the composer and the reason they differ comes from here.
 */
const grants = {
  templateCityFixtureGrants: TEMPLATE_CITY.fixtureGrants,
  templateCityGrantedAdapters: TEMPLATE_CITY.grantedAdapters.map((g) => g.kind),
  emptyCityFixtureGrants: EMPTY_CITY.fixtureGrants,
  emptyCityGrantedAdapters: EMPTY_CITY.grantedAdapters.map((g) => g.kind),
  bastropFixtureGrants: BASTROP_TX.fixtureGrants,
  bastropGrantedAdapters: BASTROP_TX.grantedAdapters.map((g) => g.kind),
  countingRule:
    'fixtureGrants is the demonstration axis and connects nothing; grantedAdapters is the live-feed axis. A pack that generates may hold no grantedAdapters and a pack that grants generates nothing (assertCityPackShape, src/city-pack.mjs).',
};

/**
 * What the product SHIPS on this lens today, read out of the markup and the
 * client at this ref rather than remembered. The design is a proposed change to
 * some of it, and a proposal that cannot quote what it changes is a redraw.
 */
const indexHtml = git('show', `${REF}:web/index.html`);
const appJs = git('show', `${REF}:web/app.js`);
const policeSection = indexHtml.slice(
  indexHtml.indexOf('<section class="lens" id="lens-police">'),
  indexHtml.indexOf('<section class="lens" id="lens-fire-ems">'),
);
if (policeSection.length < 1000) throw new Error('could not slice the Police section out of web/index.html');
const textBetween = (re) => {
  const m = policeSection.match(re);
  return m ? m[1].replace(/\s+/g, ' ').replace(/&amp;/g, '&').trim() : null;
};
const headersAfter = (anchor) => {
  const i = policeSection.indexOf(anchor);
  if (i < 0) return null;
  const slice = policeSection.slice(i, i + 1400);
  const thead = slice.match(/<thead>[\s\S]*?<\/thead>/);
  return thead ? [...thead[0].matchAll(/<th scope="col">([^<]*)<\/th>/g)].map((m) => m[1]) : null;
};
const shipped = {
  lede: textBetween(/<p class="lede">([\s\S]*?)<\/p>/),
  cameraParagraph: textBetween(/id="police-cameras-head">[\s\S]*?<p>([\s\S]*?)<\/p>/),
  patrolParagraph: textBetween(/id="patrol-vehicles-head">[\s\S]*?<p>([\s\S]*?)<\/p>/),
  notBuiltParagraph: textBetween(/<span class="t">Not built on this lens<\/span>[\s\S]*?<p>([\s\S]*?)<\/p>/),
  notBuiltBasis: textBetween(/roster-list">[\s\S]*?<\/div>\s*<\/div>\s*<span class="basis">([\s\S]*?)<\/span>/),
  occupancyCaption: textBetween(/id="police-cameras-occupancy-rule">([^<]*)</),
  sitesCaption: textBetween(/id="police-cameras-sites-rule">([^<]*)</),
  cameraTableHeaders: headersAfter('id="police-cameras-records"'),
  siteTableHeaders: headersAfter('<span class="t">Sites</span>'),
  occupancyTableHeaders: headersAfter('<span class="t">Occupancy</span>'),
  patrolTableHeaders: headersAfter('id="patrol-vehicles-records"'),
  navBadge: (indexHtml.match(/data-lens="police"[^>]*>Police<span class="grow"><\/span><span class="badge">([^<]*)<\/span>/) || [])[1],
  lensBadgeMap: Object.fromEntries(
    [...(appJs.match(/const LENS_BADGE = \{[\s\S]*?\};/) || [''])[0]
      .matchAll(/["']?([a-z-]+)["']?: "([^"]+)"/g)].map((m) => [m[1], m[2]]),
  ),
  sourcedRuleTemplate: (appJs.match(/return `\$\{sourced\} of \$\{regions\.length\} \$\{noun\} sourced; ([^`]*)`/) || [])[1],
  regionKicker: Object.fromEntries(
    [...(appJs.match(/const REGION_KICKER = \{[\s\S]*?\};/) || [''])[0]
      .matchAll(/["']?([a-z-]+)["']?: "([^"]+)"/g)].map((m) => [m[1], m[2]]),
  ),
  patrolIsLiveWired: /"patrol-vehicles": \{ kind: "spireon"/.test(git('show', `${REF}:src/server.mjs`)),
  camerasAreLiveWired: /"police-cameras"/.test(git('show', `${REF}:src/server.mjs`)),
  verkadaOccurrencesInVendorLive: (git('show', `${REF}:src/vendor-live.mjs`).match(/verkada/gi) || []).length,
  spireonOccurrencesInVendorLive: (git('show', `${REF}:src/vendor-live.mjs`).match(/spireon/gi) || []).length,
  liveSpireonFields: (() => {
    const vl = git('show', `${REF}:src/vendor-live.mjs`);
    const fn = vl.slice(vl.indexOf('export function mapRealPatrolVehicleRecord'));
    const body = fn.slice(0, fn.indexOf('\n}\n'));
    return [...body.matchAll(/^\s{4}([a-zA-Z][a-zA-Z0-9]*):/gm)].map((m) => m[1]);
  })(),
  /** The vendor-reading record, verbatim, with its own date. Never re-run here. */
  vendorLiveVerifiedHeader: (() => {
    const vl = git('show', `${REF}:src/vendor-live.mjs`);
    const i = vl.indexOf('TWO OF FIVE ARE HONESTLY UNAVAILABLE TODAY');
    if (i < 0) return null;
    return vl.slice(i, vl.indexOf('*/', i)).replace(/\s+/g, ' ').trim();
  })(),
  vendorLiveVerifiedDate: (git('show', `${REF}:src/vendor-live.mjs`).match(/Live-verified\s*\n?\s*(\d{4}-\d{2}-\d{2})/) || [])[1] || null,
  /**
   * The one clause of that header this lens quotes. The full paragraph also
   * carries a vendor support email address, which is a third party's contact
   * detail and does not belong on a canvas a city sees.
   */
  vendorLiveSpireonClause: (() => {
    const vl = git('show', `${REF}:src/vendor-live.mjs`);
    const i = vl.indexOf('Live-verified');
    if (i < 0) return null;
    return vl.slice(i, vl.indexOf('FirstDue', i)).replace(/\s+/g, ' ').trim();
  })(),
  /**
   * Counted, not inferred. operatorRef is declared required:true on the spireon
   * record shape and appears ZERO times in the live mapper, and the live path
   * runs no shape guard, so nothing fails when the required field is absent.
   */
  operatorRefInVendorLive: (git('show', `${REF}:src/vendor-live.mjs`).match(/operatorRef/g) || []).length,
  operatorRefInPatrolDomain: (git('show', `${REF}:src/domains/patrol-vehicles.mjs`).match(/operatorRef/g) || []).length,
  assertRecordShapeInVendorLive: (git('show', `${REF}:src/vendor-live.mjs`).match(/assertRecordShape/g) || []).length,
  assertRecordShapeInFixtureSeam: (git('show', `${REF}:src/fixture-seam.mjs`).match(/assertRecordShape/g) || []).length,
};

/**
 * THE SENTENCE TEMPLATES, quoted from the source as templates.
 *
 * granted-empty is UNREACHABLE for both Police domains on any generated pack:
 * composeDomain only returns it when a granted generator returns zero records,
 * and both generators return a fixed non-empty plan. So the board quotes the
 * shape the product would produce rather than a sentence it has produced, with
 * the placeholders left visible. Rendering a filled-in granted-empty sentence
 * would be putting words in the product's mouth about a state it cannot reach.
 */
const seam = git('show', `${REF}:src/fixture-seam.mjs`);
const domainsSrc = git('show', `${REF}:src/domains.mjs`);
const vendorLive = git('show', `${REF}:src/vendor-live.mjs`);
const camerasSrc = git('show', `${REF}:src/domains/police-cameras.mjs`);
const grab = (src, re, label) => {
  const m = src.match(re);
  if (!m) throw new Error('template ' + label + ' did not extract; the source moved and this dump must not guess');
  return m[1].replace(/\s*\n\s*/g, ' ').trim();
};
const templates = {
  ungranted: grab(seam, /`(\$\{kindLabel\(domain\.gatedBy\)\} is not granted on[\s\S]*?has no source)`/, 'ungranted'),
  grantedEmpty: grab(seam, /`(\$\{kindLabel\(domain\.gatedBy\)\} is granted on[\s\S]*?records)`/, 'grantedEmpty'),
  notRegistered: grab(domainsSrc, /basis: `(\$\{domainId\} is not a registered domain[^`]*)`/, 'notRegistered'),
  liveGrantedEmpty: grab(vendorLive, /basis: `(\$\{base\.gatedBy\} is granted on[^`]*)`/, 'liveGrantedEmpty'),
  grantedEmptyReachability:
    'unreachable on a generated pack for both Police domains: CAMERA_FIXTURE_PLAN and PATROL_FIXTURE_PLAN each return a fixed non-empty set, so composeDomain can never take the zero-record branch. It is reachable only through the live path, which has its own sentence.',
  reportingStatuses: JSON.parse(
    grab(camerasSrc, /const REPORTING_STATUSES = (\[[^\]]*\]);/, 'reportingStatuses').replace(/'/g, '"'),
  ),
  reportingStatusesBasis: grab(camerasSrc, /\/\*\* (A status that is not reporting has no occupancy to band\.) \*\//, 'reportingStatusesBasis'),
};
for (const [k, v] of Object.entries(shipped)) {
  if (v === null || v === undefined) throw new Error('shipped.' + k + ' did not extract; the markup moved and this dump must not guess');
}

const out = {
  snapshot, states, vocab, shapes, axis, grants,
  demo: {
    cameras: slim(composeDomainById(TEMPLATE_CITY, 'police-cameras')),
    patrol: slim(composeDomainById(TEMPLATE_CITY, 'patrol-vehicles')),
  },
  unconnected: {
    cameras: slim(composeDomainById(EMPTY_CITY, 'police-cameras')),
    patrol: slim(composeDomainById(EMPTY_CITY, 'patrol-vehicles')),
  },
  staging: {
    cameras: slim(composeDomainById(BASTROP_TX, 'police-cameras')),
    patrol: slim(composeDomainById(BASTROP_TX, 'patrol-vehicles')),
  },
  /** The proving composition: the SAME domain, on a pack that grants spireon. */
  proving: {
    patrol: slim(composeDomain(probePack(['spireon']), getDomain('patrol-vehicles'))),
    basis:
      "src/domains.test.mjs grants spireon on a throwaway pack so the ungranted region is proven reachable rather than assumed reachable. Nothing else changes. This pack is never shipped and never served.",
  },
  /**
   * The fifth state, obtained the only way it can be: by asking for a domain the
   * registry does not carry. The id below is a PROBE and is never rendered on a
   * board — an invented domain id on a customer canvas is exactly what check.mjs
   * refuses, and it refuses this one by name.
   */
  notRegistered: {
    probeId: 'probe-unregistered-surface',
    onDemo: slim(composeDomainById(TEMPLATE_CITY, 'probe-unregistered-surface')),
    shippedJobs: ['Incident log', 'Regional operations map'],
    shippedBasis: shipped.notBuiltBasis,
    shippedJobsBasis:
      'copied from web/index.html at this ref: the two jobs the Police lens itself names as not regions on this product',
  },
  shipped, templates,
};

const OUT = new URL('./source-state.json', import.meta.url);
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log('wrote source-state.json from ' + REPO);
console.log('  ref ' + REF + ' @ ' + refSha + ' (checkout sat on ' + checkoutBranch + ' @ ' + checkoutHead + ', not read)');
console.log('  demo    cameras ' + out.demo.cameras.status + '/' + out.demo.cameras.recordCount +
  '  patrol ' + out.demo.patrol.status + '/' + out.demo.patrol.recordCount);
console.log('  staging cameras ' + out.staging.cameras.status + '  patrol ' + out.staging.patrol.status);
console.log('  proving patrol ' + out.proving.patrol.status + '/' + out.proving.patrol.recordCount);
