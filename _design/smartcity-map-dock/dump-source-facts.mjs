/**
 * Derive source-facts.json for the map dock design from the PRODUCT's own sources.
 *
 *   node dump-source-facts.mjs            # smartcity-dashboards at origin/main
 *   SMARTCITY_DASHBOARDS_PATH=x SMARTCITY_DASHBOARDS_REF=y node dump-source-facts.mjs
 *
 * WHY A DUMPER AND NOT A HAND-WRITTEN JSON. The design claims numbers only the product
 * can settle: how many layers the panel offers (52), how many are active by default (4),
 * and what the Development services tabs are called. If this lane typed both sides, a
 * typo in the facts file would silently agree with a typo on the board and check.mjs
 * would report success over two matching wrong numbers. Importing the product's own
 * modules makes the facts the product's OUTPUT, and check.mjs the third party comparing
 * them with the artboards.
 *
 * TWO SOURCES, TWO READ METHODS, EACH THE ONE THE SOURCE ITSELF CALLS FOR.
 *   src/property-map-catalog.mjs is a plain ESM module with no Node-only built-ins (its
 *   own header says so, for exactly this reason), so it is IMPORTED and the real exported
 *   values are read.
 *   src/staff-review.mjs is read as TEXT through the design-completion-gate's own exported
 *   extractors. Not a second parser: the gate already reads these exact constants for R4,
 *   and a second implementation of one rule is the CTRL-1 defect (DEV_PROCESS 2.4).
 *
 * BOTH ARE READ AT A REF, NOT FROM THE WORKING TREE. The first version imported the
 * checkout on disk while recording the commit of origin/main, so the commit it printed
 * was not the commit it read, and a lane worktree is routinely behind the ref under test.
 * `git show <ref>:<file>` gives the bytes and those bytes are what is used, so the
 * recorded commit describes the values by construction.
 *
 * ABORTS rather than writing a partial record: a facts file short a category would make
 * the category predicate vacuous, and a vacuous predicate is the Smart Files defect this
 * whole program is built to catch.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const REPO = process.env.SMARTCITY_DASHBOARDS_PATH || 'P:/smartcity-dashboards';
const REF = process.env.SMARTCITY_DASHBOARDS_REF || 'origin/main';
const CATALOG = 'src/property-map-catalog.mjs';
const NAV = 'src/staff-review.mjs';
const DOC_REPO = process.env.DOC_REPO_PATH || 'P:/doc_repo';

const abort = (msg) => {
  console.error('ABORT (map dock source facts): ' + msg);
  process.exit(2);
};

const git = (args) => execFileSync('git', ['-C', REPO, ...args], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });

let catalogText;
let navText;
let commit;
let navCommit;
try {
  commit = git(['rev-parse', REF]).trim();
  catalogText = git(['show', REF + ':' + CATALOG]);
  navCommit = git(['rev-parse', REF]).trim();
  navText = git(['show', REF + ':' + NAV]);
} catch (e) {
  abort('cannot read the product at ' + REF + ': ' + e.message);
}
if (!catalogText || catalogText.length < 500) abort('the catalog at ' + REF + ' is empty or truncated');
if (!navText || navText.length < 500) abort('the nav module at ' + REF + ' is empty or truncated');

/* ------------------------------------------------- the module, imported */
const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'g148-map-dock-')), 'property-map-catalog.mjs');
fs.writeFileSync(tmp, catalogText);
let mod;
try {
  mod = await import(pathToFileURL(tmp).href);
} catch (e) {
  abort('cannot import the catalog bytes read from ' + REF + ': ' + e.message);
} finally {
  fs.rmSync(path.dirname(tmp), { recursive: true, force: true });
}
const { LAYER_CATALOG, VIEW_TEMPLATES, DEFAULT_VISIBLE_LAYERS, getAllLayerKeys } = mod;

if (!Array.isArray(LAYER_CATALOG) || !LAYER_CATALOG.length) abort('LAYER_CATALOG did not resolve to a non-empty array');
if (!Array.isArray(VIEW_TEMPLATES) || !VIEW_TEMPLATES.length) abort('VIEW_TEMPLATES did not resolve to a non-empty array');
if (!Array.isArray(DEFAULT_VISIBLE_LAYERS) || !DEFAULT_VISIBLE_LAYERS.length) abort('DEFAULT_VISIBLE_LAYERS did not resolve');

// Names and keys are read explicitly per layer so a field that goes missing fails here
// rather than becoming an undefined inside a later comparison.
const categories = LAYER_CATALOG.map((c) => {
  const layers = c.layers || [];
  if (!c.id || !c.name) abort('a category resolved with no id or name');
  if (layers.some((l) => typeof l.name !== 'string' || !l.name.trim())) abort('a layer resolved with no name in ' + c.id);
  if (layers.some((l) => typeof l.key !== 'string' || !l.key.trim())) abort('a layer resolved with no key in ' + c.id);
  return {
    id: c.id,
    name: c.name,
    layerCount: layers.length,
    layerKeys: layers.map((l) => l.key),
    layerNames: layers.map((l) => l.name),
  };
});

const allKeys = getAllLayerKeys();
if (categories.some((c) => c.layerCount === 0)) abort('a category resolved with zero layers');
if (new Set(allKeys).size !== allKeys.length) abort('two layer keys collide, so a key cannot identify one layer');

// The absent category is declared in the module's own prose, not in the array:
// production composes permits/violations/heatmap through a different route and they are
// excluded, so LAYER_CATALOG carries no "overlays" entry. Reading the declared count off
// the prose is the honest way to know the design's "seven categories" is the product's
// own number rather than a design invention. It reads the bytes that came from the ref.
let declaredCategoryCount = null;
const cm = catalogText.match(/grouped into the same (\d+) categories/i) || catalogText.match(/the (\d+) layer categories/i);
if (cm) declaredCategoryCount = Number(cm[1]);
if (declaredCategoryCount === null) abort('the catalog no longer states its own category count in prose; re-read the module rather than defaulting');
if (declaredCategoryCount < categories.length) abort('the module declares fewer categories than it carries (' + declaredCategoryCount + ' < ' + categories.length + ')');

/* --------------------------------------------- the nav module, extracted */
let gate;
try {
  gate = await import(pathToFileURL(path.join(DOC_REPO, 'scripts', 'govtech', 'design-completion-gate.mjs')).href);
} catch (e) {
  abort('cannot import the design-completion-gate extractors from ' + DOC_REPO + ': ' + e.message);
}
if (typeof gate.extractSpreadArray !== 'function' || typeof gate.extractIdArray !== 'function') {
  abort('the gate no longer exports extractSpreadArray/extractIdArray; the nav facts would have to be parsed twice');
}

const lensIds = gate.extractSpreadArray(navText, 'ALL_LENS_IDS');
const navWorkIds = gate.extractIdArray(navText, 'WORK_IDS');
const navDsTabs = gate.extractIdArray(navText, 'DS_TABS');
if (!lensIds || !lensIds.length) abort('ALL_LENS_IDS did not resolve from the nav module');
if (!navWorkIds || !navWorkIds.length) abort('WORK_IDS did not resolve from the nav module');
if (!navDsTabs || !navDsTabs.length) abort('DS_TABS did not resolve from the nav module');

/** An exported `{ key: "Label" }` map, values in declaration order. Refuses a partial read. */
const labelMap = (text, name) => {
  const m = text.match(new RegExp(String.raw`export const ${name} = \{([\s\S]*?)\n\};`));
  if (!m) return null;
  const out = [];
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^\s*"?([A-Za-z0-9_-]+)"?:\s*"([^"]*)",?\s*$/);
    if (kv) out.push([kv[1], kv[2]]);
  }
  return out.length ? out : null;
};

const lensLabelPairs = labelMap(navText, 'LENS_LABELS');
const workLabelPairs = labelMap(navText, 'WORK_LABELS');
const tabLabelPairs = labelMap(navText, 'TAB_LABELS');
if (!lensLabelPairs) abort('LENS_LABELS did not resolve');
if (!workLabelPairs) abort('WORK_LABELS did not resolve');
if (!tabLabelPairs) abort('TAB_LABELS did not resolve');
const asMap = (pairs) => Object.fromEntries(pairs);
const lensLabels = asMap(lensLabelPairs);
const workLabels = asMap(workLabelPairs);
const tabLabels = asMap(tabLabelPairs);

const lensList = lensIds.map((id) => ({ id, label: lensLabels[id] || null }));
if (lensList.some((l) => !l.label)) abort('a lens id in ALL_LENS_IDS has no LENS_LABELS entry, so a nav row cannot be checked against it');
const dsTabList = navDsTabs.map((id) => ({ id, label: tabLabels[id] || null }));
if (dsTabList.some((t) => !t.label)) abort('a DS tab id has no TAB_LABELS entry, so a tab cannot be checked against it');
const workList = navWorkIds.map((id) => ({ id, label: workLabels[id] || null }));
if (workList.some((w) => !w.label)) abort('a work id has no WORK_LABELS entry');

const facts = {
  _purpose:
    'The product facts the SmartCity map dock artboards are checked against. Derived by ' +
    'dump-source-facts.mjs: the layer catalog is IMPORTED from the bytes of ' +
    'smartcity-dashboards/src/property-map-catalog.mjs at a git ref, and the nav constants are ' +
    'extracted from the bytes of src/staff-review.mjs at the same ref using the ' +
    'design-completion-gate\'s own extractors. Never typed by hand.',
  _source: {
    repo: REPO.replace(/\\/g, '/'),
    ref: REF,
    commit,
    catalogFile: CATALOG,
    navFile: NAV,
    navCommit,
    derivedBy: 'node dump-source-facts.mjs',
    derivedAt: new Date().toISOString(),
  },
  layerCount: allKeys.length,
  categoriesPresent: categories.length,
  categoriesDeclared: declaredCategoryCount,
  defaultVisibleCount: DEFAULT_VISIBLE_LAYERS.length,
  defaultVisibleKeys: DEFAULT_VISIBLE_LAYERS.slice(),
  viewTemplateCount: VIEW_TEMPLATES.length,
  categories,
  nav: {
    lenses: lensList,
    work: workList,
    dsTabs: dsTabList,
    lensLabelPairs,
    workLabelPairs,
    tabLabelPairs,
  },
};

fs.writeFileSync(new URL('./source-facts.json', import.meta.url), JSON.stringify(facts, null, 2) + '\n');
console.log(
  'wrote source-facts.json: ' + facts.layerCount + ' layers, ' + facts.categoriesPresent + ' categories present (' +
    facts.categoriesDeclared + ' declared), ' + facts.defaultVisibleCount + ' active by default, ' +
    facts.viewTemplateCount + ' view templates, ' + lensList.length + ' lenses, ' + dsTabList.length + ' DS tabs, at ' +
    REF + ' ' + commit.slice(0, 8),
);
