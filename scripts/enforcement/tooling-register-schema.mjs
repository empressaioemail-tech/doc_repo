#!/usr/bin/env node
/**
 * BP-ENF-01 — tooling_register controls[] schema.
 *
 * Fail if any row in the controls array is missing the four three-question
 * fields. The file does not have an `executor` key. The mapping is:
 *   executor -> consumer
 *   trigger  -> trigger
 *   failure  -> failure
 *   bypass   -> bypass
 *
 * What executes: this script.
 * What triggers: ci-baseline.mjs via .github/enforcement-baseline.json, on
 * push/PR/workflow_dispatch through .github/workflows/enforcement.yml.
 * What fails: exit 1 listing each (id, missing field). Exit 2 if the register
 * cannot be read or controls is not an array, or if --self-test fails.
 * What bypasses: editing controlsNotNamedInMission (that array is not gated);
 * a row that answers the four questions with the string "None" (present, not
 * missing); a harness that does not run this script.
 *
 * Empty string / whitespace / absent key = missing. String "None" = present.
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const DEFAULT_REGISTER = join(ROOT, '_catalog', 'tooling_register.json');
const REQUIRED = ['consumer', 'trigger', 'failure', 'bypass'];

function hasValue(v) {
  if (v === undefined || v === null) return false;
  if (typeof v === 'string' && v.trim() === '') return false;
  return true;
}

function evaluate(register) {
  if (!register || !Array.isArray(register.controls)) {
    return { unmeasured: 'controls is not an array', hits: [] };
  }
  const hits = [];
  for (const row of register.controls) {
    const id = row && row.id ? String(row.id) : '(missing id)';
    for (const field of REQUIRED) {
      if (!hasValue(row ? row[field] : undefined)) {
        hits.push({ id, field });
      }
    }
  }
  return { unmeasured: null, hits };
}

/** Counts this file can recompute from its own controls array. Anything else in `counts` is a
 *  stated claim, not a checked one, and is reported as such rather than silently trusted. */
export const DERIVABLE_COUNT_KEYS = ['byStatus', 'byDerivationClass', 'controlsInFile', 'nonEmptyBypass', 'violationVerifiedNonNull', 'gapsFiled'];

/** Counts that are a single number rather than a bucket map. */
const DERIVABLE_NUMERIC_KEYS = ['controlsInFile', 'nonEmptyBypass', 'violationVerifiedNonNull', 'gapsFiled'];

export function derivedCounts(register) {
  const controls = Array.isArray(register?.controls) ? register.controls : [];
  const byStatus = {};
  const byDerivationClass = {};
  let nonEmptyBypass = 0;
  let violationVerifiedNonNull = 0;
  for (const row of controls) {
    const s = row?.status;
    if (s !== undefined && s !== null && String(s).trim() !== '') byStatus[String(s)] = (byStatus[String(s)] || 0) + 1;
    const d = row?.derivationClass;
    if (d !== undefined && d !== null && String(d).trim() !== '') byDerivationClass[String(d)] = (byDerivationClass[String(d)] || 0) + 1;
    if (hasValue(row?.bypass)) nonEmptyBypass += 1;
    if (hasValue(row?.violationVerified)) violationVerifiedNonNull += 1;
  }
  // gapsFiled is the length of the top-level gapsFiled array, so it IS derivable. It was
  // declared non-derivable until 2026-09-18, at which point the array was found one entry
  // longer than the declared count would have implied: the gap had been written into the
  // array and the number beside it was not. A count of an array in the same file is always
  // derivable; calling it "stated, not verified" was the hole, not the limit of the tool.
  const gapsFiled = Array.isArray(register?.gapsFiled) ? register.gapsFiled.length : 0;
  return { byStatus, byDerivationClass, controlsInFile: controls.length, nonEmptyBypass, violationVerifiedNonNull, gapsFiled };
}

/**
 * Compare the declared `counts` block against what the controls array actually contains.
 *
 * WHY. On 2026-09-18 the declared block read violationVerifiedNonNull 18 against an actual 34,
 * and docRepoControls 57 against 46 rows. Nothing recomputed it, so the numbers had drifted
 * silently while being read as facts about the register. A hand-maintained count is a claim
 * with no instrument behind it, which is the defect class this whole register exists to
 * document. Buckets absent from the actual set are treated as 0, so declaring STARVED: 0 when
 * no row carries that status is correct, not a mismatch.
 */
export function countsMismatches(register) {
  const declared = register?.counts;
  if (!declared || typeof declared !== 'object') {
    return [{ field: 'counts', declared: '(absent)', actual: '(present)', detail: 'the register declares no counts block' }];
  }
  const actual = derivedCounts(register);
  const out = [];

  for (const bucket of ['byStatus', 'byDerivationClass']) {
    const d = declared[bucket];
    if (!d || typeof d !== 'object') {
      out.push({ field: bucket, declared: '(absent)', actual: JSON.stringify(actual[bucket]), detail: 'a derivable bucket is missing from counts' });
      continue;
    }
    const keys = new Set([...Object.keys(d), ...Object.keys(actual[bucket])]);
    for (const k of keys) {
      const dv = d[k] ?? 0;
      const av = actual[bucket][k] ?? 0;
      if (dv !== av) out.push({ field: `${bucket}.${k}`, declared: dv, actual: av });
    }
  }

  for (const key of DERIVABLE_NUMERIC_KEYS) {
    if (declared[key] === undefined) {
      out.push({ field: key, declared: '(absent)', actual: actual[key], detail: 'a derivable count is missing from counts' });
      continue;
    }
    if (declared[key] !== actual[key]) out.push({ field: key, declared: declared[key], actual: actual[key] });
  }

  return out;
}

/** Keys present in `counts` that this control cannot recompute. Printed so a stated claim is
 *  never mistaken for a checked one. */
export function nonDerivableCountKeys(register) {
  const declared = register?.counts;
  if (!declared || typeof declared !== 'object') return [];
  return Object.keys(declared).filter((k) => !k.startsWith('_') && !DERIVABLE_COUNT_KEYS.includes(k));
}

function completeRow(over = {}) {
  return {
    id: 'FIX-COMPLETE',
    consumer: 'ci-baseline.mjs',
    trigger: 'push/PR',
    failure: 'exit 1',
    bypass: 'do not run CI',
    ...over,
  };
}

function selfTest() {
  const cases = [];
  const missingConsumer = { ...completeRow() };
  delete missingConsumer.consumer;
  cases.push({
    name: 'missing consumer fails',
    register: { controls: [missingConsumer] },
    expectFail: true,
  });
  cases.push({
    name: 'empty trigger fails',
    register: { controls: [completeRow({ trigger: '   ' })] },
    expectFail: true,
  });
  cases.push({
    name: 'complete row passes',
    register: { controls: [completeRow()] },
    expectFail: false,
  });
  cases.push({
    name: 'string None is present not missing',
    register: { controls: [completeRow({ consumer: 'None', trigger: 'None', failure: 'None' })] },
    expectFail: false,
  });
  cases.push({
    name: 'controls not an array is unmeasured',
    register: { controls: { id: 'not-an-array' } },
    expectUnmeasured: true,
  });
  cases.push({
    name: 'not vacuous: empty controls has zero hits',
    register: { controls: [] },
    expectFail: false,
  });

  const results = [];
  let failed = 0;
  for (const c of cases) {
    const got = evaluate(c.register);
    let ok;
    if (c.expectUnmeasured) {
      ok = Boolean(got.unmeasured);
    } else if (c.expectFail) {
      ok = !got.unmeasured && got.hits.length > 0;
    } else {
      ok = !got.unmeasured && got.hits.length === 0;
    }
    results.push({ name: c.name, ok, hits: got.hits, unmeasured: got.unmeasured });
    if (!ok) failed += 1;
  }

  // Counts-consistency cases. Each pairs a correct declaration with a wrong one, so the check is
  // shown able to pass AND able to refuse.
  const twoEnforced = {
    controls: [
      completeRow({ id: 'A', status: 'ENFORCED', derivationClass: 'presence-shaped' }),
      completeRow({ id: 'B', status: 'ENFORCED', derivationClass: 'presence-shaped' }),
    ],
  };
  const countCases = [
    { name: 'counts: a correct byStatus block passes', register: { ...twoEnforced, counts: { byStatus: { ENFORCED: 2 }, byDerivationClass: { 'presence-shaped': 2 }, controlsInFile: 2, nonEmptyBypass: 2, violationVerifiedNonNull: 0, gapsFiled: 0 } }, expectMismatch: false },
    { name: 'VIOLATION counts: an understated byStatus bucket is refused', register: { ...twoEnforced, counts: { byStatus: { ENFORCED: 1 }, byDerivationClass: { 'presence-shaped': 2 }, controlsInFile: 2, nonEmptyBypass: 2, violationVerifiedNonNull: 0, gapsFiled: 0 } }, expectMismatch: true },
    { name: 'VIOLATION counts: a wrong controlsInFile is refused', register: { ...twoEnforced, counts: { byStatus: { ENFORCED: 2 }, byDerivationClass: { 'presence-shaped': 2 }, controlsInFile: 5, nonEmptyBypass: 2, violationVerifiedNonNull: 0, gapsFiled: 0 } }, expectMismatch: true },
    { name: 'VIOLATION counts: a declared bucket absent from the rows is refused', register: { ...twoEnforced, counts: { byStatus: { ENFORCED: 2, STARVED: 1 }, byDerivationClass: { 'presence-shaped': 2 }, controlsInFile: 2, nonEmptyBypass: 2, violationVerifiedNonNull: 0, gapsFiled: 0 } }, expectMismatch: true },
    { name: 'counts: a missing derivable key is refused rather than implied', register: { ...twoEnforced, counts: { byStatus: { ENFORCED: 2 }, byDerivationClass: { 'presence-shaped': 2 } } }, expectMismatch: true },
    { name: 'counts: declaring STARVED 0 when no row carries it is a pass, not a mismatch', register: { ...twoEnforced, counts: { byStatus: { ENFORCED: 2, STARVED: 0 }, byDerivationClass: { 'presence-shaped': 2 }, controlsInFile: 2, nonEmptyBypass: 2, violationVerifiedNonNull: 0, gapsFiled: 0 } }, expectMismatch: false },
    // gapsFiled is the LENGTH of the top-level array, so a number that disagrees with the array is
    // a refusal. This is the case that would have caught the 2026-09-18 state: an extra gap written
    // into the array with the count beside it left alone.
    { name: 'counts: a correct gapsFiled passes', register: { ...twoEnforced, gapsFiled: ['a', 'b'], counts: { byStatus: { ENFORCED: 2 }, byDerivationClass: { 'presence-shaped': 2 }, controlsInFile: 2, nonEmptyBypass: 2, violationVerifiedNonNull: 0, gapsFiled: 2 } }, expectMismatch: false },
    { name: 'VIOLATION counts: gapsFiled disagreeing with the array length is refused', register: { ...twoEnforced, gapsFiled: ['a', 'b'], counts: { byStatus: { ENFORCED: 2 }, byDerivationClass: { 'presence-shaped': 2 }, controlsInFile: 2, nonEmptyBypass: 2, violationVerifiedNonNull: 0, gapsFiled: 1 } }, expectMismatch: true },
    { name: 'VIOLATION counts: gapsFiled claiming entries when the array is absent is refused', register: { ...twoEnforced, counts: { byStatus: { ENFORCED: 2 }, byDerivationClass: { 'presence-shaped': 2 }, controlsInFile: 2, nonEmptyBypass: 2, violationVerifiedNonNull: 0, gapsFiled: 4 } }, expectMismatch: true },
  ];
  for (const c of countCases) {
    const got = countsMismatches(c.register);
    const ok = c.expectMismatch ? got.length > 0 : got.length === 0;
    results.push({ name: c.name, ok, countsMismatches: got });
    if (!ok) failed += 1;
  }

  // A stated-but-unchecked count key must be REPORTED, not silently trusted.
  {
    const withStated = { controls: [], gapsFiled: [], counts: { controlsInFile: 0, nonEmptyBypass: 0, violationVerifiedNonNull: 0, gapsFiled: 0, productRepoControlsAnnex: 43, _purpose: 'underscore keys are documentation' } };
    const keys = nonDerivableCountKeys(withStated);
    const ok = keys.length === 1 && keys[0] === 'productRepoControlsAnnex';
    results.push({ name: 'counts: a non-derivable key is reported as stated-not-checked, and underscore keys are not', ok, keys });
    if (!ok) failed += 1;
  }

  return { failed, results };
}

function parseArgs(argv) {
  const out = { register: DEFAULT_REGISTER, selfTestOnly: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--register') out.register = resolve(argv[++i]);
    else if (a === '--self-test') out.selfTestOnly = true;
  }
  return out;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const fixture = selfTest();
  if (fixture.failed) {
    process.stderr.write(JSON.stringify({ control: 'tooling-register-schema', selfTest: fixture }, null, 2) + '\n');
    process.exit(2);
  }
  if (args.selfTestOnly) {
    process.stdout.write(
      JSON.stringify({ control: 'tooling-register-schema', selfTest: 'ok', cases: fixture.results.length }, null, 2) + '\n',
    );
    return;
  }

  if (!existsSync(args.register)) {
    console.error(`REFUSING: register not found at ${args.register}. Absent is not a pass.`);
    process.exit(2);
  }
  let data;
  try {
    data = JSON.parse(readFileSync(args.register, 'utf8'));
  } catch (err) {
    console.error(`REFUSING: register unparseable (${err.message || err})`);
    process.exit(2);
  }
  const got = evaluate(data);
  if (got.unmeasured) {
    console.error(`REFUSING: ${got.unmeasured}`);
    process.exit(2);
  }
  // Counts consistency. The declared counts block is recomputed from this file's own controls
  // array and refused on disagreement, because a hand-maintained count that nothing recomputes
  // is how this block came to declare 18 when the number was 34.
  const countHits = countsMismatches(data);
  const notDerived = nonDerivableCountKeys(data);
  const report = {
    control: 'tooling-register-schema',
    requiredFields: REQUIRED,
    executorMapsTo: 'consumer',
    rowCount: Array.isArray(data.controls) ? data.controls.length : 0,
    hits: got.hits,
    countsDeclaredNotDerived: notDerived,
    countsMismatches: countHits,
    selfTest: 'ok',
  };
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  if (notDerived.length) {
    process.stderr.write(`tooling-register-schema: DECLARED NOT CHECKED — ${notDerived.join(', ')} cannot be recomputed from this file. Stated, not verified.\n`);
  }
  if (got.hits.length || countHits.length) {
    process.stderr.write(`tooling-register-schema: ${got.hits.length} missing field(s), ${countHits.length} counts mismatch(es)\n`);
    process.exit(1);
  }
}

main();
