/**
 * Derive source-facts.json for the parallel-department-review design from the PRODUCT's own
 * sources and from the records that rule it.
 *
 *   node dump-source-facts.mjs
 *   PLAN_REVIEW_PATH=x PLAN_REVIEW_REF=y SMARTCITY_DASHBOARDS_PATH=z node dump-source-facts.mjs
 *
 * WHY A DUMPER AND NOT A HAND-WRITTEN JSON. The design claims things only other artifacts can
 * settle: that the seven department roles are the roster, that the nine lenses minus the two
 * non-departments are exactly those seven, that PR-2026-0418 carries thirteen findings numbered
 * one way, and that the product carries no department model. Typing any of those on both sides
 * would let a typo agree with a typo. Every one is READ, and where the design and the product
 * disagree the disagreement is the finding.
 *
 * FOUR SOURCES, EACH READ THE WAY THAT SOURCE IS READ.
 *
 *   P:\plan-review src/staff-identity.mjs is read at a ref as TEXT and its DEPARTMENT_ROLES
 *     pulled out with the design-completion-gate's own exported extractor. Not a second parser:
 *     the gate already reads id arrays off module text, and a second implementation of one rule
 *     is the CTRL-1 defect (DEV_PROCESS 2.4).
 *   P:\plan-review the whole tree at the same ref, grepped for the vocabulary of a department
 *     model, WITH THE FILE COUNT IT SCANNED. "There is no department model" is a negative, and a
 *     negative with no scan behind it is the vacuous predicate this program exists to catch.
 *   P:\smartcity-dashboards src/staff-review.mjs at a ref, for the lens roster the routing ruling
 *     makes the role vocabulary.
 *   _decisions/2026-09-14_staff_identity_and_department_rbac.md is PARSED, because the seven role
 *     names in prose are the ruling's own words and the design's department labels have to be
 *     theirs, not mine.
 *   _design/plan-review-reasoner/source-state.json is the sibling lane's product dump for the same
 *     product and the same submittal. Its finding numbering, its three citations and its notice
 *     partition are what "continues the reasoner" has to mean. Copied with its own ref and commit.
 *
 * ABORTS rather than writing a partial record, because a facts file missing its roster would make
 * the roster predicate vacuous -- the Smart Files defect.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const REPO = process.env.PLAN_REVIEW_PATH || 'P:/plan-review';
const REF = process.env.PLAN_REVIEW_REF || 'origin/main';
const DASH = process.env.SMARTCITY_DASHBOARDS_PATH || 'P:/smartcity-dashboards';
const DASH_REF = process.env.SMARTCITY_DASHBOARDS_REF || 'origin/main';
const DOC_REPO = process.env.DOC_REPO_PATH || 'P:/doc_repo';

const IDENTITY = 'src/staff-identity.mjs';
const NAV = 'src/staff-review.mjs';
const RULING = '_decisions/2026-09-14_staff_identity_and_department_rbac.md';
const REASONER = '_design/plan-review-reasoner/source-state.json';

const abort = (msg) => {
  console.error('ABORT (plan review departments source facts): ' + msg);
  process.exit(2);
};

const git = (repo, args, allowEmpty = false) => {
  try {
    return execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  } catch (err) {
    // grep exits 1 for "no matches", which is a RESULT here, not a failure.
    if (allowEmpty && err.status === 1) return '';
    throw err;
  }
};

/* ------------------------------------------------- the product's role model */

let commit;
let identityText;
try {
  commit = git(REPO, ['rev-parse', REF]).trim();
  identityText = git(REPO, ['show', REF + ':' + IDENTITY]);
} catch (e) {
  abort('cannot read ' + IDENTITY + ' from ' + REPO + ' at ' + REF + ': ' + e.message);
}
if (!identityText || identityText.length < 500) abort('the identity module at ' + REF + ' is empty or truncated');

let gate;
try {
  gate = await import(pathToFileURL(path.join(DOC_REPO, 'scripts', 'govtech', 'design-completion-gate.mjs')).href);
} catch (e) {
  abort('cannot import the design-completion-gate extractors: ' + e.message);
}
if (typeof gate.extractIdArray !== 'function') abort('the gate no longer exports extractIdArray; the role array would have to be parsed twice');

const departmentRoleIds = gate.extractIdArray(identityText, 'DEPARTMENT_ROLES');
if (!departmentRoleIds || departmentRoleIds.length !== 7) {
  abort('DEPARTMENT_ROLES did not resolve to seven ids (got ' + JSON.stringify(departmentRoleIds) + ')');
}

/* ------------------------------------------- the negative, WITH its scan */

const TERMS = ['department', 'discipline', 'routing', 'sign-off', 'signoff'];
const tree = git(REPO, ['ls-tree', '-r', '--name-only', REF]).split('\n').filter(Boolean);
if (!tree.length) abort('the tree at ' + REF + ' listed no files, so no negative can be supported');

const matchingFiles = [];
for (const term of TERMS) {
  const out = git(REPO, ['grep', '-in', '--', term, REF], true);
  for (const line of out.split('\n').filter(Boolean)) {
    const m = line.match(/^[^:]*?:(.*?):(\d+):(.*)$/);
    if (m) matchingFiles.push({ term, file: m[1], line: Number(m[2]), text: m[3].trim().slice(0, 200) });
    else matchingFiles.push({ term, file: '?', line: 0, text: line.trim().slice(0, 200) });
  }
}

/** A ROLE MODEL is a declared vocabulary of departments as data. Mentioning the word
    "department" in a comment is not one, and the design's claim is about a model. This is the
    reading the claim needs, and it is stated so a reader can disagree with it. */
const roleModelDeclarations = [...identityText.matchAll(/export const (DEPARTMENT_ROLES|TIER_ROLES)\s*=\s*[^;]+;/g)].map((m) => ({
  name: m[1],
  declaration: m[0].trim(),
  line: identityText.slice(0, m.index).split('\n').length,
}));
const departmentModelPresent = roleModelDeclarations.length > 0;

/* ------------------------------------------------------ the lens roster */

let navText;
let navCommit;
try {
  navCommit = git(DASH, ['rev-parse', DASH_REF]).trim();
  navText = git(DASH, ['show', DASH_REF + ':' + NAV]);
} catch (e) {
  abort('cannot read the lens roster from ' + DASH + ' at ' + DASH_REF + ': ' + e.message);
}
const lensIds = gate.extractSpreadArray(navText, 'ALL_LENS_IDS');
if (!lensIds || lensIds.length !== 9) abort('ALL_LENS_IDS did not resolve to nine lenses (got ' + JSON.stringify(lensIds) + ')');
const nonDepartmentLensIds = lensIds.filter((id) => !departmentRoleIds.includes(id));
if (nonDepartmentLensIds.length !== 2) {
  abort('the nine lenses minus the seven department roles is ' + nonDepartmentLensIds.length + ', not two: ' + JSON.stringify(nonDepartmentLensIds));
}

/* --------------------------------------------- the ruling's own role names */

const rulingPath = path.join(DOC_REPO, RULING);
if (!fs.existsSync(rulingPath)) abort('the routing ruling is not at ' + rulingPath);
const rulingText = fs.readFileSync(rulingPath, 'utf8');
const rolesSentence = rulingText.match(/the department roles are the \*\*seven\*\* that are:\s*([^.]*)\./i);
if (!rolesSentence) abort('the ruling no longer states its seven role names in prose; re-read it rather than defaulting');
const rulingRoleNames = rolesSentence[1].split(',').map((s) => s.replace(/\*\*/g, '').trim()).filter(Boolean);
if (rulingRoleNames.length !== 7) abort('the ruling prose yielded ' + rulingRoleNames.length + ' role names, not seven: ' + JSON.stringify(rulingRoleNames));
if (/\bEngineering\b/i.test(rulingText)) {
  // Named because the design says the product does not have it and Bastrop's budget does. If it
  // ever appears in the ruling this instrument's negative one line down has to be re-read.
  abort('the ruling now names Engineering, so the design\'s "no Engineering" claim must be re-derived rather than assumed');
}
const gateDeferral = rulingText.match(/Plan review\*\*\s*is gated\s*\n?\s*to ([^.]*)\./i) || rulingText.match(/gates Plan review to ([^.]*)\./i);

/* ------------------------------------------ the submittal the design continues */

const reasonerPath = path.join(DOC_REPO, REASONER);
if (!fs.existsSync(reasonerPath)) abort('the reasoner source state is not at ' + reasonerPath);
const R = JSON.parse(fs.readFileSync(reasonerPath, 'utf8'));
if (!Array.isArray(R.scope?.findings) || !R.scope.findings.length) abort('the reasoner state carries no findings');
if (!Array.isArray(R.scope.citationStrings) || R.scope.citationStrings.length !== 3) {
  abort('the reasoner state does not carry exactly three citation strings');
}
for (const [i, f] of R.scope.findings.entries()) {
  if (f.index !== i) abort('the reasoner findings are not contiguous from zero at ' + i + '; the numbering this file relies on would be wrong');
  if (!f.heading) abort('a reasoner finding has no heading');
}
const notice = R.scope.composer?.notice;
if (!notice) abort('the reasoner state carries no composed notice');
const partition = ['corrections', 'escalations', 'notEvaluated', 'heldBack'];
for (const k of partition) if (!Number.isInteger(notice[k])) abort('the reasoner notice has no integer ' + k);
if (partition.reduce((a, k) => a + notice[k], 0) !== notice.total) {
  abort('the reasoner notice partition does not sum to its own total');
}
if (R.scope.findings.length !== notice.total) abort('the reasoner findings and its notice total disagree');
if (!notice.headings || partition.some((k) => !notice.headings[k])) abort('the reasoner notice carries no heading strings');

const facts = {
  _purpose:
    'The product and record facts the parallel-department-review artboards are checked against. ' +
    'Derived by dump-source-facts.mjs: the role ids from plan-review/src/staff-identity.mjs at a ref ' +
    'through the design-completion-gate extractor, the lens roster from smartcity-dashboards/src/' +
    'staff-review.mjs at a ref, the seven role names parsed from the routing ruling, the department-model ' +
    'negative from a grep of the whole tree WITH its scan count, and the finding numbering, citations and ' +
    'notice partition from the plan-review-reasoner lane\'s own product dump. Never typed by hand.',
  _source: {
    repo: REPO.replace(/\\/g, '/'),
    ref: REF,
    commit,
    identityFile: IDENTITY,
    roleModelDeclarations,
    departmentModelPresent,
    scan: { filesScanned: tree.length, terms: TERMS, matches: matchingFiles, byTerm: Object.fromEntries(TERMS.map((t) => [t, matchingFiles.filter((m) => m.term === t).length])) },
    dashboards: { repo: DASH.replace(/\\/g, '/'), ref: DASH_REF, commit: navCommit, navFile: NAV },
    ruling: RULING,
    gate: gateDeferral ? gateDeferral[1].trim() : null,
    derivedBy: 'node dump-source-facts.mjs',
    derivedAt: new Date().toISOString(),
  },
  departmentRoleIds,
  departmentRoleNames: rulingRoleNames,
  lensIds,
  nonDepartmentLensIds,
  reasoner: {
    repo: R.repo || null,
    ref: R.ref,
    commit: R.commit,
    findings: R.scope.findings.map((f) => ({ number: f.index + 1, heading: f.heading, sectionId: f.sectionId || null, bookId: f.bookId || null, axis: f.axis })),
    citations: R.scope.citationStrings,
    determinations: R.source.determinations,
    absenceKinds: R.source.absenceKinds,
    books: R.source.books.map((b) => ({ bookId: b.bookId, title: b.title, quotable: b.quotable })),
    notice: { total: notice.total, corrections: notice.corrections, escalations: notice.escalations, notEvaluated: notice.notEvaluated, heldBack: notice.heldBack, headings: notice.headings },
  },
};

fs.writeFileSync(new URL('./source-facts.json', import.meta.url), JSON.stringify(facts, null, 2) + '\n');
console.log(
  'wrote source-facts.json: ' + departmentRoleIds.length + ' department role ids + ' + rulingRoleNames.length +
    ' ruling names, ' + lensIds.length + ' lenses (' + nonDepartmentLensIds.join(', ') + ' are not departments), ' +
    'department model present: ' + departmentModelPresent + ' (' + roleModelDeclarations.map((d) => d.name).join(', ') + '), ' +
    matchingFiles.length + ' department-term match(es) across ' + tree.length + ' files scanned, ' +
    R.scope.findings.length + ' reasoner findings, notice ' + notice.total + ' = ' +
    partition.map((k) => k + ' ' + notice[k]).join(' + ') + ', at ' + REF + ' ' + commit.slice(0, 8),
);
