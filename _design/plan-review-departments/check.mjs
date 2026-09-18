/**
 * Adversarial read of the parallel-department-review artboards against the product and the
 * records that rule them.
 *
 *   node dump-source-facts.mjs && node check.mjs
 *
 * Non-zero exit on a violation. Exit 2 means the instrument REFUSED to report a verdict, which
 * is not the same as a pass and never renders as one.
 *
 * WHY IT IS SHAPED THIS WAY. A check shipped on 2026-09-15 that self-tested perfectly and matched
 * nothing on any board, because the canvas rendered display forms and the check looked for the
 * product's codes. It reported success and checked nothing. So:
 *
 *   1. EVERY PREDICATE REPORTS A COUNT of the inputs it matched, and the run refuses a verdict
 *      when a predicate that must have inputs has none.
 *   2. WHERE A RULE'S LEGITIMATE ANSWER IS "nothing found" it is paired with a count of what it
 *      SCANNED. This design's loading claim is a negative -- the product has no department model
 *      -- so the report carries the file count that negative was read across, and the check
 *      fails the claim outright if the product has since grown one.
 *   3. NOTHING IS COMPARED AGAINST ITSELF. One side of every predicate is an artboard; the other
 *      is source-facts.json, which is plan-review's own identity module read at a commit through
 *      the design-completion-gate's extractor, the lens roster from smartcity-dashboards at a
 *      commit, the seven role names PARSED from the routing ruling, and the sibling reasoner
 *      lane's own product dump for the same submittal.
 *
 * WHAT THIS FOUND ON THE SHIPPED BOARDS, NAMED AND NOT FIXED:
 *
 *   THE LOADING CLAIM IS NOW FALSE. The canvas annotation and the README both state that
 *   P:\plan-review has "no department model at all", and the canvas says it was "Confirmed by
 *   grep across src/ and web/". The product at origin/main declares DEPARTMENT_ROLES -- the same
 *   seven roles the ruling names -- in src/staff-identity.mjs. The design's roster is right; its
 *   stated source state is stale. (The rest of the claim survives: routing, discipline and
 *   sign-off still return nothing.) The predicate reads the stated position in BOTH directions,
 *   so a design that asserts a model the product does not carry fails too.
 *
 *   FINDING 13 IS NOT THE REASONER'S FINDING 13. The README says this design continues
 *   plan-review-reasoner with "same finding numbering", and finding 1, 2 and 6 do agree with it.
 *   Finding 13 is drawn as "Fire apparatus access"; the reasoner's numbering -- which the product
 *   composer produces -- puts "Parking spaces required" at 13 and carries no "Fire apparatus
 *   access" at any number.
 *
 *   THE LETTER LOSES THE HELD-BACK CLASS, twice over. The product partitions thirteen items into
 *   1 correction, 1 escalation, 10 not evaluated and 1 held back, and the last of those has its
 *   own heading because it cannot enter the letter. The letter renders three headings whose
 *   counts are 1, 2 and 10, so the held-back item is presented as an escalation; and the item
 *   itself -- finding 6, Driveway width, axis "heldBack" in the reasoner's dump -- is printed
 *   under the escalation heading. That also contradicts this design's own Conflict board, which
 *   lists "Holds the item out of the applicant's letter while it is open" among the things the
 *   product does.
 *
 * REPORTED AS A NOTE, NOT A VIOLATION: the determination on finding 6 differs between the two
 * designs -- the reasoner renders it Fail with no adjudicator, this design treats the two-department
 * conflict as Uncertain. The README argues that case explicitly, so it is an auditable divergence
 * rather than a defect, and the instrument says so instead of guessing.
 */
import fs from 'node:fs';

const here = new URL('.', import.meta.url);

let S;
try {
  S = JSON.parse(fs.readFileSync(new URL('./source-facts.json', import.meta.url), 'utf8'));
} catch {
  console.error('source-facts.json is missing or unparsable. It is the product side this file checks the');
  console.error('artboards against, and there is no second source without it. Re-dump it with');
  console.error('dump-source-facts.mjs rather than letting the check pass silently.');
  process.exit(2);
}

function refuse(msg) {
  console.error('REFUSING A VERDICT: ' + msg + '.');
  console.error('A facts file this file cannot trust is a facts file it must not check against. Re-dump it.');
  process.exit(2);
}

/* ------------------------------------------------------- the product side */

const ROLE_IDS = S.departmentRoleIds;
const ROLE_NAMES = S.departmentRoleNames;
const LENS_IDS = S.lensIds;
const NON_DEPT = S.nonDepartmentLensIds;
const DEPT_NAMES = new Set(ROLE_NAMES.concat(['Unrouted']));
const FINDINGS = S.reasoner.findings;
const CITATIONS = new Set(S.reasoner.citations);
const DETERMINATIONS = new Set(S.reasoner.determinations);
const NOTICE = S.reasoner.notice;
const SCAN = S._source.scan;
const MODEL = S._source.departmentModelPresent;

if (!Array.isArray(ROLE_IDS) || ROLE_IDS.length !== 7) refuse('the facts file does not carry seven department role ids');
if (!Array.isArray(ROLE_NAMES) || ROLE_NAMES.length !== 7) refuse('the facts file does not carry seven ruling role names');
if (!Array.isArray(LENS_IDS) || LENS_IDS.length !== 9) refuse('the facts file does not carry nine lenses');
if (LENS_IDS.length - ROLE_IDS.length !== NON_DEPT.length) refuse('the roster arithmetic in the facts file does not close');
if (!Array.isArray(FINDINGS) || FINDINGS.length !== NOTICE.total) refuse('the findings and the notice total disagree');
if (!Array.isArray(S.reasoner.citations) || S.reasoner.citations.length !== 3) refuse('the facts file does not carry three citations');
if (!(DETERMINATIONS.size >= 4)) refuse('the facts file does not carry the determination vocabulary');
if (!SCAN || !Number.isInteger(SCAN.filesScanned) || SCAN.filesScanned <= 0) refuse('the department-model negative carries no file scan, so it supports nothing');
if (!SCAN.byTerm || typeof SCAN.byTerm !== 'object') refuse('the scan does not report its matches per term');
if (!Number.isInteger(NOTICE.heldBack) || NOTICE.heldBack <= 0) refuse('the product notice carries no held-back class, so the partition rule has nothing to hold');

/** The product's non-zero notice classes as a multiset of counts. */
const PRODUCT_CLASS_COUNTS = ['corrections', 'escalations', 'notEvaluated', 'heldBack']
  .filter((k) => NOTICE[k] > 0)
  .map((k) => NOTICE[k])
  .sort((a, b) => a - b);

/* ------------------------------------------------------------- extractors */

const plainText = (html) =>
  html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&mdash;/g, ' ')
    .replace(/&middot;/g, ' ')
    .replace(/&Prime;/g, '"')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ');
const one = (re, s) => {
  const m = s.match(re);
  return m ? m[1] : null;
};

/* The department channel: a dot and a name. Never a badge. */
const DEPT_RE = /<span style="display:inline-flex; align-items:center; gap:5px; flex:none;"><span style="width:8px; height:8px; border-radius:var\(--sc-r-full\); background:var\(([^)]+)\);"><\/span><span style="font:400 12px\/16px var\(--sc-font-ui\); color:var\(--sc-ink-2\);">([^<]+)<\/span><\/span>/g;
/* The determination channel: a badge. Never a dot. */
const DET_RE = /<span style="flex:none; font:500 12px\/16px var\(--sc-font-data\); letter-spacing:\.05em; color:var\(--sc-[a-z0-9-]+\); background:var\(--sc-[a-z0-9-]+-wash\); border-radius:var\(--sc-r-control\); padding:1px 6px;">([^<]+)<\/span>/g;
const DOT_SIG = /width:8px; height:8px; border-radius:var\(--sc-r-full\)/;
const BADGE_SIG = /letter-spacing:\.05em; color:var\(--sc-[a-z0-9-]+\); background:var\(--sc-[a-z0-9-]+-wash\); border-radius:var\(--sc-r-control\); padding:1px 6px;/;

const DEPT_NAME_RE = /<span style="display:inline-flex; align-items:center; gap:5px; flex:none;"><span style="width:8px; height:8px; border-radius:var\(--sc-r-full\); background:var\([^)]+\);"><\/span><span style="font:400 12px\/16px var\(--sc-font-ui\); color:var\(--sc-ink-2\);">([^<]+)<\/span><\/span>/;
const DET_ONE_RE = /<span style="flex:none; font:500 12px\/16px var\(--sc-font-data\); letter-spacing:\.05em; color:var\(--sc-[a-z0-9-]+\); background:var\(--sc-[a-z0-9-]+-wash\); border-radius:var\(--sc-r-control\); padding:1px 6px;">([^<]+)<\/span>/;

const deptChannels = (html) => [...html.matchAll(DEPT_RE)].map((m) => ({ colour: m[1], name: m[2], at: m.index }));
const detBadges = (html) => [...html.matchAll(DET_RE)].map((m) => m[1]);

/** No one span may carry both channels, or a red dot beside a Fail reads as one fact. */
const dualChannelFaults = (html) => {
  const out = [];
  for (const m of html.matchAll(/<span style="([^"]*)"/g)) {
    if (DOT_SIG.test(m[1]) && BADGE_SIG.test(m[1])) out.push('a span carries both the department dot and the determination badge: ' + m[1].slice(0, 90));
  }
  return out;
};

const LETTER_ROW_SPLIT = '<div style="display:flex; gap:var(--sc-4); padding:var(--sc-4) 0; border-bottom:1px solid var(--sc-line-faint);">';
const LETTER_NUM_RE = /width:26px; font:600 14px\/20px var\(--sc-font-data\); color:var\(--sc-ink-2\);">(\d+)\.<\/span>/;
const HEADING_600_RE = /font:600 14px\/20px var\(--sc-font-ui\); color:var\(--sc-ink\);">([^<]+)<\/span>/;
const UDC_CITE_RE = /City of Bastrop Building Block B3 Section \d{2}-\d{2}-\d{3} \([^)]+\)/g;
const IBC_CITE_RE = /20\d\d International Building Code Section [\d.]+ \([^)]+\)/g;

/** The consolidated notice's numbered items. */
function letterRows(html) {
  return html
    .split(LETTER_ROW_SPLIT)
    .slice(1)
    .map((chunk) => {
      const head = chunk.slice(0, 2500);
      const n = one(LETTER_NUM_RE, head);
      const heading = one(HEADING_600_RE, head);
      if (n === null || heading === null) return null;
      return { number: Number(n), heading, text: plainText(head) };
    })
    .filter((r) => r !== null);
}

/** The notice split by its headings, so an item can be attributed to the class it prints under. */
function letterSections(html) {
  const marks = [...html.matchAll(NOTICE_HEAD_RE)].map((m) => {
    const n = m[1].match(/(?:&mdash;|—|--)\s*(\d+)\s*$/);
    return { at: m.index, label: m[1].replace(/&mdash;/g, '-').trim(), count: n ? Number(n[1]) : null };
  });
  return marks.map((mark, i) => ({
    label: mark.label,
    count: mark.count,
    rows: letterRows(html.slice(mark.at, i + 1 < marks.length ? marks[i + 1].at : html.length)),
  }));
}

const DEPT_ROW_SPLIT = 'width:24px; height:24px; border-radius:var(--sc-r-full); display:grid; place-items:center; font:600 12px var(--sc-font-data);';

/** One department's own findings, numbered in the product's one numbering. */
function deptFindingRows(html) {
  return html
    .split(DEPT_ROW_SPLIT)
    .slice(1)
    .map((chunk) => {
      const head = chunk.slice(0, 2500);
      const n = one(/^[^>]*>(\d+)<\/span>/, head);
      const heading = one(HEADING_600_RE, head);
      if (n === null || heading === null) return null;
      const det = one(DET_ONE_RE, head);
      return { number: Number(n), heading, det };
    })
    .filter((r) => r !== null);
}

const LEDGER_SPLIT = 'grid-template-columns:minmax(0,1fr) 34px;';
const LEDGER_SUB_RE = /font:400 12px\/17px var\(--sc-font-ui\); color:var\(--sc-ink-3\);">([^<]+)<\/span>/;
const LEDGER_COUNT_RE = /font:400 15px\/20px var\(--sc-font-data\); color:var\(--sc-ink\); text-align:right;">(\d+)<\/span>/;
const CLASS_PART_RE = /(\d+)\s+(corrections?|pass(?:es)?|escalat(?:ed|ions?)|not evaluated|held back)/gi;

/** The notice's per-department ledger: name, count, and the class parts it claims. */
function ledgerRows(html) {
  return html
    .split(LEDGER_SPLIT)
    .slice(1)
    .map((chunk) => {
      const head = chunk.slice(0, 1800);
      const name = one(DEPT_NAME_RE, head);
      const sub = one(LEDGER_SUB_RE, head);
      const count = one(LEDGER_COUNT_RE, head);
      if (name === null || count === null) return null;
      const parts = [...(sub || '').matchAll(CLASS_PART_RE)].map((m) => Number(m[1]));
      return { name, count: Number(count), sub: sub || '', parts };
    })
    .filter((r) => r !== null);
}

/** The notice's per-department not-evaluated paragraph, which is the breakout claim. */
function notEvaluatedParagraph(html) {
  const m = html.match(/<p style="margin:0; max-width:94ch;[^"]*">([\s\S]*?)<\/p>/);
  return m ? plainText(m[1]) : null;
}

const NOTICE_HEAD_RE = /<div style="font:500 12px\/16px var\(--sc-font-data\); letter-spacing:\.1em; text-transform:uppercase; color:var\(--sc-ink-3\);[^"]*">([^<]+)<\/div>/g;
/** The notice's section headings and the count each one claims. */
function noticeHeadings(html) {
  return [...html.matchAll(NOTICE_HEAD_RE)].map((m) => {
    const label = m[1];
    const n = label.match(/(?:&mdash;|—|--)\s*(\d+)\s*$/);
    return { label: label.replace(/&mdash;/g, '-').trim(), count: n ? Number(n[1]) : null };
  });
}

function citations(html) {
  return [...new Set([...html.matchAll(UDC_CITE_RE), ...html.matchAll(IBC_CITE_RE)].map((m) => m[0]))];
}

/** The two unrouted causes, as the cards that carry them. */
function unroutedCauses(html) {
  const at = html.indexOf('>Unrouted</span>');
  if (at === -1) return null;
  const region = html.slice(at, html.indexOf('</section>', at));
  return [...region.matchAll(/<span style="font:600 13px\/19px var\(--sc-font-ui\); color:var\(--sc-ink(?:-2)?\);">([^<]+)<\/span><span style="font:400 12px\/18px var\(--sc-font-ui\); color:var\(--sc-ink(?:-2|-3)?\);">([^<]+)<\/span>/g)].map((m) => ({ title: m[1], body: m[2] }));
}

/* ------------------------------------------------------------- predicates */

/** Every department name the boards speak must be a role the product's ruling names. */
const deptNameFaults = (channels) => channels.filter((c) => !DEPT_NAMES.has(c.name)).map((c) => 'the board names the department "' + c.name + '", which is not one of the seven the ruling fixes (' + ROLE_NAMES.join(', ') + ') nor Unrouted');
/** A finding number exists once, and it carries the heading the product puts at that number. */
const findingNumberFaults = (rows) => {
  const out = [];
  for (const r of rows) {
    const f = FINDINGS[r.number - 1];
    if (!f) {
      out.push('finding ' + r.number + ' ("' + r.heading + '") is outside the product\'s numbering, which stops at ' + FINDINGS.length);
      continue;
    }
    if (f.heading.trim().toLowerCase() !== r.heading.trim().toLowerCase()) {
      out.push('finding ' + r.number + ' is drawn as "' + r.heading + '" and the product\'s finding ' + r.number + ' is "' + f.heading + '"');
    }
  }
  return out;
};
/** Only the citations that exist. */
const citationFaults = (list) => list.filter((c) => !CITATIONS.has(c)).map((c) => 'the board cites "' + c + '", which is not one of the three citations that exist');
/** The notice's classes are the product's classes, as a multiset of counts. */
const CLASS_LABEL_RE = { corrections: /correction/i, escalations: /escalat/i, notEvaluated: /not evaluated/i, heldBack: /held back/i };
const noticeClassFaults = (headings) => {
  const counts = headings.map((h) => h.count).filter((n) => n !== null).sort((a, b) => a - b);
  if (counts.length !== headings.length) {
    return ['a notice heading states no count: ' + headings.filter((h) => h.count === null).map((h) => '"' + h.label + '"').join(', ')];
  }
  if (counts.join(',') === PRODUCT_CLASS_COUNTS.join(',')) return [];
  const productList = ['corrections', 'escalations', 'notEvaluated', 'heldBack'].filter((k) => NOTICE[k] > 0);
  const headless = productList.filter((k) => !headings.some((h) => CLASS_LABEL_RE[k].test(h.label)));
  return [
    'the notice renders ' + headings.length + ' classes counting ' + counts.join(' + ') + ' = ' + counts.reduce((a, b) => a + b, 0) +
      ', and the product partitions ' + NOTICE.total + ' as ' + productList.map((k) => NOTICE[k] + ' ' + k).join(' + ') +
      (headless.length ? '. No heading carries the product\'s ' + headless.map((k) => NOTICE[k] + ' ' + k + ' class ("' + NOTICE.headings[k] + '")').join(' or ') + ', so it has been folded into another' : ''),
  ];
};
/** The ledger ties: to the product total, to its own stated parts, and to its own subtitle. */
const ledgerFaults = (rows, subFindings, subDepartments) => {
  const out = [];
  const sum = rows.reduce((a, r) => a + r.count, 0);
  const departments = rows.filter((r) => r.name !== 'Unrouted');
  if (sum !== NOTICE.total) out.push('the per-department ledger sums to ' + sum + ' and the product\'s notice carries ' + NOTICE.total);
  if (subFindings !== null && subFindings !== sum) out.push('the ledger says "' + subFindings + ' findings" and its own rows sum to ' + sum);
  if (subDepartments !== null && subDepartments !== departments.length) out.push('the ledger says "' + subDepartments + ' departments" and it renders ' + departments.length + ' department rows (plus ' + (rows.length - departments.length) + ' unrouted)');
  for (const r of rows) {
    if (!r.parts.length) continue;
    const parts = r.parts.reduce((a, b) => a + b, 0);
    if (parts !== r.count) out.push('the ledger row "' + r.name + '" counts ' + r.count + ' and its own parts sum to ' + parts + ' ("' + r.sub + '")');
  }
  return out;
};
/** Not evaluated is broken out by department, and its parts tie to the product's count. */
const notEvaluatedFaults = (headings, body) => {
  const out = [];
  const h = headings.find((x) => /not evaluated/i.test(x.label));
  if (!h) return ['no "Not evaluated" heading on the notice, so the by-department breakout was not checked'];
  if (h.count !== NOTICE.notEvaluated) out.push('the notice says ' + h.count + ' not evaluated and the product carries ' + NOTICE.notEvaluated);
  const parts = [...(body || '').matchAll(/([A-Z][A-Za-z ]+?)\s(\d+)(?=[,.]|$)/g)].map((m) => ({ who: m[1].trim(), n: Number(m[2]) }));
  if (!parts.length) return out.concat(['the notice states no per-department not-evaluated counts, so that breakout is a heading with no content']);
  const sum = parts.reduce((a, p) => a + p.n, 0);
  if (sum !== NOTICE.notEvaluated) out.push('the not-evaluated breakout names ' + parts.map((p) => p.who + ' ' + p.n).join(', ') + ' = ' + sum + ' and the product carries ' + NOTICE.notEvaluated);
  return out;
};
/** A stated arithmetic identity on the board has to be true, and has to agree with the ledger. */
const basisArithmeticFaults = (html, ledgerSum) => {
  const m = html.match(/(\d+(?:\s*\+\s*\d+)+)\s*=\s*(\d+)/);
  if (!m) return ['the notice carries no stated per-department addition, so the figure it prints cannot be checked'];
  const addends = m[1].split('+').map((s) => Number(s.trim()));
  const stated = Number(m[2]);
  const out = [];
  const sum = addends.reduce((a, b) => a + b, 0);
  if (sum !== stated) out.push('the notice prints "' + m[0] + '" and those addends sum to ' + sum);
  if (stated !== ledgerSum) out.push('the notice prints a total of ' + stated + ' and its own ledger sums to ' + ledgerSum);
  return out;
};
/** The boards must state the product's department-model position, and state it right. */
const NEG_CLAIM_RE = /\bno department model at all\b|\bhas no department model\b/i;
const sourceClaimFaults = (texts) => {
  const negated = texts.filter((t) => NEG_CLAIM_RE.test(t));
  const asserted = texts.filter((t) => !NEG_CLAIM_RE.test(t) && /DEPARTMENT_ROLES|carries an? department model/i.test(t));
  if (negated.length && MODEL) {
    const decls = (S._source.roleModelDeclarations || []).map((d) => d.name + ' at ' + S._source.identityFile + ':' + d.line).join(', ');
    return [
      'the design states the product has "no department model at all" -- the README\'s source-state section and the canvas annotation, which adds "Confirmed by grep across src/ and web/" -- and ' +
        S._source.repo + ' at ' + S._source.ref + ' ' + S._source.commit.slice(0, 8) + ' declares ' + decls +
        ': ' + (S._source.roleModelDeclarations || []).map((d) => d.declaration).join(' ') +
        ' The roster the design proposes is the roster the product now carries, so the claim is stale rather than the roster being wrong',
    ];
  }
  if (!negated.length && !asserted.length) {
    return ['neither the README nor the canvas annotation states the department-model position any more, so the design no longer says what it is drawn against'];
  }
  if (!MODEL && asserted.length) {
    return ['the design states the product carries a department model and ' + S._source.repo + ' at ' + S._source.ref + ' declares none, so the design is drawn against a product that does not exist'];
  }
  return [];
};
/** The rest of that sentence, kept as a claim that still has to hold. */
const negativeClaimFaults = () => {
  const out = [];
  for (const term of ['discipline', 'routing', 'sign-off']) {
    const n = SCAN.byTerm[term];
    if (n === undefined) out.push('the scan did not look for "' + term + '", so the design\'s claim about it is unchecked');
    else if (n > 0) out.push('the design says there is no ' + term + ' and the product at ' + S._source.commit.slice(0, 8) + ' matches it ' + n + ' time(s)');
  }
  return out;
};
/** Both unrouted causes, as two cards that do not collapse into one. */
const unroutedCauseFaults = (causes) => {
  if (causes === null) return ['no Unrouted panel on the routing board, so the two-cause rule was not checked'];
  if (causes.length !== 2) return ['the Unrouted panel renders ' + causes.length + ' cause card(s) and the rule is that there are exactly two'];
  const two = causes.filter((c) => /\btwo claimants?\b|\bboth\s+(?:of\s+them\s+)?claim/i.test(c.title + ' ' + c.body));
  const zero = causes.filter((c) => /no claimant|zero owners|absent from the declared map/i.test(c.title + ' ' + c.body));
  const out = [];
  if (two.length !== 1) out.push('the Unrouted panel has ' + two.length + ' card(s) stating the two-claimant cause and the rule needs exactly one');
  if (zero.length !== 1) out.push('the Unrouted panel has ' + zero.length + ' card(s) stating the no-claimant cause and the rule needs exactly one');
  return out;
};
/** A held-back item may not be printed under the escalation heading, and the reverse. */
const sectionPlacementFaults = (sections) => {
  const out = [];
  for (const s of sections) {
    const escalated = /escalat/i.test(s.label);
    const heldBack = /held back/i.test(s.label);
    if (!escalated && !heldBack) continue;
    for (const r of s.rows) {
      const f = FINDINGS[r.number - 1];
      if (!f) continue;
      if (f.axis === 'heldBack' && escalated) {
        out.push('the held-back finding ' + r.number + ' ("' + r.heading + '") is printed under "' + s.label + '", which asks nothing of the applicant, and the product holds that finding out of the letter as its own class');
      }
      if (f.axis === 'escalated' && heldBack) {
        out.push('the escalated finding ' + r.number + ' ("' + r.heading + '") is printed under the held-back heading "' + s.label + '"');
      }
    }
  }
  return out;
};
/** The determination channel carries only determinations. */
const determinationFaults = (labels) => labels.filter((l) => !DETERMINATIONS.has(l)).map((l) => 'the board badges "' + l + '", which is not one of the product\'s determinations (' + [...DETERMINATIONS].join(', ') + ')');
/** The design must say it is not buildable under the gate as ruled. */
const gateClaimFaults = (annotations) => {
  const hit = annotations.filter((a) => /\bg-144\b|role[- ]gate|(?:cannot|can not|not) be built\b/i.test(a));
  if (!hit.length) return ['no canvas annotation states the role gate that blocks this build, so the design does not carry its own boundary'];
  return [];
};

/* ------------------------------------------------------------- self-tests */

const HEAD = '<!doctype html><html><head><style>.x{color:#fff}</style></head><body><x-dc>';
const deptSpan = (n, c = '--sc-accent') => '<span style="display:inline-flex; align-items:center; gap:5px; flex:none;"><span style="width:8px; height:8px; border-radius:var(--sc-r-full); background:var(' + c + ');"></span><span style="font:400 12px/16px var(--sc-font-ui); color:var(--sc-ink-2);">' + n + '</span></span>';
const detSpan = (d, c = '--sc-restricted') => '<span style="flex:none; font:500 12px/16px var(--sc-font-data); letter-spacing:.05em; color:var(' + c + '); background:var(' + c + '-wash); border-radius:var(--sc-r-control); padding:1px 6px;">' + d + '</span>';
const letterRowFixture = (n, h, extra = '') => LETTER_ROW_SPLIT + '<span style="flex:none; width:26px; font:600 14px/20px var(--sc-font-data); color:var(--sc-ink-2);">' + n + '.</span><div><div><span style="font:600 14px/20px var(--sc-font-ui); color:var(--sc-ink);">' + h + '</span>' + extra + '</div></div>';
const deptRowFixture = (n, h, det) => '<span style="flex:none; width:24px; height:24px; border-radius:var(--sc-r-full); display:grid; place-items:center; font:600 12px var(--sc-font-data); color:var(--sc-surface); background:var(--sc-crit);">' + n + '</span><div><div><span style="font:600 14px/20px var(--sc-font-ui); color:var(--sc-ink);">' + h + '</span>' + detSpan(det) + deptSpan('Fire and EMS', '--sc-crit') + '</div></div>';
const ledgerFixture = (rows) => rows.map(([n, c, s]) => '<div style="display:grid; grid-template-columns:minmax(0,1fr) 34px; gap:0 var(--sc-2);"><div>' + deptSpan(n) + '<span style="font:400 12px/17px var(--sc-font-ui); color:var(--sc-ink-3);">' + s + '</span></div><span style="font:400 15px/20px var(--sc-font-data); color:var(--sc-ink); text-align:right;">' + c + '</span></div>').join('');
const headingFixture = (label, n) => '<div style="font:500 12px/16px var(--sc-font-data); letter-spacing:.1em; text-transform:uppercase; color:var(--sc-ink-3); margin-bottom:var(--sc-1);">' + label + ' &mdash; ' + n + '</div>';
const causeFixture = (t, b) => '<span style="font:600 13px/19px var(--sc-font-ui); color:var(--sc-ink);">' + t + '</span><span style="font:400 12px/18px var(--sc-font-ui); color:var(--sc-ink-2);">' + b + '</span>';
const unroutedFixture = (cards) => '<section>Unrouted</span>' + cards.join('') + '</section>';

const cleanLedger = [['Development services', 8, '1 correction, 1 pass, 6 not evaluated'], ['Fire and EMS', 2, '1 escalated, 1 not evaluated'], ['Public works', 2, '2 not evaluated, neither cited'], ['Parks', 0, 'no findings from us; sign-off still required'], ['Unrouted', 1, 'finding 6, two claimants']];
/* The product's partition, rendered with a heading of its own for each class: 1 + 1 + 1 + 10. */
const cleanHeadings = [headingFixture('Corrections required', 1), headingFixture('Escalated inside the city, no action from you', 1), headingFixture('Held back', 1), headingFixture('Not evaluated, by department', 10)].join('');

const tests = [
  ['name: accepts the ruling\'s seven roles', deptNameFaults([{ name: 'Fire and EMS' }, { name: 'Unrouted' }]).length === 0],
  ['name: REFUSES an invented department', deptNameFaults([{ name: 'Engineering' }]).length === 1],
  ['name: REFUSES a lens that is not a department', deptNameFaults([{ name: 'Citizen' }]).length === 1],
  ['name: the extractor read the channels', deptChannels(HEAD + deptSpan('Public works')).length === 1],
  ['number: accepts a heading the product puts at that number', findingNumberFaults([{ number: 1, heading: 'Front setback' }, { number: 6, heading: 'Driveway width' }]).length === 0],
  ['number: REFUSES a heading at the wrong number', findingNumberFaults([{ number: 13, heading: 'Fire apparatus access' }]).length === 1],
  ['number: REFUSES a number past the end of the numbering', findingNumberFaults([{ number: 14, heading: 'Front setback' }]).length === 1],
  ['number: the extractor read the rows', deptFindingRows(deptRowFixture(2, 'Fire separation distance', 'Uncertain')).length === 1],
  ['citation: accepts the three that exist', citationFaults([...CITATIONS]).length === 0],
  ['citation: REFUSES a citation that does not exist', citationFaults(['City of Bastrop Building Block B3 Section 14-02-099 (bastrop_tx-bdc-2026-adopted)']).length === 1],
  ['citation: the extractor found them on a board', citations(HEAD + 'See City of Bastrop Building Block B3 Section 14-02-003 (bastrop_tx-bdc-2026-adopted).').length === 1],
  ['classes: accepts the product partition', noticeClassFaults(noticeHeadings(cleanHeadings)).length === 0],
  ['classes: REFUSES the held-back class folded into escalations', noticeClassFaults(noticeHeadings(headingFixture('Corrections required', 1) + headingFixture('Escalated inside the city', 2) + headingFixture('Not evaluated, by department', 10))).length === 1],
  ['classes: names the class that lost its heading', /Held back/.test(noticeClassFaults(noticeHeadings(headingFixture('Corrections required', 1) + headingFixture('Escalated inside the city', 2) + headingFixture('Not evaluated, by department', 10)))[0] || '')],
  ['classes: REFUSES a heading with no count', noticeClassFaults(noticeHeadings(headingFixture('Corrections required', 1).replace(' &mdash; 1', ''))).length === 1],
  ['classes: the extractor read the headings and their counts', noticeHeadings(cleanHeadings).map((h) => h.count).join(',') === '1,1,1,10'],
  ['ledger: accepts a ledger that ties', ledgerFaults(ledgerRows(HEAD + ledgerFixture(cleanLedger)), 13, 4).length === 0],
  ['ledger: REFUSES a sum that misses the product total', ledgerFaults(ledgerRows(HEAD + ledgerFixture(cleanLedger.map((r) => (r[0] === 'Parks' ? [r[0], 1, r[2]] : r)))), 14, 4).length >= 1],
  ['ledger: REFUSES a row whose own parts miss its count', ledgerFaults(ledgerRows(HEAD + ledgerFixture([['Development services', 8, '1 correction, 1 pass, 5 not evaluated']])), 8, 1).filter((f) => /its own parts sum to 7/.test(f)).length === 1],
  ['ledger: REFUSES a subtitle that disagrees with the rows', ledgerFaults(ledgerRows(HEAD + ledgerFixture(cleanLedger)), 13, 5).length === 1],
  ['ledger: the extractor read the rows and their parts', ledgerRows(HEAD + ledgerFixture(cleanLedger)).reduce((a, r) => a + r.parts.length, 0) === 6],
  ['notEvaluated: accepts a breakout that ties', notEvaluatedFaults(noticeHeadings(cleanHeadings), 'Development services 6, Fire and EMS 2, Public works 2.').length === 0],
  ['notEvaluated: REFUSES a breakout that does not tie', notEvaluatedFaults(noticeHeadings(cleanHeadings), 'Development services 6, Fire and EMS 2, Public works 3.').length === 1],
  ['notEvaluated: REFUSES a heading with no breakout behind it', notEvaluatedFaults(noticeHeadings(cleanHeadings), '').length === 1],
  ['notEvaluated: REFUSES a heading whose count misses the product', notEvaluatedFaults(noticeHeadings(headingFixture('Not evaluated, by department', 9)), 'Development services 6, Fire and EMS 2, Public works 2.').length === 1],
  ['basis: accepts a true addition', basisArithmeticFaults(HEAD + '8 + 2 + 2 + 0 + 1 = 13.', 13).length === 0],
  ['basis: REFUSES an addition that does not add up', basisArithmeticFaults(HEAD + '8 + 2 + 2 + 0 + 1 = 14.', 13).length >= 1],
  ['basis: REFUSES a total that disagrees with the ledger', basisArithmeticFaults(HEAD + '8 + 2 + 2 + 0 + 1 = 13.', 12).length === 1],
  ['basis: REFUSES a board that states no addition at all', basisArithmeticFaults(HEAD + 'thirteen findings.', 13).length === 1],
  ['placement: accepts an escalated item under the escalated heading', sectionPlacementFaults(letterSections(HEAD + headingFixture('Escalated inside the city, no action from you', 1) + letterRowFixture(2, 'Fire separation distance'))).length === 0],
  ['placement: REFUSES the held-back item printed as an escalation', sectionPlacementFaults(letterSections(HEAD + headingFixture('Escalated inside the city, no action from you', 1) + letterRowFixture(6, 'Driveway width'))).length === 1],
  ['placement: the extractor attributed an item to its section', letterSections(HEAD + headingFixture('Escalated inside the city', 1) + letterRowFixture(2, 'Fire separation distance'))[0].rows.length === 1],
  ['claim: REFUSES "no department model at all" while the product carries one', sourceClaimFaults(['P:\\plan-review has **no department model at all**.']).length === 1],
  ['claim: accepts a design that states the model the product carries', sourceClaimFaults(['P:\\plan-review now declares DEPARTMENT_ROLES in src/staff-identity.mjs.']).length === 0],
  ['claim: REFUSES a design that no longer states its source position', sourceClaimFaults(['Nothing about the product here.']).length === 1],
  ['claim: the rest of the sentence still splits per term', negativeClaimFaults().length === 0],
  ['claim: the scan really looked across a tree', SCAN.filesScanned > 0 && Object.keys(SCAN.byTerm).length >= 4],
  ['unrouted: accepts the two causes as two cards', unroutedCauseFaults(unroutedRoutes()).length === 0],
  ['unrouted: REFUSES the two causes collapsed into one card', unroutedCauseFaults([{ title: 'The other reason', body: 'Two claimants, so no owner, and zero owners are different problems.' }]).length >= 1],
  ['unrouted: REFUSES a panel with only one card', unroutedCauseFaults([{ title: 'Finding 6', body: 'Both claim it.' }]).length === 1],
  ['det: accepts the product determinations', determinationFaults(['Uncertain', 'Unchecked', 'Fail', 'Pass']).length === 0],
  ['det: REFUSES a status word that is not a determination', determinationFaults(['In review']).length === 1],
  ['channel: accepts a dot and a badge side by side', dualChannelFaults(HEAD + deptSpan('Public works') + detSpan('Fail')).length === 0],
  ['channel: REFUSES one span carrying both', dualChannelFaults(HEAD + '<span style="width:8px; height:8px; border-radius:var(--sc-r-full); letter-spacing:.05em; color:var(--sc-crit); background:var(--sc-crit-wash); border-radius:var(--sc-r-control); padding:1px 6px;">X</span>').length === 1],
  ['gate: accepts an annotation that states the boundary', gateClaimFaults(['The role gate is DEFERRED, so this cannot be built.']).length === 0],
  ['gate: REFUSES a canvas that is silent about the gate', gateClaimFaults(['Three states of a docked map.']).length === 1],
  ['gate: REFUSES an annotation that only alludes to an amendment', gateClaimFaults(['The ruling amendment above is a precondition, not a detail.']).length === 1],
  ['text: a style block is never read as content', plainText('<style>.x{color:#fff}</style><p>ok</p>').includes('color') === false],
];

function unroutedRoutes() {
  return [
    { title: 'Finding 6 · Driveway width', body: 'Development services and Public works both claim it, with different requirements. Two claimants, so no owner.' },
    { title: 'The other reason: no claimant', body: 'A finding whose section is absent from the declared map is unrouted too. Zero owners and two owners are different problems and the surface never collapses them.' },
  ];
}

let selfFailed = 0;
for (const [label, passed] of tests) {
  if (!passed) {
    console.error('SELF-TEST FAILED: ' + label);
    selfFailed += 1;
  }
}
if (selfFailed) {
  console.error('\n' + selfFailed + ' of ' + tests.length + ' self-tests failed. The instrument is broken, so its');
  console.error('verdict on the artboards would be worthless and it does not report one.');
  process.exit(2);
}
console.log('self-tests: ' + tests.length + '/' + tests.length + ' passed, both directions on every rule that has two');

/* ------------------------------------------------------------ the artboards */

const BOARDS = ['Main.dc.html', 'Department.dc.html', 'Board.dc.html', 'Conflict.dc.html', 'Letter.dc.html'];

const totals = {
  boardsRead: 0, visibleChars: 0, deptChannels: 0, detBadges: 0, letterRows: 0, deptFindingRows: 0,
  ledgerRows: 0, ledgerParts: 0, noticeHeadings: 0, noticeSections: 0, citations: 0, unroutedCards: 0, annotations: 0,
};
const REQUIRED = ['boardsRead', 'deptChannels', 'detBadges', 'letterRows', 'deptFindingRows', 'ledgerRows', 'ledgerParts', 'noticeHeadings', 'noticeSections', 'citations', 'unroutedCards', 'annotations'];
const notes = [];
const problems = [];
const fail = (m) => problems.push(m);
const COLOUR_BY_NAME = new Map();

for (const file of BOARDS) {
  const p = new URL('./' + file, here);
  if (!fs.existsSync(p)) {
    fail(file + ': declared as an artboard and does not exist, so nothing was checked on it');
    continue;
  }
  const html = fs.readFileSync(p, 'utf8');
  const visible = plainText(html);
  totals.boardsRead += 1;
  totals.visibleChars += visible.length;
  if (visible.length < 500) fail(file + ': under 500 characters of visible text, so it was barely rendered');

  const channels = deptChannels(html);
  const badges = detBadges(html);
  const lRows = letterRows(html);
  const dRows = deptFindingRows(html);
  const ledger = ledgerRows(html);
  const headings = noticeHeadings(html);
  const sections = letterSections(html);
  const cites = citations(html);
  const causes = file === 'Main.dc.html' ? unroutedCauses(html) : null;

  totals.deptChannels += channels.length;
  totals.detBadges += badges.length;
  totals.letterRows += lRows.length;
  totals.deptFindingRows += dRows.length;
  totals.ledgerRows += ledger.length;
  totals.ledgerParts += ledger.reduce((a, r) => a + r.parts.length, 0);
  totals.noticeHeadings += headings.length;
  totals.noticeSections += sections.length;
  totals.citations += cites.length;
  totals.unroutedCards += causes ? causes.length : 0;

  for (const c of channels) COLOUR_BY_NAME.set(c.name, COLOUR_BY_NAME.has(c.name) ? (COLOUR_BY_NAME.get(c.name) === c.colour ? c.colour : null) : c.colour);

  for (const f of deptNameFaults(channels)) fail(file + ': ' + f);
  for (const f of determinationFaults(badges)) fail(file + ': ' + f);
  for (const f of dualChannelFaults(html)) fail(file + ': ' + f);
  for (const f of findingNumberFaults(lRows)) fail(file + ': the notice: ' + f);
  for (const f of findingNumberFaults(dRows)) fail(file + ': ' + f);
  for (const f of citationFaults(cites)) fail(file + ': ' + f);
  if (file === 'Main.dc.html') for (const f of unroutedCauseFaults(causes)) fail(file + ': ' + f);

  if (file === 'Letter.dc.html') {
    for (const f of noticeClassFaults(headings)) fail(file + ': ' + f);
    const sub = html.match(/(\d+) findings across (\d+) departments/);
    const ledgerSum = ledger.reduce((a, r) => a + r.count, 0);
    for (const f of ledgerFaults(ledger, sub ? Number(sub[1]) : null, sub ? Number(sub[2]) : null)) fail(file + ': ' + f);
    for (const f of notEvaluatedFaults(headings, notEvaluatedParagraph(html) || '')) fail(file + ': ' + f);
    for (const f of sectionPlacementFaults(sections)) fail(file + ': ' + f);
    for (const f of basisArithmeticFaults(html, ledgerSum)) fail(file + ': ' + f);
  }

  console.log('read ' + file.padEnd(20) + channels.length + ' department channels, ' + badges.length + ' determination badges, ' +
    lRows.length + ' notice items, ' + dRows.length + ' department findings, ' + ledger.length + ' ledger rows, ' +
    headings.length + ' notice headings, ' + cites.length + ' citations' + (causes ? ', ' + causes.length + ' unrouted causes' : ''));
}

const README = fs.readFileSync(new URL('./README.md', import.meta.url), 'utf8');
const CANVAS = JSON.parse(fs.readFileSync(new URL('./canvas.json', import.meta.url), 'utf8'));
const annotations = (CANVAS.annotations || []).map((a) => a.text);
totals.annotations = annotations.length;

for (const f of sourceClaimFaults([README, ...annotations])) fail('design: ' + f);
for (const f of negativeClaimFaults()) fail('design: ' + f);
for (const f of gateClaimFaults(annotations)) fail('design: ' + f);

const onDisk = fs.readdirSync(here).filter((f) => f.endsWith('.dc.html'));
for (const f of onDisk) if (!BOARDS.includes(f)) fail(f + ': an artboard on disk that this instrument does not declare, so it was never checked');
if (!onDisk.length) fail('no artboards on disk at all');

/* Counted, not failed: the two designs disagree about finding 6's determination, and the README
   argues the case explicitly, so this is an auditable divergence rather than a defect. */
const reasonerSix = FINDINGS[5];
if (reasonerSix && reasonerSix.axis !== 'escalated') {
  notes.push('finding 6 ("' + reasonerSix.heading + '") is axis "' + reasonerSix.axis + '" in the reasoner\'s product dump; this design treats the two-department conflict as Uncertain and says so on the canvas. An extension, not a contradiction, and recorded here so it stays auditable');
}
for (const [name, colour] of COLOUR_BY_NAME) {
  if (colour === null) notes.push('the department dot for "' + name + '" is not the same colour everywhere it appears, so the colour no longer identifies the department');
}
if (!MODEL) notes.push('the product carries no department model, so every department name on these boards is proposed rather than read');

console.log('');
console.log('matched inputs: ' + Object.entries(totals).map(([k, v]) => k + '=' + v).join(', '));
console.log('product side: ' + S._source.repo + ' @ ' + S._source.ref + ' ' + S._source.commit.slice(0, 12) + ' (' + SCAN.filesScanned +
  ' files scanned; department ' + SCAN.byTerm.department + ', discipline ' + SCAN.byTerm.discipline + ', routing ' + SCAN.byTerm.routing +
  ', sign-off ' + SCAN.byTerm['sign-off'] + '), roster ' + S._source.dashboards.repo + ' @ ' + S._source.dashboards.commit.slice(0, 12) +
  ', numbering ' + S.reasoner.ref + ' ' + String(S.reasoner.commit).slice(0, 12));

fs.writeFileSync(
  new URL('./instrument-report.json', import.meta.url),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      lane: 'g148-design-instruments',
      design: 'plan-review-departments',
      source: S._source,
      reasonerSource: S.reasoner,
      productFacts: {
        departmentRoleIds: ROLE_IDS,
        departmentRoleNames: ROLE_NAMES,
        lensCount: LENS_IDS.length,
        nonDepartmentLenses: NON_DEPT,
        departmentModelPresent: MODEL,
        findings: FINDINGS.length,
        citations: S.reasoner.citations.length,
        notice: NOTICE,
      },
      matchedInputs: totals,
      notes,
      findings: problems,
    },
    null,
    2,
  ) + '\n',
);

for (const n of notes) console.log('NOTE ' + n);
if (notes.length) console.log('');

if (problems.length) {
  for (const p of problems) console.error('FAIL ' + p);
  console.error('\n' + problems.length + ' violation(s).');
  process.exit(1);
}
const vacuous = REQUIRED.filter((k) => totals[k] === 0);
if (vacuous.length) {
  console.error('\nREFUSING A VERDICT: these predicates matched nothing across every artboard -- ' + vacuous.join(', ') + '.');
  console.error('A predicate with no inputs has not passed, it has not run.');
  process.exit(2);
}
console.log('PASS ' + totals.boardsRead + ' artboards, ' + totals.deptChannels + ' department channels, ' + totals.letterRows +
  ' notice items and ' + totals.ledgerRows + ' ledger rows read, against ' + S._source.ref + ' ' + S._source.commit.slice(0, 12) +
  ' and the reasoner numbering (design record: instrument-report.json)');
