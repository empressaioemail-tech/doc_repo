#!/usr/bin/env node
/**
 * Proof-by-violation for SEAT-01. Does not mutate live trees.
 */
import { evaluate } from './seat-worktree-gate.mjs';
import { loadSeatRegister, liveSeatBranches, findByWorktree } from './seat-register.mjs';

const cases = [];
function check(name, got, expectedAllow, expectedCode) {
  const ok = got.allow === expectedAllow && got.code === expectedCode;
  cases.push({ name, ok, got: { allow: got.allow, code: got.code }, expected: { allow: expectedAllow, code: expectedCode } });
}

const register = loadSeatRegister();
if (register.seats.map((s) => s.name).join(',') !== 'property,markets,trading,systems') {
  cases.push({
    name: 'register loads four seats',
    ok: false,
    got: register.seats.map((s) => s.name),
    expected: ['property', 'markets', 'trading', 'systems'],
  });
} else {
  cases.push({ name: 'register loads four seats', ok: true, got: 'property,markets,trading,systems', expected: 'property,markets,trading,systems' });
}

const systemsWt = findByWorktree(register, 'P:/seat-worktrees/systems/doc_repo');
check(
  'systems worktree resolves',
  { allow: !!systemsWt && systemsWt.name === 'systems', code: systemsWt?.name || 'missing' },
  true,
  'systems',
);

check(
  'unregistered worktree refused',
  evaluate({ worktree: 'P:/not-a-seat/doc_repo', branch: 'main', paths: [] }),
  false,
  'unregistered_worktree',
);

check(
  'integration on main allowed for non-namespace path',
  evaluate({ worktree: 'P:/doc_repo', branch: 'main', paths: ['ENFORCEMENT.md'] }),
  true,
  'ok',
);

check(
  'integration cannot write foreign seat state',
  evaluate({ worktree: 'P:/doc_repo', branch: 'main', paths: ['_state/property/STATE.md'] }),
  false,
  'namespace_from_integration',
);

check(
  'systems worktree on wrong branch refused',
  evaluate({ worktree: 'P:/seat-worktrees/systems/doc_repo', branch: 'main', paths: [] }),
  false,
  'branch_mismatch',
);

check(
  'systems may write its namespace',
  evaluate({ worktree: 'P:/seat-worktrees/systems/doc_repo', branch: 'seat/systems', paths: ['_state/systems/STATE.md'] }),
  true,
  'ok',
);

check(
  'systems cannot write property namespace',
  evaluate({
    worktree: 'P:/seat-worktrees/systems/doc_repo',
    branch: 'seat/systems',
    paths: ['_state/property/STATE.md'],
  }),
  false,
  'foreign_namespace',
);

check(
  'property LDT worktree on seat/property allowed',
  evaluate({
    worktree: 'P:/seat-worktrees/property/legacy-design-tools',
    branch: 'seat/property',
    paths: ['artifacts/api-server/src/index.ts'],
    command: 'git add artifacts/api-server/src/index.ts',
  }),
  true,
  'ok',
);

check(
  'unknown worktree of LDT refused (shared checkout class)',
  evaluate({
    worktree: 'P:/legacy-design-tools',
    branch: 'main',
    paths: ['README.md'],
    command: 'git add README.md',
  }),
  false,
  'unregistered_worktree',
);

const live = liveSeatBranches(register);
const hasPropertyLdt = live.some(
  (b) => b.branch === 'seat/property' && /legacy-design-tools/i.test(b.repo),
);
check(
  'prune live set includes property LDT branch',
  { allow: hasPropertyLdt, code: hasPropertyLdt ? 'ok' : 'missing' },
  true,
  'ok',
);

const failed = cases.filter((c) => !c.ok);
console.log(JSON.stringify({ control: 'SEAT-01', allOk: failed.length === 0, cases }, null, 2));
process.exit(failed.length === 0 ? 0 : 1);
