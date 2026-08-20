#!/usr/bin/env node
/**
 * Proof-by-violation for bulkRules + named-row override.
 * Does not touch live branch_declarations.json.
 */
import { writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  loadBranchDeclarations,
  declarationStatus,
  bulkRuleMatches,
} from './branch-safety.mjs';

const dir = mkdtempSync(join(tmpdir(), 'bp01-decl-'));
const path = join(dir, 'branch_declarations.json');

const fixture = {
  _schemaVersion: 3,
  bulkRules: [
    {
      id: 'test-bulk',
      assertedBy: 'operator',
      assertedOn: '2026-08-19',
      repo: 'P:/legacy-design-tools',
      status: 'prune-safe',
      criteria: {
        tipBefore: '2026-08-01',
        worktreeAttached: false,
        excludeBranches: ['replit-incoming'],
      },
    },
  ],
  declarations: [
    {
      branch: 'replit-incoming',
      repo: 'P:/legacy-design-tools',
      status: 'unknown',
    },
    {
      branch: 'feat/g34-typed-absence',
      repo: 'P:/legacy-design-tools',
      status: 'unknown',
    },
  ],
};

writeFileSync(path, JSON.stringify(fixture));
const decls = loadBranchDeclarations(path);

const cases = [];

function check(name, got, expected) {
  cases.push({ name, ok: got === expected, got, expected });
}

const ldt = 'P:/legacy-design-tools';
const ctxPre = { worktreeAttached: false, lastCommitDate: '2026-07-15' };
const ctxAug = { worktreeAttached: false, lastCommitDate: '2026-08-08' };
const ctxWt = { worktreeAttached: true, lastCommitDate: '2026-07-15' };
const ctxNoDate = { worktreeAttached: false };

check('remainder matching bulk -> prune-safe', declarationStatus(decls, ldt, 'fix/qa-16-ifc-parse-worker', ctxPre), 'prune-safe');
check('named replit wins over bulk (would match date)', declarationStatus(decls, ldt, 'replit-incoming', ctxPre), 'unknown');
check('excludeBranches even without named row', bulkRuleMatches(fixture.bulkRules[0], ldt, 'replit-incoming', ctxPre), false);
check('august date does not match tipBefore', declarationStatus(decls, ldt, 'fix/statewide-ingest-blockers', ctxAug), 'undeclared');
check('named august unknown', declarationStatus(decls, ldt, 'feat/g34-typed-absence', ctxAug), 'unknown');
check('worktree attached does not match bulk', declarationStatus(decls, ldt, 'some/old-branch', ctxWt), 'undeclared');
check('missing tip date does not match bulk', declarationStatus(decls, ldt, 'some/old-branch', ctxNoDate), 'undeclared');
check('other repo undeclared', declarationStatus(decls, 'P:/hauska-engine', 'fix/qa-16-ifc-parse-worker', ctxPre), 'undeclared');
check('tip on cutoff date does not match', declarationStatus(decls, ldt, 'fix/pe-chat-jurisdiction-key-canonicalize', { worktreeAttached: false, lastCommitDate: '2026-08-01' }), 'undeclared');
check('registered seat branch is live without a named row', declarationStatus(decls, ldt, 'seat/property', ctxPre), 'live');

rmSync(dir, { recursive: true, force: true });

const failed = cases.filter((c) => !c.ok);
console.log(JSON.stringify({ allOk: failed.length === 0, cases }, null, 2));
process.exit(failed.length === 0 ? 0 : 1);
