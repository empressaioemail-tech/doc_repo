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
  const report = {
    control: 'tooling-register-schema',
    requiredFields: REQUIRED,
    executorMapsTo: 'consumer',
    rowCount: Array.isArray(data.controls) ? data.controls.length : 0,
    hits: got.hits,
    selfTest: 'ok',
  };
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  if (got.hits.length) {
    process.stderr.write(`tooling-register-schema: ${got.hits.length} missing field(s)\n`);
    process.exit(1);
  }
}

main();
