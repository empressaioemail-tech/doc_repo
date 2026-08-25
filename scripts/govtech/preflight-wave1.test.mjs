#!/usr/bin/env node
/**
 * Tests predicate/parser logic for govtech Wave 1 preflight.
 * Run: node scripts/govtech/preflight-wave1.test.mjs
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parseUnestablishedSection,
  planRowDeclared,
  summarizeResults,
  formatSummaryTable,
  PROBES,
} from './preflight-wave1.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

const cases = [];
function assert(name, condition, detail = '') {
  cases.push({ name, ok: !!condition, detail });
}

const scopeFixture = `---
title: fixture
---

## What could not be established

- Whether \`HAUSKA_MCP_URL\` is set on the live dashboards service.
- What the \`city_packs\` table contains.
- Whether migrations 008 and 009 are applied.

## Wave 1 critical path
`;

assert(
  'parseUnestablishedSection extracts scope bullets',
  parseUnestablishedSection(scopeFixture, 'What could not be established').length === 3,
  'expected 3 bullets',
);

assert(
  'parseUnestablishedSection returns empty on missing heading',
  parseUnestablishedSection(scopeFixture, 'What I could not establish').length === 0,
);

const contractFixture = `## What I could not establish

Carried forward rather than guessed.

The contents of \`ICC_ACTOR_RECORD_FIXTURE.sourceLicensing\`.

Whether migration \`009\` is applied.

## OPEN
`;

assert(
  'parseUnestablishedSection extracts contract bullets',
  parseUnestablishedSection(contractFixture, 'What I could not establish').length === 2,
);

const planFixture = `
| G-105 | 1 | Deploy cut | B | probe | none | OPEN |
| G-106 | 1 | Smart Files | A | probe | G-105 | OPEN |

| A-085 | 2026-08-24 | **G-105 ADDED through G-110 ADDED.** |
`;

assert('planRowDeclared finds baseline G-105', planRowDeclared(planFixture, 'G-105', 'G'));
assert('planRowDeclared finds amendment-added G-110', planRowDeclared(planFixture, 'G-110', 'G'));
assert('planRowDeclared rejects fake G-9999', !planRowDeclared(planFixture, 'G-9999', 'G'));
assert('planRowDeclared rejects wrong prefix', !planRowDeclared(planFixture, 'P-105', 'G'));

const summaryPass = summarizeResults([
  { kind: 'runnable', pass: true },
  { kind: 'runnable', pass: true },
  { status: 'unmeasured', kind: 'unmeasured' },
  { status: 'pending', kind: 'runnable', pass: true },
]);
assert('summarizeResults exit 0 when no runnable failures', summaryPass.exitCode === 0);
assert('summarizeResults counts unmeasured', summaryPass.unmeasured === 1);

const summaryFail = summarizeResults([
  { kind: 'runnable', pass: false },
  { kind: 'runnable', pass: true },
]);
assert('summarizeResults exit 1 on runnable failure', summaryFail.exitCode === 1);
assert('summarizeResults failed count', summaryFail.failed === 1);

const table = formatSummaryTable([
  {
    id: 'SCOPE-01',
    kind: 'unmeasured',
    status: 'unmeasured',
    planRow: 'G-105',
    probe: 'HAUSKA_MCP_URL on dashboards',
  },
]);
assert('formatSummaryTable includes probe id', table.includes('SCOPE-01'));
assert('formatSummaryTable includes STATUS column', table.includes('STATUS'));

assert('PROBES catalog has scope + contract ids', PROBES.some((p) => p.id.startsWith('SCOPE-')));
assert('PROBES catalog has contract ids', PROBES.some((p) => p.id.startsWith('CONTRACT-')));
assert(
  'every unmeasured probe has passCriteria',
  PROBES.every((p) => p.kind !== 'unmeasured' || p.passCriteria),
);

const liveScope = readFileSync(
  join(ROOT, '_inbox/2026-08-24_govtech_program_scope.md'),
  'utf8',
);
const liveContract = readFileSync(
  join(ROOT, '_inbox/2026-08-24_govtech_transaction_contract.md'),
  'utf8',
);
const liveOps17 = readFileSync(
  join(ROOT, '90_operations/OPS-17_govtech_stack_plan_of_record.md'),
  'utf8',
);

assert(
  'live scope doc has >=6 unsettled bullets',
  parseUnestablishedSection(liveScope, 'What could not be established').length >= 6,
);
assert(
  'live contract has >=4 unsettled bullets',
  parseUnestablishedSection(liveContract, 'What I could not establish').length >= 4,
);
assert('live OPS-17 declares G-105', planRowDeclared(liveOps17, 'G-105', 'G'));

const failed = cases.filter((c) => !c.ok);
for (const c of cases) {
  const mark = c.ok ? 'PASS' : 'FAIL';
  console.log(`[${mark}] ${c.name}${c.detail ? ` — ${c.detail}` : ''}`);
}
console.log(`\n${cases.length - failed.length}/${cases.length} passed`);
process.exit(failed.length > 0 ? 1 : 0);
