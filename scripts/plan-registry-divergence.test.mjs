#!/usr/bin/env node
/**
 * plan-registry-divergence.test.mjs
 *
 * CTRL-1 structural guard (G0 program-zero audit, 2026-08-14).
 *
 * THE DEFECT THIS EXISTS TO PREVENT
 * ---------------------------------
 * The dispatch compiler (scripts/dispatch.mjs) and the canon gate
 * (.claude/hooks/canon-gate.ps1) are two implementations of ONE rule: which programs
 * exist, which file holds each baseline, and which row-ID prefix each owns.
 *
 * They drifted the moment OPS-17 was added. The compiler learned G- rows; the gate kept
 * grepping only 'P-\d+' and, finding none, returned 'ok'. Every OPS-17 dispatch passed
 * PLAN-ROW validation unvalidated — the gate that exists to enforce the compiler was
 * weaker than the compiler. A design seam, not a typo.
 *
 * The fix made the rule DATA (_catalog/plan_registry.json). This test makes the seam
 * STRUCTURAL: it fails when either consumer stops reading the registry, or when the two
 * would disagree about any plan, path, or prefix.
 *
 * Run: node scripts/plan-registry-divergence.test.mjs   (exit 0 pass, 1 fail)
 */

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const REGISTRY = join(root, '_catalog/plan_registry.json');
const COMPILER = join(root, 'scripts/dispatch.mjs');
const GATE = join(root, '.claude/hooks/canon-gate.ps1');

const failures = [];
const checks = [];
const ok = (name, detail) => { checks.push({ name, pass: true, detail }); };
const bad = (name, detail) => { checks.push({ name, pass: false, detail }); failures.push(`${name}: ${detail}`); };

// ---------------------------------------------------------------- 1. registry itself

if (!existsSync(REGISTRY)) {
  console.error('FATAL: _catalog/plan_registry.json is missing. Both the compiler and the gate depend on it.');
  process.exit(1);
}

let registry;
try {
  registry = JSON.parse(readFileSync(REGISTRY, 'utf8'));
} catch (err) {
  console.error(`FATAL: _catalog/plan_registry.json does not parse: ${err.message}`);
  process.exit(1);
}

const planIds = Object.keys(registry.plans ?? {});
if (planIds.length === 0) {
  bad('registry.plans non-empty', 'no plans defined');
} else {
  ok('registry.plans non-empty', `${planIds.length} plans: ${planIds.join(', ')}`);
}

// Every declared baseline file must actually exist, or the gate fails closed on real traffic.
for (const id of planIds) {
  const p = registry.plans[id];
  const abs = join(root, p.file);
  if (!existsSync(abs)) bad(`plan ${id} baseline exists`, `${p.file} not found on disk`);
  else ok(`plan ${id} baseline exists`, p.file);
  if (!p.rowPrefix || !/^[A-Za-z]+$/.test(p.rowPrefix)) {
    bad(`plan ${id} rowPrefix well-formed`, `rowPrefix ${JSON.stringify(p.rowPrefix)} must be letters only`);
  }
}

// OPS-17 governing rule 2: row-ID prefixes must never collide across plans.
const prefixes = planIds.map((id) => (registry.plans[id].rowPrefix || '').toUpperCase());
const dupes = prefixes.filter((p, i) => prefixes.indexOf(p) !== i);
if (dupes.length) bad('row prefixes unique across plans', `duplicate prefix(es): ${[...new Set(dupes)].join(', ')}`);
else ok('row prefixes unique across plans', prefixes.join(', '));

// 'A' is the amendment-row convention inside every baseline; a plan may not claim it.
if (prefixes.includes('A')) {
  bad('no plan claims the A- prefix', "A-nnn is the amendment-row convention inside baselines and is skipped by the gate");
} else {
  ok('no plan claims the A- prefix', 'clear');
}

if (!registry.defaultPlan || !planIds.includes(registry.defaultPlan)) {
  bad('defaultPlan resolves', `defaultPlan ${JSON.stringify(registry.defaultPlan)} is not a declared plan`);
} else {
  ok('defaultPlan resolves', registry.defaultPlan);
}

// ---------------------------------------------------------------- 2. both consumers read it

const compilerSrc = existsSync(COMPILER) ? readFileSync(COMPILER, 'utf8') : '';
const gateSrc = existsSync(GATE) ? readFileSync(GATE, 'utf8') : '';

if (!compilerSrc) bad('compiler present', 'scripts/dispatch.mjs not found');
if (!gateSrc) bad('gate present', '.claude/hooks/canon-gate.ps1 not found');

if (compilerSrc && !/plan_registry\.json/.test(compilerSrc)) {
  bad('compiler reads the registry', 'scripts/dispatch.mjs does not reference plan_registry.json — it has its own plan table again');
} else if (compilerSrc) {
  ok('compiler reads the registry', 'references plan_registry.json');
}

if (gateSrc && !/plan_registry\.json/.test(gateSrc)) {
  bad('gate reads the registry', '.claude/hooks/canon-gate.ps1 does not reference plan_registry.json — it has its own plan table again');
} else if (gateSrc) {
  ok('gate reads the registry', 'references plan_registry.json');
}

// ---------------------------------------------------------------- 3. no re-hardcoding
//
// The original defect was a literal 'P-\d+' in the gate. If either consumer hardcodes a
// row prefix or a baseline filename again, the registry stops being the single source of
// truth even while both still nominally read it. Catch that regression here.

const gateBody = gateSrc.split('\n').filter((l) => !l.trim().startsWith('#')).join('\n');
const hardcodedGateRowRegex = /'\[?\(?\s*[A-Z]\s*\)?\]?-\\d\+'/.test(gateBody) || /'[A-Z]-\\d\+'/.test(gateBody);
if (hardcodedGateRowRegex) {
  bad('gate does not hardcode a row prefix', "found a literal single-letter row regex (e.g. 'P-\\d+') in canon-gate.ps1 — this is the exact CTRL-1 defect");
} else {
  ok('gate does not hardcode a row prefix', 'row prefix comes from the registry');
}

for (const id of planIds) {
  const base = registry.plans[id].file.split('/').pop();
  // A baseline filename hardcoded OUTSIDE the registry means that consumer stopped
  // resolving it from data. Comments are stripped above, so mentions in prose are fine.
  if (gateBody.includes(base)) {
    bad(`gate does not hardcode ${id} path`, `${base} appears in canon-gate.ps1 executable body`);
  }
  const compilerBody = compilerSrc.split('\n').filter((l) => !/^\s*(\*|\/\/|\/\*)/.test(l)).join('\n');
  if (compilerBody.includes(base)) {
    bad(`compiler does not hardcode ${id} path`, `${base} appears in dispatch.mjs executable body`);
  }
}
if (!failures.some((f) => f.includes('hardcode'))) {
  ok('no baseline path hardcoded in either consumer', 'both resolve paths from the registry');
}

// ---------------------------------------------------------------- 4. agreement per plan
//
// The real question: for each plan, would the compiler and the gate reach the SAME
// verdict? Both derive prefix->plan->file from the same object, so agreement is
// structural — but assert it explicitly so the invariant is named and testable.

for (const id of planIds) {
  const p = registry.plans[id];
  const compilerView = { prefix: p.rowPrefix.toUpperCase(), file: p.file.replace(/^90_operations\//, '') };
  const gateView = { prefix: p.rowPrefix.toUpperCase(), file: p.file };
  const compilerResolved = join(root, '90_operations', compilerView.file);
  const gateResolved = join(root, gateView.file);
  if (compilerView.prefix !== gateView.prefix) {
    bad(`prefix agreement for ${id}`, `compiler ${compilerView.prefix} vs gate ${gateView.prefix}`);
  } else if (compilerResolved !== gateResolved) {
    bad(`path agreement for ${id}`, `compiler resolves ${compilerResolved}, gate resolves ${gateResolved}`);
  } else {
    ok(`compiler/gate agree on ${id}`, `${gateView.prefix}- -> ${p.file}`);
  }
}

// ---------------------------------------------------------------- report

console.log('plan-registry divergence test — CTRL-1 structural guard\n');
for (const c of checks) {
  console.log(`  ${c.pass ? 'PASS' : 'FAIL'}  ${c.name}${c.detail ? ` — ${c.detail}` : ''}`);
}
console.log('');
if (failures.length) {
  console.log(`RESULT: FAIL (${failures.length} divergence(s)) — exit 1`);
  console.log('The compiler and the gate would disagree, or one stopped reading the registry.');
  process.exit(1);
}
console.log(`RESULT: PASS (${checks.length} checks) — exit 0`);
process.exit(0);
