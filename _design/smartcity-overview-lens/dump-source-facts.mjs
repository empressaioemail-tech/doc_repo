/**
 * The product side of the Overview-lens instrument, dumped rather than remembered.
 *
 *   node dump-source-facts.mjs
 *
 * WHAT IT READS AND WHY EACH ONE IS THE SOURCE AND NOT A COPY OF THE BOARD.
 *
 *   1. `smartcity-dashboards` @ origin/main, read with `git show` so the facts are the bytes
 *      at the ref rather than whatever the worktree happens to hold:
 *        - `src/staff-review.mjs` LENS_LABELS and WORK_LABELS. These are the two label sets
 *          the nav must name, and the label sets are exported rather than inferred so the
 *          chrome and the title cannot disagree about what a surface is called. The nine lens
 *          labels are also the roster the six "Across departments" lanes are derived from.
 *   2. `_decisions/2026-09-14_overview_lens_design_direction.md` at doc_repo HEAD, which is
 *      the ruling this design was ratified against. Each rule is located by its own sentence
 *      and the dump REFUSES if a sentence is gone, because a facts file that quietly dropped
 *      the rule the design was approved under would let the check pass on nothing.
 *
 * The counts are reported per term so a predicate that matches nothing is visible as a zero
 * and not as a pass.
 */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const here = new URL('.', import.meta.url);
const REPO = 'P:/smartcity-dashboards';
const RULING = 'P:/doc_repo/_decisions/2026-09-14_overview_lens_design_direction.md';
const FILES = { staffReview: 'src/staff-review.mjs' };

const git = (repo, ...args) => execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const show = (file) => git(REPO, 'show', 'origin/main:' + file);
const ref = () => git(REPO, 'rev-parse', 'origin/main').trim();

const commit = ref();
const staffReview = show(FILES.staffReview);

const grab = (name, src, re, what) => {
  const m = src.match(re);
  if (!m) {
    console.error('REFUSING TO DUMP: could not read ' + what + ' out of ' + name + '.');
    console.error('A facts file missing this would let the check pass on nothing. Re-read the source.');
    process.exit(2);
  }
  return m[1];
};

/* ---- the label sets, read out of the product's own export ---- */

const block = (name) => grab(FILES.staffReview, staffReview, new RegExp('export const ' + name + ' = \\{([\\s\\S]*?)\\n\\};'), 'the ' + name + ' export');
const pairs = (src) => [...src.matchAll(/^\s*"?([a-z0-9-]+)"?:\s*"([^"]+)",/gm)].map((m) => ({ id: m[1], label: m[2] }));

const lensPairs = pairs(block('LENS_LABELS'));
const workPairs = pairs(block('WORK_LABELS'));
if (lensPairs.length !== 9) {
  console.error('REFUSING TO DUMP: LENS_LABELS carried ' + lensPairs.length + ' labels and the nav this design draws names nine.');
  process.exit(2);
}
if (workPairs.length !== 6) {
  console.error('REFUSING TO DUMP: WORK_LABELS carried ' + workPairs.length + ' labels and the shell has six work items.');
  process.exit(2);
}

/* ---- the ruling, read at its own sentences ---- */

const doc = fs.readFileSync(RULING, 'utf8');
const rulingCommit = execFileSync('git', ['-C', 'P:/doc_repo', 'log', '-1', '--format=%H', '--', '_decisions/2026-09-14_overview_lens_design_direction.md'], { encoding: 'utf8' }).trim();

const sentence = (what, re) => {
  const m = doc.match(re);
  if (!m) {
    console.error('REFUSING TO DUMP: the G-120 ruling no longer says ' + what + '.');
    console.error('The design was ratified against that sentence; without it there is no rule to check it against.');
    process.exit(2);
  }
  return m[1];
};

const sixLaneLine = sentence('how many lanes Across departments covers', /Six lanes\*\*, not four: ([^.]*)\./);
const lanes = sixLaneLine.split(',').map((s) => s.trim()).filter(Boolean);
if (lanes.length !== 6) {
  console.error('REFUSING TO DUMP: the six-lane sentence parsed to ' + lanes.length + ' names: ' + JSON.stringify(lanes));
  process.exit(2);
}

const badgeLine = sentence('the five-state badge vocabulary', /five-state\s*\n?badge vocabulary — \*\*([^*]+)\*\*/);
const badges = badgeLine.split('/').map((s) => s.trim()).filter(Boolean);
if (badges.length !== 5) {
  console.error('REFUSING TO DUMP: the badge vocabulary parsed to ' + badges.length + ' words: ' + JSON.stringify(badges));
  process.exit(2);
}

const tilesRule = sentence('what a tile is', /\| Tiles \| \*\*([^*]+)\*\*/);
const unreadRule = sentence('what an unread tile renders', /\| Unread tiles \| ([^|\n]+)/);
const connectionsRule = sentence('the Connections move', /\| Connections \| \*\*([^*]+)\*\*/);
const railRule = sentence('what the right rail keeps', /\| Right rail \| ([^|\n]+)/);
const sourcesRule = sentence('what replaced the Sources panel', /\| `Sources` panel \| \*\*([^*]+)\*\*/);
const honestEmptyRule = sentence('that every empty state keeps its basis', /\| Honest-empty \| ([^|\n]+)/);
const meetingsRule = sentence('that every meeting row carries an Agenda link', /(\d+\. \*\*Meeting agenda documents[^\n]*)/);
const pinnedMap = sentence('that the map is pinned rather than designed', /The Overview map component itself is PINNED as (G-\d+)/);
const atomLine = sentence('which engine vocabulary leaked through the Sources panel', /The panel currently prints ([^\n]*?) and similar/);
const atomTerms = [...atomLine.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
if (!atomTerms.length) {
  console.error('REFUSING TO DUMP: the ruling names no atom-type tokens to keep off the surface.');
  process.exit(2);
}

/* ---- the Connections move, read out of the shipped function rather than paraphrased ---- */

const appJs = show('web/app.js');
const placeFn = grab('web/app.js', appJs, /function placeOverviewConnections\(sources\) \{([\s\S]*?)\n\}/, 'the shipped Connections placement function');
const connectionsKeyedOn = grab('web/app.js', appJs, /Keyed on "([^"]+)" \(src\/city-identity\.mjs packSources\(\)\), not/, 'the figure Connections is keyed on');
const connectionsDemoteAt = grab('web/app.js', placeFn, /const connected = ([^;]+);/, 'the condition that demotes Connections');
if (!connectionsDemoteAt.includes(connectionsKeyedOn)) {
  console.error('REFUSING TO DUMP: the placement function keys on "' + connectionsDemoteAt + '" and the comment names "' + connectionsKeyedOn + '".');
  process.exit(2);
}

/* The product's OWN five-word nav vocabulary, and the three roster rows its static markup
   badges "Not built". Both are read out of the bytes: a hardcoded list in the check would be
   the hand-declared shape G-100 exists to kill. */
const lensBadgeBlock = grab('web/app.js', appJs, /const LENS_BADGE = \{([\s\S]*?)\n\};/, 'the LENS_BADGE map');
const lensBadge = [...lensBadgeBlock.matchAll(/(?:"([a-z-]+)"|([a-z-]+)):\s*"([^"]+)"/g)].map((m) => m[3]);
if (lensBadge.length !== 5) {
  console.error('REFUSING TO DUMP: LENS_BADGE carried ' + lensBadge.length + ' words and the seam resolves five determinations.');
  process.exit(2);
}
const indexHtml = show('web/index.html');
const unbuilt = [...indexHtml.matchAll(/<a class="navitem roster" data-(?:lens|work)="[a-z-]+" href="[^"]*">([^<]+)<span class="grow"><\/span><span class="badge">([^<]+)<\/span><\/a>/g)]
  .filter((m) => /not built/i.test(m[2]))
  .map((m) => m[1]);
if (unbuilt.length !== 3) {
  console.error('REFUSING TO DUMP: the nav markup badges ' + unbuilt.length + ' roster row(s) "Not built" (' + unbuilt.join(', ') + '), and this design\'s nav is checked against that set.');
  process.exit(2);
}

/* ---- the scan: the negative claims are read across the product, not assumed ---- */

const SCAN_FILES = [FILES.staffReview, 'src/lenses.mjs', 'src/ui.test.mjs', 'web/app.js', 'web/index.html'];
const scanText = [FILES.staffReview, 'src/lenses.mjs', 'src/ui.test.mjs'].map((f) => show(f)).join('\n') + '\n' + appJs + '\n' + indexHtml;
const TERMS = {
  lensLabels: lensPairs.length,
  workLabels: workPairs.length,
  'not read': (scanText.match(/not read/gi) || []).length,
  'never a zero': (scanText.match(/never a zero|a zero here would be a claim/gi) || []).length,
  'on the map': (scanText.match(/on the map/gi) || []).length,
  agenda: (scanText.match(/\bagenda\b/gi) || []).length,
  connections: (scanText.match(/connections/gi) || []).length,
  granted: (scanText.match(/\bgranted\b/gi) || []).length,
};

const out = {
  _source: {
    repo: REPO,
    ref: 'origin/main',
    commit,
    files: FILES,
    scanFiles: SCAN_FILES,
    ruling: '_decisions/2026-09-14_overview_lens_design_direction.md',
    rulingCommit,
  },
  labels: {
    lenses: lensPairs.map((p) => p.label),
    lensesById: Object.fromEntries(lensPairs.map((p) => [p.id, p.label])),
    work: workPairs.map((p) => p.label),
    workById: Object.fromEntries(workPairs.map((p) => [p.id, p.label])),
  },
  badges,
  lanes,
  lensBadge,
  unbuilt,
  rules: {
    tiles: tilesRule,
    unreadTile: unreadRule,
    connections: connectionsRule,
    connectionsKeyedOn,
    connectionsDemoteAt,
    rail: railRule,
    sources: sourcesRule,
    honestEmpty: honestEmptyRule,
    meetings: meetingsRule,
    pinnedMap,
    atomVocabulary: atomTerms,
  },
  scan: { filesScanned: SCAN_FILES.length, byTerm: TERMS },
};

fs.writeFileSync(new URL('./source-facts.json', import.meta.url), JSON.stringify(out, null, 2) + '\n');
console.log('dumped source-facts.json from ' + REPO + ' @ origin/main ' + commit.slice(0, 8) + ' and the G-120 ruling @ ' + rulingCommit.slice(0, 8));
console.log('  lens labels: ' + out.labels.lenses.length + '  work labels: ' + out.labels.work.length + '  badges: ' + out.badges.length + '  lanes: ' + out.lanes.length);
console.log('  atom vocabulary kept off the surface: ' + atomTerms.join(', '));
console.log('  Connections is keyed on "' + connectionsKeyedOn + '" at "' + connectionsDemoteAt + '", read out of placeOverviewConnections');
console.log('  the product\'s own five nav words: ' + lensBadge.join(' / ') + '   roster rows badged "Not built": ' + unbuilt.join(', '));
console.log('  scanned ' + SCAN_FILES.length + ' files: ' + Object.entries(TERMS).map(([k, v]) => k + '=' + v).join(', '));
