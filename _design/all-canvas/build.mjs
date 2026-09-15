import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/* Every design in _design on ONE canvas.

   This folder authors nothing. It re-exports each surface's artboards under unique
   stems (the canvas requires them) and lays them out in rows, one row per surface.
   The originals in each surface folder stay the source: change a design there, re-run
   its gen.mjs, then re-run this.

     node build.mjs

   The copies it writes are derived and gitignored. */

const HERE = fileURLToPath(new URL('.', import.meta.url));
const DESIGN = path.resolve(HERE, '..');

const GUT_X = 140;   // between artboards in a row
const ROW_GAP = 300; // below the tallest artboard in a row, leaving room for the next label

/* One row per surface, in program order: shipped, then designed-not-built, then new,
   then the one deliberately kept as a record. `as` must be a unique stem across the
   whole canvas; `Main` is the entry artboard and is the product's own entry screen. */
const ROWS = [
  {
    surface: 'Overview',
    note: 'OVERVIEW LENS — RATIFIED, shipped G-120. Map pinned as G-121.\nThe city’s first screen at three data states. Tiles are filtered entry points, not statistics. Connections PROMOTES to the top on a pack that reads nothing and demotes when it reads, so zero renders as "here is what to connect next" rather than as a broken page.',
    from: 'smartcity-overview-lens',
    boards: [['Main.dc.html', 'Main', 'Populated — Bastrop'], ['Sparse.dc.html', 'OverviewSparse', 'Sparse — newly onboarded'], ['Empty.dc.html', 'OverviewEmpty', 'Empty pack']],
  },
  {
    surface: 'Development services',
    note: 'DEVELOPMENT SERVICES — shipped G-123, 20 of 20 live checks. COMPLETE as of 2026-09-15: Inspections, Code enforcement and Licenses shipped in the nav and had never been designed, and this is the lens the first cohort opens daily.\nAll five operational tabs under one table treatment, three tiers instead of two walls of numbers. Each tab carries a second axis and the three are NOT the same shape — inspections paired, code enforcement ordered, licences continuous — so each is drawn as what it is. The free-text description stays OUT of scannable lists: on the live system it carries residents’ names and phone numbers. That is a design decision here, not a control; the field still needs a real gate.\nFour defects were fixed here on 2026-09-15 and every one was found by comparing the canvas against the product source, never by re-reading the canvas: a PLACE tab the product never had (the map became a dock rail); five named people on the Manager load strip, traceable to no source in either repository; the licence rows in the wrong sort order (within a band the sort is by expiry offset, not by id); and three residents named beside their addresses on Pipeline, two of them the same people the folder README quotes as PII the design must not render. `node check.mjs` in that folder refuses all four.',
    from: 'smartcity-dev-services',
    boards: [['Main.dc.html', 'DevServices', 'Pipeline — default tab'], ['Inspections.dc.html', 'DevServicesInspections', 'Inspections — paired second axis'], ['WorkOrders.dc.html', 'DevServicesWorkOrders', 'Work orders — load + pagination'], ['CodeEnforcement.dc.html', 'DevServicesCodeEnforcement', 'Code enforcement — ordered second axis'], ['Licences.dc.html', 'DevServicesLicences', 'Licenses — continuous second axis'], ['Empty.dc.html', 'DevServicesEmpty', 'Empty pack']],
  },
  {
    surface: 'Map dock',
    note: 'MAP DOCK — APPROVED, shipped G-128.\nThe map as a persistent rail beside the work rather than a page staff leave for. Three dock states; the layers panel appears only at Full. This ruling is what superseded the Place tab at the far end of this canvas.',
    from: 'smartcity-map-dock',
    boards: [['Main.dc.html', 'MapDock', '1 — Dock, stacked in the rail'], ['Expand.dc.html', 'MapDockExpand', '2 — Expand, map over 2/3'], ['Full.dc.html', 'MapDockFull', '3 — Full, permit row + details + layers']],
  },
  {
    surface: 'Plan review',
    note: 'PLAN REVIEW — IN REVIEW, never dispatched.\nThe furthest along on paper and the furthest behind in code. Seven peer tabs become one workflow spine: intake, applicability, findings, letter. Every finding carries the code section it came from and an uncertain finding is marked, never quietly passed.\nCARRIES A KNOWN DEFECT: the console renders engine identifiers where a reader expects a code citation, and the queue shows an internal QA note. Fix belongs in plan-review/gen.mjs.',
    from: 'plan-review',
    boards: [['Main.dc.html', 'PlanReviewQueue', 'Queue'], ['Review.dc.html', 'PlanReviewConsole', 'Review console — Applicability'], ['Embedded.dc.html', 'PlanReviewEmbedded', 'Embedded in Dashboards']],
  },
  {
    surface: 'Flood study',
    note: 'FLOOD STUDY — DRAFT 2026-09-15, not ratified.\nThe live tab is a paragraph and a dead button. Four moves: the tab becomes a SCREENING LIST over permits in flight; the regulatory FEMA zone and the modeled study are kept structurally apart and the model is badged NOT A DETERMINATION; rainfall depth becomes a control that governs the whole lens; and a running model is a real state where a timed-out parcel stays retryable instead of being recorded as no ponding.\nG-130 is enforced in the UI: the study downloads, citing it in a review letter is refused.',
    from: 'smartcity-flood-study',
    boards: [['Main.dc.html', 'FloodScreening', 'Screening — the list'], ['Parcel.dc.html', 'FloodParcel', 'One parcel — the study'], ['Depth.dc.html', 'FloodDepth', 'Depth — the four-inch question'], ['Running.dc.html', 'FloodRunning', 'Running — the model takes time'], ['Empty.dc.html', 'FloodEmpty', 'Unavailable, and its near neighbour']],
  },
  {
    surface: 'Plan review — the reasoner path',
    note: 'PLAN REVIEW, REASONER PATH — DRAFT 2026-09-15, not ratified.\nOperator ruling: a COMPANION product, not a plan review system. No markup, no stamping, no document workflow. We do applicability from the adopted edition, findings cited to real code, and honest absence.\nPROVENANCE OVER REACHABILITY: Pass and Fail are reachable today, from a number typed on an intake form. The viewer does not unlock the determination, it upgrades the input from an assertion to a reading. An earlier draft claimed the opposite and the code said so plainly.\nOne rule has an adjudicator and the screen badges every other one NO ADJUDICATOR. A finding with no section shows NO CITATION and cannot be issued.\nAbsence runs on TWO AXES that are never added: our corpus could not supply the rule, versus the section is fine and no adjudicator exists.',
    from: 'plan-review-reasoner',
    boards: [['Main.dc.html', 'ReasonerConsole', 'Console — sheet, pins, findings'], ['Reasoning.dc.html', 'ReasonerDerivation', 'Finding 1 — how it was reached'], ['Coverage.dc.html', 'ReasonerCoverage', 'Coverage — two axes'], ['Letter.dc.html', 'ReasonerLetter', 'The correction notice'], ['Cycle.dc.html', 'ReasonerCycle', 'Cycle 2']],
  },
  {
    surface: "Plan review — parallel departments",
    note: "PARALLEL DEPARTMENT REVIEW — DRAFT 2026-09-15. BLOCKED on a ruling amendment.\nThe 2026-09-14 identity ruling gates PLAN REVIEW to Development services and city-manager. Parallel review needs Fire, Public works and Parks to reach it, so as ruled this cannot be built. The proposed amendment uses that ruling own logic: a department reaches plan review only through its OWN SCOPE, which is what the ruling says makes Overview a roll-up rather than a leak.\nWE DO NOT ROUTE, WE SCOPE. Which departments get a submittal is the city decision. What a finding BELONGS to is decided by the section it cites, through a map the city declares once. A section absent from that map does not default to Development services — it goes UNROUTED, and so does one that two departments both claim.\nCOVERAGE IS PER DEPARTMENT, because a gap is not shared. Public works has zero cited rules here and the product says so rather than implying coverage.\nTWO DEPARTMENTS ARE TWO AUTHORITIES: name both, pick neither, escalate. Not the stricter number, not the one with a citation.\nTHE BOARD IS ABOUT THE APPLICATION, NEVER THE PEOPLE. No staff ranking, no individual throughput.",
    from: "plan-review-departments",
    boards: [["Main.dc.html", "DeptRouting", "Routing — scope, not dispatch"], ["Department.dc.html", "DeptOneLane", "One department — Fire sees Fire"], ["Board.dc.html", "DeptBoard", "Where the application is waiting"], ["Conflict.dc.html", "DeptConflict", "Two departments, two authorities"], ["Letter.dc.html", "DeptLetter", "One notice, four departments"]],
  },
  {
    surface: 'Finance lens',
    note: 'FINANCE LENS — DRAFT 2026-09-15, not ratified. Drawn against the 25-page v1 capture supplied by the operator.\nTHE BRIEF IS AN OPERATOR CORRECTION: removing the v1 fabrications is the GAP ANALYSIS, not the product. So the lens is drawn at FULL SHAPE — every cell it will ever hold exists on the page from the start, each one measured or countably unaccounted, and every unaccounted cell carries a named acquisition path. A missing column is invisible; an unaccounted cell is countable.\nFour states, not one number: MEASURED, UNACCOUNTED, REFUSED, CONFLICT. v1 has one state — a number — and that is the defect expressed once. Its Actual Spent column is the Budget column copied on all ten rows at 100% burn; its collection rate reads 157%, which is not a reachable state.',
    from: 'smartcity-finance-lens',
    boards: [['Main.dc.html', 'FinanceLens', 'Finance today — the full shape'], ['Departments.dc.html', 'FinanceDepartments', 'Departments — refused, not fabricated'], ['PermitRevenue.dc.html', 'FinancePermitRevenue', 'Permit fee revenue — the conflict is the output'], ['Acquisition.dc.html', 'FinanceAcquisition', 'What has to land, and who acts'], ['Connected.dc.html', 'FinanceConnected', 'Once the fund ledger lands — the target']],
  },
  {
    surface: 'Finance — Localgov filings',
    note: 'FINANCE / LOCALGOV FILINGS — DRAFT 2026-09-15, not ratified.\nThe headline is an AGREEMENT, not an amount: the page opens with whether two independently derived sources agree and by how much. Filed, Received and Booked are three different facts and each names its field and its system. The exception worklist checks the implied tax rate against the city ordinance, which is a second derivation rather than another field from the same payload.\nNOTHING HERE IS MEASURED: the endpoint has never been called and no credential exists.',
    from: 'smartcity-finance-filings',
    boards: [['Main.dc.html', 'FinanceReconciled', 'Reconciled — the default view'], ['Exceptions.dc.html', 'FinanceExceptions', 'Exceptions — the worklist'], ['Lodging.dc.html', 'FinanceLodging', 'Lodging economy'], ['Unlabelled.dc.html', 'FinanceUnlabelled', 'Unlabelled — tax type unconfirmed'], ['Empty.dc.html', 'FinanceEmpty', 'Empty — no grant']],
  },
  {
    surface: 'Smart Files',
    note: "SMART FILES — DRAFT 2026-09-15, not ratified. Drawn against the smart-files repo at origin/main 61c84f6: its own repo, its own database, its own serving process.\nTHE DASHBOARDS \"FILES\" NAV ITEM IS A MOUNT POINT and says so on itself, so designing it there would be designing a frame.\nSmart Files is NOT a file browser, and its best properties are exactly the ones a browser has nowhere to put: whether a document text is searchable and WHY NOT (three named reasons), that a second upload under the same slug is a REVISION of one document rather than a sibling, who captured it in what declared role (five keys, and the write REFUSES without them), and what it is placed against rather than only which folder it sits in.\nCOVERAGE BEFORE RESULTS is the strongest move: a search box over a corpus where some documents were never indexed lies by omission. Here 12 searched, 19 not — and six of the seven with no text layer are plan sets, which is exactly where a drainage easement would be drawn.",
    from: 'smart-files',
    boards: [["Main.dc.html","SmartFilesRoom","The room — the row carries what the product knows"], ["Search.dc.html","SmartFilesSearch","Search — coverage before results"], ["Document.dc.html","SmartFilesDocument","One document — a revision, not a sibling"], ["Refusals.dc.html","SmartFilesRefusals","Two refusals, drawn as first class"], ["Gaps.dc.html","SmartFilesGaps","Built in the service, no surface"]],
  },
  {
    surface: 'Place tab',
    note: 'PLACE TAB — SUPERSEDED 2026-09-14, kept on purpose.\nThe v1-parity option, replaced when the map became a persistent rail. It stays on this canvas so the next person can see the option not taken and why, rather than re-proposing it.',
    from: 'smartcity-place-tab',
    boards: [['Main.dc.html', 'PlaceTab', 'Main'], ['OtherCity.dc.html', 'PlaceTabOtherCity', 'Other city'], ['Unselected.dc.html', 'PlaceTabUnselected', 'Unselected']],
  },
];

/* Read an artboard, take its REAL root dimensions. Frame w/h must match the root or the
   canvas clips it: four of these are not 1600x1040 and assuming would have cut them. */
function readBoard(from, file) {
  const src = path.join(DESIGN, from, file);
  const raw = fs.readFileSync(src, 'utf8');
  const m = raw.match(/<div class="\{\{themeClass\}\}" style="width:(\d+)px; height:(\d+)px/);
  if (!m) throw new Error('no root dimensions in ' + from + '/' + file);
  return { raw, w: Number(m[1]), h: Number(m[2]) };
}

const artboards = [];
const annotations = [];
let y = 0;
let maxRight = 0;

for (const row of ROWS) {
  const read = row.boards.map(([file, , ]) => readBoard(row.from, file));
  const rowH = Math.max(...read.map((r) => r.h));

  annotations.push({
    id: 'row-' + row.from,
    x: 0,
    y: y - 230,
    w: 900,
    text: row.note,
  });

  let x = 0;
  row.boards.forEach(([file, stem, title], i) => {
    const b = read[i];
    fs.writeFileSync(path.join(HERE, stem + '.dc.html'), b.raw);
    artboards.push({ file: stem + '.dc.html', x, y, w: b.w, h: b.h, title });
    x += b.w + GUT_X;
  });
  maxRight = Math.max(maxRight, x - GUT_X);
  y += rowH + ROW_GAP;
}

annotations.unshift({
  id: 'canvas-brief',
  x: 0,
  y: -540,
  w: 1200,
  text:
    'SMARTCITY — EVERY DESIGN ON ONE CANVAS. ' + artboards.length + ' artboards across ' + ROWS.length + ' surfaces, one row per surface.\n' +
    'Read top to bottom: shipped, then designed-and-never-built, then the two drafted this week, then the one kept as a record of an option not taken.\n\n' +
    'Palette and type ramp are the frozen sc-kit, byte-identical across every folder. Tokens are copied from the product, never invented.\n' +
    'EVERY FIGURE ON EVERY ARTBOARD IS FIXTURE. Nothing here is measured, and two surfaces (Finance, Flood study) describe systems that are not connected yet.\n\n' +
    'This canvas authors nothing. Each artboard is a copy of its surface folder’s own file; edit the design there, re-run its gen.mjs, then re-run _design/all-canvas/build.mjs.',
});

fs.writeFileSync(path.join(HERE, 'canvas.json'), JSON.stringify({ artboards, annotations, launch: { view: 'canvas' } }, null, 2));

const stems = artboards.map((a) => a.file.toLowerCase());
if (new Set(stems).size !== stems.length) throw new Error('duplicate artboard stem');
if (!stems.includes('main.dc.html')) throw new Error('no entry artboard named Main');

console.log(
  'wrote ' + artboards.length + ' artboards + canvas.json — ' + ROWS.length + ' rows, ' +
  'extent ' + maxRight + ' x ' + (y - ROW_GAP) + 'px'
);
console.log('  ' + artboards.map((a) => a.file.replace('.dc.html', '')).join(', '));
