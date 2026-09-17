/**
 * Dump the product facts this design is checked against, from source, into
 * source-state.json. check.mjs reads that file as its SECOND input; the
 * artboards are the first. Without this file there is nothing independent to
 * compare the canvas with, and check.mjs refuses to report.
 *
 *   node dump-source-state.mjs --plan-review <clone> --dashboards <clone> --ldt <clone>
 *
 * Each path must be a clone of the named repo at origin/main. The SHA of each
 * is recorded in the output, so the snapshot states what it was read against.
 * Never point this at a P:/<repo> working checkout: several are dirty or on a
 * feature branch, and a dump from one reads as source when it is not.
 *
 * WHAT IS READ, AND HOW
 *   plan-review  code-lookup.mjs and citation.mjs are pure modules, so they are
 *                IMPORTED rather than parsed. The expected citation strings are
 *                produced by the product's own renderCitationText(), so the
 *                canvas is compared with the product's output, not with a
 *                string somebody typed. matrixFromChain() is imported too and
 *                run on an empty chain, which yields the section ids and
 *                headings the product emits without any network call.
 *   dashboards   lenses.mjs is imported (pure). The Citizen lens basis sentence
 *                is read from web/index.html, because that is where it ships.
 *   ldt          the finding-engine category and severity tuples are parsed out
 *                of lib/finding-engine/src/types.ts with a regex, because it is
 *                TypeScript. The regex refuses if it matches nothing.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

function arg(name) {
  const i = process.argv.indexOf('--' + name);
  return i > 0 ? process.argv[i + 1] : null;
}
const PR = arg('plan-review');
const SD = arg('dashboards');
const LDT = arg('ldt');
if (!PR || !SD || !LDT) {
  console.error('usage: node dump-source-state.mjs --plan-review <clone> --dashboards <clone> --ldt <clone>');
  process.exit(2);
}

function head(dir) {
  const sha = execFileSync('git', ['-C', dir, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const date = execFileSync('git', ['-C', dir, 'log', '-1', '--format=%cI'], { encoding: 'utf8' }).trim();
  return { sha, committedAt: date };
}
function need(cond, msg) {
  if (!cond) {
    console.error('REFUSED: ' + msg);
    process.exit(2);
  }
}
const imp = (dir, rel) => import(pathToFileURL(path.join(dir, rel)).href);

/* ---------------------------------------------------------------- plan-review */
const codeLookup = await imp(PR, 'src/code-lookup.mjs');
const citation = await imp(PR, 'src/citation.mjs');
const mcp = await imp(PR, 'src/mcp.mjs');

const udc = codeLookup.CODE_BOOKS['BASTROP-UDC'];
need(udc && udc.sections, 'CODE_BOOKS["BASTROP-UDC"] not found; the manifest moved');
const udcSections = Object.keys(udc.sections);
need(udcSections.length > 0, 'BASTROP-UDC manifest has no sections');

const citations = udcSections.map((s) => ({
  bookId: udc.bookId,
  sectionNumber: s,
  editionId: udc.editionId,
  text: citation.renderCitationText(
    citation.buildCitation({ editionId: udc.editionId, bookId: udc.bookId, sectionNumber: s, title: udc.title }),
  ),
}));

// An empty chain: every row resolves to Unchecked with the product's own
// section id and heading. No network is touched; matrixFromChain is pure.
const rows = mcp.matrixFromChain('fixture:0', { data: { slots: {} } }, {});
need(Array.isArray(rows) && rows.length > 0, 'matrixFromChain returned no rows');

const foundation = fs.readFileSync(path.join(PR, 'sql/001_foundation.sql'), 'utf8');
const stageBlock = foundation.match(/plan_review_engagements_stage_check\s+CHECK \(stage IN \(([\s\S]*?)\)\)/);
need(stageBlock, 'engagement stage CHECK constraint not found in sql/001_foundation.sql');
const engagementStages = [...stageBlock[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
need(engagementStages.length > 0, 'engagement stage list parsed to nothing');

const books = Object.fromEntries(
  Object.entries(codeLookup.CODE_BOOKS).map(([k, b]) => [k, {
    bookId: b.bookId, editionId: b.editionId, title: b.title ?? null,
    quotable: b.quotable ?? null, sections: Object.keys(b.sections || {}),
  }]),
);

/* ---------------------------------------------------------------- dashboards */
const lenses = await imp(SD, 'src/lenses.mjs');
const citizen = lenses.LEAD_LENSES.find((l) => l.id === 'citizen');
need(citizen, 'no citizen lens in LEAD_LENSES');
const indexHtml = fs.readFileSync(path.join(SD, 'web/index.html'), 'utf8');
const basisMatch = indexHtml.match(/id="citizen-lookup-basis">([^<]+)</);
need(basisMatch, 'citizen lookup basis sentence not found in web/index.html');

const packSrc = fs.readFileSync(path.join(SD, 'src/city-pack.mjs'), 'utf8');
const packBlock = packSrc.match(/export const BASTROP_TX = \{([\s\S]*?)\n\};/);
need(packBlock, 'BASTROP_TX block not found in src/city-pack.mjs');
const packFields = [...packBlock[1].matchAll(/^\s{2}([a-zA-Z]+):/gm)].map((m) => m[1]);
need(packFields.length > 0, 'BASTROP_TX carries no parseable fields');

/* ---------------------------------------------------------------- ldt */
const typesTs = fs.readFileSync(path.join(LDT, 'lib/finding-engine/src/types.ts'), 'utf8');
function tuple(name) {
  const m = typesTs.match(new RegExp('export const ' + name + ' = \\[([\\s\\S]*?)\\] as const'));
  need(m, name + ' not found in finding-engine types.ts');
  const vals = [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
  need(vals.length > 0, name + ' parsed to nothing');
  return vals;
}

const out = {
  _purpose: 'Second input to check.mjs. Product facts read from source at the SHAs below. Regenerate with dump-source-state.mjs; never hand-edit.',
  dumpedAt: new Date().toISOString(),
  planReview: {
    repo: 'empressaioemail-tech/plan-review',
    ...head(PR),
    absenceKinds: Object.values(codeLookup.ABSENCE_KINDS),
    determinations: ['Pass', 'Fail', 'Uncertain', 'Unchecked'],
    engagementStages,
    availableEditions: codeLookup.AVAILABLE_EDITIONS.map((e) => e.editionId),
    books,
    bastropUdc: { bookId: udc.bookId, editionId: udc.editionId, title: udc.title, sections: udcSections },
    citations,
    matrixRows: rows.map((r) => ({ sectionId: r.sectionId, bookId: r.bookId, heading: r.heading, determination: r.determination, citation: r.citation })),
  },
  dashboards: {
    repo: 'empressaioemail-tech/smartcity-dashboards',
    ...head(SD),
    citizenLens: { id: citizen.id, audience: citizen.audience, accessPolicy: citizen.accessPolicy, skuName: citizen.skuName ?? null, payments: citizen.payments ?? null },
    citizenLookupBasis: basisMatch[1].trim(),
    bastropPackFields: packFields,
  },
  ldt: {
    repo: 'empressaioemail-tech/legacy-design-tools',
    ...head(LDT),
    findingCategories: tuple('FINDING_CATEGORY_VALUES'),
    findingSeverities: tuple('FINDING_SEVERITY_VALUES'),
    findingStatuses: tuple('FINDING_STATUS_VALUES'),
  },
};

const dest = new URL('./source-state.json', import.meta.url);
fs.writeFileSync(dest, JSON.stringify(out, null, 2) + '\n');
console.log('wrote source-state.json');
console.log('  plan-review ' + out.planReview.sha.slice(0, 8) + '  sections ' + udcSections.join(', ') + '  matrix rows ' + rows.length);
console.log('  dashboards  ' + out.dashboards.sha.slice(0, 8) + '  pack fields ' + packFields.join(', '));
console.log('  ldt         ' + out.ldt.sha.slice(0, 8) + '  categories ' + out.ldt.findingCategories.length);
