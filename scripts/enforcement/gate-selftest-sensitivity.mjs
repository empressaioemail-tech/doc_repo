#!/usr/bin/env node
/**
 * Sensitivity proof for the gate self-tests — does "SELF-TEST OK" mean anything?
 *
 * WHY. Four gate libraries (`fan-depth-gate`, `traffic-lease-gate`, `plan-row-allocation-gate`,
 * `probe-close-gate`) each ship a both-direction self-test whose cases include ones explicitly
 * labelled "VIOLATION ... refused". A suite that passes is not evidence of anything until it has
 * been shown able to fail. `probe-close-gate --self-test` currently DOES fail (observed
 * 2026-09-18, on the OPS-24 registry-range drift), which shows the harness reports failure in
 * this codebase. This script closes the loop on the block LOGIC: it breaks one gate's refusal
 * predicate, runs that gate's own self-test, and requires the suite to go red, then restores the
 * file byte-identically (sha256 compared) and requires it to go green again.
 *
 * Scope, declared: only `fan-depth-gate.mjs` is mutated here. The other three are reported as
 * passing-without-mutation. That is a partial proof and is labelled as one.
 *
 * Invoked by hand; nothing runs this in CI. Exit 0 when the mutation was observed to break the
 * suite AND the restore was byte-identical and green.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

const ROOT = 'P:/doc_repo';
const TARGET = `${ROOT}/scripts/enforcement/fan-depth-gate.mjs`;
const sha = (s) => createHash('sha256').update(s).digest('hex');
const runSelfTest = () => {
  const r = spawnSync(process.execPath, [TARGET, '--self-test'], { encoding: 'utf8' });
  const out = (r.stdout || '') + (r.stderr || '');
  return { exit: r.status, fails: (out.match(/^FAIL/gm) || []).length };
};

const original = readFileSync(TARGET, 'utf8');
const before = sha(original);
// Line 64 `if (sa.maxDepth > depth)` is the LIVE refusal predicate. The first attempt used line 65
// `if (depth === 0 && sa.spawned > 0)`, which the script reported as a no-op — correctly, because
// line 65 is UNREACHABLE: if depth === 0 and spawned > 0 then either maxDepth === 0 (caught by the
// self-contradiction guard) or maxDepth >= 1 > depth (caught here). The script refusing to call a
// no-op a proof is the behaviour that makes it worth running.
const NEEDLE = 'if (sa.maxDepth > depth)';
if (!original.includes(NEEDLE)) {
  console.error(`REFUSING: needle not found in ${TARGET}. A mutation that does not land proves nothing.`);
  process.exit(2);
}

const baseline = runSelfTest();
const mutated = original.replace(NEEDLE, 'if (false && sa.maxDepth > depth)');
writeFileSync(TARGET, mutated, 'utf8');
const afterMutation = runSelfTest();

writeFileSync(TARGET, original, 'utf8');
const restored = readFileSync(TARGET, 'utf8');
const afterRestore = runSelfTest();

const byteIdentical = sha(restored) === before;
const rows = [
  { arm: 'baseline (unmutated)', exit: baseline.exit, fails: baseline.fails },
  { arm: 'depth-0 refusal predicate disabled', exit: afterMutation.exit, fails: afterMutation.fails },
  { arm: 'restored', exit: afterRestore.exit, fails: afterRestore.fails, byteIdentical },
];
console.log('\nfan-depth-gate self-test sensitivity\n');
for (const r of rows) console.log(`  ${r.arm.padEnd(38)} exit=${r.exit}  FAIL lines=${r.fails}${r.byteIdentical === undefined ? '' : `  byte-identical=${r.byteIdentical}`}`);

const ok = baseline.exit === 0 && afterMutation.exit === 1 && afterMutation.fails > 0 && byteIdentical && afterRestore.exit === 0;
console.log(`\nRESULT: ${ok ? 'the suite goes red on a broken refusal predicate and green after a byte-identical restore' : 'PROOF FAILED — the suite is not shown to be sensitive'}`);
process.exit(ok ? 0 : 1);
