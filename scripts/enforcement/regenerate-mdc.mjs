#!/usr/bin/env node
/**
 * Regenerate .cursor/rules/enforcement.mdc body from ENFORCEMENT.md.
 * C-00 then compares them. Do not edit the mdc body by hand.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const CANON = join(ROOT, 'ENFORCEMENT.md');
const MDC = join(ROOT, '.cursor/rules/enforcement.mdc');

const canon = readFileSync(CANON, 'utf8').replace(/\r\n/g, '\n');
const mdcRaw = readFileSync(MDC, 'utf8').replace(/\r\n/g, '\n');
const fm = mdcRaw.match(/^(---\n[\s\S]*?\n---\n)/);
if (!fm) {
  console.error('regenerate-mdc: enforcement.mdc missing frontmatter');
  process.exit(1);
}
writeFileSync(MDC, fm[1] + '\n' + canon.replace(/^\uFEFF/, ''), 'utf8');
console.log(JSON.stringify({ regenerated: '.cursor/rules/enforcement.mdc', from: 'ENFORCEMENT.md' }));
