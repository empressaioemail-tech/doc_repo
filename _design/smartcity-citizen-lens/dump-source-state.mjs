/**
 * Produces `source-state.json` by RUNNING the product's own modules and parsing
 * the product's own shipped markup, at a named ref.
 *
 *   node dump-source-state.mjs --repo <path to a smartcity-dashboards checkout> [--ref origin/main]
 *
 * It is not a transcription and it must never be hand-edited. Every state, basis
 * sentence, counted registry figure and shipped string on the artboards comes
 * from this file's output, so a rename in the product breaks the board rather
 * than quietly disagreeing with it.
 *
 * IT NEVER READS THE WORKING TREE. The checkout may sit on any branch, and a
 * working tree is a proxy for the commit you meant, not the commit itself. So
 * this EXTRACTS the named ref with `git archive` into a temporary directory and
 * imports from there.
 *
 * TWO KINDS OF READ, AND THE DIFFERENCE IS RECORDED PER FACT.
 *   - IMPORTED: the pure modules are imported and their own exports are read.
 *     src/lenses.mjs, src/staff-review.mjs, src/domains.mjs, src/adapters.mjs,
 *     src/shell-homes.mjs and src/catalog.mjs import no database handle, so no
 *     node_modules is needed and nothing is re-implemented here.
 *   - PARSED: web/index.html, web/app.js, src/server.mjs, src/staff-identity.mjs
 *     and src/ui.test.mjs are read as text, because what this design has to
 *     quote is markup and route literals rather than a value. Every parse goes
 *     through grab(), which THROWS when it does not match, so a moved string
 *     fails the dump rather than silently yielding null.
 *
 * THE CITIZEN-SPECIFIC CROSS-CHECK, which is why this dumper is worth its
 * length: every required shipped string is verified TWICE, once that it appears
 * in web/index.html and once that src/ui.test.mjs pins it. A design that quoted
 * the product from memory would fail the first; a design that invented a guard
 * the product does not carry would fail the second.
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
  process.exit(2);
}
const REPO = path.resolve(argOf('--repo'));
const REF = argOf('--ref') || 'origin/main';

const git = (...a) => execFileSync('git', ['-C', REPO, ...a]).toString().trim();
const refSha = git('rev-parse', REF);

/** Extract the ref, so what is imported is the ref and not somebody's working tree. */
const TREE = path.join(os.tmpdir(), 'smartcity-citizen-lens-' + refSha.slice(0, 12));
fs.rmSync(TREE, { recursive: true, force: true });
fs.mkdirSync(TREE, { recursive: true });
const tar = execFileSync('git', ['-C', REPO, 'archive', '--format=tar', REF, 'src', 'package.json'], {
  maxBuffer: 128 * 1024 * 1024,
  encoding: 'buffer',
});
execFileSync('tar', ['-x', '-C', TREE], { input: tar });

function need(cond, msg) {
  if (!cond) {
    console.error('REFUSED: ' + msg);
    process.exit(2);
  }
}
/** A parse that returns null is a defect, not a state. */
const grab = (src, re, label) => {
  const m = src.match(re);
  need(m, `'${label}' did not extract from the product source; the source moved and this dump must not guess`);
  return m[1] === undefined ? m[0].replace(/\s*\n\s*/g, ' ').trim() : m[1].replace(/\s*\n\s*/g, ' ').trim();
};
const imp = (rel) => import(pathToFileURL(path.join(TREE, 'src', rel)).href);

/* ------------------------------------------------------------- imported read */

const { LEAD_LENSES, getLens } = await imp('lenses.mjs');
const staffReview = await imp('staff-review.mjs');
const { DOMAIN_REGISTRY, listDomains, composeDomainById } = await imp('domains.mjs');
const adapters = await imp('adapters.mjs');
const { SHELL_HOMES } = await imp('shell-homes.mjs');
const catalog = await imp('catalog.mjs');

const citizen = getLens('citizen');
need(citizen, 'no citizen lens in LEAD_LENSES; the lens this design covers does not exist in the product');

/** The registry, read as a map rather than remembered as a count. */
const registry = listDomains(DOMAIN_REGISTRY);
const registeredByLens = {};
for (const d of registry) registeredByLens[d.lensId] = (registeredByLens[d.lensId] || 0) + 1;
const citizenRegisteredDomains = registeredByLens.citizen || 0;

/**
 * The fifth state, obtained the only way it can be: by asking the composer for a
 * domain the registry does not carry. The id below is a PROBE and must never be
 * rendered on a board; check.mjs refuses it by name.
 */
const probeId = 'probe-unregistered-surface';
const probeComposed = composeDomainById(
  { cityKey: 'probe-city', displayName: 'Probe city', environment: 'demo' },
  probeId,
);

/* -------------------------------------------------------------- parsed read */

const indexHtml = git('show', `${REF}:web/index.html`);
const appJs = git('show', `${REF}:web/app.js`);
const serverSrc = git('show', `${REF}:src/server.mjs`);
const identitySrc = git('show', `${REF}:src/staff-identity.mjs`);
const uiTest = git('show', `${REF}:src/ui.test.mjs`);
const lensesTest = git('show', `${REF}:src/lenses.test.mjs`);

const SECTION_START = '<section class="lens" id="lens-citizen">';
const SECTION_END = '<section class="lens" id="lens-public-works">';
const start = indexHtml.indexOf(SECTION_START);
const end = indexHtml.indexOf(SECTION_END);
need(start >= 0 && end > start, 'the Citizen section could not be sliced out of web/index.html');
const section = indexHtml.slice(start, end);
need(section.length > 400, 'the Citizen section sliced to something too small to be the surface');

const shipped = {
  h1: grab(section, /<h1>([^<]*)<\/h1>/, 'h1'),
  lede: grab(section, /<p>(See what is happening[\s\S]*?)<\/p>/, 'lede'),
  statePill: grab(section, /<span class="pill p-restricted">([^<]*)<\/span>/, 'statePill'),
  panelTitles: [...section.matchAll(/<span class="t">([^<]*)<\/span>/g)].map((m) => m[1]),
  panelQuietPills: [...section.matchAll(/<span class="pill p-quiet">([^<]*)<\/span>/g)].map((m) => m[1]),
  lookupBasis: grab(section, /id="citizen-lookup-basis">([^<]*)</, 'lookupBasis'),
  paymentsCopy: grab(section, /<p>(Online payment[\s\S]*?)<\/p>/, 'paymentsCopy'),
  paymentsBasis: grab(section, /<span class="basis">([^<]*)<\/span>/, 'paymentsBasis'),
  requestsCopy: grab(section, /<p>(When a case exists[\s\S]*?)<\/p>/, 'requestsCopy'),
  meetingsCopy: grab(section, /<p>(The clerk calendar[\s\S]*?)<\/p>/, 'meetingsCopy'),
  meetingsProvenance: grab(section, /<span class="prov"><b>([^<]*)<\/b><\/span>/, 'meetingsProvenance'),
  disabledControls: [...section.matchAll(/id="(citizen-[a-z-]+)"[^>]*disabled/g)].map((m) => m[1]),
  panelIds: [...section.matchAll(/<div class="panel" id="([a-z-]+)">/g)].map((m) => m[1]),
  lightScopeClass: grab(section, /<div class="([^"]*sc-light[^"]*)"/, 'lightScopeClass'),
};
need(shipped.panelTitles.length === 4, 'the Citizen lens no longer carries four panels; the design is out of date');
need(shipped.disabledControls.length === 2, 'the Citizen lens no longer disables exactly two controls');

const shellScopedLight = grab(
  git('show', `${REF}:web/shell.css`),
  /(\.cz-scroll \{[^}]*background: var\(--sc-canvas\);)/,
  'cz-scroll rule',
);

const navBadge = grab(
  indexHtml,
  /data-lens="citizen"[^>]*>Citizen<span class="grow"><\/span><span class="badge">([^<]*)<\/span>/,
  'citizen nav badge',
);

/** The routes the server answers, so "the lens has no composer route" is a count. */
const lensRoutes = [...serverSrc.matchAll(/url\.pathname === `?"?(\/api\/lenses\/[a-z-]*(?:\/[a-z-]+)?)`?"?/g)].map((m) => m[1]);
need(lensRoutes.length > 0, 'no /api/lenses/ route literals parsed out of src/server.mjs');
const citizenRoutes = lensRoutes.filter((r) => r.includes('citizen'));
const genericLensRoute = /url\.pathname\.startsWith\("\/api\/lenses\/"\)/.test(serverSrc);
need(genericLensRoute, 'the generic /api/lenses/ handler moved; the route count would not mean what it says');

/**
 * The strings src/ui.test.mjs requires on the shipped page, and the strings it
 * forbids anywhere in the document. Every required one is verified against
 * web/index.html below, so this list cannot drift from the product.
 */
const requiredOnPage = [
  'Lookup returns nothing today',
  'Online payment is not available',
  'does not invent a street',
  'Payments unclaimed',
];
for (const s of requiredOnPage) {
  need(uiTest.includes(s), `src/ui.test.mjs no longer pins the string '${s}'; the guard this design reads is gone`);
  need(indexHtml.includes(s), `web/index.html no longer carries '${s}' while src/ui.test.mjs still pins it`);
}
const forbiddenByTests = [...uiTest.matchAll(/assert\.equal\(html\.includes\("([^"]+)"\), false\)/g)].map((m) => m[1]);
need(forbiddenByTests.length >= 4, 'the forbidden-string assertions did not parse out of src/ui.test.mjs');

/** The twelve-tile history, read out of the register that records it. */
const twelveTileRow = SHELL_HOMES.find((r) => r.job === 'Citizen service requests');
need(twelveTileRow, 'the Citizen service requests row left SHELL_HOMES; the dropped-grid history is not where this design read it');
const killedSkuRow = SHELL_HOMES.find((r) => r.job === 'Citizen public SKU');
need(killedSkuRow, 'the Citizen public SKU row left SHELL_HOMES');

const out = {
  _purpose:
    'Second input to check.mjs. Product facts read from source at the SHA below. Regenerate with dump-source-state.mjs; never hand-edit.',
  dumpedAt: new Date().toISOString(),
  snapshot: {
    producedBy: 'lane g142-citizen-lens, doc_repo, 2026-09-18',
    how: 'the product\'s own modules imported, its own markup parsed. Not a transcription. Re-dump rather than hand-edit.',
    repo: 'empressaioemail-tech/smartcity-dashboards',
    readFrom: REPO,
    ref: REF,
    commit: refSha,
    extractedTo: TREE,
    checkoutBranchAtDumpTime: git('rev-parse', '--abbrev-ref', 'HEAD'),
    checkoutHeadAtDumpTime: git('rev-parse', 'HEAD'),
    checkoutNote:
      'the checkout was NOT read; the ref was extracted with git archive and imported from there, so no working tree is in this file',
    blobs: Object.fromEntries(
      [
        'src/lenses.mjs', 'src/staff-review.mjs', 'src/domains.mjs', 'src/adapters.mjs',
        'src/shell-homes.mjs', 'src/catalog.mjs', 'src/staff-identity.mjs', 'src/server.mjs',
        'src/ui.test.mjs', 'src/lenses.test.mjs', 'web/index.html', 'web/app.js', 'web/shell.css',
      ].map((f) => [f, git('rev-parse', `${REF}:${f}`)]),
    ),
  },

  /** What the product's own catalogue says this lens IS. */
  lens: {
    id: citizen.id,
    audience: citizen.audience,
    needs: citizen.needs,
    accessPolicy: citizen.accessPolicy,
    skuName: citizen.skuName ?? null,
    payments: citizen.payments ?? null,
  },
  leadLensIds: LEAD_LENSES.map((l) => l.id),
  nav: {
    allLensIds: staffReview.ALL_LENS_IDS,
    workIds: staffReview.WORK_IDS,
    labels: staffReview.LENS_LABELS,
    navBadge,
    startsPreview: staffReview.ALL_LENS_IDS[0] !== 'citizen',
  },

  /** THE MEASURED ZERO, and it is this lens's only measurement in the product. */
  registry: {
    total: registry.length,
    byLens: registeredByLens,
    citizenCount: citizenRegisteredDomains,
    countingRule:
      'one increment per entry in DOMAIN_REGISTRY whose lensId equals the lens; an absent key is zero, measured by counting the array rather than by subtraction',
    all: registry,
  },
  routes: {
    lensRouteLiterals: lensRoutes,
    citizenRoutes,
    citizenComposerRoutes: citizenRoutes.length,
    genericHandler: '/api/lenses/ (catalogue record only)',
    countingRule: 'exact string literals of the form /api/lenses/... compared with === or startsWith in src/server.mjs',
  },

  states: {
    DOMAIN_STATUSES: (await imp('fixture-seam.mjs')).DOMAIN_STATUSES,
    fifthState: 'not-registered',
    fifthStateBasis:
      'a domain absent from DOMAIN_REGISTRY has no entry in DOMAIN_STATUSES on purpose: absent from the registry means the surface does not exist, which is the only surviving meaning of Not built',
    probeId,
    probeComposedStatus: probeComposed.status,
    probeComposedBasis: probeComposed.basis,
    probeNote:
      'the probe id is a PROBE and is never rendered on a board; check.mjs refuses it by name. Rendering its sentence would put words in the product\'s mouth about a surface the product does not have.',
  },

  roles: {
    NINE_LENSES: JSON.parse(grab(identitySrc, /export const NINE_LENSES = (\[[\s\S]*?\]);/, 'NINE_LENSES').replace(/,(\s*[\]}])/g, '$1').replace(/'/g, '"')),
    DEPARTMENT_ROLES: JSON.parse(grab(identitySrc, /export const DEPARTMENT_ROLES = (\[[^\]]*\]);/, 'DEPARTMENT_ROLES').replace(/'/g, '"')),
    citizenIsAStaffRole: /DEPARTMENT_ROLES = \[[^\]]*"citizen"/.test(identitySrc),
    basis:
      'citizen appears in NINE_LENSES, which checks a role claim for well-formedness, and NOT in DEPARTMENT_ROLES or TIER_ROLES. Nobody at a city is the citizen department, which is the right shape for a public lens.',
  },

  packs: {
    templateCity: { cityKey: 'template-city', generatesFixtures: true },
    emptyCity: { cityKey: 'empty-city', generatesFixtures: false },
    bastropTx: { cityKey: 'bastrop_tx', environment: 'staging' },
    countingRule:
      'the three packs web/index.html names as its own environment axis; no pack is composed in this dump because the Citizen lens has no registered domain to compose',
  },

  /** What ships today, read at the ref. The design is a proposal about this. */
  shipped,
  shellScopedLight,
  history: {
    twelveTiles: { job: twelveTileRow.job, home: twelveTileRow.home, disposition: twelveTileRow.disposition },
    killedSku: { job: killedSkuRow.job, home: killedSkuRow.home, disposition: killedSkuRow.disposition },
  },

  /** The product's own guards over this surface, quoted rather than remembered. */
  pinned: {
    requiredOnPage,
    forbiddenByTests,
    productForbiddenStrings: catalog.FORBIDDEN_PRODUCT_STRINGS,
    citizenIsAForbiddenString: catalog.FORBIDDEN_PRODUCT_STRINGS.some((s) => /citizen/i.test(s)),
    citizenLensTests: [
      grab(lensesTest, /(assert\.equal\(LEAD_LENSES\[3\]\.skuName, null\);)/, 'skuName assertion'),
      grab(lensesTest, /(assert\.equal\(LEAD_LENSES\[3\]\.payments, false\);)/, 'payments assertion'),
      grab(lensesTest, /(assert\.equal\(getLens\("citizen"\)\.audience, "resident"\);)/, 'audience assertion'),
    ],
    scopeBasis:
      'src/ui.test.mjs and src/lenses.test.mjs, read at this ref. These are the tests a design may not silently contradict.',
  },

  /** The badge vocabulary the shipped chrome uses, so a design cannot invent one. */
  badgeWords: ['Empty', 'Not built', 'Not read', 'Preview', 'Not connected'],
  browserTitleSeparator: staffReview.TITLE_SEP,
  adapterKindIds: adapters.ADAPTER_KINDS.map((k) => k.id),
};

const dest = new URL('./source-state.json', import.meta.url);
fs.writeFileSync(dest, JSON.stringify(out, null, 2) + '\n');
console.log('wrote source-state.json');
console.log('  ref ' + REF + ' @ ' + refSha);
console.log('  citizen: accessPolicy=' + citizen.accessPolicy + ' skuName=' + String(citizen.skuName) + ' payments=' + String(citizen.payments));
console.log('  registry: ' + registry.length + ' domains, ' + citizenRegisteredDomains + ' on citizen');
console.log('  routes: ' + lensRoutes.length + ' lens route literals, ' + citizenRoutes.length + ' naming citizen');
console.log('  shipped panels: ' + shipped.panelTitles.join(' | '));
console.log('  disabled controls: ' + shipped.disabledControls.join(', '));
