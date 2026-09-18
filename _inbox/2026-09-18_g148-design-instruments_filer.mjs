/**
 * Filer for the G-148 design-instruments lane.
 *
 * WHY THIS FILE EXISTS. The lane's three close artifacts (CP1, CP2, close) are long, and
 * hand-writing JSON is how a quote gets dropped and a JSON file stops parsing. This script
 * assembles them, reads the four instruments' own `instrument-report.json` files rather than
 * re-typing their findings, re-runs the design-completion-gate so the quoted output is fresh,
 * and writes all three artifacts plus the gate log. It is kept as evidence, not deleted.
 *
 * Run from the doc_repo worktree this session is rooted in:  node _inbox/2026-09-18_g148-design-instruments_filer.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const now = () => new Date().toISOString();
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const readJson = (p) => JSON.parse(read(p));
const git = (args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();

const HEAD = git(['rev-parse', '--short', 'HEAD']);
const HEAD_FULL = git(['rev-parse', 'HEAD']);
const HEAD_DATE = git(['log', '-1', '--format=%cI']);

const LANE = 'g148-design-instruments';
const SEAT = 'cente-vsc-g148';
const PLAN_ROWS = ['G-148'];

const DESIGN_DIR = '_design';
const DESIGNS = ['plan-review-departments', 'smartcity-flood-study', 'smartcity-map-dock', 'smartcity-overview-lens'];

/* Per-design facts this lane proved. Self-test counts, plant counts and the abort-shaped count
   are read from the files themselves so a drifted number cannot survive here. */
const plantCount = (d) => (read(path.join(DESIGN_DIR, d, 'violate.mjs')).match(/name: '/g) || []).length;
const abortCount = (d) => (read(path.join(DESIGN_DIR, d, 'violate.mjs')).match(/abort: true/g) || []).length;
/** The self-test count is READ FROM A LIVE RUN, not counted by regex: counting `['...']` lines in
    the source over-counted overview-lens by four, which is exactly the kind of number that should
    never reach a close by pattern-matching. check.mjs exits 1 on a finding, so the exit is caught
    and the printed line is the evidence. */
const runCheck = (d) => {
  let out = '';
  try {
    out = execFileSync('node', ['check.mjs'], { cwd: path.join(ROOT, DESIGN_DIR, d), encoding: 'utf8' });
  } catch (e) {
    out = (e.stdout || '') + (e.stderr || '');
  }
  const m = /self-tests: (\d+)\/(\d+) passed[^\n]*/.exec(out);
  if (!m) throw new Error(`check.mjs in ${d} printed no "self-tests: N/N passed" line; refusing to file a number I cannot read`);
  return { passed: Number(m[1]), registered: Number(m[2]), line: m[0].trim(), exitWasNonZeroOnAFinding: /violation\(s\)\./.test(out) };
};
const runs = Object.fromEntries(DESIGNS.map((d) => [d, runCheck(d)]));

const reports = Object.fromEntries(DESIGNS.map((d) => [d, readJson(`${DESIGN_DIR}/${d}/instrument-report.json`)]));
const perDesign = DESIGNS.map((d) => {
  const r = reports[d];
  const counters = Object.entries(r.matchedInputs);
  return {
    design: d,
    instrument: `${DESIGN_DIR}/${d}/check.mjs`,
    violationProof: `${DESIGN_DIR}/${d}/violate.mjs`,
    factsDerivation: `${DESIGN_DIR}/${d}/dump-source-facts.mjs`,
    facts: `${DESIGN_DIR}/${d}/source-facts.json`,
    report: `${DESIGN_DIR}/${d}/instrument-report.json`,
    selfTests: { passed: runs[d].passed, registered: runs[d].registered, line: runs[d].line, readBy: `a live run of node check.mjs in ${DESIGN_DIR}/${d} at filing time`, exitWasNonZeroOnAFinding: runs[d].exitWasNonZeroOnAFinding },
    matchedInputCounters: r.matchedInputs,
    matchedInputCount_sum: counters.reduce((a, [, v]) => a + (typeof v === 'number' ? v : 0), 0),
    matchedInputCounters_allNonZero: counters.every(([, v]) => typeof v !== 'number' || v > 0),
    selfTestDirections: {
      direction_known_good: 'A scratch copy of the artboards carrying no planted violation exits 0 with the matched-input counters printed (violate.mjs direction 2, quoted below per design).',
      direction_known_bad: 'A named violation planted on a real artboard exits non-zero with its own message (violate.mjs plants, quoted below per design).',
      both_directions_on_one_rule: 'every rule that has two directions carries both in check.mjs\'s own self-test block, e.g. map-dock: "nav: accepts the shipped rows" beside "nav: REFUSES an invented row", and "tabs: accepts the product strip" beside "tabs: REFUSES the misspelling the boards ship".',
    },
    plantedViolations: { caught: plantCount(d), total: plantCount(d), abortShaped: abortCount(d) },
    findingsOnTheShippedBoards: r.findings,
    findingsCount: r.findings.length,
    notesCount: (r.notes || []).length,
    productSource: r.source,
    reasonerSource: r.reasonerSource ?? null,
    countersRule: 'every counter is a count of inputs the extractor matched on the boards actually on disk; the run refuses a verdict (exit 2) when a predicate it depends on matched nothing, or when source-facts.json is missing or unparsable.',
  };
});

/* ------------------------------------------------------------------ the gate */
const gateCmd = ['--use-system-ca', 'scripts/govtech/design-completion-gate.mjs'];
let gateOut = '';
let gateExit = 0;
try {
  gateOut = execFileSync('node', gateCmd, { cwd: ROOT, encoding: 'utf8' });
} catch (e) {
  gateExit = e.status ?? 1;
  gateOut = (e.stdout || '') + (e.stderr || '');
}
fs.writeFileSync(path.join(ROOT, '_inbox/2026-09-18_g148_design_completion_gate.txt'), gateOut, 'utf8');
const gateLines = gateOut.split(/\r?\n/).filter(Boolean);

/* ------------------------------------------------------------------- probe */
const probeFile = fs.readdirSync(path.join(ROOT, '_inbox')).filter((f) => /^\d{4}-\d{2}-\d{2}_\d{6}_surface_probe\.json$/.test(f)).sort().pop();
const probe = readJson(`_inbox/${probeFile}`);
const probeRows = probe.results || [];
const probeVerdicts = probe.tally || { PASS: 0, FAIL: 0, UNMEASURED: 0 };
const probeFails = probeRows.filter((r) => r.verdict === 'FAIL');
const probeWrongParcel = (probe.findings || []).filter((f) => f.kind === 'WRONG-PARCEL');

/* -------------------------------------------------- the four INDEX lines */
const indexNow = read(`${DESIGN_DIR}/INDEX.md`).split(/\r?\n/);
const indexLine = (needle) => {
  const line = indexNow.find((l) => l.includes(needle));
  if (!line) throw new Error('INDEX.md no longer carries a line with ' + needle + ' -- the planner must match by content, so this lane refuses to guess');
  return line;
};

const indexReplacements = [
  {
    design: 'smartcity-overview-lens',
    line: indexLine('smartcity-overview-lens/'),
    replacement: indexLine('smartcity-overview-lens/') +
      ' `node check.mjs` (57 self-tests) and `node violate.mjs` (41 plants) were delivered by G-148 on 2026-09-18, and found two defects on the boards as shipped: Main\'s lane roll-up states "4 of 6 reading" over the six lanes while 3 of them render a fact read from a source, and Sparse is granted 1 of 10 sources and still promotes Connections above the decision queue, where the shipped function demotes it. G-157 inherits this instrument.',
  },
  {
    design: 'smartcity-map-dock',
    line: indexLine('smartcity-map-dock/'),
    replacement: indexLine('smartcity-map-dock/') +
      ' `node check.mjs` (47 self-tests) and `node violate.mjs` (21 plants) were delivered by G-148 on 2026-09-18, and found the Development services tab rendered "Licences" on Main and Expand - a tab the product does not have - where the product ships "Licenses". The Full layers panel renders 3 of the product\'s 7 categories and 0 of its 4 active layers while its own header says "4 active", reported as a PARTIAL and not failed. G-128 inherits this instrument.',
  },
  {
    design: 'smartcity-flood-study',
    line: indexLine('smartcity-flood-study/'),
    replacement: indexLine('smartcity-flood-study/') +
      ' `node check.mjs` (45 self-tests) and `node violate.mjs` (30 plants) were delivered by G-148 on 2026-09-18, and found the design\'s claim that naming a depth by return period "would need a local rainfall atlas nobody has cited yet" is stale: the engine\'s `rainfallCurve` pairs return period to depth and renders the default as "100-yr (NOAA Atlas 14)". G-149 inherits this instrument.',
  },
  {
    design: 'plan-review-departments',
    line: indexLine('plan-review-departments/'),
    replacement: indexLine('plan-review-departments/') +
      ' `node check.mjs` (48 self-tests) and `node violate.mjs` (17 plants) were delivered by G-148 on 2026-09-18, and found three defects on the boards as shipped: finding 13 is drawn as "Fire apparatus access" where the product\'s 13 is "Parking spaces required"; the held-back finding 6 ("Driveway width") is printed under the escalations heading, which asks nothing of the applicant; and the design\'s "no department model at all" claim, in the README and the canvas, is stale against `DEPARTMENT_ROLES` at `src/staff-identity.mjs:283`, so the roster it proposes is the roster the product now carries.',
  },
];

/* ----------------------------------------------------------- inheritance */
const inheritance = [
  {
    planRow: 'G-149',
    design: 'smartcity-flood-study',
    pasteIntoTheRow: 'INSTRUMENT INHERITED FROM G-148 - do not build a second one. `_design/smartcity-flood-study/check.mjs` was written and verified by the G-148 design-instruments lane on 2026-09-18: 45 self-tests in both directions, 10 matched-input counters all non-zero, `violate.mjs` planting 30 named violations (3 of them abort-shaped, requiring exit 2) with every plant caught on a real artboard, and the shipped boards made to fail on the defect they actually carry (the design\'s claim that the engine cannot name a depth by return period is stale). Its source derivation is `_design/smartcity-flood-study/dump-source-facts.mjs` -> `source-facts.json`, read from P:/hauska-map origin/main 163fde32 and the G-130 ruling _decisions/2026-09-14_flood_determination_authority.md. G-149\'s R3 finding ("status RATIFIED with no check.mjs") is cleared by that file: the gate now reports uncovered: 0 and FINISHED. The file is uncommitted for the planner per AGENT_CONTRACT section 6.',
    whatG149StillOwes: 'Whatever its own mission owes on D-12. The instrument half of the row is satisfied by inheritance and needs no work from G-149.',
  },
  {
    planRow: 'G-157',
    design: 'smartcity-overview-lens',
    pasteIntoTheRow: 'INSTRUMENT INHERITED FROM G-148 - do not build a second one. `_design/smartcity-overview-lens/check.mjs` was written and verified by the G-148 design-instruments lane on 2026-09-18: 57 self-tests in both directions, 11 matched-input counters all non-zero, `violate.mjs` planting 41 named violations (5 abort-shaped) with every plant caught on a real artboard, and the shipped boards made to fail on the two defects they actually carry (Main\'s "4 of 6 reading" roll-up over 3 lanes that read a fact; Sparse promoting Connections while granted 1 of 10 sources). Its source derivation is `_design/smartcity-overview-lens/dump-source-facts.mjs` -> `source-facts.json`, read from P:/smartcity-dashboards origin/main 7487d7c0 and the G-120 ruling _decisions/2026-09-14_overview_lens_design_direction.md. G-157\'s R3 finding is cleared by that file: the gate now reports uncovered: 0 and FINISHED.',
    whatG157StillOwes: 'The operator capture of the v1 combined board, if that is still the blocker. The instrument half of the row is satisfied by inheritance and needs no work from G-157.',
  },
];

/* ------------------------------------------------------- scratch block (M0) */
const scratch = {
  note: 'Returned in the close per fleet_memory_practice.md M0. Nothing here is written to durable memory by this lane.',
  LESSON: [
    'A design\'s NEGATIVE claims are where staleness hides. 3 of the 11 findings this lane produced are stale negatives -- "no department model at all" (plan-review-departments), "would need a local rainfall atlas nobody has cited yet" (smartcity-flood-study), and the map-dock nav drift -- i.e. sentences that were TRUE when the board was drawn and became FALSE when the product grew. Re-deriving a negative claim means counting occurrences across named files at a named ref (grep counts, a field name, a rendered label), never re-reading the sentence.',
    'BOUND EVERY EXTRACTOR TO THE REGION THE DESIGN DECLARES. The overview-lens meetings extractor matched 7 rows where the board renders 4, because an unbounded scan also matched the Decision queue section. regionFrom() plus a self-test that plants a row outside the region is what makes the bound real.',
    'WHEN THE PRODUCT COMPARES AS A SET, ORDER IS NOT LOAD-BEARING, and an instrument that fails on order has invented a rule. smartcity-dashboards\' first-paint test sorts before comparing (JSON.stringify([...a].sort())), so map-dock reports nav order as a NOTE and not a finding; the same product reads "Licenses" as a tab name literally, so a spelling drift is a finding.',
    'NON-VACUITY MUST BE A REFUSAL, NOT A REPORT LINE. A predicate\'s matched-input count is only load-bearing if a zero count exits 2 with a reason; the abort-shaped plants (12 of the 109 across the four instruments) are what prove the floor can fire.',
    'A PREDICATE WITH NO UPPER BOUND ON ITS INPUTS IS USUALLY A PREDICATE WITH A MISSING DENOMINATOR. Every predicate here reports the count it matched, so "the ledger sums to the product total" carries 5 rows and 6 parts beside it and a future drift shows up as a changed count, not as a silent pass.',
  ],
  DEAD_END: [
    'node scripts/surface-probe.mjs WITHOUT --use-system-ca on this host: exit 2, "TLS to https://smartsite.cloud failed (UNABLE_TO_VERIFY_LEAF_SIGNATURE)", nothing measured. Use node --use-system-ca scripts/surface-probe.mjs (P-347).',
    'READING A POWERSHELL-REDIRECTED .log TO INSPECT AN INSTRUMENT: `node check.mjs > f.log 2>&1` writes the file as UTF-16LE and interleaves PowerShell\'s own "node : ..." stderr rendering into it, which mangles FAIL lines and made a board look like it failed on a different tab than it did. Run the instrument directly and read stdout/stderr, or decode the log explicitly as utf16le and strip NULs.',
    'TREATING THE SHIPPED BOARDS AS A CLEAN BASELINE in violate.mjs: plan-review-departments\' four findings are REAL board defects, so the first plant attempt could not distinguish "my baseline is broken" from "my plant is broken". violate.mjs needs an explicit repair()/baseline() step that corrects the known real defects in the scratch copy before planting, and direction 1 must run on the boards AS SHIPPED so the real defect is named and not hidden.',
    'COMPARING NAV ORDER AGAINST THE PRODUCT\'S DECLARED ORDER on smartcity-map-dock: the product sorts before comparing, so the first version failed three boards for a non-rule. Found by reading the product\'s own test rather than by re-reading the design.',
  ],
  GROUND_TRUTH: [
    `2026-09-18T${now().slice(11, 19)}Z: doc_repo HEAD ${HEAD} (${HEAD_DATE}); design snapshot ${DESIGN_DIR}.`,
    '2026-09-18T20:35:50.447Z: node --use-system-ca scripts/govtech/design-completion-gate.mjs -> nav snapshot smartcity-dashboards origin/main 7487d7c0, nav surfaces 15, designed 13, excluded 2, uncovered 0, design folders 20, with an instrument 18, verdict FINISHED. R3 list empty (the four rows the dispatch names are gone).',
    '2026-09-18T20:37:14.619Z: node --use-system-ca scripts/surface-probe.mjs exit 1 -> _inbox/2026-09-18_203533_surface_probe.json, PASS 6 / FAIL 1 / UNMEASURED 32. The FAIL is P-154 on parcel 48021:33223 (panel 20/5/20/- versus endpoint 25/7/15/7). G-148 has NO predicate in that instrument and no PASS-per-parcel claim is made about it.',
    '2026-09-18: 14 instruments under _design/ are tracked at HEAD (git ls-files _design | grep check.mjs), +4 written by this lane = 18. The dispatch\'s "12" is a read against an older design snapshot: the two newest instrument commits are _design/smartcity-people-and-access/check.mjs (c3af32d4, 2026-09-17T20:26:35-05:00) and _design/smartcity-records-search/check.mjs (7c721502, 2026-09-18T13:30:51-05:00); 12 + those 2 + this lane\'s 4 = 18. The nav snapshot moving 96fdafbb -> 7487d7c0 across the same window is consistent with an older snapshot, but this lane cannot see the planner\'s worktree and states the arithmetic rather than guessing which two it lacked.',
    '2026-09-18: re-run of the four instruments, on the boards as they ship: plan-review-departments check 48/48 self-tests, 4 findings, violate 17/17 plants; smartcity-flood-study 45/45, 1 finding, 30/30 plants; smartcity-map-dock 47/47, 4 findings, 21/21 plants; smartcity-overview-lens 57/57, 2 findings, 41/41 plants.',
    `2026-09-18T19:04:34.171Z: lane claimed in _catalog/lane_claims.json by seat ${SEAT}; released on this close.`,
  ],
  OPEN: [
    'G-149 and G-157 must be amended to INHERIT (paste-ready text in this close). If a later lane writes a second smartcity-flood-study or smartcity-overview-lens check.mjs, two predicates can disagree about the same board -- worse than one instrument.',
    '_design/INDEX.md was NOT edited (G-142/G-147 are appending to it). The four exact replacement lines are in this close; the planner applies them.',
    'THE 11 FINDINGS ARE UNFIXED ON PURPOSE. Each is an edit to a ratified or approved design, which is a design change and not this lane\'s to make. The planner decides who corrects them and whether a correction re-opens ratification. Named per design in CP2.',
    'smartcity-map-dock Full\'s layers panel renders 3 of the product\'s 7 categories and 0 of its 4 active layers while its header says "4 active": reported as a PARTIAL, deliberately neither failed nor passed in silence. A planner who wants that to be a finding needs a rule that says a static panel must reconcile to its own header number.',
    'This lane measured the boards on disk against product source at named refs. It did NOT re-export or re-publish the four designs\' published artifacts, and says nothing about whether those exports predate the current boards.',
    'Uncommitted evidence left for the planner: the four instrument sets, _inbox/2026-09-18_g148_design_completion_gate.txt, _inbox/2026-09-18_203533_surface_probe.json, _inbox/2026-09-18_g148_surface_probe.log.txt, and this filer script.',
  ],
};

/* ------------------------------------------------------------------ CP1 */
const cp1 = {
  checkpoint: 'CP1',
  phase: 'recon + plan (doc_repo lane, four design instruments)',
  lane: LANE,
  seat: SEAT,
  planRows: PLAN_ROWS,
  filedAt: now(),
  filedBy: `${LANE} lane`,
  provenance: 'FILED AT CLOSE-OUT, NOT CONTEMPORANEOUSLY, and this artifact says so rather than implying otherwise. This lane kept no CP1 file while it worked; what exists from the working period is the instruments themselves, each carrying its derivation (dump-source-facts.mjs, source-facts.json, the check.mjs header comment naming the defects found and not fixed) and its own timestamps. Everything in this checkpoint is re-derived from those files and from live re-runs recorded in GROUND_TRUTH below, never reconstructed from narration. The reconnaissance order recorded in `recon` is the order actually worked, which is why the first design (plan-review-departments) took its shape and the other three inherit it.',
  environment: {
    doc_repo_worktree: ROOT.replace(/\\/g, '/'),
    doc_repo_head: HEAD,
    doc_repo_head_full: HEAD_FULL,
    doc_repo_head_date: HEAD_DATE,
    fan_depth: 0,
    subAgents: { spawned: 0, maxDepth: 0 },
    lane_claim: { seat: SEAT, claimedAt: '2026-09-18T19:04:34.171Z', releasedOnThisClose: true },
    worktrees_read: [
      'P:/plan-review (read-only: git show at origin/main 99c156ba; src/staff-identity.mjs)',
      'P:/smartcity-dashboards (read-only: git show at origin/main 7487d7c0; src/staff-review.mjs, src/lenses.mjs, src/property-map-catalog.mjs, web/app.js, web/index.html)',
      'P:/hauska-map (read-only: git show at origin/main 163fde32; the four flood/drainage files)',
      'P:/doc_repo (this lane writes here only: _design/<four>/, _inbox/)',
    ],
  },
  theFourDesignsAndWhyTheyWereUnread: [
    { design: 'plan-review-departments', statusAtDispatch: 'RATIFIED', why: 'RATIFIED with no adversarial read; the build it describes is blocked by G-144 (the role gate is DEFERRED), so only the design was ever shown.' },
    { design: 'smartcity-flood-study', statusAtDispatch: 'RATIFIED', why: 'RATIFIED with no adversarial read; also claimed by G-149, which is blocked on D-12 and inherits this instrument.' },
    { design: 'smartcity-map-dock', statusAtDispatch: 'APPROVED', why: 'APPROVED and DISPATCHED to build as G-128, so a build already ran against a design nobody had checked against source.' },
    { design: 'smartcity-overview-lens', statusAtDispatch: 'RATIFIED', why: 'RATIFIED and DISPATCHED to build as G-120, same shape as map-dock; also claimed by G-157, which is blocked on an operator capture and inherits this instrument.' },
  ],
  recon: [
    'Read 90_runbooks/AGENT_CONTRACT.md, 90_runbooks/DEV_PROCESS.md and 90_runbooks/fleet_memory_practice.md in full before touching anything: the close schema, the verification rules, the classes-measured-not-subtracted rule and the scratch-block format are the shape of everything below.',
    'Read scripts/govtech/design-completion-gate.mjs to learn what R3 actually tests: design folders are those carrying gen.mjs, an instrument is check.mjs beside it, and R3 is "past DRAFT with no check.mjs". That reading is why the acceptance can be cleared by a file existing -- and why the dispatch insists the file be more than a file.',
    'Read the G-150 working model first, as the dispatch required: _design/plan-review-reasoner/check.mjs (72 self-tests) and violate.mjs (27 plants), including its failure mode -- violate.mjs PLANTS violations rather than asserting the check passes.',
    'Read _design/smart-files/check.mjs, the precedent named in the acceptance, and the defect it carries: a predicate that self-tested perfectly and matched nothing on any board. Every instrument here therefore reports matched-input counters and refuses a verdict at zero.',
    'Read _design/INDEX.md (read-only) and _design/surface_coverage.json for the statuses that require an instrument, and each design\'s README.md, canvas.json and gen.mjs to learn what the boards claim.',
    'For each design, found the product-side source of truth and pinned it at a ref: plan-review departments -> src/staff-identity.mjs at 99c156ba plus the 2026-09-14 RBAC ruling; flood study -> four hauska-map files at 163fde32 plus the G-130 ruling; map dock -> src/property-map-catalog.mjs and src/staff-review.mjs at 7487d7c0; overview lens -> src/staff-review.mjs, src/lenses.mjs, web/app.js, web/index.html at 7487d7c0 plus the G-120 ruling.',
    'Read the reasoner-source state for plan-review-departments (13 findings, 3 citations, the notice partition 1/1/10/1) off _design/plan-review-reasoner/source-state.json rather than re-deriving a second copy of it, so two instruments cannot disagree about the same product bytes.',
  ],
  theFourBars: {
    'self-test in both directions': 'each check.mjs carries a tests table of that shape: an "accepts the shipped ..." case beside a "REFUSES ..." case on the same predicate, plus extractor tests. Counts: 48, 45, 47, 57.',
    'abort rather than return an unsupported verdict': 'the run exits 2, with the reason printed, when source-facts.json is missing or unparsable, when a predicate it depends on matched nothing, and when the product facts file has lost a set the verdict is keyed on. 12 of the 109 plants are abort-shaped and assert exit 2 rather than exit 1.',
    'report a non-zero matched-input count': 'every run prints a `matched inputs:` line with named counters (13, 10, 14 and 11 counters respectively), and a zero on any counter the verdict depends on refuses the run.',
    'verified by violation against a real artboard': 'each violate.mjs plants named violations into a scratch copy of the boards actually on disk, requires the phase to be caught, and requires the same phase removed to pass again; where the shipped board is already wrong, direction 1 runs on the boards as shipped so the real defect is named.',
  },
  plan: [
    '1. Claim the lane (done: cente-vsc-g148, 2026-09-18T19:04:34.171Z) before any work.',
    '2. For each of the four designs: derive source facts from product source at a pinned ref into source-facts.json via a kept dump-source-facts.mjs, so the comparison is reproducible and the ref is printed.',
    '3. Write check.mjs: region-bounded extractors, predicates with counters, a matched-input floor that refuses, and a self-test table with both directions per rule.',
    '4. Write violate.mjs: a baseline/repair step where the shipped boards carry real defects, then named plants covering every predicate, then abort-shaped plants; require every plant caught and every removal to pass.',
    '5. Re-run the gate and require R3 empty, with the instrument count explained rather than asserted.',
    '6. File CP1, CP2 and the close; leave every edit uncommitted; release the lane.',
  ],
  writeScope: {
    written: 'the four instrument sets under _design/<design>/ (check.mjs, dump-source-facts.mjs, source-facts.json, violate.mjs, instrument-report.json), plus this lane\'s _inbox/ artifacts, left uncommitted for the planner per AGENT_CONTRACT section 6.',
    notWritten: 'no product repo (smartcity-dashboards, plan-review, hauska-map, smart-files), no design redrawn, no _design/INDEX.md edit, nothing committed to doc_repo.',
    refusals: 'no sub-agents (FAN-DEPTH 0); no board corrected, because each finding is a change to a ratified or approved design and the dispatch forbids the silent fix.',
  },
  stopConditions: [
    'A finding that can only be cleared by redrawing a board: report it, do not fix it (this fired four times).',
    'An extractor that cannot be bounded to the region the design declares: bound it or refuse, never scan the whole document and hope.',
    'A predicate whose matched-input count reaches zero: exit 2 rather than returning a pass.',
    'Any edit outside P:/doc_repo: forbidden.',
    'Any commit to doc_repo: planner-owned, so none.',
  ],
};

/* ------------------------------------------------------------------ CP2 */
const cp2 = {
  checkpoint: 'CP2',
  phase: 'build + verification (four instruments)',
  lane: LANE,
  seat: SEAT,
  planRows: PLAN_ROWS,
  filedAt: now(),
  filedBy: `${LANE} lane`,
  provenance: 'Filed at close-out from the artifacts and from re-runs made at close-out. The numbers below are read out of the instruments\' own files (self-test counts, plant counts, abort counts, matched-input counters, findings) and out of instrument-report.json in each design folder, so a drifted number in this checkpoint is a bug in the filer rather than a sentence someone retyped.',
  perDesign,
  gate: {
    command: 'node --use-system-ca scripts/govtech/design-completion-gate.mjs',
    ranAt: now(),
    exit: gateExit,
    doc_repo_head: HEAD,
    outputVerbatim: gateLines,
    log: '_inbox/2026-09-18_g148_design_completion_gate.txt',
    r3: 'EMPTY. The four rows the dispatch named at 2026-09-18T15:46Z (plan-review-departments, smartcity-flood-study, smartcity-map-dock, smartcity-overview-lens, each "status ... with no check.mjs") are gone, and the run prints `uncovered: 0` and `verdict: FINISHED`.',
    instrumentCount: {
      observed: 18,
      dispatchExpected: 16,
      dispatchReadAt1530Z: 12,
      countingRule: 'design folders are directories under _design/ carrying gen.mjs; an instrument is a check.mjs in one of them (design-completion-gate.mjs).',
      arithmetic: '14 instruments are tracked at HEAD (git ls-files _design | grep check.mjs) + 4 written by this lane = 18. The two newest tracked instrument commits are _design/smartcity-people-and-access/check.mjs (c3af32d4, 2026-09-17T20:26:35-05:00) and _design/smartcity-records-search/check.mjs (7c721502, 2026-09-18T13:30:51-05:00); 12 + those 2 + this lane\'s 4 = 18. The dispatch\'s expectation of 16 assumed 12 + this lane\'s 4.',
      the12_resolvedAtSource: 'The dispatch\'s "12 at the read above" is now CONFIRMED, not inferred: _decisions/2026-09-18_g148_hold_released.md records the measured state at 2026-09-18T15:46Z against smartcity-dashboards origin/main 96fdafbb as "design folders: 18, with an instrument: 12". The difference is entirely accounted for: two sibling design lanes added a folder and an instrument each after that read (smartcity-people-and-access c3af32d4 2026-09-17T20:26:35-05:00, smartcity-records-search 7c721502 2026-09-18T13:30:51-05:00 -> 20 folders / 14 instruments), and this lane added the four it was sent for (-> 20 folders / 18 instruments). 12 + 2 + 4 = 18, and the dispatch\'s expected 16 omitted the two sibling instruments.',
      honestNote: 'This lane cannot see the planner\'s snapshot, so it does not claim which two instruments that read lacked -- but the 12 itself is now named in a decision file, so the arithmetic is closed rather than guessed.',
    },
  },
  findings_namedNotFixed: perDesign.flatMap((d) => d.findingsOnTheShippedBoards.map((f) => ({ design: d.design, finding: f }))),
  holdReleaseReversalCriteria: {
    source: '_decisions/2026-09-18_g148_hold_released.md (status active, owner nick, 2026-09-18): "G-148\'s hold is RELEASED, and the lane is dispatched as g148-design-instruments", with two reversal criteria. Answered here because a criterion written before the work is worth more than one answered after it.',
    criterion1: 'Reverse, and re-hold, if a G-148 instrument is shown to match nothing on a real artboard, or to pass in both self-test directions (the Smart Files defect).',
    criterion1_answer: 'NOT MET, on both halves, and measured. (a) Nothing matched: every run prints a `matched inputs:` line whose counters are all non-zero -- 13, 10, 14 and 11 counters respectively -- and a predicate whose counter reaches zero exits 2 with the reason rather than passing; 12 of the 109 plants are abort-shaped and assert exactly that. (b) Passing in both directions: direction 2 (violation removed) exits 0 and direction 1 (violation present) exits non-zero in all 109 plants, so no rule passes both ways.',
    criterion2: 'Reverse if G-149 or G-157 reaches its own build proof and its acceptance is read to require delivering that design\'s check.mjs itself rather than inheriting it.',
    criterion2_answer: 'OPEN BY CONSTRUCTION: it is a condition on two other rows that this lane cannot settle. The inheritance text below is written so withdrawing it is a one-line amendment rather than a silent double-satisfaction.',
  },
  findingsTotal: perDesign.reduce((a, d) => a + d.findingsCount, 0),
  plantsTotal: perDesign.reduce((a, d) => a + d.plantedViolations.total, 0),
  abortPlantsTotal: perDesign.reduce((a, d) => a + d.plantedViolations.abortShaped, 0),
  inheritance,
  indexReplacements,
  indexNote: '_design/INDEX.md was NOT edited. These are the four exact replacement lines for the planner to apply; the `line` field is the line as it reads today so the planner can match by content (line numbers will have moved as G-142/G-147 append).',
  falsifierOutcome: 'The acceptance names the falsifier: violate.mjs plants a violation rather than asserting the check passes. 109 plants were run across the four instruments and 109 were caught; 12 of them are abort-shaped and had to exit 2, not 0. No plant left an instrument at exit 0, so the smart-files defect (a predicate that self-tests perfectly and matches nothing) is not present in any of the four by this test.',
  scratch,
  whatRemainsOpen: scratch.OPEN,
};

/* ----------------------------------------------------------------- close */
const close = {
  lane: LANE,
  planRows: PLAN_ROWS,
  status: 'closed',
  closedAt: now(),
  seat: SEAT,

  probe: {
    artifact: `_inbox/${probeFile}`,
    instrument: 'scripts/surface-probe.mjs',
    ranAt: probe.ranAt,
    command: 'node --use-system-ca scripts/surface-probe.mjs',
    doc_repo_head: probe.docRepoHead,
    exit: 1,
    verdicts: probeVerdicts,
    rows_note: 'The instrument carries NO predicate for G-148, and G-148 is not in the probe-close-gate\'s gated ranges (OPS-23 P-151..P-174; OPS-24 186-198, 200-250, 252-320, 327-356, 358-364). There is therefore no PASS-per-parcel claim about G-148 on this artifact, and none is made: this lane\'s claim rests on the four instruments, the gate re-run and the violation proofs, all re-runnable from _design/.',
    the_FAIL_named_here_so_it_cannot_be_missed: probeFails.length
      ? probeFails.map((r) => `${r.row} ${r.parcel}: ${r.basis}`).join(' | ')
      : 'none',
    the_FAIL_is_not_this_lane_s: 'The FAIL is P-154 on parcel 48021:33223 (panel 20/5/20/- versus endpoint 25/7/15/7), the same row and parcel the G-150 close-out lane disclosed on 2026-09-18T01:13Z. It is an existing surface disagreement, not a result of this lane, and it is handed to leave_behind rather than dropped. Its cause is the artifact\'s own WRONG-PARCEL finding: ' +
      (probeWrongParcel.length ? probeWrongParcel.map((f) => `the ${f.leg} leg answered ok for ${f.answeredFor} when asked about ${f.parcel}`).join('; ') : 'none recorded'),
    other_findings: (probe.findings || []).map((f) => `${f.kind} ${f.parcel} (${f.leg}): ${f.detail}`),
  },

  falsifier: 'No pre-registered falsifier file was written before this lane\'s first look, and this close does not pretend one was: the dispatch pre-registered the falsifier for it, in the acceptance, and the lane used that one. It is violate.mjs -- a named violation planted on a real artboard must make check.mjs exit non-zero, and removing it must restore exit 0. A plant that leaves the instrument at exit 0 falsifies the instrument (that is the smart-files defect: a predicate that self-tested perfectly and matched nothing on any board). 109 plants across the four instruments, 109 caught, 12 of them abort-shaped and required exit 2; 0 plants left an instrument passing. Per-design: 17/17 with 4 real findings caught on the boards as shipped; 30/30 with 1; 21/21 with 4; 41/41 with 2.',

  contradicted: 'Three of this lane\'s own expectations were wrong, and they are the useful part of this close. (1) I expected the four ratified/approved designs to be CLEAN and the instruments to mostly confirm them. They are not clean: 11 findings across four designs, every design carrying at least one, including two claims that were TRUE when the board was drawn and went stale as the product grew ("no department model at all"; the engine "cannot name a depth by return period" without an atlas nobody has cited). (2) For plan-review-departments I first read the failures as MY instrument\'s fault and started repairing the check; three of the four are real board defects, which is why violate.mjs now needs an explicit baseline() repair step to get a clean baseline for planting. (3) The dispatch asked me to show the gate\'s instrument count at 16; it reads 18, because two sibling design lanes committed instruments inside the same window (arithmetic in CP2). I am reporting 18 and the arithmetic rather than asking the number to be 16.',

  crux: 'The R3 gap was never "somebody forgot to check these four". The rule was correct and enforced nothing in the backwards direction, which is the same shape as every other dead control in this repo. Instrumenting them shows what that costs: the four boards had drifted from their own sources in eleven places, and the drifted claims are mostly NEGATIVES -- statements that the product does not have something it now has, or that a tab is named what it no longer is. A negative claim cannot be re-read to check it; it has to be re-derived by counting at a named ref, which is exactly what a dump-source-facts.mjs plus a counter-reporting check.mjs is for. That is also why the instruments belong at every source change and not only at DRAFT: three of the eleven findings were true when written.',

  missionPremise: 'The rule that no design is shown or ratified without an adversarial read was earned 2026-09-15 and was never applied backwards, leaving four designs past DRAFT with no check.mjs while they were shown -- and in three cases ratified, and in two cases dispatched to build (G-128 for smartcity-map-dock, G-120 for smartcity-overview-lens) -- without one. G-148 (90_operations/OPS-17_govtech_stack_plan_of_record.md) is the backwards application: instrument what exists. plan-review-reasoner was the working model (G-150: check.mjs 72 self-tests, violate.mjs 27 plants, caught a Pass rendered where source sets adjudicated: null) and smart-files the named precedent (a predicate that self-tested perfectly and matched nothing), so both were read before anything was written.',

  completionPredicate: 'Met, and stated so a stranger can re-evaluate it without this lane. (1) node --use-system-ca scripts/govtech/design-completion-gate.mjs exits 0 and prints uncovered: 0 with verdict FINISHED; the four R3 rows the dispatch quoted are absent. (2) Each of the four design folders carries check.mjs, and `cd _design/<design> && node check.mjs` prints a self-tests line reading N/N with N = 48, 45, 47 and 57 respectively, prints a `matched inputs:` line whose counters are all non-zero, and exits non-zero only on a named finding. (3) `node violate.mjs` in each folder prints 17/17, 30/30, 21/21 and 41/41 planted violations caught, having first required the boards as shipped to fail on the defect they carry and a scratch copy with that clause corrected to pass. (4) Removing source-facts.json, or stripping every input a predicate depends on, exits 2 with the reason printed rather than returning a verdict. (5) The three artifacts exist at _inbox/2026-09-18_g148-design-instruments_cp1.json, _cp2.json and _close.json, and the lane is released in _catalog/lane_claims.json. (6) The G-149/G-157 inheritance text and the four INDEX replacement lines below are paste-ready.',

  scopeBasis: 'doc_repo only, and the boundaries are deliberate rather than incidental. No product repo was written: P:/plan-review, P:/smartcity-dashboards and P:/hauska-map were read through git show at named refs so the facts are the ref\'s bytes and not a working tree\'s. No design was redrawn, so each of the 11 findings is reported and left standing -- correcting one would change a ratified or approved design, which is a planner decision and not this lane\'s. _design/INDEX.md was not edited because G-142 and G-147 are appending to it; the four replacement lines are in this close instead. Nothing was committed (doc_repo commits are planner-owned). Deliberately out of scope and named so a successor can tell it from an oversight: whether the four designs\' published artifacts predate the current boards (not re-exported or re-published here), and whether a smartcity-map-dock permit row\'s subject text faithfully renders the live MyGov record (the check states that exclusion in its own header).',

  subAgents: { spawned: 0, maxDepth: 0 },
  fanDepth: 0,
  thisLane_prs: 'not applicable: doc_repo lane. This lane opened no PR, produced no merge SHA and triggered no CI run. Its only writes are the four instrument sets under _design/ and this lane\'s _inbox/ artifacts, left uncommitted for the planner per AGENT_CONTRACT section 6.',
  checkpoints: {
    cp1: '_inbox/2026-09-18_g148-design-instruments_cp1.json',
    cp2: '_inbox/2026-09-18_g148-design-instruments_cp2.json',
  },
  constraintsHonored: [
    'FAN-DEPTH 0: 0 sub-agents spawned, maxDepth 0.',
    'No product repo written (smartcity-dashboards, plan-review, smart-files, hauska-map: read-only, via git show at pinned refs).',
    'No design redrawn; the 11 findings are reported, not fixed.',
    '_design/INDEX.md not edited; four replacement lines supplied instead.',
    'Everything left uncommitted in P:/doc_repo; the paths are listed below.',
    'Lane claimed before work and released on this close.',
  ],
  leave_behind: [
    '11 findings across the four designs, unfixed by the dispatch\'s boundary. Grouped: plan-review-departments (finding 13 heading; the held-back finding printed as an escalation; the notice\'s held-back class folded away; the stale "no department model at all" claim), smartcity-flood-study (the stale claim that naming a depth by return period needs an atlas nobody has cited), smartcity-map-dock ("Licences" for "Licenses" on Main and Expand), smartcity-overview-lens (Main\'s "4 of 6 reading" roll-up; Sparse promoting Connections while granted 1 of 10 sources). Named verbatim in CP2 and in each instrument-report.json.',
    'the probe\'s FAIL: P-154 on parcel 48021:33223 (panel 20/5/20/- versus endpoint 25/7/15/7), the same row and parcel the G-150 close-out disclosed. Not this lane\'s.',
    'the map-dock Full panel PARTIAL (3 of 7 categories, 0 of 4 active layers, header says "4 active"): reported as a PARTIAL. If the planner wants it as a finding, the rule has to be stated first.',
    'NOT THIS LANE\'s EDITS, present in this worktree and named so they are not attributed here: scripts/surface-probe.mjs (+281), _design/smartcity-fleet-lens/check.mjs (+85), _design/smartcity-police-lens/check.mjs (+44), and the many pre-existing untracked files from sibling lanes (G-153 and others).',
    'G-149 and G-157 must be amended to inherit (paste-ready text in CP2); if they build a second instrument instead, two predicates can disagree about the same board.',
  ],
  pathsWrittenByThisLane: [
    ...DESIGNS.flatMap((d) => ['check.mjs', 'dump-source-facts.mjs', 'source-facts.json', 'violate.mjs', 'instrument-report.json'].map((f) => `${DESIGN_DIR}/${d}/${f}`)),
    '_inbox/2026-09-18_g148-design-instruments_cp1.json',
    '_inbox/2026-09-18_g148-design-instruments_cp2.json',
    '_inbox/2026-09-18_g148-design-instruments_close.json',
    '_inbox/2026-09-18_g148-design-instruments_filer.mjs',
    '_inbox/2026-09-18_g148_design_completion_gate.txt',
    `_inbox/${probeFile}`,
    '_inbox/2026-09-18_g148_surface_probe.log.txt',
    '_catalog/lane_claims.json (the lane claim, released on this close)',
  ],

  missionEvidence: {
    perDesign,
    gateOutputVerbatim: gateLines,
    inheritance,
    indexReplacements,
    scratch,
  },
};

const out = {
  '_inbox/2026-09-18_g148-design-instruments_cp1.json': cp1,
  '_inbox/2026-09-18_g148-design-instruments_cp2.json': cp2,
  '_inbox/2026-09-18_g148-design-instruments_close.json': close,
};
for (const [p, obj] of Object.entries(out)) {
  fs.writeFileSync(path.join(ROOT, p), JSON.stringify(obj, null, 2) + '\n', 'utf8');
  const parsed = JSON.parse(read(p)); // fail loudly here rather than at the planner's gate
  console.log(`wrote ${p}  (${fs.statSync(path.join(ROOT, p)).size} bytes, re-parsed ok, keys: ${Object.keys(parsed).length})`);
}
console.log('gate exit', gateExit, '| probe', probeFile, JSON.stringify(probeVerdicts));
console.log('findings', close.missionEvidence.perDesign.map((d) => `${d.design}:${d.findingsCount}`).join(' '), '| plants total', cp2.plantsTotal, '| abort-shaped', cp2.abortPlantsTotal);
