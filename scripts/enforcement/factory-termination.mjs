#!/usr/bin/env node
/**
 * BP-FACTORY-01 — factory termination detector.
 *
 * Fail on parts_inventory.json rows where kind === "factory" AND
 * terminationCondition is missing, empty, or NONE.
 *
 * Do NOT fail stores with NONE. hauska_mcp.atoms is a store, not a factory
 * off-ramp miss (R-05).
 *
 * What executes: this script.
 * What triggers: ci-baseline.mjs via .github/enforcement-baseline.json, on
 * push/PR/workflow_dispatch through .github/workflows/enforcement.yml.
 * What fails: exit 1 listing factory ids with blank/NONE termination.
 * Exit 2 if the inventory cannot be read or parts is not an array, or if
 * --self-test fails.
 * What bypasses: a harness that does not run this script; editing a store
 * row (stores are out of this contract); renaming kind away from factory.
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const DEFAULT_INVENTORY = join(ROOT, '_catalog', 'parts_inventory.json');

function isBlankTerm(t) {
  if (t === undefined || t === null) return true;
  const s = String(t).trim();
  return s === '' || s.toUpperCase() === 'NONE';
}

function evaluate(inventory) {
  if (!inventory || !Array.isArray(inventory.parts)) {
    return { unmeasured: 'parts is not an array', hits: [], storeNoneIgnored: [] };
  }
  const hits = [];
  const storeNoneIgnored = [];
  for (const p of inventory.parts) {
    const name = p && p.name ? String(p.name) : '(missing name)';
    const kind = p && p.kind ? String(p.kind) : '';
    if (kind === 'store' && isBlankTerm(p.terminationCondition)) {
      storeNoneIgnored.push(name);
      continue;
    }
    if (kind !== 'factory') continue;
    if (isBlankTerm(p.terminationCondition)) {
      hits.push({
        name,
        terminationCondition: p.terminationCondition === undefined ? '(missing)' : p.terminationCondition,
      });
    }
  }
  return { unmeasured: null, hits, storeNoneIgnored };
}

function selfTest() {
  const cases = [];
  cases.push({
    name: 'factory NONE fails',
    inventory: { parts: [{ name: 'bad-factory', kind: 'factory', terminationCondition: 'NONE' }] },
    expectFail: true,
  });
  cases.push({
    name: 'factory empty fails',
    inventory: { parts: [{ name: 'empty-factory', kind: 'factory', terminationCondition: '  ' }] },
    expectFail: true,
  });
  cases.push({
    name: 'factory missing term fails',
    inventory: { parts: [{ name: 'missing-term', kind: 'factory' }] },
    expectFail: true,
  });
  cases.push({
    name: 'store NONE plus real factory passes',
    inventory: {
      parts: [
        { name: 'good-factory', kind: 'factory', terminationCondition: 'named close artifact filed' },
        { name: 'hauska_mcp.atoms', kind: 'store', terminationCondition: 'NONE' },
      ],
    },
    expectFail: false,
    expectIgnored: ['hauska_mcp.atoms'],
  });
  cases.push({
    name: 'none lowercase factory fails',
    inventory: { parts: [{ name: 'lc', kind: 'factory', terminationCondition: 'none' }] },
    expectFail: true,
  });
  cases.push({
    name: 'parts not an array is unmeasured',
    inventory: { parts: { name: 'not-an-array' } },
    expectUnmeasured: true,
  });
  cases.push({
    name: 'not vacuous: empty parts has zero hits',
    inventory: { parts: [] },
    expectFail: false,
  });

  const results = [];
  let failed = 0;
  for (const c of cases) {
    const got = evaluate(c.inventory);
    let ok;
    if (c.expectUnmeasured) {
      ok = Boolean(got.unmeasured);
    } else if (c.expectFail) {
      ok = !got.unmeasured && got.hits.length > 0;
    } else {
      ok = !got.unmeasured && got.hits.length === 0;
      if (ok && c.expectIgnored) {
        ok = c.expectIgnored.every((n) => got.storeNoneIgnored.includes(n));
      }
    }
    results.push({
      name: c.name,
      ok,
      hits: got.hits,
      storeNoneIgnored: got.storeNoneIgnored,
      unmeasured: got.unmeasured,
    });
    if (!ok) failed += 1;
  }
  return { failed, results };
}

function parseArgs(argv) {
  const out = { inventory: DEFAULT_INVENTORY, selfTestOnly: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--inventory') out.inventory = resolve(argv[++i]);
    else if (a === '--self-test') out.selfTestOnly = true;
  }
  return out;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const fixture = selfTest();
  if (fixture.failed) {
    process.stderr.write(JSON.stringify({ control: 'factory-termination', selfTest: fixture }, null, 2) + '\n');
    process.exit(2);
  }
  if (args.selfTestOnly) {
    process.stdout.write(
      JSON.stringify({ control: 'factory-termination', selfTest: 'ok', cases: fixture.results.length }, null, 2) + '\n',
    );
    return;
  }

  if (!existsSync(args.inventory)) {
    console.error(`REFUSING: inventory not found at ${args.inventory}. Absent is not a pass.`);
    process.exit(2);
  }
  let data;
  try {
    data = JSON.parse(readFileSync(args.inventory, 'utf8'));
  } catch (err) {
    console.error(`REFUSING: inventory unparseable (${err.message || err})`);
    process.exit(2);
  }
  const got = evaluate(data);
  if (got.unmeasured) {
    console.error(`REFUSING: ${got.unmeasured}`);
    process.exit(2);
  }
  const report = {
    control: 'factory-termination',
    factoryHits: got.hits,
    storeNoneIgnored: got.storeNoneIgnored,
    selfTest: 'ok',
  };
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  if (got.hits.length) {
    process.stderr.write(`factory-termination: ${got.hits.length} factory row(s) with blank/NONE termination\n`);
    process.exit(1);
  }
}

main();
