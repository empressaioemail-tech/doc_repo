#!/usr/bin/env node
/**
 * design-completion-gate.mjs — OPS-17 G-146.
 *
 * Is the design work finished?
 *
 * "Finished" is not a folder count. 48 boards across 11 folders reads as a lot
 * of design and says nothing about whether the surfaces a city actually clicks
 * are drawn, or whether the ones already shown to people were ever checked.
 * This gate asks the two questions a count cannot:
 *
 *   R1/R2  Does the declaration agree with the filesystem, both directions?
 *   R3     Does every design past DRAFT carry an adversarial read that PASSES?
 *          (existence was the old question, and it went green over four designs
 *          whose own instruments exited 1; see OPS-17 A-155, A-156, A-159)
 *   R4     Is every surface in the SHIPPED nav either designed or excluded by
 *          a dated ruling?
 *
 * THREE independently derived inputs, so no single party can satisfy every
 * half: the product's own nav constants (`smartcity-dashboards`
 * `src/staff-review.mjs` at a named ref), the `_design/` folder inventory on
 * disk, and the declarations in `_design/INDEX.md` and
 * `_design/surface_coverage.json`. A wrong declaration fails against the
 * filesystem; a stale folder fails against the nav.
 *
 * It is a REFUSAL, not a report. It exits non-zero while design is unfinished
 * and goes green only when it is done, which is the whole point: this repo has
 * a measured record of building detectors nobody reads.
 *
 * Exit codes: 0 finished, 1 unfinished (findings printed), 2 abort.
 *
 * Self-tests: `node design-completion-gate.test.mjs` — offline, both
 * directions, including a fixture that PASSES so the failing path is not the
 * only one ever exercised.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const STATUS_WORDS = ['RATIFIED', 'APPROVED', 'IN REVIEW', 'SUPERSEDED', 'AMEND', 'DRAFT'];

/* ----------------------------------------------------------------- pure */

/**
 * Pull `id: "x"` entries out of an exported array constant in the product's
 * own source. Returns null when the constant is absent, so a rename ABORTS
 * rather than comparing against an empty list and reporting full coverage.
 */
export function extractIdArray(sourceText, constName) {
  if (typeof sourceText !== 'string' || !sourceText) return null;
  const src = sourceText.replace(/\r\n/g, '\n');
  const m = src.match(new RegExp(String.raw`export const ${constName} = \[([^\]]*)\]`));
  if (!m) return null;
  const body = m[1];
  const out = [];
  // Entries are either quoted literals or references to exported consts.
  for (const tok of body.split(',').map((s) => s.trim()).filter(Boolean)) {
    const q = tok.match(/^["']([^"']+)["']$/);
    if (q) {
      out.push(q[1]);
      continue;
    }
    const ref = src.match(new RegExp(String.raw`export const ${tok} = ["']([^"']+)["']`));
    if (ref) out.push(ref[1]);
    else return null; // unresolved reference: refuse rather than silently short a list
  }
  return out.length ? out : null;
}

/** Spread constants such as `[...LEAD_LENS_IDS, ...ROSTER_LENS_IDS]`. */
export function extractSpreadArray(sourceText, constName) {
  if (typeof sourceText !== 'string' || !sourceText) return null;
  const src = sourceText.replace(/\r\n/g, '\n');
  const m = src.match(new RegExp(String.raw`export const ${constName} = \[([^\]]*)\]`));
  if (!m) return null;
  const parts = m[1].split(',').map((s) => s.trim()).filter(Boolean);
  const out = [];
  for (const p of parts) {
    const spread = p.match(/^\.\.\.(\w+)$/);
    if (!spread) return null;
    const inner = extractIdArray(src, spread[1]);
    if (!inner) return null;
    out.push(...inner);
  }
  return out.length ? out : null;
}

/** One entry per `- [Title](folder/) — ... STATUS ...` line in _design/INDEX.md. */
export function parseIndex(indexText) {
  if (typeof indexText !== 'string' || !indexText) return [];
  const out = [];
  for (const line of indexText.replace(/\r\n/g, '\n').split('\n')) {
    const m = line.match(/^-\s*\[[^\]]+\]\(([^)]+)\)\s*(.*)$/);
    if (!m) continue;
    const folder = m[1].replace(/\/+$/, '');
    const rest = m[2];
    // Longest status word first so "IN REVIEW" is not shadowed by a shorter one.
    const status =
      STATUS_WORDS.slice()
        .sort((a, b) => b.length - a.length)
        .find((w) => rest.includes(w)) || null;
    out.push({ folder, status, line: rest });
  }
  return out;
}

/**
 * @param {{navLenses:string[]|null, navWork:string[]|null, folders:{name:string,hasCheck:boolean}[],
 *          index:{folder:string,status:string|null}[], coverage:object}} input
 */
export function evaluate(input) {
  const findings = [];
  const { navLenses, navWork, folders, index, coverage } = input;

  // A check with no inputs is worse than no check. Abort, never pass.
  if (!navLenses || !navLenses.length) {
    return { verdict: 'ABORT', reason: 'nav lens list did not resolve from product source', findings, counts: {} };
  }
  if (!navWork || !navWork.length) {
    return { verdict: 'ABORT', reason: 'nav work list did not resolve from product source', findings, counts: {} };
  }
  if (!folders || !folders.length) {
    return { verdict: 'ABORT', reason: 'no design folders found on disk', findings, counts: {} };
  }
  if (!index || !index.length) {
    return { verdict: 'ABORT', reason: '_design/INDEX.md declared no designs', findings, counts: {} };
  }

  const folderNames = new Set(folders.map((f) => f.name));
  const indexByFolder = new Map(index.map((e) => [e.folder, e]));
  // A DERIVED view (build.mjs, no gen.mjs) is a legitimate INDEX.md entry --
  // all-canvas composes the other folders' boards and carries no design of its
  // own. It satisfies R2 and is exempt from R1 and R3, because requiring an
  // adversarial read of a view that only re-renders already-checked boards
  // would be a control wider than its claim.
  const derived = new Set(input.derivedFolders || []);

  // R1 — every folder on disk is declared in INDEX.md.
  for (const f of folders) {
    if (!indexByFolder.has(f.name)) {
      findings.push({ rule: 'R1', surface: f.name, detail: `design folder on disk is not listed in _design/INDEX.md` });
    }
  }

  // R2 — every INDEX.md entry points at a folder that exists.
  for (const e of index) {
    if (!folderNames.has(e.folder) && !derived.has(e.folder)) {
      findings.push({ rule: 'R2', surface: e.folder, detail: `_design/INDEX.md lists a folder that does not exist on disk` });
    }
  }

  // R3 — anything past DRAFT carries an adversarial read that PASSES.
  // Existence is not the question. Until A-159 this rule tested `hasCheck`, so it
  // could go green while four designs whose own instruments exited 1 were counted
  // as instrumented (A-155, A-156). `checkExit` is supplied by the IO layer, which
  // runs each instrument; null means it could not be executed to a verdict.
  const needsInstrument = new Set(coverage._instrumentRequiredWhenStatusIn || []);
  for (const f of folders) {
    const e = indexByFolder.get(f.name);
    if (!e || !e.status) continue;
    if (!needsInstrument.has(e.status)) continue;
    if (!f.hasCheck) {
      findings.push({
        rule: 'R3',
        surface: f.name,
        detail: `status ${e.status} with no check.mjs — shown or ratified without an adversarial read`,
      });
      continue;
    }
    if (f.checkExit === null || f.checkExit === undefined) {
      findings.push({
        rule: 'R3',
        surface: f.name,
        detail: `status ${e.status} and check.mjs could not be executed to a verdict — an unrunnable instrument is not a pass`,
      });
      continue;
    }
    if (f.checkExit !== 0) {
      findings.push({
        rule: 'R3',
        surface: f.name,
        detail: `status ${e.status} and check.mjs exits ${f.checkExit} on the boards as shipped — the design carries an open finding, not a missing instrument`,
      });
    }
  }

  // R4 — every shipped nav surface is designed or excluded by a dated ruling.
  const declaredLenses = coverage.lenses || {};
  const declaredWork = coverage.work || {};
  const checkSurface = (id, decl, kind) => {
    if (!decl) {
      findings.push({ rule: 'R4', surface: `${kind}:${id}`, detail: 'ships in the nav and is not declared in surface_coverage.json' });
      return;
    }
    if (decl.folder) {
      if (!folderNames.has(decl.folder)) {
        findings.push({ rule: 'R4', surface: `${kind}:${id}`, detail: `declared folder ${decl.folder} does not exist` });
      }
      return;
    }
    if (decl.excluded) {
      if (!decl.ruledOn) {
        findings.push({ rule: 'R4', surface: `${kind}:${id}`, detail: 'excluded with no ruling date — an exclusion without a date is an opinion' });
      }
      return;
    }
    findings.push({
      rule: 'R4',
      surface: `${kind}:${id}`,
      detail: `no design and no exclusion ruling${decl.planRow ? ` (carded ${decl.planRow})` : ' and NOT CARDED'}`,
    });
  };
  for (const id of navLenses) checkSurface(id, declaredLenses[id], 'lens');
  for (const id of navWork) checkSurface(id, declaredWork[id], 'work');

  // A declaration naming a surface the product does not ship is drift too.
  for (const id of Object.keys(declaredLenses)) {
    if (!navLenses.includes(id)) findings.push({ rule: 'R4', surface: `lens:${id}`, detail: 'declared but not in the shipped nav' });
  }
  for (const id of Object.keys(declaredWork)) {
    if (!navWork.includes(id)) findings.push({ rule: 'R4', surface: `work:${id}`, detail: 'declared but not in the shipped nav' });
  }

  const counts = {
    navSurfaces: navLenses.length + navWork.length,
    folders: folders.length,
    withInstrument: folders.filter((f) => f.hasCheck).length,
    passingInstrument: folders.filter((f) => f.hasCheck && f.checkExit === 0).length,
    designed: [...navLenses.map((i) => declaredLenses[i]), ...navWork.map((i) => declaredWork[i])].filter(
      (d) => d && d.folder,
    ).length,
    excluded: [...navLenses.map((i) => declaredLenses[i]), ...navWork.map((i) => declaredWork[i])].filter(
      (d) => d && d.excluded,
    ).length,
  };

  return { verdict: findings.length ? 'UNFINISHED' : 'FINISHED', reason: '', findings, counts };
}

/* -------------------------------------------------------------------- io */

export function isDirectRun(argv1, importMetaUrl) {
  if (!argv1 || !importMetaUrl) return false;
  return pathToFileURL(argv1).href === importMetaUrl;
}

/**
 * Run a design folder's instrument and return its exit code, or null when it
 * could not be executed at all. R3 asks whether the adversarial read PASSES,
 * not whether a file exists: a gate that only counted instruments let four
 * designs report live failures while this script exited 0 (A-155, A-156).
 * Exit 2 is the instrument's own refusal to reach a verdict, and a spawn
 * failure is null, so a broken instrument is never read as a passing design.
 */
function runInstrument(folder) {
  try {
    execFileSync(process.execPath, ['check.mjs'], { cwd: folder, stdio: 'pipe' });
    return 0;
  } catch (e) {
    return typeof e.status === 'number' ? e.status : null;
  }
}

function main() {
  const docRepo = process.env.DOC_REPO_PATH || 'P:/doc_repo';
  const dashRepo = process.env.SMARTCITY_DASHBOARDS_PATH || 'P:/smartcity-dashboards';
  const ref = process.env.SMARTCITY_DASHBOARDS_REF || 'origin/main';
  const navFile = 'src/staff-review.mjs';

  let navSrc;
  let navSha;
  try {
    navSrc = execFileSync('git', ['-C', dashRepo, 'show', `${ref}:${navFile}`], {
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024,
    });
    navSha = execFileSync('git', ['-C', dashRepo, 'rev-parse', ref], { encoding: 'utf8' }).trim();
  } catch (e) {
    console.error(`ABORT — cannot read ${navFile} from ${dashRepo} @ ${ref}: ${e.message}`);
    process.exit(2);
  }

  const designDir = path.join(docRepo, '_design');
  const dirs = fs.readdirSync(designDir, { withFileTypes: true }).filter((d) => d.isDirectory());
  const has = (name, file) => fs.existsSync(path.join(designDir, name, file));
  // A DESIGN generates its own boards (gen.mjs). A DERIVED view only composes
  // them (build.mjs, no gen.mjs). Distinguishing the two is load bearing: the
  // first run of this gate reported all-canvas as a missing folder, which was
  // the instrument's defect and not a finding.
  const folders = dirs
    .filter((d) => has(d.name, 'gen.mjs'))
    .map((d) => {
      const hasCheck = has(d.name, 'check.mjs');
      return {
        name: d.name,
        hasCheck,
        checkExit: hasCheck ? runInstrument(path.join(designDir, d.name)) : null,
      };
    });
  const derivedFolders = dirs
    .filter((d) => !has(d.name, 'gen.mjs') && has(d.name, 'build.mjs'))
    .map((d) => d.name);

  const index = parseIndex(fs.readFileSync(path.join(designDir, 'INDEX.md'), 'utf8'));
  const coverage = JSON.parse(fs.readFileSync(path.join(designDir, 'surface_coverage.json'), 'utf8'));

  const result = evaluate({
    navLenses: extractSpreadArray(navSrc, 'ALL_LENS_IDS'),
    navWork: extractIdArray(navSrc, 'WORK_IDS'),
    folders,
    derivedFolders,
    index,
    coverage,
  });

  console.log('design-completion-gate  (OPS-17 G-146)');
  console.log(`  nav snapshot:    smartcity-dashboards ${ref} ${navSha.slice(0, 8)} :: ${navFile}`);
  console.log(`  design snapshot: ${designDir}`);
  console.log(`  read at:         ${new Date().toISOString()}`);
  console.log('');

  if (result.verdict === 'ABORT') {
    console.error(`  ABORT — ${result.reason}`);
    process.exit(2);
  }

  const c = result.counts;
  console.log(`  nav surfaces:        ${c.navSurfaces}`);
  console.log(`  designed:            ${c.designed}`);
  console.log(`  excluded by ruling:  ${c.excluded}`);
  console.log(`  uncovered:           ${c.navSurfaces - c.designed - c.excluded}`);
  console.log(`  design folders:      ${c.folders}, with an instrument: ${c.withInstrument}, of those passing: ${c.passingInstrument}`);
  console.log('');

  if (!result.findings.length) {
    console.log('  verdict: FINISHED — every nav surface is designed or excluded, and every design past DRAFT carries an instrument that exits 0.');
    process.exit(0);
  }

  const byRule = {};
  for (const f of result.findings) (byRule[f.rule] ||= []).push(f);
  const titles = {
    R1: 'design folders on disk that _design/INDEX.md does not list',
    R2: '_design/INDEX.md entries with no folder on disk',
    R3: 'designs past DRAFT whose adversarial read does not pass',
    R4: 'shipped nav surfaces neither designed nor excluded by a dated ruling',
  };
  for (const rule of ['R1', 'R2', 'R3', 'R4']) {
    if (!byRule[rule]) continue;
    console.log(`  ${rule} — ${titles[rule]} (${byRule[rule].length})`);
    for (const f of byRule[rule]) console.log(`      ${f.surface.padEnd(30)} ${f.detail}`);
    console.log('');
  }
  console.log(`  verdict: UNFINISHED — ${result.findings.length} findings. Design is not done.`);
  process.exit(1);
}

if (isDirectRun(process.argv[1], import.meta.url)) {
  main();
}
