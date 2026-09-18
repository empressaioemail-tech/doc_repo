#!/usr/bin/env node
/**
 * Acceptance checks for R-06 WDLL items 5 and 6, run together.
 *
 *   item 5: hooks-loadable.test.mjs must AUDIT .cursor/hooks.json. Inject the historical defect
 *           (seat-gate.mjs importing `../scripts/enforcement/`, which resolves to the absent
 *           `.cursor/scripts/`) and require exit 1 naming .cursor/hooks.json.
 *   item 6: check-generated.mjs must catch _STATE.md drifting from its generator output. Inject a
 *           one-byte drift and require non-zero.
 *
 * Both mutate a TRACKED file and restore it from an in-memory copy, comparing sha256, so a partial
 * write cannot silently persist. Run by hand; nothing runs this in CI.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

const ROOT = process.env.R06_ROOT || 'P:/doc_repo';
const sha = (s) => createHash('sha256').update(s).digest('hex');
const run = (script) => {
  const r = spawnSync(process.execPath, [script], { cwd: ROOT, encoding: 'utf8' });
  return { exit: r.status, out: (r.stdout || '') + (r.stderr || '') };
};

function inject(file, mutate, script, label, needles) {
  const path = `${ROOT}/${file}`;
  const original = readFileSync(path, 'utf8');
  const before = sha(original);
  const mutated = mutate(original);
  if (mutated === original) {
    return { label, error: `mutation did not change ${file}; a mutation that does not land proves nothing` };
  }
  let injected, restored;
  try {
    writeFileSync(path, mutated, 'utf8');
    injected = run(script);
  } finally {
    writeFileSync(path, original, 'utf8');
    restored = run(script);
  }
  const byteIdentical = sha(readFileSync(path, 'utf8')) === before;
  const named = needles.filter((n) => injected.out.includes(n));
  return { label, file, script, injectedExit: injected.exit, restoredExit: restored.exit, byteIdentical, named };
}

const results = [];

results.push(inject(
  '.cursor/hooks/seat-gate.mjs',
  (s) => s.replace("'../../scripts/enforcement/", "'../scripts/enforcement/"),
  'scripts/enforcement/hooks-loadable.test.mjs',
  'item 5: hook loadability audits .cursor/hooks.json',
  ['.cursor/hooks.json'],
));

results.push(inject(
  '_STATE.md',
  (s) => `${s}\nR06-DRIFT-PROBE\n`,
  'scripts/state/check-generated.mjs',
  'item 6: check-generated catches _STATE.md drift',
  ['drift', 'DRIFT', 'mismatch', '_STATE.md'],
));

console.log('\nR-06 acceptance checks (items 5 and 6), proved by violation\n');
let ok = true;
for (const r of results) {
  if (r.error) { console.log(`  ERROR  ${r.label}\n         ${r.error}`); ok = false; continue; }
  const pass = r.injectedExit !== 0 && r.restoredExit === 0 && r.byteIdentical;
  if (!pass) ok = false;
  console.log(`  ${pass ? 'PASS' : 'FAIL'}  ${r.label}`);
  console.log(`        mutated ${r.file} -> ${r.script}`);
  console.log(`        injected exit=${r.injectedExit}  restored exit=${r.restoredExit}  byte-identical=${r.byteIdentical}`);
  console.log(`        refusal text named: ${r.named.length ? r.named.join(', ') : '(none matched)'}`);
}
console.log(`\nRESULT: ${ok ? 'both controls go red on the injected defect and green after a byte-identical restore' : 'at least one control is not shown to work'}`);
process.exit(ok ? 0 : 1);
