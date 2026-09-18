/**
 * Produces `source-state.json` by RUNNING the product's own composer.
 *
 *   node dump-source-state.mjs --repo <path to a plan-review checkout> [--ref origin/main]
 *
 * It is not a transcription and it must never be hand-edited. Every badge,
 * determination, count and provenance rung on the artboards is compared against
 * this file, so a rename or a registry change in the product breaks the boards
 * rather than quietly disagreeing with them.
 *
 * IT NEVER READS THE WORKING TREE. A checkout may sit on any branch; a working
 * tree is a proxy for the commit you meant, not the commit itself. So this
 * EXTRACTS the named ref with `git archive` and imports from there. Only `src/`
 * is extracted, and plan-review's `src/reasoner.mjs`, `src/code-lookup.mjs`,
 * `src/adjudication.mjs` and `src/mcp.mjs` are all pure at module load -- no
 * database driver, no environment variable, no network call -- so no
 * node_modules is borrowed and nothing here can reach a live service.
 *
 * WHY THIS FILE EXISTS. `_design/README.md` says to re-dump rather than edit the
 * state file, and the four earlier lens folders shipped without a dumper: the
 * instruction pointed at a session scratchpad that died with the session. An
 * instruction to re-run something nobody can re-run is a control whose executor
 * is that a human remembers.
 *
 * WHAT IT DOES NOT DO. It does not decide the design's 12-rule scope. That is a
 * DESIGN PREMISE, stated in the README's own "what does not exist" panel and
 * declared in `DESIGN_SCOPE` below so the composer can be run over it. The
 * distinction matters: the premise is typed, the composer's OUTPUT over the
 * premise is not, and the check has teeth on the second one. The scope is handed
 * to the product's composeReasoner() with determinations, and the guards inside
 * that module refuse any row whose determination source cannot support it --
 * which is how a permitted-use row drawn as Pass becomes a failure rather than a
 * difference of opinion.
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
  console.error('usage: node dump-source-state.mjs --repo <path to a plan-review checkout> [--ref origin/main]');
  console.error('Nothing is read from the checkout except its git objects; the ref is extracted first.');
  process.exit(2);
}
const REPO = path.resolve(argOf('--repo'));
const REF = argOf('--ref') || 'origin/main';

const git = (...a) => execFileSync('git', ['-C', REPO, ...a]).toString().trim();
const refSha = git('rev-parse', REF);
const TREE = path.join(os.tmpdir(), 'plan-review-reasoner-' + refSha.slice(0, 12));
fs.rmSync(TREE, { recursive: true, force: true });
fs.mkdirSync(TREE, { recursive: true });
const tar = execFileSync('git', ['-C', REPO, 'archive', '--format=tar', REF, 'src'], {
  maxBuffer: 64 * 1024 * 1024,
  encoding: 'buffer',
});
execFileSync('tar', ['-x', '-C', TREE], { input: tar });

const from = (rel) => pathToFileURL(path.join(TREE, 'src', rel)).href;
const {
  ADJUDICATORS,
  ADJUDICATOR_BADGE,
  PROVENANCE_RUNGS,
  PROVENANCE_UPGRADE,
  ReasonerContractError,
  adjudicatorFor,
  bodyPolicy,
  composeReasoner,
} = await import(from('reasoner.mjs'));
const { ABSENCE_KINDS, CODE_BOOKS } = await import(from('code-lookup.mjs'));
const { adjudicateMinimumSetback } = await import(from('adjudication.mjs'));
const { matrixFromChain } = await import(from('mcp.mjs'));

/* ------------------------------------------------------------------ source */

const books = Object.values(CODE_BOOKS).map((b) => ({
  bookId: b.bookId,
  title: b.title,
  editionId: b.editionId,
  publisher: b.publisher,
  quotable: b.quotable,
  sections: Object.keys(b.sections),
}));

const adjudicatorEntries = Object.entries(ADJUDICATORS).map(([key, a]) => ({
  key,
  ruleId: a.ruleId,
  label: a.label,
  dimension: a.dimension,
}));

const source = {
  books,
  bookTitles: books.map((b) => b.title),
  editionIds: books.map((b) => b.editionId),
  unquotableBooks: books.filter((b) => b.quotable !== true).map((b) => b.bookId),
  udcSectionIds: books.find((b) => b.bookId === 'BASTROP-UDC').sections,
  absenceKinds: Object.values(ABSENCE_KINDS),
  determinations: ['Pass', 'Fail', 'Uncertain', 'Unchecked'],
  badges: { live: ADJUDICATOR_BADGE.LIVE, none: ADJUDICATOR_BADGE.NONE },
  registrySize: adjudicatorEntries.length,
  adjudicators: adjudicatorEntries,
  adjudicatedSectionIds: adjudicatorEntries.map((a) => a.key.split(':')[1]),
  adjudicatedRuleIds: adjudicatorEntries.map((a) => a.ruleId),
  provenance: {
    rungs: Object.values(PROVENANCE_RUNGS).map((r) => r.rung),
    current: PROVENANCE_RUNGS.FORM_ASSERTION.rung,
    currentBasis: PROVENANCE_RUNGS.FORM_ASSERTION.basis,
    next: PROVENANCE_RUNGS.CAPTURED_READING.rung,
    nextBuilt: PROVENANCE_RUNGS.CAPTURED_READING.built === true,
    nextOwner: PROVENANCE_UPGRADE.owner,
    upgradeClaim: PROVENANCE_UPGRADE.claim,
  },
};

/* -------------------------------------------------------- the real matrix */

const CHAIN_EMPTY = { data: { status: 'ready', slots: {} } };
const CHAIN_UNREACHABLE = { error: 'fetch failed: ECONNREFUSED', data: { status: 'not_ready', slots: {} } };

function composerFor(findings, engagement = {}) {
  const r = composeReasoner({ findings, engagement });
  return {
    findings: r.findings.map((f) => ({
      ruleLabel: f.ruleLabel,
      sectionId: f.sectionId,
      bookId: f.bookId,
      determination: f.determination,
      determinationSource: f.determinationSource,
      adjudicator: f.adjudicator,
      badge: f.badge,
      citation: f.citation,
      citationState: f.citationState,
      citationOwed: f.citationOwed,
      absenceStatus: f.absence ? f.absence.status : null,
      provenanceRung: f.provenance ? f.provenance.rung : null,
      paraphrases: f.paraphrase !== null || f.bodyText !== null,
    })),
    notice: r.notice,
    coverage: {
      axis1Corpus: r.coverage.axis1Corpus,
      axis2Count: r.coverage.axis2Reasoning.count,
      reviewerRecorded: r.coverage.reviewerRecorded.count,
      wholeChain: r.coverage.wholeChain,
    },
    rowCountBeforeCollapse: r.rowCountBeforeCollapse,
  };
}

const live = {
  withoutInput: composerFor(matrixFromChain('48021-0001', CHAIN_EMPTY, {})),
  withInput: composerFor(matrixFromChain('48021-0001', CHAIN_EMPTY, { proposedSetbackFrontFt: 25 })),
  unreachable: composerFor(matrixFromChain('48021-0001', CHAIN_UNREACHABLE, {})),
};

/* -------------------------------------------------- the design's own scope
   Declared, per this file's header. 12 rules in scope for SF-1 and this use,
   plus the one a reviewer added. Nine of the twelve are corpus gaps, one is a
   reasoning gap (its section is cited and readable and no adjudicator exists),
   one was evaluated, one was escalated.

   The determinations below are NOT typed per row where a real path exists:
   the front setback's Fail is produced by adjudicateMinimumSetback() from the
   design's own drawn dimensions, every unadjudicated row is forced to Unchecked
   by composeReasoner's guard (a Pass there raises
   no_adjudicator_cannot_pass_or_fail), and the two reviewer rows carry the
   reviewer record composeReasoner requires before it will render Uncertain.
   The `axis` field is the coverage split and is the one genuinely typed thing
   here, because the two axes are a taxonomy decision, not a computation. */

const CITE_003 = 'City of Bastrop Building Block B3 Section 14-02-003 (bastrop_tx-bdc-2026-adopted)';
const CITE_008 = 'City of Bastrop Building Block B3 Section 14-02-008 (bastrop_tx-bdc-2026-adopted)';
const CITE_IBC = '2018 International Building Code Section 705.5 (IBC-2018)';

const corpusAbsence = (kind, basis) => ({ status: kind, basis, detail: null });
const NO_ADJ = 'Only the front setback has an adjudicator. This rule is drawn, not built.';

const frontSetback = adjudicateMinimumSetback({ requiredMinFt: 25, proposedFt: 22, label: 'front' });

const DESIGN_SCOPE = [
  { axis: 'evaluated', row: { sectionId: '14-02-003', bookId: 'BASTROP-UDC', sectionAtomId: 'did:hauska:code-section:bastrop_tx-bdc-2026-adopted/14-02-003', heading: 'Front setback', citation: CITE_003, determination: frontSetback.determination, absence: frontSetback.absence } },
  { axis: 'escalated', row: { sectionId: '705.5', bookId: 'IBC2018P6', sectionAtomId: 'did:hauska:code-section:icc-model-code/2018-international-building-code-6th-printing/705-5', heading: 'Fire separation distance', citation: CITE_IBC, determination: 'Uncertain', absence: null, overrideBy: 'M. Leavis', overrideReason: 'Two adopted authorities conflict for the west wall.', originalDetermination: 'Unchecked' } },
  { axis: 'corpus', row: { sectionId: null, bookId: null, heading: 'Side setback, west', citation: null, determination: 'Unchecked', absence: corpusAbsence(ABSENCE_KINDS.UNCHECKED, NO_ADJ) } },
  { axis: 'corpus', row: { sectionId: null, bookId: null, heading: 'Rear setback', citation: null, determination: 'Unchecked', absence: corpusAbsence(ABSENCE_KINDS.UNCHECKED, NO_ADJ) } },
  { axis: 'reasoning', row: { sectionId: '14-02-008', bookId: 'BASTROP-UDC', sectionAtomId: 'did:hauska:code-section:bastrop_tx-bdc-2026-adopted/14-02-008', heading: 'Permitted use', citation: CITE_008, determination: 'Unchecked', absence: corpusAbsence(ABSENCE_KINDS.UNCHECKED, 'Permitted use is not a numeric comparison, so there is nothing to adjudicate against. The corpus is fine; the reasoning does not exist yet.') } },
  { axis: 'heldBack', row: { sectionId: null, bookId: null, heading: 'Driveway width', citation: null, determination: 'Fail', absence: null, overrideBy: 'M. Leavis', overrideReason: 'Added from C-101. Cannot enter the letter until a section is supplied.', originalDetermination: 'Unchecked' } },
  /* the seven the console does not draw */
  { axis: 'corpus', row: { sectionId: null, bookId: null, heading: 'Fence height', citation: null, determination: 'Unchecked', absence: corpusAbsence(ABSENCE_KINDS.ABSENT_VERIFIED, 'Read the adopted edition and confirmed the section is not in it.') } },
  { axis: 'corpus', row: { sectionId: null, bookId: null, heading: 'Corner lot sight triangle', citation: null, determination: 'Unchecked', absence: corpusAbsence(ABSENCE_KINDS.ABSENT_VERIFIED, 'Read the adopted edition and confirmed the section is not in it.') } },
  { axis: 'corpus', row: { sectionId: null, bookId: null, heading: 'Tree preservation', citation: null, determination: 'Unchecked', absence: corpusAbsence(ABSENCE_KINDS.NOT_ENTITLED, 'Behind a licence this product does not hold.') } },
  { axis: 'corpus', row: { sectionId: null, bookId: null, heading: 'Drainage easement', citation: null, determination: 'Unchecked', absence: corpusAbsence(ABSENCE_KINDS.SOURCE_UNAVAILABLE, 'Ingested, but the body could not be retrieved on this run.') } },
  { axis: 'corpus', row: { sectionId: null, bookId: null, heading: 'Garage width', citation: null, determination: 'Unchecked', absence: corpusAbsence(ABSENCE_KINDS.UNCHECKED, NO_ADJ) } },
  { axis: 'corpus', row: { sectionId: null, bookId: null, heading: 'Accessory structure height', citation: null, determination: 'Unchecked', absence: corpusAbsence(ABSENCE_KINDS.UNCHECKED, NO_ADJ) } },
  { axis: 'corpus', row: { sectionId: null, bookId: null, heading: 'Parking spaces required', citation: null, determination: 'Unchecked', absence: corpusAbsence(ABSENCE_KINDS.UNCHECKED, NO_ADJ) } },
];

const scopeComposer = composerFor(DESIGN_SCOPE.map((s) => s.row), { proposedSetbackFrontFt: 22 });
const scopeAxes = DESIGN_SCOPE.reduce((acc, s) => {
  acc[s.axis] = (acc[s.axis] || 0) + 1;
  return acc;
}, {});

/* ------------------------------------------------------------- wrong way */

const wrongWay = {};
const capture = (key, fn) => {
  try {
    fn();
    wrongWay[key] = { threw: false, code: null, message: null };
  } catch (err) {
    wrongWay[key] = { threw: true, code: err.code || null, message: String(err.message).slice(0, 200) };
  }
};

capture('noAdjudicatorCannotPass', () =>
  composeReasoner({ findings: [{ sectionId: '14-02-008', bookId: 'BASTROP-UDC', citation: CITE_008, determination: 'Pass', absence: null }] }),
);
capture('machineUncertain', () =>
  composeReasoner({ findings: [{ sectionId: '14-02-008', bookId: 'BASTROP-UDC', citation: CITE_008, determination: 'Uncertain', absence: { status: 'unchecked', basis: 'x' } }] }),
);
capture('paraphraseOfUnquotableCode', () =>
  composeReasoner({ findings: [{ sectionId: '705.5', bookId: 'IBC2018P6', citation: CITE_IBC, determination: 'Unchecked', absence: { status: 'unchecked', basis: 'x' }, paraphrase: 'It requires a two hour rating.' }] }),
);
capture('absenceRequired', () =>
  composeReasoner({ findings: [{ sectionId: '14-02-008', bookId: 'BASTROP-UDC', citation: CITE_008, determination: 'Unchecked', absence: null }] }),
);

const REAR_FIXTURE = {
  ruleId: 'rear-setback',
  label: 'Rear setback',
  dimension: 'rear',
  fn: adjudicateMinimumSetback,
};
const badgeDefault = composeReasoner({ findings: DESIGN_SCOPE.map((s) => s.row) });
const badgeWithSecond = composeReasoner({
  findings: DESIGN_SCOPE.map((s) => s.row),
  registry: { ...ADJUDICATORS, 'BASTROP-UDC:14-02-008': REAR_FIXTURE },
});
wrongWay.secondAdjudicator = {
  defaultBadgeFor008: badgeDefault.findings.find((f) => f.sectionId === '14-02-008').badge,
  withSecondAdjudicatorBadgeFor008: badgeWithSecond.findings.find((f) => f.sectionId === '14-02-008').badge,
  defaultRegistrySize: badgeDefault.registry.size,
  withSecondRegistrySize: badgeWithSecond.registry.size,
  key: 'BASTROP-UDC:14-02-008',
};

/* ------------------------------------------------------------- assemble */

const out = {
  ref: REF,
  commit: refSha,
  dumpedAt: new Date().toISOString(),
  module: 'src/reasoner.mjs',
  source,
  live,
  scope: {
    premise:
      'The 12-rule scope is a design premise, declared in DESIGN_SCOPE inside dump-source-state.mjs. What is NOT typed is the composer output over it.',
    counts: scopeAxes,
    findings: DESIGN_SCOPE.map((s, i) => ({ index: i, axis: s.axis, heading: s.row.heading, sectionId: s.row.sectionId, bookId: s.row.bookId })),
    composer: scopeComposer,
    citationStrings: DESIGN_SCOPE.map((s) => s.row.citation).filter(Boolean),
  },
  wrongWay,
};

fs.writeFileSync(new URL('./source-state.json', import.meta.url), JSON.stringify(out, null, 2) + '\n');
console.log('dumped ' + REF + ' @ ' + refSha.slice(0, 12) + ' from ' + REPO);
console.log('registry=' + source.registrySize + ' books=' + source.books.length +
  ' udcSections=' + source.udcSectionIds.join(',') +
  ' scopeFindings=' + out.scope.findings.length +
  ' notice=' + JSON.stringify(scopeComposer.notice && {
    corrections: scopeComposer.notice.corrections,
    escalations: scopeComposer.notice.escalations,
    notEvaluated: scopeComposer.notice.notEvaluated,
    heldBack: scopeComposer.notice.heldBack,
    total: scopeComposer.notice.total,
  }));
