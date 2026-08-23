#!/usr/bin/env node
/**
 * R-06 violation suite — file-based instrument for all three R-06 controls.
 *
 * Runs pass and fail argv for canon-divergence-check, tooling-register-schema,
 * and factory-termination against checked-in fixtures. Self-tests both directions:
 * embedded cases verify the suite detects pass/fail correctly; a wrong-expectation
 * case must fail the self-test.
 *
 * What executes: this file.
 * What triggers: manual, workflow_dispatch probe, or enforcement.yml when wired.
 * What fails: exit 2 if self-test fails or a spawn is unmeasured; exit 1 if any
 * control pass/fail pair misses expected exit or canon_divergence.md changes.
 * What bypasses: a harness that does not run this script; editing live _catalog/*
 * instead of fixtures (this suite uses fixtures only for fail paths).
 */
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const NODE = process.execPath;
const ENFORCEMENT_DIR = join(ROOT, 'scripts', 'enforcement');
const FIXTURES = join(ROOT, '_catalog', 'fixtures');
const CATALOG_DIVERGENCE = join(ROOT, '_catalog', 'canon_divergence.md');

const PATHS = {
  canonScript: join(ENFORCEMENT_DIR, 'canon-divergence-check.mjs'),
  toolingScript: join(ENFORCEMENT_DIR, 'tooling-register-schema.mjs'),
  factoryScript: join(ENFORCEMENT_DIR, 'factory-termination.mjs'),
  canonPassChecks: join(FIXTURES, 'r06-canon-checks.json'),
  canonFailChecks: join(FIXTURES, 'r06-canon-checks-violation.json'),
  canonBundle: join(FIXTURES, 'r06-canon-clone.bundle'),
  toolingPass: join(ROOT, '_catalog', 'tooling_register.json'),
  toolingFail: join(FIXTURES, 'r06-tooling-register-violation.json'),
  factoryPass: join(ROOT, '_catalog', 'parts_inventory.json'),
  factoryFail: join(FIXTURES, 'r06-factory-termination-violation.json'),
};

function catalogSha256() {
  if (!existsSync(CATALOG_DIVERGENCE)) return null;
  return createHash('sha256').update(readFileSync(CATALOG_DIVERGENCE)).digest('hex');
}

function spawnScript(scriptPath, args, inherit = false) {
  const run = spawnSync(NODE, [scriptPath, ...args], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: inherit ? 'inherit' : 'pipe',
  });
  if (run.error) {
    return { exit: null, error: run.error.message, stdout: '', stderr: '' };
  }
  return {
    exit: run.status,
    error: null,
    stdout: run.stdout || '',
    stderr: run.stderr || '',
  };
}

function runCase(name, scriptPath, args, expectExit) {
  const got = spawnScript(scriptPath, args);
  const ok = got.error === null && got.exit === expectExit;
  return {
    name,
    script: scriptPath,
    args,
    expectExit,
    actualExit: got.exit,
    unmeasured: got.error,
    ok,
  };
}

const CONTROL_CASES = [
  {
    control: 'canon-divergence',
    pass: {
      name: 'canon pass (fixture checks 2099)',
      script: PATHS.canonScript,
      args: ['--skip-live', '--checks', PATHS.canonPassChecks],
      expectExit: 0,
    },
    fail: {
      name: 'canon fail (fixture checks 2000)',
      script: PATHS.canonScript,
      args: ['--skip-live', '--checks', PATHS.canonFailChecks],
      expectExit: 1,
    },
    catalogSensitive: true,
  },
  {
    control: 'tooling-register-schema',
    pass: {
      name: 'tooling pass (live register)',
      script: PATHS.toolingScript,
      args: [],
      expectExit: 0,
    },
    fail: {
      name: 'tooling fail (INJECT-R06-MISS missing consumer)',
      script: PATHS.toolingScript,
      args: ['--register', PATHS.toolingFail],
      expectExit: 1,
    },
    selfTest: {
      name: 'tooling embedded self-test',
      script: PATHS.toolingScript,
      args: ['--self-test'],
      expectExit: 0,
    },
  },
  {
    control: 'factory-termination',
    pass: {
      name: 'factory pass (live inventory)',
      script: PATHS.factoryScript,
      args: [],
      expectExit: 0,
    },
    fail: {
      name: 'factory fail (inject-r06-factory-none)',
      script: PATHS.factoryScript,
      args: ['--inventory', PATHS.factoryFail],
      expectExit: 1,
    },
    selfTest: {
      name: 'factory embedded self-test',
      script: PATHS.factoryScript,
      args: ['--self-test'],
      expectExit: 0,
    },
  },
];

function requiredPaths() {
  const missing = [];
  for (const [key, path] of Object.entries(PATHS)) {
    if (!existsSync(path)) missing.push({ key, path });
  }
  return missing;
}

function runControlCases() {
  const results = [];
  const catalogBefore = catalogSha256();

  for (const block of CONTROL_CASES) {
    if (block.catalogSensitive) {
      const before = catalogSha256();
      results.push(runCase(block.pass.name, block.pass.script, block.pass.args, block.pass.expectExit));
      const mid = catalogSha256();
      results.push(runCase(block.fail.name, block.fail.script, block.fail.args, block.fail.expectExit));
      const after = catalogSha256();
      const catalogOk = before === mid && mid === after;
      results.push({
        name: 'canon_divergence.md unchanged across canon pass+fail',
        ok: catalogOk,
        expectExit: 'unchanged',
        actualExit: catalogOk ? 'unchanged' : `before=${before} after=${after}`,
        unmeasured: null,
      });
    } else {
      results.push(runCase(block.pass.name, block.pass.script, block.pass.args, block.pass.expectExit));
      results.push(runCase(block.fail.name, block.fail.script, block.fail.args, block.fail.expectExit));
    }
    if (block.selfTest) {
      results.push(
        runCase(block.selfTest.name, block.selfTest.script, block.selfTest.args, block.selfTest.expectExit),
      );
    }
  }

  const catalogAfter = catalogSha256();
  const catalogGlobalOk = catalogBefore === catalogAfter;
  if (!catalogGlobalOk) {
    results.push({
      name: 'canon_divergence.md unchanged after full suite',
      ok: false,
      expectExit: 'unchanged',
      actualExit: `before=${catalogBefore} after=${catalogAfter}`,
      unmeasured: null,
    });
  }

  return results;
}

function selfTest() {
  const results = [];
  let failed = 0;

  // Wrong expectation must fail detection.
  const vacuous = runCase('self: wrong expect fails', PATHS.toolingScript, ['--self-test'], 1);
  const detectorOk = !vacuous.ok;
  results.push({
    name: 'self: wrong expect is not ok',
    ok: detectorOk,
    expectExit: 'not-ok',
    actualExit: vacuous.ok ? 'incorrectly-ok' : 'not-ok',
    unmeasured: null,
  });
  if (!detectorOk) failed += 1;

  // Missing fixture path must yield unmeasured or non-zero from canon wrapper.
  const missingChecks = join(FIXTURES, 'r06-nonexistent-checks.json');
  const missing = runCase('self: missing checks refuses', PATHS.canonScript, ['--skip-live', '--checks', missingChecks], 2);
  const missingOk = missing.ok;
  results.push({ ...missing, name: 'self: missing checks exits 2' });
  if (!missingOk) failed += 1;

  // Pass fixture tooling row must not trip on live register path used in pass case.
  const toolingData = JSON.parse(readFileSync(PATHS.toolingPass, 'utf8'));
  const injectPresent = toolingData.controls?.some((r) => r.id === 'INJECT-R06-MISS');
  const injectAbsentOk = !injectPresent;
  results.push({
    name: 'self: live tooling register has no INJECT-R06-MISS',
    ok: injectAbsentOk,
    expectExit: 'absent',
    actualExit: injectPresent ? 'present' : 'absent',
    unmeasured: null,
  });
  if (!injectAbsentOk) failed += 1;

  // Violation factory fixture must list inject row and still ignore store NONE.
  const invData = JSON.parse(readFileSync(PATHS.factoryFail, 'utf8'));
  const injectFactory = invData.parts?.find((p) => p.name === 'inject-r06-factory-none');
  const storeNone = invData.parts?.find((p) => p.name === 'hauska_mcp.atoms' && p.kind === 'store');
  const factoryFixtureOk =
    injectFactory?.kind === 'factory' &&
    String(injectFactory?.terminationCondition).toUpperCase() === 'NONE' &&
    storeNone?.kind === 'store' &&
    String(storeNone?.terminationCondition).toUpperCase() === 'NONE';
  results.push({
    name: 'self: factory violation fixture shape',
    ok: factoryFixtureOk,
    expectExit: 'valid',
    actualExit: factoryFixtureOk ? 'valid' : 'invalid',
    unmeasured: null,
  });
  if (!factoryFixtureOk) failed += 1;

  return { failed, results };
}

function main() {
  const missing = requiredPaths();
  if (missing.length) {
    console.error(JSON.stringify({ control: 'r06-violation-suite', missing }, null, 2));
    process.exit(2);
  }

  const self = selfTest();
  if (self.failed) {
    process.stderr.write(JSON.stringify({ control: 'r06-violation-suite', selfTest: self }, null, 2) + '\n');
    process.exit(2);
  }

  const cases = runControlCases();
  const failed = cases.filter((c) => !c.ok);
  const report = {
    control: 'r06-violation-suite',
    snapshot: {
      repo: ROOT,
      branch: process.env.GIT_BRANCH || '(unknown)',
      commit: process.env.GIT_COMMIT || '(unknown)',
    },
    selfTest: { failed: self.failed, cases: self.results.length },
    controlCases: cases,
    failedCount: failed.length,
    passCount: cases.length - failed.length,
  };

  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  if (failed.length) {
    process.stderr.write(`r06-violation-suite: ${failed.length} case(s) failed\n`);
    for (const f of failed) {
      process.stderr.write(`  FAIL ${f.name}: expected exit ${f.expectExit}, got ${f.actualExit ?? f.unmeasured}\n`);
    }
    process.exit(1);
  }
}

main();
