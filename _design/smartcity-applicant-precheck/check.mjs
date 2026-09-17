/**
 * Adversarial read of the applicant precheck boards, as a file.
 *
 *   node gen.mjs && node check.mjs        verdict: exit 0 clean, 1 violations
 *   node violate.mjs                      plants one violation per rule, proves each fires
 *
 * Exit 2 means the instrument REFUSED to give a verdict (missing source, a
 * self-test that failed, or a rule that matched nothing). That is never a pass.
 *
 * TWO INPUTS. The boards (the .dc.html files gen.mjs writes) and
 * source-state.json (dump-source-state.mjs, read from plan-review 9149595f,
 * smartcity-dashboards f776b4bf and legacy-design-tools dca5ec2e). Rules R1,
 * R2, R3, R12 and R13 are meaning-shaped: one side comes from the canvas and
 * the other from product source, so the canvas alone cannot satisfy them.
 *
 * R4, R5 and R10 are INTERNAL CONSISTENCY across boards that one generator
 * wrote. They catch a hand edit or a transcription slip, and they cannot catch
 * a generator that is wrong in the same way everywhere. Labelled so here
 * rather than presented as more than they are.
 *
 * R6, R7, R8, R9 and R11 are refusals of a vocabulary. Each is paired with a
 * count of what it SCANNED, which must be non-zero, so "found nothing
 * forbidden" can never be satisfied by reading nothing. (A check shipped on
 * 2026-09-15 self-tested perfectly and matched nothing on any artboard.)
 */
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const BOARD_FILES = [
  'Flow.dc.html', 'Main.dc.html', 'Reading.dc.html', 'Findings.dc.html', 'Revised.dc.html',
  'Submit.dc.html', 'Summary.dc.html', 'Verify.dc.html', 'Review.dc.html', 'Setup.dc.html',
];

const ENTITIES = { '&middot;': '·', '&amp;': '&', '&#39;': "'", '&quot;': '"', '&mdash;': '—', '&rarr;': '→', '&times;': '×', '&#215;': '×', '&#183;': '·', '&#10003;': '✓', '&lt;': '<', '&gt;': '>' };
const decode = (s) => s.replace(/&[#a-z0-9]+;/gi, (e) => ENTITIES[e] ?? ' ');
const stripBlocks = (html, kinds) => kinds.reduce((h, k) => h.replace(new RegExp('<!--' + k + '-->[\\s\\S]*?<!--/' + k + '-->', 'g'), ' '), html);
const body = (html) => {
  const a = html.indexOf('</helmet>');
  return a >= 0 ? html.slice(a + 9) : html;
};
/** Visible text. `exclude` removes design notes and/or declared negations first. */
export function text(html, exclude = []) {
  return decode(stripBlocks(body(html), exclude).replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}
const all = (re, s) => [...s.matchAll(re)];
const audienceOf = (html) => (html.match(/data-audience="([^"]+)"/) || [])[1] || null;

const APPROVAL = /\b(approved?|approval|complies|compliant|compliance|passed|pass|permit issued)\b/i;
const PERSON = /\b[A-Z]\.\s?[A-Z][a-z]{2,}\b/;
const RETIRED = /citizen\s?connect|permitflow/i;
const CONFIDENCE = /\bconfiden\w*|\bscore\b|\b\d{1,3}(\.\d+)?\s?%\s*(sure|certain)/i;
const UDC_TOKEN = /\b\d{2}-\d{2}-\d{3}\b/g;
const IRC_TOKEN = /\bR\d{3}\.\d+\b/g;

/**
 * @param {Record<string,string>} boards  file name -> html
 * @param {object} S                       source-state.json
 * @returns {{findings: {rule:string, board:string, detail:string}[], counts: Record<string,number>}}
 */
export function checkBoards(boards, S) {
  const findings = [];
  const counts = {};
  const bump = (k, n = 1) => { counts[k] = (counts[k] || 0) + n; };
  const fail = (rule, board, detail) => findings.push({ rule, board, detail });

  const pr = S.planReview;
  const citeBy = Object.fromEntries(pr.citations.map((c) => [c.sectionNumber, c.text]));
  const udcSet = new Set(pr.bastropUdc.sections);
  const ircSet = new Set(pr.matrixRows.filter((r) => r.bookId === 'IRC').map((r) => r.sectionId));
  const absenceSet = new Set(pr.absenceKinds);
  const detSet = new Set(pr.determinations.map((d) => d.toLowerCase()));
  const stageSet = new Set(pr.engagementStages);

  const rowsOf = (html, attr) => all(new RegExp(attr + '="([^"]+)"', 'g'), html).map((m) => m[1]);
  const countsOf = (html, attr) => all(new RegExp(attr + '="([^"]+)" data-count="(\\d+)"', 'g'), html).map((m) => [m[1], Number(m[2])]);

  const summary = boards['Summary.dc.html'] || '';
  const main = boards['Main.dc.html'] || '';
  const denominator = rowsOf(main, 'data-preview').length;
  if (denominator === 0) fail('R4', 'Main.dc.html', 'the checklist preview lists no checks, so no count has a denominator');

  for (const [file, html] of Object.entries(boards)) {
    const aud = audienceOf(html);
    const visible = text(html);

    // R1 every citation element renders exactly the product's own string
    for (const m of all(/<span data-cite="([^"]+)"[^>]*>([^<]*)<\/span>/g, html)) {
      bump('R1');
      const [, sec, shown] = m;
      if (!udcSet.has(sec)) fail('R1', file, `data-cite="${sec}" is not a section in the BASTROP-UDC manifest`);
      else if (decode(shown).trim() !== citeBy[sec]) fail('R1', file, `citation for ${sec} reads "${decode(shown).trim()}", product renders "${citeBy[sec]}"`);
    }
    // R1 (plain text) wherever "Section <udc>" is printed, the whole product citation is printed around it
    for (const m of all(/Section (\d{2}-\d{2}-\d{3})/g, visible)) {
      const want = citeBy[m[1]];
      if (!want) continue; // R2 reports the unknown section
      bump('R1');
      const start = m.index - want.indexOf('Section ');
      if (visible.slice(start, start + want.length) !== want) fail('R1', file, `"Section ${m[1]}" is printed without the product's citation "${want}"`);
    }
    // R2 no section number the product does not hold, and no IRC citation without an edition
    for (const m of all(UDC_TOKEN, visible)) { bump('R2'); if (!udcSet.has(m[0])) fail('R2', file, `section ${m[0]} does not exist in the BASTROP-UDC manifest`); }
    for (const m of all(IRC_TOKEN, visible)) { bump('R2'); if (!ircSet.has(m[0])) fail('R2', file, `IRC section ${m[0]} is not one the product emits`); }
    for (const m of all(/data-cite="([^"]+)"/g, html)) if (/^R\d/.test(m[1])) fail('R2', file, `IRC section ${m[1]} is cited, and no IRC edition is declared`);
    // R3 absence states are the product's four kinds
    for (const v of rowsOf(html, 'data-absence')) { bump('R3'); if (!absenceSet.has(v)) fail('R3', file, `absence "${v}" is not one of ${[...absenceSet].join(', ')}`); }
    // R4 group counts tie to rows (internal consistency)
    const rows = rowsOf(html, 'data-group');
    const rowSrc = rows.length > 0 ? rows : rowsOf(summary, 'data-group');
    for (const [g, n] of countsOf(html, 'data-count-group')) {
      bump('R4');
      const have = rowSrc.filter((r) => r === g).length;
      if (have !== n) fail('R4', file, `count for ${g} says ${n}, ${rows.length > 0 ? 'this board' : 'the findings document'} lists ${have}`);
    }
    for (const m of all(/data-checklist-total="(\d+)"/g, html)) {
      bump('R4');
      if (Number(m[1]) !== denominator) fail('R4', file, `checklist total ${m[1]} differs from the ${denominator} checks previewed on Main`);
    }
    const changes = rowsOf(html, 'data-change');
    for (const [k, n] of countsOf(html, 'data-count-change')) {
      bump('R4');
      const have = changes.filter((c) => c === k).length;
      if (have !== n) fail('R4', file, `change count ${k} says ${n}, the table lists ${have}`);
    }
    for (const m of all(/data-change-total="(\d+)"/g, html)) {
      bump('R4');
      if (Number(m[1]) !== changes.length || changes.length !== denominator) fail('R4', file, `change total ${m[1]}, rows ${changes.length}, checklist ${denominator}`);
    }
    // R5 every AI reading names a sheet in the set and says what it is (internal consistency)
    const sheets = new Set(((html.match(/data-sheets="([^"]*)"/) || [])[1] || '').split(',').filter(Boolean));
    const ai = all(/<span data-provenance="ai-reading" data-sheet="([^"]+)"[^>]*>([^<]*)<\/span>/g, html);
    for (const m of ai) {
      bump('R5');
      if (!sheets.has(m[1])) fail('R5', file, `AI reading names sheet ${m[1]}, which is not in this board's set`);
      if (!/AI READING/.test(m[2]) || !m[2].includes(m[1])) fail('R5', file, `AI reading tag for ${m[1]} does not say what it is`);
    }
    if ((ai.length > 0 || sheets.size > 0) && !/by software|checked by a person/.test(visible)) fail('R5', file, 'shows readings from a plan set with no statement that software made them');
    // R6 applicant and public boards never say pass, approve or comply, outside a declared negation
    if (aud === 'applicant' || aud === 'public') {
      const t = text(html, ['note', 'neg']);
      bump('R6', t.length > 0 ? 1 : 0);
      const m = t.match(APPROVAL);
      if (m) fail('R6', file, `"${m[0]}" appears where an applicant reads it`);
      // R11 no confidence figure on an applicant surface
      bump('R11', t.length > 0 ? 1 : 0);
      const c = t.match(CONFIDENCE);
      if (c) fail('R11', file, `"${c[0]}" is a confidence claim on an applicant surface`);
      // R12 the applicant never sees the product's determinations
      for (const v of rowsOf(html, 'data-tag')) { bump('R12'); if (detSet.has(v.toLowerCase())) fail('R12', file, `applicant tag "${v}" is a product determination`); }
    }
    if (aud === 'staff') {
      for (const m of all(/data-tag="([^"]+)"/g, html)) if (/^[A-Z][a-z]+$/.test(m[1])) { bump('R12'); if (!detSet.has(m[1].toLowerCase())) fail('R12', file, `staff determination "${m[1]}" is not in the product vocabulary`); }
    }
    // R7 nobody named
    bump('R7', visible.length > 0 ? 1 : 0);
    const p = visible.match(PERSON);
    if (p) fail('R7', file, `"${p[0]}" reads as a named person`);
    // R8 retired product names, anywhere in the file
    bump('R8', html.length > 0 ? 1 : 0);
    const r = html.match(RETIRED);
    if (r) fail('R8', file, `retired name "${r[0]}"`);
    // R9 every board is badged fixture
    bump('R9');
    if (!/data-fixture="1"[^>]*>FIXTURE</.test(html)) fail('R9', file, 'no FIXTURE badge');
    // R10 the bypass exists and every open count agrees with the document (internal consistency)
    for (const m of all(/data-open-count="(\d+)"/g, html)) {
      bump('R10');
      const open = rowsOf(summary, 'data-group').filter((g) => g === 'suggest').length;
      if (Number(m[1]) !== open) fail('R10', file, `open count ${m[1]} differs from the ${open} suggestion(s) in the findings document`);
    }
    if (/data-action="submit-anyway"/.test(html)) bump('R10.bypass');
    // R13 decision stages are the product's engagement stages, all of them
    const stages = rowsOf(html, 'data-stage');
    if (stages.length > 0) {
      bump('R13', stages.length);
      for (const s of stages) if (!stageSet.has(s)) fail('R13', file, `stage "${s}" is not an engagement stage`);
      for (const s of stageSet) if (!stages.includes(s)) fail('R13', file, `engagement stage "${s}" is missing from the decision control`);
    }
  }
  if (!counts['R10.bypass']) fail('R10', '*', 'no board offers to apply with suggestions open');
  return { findings, counts };
}

export const RULES = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9', 'R10', 'R11', 'R12', 'R13'];

/* ------------------------------------------------------------ self-tests */

export function selfTest() {
  const S = {
    planReview: {
      citations: [{ sectionNumber: '14-02-003', text: 'Book Section 14-02-003 (ed)' }],
      bastropUdc: { sections: ['14-02-003'] },
      matrixRows: [{ sectionId: 'R302.1', bookId: 'IRC' }],
      absenceKinds: ['unchecked'],
      determinations: ['Pass', 'Fail', 'Uncertain', 'Unchecked'],
      engagementStages: ['Submitted', 'Denied'],
    },
  };
  const fx = '<span data-fixture="1" style="">FIXTURE</span>';
  const good = {
    'Main.dc.html': `</helmet><div data-audience="applicant">${fx}<div data-preview="a"></div><div data-preview="b"></div><b data-checklist-total="2">2</b>
      <p>${'<!--neg-->'}not an approval${'<!--/neg-->'}</p><span data-action="submit-anyway">Apply</span></div>`,
    'Summary.dc.html': `</helmet><div data-audience="applicant" data-sheets="A-1">${fx}<div data-count-group="suggest" data-count="1"></div>
      <div data-group="suggest"></div><div data-group="clear"></div><span data-cite="14-02-003" style="">Book Section 14-02-003 (ed)</span>
      <span data-provenance="ai-reading" data-sheet="A-1" style="">AI READING A-1</span> read by software. R302.1 <span data-absence="unchecked"></span>
      <span data-tag="SUGGESTION"></span><span data-open-count="1"></span></div>`,
    'Review.dc.html': `</helmet><div data-audience="staff">${fx}<span data-tag="Pass"></span><span data-stage="Submitted"></span><span data-stage="Denied"></span></div>`,
  };
  const base = checkBoards(good, S);
  if (base.findings.length) throw new Error('self-test: the clean fixture failed: ' + JSON.stringify(base.findings));
  const bad = [
    ['R1', 'Summary.dc.html', (h) => h.replace('(ed)</span>', '(other)</span>')],
    ['R1', 'Summary.dc.html', (h) => h.replace('R302.1', 'Bock Section 14-02-003 (ed)')],
    ['R2', 'Summary.dc.html', (h) => h.replace('R302.1', 'section 14-02-005')],
    ['R2', 'Summary.dc.html', (h) => h.replace('R302.1', 'R999.9')],
    ['R3', 'Summary.dc.html', (h) => h.replace('data-absence="unchecked"', 'data-absence="missing"')],
    ['R4', 'Summary.dc.html', (h) => h.replace('data-count="1"', 'data-count="2"')],
    ['R4', 'Main.dc.html', (h) => h.replace('data-checklist-total="2"', 'data-checklist-total="3"')],
    ['R5', 'Summary.dc.html', (h) => h.replace('data-sheet="A-1"', 'data-sheet="Z-9"')],
    ['R5', 'Summary.dc.html', (h) => h.replace('read by software', 'read')],
    ['R6', 'Main.dc.html', (h) => h.replace('</div>', 'Your plans are approved.</div>')],
    ['R7', 'Review.dc.html', (h) => h.replace('</div>', 'M. Leavis</div>')],
    ['R8', 'Main.dc.html', (h) => h.replace('</div>', 'CitizenConnect</div>')],
    ['R9', 'Review.dc.html', (h) => h.replace('data-fixture="1"', '')],
    ['R10', 'Summary.dc.html', (h) => h.replace('data-open-count="1"', 'data-open-count="0"')],
    ['R10', 'Main.dc.html', (h) => h.replace('data-action="submit-anyway"', '')],
    ['R11', 'Main.dc.html', (h) => h.replace('</div>', 'confidence 92%</div>')],
    ['R12', 'Summary.dc.html', (h) => h.replace('data-tag="SUGGESTION"', 'data-tag="Fail"')],
    ['R12', 'Review.dc.html', (h) => h.replace('data-tag="Pass"', 'data-tag="Maybe"')],
    ['R13', 'Review.dc.html', (h) => h.replace('<span data-stage="Denied"></span>', '')],
    ['R13', 'Review.dc.html', (h) => h.replace('data-stage="Denied"', 'data-stage="Closed"')],
  ];
  for (const [rule, file, mutate] of bad) {
    const b = { ...good, [file]: mutate(good[file]) };
    if (b[file] === good[file]) throw new Error(`self-test: the ${rule} mutation did not change ${file}`);
    const r = checkBoards(b, S);
    if (!r.findings.some((f) => f.rule === rule)) throw new Error(`self-test: ${rule} did not fire on its violation (${file})`);
  }
  return bad.length;
}

/* ------------------------------------------------------------ main */

function loadSource() {
  try {
    return JSON.parse(fs.readFileSync(new URL('./source-state.json', import.meta.url), 'utf8'));
  } catch {
    console.error('REFUSED: source-state.json is missing or unparsable. It is the second input; without it');
    console.error('nothing independent is compared. Re-dump it with dump-source-state.mjs.');
    process.exit(2);
  }
}
export function loadBoards() {
  const boards = {};
  for (const f of BOARD_FILES) {
    const u = new URL('./' + f, import.meta.url);
    if (!fs.existsSync(u)) { console.error('REFUSED: ' + f + ' is missing. Run node gen.mjs first.'); process.exit(2); }
    boards[f] = fs.readFileSync(u, 'utf8');
  }
  return boards;
}
export { loadSource };

const isMain = process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url;
if (isMain) {
  let n;
  try { n = selfTest(); } catch (e) { console.error('REFUSED: ' + e.message); process.exit(2); }
  const S = loadSource();
  const boards = loadBoards();
  const { findings, counts } = checkBoards(boards, S);
  console.log('check.mjs  (smartcity-applicant-precheck)');
  console.log('  source: plan-review ' + S.planReview.sha.slice(0, 8) + ', dashboards ' + S.dashboards.sha.slice(0, 8) + ', ldt ' + S.ldt.sha.slice(0, 8) + ' (dumped ' + S.dumpedAt + ')');
  console.log('  self-tests: ' + n + ' violations planted in a fixture, each caught; the clean fixture passes');
  const zero = RULES.filter((r) => !counts[r]);
  for (const r of RULES) console.log('  ' + r.padEnd(4) + ' matched ' + String(counts[r] || 0).padStart(4) + '   ' + (findings.filter((f) => f.rule === r).length ? 'FAIL' : 'ok'));
  if (zero.length) {
    console.error('REFUSED: rules matched nothing on the boards: ' + zero.join(', ') + '. A rule that reads nothing cannot pass.');
    process.exit(2);
  }
  if (findings.length) {
    for (const f of findings) console.error('  VIOLATION ' + f.rule + ' ' + f.board + ': ' + f.detail);
    console.error('verdict: ' + findings.length + ' violation(s)');
    process.exit(1);
  }
  console.log('verdict: clean across ' + BOARD_FILES.length + ' boards');
}
void fileURLToPath;
